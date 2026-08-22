# 04 | State Is Just A Variable: Reactivity In Svelte Five

*Your code companion to the audio lecture of the same name. When the voice says "look at your booklet," this is the page. Read them together.*

## How To Read This Booklet

- ❒ — a major section. It matches a section of the audio lecture.
- ▶ Block N — a numbered code block. The lecture's "first / second / next" counts these inside a section.
- ★ — the headline block of a section.
- `title="..."` on a code block — the file the code lives in.
- ◆ Source — where the code comes from: a docs file, or marked reconstructed / for comparison.
- 🔑 — the key line, or the move the block turns on.
- ➔ — what to notice, and why it matters.
- ⚙️ — compiler output. The "JS Output" Svelte actually generates.
- ✔️ Works / ✖️ Trap — the right way and the broken way, side by side.
- ⚠️ — a surprise, or a rare-but-real gotcha.

**Sources for this booklet:** `/documentation 2026 June/svelte-docs/02-runes/02-$state.md`

Heads up: blocks marked REACT or VUE (for comparison), and the plain-JavaScript one, are background the lecture talks through. They are not Svelte docs code. The Svelte blocks the lecture points you to start at the counter.

This is lecture four, and it stands on lecture three, the keystone hour. The running world is the same: **The National Times**, at nationaltimes.com. The headline example is the same: the **clap count** on an article card, the little number a reader bumps by tapping the clap button. Every bare snippet in the docs here is the skeleton of something on that news site.

---

## ❒ 4.1 Where We Are, And Why This Hour Matters

No code here, just bearings. Lecture three drew the whole map: boxes inside boxes, the article object, the three directions boxes talk, and a wave at the trio of runes. Now you grab the first and biggest of them, `$state`, exactly where lecture three set you down: on the clap count of an article card. Keep this booklet open.

---

## ❒ 4.2 The One Question Every Framework Is Trying To Answer

Before any framework, you wired the screen by hand. Here's the clap count built the painful way, and why it falls apart the moment a real front page has fifty live numbers on it.

### ▶ Block 1 — The naive clap count, in plain JavaScript

**◆ Source:** reconstructed from the lecture (the pain, not Svelte code)

```js title="counter.js"
let count = 0;
const display = document.getElementById('count');
display.textContent = count;

const button = document.querySelector('button');
button.onclick = () => {
    count++;
    // The card does NOT update on its own.
    // You push the new clap count back into the page by hand, every time:
    display.textContent = count;
};
```

- ➔ **The whole problem, in one place.** `count++` changes a number in memory. The card has no idea. So you reach back in and rewrite the text yourself. One clap count is fine. Now picture the front page: a clap count and a comment count on every card, an unread badge, a most-read strip that reorders. Fifty values, each pushed by hand, each tangled with the others. That tangle is the swamp frameworks were built to drain.

---

## ❒ 4.3 How React Drains The Swamp, And What It Costs You

React's deal: announce every change through a setter, and never touch the value directly. Note the word `useState` — a *hook*, the word lecture three told you to drop the second you cross into Svelte.

### ▶ Block 1 — REACT (for comparison): useState

**◆ Source:** reconstructed from the lecture's comparison (React, not Svelte)

```jsx title="Counter.jsx"
const [count, setCount] = useState(0);

// Never mutate directly. React wouldn't notice.
setCount(count + 1); // not count++
```

- ➔ **A setter for every value, and a rule you can't break.** `useState` hands you the value and a setter. You change the value only through the setter. Forget once, write `count++`, and the clap count freezes while the reader taps and taps. That rule, "never mutate, always call the setter," is the tax React charges.

---

## ❒ 4.4 How Vue Drains The Swamp, And What It Costs You

Vue is more surgical than React, and it's family to Svelte: both fine-grained, both updating the exact spot that changed. The price Vue asks: a `.value` on every touch, and a second tool for objects.

### ▶ Block 1 — VUE (for comparison): ref and reactive

**◆ Source:** reconstructed from the lecture's comparison (Vue, not Svelte)

```js title="Counter.vue"
import { ref, reactive } from 'vue';

const count = ref(0);
count.value++; // the ".value" tax, on every read and write

// A second, separate tool for whole objects:
const user = reactive({ name: 'Ada' });
user.name = 'Grace';
```

- ➔ **Two tools and a tax.** Wrap a value in `ref` and you reach it through `.value` forever, every read, every write. Whole objects need a different tool, `reactive`. Miss a `.value` once and you're poking the wrapper instead of the number.

