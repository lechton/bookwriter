export default async function ({ page, sleep, snap }) {
  page.on('dialog', async (dialog) => {
    console.log('== Dialog opened: ' + dialog.message());
    await sleep(500);
    await dialog.accept();
    console.log('== Dialog accepted with OK');
  });
  await page.evaluate(() => {
    const real = window.alert.bind(window);
    window.alert = (message) => {
      console.log('DOM when alert opens: ' + document.body.innerText.replace(/\n/g, ' / '));
      real(message);
    };
  });
  await page.click('button');
  await sleep(400);
  await snap('after OK closes the pop-up');
}
