import { mark, type, arm, send, box, kept, alerts } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  alerts(page);
  await arm(page);
  await box(page, 'on load');
  await type(page, 'Hi');
  await mark(page, 'typed Hi, clicking Send');
  await send(page);
  await sleep(1000);
  await snap('after Send');
  await box(page, 'after Send');
  await kept(page);
}
