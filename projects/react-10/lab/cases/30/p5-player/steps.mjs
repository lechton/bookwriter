import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep }) {
  console.log('-- after load: ' + JSON.stringify(await page.evaluate(() => window.__made)));
  for (let i = 0; i < 3; i++) { await press(page, 0); await sleep(200); }
  console.log('-- after three more renders: ' + JSON.stringify(await page.evaluate(() => window.__made)));
}
