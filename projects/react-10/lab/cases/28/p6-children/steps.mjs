import { toggleTwice } from '../helper.mjs';
export default async function ({ page, sleep }) {
  await toggleTwice(page, sleep);
}
