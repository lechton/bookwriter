import { watch, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  log.mark('user picks travel');
  await pick(page, 'travel', sleep);
  await snap('after the user picks travel');
  await sleep(1500);
  log.dump();
}
