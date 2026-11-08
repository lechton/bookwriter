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
