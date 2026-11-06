export default async function ({ page, sleep, snap }) {
  await page.type('label:nth-of-type(1) input', 'xy');
  await sleep(300);
  await snap('after typing "xy" at the end of the Name box');
}
