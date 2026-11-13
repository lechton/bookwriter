import { fill, submit } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await snap('before typing');
  await fill(page, { username: 'john', email: 'john@mail.com' });
  await submit(page, sleep, 'click 1 with john');
  await snap('after click 1');
  await fill(page, { username: 'john7', email: 'john@mail.com' });
  await submit(page, sleep, 'click 2 with john7');
  await snap('after click 2');
}
