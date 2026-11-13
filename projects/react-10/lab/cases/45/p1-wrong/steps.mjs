import { fill, submit } from '../_lib.mjs';
export default async function ({ page, sleep }) {
  await fill(page, { username: 'john' });
  await submit(page, sleep, 'click on Save', 500);
}
