import { mapDump, watch, press, sample } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  w.mark('before the click on Show counter');
  await press(page, 0);
  await sample(page, w, 2, sleep);
  await press(page, 0);
  await snap('right after Hide counter');
  await press(page, 0);
  const t = w.since();
  for (let s = 1; s <= 2; s += 1) {
    await sleep(Math.max(0, t + s * 1000 + 100 - w.since()));
    console.log(`-- ${s} s after the second Show counter: h1=${await page.evaluate(() => document.querySelector('h1')?.textContent)}, Tick so far=${w.count('Tick')}`);
  }
  await snap('2 s after the second Show counter');
  await mapDump(page, w, '/src/components/Counter.jsx', 'show 2 s, hide, show 2 s');
}
