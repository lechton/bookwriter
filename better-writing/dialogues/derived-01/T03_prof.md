# T03 — Professor

Your hypothesis is exactly right. Word for word, every arrow pointing the correct direction. Keep the whole paragraph, it is the mechanism. The only thing I would tighten is the name: the first read is not a push in disguise, it is a recompute, the same recompute that happens on any later read after a dirty mark. What makes the first read special is not that it pushes anything outward. What makes it special is that it is the moment the derived first raises its own flag, and so the moment its dependencies first learn it exists.

So the architecture has two faces, and you have already named both. Let me show you the code that enforces them, because the code is shorter than the description.

[slide]

## THE PUSH-PULL RULE OF A DERIVED

A dependency changing does two things, in this order, and only these two.

1. PUSH: the derived is marked dirty. It remembers "my answer is stale," and it tells whoever is reading it that they are now stale too. It does not recompute.
2. PULL: nothing recomputes until somebody calls the derived's read. The moment somebody reads, if it is dirty, it recomputes. If it is not dirty, it hands back the cached answer.

Two sentences, one mechanism each: writing a dependency marks a derived dirty. Reading a derived is what actually recomputes it. Never swap.

[/slide]

Before the code, two new plain words, because I refuse to lean on them undefined.

**It (dirty):** a one-bit flag that says "the stored answer may be stale, recompute before returning it."

**It (cached):** the stored answer itself, the last value the function produced, kept around so later reads do not have to redo the work.

[slide]

## A DERIVED IS A WATCHER THAT ALSO CACHES

Same closure. Same flagged_function. Same read-subscribes rule from the last lesson. One new piece of private memory, the dirty flag and the cached value.

```js
let flagged_function = null;   // ✔️ the one shared variable from before, unchanged

function makeSignal(startingValue) {
  let value = startingValue;
  let subscribers = new Set();
  function read() {
    if (flagged_function) subscribers.add(flagged_function); // ✔️ only adds, never runs
    return value;
  }
  function write(newValue) {
    if (newValue === value) return;
    value = newValue;
    for (const fn of [...subscribers]) fn();                 // ✔️ only runs, never adds
  }
  return { read, write };
}

function makeDerived(fn) {
  let dirty = true;          // ✔️ start dirty, so the very first read computes
  let cached;                // ✔️ the last computed answer
  let subscribers = new Set();

  function recompute() {
    const previous = flagged_function; // ✔️ remember who was running, if anyone
    flagged_function = run;            // ✔️ raise the flag on THIS derived's wrapper
    cached = fn();                     // ✔️ reads inside fn now subscribe run
    flagged_function = previous;       // ✔️ restore, never clobber the caller
    dirty = false;
  }

  function run() {                     // ✔️ a dependency just wrote. PUSH moment.
    if (!dirty) {
      dirty = true;                    // ✔️ mark stale, do NOT recompute yet
      for (const s of [...subscribers]) s(); // ✔️ tell whoever reads ME they are stale
    }
  }

  function read() {                    // ✔️ somebody asked for my value. PULL moment.
    if (flagged_function) subscribers.add(flagged_function); // others may depend on me
    if (dirty) recompute();            // ✔️ lazily recompute, only now
    return cached;
  }

  return { read };
}
```

[/slide]

Three things in there look like magic and I am not leaving any of them unexplained, but only two of them are this turn's business. The third I will name and then put a pin in, because you will not feel the problem it solves until the next move.

First, the two functions, run and read. They are not symmetric, and the asymmetry is the whole push-pull split. run is what a dependency calls when it changes, the push moment, and all it does is set the dirty flag and notify. read is what the outside world calls to get a value, the pull moment, and it is the only place recompute happens. Your "watcher face" is run. Your "value face" is read.

Second, makeDerived returns only read. There is no write. You cannot set a derived, because it is not storage, it is a function of its inputs. That is the architectural meaning of "a derived is a value, not a box you fill." In your doubler you needed a write on nDoubled, because you had to fill the box. Here the box fills itself, on read.

The pin, for next turn: the two lines at the top and bottom of recompute, `const previous = flagged_function` and `flagged_function = previous`. Those save and restore whoever was running before the recompute, instead of just lowering the flag to null the way watchEffect does. I am not justifying them yet, because the case that breaks without them has not appeared. I want you to notice they are different from watchEffect, file the question, and let it sit. We will come back to it the moment a derived depends on another derived, which is sooner than you think.

Before that, one proof, because proof is the pedagogy. I refuse to ask you to take the laziness on faith. Here is a derived with a counter inside it that prints how many times the function actually ran.

[slide]

## LAZINESS, PROVEN BY A COUNTER

```js
let recomputeCount = 0;
const price = makeSignal(3);

const total = makeDerived(() => {
  recomputeCount += 1;
  return price.read() * 100;
});

console.log("before any read, recomputeCount:", recomputeCount);
price.write(9);   // dependency changes, but nobody is reading total
price.write(12);
console.log("after two writes with no reader, recomputeCount:", recomputeCount);
console.log("now reading once:", total.read(), "recomputeCount:", recomputeCount);
console.log("reading again (still clean):", total.read(), "recomputeCount:", recomputeCount);
```

Tested, prints:

```
before any read, recomputeCount: 0
after two writes with no reader, recomputeCount: 0
now reading once: 1200 recomputeCount: 1
reading again (still clean): 1200 recomputeCount: 1
```

[/slide]

Walk it line by line. Before any read, recomputeCount is 0, the function has not run once. Then two writes land, 9 and 12, and recomputeCount is still 0, the derived did not lift a finger. Then one read happens, the function runs, the count jumps to 1, we get 1200. Then a second read, the count stays at 1, same 1200 back. The two writes were the push, collapsed into a single dirty bit. The read was the pull that did the math, exactly once.

And one more thing, hidden in that same printout, that I want you to notice because it is the deepest form of the laziness. Before the first read, recompute had never run, which means price.read() had never been called while the flag was up, which means price's subscriber list was empty. So price.write(9) did not just fail to recompute the derived. It had nobody to notify in the first place. The derived did not even know price existed until the first read taught it. Your hypothesis, confirmed from the inside out: the subscription itself is lazy. A derived does not watch its dependencies until somebody first watches the derived.

Say the lifecycle back to me in your own words, the whole loop from first read through a later write, so I know it is solid. And when you do, tell me whether those save-and-restore lines still bug you, or whether you can already see the shape of the case that needs them.
