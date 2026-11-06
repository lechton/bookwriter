export default async function ({ page, sleep, snap }) {
  await page.click('.plain');
  await page.click('.plain');
  await page.click('.updater');
  await page.click('.updater');
  await sleep(600);
  await snap('after two fast clicks on each button, 0.6 s later');
}
