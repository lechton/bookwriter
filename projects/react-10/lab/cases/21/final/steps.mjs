const state = (page) =>
  page.evaluate(() => {
    const input = document.querySelector('input');
    const button = document.querySelector('button');
    return {
      inputValue: input?.value ?? null,
      inputDisabled: input ? input.disabled : null,
      buttonDisabled: button ? button.disabled : null,
      sameInputAsBeforeSecondClick: input ? input.__mark === 'first' : null,
      href: location.href,
    };
  });

export default async function ({ page, sleep, snap }) {
  console.log('== State on load: ' + JSON.stringify(await state(page)));
  await page.type('input', 'mary');
  await page.click('button');
  await sleep(200);
  await snap('after typing mary and clicking Join');
  console.log('== State: ' + JSON.stringify(await state(page)));
  await page.type('input', '@mail.com');
  await page.evaluate(() => { document.querySelector('input').__mark = 'first'; });
  const start = Date.now();
  await page.click('button');
  await sleep(200);
  await snap('0.2 seconds after typing mary@mail.com and clicking Join');
  console.log('== State: ' + JSON.stringify(await state(page)));
  await sleep(1400 - (Date.now() - start));
  await snap('1.4 seconds after the second click');
  console.log('== State: ' + JSON.stringify(await state(page)));
}
