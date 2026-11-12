import { rows, clickRow, clickText, dialogs, scenarios, logWithSource } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  logWithSource(page);
  console.log('--- loaded');
  await clickRow(page, 'Bread', 'Add one');
  await clickText(page, 'Empty cart');
}
