# 08 · $State Drives The DOM — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/08-state-dom.png`.

- **Concept (shot #8):** $state drives a fine-grained DOM update.
- **Source:** digest §6 / §9 (Svelte); the state chapter's counter — the reactivity loop end to end.
- **Why it earns a card:** one click runs the full reactive cycle — render → click → signal fires → surgical node update — a genuine runtime flow.

---

## Block 1 — Code · "$STATE DRIVES THE DOM"

```svelte
<script>
  let count = $state(0);            // fine-grained state
  function increment() { count += 1; }
</script>

<p>Current count: {count}</p>
<button onclick={increment}>+1</button>
```

- **Highlighted line:** `let count = $state(0);` — the rune that makes `count` reactive.
- **Boxed tokens:** `$state` (the rune) and `{count}` (the binding wired to a text node).

## Block 2 — Execution Flow · "REACTIVITY & EXECUTION FLOW"

- **Stage 1 — Initial render.** `count signal` `0` ⇢ `DOM text` `count: 0`. Note: "The text node that reads {count} subscribes to its signal."
- **Stage 2 — User clicks.** `+1` → `count += 1`. Note: "The click calls increment — a direct mutation, no setter."
- **Stage 3 — The signal fires.** `count signal` `0 → 1`. Note: "Svelte's fine-grained reactivity detects the change."
- **Stage 4 — Only that node updates.** → `DOM text` `count: 1`. Note: "Just the one text node bound to count updates — no vDOM, no diff."

## Block 3 — Summary

The **$state rune creates a fine-grained reactive variable**. Modifying it directly (`count += 1`) **fires its signal**, and Svelte updates **only the specific DOM nodes that read it** — no virtual DOM, no diff. Reactivity that is `surgical and explicit`.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
