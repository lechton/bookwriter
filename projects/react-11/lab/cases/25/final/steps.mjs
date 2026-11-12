import { click, typeNote, note } from '../helper.mjs';
export default async function ({ page, snap }) {
  await click(page, 'Show tip');
  await snap('opening preview: Anna chosen, tip on');
  await click(page, 'Hide tip');
  await typeNote(page, 'Happy birthday, Anna!');
  await click(page, 'Close note');
  await click(page, 'Write a note');
  console.log('close and reopen:', JSON.stringify(await note(page)));
  await typeNote(page, 'Happy birthday, Anna!');
  await click(page, 'Show tip');
  console.log('show tip:', JSON.stringify(await note(page)));
  await click(page, 'Ben');
  console.log('pick Ben:', JSON.stringify(await note(page)));
  await snap('after Ben');
}
