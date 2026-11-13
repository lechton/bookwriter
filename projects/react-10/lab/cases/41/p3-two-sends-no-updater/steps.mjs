import { mark, type, retype, arm, send, box, kept } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await arm(page);
  await type(page, 'Hi');
  await mark(page, 'typed Hi, clicking Send');
  await send(page);
  await sleep(300);
  await retype(page, 'Bye');
  await box(page, 'typed Bye during the wait');
  await mark(page, 'typed Bye during the wait, clicking Send again');
  await send(page);
  await sleep(500);
  await snap('about 1 s after the first Send');
  await sleep(1500);
  await snap('after both waits');
  await box(page, 'after both waits');
  await kept(page);
}
