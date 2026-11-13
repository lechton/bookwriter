import { fill, boxes } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await page.type('input[name="email"]', 'john@mail.com');
  await sleep(200);
  await boxes(page, 'after the user types john@mail.com into Email');
}
