import { show, clickCheck } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await show(page, snap, 'after load');
  await page.type('input', 'Lyon');
  await clickCheck(page); await sleep(100);
  await show(page, snap, 'right after typing Lyon and clicking Check');
  await sleep(1200);
  await show(page, snap, 'one second after the click');
  await page.type('input', 'X'); await sleep(100);
  await show(page, snap, 'after trying to type X');
}
