import { both, typeInto, replaceWith, clickButton, mark, watchDom, domChanges } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeInto(page, 'john@example.com');
  await mark(page, 'click Subscribe with john@example.com');
  await clickButton(page, 'Subscribe'); await sleep(200);
  await both(page, snap, '0.2 s after the first click');
  await watchDom(page);
  await sleep(1600);
  await both(page, snap, '1.8 s after the first click');
  await domChanges(page, 'when the timer ends with john@example.com');
  await typeInto(page, 'x'); await sleep(200);
  await both(page, snap, 'after typing one more letter on the error screen');
  await replaceWith(page, 'john@example.com'); await sleep(200);
  await clickButton(page, 'Subscribe'); await sleep(1800);
  await both(page, snap, 'back on the error screen');
  await replaceWith(page, 'anna@example.com'); await sleep(200);
  await mark(page, 'click Subscribe with anna@example.com');
  await clickButton(page, 'Subscribe'); await sleep(200);
  await both(page, snap, '0.2 s after the click with anna@example.com');
  await sleep(1600);
  await both(page, snap, '1.8 s after the click with anna@example.com');
}
