import { serve, press } from '../server.mjs';
export default async function ({ page, sleep, snap }) {
  const s = await serve(page); await s.reload();
  await sleep(50); await snap('50 ms after load');
  await sleep(700); await snap('750 ms after load'); s.print('after load');
  await press(page, 'Bob'); await sleep(300); await snap('300 ms after click on Bob');
  await sleep(2200); await snap('2.5 s after click on Bob'); s.print('after Bob');
}
