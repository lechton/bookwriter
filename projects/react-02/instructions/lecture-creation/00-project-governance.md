# 00: Project Governance & Operational Specification (react-lecture-02)

This document is the operational specification, architectural charter, and governance protocol for the `react-lecture-02` series inside `diagram-lab/output/`. Every question in the curriculum is taught as one long-form, publication-grade lecture. The lecture is the source of truth for depth, written first, and compiled into print-ready HTML and PDF via PrinceXML.

The topic is interview readiness for **Modern React 19 and React Server** across two tracks:
1. **Part One: React 19 Client Architecture (Q01–Q100)**: Components, JSX compilation, pure rendering, immutable state contracts, hooks lifecycle, render/commit phases, Fiber reconciliation, Concurrency, and the React 19 Compiler.
2. **Part Two: React Server & Full-Stack Systems (Q101–Q180)**: Server-Side Rendering (SSR), streaming via `renderToPipeableStream`, client hydration (`hydrateRoot`), React Server Components (RSC), the `'use client'`/`'use server'` boundary, Flight protocol serialization, Suspense streaming, and React 19 Actions (`useActionState`).

---

## 1. Project Governance: The Holistic Instruction Integration Law

> **MANDATORY LAW: STRICT BAN ON ISOLATED LOCAL PATCHING**  
> An agent or author is strictly forbidden from adding, modifying, or appending a rule to a single file in isolation. Every new instruction, constraint, or refinement must undergo a **Holistic Ecosystem Audit** and be integrated across all affected planes simultaneously.

### The 4-Phase Holistic Integration Protocol
Whenever a new requirement, constraint, or user correction is introduced:
1. **Phase 1 (Ecosystem Impact Audit):** Determine the architectural plane of the instruction:
   - *Pedagogical Plane (`instructions/01-` through `04-`):* Which of the 4 Invariants owns the concept?
   - *Verification Plane:* Which embedded self-audit gate must add or update an assertion?
   - *System Specification Plane (`instructions/00-` or `05-`):* Does it alter layout, markdown format, figure CSS, or build scripts?
   - *Global Workspace Plane (`AGENTS.md`):* Must it be registered as an always-on workspace invariant?
2. **Phase 2 (Semantic Harmonization):**
   - Never append a loose bullet point or create an ad-hoc "Law N".
   - Absorb the rule directly into the canonical Invariant file.
   - Eliminate redundant wording across files; ensure unified terminology.
3. **Phase 3 (Atomic Multi-File Synchronization):**
   - Update ALL affected files (`instructions/`, `AUTHOR-BRIEF.md`, `README.md`, `AGENTS.md`) in a single coherent operation.
   - Leaving one file updated while another contains stale or contradictory rules is treated as a defect.
4. **Phase 4 (Cross-File Integrity Check):**
   - Verify that all files align 100% in terminology, gate assertions, and formatting constraints.

---

## 2. The 4 Unified Invariants of Technical Pedagogy

All teaching methodology is governed by the 4 Invariants located in this directory:
- [`01-cognitive-contract.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/01-cognitive-contract.md): Reader profile, B2 English, senior voice, poisonous jargon demystification, and Embedded Gate 1.
- [`02-concept-lifecycle.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/02-concept-lifecycle.md): Theory of Mind Triad (Known → Bridge → New), physical symptom first, notation decoding, 4 pillars for primitives, invisible scaffolding, and Embedded Gate 2.
- [`03-harmonious-step-rhythm.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/03-harmonious-step-rhythm.md): 4-Beat measure, macOS editor fidelity, zero orphan syntax, 1:1 synchronization, and Embedded Gate 3.
- [`04-comparative-proof.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/04-comparative-proof.md): High-stakes failure walls, symmetrical duels, visual substrate, Embedded Gate 4, and the Production Pipeline Gate.
- [`05-figure-design-system.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/05-figure-design-system.md): Visual aesthetics constitution, visual-first philosophy, color palettes, and template standards for the React Component Explorer (RCE) and Symmetrical State Audit.
- [`06-pedagogical-presentation-examples.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/06-pedagogical-presentation-examples.md): Canonical reference library of side-by-side Bad vs. Good transformations applying the Theory of Mind Triad across core React topics.

---

## 3. Lecture Anatomy and Writing Skeleton

Every lecture file `md-lectures/{n}.md` must strictly follow this sequential skeleton:

