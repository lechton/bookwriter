import { rows, clickRow, clickText, dialogs, scenarios } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const seen = dialogs(page);
  await scenarios(page);
  await sleep(300);
  console.log('pop-ups:', JSON.stringify(seen));
}
