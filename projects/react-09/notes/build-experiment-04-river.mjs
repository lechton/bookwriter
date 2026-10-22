#!/usr/bin/env node
/* ============================================================
   build-experiment-04-river.mjs
   Compiles notes/experiment-04-river.md -> notes/experiment-04-river.html
   in ~20ms so the HTML is NEVER hand-crafted or synced manually.
   Usage:
     node notes/build-experiment-04-river.mjs
   ============================================================ */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { editorBlock } from '../src/revised-4/editor.mjs';

const DIR = dirname(fileURLToPath(import.meta.url));
const MD_PATH = join(DIR, 'experiment-04-river.md');
const HTML_PATH = join(DIR, 'experiment-04-river.html');

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function inline(s) {
  const codes = [];
  let out = String(s).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${esc(c)}</code>`);
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

/* ---------------------------------------------------------------- SVG Icons & Label/Note Helpers */

const IMPORTANT_SVG = `<svg class="ico-important" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4zm.75 7.25a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>`;

const GOOD_KEY_SVG = `<svg class="ico-key-good" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.28 5.28-3.75 3.75a.75.75 0 0 1-1.06 0L4.72 8.28a.75.75 0 1 1 1.06-1.06L7 8.44l3.22-3.22a.75.75 0 1 1 1.06 1.06z"/></svg>`;

const BAD_KEY_SVG = `<svg class="ico-key-bad" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM5.22 5.22a.75.75 0 0 1 1.06 0L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 1 1-1.06 1.06L8 9.06l-1.72 1.72a.75.75 0 0 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 0-1.06z"/></svg>`;

const POINT_SVG = `<svg class="ico-point" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06z"/></svg>`;

/**
 * Renders a box title/label without confusing outer parentheses around examples.
 * Supports explicit `[...]` example groups or trailing `(...)` groups by turning
 * them into a visual `.t-chips` badge container with zero `(` or `)` characters.
 */
function renderLabelWithChips(rawLabel) {
  let text = String(rawLabel).trim();
  const chips = [];

  // 1. Extract explicit [...] groups used for code/example badges
  text = text.replace(/\[([^\]]+)\]/g, (_, inner) => {
    chips.push(inner.trim());
    return '';
  });

  // 2. Also convert any outer (...) group that wraps backtick code or examples
  text = text.replace(/\(([^()]*`[^`]+`[^()]*)\)/g, (_, inner) => {
    chips.push(inner.trim());
    return '';
  });

  text = text.replace(/\s+/g, ' ').trim();
  const chipsHtml = chips.length
    ? `<div class="t-chips">${chips.map((c) => `<span class="t-chip-group">${inline(c)}</span>`).join('')}</div>`
    : '';
  return `<span class="t-title-text">${inline(text)}</span>${chipsHtml}`;
}

function renderNotesList(notes, nodeMark = '') {
  if (!notes || !notes.length) return '';
  const items = notes
    .map((raw) => {
      const s = raw.trim();
      if (!s) return '';
      if (s.startsWith('!') || s.startsWith('+') || s.startsWith('~')) {
        const prefix = s[0];
        const body = s.slice(1).trim();
        let tone = 'info';
        let icon = IMPORTANT_SVG;
        if (prefix === '~' || /^Do\s+(?:\*\*NOT\*\*|NOT\b)/i.test(body)) {
          tone = 'bad';
          icon = BAD_KEY_SVG;
        } else if (prefix === '+' || /^(?:\*\*DO\*\*|DO\b)(?!\s*(?:\*\*NOT\*\*|NOT\b))/i.test(body)) {
          tone = 'good';
          icon = GOOD_KEY_SVG;
        } else if (nodeMark === '!') {
          tone = 'bad';
          icon = BAD_KEY_SVG;
        }
        return `<div class="t-key t-key-${tone}"><span class="t-key-ico">${icon}</span><span class="t-key-text">${inline(
          body
        )}</span></div>`;
      }
      return `<div class="t-point"><span class="t-point-ico">${POINT_SVG}</span><span class="t-point-text">${inline(
        s
      )}</span></div>`;
    })
    .join('');
  return `<div class="t-notes">${items}</div>`;
}

/* ---------------------------------------------------------------- Box-to-Boxes Tree Renderer */

function splitNode(text) {
  let mark = '';
  if (/^[+!]/.test(text)) {
    mark = text[0];
    text = text.slice(1);
  }
  const [label, ...rest] = text.split('|').map((t) => t.trim());
  const notes = [];
  for (const part of rest) {
    for (const sub of part.split(/\s*·\s*/)) {
      if (sub.trim()) notes.push(sub.trim());
    }
  }
  return { label, notes, mark };
}

function parseOutline(lines) {
  const rows = lines
    .filter((l) => l.trim())
    .map((l) => {
      const depth = Math.floor(l.match(/^ */)[0].length / 2);
      const text = l.trim().replace(/^- /, '');
      return { depth, text };
    });
  const root = { ...splitNode(rows[0].text), children: [], depth: -1, isRoot: true };
  const stack = [root];
  for (const r of rows.slice(1)) {
    const node = { ...splitNode(r.text), children: [], depth: r.depth };
    while (stack.length > 1 && stack[stack.length - 1].depth >= r.depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root;
}

function leaves(node) {
  return node.children.length ? node.children.reduce((n, c) => n + leaves(c), 0) : 1;
}

function nodeBox(node) {
  const mark =
    node.mark === '+'
      ? '<span class="t-mark t-mk-right"></span>'
      : node.mark === '!'
        ? '<span class="t-mark t-mk-wrong"></span>'
        : '';
  const notesHtml = renderNotesList(node.notes, node.mark);
  const rootCls = node.isRoot ? ' t-root-node' : '';
  const toneCls = node.mark === '+' ? ' t-good' : node.mark === '!' ? ' t-bad' : '';
  return `<div class="t-node${rootCls}${toneCls}"><div class="t-label">${mark}${renderLabelWithChips(
    node.label
  )}</div>${notesHtml}</div>`;
}

function treeDown(root) {
  const total = leaves(root);
  const levels = [];
  (function place(node, level, offset) {
    node.offset = offset;
    node.span = leaves(node);
    (levels[level] = levels[level] || []).push(node);
    let at = offset;
    for (const c of node.children) {
      place(c, level + 1, at);
      at += leaves(c);
    }
  })(root, 0, 0);
  const pct = (units) => `${((units / total) * 100).toFixed(4)}%`;
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
  levels.forEach((nodes) => {
    html += row(
      't-boxes',
      nodes.map((n) => ({ at: n.offset, span: n.span, cls: 't-cell', html: nodeBox(n) }))
    );
    const parents = nodes.filter((n) => n.children.length);
    if (!parents.length) return;
    html += row(
      't-stems',
      parents.map((n) => ({ at: n.offset, span: n.span, cls: 't-cell', html: '<div class="t-stem"></div>' }))
    );
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

function treeRight(node) {
  const n = node.children.length;
  const rows = node.children
    .map((c, i) => {
      const pos = n === 1 ? 'only' : i === 0 ? 'first' : i === n - 1 ? 'last' : 'mid';
      const rootCells =
        i === 0
          ? `<td rowspan="${n}" class="r-root">${nodeBox(node)}</td><td rowspan="${n}" class="r-stem"></td>`
          : '';
      const result =
        c.notes && c.notes.length
          ? `<td class="r-arrow"><span class="arrow"></span></td><td class="r-result ${
              c.mark === '+' ? 'r-good' : c.mark === '!' ? 'r-bad' : ''
            }">${renderNotesList(c.notes, c.mark)}</td>`
          : '<td></td><td></td>';
      const branch = { ...c, notes: [] };
      return `<tr>${rootCells}<td class="r-joint r-${pos}"></td><td class="r-branch">${nodeBox(branch)}</td>${result}</tr>`;
    })
    .join('');
  return `<table class="t-right">${rows}</table>`;
}

