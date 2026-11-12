import { show, clearBox } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await page.type('#answer', 'Lyon');
  await page.click('#check'); await sleep(1300);
  await show(page, snap, 'after typing Lyon and clicking Check');
  await clearBox(page);
  await page.type('#answer', 'Paris');
  await page.click('#check'); await sleep(100);
  await show(page, snap, 'right after changing to Paris and clicking Check'); await sleep(1300);
  await show(page, snap, 'after changing to Paris and clicking Check');
}
