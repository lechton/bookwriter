const dom = (page) =>
  page.evaluate(() => ['signup', 'error', 'welcome'].map((id) => {
    const el = document.getElementById(id);
    return `${el.tagName.toLowerCase()}#${id} style="${el.getAttribute('style')}" visible=${el.checkVisibility()}`;
  }));

export default async function ({ page, sleep, snap }) {
  console.log('== DOM on load: ' + JSON.stringify(await dom(page)));
  await page.type('#email', 'mary');
  await page.click('button');
  await sleep(200);
  await snap('after typing mary and clicking Join');
  console.log('== DOM: ' + JSON.stringify(await dom(page)));
  await page.type('#email', '@mail.com');
  await page.click('button');
  await sleep(200);
  await snap('after typing mary@mail.com and clicking Join');
  console.log('== DOM: ' + JSON.stringify(await dom(page)));
}
