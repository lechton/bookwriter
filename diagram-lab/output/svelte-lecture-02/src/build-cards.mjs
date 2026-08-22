#!/usr/bin/env node
/* ============================================================
   build-cards.mjs — flashcard pipeline: md-cards -> html -> pdf
   ------------------------------------------------------------
   Reads md-cards/*.md, writes md-cards-html/*.html plus a
   combined md-cards-html/deck.html, then renders each to
   md-cards-pdf/ via Prince.

   Usage (run from this project folder):
     node src/build-cards.mjs            # build html + pdf
     node src/build-cards.mjs --no-pdf   # build html only

   Markdown subset (authoring contract, see instructions.md):
     ## Q3 — Question title            question header
     # Title                           plain h1
     @tags a, b, c                     topic chips
     **Label.** text                   labelled line (Answer, Why it works, Source)
     > **The move.** text              takeaway callout
     ```lang title="File.svelte"       code block with filename tab
     - item                            bullet list
     <div class="dg"> … </div>         raw HTML diagram (NO blank lines inside)
     everything else                   paragraphs (one line each, never hard-wrapped)
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const withPdf = !args.includes('--no-pdf');

const dirs = { mdCards: join(ROOT, 'md-cards'), html: join(ROOT, 'md-cards-html'), pdf: join(ROOT, 'md-cards-pdf'), diagrams: join(ROOT, 'diagrams') };

/* ---------------- markdown subset ---------------- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
	const parts = s.split(/`([^`]+)`/);
	let out = '';
	for (let i = 0; i < parts.length; i++) {
		out += i % 2 === 1
			? `<code>${parts[i]}</code>`
			: parts[i]
				.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
				.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	}
	return out;
}

function parseBlocks(md) {
	const lines = md.split('\n');
	const out = [];
	let i = 0;
	const starters = (l) => l.startsWith('```') || l.startsWith('#') || l.startsWith('- ') || l.startsWith('> ') || l.startsWith('@tags') || l.trimStart().startsWith('<');
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) { i++; continue; }

		const fence = line.match(/^```(\w+)?\s*(?:title="([^"]*)")?\s*$/);
		if (fence) {
			const buf = [];
			i++;
			while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
			i++;
			out.push({ t: 'code', title: fence[2] || '', code: buf.join('\n') });
			continue;
		}
		if (line.trimStart().startsWith('<')) {
			const buf = [];
			while (i < lines.length && lines[i].trim()) { buf.push(lines[i]); i++; }
			out.push({ t: 'html', html: buf.join('\n') });
			continue;
		}
		if (line.startsWith('## ')) { out.push({ t: 'q', text: line.slice(3) }); i++; continue; }
		if (line.startsWith('# ')) { out.push({ t: 'h1', text: line.slice(2) }); i++; continue; }
		if (line.startsWith('@tags ')) { out.push({ t: 'tags', text: line.slice(6) }); i++; continue; }
		if (line.startsWith('> ')) {
			const buf = [];
			while (i < lines.length && lines[i].startsWith('> ')) { buf.push(lines[i].slice(2)); i++; }
			out.push({ t: 'move', text: buf.join(' ') });
			continue;
		}
		if (line.startsWith('- ')) {
			const items = [];
			while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++; }
			out.push({ t: 'ul', items });
			continue;
		}
		const buf = [];
		while (i < lines.length && lines[i].trim() && !starters(lines[i])) { buf.push(lines[i]); i++; }
		out.push({ t: 'p', text: buf.join(' ') });
	}
	return out;
}

function render(blocks) {
	return blocks.map((b) => {
		switch (b.t) {
			case 'q': {
				const m = b.text.match(/^(Q\d+)\s+—\s+(.*)$/);
				if (m) return `<div class="q"><span class="qn">${m[1]}</span><h2>${inline(esc(m[2]))}</h2></div>`;
				return `<h2>${inline(esc(b.text))}</h2>`;
			}
			case 'h1': return `<h1>${inline(esc(b.text))}</h1>`;
			case 'tags': return `<p class="tags">${b.text.split(',').map((s) => `<span>${esc(s.trim())}</span>`).join('')}</p>`;
			case 'code': return `<figure class="cb">${b.title ? `<figcaption>${esc(b.title)}</figcaption>` : ''}<pre><code>${esc(b.code)}</code></pre></figure>`;
			case 'html': return b.html;
			case 'move': return `<blockquote class="move"><p>${inline(esc(b.text))}</p></blockquote>`;
			case 'ul': return `<ul>${b.items.map((x) => `<li>${inline(esc(x))}</li>`).join('')}</ul>`;
			case 'p': {
				const lbl = b.text.match(/^\*\*([A-Z][A-Za-z ]{1,26})\.\*\*\s*(.*)$/s);
				if (lbl) {
					const slug = lbl[1].toLowerCase().replace(/\s+/g, '-');
					return `<p class="lbl lbl-${slug}"><strong>${esc(lbl[1])}.</strong> ${inline(esc(lbl[2]))}</p>`;
				}
				return `<p>${inline(esc(b.text))}</p>`;
			}
			default: return '';
		}
	}).join('\n');
}

/* ---------------- page template ---------------- */

const page = (title, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="stylesheet" href="../../../assets/styles/base.css">
<link rel="stylesheet" href="../../../assets/styles/cards.css">
<link rel="stylesheet" href="../../../assets/styles/diagrams.css">
<link rel="stylesheet" href="../../../assets/styles/metaphors.css">
</head>
<body>
${body}
</body>
</html>
`;

const DECK_HEAD = `<header class="deck-head">
<h1>Svelte <span class="accent">Review Cards</span></h1>
<p>Svelte 5 review cards. Read the question, cover the answer, answer aloud, then check the code and the figure.</p>
</header>`;

/* ---------------- build ---------------- */

mkdirSync(dirs.html, { recursive: true });
mkdirSync(dirs.pdf, { recursive: true });

const files = readdirSync(dirs.mdCards).filter((f) => f.endsWith('.md') && !f.endsWith('.thinking.md')).sort();
if (!files.length) { console.error('no markdown files in md-cards/'); process.exit(0); }

const cards = [];
for (const f of files) {
	const name = basename(f, '.md');
	const md = readFileSync(join(dirs.mdCards, f), 'utf8');
	const diagramPath = join(dirs.diagrams, `${name}.html`);
	let diagramHtml = '';
	try { diagramHtml = readFileSync(diagramPath, 'utf8'); } catch (e) {}
	const body = `<section class="card">\n${render(parseBlocks(md))}\n${diagramHtml}\n</section>`;
	cards.push(body);

	const title = (md.match(/^##\s+(.*)$/m) || [, name])[1];
	writeFileSync(join(dirs.html, `${name}.html`), page(title, body));
	console.log(`html  ${name}.html`);
}

writeFileSync(join(dirs.html, 'deck.html'), page('Svelte Review Cards', `${DECK_HEAD}\n${cards.join('\n')}`));
console.log('html  deck.html');

if (withPdf) {
	const targets = [...files.map((f) => basename(f, '.md')), 'deck'];
	for (const name of targets) {
		execFileSync('prince', [join(dirs.html, `${name}.html`), '-o', join(dirs.pdf, `${name}.pdf`)], { stdio: ['ignore', 'ignore', 'inherit'] });
		console.log(`pdf   ${name}.pdf`);
	}
}
console.log('done.');
