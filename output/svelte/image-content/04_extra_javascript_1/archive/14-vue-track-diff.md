# 14 · Vue: Track Through A Proxy, Then Diff — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/14-vue-track-diff.png`.

- **Concept (shot #14):** Vue — track through a proxy, then diff.
- **Source:** digest §9, *Three Answers: React, Vue, And Svelte* (Vue 3).
- **Why it earns a card:** the hybrid runtime sequence — proxy track → trigger only dependents → still build and diff a vDOM — is a real flow with a twist worth tracing.

---

## Block 1 — Code · "VUE: TRACK THROUGH A PROXY, THEN DIFF"

```js
import { reactive, ref } from "vue";

const article = reactive({ claps: 0 });  // proxy
const n = ref(0);                        // boxed primitive

article.claps++;   // set trap → trigger
n.value++;         // .value: a primitive can't be proxied
```

- **Highlighted line:** `const article = reactive({ claps: 0 });` — wrapping an object in a proxy.
- **Boxed tokens:** `reactive` (object → proxy) and `ref` (primitive → `.value` box).

## Block 2 — Execution Flow · "TRACK, TRIGGER, DIFF"

- **Stage 1 — Make it reactive.** `reactive({})` → `proxy`; `ref(0)` → `.value box`. Note: "An object → a proxy; a primitive → a .value box (it can't be proxied)."
- **Stage 2 — Track on read.** `render reads claps` (get trap) → `subscribed` `this component`. Note: "Each property a render reads subscribes that component."
- **Stage 3 — Trigger on write.** `article.claps++` → `rerun` `only dependents`. Note: "Fine-grained about which components rerun — only those that read it."
- **Stage 4 — But still diff.** `component` → `vDOM` → `diff → patch`. Note: "The rerun component still builds and diffs a virtual DOM."

## Block 3 — Summary

Vue makes objects reactive with **reactive (a proxy)** and primitives with **ref (a `.value` box, since a primitive can't be proxied)**. It runs the observer pattern — **track on read, trigger only the components that depend on a value** — but the rerun component **still builds and diffs a virtual DOM**. A hybrid.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
