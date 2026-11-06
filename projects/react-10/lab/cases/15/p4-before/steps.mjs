export default async function ({ page, sleep, snap }) {
  const start = Date.now();
  await page.click('.next-btn');
  await sleep(200);
  await snap('0.2 seconds after click 1');
  await sleep(3400 - (Date.now() - start));
  await snap('3.4 seconds after click 1');
}
