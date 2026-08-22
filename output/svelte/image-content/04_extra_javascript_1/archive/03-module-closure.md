# 03 · A Module Is A Closure — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/03-module-closure.png`.

- **Concept (shot #3):** Sharing state across files with a module closure.
- **Source:** digest §2, *Functions Are Values, And Closures Are Private Memory*; state booklet Q12, the encapsulated-sharing module.
- **Why it earns a card:** a module's lifecycle is a real sequence — evaluated once, captured, written by one file, read by another — not a static fact.

---

## Block 1 — Code · "A MODULE IS A CLOSURE"

```js
// session.js — evaluated once, shared everywhere
let reader = null;        // private — never exported

export function login(name) { reader = name; }
export function current()   { return reader; }

// — called from two different files —
login("Ada Lovelace");   // comment-form.js  (write)
current();               // masthead.js       (read)
```

- **Highlighted line:** `let reader = null;` — private state, never exported.
- **Boxed token:** `reader` inside `login` and `current` — the captured variable each export closes over.

## Block 2 — Execution Flow · "MODULE & SHARED-SCOPE FLOW"

- **Stage 1 — The module runs once.** `import "./session.js"` → `module scope` `reader: null`. Note: "First import evaluates the file top-to-bottom — one scope is born."
- **Stage 2 — Exports capture it.** `login()` `current()` —(close over)→ `captured` `reader`. Note: "Both exported functions close over the private reader."
- **Stage 3 — One file writes.** `login("Ada…")` → `module scope` `reader: "Ada…"`. Note: "comment-form.js sets the one shared reader."
- **Stage 4 — Another file reads.** `current()` → ✓ same value `"Ada Lovelace"`. Note: "masthead.js, a different file, sees it. reader itself is never importable."

## Block 3 — Summary

A module's top-level scope is **a closure, created once on first import**. State you declare but **don't export stays private** — the exported functions close over it, and they are the only doors in. Every file that imports them **shares the one live instance**, which is exactly how a module becomes a `singleton` store.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
