export default async function ({ page, sleep, snap }) {
  await page.type('label:nth-of-type(1) input', ' Smith');
  await page.type('label:nth-of-type(2) input', 'Leave at the door');
  await sleep(300);
  await snap('after typing " Smith" at the end of the Name box and typing the note');
}
