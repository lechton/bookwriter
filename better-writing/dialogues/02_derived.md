# Dialogue 02: The Derived Rune, and Why It Is Not the Watch Rune

A continuation of the observer/subscriber lesson. The student already holds the model from that lesson: a signal is a closure holding one value and its own private list, `read()` subscribes whoever is currently running, `write()` calls everyone already on the list, and a single shared `flagged_function` says who is currently running. Everything below is built as one step from that base.

---

➤ Now, let's talk about the derived values, what is the architecture that is built upon. The derived rune, and the watch rune represent different things. They may seem the same, but are not.

➔ How is that? We can use them both in the same way! For example we can add a watcher that has a function that doubles each time the counter increases? No?

➤ Your doubling example is exactly right in one way, and I want to show you that first before I change anything. What you described actually runs, and it prints the right number. Here it is, in the vocabulary we already have, a signal `n`, a second signal `nDoubled` to hold the answer, and a watcher that recomputes by hand.

[slide]

## YOUR DOUBLER, BUILT WITH A WATCHER

```js
const n = makeSignal(3);
let nDoubled = makeSignal(n.read() * 2); // ✔️ a SEPARATE signal, just to hold the answer

watchEffect(() => {
  nDoubled.write(n.read() * 2);           // ✔️ recompute by hand, then WRITE it into the other signal
});

watchEffect(() => {
  console.log("nDoubled is:", nDoubled.read());
});

n.write(4);
```

Tested, prints:

```
nDoubled is: 6
nDoubled is: 8
```

[/slide]

➤ It works. `6`, then `8`. So you are not wrong about the result. What you are wrong about is the word "same." A watcher and a derived are not two spellings of one tool. They are two different tools that happen to be able to produce the same number in this one small case. Let me put the two jobs side by side, because this is the whole source of the confusion, and it is the same shape of confusion you already flipped once.

[slide]

## TWO DIFFERENT JOBS, NEVER SWAP

**THE WATCH (what Svelte 5 calls `$effect`, our `watchEffect`)**
- runs code, for its side effects: `console.log`, touching the DOM, calling a library.
- is push: the moment a dependency changes, the watcher fires.
- does not return a value. It does something.
- you give it a function and you never read a result back out.

**THE DERIVED (what Svelte 5 calls `$derived`, our `makeDerived`)**
- IS a value. It is a function of other values.
- is pull: it recomputes only when somebody reads it.
- has a `read`, and no `write` that you call. You do not set it. It follows from its inputs.
- you read it like any other value, and a number comes back.

[/slide]

➤ Read those two columns as one sentence pair: a watcher runs, a derived returns. A watcher is push, a derived is pull. They never swap. Your doubler works because you bolted the two jobs together by hand: you used a watcher to do the math, and a second signal to be the value. The derived rune is what removes both of those bolts.

➔ Wait. If a derived does not run when `n` changes, when does it do the doubling?

➤ Good question, and it is the right next one, because it names the exact failure of your version. Your watcher fires the instant `n` changes, whether anyone cares about `nDoubled` or not. That is push. A derived does the opposite, and the opposite has a name you will meet everywhere in reactivity, including in Svelte's own documentation.

**It (push):** when a value changes, it immediately notifies everything that depends on it. The change pushes outward, right now.

**It (pull):** when a value changes, nothing happens yet. The change is only remembered. The actual work happens later, when somebody asks for the result. The reader pulls the value toward it, on demand.

➤ Your watcher is pure push. A derived is push AND pull, split into two moments. That split is the entire architecture of the derived rune, and once you see the two moments you have seen the whole thing. Let me show you the rule first, then the code that enforces it.

[slide]

## THE PUSH-PULL RULE OF A DERIVED

A dependency changing does two things, in this order, and only these two:

1. PUSH: the derived is marked **dirty**. It remembers "my answer is stale," and it tells whoever is reading *it* that they are now stale too. It does not recompute.
2. PULL: nothing recomputes until somebody calls the derived's `read()`. The moment somebody reads, if it is dirty, it recomputes. If it is not dirty, it hands back the cached answer.

Two sentences, one mechanism each: **writing a dependency marks a derived dirty. reading a derived is what actually recomputes it.** Never swap.

[/slide]

➔ So you are saying a derived recomputes only when I read it. But that means if I read it ten times in a row, it recomputes ten times. That is worse than my watcher.

