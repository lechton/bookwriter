# 01 | The Compiler Mindset: What Svelte Really Is, And How To Run It

*Your code companion to the audio lecture of the same name. When the voice says "look at your booklet," this is the page. Read them together.*

## How To Read This Booklet

- ❒ — a major section. It matches a section of the audio lecture.
- ▶ Block N — a numbered code block. The lecture's "first / second / next" counts these inside a section.
- `title="..."` on a code block — the file the code lives in (or "Terminal" for commands).
- ◆ Source — where the code comes from: a docs file, or marked reconstructed / for comparison.
- 🔑 — the key line, or the move the block turns on.
- ➔ — what to notice, and why it matters.
- ✔️ Works / ✖️ Trap — the right way and the broken way, side by side.
- ⚠️ — a surprise, or a rare-but-real gotcha.

**Sources for this booklet:** `/documentation 2026 June/svelte-docs/01-introduction/01-overview.md` and `.../02-getting-started.md`

Heads up: this is a mostly conceptual lecture. Many sections carry no code, just a one-line marker so you can follow along. Blocks marked REACT or VUE are background the lecture talks through, not Svelte docs code.

---

## ❒ 1.1 Welcome To The Course, And To The One Idea That Changes Everything

No code yet, just the map. Six stages ahead: the mental model, the runes, template syntax, the look-and-feel layer, the runtime tools, then practice and migration. Today has two jobs: the one big idea, and a real app running on your disk. Keep this booklet open.

---

## ❒ 1.2 The One Thing Nobody Tells You About A Framework: You Ship It To A Stranger

Where does a framework run? In your user's browser. React and Vue ship themselves to every visitor, in full, and run live on that stranger's three-year-old phone. Download size, plus processor time, on every single visit. That's the cost. Hold it.

---

## ❒ 1.3 A Fair, Honest Refresher On How React Works

React keeps a pretend copy of the page, the virtual DOM. Every change, it rebuilds that copy and diffs it against the last one to find what moved. Diffing isn't free. Most of that walking finds that nothing changed. Rename "Alice" to "Bob" and React still rebuilds the node and checks every attribute before it reaches the one word that differs. Scale it to a thousand-row table and the waste is real, paid again and again, on every device.

---

## ❒ 1.4 And How Vue Works, Because It Chose A More Surgical Path

Vue is smarter about the update. It wraps each value in a watcher called `ref`, so when something changes it skips the diff and touches only the spots that used that value. The price: a `.value` on every read and write. And notice what didn't change. Vue is still a library, still running in the browser, still shipped along with your app.

---

## ❒ 1.5 The Third Answer: What If The Framework Did Its Work Before The Browser Ever Woke Up

Svelte flips the whole thing. It is not a library that runs in the browser. It is a compiler that runs on your machine, before the app ships. It reads your code ahead of time, sees exactly what can change, and writes lean JavaScript that already knows. A library is there when your code runs. A compiler was there before your code runs. That's the hinge for the entire course.

---

## ❒ 1.6 What A Compiler Actually Does To Your Friendly Little File

You write the clean, high-level component. The compiler turns it into lean, low-level JavaScript. Here's the friendly file. What runs in the browser is the compiler's rewrite of it.

### ▶ Block 1 — The whole component (the very first code block)

**◆ Source:** `01-introduction/01-overview.md`

```svelte title="App.svelte"
<script>
	function greet() {
		alert('Welcome to Svelte!');
	}
</script>

<button onclick={greet}>click me</button>

<style>
	button {
		font-size: 2em;
	}
</style>
```

- 🔑 **Three parts, one file.** A `<script>` with a `greet` function, a `<button>` wired to it with `onclick`, and a `<style>` that bumps the font to `2em`. Plain HTML, CSS, and JavaScript. Nothing to decode.

- ➔ **This is not what ships.** The compiler reads this and emits lean JavaScript that builds the button, wires the click, and adds nothing else. You write the comfortable version. It writes the efficient one.

- ⚠️ **See the rewrite yourself.** Paste any component into the Svelte playground and click the "JS Output" tab. That's the compiler's actual output, laid bare. Do it once and the magic turns into plain understanding.

---

## ❒ 1.7 The Real Payoff: You Get To Just Use The Language

Because the compiler does the wiring, you write plain code. Same counter bump, three frameworks, three amounts of ceremony. (Preview only, the state rune gets its own lecture.)

### ▶ Block 1 — REACT (for comparison)

**◆ Source:** reconstructed from the lecture's comparison (React)

