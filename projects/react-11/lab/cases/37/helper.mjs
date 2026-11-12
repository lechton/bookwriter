// Shared actions for the Lesson 37 cases: a Console watcher that stamps each
// line with the seconds since the steps began, and the two user actions.
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
    dump() { console.log('== Console with seconds since the steps began'); console.log(lines.join('\n')); },
  };
}
export async function type(page, text, sleep) {
  await page.type('input', text, { delay: 150 });
  await sleep(300);
}
export async function pick(page, value, sleep) {
  await page.select('select', value);
  await sleep(300);
}
export async function value(page) {
  return page.$eval('input', (box) => box.value);
}
