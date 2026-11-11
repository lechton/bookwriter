import { watch } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  for (const at of [500]) {
    await sleep(at);
    await snap('after ' + at + ' more ms of waiting');
  }
  log.dump();
}
