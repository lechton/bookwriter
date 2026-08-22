# 12 · From Tag To Element — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/12-dom-tree.png`.

- **Concept (shot #12):** From tag to element — how the browser builds the DOM tree.
- **Source:** digest §8, *The DOM: Tag, Element, And Tree*.
- **Why it earns a card:** the structure (a tree) is reframed into its *behavior* — the parse-and-build process the browser runs over time, tag → element → tree.

---

## Block 1 — Code · "FROM TAG TO ELEMENT"

```html
<article>
  <h1>Markets rally</h1>
  <button>Clap</button>
</article>

// text on disk — a description, inert by itself
```

- **Highlighted line:** `<button>Clap</button>` — the tag the flow follows from text to live object.
- **Boxed token:** `<button>` (the opening tag).

## Block 2 — Execution Flow · "PARSE & BUILD FLOW"

- **Stage 1 — Text in a file.** `tag = text` `<button>Clap</button>`. Note: "Markup — a description. By itself it does nothing."
- **Stage 2 — The browser parses it.** `parser` → `recognizes` `a button tag`. Note: "The browser reads the characters and recognizes the tag."
- **Stage 3 — It builds an element.** → `button element` `a live object`. Note: "A real object in memory, with properties and methods JS can touch."
- **Stage 4 — It inserts into the tree.** `document` ↳ `body` ↳ `article` ↳ `button`. Note: "One root; each node has exactly one parent — a tree."

## Block 3 — Summary

The browser reads your HTML text and **builds a tree of live objects, one per tag** — the DOM. A **tag is the source text; an element is the live object** the browser made from it. To change the page you **reach into this tree and edit the objects** — there is no other way.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
