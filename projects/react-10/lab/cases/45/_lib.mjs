export const fill = async (page, values) => {
  for (const [name, value] of Object.entries(values)) {
    const sel = `input[name="${name}"]`;
    await page.focus(sel);
    await page.$eval(sel, (el) => el.select());
    await page.keyboard.press('Backspace');
    await page.type(sel, value);
  }
};
export const boxes = async (page, label) => {
  const s = await page.evaluate(() => ({
    boxes: Object.fromEntries([...document.querySelectorAll('input')].map((i) => [i.name || '(no name)', i.value])),
    lines: [...document.querySelectorAll('p')].map((p) => p.textContent),
  }));
  console.log('== Boxes ' + label + ': ' + JSON.stringify(s));
};
const watch = (page) =>
  page.evaluate(() => {
    window.__t0 = performance.now();
    window.__log = [];
    const read = () =>
      [...document.querySelectorAll('input')].map((i) => (i.name || '?') + '=' + JSON.stringify(i.value)).join(' ') +
      ' | lines: ' + JSON.stringify([...document.querySelectorAll('p')].map((p) => p.textContent));
    let last = read();
    window.__log.push('0 ms: ' + last);
    const frame = () => {
      const now = read();
      if (now !== last) { window.__log.push(Math.round(performance.now() - window.__t0) + ' ms: ' + now); last = now; }
      window.__raf = requestAnimationFrame(frame);
    };
    cancelAnimationFrame(window.__raf);
    window.__raf = requestAnimationFrame(frame);
  });
export const submit = async (page, sleep, label, wait = 1500, selector = 'button[type="submit"]') => {
  await boxes(page, 'before ' + label);
  await watch(page);
  await page.click(selector);
  await sleep(wait);
  const log = await page.evaluate(() => window.__log);
  console.log('== Timeline ' + label);
  console.log(log.join('\n'));
  await boxes(page, wait + ' ms after ' + label);
};
