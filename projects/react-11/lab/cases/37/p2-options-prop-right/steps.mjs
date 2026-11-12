import { watch, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  log.mark('user clicks Toggle theme');
  await page.click('button');
  await sleep(300);
  log.mark('user clicks Toggle theme again');
  await page.click('button');
  await sleep(300);
  await snap('after two clicks on Toggle theme');
  log.mark('user picks travel');
  await pick(page, 'travel', sleep);
  await snap('after the user picks travel');
  log.dump();
}
