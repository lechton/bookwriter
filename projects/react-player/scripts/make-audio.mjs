#!/usr/bin/env node
// node scripts/make-audio.mjs 21 [--force] [--timing-only] [--jobs N]
// Speaks a chapter's audio text part by part (one Gemini TTS request per part, split by `<!-- part -->`
// lines), aligns every part with ElevenLabs, joins the parts into public/audio/NN.mp3, and writes
// src/audio/NN.timing.json with the start and end of every voiced block in the joined audio.
// A part whose text has not changed keeps its take, because every request is paid; a part whose text
// changed gets a new take, and the old one is moved to audio/build/NN/archive/ first. --force retakes all.
// Run inside the VideoMax Python environment (workon main-env) so its tools find their packages.
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { PROJECT, checkAudio, loadAudio, config, pad } from './lib.mjs';
import { plainSpoken } from '../src/lib/audio-md.js';
import { words } from '../src/lib/blocks.js';

const args = process.argv.slice(2);
const num = args.find((a) => /^\d+$/.test(a));
const force = args.includes('--force');
const timingOnly = args.includes('--timing-only');
const jobs = Number(args[args.indexOf('--jobs') + 1]) || 3;
if (!num) {
  console.error('usage: node scripts/make-audio.mjs <chapter> [--force] [--timing-only] [--jobs N]');
  process.exit(2);
}
const NN = pad(num);

// One request returns at most about ten minutes fifty seconds of speech; the voice speaks about 150
// words a minute, so a part over this size risks being cut off and is refused before anything is paid.
const MAX_PART_WORDS = 1350;
const GAP = 0.6;
const LEAD = 0.15;

const { errors } = checkAudio(NN);
if (errors.length) {
  console.error(`${NN}-audio.md is out of sync; fix it first (node scripts/blocks.mjs check ${NN}):`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
const { meta, entries } = loadAudio(NN);

const buildDir = join(PROJECT, 'audio', 'build', NN);
const archiveDir = join(buildDir, 'archive');
const mp3 = join(PROJECT, 'public', 'audio', `${NN}.mp3`);
const joinedWav = join(buildDir, `${NN}.wav`);
const timingFile = join(PROJECT, 'src', 'audio', `${NN}.timing.json`);
for (const dir of [buildDir, join(PROJECT, 'public', 'audio'), join(PROJECT, 'src', 'audio')]) mkdirSync(dir, { recursive: true });

const parts = [];
for (const e of entries) (parts[e.part - 1] ||= { n: e.part, entries: [] }).entries.push(e);
for (const p of parts) {
  const base = join(buildDir, `${NN}-p${pad(p.n)}`);
  Object.assign(p, { tts: `${base}.tts.txt`, alignText: `${base}.align.txt`, wav: `${base}.wav`, alignJson: `${base}.align.json` });
  // Gemini 3.8 TTS documents <short pause> and <long pause>; the audio text keeps VideoMax's shorter names.
  p.ttsText = p.entries.map((e) => e.spoken.replaceAll('<long-pause>', '<long pause>').replaceAll('<pause>', '<short pause>')).join('\n\n') + '\n';
  p.plain = p.entries.map((e) => plainSpoken(e.spoken)).join('\n') + '\n';
  p.words = words(p.plain).length;
}
const tooLong = parts.filter((p) => p.words > MAX_PART_WORDS);
if (tooLong.length) {
  tooLong.forEach((p) => console.error(`part ${p.n} has ${p.words} words (limit ${MAX_PART_WORDS}); add a <!-- part --> line inside it`));
  process.exit(1);
}

function run(cmd, argv, cwd, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, argv, { cwd });
    let log = '';
    child.stdout.on('data', (d) => (log += d));
    child.stderr.on('data', (d) => (log += d));
    child.on('close', (code) => {
      if (code === 0) resolve(log);
      else reject(new Error(`${label}: ${cmd} ${argv[0]} failed (exit ${code})\n${log.slice(-2000)}`));
    });
  });
}

const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 13);
function archive(file) {
  if (!existsSync(file)) return;
  mkdirSync(archiveDir, { recursive: true });
  const name = file.split('/').pop().replace(/^(\d\d-p\d\d)/, `$1-${stamp}`);
  renameSync(file, join(archiveDir, name));
}

