import { typeSearch, tick, clearSearch, state } from '../helper.mjs';
export default async function ({ page, snap }) {
  console.log('on load:', JSON.stringify(await state(page)));
  await typeSearch(page, 'tea');
  await snap('after typing tea');
  await tick(page);
  await snap('after ticking the box');
  console.log('after tick:', JSON.stringify(await state(page)));
  await clearSearch(page);
  await snap('after clearing the search box, tick kept');
  console.log('after clear:', JSON.stringify(await state(page)));
}