let figCounter = 0;

function renderTree(body, attrs) {
  const root = parseOutline(body);
  const inner = attrs.dir === 'right' ? treeRight(root) : treeDown(root);
  figCounter++;
  const cap = attrs.caption
    ? `<div class="box-caption">Figure ${figCounter} — ${inline(attrs.caption)}</div>`
    : '';
  return `<div class="box-figure"><div class="tree">${inner}</div>${cap}</div>`;
}

/* ---------------------------------------------------------------- Code Highlighting (Normal Lesson Editor) */

function renderCodeBlock(lang, attrs, body) {
  const edAttrs = { ...attrs };
  if (!edAttrs.title && lang) {
    edAttrs.title = lang === 'jsx' ? 'App.jsx' : lang === 'js' ? 'script.js' : lang.toUpperCase();
  }
  return editorBlock(body, edAttrs);
}

/* ---------------------------------------------------------------- Block Parser & Renderer */

function parseAndRender(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  const out = [];

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (/^---\s*$/.test(line.trim())) {
      i++;
      continue;
    }

    let m;
    // H1
    if ((m = line.match(/^#\s+(.*)$/))) {
      const text = m[1].replace(/^Lecture \d+:\s*/, '');
      out.push(`<div class="chapter-meta">Lecture 04 · React 19 Foundations</div>`);
      out.push(`<h1>${inline(text)}</h1>`);
      i++;
      continue;
    }

    // H2
    if ((m = line.match(/^##\s+(.*)$/))) {
      const raw = m[1];
      const pm = raw.match(/^(\d+)\.\s+(Principle \d+):\s*(.*)$/);
      if (pm) {
        out.push(`<h2><span class="section-kicker">Section ${pm[1]} · ${pm[2]}</span>${inline(pm[3])}</h2>`);
      } else {
        out.push(`<h2>${inline(raw)}</h2>`);
      }
      i++;
      continue;
    }

    // H3
    if ((m = line.match(/^###\s+(.*)$/))) {
      out.push(`<h3 class="leading-q">${inline(m[1])}</h3>`);
      i++;
      continue;
    }

    // Fenced blocks
    if ((m = line.match(/^```(\S*)\s*(.*)$/))) {
      const lang = m[1];
      const attrs = parseAttrs(m[2]);
      const body = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i++]);
      }
      i++;
      if (lang === 'tree') {
        out.push(renderTree(body, attrs));
      } else {
        out.push(renderCodeBlock(lang, attrs, body));
      }
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      const inner = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        inner.push(lines[i++].replace(/^> ?/, ''));
      }
      if (/^INTERVIEW QUESTION\s*\|/.test(inner[0])) {
        const [, tier, ...q] = inner[0].split('|').map((s) => s.trim());
        out.push(
          `<div class="interview-banner"><div class="interview-banner-label">Interview Question · ${esc(
            tier
          )}</div><p class="interview-banner-q">${inline(q.join(' | '))}</p></div>`
        );
      } else if (/^\[!WAYS\]/.test(inner[0])) {
        const cards = [];
        for (const l of inner.slice(1)) {
          if (!l.trim()) continue;
          const wm = l.match(/^\(\d+\)\s*(.*)$/);
          if (wm) {
            const parts = wm[1].split('|').map((s) => s.trim());
            const rawHead = parts[0].replace(/^\*\*([^*]+)\*\*/, '$1');
            const isComp = /React component/i.test(rawHead);
            const notes = parts.slice(1);
            cards.push(
              `<div class="way-card${isComp ? ' active' : ''}"><div class="way-title">${renderLabelWithChips(
                rawHead
              )}</div>${renderNotesList(notes)}</div>`
            );
          }
        }
        out.push(`<div class="ways-grid">${cards.join('')}</div>`);
      } else if (/^\[!PRINCIPLE\]/.test(inner[0])) {
        out.push(renderPrincipleBox(inner.slice(1)));
      } else if (/^\[!PRINCIPLES\]/.test(inner[0])) {
        const paras = inner
          .slice(1)
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => `<p>${inline(l)}</p>`)
          .join('');
        out.push(`<div class="moral-box"><div class="moral-box-title">PRINCIPLES</div>${paras}</div>`);
      } else if (/^\[!WILD\]/.test(inner[0])) {
        const paras = inner
          .slice(1)
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => `<p>${inline(l)}</p>`)
          .join('');
        out.push(`<div class="moral-box"><div class="moral-box-title">IN THE WILD</div>${paras}</div>`);
      } else {
        out.push(`<div class="interview-banner"><p class="interview-banner-q">${inline(inner.join(' '))}</p></div>`);
      }
      continue;
    }

    // Tables
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i++]);
      }
      const cells = (r) =>
        r
          .replace(/^\|/, '')
          .replace(/\|\s*$/, '')
          .split('|')
          .map((c) => c.trim());
      const head = cells(rows[0]);
      const bodyRows = rows.slice(2).map(cells);
      const ths = head.map((h) => `<th>${inline(h)}</th>`).join('');
      const trs = bodyRows
        .map((r) => {
          const tds = r
            .map((c, idx) => {
              if (idx === 0 && /^\*\*Principle \d+\*\*$/.test(c)) {
                return `<td><span class="p-badge">${inline(c.replace(/\*\*/g, ''))}</span></td>`;
              }
              return `<td>${inline(c)}</td>`;
            })
            .join('');
          return `<tr>${tds}</tr>`;
        })
        .join('');
      out.push(`<table class="roadmap-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`);
      continue;
    }

    // PRINCIPLES / Moral box
    if (line.startsWith('**PRINCIPLES:**') || line.startsWith('**The Moral of the Story:**')) {
      const lead = line.replace(/^\*\*(?:PRINCIPLES|The Moral of the Story):\*\*\s*/, '');
      i++;
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\d+\.\s+/, ''));
      }
      const lis = items.map((it) => `<li>${inline(it)}</li>`).join('');
      out.push(
        `<div class="moral-box"><div class="moral-box-title">PRINCIPLES</div><p>${inline(
          lead
        )}</p><ol>${lis}</ol></div>`
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && (/^\d+\.\s+/.test(lines[i]) || /^   \S/.test(lines[i]))) {
        if (/^\d+\.\s+/.test(lines[i])) {
          items.push(lines[i++].replace(/^\d+\.\s+/, ''));
        } else {
          items[items.length - 1] += '<br/>' + lines[i++].trim();
        }
      }
      out.push(`<ol>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</ol>`);
      continue;
    }

    // Unordered list
    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^-\s+/, ''));
      }
      out.push(`<ul>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</ul>`);
      continue;
    }

    // Paragraph
    out.push(`<p>${inline(line)}</p>`);
    i++;
  }

  return out.join('\n\n');
}

