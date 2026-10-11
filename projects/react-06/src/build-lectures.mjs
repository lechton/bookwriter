#!/usr/bin/env node
/* ============================================================
   build-lectures.mjs — lecture pipeline: 01-02-md-LECTURES -> html -> pdf
   ------------------------------------------------------------
   Reads 01-02-md-LECTURES/*.md, writes 01-03-md-lectures-HTML/*.html plus the
   combined course reader (one HTML file per theme, named after the
   pipeline's deck file name), then renders each to 01-04-md-lectures-PDF/
   via Prince.

   Usage (run from this project folder):
     node src/build-lectures.mjs            # build html + pdf
     node src/build-lectures.mjs --no-pdf   # build html only

   Markdown support (full formatting, long-form article):
     # Title                           h1
     ## Section                        h2
     ### Subsection                    h3
     **bold** / *italic*               inline emphasis
     `code`                            inline code
    ```lang title="File.jsx"          fenced code block with optional title
    ```components title="..."         generated component explorer panel
     - item                            bullet list
     1. item                           numbered list
     > quote                           blockquote
     [text](url)                       inline link
     everything else                   paragraphs (one line each, never hard-wrapped)
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, relative } from 'node:path';
import { renderComponentExplorer } from './component-explorer.mjs';
import { renderFileExplorer } from './file-explorer.mjs';
import { renderComponentCodeExplorer } from './component-code-explorer.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const withPdf = !args.includes('--no-pdf');
const rangeIdx = args.indexOf('--range');
const rangeArg = rangeIdx !== -1 ? args[rangeIdx + 1] : null;
const deckOnly = args.includes('--deck-only');
const compactPrinciples = args.includes('--compact-principles') || args.includes('--legacy-principles');

// Version detection: by default target the latest version directory (e.g. v1, v2)
// inside 01-02-md-LECTURES, 01-03-md-lectures-HTML, and 01-04-md-lectures-PDF.
// A specific version can be requested via --version <ver>, --version=<ver>, or -v <ver>.
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

function resolveSkillsVersion(projectRoot) {
	const skillsBase = join(projectRoot, 'skills');
	if (existsSync(skillsBase)) {
		try {
			const subdirs = readdirSync(skillsBase, { withFileTypes: true })
				.filter((d) => d.isDirectory() && !d.name.startsWith('.'))
				.map((d) => d.name);
			const versionDirs = subdirs.filter((name) => /^v?\d+(\.\d+)*/i.test(name));
			if (versionDirs.length > 0) {
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
				const latest = versionDirs[versionDirs.length - 1];
				const raw = latest.replace(/^v/i, '');
				return {
					dir: join(skillsBase, latest),
					folderName: latest,
					edition: raw,
					fullVersion: `v${raw}`,
					relativePath: `skills/${latest}`
				};
			}
		} catch (e) { /* ignore */ }
	}
	return {
		dir: existsSync(skillsBase) ? skillsBase : join(projectRoot, 'skills'),
		folderName: 'v6.0',
		edition: '6.0',
		fullVersion: 'v6.0',
		relativePath: 'skills'
	};
}

const skillsInfo = resolveSkillsVersion(ROOT);

const rawLecBase = existsSync(join(ROOT, '01-02-md-LECTURES')) ? join(ROOT, '01-02-md-LECTURES') : join(ROOT, 'md-lectures');
const rawHtmlBase = existsSync(join(ROOT, '01-03-md-lectures-HTML')) ? join(ROOT, '01-03-md-lectures-HTML') : join(ROOT, 'md-lectures-html');
const rawPdfBase = existsSync(join(ROOT, '01-04-md-lectures-PDF')) ? join(ROOT, '01-04-md-lectures-PDF') : join(ROOT, 'md-lectures-pdf');

// Compound version resolution: highest version in skills AND highest version in lesson md files.
// E.g., highest skills v6.2 + highest lesson v2 = v6.2-2 (reflected in decks as "React v6.2-2 Q01-Q13*.pdf").
function resolveCompoundVersion(skillsVer, lessonTag) {
	const s = skillsVer.startsWith('v') ? skillsVer : `v${skillsVer}`;
	const l = (lessonTag || 'v1').replace(/^v/i, '') || '1';
	return `${s}-${l}`;
}

let targetSkillsVersion = skillsInfo.fullVersion;
let targetLessonTag = null;
if (explicitVersion) {
	const compoundMatch = explicitVersion.match(/^v?(\d+(?:\.\d+)*)-v?(\d+)$/i);
	if (compoundMatch) {
		targetSkillsVersion = `v${compoundMatch[1]}`;
		targetLessonTag = `v${compoundMatch[2]}`;
	} else {
		targetLessonTag = explicitVersion.startsWith('v') ? explicitVersion : `v${explicitVersion}`;
	}
}

const activeVersionTag = targetLessonTag || findLatestVersionTag(rawLecBase);
const compoundVersion = resolveCompoundVersion(targetSkillsVersion, activeVersionTag);

const rawRevisedLecBase = existsSync(join(ROOT, '02-01-md-revised')) ? join(ROOT, '02-01-md-revised') : join(ROOT, 'md-lectures-revised');
const rawRevisedHtmlBase = existsSync(join(ROOT, '02-02-md-revised-html')) ? join(ROOT, '02-02-md-revised-html') : join(ROOT, 'md-lectures-revised-html');
const rawRevisedPdfBase = existsSync(join(ROOT, '02-03-md-revised-pdf')) ? join(ROOT, '02-03-md-revised-pdf') : join(ROOT, 'md-lectures-revised-pdf');
const activeRevisedVersionTag = targetLessonTag || findLatestVersionTag(rawRevisedLecBase);

const dirs = {
	mdLectures: activeVersionTag ? join(rawLecBase, activeVersionTag) : rawLecBase,
	html: activeVersionTag ? join(rawHtmlBase, activeVersionTag) : rawHtmlBase,
	pdf: activeVersionTag ? join(rawPdfBase, activeVersionTag) : rawPdfBase,
	// Raw base directory (for figure resolution fallback)
	mdLecturesBase: rawLecBase,
	// Review experiment directories
	mdLecturesReview: join(ROOT, 'md-lectures-review'),
	htmlReview: join(ROOT, 'md-lectures-review-html'),
	pdfReview: join(ROOT, 'md-lectures-review-pdf'),
	// Data-flow pipeline directories (ElectroShop architectural placement)
	mdDataFlow: join(ROOT, 'md-data-flow'),
	htmlDataFlow: join(ROOT, 'md-data-flow-html'),
	pdfDataFlow: join(ROOT, 'md-data-flow-pdf'),
	// Revised lectures pipeline
	mdLecturesRevised: activeRevisedVersionTag ? join(rawRevisedLecBase, activeRevisedVersionTag) : rawRevisedLecBase,
	htmlRevised: activeRevisedVersionTag ? join(rawRevisedHtmlBase, activeRevisedVersionTag) : rawRevisedHtmlBase,
	pdfRevised: activeRevisedVersionTag ? join(rawRevisedPdfBase, activeRevisedVersionTag) : rawRevisedPdfBase,
};

if (activeVersionTag) {
	console.log(`[pipeline] Default version: ${compoundVersion} (skills: ${targetSkillsVersion}, lessons: ${activeVersionTag} at ${dirs.mdLectures})`);
}

// HTML figures are numbered Fig {lecture}.{n} per lecture; reset for each file.
const figState = { lecture: '0', n: 0 };

/* ---------------- interview question (parsed from lecture source) ---------------- */

// The interview question is embedded in the lecture markdown as line 2, immediately
// after the `# Lecture N: Title` line, in the exact form:
//   > INTERVIEW QUESTION | <question text>
// This function extracts the question text from that line and returns the pull-quote
// callout HTML. If the line is missing or malformed, returns '' (no callout).
function calloutHTML(mdSource) {
	const lines = mdSource.split('\n');
	// Line 0 is the title (# Lecture N: ...). Line 1 is the question blockquote.
	// Allow a small tolerance: scan the first 5 lines for the pattern.
	for (let i = 0; i < Math.min(lines.length, 5); i++) {
		const m = lines[i].match(/^>\s*INTERVIEW QUESTION\s*\|\s*(?:(❱+\s*[A-Z]+(?:\s*\(Server\))?)\s*\|\s*)?(.+?)\s*$/i);
		if (m) {
			const typology = m[1];
			const question = m[2];
			
			let hook = '';
			for (let j = i + 1; j < lines.length; j++) {
				if (lines[j].trim() === '') continue; // skip blank lines
				// A Hook Ladder beat is never the box hook: in the ladder format
				// there is no hook line, the box shows the question alone.
				if (/^\d+\.\s/.test(lines[j].trim()) || lines[j].trim().startsWith('- ')) break;
				// If it's a heading or blockquote or code block, we probably went too far.
				if (lines[j].startsWith('#') || lines[j].startsWith('>')) break;
				hook = lines[j];
				break;
			}
			
			let html = `<aside class="interview-question">\n  <div class="iq-header">\n    <p class="iq-eyebrow">Interview Question</p>\n`;
			if (typology) {
				// Replace the ❱ character with a clean inline SVG so PrinceXML doesn't drop the glyph
				const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 1px;"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
				const safeTypology = inline(typology).replace(/❱/g, svgIcon);
				html += `    <span class="iq-typology">${safeTypology}</span>\n`;
			}
			html += `  </div>\n  <p class="iq-text">${inline(question)}</p>\n`;
			
			if (hook) {
				html += `  <div class="iq-hook">${inline(hook)}</div>\n`;
			}
			html += `</aside>\n`;
			return html;
		}
	}
	return '';
}

// Strip the interview-question line and the following hook line from the markdown body
// so they don't render a second time.
function stripQuestionLine(mdSource) {
	const lines = mdSource.split('\n');
	let out = [];
	let foundQ = false;
	let strippedHook = false;
	
	for (let i = 0; i < lines.length; i++) {
		if (!foundQ && /^>\s*INTERVIEW QUESTION\s*\|/i.test(lines[i])) {
			foundQ = true;
			continue; // strip the question line
		}
		if (foundQ && !strippedHook) {
			if (lines[i].trim() === '') {
				// keep blank lines
			} else {
				strippedHook = true;
				// Strip only a prose hook. A numbered or bulleted line is a Hook
				// Ladder beat and must stay in the body.
				const t = lines[i].trim();
				if (!/^\d+\.\s/.test(t) && !t.startsWith('- ')) continue;
			}
		}
		out.push(lines[i]);
	}
	return out.join('\n');
}

/* ---------------- html escaper ---------------- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------------- code highlighter (editor-style, // -> arrow) ---------------- */

// React hooks — every identifier of the form useXxx (useState, useEffect,
// useMemo, useCart, ...), built-in or custom. Checked first so hooks win over
// the generic identifier / function-call rules.
const HOOK_RE = /^use[A-Z][A-Za-z0-9]*$/;

// JS keyword set — colored as .kw (deep magenta).
const KEYWORDS = new Set([
	'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
	'new', 'class', 'extends', 'super', 'this', 'await', 'async', 'import', 'export',
	'from', 'default', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof',
	'in', 'of', 'true', 'false', 'null', 'undefined', 'break', 'continue', 'switch',
	'case', 'delete', 'void', 'yield', 'static', 'get', 'set',
]);

