import { mark, type } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await mark(page, 'page loaded, typing j');
  await type(page, 'input', 'j');
  await sleep(200);
  await snap('after typing j');
}
