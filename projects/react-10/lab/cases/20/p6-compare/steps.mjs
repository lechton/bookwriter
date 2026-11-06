const fields = (page) => page.evaluate(() => [...document.querySelectorAll('input,textarea,select')].map((el) => {
  const kind = el.tagName.toLowerCase() + (el.tagName === 'INPUT' && el.getAttribute('type') ? '[' + el.type + ']' : '');
  if (el.type === 'checkbox') return kind + ': ' + (el.checked ? 'checked' : 'unchecked');
  if (el.tagName === 'SELECT') return kind + ': ' + JSON.stringify(el.value) + ' shows ' + el.options[el.selectedIndex].text;
  return kind + ': ' + JSON.stringify(el.value);
}));
const show = async (page, label) => { console.log('== Fields ' + label); console.log((await fields(page)).join('\n')); };
const mark = (page, text) => page.evaluate((t) => console.log('--- ' + t), text);

export default async function ({ page, sleep, snap }) {
  await mark(page, 'type P into the street box');
  await page.type('#street', 'P'); await sleep(300);
  await mark(page, 'type P into the city box');
  await page.type('#city', 'P'); await sleep(300);
  await show(page, 'after typing');
}
