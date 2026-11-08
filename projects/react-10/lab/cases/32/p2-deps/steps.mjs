import { watch, press } from '../helper.mjs';
export default async function ({ page, sleep }) {
  const w = watch(page);
  w.mark('after load');
  await press(page, 1); await sleep(300); await w.dump('click on Other, unrelated state changes'); w.mark('-');
  await press(page, 2); await sleep(300); await w.dump('click on Same, isPlaying set to the same value'); w.mark('-');
  await press(page, 0); await sleep(300); await w.dump('click on Toggle, isPlaying becomes true'); w.mark('-');
  await press(page, 0); await sleep(300); await w.dump('click on Toggle, isPlaying becomes false');
}
