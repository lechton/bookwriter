#!/usr/bin/env node
/* ============================================================
   build-code-plus.mjs — Dedicated Variant Generator: "code-plus"
   ------------------------------------------------------------
   Generates a dedicated variant where principle code cards are:
     1. Full length (full width breakout matching .editor)
     2. High-clarity, generous typography (0.92rem vs 0.80rem)
     3. Top-right watermark badge matching the left icon in a darker
        shade of the card background
     4. Cloud / speech bubble comments (.cmt-bubble) with upward
        tail pointing to code lines, indented with --indent-offset
     5. Preserves existing standard HTML & PDF builds completely intact

   Usage:
     node src/build-code-plus.mjs [lecture_num]   # e.g. node src/build-code-plus.mjs 05
     node src/build-code-plus.mjs all            # build all lectures and deck
   ============================================================ */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = dirname(__dirname);

const args = process.argv.slice(2);
const targetLectureArg = args.find(a => !a.startsWith('-')) || '05';

// Find latest lecture and HTML directories
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

const htmlBase = join(ROOT, '01-03-md-lectures-HTML');
const pdfBase = join(ROOT, '01-04-md-lectures-PDF');
const activeVer = findLatestVersionTag(htmlBase) || 'v6';

const htmlDir = join(htmlBase, activeVer);
const pdfDir = join(pdfBase, activeVer);

mkdirSync(htmlDir, { recursive: true });
mkdirSync(pdfDir, { recursive: true });

console.log(`[code-plus] Dedicated Variant Generator`);
console.log(`[code-plus] Active version: ${activeVer}`);
console.log(`[code-plus] Target: ${targetLectureArg}`);

