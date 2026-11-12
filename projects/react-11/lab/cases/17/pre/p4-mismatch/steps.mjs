export default async function ({ page, sleep, snap }) {
  await page.type('label:nth-of-type(2) input', 'Hi');
  await sleep(300);
  await snap('after typing Hi in the Message box');
}
