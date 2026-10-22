# Consultation Brief: River Version (`v2`) vs. Original Version (`v1`) — Upgrading `01-01-map-principles` to Eliminate `pre-lecture` While Preserving Full Comprehensiveness

- **Date**: 2026-10-21
- **Project**: `projects/react-09`
- **Canonical Version Names**:
  - **`v1` = Original Version** (`skills/v9.1/v1/`, `01-01-map-principles/v1/`, `01-01-md-PRE-lectures/v1/`, `01-02-md-LECTURES/v1/`, `02-01-md-revised-1..4/v1/`)
  - **`v2` = River Version** (`skills/v9.1/v2/`, `01-01-map-principles/v2/`, `01-02-md-LECTURES/v2/`, `01-03-md-lectures-HTML/v2/`, `01-04-md-lectures-PDF/v2/`)
- **Companion Brief**: [04-user-directives-and-skill-rules-brief.md](./04-user-directives-and-skill-rules-brief.md)
- **Files Studied**:
  - `skills/v9.1/v1/map-principles/SKILL.md`
  - `skills/v9.1/v1/pre-lecture/SKILL.md`
  - `skills/v9.1/v1/lecture-structure/SKILL.md` (especially Section 07 *Canonical Skeleton Order* and Section 12 *The Recall List and the Runway Before the Questions*)
  - `01-01-map-principles/archive/02-2026-10-21-0819.md` (*Component Anatomy and the Capitalization Rule*)
  - `01-01-map-principles/02.md` (*JSX Syntax and the Single-Root Rule*)
  - `01-01-map-principles/05.md` (*Splitting Components with ES Module Imports and Exports*)
  - `notes/experiment-04-river.md` (Refined River Lecture 4 on Component Anatomy)

---

## 1. Core Goal & Pedagogical Non-Negotiable

We want to simplify the authoring pipeline in `react-09` so we no longer need a separate `01-01-md-PRE-lectures` stage or four separate revision stages (`revised-1` through `revised-4`), **without sacrificing any of the comprehensiveness or structural rigor of the existing lectures**.

Specifically, studying `lecture-structure/SKILL.md` (Section 12) and `pre-lecture/SKILL.md` reveals why the existing normal lectures are comprehensive:
1. **They do not jump cold into bugs or principles.** They begin with a **clear, comprehensive Introduction to General Concepts (Theme + Options/Starting Point + Recall + The Runway)** that teaches every foundational concept and syntax form the reader needs—one idea at a time, starting from what the reader already knows in plain HTML/JavaScript, naming the exact term, showing the shortest working code example, and explaining who does what (the browser, React, or our code).
2. **They then present a clear structure of Questions and Principles**, where every principle answers a concrete question the developer faces, proves the runtime behavior, and locks the rule in a `> [!PRINCIPLE]` box.

Any replacement for `pre-lecture` **must preserve both halves**:
- **Part A**: The comprehensive **General Concepts Introduction (The Runway)** at the start of the lecture.
- **Part B**: The **Principles & Questions** in the body of the lecture (unified with the progressive practical example so the lecture never repeats the same 4 steps twice).

---

## 2. Why Single-Shot Authoring Fails vs. Why `map-principles` + `pre-lecture` Overlapped

1. **Why an AI cannot reliably write a full lecture in one single shot with no plan**:
   - When an LLM tries to simultaneously (a) check curriculum scope across 180 questions, (b) verify React 19 + Vite 8 + Chrome runtime behavior against `react.dev`, (c) plan the General Concepts Introduction (Runway), (d) choose the Principles and Root Distinctions, and (e) write 600 lines of simple, water-like CEFR B2 prose with zero parentheses and zero multi-clause tangles, its attention splits. Either conceptual comprehensiveness drops or prose clarity degrades.
