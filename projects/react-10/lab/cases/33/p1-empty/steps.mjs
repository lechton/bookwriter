import { serve, press } from '../server.mjs';
export default async function ({ page, sleep, snap }) {
  const s = await serve(page); await s.reload(); await sleep(750);
  await press(page, 'Bob'); await sleep(2500); await snap('2.5 s after click on Bob'); s.print('all');
}
