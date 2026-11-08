import { both, typeCode } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeCode(page, 'S'); await sleep(100);
  await both(page, snap, 'after typing S');
  await typeCode(page, ''); await sleep(100);
  await both(page, snap, 'after deleting every letter');
}
