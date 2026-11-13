import { state, goOffline, traceLogs, mark } from '../helper.mjs';

export default async function ({ page, sleep, snap }) {
  const print = await traceLogs(page, sleep);
  await mark(page, 'reload to trace the source lines');
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(400);
  await state(page, 'after reload');
  await goOffline(page, sleep);
  await snap('after the network goes off');
  await state(page, 'after the network goes off');
  await print();
}
