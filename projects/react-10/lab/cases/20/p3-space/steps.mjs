const fields = (page) => page.evaluate(() => [...document.querySelectorAll('input')].map((el) => 'input: ' + JSON.stringify(el.value)));
const show = async (page, label) => { console.log('== Fields ' + label); console.log((await fields(page)).join('\n')); };

export default async function ({ page, sleep }) {
  for (const n of [1, 2, 3]) await page.type('input:nth-of-type(' + n + ')', 'Ann ');
  await sleep(300);
  await show(page, 'after typing Ann and a space');
}
