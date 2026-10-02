# css-01 — CSS Interview Lecture Series

Status: **ready for lecture production, pending the question-bank freeze**. The corpus is assembled, the question bank is a 60-question draft under review, the figure canvas is validated, and the production pipeline (`src/build-lectures.mjs` with the gate battery, `src/css-figure.mjs`, `src/lecture.css`) plus the authoring law (`instructions.md`, `AUTHOR-BRIEF.md`) are in place. Read the briefs in order before doing anything else.

## What this project is

A series of long-form interview-preparation lectures on CSS for a web developer preparing for job interviews, covering three tracks:

1. **CSS review for interview** (the cascade, specificity, box model, positioning, flexbox, grid, units, selectors, animations, custom properties, modern CSS).
2. **BEM methodology with LESS and SASS for interview** (naming architecture, preprocessor mechanics, trade-offs, styling strategy).
3. **Responsive design, accessible and cross-browser compatible CSS for interview** (viewport, media and container queries, fluid layouts, responsive images, user-preference media features, normalization, progressive enhancement, testing workflow).

The design benchmark is the sibling project `../accessibility-01/` (54 lectures, complete md -> html -> pdf pipeline), the first complete project of the series.

## Folder structure

```
css-01/
├── README.md              <- this file
├── instructions.md        <- the project's law
├── AUTHOR-BRIEF.md        <- the compact per-lecture brief for the writing model
├── briefs/                <- dated decision journal: YYYY_MM_DD_NN_<title>.md, read in order
├── md-lectures/           <- THE SOURCE OF TRUTH: one lecture markdown per question (empty, ready)
├── md-lectures-html/      <- build output; never edit by hand
├── md-lectures-pdf/       <- build output rendered by Prince; never edit by hand
├── src/
│   ├── build-lectures.mjs <- the pipeline with the gate battery
│   ├── css-figure.mjs     <- the CSS Figure panel generator (modes: box, margin, float, float-text, center)
│   ├── lecture.css        <- the long-form article stylesheet
│   └── canvas-lab/        <- the prototype lab where the canvas was designed (reference demo lesson 08)
└── various/               <- reference material collected earlier (demo UI, design instructions, images, the GPT resources consultation)
```

The question bank lives one level up at `../../questions-css/` (60 questions, draft under review), mirroring how `../accessibility-01/` reads `../../questions-accessibility/`. The corpus lives at `../../documentation official/css/` (handout: its `README.md`) and reuses the CSS zones of `../../documentation official/accessibility-performance/`.

## The briefs (read in order)

1. `briefs/2026_09_13_01_project_charter.md` — what we are doing, what the benchmark study found, the plan and execution order.
2. `briefs/2026_09_13_02_source_research.md` — the authoritative-source research and the executed download plan (with the BEM authority correction).
3. `briefs/2026_09_13_03_canvas_template_study.md` — the creative core: how the CSS figure canvas looks and behaves; validated by the canvas-lab demo lesson.
4. `briefs/2026_09_13_04_question_bank_design.md` — the intellectual core: the nature, quality, and order of the 60 draft questions (grown from 54 after the canon audit).

## Next steps (in order)

1. ~~Discuss and decide the canvas template direction (brief 03), then build the demo lesson in `src/canvas-lab/`~~ **Done:** demo lesson 08 built and validated in browser and Prince.
2. ~~Approve the source download plan (brief 02)~~ **Done 2026-09-13:** the corpus is cloned into `documentation official/css/` (10 repos, incl. sparse csswg-drafts and the corrected BEM authorities); its README handout and `resources/INDEX.md` are written. The two highest-value books (CSS: The Definitive Guide 5e, Responsive Web Design with HTML5 and CSS 5e) are unpacked in `books/` with generated INDEX.md tables.
3. Finalize the question bank (brief 04's remaining review items), then freeze the numbers.
4. ~~Fork the build pipeline and write `instructions.md` + `AUTHOR-BRIEF.md`~~ **Done 2026-09-13:** `src/build-lectures.mjs` (gate battery adapted to figure panels), `src/css-figure.mjs`, `src/lecture.css`, `instructions.md`, `AUTHOR-BRIEF.md`.
5. Start lecture production: one bank row at a time, `node src/build-lectures.mjs` after each lecture, zero warnings is the gate.
