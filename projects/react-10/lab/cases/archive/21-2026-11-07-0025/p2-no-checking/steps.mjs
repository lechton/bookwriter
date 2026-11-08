import { both, typeIn, clickApply } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeIn(page, 'WELCOME'); await sleep(200);
  await clickApply(page); await sleep(400);
  await both(page, snap, '0.4 s after the first click on Apply');
  await clickApply(page); await sleep(2200);
  await both(page, snap, 'after a second click 0.4 s later and a 2.2 s wait');
  console.log('== checkCode calls');
  console.log(await page.evaluate(() => globalThis.checkCalls));
}
