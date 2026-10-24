#!/usr/bin/env node
/* ============================================================
   build-river.mjs — River Version (v2) Lecture Builder & Prose Linter
   ------------------------------------------------------------
   Compiles 01-02-md-LECTURES/v2/{NN}.md ->
     01-03-md-lectures-HTML/v2/{NN}.html
     01-04-md-lectures-PDF/v2/{NN}.pdf (via Prince when available)
   Usage:
     node src/build-river.mjs 04
     node src/build-river.mjs          (builds all v2 River lectures)
   ============================================================ */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { editorBlock } from './revised-4/editor.mjs';
import { renderFileExplorer } from './file-explorer.mjs';

const SRC_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(SRC_DIR);
const MD_DIR = join(ROOT, '01-02-md-LECTURES', 'v2');
const HTML_DIR = join(ROOT, '01-03-md-lectures-HTML', 'v2');
const PDF_DIR = join(ROOT, '01-04-md-lectures-PDF', 'v2');

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
    .replace(/&lt;br\s*\/?&gt;/gi, '<br/>')
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

function treeRight(node, theme = 'book') {
  const n = node.children.length;
  const resCls = theme === 'old' ? 'r-box' : 'r-card';
  const rows = node.children
    .map((c, i) => {
      const pos = n === 1 ? 'only' : i === 0 ? 'first' : i === n - 1 ? 'last' : 'mid';
      const rootCells =
        i === 0
          ? `<td rowspan="${n}" class="r-root">${nodeBox(node)}</td><td rowspan="${n}" class="r-stem"></td>`
          : '';
      const result =
        c.notes && c.notes.length
          ? `<td class="r-arrow"><span class="arrow"></span></td><td class="r-result"><div class="${resCls} ${
              c.mark === '+' ? 'r-good' : c.mark === '!' ? 'r-bad' : ''
            }">${renderNotesList(c.notes, c.mark)}</div></td>`
          : '<td></td><td></td>';
      const branch = { ...c, notes: [] };
      return `<tr>${rootCells}<td class="r-joint r-${pos}"></td><td class="r-branch">${nodeBox(branch)}</td>${result}</tr>`;
    })
    .join('');
  return `<table class="t-right">${rows}</table>`;
}

let figCounter = 0;

function figWrap(inner, caption, cls = '') {
  if (!caption) return inner;
  figCounter++;
  return `<div class="fig-wrap${cls ? ' ' + cls : ''}">${inner}<div class="box-caption">Figure ${figCounter} — ${inline(
    caption
  )}</div></div>`;
}

function renderTree(body, attrs, theme = 'book') {
  const root = parseOutline(body);
  const inner = attrs.dir === 'right' ? treeRight(root, theme) : treeDown(root);
  figCounter++;
  const cap = attrs.caption
    ? `<div class="box-caption">Figure ${figCounter} — ${inline(attrs.caption)}</div>`
    : '';
  return `<div class="box-figure"><div class="tree">${inner}</div>${cap}</div>`;
}

/* ---------------------------------------------------------------- UI Browser Previews, DOM Panel, DevConsole & Overlay */

function parseCard(raw) {
  const card = { badges: [] };
  for (const part of raw.split('|').map((s) => s.trim()).filter(Boolean)) {
    const eq = part.indexOf('=');
    if (eq > 0) {
      const k = part.slice(0, eq).trim();
      const v = part.slice(eq + 1).trim();
      if (k === 'badge') card.badges.push(v);
      else if (k === 'badges') {
        for (const b of v.split(',').map((s) => s.trim()).filter(Boolean)) card.badges.push(b);
      } else card[k] = v;
    } else card[part] = true;
  }
  return card;
}

