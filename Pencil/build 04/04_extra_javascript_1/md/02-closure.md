# Closure: A Closure Keeps a Function's Variables Alive and Private

## Project

```
js_review/
└─ examples/
   └─ clapButton.js
```

## A factory that returns two functions

```js title="js_review/examples/clapButton.js"
function createClapButton() {
  let claps = 0;
  return {
    clap() { claps++; },
    total() { return claps; }
  };
}
const article = createClapButton();
article.clap();
article.clap();
console.log(article.total());
```

### Code Comments

**1** | A factory function. Each time it runs, everything inside its braces is a **fresh, private scope**.

**2** | `claps` is a local variable, **private to this scope** — no code outside can name it directly.

**4** | `clap()` is defined inside the scope; calling it bumps the private `claps` up by one. It **captures** `claps`.

**5** | `total()` is defined inside too; it reads the private `claps` back. Both functions **close over** `claps`.

**7** | The function returns here and its call is finished. Normally `claps` would be discarded now — **but it is not**.

**8** | `article` holds the two returned functions. Because they still reference `claps`, that scope is **kept alive**.

**9** | First `clap()` — raises the very same private `claps` from 0 to 1.

**10** | Second `clap()` — the **same** `claps` goes from 1 to 2; the private value **persists between calls**.

**11** | `total()` reads that same `claps` back → prints `2`. The **only way** to touch `claps` is through `clap()` and `total()`.

## Summary

When a function finishes, its local variables are normally discarded. But a function defined inside it and then returned keeps a live reference to those variables, so they stay **alive** — a function bundled with the variables it **captured** is called a **closure**. Here `claps` is **private state with no class needed**: it survives only because `clap()` and `total()` keep its scope alive, and those functions are the only way to reach it.

## Explanation

When a function returns, the variables it defined would normally be discarded. But the two functions it returns were defined inside that scope and still reference `claps`, so the scope is kept alive for as long as they exist — and `claps` can be reached only through them.

```
   clap()   ─┐
             ├─ capture ─▶  ┌── private scope ─────┐
   total()  ─┘              │   claps = 2  (alive)  │
                            └───────────────────────┘
                                       ▲
                     outside code  ──╳──┘   no direct access
```

- ✅ `article.clap()` → raises the captured `claps` → 1, then 2
- ✅ `article.total()` → reads the captured `claps` → prints `2`
- ❌ `claps` from outside → unreachable — only `clap()` and `total()` can touch it

**Glossary**
- **scope** — the set of variables created when a function runs
- **closure** — a function plus the variables it captured from where it was defined
- **private** — reachable only through the returned functions, never from outside

**Takeaway:** `claps` is **private** state with no class needed — it survives only because `clap()` and `total()` keep its scope alive, and they are the only way to reach it.
