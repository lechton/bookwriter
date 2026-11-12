const fields = (page) => page.evaluate(() => [...document.querySelectorAll('input,textarea,select')].map((el) => {
  const kind = el.tagName.toLowerCase() + (el.tagName === 'INPUT' && el.getAttribute('type') ? '[' + el.type + ']' : '');
  if (el.type === 'checkbox') return kind + ': ' + (el.checked ? 'checked' : 'unchecked');
  if (el.tagName === 'SELECT') return kind + ': ' + JSON.stringify(el.value) + ' shows ' + el.options[el.selectedIndex].text;
  return kind + ': ' + JSON.stringify(el.value);
}));
const show = async (page, label) => { console.log('== Fields ' + label); console.log((await fields(page)).join('\n')); };
const mark = (page, text) => page.evaluate((t) => console.log('--- ' + t), text);

export default async function ({ page, sleep, snap }) {
  await page.type('input', 'Anna '); await sleep(200);
  await show(page, 'after Anna and a space');
  await page.type('input', 'L'); await sleep(200);
  await show(page, 'after L');
  await page.type('input', 'ee'); await sleep(300);
  await snap('after typing'); await show(page, 'after typing');
}
