import { clickButton, typeIn } from '../helper.mjs';
export default async function ({ page, sleep }) {
  await page.evaluate(() => console.log('--- user types J'));
  await typeIn(page, 'J');
  await sleep(300);
  await page.evaluate(() => console.log('--- user clicks Start over'));
  await clickButton(page, 'Start over');
  await sleep(300);
}
