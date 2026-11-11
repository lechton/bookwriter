import { watch, type } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  log.mark('user types hi');
  await type(page, 'hi', sleep);
  await snap('after the user types hi');
  log.dump();
}
