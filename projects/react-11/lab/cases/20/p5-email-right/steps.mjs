import { both, typeInto, pick, tick, mark } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await typeInto(page, 'Name', 'Anna'); await pick(page, 'Topic', 'payment'); await sleep(200);
  await mark(page, 'user ticks Email me a reply');
  await tick(page, 'Email me a reply'); await sleep(200);
  await both(page, snap, 'after ticking Email me a reply');
  await mark(page, 'user types a into Email');
  await typeInto(page, 'Email', 'a'); await sleep(200);
  await both(page, snap, 'after typing a into Email');
}
