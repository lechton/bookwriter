import { serve } from '../server.mjs';
export default async function ({ page, sleep, snap }) {
  const s = await serve(page); await s.reload(); await sleep(10000); await snap('10 s after load'); s.print('10 s after load');
}
