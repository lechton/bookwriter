import { fill, boxes } from '../_lib.mjs';
export default async function ({ page, sleep }) {
  await fill(page, { username: 'john', email: 'john@mail.com' });
  await page.click('button[type="submit"]');
  await sleep(300);
  await fill(page, { email: 'typo@mail' });
  await boxes(page, 'during the wait, after the user changes Email to typo@mail');
  await sleep(1200);
  await boxes(page, 'after the refusal');
}
