export default async function ({ page, sleep, snap }) {
  await page.click('button'); await sleep(200);
  await snap('0.2 s after the click');
  await sleep(1600);
  await snap('1.8 s after the click');
}
