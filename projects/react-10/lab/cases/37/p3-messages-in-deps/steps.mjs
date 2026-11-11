import { watch } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  for (const at of [3300, 3000]) {
    await sleep(at);
    await snap('after ' + at + ' more ms of waiting');
  }
  log.dump();
}
