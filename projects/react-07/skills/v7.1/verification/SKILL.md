---
name: verification
description: Governs the quality gates and visual verification protocol applied to a finished lecture or pre-lecture; use when a lecture is claimed complete or an audit is requested.
---

# Verification

This skill governs the quality gates, verification checks, and visual verification protocol applied to lectures and blueprints: what each gate inspects, the pass condition, and the on-demand audit workflow. The deep pedagogical and structural rules live in `pre-lecture`, `lecture-voice`, `lecture-structure`, `code-blocks`, `ui-panels`, and `figures`; this file serves as the definitive checking protocol.

Digests: `skills/old-instructions/AUDIT-CHECKLIST.md` and `skills/old-instructions/instructions.md` (audit phase, comprehensive final checklist).

## Audit Protocol | 01 | On-Demand Execution and Mindset

- [ ] Is the deep audit pass run on demand when explicitly requested (for example, "audit Lecture 40")?
- [ ] Does the audit target a finished lecture that has compiled to HTML and PDF at least once so the reviewer audits a stable artifact?
- [ ] Is the audit scoped to the single lecture specified by the user unless multiple lectures are requested?
- [ ] Does the reviewer adopt a fresh critical reader's mindset to identify what the original lecture missed or left ungrounded?

## Audit Protocol | 02 | Cross-Check Against Authoritative Local Documentation

- [ ] Has the lecture been read end-to-end in `01-02-md-LECTURES/<version>/{n}.md` (targeting the latest version by default), cataloging concepts, API methods, and examples? #2026_09_24_05_group_1
- [ ] Have all covered topics been cross-checked against authoritative local documentation under `documentation official/React 19 Sept 2026/react.dev/src/content/`?
- [ ] Are candidate gaps identified: related API surfaces not mentioned (such as `useEffectEvent`), alternative patterns for the same problem (such as `useReducer`), unflagged runtime traps, or natural next steps?
- [ ] Does every recorded gap deliver net-new, actionable information without duplicating material the lecture already covers?

## Audit Protocol | 03 | Inspect and Deepen "Beyond the Basics" #2026_09_21_32_group_1

- [ ] Does every production lecture include the `## Beyond the basics` section placed immediately between `### Glossary` and `### Summary`? #2026_09_21_32_group_1
- [ ] Are audit findings and candidate gaps integrated into this section, refining existing bullets or appending missing points?
- [ ] Are findings formatted as a scannable bulleted list: `- **Bold lead phrase**: explanation ...`?
- [ ] Is each bullet completely self-contained, defining technical terms inline for immediate comprehension?
- [ ] Are official documentation resources cross-referenced using live, clickable website links formatted as `(see [react.dev/...](https://react.dev/...))` and adjacent lectures (for example, `see Lecture 50`), avoiding local file paths or GitHub URLs? #2026_09_21_33_group_1
- [ ] Are bullets ordered by practical relevance (most common need first, niche edge cases last, typically 4 to 8 bullets total)?
- [ ] Is `## Beyond the basics` kept free of code blocks, recommending topics needing code deconstruction in chat for inclusion in the body?

- [ ] PROPER EXAMPLE: Self-contained audit bullet:

