import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(3500);
  log.mark('user ticks the box');
  await tick(page, sleep);
  await sleep(3500);
  log.mark('user picks travel');
  await pick(page, 'travel', sleep);
  log.mark('user unticks the box');
  await tick(page, sleep);
  await sleep(3500);
  await snap('end of the visit');
  log.dump();
}
