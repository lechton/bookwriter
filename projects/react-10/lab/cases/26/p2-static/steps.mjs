import { typeSearch, tick, state } from '../helper.mjs';
export default async function ({ page, snap }) {
  console.log('on load:', JSON.stringify(await state(page)));
  await typeSearch(page, 'tea');
  await tick(page);
  await snap('after typing and clicking the tick box');
  console.log('after typing and tick:', JSON.stringify(await state(page)));
}
