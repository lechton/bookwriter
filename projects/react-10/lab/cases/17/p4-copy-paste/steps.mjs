export default async function ({ page, sleep, snap }) {
  await page.type('label:nth-of-type(2) input', 'Leave');
  await sleep(300);
  await snap('after typing "Leave" into the note box');
}
