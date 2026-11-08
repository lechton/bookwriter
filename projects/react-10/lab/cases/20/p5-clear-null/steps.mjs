import { both, typeInto, clickButton, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeInto(page, 'City', 'Rome'); await sleep(200);
  await mark(page, 'user clicks Clear');
  await clickButton(page, 'Clear'); await sleep(200);
  await both(page, snap, 'after Clear');
}
