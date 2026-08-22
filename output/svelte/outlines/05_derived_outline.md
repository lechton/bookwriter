# 05 | Computed Values Without Cache Bugs: The Derived Rune

*Your code companion to the audio lecture of the same name. When the voice says "look at your booklet," this is the page. Read them together.*

## How To Read This Booklet

- ❒ — a major section. Its number (4.1, 4.2, ...) matches the audio lecture's section number exactly.
- ▶ Block N — a numbered code block. The lecture's "first / second / next" counts these inside a section.
- ★ — the headline block of a section.
- `title="..."` on a code block — the file the code lives in.
- ◆ Source — where the code comes from: a docs file, or marked reconstructed / for comparison.
- 🔑 — the key line, or the move the block turns on.
- ➔ — what to notice, and why it matters.
- ✔️ Works / ✖️ Trap — the right way and the broken way.
- ⚠️ — a surprise, or a rare-but-real gotcha.

**Sources for this booklet:** `/documentation 2026 June/svelte-docs/02-runes/03-$derived.md`

Heads up: blocks marked REACT or VUE (for comparison), and the plain-illustration ones, are background the lecture talks through, not Svelte docs code. The Svelte source blocks the lecture points you to start at the doubled counter (4.5).

---

## ❒ 5.1 Where We Are, And The Rune That Stands On State

No code here, just bearings. `$state` is your source of truth. Today's rune, `$derived`, is the value computed *from* it, kept correct forever, with no cache bugs. Next rune: `$effect`. Keep this booklet open.

---

## ❒ 5.2 The Real Problem: A Value That Lives Off Other Values

A computed value is a cache. Keep it by hand and you get one of three things: staleness, waste, or the bug-prone chore of refreshing it in every place its inputs move. Phil Karlton's joke: the two hard things in computer science are cache invalidation and naming things. This is the first one.

### ▶ Block 1 — The naive total that goes stale

**◆ Source:** reconstructed from the lecture (the pain, not docs code)

```svelte title="Cart.svelte"
<script>
	let items = $state([ /* ...prices... */ ]);

	// Computed once, at creation. Then frozen.
	let total = 0;
	for (const item of items) total += item.price;
</script>

<p>Total: {total}</p>
```

- ✖️ **Computed once, frozen forever.** The loop runs at creation — a component's code runs once — so `total` is a snapshot. Add an item and `total` is stale. This is exactly the bug `$derived` exists to kill.

---

## ❒ 5.3 How React Answers It, And The Cache Bug In The Bargain

React's fix is `useMemo`, with a dependency array you write and maintain by hand. That array *is* the cache bug, waiting to happen.

### ▶ Block 1 — REACT (for comparison): useMemo and the dependency array

**◆ Source:** reconstructed from the lecture's comparison (React, not Svelte)

```jsx title="Counter.jsx"
const doubled = useMemo(() => count * 2, [count]);
// the [count] at the end is the dependency array — you keep it in sync by hand
```

- ➔ **You list the dependencies yourself.** `useMemo` caches the result and recomputes only when something in `[count]` changes. Miss a dependency and the value silently goes stale.

### ▶ Block 2 — REACT (for comparison): the cache bug in the flesh

**◆ Source:** reconstructed from the lecture's comparison (React, not Svelte)

```jsx title="SearchList.jsx"
const filtered = useMemo(
  () => list.filter(item => item.includes(search)),
  [list] // ✖️ forgot `search` — the filter never updates when the user types
);
```

- ✖️ **The bug, made concrete.** The filter reads `search`, but the array only lists `list`. Type in the box and nothing filters: React checks its array, sees `list` unchanged, and hands back the stale cache. React ships an `exhaustive-deps` linter precisely because this happens constantly.

---

## ❒ 5.4 How Vue Answers It, And How Close It Comes

Vue gets close. `computed` tracks its dependencies automatically, no array. The catch is the old one: `.value` on every read, and it's a runtime library.

### ▶ Block 1 — VUE (for comparison): computed

**◆ Source:** reconstructed from the lecture's comparison (Vue, not Svelte)

```js title="Counter.vue"
import { computed } from 'vue';

const doubled = computed(() => count.value * 2); // auto-tracked, no array

console.log(doubled.value); // ...but you read it through .value
```

