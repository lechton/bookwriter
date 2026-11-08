import { both, typeInto, replaceWith, clickButton, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeInto(page, 'john@example.com');
  await mark(page, 'click Subscribe with john@example.com');
  await clickButton(page, 'Subscribe'); await sleep(200);
  await both(page, snap, '0.2 s after the first click');
  await sleep(1600);
  await both(page, snap, '1.8 s after the first click');
  await replaceWith(page, 'anna@example.com'); await sleep(200);
  await both(page, snap, 'after changing the email to anna@example.com');
  await mark(page, 'click Subscribe with anna@example.com');
  await clickButton(page, 'Subscribe').catch((e) => console.log('-- click failed: ' + e.message)); await sleep(200);
  await both(page, snap, '0.2 s after the second click');
  await sleep(1600);
  await both(page, snap, '1.8 s after the second click');
}
