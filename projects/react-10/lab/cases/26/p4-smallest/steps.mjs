import { typeSearch, state } from '../helper.mjs';
export default async function ({ page, snap }) {
  console.log('on load:', JSON.stringify(await state(page)));
  await typeSearch(page, 's');
  await snap('after typing s');
}
