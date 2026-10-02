#!/usr/bin/env node
/* ============================================================
   build-lectures.mjs — react-lecture-02 lecture pipeline: md-lectures -> html -> pdf
   ------------------------------------------------------------
   Pipeline for the React 19 & React Server interview lecture series (react-lecture-02).

   Reads md-lectures/*.md, writes md-lectures-html/*.html plus a
   combined md-lectures-html/deck.html (course reader), then renders
   each to md-lectures-pdf/ via Prince.

   Usage (run from this project folder):
     node src/build-lectures.mjs            # build html + pdf
     node src/build-lectures.mjs --no-pdf   # build html only
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, unlinkSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, isAbsolute, relative } from 'node:path';
import { latexToMathML } from './latex-to-mathml.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const withPdf = !args.includes('--no-pdf');

function getArg(flag) {
	const idx = args.indexOf(flag);
	if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
	return null;
}

const customInputDir = getArg('--input-dir');
const customHtmlDir = getArg('--html-dir');
const customPdfDir = getArg('--pdf-dir');

const dirs = {
	mdLectures: customInputDir ? (isAbsolute(customInputDir) ? customInputDir : join(ROOT, customInputDir)) : join(ROOT, 'md-lectures'),
	html: customHtmlDir ? (isAbsolute(customHtmlDir) ? customHtmlDir : join(ROOT, customHtmlDir)) : join(ROOT, 'md-lectures-html'),
	pdf: customPdfDir ? (isAbsolute(customPdfDir) ? customPdfDir : join(ROOT, customPdfDir)) : join(ROOT, 'md-lectures-pdf'),
};

// Figures are numbered Fig {lecture}.{n} per lecture; reset by buildDirectory.
const figState = { lecture: '0', n: 0 };
const diagState = { lecture: '0', n: 0 };

/* ---------------- interview question (parsed from lecture source) ---------------- */

// The interview question is embedded in the lecture markdown as line 2, immediately
// after the `# Lecture N: Title` line, in the exact form:
//   > INTERVIEW QUESTION | <tier> | <question text>
// This function extracts the question text from that line and returns the pull-quote
// callout HTML. If the line is missing or malformed, returns '' (no callout).
function calloutHTML(mdSource) {
	const lines = mdSource.split('\n');
	for (let i = 0; i < Math.min(lines.length, 5); i++) {
		const m = lines[i].match(/^>\s*INTERVIEW QUESTION\s*\|\s*(?:(❱+\s*[A-Z]+(?:\s*\([^)]+\))?)\s*\|\s*)?(.+?)\s*$/i);
		if (m) {
			const typology = m[1];
			const question = m[2];

			let hook = '';
			for (let j = i + 1; j < lines.length; j++) {
				if (lines[j].trim() === '') continue; // skip blank lines
				if (/^\d+\.\s/.test(lines[j].trim()) || lines[j].trim().startsWith('- ')) break;
				if (lines[j].startsWith('#') || lines[j].startsWith('>')) break;
				hook = lines[j];
				break;
			}

			let html = `<aside class="interview-question">\n  <div class="iq-header">\n    <p class="iq-eyebrow">Interview Question</p>\n`;
			if (typology) {
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
			continue;
		}
		if (foundQ && !strippedHook) {
			if (lines[i].trim() === '') {
				continue;
			}
			if (/^\d+\.\s/.test(lines[i].trim()) || lines[i].trim().startsWith('- ') || lines[i].startsWith('#') || lines[i].startsWith('>')) {
				strippedHook = true;
			} else {
				strippedHook = true;
				continue;
			}
		}
		out.push(lines[i]);
	}
	return out.join('\n');
}

/* ---------------- inline markdown formatter ---------------- */

