import { both, typeInto, clickButton, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeInto(page, 'Name', 'Anna'); await sleep(200);
  await both(page, snap, 'after typing Anna');
  await typeInto(page, 'Message', 'Hi'); await sleep(200);
  await mark(page, 'Send');
  await clickButton(page, 'Send'); await sleep(200);
  await both(page, snap, 'after typing Hi in Message and clicking Send');
}
