export default async function ({ page, sleep, snap }) {
  const start = Date.now();
  const at = (ms) => sleep(Math.max(0, ms - (Date.now() - start)));
  await page.click('.next-btn');
  await at(200);
  await snap('0.2 s, after click 1');
  await at(1000);
  await page.click('.next-btn');
  await at(1200);
  await snap('1.2 s, after click 2');
  await at(3200);
  await snap('3.2 s, after timer 1');
  await at(4200);
  await snap('4.2 s, after timer 2');
}
