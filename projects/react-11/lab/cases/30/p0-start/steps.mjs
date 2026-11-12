import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await press(page, 0); await sleep(3400); await snap('3.4 s after Start');
}
