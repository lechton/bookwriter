import { watch, clickText, pick, typeEnd } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  await clickText(page, 'Open chat', sleep);
  w.mark('pick travel'); await pick(page, 'travel', sleep);
  w.mark('type 5 in Server URL'); await typeEnd(page, 'section input', '5', sleep);
  await snap('after open, travel, type 5');
  console.log('== input value: ' + await page.evaluate(() => document.querySelector('section input').value));
  w.mark('Close chat'); await clickText(page, 'Close chat', sleep);
  await snap('after Close chat');
  w.dump();
}
