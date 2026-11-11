import { watch, clickText, pick, typeEnd } from '../helper.mjs';
export default async function ({ page, sleep, snap }) {
  const w = watch(page);
  w.mark('click Mutate ref'); await clickText(page, 'Mutate ref', sleep);
  w.mark('click Re-render'); await clickText(page, 'Re-render', sleep);
  await snap('after both clicks');
  w.dump();
}
