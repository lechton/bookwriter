// Full theme audit — vertical band geometry + saturated palette, measured from pixels.
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync(new URL('./pencil.config.json', import.meta.url)));
const file = process.argv[2];
const b64 = readFileSync(file).toString('base64');

const browser = await puppeteer.launch({ executablePath: cfg.chromePath, headless: true });
const page = await browser.newPage();
const out = await page.evaluate(async (src) => {
  const im = new Image(); im.src = src; await im.decode();
  const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
  const ctx = c.getContext('2d'); ctx.drawImage(im, 0, 0);
  const W = c.width, H = c.height, d = ctx.getImageData(0, 0, W, H).data;
  const hx = (v) => Math.round(v).toString(16).padStart(2, '0');
  const hex = (r, g, b) => `#${hx(r)}${hx(g)}${hx(b)}`;

  function rowMode(y) {
    const m = new Map();
    for (let x = 0; x < W; x += 2) {
      const i = (y * W + x) * 4;
      const k = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3);
      m.set(k, (m.get(k) || 0) + 1);
    }
    let best = 0, bk = 0; for (const [k, n] of m) if (n > best) { best = n; bk = k; }
    return hex(((bk >> 10) & 31) << 3, ((bk >> 5) & 31) << 3, (bk & 31) << 3);
  }
  const raw = []; let prev = null, start = 0;
  for (let y = 0; y < H; y += 2) { const col = rowMode(y); if (col !== prev) { if (prev) raw.push({ y0: start, y1: y, col: prev }); prev = col; start = y; } }
  raw.push({ y0: start, y1: H, col: prev });
  const bands = raw.filter((b) => b.y1 - b.y0 >= 10);

  const sat = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) > 22) {
      const k = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      sat.set(k, (sat.get(k) || 0) + 1);
    }
  }
  const palette = [...sat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16)
    .map(([k, n]) => `${hex(((k >> 10) & 31) << 3, ((k >> 5) & 31) << 3, (k & 31) << 3)}(${(100 * n / (W * H)).toFixed(2)})`);
  return { size: `${W}x${H}`, bands, palette };
}, `data:image/png;base64,${b64}`);

console.log('\n=== ' + file.split('/').pop() + '  ' + out.size + ' ===');
console.log('BANDS (y0-y1, height, dominant color):');
out.bands.forEach((b) => console.log(`  ${b.y0}-${b.y1}  ${String(b.y1 - b.y0).padStart(4)}px  ${b.col}`));
console.log('SATURATED PALETTE:', out.palette.join('  '));
await browser.close();
