# React + React Server Interview Questions

A unified, dependency-ordered curriculum of **180 questions**: React (1–100) and React Server (101–180). One continuous numbering scale, sections stacked one under the other, so any question can be cited by its number (e.g. "write the lecture for Q47").

## Format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|

- **#** — Stable unique ID. Continuous 1–180. Cite any question by number.
- **Tier** — `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth; `LEGACY` for migration reference. React Server uses the same three tiers with a `(Server)` suffix on the depth word for clarity, e.g. `❱ CORE (Server)`.
- **Topic** — One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question** — Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook** — Pain-point framing. Becomes the seed of the lecture's Hook Ladder opening.


## Pedagogical Philosophy & Curriculum Design

This curriculum is structured around the modern mental models of React 19, heavily inspired by the official `react.dev` documentation, but adapted specifically for lecture sequencing and interview preparation. 

Key pedagogical decisions:
- **Describing the UI before Magic:** We introduce component anatomy and JSX before teaching how it mounts to the screen (`createRoot`), ensuring the student understands what is being mounted.
- **Form Actions as a First-Class Default:** React 19 deprecates manual `onSubmit` handlers and controlled inputs as the default way to handle data. Thus, `useActionState` and Form Actions are taught in the **CORE** module as the primary way to handle forms, relegating controlled inputs to a specialized pattern for complex interactive UI.
- **`use()` API for Context:** Context is taught using the modern `use(Context)` API rather than the legacy `useContext` hook, aligning with React 19's direction.
- **Thinking in React as a Synthesis:** "Thinking in React" is positioned as the final capstone of the CORE module. Instead of front-loading it as an abstract concept, students build their architecture intuition *after* they fully understand state, props, and escape hatches.
- **Strict Server Separation:** React Server Components (RSC) and Server Functions are strictly quarantined in Part Two. This prevents beginners from being overwhelmed by the `'use client'` boundary before they grasp basic client-side reactivity.

## How the count is grounded

| Course | Docs files audited | Teachable concepts (after honest stripping) | Target questions |
|---|---:|---:|---:|
| React | ~120 | ~730 | 100 |
| React Server | ~40 | ~230 | 80 |
| **Total** | **~160** | **~960** | **180** |

A good interview question bundles 4–6 related concepts around one mechanism. `960 / ~5.5 ≈ 180`. The split reflects React's denser client-side interview surface (hooks, state, effects, performance each carry heavy mechanics), while the server course covers the leaner but deep RSC, streaming, and resume surfaces.

## Reading paths

- **Pure newcomer:** Read ❱ CORE in order, both courses. You will be able to build and ship a React app that renders on the server.
- **Working developer:** Finish ❱ CORE (both), then dip into ❱❱ MORE by topic as your work demands.
- **Interview prep:** Skim ❱ CORE, drill ❱❱❱ ADVANCED.
- **Maintaining old code:** Read the LEGACY appendixes (Q96–Q100, Q176–Q180).

---

# PART ONE — REACT (Q1–Q100)

## ❱ CORE — React on-ramp (Q1–Q39)

The minimum path that takes a complete newcomer to "I can build a working React app with components, props, state, events, lists, forms, and effects." Read in order. Zero legacy content.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 1 | ❱ CORE | `#what_is_react` | What is React, and how does its declarative, component-based model differ from plain JavaScript DOM scripting? | The National Times masthead shows the logged-in reader's name in ten places. With plain JavaScript, one name change means finding and rewriting ten DOM nodes by hand. React promises you never touch the DOM again. What replaces it? |
| 2 | ❱ CORE | `#project_setup` | How do you create and run a new React project, and how do you choose between a framework and a build tool? | You want to start a React app today. The docs warn that a framework can be overkill and also recommend one for real apps. What do you actually run, and how do you choose? |
| 3 | ❱ CORE | `#component_anatomy` | What is a React component, and what rules govern how you write one? | Your first file exports a function that returns HTML-looking text, and the browser renders it. What exactly is that function, and why must its name start with a capital letter? |
| 4 | ❱ CORE | `#create_root` | You wrote `App.jsx`. How does it actually get onto the page? | React is called a library, not a framework. So which API takes your root component and mounts it into the `div` in index.html, and what does it return? |
| 5 | ❱ CORE | `#jsx` | What is JSX, and what rules must every snippet follow? | You paste a block of HTML into your component and the build fails: an unclosed tag, two roots, a `class` attribute. JSX looks like HTML but is not. What are its rules? |
| 6 | ❱ CORE | `#jsx_expressions` | How do you use JavaScript expressions inside JSX with curly braces? | You have a headline string in your script and want it inside the markup, and a variable that should drive an attribute. How does markup read your variables? |
| 7 | ❱ CORE | `#imports` | How do you split components across files, and how do default and named imports differ? | Your App.jsx holds five components in a thousand lines. How do you give each its own file and reference it without breaking the import? |
| 8 | ❱ CORE | `#props` | How do you pass data into a component, and why can a component never change its own props? | You built a `Button` component, but every copy renders the same label. How do you give each one its own text? And why does React complain the moment a child tries to assign to a prop? |
| 9 | ❱ CORE | `#children` | How do the `children` prop, spread attributes, and default values work? | Sometimes you pass a component content between its tags, sometimes you forward everything the parent gave you, and sometimes a prop should fall back to a default. What are the three mechanisms? |
| 10 | ❱ CORE | `#conditional_rendering` | How do you show, hide, or switch JSX based on a condition? | The login form should appear when signed out, the dashboard when signed in, and the notification badge only when the count is not zero. How do you branch markup? |
| 11 | ❱ CORE | `#rendering_lists` | How do you render a list from an array, and why does React demand a key on every item? | You have thirty headlines and want a row for each. React renders them but floods the console with a key warning. What is a key, and what breaks without one? |
| 12 | ❱ CORE | `#purity` | What does it mean for a component to be pure, and what breaks when it is not? | Your component reads a global variable and writes to another during render. It works once, then shows wrong data after a re-render. Why does React insist components be pure? |
| 13 | ❱ CORE | `#ui_tree` | How does React see your UI as a tree, and why does that view matter? | Your app is a pile of imports and components. React sees three trees inside it: the module tree, the component tree, the render tree. Which tree explains re-renders, and which explains slow imports? |
| 14 | ❱ CORE | `#event_handling` | How do you respond to user events like clicks and typing? | A click on a headline should open the article, and the handler needs the event's details. Where does the handler go, and what is that event object? |
| 15 | ❱ CORE | `#use_state` | Why do ordinary variables forget their values between renders, and how does `useState` remember? | You increment a local variable on click and the headline never changes. The variable resets on every render, and React never hears about your change. What does `useState` actually give you? |
| 16 | ❱ CORE | `#state_snapshots` | Why does state appear frozen inside a render, even right after you set it? | You call `setCount(count + 1)` and immediately print `count`, and the old number appears. Did the set fail, or is something deeper going on? |
| 17 | ❱ CORE | `#state_updates` | How does React queue multiple state updates, and when do you need an updater function? | One click handler calls `setCount` three times and the counter only goes up by one. What happened to the other two updates, and why does `setCount(c => c + 1)` fix it? |
| 18 | ❱ CORE | `#state_objects` | How do you update an object in state without mutating it? | You write `user.name = 'Alice'` on your state object and nothing re-renders. The object changed, but React did not see it. Why does React require a new object? |
| 19 | ❱ CORE | `#state_arrays` | How do you add, remove, insert, and reorder items in a state array? | `push`, `splice`, `sort`: all of them change the array in place, and all of them leave tonight's story list unchanged on screen. What are the immutable recipes for every list operation? |
| 20 | ❱ CORE | `#controlled_inputs` | How do you make an input, textarea, or select fully controlled by React state? | You type into the correction field and React state never hears about it, or you set state and the field ignores you. How do `value` and `onChange` work together to make React the single source of truth? |
| 21 | ❱ CORE | `#reacting_to_input` | How do you design a component that reacts to input with state instead of touching the DOM? | Your instinct is to show and hide page parts by toggling classes on DOM nodes. React's pattern is the reverse: change state, let the render follow. How does a state machine replace DOM poking? |
| 22 | ❱ CORE | `#forms` | Should a form be controlled state or uncontrolled refs, and how do you choose? | Controlled inputs re-render on every keystroke; uncontrolled inputs only reveal their values at submit. What are the real trade-offs, and where does each strategy win? |
| 23 | ❱ CORE | `#form_actions` | What is the `action` prop on a form, and how do actions change form handling? | React 19 lets the form tag take a function instead of a URL. What does an action receive, what can it return, and what manual work does it replace? |
| 24 | ❱ CORE | `#use_action_state` | How does `useActionState` manage a form's submitted state and pending flag? | You need the last action's returned message and a pending indicator, without hand-rolled `useState` bookkeeping next to every form. What does `useActionState` track? |
| 25 | ❱ CORE | `#use_form_status` | How does a field nested deep in a form read the form's pending state? | The submit button lives three components inside the form, and passing `pending` down through all of them is prop drilling. How does `useFormStatus` reach the enclosing form? |
| 26 | ❱ CORE | `#state_structure` | How do you decide which values belong in state and which are derived? | You store the filtered story list, the filter text, and the result count as three separate states, and they drift out of sync. Which of those should never have been state at all? |
| 27 | ❱ CORE | `#lifting_state` | How do two sibling components share one changing value? | The search field lives in the Header and the results live in the Main. Neither can see the other's state. Where does shared state live, and who owns it? |
| 28 | ❱ CORE | `#component_identity` | Why does state sometimes vanish, or survive, when you did not expect it? | You swap two steps of a form by changing a condition, and everything the reader typed disappears. Or you replace a component with another and the old state follows it. How does React decide which state belongs to which component? |
| 29 | ❱ CORE | `#use_reducer` | When does state logic outgrow `useState`, and how does a reducer consolidate it? | One component holds eight `useState` calls whose update rules scatter across five event handlers. How does `useReducer` gather every change into one function you can test? |
| 30 | ❱ CORE | `#context` | How do you pass data many levels deep without prop drilling, and how does the `use()` API read it? | The edition theme is chosen at the root, and a button six levels down needs it. Every layer in between passes a prop it never uses. What is the shortcut? |
| 31 | ❱ CORE | `#reducer_context` | How do you combine a reducer with context for app-wide state? | Your cart state and its update functions drill through four layers of components. How do reducer plus context give every component direct access without the drilling? |
| 32 | ❱ CORE | `#use_effect` | How do you connect a component to an external system, and how do you disconnect it? | You subscribe to a live wire feed in the component body, and after six renders you have six subscriptions. Where does synchronization code belong, and what is cleanup for? |
| 33 | ❱ CORE | `#no_effect` | When do you not need an Effect, and what replaces it? | You wrote an effect to recompute the payout total when a story lands, and another to react to a save click. Both run, both are wrong. When is an effect the wrong tool? |
| 34 | ❱ CORE | `#custom_hooks` | How do you extract and reuse stateful logic between components? | Two components need the same online-status logic, and copy-pasting their `useState` and `useEffect` blocks will drift apart. How does a custom hook share logic without sharing state? |
| 35 | ❱ CORE | `#dom_refs` | How do you reach a DOM node from React to focus it or measure it? | The correction input must receive focus the moment it appears, and a chart needs an element's width. How does the `ref` attribute hand you the real DOM node? |
| 36 | ❱ CORE | `#use_ref` | How do you keep a value between renders without triggering a re-render? | An interval ID must survive re-renders, but storing it in state re-renders the app every time it changes. What is the box that keeps values silently? |
| 37 | ❱ CORE | `#strict_mode` | Why does React render your components twice in development? | Your `console.log` inside the component prints everything twice, and you think React is broken. It is StrictMode auditing your code. What is it looking for? |
| 38 | ❱ CORE | `#thinking_in_react` | What is the step-by-step process for building a UI in React? | You receive a design mock and do not know where to start. React's own method says: break it into components, build a static version, find the state, wire it down, add the reverse flow. How do the five steps go? |
| 39 | ❱ CORE | `#typescript` | How do you use TypeScript with React, and how do you type props, events, and hooks? | You want the compiler to catch a wrong prop before the browser does. How do you type a component's props, a change event, and a `useState` that starts as null? |

