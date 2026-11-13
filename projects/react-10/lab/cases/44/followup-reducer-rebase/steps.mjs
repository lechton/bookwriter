export default async function ({ page, sleep, snap }) {
  await page.click('button');
  await sleep(100); await snap('100 ms after the click');
  await sleep(400); await snap('500 ms after the click, after the base state changed at 300 ms');
  await sleep(1000); await snap('1500 ms after the click, after the Transition ended');
}
