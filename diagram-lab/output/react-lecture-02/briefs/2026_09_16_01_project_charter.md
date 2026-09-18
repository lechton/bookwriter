# Brief 01 — Project Charter: react-lecture-02, The Modern React 19 Architecture Series

Date: 2026-09-16 · Number: 01 · Status: foundational

## What we are doing

We are creating `diagram-lab/output/react-lecture-02/`, a publication-grade interview lecture series covering modern React 19 and React Server across 180 questions:
1. **Part One: React 19 Client Architecture (Q01–Q100)**: Components, JSX compilation, immutable state contracts, hooks lifecycle, render vs commit phases, Fiber reconciliation, Concurrency, and the React 19 Compiler.
2. **Part Two: React Server & Full-Stack Systems (Q101–Q180)**: Server-Side Rendering (SSR), streaming via `renderToPipeableStream`, client hydration (`hydrateRoot`), React Server Components (RSC), the `'use client'`/`'use server'` boundary, Flight protocol streaming, and Server Actions (`useActionState`).

The project unifies the frozen 180-question bank and official documentation from `react-lecture-01` with the modern pedagogical laws, Prince build pipeline, and visual architecture refined in `vue-01` and `css-01`.

## What We Studied and Improved

### From `react-lecture-01`:
- **The Question Bank**: 180 rigorously audited, dependency-ordered questions in `../../questions-react/questions.md`.
- **The Corpus**: Official React documentation at `documentation official/React 19 Sept 2026/react.dev/`.
- **The Need for Modernization**: `react-lecture-01` used an older 800–1,200 word format with programmatic ASCII-style component explorer boxes. It lacked modern standalone HTML/CSS figures, Prince print media formatting, and the advanced pedagogical framework developed later.

### From `vue-01`:
- **Modern Pedagogical Framework**: The "Headache & Short Attention Span" standard (CEFR B2 clarity), Chronological Timeline, Concept Before Jargon, the Inverted Pyramid of Truth (banning delayed truth-bombs), Lexical Baptism, Two-Tier Clarity, and Poisonous Documentation Jargon Demystification.
- **Visual Design Architecture**: Standalone HTML/CSS figure components embedded via `html-figure`, PrinceXML letter-page budgets (~380–420px), and clean macOS window chrome.
- **Unified & Elegant Rewriting**: In `vue-01`, pedagogical benchmarks were repeated multiple times across files with informal formatting. In `react-lecture-02`, the instruction suite is rewritten into a clean, non-redundant hierarchy:
  - `instructions.md`: The definitive project constitution.
  - `PEDAGOGICAL-CLARITY.md`: The deep teaching manual with authentic React 19 ❌ Bad vs ✅ Good examples.
  - `AUTHOR-BRIEF.md`: The lean, zero-fluff prompt for writing models.
  - `AUDIT-CHECKLIST.md`: The consolidated 6-gate operational inspection checklist.
  - `FIGURE-DESIGN-SYSTEM.md`: The React Component Explorer (RCE) visual specification.

## Core Invariants

1. **Question Bank as the Plan**: Every lecture maps 1:1 to a frozen row in `../../questions-react/questions.md`.
2. **Authoritative Quoting Law**: At least one verbatim quote cited from `documentation official/React 19 Sept 2026/react.dev/src/content/...`.
3. **Harmonious Code + UI Step Rhythm**: `[Introductory Prose (2–3 sentences)] -> [Minimal Code Snippet] -> [RCE Figure] -> [Analytical Derivation]`.
4. **React Component Explorer (RCE)**: Standalone HTML/CSS figures (`md-lectures/figures/`) with React Cyan branding (`#087ea4`, `#149eca`), Slate (`#23272f`), `.jsx`/`.tsx` file trees, and authentic UI widgets.
5. **Zero-Warning Mechanical Gate**: `node src/build-lectures.mjs` must exit with 0 warnings.
