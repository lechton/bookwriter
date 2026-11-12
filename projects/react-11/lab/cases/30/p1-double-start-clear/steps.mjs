import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await press(page, 0); await press(page, 0); await sleep(3400); await snap('3.4 s after two clicks on Start');
  await press(page, 1); await snap('right after Stop'); await sleep(3000); await snap('3 s after Stop');
}
