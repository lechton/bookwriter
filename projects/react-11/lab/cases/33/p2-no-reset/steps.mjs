import { serve, press } from '../server.mjs';
export default async function ({ page, sleep, snap }) {
  const s = await serve(page, { failFor: ['Alice'] }); await s.reload(); await sleep(1000); await snap('1 s after load, Alice answers 500');
  await press(page, 'Taylor'); await sleep(1000); await snap('1 s after click on Taylor, Taylor answers 200'); s.print('all');
}