1. **Line 1, exactly:** `# Lecture {n}: {Catchy Title}` (visceral, B2 English title; e.g. "Declarative Components versus Manual DOM", "The Stale Closure Trap", "Hydration Mismatch and the Dual Clock").
2. **Line 2, exactly:** `> INTERVIEW QUESTION | {tier} | {question text copied verbatim from bank row}` (Tier: `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`, with ` (Server)` suffix for server course questions).
3. **Blank line, then the Opening Ladder:** Exactly 5 to 7 numbered beats setting up the drama:
   - Beat 1–2: The scene (single human actor with an unambiguous role, e.g. "a frontend engineer", "a subscriber").
   - Beat 3–4: The failure moment (tangible screen contradiction between expectation and reality).
   - Beat 5: The question (direct, natural sentence stating the visible conflict).
   - Beat 6: The danger (consequence of leaving the bug unaddressed).
   - Beat 7: The promise (promises what today's lesson unlocks; never prematurely names the engine mechanism).
   - *Constraints:* No sentence over 20 words; no em-dashes; every noun exactly one tangible thing.
4. **Body Sections (`### ` headings only; never use `## ` as it forces PDF page breaks):**
   - Every technical section follows the 4-Beat Measure: `[Framing -> Snippet -> Figure -> Derivation]`.
   - Conceptual framing prose must open using the **Theory of Mind Triad** (Known Anchor → Uncertain Bridge → New Core Argument). Section 1 must immediately deliver the **Upfront Breakthrough**: state the core architectural solutions and baptize their official industry terms/acronyms in plain B2 English before deep analysis or comparative figures begin.
   - **Figure Token Audit Protocol:** Every HTML figure must be audited against preceding prose; zero unbaptized acronyms or future-section concepts may appear inside any figure card or badge.
   - Code fences: ` ```jsx title="Component.jsx" `, ` ```tsx `, ` ```javascript `, ` ```html `, ` ```css `.
   - Comments live at the END of code lines (`// annotation`), never on their own line. Verdicts lead with `**RIGHT:**` and `**WRONG:**`.
5. **Callout Alerts:**
   - At least one `> [!TIP]` with a `**To impress the interviewer:**` lead (architectural synthesis only; never introduce new mechanics or gotchas here).
   - Use `> [!KEY]` for concise takeaways.
   - Use `> [!WISDOM]` to demystify counter-intuitive conventions before code examples.
6. **`### Where you will meet this`:** 3 to 5 one-line uses in real applications.
7. **`### Glossary`:** 4 to 6 core terms formatted as `- **Term**: Plain-English definition and engineering role.`
8. **`### Summary`:** Streetwise Review from a senior developer's daily perspective:
   - Bold `**Technical Title**` on its own line.
   - Practical context opening paragraph (no conversational filler like "Look,").
   - `❒ {Subtitle}` section headers.
   - Numbered points with indented sub-lines formatted with `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...`.
   - Principles highlighted with `➔ NEVER`, `➔ ALWAYS`, and `➔ IF ... THEN ...`.
   - Right/wrong mini-code fences with tag in fence (` ```jsx right `) under `**DO THIS:**` / `**DO NOT DO THIS:**` headers.
9. **Closing Comparison Table (LAST block in file):**
   - Strictly 3 columns (`| | **COL B**<br>(subtitle) | **COL C**<br>(subtitle) |`).
   - Divider row is exactly `| ---: | :--- | :--- |`.
   - Column 1 starts with a bold dimension.
   - **The Transposition Law:** When comparing 3 or more items, transpose the table so comparison entities are the rows, and the two columns represent analytical dimensions.
   - **Track Separation for Visuals:** Track 1 authors embedded HTML/CSS figures in `figures/`. Conceptual raster diagrams belong strictly to Track 2 (Image Creation), which compiles prompts in `images-md-prompt/` for Google Flow generation and intake into `images/{lecture_num:02d}/{seq:02d}.jpeg`. When embedding, always place the diagram image first (`![...](images/...)`), immediately followed by the numbered diagram callout (`> [svg image] ...`), which renders dynamically as `Diagram {lecture}.{n}` with the monochrome architecture node-tree icon. Diagram guide notes must be written in plain B2 English with zero LaTeX math formulas (`$...$`), strictly illustrating what the text already taught (never dumping unbaptized acronyms).

---

## 4. Sources of Truth & Authoritative Quoting Law

- **Corpus Location:** `documentation official/React 19 Sept 2026/react.dev/` (and official React RFCs).
- **The Quoting Law:** Every lecture must contain at least one verbatim quote from an authoritative source, cited by its path in `documentation official/React 19 Sept 2026/react.dev/src/content/...` (or `resources/...`).
- **Quote Format:** A markdown blockquote with exact words, followed by an italicized attribution line:
```markdown
> Rendering is React calling your component, which is a function. The JSX elements returned from the function are like a snapshot of the UI in time.
*React Official Documentation (Render and Commit), `documentation official/React 19 Sept 2026/react.dev/src/content/learn/render-and-commit.md`*
```
- **Authoritative Sources Only:** Quote official documentation, source code, and RFCs. **Never quote or cite books directly in the text**; books exist solely for author research.

---

## 5. Build Pipeline & Mechanical Gates

From the project root `/Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/`:
```bash
node src/build-lectures.mjs            # compile HTML + Prince PDFs (generates React 2026 Q{first}-Q{last}.pdf)
node src/build-lectures.mjs --no-pdf   # compile HTML only
node src/build-deck.mjs <folder>       # assemble/unite lecture PDFs into React 2026 Q{first}-Q{last}.pdf
node src/clean-inspection-images.mjs   # purge temporary inspection PNGs
```

### The Zero-Warning Gate
The build script enforces automated format validation. Any `warn` in the build log represents a defect that must be repaired in the source markdown before the lecture is complete. Zero warnings is the mandatory mechanical gate.

---

## 6. User Control Directives ("nnn" and "ppp")

To ensure predictable pairing with the user, all agents and tools must adhere to the standardized control directives:
- **Chat-Only Directive (`"nnn"`):** When the user prompt contains `"nnn"`, do NOT edit, create, or touch any files, and do not run modifying commands. Strictly discuss, analyze, and plan in the chat until explicitly ordered to edit files.
- **Execution Trigger Directive (`"ppp"`):** When the user prompt contains `"ppp"` (meaning "proceed"), execute immediately without asking for further confirmation, permission, or additional planning cycles. Implement the changes, author files, and run builds directly.
