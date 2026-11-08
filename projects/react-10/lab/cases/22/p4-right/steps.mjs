import { clickIn } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  await clickIn(page, 'Mia', 'Make captain');
  await sleep(300);
  await snap('after Make captain on Mia');
  await clickIn(page, 'John', 'Make captain');
  await sleep(300);
  await snap('after Make captain on John');
}
