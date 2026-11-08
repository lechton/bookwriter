import { clickIn } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  await page.type('input', 'a');
  await sleep(300);
  await snap('after typing a');
  await clickIn(page, 'Mia', 'Remove');
  await sleep(300);
  await snap('after Remove on Mia');
}
