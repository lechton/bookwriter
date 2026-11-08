import { clickIn } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  console.log('== placeholder: ' + await page.$eval('input', i => i.placeholder + ' / value=' + JSON.stringify(i.value)));
  await page.type('input', 'a');
  await sleep(300);
  await clickIn(page, 'Sara', 'Make captain');
  await sleep(300);
  await snap('after typing a and Make captain on Sara');
}
