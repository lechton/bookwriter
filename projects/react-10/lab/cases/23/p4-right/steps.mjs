import { clickButton, typeIn, rowKeys } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  console.log('placeholder', JSON.stringify(await page.evaluate(() => document.querySelector('input').placeholder)));
  await typeIn(page, 'Leo');
  await clickButton(page, 'Add');
  await sleep(300);
  await snap('after typing Leo and clicking Add');
  console.log('box value', JSON.stringify(await page.evaluate(() => document.querySelector('input').value)));
  await typeIn(page, 'Ann');
  await clickButton(page, 'Add');
  await sleep(300);
  console.log('row keys', JSON.stringify(await rowKeys(page)));
}
