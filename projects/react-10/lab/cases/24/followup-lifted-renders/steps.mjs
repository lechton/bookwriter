import { typeIn } from '../helper.mjs';
export default async function ({ page, sleep }) {
  await page.evaluate(() => console.log('--- user types J'));
  await typeIn(page, 'J');
  await sleep(300);
}
