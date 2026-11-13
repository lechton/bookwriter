import { post } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await post(page, sleep, snap, 'Nice photo!');
}
