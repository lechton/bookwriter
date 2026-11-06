export default async function ({ page, sleep, snap }) {
  await page.click('.next-btn');
  await page.click('.next-btn');
  await sleep(300);
  await snap('after two back-to-back clicks');
}
