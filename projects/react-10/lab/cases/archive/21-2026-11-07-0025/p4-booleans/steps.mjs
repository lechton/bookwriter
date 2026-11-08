import { both, typeIn, clickApply } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeIn(page, 'WELCOM'); await sleep(200);
  await clickApply(page); await sleep(300);
  await both(page, snap, '0.3 s after Apply');
  await sleep(1700);
  await both(page, snap, '2 s after Apply');
  await typeIn(page, 'E'); await sleep(200);
  await both(page, snap, 'after trying to type E');
}
