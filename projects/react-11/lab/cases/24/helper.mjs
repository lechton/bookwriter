export async function typeIn(page, text) {
  await page.click('input');
  await page.keyboard.press('End');
  await page.type('input', text);
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

export async function boxAndBadge(page) {
  return page.evaluate(() => ({
    box: document.querySelector('input')?.value,
    badge: document.querySelector('h2')?.textContent,
  }));
}
