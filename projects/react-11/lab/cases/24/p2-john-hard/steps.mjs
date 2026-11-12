import { boxAndBadge, typeIn } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await typeIn(page, 'ny');
  await sleep(300);
  await snap('after typing ny at the end');
  console.log('box and badge', JSON.stringify(await boxAndBadge(page)));
}
