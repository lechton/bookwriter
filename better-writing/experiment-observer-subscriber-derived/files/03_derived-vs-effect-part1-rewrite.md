# Derived vs Effect — Part One: The Architecture

## One Word Needs to Move

Both a derived and an effect subscribe. That much of your original sentence is correct and stays exactly as you put it: each one ends up sitting inside some signal's subscriber list, each gets called when that signal is written, each re-tracks its dependencies on every run. Architecturally they enter the machine through the same door.

The word to repair is what happens *after* they get called.

- A **watch** (our `watchEffect`, Svelte's `$effect`, Vue's `watchEffect`) gets called and **runs your code**.
- A **derived** (Svelte's `$derived`, Vue's `computed`, Solid's `createMemo`) gets called and **writes a note**. The code does not run. It runs later, only if somebody asks for the value.

By the end of this you will be able to say which line of `watchEffect` a derived replaces, and which two extra fields it carries that an effect does not have. That is the whole architectural difference, and it turns out to be small.

In this text, **effect**, **watch**, and `watchEffect` all name one thing: a function that re-runs itself automatically whenever any signal it read has changed.

---

## The Machine We Already Have

Everything below is a modification of the same thirty lines. Here they are again, with each moving part named.

```js
let effectStack = [];                       // who is running right now (top = current)

function makeSignal(startingValue) {
  let value = startingValue;
  let subscribers = new Set();              // this signal's own private list

  function read() {
    const current = effectStack[effectStack.length - 1];
    if (current) {
      subscribers.add(current);             // the signal remembers the reader
      current.mySignalLists.add(subscribers); // the reader remembers the list
    }
    return value;
  }

  function write(newValue) {
    value = newValue;
    for (const fn of [...subscribers]) fn();  // call everyone, unconditionally
  }

  return { read, write };
}

function forget(run) {                       // drop out of every list I am in
  for (const list of run.mySignalLists) list.delete(run);
  run.mySignalLists.clear();
}

function watchEffect(fn) {
  function run() {
    forget(run);                             // wipe old dependencies
    effectStack.push(run);                   // raise the flag (I am running)
    fn();                                    // re-learn dependencies from this run
    effectStack.pop();                       // lower it, revealing whoever was underneath
  }
  run.mySignalLists = new Set();
  run();
  return () => forget(run);                  // the stop function
}
```

Four rules carry everything that follows:

1. **`read()` only records.** It never runs anything. It adds whoever is on top of the stack into this signal's `subscribers`.
2. **`write()` only runs.** It never records. It calls everyone already in `subscribers`, no filtering, no questions.
3. **Reading is the only moment a dependency is discoverable**, because reading is the only place in the code where a function and a value are visible together.
4. **The stack decides who gets credit for a read.** Whoever is on top when `read()` fires is the one who gets subscribed.

Rule 2 is the one that matters most here: if `write()` calls everyone in the list with no idea what those functions do, then whatever we choose to put in the list is the only lever that exists. Everything a derived is comes from that single choice.

---

## Building a Derived With What We Have

A real, boring piece of a shopping cart. One line item. This is the example for the rest of the piece.

```js
const price = makeSignal(10);
const quantity = makeSignal(2);
// we want: total, which is always price × quantity
```

One tool exists so far for "react to change": `watchEffect`. The direct attempt is to use it, and stash the answer in a signal so other code can read it reactively:

```js
function makeDerivedNaive(fn) {
  const cache = makeSignal(undefined);
  watchEffect(() => cache.write(fn()));    // recompute, store
  return { read: cache.read };
}
```

`cache` is an ordinary signal holding the last computed answer. The effect runs `fn()`, gets a number, and writes it into `cache`. Because the effect read `price` and `quantity` while the stack flag was up, both signals now hold this effect in their subscriber lists. A write to either one re-runs it, which recomputes and re-writes `cache`. Anyone reading `cache.read()` inside their own effect subscribes to `cache` in turn, so the notification chains downward.

Add a counter to the computation so the cost becomes visible:

```js
let runs = 0;
const total = makeDerivedNaive(() => {
  runs++;
  console.log("  computing total...");
  return price.read() * quantity.read();
});

console.log("computations so far:", runs);
price.write(11);
price.write(12);
price.write(13);
console.log("computations after 3 writes, nobody ever read total:", runs);
console.log("total.read() ->", total.read(), "| computations:", runs);
```

Tested, prints:

```
  computing total...
computations so far: 1
  computing total...
  computing total...
  computing total...
computations after 3 writes, nobody ever read total: 4
total.read() -> 26 | computations: 4
```

Four computations. Nobody ever asked for the total; `total.read()` appears for the first time on the last line, and the work has already been paid for four times over. Multiply by a real app: a derived that sorts ten thousand rows in a panel nobody has opened, a derived that formats a currency string for a row scrolled out of view. Every keystroke upstream pays for all of them, whether or not a single pixel on screen depends on the result — and rule 2 makes this unavoidable in the naive shape. We put the computation itself into `price`'s subscriber list, and `write()` calls everyone in the list.

That forces a certainty: whatever a real derived is, it cannot be an effect that writes a signal. The expensive body must not be the thing sitting in the upstream subscriber list. Something else has to be sitting there instead.

---

## The Out-of-Date Sticky Note

An accounts office keeps a folder for each customer with a computed total on the front sheet. When a price changes upstream, the clerk does not redo the arithmetic — arithmetic is expensive and most folders are never requested. The clerk slaps a sticky note on the folder: **OUT OF DATE**. Two seconds, no arithmetic.

Later, someone at the counter asks for that customer's total. The folder is opened. If there is a note on it, the arithmetic is redone, the front sheet is updated, and the note is removed. If there is no note, the front sheet is already correct and is handed over as-is — no arithmetic, however many people ask.

The mapping, actor by actor:

| In the office | In the code |
|---|---|
| The folder | the derived object |
| The number on the front sheet | the cached `value` |
| The sticky note | the `dirty` boolean |
| Slapping the note on | `markDirty()` — the small function we put in the upstream list |
| Someone asking at the counter | `read()` |
| Redoing the arithmetic | calling `fn()`, the derived's body |
| Removing the note | `dirty = false` |

These are the words the frameworks actually use — the ones you'll reach for on the job:

- **Dirty flag.** *Technical:* a boolean on a cached node meaning "my stored value can no longer be trusted." *Plain:* a yes/no marker that says "this number is stale, redo it before you use it."
- **Invalidation.** *Technical:* setting that flag on a node and propagating the same act to everything downstream, without recomputing anything. *Plain:* telling everyone downstream "your number is stale too," and nothing more than telling.
- **Lazy, or pull-based.** *Technical:* the computation is deferred until a consumer requests the value. *Plain:* nothing gets calculated until someone actually asks.
- **Eager, or push-based.** *Technical:* the computation is triggered by the change itself, independent of any consumer. *Plain:* the moment the input changes, the work happens, asked for or not.
- **Memoized.** *Technical:* a function that stores its last result and returns the stored copy on subsequent calls with unchanged inputs. *Plain:* it remembers the answer so it doesn't work it out twice.

The name for the whole shape, from the TC39 signals proposal, is **push-then-pull**: the notification travels eagerly through the whole graph, while the computation waits, lazily, for someone to read. Two different things travelling at two different speeds. An effect has only one speed, because an effect has nothing to cache.

---

## Where the Value Lives

An effect stores nothing. There is no `value` variable anywhere in `watchEffect`. It runs `fn()`, throws away whatever `fn()` returned, and that is the end of it. An effect is a scheduled action and nothing more.

A derived stores two things an effect does not have:

```js
let value;          // the number on the front sheet
let dirty = true;   // the sticky note; starts ON, because we have never computed
```

`dirty` starts `true` because on creation there is no cached value yet, so the first read must compute. This is why a derived doesn't run when you declare it — declaring it only creates a folder with a note already on it.

One more thing a derived has that an effect does not:

```js
let subscribers = new Set();   // a derived has its OWN subscriber list
```

`makeSignal` has a `subscribers` list. `watchEffect` does not — nothing can depend on an effect, nothing can read one. A derived has a list of its own, because other code reads a derived the same way it reads a signal. That is the first structural sign of what a derived actually is.

---

## Who Gets Credit for the Read

The certainty already stands: the expensive body cannot be sitting in `price`'s list, because `write()` calls everyone in the list unconditionally. But something has to be in that list — if nothing is, `price` never learns the derived exists, the sticky note never gets slapped on, and the folder hands out a wrong, silently stale total forever.

So: when the derived's body runs and calls `price.read()`, which function is sitting on top of `effectStack` at that moment? There are only a few candidates, and the choice decides the entire behavior of the system.

The instinctive answer is "the derived's compute function" — put `fn` on the stack, so `price` subscribes `fn` directly. Walk rule 2 through it: `price.write(20)` loops its subscriber list and calls everyone. If `fn` is in there, `fn` gets *called*, meaning the arithmetic *happens* — the same eager behavior, new packaging.

The second instinct is "the effect that read the derived" — let the outer effect subscribe straight to `price`. That destroys something else: the derived's cache stops being a cache. The effect would fire on every upstream write regardless of whether the derived's result changed, and the derived's own dependencies would leak upward into every consumer.

The answer is a function that does almost nothing, on purpose:

```js
function markDirty() {
  if (dirty) return;                        // already stale, nothing new to say
  dirty = true;                             // slap the note on
  for (const sub of [...subscribers]) sub(); // tell everyone downstream
}
```

That is the function that sits inside `price`'s subscriber list, and inside `quantity`'s subscriber list, forever. When `price.write(20)` loops its subscribers and calls everyone, it calls *this*. It sets a boolean. It does not multiply anything.

`write()` was never touched. It still loops the list and calls everyone, unconditionally, with no idea what those functions are. The laziness of the derived comes entirely from which function got put in the list — the signal itself is exactly as dumb as it was before. All the intelligence moved into what the subscriber does once called.

Each of `markDirty`'s three lines is doing something specific:

- **`if (dirty) return;`** — if the note is already on the folder, there is nothing new to announce. Slapping a second note on changes nothing, and telling everyone downstream a second time is waste. In a graph where one signal feeds five deriveds which feed three effects, this line is what stops an exponential storm of notifications. A hundred writes between two reads cost a hundred boolean checks, not a hundred computations.
- **`dirty = true`** — the only state change. No arithmetic, no `fn()`, no value touched. The cached `value` is still sitting there, now flagged untrustworthy.
- **`for (const sub of [...subscribers]) sub();`** — a derived notifies its own subscribers the same way a signal notifies its own subscribers. That copy of `write()`'s loop is not a coincidence.

---

## The Whole Thing, Assembled

```js
function makeDerived(fn) {
  let value;
  let dirty = true;
  let subscribers = new Set();

  function markDirty() {
    if (dirty) return;
    dirty = true;
    for (const sub of [...subscribers]) sub();
  }
  markDirty.mySignalLists = new Set();   // it re-tracks, exactly like an effect does

  function read() {
    // JOB 1 — behave like a signal: remember whoever is reading me
    const current = effectStack[effectStack.length - 1];
    if (current) {
      subscribers.add(current);
      current.mySignalLists.add(subscribers);
    }

    // JOB 2 — behave like a cache: refresh only if the note is on
    if (dirty) {
      forget(markDirty);                 // drop old dependencies
      effectStack.push(markDirty);       // ← markDirty gets the credit, not the caller
      value = fn();                      // the arithmetic, at last
      effectStack.pop();
      dirty = false;                     // remove the note
    }

    return value;
  }

  return { read };                       // no write(). deliberately.
}
```

Nine lines added to a machine already built. `read()` now does two jobs at once.

**Job 1 is signal behavior.** Whoever is on top of the stack gets added to *my* subscriber list — the same code as `makeSignal`'s `read()`, character for character. To the outside world, reading a derived is indistinguishable from reading a signal.

**Job 2 is cache behavior.** If the note is off, the block is skipped and the stored `value` is handed back — zero work, however many times it's asked for. If the note is on, `markDirty` is pushed onto the stack *before* `fn()` runs, so every `price.read()` and `quantity.read()` inside `fn()` credits `markDirty`, not the outer consumer. Then the note clears.

`effectStack.push(markDirty)` is the sentence "when my inputs change, don't run me — just tell me I'm stale."

The same test, same counter, against the naive version:

```
computations so far: 0
computations after 3 writes, nobody ever read total: 0
  computing total...
total.read() -> 26 | computations: 1
total.read() -> 26 | computations: 1
total.read() -> 26 | computations: 1
```

Zero on declaration. Zero after three writes with nobody watching. One on the first read. Still one after the second and third read, because the note is off and the front sheet is handed over as-is. Four computations became one.

---

## Two Hats, One Node

`makeDerived` returns something with two roles stacked inside it:

- It has `subscribers`, a `read()` that registers whoever is reading, and a body of stored state. That is a signal.
- It has `mySignalLists`, it goes onto the `effectStack` while it runs, it re-tracks its dependencies on every run, and it appears inside other signals' subscriber lists. That is an effect.

In architecture terms:

> A signal is a **source**: it has a subscriber list, and nothing upstream of it. An effect is a **leaf**: it subscribes to things, and nothing can subscribe to it. A derived is an **intermediate node**: it does both. It wears the effect hat facing upstream and the signal hat facing downstream.

In classic Observer-pattern terms, a signal is a **Subject**, an effect is an **Observer**, and a derived implements both interfaces at once. The frameworks are typed exactly this way, not merely described this way — <cite index="20-1">Vue's `ComputedRefImpl` is declared as implementing `Subscriber`, while separately owning its own `Dep`, Vue's name for a subscriber list</cite>. Subscriber facing up, dependency facing down, in the type signature.

The other half of the pattern is older and more familiar: a derived is a cache with automatic invalidation. Memoization plus a dirty flag plus a notification graph that sets that flag without being asked. <cite index="12-1">Svelte's own docs describe it the same way: anything read synchronously inside a `$derived` becomes a dependency, and when that dependency changes, the derived is marked dirty and recalculated the next time it's read.</cite>

Take `watchEffect`. Replace the body `fn()` with `dirty = true; notify()`. Add two fields, `value` and `dirty`, and one list, `subscribers`. Move `fn()` into a `read()` that runs it only when `dirty`. That is a derived. Everything else is identical.

---

This is the shape. What comes next: tracing a single write through a signal → derived → effect chain, a prediction checkpoint, and the standard rules about derived purity and read-only-ness, each derived from this model rather than memorized.
