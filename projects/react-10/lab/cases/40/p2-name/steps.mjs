import { mark, type } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await mark(page, 'page loaded, typing j');
  await type(page, 'input', 'j');
  await sleep(200);
  await mark(page, 'typed j, typing o');
  await type(page, 'input', 'o');
  await sleep(200);
  await mark(page, 'typed jo');
  await snap('after typing jo');
}
