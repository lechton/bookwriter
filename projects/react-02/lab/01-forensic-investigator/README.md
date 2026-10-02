# Lab Track 01: The Forensic Investigator (React 19 Lecture Track)

This directory is an active pedagogical track of the `react-lecture-02` series. It tests and authors publication-grade, long-form React 19 lectures framed through the **Forensic Investigator (Crime Scene & Iceberg Method)**.

---

## 1. Quickstart: How to Author the Next Lecture

When tasked with "create the next lecture" in this path, follow this exact discovery procedure:

1. **Find the Next Number:** Check the highest numbered markdown file in this folder (e.g. `01.md` -> next is `02.md`).
2. **Find the Title & Curriculum Slot:** Open the Table of Contents at [`../../00_TOC.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/00_TOC.md) to locate the title and topic tag for that lecture number.
3. **Find the Interview Question & Hook:** Open the Question Bank at [`../../../questions-react/questions.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/questions-react/questions.md) and locate the row matching that question number. Extract:
   - Stable ID (`#`)
   - Tier (`❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`)
   - Topic tag (e.g. `#project_setup`)
   - Interview Question (verbatim text for Line 2)
   - Hook (the scenario seed for the Opening Ladder)
4. **Author the Lecture File:** Write `{nn}.md` in this directory following the Forensic Method and master pedagogical invariants.
5. **Compile & Audit:** Run the build runner to verify compilation with zero warnings:
   ```bash
   node lab/build-lab.mjs 01
   ```

---

## 2. The 5-Stage Forensic Pedagogical Arc

