import { both, typeIn, clickApply } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  const cdp = await page.createCDPSession();
  await cdp.send('Runtime.enable');
  cdp.on('Runtime.exceptionThrown', (e) => console.log('== Chrome Console error line: ' + e.exceptionDetails.text + ' ' + String(e.exceptionDetails.exception?.description ?? '').split('\n')[0]));
  await typeIn(page, 'WELCOM'); await sleep(200);
  await clickApply(page); await sleep(300);
  await both(page, snap, '0.3 s after Apply');
  await sleep(3700);
  await both(page, snap, '4 s after Apply');
}
