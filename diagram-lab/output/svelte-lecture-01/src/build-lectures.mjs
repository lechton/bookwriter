#!/usr/bin/env node
/* ============================================================
   build-lectures.mjs — lecture pipeline: md-lectures -> html -> pdf
   ------------------------------------------------------------
   Reads md-lectures/*.md, writes md-lectures-html/*.html plus a
   combined md-lectures-html/deck.html (course reader), then
   renders each to md-lectures-pdf/ via Prince.

   Usage (run from this project folder):
     node src/build-lectures.mjs            # build html + pdf
     node src/build-lectures.mjs --no-pdf   # build html only

   Markdown support (full formatting, long-form article):
     # Title                           h1
     ## Section                        h2
     ### Subsection                    h3
     **bold** / *italic*               inline emphasis
     `code`                            inline code
     ```lang title="File.svelte"       fenced code block with optional title
     - item                            bullet list
     1. item                           numbered list
     > quote                           blockquote
     [text](url)                       inline link
     everything else                   paragraphs (one line each, never hard-wrapped)
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const withPdf = !args.includes('--no-pdf');

const dirs = {
	mdLectures: join(ROOT, 'md-lectures'),
	html: join(ROOT, 'md-lectures-html'),
	pdf: join(ROOT, 'md-lectures-pdf'),
	// Review experiment directories
	mdLecturesReview: join(ROOT, 'md-lectures-review'),
	htmlReview: join(ROOT, 'md-lectures-review-html'),
	pdfReview: join(ROOT, 'md-lectures-review-pdf'),
	// Data-flow pipeline directories (ElectroShop architectural placement)
	mdDataFlow: join(ROOT, 'md-data-flow'),
	htmlDataFlow: join(ROOT, 'md-data-flow-html'),
	pdfDataFlow: join(ROOT, 'md-data-flow-pdf'),
};

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
		const m = lines[i].match(/^>\s*INTERVIEW QUESTION\s*\|\s*(.+?)\s*$/i);
		if (m) {
			return `<aside class="interview-question">\n  <p class="iq-eyebrow">Interview Question</p>\n  <p class="iq-text">${inline(m[1])}</p>\n</aside>\n`;
		}
	}
	return '';
}

// Strip the interview-question line from the markdown body before parsing blocks,
// so it doesn't render as a generic blockquote below the callout.
function stripQuestionLine(mdSource) {
	return mdSource.split('\n').filter((line) => !/^>\s*INTERVIEW QUESTION\s*\|/i.test(line)).join('\n');
}

/* ---------------- markdown -> html (full) ---------------- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
	// Escape first, then re-introduce markdown spans.
	let out = esc(s);
	// Inline code (do this first so its contents are not reprocessed).
	const codeStash = [];
	out = out.replace(/`([^`]+)`/g, (_, c) => {
		codeStash.push(c);
		return `\u0000CODE${codeStash.length - 1}\u0000`;
	});
	// Links [text](url)
	out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`);
	// Bold then italic.
	out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	// Restore stashed inline code.
	out = out.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => `<code>${codeStash[Number(i)]}</code>`);
	// Restore <br> and <br/> tags
	out = out.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
	return out;
}

/* ---------------- code highlighter (editor-style, // -> arrow) ---------------- */