---

## ❒ 4.5 The Big Idea: State Is Just A Variable

Here's Svelte's answer, and it sounds too simple. State is just a variable. No setter. No `.value`. You change it like any number, and the screen follows. This bare counter is the skeleton of the clap count.

### ★ ▶ Block 1 — The little counter (the very first code block)

**◆ Source:** `02-runes/02-$state.md`

```svelte title="App.svelte"
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

- 🔑 **One line makes it reactive.** `let count = $state(0)` declares state that starts at zero. On a real card, that's the clap count, born at zero claps. That's the whole setup.

- ➔ **Then you just use it.** A reader taps, `count++`, applause recorded. Show it with `{count}` in the markup. No setter, no `.value`. When `count` changes, that spot on the card updates itself.

- ⚠️ **Straight from the docs.** "There is no API for interacting with state. `count` is just a number, and you update it like any other variable."

Three frameworks, three deals, side by side:

| Aspect | React | Vue | Svelte |
|---|---|---|---|
| Change it | `setCount(c + 1)` | `count.value++` | `count++` |
| The tax | a setter per value | `.value` everywhere | none |
| The rule | never mutate | ref vs reactive | just a variable |

---

## ❒ 4.6 How A Plain Variable Can Possibly Update The Screen

How can a plain variable move the screen? One word: signal. The compiler turns your state into a smart box that holds a value and tracks who reads it. You write `count++`. The compiler writes the get, the set, and the "notify everyone" code, invisibly. You're the architect; the compiler pours the concrete.

- ➔ **A rune is a compiler instruction, not a function, and not a React hook.** `$state` does not run at runtime. The compiler reads it and rewrites your plain reads and writes into signal get/set calls. That's why you never import it.

- ⚠️ **Want to see the rewrite?** It's shown later, in "Sharing State Across Files" (the ⚙️ block). Or open the Svelte playground and click the "JS Output" tab.

---

## ❒ 4.7 Deep Reactivity: When Your State Is An Object Or A List

Hand `$state` an object or array and it goes deep. Every level becomes a reactive proxy, all the way down. Picture a draft article's newsroom production checklist: the tasks that must be ticked before it goes live. Reach in, tick one, and only the matching checkbox updates.

### ▶ Block 1 — The to-do list (a deeply reactive proxy)

**◆ Source:** `02-runes/02-$state.md`

```js title="App.svelte"
let todos = $state([
	{
		done: false,
		text: 'add more todos'
	}
]);
```

- 🔑 **Deep by default.** Pass an array or object and you get a deeply reactive proxy. Read this as the checklist: each item a task, with a `done` flag and a `text`. Svelte wraps the list, then wraps every object inside it, recursively, until it hits something that isn't a plain object or array.

### ▶ Block 2 — Ticking a task (flip the done flag)

**◆ Source:** `02-runes/02-$state.md` (acts on `todos` from Block 1)

```js
todos[0].done = !todos[0].done;
```

- ➔ **Reach in and assign. That's it.** Flip one nested property and Svelte updates only the UI tied to that exact property. Not the whole checklist. Not the whole item. Just that one checkbox.

### ▶ Block 3 — Adding a task (push a new item)

**◆ Source:** `02-runes/02-$state.md` (acts on `todos` from Block 1)

```js
todos.push({
	done: false,
	text: 'eat lunch'
});
```

- ➔ **Plain `push` just works.** The proxy sees the push and updates the screen. The new task gets proxied too, so it's reactive the moment it lands. In React, pushing to state is the classic frozen-screen bug. Here it's the obvious code, and it's right.

- ⚠️ **A footnote from the docs.** Updating a proxy doesn't mutate the original object underneath. If you bring your own proxy handlers, wrap the object first, then hand it to `$state`.

---

## ❒ 4.8 The Trap That Catches Everyone: Destructuring

One move breaks reactivity, and everyone hits it. Pull a value out with destructuring and you copy it. The copy is dead. It never updates again.

### ▶ Block 1 — ✖️ Trap: destructuring severs the link

**◆ Source:** `02-runes/02-$state.md` (acts on `todos` from the previous section)

```js
let { done, text } = todos[0];

