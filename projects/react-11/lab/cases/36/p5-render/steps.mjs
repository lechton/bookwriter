import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(1000);
  log.dump();
}
