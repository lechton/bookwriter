// Shared actions for the Lesson 38 cases: marks in the page Console, so each
// Console line shows which user action came before it, and the user's typing
// and click on Send in the feedback form.
export async function mark(page, label) {
  await page.evaluate((text) => console.info('-- ' + text), label);
}
export async function boxValue(page) {
  const box = await page.$('textarea');
  return box ? box.evaluate((node) => node.value) : '(no box on the page)';
}
export async function typeAndSend(page, sleep, snap) {
  const placeholder = await page.$eval('textarea', (node) => node.placeholder).catch(() => '(no box)');
  console.log('placeholder: ' + placeholder);
  await mark(page, 'user types Great app');
  await page.type('textarea', 'Great app', { delay: 40 });
  await sleep(300);
  await snap('after the user types Great app');
  console.log('box value: ' + (await boxValue(page)));
  await mark(page, 'user clicks Send');
  await page.click('button');
  await sleep(600);
  await snap('after the user clicks Send');
  console.log('box value after Send: ' + (await boxValue(page)));
  console.log('children of #root after Send: ' + (await page.$eval('#root', (root) => root.childElementCount)));
}
