export const field = async (page, name) => {
  const labels = await page.$$('label');
  const texts = await Promise.all(labels.map((label) => label.evaluate((el) => el.textContent.trim())));
  let index = texts.findIndex((text) => text === name);
  if (index < 0) index = texts.findIndex((text) => text.startsWith(name));
  if (index < 0) throw new Error('no field ' + name);
  return labels[index].$('input, textarea, select');
};
export const typeInto = async (page, name, text) => {
  const el = await field(page, name);
  await el.click();
  await page.keyboard.press('End');
  await page.keyboard.type(text);
};
export const tick = async (page, name) => (await field(page, name)).click();
export const pick = async (page, name, value) => {
  const el = await field(page, name);
  await el.select(value);
};
export const clickButton = async (page, text) => {
  const buttons = await page.$$('button');
  for (const button of buttons) {
    if ((await button.evaluate((el) => el.textContent.trim())) === text) return button.click();
  }
  throw new Error('no button ' + text);
};
export const show = async (page, label) => {
  const lines = await page.evaluate(() => [...document.querySelectorAll('input, textarea, select')].map((el) => {
    const label = el.closest('label')?.childNodes[0]?.textContent.trim() || el.closest('label')?.textContent.trim() || '(no label)';
    if (el.type === 'checkbox') return label + ': checkbox checked=' + el.checked;
    const shown = el.value.length > 60 ? el.value.length + ' characters, ending ' + JSON.stringify(el.value.slice(-3)) : JSON.stringify(el.value);
    return label + ': ' + el.tagName.toLowerCase() + ' value=' + shown;
  }));
  console.log('== Controls ' + label);
  console.log(lines.join('\n') || '(none)');
};
export const both = async (page, snap, label) => { await snap(label); await show(page, label); };
export const mark = (page, text) => page.evaluate((t) => console.log('-- ' + t), text);