## ❱❱ MORE — React feature tour (Q40–Q70)

Features a working developer eventually needs. Dip in by topic. Assumes CORE as prerequisite.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 40 | ❱❱ MORE | `#render_commit` | What are the trigger, render, and commit phases, and what runs in each? | You set state and the screen updates. Between those moments React calls your components again and then touches the DOM. Which of your code runs in which phase, and when do effects fire? |
| 41 | ❱❱ MORE | `#rules_of_hooks` | Why must hooks be called at the top level, and only from React functions? | You put a `useState` inside an `if` statement and the app crashes on the second render with a hook order error. Why does call order, not names, identify your hooks? |
| 42 | ❱❱ MORE | `#effect_lifecycle` | What is the lifecycle of a reactive effect as its dependencies change? | Your effect opens a connection, then a dependency changes, and you now have two connections. React runs cleanup before every re-setup. What is the exact sequence? |
| 43 | ❱❱ MORE | `#effect_dependencies` | How do you remove unnecessary effect dependencies, and when must a dependency stay? | The lint plugin demands a dependency you know does not matter, and your effect loops when you add it. When is a dependency truly removable, and how do you prove it? |
| 44 | ❱❱ MORE | `#effect_events` | How do you keep non-reactive values from re-running an effect? | Your effect reads a value it only needs at event time, but listing that value as a dependency re-runs the whole synchronization. What is `useEffectEvent` for? |
| 45 | ❱❱ MORE | `#use_memo` | What does `useMemo` cache, and when is it wasted work? | Someone told you to wrap every calculation in `useMemo`. When does caching a cheap computation cost more than it saves, and when is it essential? |
| 46 | ❱❱ MORE | `#use_callback` | What does `useCallback` do, and when do you actually need it? | You memoized a component and it still re-renders, because the function prop you pass is a new reference every render. When does caching the function itself matter? |
| 47 | ❱❱ MORE | `#memo` | When does a component re-render, and how does `React.memo` skip re-renders? | The parent re-rendered and every child re-rendered, even the ones whose props did not change. What are the three reasons a component re-renders, and which one does `memo` block? |
| 48 | ❱❱ MORE | `#virtualization` | How do you render a list of ten thousand items without rendering ten thousand rows? | The archive page renders 10,000 published stories and the browser chokes. Only twenty rows are visible at once. What is windowing, and where does React's documentation point you? |
| 49 | ❱❱ MORE | `#lazy` | How do you code-split a component and load it on demand with `lazy`? | Your bundle ships the admin analytics screen to every reader, and readers never open it. How does `lazy` plus `Suspense` load a component only when it renders? |
| 50 | ❱❱ MORE | `#suspense` | How does `Suspense` display fallbacks, and where should boundaries sit? | One slow weather widget freezes the entire homepage. How does a Suspense boundary let the rest of the page paint first, and how granular should boundaries be? |
| 51 | ❱❱ MORE | `#error_boundaries` | How do you catch a rendering error before it unmounts the whole app? | One malformed article object throws inside render and the entire site goes white. Why can a try/catch not help here, and what does an error boundary give you? |
| 52 | ❱❱ MORE | `#use_id` | How do you generate IDs that are unique, stable, and safe across server and client? | Label and input pairs need matching `id` attributes. `Math.random` produces different values on server and client and hydration fails. What does `useId` guarantee? |
| 53 | ❱❱ MORE | `#use_transition` | How do you keep typing responsive while a big re-render runs? | Each keystroke triggers a search across 10,000 stories and the input freezes until the render finishes. How does marking an update as a transition keep the typing smooth? |
| 54 | ❱❱ MORE | `#use_deferred_value` | What does `useDeferredValue` defer, and how is it different from a transition? | The search results list re-renders on every keystroke and lags behind the input. How does deferring the value keep the old list on screen while the new one computes? |
| 55 | ❱❱ MORE | `#reconciliation` | When React re-renders, how does it decide which DOM nodes to update? | You always heard the words "virtual DOM diffing". What tree does React actually diff, and which two checks, type and key, drive every reuse-or-recreate decision? |
| 56 | ❱❱ MORE | `#keys` | What makes a good key, and why is the array index a trap? | Sorting tonight's story list scrambles the correction inputs that live inside each row. React reused the wrong DOM because the keys did not follow the items. What is a key really for? |
| 57 | ❱❱ MORE | `#use_imperative_handle` | How does a child expose a focused API to its parent through a ref? | The parent must call `focus` on an input inside a child component, but the parent's ref sees the child, not the DOM node. How does `useImperativeHandle` shape what the parent receives? |
| 58 | ❱❱ MORE | `#create_portal` | How do you render a modal that escapes its parent's overflow and stacking context? | Your dropdown is clipped by a parent's `overflow: hidden`. The DOM insists on nesting. How does a portal render the same JSX somewhere else in the document? |
| 59 | ❱❱ MORE | `#fragment` | Why must JSX return one root, and how do Fragments remove the wrapper div? | Your layout component adds an extra `div` around table rows and the browser table styles break. How do Fragments group children without adding a DOM node? |
| 60 | ❱❱ MORE | `#context` | How does context propagation cause re-renders, and how do you keep it fast? | Every theme toggle re-renders two hundred components because the provider's value is a fresh object literal every render. How does context actually propagate, and how do you stop the blast radius? |
| 61 | ❱❱ MORE | `#custom_hooks` | What separates a well-designed custom hook from a fragile one? | Your custom hook returns six values, and three components each use five of them differently. When is a hook doing too much, and what does the `use` naming convention actually promise? |
| 62 | ❱❱ MORE | `#use_sync_external_store` | How do you subscribe to a store that lives outside React? | A map library holds its own mutable state. Your component must re-render when it changes, without tearing during concurrent renders. What does `useSyncExternalStore` guarantee? |
| 63 | ❱❱ MORE | `#use_debug_value` | How do you label a custom hook's internal state in DevTools? | Your custom hook shows up as an anonymous "Hook" in DevTools and nobody can tell what it holds. What does `useDebugValue` add, and when is its formatting variant worth it? |
| 64 | ❱❱ MORE | `#flush_sync` | What does `flushSync` do, and when is it the right escape hatch? | You need the DOM updated synchronously right after a state change, before the browser does anything else, because a measurement depends on it. What does `flushSync` flush, and what does it cost? |
| 65 | ❱❱ MORE | `#html_components` | How do React's built-in HTML components differ from raw HTML? | `class` becomes `className`, `for` becomes `htmlFor`, and `style` takes an object. Which attributes change, which built-in components gained new powers, and why the renaming at all? |
| 66 | ❱❱ MORE | `#use_optimistic` | How do you show the value the reader expects before the server confirms? | The like should turn red the instant it is clicked, not after the round trip. How does `useOptimistic` render the hoped-for value and roll it back on failure? |
| 67 | ❱❱ MORE | `#activity` | How do you hide a subtree without losing its state? | Switching tabs unmounts the archive search panel and the reader loses their query. How does `Activity` hide the tree while preserving its state, and what does `mode="hidden"` mean? |
| 68 | ❱❱ MORE | `#view_transition` | How do you animate between two screens with `ViewTransition`? | Story-to-story navigation cuts instantly and readers lose their place. How does `ViewTransition` animate the old screen into the new one, and what triggers an update? |
| 69 | ❱❱ MORE | `#dev_tools` | How do you inspect component trees and profile renders with React Developer Tools? | Something re-renders too much, but which component? How do the Profiler and the performance tracks show you the culprit and what it cost? |
| 70 | ❱❱ MORE | `#eslint_hooks` | What do the React Hooks lint rules catch, and why should `exhaustive-deps` never be disabled? | The team silences the exhaustive-deps warning to ship faster. What classes of bugs does that decision invite, and what do the newer lints (purity, set-state-in-render, refs) guard? |

