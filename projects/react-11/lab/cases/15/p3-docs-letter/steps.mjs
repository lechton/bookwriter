export default async function ({ page, sleep, snap }) {
  await page.click('button[type=submit]');
  await sleep(500);
  await page.select('select', 'Bob');
  await sleep(300);
  await snap('after Send to Alice, then switching to Bob');
  await sleep(4700);
  await snap('5.5 s after Send');
}
