#!/usr/bin/env node
/* ============================================================
   build-lectures.mjs — css-01 lecture pipeline: md-lectures -> html -> pdf
   ------------------------------------------------------------
   Forked from ../../accessibility-01/src/build-lectures.mjs via the
   canvas-lab prototype (src/canvas-lab/build-demo.mjs). Two differences
   from the accessibility build: the ```figure fenced block is compiled
   by css-figure.mjs (the CSS Figure panel) instead of the Accessibility
   Canvas, and CSS code blocks get a CSS-aware tokenizer (selectors,
   properties, values, color swatches).

   Reads md-lectures/*.md, writes md-lectures-html/*.html plus a
   combined md-lectures-html/deck.html (course reader), then renders
   each to md-lectures-pdf/ via Prince.

   Usage (run from this project folder):
     node src/build-lectures.mjs            # build html + pdf
     node src/build-lectures.mjs --no-pdf   # build html only

   Markdown support (full formatting, long-form article):
     # Title                           h1
     ## Section                        h2 (page break)
     ### Subsection                    h3
     **bold** / *italic*               inline emphasis
     `code`                            inline code
    ```lang title="file.css"           fenced code block with optional title
    ```figure mode="box" ...           generated CSS Figure panel
     - item                            bullet list
     1. item                          numbered list
     > quote                          blockquote
     [text](url)                      inline link
     everything else                  paragraphs (one line each, never hard-wrapped)
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { renderCssFigure } from './css-figure.mjs';
import { latexToMathML } from './latex-to-mathml.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const withPdf = !args.includes('--no-pdf');

const dirs = {
	mdLectures: join(ROOT, 'md-lectures'),
	html: join(ROOT, 'md-lectures-html'),
	pdf: join(ROOT, 'md-lectures-pdf'),
};

// Figures are numbered Fig {lecture}.{n} per lecture; reset by buildDirectory.
const figState = { lecture: '0', n: 0 };

/* ---------------- interview question (parsed from lecture source) ---------------- */

