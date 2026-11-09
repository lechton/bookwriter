import { serve, press } from '../server.mjs';
export default async function ({ page, sleep, snap }) {
  const s = await serve(page); await s.reload(); await sleep(300);
  await press(page, 'Close'); await sleep(2500); await snap('2.5 s after Close, Bob answered after Bio unmounted'); s.print('all');
}
