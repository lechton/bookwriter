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

## Audit Protocol | 03 | Append Findings to "Beyond the Basics"

[ ] Append all audit findings in a single new section at the very end of the lecture titled exactly `## Beyond the basics`. Leave existing lecture sections untouched.
[ ] Format findings as a scannable bulleted list: `- **Bold lead phrase**: explanation ...`.
[ ] Ensure each bullet is completely self-contained: define all technical terms inline so a student reading only the bullets gains immediate comprehension.
[ ] Cross-reference relevant documentation paths and adjacent lectures (for example, `see Lecture 50` or documentation paths).
[ ] Order bullets by practical relevance: the most common engineering need comes first, niche edge cases come last (typically 4 to 8 bullets total).
[ ] Keep `## Beyond the basics` free of code blocks; if a missing topic requires full code deconstruction, recommend it in chat for inclusion in the lecture body.

[ ] PROPER EXAMPLE: make sure you follow this example, a self-contained audit bullet:

> - **The useEffectEvent escape hatch**: when an effect reads a value that changes often but the effect itself should not re-run on every change, `useEffectEvent` wraps that read in a stable function (see Lecture 50, documentation official/React 19 Sept 2026/react.dev/src/content/reference/react/useEffectEvent.md).

Notes: Leads with a bold title, defines the mechanism in plain English, and provides an authoritative cross-reference.

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

## Architecture & Narration Gates | 11 | The Upward Wire Callback Tracing Gate #2026_09_20_06_group_1

[ ] Whenever a child component invokes a callback prop (`onChange`, `onSelect`, `onSubmit`), verify that the prose traces the full 5-point Upward Wire circuit:
    1. Voices the reader's question ("Where does `onSelect` come from?").
    2. Points back to where the parent declared the handler or state setter in Step 1.
    3. Explains that the child owns zero state and merely holds a communication line.
    4. Traces the physical function execution running in the parent's memory upon interaction.
    5. Names the pattern as standard **inverse data flow**.
[ ] Strictly reject dismissive hand-waving phrases like "it simply calls the callback" or "the callback updates the parent".

## Architecture & Narration Gates | 12 | The Negative Counterfactual Gate #2026_09_20_07_group_1

[ ] Whenever component boundaries or separation of responsibilities are explained, verify that empty praise (such as "cleanest architecture") is completely absent.
[ ] Check that the separation is justified using the 4-part counterfactual circuit:
    1. Provocation question asking what breaks if responsibilities are merged.
    2. Description of the concrete disaster (trapped state, re-render churn).
    3. Physical code invariant stating what is absent (`zero useState and zero useEffect`).
    4. Decoupling proof showing symmetric refactoring scenarios.

## Architecture & Narration Gates | 13 | Explicit Multi-Entity Relationships #2026_09_20_13_group_1

[ ] Whenever code connects multiple files or imports components from shared modules, check that relationships are explicitly stated.
[ ] Verify that the prose states the exact count and names of all components involved and explains syntax choices (such as curly braces for named exports).

## Structure & Panel Gates | 14 | Five-Stage Practical Example Execution

