export function watch(page) {
  let t0 = Date.now();
  const lines = [];
  page.on('console', async (msg) => {
    const at = Date.now() - t0;
    const loc = msg.location();
    const file = loc.url ? loc.url.split('?')[0].split('/').pop() : '?';
    const args = await Promise.all(msg.args().map((a) => a.jsonValue().catch(() => String(a))));
    lines.push(`${String(at).padStart(5)}ms [${msg.type()}] ${args.length ? args.join(' ') : msg.text()} @ ${file}:${(loc.lineNumber ?? -1) + 1}`);
  });
  page.on('pageerror', (e) => lines.push(`${String(Date.now() - t0).padStart(5)}ms [pageerror] ${e.name}: ${e.message}`));
  return {
    mark(label) { lines.length = 0; t0 = Date.now(); console.log(`-- console cleared, clock reset: ${label}`); },
    async dump(label, map) { await new Promise((r) => setTimeout(r, 50)); console.log(`-- console since clear, ${label}${map ? ', with Counter.jsx lines mapped back to the source file the way Chrome shows them' : ''}:`); const shown = map ? lines.map((l) => l.replace(/@ Counter\.jsx:(\d+)/, (s, n) => `@ Counter.jsx:${map[n] ?? '?' + n}`)) : lines; console.log(shown.length ? shown.join('\n') : '(nothing)'); },
    count(text) { return lines.filter((l) => l.includes(`] ${text} @`)).length; },
    since() { return Date.now() - t0; },
  };
}
export async function press(page, index) {
  const buttons = await page.$$('button');
  await buttons[index].click();
}
export async function heading(page) {
  return page.evaluate(() => document.querySelector('h1')?.textContent ?? '(no h1)');
}
export async function sample(page, w, seconds, sleep) {
  for (let s = 1; s <= seconds; s += 1) {
    await sleep(Math.max(0, s * 1000 + 100 - w.since()));
    console.log(`-- at ${w.since()}ms: h1=${await heading(page)}, Tick lines so far=${w.count('Tick')}, Timer started so far=${w.count('Timer started')}`);
  }
}
export async function source(page, path) {
  const text = await page.evaluate(async (p) => (await fetch(p)).text(), path);
  console.log(`-- served ${path}:`);
  console.log(text.split('\n').filter((l) => !l.startsWith('//# sourceMappingURL')).map((l, i) => `${String(i + 1).padStart(3)}| ${l}`).join('\n'));
}
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function decodeLine(seg) {
  const out = []; let value = 0, shift = 0;
  for (const ch of seg) {
    const d = B64.indexOf(ch); value += (d & 31) << shift;
    if (d & 32) { shift += 5; } else { out.push(value & 1 ? -(value >>> 1) : value >>> 1); value = 0; shift = 0; }
  }
  return out;
}
export async function originalLines(page, path) {
  const text = await page.evaluate(async (p) => (await fetch(p)).text(), path);
  const m = text.match(/sourceMappingURL=data:application\/json;(?:charset=utf-8;)?base64,(\S+)/);
  if (!m) return {};
  const map = JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'));
  const result = {}; let src = 0, oline = 0, ocol = 0;
  map.mappings.split(';').forEach((line, gi) => {
    let gcol = 0;
    for (const seg of line.split(',').filter(Boolean)) {
      const v = decodeLine(seg); gcol += v[0];
      if (v.length >= 4) { src += v[1]; oline += v[2]; ocol += v[3]; if (!(gi + 1 in result)) result[gi + 1] = oline + 1; }
    }
  });
  return result;
}
export async function mapDump(page, w, path, label) {
  const lines = await originalLines(page, path);
  await w.dump(label, lines);
}
