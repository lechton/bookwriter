# 6 | Observer: Track on Read, Trigger on Write

## Project

```
js_review/
└─ examples/
   └─ observer.js   ◀ this file
```

## A value that remembers who reads it

```js title="js_review/examples/observer.js"
let activeEffect = null;               // who is reading **right now**?
function signal(initial) {
  let value = initial;
  const deps = new Set();
  function read() {
    if (activeEffect) deps.add(activeEffect);
    return value;
  }
  function write(next) {
    value = next;
    deps.forEach(run => run());        // **trigger**: re-run the readers
  }
  return [read, write];
}
function effect(fn) {
  activeEffect = fn;                   // park fn as the active reader
  fn();                                // run once — its reads **subscribe**
  activeEffect = null;
}
const [claps, setClaps] = signal(0);
effect(() => console.log("claps:", claps()));
setClaps(1);                           // re-runs the effect → "claps: 1"
setClaps(2);                           // re-runs the effect → "claps: 2"
```

### Code Comments

**1** | `activeEffect` is one global slot: "which function is reading right now?" Empty unless an effect is running.

**6** | On a read, if an effect is running, the signal **records** it in `deps`. This is **track on read**.

**11** | On a write, the signal **re-runs** every recorded effect. This is **trigger on write**.

**16** | `effect(fn)` parks `fn` in the slot, runs it once so its reads subscribe, then clears the slot.

**21** | The effect reads `claps()` while it is active → it **subscribes**, and prints `claps: 0`.

**22** | `setClaps(1)` writes → re-runs the subscribed effect → prints `claps: 1`.

**23** | `setClaps(2)` writes → prints `claps: 2`.

## Summary

This is the engine. A **signal** holds a value and a set of **dependents**. When something reads it while an **effect** is running, the signal **records that effect** — track on read. When the value is written, the signal **re-runs every effect** that read it — trigger on write. The effect never asks to be notified; reading the signal subscribes it automatically. Two moves, and you have reactivity.

## Explanation

The single global `activeEffect` is the trick. `effect(fn)` parks `fn` there and runs it; any signal `fn` reads sees `activeEffect` set and records `fn` as a dependent. Clear the slot, and later writes re-run exactly those dependents — no one else.

```
   effect(fn) ──reads──▶ signal.read()  ──records fn──▶  deps { fn }
                                                            │
   setClaps(2) ─writes─▶ signal.write() ──re-runs────────▶ fn()  →  "claps: 2"
```

- ✅ effect reads `claps()` → subscribes → first run prints `claps: 0`
- ✅ `setClaps(1)`, `setClaps(2)` → each re-runs the subscribed effect → `claps: 1`, `claps: 2`
- ❌ an effect that never reads a signal → never recorded → never re-runs

**Glossary**
- **signal** — a value that records who reads it and re-runs them when it changes
- **effect** — a function whose reads subscribe it, so it re-runs when its signals change
- **dependency** — the recorded link from a signal to an effect that read it
- **track / trigger** — record-on-read; re-run-on-write

**Takeaway:** A value that **notices its readers and re-runs them** is the whole engine of reactivity. Every framework signal — Svelte's included — is this pair of moves under a nicer surface.
