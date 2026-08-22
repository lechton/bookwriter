# A Tree of Thinking: Derived Values in Svelte 5

A knowledge tree for `$derived`, built as a path a mind actually walks. Read the top-level branches in order. Each is a question, not a topic. Definitions get their own bullet, expanded patiently, but only at the moment the reader would feel the need for them. Misconceptions sit beside the truth they distort, not in a separate bin.

The whole tree rests on one assumption: you already hold the model from the observer/subscriber lesson. A signal is a closure holding one value and its own private list. Reading a signal is the moment it learns about you. Writing a signal is the moment everyone who learned about it gets called. A single shared flag says who is currently running. If any of that is shaky, the rest of this tree will not hold, and the right move is to go back, not forward.

---

## What is a derived value, in one sentence before any mechanism

A derived value is a value that is not stored directly, but computed from other values, and that stays in sync with them automatically.

That is the whole idea, before any machinery. You do not type the number in. The number is produced, by a formula, from other numbers, and it updates on its own when those other numbers change. The canonical mental picture is a spreadsheet cell. If cell C3 holds `=A1+A2`, you never type into C3. You type into A1 and A2, and C3 shows the right number, always, without you doing anything to it. A derived value in Svelte is that spreadsheet cell, inside your code.

- **It (a derived value):** a value that is not stored, but produced from other values by a function, and kept correct automatically when those other values change.

Notice the three load-bearing words in that definition, because the rest of the tree unpacks each one. *Produced* (not stored): this is what makes a derived different from a signal, and it is the source of the first major misconception below. *By a function*: the production is code you write. *Kept correct automatically*: this is the part that feels like magic, and the entire middle of the tree exists to show that it is not magic, it is the same signal machinery arranged differently.

---

## Why does it exist: what problem does a derived solve that a signal cannot

A signal holds a value you set. It does not hold a value that follows from other values. If you want a value that is "always twice count," a signal cannot give you that on its own, because a signal only knows what you write into it, and writing into it does not make it track anything.

So you have two choices, and only one of them is honest. The dishonest choice is to fake it: keep a signal, and every time `count` changes, manually recompute twice `count` and write it into that signal. This works. It prints the right number. We will look at it carefully in a moment, because it is the single most common thing people do before they learn the derived rune, and understanding why it is wrong is the fastest way to understand what a derived actually is. The honest choice is to declare the relationship once, "this value is twice count," and let the system keep it correct. That declaration is `$derived`.

- **It (the problem a derived solves):** you want a value that follows from other values by a rule, not a value you set by hand. A signal cannot express "follows from," it can only express "is." A derived exists to express the "follows from."

---

## The dishonest choice, examined carefully: the spare-signal-and-a-watcher pattern

Here is the pattern, in the vocabulary of the signal lesson. You want `nDoubled`. You make a signal `n`, you make a second signal `nDoubled` to hold the answer, and you run a watcher that, every time `n` changes, recomputes `n * 2` and writes it into `nDoubled`.

- This works. It prints the right number. Tested, it prints `6` then `8` as `n` goes from `3` to `4`. Do not dismiss it as broken, because it is not broken. It is the natural thing every developer reaches for first.
- It is wrong, but not because the output is wrong. It is wrong because you have bolted two jobs together by hand. The watcher's job is to react when something changes. The spare signal's job is to be the answer. You are using the watcher to do the math and the spare signal to be the value, gluing them with a manual write. That manual write is the smell. Every time you change `n`, you have to remember to also recompute and write `nDoubled`. The relationship "nDoubled is twice n" is not declared anywhere. It is smeared across two pieces of code that have to be kept in sync by discipline.

- **It (the smell that tells you this pattern is wrong):** you invented a second piece of state, and a watcher, purely to keep that second piece of state in sync with the first. The sync is the whole point of a derived. If you are manually syncing state, you are doing the derived's job by hand.

---

## The honest choice: a derived is the single tool that fuses the two jobs

A derived is one thing that is both the relationship and the value. You declare the relationship once: `let nDoubled = $derived(n * 2)`. There is no spare signal. There is no watcher. There is no manual write. The relationship lives in one line, and the system takes responsibility for keeping `nDoubled` correct when `n` changes.

- **It (a derived, restated against the dishonest pattern):** a derived is the single tool that replaces the spare-signal-plus-watcher pair. It is the value AND the relationship, fused. You declare the rule once, and the rule keeps the value correct.

This is the moment to plant the central distinction the rest of the tree depends on. A watcher and a derived are not two spellings of one tool. They are two different tools that happen to produce the same number in small cases.

