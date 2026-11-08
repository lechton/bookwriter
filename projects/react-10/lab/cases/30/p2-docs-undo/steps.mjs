import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  dialogs(page);
  await page.click('::-p-text(Send)'); await sleep(300); await snap('after Send');
  await page.click('::-p-text(Undo)'); await sleep(3500); await snap('3.5 s after Undo');
}
