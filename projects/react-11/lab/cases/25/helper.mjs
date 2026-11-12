export async function click(page, label) {
  const ok = await page.evaluate((label) => {
    const button = [...document.querySelectorAll('button')].find((b) => b.textContent === label);
    if (!button) return false;
    button.click();
    return true;
  }, label);
  if (!ok) throw new Error(`no ${label} button`);
  await new Promise((done) => setTimeout(done, 200));
}

export async function clickFirst(page, times = 1) {
  for (let i = 0; i < times; i += 1) {
    await page.evaluate(() => document.querySelector('button').click());
    await new Promise((done) => setTimeout(done, 150));
  }
}

export async function typeNote(page, text) {
  await page.click('textarea');
  await page.keyboard.press('End');
  await page.type('textarea', text);
  await new Promise((done) => setTimeout(done, 200));
}

export async function note(page) {
  return page.evaluate(() => {
    const ta = document.querySelector('textarea');
    return {
      h2: document.querySelector('h2')?.textContent ?? null,
      textarea: ta ? ta.value : null,
      placeholder: ta ? ta.placeholder : null,
      buttons: [...document.querySelectorAll('button')].map((b) => b.textContent),
    };
  });
}

export async function markNodes(page) {
  await page.evaluate(() => {
    window.__old = {
      section: document.querySelector('section'),
      h2: document.querySelector('h2'),
      textarea: document.querySelector('textarea'),
      send: document.querySelector('section button'),
    };
  });
}

export async function sameNodes(page) {
  return page.evaluate(() => ({
    section: window.__old.section === document.querySelector('section'),
    h2: window.__old.h2 === document.querySelector('h2'),
    textarea: window.__old.textarea === document.querySelector('textarea'),
    send: window.__old.send === document.querySelector('section button'),
  }));
}

export const log = (page, text) => page.evaluate((t) => console.log(t), text);