## ❱❱❱ ADVANCED — React deep mechanics (Q71–Q95)

Deep mechanics: render phases, reconciliation internals, Suspense and concurrency, batching, the compiler. Assumes CORE and the relevant MORE questions.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 71 | ❱❱❱ ADVANCED | `#derived_state` | How do you derive values during render, and when is adjusting state during render legal? | A prop arrives and you copy it into state, then the prop changes and the copy goes stale forever. Why is mirroring props in state an anti-pattern, and what are the two sanctioned patterns? |
| 72 | ❱❱❱ ADVANCED | `#component_identity` | What are the precise reset and preserve patterns around keys and tree position? | You need an editor that resets when the story ID changes but a toolbar that survives a layout swap. How do key changes, position, and type swaps control state reset exactly? |
| 73 | ❱❱❱ ADVANCED | `#purity` | What exactly counts as a side effect during render, and what bugs does it cause? | Mutating a prop's object seems to work until concurrent rendering double-invokes your component and the mutation lands twice. Where is local mutation allowed, and what must move out? |
| 74 | ❱❱❱ ADVANCED | `#use_layout_effect` | When must code run after DOM updates but before the browser paints? | You measure an element's height in `useEffect` and the screen flickers, because the first paint used the old height. Why does `useLayoutEffect` block the paint, and what belongs in it? |
| 75 | ❱❱❱ ADVANCED | `#use_insertion_effect` | What is `useInsertionEffect` for, and why does it exist? | CSS-in-JS libraries inject style tags during render and corrupt concurrent updates. Why does React offer an effect that runs before layout effects, and who besides library authors should touch it? |
| 76 | ❱❱❱ ADVANCED | `#suspense` | What is Suspense actually waiting for, and how does a component suspend? | Everyone says "Suspense handles loading". What mechanism pauses a component tree mid-render, and what can trigger it besides a lazy import? |
| 77 | ❱❱❱ ADVANCED | `#use` | What is the `use` API, and how does it differ from hooks? | `use(promise)` is called like a hook but is legal inside an `if` statement. Why can `use` break the rules of hooks, and what can it read? |
| 78 | ❱❱❱ ADVANCED | `#use_transition` | What does `startTransition` actually tell React, and what is `addTransitionType` for? | `isPending` shows true before any real work begins. What priority does a transition get, how can React abandon it midway, and why would you name a transition type? |
| 79 | ❱❱❱ ADVANCED | `#batching` | How does automatic batching work across events, promises, and transitions? | Two `setState` calls in one handler render once. The same two calls in a `.then` used to render twice before React 18. Where does batching apply now, and what does `flushSync` do to it? |
| 80 | ❱❱❱ ADVANCED | `#use_reducer` | What makes a reducer well-designed: purity, shape, and initial state? | Your reducer mutates the state object and performs two updates in one case branch. What are the design rules: pure transitions, serializable actions, lazy initialization, stable dispatch identity? |
| 81 | ❱❱❱ ADVANCED | `#context` | How do value identity and provider nesting drive context re-renders? | `useContext` re-renders its component on every provider render, even when the value the component reads did not change. How does the propagation model work, and how do memoized values and split contexts tame it? |
| 82 | ❱❱❱ ADVANCED | `#custom_hooks` | How do custom hooks share logic without isolating it? | Two components call your custom hook and their states seem entangled, or seem independent when you expected sharing. What is a hook call, really, and why is there no isolation boundary at all? |
| 83 | ❱❱❱ ADVANCED | `#concurrent` | What is concurrent rendering, and how do transitions use it? | React 18 was branded concurrent. What can interrupt a render mid-tree, why does the user never see a half-finished screen, and how do transitions opt into it? |
| 84 | ❱❱❱ ADVANCED | `#act` | What does `act()` do in tests, and why do effects need it? | Your test asserts on text an effect fetches, and it fails because the effect had not run yet. What does `act` flush, and how do testing libraries build on it? |
| 85 | ❱❱❱ ADVANCED | `#profiler` | How do you use the `Profiler` component to measure renders? | You suspect a slow render but need numbers, not guesses. What does `onRender` report: durations, actual versus base time, commit phases? How do you read it? |
| 86 | ❱❱❱ ADVANCED | `#create_element` | What does JSX compile into, and what is an element? | JSX is not JavaScript the browser understands. What object does it become, what do the `type` and `key` fields mean on that object, and where does `createElement` fit in? |
| 87 | ❱❱❱ ADVANCED | `#strict_mode` | Why does StrictMode remount effects and double-invoke renders, and what production situations is it simulating? | Effects fire twice in development: mount, cleanup, mount again. This is deliberate. Which real production scenarios, from reuse to offscreen survival to interruption, is it forcing your code to survive? |
| 88 | ❱❱❱ ADVANCED | `#rules_of_react` | What are the Rules of React, and how do the three rules interlock? | React now publishes enforceable rules with lint backing. Purity, React calls your code, hooks only at the top: what does each rule forbid, and why do they only work as a system? |
| 89 | ❱❱❱ ADVANCED | `#memo` | What are memo's limits: own state, context, and the children alternative? | You wrapped a component in `memo` and it still re-renders when the parent does. Three things bypass memo entirely: which, and what composition pattern replaces memoization? |
| 90 | ❱❱❱ ADVANCED | `#keys` | How do keys drive reconciliation, and what is the index-as-key failure chain? | Keys are not props, never reach your components, and only the reconciler reads them. How do same-type plus same-key decisions reuse DOM, and where exactly does the index strategy corrupt state? |
| 91 | ❱❱❱ ADVANCED | `#refs_deep` | How do refs really work in React 19: `ref` as a prop, cleanup, and attach order? | React 19 lets function components receive `ref` as an ordinary prop. When do refs attach and detach, what is a ref cleanup function for, and what did `forwardRef` use to do? |
| 92 | ❱❱❱ ADVANCED | `#owner_stacks` | How does `captureOwnerStack` pinpoint which component caused a render or error? | An error was thrown somewhere inside a tree of two hundred components, and the stack shows only library frames. What does the owner stack reveal, and how do you log it in production? |
| 93 | ❱❱❱ ADVANCED | `#composability` | How does passing JSX and functions as children replace configuration? | Your StoryCard has eleven boolean props for every combination of byline, badge, and thumbnail. How do children, render props, and component props decompose it? |
| 94 | ❱❱❱ ADVANCED | `#typescript` | How do you type generic components and flexible props in React with TypeScript? | A `DataTable` should accept typed rows without callers casting anything. How do generics on function components, `keyof`, and utility types give real safety? |
| 95 | ❱❱❱ ADVANCED | `#react_compiler` | What does the React Compiler do, and when should you adopt it? | The compiler promises to memoize everything automatically. What does it transform your code into, what does it assume about your obedience to the Rules of React, and how do you roll it out safely? |

