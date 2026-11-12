export async function clickIn(page, sleep, rowName, label) {
  await page.evaluate((rowName, label) => {
    const scope = rowName ? [...document.querySelectorAll('li')].find((li) => li.textContent.startsWith(rowName + ':')) : document;
    [...scope.querySelectorAll('button')].find((b) => b.textContent.trim() === label).click();
  }, rowName, label);
  await sleep(300);
}

export async function addOneBreadWithLocations(page, sleep, snap) {
  const lines = [];
  page.on('console', (msg) => {
    const loc = msg.location();
    lines.push(msg.type() + ' ' + msg.text() + ' @ ' + (loc.url || '').replace(/^https?:\/\/[^/]+\//, '').replace(/\?.*$/, '') + ':' + (loc.lineNumber + 1));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(300);
  lines.push('--- page opened, the user clicks Add one on Bread');
  await clickIn(page, sleep, 'Bread', 'Add one');
  await snap('after Add one on Bread (reloaded page)');
  console.log('== Console with locations, after reload');
  console.log(lines.join('\n'));
}