function esc(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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

function renderParagraph(raw) {
	const chunks = raw.split(/\n\n+/).filter((c) => c.trim() !== '');
	return chunks.map((chunk) => {
		const lines = chunk.split('\n').map((l) => l.trim()).filter((l) => l !== '');
		return `  <p>${inline(lines.join(' '))}</p>`;
	}).join('\n');
}

/* ---------------- code highlighter ---------------- */

const HOOK_RE = /^use[A-Z][A-Za-z0-9]*$/;

const KEYWORDS = new Set([
	'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
	'new', 'class', 'extends', 'super', 'this', 'await', 'async', 'import', 'export',
	'from', 'default', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof',
	'in', 'of', 'true', 'false', 'null', 'undefined', 'break', 'continue', 'switch',
	'case', 'delete', 'void', 'yield', 'static', 'get', 'set',
]);

const REACT_PRIMITIVES = new Set([
	'createRoot', 'hydrateRoot', 'createContext', 'forwardRef', 'memo', 'startTransition',
	'lazy', 'flushSync', 'renderToPipeableStream', 'renderToString', 'Children',
	'cloneElement', 'isValidElement', 'Suspense', 'StrictMode', 'Fragment', 'Activity',
]);

function escCode(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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

function tokenizeLine(line) {
	let out = '';
	let i = 0;
	const n = line.length;
	const isIdentStart = (c) => /[A-Za-z_$]/.test(c);
	const isIdent = (c) => /[A-Za-z0-9_$]/.test(c);
	while (i < n) {
		const c = line[i];

		if (c === '"' || c === "'" || c === '`') {
			let j = i + 1;
			while (j < n && line[j] !== c) { if (line[j] === '\\') j++; j++; }
			const lit = line.slice(i, Math.min(j + 1, n));
			out += `<span class="str">${escCode(lit)}</span>`;
			i = j + 1;
			continue;
		}

		if (/\d/.test(c) && (i === 0 || !isIdent(line[i - 1]))) {
			const m = line.slice(i).match(/^\d+(\.\d+)?/);
			if (m) {
				out += `<span class="nl">${escCode(m[0])}</span>`;
				i += m[0].length;
				continue;
			}
		}

		if (isIdentStart(c)) {
			let j = i + 1;
			while (j < n && isIdent(line[j])) j++;
			const word = line.slice(i, j);

			if (HOOK_RE.test(word)) {
				out += `<span class="hook">${escCode(word)}</span>`;
			} else if (REACT_PRIMITIVES.has(word)) {
				out += `<span class="hook">${escCode(word)}</span>`;
			} else if (KEYWORDS.has(word)) {
				out += `<span class="kw">${escCode(word)}</span>`;
			} else {
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

		out += escCode(c);
		i++;
	}
	return out;
}

const CSS_VALUE_KEYWORDS = new Set([
	'auto', 'none', 'left', 'right', 'both', 'block', 'inline', 'inline-block', 'flex', 'grid',
	'flow-root', 'border-box', 'content-box', 'relative', 'absolute', 'fixed', 'sticky', 'static',
	'column', 'row', 'wrap', 'nowrap', 'center', 'start', 'end', 'stretch', 'baseline', 'hidden',
	'visible', 'scroll', 'solid', 'dashed', 'dotted', 'bold', 'normal', 'italic', 'inherit', 'initial',
	'unset', 'transparent', 'currentColor', 'space-between', 'space-around', 'space-evenly',
	'flex-start', 'flex-end', 'important', 'clip',
]);

function tokenizeCssValue(value) {
	let out = '';
	const re = /(#[0-9a-fA-F]{3,8}\b)|((?:rgba?|hsla?|oklch|var|calc|url|min|max|clamp|repeat|minmax)\()|(-?\d*\.?\d+(?:px|rem|em|%|vw|vh|fr|s|ms|deg|ch)?)|("[^"]*"|'[^']*')|(!important)|([a-zA-Z-]+)|(\S)|(\s+)/g;
	let m;
	while ((m = re.exec(value)) !== null) {
		const [raw, hex, fn, num, str, bang, ident, sym, ws] = m;
		if (hex) {
			out += `<span class="str">${escCode(hex)}</span>`;
		} else if (fn) {
			out += `<span class="fn">${escCode(fn.slice(0, -1))}</span>(`;
		} else if (num) {
			out += `<span class="nl">${escCode(num)}</span>`;
		} else if (str) {
			out += `<span class="str">${escCode(str)}</span>`;
		} else if (bang) {
			out += `<span class="kw">${escCode(bang)}</span>`;
		} else if (ident) {
			if (CSS_VALUE_KEYWORDS.has(ident.toLowerCase())) {
				out += `<span class="kw">${escCode(ident)}</span>`;
			} else {
				out += escCode(ident);
			}
		} else if (sym) {
			out += escCode(sym);
		} else if (ws) {
			out += ws;
		}
	}
	return out;
}

function tokenizeCssLine(line) {
	const colonIdx = line.indexOf(':');
	const openBrace = line.indexOf('{');
	const isProp = colonIdx !== -1 && (openBrace === -1 || colonIdx < openBrace) && !line.trim().startsWith('@');

	if (isProp) {
		const indent = line.match(/^\s*/)[0];
		const rest = line.slice(indent.length);
		const cIdx = rest.indexOf(':');
		const prop = rest.slice(0, cIdx);
		const valueAndSemi = rest.slice(cIdx + 1);
		const semiIdx = valueAndSemi.lastIndexOf(';');
		const value = semiIdx !== -1 ? valueAndSemi.slice(0, semiIdx) : valueAndSemi;
		const tail = semiIdx !== -1 ? valueAndSemi.slice(semiIdx) : '';

		return `${indent}<span class="css-prop">${escCode(prop)}</span>:${tokenizeCssValue(value)}${escCode(tail)}`;
	}

	let out = '';
	const re = /(@[a-zA-Z-]+)|(\.[a-zA-Z0-9_-]+)|(#[a-zA-Z0-9_-]+)|(:{1,2}[a-zA-Z0-9_-]+(?:\([^)]*\))?)|([a-zA-Z0-9_-]+)|("[^"]*"|'[^']*')|(\S)|(\s+)/g;
	let m;
	while ((m = re.exec(line)) !== null) {
		const [raw, atRule, cls, id, pseudo, tag, str, sym, ws] = m;
		if (atRule) out += `<span class="kw">${escCode(atRule)}</span>`;
		else if (cls) out += `<span class="css-class">${escCode(cls)}</span>`;
		else if (id) out += `<span class="css-id">${escCode(id)}</span>`;
		else if (pseudo) out += `<span class="css-pseudo">${escCode(pseudo)}</span>`;
		else if (tag) out += `<span class="css-tag">${escCode(tag)}</span>`;
		else if (str) out += `<span class="str">${escCode(str)}</span>`;
		else if (sym) out += escCode(sym);
		else if (ws) out += ws;
	}
	return out || escCode(line);
}

const codeNotes = [];

let currentLang = '';
const tokenize = (line) => (/^(css|scss|less)\b/.test(currentLang) ? tokenizeCssLine(line) : tokenizeLine(line));

function defaultFilename(lang) {
	const base = (lang || '').trim().split(/\s+/)[0];
	if (base === 'html') return 'index.html';
	if (base === 'jsx') return 'App.jsx';
	if (base === 'tsx') return 'App.tsx';
	if (base === 'react') return 'App.jsx';
	if (base === 'vue') return 'App.vue';
	if (base === 'svelte') return 'App.svelte';
	if (base === 'css') return 'styles.css';
	if (base === 'javascript' || base === 'js') return 'app.js';
	if (base === 'typescript' || base === 'ts') return 'app.ts';
	if (base === 'json') return 'data.json';
	if (base === 'nginx') return 'nginx.conf';
	return 'code.txt';
}

function highlightLine(raw) {
	// Match a full-line comment: //, <!--, or /*
	const mFull = raw.match(/^(?:\/\/|<!--|\/\*)(\s|$)/);
	if (mFull && mFull.index === 0) {
		let text = raw
			.replace(/^(?:\/\/|<!--|\/\*)\s?/, '')
			.replace(/\s?-->\s*$/, '')
			.replace(/\s?\*\/\s*$/, '');
		if (!text.trim()) return null;
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
		if (!commentText.trim()) return { code, comment: null };

		commentText = commentText.replace(/(✔️|✖️|✖)\s*/g, '');
		if (commentText.length > 0) {
			commentText = commentText.charAt(0).toUpperCase() + commentText.slice(1);
		}
		return { code, comment: commentText };
	}
	return { code: tokenize(raw), comment: null };
}

function highlightCode(code, title, lang) {
	currentLang = lang || '';
	const isWrong = lang && (lang.includes('wrong') || lang.endsWith('wrong'));
	const isRight = lang && (lang.includes('right') || lang.endsWith('right'));
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
			const indentPx = Math.round(p.indent * 9.5);
			const bubbleMargin = 8 + indentPx;
			const tailLeft = isMulti ? 24 : 16;
			out += `\n      <div class="cmt-row" style="flex-basis: 100%; display: flex; align-items: flex-start;"><span class="num"></span><div class="${bubbleClass}" style="margin-left: ${bubbleMargin}px; max-width: calc(100% - ${48 + bubbleMargin + 20}px);"><i class="cmt-tail" style="left: ${tailLeft}px;"></i><span class="text">${renderComment(commentText)}</span></div></div>`;
		}
		out += `</div>`;
		return out;
	}).join('\n');

	let rawTitle = title || '';
	if (!rawTitle && lang) {
		const m = lang.match(/title="([^"]+)"/);
		if (m) rawTitle = m[1];
	}
	const filename = rawTitle || defaultFilename(lang);
	const bar = `<div class="bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="tab">${esc(filename)}</span></div>`;

	if (icon) {
		return `<div class="${editorClass}"><div class="editor-indicator">${icon}</div><div class="editor-main">${bar}<div class="code">${rows}</div></div></div>`;
	} else {
		return `<div class="editor"><div class="editor-main">${bar}<div class="code">${rows}</div></div></div>`;
	}
}

/* ---------------- block parser ---------------- */

function parseBlocks(md) {
	const lines = md.split('\n');
	const blocks = [];
	let i = 0;
	const n = lines.length;

	while (i < n) {
		const line = lines[i];

		if (line.trim() === '') { i++; continue; }

		// Math block $$
		if (line.trim().startsWith('$$')) {
			let j = i + 1;
			const buf = [];
			if (line.trim() !== '$$') buf.push(line.trim().slice(2));
			while (j < n && !lines[j].trim().endsWith('$$')) {
				buf.push(lines[j]);
				j++;
			}
			if (j < n && lines[j].trim() !== '$$') {
				buf.push(lines[j].trim().slice(0, -2));
			}
			blocks.push({ t: 'math-block', latex: buf.join('\n') });
			i = j + 1;
			continue;
		}

		// Blockquote / Alert callouts
		if (line.startsWith('>')) {
			const calloutMatch = line.match(/^>\s*\[(?:!(TIP|NOTE|KEY|WARNING|CAUTION|WISDOM|PEARL)|(svg\s*image|diagram\s*note))\]\s*(.*)$/i);
			if (calloutMatch) {
				const alertType = (calloutMatch[1] || 'diagram').toLowerCase();
				const inlineTitle = calloutMatch[3];
				const buf = [];
				if (inlineTitle) buf.push(inlineTitle);
				let j = i + 1;
				while (j < n && lines[j].startsWith('>')) {
					buf.push(lines[j].replace(/^>\s?/, ''));
					j++;
				}
				blocks.push({ t: 'callout', alertType, text: buf.join('\n') });
				i = j;
				continue;
			}

			const buf = [];
			let j = i;
			while (j < n && lines[j].startsWith('>')) {
				buf.push(lines[j].replace(/^>\s?/, ''));
				j++;
			}
			blocks.push({ t: 'quote', text: buf.join('\n') });
			i = j;
			continue;
		}

		// Standalone image
		const imgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
		if (imgMatch) {
			blocks.push({ t: 'image', alt: imgMatch[1], src: imgMatch[2] });
			i++;
			continue;
		}

		// Standalone horizontal rule dividers (ignore to prevent literal <p>---</p> output)
		if (/^[-*_]{3,}$/.test(line.trim())) {
			i++;
			continue;
		}

		// Headings
		if (line.startsWith('# ')) { blocks.push({ t: 'h1', text: line.slice(2).trim() }); i++; continue; }
		if (line.startsWith('## ')) { blocks.push({ t: 'h2', text: line.slice(3).trim() }); i++; continue; }
		if (line.startsWith('### ')) { blocks.push({ t: 'h3', text: line.slice(4).trim() }); i++; continue; }
		if (line.startsWith('#### ')) { blocks.push({ t: 'h4', text: line.slice(5).trim() }); i++; continue; }

		// Fenced code blocks
		if (line.startsWith('```')) {
			const rawFence = line.slice(3).trim();
			let lang = rawFence;
			let title = '';
			const tm = rawFence.match(/title="([^"]+)"/);
			if (tm) {
				title = tm[1];
				lang = rawFence.replace(/\s*title="[^"]+"/, '').trim();
			}

			const buf = [];
			let j = i + 1;
			while (j < n && !lines[j].startsWith('```')) {
				buf.push(lines[j]);
				j++;
			}
			i = j + 1;

			const rawLang = lang.split(/\s+/)[0];
			const attrs = {};
			for (const m of rawFence.matchAll(/(\w+)="([^"]+)"/g)) {
				attrs[m[1]] = m[2];
			}

			if (rawLang === 'html-figure' || rawLang === 'figure') {
				blocks.push({ t: 'html-figure', attrs, source: buf.join('\n') });
			} else {
				blocks.push({ t: 'code', lang, title, code: buf.join('\n') });
			}
			continue;
		}

		// Lists
		if (/^[-*]\s/.test(line)) {
			const items = [];
			let j = i;
			while (j < n && /^[-*]\s/.test(lines[j])) {
				items.push(lines[j].replace(/^[-*]\s+/, ''));
				j++;
			}
			blocks.push({ t: 'ul', items });
			i = j;
			continue;
		}

		if (/^\d+\.\s/.test(line)) {
			const items = [];
			let j = i;
			while (j < n && /^\d+\.\s/.test(lines[j])) {
				items.push(lines[j].replace(/^\d+\.\s+/, ''));
				j++;
			}
			blocks.push({ t: 'ol', items });
			i = j;
			continue;
		}

		// Tables
		if (line.trim().startsWith('|')) {
			const rows = [];
			let j = i;
			while (j < n && lines[j].trim().startsWith('|')) {
				const cells = lines[j].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
				rows.push(cells);
				j++;
			}
			i = j;
			if (rows.length >= 2 && rows[1].every((c) => /^:?---+:?$/.test(c))) {
				const header = rows[0];
				const dataRows = rows.slice(2);
				blocks.push({ t: 'table', header, rows: dataRows });
			}
			continue;
		}

		// Paragraph
		const pBuf = [line];
		let j = i + 1;
		while (j < n && lines[j].trim() !== '' && !lines[j].startsWith('#') && !lines[j].startsWith('>') && !lines[j].startsWith('```') && !/^[-*]\s/.test(lines[j]) && !/^\d+\.\s/.test(lines[j]) && !lines[j].trim().startsWith('|') && !lines[j].trim().startsWith('$$') && !lines[j].trim().startsWith('![')) {
			pBuf.push(lines[j]);
			j++;
		}
		blocks.push({ t: 'p', text: pBuf.join(' ') });
		i = j;
	}

	return blocks;
}

