import { show, clickCheck, clearBox } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await show(page, snap, 'after load');
  await page.type('input', 'Lyon');
  await clickCheck(page); await sleep(100);
  await show(page, snap, 'right after typing Lyon and clicking Check');
  await clickCheck(page); await sleep(1200);
  await show(page, snap, 'one second after the click, with a second click tried while checking');
  await clearBox(page);
  await page.type('input', 'Paris');
  await clickCheck(page); await sleep(100);
  await show(page, snap, 'right after changing the answer to Paris and clicking Check');
  await sleep(1200);
  await show(page, snap, 'one second after the second click');
}
