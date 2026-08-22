# Svelte 5 Lecture Course

This project produces an audio lecture course that teaches **Svelte 5** from the ground up, written for a developer who once knew **React** (years ago, mostly forgotten) and dabbled in **Vue** (also forgotten). Every framework reference is explained, never dropped cold, and the idiosyncratic, compiler-first nature of Svelte 5 is presented with conceptual clarity.

Each topic ships as **two paired artifacts**:

1. **A lecture** — an hour-long spoken script, fed to a text-to-speech engine. It contains **no raw code**: every symbol is narrated in plain English, and the listener is repeatedly pointed at "the booklet."
2. **A booklet (outline)** — the printed code companion the listener holds while listening. It carries **all the code** the lecture refers to, sourced verbatim from the documentation, laid out to match the lecture section for section.

The two are twins. The lecture carries the *explanation*; the booklet carries the *code*. They are designed to be used side by side.

---

## How to read this repo (start here)

- **`CLAUDE.MD`** — the project's standing instructions. Read it first. It points at the two skills below and states the audience and tone.
- **`skills/write_lecture.md`** — the full specification for writing a lecture (the audio script).
- **`skills/write_outline_v02.md`** — the full specification for writing a booklet (the code companion) *from* a finished lecture.
- **`output/svelte/00_TOC_lectures_svelte.md`** — the course plan: the ordered list of lectures, each mapped to the documentation files it is responsible for covering.

---

## File layout

```
svelte dev 2026/
├── CLAUDE.MD                          # Project instructions (read first)
├── README.md                         # This file
│
├── documentation 2026 June/          # SOURCE material — read-only reference, the master copy of all code
│   ├── svelte-docs/                  # Svelte 5 docs, by topic
│   │   ├── 01-introduction/          #   overview, getting started, .svelte files, .svelte.js files
│   │   ├── 02-runes/                 #   $state, $derived, $effect, $props, $bindable, $inspect, $host
│   │   ├── 03-template-syntax/       #   markup, {#if}, {#each}, snippets, bind:, transitions, ...
│   │   ├── 04-styling/               #   scoped styles, global, custom properties
│   │   ├── 05-special-elements/      #   <svelte:boundary>, <svelte:window>, <svelte:element>, ...
│   │   ├── 06-runtime/               #   stores, context, lifecycle, imperative API
│   │   ├── 07-misc/                  #   best practices, testing, typescript, custom elements, migration
│   │   ├── 98-reference/             #   API module stubs (svelte/motion, svelte/store, ...)
│   │   └── 99-legacy/                #   pre-Svelte-5 idioms (for the migration lectures)
│   └── sveltekit-docs/               #   SvelteKit docs (companion framework)
│
├── skills/                           # The "how to write" prompts that govern production
│   ├── write_lecture.md              #   How to write a lecture (audio script)
│   ├── write_outline_v02.md          #   How to write a booklet (code companion) — CURRENT
│   └── write_outline.md              #   The original legal-outline skill; ancestor of v02, kept for reference
│
└── output/
    ├── lecture_on_state.md           # The original demo lecture — the STYLE TEMPLATE every lecture follows
    │                                 #   (its content now also lives, renamed, as lectures/03_state.md)
    └── svelte/
        ├── 00_TOC_lectures_svelte.md # The 25-lecture course plan + per-lecture source-file mapping
        ├── lectures/                 # THE AUDIO SCRIPTS (TTS-safe, code-free)
        │   ├── 01_compiler_mindset.md
        │   ├── 02_svelte_file_and_runes.md
        │   ├── 03_state.md
        │   └── 04_derived.md
        ├── outlines/                 # THE PRINTED BOOKLETS (code companions to the lectures)
        │   ├── 01_compiler_mindset_outline.md
        │   ├── 02_svelte_file_and_runes_outline.md
        │   ├── 03_state_outline.md
        │   └── 04_derived_outline.md
        └── outlines-pdf/             # Rendered HTML / PDF exports of the booklets for printing
```

---

## Naming and numbering conventions

These are enforced by the two skills and shared across both artifacts.

