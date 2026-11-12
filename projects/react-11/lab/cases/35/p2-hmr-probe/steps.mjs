import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { watch, clickText } from '../helper.mjs';
// Saves an edit to the running copy of ChatRoom.jsx, the way a developer saves the file in the editor.
const file = fileURLToPath(new URL('../../../.run/src/components/ChatRoom.jsx', import.meta.url));
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  await clickText(page, 'Open chat', sleep);
  w.mark('save an edit to ChatRoom.jsx');
  writeFileSync(file, readFileSync(file, 'utf8').replace('Welcome to the', 'Welcome to our'));
  await sleep(3000);
  await snap('after saving an edit to the heading');
  w.mark('save an edit inside the Effect');
  writeFileSync(file, readFileSync(file, 'utf8').replace('connection.connect();', "connection.connect(); console.log('edited setup');"));
  await sleep(3000);
  await snap('after saving an edit inside the Effect');
  w.dump();
}
