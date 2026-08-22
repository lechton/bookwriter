# Prototype: Own Properties First, Then Inherited from the Prototype

## Project

```
js_review/
└─ examples/
   └─ Article.js
```

## A class, an instance, and three reads

```js title="js_review/examples/Article.js"
class Article {
  publish() { return "published"; }
}
const piece = new Article();
piece.headline = "Markets rally";
console.log(piece.headline);
console.log(piece.publish());
console.log(piece.author);
```

### Code Comments

**2** | Defining `publish()` in the class body puts it on `Article.prototype` — **one shared copy**, not on each object.

**4** | Creates `piece`, a new Article. It starts with **no own properties**, but carries a hidden link to `Article.prototype`.

**5** | Adds `headline` directly onto `piece` — a brand-new **own property**, stored on the object itself.

**6** | Reading `headline` finds it on `piece` itself → prints `Markets rally` (its **own property**).

**7** | `piece` has no own `publish`, so the lookup walks up to `Article.prototype` → prints `published` (**inherited**).

**8** | `author` is nowhere on `piece` or up the chain → prints `undefined`.

## Summary

Every object keeps a hidden link to a prototype, and a property lookup checks the object itself first. A value stored directly on the object — an **own property** — is returned at once. When it is missing, the search **walks up the prototype chain** and uses the first copy it finds, so that property is **inherited** rather than duplicated onto every object. The chain ends at **null**, and a name found nowhere along it reads back as undefined.

## Explanation

JavaScript looks on the object itself first; an own property is found there at once. If it isn't there, the lookup follows the object's link to its prototype and inherits the property from there, continuing up the chain until it is found or the chain ends at `null` — which gives `undefined`.

```
  piece  ──▶  Article.prototype  ──▶  Object.prototype  ──▶  null
    │                │                      │                 │
  own            publish()             (built-in            end of chain
  property       inherited              methods)            → undefined
  "Markets       from here
   rally"
```

- ✅ `piece.headline` → own property, on `piece` → prints `"Markets rally"`
- ✅ `piece.publish()` → not on `piece`, inherited from `Article.prototype` → prints `"published"`
- ❌ `piece.author` → on nothing up the chain → `undefined`

**Glossary**
- **own property** — a value stored directly on the object itself
- **inherited** — used from the prototype because the object has no own copy
- **[[Prototype]]** — the hidden link from an object to its prototype

**Takeaway:** We never added `publish` to `piece` — it is **inherited** from `Article.prototype`, the shared object every Article instance is linked to.
