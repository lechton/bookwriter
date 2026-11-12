import { watch, clickText, pick, typeEnd } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  await clickText(page, 'Open chat', sleep);
  w.mark('type hi in Message'); await typeEnd(page, 'input[aria-label=Message]', 'hi', sleep);
  await snap('after typing hi');
  w.dump();
}
