# 04 Extra · JavaScript Foundations — Figure Learning Index

This is the spec for the lesson's 15 figures: for each, the precise technical **title** and a clear, unambiguous **lead** stating what the student must learn from it, named in the context of the lecture. It is the master list the per-image twins are written to match — when a title or lead changes here, the twin's title and opening line change with it.

## The lecture's through-line (the context every figure sits in)

The lesson *From Objects To The Reactive Graph* builds the floor under reactivity, one station at a time. Reactivity is built on **interception** — making an ordinary read or write secretly run code. Interception lets a framework keep an **observer-pattern ledger** of who depends on what. That ledger is a **dependency graph** of sources, deriveds, and effects. The effects at the bottom reach out and edit the **DOM**, the tree of live objects the browser built from your tags. The three frameworks are three places to stand on the interception ladder. The figures trace that line:

1. Objects & the prototype — the data the app holds (fig 1)
2. Closures — private memory without a class (figs 2–3)
3. Getters → 4. Proxy — interception, rung one then rung two (figs 4–5)
4. The observer pattern — the reactivity engine (fig 6)
5. The signal — the reactive node; a proxy is a bundle of signals (figs 7–9)
6. The dependency graph — the DAG, propagation, the diamond (figs 10–11)
7. The DOM — what "the page" actually is (fig 12)
8. Three answers — React, Vue, Svelte on one axis (figs 13–15)

## Proposed twin header format (replaces the old boilerplate blockquote)

**Before:**
> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/.../12-dom-tree.png`.

**After** (worked example, fig 12):
```
# 12 · Tag vs. Element: How the Browser Builds the Live DOM Tree

**What to learn:** What "the page" actually is — the structure the effects at the bottom of the
reactive graph reach out and edit. HTML source is inert text (a tag); the browser parses it into a
tree of live element objects (the DOM), one object per tag, and changing the UI is nothing but
mutating objects in that tree. This is the anchor the next three figures — virtual DOM vs. compiled
updates — depend on.

