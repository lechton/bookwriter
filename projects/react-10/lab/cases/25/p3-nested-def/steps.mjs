export default async function ({ page }) {
  await page.type('input', 'Anna');
  await new Promise((d) => setTimeout(d, 200));
  console.log('input after typing Anna:', await page.evaluate(() => document.querySelector('input').value));
  await page.evaluate(() => document.querySelector('button').click());
  await new Promise((d) => setTimeout(d, 200));
  console.log('input after Likes click:', await page.evaluate(() => document.querySelector('input').value));
}
