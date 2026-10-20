# React 19 Complete Curriculum: Zero-Gap Pedagogical Architecture

A unified, strictly dependency-ordered curriculum of **180 questions** covering both client-side React 19 (Q1 to Q100) and React Server (Q101 to Q180), housed directly inside `projects/react-08/questions/`.

This question bank serves a dual mission:
1. **Zero-Gap First-Time Learner Path**: A student who has never written React before can follow from Question 1 onward without hitting missing concepts, premature jargon, or chicken-and-egg dependency loops.
2. **Authoritative Senior Reference & Interview Prep**: Every question is framed in interview register, investigating cause, effect, browser engine consequences, and operational failure boundaries.

This README describes the live bank, **Version 3**.

---

## Versions

| Version | Where | In force | What changed | Brief |
|---|---|---|---|---|
| 1 | `archive/questions-v1.md` | until 2026-09-24 | the original order (project setup at Q2, callback props at Q15, useState at Q16, StrictMode at Q20) | `brief/brief_2026_10_05_01.md` (audit) |
| 2 | `archive/questions-v2.md` (with `archive/topics-v2.md`) | 2026-09-24 to 2026-10-05 | project setup, StrictMode, and callback props moved to Q43 to Q45 as `❱❱ MORE`; UI tree to Q5; createRoot to Q9; events and callback props united in Q13; useState at Q14; forms Q37 to Q39 made `❱ CORE`; rows 46 to 180 unchanged | `brief/brief_2026_10_05_01.md` (audit; the change itself was made without a brief) |
| 3 | `questions.md` (live) | since 2026-10-05 | effects in react.dev order and rules of hooks in CORE (Q35 to Q37); context performance after memoization; new questions on XSS (Q48), state libraries (Q60), and component testing (Q87), with three new tags; DevTools duplicate and two niche hooks merged; rows 1 to 28 and 96 to 180 unchanged | `brief/brief_2026_10_05_02.md` (changes), `brief/brief_2026_10_05_04.md` (release) |

The syllabus cards (`01-01-map/`), the principle maps (`01-01-map-principles/`), and the lectures are keyed to question numbers, so a version change always lists every old-to-new number in its brief.

---

## File Layout

```
projects/react-08/questions/
├── README.md         this file: design, curriculum map, and the Versions table
├── questions.md      the live bank: all 180 questions, continuous numbering 1 to 180; builds read only this file
├── topics.md         the live controlled vocabulary of hashtags (one tag per question)
├── drafts/           a proposed next version under review; nothing reads it (empty now)
└── archive/          frozen earlier versions, moved unchanged; nothing reads them
    ├── questions-v1.md
    ├── questions-v2.md
    └── topics-v2.md
```

### Releasing a New Version

1. Write the draft as `drafts/questions-vN.md` with a brief that lists every old-to-new number and the reason for each change.
2. On approval, move the live `questions.md` unchanged to `archive/questions-v(N-1).md`, and `topics.md` to `archive/topics-v(N-1).md` when the tags change.
3. Move the draft into place as `questions.md`, replace its DRAFT banner with the version line, and update `topics.md`.
4. Add the version to the Versions table above and update the rest of this README to the new order.

Never reorder, renumber, add, or remove questions in the live `questions.md` in place.

---

## Pedagogical Invariants & Design Principles

### 1. Zero Gaps in Fundamentals (First-Time Learner Ready)
- **Fragments on Day 1**: In Q3 (`#jsx`), the single-root rule is paired immediately with Fragment syntax (`<>...</>`). Students never suffer through wrapper `<div>` clutter breaking their layout.
- **Hierarchy Before Flow**: The component tree (`#ui_tree`, Q5) is established before props (Q6), so the student has a concrete picture of the tree that props flow down.
- **Modules Before Mounting**: Splitting components across files (`#imports`, Q8) is taught before mounting `App.jsx` with `createRoot` and Vite (Q9). The learner understands what is being mounted before seeing entrypoint plumbing.
- **Interaction Loop Before Memory**: Event handling and callback props are united in Q13, completing the two-way communication loop before `useState` (Q14).
- **Engine Rhythm Before Snapshot Mysteries**: Trigger, Render, and Commit (`#render_and_commit`, Q15) is introduced directly after `useState` (Q14). Students understand that "render" means executing their component function, not painting to the screen, providing the exact mental model needed for state snapshots and batching queues.
- **Refs Before Effects**: `useRef` (Q29) and DOM refs (Q30) precede `useEffect` (Q31). Real-world effects that focus elements, measure nodes, or manage intervals can use refs naturally.
- **Effects in the react.dev Order (Q31 to Q36)**: Synchronizing with effects, fetching, not needing an effect, the effect lifecycle, separating events from effects, and removing dependencies run in one unbroken sequence, so the dependency warnings a newcomer meets at the first effect are answered inside CORE.
- **Rules Before Reuse (Q37 before Q38)**: The rules of hooks come after the reader has used five hooks and before custom hooks, so the call-order rule explains errors already seen and governs the hooks about to be written.
- **Client-Side Data Fetching**: A dedicated lesson (`#data_fetching_client`, Q32) teaches how single-page apps fetch JSON from REST APIs with `fetch`, `useState` (data, loading, error), race condition guards, and abort cleanup before any server course begins.

