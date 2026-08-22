# 13 · React: Rerun, Then Diff — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/13-react-diff.png`.

- **Concept (shot #13):** React — rerun, then diff the virtual DOM.
- **Source:** digest §9, *Three Answers: React, Vue, And Svelte* (React); state booklet Q15.
- **Why it earns a card:** one setter call drives a fixed runtime pipeline — rerun → build vDOM → diff → patch — a genuine sequence.

---

## Block 1 — Code · "REACT: RERUN, THEN DIFF"

```jsx
function Article() {
  const [claps, setClaps] = useState(0);
  return <button onClick={() => setClaps(claps + 1)}>
    {claps} claps
  </button>;
}
```

- **Highlighted line:** `return <button onClick={() => setClaps(claps + 1)}>` — the setter call that starts the pipeline.
- **Boxed token:** `setClaps` — the state setter (never mutate in place).

## Block 2 — Execution Flow · "RERUN, DIFF, PATCH"

- **Stage 1 — Call the setter.** `setClaps(claps + 1)`. Note: "Never mutate in place — always call the setter."
- **Stage 2 — Rerun the whole component.** `Article()` `runs again`. Note: "The entire component function runs top-to-bottom, every hook with it."
- **Stage 3 — Build a new virtual DOM.** `new vDOM` `throwaway tree`. Note: "A lightweight tree of plain objects describing the page."
- **Stage 4 — Diff vs old → patch.** `diff (reconcile)` `minimal edits` → `real DOM`. Note: "Compare new vs old, apply only the differences."

## Block 3 — Summary

React holds state with **useState** and a setter; calling the setter **reruns the whole component**, producing a **new virtual DOM**. React then **diffs it against the previous tree** to find the minimal real edits, and applies only those. Coarse-grained: `rerun, then compare.`

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
