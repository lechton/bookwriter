# Svelte 5 + SvelteKit Interview Questions

A unified, dependency-ordered curriculum of **210 questions**: Svelte 5 (1–100) and SvelteKit (101–210). One continuous numbering scale, sections stacked one under the other, so any question can be cited by its number (e.g. "write the lecture for Q47").

## Format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 1 | ❱ CORE | `#what_is_svelte` | What is Svelte? | ... |

- **#** — Stable unique ID. Continuous 1–210. Cite any question by number.
- **Tier** — `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth; `LEGACY` for migration reference. SvelteKit uses the same three tiers with a `(Kit)` suffix on the depth word for clarity, e.g. `❱ CORE (Kit)`.
- **Topic** — One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question** — Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook** — Pain-point framing. Becomes the lecture's opening paragraph.

## How the count is grounded

| Course | Docs files audited | Teachable concepts (after honest stripping) | Target questions |
|---|---:|---:|---:|
| Svelte 5 | 90 | ~575 | 100 |
| SvelteKit | 75 | ~940 | 110 |
| **Total** | **165** | **~1,515** | **210** |

A good interview question bundles 4–6 related concepts around one mechanism. `1,515 / ~7 ≈ 210`. The split reflects SvelteKit's denser interview surface (routing, `load`, form actions, hooks are each concept-heavy and interview-central).

## Reading paths

- **Pure newcomer:** Read ❱ CORE in order, both courses. You will be able to build and ship a SvelteKit app.
- **Working developer:** Finish ❱ CORE (both), then dip into ❱❱ MORE by topic as your work demands.
- **Interview prep:** Skim ❱ CORE, drill ❱❱❱ ADVANCED.
- **Maintaining old code:** Read the LEGACY appendix.

---

# PART ONE — SVELTE 5 (Q1–Q100)

## ❱ CORE — Svelte on-ramp (Q1–Q35)

The minimum path that takes a complete newcomer to "I can build a working Svelte 5 component with state, props, events, lists, effects, and bindings." Read in order. Zero legacy content.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 1 | ❱ CORE | `#what_is_svelte` | What is Svelte, and how does it differ from frameworks like React and Vue? | You've heard Svelte "has no virtual DOM" — but what does that actually mean, and why does it matter for performance? |
| 2 | ❱ CORE | `#project_setup` | How do you create and run a new Svelte project? | You want to start a Svelte app today. What command do you run, what does it give you, and how do you see it in the browser? |
| 3 | ❱ CORE | `#component_anatomy` | What are the three parts of a `.svelte` file, and what is each one for? | You open a `.svelte` file for the first time and see script, markup, and style all in one place. How do these three pieces fit together? |
| 4 | ❱ CORE | `#state` | How do you create reactive variables in Svelte? | You change a variable in your script, but the screen doesn't update. Why, and how do you make it update? |
| 5 | ❱ CORE | `#event_handling` | How do you handle user events like clicks in Svelte? | You want a counter that goes up every time the user clicks a button. Where does the click handler go, and how does it connect to your state? |
| 6 | ❱ CORE | `#basic_markup` | How do you output dynamic values and set attributes in Svelte markup? | You have a variable in your script and want its value to appear inside a heading, or drive an element's class. How does markup read your script? |
| 7 | ❱ CORE | `#derived` | How do you compute a value that updates automatically when its inputs change? | You have a cart total that should recalculate whenever a price or quantity changes. Writing a function to recompute it by hand feels wrong. |
| 8 | ❱ CORE | `#child_components` | How do you use one component inside another? | Your `App.svelte` is getting crowded. How do you split it into smaller pieces and reference them? |
| 9 | ❱ CORE | `#props` | How do you pass data from a parent component into a child? | You've built a `Button` component, but every instance looks identical. How do you give each one its own label? |
| 10 | ❱ CORE | `#props` | How do you give a prop a default value and gather the rest? | Some props are optional, and sometimes you want to forward whatever the parent passed straight to a DOM element. How do defaults and "the rest of the props" work? |
| 11 | ❱ CORE | `#callbacks` | How does a child component tell its parent that something happened? | Your `Button` is clicked, but the parent needs to know. How does the child send a message up the tree — without events or a global store? |
| 12 | ❱ CORE | `#if_block` | How do you show, hide, or branch parts of the UI based on state? | You only want to show the login form when the user is signed out, and the dashboard when they're signed in. How do you conditionally render markup? |
| 13 | ❱ CORE | `#each_block` | How do you render a list of items from an array, and why does each need a key? | You have ten users and want a row for each. When you sort the list, the rows lose their state and input values jump around. What went wrong? |
| 14 | ❱ CORE | `#binding` | How do you bind form inputs — text, checkboxes, radios, and dropdowns — to state? | Text inputs are easy, but checkboxes are booleans, radios pick one of many, and dropdowns can be multi-select. How do you bind each to state? |
| 15 | ❱ CORE | `#effect` | How do you run a side effect when something reactive changes, and how do you clean it up? | You need to save a value to `localStorage` every time it changes, and remove an event listener when the effect re-runs or the component dies. Where does that logic live? |
| 16 | ❱ CORE | `#mount` | You've written an `App.svelte` file. How does it actually get onto the page? | Svelte compiles your component to JavaScript, but how does that JavaScript end up rendering on the screen? What actually puts your component into the DOM? |
| 17 | ❱ CORE | `#scoped_css` | How does Svelte keep one component's CSS from affecting other components? | You add `.button { color: red }` to one component, and you're terrified it'll turn every button in the app red. Does it? Why or why not? |
| 18 | ❱ CORE | `#class_directive` | How do you apply and toggle classes conditionally in Svelte? | You want a `disabled` class when the button is disabled, an `active` class when it's pressed. How do you toggle classes based on state? |
| 19 | ❱ CORE | `#style_directive` | How do you set inline styles dynamically, including CSS custom properties? | You need an element's color to come from a variable, or a CSS variable like `--columns` to be set from JavaScript. How do you drive inline styles from state? |
| 20 | ❱ CORE | `#bindable` | How do you let a parent read and change a value that lives inside a child component? | Your `Input` component owns its value, but the parent needs to read and reset it. How do you set up two-way binding across the component boundary? |
| 21 | ❱ CORE | `#snippet` | How do you write a reusable chunk of markup you can use in several places? | The same three lines of markup appear in five spots in your component. Copy-paste feels wrong — can you name a block of markup and reuse it? |
| 22 | ❱ CORE | `#typescript` | How do you use TypeScript inside a `.svelte` component and type its props? | You want type safety in your component — typed props, typed state. What do you add to the script tag, and how do you declare a prop interface? |
| 23 | ❱ CORE | `#this_binding` | How do you get a direct reference to a DOM element from your script? | You need to call `.focus()` on an input, or measure an element's size, from inside your script. How do you reach the actual DOM node? |
| 24 | ❱ CORE | `#state` | How do you store and update objects and arrays in `$state`? | You declared `let user = $state({ name: 'Alice' })` and tried to update `user.name` — but does it work? What about pushing to a `$state` array? |
| 25 | ❱ CORE | `#stores` | How do you share reactive state across many components that aren't parent and child? | A user's login status is needed by the navbar, the sidebar, and three pages — none of which are direct children of each other. How do you share that state? |
| 26 | ❱ CORE | `#context` | How do you pass data deep into the tree without prop-drilling? | Your theme is set at the root, but the deep button that needs it is six components down. Passing it through every layer is painful. Is there a shortcut? |
| 27 | ❱ CORE | `#effect` | Why shouldn't you update state inside an `$effect`, and what should you do instead? | You wrote an effect that updates state, and it works — sometimes. Other times it loops forever or runs at the wrong time. What's the rule, and what's the fix? |
| 28 | ❱ CORE | `#await_block` | How do you handle loading, success, and error states when fetching data? | You call an API and the screen flashes empty, then populated, with no loading indicator and no error handling. How do you coordinate the three states cleanly in markup? |
| 29 | ❱ CORE | `#lifecycle` | How do you run code once when the component first appears, and once when it's removed? | You need to fetch data on mount and clean up a WebSocket on unmount. What are the lifecycle hooks for "I'm here" and "I'm leaving"? |
| 30 | ❱ CORE | `#html` | How do you render raw HTML from a string, and what's the danger? | You have HTML coming from a CMS or a rich-text editor and need to inject it into the page. How do you do it — and what could go badly wrong? |
| 31 | ❱ CORE | `#debugging` | How do you inspect reactive values while developing? | Your state isn't doing what you expect, but `console.log` only runs once. How do you watch a value change over time in Svelte? |
| 32 | ❱ CORE | `#derived` | How do you write a derived value that needs multiple statements, loops, or `try/catch`? | A simple expression like `count * 2` fits in `$derived(...)`, but what if your computation needs a loop, a temp variable, or error handling? |
| 33 | ❱ CORE | `#component_anatomy` | What is the difference between `<script>` and `<script module>`? | Some logic should run once for the whole module, not once per component instance. How do you share a value across every instance of a component? |
| 34 | ❱ CORE | `#project_setup` | How do you check your Svelte project for type and lint errors before shipping? | Your app runs in the browser, but you want to catch type errors and unused CSS before deploy. What tool checks the whole project? |
| 35 | ❱ CORE | `#event_handling` | How do you pass arguments to an event handler, and what is the `event` object? | You need to know which button was clicked, or pass an item's ID into the handler. How do arguments and the event object work in Svelte? |

