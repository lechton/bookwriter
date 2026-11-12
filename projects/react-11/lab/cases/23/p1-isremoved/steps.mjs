import { clickIn } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  await clickIn(page, 'Mia', 'Remove');
  await sleep(300);
  await snap('after Remove on Mia');
}
