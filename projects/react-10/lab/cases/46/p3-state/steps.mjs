export default async function ({ page, sleep, snap }) {
  await snap('on the home page');
  console.log('== Address bar before the click');
  console.log(await page.evaluate(() => location.pathname));
  await page.click('::-p-text(Blue Sneakers)');
  await snap('right after the click on Blue Sneakers');
  await sleep(1300);
  await snap('about one second after the click');
  const href = await page.evaluate(() => location.href);
  console.log('== Address bar after the click');
  console.log(new URL(href).pathname);
  await page.goto(href, { waitUntil: 'load' });
  await sleep(300);
  await snap('after the friend opens the copied link');
}