## ❱❱ MORE — Svelte feature tour (Q36–Q70)

Features a working developer eventually needs. Dip in by topic. Assumes CORE as prerequisite.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 36 | ❱❱ MORE | `#state` | How does `$state` handle reactivity inside nested objects and arrays? | You mutate `user.address.city` and the screen doesn't update. You thought `$state` made the whole object reactive — what's actually going on? |
| 37 | ❱❱ MORE | `#state` | What is `$state.raw`, and when should you choose it over `$state`? | You're storing a huge read-only lookup table in state and the app is sluggish. Is plain `$state` doing work you don't need? |
| 38 | ❱❱ MORE | `#state` | How do you get a plain, non-reactive snapshot of `$state` data? | You need to pass your reactive state to a non-Svelte library, or log it, or send it over the network — but the Proxy is in the way. |
| 39 | ❱❱ MORE | `#state` | How do you use `$state` in classes and class fields? | You want to put reactive state on a class, not a component. How do class fields interact with `$state`, and what's the `this` pitfall? |
| 40 | ❱❱ MORE | `#state` | How do you make built-in collections like `Map` and `Set` reactive? | `new Map()` inside `$state` doesn't trigger updates when you `.set()` a key. What are the reactive versions, and where do they come from? |
| 41 | ❱❱ MORE | `#derived` | How does `$derived` track dependencies, and what happens with conditional or async reads? | Sometimes your derived value updates when it shouldn't, or doesn't when it should. What's the rule for what counts as a dependency? |
| 42 | ❱❱ MORE | `#derived` | How do you override a `$derived` value, and why would you? | You want an optimistic UI that shows a change immediately, then rolls back if the server rejects it. Can a derived value be temporarily reassigned? |
| 43 | ❱❱ MORE | `#derived` | Why doesn't `$derived` deeply reactify the objects it returns? | Your derived value returns an object, and mutating its properties doesn't trigger updates. Is that a bug or intentional? |
| 44 | ❱❱ MORE | `#effect` | How exactly does `$effect` track its dependencies, and what does NOT count? | Your effect doesn't re-run when you expected it to. What's the actual rule — and do reads after an `await` count? |
| 45 | ❱❱ MORE | `#inspect` | How do you watch a reactive value change over time, including deep mutations? | `console.log` runs once. How do you log a value every time it — or anything inside it — changes, with the stack trace of what changed it? |
| 46 | ❱❱ MORE | `#runes_in_js` | How do you use runes outside of `.svelte` files, in plain `.js` or `.ts` modules? | You want shared reactive state and logic in a regular JavaScript file, not tied to any component. Can runes live there, and what changes? |
| 47 | ❱❱ MORE | `#runes_in_js` | Why can't you export a reassigned `$state` from a `.svelte.js` module, and what do you do instead? | You `export let count = $state(0)` from a module and it doesn't stay reactive. What's the rule, and what patterns work for shared module state? |
| 48 | ❱❱ MORE | `#props` | What are the rules for mutating props — when is it allowed, and when does it warn? | You reassigned a prop in a child and got an "ownership invalid mutation" warning. What does "own your state" actually mean in Svelte 5? |
| 49 | ❱❱ MORE | `#props` | How do you pass a component itself as a prop, and dynamically render it? | The parent doesn't know which component to render until runtime. How do you pass a component type and render it dynamically? |
| 50 | ❱❱ MORE | `#props` | How do you generate a unique, stable ID per component instance? | You need `id` attributes for label/input pairing, and they must be stable across SSR and hydration. What's the Svelte way? |
| 51 | ❱❱ MORE | `#snippet` | How do you pass snippets to child components, and how does the implicit `children` snippet work? | You want to hand a chunk of parent markup to a child for it to render. How do snippet props work, and what's special about `children`? |
| 52 | ❱❱ MORE | `#snippet` | How do you give a snippet fallback content, and how do you type its arguments? | A child receives a snippet prop but the parent didn't supply one. How do you render a default instead of crashing? And how do you type snippet arguments? |
| 53 | ❱❱ MORE | `#bindable` | When should you reach for `$bindable`, and when is it an anti-pattern? | Two-way binding is convenient, but your data flow is becoming unpredictable. When does `$bindable` help and when does it hurt? |
| 54 | ❱❱ MORE | `#binding` | How do you bind to media elements like `<video>` and `<audio>`? | You want to track `currentTime`, `duration`, and `paused` on a video element reactively. Which bindings exist, and which are read-only? |
| 55 | ❱❱ MORE | `#binding` | How do you bind to element dimensions and window properties? | You need to react to an element's width, or the window's scroll position. Which dimension and window bindings does Svelte provide out of the box? |
| 56 | ❱❱ MORE | `#binding` | What are function bindings, and when do you need them? | `bind:value` writes to a variable, but what if the value lives somewhere you can't directly assign — like inside a store or a class? |
| 57 | ❱❱ MORE | `#key_block` | How do you force a chunk of the DOM to completely re-create when a value changes? | You want an element to replay its transition, or a component to fully reset, when a tab changes. How do you tell Svelte to throw away and rebuild that subtree? |
| 58 | ❱❱ MORE | `#const` | How do you declare a local constant inside a template block? | You compute a value inside an `{#each}` loop and want to reuse it across the loop body without re-running the expression. How? |
| 59 | ❱❱ MORE | `#basic_markup` | How do event handlers, attributes, and spreads really work in Svelte markup? | You've used `onclick` and `{...props}` casually — but what are the precedence rules, the case-sensitivity gotchas, and the event delegation mechanism? |
| 60 | ❱❱ MORE | `#basic_markup` | How do you escape literal braces and special characters in Svelte markup? | You want to print a literal `{` or `}` in your text, but Svelte thinks it's an expression. How do you escape it? |
| 61 | ❱❱ MORE | `#html` | Why don't scoped styles apply to `{@html}` content, and how do you style it? | You injected HTML with `{@html}` and your component's CSS doesn't affect it. Why, and what's the fix? |
| 62 | ❱❱ MORE | `#class_directive` | What's the modern way to compose classes from objects and arrays? | You're tired of string-concatenating conditionals. Can you pass an object or array to `class` and have Svelte figure it out? |
| 63 | ❱❱ MORE | `#action` | What is a Svelte action, and how do you attach reusable DOM behavior to an element? | You want every modal in your app to close on outside-click, without wrapping each in a component. How do you attach that behavior to a DOM node? |
| 64 | ❱❱ MORE | `#action` | How does an action receive parameters, and how do you tear it down cleanly? | Your action needs configuration and must remove its listeners when the element is destroyed. What's the full action lifecycle? |
| 65 | ❱❱ MORE | `#transitions` | How do you animate elements entering and leaving the DOM, and configure them? | Items disappear from your list with a jarring pop. How do you make them fade or fly out gracefully, and control duration, delay, and easing? |
| 66 | ❱❱ MORE | `#transitions` | What's the difference between `transition:`, `in:`, and `out:`, and local vs global? | Sometimes you want symmetric enter/leave, sometimes asymmetric. And sometimes your transition plays when the parent is removed, not just when the element toggles. How do you control it? |
| 67 | ❱❱ MORE | `#transitions` | How do you write a custom transition function, and coordinate crossfades between lists? | The built-in fades and slides aren't enough. And moving an item from list A to list B should look like one continuous motion, not a disappear-then-appear. How? |
| 68 | ❱❱ MORE | `#animate` | How do you animate items when a list is reordered, using FLIP? | Dragging an item to a new position should animate smoothly, not teleport. What powers that, and where does the directive go? |
| 69 | ❱❱ MORE | `#stores` | What is the Svelte store contract, and how do `writable`, `readable`, and `derived` differ? | You've used `writable`, but what actually defines a store? What methods must it have, and when do you reach for `readable` or `derived`? |
| 70 | ❱❱ MORE | `#stores` | How does the `$store` auto-subscription prefix work, and how do you build a custom store? | You prefix a store with `$` and it just works — but only sometimes. What are the rules? And how do you expose only safe, named operations instead of raw `.set`? |

