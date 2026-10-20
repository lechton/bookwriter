#!/usr/bin/env node
/* ============================================================
   build-revised-4.mjs: the short, visual edition (revision 4)
   ------------------------------------------------------------
   Reads   05-01-md-revised-4/<version>/NN.md
   Writes  05-02-md-revised-4-html/<version>/NN.html  (self-contained, CSS inlined)
           05-03-md-revised-4-pdf/<version>/NN.pdf    (via Prince)
   in the default theme, and NN-<theme>.html / NN-<theme>.pdf for every other theme in src/revised-4/themes/.
   Retired themes wait in src/revised-4/archive/, which the build does not read.

   Usage (run from this project folder):
     node src/build-revised-4.mjs                  # every lecture, every theme
     node src/build-revised-4.mjs 10               # lecture 10, every theme
     node src/build-revised-4.mjs 10 --theme ink   # lecture 10, one theme (plus nothing else)
     node src/build-revised-4.mjs 10 --no-pdf      # html only
     node src/build-revised-4.mjs 10 --version v1  # pick the version folder

   Styles: src/revised-4/base.css (structure) + src/revised-4/themes/<theme>.css (fonts, colours).
   The Markdown format and its blocks: skills/v8.1/summary-figures/blocks.md. The writing standard: skills/v8.1/summary-edition.
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { editorBlock } from './revised-4/editor.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC_BASE = join(ROOT, '05-01-md-revised-4');
const HTML_BASE = join(ROOT, '05-02-md-revised-4-html');
const PDF_BASE = join(ROOT, '05-03-md-revised-4-pdf');
const STYLE_DIR = join(ROOT, 'src', 'revised-4');
const BASE_CSS = readFileSync(join(STYLE_DIR, 'base.css'), 'utf8');
const THEMES = readdirSync(join(STYLE_DIR, 'themes')).filter((f) => f.endsWith('.css')).map((f) => f.slice(0, -4)).sort();
const DEFAULT_THEME = 'original';

const args = process.argv.slice(2);
const withPdf = !args.includes('--no-pdf');
const tIdx = args.indexOf('--theme');
const onlyTheme = tIdx !== -1 ? args[tIdx + 1] : null;
if (onlyTheme && !THEMES.includes(onlyTheme)) throw new Error(`Unknown theme "${onlyTheme}". Themes: ${THEMES.join(', ')}`);
const vIdx = args.indexOf('--version');
const version = vIdx !== -1 ? args[vIdx + 1] : latestVersion(SRC_BASE);
// a lesson is NN, or NN with a letter/suffix for a manual rewrite beside it, such as 03b or 11-gemini; it builds in every theme, as NN does
const wanted = args.filter((a, i) => /^\d+([a-z]|-[a-z0-9_-]+)?$/.test(a) && args[i - 1] !== '--version' && args[i - 1] !== '--theme').map((a) => a.replace(/^\d+/, (d) => d.padStart(2, '0')));

function latestVersion(base) {
	const vs = existsSync(base) ? readdirSync(base).filter((d) => /^v\d+$/.test(d)) : [];
	if (!vs.length) throw new Error(`No version folder (v1, v2, ...) in ${base}`);
	return vs.sort((a, b) => Number(b.slice(1)) - Number(a.slice(1)))[0];
}

/* ---------------------------------------------------------------- helpers */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(s) {
	const codes = [];
	let out = String(s).replace(/`([^`]+)`/g, (_, c) => {
		// short inline code never breaks across lines, so `data-form-id` cannot split at its dash
		codes.push(c.length <= 28 ? `<code class="nb">${esc(c)}</code>` : `<code>${esc(c)}</code>`);
		return `\u0000${codes.length - 1}\u0000`;
	});
	out = esc(out)
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>')
		.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2">$1</a>');
	return out.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
}

function parseAttrs(str) {
	const attrs = {};
	const re = /([\w-]+)=("([^"]*)"|(\S+))|(\S+)/g;
	let m;
	while ((m = re.exec(str || ''))) {
		if (m[1]) attrs[m[1]] = m[3] !== undefined ? m[3] : m[4];
		else attrs[m[5]] = true;
	}
	return attrs;
}

function lineSet(spec) {
	const set = new Set();
	for (const part of String(spec || '').split(',').filter(Boolean)) {
		const [a, b] = part.split('-').map(Number);
		for (let n = a; n <= (b || a); n++) set.add(n);
	}
	return set;
}

/* ---------------------------------------------------------------- parser */

function parseBlocks(lines, start = 0, closeOnColons = false) {
	const blocks = [];
	let i = start;
	while (i < lines.length) {
		const line = lines[i];
		if (closeOnColons && /^:::\s*$/.test(line)) return [blocks, i + 1];
		if (!line.trim()) { i++; continue; }

		let m;
		if (/^:::\s*pagebreak\s*$/.test(line)) { blocks.push({ type: 'pagebreak' }); i++; continue; }
		if ((m = line.match(/^:::\s*page\b(.*)$/))) {
			const [inner, next] = parseBlocks(lines, i + 1, true);
			blocks.push({ type: 'tintpage', attrs: parseAttrs(m[1]), blocks: inner });
			i = next;
			continue;
		}
		if ((m = line.match(/^:::\s*comic\b(.*)$/))) {
			const comic = { type: 'comic', attrs: parseAttrs(m[1]), panels: [] };
			i++;
			while (i < lines.length) {
				if (!lines[i].trim()) { i++; continue; }
				const c = lines[i].match(/^:::\s*panel\b(.*)$/);
				if (c) {
					const [inner, next] = parseBlocks(lines, i + 1, true);
					comic.panels.push({ attrs: parseAttrs(c[1]), blocks: inner });
					i = next;
					continue;
				}
				if (/^:::\s*$/.test(lines[i])) { i++; break; }
				throw new Error(`Line ${i + 1}: expected "::: panel" or ":::" inside a comic, found: ${lines[i]}`);
			}
			blocks.push(comic);
			continue;
		}
		if ((m = line.match(/^:::\s*row\b(.*)$/))) {
			const row = { type: 'row', attrs: parseAttrs(m[1]), cols: [] };
			i++;
			while (i < lines.length) {
				if (!lines[i].trim()) { i++; continue; }
				const c = lines[i].match(/^:::\s*col\b(.*)$/);
				if (c) {
					const [inner, next] = parseBlocks(lines, i + 1, true);
					row.cols.push({ attrs: parseAttrs(c[1]), blocks: inner });
					i = next;
					continue;
				}
				if (/^:::\s*$/.test(lines[i])) { i++; break; }
				throw new Error(`Line ${i + 1}: expected "::: col" or ":::" inside a row, found: ${lines[i]}`);
			}
			blocks.push(row);
			continue;
		}
		if ((m = line.match(/^```(\S*)\s*(.*)$/))) {
			const body = [];
			i++;
			while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
			i++;
			blocks.push({ type: 'fence', lang: m[1], attrs: parseAttrs(m[2]), body });
			continue;
		}
		if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
			blocks.push({ type: `h${m[1].length}`, text: m[2] });
			i++;
			continue;
		}
		if (line.startsWith('>')) {
			const inner = [];
			while (i < lines.length && lines[i].startsWith('>')) inner.push(lines[i++].replace(/^> ?/, ''));
			if (/^INTERVIEW QUESTION\s*\|/.test(inner[0])) {
				const [, tier, ...q] = inner[0].split('|').map((s) => s.trim());
				blocks.push({ type: 'interview', tier, question: q.join(' | ') });
			} else if (/^\[!FACT\]/.test(inner[0])) {
				blocks.push({ type: 'fact', text: [inner[0].replace(/^\[!FACT\]\s*/, ''), ...inner.slice(1)].filter(Boolean).join(' ') });
			} else if (/^\[!THINK\]/.test(inner[0])) {
				blocks.push({ type: 'think', text: [inner[0].replace(/^\[!THINK\]\s*/, ''), ...inner.slice(1)].filter(Boolean).join(' ') });
			} else if (/^\[!SAY\]/.test(inner[0])) {
				blocks.push({ type: 'say', text: [inner[0].replace(/^\[!SAY\]\s*/, ''), ...inner.slice(1)].filter(Boolean).join(' ') });
			} else if (/^\[!AHA\]/.test(inner[0])) {
				blocks.push({ type: 'aha', title: inner[0].replace(/^\[!AHA\]\s*/, '') || 'What is going on', blocks: parseBlocks(inner.slice(1))[0] });
			} else if (/^\[!PRINCIPLE\]/.test(inner[0])) {
				blocks.push({ type: 'principle', blocks: parseBlocks(inner.slice(1))[0] });
			} else {
				blocks.push({ type: 'quote', blocks: parseBlocks(inner)[0] });
			}
			continue;
		}
		if (line.startsWith('|')) {
			const rows = [];
			while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
			const cells = (r) => r.replace(/^\|/, '').replace(/\|\s*$/, '').split(/(?<!\\)\|/).map((c) => c.trim());
			blocks.push({ type: 'table', head: cells(rows[0]), rows: rows.slice(2).map(cells) });
			continue;
		}
		if (/^[-*]\s+/.test(line)) {
			const items = [];
			while (i < lines.length && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ''));
			blocks.push({ type: 'ul', items });
			continue;
		}
		if (/^\d+\.\s+/.test(line)) {
			const items = [];
			while (i < lines.length && /^\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s+/, ''));
			blocks.push({ type: 'ol', items });
			continue;
		}
		blocks.push({ type: 'p', text: line });
		i++;
	}
	return [blocks, i];
}

