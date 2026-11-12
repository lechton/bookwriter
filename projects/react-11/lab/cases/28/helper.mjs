export async function buttons(page) {
  return page.evaluate(() => [...document.querySelectorAll('button')].map((b) => b.textContent + ' class=' + JSON.stringify(b.getAttribute('class')) + ' bg=' + getComputedStyle(b).backgroundColor + ' color=' + getComputedStyle(b).color));
}

export async function clickText(page, sleep, label) {
  await page.evaluate((label) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === label).click(), label);
  await sleep(300);
}

export async function toggleTwice(page, sleep, label = 'Toggle theme') {
  console.log('on load:', JSON.stringify(await buttons(page)));
  await clickText(page, sleep, label);
  console.log('after one click on ' + label + ':', JSON.stringify(await buttons(page)));
  await clickText(page, sleep, label);
  console.log('after a second click on ' + label + ':', JSON.stringify(await buttons(page)));
}
