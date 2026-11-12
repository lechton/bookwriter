import { both } from '../_lib.mjs';
export default async function ({ page, snap }) {
  await both(page, snap, 'after load');
}