const CODE_PLUS_CSS = `
/* ============================================================
   CODE-PLUS VARIANT STYLES
   - Full length breakout matching .editor
   - Generous code typography (0.88rem, line-height 1.48)
   - Top-right watermark background badge
   - Cloud speech bubble comments with upward pointer & indent offset
   ============================================================ */

.callout-principle {
	page-break-inside: avoid !important;
	break-inside: avoid !important;
	margin-top: 1.0rem !important;
	margin-bottom: 1.2rem !important;
}

.callout-principle .principle-definition-card {
	padding: 9px 14px !important;
	margin-bottom: 6px !important;
}

.callout-principle .principle-definition-card .principle-statement {
	font-size: 0.94rem !important;
	line-height: 1.45 !important;
}

.callout-principle .principle-cases-grid {
	display: flex !important;
	flex-direction: column !important;
	gap: 8px !important;
	margin-left: -260px !important;
	width: calc(100% + 260px) !important;
	margin-top: 0.6rem !important;
	margin-bottom: 0.8rem !important;
	clear: both !important;
}

.callout-principle .principle-case {
	position: relative !important;
	overflow: hidden !important;
	display: flex !important;
	flex-direction: column !important;
	padding: 9px 14px 10px !important;
	border-radius: 7px !important;
	box-sizing: border-box !important;
	gap: 4px !important;
	box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04) !important;
	break-inside: avoid !important;
	page-break-inside: avoid !important;
}

.callout-principle .principle-case-do {
	background: #f0fdf4 !important;
	border: 1.5px solid #86efac !important;
}

.callout-principle .principle-case-warn {
	background: #fffbeb !important;
	border: 1.5px solid #fde68a !important;
}

.callout-principle .principle-case-dont {
	background: #fef2f2 !important;
	border: 1.5px solid #fca5a5 !important;
}

/* Large top-right watermark badge */
.callout-principle .case-watermark-bg {
	position: absolute !important;
	top: 8px !important;
	right: 14px !important;
	width: 44px !important;
	height: 44px !important;
	z-index: 0 !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
}

.callout-principle .case-watermark-bg svg {
	width: 100% !important;
	height: 100% !important;
}

.callout-principle .principle-case-do .case-watermark-bg {
	color: #15803d !important;
	opacity: 0.18 !important;
}

.callout-principle .principle-case-warn .case-watermark-bg {
	color: #b45309 !important;
	opacity: 0.18 !important;
}

.callout-principle .principle-case-dont .case-watermark-bg {
	color: #b91c1c !important;
	opacity: 0.18 !important;
}

/* Case header */
.callout-principle .case-header {
	display: flex !important;
	align-items: center !important;
	gap: 7px !important;
	position: relative !important;
	z-index: 1 !important;
	margin-bottom: 1px !important;
}

.callout-principle .case-icon-col {
	flex-shrink: 0 !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
}

.callout-principle .case-icon {
	width: 16px !important;
	height: 16px !important;
}

.callout-principle .case-label {
	font-size: 0.88rem !important;
	font-weight: 700 !important;
	line-height: 1.2 !important;
}

.callout-principle .principle-case-do .case-label { color: #15803d !important; }
.callout-principle .principle-case-warn .case-label { color: #b45309 !important; }
.callout-principle .principle-case-dont .case-label { color: #b91c1c !important; }

/* Code container — clean flex/block rows, NO pre/code wrappers */
.callout-principle .case-code {
	position: relative !important;
	z-index: 1 !important;
	font-family: "JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace !important;
	font-size: 0.84rem !important;
	color: #0f172a !important;
	margin-top: 3px !important;
	display: flex !important;
	flex-direction: column !important;
	gap: 0 !important;
}

.callout-principle .case-code-line {
	white-space: pre !important;
	font-family: inherit !important;
	font-size: inherit !important;
	line-height: 1.40 !important;
	color: inherit !important;
	margin: 0 !important;
	padding: 0 !important;
}

/* Cloud speech bubble comments inside principle cards */
.callout-principle .cmt-bubble {
	position: relative !important;
	margin-left: calc(14px + var(--indent-offset, 0px)) !important;
	margin-top: 3px !important;
	margin-bottom: 5px !important;
	padding: 3px 9px !important;
	background: #ffffff !important;
	border: 1px solid #d0d0d0 !important;
	border-radius: 5px !important;
	color: #333333 !important;
	font-family: Georgia, "Times New Roman", serif !important;
	font-size: 0.80rem !important;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
	display: inline-block !important;
	align-self: flex-start !important;
	max-width: calc(100% - 28px) !important;
	box-sizing: border-box !important;
}

/* Cloud tail pointing UP at the code line */
.callout-principle .cmt-bubble::before {
	content: "" !important;
	position: absolute !important;
	top: -5px !important;
	left: 12px !important;
	width: 7px !important;
	height: 7px !important;
	background: #ffffff !important;
	border-top: 1px solid #d0d0d0 !important;
	border-left: 1px solid #d0d0d0 !important;
	transform: rotate(45deg) !important;
}

.callout-principle .cmt-bubble .text {
	font-style: italic !important;
	line-height: 1.35 !important;
}

/* Suppress legacy redundant bottom case-note */
.callout-principle .case-note {
	display: none !important;
}
`;

