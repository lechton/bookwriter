import { mark, type, submit } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await type(page, 'input', 'john@mail.com');
  await mark(page, 'typed john@mail.com, clicking Sign up');
  await submit(page, sleep);
  await snap('after typing john@mail.com and clicking Sign up');
}
