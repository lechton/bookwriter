import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await press(page, 0); await sleep(6400); await snap('6.4 s after Start under Tea');
  await press(page, 1); await sleep(500); await snap('after Stop under Tea');
}
