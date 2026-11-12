// The lab has no real server: this answers /api/bio/{name} the way the
// React docs' hidden api.js does, Bob after 2000 ms and everyone else after 200 ms.
export async function serve(page, { failFor = [] } = {}) {
  const log = [];
  let t0 = Date.now();
  const at = () => String(Date.now() - t0).padStart(5) + 'ms';
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const m = new URL(req.url()).pathname.match(/^\/api\/bio\/(\w+)$/);
    if (!m) return req.continue();
    const name = m[1];
    log.push(at() + ' request ' + name);
    const delay = name === 'Bob' ? 2000 : 200;
    setTimeout(() => {
      const fail = failFor.includes(name);
      const body = fail ? { message: 'Server error' } : { bio: 'This is ' + name + '\u2019s bio.' };
      req.respond({ status: fail ? 500 : 200, contentType: 'application/json; charset=utf-8', body: JSON.stringify(body) })
        .catch((e) => log.push(at() + ' respond ' + name + ' skipped: ' + e.message.split('\n')[0]));
    }, delay);
  });
  page.on('requestfailed', (r) => { if (r.url().includes('/api/bio/')) log.push(at() + ' failed ' + r.url().split('/').pop() + ': ' + r.failure()?.errorText); });
  page.on('requestfinished', (r) => { if (r.url().includes('/api/bio/')) log.push(at() + ' finished ' + r.url().split('/').pop() + ' status ' + r.response()?.status()); });
  return {
    async reload() {
      await page.evaluate(() => console.log('--- reload with the lab server ---'));
      log.length = 0; t0 = Date.now();
      await page.reload({ waitUntil: 'domcontentloaded' });
    },
    print(label) { console.log('-- requests, ' + label + ':'); console.log(log.length ? log.join('\n') : '(none)'); },
  };
}
export async function press(page, name) {
  const buttons = await page.$$('button');
  for (const b of buttons) { if ((await b.evaluate((n) => n.textContent)) === name) return b.click(); }
  throw new Error('no button ' + name);
}
