import { typeAndSend } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  await typeAndSend(page, sleep, snap);
}
