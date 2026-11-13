import { state, clickSave, traceLogs, mark } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const print = await traceLogs(page, sleep);
  await state(page, 'after load');
  await clickSave(page, sleep);
  await snap('after the user clicks Save progress');
  await state(page, 'after the user clicks Save progress');
  await print();
}
