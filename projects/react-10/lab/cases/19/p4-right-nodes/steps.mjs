export default async function ({ page, sleep, snap }) {
  await page.evaluate(() => {
    document.querySelectorAll('li').forEach((li) => {
      li.dataset.node = 'old node of ' + li.firstChild.textContent;
    });
  });
  await page.click('li:nth-of-type(3) button:first-of-type');
  await sleep(300);
  await snap('after Move up on Night Train');
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('li')].map((li) => li.firstChild.textContent + ': ' + (li.dataset.node || 'new node'))
  );
  console.log('== li nodes after Move up');
  console.log(rows.join('\n'));
}
