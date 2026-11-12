import { watch, clickText, pick, typeEnd } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  await clickText(page, 'Open chat', sleep);
  w.mark('pick travel'); await pick(page, 'travel', sleep);
  await snap('after travel');
  w.dump();
}
