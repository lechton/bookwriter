import { clickButton, typeIn } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  await typeIn(page, 'Leo');
  await clickButton(page, 'Add');
  await sleep(500);
  await snap('after typing Leo and clicking Add');
  console.log('root html', JSON.stringify(await page.evaluate(() => document.getElementById('root').innerHTML)));
}
