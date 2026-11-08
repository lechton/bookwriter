import { show, tick } from '../_lib.mjs';
export default async function ({ page, sleep }) {
  await show(page, 'after load');
  await tick(page, 'I agree'); await sleep(200);
  await show(page, 'after one click');
}
