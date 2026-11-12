import { both, clickButton, typeCode, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeCode(page, 'SAVE5'); await sleep(100);
  await both(page, snap, 'after typing SAVE5');
  await mark(page, 'click Apply with SAVE5');
  await clickButton(page, 'Apply'); await sleep(150);
  await both(page, snap, '150 ms after the click on Apply with SAVE5');
  await sleep(1100);
  await both(page, snap, 'about 1.25 s after the click on Apply with SAVE5');
  await typeCode(page, 'SAVE10'); await sleep(100);
  await both(page, snap, 'after changing the code to SAVE10, before the click');
  await mark(page, 'click Apply with SAVE10');
  await clickButton(page, 'Apply'); await sleep(150);
  await both(page, snap, '150 ms after the click on Apply with SAVE10');
  await sleep(1100);
  await both(page, snap, 'about 1.25 s after the click on Apply with SAVE10');
}
