import { post } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await post(page, sleep, snap, 'Nice photo!', { waits: [300, 1000, 1500], again: true });
}