- ➔ **Auto-tracked, no array.** Vue watches what the function reads, so it discovers the dependencies for you. Much closer to Svelte. But you still read it through `.value`, and all the tracking ships to every visitor at runtime.

---

## ❒ 5.5 The Derived Rune: You Just Write The Expression

Svelte's answer: write the expression. That is the whole thing.

### ★ ▶ Block 1 — The doubled counter (the lecture's first code block)

**◆ Source:** `02-runes/03-$derived.md`

```svelte title="App.svelte"
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{doubled}
</button>

<p>{count} doubled is {doubled}</p>
```

- 🔑 **One line, a living formula.** `let doubled = $derived(count * 2)`. Not a value computed once — a relationship the compiler keeps true forever. Change `count`, and `doubled` follows.

- ➔ **No array. No `.value`. No manual recompute.** The cache bug from the React section cannot happen here, because there is no array to get wrong.

- ⚠️ **Straight from the docs.** A component's code runs only once at creation, so without `$derived`, `doubled` would keep its original value even when `count` changes.

- ➔ **On a class too.** As with `$state`, you can mark a class field `$derived`.

---

## ❒ 5.6 No Dependency Array, Ever: How The Compiler Finds Your Dependencies

How does it know the dependencies with no array? It's a compiler — it reads your expression and sees. Anything read synchronously inside is a tracked dependency.

### ▶ Block 1 — The same filter, as a derived (no bug possible)

**◆ Source:** reconstructed from the lecture (the payoff of the React bug above)

```svelte title="SearchList.svelte"
<script>
	let list = $state([ /* ... */ ]);
	let search = $state('');

	// You read `search` here, so it is tracked automatically.
	let filtered = $derived(list.filter(item => item.includes(search)));
</script>
```

- ✔️ **The React bug is unwriteable here.** You read `search` in the expression, so it's a dependency, automatically. There is no array to put it in, and so none to forget it from. That is what "without cache bugs" means, concretely.

### ▶ Block 2 — Tracking reaches past an await (advanced)

**◆ Source:** `02-runes/03-$derived.md`

```js
let total = $derived(await a + b);
```

- ⚠️ **Advanced edge, named and deferred.** State read *after* an `await` inside the expression is tracked too. This touches the async features covered in a later lecture. (To exempt a value from being a dependency, use `untrack`.)

---

## ❒ 5.7 When One Line Is Not Enough: The Derived By Form

One expression too small for the job? Use `$derived.by` and hand it a whole function.

### ▶ Block 1 — A loop inside a derived (the lecture's second code block)

**◆ Source:** `02-runes/03-$derived.md`

```svelte title="App.svelte"
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) {
			total += n;
		}
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

- 🔑 **A function body, when one line won't fit.** `$derived.by(() => { ... })` runs the function to get the value. `$derived(expr)` is just shorthand for `$derived.by(() => expr)`.

- ➔ **Same tracking, either way.** The loop reads `numbers`, so `numbers` is a dependency. Push to it and `total` refreshes itself.

---

## ❒ 5.8 Lazy On Purpose: Push, Pull, And The Update That Never Happens

When does a derived recompute? Push-pull. Change state and everything that depends on it is marked dirty instantly (the push). But nothing recomputes until something reads it (the pull). And if the new value equals the old, downstream stays perfectly still.

### ▶ Block 1 — The update that never happens

**◆ Source:** `02-runes/03-$derived.md`

```svelte title="App.svelte"
<script>
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>
	{large}
</button>
```

- 🔑 **Recompute to the same answer, and nothing moves.** `large` is `count > 10`. Click nine times: `large` stays `false`, so the screen tied to it never repaints. The tenth click flips it to `true`, and it updates once.

- ➔ **Caching the consequences, not just the work.** A noisy input feeding a rarely-changing derived produces no downstream work until the answer truly moves. You get that for free.

### ▶ Block 2 — Stack them fearlessly (chaining)

**◆ Source:** reconstructed from the lecture (layered deriveds)

```svelte title="Cart.svelte"
<script>
	let items = $state([ /* ... */ ]);

	let subtotal = $derived.by(() => items.reduce((sum, i) => sum + i.price, 0));
	let tax      = $derived(subtotal * 0.2);
	let total    = $derived(subtotal + tax);
