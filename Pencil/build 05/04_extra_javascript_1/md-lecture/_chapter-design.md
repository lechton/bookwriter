# Chapter Design: How JavaScript Makes Reactivity Possible

## 1. Through-line
When I read a value, where does it come from — and what if reading it could run code?

## 2. Example Bible
**Setting**: The digital publishing system of *The National Times*.

**Entities**:
- **Article / piece** (Introduced in `01-prototype`): A class representing a news story. The specific instance is `piece`. It has an own property `headline`, a prototype method `publish()`, and a missing property `author`.
- **The claps counter** (Introduced in `02-closure`): We add a clap button to our article. To keep the view count safe from interference, we enclose it in a factory function `createClapButton()` that returns `clap()` and `total()` functions, capturing the `claps` variable in a private scope.
- **The session module** (Introduced in `03-module`): We need to know who is reading or clapping. We introduce a global `session.js` file with a private `currentUser` ("John" -> "Ada Lovelace"), shared across every part of the app that imports its `login()` and `current()` functions.
- **The byline getter** (Introduced in `04-getter`): We want to format the author's name automatically. We add an `author` property to our article, and a `byline` getter that secretly runs formatting code on every read.
- **The logging proxy** (Introduced in `05-proxy`): We need to audit all activity on our article. We wrap the article in a proxy to intercept every read and write (even for dynamically added properties like `claps`).
- **The signal** (Introduced in `06-observer`): We abstract our interceptor into a dedicated tracker. A signal for our article's state records the currently running computation on read, and re-runs it on write.
- **The reactive object** (Introduced in `07-reactive-object`): We wrap our article in a proxy where every single property is backed by its own signal.
- **The DOM text node `{count}`** (Introduced in `08-state-dom`): The final payoff. The article's clap count is displayed on the page; because it is a signal, changing it triggers an update exclusively to that specific text node.

## 3. Term Ledger
1. **own property** — a value stored directly on the object itself.
2. **prototype** — the hidden link from an object to its backup source of properties.
3. **closure** — a function bundled with the variables it captured from where it was defined.
4. **module** — a file whose top-level code runs once and whose exports are shared.
5. **getter** — a property that runs a function on every read instead of returning a stored value.
6. **interception** — making an ordinary read or write secretly run code.
7. **proxy** — an object that wraps a target and intercepts its operations through traps.
8. **signal** — a reactive value bundled with the set of computations that depend on it.
9. **track** — on a read, recording the currently running computation as a dependent.
10. **trigger** — on a write, re-running every recorded dependent.

## 4. Order and Per-Part Hooks
- **00-intro** — Hook: today a read *finds* a value; soon a read will *run* a function.
- **01-prototype** — Hook: today a read *finds* a value; soon a read will *run* a function.
- **02-closure** — Hook: private state is powerful, but it is trapped inside one function — what if many files need the same value?
- **03-module** — Hook: the value is shared now, but reads and writes are still plain — what if a *read itself* could run code?
- **04-getter** — Hook: a getter guards one property you named in advance — what catches a property you didn't name?
- **05-proxy** — Hook: now we can run code on every read and write — what is the most useful thing to run there?
- **06-observer** — Hook: a value that records its readers and re-runs them — that is a reactive value; let's package it.
- **07-reactive-object** — Hook: this is, almost exactly, what a framework gives you — and what Svelte calls a rune.
- **08-state-dom** — Hook: no magic left — every piece was plain JavaScript.
- **99-outro**
