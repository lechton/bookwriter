import { watch, press, clickInput, focusInfo } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page);
  await focusInfo(page, 'after load');
  await c.dump('load'); c.mark('before Dinner');
  await clickInput(page, 1); await page.keyboard.type('Ana'); await sleep(200);
  await press(page, 1); await sleep(300);
  await focusInfo(page, 'after click on Add in Dinner');
  await page.keyboard.type('Ben'); await sleep(300);
  await focusInfo(page, 'after typing Ben');
  await snap('after typing Ben');
  await c.dump('Dinner run');
}
