import { show, pick, tick } from '../_lib.mjs';
export default async function ({ page, sleep }) {
  await show(page, 'after load');
  await page.evaluate(() => { const s = document.querySelector('select'); s.addEventListener('change', () => console.log('select reports:', s.value)); });
  await pick(page, 'Fruit', 'banana'); await sleep(200);
  await tick(page, 'I agree'); await sleep(200);
  await show(page, 'after picking Banana and ticking I agree');
}
