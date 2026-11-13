import { clickHeart } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await clickHeart(page, sleep, snap, 'click 1 on the white heart');
}
