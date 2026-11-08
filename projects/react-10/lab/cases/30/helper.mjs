export function watch(page) {
  const lines = [];
  page.on('console', async (msg) => {
    const loc = msg.location();
    const file = loc.url ? loc.url.split('?')[0].split('/').pop() : '?';
    const args = await Promise.all(msg.args().map((a) => a.jsonValue().catch(() => String(a))));
    lines.push(`[${msg.type()}] ${JSON.stringify(args)} @ ${file}:${(loc.lineNumber ?? -1) + 1}`);
  });
  return {
    mark(label) { lines.length = 0; console.log(`-- console cleared: ${label}`); },
    async dump(label) { await new Promise((r) => setTimeout(r, 50)); console.log(`-- console since clear, ${label}:`); console.log(lines.length ? lines.join('\n') : '(nothing)'); },
  };
}
export async function press(page, index) {
  const buttons = await page.$$('button');
  await buttons[index].click();
}
export function dialogs(page) {
  page.on('dialog', async (d) => { console.log(`-- pop-up says: ${d.message()}`); await d.accept(); });
}
