# Module Closure: A Module's State Is Created Once and Shared by Every Importer

## Project

```
js_review/
└─ examples/
   ├─ session.js   ◀ the module: one private value + its public API
   └─ app.js       ◀ imports session.js and runs it
```

## The module — a private value behind two functions

```js title="js_review/examples/session.js"
let currentUser = "John";

export function login(name) {
  currentUser = name;
}

export function current() {
  return currentUser;
}
```

### Code Comments

**1** | `currentUser` is a module-level variable, created **once** the first time `session.js` is imported. It is **private** — never exported — so no other file can name it directly.

**3** | `login()` is exported. It writes the private `currentUser`. Exporting the **function, not the variable**, is the only way in.

**7** | `current()` is exported; it reads the private `currentUser` back — the only way an importer can see it.

## Another file imports and shares it

```js title="js_review/examples/app.js"
import { login, current } from "./session.js";

console.log(current());
login("Ada Lovelace");
console.log(current());
```

### Code Comments

**1** | Imports the two functions. This first import runs `session.js` once and hands back its **single shared instance**.

**3** | `current()` returns the initial value → prints `John`.

**4** | `login()` changes the one private `currentUser`.

**5** | `current()` now returns `Ada Lovelace` — the **same shared value**, changed once and seen everywhere.

## Summary

A module's top-level code is evaluated **only once**, the first time it is imported, so `currentUser` becomes a **shared singleton** — every file that imports `session.js` talks to the same value. It stays **private** because it is never exported; other files read or change it **only through the exported functions**. Run `node app.js` and it prints `John`, then `Ada Lovelace`: one value, changed once, shared across the import.

## Explanation

`session.js` ran its top-level code once, the variable lives on between calls, and the exported functions are the only doorway to it — so the module acts as one shared store, a **singleton**. Import the functions anywhere and you reach the same `currentUser`.

```
   app.js                                  session.js   (top-level runs once)
     │   import { login, current }         ┌────────────────────────────┐
     ├── login("Ada Lovelace") ───────────▶│  currentUser   (private)   │
     │                                      │   "John" → "Ada Lovelace"  │
     └── current() ◀───────────────────────│                            │
                                            └────────────────────────────┘
                                              one shared instance
```

- ✅ `app.js` → `login("Ada Lovelace")` → sets the one shared `currentUser`
- ✅ `app.js` → `current()` → reads that same value → `"John"`, then `"Ada Lovelace"`
- ✅ any other file that imports `session.js` → gets the **same** `currentUser`
- ❌ `import { currentUser }` → impossible — it is never exported

**Glossary**
- **module** — a file whose top-level code runs once and whose exports are shared
- **private (module)** — a variable not exported, reachable only through the module's functions
- **singleton** — one shared instance everyone gets, not a fresh copy per import

**Takeaway:** Import the functions and every file shares one `currentUser` — change it in one place and everyone sees it. Run it: `node app.js` prints `John` then `Ada Lovelace`.
