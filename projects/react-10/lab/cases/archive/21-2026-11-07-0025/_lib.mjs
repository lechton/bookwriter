export const controls = (page) => page.evaluate(() => [...document.querySelectorAll('input,button,img')].map((el) => {
  const shown = el.offsetParent !== null;
  const name = el.tagName === 'BUTTON' ? 'button ' + JSON.stringify(el.textContent.trim()) : el.tagName === 'IMG' ? 'img' : 'input ' + JSON.stringify(el.value);
  return name + (el.tagName === 'IMG' ? '' : el.disabled ? ' disabled' : ' enabled') + (shown ? '' : ' (not visible)') + (el.className ? ' class=' + JSON.stringify(el.className) : '');
}));
export const show = async (page, label) => { console.log('== Controls ' + label); console.log((await controls(page)).join('\n') || '(none)'); };
export const both = async (page, snap, label) => { await snap(label); await show(page, label); };
export const elements = async (page, label) => { console.log('== Elements ' + label); console.log(await page.evaluate(() => (document.getElementById('root') ?? document.body).innerHTML.trim())); };
export const typeIn = async (page, text) => { await page.click('input'); await page.keyboard.press('End'); await page.keyboard.type(text); };
export const clickApply = (page) => page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Apply'); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }).then(([x, y]) => page.mouse.click(x, y));
export const twoTries = async ({ page, sleep, snap }, withElements = false) => {
  await both(page, snap, 'after load');
  await typeIn(page, 'WELCOM'); await sleep(200);
  await both(page, snap, 'after typing WELCOM');
  await clickApply(page); await sleep(300);
  await both(page, snap, '0.3 s after Apply on WELCOM');
  if (withElements) await elements(page, '0.3 s after Apply on WELCOM');
  await sleep(1700);
  await both(page, snap, '2 s after Apply on WELCOM');
  if (withElements) await elements(page, '2 s after Apply on WELCOM');
  await typeIn(page, 'E'); await sleep(200);
  await both(page, snap, 'after typing E');
  await clickApply(page); await sleep(300);
  await both(page, snap, '0.3 s after Apply on WELCOME');
  await sleep(1700);
  await both(page, snap, '2 s after Apply on WELCOME');
  if (withElements) await elements(page, '2 s after Apply on WELCOME');
};
