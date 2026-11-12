const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Chrome's Console shows positions through the source map, so map the
// generated position the protocol reports back to the reader's line.
const decode = (mappings) => {
  const lines = [];
  let src = 0, oLine = 0, oCol = 0;
  for (const row of mappings.split(';')) {
    let gCol = 0;
    const segs = [];
    for (const seg of row.split(',')) {
      if (!seg) continue;
      const nums = [];
      let value = 0, shift = 0;
      for (const ch of seg) {
        const digit = B64.indexOf(ch);
        value += (digit & 31) << shift;
        if (digit & 32) shift += 5;
        else { nums.push(value & 1 ? -(value >> 1) : value >> 1); value = 0; shift = 0; }
      }
      gCol += nums[0];
      if (nums.length >= 4) { src += nums[1]; oLine += nums[2]; oCol += nums[3]; segs.push([gCol, oLine]); }
    }
    lines.push(segs);
  }
  return lines;
};

export default async function ({ page, sleep, snap }) {
  const code = await page.evaluate(() => fetch('/src/components/Scoreboard.jsx').then((r) => r.text()));
  const b64 = code.match(/sourceMappingURL=data:application\/json;base64,(.+)$/m)[1];
  const map = JSON.parse(Buffer.from(b64, 'base64').toString());
  const lines = decode(map.mappings);
  page.on('console', (msg) => {
    const loc = msg.location();
    if (!/Scoreboard\.jsx/.test(loc.url || '')) return;
    const segs = lines[loc.lineNumber] || [];
    let best;
    for (const s of segs) if (s[0] <= loc.columnNumber) best = s;
    console.log('   Console shows: ' + msg.text() + ' | Scoreboard.jsx:' + (best ? best[1] + 1 : '?'));
  });
  for (const s of ["section > button:nth-of-type(3)"]) {
    await page.click(s);
    await sleep(300);
    await snap('after click on ' + s);
  }
}