> Twin of `images/04_extra_javascript_1/12-dom-tree.png`. Content below is transcribed verbatim from the figure.
```
The generic "— Figure Content" suffix is dropped from every title; the boilerplate blockquote becomes a one-line provenance note kept at the foot of the header, and the lead is promoted to the top.

---

## The 15 figures — titles and leads

### §1 · Objects and the prototype

**01 · Property Lookup: Own Slots First, Then Up the Prototype Chain**
What to learn: how JavaScript resolves a property access on the `Article` object that the whole lesson rests on. A read checks the object's own slots first, then follows the hidden prototype link up the chain until the key is found or the chain ends at `null` (yielding `undefined`); class methods are stored once on the shared prototype, so a thousand instances reuse one copy instead of each carrying its own.

### §2 · Functions are values, closures are private memory

**02 · Closures: How a Returned Function Keeps Its Birth Scope Alive**
What to learn: how a function can own private, persistent state with no class involved. A function defined inside another captures that surrounding scope and keeps it alive after the outer call has returned; the captured variable is then reachable only through the returned functions — encapsulation achieved with nothing but a closure.

**03 · The Module Singleton: One Shared Scope Behind Exported Functions**
What to learn: how one piece of state is shared across several files. A module's top-level scope is a closure that runs exactly once; variables you don't export stay private, exported functions close over them, and every file that imports those functions touches the same single live instance — the mechanism behind a module-scoped store.

### §3 · Getters and setters

**04 · Accessor Properties: A Read That Secretly Runs a Function**
What to learn: the first form of interception. A property declared with `get` runs a function on every read instead of returning a stored value, so it is always fresh and is read with no call syntax; the deeper point is that a read can be made to run code — and therefore to record who is reading.

### §4 · The Proxy

**05 · The Proxy: Total Interception of an Object Through Traps**
What to learn: general-purpose interception over a whole object. A proxy wraps a target and routes every operation — read, write, new property, deletion — through trap functions, catching even properties that did not exist when it was created (which a single getter cannot); this total interception is what lets a framework track and notify without your writing one bookkeeping call.

### §5 · The observer pattern

**06 · Dependency Tracking: Track on Read, Trigger on Write**
What to learn: the engine of reactivity. A value holds a list of the computations that depend on it; a hidden marker names the computation currently running, so each intercepted read adds that computation (track) and each intercepted write reruns the recorded ones (trigger) — the subscribe-and-notify the framework performs for you.

### §6 · The signal (a proxy is a bundle of signals)

**07 · Deep Reactivity: A Proxy Fronting One Signal per Property**
What to learn: how the two distinct tools — a proxy and a signal — compose into a deep reactive object. Wrapping an object in `$state` creates a proxy that lazily mints one signal per property the first time it is touched; reading a property subscribes through that property's signal and writing it triggers that signal — breadth from the proxy, depth from the per-property signals, all the way down.

**08 · The Reactive Cycle: From a Direct Mutation to a Single DOM Edit**
What to learn: the complete reactivity loop, end to end. `$state` makes a variable fine-grained reactive; mutating it directly (`count += 1`) fires its signal, and only the exact text nodes that read that variable update — no setter to call, and no virtual DOM or diff in between.

**09 · `$state.raw`: Why Mutation Is Ignored but Reassignment Fires**
What to learn: the shallow state variant, and how to reason about behavior from architecture rather than rules. Raw state keeps the single outer signal but omits the proxy, so no per-property signals are ever created; mutating the contents therefore changes nothing, and only reassigning the whole value fires the one signal that exists.

### §7 · The dependency graph

**10 · The Dependency Graph: Propagating a Change Source → Derived → Effect**
What to learn: the structure reactivity forms and how a change travels through it. Sources (held state), deriveds (computed values), and effects (side effects) form a directed graph wired by your reads; changing a source follows the out-arrows to recompute only the downstream deriveds and rerun only the dependent effects, whose job is to edit the DOM — the hold/compute/do triage made concrete.

**11 · The Diamond Problem: Topological Order and the Glitch It Prevents**
What to learn: why the order of updates in the graph matters. When one source feeds two deriveds and a single effect reads both, the system must recompute both deriveds before running the effect (topological order); otherwise the effect runs on a half-updated mix of new and stale values — the bug known as a glitch.

### §8 · The DOM

**12 · Tag vs. Element: How the Browser Builds the Live DOM Tree**
What to learn: what "the page" actually is — the structure the effects at the bottom of the reactive graph reach out and edit. HTML source is inert text (a tag); the browser parses it into a tree of live element objects (the DOM), one object per tag, and changing the UI is nothing but mutating objects in that tree. This is the anchor the next three figures — virtual DOM vs. compiled updates — depend on.

### §9 · Three answers: React, Vue, Svelte

**13 · React's Model: Rerun the Component, Diff the Virtual DOM**
What to learn: React's strategy for keeping the DOM in step with data. Calling a `useState` setter reruns the entire component to produce a new virtual DOM — a throwaway object tree — which React diffs against the previous one (reconciliation) to compute and apply only the minimal real edits; the granularity is coarse: rerun, then compare.

**14 · Vue's Model: Proxy-Tracked Dependencies, Then a Virtual-DOM Diff**
What to learn: Vue 3's hybrid strategy, built on the very interception this lecture assembled. `reactive` wraps objects in a proxy and `ref` boxes a primitive behind `.value` (a bare primitive cannot be proxied); the observer pattern tracks which components read which values and reruns only those — but each rerun component still builds and diffs a virtual DOM.

**15 · Svelte's Model: Compiled Signals Wired Straight to Nodes, No Diff**
What to learn: Svelte 5's compiler-based strategy, and what sets it apart. Because the compiler reads the component at build time, it already knows which DOM nodes depend on which signals, so it emits code wiring each signal directly to its node; a change updates exactly that node — no virtual DOM, no diff — the finest granularity of the three.
