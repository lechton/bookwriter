# T02 — Professor

You are not wrong about the result. Before I change a single word of your argument, let me run your exact doubler, in the vocabulary we already have, and we will watch it print the right answer. A signal `n`, a second signal `nDoubled` to hold the answer, and a watcher that bridges them by recomputing and writing.

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

It works. `6`, then `8`. I concede the output, fully. What I do not concede is the word "same." A watcher and a derived are not two spellings of one tool. They are two different tools that happen to be able to produce the same number in this one small case. That is not a quibble. It is the whole source of the confusion, and it is the same shape of confusion you already flipped once, when you had read and write reversed. So let me put the two jobs side by side.

[slide]

## TWO DIFFERENT JOBS, NEVER SWAP

**THE WATCH (what Svelte 5 calls `$effect`, our `watchEffect`)**
- runs code, for its side effects: printing to the console, touching the DOM, calling a library.
- is push: the moment a dependency changes, the watcher fires.
- does not return a value. It does something.
- you give it a function and you never read a result back out.

**THE DERIVED (what Svelte 5 calls `$derived`, our `makeDerived`)**
- IS a value. It is a function of other values.
- is pull: it recomputes only when somebody reads it.
- has a `read`, and no `write` that you call. You do not set it. It follows from its inputs.
- you read it like any other value, and a number comes back.

[/slide]

Read those two columns as one sentence pair: a watcher runs, a derived returns. A watcher is push, a derived is pull. They never swap.

Now look back at your doubler through this lens. Your watcher is the push half, it fires the instant `n` changes and does the math. Your spare signal `nDoubled` is the value half, the box that holds the answer so something else can read it. You bolted the two jobs together by hand: a watcher to do the math, a signal to be the value. The derived rune is the single tool that removes both of those bolts. It is the value, and it recomputes on read, in one thing.

I have not yet shown you how a derived pulls, meaning how it possibly recomputes only when read and still stays correct. That is the next move, and I can already feel the question forming on your side, because if pull means "do nothing when the input changes," then a purely lazy box should never know its input changed at all. Sit with that contradiction. It is exactly where I want you.
