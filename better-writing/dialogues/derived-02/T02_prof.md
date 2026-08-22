# T02 — Professor

You are right about the output. Before I change a word of your argument, here is your exact doubler in our vocabulary, and it prints the right number. A signal `n`, a spare signal `nDoubled` to hold the answer, and a watcher that recomputes and writes.

[slide]

## YOUR DOUBLER, RUN

```js
const n = makeSignal(3);
let nDoubled = makeSignal(n.read() * 2); // a spare signal, to hold the answer

watchEffect(() => {
  nDoubled.write(n.read() * 2);           // recompute by hand, then write it in
});

watchEffect(() => { console.log("nDoubled is:", nDoubled.read()); });

n.write(4);
```

Tested, prints:

```
nDoubled is: 6
nDoubled is: 8
```

[/slide]

So I concede the number. What I do not concede is the word "same." Your doubler is two tools bolted together: a watcher to do the math, and a spare signal to be the answer. The derived is the single tool that fuses them. The difference is one word each. A watch is **push**: the moment `n` changes, the watcher fires, like a shout. A derived is **pull**: when `n` changes, nothing happens yet, the change is just remembered, like a sticky note left on the desk, and the math only happens later when somebody actually asks for the answer. Push shouts, pull waits. Same number out of this one case, completely different machinery.

Now take pull seriously and you will find the hole yourself. If pull means "do nothing when the input changes," then a purely lazy box never finds out its input changed at all. So how does a derived stay correct? Sit with that. It is exactly where I want you.
