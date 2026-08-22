# 5 | Proxy: A Proxy Intercepts Every Read and Write Through Traps

## Project

```
js_review/
└─ examples/
   └─ proxy.js   ◀ this file
```

## A target wrapped in a proxy with two traps

```js title="js_review/examples/proxy.js"
const target = { headline: "Markets rally" };
const article = new Proxy(target, {    // **wraps** target in a proxy
  get(t, k) {                          // **get** trap — runs on every read
    console.log("read:", k);           // prints **"read:"** + the key
    return t[k];
  },
  set(t, k, v) {                       // **set** trap — runs on every write
    console.log("write:", k);          // prints **"write:"** + the key
    t[k] = v;
    return true;
  }
});
article.headline;                      // fires **get** → "read: headline"
article.claps = 5;                     // fires **set** → "write: claps"
```

### Code Comments

**1** | `target` is the real object we want to watch — here it holds one property, `headline`.

**2** | `new Proxy(target, handler)` wraps `target`; from now on every read and write of `article` runs the handler first.

**3** | The `get` trap runs on **every property read** — it logs the access, your code in the gap, then returns the real value.

**7** | The `set` trap runs on **every property write** — it logs, stores the value on `target`, and returns `true`.

**13** | Reading `article.headline` fires the `get` trap → prints **"read: headline"**.

**14** | Writing `article.claps = 5` fires the `set` trap → prints **"write: claps"** — even though `claps` never existed.

## Summary

A proxy is an object that stands in front of a target. **Every operation** on it — get, set, and more — first runs a **trap** function you supply, then reaches the target. Unlike a getter, which guards one property you named in advance, a proxy **intercepts every property — even ones added later**, like `claps`. Run it and the traps log `read: headline`, then `write: claps`.

## Explanation

A proxy wraps a target. Every read runs the `get` trap and every write runs the `set` trap before touching the target — so your code runs in the gap on every operation, even for properties that do not exist yet.

```
   article.headline   ──▶  get trap (logs)  ──▶  target  ──▶  "Markets rally"

   article.claps = 5  ──▶  set trap (logs)  ──▶  target  (+ new claps)
```

- ✅ read `article.headline` → get trap runs → logs `read: headline` → returns "Markets rally"
- ✅ write `article.claps = 5` → set trap runs → logs `write: claps` → stores a brand-new property
- ❌ a getter guards one named property — a proxy intercepts **every** property, even ones added later

**Glossary**
- **proxy** — an object that wraps a target and runs your code on its operations
- **trap** — the handler a proxy runs for one kind of operation, like get or set
- **interception** — running code in the gap before a read or write reaches the target

**Takeaway:** A proxy intercepts **every read and write through traps** — even properties added later — which is exactly the hook a reactive framework needs to run bookkeeping on your plain code.
