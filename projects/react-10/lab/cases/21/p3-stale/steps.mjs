import { typeIn, clickApply } from '../_lib.mjs';
export default async function ({ page, sleep }) {
  await typeIn(page, 'WELCOM'); await sleep(200);
  await clickApply(page); await sleep(2000);
  await typeIn(page, 'E'); await sleep(200);
  await clickApply(page); await sleep(2000);
}