## LEGACY — React migration appendix (Q96–Q100)

Not a tier in the learning path. For maintaining and migrating class-era code. Newcomers skip entirely.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 96 | LEGACY | `#legacy_class` | How do class components work, and how do you read one today? | You inherit a 2019 codebase full of classes: constructor, `this.state`, `this.setState`, bound methods in the constructor. How does each old piece map onto today's function components and hooks? |
| 97 | LEGACY | `#legacy_lifecycle` | What were `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`, and why were some renamed UNSAFE? | Migration guides keep mentioning `UNSAFE_componentWillMount`. What did the lifecycle methods do, which of them survive, and why did React rename three of them UNSAFE? |
| 98 | LEGACY | `#legacy_memoization` | How did `PureComponent` and `shouldComponentUpdate` prevent re-renders, and what replaced them? | Before `memo`, class components had their own skipping mechanism based on shallow comparison. What did it buy, what did it miss, and how does it map to `React.memo` and `useMemo`? |
| 99 | LEGACY | `#legacy_refs` | How did refs work before hooks: `createRef`, callback refs, and `forwardRef`? | Old code threads a ref through a higher-order component with `forwardRef` and builds them with `React.createRef`. What were the pieces, what did they cost, and what changes in React 19? |
| 100 | LEGACY | `#legacy_elements` | What were `cloneElement`, the `Children` utilities, and `defaultProps` for, and why were they abandoned? | A 2020 component clones the children you pass it to inject props, and `defaultProps` fills in the missing ones. Why did both patterns fall out of use, and what replaces them? |

