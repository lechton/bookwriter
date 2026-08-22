# T03 — Professor

Your hypothesis is right, and I want to confirm it before I add anything. The first read is the special moment. On the first read, the derived raises its own flag, runs your function, and because the flag is up while your function calls `price.read()`, `price` adds the derived to its list. That is the subscription, done once, on first read. After that, the derived plays lazy. Two new words carry the rest, and they are one mental picture, not three things to memorize. Picture a fridge. There is a sticky note on it that says "milk might be off, check before you use it," and there is yesterday's meal sitting there. The sticky note is the **dirty** flag: it does not check the milk, it just says "check." Yesterday's meal is the **cached** answer: the last result, kept for reuse. And the act of cooking a fresh meal is **recompute**: running your function again to produce a new answer. Now the whole lifecycle: when `price` changes, the derived does not recompute, it just flips the sticky note to dirty. When somebody reads the derived, it checks the note. If dirty, it recomputes, stores the fresh answer as the new cache, and flips the note back to clean. If not dirty, it just hands back yesterday's meal. Here is the proof that this is actually what happens.

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
price.write(9);   // input changes, nobody is reading total
price.write(12);
console.log("after two writes, no reader:", recomputeCount);
console.log("first read:", total.read(), "recomputeCount:", recomputeCount);
console.log("second read:", total.read(), "recomputeCount:", recomputeCount);
```

Tested, prints:

```
before any read, recomputeCount: 0
after two writes, no reader: 0
first read: 1200 recomputeCount: 1
second read: 1200 recomputeCount: 1
```

[/slide]

Two writes landed, the count stayed at zero. The derived did nothing. One read, the count jumped to one, we got 1200. Second read, the count stayed at one, same 1200 back. The writes only flipped the sticky note. The read is what did the cooking, exactly once.