## ❱❱❱ ADVANCED — Svelte deep mechanics (Q71–Q95)

Signal internals, dependency tracking, escape hatches, compiler analysis, testing. Assumes CORE and the relevant MORE questions.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 71 | ❱❱❱ ADVANCED | `#signals` | How does Svelte 5's signal-based reactivity actually work under the hood? | You can use `$state`, but an interviewer asks you to explain the mechanism. "Magic" isn't an acceptable answer. |
| 72 | ❱❱❱ ADVANCED | `#fine_grained` | How does fine-grained reactivity differ from component-level invalidation, and why does it matter? | Svelte 4 invalidated whole components when any dependency changed. Svelte 5 updates only the exact dependency that read the changed value. What does that mean in practice? |
| 73 | ❱❱❱ ADVANCED | `#batching` | How does Svelte batch multiple state changes into a single DOM update? | You set three state variables in a row. The DOM doesn't update three times — it updates once. What's coordinating that, and when does batching flush? |
| 74 | ❱❱❱ ADVANCED | `#derived` | How does the push-pull reactivity model work, and how does referential-identity short-circuiting prevent wasted updates? | Derived values don't recompute eagerly, and a derived returning a new array each time can cause spurious effect re-runs. What's the model, and how do you stop the waste? |
| 75 | ❱❱❱ ADVANCED | `#state` | How do the deep-reactivity Proxies actually work, and where do they stop? | `$state` proxies objects and arrays recursively — but not classes, not `Object.create` results. What are the exact rules, and what breaks if you fight them? |
| 76 | ❱❱❱ ADVANCED | `#state` | How does the compiler transform `$state` class fields, and what does the compiled output look like? | `$state` on a class field isn't just a value — the compiler rewrites it to getters and setters on the prototype. What's the actual output, and why does it matter? |
| 77 | ❱❱❱ ADVANCED | `#state` | What is `$state.eager`, and when is non-batched reactivity the right choice? | Batched updates are usually what you want — but sometimes you need the DOM to update immediately, mid-function. What's the eager variant and what breaks if you overuse it? |
| 78 | ❱❱❱ ADVANCED | `#effect` | What are the rules of dependency tracking inside `$effect`, and what reads don't count? | Your effect doesn't re-run when expected — or re-runs when it shouldn't. What's the actual rule for synchronous reads, async reads, and reads inside called functions? |
| 79 | ❱❱❱ ADVANCED | `#untrack` | How do you intentionally read a reactive value without making it a dependency? | You need to read state inside an effect for context, but you don't want the effect to re-run when it changes. What's the escape hatch? |
| 80 | ❱❱❱ ADVANCED | `#effect` | What is `$effect.tracking()`, and how do you create effects outside any component with `$effect.root`? | You're building an abstraction that needs to know whether it's reactive, or a reactive scope tied to a long-lived object like a WebSocket manager. How do you do both? |
| 81 | ❱❱❱ ADVANCED | `#effect` | How do you break infinite loops and avoid bidirectional sync between two pieces of state? | Your effect updates state, which re-triggers the effect, forever. Or you synced "spent" and "remaining" with two effects and got a loop. What are the legitimate fixes? |
| 82 | ❱❱❱ ADVANCED | `#effect` | When should you never use `$effect`, and what should you use instead? | Effects feel like a general "react to changes" tool, but the docs are emphatic: most uses are wrong. What's the discipline, and what replaces effects in each case? |
| 83 | ❱❱❱ ADVANCED | `#effect` | What is `$effect.pre`, and how does its timing differ from `$effect`? | You need to read the DOM before Svelte paints — to scroll a chat to the bottom, for instance. Standard `$effect` runs too late. What's the earlier hook? |
| 84 | ❱❱❱ ADVANCED | `#mount` | Why don't effects run during `mount`, and what does `flushSync` actually do? | You call `mount`, then immediately read the DOM, and it's empty. The component is there, but nothing has happened yet. Why — and how do you force it? |
| 85 | ❱❱❱ ADVANCED | `#hydrate` | How does hydration actually work, and what causes hydration mismatches? | Your server-rendered HTML and your client render disagree, and the page flickers or errors. What's happening during hydration, and how do mismatches arise? |
| 86 | ❱❱❱ ADVANCED | `#render` | What does server-side `render` require at compile time, and how do errors propagate? | `render` only works with a specific compile target. What changes about your build, and how do errors thrown during render reach the client? |
| 87 | ❱❱❱ ADVANCED | `#svelte_boundary` | How do boundaries interact with SSR, error transformation, and security? | You're building a production SSR setup. How do you safely surface errors to the client without leaking stack traces, and what's `transformError` for? |
| 88 | ❱❱❱ ADVANCED | `#hydratable` | What is the `hydratable` API, and how does it prevent double-fetching during hydration? | Your component fetches data on the server, then fetches it again on the client during hydration — doubling the work. What low-level API solves this? |
| 89 | ❱❱❱ ADVANCED | `#compiler` | How does the Svelte compiler analyze and optimize static markup at build time? | Two templates look identical to you, but the compiled output for one is dramatically smaller. What did the compiler see that you didn't? |
| 90 | ❱❱❱ ADVANCED | `#compiler` | What compiler options shape Svelte's output, and how does tree-shaking and CSS scoping actually work? | You need different output for SSR, for custom elements, for stricter warnings. What flags exist? And how does Svelte decide what ships, with that hash class and `:where()`? |
| 91 | ❱❱❱ ADVANCED | `#event_handling` | How does Svelte's event delegation work under the hood, and what gotchas does it create? | `onclick` isn't a real listener on the element — Svelte delegates. What does that mean for `stopPropagation`, custom events, and passive listeners? |
| 92 | ❱❱❱ ADVANCED | `#props` | How do you write generic components with type parameters in Svelte 5? | Your `List` component should work with any item type, not just `unknown`. How do you declare generics on a Svelte component and keep full type safety? |
| 93 | ❱❱❱ ADVANCED | `#action` | How do attachments (the modern actions) work, and how do they differ from `use:`? | Svelte 5.29 introduced `{@attach}` as the successor to `use:`. What problem does it solve, and when should you migrate? |
| 94 | ❱❱❱ ADVANCED | `#custom_elements` | How do you compile Svelte components into Web Components, and what are the trade-offs? | You want to ship a Svelte component as a framework-agnostic custom element. What's the setup, and what changes about props, slots, and SSR? |
| 95 | ❱❱❱ ADVANCED | `#testing` | How do you unit test a Svelte component, and what makes testing reactive code different? | Your component works in the browser but your test asserts on the DOM before the effect has run. What are the tools, and why does reactive code need `flushSync` and `$effect.root`? |

