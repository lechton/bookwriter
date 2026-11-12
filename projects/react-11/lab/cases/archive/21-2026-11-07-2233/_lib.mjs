export const state = (page) =>
  page.evaluate(() => {
    const input = document.querySelector('input');
    const button = [...document.querySelectorAll('button')].find((b) => b.textContent === 'Check');
    return {
      box: input ? { value: input.value, disabled: input.disabled } : null,
      check: button ? { disabled: button.disabled } : null,
    };
  });

export const show = async (page, snap, label) => {
  await snap(label);
  console.log('== Controls ' + label);
  console.log(JSON.stringify(await state(page)));
};

export const clickCheck = (page) =>
  page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Check').click());

export const clearBox = async (page) => {
  await page.click('input');
  const length = await page.$eval('input', (el) => el.value.length);
  for (let i = 0; i < length; i += 1) await page.keyboard.press('Backspace');
};
