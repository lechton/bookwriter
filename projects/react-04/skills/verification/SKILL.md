---
name: verification
description: Governs the quality gates and visual verification protocol applied to a finished lecture or pre-lecture; use when a lecture is claimed complete or an audit is requested.
---

# Verification

This skill governs the quality gates, verification checks, and visual verification protocol applied to lectures and blueprints: what each gate inspects, the pass condition, and the on-demand audit workflow. The deep pedagogical and structural rules live in `pre-lecture`, `lecture-voice`, `lecture-structure`, `code-blocks`, `ui-panels`, and `figures`; this file serves as the definitive checking protocol.

Digests: `skills/old-instructions/AUDIT-CHECKLIST.md` and `skills/old-instructions/instructions.md` (audit phase, comprehensive final checklist).

## Audit Protocol | 01 | On-Demand Execution and Mindset

[ ] Run the deep audit pass only when the user explicitly requests it (for example, "audit Lecture 40").
[ ] Target a finished lecture that has compiled to HTML and PDF at least once so the reviewer audits a stable artifact.
[ ] Audit the single lecture specified by the user; expand to multiple lectures only upon explicit user command.
[ ] Adopt a fresh critical reader's mindset whose sole objective is identifying what the original lecture missed or left ungrounded.

## Audit Protocol | 02 | Cross-Check Against Authoritative Local Documentation

[ ] Read the lecture end-to-end in `01-02-md-LECTURES/{n}.md`, cataloging every concept, API method, and example.
[ ] Cross-check all covered topics against authoritative local documentation under `documentation official/React 19 Sept 2026/react.dev/src/content/`.
[ ] Identify candidate gaps: related API surfaces not mentioned (such as `useEffectEvent`), alternative patterns for the same problem (such as `useReducer`), unflagged runtime traps, or natural next steps.
[ ] Exclude material the lecture already covers: every recorded gap must deliver net-new, actionable information.

## Audit Protocol | 03 | Inspect and Deepen "Beyond the Basics" #2026_09_21_32_group_1

[ ] Ensure every production lecture includes the mandatory `## Beyond the basics` section placed immediately between `### Glossary` and `### Summary`. #2026_09_21_32_group_1
[ ] Audit findings and candidate gaps are integrated into this section; when an audit pass is executed, existing bullets are refined or missing authoritative points are appended.
[ ] Format findings as a scannable bulleted list: `- **Bold lead phrase**: explanation ...`.
[ ] Ensure each bullet is completely self-contained: define all technical terms inline so a student reading only the bullets gains immediate comprehension.
[ ] Cross-reference official documentation using live, clickable website links formatted as `(see [react.dev/...](https://react.dev/...))` and adjacent lectures (for example, `see Lecture 50`). Never cite local repository file paths (e.g. `documentation official/...`) or GitHub repository URLs. #2026_09_21_33_group_1
[ ] Order bullets by practical relevance: the most common engineering need comes first, niche edge cases come last (typically 4 to 8 bullets total).
[ ] Keep `## Beyond the basics` free of code blocks; if a missing topic requires full code deconstruction, recommend it in chat for inclusion in the lecture body.

[ ] PROPER EXAMPLE: make sure you follow this example, a self-contained audit bullet:

