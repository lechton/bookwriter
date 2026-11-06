export default async function ({ page, sleep, snap }) {
  await page.evaluate(() => {
    document.querySelectorAll('li').forEach((li) => {
      li.querySelector('input').dataset.node = 'old node of ' + li.querySelector('b').textContent;
    });
  });
  await page.click('li:nth-of-type(1) input');
  await sleep(300);
  await page.click('::-p-text(Check mail)');
  await sleep(300);
  await snap('after ticking Dentist and clicking Check mail');
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('li')].map((li) => {
      const input = li.querySelector('input');
      return li.querySelector('b').textContent + ': ' + (input.dataset.node || 'new node') + ', checked=' + input.checked;
    })
  );
  console.log('== DOM nodes after Check mail');
  console.log(rows.join('\n'));
}
