// Shared by the app (browser DOM) and the scripts (linkedom), so both number the blocks the same way.

const KINDS = [
  ['header.book-opener', 'title'],
  ['.interview-banner', 'question'],
  ['h2', 'h2'],
  ['h3', 'h3'],
  ['h4', 'h4'],
  ['p', 'p'],
  ['.ed', 'code'],
  ['.fig-wrap, .box-figure', 'fig'],
  ['ul, ol', 'list'],
  ['table', 'table'],
];

export function words(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

export const fingerprint = (text) => words(text).slice(0, 8).join(' ');

const INLINE = new Set(['SPAN', 'CODE', 'STRONG', 'EM', 'B', 'I', 'A', 'KBD', 'SUB', 'SUP', 'MARK', 'SMALL', 'BR']);

// textContent glues neighbouring rows and labels together ("index.html1<button"); a space at every
// non-inline boundary, and around code line numbers and tab names, keeps the words apart.
function readableText(node) {
  if (node.nodeType === 3) return node.data;
  if (node.nodeType !== 1) return '';
  const inner = Array.from(node.childNodes).map(readableText).join('');
  const separate = !INLINE.has(node.tagName.toUpperCase()) || ['num', 'tab', 'section-kicker', 'h2-title'].some((c) => node.classList.contains(c));
  return separate ? ` ${inner} ` : inner;
}

/** Every element child of the chapter's .container is one block, numbered per kind in reading order. */
export function chapterBlocks(container) {
  const counts = {};
  const blocks = [];
  for (const el of Array.from(container.children)) {
    const kind = (KINDS.find(([selector]) => el.matches(selector)) || [null, 'box'])[1];
    counts[kind] = (counts[kind] || 0) + 1;
    const text = readableText(el).replace(/\s+/g, ' ').trim();
    blocks.push({ id: `${kind}-${String(counts[kind]).padStart(3, '0')}`, el, text, src: fingerprint(text) });
  }
  return blocks;
}
