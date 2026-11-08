import { clickIn } from './helper.mjs';
export default async function ({ page, sleep, snap }) {
  await page.type('input', 'a');
  await sleep(300);
  await snap('after typing a');
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(500);
  await snap('fresh page after reload');
  await clickIn(page, 'John', 'Remove');
  await sleep(300);
  await snap('after Remove on John');
  console.log('== placeholder: ' + await page.$eval('input', i => i.placeholder + ' / value=' + JSON.stringify(i.value)));
}
