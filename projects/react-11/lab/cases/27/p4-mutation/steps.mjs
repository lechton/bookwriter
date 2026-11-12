import { rows, clickRow, clickText, dialogs, scenarios } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await clickRow(page, 'Bread', 'Add one');
  await snap('after one Add one in Bread');
}
