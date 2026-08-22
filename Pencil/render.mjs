// Pencil renderer — deterministic HTML/CSS -> PNG via your installed Chrome.
//
// Usage:
//   node render.mjs                       # render every card under cards/
//   node render.mjs prototype             # render cards whose path matches "prototype"
//   node render.mjs 04_extra_javascript_1 # render a whole lesson folder
//   node render.mjs <match> --publish     # also copy PNG + SVG into the docs images dir
//   node render.mjs <match> --no-svg      # PNG only (the SVG export is ON by default)
//
// A card is ANY folder containing a card.html with an element id="card" (the clip
// region). Cards may be nested (cards/<lesson>/<NN-slug>/card.html). Output mirrors
// the folder path: build/<lesson>/<NN-slug>.png. Fonts (Inter + JetBrains Mono) are
// injected by the renderer, so cards need no <link> and work at any depth.

import puppeteer from 'puppeteer-core';
import { readFileSync, readdirSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(__dirname, 'pencil.config.json'), 'utf8'));

const argv = process.argv.slice(2);
const publish = argv.includes('--publish');
const svgOut = !argv.includes('--no-svg'); // SVG export is ON by default; --no-svg skips it
const match = argv.find((a) => !a.startsWith('--'));

const cardsDir = join(__dirname, process.env.PENCIL_CARDS ?? cfg.cardsDir);
const outDir = join(__dirname, process.env.PENCIL_OUT ?? cfg.outputDir);

// --- discover every card.html, recursively ---
function findCards(dir, base = cardsDir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...findCards(full, base));
    else if (e.name === 'card.html') {
      const id = relative(base, dirname(full)).split(sep).join('/');
      out.push({ htmlPath: full, id });
    }
  }
  return out;
}

let cards = findCards(cardsDir).sort((a, b) => a.id.localeCompare(b.id));
if (match) cards = cards.filter((c) => c.id.includes(match));

if (cards.length === 0) {
  console.error(`No cards found${match ? ` matching "${match}"` : ''} under ${cfg.cardsDir}/`);
  process.exit(1);
}

// --- build the @font-face block once, with absolute file URLs (depth-independent) ---
const fontsDir = join(__dirname, 'fonts');
const fontCss = readFileSync(join(fontsDir, 'fonts.css'), 'utf8').replace(
  /url\(["']?([^"')]+)["']?\)/g,
  (_, f) => `url("${pathToFileURL(join(fontsDir, f)).href}")`,
);

// For --svg: the same @font-face block, but with each woff2 inlined as a base64 data URI so the
// exported SVG is fully self-contained (carries its own fonts, no external files).
const fontCssEmbedded = svgOut
  ? readFileSync(join(fontsDir, 'fonts.css'), 'utf8').replace(
      /url\(["']?([^"')]+)["']?\)/g,
      (_, f) => `url("data:font/woff2;base64,${readFileSync(join(fontsDir, f)).toString('base64')}")`,
    )
  : '';

const browser = await puppeteer.launch({
  executablePath: cfg.chromePath,
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
});

for (const { htmlPath, id } of cards) {
  const page = await browser.newPage();
  await page.setViewport({
    width: Number(process.env.PENCIL_VW) || cfg.viewportWidth,
    height: 1200, // tall enough; we clip to #card, which may exceed this
    deviceScaleFactor: cfg.deviceScaleFactor,
  });

  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' });

  // Determinism: inject bundled fonts, kill animations, then wait for fonts to load.
  await page.addStyleTag({ content: fontCss });
  await page.addStyleTag({
    content: '*,*::before,*::after{animation:none!important;transition:none!important;}',
  });
  await page.evaluate(async () => {
    document.documentElement.style.background = 'transparent';
    await document.fonts.ready;
  });

  const el = (await page.$('#card')) || (await page.$('body'));
  // Project 2 (PENCIL_OUT set) writes PNGs into a png/ subfolder: <out>/<lesson>/png/<slug>.png
  const _p = id.split('/'); const _slug = _p.pop(); const _dir = _p.join('/');
  const outRel = process.env.PENCIL_OUT ? (_dir ? `${_dir}/png/${_slug}` : `png/${_slug}`) : id;
  const outPath = join(outDir, `${outRel}.png`);
  mkdirSync(dirname(outPath), { recursive: true });
  await el.screenshot({ path: outPath, omitBackground: true });

  const box = await el.boundingBox();
  console.log(`✓ ${id}  ${Math.round(box.width)}x${Math.round(box.height)} @${cfg.deviceScaleFactor}x  ->  ${process.env.PENCIL_OUT ?? cfg.outputDir}/${outRel}.png`);

  // SVG export (ON by default; pass --no-svg to skip). dom-to-svg walks the laid-out #card and emits a
  // TRUE-VECTOR svg — real <text>/<rect>/<path> with styling baked onto each element — so it renders in
  // ANY viewer (Preview, Quick Look, Illustrator, <img>), unlike a <foreignObject>. Fonts are embedded.
  let svgRel;
  if (svgOut) {
    try {
      await page.addScriptTag({ path: join(__dirname, 'lib', 'dom-to-svg.bundle.js') });
      const svgStr = await page.evaluate(() => {
        const svgEl = DomToSvg.elementToSVG(document.querySelector('#card'));
        return new XMLSerializer().serializeToString(svgEl);
      });
      // Inject the bundled fonts so the vector text renders in the right face on any machine.
      const svg = svgStr.replace(
        /(<svg[^>]*>)/,
        `$1<defs><style type="text/css"><![CDATA[${fontCssEmbedded}]]></style></defs>`,
      );
      svgRel = outRel.replace('/png/', '/svg/');
      const svgPath = join(outDir, `${svgRel}.svg`);
      mkdirSync(dirname(svgPath), { recursive: true });
      writeFileSync(svgPath, svg);
      console.log(`  svg:  ${process.env.PENCIL_OUT ?? cfg.outputDir}/${svgRel}.svg`);
    } catch (e) {
      console.log(`  svg:  skipped (${e.message})`);
    }
  }

  if (publish) {
    const pub = join(__dirname, cfg.publishDir, `${id}.png`);
    mkdirSync(dirname(pub), { recursive: true });
    copyFileSync(outPath, pub);
    console.log(`  published -> ${cfg.publishDir}/${id}.png`);
    if (svgRel) {
      copyFileSync(join(outDir, `${svgRel}.svg`), join(__dirname, cfg.publishDir, `${id}.svg`));
      console.log(`  published -> ${cfg.publishDir}/${id}.svg`);
    }
  }

  const alt = id.split('/').pop().replace(/^\d+-/, '').replace(/-/g, ' ');
  console.log(`  markdown:  ![${alt}](images/${id}.png)\n`);
  await page.close();
}

await browser.close();