---

# PART TWO — REACT SERVER (Q101–Q180)

## ❱ CORE (Server) — rendering before the browser (Q101–Q130)

The minimum server path: render HTML on the server, stream it, hydrate it, and split your component tree across the server/client boundary. Read in order. Assumes the React CORE course.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 101 | ❱ CORE (Server) | `#rsc_overview` | What are React Server Components, and why do they exist? | Your article page ships 300KB of JavaScript and every byte of the data it displays is public anyway. Why does React now want to run some components on the server, and what exactly gets smaller? |
| 102 | ❱ CORE (Server) | `#ssr` | What is server-side rendering, and what does it solve? | The reader's phone shows a blank page for two seconds while the bundle downloads and renders. What does producing HTML on the server change about that first paint, and what does it not fix? |
| 103 | ❱ CORE (Server) | `#rendering_models` | How do CSR, SSR, streaming SSR, static prerendering, and resuming differ? | Five terms describe where and when rendering happens. What is the full spectrum from "everything in the browser" to "HTML made in advance, interactivity attached later"? |
| 104 | ❱ CORE (Server) | `#hydration` | What is hydration, and how does `hydrateRoot` attach interactivity? | The server sent complete, styled HTML, but nothing responds to clicks. What does `hydrateRoot` do with that HTML, what does it cost, and why is it not a second render? |
| 105 | ❱ CORE (Server) | `#hydration_errors` | What causes hydration mismatches, and how do you fix them? | The server rendered "Good morning" and the client instantly rewrote it to "Good evening", with a console error. What is allowed to differ between the two renders, and how is each cause fixed? |
| 106 | ❱ CORE (Server) | `#use_client` | What does the `'use client'` directive do, and where does the client boundary sit? | A file with `'use client'` at the top suddenly works in the browser. What does that marker do to the file itself, and to everything the file imports? |
| 107 | ❱ CORE (Server) | `#serializable_props` | What can you pass from a Server Component to a Client Component? | You pass a function from a server file to a client component and the build fails. What exactly is serializable, what crosses for free, and what must you do instead? |
| 108 | ❱ CORE (Server) | `#server_components` | What can a Server Component do that a Client Component cannot, and vice versa? | No `useState`, no effects, but direct database access and zero bundle cost. What is the complete capability trade across the boundary? |
| 109 | ❱ CORE (Server) | `#server_resources` | How do Server Components read data with async/await, and what does that replace? | No `useEffect`, no loading flags: the component is an `async` function that awaits the database directly. How does awaiting inside render work, and what happens to fetch-in-effect? |
| 110 | ❱ CORE (Server) | `#server_functions` | What are Server Functions, and how does `'use server'` create a callable endpoint? | The client button calls a function, and that function runs on the server with your database in scope. What did `'use server'` build for you, and what actually crosses the wire? |
| 111 | ❱ CORE (Server) | `#directives` | Why are `'use client'` and `'use server'` called directives, and who reads them? | They are not imports, not APIs: a bare string at the top of a file steers the whole build. Which tool consumes directives, and what do they instruct it to do? |
| 112 | ❱ CORE (Server) | `#form_actions` | How do forms work with Server Function actions, and what is progressive enhancement? | The form's action is a server function. Does the form still submit before JavaScript loads, and what does the browser send with no JS at all? |
| 113 | ❱ CORE (Server) | `#action_results` | How do a Server Function's return values and errors reach the UI? | The action validates the input and fails. Where does the returned error land, and how does `useActionState` put the message next to the field? |
| 114 | ❱ CORE (Server) | `#use_form_status` | How does a nested field read the form's pending state during a server action? | The submit button shows "Publishing..." while the server works, and it lives two components inside the form. What does `useFormStatus` read from the enclosing form? |
| 115 | ❱ CORE (Server) | `#composition` | How do you pass server-rendered children into a Client Component? | A client carousel needs its slides, but the slides come from server-only data. How does passing children from the server side keep those slides out of the client bundle? |
| 116 | ❱ CORE (Server) | `#context_server` | How does context behave across the server/client boundary? | A provider rendered from a server component throws. Why must providers be client components, and how do server-fetched values still reach deep client consumers? |
| 117 | ❱ CORE (Server) | `#suspense_streaming` | How does streaming SSR work with Suspense: the shell, fallbacks, and out-of-order flushes? | The page sends its header instantly and the slow comments arrive later in the same response. How does Suspense split one HTML response into staged flushes? |
| 118 | ❱ CORE (Server) | `#streaming` | How do you stream HTML on the server with `renderToPipeableStream` or `renderToReadableStream`? | One API returns a pipeable stream for Node, one a web stream for everywhere else. What do you do with the stream, and which options control the shell and the scripts? |
| 119 | ❱ CORE (Server) | `#static_prerender` | What is static prerendering, and when is it the right choice? | The "About the paper" page never changes per reader. Why render it on every request when the HTML can be produced in advance? What do the prerender APIs return? |
| 120 | ❱ CORE (Server) | `#resume` | What does resuming mean: shipping server state without shipping component code? | The newest rendering model separates "what the UI is" from "the code that makes it interactive". What is resumed, from where, and why is it not hydration? |
| 121 | ❱ CORE (Server) | `#document_metadata` | How do you set titles, meta tags, and links with React components? | Every page needs its own title and Open Graph tags, and string-concatenating a head template is fragile. How do `<title>`, `<meta>`, and `<link>` work as regular React components? |
| 122 | ❱ CORE (Server) | `#server_only` | How do you keep server-only code out of the client bundle? | The database client sits in a module that a client component transitively imports. What mechanisms mark code as server-only and fail the build instead of leaking it? |
| 123 | ❱ CORE (Server) | `#cache` | What is `cache()`, and how does it deduplicate work within a request? | Three components need the same reader record and the database is queried three times in one request. How does `cache()` make one call serve all three? |
| 124 | ❱ CORE (Server) | `#rsc_payload` | What is the RSC payload, and what ships to the browser instead of component code? | Server Components never reach the browser, yet the client can render them during navigation. What serialized form travels instead of the component itself? |
| 125 | ❱ CORE (Server) | `#server_errors` | How do errors surface during server rendering, and what is a recoverable error? | The shell rendered fine, then a lazy hole threw. What is the difference between a shell error and a content error, and who is responsible for catching each? |
| 126 | ❱ CORE (Server) | `#preloading` | How do `preload`, `preinit`, `preconnect`, and `prefetchDNS` speed up loading? | The font file and the data API are only discovered deep inside render, seconds after they could have started. How do these four calls warm resources up early? |
| 127 | ❱ CORE (Server) | `#shared_components` | What is a component with no directive: how does it run on both the server and the client? | Most files carry no `'use client'`. When do they run where, and what must a shared component avoid to stay legal in both worlds? |
| 128 | ❱ CORE (Server) | `#data_fetching` | Where should data fetching live: Server Components, Server Functions, or client effects? | The same edition data feeds a server-rendered list and a client-side ticker. What are the three homes for fetching, and what decides between them? |
| 129 | ❱ CORE (Server) | `#rendering_models` | How do you choose between static prerendering and streaming for a page? | One page is marketing copy, another is a personalized feed, a third is a live blog. What questions decide each page's rendering strategy, and can one app mix them? |
| 130 | ❱ CORE (Server) | `#security` | What security guarantees does server rendering give, and what must you still validate yourself? | "It runs on the server" feels safe, but a Server Function is a public endpoint anyone can call with a forged request. What does the boundary protect, and what does it not? |

