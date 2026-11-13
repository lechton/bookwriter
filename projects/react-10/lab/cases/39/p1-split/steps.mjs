import { state, goOffline, goOnline, clickSave, openOffline } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  await state(page, 'after load');
  await goOffline(page, sleep);
  await snap('after the network goes off');
  await state(page, 'after the network goes off');
  await goOnline(page, sleep);
  await snap('after the network comes back');
  await state(page, 'after the network comes back');
  await clickSave(page, sleep);
  await snap('after the user clicks Save progress');
  await state(page, 'after the user clicks Save progress');
  await openOffline(page, sleep);
  await snap('after a user opens the app while offline');
  await state(page, 'after a user opens the app while offline');
  await clickSave(page, sleep);
  await state(page, 'after that user clicks the button');
}
