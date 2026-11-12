import { watch, focusInfo } from '../helper.mjs';
export default async function ({ page, sleep }) {
  const c = watch(page);
  await focusInfo(page, 'after load');
}
