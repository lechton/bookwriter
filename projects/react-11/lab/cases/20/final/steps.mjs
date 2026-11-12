import { both, typeInto, pick, tick, clickButton, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeInto(page, 'Name', 'Anna');
  await pick(page, 'Topic', 'payment');
  await typeInto(page, 'Message', 'Where is my parcel?');
  await tick(page, 'Email me a reply'); await sleep(200);
  await typeInto(page, 'Email', 'anna@example.com'); await sleep(200);
  await both(page, snap, 'after filling every part');
  await mark(page, 'Send');
  await clickButton(page, 'Send'); await sleep(200);
  await both(page, snap, 'after Send');
  console.log('== URL ' + page.url());
}
