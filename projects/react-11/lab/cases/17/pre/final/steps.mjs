export default async function ({ page, sleep, snap }) {
  await page.type('label:nth-of-type(1) input', 'Mia');
  await page.type('label:nth-of-type(2) input', 'Hi');
  await sleep(300);
  await snap('after typing Mia in To and Hi in Message');
  await page.click('section > button:nth-of-type(4)');
  await sleep(300);
  await snap('after Start over');
  const values = await page.evaluate(() => [...document.querySelectorAll('input')].map(i => i.value));
  console.log('== Box values after Start over');
  console.log(JSON.stringify(values));
}
