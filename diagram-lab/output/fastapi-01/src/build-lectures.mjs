#!/usr/bin/env node
/* ============================================================
   build-lectures.mjs — lecture pipeline: md-lectures -> html -> pdf
   ------------------------------------------------------------
   Reads md-lectures/*.md, writes md-lectures-html/*.html plus the
   combined course reader (one HTML file per theme, named after the
   pipeline's deck file name), then renders each to md-lectures-pdf/
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

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { renderComponentExplorer } from './component-explorer.mjs';

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

	// Restore <br> and <br/> tags
	out = out.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
	// Restore &nbsp;
	out = out.replace(/&amp;nbsp;/gi, '&nbsp;');
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

function highlightCode(code, title, lang) {
	// Comment-only lines never get their own row: their text is merged into the
	// bubble of the following code line (or the preceding one at block end), so
	// no comment bubble can ever float beside an empty numbered row.
	const pending = [];
	const parsed = [];
	code.split('\n').forEach((line, lineIdx) => {
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
		parsed.push({ code: codeText, comment, indent, merged });
	});
	// A block that ends on comment-only lines folds them into the last code row.
	if (pending.length) {
		let last = null;
		for (let i = parsed.length - 1; i >= 0; i--) {
			if (parsed[i].code.trim() !== '' || parsed[i].comment) { last = parsed[i]; break; }
		}
		if (last) last.merged.push(...pending.splice(0, pending.length));
		else parsed.push({ code: '', comment: null, indent: 0, merged: pending.splice(0, pending.length) });
	}
	const rows = parsed.map((p, idx) => {
		if (p.code === '' && !p.comment && !p.merged.length) {
			return `<div class="row"><span class="num">${idx + 1}</span><span class="src"></span></div>`;
		}
		let out = `<div class="row"><span class="num">${idx + 1}</span><span class="src">${p.code}</span>`;
		const commentText = [...p.merged, ...(p.comment ? [p.comment] : [])].join('<br>');
		if (commentText) {
			const isMulti = commentText.includes('<br>');
			const bubbleClass = isMulti ? 'cmt-bubble cmt-bubble-multi' : 'cmt-bubble';
			const offset = p.indent * 9.5;
			out += `\n      <div style="flex-basis: 100%; height: 0;"></div>\n      <span class="num"></span>\n      <div class="${bubbleClass}" style="--indent-offset: ${offset}px;">\n        <span class="text">${renderComment(commentText)}</span>\n      </div>`;
		}
		out += `</div>`;
		return out;
	}).join('\n');
	// Fix 1: always render the editor chrome (dots + filename tab).
	const filename = title || defaultFilename(lang);
	const bar = `<div class="bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="tab">${esc(filename)}</span></div>`;
	const isWrong = lang && lang.includes('wrong');
	const isRight = lang && lang.includes('right');
	const svgRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.5rem; height: 1.5rem;"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>`;
	const svgWrong = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.5rem; height: 1.5rem;"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>`;
	const icon = isWrong ? svgWrong : (isRight ? svgRight : '');
	const editorClass = isWrong ? 'editor wrong' : (isRight ? 'editor right' : 'editor');

	if (icon) {
		return `<div class="${editorClass}"><div class="editor-indicator">${icon}</div><div class="editor-main">${bar}<div class="code">${rows}</div></div></div>`;
	} else {
		return `<div class="editor"><div class="editor-main">${bar}<div class="code">${rows}</div></div></div>`;
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
	const starters = (l) => l.startsWith('```') || l.startsWith('#') || /^\s*[-*]\s+/.test(l) || /^\d+\.\s/.test(l) || l.startsWith('> ') || l.trim().startsWith('![');
	const lines = md.split('\n');
	const out = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) { i++; continue; }

		// Standalone image.
		const imgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
		if (imgMatch) {
			out.push({ t: 'image', alt: imgMatch[1], src: imgMatch[2] });
			i++;
			continue;
		}

		// HTML figure embed: ```html-figure src="..." caption="..." (or ```figure).
		// The figure is a standalone HTML file in md-lectures/figures/ (referenced
		// by src, resolved against the project root or md-lectures/) or inline HTML
		// inside the fence. It is inlined verbatim into the lecture page.
		const figFence = line.match(/^```(figure|html-figure)\b(.*)$/);
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
		const fence = line.match(/^```([\w\s]+)?\s*(?:title="([^"]*)")?\s*$/);
		if (fence) {
			const buf = [];
			i++;
			while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
			i++;
			let lang = (fence[1] || '').trim();
			if (lang === 'components') {
				out.push({ t: 'components', title: fence[2] || '', source: buf.join('\n') });
			} else {
				const isWrong = /\bwrong\b/i.test(lang) || (out.length > 0 && out[out.length - 1].t === 'p' && /DO NOT DO THIS/i.test(out[out.length - 1].text));
				const isRight = /\bright\b/i.test(lang) || (out.length > 0 && out[out.length - 1].t === 'p' && /(?:^|\s)DO THIS/i.test(out[out.length - 1].text));
				if (isWrong && !lang.includes('wrong')) {
					lang += ' wrong';
				} else if (isRight && !lang.includes('right')) {
					lang += ' right';
				}
				out.push({ t: 'code', lang, title: fence[2] || '', code: buf.join('\n') });
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
		if (line.startsWith('> ')) {
			const buf = [];
			while (i < lines.length && lines[i].startsWith('> ')) { buf.push(lines[i].slice(2)); i++; }
			const joined = buf.join(' ');
			// Match `> [!TYPE]` optionally followed by more text on the same line.
			// The body is everything after the `]` (trimmed); if the `]` ended the
			// first line, the body is the remaining joined lines.
			const alert = joined.match(/^\[!(NOTE|TIP|KEY|WARNING|CAUTION|WILD|GROUNDING)\]\s*([\s\S]*)$/);
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
						if (k < lines.length && (lines[k].startsWith('```') || lines[k].startsWith('<br>') || lines[k].startsWith('&nbsp;'))) {
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
		out.push({ t: 'p', text: buf.join(' ') });
	}
	return out;
}

function render(blocks) {
	let html = '';
	let inH3 = false;
	// The opening numbered list (before any section heading) is the Hook Ladder.
	let seenHeading = false;
	
	for (let bi = 0; bi < blocks.length; bi++) {
		const b = blocks[bi];
		// If we encounter any heading, close the previous h3 section
		if (b.t === 'h1' || b.t === 'h2' || b.t === 'h3' || b.t === 'h4') {
			// The h1 is the lecture title, not a section: only real section
			// headings (h2/h3/h4) end the opening region that may hold the
			// Hook Ladder.
			if (b.t !== 'h1') seenHeading = true;
			if (inH3) {
				html += '</div>\n';
				inH3 = false;
			}
		}
		
		// If this is an h3, start a new wrapper
		if (b.t === 'h3') {
			const isGlossary = /^glossary\b/i.test(b.text.trim());
			const isSummary = /^summary\b/i.test(b.text.trim());
			let extra = isGlossary ? ' glossary-section' : (isSummary ? ' summary-section' : '');
			html += `<div class="keep-together${extra}">\n`;
			inH3 = true;
		}

		// Keep-together pair: DO NOT DO THIS / DO THIS lead-in and its code snippet
		if (b.t === 'p' && /(?:DO NOT DO THIS|DO THIS):/i.test(b.text) && bi + 1 < blocks.length && blocks[bi + 1].t === 'code') {
			const nextCode = blocks[bi + 1];
			html += `<div class="snippet-unit" style="page-break-inside: avoid; break-inside: avoid;">\n  <p style="page-break-after: avoid; break-after: avoid;">${inline(b.text)}</p>\n  ${highlightCode(nextCode.code, nextCode.title, nextCode.lang)}\n</div>\n`;
			bi++;
			continue;
		}
		
		switch (b.t) {
			case 'h1': html += `<h1>${inline(b.text)}</h1>\n`; break;
			// h2 = page break. Wrap the heading in a div that forces a new page
			// in PDF (Prince) and a visual break in the deck HTML.
			case 'h2': html += `<div class="page-break"><h2>${inline(b.text)}</h2></div>\n`; break;
			case 'h3': html += `<h3>${inline(b.text)}</h3>\n`; break;
			case 'h4': html += `<h4>${inline(b.text)}</h4>\n`; break;
			case 'code': html += highlightCode(b.code, b.title, b.lang) + '\n'; break;
			case 'components': html += renderComponentExplorer(b.source, b.title) + '\n'; break;
			case 'html-figure': {
				// Standalone HTML figure (React Component Explorer card): the src
				// attribute points at a file in md-lectures/figures/; its content is
				// inlined verbatim, wrapped in a figure with a numbered caption.
				figState.n += 1;
				let content = b.source;
				if (b.attrs.src) {
					try {
						let figPath = join(ROOT, b.attrs.src);
						if (!existsSync(figPath)) {
							figPath = join(dirs.mdLectures, b.attrs.src);
						}
						content = readFileSync(figPath, 'utf8');
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
				}[b.kind] || 'Tip';
				html += `<aside class="callout callout-${b.kind}">\n  <p class="callout-eyebrow">${eyebrow}</p>\n  <div class="callout-body">${inline(b.text, false)}</div>\n</aside>\n`;
				break;
			}
			case 'ul': {
				function renderUlItems(items) {
					let res = '<ul>\n';
					for (const item of items) {
						if (typeof item === 'string') {
							res += `<li>${inline(item, true)}</li>\n`;
						} else {
							let sub = '';
							if (item.children && item.children.length > 0) {
								sub = '\n' + renderUlItems(item.children);
							}
							res += `<li>${inline(item.text, true)}${sub}</li>\n`;
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

const page = (title, body, theme = 'teal') => `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="stylesheet" href="../src/lecture.css">
</head>
<body class="theme-${theme}">
<main>
${body}
</main>
</body>
</html>
`;

// The reader HTML lives next to the per-lecture HTML files (in md-lectures-html/),
// so it shares the same relative path to the stylesheet.
const deckPage = (title, body, theme = 'teal') => page(title, body, theme);

/* ---------------- lecture format checks (warnings, never blocking) ---------------- */

