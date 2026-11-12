import { press, clickInput, focusInfo } from '../helper.mjs';
export default async function ({ page, sleep }) {
  await clickInput(page, 0); await page.keyboard.type('John'); await press(page, 0); await sleep(300);
  await focusInfo(page, 'one list with the id, after Add');
}
