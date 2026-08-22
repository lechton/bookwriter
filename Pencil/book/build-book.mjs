// build-book.mjs — assemble one chapter (or the whole book) into a single
// print-ready HTML, then `prince <html> -o <pdf>`.
//
// Per section, in order: the FIGURE (the card's sheet, with its Explanation
// block dropped) -> the GEMINI infographic -> the LECTURE prose. The chapter
// opens with the intro lecture and closes with the outro.
//
// Usage:
//   node book/build-book.mjs 04_extra_javascript_1     # one chapter
//   node book/build-book.mjs all                        # every chapter -> book.html
//
// Inputs (per chapter, under build 05/<chapter>/):
//   chapter.md            the title + arc
//   md/NN-slug.md         the script sections (figures are built from the cards)
//   md-lecture/NN.md      the lecture parts (00-intro, NN-slug, 99-outro)
//   png-gemini/NN.png     the gemini infographics
//   cards 05/<chapter>/NN-slug/card.html   the figure HTML

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PENCIL = join(__dirname, '..');                 // Pencil/
const BUILD = join(PENCIL, 'build 05');
const CARDS = join(PENCIL, 'cards 05');
const STYLES = join(PENCIL, 'styles');
const FONTS = join(PENCIL, 'fonts');

// --- inlined, self-contained assets (fonts as base64 so Prince needs no externals) ---
const fontCss = readFileSync(join(FONTS, 'fonts.css'), 'utf8').replace(
  /url\(["']?([^"')]+)["']?\)/g,
  (_, f) => `url("data:font/woff2;base64,${readFileSync(join(FONTS, f)).toString('base64')}")`,
);
const figureCss = readFileSync(join(STYLES, 'figure-03.css'), 'utf8');
const bookCss = readFileSync(join(__dirname, 'book.css'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function chapterTitle(chDir, chapter) {
  const md = readFileSync(join(chDir, 'chapter.md'), 'utf8');
  return (md.match(/^#\s+(.+)$/m)?.[1] || chapter).replace(/^Chapter:\s*/, '');
}

function lectureHtml(file, extraClass = '') {
  if (!existsSync(file)) return `<div class="lecture placeholder ${extraClass}">lecture pending: ${file.split('/').pop()}</div>`;
  const raw = readFileSync(file, 'utf8').trim();
  const lines = raw.split('\n');
  let title = '', body = raw;
  if (lines[0].startsWith('# ')) {
    title = lines[0].replace(/^#\s+/, '').replace(/\s*\([^)]*\)\s*$/, ''); // drop the (concordance)
    body = lines.slice(1).join('\n').trim();
  }
  const paras = body.split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p.trim())}</p>`).join('\n');
  return `<div class="lecture ${extraClass}">${title ? `<h2 class="lec-title">${esc(title)}</h2>` : ''}${paras}</div>`;
}

// group each code block — its subtitle (.snip-h), editor, and line-by-line notes
// (.lbl) — into one .codeblock wrapper, so the book can keep it whole on a page.
// .connector and .summary end the current block; the title + explorer lead it.
function wrapBlocks(content) {
  const parts = content.split(/(?=<div class="(?:snip-h|connector|summary)")/);
  let out = parts[0];                  // title + explorer, before the first subtitle
  let open = false;
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith('<div class="snip-h"')) {
      if (open) out += '</div>';
      out += '<div class="codeblock">' + p;
      open = true;
    } else {                           // connector or summary closes the block
      if (open) { out += '</div>'; open = false; }
      out += p;
    }
  }
  if (open) out += '</div>';
  return out;
}

function figureHtml(cardsDir, slug) {
  const card = join(cardsDir, slug, 'card.html');
  if (!existsSync(card)) return `<div class="placeholder">figure missing: ${slug}</div>`;
  const html = readFileSync(card, 'utf8');
  const SHEET = '<div class="sheet">';
  const inner = html.slice(html.indexOf(SHEET) + SHEET.length);
  const cut = inner.indexOf('<hr class="divider" />');     // everything before = title..summary; after = Explanation
  const content = (cut >= 0 ? inner.slice(0, cut) : inner).trim();
  return `<div class="sheet figure">${wrapBlocks(content)}</div>`;
}

function geminiHtml(chDir, num) {
  const pic = join(chDir, 'png-gemini', `${num}.png`);
  if (!existsSync(pic)) return '';
  return `<figure class="gemini"><img src="${pathToFileURL(pic).href}" alt="infographic ${num}" /></figure>`;
}

function chapterBody(chapter) {
  const chDir = join(BUILD, chapter);
  const cardsDir = join(CARDS, chapter);
  const sections = readdirSync(join(chDir, 'md'))
    .filter((f) => /^\d\d-.+\.md$/.test(f) && !f.startsWith('00'))
    .sort();

  let body = `<div class="chapter"><h1 class="chapter-title">${esc(chapterTitle(chDir, chapter))}</h1>\n`;
  body += lectureHtml(join(chDir, 'md-lecture', '00-intro.md'), 'intro');
  for (const f of sections) {
    const slug = f.replace(/\.md$/, '');     // 01-prototype
    const num = slug.slice(0, 2);            // 01
    body += `\n<section class="sec">\n${lectureHtml(join(chDir, 'md-lecture', f))}\n${figureHtml(cardsDir, slug)}\n${geminiHtml(chDir, num)}\n</section>\n`;
  }
  body += lectureHtml(join(chDir, 'md-lecture', '99-outro.md'), 'outro');
  body += `</div>`;
  return body;
}

function page(bodyHtml) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<style>
${fontCss}
${figureCss}
${bookCss}
</style></head>
<body>
${bodyHtml}
</body></html>`;
}

// --- run ---
const arg = process.argv[2] || '04_extra_javascript_1';
const outDir = join(__dirname, 'out');
mkdirSync(outDir, { recursive: true });

if (arg === 'all') {
  const chapters = readdirSync(BUILD).filter((d) => existsSync(join(BUILD, d, 'chapter.md'))).sort();
  const html = page(chapters.map(chapterBody).join('\n'));
  writeFileSync(join(outDir, 'book.html'), html);
  console.log(`book HTML -> book/out/book.html  (${chapters.length} chapters: ${chapters.join(', ')})`);
} else {
  writeFileSync(join(outDir, `${arg}.html`), page(chapterBody(arg)));
  console.log(`chapter HTML -> book/out/${arg}.html`);
}
