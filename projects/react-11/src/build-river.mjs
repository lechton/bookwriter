#!/usr/bin/env node
/* ============================================================
   build-river.mjs — River Version (v1) Lecture Builder & Prose Linter
   ------------------------------------------------------------
   Compiles 01-02-md-LECTURES/v1/{NN}.md ->
     01-03-md-lectures-HTML/v1/theme1/{NN}.html
     01-04-md-lectures-PDF/v1/theme1/{NN}.pdf (via Prince when available)
   Only theme1, the book theme, is rendered. The earth01 and old theme
   stylesheets stay in src/ but are not published.
   Usage:
     node src/build-river.mjs 04
     node src/build-river.mjs          (builds all v1 River lectures)
   ============================================================ */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { editorBlock } from './editor.mjs';
import { renderFileExplorer } from './file-explorer.mjs';

const SRC_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(SRC_DIR);
const VERSION = 'v1';
const MD_DIR = join(ROOT, '01-02-md-LECTURES', VERSION);
const THEME = 'theme1';
const HTML_DIR = join(ROOT, '01-03-md-lectures-HTML', VERSION, THEME);
const PDF_DIR = join(ROOT, '01-04-md-lectures-PDF', VERSION, THEME);

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
    .replace(/\[REVIEW\]/g, '<span class="concept-badge concept-review">REVIEW</span>')
    .replace(/\[NEW\]/g, '<span class="concept-badge concept-new">NEW</span>')
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
let tearDefsEmitted = false;
let colDepth = 0;

function widthCls(attrs, { wide = false } = {}) {
  if (attrs.width && attrs.width !== 'text' && attrs.width !== 'full') {
    throw new Error(`Unknown figure width "${attrs.width}" (use width=text or width=full)`);
  }
  // Inside ::: col the column sets the width; the prose indent would push the picture out of its column.
  if (colDepth > 0) return '';
  if (attrs.width) return attrs.width === 'text' ? 'fig-text' : '';
  return wide ? '' : 'fig-text';
}

