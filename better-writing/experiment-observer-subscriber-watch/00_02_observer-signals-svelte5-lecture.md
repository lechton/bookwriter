# The Observer Pattern, Closures, and Signals: How Svelte 5 Actually Works Under the Hood

*A full lecture, beginner to advanced, with tested code.*

## Before Anything Else: The Problem Nobody Warns You About

### Why does changing a variable do absolutely nothing?

Let's start with something that should bother you more than it does.

```js
let count = 0;
count = 5;
```

Run that. Nothing happens. No error, no update, no reaction anywhere in your program. `count` changed, and nothing was told about it.

That's not a bug. That's just what a plain variable is: nobody is watching it. And yet every reactive framework you've ever used (React, Vue, Svelte, Solid, Angular) promises you the opposite: change a value, and the screen updates by itself. That promise sounds like magic until you see it's the same short mechanism, reused over and over, under a different name each time.

This lecture builds that mechanism from nothing. By the end, you will have written, by hand, in plain JavaScript, no framework installed, a working signal: the exact primitive sitting underneath Svelte 5's `$state`, Vue's `ref`, and Solid's `createSignal`. Not a simplified toy version. The real mechanism, tested and working.

Here's the roadmap, stated up front, because I'm going to repeat it several times before we're done:

We need exactly two functions. Every framework has its own name for them, but the job never changes:

- **Part A**: a function that remembers "somebody wants to know when this changes." Frameworks call this `subscribe`, `track`, `on`, `listen`.
- **Part B**: a function that actually tells them. Frameworks call this `notify`, `trigger`, `emit`, `publish`.

That's it. That's the entire Observer pattern. Everything else in this lecture, including Svelte 5's reactivity engine, is Part A and Part B under different names, plus one extra trick (call it Part C) that makes Part A happen automatically instead of by hand.

Remember those two letters. I will keep coming back to them.

## Part One: What "Observer/Subscriber" Actually Means, No Jargon

### One sentence, no framework required

Here's the entire pattern in one sentence, and I want you to remember this sentence, not the paragraph after it:

**Keep a list of functions. Call them all later.**

That's the whole pattern. Everything else is implementation detail.

The formal names, in case you meet them in a book or an interview: the thing being watched is the **Subject** (also called "Observable," "Publisher," or "Emitter"). The things watching it are the **Observers** (also called "Subscribers," "Listeners," or "Handlers"). The Subject keeps a list of Observers. When something worth reporting happens, the Subject loops through that list and calls every single one.

You've already used this pattern without naming it:

```js
button.addEventListener("click", () => console.log("clicked"));
```

`addEventListener` is `subscribe`, under a different name, built into the browser. The button is the Subject. Your arrow function is the Observer. When you click, the button loops through everyone who called `addEventListener` on it and calls them. That loop is `notify`, running invisibly inside the browser.

Node's `EventEmitter` shows the same pattern with less packaging around it:

```js
emitter.on("data", (chunk) => console.log(chunk)); // subscribe
emitter.emit("data", "hello"); // notify
```

`on` is Part A. `emit` is Part B. Same pattern, different names, same two jobs.

**Practical remark, worth keeping: subscribing is just pushing a function into an array. Notifying is just looping over that array and calling each function. There is no more magic than that, anywhere, in any framework.**

## Part Two: Closures, Refreshed (No Shortcuts Here)

### The one rule that makes all of this possible

Before we build anything, we need one JavaScript mechanism to actually work: closures. If you already know closures cold, read this anyway, because I'm going to phrase the rule in a way you'll reuse for the rest of this lecture.

**A closure is what you get when a function keeps access to variables from the place it was created, even after that place has already finished running.**

Watch this:

