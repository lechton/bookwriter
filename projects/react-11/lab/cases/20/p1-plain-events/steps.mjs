import { mark } from '../_lib.mjs';
export default async function ({ page, sleep }) {
  await mark(page, 'user types Hi');
  await page.click('textarea'); await page.keyboard.type('Hi'); await sleep(200);
  await mark(page, 'user clicks somewhere else');
  await page.click('#other'); await sleep(200);
}