## LEGACY / MIGRATION — Svelte reference appendix (Q96–Q100)

Not a tier in the learning path. For maintaining or migrating Svelte 3/4 code, and for "how did this used to work" interview questions. Newcomers skip entirely.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 96 | LEGACY | `#legacy_reactivity` | How did reactivity work in Svelte 3 and 4, and what were the `$:` gotchas that runes were designed to fix? | You're reading an old Svelte tutorial and it uses `let` and `$:` instead of `$state` and `$derived`. What was the old model — and what specifically broke? |
| 97 | LEGACY | `#legacy_props` | How did you declare component props in Svelte 3/4, and what were `$$props` and `$$restProps`? | Old Svelte used `export let` and had magic variables for "all props" and "the rest." What problems did they cause, and what replaces them? |
| 98 | LEGACY | `#legacy_events` | What was `createEventDispatcher` and event forwarding, and what replaced them? | Old Svelte required a setup function to emit events and had special forwarding syntax. What was the ceremony, and what's the modern callback-prop equivalent? |
| 99 | LEGACY | `#legacy_slots` | What were slots, named slots, and `<svelte:component>` in Svelte 3/4, and what deprecated them? | Old Svelte used `<slot>` for content projection and a special element for dynamic components. What could they do, and what replaced each? |
| 100 | LEGACY | `#migration` | How do you migrate a Svelte 4 codebase to Svelte 5, and what most commonly breaks? | You've inherited a Svelte 4 app. What's the migration tool, what can it automate, and which patterns (`$:`, `createEventDispatcher`, slots) must you convert by hand? |

---

# PART TWO — SVELTEKIT (Q101–Q210)

## ❱ CORE (Kit) — SvelteKit on-ramp (Q101–Q135)