## ❱❱ MORE (Server) — server feature tour (Q131–Q165)

The server/client boundary in depth, the stream lifecycle, resuming, caching, preloading, and the full form story. Assumes Server CORE.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 131 | ❱❱ MORE (Server) | `#use_client` | What does a `'use client'` file mean for its imports and exports? | The directive marks one file, but everything that file imports joins the client bundle, including things you never meant to ship. What are the exact rules for the marked module's edges? |
| 132 | ❱❱ MORE (Server) | `#server_graph` | What are the two module graphs, and how do they reference each other? | Your app is not one program anymore: the server graph and the client graph interleave through reference points. What does each graph contain, and where do they touch? |
| 133 | ❱❱ MORE (Server) | `#client_references` | What is a Client Component from the server's perspective? | From the server side, the client component you render is not code at all: it is a placeholder that says "the browser has this one". What does the server know about it, and what can it do with it? |
| 134 | ❱❱ MORE (Server) | `#use_server` | How do you pass Server Functions down as props into Client Components? | A client picker needs a save function, but only the server can reach the database. How do you hand a `'use server'` function to a client component like an ordinary callback? |
| 135 | ❱❱ MORE (Server) | `#serializable_props` | Which special values cross the boundary: dates, maps, sets, promises, and typed arrays? | You assumed only strings and numbers survive the serialization step. What else crosses intact, what happens to class instances, and what silently becomes something else? |
| 136 | ❱❱ MORE (Server) | `#actions` | What is the precise distinction between an action and a Server Function? | People say "server action" for everything. When is an action not a server function, and what can a plain client-side action do that a Server Function cannot? |
| 137 | ❱❱ MORE (Server) | `#progressive_enhancement` | How do forms submit before hydration has even finished? | A reader on a slow connection sees the full form before any JavaScript has loaded. Does the submit button do anything, and what exactly does the server function receive? |
| 138 | ❱❱ MORE (Server) | `#server_resources` | How do sequential awaits create waterfalls, and how do you fetch in parallel? | Your page awaits the reader, then awaits their preferences, then awaits their feed, and each waits for the one before. How does `Promise.all` collapse the staircase? |
| 139 | ❱❱ MORE (Server) | `#suspense_streaming` | Where should Suspense boundaries sit: fast shell, slow holes? | One big boundary means one big spinner; a boundary per paragraph means flickering chaos. What is the placement strategy that gives a fast shell and stable content? |
| 140 | ❱❱ MORE (Server) | `#stream_lifecycle` | What do `onShellReady`, `onShellError`, and `onAllReady` each mean? | The stream has two ready moments: the shell is ready, and everything is ready. Which one do you send to readers, and which one only matters to crawlers and static files? |
| 141 | ❱❱ MORE (Server) | `#static_prerender` | What do the static prerender APIs produce, and how do their variants differ? | `prerender` and `prerenderToNodeStream` both promise static HTML. What do they return, what do they guarantee about the output, and when do they refuse to finish? |
| 142 | ❱❱ MORE (Server) | `#resume` | When do you use `resume`, `resumeToPipeableStream`, and `resumeAndPrerender`? | Three resume APIs cover three jobs: stream later, stream to Node, and prerender from saved state. What distinguishes them and which fits a live blog that sleeps between bursts? |
| 143 | ❱❱ MORE (Server) | `#bootstrap_scripts` | What are `bootstrapScripts` and when does the page hydrate? | The streamed HTML is only half the story: a script has to arrive and run before the page becomes interactive. Which script is it, when does the browser fetch it, and what does it do? |
| 144 | ❱❱ MORE (Server) | `#document_metadata` | How does precedence decide which title, stylesheet, or script wins? | Two components both render a `<title>`, and three layers inject stylesheets. What rules decide what the browser actually applies, and how do you control the order? |
| 145 | ❱❱ MORE (Server) | `#preloading` | `preload` versus `preinit`: warming a fetch versus loading and executing? | The names sound interchangeable: one starts a download for later, one loads a resource for immediate use. Which one do fonts, scripts, stylesheets, and data each need? |
| 146 | ❱❱ MORE (Server) | `#preloading` | What do `preconnect` and `prefetchDNS` do before any request exists? | The data API on another domain costs a DNS lookup, a TCP handshake, and a TLS negotiation before the first byte. How do these two calls open the pipe early? |
| 147 | ❱❱ MORE (Server) | `#cache` | How long does `cache()` live, and what is it not? | You wrapped a function in `cache()` expecting a Redis. It deduplicates within one request and forgets everything after. What is its real scope, and what belongs to other layers? |
| 148 | ❱❱ MORE (Server) | `#cache_signal` | What is `cacheSignal` and when is caching "done"? | Static prerendering needs to know that every cached fetch has finished before it commits. How does `cacheSignal` tell you the request's caching work is complete? |
| 149 | ❱❱ MORE (Server) | `#security` | How do the taint APIs mark values that must never reach the client? | A reader object contains a session token, and one careless prop pass ships it into the client bundle. How do `experimental_taintObjectReference` and `experimental_taintUniqueValue` make the leak throw? |
| 150 | ❱❱ MORE (Server) | `#server_errors` | What is a recoverable error, and what do `onRecoverableError` and root options do with it? | React logged an "error while hydrating" and recovered on its own. What did it recover from, what retries happen, and how do you hook `onRecoverableError` into your logging? |
| 151 | ❱❱ MORE (Server) | `#hydration` | What are selective hydration and progressive hydration? | The bundle arrived, but the reader is already reading the article, not the comments. Can React hydrate the visible part first, and hydrate the rest as it becomes relevant? |
| 152 | ❱❱ MORE (Server) | `#data_fetching` | After a Server Function mutates data, how does the client see fresh server data? | The action saved the story, but the list on screen still shows the old headline. Who re-fetches what, and what pattern connects mutations back to the server-rendered tree? |
| 153 | ❱❱ MORE (Server) | `#use_optimistic` | How does optimistic UI work when the action runs on the server? | The publish button should show the story in the list immediately, and the list should survive the rollback if the server rejects it. How do `useOptimistic` and actions cooperate? |
| 154 | ❱❱ MORE (Server) | `#form_actions` | How does a Server Function read submitted fields and files from FormData? | The form has a file input, five text fields, and no JavaScript on the reader's first visit. What arrives in the action, and how do you read attachments? |
| 155 | ❱❱ MORE (Server) | `#server_only` | What are server-only exports and the `server-only` package convention? | A utilities module exports one database-touching function next to three pure helpers, and a client file imports a helper. What conventions wall off the server half of a module? |
| 156 | ❱❱ MORE (Server) | `#ssr` | What does SSR cost, and when is rendering on the server the wrong choice? | A fully interactive stock ticker behind a login gets nothing from HTML on the server except a slower pipeline. When does SSR hurt time-to-interactive, and what wins instead? |
| 157 | ❱❱ MORE (Server) | `#rendering_models` | How do you mix rendering strategies inside one app? | The homepage is static, the live blog streams, and the reader settings screen is pure client. What does one app with three rendering modes look like at the routing layer? |
| 158 | ❱❱ MORE (Server) | `#hydration` | What is the hydration cost model, and how do you shrink it? | Hydration walks every component that shipped, whether or not it ever hears an event. What makes it slow, and how do fewer client components and smaller graphs make it cheap? |
| 159 | ❱❱ MORE (Server) | `#resume` | Resuming versus hydrating: what ships, and what runs? | Both end with an interactive page, but one ships component code and re-runs it, and the other ships state and skips the re-run. What exactly is the difference? |
| 160 | ❱❱ MORE (Server) | `#streaming` | `renderToPipeableStream` versus `renderToReadableStream`: which environment needs which? | Node predates web streams; browsers, Deno, and Bun speak them natively. What does each API hand you, and how do you choose per runtime? |
| 161 | ❱❱ MORE (Server) | `#bundler_integration` | What must a bundler and router provide for RSC to work? | RSC is not a framework you install: it is a contract your build tools fulfill. What does the bundler split, what does the router fetch on navigation, and what does React itself provide? |
| 162 | ❱❱ MORE (Server) | `#security` | Why is a Server Function a public endpoint, and what must you validate? | The button calls `saveStory`, but nothing stops a hostile client from calling `saveStory` with any arguments. Where does trust end at the server boundary, and what do you check? |
| 163 | ❱❱ MORE (Server) | `#hydration_errors` | How do you diagnose mismatches with React's hydration warnings? | The error says text content differed and points at a node with no obvious problem. How do you read the warning's pointers, and which causes (extensions, dates, escaped HTML) are classic? |
| 164 | ❱❱ MORE (Server) | `#actions` | How do you compose and sequence multiple actions? | Publishing a story means saving the draft, uploading the image, and invalidating the feed, in order, with one pending indicator. How do you orchestrate actions without an effect pyramid? |
| 165 | ❱❱ MORE (Server) | `#context_server` | How do you pass server-fetched values into client providers? | The reader record is fetched on the server, but the provider that holds it must be a client component. What is the sanctioned shape for server data flowing into a client context? |