function renderPrincipleBox(lines) {
  let num = 'Principle';
  let title = '';
  let rule = '';
  let why = '';
  const doLines = [];
  const dontLines = [];
  let mode = 'head';

  let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim();
    if (!l) {
      i++;
      continue;
    }
    let m;
    if ((m = l.match(/^\*\*(Principle \d+):\s*(.*)\*\*$/))) {
      num = m[1];
      title = m[2];
      i++;
      continue;
    }
    if (l === '**DO THIS:**') {
      mode = 'do';
      i++;
      continue;
    }
    if (l === '**DO NOT DO THIS:**') {
      mode = 'dont';
      i++;
      continue;
    }
    if (l.startsWith('```')) {
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        if (mode === 'do') doLines.push(lines[i]);
        else if (mode === 'dont') dontLines.push(lines[i]);
        i++;
      }
      i++;
      continue;
    }
    if (/^\*[^*]+\*$/.test(l) && !rule) {
      rule = l.slice(1, -1);
      i++;
      continue;
    }
    why += (why ? ' ' : '') + l;
    i++;
  }

  const doEditor = editorBlock(doLines, { tone: 'do' });
  const dontEditor = editorBlock(dontLines, { tone: 'dont' });

  return `<div class="principle-card">
  <div class="principle-header">
    <span class="principle-num">${esc(num)}</span>
    <h4 class="principle-title">${inline(title)}</h4>
  </div>
  <div class="principle-body">
    <p class="principle-rule">${inline(rule)}</p>
    <p class="principle-why">${inline(why)}</p>
    <div class="p-pair">
      <div class="p-do">
        <div class="p-label">\u2713 DO THIS</div>
        ${doEditor}
      </div>
      <div class="p-dont">
        <div class="p-label">\u2717 DO NOT DO THIS</div>
        ${dontEditor}
      </div>
    </div>
  </div>
</div>`;
}

