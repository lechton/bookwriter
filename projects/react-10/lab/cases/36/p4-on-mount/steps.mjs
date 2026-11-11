import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(3500);
  log.mark('user picks travel');
  await pick(page, 'travel', sleep);
  await snap('after picking travel');
  await sleep(3500);
  log.dump();
}