➤ You are ninety percent right, and the ten percent is the single word "cached." A derived does not recompute on every read. It recomputes on the first read after it became dirty, stores the answer, and hands that same stored answer to every later read until the next change. Two new plain words carry the whole mechanism.

**It (dirty):** a one-bit flag that says "the stored answer may be stale, recompute before returning it."

**It (cached):** the stored answer itself, the last value the function produced, kept around so later reads do not have to redo the work.

➤ Read this pair slowly, it is the second rule that never swaps: a read while dirty recomputes and stores. A read while clean returns the stored value and does nothing else. Let me prove both halves actually happen, because the proof is the pedagogy. I put a counter inside the function that prints how many times it actually ran.

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

➤ Walk the output line by line, it is doing exactly what the rule promised. Before any read, `recomputeCount` is `0`. The function has not run once. Then two writes land, `9` and `12`, and `recomputeCount` is still `0`. The derived did not lift a finger. Then one read happens, the function runs, the count jumps to `1`, and we get `1200`. Then a second read, and the count stays at `1`, same `1200` back. That is push and pull made visible: the two writes were the push, remembered as a single dirty bit, and the read was the pull that finally did the math, exactly once.

> TAKEAWAY
> A derived value is not computed when its inputs change. It is computed when it is read, and only if it is dirty. Reading it again while clean costs nothing.

➔ OK, the lazy part I believe now, the printout is undeniable. But here is what I cannot fit together. If the derived only recomputes when I read it, how does it even know that `price` changed? In the signal lesson, a signal learns about a function only because the function called `read()` while the flag was up. Who raises the flag for a derived? Nobody is running a watcher here.

➤ That is the question this whole lesson exists to answer, and you asked it at exactly the right moment, because it is the failure of the lazy design. A purely lazy box would never subscribe to anything, and then it could never be marked dirty, and the whole thing would be dead. So the derived must, at some point, raise the flag itself. Look back at the rule: reading a derived is what recomputes it. Now ask, what is "recomputing it"? It is calling the function, and the function calls `price.read()`. And from the lesson you already hold cold: the only moment a dependency can be discovered is the moment of reading, while the flag is up. So the derived raises the flag right before it calls your function, and lowers it right after. The derived is, internally, just another watcher, one that also remembers the answer.

[slide]

## A DERIVED IS A WATCHER THAT ALSO CACHES

Same closure. Same `flagged_function`. Same `read`-subscribes rule from the last lesson. One new piece of private memory, the `dirty` flag and the `cached` value.

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
    cached = fn();                     // ✔️ reads inside fn now subscribe `run`
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

➤ Three things in there look like magic and I will not leave them unexplained. First, the two functions named `read` and `run`. They are not symmetric, and the asymmetry is the whole push-pull split. `run` is what the signal calls when a dependency changes, the push moment, and all it does is mark dirty and notify. `read` is what the outside world calls to get the value, the pull moment, and it is the only place recompute happens. Second, `makeDerived` returns only `{ read }`. There is no `write`. You cannot set a derived, because it is not storage, it is a function of its inputs. That is the architectural meaning of "a derived is a value, not a box you fill." Third, the two lines `const previous = flagged_function` and `flagged_function = previous` at the ends of `recompute`. Those exist because a derived can be recomputed while something else is already running, which is the next thing you will see. Without saving and restoring, recomputing a derived would wipe out whoever was running it, and the whole chain would silently break.

> TAKEAWAY
> A derived has two faces. `run` is the push face, called by its dependencies: mark dirty, notify, do not compute. `read` is the pull face, called by its readers: compute if dirty, else return the cache.

➔ Let me see if I can say the lifecycle back to you. When I first read `total`, it is dirty, so it recomputes. Recompute raises the flag on `run`, then runs my function, my function calls `price.read()`, and because the flag is up, `price` adds `run` to its own list. Then the flag drops, the answer is cached, dirty goes to false. Later, `price.write(9)` calls everyone in `price`'s list, which now includes `run`, so `run` fires, marks `total` dirty, and stops. The next read of `total` recomputes. Is that it?

