import { typeSearch, tick, state } from '../helper.mjs';
export default async function ({ page, snap }) {
  await typeSearch(page, 'tea');
  await tick(page);
  await snap('after typing tea and ticking the box');
  console.log('after tick:', JSON.stringify(await state(page)));
}
