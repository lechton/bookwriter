export const box = (page) => page.$('input');
export const clickButton = async (page, text) => {
  const buttons = await page.$$('button');
  for (const button of buttons) {
    if ((await button.evaluate((el) => el.textContent.trim())) === text) return button.click();
  }
  throw new Error('no button ' + text);
};
export const typeCode = async (page, text) => {
  const el = await box(page);
  await el.click();
  await page.keyboard.press('End');
  for (let i = 0; i < 12; i += 1) await page.keyboard.press('Backspace');
  await page.keyboard.type(text);
};
export const show = async (page, label) => {
  const lines = await page.evaluate(() => [...document.querySelectorAll('input, button')].map((el) => {
    if (el.tagName === 'BUTTON') return 'button ' + JSON.stringify(el.textContent.trim()) + ' disabled=' + el.disabled;
    return 'input value=' + JSON.stringify(el.value) + ' disabled=' + el.disabled;
  }));
  console.log('== Controls ' + label);
  console.log(lines.join('\n') || '(none)');
};
export const both = async (page, snap, label) => { await snap(label); await show(page, label); };
export const mark = (page, text) => page.evaluate((t) => console.log('-- ' + t), text);
