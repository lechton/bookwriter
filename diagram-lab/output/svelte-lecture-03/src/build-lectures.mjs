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
     **bold** / *italic**               inline emphasis
     `code`                            inline code
    ```lang title="File.svelte"       fenced code block with optional title
    ```components title="..."         generated component explorer panel
     - item                            bullet list
     1. item                          numbered list
     > quote                           blockquote
     [text](url)                       inline link
     everything else                   paragraphs (one line each, never hard-wrapped)
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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
};

/* ---------------- interview question (parsed from lecture source) ---------------- */

// The interview question is embedded in the lecture markdown as line 2, immediately
// after the `# Lecture N: Title` line, in the exact form:
//   > INTERVIEW QUESTION | <typology> | <question text>
// This function extracts the question text from that line and returns the pull-quote
// callout HTML. If the line is missing or malformed, returns '' (no callout).
function calloutHTML(mdSource) {
	const lines = mdSource.split('\n');
	// Line 0 is the title (# Lecture N: ...). Line 1 is the question blockquote.
	// Allow a small tolerance: scan the first 5 lines for the pattern.
	for (let i = 0; i < Math.min(lines.length, 5); i++) {
		const m = lines[i].match(/^>\s*INTERVIEW QUESTION\s*\|\s*(?:(❱+\s*[A-Z]+(?:\s*\(Kit\))?)\s*\|\s*)?(.+?)\s*$/i);
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
	// Links [text](url)
	out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`);
	// Bold then italic.
	out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	// Restore stashed inline code.
	out = out.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => `<code>${codeStash[Number(i)]}</code>`);
	// Restore <br> and <br/> tags
	out = out.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
	// Restore &nbsp;
	out = out.replace(/&amp;nbsp;/gi, '&nbsp;');
	return out;
}

/* ---------------- code highlighter (editor-style, // -> arrow) ---------------- */

// Svelte 5 runes — checked first so $state wins over the generic identifier rule.
// Covers $state (with .raw / .snapshot / .eager), $derived (with .by),
// $effect (with .pre), $props, $bindable, $inspect, and $host.
const RUNE_RE = /^\$(state(?:\.raw|\.snapshot|\.eager)?|derived(?:\.by)?|effect(?:\.pre)?|props|bindable|inspect|host)/;

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

			// Rune check first: $state, $derived, $props, etc.
			if (RUNE_RE.test(word)) {
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

// Default filename shown in the editor tab when the author did not set title=.
function defaultFilename(lang) {
	if (lang === 'svelte' || lang === 'svelte-html') return 'App.svelte';
	if (lang === 'js' || lang === 'svelte-js') return 'App.svelte.js';
	if (lang === 'javascript') return 'App.js';
	if (lang === 'ts' || lang === 'typescript') return 'App.ts';
	if (lang === 'html') return 'index.html';
	if (lang === 'css') return 'app.css';
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
	return `<div class="editor">${bar}<div class="code">${rows}</div></div>`;
}

function highlightMiniCode(code, lang) {
	const isWrong = lang && lang.includes('wrong');
	const isRight = lang && lang.includes('right');
	const cls = isWrong ? 'mini-code wrong' : (isRight ? 'mini-code right' : 'mini-code');

	const svgRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.3rem; height: 1.3rem;"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>`;
	const svgWrong = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 1.3rem; height: 1.3rem;"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 0 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>`;

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
	const starters = (l) => l.startsWith('```') || l.startsWith('#') || l.startsWith('- ') || /^\d+\.\s/.test(l) || l.startsWith('> ');
	const lines = md.split('\n');
	const out = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) { i++; continue; }

		// Fenced code block.
		const fence = line.match(/^```([\w\s-]+)?\s*(?:title="([^"]*)")?\s*$/);
		if (fence) {
			const buf = [];
			i++;
			while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
			i++;
			const lang = (fence[1] || '').trim();
			if (lang === 'components') {
				out.push({ t: 'components', title: fence[2] || '', source: buf.join('\n') });
			} else {
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

					const fenceMatch = next.match(/^```([\w\s-]+)?\s*(?:title="([^"]*)")?\s*$/);
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
	// The opening numbered list (before any section heading) is the Opening Ladder.
	let seenHeading = false;

	for (const b of blocks) {
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
			case 'components': html += renderComponentExplorer(b.source, b.title) + '\n'; break;
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
	if (!/^>\s*INTERVIEW QUESTION\s*\|\s*❱+\s*[A-Z]+(\s*\(Kit\))?\s*\|/.test(lines[1] || '')) warns.push(`line 2 is not the "> INTERVIEW QUESTION | ❱ TIER |" callout`);
	if (!/\[!(TIP|NOTE|KEY|WARNING|CAUTION)\]/.test(md)) warns.push(`no alert callout ([!TIP] etc.) anywhere in the lecture`);
	if (!/```components/.test(md)) warns.push(`no "components" explorer panel (mandatory in every lecture; place one before the first code fence of the central mechanism)`);

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
		if (/\.(svelte|js|ts|html|css)$/.test(m[1])) shownFiles.add(m[1].split('/').pop());
	}
	for (const m of md.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
		shownFiles.add(m[1].split('/').pop());
	}
	for (const f of shownFiles) {
		if (!treeFiles.has(f)) warns.push(`file "${f}" is fenced or imported but missing from the components panel tree`);
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

function buildDirectory(inputDir, htmlDir, pdfDir, deckTitle, checkFormat = false) {
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

// Build standard lectures (format checks on: this is the lectures pipeline)
buildDirectory(dirs.mdLectures, dirs.html, dirs.pdf, 'Svelte 5 Lecture Series', true);

console.log('done.');