// The build is the only gate every author model passes through, so the format
// rules that kept regressing under context pressure live here as plain
// warnings in the build log. The warning list doubles as the polish model's
// work list.
function checkLecture(file, md) {
	const warns = [];
	const lines = md.split('\n');

	if (!/^# Lecture \d+: \S/.test(lines[0] || '')) warns.push(`title line is not "# Lecture {n}: {Short Title}"`);
	if (!/^>\s*INTERVIEW QUESTION\s*\|\s*❱+\s*[A-Z]+(\s*\(Server\))?\s*\|/.test(lines[1] || '')) warns.push(`line 2 is not the "> INTERVIEW QUESTION | ❱ TIER |" callout`);
	if (!/\[!(TIP|NOTE|KEY|WARNING|CAUTION|WILD|GROUNDING)\]/.test(md)) warns.push(`no alert callout ([!TIP] etc.) anywhere in the lecture`);
	if (!/```components/.test(md)) warns.push(`no "components" explorer panel (mandatory in every lecture; place one before the first code fence of the central mechanism)`);
	if (!/```(?:figure|html-figure)/.test(md)) warns.push(`no "html-figure" HTML figure panel (mandatory in every lecture; embed at least one md-lectures/figures/ RCE panel)`);

	// The completeness law: every file the lecture shows (fence title) or
	// imports must appear as an entry in a components panel tree.
	const treeFiles = new Set();
	for (const block of md.matchAll(/```components[^\n]*\n([\s\S]*?)```/g)) {
		for (const line of block[1].split('\n')) {
			const first = line.split('|')[0].trim();
			if (first) treeFiles.add(first.replace(/^\.\//, '').split('/').pop());
		}
	}
	const shownFiles = new Set();
	for (const m of md.matchAll(/title="([^"]+)"/g)) {
		if (/\.(jsx|tsx|js|ts)$/.test(m[1])) shownFiles.add(m[1].split('/').pop());
	}
	for (const m of md.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
		shownFiles.add(m[1].split('/').pop());
	}
	for (const f of shownFiles) {
		if (!treeFiles.has(f)) warns.push(`file "${f}" is fenced or imported but missing from the components panel tree`);
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

function buildDirectory(inputDir, htmlDir, pdfDir, deckTitle, checkFormat = false, deckFileName = 'deck') {
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
		// Reset figure numbering so captions read Fig {lecture}.{n}.
		figState.lecture = name;
		figState.n = 0;
		if (checkFormat) for (const warn of checkLecture(f, md)) console.log(`  warn ${f}: ${warn}`);
		const callout = calloutHTML(md);
		const bodyWithoutQuestion = stripQuestionLine(md);
		codeNotes.length = 0;
		const rendered = render(parseBlocks(bodyWithoutQuestion));
		for (const note of codeNotes) console.log(`  note ${f}: ${note}`);
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

	// Multi-theme decks: teal, black, and old (the react-lecture-01 look).
	// The reader is published once per theme under the pipeline's deck file
	// name (e.g. "React 19 Q01-Q12-teal.pdf"); no duplicate deck-* outputs.
	const themes = [
		{ id: 'teal', label: 'Teal' },
		{ id: 'black', label: 'Black' },
		{ id: 'old', label: 'Old' }
	];

	for (const th of themes) {
		const themedDeckHtml = deckPage(deckTitle, readerBody, th.id);
		writeFileSync(join(htmlDir, `${deckFileName}-${th.id}.html`), themedDeckHtml);
		console.log(`html  ${deckFileName}-${th.id}.html`);
	}

	// Default (untagged) reader, aliased to teal
	const defaultDeckHtml = deckPage(deckTitle, readerBody, 'teal');
	writeFileSync(join(htmlDir, `${deckFileName}.html`), defaultDeckHtml);
	console.log(`html  ${deckFileName}.html`);

	if (withPdf) {
		const targets = [...files.map((f) => basename(f, '.md')), deckFileName];
		for (const name of targets) {
			execFileSync('prince', [join(htmlDir, `${name}.html`), '-o', join(pdfDir, `${name}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
			console.log(`pdf   ${name}.pdf`);
		}

		// Compile multi-theme reader PDFs: <deckFileName>-teal.pdf, -black.pdf, -old.pdf
		for (const th of themes) {
			const thName = `${deckFileName}-${th.id}`;
			execFileSync('prince', [join(htmlDir, `${thName}.html`), '-o', join(pdfDir, `${thName}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
			console.log(`pdf   ${thName}.pdf`);
		}
	}
}

// Build standard lectures (format checks on: this is the lectures pipeline)
// TODO(infra): rename the reader once the question bank freezes, following the
// workspace convention (e.g. 'FastAPI Q01-Q100'); the count is not fixed yet.
buildDirectory(dirs.mdLectures, dirs.html, dirs.pdf, 'FastAPI Lectures', true, 'FastAPI Lectures');

// Build review experiment
buildDirectory(dirs.mdLecturesReview, dirs.htmlReview, dirs.pdfReview, 'FastAPI Review Series');

// Build data-flow pipeline (architectural placement on the reference app tree)
buildDirectory(dirs.mdDataFlow, dirs.htmlDataFlow, dirs.pdfDataFlow, 'FastAPI Data Flow Atlas');

console.log('done.');
