import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page);
  c.mark('before Start'); await press(page, 0); await sleep(300); await c.dump('300 ms after the click on Start');
  await sleep(3100); await snap('3.4 s after Start');
  c.mark('right before Stop'); await press(page, 1); await sleep(1500); await snap('1.5 s after Stop');
  await c.dump('after the click on Stop');
}