2. **Why having both `01-01-map-principles` and `01-01-md-PRE-lectures` was redundant**:
   - In the legacy pipeline, `01-01-map-principles/{nn}.md` did 80% of the intellectual planning (corpus verification, runtime testing, scope routing, terms inventory, and the numbered principles), and then `01-01-md-PRE-lectures/v1/{nn}.md` repeated another 25-KB document just to plan the Runway headings and copy-paste the `[!PRINCIPLE]` boxes.
   - **Conclusion**: We do **not** need `01-01-md-PRE-lectures` if we upgrade `01-01-map-principles/{nn}.md` to carry the 20% of structural planning that previously lived only in `pre-lecture` plus our new River pedagogical laws.

---

## 3. What Is Already Excellent in `01-01-map-principles` (Keep 100%)

Comparing `01-01-map-principles/archive/02-2026-10-21-0819.md`, `02.md`, and `05.md` shows four strengths that must remain intact:

1. **Verified React 19 + Vite 8 + Chrome Runtime Truth (`Sources Read` & `Reported Conflicts`)**:
   - Every claim, console message, Vite 8 (Oxc) build error, ESLint rule (`no-unreachable`), and DOM output in the Elements panel is tested in a real browser and checked against `react.dev` (`<Recap>`, `<Pitfall>`, `<DeepDive>`, `Caveats`).
2. **Strict Curriculum Ownership & Scope Ceiling (`Candidate Ledger`)**:
   - Every candidate idea from the syllabus card, `react.dev`, and senior engineering knowledge is explicitly routed to `Principle`, `Merged`, `Supporting`, `Prerequisite`, `Preview`, or `Deferred`. This prevents premature syntax smuggling (such as using `props` or `useState` before the lessons that teach them) and ensures no official `react.dev` Pitfall is accidentally dropped.
3. **Complete Vocabulary Inventory (`Terms` Table: `Recall` vs. `New`)**:
   - The `Terms` table already identifies every general JavaScript, browser, and React term required by the chapter (`function call against function reference`, `console.log`, `camelCase and PascalCase`, `undefined`, `automatic semicolon insertion`, `nested function`, `top level of a file`) and marks whether the reader needs a refresher.
4. **The `Senior Answer` Paragraph**:
   - Provides a verified, spoken-English benchmark at the bottom of the map that synthesizes the entire lesson as a senior candidate would answer in an interview.

---

## 4. The 4 Blind Spots in the Existing `01-01-map-principles` (And How to Upgrade Them)

Comparing the archived Principle Map for Component Anatomy (`01-01-map-principles/archive/02-2026-10-21-0819.md`) against the issues we had to fix in `notes/experiment-04-river.md` exposes four exact gaps in the current Principle Map format:

### Upgrade 1: Add a **`## General Concepts Introduction (Runway Plan)`** Section
- **The Current Blind Spot**:
  - Currently, `01-01-map-principles` lists `New` terms in a table (`## Terms`), but has **no section planning the introductory Runway sections** that teach those general concepts at the beginning of the lecture. In the old pipeline, that job was delegated to `pre-lecture` (under `lecture-structure` Section 12).
  - When we wrote `experiment-04-river.md` without a `pre-lecture`, the General Concepts Introduction was compressed too much, forcing Principle 1 to teach both basic component concepts and the first bug at the same time.
- **The Upgrade to `01-01-map-principles`**:
  - Right after `## Terms` (and `## Theme and Options`), add **`## General Concepts Introduction (Runway Plan)`**.
  - This section plans:
    1. **The Opening Theme & Starting Point** (and a `> [!WAYS]` box *only* when developers genuinely choose between two valid approaches for the same job, per `lecture-structure` Section 12).
    2. **The Recall List** (the 1–3 earlier lessons this chapter stands on).
    3. **The 1 to 3 `###` Runway Sections Before Principle 1**: For each general concept that must be taught before the Principles begin, specify:
       - The declarative `###` heading,
       - The plain-JavaScript / HTML bridge (what the reader already knows),
       - The exact technical term being introduced and who acts (the browser, React, or our code),
       - The 3–4 line code snippet that demonstrates it.

