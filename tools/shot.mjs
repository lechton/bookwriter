/* shot.mjs — dev tool: screenshot an html/ page with Chrome for visual review.
   Usage: node shot.mjs deck [width]   → writes html/_shots/<name>.png */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const require = createRequire('/Users/techton/lechton/research-code/svelte dev 2026/Pencil/package.json');
const puppeteer = require('puppeteer-core');

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const demoName = process.argv[2] && !process.argv[2].endsWith('.mjs') ? process.argv[2] : 'svelte-demo';
const targetName = process.argv[3] || 'deck';
const width = Number(process.argv[4]) || 820;

const browser = await puppeteer.launch({
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	headless: 'shell',
});
const page = await browser.newPage();
await page.setViewport({ width, height: 1200, deviceScaleFactor: 2 });
await page.goto('file://' + join(ROOT, 'output', demoName, 'html', `${targetName}.html`));
await page.evaluateHandle('document.fonts.ready');

const outDir = join(ROOT, 'output', demoName, 'html', '_shots');
mkdirSync(outDir, { recursive: true });

if (targetName === 'deck') {
	const cards = await page.$$('.card, .deck-head');
	for (let i = 0; i < cards.length; i++) {
		await cards[i].screenshot({ path: join(outDir, `${targetName}-${String(i).padStart(2, '0')}.png`) });
	}
	console.log(`shot ${cards.length} elements → output/${demoName}/html/_shots/`);
} else {
	await page.screenshot({ path: join(outDir, `${targetName}.png`), fullPage: true });
	console.log(`shot output/${demoName}/html/_shots/${targetName}.png`);
}
await browser.close();
