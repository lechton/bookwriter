# 02 | One Component, One File: The Anatomy Of A .svelte File, And The Runes That Live Inside It

*Your code companion to the audio lecture of the same name. When the voice says "look at your booklet," this is the page. Read them together.*

## How To Read This Booklet

- ❒ — a major section. It matches a section of the audio lecture.
- ▶ Block N — a numbered code block. The lecture's "first / second / next" counts these inside a section.
- `title="..."` on a code block — the file the code lives in.
- ◆ Source — where the code comes from: a docs file, or marked reconstructed / for comparison.
- 🔑 — the key line, or the move the block turns on.
- ➔ — what to notice, and why it matters.
- ⚠️ — a surprise, or a rare-but-real gotcha.

**Sources for this booklet:** `/documentation 2026 June/svelte-docs/01-introduction/03-svelte-files.md`, `.../04-svelte-js-files.md`, and `.../02-runes/01-what-are-runes.md`

Heads up: blocks marked VUE or REACT (for comparison) are background the lecture talks through, not Svelte docs code.

---

## ❒ 2.1 Where We Are: From The Why To The What

No code yet, just bearings. Lecture one was the why and the how: Svelte is a compiler, here's how to run it. Today is the what. We crack open the `.svelte` file, zone by zone, then meet the runes as a family. Keep this booklet open.

---

## ❒ 2.2 The Pain Of The Scattered Component, And The Idea Of One File

A button needs three things: logic, structure, and looks. For decades those lived in three separate files, stitched together by fragile shared class names. Svelte's fix is blunt: one component, one file, everything together. Vue did this first with its `.vue` Single File Component. React went the other way and pulled the markup *into* the JavaScript with JSX. Three directions, one goal.

---

## ❒ 2.3 The Three Zones: A Guided Tour Of The Skeleton

Here's the file, in outline. Three zones, all optional: script on top, markup in the middle, style at the bottom. It's built on a superset of HTML, so any plain HTML you already know just works. Below it, the same idea in Vue and React for contrast.

### ▶ Block 1 — The .svelte skeleton (every zone a file can have)

**◆ Source:** `01-introduction/03-svelte-files.md`

```svelte title="MyComponent.svelte"
<script module>
	// module-level logic goes here
	// (you will rarely use this)
</script>

<script>
	// instance-level logic goes here
</script>

<!-- markup (zero or more items) goes here -->

<style>
	/* styles go here */
</style>
```

- 🔑 **Three zones, all optional.** `<script>` for logic, markup for structure, `<style>` for looks. Use one, two, or all three. A file with nothing but markup is a complete, valid component.

- ➔ **A superset of HTML.** Paste plain HTML straight in and it works, untouched. The plain word `class` is just `class`. Your HTML instincts carry straight over.

- ⚠️ **Two script tags?** Yes. `<script module>` runs once for the whole file; plain `<script>` runs for each copy. The next two sections pull them apart.

### ▶ Block 2 — VUE (for comparison): the Single File Component

**◆ Source:** reconstructed from the lecture's comparison (Vue, not Svelte)

```vue title="MyComponent.vue"
<template>
  <!-- markup goes here -->
</template>

<script setup>
  // logic goes here
</script>

<style scoped>
  /* styles go here */
</style>
```

- ➔ **Svelte's close cousin.** Same idea, different tags. One note for later: Vue's `scoped` is opt-in. Svelte scopes by default.

### ▶ Block 3 — REACT (for comparison): markup pulled into the JavaScript

**◆ Source:** reconstructed from the lecture's comparison (React, not Svelte)

```jsx title="MyComponent.jsx"
function MyComponent() {
  // logic goes here
  return (
    <button className="btn">click me</button> // "className", not "class"
  );
}
```

- ➔ **It looks like HTML but it's JavaScript.** JSX has tells: `className` instead of `class`, and one required root element. Svelte goes the other way, HTML first.

---

## ❒ 2.4 The Instance Script: A Setup That Runs Once For Every Copy