```jsx
setCount(count + 1); // a setter, every time. Never count++.
```

- ➔ **React: go through the setter.** Touch the value directly and the screen freezes.

### ▶ Block 2 — VUE (for comparison)

**◆ Source:** reconstructed from the lecture's comparison (Vue)

```js
count.value++; // the ".value" tax, every read and write
```

- ➔ **Vue: go through `.value`.** The wrapper sits between you and the number.

### ▶ Block 3 — SVELTE

**◆ Source:** reconstructed from the lecture (preview)

```svelte
count++; // just a variable. The screen follows.
```

- ➔ **Svelte: just use the language.** No setter, no `.value`. The compiler wrote the "notify everyone" code for you, at build time. The best API is no API at all.

---

## ❒ 1.8 A Short History, And Why This Course Keeps Saying Svelte Five

Svelte 3 (2019) made the compiler bet. Back then you made things reactive with a plain variable and a cryptic `$:` line. Svelte 5 (2024) kept the compiler soul but rebuilt reactivity on signals and made it explicit with runes. Same soul, sharper body. When you meet old `$:` code online, it's an earlier dialect, not something broken.

---

## ❒ 1.9 The Honest Tradeoffs: What The Compiler Mindset Asks Of You In Return

No free lunch. One: a build step is mandatory, because a browser can't run a `.svelte` file directly. Two: what runs is the compiler's output, not your source, so debugging leans on source maps. Three: you trust work you don't see. Look at the "JS Output" once and that trust turns into informed delegation.

---

## ❒ 1.10 Now Let Us Actually Build One: The SvelteKit Path

Time to put a real app on disk. The recommended road is SvelteKit, the official framework around Svelte, powered by the Vite build tool. Four commands.

### ▶ Block 1 — Create and run a SvelteKit app

**◆ Source:** `01-introduction/02-getting-started.md`

```sh title="Terminal"
npx sv create myapp
cd myapp
npm install
npm run dev
```

- 🔑 **Four lines, empty disk to running app.** `npx sv create myapp` scaffolds a project (`npx` runs Svelte's `sv` CLI once, nothing to install). `cd myapp` steps into it. `npm install` pulls the dependencies, once. `npm run dev` starts the dev server.

- ➔ **The daily rhythm.** `npm run dev` fires up Vite, compiles your code, and serves the app at a local address. Save a file and the browser updates almost instantly. Edit, save, see it.

---

## ❒ 1.11 The Lighter Paths: The Vite Plugin, The Playground, And A Throwaway Sandbox

SvelteKit is the default, not the only door. Three lighter ways in.

### ▶ Block 1 — Svelte with Vite, no SvelteKit

**◆ Source:** `01-introduction/02-getting-started.md`

```sh title="Terminal"
npm create vite@latest    # then pick the "svelte" option
npm run build             # outputs HTML, JS, CSS to dist/
```

- ➔ **Leaner and more hands-on.** Just Svelte plus Vite. The trade: no built-in routing, so add a routing library yourself for anything past one screen.

- ➔ **The playground.** Runs in your browser, nothing to install. Best for learning, quick tests, and peeking at "JS Output." Find it at `svelte.dev/playground`.

- ➔ **A cloud sandbox.** A full SvelteKit project in your browser in seconds, great for sharing a working example. Spin one up at `sveltekit.new`.

---

## ❒ 1.12 Your Toolbelt: The Editor Extension, The Checker, And Where To Find Help

Three small things that make week one pleasant. The big one: install the official VS Code extension on day one. It understands `.svelte` files, with highlighting, autocomplete, and live error underlines before you ever run anything. Then a command, and a place to ask.

### ▶ Block 1 — Check the whole project from the command line

**◆ Source:** `01-introduction/02-getting-started.md`

```sh
npx sv check
```

- ➔ **One sweep, every file.** `npx sv check` runs Svelte's checker across your code: type mismatches, accessibility problems, small mistakes you missed. Same brain as the editor extension, pointed at everything at once. Perfect right before you ship.

- ➔ **Where to get unstuck.** The Svelte Discord is famously kind to newcomers (`svelte.dev/chat`), and Stack Overflow has answers under the `svelte` tag. Ask early. That's what pros do, not beginners.

---

## ❒ 1.13 The Full Recap, And The Road Just Ahead

No new code. The whole hour in one line: Svelte moves the work off your user's browser and onto your build step. A library runs in the browser; a compiler ran before it. Everything else in this course flows from that one relocation. Next up: the `.svelte` file, up close.
