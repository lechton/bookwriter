# React 19 Complete Curriculum: Zero-Gap Pedagogical Architecture

A unified, strictly dependency-ordered curriculum of **180 questions** covering both client-side React 19 (Q1 to Q100) and React Server (Q101 to Q180), housed directly inside `projects/react-09/questions/`.

This question bank serves a dual mission:
1. **Zero-Gap First-Time Learner Path**: A student who has never written React before can follow from Question 1 onward without hitting missing concepts, premature jargon, or chicken-and-egg dependency loops.
2. **Authoritative Senior Reference & Interview Prep**: Every question is framed in interview register, investigating cause, effect, browser engine consequences, and operational failure boundaries.

This README describes the live bank, **Version 4**.

---

## Versions

| Version | Where | In force | What changed | Brief |
|---|---|---|---|---|
| 1 | `archive/questions-v1.md` | until 2026-09-24 | the original order (project setup at Q2, callback props at Q15, useState at Q16, StrictMode at Q20) | `brief/brief_2026_10_05_01.md` (audit) |
| 2 | `archive/questions-v2.md` (with `archive/topics-v2.md`) | 2026-09-24 to 2026-10-05 | project setup, StrictMode, and callback props moved to Q43 to Q45 as `❱❱ MORE`; UI tree to Q5; createRoot to Q9; events and callback props united in Q13; useState at Q14; forms Q37 to Q39 made `❱ CORE`; rows 46 to 180 unchanged | `brief/brief_2026_10_05_01.md` (audit) |
| 3 | `archive/questions-v3.md` (with `archive/topics-v3.md`) | 2026-10-05 to 2026-10-20 | effects in react.dev order and rules of hooks in CORE (Q35 to Q37); context performance after memoization; new questions on XSS (Q48), state libraries (Q60), and component testing (Q87); DevTools duplicate and two niche hooks merged; rows 1 to 28 and 96 to 180 unchanged | `brief/brief_2026_10_05_02.md` (changes), `brief/brief_2026_10_05_04.md` (release) |
| 4 | `questions.md` (live) | since 2026-10-20 | fixes early dependency inversions in Q01 to Q47: `#jsx` (Q2) and `#jsx_expressions` (Q3) precede `#component_anatomy` (Q4); `#imports` (Q5), `#ui_tree` (Q6), and `#create_root` (Q7) precede `#props` (Q8); `#event_handling` (Q11), `#use_state` (Q12), and `#render_and_commit` (Q13) precede `#purity` (Q14) and `#rendering_lists` (Q18); `#callback_props` moves back to `❱ CORE` at Q23 before `#lifting_state` (Q24); plain hooks applied; rows 48 to 180 keep their numbers | `brief/brief_2026_10_20_02.md` |

The syllabus cards (`01-01-map/`), the principle maps (`01-01-map-principles/`), and the lectures are keyed to question numbers, so a version change always lists every old-to-new number in its brief.

---

## File Layout

