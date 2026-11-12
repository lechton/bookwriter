import { boxAndBadge, clickButton, typeIn } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await typeIn(page, 'John');
  await sleep(300);
  await snap('after typing John');
  console.log('after typing', JSON.stringify(await boxAndBadge(page)));
  await clickButton(page, 'Start over');
  await sleep(300);
  await snap('after Start over');
  console.log('after Start over', JSON.stringify(await boxAndBadge(page)));
}
