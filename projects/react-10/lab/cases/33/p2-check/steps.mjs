import { serve } from '../server.mjs';
export default async function ({ page, sleep, snap }) {
  const s = await serve(page, { failFor: ['Alice'] }); await s.reload(); await sleep(3000); await snap('3 s after load, Alice answers 500'); s.print('all');
}
