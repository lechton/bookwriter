export default async function ({ page, sleep }) {
  const sent = [];
  page.on('request', (r) => { if (r.url().includes('/api/buy')) sent.push(r.method()); });
  if (process.env.CLICK) {
    console.log(`-- purchase requests before any click: ${sent.length}`);
    const b = await page.$('button');
    await b.click();
    await sleep(500);
    console.log(`-- purchase requests after one click on Buy: ${sent.length} ${sent.join(',')}`);
  } else {
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(500);
    console.log(`-- purchase requests on one fresh load of the order page: ${sent.length} ${sent.join(',')}`);
  }
}
