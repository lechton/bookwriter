const fields = (page) => page.evaluate(() => [...document.querySelectorAll('input,textarea,select')].map((el) => {
  const kind = el.tagName.toLowerCase() + (el.tagName === 'INPUT' && el.getAttribute('type') ? '[' + el.type + ']' : '');
  if (el.type === 'checkbox') return kind + ': ' + (el.checked ? 'checked' : 'unchecked');
  if (el.tagName === 'SELECT') return kind + ': ' + JSON.stringify(el.value) + ' shows ' + el.options[el.selectedIndex].text;
  return kind + ': ' + JSON.stringify(el.value);
}));
const show = async (page, label) => { console.log('== Fields ' + label); console.log((await fields(page)).join('\n')); };
const mark = (page, text) => page.evaluate((t) => console.log('--- ' + t), text);

export default async function ({ page, sleep, snap }) {
  await page.click('::-p-text(Message)'); await sleep(100);
  console.log('focus after clicking the word Message: ' + await page.evaluate(() => document.activeElement.tagName.toLowerCase()));
  await page.type('input', '  Anna Lee ');
  await page.select('select', 'delivery');
  await page.type('textarea', 'Where is my order?');
  await page.click('input[type=checkbox]'); await sleep(300);
  await page.type('input[type=email]', 'anna@example.com'); await sleep(300);
  await snap('before Send'); await show(page, 'before Send');
  await mark(page, 'Send');
  await page.click('button[type=submit]'); await sleep(300);
  await snap('after Send'); await show(page, 'after Send');
}