/* ---------------- block renderer ---------------- */

function render(blocks) {
	let html = '';
	let inH3 = false;
	let ladderCount = 0;

	for (const b of blocks) {
		if (b.t === 'h3') {
			if (inH3) html += '</div>\n';
			html += '<div class="keep-together">\n';
			inH3 = true;
			html += `<h3>${inline(b.text)}</h3>\n`;
			continue;
		}

		switch (b.t) {
			case 'h1': html += `<h1>${inline(b.text)}</h1>\n`; break;
			case 'h2': html += `<h2>${inline(b.text)}</h2>\n`; break;
			case 'h4': html += `<h4>${inline(b.text)}</h4>\n`; break;
			case 'code': html += highlightCode(b.code, b.title, b.lang) + '\n'; break;
			case 'html-figure': {
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
			case 'quote': html += `<blockquote>${inline(b.text)}</blockquote>\n`; break;
			case 'callout': {
				const lampSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:1.05rem;height:1.05rem;display:inline-block;vertical-align:-0.15rem;margin-right:0.35rem;"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9z"/></svg>`;
				const diagramSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.05rem;height:1.05rem;display:inline-block;vertical-align:-0.15rem;margin-right:0.35rem;"><rect x="9" y="2" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="16" y="16" width="6" height="6" rx="1"></rect><path d="M5 16v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"></path><path d="M12 11V8"></path></svg>`;
				if (b.alertType === 'diagram') {
					diagState.n += 1;
				}
				const eyebrow = {
					tip: 'Interview Tip',
					note: 'Note',
					key: 'Key Takeaway',
					warning: 'Warning',
					caution: 'Caution',
					wisdom: `${lampSvg}Pearls of Wisdom`,
					pearl: `${lampSvg}Pearls of Wisdom`,
					diagram: `${diagramSvg}Diagram ${diagState.lecture}.${diagState.n}`,
				}[b.alertType] || 'Note';

				html += `<aside class="callout callout-${b.alertType}">\n  <p class="callout-eyebrow">${eyebrow}</p>\n${renderParagraph(b.text)}\n</aside>\n`;
				break;
			}
			case 'ul': {
				const items = b.items.map((it) => `  <li>${inline(it)}</li>`).join('\n');
				html += `<ul>\n${items}\n</ul>\n`;
				break;
			}
			case 'ol': {
				const items = b.items.map((it) => `  <li>${inline(it)}</li>`).join('\n');
				ladderCount++;
				if (ladderCount === 1) {
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

const page = (title, body, outDir = dirs.html) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="stylesheet" href="${relative(outDir, join(ROOT, 'src/lecture.css'))}">
</head>
<body>
<main>
${body}
</main>
</body>
</html>
`;

const deckPage = page;

/* ---------------- lecture format checks ---------------- */

function checkLecture(file, md) {
	const warns = [];
	const lines = md.split('\n');

	if (!/^# Lecture \d+: \S/.test(lines[0] || '')) warns.push(`title line is not "# Lecture {n}: {Short Title}"`);
	if (!/^>\s*INTERVIEW QUESTION\s*\|\s*❱+\s*[A-Z]+(\s*\([^)]+\))?\s*\|/.test(lines[1] || '')) warns.push(`line 2 is not the "> INTERVIEW QUESTION | ❱ TIER |" callout`);
	if (!/\[!(TIP|NOTE|KEY|WARNING|CAUTION|WISDOM|PEARL)\]/.test(md)) warns.push(`no alert callout ([!TIP] etc.) anywhere in the lecture`);
	if (!/```(?:figure|html-figure)/.test(md)) {
		warns.push(`no "figure" or "html-figure" CSS Figure panel (mandatory in every lecture)`);
	}

	// Standalone horizontal rule check
	let inFence = false;
	for (let i = 0; i < lines.length; i++) {
		const l = lines[i].trim();
		if (l.startsWith('```')) { inFence = !inFence; continue; }
		if (!inFence && /^[-*_]{3,}$/.test(l)) {
			warns.push(`line ${i + 1}: standalone "${l}" divider found; do not use "---" dividers between sections in lectures (demarcate sections with "###" headings only)`);
			break;
		}
	}

	const bareSectionStart = md.match(/^###\s+[^\n]+\n+```/m);
	if (bareSectionStart) {
		warns.push(`section starts immediately with code or canvas; sections must begin with introductory context sentences to preserve layout`);
	}

	// Citation check for authoritative React documentation
	const hasValidCitation = /(?:documentation official\/React 19 Sept 2026\/react\.dev\/src\/content\/[A-Za-z0-9_\/.-]+|(?:documentation official\/react\/)?resources\/[A-Za-z0-9_\/.-]+)/.test(md);
	if (!hasValidCitation) {
		warns.push(`no primary citation path found (every lecture must quote at least one authoritative source verbatim, cited as documentation official/React 19 Sept 2026/react.dev/src/content/... or resources/...)`);
	}
	if (/books\/[A-Za-z0-9_\/.-]+/.test(md)) {
		warns.push(`direct book citation found; cite primary standards in official documentation instead of books`);
	}

	if (!/^### Summary\s*$/m.test(md)) {
		warns.push(`no "### Summary" section`);
	} else {
		const summaryMatch = md.match(/^### Summary\s*\n+([^\n]+)/m);
		if (summaryMatch && /^\s*Look\b/i.test(summaryMatch[1])) {
			warns.push(`summary starts with conversational filler "${summaryMatch[1].slice(0, 20)}..."; start directly with practical context`);
		}
	}

	// Closing comparison table checks
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
	}

	// Code block formatting checks
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
			if (/^(?:\/\/|<!--|\/\*)/.test(trimmed) && (trimmed.endsWith('-->') || trimmed.endsWith('*/') || trimmed.startsWith('//'))) {
				warns.push(`code block (line ${i + 1}) has comment on its own line ("${trimmed.slice(0, 45)}..."); comments must live at the END of code lines (code; // annotation)`);
			}
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
		files = readdirSync(inputDir).filter((f) => f.endsWith('.md') && !f.endsWith('.thinking.md') && !f.includes('-old') && !f.startsWith('PATH-') && f !== 'README.md').sort();
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
		const rawNum = (md.match(/^# Lecture\s+(\d+):/) || [, name])[1];
		figState.lecture = String(parseInt(rawNum, 10));
		figState.n = 0;
		diagState.lecture = figState.lecture;
		diagState.n = 0;
		const rendered = render(parseBlocks(bodyWithoutQuestion));
		for (const note of codeNotes) console.log(`  note ${f}: ${note}`);
		const body = callout
			? rendered.replace(/(<\/h1>)/, `</h1>\n${callout}`)
			: rendered;
		lectures.push({ name, body });

		const title = (md.match(/^#\s+(.*)$/m) || [, `Lecture ${name}`])[1];
		writeFileSync(join(htmlDir, `${name}.html`), page(title, body, htmlDir));
		console.log(`html  ${name}.html`);
	}

	if (!targetNum) {
		const readerBody = lectures
			.map((l) => `<article class="lecture">${l.body}</article>`)
			.join('\n<hr class="lecture-break">\n');
		const htmlContent = deckPage(deckTitle, readerBody, htmlDir);
		writeFileSync(join(htmlDir, 'deck.html'), htmlContent);
		console.log(`html  deck.html`);
	}

	if (withPdf) {
		for (const name of files.map((f) => basename(f, '.md'))) {
			execFileSync('prince', [join(htmlDir, `${name}.html`), '-o', join(pdfDir, `${name}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
			console.log(`pdf   ${name}.pdf`);
		}
		if (!targetNum) {
			const first = basename(files[0], '.md').padStart(2, '0');
			const last = basename(files[files.length - 1], '.md').padStart(2, '0');
			const deckPrefix = getArg('--deck-prefix') || 'React 2026';
			const deckName = `${deckPrefix} Q${first}-Q${last}.pdf`;
			for (const f of readdirSync(pdfDir)) {
				if (f === deckName) continue;
				if (f === 'deck.pdf' || /^React(?:\s+2026)?\s+Q\d+-Q\d+\.pdf$/i.test(f)) unlinkSync(join(pdfDir, f));
			}
			execFileSync('prince', [join(htmlDir, 'deck.html'), '-o', join(pdfDir, deckName)], { stdio: ['ignore', 'ignore', 'inherit'] });
			console.log(`pdf   ${deckName}`);
		}
	}
}

buildDirectory(dirs.mdLectures, dirs.html, dirs.pdf, 'React 19 Interview Lectures', true);
console.log('done.');