/* ---------------------------------------------------------------- Stylesheet */

const STYLE_BLOCK = `<style>
    :root {
      --bg: #ffffff;
      --surface: #ffffff;
      --surface-muted: #f4f4f5;
      --ink: #000000;
      --ink-secondary: #000000;
      --ink-muted: #27272a;
      --border: #e4e2dd;
      --border-strong: #d1cec7;
      --accent: #0f4c81;
      --accent-soft: #eef4fa;
      --accent-border: #bfd6ec;
      --moral-bg: #fefce8;
      --moral-border: #fde047;
      --moral-ink: #713f12;
      --good-bg: #f0fdf4;
      --good-border: #86efac;
      --good-ink: #14532d;
      --bad-bg: #fef2f2;
      --bad-border: #fca5a5;
      --bad-ink: #7f1d1d;
      --code-bg: #ffffff;
      --code-bar: #f0f0f0;
      --code-zebra: #f4f4f4;
      --code-frame: #9ca3af;
      --code-num: #9ca3af;
      --font-sans: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
      --font-serif: "Newsreader", "Charter", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
      --font-mono: "IBM Plex Mono", "JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 56px 24px 96px;
      background-color: var(--bg);
      color: var(--ink);
      font-family: var(--font-sans);
      font-size: 17px;
      line-height: 1.74;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 780px;
      margin: 0 auto;
    }

    /* Header & Meta */
    .chapter-meta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent);
      background: var(--accent-soft);
      border: 1px solid var(--accent-border);
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 16px;
    }

    h1 {
      font-size: 36px;
      line-height: 1.18;
      letter-spacing: -0.025em;
      margin: 0 0 20px;
      color: var(--ink);
      font-weight: 800;
    }

    .interview-banner {
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-left: 4px solid var(--accent);
      border-radius: 6px;
      padding: 14px 18px;
      margin-bottom: 24px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }

    .interview-banner-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: 4px;
    }

    .interview-banner-q {
      font-size: 16px;
      font-weight: 600;
      color: var(--ink);
      margin: 0;
      line-height: 1.45;
    }

    /* Typography */
    h2 {
      font-size: 25px;
      line-height: 1.3;
      letter-spacing: -0.018em;
      margin: 52px 0 14px;
      color: var(--ink);
      font-weight: 750;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    h2:first-of-type {
      border-top: none;
      padding-top: 0;
      margin-top: 32px;
    }

    h3.leading-q {
      font-size: 19px;
      line-height: 1.4;
      color: var(--accent);
      font-weight: 700;
      margin: 30px 0 12px;
    }

    .section-kicker {
      display: block;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: 4px;
    }

    p {
      margin: 0 0 18px;
      color: var(--ink-secondary);
    }

    ul, ol {
      margin: 0 0 20px;
      padding-left: 22px;
      color: var(--ink-secondary);
    }

    li {
      margin-bottom: 8px;
    }

    strong {
      color: var(--ink);
      font-weight: 650;
    }

    code {
      font-family: var(--font-mono);
      font-size: 0.86em;
      background: var(--surface-muted);
      border: 1px solid var(--border);
      padding: 2px 5px;
      border-radius: 4px;
      color: #000000;
    }

    /* Ways & PRINCIPLES Callouts */
    .ways-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 24px 0;
    }

    .way-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px 18px;
    }

    .way-card.active {
      border-color: var(--accent-border);
      background: var(--accent-soft);
    }

    .way-title {
      font-size: 15.5px;
      font-weight: 750;
      line-height: 1.35;
      margin-bottom: 4px;
      color: var(--ink);
    }

    .way-card.active .way-title {
      color: var(--accent);
    }

    .way-card p {
      font-size: 15px;
      line-height: 1.55;
      margin: 0;
    }

    .moral-box {
      background: var(--moral-bg);
      border: 1px solid var(--moral-border);
      border-left: 4px solid #eab308;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 24px 0;
    }

    .moral-box-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--moral-ink);
      margin-bottom: 4px;
    }

    .moral-box p {
      margin: 0 0 10px;
      color: #000000;
      font-size: 16px;
      line-height: 1.6;
    }

    .moral-box ol {
      margin: 0;
      color: #000000;
      font-size: 15.5px;
    }

    /* Roadmap Table */
    .roadmap-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0 18px;
      font-size: 14.5px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }

    .roadmap-table th {
      background: var(--surface-muted);
      color: var(--ink);
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
    }

    .roadmap-table td {
      padding: 11px 14px;
      border-bottom: 1px solid var(--border);
      color: var(--ink-secondary);
      vertical-align: top;
      line-height: 1.5;
    }

    .roadmap-table tr:last-child td {
      border-bottom: none;
    }

    .p-badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 11.5px;
      font-weight: 700;
      color: var(--accent);
      background: var(--accent-soft);
      border: 1px solid var(--accent-border);
      padding: 2px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }

    /* ---------- Normal Lesson Code Editor (src/revised-4/editor.mjs + base.css) ---------- */
    .ed {
      display: flex;
      background: var(--code-bg);
      border: 1px solid var(--code-frame);
      border-radius: 8px;
      margin: 20px 0 24px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .ed-main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .ed .bar {
      display: flex;
      align-items: flex-end;
      min-height: 36px;
      padding: 8px 12px 0;
      background: var(--code-bar);
      border-bottom: 1px solid var(--code-frame);
    }

    .ed .dots {
      display: inline-flex;
      gap: 7px;
      align-self: center;
      margin: 0 14px 4px 2px;
    }

    .ed .dots i {
      display: inline-block;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #bfbfbf;
    }

    .ed .tab {
      display: inline-block;
      font: 700 12.5px/1.2 var(--font-mono);
      font-variant-ligatures: none;
      color: #1f2937;
      background: #ffffff;
      border: 1px solid var(--code-frame);
      border-bottom: none;
      border-radius: 6px 6px 0 0;
      padding: 5px 14px;
      margin-bottom: -1px;
      position: relative;
    }

    .ed .bar .role {
      margin: 0 0 0 auto;
      align-self: center;
      padding-bottom: 2px;
      font: 700 11px var(--font-sans);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #4b5563;
    }

    .ed .code {
      --ch: 8.1px;
      font-family: var(--font-mono);
      font-variant-ligatures: none;
      font-size: 13.5px;
      color: #000000;
      background: var(--code-bg);
      padding: 6px 0 10px;
    }

    .ed .row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      padding: 3px 0;
      line-height: 1.55;
    }

    .ed .row.even {
      background: var(--code-zebra);
    }

    .ed .row.odd {
      background: var(--code-bg);
    }

    .ed .num {
      flex: none;
      width: 44px;
      text-align: center;
      font-weight: 700;
      color: var(--code-num);
      user-select: none;
      -webkit-user-select: none;
    }

    .ed .src {
      flex: 1;
      padding: 0 calc(1.5 * var(--ch)) 0 var(--ch);
      white-space: pre-wrap;
      overflow-wrap: break-word;
      color: #000000;
    }

    .ed .row-break {
      flex-basis: 100%;
      height: 0;
    }

    /* Speech-bubble balloon comments pointing at ~token~ */
    .ed .bubble {
      position: relative;
      display: inline-block;
      margin: 8px calc(2 * var(--ch)) 5px calc(var(--ch) + var(--in, 0) * var(--ch));
      min-width: calc(var(--tl, 2) * var(--ch) + 16px);
      max-width: calc(100% - (var(--in, 0) + 7) * var(--ch));
      padding: 4px 11px 5px;
      background: #ffffff;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      color: #000000;
      font: normal 15px/1.45 var(--font-sans);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
    }

    .ed .bubble::before {
      content: "";
      position: absolute;
      top: -5px;
      left: calc(var(--tl, 2) * var(--ch) - 4px);
      width: 7px;
      height: 7px;
      background: #ffffff;
      border-top: 1px solid #d0d0d0;
      border-left: 1px solid #d0d0d0;
      transform: rotate(45deg);
    }

    .ed .bubble-right {
      flex: none;
      margin-left: calc(var(--ch) + var(--end) * var(--ch));
      margin-right: -100%;
      transform: translateX(-100%);
      white-space: nowrap;
      max-width: none;
    }

    .ed .bubble-right::before {
      left: auto;
      right: calc(var(--tl) * var(--ch) - 4px);
    }

    .ed .chip {
      font: normal 700 10.5px var(--font-mono);
      letter-spacing: 0.05em;
      color: #555555;
      background: #f4f4f4;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1px 5px;
      margin-right: 4px;
      vertical-align: 1px;
    }

    .ed .chip-wrong {
      color: #be123c;
      background: #fff1f2;
      border-color: #fecdd3;
    }

    .ed .chip-problem {
      color: #9a6200;
      background: #fff7e6;
      border-color: #f3dcaa;
    }

    .target-token {
      border-bottom: 2.2px dotted #64748b;
      padding-bottom: 2px;
    }

    .ed-right .target-token {
      border-bottom-color: #2ca662;
    }

    .ed-wrong .target-token {
      border-bottom-color: #de5252;
    }

    /* Normal lesson token colors */
    .ed .kw, .ed .nl { color: #93275a; font-weight: 700; }
    .ed .fn { color: #156a64; font-weight: 700; }
    .ed .str { color: #1a7d2e; font-weight: 700; }
    .ed .hook { color: #c2410c; font-weight: 700; }
    .ed .cmt { color: #6b7280; font-style: italic; }

    /* DO THIS (ed-right) and DO NOT DO THIS (ed-wrong) indicator column */
    .ed-indicator {
      flex: none;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid var(--code-frame);
    }

    .ed-indicator svg {
      width: 18px;
      height: 18px;
    }

    .ed-right {
      border-color: #a7f3d0;
      background: #f0fdf4;
    }

    .ed-right .ed-indicator {
      background: #d1fae5;
      color: #059669;
      border-right-color: #a7f3d0;
    }

    .ed-wrong {
      border-color: #fecdd3;
      background: #fff1f2;
    }

    .ed-wrong .ed-indicator {
      background: #ffe4e6;
      color: #e11d48;
      border-right-color: #fecdd3;
    }

    .ed-right .bar, .ed-wrong .bar {
      border-bottom-color: inherit;
    }

    /* Numbered Principle Cards with Stacked Full-Width DO THIS / DO NOT DO THIS */
    .principle-card {
      margin: 28px 0 36px;
      background: var(--surface);
      border: 1.5px solid var(--accent-border);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 3px 10px rgba(15, 76, 129, 0.05);
    }

    .principle-header {
      background: var(--accent-soft);
      border-bottom: 1px solid var(--accent-border);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .principle-num {
      background: var(--accent);
      color: #ffffff;
      font-family: var(--font-mono);
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .principle-title {
      font-size: 16.5px;
      font-weight: 750;
      color: var(--ink);
      margin: 0;
    }

    .principle-body {
      padding: 16px 18px 18px;
    }

    .principle-rule {
      font-size: 16px;
      font-weight: 650;
      color: var(--ink);
      margin: 0 0 8px;
      line-height: 1.5;
    }

    .principle-why {
      font-size: 14.5px;
      color: var(--ink-secondary);
      margin: 0 0 16px;
      line-height: 1.6;
    }

    .p-pair {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .p-pair .ed {
      margin: 0;
    }

    .p-pair .ed .code {
      font-size: 13px;
      --ch: 7.8px;
    }

    .p-label {
      font: 800 12px var(--font-sans);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 6px;
    }

    .p-do .p-label {
      color: #15803d;
    }

    .p-dont .p-label {
      color: #b91c1c;
    }

    /* Box-to-Boxes Division Trees (Vertical .t-grid & Horizontal table.t-right) */
    .box-figure {
      margin: 22px 0 26px;
      padding: 18px 16px 14px;
      background: #fafafa;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow-x: auto;
    }

    .box-caption {
      margin-top: 12px;
      font-size: 13px;
      line-height: 1.45;
      color: #000000;
      text-align: center;
      font-style: italic;
    }

    .tree {
      margin: 0;
    }

    .t-grid {
      width: 100%;
    }

    .t-row {
      display: flex;
      align-items: stretch;
      width: 100%;
    }

    .t-cell, .t-half {
      flex: none;
      box-sizing: border-box;
    }

    .t-boxes .t-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 0 5px;
    }

    .t-boxes .t-cell > div {
      flex: 1 1 auto;
      box-sizing: border-box;
      width: 100%;
    }

    .t-stems .t-cell {
      height: 14px;
    }

    .t-stem {
      width: 2px;
      height: 14px;
      background: #52525b;
      margin: 0 0 0 calc(50% - 1px);
    }

    .t-fork > div {
      height: 14px;
    }

    .t-half.t-bar {
      border-top: 2px solid #52525b;
    }

    .t-half.t-stub {
      border-right: 2px solid #52525b;
    }

    .t-node {
      display: block;
      text-align: center;
      background: #ffffff;
      border: 1.5px solid #a1a1aa;
      border-radius: 6px;
      padding: 9px 13px;
      margin: 0 auto;
      max-width: 100%;
      color: #000000;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }

    .t-node.t-root-node {
      background: var(--accent-soft);
      border-color: var(--accent);
      width: auto !important;
      max-width: 88%;
    }

    .t-label {
      font-size: 15.5px;
      font-weight: 750;
      line-height: 1.38;
      color: #000000;
    }

    /* Visual CSS rule for code/example badges inside boxes (NO outer parentheses) */
    .t-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      margin-top: 6px;
    }

    .way-card .t-chips,
    td.r-branch .t-chips {
      justify-content: flex-start;
    }

    .t-chip-group {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 5px;
      background: rgba(15, 76, 129, 0.06);
      border: 1px dashed #64748b;
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 14px;
      font-weight: 600;
      color: #000000;
    }

    .t-chip-group code {
      background: #ffffff;
      border: 1px solid #94a3b8;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 13.5px;
      font-weight: 700;
      color: #000000;
    }

    .tree code {
      white-space: nowrap;
    }

    /* Multi-line notes and key message inside boxes and diagrams */
    .t-notes {
      margin-top: 9px;
      padding-top: 8px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .t-key {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      background: #fef9c3;
      border: 1.5px solid #eab308;
      border-radius: 6px;
      padding: 5px 9px;
      font-size: 15px;
      line-height: 1.45;
      font-weight: 600;
      color: #000000;
    }

    .t-key-ico {
      flex: none;
      display: inline-flex;
      color: #b45309;
      margin-top: 2px;
    }

    .t-key.t-key-good {
      background: #dcfce7;
      border-color: #16a34a;
    }

    .t-key.t-key-good .t-key-ico {
      color: #15803d;
    }

    .t-key.t-key-bad {
      background: #fee2e2;
      border-color: #dc2626;
    }

    .t-key.t-key-bad .t-key-ico {
      color: #b91c1c;
    }

    .t-point {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 15px;
      line-height: 1.48;
      font-weight: 450;
      color: #000000;
    }

    .t-point-ico {
      flex: none;
      display: inline-flex;
      color: var(--accent);
      margin-top: 3px;
    }

    .t-good .t-point-ico,
    .r-good .t-point-ico {
      color: #15803d;
    }

    .t-bad .t-point-ico,
    .r-bad .t-point-ico {
      color: #b91c1c;
    }

    .t-node.t-good {
      border-color: #16a34a;
      background: #f0fdf4;
    }

    .t-node.t-bad {
      border-color: #dc2626;
      background: #fef2f2;
    }

    .t-mark {
      font-weight: 800;
      margin-right: 5px;
    }

    .t-mk-right::before {
      content: "✓";
      color: #15803d;
    }

    .t-mk-wrong::before {
      content: "✗";
      color: #b91c1c;
    }

    table.t-right {
      border-collapse: collapse;
      margin: 0 auto;
      width: 100%;
    }

    td.r-root {
      vertical-align: middle;
      padding: 0;
      width: 24%;
    }

    td.r-root .t-node {
      background: var(--accent-soft);
      border-color: var(--accent);
    }

    td.r-stem {
      width: 16px;
      padding: 0;
      background: linear-gradient(#52525b, #52525b) no-repeat left center / 100% 2px;
    }

    td.r-joint {
      width: 18px;
      padding: 0;
    }

    td.r-first {
      background: linear-gradient(#52525b, #52525b) no-repeat left bottom / 2px 50%, linear-gradient(#52525b, #52525b) no-repeat left center / 100% 2px;
    }

    td.r-mid {
      background: linear-gradient(#52525b, #52525b) no-repeat left top / 2px 100%, linear-gradient(#52525b, #52525b) no-repeat left center / 100% 2px;
    }

    td.r-last {
      background: linear-gradient(#52525b, #52525b) no-repeat left top / 2px 50%, linear-gradient(#52525b, #52525b) no-repeat left center / 100% 2px;
    }

    td.r-only {
      background: linear-gradient(#52525b, #52525b) no-repeat left center / 100% 2px;
    }

    td.r-branch {
      padding: 6px 0;
      vertical-align: middle;
      width: 34%;
    }

    td.r-branch .t-node {
      text-align: left;
      margin: 0;
    }

    td.r-arrow {
      padding: 0 10px;
      vertical-align: middle;
      width: 28px;
      text-align: center;
    }

    .arrow {
      display: inline-block;
      width: 14px;
      height: 2px;
      background: #52525b;
      position: relative;
      vertical-align: middle;
    }

    .arrow::after {
      content: "";
      position: absolute;
      right: -4px;
      top: -4px;
      border-left: 6px solid #52525b;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
    }

    td.r-result {
      font-size: 15px;
      line-height: 1.48;
      color: #000000;
      vertical-align: middle;
      padding: 8px 12px;
      background: #ffffff;
      border: 1.5px solid var(--border-strong);
      border-radius: 6px;
    }

    td.r-result .t-notes {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }

    td.r-good {
      border-color: #16a34a;
      background: #f0fdf4;
    }

    td.r-bad {
      border-color: #dc2626;
      background: #fef2f2;
    }

    @media (max-width: 680px) {
      .ways-grid {
        grid-template-columns: 1fr;
      }
      h1 {
        font-size: 28px;
      }
    }
  </style>`;