// The interview question is embedded in the lecture markdown as line 2, immediately
// after the `# Lecture N: Title` line, in the exact form:
//   > INTERVIEW QUESTION | <tier> | <question text>
// This function extracts the question text from that line and returns the pull-quote
// callout HTML. If the line is missing or malformed, returns '' (no callout).
function calloutHTML(mdSource) {
	const lines = mdSource.split('\n');
	// Line 0 is the title (# Lecture N: ...). Line 1 is the question blockquote.
	// Allow a small tolerance: scan the first 5 lines for the pattern.
	for (let i = 0; i < Math.min(lines.length, 5); i++) {
		const m = lines[i].match(/^>\s*INTERVIEW QUESTION\s*\|\s*(?:(❱+\s*[A-Z]+(?:\s*\([^)]+\))?)\s*\|\s*)?(.+?)\s*$/i);
		if (m) {
			const typology = m[1];
			const question = m[2];

			let hook = '';
			for (let j = i + 1; j < lines.length; j++) {
				if (lines[j].trim() === '') continue; // skip blank lines
				// An Opening Ladder beat is never the box hook: in the ladder format
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
				// Strip only a prose hook. A numbered or bulleted line is an Opening
				// Ladder beat and must stay in the body.
				const t = lines[i].trim();
				if (!/^\d+\.\s/.test(t) && !t.startsWith('- ')) continue;
			}
		}
		out.push(lines[i]);
	}
	return out.join('\n');
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
	// Math (display $$...$$ and inline $...$)
	const mathStash = [];
	out = out.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => {
		mathStash.push(`<div class="math-block">${latexToMathML(m, true)}</div>`);
		return `\u0000MATH${mathStash.length - 1}\u0000`;
	});
	out = out.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (_, m) => {
		mathStash.push(latexToMathML(m, false));
		return `\u0000MATH${mathStash.length - 1}\u0000`;
	});
	// Images ![text](url)
	out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, t, u) => `<figure class="visual-aid"><img src="${u}" alt="${t}" class="${u.endsWith('.svg') ? 'svg-diagram' : 'raster-diagram'}"></figure>`);
	// Links [text](url)
	out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`);
	// Bold then italic.
	out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	// Restore stashed inline code.
	out = out.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => `<code>${codeStash[Number(i)]}</code>`);
	// Restore stashed math.
	out = out.replace(/\u0000MATH(\d+)\u0000/g, (_, i) => mathStash[Number(i)]);
	// Unescape escaped dollar signs
	out = out.replace(/\\\$/g, '$');
	// Restore <br> and <br/> tags
	out = out.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
	// Restore &nbsp;
	out = out.replace(/&amp;nbsp;/gi, '&nbsp;');
	return out;
}

function renderCalloutBody(text) {
	const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
	if (blocks.length === 0) return '';
	return blocks.map((block) => {
		const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
		if (lines.length > 0 && lines.every((l) => /^\d+\.\s/.test(l))) {
			const items = lines.map((l) => `    <li>${inline(l.replace(/^\d+\.\s/, ''))}</li>`).join('\n');
			return `  <ol>\n${items}\n  </ol>`;
		}
		if (lines.length > 0 && lines.every((l) => /^[-*]\s/.test(l))) {
			const items = lines.map((l) => `    <li>${inline(l.replace(/^[-*]\s/, ''))}</li>`).join('\n');
			return `  <ul>\n${items}\n  </ul>`;
		}
		return `  <p>${inline(lines.join(' '))}</p>`;
	}).join('\n');
}

/* ---------------- code highlighter (editor-style, // -> arrow) ---------------- */

// Svelte 5 runes ($state, $derived, $effect, $props, $bindable, $inspect) are the
// lecture's signature identifiers; every $word token is colored like a hook.
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

// Render **bold** inside a comment as <b class="tag">bold</b>, with distinct tag-wrong and tag-right styling.
function renderComment(text) {
	let normalized = text
		.replace(/^(?:<!--|\/\*|\/\/)?\s*DO NOT DO THIS:\s*/i, '**WRONG:** ')
		.replace(/^(?:<!--|\/\*|\/\/)?\s*DO THIS:\s*/i, '**RIGHT:** ')
		.replace(/^(?:<!--|\/\*|\/\/)?\s*WRONG:\s*/i, '**WRONG:** ')
		.replace(/^(?:<!--|\/\*|\/\/)?\s*RIGHT:\s*/i, '**RIGHT:** ');
	let t = escCode(normalized).replace(/\*\*([^*]+)\*\*/g, (match, p1) => {
		const upper = p1.toUpperCase().trim();
		if (upper === 'WRONG:' || upper === 'LOSER:') return `<b class="tag tag-wrong">${p1}</b>`;
		if (upper === 'RIGHT:' || upper === 'WINNER:') return `<b class="tag tag-right">${p1}</b>`;
		return `<b class="tag">${p1}</b>`;
	});
	return t.replace(/&lt;br&gt;/gi, '<br>');
}

// Tokenize one code line (no comment) into highlighted HTML.
// Order matters: svelte runes > strings > numbers > identifiers/keywords > function calls > rest.
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

		// Identifiers (and svelte runes / keywords / function calls).
		if (isIdentStart(c)) {
			let j = i + 1;
			while (j < n && isIdent(line[j])) j++;
			const word = line.slice(i, j);

			// Svelte rune check first: $state, $derived, $effect, etc.
			if (/^\$[a-z][A-Za-z0-9]*$/.test(word)) {
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

/* ---------------- CSS tokenizer ---------------- */
// CSS is not JavaScript: the JS tokenizer colors "94" inside "#94a3b8" as a
// number and knows no selectors. This tokenizer reads a CSS line as
// selector / property / value and paints a small swatch before every color.

const CSS_VALUE_KEYWORDS = new Set([
	'auto', 'none', 'left', 'right', 'both', 'block', 'inline', 'inline-block', 'flex', 'grid',
	'flow-root', 'border-box', 'content-box', 'relative', 'absolute', 'fixed', 'sticky', 'static',
	'column', 'row', 'wrap', 'nowrap', 'center', 'start', 'end', 'stretch', 'baseline', 'hidden',
	'visible', 'scroll', 'solid', 'dashed', 'dotted', 'bold', 'normal', 'italic', 'inherit', 'initial',
	'unset', 'transparent', 'currentColor', 'space-between', 'space-around', 'space-evenly',
	'flex-start', 'flex-end', 'important', 'clip',
]);

const NAMED_COLORS = new Set(['white', 'black', 'red', 'blue', 'green', 'gray', 'grey', 'orange', 'purple', 'yellow', 'pink', 'teal', 'navy', 'silver', 'maroon', 'olive', 'lime', 'aqua', 'fuchsia']);

function tokenizeCssValue(value) {
	let out = '';
	const re = /(#[0-9a-fA-F]{3,8}\b)|((?:rgba?|hsla?|oklch|var|calc|url|min|max|clamp|repeat|minmax)\()|(-?\d*\.?\d+(?:px|rem|em|%|vw|vh|fr|s|ms|deg|ch)?)|("[^"]*"|'[^']*')|(!important)|([a-zA-Z-]+)|(\S)|(\s+)/g;
	let m;
	while ((m = re.exec(value)) !== null) {
		if (m[1]) out += `<i class="swatch" style="background:${escCode(m[1])}"></i><span class="clr">${escCode(m[1])}</span>`;
		else if (m[2]) out += `<span class="fn">${escCode(m[2].slice(0, -1))}</span>(`;
		else if (m[3]) out += `<span class="nl">${escCode(m[3])}</span>`;
		else if (m[4]) out += `<span class="str">${escCode(m[4])}</span>`;
		else if (m[5]) out += `<span class="kw">!important</span>`;
		else if (m[6]) {
			const w = m[6];
			if (NAMED_COLORS.has(w.toLowerCase())) out += `<i class="swatch" style="background:${escCode(w)}"></i><span class="clr">${escCode(w)}</span>`;
			else if (CSS_VALUE_KEYWORDS.has(w)) out += `<span class="kw">${escCode(w)}</span>`;
			else out += escCode(w);
		}
		else out += escCode(m[0]);
	}
	return out;
}

function tokenizeCssLine(line) {
	// property: value;  (inside a rule, possibly after "{" on the same line)
	const declRe = /([a-zA-Z-]+)(\s*:\s*)([^;{}]+)(;?)/g;
	// A line that opens a rule: selector part before "{"
	const brace = line.indexOf('{');
	let out = '';
	let rest = line;
	if (brace >= 0) {
		const sel = line.slice(0, brace);
		out += `<span class="sel">${escCode(sel)}</span>{`;
		rest = line.slice(brace + 1);
	} else if (/^\s*[.#@:\[a-zA-Z*][^:;]*$/.test(line) && !line.includes(':')) {
		return `<span class="sel">${escCode(line)}</span>`;
	}
	let last = 0;
	let m;
	while ((m = declRe.exec(rest)) !== null) {
		out += escCode(rest.slice(last, m.index));
		out += `<span class="prop">${escCode(m[1])}</span>${escCode(m[2])}${tokenizeCssValue(m[3])}${m[4]}`;
		last = m.index + m[0].length;
	}
	out += escCode(rest.slice(last));
	return out;
}

// Language of the block currently being highlighted; set by highlightCode so
// highlightLine can pick the tokenizer.
let currentLang = '';
const tokenize = (line) => (/^(css|scss|less)\b/.test(currentLang) ? tokenizeCssLine(line) : tokenizeLine(line));

// Render one source line: split at the first // comment (followed by space or EOL),
// drop empty trailing comments, return {code, comment}.
function highlightLine(raw) {
	// Match a full-line comment: //, <!--, or /*
	const mFull = raw.match(/^(?:\/\/|<!--|\/\*)(\s|$)/);
	if (mFull && mFull.index === 0) {
		// Whole line is a comment.
		let text = raw
			.replace(/^(?:\/\/|<!--|\/\*)\s?/, '')
			.replace(/\s?-->\s*$/, '')
			.replace(/\s?\*\/\s*$/, '');
		if (!text.trim()) return null; // drop empty comment-only line
		text = text.replace(/(✔️|✖️|✖)\s*/g, '');
		text = text.charAt(0).toUpperCase() + text.slice(1);
		return { code: '', comment: text };
	}

	// Match an inline comment: //, <!--, or /*
	const idx = raw.search(/(?:\/\/|<!--|\/\*)(\s|$)/);
	if (idx > 0 && raw[idx - 1] !== ':') {
		const codePart = raw.slice(0, idx);
		const rest = raw.substr(idx);
		const matchToken = rest.startsWith('<!--') ? '<!--' : rest.startsWith('/*') ? '/*' : '//';
		let commentText = raw.slice(idx + matchToken.length).replace(/^\s?/, '').replace(/\s?-->\s*$/, '').replace(/\s?\*\/\s*\}?\s*$/, '');

		const code = tokenize(codePart);
		if (!commentText.trim()) return { code, comment: null }; // drop empty trailing //

		commentText = commentText.replace(/(✔️|✖️|✖)\s*/g, '');
		if (commentText.length > 0) {
			commentText = commentText.charAt(0).toUpperCase() + commentText.slice(1);
		}
		return { code, comment: commentText };
	}
	// No comment — tokenize the whole line.
	return { code: tokenize(raw), comment: null };
}

// Build the editor-style HTML for one fenced code block.

// Default filename shown in the editor tab when the author did not set title=.
function defaultFilename(lang) {
	const base = (lang || '').trim().split(/\s+/)[0];
	if (base === 'html') return 'index.html';
	if (base === 'svelte') return 'App.svelte';
	if (base === 'css') return 'styles.css';
	if (base === 'javascript' || base === 'js') return 'app.js';
	if (base === 'json') return 'data.json';
	if (base === 'nginx') return 'nginx.conf';
	return 'code.txt';
}

// Authoring notes collected while rendering code blocks; reset and printed per
// source file by buildDirectory so the author sees what the build auto-fixed.
const codeNotes = [];

function highlightCode(code, title, lang) {
	currentLang = lang || '';
	const isWrong = lang && lang.includes('wrong');
	const isRight = lang && lang.includes('right');
	const svgRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.5rem; height: 1.5rem;"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>`;
	const svgWrong = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.5rem; height: 1.5rem;"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>`;
	const icon = isWrong ? svgWrong : (isRight ? svgRight : '');
	const editorClass = isWrong ? 'editor wrong' : (isRight ? 'editor right' : 'editor');

	const pending = [];
	const parsed = [];
	code.split('\n').forEach((line, lineIdx) => {
		const spaceLine = line.replace(/\t/g, '  ');
		const indentMatch = spaceLine.match(/^(\s*)/);
		const indent = indentMatch ? indentMatch[1].length : 0;
		const result = highlightLine(spaceLine);
		const codeText = result ? result.code : '';
		const comment = result ? result.comment : null;
		if (result !== null && comment !== null && codeText.trim() === '') {
			codeNotes.push(`merged comment-only line ${lineIdx + 1} into the next code line's bubble`);
			pending.push(comment);
			return;
		}
		const hasCode = codeText.trim() !== '';
		const merged = hasCode ? pending.splice(0, pending.length) : [];
		parsed.push({ code: codeText, comment, indent, merged });
	});
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
			// The comment unit is TABBED to its code line's indent: the bubble's
			// inline margin-left carries the indent (the 8px base margin stays),
			// and the tail rides the bubble's own left edge pointing straight up
			// at the code start. All positioning is plain inline pixels because
			// Prince (the PDF renderer) ignores CSS custom properties (var()).
			const indentPx = Math.round(p.indent * 9.5);
			const bubbleMargin = 8 + indentPx;
			const tailLeft = isMulti ? 24 : 16;
			out += `\n      <div class="cmt-row" style="flex-basis: 100%; display: flex; align-items: flex-start;"><span class="num"></span><div class="${bubbleClass}" style="margin-left: ${bubbleMargin}px; max-width: calc(100% - ${48 + bubbleMargin + 20}px);"><i class="cmt-tail" style="left: ${tailLeft}px;"></i><span class="text">${renderComment(commentText)}</span></div></div>`;
		}
		out += `</div>`;
		return out;
	}).join('\n');
	
	let rawTitle = title || '';
	const filename = rawTitle || defaultFilename(lang);
	const bar = `<div class="bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="tab">${esc(filename)}</span></div>`;
	
	if (icon) {
		return `<div class="${editorClass}"><div class="editor-indicator">${icon}</div><div class="editor-main">${bar}<div class="code">${rows}</div></div></div>`;
	} else {
		return `<div class="editor"><div class="editor-main">${bar}<div class="code">${rows}</div></div></div>`;
	}
}

