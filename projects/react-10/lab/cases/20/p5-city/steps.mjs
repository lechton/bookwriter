import { both, typeInto, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await mark(page, 'user types a');
  await typeInto(page, 'City', 'a'); await sleep(200);
  await both(page, snap, 'after typing a');
}
