import { both, typeInto, clickButton } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeInto(page, 'Name', 'John'); await sleep(200);
  await both(page, snap, 'after typing John');
  await clickButton(page, 'Clear'); await sleep(200);
  await both(page, snap, 'after Clear');
}
