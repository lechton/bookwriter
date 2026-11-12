export default async function ({ page }) {
  const result = await page.evaluate(async () => {
    const code = await (await fetch('/src/components/Stopwatch.jsx')).text();
    const genLines = code.split('\n');
    const genLine = genLines.findIndex((l) => l.includes('Stopwatch rendered'));
    const m = code.match(/sourceMappingURL=data:application\/json;(?:charset=utf-8;)?base64,([A-Za-z0-9+/=]+)/);
    const map = JSON.parse(atob(m[1]));
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const decode = (s) => { const out = []; let v = 0, sh = 0; for (const c of s) { let d = chars.indexOf(c); const cont = d & 32; d &= 31; v += d << sh; if (cont) sh += 5; else { const neg = v & 1; v >>= 1; out.push(neg ? -v : v); v = 0; sh = 0; } } return out; };
    let sl = 0; const res = [];
    map.mappings.split(';').forEach((line, gi) => { if (!line) return; line.split(',').forEach((seg) => { const d = decode(seg); if (d.length > 1) sl += d[2]; if (gi === genLine) res.push(sl + 1); }); });
    return { generatedLine: genLine + 1, generatedText: genLines[genLine].trim(), sourceLines: [...new Set(res)] };
  });
  console.log('-- console.log line through the source map: ' + JSON.stringify(result));
}
