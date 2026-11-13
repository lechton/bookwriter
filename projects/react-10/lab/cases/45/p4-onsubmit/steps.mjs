import { fill, submit } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await fill(page, { username: 'john7', email: 'john@mail.com' });
  await submit(page, sleep, 'click with john7');
  await snap('after the click');
}
