export default async function ({ page, sleep, snap }) {
  await page.setJavaScriptEnabled(false);
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(300);
  await snap('after a reload with JavaScript turned off');
  const html = await page.evaluate(() => document.getElementById('root')?.outerHTML);
  console.log('== #root with JavaScript turned off: ' + html);
}
