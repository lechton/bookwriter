export default async function ({ page, sleep, snap }) {
  await page.type('label:nth-of-type(1) input', 'Mia');
  await page.type('label:nth-of-type(2) input', 'Hi');
  await sleep(300);
  await snap('after typing Mia in To and Hi in Message');
}
