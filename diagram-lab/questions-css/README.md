# CSS Interview Questions (DRAFT)

A dependency-ordered curriculum of interview questions on CSS, BEM with LESS and SASS, and responsive + accessible + cross-browser CSS, grounded in the corpora at `../../documentation official/css/` (assembled 2026-09-13; handout: its `README.md`) and the reusable CSS zones of `../../documentation official/accessibility-performance/`. One continuous numbering scale, sections stacked one under the other, so any question can be cited by its number (for example "write the lecture for Q13").

## Format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|

- **#** — Stable unique ID. Cite any question by number; the lecture filename in `../output/css-01/md-lectures/` matches it.
- **Tier** — `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth.
- **Topic** — One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question** — Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook** — Pain-point framing. Becomes the seed of the lecture's Opening Ladder.

## Curriculum shape

The bank consists of **60 questions** (DRAFT, under review; numbers freeze on approval), built from audits of the authoritative sources for the domain, including the front-end-interview-handbook canon audit of 2026-09-13 (27 community questions mapped: 24 covered, CSS sprites judged obsolete, BFC and content-hiding gaps closed). We bundled related concepts into one interview question around one mechanism, and ordered the rows so a lecture only depends on concepts an earlier lecture taught.

- **Part One — CSS Review (Q1–Q31)**
  - **CORE (Q1–Q14):** The Cascade and the Box (cascade, specificity, inheritance, box model, margin collapsing, display, positioning, stacking contexts, floats, formatting contexts, units, colors, typography, selectors).
  - **CORE (Q15–Q20):** Layout (flexbox axes, flex items, grid, grid placement, centering, math functions).
  - **MORE (Q21–Q30):** Mechanics and Modern CSS (pseudo-classes and pseudo-elements, transitions and animations, transforms, custom properties, backgrounds, overflow, modern selectors, hiding content, intrinsic sizing, subgrid).
  - **ADVANCED (Q31):** The New Cascade (native nesting, @layer, @scope).
- **Part Two — BEM with LESS and SASS (Q32–Q45)**
  - **CORE (Q32–Q35):** Naming and Methodology (why methodologies, BEM grammar, BEM trade-offs).
  - **MORE (Q36–Q42):** Sass and Less in Practice (methodology landscape, Sass basics, mixins and extend, modules, logic, BEM with Sass, Less).
  - **ADVANCED (Q43–Q45):** Preprocessor Mastery (pitfalls, preprocessors vs modern CSS, styling strategy).
- **Part Three — Responsive, Accessible, and Cross-Browser CSS (Q46–Q60)**
  - **CORE (Q46–Q51):** Responsive Foundations (viewport meta, media queries, breakpoints, fluid layouts, responsive images, responsive patterns).
  - **MORE (Q52–Q57):** Adaptation and User Preferences (container queries, dark mode, preference media features, pointer media, the CSS surface of accessibility, logical properties and RTL).
  - **ADVANCED (Q58–Q60):** Cross-Browser Engineering (normalization, progressive enhancement, testing workflow).

Tier distribution: **30 CORE / 23 MORE / 7 ADVANCED**.

## Reading paths

- **Pure newcomer:** Read ❱ CORE in order, all three parts.
- **Working developer:** Finish ❱ CORE, then dip into ❱❱ MORE by topic as your work demands.
- **Interview prep:** Skim ❱ CORE, drill ❱❱❱ ADVANCED.