```js
function makeCounter() {
  let total = 0; // lives inside makeCounter

  function increment() {
    total = total + 1;
    return total;
  }

  return increment; // hand back the inner function itself
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

Walk through this slowly, every line matters:

- `makeCounter()` runs once. Inside it, `total` is created and set to `0`.
- Inside `makeCounter`, we define `increment`, a function that reads and changes `total`.
- `makeCounter` returns `increment` itself (not the result of calling it, the function itself), and `makeCounter` finishes running.
- Normally, when a function finishes, its local variables get thrown away. `total` should be gone. It isn't.
- Every time you call `counter()`, it still finds `total`, still changes it, still remembers the previous value.

That's a closure: `increment` is a function bundled with the memory of the scope it was born in. `total` never gets thrown away, because `increment` is still holding onto it.

**Practical remark: a closure is a function that remembers where it came from, even after where it came from has already returned.**

Here's the part that matters for the rest of this lecture: **closures are how JavaScript does private variables.** No `private` keyword needed. `total` cannot be reached from outside `makeCounter`. Nobody outside can do `counter.total = 999`. The only way in is through the function that was handed the key.

Hold onto that. We're about to hide a list of subscribers inside a closure, exactly the way `total` is hidden inside `makeCounter`.

## Part Three: The Blueprint, Stated Once, Properly

### Two functions, one hidden list, that's the whole architecture

Let's state the actual blueprint before writing the real thing.

Every implementation of this pattern needs three ingredients, and the first two are the ones I already told you to remember:

1. **A hidden list.** An array (or a Set) sitting inside a closure, invisible from the outside, holding every function that wants to be told about changes.
2. **Part A, a way to add to that list.** Some frameworks call it `subscribe`. Vue's internals call the equivalent operation `track`. The job, always: push a function into the hidden list. Never call it, just remember it.
3. **Part B, a way to walk that list and call everyone in it.** Some frameworks call it `notify`. Vue's internals call it `trigger`. The job, always: loop over the hidden list and call every function in it, in order.

Say it back to yourself: **hidden list, Part A adds to it, Part B walks it and calls everyone.** That's the whole pattern. Nothing else is happening anywhere in any reactive framework you have used. I'll prove that claim by the end of this lecture.

We've done zero of these three things in real code so far. Let's fix that, one piece at a time.

## Part Four: Building Part A, the Function That Remembers Who's Listening

### subscribe: it doesn't call anything, it just remembers

```js
function createEmitter() {
  let subscribers = []; // the hidden list, lives in the closure

  function subscribe(fn) {
    subscribers.push(fn);
  }

  // notify comes next
}
```

Read that `subscribe` function again. It takes one argument, a function, and does exactly one thing: pushes it onto `subscribers`. It does **not** call `fn`. It does **not** run anything. It just remembers, for later.

This is where closures stop being a side topic and become the entire mechanism. `subscribers` lives inside `createEmitter`. `subscribe` is defined inside `createEmitter` too, so `subscribe` can see `subscribers` forever, exactly like `increment` could see `total` forever. Once `createEmitter()` finishes running, nothing outside can reach `subscribers` directly. The only door in is `subscribe`.

**Practical remark: subscribing is `array.push(fn)`. That's the entire function. If you remember one line from this whole lecture, remember that one.**

We now have Part A. Not Part B yet. Let's build it.

## Part Five: Building Part B, the Function That Actually Tells Everyone

### notify: loop over the list, call each one

```js
function notify(payload) {
  for (const fn of subscribers) {
    fn(payload);
  }
}
```

This is the entire job of Part B: walk the hidden list, and call every function sitting in it, optionally handing each one a piece of data (`payload`) about what changed.

That's genuinely all it is. No scheduler here, no virtual DOM, no diffing algorithm. A `for` loop calling functions. Every reactive update you've ever seen on a screen, at the bottom of the stack, is this loop running.

**Practical remark: notifying is `subscribers.forEach(fn => fn())`. Subscribing pushes into the list. Notifying loops over the list. Two verbs, the entire pattern.**

We now have Part A and Part B both written. Let's put them in the same closure and prove they work together.

## Part Six: Assembling the First Working Observer

### Same closure, both functions, tested

```js
function createEmitter() {
  let subscribers = [];

  function subscribe(fn) {
    subscribers.push(fn);
  }

  function notify(payload) {
    for (const fn of subscribers) {
      fn(payload);
    }
  }

  return { subscribe, notify };
}
```

```js
const emitter = createEmitter();

emitter.subscribe((x) => console.log("first listener got:", x));
emitter.subscribe((x) => console.log("second listener got:", x));

