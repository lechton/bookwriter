/* check.mjs: runs one case of lecture code in a hidden Chrome and prints what
   the reader would see. Usage and case layout are in README.md. */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { createServer as createNetServer } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import react from '@vitejs/plugin-react';
import puppeteer from 'puppeteer';
import { build, createLogger, createServer, preview } from 'vite';

const LAB = dirname(fileURLToPath(import.meta.url));
const RUN = join(LAB, '.run');
const CACHE = join(LAB, '.vite-cache');

const USAGE = `usage: node lab/check.mjs <case-folder> [--no-strict] [--prod] [--click <selector>]... [--eval <js>]... [--wait <ms>] [--shot <file.png>] [--elements]`;

const parseArgs = (argv) => {
  const options = { strict: true, prod: false, clicks: [], evals: [], wait: 300, shot: undefined, elements: false };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (value === undefined) throw new Error(`${arg} needs a value\n${USAGE}`);
      return value;
    };
    if (arg === '--no-strict') options.strict = false;
    else if (arg === '--prod') options.prod = true;
    else if (arg === '--elements') options.elements = true;
    else if (arg === '--click') options.clicks.push(next());
    else if (arg === '--eval') options.evals.push(next());
    else if (arg === '--wait') options.wait = Number(next());
    else if (arg === '--shot') options.shot = resolve(next());
    else if (arg.startsWith('--')) throw new Error(`unknown option ${arg}\n${USAGE}`);
    else rest.push(arg);
  }
  if (rest.length !== 1) throw new Error(USAGE);
  options.case = resolve(rest[0]);
  return options;
};

// The case folder is the reader's src/ folder; index.html and steps.mjs are
// lab files, so they sit beside src/ instead of inside it.
const prepareRun = (caseDir) => {
  if (!existsSync(join(caseDir, 'App.jsx')) && !existsSync(join(caseDir, 'main.jsx'))) {
    throw new Error(`${caseDir} needs an App.jsx or a main.jsx`);
  }
  rmSync(RUN, { recursive: true, force: true });
  mkdirSync(join(RUN, 'src'), { recursive: true });
  cpSync(join(LAB, 'template', 'index.html'), join(RUN, 'index.html'));
  cpSync(join(LAB, 'template', 'main.jsx'), join(RUN, 'src', 'main.jsx'));
  for (const name of readdirSync(caseDir)) {
    if (name === 'steps.mjs') continue;
    const target = name === 'index.html' ? join(RUN, name) : join(RUN, 'src', name);
    cpSync(join(caseDir, name), target, { recursive: true });
  }
};

const freePort = () =>
  new Promise((done, fail) => {
    const server = createNetServer();
    server.unref();
    server.on('error', fail);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => done(port));
    });
  });

const collectingLogger = (lines) => {
  const logger = createLogger('silent');
  logger.warn = (msg) => lines.push(`[warn] ${tidy(msg)}`);
  logger.warnOnce = logger.warn;
  logger.error = (msg) => lines.push(`[error] ${tidy(msg)}`);
  return logger;
};

const viteConfig = (logger) => ({
  root: RUN,
  configFile: false,
  cacheDir: CACHE,
  plugins: [react()],
  customLogger: logger,
  logLevel: 'warn',
});

const startDev = async (logger) => {
  const port = await freePort();
  const server = await createServer({ ...viteConfig(logger), server: { port, strictPort: true } });
  await server.listen();
  return { url: `http://localhost:${port}/`, close: () => server.close() };
};

const startProd = async (logger, viteLines) => {
  try {
    await build({ ...viteConfig(logger), build: { outDir: join(RUN, 'dist'), emptyOutDir: true } });
  } catch (error) {
    viteLines.push(`[build failed] ${tidy(error.message)}`);
    return undefined;
  }
  const port = await freePort();
  const server = await preview({ ...viteConfig(logger), build: { outDir: join(RUN, 'dist') }, preview: { port, strictPort: true } });
  return { url: `http://localhost:${port}/`, close: () => server.close() };
};

