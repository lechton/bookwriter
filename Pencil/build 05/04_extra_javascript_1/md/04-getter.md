# 4 | Getter: A Getter Runs a Function Every Time You Read It

## Project

```
js_review/
└─ examples/
   └─ byline.js   ◀ this file
```

## An object with a data property and a getter

```js title="js_review/examples/byline.js"
const article = {
  author: "Ada Lovelace",              // the stored **author** (plain data)
  get byline() {                       // a **getter** — runs on every read
    return "By " + this.author;        // builds a **fresh** value
  }
};
console.log(article.byline);           // prints **"By Ada Lovelace"**
article.author = "Grace Hopper";       // **changes** the author
console.log(article.byline);           // prints **"By Grace Hopper"**
```

### Code Comments

**2** | `author` is a normal **data property** — reading it just hands back the stored string, no code runs.

**3** | The `get` keyword makes `byline` an **accessor**: a property that is secretly a function, run on **every read**.

**4** | The function joins `"By "` with the current `this.author` and returns a **fresh value** — never stored.

**7** | Reading `article.byline` (no parentheses) runs the getter → prints **"By Ada Lovelace"**.

**8** | `author` is changed to `"Grace Hopper"`.

**9** | Reading `byline` again **recomputes** from the new author → prints **"By Grace Hopper"**.

## Summary

A getter is a property defined with the `get` keyword. Reading it **runs a function** instead of returning a stored value — and you read it with **no parentheses**, exactly like a plain property. Because it recomputes **every time**, it can never go stale: change `author`, and the next read of `byline` reflects it. This is the first crack in the passive read — a plain-looking access that secretly runs your code.

## Explanation

`article.author` is a data property: reading it hands back the stored string, and nothing runs. `article.byline` looks identical at the call site, but it is a getter — reading it runs `get byline()` and returns a fresh value, rebuilt from the current `author` each time.

```
   article.author   ──▶  stored string         →  "Ada Lovelace"   (no code runs)

   article.byline   ──▶  runs get byline()      →  "By " + this.author
                                                    recomputed on every read
```

- ✅ `article.byline` → runs `get byline()` → `"By Ada Lovelace"`
- ✅ change `author`, read `byline` again → recomputes → `"By Grace Hopper"`
- ✅ `article.author` → a plain data property → returns the stored string, no code runs

**Glossary**
- **data property** — stores a value; reading it returns that value as-is
- **getter (accessor)** — defined with `get`; reading it runs a function and returns the result
- **interception** — making an ordinary-looking read secretly run code

**Takeaway:** `byline` looks like data but runs code on **every read**. Because a read can run code, a read can do work — the first step toward a value that notices when it is read.
