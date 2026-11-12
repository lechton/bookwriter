export default async function ({ page, sleep, snap }) {
  await page.mouse.move(40, 60);
  await sleep(200);
  const box = await page.$eval('#one', el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y }; });
  await page.mouse.move(box.x + 50, box.y + 70);
  await sleep(300);
  await snap('after moving the pointer over both areas');
  await page.click('::-p-text(Spread then x)');
  await sleep(300);
  await snap('after setPosition with spread and x 100');
  await page.mouse.move(5, 500);
  await page.click('::-p-text(Only x)');
  await sleep(300);
  await snap('after setPosition({ x: 100 })');
}
