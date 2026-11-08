import { mapDump, watch, press, sample } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  w.mark('before the click on Show counter');
  await press(page, 0);
  await sample(page, w, 3, sleep);
  await press(page, 0);
  await sleep(200);
  await snap('after Hide counter');
  await press(page, 0);
  await sleep(200);
  await snap('right after the second Show counter');
  await mapDump(page, w, '/src/components/Counter.jsx', 'show 3 s, hide, show');
}
