import { show, clickCheck } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await page.type('input', 'paris');
  await clickCheck(page); await sleep(1200);
  await show(page, snap, 'one second after typing paris and clicking Check');
}
