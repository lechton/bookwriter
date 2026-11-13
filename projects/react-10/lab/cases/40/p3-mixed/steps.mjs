import { mark, type, submit } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await mark(page, 'page loaded, typing john@mail.com');
  await type(page, 'input[name=email]', 'john@mail.com');
  await sleep(200);
  await mark(page, 'typed the email, typing s');
  await type(page, 'input[type=password]', 's');
  await sleep(200);
  await mark(page, 'typed s, typing ecret12');
  await type(page, 'input[type=password]', 'ecret12');
  await sleep(200);
  await snap('after typing secret12');
  await mark(page, 'console cleared here, clicking Sign up');
  await submit(page, sleep);
  await snap('after clicking Sign up');
}