function highlightMiniCode(code, lang) {
	currentLang = lang || '';
	const isWrong = lang && lang.includes('wrong');
	const isRight = lang && lang.includes('right');
	const cls = isWrong ? 'mini-code wrong' : (isRight ? 'mini-code right' : 'mini-code');

	const svgRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.3rem; height: 1.3rem;"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>`;
	const svgWrong = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.3rem; height: 1.3rem;"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>`;

	const icon = isWrong ? svgWrong : (isRight ? svgRight : '');

	const rawLines = code.trim().split('\n');
	const srcHtml = rawLines.map((raw) => {
		return `<div>${tokenize(raw)}</div>`;
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
	const starters = (l) => l.startsWith('```') || l.trim().startsWith('$$') || l.startsWith('#') || l.startsWith('- ') || /^\d+\.\s/.test(l) || l.startsWith('> ') || l.trim().startsWith('![');
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

		// Standalone math block ($$...$$)
		const trimmedLine = line.trim();
		if (trimmedLine.startsWith('$$')) {
			if (trimmedLine.length > 2 && trimmedLine.endsWith('$$') && trimmedLine.slice(2, -2).trim().length > 0) {
				out.push({ t: 'math-block', latex: trimmedLine.slice(2, -2).trim() });
				i++;
				continue;
			}
			const buf = [];
			const firstContent = trimmedLine.slice(2).trim();
			if (firstContent) buf.push(firstContent);
			i++;
			while (i < lines.length && !lines[i].trim().endsWith('$$')) {
				buf.push(lines[i]);
				i++;
			}
			if (i < lines.length) {
				const lastLine = lines[i].trim();
				const lastContent = lastLine.slice(0, -2).trim();
				if (lastContent) buf.push(lastContent);
				i++;
			}
			out.push({ t: 'math-block', latex: buf.join('\n').trim() });
			continue;
		}

		// Fenced code block: ```lang key="val" key2="val2"
		const fenceMatch = line.match(/^```(\S+)(.*)$/);
		if (fenceMatch) {
			const rawLang = fenceMatch[1];
			const rest = fenceMatch[2] || '';
			const attrs = {};
			const attrRegex = /(\w[-\w]*)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
			let am;
			while ((am = attrRegex.exec(rest)) !== null) {
				attrs[am[1]] = am[2] ?? am[3] ?? am[4];
			}
			const buf = [];
			i++;
			while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
			i++;
			if (rawLang === 'canvas' || rawLang === 'figure') {
				// ```figure mode="box" layout="compare" caption="..." — the CSS Figure panel.
				out.push({ t: 'figure', attrs, source: buf.join('\n') });
			} else if (rawLang === 'html-figure') {
				out.push({ t: 'html-figure', attrs, source: buf.join('\n') });
			} else {
				let lang = rawLang;
				const isWrong = /\bwrong\b/i.test(rest) || /\bwrong\b/i.test(rawLang) || (out.length > 0 && out[out.length - 1].t === 'p' && /DO NOT DO THIS/i.test(out[out.length - 1].text));
				const isRight = /\bright\b/i.test(rest) || /\bright\b/i.test(rawLang) || (out.length > 0 && out[out.length - 1].t === 'p' && /(?:^|\s)DO THIS/i.test(out[out.length - 1].text));
				if (isWrong && !lang.includes('wrong')) {
					lang += ' wrong';
				} else if (isRight && !lang.includes('right')) {
					lang += ' right';
				}
				out.push({ t: 'code', lang, title: attrs.title || '', code: buf.join('\n') });
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
		// blockquote. Plain blockquotes are the project's authoritative-quote block.
		if (line.startsWith('> ') || line === '>') {
			const buf = [];
			while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
				buf.push(lines[i].replace(/^>\s?/, ''));
				i++;
			}
			const joined = buf.join('\n');
			const alert = joined.match(/^\[!(NOTE|TIP|KEY|WARNING|CAUTION|WISDOM|PEARL)\]\s*([\s\S]*)$/);
			if (alert) {
				out.push({ t: 'callout', kind: alert[1].toLowerCase(), text: alert[2].trim() });
			} else {
				out.push({ t: 'quote', text: buf.join(' ').replace(/\s+/g, ' ').trim() });
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
	// The opening numbered list (before any section heading) is the Opening Ladder.
	let seenHeading = false;

	for (let bi = 0; bi < blocks.length; bi++) {
		const b = blocks[bi];

		// If we encounter any heading, close the previous h3 section
		if (b.t === 'h1' || b.t === 'h2' || b.t === 'h3' || b.t === 'h4') {
			// The h1 is the lecture title, not a section: only real section
			// headings (h2/h3/h4) end the opening region that may hold the
			// Opening Ladder.
			if (b.t !== 'h1') seenHeading = true;
			if (inH3) {
				html += '</div>\n';
				inH3 = false;
			}
		}

		// If this is an h3, start a new wrapper
		if (b.t === 'h3') {
			const isGlossary = /^glossary\b/i.test(b.text.trim());
			html += `<div class="keep-together${isGlossary ? ' glossary-section' : ''}">\n`;
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
			case 'figure': {
				figState.n += 1;
				html += renderCssFigure(b.source, b.attrs, `${figState.lecture}.${figState.n}`) + '\n';
				break;
			}
			case 'html-figure': {
				figState.n += 1;
				let content = b.source;
				if (b.attrs.src) {
					try {
						content = readFileSync(join(ROOT, b.attrs.src), 'utf8');
					} catch (e) {
						console.error(`Missing html-figure src: ${b.attrs.src}`);
						content = `<div style="color:red;padding:20px;">Missing html-figure src: ${b.attrs.src}</div>`;
					}
				}
				const cap = b.attrs.caption ? `<figcaption>Fig ${figState.lecture}.${figState.n}: ${inline(b.attrs.caption)}</figcaption>` : '';
				html += `<figure class="css-figure">\n${content}\n${cap}\n</figure>\n`;
				break;
			}
			case 'image': {
				const isSvg = b.src.endsWith('.svg');
				html += `<figure class="visual-aid">\n  <img src="${b.src}" alt="${esc(b.alt)}" class="${isSvg ? 'svg-diagram' : 'raster-diagram'}">\n</figure>\n`;
				break;
			}
			case 'quote': html += `<blockquote>${inline(b.text)}</blockquote>\n`; break;
			case 'callout': {
				// Each alert type gets an on-brand eyebrow label. TIP is the project's
				// signature (interview-prep framing) -> "Interview Tip"; the others use
				// GitHub-standard labels for when authors reach for them.
				const lampSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:1.05rem;height:1.05rem;display:inline-block;vertical-align:-0.15rem;margin-right:0.35rem;"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9z"/></svg>`;
				const eyebrow = {
					tip: 'Interview Tip',
					note: 'Note',
					key: 'Key Takeaway',
					warning: 'Warning',
					caution: 'Caution',
					wisdom: `${lampSvg}Pearls of Wisdom`,
					pearl: `${lampSvg}Pearls of Wisdom`,
				}[b.kind] || 'Tip';
				html += `<aside class="callout callout-${b.kind}">\n  <p class="callout-eyebrow">${eyebrow}</p>\n  <div class="callout-body">\n${renderCalloutBody(b.text)}\n  </div>\n</aside>\n`;
				break;
			}
			case 'ul': html += `<ul>${b.items.map((x) => `<li>${inline(x)}</li>`).join('\n')}</ul>\n`; break;
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
							return inline(txt);
						}).join('\n');
						return `<li>${itemHtml}</li>`;
					}
					return `<li>${inline(item)}</li>`;
				}).join('\n');
				if (!seenHeading) {
					// The Opening Ladder: the build owns the lead sentence and the
					// wrapper div so every lecture's ladder is styled and worded
					// identically. Authors write only the numbered beats.
					html += `<div class="hook-ladder">\n<p class="hook-ladder-lead">Imagine this scenario:</p>\n<ol>${items}</ol>\n</div>\n`;
				} else {
					html += `<ol>${items}</ol>\n`;
				}
				break;
			}
			case 'math-block': html += `<div class="math-block">${latexToMathML(b.latex, true)}</div>\n`; break;
			case 'p': html += `<p>${inline(b.text)}</p>\n`; break;
			case 'table': {
				const head = `<thead><tr>${b.header.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>`;
				const body = `<tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
				html += `<table>${head}${body}</table>\n`;
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

/* ---------------- lecture format checks (warnings, never blocking) ---------------- */

// The build is the only gate every author model passes through, so the format
// rules that kept regressing under context pressure live here as plain
// warnings in the build log. The warning list doubles as the polish model's
// work list.
function checkLecture(file, md) {
	const warns = [];
	const lines = md.split('\n');

	if (!/^# Lecture \d+: \S/.test(lines[0] || '')) warns.push(`title line is not "# Lecture {n}: {Short Title}"`);
	if (!/^>\s*INTERVIEW QUESTION\s*\|\s*❱+\s*[A-Z]+(\s*\([^)]+\))?\s*\|/.test(lines[1] || '')) warns.push(`line 2 is not the "> INTERVIEW QUESTION | ❱ TIER |" callout`);
	if (!/\[!(TIP|NOTE|KEY|WARNING|CAUTION|WISDOM|PEARL)\]/.test(md)) warns.push(`no alert callout ([!TIP] etc.) anywhere in the lecture`);
	if (!/```(?:figure|html-figure)/.test(md)) {
		warns.push(`no "figure" or "html-figure" CSS Figure panel (mandatory in every lecture)`);
	}
	const bareSectionStart = md.match(/^###\s+[^\n]+\n+```/m);
	if (bareSectionStart) {
		warns.push(`section starts immediately with code or canvas; sections must begin with introductory context sentences to preserve layout`);
	}

	// The quoting law: every lecture must anchor at least one claim to a
	// verbatim quote with its citation path into primary specifications/resources
	// (e.g. W3C in resources/spec/ or MDN in resources/web-performance/).
	// Direct quotes from books/ are forbidden.
	if (!/(documentation official\/(css|accessibility-performance)\/)?resources\/[A-Za-z0-9_\/.-]+/.test(md)) {
		warns.push(`no primary citation path found (every lecture must quote at least one authoritative source verbatim, cited as resources/...)`);
	}
	if (/books\/[A-Za-z0-9_\/.-]+/.test(md)) {
		warns.push(`direct book citation found; cite primary standards (W3C/MDN) in resources/ instead of books`);
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
		if (headerCells.length !== 3) {
			warns.push(`closing table has ${headerCells.length} columns (expected exactly 3 columns: "| | COL B | COL C |"); transpose the table so comparison entities are rows rather than columns to prevent PDF overflow`);
		}
		if (!/^\|\s*---:\s*\|\s*:?---\s*\|\s*:?---\s*\|$/.test(divider)) warns.push(`closing table's divider row is not exactly "| ---: | :--- | :--- |"`);
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

	// Code block validation: check for standalone comment lines and internal DO NOT DO THIS directives
	let inCodeBlock = false;
	let codeBlockLang = '';
	for (let i = 0; i < lines.length; i++) {
		const l = lines[i];
		const trimmed = l.trim();
		if (trimmed.startsWith('```')) {
			if (!inCodeBlock) {
				inCodeBlock = true;
				codeBlockLang = trimmed.slice(3).trim();
				if (codeBlockLang.startsWith('spec-quote') || codeBlockLang === 'quote') {
					warns.push(`code block (line ${i + 1}) uses "${codeBlockLang}"; specification quotes MUST be authored as markdown blockquotes ('> "..."<br><br>*Citation*'), never as fenced code blocks`);
				}
			} else {
				inCodeBlock = false;
				codeBlockLang = '';
			}
			continue;
		}
		if (inCodeBlock && codeBlockLang !== 'canvas' && !codeBlockLang.startsWith('figure') && !codeBlockLang.startsWith('html-figure')) {
			// Standalone comment line check
			if (/^(?:\/\/|<!--|\/\*)/.test(trimmed) && (trimmed.endsWith('-->') || trimmed.endsWith('*/') || trimmed.startsWith('//'))) {
				warns.push(`code block (line ${i + 1}) has comment on its own line ("${trimmed.slice(0, 45)}..."); comments must live at the END of code lines (code; // annotation)`);
			}
			// Misplaced summary lead inside code fence
			if (/\bDO NOT DO THIS:\b|\bDO THIS:\b/.test(trimmed)) {
				warns.push(`code block (line ${i + 1}) contains "DO NOT DO THIS:" or "DO THIS:"; instructions belong above summary mini-fences, never inside code blocks`);
			}
		}
	}

	return warns;
}

/* ---------------- build ---------------- */

function buildDirectory(inputDir, htmlDir, pdfDir, deckTitle, checkFormat = false) {
	try {
		mkdirSync(htmlDir, { recursive: true });
		mkdirSync(pdfDir, { recursive: true });
	} catch (e) { /* ignore */ }

	let files;
	try {
		files = readdirSync(inputDir).filter((f) => f.endsWith('.md') && !f.endsWith('.thinking.md') && !f.includes('-old')).sort();
	} catch (e) {
		console.log(`skipping ${inputDir}: directory does not exist.`);
		return;
	}

	const targetNum = args.find((a) => /^\d+$/.test(a));
	if (targetNum) {
		files = files.filter((f) => basename(f, '.md') === targetNum.padStart(2, '0') || basename(f, '.md') === targetNum);
	}

	if (!files.length) {
		console.log(`no markdown files in ${inputDir}`);
		return;
	}

	const lectures = [];
	for (const f of files) {
		const name = basename(f, '.md');
		const md = readFileSync(join(inputDir, f), 'utf8');
		if (checkFormat) for (const warn of checkLecture(f, md)) console.log(`  warn ${f}: ${warn}`);
		const callout = calloutHTML(md);
		const bodyWithoutQuestion = stripQuestionLine(md);
		codeNotes.length = 0;
		figState.lecture = (md.match(/^# Lecture (\d+):/) || [, name.replace(/^0+/, '') || '0'])[1];
		figState.n = 0;
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

	if (!targetNum) {
		// Course reader: all lectures stitched, with a page break between each.
		const readerBody = lectures
			.map((l) => `<article class="lecture">${l.body}</article>`)
			.join('\n<hr class="lecture-break">\n');
		const htmlContent = deckPage(deckTitle, readerBody);
		writeFileSync(join(htmlDir, 'deck.html'), htmlContent);
		console.log(`html  deck.html`);
	}

	if (withPdf) {
		for (const name of files.map((f) => basename(f, '.md'))) {
			execFileSync('prince', [join(htmlDir, `${name}.html`), '-o', join(pdfDir, `${name}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
			console.log(`pdf   ${name}.pdf`);
		}
		if (!targetNum) {
			// The combined deck PDF is always named with its question range, for
			// example "Accessibility Q01-Q12.pdf". A previous build's ranged deck
			// (an old range, or the legacy deck.pdf) is removed so the folder never
			// carries two versions of the reader.
			const first = basename(files[0], '.md').padStart(2, '0');
			const last = basename(files[files.length - 1], '.md').padStart(2, '0');
			const deckName = `CSS Q${first}-Q${last}.pdf`;
			for (const f of readdirSync(pdfDir)) {
				if (f === deckName) continue;
				if (f === 'deck.pdf' || /^CSS Q\d+-Q\d+\.pdf$/.test(f)) unlinkSync(join(pdfDir, f));
			}
			execFileSync('prince', [join(htmlDir, 'deck.html'), '-o', join(pdfDir, deckName)], { stdio: ['ignore', 'ignore', 'inherit'] });
			console.log(`pdf   ${deckName}`);
		}
	}
}

// Build lectures (format checks on: this is the lectures pipeline)
buildDirectory(dirs.mdLectures, dirs.html, dirs.pdf, 'CSS Interview Lectures', true);

console.log('done.');
