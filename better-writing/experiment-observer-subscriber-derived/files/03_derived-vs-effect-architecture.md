# Derived vs Effect: The Architecture

## Your Question, Pinned Down First

You asked for the difference between `derived` and `watch` at the level of architecture. Let's keep your sentence and tighten exactly one word in it.

Both of them **subscribe**. That part of your intuition is correct and it stays. Both end up sitting inside some signal's subscriber list, both get called when that signal is written, both re-track their dependencies on every run. Architecturally they enter the machine through the same door.

The one word to repair is what happens *after* they get called.

- A **watch** (our `watchEffect`, Svelte's `$effect`, Vue's `watchEffect`) gets called and **runs your code**.
- A **derived** (Svelte's `$derived`, Vue's `computed`, Solid's `createMemo`) gets called and **writes a note**. Your code does not run. It runs later, if and only if somebody asks for the value.

By the end of this you will be able to say precisely which line of `watchEffect` a derived replaces, and which two extra fields it carries that an effect does not have. That is the whole architectural difference, and it is smaller than you would guess.

**A quick vocabulary pin, once, so we never trip over it again.** In this text I will say **effect** for the thing you have been calling *watch*, because that is what the frameworks call it (`$effect` in Svelte, `watchEffect` in Vue). Our own toy function is `watchEffect`. Same object, three names, one meaning: *a function that re-runs itself automatically whenever any signal it read has changed.*

---

## Where We Already Are: The Machine on the Table

Repetition is not wasted here, because everything below is a modification of these thirty lines. Let's put them back on the table and name each moving part out loud.

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

The four rules you already know cold, restated because we are about to lean on every one of them:

1. **`read()` only records.** It never runs anything. It adds whoever is on top of the stack into this signal's `subscribers`.
2. **`write()` only runs.** It never records. It calls everyone already in `subscribers`, no questions asked, no filtering.
3. **Reading is the only moment a dependency is discoverable**, because reading is the only place in the code where a function and a value are visible together.
4. **The stack decides who gets credit for a read.** Whoever is on top when `read()` fires is the one who gets subscribed.

Hold on to rule 2 in particular. `write()` calls everyone in the list. It has no idea what those functions do. **That ignorance is the entire hinge of today's lecture.** If we can control *what function we put in the list*, we control what a write does, without touching `write()` at all.

---

## The Felt Problem: Try to Build a Derived With What We Have

Here is a real, boring, everyday piece of a shopping cart. One line item. This is our running example for the whole lecture, and we will not switch to anything else.

```js
const price = makeSignal(10);
const quantity = makeSignal(2);
// we want: total, which is always price × quantity
```

You have exactly one tool for "react to change": `watchEffect`. So the honest first attempt is to use it, and stash the answer in a signal so that other code can read it reactively:

```js
function makeDerivedNaive(fn) {
  const cache = makeSignal(undefined);
  watchEffect(() => cache.write(fn()));    // recompute, store
  return { read: cache.read };
}
```

Read that slowly, because it is not stupid — it is the version most people write, and it *works*:

- `cache` is an ordinary signal holding the last computed answer.
- The effect runs `fn()`, gets a number, and writes it into `cache`.
- Because the effect read `price` and `quantity` while the stack flag was up, both signals now hold this effect in their subscriber lists. Any write to either one re-runs it, which recomputes and re-writes `cache`.
- Anyone reading `cache.read()` inside their own effect subscribes to `cache`, and so gets notified down the chain.

Let's watch it, with a counter on the computation so we can see the bill:

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

**Four computations. Nobody ever asked for the total.** Not once. `total.read()` appears for the first time on the last line, and by then the work has already been done four times over.

Now feel the size of that. Multiply by a real app: a derived that sorts ten thousand rows, sitting in a panel the user has not opened; a derived that formats a currency string for a row scrolled out of view; a derived that runs a regex over a document. Every keystroke anywhere upstream pays for all of them, whether or not a single pixel on screen depends on the result. And this is not a bug in our implementation — it is forced by the architecture we chose. We put the computation itself into `price`'s subscriber list, and rule 2 says `write()` calls everyone in the list. `price` has no way to *not* call it.

So we can derive a certainty before seeing any solution:

> Whatever a real derived is, it **cannot** be an effect that writes a signal. The expensive body must not be the thing sitting in the upstream subscriber list. Something else has to be sitting there instead.

That "something else" is the whole architecture. Everything below is finding out what it is.

---

## The Anchor: The Out-of-Date Sticky Note

One image, mapped completely, then we switch to the real vocabulary and stay there.

An accounts office keeps a folder for each customer with a computed total on the front sheet. When a price changes upstream, the clerk does **not** redo the arithmetic. Redoing arithmetic is expensive and most folders are never requested. Instead the clerk walks over and slaps a sticky note on the folder: **OUT OF DATE**. That is all. Two seconds, no arithmetic.

Later, someone comes to the counter and asks for that customer's total. Now, and only now, the folder is opened. If there is a sticky note on it, the arithmetic is redone, the front sheet is updated, and the note is removed. If there is no note, the front sheet is already correct and is handed over as-is — no arithmetic at all, no matter how many people ask.

The mapping, actor by actor:

| In the office | In the code |
|---|---|
| The folder | the derived object |
| The number on the front sheet | the cached `value` |
| The sticky note | the `dirty` boolean |
| Slapping the note on | `markDirty()` — the tiny function we put in the upstream list |
| Someone asking at the counter | `read()` |
| Redoing the arithmetic | calling `fn()`, the derived's body |
| Removing the note | `dirty = false` |

Now the real names, because these are the words the frameworks use and the words you want in your mouth:

- **Dirty flag.** *Technical:* a boolean on a cached node meaning "my stored value can no longer be trusted." *Plain:* a yes/no marker that says "this number is stale, redo it before you use it."
- **Invalidation.** *Technical:* the act of setting that flag on a node and propagating the same act to everything downstream, without recomputing anything. *Plain:* telling everyone downstream "your number is stale too," and nothing more than telling.
- **Lazy, or pull-based.** *Technical:* the computation is deferred until a consumer requests the value. *Plain:* nothing is calculated until someone actually asks.
- **Eager, or push-based.** *Technical:* the computation is triggered by the change itself, independent of any consumer. *Plain:* the moment the input changes, the work happens, asked for or not.
- **Memoized.** *Technical:* a function that stores its last result and returns the stored copy on subsequent calls with unchanged inputs. *Plain:* it remembers the answer so it does not have to work it out twice.

Put those together and you have the name of the architecture, which the TC39 signals proposal calls **push-then-pull**: the *notification* travels eagerly and instantly through the whole graph, while the *computation* waits, lazily, for someone to read. Two different things travelling at two different speeds. An effect has only one speed, because an effect has nothing to cache.

---

## Sub-Puzzle 1: Where Does the Value Live?

This half is easy and we will do it fast, because it is the half you can guess.

An effect stores nothing. Look back at `watchEffect`: there is no `value` variable anywhere in it. It runs `fn()`, throws away whatever `fn()` returned, and that is the end of it. An effect is *only* a scheduled action.

A derived has to store two things that an effect does not have:

```js
let value;          // the number on the front sheet
let dirty = true;   // the sticky note; starts ON, because we have never computed
```

That is field one and field two. `dirty` starts as `true` because on creation there is no cached value yet, so the very first read must compute. This is why a derived does **not** run when you declare it — declaring it only creates a folder with a note already on it.

And one more thing a derived has that an effect does not:

```js
let subscribers = new Set();   // a derived has its OWN subscriber list
```

Stop on that line. `makeSignal` has a `subscribers` list. `watchEffect` does not — an effect is never in anybody's way, nothing can depend on an effect, nothing can read an effect. A derived has one, because other code reads a derived exactly the way it reads a signal. That is the first structural hint of what a derived actually is, and we will name it properly in a minute.

---

## Sub-Puzzle 2: Who Goes Into `price`'s Subscriber List?

**This is the conceptual heart, so we are going to slow all the way down.**

We established the certainty: the expensive body must not be sitting in `price`'s list, because `write()` calls everyone in the list unconditionally. Fine. But *something* must be in that list. If nothing is, `price` never learns the derived exists, and the sticky note never gets slapped on at all — the folder would go stale silently and hand out wrong totals forever.

So: **when the derived's body runs and calls `price.read()`, which function is on top of `effectStack` at that moment?**

Try to answer before reading on. There are only a few candidates and the choice completely determines the behaviour of the system. Take the fifteen seconds.

---

The instinctive answer is "the derived's compute function" — put `fn` on the stack, so `price` subscribes `fn`. But walk rule 2 through it: `price.write(20)` loops its subscriber list and calls everyone. If `fn` is in there, `fn` gets *called*, which means the arithmetic *happens*, which is precisely the eager behaviour we just spent a section escaping. Same trap, new packaging.

The second instinct is "the effect that read the derived" — let the outer effect subscribe directly to `price`. That destroys something else: the derived's cache stops being a cache. The effect would fire on every upstream write regardless of whether the derived's result actually changed, and the derived would never get the chance to stop anything. Worse, the derived's own dependencies would leak upward into every consumer.

Here is the answer, and it is the genuinely strange part of the design:

> **The function we register in `price`'s subscriber list is neither the body nor the consumer. It is a two-line function whose entire job is to set `dirty = true` and pass the message on.**

```js
function markDirty() {
  if (dirty) return;                        // already stale, nothing new to say
  dirty = true;                             // slap the note on
  for (const sub of [...subscribers]) sub(); // tell everyone downstream
}
```

That is it. That is the function that sits inside `price`'s subscriber list, and inside `quantity`'s subscriber list, forever. When `price.write(20)` loops its subscribers and calls everyone, what it calls is *this*. It sets a boolean. It does not multiply anything.

Now look again at rule 2 and notice what we pulled off. **We never touched `write()`.** `write()` still does exactly what it always did: loop the list, call everyone, unconditionally, with no idea what those functions are. The entire laziness of the derived comes from one decision — *which function we chose to put in the list.* The signal is as dumb as it ever was. All the intelligence moved into what the subscriber does when called.

Three details in `markDirty` worth naming, because each one is doing real work:

- **`if (dirty) return;`** — the early exit. If the note is already on the folder, there is nothing to announce; slapping a second note on changes nothing and telling everyone downstream a second time is pure waste. In a graph where one signal feeds five deriveds which feed three effects, this single line is what stops an exponential storm of notifications. It also means a hundred writes between two reads cost a hundred boolean checks, not a hundred computations.
- **`dirty = true`** — the only state change. No arithmetic, no `fn()`, no value touched. The cached `value` is still sitting there, now flagged as untrustworthy.
- **`for (const sub of [...subscribers]) sub();`** — the propagation. And notice: this line is a *copy of `write()`'s loop*. A derived notifies its own subscribers exactly the way a signal notifies its own subscribers. That is not a coincidence, and it is the point we are about to name.

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
      effectStack.push(markDirty);       // ← THE line: markDirty gets the credit
      value = fn();                      // the arithmetic, at last
      effectStack.pop();
      dirty = false;                     // remove the note
    }

    return value;
  }

  return { read };                       // no write(). deliberately.
}
```

Nine meaningful lines added to a machine you already knew. Let me walk the two jobs once more, out loud, because `read()` is now doing double duty and that is the thing to hold.

**Job 1 is signal behaviour.** Whoever is on top of the stack right now gets added to *my* subscriber list. This is character-for-character the same code as `makeSignal`'s `read()`. To the outside world, reading a derived is indistinguishable from reading a signal.

**Job 2 is cache behaviour.** If the note is off, we skip the whole block and hand back the stored `value` — zero work, however many times you ask. If the note is on, we push `markDirty` onto the stack *before* running `fn()`, so that every `price.read()` and `quantity.read()` inside `fn()` credits `markDirty`, not the outer consumer. Then we clear the note.

That push line is the one to memorise. `effectStack.push(markDirty)` is the sentence "when my inputs change, don't run me — just tell me I'm stale."

Watch the difference against the naive version, same test, same counter:

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

## Now Name It: The Two Hats

Look at what `makeDerived` returned and what it swallowed.

- It has `subscribers`, a `read()` that registers whoever is reading, and a body of stored state. **That is a signal.**
- It has `mySignalLists`, it goes onto the `effectStack` while it runs, it re-tracks its dependencies on every run, and it appears inside other signals' subscriber lists. **That is an effect.**

So here is the sentence you were after when you asked about architecture:

> **An effect is a leaf. A derived is a node.**
>
> A signal is a **source**: it has a subscriber list, and nothing upstream of it. An effect is a **leaf** (a sink, a dead end): it subscribes to things, and nothing can subscribe to it. A derived is an **intermediate node**: it does both. It wears the effect hat facing upstream and the signal hat facing downstream.

And the design pattern name, since you asked at that level: in classic Observer terms, a signal is a **Subject** (something you can observe), an effect is an **Observer** (something that gets notified), and **a derived implements both interfaces at once.** This is not an analogy I am imposing — it is literally how the frameworks are typed. Vue's source declares its computed class as implementing `Subscriber` while simultaneously holding its own `Dep` object, which is Vue's word for a subscriber list. Subscriber facing up, dependency facing down. Two hats, in the type signature.

The other half of the pattern is older and more famous: a derived is a **cache with automatic invalidation**. Memoization plus a dirty flag plus a notification graph that sets that flag for you. The reason "cache invalidation" is a proverbially hard problem is that you normally have to figure out *when* to invalidate by hand. The dependency graph does it for you, and it does it by the mechanism you already understood on day one — `read()` records the connection at the only moment it is visible.

**Which lets us answer your question in one line.** Take `watchEffect`. Replace the body `fn()` with `dirty = true; notify()`. Add two fields, `value` and `dirty`, and one list, `subscribers`. Move `fn()` into a `read()` that runs it only when `dirty`. That is a derived. Everything else is identical.

---

## The Trace: What Travels When

Prose serialises this badly, so here is the single write, in time. One write to `price`, with our line item and one effect printing the total.

```
price.write(20)
│
│  ── PHASE 1: PUSH ── (instant, no arithmetic anywhere)
├─ price.value = 20
├─ price loops its subscribers → finds markDirty
│  └─ markDirty(): dirty was false → set dirty = true
│     └─ loops total's OWN subscribers → finds the effect's run()
│        │
│        │  ── PHASE 2: PULL ── (the consumer forces the work)
│        └─ run(): forget, push itself on the stack, call the effect body
│           └─ total.read()
│              ├─ JOB 1: subscribes run() to total again
│              └─ JOB 2: dirty is true →
│                   ├─ forget(markDirty)
│                   ├─ push markDirty on the stack
│                   ├─ fn() runs: price.read() × quantity.read()   ← THE ARITHMETIC
│                   │    (both reads credit markDirty, re-subscribing it)
│                   ├─ pop
│                   └─ dirty = false
│              └─ returns 40
│           └─ console.log("EFFECT prints total:", 40)
```

Two phases, two speeds. Phase 1 is a boolean and a loop. Phase 2 is the actual work, and it only exists because there was an effect at the bottom demanding a value. Delete the effect and phase 2 never happens.

Verified subscriber counts on that exact setup:

```
price subscribers (the derived's markDirty): 1
quantity subscribers (the derived's markDirty): 1
total subscribers (the effect): 1
```

Three lists, three entries, and note who is in which. The effect is **not** in `price`'s list. It has never heard of `price`. It only knows `total`. The derived is a firewall between them — and that firewall is what makes everything in the next section possible.

---

## Checkpoint: Predict This Before Reading On

Same line item. A derived that logs when it computes. An effect that prints it. Then three writes.

```js
const price = makeSignal(10);
const quantity = makeSignal(2);

const total = makeDerived(() => {
  console.log("  computing total...");
  return price.read() * quantity.read();
});

watchEffect(() => { console.log("  EFFECT prints:", total.read()); });

price.write(20);
price.write(30);
price.write(40);
```

**How many times does `computing total...` print?** Reason it out with the trace above before you look. The derived is lazy — but lazy relative to *what*?

---

Tested, prints:

```
  computing total...
  EFFECT prints: 20
  computing total...
  EFFECT prints: 40
  computing total...
  EFFECT prints: 60
  computing total...
  EFFECT prints: 80
```

**Four.** Once on setup, once per write. The lazy derived computed every single time, exactly as often as the eager naive version did.

Walk the reason through the trace and it is inevitable. `price.write(20)` calls `markDirty`. `markDirty` sets the note and notifies its own subscribers. Its subscriber is an effect. An effect, when called, *runs immediately* — that is the definition of an effect. It runs, it reads `total`, the note is on, so the arithmetic happens on the spot. The pull follows the push by microseconds because there is something at the bottom that always pulls.

Now the same code with the effect deleted:

```
  computing total...
  finally reading: 80
```

**One.** Three writes, one computation, at the moment of the read.

If your prediction matched, the model has transferred, and you now hold the sentence that most explanations of `computed` never say out loud:

> **Laziness is not a property of the derived. It is a property of what is downstream of it.**

A derived read by an effect is effectively eager, because the effect drags the value out of it immediately. A derived read by nothing is genuinely lazy and free. This is exactly the collapsed-panel case: while the panel is closed, no effect reads the derived, so the derived's subscriber list is empty, so `markDirty` notifies nobody, so the arithmetic never happens.

```
writes with no reader downstream -> computations: 0
panel opens, total.read() -> 495 | computations: 1
```

**Streetwise version:** "derived is lazy so it's free" is a half-truth that will burn you in a code review. What a derived reliably buys you is *deduplication and caching* — one computation per change no matter how many consumers read it, and zero computations for reads with no change in between. The full skip only happens when nothing downstream is eager. Say the precise thing.

---

## The Consequences, Derived Rather Than Memorised

Every rule below falls out of the model. None of them need to be remembered as rules; you can re-derive each one in ten seconds from the trace.

### "A derived must be pure. No side effects inside."

You have seen this rule in every framework's docs. Now you can see *why*, and it is not a style opinion.

The body of a derived runs at times you do not control: possibly never, possibly once for four writes, possibly after five other writes have already happened, possibly at the exact moment some unrelated component happens to read it. A `fetch()` in there fires an unpredictable number of times at unpredictable moments. A `console.log` in there lies to you about when things changed. The purity requirement is a *consequence of the caching*, not a matter of taste. You cannot have "only recompute when someone asks" and "runs exactly once per change" at the same time.

The mirror image: an effect is guaranteed to run when its dependencies change, which is exactly why side effects belong there and nowhere else.

### "A derived is read-only."

Look at the return statement: `return { read }`. There is no `write`. Not withheld out of politeness — there is no meaningful thing for it to do. The value is a function of upstream nodes; writing it would be immediately overwritten by the next invalidation. Vue's `computed` is read-only for exactly this reason, and Willy Brauner's write-up puts it neatly: a computed is a signal without a setter.

*One current nuance worth knowing:* since Svelte 5.25, `$derived` can be reassigned as a deliberate temporary override — an optimistic UI value that survives until the next dependency change re-derives it. That is a convenience layered on top, not a change to the architecture. The node still has no independent existence.

### "If your effect's only job is to set state from other state, you wanted a derived."

This is the single most repeated piece of Svelte 5 advice, and it is now a theorem rather than a commandment. Compare the two shapes on our line item:

```js
// the effect version
let total = $state(0);
$effect(() => { total = price * quantity; });

// the derived version
let total = $derived(price * quantity);
```

The effect version is our naive attempt, and it inherits every defect of it, each traceable to the trace:

1. **The first frame is wrong.** `total` is `0` at render time. The effect runs *after* the DOM is painted, sets `total`, which triggers a second render. The user can see the flash.
2. **Two passes per change instead of one.** Write → effect → write → render. The derived does write → mark → pull → render.
3. **Loop risk.** The effect both reads and writes reactive state, so the graph now has a cycle in it. Anything that writes back to `price` from downstream of `total` spins forever. A derived cannot form that cycle, because it has no write door at all.

### "You can declare fifty deriveds cheaply. You cannot declare fifty effects cheaply."

Directly from the trace. Fifty deriveds that nobody reads cost fifty boolean flips per write — the `if (dirty) return;` line makes even that nearly free after the first. Fifty effects cost fifty full executions per write, forever, because an effect run *is* the work. Derive aggressively; spend effects sparingly.

### "Effects are a last resort. Reach for derived first."

Not a cultural preference — a structural one. An effect is a leaf, so nothing can be built on top of it. The moment you put a value inside an effect, that value has left the reactive graph; anything else that wants it needs a second signal and a second hop. A derived stays *in* the graph and can be composed: deriveds feeding deriveds feeding deriveds, all lazy, all cached, all invalidating each other in one push pass. The composability is the architectural payoff, and effects have none of it by construction.

### The one you get for free: conditional dependencies inside a derived

We never wrote a single line for this, yet it works, because `markDirty` reuses the exact `forget` / `mySignalLists` machinery we built for effects two lessons ago:

```js
const useDiscount = makeSignal(false);
const discount = makeSignal(0.5);
const price = makeSignal(100);

const total = makeDerived(() =>
  useDiscount.read() ? price.read() * discount.read() : price.read()
);
```

Tested:

```
  EFFECT prints: 100
discount subscribers while unused: 0
--- useDiscount.write(true) ---
  EFFECT prints: 50
discount subscribers now: 1
```

While the discount is off, `discount` has zero subscribers — the derived does not depend on something it did not read, so writing `discount` costs nothing at all. Turn the flag on, and the dependency appears by itself. This is the same "forget then re-learn on every run" fix we built for effects, working unchanged for a derived, because a derived *is* an effect facing upstream. When the architecture is right, features stop needing to be written.

---

## What We Deliberately Did Not Build

Being honest about the edges, in the same spirit as before.

**The third state.** Our `dirty` is a boolean: clean or dirty. Watch what that costs us:

```js
const items = makeSignal(["a", "b", "c"]);
const howMany = makeDerived(() => items.read().length);
watchEffect(() => console.log("  EFFECT prints:", howMany.read()));

items.write(["x", "y", "z"]);   // completely different array, still length 3
```

Tested:

```
  computing howMany...
  EFFECT prints: 3
--- items.write(['x','y','z']) : length is still 3 ---
  computing howMany...
  EFFECT prints: 3
```

The effect re-ran to print the same number. The derived *could* have stopped the change dead — the value did not change — but it had already notified downstream before it recomputed, because in a push-then-pull system the marking happens first. Real frameworks fix this with a **third state**, usually called *maybe dirty*: downstream nodes are marked "one of my ancestors moved, check before you run," and when they check, the derived recomputes, finds the same value, and reports back "nothing to do." Svelte's internals carry exactly these three states on every reactive node — clean, dirty, maybe-dirty — which is what lets a derived act as a genuine circuit-breaker rather than a relay. As the Leptos book puts it, the measure of a reactive system is not how fast it propagates changes but how well it avoids over-notifying.

**Batching** and **the diamond problem** are still on the list from last time, and they are the same fix wearing two names: a queue that collects pending re-runs and flushes them once, deduplicated, instead of running synchronously inside every `write()`. The third state above is closely related — all three are about *when* the pull is allowed to happen. They belong together, in one lesson, after this one.

---

## Your Sentence, In Its Final Form

You asked for the difference between derived and watch at the level of architecture. Here it is in your own vocabulary, now precise:

> Both a derived and an effect are subscribers: both end up inside some signal's subscriber list, both re-track their dependencies on every run, both use the same stack to find out who gets credit for a read. The difference is what each one puts in that list. An effect puts **your code** there, so a write runs it immediately — an effect is a leaf, produces no value, and nothing can be built on top of it. A derived puts a two-line **markDirty** there instead, so a write only flips a boolean and forwards the news; the code itself waits inside `read()` until a consumer actually asks. That makes a derived a **node** rather than a leaf: it wears the effect hat facing upstream and the signal hat facing downstream, with a cached value and a dirty flag in between. Notification travels eagerly, computation travels lazily. Push, then pull.

**What you can now predict without being told:** why a derived inside a closed panel costs nothing; why the same derived inside an open panel costs exactly as much as an effect; why fifty deriveds are cheap and fifty effects are not; why `fetch` inside a derived misfires; why an effect that assigns state causes a visible flash on first render; why a dependency read only in one branch of an `if` disappears from the graph when that branch is not taken.

---

## Where To Go Next

Pick one:

1. **Batching and the diamond problem, plus the third state** — the queue that makes all three go away at once. This is the natural next block, and the over-notification test above is the motivating bug.
2. **`$effect.pre` vs `$effect`, and why flush timing exists at all** — the same push/pull question, asked about the DOM instead of about values. Directly practical for porting Vue watchers.
3. **What Svelte's compiler actually emits for `$derived`** — mapping the toy `makeDerived` onto real generated output, so the machine stops being a toy.

### Reading, gentlest first

- **Willy Brauner, "Signals, the push-pull based algorithm"** — the friendliest walkthrough of exactly this mechanism, with the same invalidate-then-recompute-on-read shape. https://willybrauner.com/journal/signal-the-push-pull-based-algorithm
- **Jonathan Frere, "Pushing and Pulling: Three Reactivity Algorithms"** — builds up the dirty-flag algorithm step by step, including why you skip nodes already marked dirty. https://jonathan-frere.com/posts/reactivity-algorithms/
- **Rob Eisenberg on the TC39 signals proposal** — where the phrase *push-then-pull* comes from, and the list of properties it buys you. https://eisenbergeffect.medium.com/a-tc39-proposal-for-signals-f0bedd37a335
- **The Leptos book, "How Does the Reactive System Work?"** — the clearest statement of the trade-off between propagation speed and over-notification. https://book.leptos.dev/appendix_reactive_graph.html
- **Vue's `computed.ts` source** — short, readable, and the type signature says the whole thing: a computed implements `Subscriber` while owning its own `Dep`. https://github.com/vuejs/core/blob/main/packages/reactivity/src/computed.ts
- **Svelte's `$derived` docs** — canonical reference; note the one sentence that is our entire lecture: dependencies change, the derived is marked dirty, and it recalculates when next read. https://svelte.dev/docs/svelte/$derived