/* ---------------------------------------------------------------- code highlighting */

const KEYWORDS = new Set(['export', 'default', 'function', 'return', 'if', 'else', 'const', 'let', 'var', 'import', 'from', 'new']);
const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'NaN']);

function renderComment(text) {
	const m = text.match(/^(\/\/\s*|\{\/\*\s*)\*\*(WRONG|PROBLEMATIC):\*\*\s*(.*?)(\s*\*\/\})?$/);
	if (m) {
		const cls = m[2] === 'WRONG' ? 'flag-wrong' : 'flag-problem';
		return `<span class="t-com">${esc(m[1].trim())} </span><span class="flag ${cls}">${m[2]}</span><span class="t-com"> ${esc(m[3])}${m[4] ? ' ' + esc(m[4].trim()) : ''}</span>`;
	}
	return `<span class="t-com">${esc(text)}</span>`;
}

function highlight(line, state) {
	let out = '';
	let i = 0;
	const push = (cls, s) => { out += cls ? `<span class="${cls}">${esc(s)}</span>` : esc(s); };
	while (i < line.length) {
		const rest = line.slice(i);
		let m;
		if ((m = rest.match(/^\{\/\*.*?\*\/\}/))) { out += renderComment(m[0]); i += m[0].length; continue; }
		if (!state.inTag && (m = rest.match(/^\/\/.*$/))) { out += renderComment(m[0]); i += m[0].length; continue; }
		if ((m = rest.match(/^(['"`])(?:\\.|(?!\1).)*\1/))) { push(state.inTag ? 't-attrval' : 't-str', m[0]); i += m[0].length; continue; }
		if ((m = rest.match(/^<\/?>/))) { push('t-punc', m[0]); i += m[0].length; continue; }
		if ((m = rest.match(/^(<\/?)([A-Za-z][\w.]*)/))) {
			push('t-punc', m[1]);
			push(/^[A-Z]/.test(m[2]) ? 't-comp' : 't-tag', m[2]);
			state.inTag = true;
			i += m[0].length;
			continue;
		}
		if (state.inTag && (m = rest.match(/^\/?>/))) { push('t-punc', m[0]); state.inTag = false; i += m[0].length; continue; }
		if (state.inTag && (m = rest.match(/^[\w-]+(?==)/))) { push('t-attr', m[0]); i += m[0].length; continue; }
		if ((m = rest.match(/^(&&|\|\||===|!==|=>|\?\.|[?:!]|>=|<=|>(?=\s)|<(?=\s)|\+)/))) { push('t-op', m[0]); i += m[0].length; continue; }
		if ((m = rest.match(/^\d+(\.\d+)?\b/))) { push('t-num', m[0]); i += m[0].length; continue; }
		if ((m = rest.match(/^[A-Za-z_$][\w$]*/))) {
			const w = m[0];
			const next = line.slice(i + w.length);
			if (KEYWORDS.has(w)) push('t-kw', w);
			else if (LITERALS.has(w)) push('t-lit', w);
			else if (/^\s*\(/.test(next)) push('t-fn', w);
			else push(state.inTag ? 't-attr' : '', w);
			i += w.length;
			continue;
		}
		push(/[{}()[\];,.=]/.test(rest[0]) ? 't-punc' : '', rest[0]);
		i++;
	}
	return out;
}

function codeBlock(body, attrs) {
	return editorBlock(body, attrs);
}

/* ---------------------------------------------------------------- figure blocks */

function domPanel(body, attrs) {
	const state = { inTag: false };
	const rows = body.map((raw) => {
		const mark = raw[0];
		const cls = { '!': ' dom-bad', '+': ' dom-good', '*': ' dom-note', '-': ' dom-gone' }[mark] || '';
		const text = cls ? raw.slice(1) : raw;
		return `<div class="dom-line${cls}">${highlight(text, state) || ' '}</div>`;
	}).join('');
	const title = attrs.title || 'Elements panel';
	return `<div class="dom"><div class="dom-tabs"><span class="on">Elements</span><span>Console</span></div><div class="dom-head">${esc(title)}</div><div class="dom-body">${rows}</div></div>`;
}

function parseCard(spec) {
	const card = { marks: {} };
	for (const part of spec.split('|').map((s) => s.trim()).filter(Boolean)) {
		const eq = part.indexOf('=');
		if (eq === -1) { card[part] = true; continue; }
		const k = part.slice(0, eq).trim();
		const v = part.slice(eq + 1).trim();
		if (k === 'good' || k === 'bad') for (const f of v.split(',')) card.marks[f.trim()] = k;
		else card[k] = v;
	}
	return card;
}

// img=/john.jpg is a file in the lesson folder's public/, served at /john.jpg as Vite serves its public/ folder
function photoHTML(card, cls) {
	if (!existsSync(join(SRC_BASE, version, 'public', card.img.slice(1)))) throw new Error(`page block: img=${card.img} is not in ${version}/public/`);
	return `<div class="pimg photo${cls}"><img src="public${esc(card.img)}" alt="${esc(card.alt || '')}"></div>`;
}

function cardHTML(card) {
	const mark = (f) => (card.marks[f] ? ` mark-${card.marks[f]}` : '');
	if (card.ghost) {
		return `<div class="pcard ghost${mark('card')}"><div class="g g1"></div><div class="g g2"></div><div class="g g3"></div><div class="ghost-note">${card.ghost === true ? '&lt;article class="card"&gt; with empty tags' : esc(card.ghost)}</div></div>`;
	}
	let h = '';
	if (card.img) h += card.img.startsWith('/') ? photoHTML(card, mark('img')) : `<div class="pimg${mark('img')}"><span>${esc(card.img)}</span></div>`;
	if (card.label) h += `<span class="plabel${mark('label')}">${esc(card.label)}</span>`;
	if (card.title) h += `<div class="ptitle${mark('title')}">${esc(card.title)}</div>`;
	if (card.author) h += `<div class="pauthor${mark('author')}">By ${esc(card.author)}</div>`;
	if (card.missing) h += `<div class="pmissing${mark('missing')}">${esc(card.missing)} missing</div>`;
	if (card.text) h += `<div class="ptext${mark('text')}">${esc(card.text).replace(/\[([^\]]+)\]/g, '<u>$1</u>')}</div>`;
	if (card.raw) h += `<div class="praw${mark('raw')}">${esc(card.raw)}</div>`;
	// lines=a; b draws one paragraph broken into lines, as <br /> does
	if (card.lines) h += `<div class="ptext${mark('lines')}">${card.lines.split(';').map((t) => esc(t.trim())).join('<br>')}</div>`;
	if (card.input !== undefined) h += `<div class="pinput${mark('input')}"><span class="ph">${esc(card.input === true ? 'Write a comment' : card.input)}</span></div>`;
	if (card.typed) h += `<div class="pinput typed${mark('typed')}">${esc(card.typed)}<span class="caret"></span></div>`;
	if (card.foot) h += `<div class="pfoot${mark('foot')}">${esc(card.foot)}</div>`;
	return `<div class="pcard${mark('card')}">${h}</div>`;
}

const CONSOLE_KINDS = { error: 'c-error', warn: 'c-warn', log: 'c-log', quiet: 'c-quiet' };

function consoleLines(lines) {
	return lines.map(([kind, text]) => `<div class="cline ${CONSOLE_KINDS[kind]}">${kind === 'error' ? '<span class="x">x</span>' : kind === 'warn' ? '<span class="w">!</span>' : ''}${inline(text)}</div>`).join('');
}

function consolePanel(body, attrs) {
	const lines = body.filter((l) => l.trim()).map((l) => {
		const m = l.trim().match(/^(error|warn|log|quiet):\s*(.*)$/);
		if (!m) throw new Error(`console block: unknown line "${l}"`);
		return [m[1], m[2]];
	});
	const head = attrs.title ? `<div class="dom-head">${esc(attrs.title)}</div>` : '';
	return `<div class="dom console"><div class="dom-tabs"><span>Elements</span><span class="on">Console</span></div>${head}<div class="console-body">${consoleLines(lines)}</div></div>`;
}

function pageMock(body, attrs) {
	let url = 'localhost:5173';
	let blank = false;
	const parts = [];
	const cons = [];
	for (const raw of body) {
		const line = raw.trim();
		if (!line) continue;
		let m;
		if ((m = line.match(/^url:\s*(.*)$/))) url = m[1];
		else if ((m = line.match(/^heading:\s*(.*)$/))) parts.push(`<div class="phead">${esc(m[1])}</div>`);
		else if ((m = line.match(/^section:\s*(.*)$/))) parts.push(`<div class="psection">${esc(m[1])}</div>`);
		else if ((m = line.match(/^card:\s*(.*)$/))) parts.push(cardHTML(parseCard(m[1])));
		else if ((m = line.match(/^line:\s*(.*?)(\s*\|\s*(good|bad))?$/))) parts.push(`<div class="pline${m[3] ? ` mark-${m[3]}` : ''}">${esc(m[1])}</div>`);
		else if ((m = line.match(/^empty:\s*(.*)$/))) parts.push(`<div class="pempty">${esc(m[1])}</div>`);
		else if ((m = line.match(/^(row|stack):\s*(.*)$/))) parts.push(`<div class="plist plist-${m[1]}">${m[2].split(';').map((t) => `<span class="pitem">${esc(t.trim())}</span>`).join('')}</div>`);
		else if ((m = line.match(/^form:\s*(.*)$/))) parts.push(`<div class="pform"><span class="plabeltext">${esc(m[1])}</span><span class="pinput pinput-inline"></span></div>`);
		else if ((m = line.match(/^overlay:\s*(.*)$/))) parts.push(`<div class="poverlay"><div class="ov-msg">${esc(m[1])}</div></div>`);
		else if ((m = line.match(/^(console|error):\s*(.*)$/))) cons.push(['error', m[2]]);
		else if ((m = line.match(/^(warn|log|quiet):\s*(.*)$/))) cons.push([m[1], m[2]]);
		else if (line === 'blank') blank = true;
		else throw new Error(`page block: unknown line "${line}"`);
	}
	const size = attrs.size === 'mini' ? ' mini' : '';
	const view = blank ? '<div class="pblank">blank page</div>' : parts.join('');
	const consHTML = cons.length ? `<div class="pconsole">${consoleLines(cons)}</div>` : '';
	return `<div class="browser${size}"><div class="bbar"><span class="dots"><i></i><i></i><i></i></span><span class="url">${esc(url)}</span></div><div class="bview">${view}</div>${consHTML}</div>`;
}

/* Chrome's Console, light, with one logged value opened as Chrome draws it: no line numbers, a disclosure triangle on each
   object, property names in purple, strings in red. Lines, two spaces per level: "v text" an opened object, "> text" a
   closed one, any other line a property; " | note" after a line adds a note at its right. attrs: source (the file and line
   Chrome links at the right, where the code logged it). */
function dcHighlight(t) {
	let out = '';
	let i = 0;
	while (i < t.length) {
		const rest = t.slice(i);
		let m;
		if ((m = rest.match(/^(['"])(?:\\.|(?!\1).)*\1/))) { out += `<span class="dc-str">${esc(m[0])}</span>`; i += m[0].length; continue; }
		if ((m = rest.match(/^[A-Za-z_$][\w$]*(?=:)/))) { out += `<span class="dc-key">${esc(m[0])}</span>`; i += m[0].length; continue; }
		if ((m = rest.match(/^(null|undefined|true|false|\d+(\.\d+)?)\b/))) { out += `<span class="dc-lit">${m[0]}</span>`; i += m[0].length; continue; }
		out += esc(rest[0]);
		i++;
	}
	return out;
}

function devConsole(body, attrs) {
	const lines = body.filter((l) => l.trim());
	const rows = lines.map((raw, k) => {
		// "x message" is an error row, "= text" a dim line such as "No messages"
		if (/^x /.test(raw.trim())) return `<div class="dc-row dc-err" style="padding-left:8pt"><span class="dc-x"></span><span class="dc-val">${esc(raw.trim().slice(2))}</span></div>`;
		if (/^= /.test(raw.trim())) return `<div class="dc-row dc-empty" style="padding-left:8pt">${esc(raw.trim().slice(2))}</div>`;
		const depth = Math.floor(raw.match(/^ */)[0].length / 2);
		const [first, ...note] = raw.trim().split(' | ');
		let text = first;
		let tri = '<span class="dc-tri"></span>';
		if (/^v /.test(text)) { tri = '<span class="dc-tri dc-open"></span>'; text = text.slice(2); }
		else if (/^> /.test(text)) { tri = '<span class="dc-tri dc-closed"></span>'; text = text.slice(2); }
		const src = k === 0 && attrs.source ? `<span class="dc-src">${esc(attrs.source)}</span>` : '';
		const noteHTML = note.length ? `<span class="dc-note">${inline(note.join(' | '))}</span>` : '';
		return `<div class="dc-row${k === 0 ? ' dc-top' : ''}" style="padding-left:${(8 + depth * 11).toFixed(1)}pt">${tri}<span class="dc-val">${dcHighlight(text)}</span>${noteHTML}${src}</div>`;
	}).join('');
	return `<div class="dom dc"><div class="dom-tabs"><span>Elements</span><span class="on">Console</span><span>Sources</span><span>Network</span></div>` +
		`<div class="dc-bar"><span class="dc-ctx">top</span><span class="dc-filter">Filter</span><span class="dc-levels">Default levels</span></div>` +
		`<div class="dc-log">${rows}</div><div class="dc-prompt"><span class="dc-chev">&gt;</span><span class="dc-caret"></span></div></div>`;
}
/* ---------------------------------------------------------------- trees (revision 4) */

/* parse an indented outline: a root line, then "- label | note" lines, two spaces per level.
   A leading "+" or "!" on a label marks a right or a wrong branch. */
function parseOutline(lines) {
	const rows = lines.filter((l) => l.trim()).map((l) => {
		const depth = Math.floor(l.match(/^ */)[0].length / 2);
		const text = l.trim().replace(/^- /, '');
		return { depth, text };
	});
	const root = { ...splitNode(rows[0].text), children: [], depth: -1 };
	const stack = [root];
	for (const r of rows.slice(1)) {
		const node = { ...splitNode(r.text), children: [], depth: r.depth };
		while (stack.length > 1 && stack[stack.length - 1].depth >= r.depth) stack.pop();
		stack[stack.length - 1].children.push(node);
		stack.push(node);
	}
	return root;
}

function splitNode(text) {
	let mark = '';
	if (/^[+!]/.test(text)) { mark = text[0]; text = text.slice(1); }
	const [label, ...rest] = text.split('|').map((t) => t.trim());
	return { label, note: rest.join(' | '), mark };
}

const plain = (s) => String(s).replace(/`/g, '').trim();

function leaves(node) {
	return node.children.length ? node.children.reduce((n, c) => n + leaves(c), 0) : 1;
}

function markPath(node, here, trail = []) {
	if (here && plain(node.label) === plain(here)) {
		node.cls = 'here';
		trail.forEach((a) => { a.cls = a.cls || 'path'; });
		return true;
	}
	return node.children.some((c) => markPath(c, here, [...trail, node]));
}

function nodeBox(node, extra = '') {
	const mark = node.mark === '+' ? '<span class="t-mark t-mk-right"></span>' : node.mark === '!' ? '<span class="t-mark t-mk-wrong"></span>' : '';
	const note = node.note ? `<div class="t-note">${inline(node.note)}</div>` : '';
	return `<div class="t-node ${node.cls || ''} ${node.mark === '+' ? 't-good' : node.mark === '!' ? 't-bad' : ''}${extra}"><div class="t-label">${mark}${inline(node.label)}</div>${note}</div>`;
}

/* a tree that grows downward, laid out as one grid: one row of boxes per level, with the connector rows between.
   Every box on a level sits in the same flex row, so each one is as tall as the tallest box on its level; each box keeps
   its own width. A node's share of the width follows the number of end boxes under it, as before. */
function treeDown(root, box = nodeBox) {
	const total = leaves(root);
	const levels = [];
	(function place(node, level, offset) {
		node.offset = offset;
		node.span = leaves(node);
		(levels[level] = levels[level] || []).push(node);
		let at = offset;
		for (const c of node.children) { place(c, level + 1, at); at += leaves(c); }
	})(root, 0, 0);
	const pct = (units) => `${((units / total) * 100).toFixed(4)}%`;
	// one row from its pieces, each { at, span, html, cls }, with empty pieces filling the gaps (under end boxes of a level above)
	const row = (cls, pieces) => {
		let at = 0;
		let out = '';
		for (const p of pieces) {
			if (p.at > at) out += `<div class="t-cell t-empty" style="width:${pct(p.at - at)}"></div>`;
			out += `<div class="${p.cls}" style="width:${pct(p.span)}">${p.html || ''}</div>`;
			at = p.at + p.span;
		}
		if (at < total) out += `<div class="t-cell t-empty" style="width:${pct(total - at)}"></div>`;
		return `<div class="t-row ${cls}">${out}</div>`;
	};
	let html = '';
	levels.forEach((nodes, level) => {
		html += row('t-boxes', nodes.map((n) => ({ at: n.offset, span: n.span, cls: 't-cell', html: box(n) })));
		const parents = nodes.filter((n) => n.children.length);
		if (!parents.length) return;
		html += row('t-stems', parents.map((n) => ({ at: n.offset, span: n.span, cls: 't-cell', html: '<div class="t-stem"></div>' })));
		const halves = [];
		for (const n of parents) {
			n.children.forEach((c, i) => {
				const half = c.span / 2;
				halves.push({ at: c.offset, span: half, cls: `t-half t-stub${i > 0 ? ' t-bar' : ''}` });
				halves.push({ at: c.offset + half, span: half, cls: `t-half${i < n.children.length - 1 ? ' t-bar' : ''}` });
			});
		}
		html += row('t-fork', halves);
	});
	return `<div class="t-grid">${html}</div>`;
}

/* a tree that grows to the right: the root on the left, its branches stacked on the right */
function treeRight(node) {
	const n = node.children.length;
	const rows = node.children.map((c, i) => {
		const pos = n === 1 ? 'only' : i === 0 ? 'first' : i === n - 1 ? 'last' : 'mid';
		const rootCells = i === 0 ? `<td rowspan="${n}" class="r-root">${nodeBox(node)}</td><td rowspan="${n}" class="r-stem"></td>` : '';
		const result = c.note ? `<td class="r-arrow"><span class="arrow"></span></td><td class="r-result ${c.mark === '+' ? 'r-good' : c.mark === '!' ? 'r-bad' : ''}">${inline(c.note)}</td>` : '<td></td><td></td>';
		const branch = { ...c, note: '' };
		return `<tr>${rootCells}<td class="r-joint r-${pos}"></td><td class="r-branch">${nodeBox(branch)}</td>${result}</tr>`;
	}).join('');
	return `<table class="t-right">${rows}</table>`;
}

function treeBlock(body, attrs) {
	const root = parseOutline(body);
	if (attrs.here) markPath(root, attrs.here);
	const inner = attrs.dir === 'right' ? treeRight(root) : treeDown(root);
	const size = attrs.size === 'mini' ? ' tree-mini' : '';
	return `<div class="tree${size}">${inner}</div>`;
}

/* a component hierarchy on the left, the relationship between the components on the right.
   Tree lines: "Name | holds: ... | gets: ... | here | role: ...", two spaces per level. After a line "notes:", one sentence per line. */
function hierarchyBlock(body, attrs) {
	const cut = body.findIndex((l) => /^notes:\s*$/.test(l.trim()));
	const treeLines = (cut === -1 ? body : body.slice(0, cut)).filter((l) => l.trim());
	const notes = cut === -1 ? [] : body.slice(cut + 1).filter((l) => l.trim());
	const rows = treeLines.map((l) => {
		const depth = Math.floor(l.match(/^ */)[0].length / 2);
		const parts = l.trim().split('|').map((t) => t.trim());
		const node = { label: parts[0], holds: '', gets: '', here: false, role: '', children: [], depth };
		for (const p of parts.slice(1)) {
			let m;
			if ((m = p.match(/^holds:\s*(.*)$/))) node.holds = m[1];
			else if ((m = p.match(/^gets:\s*(.*)$/))) node.gets = m[1];
			else if (p === 'here') node.here = 'the choice is made here';
			else if ((m = p.match(/^here:\s*(.*)$/))) node.here = m[1];
			else if ((m = p.match(/^role:\s*(.*)$/))) node.role = m[1];
		}
		return node;
	});
	const root = rows[0];
	root.depth = -1;
	const stack = [root];
	for (const r of rows.slice(1)) {
		while (stack.length > 1 && stack[stack.length - 1].depth >= r.depth) stack.pop();
		stack[stack.length - 1].children.push(r);
		stack.push(r);
	}
	const box = (node) => {
		const gets = node.gets ? `<div class="h-gets"><span class="h-key">receives</span> ${inline(node.gets)}</div>` : '';
		const holds = node.holds ? `<div class="h-holds"><span class="h-key">holds</span> ${inline(node.holds)}</div>` : '';
		const here = node.here ? `<div class="h-here">${inline(node.here)}</div>` : '';
		// the place in the tree, counted from the panel's root unless the line names it with "role:"
		const role = node.role || ['PARENT', 'CHILD', 'GRANDCHILD'][Math.max(node.depth, 0)] || 'DESCENDANT'; // the root's depth is -1, its children's 1
		return `<div class="h-node${node.here ? ' h-choice' : ''}"><span class="h-role">${esc(role)}</span><div class="h-tag">&lt;${esc(node.label)} /&gt;</div>${gets}${holds}${here}</div>`;
	};
	const list = notes.map((t) => `<li${/^We want/.test(t.trim()) ? ' class="h-goal"' : ''}>${inline(t.trim())}</li>`).join('');
	if (attrs.layout === 'stack') {
		return `<table class="hier hier-stack"><tr><td class="hier-tree">${treeDown(root, box)}</td></tr><tr><td class="hier-notes"><ol>${list}</ol></td></tr></table>`;
	}
	return `<table class="hier"><tr><td class="hier-tree">${treeDown(root, box)}</td><td class="hier-notes"><ol>${list}</ol></td></tr></table>`;
}

/* glyph spec, tokens separated by spaces:
   _ empty box, # filled box, A to Z a filled box with that letter, a to z a data item (outlined),
   A:1 a filled box carrying key 1, or / > small connectors */
/* Vite's error overlay: "message:" and "help:" lines, "file:" for the place, other lines are the code frame */
function overlayPanel(body, attrs) {
	const msgs = [];
	const frame = [];
	let file = '';
	for (const raw of body) {
		let m;
		if ((m = raw.match(/^message:\s*(.*)$/))) msgs.push(`<div class="ov-msg">${esc(m[1])}</div>`);
		else if ((m = raw.match(/^help:\s*(.*)$/))) msgs.push(`<div class="ov-help">${esc(m[1])}</div>`);
		else if ((m = raw.match(/^file:\s*(.*)$/))) file = m[1];
		else frame.push(raw);
	}
	const fileHTML = file ? `<div class="ov-file">${esc(file)}</div>` : '';
	const frameHTML = frame.length ? `<div class="ov-frame">${frame.map((l) => `<div>${esc(l) || ' '}</div>`).join('')}</div>` : '';
	const size = attrs.size === 'mini' ? ' mini' : '';
	return `<div class="browser${size}"><div class="bbar"><span class="dots"><i></i><i></i><i></i></span><span class="url">localhost:5173</span></div><div class="overlay">${msgs.join('')}${fileHTML}${frameHTML}</div></div>`;
}

/* top-to-bottom stages: "label | where | code" per line, joined by down arrows */
function stages(body, attrs) {
	const rows = body.filter((l) => l.trim()).map((l) => {
		const [label, where, ...code] = l.split('|').map((t) => t.trim());
		const state = { inTag: false };
		return `<tr><td class="stage-label"><div class="stage-name">${inline(label)}</div><div class="stage-where">${inline(where)}</div></td><td class="stage-code"><div class="stage-box">${highlight(code.join(' | '), state)}</div></td></tr>`;
	});
	return `<table class="stages">${rows.join('<tr class="stage-gap"><td></td><td><span class="darrow"></span></td></tr>')}</table>`;
}

function glyphs(spec) {
	const tone = (ch) => ['gl-c0', 'gl-c1', 'gl-c2', 'gl-c3'][(ch.toUpperCase().charCodeAt(0) - 65) % 4];
	return String(spec || '').split(/\s+/).filter(Boolean).map((t) => {
		let m;
		if (t === '_') return '<span class="gl gl-empty"></span>';
		if (t === '#') return '<span class="gl gl-full gl-c0"></span>';
		if (t === 'or') return '<span class="gl-or">or</span>';
		if (t === '>') return '<span class="gl-to"><span class="arrow"></span></span>';
		if ((m = t.match(/^([A-Z]):(\w+)$/))) return `<span class="gl gl-full ${tone(m[1])}">${m[1]}<span class="gl-key">${esc(m[2])}</span></span>`;
		if (/^[A-Z]$/.test(t)) return `<span class="gl gl-full ${tone(t)}">${t}</span>`;
		if (/^[a-z]$/.test(t)) return `<span class="gl gl-data">${t}</span>`;
		throw new Error(`ladder glyph: unknown token "${t}"`);
	}).join('');
}

/* ladder lines: "size | tool | example | glyphs"; a line "group: Label" starts a group of steps */
function ladder(body, attrs) {
	const groups = [];
	for (const raw of body) {
		const l = raw.trim();
		if (!l) continue;
		const g = l.match(/^group:\s*(.*)$/);
		if (g) { groups.push({ label: g[1], steps: [] }); continue; }
		if (!groups.length) groups.push({ label: '', steps: [] });
		groups[groups.length - 1].steps.push(l.split('|').map((s) => s.trim()));
	}
	let n = 0;
	const gap = '<td class="step-gap"><span class="arrow"></span></td>';
	const stepCells = [];
	const headCells = [];
	groups.forEach((g, gi) => {
		const cells = g.steps.map(([size, tool, example, spec]) => {
			n++;
			return `<td class="step"><div class="step-n">${n}</div><div class="step-size">${inline(size)}</div>${spec ? `<div class="step-glyphs">${glyphs(spec)}</div>` : ''}<div class="step-tool">${esc(tool)}</div><div class="step-ex">${inline(example || '')}</div></td>`;
		});
		stepCells.push(cells.join(gap));
		headCells.push(`<td class="group-head" colspan="${g.steps.length * 2 - 1}"><span>${inline(g.label)}</span></td>`);
	});
	const hasGroups = groups.some((g) => g.label);
	const head = hasGroups ? `<tr class="group-row">${headCells.join('<td class="step-gap"></td>')}</tr>` : '';
	const anchor = attrs.anchor ? `<div class="ladder-anchor">${inline(attrs.anchor)}</div>` : '';
	const colgroup = `<colgroup>${Array.from({ length: n }, () => '<col>').join('<col style="width:14pt">')}</colgroup>`;
	return `<div class="ladder">${anchor}<table class="ladder-steps">${colgroup}${head}<tr>${stepCells.join(gap)}</tr></table></div>`;
}

function chain(body) {
	const rows = body.filter((l) => l.trim()).map((l) => {
		const mark = /^[!+]/.test(l) ? l[0] : '';
		const parts = (mark ? l.slice(1) : l).split('->').map((s) => s.trim());
		const boxes = parts.map((p, k) => `<td class="chain-box${k === 0 ? ' first' : ''}">${inline(p)}</td>`).join('<td class="chain-arrow"><span class="arrow"></span></td>');
		return `<tr class="${mark === '!' ? 'chain-bad' : mark === '+' ? 'chain-good' : ''}">${boxes}</tr>`;
	}).join('');
	return `<table class="chain">${rows}</table>`;
}

/* figures with a caption are numbered per lecture, "Figure 10.3"; themes choose whether to show the number */
const figureCount = { lecture: '', n: 0 };

function figure(inner, caption, extra = '') {
	const num = caption ? `<span class="fig-num">Figure ${figureCount.lecture}.${++figureCount.n}</span> ` : '';
	return `<figure class="fig${extra}">${inner}${caption ? `<figcaption>${num}${inline(caption)}</figcaption>` : ''}</figure>`;
}

/* ---------------------------------------------------------------- the What is going on box and the mail app */

/* The "What is going on" box (skills/v8.1/summary-edition Section 07C): a lamp, the title, numbered steps that start
   from the most basic fact and end on the surprise, and a closing line in bold. A step that opens with **Oops** is
   drawn as the surprise. */
const LAMP_SVG = '<svg class="aha-lamp" viewBox="0 0 24 26" aria-hidden="true">' +
	'<path d="M12 5a6.2 6.2 0 0 0-3.7 11.2c.8.6 1.2 1.4 1.2 2.3h5c0-.9.4-1.7 1.2-2.3A6.2 6.2 0 0 0 12 5z" fill="#ffd95a" stroke="#7a5600" stroke-width="1.3" stroke-linejoin="round"/>' +
	'<path d="M9.6 21h4.8M10.4 23.6h3.2" stroke="#7a5600" stroke-width="1.4" stroke-linecap="round"/>' +
	'<path d="M12 1v1.8M4.2 4.4l1.3 1.3M19.8 4.4l-1.3 1.3M1.4 11.2h1.8M20.8 11.2h1.8" stroke="#d39a00" stroke-width="1.4" stroke-linecap="round"/></svg>';

function renderAha(b) {
	const body = b.blocks.map((x) => {
		if (x.type === 'ol') return `<ol class="aha-steps">${x.items.map((t) => `<li${/^\*\*Oops\b/i.test(t) ? ' class="aha-oops"' : ''}>${inline(t)}</li>`).join('')}</ol>`;
		if (x.type === 'p' && /^\*\*[^*]+\*\*$/.test(x.text)) return `<p class="aha-close">${inline(x.text.slice(2, -2))}</p>`;
		if (x.type === 'p') return `<p class="aha-p">${inline(x.text)}</p>`;
		return renderOne(x, true);
	}).join('');
	return `<section class="aha"><div class="aha-head">${LAMP_SVG}<span class="aha-title">${inline(b.title)}</span></div>${body}</section>`;
}

/* The mail app (skills/v8.1/summary-figures Section 02C): a webmail page in the manner of Gmail, for lessons whose
   example is an inbox. Full size draws the top bar, the folders, and the list; size=mini draws the top bar and the list. */
const MAIL_LOGO = '<svg viewBox="0 0 32 24" aria-hidden="true"><rect x="1" y="2" width="30" height="20" rx="2.5" fill="#ffffff" stroke="#c5c9ce" stroke-width="1"/>' +
	'<path d="M1.6 3.6v16.8c0 .9.7 1.6 1.6 1.6h3.6V9.2z" fill="#4285f4"/><path d="M30.4 3.6v16.8c0 .9-.7 1.6-1.6 1.6h-3.6V9.2z" fill="#34a853"/>' +
	'<path d="M2.2 3.4 16 13.6 29.8 3.4" fill="none" stroke="#ea4335" stroke-width="3" stroke-linejoin="round"/></svg>';
const TRASH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 4h4M7 7l1 13h8l1-13" fill="none" stroke="#444746" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
const POINTER_SVG = '<svg class="m-pointer" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2l13 11-6 .8 3.6 7.4-3 1.4-3.5-7.5L5 19z" fill="#ffffff" stroke="#111111" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const ROW_POINTER_SVG = POINTER_SVG.replace('class="m-pointer"', 'class="m-rowpointer"');
const GLASS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="none" stroke="#444746" stroke-width="2.2"/><path d="M14.5 14.5 20 20" stroke="#444746" stroke-width="2.4" stroke-linecap="round"/></svg>';
const PEN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z" fill="none" stroke="#001d35" stroke-width="2" stroke-linejoin="round"/></svg>';

// email: From | Subject | time | flags | note; flags: checked, unread, good, bad, deleted, pointer, id:N
// In a table (```mail table```), each row shows its place on the page (Row 1, Row 2) and the id of its email.
function mailRow(spec, table = null) {
	const [from, subject = '', time = '', flags = '', note = ''] = spec.split('|').map((x) => x.trim());
	const f = new Set(flags.split(/\s+/).filter(Boolean));
	const pointer = f.has('pointer'); // a mouse pointer on the checkbox, and the note as a balloon that points at it
	const cls = ['m-row', f.has('checked') && 'sel', f.has('unread') && 'unread', f.has('good') && 'mark-good', f.has('bad') && 'mark-bad', f.has('deleted') && 'deleted', pointer && 'has-pointer'].filter(Boolean).join(' ');
	const pill = note ? (pointer ? `<span class="m-balloon">${esc(note)}</span>` : ` <span class="m-note">${esc(note)}</span>`) : '';
	const id = [...f].find((x) => /^id:/.test(x));
	if (table) {
		const place = f.has('deleted') ? '<span class="m-gone">deleted</span>' : `Row ${++table.n}`;
		return `<div class="${cls} m-trow"><span class="m-cell m-rownum">${place}</span><span class="m-cell m-boxcell"><span class="m-box${f.has('checked') ? ' on' : ''}"></span>${pointer ? ROW_POINTER_SVG : ''}</span>` +
			`<span class="m-cell m-from">${esc(from)}</span><span class="m-cell m-subj">${esc(subject)}${pill}</span>${id ? `<span class="m-id">id: ${esc(id.slice(3))}</span>` : ''}</div>`;
	}
	return `<div class="${cls}"><span class="m-box${f.has('checked') ? ' on' : ''}"></span>${pointer ? ROW_POINTER_SVG : ''}` +
		`<span class="m-from">${esc(from)}</span><span class="m-subj">${esc(subject)}${pill}</span><span class="m-time">${esc(time)}</span></div>`;
}

function mailMock(body, attrs) {
	const mini = attrs.size === 'mini';
	const table = attrs.table ? { n: 0 } : null; // the table drops the folders and numbers the rows
	const folder = attrs.folder || 'Inbox';
	const parts = [];
	let tools = '';
	for (const raw of body) {
		const line = raw.trim();
		if (!line) continue;
		let m;
		if ((m = line.match(/^toolbar:\s*(.*?)(\s*\|\s*(clicked))?$/))) tools = `<div class="m-tools"><span class="m-box"></span>${m[1] ? `<span class="m-btn${m[3] ? ' clicked' : ''}">${TRASH_SVG}${esc(m[1])}${m[3] ? POINTER_SVG : ''}</span>` : ''}</div>`;
		else if ((m = line.match(/^sent:\s*(.*)$/))) parts.push(`<div class="m-sent"><span class="m-sent-arrow">&#8594;</span>${inline(m[1])}</div>`);
		else if ((m = line.match(/^section:\s*(.*)$/))) parts.push(`<div class="m-section">${esc(m[1])}</div>`);
		else if ((m = line.match(/^email:\s*(.*)$/))) parts.push(mailRow(m[1], table));
		else if ((m = line.match(/^line:\s*(.*?)(\s*\|\s*(good|bad))?$/))) parts.push(`<div class="m-line${m[3] ? ` mark-${m[3]}` : ''}">${esc(m[1])}</div>`);
		else if ((m = line.match(/^raw:\s*(.*?)(\s*\|\s*(good|bad))?$/))) parts.push(`<div class="m-rawline"><span class="m-raw${m[3] ? ` mark-${m[3]}` : ''}">${esc(m[1])}</span></div>`);
		else if ((m = line.match(/^empty:\s*(.*)$/))) parts.push(`<div class="m-empty">${esc(m[1])}</div>`);
		else throw new Error(`mail block: unknown line "${line}"`);
	}
	const side = mini || table ? '' : `<div class="m-side"><div class="m-compose">${PEN_SVG}Compose</div>` +
		['Inbox', 'Starred', 'Sent', 'Spam'].map((f) => `<div class="m-folder${f === folder ? ' on' : ''}"><span>${f}</span>${f === folder && attrs.count ? `<b>${esc(attrs.count)}</b>` : ''}</div>`).join('') + '</div>';
	const top = `<div class="m-top">${mini ? '' : '<span class="m-burger"><i></i><i></i><i></i></span>'}<span class="m-logo">${MAIL_LOGO}</span><span class="m-name">Mail</span><span class="m-search">${GLASS_SVG}<span>Search mail</span></span></div>`;
	return `<div class="browser mailapp${mini ? ' mini' : ''}${table ? ' mtable' : ''}"><div class="bbar"><span class="dots"><i></i><i></i><i></i></span><span class="url">${esc(attrs.url || 'localhost:5173')}</span></div>` +
		`<div class="m-app">${top}<div class="m-body">${side}<div class="m-main">${tools}${parts.join('')}</div></div></div></div>`;
}

/* The banner of a story page (summary-figures Section 02D): its own kind of title, on top of the tinted page, with a
   kicker (EXAMPLE, and how many steps), the title in large type, a one-line tagline, and an envelope with a red mark. */
const STORY_ICON_SVG = '<svg class="sb-icon" viewBox="0 0 64 52" aria-hidden="true"><rect x="3" y="9" width="48" height="34" rx="5" fill="#ffffff" fill-opacity="0.16" stroke="#ffffff" stroke-width="2.6"/>' +
	'<path d="M5 12l22 17 22-17" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linejoin="round"/>' +
	'<circle cx="50" cy="12" r="10" fill="#e5484d" stroke="#ffffff" stroke-width="2.2"/><path d="M46 8l8 8M54 8l-8 8" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/></svg>';

function storyBanner(attrs) {
	if (!attrs.title) return '';
	return `<div class="story-banner"><div class="sb-text">${attrs.kicker ? `<div class="sb-kicker">${inline(attrs.kicker)}</div>` : ''}` +
		`<div class="sb-title">${inline(attrs.title)}</div>${attrs.tagline ? `<div class="sb-tagline">${inline(attrs.tagline)}</div>` : ''}</div>${STORY_ICON_SVG}</div>`;
}

/* Two lists side by side with a "not equal" sign between them (an experiment, lesson 11b): the same items in our code
   and on the page. left: and right: start each list with its title; note: adds a line under both. */
function twoLists(body) {
	const sides = { left: { title: '', items: [] }, right: { title: '', items: [] } };
	let cur = null;
	let note = '';
	for (const raw of body) {
		const line = raw.trim();
		if (!line) continue;
		let m;
		if ((m = line.match(/^(left|right):\s*(.*)$/))) { cur = sides[m[1]]; cur.title = m[2]; continue; }
		if ((m = line.match(/^note:\s*(.*)$/))) { note = m[1]; continue; }
		if (cur) cur.items.push(line);
	}
	const box = (side, cls) => `<div class="tl-box ${cls}"><div class="tl-title">${inline(side.title)}</div>${side.items.map((t) => `<div class="tl-item">${inline(t)}</div>`).join('')}</div>`;
	return `<div class="twolists"><div class="tl-row">${box(sides.left, 'tl-code')}<div class="tl-neq">&#8800;</div>${box(sides.right, 'tl-page')}</div>${note ? `<div class="tl-note">${inline(note)}</div>` : ''}</div>`;
}

/* The think-aloud layout (an experiment, lesson 11b): one band per step, the step's card on the left (its STEP label,
   what we do, and the browser) and, on the right, the user thinking out loud in a handwritten hand, with a plain note
   for what happens behind the scenes. */
function renderThinkComic(b) {
	const bands = b.panels.map((p) => {
		const left = p.blocks.filter((x) => x.type !== 'think' && x.type !== 'p');
		const right = p.blocks.filter((x) => x.type === 'think' || x.type === 'p');
		const num = String(p.attrs.step || '').padStart(2, '0');
		return `<div class="sband tone-${p.attrs.tone || 'plain'}"><div class="scard"><div class="spill">STEP ${esc(num)}</div>` +
			(p.attrs.title ? `<div class="stitle">${inline(p.attrs.title)}</div>` : '') + left.map((x) => renderOne(x, true)).join('') + '</div>' +
			`<div class="sthink">${right.map((x) => (x.type === 'p' ? `<p class="sbehind">${inline(x.text)}</p>` : renderOne(x, true))).join('')}</div></div>`;
	});
	const head = (b.attrs.title ? `<div class="story-title">${inline(b.attrs.title)}</div>` : '') + (b.attrs.caption ? `<div class="story-cap">${inline(b.attrs.caption)}</div>` : '');
	return `<figure class="fig story">${head}${bands.join('')}</figure>`;
}

/* The comic (an experiment, lesson 11b): numbered panels, two to a row, each with its STEP badge, a caption box
   that says what we do, the picture, and speech bubbles or a narration line under it. */
function renderComic(b) {
	if (b.attrs.layout === 'think') return renderThinkComic(b);
	const panels = b.panels.map((p) => {
		const tone = p.attrs.tone || 'plain';
		return `<div class="cpanel tone-${tone}"><div class="cstep">STEP ${esc(p.attrs.step || '')}</div>` +
			(p.attrs.title ? `<div class="ccap">${inline(p.attrs.title)}</div>` : '') +
			`<div class="cbody">${p.blocks.map((x) => (x.type === 'p' ? `<p class="cnarr">${inline(x.text)}</p>` : renderOne(x, true))).join('')}</div></div>`;
	});
	const rows = [];
	for (let k = 0; k < panels.length; k += 2) rows.push(`<div class="crow">${panels[k]}${panels[k + 1] || '<div class="cpanel cpanel-empty"></div>'}</div>`);
	const cap = b.attrs.caption ? `<figcaption>${inline(b.attrs.caption)}</figcaption>` : '';
	// the caption sits under the title, so it never turns the page away from the panels
	return `<figure class="fig comic">${b.attrs.title ? `<div class="comic-title">${inline(b.attrs.title)}</div>` : ''}${cap}${rows.join('')}</figure>`;
}

/* ---------------------------------------------------------------- renderer */

function renderFence(b) {
	const { lang, attrs, body } = b;
	let inner;
	if (lang === 'page') inner = pageMock(body, attrs);
	else if (lang === 'dom') inner = domPanel(body, attrs);
	else if (lang === 'ladder') return figure(ladder(body, attrs), attrs.caption, ' fig-ladder');
	else if (lang === 'chain') inner = chain(body);
	else if (lang === 'console') inner = consolePanel(body, attrs);
	else if (lang === 'devconsole') inner = devConsole(body, attrs);
	else if (lang === 'overlay') inner = overlayPanel(body, attrs);
	else if (lang === 'stages') inner = stages(body, attrs);
	else if (lang === 'tree') inner = treeBlock(body, attrs);
	else if (lang === 'hierarchy') inner = hierarchyBlock(body, attrs);
	else if (lang === 'mail') inner = mailMock(body, attrs);
	else if (lang === 'twolists') inner = twoLists(body);
	else inner = codeBlock(body, attrs);
	return attrs.caption ? figure(inner, attrs.caption) : inner;
}

function renderPrinciple(blocks) {
	let kicker = '';
	let title = '';
	let rule = '';
	const parts = { do: [], dont: [] };
	let slot = null;
	for (const b of blocks) {
		if (b.type === 'p') {
			const t = b.text.match(/^\*\*(Principle \d+[A-Z]?):\s*(.*)\*\*$/);
			if (t) { kicker = t[1]; title = t[2]; continue; }
			if (/^\*We should do this:\*$/.test(b.text)) { slot = 'do'; continue; }
			if (/^\*We should not do this:\*$/.test(b.text)) { slot = 'dont'; continue; }
			if (!slot) { rule += `<p class="p-rule">${inline(b.text)}</p>`; continue; }
		}
		if (slot) parts[slot].push(b.type === 'fence' ? codeBlock(b.body, { ...b.attrs, tone: slot }) : render([b]));
	}
	return `<section class="principle"><div class="p-kicker">${esc(kicker)}</div><div class="p-title">${inline(title)}</div>${rule}` +
		`<div class="p-pair"><div class="p-do"><div class="p-label">We should do this</div>${parts.do.join('')}</div>` +
		(parts.dont.length ? `<div class="p-dont"><div class="p-label">We should not do this</div>${parts.dont.join('')}</div>` : '') + '</div></section>';
}

function renderTable(b) {
	const cell = (c, tag, k) => {
		let cls = '';
		let text = c;
		if (k === 0 && /^[!+]/.test(c)) text = c.slice(1);
		if (k === 0 && c.startsWith('+')) cls = ' class="pill-cell"';
		const content = cls ? `<span class="pill">${inline(text)}</span>` : inline(text);
		return `<${tag}${cls}>${content}</${tag}>`;
	};
	const head = `<tr>${b.head.map((c, k) => cell(c, 'th', k)).join('')}</tr>`;
	const rows = b.rows.map((r) => `<tr${r[0].startsWith('!') ? ' class="row-bad"' : ''}>${r.map((c, k) => cell(c, 'td', k)).join('')}</tr>`).join('');
	return `<table class="data">${head}${rows}</table>`;
}

// A code line wider than its column wraps, and a wrapped line moves the dotted underline and the balloon's tail
// off their token. Two columns hold about 46 characters of code, three about 28.
const COL_CHARS = { 2: 46, 3: 28 };

function warnWideColumnCode(b) {
	const limit = COL_CHARS[b.cols.length];
	if (!limit) return;
	for (const c of b.cols) for (const blk of c.blocks) {
		if (blk.type !== 'fence' || !['jsx', 'js', 'html', ''].includes(blk.lang) || (blk.body.length < 2 && !blk.attrs.title)) continue; // a bare one-line snippet has nothing to misplace
		for (const raw of blk.body) {
			const code = raw.replace(/\s*(\{\/\*|\/\*|\/\/\s|<!--).*$/, '').replace(/~/g, '').trimEnd();
			if (code.length > limit) console.warn(`  warning: column code wider than ${limit} characters (${code.length}): ${code.trim()}`);
		}
	}
}

function renderRow(b) {
	warnWideColumnCode(b);
	const cols = b.cols.map((c) => {
		const tone = c.attrs.tone || 'none';
		const head = c.attrs.title
			? `<div class="col-head"><span class="verdict"></span><span class="col-title">${inline(c.attrs.title)}</span>${c.attrs.tag ? `<span class="col-tag">${inline(c.attrs.tag)}</span>` : ''}</div>`
			: '';
		return `<td class="col tone-${tone}">${head}<div class="col-body">${render(c.blocks, true)}</div></td>`;
	}).join(b.attrs.arrows ? '<td class="col-gap col-arrow"><span class="arrow"></span></td>' : '<td class="col-gap"></td>');
	const gapWidth = b.attrs.arrows ? '16pt' : '8pt';
	const colgroup = `<colgroup>${b.cols.map(() => '<col>').join(`<col style="width:${gapWidth}">`)}</colgroup>`;
	const inner = `<table class="row">${colgroup}<tr>${cols}</tr></table>`;
	return b.attrs.caption ? figure(inner, b.attrs.caption, ' fig-row') : `<div class="fig fig-row">${inner}</div>`;
}

function render(blocks, inCol = false) {
	const out = [];
	// an italic line right under a numbered heading is the section's key-question subtitle
	blocks = blocks.map((b, j) => (b.type === 'p' && j > 0 && blocks[j - 1].type === 'h2' && /^\d+[A-Z]?\./.test(blocks[j - 1].text) && /^\*[^*].*[^*]\*$/.test(b.text) ? { type: 'dek', text: b.text.slice(1, -1) } : b));
	for (let k = 0; k < blocks.length; k++) {
		const b = blocks[k];
		const next = blocks[k + 1];
		// a numbered section's opening (heading, map, facts, principle box) stays together on one page
		if (b.type === 'h2' && /^\d+[A-Z]?\./.test(b.text)) {
			const end = blocks.findIndex((x, j) => j > k && (x.type === 'h2' || x.type === 'principle'));
			if (end !== -1 && blocks[end].type === 'principle') {
				out.push(`<div class="sec-open">${blocks.slice(k, end + 1).map((x) => renderOne(x, inCol)).join('\n')}</div>`);
				k = end;
				continue;
			}
		}
		// a fact that introduces a principle box stays on the same page as the box
		if (b.type === 'fact' && next && next.type === 'principle') {
			out.push(`<div class="keep">${renderOne(b, inCol)}${renderOne(next, inCol)}</div>`);
			k++;
			continue;
		}
		if (b.type === 'p' && /^\*\*DO (NOT DO )?THIS:\*\*$/.test(b.text) && next && next.type === 'fence') {
			out.push(`<div class="do-pair">${renderOne(b, inCol)}${renderOne(next, inCol)}</div>`);
			k++;
			continue;
		}
		out.push(renderOne(b, inCol));
	}
	return out.join('\n');
}

function renderOne(b, inCol = false) {
	return [b].map((b) => {
		switch (b.type) {
			case 'h1': {
				const m = b.text.match(/^(Lecture \d+):\s*(.*)$/);
				return m ? `<header class="title"><div class="kicker">${esc(m[1])}</div><h1>${inline(m[2])}</h1></header>` : `<h1>${inline(b.text)}</h1>`;
			}
			case 'h2': {
				// a sub-section of a principle is numbered with a capital letter after the number, such as 1B
				const m = b.text.match(/^(\d+[A-Z]?)\.\s+(.*)$/);
				const slug = 'h-' + b.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
				return m ? `<h2 class="numbered ${slug}"><span class="num">${m[1]}</span>${inline(m[2])}</h2>` : `<h2 class="${slug}">${inline(b.text)}</h2>`;
			}
			case 'h3': return `<h3>${inline(b.text)}</h3>`;
			case 'dek': return `<p class="sec-dek">${inline(b.text)}</p>`;
			case 'interview': return `<div class="interview"><span class="iq-label">Interview question</span><span class="iq-tier">${esc(b.tier)}</span><div class="iq-text">${inline(b.question)}</div></div>`;
			case 'pagebreak': return '<div class="pagebreak"></div>';
			case 'principle': return renderPrinciple(b.blocks);
			case 'fact': return `<div class="fact"><span class="fact-label">Fact</span>${inline(b.text)}</div>`;
			case 'aha': return renderAha(b);
			case 'comic': return renderComic(b);
			case 'tintpage': return `<div class="tint-page tint-${esc(b.attrs.tint || 'blue')}">${storyBanner(b.attrs)}${render(b.blocks)}</div>`;
			case 'think': return `<div class="think">${inline(b.text)}</div>`;
			case 'quote': return `<blockquote>${render(b.blocks)}</blockquote>`;
			case 'fence': return renderFence(b);
			case 'row': return renderRow(b);
			case 'table': return renderTable(b);
			case 'ul': return `<ul>${b.items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`;
			case 'ol': return `<ol>${b.items.map((t) => `<li>${inline(t)}</li>`).join('')}</ol>`;
			case 'p': {
				if (/^\*\*DO THIS:\*\*$/.test(b.text)) return '<p class="do-head do-right">DO THIS</p>';
				if (/^\*\*DO NOT DO THIS:\*\*$/.test(b.text)) return '<p class="do-head do-wrong">DO NOT DO THIS</p>';
				if (/^\*\*[^*]+\*\*$/.test(b.text) && !inCol) return `<p class="closing">${inline(b.text.slice(2, -2))}</p>`;
				const lead = !inCol && /:\s*$/.test(b.text) ? ' class="lead"' : '';
				return `<p${inCol ? ' class="col-note"' : lead}>${inline(b.text)}</p>`;
			}
			default: throw new Error(`Unknown block ${b.type}`);
		}
	}).join('\n');
}

/* ---------------------------------------------------------------- checks */

/* The balloon checks of skills/v8.1/summary-revision-4: every balloon has its ~token~ and every token its balloon,
   tildes in pairs, a balloon in every titled block of three lines or more and in every principle card, no three
   commented lines in a row, no comment in DO THIS or DO NOT DO THIS, and widths (80 characters in the body,
   68 in a principle box) on every line that carries a balloon. Column widths are checked as the row is drawn. */
const COMMENT_RE = /(\{\/\*|\/\*|\/\/\s|<!--)/;

function checkBalloons(lines) {
	const problems = [];
	for (let i = 0; i < lines.length; i++) {
		const open = lines[i].match(/^(> )?```(\S*)(.*)$/);
		if (!open || /^(> )?```\s*$/.test(lines[i])) continue;
		const [, quote = '', lang, rest] = open;
		const body = [];
		let j = i + 1;
		while (j < lines.length && !/^(> )?```\s*$/.test(lines[j])) body.push(lines[j++].slice(quote.length));
		const start = i + 2;
		i = j;
		if (!['jsx', 'js', 'html', ''].includes(lang)) continue;
		const attrs = rest.split(/\s+/);
		const commented = body.map((l) => COMMENT_RE.test(l));
		body.forEach((l, k) => {
			const at = `line ${start + k}`;
			if ((l.match(/~/g) || []).length % 2) problems.push(`${at}: an unpaired ~`);
			if (l.includes('~') && !commented[k]) problems.push(`${at}: a ~token~ with no balloon`);
			if (commented[k] && !l.includes('~')) problems.push(`${at}: a balloon with no ~token~`);
			const width = l.split(COMMENT_RE)[0].replace(/~/g, '').trimEnd().length;
			const limit = quote ? 68 : 80;
			if (commented[k] && width > limit) problems.push(`${at}: ${width} characters of code before a balloon, over ${limit}`);
			if (commented[k] && commented[k - 1] && commented[k - 2]) problems.push(`${at}: a third commented line in a row`);
		});
		const any = commented.some(Boolean);
		if ((attrs.includes('right') || attrs.includes('wrong')) && any) problems.push(`line ${start - 1}: DO THIS or DO NOT DO THIS carries a comment`);
		if (/title=/.test(rest) && body.length >= 3 && !any) problems.push(`line ${start - 1}: a titled block of ${body.length} lines with no balloon`);
		if (quote && !any) problems.push(`line ${start - 1}: a principle card with no balloon`);
	}
	return problems;
}

function check(name, md) {
	const problems = [];
	if (md.includes('—')) problems.push('contains an em-dash');
	const lines = md.split('\n');
	if (!/^# Lecture \d+: /.test(lines[0])) problems.push('line 1 is not "# Lecture NN: Title"');
	if (!/^> INTERVIEW QUESTION \| ❱/.test(lines[1] || '')) problems.push('line 2 is not the interview question callout');
	let inFence = false;
	let prose = 0;
	for (const l of lines) {
		if (/^\s*>?\s*```/.test(l)) { inFence = !inFence; continue; }
		if (inFence || /^:::/.test(l) || /^\|/.test(l)) continue;
		prose += l.replace(/^>\s?/, '').split(/\s+/).filter(Boolean).length;
	}
	const fences = lines.filter((l) => /^```(page|mail|twolists|dom|ladder|chain|console|devconsole|overlay|stages|tree|hierarchy)/.test(l)).length;
	const rows = lines.filter((l) => /^:::\s*row/.test(l)).length;
	const sections = md.split(/^## /m).slice(1);
	for (const sec of sections) {
		const head = sec.split('\n')[0];
		if (!/^\d+[A-Z]?\./.test(head)) continue;
		if (!/```hierarchy/.test(sec)) problems.push(`section "${head}" has no hierarchy panel`);
		if (!/```tree/.test(sec)) problems.push(`section "${head}" has no tree`);
		if (!/\[!PRINCIPLE\]/.test(sec)) problems.push(`section "${head}" has no principle box`);
	}
	problems.push(...checkBalloons(lines));
	console.log(`  ${name}: ${prose} prose words, ${fences + rows} figures`);
	for (const p of problems) console.log(`  [CHECK FAILED] ${name}: ${p}`);
	return problems.length === 0;
}

/* ---------------------------------------------------------------- build */

function page(docTitle, body, theme) {
	const css = BASE_CSS + '\n/* ---------- theme: ' + theme + ' */\n' + readFileSync(join(STYLE_DIR, 'themes', `${theme}.css`), 'utf8');
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(docTitle)}</title>
<style>
${css}
</style>
</head>
<body class="theme-${theme}">
<div class="running">${esc(docTitle)}</div>
<main class="lecture">
${body}
</main>
</body>
</html>
`;
}

function build(nn) {
	const srcDir = join(SRC_BASE, version);
	const md = readFileSync(join(srcDir, `${nn}.md`), 'utf8');
	const ok = check(`${nn}.md`, md);
	const blocks = parseBlocks(md.split('\n'))[0];
	const titleBlock = blocks.find((b) => b.type === 'h1');
	const docTitle = titleBlock ? titleBlock.text : `Lecture ${nn}`;
	figureCount.lecture = String(parseInt(nn, 10));
	figureCount.n = 0;
	const body = render(blocks);
	const htmlDir = join(HTML_BASE, version);
	const pdfDir = join(PDF_BASE, version);
	mkdirSync(htmlDir, { recursive: true });
	const pub = join(SRC_BASE, version, 'public');
	if (existsSync(pub)) cpSync(pub, join(htmlDir, 'public'), { recursive: true });
	if (withPdf) mkdirSync(pdfDir, { recursive: true });
	// NN.html and NN.pdf in the default theme; NN-<theme>.html and NN-<theme>.pdf for every other theme
	const themes = onlyTheme ? [onlyTheme] : THEMES;
	const outputs = themes.map((theme) => [theme, theme === DEFAULT_THEME ? nn : `${nn}-${theme}`]);
	for (const [theme, name] of outputs) {
		const htmlPath = join(htmlDir, `${name}.html`);
		writeFileSync(htmlPath, page(docTitle, body, theme));
		if (withPdf) {
			const pdfPath = join(pdfDir, `${name}.pdf`);
			execFileSync('prince', [htmlPath, '-o', pdfPath], { stdio: ['ignore', 'inherit', 'inherit'] });
		}
		console.log(`  ${name}: ${theme}${withPdf ? ', html and pdf' : ', html'}`);
	}
	return ok;
}

const all = readdirSync(join(SRC_BASE, version)).filter((f) => /^\d+([a-z]|-[a-z0-9_-]+)?\.md$/.test(f)).map((f) => f.slice(0, -3)).sort();
const targets = wanted.length ? wanted : all;
console.log(`Revision 4 (${version}): lectures ${targets.join(', ')}; themes ${onlyTheme || THEMES.join(', ')}; default ${DEFAULT_THEME}`);
let failed = 0;
for (const nn of targets) if (!build(nn)) failed++;
if (failed) {
	console.log(`[GATE FAILED] ${failed} lecture(s) failed the checks`);
	process.exit(1);
}