// Escape HTML special chars in a raw code span.
function escCode(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Render **bold** inside a comment as <b class="tag">bold</b>. No other formatting supported.
function renderComment(text) {
	let t = escCode(text).replace(/\*\*([^*]+)\*\*/g, '<b class="tag">$1</b>');
	return t.replace(/&lt;br&gt;/gi, '<br>');
}

// Tokenize one code line (no comment) into highlighted HTML.
// Order matters: hooks > strings > numbers > identifiers/keywords > function calls > rest.
function tokenizeLine(line) {
	let out = '';
	let i = 0;
	const n = line.length;
	const isIdentStart = (c) => /[A-Za-z_$]/.test(c);
	const isIdent = (c) => /[A-Za-z0-9_$]/.test(c);
	while (i < n) {
		const c = line[i];

		// Strings: ", ', ` — read until matching unescaped quote.
		if (c === '"' || c === "'" || c === '`') {
			let j = i + 1;
			while (j < n && line[j] !== c) { if (line[j] === '\\') j++; j++; }
			const lit = line.slice(i, Math.min(j + 1, n));
			out += `<span class="str">${escCode(lit)}</span>`;
			i = j + 1;
			continue;
		}

		// Comments: // or /* ... */ or {/* ... */}
		if (c === '/' && i + 1 < n && (line[i + 1] === '/' || line[i + 1] === '*')) {
			if (line[i + 1] === '/') {
				out += `<span class="cmt">${escCode(line.slice(i))}</span>`;
				break;
			} else {
				let j = i + 2;
				while (j + 1 < n && !(line[j] === '*' && line[j + 1] === '/')) j++;
				const lit = line.slice(i, Math.min(j + 2, n));
				out += `<span class="cmt">${escCode(lit)}</span>`;
				i = Math.min(j + 2, n);
				continue;
			}
		}
		if (c === '{' && line.slice(i, i + 3) === '{/*') {
			let j = i + 3;
			while (j + 2 < n && line.slice(j, j + 3) !== '*/}') j++;
			const lit = line.slice(i, Math.min(j + 3, n));
			out += `<span class="cmt">${escCode(lit)}</span>`;
			i = Math.min(j + 3, n);
			continue;
		}

		// Numbers: \d+(\.\d+)? — but not a dot in the middle of an identifier.
		if (/\d/.test(c) && (i === 0 || !isIdent(line[i - 1]))) {
			const m = line.slice(i).match(/^\d+(\.\d+)?/);
			if (m) {
				out += `<span class="nl">${escCode(m[0])}</span>`;
				i += m[0].length;
				continue;
			}
		}

		// Identifiers (and hooks / keywords / function calls).
		if (isIdentStart(c)) {
			let j = i + 1;
			while (j < n && isIdent(line[j])) j++;
			const word = line.slice(i, j);

			// Hook check first: useState, useEffect, useCart, etc.
			if (HOOK_RE.test(word)) {
				out += `<span class="hook">${escCode(word)}</span>`;
			} else if (KEYWORDS.has(word)) {
				out += `<span class="kw">${escCode(word)}</span>`;
			} else {
				// Look ahead past whitespace for '(' -> function call.
				let k = j;
				while (k < n && (line[k] === ' ' || line[k] === '\t')) k++;
				if (line[k] === '(') {
					out += `<span class="fn">${escCode(word)}</span>`;
				} else {
					out += escCode(word);
				}
			}
			i = j;
			continue;
		}

		// Any other character — emit escaped, no span.
		out += escCode(c);
		i++;
	}
	return out;
}

// Classify whether an inline backtick snippet represents a multi-word declaration,
// statement, JSX element, or sufficiently long code expression that merits a dedicated display line in prose.
function isDisplayCode(raw) {
	const s = raw.trim();

	// Bare self-closing tags like `<Masthead />` stay inline.
	if (/^<[A-Za-z][A-Za-z0-9.]*\s*\/>$/.test(s)) return false;

	// Rule 1: Declarations and statements starting with JS keywords.
	if (/^(export\s+|import\s+|function\s+|const\s+|let\s+|var\s+|return\s+|class\s+)/.test(s)) {
		return true;
	}

	// Rule 2: Statements with assignment or arrow function or comparison with significant length.
	if (/(^|[^\w$])(=>|===?|!==?|\s+=\s+)(?=[^\w$])/.test(s) && s.length > 20) {
		return true;
	}

	// Rule 3: Complete self-closing JSX elements with attributes or full elements with closing tags.
	if (/^<[A-Za-z][A-Za-z0-9.]*\s+[^>]+\/>$/.test(s)) {
		return true;
	}
	if (/^<([A-Za-z][A-Za-z0-9.]*)(\s+[^>]*)?>[\s\S]+<\/\1>$/.test(s)) {
		return true;
	}

	// Rule 4: Multi-word code expressions (> 25 characters with 4+ words).
	const words = s.split(/\s+/);
	if (words.length >= 4 && s.length > 25) {
		return true;
	}

	// Rule 5: Code expressions, method invocations, or statements that are sufficiently long (>= 30 characters).
	if (s.length >= 30) {
		return true;
	}

	return false;
}

/* ---------------- markdown -> html (full) ---------------- */

function inline(s, allowDisplayCode = false) {
	// Stash inline code first, before any escaping.
	const codeStash = [];
	let out = s.replace(/`([^`]+)`/g, (_, c) => {
		const isDisp = allowDisplayCode && isDisplayCode(c);
		codeStash.push({ code: c, isDisp });
		return `\u0000CODE${codeStash.length - 1}\u0000`;
	});

	// Escape HTML special characters in the text.
	out = esc(out);

	// Images ![text](url)
	out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, t, u) => `<figure class="visual-aid"><img src="${u}" alt="${t}" class="${u.endsWith('.svg') ? 'svg-diagram' : 'raster-diagram'}"></figure>`);
	// Links [text](url)
	out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`);
	// Bold then italic.
	out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');

	// Restore <br> and <br/> tags in markdown prose/tables
	out = out.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
	// Restore &nbsp;
	out = out.replace(/&amp;nbsp;/gi, '&nbsp;');

	// Macro for badge: [badge:Principle 01] or [badge:Principle 1]
	out = out.replace(/\[badge:\s*([^\]]+)\]/gi, '<span class="principle-badge">$1</span>');

	// Restore span tags (e.g. <span class="principle-badge">...</span>)
	out = out.replace(/&lt;span(\s+class="[^"]*")?&gt;([\s\S]*?)&lt;\/span&gt;/gi, '<span$1>$2</span>');

	// Restore div tags (e.g. <div class="table-code-snippet">...)
	out = out.replace(/&lt;div(\s+class="[^"]*")?&gt;([\s\S]*?)&lt;\/div&gt;/gi, (_, cls, content) => {
		const classAttr = cls || '';
		if (classAttr.includes('table-code-snippet')) {
			let codeBody = content.replace(/^&lt;code&gt;([\s\S]*?)&lt;\/code&gt;$/i, '$1').replace(/^<code>([\s\S]*?)<\/code>$/i, '$1');
			const lines = codeBody.split('<br>');
			const highlighted = lines.map(ln => {
				const raw = ln.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
				return `<div class="code-line">${tokenizeLine(raw).replace(/&amp;nbsp;/g, '&nbsp;')}</div>`;
			}).join('');
			return `<div${classAttr}>${highlighted}</div>`;
		}
		return `<div${classAttr}>${content}</div>`;
	});

	// Restore stashed inline/display code.
	// For display code, absorb any immediately trailing punctuation (., :, ,) so it does not leave an orphaned mark on the line below.
	out = out.replace(/\u0000CODE(\d+)\u0000(\.|\:|,)?/g, (_, i, punct) => {
		const item = codeStash[Number(i)];
		if (item.isDisp) {
			const highlighted = tokenizeLine(item.code);
			return `<span class="code-line-callout"><code>${highlighted}</code></span>`;
		} else {
			return `<code>${escCode(item.code)}</code>${punct || ''}`;
		}
	});

	return out;
}

function tokenizeCodeWithTarget(codeStr, charWidth = 9.5, tailWidth = 8) {
	const m = codeStr.match(/^(.*?)~(.*?)~(.*)$/) || codeStr.match(/^(.*?)\*\*([^*]+)\*\*(.*)$/);
	if (m) {
		const before = m[1];
		const target = m[2];
		const after = m[3];
		const indentMatch = before.match(/^(\s*)/);
		const indentLen = indentMatch ? indentMatch[1].length : 0;
		const codeBeforeTarget = before.slice(indentLen);
		// Absolute character column from start of the line:
		const colIndex = indentLen + codeBeforeTarget.length + (target.length / 2);
		// Benchmark: column 36 divides left side vs right side of the page (standard 72-80 col code line)
		const PAGE_BENCHMARK_COL = 36;
		const isRightSide = colIndex > PAGE_BENCHMARK_COL;
		const tipOffset = Math.round(codeBeforeTarget.length * charWidth + (target.length / 2) * charWidth);
		const minLeft = 10;
		const tokenOffset = Math.max(minLeft, Math.round(tipOffset - (tailWidth / 2)));
		const html = tokenizeLine(before) + `<span class="target-token">${tokenizeLine(target)}</span>` + tokenizeLine(after);
		return { codeHtml: html, tokenOffset, colIndex, isRightSide };
	}
	return { codeHtml: tokenizeLine(codeStr), tokenOffset: null, colIndex: null, isRightSide: false };
}

