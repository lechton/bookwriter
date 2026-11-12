import { watch, press } from '../helper.mjs';
// Place order, go to another page, press Back.
export default async function ({ page, sleep, snap }) {
  const w = await watch(page);
  await sleep(500);
  await press(page, 'Place order');
  await sleep(500);
  await snap('after the click on Place order');
  await w.dump('load and click on Place order');
  await w.mark();
  await page.goto('about:blank', { waitUntil: 'networkidle0' });
  await sleep(300);
  await page.goBack({ waitUntil: 'networkidle0' });
  await sleep(800);
  await snap('after going to another page and pressing Back');
  await w.dump('after going to another page and pressing Back');
}
