export const mark = (page, label) => page.evaluate((l) => console.log('### ' + l), label);
export const type = async (page, text) => { await page.type('input[name=message]', text, { delay: 40 }); };
export const retype = async (page, text) => { await page.evaluate(() => document.querySelector('input[name=message]').select()); await page.type('input[name=message]', text, { delay: 40 }); };
export const arm = (page) => page.evaluate(() => { window.__noReload = true; });
export const send = (page) => page.click('button[type=submit]');
export const box = async (page, label) => {
  const value = await page.evaluate(() => document.querySelector('input[name=message]')?.value ?? '(no box)');
  console.log('== box ' + label + ': ' + JSON.stringify(value));
};
export const kept = async (page) => {
  const alive = await page.evaluate(() => window.__noReload === true);
  console.log('== page kept without reload: ' + alive + ', url: ' + (await page.url()));
};
export const alerts = (page) => page.on('dialog', async (d) => { console.log('== alert: ' + JSON.stringify(d.message())); await d.accept(); });
