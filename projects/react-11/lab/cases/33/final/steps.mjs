import { serve, press } from '../server.mjs';
export default async function ({ page, sleep, snap }) {
  const s = await serve(page); await s.reload(); await sleep(1000); await snap('1 s after load');
  await press(page, 'Bob'); await sleep(500); await press(page, 'Taylor');
  await sleep(500); await snap('500 ms after click on Taylor');
  await sleep(2000); await snap('3 s after click on Bob'); s.print('all');
  const e = await page.evaluate(async () => { const c = new AbortController(); const p = fetch('/api/bio/Bob', { signal: c.signal }); c.abort(); try { await p; return 'no error'; } catch (err) { return { name: err.name, message: err.message, isDOMException: err instanceof DOMException }; } });
  console.log('-- aborted fetch error: ' + JSON.stringify(e));
}
