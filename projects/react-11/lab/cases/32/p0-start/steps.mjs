import { watch, press, heading } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  w.mark('before the click on Show counter');
  await press(page, 0);
  await sleep(300);
  await snap('right after the click on Show counter');
  await sleep(10000);
  console.log(`-- 10 s later: h1=${await heading(page)}`);
  await w.dump('10 s after the click');
}
