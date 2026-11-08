import { rows, clickRow, clickText, dialogs, scenarios } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await clickText(page, 'Empty cart');
}
