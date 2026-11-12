import { typeSearch, state } from '../helper.mjs';
export default async function ({ page, snap }) {
  await typeSearch(page, 'tea');
  await snap('after typing tea ');
  console.log('after tick:', JSON.stringify(await state(page)));
}
