// Shared actions for the Lesson 36 cases: a Console watcher that stamps each
// line with the seconds since the page opened, and the two user actions.
export function watch(page) {
  const start = Date.now();
  const lines = [];
  const stamp = () => ((Date.now() - start) / 1000).toFixed(1).padStart(5);
  page.on('console', (msg) => {
    if (/\[vite\]|React DevTools/.test(msg.text())) return;
    lines.push(`${stamp()}s ${msg.text()}`);
  });
  page.on('pageerror', (error) => lines.push(`${stamp()}s [pageerror] ${error.message}`));
  return {
    mark(label) { lines.push(`${stamp()}s -- ${label}`); },
    dump() { console.log('== Console with seconds'); console.log(lines.join('\n')); },
  };
}
export async function tick(page, sleep) {
  await page.click('input[type=checkbox]');
  await sleep(300);
}
export async function pick(page, value, sleep) {
  await page.select('select', value);
  await sleep(300);
}
