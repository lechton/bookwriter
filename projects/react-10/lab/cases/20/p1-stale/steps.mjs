import { both, typeInto } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeInto(page, 'Message', "Where"); await sleep(200);
  await both(page, snap, 'after typing Where');
}