> - **The useEffectEvent escape hatch**: when an effect reads a value that changes often but the effect itself should not re-run on every change, `useEffectEvent` wraps that read in a stable function (see Lecture 35, [react.dev/reference/react/useEffectEvent](https://react.dev/reference/react/useEffectEvent)).

Notes: Leads with a bold title, defines the mechanism in plain English, and provides an active clickable hyperlink to the official website. #2026_09_21_33_group_1

## Audit Protocol | 04 | Fact-Check Tool and Runtime Claims

- [ ] Are claims regarding external tools (npm, Vite, bundlers, shell syntax) verified against official documentation before approval?
- [ ] Are inaccurate claims pruned, ensuring only verified tool mechanics reach the student?
- [ ] Does every console line, screen text, and error the prose attributes to a code block come from that block as printed, with the same strings, names, and titles? When the lecture changes a proof the map verified, is the changed code run again in the map's sandbox? #2026_10_06_03_group_3

- [ ] COUNTER-EXAMPLE: Lecture 14 (October 6 run) logs `'likes ='`, but the prose reports "clicked, likes = 1". It names a card "Transit Accord Finalized" while the code says 'Transit Accord'. It describes a "proof log" from an initializer that logs nothing. Each block was written after the map's sandbox run, and none was run again. #2026_10_06_03_group_3

## Pedagogy & Voice Gates | 05 | The Developer-at-the-Keyboard Gate

- [ ] Is the lecture written from the perspective of the developer sitting at the keyboard, guiding them through concrete files and screen behaviors?
- [ ] Does every runtime concept satisfy the three-part explanation: (1) what you write, (2) what manual boilerplate is removed, and (3) what the browser physically does?
- [ ] Does the prose avoid the disembodied internal engine voice, focusing on what appears in the reader's editor and browser?

## Pedagogy & Voice Gates | 06 | Typology Tagging and the Opening Problem

- [ ] Does line 2 contain the interview question callout: `> INTERVIEW QUESTION | {tier} | {question text}`?
- [ ] Does the body open immediately with 2 or 3 numbered lines: what the reader is building, what goes wrong, and optionally the question (`lecture-voice` Section 15)? #2026_10_07_05_group_1 revised by #2026_10_11_04_group_2
- [ ] Is each line under 20 words, with every noun referring to a single clear entity and no term the lesson has not taught yet? #2026_10_11_04_group_2

## Pedagogy & Voice Gates | 07 | Empathetic Anticipation Without Meta-Labels

- [ ] Is surprising syntax or removed boilerplate addressed directly in prose before the reader experiences confusion?
- [ ] Are instructional meta-labels (such as "1. Novelty:", "2. Weirdness:", or "Cognitive Inference") avoided in the lecture text?

## Pedagogy & Voice Gates | 08 | Sentence Length and Cohesion #2026_09_20_21_group_1, #2026_09_20_27_group_1

- [ ] Can each sentence be followed on the first read, carrying one event or fact, as `lecture-voice` Section 06 describes? Sentences the length report lists are reread, and split only when they make the reader hold two clauses at once. #2026_09_20_21_group_1 revised by #2026_10_10_01_group_4
- [ ] Does the text avoid clause chaining, breaking contrasts, reasons, and consequences into separate Subject-Verb-Object sentences?
- [ ] Do paragraphs remain cohesive and focused (typically 2 to 4 sentences grouping related thoughts), avoiding isolated single-sentence paragraphs?

## Pedagogy & Voice Gates | 09 | Explicit Entity Qualification ("What Is What" Rule) #2026_09_20_23_group_1

- [ ] Is every code entity introduced with its role the first time a paragraph names it ("the component `ReaderGreeting`", "the prop `readerName`", "the `<span>` element"), and is the noun repeated wherever "it" or "this" could point to two things (`lecture-voice` Section 07)? #2026_09_20_23_group_1 revised by #2026_10_10_01_group_7
- [ ] Do components referenced as JSX include angle brackets (`the component <ReaderGreeting />`), while module/function references omit them (`the component ReaderGreeting`)?
- [ ] Are bare, unqualified tokens and split identifiers avoided?

## Architecture & Narration Gates | 10 | Theory-First Foundation, Autonomous Principled Theory & Multi-Invariant Coverage #2026_09_24_01_group_1 revised by #2026_09_24_06_group_1 and #2026_09_25_03_group_1

- [ ] Does the lecture end its first section with the recall list, and do its runway sections teach every idea the question cycles use before the first question (`lecture-structure` Section 12)? #2026_09_25_03_group_1 revised by #2026_10_10_01_group_5
- [ ] Does the principles section (`### Principles of React: {Topic}`) hold one question cycle per map principle in the order of `lecture-structure` Section 12C (question, `---`, `**ANSWER**`, verdict, answer, fix, box), immediately preceding `### Let's Design a Practical Example`? #2026_10_10_01_group_5
- [ ] Does each boxed principle (`> [!PRINCIPLE]`) explain what happens and end with what the reader should write, with its boundary, as `principle-definition` Section 01 asks, instead of a bare command with no reason ("Never do X") or a fact with no rule? #2026_09_25_03_group_1 revised by #2026_10_10_01_group_6
- [ ] Do the lecture's principles match the approved `01-01-map-principles/{nn}.md` one-to-one in order and operational decision, with no principle added, merged, split, or dropped during lecture authoring? #2026_09_25_03_group_1 revised by #2026_09_26_19_group_1, #2026_09_26_20_group_1, and #2026_09_26_21_group_2
- [ ] Does every invariant, syntax rule, or collision mechanism declared in the opening beats receive a dedicated mechanical explanation with minimal code snippets in the runway or a question cycle? #2026_10_10_01_group_5
- [ ] Does each boxed principle state its approved rule with continuous numbering and end with its code under the `principle-definition` rules (a pair when the map names a Real Mistake, the right card alone when it says `none`; each card stands alone, real code)? #2026_09_26_19_group_1 revised by #2026_09_27_12_group_1, #2026_10_06_04_group_3, and #2026_10_06_09_group_2
- [ ] Is each principle definition written in fluent, natural prose without robotic bold-parentheses stuffing (e.g. zero trailing parentheticals like `(**term**)` in prose)? #2026_09_26_06_group_1
- [ ] When comparative code cases are warranted, do they contrast genuine competing engineering paradigms or authentic failure modes within the **exact same file, language, and lexical scope**, avoiding cross-layer mismatches (HTML vs JS), CLI commands in code boxes, identical code with comment-only file differences, trivial syntax typos, or absurd conversions? #2026_09_26_06_group_1 revised by #2026_09_26_19_group_1 and #2026_09_27_12_group_1
- [ ] Are comments in principle code cards ALWAYS placed at the bottom of the target code line (`code // comment`), ensuring speech bubble clouds (`.cmt-bubble`) render directly beneath the line they annotate and their upward pointer (`▲`) points directly at the code rather than into card headers or preceding lines? #2026_09_27_13_group_1
- [ ] In multi-principle lectures, does every principle govern a distinct, independent architectural dimension rather than repeatedly attacking the same anti-pattern across multiple cards? #2026_09_26_06_group_1
- [ ] Does the practical case study (Stage C) contain zero syntax tokens, props, HTML tags, or attributes that were not formally taught and grounded in theory first?
- [ ] Do interior reference tables break out into full-width layout (`table.reference-table`) and remain modular?

## Architecture & Narration Gates | 11 | Upward Wire Callback Tracing Gate #2026_09_20_06_group_1 revised by #2026_09_21_02_group_1

- [ ] In Archetype A lectures, whenever a child invokes a callback prop (`onChange`, `onSelect`, `onSubmit`), does the prose trace the full 5-point Upward Wire circuit:
    1. Voices the reader's question ("Where does `onSelect` come from?").
    2. Points back to where the parent declared the handler or setter in Step 1.
    3. Explains that the child owns zero state and merely holds a communication line.
    4. Traces the physical function execution running in the parent's memory upon interaction.
    5. Names the pattern as standard **inverse data flow**.
- [ ] Are dismissive hand-waving phrases (like "it simply calls the callback") avoided?

## Architecture & Narration Gates | 12 | The Negative Counterfactual Gate #2026_09_20_07_group_1 revised by #2026_09_21_02_group_1

- [ ] In Archetype A lectures, whenever component boundaries are explained, does the text avoid empty praise ("cleanest architecture")?
- [ ] Is separation justified using the 4-part counterfactual circuit:
    1. Provocation question asking what breaks if responsibilities are merged.
    2. Description of the concrete disaster (trapped state, re-render churn).
    3. Physical code invariant stating what is absent (`zero useState and zero useEffect`).
    4. Decoupling proof showing symmetric refactoring scenarios.

## Architecture & Narration Gates | 13 | Explicit Multi-Entity Relationships #2026_09_20_13_group_1

- [ ] Whenever code connects multiple files or imports components from shared modules, are relationships explicitly stated?
- [ ] Does the prose state the exact count and names of all components involved and explain syntax choices?

## Pedagogy & Voice Gates | 14 | Complete Explanation Precedes Friction Cards #2026_09_21_08_group_1 revised by #2026_09_21_09_group_1

- [ ] Does the full lesson come before the friction card, ensuring the `[!WILD]` card never sits between a broken snippet and the explanation that fixes it?
- [ ] Does the section cover all four steps before the card appears: (1) shows broken code, (2) explains why it failed, (3) teaches the rule, and (4) shows working code?
- [ ] Does the card avoid surprise terms, ensuring all bold terms inside were already taught in the text above it?

## Structure & Panel Gates | 15 | Five-Stage Practical Example Execution #2026_09_21_02_group_1 revised by #2026_09_21_11_group_1, #2026_09_25_03_group_1, and #2026_09_26_04_group_1

- [ ] Does the practical example follow the 5-stage architecture matching the lecture's designated archetype:
    * **Title**: Is the section titled strictly `### Let's Design a Practical Example` without appending component or feature names? #2026_09_21_11_group_1
    * **Stage A**: Rendered UI Canvas (` ```components `) showing the finished interface without code snippets, followed by the File Explorer (` ```files `). Does the canvas maintain 1-to-1 structural parity with the files panel (representing each component file as an indented node) and flat DOM element descriptors (` ;; `) without recursive nested brackets or empty container tags? #2026_09_26_04_group_1
    * **Stage B**: Visual assembly or scaffolding pipeline figure (`figures/{NN}-01-code-assembly-pipeline.html`).
    * **Stage C**: 2 to 4 sequential collaborative steps ($N \in \{2, 3, 4\}$, `Step 1: First, we...` through `Step 2/3/4: Finally, we...`) assembled top-down (Archetype A) or deconstructing project initialization (Archetype B), accompanied by meaningful architectural commentary rather than mechanical line mapping. #2026_09_25_03_group_1 revised by #2026_09_25_05_group_1
    * **Stage D**: `### Component Summary` with the Component Role panel (` ```component-code ` in Role Mode).
    * **Stage E**: Concluding Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`) complying with Archetype 10.
- [ ] Does every Stage C step heading explicitly end with the target file name (`.jsx` or `.js`)? #2026_09_21_10_group_1
- [ ] Are UI units called components, avoiding "presenter" jargon? #2026_09_21_10_group_1

## Structure & Panel Gates | 16 | The 10-Line Code Ceiling and Continuations

- [ ] Does every code block in the lecture contain 10 or fewer lines of executable code?
- [ ] Do sliced multi-step components use matching continuation attributes (`continues="bottom"`, `continues="both"`, `continues="top"`)?
- [ ] Does `startLine` reflect accurate cumulative line numbers with zero leading blank lines?
- [ ] Do code comments synchronize with surrounding prose and vocabulary, highlighting differing lines in comparative snippets? #2026_09_21_13_group_1
- [ ] Are code comments written in natural English without uppercase category tags (except `// **WRONG:**` / `// **RIGHT:**` in comparative blocks)? #2026_09_21_15_group_1

## Structure & Panel Gates | 17 | Stage D Role Panel Compliance #2026_09_20_09_group_1, #2026_09_20_30_group_1 revised by #2026_09_21_02_group_1, #2026_09_21_16_group_1, and #2026_09_21_20_group_1

- [ ] Is Stage D titled cleanly as `### Component Summary`?
- [ ] Does the Stage D heading span full width across the page? #2026_09_21_16_group_1
- [ ] Does the `component-code` panel use Role Mode with an authoritative domain title?
- [ ] Do nested components render bare on the page substrate without outer window borders or traffic light dots? #2026_09_21_16_group_1
- [ ] Is the panel scoped strictly to the feature component tree (Archetype A, maximum 3 components) or foundational architecture files (Archetype B)?
- [ ] Does every entry provide all 4 fields with child components indented by 2 spaces?
- [ ] Does each role summary follow the four-beat rhythm in serif prose with varied cadences?

## Structure & Panel Gates | 18 | Standard Closing Sequence #2026_09_25_03_group_1 revised by #2026_10_07_03_group_1, #2026_10_07_04_group_1, and #2026_10_07_06_group_1

- [ ] Does the lecture conclude with the standard closing sections in exact order:
    1. `### Where you will meet this`: 3 to 5 concrete real-world use cases.
    2. `### For the interview`: Opens with `> **The Interview Question:** [question]` followed by the 4 beats (The Hidden Signal, The Classic Trap, What is Actually Going On, Where It Gets Tricky). #2026_10_07_06_group_1
    3. `### Glossary`: 4 to 6 core terms formatted as `- **Term**: Plain-English definition and concrete engineering role`, with zero orphan terms (every glossary term introduced and grounded in previous text). #2026_09_25_03_group_1
    4. `## Beyond the basics`: 4 to 8 authoritative bullets with live links. #2026_09_21_32_group_1
    5. `### Summary`: Opens with a bold technical title, followed by `❒ {Subtitle}` categories and bolded decision rules (`➔ ALWAYS ...`, `➔ NEVER ...`, `➔ IF ... THEN ...`). #2026_09_21_19_group_1
    6. Closing Comparison Table: Three-column comparative matrix as the final block of the Markdown file.

## Compiler & Visual Verification | 19 | The Mechanical Build Gate

- [ ] Does the lecture compile cleanly using `node src/build-lectures.mjs` with zero compiler warnings?
- [ ] Are HTML and PDF artifacts successfully generated, with all figure references resolving to valid files on disk?

## Compiler & Visual Verification | 20 | Routine Production Verification Protocol & Visual Warrant Law #2026_09_20_28_group_1 revised by #2026_09_26_10_group_1

- [ ] Does routine verification of text, principles, markdown prose, and routine figures rely exclusively on clean compiler builds (`node src/build-lectures.mjs` with zero warnings)?
- [ ] Is `pdftoppm` execution strictly categorized by Routine vs. Experimental figure work:
    * **Routine Production (Camera BANNED)**: When authoring or revising markdown prose, editing principles, or adapting proven catalog figures (e.g. Stage B Archetype 09 step cards, Stage E Archetype 10 audit tables), running `pdftoppm` or inspecting screenshots is STRICTLY FORBIDDEN. Fabricating pretexts ("verifying layout", "checking pagination", "checking zero defects") is permanently banned.
    * **Experimental Visual Blueprints (Camera WARRANTED)**: Visual inspection via `pdftoppm` is warranted strictly and exclusively when: (1) designing a brand-new visual archetype or blueprint template from scratch in `figures/templates/` with unproven CSS geometry, (2) diagnosing or fixing an explicit visual layout defect (such as text overlapping, border collision, or container clipping), or (3) explicitly commanded by the user in chat.
- [ ] Does the author halt tool execution immediately upon a clean build exit (code 0, zero warnings) for all routine tasks?

## Final Quality Gate | 21 | Comprehensive Pre-Flight Lecture Checklist #2026_09_21_02_group_1 revised by #2026_09_25_03_group_1 and #2026_10_10_01_group_4

Read the lecture as its reader will, top to bottom, before any script runs. The reading gates come first because no script can tell whether a question makes sense or an answer is true; the mechanical gates come last and only confirm form. Write the result of each reading gate as one line in the completion report, naming what was read and what was found or fixed. #2026_10_10_01_group_4

- [ ] **Reading gates, in this order, before any script:** #2026_10_10_01_group_4
    0. **An introduction a reader can follow**: Could a reader who knows only the earlier lessons follow the first section and the runway on one read? Is every new term shown in code next to its name, and does the text start teaching in its first sentence (`lecture-structure` Section 12 and `intro-examples.md`)? #2026_10_11_04_group_1
    1. **Questions a reader asks**: Is every question one a reader at this point would ask, in the lesson's story, and is every claim in it true for the code shown, including counts of clicks, renders, and values? #2026_10_10_01_group_4
    2. **Answers that follow**: Does every verdict match what the code does, and does every answer explain it in the order things happen, recalling runway and earlier ideas in a few words and ending in what the reader sees? #2026_10_10_01_group_4
    3. **Boxes from their cycle**: Does every principle box pass Passes 1 to 3 of `skills/v7.1/principle-definition/SKILL.md` Section 01B in order (casebook alignment, the "Picture It" test, plain JavaScript first)? Does it hold nothing its question, answer, and runway did not show, end with the cycle's fix as its right card, and equal its blueprint box? #2026_09_26_11_group_1 revised by #2026_10_04_10_group_1, #2026_10_06_03_group_1, #2026_10_06_04_group_3, #2026_10_07_02_group_1, and #2026_10_10_01_group_4
    4. **Zero gaps**: Is every idea a question, answer, box, side note, glossary entry, or callout uses taught earlier in the lecture (recall list, runway, earlier cycle) or in an earlier lecture? Does every side note name a word its box text uses? Does the recall list name only earlier lessons? #2026_09_25_03_group_1 revised by #2026_10_10_01_group_4 and #2026_10_11_01_group_3
    5. **Boundaries kept**: Does every box keep its map principle's boundary (a `Condition` Review Point or the case a `Fix In` hands on), and does every summary rule keep it, with `IF ... THEN` where the box says when? #2026_10_10_01_group_4
    6. **Two-map scope and principle traceability**: Has `01-01-map/{nn}.md` been consulted for scope and `01-01-map-principles/{nn}.md` for the exact principle set; does every lecture principle trace one-to-one to that map; does every `Prerequisite` row appear as a one-line recall and every `Preview` row as one sentence, each naming the owner lesson; do `Deferred` rows stay out; is no claim from the map's Open Issues quoted as fact; and does each forward promise have a `promise` message in `node src/handout.mjs {nn}`? #2026_09_25_06_group_1 revised by #2026_09_26_19_group_1, #2026_09_26_21_group_2, #2026_10_06_01_group_2, #2026_10_06_01_group_3, #2026_10_06_02_group_5, #2026_10_06_03_group_2, and #2026_10_10_01_group_4
    7. **Map ownership and authentic contrasts**: Does each principle stay within the decision its map entry owns, and is every wrong card a mistake developers really make in this topic? #2026_09_26_17_group_1 revised by #2026_09_26_19_group_1 and #2026_09_26_21_group_2
    8. **Diagrams that are true**: Is every ASCII diagram built from the lesson's real values, and is every line of it true? #2026_10_10_01_group_4
    9. **Reader horizon and plain criteria**: Are explanations built from realities the reader already knows, with the reader's code as the picture instead of outside stories, choices justified by concrete criteria, and scenarios staged one at a time? #2026_09_21_06_group_1 revised by #2026_10_10_01_group_7
    10. **Commentary quality and archetype circuits**: Do Stage C steps explain what the code teaches instead of reciting lines, with Upward Wire and Counterfactual circuits for Archetype A, or scaffolding and entry point mechanics for Archetype B? #2026_09_25_03_group_1
    11. **Professional idiom**: Does the case study model an authentic component a senior engineer would write, with universal everyday names (tickets, items, likes, messages, count), and no toy widgets, 2-line helper files, or newsroom jargon? #2026_09_25_05_group_1 revised by #2026_10_07_05_group_1
    12. **Friction cards and crossroads**: Is each `[!WILD]` card placed after the mistake, explanation, rule, and working code, and does each crossroad open with its two options and keep its vocabulary? #2026_09_21_14_group_1 revised by #2026_09_22_11_group_1
    13. **Sentences and names**: Can each sentence be followed on the first read (`lecture-voice` Section 06), and is each entity introduced with its role, with the noun repeated wherever "it" could mean two things (`lecture-voice` Section 07)? #2026_10_10_01_group_4
    14. **Division of labor**: Code shows syntax, comments give the value or the visible result, prose explains why.
- [ ] **Mechanical gates, only after the reading gates pass:** #2026_10_10_01_group_4
    1. **Curriculum dependency**: Zero premature syntax; hooks and patterns follow question order.
    2. **Skeleton order**: Title → Question → 2 or 3 Opening Lines → First Section with recall list → Runway → Principles with question cycles → `### Let's Design a Practical Example` → Where You Will Meet This → For the Interview → Glossary → Beyond the Basics → Summary → Closing Table. #2026_09_25_03_group_1 revised by #2026_10_07_03_group_1, #2026_10_07_06_group_1, and #2026_10_10_01_group_5
    3. **Five-stage assembly**: Stages A through E present, and the Stage D panel matches Archetype A or B.
    4. **Line ceilings**: Every code snippet ≤ 10 lines with valid continuation attributes.
    5. **Comments**: Every narrative body code block (≥3 lines) carries end-of-line comments on its load-bearing lines, and no `//` comment follows JSX markup (`code-blocks` Section 09). #2026_09_21_30_group_1 revised by #2026_10_10_01_group_8
    6. **Markdown standard**: Unicode glyphs (→, ≤) and code spans instead of LaTeX, and callout code on dedicated display lines. #2026_09_22_09_group_1 #2026_09_22_10_group_1
    7. **Diagnostics**: `node src/diagnose-lecture.mjs {nn}` reports zero `[FAIL]` lines and no unnamed ledger owner (Section 22).
    8. **Clean build**: Zero Prince or compiler warnings on `node src/build-lectures.mjs`.

- [ ] PROPER EXAMPLE: A completion report that reads first: "Gate 1: Question 3 said 'multiple clicks'; the bug comes from one click, so the question now says one click. Gate 4: Principle 1's side note named `setTimeout`, which the box never used; removed. Gate 5: Principle 3 keeps 'a plain value is fine for one update per click', and the summary says IF ... THEN. Mechanical gates: diagnose-lecture 0 FAIL; build clean." #2026_10_10_01_group_4

- [ ] COUNTER-EXAMPLE: "All 24 gates verified. diagnose-lecture: 0 FAIL. Build clean." Notes: Lecture 17 passed every script with a question that miscounted clicks, a side note for a word its box never used, and a summary that widened a bounded rule into ALWAYS. #2026_10_10_01_group_4

## Mechanical & Build Gates | 22 | Algorithmic Diagnostic Protocol #2026_09_21_07_group_1 revised by #2026_10_10_01_group_4

- [ ] Is `node src/diagnose-lecture.mjs <NN>` run after the reading gates and before the final build? It reports the reading-related checks first (question cycles against the map, principle cards, JSX comments, side notes, the recall list, ledger owners) and the mechanical metrics last (comment density, sentence lengths, line widths). #2026_09_21_07_group_1 revised by #2026_10_10_01_group_4 and #2026_10_11_01_group_3
- [ ] Is every `[FAIL]` fixed, and is every `[INDICATION]` read as a pointer to text to reread, not as a verdict? A long sentence that reads in one breath stays. #2026_09_21_07_group_1 revised by #2026_10_10_01_group_4
