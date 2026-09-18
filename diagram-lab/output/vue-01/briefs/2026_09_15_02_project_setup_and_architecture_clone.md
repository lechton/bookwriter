# Brief 02 — Project Setup & Architecture Clone: vue-01 (Vue.js without Nuxt.js)

Date: 2026-09-15 · Number: 02 · Status: project setup complete, pipeline verified end-to-end with zero warnings, ready for question-bank and resources discussion

## What we did

Following the approved project charter (`briefs/2026_09_15_01_project_charter.md`), we studied the origin project `../css-01/` (and its benchmark `../accessibility-01/`) and established `vue-01` as a twin lecture series. The new series covers **Vue.js without Nuxt.js** (Core Vue 3: Reactivity Engine, Component Architecture, Composition API, SFC Template Compilation, Virtual DOM patching, Vue Router, Pinia, and Performance Optimization).

We cloned the project architecture, adapted all instructions, design systems, operational checklists, and build scripts, rewired all internal references to the new paths, created placeholder directories for external question banks and documentation, and verified the pipeline with a clean end-to-end build producing `Mastering Vue.js Architecture.pdf`.

---

## 1. Project Structure and File Layout

The `vue-01` project lives at `diagram-lab/output/vue-01/` with the following established structure:

```
vue-01/
├── README.md              <- Project charter, file map, and build directions
├── instructions.md        <- The project's single source of truth and law
├── AUTHOR-BRIEF.md        <- Compact per-lecture brief for authoring models
├── PEDAGOGICAL-CLARITY.md <- 12 permanent pedagogical clarity laws adapted for Vue
├── FIGURE-DESIGN-SYSTEM.md<- Visual pattern catalog for Vue figure components
├── AUDIT-CHECKLIST.md     <- Operational audit checklist with strict gates
├── 00_COVER.html          <- Prince-ready cover page
├── 00_COVER.pdf           <- Compiled cover PDF
├── 00_TOC.md              <- Table of contents markdown
├── 00_TOC.html            <- Compiled HTML table of contents
├── 00_TOC.pdf             <- Compiled PDF table of contents
├── briefs/                <- Dated decision journal
│   ├── 2026_09_15_01_project_charter.md
│   └── 2026_09_15_02_project_setup_and_architecture_clone.md
├── md-lectures/           <- SOURCE OF TRUTH: one markdown lecture per question
│   ├── 01.md              <- Initial verified sample lecture
│   └── figures/           <- Standalone HTML/CSS figure components
│       └── 01-01-proxy-trap.html
├── md-lectures-html/      <- Build output: 01.html, deck.html
├── md-lectures-pdf/       <- Build output: 01.pdf, Vue Q01-Q01.pdf
├── src/
│   ├── build-lectures.mjs <- Pipeline compiler enforcing mechanical gates
│   ├── vue-figure.mjs     <- Vue figure generator & parser
│   ├── lecture.css        <- Print & screen stylesheet (with .vue-figure support)
│   ├── build-toc.py       <- TOC compiler reading questions-vue/questions.md
│   ├── build-book.py      <- PDF book unifier (Cover + TOC + Deck -> Book)
│   ├── latex-to-mathml.mjs<- Math formula compiler
│   └── extract.mjs        <- Figure extraction utility
└── various/               <- Reference material, UI demos, and consultations
```

---

## 2. Pedagogical Adaptations: From CSS to Vue.js Runtime Mechanics

The full rigor of the pedagogical clarity standards established across `css-01` was preserved and translated to the Vue.js domain:

1. **The "Insightful Guide" Principle**: Replaced CSS vector coordinate descriptions with natural prose deconstructing Vue runtime cause-and-effect: what broke on screen, which line of code caused it, and what internal Vue engine rule produced the result. Robotic eyeball commands ("Look at...", "Notice the arrow...") are strictly banned.
2. **Lexical Baptism**: No reactive term (`ref`, `reactive`, `dirty flag`, `patch flag`, `proxy trap`) may debut on a diagram badge or label without intuitive plain-English definition in the preceding text.
3. **The Physical Wall (Symptom First, Engine Second)**: Demonstrates the visible application failure (frozen cart counter, lost reactive state) and the naive quick-fix that fails before presenting the architectural Vue engine cure.
4. **Two-Tier Clarity**:
   - *Tier 1 (Passing Terms)*: Grounded parenthetically in concrete physical behavior.
   - *Tier 2 (Load-Bearing Primitives)*: Upfront baptism in Section 1 paragraph 1, followed by a dedicated 4-pillar architectural breakdown in Section 2 (Technical Nomenclature, Everyday Physical Analogy, "Why We Suffered Before" Contrast, and Physical Engine Routine).
5. **The Three-Floor Elevator**: Floor 1 DOM Reality $\to$ Floor 2 Vue Composition & Template Notation $\to$ Floor 3 Vue Engine Runtime & Scheduler Consequence.
6. **Zero-Orphan-Syntax (Law 18)**: 8–12 line budget per code block; every declared reactive property, directive, and method must be explicitly unpacked in surrounding prose.

---

## 3. Visual Figure System & Proven Vue Archetypes

