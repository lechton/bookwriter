// Shared actions for the Lesson 35 cases: a Console watcher that keeps the
// file and line Chrome shows, and the user actions of the chat room picker.
export function watch(page) {
  const lines = [];
  page.on('console', (msg) => {
    const loc = msg.location();
    const file = loc.url ? loc.url.replace(/^https?:\/\/[^/]+\//, '').replace(/\?.*$/, '') : '?';
    lines.push(`${msg.text()} | ${file}:${(loc.lineNumber ?? -1) + 1}`);
  });
  return {
    mark(label) { lines.push('-- ' + label); },
    dump() { console.log('== Console with locations'); console.log(lines.join('\n')); },
  };
}
export async function clickText(page, text, sleep) {
  const [el] = await page.$$(`::-p-text(${text})`);
  await el.click();
  await sleep(300);
}
export async function pick(page, value, sleep) {
  await page.select('select', value);
  await sleep(300);
}
export async function typeEnd(page, selector, text, sleep) {
  await page.focus(selector);
  await page.keyboard.press('End');
  await page.keyboard.type(text);
  await sleep(300);
}
