export default async function ({ page, sleep, snap }) {
  await page.type('label:nth-of-type(1) input', 'x');
  await sleep(300);
  await snap('after typing "x" at the end of the Name box');
  await page.type('label:nth-of-type(2) input', 'Leave at the door');
  await sleep(300);
  await snap('after typing "Leave at the door" into the note box');
}
