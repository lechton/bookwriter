#!/usr/bin/env node
/* ============================================================
   diagnose-lecture.mjs — Algorithmic Diagnostic Tool
   ------------------------------------------------------------
   Provides objective indications (not blocking gates) on:
   1. Code block comment density & speech-bubble margin health
   2. Sentence length profiles & 20-word cap compliance
   3. Line width (>80 chars) & block height (>10 lines)
   4. Curriculum dependency keyword checks (e.g. useState before Q16)

   Usage:
     node src/diagnose-lecture.mjs 02
     node src/diagnose-lecture.mjs all
   ============================================================ */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const LECTURES_DIR = join(ROOT, '01-02-md-LECTURES');

const targetArg = process.argv[2] || '02';

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
	let inBlock = false;
	let inIgnoredBlock = false;
	let currentBlock = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const match = line.match(/^```([a-z0-9_-]*)(.*)$/i);

		if (match) {
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
			} else if (inIgnoredBlock && line.trim() === '```') {
				inIgnoredBlock = false;
			} else if (inBlock && line.trim() === '```') {
				inBlock = false;
				codeBlocks.push(currentBlock);
				currentBlock = null;
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

	// 4. Curriculum Dependency Keyword Check
	const qNumMatch = filename.match(/^(\d+)/);
	const qNum = qNumMatch ? parseInt(qNumMatch[1], 10) : 999;
	console.log(`\n--- 4. CURRICULUM DEPENDENCY AUDIT (Q${qNum}) ---`);

	const prematureHooks = [];
	if (qNum < 16 && content.includes('useState')) prematureHooks.push('useState (debuts Q16)');
	if (qNum < 35 && content.includes('useEffect')) prematureHooks.push('useEffect (debuts Q35)');

	if (prematureHooks.length > 0) {
		console.log(`  \x1b[31m[RED FLAG]\x1b[0m Premature hooks detected: ${prematureHooks.join(', ')}`);
	} else {
		console.log(`  \x1b[32m[INDICATION]\x1b[0m Zero premature hooks detected.`);
	}

	console.log(`------------------------------------------------------------\n`);
}

const files = findFiles();
if (files.length === 0) {
	console.error('No lecture files found to diagnose.');
	process.exit(1);
}

for (const file of files) {
	diagnoseFile(file);
}
