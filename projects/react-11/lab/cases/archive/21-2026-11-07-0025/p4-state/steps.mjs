import { both, typeIn, clickApply } from '../_lib.mjs';
export default async function ({ page, sleep, snap }) {
  await both(page, snap, 'after load');
  await typeIn(page, 'WELCOM'); await sleep(200);
  await both(page, snap, 'after typing WELCOM');
  console.log('== URL before Apply: ' + page.url());
  await Promise.all([page.waitForNavigation({ timeout: 3000 }).then(() => console.log('== The page navigated')).catch(() => console.log('== No navigation')), clickApply(page)]);
  await sleep(500);
  console.log('== URL after Apply: ' + page.url());
  await both(page, snap, 'after Apply');
}
