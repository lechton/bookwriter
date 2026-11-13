import { submit } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await submit(page, sleep, snap, 'john@example.com', 'submit 1');
  await submit(page, sleep, snap, 'mia@example.com', 'submit 2');
  await submit(page, sleep, snap, 'john@example.com', 'submit 3');
}
