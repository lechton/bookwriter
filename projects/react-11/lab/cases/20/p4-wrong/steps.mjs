import { both, typeInto, pick, tick, clickButton, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeInto(page, 'Name', 'Anna'); await pick(page, 'Topic', 'payment'); await sleep(200);
  await both(page, snap, 'after typing Anna and picking Payment');
  await tick(page, 'Email me a reply'); await sleep(200);
  await both(page, snap, 'after the first click on the tick box');
  await tick(page, 'Email me a reply'); await sleep(200);
  await both(page, snap, 'after the second click on the tick box');
  await tick(page, 'Email me a reply'); await sleep(200);
  await both(page, snap, 'after the third click on the tick box');
  await mark(page, 'Send');
  await clickButton(page, 'Send'); await sleep(200);
  await both(page, snap, 'after Send');
}
