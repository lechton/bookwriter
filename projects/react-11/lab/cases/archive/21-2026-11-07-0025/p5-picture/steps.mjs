import { elements } from '../_lib.mjs';
export default async function ({ page, sleep }) {
  await elements(page, 'after load');
  await page.evaluate(() => document.querySelector('img').click()); await sleep(300);
  await elements(page, 'after one click on the picture');
}
