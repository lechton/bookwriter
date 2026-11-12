export default async function ({ page, sleep, snap }) {
  await page.evaluate(() => {
    const count = document.querySelector('.count');
    count.click();
    count.click();
    const submit = document.querySelector('.submit');
    submit.click();
    console.log('submit disabled right after the 1st click returns: ' + submit.disabled);
    submit.click();
  });
  await sleep(300);
  await snap('after two synchronous clicks on each button');
  await page.reload({ waitUntil: 'networkidle0' });
  await page.click('.count');
  await page.click('.count');
  await page.click('.submit');
  await page.click('.submit');
  await sleep(300);
  await snap('after reload and two fast real mouse clicks on each button');
}