emitter.notify(42);
// first listener got: 42
// second listener got: 42
```

Read this line by line, nothing skipped:

- `createEmitter()` runs. `subscribers` is created as an empty array, sealed inside the closure.
- `subscribe` and `notify` are both defined inside that same closure, so they share the same `subscribers` array. One shared hidden list, not two.
- We call `subscribe` twice, with two logging functions. Both get pushed into `subscribers`. Nothing has been called yet, `subscribers` now has two entries.
- We call `notify(42)`. This loops over `subscribers`, calls the first function with `42`, then the second, with `42`. Both log.

**Recap, first checkpoint: we said we needed Part A and Part B. `subscribe` is Part A. `notify` is Part B. Both exist, in the same closure, sharing the same hidden list. That's the complete Observer/Subscriber pattern, in about ten lines, fully working.** Nothing hidden that you haven't seen with your own eyes.

## Streetwise Break: Where This Breaks in Real Codebases

### Three mistakes worth knowing before you ship this

Before going further: this exact pattern, `subscribers.push` plus a loop, is what jQuery's `.on()` / `.trigger()` did back in 2010, what Backbone's `Backbone.Events` mixin did, what Node's `EventEmitter` still does today. It hasn't changed in fifteen years, because there's nothing left to improve about looping over an array. Worth knowing too: AngularJS's original approach didn't use a subscriber list at all. It re-checked every value on every digest cycle, comparing old to new, no subscribe step anywhere. It worked, but it meant re-checking things nobody had touched, which is a large part of why the industry moved toward push-based subscription instead. The pattern in this lecture is the one that won.

The mistakes people make around it haven't changed either:

**Mistake one: forgetting to call notify.** You write a setter, update the value, and forget the loop. Nothing updates, no error is thrown, and you spend forty minutes checking everything except the one line you skipped. If a value silently isn't reactive, check that the write path actually calls notify. It's almost always that.

**Mistake two: never unsubscribing, ever.** Every `subscribe` call adds permanently to `subscribers`. If the thing that subscribed goes away (a component unmounts, a modal closes) but never removes itself, it stays in memory forever and keeps getting called forever, updating something that no longer exists. This is the single most common memory leak in front-end code, and it's exactly why every framework gives you a cleanup hook: React's cleanup function, Vue's `onUnmounted`, Svelte's automatic `$effect` teardown. All of them exist to solve one problem: get out of the list when you're done.

Let's fix it properly, "proper code" means shipping the cleanup path too:

```js
function subscribe(fn) {
  subscribers.push(fn);
  return function unsubscribe() {
    subscribers = subscribers.filter((sub) => sub !== fn);
  };
}
```

`subscribe` now returns its own personal cleanup function. That returned function is itself a closure: it remembers exactly which `fn` to remove, because it was created at the same moment `fn` was pushed. Call it, and only that one function gets filtered back out of `subscribers`.

**Mistake three: assuming one broken subscriber can't take down the rest.** A plain `for` loop stops dead the moment one subscriber throws, and every subscriber after it never runs. Production code usually wraps each call in a `try/catch` inside the loop, so one broken listener doesn't silently break every other one.

## Part Seven: So What Actually Makes Something a "Signal"?

### Same two functions, one narrower job, one new habit

Everything above is a generic Observer. It can broadcast anything: clicks, chat messages, log lines, whatever gets handed to `notify`. A **signal** is a specific, narrower use of the exact same pattern, restricted to watching a single piece of state.

Three differences, only three:

1. A signal wraps exactly **one value**, not an arbitrary stream of events.
2. A signal exposes a **getter** (read the current value) and a **setter** (write a new value), instead of an open `notify(payload)` you call with anything.
3. The setter is the **only** place that calls Part B. You never call notify by hand. You call `set(newValue)`, and it quietly does the notifying for you.

Let's build exactly that, changing as little as possible from what we already have:

```js
function createSignal(initialValue) {
  let value = initialValue;
  let subscribers = [];

  function get() {
    return value;
  }

  function set(newValue) {
    value = newValue;
    for (const fn of subscribers) {
      fn(value);
    }
  }

  function subscribe(fn) {
    subscribers.push(fn);
  }

  return { get, set, subscribe };
}
```

```js
const count = createSignal(0);

count.subscribe((v) => console.log("count changed to:", v));

count.set(1); // count changed to: 1
count.set(2); // count changed to: 2

