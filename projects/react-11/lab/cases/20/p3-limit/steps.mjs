import { both, typeInto } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeInto(page, 'Message', 'a'.repeat(200)); await sleep(200);
  await both(page, snap, 'after typing 200 letters a');
  await typeInto(page, 'Message', 'b'); await sleep(200);
  await both(page, snap, 'after typing one more letter b');
}