The minimum path that takes a Svelte newcomer to "I can build and ship a SvelteKit app with routing, data loading, forms, and SSR." Assumes Svelte CORE (Q1–Q35) as prerequisite.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 101 | ❱ CORE (Kit) | `#kit_overview` | What is SvelteKit, and how does it relate to Svelte? | You know Svelte is a UI component compiler. So what is SvelteKit — and do you need it to use Svelte? |
| 102 | ❱ CORE (Kit) | `#project_setup` | How do you create and run a SvelteKit project, and what files does it give you? | You ran `npx sv create`. Now there's a folder full of files you don't recognize. What's the dev server, and what is each part of the project for? |
| 103 | ❱ CORE (Kit) | `#project_structure` | What is the structure of a SvelteKit project, and what are the key files and directories? | `src/routes`, `src/lib`, `src/app.html`, `svelte.config.js`, `vite.config.js`. What does each one do, and which ones do you actually edit? |
| 104 | ❱ CORE (Kit) | `#lib` | What is the `$lib` alias, and why should you use it instead of relative imports? | You're tired of `../../../components/Button.svelte`. SvelteKit gives you a cleaner way to import your own code. What is it? |
| 105 | ❱ CORE (Kit) | `#routing` | How does SvelteKit's file-based router work, and what are `+page.svelte` files? | You want a `/about` page. Where does the file go, what do you name it, and how does SvelteKit know to route to it? |
| 106 | ❱ CORE (Kit) | `#routing` | How do you create dynamic routes with parameters like `[slug]`? | You have a blog with 100 posts and you don't want 100 files. How do you write one route that handles `/blog/anything`? |
| 107 | ❱ CORE (Kit) | `#routing` | How do layouts work, and how do you share UI (nav, footer) across pages? | Your navbar and footer should appear on every page. Do you copy them into each `+page.svelte`, or is there a layout system? |
| 108 | ❱ CORE (Kit) | `#routing` | How does navigation work — links, programmatic navigation, and the URL? | You clicked a link and the page changed without a full reload. How does SvelteKit's client-side router work, and how do you navigate from code? |
| 109 | ❱ CORE (Kit) | `#app_state` | How do you read the current URL, params, and route information in a component? | Your component needs to know what page it's on, or read a query parameter. What does SvelteKit give you to inspect the current route? |
| 110 | ❱ CORE (Kit) | `#load` | How do you load data before a page renders, using `load` functions? | Your page needs data from a database or API before it can render. Where does that fetch happen — in the component, or somewhere else? |
| 111 | ❱ CORE (Kit) | `#load` | What is the difference between `+page.js` and `+page.server.js`, and when do you use each? | Two files, both called "load." One runs on the server only, one runs on both. Which do you reach for, and what can each one access? |
| 112 | ❱ CORE (Kit) | `#load` | How do you access the loaded data in your page component, and how is it typed? | Your `load` function returned data. Now how does the `+page.svelte` receive it, and how do you get TypeScript to know its shape? |
| 113 | ❱ CORE (Kit) | `#load` | How do layout `load` functions share data across pages? | Your root layout fetches the user, and every page needs it. How do you load once at the top and read it everywhere below? |
| 114 | ❱ CORE (Kit) | `#navigation` | How do you redirect from a `load` function, and how do you throw errors? | A user tried to visit a page they're not allowed to see, or the data didn't exist. How do you redirect them, or show a 404? |
| 115 | ❱ CORE (Kit) | `#form_actions` | How do you handle form submissions with form actions in `+page.server.js`? | You have a `<form>` and need to process it on the server — save to a DB, send an email. Where does that code live, and how does the form find it? |
| 116 | ❱ CORE (Kit) | `#form_actions` | What are named and default actions, and how do you handle multiple forms on one page? | One page has a login form and a signup form. How do you route each submit to the right handler? |
| 117 | ❱ CORE (Kit) | `#form_actions` | How do you return validation errors and submitted values back to the form? | The user submitted invalid data. How do you show errors next to the fields, and how do you keep what they typed without re-fetching? |
| 118 | ❱ CORE (Kit) | `#forms` | What is progressive enhancement, and what does `use:enhance` do? | Your form works without JavaScript, but you want it to feel like an SPA — no full page reload. How do you layer that on top without breaking the no-JS fallback? |
| 119 | ❱ CORE (Kit) | `#page_options` | What are page options (`ssr`, `csr`, `prerender`), and how do they control how a page renders? | Some pages should be fully server-rendered, some should be static, some should be client-only. How do you configure rendering per page? |
| 120 | ❱ CORE (Kit) | `#page_options` | What is prerendering, and when can a page be prerendered? | You want some pages to be static HTML at build time for speed and SEO. Which pages qualify, and which don't? |
| 121 | ❱ CORE (Kit) | `#rendering` | What is SSR, CSR, hydration, and SvelteKit's default hybrid rendering? | You keep hearing these four words. What do they each mean, and what does SvelteKit do by default — server-render then hydrate, or something else? |
| 122 | ❱ CORE (Kit) | `#errors` | How do error pages work — the `+error.svelte` boundary, expected vs unexpected errors? | Something threw. How does SvelteKit decide what to show the user, and how do you customize the error page? |
| 123 | ❱ CORE (Kit) | `#env` | How do you read environment variables, and what's the difference between public and private? | You have an API key the server needs and a public URL the browser needs. Where do they go, and how do you read each without leaking secrets? |
| 124 | ❱ CORE (Kit) | `#server_only` | How do you keep server-only code (and secrets) out of the client bundle? | You wrote a database query, and you're terrified it'll end up shipped to the browser. What conventions does SvelteKit enforce to prevent that? |
| 125 | ❱ CORE (Kit) | `#fetch` | How does `fetch` inside `load` differ from the browser `fetch`? | You called `fetch` in a `load` function and it just worked on the server, with cookies and everything. Why is it special? |
| 126 | ❱ CORE (Kit) | `#app_state` | How does the `$app/state` (or `$app/stores`) module expose page state reactively? | You want your component to react when the URL changes, or read the current page data. What's the modern Svelte 5 way, and what's the older store way? |
| 127 | ❱ CORE (Kit) | `#config` | What is `svelte.config.js`, and what does the `kit` namespace configure? | There's a config file with a `kit` object full of options you don't recognize. What does it actually control? |
| 128 | ❱ CORE (Kit) | `#adapters` | What is an adapter, and why does SvelteKit need one to deploy? | You ran `npm run build` and got told to install an adapter. What is an adapter, why are there many, and how do you pick? |
| 129 | ❱ CORE (Kit) | `#build` | How do you build and preview your SvelteKit app for production? | You're ready to deploy. What does the build produce, how do you check it locally before shipping, and what changed from dev mode? |
| 130 | ❱ CORE (Kit) | `#routing` | How do you create an API endpoint (a `+server.js` file) that returns JSON? | You need a backend route — `/api/users` that returns JSON. Where does it go, what HTTP methods does it handle, and what does it return? |
| 131 | ❱ CORE (Kit) | `#app_html` | What is `app.html`, and how do you customize the document shell? | You need to add a `<meta>` tag, change the `<html lang>`, or wrap the app in a specific div. Where does that markup live? |
| 132 | ❱ CORE (Kit) | `#app_state` | How do you read navigation state — is a navigation in progress, where did it come from? | You want to show a loading bar during navigation, or know whether the user arrived via a link or a form. What does SvelteKit expose? |
| 133 | ❱ CORE (Kit) | `#head` | How do you set the document title and meta tags per page? | Each route should set its own `<title>` and `<meta>` tags. How do you write to `document.head` from a SvelteKit page? |
| 134 | ❱ CORE (Kit) | `#typescript` | How does SvelteKit generate types for your routes and data automatically? | You typed `load` and suddenly the data in your page component was typed for free. Where did those types come from? |
| 135 | ❱ CORE (Kit) | `#web_standards` | What web platform APIs (fetch, Request, Response, Headers, FormData, URL) does SvelteKit build on? | You keep hearing "use the platform." Which standard Web APIs does SvelteKit lean on instead of inventing its own abstractions? |

