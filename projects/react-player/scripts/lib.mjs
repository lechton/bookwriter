import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { chapterBlocks } from '../src/lib/blocks.js';
import { parseAudioMd, unknownTags } from '../src/lib/audio-md.js';

export const PROJECT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const WORKSPACE = join(PROJECT, '..', '..');
export const CHAPTERS_DIR = join(PROJECT, '..', 'react-10', '01-03-md-lectures-HTML', 'v1');

export const pad = (n) => String(n).padStart(2, '0');
export const audioMdPath = (num) => join(PROJECT, 'audio', `${pad(num)}-audio.md`);

export function loadBlocks(num) {
  const file = join(CHAPTERS_DIR, `${pad(num)}.html`);
  if (!existsSync(file)) throw new Error(`No chapter file ${file}`);
  const { document } = parseHTML(readFileSync(file, 'utf8'));
  const container = document.querySelector('.container');
  if (!container) throw new Error(`${file} has no .container`);
  return chapterBlocks(container);
}

export function loadAudio(num, file = audioMdPath(num)) {
  if (!existsSync(file)) throw new Error(`No audio text ${file}`);
  return parseAudioMd(readFileSync(file, 'utf8'));
}

/** Problems that would make the audio text drift from the chapter HTML. */
export function checkAudio(num, file) {
  const blocks = loadBlocks(num);
  const byId = new Map(blocks.map((b, i) => [b.id, { ...b, index: i }]));
  const { entries } = loadAudio(num, file);
  const errors = [];
  const seen = new Set();
  let last = -1;
  for (const e of entries) {
    const label = e.ids.join(' ');
    if (!e.spoken) errors.push(`${label}: no spoken text`);
    for (const t of unknownTags(e.spoken)) errors.push(`${label}: tag <${t}> is not one the voice accepts`);
    for (const id of e.ids) {
      const b = byId.get(id);
      if (!b) { errors.push(`${id}: no such block in ${pad(num)}.html`); continue; }
      if (seen.has(id)) errors.push(`${id}: voiced twice`);
      seen.add(id);
      if (b.index <= last) errors.push(`${id}: out of reading order`);
      last = b.index;
    }
    const first = byId.get(e.ids[0]);
    if (first && first.src !== e.src) errors.push(`${e.ids[0]}: src "${e.src}" no longer matches the HTML, which now starts "${first.src}"`);
  }
  return { blocks, entries, errors };
}

/** Machine paths come from the workspace config, never from tracked files. */
export function config(key) {
  const read = (name) => {
    const p = join(WORKSPACE, name);
    return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
  };
  const get = (o) => key.split('.').reduce((v, k) => (v ? v[k] : undefined), o);
  const value = get(read('bookwriter-project.local.json')) ?? get(read('bookwriter-project.json'));
  if (!value || String(value).startsWith('<')) {
    throw new Error(`Config key ${key} is not set; add it to bookwriter-project.local.json`);
  }
  return value;
}
