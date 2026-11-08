import { both, clickButton, typeCode } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeCode(page, 'SUMMER'); await clickButton(page, 'Apply'); await sleep(200);
  await both(page, snap, 'after SUMMER and a click on Apply');
  await typeCode(page, 'SAVE10'); await clickButton(page, 'Apply'); await sleep(200);
  await both(page, snap, 'after SAVE10 and a second click on Apply');
}
