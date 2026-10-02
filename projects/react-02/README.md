# react-lecture-02 — Mastering React 19 Architecture

Status: **question bank frozen; in active lecture production**. The project architecture establishes a unified, publication-grade standard for React 19 and React Server interview preparation. It synthesizes the comprehensive 180-question curriculum and official React documentation from `react-lecture-01` with the modern pedagogical laws, Prince build pipeline, and visual figure architecture refined in `vue-01` and `css-01`.

## What This Project Is

A masterclass series of 180 long-form interview lectures covering two distinct parts:

1. **Part One: React 19 Client Architecture (Q01–Q100)**: Declarative component model, pure rendering, JSX compilation, immutable state contracts, hooks lifecycle (`useState`, `useReducer`, `useRef`, `useMemo`, `useCallback`, `useContext`, `useSyncExternalStore`), render vs commit phases, Fiber reconciliation and work loops, Concurrent React, Transitions, and the React 19 Compiler.
2. **Part Two: React Server & Full-Stack Systems (Q101–Q180)**: Server-Side Rendering (SSR) via `renderToPipeableStream`, client hydration (`hydrateRoot`), avoiding hydration mismatch errors, React Server Components (RSC) architecture, the `'use client'` and `'use server'` boundaries, Flight serialization protocol, Suspense streaming, and React 19 Actions (`useActionState`).

## Documentation Suite & Architecture

```
react-lecture-02/
├── README.md               <- this file: high-level charter and ecosystem layout
├── AUTHOR-BRIEF.md         <- The lean, high-density one-page prompt for writing models
├── instructions/           <- THE GOVERNING INSTRUCTIONS & 4 INVARIANTS
│   ├── 00-project-governance.md    <- Project Governance & System Spec (Holistic Integration Law, Pipeline, Markdown)
│   ├── 01-cognitive-contract.md     <- Invariant 1: Reader Profile, Tone, Anti-Jargon + Embedded Gate 1
│   ├── 02-concept-lifecycle.md      <- Invariant 2: Anchor, Baptism, 4 Pillars, Invisible Scaffolding + Embedded Gate 2
│   ├── 03-harmonious-step-rhythm.md <- Invariant 3: 4-Beat Measure, Code Fidelity, 1:1 Sync + Embedded Gate 3
│   ├── 04-comparative-proof.md      <- Invariant 4: High-Stakes Walls, Symmetrical Duels, Visual Substrate + Embedded Gate 4
│   └── 05-figure-design-system.md   <- Visual pattern catalog for React Component Explorer (RCE) figures
├── 00_COVER.html           <- Prince-ready cover page
├── 00_TOC.md               <- Table of contents
├── briefs/                 <- Dated decision journal (YYYY_MM_DD_NN_<title>.md)
├── md-lectures/            <- THE SOURCE OF TRUTH: one lecture markdown per question
│   └── figures/            <- Standalone HTML/CSS figures referenced via html-figure
│       └── templates/      <- The 7 proven React Component Explorer (RCE) templates
├── md-lectures-html/       <- Compiled HTML output; never edit by hand
├── md-lectures-pdf/        <- Compiled Prince PDF output; never edit by hand
└── src/
    ├── build-lectures.mjs  <- The production pipeline with mechanical gate checks
    ├── build-deck.mjs      <- Standalone deck generator (pdfunite / Prince) for React 2026 Q{first}-Q{last}.pdf
    ├── lecture.css         <- Long-form article stylesheet shared by HTML and PDF
    ├── latex-to-mathml.mjs <- LaTeX math renderer
    ├── clean-inspection-images.mjs <- Utility to clean temporary PNG inspection images
    ├── build-toc.py        <- TOC generator
    └── build-book.py       <- PDF compilation script
```

## Governance: The Holistic Instruction Integration Law

Isolated, local patching is strictly forbidden. When a new instruction or rule is introduced:
1. **Impact Audit**: Classify which of the 4 Invariants in `instructions/` or which section in `instructions/00-project-governance.md` owns it.
2. **Semantic Harmonization**: Absorb the rule directly into the canonical Invariant; never append a loose bullet or an isolated "Law N".
3. **Atomic Cascade**: Simultaneously update `instructions/`, `AUTHOR-BRIEF.md`, `README.md`, and `AGENTS.md`.
4. **Cross-File Integrity**: Guarantee 100% vocabulary consistency and zero dangling references.

## Relationship to Question Bank and Corpus

- **Question Bank**: Lives at `../../questions-react/questions.md` (180 questions with controlled topic vocabulary in `topics.md` and design rationale in `README.md`).
- **Official Corpus**: Lives at `../../documentation official/React 19 Sept 2026/react.dev/` (supplemented by official React RFCs and standards).

## Production Workflow

1. Select a question row from `../../questions-react/questions.md`.
2. Author `md-lectures/{n}.md` and its matching RCE figures in `md-lectures/figures/{n}-01-{slug}.html`.
3. Verify against the **4 Embedded Self-Audit Gates** in `instructions/01-` through `instructions/04-`.
4. Run `node src/build-lectures.mjs` and enforce the zero-warning policy.
5. Purge any inspection PNGs with `node src/clean-inspection-images.mjs`.

