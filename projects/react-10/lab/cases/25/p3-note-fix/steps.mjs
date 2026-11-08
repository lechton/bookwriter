import { click, typeNote, note } from '../helper.mjs';
export default async function ({ page, snap }) {
  await typeNote(page, 'Happy birthday, Anna!');
  await snap('after typing');
  await click(page, 'Show tip');
  await snap('after Show tip');
  console.log('after Show tip:', JSON.stringify(await note(page)));
  await typeNote(page, 'Second note');
  await click(page, 'Hide tip');
  console.log('after typing Second note and Hide tip:', JSON.stringify(await note(page)));
}
