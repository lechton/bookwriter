# Getter: A Getter Runs a Function Every Time You Read It

## Project

```
js_review/
└─ examples/
   └─ byline.js   ◀ this file
```

## An object with a data property and a getter

```js title="js_review/examples/byline.js"
const article = {
  author: "Ada Lovelace",
  get byline() {
    return "By " + this.author;
  }
};
console.log(article.byline);
article.author = "Grace Hopper";
console.log(article.byline);
```

### Code Comments

**2** | `author` is a normal **data property** — reading it just returns the stored string, **no code runs**.

**3** | The `get` keyword makes `byline` an **accessor**: a property that is secretly a function, run on **every read**.

**4** | The function joins `"By "` with the current `this.author` and returns a **fresh value** — never stored.

**7** | Reading `article.byline` (no parentheses) runs the getter → prints `By Ada Lovelace`.

**8** | Now `author` changes to `"Grace Hopper"`.

**9** | Reading `byline` again **recomputes** from the new author → prints `By Grace Hopper`; it can never go stale.

## Summary

A getter is a property defined with the `get` keyword; reading it **runs a function** instead of returning a stored value — with **no parentheses** at the call site. Its value is **recomputed every time**, so it can **never go stale**: change `author` and the next read of `byline` reflects it. This is the first step of **interception** — a plain-looking read that secretly runs code.

## Explanation

`article.author` is a data property: reading it just hands back the stored string. `article.byline` looks the same at the call site but is a getter — reading it runs `get byline()` and returns a fresh value, recomputed from the current `author` every time.

```
   article.author  ──▶  stored string          →  "Ada Lovelace"   (no code runs)

   article.byline  ──▶  runs get byline()       →  "By " + this.author
                                                    recomputed on every read
```

- ✅ `article.byline` → runs `get byline()` → fresh `"By Ada Lovelace"`
- ✅ change `author`, read `byline` again → recomputes → `"By Grace Hopper"` (never stale)
- ✅ `article.author` → a plain data property → returns the stored string, no code runs

**Glossary**
- **data property** — stores a value; reading it returns that value as-is
- **getter (accessor)** — defined with `get`; reading it runs a function and returns the result
- **interception** — making an ordinary read secretly run code

**Takeaway:** `byline` looks like data but runs code on **every read** — that is a **getter**. Because a read can run code, a read can be made to do bookkeeping: the first rung of **interception** that reactivity is built on.