## ❱❱ MORE (Kit) — SvelteKit feature tour (Q136–Q185)

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 136 | ❱❱ MORE (Kit) | `#routing` | How do advanced routing features work — rest params, optional params, matchers, and layout groups? | You need `/[...path]` to capture multiple segments, `[[lang]]` to be optional, or `(group)` folders that don't affect the URL. What are the routing power features? |
| 137 | ❱❱ MORE (Kit) | `#routing` | How do you break out of layouts, and reset to a different layout level? | Your page is nested three layouts deep but should render with only the root layout. How do you opt out mid-tree with `@`? |
| 138 | ❱❱ MORE (Kit) | `#link_options` | What are the `data-sveltekit-*` attributes, and how do they control preload, reload, scroll, and focus? | You want certain links to preload on hover, some to do a full reload, some to not scroll to top. How do you configure per-link behavior? |
| 139 | ❱❱ MORE (Kit) | `#load` | How does `load` invalidation work — when do `load` functions re-run? | You mutated data and the page didn't update, or it re-ran when it didn't need to. What triggers a `load` to re-run, and how do you control it? |
| 140 | ❱❱ MORE (Kit) | `#load` | How do `invalidate`, `invalidateAll`, and `depends` differ? | Sometimes you want to invalidate one piece of data, sometimes all of it, sometimes declare a custom dependency. What's the difference? |
| 141 | ❱❱ MORE (Kit) | `#load` | How do you avoid load waterfalls, and when do `load` functions run in parallel? | Your page is slow because `load` calls are waiting on each other. How do you make them parallel, and when does SvelteKit already do that for you? |
| 142 | ❱❱ MORE (Kit) | `#load` | How do you stream data with promises, and show a loading state for slow data? | Most of your data loads fast, but one piece is slow. How do you stream the slow part and show a skeleton UI for just that piece? |
| 143 | ❱❱ MORE (Kit) | `#load` | What can a universal `load` (`+page.js`) do that a server `load` can't, and vice versa? | Universal loads can return anything; server loads can access the database. When does each win, and what are the serialization rules? |
| 144 | ❱❱ MORE (Kit) | `#load` | How do you access parent layout data with `await parent()`, and avoid waterfalls? | Your page load needs data from the layout load. How do you read it, and how do you order the calls to avoid a slow chain? |
| 145 | ❱❱ MORE (Kit) | `#form_actions` | How do you customize `use:enhance` — handle the result, run code before submit, cancel, update? | The default enhance is too magic. How do you take manual control: show a spinner, cancel a duplicate submit, or apply the result yourself? |
| 146 | ❱❱ MORE (Kit) | `#form_actions` | How do GET forms differ from POST forms, and how do they interact with the router? | You used `method="GET"` on a form and it behaved like a link, updating the URL. What's going on, and when is a GET form useful? |
| 147 | ❱❱ MORE (Kit) | `#hooks` | What are SvelteKit's hooks (`handle`, `handleError`, `handleFetch`), and what are they for? | You need to run code on every request — authenticate, log errors, rewrite a fetch. Where does that cross-cutting logic live? |
| 148 | ❱❱ MORE (Kit) | `#hooks` | How do you use `event.locals` to attach per-request data like the authenticated user? | You authenticated the user in `handle`. How do you pass that user down to every `load` and action without re-fetching it? |
| 149 | ❱❱ MORE (Kit) | `#hooks` | How do you combine multiple `handle` hooks with `sequence`? | You have an auth hook, a logging hook, and a CSP hook. How do you chain them, and in what order do they run? |
| 150 | ❱❱ MORE (Kit) | `#errors` | How do you customize the error shape with `App.Error`, and safely send errors to the client? | You want to attach a `code` or `traceId` to errors, but not leak the stack. How do you type and shape errors safely? |
| 151 | ❱❱ MORE (Kit) | `#errors` | How do you customize the fallback `error.html`, and when is it used instead of `+error.svelte`? | The error is in the root layout, so `+error.svelte` can't render. What's the lower-level fallback, and how do you customize it? |
| 152 | ❱❱ MORE (Kit) | `#server_only` | How do `$env/static/private`, `$env/dynamic/private`, `$env/static/public`, and `$env/dynamic/public` differ? | Four env modules. When does each reload, which are server-only, and which get baked into the build versus read at runtime? |
| 153 | ❱❱ MORE (Kit) | `#server_only` | What is `$lib/server`, and how does SvelteKit prevent server code from leaking to the client? | You put database code in `$lib/server`. What guarantees it won't end up in the browser bundle, even if you import it transitively? |
| 154 | ❱❱ MORE (Kit) | `#state_management` | How do you manage state across server and client without leaking data between users? | You stored a user's data in a module-level variable and another user saw it. What's the rule about shared state on the server, and what are the safe patterns? |
| 155 | ❱❱ MORE (Kit) | `#state_management` | How do you preserve component state across navigations, or force a reset? | You navigated to a new page and your old state leaked in — or you wanted to preserve scroll position and lost it. How do you control component lifetime across navigation? |
| 156 | ❱❱ MORE (Kit) | `#state_management` | How do you use the URL as a state store — search params, shallow routing, history state? | You want a filter to live in the URL so it's shareable and survives a refresh. How do you read and write URL state, and what's shallow routing? |
| 157 | ❱❱ MORE (Kit) | `#navigation` | How do `beforeNavigate`, `afterNavigate`, and `onNavigate` lifecycle callbacks work? | You want to track page views, confirm navigation away from a dirty form, or run a view transition. What hooks fire around navigation? |
| 158 | ❱❱ MORE (Kit) | `#navigation` | How do `preloadData` and `preloadCode` speed up navigation? | You want links to feel instant. How do you preload the code and data for a route before the user clicks? |
| 159 | ❱❱ MORE (Kit) | `#snapshots` | How do you capture and restore ephemeral DOM state across navigation with snapshots? | The user scrolled halfway through a list and navigated away. When they come back, the scroll is gone. How do you save and restore that state? |
| 160 | ❱❱ MORE (Kit) | `#rendering` | How do you build a fully static site (SSG) with `adapter-static`? | Your site has no dynamic data — it's a marketing site or a docs site. How do you prerender the whole thing to static HTML? |
| 161 | ❱❱ MORE (Kit) | `#rendering` | How do you build a single-page app (SPA) with SvelteKit? | You want a client-rendered SPA — no SSR at all. How do you configure that, and what are the SEO and perf trade-offs? |
| 162 | ❱❱ MORE (Kit) | `#rendering` | How do you mix rendering modes — prerender some pages, SSR others, SPA the rest? | Your marketing pages should be static, your app should be SSR'd, and one page should be client-only. How do you configure that per route? |
| 163 | ❱❱ MORE (Kit) | `#page_options` | How does `trailingSlash` work, and why does it matter for SEO and static hosts? | Your URLs work with or without a trailing slash, and that's hurting SEO. How do you normalize, and what does the setting actually do? |
| 164 | ❱❱ MORE (Kit) | `#config` | How do you configure paths (`base`, `assets`), aliases, and the prerenderer in `svelte.config.js`? | Your app lives in a subdirectory, or your assets are on a CDN. How do you tell SvelteKit where everything is? |
| 165 | ❱❱ MORE (Kit) | `#build` | What does the build produce, and how do you optimize it — precompress, bundle analysis, code splitting? | Your bundle is large. What does SvelteKit produce by default, how do you inspect it, and how do you ship compressed output? |
| 166 | ❱❱ MORE (Kit) | `#adapters` | How do you deploy to Vercel, Netlify, Cloudflare, or your own Node server? | You need to pick an adapter and deploy. What's different about each platform, and what platform-specific options does each adapter expose? |
| 167 | ❱❱ MORE (Kit) | `#adapters` | How does `adapter-node` work for self-hosting, and what env vars and options does it need? | You're deploying to a VPS or a Docker container. What does the Node adapter produce, and how do you configure origin, port, and proxy headers? |
| 168 | ❱❱ MORE (Kit) | `#service_workers` | How do you add a service worker for offline support and caching? | You want your app to work offline, or cache assets for speed. Where does the service worker live, and what does the `$service-worker` module give you? |
| 169 | ❱❱ MORE (Kit) | `#head` | How do you do advanced `<svelte:head>` work, and how does it interact with SSR? | You need to set meta tags from a load function, or handle head content during streaming. How does head management work end to end? |
| 170 | ❱❱ MORE (Kit) | `#remote_functions` | What are SvelteKit's experimental remote functions, and what problem do they solve? | You've heard about a new type-safe way to call server code from the client without writing `+server.js` endpoints. What is it, and should you use it? |
| 171 | ❱❱ MORE (Kit) | `#forms` | How do you handle file uploads in SvelteKit forms? | You need users to upload a profile photo. How do you handle `multipart/form-data`, where does the file arrive on the server, and how do you process it? |
| 172 | ❱❱ MORE (Kit) | `#api_routes` | How do `+server.js` endpoints work in depth — streaming, content negotiation, HEAD/OPTIONS? | You're building a real API. How do you stream responses, handle CORS, support HEAD requests, and serve JSON vs HTML based on the `Accept` header? |
| 173 | ❱❱ MORE (Kit) | `#app_state` | How does `$app/state` differ from the deprecated `$app/stores`, and how do you migrate? | Your old code uses `$page`. The new docs use `page`. What changed, why, and how do you migrate? |
| 174 | ❱❱ MORE (Kit) | `#auth` | How do you implement authentication in SvelteKit — cookies, `locals`, hooks? | You need login, logout, and protected routes. What's the canonical SvelteKit pattern, and where does each piece live? |
| 175 | ❱❱ MORE (Kit) | `#cookies` | How do the `cookies` API and `setHeaders` work in `load` and actions? | You need to set a cookie in an action, or read one in `load`. What's the API, and what's the gotcha about `set-cookie` vs `setHeaders`? |
| 176 | ❱❱ MORE (Kit) | `#performance` | What performance optimizations does SvelteKit give you out of the box, and how do you measure? | Your app feels slow. What is SvelteKit already doing for you (code splitting, preloading, parallel loads), and how do you measure what's left? |
| 177 | ❱❱ MORE (Kit) | `#images` | How do you optimize images in SvelteKit? | Your LCP image is huge and hurting your Core Web Vitals. What does `@sveltejs/enhanced-img` do, and when do you reach for a CDN? |
| 178 | ❱❱ MORE (Kit) | `#a11y` | What accessibility features does SvelteKit provide by default — route announcements, focus management? | You navigated to a new page and the screen reader didn't announce it. Or did it? What does SvelteKit do for a11y out of the box, and how do you customize it? |
| 179 | ❱❱ MORE (Kit) | `#seo` | How do you handle SEO — sitemaps, structured data, canonical URLs? | You want Google to index your site properly. How do you generate a sitemap, set canonical URLs, and add structured data? |
| 180 | ❱❱ MORE (Kit) | `#packaging` | How do you build and publish a Svelte component library with `@sveltejs/package`? | You want to share your components as an npm package. What does `svelte-package` produce, and how do you configure `exports` so consumers can import it? |
| 181 | ❱❱ MORE (Kit) | `#integrations` | How do you add integrations — Tailwind, Vitest, Playwright, mdsvex — with `sv add`? | You want to add Tailwind, set up testing, or write Markdown. What's the `sv add` command, and what does it actually do to your project? |
| 182 | ❱❱ MORE (Kit) | `#fetch` | How do you call external APIs from `load`, and how do you handle CORS and credentials? | Your `load` function calls a third-party API and it works in the browser but fails on the server (or vice versa). What's going on with cookies and CORS? |
| 183 | ❱❱ MORE (Kit) | `#typescript` | How do you type `load`, actions, and `App.Locals`/`App.Error`/`App.PageState`? | You want end-to-end type safety from `load` return to page prop. How do you declare the `App.*` interfaces, and where do they plug in? |
| 184 | ❱❱ MORE (Kit) | `#debugging` | How do you debug a SvelteKit app — client and server, breakpoints, devtools? | Your server code is misbehaving and `console.log` isn't enough. How do you set breakpoints in both client and server code? |
| 185 | ❱❱ MORE (Kit) | `#env` | How do you handle environment variables across dev, preview, and production? | Your env vars work in dev but break in production. What's loaded when, and how do you handle `.env` files, deploy-platform env, and build-time vs runtime? |

