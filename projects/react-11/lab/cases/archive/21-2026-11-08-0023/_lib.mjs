export const box = (page) => page.$('input');
export const typeInto = async (page, text) => {
  const el = await box(page);
  await el.click();
  await page.keyboard.press('End');
  await page.keyboard.type(text);
};
export const replaceWith = async (page, text) => {
  const el = await box(page);
  await el.click();
  await el.evaluate((node) => node.select());
  await page.keyboard.type(text);
};
export const backspace = async (page) => {
  const el = await box(page);
  await el.click();
  await page.keyboard.press('End');
  await page.keyboard.press('Backspace');
};
export const clickButton = async (page, text) => {
  const buttons = await page.$$('button');
  for (const button of buttons) {
    if ((await button.evaluate((el) => el.textContent.trim())) === text) return button.click();
  }
  throw new Error('no button ' + text);
};
export const show = async (page, label) => {
  const lines = await page.evaluate(() => [...document.querySelectorAll('input, button')].map((el) => {
    const style = getComputedStyle(el);
    const parts = [el.tagName.toLowerCase()];
    if (el.tagName === 'INPUT') parts.push('value=' + JSON.stringify(el.value));
    else parts.push(JSON.stringify(el.textContent.trim()));
    parts.push('disabled=' + el.disabled);
    parts.push('class=' + JSON.stringify(el.getAttribute('class')));
    parts.push('border=' + style.borderTopWidth + ' ' + style.borderTopStyle + ' ' + style.borderTopColor);
    return parts.join(' ');
  }));
  console.log('== Controls ' + label);
  console.log(lines.join('\n') || '(none)');
};
export const both = async (page, snap, label) => { await snap(label); await show(page, label); };
export const mark = (page, text) => page.evaluate((t) => console.log('-- ' + t), text);
export const watchDom = (page) => page.evaluate(() => {
  window.__changes = [];
  const describe = (node) => node.nodeType === 1 ? '<' + node.tagName.toLowerCase() + '>' + node.textContent : JSON.stringify(node.textContent);
  window.__observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'attributes') window.__changes.push('attribute ' + r.attributeName + ' on <' + r.target.tagName.toLowerCase() + '>: ' + JSON.stringify(r.oldValue) + ' -> ' + JSON.stringify(r.target.getAttribute(r.attributeName)));
      else if (r.type === 'characterData') window.__changes.push('text ' + JSON.stringify(r.oldValue) + ' -> ' + JSON.stringify(r.target.textContent));
      else {
        for (const n of r.removedNodes) window.__changes.push('removed ' + describe(n));
        for (const n of r.addedNodes) window.__changes.push('added ' + describe(n));
      }
    }
  });
  window.__observer.observe(document.getElementById('root'), { subtree: true, childList: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true });
});
export const domChanges = async (page, label) => {
  const list = await page.evaluate(() => { const l = window.__changes; window.__changes = []; return l; });
  console.log('== DOM changes ' + label);
  console.log(list.join('\n') || '(none)');
};
