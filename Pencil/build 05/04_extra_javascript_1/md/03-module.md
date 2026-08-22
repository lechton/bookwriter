# 3 | Module: A Module's State Is Created Once and Shared by Every Importer

## Project

```
js_review/
└─ examples/
   ├─ session.js   ◀ holds the shared state
   └─ app.js       ◀ imports and uses it
```

## A module — a private value behind two functions

```js title="js_review/examples/session.js"
let currentUser = "John";              // **private** module state

export function login(name) {          // **writes** currentUser
  currentUser = name;
}

export function current() {            // **reads** currentUser
  return currentUser;
}
```

```js title="js_review/examples/app.js"
import { login, current } from "./session.js";

console.log(current());                // prints **"John"** (initial)
login("Ada Lovelace");                 // **changes** the shared value
console.log(current());                // prints **"Ada Lovelace"** (after login)
```

### Code Comments

**1** | `currentUser` is a module-level variable, created **once** the first time `session.js` is imported. It is never exported, so it is **private** — no other file can name it.

**3** | `login()` is exported; it writes the private `currentUser`. Exporting the **function, not the variable**, is the only way in.

**7** | `current()` is exported; it reads `currentUser` back — the only way an importer can see it.

**1** *(app.js)* | Imports the two functions. This first import runs `session.js` **once** and hands back its single shared instance.

**3** *(app.js)* | `current()` returns the initial value → prints **"John"**.

**4** *(app.js)* | `login()` changes the one private `currentUser`.

**5** *(app.js)* | `current()` now returns **"Ada Lovelace"** — the **same shared value**, changed once and seen everywhere.

## Summary

A module's top-level code runs **once**, the first time anything imports it, so `currentUser` becomes a **shared singleton** — every file that imports `session.js` talks to the same value, never a copy. It stays **private** because it is never exported; other files read or change it **only through** the exported `login` and `current`. Run `node app.js` and it prints `John`, then `Ada Lovelace`.

## Explanation

`session.js` is a closure at file scale. Its `currentUser` is created the first time the module is imported and lives for the program's lifetime, and the exported functions are the only doorway to it — so the module acts as one shared store, a **singleton**. Import the functions anywhere and you reach the **same** `currentUser`.

```
  session.js  →  let currentUser = "John"   (created ONCE)
       │                  ▲        ▲
       │ import        login()   current()   (the only ways in and out)
       ▼
  app.js  →  reaches the SAME currentUser
```

- ✅ `current()` before login → reads the shared value → prints `"John"`
- ✅ `login("Ada Lovelace")`, then `current()` → prints `"Ada Lovelace"`
- ❌ `import { currentUser }` → impossible — the variable is never exported

**Glossary**
- **module** — a file whose top-level code runs once and whose `export`s are its public surface
- **private (module)** — a variable not exported, reachable only through the module's functions
- **singleton** — one shared instance every importer reaches, never a per-import copy

**Takeaway:** `app.js` never holds `currentUser` — it reaches the **one** copy inside `session.js`, created once and shared, exactly like a closure stretched over a whole file.