| Thing | Rule | Example |
|---|---|---|
| Lecture file | `NN_slug.md` in `output/svelte/lectures/` | `04_derived.md` |
| Booklet file | the lecture's twin plus `_outline`, in `output/svelte/outlines/` | `04_derived_outline.md` |
| Title (both files) | `# NN \| Title` — number zero-padded, vertical bar, title | `# 04 \| Computed Values Without Cache Bugs: The Derived Rune` |
| Lecture section | `## N.M Title` — lecture number (not padded), dot, section index | `## 4.5 The Derived Rune: You Just Write The Expression` |
| Booklet section | `## ❒ N.M Title` — **the same number and title as the matching lecture section** | `## ❒ 4.5 The Derived Rune: You Just Write The Expression` |

The shared `N.M` section numbers are the key to navigation: hearing "section 4.5" in the audio, you flip the booklet straight to `❒ 4.5` and land on the same topic.

---

## What makes a good lecture (the audio script)

Full spec in `skills/write_lecture.md`. In short:

- **TTS-safe, plain ASCII only.** No em/en-dashes, no curly quotes, no ellipsis glyph, no arrows, no emoji, no markdown bold/italic, no code blocks.
- **No raw code.** Every symbol is spoken in English ("dollar sign state", "count plus plus"), and the listener is pointed to the exact block in the booklet.
- **Lead with the problem,** then the solution. Build the pain before the relief.
- **Explain every framework reference** (React, Vue, Solid) as you make it.
- **Relentless repetition** and a full recap near the end.
- **About one hour** (~9,000–10,000 words), charismatic and warm.
- Built on real documentation plus outside research for "pearls of wisdom" the docs don't contain.

## What makes a good booklet (the code companion)

Full spec in `skills/write_outline_v02.md`. In short:

- **No code left behind.** Every code block the lecture points to, and every snippet in the lecture's source docs, appears — verbatim, and cited back to its source file.
- **Code-forward, clean markdown** that renders everywhere: a blank line between every element, each block under a `### ▶ Block N` header, notes as a bullet list.
- **A filename in every code fence** via `title="..."` (invented sensibly when the docs give none; skipped only on trivial one-liners).
- **High-voltage voice:** short sentences, plain words, concrete contrasts, jargon translated on the spot. Clear and complete, but never a transcript of the lecture.
- Built **from** a finished lecture, mirroring its sections and numbers exactly.

---

## Status

The course plan in `00_TOC_lectures_svelte.md` is **25 lectures** across six parts (a restructured, consolidated version of an earlier 30-lecture draft). Written so far:

| # | Topic | Lecture | Booklet | Sections |
|---|---|---|---|---|
| 01 | The Compiler Mindset (what Svelte is, how to run it) | ✓ | ✓ | `1.1`–`1.13` |
| 02 | The `.svelte` File and the Runes That Live In It | ✓ | ✓ | `2.1`–`2.12` |
| 03 | State Is Just a Variable (`$state`) | ✓ | ✓ | `3.1`–`3.17` |
| 04 | Computed Values Without Cache Bugs (`$derived`) | ✓ | ✓ | `4.1`–`4.13` |
| 05 | Reactive Side Effects (`$effect`) | — | — | next |

The remaining lectures (05–25: `$effect`, `$props`/`$bindable`, template syntax, motion/styling, special elements, runtime APIs, practices, and migration) are scoped in the TOC and not yet written.

---

## Workflow: adding the next topic

1. **Write the lecture.** Read the topic's source files (listed under its title in the TOC) and follow `skills/write_lecture.md`. Discuss section structure, then write to `output/svelte/lectures/NN_slug.md`. Number sections `## N.M`. Keep it TTS-safe; verify (no non-ASCII, no code fences) and check length (~1 hour).
2. **Write the booklet.** Follow `skills/write_outline_v02.md`. Inventory the lecture's "look at the booklet" pointers, gather every code block from the source docs, and lay them out in the lecture's order to `output/svelte/outlines/NN_slug_outline.md`. Give each section the **same `## ❒ N.M` number and title** as the lecture. Put a `title="..."` on each code fence. Verify alignment: a `diff` of the lecture's `## N.M` headers against the booklet's `## ❒ N.M` headers should be identical.

The lecture and booklet are always produced as a pair, in that order — the booklet is built from the finished lecture.