console.log(count.get()); // 2
```

**Recap, second checkpoint: Part A is still here, called `subscribe`, unchanged. Part B is still here too, it just moved inside `set` instead of standing alone as its own function.** `set` now does two jobs: update `value`, then run the notify loop. Nothing new invented, we just narrowed the Observer pattern down to exactly one value and gave it friendlier names: get, set, subscribe.

## Part Eight: The Missing Piece, Automatic Subscribing

### The one thing above that no real framework makes you do by hand

Here's a genuine pain point in what we just built: you had to call `.subscribe()` yourself, by hand, for every single place that cares about `count`. In a real application with dozens of components each reading several signals, that's dozens of manual subscribe calls, and dozens of matching unsubscribe calls you have to remember not to forget. That's exactly the tedious, error-prone bookkeeping that made classic pub/sub, and manual `EventEmitter` wiring, painful to maintain at scale.

Signals, as used in Svelte, Solid, and Vue, solve this with one more piece. Call it **Part C**:

**Keep track of "who is currently running," in one shared variable. When a signal is read, and somebody is currently running, subscribe that somebody automatically. Nobody calls `.subscribe()` by hand ever again.**

```js
let activeEffect = null; // Part C: who's asking right now?

function effect(fn) {
  activeEffect = fn;
  fn(); // run it once, any signal read inside triggers auto-subscribe
  activeEffect = null;
}
```

Adjust `get`, one small addition:

```js
function createSignal(initialValue) {
  let value = initialValue;
  let subscribers = new Set(); // Set, not array, more on that shortly

  function get() {
    if (activeEffect) {
      subscribers.add(activeEffect);
    }
    return value;
  }

  function set(newValue) {
    if (newValue === value) return; // skip a no-op write, more on that shortly too
    value = newValue;
    for (const fn of subscribers) {
      fn();
    }
  }

  return { get, set };
}
```

Notice: `subscribe` is gone as its own function you call. Part A still exists, it's just hiding inside `get` now, firing automatically instead of waiting for you to call it. That's the whole trick.

## Part Nine: Running This Line By Line, Nothing Skipped

### The exact sequence of events, in order

```js
const count = createSignal(0);

effect(() => {
  console.log("count is now:", count.get());
});

count.set(1);
count.set(2);
```

Output (verified by actually running this):

```
count is now: 0
count is now: 1
count is now: 2
```

Here is exactly what happens, in order:

1. `createSignal(0)` runs. `value` is `0`, `subscribers` is an empty `Set`, both sealed inside this one closure.
2. `effect(fn)` runs. First line inside: `activeEffect = fn`. As far as the rest of the program is concerned, "the function currently running" is now this one.
3. Still inside `effect`, we call `fn()`. That runs our arrow function, which calls `count.get()`.
4. Inside `get()`, we check `if (activeEffect)`. It's truthy, it's our `fn`. So we add it to `subscribers`. This is Part A, happening without anybody calling `.subscribe()` by hand.
5. `get()` returns `value`, which is `0`. `console.log` prints `count is now: 0`.
6. Back inside `effect`, the last line runs: `activeEffect = null`. Nobody is "currently running" anymore.
7. `count.set(1)` runs. `1 !== 0`, so `value` becomes `1`. The loop runs over `subscribers`, which contains exactly one entry, our effect function. It gets called.
8. That call re-runs `console.log("count is now:", count.get())`. Inside `get()` this time, `activeEffect` is `null` (we're inside `set`'s notify loop calling the function directly, not inside `effect`'s wrapper), so no new subscription happens, it just returns the current value, `1`. Logs `count is now: 1`.
9. `count.set(2)` repeats the same sequence, logs `count is now: 2`.

**Recap, third checkpoint, the most important one: Part A (subscribe) is still exactly what it always was, push a function into a list, it's just triggered automatically by reading the signal instead of being called by hand. Part B (notify) hasn't changed even slightly, it's the same for loop, now living inside `set`. Part C is the new piece: one shared variable remembering who's currently running, so Part A can fire itself.**

Three parts. That's the entire architecture behind every signals-based framework in existence.

## Part Ten: This Is Exactly What Svelte 5 Does Under the Hood

### $state, $derived, $effect, and what "primitive numbers" actually means here

When Svelte 5 shipped runes, the team was direct about the mechanism: reactivity is powered by signals, and they've said outright that this is essentially what Knockout.js was doing back in 2010, more recently popularized by Solid. In Svelte 5, though, signals are never handed to you directly. There's no `createSignal` you import and call yourself. It's a pure internal implementation detail, compiled in behind the scenes.

Here's what that looks like from where you sit, writing a component:

```js
let count = $state(0);

