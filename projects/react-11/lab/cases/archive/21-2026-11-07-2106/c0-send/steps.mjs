import { both, clickButton } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await clickButton(page, 'Send'); await sleep(200);
  await both(page, snap, 'after the click on Send');
}
