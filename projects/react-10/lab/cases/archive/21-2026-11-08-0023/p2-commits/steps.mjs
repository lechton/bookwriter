import { typeInto, replaceWith, clickButton, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await replaceWith(page, 'john@example.com'); await sleep(200);
  await clickButton(page, 'Subscribe'); await sleep(1800);
  await snap('on the error screen');
  await mark(page, 'the user types one letter on the error screen');
  await typeInto(page, 'x'); await sleep(300);
  await mark(page, 'end');
  await snap('after one letter');
}
