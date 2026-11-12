import { press } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await press(page, 0); await sleep(1500);
  await snap('after click on Play');
  console.log('-- video paused:', await page.evaluate(() => document.getElementById('v').paused), 'currentTime:', await page.evaluate(() => document.getElementById('v').currentTime));
}
