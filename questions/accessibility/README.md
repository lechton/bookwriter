# Web Accessibility and Web Performance Interview Questions

A dependency-ordered curriculum of interview questions on Web Accessibility and Web Performance, grounded in the local corpus at `../../documentation official/accessibility-performance/` (handout: its `README.md`). One continuous numbering scale, sections stacked one under the other, so any question can be cited by its number (for example "write the lecture for Q47").

## Format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|

- **#** — Stable unique ID. Cite any question by number; the lecture filename in `../output/accessibility-01/md-lectures/` matches it.
- **Tier** — `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth.
- **Topic** — One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question** — Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook** — Pain-point framing. Becomes the seed of the lecture's Opening Ladder.

## Curriculum shape

The bank consists of **54 questions**, built from audits of the authoritative sources for the domain. We bundled related concepts into one interview question around one mechanism, and ordered the rows so a lecture only depends on concepts an earlier lecture taught.

- **Part One — Web Accessibility (Q1–Q34)**
  - **CORE (Q1–Q17):** Foundations and Content (POUR, semantics, ARIA basics, headings, structure, imagery, contrast).
  - **MORE (Q18–Q26):** Forms, Focus, and Basic ARIA (labels, focus order, keyboard operability, live regions).
  - **ADVANCED (Q27–Q34):** Patterns and Testing (dialogs, tabs, custom controls, manual testing, screen reader mechanics).

- **Part Two — Web Performance (Q35–Q54)**
  - **CORE (Q35–Q43):** Loading and the Network (critical rendering path, async/defer, image/font perf, caching, compression).
  - **MORE (Q44–Q49):** Measurement and Optimization (Core Web Vitals thresholds, Lighthouse lab vs field data, DevTools).
  - **ADVANCED (Q50–Q54):** Runtime and Engine Internals (V8 execution, event loop, memory leaks, rendering layout thrash).

## Reading paths

- **Pure newcomer:** Read ❱ CORE in order.
- **Working developer:** Finish ❱ CORE, then dip into ❱❱ MORE by topic as your work demands.
- **Interview prep:** Skim ❱ CORE, drill ❱❱❱ ADVANCED.
