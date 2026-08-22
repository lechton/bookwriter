// Region palette by hue — extract syntax/token colors from a sub-rectangle.
// usage: node glyphs.mjs <file> x0 y0 x1 y1   (normalized 0..1)
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync(new URL('./pencil.config.json', import.meta.url)));
const [file, x0, y0, x1, y1] = process.argv.slice(2);
const b64 = readFileSync(file).toString('base64');

const browser = await puppeteer.launch({ executablePath: cfg.chromePath, headless: true });
const page = await browser.newPage();
const out = await page.evaluate(async (src, bb) => {
  const im = new Image(); im.src = src; await im.decode();
  const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
  const ctx = c.getContext('2d'); ctx.drawImage(im, 0, 0);
  const W = c.width, H = c.height, d = ctx.getImageData(0, 0, W, H).data;
  const X0 = bb[0] * W | 0, Y0 = bb[1] * H | 0, X1 = bb[2] * W | 0, Y1 = bb[3] * H | 0;
  const hx = (v) => v.toString(16).padStart(2, '0');
  const fam = { blue: new Map(), green: new Map(), pinkred: new Map(), orange: new Map() };
  for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) {
    const i = (y * W + x) * 4, r = d[i], g = d[i + 1], b = d[i + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if (chroma < 30) continue;
    let f = null;
    if (b >= r && b >= g && b - r > 12) f = 'blue';
    else if (g >= r && g >= b && g - b > 6) f = 'green';
    else if (r > g && r > b && g - b > 25) f = 'orange';
    else if (r >= g && r >= b) f = 'pinkred';
    if (!f) continue;
    const k = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    fam[f].set(k, (fam[f].get(k) || 0) + 1);
  }
  const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([k, n]) => `#${hx(((k >> 10) & 31) << 3)}${hx(((k >> 5) & 31) << 3)}${hx((k & 31) << 3)}(${n})`);
  return { blue: top(fam.blue), green: top(fam.green), pinkred: top(fam.pinkred), orange: top(fam.orange) };
}, `data:image/png;base64,${b64}`, [(+x0), (+y0), (+x1), (+y1)]);
console.log(file.split('/').pop(), `bbox ${x0},${y0}-${x1},${y1}`);
for (const k of Object.keys(out)) console.log(`  ${k.padEnd(8)}`, out[k].join('  '));
await browser.close();