// Svelte 5 runes — checked first so $state wins over the generic identifier rule.
const RUNES = '\\$(state(?:\\.raw|\\.snapshot|\\.eager)?|derived(?:\\.by)?|effect(?:\\.pre)?|props|bindable|inspect|host)\\b';

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
// Order matters: runes > strings > numbers > identifiers/keywords > function calls > rest.
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

		// Numbers: \d+(\.\d+)? — but not a dot in the middle of an identifier.
		if (/\d/.test(c) && (i === 0 || !isIdent(line[i - 1]))) {
			const m = line.slice(i).match(/^\d+(\.\d+)?/);
			if (m) {
				out += `<span class="nl">${escCode(m[0])}</span>`;
				i += m[0].length;
				continue;
			}
		}

		// Identifiers (and runes / keywords / function calls).
		if (isIdentStart(c)) {
			let j = i + 1;
			while (j < n && isIdent(line[j])) j++;
			const word = line.slice(i, j);

			// Rune check first: $state, $derived.by, etc.
			if (word.startsWith('$') && new RegExp('^' + RUNES).test(word)) {
				out += `<span class="rune">${escCode(word)}</span>`;
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

// Render one source line: split at the first // comment (followed by space or EOL),
// drop empty trailing comments, return {code, comment}.
function highlightLine(raw) {
	// Match a full-line comment: either // or <!--
	const mFull = raw.match(/^(?:\/\/|<!--)(\s|$)/);
	if (mFull && mFull.index === 0) {
		// Whole line is a comment.
		let text = raw.replace(/^(?:\/\/|<!--)\s?/, '').replace(/\s?-->\s*$/, '');
		if (!text.trim()) return null; // drop empty comment-only line
		text = text.replace(/(✔️|✖️|✖)\s*/g, '');
		text = text.charAt(0).toUpperCase() + text.slice(1);
		return { code: '', comment: text };
	}
	
	// Match an inline comment: either // or <!--
	const idx = raw.search(/(?:\/\/|<!--)(\s|$)/);
	if (idx > 0 && raw[idx - 1] !== ':') {
		const codePart = raw.slice(0, idx);
		const matchToken = raw.substr(idx).startsWith('<!--') ? '<!--' : '//';
		let commentText = raw.slice(idx + matchToken.length).replace(/^\s?/, '').replace(/\s?-->\s*$/, '');
		
		const code = tokenizeLine(codePart);
		if (!commentText.trim()) return { code, comment: null }; // drop empty trailing //

		commentText = commentText.replace(/(✔️|✖️|✖)\s*/g, '');
		if (commentText.length > 0) {
			commentText = commentText.charAt(0).toUpperCase() + commentText.slice(1);
		}
		return { code, comment: commentText };
	}
	// No comment — tokenize the whole line.
	return { code: tokenizeLine(raw), comment: null };
}

// Build the editor-style HTML for one fenced code block.
// Lines that are purely Svelte boilerplate wrappers — never shown in the editor.
// Matches the bare tag or the tag with attributes (e.g. <script lang="ts">).
const WRAPPER_RE = /^\s*<\/?(script|style|template)(\s[^>]*)?\s*>\s*$/;

// Default filename shown in the editor tab when the author did not set title=.
function defaultFilename(lang) {
	if (lang === 'svelte') return 'App.svelte';
	if (lang === 'js' || lang === 'javascript') return 'App.js';
	if (lang === 'ts' || lang === 'typescript') return 'App.ts';
	return 'code.txt';
}

function highlightCode(code, title, lang) {
	// Fix 3: drop blank lines so the editor stays dense (no empty numbered rows).
	const kept = code.split('\n');
	const rows = kept.map((line, idx) => {
		const spaceLine = line.replace(/\t/g, '  ');
		const indentMatch = spaceLine.match(/^(\s*)/);
		const indent = indentMatch ? indentMatch[1].length : 0;
		const result = highlightLine(spaceLine);
		if (result === null) return `<div class="row"><span class="num">${idx + 1}</span><span class="src"></span></div>`;
		
		let out = `<div class="row"><span class="num">${idx + 1}</span><span class="src">${result.code}</span>`;
		if (result.comment) {
			const isMulti = result.comment.includes('<br>');
			const bubbleClass = isMulti ? 'cmt-bubble cmt-bubble-multi' : 'cmt-bubble';
			const offset = indent * 9.5;
			out += `\n      <div style="flex-basis: 100%; height: 0;"></div>\n      <span class="num"></span>\n      <div class="${bubbleClass}" style="--indent-offset: ${offset}px;">\n        <span class="text">${renderComment(result.comment)}</span>\n      </div>`;
		}
		out += `</div>`;
		return out;
	}).join('\n');
	// Fix 1: always render the editor chrome (dots + filename tab).
	const filename = title || defaultFilename(lang);
	const bar = `<div class="bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="tab">${esc(filename)}</span></div>`;
	return `<div class="editor">${bar}<div class="code">${rows}</div></div>`;
}

/* ---------------- markdown block parser ---------------- */

function parseBlocks(md) {
	const lines = md.split('\n');
	const out = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) { i++; continue; }

		// Fenced code block.
		const fence = line.match(/^```(\w+)?\s*(?:title="([^"]*)")?\s*$/);
		if (fence) {
			const buf = [];
			i++;
			while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
			i++;
			out.push({ t: 'code', lang: fence[1] || '', title: fence[2] || '', code: buf.join('\n') });
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
		if (line.startsWith('> ')) {
			const buf = [];
			while (i < lines.length && lines[i].startsWith('> ')) { buf.push(lines[i].slice(2)); i++; }
			const joined = buf.join(' ');
			// Match `> [!TYPE]` optionally followed by more text on the same line.
			// The body is everything after the `]` (trimmed); if the `]` ended the
			// first line, the body is the remaining joined lines.
			const alert = joined.match(/^\[!(NOTE|TIP|KEY|WARNING|CAUTION)\]\s*([\s\S]*)$/);
			if (alert) {
				out.push({ t: 'callout', kind: alert[1].toLowerCase(), text: alert[2].trim() });
			} else {
				out.push({ t: 'quote', text: joined });
			}
			continue;
		}

		// Unordered list.
		if (line.startsWith('- ')) {
			const items = [];
			while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++; }
			out.push({ t: 'ul', items });
			continue;
		}

		// Ordered list.
		if (/^\d+\.\s/.test(line)) {
			const items = [];
			while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, '')); i++; }
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
		const starters = (l) => l.startsWith('```') || l.startsWith('#') || l.startsWith('- ') || /^\d+\.\s/.test(l) || l.startsWith('> ');
		const buf = [];
		while (i < lines.length && lines[i].trim() && !starters(lines[i])) { buf.push(lines[i]); i++; }
		out.push({ t: 'p', text: buf.join(' ') });
	}
	return out;
}

