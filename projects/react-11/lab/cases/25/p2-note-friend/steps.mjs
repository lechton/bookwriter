import { click, typeNote, note, markNodes, sameNodes } from '../helper.mjs';
export default async function ({ page, snap }) {
  await typeNote(page, 'Happy birthday, Anna!');
  await snap('after typing');
  await markNodes(page);
  await click(page, 'Ben');
  await snap('after Ben');
  console.log('after Ben:', JSON.stringify(await note(page)));
  console.log('same DOM nodes after Ben:', JSON.stringify(await sameNodes(page)));
  await click(page, 'Anna');
  console.log('after Anna:', JSON.stringify(await note(page)));
}
