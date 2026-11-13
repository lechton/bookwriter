import { submit } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await submit(page, sleep, snap, 'john@example.com', 'submit 1', [300, 1200, 3000]);
}
