export default async function ({ page, sleep, snap }) {
  await page.type('label:nth-of-type(2) input', 'Leave at the door');
  await sleep(300);
  await snap('after typing "Leave at the door" into the note box');
}