[ ] Verify that practical examples follow the mandatory 5-stage architecture:
    * **Stage A**: Rendered UI Canvas (` ```components `) showing the finished interface without code snippets, followed by the File Explorer (` ```files `).
    * **Stage B**: Visual assembly pipeline figure (`figures/{NN}-01-code-assembly-pipeline.html`).
    * **Stage C**: 4 sequential collaborative assembly steps (`Step 1: First, we...` through `Step 4: Finally, we...`) assembled strictly top-down.
    * **Stage D**: Lessons from the Experiment (`### Lessons from the Experiment: Naive Expectation vs Reality`) with the Component Role panel preceding the audit table.
    * **Stage E**: Concluding Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`).

## Structure & Panel Gates | 15 | The 10-Line Code Ceiling and Continuations

[ ] Audit every code block in the lecture: every snippet must contain 10 or fewer lines of executable code. Line 11 is an automatic quality failure.
[ ] Check that sliced multi-step components use matching continuation attributes: `continues="bottom"` on the first, `continues="both"` on intermediate blocks, and `continues="top"` on the final block.
[ ] Confirm that `startLine` reflects accurate cumulative line numbers and that no snippet begins with a blank line.

## Structure & Panel Gates | 16 | Stage D Role Panel Compliance #2026_09_20_09_group_1, #2026_09_20_30_group_1

[ ] Check that the Stage D `component-code` panel uses Role Mode with the domain title `title="Summary: The Logic of Nested Components"`.
[ ] Verify that the panel is scoped strictly to the feature component tree (maximum 3 components), omitting outer host shells like `App.jsx`.
[ ] Check that every entry provides all 4 pipe-separated fields (`file | props | kind | [role: ...]`) and that child components are indented by exactly 2 spaces.
[ ] Verify that each role summary follows the four-beat rhythm in serif prose with varied cadences for the fourth beat.

## Structure & Panel Gates | 17 | Standard Closing Sequence

[ ] Check that the lecture concludes with the standard closing sections in exact order:
    1. `### Where you will meet this`: 3 to 5 concrete real-world use cases.
    2. `### Glossary`: 4 to 6 core terms formatted as `- **Term**: Plain-English definition and concrete engineering role.`
    3. `### Summary`: Opens with a bold technical title, followed by `❒ {Subtitle}` categories, numbered sub-points with `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a)`, and bolded decision rules (`➔ NEVER / ALWAYS`).
    4. Closing Comparison Table: Three-column comparative matrix as the final block of the Markdown file, right-aligning the first column and separating code spans with `<br>`.

## Compiler & Visual Verification | 18 | The Mechanical Build Gate

[ ] Compile the lecture using `node src/build-lectures.mjs`.
[ ] Enforce zero compiler warnings: any warning from Prince XML or the build pipeline is an automatic defect.
[ ] Confirm that HTML and PDF artifacts are successfully generated and that all figure references resolve to valid files on disk.

## Compiler & Visual Verification | 19 | Routine Production Screenshot Ban #2026_09_20_28_group_1

[ ] Taking screenshots via `pdftoppm` during routine lecture and figure production is strictly prohibited.
[ ] Routine verification of lectures, panels, and figures adapted from proven templates relies entirely on clean compiler builds (zero warnings).
[ ] Visual screenshot inspection is permitted only for brand-new experimental templates authored in `figures/templates/`, or upon explicit user command.

## Final Quality Gate | 20 | Comprehensive Pre-Flight Lecture Checklist

[ ] Verify the complete lecture against the pre-flight quality gates before claiming completion:
    1. **Skeleton Order**: Title $\rightarrow$ Question $\rightarrow$ 7 Beats $\rightarrow$ Catchy Opener $\rightarrow$ Mechanism Bridge $\rightarrow$ Practical Example $\rightarrow$ Where You Will Meet This $\rightarrow$ Glossary $\rightarrow$ Summary $\rightarrow$ Closing Table.
    2. **Line Ceilings**: Every code snippet $\le 10$ lines with valid continuation attributes.
    3. **Division of Labor**: Code shows syntax, comments show line mechanics, prose explains mental models.
    4. **Zero Syntax Smuggling**: Only single tokens in backticks in body text.
    5. **Sentence Cap**: All sentences $\le 20$ words, zero clause chaining.
    6. **Entity Qualification**: All entities qualified with roles (the component, the prop, the element).
    7. **5-Stage Assembly**: Stages A through E fully present and assembled top-down in Stage C.
    8. **Upward Wire & Counterfactual**: Callbacks and component boundaries justified via complete circuits.
    9. **In The Wild Cards**: Present in major technical sections with 6–9 word bold questions and aha resolutions.
    10. **Clean Build**: Zero Prince or compiler warnings on `node src/build-lectures.mjs`.