// this will not affect the value of `done`
todos[0].done = !todos[0].done;
```

- ✖️ **Trap: the copy is frozen.** `let { done, text } = todos[0]` reads the values right now and copies them into plain variables. No live link back to the proxy. Tick the real task later and your `done` copy never hears about it.

- ✔️ **The cure: reach in fresh.** Keep saying `todos[0].done` instead of tearing off a loose `done`. Don't destructure what needs to stay reactive. (This same trap bites in Vue. It's how JavaScript copies values, not a Svelte quirk.)

---

## ❒ 4.9 State Inside Classes

Classes are great for holding data with their methods. Picture a `Draft` class for the newsroom: an article that carries its own data and the methods that act on it. The docs show the seed of that idea, a tiny `Todo`. Yes, a class can hold reactive state. But here's the catch: Svelte makes plain objects reactive automatically, but not classes. With a class, you mark each reactive field yourself.

### ▶ Block 1 — The Todo class: reactive fields, two ways

**◆ Source:** `02-runes/02-$state.md`

```js title="todo.svelte.js"
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset() {
		this.text = '';
		this.done = false;
	}
}
```

- 🔑 **Two spots for the rune. Pick either.** Put it on the field: `done = $state(false)`. Or on the first assignment in the constructor: `this.text = $state(text)`. Both make the property reactive. Mix them freely, like this `Todo` does.

- ➔ **Why bother marking them?** Hand `$state` a plain object or array, and Svelte wraps it automatically. Hand it a class instance, and it does not. Wrapping a whole class could break its methods and private fields. So you opt in, one field at a time.

- ⚠️ **One surprise to pocket.** The compiler turns `done` and `text` into hidden get/set methods. That makes them non-enumerable. Translation: loop over the instance's keys and they won't show up. Rare, but real.

---

## ❒ 4.10 The Other Class Trap: The Word This

A class method has a second trap, and it's pure JavaScript. Pass a method by name to a button and it loses its `this`. Picture a discard button on a draft. Here's how it breaks, and two ways to fix it.

### ▶ Block 1 — ✖️ Trap: passing the method by name

**◆ Source:** `02-runes/02-$state.md`

```svelte title="App.svelte"
<button onclick={todo.reset}>
	reset
</button>
```

- ✖️ **Trap: `this` gets hijacked.** Hand `todo.reset` over bare, and when the click fires, `this` inside `reset` is the `<button>`, not the `todo`. The method runs against the wrong object. The draft never resets.

### ▶ Block 2 — ✔️ Fix one: an inline arrow function

**◆ Source:** `02-runes/02-$state.md`

```svelte title="App.svelte"
<button onclick={() => todo.reset()}>
	reset
</button>
```

- ✔️ **Works: call it through the todo.** Wrap it in an arrow: `() => todo.reset()`. Now you call `reset` on `todo`, so `this` is the todo. Fixed. This is the same shape lecture three taught for events: the markup holds a tiny function, the click calls it.

### ▶ Block 3 — ✔️ Fix two: an arrow-function field

**◆ Source:** `02-runes/02-$state.md`

```js title="todo.svelte.js"
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset = () => {
		this.text = '';
		this.done = false;
	}
}
```

- ✔️ **Works: bind `this` for good.** An arrow function grabs `this` from where it was born, the instance, and never lets go. Now `reset` is safe to pass around bare. Reach for this when the method gets handed off a lot, which, on a tree of boxes passing functions down, is often.

---

## ❒ 4.11 When You Need Reactive Versions Of Built In Tools

`$state` makes objects and arrays reactive. It does not touch `Set`, `Map`, `Date`, or `URL`. Those are special, and the article object wants them all: a `Set` of tags (no duplicates), a `Map` keyed by article id, a `Date` for `published`, a `URL` built from the slug. Svelte ships reactive versions.

### ▶ Block 1 — Reactive Set, Map, Date, URL

**◆ Source:** `02-runes/02-$state.md` names the package (import line reconstructed; the full set gets its own lecture)

```js
import { SvelteSet, SvelteMap, SvelteDate, SvelteURL } from 'svelte/reactivity';
```

- ➔ **Same tools, now reactive.** `Set`, `Map`, `Date`, and `URL` won't react under plain `$state`. Import the reactive twins from `svelte/reactivity` and use them exactly like the originals. Add a tag, the screen updates.

---

## ❒ 4.12 Opting Out On Purpose: The Raw Variant

Sometimes deep reactivity is more than you need. Think of a fully loaded article from your FastAPI server, body and a long comment thread, that you only ever swap whole when the reader opens a different story. `$state.raw` opts out. The deal: you can't mutate it, you can only replace it whole.

### ▶ Block 1 — The raw example (a person)

**◆ Source:** `02-runes/02-$state.md`

```js title="App.svelte"
let person = $state.raw({
	name: 'Heraclitus',
	age: 49
});

