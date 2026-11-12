import { serve } from '../server.mjs';
export default async function ({ page, sleep }) {
  const s = await serve(page); await s.reload(); await sleep(600); s.print('all');
}
