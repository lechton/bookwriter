import { clickButton } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await clickButton(page, 'first try'); await sleep(200);
  await snap('after the first try');
  await clickButton(page, 'second try'); await sleep(200);
  await snap('after the second try');
}
