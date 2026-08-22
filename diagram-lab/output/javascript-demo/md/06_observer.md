## 6 — Observer: track on read, trigger on write
@tags Reactivity, Track, Trigger

**Q. An effect reads claps() exactly once. Later, setClaps(2) re-runs it. How did the write know the effect cared?**

**Answer.** Because the read remembered. While an effect runs, a single global slot called `activeEffect` holds it. When the effect reads a signal, that signal records the effect in its `deps` set — that is *track on read*. When the signal is later written, it walks that set and re-runs every recorded effect — that is *trigger on write*.

**Why it works.** `effect(fn)` parks `fn` in the slot, then runs it once so its reads can subscribe. Each signal it touches sees the slot occupied and adds `fn` to its dependents. The slot is cleared, but the subscriptions remain. A later write re-runs exactly those dependents and nobody else. Two moves — track and trigger — and you have reactivity.

```js title="examples/observer.js"
let activeEffect = null;               // who is reading right now?
function signal(initial) {
  let value = initial;
  const deps = new Set();
  function read() {
    if (activeEffect) deps.add(activeEffect);  // track on read
    return value;
  }
  function write(next) {
    value = next;
    deps.forEach(run => run());                // trigger on write
  }
  return [read, write];
}
function effect(fn) {
  activeEffect = fn;                   // park fn as the active reader
  fn();                                // run once so its reads subscribe
  activeEffect = null;
}
const [claps, setClaps] = signal(0);
effect(() => console.log("claps:", claps()));   // prints "claps: 0"
setClaps(1);                                    // re-runs effect → "claps: 1"
setClaps(2);                                    // re-runs effect → "claps: 2"
```

<div class="dg" style="display:flex; flex-direction:column; gap:16px; padding:32px 16px 20px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">The Engine, Two Moves</span>
<div style="border:3px solid #000; padding:12px; box-shadow:4px 4px 0 0 #000; background:#fef08a; position:relative;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px;">A · TRACK</span>
<div style="display:flex; align-items:center; justify-content:space-between; gap:6px; font-family:var(--mono); font-weight:800; font-size:9.5pt;">
<span>effect reads claps()</span><span style="font-size:13pt;">→</span><span>signal records fn</span>
</div>
<div style="font-size:8pt; font-weight:700; color:#4b5563; margin-top:6px; text-align:center;">deps ← fn · parked in activeEffect while reading</div>
</div>
<div style="border:3px solid #000; padding:12px; box-shadow:4px 4px 0 0 #000; background:#bbf7d0; position:relative;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px;">B · TRIGGER</span>
<div style="display:flex; align-items:center; justify-content:space-between; gap:6px; font-family:var(--mono); font-weight:800; font-size:9.5pt;">
<span>setClaps(2) writes</span><span style="font-size:13pt;">→</span><span>deps re-run fn()</span>
</div>
<div style="font-size:8pt; font-weight:700; color:#166534; margin-top:6px; text-align:center;">"claps: 2" · every recorded effect, no one else</div>
</div>
</div>

> **Summary.** A value that notices its readers and re-runs them when it changes is the whole engine of reactivity — track on read, trigger on write. The next step is to package that engine so plain dot-notation does both moves for you.
