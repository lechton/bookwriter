import { watch, press } from '../helper.mjs';
export default async function ({ page, sleep }) {
  const c = watch(page);
  const left = () => page.evaluate(() => document.getElementById('row').scrollLeft);
  console.log('-- scrollLeft after load:', await left());
  await press(page, 1); await sleep(800);
  console.log('-- scrollLeft after Last, scrollIntoView with no options:', await left());
  await press(page, 0); await sleep(1500);
  console.log('-- scrollLeft after Neo, smooth scrollIntoView:', await left());
  await c.dump('whole run');
}