### 2. Modern React 19 by Design
- **React 19 Form Architecture (Q39 to Q44)**: Form choice, `<form action={fn}>`, and `useActionState` close the CORE path (Q39 to Q41); `useFormStatus`, `useOptimistic`, and progressive enhancement open the MORE tour (Q42 to Q44).
- **The `use()` API**: Context is taught using the modern `use(Context)` API (Q27) alongside promise resolution (Q71).
- **Ref as a Prop**: React 19's native `ref` prop (Q85) is treated as the primary modern standard, with legacy `forwardRef` relegated to the migration appendix (Q99).

### 3. Strict Server Quarantine
React Server Components (RSC), SSR, and Server Functions are strictly quarantined in Part Two (Q101 to Q180). This eliminates premature cognitive load from the `'use client'` boundary while mastering client-side reactivity.

---

## Curriculum Structure (Version 3)

### PART ONE: REACT (Q1 to Q100)
- **Module 1: Describing the UI (Q1 to Q10)**: Declarative model, component anatomy, JSX and Fragments, expressions, the UI tree, props, children, imports, `createRoot` with Vite, and conditional rendering.
- **Module 2: Lists and Purity (Q11 to Q12)**: Rendering lists with keys, and component purity.
- **Module 3: Interactivity and the Render Cycle (Q13 to Q17)**: Event handling with callback props, `useState`, Trigger-Render-Commit, state snapshots, and queued updates.
- **Module 4: Complex State and State Architecture (Q18 to Q25)**: Objects in state, arrays in state, controlled inputs, reacting to input, state structure, lifting state, component identity, and Thinking in React.
- **Module 5: Reducers and Context (Q26 to Q28)**: `useReducer`, context with `use()`, and reducer plus context.
- **Module 6: Refs, Effects, and Client Data (Q29 to Q38)**: `useRef`, DOM refs, `useEffect`, client data fetching, non-effect patterns, effect lifecycle, `useEffectEvent`, effect dependencies, the rules of hooks, and custom hooks.
- **Module 7: React 19 Forms and Actions (Q39 to Q44)**: Controlled versus uncontrolled forms, `<form action>`, `useActionState`, `useFormStatus`, `useOptimistic`, and progressive enhancement.
- **Module 8: Foundations Revisited and Client Security (Q45 to Q48)**: Full-stack framework versus standalone build tool, StrictMode auditing, callback contracts versus prop drilling, and XSS with `dangerouslySetInnerHTML`.
- **Module 9: Advanced Hooks and Escape Hatches (Q49 to Q53)**: `useLayoutEffect` with `useInsertionEffect`, `useImperativeHandle`, `createPortal`, `useId`, and `useSyncExternalStore`.
- **Module 10: Performance and State Architecture (Q54 to Q65)**: Re-render mechanics, `React.memo`, `useMemo`, `useCallback`, composition patterns, context optimization, state and server-cache libraries, reconciliation keys, list virtualization, React Compiler, DevTools with the Profiler and `useDebugValue`, and `flushSync`.
- **Module 11: Concurrency, Transitions, and Suspense (Q66 to Q75)**: Concurrent rendering, `useTransition`, `useDeferredValue`, `<Suspense>`, `React.lazy`, `use(Promise)`, Error Boundaries, `<Activity>`, `<ViewTransition>`, and batching internals.
- **Module 12: Deep Engine Mechanics and Architecture (Q76 to Q89)**: JSX `createElement` compilation, reconciliation diffing, Fiber architecture and workLoop, SyntheticEvents, derived state patterns, owner stacks, Rules of React, HTML component normalization, asset preloading, ref as prop, ref cleanups, component testing, `act()`, and component composition patterns.
- **Module 13: TypeScript and Tooling (Q90 to Q95)**: Props typing, event typing, hooks typing, generic components, polymorphism with `as`, and ESLint tooling.
- **Appendix: Legacy Class Architecture and Migration (Q96 to Q100)**: Class components, lifecycle methods, `PureComponent`, legacy refs, and obsolete element APIs.

### PART TWO: REACT SERVER (Q101 to Q180)
- **Module 14: Core Server Foundations (Q101 to Q130)**: RSC overview, SSR, rendering spectrum, `hydrateRoot`, hydration mismatches, `'use client'`, serializable props, server components, server resources, `'use server'`, directives, server form actions, action results, nested status, boundary composition, server context, streaming Suspense, pipeable and readable streams, static prerender, resuming, metadata, server-only packages, request caching with `cache()`, RSC payload, server errors, preloading, shared components, fetching placement, rendering choices, and security boundaries.
- **Module 15: Server Feature Tour (Q131 to Q165)**: Boundary import and export rules, module graphs, client references, passing server functions as props, serializable types, action versus function, progressive enhancement before hydration, waterfall prevention with `Promise.all`, Suspense boundary placement, stream lifecycle callbacks, static prerender variants, resume variants, bootstrapScripts, metadata precedence, preload versus preinit, preconnect and prefetchDNS, cache lifecycle, `cacheSignal`, taint APIs, recoverable errors, progressive hydration, mutation re-fetching, optimistic server actions, FormData handling, server-only exports, SSR cost analysis, hybrid architectures, hydration cost reduction, resuming versus hydration, stream runtimes, bundler contracts, endpoint security, hydration warnings, action orchestration, and server data into client providers.
- **Module 16: Server Internals (Q166 to Q175)**: RSC payload row encoding, serialization protocol, standalone bundler integration, concurrent streaming foundations, hydration error decoding, cache identity rules, resume state snapshots, recoverable versus unrecoverable error semantics, React Compiler on the server, and Rules of React on the server.
- **Appendix: Legacy Server APIs (Q176 to Q180)**: `renderToString` status, `renderToStaticMarkup`, Node stream rendering, legacy hydrate, and migration to streaming.
