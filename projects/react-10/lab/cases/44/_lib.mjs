export const mark = (page, label) => page.evaluate((l) => console.log('### ' + l), label);
export const state = async (page, label) => {
  const s = await page.evaluate(() => ({
    button: document.querySelector('button')?.textContent ?? '(no button)',
    count: document.querySelector('form p')?.textContent ?? '(no count)',
  }));
  console.log('== ' + label + ': ' + JSON.stringify(s));
};
const watch = (page) =>
  page.evaluate(() => {
    window.__t0 = performance.now();
    window.__log = [];
    const read = () => {
      const b = document.querySelector('button')?.textContent ?? '(no button)';
      const c = document.querySelector('form p')?.textContent;
      return c === undefined ? b : b + ' / ' + c;
    };
    let last = read();
    window.__log.push('0 ms: ' + last);
    window.__mo?.disconnect();
    window.__mo = new MutationObserver((records) => {
      for (const r of records) {
        for (const n of r.addedNodes) window.__log.push(Math.round(performance.now() - window.__t0) + ' ms: DOM write "' + n.textContent + '"');
        if (r.type === 'characterData') window.__log.push(Math.round(performance.now() - window.__t0) + ' ms: DOM text "' + r.target.data + '"');
      }
    });
    window.__mo.observe(document.getElementById('root'), { childList: true, subtree: true, characterData: true });
    const frame = () => {
      const now = read();
      if (now !== last) { window.__log.push(Math.round(performance.now() - window.__t0) + ' ms: painted frame shows ' + now); last = now; }
      window.__raf = requestAnimationFrame(frame);
    };
    cancelAnimationFrame(window.__raf);
    window.__raf = requestAnimationFrame(frame);
  });
const dump = async (page, label) => {
  const log = await page.evaluate(() => window.__log);
  console.log('== Timeline ' + label);
  console.log(log.join('\n'));
};
export const clickHeart = async (page, sleep, snap, label, waits = [300, 1500]) => {
  await state(page, 'before ' + label);
  await watch(page);
  await mark(page, label);
  await page.click('button');
  let t = 0;
  for (const w of waits) {
    await sleep(w - t); t = w;
    await snap(t + ' ms after ' + label);
  }
  await dump(page, label);
};
