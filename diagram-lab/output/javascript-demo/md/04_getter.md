## 4 — Getter: a read that secretly runs a function
@tags Objects, Accessor, Interception

**Q. article.byline has no parentheses, so why does it return a freshly built string every time you read it?**

**Answer.** Because `byline` is not a stored value. It is a getter: a property defined with the `get` keyword that secretly runs a function on every read. To the call site it looks identical to plain data, but inside, code is executing.

**Why it works.** Reading `article.author` is a plain data-property access — JavaScript hands back the stored string and nothing runs. Reading `article.byline` looks the same, but the `get` keyword makes it an accessor: reading it runs `get byline()` and returns whatever the function produces. Because it recomputes from the current `author` on every access, it can never go stale. This is the first crack in the passive read.

```js title="examples/byline.js"
const article = {
  author: "Ada Lovelace",              // a stored data property
  get byline() {                       // a getter — runs on every read
    return "By " + this.author;        // builds a fresh value
  }
};
console.log(article.byline);           // "By Ada Lovelace" (no parentheses)
article.author = "Grace Hopper";       // change the underlying data
console.log(article.byline);           // "By Grace Hopper" (recomputed)
```

<div class="dg" style="display:flex; flex-direction:column; gap:14px; padding:32px 16px 20px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Two Reads, Two Outcomes</span>
<div style="border:3px solid #000; background:#f3f4f6; padding:12px; box-shadow:4px 4px 0 0 #000;">
<div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
<span style="font-family:var(--mono); font-weight:800; font-size:11pt;">article.author</span>
<span style="font-size:14pt; font-weight:900;">→</span>
<span style="font-family:var(--mono); font-weight:800; font-size:9pt; background:#fff; border:2px solid #9ca3af; padding:2px 8px; color:#4b5563;">stored string</span>
</div>
<div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; margin-top:6px;">data property · no code runs</div>
</div>
<div style="border:3px solid #000; background:#f0fdf4; padding:12px; box-shadow:4px 4px 0 0 #000; position:relative;">
<span style="position:absolute; top:-9px; right:8px; background:#22c55e; color:#000; font-size:6.5pt; font-weight:800; padding:2px 6px; border:2px solid #000; text-transform:uppercase;">runs code</span>
<div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
<span style="font-family:var(--mono); font-weight:800; font-size:11pt;">article.byline</span>
<span style="font-size:14pt; font-weight:900;">→</span>
<span style="font-family:var(--mono); font-weight:800; font-size:9pt; background:#fef08a; border:2px solid #000; padding:2px 8px;">runs get byline()</span>
</div>
<div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#166534; margin-top:6px;">accessor · recomputes every read</div>
</div>
</div>

> **Summary.** A getter is a function disguised as a property: reading it runs code and returns a fresh value, so it can never go stale. The catch is that a getter guards one property you named in advance — what catches a property you didn't name?
