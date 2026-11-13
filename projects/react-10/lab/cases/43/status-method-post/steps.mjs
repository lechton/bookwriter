export default async function ({ page, sleep, snap }) {
  await page.click('form button');
  await sleep(1500);
}
