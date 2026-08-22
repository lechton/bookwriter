## 7 — Reactive object: reads track, writes trigger, through plain dots
@tags Proxy, Observer, Reactivity

**Q. With reactive({ claps: 0 }), you never call subscribe. So why does article.claps = 2 re-run the effect that read it?**

**Answer.** Because the object is wrapped in a proxy whose traps are wired to the track-and-trigger engine. Reading `article.claps` runs the `get` trap, which records the active effect. Writing `article.claps = 2` runs the `set` trap, which re-runs every recorded effect. You wrote plain dot syntax; the proxy did the bookkeeping.

**Why it works.** The pieces from the last two cards are joined here. The proxy intercepts every property, even ones added later. The `get` trap uses that interception to *track* whoever is reading. The `set` trap uses it to *trigger* everyone who ever read. The surface stays clean — `article.claps`, no method calls — and underneath, an entire dependency graph keeps itself in sync.

```js title="examples/reactive.js"
let activeEffect = null;               // who's reading right now?
function reactive(target) {
  const deps = new Set();
  return new Proxy(target, {           // wrap in a proxy
    get(obj, key) {
      if (activeEffect) deps.add(activeEffect);  // track on read
      return obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      deps.forEach(run => run());      // trigger on write
      return true;
    }
  });
}
function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}
const article = reactive({ claps: 0 });
effect(() => console.log("claps:", article.claps));  // "claps: 0"
article.claps = 1;                                    // "claps: 1"
article.claps = 2;                                    // "claps: 2"
```

<div class="dg" style="display:flex; flex-direction:column; align-items:center; gap:10px; padding:32px 16px 20px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">One Surface, Two Faces</span>
<div style="border:3px solid #000; background:#bbf7d0; padding:8px 16px; font-family:var(--mono); font-weight:800; font-size:13pt; box-shadow:4px 4px 0 0 #000; text-align:center;">
article.claps = 2
</div>
<div style="font-size:7pt; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; background:#fff; border:2px solid #000; padding:2px 8px;">clean syntax · no subscribe call</div>
<div style="font-size:18pt; font-weight:900; line-height:1;">↓</div>
<div style="display:flex; gap:10px; width:100%;">
<div style="flex:1; border:3px solid #000; background:#bfdbfe; padding:10px 8px; box-shadow:4px 4px 0 0 #000; text-align:center;">
<div style="font-size:6.5pt; font-weight:800; background:#3b82f6; color:#fff; padding:2px 6px; display:inline-block; border:2px solid #000;">get TRAP</div>
<div style="font-family:var(--mono); font-weight:800; font-size:10pt; margin-top:6px;">on read</div>
<div style="font-size:7pt; font-weight:800; text-transform:uppercase; color:#1e3a8a; margin-top:4px;">tracks the reader</div>
</div>
<div style="flex:1; border:3px solid #000; background:#fef08a; padding:10px 8px; box-shadow:4px 4px 0 0 #000; text-align:center;">
<div style="font-size:6.5pt; font-weight:800; background:#eab308; color:#000; padding:2px 6px; display:inline-block; border:2px solid #000;">set TRAP</div>
<div style="font-family:var(--mono); font-weight:800; font-size:10pt; margin-top:6px;">on write</div>
<div style="font-size:7pt; font-weight:800; text-transform:uppercase; color:#854d0e; margin-top:4px;">triggers readers</div>
</div>
</div>
</div>

> **Summary.** A reactive object hides the track-and-trigger engine behind ordinary dot-notation: writes trigger, reads track, all through proxy traps. This is almost exactly what a framework hands you, and what Svelte calls a rune.
