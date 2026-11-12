import { watch, press, focusInfo } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page);
  await press(page, 0); await sleep(300); await focusInfo(page, 'after Edit'); await c.dump('Edit');
  c.mark('before flushSync');
  await press(page, 1); await sleep(300); await focusInfo(page, 'after Edit with flushSync'); await c.dump('flushSync');
}
