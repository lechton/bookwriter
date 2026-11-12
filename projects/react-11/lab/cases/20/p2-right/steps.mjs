import { both, typeInto, clickButton, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeInto(page, 'Message', 'Where is my parcel?'); await sleep(200);
  await both(page, snap, 'after typing');
  await mark(page, 'first Send');
  await clickButton(page, 'Send'); await sleep(200);
  await both(page, snap, 'after the first Send');
  await mark(page, 'second Send');
  await clickButton(page, 'Send'); await sleep(200);
  await both(page, snap, 'after the second Send');
  console.log('== URL ' + page.url());
}
