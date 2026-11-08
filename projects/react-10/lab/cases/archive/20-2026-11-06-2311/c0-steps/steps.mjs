const fields = (page) => page.evaluate(() => [...document.querySelectorAll('input')].map((el) => el.id + ': ' + JSON.stringify(el.value)));
const show = async (page, label) => { console.log('== Fields ' + label); console.log((await fields(page)).join('\n')); };

export default async function ({ page, sleep }) {
  for (const id of ['A', 'B', 'C']) {
    await page.click('#' + id);
    await page.keyboard.press('End');
    await page.keyboard.press('n');
  }
  await sleep(300);
  await show(page, 'after pressing n once in each box');
}
