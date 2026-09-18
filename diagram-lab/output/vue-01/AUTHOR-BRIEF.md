# AUTHOR BRIEF — writing one lecture for vue-01

Paste this brief plus the question row into the writing model. The full rules live in `instructions.md`; this page is the working subset that fits a small context. When the build log is clean, the lecture is mechanically done.

## Input you receive

- One row from `../../questions-vue/questions.md`: number, tier (`❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED`), topic tag, question text, hook. The hook is the seed of your opening scenario; grow it, do not replace it.

## Write `md-lectures/{n}.md` with this skeleton, in this order

1. Line 1, exactly: `# Lecture {n}: {Short Title}`
2. Line 2, exactly: `> INTERVIEW QUESTION | {tier} | {question text copied verbatim}`
3. Blank line, then the Opening Ladder: 5 to 7 numbered beats in this order: the scene, the failure moment, the question (direct sentence stating the visible conflict), the danger, the mystery, the promise. No sentence over 20 words, no em-dashes, and never name the lecture's mechanism term in the ladder. One actor throughout, every noun exactly one tangible thing.
4. Right after the ladder, the first `### ` section: catchy title, then prose opening the teaching.
5. Body sections with `### ` headings only (`## ` forces a PDF page break). Every technical section strictly follows the **Harmonious Code + UI Step Rhythm**:
   - **Text Lead-in:** Every `### ` heading MUST open with 2–3 sentences of conceptual framing before any code or figure appears.
   - **Snippet Precedes Figure:** Under the section, a minimal code snippet directly precedes the figure every single time, presenting the minimal code contrast with end-of-line comments (e.g. `// **WRONG:** ...` vs `// **RIGHT:** ...`).
   - **Vue Figure Visualizations:** Standalone HTML/CSS components authored in `md-lectures/figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html` embedded via ````markdown ```html-figure src="..." caption="..."``` ````. Choose between Comparative Mode (symmetrical side-by-side cards, matching header pills, identical 2-line footers) and Illustrative Mode (clean structural flow, state transitions, proxy pipelines, or component trees).
   - **Analytical Derivation:** Directly follows the figure, explaining the technical mechanism and citing authoritative sources. Repeat this loop for sequential steps: `[Text -> Code -> Figure -> Derivation]`.
