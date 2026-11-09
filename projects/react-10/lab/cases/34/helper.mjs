// Shared steps for the Lecture 34 cases. A stand-in for the React DevTools hook
// records the page text at every commit React makes, so a commit that a second
// render replaces in the same task is still visible; each state carries the
// animation frame it fell in, so two states in different frames were painted apart.
export const watch = async (page) => {
  const lines = [];
  page.on('console', (msg) => {
    const loc = msg.location();
    const file = loc.url ? loc.url.replace(/^https?:\/\/[^/]+\//, '').replace(/\?.*$/, '') : '';
    lines.push(`${msg.text()} | ${file}${file ? ':' + (loc.lineNumber + 1) : ''}`);
  });
  await page.evaluateOnNewDocument(() => {
    window.__states = [];
    window.__frame = 0;
    window.__painted = [];
    // The browser paints right after the animation frame callbacks, with no task
    // in between, so the text read here is the text of that frame's paint.
    const tick = () => {
      window.__frame += 1;
      const root = document.getElementById('root');
      const text = root ? root.innerText.replace(/\n+/g, ' / ').trim() : '';
      const last = window.__painted[window.__painted.length - 1];
      if (text && (!last || last.text !== text)) window.__painted.push({ text, frame: window.__frame });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const record = () => {
      const root = document.getElementById('root');
      if (!root) return;
      window.__states.push({ text: root.innerText.replace(/\n+/g, ' / ').trim(), frame: window.__frame });
    };
    let nextId = 1;
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: new Map(),
      supportsFiber: true,
      isDisabled: false,
      checkDCE() {},
      inject(renderer) { const id = nextId++; this.renderers.set(id, renderer); return id; },
      onScheduleFiberRoot() {},
      onCommitFiberRoot() { record(); },
      onCommitFiberUnmount() {},
      onPostCommitFiberRoot() {},
    };
  });
  await page.reload({ waitUntil: 'networkidle0' });
  console.log('--- reload with the recorder; Console lines below come from this load on ---');
  return {
    mark: () => { lines.length = 0; return page.evaluate(() => { window.__states = []; window.__painted = []; }); },
    dump: async (label) => {
      const states = await page.evaluate(() => window.__states);
      console.log(`-- DOM states, ${label}:`);
      for (const s of states) console.log(`   frame ${s.frame}: ${s.text}`);
      const painted = await page.evaluate(() => window.__painted);
      console.log(`-- Painted frames, ${label}:`);
      for (const s of painted) console.log(`   frame ${s.frame}: ${s.text}`);
      console.log(`-- Console with locations, ${label}:`);
      console.log(lines.length ? lines.map((l) => '   ' + l).join('\n') : '   (nothing)');
    },
  };
};

export const press = async (page, text, nth = 0) => {
  const buttons = await page.$$('button');
  const matching = [];
  for (const b of buttons) if ((await b.evaluate((n) => n.textContent)) === text) matching.push(b);
  await matching[nth].click();
};

// Removes Hat: the Remove button in the row whose text starts with Hat.
export const removeHat = (page) =>
  page.evaluate(() => {
    const row = [...document.querySelectorAll('li')].find((li) => li.textContent.startsWith('Hat'));
    row.querySelector('button').click();
  });

// A load, a click on Place order, then a click on Remove in the Hat row.
export const orderThenRemove = async ({ page, sleep, snap }) => {
  const w = await watch(page);
  await sleep(500);
  await w.dump('first load');
  await w.mark();
  await press(page, 'Place order');
  await sleep(500);
  await snap('after the click on Place order');
  await w.dump('click on Place order');
  await w.mark();
  await removeHat(page);
  await sleep(500);
  await snap('after the click on Remove in the Hat row');
  await w.dump('click on Remove in the Hat row');
};

// A load, then a click on Remove in the Hat row.
export const loadThenRemove = async ({ page, sleep, snap }) => {
  const w = await watch(page);
  await sleep(500);
  await w.dump('first load');
  await w.mark();
  await removeHat(page);
  await sleep(500);
  await snap('after the click on Remove in the Hat row');
  await w.dump('click on Remove in the Hat row');
};

// A load only.
export const watchLoad = async ({ page, sleep }) => {
  const w = await watch(page);
  await sleep(500);
  await w.dump('first load');
};