➤ That is it, word for word, every arrow pointing the right way. Keep that paragraph, it is the mechanism in full. I want to add exactly one thing you have not yet noticed, because it is hiding in the test you already saw. Go back to the laziness printout. Before any read, `recomputeCount` was `0`, and then `price.write(9)` happened, and the count stayed `0`. We explained that as "the derived was lazy." But there is a stronger fact underneath it. Before the first read, `recompute` had never run, which means `price.read()` had never been called while the flag was up, which means `price`'s subscriber list was empty. So `price.write(9)` did not just fail to recompute the derived. It had nobody to notify in the first place. The derived did not even know `price` existed until the first read taught it.

➔ So the subscription itself is lazy. A derived does not watch its dependencies until somebody first watches the derived.

➤ Exactly. Push-pull is really push-pull-pull. Pull to subscribe, push to mark dirty, pull to recompute. The first pull is the easy one to forget, and it is the one that makes a derived free when nobody uses it.

> TAKEAWAY
> The derived architecture, in three pulls and a push: (1) PULL on first read: recompute runs, raises its own flag, and subscribes to its dependencies through the same read-subscribes rule you already know. (2) PUSH on a dependency write: the derived is marked dirty, and its own readers are marked dirty, nothing recomputes. (3) PULL on a later read: recompute runs only if dirty, stores the answer, and stays clean until the next push.

➔ One more thing is bugging me. You said a derived can be recomputed while something else is already running, and that is why you save and restore the flag. When does that ever happen? A derived only recomputes when it is read, and reading is instant.

➤ The instant it happens is the moment you let a derived depend on another derived, which is not an edge case, it is how any non-trivial screen is built. Say `b` is `a + 1`, and `c` is `b * 10`. `c` reads `b`. When `c` is recomputed, it calls `b.read()`, and if `b` is dirty, that very read triggers `b`'s recompute, right there, in the middle of `c`'s recompute. So `b`'s recompute runs while `c`'s recompute is still on the stack. Each one needs to raise the flag on itself without destroying the other. That is what `previous` and `flagged_function = previous` buy you: a stack of depth one, saved by hand. Let me show it running, because the chain wiring is the load-bearing claim.

[slide]

## A DERIVED OF A DERIVED, CHAINS FOR FREE

```js
const a = makeSignal(2);
const b = makeDerived(() => a.read() + 1);   // b = a + 1
const c = makeDerived(() => b.read() * 10);  // c = (a + 1) * 10

watchEffect(() => {
  console.log("c is:", c.read());
});

a.write(5);   // b becomes 6, c becomes 60
```

Tested, prints:

```
c is: 30
c is: 60
```

[/slide]

➤ Trace the subscriptions, they wire up by themselves with no extra code. On the first read, `c` recomputes, raises its flag, reads `b`, so `b` learns about `c`. `b` recomputes inside that, raises its own flag (saving `c`'s), reads `a`, so `a` learns about `b`. Now write `a` to `5`. `a` notifies `b`'s `run`, which marks `b` dirty and notifies `b`'s readers, which is `c`'s `run`, which marks `c` dirty and notifies `c`'s readers, which is the watcher at the bottom. The watcher reads `c`, `c` is dirty so it recomputes, reads `b`, `b` is dirty so it recomputes, reads the new `a`, gets `6`, hands `6` up to `c`, `c` gets `60`. One write at the leaf, two dirty bits flip on the way down by push, two recomputes happen on the way up by pull. That is the entire reason the save-and-restore lines exist, and the test prints `60`, so the chain holds.

➔ And each derived only recomputes once, even though `a` changed and `a` is two hops away from `c`.

➤ Right, and notice why. The dirty guard does double duty here. When `a` writes, the push goes `a` to `b` to `c`, marking each dirty once. It does not bounce back. When the pull comes, each recompute happens exactly once because after recomputing, the derived is clean again. The same two-cent `if (!dirty)` check that prevented double-work in the laziness test is also what keeps a deep graph from recomputing any node more than once per change. That is the small, honest version of glitch avoidance. The big version, a real batched queue that collects every change in a tick and flushes once, we do not have, and I will be honest about that at the end.

[slide]

## WHERE THIS LIVES IN SVELTE 5

Svelte's runes map onto what you built, almost one for one.

| you built | Svelte 5 rune | what it is |
|---|---|---|
| `makeSignal(0)` | `$state(0)` | a writable reactive value |
| `makeDerived(() => ...)` | `$derived(() => ...)` or `$derived(expression)` | a lazy, cached, read-only value |
| `watchEffect(() => ...)` | `$effect(() => ...)` | a push watcher for side effects |

The Svelte docs describe `$derived` in the exact pull language you just proved: "derived values are not re-evaluated until they are actually read (the 'pull')," and "the derived will be marked dirty and recalculated when it is next read." That is our `dirty` flag and our lazy `read`, in the framework's own words. The docs even call the whole design "push-pull reactivity," the push-pull rule from our slide, named straight.

The docs are equally blunt about when not to use the watch rune. They call `$effect` "something of an escape hatch," useful for analytics and direct DOM work, and they show the exact mistake you opened this lesson with, a watcher writing into a separate piece of state, and the exact fix, `let doubled = $derived(count * 2)`. Your opening question was the documented anti-pattern, and the documented answer is the derived you now understand from the inside.

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);   // ✔️ a value that follows from count, lazily

  function increment() { count += 1; }
