import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(3500);
  log.mark('user ticks the box');
  await tick(page, sleep);
  await snap('after tick');
  await sleep(6500);
  log.mark('user picks travel while ticked');
  await pick(page, 'travel', sleep);
  await sleep(6500);
  log.mark('user unticks the box');
  await tick(page, sleep);
  await sleep(6500);
  log.mark('user picks music while unticked');
  await pick(page, 'music', sleep);
  await sleep(3500);
  log.dump();
}
