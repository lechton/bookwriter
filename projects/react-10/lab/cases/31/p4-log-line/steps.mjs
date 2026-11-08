import { SourceMapConsumer } from 'source-map-js';
export default async function ({ page }) {
  const served = await page.evaluate(async () => (await fetch('/src/components/GuestList.jsx')).text());
  const lines = served.split('\n');
  const genLine = lines.findIndex((l) => l.includes('console.log(inputRef.current)')) + 1;
  const b64 = served.match(/sourceMappingURL=data:application\/json;(?:charset=utf-8;)?base64,([A-Za-z0-9+/=]+)/)[1];
  const map = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  const smc = new SourceMapConsumer(map);
  const col = lines[genLine - 1].indexOf('console');
  const orig = smc.originalPositionFor({ line: genLine, column: col });
  console.log('-- served line of console.log:', genLine, '| source-mapped line:', orig.line, orig.source);
}
