import { rows, clickRow, clickText, dialogs, scenarios, logWithSource } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  logWithSource(page);
  await clickText(page, 'Empty cart');
}
