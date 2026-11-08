export const clickRow = (page, name, label) =>
  page.evaluate((name, label) => {
    const li = [...document.querySelectorAll('li')].find((item) => item.firstChild.textContent === name);
    if (!li) throw new Error('no row ' + name);
    [...li.querySelectorAll('button')].find((b) => b.textContent === label).click();
  }, name, label);
export const reload = (page) => page.reload({ waitUntil: 'networkidle0' });
export default async function ({ page, sleep, snap }) {
  await page.type('input', 'a');
  await sleep(300);
  await clickRow(page, 'Mia', 'Make captain');
  await sleep(300);
  await snap('after typing a and Make captain next to Mia');
}
