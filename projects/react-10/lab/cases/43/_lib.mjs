export const mark = (page, label) => page.evaluate((l) => console.log('### ' + l), label);
export const state = async (page, label) => {
  const s = await page.evaluate(() => {
    const i = document.querySelector('input[name=comment]');
    const b = document.querySelector('form button');
    return {
      list: [...document.querySelectorAll('li')].map((li) => li.textContent),
      box: i ? i.value : '(no box)',
      button: b ? b.textContent : '(no button)',
      disabled: b ? b.disabled : null,
      disabledAttr: b ? b.hasAttribute('disabled') : null,
      line: document.querySelector('form p')?.textContent ?? '(no line)',
      footerHTML: document.querySelector('form div')?.outerHTML ?? '(no div)',
    };
  });
  console.log('== ' + label + ': ' + JSON.stringify(s));
};
export const type = (page, text) => page.type('input[name=comment]', text, { delay: 20 });
export const post = async (page, sleep, snap, text, { waits = [300, 1200], again = false } = {}) => {
  await state(page, 'before typing');
  await type(page, text);
  await mark(page, 'typed ' + text + ', clicking Post');
  await page.click('form button');
  let t = 0;
  for (const [n, w] of waits.entries()) {
    await sleep(w); t += w;
    await snap(t + ' ms after Post');
    await state(page, t + ' ms after Post');
    if (again && n === 0) {
      await mark(page, 'clicking Post again');
      await page.click('form button');
    }
  }
};
