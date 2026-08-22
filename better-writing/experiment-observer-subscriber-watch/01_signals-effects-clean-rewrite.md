# Signals and Effects: The Observer Pattern, Rewritten Clean

## The Problem

Without running a function, nothing happens. A variable can change all it wants, nobody notices. So we need to keep a list of functions that must run again whenever their dependencies change. That list, and the discipline of running everyone on it at the right moment, is the entire mechanism that adds reactivity to our code. When a reactive state variable changes, every function that depends on it runs again. Nothing more than that is happening in Svelte, Vue, Solid, or React underneath.

## The Classic Answer: Keep a List, Call Everyone Later

This isn't new. It's the Observer pattern, decades old: keep a list of functions, call them all later. `button.addEventListener("click", fn)` is this pattern already: `fn` goes into a hidden list, and the browser calls everyone in that list when you click. Reactive frameworks apply the exact same idea to state instead of clicks.

## Why a Plain List Needs Private Memory

The hidden list above has to live somewhere nobody outside can reach in and break it. That somewhere is a closure: a function that keeps private memory of the variables from where it was created, and hands that memory to whatever it returns. That's how we hide a list of functions inside a signal without exposing it directly.

## The Signal: One Value, One Private List

A Signal is a box holding exactly one value, plus a private list of every function that has ever asked for that value while it mattered. It gives you two doors in: `read()` to get the value, `write()` to change it.

```js
function makeSignal(startingValue) {
  let value = startingValue;
  let subscribers = [];

  function read() {
    // more on this in a moment
    return value;
  }

  function write(newValue) {
    value = newValue;
    for (const fn of subscribers) {
      fn();
    }
  }

  return { read, write };
}
```

`write()` is already complete: update the value, then run everyone already sitting in `subscribers`. `read()` is missing one thing, the part that actually puts names into that list in the first place. That's next.

## flagged_function: the one variable everything shares

**It (flagged_function): the single global variable, shared by every Signal and every effect in the whole program, that holds whichever function is currently running, or nothing at all if no function is currently running.**

```js
let flagged_function = null;
```

This line lives outside every Signal, in scope everyone can reach. Nobody flags themselves. Something else has to raise this flag on their behalf, right before they run, and lower it right after. That something is next.

## watchEffect: flag, run, unflag

**It (watchEffect): the function you call to say "run this now, and make sure it runs again automatically whenever any Signal it reads changes."**

```js
function watchEffect(fn) {
  flagged_function = fn; // 1. raise the flag
  fn();                  // 2. run it, right now, once
  flagged_function = null; // 3. lower the flag
}
```

Three steps, always in this order. `watchEffect` never looks inside `fn`. It doesn't know or care what `fn` does, whether it reads zero Signals or ten. Its only job is raising the flag, running the function once, lowering the flag. All the actual bookkeeping happens somewhere else entirely, inside the Signal.

## How read() and write() Actually Use the Flag

Here's the missing piece from `read()`:

```js
function read() {
  if (flagged_function) {
    subscribers.push(flagged_function);
  }
  return value;
}
```

Two rules, and they never swap:

- **`read()` checks the flag, and only adds.** If `flagged_function` currently points at something, that something gets pushed into this Signal's own `subscribers`. `read()` never runs anything. It only remembers.
- **`write()` never checks the flag, and only runs.** It loops `subscribers`, calling every function already there, unconditionally. By the time `write()` runs, `flagged_function` is back to `null` anyway, nothing is inside a `watchEffect` wrapper at that moment.

Reading is the only moment a dependency can be discovered, because reading is the only place the connection between a function and a value is ever visible in the code. Writing is the only moment that dependency gets acted on.

## The Whole Thing, Assembled

```js
let flagged_function = null;

function makeSignal(startingValue) {
  let value = startingValue;
  let subscribers = [];

  function read() {
    if (flagged_function) {
      subscribers.push(flagged_function);
    }
    return value;
  }

  function write(newValue) {
    value = newValue;
    for (const fn of subscribers) {
      fn();
    }
  }

  return { read, write };
}

function watchEffect(fn) {
  flagged_function = fn;
  fn();
  flagged_function = null;
}
```

Fifteen lines. This is the complete mechanism. Everything below is this code, used, then extended.

## Watching It Work

```js
const fruitCount = makeSignal(5);

watchEffect(() => {
  console.log("fruits left to eat today:", fruitCount.read());
});

fruitCount.write(3);
fruitCount.write(0);
```

Tested, prints:

```
fruits left to eat today: 5
fruits left to eat today: 3
fruits left to eat today: 0
```

`watchEffect` raises the flag, runs the function, which calls `fruitCount.read()`. The flag is up, so this function joins `fruitCount`'s subscribers. The flag drops. Later, every `fruitCount.write(...)` finds that one name still in the list and calls it again, printing the new number, with no further help from you.

## Why Subscription Is Selective, With No Filter Anywhere

```js
const waterCount = makeSignal(2);

watchEffect(() => {
  console.log("only reading fruitCount:", fruitCount.read());
});

waterCount.write(9); // this effect never called waterCount.read()
fruitCount.write(1); // this effect DID call fruitCount.read()
```

Tested, prints:

```
only reading fruitCount: 0
only reading fruitCount: 1
```

`waterCount.write(9)` produces nothing. Not because of a check anywhere in the code, there isn't one. `fruitCount` and `waterCount` are two separate calls to `makeSignal`, each with its own private `subscribers`, sealed in its own closure. This effect never called `waterCount.read()`, so it is structurally impossible for `waterCount`'s list to ever contain it. Selectivity isn't a rule the code enforces on purpose. It falls out for free from each Signal only ever learning about functions that call its own `read()`.

## Beyond Primitives: Signal Versus Proxy

A Signal wraps one primitive value because there is no other way to intercept a bare variable in JavaScript, `count = 5` triggers nothing on its own. `read()` and `write()` are the only hook available.

An object is different: JavaScript gives you `Proxy`, with a `get` trap and a `set` trap that fire automatically on any property access, no explicit function calls required. The logic is identical, flag, check on read, run on write, only the interception mechanism changes. One real difference: an object can have many properties, so a reactive object needs one subscriber list per key, not one for the whole object, because different effects may care about different properties of the same thing.

## Where This Lives in Real Frameworks

Svelte's `$state(0)` is `makeSignal(0)`. Svelte's `$effect` is `watchEffect`. The only real difference: Svelte's compiler hides `read()` and `write()` behind what looks like a plain variable, rewriting every use of it at build time, because primitives give it no other choice.

Vue's naming maps almost one to one: `track` is our `read()`'s subscribing behavior, `trigger` is our `write()`'s notifying behavior, and Vue's own internal variable holding whichever effect is currently running is, genuinely, called `activeEffect`, the same concept as `flagged_function` under a different name. Vue's `ref()` needs `.value` because it tracks changes at runtime with a Proxy, not at compile time the way Svelte does.

## The Whole Architecture, in One Paragraph

Without running a function, nothing happens, so we keep a list of functions that need to run again when their dependencies change. A Signal is a closure holding one value and its own private version of that list. `flagged_function` is the one shared variable that says who is currently running. `watchEffect` raises that flag, runs your function once, and lowers it. While the flag is up, reading a Signal adds the running function to that Signal's own list, this is the only moment the dependency can be discovered. Writing a Signal ignores the flag entirely and simply calls everyone already on its list. That is the complete Observer/Subscriber architecture, and every reactive framework you will ever use is this, under a different name.
