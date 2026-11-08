import { clickFirst, click } from '../helper.mjs';
export default async function ({ page, snap }) {
  await clickFirst(page, 3);
  await snap('after three clicks on the counter');
  await click(page, 'Next');
  await snap('after Next');
}
