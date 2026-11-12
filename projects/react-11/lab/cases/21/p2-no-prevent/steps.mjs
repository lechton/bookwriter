export default async function ({ page, sleep, snap }) {
  await page.evaluate(() => { window.__marker = 'still here'; });
  await page.type('input', 'mary@mail.com');
  await page.click('button');
  await sleep(1500);
  await snap('1.5 seconds after typing mary@mail.com and clicking Join, without preventDefault');
  console.log('== After click: ' + JSON.stringify(await page.evaluate(() => ({ href: location.href, marker: window.__marker ?? 'gone, the page reloaded' }))));
}
