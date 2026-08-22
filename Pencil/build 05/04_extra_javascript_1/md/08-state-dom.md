# 8 | State to DOM: Changing $state Updates Only the Nodes That Read It

## Project

```
src/
└─ routes/
   └─ +page.svelte   ◀ this file
```

## A counter, in real Svelte

```svelte title="src/routes/+page.svelte"
<script>
  let claps = $state(0);
</script>

<button onclick={() => claps++}>
  {claps} claps
</button>
```

### Code Comments

**2** | `$state(0)` makes `claps` a **reactive** value — the `$state` rune is the reactive object we just built, supplied by Svelte's compiler.

**5** | `onclick={() => claps++}` **writes** `claps` on each click — the trigger half.

**6** | `{claps}` **reads** `claps` in the markup — that one text node becomes the **effect** that depends on it.

## Summary

`$state(0)` is the reactive value from the last step, handed to you as a **rune**. Reading `claps` inside the markup subscribes that exact DOM node — it becomes an effect. Writing `claps++` triggers, and Svelte re-runs only the nodes that read it. The button's text updates; nothing else on the page does. Reactivity, all the way down to a single text node.

## Explanation

Map it to the engine. `$state(0)` is `reactive()`. The `{claps}` in the markup is an `effect` whose read subscribes that text node. `claps++` is the write that triggers. So the dependent — and only the dependent — re-runs. Unlike React, where changing state re-runs the whole component function and a virtual-DOM diff decides what changed, Svelte tracks the dependency at the node and re-runs just that node.

```
   $state(0)        ──▶  reactive value (a signal)
   {claps}          ──reads──▶  this text node is the effect
   claps++          ──writes──▶  triggers  ──▶  only that node re-renders
```

- ✅ `{claps}` reads `claps` → that text node subscribes
- ✅ click → `claps++` → triggers → the text node updates to the new count
- ❌ the rest of the page does not re-render — only the node that read `claps`

**Glossary**
- **$state** — Svelte's rune for a reactive value; the reactive object from the previous step
- **rune** — a compiler symbol like `$state` that marks reactive code
- **fine-grained update** — only the DOM nodes that read a value re-run, never the whole component

**Takeaway:** `$state` **is** the engine we built by hand. The text node that read `claps` is the effect; changing `claps` re-runs only that node. No magic was left — every piece was plain JavaScript.
