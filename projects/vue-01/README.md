# vue-01 — Vue.js Interview Lecture Series

Status: **question bank frozen; in active lecture production**. The project architecture is established, modeled after `../css-01/` and `../accessibility-01/`. The production pipeline (`src/build-lectures.mjs` with the gate battery, `src/vue-figure.mjs`, `src/lecture.css`) plus the authoring law (`instructions.md`, `AUTHOR-BRIEF.md`, `PEDAGOGICAL-CLARITY.md`, `FIGURE-DESIGN-SYSTEM.md`, `AUDIT-CHECKLIST.md`) are in place. Read the briefs in order before doing anything else.

## What this project is

A series of long-form interview-preparation lectures on **Vue.js without Nuxt.js** (Core Vue 3) for a web developer preparing for job interviews, covering three tracks:

1. **Core Reactivity & Composition API** (ES6 Proxy architecture vs Object.defineProperty, `ref` vs `reactive`, unwrapping rules, destructuring reactivity loss, `computed` caching, `watch` vs `watchEffect`, effect scheduler, custom composables).
2. **Component Architecture, Templates & Directives** (`<script setup>` and compile-time macros, props down and events up, `v-model` binding with arguments, slot mechanics, `provide`/`inject`, SFC compilation, patch flags, block tree, virtual DOM diffing, built-in components like `<KeepAlive>`, `<Teleport>`, `<Transition>`).
3. **Application Architecture, State Management & Routing** (Single-Page Application design without meta-frameworks, Vue Router 4 navigation lifecycle and route matching, Pinia store architecture and state flow, performance optimization, and testing with Vitest and Vue Test Utils).

The design benchmark and origin of inherited laws is the sibling project `../css-01/` and `../accessibility-01/`.

## Folder structure

```
vue-01/
├── README.md              <- this file
├── instructions.md        <- the project's law
├── AUTHOR-BRIEF.md        <- the compact per-lecture brief for the writing model
├── PEDAGOGICAL-CLARITY.md <- the permanent teaching standard (insightful guide, lexical baptism, physical wall)
├── FIGURE-DESIGN-SYSTEM.md<- visual pattern catalog for Vue figure components
├── AUDIT-CHECKLIST.md     <- the mandatory operational audit checklist
├── 00_COVER.html          <- Prince-ready cover page
├── 00_TOC.md              <- table of contents placeholder
├── briefs/                <- dated decision journal: YYYY_MM_DD_NN_<title>.md, read in order
├── md-lectures/           <- THE SOURCE OF TRUTH: one lecture markdown per question
│   └── figures/           <- standalone HTML/CSS figure components embedded via html-figure
├── md-lectures-html/      <- build output; never edit by hand
├── md-lectures-pdf/       <- build output rendered by Prince; never edit by hand
├── src/
│   ├── build-lectures.mjs <- the pipeline with the gate battery
│   ├── vue-figure.mjs     <- the Vue Figure panel generator and parser
│   ├── lecture.css        <- the long-form article stylesheet
│   ├── build-toc.py       <- TOC generator
│   └── build-book.py      <- PDF compilation script
└── various/               <- reference material collected for Vue (demo UI, prototypes, consultations)
```

The question bank lives one level up at `../../questions-vue/` (mirroring how `../css-01/` reads `../../questions-css/`). The corpus lives at `../../documentation official/vue/` (handout: its `README.md`).

## The briefs (read in order)

1. `briefs/2026_09_15_01_project_charter.md` — what we are doing, clone architecture from `css-01`, and the execution plan.
2. `briefs/2026_09_15_02_project_setup_and_architecture_clone.md` — project setup, file structure, reference rewiring, build pipeline verification, and placeholder configuration.
3. `briefs/2026_09_15_03_source_research_and_download_plan.md` — authoritative source research, the 11-repository canon, and the shallow clone download plan.
4. `briefs/2026_09_15_04_question_bank_design.md` — question bank design, 4 tracks, depth tiers, and curriculum freeze.
5. `briefs/2026_09_15_05_adopting_inverted_pyramid_of_truth.md` — adopting the Inverted Pyramid of Truth and banning Delayed Truth-Bombs from day one.
6. `briefs/2026_09_15_06_vue_component_explorer_and_figure_templates.md` — the Vue Component Explorer design language, Rule of 3 repetition ceiling, 6 figure templates, and dedicated showcase PDF.

## Next steps (in order)

1. Start lecture production: one bank row at a time, `node src/build-lectures.mjs` after each lecture, zero warnings is the gate.
