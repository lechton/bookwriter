import { mapDump, watch, press, sample } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  w.mark('before the click on Show counter');
  await press(page, 0);
  await sample(page, w, 3, sleep);
  await snap('3 s after Show counter');
  const before = w.count('Tick');
  await press(page, 0);
  await sleep(1000);
  await snap('1 s after Hide counter');
  console.log(`-- Tick lines during the 1 s while hidden: ${w.count('Tick') - before}`);
  await mapDump(page, w, '/src/components/Counter.jsx', 'show 3 s, hide 1 s');
  const els = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log(`-- Elements: ${els}`);
  w.mark('before the second click on Show counter');
  await press(page, 0);
  await sample(page, w, 3, sleep);
  await snap('3 s after the second Show counter');
  await mapDump(page, w, '/src/components/Counter.jsx', 'after the second Show counter');
}
