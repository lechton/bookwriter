# 09 · Raw State: One Signal, No Proxy — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/09-raw-state.png`.

- **Concept (shot #9):** Raw state — mutation ignored, reassignment fires.
- **Source:** digest §6 (closing) and state booklet entry 7, the `$state.raw` variant.
- **Why it earns a card:** two writes produce two opposite runtime outcomes (mutate → nothing; reassign → fires), and the rule is *derived* from the architecture — a genuine flow.

---

## Block 1 — Code · "RAW STATE: ONE SIGNAL, NO PROXY"

```js
let feed = $state.raw(["Markets rally"]);

feed.push("Fed holds");   // mutation → IGNORED
feed = ["Fed holds"];     // reassign → FIRES
```

- **Highlighted line:** `let feed = $state.raw([...])` — raw keeps the outer signal, skips the proxy.
- **Boxed token:** `$state.raw` — the rune that opts out of deep tracking.

## Block 2 — Execution Flow · "RAW STATE FLOW"

- **Stage 1 — One signal, no proxy.** `$state.raw([…])` → `one signal` `wraps the array`. Note: "Raw keeps the outer signal but skips the proxy."
- **Stage 2 — Mutate inside → nothing.** `feed.push("…")` → ✗ `no signal fires` `no inner signal exists`. Note: "No proxy means there is no signal on the contents to trigger."
- **Stage 3 — Reassign whole → fires.** `feed = […]` → ✓ `fires` `the outer signal`. Note: "Assignment is a set on the one signal that exists."
- **Stage 4 — Derive the rule.** `no proxy ⇒ no inner signals ⇒ only assignment fires`. Note: "The behavior follows from the architecture, not a special case."

## Block 3 — Summary

Raw state keeps **the single top-level signal but skips the proxy**. With no proxy, **no per-property signals are ever created**, so reaching in changes nothing — **only replacing the whole value fires**, because that is a set on the one signal that exists. `Mutation ignored, reassignment tracked.`

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