// this will have no effect
person.age += 1;

// this will work, because we're creating a new person
person = {
	name: 'Heraclitus',
	age: 50
};
```

- ✖️ **Mutate it and nothing happens.** `person.age += 1` is ignored. Raw state doesn't watch its insides.

- ✔️ **Replace it whole and it works.** Assign a brand-new object to `person` and the screen updates. Raw state listens for one thing: a full swap. Fitting that the docs pick Heraclitus, who said you never step in the same river twice. Raw state is all river-swapping, no stirring.

- ⚠️ **Why bother?** Big objects or arrays you'll never poke at, only swap. Skipping the deep proxy saves the cost. Raw state can still hold reactive state inside (a raw array of reactive objects), and it works on class fields too.

---

## ❒ 4.13 Getting A Plain Object Back Out: The Snapshot Variant

Your state is a proxy. Great inside Svelte, confusing to the outside world, a charting library, a clone function, the console. `$state.snapshot` hands you a plain, static copy to pass along.

### ▶ Block 1 — The snapshot example

**◆ Source:** `02-runes/02-$state.md`

```svelte title="App.svelte"
<script>
	let counter = $state({ count: 0 });

	function onclick() {
		// Will log `{ count: ... }` rather than `Proxy { ... }`
		console.log($state.snapshot(counter));
	}
</script>
```

- ➔ **Strip the proxy, keep the data.** `$state.snapshot(counter)` returns a plain copy, no proxy attached. Perfect for handing an article to an outside tool like `structuredClone`, which chokes on a proxy.

- ⚠️ **Edge case.** If the value has a `toJSON` method, the snapshot clones what `toJSON` returns instead.

---

## ❒ 4.14 A Brief Word On The Eager Variant

Usually Svelte coordinates when the screen updates, and that's better. But once in a while you want a change shown instantly, like the section nav lighting up the link the reader just clicked while the next page loads. That's `$state.eager`.

### ▶ Block 1 — The navigation bar example

**◆ Source:** `02-runes/02-$state.md`

```svelte title="App.svelte"
<nav>
	<a href="/" aria-current={$state.eager(pathname) === '/' ? 'page' : null}>home</a>
	<a href="/about" aria-current={$state.eager(pathname) === '/about' ? 'page' : null}>about</a>
</nav>
```

- ➔ **Instant feedback, on purpose.** `$state.eager(value)` shows a change the moment it happens, skipping the usual coordination. On The National Times, that's the section bar, World, Politics, Sports, marking the clicked link active before the page arrives.

- ⚠️ **Use it sparingly.** Only for feedback to a user action. The rest of the time, let Svelte time the updates. (It matters most when an `await` is in play, the async world from lecture three; full picture in the effects and runtime lectures.)

---

## ❒ 4.15 Passing State Into Functions: The Pass By Value Catch

JavaScript passes values, not variables. Hand a util the clap count and it gets a frozen copy, not a live wire. Here's the catch, and the fix.

### ▶ Block 1 — The simple add example (pass by value)

**◆ Source:** `02-runes/02-$state.md`

```js title="index.js"
/**
 * @param {number} a
 * @param {number} b
 */
function add(a, b) {
	return a + b;
}

let a = 1;
let b = 2;
let total = add(a, b);
console.log(total); // 3

a = 3;
b = 4;
console.log(total); // still 3!
```

- ✖️ **`total` is stuck at 3.** `add` got the values `1` and `2` at call time, added them, returned `3`. Later you change `a` and `b`, but `total` is just a frozen number. No link back.

### ▶ Block 2 — The second add example (pass functions)

**◆ Source:** `02-runes/02-$state.md`

```js title="index.js"
/**
 * @param {() => number} getA
 * @param {() => number} getB
 */
function add(getA, getB) {
	return () => getA() + getB();
}

let a = 1;
let b = 2;
let total = add(() => a, () => b);
console.log(total()); // 3

a = 3;
b = 4;
console.log(total()); // 7
```

- ✔️ **Pass functions, keep the link.** Hand over `() => a` instead of `a`. A function fetches the value fresh on every call. Now `total()` sees the current numbers and returns `7`.

### ▶ Block 3 — State is no different

**◆ Source:** `02-runes/02-$state.md`

```js
let a = $state(1);
let b = $state(2);
```

- ➔ **Same rule, same fix.** Reference `$state` and you get its current value, a plain number at that instant. Pass-by-value applies. So pass functions when you need the live clap count across a boundary.

### ▶ Block 4 — "Functions" is broad: getter properties too

**◆ Source:** `02-runes/02-$state.md`

```js title="index.js"
/**
 * @param {{ a: number, b: number }} input
 */
