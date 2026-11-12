import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep }) {
  dialogs(page);
  await press(page, 0); await press(page, 1); await sleep(1800);
  console.log('-- pop-ups above, after clicking Launch then Boil at once');
}