</script>
```

- ➔ **A deep chain is the efficient way to build.** A derived can read another derived. Change an item and the dirty mark pushes down the whole chain at once; the pull recomputes lazily, and the identity check guards every link. Layers of small, pure formulas — correct and cheap, all the way down.

---

## ❒ 5.9 A Happy Surprise: Destructuring A Derived Is Safe

The exact opposite of the `$state` trap. Destructure a derived and every piece stays reactive.

### ▶ Block 1 — Destructuring keeps reactivity

**◆ Source:** `02-runes/03-$derived.md` (`stuff()` returns an object with `a`, `b`, `c`)

```js
let { a, b, c } = $derived(stuff());
```

- ✔️ **Safe, unlike `$state`.** All three stay reactive. (Destructuring `$state` severed reactivity in Lecture 4 — this does not.)

### ▶ Block 2 — Why it's safe (what Svelte does under the hood)

**◆ Source:** `02-runes/03-$derived.md`

```js
let _stuff = $derived(stuff());
let a = $derived(_stuff.a);
let b = $derived(_stuff.b);
let c = $derived(_stuff.c);
```

- ➔ **Three small deriveds, not three dead copies.** Svelte rebuilds the destructuring as one derived per property, each with its own living relationship to the source. That is why each one stays current.

---

## ❒ 5.10 Deriveds Are Left As They Are, Not Wrapped

Unlike `$state`, a derived isn't wrapped in a new proxy. It hands back the real thing.

### ▶ Block 1 — A live window onto reactive state

**◆ Source:** `02-runes/03-$derived.md`

```js title="App.svelte"
let items = $state([ /*...*/ ]);

let index = $state(0);
let selected = $derived(items[index]);
```

- 🔑 **Not a copy — the actual item.** `selected` is the very object inside the reactive `items` array. Change a property of `selected` (or `bind:` to it) and the underlying item updates, because it was never copied.

- ⚠️ **Only works because `items` is deeply reactive.** If `items` weren't a `$state` proxy underneath, mutating `selected` would do nothing.

---

## ❒ 5.11 Bending The Rule For Optimistic UI: Overriding A Derived

One sanctioned rule-break: reassign a derived temporarily, for instant feedback ahead of a slow server.

### ▶ Block 1 — Optimistic UI

**◆ Source:** `02-runes/03-$derived.md`

```svelte title="LikeButton.svelte"
<script>
	let { post, like } = $props();

	let likes = $derived(post.likes);

	async function onclick() {
		// increment the `likes` count immediately...
		likes += 1;

		// and tell the server, which will eventually update `post`
		try {
			await like();
		} catch {
			// failed! roll back the change
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```

- 🔑 **Bump now, reconcile later.** `likes += 1` immediately for instant feedback, then call the server, then roll back (`likes -= 1`) on failure. When `post` actually updates, the formula reasserts itself and takes over again.

- ⚠️ **Recent power, and the exception not the rule.** Before Svelte 5.25, deriveds were read-only. Use this override only for optimistic feedback; almost every derived you write is a pure formula you never touch by hand.

---

## ❒ 5.12 The One Firm Rule: Keep The Expression Pure

One firm rule: the expression must be pure. Read state, return a value, change nothing else.

### ▶ Block 1 — ✖️ The compiler stops you

**◆ Source:** reconstructed from the lecture (illustrating the rule)

```js
// ✖️ Not allowed — Svelte disallows state changes inside a derived.
let doubled = $derived(count++);
```

- ✖️ **No side effects inside.** A state change like `count++` in a derived is disallowed, by the compiler. Why: a derived runs lazily — zero times, or many, at moments you don't control — so a side effect there would fire chaotically.

- ➔ **Need a side effect? That's `$effect`.** The urge to *do* something inside a derived means you want an effect, not a value. That is the next lecture.

---

## ❒ 5.13 The Full Recap, And The Road To Effects

No new code. Flip back through the derived blocks while they're warm: the doubled counter, the `$derived.by` total, the lazy `large`. State holds the truth, derived computes pure values from it, effect (next) touches the world. You describe what a value *is*, once, and a compiler that read your description keeps it true, fresh, and cheap — computed values, genuinely without cache bugs.
