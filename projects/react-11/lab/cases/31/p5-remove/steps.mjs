import { watch, press } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page);
  for (let i = 0; i < 4; i++) { await press(page, 0); await sleep(200); await snap('toggle ' + (i + 1)); }
  await c.dump('toggles');
  c.mark('before Remove');
  await press(page, 1); await sleep(300); await snap('after Remove from the DOM');
  await c.dump('Remove'); c.mark('before last toggle');
  await press(page, 0); await sleep(500); await snap('after Toggle with setState');
  await c.dump('last toggle');
}
