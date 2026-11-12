export const wait = (ms = 300) => new Promise((done) => setTimeout(done, ms));

export async function rows(page) {
  return page.evaluate(() => ({
    rows: [...document.querySelectorAll('li')].map((li) => [...li.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('')),
    empty: document.body.innerText.includes('Your cart is empty.'),
  }));
}

export async function clickRow(page, name, label) {
  await page.evaluate((name, label) => {
    const text = (li) => [...li.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('');
    const li = [...document.querySelectorAll('li')].find((row) => text(row).startsWith(name + ':'));
    [...li.querySelectorAll('button')].find((b) => b.textContent === label).click();
  }, name, label);
  await wait();
  console.log('after ' + label + ' in ' + (name || 'nameless') + ' row:', JSON.stringify(await rows(page)));
}

export async function clickText(page, label) {
  await page.evaluate((label) => [...document.querySelectorAll('button')].find((b) => b.textContent === label).click(), label);
  await wait();
  console.log('after ' + label + ':', JSON.stringify(await rows(page)));
}

export function dialogs(page) {
  const seen = [];
  page.on('dialog', async (d) => { seen.push(d.message()); await d.accept(); });
  return seen;
}

// Chrome shows the source-mapped line of src/; puppeteer reports the line of the
// code Vite served, so the line is mapped back through Vite's inline source map.
export async function sourceLine(page, location) {
  const { SourceMapConsumer } = await import('source-map-js');
  const code = await page.evaluate((url) => fetch(url).then((r) => r.text()), location.url);
  const map = code.match(/sourceMappingURL=data:application\/json;(?:charset=utf-8;)?base64,([A-Za-z0-9+/=]+)/);
  const consumer = new SourceMapConsumer(JSON.parse(Buffer.from(map[1], 'base64').toString('utf8')));
  const pos = consumer.originalPositionFor({ line: location.lineNumber + 1, column: location.columnNumber });
  return pos.source.split('/').pop() + ':' + pos.line;
}

export function logWithSource(page) {
  page.on('console', async (m) => {
    const value = m.args().length ? await m.args()[0].jsonValue() : m.text();
    console.log('Console line:', JSON.stringify(value), '|', await sourceLine(page, m.location()));
  });
}

export async function scenarios(page) {
  console.log('on load:', JSON.stringify(await rows(page)));
  await clickRow(page, 'Bread', 'Add one');
  await page.reload({ waitUntil: 'networkidle0' }); await wait();
  await clickRow(page, 'Bread', 'Remove one');
  await clickRow(page, 'Bread', 'Remove one');
  await page.reload({ waitUntil: 'networkidle0' }); await wait();
  await clickRow(page, 'Apple', 'Delete');
  await page.reload({ waitUntil: 'networkidle0' }); await wait();
  await clickText(page, 'Empty cart');
}
