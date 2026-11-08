import { both } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await page.click('button'); await sleep(300);
  await both(page, snap, 'after one click on Subscribe');
}
