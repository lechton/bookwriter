import { mark, type, arm, send, box, kept } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await arm(page);
  await type(page, 'Hi');
  await mark(page, 'typed Hi, clicking Send');
  await send(page);
  await sleep(300);
  await snap('300 ms after Send');
  await box(page, '300 ms after Send');
  await sleep(1200);
  await snap('1.5 s after Send');
  await box(page, '1.5 s after Send');
  await kept(page);
}