## ❱❱❱ ADVANCED (Server) — server internals (Q166–Q175)

The payload format, the serialization protocol, resuming internals, and the concurrent foundation under streaming. Assumes Server CORE and MORE.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 166 | ❱❱❱ ADVANCED (Server) | `#rsc_payload` | How is the RSC payload encoded: rows, module references, and lazy chunks? | The payload is not JSON and not HTML: it is a stream of rows, some holding data, some holding references. How does a lazy row tell the client "more coming"? |
| 167 | ❱❱❱ ADVANCED (Server) | `#serialization_protocol` | How does serialization encode client references, promises, and typed values across the wire? | A promise and a Map both cross the boundary intact, but a class instance does not. How does the protocol mark each kind, and why is it designed for streaming instead of one JSON blob? |
| 168 | ❱❱❱ ADVANCED (Server) | `#bundler_integration` | What do you implement when building an RSC app from scratch? | Framework-free RSC means wiring the server render, the client bundle, and the router yourself. What are the moving parts, and which ones does a framework normally hide? |
| 169 | ❱❱❱ ADVANCED (Server) | `#concurrent` | Why does streaming require concurrent rendering under the hood? | The server flushes the shell, then more rows arrive for holes rendered "later". How can rendering pause without finishing, and what concurrent machinery makes that legal? |
| 170 | ❱❱❱ ADVANCED (Server) | `#hydration_errors` | What do React's exact hydration error messages tell you, and how do you decode them? | "Text content does not match" and "Hydration failed because the server rendered HTML didn't match the client" point at different failure classes. How do you read each message back to its cause? |
| 171 | ❱❱❱ ADVANCED (Server) | `#cache` | What defines cache identity: which calls share results and which never will? | Two calls to a `cache()`-wrapped function sometimes share and sometimes do not. What role do arguments and function identity play in the cache key? |
| 172 | ❱❱❱ ADVANCED (Server) | `#resume` | What must the saved state contain for `resume` to skip re-rendering? | Resuming promises no second server render. What was persisted at prerender time, and what does the client need from that snapshot to continue where the server stopped? |
| 173 | ❱❱❱ ADVANCED (Server) | `#server_errors` | What separates recoverable from unrecoverable errors in teardown and retry semantics? | Some errors let React retry a boundary; others poison the shell. Which failures are which, what gets torn down, and what does a retry actually re-execute? |
| 174 | ❱❱❱ ADVANCED (Server) | `#react_compiler` | How does the React Compiler interact with server rendering and libraries? | The compiler memoizes client renders, but what does it do with Server Components and published component libraries? What do compilation modes and gating control? |
| 175 | ❱❱❱ ADVANCED (Server) | `#rules_of_react` | Why do the Rules of React bite harder on the server? | A slightly impure component only misbehaved occasionally on the client. On the server, re-execution under resuming and streaming turns the same impurity into data corruption. Why? |

