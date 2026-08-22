# Read Subscribes, Write Notifies: Untangling Part C

You had one thing backwards, and it's the whole source of the confusion. You wrote: "the moment we set something to a signal it intercepts by adding to a list." It's the opposite. Reading a signal is what adds to the list. Writing a signal is what calls everyone already on the list.

Read subscribes. Write notifies. That's the whole fix. Everything else you wrote is either already correct, or one small step away from correct. Let's go slow through all of it.

## What you already have exactly right

Your closure description is correct, word for word: "A closure is a function that returns a function. The returned function has private memory, it remembers it every time we call it." That's exactly what happens. Nothing to fix there, keep that sentence, it's the correct foundation for everything below.

## The READ moment (this is the one you were missing)

You asked "the moment you write this variable happens what" twice, but the piece you actually trailed off on was read: "And when we read..." Let's finish that sentence properly. Here's `get`, on its own, nothing else around it:

```js
function get() {
  if (activeEffect) {
    subscribers.add(activeEffect);
  }
  return value;
}
```

The moment you read a signal, by calling `.get()`, exactly this happens: check one single variable, `activeEffect`. Is it currently pointing at a function, or is it `null`? If it's pointing at a function, that function gets added to this signal's own subscribers list. Then, no matter what, return the value.

That's the entire read path. Reading is the moment subscribing happens. Not writing.

## The WRITE moment

```js
function set(newValue) {
  if (newValue === value) return;
  value = newValue;
  for (const fn of subscribers) fn();
}
```

The moment you write a signal, by calling `.set()`, exactly this happens: check whether the new value is actually different from the old one. If it's the same, stop, do nothing else. If it's different, update the stored value, then loop over the subscribers list, the one that reading already built up earlier, and call every single function sitting in it.

That's the entire write path. Writing is the moment notifying happens. Never subscribing.

Say it back to yourself once: **read adds to the list, write calls the list.** Two different operations, two different jobs, and they never swap.

## How signal and effect actually talk to each other

Here's the part that was probably the real wall. `get` lives inside `createSignal`. `effect` is a completely separate function, defined somewhere else entirely. How do two functions that were never introduced to each other manage to cooperate?

They share exactly one variable. That's the entire answer.

```js
let activeEffect = null;
```

This line sits outside both of them, in the surrounding scope. `get` and `effect` are both closures, a function that keeps access to variables from where it was created. Both of them were defined in a place that can see `activeEffect`. So both of them can read it and write it, forever, the same way `increment` could always reach `total` in the closures section earlier.

`effect` is the only one that ever writes to `activeEffect`. It sets it right before running your function, and clears it right after.

`get` is the only one that ever reads `activeEffect`. It never sets it. It only checks it.

So the entire cooperation between signal and effect is this: `effect` changes the shared variable to point at itself, right before it runs your code, and changes it back to `null` right after. `get` only ever checks that same shared variable, it never changes it. No function call happens directly between `effect` and `get`. No import, no method call, nothing. One shared variable. One side writes it. One side reads it.

## Watching it happen, printed out in order

Here's the exact same code, with a print statement added at every step, so you can watch read and write actually diverge instead of taking it on faith. This was run, not just written, so the output below is real.

```js
let activeEffect = null;

function createSignal(initialValue, name) {
  let value = initialValue;
  let subscribers = new Set();

  function get() {
    console.log(`[${name}] READ happened. Is someone active right now? ->`, activeEffect ? "YES, add them" : "no, plain read");
    if (activeEffect) {
      subscribers.add(activeEffect);
    }
    return value;
  }

  function set(newValue) {
    console.log(`[${name}] WRITE happened. New value ->`, newValue);
    if (newValue === value) return;
    value = newValue;
    console.log(`[${name}] now calling ${subscribers.size} subscriber(s)`);
    for (const fn of subscribers) fn();
  }

  return { get, set };
}

function effect(fn) {
  console.log("--- effect() starting: activeEffect is now THIS function ---");
  activeEffect = fn;
  fn();
  activeEffect = null;
  console.log("--- effect() finished: activeEffect is back to null ---\n");
}

const count = createSignal(0, "count");

effect(() => {
  console.log("   inside effect body, about to read count...");
  console.log("   count is:", count.get());
});

console.log(">>> calling count.set(1) now, from OUTSIDE any effect");
count.set(1);
```

Output:

```
--- effect() starting: activeEffect is now THIS function ---
   inside effect body, about to read count...
[count] READ happened. Is someone active right now? -> YES, add them
   count is: 0
--- effect() finished: activeEffect is back to null ---

>>> calling count.set(1) now, from OUTSIDE any effect
[count] WRITE happened. New value -> 1
[count] now calling 1 subscriber(s)
   inside effect body, about to read count...
[count] READ happened. Is someone active right now? -> no, plain read
   count is: 1
```

Read this against the code, one line of output at a time:

- `effect()` starts. It sets `activeEffect` to the function you gave it. Nothing has been read or written yet.
- Your effect body runs, and it calls `count.get()`. That's a READ. `get` checks `activeEffect`, finds it's not null, so it adds the effect to `count`'s own subscribers. This is the exact moment subscribing happens, and notice: `set` has not been called even once yet.
- `effect()` finishes, clears `activeEffect` back to `null`.
- `count.set(1)` runs. That's a WRITE. It updates the value, then loops the subscribers list and calls the one function sitting in it, your effect body.
- Your effect body runs again, calls `count.get()` again. That's a READ again, but this time `activeEffect` is `null`, because we're not inside `effect()`'s wrapper anymore, we're inside `set()`'s loop, calling the function directly. So nothing gets added, it's just a normal read, and it returns `1`.

That last point is worth sitting with: the same `get()` function behaves differently depending on whether `activeEffect` happens to be set at that exact moment. Not because `get` is smart, but because it always checks the same one shared variable, and that variable's value changes depending on where in the program you currently are.

## Fixing the two small slips in your version

**Slip one:** "we create a pattern where closures are added dynamically in a list." It's not new closures being added. Nobody creates a fresh closure during a read. The exact same effect function, the one you already wrote once when you called `effect(...)`, gets added to the list. One function reference, reused, never a new one built on the fly.

**Slip two:** "life is too short to write closures again and again." Creating a new signal, meaning a new `createSignal()` call, meaning a new closure, is cheap, and is not the tedious part. You do that once per reactive variable, and that is completely fine, do it as many times as you need. The tedious part that Part C actually removes is having to manually call `.subscribe()` yourself to connect each effect to each signal it depends on. That manual wiring is the busywork that disappears. The closures themselves were never the problem.

One more precision worth adding, since it clears up a lot: the subscribers list is not global or shared. Every signal has its own private subscribers list, built fresh inside its own `createSignal()` call, same as it always had its own private `value`. The only thing that is shared across every signal in the whole program is `activeEffect`, one flag, sitting outside all of them, watched by every `get`, changed only by `effect`.

## Say it back one more time, your way, corrected

A closure is a function that remembers private memory every time you call it. Super cool, still completely true. We create one new closure, one new signal, for every reactive variable we need, and that part is cheap, we don't try to avoid it. What we do avoid is manually subscribing every effect to every signal by hand.

Instead: the moment we read a signal, it adds whichever effect is currently active to its own private list. The moment we write a signal, it calls everyone already sitting on that list. Read subscribes. Write notifies. `activeEffect` is the one variable both sides can see, because both `get` and `effect` are closures defined somewhere that can reach it.

That's the whole thing you were missing.