## ❱❱❱ ADVANCED (Kit) — SvelteKit deep mechanics (Q186–Q210)

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 186 | ❱❱❱ ADVANCED (Kit) | `#load` | How does SvelteKit's dependency tracking for `load` actually work, including the subtle rules? | Your `load` re-ran when it shouldn't have — or didn't when it should. What exactly is tracked: params, URL, searchParams (granularly?), parent, fetched URLs? |
| 187 | ❱❱❱ ADVANCED (Kit) | `#load` | How do you architect authentication across hooks vs page load vs layout load, and avoid the common gotchas? | Auth feels like it should be simple, but layout `load` doesn't run on every request, and page/layout loads run concurrently unless you use `parent()`. What are the real strategies? |
| 188 | ❱❱❱ ADVANCED (Kit) | `#hooks` | How do `transformPageChunk`, `filterSerializedResponseHeaders`, and `preload` resolve options work? | You need to modify the HTML before it ships, filter which headers get inlined, or control which assets preload. What are the advanced `resolve` options? |
| 189 | ❱❱❱ ADVANCED (Kit) | `#hooks` | How do universal hooks (`hooks.js`) differ from server hooks, and what are `init`, `reroute`, and `transport`? | There's a third hooks file beyond `hooks.server.js` and `hooks.client.js`. What runs where, and what are the rare hooks for rerouting and custom type transport? |
| 190 | ❱❱❱ ADVANCED (Kit) | `#errors` | How do errors propagate through `handleError`, `+error.svelte`, the static fallback, and `transformError` on the server? | An error threw deep in your app. What's the full chain — `handleError`, the nearest boundary, the static `error.html`, and how does `transformError` carry it across SSR safely? |
| 191 | ❱❱❱ ADVANCED (Kit) | `#rendering` | How does hydration actually work in SvelteKit, and how do you handle version skew between deployments? | You deployed a new version while users had the old one open. What happens, and how does SvelteKit's skew protection (and `updated.check()`) handle it? |
| 192 | ❱❱❱ ADVANCED (Kit) | `#remote_functions` | How do remote functions (`query`, `form`, `command`, `prerender`) work in depth — caching, batching, single-flight mutations? | You've gone beyond the basics. How do query deduplication, `query.batch` for n+1, `query.live` for subscriptions, and single-flight command mutations actually work? |
| 193 | ❱❱❱ ADVANCED (Kit) | `#adapters` | How do you write a custom adapter, and what is the `Adapter` API contract? | No official adapter fits your platform. What are `name`, `adapt`, `emulate`, and `supports`, and how do you produce deployable output from the builder? |
| 194 | ❱❱❱ ADVANCED (Kit) | `#service_workers` | How do you implement advanced caching strategies with the `$service-worker` module? | You want cache-first for assets, network-first for data, and proper cache invalidation on deploys. How do you wire it up? |
| 195 | ❱❱❱ ADVANCED (Kit) | `#api_routes` | How do you build streaming endpoints, server-sent events, and long-lived connections in `+server.js`? | You need a streaming response, an SSE endpoint, or a WebSocket-like pattern. How do `ReadableStream` and `Response` make that work in a `+server.js`? |
| 196 | ❱❱❱ ADVANCED (Kit) | `#state_management` | How does state flow during SSR and hydration, and what causes the "flash of wrong content"? | Your SSR'd page shows one thing, then flashes to another after hydration. What's happening, and how do you avoid the mismatch? |
| 197 | ❱❱❱ ADVANCED (Kit) | `#navigation` | How do view transitions work in SvelteKit, and how do you orchestrate them with `onNavigate`? | You want page transitions like a native app. How does `onNavigate` + `document.startViewTransition` work, and what are the gotchas? |
| 198 | ❱❱❱ ADVANCED (Kit) | `#forms` | How do you build a fully custom form submission flow with `applyAction`, `deserialize`, and the action result protocol? | You've outgrown `use:enhance`. How do the primitives underneath work — `applyAction`, `ActionResult` types, `deserialize` for Date/BigInt — and when do you need them? |
| 199 | ❱❱❱ ADVANCED (Kit) | `#config` | What are the advanced `kit.*` config options — CSP, CSRF, `paths.relative`, `version`, service worker config? | You're hardening a production app. How do you configure Content Security Policy, CSRF protection, cache-busting versioning, and other security/stability options? |
| 200 | ❱❱❱ ADVANCED (Kit) | `#fetch` | How does SvelteKit's internal `fetch` work — response capture, inlining into HTML, and `handleFetch` rewriting? | Your `fetch` in `load` was somehow replayed in the browser without a second HTTP call. What's the mechanism, and how do you intercept it with `handleFetch`? |
| 201 | ❱❱❱ ADVANCED (Kit) | `#packaging` | How do you author a publishable library with correct `exports`, conditions, types, and tree-shaking? | Your component library breaks for consumers — wrong types, missing exports, can't tree-shake. How do you structure `exports`, `svelte`/`types` conditions, and `sideEffects`? |
| 202 | ❱❱❱ ADVANCED (Kit) | `#performance` | How do you diagnose and fix waterfalls — client, server, universal load, and backend? | Your app is slow and you don't know why. How do you trace waterfalls across the network, the server, the universal load, and the database? |
| 203 | ❱❱❱ ADVANCED (Kit) | `#rendering` | How does partial prerendering work, and when is it the right rendering strategy? | You've heard SvelteKit can prerender some pages on demand at the edge. What is partial prerendering / ISR, how does it differ from build-time prerender, and when does each win? |
| 204 | ❱❱❱ ADVANCED (Kit) | `#observability` | How do you add observability and tracing to a SvelteKit server? | You need to know where time is going in production — which load, which action, which hook. How do you wire up OpenTelemetry and `instrumentation.server.ts`? |
| 205 | ❱❱❱ ADVANCED (Kit) | `#testing` | How do you test SvelteKit code — load functions, actions, endpoints, and integration? | You can unit test a component, but how do you test a `load` function or a form action that depends on `RequestEvent`, cookies, and the request? |
| 206 | ❱❱❱ ADVANCED (Kit) | `#typescript` | How do you build fully typed SvelteKit apps — generated `$types`, `App.*` interfaces, param typing? | You want a missing prop or a wrong action name to fail at compile time. How do the generated `$types` work, and how do you extend the `App.*` interfaces? |
| 207 | ❱❱❱ ADVANCED (Kit) | `#routing` | How does route sorting and matching actually work — specificity, matchers, encoding edge cases? | Two routes both seem to match a URL. Which wins, and why? And how do matchers, rest params, and Unicode encoding factor into route resolution? |
| 208 | ❱❱❱ ADVANCED (Kit) | `#cookies` | How do cookies actually flow through SSR, hydration, `handle`, `load`, and actions — including subdomain gotchas? | Your auth cookie works in dev but not in production behind a proxy. How do cookies really move through a SvelteKit request, and what breaks them? |
| 209 | ❱❱❱ ADVANCED (Kit) | `#api_routes` | How do you handle CORS, CSRF, and content negotiation rigorously in `+server.js` endpoints? | You're building a public API. How do you handle preflight, set proper CORS headers, defend against CSRF, and serve the right content type? |
| 210 | ❱❱❱ ADVANCED (Kit) | `#migration` | How do you migrate from SvelteKit 1 to 2, and what breaking changes most commonly bite? | You have an older SvelteKit app. What changed in 2.x — `error`/`redirect` no longer thrown, cookie `path` required, promises not auto-awaited — and how do you migrate? |