### Upgrade 2: Add the **Philosophical Root Distinction** to Every Principle
- **The Current Blind Spot**:
  - Currently, each Principle in `01-01-map-principles` is titled with a noun label (`### Principle 1: Rendering: React calls the component wherever a tag names it`, `### Principle 2: PascalCase: ...`).
  - It does not crystallize the **Philosophical Root Distinction** (Rule 15 in Brief 04): **which two fundamental things blur together into one thing in a junior developer's mind, whereas a senior developer knows how they are separate**.
- **The Upgrade to `01-01-map-principles`**:
  - Add a mandatory **`Root Distinction & Opening Title`** block to each Principle in `## Principles`:
    - **`Junior Blurred View`**: What appears to be one single thing to a beginner.
    - **`Senior Root Grounding (### Title)`**: The declarative sentence stating the root separation (which becomes the opening `###` heading and opening premise of that Principle in the lecture).
  - **Concrete Example (Component Anatomy, Principle 1)**:
    - *Old Map Title*: `### Principle 1: Rendering: React calls the component wherever a tag names it`
    - *Upgraded Map Fields*:
      - **Junior Blurred View**: "I wrote `function ArticleCard()` in my file, so the card should appear on the screen." (Writing the function and showing it feel like one step.)
      - **Senior Root Grounding (`###` Title)**: `Writing the component function and using its tag are two separate steps` (Step 1 saves the function in memory; Step 2 `<ArticleCard />` hands the function reference to React so React calls it).

### Upgrade 3: Separate **`Real Beginner Mistake`** from **`Interview Depth / Follow-Up Question`**
- **The Current Blind Spot**:
  - Look at `01-01-map-principles/archive/02-2026-10-21-0819.md` line 120 under Principle 1:
    > `- Real Mistake: none; {ArticleCard()} written by hand gives the same article in this lesson, and the cost comes with Hooks in Q37`
  - Because the map wrote `Real Mistake: none` and mentioned `{ArticleCard()}`, the first draft of Lecture 4 used `{ArticleCard()}` as the primary broken code of Principle 1—even though no beginner writes `{ArticleCard()}` by accident!
- **The Upgrade to `01-01-map-principles`**:
  - Replace the single `Real Mistake` field with two distinct fields in every Principle:
    1. **`Real Beginner Mistake (Drives the Main Section)`**: The realistic bug a beginner actually hits in their editor (e.g., declaring `function ArticleCard()` in `App.jsx` and forgetting to place `<ArticleCard />` inside `App`, leaving an empty `<main>` and a silent console).
    2. **`Interview Depth / Follow-Up Question (Drives the Interview Box)`**: The deeper "what-if" question an interviewer asks once the main rule is clear (e.g., *"What happens if you call `{ArticleCard()}` directly inside JSX instead of writing `<ArticleCard />`?"*).

### Upgrade 4: Replace the Robotic `Spoken Preview` with **`River Progression`** and **`Pertinent Divisions & Visual Comparison`**
- **The Current Blind Spot**:
  - In `## Principle Thread`, the map currently writes a long `Spoken Preview` paragraph (`"First, rendering, which means... Second, PascalCase, which means..."`) and forces every principle title into an artificial anaphora formula.
  - Meanwhile, the map has **no field** specifying:
    1. how the single practical example (`App.jsx`) grows step-by-step from Principle 1 to Principle N (the River Progression), or
    2. which **Pertinent Division** and **Box-to-Boxes (`✓` vs `✗`) diagram** belongs in each Principle (which is why Principle 2 in Lecture 4 originally had a redundant 4-category table instead of the pertinent 2-category division).
- **The Upgrade to `01-01-map-principles`**:
  1. In `## Principle Thread`, replace `Spoken Preview` with **`River Progression (How the Practical Example Grows Across the Lecture)`**: a 4-line summary showing the exact state of the code at the end of the Runway and after Principle 1, Principle 2, Principle 3, and Principle 4.
  2. In each Principle under `## Principles`, add **`Pertinent Division & Visual Comparison`**:
     - States the exact 2 or 3 pertinent categories to contrast (no redundant subdivisions) and the `✗` vs. `✓` Box-to-Boxes comparison (`tree` or `ascii` + key message).
  3. Include the drafted **`> [!PRINCIPLE]` box** (in plain, spoken B2 sentences with zero inline code litter) right at the end of each Principle entry in the map, just as `pre-lecture` used to do.