Look back at the plain `<script>` zone in the skeleton (Block 1). Two ideas live there. One: every top-level variable is automatically visible to the markup, no wiring needed. Two, the big one: the instance script runs *once*, when the component is created, then never again. Contrast React, where the component function re-runs top to bottom on every single change. Svelte runs once because the compiler already wired up the updates. (Modern Vue's `<script setup>` runs once too. Here React is the odd one out.)

---

## ❒ 2.5 The Module Script: One Brain Shared By Every Copy

The other script tag. `<script module>` runs once for the whole file, shared by every copy. Watch a single counter count the instances.

### ▶ Block 1 — A shared counter across every copy

**◆ Source:** `01-introduction/03-svelte-files.md`

```svelte title="App.svelte"
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

- 🔑 **One shared value, many copies.** `total` lives in `<script module>`, so there's exactly one of it. Each copy's instance script bumps it and logs. First copy logs 1, second logs 2, third logs 3.

- ➔ **Timing sets the rules.** Module code runs first, before any instance exists, so the instance script can read module variables but not the reverse. You can `export` named values from here, but never `export default` — that seat belongs to the component itself.

- ⚠️ **Old code alert.** Svelte 4 wrote this as `<script context="module">`. Same thing, older spelling. And honestly, you'll rarely reach for the module script.

---

## ❒ 2.6 The Style Zone: Scoped To Your Component Without You Asking

The third zone. Write CSS here and it's scoped to this component automatically. No collisions, no naming systems, no extra tooling. (The full styling lecture comes later.)

### ▶ Block 1 — Scoped styles, for free

**◆ Source:** `01-introduction/03-svelte-files.md`

```svelte title="App.svelte"
<style>
	p {
		/* this will only affect <p> elements in this component */
		color: burlywood;
	}
</style>
```

- 🔑 **Sealed inside this component.** This `p` rule paints only the paragraphs in *this* component. Paragraphs anywhere else in the app are untouched.

- ➔ **Svelte's default beats the rest.** React ships no styling opinion at all. Vue can scope, but you opt in with `<style scoped>`. Svelte scopes by default. You'd have to go out of your way to make a style global.

---

## ❒ 2.7 TypeScript In A Single Attribute

Want types? One attribute, and you're done.

### ▶ Block 1 — Turn the script into TypeScript

**◆ Source:** `01-introduction/03-svelte-files.md` (the `lang` attribute; the body is illustrative)

```svelte title="App.svelte"
<script lang="ts">
	// everything in here is now TypeScript
	let count: number = 0;
</script>
```

- ➔ **TypeScript, one attribute wide.** Add `lang="ts"` to the script tag and everything inside is TypeScript: checking, autocomplete, the lot. The deep TypeScript lecture comes much later.

---

## ❒ 2.8 What Is A Rune, Really? Not A Function, Though It Dresses Like One

Now the heart of the language. We keep saying "rune." Here's what one actually is, and it isn't what it looks like.

### ▶ Block 1 — A rune in the wild

**◆ Source:** `02-runes/01-what-are-runes.md`

```js
let message = $state('hello');
```

- ⚠️ **The docs' own definition.** "rune — a letter or mark used as a mystical or magic symbol." The Svelte team picked the word on purpose.

- 🔑 **It looks like a function. It isn't.** `$state('hello')` has the shape of a function call, but `$state` is a *keyword*, like JavaScript's `typeof` or `await`. Part of the grammar, not something you call.

- ➔ **Three tells that it's a keyword.** You never import it (there's no package it comes from). You can't store it in a variable or pass it around (it's an instruction at a spot, not a value). And it's only legal in certain positions (the compiler keeps you honest). Compare: React's `useState` and Vue's `ref` are imported runtime functions. A rune is none of that.

---

## ❒ 2.9 So What Do Runes Actually Do, And Why Not Just Use Functions?

So why keywords instead of functions? Because a rune is a message to the *compiler*, at build time, not a function that runs later in the browser. Different plane entirely. It even explains a neat contrast: React's hooks have placement rules (the "rules of hooks") because the framework tracks their call order at runtime. Runes have placement rules because they're grammar, read at build time. Same symptom, opposite worlds. Under the hood it's all "signals", but unlike Solid, which hands you signals directly, Svelte hides them and lets you drive with the friendly rune.

---

## ❒ 2.10 When Runes Escape The Component: The .svelte.js File

Here's the payoff runes unlocked. Reactivity used to be trapped inside `.svelte` files. Now it escapes, into files named `.svelte.js` (or `.svelte.ts`).

### ▶ Block 1 — A module where runes work

**◆ Source:** reconstructed from the lecture (the full cross-file pattern is lecture four)

```js title="counter.svelte.js"
// A normal module — except runes work in here.
let count = $state(0);
```

- 🔑 **The filename is the switch.** That `.svelte.` tucked before `.js` tells the compiler: process this for runes. Otherwise it's an ordinary module, with imports, exports, functions, the lot.

- ➔ **Why it matters.** Lift reactive state and logic clean out of any component and share it across the whole app, same runes, same behavior everywhere. A capability that simply did not exist before Svelte 5. (Sharing state across files has one catch, exporting-then-reassigning, which lecture four unpacks.)

---

## ❒ 2.11 Meeting The Family: A Wave At Every Rune From Across The Room

Meet the family. Seven runes, each a keyword, each a message to the compiler, each solving one problem. You'll learn them one by one. This is just the introductions.

- 🔑 **`$state`** — reactive state. A variable that updates the screen when it changes. (React's `useState`, Vue's `ref`.) The whole next lecture.

- **`$derived`** — a value computed from other reactive values, kept fresh automatically. (React's `useMemo`, Vue's `computed`.)

- **`$effect`** — run a side effect when its reactive dependencies change. (React's `useEffect`, Vue's `watch`.) A tool of last resort, not first.

- **`$props`** — what a component receives from its parent. (React props, Vue's `defineProps`.)

- **`$bindable`** — mark a prop as two-way bindable, so data can flow back up to the parent, not just down.

- **`$inspect`** — a dev-only tool that logs a piece of reactive state every time it changes. Gone in production.

- **`$host`** — reach the host element, only when you ship a component as a native web component.

---

## ❒ 2.12 The Full Recap, And The Road Into Reactivity

No new code. The whole hour: one component, one file, three zones. And runes, which are keywords (messages to the compiler), not functions. The instance script runs once. Styles scope themselves. Runes even work outside components now, in `.svelte.js` files. Next, we sit down with the first and biggest rune: `$state`.
