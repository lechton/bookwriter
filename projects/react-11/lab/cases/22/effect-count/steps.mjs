export default async function ({ page, sleep, snap }) {
  await page.evaluate(() => {
    window.__seen = [];
    const record = (why) => window.__seen.push(why + ': ' + document.querySelector('#count').textContent + ' / ' + document.querySelectorAll('li').length + ' rows');
    new MutationObserver(() => record('mutation')).observe(document.getElementById('root'), { subtree: true, childList: true, characterData: true });
    const loop = () => { record('frame'); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  });
  await sleep(100);
  await page.evaluate(() => { window.__seen = []; });
  await page.click('button');
  await sleep(300);
  const seen = await page.evaluate(() => window.__seen);
  const compact = seen.filter((s, i) => i === 0 || s !== seen[i - 1]);
  console.log('== DOM states after click: ' + JSON.stringify(compact));
  await snap('after click');
}