function add(input) {
	return {
		get value() {
			return input.a + input.b;
		}
	};
}

let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3

input.a = 3;
input.b = 4;
console.log(total.value); // 7
```

- ➔ **Getters count as functions too.** So do a proxy's get/set. Pass the reactive `input` object and read `total.value` fresh each time. Writing a lot of this by hand? Reach for a class instead, the `Draft` from a few sections back.

---

## ❒ 4.16 Sharing State Across Files: The Export Catch

This is the sideways direction from lecture three, made real. You put the logged-in reader in a `session.svelte.js` (or `.svelte.ts`) module and share it everywhere. One rule: don't export state you also reassign. Here's why it breaks, and two clean ways around it.

### ▶ Block 1 — ✖️ Trap: exporting reassigned state

**◆ Source:** `02-runes/02-$state.md`

```js title="state.svelte.js"
export let count = $state(0);

export function increment() {
	count += 1;
}
```

- ✖️ **Trap: not allowed.** Export state and reassign it in the same module, and Svelte stops you. The next block shows exactly why.

### ▶ Block 2 — ⚙️ Compiler emits: why it breaks across files

**◆ Source:** `02-runes/02-$state.md`

```js title="state.svelte.js (compiler output)"
export let count = $.state(0);

export function increment() {
	$.set(count, $.get(count) + 1);
}
```

- ⚙️ **What the compiler actually writes.** Every read becomes `$.get(count)`, every write `$.set(...)`. This is the "JS Output." Fine inside one file. But the compiler only sees one file at a time. Import `count` somewhere else and that file never gets the get/set rewrite.

- ⚠️ **See it yourself.** The "JS Output" tab in the playground shows this for any component.

### ▶ Block 3 — The leak, made visible

**◆ Source:** `02-runes/02-$state.md`

```js title="index.js"
import { count } from './state.svelte.js';

console.log(typeof count); // 'object', not 'number'
```

- ➔ **The importing file expected a number.** It got the raw signal object instead, because it never saw the rewrite. That mismatch is the whole reason the pattern is banned.

### ▶ Block 4 — ✔️ Solution one: export an object, change a property

**◆ Source:** `02-runes/02-$state.md`

```js title="state.svelte.js"
// This is allowed — since we're updating
// `counter.count` rather than `counter`,
// Svelte doesn't wrap it in `$.state`
export const counter = $state({
	count: 0
});

export function increment() {
	counter.count += 1;
}
```

- ✔️ **Works: mutate, don't reassign.** You update `counter.count`, never reassign `counter`. No reassignment to rewrite, so it crosses files cleanly. This is exactly how `session` wants to be built: export the object, set `session.reader` on login, never reassign `session`. The proxy keeps it reactive everywhere, masthead greeting and deep comment form alike.

### ▶ Block 5 — ✔️ Solution two: keep state private, export functions

**◆ Source:** `02-runes/02-$state.md`

```js title="state.svelte.js"
let count = $state(0);

export function getCount() {
	return count;
}

export function increment() {
	count += 1;
}
```

- ✔️ **Works: state stays home.** `count` never leaves the module, so every read and write stays in the one file the compiler can rewrite. Other files go through `getCount` and `increment`, the safe door through the wall. For `session`, that's `getReader`, `logIn`, `logOut`.

---

## ❒ 4.17 The Full Recap, Start To Finish

No new code. Flip back through the blocks while it's fresh: the clap count, the draft checklist, the two traps, the variants, the cross-file rules. One thread ties them together. State is just a variable, because the compiler does the wiring you never see.

The four flavors of `$state`, one place to compare them:

| Flavor | What it does | Reach for it when |
|---|---|---|
| `$state` | deep reactive proxy | the default, almost always |
| `$state.raw` | no deep reactivity; replace whole | big data you only swap |
| `$state.snapshot` | plain static copy | handing state to an outside tool |
| `$state.eager` | shows the change instantly | instant feedback on a user action |

And where this rune sits on lecture three's reading map, with the next two:

| In The National Times | Rune | Lecture |
|---|---|---|
| The clap count | `$state` | 4 (here) |
| "5 min read", formatted count | `$derived` | 5 |
| Autosave, live ticker | `$effect` | 6 |
