import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page); c.mark('before Start');
  await press(page, 0); await sleep(3400); await snap('3.4 s after Start');
  await press(page, 1); await snap('right after Stop'); await sleep(10000); await snap('10 s after Stop');
  await press(page, 0); await sleep(1300); await snap('1.3 s after the second Start');
  await press(page, 1); await c.dump('whole run');
}
