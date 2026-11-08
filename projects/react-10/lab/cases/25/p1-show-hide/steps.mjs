import { click } from '../helper.mjs';
export default async function ({ page, snap }) {
  for (let i = 0; i < 3; i += 1) await page.evaluate(() => document.querySelectorAll('button')[1].click());
  await new Promise((d) => setTimeout(d, 200));
  await snap('after three clicks on Ben');
  await click(page, 'Show or hide Ben');
  await snap('after hiding Ben');
  await click(page, 'Show or hide Ben');
  await snap('after showing Ben again');
}
