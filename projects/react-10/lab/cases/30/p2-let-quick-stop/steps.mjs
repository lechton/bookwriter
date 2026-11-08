import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await press(page, 0); await sleep(500); await press(page, 1); await sleep(3000); await snap('Stop 0.5 s after Start, then 3 s');
}