Adapted the visual design system (`FIGURE-DESIGN-SYSTEM.md`) from CSS box layout to Vue runtime and component architecture, maintaining the **"Never Text-Only" Law**, pure HTML/CSS components, and zero platform emojis:

1. **Archetype 1: Reactivity Engine & Proxy Trap Pipeline**: Visualizes memory target objects, Proxy wrappers, `get` $\to$ `track()` and `set` $\to$ `trigger()` pathways with subscriber effect nodes.
2. **Archetype 2: Component Hierarchy & Communication Pipeline**: Tree node cards with downward directed prop arrows (Teal `#0e7490`), upward emit events (Emerald `#059669`), and `provide`/`inject` cross-tree channels.
3. **Archetype 3: Template Compiler & Virtual DOM Patching**: SFC template AST $\to$ compiled render functions with patch flag bitmasks (`TEXT = 1`, `CLASS = 2`) and targeted VNode diffing.
4. **Archetype 4: Lifecycle & Effect Scheduler Timeline**: Numbered phase checkpoints for `nextTick()`, microtask queue execution, and watch flush timing (`pre`, `post`, `sync`).
5. **Archetype 5: Pinia Store Architecture & State Flow**: Decoupled State, Getters, Actions compartments and reactive component subscriptions.
6. **Archetype 6: Realistic Web Component / App Preview**: Authentic simulated macOS browser windows (`.cb-window`) depicting rendered UI components with separated diagnostic footers.

---

## 4. Build Pipeline Enhancements in `src/build-lectures.mjs`

1. **Vue Syntax & Primitive Highlighting**: Added `VUE_PRIMITIVES` set (`ref`, `reactive`, `computed`, `watch`, `watchEffect`, `toRef`, `toRefs`, `shallowRef`, `triggerRef`, `defineProps`, `defineEmits`, `defineExpose`, `provide`, `inject`, `nextTick`, etc.) tokenized as `<span class="hook">` and `<span class="fn">`.
2. **Default Filenames**: Added `vue` $\to$ `App.vue` and `typescript`/`ts` $\to$ `app.ts` to `defaultFilename()`.
3. **Figure Container Integration**: Injected `<figure class="vue-figure css-figure">` for seamless styling in Prince.
4. **Citation Path Gate**: Updated regex to validate citations from `documentation official/vue/` and official sibling repositories (`resources/...`).
5. **Deck Naming**: Configured automatic ranged deck naming: `Vue Q${first}-Q${last}.pdf` with deck title `"Vue.js Interview Lectures"`.
6. **Book Unification (`src/build-book.py`)**: Unites `00_COVER.pdf` + `00_TOC.pdf` + `Vue Q*.pdf` into `Mastering Vue.js Architecture.pdf`.

---

## 5. Question Bank & Documentation Placeholders

Created clean, decoupled placeholder directories ready for joint review:

- **`diagram-lab/questions-vue/`**:
  - `questions.md`: Markdown table header `# | Tier | Topic | Question | Hook`.
  - `topics.md`: Controlled topic vocabulary covering 3 planned tracks (Core Reactivity, Component Architecture, Application Architecture & Routing/Pinia).
  - `README.md`: Curriculum design rationale.
- **`documentation official/vue/`**:
  - `README.md`: Authority handout outlining intended upstream repositories (`vuejs/core`, `vuejs/docs`, `vuejs/rfcs`, `vuejs/router`, `vuejs/pinia`, `vuejs/test-utils`, books).
  - `resources/`: Empty directory ready for shallow clones.
  - `books/`: Empty directory ready for authoritative books.

---

## 6. End-to-End Verification Results

1. **Lecture Build**: `node src/build-lectures.mjs` processed `01.md`, outputting `md-lectures-html/01.html`, `md-lectures-html/deck.html`, `md-lectures-pdf/01.pdf`, and `md-lectures-pdf/Vue Q01-Q01.pdf` with **zero warnings**.
2. **Table of Contents**: `python3 src/build-toc.py` generated `00_TOC.md`, `00_TOC.html`, and rendered `00_TOC.pdf`.
3. **Book Compilation**: `python3 src/build-book.py` united Cover, TOC, and Lecture Deck into `Mastering Vue.js Architecture.pdf`.
4. **Internal References**: Grep search confirmed zero stale paths to `questions-css` or `css-01`.
5. **Rule Integration**: Added `Vue.js Interview Lectures (diagram-lab/output/vue-01)` section to `AGENTS.md`.

---

## 7. Next Steps

1. **Discuss and approve authoritative resources in `documentation official/vue/`**:
   - Determine which repositories to shallow-clone (`vuejs/core`, `vuejs/docs`, `vuejs/rfcs`, `vuejs/router`, `vuejs/pinia`, `vuejs/test-utils`).
   - Identify licensed books to unpack in `books/`.
2. **Discuss and populate the question bank in `diagram-lab/questions-vue/questions.md`**:
   - Review proposed tracks and question bank size (e.g. 50–60 questions).
   - Freeze question IDs and typology tiers (`❱ CORE`, `❱❱ MORE`, `❱❱❱ ADVANCED`).
3. **Begin lecture production row-by-row**:
   - Apply the Harmonious Code + UI Step Rhythm and zero-warning build gate to each lecture.