Every lecture in this path must weave its narrative through the 5 Forensic Invariants defined in [`PATH-PHILOSOPHY.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/lab/01-forensic-investigator/PATH-PHILOSOPHY.md):
1. **The Production Crime Scene (The Hook):** Open with an authentic post-mortem from the newsroom of *The National Times*. A visible, high-stakes failure on screen under real editorial stress that lost user trust or revenue.
2. **The Deceptive Surface:** Present the innocent, naive code that caused it. Every junior engineer understands it; every senior engineer recognizes having written it.
3. **The Hidden Crack in the Iceberg:** Show why the intuitive, naive patch (patching symptoms rather than addressing the architectural root cause) creates cascading edge-case bugs, synchronization failure, or state corruption.
4. **The Architectural Invariant:** Introduce the fundamental React principle, mathematical contract (e.g. $UI = f(State)$, pure render idempotency, or unidirectional flow), or architectural boundary that eliminates the failure mode permanently.
5. **The Engine Dissection:** Walk through React's internal mechanics (Fiber reconciliation diffing, work loop scheduling, compiler transforms, commit phase mutations, or DOM synchronization) that guarantee the invariant.

---

## 3. Master Architectural Laws & Pedagogical Specifications

Authoring must strictly adhere to the master specifications in [`../../instructions/lecture-creation/`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/):
- [`00-project-governance.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/00-project-governance.md): Holistic Instruction Integration Law, lecture anatomy, TOC mapping, and user control directives (`nnn` for chat-only, `ppp` for immediate execution).
- [`01-cognitive-contract.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/01-cognitive-contract.md): CEFR B2 English, short active sentences (12–18 words), short paragraphs (2–4 sentences), senior developer register, demystification of poisonous jargon with physical behavior first, and Embedded Gate 1.
- [`02-concept-lifecycle.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/02-concept-lifecycle.md): Theory of Mind Triad (Known Anchor → Uncertain Bridge → New Core Argument), physical symptom first, notation decoding, 4 pillars for load-bearing primitives, and Embedded Gate 2.
- [`03-harmonious-step-rhythm.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/03-harmonious-step-rhythm.md): The 4-Beat Measure `[Framing -> Snippet -> Figure -> Derivation]`, macOS editor window fidelity, zero orphan syntax, 1:1 token synchronization, and Embedded Gate 3.
- [`04-comparative-proof.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/04-comparative-proof.md): Symmetrical duels (`wrong` vs `right`), high-stakes failure walls, visual substrate (never text-only cards), and Embedded Gate 4.
- [`05-figure-design-system.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/05-figure-design-system.md): Visual-first philosophy (Section 1 code never sits naked), React Component Explorer (RCE), Symmetrical State Audit, palette tokens (`#087ea4`, `#149eca`, `#23272f`), and vector chrome rules.
- [`06-pedagogical-presentation-examples.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/06-pedagogical-presentation-examples.md): Canonical transformation library across core React topics.

For the downstream conceptual image creation AI iteration, follow the prompt engineering specification in [`../../instructions/image-creation/01-uncertainty-audit-and-prompt-engineering.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/image-creation/01-uncertainty-audit-and-prompt-engineering.md). Images follow the strict 4-stage lifecycle: (a) author spatial descriptions in `images-md/{lecture_num}_{seq}_{slug}.md`, (b) perform Official Lexical Verification & Markdown Baptism ensuring ONLY canonical documentation jargon survives (invented pseudo-terms like "Automated Delta Auditor" are banned) using `> [svg image] ...` notes BEFORE rendering so EVERY term in the diagram exists explicitly in the text preceding it, (c) generate raster assets in `images/{lecture_num}_{seq}_{slug}.jpg` with centered internal titles, single container, and pure white paper bleed, and (d) compile and visually verify the PDF via `node lab/build-lab.mjs {path_num}`.

---

## 4. Official Documentation Corpus & Authoritative Quoting Law

- **Corpus Location:** `documentation official/React 19 Sept 2026/react.dev/src/content/` (covering `learn/` and `reference/`).
- **The Quoting Law:** Every lecture must contain at least one verbatim quote from the official documentation cited with its exact markdown file path in the corpus. Never quote books directly in lecture text.

---

## 5. Figures and Visual Substrates

- Figures sit as standalone HTML/CSS components in `figures/` (e.g. `figures/01.1-masthead-synchronization.html`) or embedded in the lecture via ````html-figure src="figures/{name}.html" caption="..."````.
- Proven reference implementations:
  - Symmetrical State Audit benchmark: [`../../various/html/manual_vs_declarative_react.tsx`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/various/html/manual_vs_declarative_react.tsx)
  - Figure template directory: [`../../md-lectures/figures/templates/`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/md-lectures/figures/templates/)
- Visual rules: The opening code snippet of Section 1 must never sit naked; always pair with a visual panel. Never wrap text-only bullets in boxes; every figure must have an authentic graphical substrate.

---

## 6. Lecture Skeleton Format

Every lecture file `{nn}.md` strictly follows this structure:
1. **Line 1:** `# Lecture {n}: {Catchy Title}` (visceral, B2 English title).
2. **Line 2:** `> INTERVIEW QUESTION | {tier} | {question text copied verbatim from bank row}`.
3. **Blank line, then Opening Ladder:** 5 to 7 numbered beats establishing the actor, failure, conflict, danger, and promise ($\le 20$ words per sentence, no em-dashes).
4. **Body Sections (`### ` only; never use `## `):** Follows the 4-Beat Measure `[Framing -> Snippet -> Figure -> Derivation]`.
5. **Callout Alerts:** At least one `> [!TIP]` with `**To impress the interviewer:**` lead, plus `> [!KEY]` and `> [!WISDOM]` where needed.
6. **Authoritative Quote:** Official doc quote block with citation.
7. **`### Where you will meet this`:** 3 to 5 real application bullet points.
8. **`### Glossary`:** 4 to 6 core terms defined in plain English.
9. **`### Summary`:** Streetwise Review with bold `**Technical Title**`, `❒ Subtitles`, numbered points with `<br>&nbsp;&nbsp;&nbsp;&nbsp;`, and right/wrong mini-code fences (` ```jsx right `) under `**DO THIS:**` / `**DO NOT DO THIS:**` headers.
10. **Closing Comparison Table (LAST block in file):** Strictly 3 columns (`| | **COL B**<br>(subtitle) | **COL C**<br>(subtitle) |`), divider `| ---: | :--- | :--- |`.

---

## 7. Build Pipeline & Quality Gates

From the root directory `/Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/`:
```bash
node lab/build-lab.mjs 01            # compile path 01 into HTML + Prince PDF
node lab/build-lab.mjs 01 --no-pdf   # compile HTML only (fast dev check)
```
- **The Zero-Warning Gate:** Any `warn` in the Prince or markup validation log is a defect. Zero warnings is the required completion condition.
- **Word Count Budget:** Comprehensive lecture depth of **3,000 to 4,500+ words** across **16 to 32+ PDF pages**.
- **No Hard-Wrap Law:** Exactly one continuous line per paragraph, bullet, table row, or prompt. Never hard-wrap text.
