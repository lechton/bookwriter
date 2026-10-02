#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function readConfig(name) {
  const p = join(ROOT, name);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
}

function flatten(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) && !k.startsWith('$')
      ? flatten(v, `${prefix}${k}.`)
      : [[`${prefix}${k}`, v]]
  );
}

const defaults = readConfig('bookwriter-project.json');
const local = readConfig('bookwriter-project.local.json');
const cfg = Object.fromEntries([...flatten(defaults), ...flatten(local)]);

const key = process.argv[2];
if (!key || !(key in cfg) || String(cfg[key]).startsWith('<')) {
  console.error(`Unknown or unconfigured key: ${key || '(none)'}`);
  console.error(`Available keys: ${Object.keys(cfg).join(', ')}`);
  console.error('Set real values in bookwriter-project.local.json (gitignored).');
  process.exit(1);
}
console.log(cfg[key]);
