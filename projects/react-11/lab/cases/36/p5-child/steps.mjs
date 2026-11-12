import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(500);
  log.mark('user ticks the box');
  await tick(page, sleep);
  await sleep(300);
  log.mark('user unticks the box');
  await tick(page, sleep);
  await sleep(300);
  log.dump();
}
