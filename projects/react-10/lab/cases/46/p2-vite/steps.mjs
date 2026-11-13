export default async function ({ page, sleep, snap }) {
  await page.reload({ waitUntil: 'load' });
  await snap('right after a fresh load');
  await sleep(1300);
  await snap('about one second later');
}
