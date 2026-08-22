# 05 · A Proxy And Its Traps — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/05-proxy-traps.png`.

- **Concept (shot #5):** A proxy intercepts every read and write through traps.
- **Source:** digest §4, *The Proxy: Intercepting Everything, And Why Interception Builds Frameworks*; underlies state booklet Q2, Q6, Q7, Q8.
- **Why it earns a card:** wrapping then accessing is a runtime sequence — wrap → read fires get → write fires set → total over properties — that traces what interception actually does.

---

## Block 1 — Code · "A PROXY AND ITS TRAPS"

```js
const target = { headline: "Markets rally" };

const article = new Proxy(target, {
  get(t, k)    { log("read", k);  return t[k]; },
  set(t, k, v) { log("write", k); t[k] = v; },
});

article.headline;    // get trap → "read headline"
article.claps = 5;   // set trap → "write claps" (new!)
```

- **Highlighted lines:** the `get` and `set` traps — the code that runs in the gap of every read and write.
- **Boxed tokens:** `get` and `set` — the two trap names.

## Block 2 — Execution Flow · "INTERCEPTION FLOW"

- **Stage 1 — Wrap the target.** `target` → `article (proxy)` `stands in front`. Note: "A stand-in sits in front of the real object."
- **Stage 2 — A read fires get.** `article.headline` → `get trap runs` `→ "Markets rally"`. Note: "Your code runs in the gap, then returns the value."
- **Stage 3 — A write fires set.** `article.claps = 5` → `set trap runs` `"write claps"`. Note: "Caught even though claps was never declared."
- **Stage 4 — Total over properties.** ✓ read · ✓ write · ✓ new prop · ✓ delete · ✗ Set internals. Note: "Every property operation is caught — a Set's private internals are not."

## Block 3 — Summary

A proxy is **an object that stands in front of another and intercepts the operations on it**, through functions called **traps**. Unlike a getter's one named slot, it catches **every property — including ones added later**. Interception in that gap is **how a framework wires reactivity into plain code**, with no `subscribe` calls for you to write.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