6. Code fences: ` ```vue title="Counter.vue" `, ` ```javascript title="store.js" `, ` ```typescript `, ` ```html `, ` ```css `. Runnable examples in the National Times world, lines under 80 characters. Comments at the END of code lines, never on their own line. Verdicts lead with `**RIGHT:**` / `**WRONG:**`.
7. The quoting law: at least one verbatim quote from primary authoritative sources (Vue Core code/RFCs, official Vue documentation) as a blockquote, followed by the attribution line with the citation path, for example:
   `*Vue 3 Documentation, `resources/docs/vue-docs/src/guide/extras/reactivity-in-depth.md`*`.
8. At least one `> [!TIP]` callout with a `**To impress the interviewer:**` lead, `> [!KEY]` for one-line takeaways, and `> [!WISDOM]` to preemptively clarify industry conventions and mental models before practical code examples.
9. Right before the Summary, `### Where you will meet this`: 3 to 5 one-line uses in real applications.
10. `### Glossary` directly before the Summary: 4 to 6 core terms introduced or reinforced, each formatted on a single continuous line as `- **Term**: Plain-English definition and practical role without em-dashes.`
11. Close with `### Summary` as a Streetwise Review: bold `**Technical Title**` on its own line, practical context, `❒ {Subtitle}` headers, numbered points with `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` sub-lines, `➔ NEVER / ALWAYS / IF ... THEN` principles, right/wrong mini-fences with verdict in fence tag (` ```vue right `) under `**DO THIS:**` / `**DO NOT DO THIS:**` headers, and ending with the closing table as the LAST block: strictly 3 columns (`| | **COL B**<br>(subtitle) | **COL C**<br>(subtitle) |`), divider `| ---: | :--- | :--- |`, bold dimensions first in every row. Transposition Law: transpose multi-entity comparisons so concepts are rows.

## Hard format rules

- One continuous line per paragraph, bullet, and table row. Never hard-wrap. No em-dashes anywhere.
- Section Rhythm & Page Fit: Sections always start with 2–3 sentences of text before code/figure.
- Strict Synchronization Rule: Every element, state property, or method rendered in a figure MUST appear in the code snippet directly above it.
- Table Transposition Law: strictly 3 columns in the closing table. Transpose multi-entity comparisons so concepts are rows.
- Define every technical term in plain English in the same sentence; define through experience.
- Comprehensive Lecture Depth: **3,000 to 4,500+ words**, spanning **16 to 32+ PDF pages**.
- **Pedagogical Clarity Standard (`PEDAGOGICAL-CLARITY.md`)**:
  1. *Insightful Guide Principle*: Never narrate visual props or repeat robotic eyeball commands ("Look at... Notice the arrow..."). Explain cause, effect, and engine mechanism in natural prose.
  2. *Architectural Philosophy & Trade-off Law*: Never teach a mechanism in a vacuum. Always explain *why* the Vue team designed it this way (the historical struggle, the paradigm contrast vs React/Angular, and the engineering trade-offs).
  3. *Inverted Pyramid of Truth (Banning Delayed Truth-Bombs)*: Never build a naive mental model only to drop a fatal caveat in Section 4 or in the interview tip. Teach operational constraints and compound idioms (e.g. `reactive` + `toRefs`, `onMounted` + `onScopeDispose`, `v-for` + `:key`) in Section 1. The interview tip is for architectural synthesis, never an omission dump.
  4. *Lexical Baptism*: No term may debut in a diagram badge or label without intuitive definition in preceding text.
  5. *Symptom First*: Show the physical on-screen catastrophe before explaining internal engine algorithms.
  6. *Two-Tier Clarity*: Upfront baptism in Section 1 for the primary mechanism; 4-pillar architectural breakdown in Section 2 for load-bearing primitives (`ref`, `reactive`, `watchEffect`, `provide`/`inject`, `nextTick`, etc.).
  7. *Concrete Physical Anchor*: Anchor abstract concepts to real DOM nodes, component instances, and DevTools inspection.
  8. *Invisible Scaffolding*: Internal authoring rules ("Floor 1/2/3", "Four Pillars") are STRICTLY INTERNAL. Never leak them to the student.
  9. *10/10 Perfection Self-Audit Gate*: Quality must be strictly 10/10 with zero compromises.
  10. *Cognitive Accessibility & B2 Language Standard*: Write for a tired developer with a splitting headache using CEFR B2 vocabulary, short active sentences (12–18 words), and short paragraphs (2–4 sentences). Zero dumbing down.
  11. *Zero-Orphan-Syntax (Law 18)*: 8–12 lines per snippet budget; every declared property, method, or template binding must be mechanically justified in the surrounding prose. Ban back-to-back code blocks.
  12. *Clarity Over Brevity Law*: Section length is never a constraint. Exceeding standard length is explicitly permitted and encouraged as long as it secures greater clarity. Between "proper length" and more clarity, we ALWAYS prefer more length if it adds more clarity.
  13. *Poisonous Jargon Surveillance (Function First, Jargon in Parentheses)*: Official documentation contains poisonous jargon (*singleton*, *factory*, *memoization*, *idempotency*). Never use doc jargon as a standalone explanation or bare predicate. Always write the concrete physical runtime function or behavior first, then the term in parentheses (e.g. "keeps a single shared copy of that object in server memory for all visitors (a pattern known as a **singleton**)").

## When you are done


Run through every item in [`AUDIT-CHECKLIST.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/vue-01/AUDIT-CHECKLIST.md). Run `node src/build-lectures.mjs` from the project folder (`diagram-lab/output/vue-01/`). Zero warnings means the lecture passes the mechanical gate.
