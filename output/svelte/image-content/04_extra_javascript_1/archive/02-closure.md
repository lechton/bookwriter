# 02 · A Closure Keeps Private Memory — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/02-closure.png`.

- **Concept (shot #2):** A closure keeps private memory alive.
- **Source:** digest §2, *Functions Are Values, And Closures Are Private Memory*; the clap-counter factory.
- **Why it earns a card:** the variable's survival is a runtime story — born, captured, outlives its frame, still mutable — a true temporal flow.

---

## Block 1 — Code · "A CLOSURE KEEPS PRIVATE MEMORY"

```js
function createClapButton() {
  let claps = 0; // private to this scope
  return {
    clap()  { claps += 1; },
    total() { return claps; },
  };
}

const article = createClapButton();
article.clap(); article.clap();
article.total();   // 2  ← claps survived
```

- **Highlighted line:** `let claps = 0;` — the private variable, local to the factory's scope.
- **Boxed token:** `claps` inside `clap()` and `total()` — the captured variable each closure references.

## Block 2 — Execution Flow · "EXECUTION & MEMORY FLOW"

- **Stage 1 — The scope is born.** `createClapButton()` → `private scope` `claps: 0`. Note: "Calling the factory creates a fresh scope holding claps."
- **Stage 2 — The functions capture it.** `clap()` `total()` —(close over)→ `claps` `0`. Note: "Defined inside, both functions close over claps."
- **Stage 3 — The factory returns…** `createClapButton` (popped) · `global` → `still alive` `claps: 0`. Note: "Its frame is popped, but the scope survives — clap & total still reference it."
- **Stage 4 — Private, mutable state.** `article.clap()` ×2 → `claps` `0 → 1 → 2`. Note: "Only clap() and total() can touch claps — nothing outside can."

## Block 3 — Summary

A closure is **a function bundled together with references to its surrounding state**. When `createClapButton()` returns, its local `claps` would normally be discarded, but because clap() and total() still reference it, the scope is **kept alive**. The variable becomes **private state, reachable only through the returned functions** — encapsulation with no class required.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
