// Dominant-color sampler — find the most common dark color (code bg) and the most
// common light colors (panels / background) in an image, to compare two themes honestly.
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync(new URL('./pencil.config.json', import.meta.url)));
const file = process.argv[2];
const b64 = readFileSync(file).toString('base64');

const browser = await puppeteer.launch({ executablePath: cfg.chromePath, headless: true });
const page = await browser.newPage();
const out = await page.evaluate(async (src) => {
  const im = new Image(); im.src = src; await im.decode();
  const c = document.createElement('canvas');
  c.width = im.naturalWidth; c.height = im.naturalHeight;
  const ctx = c.getContext('2d'); ctx.drawImage(im, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  const q = (v) => (v >> 2) << 2; // quantize to nearest 4
  const counts = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const key = (q(d[i]) << 16) | (q(d[i + 1]) << 8) | q(d[i + 2]);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const total = d.length / 4;
  const hex = (k) => '#' + (k & 0xffffff).toString(16).padStart(6, '0');
  const sum = (k) => ((k >> 16) & 255) + ((k >> 8) & 255) + (k & 255);
  const arr = [...counts.entries()].map(([k, n]) => ({ hex: hex(k), n, pct: +(100 * n / total).toFixed(1), s: sum(k) }));
  arr.sort((a, b) => b.n - a.n);
  const topDark = arr.filter((x) => x.s < 280).slice(0, 4);
  const topLight = arr.filter((x) => x.s > 560).slice(0, 5);
  return { size: `${c.width}x${c.height}`, topLight, topDark };
}, `data:image/png;base64,${b64}`);
console.log(file.split('/').slice(-1)[0]);
console.log('  light:', out.topLight.map((x) => `${x.hex} (${x.pct}%)`).join('  '));
console.log('  dark :', out.topDark.map((x) => `${x.hex} (${x.pct}%)`).join('  '));
await browser.close();
