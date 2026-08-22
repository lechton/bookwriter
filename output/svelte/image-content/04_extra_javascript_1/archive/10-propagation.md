# 10 · Source → Derived → Effect — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/10-propagation.png`.

- **Concept (shot #10):** A change propagates through source → derived → effect.
- **Source:** digest §7, *The Dependency Graph: The Structure That Holds It Together*; the three node kinds (hold, compute, do).
- **Why it earns a card:** a single write fans out along the graph over time — recompute, rerun, edit — the core propagation algorithm in motion.

---

## Block 1 — Code · "SOURCE → DERIVED → EFFECT"

```js
let reader = $state("Ada");                // source
let greeting = $derived(`Hi, ${reader}`);  // derived
$effect(() => {                            // effect
  masthead.textContent = greeting;
});

reader = "Linus";   // → greeting recomputes → effect reruns
```

- **Highlighted line:** `reader = "Linus";` — the source write that triggers the whole propagation.
- **Boxed token:** none — the highlighted change line carries the emphasis; the graph is the star.

## Block 2 — Execution Flow · "PROPAGATION FLOW"

- **Stage 1 — Three kinds of node.** `source` reader ↓ `derived` greeting ↓ `effect` masthead. Note: "Hold, compute, do — wired by the reads you wrote."
- **Stage 2 — A source changes.** `reader = "Linus"`. Note: "A write to the source signal at the top of the graph."
- **Stage 3 — Follow the arrows.** `reader ★` ↓ `recompute` greeting → "Hi, Linus" ↓ `rerun` effect. Note: "Only nodes downstream of the change are touched."
- **Stage 4 — The effect edits the DOM.** `DOM edit` masthead = "Hi, Linus". Note: "The leaf reaches out of the data graph and edits one node of the page."

## Block 3 — Summary

Reactivity is **a directed graph of sources, deriveds, and effects**, wired by your reads. When a source changes, the framework **follows the arrows out of it** — recomputing the deriveds that read it, rerunning the effects that read those — and **touches nothing the change couldn't reach**. `Hold, compute, do.`

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
