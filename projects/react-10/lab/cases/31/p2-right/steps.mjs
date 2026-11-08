import { watch, press, clickInput, focusInfo } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page); c.mark('after load');
  await clickInput(page, 0); await page.keyboard.type('John'); await sleep(200);
  await focusInfo(page, 'after typing John');
  await press(page, 0); await sleep(300);
  await focusInfo(page, 'after click on Add');
  await snap('after click on Add');
  await page.keyboard.type('Mary'); await sleep(300);
  await focusInfo(page, 'after typing Mary without clicking the box');
  await snap('after typing Mary');
  await press(page, 0); await sleep(300);
  await focusInfo(page, 'after second click on Add');
  await snap('after second click on Add');
  await c.dump('whole run after load');
}
