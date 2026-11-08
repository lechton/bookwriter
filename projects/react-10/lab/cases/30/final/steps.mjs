import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page); c.mark('before Start');
  await press(page, 0); await sleep(5400); await snap('5.4 s after Start under Tea');
  await press(page, 2); await sleep(3200); await press(page, 1); await snap('Start Eggs, 3.2 s, Stop Tea');
  await sleep(2000); await snap('2 s after Stop under Tea');
  await c.dump('whole run');
}
