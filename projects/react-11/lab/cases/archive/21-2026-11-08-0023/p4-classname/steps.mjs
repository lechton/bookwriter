import { both, typeInto, backspace, clickButton } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeInto(page, 'john@example.com');
  await clickButton(page, 'Subscribe'); await sleep(1800);
  await both(page, snap, 'on the error screen');
  await backspace(page); await sleep(200);
  await both(page, snap, 'after deleting the last letter');
}
