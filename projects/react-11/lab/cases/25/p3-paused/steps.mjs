import { clickFirst, click } from '../helper.mjs';
export default async function ({ page, snap }) {
  await clickFirst(page, 3);
  await snap('after three clicks');
  await click(page, 'Take a break');
  await snap('after Take a break');
  await click(page, 'Take a break');
  await snap('after Take a break again');
}
