import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(3500);
  log.mark('user ticks the box');
  await tick(page, sleep);
  await snap('after tick');
  await sleep(4000);
  log.mark('user unticks the box');
  await tick(page, sleep);
  await sleep(500);
  log.mark('fast toggling every 2 s for 12 s');
  for (let i = 0; i < 6; i++) { await tick(page, sleep); await sleep(1700); }
  log.mark('end of fast toggling');
  await snap('after fast toggling');
  log.dump();
}
