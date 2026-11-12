import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await press(page, 0); await sleep(4400); await snap('4.4 s after Start under Tea');
  await press(page, 2); await sleep(2300); await snap('2.3 s after Start under Eggs');
  await press(page, 1); await sleep(2000); await snap('2 s after Stop under Tea');
}
