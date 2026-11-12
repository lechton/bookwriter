import { show, clickCheck } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await page.type('input', 'Lyon');
  await clickCheck(page); await sleep(200);
  await clickCheck(page); await sleep(200);
  await clickCheck(page); await sleep(1200);
  await show(page, snap, 'after typing Lyon and clicking Check three times');
}
