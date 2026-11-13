import { mark, type } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await mark(page, 'page loaded, typing s into the Password box');
  await type(page, 'input[type=password]', 's');
  await sleep(200);
  await mark(page, 'typed s');
  await snap('after typing s');
}
