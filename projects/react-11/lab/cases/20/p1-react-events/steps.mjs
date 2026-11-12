import { both, typeInto, mark, clickButton } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await mark(page, 'user types Hi into the onChange box');
  await typeInto(page, 'Change box', 'Hi'); await sleep(200);
  await mark(page, 'user clicks somewhere else');
  await clickButton(page, 'Somewhere else'); await sleep(200);
  await mark(page, 'user types Hi into the onInput box');
  await typeInto(page, 'Input box', 'Hi'); await sleep(200);
  await both(page, snap, 'after both');
}
