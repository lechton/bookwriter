#!/usr/bin/env node
/* ============================================================
   diagnose-lecture.mjs — Algorithmic Diagnostic Tool
   ------------------------------------------------------------
   Provides objective indications (not blocking gates) on:
   1. Code block comment density & speech-bubble margin health
   2. Sentence length profiles & 20-word cap compliance
   3. Line width (>80 chars) & block height (>10 lines)
   4. Curriculum dependency keyword checks (e.g. useState before Q16)
   5. Ledger owners: every lesson that the principle map's Prerequisite
      and Preview rows name is named in the lecture, and no lecture-stage
      handout message for the lesson is still open

   Usage:
     node src/diagnose-lecture.mjs 02
     node src/diagnose-lecture.mjs all
     node src/diagnose-lecture.mjs 02 --audit --revised   (audited copy in 02-01-md-revised)
   ============================================================ */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { readMapFacts, readHandout, OWNER_RE } from './map-lib.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const rawLecBase = join(ROOT, args.includes('--revised') ? '02-01-md-revised' : '01-02-md-LECTURES');

const isAuditMode = args.includes('--audit') || args.includes('--tokens');

// Debut numbers come from the live bank so a new bank version cannot leave them stale.
const BANK_PATH = join(ROOT, 'questions', 'questions.md');
const BANK = existsSync(BANK_PATH) ? readFileSync(BANK_PATH, 'utf8') : '';
const debutOf = (tag) => {
	const m = BANK.match(new RegExp('^\\|\\s*(\\d+)\\s*\\|[^|]*\\|\\s*`#' + tag + '`', 'm'));
	return m ? parseInt(m[1], 10) : null;
};
const HOOK_DEBUTS = [['useState', debutOf('use_state')], ['useEffect', debutOf('use_effect')]];
let explicitVersion = null;
const versionIdx = args.findIndex((a) => a === '--version' || a === '-v');
if (versionIdx !== -1 && args[versionIdx + 1] && !args[versionIdx + 1].startsWith('-')) {
	explicitVersion = args[versionIdx + 1];
} else {
	const inlineVersion = args.find((a) => a.startsWith('--version=') || a.startsWith('-v='));
	if (inlineVersion) {
		explicitVersion = inlineVersion.split('=')[1];
	}
}

function findLatestVersionTag(baseDir) {
	if (!existsSync(baseDir)) return null;
	try {
		const entries = readdirSync(baseDir, { withFileTypes: true });
		const versionDirs = entries
			.filter((d) => d.isDirectory() && !d.name.startsWith('.') && /^v?\d+(\.\d+)*/i.test(d.name))
			.map((d) => d.name);
		if (versionDirs.length === 0) return null;
		versionDirs.sort((a, b) => {
			const parse = (s) => s.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
			const pa = parse(a);
			const pb = parse(b);
			for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
				const diff = (pa[i] || 0) - (pb[i] || 0);
				if (diff !== 0) return diff;
			}
			return a.localeCompare(b);
		});
		return versionDirs[versionDirs.length - 1];
	} catch (e) {
		return null;
	}
}

let targetLessonTag = null;
if (explicitVersion) {
	const compoundMatch = explicitVersion.match(/^v?(\d+(?:\.\d+)*)-v?(\d+)$/i);
	if (compoundMatch) {
		targetLessonTag = `v${compoundMatch[2]}`;
	} else {
		targetLessonTag = explicitVersion.startsWith('v') ? explicitVersion : `v${explicitVersion}`;
	}
}

const activeVersionTag = targetLessonTag || findLatestVersionTag(rawLecBase);
const LECTURES_DIR = activeVersionTag ? join(rawLecBase, activeVersionTag) : rawLecBase;

const targetArg = args.find((a, idx) => {
	if (a.startsWith('-')) return false;
	if (a === explicitVersion) return false;
	if (idx > 0 && (args[idx - 1] === '--version' || args[idx - 1] === '-v')) return false;
	if (a === activeVersionTag && !/^\d+$/.test(a)) return false;
	return true;
}) || '02';