/* ---------------------------------------------------------------- Main Build */

function auditMarkdownProse(mdText) {
  const lines = mdText.split('\n');
  let inFence = false;
  const parenViolations = [];
  const longSentenceViolations = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();
    const unquoted = trimmed.replace(/^>\s?/, '');
    if (unquoted.startsWith('```')) {
      const lang = unquoted.slice(3).trim().split(/\s+/)[0];
      if (!inFence) {
        inFence = lang === 'tree' ? 'tree' : 'code';
      } else {
        inFence = false;
      }
      continue;
    }
    if (inFence === 'code') continue;

    // 1. Check for parentheses outside code fences
    if (/[()]/.test(line)) {
      parenViolations.push(`Line ${idx + 1}: ${line}`);
    }

    // 2. Check narrative prose sentences for excessive length (> 28 words)
    if (
      inFence === 'tree' ||
      !unquoted ||
      unquoted.startsWith('#') ||
      unquoted.startsWith('|') ||
      unquoted.startsWith('---') ||
      unquoted.startsWith('[!PRINCIPLE]')
    ) {
      continue;
    }
    const clean = unquoted
      .replace(/^[-*]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .replace(/^\*\*[^*]+\*\*:\s+/, '')
      .replace(/`[^`]+`/g, 'CODE')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1');
    const sentences = clean.split(/(?<=[.!?]["']?)\s+/);
    for (const s of sentences) {
      const words = s.trim().split(/\s+/).filter(Boolean);
      if (words.length > 28) {
        longSentenceViolations.push(`Line ${idx + 1} (${words.length} words): ${s.trim()}`);
      }
    }
  }

  return { parenViolations, longSentenceViolations };
}

const md = readFileSync(MD_PATH, 'utf8');
const { parenViolations, longSentenceViolations } = auditMarkdownProse(md);
const bodyHtml = parseAndRender(md);

const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lecture 4: Component Anatomy and the Capitalization Rule</title>
  ${STYLE_BLOCK}
</head>
<body>
  <div class="container">
${bodyHtml}
  </div>
</body>
</html>
`;

writeFileSync(HTML_PATH, finalHtml);
console.log(`Built experiment-04-river.html from experiment-04-river.md (${figCounter} box-to-boxes figures).`);
console.log(
  `Prose audit: ${parenViolations.length} parenthesis violations outside code blocks, ${longSentenceViolations.length} sentences > 28 words.`
);
if (parenViolations.length) {
  console.warn('Parenthesis violations:\n' + parenViolations.join('\n'));
}
if (longSentenceViolations.length) {
  console.warn('Long sentence warnings:\n' + longSentenceViolations.join('\n'));
}