</script>

<button onclick={increment}>Increment</button>
<p>Count: {count}</p>
<p>Doubled: {doubled}</p>   <!-- ✔️ reads doubled, which pulls the recompute -->
```

[/slide]

➔ So when do I actually reach for each one? Give me the rule of thumb.

➤ The rule of thumb is one sentence: if the thing you are writing IS an answer, use a derived; if the thing you are writing DOES something, use a watch. A computed total, a filtered list, a formatted date, a flag that says "is this form valid," all of those are answers, they are functions of other values, they go in `$derived`. Logging, fetching, focusing an input, calling a third-party chart library, all of those are actions, they go in `$effect`. The smell that tells you that you picked wrong is the one from your opening example: if you wrote a watcher and then had to invent a second piece of state just to hold what it produced, you wanted a derived. If you wrote a derived and its body reaches out to the world instead of returning a value, you wanted a watch.

> TAKEAWAY
> Use `$derived` when the result IS a value: it follows from other values, you only read it, you never set it. Use `$effect` when the result is an ACTION: it reaches out to the world, and you do not care about a return value. A watcher plus an extra state variable is the signal that you actually wanted a derived.

➔ One last thing. Is a derived always read-only? I thought I saw you could assign to it.

➤ You saw a real thing, and I want to be precise about it because it is easy to get the wrong lesson from it. Before Svelte 5.25, a derived was strictly read-only, you could not assign to it, and that matched the architecture exactly, there is no `write` in `makeDerived`. From 5.25 on, Svelte lets you temporarily reassign a derived, so you can override the computed value for a moment. But notice what does not change: the derived is still a function of its inputs, so the next time its dependencies change and somebody reads it, it recomputes from the function and your override is gone. The temporary assignment is a hatch for specific cases, it is not the model. The model is still: a derived is its function, read-only by nature, and you should reach for `$state` the moment you genuinely want a value you own and set yourself.

➤ Now the honesty-about-scope close, because the model I gave you is clean partly because it is incomplete, and you should know what is missing. Our `makeDerived` has no real batching: if three dependencies change in the same tick, the push notifies three times, deduplicated down to one dirty mark per derived by the `if (!dirty)` check, but not gathered into a single queue the way Svelte and Solid gather them. We do not handle the diamond problem at full strength, the case where one change reaches the same derived through two paths, beyond the dedup our dirty flag gives us for free. We do not skip recomputation when the new computed value is identical to the old one, which Svelte does and calls skipping downstream updates on referential identity. We did not discuss `$derived.by`, which is just `$derived` for the cases where your derivation is too long to be one expression, `In essence, $derived(expression) is equivalent to $derived.by(() => expression)` in the docs' own words. And we treated the derived as single-shot per read, not as a value that many components can read at once, which in a real framework means the dirty mark fans out to a set of readers, exactly the `subscribers` set you saw in `makeDerived`. None of that changes the core. The core is the push-pull split, the dirty flag, the cache, and the fact that a derived is a watcher that raises its own flag and then remembers the answer. Every framework you touch, MobX `computed`, Vue `computed`, Solid `createMemo`, Svelte `$derived`, is this, under a different name.

➔ So the whole derived rune, in one breath: it is a lazy, cached watcher.

➤ That is the sentence to carry away. A derived is a lazy, cached watcher. The watcher half is why it knows when its inputs change, it subscribes to them through the same read-subscribes rule as any effect. The lazy half is why it does no work until somebody reads it. The cached half is why being read many times costs no more than being read once. Three ideas, one mechanism, and it is the mechanism underneath every computed value in modern web frameworks.