- A watcher (Svelte's `$effect`, our `watchEffect`) runs code for its side effects, things like printing, touching the DOM, calling a library. It does something. It does not return a value.
- A derived (Svelte's `$derived`, our `makeDerived`) IS a value. It is a function of other values. It returns a number. You read it.

If the thing you are writing is an answer, use a derived. If the thing you are writing is an action, use a watcher. The spare-signal pattern fails this test: the answer (nDoubled) was smuggled into a spare signal, and the action (recompute and write) was a watcher. A derived is what you reach for when the answer is the point.

---

## How does it actually work: the push and the pull

This is the heart of the tree. Everything above is framing. Everything below is mechanism. The mechanism has two halves, and most explanations merge them into one and confuse the reader. They are not the same half. They have names.

### The two halves, named before they are explained

- **It (push):** when a value changes, it immediately notifies everything that depends on it. The change pushes outward, right now.
- **It (pull):** when a value changes, nothing happens yet. The change is only remembered. The work happens later, when somebody asks for the result.

Push and pull are opposites, and a real derived uses both, at different moments. Most of the confusion around derived values comes from believing a derived is pure pull. It is not. It cannot be, and the next branch exists to prove that.

### Misconception: a derived is pure pull, and that is the whole story

This is the most common wrong model, and it is worth a dedicated node because it is so nearly right. The pull half is real. When `n` changes, the derived does not recompute. That part is true. The wrong inference is "therefore nothing happens at all when n changes." Something does happen. A single bit gets flipped. That bit is the bridge between push and pull, and it has a name, and the name deserves its own bullet because it is the most badly-explained word in all of reactivity.

---

## The word "dirty," explained properly, because it is almost always explained badly

The word "dirty" is the single worst-named concept in reactivity, and it carries baggage from a completely different mechanism (Angular's "dirty checking"), so it needs more than a one-line definition. Spend a moment here.

### What dirty is NOT, to clear the baggage first

If you have heard "dirty" before, you probably heard it in the phrase "dirty checking," which is what Angular 1 did. Angular's dirty checking is a completely different mechanism: on every digest cycle, Angular walks a list of every watched value and compares each one to its previous value, over and over, until nothing changes. That is expensive, that is coarse, and that is not what we are talking about. If "dirty" in your head means "a loop that compares everything to everything," delete that association now. It will actively mislead you.

### What dirty actually is, in this tree

- **It (the dirty flag):** a single boolean, attached to a derived, that means one thing and one thing only: "the stored answer might be stale, so recompute before returning it." That is the entire definition. It is not a loop. It is not a comparison. It is one bit, true or false, and its only job is to be checked at the moment of reading.

The picture that makes it stick. Imagine a fridge. On the fridge is a sticky note. The sticky note says "milk might be off, check before you use it." The sticky note does not check the milk. The sticky note does not pour the milk down the sink. The sticky note does nothing active at all. It just sits there and says: when you reach for the milk, check it first. That sticky note is the dirty flag. It is a reminder, not an action.

When `n` changes, the derived does not recompute. It flips the sticky note to "check." That is the entire push half. A change pushes exactly one thing outward: a single bit flip on every derived that depends on the changed value. No math. No recompute. Just "you might be stale now."

### Why is it called dirty, then, if it is just a stale-flag

Honestly, because of history. The word comes from database and compiler terminology, where a "dirty" page or cache line is one that has been modified but not yet written back, meaning the stored version is out of date relative to the source. "Dirty" in that lineage just means "modified, therefore possibly inconsistent with the source of truth." The reactivity community borrowed the word for the same idea: the cached answer is "dirty" because the source it was computed from has changed, so the cache is no longer guaranteed correct. If the word were coined today it would probably be called "stale." But it was not coined today, so we say dirty, and now you know it just means "stale, needs checking," and you can stop picturing Angular.

---

## The word "cached," and why the dirty flag has nothing to do without it

Dirty only makes sense if there is something to be stale relative to. That something is the cache.

- **It (the cache):** the stored answer. The last value the function produced. Kept around so that later reads do not have to redo the work.

Back to the fridge. The dirty sticky note says "check the milk." The milk in the fridge is the cache: yesterday's answer, sitting there, available for reuse. If the note is clean (no sticky note, or the note says "fresh"), you just use the milk that is there. You do not go buy new milk. You do not recompute. You read the cache. If the note is dirty, you check, which means you recompute, which means you go get fresh milk and put it in the fridge, replacing the old cache with the new one, and you remove the sticky note because the milk is now fresh again.

The dirty flag and the cache are a pair. Neither means anything alone. The cache is the saved answer. The dirty flag is whether that saved answer can still be trusted. A read checks the flag. If clean, return the cache as-is. If dirty, recompute, replace the cache, clear the flag.

### Misconception: a derived recomputes on every read

This is the natural fear the moment you hear "lazy." If it only recomputes on read, surely it recomputes on every read? No. It recomputes only on the first read after a change. Subsequent reads, while still clean, return the cache for free. The proof of this is concrete and worth seeing.

- Tested: a derived with a counter inside it that increments every time the function runs. Two writes to the dependency, no reads: counter stays at 0. One read: counter jumps to 1, returns the answer. Second read immediately after: counter stays at 1, same answer returned. The second read did zero work. It read the cache.
- **It (laziness, made precise):** a derived recomputes only when it is both dirty AND read. Dirty alone is not enough, it just waits. Read alone is not enough, it just returns the cache. Both must be true. This is why a derived that nobody reads costs nothing, even if its inputs change a thousand times.

---

## How does the derived know its inputs at all: the first read is special

Here is the question that the push-pull story leaves dangling, and it is the question every honest reader asks. If a derived is lazy, and only acts when read, how does it ever learn which signals are its inputs? By the rule from the signal lesson, a signal only learns about a function when that function reads it while the shared flag is up. So for a derived to subscribe to its inputs, the derived must, at some moment, raise the flag on itself and call its own function. When?

The answer is: on the first read. The first read is the one moment the derived acts on its own, and it does four things in one go.

1. It raises the shared flag, pointing at itself.
2. It runs the function. Because the flag is up, every signal the function reads adds the derived to its list. That is the subscription.
3. It stores the result as the cache.
4. It lowers the flag and marks itself clean.

After that first read, the derived is wired in. Its inputs know about it. Future changes to those inputs will flip its dirty flag (the push half). Future reads will recompute only if dirty (the pull half). But before that first read, the derived is subscribed to nothing. A write to an input before the first read has nobody to notify.

- **It (the first read):** the single moment a derived subscribes to its inputs. Before it, the derived is connected to nothing. After it, the derived is part of the graph.
- **Misconception:** "a derived watches its inputs from the moment it is declared." No. It does not watch anything until the first read. Declaration is inert. Subscription happens lazily, on first read. This is a stronger form of laziness than people expect: even the wiring is lazy.

---

## The full lifecycle, said once, end to end

Putting the halves together. You declare `let total = $derived(price * 100)`. Nothing happens. The derived is inert, subscribed to nothing, dirty by default (so the first read will compute). Somebody reads `total`. The first read raises the flag, runs `price * 100`, which reads `price`, which adds the derived to `price`'s list. The result is cached, the flag lowered, the derived marked clean. Returns the value.

Later, `price` changes. `price` notifies everyone in its list, which now includes the derived. The derived does not recompute. It flips its own dirty flag to true, and notifies anyone who depends on it (more on that in the next branch). Done. No math happened.

Later still, somebody reads `total` again. The derived checks its dirty flag. It is true. So it raises the flag, runs `price * 100` again (which re-confirms the subscription, harmlessly), caches the new result, clears the dirty flag, lowers the flag. Returns the new value.

A third read, immediately, with no change in between: dirty is false. Returns the cache. Zero work.

- **It (the lifecycle, as a rule of three moments):** moment one, the first read, subscribes. Moment two, every write to an input, marks dirty. Moment three, every later read, recomputes if dirty else returns the cache. That is the entire machine.

---

## The surprise: a derived is also a producer, not just a consumer

This is the node most tutorials skip, and skipping it is why people cannot build mental models of derived-of-derived chains. A derived does not only subscribe to its inputs. Other things can subscribe to the derived.

Go back to the signal lesson. A signal has a list of subscribers, functions that read it while the flag was up. A derived has the same list, for the same reason, populated by the same rule. When some other running function reads the derived while the flag is up, that function gets added to the derived's own subscriber list. So a derived sits in the middle of a chain: upstream, it subscribes to its inputs through its first read. Downstream, other things subscribe to it through their reads of it.

- **It (a derived as a node in a graph):** a derived is both a consumer (it reads its inputs, so it is in their subscriber lists) and a producer (other things read it, so they are in its subscriber list). This is what allows derived values to depend on derived values, indefinitely.

When an input changes, the push does not stop at the first derived. It propagates. The input notifies the derived, the derived marks itself dirty and notifies its own subscribers, those mark themselves dirty and notify theirs, and so on, until the edge of the graph. Then, when somebody reads the leaf, the pull walks back up, recomputing each dirty derived in order. Push outward to mark dirty, pull inward to recompute.

---

## When do you use a derived: the rule of thumb

After all the mechanism, the practical question. When do you reach for `$derived` versus `$effect` versus a plain `$state`.

- **Use `$derived` when the result IS a value.** The thing you are writing is an answer that follows from other values. A computed total. A filtered list. A formatted date. A flag that says "is this form valid." You only read it. You never set it. It is a function of its inputs.
- **Use `$effect` when the result is an ACTION.** The thing you are writing reaches out to the world and does something. Logging. Fetching. Focusing an input. Calling a third-party library. You do not care about a return value. You care that the side effect happens.
- **Use `$state` when you genuinely own the value.** The thing you are writing is a source of truth that you set yourself, not one that follows from anything. A counter the user increments. A text field's contents. A checkbox state.

The Svelte documentation is blunt about this. It calls `$effect` "something of an escape hatch," and it explicitly shows the spare-signal-and-watcher anti-pattern (the dishonest choice from earlier in this tree) being replaced by a single `$derived` line. If you wrote a watcher and then had to invent a spare signal just to hold what it produced, you wanted a derived. If you wrote a derived and its body reaches out to the world instead of returning a value, you wanted a watcher.

### Misconception: use `$effect` to keep one piece of state in sync with another

This is the single most common mistake, and the docs warn against it directly. You have `count`, you want `doubled`, so you write `$effect(() => { doubled = count * 2 })` with `doubled` as a spare `$state`. It works. It is wrong. The relationship is not declared, it is enforced by a side effect, and the moment the code gets more complex you will have a pile of effects manually syncing state that should have been derived relationships. The rule: if you are syncing state, you almost always wanted a derived.

---

## What traps you: the honest list of things this tree does not cover

A knowledge tree that pretends to be complete is lying, and the lie makes the reader distrust the true parts. So here, explicitly, is what the simple model above omits. Each of these is a real concern in production Svelte, and each is a reason the framework's actual implementation is more sophisticated than the `makeDerived` we have been imagining.

- **Batching.** In the simple model, three changes to three inputs in the same tick fire three separate push waves. A real framework gathers every change in a tick into a queue and flushes once, so the push is one wave, not three. The dirty flag dedups within a single derived (you cannot be marked dirty twice), but it does not dedup across the whole graph in one tick. Batching does.
- **The diamond problem.** When one change reaches the same derived through two paths (A depends on B and C, both of which depend on the changed value), a naive system recomputes A twice. Real frameworks solve this with a topological sort on the pull, so each derived recomputes exactly once per wave, even in a diamond.
- **Glitch-free updates.** Closely related to the diamond: the guarantee that no intermediate, inconsistent state is ever observed during a wave of updates. The simple model gets this for free in most cases because pull is lazy, but the full guarantee requires the batching and the topological sort above.
- **Referential identity skipping.** Svelte specifically skips downstream updates when a derived recomputes to a value that is referentially identical to its previous value (`===`). If your derived returns the same array reference, or the same primitive, nothing downstream recomputes, even though the dirty flag flipped. This is an optimization, not a correctness issue, but it surprises people who return fresh objects from a derived and wonder why downstream updates fire.
- **`$derived.by` for non-trivial bodies.** `$derived(expression)` is for a single expression. When your derivation needs intermediate variables, a loop, or more than one statement, you use `$derived.by(() => { ... })`. In the Svelte docs' own words, `$derived(expression)` is equivalent to `$derived.by(() => expression)`. It is the same mechanism, just a different shape for when the body outgrows an expression.
- **Temporary reassignment of a derived (Svelte 5.25+).** Before 5.25, a derived was strictly read-only. From 5.25, you can temporarily reassign it. The key word is temporarily: the next time its inputs change and it is read, it recomputes from the function, and your override is gone. This is an escape hatch for specific cases, not a change to the model. The model is still: a derived is its function.

---

## The one-sentence version, to carry away

A derived is a lazy, cached watcher. The watcher half is why it knows when its inputs change: it subscribes to them, on the first read, through the same read-while-flagged rule as any effect. The lazy half is why it does no work until somebody reads it: writes only flip a dirty bit. The cached half is why being read many times costs no more than being read once: clean reads return the stored answer. Three ideas, one mechanism, and it is the mechanism underneath every computed value in modern web frameworks, from MobX's `computed` to Vue's `computed` to Solid's `createMemo` to Svelte's `$derived`, each under a different name.
