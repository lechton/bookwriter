import { both, clickButton } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await clickButton(page, 'Send'); await sleep(150);
  await both(page, snap, '150 ms after the click on Send');
  await sleep(1100);
  await both(page, snap, 'about 1.25 s after the click, no second click');
}
