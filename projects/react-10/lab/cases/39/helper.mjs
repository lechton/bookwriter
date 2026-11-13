// Shared actions for the Lesson 39 cases: the network going off and on, a
// user who opens the page while offline, the state of the heading and the
// button, and Console lines traced back to the reader's source lines.
import { SourceMapConsumer } from 'source-map-js';

export async function mark(page, label) {
  await page.evaluate((text) => console.info('-- ' + text), label);
}

export async function state(page, label) {
  const info = await page.evaluate(() => {
    const button = document.querySelector('button');
    return {
      onLine: navigator.onLine,
      heading: document.querySelector('h1')?.innerText ?? '(no heading)',
      line: document.querySelector('p')?.innerText ?? '(no line)',
      button: button ? button.innerText : '(no button)',
      disabled: button ? button.disabled : null,
    };
  });
  console.log(`state ${label}: navigator.onLine=${info.onLine} | h1="${info.heading}" | p="${info.line}" | button="${info.button}" disabled=${info.disabled}`);
}

export async function goOffline(page, sleep) {
  await mark(page, 'the network goes off');
  await page.setOfflineMode(true);
  await sleep(400);
}

export async function goOnline(page, sleep) {
  await mark(page, 'the network comes back');
  await page.setOfflineMode(false);
  await sleep(400);
}

export async function clickSave(page, sleep) {
  await mark(page, 'user clicks Save progress');
  await page.click('button');
  await sleep(400);
}

// The page must load from the dev server, so the network stays on and only
// the browser's answer to navigator.onLine is turned to false before any
// module runs, which is what an app sees when a user opens it offline.
export async function openOffline(page, sleep) {
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(Navigator.prototype, 'onLine', { get: () => false, configurable: true });
  });
  await mark(page, 'reload as a user who opens the app while offline');
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(400);
}

const consumers = new Map();
async function original(url, line, column) {
  if (!consumers.has(url)) {
    const code = await (await fetch(url)).text();
    const match = code.match(/sourceMappingURL=data:application\/json;(?:charset=utf-8;)?base64,([A-Za-z0-9+/=]+)/);
    consumers.set(url, match ? new SourceMapConsumer(JSON.parse(Buffer.from(match[1], 'base64').toString())) : null);
  }
  const consumer = consumers.get(url);
  if (!consumer) return `${url}:${line + 1}`;
  const pos = consumer.originalPositionFor({ line: line + 1, column });
  return `${(pos.source ?? url).split('/').pop()}:${pos.line}`;
}

// Prints every log line again with the file and line Chrome shows beside it,
// from a fresh load of the page.
export async function traceLogs(page, sleep) {
  const traced = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'log') return;
    const loc = msg.location();
    traced.push(original(loc.url, loc.lineNumber, loc.columnNumber).then((where) => `${msg.text()} | ${where}`));
  });
  return async () => {
    console.log('== Log lines with their source line');
    for (const line of await Promise.all(traced)) console.log(line);
  };
}
