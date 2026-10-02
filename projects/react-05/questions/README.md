# React 19 Complete Curriculum: Zero-Gap Pedagogical Architecture

A unified, strictly dependency-ordered curriculum of **180 questions** covering both client-side React 19 (Q1–Q100) and React Server (Q101–Q180), housed directly inside `diagram-lab/output/react-lecture-05/questions/`.

This question bank serves a dual mission:
1. **Zero-Gap First-Time Learner Path**: A student who has never written React before can follow from Question 1 onward without hitting missing concepts, premature jargon, or chicken-and-egg dependency loops.
2. **Authoritative Senior Reference & Interview Prep**: Every question is framed in interview register, investigating cause, effect, browser engine consequences, and operational failure boundaries.

---

## Pedagogical Invariants & Design Principles

### 1. Zero Gaps in Fundamentals (First-Time Learner Ready)
- **Fragments on Day 1**: In Q4 (`#jsx`), the single-root rule is paired immediately with Fragment syntax (`<>...</>`). Students never suffer through wrapper `<div>` clutter breaking their layout.
- **Describing Before Mounting**: Component Anatomy (Q3), JSX (Q4), and Expressions (Q5) precede Mounting (`createRoot`, Q6). The learner understands what a component and markup represent before seeing entrypoint plumbing.
- **Explicit Inverse Data Flow**: Callback props (`#callback_props`, Q15) are formally established right after event handling and before `useState`, ensuring passing functions down to children feels natural before lifting state up.
- **Engine Rhythm Before Snapshot Mysteries**: Trigger, Render, and Commit (`#render_and_commit`, Q17) is introduced directly after `useState` (Q16). Students understand that "render" means executing their component function, not painting to the screen, providing the exact mental model needed for state snapshots and batching queues.
- **Client-Side Data Fetching**: A dedicated lesson (`#data_fetching_client`, Q36) teaches how single-page apps fetch JSON from REST APIs with `fetch`, `useState` (data, loading, error), race condition guards, and abort cleanup before any server course begins.
- **Refs Before Effects**: `useRef` (Q33) and DOM refs (Q34) precede `useEffect` (Q35). Real-world effects that focus elements, measure nodes, or manage intervals can use refs naturally without sneaking them in unbaptized.

### 2. Modern React 19 by Design
- **React 19 Form Architecture (Q40–Q45)**: Taught as a cohesive unit after core state, refs, and async patterns are mastered, establishing `<form action={fn}>`, `useActionState`, `useFormStatus`, and `useOptimistic`.
- **The `use()` API**: Context is taught using the modern `use(Context)` API (Q30) alongside promise resolution (Q71).
- **Ref as a Prop**: React 19's native `ref` prop (Q85) is treated as the primary modern standard, with legacy `forwardRef` relegated to the migration appendix (Q99).

### 3. Strict Server Quarantine
React Server Components (RSC), SSR, and Server Functions are strictly quarantined in Part Two (Q101–Q180). This eliminates premature cognitive load from the `'use client'` boundary while mastering client-side reactivity.

---

## File Layout

```
diagram-lab/output/react-lecture-05/questions/
├── README.md       ← this file (pedagogical design, curriculum map, and rationale)
├── topics.md       ← controlled vocabulary of hashtags (one tag per question)
└── questions.md    ← all 180 questions, strictly ordered, continuous numbering 1–180
```

---

## Curriculum Structure

