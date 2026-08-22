# 7 | Reactive Object: Wrap an Object So Reads Track and Writes Trigger

## Project

```
js_review/
└─ examples/
   └─ reactive.js   ◀ this file
```

## The proxy and the engine, joined

```js title="js_review/examples/reactive.js"
let activeEffect = null;               // who's reading **now**?
function reactive(target) {
  const deps = new Set();
  return new Proxy(target, {           // wrap in a **proxy**
    get(obj, key) {
      if (activeEffect) deps.add(activeEffect);
      return obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      deps.forEach(run => run());      // **trigger** on write
      return true;
    }
  });
}
function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}
const article = reactive({ claps: 0 }); // made **reactive**
effect(() => console.log("claps:", article.claps));
article.claps = 1;                     // re-runs the effect → "claps: 1"
article.claps = 2;                     // re-runs the effect → "claps: 2"
```

### Code Comments

**1** | `activeEffect` — the same global slot from the engine: which effect is reading right now.

**4** | `reactive` wraps the object in a **proxy**, so every property read and write runs our traps.

**6** | The `get` trap **tracks**: while an effect runs, reading any property records it in `deps`.

**11** | The `set` trap **triggers**: writing any property re-runs every recorded effect.

**21** | `article` is a plain object made reactive — you use it with normal dot syntax, no special read or write calls.

**22** | The effect reads `article.claps` → **subscribes** → prints `claps: 0`.

**23** | `article.claps = 1` → the set trap re-runs the effect → prints `claps: 1`.

**24** | `article.claps = 2` → prints `claps: 2`.

## Summary

This is where it all meets. The **proxy** intercepts every read and write of a plain object; the **tracking engine** records reading effects and re-runs them on change. Bundle them and you get a **reactive object**: you write `article.claps = 2` like any object, and every effect that read `claps` re-runs by itself. No `read()` or `write()` calls, no manual subscribe — ordinary syntax, automatic reactivity.

## Explanation

The getter taught a read can run code; the proxy made it run on every property; the observer turned that code into track-and-trigger. Joined here: the `get` trap records the active effect, the `set` trap re-runs the recorded effects, and you touch the object with plain dots.

```
   effect(fn) ─reads article.claps─▶ get trap ─tracks──▶ deps { fn }
   article.claps = 2 ──────────────▶ set trap ─triggers─▶ fn()  →  "claps: 2"
```

- ✅ effect reads `article.claps` → get trap tracks → prints `claps: 0`
- ✅ `article.claps = 1`, `= 2` → set trap triggers → `claps: 1`, `claps: 2`
- ✅ plain dot syntax — no `read()`/`write()`; the proxy does the bookkeeping

**Glossary**
- **reactive object** — a proxy that tracks reads and triggers writes on every property
- **proxy trap** — the get/set handler that performs the track and the trigger
- **fine-grained reactivity** — only the effects that read a value re-run when it changes

**Takeaway:** Write `article.claps = 2` like any object and the readers re-run themselves. This is exactly what Svelte hands you as **`$state`** — a reactive object you use with plain syntax.
