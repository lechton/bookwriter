const fields = (page) => page.evaluate(() => [...document.querySelectorAll('input,textarea,select')].map((el) => {
  const kind = el.tagName.toLowerCase() + (el.tagName === 'INPUT' && el.getAttribute('type') ? '[' + el.type + ']' : '');
  if (el.type === 'checkbox') return kind + ': ' + (el.checked ? 'checked' : 'unchecked');
  if (el.tagName === 'SELECT') return kind + ': ' + JSON.stringify(el.value) + ' shows ' + el.options[el.selectedIndex].text;
  return kind + ': ' + JSON.stringify(el.value);
}));
const show = async (page, label) => { console.log('== Fields ' + label); console.log((await fields(page)).join('\n')); };
const mark = (page, text) => page.evaluate((t) => console.log('--- ' + t), text);

export default async function ({ page, sleep, snap }) {
  for (const id of ['up', 'late', 'plain']) {
    await page.click('#' + id);
    await page.keyboard.type(id === 'up' ? 'ABCD' : 'abcd', { delay: 120 });
    await sleep(200);
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('x'); await sleep(300);
    const r = await page.$eval('#' + id, (el) => JSON.stringify(el.value) + ', caret at ' + el.selectionStart + ' of ' + el.value.length);
    console.log(id + ' after typing x two places from the end: ' + r + ', the caret was at 2 before x, so it should be at 3');
  }
}
