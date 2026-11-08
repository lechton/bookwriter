import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page); c.mark('before Start');
  await press(page, 0); await sleep(3400); await snap('3.4 s after Start');
  await press(page, 1); await sleep(2000); await snap('2 s after Stop');
  await c.dump('whole run');
}