$effect(() => {
  console.log("count is now:", count);
});

count = 1;
count = 2;
```

Reads exactly like our hand-built version. `$state(0)` is our `createSignal(0)`. `$effect` is our `effect`. That's not a coincidence, that's the point of this entire lecture.

Now the part your original question was actually asking about: why primitive numbers specifically are the tricky case. For an object or an array, Svelte's compiler wraps it in a Proxy, which intercepts every property read and write, giving deep reactivity: change a nested field three levels in, and it's tracked automatically. But you cannot wrap a raw number in a Proxy. Try it:

```js
new Proxy(5, {}); // TypeError: Cannot create proxy with a non-object as target
```

A `Proxy` needs an object to sit in front of. A number has no properties to intercept. So for primitive values specifically, reactivity can only happen through **reassignment**, not mutation. There's nothing inside a number to mutate. This is precisely why a signal-style get/set pair is the mechanism for primitives, and precisely why Svelte needs a **compiler**, not just a runtime trick, to make `count = 5` work without you writing `count.set(5)` yourself. The compiler rewrites every read of `count` in your component into a call to the hidden getter, and every write into a call to the hidden setter. You never see the get/set pair. The compiler inserted it for you, at build time, before your code ever runs in a browser.

**Recap: for objects, Svelte proxies property access at runtime. For primitive numbers and strings, there's nothing to proxy, so the compiler quietly rewrites your plain-looking variable into get/set calls instead.** Same signal underneath, two different tricks to make it invisible, depending on what kind of value is being wrapped.

## Part Eleven: If You Know Vue, You've Already Met This Code

### track, trigger, activeEffect: not an analogy, the actual names

If Vue's reactivity system is already in your fingers, you can skip most of the mental translation, because Vue's internals use almost exactly the naming we just built by hand. Vue's own documentation states the contrast directly: Vue's reactivity is runtime-based, tracking and triggering happen while your code is actually running in the browser, and that's precisely why it needs container objects like `ref` in the first place. There's no compiler doing the rewriting for you the way Svelte does it.

Concretely: Vue's reactivity package tracks dependencies with a function commonly called `track`, and re-runs them with a function called `trigger`. The variable holding "whichever effect is currently running" is, genuinely, called `activeEffect`. That's not a simplified version for teaching purposes, that's the actual concept sitting in Vue's source. Our Part A is Vue's `track`. Our Part B is Vue's `trigger`. Our `activeEffect` from Part C shares its exact name with Vue's. A `ref` is a signal that requires `.value` because Vue chose the runtime-Proxy path, not the compiler-rewrite path, for the general case.

One detail worth knowing if you're weighing a move toward Svelte specifically: Vue actually tried Svelte's approach. It was called **Reactivity Transform**, informally "ref sugar," proposed around 2021, and it let you write `let count = $ref(0)`, then just do `count++` directly, no `.value`, compiled away exactly like Svelte does it today. It was marked deprecated in Vue 3.3 and fully removed from core in 3.4. The reasoning, in short: making a plain-looking variable secretly compile into `.value` access was judged too implicit for something meant to stay visible in ordinary code, so `.value` stayed as the explicit, if slightly more verbose, contract. Svelte made the opposite bet: hide it completely, accept the compiler dependency as the cost. Two frameworks, two different decisions, both sitting directly on top of the same signal.

## Streetwise Break Two: The Traps That Get Experienced Developers Too

### Infinite loops, duplicate subscriptions, and the diamond problem

A few things worth knowing before shipping any of this for real. These aren't beginner mistakes, they're the ones that show up in production code written by people who've done this for years.

**The infinite loop trap.** If an effect reads a signal and also writes to that same signal, you get an infinite loop: reading it subscribes the effect, writing it re-runs the effect, which reads it again, subscribes again, writes again, forever. Real implementations guard against this two ways: skipping the notify step entirely when the new value equals the old one (that `if (newValue === value) return;` line earlier wasn't decoration, it's load-bearing), and well-designed effects simply avoiding writing back to signals they read.

**The duplicate subscription trap.** In the auto-tracking version, `get()` can run more than once inside the same effect (an `if`/`else` reading the same signal in both branches, for instance). Push into an array, and the same function gets added twice, meaning it gets called twice per update. That's why `subscribers` became a `Set` the moment auto-tracking was introduced: a `Set` silently ignores a duplicate `add()`, so the same effect never gets registered twice no matter how many times it reads the signal.

**The diamond problem.** Picture a value `total` that depends on both `price` and `quantity`, with something downstream depending on `total`. Change `price`, and without care, `total` can get recalculated more times than necessary, or a downstream effect can run once on a stale intermediate value before the correct one arrives. Production signal libraries solve this with scheduling: batching every change within the same tick and running each effect exactly once at the end, instead of firing immediately and synchronously on every single `set`. Our version fires immediately, which is correct for learning and wrong for a large real app.

None of this changes the architecture. It's still Part A, Part B, Part C. These are the hardening details layered on top once the three basic parts are solid, and now you know exactly where each one attaches.

## Bonus Round: Derived Values Are Just an Effect Writing to Another Signal

### The payoff for having built this properly

One more thing falls out for free once Part C exists: a "derived" or "computed" value is nothing but a signal whose value is kept current by an effect.

```js
function createDerived(computeFn) {
  const signal = createSignal(undefined);
  effect(() => {
    signal.set(computeFn());
  });
  return { get: signal.get };
}

