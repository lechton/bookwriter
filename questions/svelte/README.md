# Svelte 5 + SvelteKit Interview Questions — Curriculum

A unified, dependency-ordered curriculum of **210 questions** covering both Svelte 5 (Q1–Q100) and SvelteKit (Q101–Q210), in a single file with one continuous numbering scale.

## File layout

```
questions/
├── README.md       ← this file (design + rationale)
├── topics.md       ← controlled vocabulary of hashtags (one tag per question)
└── questions.md    ← all 210 questions, sections stacked, continuous numbering 1–210
```

## Question format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 1 | ❱ CORE | `#what_is_svelte` | What is Svelte? | ... |

- **#** — Stable unique ID, continuous 1–210. Cite any question by number ("write the lecture for Q47").
- **Tier** — `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth; `LEGACY` for migration reference. SvelteKit tiers carry a `(Kit)` suffix for clarity.
- **Topic** — One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question** — Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook** — Pain-point framing. Becomes the lecture's opening paragraph.

## The tiers

### ❱ CORE (Svelte: Q1–Q35, SvelteKit: Q101–Q135)
The minimum path that takes a complete newcomer to "I can build and ship a working app." Strict dependency order. Zero legacy content.

### ❱❱ MORE (Svelte: Q36–Q70, SvelteKit: Q136–Q185)
The feature tour a working developer eventually needs. Dip in by topic as work demands. Assumes CORE as prerequisite.

### ❱❱❱ ADVANCED (Svelte: Q71–Q95, SvelteKit: Q186–Q210)
Deep mechanics: signal internals, dependency tracking, escape hatches, compiler analysis, advanced rendering, custom adapters, observability. Assumes CORE and the relevant MORE questions.

### LEGACY / MIGRATION (Svelte: Q96–Q100)
A separate appendix, not a tier in the learning path. For maintaining/migrating Svelte 3/4 code and "how did this used to work" interview questions. Newcomers skip it entirely.

## How the count is grounded

| Course | Docs files audited | Teachable concepts (after honest stripping) | Questions |
|---|---:|---:|---:|
| Svelte 5 | 90 | ~575 | 100 |
| SvelteKit | 75 | ~940 | 110 |
| **Total** | **165** | **~1,515** | **210** |

The count was derived from a full concept audit of `documentation 2026 June/svelte-docs/` and `documentation 2026 June/sveltekit-docs/` (four parallel research agents mapped every doc file). A good interview question bundles 4–6 related concepts around one mechanism, so `1,515 / ~7 ≈ 210`. SvelteKit earns slightly more than Svelte because routing, `load`, form actions, and hooks are each concept-dense and interview-central.

**Honest stripping applied:** remote functions (~85 concepts, experimental), per-adapter env-var detail (~70), SvelteKit 1→2 migration trivia (~30), and niche areas (AMP, observability internals, custom-adapter authoring) were compressed to keep the count realistic for an interview curriculum rather than a reference manual.

## Reading paths

- **Pure newcomer:** Read ❱ CORE in order, both courses. You will be able to build and ship a SvelteKit app.
- **Working developer:** Finish ❱ CORE (both), then dip into ❱❱ MORE by topic as your work demands.
- **Interview prep:** Skim ❱ CORE, drill ❱❱❱ ADVANCED.
- **Maintaining old code:** Read the LEGACY appendix (Q96–Q100).

## What this fixes vs. the original flat 200-question list

| Original problem | Fixed by |
|---|---|
| Q12 dropped `mount`/`unmount`/`hydrate`/SSR on a reader with no foundation | `mount` is Q16 (post-foundation); `unmount`/`hydrate`/`render` are in MORE/ADVANCED. |
| 18 questions of compiler internals before any interactivity | One accessible concept question (Q1), then interactive by Q5. |
| Runes before props and lists | Props at Q9, lists at Q13 — composition before depth. |
| Legacy material interleaved throughout | Zero legacy in CORE/MORE/ADVANCED. Legacy lives in its own appendix. |
| No SvelteKit coverage | A full 110-question SvelteKit course (Q101–Q210), same tier structure. |
| No navigable index | The Topic column (controlled vocabulary, 104 tags) makes "all `$derived` questions" a single-column scan. |

## Same topic, multiple depths

The tier system lets a topic recur at increasing depth, and the Topic column makes that recurrence visible:

| Topic | ❱ CORE | ❱❱ MORE | ❱❱❱ ADVANCED |
|---|---|---|---|
| `#state` | Create a reactive variable (Q4) | Deep reactivity, classes, snapshots (Q36–Q40) | Proxy internals, compiler output, `.eager` (Q75–Q77) |
| `#effect` | Run a side effect (Q15) | Tracking rules (Q44) | `$effect.pre`, `untrack`, `.root`, infinite loops (Q78–Q83) |
| `#mount` | Get the app on the page (Q16) | — | Effects-don't-run-during-mount, `flushSync` (Q84) |
| `#load` | Load data before render (Q110) | Invalidation, waterfalls, streaming (Q139–Q144) | Dependency tracking, auth architecture (Q186–Q187) |
