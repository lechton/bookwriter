import { watch, press, focusInfo } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page);
  await focusInfo(page, 'after load');
  await c.dump('load');
  c.mark('before click');
  await press(page, 0); await sleep(300);
  await focusInfo(page, 'after click on Focus the input');
  await snap('after click');
  await c.dump('after click');
}
