import { mapDump, watch, press, sample, source } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  if (process.env.SHOW_SOURCE) await source(page, '/src/components/Counter.jsx');
  w.mark('before the click on Show counter');
  await press(page, 0);
  await sample(page, w, Number(process.env.SECONDS ?? 4), sleep);
  await snap('after the samples');
  await mapDump(page, w, '/src/components/Counter.jsx', 'since the click on Show counter');
}
