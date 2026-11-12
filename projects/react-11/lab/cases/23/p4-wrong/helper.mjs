export async function clickIn(page, name, label) {
  const ok = await page.evaluate((name, label) => {
    const li = [...document.querySelectorAll('li')].find((el) => el.firstChild && el.firstChild.textContent === name);
    if (!li) return false;
    const button = [...li.querySelectorAll('button')].find((b) => b.textContent === label);
    if (!button) return false;
    button.click();
    return true;
  }, name, label);
  if (!ok) throw new Error(`no ${label} button in the row of ${name}`);
}

export async function clickButton(page, label) {
  const ok = await page.evaluate((label) => {
    const button = [...document.querySelectorAll('button')].find((b) => b.textContent === label);
    if (!button) return false;
    button.click();
    return true;
  }, label);
  if (!ok) throw new Error(`no ${label} button`);
}

export async function typeIn(page, text) {
  await page.click('input');
  await page.type('input', text);
}

export async function rowKeys(page) {
  return page.evaluate(() => [...document.querySelectorAll('li')].map((li) => {
    const k = Object.keys(li).find((x) => x.startsWith('__reactFiber'));
    let f = li[k];
    while (f && f.key == null) f = f.return;
    return li.firstChild.textContent + ' key=' + (f ? f.key : 'none');
  }));
}
