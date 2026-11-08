export default async function ({ page, sleep, snap }) {
  await page.evaluate(() => document.querySelectorAll('button')[0].click()); await sleep(300);
  await snap('after one click on the useState counter');
  await page.evaluate(() => document.querySelectorAll('button')[1].click()); await sleep(300);
  await snap('after one click on the useReducer counter');
}
