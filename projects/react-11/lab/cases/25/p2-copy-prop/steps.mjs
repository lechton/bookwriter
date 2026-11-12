import { click } from '../helper.mjs';
export default async function ({ page, snap }) {
  console.log('input at Taylor:', await page.evaluate(() => document.querySelector('input').value));
  await click(page, 'Alice');
  await snap('after Alice');
  console.log('input at Alice:', await page.evaluate(() => document.querySelector('input').value));
}