function cardHTML(c, extraClass = '') {
  const tone = c.tone || (c.good === true ? 'good' : c.bad === true ? 'bad' : '');
  const cls = [
    'pcard',
    extraClass,
    c.ghost ? 'pcard-ghost' : '',
    tone ? `pcard-${tone}` : '',
    c.compact ? 'pcard-compact' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const goodStr = typeof c.good === 'string' ? c.good : '';
  const badStr = typeof c.bad === 'string' ? c.bad : '';
  const goodSet = new Set(goodStr.split(',').map((s) => s.trim()).filter(Boolean));
  const badSet = new Set(badStr.split(',').map((s) => s.trim()).filter(Boolean));
  const fcls = (name, base) =>
    [base, goodSet.has(name) ? 'pf-good' : '', badSet.has(name) ? 'pf-bad' : ''].filter(Boolean).join(' ');
  const parts = [];
  if (c.head) {
    parts.push(`<div class="${fcls('head', 'phead')}">${esc(c.head)}</div>`);
  }
  if (c.img) {
    parts.push(`<div class="${fcls('img', 'pcard-img')}"><span>${esc(c.img)}</span></div>`);
  }
  if (c.badges && c.badges.length > 0) {
    const spans = c.badges
      .map((b) => `<span class="${fcls('badge', 'pcard-label')}">${esc(b)}</span>`)
      .join('');
    parts.push(`<div class="pcard-badges">${spans}</div>`);
  }
  if (c.label) parts.push(`<span class="${fcls('label', 'pcard-label')}">${esc(c.label)}</span>`);
  if (c.title !== undefined) {
    parts.push(`<div class="${fcls('title', 'pcard-title')}">${c.title ? esc(c.title) : '&nbsp;'}</div>`);
  }
  if (c.author !== undefined) {
    parts.push(`<div class="${fcls('author', 'pcard-author')}">${c.author ? esc(c.author) : '&nbsp;'}</div>`);
  }
  if (c.text) parts.push(`<div class="${fcls('text', 'pcard-text')}">${esc(c.text)}</div>`);
  if (c.lines) {
    for (const l of c.lines.split(';').map((s) => s.trim())) {
      parts.push(`<div class="${fcls('lines', 'pcard-line')}">${esc(l)}</div>`);
    }
  }
  if (c.raw) parts.push(`<div class="${fcls('raw', 'pcard-raw')}">${esc(c.raw)}</div>`);
  if (c.missing) parts.push(`<div class="pcard-missing">${esc(c.missing)}</div>`);
  if (c.input !== undefined) {
    parts.push(`<div class="${fcls('input', 'pcard-input')}">${esc(c.input || 'Write a comment')}</div>`);
  }
  if (c.typed !== undefined) {
    parts.push(
      `<div class="${fcls('typed', 'pcard-input pcard-typed')}">${esc(c.typed)}<span class="pcard-caret"></span></div>`
    );
  }
  if (c.foot) parts.push(`<div class="pcard-foot">${inline(c.foot)}</div>`);
  return `<div class="${cls}">${parts.join('')}</div>`;
}

function pageMock(body, attrs) {
  let url = attrs.url || 'localhost:5173';
  const items = [];
  const consoleRows = [];
  let isBlank = false;
  let i = 0;

  while (i < body.length) {
    const raw = body[i].trim();
    if (!raw) {
      i++;
      continue;
    }
    if (raw === 'blank') {
      isBlank = true;
      i++;
      continue;
    }
    if (raw.startsWith('url:')) {
      url = raw.slice(4).trim();
      i++;
      continue;
    }
    if (raw.startsWith('heading:')) {
      items.push(`<div class="phead">${esc(raw.slice(8).trim())}</div>`);
      i++;
      continue;
    }
    if (raw.startsWith('section:')) {
      items.push(`<div class="psec">${esc(raw.slice(8).trim())}</div>`);
      i++;
      continue;
    }
    if (raw.startsWith('card:')) {
      items.push(cardHTML(parseCard(raw.slice(5)), 'pcard-solo'));
      i++;
      continue;
    }
    if (raw.startsWith('line:') || raw.startsWith('text:')) {
      const [text, flag] = raw.slice(5).split('|').map((s) => s.trim());
      const cls = flag === 'good' ? ' pline-good' : flag === 'bad' ? ' pline-bad' : '';
      items.push(`<div class="pline${cls}">${esc(text)}</div>`);
      i++;
      continue;
    }
    if (raw.startsWith('empty:')) {
      items.push(`<div class="pempty">${esc(raw.slice(6).trim())}</div>`);
      i++;
      continue;
    }
    if (raw.startsWith('row:') || raw.startsWith('stack:')) {
      const kind = raw.startsWith('row:') ? 'prow' : 'pstack';
      const inlineSpec = raw.slice(raw.indexOf(':') + 1).trim();
      i++;
      if (inlineSpec) {
        const listCls = kind === 'prow' ? 'plist plist-row' : 'plist plist-stack';
        const spans = inlineSpec
          .split(';')
          .map((t) => `<span class="pitem">${esc(t.trim())}</span>`)
          .join('');
        items.push(`<div class="${listCls}">${spans}</div>`);
        continue;
      }
      const cards = [];
      while (i < body.length && /^\s+card:/.test(body[i])) {
        cards.push(cardHTML(parseCard(body[i].trim().slice(5))));
        i++;
      }
      items.push(`<div class="${kind}">${cards.join('')}</div>`);
      continue;
    }
    if (raw.startsWith('form:')) {
      const inlineForm = raw.slice(5).trim();
      if (inlineForm && !inlineForm.includes('=')) {
        items.push(
          `<div class="pform pform-inline"><span class="plabeltext">${esc(
            inlineForm
          )}</span><span class="pinput pinput-inline"></span></div>`
        );
        i++;
        continue;
      }
      const f = parseCard(inlineForm);
      i++;
      const fields = [];
      while (i < body.length && /^\s+(field|textarea|submit|error):/.test(body[i])) {
        const fl = body[i].trim();
        const colon = fl.indexOf(':');
        const k = fl.slice(0, colon);
        const [label, val, state] = fl.slice(colon + 1).split('|').map((s) => s.trim());
        const scls = state ? ` pfield-${state}` : '';
        if (k === 'field' || k === 'textarea') {
          const boxCls = k === 'textarea' ? 'pinput ptextarea' : 'pinput';
          fields.push(
            `<div class="pfield${scls}"><div class="plabel">${esc(label)}</div><div class="${boxCls}">${esc(
              val || ''
            )}</div></div>`
          );
        } else if (k === 'submit') {
          fields.push(`<div class="pbtn${scls}">${esc(label)}</div>`);
        } else if (k === 'error') {
          fields.push(`<div class="pferr">${esc(label)}</div>`);
        }
        i++;
      }
      const title = f.title ? `<div class="pform-title">${esc(f.title)}</div>` : '';
      items.push(`<div class="pform">${title}${fields.join('')}</div>`);
      continue;
    }
    if (raw.startsWith('error:') || raw.startsWith('warn:') || raw.startsWith('log:') || raw.startsWith('quiet:')) {
      const colon = raw.indexOf(':');
      const k = raw.slice(0, colon);
      const v = raw.slice(colon + 1).trim();
      if (k === 'quiet') consoleRows.push(`<div class="pcon-quiet">${esc(v || 'Console: no warnings')}</div>`);
      else if (k === 'log') consoleRows.push(`<div class="pcon-log">${esc(v)}</div>`);
      else consoleRows.push(`<div class="pcon-err"><span class="pcon-x">\u2715</span><span>${esc(v)}</span></div>`);
      i++;
      continue;
    }
    if (raw.startsWith('overlay:')) {
      const msg = raw.slice(8).trim();
      i++;
      const lines = [];
      while (i < body.length && /^\s+/.test(body[i])) {
        lines.push(esc(body[i].trim()));
        i++;
      }
      const code = lines.length ? `<div class="pover-code">${lines.join('\n')}</div>` : '';
      items.push(
        `<div class="pover"><div class="pover-tag">Build error</div><div class="pover-msg">${esc(
          msg
        )}</div>${code}</div>`
      );
      continue;
    }
    if (raw.startsWith('console:')) {
      const rest = raw.slice(8).trim();
      if (rest === 'quiet' || rest === 'none') {
        consoleRows.push(`<div class="pcon-quiet">Console: no warnings</div>`);
      } else if (rest) {
        consoleRows.push(`<div class="pcon-err"><span class="pcon-x">\u2715</span><span>${esc(rest)}</span></div>`);
      }
      i++;
      while (i < body.length && /^\s+(error|warn|log|quiet):/.test(body[i])) {
        const cl = body[i].trim();
        const colon = cl.indexOf(':');
        const k = cl.slice(0, colon);
        const v = cl.slice(colon + 1).trim();
        if (k === 'quiet') consoleRows.push(`<div class="pcon-quiet">${esc(v || 'no warnings')}</div>`);
        else if (k === 'log') consoleRows.push(`<div class="pcon-log">${esc(v)}</div>`);
        else consoleRows.push(`<div class="pcon-err"><span class="pcon-x">\u2715</span><span>${esc(v)}</span></div>`);
        i++;
      }
      continue;
    }
    i++;
  }

  const sizeCls = attrs.size === 'mini' ? ' mini' : '';
  const viewCls = isBlank ? 'bview bview-blank' : 'bview';
  const viewInner = isBlank
    ? '<div class="pblank-note">blank page</div>'
    : items.join('') || '<div class="pblank-note">empty</div>';
  const conHTML = consoleRows.length ? `<div class="pconsole">${consoleRows.join('')}</div>` : '';
  const html = `<div class="browser${sizeCls}">
  <div class="bbar"><span class="bdot"></span><span class="bdot"></span><span class="bdot"></span><span class="url">${esc(
    url
  )}</span></div>
  <div class="${viewCls}">${viewInner}</div>${conHTML}
</div>`;
  return figWrap(html, attrs.caption);
}

function shopMock(body, attrs) {
  let url = attrs.url || 'localhost:5173';
  const products = [];
  const rows = [];
  let cartCount = '';

  for (const rawLine of body) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('url:')) {
      url = line.slice(4).trim();
      continue;
    }
    if (line.startsWith('product:')) {
      const [ico, name, price] = line.slice(8).split('|').map((s) => s.trim());
      products.push(
        `<div class="s-prod"><div class="s-pico">${esc(ico)}</div><div class="s-pname">${esc(
          name
        )}</div><div class="s-pprice">${esc(price || '')}</div></div>`
      );
      continue;
    }
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const kind = line.slice(0, colon).trim();
    const [val, state, note] = line.slice(colon + 1).split('|').map((s) => s.trim());
    const scls = state === 'bad' ? ' s-bad' : state === 'good' ? ' s-good' : '';
    const tag = note ? `<span class="s-tag">${esc(note)}</span>` : '';
    if (kind === 'text') {
      const m = val.match(/(\d+)/);
      if (m && !cartCount) cartCount = m[1];
      rows.push(`<div class="s-row"><span class="s-items${scls}">${esc(val)}</span>${tag}</div>`);
    } else if (kind === 'input') {
      rows.push(`<div class="s-row"><div class="s-input${scls}">${esc(val)}</div>${tag}</div>`);
    } else if (kind === 'typed') {
      rows.push(
        `<div class="s-row"><div class="s-input s-typed${scls}">${esc(val)}<span class="s-caret"></span></div>${tag}</div>`
      );
    } else if (kind === 'button') {
      rows.push(`<div class="s-row"><span class="s-btn${scls}">${esc(val)}</span>${tag}</div>`);
    }
  }

  const sizeCls = attrs.size === 'mini' ? ' mini' : '';
  const badge = cartCount ? `<span class="s-badge">${esc(cartCount)}</span>` : '';
  const shelf = products.length ? `<div class="s-products">${products.join('')}</div>` : '';
  const html = `<div class="browser shopapp${sizeCls}">
  <div class="bbar"><span class="bdot"></span><span class="bdot"></span><span class="bdot"></span><span class="url">${esc(
    url
  )}</span></div>
  <div class="s-top">
    <span class="s-logo"><span class="s-mark"></span>Shop</span>
    <span class="s-search">Search products</span>
    <span class="s-cart-ico">\uD83D\uDED2${badge}</span>
  </div>
  <div class="s-body">
    ${shelf}
    <div class="s-cart">
      <div class="s-head">Shopping Cart</div>
      ${rows.join('\n      ')}
    </div>
  </div>
</div>`;
  return figWrap(html, attrs.caption);
}

