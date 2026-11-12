import { clickFirst, click } from '../helper.mjs';
export default async function ({ page, snap }) {
  await clickFirst(page, 3);
  await snap('after three clicks');
  await click(page, 'Fancy');
  await snap('after Fancy');
}