// Render one source line: split at the first // comment (followed by space or EOL),
// drop empty trailing comments, return {code, comment, tokenOffset, colIndex, isRightSide}.
function highlightLine(raw) {
	// 1. Full-line JSX or block comment: {/* comment */} or /* comment */
	const mFullBlock = raw.match(/^\s*(?:\{\/\*|\/\*)\s*(.*?)\s*(?:\*\/\}|\*\/)\s*$/);
	if (mFullBlock) {
		let text = mFullBlock[1].trim();
		if (!text) return null; // drop empty comment-only line
		text = text.replace(/(✔️|✖️|✖)\s*/g, '');
		text = text.charAt(0).toUpperCase() + text.slice(1);
		return { code: '', comment: text, tokenOffset: null, colIndex: null, isRightSide: false };
	}

	// 2. Trailing/inline JSX or block comment: code {/* comment */} or code /* comment */
	const mInlineBlock = raw.match(/^(.*?)\s*(?:\{\/\*|\/\*)\s*(.*?)\s*(?:\*\/\}|\*\/)\s*$/);
	if (mInlineBlock && mInlineBlock[1].trim() !== '') {
		const codePart = mInlineBlock[1];
		let commentText = mInlineBlock[2].trim();
		if (commentText) {
			commentText = commentText.replace(/(✔️|✖️|✖)\s*/g, '');
			if (commentText.length > 0) {
				commentText = commentText.charAt(0).toUpperCase() + commentText.slice(1);
			}
			const { codeHtml, tokenOffset, colIndex, isRightSide } = tokenizeCodeWithTarget(codePart);
			return { code: codeHtml, comment: commentText, tokenOffset, colIndex, isRightSide };
		}
	}

	// 3. Match a full-line comment: //, <!--, or # followed by space or EOL
	const mFull = raw.match(/^(?:\/\/|<!--|#)(\s|$)/);
	if (mFull && mFull.index === 0) {
		// Whole line is a comment.
		let text = raw.replace(/^(?:\/\/|<!--|#)\s?/, '').replace(/\s?-->\s*$/, '');
		if (!text.trim()) return null; // drop empty comment-only line
		text = text.replace(/(✔️|✖️|✖)\s*/g, '');
		text = text.charAt(0).toUpperCase() + text.slice(1);
		return { code: '', comment: text, tokenOffset: null, colIndex: null, isRightSide: false };
	}
	
	// 4. Match an inline comment: //, <!--, or # followed by space or EOL
	const idx = raw.search(/(?:\/\/|<!--|#)(\s|$)/);
	if (idx > 0 && raw[idx - 1] !== ':') {
		const codePart = raw.slice(0, idx);
		const matchToken = raw.substr(idx).startsWith('<!--') ? '<!--' : (raw.substr(idx).startsWith('#') ? '#' : '//');
		let commentText = raw.slice(idx + matchToken.length).replace(/^\s?/, '').replace(/\s?-->\s*$/, '');
		
		const { codeHtml, tokenOffset, colIndex, isRightSide } = tokenizeCodeWithTarget(codePart);
		if (!commentText.trim()) return { code: codeHtml, comment: null, tokenOffset, colIndex, isRightSide }; // drop empty trailing //

		commentText = commentText.replace(/(✔️|✖️|✖)\s*/g, '');
		if (commentText.length > 0) {
			commentText = commentText.charAt(0).toUpperCase() + commentText.slice(1);
		}
		return { code: codeHtml, comment: commentText, tokenOffset, colIndex, isRightSide };
	}
	// No comment: verify line does not contain dangling target tokens (~token~)
	if (raw.includes('~')) {
		codeNotes.push(`orphan target token detected on line without comment: "${raw.trim()}"`);
	}
	// No comment — tokenize the whole line.
	const { codeHtml, tokenOffset, colIndex, isRightSide } = tokenizeCodeWithTarget(raw);
	return { code: codeHtml, comment: null, tokenOffset, colIndex, isRightSide };
}

// Build the editor-style HTML for one fenced code block.

// Default filename shown in the editor tab when the author did not set title=.
function defaultFilename(lang) {
	if (lang === 'jsx' || lang === 'javascript') return 'App.jsx';
	if (lang === 'tsx' || lang === 'typescript') return 'App.tsx';
	if (lang === 'js') return 'App.js';
	if (lang === 'ts') return 'App.ts';
	return 'code.txt';
}

// Authoring notes collected while rendering code blocks; reset and printed per
// source file by buildDirectory so the author sees what the build auto-fixed.
const codeNotes = [];

function highlightCode(code, title, lang, attrs = {}) {
	let startLine = attrs.startLine ? parseInt(attrs.startLine, 10) : (attrs['start-line'] ? parseInt(attrs['start-line'], 10) : 1);
	const continues = attrs.continues || '';
	const continuesTop = continues === 'top' || continues === 'both' || attrs['continues-top'] === 'true';
	const continuesBottom = continues === 'bottom' || continues === 'both' || attrs['continues-bottom'] === 'true';

	// Comment-only lines never get their own row: their text is merged into the
	// bubble of the following code line (or the preceding one at block end), so
	// no comment bubble can ever float beside an empty numbered row.
	const pending = [];
	const parsed = [];
	let rawLines = code.split('\n');

	// Skip leading empty lines at start of any code snippet
	while (rawLines.length > 0 && rawLines[0].trim() === '') {
		rawLines.shift();
		if (attrs.startLine || attrs['start-line']) {
			startLine++;
		}
	}
	// Strip trailing empty lines
	while (rawLines.length > 0 && rawLines[rawLines.length - 1].trim() === '') {
		rawLines.pop();
	}

	rawLines.forEach((line, lineIdx) => {
		const spaceLine = line.replace(/\t/g, '  ');
		const indentMatch = spaceLine.match(/^(\s*)/);
		const indent = indentMatch ? indentMatch[1].length : 0;
		const result = highlightLine(spaceLine);
		const codeText = result ? result.code : '';
		const comment = result ? result.comment : null;
		// A comment-only line (flush-left or indented: its code part is only
		// whitespace): hold its text for the next code line.
		if (result !== null && comment !== null && codeText.trim() === '') {
			codeNotes.push(`merged comment-only line ${lineIdx + 1} into the next code line's bubble`);
			pending.push(comment);
			return;
		}
		// Blank lines do not consume pending comments; only real code does.
		const hasCode = codeText.trim() !== '';
		const merged = hasCode ? pending.splice(0, pending.length) : [];
		const tokenOffset = result ? result.tokenOffset : null;
		const colIndex = result ? result.colIndex : null;
		const isRightSide = result ? result.isRightSide : false;
		parsed.push({ code: codeText, comment, indent, tokenOffset, colIndex, isRightSide, merged });
	});
	// A block that ends on comment-only lines folds them into the last code row.
	if (pending.length) {
		let last = null;
		for (let i = parsed.length - 1; i >= 0; i--) {
			if (parsed[i].code.trim() !== '' || parsed[i].comment) { last = parsed[i]; break; }
		}
		if (last) last.merged.push(...pending.splice(0, pending.length));
		else parsed.push({ code: '', comment: null, indent: 0, tokenOffset: null, colIndex: null, isRightSide: false, merged: pending.splice(0, pending.length) });
	}
	const rows = parsed.map((p, idx) => {
		const lineNum = startLine + idx;
		const isEven = lineNum % 2 === 0;
		const rowClass = `row ${isEven ? 'even' : 'odd'}`;
		if (p.code === '' && !p.comment && !p.merged.length) {
			return `<div class="${rowClass}"><span class="num">${lineNum}</span><span class="src"></span></div>`;
		}
		let out = `<div class="${rowClass}"><span class="num">${lineNum}</span><span class="src">${p.code}</span>`;
		const commentText = [...p.merged, ...(p.comment ? [p.comment] : [])].join('<br>');
		if (commentText) {
			const isMulti = commentText.includes('<br>');
			const shoulder = 24;
			if (p.isRightSide && p.colIndex !== null) {
				// Benchmark: target word is on the RIGHT side of the page (> 36 columns)
				// Starting point: RIGHT (anchored at target word + shoulder, extending left)
				const rightEdge = Math.round(p.colIndex * 9.5 + shoulder);
				const bubbleClass = (isMulti ? 'cmt-bubble cmt-bubble-multi' : 'cmt-bubble') + ' cmt-bubble-right';
				out += `\n      <div style="flex-basis: 100%; height: 0;"></div>\n      <span class="num"></span>\n      <div class="${bubbleClass}" style="--right-edge: ${rightEdge}px; --tail-shoulder: ${shoulder}px;">\n        <span class="text">${renderComment(commentText)}</span>\n      </div>`;
			} else {
				// Benchmark: target word is on the LEFT side of the page (<= 36 columns)
				// Starting point: LEFT (anchored on the left at line indentation, extending right)
				const offset = p.indent * 9.5;
				const tokenStyle = p.tokenOffset !== null && p.tokenOffset !== undefined ? ` --token-offset: ${p.tokenOffset}px;` : '';
				const bubbleClass = isMulti ? 'cmt-bubble cmt-bubble-multi' : 'cmt-bubble';
				out += `\n      <div style="flex-basis: 100%; height: 0;"></div>\n      <span class="num"></span>\n      <div class="${bubbleClass}" style="--indent-offset: ${offset}px;${tokenStyle}">\n        <span class="text">${renderComment(commentText)}</span>\n      </div>`;
			}
		}
		out += `</div>`;
		return out;
	}).join('\n');

	// The top code block in a series holds the name tab. Continued blocks show a sticky note emerging from the back.
	let bar = '';
	let stickyNote = '';
	const filename = title || attrs.title || attrs.file || defaultFilename(lang);
	const isExplicitNote = attrs.note === 'true' || attrs.stickyNote === 'true';
	const isExplicitNoNote = attrs.note === 'false' || attrs.stickyNote === 'false';
	const showStickyNote = isExplicitNoNote ? false : (isExplicitNote ? true : attrs['show-sticky-note'] === 'true');

	if (!continuesTop) {
		bar = `<div class="bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="tab">${esc(filename)}</span></div>`;
	} else if (filename && showStickyNote) {
		stickyNote = `<div class="sticky-note"><span class="note-filename">${esc(filename)}</span> <span class="note-tag">(continued)</span></div>`;
	}

	const isWrong = lang && lang.includes('wrong');
	const isRight = lang && lang.includes('right');
	const svgRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.5rem; height: 1.5rem;"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>`;
	const svgWrong = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.5rem; height: 1.5rem;"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>`;
	const icon = isWrong ? svgWrong : (isRight ? svgRight : '');

	let contClass = '';
	if (continuesTop && continuesBottom) contClass = ' continues-both';
	else if (continuesTop) contClass = ' continues-top';
	else if (continuesBottom) contClass = ' continues-bottom';

	if (stickyNote) {
		contClass += ' has-sticky-note';
	}

	const editorClass = (isWrong ? 'editor wrong' : (isRight ? 'editor right' : 'editor')) + contClass;

	if (icon) {
		return `<div class="${editorClass}">${stickyNote}<div class="editor-indicator">${icon}</div><div class="editor-main">${bar}<div class="code">${rows}</div></div></div>`;
	} else {
		return `<div class="${editorClass}">${stickyNote}<div class="editor-main">${bar}<div class="code">${rows}</div></div></div>`;
	}
}

function highlightMiniCode(code, lang) {
	const isWrong = lang && lang.includes('wrong');
	const isRight = lang && lang.includes('right');
	const cls = isWrong ? 'mini-code wrong' : (isRight ? 'mini-code right' : 'mini-code');
	
	const svgRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.3rem; height: 1.3rem;"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>`;
	const svgWrong = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.3rem; height: 1.3rem;"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>`;
	
	const icon = isWrong ? svgWrong : (isRight ? svgRight : '');

	const rawLines = code.trim().split('\n');
	const srcHtml = rawLines.map((raw) => {
		return `<div>${tokenizeLine(raw)}</div>`;
	}).join('');

	if (icon) {
		return `<div class="${cls}">
  <div class="mini-code-icon">${icon}</div>
  <div class="mini-code-content"><code>${srcHtml}</code></div>
</div>`;
	} else {
		return `<div class="${cls}">
  <div class="mini-code-content"><code>${srcHtml}</code></div>
</div>`;
	}
}

/* ---------------- markdown block parser ---------------- */

function parseBlocks(md) {
	const starters = (l) => l.startsWith('```') || l.startsWith('#') || /^\s*[-*]\s+/.test(l) || /^\d+\.\s/.test(l) || l.startsWith('> ') || l.trim().startsWith('![') || l.trim().startsWith('➔') || l.trim().startsWith('❒');
	const lines = md.split('\n');
	const out = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) { i++; continue; }

		// Summary subtitle or decision principle rule.
		if (line.trim().startsWith('❒') || line.trim().startsWith('➔')) {
			out.push({ t: 'p', text: line.trim() });
			i++;
			continue;
		}

		// Standalone image.
		const imgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
		if (imgMatch) {
			out.push({ t: 'image', alt: imgMatch[1], src: imgMatch[2] });
			i++;
			continue;
		}

		// HTML figure embed: ```html-figure src="..." caption="..." (or ```figure).
		// The figure is a standalone HTML file in 01-02-md-LECTURES/figures/ (referenced
		// by src, resolved against the project root or 01-02-md-LECTURES/) or inline HTML
		// inside the fence. It is inlined verbatim into the lecture page.
		const figFence = line.match(/^`{3,4}(figure|html-figure)\b(.*)$/);
		if (figFence) {
			const attrs = {};
			for (const m of (figFence[2] || '').matchAll(/(\w+)="([^"]+)"/g)) attrs[m[1]] = m[2];
			const buf = [];
			i++;
			while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
			i++;
			out.push({ t: 'html-figure', attrs, source: buf.join('\n') });
			continue;
		}

		// Fenced code block.
		const fence = line.match(/^```([^\s`]+)?\s*(.*)$/);
		if (fence) {
			const buf = [];
			i++;
			while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
			i++;
			let lang = (fence[1] || '').trim();
			const rest = fence[2] || '';
			const attrs = {};
			for (const m of rest.matchAll(/([\w-]+)="([^"]*)"/g)) {
				attrs[m[1]] = m[2];
			}
			const title = attrs.title || '';
			if (lang === 'components') {
				out.push({ t: 'components', title, attrs, source: buf.join('\n') });
			} else if (lang === 'files') {
				out.push({ t: 'files', title, source: buf.join('\n') });
			} else if (lang === 'component-code') {
				out.push({ t: 'component-code', title, source: buf.join('\n') });
			} else {
				const isWrong = /\bwrong\b/i.test(lang) || /\bwrong\b/i.test(rest) || (out.length > 0 && out[out.length - 1].t === 'p' && /DO NOT DO THIS/i.test(out[out.length - 1].text));
				const isRight = /\bright\b/i.test(lang) || /\bright\b/i.test(rest) || (out.length > 0 && out[out.length - 1].t === 'p' && /(?:^|\s)DO THIS/i.test(out[out.length - 1].text));
				if (isWrong && !lang.includes('wrong')) {
					lang += ' wrong';
				} else if (isRight && !lang.includes('right')) {
					lang += ' right';
				}
				out.push({ t: 'code', lang, title, attrs, code: buf.join('\n') });
			}
			continue;
		}

		// Headings.
		if (line.startsWith('#### ')) { out.push({ t: 'h4', text: line.slice(5) }); i++; continue; }
		if (line.startsWith('### ')) { out.push({ t: 'h3', text: line.slice(4) }); i++; continue; }
		if (line.startsWith('## ')) { out.push({ t: 'h2', text: line.slice(3) }); i++; continue; }
		if (line.startsWith('# ')) { out.push({ t: 'h1', text: line.slice(2) }); i++; continue; }

		// Blockquote (consecutive > lines).
		// A block whose first line matches `> [!TYPE]` (a GitHub-style alert callout)
		// becomes a `callout` block with type + body, rendered distinctly from a plain
		// blockquote. Only the alert types in ALERT_TYPES are recognized; anything else
		// (including a bare `> [!TIP]` typo or unsupported type) falls back to a plain
		// blockquote so the author sees the literal text and notices the typo.
		if (line.startsWith('> ') || line === '>') {
			const buf = [];
			while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
				const l = lines[i];
				buf.push(l === '>' ? '' : (l.startsWith('> ') ? l.slice(2) : l.slice(1)));
				i++;
			}
			const joined = buf.join('\n');
			// Match `> [!TYPE]` optionally followed by more text on the same line.
			// The body is everything after the `]` (trimmed); if the `]` ended the
			// first line, the body is the remaining joined lines.
			const alert = joined.match(/^\[!(NOTE|TIP|KEY|WARNING|CAUTION|WILD|GROUNDING|CONVENTION|PRINCIPLE)\]\s*([\s\S]*)$/);
			if (alert) {
				out.push({ t: 'callout', kind: alert[1].toLowerCase(), text: alert[2].trim() });
			} else {
				out.push({ t: 'quote', text: joined });
			}
			continue;
		}

		// Unordered list (supports nested lists).
		if (/^\s*[-*]\s+/.test(line)) {
			const parseList = (minIndent) => {
				const items = [];
				while (i < lines.length) {
					const l = lines[i];
					if (!l.trim()) {
						let k = i + 1;
						while (k < lines.length && !lines[k].trim()) k++;
						if (k < lines.length && /^\s*[-*]\s+/.test(lines[k])) {
							const nextIndent = lines[k].match(/^(\s*)[-*]\s+/)[1].length;
							if (nextIndent >= minIndent) {
								i = k;
								continue;
							}
						}
						break;
					}
					const m = l.match(/^(\s*)[-*]\s+(.*)$/);
					if (!m) break;
					const indent = m[1].length;
					if (indent < minIndent) break;

					const text = m[2];
					i++;

					// Check for nested children
					let children = [];
					if (i < lines.length) {
						let k = i;
						while (k < lines.length && !lines[k].trim()) k++;
						if (k < lines.length) {
							const nextM = lines[k].match(/^(\s*)[-*]\s+/);
							if (nextM && nextM[1].length > indent) {
								i = k;
								children = parseList(nextM[1].length);
							}
						}
					}

					items.push({ text, children });
				}
				return items;
			};

			const items = parseList(0);
			out.push({ t: 'ul', items });
			continue;
		}

		// Ordered list.
		if (/^\d+\.\s/.test(line)) {
			const items = [];
			while (i < lines.length) {
				if (!lines[i].trim()) {
					let k = i;
					while (k < lines.length && !lines[k].trim()) k++;
					if (k < lines.length && /^\d+\.\s/.test(lines[k])) {
						i = k;
					} else {
						break;
					}
				}
				if (!/^\d+\.\s/.test(lines[i])) break;

				const parts = [{ type: 'text', content: lines[i].replace(/^\d+\.\s/, '') }];
				i++;

				while (i < lines.length) {
					const next = lines[i];
					if (!next.trim()) {
						let k = i + 1;
						while (k < lines.length && !lines[k].trim()) k++;
						if (k < lines.length && (lines[k].startsWith('<br>') || lines[k].startsWith('&nbsp;'))) {
							i++;
							continue;
						}
						break;
					}

					const fenceMatch = next.match(/^```([\w\s]+)?\s*(?:title="([^"]*)")?\s*$/);
					if (fenceMatch) {
						const codeBuf = [];
						i++;
						while (i < lines.length && !lines[i].startsWith('```')) {
							codeBuf.push(lines[i]);
							i++;
						}
						i++;
						parts.push({ type: 'code', content: highlightMiniCode(codeBuf.join('\n'), fenceMatch[1]) });
						continue;
					}

					if (next.startsWith('<br>') || next.startsWith('&nbsp;')) {
						parts.push({ type: 'text', content: next });
						i++;
						continue;
					}

					if (/^\d+\.\s/.test(next) || starters(next) || (next.includes('|') && i + 1 < lines.length && lines[i + 1].includes('-'))) {
						break;
					}

					parts.push({ type: 'text', content: next });
					i++;
				}

				items.push(parts);
			}
			out.push({ t: 'ol', items });
			continue;
		}

		// Table: a header row, a separator row of dashes, then body rows.
		// All rows use pipe characters; cells are trimmed.
		if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*[-:]+/.test(lines[i + 1]) && lines[i + 1].includes('-')) {
			const splitRow = (r) => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
			const header = splitRow(line);
			i += 2; // skip header + separator
			const rows = [];
			while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
				rows.push(splitRow(lines[i]));
				i++;
			}
			out.push({ t: 'table', header, rows });
			continue;
		}

		// Paragraph (consume consecutive non-blank, non-starter lines).
		const buf = [];
		while (i < lines.length && lines[i].trim() && !starters(lines[i])) { buf.push(lines[i]); i++; }
		out.push({ t: 'p', text: buf.join('\n') });
	}
	return out;
}

