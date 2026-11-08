import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  dialogs(page); const c = watch(page); c.mark('after load');
  for (let i = 0; i < 3; i++) { await press(page, 0); await sleep(300); }
  await snap('after three clicks'); await c.dump('three clicks');
}
