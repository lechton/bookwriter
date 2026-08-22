## 5 — Proxy: traps that fire on every read and write
@tags Objects, Traps, Interception

**Q. claps was never defined on the object, so why does article.claps = 5 get logged?**

**Answer.** Because `article` is not the real object. It is a proxy wrapping a target, with a handler that intercepts every operation. Writing `article.claps = 5` fires the `set` trap before anything reaches the target, and the trap logs the access, even for a property that did not exist a moment ago.

**Why it works.** A getter guards one property you named in advance. A proxy sits in front of the *entire* object. Every read runs the `get` trap and every write runs the `set` trap, no matter which key is touched, no matter whether it existed before. Your code runs in the gap between the access and the target, every single time.

```js title="examples/proxy.js"
const target = { headline: "Markets rally" };
const article = new Proxy(target, {    // wraps target in a proxy
  get(t, k) {                          // get trap — runs on every read
    console.log("read:", k);
    return t[k];
  },
  set(t, k, v) {                       // set trap — runs on every write
    console.log("write:", k);
    t[k] = v;
    return true;
  }
});
article.headline;                      // fires get  → "read: headline"
article.claps = 5;                     // fires set  → "write: claps"
```

<div class="dg" style="display:flex; flex-direction:column; align-items:center; gap:10px; padding:32px 16px 20px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">The Checkpoint</span>
<div style="border:3px solid #000; background:#fbcfe8; padding:8px 14px; font-family:var(--mono); font-weight:800; font-size:11pt; box-shadow:4px 4px 0 0 #000; position:relative;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px;">1 · WRITE</span>
article.claps = 5
</div>
<div style="font-size:18pt; font-weight:900; line-height:1;">↓</div>
<div style="border:3px solid #000; background:#fef08a; padding:8px 14px; font-family:var(--mono); font-weight:800; font-size:11pt; box-shadow:4px 4px 0 0 #000; position:relative; min-width:60%; text-align:center;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px;">2 · TRAP</span>
set(t, "claps", 5)<br/><span style="font-family:var(--sans); font-size:7.5pt; font-weight:700; color:#4b5563; text-transform:uppercase;">logs "write: claps"</span>
</div>
<div style="font-size:18pt; font-weight:900; line-height:1;">↓</div>
<div style="border:3px solid #000; background:#bfdbfe; padding:8px 14px; font-family:var(--mono); font-weight:800; font-size:11pt; box-shadow:4px 4px 0 0 #000; position:relative; min-width:60%; text-align:center;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px;">3 · TARGET</span>
target.claps = 5<br/><span style="font-family:var(--sans); font-size:7.5pt; font-weight:700; color:#4b5563; text-transform:uppercase;">a brand-new property</span>
</div>
</div>

> **Summary.** A proxy intercepts every read and write through traps, even on properties that did not exist a moment ago. We can now run code on every access — the open question is what the most useful thing to run there would be.
