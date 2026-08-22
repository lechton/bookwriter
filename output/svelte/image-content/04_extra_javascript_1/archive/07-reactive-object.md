# 07 · A Reactive Object = Proxy + Signals — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/07-reactive-object.png`.

- **Concept (shot #7):** A reactive object is a proxy bundling one signal per property.
- **Source:** digest §6, *The Signal, And Why It Is Not A Proxy* — how Svelte composes a proxy over per-property signals.
- **Why it earns a card:** the composition unfolds over time — wrap → first touch creates a signal → get subscribes → set triggers — a real runtime sequence.

---

## Block 1 — Code · "A REACTIVE OBJECT = PROXY + SIGNALS"

```js
// a deep reactive object
let article = $state({
  headline: "Markets rally",
  claps: 0,
});

article.headline;     // get trap → headline signal
article.claps += 1;   // set trap → claps signal fires
```

- **Highlighted line:** `let article = $state({ ... })` — putting an object in the rune wraps it in a proxy.
- **Boxed token:** `$state` — the rune that builds the proxy-over-signals.

## Block 2 — Execution Flow · "PROXY-OVER-SIGNALS FLOW"

- **Stage 1 — Wrap the object.** `$state({ … })` → `proxy` `fronts the object`. Note: "A primitive would get one signal; an object gets a proxy."
- **Stage 2 — A touch makes a signal.** `headline` → `new signal` `headline`. Note: "On first touch, the proxy stands up one signal for that property."
- **Stage 3 — get routes to it.** `article.headline` → `signal.get` `subscribe`. Note: "Reading routes through the signal and subscribes the caller."
- **Stage 4 — set routes to it.** `article.claps += 1` → `signal.set` `trigger`. Note: "Writing fires only that property's signal. Nested objects get their own proxies."

## Block 3 — Summary

A deep reactive object is **a proxy fronting one signal per property**. The proxy is the front desk: on first touch it **stands up a signal for that property**, then its get **subscribes through that signal** and its set **triggers it** — breadth over all properties, depth per value. A `bundle of signals`.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