// The reader's project has its files at src/, not at the lab's scratch
// folder; stack lines point into Vite itself and only cost reading time.
const tidy = (text) =>
  text
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split(RUN + '/').join('')
    .split('lab/.run/').join('')
    .split('\n')
    .filter((line) => !/^\s+at .+[(\s]file:\/\//.test(line) && !/^\s+at async /.test(line))
    .join('\n');

const NOISE = [/\[vite\]/, /Download the React DevTools/];

const snapshot = (page, withElements) =>
  page.evaluate((elements) => {
    const overlay = document.querySelector('vite-error-overlay');
    const root = document.getElementById('root');
    return {
      screen: document.body.innerText.trim(),
      elements: elements && root ? root.innerHTML : undefined,
      overlay: overlay?.shadowRoot?.querySelector('.window')?.innerText.trim(),
    };
  }, withElements);

const printSnap = (label, snap) => {
  console.log(`== Screen ${label}`);
  console.log(snap.screen.length > 0 ? snap.screen : '(empty page)');
  if (snap.elements !== undefined) {
    console.log(`== Elements in #root ${label}`);
    console.log(snap.elements.length > 0 ? snap.elements : '(empty)');
  }
  if (snap.overlay) {
    console.log(`== Vite error overlay ${label}`);
    console.log(tidy(snap.overlay));
  }
};

// msg.text() leaves React's %s markers unfilled, so the line is rebuilt from
// the arguments the way the Chrome console shows it.
const formatConsole = async (msg) => {
  const args = await Promise.all(
    msg.args().map((arg) => arg.jsonValue().catch(() => arg.toString())),
  );
  if (args.length === 0 || typeof args[0] !== 'string') return msg.text();
  const rest = args.slice(1);
  const head = args[0].replace(/%[sdifoOc]/g, (marker) => {
    if (rest.length === 0) return marker;
    const value = rest.shift();
    if (marker === '%c') return '';
    return typeof value === 'string' ? value : JSON.stringify(value);
  });
  return [head, ...rest.map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))].join(' ');
};

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  prepareRun(options.case);
  const viteLines = [];
  const logger = collectingLogger(viteLines);
  const site = options.prod ? await startProd(logger, viteLines) : await startDev(logger);
  console.log(`case: ${options.case}`);
  console.log(`mode: ${options.prod ? 'production build' : 'dev server'}, StrictMode ${options.strict ? 'on' : 'off'}`);
  if (site === undefined) {
    console.log('== Vite messages');
    console.log(viteLines.join('\n'));
    return;
  }
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const pending = [];
    page.on('console', (msg) => {
      pending.push(formatConsole(msg).then((text) => `[${msg.type()}] ${text}`));
    });
    page.on('pageerror', (error) => pending.push(Promise.resolve(`[error] Uncaught ${error.name}: ${error.message}`)));
    await page.goto(`${site.url}?strict=${options.strict ? '1' : '0'}`, { waitUntil: 'networkidle0' });
    await sleep(options.wait);
    printSnap('after load', await snapshot(page, options.elements));
    for (const [index, selector] of options.clicks.entries()) {
      await page.click(selector);
      await sleep(options.wait);
      printSnap(`after click ${index + 1} on ${selector}`, await snapshot(page, options.elements));
    }
    const steps = join(options.case, 'steps.mjs');
    if (existsSync(steps)) {
      const run = (await import(pathToFileURL(steps).href)).default;
      await run({ page, sleep, snap: async (label) => printSnap(label, await snapshot(page, options.elements)) });
    }
    for (const code of options.evals) {
      const value = await page.evaluate(code);
      console.log(`== Eval ${code}`);
      console.log(JSON.stringify(value));
    }
    if (options.shot !== undefined) {
      await page.screenshot({ path: options.shot, fullPage: true });
      console.log(`== Screenshot ${options.shot}`);
    }
    const consoleLines = (await Promise.all(pending)).filter(
      (line) => !NOISE.some((noise) => noise.test(line)),
    );
    console.log('== Console');
    console.log(consoleLines.length > 0 ? consoleLines.join('\n') : '(nothing)');
    console.log('== Vite messages');
    console.log(viteLines.length > 0 ? viteLines.join('\n') : '(nothing)');
  } finally {
    await browser.close();
    await site.close();
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
