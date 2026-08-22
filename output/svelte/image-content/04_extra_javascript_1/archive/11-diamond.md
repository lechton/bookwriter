# 11 · The Diamond Problem — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/11-diamond.png`.

- **Concept (shot #11):** The diamond problem — why update order matters.
- **Source:** digest §7, the diamond shape, topological order, and the "glitch."
- **Why it earns a card:** correctness depends on *ordering over time* — both deriveds before the effect — which is the essence of a temporal flow.

---

## Block 1 — Code · "THE DIAMOND PROBLEM"

```js
let price   = $state(100);              // source
let withTax = $derived(price * 1.2);    // reads price
let label   = $derived(price + " pts"); // reads price
$effect(() => render(withTax, label));  // reads BOTH

price = 200;   // both must update before the effect
```

- **Highlighted line:** `$effect(() => render(withTax, label));` — the join, where the two paths reunite.
- **Boxed token:** `price` (on the assignment line) — the shared source at the diamond's apex.

## Block 2 — Execution Flow · "DIAMOND UPDATE ORDER"

- **Stage 1 — A diamond shape.** `price` —(split)→ `withTax` `label` —(join)→ `effect (reads both)`. Note: "One source feeds two deriveds; one effect reads both — paths split and rejoin."
- **Stage 2 — The source changes.** `price = 200`. Note: "Both deriveds now depend on a new value at once."
- **Stage 3 — Topological order.** ✓ `withTax = 240` · ✓ `label = "200 pts"` → `effect`. Note: "Both middles recompute first; the effect then runs once."
- **Stage 4 — The glitch it avoids.** ✗ `naive order` `effect(240, "100 pts")`. Note: "A wrong order runs the effect on a half-updated mix — a glitch."

## Block 3 — Summary

In a diamond, **one source feeds two deriveds and a single effect reads both**. A correct system updates in **topological order** — both middle deriveds before the bottom effect — so the effect **never runs on a half-updated mix**. The failure has a name: a `glitch`, the brief flash of an inconsistent state.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
