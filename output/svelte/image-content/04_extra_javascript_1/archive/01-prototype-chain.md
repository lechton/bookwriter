# 01 · The Prototype Chain — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/01-prototype-chain.png`.

- **Concept (shot #1):** Property lookup walks the prototype chain.
- **Source:** digest §1, *Objects, And The Several Roads To One*; the `Article` class from the state chapter.
- **Why it earns a card:** a property read is a real runtime *walk* with numbered steps — not a static definition.

---

## Block 1 — Code · "THE PROTOTYPE CHAIN"

```js
class Article {
  publish() { return "live"; }  // lives once on the prototype
}

const piece = new Article();
piece.headline = "Markets rally";

piece.headline;   // own       → "Markets rally"
piece.publish();  // prototype → "live"
piece.author;     // nowhere   → undefined
```

- **Highlighted line:** `publish() { return "live"; }` — the method lives once on the prototype, not on each instance.
- **Boxed token:** `publish` on the `piece.publish()` line — the one read the flow traces.

## Block 2 — Execution Flow · "PROPERTY LOOKUP FLOW"

- **Stage 1 — Check the object itself.** `piece (own slots)` holds `headline: "..."` · ✗ no `publish` here.
- **Stage 2 — Follow the hidden link.** `piece` —[`__proto__`]→ `Article.prototype` (has `publish()`). Note: "Hop up the object's prototype link."
- **Stage 3 — Found on the prototype.** ✓ `Article.prototype` → `publish()` → `"live"`. Note: "One shared copy, used by every instance."
- **Stage 4 — A miss runs to the end.** `piece` ↓ `Article.prototype` ↓ `Object.prototype` ↓ `null → undefined`. Note: "piece.author is nowhere on the chain."

## Block 3 — Summary

When you read a property, JavaScript **looks on the object itself first**. If the slot isn't there, it **follows the object's hidden link to its prototype** and keeps walking up the chain — **until it finds the property, or hits `null` and returns `undefined`**. Methods from a `class` don't sit on each instance; they **live once on the shared prototype**, so every instance falls back to the same copy.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
