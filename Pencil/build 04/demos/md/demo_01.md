# Props: Passing a Variable From Parent to Child with Props

## Project

```
src/
└─ lib/
   └─ components/
      ├─ Article.svelte   ◀ parent
      └─ Byline.svelte    ◀ child
```

## Parent — passes it down

```svelte title="src/lib/components/Article.svelte"
<script>
  import Byline from './Byline.svelte';
  let author = $state("Ada Lovelace");
</script>
<Byline name={author} />
```

### Code Comments

**2** | Imports the child component, `Byline`, so the parent can render it.

**3** | `author` is the parent's own **reactive state** — the value we want to hand to the child.

**5** | Renders the child and **passes `author` down** through a prop called `name` — `name={author}`.

## Child — receives it

```svelte title="src/lib/components/Byline.svelte"
<script>
  let { name } = $props();
</script>
<p>By {name}</p>
```

### Code Comments

**2** | `$props()` returns everything passed in; destructuring pulls out `name` — **the value the parent sent**.

**4** | The child uses `name` like any local variable; `{name}` renders `By Ada Lovelace`.

## Summary

In Svelte a parent hands data to a child through **props**: the parent writes an attribute on the child tag — **name={author}** — and the child reads it by destructuring **$props()**. The value flows **one way, parent to child**, and because that value is reactive, changing it in the parent re-renders the child automatically.

## Explanation

A prop is just an attribute on the child's tag. The parent's value crosses the component boundary and arrives in the child's `$props()`; the child names it and uses it like any local variable.

```
  Article.svelte (parent)                Byline.svelte (child)
   author = "Ada Lovelace"
        │
        └─ name={author} ──▶ prop ──▶ let { name } = $props()
                                              │
                                              ▼
                                       <p>By {name}</p>  →  "By Ada Lovelace"
```

- ✅ parent `name={author}` → child `$props()` → `name` is `"Ada Lovelace"`
- ✅ change `author` in the parent → the child re-renders (props are reactive)
- ❌ the child reassigning `name` does NOT change the parent's `author` — props flow one way, down

**Glossary**
- **prop** — a value a parent passes to a child via an attribute on the child's tag
- **$props()** — the rune a child calls to receive everything passed to it
- **one-way flow** — data moves parent → child; the child does not write back

**Takeaway:** Props are how components compose — the parent owns the data, the child receives it through `$props()`, and the flow is one way: parent to child.
