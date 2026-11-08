export default async function ({ page, sleep, snap }) {
  await page.mouse.move(50, 60);
  await sleep(200);
  await snap('after moving the pointer to 50, 60');
  await page.click('::-p-text(Spread x)');
  await sleep(200);
  await snap('after Spread x');
  await page.mouse.move(50, 60);
  await page.mouse.move(30, 40);
  await sleep(200);
  await page.click('::-p-text(Only x)');
  await sleep(200);
  await snap('after Only x');
  await page.evaluate(() => window.scrollTo(0, 500));
  await sleep(200);
  await page.mouse.move(20, 70);
  await sleep(200);
  console.log('== Pointer on a page scrolled down 500 pixels: ' + JSON.stringify(await page.evaluate(() => window.__last)));
}
