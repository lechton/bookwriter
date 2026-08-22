# T04 — Professor

Both confirmations, and you are ahead of me on the second one, which is exactly where I wanted you.

Yes, the subscribers point. A derived is not only a consumer, it is also a producer. The first line of read, `if (flagged_function) subscribers.add(flagged_function)`, is the same line as in a signal's read, doing the same job: whoever is currently running and reads this thing gets added to its private list, so that when this thing changes, that whoever gets called back. A signal changes when you write it. A derived changes when it gets marked dirty and then recomputes to a new value. From the outside, from the perspective of the thing reading, there is no difference. You read it, you get subscribed. That is why a derived has the same subscribers Set as a signal. It is the chain you described: upstream it subscribes to its inputs through recompute, downstream other things subscribe to it through read. A derived is a node in the middle, and that is the entire shape of a reactivity graph.

And yes, the save-and-restore. Your hypothesis is correct, and the case is the one you named: a derived that depends on another derived. Let me make it concrete and run it, because you asked to see it, and seeing it is the point.

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

Trace the wiring on the first read, because the save-and-restore earns its keep right there. The watcher runs, flagged_function points at the watcher's run. The watcher reads c. c's read sees the flag, adds the watcher to c's subscribers. c is dirty, so c's read calls c's recompute. c's recompute saves previous (the watcher's run), sets flagged_function to c's run, calls c's function. c's function reads b. b's read sees the flag (now c's run), adds c's run to b's subscribers. b is dirty, so b's read calls b's recompute. b's recompute saves previous (c's run), sets flagged_function to b's run, calls b's function. b's function reads a. a's read sees the flag (now b's run), adds b's run to a's subscribers. a returns 2. b's function returns 3. b's recompute caches 3, restores flagged_function to c's run, sets b clean. b's read returns 3. c's function returns 30. c's recompute caches 30, restores flagged_function to the watcher's run, sets c clean. c's read returns 30. The watcher prints 30.

Do you see it? Three nested recomputes, three flag-raises, three restores, each one handing the flag back to whoever had it a moment before. If any of those had nulled the flag instead of restoring it, the chain would have broken at that exact depth. If b's recompute had set flagged_function to null at the end, then when control returned to c's function, c's subsequent reads (if it had any beyond b) would have happened with the flag down, and nothing would have subscribed c to them. The save-and-restore is what lets recomputes nest without trampling each other. It is a stack of depth one, saved by hand at each level, which is enough because only one recompute is ever active at a time, they just nest.

Now write a to 5. a notifies b's run. b's run marks b dirty and notifies b's subscribers, which is c's run. c's run marks c dirty and notifies c's subscribers, which is the watcher's run. The watcher's run fires, reads c. c is dirty, recompute, reads b. b is dirty, recompute, reads a (gets 5), returns 6, caches 6, clean. c's function gets 6, returns 60, caches 60, clean. Watcher prints 60.

One write at the leaf, two dirty bits flip on the way down by push, two recomputes happen on the way up by pull, each exactly once. And here is the small honesty point I want to fold in: the reason each node recomputes exactly once, even though a's change ripples through two hops, is the `if (!dirty)` guard in run. When the push goes a to b to c, each gets marked dirty once and notified once. When the pull comes back up, each recompute clears its own dirty flag, so even if something tried to recompute it again in the same wave, the guard would say "already clean, nothing to do." That guard is doing double duty: it is the laziness in the write path (do not recompute on push), and it is the dedup in the read path (do not recompute twice in one wave). That is the small, honest version of what real frameworks call glitch avoidance. The big version, a real batched queue that collects every change in a tick and flushes once, we do not have. I will be straight with you about that at the end of the whole thing.

So: save-and-restore is for nesting, which is forced the moment a derived depends on a derived, which is forced the moment you build anything non-trivial, because a filtered list depends on a sorted list depends on a raw list, and a formatted total depends on a sum depends of line items, and on and on. Chains are not an edge case. They are the default shape of a real screen.

You now have the whole mechanism. A derived is a lazy, cached watcher. The watcher half is run, which subscribes to its inputs through the same read-while-flagged rule as any effect, on the first read. The lazy half is the dirty flag, which lets writes pass through without computing. The cached half is the stored answer, which lets later reads cost nothing. Three ideas, one mechanism.

Next, if you want it, is where this lives in Svelte 5, the actual runes, and the one rule of thumb for when to reach for a derived versus a watch. Or, if you would rather sit here first, ask me anything about the chain. I would rather you not move on until the nesting is solid, because nesting is where everyone quietly loses the thread.
