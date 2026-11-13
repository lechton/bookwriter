export const mark = (page, label) => page.evaluate((l) => console.log('### ' + l), label);
export const type = async (page, selector, text) => { await page.type(selector, text, { delay: 40 }); };
export const submit = async (page, sleep) => {
  await page.evaluate(() => { window.__noReload = true; });
  const values = [];
  const listen = (msg) => values.push(Promise.all(msg.args().map((arg) => arg.jsonValue())));
  page.on('console', listen);
  await page.click('button[type=submit]');
  await sleep(300);
  page.off('console', listen);
  for (const args of await Promise.all(values)) console.log('== submit log values: ' + JSON.stringify(args));
  const alive = await page.evaluate(() => window.__noReload === true);
  console.log('== page kept without reload: ' + alive);
};
