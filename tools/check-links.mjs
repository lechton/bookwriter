#!/usr/bin/env node
/* check-links.mjs — verifies relative markdown links in tracked .md files.
   Categories: BROKEN (real path errors, exit 1), GENERATED (target is gitignored build output),
   MISSING (in-repo content not yet authored, e.g. planned lectures), PLACEHOLDER (doc examples). */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = process.cwd();
const files = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
  .split('\n').filter(Boolean).filter(f => f.endsWith('.md'));

const ignored = new Set(
  execSync('git ls-files -o -i --exclude-standard --directory', { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter(Boolean).map(p => resolve(ROOT, p))
);
const isGenerated = p => {
  let cur = p;
  while (cur !== dirname(cur)) {
    if (ignored.has(cur)) return true;
    cur = dirname(cur);
  }
  return false;
};

const placeholder = t =>
  t === 'url' || t === '...' || t.includes('{') || t.includes('<') ||
  /^\?[:]/.test(t) || /^https?:$/.test(t) || t.endsWith('...');

const broken = [], generated = [], missing = [], placeholders = [];
let total = 0;

for (const f of files) {
  const abs = join(ROOT, f);
  const src = readFileSync(abs, 'utf8');
  const re = /\[[^\]\n]*\]\(([^)\s]+)\)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const target = m[1];
    if (/^(https?:\/\/|mailto:|#)/.test(target)) continue;
    if (placeholder(target)) { placeholders.push(`${f} -> ${target}`); continue; }
    total++;
    const clean = decodeURIComponent(target.split('#')[0]);
    if (!clean) continue;
    const resolved = resolve(dirname(abs), clean);
    if (existsSync(resolved)) continue;
    if (isGenerated(resolved)) { generated.push(`${f} -> ${target}`); continue; }
    if (resolved.startsWith(ROOT)) { missing.push(`${f} -> ${target}`); continue; }
    broken.push(`${f} -> ${target}`);
  }
}

console.log(`checked ${files.length} md files, ${total} relative links (+${placeholders.length} placeholders skipped)`);
console.log(`GENERATED (build outputs, ok when built): ${generated.length}`);
console.log(`MISSING (planned in-repo content): ${missing.length}`);
if (broken.length) {
  console.log(`\nBROKEN (${broken.length}):`);
  broken.forEach(b => console.log('  ' + b));
  process.exit(1);
}
console.log('zero broken path links ✓');
if (process.argv.includes('-v')) {
  console.log('\nMISSING detail:'); missing.forEach(b => console.log('  ' + b));
  console.log('\nGENERATED detail:'); generated.forEach(b => console.log('  ' + b));
}
