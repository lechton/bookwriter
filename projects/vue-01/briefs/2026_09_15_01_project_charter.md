# Brief 01 — Project Charter: vue-01, the Vue.js Interview Lecture Series

Date: 2026-09-15 · Number: 01 · Status: foundational

## What we are doing

We are creating `diagram-lab/output/vue-01/`, a new lecture series for a web developer preparing for job interviews, covering three tracks: (1) Core Reactivity & Composition API, (2) Component Architecture, Templates & Directives, and (3) Application Architecture, State Management & Routing (pure Vue 3 without Nuxt.js). The series follows the architecture of `../css-01/` and `../accessibility-01/`, whose pedagogical clarity, mechanical gates, and visual design systems are our benchmark.

## What I studied from css-01

- `../css-01/instructions.md`: The single source of truth for the workflow, the Harmonious Code + UI Step Rhythm, the opening ladder laws, code fence conventions, and mechanical build gates with zero tolerance for warnings.
- `../css-01/AUTHOR-BRIEF.md`: The working per-lecture brief.
- `../css-01/PEDAGOGICAL-CLARITY.md`: The 14 pedagogical laws (The Insightful Guide Principle, Lexical Baptism, The Physical Wall, Two-Tier Clarity with 4-Pillar breakdown of load-bearing primitives, CEFR B2 language ceiling, Zero Orphan Syntax).
- `../css-01/FIGURE-DESIGN-SYSTEM.md`: The modern benchmark standard for figures (The Never Text-Only Law, strong demarcation, exact mathematical centering, symmetrical comparisons, and pure HTML/CSS figure components).
- `../css-01/AUDIT-CHECKLIST.md`: The mandatory operational checklist for auditing lectures.
- `../css-01/src/`: The build pipeline (`build-lectures.mjs`, `lecture.css`, TOC and book unification tools).

## What carries over directly

1. **The question bank is the plan.** Every lecture exists because a row exists in `../../questions-vue/questions.md`: number, tier (`❱ CORE`, `❱❱ MORE`, `❱❱❱ ADVANCED`), topic tag, question in interview register, and hook as pain-point seed.
2. **The corpus-first quoting law.** Every lecture carries at least one verbatim quote from a local authoritative source in `documentation official/vue/` (or official sibling repositories in `documentation official/`) with a citation path; the build warns when missing.
3. **The Harmonious Code + UI Step Rhythm.** Every technical section: 2–3 sentences of introductory framing, minimal code snippet, minimal UI / figure panel, analytical derivation. Repeat per step.
4. **The Opening Ladder.** 5–7 numbered beats: scene, failure moment, question, danger, mystery, promise. No mechanism terms named; one actor; every noun exactly one tangible thing.
5. **Curriculum typology tiers.** `❱ CORE`, `❱❱ MORE`, `❱❱❱ ADVANCED` tagged on line 2.
6. **The closing 3-column table with the Transposition Law**, plus `### Where you will meet this` and `### Glossary` before the streetwise `### Summary`.
7. **Mechanical build gates with a zero-warning policy.**
8. **The National Times world.** Runnable scenarios situated in the newspaper application.

## What adapts to Vue.js without Nuxt.js

- **Code fences:** Primary language is `vue` (Single File Components `<template>`, `<script setup>`, `<style scoped>`), along with `javascript`, `typescript`, `html`, and `css`.
- **Figure architecture:** Figures visualize Vue reactive state mechanics (Proxy interception, dependency tracking, trigger schedules), component trees (props down, emits up, slots, provide/inject), template compilation (AST -> render functions with patch flags), virtual DOM diffing, and Pinia store actions.
- **Corpus & Bank:** Point to `documentation official/vue/` and `questions-vue/`.

## Execution order

1. Set up cloned project structure with updated internal references.
2. Discuss and finalize authoritative resources in `documentation official/vue/`.
3. Discuss and draft the question bank in `diagram-lab/questions-vue/`.
4. Launch lecture production row-by-row.
