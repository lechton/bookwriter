#!/usr/bin/env node
// node scripts/blocks.mjs list 21              every block id of a chapter with its src fingerprint
// node scripts/blocks.mjs skeleton 21 [count|from-to]  a starting audio text for the first count blocks, or for
//                                              blocks from..to (1-based, inclusive); printed, never written
// node scripts/blocks.mjs check 21 [file]      the audio text (or another file in its format) against the chapter HTML; exit 1 on drift
import { resolve } from 'node:path';
import { loadBlocks, checkAudio, pad } from './lib.mjs';

const [cmd, num, count] = process.argv.slice(2);
if (!cmd || !num) {
  console.error('usage: node scripts/blocks.mjs list|skeleton|check <chapter> [count]');
  process.exit(2);
}

if (cmd === 'list') {
  loadBlocks(num).forEach((b, i) => console.log(`${String(i + 1).padStart(4)}  ${b.id.padEnd(14)} ${b.text.slice(0, 90)}`));
} else if (cmd === 'skeleton') {
  const all = loadBlocks(num);
  const range = String(count || '').match(/^(\d+)-(\d+)$/);
  const blocks = range ? all.slice(Number(range[1]) - 1, Number(range[2])) : all.slice(0, count ? Number(count) : undefined);
  if (!range) console.log(`---\nchapter: ${pad(num)}\nvoice: Enzo\nstyle: breath\n---\n`);
  for (const b of blocks) console.log(`<!-- block ${b.id} | src: "${b.src}" -->\n${b.text}\n`);
} else if (cmd === 'check') {
  const { entries, errors } = checkAudio(num, count ? resolve(count) : undefined);
  const voiced = entries.reduce((n, e) => n + e.ids.length, 0);
  if (errors.length) {
    console.log(`${pad(num)}-audio.md: ${errors.length} problem(s)`);
    errors.forEach((e) => console.log('  ' + e));
    process.exit(1);
  }
  console.log(`${pad(num)}-audio.md: ${entries.length} entries, ${voiced} blocks voiced, in sync with ${pad(num)}.html`);
} else {
  console.error(`unknown command ${cmd}`);
  process.exit(2);
}
