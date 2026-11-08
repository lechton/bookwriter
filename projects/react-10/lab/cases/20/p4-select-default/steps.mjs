import { show, pick } from '../_lib.mjs';
export default async function ({ page, sleep }) {
  await show(page, 'after load');
  await pick(page, 'Topic', 'other'); await sleep(200);
  await show(page, 'after picking Other');
}
