import { clickButton } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  await page.type('#a', 'Leo');
  await page.type('#b', 'Leo');
  await clickButton(page, 'Add clear first');
  await clickButton(page, 'Add send first');
  await sleep(300);
  await snap('after both clicks');
  console.log('boxes', JSON.stringify(await page.evaluate(() => [document.querySelector('#a').value, document.querySelector('#b').value])));
}
