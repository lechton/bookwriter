import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(3500);
  log.mark('user ticks the box');
  await tick(page, sleep);
  await snap('after tick');
  await sleep(6500);
  log.mark('user unticks the box');
  await tick(page, sleep);
  await sleep(6500);
  await snap('after untick');
  log.dump();
}
