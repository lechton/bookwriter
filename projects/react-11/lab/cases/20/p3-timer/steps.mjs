import { both, typeInto } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeInto(page, 'Name', 'Anna'); await sleep(500);
  await both(page, snap, 'after typing Anna and waiting 0.5 s');
}