### PART ONE — REACT (Q1–Q100)
- **Module 1: Describing the UI (Q1–Q10)**: Declarative model, project setup, component anatomy, JSX & Fragments, expressions, `createRoot`, imports, props, children, and conditional rendering.
- **Module 2: Collections & Purity (Q11–Q13)**: Rendering lists, keys, UI trees, and component purity.
- **Module 3: Interactivity & The Render Cycle (Q14–Q20)**: Event handling, callback props, `useState`, Trigger-Render-Commit, state snapshots, batching queues, and StrictMode.
- **Module 4: Complex State & State Architecture (Q21–Q28)**: Objects in state, arrays in state, controlled inputs, state machines, state structure, lifting state, component identity, and Thinking in React.
- **Module 5: Scaled State: Reducers & Context (Q29–Q32)**: `useReducer`, Context & `use()`, Reducer + Context architecture, and context optimization.
- **Module 6: Escape Hatches: Refs, Effects & Client Data (Q33–Q39)**: `useRef`, DOM refs, `useEffect`, client data fetching, non-effect patterns, effect lifecycle, and custom hooks.
- **Module 7: Modern React 19 Forms & Actions (Q40–Q45)**: Controlled vs uncontrolled forms, `<form action>`, `useActionState`, `useFormStatus`, `useOptimistic`, and progressive enhancement.
- **Module 8: Advanced Hooks & Escape Hatches (Q46–Q55)**: Rules of hooks, effect dependencies, `useEffectEvent`, `useLayoutEffect`, `useInsertionEffect`, `useImperativeHandle`, `createPortal`, `useId`, `useSyncExternalStore`, and `useDebugValue`.
- **Module 9: Performance Optimization & Memoization (Q56–Q65)**: Re-render mechanics, `React.memo`, `useMemo`, `useCallback`, composition patterns, reconciliation keys, list virtualization, React Compiler, Profiler, and `flushSync`.
- **Module 10: Concurrency, Transitions & Suspense (Q66–Q75)**: Concurrent rendering, `useTransition`, `useDeferredValue`, `<Suspense>`, `React.lazy`, `use(Promise)`, Error Boundaries, `<Activity>`, `<ViewTransition>`, and batching internals.
- **Module 11: Deep Engine Mechanics & Architecture (Q76–Q88)**: JSX `createElement` compilation, reconciliation diffing, Fiber architecture & workLoop, SyntheticEvents, derived state patterns, owner stacks, Rules of React, HTML component normalization, asset preloading, ref as prop, ref cleanups, `act()` testing, and component composition patterns.
- **Module 12: TypeScript & Engineering Rigor (Q89–Q95)**: Props typing, event typing, hooks typing, generic components, polymorphism with `as`, ESLint tooling, and DevTools mastery.
- **Appendix: Legacy Class Architecture & Migration (Q96–Q100)**: Class components, lifecycle methods, `PureComponent`, legacy refs, and obsolete element APIs.

### PART TWO — REACT SERVER (Q101–Q180)
- **Module 13: Core Server Foundations (Q101–Q130)**: RSC overview, SSR, rendering spectrum, `hydrateRoot`, hydration mismatches, `'use client'`, serializable props, server components, server resources, `'use server'`, directives, server form actions, action results, nested status, boundary composition, server context, streaming Suspense, pipeable/readable streams, static prerender, resuming, metadata, server-only packages, request caching `cache()`, RSC payload, server errors, preloading, shared components, fetching placement, rendering choices, and security boundaries.
- **Module 14: Server Feature Tour (Q131–Q165)**: Boundary import/export rules, module graphs, client references, passing server functions as props, serializable types, action vs function, progressive enhancement before hydration, waterfall prevention with `Promise.all`, suspense boundary placement, stream lifecycle callbacks, static prerender variants, resume variants, bootstrapScripts, metadata precedence, preload vs preinit, preconnect/prefetchDNS, cache lifecycle, `cacheSignal`, taint APIs, recoverable errors, progressive hydration, mutation re-fetching, optimistic server actions, FormData handling, server-only exports, SSR cost analysis, hybrid architectures, hydration cost reduction, resuming vs hydration, stream runtimes, bundler contracts, endpoint security, hydration warnings, action orchestration, and server data into client providers.
- **Module 15: Server Internals (Q166–Q175)**: RSC payload row encoding, serialization protocol, standalone bundler integration, concurrent streaming foundations, hydration error decoding, cache identity rules, resume state snapshots, recoverable vs unrecoverable error semantics, React Compiler on server, and Rules of React on server.
- **Appendix: Legacy Server APIs (Q176–Q180)**: `renderToString` status, `renderToStaticMarkup`, Node stream rendering, legacy hydrate, and migration to streaming.
