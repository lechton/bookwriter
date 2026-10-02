# React + React Server Interview Questions — Curriculum

A unified, dependency-ordered curriculum of **180 questions** covering both React (the UI library, Q1–Q100) and React Server (SSR, Server Components, and full-stack rendering, Q101–Q180), in a single file with one continuous numbering scale. This bank is the React sibling of `../questions/` (the Svelte 5 + SvelteKit curriculum) and follows the exact same format and tier philosophy.

## File layout

```
questions-react/
├── README.md       ← this file (design + rationale)
├── topics.md       ← controlled vocabulary of hashtags (one tag per question)
└── questions.md    ← all 180 questions, sections stacked, continuous numbering 1–180
```

## Question format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 1 | ❱ CORE | `#what_is_react` | What is React, and how does its declarative component model differ from plain JavaScript? | ... |

- **#** — Stable unique ID, continuous 1–180. Cite any question by number ("write the lecture for Q47").
- **Tier** — `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth; `LEGACY` for migration reference. React Server tiers carry a `(Server)` suffix for clarity.
- **Topic** — One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question** — Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook** — Pain-point framing. Becomes the seed of the lecture's Hook Ladder opening.

## The tiers

### ❱ CORE (React: Q1–Q35, Server: Q101–Q130)
The minimum path that takes a complete newcomer to "I can build and ship a working app." Strict dependency order. Zero legacy content.

### ❱❱ MORE (React: Q36–Q70, Server: Q131–Q165)
The feature tour a working developer eventually needs. Dip in by topic as work demands. Assumes CORE as prerequisite.

### ❱❱❱ ADVANCED (React: Q71–Q95, Server: Q166–Q175)
Deep mechanics: render/commit phases, reconciliation internals, Suspense and concurrency internals, batching, React Compiler, the RSC payload and serialization protocol, resuming. Assumes CORE and the relevant MORE questions.

### LEGACY / MIGRATION (React: Q96–Q100, Server: Q176–Q180)
A separate appendix, not a tier in the learning path. For maintaining/migrating class-component codebases and legacy server APIs. Newcomers skip it entirely.

## How the count is grounded

| Course | Docs files audited | Teachable concepts (after honest stripping) | Questions |
|---|---:|---:|---:|
| React (library + react-dom client) | ~120 | ~730 | 100 |
| React Server (SSR / RSC / static) | ~40 | ~230 | 80 |
| **Total** | **~160** | **~960** | **180** |

The count was derived from a full concept audit of `documentation 2026 Sep React/react.dev/src/content/` — the `learn/` section (50 files), `reference/react/` (48 files), `reference/react-dom/` including client, server, and static APIs (34 files), `reference/rsc/` (5 files), `reference/rules/` (3), `reference/react-compiler/` (10), `reference/eslint-plugin-react-hooks/` (17), and `reference/dev-tools/` (1). A good interview question bundles 4–6 related concepts around one mechanism, so `960 / ~5.5 ≈ 180`.

**Honest stripping applied:** blog posts and community pages (33 files), error/warning catalogs (folded into the questions they belong to), editor setup pages, and the tutorial chapters whose concepts are already covered by the topic pages were removed from the count. React earns more questions than React Server because hooks, state management, effects, and performance each carry dense client-side mechanics, while the server course's payload and streaming concepts are real but leaner than SvelteKit's routing, load, and hooks surface.

## Reading paths

- **Pure newcomer:** Read ❱ CORE in order, both courses. You will be able to build and ship a React app that renders on the server.
- **Working developer:** Finish ❱ CORE (both), then dip into ❱❱ MORE by topic as your work demands.
- **Interview prep:** Skim ❱ CORE, drill ❱❱❱ ADVANCED.
- **Maintaining old code:** Read the LEGACY appendixes (Q96–Q100, Q176–Q180).

## What the split mirrors

The Svelte curriculum split **Svelte** (the component compiler) from **SvelteKit** (the app framework). This curriculum makes the analogous split for React:

- **Part One — React (Q1–Q100)** is the library that runs in the browser: JSX, components, props, state, hooks, effects, refs, context, lists, forms, performance, and the react-dom client surface (`createRoot`, portals, `flushSync`, HTML components).
- **Part Two — React Server (Q101–Q180)** is everything that happens before the browser takes over: server-side rendering, streaming, static prerendering, resuming, hydration, Server Components, Server Functions, the `'use client'` / `'use server'` boundary, request caching, document metadata, and resource preloading.

## Same topic, multiple depths

The tier system lets a topic recur at increasing depth, and the Topic column makes that recurrence visible:

| Topic | ❱ CORE | ❱❱ MORE | ❱❱❱ ADVANCED |
|---|---|---|---|
| `#use_state` | State as memory, snapshots, queues (Q14–Q17) | — | Batching internals (Q79) |
| `#use_effect` | Synchronizing with external systems (Q28) | Lifecycle, dependencies, events (Q39–Q41) | — |
| `#suspense` | — | Fallbacks and boundaries (Q47) | Thrown-promise internals (Q76) |
| `#keys` | List rendering basics (Q11) | Choosing good keys (Q53) | Reconciliation internals (Q90) |
| `#hydration` | hydrateRoot and mismatches (Q104–Q105) | Options and recoverable errors (Q125, Q131) | Payload and resume internals (Q166–Q167) |

## Relationship to the react-lecture-01 project

This bank is the single source of truth for the `../output/react-lecture-01/` project. Every lecture, card, design spec, diagram, and data-flow file in that project is numbered against this file: lecture `md-lectures/47.md` teaches Q47, card `md-cards/47.md` distills it, and so on. The lecture embeds its question verbatim on line 2 as the interview-question callout; after authoring, the lecture file is the source of truth for its own question text.
