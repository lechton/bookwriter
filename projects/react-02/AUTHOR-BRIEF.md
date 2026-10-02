# AUTHOR BRIEF — Writing One Lecture for react-lecture-02

Paste this brief plus the target question row into the writing model. The supreme pedagogical standard is defined by the **4 Unified Invariants** in [`instructions/lecture-creation/`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/) and the operational rules in [`instructions/lecture-creation/00-project-governance.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/00-project-governance.md).

## Input You Receive
- One row from `../../questions-react/questions.md`: number, tier (`❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED`, possibly suffixed ` (Server)`), topic tag, interview question text, and hook. The hook is the seed of your Opening Ladder; grow it, never replace it.

---

## The 4 Invariants Checklist (Verify Before Submitting)
1. **Invariant 1 (Cognitive Contract — [`instructions/lecture-creation/01-cognitive-contract.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/01-cognitive-contract.md)):** B2 English, 12–18 word sentences, 2–4 sentence paragraphs. Zero robotic eyeball commands ("Look at", "Notice"). All poisonous documentation jargon preceded by physical behavior with term in parentheses. Bold key terms on first debut.
2. **Invariant 2 (Concept Lifecycle — [`instructions/lecture-creation/02-concept-lifecycle.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/02-concept-lifecycle.md)):** Open conceptual lead-ins using the **Theory of Mind Triad** (Known Anchor → Uncertain Bridge → New Core Argument; see canonical transformations in [`instructions/lecture-creation/06-pedagogical-presentation-examples.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/06-pedagogical-presentation-examples.md)). Physical symptom on screen first → syntax baptism and prefix decoding second → engine mechanics third. Four-pillar breakdown for load-bearing primitives (`useState`, `useEffect`, Fiber, RSC). Zero leaked scaffolding labels.
3. **Invariant 3 (Harmonious Step Rhythm & Proximity — [`instructions/lecture-creation/03-harmonious-step-rhythm.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/03-harmonious-step-rhythm.md)):** Unbroken 4-beat cadence: `[Framing (2–3 sentences)] -> [Snippet (8–12 lines in macOS window)] -> [RCE Figure] -> [Analytical Derivation]`. Zero orphan syntax. Strict 1:1 code-to-figure token synchronization.
4. **Invariant 4 (Comparative Proof & Visual Substrate — [`instructions/lecture-creation/04-comparative-proof.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/04-comparative-proof.md)):** Feature grounded in a high-stakes failure wall. Symmetrical `wrong` vs `right` duels without inline code comments. Compound idioms taught upfront (no delayed truth-bombs). Figures use authentic graphical substrates (never text-only cards). Visual specification lives in [`instructions/lecture-creation/05-figure-design-system.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/05-figure-design-system.md).

---

## Write `md-lectures/{n}.md` with This Exact Skeleton

1. **Line 1, exactly:** `# Lecture {n}: {Catchy Title}` (visceral, B2 English title).
2. **Line 2, exactly:** `> INTERVIEW QUESTION | {tier} | {question text copied verbatim from bank row}`.
3. **Blank line, then the Opening Ladder (5–7 numbered beats):**
   - Beats 1–2: The scene (one human actor with an unambiguous role, e.g. "a frontend engineer", "a subscriber").
   - Beats 3–4: The failure moment (tangible screen contradiction between expectation and reality).
   - Beat 5: The question (direct, natural sentence stating the visible conflict).
   - Beat 6: The danger (runtime or business consequence of leaving the failure unaddressed).
   - Beat 7: The promise (promises what today's lesson permanently resolves; never prematurely names the engine mechanism).
   - *Rules:* Strict $\le 20$ words per sentence; no em-dashes; every noun exactly one tangible thing.
4. **Body Sections (`### ` headings only; never use `## ` as it forces PDF page breaks):**
   - Every technical section follows the 4-Beat Measure: `[Framing -> Snippet -> Figure -> Derivation]`.
   - Code fences: ` ```jsx title="Component.jsx" `, ` ```tsx `, ` ```javascript `, ` ```html `, ` ```css `.
   - Comments live at the END of code lines (`// annotation`), never on their own line. Verdicts lead with `**RIGHT:**` and `**WRONG:**`.
5. **Callouts & Diagrams:**
   - At least one `> [!TIP]` with a `**To impress the interviewer:**` lead (high-level architectural synthesis only; never introduce new mechanics or gotchas here).
   - Use `> [!KEY]` for core takeaways and `> [!WISDOM]` to demystify counter-intuitive conventions before code.
   - **Diagram Callout Placement:** Place raster diagram images first (`![Caption](images/...)`), followed immediately by their numbered callout (`> [svg image] ...`), which automatically renders as `Diagram {lecture}.{n}` with an architecture node-tree icon.
6. **Authoritative Quoting Law:**
   - At least one verbatim quote from official React documentation (`documentation official/React 19 Sept 2026/react.dev/src/content/...`) as a markdown blockquote with full file citation. Never quote books directly.
7. **`### Where you will meet this`:** 3 to 5 one-line uses in real applications.
8. **`### Glossary`:** 4 to 6 core terms formatted as `- **Term**: Plain-English definition and engineering role.`
9. **`### Summary`:** Streetwise Review with bold `**Technical Title**`, `❒ Subtitles`, numbered points with `<br>&nbsp;&nbsp;&nbsp;&nbsp;`, right/wrong mini-fences with verdict in tag (` ```jsx right `) under `**DO THIS:**` / `**DO NOT DO THIS:**` headers.
10. **Closing Comparison Table (LAST block in file):**
    - Strictly 3 columns (`| | **COL B**<br>(subtitle) | **COL C**<br>(subtitle) |`).
    - Divider row is exactly `| ---: | :--- | :--- |`.
    - Column 1 starts with a bold dimension.
    - Transpose multi-entity comparisons so entities are rows.

---

## Hard Format Rules
- One continuous line per paragraph, bullet, and table row. Never hard-wrap.
- Zero em-dashes anywhere in the lecture.
- Zero horizontal rules: never use '---' dividers between sections; demarcate sections purely with '### ' headings.
- Section length is never a constraint; clarity over brevity.
- Comprehensive Lecture Depth: **3,000 to 4,500+ words**, spanning **16 to 32+ PDF pages**.
- Compile with `node src/build-lectures.mjs`. The lecture is complete when the build log yields **ZERO warnings**.
