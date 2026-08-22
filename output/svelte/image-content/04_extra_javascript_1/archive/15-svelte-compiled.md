# 15 · Svelte: Compiled Signals, No Virtual DOM — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/15-svelte-compiled.png`.

- **Concept (shot #15):** Svelte — compiled signals, no virtual DOM.
- **Source:** digest §9, *Three Answers: React, Vue, And Svelte* (Svelte 5); the compiler from the state chapter.
- **Why it earns a card:** the flow spans build time and run time — compile → wire → fire → surgical update — a real sequence, and the punchline (no diff) only lands by tracing it.

---

## Block 1 — Code · "SVELTE: COMPILED SIGNALS, NO VIRTUAL DOM"

```svelte
<script>
  let claps = $state(0);
</script>

<button onclick={() => claps++}>
  {claps} claps
</button>
```

- **Highlighted line:** `{claps} claps` — the binding the compiler wires straight to a text node.
- **Boxed token:** `{claps}` — the one binding whose dependency the compiler resolves ahead of time.

## Block 2 — Execution Flow · "COMPILE, WIRE, UPDATE"

- **Stage 1 — Compiler reads it** *(build time).* `compiler sees` `{claps} → claps signal`. Note: "Ahead of time, it knows which node depends on which signal."
- **Stage 2 — It generates direct wiring.** `signal → text node` `no vDOM emitted`. Note: "Code that connects the signal straight to that one node."
- **Stage 3 — A change fires the signal.** `claps++` → `signal.set`. Note: "At runtime, the assignment fires the claps signal."
- **Stage 4 — That one node updates.** → `text node` `updates directly`. Note: "The pre-wired path edits exactly that node — no diff, no comparison."

## Block 3 — Summary

Svelte is a **compiler**: at build time it knows **which DOM nodes depend on which signals**, so it emits code that **wires each signal straight to its node**. A change updates **exactly that node — no virtual DOM, no diff**. The most fine-grained of the three: not which component, but `which node`.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