if (!timingOnly) {
  const demo = join(config('external.videomax'), 'gemini-tts-demo');
  const python = process.env.PYTHON || 'python3';
  const voiceArgs = [...(meta.voice ? ['-v', meta.voice] : []), ...(meta.style ? ['--style', meta.style] : [])];

  const todo = parts.filter((p) => force || !existsSync(p.wav) || !existsSync(p.tts) || readFileSync(p.tts, 'utf8') !== p.ttsText);
  const kept = parts.filter((p) => !todo.includes(p));
  console.log(`${parts.length} parts: ${kept.length} kept (${kept.map((p) => p.n).join(', ') || 'none'}), ${todo.length} to speak (${todo.map((p) => `${p.n}: ${p.words} words`).join(', ') || 'none'})`);

  async function speak(p) {
    for (const f of [p.wav, p.tts, p.alignText, p.alignJson]) archive(f);
    writeFileSync(p.tts, p.ttsText);
    writeFileSync(p.alignText, p.plain);
    await run(python, ['generate_tts.py', '-f', p.tts, '-o', p.wav, ...voiceArgs], demo, `part ${p.n}`);
    console.log(`part ${p.n}: spoken`);
    await run(python, ['align_audio.py', '-a', p.wav, '-t', p.alignText, '-o', p.alignJson], demo, `part ${p.n}`);
    console.log(`part ${p.n}: aligned`);
  }
  const queue = [...todo];
  const failures = [];
  await Promise.all(Array.from({ length: Math.min(jobs, queue.length) }, async () => {
    while (queue.length) {
      const p = queue.shift();
      await speak(p).catch((e) => failures.push(e));
    }
  }));
  for (const p of kept) if (!existsSync(p.alignJson)) await run(python, ['align_audio.py', '-a', p.wav, '-t', p.alignText, '-o', p.alignJson], demo, `part ${p.n}`);
  if (failures.length) {
    failures.forEach((e) => console.error(e.message));
    console.error(`${failures.length} part(s) failed; the parts that succeeded are kept and will be reused on the next run.`);
    process.exit(1);
  }

  const silence = join(buildDir, 'gap.wav');
  if (!existsSync(silence)) spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', String(GAP), '-c:a', 'pcm_s16le', silence]);
  const list = join(buildDir, 'concat.txt');
  writeFileSync(list, parts.flatMap((p, i) => [`file '${p.wav}'`, ...(i + 1 < parts.length ? [`file '${silence}'`] : [])]).join('\n') + '\n');
  for (const [cmd, argv] of [
    ['ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joinedWav]],
    ['ffmpeg', ['-y', '-loglevel', 'error', '-i', joinedWav, '-codec:a', 'libmp3lame', '-b:a', '48k', mp3]],
  ]) {
    const r = spawnSync(cmd, argv, { stdio: 'inherit' });
    if (r.status !== 0) process.exit(1);
  }
}

// Longest common subsequence between the words we sent and the words the alignment returned, so a
// word the alignment split, merged, or misheard does not shift every block after it.
function match(a, b) {
  const n = a.length, m = b.length;
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const map = new Array(n).fill(-1);
  for (let i = 0, j = 0; i < n && j < m; ) {
    if (a[i] === b[j]) { map[i++] = j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) i++;
    else j++;
  }
  return map;
}

const duration = (file) => Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).stdout.trim());

const starts = [];
let offset = 0, matched = 0, total = 0;
for (const p of parts) {
  const aligned = JSON.parse(readFileSync(p.alignJson, 'utf8'));
  const heard = [];
  for (const w of aligned.words || []) for (const token of words(w.word)) heard.push({ token, start: w.start });
  const sent = [];
  p.entries.forEach((e, k) => words(plainSpoken(e.spoken)).forEach((token) => sent.push({ token, entry: k })));
  const map = match(sent.map((s) => s.token), heard.map((h) => h.token));
  matched += map.filter((j) => j >= 0).length;
  total += sent.length;

  // Words the voice said that were not in the text, such as a tag read aloud ("short pause").
  const used = new Set(map.filter((j) => j >= 0));
  const extra = heard.filter((h, j) => !used.has(j) && /^(pause|breath|short|long|sigh|chuckles|exhales)$/.test(h.token));
  if (extra.length) console.warn(`WARNING part ${p.n}: the voice may have spoken a tag aloud near ${extra.map((h) => h.start.toFixed(1) + ' s').join(', ')}; listen there`);

  p.entries.forEach((e, k) => {
    const first = sent.findIndex((s) => s.entry === k);
    const i = sent.findIndex((s, idx) => s.entry === k && map[idx] >= 0);
    if (i !== first) console.warn(`NOTE: ${e.ids.join(' ')} starts at its first matched word "${i >= 0 ? sent[i].token : '(none)'}", not "${sent[first]?.token}"`);
    starts.push(i >= 0 ? offset + heard[map[i]].start : null);
  });
  p.offset = offset;
  p.duration = duration(p.wav);
  offset += p.duration + GAP;
}
// An entry with no matched word starts where the previous one would end, so the order holds.
for (let k = 0; k < starts.length; k++) if (starts[k] == null) starts[k] = k ? starts[k - 1] : 0;

const total_duration = duration(mp3);
const blocks = entries.map((e, k) => ({
  ids: e.ids,
  start: +Math.max(0, starts[k] - LEAD).toFixed(3),
  end: +(k + 1 < entries.length ? Math.max(0, starts[k + 1] - LEAD) : total_duration).toFixed(3),
}));

writeFileSync(
  timingFile,
  JSON.stringify({
    chapter: NN,
    audio: `audio/${NN}.mp3`,
    voice: meta.voice || null,
    style: meta.style || null,
    duration: +total_duration.toFixed(3),
    matchedWords: `${matched}/${total}`,
    parts: parts.map((p) => ({ part: p.n, start: +p.offset.toFixed(3), duration: +p.duration.toFixed(3), words: p.words })),
    blocks,
  }, null, 2) + '\n',
);
console.log(`\n${timingFile}: ${parts.length} parts, ${blocks.length} entries, ${matched}/${total} words matched, ${(total_duration / 60).toFixed(1)} min`);
for (const p of parts) console.log(`  part ${String(p.n).padStart(2)}  ${p.offset.toFixed(1).padStart(7)} s  ${p.duration.toFixed(1).padStart(6)} s  ${p.words} words`);
if (matched < total * 0.9) console.warn('WARNING: under 90% of the words matched; listen to the takes before trusting the timing.');
