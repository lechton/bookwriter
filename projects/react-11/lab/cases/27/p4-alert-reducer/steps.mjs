import { rows, clickRow, clickText, dialogs, scenarios } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const seen = dialogs(page);
  await clickText(page, 'Empty cart');
  await sleep(500);
  console.log('pop-ups:', JSON.stringify(seen));
}