function transformHtmlForCodePlus(originalHtml) {
	// 1. Inject the code-plus stylesheet into <head>
	let html = originalHtml.replace('</head>', `<style id="code-plus-style">\n${CODE_PLUS_CSS}\n</style>\n</head>`);

	// 2. Parse and transform each .principle-case
	const caseRegex = /<div class="(principle-case principle-case-[^"]+)">([\s\S]*?)<\/div>\s*(?=<div class="principle-case|<\/div>\s*<\/div>\s*<\/aside>)/g;

	html = html.replace(caseRegex, (match, caseClasses, innerContent) => {
		// Extract icon SVG
		const iconMatch = innerContent.match(/<div class="case-icon-col">([\s\S]*?)<\/div>/);
		const iconSvg = iconMatch ? iconMatch[1].trim() : '';

		// Watermark badge HTML
		const watermarkHtml = iconSvg ? `<div class="case-watermark-bg">${iconSvg}</div>` : '';

		// Extract legacy case note if present
		const noteMatch = innerContent.match(/<div class="case-note">([\s\S]*?)<\/div>/);
		const noteText = noteMatch ? noteMatch[1].trim().replace(/<br\s*\/?>/gi, ' — ') : '';

		// Extract code block inside <div class="case-code"><pre><code>([\s\S]*?)<\/code><\/pre><\/div>
		const codeMatch = innerContent.match(/<div class="case-code"><pre><code>([\s\S]*?)<\/code><\/pre><\/div>/);
		if (!codeMatch) {
			// If no code, but noteText exists (like Principle 3 negative case)
			if (noteText) {
				const bubbleHtml = `<div class="case-code"><div class="cmt-bubble" style="--indent-offset: 0px;"><span class="text">${noteText}</span></div></div>`;
				let updatedInner = watermarkHtml + innerContent.replace(/<div class="case-code">[\s\S]*?<\/div>/, bubbleHtml);
				return `<div class="${caseClasses}">${updatedInner}</div>`;
			}
			return `<div class="${caseClasses}">${watermarkHtml}${innerContent}</div>`;
		}

		const rawCodeHtml = codeMatch[1];
		const lines = rawCodeHtml.split('\n');

		// Process lines into case-code-line and cmt-bubble
		let processedRowsHtml = '';
		let pendingComments = [];
		let pendingTopNote = noteText;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const textOnly = line.replace(/<[^>]+>/g, '');
			const spaceMatch = textOnly.match(/^(\s*)/);
			const indentSpaces = spaceMatch ? spaceMatch[1].length : 0;
			const indentOffsetPx = indentSpaces * 9.5;

			// Check if line is a comment-only line: e.g. <span class="cmt">// comment</span> or <span class="cmt">{/* comment */}</span>
			const isCommentOnly = /^\s*<span class="cmt">(?:\/\/|\{\/\*|\/\*)\s*(.*?)(?:\*\/\}|\*\/)?<\/span>\s*$/.test(line) || /^\s*(?:\/\/|\{\/\*|\/\*)\s*(.*?)(?:\*\/\}|\*\/)?\s*$/.test(textOnly);
			if (isCommentOnly) {
				const cmtMatch = line.match(/<span class="cmt">(?:\/\/|\{\/\*|\/\*)\s*(.*?)(?:\*\/\}|\*\/)?<\/span>/) || textOnly.match(/(?:\/\/|\{\/\*|\/\*)\s*(.*?)(?:\*\/\}|\*\/)?\s*$/);
				const cmtContent = cmtMatch ? cmtMatch[1].trim() : textOnly.replace(/^(?:\/\/|\{\/\*|\/\*)/, '').replace(/(?:\*\/\}|\*\/)$/, '').trim();
				pendingComments.push({ text: cmtContent, offset: indentOffsetPx });
				continue;
			}

			// Check if line contains an inline comment: e.g. code <span class="cmt">// comment</span> or code <span class="cmt">{/* comment */}</span>
			const inlineCmtMatch = line.match(/(.*?)<span class="cmt">(?:\/\/|\{\/\*|\/\*)\s*(.*?)(?:\*\/\}|\*\/)?<\/span>/);
			if (inlineCmtMatch) {
				const codePart = inlineCmtMatch[1].trimEnd();
				const cmtPart = inlineCmtMatch[2].trim();

				processedRowsHtml += `<div class="case-code-line">${codePart}</div>`;
				processedRowsHtml += `<div class="cmt-bubble" style="--indent-offset: ${indentOffsetPx}px;"><span class="text">${cmtPart}</span></div>`;
				continue;
			}

			// Regular code line
			processedRowsHtml += `<div class="case-code-line">${line}</div>`;

			// If we had a pending comment (from preceding comment-only line)
			if (pendingComments.length > 0) {
				for (const c of pendingComments) {
					processedRowsHtml += `<div class="cmt-bubble" style="--indent-offset: ${c.offset}px;"><span class="text">${c.text}</span></div>`;
				}
				pendingComments = [];
			}

			// If we have a pending top note and this was the first function / statement line
			if (pendingTopNote && (line.includes('function') || i === 0)) {
				processedRowsHtml += `<div class="cmt-bubble" style="--indent-offset: 0px;"><span class="text">${pendingTopNote}</span></div>`;
				pendingTopNote = '';
			}
		}

		// Trailing comments if any left
		if (pendingComments.length > 0) {
			for (const c of pendingComments) {
				processedRowsHtml += `<div class="cmt-bubble" style="--indent-offset: ${c.offset}px;"><span class="text">${c.text}</span></div>`;
			}
		}

		// Rebuild the case-code element WITHOUT pre/code tags
		const newCodeHtml = `<div class="case-code">${processedRowsHtml}</div>`;

		// Replace original case-code and inject watermark
		let updatedInner = innerContent.replace(/<div class="case-code">[\s\S]*?<\/div>/, newCodeHtml);
		updatedInner = watermarkHtml + updatedInner;

		return `<div class="${caseClasses}">${updatedInner}</div>`;
	});

	return html;
}