---

## 5. Side-by-Side Comparison: Legacy 3-File Planning vs. Upgraded 1-File Principle Map

| Planning Job | Legacy Pipeline (`map` + `map-principles` + `pre-lecture`) | Upgraded `01-01-map-principles/{nn}.md` (No `pre-lecture` Needed) |
| :--- | :--- | :--- |
| **1. Syllabus Scope & Corpus Verification** | In `01-01-map-principles` (`Sources Read` + `Candidate Ledger`) | **Kept in `01-01-map-principles`** (`Sources Read` + `Candidate Ledger`) |
| **2. Vocabulary Inventory (`Recall` vs. `New`)** | In `01-01-map-principles` (`## Terms`) | **Kept in `01-01-map-principles`** (`## Terms`) |
| **3. Comprehensive Introduction to General Concepts (Runway Plan)** | Missing from `map-principles`; lived only in `01-01-md-PRE-lectures` | **Added to `01-01-map-principles`** as `## General Concepts Introduction (Runway Plan)` |
| **4. Philosophical Root Distinction (`###` Title & Opening Premise)** | Missing from both `map-principles` and `pre-lecture` | **Added to each Principle in `01-01-map-principles`** (`Junior Blurred View` vs. `Senior Root Grounding`) |
| **5. Real Beginner Mistake vs. Interview Nuance** | Conflated in `Real Mistake` | **Split in each Principle in `01-01-map-principles`** (`Real Beginner Mistake` vs. `Interview Depth`) |
| **6. Pertinent Divisions & `✓`/`✗` Box-to-Boxes Plan** | Missing from both `map-principles` and `pre-lecture` | **Added to each Principle in `01-01-map-principles`** (`Pertinent Division & Visual Comparison`) |
| **7. Progressive Practical Example Growth (No 2x Repetition)** | Repeated twice in `pre-lecture` (`Question Cycles` + `Stages A..E`) | **Unified in `01-01-map-principles`** via `River Progression` across Principles 1..N |

---

## 6. Recommended 2-Step Authoring Workflow Going Forward

For each chapter `{nn}`:
1. **Step 1 — Author/Upgrade `01-01-map-principles/{nn}.md` (and Consult Existing `v1/{nn}.md` Lecture)**:
   - Read `01-01-map/{nn}.md`, the `react.dev` corpus, and any existing `01-02-md-LECTURES/v1/{nn}.md` / `02-01-md-revised-1/v1/{nn}.md` so we never lose any good explanation or B2 phrasing that already works.
   - Produce the upgraded `01-01-map-principles/{nn}.md` containing:
     - `## General Concepts Introduction (Runway Plan)`
     - `## River Progression`
     - `## Principles` (each with `Root Distinction`, `Real Beginner Mistake`, `Interview Depth`, `Pertinent Division & Visual Comparison`, and the `> [!PRINCIPLE]` box).
   - **Human Gate**: Review and approve `01-01-map-principles/{nn}.md` before writing the lecture prose.
2. **Step 2 — Author the Final Lecture (`{nn}.md`) & Run Automated Build Audits**:
   - Write the full lecture following the approved Principle Map:
     1. Comprehensive General Concepts Introduction (Runway),
     2. Principles 1..N (each opening from the Root Distinction, walking chronologically through the 4-line code example with `~token~` balloons, showing the `✓`/`✗` visual division, answering the Question, and closing with the `> [!PRINCIPLE]` box and optional Interview Depth box),
     3. Complete Final Code + Closing Reference (`Glossary`, `Beyond the basics`, `Summary`, and Closing Comparison Table).
   - Run the build script (`build-river.mjs`) to enforce zero parentheses in prose, short single-idea B2 sentences, and proper `DO` vs. `DO NOT` visual themes.
