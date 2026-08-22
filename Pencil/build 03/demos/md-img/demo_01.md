# Demo 01 — Passing a Variable From Parent to Child with Props

The point: in Svelte 5 a parent component hands a value to a child by setting an attribute (a prop) on the child's tag, and the child reads it with the `$props()` rune. This demo shows the mechanism across TWO real components — a parent that owns a value and a child that displays it — so the one-way flow from parent to child is visible across two files. The figure is two code snippets, each with its own short line-by-line, a connector showing the value crossing from one to the other, and a single closing summary. No separate Explanation block.

Title (top, left): "Passing a Variable From Parent to Child with Props".

## Snippet 1 — Parent · Article.svelte
Role label above the editor: "Parent — passes it down". The parent owns the data and renders the child, handing the value over as a prop.

```svelte
<script>
  import Byline from './Byline.svelte';
  let author = $state("Ada Lovelace");
</script>
<Byline name={author} />
```

Line by line (keyed to the gutter; skip the `<script>`/`</script>` lines):
- 2 — Imports the child component, `Byline`, so the parent can render it.
- 3 — `author` is the parent's own reactive state — the value we want to hand to the child.
- 5 — Renders the child and passes `author` down through a prop called `name`: `name={author}`.

## Connector (between the two snippets)
A single centered line showing the value crossing the boundary: the parent's `name={author}` is the same value the child reads via `$props()`. Drawn as a teal mono pill, an arrow, and the receiving `$props()` pill.

## Snippet 2 — Child · Byline.svelte
Role label above the editor: "Child — receives it". The child declares which props it accepts and uses the value like a local variable.

```svelte
<script>
  let { name } = $props();
</script>
<p>By {name}</p>
```

Line by line (skip the `<script>`/`</script>` lines):
- 2 — `$props()` returns everything passed in; destructuring pulls out `name` — the value the parent sent.
- 4 — The child uses `name` like any local variable; `{name}` renders "By Ada Lovelace".

## Summary
One Tech-Callout-Note card. Text: "In Svelte, a parent hands data to a child through props: the parent writes an attribute on the child tag — name={author} — and the child reads it by destructuring $props(). The value flows one way, parent to child, and because that value is reactive, changing it in the parent re-renders the child automatically. Props are how components compose — small, self-contained pieces wired together by the data passed between them."

Highlight (golden marks) the load-bearing phrases: "props", "name={author}", "$props()", and "one way, parent to child".
