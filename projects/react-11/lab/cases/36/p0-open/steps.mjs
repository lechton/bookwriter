import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(3500);
  await snap('3.5 s after the page opens');
  log.dump();
}
