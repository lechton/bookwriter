import { clickFirst } from '../helper.mjs';
export default async function ({ page, snap }) {
  await clickFirst(page, 2);
  await snap('after two clicks on the first counter');
}