function render(blocks, currentMdFile = '') {
	let html = '';
	let inH3 = false;
	// The opening numbered list (before any section heading) is the Hook Ladder.
	let seenHeading = false;
	let currentFileTitle = '';
	let sectionHasCode = false;
	
	for (let bi = 0; bi < blocks.length; bi++) {
		const b = blocks[bi];

		// If we encounter any heading, close the previous h3 section and reset sectionHasCode
		if (b.t === 'h1' || b.t === 'h2' || b.t === 'h3' || b.t === 'h4') {
			// The h1 is the lecture title, not a section: only real section
			// headings (h2/h3/h4) end the opening region that may hold the
			// Hook Ladder.
			if (b.t !== 'h1') {
				seenHeading = true;
				sectionHasCode = false;
			}
			if (inH3) {
				html += '</div>\n';
				inH3 = false;
			}
		}

		if (b.t === 'code') {
			if (b.title) {
				currentFileTitle = b.title;
			} else if (b.attrs && b.attrs.title) {
				currentFileTitle = b.attrs.title;
			} else if (b.attrs && (b.attrs.continues === 'top' || b.attrs.continues === 'both' || b.attrs['continues-top'] === 'true')) {
				b.title = currentFileTitle;
			} else if (!b.attrs || !b.attrs.continues) {
				currentFileTitle = '';
			}

			if (!b.attrs) b.attrs = {};
			const isContinued = b.attrs.continues === 'top' || b.attrs.continues === 'both' || b.attrs['continues-top'] === 'true';
			if (isContinued) {
				// Show sticky note ONLY on the first continued code block of a new section!
				b.attrs['show-sticky-note'] = !sectionHasCode ? 'true' : 'false';
			}
			sectionHasCode = true;
		}
		
		// If this is an h3, start a new wrapper
		if (b.t === 'h3') {
			const isGlossary = /^glossary\b/i.test(b.text.trim());
			const isSummary = /^summary\b/i.test(b.text.trim());
			const isStep = /^Step\s+(\d+)/i.test(b.text.trim());
			const isExample = /^(?:LET'S DESIGN A PRACTICAL EXAMPLE|Let's Design a Practical Example|Practical Example)/i.test(b.text.trim());
			const isLessons = /^(?:Lessons from the Experiment|Component Summary)\b/i.test(b.text.trim());
			const isInterview = /^For the interview\b/i.test(b.text.trim());
			let extra = isGlossary ? ' glossary-section' : (isSummary ? ' summary-section' : (isStep ? ' step-section' : (isExample ? ' example-section' : (isLessons ? ' lessons-section' : (isInterview ? ' interview-section' : '')))));
			html += `<div class="keep-together${extra}">\n`;
			inH3 = true;
		}

		// Keep-together pair: DO NOT DO THIS / DO THIS lead-in and its code snippet
		if (b.t === 'p' && /(?:DO NOT DO THIS|DO THIS):/i.test(b.text) && bi + 1 < blocks.length && blocks[bi + 1].t === 'code') {
			const nextCode = blocks[bi + 1];
			html += `<div class="snippet-unit" style="page-break-inside: avoid; break-inside: avoid;">\n  <p style="page-break-after: avoid; break-after: avoid;">${inline(b.text)}</p>\n  ${highlightCode(nextCode.code, nextCode.title, nextCode.lang, nextCode.attrs)}\n</div>\n`;
			bi++;
			continue;
		}
		
		switch (b.t) {
			case 'h1': html += `<h1>${inline(b.text)}</h1>\n`; break;
			// h2 = page break. Wrap the heading in a div that forces a new page
			// in PDF (Prince) and a visual break in the deck HTML.
			case 'h2': html += `<div class="page-break"><h2>${inline(b.text)}</h2></div>\n`; break;
			case 'h3': {
				const stepMatch = b.text.match(/^Step\s+(\d+)[:\s]+(.*?)(?:\s+((?:`?<[^>]+>`?\s*)+))?$/i);
				const isExample = /^(?:LET'S DESIGN A PRACTICAL EXAMPLE|Let's Design a Practical Example|Practical Example)/i.test(b.text.trim());
				const isLessons = /^(?:Lessons from the Experiment|Component Summary)\b/i.test(b.text.trim());
				if (stepMatch) {
					const stepNum = stepMatch[1];
					const title = stepMatch[2].trim();
					const compsRaw = stepMatch[3] ? stepMatch[3].trim() : '';
					const compTags = compsRaw ? (compsRaw.match(/<[^>]+>/g) || []) : [];
					const compsHtml = compTags.length > 0 
						? `<div class="card-components">${compTags.map(c => `<span class="component-tag">${esc(c)}</span>`).join(' ')}</div>` 
						: '';
					html += `<div class="step-header-card step-${stepNum}">
  <div class="card-edge"></div>
  <div class="card-main">
    <div class="step-badge">
      <span class="step-text">Step</span>
      <span class="step-num">${stepNum}</span>
    </div>
    <div class="card-divider-wrap">
      <div class="card-divider"></div>
    </div>
    <div class="card-content">
      <div class="card-title" style="prince-bookmark-level: 3; prince-bookmark-label: 'Step ${stepNum}: ${title.replace(/'/g, "\\'")}';">${inline(title)}</div>
      ${compsHtml}
    </div>
  </div>
</div>\n`;
				} else if (isExample) {
					const compMatch = b.text.match(/((?:`?<[^>]+>`?\s*)+)$/);
					const compsRaw = compMatch ? compMatch[1].trim() : '';
					const withoutComps = compMatch ? b.text.slice(0, compMatch.index).trim() : b.text.trim();
					let title = withoutComps;
					if (/^let's design a practical example$/i.test(withoutComps.trim())) {
						title = "Let's Design a Practical Example";
					}
					const compTags = compsRaw ? (compsRaw.match(/<[^>]+>/g) || []) : [];
					const compsHtml = compTags.length > 0 
						? `<div class="card-components">${compTags.map(c => `<span class="component-tag">${esc(c)}</span>`).join(' ')}</div>` 
						: '';
					html += `<div class="step-header-card example-header-card">
  <div class="card-edge"></div>
  <div class="card-main">
    <div class="step-badge example-badge">
      <span class="step-text">Case</span>
      <span class="step-num step-word">Study</span>
    </div>
    <div class="card-divider-wrap">
      <div class="card-divider"></div>
    </div>
    <div class="card-content">
      <div class="card-title" style="prince-bookmark-level: 3; prince-bookmark-label: '${title.replace(/'/g, "\\'")}';">${inline(title)}</div>
      ${compsHtml}
    </div>
  </div>
</div>\n`;
				} else if (isLessons) {
					html += `<h3 class="lessons-heading">${inline(b.text)}</h3>\n`;
				} else {
					html += `<h3>${inline(b.text)}</h3>\n`;
				}
				break;
			}
			case 'h4': html += `<h4>${inline(b.text)}</h4>\n`; break;
			case 'code': html += highlightCode(b.code, b.title, b.lang, b.attrs) + '\n'; break;
			case 'components': html += renderComponentExplorer(b.source, b.title, b.attrs) + '\n'; break;
			case 'files': html += renderFileExplorer(b.source, b.title) + '\n'; break;
			case 'component-code': html += renderComponentCodeExplorer(b.source, b.title) + '\n'; break;
			case 'html-figure': {
				// Standalone HTML figure (React Component Explorer card): the src
				// attribute points at a file in 01-02-md-LECTURES/figures/; its content is
				// inlined verbatim, wrapped in a figure with a numbered caption.
				figState.n += 1;
				let content = b.source;
				if (b.attrs.src) {
					try {
						let figPath = join(ROOT, b.attrs.src);
						if (!existsSync(figPath)) {
							figPath = join(dirs.mdLectures, b.attrs.src);
						}
						if (!existsSync(figPath) && dirs.mdLecturesBase) {
							figPath = join(dirs.mdLecturesBase, b.attrs.src);
						}
						content = readFileSync(figPath, 'utf8');
						// Sanitize embedded figure snippet to prevent premature document termination
						content = content.replace(/<!DOCTYPE[^>]*>/gi, '')
							.replace(/<\/?html[^>]*>/gi, '')
							.replace(/<\/?body[^>]*>/gi, '')
							.replace(/<meta[^>]*>/gi, '')
							.replace(/<head[^>]*>/gi, '')
							.replace(/<\/head>/gi, '');
					} catch (e) {
						console.error(`Missing html-figure src: ${b.attrs.src}`);
						content = `<div style="color:red;padding:20px;">Missing html-figure src: ${b.attrs.src}</div>`;
					}
				}
				const cap = b.attrs.caption ? `<figcaption>Fig ${figState.lecture}.${figState.n}: ${inline(b.attrs.caption)}</figcaption>` : '';
				html += `<figure class="react-figure rce-figure css-figure">\n${content}\n${cap}\n</figure>\n`;
				break;
			}
			case 'image': {
				const isSvg = b.src.endsWith('.svg');
				html += `<figure class="visual-aid">\n  <img src="${b.src}" alt="${esc(b.alt)}" class="${isSvg ? 'svg-diagram' : 'raster-diagram'}">\n</figure>\n`;
				break;
			}
			case 'quote': html += `<blockquote>${inline(b.text, true)}</blockquote>\n`; break;
			case 'callout': {
				if (b.kind === 'principle') {
					const principleMatch = b.text.match(/^\*\*Principle\s+(\d+):\s*([^\n]+?)\*\*\s*([\s\S]*)$/i);
					if (principleMatch) {
						const pNum = principleMatch[1].trim();
						const pTitle = principleMatch[2].trim();
						const pRest = principleMatch[3].trim();
						
						const glossaryItems = [];
						const cleanLines = [];
						for (const rawLine of pRest.split('\n')) {
							const m = rawLine.trim().match(/^(?:>>|&gt;&gt;)\s*([^:]+?)\s*:\s*(.+)$/);
							if (m) {
								glossaryItems.push({
									term: m[1].trim(),
									def: m[2].trim()
								});
							} else {
								cleanLines.push(rawLine);
							}
						}
						const cleanedPRest = cleanLines.join('\n');
						const paras = cleanedPRest.split(/\n\s*\n/).filter(Boolean);
						let def = [];
						let doThis = '';
						let doNot = '';
						let isBestPractice = false;
						for (const p of paras) {
							const t = p.trim();
							if (/^\*(?:It is best practice to do this|Best Practice):\*/i.test(t)) {
								isBestPractice = true;
								doThis = t.replace(/^\*(?:It is best practice to do this|Best Practice):\*\s*/i, '');
							} else if (/^\*(?:Instead of doing this|Instead):\*/i.test(t)) {
								isBestPractice = true;
								doNot = t.replace(/^\*(?:Instead of doing this|Instead):\*\s*/i, '');
							} else if (/^\*(?:We should do this|This is valid(?:\s*:)?|Do This|Write):\*/i.test(t)) {
								doThis = t.replace(/^\*(?:We should do this|This is valid(?:\s*:)?|Do This|Write):\*\s*/i, '');
							} else if (/^\*(?:We should not do this|This is not valid(?:\s*:)?|Do Not Do This|Never):\*/i.test(t)) {
								doNot = t.replace(/^\*(?:We should not do this|This is not valid(?:\s*:)?|Do Not Do This|Never):\*\s*/i, '');
							} else if (/^\*Example:\*/i.test(t)) {
								const raw = t.replace(/^\*Example:\*\s*/i, '');
								const split = raw.match(/^(?:Write\s+)?([\s\S]*?),\s*(?:never|never write)\s+([\s\S]*)$/i);
								if (split) {
									doThis = split[1];
									doNot = split[2];
								} else {
									doThis = raw;
								}
							} else {
								def.push(t);
							}
						}

						// Definitions may decompose paired roles into `- ` / `* ` bullet items; adjacent bullet
						// paragraphs (blank `>` lines between items) merge into one list.
						const defBlocks = [];
						for (const d of def) {
							for (const dl of d.split('\n').map(l => l.trim()).filter(Boolean)) {
								const last = defBlocks[defBlocks.length - 1];
								const item = dl.match(/^[-*]\s+(.+)$/);
								if (item) {
									if (last && last.type === 'roles') last.items.push(item[1]);
									else defBlocks.push({ type: 'roles', items: [item[1]] });
								} else if (last && last.type === 'p' && last.para === d) {
									last.text += ' ' + dl;
								} else {
									defBlocks.push({ type: 'p', text: dl, para: d });
								}
							}
						}
						const defHtml = defBlocks.map(blk => blk.type === 'roles'
							? `<ul class="principle-roles">${blk.items.map(it => `<li>${inline(it, false)}</li>`).join('')}</ul>`
							: `<p class="principle-statement">${inline(blk.text, false)}</p>`).join('\n      ');
						
						let glossaryHtml = '';
						if (glossaryItems.length > 0) {
							glossaryHtml = '      <div class="principle-marginalia-glossary">\n' +
								glossaryItems.map(item =>
									`        <div class="gloss-entry">\n` +
									`          <span class="gloss-term">${inline(item.term, false)}</span>\n` +
									`          <span class="gloss-def">${inline(item.def, false)}</span>\n` +
									`        </div>`
								).join('\n') +
								'\n      </div>\n';
						}

						function processCaseSnippet(rawText, pNum, caseType, currentMdFile) {
							if (!rawText) return { codeHtml: '', noteHtml: '' };
							const lines = rawText.split('\n');

							if (compactPrinciples) {
								const codeLines = [];
								const noteLines = [];

								for (const line of lines) {
									const trimmed = line.trim();
									if (!trimmed) continue;

									const commentMatch = trimmed.match(/^`?(?:\/\/\s*|\/\*\s*)([\s\S]*?)(?:\s*\*\/)?`?$/);
									const italicsMatch = trimmed.match(/^\*([^*]+)\*$/);
									if (commentMatch && !trimmed.includes(';') && !trimmed.includes('{') && !trimmed.includes('}') && !trimmed.includes('(') && !trimmed.includes(')')) {
										const noteText = commentMatch[1].trim();
										if (noteText) noteLines.push(noteText);
									} else if (italicsMatch) {
										const noteText = italicsMatch[1].trim();
										if (noteText) noteLines.push(noteText);
									} else {
										const trailingNoteMatch = trimmed.match(/^(`[^`]+`)\s*(?:\/\/\s*|\*\s*)([\s\S]+?)(?:\*)?$/);
										if (trailingNoteMatch) {
											codeLines.push(trailingNoteMatch[1]);
											noteLines.push(trailingNoteMatch[2].trim());
										} else {
											if (trimmed.startsWith('`')) {
												codeLines.push(trimmed);
											} else {
												codeLines.push(line.replace(/^>\s?/, ''));
											}
										}

										let rawCode = trimmed;
										const rawCodeMatch = trimmed.match(/^`([\s\S]*)`$/);
										if (rawCodeMatch) rawCode = rawCodeMatch[1];
										const codeOnly = rawCode.replace(/\s*\/\/.*$/, '').replace(/\s*\/\*.*\*\/$/, '').trim();
										const MAX_CASE_LINE_LEN = 68;
										if (codeOnly.length > MAX_CASE_LINE_LEN) {
											console.log(`  warn ${currentMdFile || 'markdown'}: Principle ${pNum} (${caseType}) code line length ${codeOnly.length} > ${MAX_CASE_LINE_LEN} chars: "${rawCode}". Break into multiple lines for clean card presentation.`);
										}
									}
								}

								const highlightedLines = codeLines.map(l => {
									let raw = l;
									const matchWithLeadingSpace = raw.match(/^(\s*)`([\s\S]*)`(\s*)$/);
									if (matchWithLeadingSpace) {
										raw = matchWithLeadingSpace[1] + matchWithLeadingSpace[2] + matchWithLeadingSpace[3];
									} else {
										raw = raw.replace(/^`/, '').replace(/`$/, '');
									}
									return tokenizeLine(raw);
								});

								const codeHtml = highlightedLines.length > 0 ? `<pre><code>${highlightedLines.join('\n')}</code></pre>` : '';
								let noteHtml = '';
								if (noteLines.length > 0) {
									noteHtml = `        <div class="case-note">${noteLines.map(n => inline(n, false)).join('<br>')}</div>\n`;
								}

								return { codeHtml, noteHtml };
							}

							// Default: code-plus layout (flex lines with targeted cmt-bubble attachments)
							const rowItems = [];
							let pendingBubble = null;
							for (const line of lines) {
								const trimmed = line.trim();
								if (!trimmed) continue;

								let raw = line.replace(/^>\s?/, '');
								const backtickMatch = raw.match(/^(\s*)`([\s\S]*)`(\s*)$/);
								if (backtickMatch) {
									raw = backtickMatch[1] + backtickMatch[2] + backtickMatch[3];
								} else {
									raw = raw.replace(/^`/, '').replace(/`$/, '');
								}

								const indentMatch = raw.match(/^(\s+)/);
								const indentSpaces = indentMatch ? indentMatch[1].length : 0;
								const indentOffset = Math.round(indentSpaces * 8.2);

								let commentText = null;
								let codeText = raw;
								const commentRegex = /^(.*?)\s*(?:\/\/|\/\*)\s*([\s\S]*?)(?:\*\/)?\s*$/;
								const cMatch = raw.match(commentRegex);
								if (cMatch && cMatch[1].trim().length > 0) {
									codeText = cMatch[1];
									commentText = cMatch[2].trim();
								} else if (raw.trim().startsWith('//') || raw.trim().startsWith('/*')) {
									commentText = raw.replace(/^[\s/\\*]+/, '').replace(/[\s/\\*]+$/, '').trim();
									codeText = '';
								}

								const codeOnly = codeText.trim();
								const MAX_CASE_LINE_LEN = 68;
								if (codeOnly.length > MAX_CASE_LINE_LEN) {
									console.log(`  warn ${currentMdFile || 'markdown'}: Principle ${pNum} (${caseType}) code line length ${codeOnly.length} > ${MAX_CASE_LINE_LEN} chars: "${codeText.trim()}". Break into multiple lines for clean card presentation.`);
								}

								if (codeText.length > 0) {
									const { codeHtml, tokenOffset, colIndex, isRightSide } = tokenizeCodeWithTarget(codeText, 8.2, 7);
									const isCardRight = colIndex !== null && colIndex > 36;
									rowItems.push({ type: 'code', html: codeHtml });
									if (pendingBubble) {
										rowItems.push(pendingBubble);
										pendingBubble = null;
									}
									if (commentText) {
										rowItems.push({ type: 'bubble', text: commentText, indentOffset, tokenOffset, colIndex, isRightSide: isCardRight });
									}
								} else if (commentText) {
									pendingBubble = { type: 'bubble', text: commentText, indentOffset, tokenOffset: null, colIndex: null, isRightSide: false };
								}
							}
							if (pendingBubble) {
								rowItems.push(pendingBubble);
							}

							let codeHtml = '';
							for (const item of rowItems) {
								if (item.type === 'code') {
									codeHtml += `<div class="case-code-line">${item.html}</div>`;
								} else if (item.type === 'bubble') {
									const shoulder = 20;
									if (item.isRightSide && item.colIndex !== null) {
										// Benchmark: target word is on the RIGHT side of the principle card (> 30 columns)
										// Starting point: RIGHT
										const rightEdge = Math.round(item.colIndex * 8.2 + shoulder);
										const bubbleClass = 'cmt-bubble cmt-bubble-right';
										codeHtml += `<div class="${bubbleClass}" style="--right-edge: ${rightEdge}px; --tail-shoulder: ${shoulder}px;"><span class="text">${renderComment(item.text)}</span></div>`;
									} else {
										// Benchmark: target word is on the LEFT side of the principle card (<= 30 columns)
										// Starting point: LEFT
										const tokenStyle = item.tokenOffset !== null && item.tokenOffset !== undefined ? ` --token-offset: ${item.tokenOffset}px;` : '';
										codeHtml += `<div class="cmt-bubble" style="--indent-offset: ${item.indentOffset}px;${tokenStyle}"><span class="text">${renderComment(item.text)}</span></div>`;
									}
								}
							}

							return { codeHtml, noteHtml: '' };
						}

						let casesHtml = '';
						if (doThis || doNot) {
							const reactLogoSvg = `<svg class="react-logo-bg" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M410.66,180.72h0q-7.67-2.62-15.45-4.88,1.29-5.25,2.38-10.56c11.7-56.9,4.05-102.74-22.06-117.83-25-14.48-66,.61-107.36,36.69q-6.1,5.34-11.95,11-3.9-3.76-8-7.36c-43.35-38.58-86.8-54.83-112.88-39.69-25,14.51-32.43,57.6-21.9,111.53q1.58,8,3.55,15.93c-6.15,1.75-12.09,3.62-17.77,5.6C48.46,198.9,16,226.73,16,255.59c0,29.82,34.84,59.72,87.77,77.85q6.44,2.19,13,4.07Q114.64,346,113,354.68c-10,53-2.2,95.07,22.75,109.49,25.77,14.89,69-.41,111.14-37.31q5-4.38,10-9.25,6.32,6.11,13,11.86c40.8,35.18,81.09,49.39,106,34.93,25.75-14.94,34.12-60.14,23.25-115.13q-1.25-6.3-2.88-12.86,4.56-1.35,8.93-2.79c55-18.27,90.83-47.81,90.83-78C496,226.62,462.5,198.61,410.66,180.72Zm-129-81.08c35.43-30.91,68.55-43.11,83.65-34.39h0c16.07,9.29,22.32,46.75,12.22,95.88q-1,4.8-2.16,9.57a487.83,487.83,0,0,0-64.18-10.16,481.27,481.27,0,0,0-40.57-50.75Q276,104.57,281.64,99.64ZM157.73,280.25q6.51,12.6,13.61,24.89,7.23,12.54,15.07,24.71a435.28,435.28,0,0,1-44.24-7.13C146.41,309,151.63,294.75,157.73,280.25Zm0-48.33c-6-14.19-11.08-28.15-15.25-41.63,13.7-3.07,28.3-5.58,43.52-7.48q-7.65,11.94-14.72,24.23T157.7,231.92Zm10.9,24.17q9.48-19.77,20.42-38.78h0q10.93-19,23.27-37.13c14.28-1.08,28.92-1.65,43.71-1.65s29.52.57,43.79,1.66q12.21,18.09,23.13,37t20.69,38.6Q334,275.63,323,294.73h0q-10.91,19-23,37.24c-14.25,1-29,1.55-44,1.55s-29.47-.47-43.46-1.38q-12.43-18.19-23.46-37.29T168.6,256.09ZM340.75,305q7.25-12.58,13.92-25.49h0a440.41,440.41,0,0,1,16.12,42.32A434.44,434.44,0,0,1,326,329.48Q333.62,317.39,340.75,305Zm13.72-73.07q-6.64-12.65-13.81-25h0q-7-12.18-14.59-24.06c15.31,1.94,30,4.52,43.77,7.67A439.89,439.89,0,0,1,354.47,231.93ZM256.23,124.48h0a439.75,439.75,0,0,1,28.25,34.18q-28.35-1.35-56.74,0C237.07,146.32,246.62,134.87,256.23,124.48ZM145.66,65.86c16.06-9.32,51.57,4,89,37.27,2.39,2.13,4.8,4.36,7.2,6.67A491.37,491.37,0,0,0,201,160.51a499.12,499.12,0,0,0-64.06,10q-1.83-7.36-3.3-14.82h0C124.59,109.46,130.58,74.61,145.66,65.86ZM122.25,317.71q-6-1.71-11.85-3.71c-23.4-8-42.73-18.44-56-29.81C42.52,274,36.5,263.83,36.5,255.59c0-17.51,26.06-39.85,69.52-55q8.19-2.85,16.52-5.21a493.54,493.54,0,0,0,23.4,60.75A502.46,502.46,0,0,0,122.25,317.71Zm111.13,93.67c-18.63,16.32-37.29,27.89-53.74,33.72h0c-14.78,5.23-26.55,5.38-33.66,1.27-15.14-8.75-21.44-42.54-12.85-87.86q1.53-8,3.5-16a480.85,480.85,0,0,0,64.69,9.39,501.2,501.2,0,0,0,41.2,51C239.54,405.83,236.49,408.65,233.38,411.38Zm23.42-23.22c-9.72-10.51-19.42-22.14-28.88-34.64q13.79.54,28.08.54c9.78,0,19.46-.21,29-.64A439.33,439.33,0,0,1,256.8,388.16Zm124.52,28.59c-2.86,15.44-8.61,25.74-15.72,29.86-15.13,8.78-47.48-2.63-82.36-32.72-4-3.44-8-7.13-12.07-11a484.54,484.54,0,0,0,40.23-51.2,477.84,477.84,0,0,0,65-10.05q1.47,5.94,2.6,11.64h0C383.81,377.58,384.5,399.56,381.32,416.75Zm17.4-102.64h0c-2.62.87-5.32,1.71-8.06,2.53a483.26,483.26,0,0,0-24.31-60.94,481.52,481.52,0,0,0,23.36-60.06c4.91,1.43,9.68,2.93,14.27,4.52,44.42,15.32,71.52,38,71.52,55.43C475.5,274.19,446.23,298.33,398.72,314.11Z"/><path d="M256,298.55a43,43,0 1,0-42.86-43A42.91,42.91,0,0,0,256,298.55Z"/></svg>`;
							const reactLogoWatermark = compactPrinciples ? '' : `<div class="case-react-bg">${reactLogoSvg}</div>\n        `;
							casesHtml += '    <div class="principle-cases-grid">\n';
							if (doThis) {
								const doLabel = isBestPractice ? 'It is best practice to do this:' : 'We should do this:';
								const doIconSvg = isBestPractice
									? `<svg class="case-icon icon-badge-check" viewBox="0 0 20 20" fill="currentColor">\n` +
									  `            <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />\n` +
									  `          </svg>`
									: `<svg class="case-icon icon-check" viewBox="0 0 20 20" fill="currentColor">\n` +
									  `            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />\n` +
									  `          </svg>`;
								const processedDo = processCaseSnippet(doThis, pNum, 'do', currentMdFile);
								const doWatermark = compactPrinciples ? '' : `<div class="case-watermark-bg">${doIconSvg}</div>\n        `;
								casesHtml += `      <div class="principle-case principle-case-do">\n` +
											 `        ${doWatermark}${reactLogoWatermark}<div class="case-header">\n` +
											 `          <div class="case-icon-col">${doIconSvg}</div>\n` +
											 `          <div class="case-label">${doLabel}</div>\n` +
											 `        </div>\n` +
											 `        <div class="case-code">${processedDo.codeHtml}</div>\n` +
											 `${processedDo.noteHtml}` +
											 `      </div>\n`;
							}
							if (doNot) {
								const dontLabel = isBestPractice ? 'Instead of doing this:' : 'We should not do this:';
								const dontCardClass = isBestPractice ? 'principle-case principle-case-warn' : 'principle-case principle-case-dont';
								const dontIconSvg = isBestPractice
									? `<svg class="case-icon icon-alert-triangle" viewBox="0 0 20 20" fill="currentColor">\n` +
									  `            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />\n` +
									  `          </svg>`
									: `<svg class="case-icon icon-cross" viewBox="0 0 20 20" fill="currentColor">\n` +
									  `            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />\n` +
									  `          </svg>`;
								const processedDont = processCaseSnippet(doNot, pNum, 'dont', currentMdFile);
								const dontWatermark = compactPrinciples ? '' : `<div class="case-watermark-bg">${dontIconSvg}</div>\n        `;
								casesHtml += `      <div class="${dontCardClass}">\n` +
											 `        ${dontWatermark}${reactLogoWatermark}<div class="case-header">\n` +
											 `          <div class="case-icon-col">${dontIconSvg}</div>\n` +
											 `          <div class="case-label">${dontLabel}</div>\n` +
											 `        </div>\n` +
											 `        <div class="case-code">${processedDont.codeHtml}</div>\n` +
											 `${processedDont.noteHtml}` +
											 `      </div>\n`;
							}
							casesHtml += '    </div>\n';
						}

						const topRowClass = glossaryItems.length > 0 ? 'principle-top-row' : 'principle-top-row no-glossary';
						const topRowHtml = `    <div class="${topRowClass}">\n` +
								(glossaryHtml ? `${glossaryHtml}` : '') +
								`      <div class="principle-definition-card">\n` +
								`        ${defHtml}\n` +
								`      </div>\n` +
								`    </div>\n`;

						const principleClass = compactPrinciples ? 'callout callout-principle compact' : 'callout callout-principle';
						html += `<aside class="${principleClass}" data-principle="${pNum}">\n` +
								`  <div class="principle-header">\n` +
								`    <div class="principle-ribbon-tab"><span class="principle-num">PRINCIPLE ${pNum}</span></div>\n` +
								`    <h4 class="principle-title">${inline(pTitle, false)}</h4>\n` +
								`  </div>\n` +
								`  <div class="principle-body">\n` +
								`${topRowHtml}` +
								`    ${casesHtml}` +
								`  </div>\n` +
								`</aside>\n`;
						break;
					}
				}
				// Each alert type gets an on-brand eyebrow label. TIP is the project's
				// signature (interview-prep framing) → "Interview Tip"; the others use
				// GitHub-standard labels for when authors reach for them.
				const eyebrow = {
					tip: 'Interview Tip',
					note: 'Note',
					key: 'Key Takeaway',
					warning: 'Warning',
					caution: 'Caution',
					wild: '⚡ IN THE WILD',
					grounding: '⚡ IN THE WILD',
					convention: 'UI & Domain Convention',
					principle: 'React Principle',
				}[b.kind] || 'Tip';
				const paras = b.text.split(/\n\s*\n/).filter(Boolean);
				const bodyHtml = paras.length > 1
					? paras.map((p) => `<p>${inline(p, true)}</p>`).join('\n  ')
					: inline(b.text, true);
				html += `<aside class="callout callout-${b.kind}">\n  <p class="callout-eyebrow">${eyebrow}</p>\n  <div class="callout-body">${bodyHtml}</div>\n</aside>\n`;
				break;
			}
			case 'ul': {
				function renderUlItems(items) {
					const hasOptions = items.some(item => {
						const txt = (typeof item === 'string' ? item : item.text || '').trim();
						return /^(➔\s*)?\*\*Option\s+\d+/i.test(txt) || /^➔\s+/.test(txt);
					});
					let res = hasOptions ? '<ul class="options-list">\n' : '<ul>\n';
					for (const item of items) {
						let rawText = typeof item === 'string' ? item : item.text;
						let cleanText = (rawText || '').trim();
						let isOption = /^(➔\s*)?\*\*Option\s+\d+/i.test(cleanText) || /^➔\s+/.test(cleanText);
						if (cleanText.startsWith('➔')) {
							cleanText = cleanText.replace(/^➔\s*/, '');
						}
						const liCls = isOption ? ' class="option-item"' : '';
						if (typeof item === 'string') {
							res += `<li${liCls}>${inline(cleanText, true)}</li>\n`;
						} else {
							let sub = '';
							if (item.children && item.children.length > 0) {
								sub = '\n' + renderUlItems(item.children);
							}
							res += `<li${liCls}>${inline(cleanText, true)}${sub}</li>\n`;
						}
					}
					res += '</ul>\n';
					return res;
				}
				html += renderUlItems(b.items);
				break;
			}
			case 'ol': {
				const items = b.items.map((item) => {
					if (Array.isArray(item)) {
						let prevType = null;
						const itemHtml = item.map((p) => {
							if (p.type === 'code') {
								prevType = 'code';
								return p.content;
							}
							let txt = p.content;
							if (prevType === 'code') {
								txt = txt.replace(/^<br\s*\/?>\s*/i, '');
							}
							prevType = 'text';
							return inline(txt, true);
						}).join('\n');
						return `<li>${itemHtml}</li>`;
					}
					return `<li>${inline(item, true)}</li>`;
				}).join('\n');
				if (!seenHeading) {
					// The Hook Ladder: the build owns the lead sentence and the
					// wrapper div so every lecture's ladder is styled and worded
					// identically. Authors write only the numbered beats.
					html += `<div class="hook-ladder">\n<p class="hook-ladder-lead">Imagine this scenario:</p>\n<ol>${items}</ol>\n</div>\n`;
				} else {
					html += `<ol>${items}</ol>\n`;
				}
				break;
			}
			case 'p': {
				const trimmed = b.text.trim();
				if (trimmed.startsWith('❒')) {
					const cleanText = trimmed.replace(/^❒\s*/, '');
					html += `<div class="summary-subtitle"><span class="summary-symbol">❒</span> <span class="summary-title">${inline(cleanText, true)}</span></div>\n`;
				} else if (trimmed.startsWith('➔')) {
					html += `<p class="summary-principle">${inline(b.text, true)}</p>\n`;
				} else {
					html += `<p>${inline(b.text, true)}</p>\n`;
				}
				break;
			}
			case 'table': {
				const isReviewTable = b.header && b.header[0] && b.header[0].includes('You need to do this');
				
				if (isReviewTable) {
					// We'll generate a custom <div> structure instead of a standard table
					html += `<div class="review-table">\n`;
					
					// Optional header row
					html += `<div class="review-header-row">
						<div class="review-header-left">Scenario / Objective</div>
						<div class="review-header-right">Implementation Rules</div>
					</div>\n`;
					
					for (const row of b.rows) {
						let leftCol = row[0] || '';
						let rightCol = row[1] || '';
						
						// Parse Left Column: "**Question**<br>Context"
						let leftHtml = inline(leftCol);
						const leftParts = leftCol.split('<br>');
						if (leftParts.length >= 2 && leftParts[0].trim().startsWith('**') && leftParts[0].trim().endsWith('**')) {
							const q = leftParts[0].trim().slice(2, -2);
							const ctx = leftParts.slice(1).join('<br>');
							leftHtml = `<h4 class="review-question">${inline(q)}</h4><p class="review-context">${inline(ctx)}</p>`;
						}
						
						// Parse Right Column: "✔️ Do<br><br>`code`<br><br>✖️ Dont<br><br>`code`"
						let rightHtml = '';
						if (rightCol.includes('✔️') || rightCol.includes('✖️')) {
							const parts = rightCol.split('✖️');
							const doPart = parts[0] ? parts[0].replace('✔️', '').trim() : '';
							const dontPart = parts[1] ? parts[1].trim() : '';
							
							const renderBlock = (text, type) => {
								if (!text) return '';
								const lines = text.split('<br><br>');
								const pText = lines[0];
								let codeHtml = '';
								if (lines.length > 1) {
									const rest = lines.slice(1).join('<br><br>');
									codeHtml = `<div class="review-code">${inline(rest)}</div>`;
								}
								
								const icon = type === 'do' 
									? `<svg class="review-icon do-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
									: `<svg class="review-icon dont-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
								const label = type === 'do' ? 'Correct:' : 'Warning:';
								
								return `<div class="review-block ${type}-block">
									<div class="review-flex">
										${icon}
										<div class="review-content">
											<p><span class="review-label ${type}-label">${label}</span> ${inline(pText)}</p>
											${codeHtml}
										</div>
									</div>
								</div>`;
							};
							
							rightHtml = renderBlock(doPart, 'do') + renderBlock(dontPart, 'dont');
						} else {
							rightHtml = inline(rightCol);
						}
						
						html += `<div class="review-row">
							<div class="review-col-left">${leftHtml}</div>
							<div class="review-col-right">${rightHtml}</div>
						</div>\n`;
					}
					
					html += `</div>\n`;
					
				} else {
					const isClosingTable = b.header && b.header[0] === '' && b.header.length <= 3;
					const tableClass = isClosingTable ? 'comparison-table' : `reference-table cols-${b.header.length}`;
					const head = `<thead><tr>${b.header.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>`;
					const body = `<tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
					html += `<table class="${tableClass}">${head}${body}</table>\n`;
				}
				break;
			}
		}
	}
	if (inH3) {
		html += '</div>\n';
	}
	return html;
}

/* ---------------- page template ---------------- */

const page = (title, body, theme = 'teal', cssHref = '../src/lecture.css', edition = compoundVersion) => {
	const activeVer = edition || compoundVersion;
	const displayTitle = title.includes(activeVer) ? title : `${title} — Edition ${activeVer}`;
	return `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8">
<title>${displayTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Merriweather:ital,wght@1,400;1,700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${cssHref}">
<style>
@page {
	@bottom-center {
		content: "Edition ${activeVer}";
		border-top: 0.5pt solid #e2e8f0;
		padding-top: 3.5mm;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		font-size: 7.5pt;
		font-weight: 600;
		color: #94a3b8;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
}
</style>
</head>
<body class="theme-${theme}">
<main>
${body}
</main>
</body>
</html>
`;
};

// The reader HTML lives next to the per-lecture HTML files (in 01-03-md-lectures-HTML/),
// so it shares the same relative path to the stylesheet.
const deckPage = (title, body, theme = 'teal', cssHref = '../src/lecture.css', edition = compoundVersion) => page(title, body, theme, cssHref, edition);

/* ---------------- lecture format checks (warnings, never blocking) ---------------- */

// The build is the only gate every author model passes through, so the format
// rules that kept regressing under context pressure live here as plain
// warnings in the build log. The warning list doubles as the polish model's
// work list.
function evaluateCodeComplexity(code) {
	const lines = code.trim().split('\n').filter(l => l.trim().length > 0);
	const lineCount = lines.length;
	const hooks = (code.match(/\buse[A-Z]\w+\b/g) || []).length;
	const setters = (code.match(/\bset[A-Z]\w+\b/g) || []).length;
	const domApis = (code.match(/(\.focus\(|\.getBoundingClientRect\(|document\.|window\.|setInterval|clearInterval|addEventListener)/g) || []).length;
	const branches = (code.match(/(\?|&&|\bif\s*\()/g) || []).length;
	const funcs = (code.match(/\bfunction\s+\w+/g) || []).length;
	const internalFuncs = Math.max(0, funcs - 1);
	const score = lineCount + (hooks * 3) + (internalFuncs * 3) + (setters * 2) + (domApis * 4) + (branches * 2);
	return { lineCount, hooks, internalFuncs, setters, domApis, branches, score };
}

function checkLecture(file, md) {
	const warns = [];
	const lines = md.split('\n');

	if (!/^# Lecture \d+: \S/.test(lines[0] || '')) warns.push(`title line is not "# Lecture {n}: {Short Title}"`);
	if (!/^>\s*INTERVIEW QUESTION\s*\|\s*❱+\s*[A-Z]+(\s*\(Server\))?\s*\|/.test(lines[1] || '')) warns.push(`line 2 is not the "> INTERVIEW QUESTION | ❱ TIER |" callout`);
	if (!/\[!(TIP|NOTE|KEY|WARNING|CAUTION|WILD|GROUNDING|CONVENTION|PRINCIPLE)\]/.test(md)) warns.push(`no alert callout ([!TIP] etc.) anywhere in the lecture`);
	if (!/```(?:components|component-code)/.test(md)) warns.push(`no "components" Rendered UI Canvas or "component-code" panel found in the lecture`);
	if (!/```(?:figure|html-figure)/.test(md)) warns.push(`no "html-figure" HTML figure panel (mandatory in every lecture; embed at least one 01-02-md-LECTURES/figures/ RCE panel)`);

	// The completeness law: every file the lecture shows (fence title) or
	// imports must appear as an entry in a components panel tree.
	const treeFiles = new Set();
	for (const block of md.matchAll(/```(?:components|component-code|files)[^\n]*\n([\s\S]*?)```/g)) {
		for (const line of block[1].split('\n')) {
			const first = line.split('|')[0].trim();
			if (first) treeFiles.add(first.replace(/^\.\//, '').split('/').pop());
		}
	}
	const shownFiles = new Set();
	for (const m of md.matchAll(/title="([^"]+)"/g)) {
		if (/\.(jsx|tsx|js|ts)$/.test(m[1])) shownFiles.add(m[1].split('/').pop());
	}
	const codeMd = md.replace(/```(?:bash|sh|text|diff)[\s\S]*?```/g, '').replace(/>\s*\[!PRINCIPLE\][\s\S]*?(?=\n\s*\n(?!>))/g, '');
	for (const m of codeMd.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
		shownFiles.add(m[1].split('/').pop());
	}
	for (const f of shownFiles) {
		if (!treeFiles.has(f)) warns.push(`file "${f}" is fenced or imported but missing from the components panel tree`);
	}

	// Component Explorer Hygiene: no conversational commentary, no em-dashes in renders field
	for (const block of md.matchAll(/```components[^\n]*\n([\s\S]*?)```/g)) {
		for (const line of block[1].split('\n')) {
			const parts = line.split('|').map(s => s.trim());
			if (parts.length >= 4) {
				const renders = parts[3];
				if (/\(Hidden:\s*/i.test(renders)) {
					warns.push(`components panel renders field "${renders}" contains developer commentary "(Hidden: ...)"; display authentic rendered UI only`);
				}
				if (/—/.test(renders)) {
					warns.push(`components panel renders field "${renders}" contains an em-dash; ban em-dashes`);
				}
			}
		}
	}
	if (!/^### Glossary\s*$/m.test(md)) {
		warns.push(`no "### Glossary" section (mandatory; place 4 to 6 terms directly after "### Where you will meet this" and before "### Summary")`);
	}
	if (!/^### Summary\s*$/m.test(md)) {
		warns.push(`no "### Summary" section`);
	} else {
		const summaryMatch = md.match(/^### Summary\s*\n+([^\n]+)/m);
		if (summaryMatch && /^\s*Look\b/i.test(summaryMatch[1])) {
			warns.push(`summary starts with conversational filler "${summaryMatch[1].slice(0, 20)}..."; start directly with practical context`);
		}
	}

	// Law 18 / Cognitive Complexity Gate:
	// Flag severe monolithic code dumps (>30 lines unconditionally, or >20 lines with CCI >= 35).
	// Spares low-complexity, purely declarative wrappers (e.g. InteractiveFeed.jsx in Lec 14).
	const [bodyContent, summaryContent] = md.split(/^### Summary\s*$/m);
	for (const m of bodyContent.matchAll(/```([a-z0-9_\-]+)?([^\n]*)\n([\s\S]*?)```/g)) {
		const tag = ((m[1] || '') + m[2]).trim();
		if (tag.startsWith('components') || tag.startsWith('files') || tag.startsWith('component-code') || tag.startsWith('html-figure')) continue;
		const code = m[3];
		const { lineCount, score } = evaluateCodeComplexity(code);
		if (lineCount > 30 || (lineCount > 20 && score >= 35)) {
			const titleMatch = tag.match(/title=["']([^"']+)["']/);
			const title = titleMatch ? titleMatch[1] : tag;
			warns.push(`body code fence "${title}" is a severe monolithic dump (${lineCount} lines, complexity score ${score} >= 35); decompose into progressive, scaffolded steps (Law 18)`);
		}
	}

	// Continuation Chain Protocol (Lecture 38 Benchmark):
	// If a component file is decomposed across multiple code fences in the body,
	// it must form a valid contiguous continuation chain with sequential line numbering.
	const bodyFences = [];
	for (const m of bodyContent.matchAll(/```([a-z0-9_\-]+)?([^\n]*)\n([\s\S]*?)```/g)) {
		const tag = ((m[1] || '') + m[2]).trim();
		if (tag.startsWith('components') || tag.startsWith('files') || tag.startsWith('component-code') || tag.startsWith('html-figure')) continue;
		const code = m[3];
		const titleMatch = tag.match(/title=["']([^"']+)["']/);
		const title = titleMatch ? titleMatch[1] : null;
		const contMatch = tag.match(/continues=["']([^"']+)["']/);
		const continues = contMatch ? contMatch[1] : null;
		const startLineMatch = tag.match(/startLine=["'](\d+)["']/);
		const startLine = startLineMatch ? parseInt(startLineMatch[1], 10) : null;
		bodyFences.push({ index: m.index, tag, title, continues, startLine, code });
	}

	let currentChainFile = null;
	const fileChains = new Map();
	for (const f of bodyFences) {
		let file = f.title;
		if (!file && currentChainFile && f.continues) {
			file = currentChainFile;
		}
		if (file && /\.(jsx|js|tsx|ts)$/.test(file)) {
			if (!fileChains.has(file)) fileChains.set(file, []);
			fileChains.get(file).push(f);
			if (f.continues === 'bottom' || f.continues === 'both') {
				currentChainFile = file;
			} else {
				currentChainFile = null;
			}
		} else {
			currentChainFile = null;
		}
	}

	for (const [file, flist] of fileChains) {
		if (flist.length > 1) {
			const isProgressiveAssembly = flist.some(f => 
				f.continues !== null ||
				!f.code.includes('export default') ||
				!f.code.trim().endsWith('}')
			);
			if (isProgressiveAssembly) {
				for (let i = 0; i < flist.length; i++) {
					const f = flist[i];
					if (!f.continues || !f.startLine) {
						warns.push(`component "${file}" is sliced across ${flist.length} fences but fence ${i + 1} lacks continuation markers (startLine, continues="bottom"|"both"|"top"); see Lecture 38 benchmark`);
						break;
					}
					if (i === 0 && f.continues !== 'bottom') {
						warns.push(`component "${file}" continuation chain begins with invalid continues="${f.continues}" (must be "bottom")`);
					} else if (i === flist.length - 1 && f.continues !== 'top') {
						warns.push(`component "${file}" continuation chain ends with invalid continues="${f.continues}" (must be "top")`);
					} else if (i > 0 && i < flist.length - 1 && f.continues !== 'both') {
						warns.push(`component "${file}" intermediate fence ${i + 1} has invalid continues="${f.continues}" (must be "both")`);
					}
					if (i > 0 && f.startLine <= flist[i - 1].startLine) {
						warns.push(`component "${file}" continuation fence ${i + 1} has invalid startLine="${f.startLine}" (must be greater than previous fence startLine="${flist[i - 1].startLine}")`);
					}
				}

				// Multi-step Progressive Assembly Pipeline Figure Law (Lecture 38/39 Benchmark):
				// Sliced progressive assembly must be preceded by an introductory
				// code-assembly-pipeline figure before Step 1.
				const htmlFigures = [];
				for (const fig of bodyContent.matchAll(/```(?:html-figure|figure)\b([^\n]*)/g)) {
					const attrsStr = fig[1];
					const srcMatch = attrsStr.match(/src=["']([^"']+)["']/);
					const src = srcMatch ? srcMatch[1] : '';
					htmlFigures.push({ index: fig.index, src });
				}

				const pipelineFig = htmlFigures.find(f => {
					if (f.src.includes('pipeline')) return true;
					if (f.src) {
						try {
							const p = join(ROOT, f.src);
							if (existsSync(p)) return readFileSync(p, 'utf8').includes('pipeline-card-figure');
							const p2 = join(dirs.mdLectures, f.src);
							if (existsSync(p2)) return readFileSync(p2, 'utf8').includes('pipeline-card-figure');
							if (dirs.mdLecturesBase) {
								const p3 = join(dirs.mdLecturesBase, f.src);
								if (existsSync(p3)) return readFileSync(p3, 'utf8').includes('pipeline-card-figure');
							}
						} catch (e) {}
					}
					return false;
				});

				const firstFenceIndex = flist[0].index !== undefined ? flist[0].index : bodyContent.indexOf(flist[0].code);
				if (!pipelineFig) {
					warns.push(`component "${file}" is decomposed across ${flist.length} progressive assembly steps but lacks an introductory code-assembly-pipeline html-figure (e.g. "figures/{NN}-01-code-assembly-pipeline.html"); see Lecture 38 benchmark`);
				} else if (pipelineFig.index > firstFenceIndex) {
					warns.push(`code-assembly-pipeline figure "${pipelineFig.src}" appears after Step 1 of component "${file}"; place it immediately before the progressive assembly steps`);
				}
			}
		}
	}

	// Constructive Staging Gate (react-06 skills: lecture-structure Practical Example 16-21,
	// pre-lecture Staging 34, verification Structure Gates 16): a lecture that builds an
	// example from 2 or more component files must stage the 5-stage practical example.
	// Rule batch #2026_09_20_02_group_1 (registry: skills/RULE-TAGS.md, brief: brief/brief_2026_09_20_02.md). The 4-phase flow check was removed by #2026_09_20_05_group_1.
	const builtComponents = new Set();
	for (const f of bodyFences) {
		if (f.title && /\.(jsx|tsx)$/.test(f.title)) builtComponents.add(f.title.split('/').pop());
	}
	const hasPracticalExample = /^### Let's Design a Practical Example\b/m.test(bodyContent);
	if (builtComponents.size >= 2 && !hasPracticalExample) {
		const names = [...builtComponents].slice(0, 4).join(', ') + (builtComponents.size > 4 ? ', ...' : '');
		warns.push(`lecture builds ${builtComponents.size} component files (${names}) but has no "### Let's Design a Practical Example" 5-stage section (files panel, assembly pipeline figure, Step 1-4 build, Component Summary, Architecture Audit table); see lecture-structure skill Practical Example 16-21`);
	}
	if (hasPracticalExample) {
		if (!/```files/.test(md)) {
			warns.push(`practical example is missing its Stage A "files" panel (disk hierarchy with roles); see lecture-structure skill Practical Example 22`);
		}
		const stepMatches = [...bodyContent.matchAll(/^### Step (\d+):[^\n]+/gm)];
		const stepNums = stepMatches.map((m) => parseInt(m[1], 10));
		if (stepNums.length < 2 || stepNums.length > 4) {
			warns.push(`practical example Stage C must have between 2 and 4 sequential steps (found ${stepNums.length}); see lecture-structure skill Practical Example 16`);
		} else {
			for (let i = 0; i < stepNums.length; i++) {
				if (stepNums[i] !== i + 1) {
					warns.push(`practical example Stage C step headings must be numbered sequentially starting from 1 (expected Step ${i + 1}, found Step ${stepNums[i]})`);
				}
			}
		}
		const pipelineMatch = bodyContent.match(/```(?:html-figure|figure)\b[^\n]*src=["']([^"']*code-assembly-pipeline[^"']*)["']/);
		if (!pipelineMatch) {
			warns.push(`practical example is missing its Stage B assembly pipeline figure (figures/{NN}-01-code-assembly-pipeline.html placed before Step 1); see lecture-structure skill Practical Example 23`);
		} else {
			const figureRelPath = pipelineMatch[1];
			let figPath = join(ROOT, figureRelPath);
			if (!existsSync(figPath)) {
				figPath = join(dirs.mdLectures, figureRelPath);
			}
			if (!existsSync(figPath) && dirs.mdLecturesBase) {
				figPath = join(dirs.mdLecturesBase, figureRelPath);
			}
			if (existsSync(figPath)) {
				const figHtml = readFileSync(figPath, 'utf8');
				if (/background(?:-color)?:\s*(?:#f8fafc|#ffffff)\b/i.test(figHtml)) {
					warns.push(`assembly pipeline figure "${figureRelPath}" uses banned bleached background (#f8fafc / #ffffff) on card containers; must use canonical Template 09 pastel palette on .card-main (see figures skill Section 26B)`);
				}
				const canonicalPastels = [
					['#d4e1f1', 'Step 1 blue (#d4e1f1)'],
					['#d0e6e1', 'Step 2 teal (#d0e6e1)'],
					['#f9e0c5', 'Step 3 amber (#f9e0c5)'],
					['#d2ebc9', 'Step 4 green (#d2ebc9)'],
				];
				const numExpectedPastels = Math.min(Math.max(stepNums.length || 4, 2), 4);
				for (let i = 0; i < numExpectedPastels; i++) {
					const [hex, label] = canonicalPastels[i];
					if (!figHtml.toLowerCase().includes(hex)) {
						warns.push(`assembly pipeline figure "${figureRelPath}" is missing canonical Template 09 pastel color ${label} on .card-main (see figures skill Section 26B)`);
					}
				}
				if (/\.card-[1-4]\b/.test(figHtml)) {
					warns.push(`assembly pipeline figure "${figureRelPath}" uses legacy mutated class names (.card-1..4); must use canonical .step-1, .step-2, .step-3, .step-4 (see figures skill Section 26B)`);
				}
			}
		}
		if (!/^### (?:Lessons from the Experiment|Component Summary)\b/m.test(bodyContent)) {
			warns.push(`practical example is missing its Stage D "### Component Summary" section; see lecture-structure skill Section 19`);
		}
		if (!/```component-code\b[^\n]*title=["']Summary: (?:The Logic of Nested Components|Project Architecture & File Hierarchy|Project Scaffolding & File Hierarchy|The Scaffolded File Hierarchy)["']/.test(bodyContent)) {
			warns.push(`practical example Stage D is missing its component-code role panel (titled "Summary: The Logic of Nested Components" or "Summary: Project Architecture & File Hierarchy"); see lecture-structure skill Section 20 and ui-panels skill Section 21`);
		}
		if (!/```(?:html-figure|figure)\b[^\n]*src=["'][^"']*architecture-audit/.test(bodyContent)) {
			warns.push(`practical example is missing its Stage E Architecture Audit Table figure (figures/{NN}-02-architecture-audit.html); see lecture-structure skill Practical Example 26`);
		}
	}

	// Strict 10-Line Ceiling (react-06 skills: code-blocks, verification Structure Gates 17):
	// every body code fence holds at most 10 executable lines unless it is a slice of a
	// validated continuation chain (slices carry continues/startLine markers).
	for (const f of bodyFences) {
		const { lineCount } = evaluateCodeComplexity(f.code);
		if (lineCount > 10 && !f.continues) {
			warns.push(`body code fence "${f.title || f.tag}" exceeds the 10-line ceiling (${lineCount} lines) without continuation markers; slice into progressive steps (verification Structure Gates 17)`);
		}

		// Deterministic Code Block Invariants: orphan tokens, tilde parity, line width
		const blockLines = f.code.split('\n');
		for (let idx = 0; idx < blockLines.length; idx++) {
			const bl = blockLines[idx];
			const trimmed = bl.trim();
			if (!trimmed) continue;
			const tildeCount = (bl.match(/~/g) || []).length;
			if (tildeCount % 2 !== 0) {
				warns.push(`code fence "${f.title || f.tag}" line ${idx + 1} has unclosed or odd tildes: "${trimmed}"`);
			}
			const hasComment = (bl.includes('//') && !bl.includes('://')) || bl.includes('<!--') || bl.match(/#\s+\S+/);
			const tildeMatch = bl.match(/~([^~]+)~/);
			if (tildeMatch && !hasComment) {
				warns.push(`code fence "${f.title || f.tag}" line ${idx + 1} has orphan target token "~${tildeMatch[1]}~" without a trailing comment`);
			}
			if (bl.length > 80) {
				warns.push(`code fence "${f.title || f.tag}" line ${idx + 1} exceeds 80 characters (${bl.length} chars): "${trimmed.slice(0, 50)}..."`);
			}
		}
	}

	// Invariant 9: Zero multi-line code in content (ban raw code passed as simple prose text)
	let inFence = false;
	let consecutiveProseCode = [];
	for (let idx = 0; idx < lines.length; idx++) {
		const l = lines[idx];
		if (l.startsWith('```')) {
			inFence = !inFence;
			consecutiveProseCode = [];
			continue;
		}
		if (inFence) continue;
		if (!l.startsWith('>')) {
			const trimmed = l.trim();
			if (/^\s*\*(?:It is best practice to do this|Instead of doing this|We should do this|We should not do this|Do This|Do Not Do This):\*/i.test(trimmed)) {
				warns.push(`line ${idx + 1} has unquoted principle card header outside callout: "${trimmed}"`);
			}
			if (/^`[^`]+`$/.test(trimmed)) {
				consecutiveProseCode.push({ lineNum: idx + 1, text: trimmed });
				if (consecutiveProseCode.length === 2) {
					warns.push(`line ${consecutiveProseCode[0].lineNum} has multi-line code passed as simple prose text (Invariant 9 violation)`);
				}
			} else if (trimmed.length > 0) {
				consecutiveProseCode = [];
			}
		} else {
			consecutiveProseCode = [];
		}
	}

	if (summaryContent) {
		for (const m of summaryContent.matchAll(/```([a-z0-9_\-]+)?([^\n]*)\n([\s\S]*?)```/g)) {
			const tag = ((m[1] || '') + m[2]).trim();
			const code = m[3];
			const lines = code.trim().split('\n').filter(l => l.trim().length > 0);
			if (lines.length > 20) {
				const titleMatch = tag.match(/title=["']([^"']+)["']/);
				const title = titleMatch ? titleMatch[1] : tag;
				warns.push(`summary code fence "${title}" is too long (${lines.length} lines > 20 max)`);
			}
		}
	}

	// The closing comparison table: the last pipe-block in the file.
	const pipeIdx = lines.map((l, i) => l.trim().startsWith('|') ? i : -1).filter((i) => i >= 0);
	if (!pipeIdx.length) {
		warns.push(`no markdown table in the lecture`);
	} else {
		let start = pipeIdx[pipeIdx.length - 1];
		while (start - 1 >= 0 && lines[start - 1].trim().startsWith('|')) start--;
		const headerCells = lines[start].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
		const divider = (lines[start + 1] || '').trim();
		if (headerCells[0] !== '') warns.push(`closing table's first header cell is not empty (start the header row with "| |")`);
		if (!/^\|\s*---:\s*\|(\s*:?---\s*\|)+$/.test(divider)) warns.push(`closing table's divider row is not "| ---: | :--- | ..."`);
		const lastNonBlank = [...lines].reverse().find((l) => l.trim() !== '') || '';
		if (!lastNonBlank.trim().startsWith('|')) warns.push(`lecture does not end with the comparison table`);

		// Check for un-split long code strings in table rows that cause PDF padding breaks
		for (let r = start; r < lines.length; r++) {
			const l = lines[r].trim();
			if (!l.startsWith('|')) break;
			for (const m of l.matchAll(/`([^`]+)`/g)) {
				const codeStr = m[1];
				if (codeStr.length > 20) {
					warns.push(`table row ${r + 1} has long code string "\`${codeStr}\`" (${codeStr.length} chars); split with <br> across separate backticks to prevent ugly PDF padding breaks`);
				}
			}
		}
	}
	return warns;
}

/* ---------------- build ---------------- */

function buildDirectory(inputDir, htmlDir, pdfDir, deckTitle, checkFormat = false, deckFileName = 'deck', alwaysBuildDeck = false) {
	try {
		mkdirSync(htmlDir, { recursive: true });
		mkdirSync(pdfDir, { recursive: true });
	} catch (e) { /* ignore */ }

	const cssRelPath = relative(htmlDir, join(ROOT, 'src/lecture.css'));

	let rangeStart = null;
	let rangeEnd = null;
	if (rangeArg) {
		const parts = rangeArg.split('-');
		if (parts.length === 2) {
			rangeStart = parseInt(parts[0], 10);
			rangeEnd = parseInt(parts[1], 10);
		}
	}

	let files;
	try {
		files = readdirSync(inputDir).filter((f) => f.endsWith('.md') && !f.endsWith('.thinking.md')).sort();
		const filterArg = args.find((a, idx) => {
			if (a.startsWith('-')) return false;
			if (a === rangeArg) return false;
			if (a === explicitVersion) return false;
			if (idx > 0 && (args[idx - 1] === '--range' || args[idx - 1] === '--version' || args[idx - 1] === '-v')) return false;
			if (a === activeVersionTag && !/^\d+$/.test(a)) return false;
			return /^[\w-]+$/.test(a);
		});
		if (filterArg) {
			files = files.filter((f) => basename(f, '.md') === filterArg);
		} else if (rangeStart !== null && rangeEnd !== null) {
			files = files.filter((f) => {
				const num = parseInt(basename(f, '.md'), 10);
				return !isNaN(num) && num >= rangeStart && num <= rangeEnd;
			});
		}
	} catch (e) {
		console.log(`skipping ${inputDir}: directory does not exist.`);
		return;
	}
	
	if (!files.length) { 
		console.log(`no matching markdown files in ${inputDir}`); 
		return; 
	}

	const filterArg = args.find((a, idx) => {
		if (a.startsWith('-')) return false;
		if (a === rangeArg) return false;
		if (a === explicitVersion) return false;
		if (idx > 0 && (args[idx - 1] === '--range' || args[idx - 1] === '--version' || args[idx - 1] === '-v')) return false;
		if (a === activeVersionTag && !/^\d+$/.test(a)) return false;
		return /^[\w-]+$/.test(a);
	});
	const isSingle = Boolean(filterArg);
	const isCustomRange = Boolean(rangeArg);
	const isRevised = (inputDir === dirs.mdLecturesRevised);
	const defaultPrefix = isRevised ? `React ${compoundVersion}-rev` : `React ${compoundVersion}`;
	const currentEdition = isRevised ? `${compoundVersion}-rev` : compoundVersion;

	// Dynamically compute the question range from markdown files
	let allNumFiles = [];
	try {
		const sourceFiles = isCustomRange
			? files.map((f) => basename(f, '.md'))
			: readdirSync(inputDir).filter((f) => f.endsWith('.md') && !f.endsWith('.thinking.md') && !f.includes('-old')).map((f) => basename(f, '.md'));
		allNumFiles = sourceFiles
			.filter((n) => /^\d+$/.test(n))
			.sort((a, b) => Number(a) - Number(b));
	} catch (e) { /* ignore */ }

	const first = allNumFiles.length > 0 ? allNumFiles[0].padStart(2, '0') : null;
	const last = allNumFiles.length > 0 ? allNumFiles[allNumFiles.length - 1].padStart(2, '0') : null;
	const isSingleQuestionDeck = (!first || !last || first === last || allNumFiles.length <= 1);

	let resolvedDeckFileName = deckFileName;
	let resolvedDeckTitle = deckTitle;
	if (allNumFiles.length > 0) {
		const rangeSlug = `Q${first}-Q${last}`;
		if (!deckFileName || /^(auto|deck)$/i.test(deckFileName) || /^React\s*(?:(?:R6|v\d+(?:\.\d+)*(?:-\d+)?(?:-rev)?|19)\s*)?Q/i.test(deckFileName) || deckFileName.includes('Q01-Q12')) {
			resolvedDeckFileName = `${defaultPrefix} ${rangeSlug}`;
		} else {
			resolvedDeckFileName = resolvedDeckFileName.replace(/\b19\s+/g, '').replace(/\bR6\s+/g, '').replace(/\s+/g, ' ').trim();
		}
		if (!deckTitle || /^(auto)$/i.test(deckTitle) || /^React\s*(?:(?:R6|v\d+(?:\.\d+)*(?:-\d+)?(?:-rev)?|19)\s*)?Q/i.test(deckTitle) || deckTitle.includes('Q01-Q12')) {
			resolvedDeckTitle = `${defaultPrefix} ${rangeSlug}`;
		} else {
			resolvedDeckTitle = resolvedDeckTitle.replace(/\b19\s+/g, '').replace(/\bR6\s+/g, '').replace(/\s+/g, ' ').trim();
		}
	}

	const lectures = [];
	for (const f of files) {
		const name = basename(f, '.md');
		const md = readFileSync(join(inputDir, f), 'utf8');
		// Reset figure numbering so captions read Fig {lecture}.{n}.
		figState.lecture = name;
		figState.n = 0;
		if (checkFormat) for (const warn of checkLecture(f, md)) console.log(`  warn ${f}: ${warn}`);
		const callout = calloutHTML(md);
		const bodyWithoutQuestion = stripQuestionLine(md);
		codeNotes.length = 0;
		const rendered = render(parseBlocks(bodyWithoutQuestion), f);
		for (const note of codeNotes) console.log(`  note ${f}: ${note}`);
		// Insert the callout AFTER the h1 title (matching source order: title, then question).
		// If there's no h1 (malformed source), fall back to prepending.
		const body = callout
			? rendered.replace(/(<\/h1>)/, `</h1>\n${callout}`)
			: rendered;
		lectures.push({ name, body });

		const title = (md.match(/^#\s+(.*)$/m) || [, `Lecture ${name}`])[1];
		if (!deckOnly) {
			const activeTheme = args.includes('--pro') ? 'pro' : 'teal';
			const outName = args.includes('--pro') ? `${name}-pro` : name;
			writeFileSync(join(htmlDir, `${outName}.html`), page(title, body, activeTheme, cssRelPath, currentEdition));
			console.log(`html  ${outName}.html`);
		}
	}

	const shouldBuildDeck = (!isSingle || alwaysBuildDeck) && !isSingleQuestionDeck;

	// Always purge invalid single-question decks (e.g. Q13-Q13, Q01-Q01)
	try {
		for (const f of readdirSync(htmlDir)) {
			if (/^React\s+v\d+.*Q(\d+)-Q\1.*?\.(html)$/i.test(f)) {
				unlinkSync(join(htmlDir, f));
			}
		}
	} catch (e) { /* ignore */ }

	if (shouldBuildDeck) {
		// Purge stale ranged deck HTML files (skip during custom range build; preserve custom subdecks like Q01-Q10, Q01-Q11, Q01-Q12)
		if (!isCustomRange) {
			try {
				for (const f of readdirSync(htmlDir)) {
					if (/^React\s*(?:(?:R6|v\d+(?:\.\d+)*(?:-\d+)?(?:-rev)?|19)\s*)?Q\d+-Q\d+.*\.html$/i.test(f) && !f.startsWith(resolvedDeckFileName)) {
						unlinkSync(join(htmlDir, f));
					}
				}
			} catch (e) { /* ignore */ }
		}

		let deckLectures = lectures;
		if (isSingle && alwaysBuildDeck) {
			deckLectures = [];
			const allSourceFiles = readdirSync(inputDir)
				.filter((f) => f.endsWith('.md') && !f.endsWith('.thinking.md') && !f.includes('-old'))
				.sort();
			for (const f of allSourceFiles) {
				const name = basename(f, '.md');
				const md = readFileSync(join(inputDir, f), 'utf8');
				figState.lecture = name;
				figState.n = 0;
				const callout = calloutHTML(md);
				const bodyWithoutQuestion = stripQuestionLine(md);
				codeNotes.length = 0;
				const rendered = render(parseBlocks(bodyWithoutQuestion), f);
				const body = callout
					? rendered.replace(/(<\/h1>)/, `</h1>\n${callout}`)
					: rendered;
				deckLectures.push({ name, body });
			}
		}

		// Course reader: all lectures stitched, with a page break between each.
		const readerBody = deckLectures
			.map((l) => `<article class="lecture">${l.body}</article>`)
			.join('\n<hr class="lecture-break">\n');

		// Multi-theme decks: teal, teal-pro (alias matching isolated pdf theme), black, old, enhanced, and pro.
		// The reader is published once per theme under the pipeline's deck file
		// name (e.g. "React v6.0 Q01-Q10-pro.pdf"); no duplicate deck-* outputs.
		const themes = [
			{ id: 'teal', theme: 'teal', label: 'Teal' },
			{ id: 'teal-pro', theme: 'teal', label: 'Teal Pro' },
			{ id: 'black', theme: 'black', label: 'Black' },
			{ id: 'old', theme: 'old', label: 'Old' },
			{ id: 'enhanced', theme: 'enhanced', label: 'Enhanced' },
			{ id: 'pro', theme: 'pro', label: 'Pro' }
		];

		const activeDeckThemes = args.includes('--pro') ? themes.filter((t) => t.id === 'pro') : themes;
		for (const th of activeDeckThemes) {
			const themedDeckHtml = deckPage(resolvedDeckTitle, readerBody, th.theme || th.id, cssRelPath, currentEdition);
			writeFileSync(join(htmlDir, `${resolvedDeckFileName}-${th.id}.html`), themedDeckHtml);
			console.log(`html  ${resolvedDeckFileName}-${th.id}.html`);
		}

		if (!args.includes('--pro')) {
			// Default (untagged) reader, aliased to teal
			const defaultDeckHtml = deckPage(resolvedDeckTitle, readerBody, 'teal', cssRelPath, currentEdition);
			writeFileSync(join(htmlDir, `${resolvedDeckFileName}.html`), defaultDeckHtml);
			console.log(`html  ${resolvedDeckFileName}.html`);
		}
	}

	if (withPdf) {
		const targets = isSingle
			? files.map((f) => args.includes('--pro') ? `${basename(f, '.md')}-pro` : basename(f, '.md'))
			: (deckOnly ? (shouldBuildDeck ? (args.includes('--pro') ? [] : [resolvedDeckFileName]) : []) : [...files.map((f) => basename(f, '.md')), ...(shouldBuildDeck ? (args.includes('--pro') ? [] : [resolvedDeckFileName]) : [])]);
		for (const name of targets) {
			execFileSync('prince', [join(htmlDir, `${name}.html`), '-o', join(pdfDir, `${name}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
			console.log(`pdf   ${name}.pdf`);
		}

		// Always purge invalid single-question decks (e.g. Q13-Q13, Q01-Q01)
		try {
			for (const f of readdirSync(pdfDir)) {
				if (/^React\s+v\d+.*Q(\d+)-Q\1.*?\.(pdf)$/i.test(f)) {
					unlinkSync(join(pdfDir, f));
				}
			}
		} catch (e) { /* ignore */ }

		if (shouldBuildDeck) {
			if (isSingle && !args.includes('--pro')) {
				execFileSync('prince', [join(htmlDir, `${resolvedDeckFileName}.html`), '-o', join(pdfDir, `${resolvedDeckFileName}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
				console.log(`pdf   ${resolvedDeckFileName}.pdf`);
			}

			// Purge stale ranged deck PDF files (skip during custom range build; preserve custom subdecks like Q01-Q10, Q01-Q11)
			if (!isCustomRange) {
				try {
					for (const f of readdirSync(pdfDir)) {
						if (/^React\s*(?:(?:R6|v\d+(?:\.\d+)*(?:-\d+)?(?:-rev)?|19)\s*)?Q\d+-Q\d+.*\.pdf$/i.test(f) && !f.startsWith(resolvedDeckFileName)) {
							unlinkSync(join(pdfDir, f));
						}
					}
				} catch (e) { /* ignore */ }
			}

			// Compile multi-theme reader PDFs: <deckFileName>-teal.pdf, -teal-pro.pdf, -black.pdf, -old.pdf, -enhanced.pdf, -pro.pdf
			const themes = [
				{ id: 'teal', theme: 'teal', label: 'Teal' },
				{ id: 'teal-pro', theme: 'teal', label: 'Teal Pro' },
				{ id: 'black', theme: 'black', label: 'Black' },
				{ id: 'old', theme: 'old', label: 'Old' },
				{ id: 'enhanced', theme: 'enhanced', label: 'Enhanced' },
				{ id: 'pro', theme: 'pro', label: 'Pro' }
			];
			const activePdfThemes = args.includes('--pro') ? themes.filter((t) => t.id === 'pro') : themes;
			for (const th of activePdfThemes) {
				const thName = `${resolvedDeckFileName}-${th.id}`;
				execFileSync('prince', [join(htmlDir, `${thName}.html`), '-o', join(pdfDir, `${thName}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
				console.log(`pdf   ${thName}.pdf`);
			}
		}
	}
}

// Build standard lectures (format checks on: this is the lectures pipeline)
buildDirectory(dirs.mdLectures, dirs.html, dirs.pdf, 'auto', true, 'auto', false);

// Build revised lectures pipeline
buildDirectory(dirs.mdLecturesRevised, dirs.htmlRevised, dirs.pdfRevised, 'auto', true, 'auto', true);

if (!rangeArg) {
	// Build review experiment
	buildDirectory(dirs.mdLecturesReview, dirs.htmlReview, dirs.pdfReview, 'React Review Series');

	// Build data-flow pipeline (architectural placement on the ElectroShop tree)
	buildDirectory(dirs.mdDataFlow, dirs.htmlDataFlow, dirs.pdfDataFlow, 'React Data Flow Atlas');
}

console.log('done.');
