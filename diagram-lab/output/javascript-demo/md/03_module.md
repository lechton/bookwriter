## 3 — Module: state created once, shared by every importer
@tags Imports, Scope, Singleton

**Q. Two files both import { current } from session.js. Do they each get their own currentUser?**

**Answer.** No. A module's top-level code runs exactly once, the first time anything imports it. So `currentUser` is created once, and every file that imports `session.js` reaches that single shared value, never a private copy.

**Why it works.** The variable is never exported, so it is private to the module; the only way in or out is through the exported `login` and `current` functions. That makes the module a closure stretched over a whole file. One shared instance, touched only through its public functions, lives for the whole program. The pattern has a name: a singleton.

```js title="examples/session.js"
let currentUser = "John";              // private module state

export function login(name) {           // writes currentUser
  currentUser = name;
}

export function current() {             // reads currentUser
  return currentUser;
}
```

```js title="examples/app.js"
import { login, current } from "./session.js";

console.log(current());                 // "John" (the initial value)
login("Ada Lovelace");                  // changes the shared value
console.log(current());                 // "Ada Lovelace" (seen everywhere)
```

<div class="dg" style="padding:32px 16px 20px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">One Shared Store</span>
<div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
<div style="border:3px solid #000; background:#fef08a; padding:10px 20px; font-family:var(--mono); font-weight:800; font-size:11pt; box-shadow:4px 4px 0 0 #000; text-align:center;">
session.js<br/><span style="font-family:var(--sans); font-size:8pt; font-weight:600; color:#4b5563;">created ONCE</span>
</div>
<div style="border:3px dashed #000; padding:8px 14px; font-family:var(--mono); font-weight:800; font-size:10pt; background:#fff; text-align:center;">let currentUser = "John"</div>
<div style="display:flex; gap:8px; width:100%; justify-content:center;">
<div style="border:2px solid #000; background:#bbf7d0; padding:6px 10px; font-family:var(--mono); font-weight:800; font-size:9pt; box-shadow:3px 3px 0 0 #000;">login()</div>
<div style="border:2px solid #000; background:#bfdbfe; padding:6px 10px; font-family:var(--mono); font-weight:800; font-size:9pt; box-shadow:3px 3px 0 0 #000;">current()</div>
</div>
<div style="font-size:7pt; font-weight:800; text-transform:uppercase; background:#000; color:#fff; padding:2px 8px;">the only doors</div>
<div style="font-size:18pt; font-weight:900; line-height:1;">↓ import</div>
<div style="border:3px solid #000; background:#f3f4f6; padding:8px 16px; font-family:var(--mono); font-weight:800; font-size:10pt; text-align:center;">app.js reaches the SAME value</div>
</div>
</div>

> **Summary.** A module runs once, so any top-level variable becomes a shared singleton, reached only through the functions it exports. The value is shared now, but reads and writes are still plain — what if a *read* itself could run code?
