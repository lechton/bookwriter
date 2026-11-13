export default async function ({ page, sleep, snap }) {
  await page.setJavaScriptEnabled(false);
  await page.reload({ waitUntil: 'networkidle0' });
  const sent = [];
  page.on('request', (req) => { if (req.isNavigationRequest()) sent.push(req.method() + ' ' + new URL(req.url()).pathname + ' body=' + JSON.stringify(req.postData() ?? null)); });
  await page.type('#section-email', 'john@mail.com');
  await page.click('#div-button');
  await sleep(500);
  console.log('== Requests after a click on the div: ' + JSON.stringify(sent));
  await page.type('input[name="username"]', 'john');
  await page.type('#email-no-name', 'john@mail.com');
  await page.click('button[type="submit"]');
  await sleep(1000);
  console.log('== Requests after a click on the submit button: ' + JSON.stringify(sent));
}
