import { mark, type } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await type(page, 'input[type=password]', 'secret1');
  await sleep(200);
  await snap('after typing 7 characters secret1');
  await type(page, 'input[type=password]', '2');
  await sleep(200);
  await snap('after typing the eighth character');
  console.log('== password value: ' + await page.$eval('input[type=password]', (i) => i.value));
}
