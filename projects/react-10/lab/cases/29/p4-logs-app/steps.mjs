import { addOneBreadWithLocations } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await addOneBreadWithLocations(page, sleep, snap);
}
