import { click, typeNote, note } from '../helper.mjs';
export default async function ({ page, snap }) {
  await typeNote(page, 'Happy birthday, Anna!');
  console.log('typed:', JSON.stringify(await note(page)));
  await click(page, 'Close note');
  await snap('after Close note');
  console.log('root while closed:', await page.evaluate(() => document.getElementById('root').innerHTML));
  await click(page, 'Write a note');
  await snap('after Write a note');
  console.log('reopened:', JSON.stringify(await note(page)));
}
