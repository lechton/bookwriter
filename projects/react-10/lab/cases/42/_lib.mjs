export const mark = (page, label) => page.evaluate((l) => console.log('### ' + l), label);
export const type = async (page, text) => { await page.type('input[name=email]', text, { delay: 20 }); };
export const send = (page) => page.click('form button');
export const state = async (page, label) => {
  const s = await page.evaluate(() => {
    const i = document.querySelector('input[name=email]');
    const b = document.querySelector('form button');
    return { box: i ? i.value : '(no box)', button: b ? b.textContent : '(no button)', disabled: b ? b.disabled : null, line: document.querySelector('form p')?.textContent ?? '(no line)' };
  });
  console.log('== ' + label + ': ' + JSON.stringify(s));
};
export const submit = async (page, sleep, snap, email, label, waits = [300, 1200]) => {
  await type(page, email);
  await mark(page, label + ': typed ' + email + ', clicking Sign up');
  await send(page);
  let t = 0;
  for (const w of waits) { await sleep(w); t += w; await snap(label + ', ' + t + ' ms after Sign up'); await state(page, label + ', ' + t + ' ms'); }
};
