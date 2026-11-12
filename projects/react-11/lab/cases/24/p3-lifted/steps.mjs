import { boxAndBadge, typeIn } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await typeIn(page, 'J');
  await sleep(300);
  await snap('after typing J');
  await typeIn(page, 'ohn');
  await sleep(300);
  await snap('after typing John');
  console.log('box and badge', JSON.stringify(await boxAndBadge(page)));
}
