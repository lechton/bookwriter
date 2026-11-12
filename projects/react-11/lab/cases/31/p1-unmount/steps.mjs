import { watch, press } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page); c.mark('after load');
  await press(page, 1); await sleep(200);
  await press(page, 0); await sleep(300); await snap('after Toggle box: box removed');
  await press(page, 1); await sleep(200);
  await press(page, 0); await sleep(300); await snap('after Toggle box: box back');
  await press(page, 1); await sleep(200);
  await c.dump('Log, remove, Log, add back, Log');
}