function findFiles() {
	if (!existsSync(LECTURES_DIR)) return [];
	const all = readdirSync(LECTURES_DIR).filter(f => f.endsWith('.md') && !f.includes('-old'));
	if (targetArg === 'all') return all.sort();
	const match = all.filter(f => f.startsWith(targetArg.padStart(2, '0')) || f === targetArg);
	return match.length > 0 ? match : all.sort();
}

function diagnoseFile(filename) {
	const filePath = join(LECTURES_DIR, filename);
	const content = readFileSync(filePath, 'utf8');
	const lines = content.split('\n');

	console.log(`\n============================================================`);
	console.log(`DIAGNOSTIC REPORT: ${filename}`);
	console.log(`============================================================`);

	// 1. Code Block Inspection
	const codeBlocks = [];
	const summaryBlockComments = [];
	let inBlock = false;
	let inIgnoredBlock = false;
	let currentBlock = null;
	let currentSummaryType = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const match = line.match(/^`{3,}([a-z0-9_-]*)(.*)$/i);

		if (match) {
			const isClosing = /^`{3,}$/.test(line.trim());
			if (!inBlock && !inIgnoredBlock) {
				const lang = match[1].toLowerCase();
				if (!lang) continue;
				if (['components', 'files', 'component-code', 'html-figure'].includes(lang)) {
					inIgnoredBlock = true;
					continue;
				}
				const meta = match[2];
				if (meta.includes('right') || meta.includes('wrong')) {
					inIgnoredBlock = true;
					currentSummaryType = meta.includes('right') ? 'right (DO THIS)' : 'wrong (DO NOT DO THIS)';
					continue;
				}
				inBlock = true;
				const titleMatch = meta.match(/title="([^"]+)"/);
				currentBlock = {
					lang,
					title: titleMatch ? titleMatch[1] : lang || 'untitled',
					startLineNum: i + 1,
					lines: [],
					comments: 0,
				};
			} else if (inIgnoredBlock && isClosing) {
				inIgnoredBlock = false;
				currentSummaryType = null;
			} else if (inBlock && isClosing) {
				inBlock = false;
				codeBlocks.push(currentBlock);
				currentBlock = null;
			}
		} else if (inIgnoredBlock && currentSummaryType) {
			const trimmed = line.trim();
			if (trimmed.includes('//') || trimmed.includes('/*')) {
				summaryBlockComments.push({ lineNum: i + 1, text: trimmed, title: currentSummaryType });
			}
		} else if (inBlock) {
			currentBlock.lines.push(line);
			// Check for inline comment (//, <!--, or #) which build-lectures turns into speech bubbles
			const trimmed = line.trim();
			if (trimmed.length > 0) {
				if ((line.includes('//') && !line.includes('://')) || line.includes('<!--') || line.match(/#\s+\S+/)) {
					currentBlock.comments++;
				}
			}
		}
	}

	console.log(`\n--- 1. CODE BLOCK COMMENT DENSITY ---`);
	let totalCodeLines = 0;
	let totalComments = 0;
	let barrenBlocks = 0;

	for (const block of codeBlocks) {
		const lineCount = block.lines.length;
		const commentCount = block.comments;
		totalCodeLines += lineCount;
		totalComments += commentCount;
		const density = lineCount > 0 ? Math.round((commentCount / lineCount) * 100) : 0;
		let status = `${commentCount}/${lineCount} bubbles (${density}%)`;

		if (commentCount === 0 && lineCount >= 3) {
			barrenBlocks++;
			status += ` -> [NOTICE: Barren margin (0 comments)]`;
		} else if (lineCount > 10) {
			status += ` -> [FLAG: exceeds 10 lines]`;
		}

		console.log(`  * [Line ${String(block.startLineNum).padStart(3)}] ${block.title.padEnd(25)}: ${status}`);
	}

	const overallDensity = totalCodeLines > 0 ? Math.round((totalComments / totalCodeLines) * 100) : 0;
	console.log(`  Total: ${totalCodeLines} lines, ${totalComments} comments (${overallDensity}% overall density)`);
	if (barrenBlocks > 0) {
		console.log(`  \x1b[33m[INDICATION]\x1b[0m ${barrenBlocks} code block(s) have zero comments. Speech bubble margins in print will be empty!`);
	} else {
		console.log(`  \x1b[32m[INDICATION]\x1b[0m Code block comment distribution looks healthy.`);
	}

	// 2. Prose Sentence Length Profile
	console.log(`\n--- 2. PROSE SENTENCE LENGTH PROFILE ---`);
	const proseSentences = [];
	let inFence = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (line.startsWith('```')) {
			inFence = !inFence;
			continue;
		}
		if (inFence || line === '' || line.startsWith('#') || line.startsWith('|') || line.startsWith('> INTERVIEW QUESTION')) continue;

		// Extract prose text from paragraphs and alert cards
		let text = line;
		if (text.startsWith('> [!') || text.startsWith('>')) {
			text = text.replace(/^>\s*(\[!.*\])?/g, '').trim();
		}
		if (text === '') continue;

		// Split on sentence boundaries (period, question mark, exclamation mark followed by space or end)
		const rawSentences = text.split(/(?<=[.?!])\s+(?=[A-Z0-9"`(])/);
		for (const s of rawSentences) {
			const clean = s.trim().replace(/^[-*0-9.]+\s+/, '');
			if (clean.length > 5) {
				const words = clean.split(/\s+/).filter(w => w.length > 0);
				proseSentences.push({ text: clean, wordCount: words.length, lineNum: i + 1 });
			}
		}
	}

	const over20 = proseSentences.filter(s => s.wordCount > 20);
	const totalWords = proseSentences.reduce((sum, s) => sum + s.wordCount, 0);
	const avgWords = proseSentences.length > 0 ? Math.round(totalWords / proseSentences.length) : 0;
	const maxWords = proseSentences.reduce((max, s) => Math.max(max, s.wordCount), 0);

	console.log(`  Total Sentences: ${proseSentences.length}, Avg: ${avgWords} words, Max: ${maxWords} words`);
	if (over20.length > 0) {
		console.log(`  \x1b[33m[INDICATION]\x1b[0m ${over20.length} sentence(s) exceed 20 words:`);
		for (const s of over20.slice(0, 5)) {
			console.log(`    - [Line ${s.lineNum}] (${s.wordCount} words): "${s.text.slice(0, 75)}..."`);
		}
	} else {
		console.log(`  \x1b[32m[INDICATION]\x1b[0m 100% of sentences are within the 20-word ceiling.`);
	}

	// 3. Line Width Check (>80 chars in code blocks)
	const longLines = [];
	for (const block of codeBlocks) {
		for (let j = 0; j < block.lines.length; j++) {
			const l = block.lines[j];
			if (l.length > 80) {
				longLines.push({
					lineNum: block.startLineNum + 1 + j,
					len: l.length,
					text: l.trim(),
					title: block.title,
				});
			}
		}
	}
	if (longLines.length > 0) {
		console.log(`\n--- 3. CODE LINE WIDTH (>80 CHARS) ---`);
		console.log(`  \x1b[33m[INDICATION]\x1b[0m ${longLines.length} code line(s) exceed 80 characters:`);
		for (const item of longLines.slice(0, 5)) {
			console.log(`    - [Line ${item.lineNum}] (${item.len} chars) in ${item.title}: "${item.text.slice(0, 60)}..."`);
		}
	} else {
		console.log(`\n--- 3. CODE LINE WIDTH (>80 CHARS) ---`);
		console.log(`  \x1b[32m[INDICATION]\x1b[0m 100% of code lines are within 80 characters.`);
	}

	// 4. Code Comment & Target Invariant Audit
	console.log(`\n--- 4. CODE COMMENT & TARGET INVARIANT AUDIT ---`);
	let targetedCommentsCount = 0;
	let untargetedCommentsCount = 0;
	const overbroadTargets = [];
	const stackedCommentBlocks = [];
	const unanchoredComments = [];
	const orphanTokens = [];
	const malformedTildes = [];

	for (const block of codeBlocks) {
		let consecutiveComments = 0;
		let stackStartLine = null;

		for (let j = 0; j < block.lines.length; j++) {
			const l = block.lines[j];
			const lineNum = block.startLineNum + 1 + j;
			const trimmed = l.trim();
			const hasComment = (l.includes('//') && !l.includes('://')) || l.includes('<!--') || l.match(/#\s+\S+/);
			const tildeCount = (l.match(/~/g) || []).length;
			if (tildeCount % 2 !== 0) {
				malformedTildes.push({ lineNum, text: trimmed, title: block.title });
			}

			const tildeMatch = l.match(/~([^~]+)~/);
			if (tildeMatch && !hasComment) {
				orphanTokens.push({ lineNum, target: tildeMatch[1], title: block.title });
			}

			if (hasComment) {
				consecutiveComments++;
				if (consecutiveComments === 1) stackStartLine = lineNum;
				if (consecutiveComments >= 3 && j === block.lines.length - 1) {
					stackedCommentBlocks.push({ startLine: stackStartLine, endLine: lineNum, count: consecutiveComments, title: block.title });
				}

				if (tildeMatch) {
					targetedCommentsCount++;
					const target = tildeMatch[1];
					const isDataObject = /^\s*\{.*\}\s*$/.test(target.trim());
					const isOverbroad = (!isDataObject && target.length > 28) || (isDataObject && target.length > 60) || /^(?:const|let|var|function|return|import|export)\s/.test(target.trim()) || target.includes('_jsx(') || target.includes('_jsxs(');
					if (isOverbroad) {
						overbroadTargets.push({ lineNum, target: target.trim(), title: block.title });
					}
				} else {
					untargetedCommentsCount++;
					const codeText = l.replace(/\/\/.*$/, '').replace(/\/\*.*\*\/$/, '').trim();
					const isAllowedStructural = /^(?:(?:export\s+default\s+)?function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{|return\s*(?:\(\s*)?$|<\/[A-Za-z0-9_]+>\s*;?\s*$)/.test(codeText);
					if (!isAllowedStructural) {
						unanchoredComments.push({ lineNum, text: trimmed, title: block.title });
					}
				}
			} else {
				if (consecutiveComments >= 3) {
					stackedCommentBlocks.push({ startLine: stackStartLine, endLine: lineNum - 1, count: consecutiveComments, title: block.title });
				}
				consecutiveComments = 0;
				stackStartLine = null;
			}
		}
	}

	const principleLinesOver68 = [];
	const barrenPrincipleCards = [];
	let currentCard = null;
	let principleTargetedCount = 0;
	let principleUntargetedCount = 0;
	let inPrincipleCard = false;
	let currentPrinciple = 'Principle';

	const multilineCodeInContent = [];
	let consecutiveProseCodeLines = [];
	let inFencedBlock = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.startsWith('```')) {
			inFencedBlock = !inFencedBlock;
			consecutiveProseCodeLines = [];
			continue;
		}
		if (inFencedBlock) continue;

		// Audit content outside fences and outside callouts
		if (!line.startsWith('>')) {
			const trimmed = line.trim();
			const isCardHeader = /^\s*\*(?:It is best practice to do this|Instead of doing this|We should do this|We should not do this|Do This|Do Not Do This):\*/i.test(trimmed);
			const isBacktickLine = /^`[^`]+`$/.test(trimmed);

			if (isCardHeader) {
				multilineCodeInContent.push({ lineNum: i + 1, type: 'UNQUOTED_CARD_HEADER', text: trimmed });
			}
			if (isBacktickLine) {
				consecutiveProseCodeLines.push({ lineNum: i + 1, text: trimmed });
				if (consecutiveProseCodeLines.length === 2) {
					multilineCodeInContent.push({
						lineNum: consecutiveProseCodeLines[0].lineNum,
						type: 'CONSECUTIVE_BACKTICK_LINES',
						text: `Multi-line code passed as simple text starting at line ${consecutiveProseCodeLines[0].lineNum}`
					});
				}
			} else if (trimmed.length > 0) {
				consecutiveProseCodeLines = [];
			}
		} else {
			consecutiveProseCodeLines = [];
		}

		if (line.startsWith('> **Principle')) {
			const pMatch = line.match(/>\s*\*\*(Principle\s*\d+[^:*]*)/);
			if (pMatch) currentPrinciple = pMatch[1].trim();
		}
		const cardHeaderMatch = line.match(/>\s*\*(?:It is best practice to do this|Instead of doing this|We should do this|We should not do this|To impress the interviewer|WRONG|DO THIS|DO NOT DO THIS):\*/i);
		if (cardHeaderMatch) {
			if (currentCard && currentCard.lines > 0 && currentCard.comments === 0) {
				barrenPrincipleCards.push(currentCard);
			}
			currentCard = { title: currentPrinciple, header: cardHeaderMatch[0], lineNum: i + 1, lines: 0, comments: 0 };
			inPrincipleCard = true;
			continue;
		}
		if (inPrincipleCard) {
			if (!line.startsWith('>')) {
				if (currentCard && currentCard.lines > 0 && currentCard.comments === 0) {
					barrenPrincipleCards.push(currentCard);
				}
				currentCard = null;
				inPrincipleCard = false;
				continue;
			}
			const trimmed = line.trim();
			if (trimmed === '>') continue;
			if (line.includes('```')) {
				if (currentCard && currentCard.lines > 0 && currentCard.comments === 0) {
					barrenPrincipleCards.push(currentCard);
				}
				currentCard = null;
				inPrincipleCard = false;
				continue;
			}
			let raw = line.replace(/^>\s?/, '');
			const backtickMatch = raw.match(/^(\s*)`([\s\S]*)`(\s*)$/);
			if (backtickMatch) raw = backtickMatch[1] + backtickMatch[2] + backtickMatch[3];
			if (currentCard) currentCard.lines++;
			const codeOnly = raw.replace(/\s*\/\/.*$/, '').replace(/\s*\/\*.*\*\/$/, '').trim();
			if (codeOnly.length > 68) {
				principleLinesOver68.push({ lineNum: i + 1, len: codeOnly.length, text: codeOnly, principle: currentPrinciple });
			}
			if (raw.includes('//') || raw.includes('/*')) {
				if (currentCard) currentCard.comments++;
				const tildeMatch = raw.match(/~([^~]+)~/);
				if (tildeMatch) {
					principleTargetedCount++;
					const target = tildeMatch[1];
					const isDataObject = /^\s*\{.*\}\s*$/.test(target.trim());
					const isOverbroad = (!isDataObject && target.length > 28) || (isDataObject && target.length > 60) || /^(?:const|let|var|function|return|import|export)\s/.test(target.trim());
					if (isOverbroad) {
						overbroadTargets.push({ lineNum: i + 1, target: target.trim(), title: currentPrinciple });
					}
				} else {
					principleUntargetedCount++;
					const isAllowedStructural = /^(?:(?:export\s+default\s+)?function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{|return\s*(?:\(\s*)?$|<\/[A-Za-z0-9_]+>\s*;?\s*$)/.test(codeOnly);
					if (!isAllowedStructural) {
						unanchoredComments.push({ lineNum: i + 1, text: raw.trim(), title: currentPrinciple });
					}
				}
			}
		}
	}
	if (currentCard && currentCard.lines > 0 && currentCard.comments === 0) {
		barrenPrincipleCards.push(currentCard);
	}

	console.log(`  Comment Targeting: ${targetedCommentsCount} targeted (~token~), ${untargetedCommentsCount} general lines without tildes.`);

	// 5. Deterministic Code Block Heuristic Gate
	console.log(`\n============================================================`);
	console.log(`--- 5. DETERMINISTIC CODE BLOCK HEURISTIC GATE (${isAuditMode ? 'PHASE 2 AUDIT MODE' : 'PHASE 1 DRAFT MODE'}) ---`);
	console.log(`============================================================`);
	let gateFailures = 0;

	if (isAuditMode) {
		if (unanchoredComments.length > 0) {
			gateFailures++;
			console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 1: UNANCHORED_COMMENT (${unanchoredComments.length} occurrence(s) with comment but no ~token~ anchor):`);
			for (const item of unanchoredComments) {
				console.log(`    - [Line ${item.lineNum}] in ${item.title}: "${item.text}"`);
			}
		} else {
			console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 1: Token and comment pairing (0 unanchored comments)`);
		}

		if (orphanTokens.length > 0) {
			gateFailures++;
			console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 2: ORPHAN_TOKEN (${orphanTokens.length} occurrence(s) with ~token~ but no speech bubble comment):`);
			for (const item of orphanTokens) {
				console.log(`    - [Line ${item.lineNum}] in ${item.title}: "~${item.target}~"`);
			}
		} else {
			console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 2: Zero orphan tokens`);
		}

		if (malformedTildes.length > 0) {
			gateFailures++;
			console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 3: UNCLOSED_OR_MALFORMED_TILDE (${malformedTildes.length} line(s) with odd tilde count):`);
			for (const item of malformedTildes) {
				console.log(`    - [Line ${item.lineNum}] in ${item.title}: "${item.text}"`);
			}
		} else {
			console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 3: Tilde syntax parity (even pairs)`);
		}
	} else {
		console.log(`  \x1b[36m[DRAFT PASS]\x1b[0m Invariants 1–3: Token targeting verification deferred to Phase 2 (run with --audit).`);
	}

	const barrenBlockList = codeBlocks.filter(b => b.lines.length >= 3 && b.comments === 0);
	if (barrenBlockList.length > 0) {
		gateFailures++;
		console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 4: BARREN_CODE_BLOCK (${barrenBlockList.length} titled block(s) with 0 speech bubbles):`);
		for (const b of barrenBlockList) {
			console.log(`    - [Line ${b.startLineNum}] ${b.title}`);
		}
	} else {
		console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 4: Universal block density (0 barren blocks)`);
	}

	if (barrenPrincipleCards.length > 0) {
		gateFailures++;
		console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 5: BARREN_PRINCIPLE_CARD (${barrenPrincipleCards.length} card(s) with 0 speech bubbles):`);
		for (const c of barrenPrincipleCards) {
			console.log(`    - [Line ${c.lineNum}] in ${c.title}: "${c.header}"`);
		}
	} else {
		console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 5: Mandatory principle card bubbles (all cards carry speech bubbles)`);
	}

	if (summaryBlockComments.length > 0) {
		gateFailures++;
		console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 6: SUMMARY_BLOCK_HAS_COMMENT (${summaryBlockComments.length} comment(s) inside right/wrong blocks):`);
		for (const s of summaryBlockComments) {
			console.log(`    - [Line ${s.lineNum}] in ${s.title}: "${s.text}"`);
		}
	} else {
		console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 6: Strict summary block quarantine (100% comment-free)`);
	}

	if (stackedCommentBlocks.length > 0) {
		gateFailures++;
		console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 7: CONSECUTIVE_BUBBLE_STACK (${stackedCommentBlocks.length} block(s) with 3+ stacked bubbles):`);
		for (const b of stackedCommentBlocks) {
			console.log(`    - [Lines ${b.startLine}-${b.endLine}] in ${b.title}`);
		}
	} else {
		console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 7: Bubble stacking spacing (healthy breathing room)`);
	}

	const hasWidthViolations = overbroadTargets.length > 0 || principleLinesOver68.length > 0 || longLines.length > 0;
	if (hasWidthViolations) {
		gateFailures++;
		console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 8: SCOPE_AND_WIDTH_BOUNDARIES:`);
		if (overbroadTargets.length > 0) console.log(`    - ${overbroadTargets.length} overbroad target token(s)`);
		if (principleLinesOver68.length > 0) console.log(`    - ${principleLinesOver68.length} principle line(s) > 68 chars`);
		if (longLines.length > 0) console.log(`    - ${longLines.length} code line(s) > 80 chars`);
	} else {
		console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 8: Scope and width boundaries (<28 chars token, <=80/68 chars line)`);
	}

	if (multilineCodeInContent.length > 0) {
		gateFailures++;
		console.log(`  \x1b[31m[FAIL]\x1b[0m Invariant 9: MULTILINE_CODE_AS_CONTENT (${multilineCodeInContent.length} raw code block(s) passed as simple prose text):`);
		for (const m of multilineCodeInContent) {
			console.log(`    - [Line ${m.lineNum}] ${m.type}: "${m.text}"`);
		}
	} else {
		console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 9: Zero multi-line code in content (all multi-line code in fences or callouts)`);
	}

	// 6. Curriculum Dependency Keyword Check
	const qNumMatch = filename.match(/^(\d+)/);
	const qNum = qNumMatch ? parseInt(qNumMatch[1], 10) : 999;
	console.log(`\n--- 6. CURRICULUM DEPENDENCY AUDIT (Q${qNum}) ---`);

	const prematureHooks = [];
	for (const [hook, debut] of HOOK_DEBUTS) {
		if (debut && qNum < debut && content.includes(hook)) prematureHooks.push(`${hook} (debuts Q${debut})`);
	}

	if (prematureHooks.length > 0) {
		console.log(`  \x1b[31m[RED FLAG]\x1b[0m Premature hooks detected: ${prematureHooks.join(', ')}`);
	} else {
		console.log(`  \x1b[32m[INDICATION]\x1b[0m Zero premature hooks detected.`);
	}

	// 7. Ledger owners and open handout messages
	console.log(`\n--- 7. LEDGER OWNERS AND HANDOUTS (Q${qNum}) ---`);
	const facts = readMapFacts(qNum);
	if (!facts) {
		console.log(`  \x1b[33m[INDICATION]\x1b[0m No principle map for Q${qNum}; ledger owners not checked.`);
	} else {
		const unnamed = new Map();
		for (const [candidate, , disposition, owner] of facts.ledger) {
			if (disposition !== 'Prerequisite' && disposition !== 'Preview') continue;
			const m = owner.match(OWNER_RE);
			if (!m) continue;
			const n = parseInt(m[1], 10);
			if (new RegExp(`\\b(Lecture|Lesson)s? 0?${n}\\b`).test(content)) continue;
			if (!unnamed.has(n)) unnamed.set(n, []);
			unnamed.get(n).push(`${disposition}: ${candidate}`);
		}
		if (unnamed.size) {
			console.log(`  \x1b[31m[RED FLAG]\x1b[0m ${unnamed.size} owner lesson(s) from the map's ledger are never named as "Lecture N":`);
			for (const [n, rows] of [...unnamed].sort((a, b) => a[0] - b[0])) {
				console.log(`    - Lecture ${n}:`);
				for (const r of rows) console.log(`        ${r.slice(0, 110)}`);
			}
		} else {
			console.log(`  \x1b[32m[INDICATION]\x1b[0m Every Prerequisite and Preview owner is named.`);
		}
	}
	let openLecture = [];
	try {
		openLecture = readHandout(qNum).messages.filter((m) => m.status === 'open' && m.stage === 'lecture');
	} catch (e) {
		console.log(`  \x1b[31m[RED FLAG]\x1b[0m handouts/${String(qNum).padStart(2, '0')}.json cannot be read: ${e.message}`);
	}
	if (openLecture.length) {
		console.log(`  \x1b[31m[RED FLAG]\x1b[0m ${openLecture.length} open lecture message(s) in the handout: ${openLecture.map((m) => m.id).join(', ')}`);
	} else {
		console.log(`  \x1b[32m[INDICATION]\x1b[0m No open lecture messages in the handout.`);
	}

	console.log(`------------------------------------------------------------\n`);
	return gateFailures;
}

const files = findFiles();
if (files.length === 0) {
	console.error('No lecture files found to diagnose.');
	process.exit(1);
}

let totalFailures = 0;
for (const file of files) {
	totalFailures += diagnoseFile(file);
}
if (totalFailures > 0) {
	console.error(`\x1b[31m[GATE FAILED]\x1b[0m ${totalFailures} deterministic invariant failure(s) detected.`);
	process.exit(1);
}