function mailMock(body, attrs) {
  let url = attrs.url || 'localhost:5173';
  let toolbar = '';
  let section = '';
  const rows = [];

  for (const rawLine of body) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('url:')) {
      url = line.slice(4).trim();
      continue;
    }
    if (line.startsWith('toolbar:')) {
      const parts = line.slice(8).split('|').map((s) => s.trim()).filter(Boolean);
      const btns = parts
        .map((p) => {
          const [label, flag] = p.split('=').map((s) => s.trim());
          const cls = flag === 'active' ? ' m-btn m-btn-active' : ' m-btn';
          return `<span class="${cls}">${esc(label)}</span>`;
        })
        .join('');
      toolbar = `<div class="m-bar">${btns}</div>`;
      continue;
    }
    if (line.startsWith('section:')) {
      section = `<div class="m-sec">${esc(line.slice(8).trim())}</div>`;
      continue;
    }
    if (line.startsWith('email:')) {
      const [from, subject, time, flags = '', note = ''] = line.slice(6).split('|').map((s) => s.trim());
      const fset = new Set(flags.split(',').map((s) => s.trim()).filter(Boolean));
      const rcls = [
        'm-row',
        fset.has('unread') ? 'm-unread' : '',
        fset.has('checked') ? 'm-checked' : '',
        fset.has('good') ? 'm-good' : '',
        fset.has('bad') ? 'm-bad' : '',
      ]
        .filter(Boolean)
        .join(' ');
      const box = fset.has('checked')
        ? '<span class="m-check m-check-on">\u2713</span>'
        : '<span class="m-check"></span>';
      const dot = fset.has('unread') ? '<span class="m-dot"></span>' : '<span class="m-dot-off"></span>';
      const tag = note ? `<span class="m-note">${esc(note)}</span>` : '';
      rows.push(
        `<div class="${rcls}">${box}${dot}<span class="m-from">${esc(from)}</span><span class="m-subj">${esc(
          subject
        )}</span><span class="m-time">${esc(time || '')}</span>${tag}</div>`
      );
      continue;
    }
    if (line.startsWith('line:')) {
      const [text, flag = ''] = line.slice(5).split('|').map((s) => s.trim());
      const cls = flag === 'good' ? ' m-line-good' : flag === 'bad' ? ' m-line-bad' : '';
      rows.push(`<div class="m-line${cls}">${esc(text)}</div>`);
      continue;
    }
    if (line.startsWith('raw:')) {
      rows.push(`<div class="m-raw">${esc(line.slice(4).trim())}</div>`);
      continue;
    }
    if (line.startsWith('empty:')) {
      rows.push(`<div class="m-empty">${esc(line.slice(6).trim())}</div>`);
      continue;
    }
  }

  const sizeCls = attrs.size === 'mini' ? ' mini' : '';
  const list = rows.length ? `<div class="m-list">${rows.join('\n    ')}</div>` : '';
  const html = `<div class="browser mailapp${sizeCls}">
  <div class="bbar"><span class="bdot"></span><span class="bdot"></span><span class="bdot"></span><span class="url">${esc(
    url
  )}</span></div>
  <div class="m-top">
    <span class="m-logo"><span class="m-mark">\u2709</span>Mail</span>
    <span class="m-search">Search mail</span>
  </div>
  ${toolbar}${section}${list}
</div>`;
  return figWrap(html, attrs.caption);
}

