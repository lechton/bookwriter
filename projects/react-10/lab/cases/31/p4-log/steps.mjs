import { watch, press, clickInput, focusInfo } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const c = watch(page);
  await page.reload({ waitUntil: 'networkidle0' }); await sleep(300);
  await c.dump('page load');
  c.mark('before Lunch');
  await clickInput(page, 0); await page.keyboard.type('John'); await sleep(200);
  c.mark('after typing John, before Add');
  await press(page, 0); await sleep(300);
  await focusInfo(page, 'after Add in Lunch');
  await snap('after Add in Lunch');
  await c.dump('click on Add in Lunch');
}