> - **The useEffectEvent escape hatch**: when an effect reads a value that changes often but the effect itself should not re-run on every change, `useEffectEvent` wraps that read in a stable function (see Lecture 50, [react.dev/reference/react/useEffectEvent](https://react.dev/reference/react/useEffectEvent)).

Notes: Leads with a bold title, defines the mechanism in plain English, and provides an active clickable hyperlink to the official website. #2026_09_21_33_group_1

## Audit Protocol | 04 | Fact-Check Tool and Runtime Claims

[ ] Verify every claim regarding external tools (npm, Vite, bundlers, shell syntax) against official documentation before approval.
[ ] Cut unverified or inaccurate claims: never allow invented tool mechanics (such as claiming packages run "in memory" during scaffolding) to reach the student.

## Pedagogy & Voice Gates | 05 | The Developer-at-the-Keyboard Gate

[ ] Verify that the lecture is written from the perspective of the developer sitting at the keyboard, guiding them through concrete files and screen behaviors.
[ ] Check that every runtime concept satisfies the three-part explanation: (1) what you write, (2) what manual boilerplate is removed, and (3) what the browser physically does.
[ ] Ensure the prose avoids the disembodied internal engine voice: the author must not speak from inside the React fiber reconciler or recite abstract compiler specifications.

## Pedagogy & Voice Gates | 06 | Typology Tagging and Seven Opening Beats

[ ] Check line 2 for the mandatory interview question callout: `> INTERVIEW QUESTION | {tier} | {question text}`.
[ ] Verify that the body opens immediately with exactly 7 numbered beats progressing from Scene to Promise:
    1. Scene (The National Times newsroom)
    2. Setup (concrete user/journalist action)
    3. Surprising Action (what code attempts)
    4. Question (central doubt or failure)
    5. Danger (tangible reader/business impact)
    6. Mystery (architectural root cause)
    7. Promise (what today unlocks in plain words)
[ ] Enforce beat clarity: each beat must be under 20 words, every noun must refer to a single clear entity (person, screen, code, or machine event), and no mechanism terms (such as hook or component names) may appear in beat 7.

## Pedagogy & Voice Gates | 07 | Empathetic Anticipation Without Meta-Labels

[ ] Verify that surprising syntax or removed boilerplate (such as the absence of `e.preventDefault()`) is addressed directly in prose before the reader experiences confusion.
[ ] Check that zero instructional meta-labels appear in the lecture text: labels like "1. Novelty:", "2. Weirdness:", or "Cognitive Inference" are strictly forbidden.

## Pedagogy & Voice Gates | 08 | The 20-Word Sentence Ceiling and Cohesion #2026_09_20_21_group_1, #2026_09_20_27_group_1

[ ] Audit body prose for sentence length: cap individual sentences at 20 words, aiming for 7 to 15 words per sentence.
[ ] Verify zero clause chaining: check that explanations break contrasts, reasons, and consequences into separate, active Subject-Verb-Object sentences.
[ ] Verify that paragraphs remain cohesive and focused (typically 2 to 4 sentences grouping related thoughts), avoiding fractured single-sentence paragraphs.

## Pedagogy & Voice Gates | 09 | Explicit Entity Qualification ("What Is What" Rule) #2026_09_20_23_group_1

[ ] Check that every code entity is explicitly qualified with its architectural role on every reference: "the component `ReaderGreeting`", "the prop `readerName`", "the `<span>` element".
[ ] Verify that components referenced as JSX include angle brackets (`the component <ReaderGreeting />`), while module/function references omit them (`the component ReaderGreeting`).
[ ] Verify zero bare, unqualified tokens and zero split identifiers (for example, `avatar Url` instead of `avatarUrl`).

## Architecture & Narration Gates | 10 | The Pre-Example Mechanism Bridge Gate #2026_09_20_24_group_1

[ ] Verify that every lecture contains a dedicated conceptual bridge section (such as `### Components as Reusable Blueprints`) immediately preceding `### Let's Design a Practical Example...`.
[ ] Check that the section introduces the core syntax primitives and engine rules of that specific lecture before multi-component code assembly begins.
[ ] Confirm that the bridge explains: (1) what HTML/JS limitation is solved, (2) the React mechanism and syntax rules, (3) common traps or invariants, and (4) the files that will demonstrate it.

## Architecture & Narration Gates | 11 | The Upward Wire Callback Tracing Gate #2026_09_20_06_group_1 revised by #2026_09_21_02_group_1

[ ] In Archetype A lectures, whenever a child component invokes a callback prop (`onChange`, `onSelect`, `onSubmit`), verify that the prose traces the full 5-point Upward Wire circuit:
    1. Voices the reader's question ("Where does `onSelect` come from?").
    2. Points back to where the parent declared the handler or state setter in Step 1.
    3. Explains that the child owns zero state and merely holds a communication line.
    4. Traces the physical function execution running in the parent's memory upon interaction.
    5. Names the pattern as standard **inverse data flow**.
[ ] Strictly reject dismissive hand-waving phrases like "it simply calls the callback" or "the callback updates the parent".

## Architecture & Narration Gates | 12 | The Negative Counterfactual Gate #2026_09_20_07_group_1 revised by #2026_09_21_02_group_1

[ ] In Archetype A lectures, whenever component boundaries or separation of responsibilities are explained, verify that empty praise (such as "cleanest architecture") is completely absent.
[ ] Check that the separation is justified using the 4-part counterfactual circuit:
    1. Provocation question asking what breaks if responsibilities are merged.
    2. Description of the concrete disaster (trapped state, re-render churn).
    3. Physical code invariant stating what is absent (`zero useState and zero useEffect`).
    4. Decoupling proof showing symmetric refactoring scenarios.

## Architecture & Narration Gates | 13 | Explicit Multi-Entity Relationships #2026_09_20_13_group_1

[ ] Whenever code connects multiple files or imports components from shared modules, check that relationships are explicitly stated.
[ ] Verify that the prose states the exact count and names of all components involved and explains syntax choices (such as curly braces for named exports).

## Pedagogy & Voice Gates | 14 | Complete Explanation Precedes Friction Cards Gate #2026_09_21_08_group_1 revised by #2026_09_21_09_group_1

[ ] Check that the full lesson comes before the friction card: reject any lecture where a `[!WILD]` card sits between a broken snippet and the explanation that fixes it.
[ ] Confirm the section covers all four steps before the card appears: (1) shows the broken code, (2) explains why it failed, (3) teaches the rule, and (4) shows the working code.
[ ] Make sure the card introduces zero surprise terms: all bold terms inside the card must already be taught in the text above it.

## Structure & Panel Gates | 15 | Five-Stage Practical Example Execution #2026_09_21_02_group_1 revised by #2026_09_21_11_group_1

[ ] Verify that practical examples follow the mandatory 5-stage architecture matching the lecture's designated archetype:
    * **Title**: The section is titled strictly `### Let's Design a Practical Example` without appending component or feature names. Reject headings with trailing component tags. #2026_09_21_11_group_1
    * **Stage A**: Rendered UI Canvas (` ```components `) showing the finished interface or starter terminal output without code snippets, followed by the File Explorer (` ```files `).
    * **Stage B**: Visual assembly or scaffolding pipeline figure (`figures/{NN}-01-code-assembly-pipeline.html`).
    * **Stage C**: 4 sequential collaborative steps (`Step 1: First, we...` through `Step 4: Finally, we...`) assembled top-down (Archetype A) or deconstructing project initialization and anatomy (Archetype B).
[ ] Verify that every Stage C step heading explicitly ends with the target file name (`.jsx` or `.js`). Reject vague headings that omit the file name. #2026_09_21_10_group_1
[ ] Reject any lecture that uses the word "presenter" or fake roles like "header presenter". Check that all UI units are called components. #2026_09_21_10_group_1
    * **Stage E**: Concluding Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`) complying with Archetype 10: sits directly on the editorial page substrate (zero outer container borders, zero rounded boxes), anchored by 3px rules, with all 3 columns fully visible (22% layer, 39% naive, 39% reality) and table margins neutralized (`margin-left: 0 !important`). #2026_09_21_28_group_1

## Structure & Panel Gates | 16 | The 10-Line Code Ceiling and Continuations

[ ] Audit every code block in the lecture: every snippet must contain 10 or fewer lines of executable code. Line 11 is an automatic quality failure.
[ ] Check that sliced multi-step components use matching continuation attributes: `continues="bottom"` on the first, `continues="both"` on intermediate blocks, and `continues="top"` on the final block.
[ ] Confirm that `startLine` reflects accurate cumulative line numbers and that no snippet begins with a blank line.
[ ] Verify Comment-Prose Synchronization: Check that what the text underlines or introduces is explicitly annotated in the code block using the same vocabulary. In comparative code snippets, confirm that the differing lines in both snippets carry comments highlighting the contrast. #2026_09_21_13_group_1
[ ] Verify Tag-Free Code Comments: Check that all code comments are written in plain, natural English without uppercase category tags (such as CODE LOGIC, DATA FLOW, CLIENT API). The only permitted exception is when explicitly labeling RIGHT vs WRONG in comparative code blocks. #2026_09_21_15_group_1

## Structure & Panel Gates | 17 | Stage D Role Panel Compliance #2026_09_20_09_group_1, #2026_09_20_30_group_1 revised by #2026_09_21_02_group_1, #2026_09_21_16_group_1, and #2026_09_21_20_group_1

[ ] Check that Stage D is titled cleanly as `### Component Summary` without trailing subtitles or category labels.
[ ] Check that the Stage D heading spans full width horizontally across the page (outside the left marginalia) with generous vertical space below it. #2026_09_21_16_group_1
[ ] Check that the Stage D `component-code` panel uses Role Mode with an authoritative domain title: `title="Summary: The Logic of Nested Components"` for Archetype A, or `title="Summary: Project Architecture & File Hierarchy"` for Archetype B.
[ ] Check that nested components render bare on the page substrate without outer window borders, gray background cards, or traffic light dots. #2026_09_21_16_group_1
[ ] Verify that the panel is scoped strictly to the feature component tree (Archetype A, maximum 3 components) or foundational architecture files (Archetype B).
[ ] Check that every entry provides all 4 pipe-separated fields (`file | props | kind | [role: ...]`) and that child components are indented by exactly 2 spaces.
[ ] Verify that each role summary follows the four-beat rhythm in serif prose with varied cadences for the fourth beat.

## Structure & Panel Gates | 18 | Standard Closing Sequence

[ ] Check that the lecture concludes with the standard closing sections in exact order:
    1. `### Where you will meet this`: 3 to 5 concrete real-world use cases.
    2. `### Glossary`: 4 to 6 core terms formatted as `- **Term**: Plain-English definition and concrete engineering role.`
    3. `### Summary` #2026_09_21_19_group_1: Opens with a bold technical title, followed by `❒ {Subtitle}` categories and bolded decision rules (`➔ ALWAYS ...`, `➔ NEVER ...`, `➔ IF ... THEN ...`), where each subtitle and each decision rule is separated by blank lines into an independent block.
    4. Closing Comparison Table: Three-column comparative matrix as the final block of the Markdown file, right-aligning the first column and separating code spans with `<br>`.

## Compiler & Visual Verification | 19 | The Mechanical Build Gate

[ ] Compile the lecture using `node src/build-lectures.mjs`.
[ ] Enforce zero compiler warnings: any warning from Prince XML or the build pipeline is an automatic defect.
[ ] Confirm that HTML and PDF artifacts are successfully generated and that all figure references resolve to valid files on disk.

## Compiler & Visual Verification | 20 | Routine Production Screenshot Ban #2026_09_20_28_group_1

[ ] Taking screenshots via `pdftoppm` during routine lecture and figure production is strictly prohibited.
[ ] Routine verification of lectures, panels, and figures adapted from proven templates relies entirely on clean compiler builds (zero warnings).
[ ] Visual screenshot inspection is permitted only for brand-new experimental templates authored in `figures/templates/`, or upon explicit user command.

## Final Quality Gate | 21 | Comprehensive Pre-Flight Lecture Checklist #2026_09_21_02_group_1

[ ] Verify the complete lecture against the pre-flight quality gates before claiming completion:
    1. **Curriculum Dependency Invariant**: Zero premature syntax smuggling; hooks and patterns strictly adhere to question order (no `useState` before Q16, no callback props before Q15, no `useEffect` before Q35).
    2. **Archetype Alignment**: Five-stage practical example and Stage D panel align with Archetype A or Archetype B.
    3. **Skeleton Order**: Title → Question → 7 Beats → Catchy Opener → Mechanism Bridge → `### Let's Design a Practical Example` → Where You Will Meet This → Glossary → Summary → Closing Table.
    4. **Line Ceilings**: Every code snippet ≤ 10 lines with valid continuation attributes.
    5. **Division of Labor**: Code shows syntax, comments show line mechanics, prose explains mental models.
    6. **Algorithmic Comment Density & Speech Bubble Gate**: Every narrative body code block (≥3 lines) carries inline comments on load-bearing lines (zero barren blocks); every comment contains exactly one uppercase bold keyword; problematic code uses qualified tags (e.g. `**SLOW:**`, `**FRAGILE:**`) instead of misapplied `**WRONG:**`; confirmed via `node src/diagnose-lecture.mjs <NN>`. #2026_09_21_30_group_1
    7. **Sentence Cap**: All sentences ≤ 20 words, zero clause chaining.
    8. **Entity Qualification**: All entities qualified with roles (the component, the prop, the element).
    9. **5-Stage Assembly**: Stages A through E fully present.
    10. **Archetype Circuits**: Upward Wire & Counterfactual justified for Archetype A; Scaffolding & Entry Point mechanics deconstructed for Archetype B.
    11. **In The Wild Cards**: Placed at the end of the topic after showing the mistake, explaining the engine behavior, and showing the working code. Cards must never interrupt an unfinished explanation or introduce surprise terms. #2026_09_21_03_group_1 revised by #2026_09_21_08_group_1 and #2026_09_21_09_group_1
    12. **Universal Scenario De-Compounding**: All applications and scenarios—whether hypothetical or analytical—are staged one by one with concrete human scale; alternative use cases are introduced in separate sentences with transitional framing (e.g. "Alternatively, what if..."), never crammed into a single compound "X or Y" sentence. #2026_09_21_06_group_1
    13. **Audience Horizon Protection**: Explanations and trade-off contrasts must strictly restrict their claims to physical realities the student already understands (plain static files vs continuous web server runtimes). Invoking alien downstream concepts (such as "database connections inside your view layer") fails this gate. #2026_09_21_06_group_1
    14. **Anti-Tautology Decision Criteria Gate**: Dilemmas and tool choices must be justified by concrete operational criteria (e.g. public search indexing, private tools behind a login, server bills, crash monitoring) rather than circular tautologies (e.g. "choose a client tool if your app runs in the browser"). #2026_09_21_06_group_1
    15. **Visual-First Crossroad Declaration & Lexical Consistency Gate**: Any technical crossroad must open with an explicit unordered list with teal ➔ bullet markers (`- **Option 1...` and `- **Option 2...`) declaring Option 1 (The foundational/rigid way) and Option 2 (The modern idiomatic/composable way) with concrete syntax tokens before presenting code; code titles, prose, and comments must maintain strict lexical consistency without shifting or artistic labels. #2026_09_21_14_group_1 revised by #2026_09_22_11_group_1
    16. **Clean Build**: Zero Prince or compiler warnings on `node src/build-lectures.mjs`.
    17. **Pure HTML/Markdown Standard & Anti-LaTeX Syntax Law**: Zero raw LaTeX math syntax or backslash commands ($y = f(x)$, $\rightarrow$, $\le$); all directional paths must use unicode arrows (→), mathematical concepts must use inline code spans (`y = f(x)`), and relational comparisons must use standard unicode (≤, ≥). #2026_09_22_09_group_1
    18. **Callout Code Line Formatting & Border Harmony**: Zero overflowing inline code pills in callouts; all syntax transformations, statements, or JSX snippets inside callouts must be separated onto dedicated display lines with indented hierarchy; internal code cards maintain a uniform 1px perimeter without competing bold left accent borders. #2026_09_22_10_group_1

## Mechanical & Build Gates | 22 | The Prerequisite Algorithmic Diagnostic Protocol #2026_09_21_07_group_1

[ ] Mandatory Prerequisite Diagnostic: Before running the final compiler build, the author must run the algorithmic diagnostic tool (`node src/diagnose-lecture.mjs <NN>`). This script provides objective metrics and indications (not blocking gates):
    1. **Comment Density per Block**: Flags code blocks with zero comments that leave the right-hand speech bubble margin barren.
    2. **Sentence Length Profile**: Reports sentence word counts and highlights any sentence exceeding 20 words.
    3. **Block Height & Line Width**: Measures lines per block (≤ 10) and characters per line (≤ 80).
[ ] Treat diagnostic metrics as indications, not as rigid gaming gates: the script does not abort or fail with arbitrary error codes. It provides an objective mirror of reality to prevent extreme pendulum swings (such as stripping all comments or stuffing filler text). Running the diagnostic and reviewing its indications is a mandatory prerequisite that must be displayed in the authoring record. #2026_09_21_07_group_1