function domPanel(body, attrs) {
  const headHtml = attrs.title ? `<span class="dom-head">${esc(attrs.title)}</span>` : '';
  const rows = body
    .map((line) => {
      let cls = 'dom-line';
      let [s, notePart] = line.split(/\s+\|\s+note:\s*/);
      if (/^[+!*~-]/.test(s)) {
        const mark = s[0];
        s = s.slice(1);
        cls +=
          mark === '+'
            ? ' dom-good'
            : mark === '!'
              ? ' dom-bad'
              : mark === '-'
                ? ' dom-gone'
                : ' dom-note';
      } else if (/^\s+[+!*~-]\s/.test(s)) {
        const m = s.match(/^(\s+)([+!*~-])\s(.*)$/);
        const mark = m[2];
        s = m[1] + m[3];
        cls +=
          mark === '+'
            ? ' dom-good'
            : mark === '!'
              ? ' dom-bad'
              : mark === '-'
                ? ' dom-gone'
                : ' dom-note';
      }
      const html = esc(s)
        .replace(/(&lt;\/?[\w-]+)/g, '<span class="dom-tag">$1</span>')
        .replace(/([\w-]+)=(&quot;[^&]*&quot;)/g, '<span class="dom-attr">$1</span>=<span class="dom-val">$2</span>')
        .replace(/(&gt;)/g, '<span class="dom-tag">$1</span>');
      const noteHtml = notePart ? ` <span class="dc-note">${inline(notePart.trim())}</span>` : '';
      return `<div class="${cls}">${html || ' '}${noteHtml}</div>`;
    })
    .join('');
  const html = `<div class="dom">
  <div class="dom-bar"><span class="dom-tab dom-tab-active">Elements</span><span class="dom-tab">Console</span>${headHtml}</div>
  <div class="dom-body">${rows}</div>
</div>`;
  return figWrap(html, attrs.caption);
}

