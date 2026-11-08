import { clickIn } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  const before = await page.evaluate(() => {
    const b = [...document.querySelectorAll('li')][1].querySelector('button');
    const k = Object.keys(b).find((x) => x.startsWith('__reactProps'));
    return 'Mia button props onClick: ' + typeof b[k].onClick;
  });
  console.log(before);
  await clickIn(page, 'Mia', 'Remove');
  await sleep(300);
  await snap('after Remove on Mia');
}