## LEGACY (Server) — legacy server APIs appendix (Q176–Q180)

For maintaining and migrating pre-streaming server code. Newcomers skip entirely.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 176 | LEGACY (Server) | `#legacy_render_to_string` | What is `renderToString`'s status today, and what is it still legitimately used for? | The docs call it legacy but every old server still calls it. What cannot it do (no streaming, no Suspense), and why do error pages and emails keep it alive? |
| 177 | LEGACY (Server) | `#legacy_static_markup` | What did `renderToStaticMarkup` do, and how did it differ from `renderToString`? | One API produced hydratable HTML with extra attributes; one produced clean markup for emails. Which was which, and what replaced the static one? |
| 178 | LEGACY (Server) | `#legacy_node_streams` | What did `renderToNodeStream` and `renderToStaticNodeStream` provide, and why were they replaced? | Node stream rendering predated the pipeable API and buffered in ways that stalled large pages. What was the model, and what does migrating to `renderToPipeableStream` change? |
| 179 | LEGACY (Server) | `#legacy_hydrate` | What did `ReactDOM.render` and `ReactDOM.hydrate` do, and why were they removed? | Every legacy entry point calls `ReactDOM.render(el, container)`. What did the old pair do, what warnings did React 18 emit, and how do `createRoot` and `hydrateRoot` replace them? |
| 180 | LEGACY (Server) | `#legacy_hydrate` | How do you migrate a `renderToString` plus `ReactDOM.hydrate` app to streaming with `hydrateRoot`? | You inherit a React 17 server pipeline: string rendering, manual script injection, a single hydrate call on load. What is the step-by-step move to the streaming pipeline without a rewrite? |
