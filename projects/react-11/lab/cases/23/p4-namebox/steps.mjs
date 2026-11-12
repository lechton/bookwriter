import { clickButton, typeIn } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  await typeIn(page, 'Leo');
  await clickButton(page, 'Add');
  await sleep(300);
  await snap('after typing Leo and clicking Add');
}
