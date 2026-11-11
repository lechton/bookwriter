import { watch, tick, pick } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const log = watch(page);
  await sleep(500);
  log.mark('user clicks Test notification');
  await page.click('::-p-text(Test notification)');
  await sleep(300);
  log.mark('user ticks the box, then clicks Test notification');
  await tick(page, sleep);
  await page.click('::-p-text(Test notification)');
  await sleep(300);
  log.mark('user clicks Regular test');
  await page.click('::-p-text(Regular test)');
  await sleep(300);
  log.dump();
}