```
projects/react-09/questions/
├── README.md         this file: design, curriculum map, and the Versions table
├── questions.md      the live bank: all 180 questions, continuous numbering 1 to 180; builds read only this file
├── topics.md         the live controlled vocabulary of hashtags (one tag per question)
├── drafts/           a proposed next version under review; nothing reads it (empty now)
└── archive/          frozen earlier versions, moved unchanged; nothing reads them
    ├── questions-v3.md
    └── topics-v3.md
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
- **Syntax and Expressions Before Component Anatomy (Q2 & Q3 before Q4)**: JSX syntax, Fragment grouping (`<>...</>`), and curly brace expressions (`{}`) come before writing custom component functions (Q4). Learners immediately understand what a component returns and why rendering `<ArticleCard />` as a JSX tag differs from calling `{ArticleCard()}` inside `{}`.
- **Modules, Tree, and Mounting Before Props (Q5 to Q7 before Q8)**: Splitting parent and child components across files (`#imports`, Q5), understanding the Component Tree alongside the Module Dependency Tree (`#ui_tree`, Q6), and mounting `App.jsx` with `createRoot` and Vite (`#create_root`, Q7) precede `#props` (Q8). Multi-component lessons never cram multiple components into a single `App.jsx` file.
- **Events, State, and Render Cycle Before Purity and Lists (Q11 to Q18)**: Event handling (Q11), `useState` (Q12), and Trigger-Render-Commit (Q13) come before Component Purity (Q14) and Rendering Lists with Keys (Q18). Learners never have to fake re-renders or list updates by saving files in VS Code.
- **Callback Props Before Lifting State (Q23 before Q24)**: Child-to-parent notifications via callback props (`#callback_props`, Q23) are taught after `useState` and right before Lifting State Up (`#lifting_state`, Q24), so the parent actually holds state when the child notifies it.
- **Refs Before Effects (Q30 & Q31 before Q32)**: `useRef` (Q30) and DOM refs (Q31) precede `useEffect` (Q32). Real-world effects that focus elements, measure nodes, or manage intervals can use refs naturally.
- **Effects in the react.dev Order (Q32 to Q37)**: Synchronizing with effects, client data fetching, not needing an effect, the effect lifecycle, separating events from effects, and removing dependencies run in one unbroken sequence, so the dependency warnings a newcomer meets at the first effect are answered inside CORE.
- **Rules Before Reuse (Q38 before Q39)**: The rules of hooks come after the reader has used multiple hooks and before custom hooks, so the call-order rule explains errors already seen and governs the hooks about to be written.

### 2. Modern React 19 by Design
- **React 19 Form Architecture (Q40 to Q45)**: Form choice, `<form action={fn}>`, and `useActionState` close the CORE path (Q40 to Q42); `useFormStatus`, `useOptimistic`, and form action reset and progressive enhancement open the MORE tour (Q43 to Q45).
- **The `use()` API**: Context is taught using the modern `use(Context)` API (Q28) alongside promise resolution (Q71).
- **Ref as a Prop**: React 19's native `ref` prop (Q85) is treated as the primary modern standard, with legacy `forwardRef` relegated to the migration appendix (Q99).

### 3. Strict Server Quarantine
React Server Components (RSC), SSR, and Server Functions are strictly quarantined in Part Two (Q101 to Q180). This eliminates premature cognitive load from the `'use client'` boundary while mastering client-side reactivity.

---

## Curriculum Structure (Version 4)

### PART ONE: REACT (Q1 to Q100)
- **Module 1: Foundations, Modules, and Mounting (Q1 to Q7)**: Declarative model, JSX and Fragments, curly brace expressions, component anatomy and parent-child `<Tag />` invocation, multi-file `import`/`export`, the UI and module trees, and `createRoot` with Vite.
- **Module 2: Data Flow and Conditional Branching (Q8 to Q10)**: Props and immutability, `children` and spread attributes, and conditional rendering.
- **Module 3: Interactivity, State, the Render Cycle, and Purity (Q11 to Q16)**: Event handling, `useState`, Trigger-Render-Commit, component purity with `<StrictMode>`, state snapshots, and queued updates.
- **Module 4: Complex State, Lists, and State Architecture (Q17 to Q26)**: Objects in state, rendering lists with keys, arrays in state, controlled inputs, reacting to input, state structure, callback props, lifting state, component identity, and Thinking in React.
- **Module 5: Reducers and Context (Q27 to Q29)**: `useReducer`, context with `use()`, and reducer plus context.
- **Module 6: Refs, Effects, and Client Data (Q30 to Q39)**: `useRef`, DOM refs, `useEffect`, client data fetching, non-effect patterns, effect lifecycle, `useEffectEvent`, effect dependencies, the rules of hooks, and custom hooks.
- **Module 7: React 19 Forms and Actions (Q40 to Q45)**: Controlled versus uncontrolled forms, `<form action>`, `useActionState`, `useFormStatus`, `useOptimistic`, and form action resets with progressive enhancement.
- **Module 8: Architecture, StrictMode, and Client Security (Q46 to Q48)**: Full-stack framework versus standalone build tool, StrictMode auditing across renders, effects, and refs, and XSS with `dangerouslySetInnerHTML`.
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
