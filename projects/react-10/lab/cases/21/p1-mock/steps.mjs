export default async function ({ page, sleep, snap }) {
  const before = await page.evaluate(() => { window.__marker = 'still here'; return location.href; });
  console.log('== URL before click: ' + before);
  await Promise.all([
    page.waitForNavigation({ timeout: 3000 }).then(() => 'navigated').catch(() => 'no navigation'),
    page.click('form button[type=submit]'),
  ]).then(([nav]) => console.log('== Click on Join in the typing copy: ' + nav));
  await sleep(500);
  const after = await page.evaluate(() => ({ href: location.href, marker: window.__marker ?? 'gone, the page reloaded' }));
  console.log('== After click: ' + JSON.stringify(after));
  await snap('after the click on Join in the typing copy');
}
