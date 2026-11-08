import { typeIn } from '../helper.mjs';
export default async function ({ page, sleep }) {
  await page.evaluate(() => {
    document.addEventListener('input', () => {
      requestAnimationFrame(() => {
        console.log('next frame: box', JSON.stringify(document.querySelector('input').value), 'badge', JSON.stringify(document.querySelector('h2').textContent));
      });
    }, true);
    console.log('--- user types J');
  });
  await typeIn(page, 'J');
  await sleep(300);
}
