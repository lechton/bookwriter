/* review-shot.mjs — one-off review tool: screenshot every slide of the docs demo apps
   so we can visually compare online-Gemini output vs the local decks.
   Usage: node src/review-shot.mjs */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const require = createRequire('/Users/techton/lechton/research-code/svelte dev 2026/Pencil/package.json');
const puppeteer = require('puppeteer-core');

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(ROOT, 'docs', '_shots');
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	headless: 'shell',
});

for (const name of ['flashcards_app', 'flashcards_app_02']) {
	const page = await browser.newPage();
	await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
	await page.goto('file://' + join(ROOT, 'docs', `${name}.html`));
	await page.evaluateHandle('document.fonts.ready');
	// Force every slide visible, stacked, so we can capture them all.
	const count = await page.evaluate(() => {
		const slides = document.querySelectorAll('.slide');
		slides.forEach((s) => {
			s.style.display = 'block';
			s.style.opacity = '1';
			s.style.transform = 'none';
			s.style.marginBottom = '48px';
		});
		const nav = document.querySelectorAll('nav, .navigation, .controls, footer');
		nav.forEach((n) => (n.style.display = 'none'));
		return slides.length;
	});
	const slides = await page.$$('.slide');
	for (let i = 0; i < slides.length; i++) {
		await slides[i].screenshot({ path: join(outDir, `${name}-${String(i).padStart(2, '0')}.png`) });
	}
	console.log(`${name}: shot ${slides.length} slides (reported ${count})`);
	await page.close();
}
await browser.close();
