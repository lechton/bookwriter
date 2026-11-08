import { rows, clickRow, clickText, dialogs, scenarios } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  await clickRow(page, 'Milk', 'Remove one');
  await clickRow(page, 'Bread', 'Remove one');
}
