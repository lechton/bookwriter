import { show, clickCheck, clearBox } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await page.type('input', 'Lyon'); await sleep(100);
  await show(page, snap, 'after typing Lyon');
  await clearBox(page); await sleep(100);
  await show(page, snap, 'after deleting all four letters with Backspace');
}