// Process target files
const lecturesToBuild = (targetLectureArg === 'all')
	? readdirSync(htmlDir).filter(f => /^\d+\.html$/.test(f)).map(f => basename(f, '.html'))
	: [targetLectureArg.replace(/\.html$/, '').replace(/^0+/, (m) => m.length === 1 ? '0' : '')];

for (const lec of lecturesToBuild) {
	const baseHtmlFile = join(htmlDir, `${lec}.html`);
	if (!existsSync(baseHtmlFile)) {
		console.log(`Rebuilding base ${lec}.html via build-lectures.mjs...`);
		execSync(`node src/build-lectures.mjs ${lec}`, { cwd: ROOT, stdio: 'inherit' });
	}

	if (!existsSync(baseHtmlFile)) {
		console.error(`Error: base HTML file ${baseHtmlFile} not found.`);
		continue;
	}

	console.log(`Reading ${baseHtmlFile}...`);
	const rawHtml = readFileSync(baseHtmlFile, 'utf8');

	console.log(`Transforming principle code cards into "code-plus" format...`);
	const transformedHtml = transformHtmlForCodePlus(rawHtml);

	const outHtmlFile = join(htmlDir, `${lec}-code-plus.html`);
	const outPdfFile = join(pdfDir, `${lec}-code-plus.pdf`);

	writeFileSync(outHtmlFile, transformedHtml, 'utf8');
	console.log(`Saved: ${outHtmlFile}`);

	console.log(`Rendering PDF via Prince to ${outPdfFile}...`);
	execFileSync('prince', [outHtmlFile, '-o', outPdfFile], { stdio: ['ignore', 'ignore', 'inherit'] });
	console.log(`Compiled: ${outPdfFile}`);
}

if (targetLectureArg === 'all') {
	const deckFiles = readdirSync(htmlDir).filter(f => /^React\s.*Q\d+-Q\d+\.html$/.test(f));
	for (const df of deckFiles) {
		const baseDeckHtml = join(htmlDir, df);
		const deckName = basename(df, '.html');
		console.log(`\nReading deck ${baseDeckHtml}...`);
		const rawDeckHtml = readFileSync(baseDeckHtml, 'utf8');
		const transformedDeckHtml = transformHtmlForCodePlus(rawDeckHtml);
		const outDeckHtml = join(htmlDir, `${deckName}-code-plus.html`);
		const outDeckPdf = join(pdfDir, `${deckName}-code-plus.pdf`);
		writeFileSync(outDeckHtml, transformedDeckHtml, 'utf8');
		console.log(`Saved Deck HTML: ${outDeckHtml}`);
		console.log(`Rendering Deck PDF via Prince to ${outDeckPdf}...`);
		execFileSync('prince', [outDeckHtml, '-o', outDeckPdf], { stdio: ['ignore', 'ignore', 'inherit'] });
		console.log(`Compiled Deck PDF: ${outDeckPdf}`);
	}
}

console.log(`\n[code-plus] Dedicated Variant Generator finished successfully!`);

