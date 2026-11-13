import { fill, submit } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await page.evaluate(() => { window.__marker = 'no reload'; });
  await fill(page, { username: 'john' });
  await submit(page, sleep, 'click on Save', 300);
  console.log('== Page reloaded? ' + (await page.evaluate(() => window.__marker !== 'no reload')) + ', URL ' + page.url());
  await snap('after Save');
}
