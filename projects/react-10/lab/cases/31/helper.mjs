export function watch(page) {
  const lines = [];
  page.on('console', async (msg) => {
    const loc = msg.location();
    const file = loc.url ? loc.url.split('?')[0].split('/').pop() : '?';
    const args = await Promise.all(msg.args().map(async (a) => {
      if (a.remoteObject().subtype === 'node') return a.evaluate((n) => 'ELEMENT ' + n.outerHTML);
      return a.jsonValue().catch(() => String(a));
    }));
    lines.push(`[${msg.type()}] ${JSON.stringify(args.length ? args : msg.text())} @ ${file}:${(loc.lineNumber ?? -1) + 1}`);
  });
  page.on('pageerror', (e) => lines.push(`[pageerror] ${e.name}: ${e.message}`));
  return {
    mark(label) { lines.length = 0; console.log(`-- console cleared: ${label}`); },
    async dump(label) { await new Promise((r) => setTimeout(r, 100)); console.log(`-- console since clear, ${label}:`); console.log(lines.length ? lines.join('\n') : '(nothing)'); },
  };
}
export async function press(page, index) {
  const buttons = await page.$$('button');
  await buttons[index].click();
}
export async function clickInput(page, index) {
  const inputs = await page.$$('input');
  await inputs[index].click();
}
export async function focusInfo(page, label) {
  const info = await page.evaluate(() => {
    const a = document.activeElement;
    const desc = (el) => el === document.body ? 'body' : el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.textContent ? ' "' + el.textContent + '"' : '');
    const inputs = [...document.querySelectorAll('input')].map((i, k) => `input ${k + 1}=${JSON.stringify(i.value)}${i === a ? ' FOCUSED' : ''}`);
    return `active element: ${a ? desc(a) : 'none'} | ${inputs.join(' | ')}`;
  });
  console.log(`-- ${label}: ${info}`);
}