function figWrap(inner, caption, cls = '') {
  if (!caption) return cls ? `<div class="fig-wrap ${cls}">${inner}</div>` : inner;
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

function pageConsoleLog(v) {
  const [msg, source] = v.split('|').map((s) => s.trim());
  const src = source ? `<span class="pcon-src">${esc(source)}</span>` : '';
  return `<div class="pcon-log"><span>${esc(msg)}</span>${src}</div>`;
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
      const withButtons = esc(text).replace(/\[([A-Za-z0-9+-][^\]]*)\]/g, '<span class="pbtn pbtn-inline">$1</span>');
      items.push(`<div class="pline${cls}">${withButtons}</div>`);
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
      while (i < body.length && /^\s+(field|textarea|select|check|submit|button|error):/.test(body[i])) {
        const fl = body[i].trim();
        const colon = fl.indexOf(':');
        const k = fl.slice(0, colon);
        const [label, val, state] = fl.slice(colon + 1).split('|').map((s) => s.trim());
        const scls = state ? ` pfield-${state}` : '';
        if (k === 'field' || k === 'textarea' || k === 'select') {
          const boxCls = k === 'textarea' ? 'pinput ptextarea' : k === 'select' ? 'pinput pselect' : 'pinput';
          fields.push(
            `<div class="pfield${scls}"><div class="plabel">${esc(label)}</div><div class="${boxCls}"><span class="pval">${esc(
              val || ''
            )}</span></div></div>`
          );
        } else if (k === 'check') {
          const on = /^(on|yes|true|checked)$/i.test(val || '');
          fields.push(
            `<div class="pfield pfield-check${scls}"><span class="pcheckbox${on ? ' pcheckbox-on' : ''}">${
              on ? '\u2713' : ''
            }</span><span class="plabel">${esc(label)}</span></div>`
          );
        } else if (k === 'submit' || k === 'button') {
          const bcls = state ? ` pbtn-${state}` : '';
          fields.push(`<div class="pbtn${bcls}">${esc(label)}</div>`);
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
      if (k === 'quiet') consoleRows.push(`<div class="pcon-quiet">${esc(v || 'No errors or warnings')}</div>`);
      else if (k === 'log') consoleRows.push(pageConsoleLog(v));
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
        consoleRows.push(`<div class="pcon-quiet">No errors or warnings</div>`);
      } else if (rest) {
        consoleRows.push(`<div class="pcon-err"><span class="pcon-x">\u2715</span><span>${esc(rest)}</span></div>`);
      }
      i++;
      while (i < body.length && /^\s+(error|warn|log|quiet):/.test(body[i])) {
        const cl = body[i].trim();
        const colon = cl.indexOf(':');
        const k = cl.slice(0, colon);
        const v = cl.slice(colon + 1).trim();
        if (k === 'quiet') consoleRows.push(`<div class="pcon-quiet">${esc(v || 'No errors or warnings')}</div>`);
        else if (k === 'log') consoleRows.push(pageConsoleLog(v));
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
  const conHTML = consoleRows.length
    ? `<div class="pconsole"><div class="pcon-bar"><span class="pcon-tab">Console</span></div><div class="pcon-body">${consoleRows.join('')}</div></div>`
    : '';
  const html = `<div class="browser${sizeCls}">
  <div class="bbar"><span class="bdot"></span><span class="bdot"></span><span class="bdot"></span><span class="url">${esc(
    url
  )}</span></div>
  <div class="${viewCls}">${viewInner}</div>${conHTML}
</div>`;
  const grid = body.some((l) => /^\s*(row|stack):/.test(l));
  return figWrap(html, attrs.caption, widthCls(attrs, { wide: grid }));
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
  return figWrap(html, attrs.caption, widthCls(attrs, { wide: true }));
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
  return figWrap(html, attrs.caption, widthCls(attrs, { wide: true }));
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
  return figWrap(html, attrs.caption, widthCls(attrs));
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
  return figWrap(html, attrs.caption, widthCls(attrs));
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
  return figWrap(html, attrs.caption, widthCls(attrs));
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
  return figWrap(html, attrs.caption, widthCls(attrs));
}

/* ---------------------------------------------------------------- Code Highlighting (Normal Lesson Editor) */

function renderCodeBlock(lang, attrs, body) {
  const edAttrs = { ...attrs };
  if (!edAttrs.title && lang) {
    edAttrs.title = lang === 'jsx' ? 'App.jsx' : lang === 'js' ? 'script.js' : lang.toUpperCase();
  }
  return editorBlock(body, edAttrs);
}

/* ---------------------------------------------------------------- Versus Titles (opt-in with a `<!-- vs -->` line above a heading) */

function splitOutsideCode(s, sep) {
  const codes = [];
  const masked = s.replace(/`[^`]+`/g, (c) => {
    codes.push(c);
    return `\u0001${codes.length - 1}\u0001`;
  });
  const at = masked.indexOf(sep);
  if (at < 0) return null;
  const restore = (t) => t.replace(/\u0001(\d+)\u0001/g, (_, n) => codes[Number(n)]);
  return [restore(masked.slice(0, at)).trim(), restore(masked.slice(at + sep.length)).trim()];
}

/* A side may name a function and then its argument ("Setter `setScore` with `score + 1`"): the last code span is the one the board shows. */
function versusSide(text, letter) {
  const code = [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]).pop();
  const label = text
    .replace(/`[^`]+`/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+(?:with|using|via|by)$/i, '')
    .replace(/^[a-z]/, (c) => c.toUpperCase());
  const codeHtml = code ? `<code class="vs-code">${esc(code)}</code>` : '';
  const labelCls = code ? 'vs-label' : 'vs-label vs-label-solo';
  return `<span class="vs-side vs-${letter}"><span class="vs-letter">${letter.toUpperCase()}</span><span class="${labelCls}">${inline(label)}</span>${codeHtml}</span>`;
}

/* Two shapes: "A vs. B: explanation" and "Topic: A vs. B". Returns null when the heading has neither. */
function renderVersusTitle(raw, level) {
  const head = splitOutsideCode(raw, ': ');
  let topic = '';
  let pair = null;
  let explain = '';
  if (head && splitOutsideCode(head[0], ' vs. ')) {
    pair = splitOutsideCode(head[0], ' vs. ');
    explain = head[1];
  } else if (head && splitOutsideCode(head[1], ' vs. ')) {
    topic = head[0];
    pair = splitOutsideCode(head[1], ' vs. ');
  } else {
    pair = splitOutsideCode(raw, ' vs. ');
  }
  if (!pair) return null;
  const board = `<span class="vs-board">${versusSide(pair[0], 'a')}<span class="vs-medal" aria-hidden="true">vs</span>${versusSide(pair[1], 'b')}</span>`;
  let explainHtml = '';
  explain = explain.replace(/^[a-z]/, (c) => c.toUpperCase());
  if (explain) {
    /* Two clauses joined by ", while " or by a single comma pair up with sides A and B; anything else gets one shared underline. */
    let joiner = ', while ';
    let clauses = splitOutsideCode(explain, joiner);
    if (!clauses && explain.replace(/`[^`]+`/g, '').split(', ').length === 2) {
      joiner = ', ';
      clauses = splitOutsideCode(explain, joiner);
    }
    explainHtml = clauses
      ? `<span class="vs-explain"><span class="vs-u vs-u-a">${inline(clauses[0])}</span>${joiner}<span class="vs-u vs-u-b">${inline(clauses[1])}</span></span>`
      : `<span class="vs-explain"><span class="vs-u vs-u-ab">${inline(explain)}</span></span>`;
  }
  const kicker = level === 2 ? `<span class="section-kicker kicker-versus">Overview · Two Ways Side by Side</span>` : '';
  const topicHtml = topic ? `<span class="vs-topic">${inline(topic)}</span>` : '';
  return `<h${level} class="vs-title vs-h${level}">${kicker}${topicHtml}${board}${explainHtml}</h${level}>`;
}

/* ---------------------------------------------------------------- Torn Blueprint Separator */

/* Pre-rendered from the tear-page template generator (seed 42, organic style) so static HTML and Prince need no script. */
const TEAR_PATHS = {
  topPaper: 'M0,0 L1440,0 L1440,18.3 L1436,18.1 L1432,18.2 L1428,17.9 L1424,17.7 L1420,18.3 L1416,18.2 L1412,17.8 L1408,17.4 L1404,17.4 L1400,17.8 L1396,17.5 L1392,17.5 L1388,17.5 L1384,17.3 L1380,17.1 L1376,17.4 L1372,17.2 L1368,16.9 L1364,16.7 L1360,16.5 L1356,16.2 L1352,15.9 L1348,15.9 L1344,16.0 L1340,15.8 L1336,15.7 L1332,15.6 L1328,16.1 L1324,16.6 L1320,16.2 L1316,16.4 L1312,16.6 L1308,17.4 L1304,17.7 L1300,17.8 L1296,18.1 L1292,18.3 L1288,18.4 L1284,17.9 L1280,17.5 L1276,17.4 L1272,17.2 L1268,17.4 L1264,18.0 L1260,18.7 L1256,19.2 L1252,19.7 L1248,20.2 L1244,20.7 L1240,21.1 L1236,21.2 L1232,20.5 L1228,20.9 L1224,21.2 L1220,20.8 L1216,20.9 L1212,21.0 L1208,20.2 L1204,19.9 L1200,19.9 L1196,20.4 L1192,21.1 L1188,21.7 L1184,22.0 L1180,22.0 L1176,21.5 L1172,21.6 L1168,21.8 L1164,21.3 L1160,21.5 L1156,21.8 L1152,21.8 L1148,21.8 L1144,22.0 L1140,21.9 L1136,22.2 L1132,22.8 L1128,22.8 L1124,22.7 L1120,22.7 L1116,22.8 L1112,23.0 L1108,22.6 L1104,22.3 L1100,21.9 L1096,21.8 L1092,22.0 L1088,22.7 L1084,22.5 L1080,22.2 L1076,22.0 L1072,21.8 L1068,21.6 L1064,21.2 L1060,21.2 L1056,21.5 L1052,21.9 L1048,22.2 L1044,22.3 L1040,22.7 L1036,22.8 L1032,22.9 L1028,23.1 L1024,23.4 L1020,24.0 L1016,24.2 L1012,23.9 L1008,22.5 L1004,22.0 L1000,22.4 L996,22.0 L992,22.4 L988,23.7 L984,23.7 L980,23.6 L976,24.0 L972,23.5 L968,22.9 L964,23.0 L960,23.3 L956,23.9 L952,24.8 L948,25.2 L944,25.0 L940,24.8 L936,24.3 L932,23.9 L928,23.9 L924,24.1 L920,23.5 L916,23.8 L912,24.3 L908,24.3 L904,24.4 L900,24.5 L896,24.9 L892,24.9 L888,24.3 L884,24.5 L880,24.7 L876,24.8 L872,24.9 L868,25.2 L864,25.9 L860,26.5 L856,26.9 L852,27.1 L848,27.1 L844,26.9 L840,26.3 L836,26.0 L832,26.1 L828,26.6 L824,27.0 L820,27.5 L816,27.2 L812,26.5 L808,26.1 L804,25.8 L800,25.6 L796,26.1 L792,26.3 L788,26.4 L784,26.2 L780,26.0 L776,25.5 L772,25.9 L768,26.3 L764,25.9 L760,25.7 L756,25.6 L752,25.7 L748,25.5 L744,25.0 L740,24.7 L736,24.3 L732,23.6 L728,23.2 L724,22.9 L720,22.4 L716,22.1 L712,21.9 L708,22.0 L704,21.9 L700,21.7 L696,22.4 L692,22.7 L688,22.8 L684,22.3 L680,22.0 L676,22.1 L672,22.3 L668,22.4 L664,22.2 L660,21.9 L656,21.6 L652,21.7 L648,22.0 L644,22.6 L640,22.3 L636,22.1 L632,22.3 L628,22.5 L624,22.6 L620,22.8 L616,23.3 L612,23.8 L608,23.6 L604,23.6 L600,23.6 L596,24.0 L592,23.9 L588,23.2 L584,23.5 L580,23.8 L576,23.6 L572,24.0 L568,24.4 L564,24.2 L560,24.1 L556,24.2 L552,24.3 L548,24.1 L544,23.3 L540,22.5 L536,21.5 L532,20.8 L528,20.0 L524,19.5 L520,19.0 L516,19.0 L512,19.0 L508,19.1 L504,18.9 L500,18.7 L496,17.5 L492,17.1 L488,17.7 L484,18.0 L480,18.5 L476,19.4 L472,19.6 L468,19.5 L464,20.0 L460,19.8 L456,19.4 L452,19.7 L448,20.4 L444,21.2 L440,22.0 L436,22.3 L432,22.3 L428,21.3 L424,20.3 L420,19.9 L416,19.7 L412,19.8 L408,19.6 L404,19.7 L400,19.7 L396,19.6 L392,19.0 L388,17.7 L384,17.1 L380,16.6 L376,16.5 L372,16.5 L368,16.5 L364,16.5 L360,16.1 L356,15.3 L352,15.3 L348,15.0 L344,14.6 L340,15.5 L336,16.2 L332,16.4 L328,17.0 L324,17.5 L320,17.9 L316,18.2 L312,18.4 L308,18.6 L304,18.7 L300,18.5 L296,18.8 L292,19.0 L288,18.9 L284,19.1 L280,19.4 L276,20.0 L272,20.2 L268,20.2 L264,19.9 L260,20.1 L256,20.4 L252,20.1 L248,19.7 L244,19.2 L240,19.4 L236,19.4 L232,18.7 L228,18.7 L224,18.7 L220,18.9 L216,19.1 L212,19.3 L208,19.2 L204,19.1 L200,19.1 L196,19.7 L192,20.1 L188,20.2 L184,20.8 L180,21.3 L176,21.1 L172,21.8 L168,22.5 L164,23.1 L160,23.2 L156,23.1 L152,23.4 L148,23.5 L144,23.6 L140,24.0 L136,24.1 L132,23.8 L128,23.7 L124,23.5 L120,22.8 L116,22.5 L112,22.2 L108,21.9 L104,22.0 L100,22.2 L96,22.2 L92,22.2 L88,22.2 L84,21.6 L80,20.8 L76,19.5 L72,19.6 L68,20.3 L64,20.2 L60,21.1 L56,22.1 L52,22.2 L48,22.2 L44,22.2 L40,22.5 L36,22.8 L32,23.3 L28,23.5 L24,23.7 L20,24.7 L16,24.5 L12,23.7 L8,23.6 L4,23.3 L0,23.1 Z',
  topFiber: 'M0,0 L1440,0 L1440,26.3 L1436,26.1 L1432,26.1 L1428,25.7 L1424,25.3 L1420,25.7 L1416,25.2 L1412,24.6 L1408,23.8 L1404,23.5 L1400,23.7 L1396,23.1 L1392,22.8 L1388,22.6 L1384,22.3 L1380,21.9 L1376,22.2 L1372,22.0 L1368,21.8 L1364,21.6 L1360,21.5 L1356,21.5 L1352,21.4 L1348,21.5 L1344,21.8 L1340,21.8 L1336,21.9 L1332,22.0 L1328,22.8 L1324,23.4 L1320,23.1 L1316,23.4 L1312,23.6 L1308,24.4 L1304,24.4 L1300,24.2 L1296,24.1 L1292,23.9 L1288,23.4 L1284,22.5 L1280,21.6 L1276,21.1 L1272,20.5 L1268,20.4 L1264,20.8 L1260,21.3 L1256,21.6 L1252,22.1 L1248,22.6 L1244,23.2 L1240,23.6 L1236,23.9 L1232,23.5 L1228,24.1 L1224,24.8 L1220,24.8 L1216,25.4 L1212,25.9 L1208,25.5 L1204,25.6 L1200,26.0 L1196,26.8 L1192,27.6 L1188,28.4 L1184,28.7 L1180,28.7 L1176,28.3 L1172,28.4 L1168,28.7 L1164,28.3 L1160,28.7 L1156,29.1 L1152,29.2 L1148,29.3 L1144,29.5 L1140,29.6 L1136,29.9 L1132,30.6 L1128,30.6 L1124,30.5 L1120,30.5 L1116,30.7 L1112,30.9 L1108,30.6 L1104,30.3 L1100,30.0 L1096,30.0 L1092,30.2 L1088,31.0 L1084,30.9 L1080,30.7 L1076,30.5 L1072,30.3 L1068,30.2 L1064,29.8 L1060,29.9 L1056,30.0 L1052,30.1 L1048,30.1 L1044,29.7 L1040,29.7 L1036,29.3 L1032,28.9 L1028,28.6 L1024,28.4 L1020,28.7 L1016,28.5 L1012,28.0 L1008,26.4 L1004,25.7 L1000,26.1 L996,25.7 L992,26.0 L988,27.2 L984,27.2 L980,27.0 L976,27.3 L972,26.7 L968,26.1 L964,26.1 L960,26.3 L956,26.9 L952,27.7 L948,28.0 L944,27.8 L940,27.6 L936,27.1 L932,26.7 L928,26.7 L924,26.9 L920,26.3 L916,26.6 L912,27.2 L908,27.2 L904,27.3 L900,27.4 L896,27.8 L892,27.9 L888,27.3 L884,27.5 L880,27.7 L876,27.8 L872,27.9 L868,28.3 L864,29.2 L860,30.2 L856,31.0 L852,31.7 L848,32.2 L844,32.7 L840,32.7 L836,33.1 L832,33.8 L828,34.9 L824,35.9 L820,36.8 L816,36.7 L812,36.1 L808,35.6 L804,35.2 L800,35.0 L796,35.2 L792,35.3 L788,35.2 L784,34.8 L780,34.3 L776,33.6 L772,33.9 L768,34.1 L764,33.4 L760,33.1 L756,33.0 L752,33.0 L748,32.8 L744,32.2 L740,31.8 L736,31.3 L732,30.5 L728,30.0 L724,29.5 L720,28.8 L716,28.3 L712,27.9 L708,27.9 L704,27.7 L700,27.3 L696,27.9 L692,28.2 L688,28.3 L684,27.8 L680,27.5 L676,27.7 L672,27.9 L668,28.1 L664,28.0 L660,27.8 L656,27.6 L652,27.8 L648,28.2 L644,28.9 L640,28.7 L636,28.6 L632,28.8 L628,29.0 L624,29.2 L620,29.3 L616,29.7 L612,30.1 L608,29.6 L604,29.4 L600,29.2 L596,29.3 L592,29.0 L588,28.1 L584,28.2 L580,28.2 L576,27.9 L572,28.2 L568,28.5 L564,28.2 L560,28.1 L556,28.1 L552,28.3 L548,28.0 L544,27.3 L540,26.4 L536,25.4 L532,24.7 L528,23.8 L524,23.3 L520,22.8 L516,22.8 L512,22.8 L508,22.8 L504,22.6 L500,22.4 L496,21.3 L492,20.9 L488,21.5 L484,21.9 L480,22.6 L476,23.6 L472,24.0 L468,24.0 L464,24.7 L460,24.6 L456,24.4 L452,24.8 L448,25.6 L444,26.4 L440,27.2 L436,27.6 L432,27.5 L428,26.5 L424,25.3 L420,24.6 L416,24.2 L412,24.1 L408,23.7 L404,23.5 L400,23.3 L396,23.0 L392,22.2 L388,20.8 L384,20.0 L380,19.5 L376,19.4 L372,19.3 L368,19.3 L364,19.4 L360,19.0 L356,18.2 L352,18.2 L348,18.0 L344,17.7 L340,18.6 L336,19.3 L332,19.5 L328,20.2 L324,20.7 L320,21.1 L316,21.4 L312,21.6 L308,21.9 L304,22.0 L300,21.9 L296,22.3 L292,22.6 L288,22.7 L284,23.0 L280,23.5 L276,24.2 L272,24.5 L268,24.7 L264,24.6 L260,24.9 L256,25.2 L252,25.0 L248,24.6 L244,24.1 L240,24.2 L236,24.3 L232,23.6 L228,23.6 L224,23.7 L220,23.9 L216,24.2 L212,24.4 L208,24.3 L204,24.2 L200,24.2 L196,24.9 L192,25.3 L188,25.4 L184,26.1 L180,26.6 L176,26.7 L172,27.6 L168,28.6 L164,29.5 L160,30.0 L156,30.4 L152,31.1 L148,31.6 L144,32.1 L140,32.8 L136,33.2 L132,33.1 L128,33.1 L124,33.0 L120,32.2 L116,31.6 L112,30.9 L108,30.2 L104,29.7 L100,29.4 L96,28.8 L92,28.3 L88,27.7 L84,26.7 L80,25.4 L76,23.7 L72,23.6 L68,24.1 L64,24.0 L60,24.8 L56,25.8 L52,25.8 L48,25.8 L44,25.7 L40,25.9 L36,26.1 L32,26.5 L28,26.5 L24,26.7 L20,27.6 L16,27.4 L12,26.5 L8,26.3 L4,26.0 L0,25.8 Z',
  topHalo: 'M0,0 L1440,0 L1440,27.1 L1436,26.9 L1432,26.9 L1428,26.6 L1424,26.2 L1420,26.6 L1416,26.3 L1412,25.7 L1408,25.0 L1404,24.7 L1400,24.9 L1396,24.3 L1392,24.1 L1388,24.2 L1384,24.0 L1380,24.0 L1376,24.5 L1372,24.5 L1368,24.5 L1364,24.4 L1360,24.4 L1356,24.3 L1352,24.0 L1348,23.8 L1344,23.8 L1340,23.5 L1336,23.2 L1332,23.0 L1328,23.4 L1324,23.9 L1320,23.5 L1316,23.8 L1312,24.2 L1308,25.0 L1304,25.2 L1300,25.1 L1296,25.3 L1292,25.2 L1288,24.8 L1284,24.0 L1280,23.1 L1276,22.6 L1272,22.0 L1268,21.8 L1264,22.1 L1260,22.5 L1256,22.8 L1252,23.2 L1248,23.6 L1244,24.1 L1240,24.6 L1236,24.9 L1232,24.5 L1228,25.2 L1224,26.0 L1220,26.1 L1216,26.8 L1212,27.4 L1208,27.2 L1204,27.3 L1200,27.7 L1196,28.6 L1192,29.4 L1188,30.2 L1184,30.6 L1180,30.7 L1176,30.4 L1172,30.6 L1168,30.9 L1164,30.6 L1160,30.9 L1156,31.4 L1152,31.6 L1148,31.8 L1144,32.2 L1140,32.5 L1136,33.0 L1132,33.9 L1128,34.1 L1124,34.1 L1120,34.1 L1116,34.2 L1112,34.2 L1108,33.5 L1104,32.9 L1100,32.1 L1096,31.7 L1092,31.5 L1088,31.9 L1084,31.6 L1080,31.3 L1076,31.2 L1072,31.1 L1068,31.1 L1064,30.9 L1060,31.1 L1056,31.5 L1052,31.8 L1048,31.9 L1044,31.6 L1040,31.6 L1036,31.2 L1032,30.6 L1028,30.2 L1024,29.8 L1020,29.8 L1016,29.4 L1012,28.7 L1008,26.8 L1004,26.1 L1000,26.4 L996,26.1 L992,26.6 L988,28.2 L984,28.5 L980,28.7 L976,29.5 L972,29.3 L968,28.9 L964,29.2 L960,29.5 L956,29.9 L952,30.6 L948,30.9 L944,30.4 L940,30.0 L936,29.3 L932,28.6 L928,28.5 L924,28.6 L920,28.0 L916,28.3 L912,28.7 L908,28.5 L904,28.5 L900,28.4 L896,28.6 L892,28.5 L888,27.7 L884,27.8 L880,28.0 L876,28.1 L872,28.2 L868,28.7 L864,29.7 L860,30.7 L856,31.7 L852,32.5 L848,33.0 L844,33.6 L840,33.6 L836,34.0 L832,34.9 L828,36.2 L824,37.5 L820,38.7 L816,38.9 L812,38.6 L808,38.3 L804,38.1 L800,37.9 L796,38.2 L792,38.2 L788,38.2 L784,37.9 L780,37.5 L776,37.0 L772,37.3 L768,37.6 L764,37.0 L760,36.6 L756,36.4 L752,36.3 L748,35.6 L744,34.6 L740,33.7 L736,32.7 L732,31.5 L728,30.6 L724,29.8 L720,29.0 L716,28.6 L712,28.3 L708,28.5 L704,28.4 L700,28.3 L696,29.1 L692,29.5 L688,29.8 L684,29.4 L680,29.2 L676,29.4 L672,29.7 L668,30.0 L664,30.0 L660,29.9 L656,29.8 L652,30.2 L648,30.7 L644,31.5 L640,31.2 L636,31.1 L632,31.3 L628,31.3 L624,31.3 L620,31.2 L616,31.3 L612,31.6 L608,31.0 L604,30.6 L600,30.4 L596,30.5 L592,30.2 L588,29.3 L584,29.4 L580,29.5 L576,29.1 L572,29.4 L568,29.7 L564,29.4 L560,29.3 L556,29.4 L552,29.6 L548,29.4 L544,28.7 L540,28.0 L536,27.0 L532,26.4 L528,25.6 L524,25.1 L520,24.6 L516,24.6 L512,24.6 L508,24.6 L504,24.3 L500,24.1 L496,22.9 L492,22.5 L488,23.1 L484,23.4 L480,24.1 L476,25.1 L472,25.5 L468,25.5 L464,26.2 L460,26.1 L456,25.8 L452,26.3 L448,27.1 L444,27.9 L440,28.7 L436,29.1 L432,29.0 L428,28.0 L424,26.8 L420,26.2 L416,25.8 L412,25.7 L408,25.3 L404,25.1 L400,24.9 L396,24.6 L392,23.7 L388,22.1 L384,21.2 L380,20.5 L376,20.2 L372,20.0 L368,19.8 L364,19.8 L360,19.4 L356,18.6 L352,18.7 L348,18.5 L344,18.2 L340,19.1 L336,19.9 L332,20.1 L328,20.9 L324,21.4 L320,21.8 L316,22.1 L312,22.4 L308,22.7 L304,22.8 L300,22.8 L296,23.3 L292,23.6 L288,23.8 L284,24.1 L280,24.6 L276,25.4 L272,25.8 L268,26.2 L264,26.3 L260,26.8 L256,27.4 L252,27.4 L248,27.1 L244,26.8 L240,27.0 L236,27.0 L232,26.3 L228,26.2 L224,26.1 L220,26.2 L216,26.4 L212,26.5 L208,26.2 L204,26.1 L200,26.1 L196,26.7 L192,27.0 L188,27.1 L184,27.5 L180,27.9 L176,27.8 L172,28.6 L168,29.5 L164,30.3 L160,30.8 L156,31.2 L152,32.1 L148,32.9 L144,33.7 L140,34.8 L136,35.6 L132,35.8 L128,36.1 L124,36.2 L120,35.4 L116,34.8 L112,34.2 L108,33.5 L104,33.0 L100,32.8 L96,32.2 L92,31.7 L88,31.2 L84,30.2 L80,28.9 L76,27.3 L72,27.1 L68,27.6 L64,27.5 L60,28.3 L56,29.3 L52,29.4 L48,29.3 L44,29.2 L40,29.4 L36,29.6 L32,29.9 L28,29.9 L24,30.0 L20,30.8 L16,30.4 L12,29.4 L8,29.2 L4,28.8 L0,28.6 Z',
  botPaper: 'M0,60 L1440,60 L1440,37.9 L1436,37.6 L1432,37.9 L1428,37.8 L1424,37.7 L1420,37.3 L1416,36.9 L1412,36.0 L1408,35.2 L1404,34.6 L1400,34.4 L1396,34.6 L1392,34.6 L1388,33.8 L1384,34.4 L1380,34.5 L1376,33.2 L1372,32.8 L1368,32.5 L1364,32.4 L1360,32.4 L1356,32.6 L1352,32.2 L1348,32.3 L1344,32.3 L1340,32.1 L1336,31.8 L1332,31.9 L1328,31.7 L1324,31.6 L1320,31.4 L1316,31.5 L1312,31.6 L1308,31.7 L1304,32.1 L1300,32.8 L1296,32.6 L1292,32.7 L1288,33.0 L1284,33.2 L1280,33.3 L1276,33.2 L1272,33.4 L1268,33.5 L1264,33.1 L1260,32.9 L1256,32.8 L1252,33.3 L1248,33.7 L1244,34.1 L1240,34.3 L1236,34.4 L1232,34.2 L1228,34.3 L1224,34.4 L1220,35.0 L1216,34.7 L1212,34.1 L1208,34.4 L1204,34.3 L1200,34.2 L1196,33.9 L1192,33.1 L1188,31.7 L1184,31.2 L1180,31.0 L1176,31.0 L1172,30.4 L1168,29.7 L1164,29.3 L1160,29.6 L1156,30.4 L1152,30.0 L1148,30.0 L1144,29.9 L1140,29.9 L1136,29.9 L1132,30.3 L1128,29.8 L1124,29.4 L1120,29.6 L1116,29.9 L1112,30.2 L1108,30.2 L1104,30.3 L1100,30.5 L1096,30.3 L1092,30.2 L1088,30.2 L1084,29.8 L1080,29.7 L1076,30.2 L1072,30.0 L1068,29.6 L1064,29.8 L1060,29.6 L1056,29.3 L1052,30.0 L1048,30.8 L1044,31.8 L1040,32.4 L1036,32.7 L1032,31.9 L1028,31.8 L1024,31.5 L1020,30.9 L1016,30.9 L1012,30.8 L1008,30.7 L1004,30.7 L1000,30.8 L996,31.5 L992,32.1 L988,32.4 L984,32.6 L980,32.2 L976,31.3 L972,30.5 L968,29.7 L964,29.9 L960,29.4 L956,28.6 L952,27.9 L948,27.5 L944,27.8 L940,26.9 L936,26.3 L932,26.3 L928,26.1 L924,26.2 L920,26.7 L916,27.1 L912,27.5 L908,28.0 L904,27.6 L900,26.5 L896,26.4 L892,26.2 L888,26.2 L884,27.2 L880,28.1 L876,28.7 L872,28.8 L868,28.7 L864,29.1 L860,28.9 L856,28.5 L852,28.5 L848,28.3 L844,28.1 L840,28.1 L836,28.1 L832,27.6 L828,27.0 L824,26.4 L820,26.1 L816,26.4 L812,27.0 L808,27.2 L804,27.2 L800,27.1 L796,27.3 L792,27.4 L788,27.3 L784,27.7 L780,27.9 L776,27.4 L772,27.7 L768,28.1 L764,28.1 L760,28.0 L756,27.8 L752,28.3 L748,28.8 L744,29.0 L740,29.3 L736,29.7 L732,30.5 L728,30.8 L724,30.7 L720,29.9 L716,29.0 L712,28.3 L708,28.4 L704,28.9 L700,29.4 L696,30.0 L692,30.6 L688,31.4 L684,31.5 L680,31.5 L676,31.0 L672,31.5 L668,32.1 L664,31.7 L660,32.2 L656,32.8 L652,32.7 L648,33.0 L644,33.5 L640,34.0 L636,34.2 L632,33.9 L628,34.2 L624,34.4 L620,34.3 L616,34.2 L612,33.9 L608,33.5 L604,33.2 L600,33.2 L596,33.6 L592,33.8 L588,33.2 L584,33.4 L580,33.4 L576,33.4 L572,34.0 L568,34.7 L564,34.1 L560,33.5 L556,32.7 L552,32.2 L548,31.5 L544,30.6 L540,30.5 L536,29.9 L532,28.5 L528,27.7 L524,27.4 L520,27.8 L516,27.8 L512,27.7 L508,27.7 L504,27.4 L500,26.7 L496,27.2 L492,27.5 L488,27.7 L484,28.4 L480,29.0 L476,28.7 L472,29.4 L468,30.2 L464,30.5 L460,30.7 L456,30.9 L452,31.2 L448,31.1 L444,30.5 L440,30.7 L436,31.0 L432,31.5 L428,31.8 L424,32.1 L420,31.8 L416,31.6 L412,31.3 L408,31.5 L404,31.1 L400,30.5 L396,30.8 L392,30.9 L388,30.8 L384,31.0 L380,31.0 L376,30.6 L372,30.5 L368,30.4 L364,29.9 L360,30.2 L356,31.1 L352,31.3 L348,31.2 L344,30.5 L340,31.0 L336,31.2 L332,30.6 L328,30.6 L324,30.6 L320,30.9 L316,30.5 L312,30.1 L308,30.5 L304,30.7 L300,30.7 L296,31.2 L292,31.5 L288,31.5 L284,31.9 L280,32.0 L276,31.4 L272,31.4 L268,31.6 L264,31.6 L260,32.0 L256,32.7 L252,32.6 L248,32.1 L244,31.3 L240,30.4 L236,30.1 L232,30.8 L228,31.3 L224,32.0 L220,32.8 L216,32.9 L212,32.9 L208,33.0 L204,33.1 L200,33.1 L196,33.1 L192,32.9 L188,32.7 L184,32.5 L180,32.8 L176,33.4 L172,34.1 L168,34.8 L164,35.9 L160,35.9 L156,35.2 L152,35.4 L148,35.1 L144,34.4 L140,34.5 L136,34.6 L132,34.7 L128,34.4 L124,34.3 L120,34.7 L116,34.9 L112,34.9 L108,35.2 L104,35.1 L100,34.7 L96,34.1 L92,33.6 L88,33.3 L84,33.8 L80,34.2 L76,34.2 L72,34.5 L68,35.1 L64,35.6 L60,35.9 L56,35.9 L52,35.2 L48,34.2 L44,33.0 L40,32.4 L36,32.1 L32,32.1 L28,31.7 L24,31.2 L20,30.5 L16,30.5 L12,31.1 L8,31.4 L4,31.8 L0,31.7 Z',
  botFiber: 'M0,60 L1440,60 L1440,31.6 L1436,31.4 L1432,31.7 L1428,31.9 L1424,32.0 L1420,32.0 L1416,31.9 L1412,31.5 L1408,31.0 L1404,30.8 L1400,30.9 L1396,31.5 L1392,31.7 L1388,31.2 L1384,31.9 L1380,32.0 L1376,30.8 L1372,30.3 L1368,30.1 L1364,29.9 L1360,29.9 L1356,30.1 L1352,29.7 L1348,29.6 L1344,29.6 L1340,29.4 L1336,29.0 L1332,29.0 L1328,28.8 L1324,28.7 L1320,28.4 L1316,28.5 L1312,28.6 L1308,28.6 L1304,28.9 L1300,29.5 L1296,29.2 L1292,29.1 L1288,29.2 L1284,29.1 L1280,29.0 L1276,28.6 L1272,28.5 L1268,28.4 L1264,27.7 L1260,27.3 L1256,27.1 L1252,27.5 L1248,27.9 L1244,28.4 L1240,28.7 L1236,28.9 L1232,28.8 L1228,29.1 L1224,29.4 L1220,30.2 L1216,30.1 L1212,29.8 L1208,30.2 L1204,30.3 L1200,30.2 L1196,30.0 L1192,29.3 L1188,27.9 L1184,27.4 L1180,27.3 L1176,27.3 L1172,26.6 L1168,25.9 L1164,25.6 L1160,25.8 L1156,26.6 L1152,26.3 L1148,26.2 L1144,26.1 L1140,26.2 L1136,26.2 L1132,26.6 L1128,26.0 L1124,25.6 L1120,25.8 L1116,26.1 L1112,26.2 L1108,26.0 L1104,25.9 L1100,25.9 L1096,25.5 L1092,25.1 L1088,24.8 L1084,24.2 L1080,23.8 L1076,24.1 L1072,23.7 L1068,23.2 L1064,23.4 L1060,23.2 L1056,23.0 L1052,23.7 L1048,24.8 L1044,26.0 L1040,26.9 L1036,27.4 L1032,26.9 L1028,27.0 L1024,27.0 L1020,26.7 L1016,26.8 L1012,26.9 L1008,26.9 L1004,27.1 L1000,27.2 L996,27.8 L992,28.4 L988,28.5 L984,28.6 L980,28.1 L976,27.0 L972,25.9 L968,24.9 L964,24.9 L960,24.2 L956,23.2 L952,22.3 L948,21.8 L944,22.0 L940,21.0 L936,20.3 L932,20.4 L928,20.3 L924,20.5 L920,21.1 L916,21.7 L912,22.2 L908,22.9 L904,22.6 L900,21.7 L896,21.7 L892,21.7 L888,21.8 L884,22.9 L880,23.9 L876,24.5 L872,24.6 L868,24.4 L864,24.7 L860,24.4 L856,23.7 L852,23.5 L848,23.1 L844,22.6 L840,22.3 L836,22.0 L832,21.2 L828,20.4 L824,19.6 L820,19.1 L816,19.3 L812,19.9 L808,20.0 L804,20.1 L800,19.9 L796,20.0 L792,20.1 L788,19.9 L784,20.3 L780,20.4 L776,19.8 L772,20.0 L768,20.3 L764,20.3 L760,20.2 L756,19.9 L752,20.4 L748,20.8 L744,21.1 L740,21.3 L736,21.6 L732,22.3 L728,22.5 L724,22.3 L720,21.3 L716,20.3 L712,19.4 L708,19.4 L704,19.7 L700,20.1 L696,20.7 L692,21.2 L688,22.0 L684,22.2 L680,22.4 L676,22.2 L672,23.0 L668,24.1 L664,24.2 L660,25.2 L656,26.3 L652,26.7 L648,27.5 L644,28.4 L640,29.2 L636,29.7 L632,29.6 L628,30.0 L624,30.3 L620,30.1 L616,29.8 L612,29.3 L608,28.5 L604,27.9 L600,27.4 L596,27.3 L592,26.9 L588,25.9 L584,25.5 L580,25.0 L576,24.6 L572,24.9 L568,25.2 L564,24.5 L560,24.0 L556,23.4 L552,23.4 L548,23.3 L544,23.1 L540,23.8 L536,24.0 L532,23.3 L528,23.3 L524,23.6 L520,24.6 L516,25.0 L512,25.1 L508,25.4 L504,25.1 L500,24.5 L496,25.0 L492,25.3 L488,25.5 L484,26.2 L480,26.7 L476,26.3 L472,27.0 L468,27.7 L464,27.9 L460,28.1 L456,28.2 L452,28.4 L448,28.3 L444,27.6 L440,27.8 L436,28.1 L432,28.5 L428,28.9 L424,29.2 L420,28.9 L416,28.6 L412,28.3 L408,28.5 L404,28.1 L400,27.5 L396,27.8 L392,27.9 L388,27.7 L384,27.9 L380,28.0 L376,27.5 L372,27.4 L368,27.2 L364,26.5 L360,26.6 L356,27.2 L352,27.1 L348,26.6 L344,25.5 L340,25.6 L336,25.3 L332,24.3 L328,23.9 L324,23.6 L320,23.6 L316,23.1 L312,22.6 L308,23.0 L304,23.3 L300,23.4 L296,24.0 L292,24.4 L288,24.5 L284,24.9 L280,25.1 L276,24.6 L272,24.7 L268,25.0 L264,25.1 L260,25.6 L256,26.3 L252,26.2 L248,25.7 L244,25.0 L240,24.3 L236,24.1 L232,25.0 L228,25.9 L224,26.8 L220,27.9 L216,28.3 L212,28.5 L208,28.9 L204,29.2 L200,29.3 L196,29.5 L192,29.3 L188,29.2 L184,29.0 L180,29.1 L176,29.5 L172,29.9 L168,30.2 L164,31.0 L160,30.5 L156,29.2 L152,28.9 L148,28.1 L144,26.9 L140,26.6 L136,26.2 L132,26.0 L128,25.5 L124,25.4 L120,25.9 L116,26.2 L112,26.5 L108,27.1 L104,27.3 L100,27.3 L96,27.0 L92,27.0 L88,27.0 L84,27.8 L80,28.6 L76,28.8 L72,29.3 L68,30.0 L64,30.5 L60,30.9 L56,31.0 L52,30.4 L48,29.5 L44,28.6 L40,28.2 L36,28.1 L32,28.3 L28,28.1 L24,27.9 L20,27.3 L16,27.5 L12,28.3 L8,28.7 L4,29.0 L0,29.0 Z',
  botHalo: 'M0,60 L1440,60 L1440,29.2 L1436,29.0 L1432,29.4 L1428,29.6 L1424,29.8 L1420,29.9 L1416,29.9 L1412,29.5 L1408,29.2 L1404,28.9 L1400,29.1 L1396,29.7 L1392,30.0 L1388,29.5 L1384,30.3 L1380,30.6 L1376,29.4 L1372,29.1 L1368,28.8 L1364,28.8 L1360,28.8 L1356,29.0 L1352,28.6 L1348,28.6 L1344,28.7 L1340,28.5 L1336,28.2 L1332,28.3 L1328,28.1 L1324,28.0 L1320,27.8 L1316,27.9 L1312,28.0 L1308,28.1 L1304,28.5 L1300,29.2 L1296,28.9 L1292,28.8 L1288,29.0 L1284,28.9 L1280,28.8 L1276,28.4 L1272,28.3 L1268,28.0 L1264,27.2 L1260,26.6 L1256,26.2 L1252,26.5 L1248,26.8 L1244,27.1 L1240,27.5 L1236,27.6 L1232,27.6 L1228,27.8 L1224,28.2 L1220,29.0 L1216,28.9 L1212,28.5 L1208,29.0 L1204,29.1 L1200,29.0 L1196,28.9 L1192,28.2 L1188,26.9 L1184,26.5 L1180,26.4 L1176,26.6 L1172,26.0 L1168,25.4 L1164,25.1 L1160,25.4 L1156,26.1 L1152,25.5 L1148,25.1 L1144,24.6 L1140,24.2 L1136,23.8 L1132,23.7 L1128,22.8 L1124,22.2 L1120,22.4 L1116,22.6 L1112,23.1 L1108,23.2 L1104,23.5 L1100,24.0 L1096,24.1 L1092,24.1 L1088,24.1 L1084,23.8 L1080,23.5 L1076,23.8 L1072,23.2 L1068,22.6 L1064,22.5 L1060,22.1 L1056,21.7 L1052,22.3 L1048,23.1 L1044,24.2 L1040,25.1 L1036,25.6 L1032,25.1 L1028,25.3 L1024,25.4 L1020,25.1 L1016,25.3 L1012,25.5 L1008,25.6 L1004,25.7 L1000,25.8 L996,26.5 L992,26.9 L988,26.9 L984,26.8 L980,26.1 L976,24.8 L972,23.6 L968,22.4 L964,22.3 L960,21.6 L956,20.6 L952,19.6 L948,19.0 L944,19.1 L940,18.0 L936,17.3 L932,17.3 L928,17.1 L924,17.2 L920,17.8 L916,18.5 L912,19.2 L908,20.1 L904,20.3 L900,19.8 L896,20.2 L892,20.5 L888,20.9 L884,22.2 L880,23.3 L876,23.9 L872,24.0 L868,23.8 L864,24.0 L860,23.6 L856,22.9 L852,22.6 L848,22.2 L844,21.7 L840,21.4 L836,21.0 L832,20.1 L828,19.2 L824,18.3 L820,17.6 L816,17.7 L812,18.0 L808,18.1 L804,18.0 L800,17.8 L796,18.0 L792,18.1 L788,18.0 L784,18.5 L780,18.7 L776,18.2 L772,18.6 L768,19.0 L764,19.0 L760,18.9 L756,18.7 L752,19.3 L748,19.8 L744,20.1 L740,20.4 L736,20.9 L732,21.7 L728,22.0 L724,21.9 L720,20.9 L716,19.9 L712,19.0 L708,19.1 L704,19.4 L700,19.9 L696,20.4 L692,21.0 L688,21.8 L684,22.0 L680,22.2 L676,22.0 L672,22.8 L668,23.7 L664,23.6 L660,24.3 L656,25.3 L652,25.5 L648,26.1 L644,26.9 L640,27.7 L636,28.2 L632,28.2 L628,28.7 L624,29.0 L620,28.9 L616,28.8 L612,28.4 L608,27.7 L604,27.1 L600,26.6 L596,26.5 L592,26.0 L588,24.6 L584,24.0 L580,23.2 L576,22.4 L572,22.4 L568,22.5 L564,21.6 L560,21.0 L556,20.5 L552,20.6 L548,20.6 L544,20.6 L540,21.5 L536,21.9 L532,21.4 L528,21.5 L524,21.9 L520,22.9 L516,23.3 L512,23.5 L508,23.9 L504,23.7 L500,23.1 L496,23.6 L492,24.0 L488,24.2 L484,25.0 L480,25.5 L476,25.1 L472,25.9 L468,26.8 L464,27.1 L460,27.4 L456,27.7 L452,28.1 L448,28.1 L444,27.5 L440,27.8 L436,28.0 L432,28.4 L428,28.6 L424,28.8 L420,28.3 L416,28.0 L412,27.5 L408,27.6 L404,27.1 L400,26.5 L396,26.8 L392,26.9 L388,26.9 L384,27.1 L380,27.3 L376,27.0 L372,26.9 L368,26.8 L364,26.2 L360,26.3 L356,26.9 L352,26.6 L348,25.9 L344,24.5 L340,24.3 L336,23.8 L332,22.6 L328,22.0 L324,21.5 L320,21.5 L316,21.0 L312,20.6 L308,21.2 L304,21.6 L300,22.0 L296,22.8 L292,23.4 L288,23.6 L284,24.2 L280,24.4 L276,23.9 L272,23.9 L268,24.0 L264,23.9 L260,24.2 L256,24.7 L252,24.4 L248,23.7 L244,23.0 L240,22.1 L236,22.1 L232,23.1 L228,24.1 L224,25.3 L220,26.6 L216,27.2 L212,27.7 L208,28.3 L204,28.7 L200,28.9 L196,29.0 L192,28.6 L188,28.1 L184,27.4 L180,27.1 L176,27.0 L172,26.9 L168,26.9 L164,27.4 L160,26.8 L156,25.6 L152,25.4 L148,24.8 L144,23.9 L140,23.9 L136,23.8 L132,23.9 L128,23.7 L124,23.7 L120,24.2 L116,24.6 L112,24.7 L108,25.2 L104,25.2 L100,25.1 L96,24.6 L92,24.3 L88,24.2 L84,25.0 L80,25.7 L76,25.9 L72,26.4 L68,27.1 L64,27.6 L60,27.9 L56,27.9 L52,27.3 L48,26.4 L44,25.5 L40,25.1 L36,25.0 L32,25.3 L28,25.3 L24,25.2 L20,24.8 L16,25.1 L12,26.1 L8,26.6 L4,27.1 L0,27.1 Z',
  hdrPaper: 'M0,60 L1440,60 L1440,40.3 L1436,40.3 L1432,39.9 L1428,39.6 L1424,39.4 L1420,40.1 L1416,40.2 L1412,40.3 L1408,40.3 L1404,40.3 L1400,40.1 L1396,40.4 L1392,40.6 L1388,41.1 L1384,41.0 L1380,41.1 L1376,41.2 L1372,41.8 L1368,42.3 L1364,41.6 L1360,41.8 L1356,42.4 L1352,42.6 L1348,42.7 L1344,42.6 L1340,41.6 L1336,40.6 L1332,39.9 L1328,39.7 L1324,39.9 L1320,39.5 L1316,40.1 L1312,40.9 L1308,40.1 L1304,39.9 L1300,40.4 L1296,40.2 L1292,39.8 L1288,38.8 L1284,38.7 L1280,38.6 L1276,38.5 L1272,38.5 L1268,38.7 L1264,39.3 L1260,39.6 L1256,39.7 L1252,40.3 L1248,40.4 L1244,39.9 L1240,40.1 L1236,40.3 L1232,40.7 L1228,40.3 L1224,39.7 L1220,38.7 L1216,38.8 L1212,39.2 L1208,39.5 L1204,39.7 L1200,39.6 L1196,39.9 L1192,40.3 L1188,40.6 L1184,41.2 L1180,41.5 L1176,41.4 L1172,41.5 L1168,41.7 L1164,41.3 L1160,41.5 L1156,42.1 L1152,42.2 L1148,42.2 L1144,42.1 L1140,41.9 L1136,41.6 L1132,41.6 L1128,40.9 L1124,40.4 L1120,40.0 L1116,39.8 L1112,39.4 L1108,39.4 L1104,39.3 L1100,39.5 L1096,39.4 L1092,39.3 L1088,38.9 L1084,38.2 L1080,37.7 L1076,37.7 L1072,37.9 L1068,38.3 L1064,38.7 L1060,38.5 L1056,37.9 L1052,38.1 L1048,38.0 L1044,38.0 L1040,37.9 L1036,38.0 L1032,38.1 L1028,38.4 L1024,38.7 L1020,39.0 L1016,39.4 L1012,40.0 L1008,40.2 L1004,40.0 L1000,39.5 L996,39.8 L992,40.3 L988,40.9 L984,41.5 L980,41.8 L976,42.0 L972,41.7 L968,41.3 L964,41.2 L960,41.4 L956,41.7 L952,41.2 L948,41.1 L944,41.6 L940,41.6 L936,41.9 L932,42.2 L928,42.6 L924,42.7 L920,42.5 L916,42.6 L912,42.8 L908,42.4 L904,42.1 L900,41.7 L896,41.5 L892,41.4 L888,41.2 L884,41.0 L880,40.7 L876,40.4 L872,40.2 L868,39.9 L864,39.1 L860,39.2 L856,39.8 L852,39.6 L848,39.9 L844,40.7 L840,40.7 L836,40.9 L832,42.1 L828,42.4 L824,42.7 L820,43.9 L816,44.3 L812,44.1 L808,43.4 L804,43.2 L800,43.6 L796,43.2 L792,43.2 L788,43.3 L784,43.6 L780,43.7 L776,43.6 L772,43.3 L768,42.9 L764,42.7 L760,42.2 L756,41.5 L752,41.3 L748,40.8 L744,40.1 L740,39.9 L736,40.1 L732,40.9 L728,40.5 L724,40.1 L720,40.5 L716,40.4 L712,40.2 L708,41.0 L704,41.4 L700,41.8 L696,42.0 L692,42.3 L688,42.3 L684,42.0 L680,41.9 L676,42.7 L672,42.9 L668,42.9 L664,42.6 L660,42.5 L656,42.6 L652,42.3 L648,42.6 L644,43.3 L640,43.2 L636,43.2 L632,43.6 L628,43.7 L624,43.7 L620,43.3 L616,43.1 L612,42.6 L608,42.3 L604,41.5 L600,40.4 L596,41.0 L592,41.1 L588,40.7 L584,40.8 L580,40.8 L576,40.6 L572,40.9 L568,41.3 L564,41.3 L560,41.3 L556,41.1 L552,40.8 L548,40.5 L544,40.3 L540,41.0 L536,41.7 L532,42.0 L528,42.7 L524,43.2 L520,43.1 L516,43.7 L512,44.3 L508,44.2 L504,43.7 L500,42.9 L496,42.0 L492,41.4 L488,41.5 L484,41.5 L480,41.8 L476,42.6 L472,42.4 L468,41.8 L464,41.5 L460,41.5 L456,41.8 L452,41.2 L448,41.1 L444,41.4 L440,41.3 L436,41.1 L432,40.4 L428,40.0 L424,39.7 L420,39.9 L416,39.7 L412,39.4 L408,38.7 L404,38.5 L400,38.7 L396,38.3 L392,37.8 L388,37.4 L384,36.9 L380,36.5 L376,36.4 L372,36.9 L368,37.4 L364,37.1 L360,36.8 L356,36.1 L352,36.1 L348,35.8 L344,35.3 L340,35.6 L336,35.8 L332,36.0 L328,35.8 L324,35.6 L320,35.9 L316,36.2 L312,36.5 L308,36.8 L304,36.9 L300,36.9 L296,36.8 L292,36.9 L288,37.3 L284,37.4 L280,37.4 L276,36.6 L272,37.0 L268,37.5 L264,37.7 L260,37.5 L256,37.2 L252,37.7 L248,38.0 L244,38.0 L240,38.9 L236,39.5 L232,39.4 L228,40.4 L224,41.4 L220,41.5 L216,42.1 L212,42.8 L208,42.6 L204,42.4 L200,42.2 L196,41.5 L192,40.3 L188,38.6 L184,37.8 L180,37.3 L176,36.4 L172,36.6 L168,36.8 L164,36.1 L160,35.8 L156,35.8 L152,35.1 L148,34.6 L144,34.0 L140,34.5 L136,34.5 L132,33.7 L128,34.2 L124,34.7 L120,34.5 L116,34.6 L112,34.6 L108,35.0 L104,35.3 L100,35.6 L96,36.1 L92,36.5 L88,37.0 L84,37.5 L80,38.0 L76,38.2 L72,38.4 L68,38.5 L64,38.5 L60,38.5 L56,38.4 L52,38.6 L48,38.4 L44,37.6 L40,38.2 L36,38.6 L32,38.5 L28,38.8 L24,39.1 L20,40.4 L16,40.7 L12,41.1 L8,41.0 L4,41.2 L0,41.4 Z',
  hdrFiber: 'M0,60 L1440,60 L1440,37.8 L1436,37.8 L1432,37.4 L1428,37.0 L1424,36.8 L1420,37.3 L1416,37.3 L1412,37.3 L1408,37.0 L1404,36.9 L1400,36.5 L1396,36.6 L1392,36.6 L1388,36.9 L1384,36.7 L1380,36.7 L1376,36.8 L1372,37.3 L1368,37.8 L1364,37.1 L1360,37.2 L1356,37.7 L1352,37.8 L1348,37.8 L1344,37.6 L1340,36.6 L1336,35.5 L1332,34.7 L1328,34.4 L1324,34.5 L1320,34.0 L1316,34.6 L1312,35.4 L1308,34.6 L1304,34.5 L1300,35.1 L1296,35.1 L1292,34.9 L1288,34.0 L1284,34.1 L1280,34.1 L1276,34.3 L1272,34.4 L1268,34.8 L1264,35.5 L1260,35.9 L1256,36.1 L1252,36.7 L1248,36.8 L1244,36.3 L1240,36.4 L1236,36.5 L1232,36.8 L1228,36.2 L1224,35.4 L1220,34.3 L1216,34.2 L1212,34.4 L1208,34.6 L1204,34.5 L1200,34.4 L1196,34.6 L1192,34.9 L1188,35.1 L1184,35.7 L1180,36.0 L1176,36.0 L1172,36.2 L1168,36.5 L1164,36.1 L1160,36.5 L1156,37.2 L1152,37.4 L1148,37.5 L1144,37.5 L1140,37.4 L1136,37.1 L1132,37.2 L1128,36.5 L1124,36.0 L1120,35.7 L1116,35.3 L1112,35.0 L1108,34.8 L1104,34.7 L1100,34.8 L1096,34.7 L1092,34.4 L1088,33.9 L1084,33.2 L1080,32.6 L1076,32.5 L1072,32.7 L1068,33.0 L1064,33.4 L1060,33.2 L1056,32.5 L1052,32.6 L1048,32.3 L1044,32.2 L1040,31.9 L1036,31.8 L1032,31.6 L1028,31.6 L1024,31.7 L1020,31.7 L1016,32.0 L1012,32.4 L1008,32.4 L1004,32.1 L1000,31.5 L996,31.8 L992,32.3 L988,32.8 L984,33.3 L980,33.5 L976,33.6 L972,33.1 L968,32.5 L964,32.3 L960,32.3 L956,32.5 L952,31.9 L948,31.7 L944,32.1 L940,32.1 L936,32.4 L932,32.8 L928,33.6 L924,34.2 L920,34.6 L916,35.3 L912,36.2 L908,36.5 L904,36.9 L900,37.2 L896,37.5 L892,37.9 L888,38.1 L884,38.1 L880,38.0 L876,37.7 L872,37.5 L868,37.2 L864,36.1 L860,36.0 L856,36.4 L852,35.8 L848,35.7 L844,36.1 L840,35.5 L836,35.3 L832,36.0 L828,35.8 L824,35.8 L820,36.7 L816,36.9 L812,36.7 L808,36.1 L804,36.0 L800,36.6 L796,36.5 L792,36.8 L788,37.3 L784,37.9 L780,38.4 L776,38.7 L772,38.7 L768,38.6 L764,38.7 L760,38.4 L756,37.8 L752,37.7 L748,37.1 L744,36.3 L740,36.0 L736,35.9 L732,36.4 L728,35.7 L724,34.8 L720,34.7 L716,34.1 L712,33.4 L708,33.8 L704,33.7 L700,33.7 L696,33.7 L692,33.7 L688,33.6 L684,33.4 L680,33.4 L676,34.4 L672,34.8 L668,35.1 L664,35.0 L660,35.2 L656,35.6 L652,35.6 L648,36.2 L644,37.1 L640,37.3 L636,37.4 L632,37.9 L628,38.1 L624,38.2 L620,37.8 L616,37.3 L612,36.7 L608,36.1 L604,35.0 L600,33.5 L596,33.8 L592,33.6 L588,32.7 L584,32.5 L580,32.1 L576,31.6 L572,31.7 L568,31.9 L564,31.8 L560,31.7 L556,31.6 L552,31.3 L548,31.1 L544,30.9 L540,31.7 L536,32.4 L532,32.9 L528,33.6 L524,34.2 L520,34.1 L516,34.7 L512,35.4 L508,35.4 L504,34.9 L500,34.1 L496,33.2 L492,32.6 L488,32.8 L484,32.9 L480,33.3 L476,34.1 L472,33.9 L468,33.5 L464,33.2 L460,33.3 L456,33.7 L452,33.2 L448,33.1 L444,33.5 L440,33.4 L436,33.2 L432,32.6 L428,32.5 L424,32.6 L420,33.3 L416,33.6 L412,33.9 L408,33.8 L404,34.1 L400,34.7 L396,34.8 L392,34.7 L388,34.5 L384,34.2 L380,34.0 L376,34.0 L372,34.4 L368,34.9 L364,34.6 L360,34.2 L356,33.6 L352,33.6 L348,33.2 L344,32.6 L340,32.9 L336,33.1 L332,33.2 L328,33.0 L324,32.8 L320,33.0 L316,33.3 L312,33.6 L308,33.9 L304,33.9 L300,33.7 L296,33.4 L292,33.2 L288,33.2 L284,33.0 L280,32.6 L276,31.3 L272,31.4 L268,31.5 L264,31.3 L260,30.8 L256,30.3 L252,30.7 L248,30.9 L244,31.0 L240,32.1 L236,32.9 L232,33.0 L228,34.4 L224,35.7 L220,36.1 L216,37.0 L212,38.0 L208,38.0 L204,38.1 L200,38.1 L196,37.5 L192,36.4 L188,34.8 L184,33.9 L180,33.5 L176,32.6 L172,32.8 L168,33.1 L164,32.5 L160,32.3 L156,32.4 L152,31.7 L148,31.3 L144,30.8 L140,31.2 L136,31.3 L132,30.6 L128,31.1 L124,31.6 L120,31.3 L116,31.2 L112,31.0 L108,31.0 L104,30.9 L100,30.7 L96,30.6 L92,30.4 L88,30.2 L84,30.2 L80,30.1 L76,29.7 L72,29.5 L68,29.3 L64,29.1 L60,29.1 L56,29.1 L52,29.4 L48,29.3 L44,28.8 L40,29.6 L36,30.2 L32,30.3 L28,30.7 L24,31.3 L20,32.8 L16,33.3 L12,33.8 L8,33.8 L4,34.2 L0,34.3 Z',
  hdrHalo: 'M0,60 L1440,60 L1440,34.0 L1436,34.1 L1432,33.9 L1428,33.8 L1424,33.9 L1420,34.9 L1416,35.3 L1412,35.6 L1408,35.6 L1404,35.7 L1400,35.4 L1396,35.4 L1392,35.4 L1388,35.6 L1384,35.3 L1380,35.1 L1376,35.2 L1372,35.6 L1368,36.0 L1364,35.2 L1360,35.3 L1356,35.8 L1352,35.8 L1348,35.7 L1344,35.4 L1340,34.2 L1336,33.0 L1332,32.1 L1328,31.7 L1324,31.8 L1320,31.3 L1316,31.9 L1312,32.7 L1308,31.9 L1304,31.9 L1300,32.5 L1296,32.4 L1292,32.2 L1288,31.4 L1284,31.5 L1280,31.5 L1276,31.7 L1272,31.8 L1268,32.2 L1264,32.9 L1260,33.4 L1256,33.7 L1252,34.3 L1248,34.5 L1244,34.0 L1240,34.1 L1236,34.2 L1232,34.4 L1228,33.8 L1224,33.0 L1220,31.8 L1216,31.6 L1212,31.7 L1208,31.8 L1204,31.8 L1200,31.6 L1196,31.9 L1192,32.4 L1188,32.9 L1184,33.8 L1180,34.5 L1176,34.9 L1172,35.4 L1168,35.9 L1164,35.8 L1160,36.3 L1156,36.9 L1152,36.9 L1148,36.8 L1144,36.4 L1140,36.0 L1136,35.4 L1132,35.2 L1128,34.3 L1124,33.6 L1120,33.2 L1116,32.9 L1112,32.5 L1108,32.5 L1104,32.4 L1100,32.5 L1096,32.5 L1092,32.3 L1088,31.8 L1084,31.1 L1080,30.6 L1076,30.4 L1072,30.6 L1068,30.8 L1064,31.0 L1060,30.6 L1056,29.8 L1052,29.7 L1048,29.3 L1044,29.1 L1040,28.8 L1036,28.7 L1032,28.8 L1028,29.2 L1024,29.6 L1020,30.1 L1016,30.8 L1012,31.6 L1008,32.0 L1004,31.9 L1000,31.4 L996,31.6 L992,31.9 L988,32.0 L984,32.0 L980,31.6 L976,31.2 L972,30.2 L968,29.3 L964,28.7 L960,28.7 L956,28.9 L952,28.4 L948,28.4 L944,28.9 L940,29.1 L936,29.6 L932,30.3 L928,31.2 L924,31.9 L920,32.3 L916,33.1 L912,34.1 L908,34.7 L904,35.3 L900,35.8 L896,36.5 L892,37.0 L888,37.5 L884,37.7 L880,37.5 L876,37.2 L872,36.8 L868,36.2 L864,34.9 L860,34.4 L856,34.4 L852,33.5 L848,33.2 L844,33.3 L840,32.7 L836,32.4 L832,33.1 L828,32.8 L824,32.7 L820,33.5 L816,33.6 L812,33.3 L808,32.6 L804,32.5 L800,33.0 L796,33.0 L792,33.5 L788,34.4 L784,35.4 L780,36.3 L776,37.1 L772,37.5 L768,37.7 L764,38.0 L760,37.8 L756,37.1 L752,36.7 L748,35.9 L744,34.7 L740,33.9 L736,33.4 L732,33.5 L728,32.4 L724,31.3 L720,31.2 L716,30.6 L712,30.1 L708,30.6 L704,30.9 L700,31.3 L696,31.6 L692,31.9 L688,32.1 L684,32.0 L680,32.1 L676,33.0 L672,33.3 L668,33.3 L664,33.0 L660,32.8 L656,32.9 L652,32.6 L648,32.9 L644,33.7 L640,33.9 L636,34.0 L632,34.5 L628,34.7 L624,34.7 L620,34.3 L616,33.9 L612,33.3 L608,32.6 L604,31.5 L600,30.1 L596,30.4 L592,30.4 L588,29.8 L584,30.0 L580,30.1 L576,29.9 L572,30.4 L568,31.0 L564,31.1 L560,31.1 L556,30.9 L552,30.4 L548,30.0 L544,29.5 L540,29.9 L536,30.3 L532,30.4 L528,30.8 L524,31.2 L520,31.1 L516,31.8 L512,32.5 L508,32.6 L504,32.2 L500,31.5 L496,30.7 L492,30.3 L488,30.6 L484,30.7 L480,31.1 L476,32.0 L472,32.0 L468,31.7 L464,31.8 L460,32.2 L456,32.9 L452,32.6 L448,32.8 L444,33.3 L440,33.3 L436,33.0 L432,32.1 L428,31.7 L424,31.3 L420,31.4 L416,31.2 L412,31.0 L408,30.5 L404,30.6 L400,31.1 L396,31.2 L392,31.4 L388,31.5 L384,31.5 L380,31.7 L376,32.0 L372,32.8 L368,33.6 L364,33.5 L360,33.1 L356,32.5 L352,32.6 L348,32.3 L344,31.8 L340,32.2 L336,32.6 L332,32.8 L328,32.7 L324,32.5 L320,32.8 L316,33.1 L312,33.3 L308,33.4 L304,33.2 L300,32.9 L296,32.5 L292,32.1 L288,32.0 L284,31.6 L280,31.2 L276,29.9 L272,29.8 L268,29.8 L264,29.3 L260,28.6 L256,27.8 L252,27.9 L248,28.0 L244,27.9 L240,29.0 L236,29.8 L232,30.1 L228,31.7 L224,33.3 L220,34.1 L216,35.3 L212,36.6 L208,36.8 L204,37.1 L200,37.2 L196,36.6 L192,35.4 L188,33.8 L184,32.9 L180,32.5 L176,31.6 L172,31.8 L168,32.1 L164,31.4 L160,31.2 L156,31.2 L152,30.5 L148,29.9 L144,29.2 L140,29.5 L136,29.4 L132,28.4 L128,28.8 L124,29.2 L120,28.9 L116,28.7 L112,28.4 L108,28.3 L104,28.0 L100,27.7 L96,27.5 L92,27.1 L88,26.8 L84,26.7 L80,26.6 L76,26.3 L72,26.2 L68,26.2 L64,26.2 L60,26.4 L56,26.6 L52,27.1 L48,27.3 L44,26.8 L40,27.7 L36,28.3 L32,28.4 L28,28.8 L24,29.4 L20,30.9 L16,31.4 L12,31.9 L8,31.9 L4,32.2 L0,32.4 Z',
};

function tearEdgeSvg(cls, halo, fiber, paper) {
  return `<svg class="${cls}" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path class="tear-halo" d="${halo}" fill="#ffffff" opacity="0.55" /><path class="tear-fiber" d="${fiber}" fill="#ffffff" opacity="0.96" /><path class="tear-paper-fill" d="${paper}" fill="#faf8f5" stroke="#f0ece3" stroke-width="0.6" /></svg>`;
}

const TEAR_FILTER_DEFS = `<svg class="tear-filter-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="paper-pulp-deckle" x="-2%" y="-20%" width="104%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.045 0.18" numOctaves="4" seed="14" result="pulpNoise" /><feDisplacementMap in="SourceGraphic" in2="pulpNoise" scale="5.5" xChannelSelector="R" yChannelSelector="G" result="displacedPulp" /><feGaussianBlur in="displacedPulp" stdDeviation="0.35" /></filter><filter id="paper-sheet-grain" x="-2%" y="-20%" width="104%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.06 0.22" numOctaves="3" seed="7" result="edgeNoise" /><feDisplacementMap in="SourceGraphic" in2="edgeNoise" scale="2.6" xChannelSelector="R" yChannelSelector="G" /></filter><filter id="badge-pulp-filter" x="-12%" y="-12%" width="124%" height="124%"><feTurbulence type="fractalNoise" baseFrequency="0.055 0.065" numOctaves="4" seed="23" result="badgeNoise" /><feDisplacementMap in="SourceGraphic" in2="badgeNoise" scale="5.2" xChannelSelector="R" yChannelSelector="G" result="displacedBadge" /><feGaussianBlur in="displacedBadge" stdDeviation="0.3" /></filter><filter id="badge-cardstock-filter" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.075 0.085" numOctaves="3" seed="11" result="cardNoise" /><feDisplacementMap in="SourceGraphic" in2="cardNoise" scale="3.4" xChannelSelector="R" yChannelSelector="G" /></filter><filter id="terracotta-paper-texture" x="0%" y="0%" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="5" result="fineGrain" /><feColorMatrix type="matrix" values="0 0 0 0 0.72 0 0 0 0 0.28 0 0 0 0 0.14 0 0 0 0.09 0" in="fineGrain" result="tintedGrain" /><feBlend mode="multiply" in="SourceGraphic" in2="tintedGrain" /></filter><radialGradient id="terracotta-grad" cx="48%" cy="42%" r="65%"><stop offset="0%" stop-color="#c6532d" /><stop offset="65%" stop-color="#b64622" /><stop offset="100%" stop-color="#9e3919" /></radialGradient><radialGradient id="brass-pin-head" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#fff3b8" /><stop offset="28%" stop-color="#e2be62" /><stop offset="68%" stop-color="#b3882c" /><stop offset="100%" stop-color="#735110" /></radialGradient><linearGradient id="pin-needle-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#523a18" /><stop offset="50%" stop-color="#c9b286" /><stop offset="100%" stop-color="#3a280e" /></linearGradient></defs></svg>`;

/* SVG filter ids must be unique per page, so the defs go out with whichever torn block renders first. */
function takeTearDefs() {
  if (tearDefsEmitted) return '';
  tearDefsEmitted = true;
  return TEAR_FILTER_DEFS;
}

/* Torn terracotta "PRINCIPLE N" badge, pre-rendered from the principle tear-page template (patch seed 1170). */
const BADGE_PATHS = {
  outer: 'M16.0,10.0 L20.0,9.9 L24.0,9.8 L28.0,10.2 L32.0,10.8 L36.0,11.3 L40.0,11.4 L44.0,11.1 L48.0,9.9 L52.0,7.5 L56.0,6.6 L60.0,7.1 L64.0,7.7 L68.0,6.9 L72.0,6.6 L76.0,7.9 L80.0,8.0 L84.0,9.7 L88.0,11.2 L92.0,11.8 L96.0,10.7 L100.0,9.4 L104.0,8.7 L108.0,8.8 L112.0,8.8 L116.0,7.7 L120.0,8.3 L124.0,7.7 L128.0,8.8 L132.0,9.4 L136.0,10.0 L140.0,10.0 L144.0,9.8 L148.0,9.1 L152.0,7.1 L156.0,6.3 L160.0,5.7 L164.0,5.5 L168.0,5.0 L172.0,4.9 L176.0,5.9 L180.0,8.1 L184.0,9.1 L188.0,9.7 L192.0,10.3 L196.0,10.7 L200.0,11.8 L204.0,11.1 L208.0,10.6 L212.0,9.9 L216.0,10.0 L220.0,8.8 L224.0,7.7 L228.0,7.9 L232.0,7.5 L236.0,6.7 L240.0,7.2 L244.0,7.9 L248.0,8.6 L252.0,9.5 L256.0,9.5 L260.0,8.9 L264.0,7.9 L274.9,19.0 L275.6,23.0 L275.9,27.0 L276.4,31.0 L276.8,35.0 L276.4,39.0 L276.8,43.0 L276.5,47.0 L275.7,51.0 L274.5,55.0 L273.8,59.0 L273.6,63.0 L273.5,67.0 L273.4,71.0 L273.8,75.0 L274.1,79.0 L274.8,83.0 L275.1,87.0 L274.5,91.0 L273.6,95.0 L272.6,99.0 L271.4,103.0 L269.9,107.0 L269.2,111.0 L264.0,124.4 L260.0,124.2 L256.0,124.6 L252.0,125.6 L248.0,127.3 L244.0,128.3 L240.0,127.3 L236.0,125.5 L232.0,123.9 L228.0,122.2 L224.0,121.5 L220.0,122.4 L216.0,121.5 L212.0,120.1 L208.0,118.5 L204.0,116.4 L200.0,116.4 L196.0,117.3 L192.0,118.3 L188.0,120.6 L184.0,123.1 L180.0,123.5 L176.0,123.0 L172.0,121.7 L168.0,120.5 L164.0,120.1 L160.0,118.6 L156.0,118.1 L152.0,119.0 L148.0,121.2 L144.0,122.6 L140.0,124.4 L136.0,125.8 L132.0,124.8 L128.0,124.0 L124.0,124.5 L120.0,125.1 L116.0,125.1 L112.0,124.5 L108.0,124.0 L104.0,122.3 L100.0,119.9 L96.0,120.6 L92.0,120.7 L88.0,120.1 L84.0,120.7 L80.0,121.9 L76.0,122.4 L72.0,123.6 L68.0,124.5 L64.0,123.4 L60.0,123.6 L56.0,123.9 L52.0,123.9 L48.0,124.0 L44.0,124.9 L40.0,124.6 L36.0,124.5 L32.0,123.4 L28.0,122.3 L24.0,121.5 L20.0,120.7 L16.0,121.5 L0.3,111.0 L0.7,107.0 L3.2,103.0 L4.1,99.0 L4.2,95.0 L4.4,91.0 L3.9,87.0 L2.6,83.0 L2.3,79.0 L3.0,75.0 L2.0,71.0 L0.9,67.0 L1.3,63.0 L3.6,59.0 L6.5,55.0 L7.5,51.0 L7.4,47.0 L6.9,43.0 L5.1,39.0 L3.9,35.0 L3.4,31.0 L2.6,27.0 L1.4,23.0 L1.9,19.0 Z',
  inner: 'M16.0,12.2 L20.0,12.1 L24.0,12.0 L28.0,12.4 L32.0,13.0 L36.0,13.5 L40.0,13.6 L44.0,13.3 L48.0,12.1 L52.0,9.7 L56.0,8.8 L60.0,9.3 L64.0,9.9 L68.0,9.1 L72.0,8.8 L76.0,10.1 L80.0,10.2 L84.0,11.9 L88.0,13.4 L92.0,14.0 L96.0,12.9 L100.0,11.6 L104.0,10.9 L108.0,11.0 L112.0,11.0 L116.0,9.9 L120.0,10.5 L124.0,9.9 L128.0,11.0 L132.0,11.6 L136.0,12.2 L140.0,12.2 L144.0,12.0 L148.0,11.3 L152.0,9.3 L156.0,8.5 L160.0,7.9 L164.0,7.7 L168.0,7.2 L172.0,7.1 L176.0,8.1 L180.0,10.3 L184.0,11.3 L188.0,11.9 L192.0,12.5 L196.0,12.9 L200.0,14.0 L204.0,13.3 L208.0,12.8 L212.0,12.1 L216.0,12.2 L220.0,11.0 L224.0,9.9 L228.0,10.1 L232.0,9.7 L236.0,8.9 L240.0,9.4 L244.0,10.1 L248.0,10.8 L252.0,11.7 L256.0,11.7 L260.0,11.1 L264.0,10.1 L272.7,19.0 L273.4,23.0 L273.7,27.0 L274.2,31.0 L274.6,35.0 L274.2,39.0 L274.6,43.0 L274.3,47.0 L273.5,51.0 L272.3,55.0 L271.6,59.0 L271.4,63.0 L271.3,67.0 L271.2,71.0 L271.6,75.0 L271.9,79.0 L272.6,83.0 L272.9,87.0 L272.3,91.0 L271.4,95.0 L270.4,99.0 L269.2,103.0 L267.7,107.0 L267.0,111.0 L264.0,121.8 L260.0,121.6 L256.0,122.0 L252.0,123.0 L248.0,124.7 L244.0,125.7 L240.0,124.7 L236.0,122.9 L232.0,121.3 L228.0,119.6 L224.0,118.9 L220.0,119.8 L216.0,118.9 L212.0,117.5 L208.0,115.9 L204.0,113.8 L200.0,113.8 L196.0,114.7 L192.0,115.7 L188.0,118.0 L184.0,120.5 L180.0,120.9 L176.0,120.4 L172.0,119.1 L168.0,117.9 L164.0,117.5 L160.0,116.0 L156.0,115.5 L152.0,116.4 L148.0,118.6 L144.0,120.0 L140.0,121.8 L136.0,123.2 L132.0,122.2 L128.0,121.4 L124.0,121.9 L120.0,122.5 L116.0,122.5 L112.0,121.9 L108.0,121.4 L104.0,119.7 L100.0,117.3 L96.0,118.0 L92.0,118.1 L88.0,117.5 L84.0,118.1 L80.0,119.3 L76.0,119.8 L72.0,121.0 L68.0,121.9 L64.0,120.8 L60.0,121.0 L56.0,121.3 L52.0,121.3 L48.0,121.4 L44.0,122.3 L40.0,122.0 L36.0,121.9 L32.0,120.8 L28.0,119.7 L24.0,118.9 L20.0,118.1 L16.0,118.9 L2.8,111.0 L3.2,107.0 L5.7,103.0 L6.6,99.0 L6.7,95.0 L6.9,91.0 L6.4,87.0 L5.1,83.0 L4.8,79.0 L5.5,75.0 L4.5,71.0 L3.4,67.0 L3.8,63.0 L6.1,59.0 L9.0,55.0 L10.0,51.0 L9.9,47.0 L9.4,43.0 L7.6,39.0 L6.4,35.0 L5.9,31.0 L5.1,27.0 L3.9,23.0 L4.4,19.0 Z',
  bevel: 'M16.0,19.3 L20.0,19.9 L24.0,19.9 L28.0,19.9 L32.0,19.8 L36.0,19.6 L40.0,19.2 L44.0,18.7 L48.0,17.6 L52.0,15.5 L56.0,15.1 L60.0,16.0 L64.0,16.9 L68.0,16.2 L72.0,15.6 L76.0,16.4 L80.0,16.0 L84.0,17.3 L88.0,18.5 L92.0,19.1 L96.0,18.1 L100.0,16.9 L104.0,16.3 L108.0,16.5 L112.0,16.5 L116.0,15.6 L120.0,16.5 L124.0,16.3 L128.0,17.8 L132.0,18.6 L136.0,19.2 L140.0,19.4 L144.0,19.4 L148.0,18.9 L152.0,17.2 L156.0,16.4 L160.0,15.6 L164.0,15.2 L168.0,14.3 L172.0,13.9 L176.0,14.7 L180.0,16.9 L184.0,17.8 L188.0,18.2 L192.0,18.7 L196.0,18.9 L200.0,20.0 L204.0,19.3 L208.0,18.7 L212.0,18.0 L216.0,18.0 L220.0,16.8 L224.0,15.7 L228.0,15.9 L232.0,15.5 L236.0,14.9 L240.0,15.5 L244.0,16.2 L248.0,16.8 L252.0,17.6 L256.0,17.5 L260.0,16.7 L264.0,15.7 L268.5,19.0 L269.2,23.0 L269.2,27.0 L269.3,31.0 L269.0,35.0 L268.0,39.0 L268.1,43.0 L267.9,47.0 L267.9,51.0 L267.6,55.0 L268.0,59.0 L268.4,63.0 L268.5,67.0 L268.2,71.0 L268.2,75.0 L267.9,79.0 L268.0,83.0 L268.0,87.0 L267.3,91.0 L266.9,95.0 L266.5,99.0 L266.0,103.0 L264.9,107.0 L264.4,111.0 L264.0,116.8 L260.0,115.8 L256.0,114.8 L252.0,114.2 L248.0,114.5 L244.0,115.1 L240.0,114.6 L236.0,113.9 L232.0,113.5 L228.0,112.8 L224.0,112.8 L220.0,113.8 L216.0,113.4 L212.0,112.5 L208.0,111.6 L204.0,109.8 L200.0,110.0 L196.0,110.5 L192.0,110.5 L188.0,111.1 L184.0,111.9 L180.0,111.1 L176.0,110.4 L172.0,109.9 L168.0,109.9 L164.0,110.8 L160.0,110.3 L156.0,110.2 L152.0,110.8 L148.0,112.0 L144.0,111.9 L140.0,112.2 L136.0,112.4 L132.0,111.2 L128.0,110.6 L124.0,111.3 L120.0,112.3 L116.0,112.5 L112.0,112.1 L108.0,111.7 L104.0,110.9 L100.0,109.5 L96.0,111.1 L92.0,111.9 L88.0,111.5 L84.0,111.5 L80.0,111.5 L76.0,110.6 L72.0,110.4 L68.0,110.5 L64.0,109.3 L60.0,109.8 L56.0,110.5 L52.0,110.8 L48.0,111.2 L44.0,112.2 L40.0,112.5 L36.0,113.6 L32.0,113.9 L28.0,114.0 L24.0,114.0 L20.0,113.1 L16.0,113.7 L10.9,111.0 L10.9,107.0 L12.6,103.0 L12.5,99.0 L11.8,95.0 L11.5,91.0 L11.0,87.0 L10.3,83.0 L11.1,79.0 L13.0,75.0 L13.1,71.0 L12.5,67.0 L12.3,63.0 L13.4,59.0 L14.7,55.0 L14.4,51.0 L13.6,47.0 L13.0,43.0 L11.8,39.0 L11.8,35.0 L13.0,31.0 L13.7,27.0 L13.4,23.0 L13.5,19.0 Z',
  body: 'M16.0,20.8 L20.0,21.4 L24.0,21.4 L28.0,21.4 L32.0,21.3 L36.0,21.1 L40.0,20.7 L44.0,20.2 L48.0,19.1 L52.0,17.0 L56.0,16.6 L60.0,17.5 L64.0,18.4 L68.0,17.7 L72.0,17.1 L76.0,17.9 L80.0,17.5 L84.0,18.8 L88.0,20.0 L92.0,20.6 L96.0,19.6 L100.0,18.4 L104.0,17.8 L108.0,18.0 L112.0,18.0 L116.0,17.1 L120.0,18.0 L124.0,17.8 L128.0,19.3 L132.0,20.1 L136.0,20.7 L140.0,20.9 L144.0,20.9 L148.0,20.4 L152.0,18.7 L156.0,17.9 L160.0,17.1 L164.0,16.7 L168.0,15.8 L172.0,15.4 L176.0,16.2 L180.0,18.4 L184.0,19.3 L188.0,19.7 L192.0,20.2 L196.0,20.4 L200.0,21.5 L204.0,20.8 L208.0,20.2 L212.0,19.5 L216.0,19.5 L220.0,18.3 L224.0,17.2 L228.0,17.4 L232.0,17.0 L236.0,16.4 L240.0,17.0 L244.0,17.7 L248.0,18.3 L252.0,19.1 L256.0,19.0 L260.0,18.2 L264.0,17.2 L267.0,19.0 L267.7,23.0 L267.7,27.0 L267.8,31.0 L267.5,35.0 L266.5,39.0 L266.6,43.0 L266.4,47.0 L266.4,51.0 L266.1,55.0 L266.5,59.0 L266.9,63.0 L267.0,67.0 L266.7,71.0 L266.7,75.0 L266.4,79.0 L266.5,83.0 L266.5,87.0 L265.8,91.0 L265.4,95.0 L265.0,99.0 L264.5,103.0 L263.4,107.0 L262.9,111.0 L264.0,115.0 L260.0,114.0 L256.0,113.0 L252.0,112.4 L248.0,112.7 L244.0,113.3 L240.0,112.8 L236.0,112.1 L232.0,111.7 L228.0,111.0 L224.0,111.0 L220.0,112.0 L216.0,111.6 L212.0,110.7 L208.0,109.8 L204.0,108.0 L200.0,108.2 L196.0,108.7 L192.0,108.7 L188.0,109.3 L184.0,110.1 L180.0,109.3 L176.0,108.6 L172.0,108.1 L168.0,108.1 L164.0,109.0 L160.0,108.5 L156.0,108.4 L152.0,109.0 L148.0,110.2 L144.0,110.1 L140.0,110.4 L136.0,110.6 L132.0,109.4 L128.0,108.8 L124.0,109.5 L120.0,110.5 L116.0,110.7 L112.0,110.3 L108.0,109.9 L104.0,109.1 L100.0,107.7 L96.0,109.3 L92.0,110.1 L88.0,109.7 L84.0,109.7 L80.0,109.7 L76.0,108.8 L72.0,108.6 L68.0,108.7 L64.0,107.5 L60.0,108.0 L56.0,108.7 L52.0,109.0 L48.0,109.4 L44.0,110.4 L40.0,110.7 L36.0,111.8 L32.0,112.1 L28.0,112.2 L24.0,112.2 L20.0,111.3 L16.0,111.9 L12.5,111.0 L12.5,107.0 L14.2,103.0 L14.1,99.0 L13.4,95.0 L13.1,91.0 L12.6,87.0 L11.9,83.0 L12.7,79.0 L14.6,75.0 L14.7,71.0 L14.1,67.0 L13.9,63.0 L15.0,59.0 L16.3,55.0 L16.0,51.0 L15.2,47.0 L14.6,43.0 L13.4,39.0 L13.4,35.0 L14.6,31.0 L15.3,27.0 L15.0,23.0 L15.1,19.0 Z',
};

function renderPrincipleBadge(label) {
  const num = (label.match(/\d+/) || [''])[0];
  const b = BADGE_PATHS;
  const pin = `<g transform="translate(140, 10.5)"><ellipse cx="3.5" cy="12" rx="8.5" ry="5.5" fill="rgba(45, 14, 4, 0.36)" transform="rotate(-12 3.5 12)" /><path d="M 0,4 L 4,19 L 1,19 Z" fill="rgba(40, 12, 3, 0.42)" /><circle cx="0" cy="17.5" r="1.9" fill="#431507" /><path d="M -1.3,5 L 1.3,5 L 0.6,17.5 L -0.6,17.5 Z" fill="url(#pin-needle-grad)" /><circle cx="0" cy="0" r="9.2" fill="#6e4c0e" /><circle cx="0" cy="-0.4" r="8.5" fill="url(#brass-pin-head)" stroke="#8c6518" stroke-width="0.5" /><ellipse cx="-2.8" cy="-3.2" rx="3.2" ry="2" fill="rgba(255, 252, 235, 0.65)" transform="rotate(-28 -2.8 -3.2)" /></g>`;
  const svg = `<svg class="principle-badge-svg" viewBox="0 0 280 130" aria-hidden="true" focusable="false"><path class="pb-pulp-outer" fill="#dcd8d0" opacity="0.85" d="${b.outer}" /><path class="pb-pulp-inner" fill="#f5f3ee" opacity="0.98" d="${b.inner}" /><path class="pb-pulp-bevel" fill="#e4dfd6" opacity="0.9" d="${b.bevel}" /><path class="pb-body" fill="url(#terracotta-grad)" stroke="#a33d1c" stroke-width="0.6" d="${b.body}" /><path class="pb-grain" fill="url(#terracotta-grad)" opacity="0.35" d="${b.body}" />${pin}</svg>`;
  return `<span class="principle-badge" role="img" aria-label="${esc(label)}">${takeTearDefs()}${svg}<span class="principle-badge-text" aria-hidden="true"><span class="pb-word">PRINCIPLE</span><span class="pb-num">${esc(num)}</span></span></span>`;
}

function renderTearHeader(openerHtml) {
  const p = TEAR_PATHS;
  return `<div class="tear-header-block full-bleed-tear">${takeTearDefs()}<div class="blueprint-top-header"><div class="tear-header-inner">${openerHtml}</div>${tearEdgeSvg('tear-bottom-svg', p.hdrHalo, p.hdrFiber, p.hdrPaper)}</div></div>`;
}

function renderTearBlueprintSeparator(titleHtml = 'Part 2: Project Blueprint', pill = 'Second Part Starts Here') {
  const p = TEAR_PATHS;
  const deco = `<div class="blueprint-deco-layer" aria-hidden="true"><div class="blueprint-deco-right"><div class="blueprint-text"><div>BLUEPRINT LAYER</div><div class="blueprint-sub">REV 2.4 · ARCHITECTURE</div></div><svg class="blueprint-compass" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="18" cy="18" r="14" stroke-dasharray="3 3"/><line x1="18" y1="0" x2="18" y2="36"/><line x1="0" y1="18" x2="36" y2="18"/></svg></div></div>`;
  const content = `<div class="tear-content-wrap"><div class="tear-main"><div class="tear-pill"><span class="tear-pill-dot"></span>${pill}</div><h3 class="tear-title">${titleHtml}</h3></div></div>`;
  return `<div class="tear-separator-block full-bleed-tear">${takeTearDefs()}<div class="blueprint-exposed-surface">${tearEdgeSvg('tear-top-svg', p.topHalo, p.topFiber, p.topPaper)}${deco}${content}${tearEdgeSvg('tear-bottom-svg', p.botHalo, p.botFiber, p.botPaper)}</div></div>`;
}

const PART_ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];

/* ---------------------------------------------------------------- Block Parser & Renderer */

function parseAndRender(md, theme = 'book') {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  let lastH3 = '';
  let principleCount = 0;
  let partCount = 1;
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
    // Opt-in marker: draw the next heading as a versus title
    if (line.trim() === '<!-- vs -->') {
      const next = lines[i + 1] || '';
      const hm = next.match(/^(#{2,3})\s+(.*)$/);
      const vs = hm && theme !== 'old' ? renderVersusTitle(hm[2], hm[1].length) : null;
      if (vs) {
        if (hm[1].length === 3) lastH3 = hm[2];
        out.push(vs);
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    // Tagged titles: "## SECTION | Title", "## PRINCIPLE | Title", "## VS | A vs. B: explanation" (VS also on ###). The tag never reaches the page.
    const tm = line.match(/^(#{2,3})\s+(SECTION|PRINCIPLE|VS)\s*\|\s*(.*)$/);
    if (tm && (tm[2] === 'VS' || tm[1].length === 2)) {
      const level = tm[1].length;
      const rest = tm[3].trim();
      if (level === 3) lastH3 = rest;
      if (theme === 'old') {
        out.push(`<h${level}>${inline(rest)}</h${level}>`);
      } else if (tm[2] === 'SECTION') {
        partCount++;
        const pill = `${PART_ORDINALS[partCount - 1] || 'Next'} Part Starts Here`;
        out.push(renderTearBlueprintSeparator(`Part ${partCount}: ${inline(rest)}`, pill));
      } else if (tm[2] === 'PRINCIPLE') {
        principleCount++;
        out.push(`<h2 class="principle-h2">${renderPrincipleBadge(`Principle ${principleCount}`)}<span class="h2-title">${inline(rest)}</span></h2>`);
      } else {
        const vs = renderVersusTitle(rest, level);
        out.push(vs || (level === 2 ? `<h2><span class="section-kicker kicker-overview">Overview</span><span class="h2-title">${inline(rest)}</span></h2>` : `<h3 class="leading-q">${inline(rest)}</h3>`));
      }
      i++;
      continue;
    }

    // H1
    if ((m = line.match(/^#\s+(.*)$/))) {
      const numMatch = m[1].match(/^Lecture\s+(\d+):\s*(.*)$/);
      const lecNum = numMatch ? String(numMatch[1]).padStart(2, '0') : '04';
      const text = numMatch ? numMatch[2] : m[1];
      if (theme === 'old') {
        out.push(`<div class="chapter-meta">Lecture ${lecNum} · React 19 Foundations · River Version (${VERSION})</div>`);
        out.push(`<h1>${inline(text)}</h1>`);
      } else {
        out.push(
          renderTearHeader(`<header class="book-opener"><div class="book-opener-num">${lecNum}</div><div class="book-opener-body"><div class="chapter-meta">Lecture ${lecNum} · React 19 Foundations</div><h1>${inline(
            text
          )}</h1></div></header>`)
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
        const vsHead = !pm && splitOutsideCode(raw, ': ');
        const autoVs = vsHead && splitOutsideCode(vsHead[0], ' vs. ') ? renderVersusTitle(raw, 2) : null;
        if (autoVs) {
          out.push(autoVs);
        } else if (pm) {
          const titleClean = pm[3].replace(/^—\s*/, '');
          out.push(
            `<h2 class="principle-h2">${renderPrincipleBadge(pm[2])}<span class="h2-title">${inline(
              titleClean
            )}</span></h2>`
          );
        } else {
          const isSummary = /^Summary\b/i.test(raw);
          const isBlueprint = /^Project Blueprint\b/i.test(raw);
          const [kicker, kickerCls] = /^For the Interview\b/i.test(raw)
            ? ['Interview Prep', 'kicker-interview']
            : /^(Putting All|All \w+ Principles Together)\b/i.test(raw)
            ? ['Synthesis', 'kicker-synthesis']
            : isSummary
            ? ['Summary', 'kicker-summary']
            : isBlueprint
            ? ['Project Blueprint', 'kicker-blueprint']
            : ['Overview', 'kicker-overview'];
          const titleText = isSummary
            ? raw.replace(/^Summary:\s*/i, '')
            : isBlueprint
            ? raw.replace(/^Project Blueprint:\s*/i, '')
            : raw;
          if (isBlueprint) out.push(renderTearBlueprintSeparator());
          out.push(
            `<h2><span class="section-kicker ${kickerCls}">${kicker}</span><span class="h2-title">${inline(titleText)}</span></h2>`
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
          colDepth++;
          const colHTML = parseAndRender(body.join('\n'), theme);
          colDepth--;
          cols.push(`<div class="col${tone}${flow}">${head}<div class="col-body">${colHTML}</div></div>`);
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
      const leadMatch = inner.length === 1 && inner[0].trim().match(/^\*\*(.+)\*\*$/);
      if (leadMatch && theme !== 'old' && /^<h[23] class="vs-title/.test(out[out.length - 1] || '')) {
        out.push(`<aside class="lead-sentence"><p>${inline(leadMatch[1])}</p></aside>`);
        continue;
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
      } else if (/^\[!(TAKEAWAY|REMINDER|DEFINITION|TERM|NOTE|TIP|WARNING)\]/i.test(inner[0])) {
        const typeMatch = inner[0].match(/^\[!([a-zA-Z]+)\]/);
        const type = typeMatch ? typeMatch[1].toUpperCase() : 'NOTE';
        const typeClass = type.toLowerCase();
        const label = type === 'DEFINITION' || type === 'TERM' ? 'KEY DEFINITION' : type;
        const paras = inner
          .slice(1)
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => `<p>${inline(l)}</p>`)
          .join('');
        out.push(`<div class="callout-box callout-${typeClass}"><div class="callout-box-title">${label}</div>${paras}</div>`);
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
      while (i < lines.length && !lines[i].trim()) i++;
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
      const olAttr = theme !== 'old' && /Follow-Up Questions/i.test(lastH3) ? ' class="qa-list"' : '';
      out.push(`<ol${olAttr}>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</ol>`);
      continue;
    }

    // Unordered list
    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && (/^-\s+/.test(lines[i]) || /^\s+-\s+/.test(lines[i]))) {
        if (/^-\s+/.test(lines[i])) {
          items.push({ text: lines[i++].replace(/^-\s+/, ''), sub: [] });
        } else {
          const subText = lines[i++].replace(/^\s+-\s+/, '');
          if (items.length) items[items.length - 1].sub.push(subText);
        }
      }
      const lis = items
        .map((it) => {
          const subHtml = it.sub.length
            ? `<ul>${it.sub.map((s) => `<li>${inline(s)}</li>`).join('')}</ul>`
            : '';
          return `<li>${inline(it.text)}${subHtml}</li>`;
        })
        .join('');
      out.push(`<ul>${lis}</ul>`);
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
    <p class="principle-rule"><strong class="principle-label">Summary</strong>: ${inline(rule)}</p>
    <p class="principle-why"><strong class="principle-label">Description</strong>: ${inline(why)}</p>
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
const BOOK_CSS = readFileSync(BOOK_CSS_PATH, 'utf8');

/* ---------------------------------------------------------------- Main Build */

function auditMarkdownProse(mdText) {
  const lines = mdText.split('\n');
  let inFence = false;
  let inInterviewSection = false;
  let inCallout = false;
  const parenViolations = [];
  const longSentenceViolations = [];
  const codeInProseViolations = [];
  const orphanHighlightViolations = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();
    const isQuoted = trimmed.startsWith('>');
    const unquoted = trimmed.replace(/^>\s?/, '');
    if (isQuoted) {
      if (unquoted.startsWith('[!')) inCallout = true;
    } else {
      inCallout = false;
    }
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

    // 1. Check for parentheses outside code/mock fences (exempting the verbatim bank question header and callouts)
    const isVerbatimQuestion =
      unquoted.startsWith('INTERVIEW QUESTION |') || unquoted.startsWith('**The Interview Question:**') ||
      /^\*\(.*\?\)\*$/.test(unquoted);
    const lineForParenCheck = inFence
      ? (inFence === 'files' ? line.replace(/`[^`]+`/g, '') : line)
      : line.replace(/`[^`]+`/g, '').replace(/\([^()]*\b(?:Lesson|Lecture)s? \d+[^()]*\)/g, '');
    if (!isVerbatimQuestion && !inCallout && /[()]/.test(lineForParenCheck)) {
      parenViolations.push(`Line ${idx + 1}: ${line}`);
    }

    // 2. Check narrative prose sentences for River flow:
    //    - Excessive sentence length (> 28 words, counting words inside backticks too)
    //    - Code-in-prose overload (> 2 backticked spans in one sentence, or a 4+ word code statement inside prose, or slash file paths inside prose)
    if (
      isVerbatimQuestion ||
      inCallout ||
      inFence === 'tree' ||
      inFence === 'files' ||
      !unquoted ||
      unquoted.startsWith('#') ||
      unquoted.startsWith('|') ||
      unquoted.startsWith('---') ||
      unquoted.startsWith(':::') ||
      unquoted.startsWith('[!')
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
          if (spanWords.length >= 6) {
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

writeFileSync(join(HTML_DIR, 'river-book-theme.css'), BOOK_CSS);

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
    console.error(`River Version (${VERSION}) lecture not found: ${mdPath}`);
    process.exit(1);
  }
  const md = readFileSync(mdPath, 'utf8');
  const titleMatch = md.match(/^#\s+(.*)$/m);
  const pageTitle = titleMatch ? titleMatch[1] : `Lecture ${name}`;
  const { parenViolations, longSentenceViolations, codeInProseViolations, orphanHighlightViolations } =
    auditMarkdownProse(md);

  // theme1, the book theme -> theme1/{NN}.html
  figCounter = 0;
  tearDefsEmitted = false;
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

  console.log(
    `[River ${VERSION}] Built 01-03-md-lectures-HTML/${VERSION}/${THEME}/${name}.html from 01-02-md-LECTURES/${VERSION}/${file} (${bookFigs} box-to-boxes figures).`
  );
  console.log(
    `[River ${VERSION}] River Prose Surveillance (${file}): ${parenViolations.length} parenthesis violations, ${codeInProseViolations.length} code-in-prose hints, ${orphanHighlightViolations.length} orphan-highlight violations, ${longSentenceViolations.length} long-sentence hints.`
  );
  if (parenViolations.length) {
    console.warn('Parenthesis violations:\n' + parenViolations.join('\n'));
  }
  if (codeInProseViolations.length) {
    console.warn('Code-in-prose hints (change a sentence only if a tired reader would stumble on it):\n' + codeInProseViolations.join('\n'));
  }
  if (orphanHighlightViolations.length) {
    console.warn('Orphan ~token~ or comment-only violations in code blocks:\n' + orphanHighlightViolations.join('\n'));
  }
  if (longSentenceViolations.length) {
    console.warn('Long sentence hints (a long sentence that reads in one breath stays):\n' + longSentenceViolations.join('\n'));
  }

  if (!noPdf) {
    const pdfPath = join(PDF_DIR, `${name}.pdf`);
    try {
      execFileSync('prince', [htmlPath, '-o', pdfPath], { stdio: ['ignore', 'ignore', 'inherit'] });
      console.log(`[River ${VERSION}] Built 01-04-md-lectures-PDF/${VERSION}/${THEME}/${name}.pdf`);
    } catch {
      // Prince is optional if not installed on the current machine
    }
  }
}
