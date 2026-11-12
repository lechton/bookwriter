import { watch, clickText, pick, typeEnd } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  await clickText(page, 'Open chat', sleep);
  await page.evaluate(() => { window.__h1 = document.querySelector('h1'); });
  await snap('after Open chat');
  w.mark('pick travel'); await pick(page, 'travel', sleep);
  await snap('after travel');
  w.mark('pick music'); await pick(page, 'music', sleep);
  await snap('after music');
  console.log('== same h1 node after travel and music: ' + await page.evaluate(() => window.__h1 === document.querySelector('h1') && document.querySelector('h1').isConnected));
  w.mark('Close chat'); await clickText(page, 'Close chat', sleep);
  await snap('after Close chat');
  w.dump();
}
