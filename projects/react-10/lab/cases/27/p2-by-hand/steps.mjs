import { rows, clickRow, clickText, dialogs, scenarios } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  console.log('on load:', JSON.stringify(await rows(page)));
}
