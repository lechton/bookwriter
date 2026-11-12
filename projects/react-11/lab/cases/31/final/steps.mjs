import { watch, press, clickInput, focusInfo } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page);
  await clickInput(page, 0);
  await page.keyboard.type('John'); await press(page, 0); await sleep(200);
  await page.keyboard.type('Mary'); await press(page, 0); await sleep(200);
  await clickInput(page, 1);
  await page.keyboard.type('Ana'); await press(page, 1); await sleep(200);
  await page.keyboard.type('Ben'); await press(page, 1); await sleep(300);
  await focusInfo(page, 'end');
  await snap('end');
  await c.dump('whole run');
}
