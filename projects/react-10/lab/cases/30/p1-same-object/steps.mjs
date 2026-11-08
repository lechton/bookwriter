import { watch, press, dialogs } from '../helper.mjs';
export default async function ({ page, sleep }) {
  const c = watch(page); c.mark('before click');
  await press(page, 0); await sleep(300); await c.dump('click');
  console.log('-- ref objects pushed per render call: ' + JSON.stringify(await page.evaluate(() => ({ calls: window.__refs.length, distinct: new Set(window.__refs).size, sameFromSecond: window.__refs.slice(1).every(r => r === window.__refs[1]), firstIsSecond: window.__refs[0] === window.__refs[1], current: window.__refs.map(r => r.current) }))));
}