function render(blocks) {
	let html = '';
	let inH3 = false;
	
	for (const b of blocks) {
		// If we encounter any heading, close the previous h3 section
		if (b.t === 'h1' || b.t === 'h2' || b.t === 'h3' || b.t === 'h4') {
			if (inH3) {
				html += '</div>\n';
				inH3 = false;
			}
		}
		
		// If this is an h3, start a new wrapper
		if (b.t === 'h3') {
			html += '<div class="keep-together">\n';
			inH3 = true;
		}
		
		switch (b.t) {
			case 'h1': html += `<h1>${inline(b.text)}</h1>\n`; break;
			// h2 = page break. Wrap the heading in a div that forces a new page
			// in PDF (Prince) and a visual break in the deck HTML.
			case 'h2': html += `<div class="page-break"><h2>${inline(b.text)}</h2></div>\n`; break;
			case 'h3': html += `<h3>${inline(b.text)}</h3>\n`; break;
			case 'h4': html += `<h4>${inline(b.text)}</h4>\n`; break;
			case 'code': html += highlightCode(b.code, b.title, b.lang) + '\n'; break;
			case 'quote': html += `<blockquote>${inline(b.text)}</blockquote>\n`; break;
			case 'callout': {
				// Each alert type gets an on-brand eyebrow label. TIP is the project's
				// signature (interview-prep framing) → "Interview Tip"; the others use
				// GitHub-standard labels for when authors reach for them.
				const eyebrow = {
					tip: 'Interview Tip',
					note: 'Note',
					key: 'Key Takeaway',
					warning: 'Warning',
					caution: 'Caution',
				}[b.kind] || 'Tip';
				html += `<aside class="callout callout-${b.kind}">\n  <p class="callout-eyebrow">${eyebrow}</p>\n  <div class="callout-body">${inline(b.text)}</div>\n</aside>\n`;
				break;
			}
			case 'ul': html += `<ul>${b.items.map((x) => `<li>${inline(x)}</li>`).join('\n')}</ul>\n`; break;
			case 'ol': html += `<ol>${b.items.map((x) => `<li>${inline(x)}</li>`).join('\n')}</ol>\n`; break;
			case 'p': html += `<p>${inline(b.text)}</p>\n`; break;
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
					const head = `<thead><tr>${b.header.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>`;
					const body = `<tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
					html += `<table>${head}${body}</table>\n`;
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

const page = (title, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="stylesheet" href="../src/lecture.css">
</head>
<body>
<main>
${body}
</main>
</body>
</html>
`;

// deck.html lives next to the per-lecture HTML files (in md-lectures-html/),
// so it shares the same relative path to the stylesheet.
const deckPage = page;

/* ---------------- build ---------------- */

function buildDirectory(inputDir, htmlDir, pdfDir, deckTitle) {
	try {
		mkdirSync(htmlDir, { recursive: true });
		mkdirSync(pdfDir, { recursive: true });
	} catch (e) { /* ignore */ }

	let files;
	try {
		files = readdirSync(inputDir).filter((f) => f.endsWith('.md') && !f.endsWith('.thinking.md')).sort();
	} catch (e) {
		console.log(`skipping ${inputDir}: directory does not exist.`);
		return;
	}
	
	if (!files.length) { 
		console.log(`no markdown files in ${inputDir}`); 
		return; 
	}

	const lectures = [];
	for (const f of files) {
		const name = basename(f, '.md');
		const md = readFileSync(join(inputDir, f), 'utf8');
		const callout = calloutHTML(md);
		const bodyWithoutQuestion = stripQuestionLine(md);
		const rendered = render(parseBlocks(bodyWithoutQuestion));
		// Insert the callout AFTER the h1 title (matching source order: title, then question).
		// If there's no h1 (malformed source), fall back to prepending.
		const body = callout
			? rendered.replace(/(<\/h1>)/, `</h1>\n${callout}`)
			: rendered;
		lectures.push({ name, body });

		const title = (md.match(/^#\s+(.*)$/m) || [, `Lecture ${name}`])[1];
		writeFileSync(join(htmlDir, `${name}.html`), page(title, body));
		console.log(`html  ${name}.html`);
	}

	// Course reader: all lectures stitched, with a page break between each.
	const readerBody = lectures
		.map((l) => `<article class="lecture">${l.body}</article>`)
		.join('\n<hr class="lecture-break">\n');
	writeFileSync(join(htmlDir, 'deck.html'), deckPage(deckTitle, readerBody));
	console.log('html  deck.html');

	if (withPdf) {
		const targets = [...files.map((f) => basename(f, '.md')), 'deck'];
		for (const name of targets) {
			execFileSync('prince', [join(htmlDir, `${name}.html`), '-o', join(pdfDir, `${name}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
			console.log(`pdf   ${name}.pdf`);
		}
	}
}

// Build standard lectures
buildDirectory(dirs.mdLectures, dirs.html, dirs.pdf, 'Svelte 5 Lecture Series');

// Build review experiment
buildDirectory(dirs.mdLecturesReview, dirs.htmlReview, dirs.pdfReview, 'Svelte 5 Review Series');

// Build data-flow pipeline (architectural placement on the ElectroShop tree)
buildDirectory(dirs.mdDataFlow, dirs.htmlDataFlow, dirs.pdfDataFlow, 'Svelte 5 Data Flow Atlas');

console.log('done.');
