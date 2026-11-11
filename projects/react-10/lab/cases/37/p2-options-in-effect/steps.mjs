import { watch, type, pick, value } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  log.mark('user types hi');
  await type(page, 'hi', sleep);
  await snap('after the user types hi');
  console.log('box value: ' + (await value(page)));
  log.mark('user picks travel');
  await pick(page, 'travel', sleep);
  await snap('after the user picks travel');
  console.log('box value: ' + (await value(page)));
  log.dump();
}