function consolePanel(body, attrs) {
  const rows = body
    .filter((l) => l.trim())
    .map((l) => `<div class="con-row"><span class="con-x">\u2715</span><span class="con-msg">${esc(l)}</span></div>`)
    .join('\n');
  const html = `<div class="console">
  <div class="con-bar"><span class="dom-tab">Elements</span><span class="dom-tab dom-tab-active">Console</span></div>
  <div class="con-body">${rows}</div>
</div>`;
  return figWrap(html, attrs.caption);
}

function devConsole(body, attrs) {
  const src = attrs.source ? `<span class="dc-src">${esc(attrs.source)}</span>` : '';
  const rows = body
    .filter((l) => l.trim())
    .map((raw) => {
      const trimmed = raw.trim();
      if (trimmed.startsWith('x ') || trimmed.startsWith('! ')) {
        const [msg, note] = trimmed.slice(2).split('|').map((s) => s.trim());
        const noteHtml = note ? `<span class="dc-note">${inline(note)}</span>` : '';
        return `<div class="dc-err"><span class="dc-x">\u2715</span><span class="dc-err-msg">${esc(
          msg
        )}</span>${noteHtml}</div>`;
      }
      if (trimmed.startsWith('= ')) {
        const msg = trimmed.slice(2).trim();
        return `<div class="dc-quiet">${esc(msg)}</div>`;
      }
      const indent = Math.floor(raw.match(/^ */)[0].length / 2);
      const cleaned = trimmed.startsWith('+ ') ? trimmed.slice(2) : trimmed;
      const [line, note] = cleaned.split('|').map((s) => s.trim());
      let caret = '<span class="dc-pad"></span>';
      let rest = line;
      if (line.startsWith('v ') || line.startsWith('> ')) {
        caret = `<span class="dc-caret">${line[0] === 'v' ? '\u25BC' : '\u25B6'}</span>`;
        rest = line.slice(2);
      }
      const code = esc(rest)
        .replace(/^(\w+):/, '<span class="dc-key">$1</span>:')
        .replace(/(&quot;[^&]*&quot;|'[^']*')/g, '<span class="dc-str">$1</span>');
      const noteHtml = note ? `<span class="dc-note">${inline(note)}</span>` : '';
      return `<div class="dc-row" style="--in:${indent}">${caret}<span class="dc-code">${code}</span>${noteHtml}</div>`;
    })
    .join('\n');
  const html = `<div class="devcon">
  <div class="dc-bar"><span class="dom-tab">Elements</span><span class="dom-tab dom-tab-active">Console</span>${src}</div>
  <div class="dc-body">${rows}</div>
</div>`;
  return figWrap(html, attrs.caption);
}

function overlayPanel(body, attrs) {
  let msg = attrs.message || attrs.title || 'Build error';
  let file = attrs.file || '';
  let help = attrs.help || '';
  const code = [];
  for (const l of body) {
    if (l.startsWith('message:')) msg = l.slice(8).trim();
    else if (l.startsWith('title:')) msg = l.slice(6).trim();
    else if (l.startsWith('file:')) file = l.slice(5).trim();
    else if (l.startsWith('help:')) help = l.slice(5).trim();
    else if (l.startsWith('code:')) code.push(l.slice(5).replace(/^\s/, ''));
    else if (l.startsWith('bad:')) code.push('> ' + l.slice(4).trim());
    else code.push(l);
  }
  const fileHtml = file ? `<div class="ov-file">${esc(file)}</div>` : '';
  const codeHtml = code.length ? `<pre class="ov-code">${esc(code.join('\n'))}</pre>` : '';
  const helpHtml = help ? `<div class="ov-help">${inline(help)}</div>` : '';
  const html = `<div class="browser overlay">
  <div class="bbar"><span class="bdot"></span><span class="bdot"></span><span class="bdot"></span><span class="url">localhost:5173</span></div>
  <div class="ov-body">
    <div class="ov-box">
      <div class="ov-tag">Failed to compile</div>
      <div class="ov-msg">${esc(msg)}</div>
      ${fileHtml}${codeHtml}${helpHtml}
    </div>
  </div>
</div>`;
  return figWrap(html, attrs.caption);
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

function parseAndRender(md, theme = 'book') {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  let lastH3 = '';
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
      const numMatch = m[1].match(/^Lecture\s+(\d+):\s*(.*)$/);
      const lecNum = numMatch ? String(numMatch[1]).padStart(2, '0') : '04';
      const text = numMatch ? numMatch[2] : m[1];
      if (theme === 'old') {
        out.push(`<div class="chapter-meta">Lecture ${lecNum} · React 19 Foundations · River Version (v2)</div>`);
        out.push(`<h1>${inline(text)}</h1>`);
      } else {
        out.push(
          `<header class="book-opener"><div class="book-opener-num">${lecNum}</div><div class="book-opener-body"><div class="chapter-meta">Lecture ${lecNum} · React 19 Foundations</div><h1>${inline(
            text
          )}</h1></div></header>`
        );
      }
      i++;
      continue;
    }

    // H2
    if ((m = line.match(/^##\s+(.*)$/))) {
      const raw = m[1];
      const pm = raw.match(/^(\d+)\.\s+(Principle \d+):\s*(.*)$/);
      if (theme === 'old') {
        if (pm) {
          out.push(`<h2><span class="section-kicker">Section ${pm[1]} · ${pm[2]}</span>${inline(pm[3])}</h2>`);
        } else {
          out.push(`<h2>${inline(raw)}</h2>`);
        }
      } else {
        if (pm) {
          const titleClean = pm[3].replace(/^—\s*/, '');
          out.push(
            `<h2><span class="section-kicker">Section ${pm[1]} · ${pm[2]}</span><span class="h2-title">${inline(
              titleClean
            )}</span></h2>`
          );
        } else {
          const kicker = /^For the Interview\b/i.test(raw)
            ? 'Interview Prep'
            : /^Putting All\b/i.test(raw)
            ? 'Synthesis'
            : 'Overview';
          out.push(
            `<h2><span class="section-kicker">${kicker}</span><span class="h2-title">${inline(raw)}</span></h2>`
          );
        }
      }
      i++;
      continue;
    }

    // H3
    if ((m = line.match(/^###\s+(.*)$/))) {
      lastH3 = m[1];
      out.push(`<h3 class="leading-q">${inline(m[1])}</h3>`);
      i++;
      continue;
    }

    // H4
    if ((m = line.match(/^####\s+(.*)$/))) {
      out.push(`<h4 class="sub-heading">${inline(m[1])}</h4>`);
      i++;
      continue;
    }

    // Page break
    if (line.trim() === '::: pagebreak') {
      out.push('<div class="pagebreak"></div>');
      i++;
      continue;
    }

    // Side-by-side comparison row & columns (::: row / ::: col)
    if (line.startsWith('::: row')) {
      const rowAttrs = parseAttrs(line.slice(7));
      i++;
      const cols = [];
      while (i < lines.length && lines[i].trim() !== ':::') {
        if (lines[i].startsWith('::: col')) {
          const attrs = parseAttrs(lines[i].slice(7));
          i++;
          const body = [];
          while (i < lines.length && lines[i].trim() !== ':::') {
            body.push(lines[i++]);
          }
          i++;
          const toneVal = attrs.tone || attrs.kind || '';
          const tone = toneVal ? ` col-${toneVal}` : '';
          const flow = attrs.flow === 'down' ? ' col-flow' : '';
          const tag = attrs.tag ? ` <span class="col-tag">${esc(attrs.tag)}</span>` : '';
          const head = attrs.title ? `<div class="col-head">${inline(attrs.title)}${tag}</div>` : '';
          cols.push(
            `<div class="col${tone}${flow}">${head}<div class="col-body">${parseAndRender(
              body.join('\n'),
              theme
            )}</div></div>`
          );
        } else {
          i++;
        }
      }
      i++;
      const sep = rowAttrs.arrows ? '<div class="col-arrow"><span class="arrow"></span></div>' : '';
      const rowCls = rowAttrs.arrows ? 'cmp-row cmp-row-arrows' : 'cmp-row';
      out.push(figWrap(`<div class="${rowCls}">${cols.join(sep)}</div>`, rowAttrs.caption, 'row-fig'));
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
        out.push(renderTree(body, attrs, theme));
      } else if (lang === 'page') {
        out.push(pageMock(body, attrs));
      } else if (lang === 'shop') {
        out.push(shopMock(body, attrs));
      } else if (lang === 'mail') {
        out.push(mailMock(body, attrs));
      } else if (lang === 'dom') {
        out.push(domPanel(body, attrs));
      } else if (lang === 'console') {
        out.push(consolePanel(body, attrs));
      } else if (lang === 'devconsole') {
        out.push(devConsole(body, attrs));
      } else if (lang === 'overlay') {
        out.push(overlayPanel(body, attrs));
      } else if (lang === 'files') {
        out.push(figWrap(renderFileExplorer(body.join('\n'), attrs.title), attrs.caption));
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
          `<div class="interview-banner interview-banner-top"><div class="interview-banner-label">Interview Question · ${esc(
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
        const blocks = [];
        let bi = 0;
        while (bi < inner.length) {
          const bl = inner[bi].trim();
          if (!bl) {
            bi++;
            continue;
          }
          if (/^-\s+/.test(bl)) {
            const lis = [];
            while (bi < inner.length && /^-\s+/.test(inner[bi].trim())) {
              lis.push(`<li>${inline(inner[bi].trim().replace(/^-\s+/, ''))}</li>`);
              bi++;
            }
            blocks.push(`<ul>${lis.join('')}</ul>`);
          } else {
            blocks.push(`<p class="interview-banner-q">${inline(bl)}</p>`);
            bi++;
          }
        }
        out.push(`<div class="interview-banner interview-banner-full">${blocks.join('')}</div>`);
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
      const olAttr = theme === 'book' && /Follow-Up Questions/i.test(lastH3) ? ' class="qa-list"' : '';
      out.push(`<ol${olAttr}>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</ol>`);
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

/* ---------------------------------------------------------------- Stylesheets (Independent Theme CSS Files) */

const BOOK_CSS_PATH = join(SRC_DIR, 'river-book-theme.css');
const OLD_CSS_PATH = join(SRC_DIR, 'river-old-theme.css');
const BOOK_CSS = readFileSync(BOOK_CSS_PATH, 'utf8');
const OLD_CSS = readFileSync(OLD_CSS_PATH, 'utf8');

/* ---------------------------------------------------------------- Main Build */

function auditMarkdownProse(mdText) {
  const lines = mdText.split('\n');
  let inFence = false;
  let inInterviewSection = false;
  const parenViolations = [];
  const longSentenceViolations = [];
  const codeInProseViolations = [];
  const orphanHighlightViolations = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();
    const unquoted = trimmed.replace(/^>\s?/, '');
    if (unquoted.startsWith('## For the Interview')) {
      inInterviewSection = true;
    } else if (unquoted.startsWith('## ') && !unquoted.startsWith('## For the Interview')) {
      inInterviewSection = false;
    }
    if (unquoted.startsWith('```')) {
      const lang = unquoted.slice(3).trim().split(/\s+/)[0];
      if (!inFence) {
        if (lang === 'tree' || lang === 'files') {
          inFence = lang;
        } else if (['js', 'jsx', 'html'].includes(lang) || lang === '') {
          inFence = 'editor-code';
        } else {
          inFence = 'mock-code';
        }
        // Check caption on the fence header for parentheses
        if (/[()]/.test(unquoted)) {
          parenViolations.push(`Line ${idx + 1}: ${line}`);
        }
      } else {
        inFence = false;
      }
      continue;
    }
    if (inFence === 'mock-code') continue;
    if (inFence === 'editor-code') {
      const hasInlineComment = /\/\/(\s|$)|\{\/\*|\/\*|<!--/.test(unquoted);
      const isCommentOnly = /^\s*(\/\/|\{\/\*|\/\*|<!--)/.test(unquoted);
      if (isCommentOnly) {
        orphanHighlightViolations.push(
          `Line ${idx + 1} (comment-only line in code block — place comments inline on the code line with ~token~ so the speech bubble points to the token): ${unquoted}`
        );
      } else if (/~.+?~/.test(unquoted) && !hasInlineComment) {
        orphanHighlightViolations.push(
          `Line ${idx + 1} (orphan ~token~ highlight with no inline // comment bubble explaining it): ${unquoted}`
        );
      }
      continue;
    }

    // 1. Check for parentheses outside code/mock fences (exempting the verbatim bank question header)
    const isVerbatimQuestion =
      unquoted.startsWith('INTERVIEW QUESTION |') || unquoted.startsWith('**The Interview Question:**');
    const lineForParenCheck = inFence === 'files' ? line.replace(/`[^`]+`/g, '') : line;
    if (!isVerbatimQuestion && /[()]/.test(lineForParenCheck)) {
      parenViolations.push(`Line ${idx + 1}: ${line}`);
    }

    // 2. Check narrative prose sentences for River flow:
    //    - Excessive sentence length (> 28 words, counting words inside backticks too)
    //    - Code-in-prose overload (> 2 backticked spans in one sentence, or a 4+ word code statement inside prose, or slash file paths inside prose)
    if (
      isVerbatimQuestion ||
      inFence === 'tree' ||
      inFence === 'files' ||
      !unquoted ||
      unquoted.startsWith('#') ||
      unquoted.startsWith('|') ||
      unquoted.startsWith('---') ||
      unquoted.startsWith(':::') ||
      unquoted.startsWith('[!PRINCIPLE]')
    ) {
      continue;
    }

    // Temporarily mask dots inside backticks so sentence splitting doesn't split on `./App.jsx`
    const maskedLine = unquoted
      .replace(/^[-*]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .replace(/^\*\*[^*]+?[:.]?\*\*[:.]?\s+/, '')
      .replace(/`([^`]+)`/g, (_, code) => '`' + code.replace(/\./g, '\u0000') + '`');

    const rawSentences = maskedLine.split(/(?<=[.!?]["']?)\s+/);
    for (const rawS of rawSentences) {
      const s = rawS.replace(/\u0000/g, '.').trim();
      if (!s) continue;

      // Check backticked spans inside this sentence (outside ## For the Interview)
      if (!inInterviewSection) {
        const spans = [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
        if (spans.length > 2) {
          codeInProseViolations.push(
            `Line ${idx + 1} (${spans.length} code spans in one sentence — use plain human words in prose): ${s}`
          );
        }
        for (const span of spans) {
          const spanWords = span.trim().split(/\s+/).filter(Boolean);
          if (spanWords.length >= 4) {
            codeInProseViolations.push(
              `Line ${idx + 1} (${spanWords.length}-word code statement \`${span}\` in prose — move syntax to a code block): ${s}`
            );
          } else if (/[\w.]+\/[\w./]+/.test(span)) {
            codeInProseViolations.push(
              `Line ${idx + 1} (file path \`${span}\` in prose — name the file in human words like "the card file" and keep paths in code blocks/titles): ${s}`
            );
          }
        }
      }

      const plainForCount = s
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1');
      const words = plainForCount.trim().split(/\s+/).filter(Boolean);
      if (words.length > 28) {
        longSentenceViolations.push(`Line ${idx + 1} (${words.length} words): ${plainForCount.trim()}`);
      }
    }
  }

  return { parenViolations, longSentenceViolations, codeInProseViolations, orphanHighlightViolations };
}

mkdirSync(HTML_DIR, { recursive: true });
mkdirSync(PDF_DIR, { recursive: true });

// Publish both independent CSS themes into the HTML v2 directory alongside the generated HTML files
writeFileSync(join(HTML_DIR, 'river-book-theme.css'), BOOK_CSS);
writeFileSync(join(HTML_DIR, 'river-old-theme.css'), OLD_CSS);

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const noPdf = process.argv.includes('--no-pdf');

const targets = args.length
  ? args.map((a) => `${String(a).replace(/\.md$/, '').padStart(2, '0')}.md`)
  : readdirSync(MD_DIR)
      .filter((f) => /^\d+\.md$/.test(f))
      .sort();

for (const file of targets) {
  const name = file.replace(/\.md$/, '');
  const mdPath = join(MD_DIR, file);
  if (!existsSync(mdPath)) {
    console.error(`River Version (v2) lecture not found: ${mdPath}`);
    process.exit(1);
  }
  const md = readFileSync(mdPath, 'utf8');
  const titleMatch = md.match(/^#\s+(.*)$/m);
  const pageTitle = titleMatch ? titleMatch[1] : `Lecture ${name}`;
  const { parenViolations, longSentenceViolations, codeInProseViolations, orphanHighlightViolations } =
    auditMarkdownProse(md);

  // 1. New Book Design Theme -> {NN}.html
  figCounter = 0;
  const bodyBookHtml = parseAndRender(md, 'book');
  const bookFigs = figCounter;
  const finalBookHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)}</title>
  <link rel="stylesheet" href="river-book-theme.css" />
  <style>
${BOOK_CSS}
  </style>
</head>
<body>
  <div class="container">
${bodyBookHtml}
  </div>
</body>
</html>
`;

  const htmlPath = join(HTML_DIR, `${name}.html`);
  writeFileSync(htmlPath, finalBookHtml);

  // 2. Old Theme -> {NN}-old.html
  figCounter = 0;
  const bodyOldHtml = parseAndRender(md, 'old');
  const finalOldHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)} (Old Theme)</title>
  <link rel="stylesheet" href="river-old-theme.css" />
  <style>
${OLD_CSS}
  </style>
</head>
<body>
  <div class="container">
${bodyOldHtml}
  </div>
</body>
</html>
`;

  const oldHtmlPath = join(HTML_DIR, `${name}-old.html`);
  writeFileSync(oldHtmlPath, finalOldHtml);

  console.log(
    `[River v2] Built 01-03-md-lectures-HTML/v2/${name}.html (book theme) & ${name}-old.html (old theme) from 01-02-md-LECTURES/v2/${file} (${bookFigs} box-to-boxes figures).`
  );
  console.log(
    `[River v2] River Prose Surveillance (${file}): ${parenViolations.length} parenthesis violations, ${codeInProseViolations.length} code-in-prose violations, ${orphanHighlightViolations.length} orphan-highlight violations, ${longSentenceViolations.length} sentences > 28 words.`
  );
  if (parenViolations.length) {
    console.warn('Parenthesis violations:\n' + parenViolations.join('\n'));
  }
  if (codeInProseViolations.length) {
    console.warn('Code-in-prose violations (use plain human words in prose; move syntax to code blocks):\n' + codeInProseViolations.join('\n'));
  }
  if (orphanHighlightViolations.length) {
    console.warn('Orphan ~token~ or comment-only violations in code blocks:\n' + orphanHighlightViolations.join('\n'));
  }
  if (longSentenceViolations.length) {
    console.warn('Long sentence warnings:\n' + longSentenceViolations.join('\n'));
  }

  if (!noPdf) {
    const pdfPath = join(PDF_DIR, `${name}.pdf`);
    const oldPdfPath = join(PDF_DIR, `${name}-old.pdf`);
    try {
      execFileSync('prince', [htmlPath, '-o', pdfPath], { stdio: ['ignore', 'ignore', 'inherit'] });
      execFileSync('prince', [oldHtmlPath, '-o', oldPdfPath], { stdio: ['ignore', 'ignore', 'inherit'] });
      console.log(`[River v2] Built 01-04-md-lectures-PDF/v2/${name}.pdf & ${name}-old.pdf`);
    } catch {
      // Prince is optional if not installed on the current machine
    }
  }
}
