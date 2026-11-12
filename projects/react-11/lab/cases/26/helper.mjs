export const wait = (ms = 250) => new Promise((done) => setTimeout(done, ms));

export async function typeSearch(page, text) {
  await page.click('input:not([type="checkbox"])');
  await page.keyboard.press('End');
  for (const ch of text) {
    await page.keyboard.type(ch);
    await wait(150);
    console.log(`after typing "${ch}":`, JSON.stringify(await state(page)));
  }
}

export async function clearSearch(page) {
  await page.click('input:not([type="checkbox"])');
  const len = await page.evaluate(() => document.querySelector('input:not([type="checkbox"])').value.length);
  await page.keyboard.press('End');
  for (let i = 0; i < len; i += 1) await page.keyboard.press('Backspace');
  await wait();
}

export async function tick(page) {
  await page.click('input[type="checkbox"]');
  await wait();
}

export async function state(page) {
  return page.evaluate(() => {
    const box = document.querySelector('input:not([type="checkbox"])');
    const check = document.querySelector('input[type="checkbox"]');
    return {
      box: box ? box.value : null,
      placeholder: box ? box.placeholder : null,
      checked: check ? check.checked : null,
      rows: [...document.querySelectorAll('li')].map((li) => li.textContent),
    };
  });
}
