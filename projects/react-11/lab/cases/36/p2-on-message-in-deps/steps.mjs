import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(3500);
  log.mark('no render for 3.5 s, user ticks the box');
  await tick(page, sleep);
  await sleep(500);
  log.mark('user unticks the box');
  await tick(page, sleep);
  await sleep(500);
  log.mark('user picks travel');
  await pick(page, 'travel', sleep);
  await sleep(500);
  log.dump();
}