const price = createSignal(10);
const quantity = createSignal(2);
const total = createDerived(() => price.get() * quantity.get());

effect(() => {
  console.log("total is:", total.get());
});

price.set(20);
quantity.set(3);
```

Output (verified by actually running this):

```
total is: 20
total is: 40
total is: 60
```

Read `createDerived` slowly: it creates a plain signal, then wraps an `effect` around the calculation, and every time that effect runs, it writes the result into the signal with `set`. Because `set` calls Part B, anyone reading `total.get()` inside their own effect gets subscribed to it, exactly like reading any other signal. `$derived` in Svelte and `computed` in Vue are both, underneath, this exact shape: an effect that keeps a signal current.

## The Full Working Version, All Three Parts Together

```js
let activeEffect = null; // Part C: who is currently running

function createSignal(initialValue) {
  let value = initialValue;
  let subscribers = new Set(); // Part A's home, deduplicated

  function get() {
    if (activeEffect) subscribers.add(activeEffect); // Part A, automatic
    return value;
  }

  function set(newValue) {
    if (newValue === value) return; // skip no-op writes
    value = newValue;
    for (const fn of subscribers) fn(); // Part B
  }

  return { get, set };
}

function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}
```

That's the whole thing. Twenty lines. Every reactive framework in this lecture is this, plus scheduling, plus batching, plus a compiler in Svelte's case, plus a fair amount of edge-case hardening. The core, the part this lecture was actually about, is these twenty lines.

## The One-Page Cheat Sheet

| Concept | What it actually does | What frameworks call it |
|---|---|---|
| Hidden list | Array or Set living in a closure, holds subscriber functions | subscribers, deps |
| Part A | Push a function into the hidden list | subscribe, track, on, listen |
| Part B | Loop the hidden list, call every function | notify, trigger, emit, publish |
| Part C | Remember who's currently running, auto-subscribe on read | activeEffect (Vue's real name) |
| Signal | One value, wrapped in get + set, set calls Part B | $state (Svelte), ref (Vue), createSignal (Solid) |
| Derived | A signal kept current by an effect that writes to it | $derived (Svelte), computed (Vue) |
| Closure | A function that still remembers variables from where it was created, after that place already finished running | no framework name, it's the language itself |

## Last Word Before You Go

Nothing in this lecture was framework magic. It was an array, a for loop, and one shared variable, wrapped in closures so the pieces couldn't be reached or broken from outside. Svelte hides it behind a compiler. Vue hides it behind `.value` and a Proxy. Solid hands it to you directly and calls it `createSignal`. Same twenty lines, three different names for the same job.

Next time `$state`, `ref`, or `createSignal` looks like it's doing something clever, it isn't being clever. It's doing exactly what you just built, by hand, in this lecture.
