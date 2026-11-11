export default async function ({ page, sleep }) {
  let lines = 0;
  page.on('console', () => { lines += 1; });
  await sleep(1000);
  console.log('console lines in one second after load: ' + lines);
}
