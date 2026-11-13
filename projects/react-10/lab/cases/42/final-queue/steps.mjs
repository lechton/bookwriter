import { type, send, mark, state } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await type(page, 'john@example.com');
  await mark(page, 'clicking Sign up twice, 100 ms apart');
  await send(page);
  await sleep(100);
  await send(page);
  for (const t of [300, 600, 600, 600, 600]) { await sleep(t); await state(page, 'sample'); }
  await snap('end');
}
