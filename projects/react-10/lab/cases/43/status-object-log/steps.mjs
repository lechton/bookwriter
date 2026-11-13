export default async function ({ page, sleep, snap }) {
  await page.click('form button');
  await sleep(300);
  await snap('300 ms after Send');
  await sleep(1200);
}
