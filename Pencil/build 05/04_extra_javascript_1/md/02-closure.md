# 2 | Closure: A Function Keeps Its Variables Alive and Private

## Project

```
js_review/
└─ examples/
   └─ clapButton.js   ◀ this file
```

## A factory that hands back two methods

```js title="js_review/examples/clapButton.js"
function createClapButton() {
  let claps = 0;                       // **private** state, starts at 0
  return {
    clap() { claps++; },               // **increments** the captured claps
    total() { return claps; }          // **reads** the captured claps
  };
}
const article = createClapButton();    // the scope stays **alive**
article.clap();                        // claps → **1**
article.clap();                        // claps → **2**
console.log(article.total());          // prints **2** (the private claps)
```

### Code Comments

**2** | `claps` is declared inside the function — a local variable, **private**, reachable from nowhere outside.

**4** | `clap()` closes over `claps` and bumps it; the variable **survives** after `createClapButton` returns.

**5** | `total()` closes over the **same** `claps` — both methods share one hidden variable.

**8** | Calling the factory runs it once and returns the two methods; its scope stays **alive** because they still reference `claps`.

**9** | `article.clap()` raises the captured `claps` to **1**.

**10** | A second `clap()` raises it to **2**.

**11** | `total()` reads the captured `claps` → prints **2**.

## Summary

A function's local variables normally vanish when it returns. But if the function hands back something that still **references** those variables — here, two methods — the variables stay **alive**. That bundle of a function plus the variables it captured is a **closure**. The captured `claps` is **private**: nothing outside can read or write it except through `clap` and `total`, and both methods see the **same** `claps`.

## Explanation

`createClapButton` runs once and returns two methods. Both close over the one `claps` declared inside, so that variable outlives the call and stays reachable — but only through them. State that is alive and private at the same time.

```
  article = createClapButton()
       │
       ├─ clap()  ──┐
       │            ├──▶  [ claps ]   one variable: private, shared, alive
       └─ total() ──┘
```

- ✅ `article.clap()` then `article.total()` → reads the captured `claps` → prints `2`
- ✅ a second `createClapButton()` → a **separate** `claps`, its own private count
- ❌ there is no `article.claps` — the variable is sealed inside the closure

**Glossary**
- **closure** — a function bundled with the variables it captured from its birthplace
- **captured variable** — an outer variable a closure keeps alive by referencing it
- **private state** — data reachable only through the closure's own functions

**Takeaway:** We never exposed `claps`. It lives on **only** because `clap` and `total` still hold it — alive, shared between them, and private to everyone else.
