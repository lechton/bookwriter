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

## Pedagogy & Voice Gates | 05 | The Developer-at-the-Keyboard Gate

- [ ] Is the lecture written from the perspective of the developer sitting at the keyboard, guiding them through concrete files and screen behaviors?
- [ ] Does every runtime concept satisfy the three-part explanation: (1) what you write, (2) what manual boilerplate is removed, and (3) what the browser physically does?
- [ ] Does the prose avoid the disembodied internal engine voice, focusing on what appears in the reader's editor and browser?

## Pedagogy & Voice Gates | 06 | Typology Tagging and Seven Opening Beats

- [ ] Does line 2 contain the interview question callout: `> INTERVIEW QUESTION | {tier} | {question text}`?
- [ ] Does the body open immediately with 7 numbered beats progressing from Scene to Promise:
    1. Scene (The National Times newsroom)
    2. Setup (concrete user/journalist action)
    3. Surprising Action (what code attempts)
    4. Question (central doubt or failure)
    5. Danger (tangible reader/business impact)
    6. Mystery (architectural root cause)
    7. Promise (what today unlocks in plain words)
- [ ] Is each beat under 20 words, with every noun referring to a single clear entity and zero mechanism terms appearing in beat 7?

## Pedagogy & Voice Gates | 07 | Empathetic Anticipation Without Meta-Labels

- [ ] Is surprising syntax or removed boilerplate addressed directly in prose before the reader experiences confusion?
- [ ] Are instructional meta-labels (such as "1. Novelty:", "2. Weirdness:", or "Cognitive Inference") avoided in the lecture text?

## Pedagogy & Voice Gates | 08 | Sentence Length and Cohesion #2026_09_20_21_group_1, #2026_09_20_27_group_1

- [ ] Are individual sentences capped at 20 words, aiming for 7 to 15 words per sentence?
- [ ] Does the text avoid clause chaining, breaking contrasts, reasons, and consequences into separate Subject-Verb-Object sentences?
- [ ] Do paragraphs remain cohesive and focused (typically 2 to 4 sentences grouping related thoughts), avoiding isolated single-sentence paragraphs?

## Pedagogy & Voice Gates | 09 | Explicit Entity Qualification ("What Is What" Rule) #2026_09_20_23_group_1

- [ ] Is every code entity explicitly qualified with its architectural role on every reference: "the component `ReaderGreeting`", "the prop `readerName`", "the `<span>` element"?
- [ ] Do components referenced as JSX include angle brackets (`the component <ReaderGreeting />`), while module/function references omit them (`the component ReaderGreeting`)?
- [ ] Are bare, unqualified tokens and split identifiers avoided?

## Architecture & Narration Gates | 10 | Theory-First Foundation, Autonomous Principled Theory & Multi-Invariant Coverage #2026_09_24_01_group_1 revised by #2026_09_24_06_group_1 and #2026_09_25_03_group_1

- [ ] Does the lecture provide a complete theoretical introduction section (`### ...`) establishing the mental model, foundational concepts, and syntax grammar before the principles section? #2026_09_25_03_group_1
- [ ] Does the principles section (`### Principles of React: {Topic}`) deliver an autonomous, self-contained set of platform laws immediately preceding `### Let's Design a Practical Example`?
- [ ] Does each boxed principle (`> [!PRINCIPLE]`) state an operational definition explaining physical engine mechanics, runtime behavior, and architectural choices, completely avoiding authoritarian vocabulary? #2026_09_25_03_group_1
- [ ] Do the lecture's principles match the approved `01-01-map-principles/{nn}.md` one-to-one in order and operational decision, with no principle added, merged, split, or dropped during lecture authoring? #2026_09_25_03_group_1 revised by #2026_09_26_19_group_1, #2026_09_26_20_group_1, and #2026_09_26_21_group_2
- [ ] Does every invariant, syntax rule, or collision mechanism declared in the opening beats receive a dedicated mechanical explanation with minimal code snippets in Section 2?
- [ ] Does each boxed principle state its approved operational rule with continuous numbering, omitting comparative code cards entirely for `Kind: Model` and non-syntax rules (CLI workflows, file naming), and using comparative cards only when an authentic in-file peer alternative exists? #2026_09_26_19_group_1 revised by #2026_09_27_12_group_1
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

## Structure & Panel Gates | 18 | Standard Closing Sequence #2026_09_25_03_group_1

- [ ] Does the lecture conclude with the standard closing sections in exact order:
    1. `### Where you will meet this`: 3 to 5 concrete real-world use cases.
    2. `### Glossary`: 4 to 6 core terms formatted as `- **Term**: Plain-English definition and concrete engineering role`, with zero orphan terms (every glossary term introduced and grounded in previous text). #2026_09_25_03_group_1
    3. `## Beyond the basics`: 4 to 8 authoritative bullets with live links. #2026_09_21_32_group_1
    4. `### Summary`: Opens with a bold technical title, followed by `❒ {Subtitle}` categories and bolded decision rules (`➔ ALWAYS ...`, `➔ NEVER ...`, `➔ IF ... THEN ...`). #2026_09_21_19_group_1
    5. Closing Comparison Table: Three-column comparative matrix as the final block of the Markdown file.

## Compiler & Visual Verification | 19 | The Mechanical Build Gate

- [ ] Does the lecture compile cleanly using `node src/build-lectures.mjs` with zero compiler warnings?
- [ ] Are HTML and PDF artifacts successfully generated, with all figure references resolving to valid files on disk?

## Compiler & Visual Verification | 20 | Routine Production Verification Protocol & Visual Warrant Law #2026_09_20_28_group_1 revised by #2026_09_26_10_group_1

- [ ] Does routine verification of text, principles, markdown prose, and routine figures rely exclusively on clean compiler builds (`node src/build-lectures.mjs` with zero warnings)?
- [ ] Is `pdftoppm` execution strictly categorized by Routine vs. Experimental figure work:
    * **Routine Production (Camera BANNED)**: When authoring or revising markdown prose, editing principles, or adapting proven catalog figures (e.g. Stage B Archetype 09 step cards, Stage E Archetype 10 audit tables), running `pdftoppm` or inspecting screenshots is STRICTLY FORBIDDEN. Fabricating pretexts ("verifying layout", "checking pagination", "checking zero defects") is permanently banned.
    * **Experimental Visual Blueprints (Camera WARRANTED)**: Visual inspection via `pdftoppm` is warranted strictly and exclusively when: (1) designing a brand-new visual archetype or blueprint template from scratch in `figures/templates/` with unproven CSS geometry, (2) diagnosing or fixing an explicit visual layout defect (such as text overlapping, border collision, or container clipping), or (3) explicitly commanded by the user in chat.
- [ ] Does the author halt tool execution immediately upon a clean build exit (code 0, zero warnings) for all routine tasks?

## Final Quality Gate | 21 | Comprehensive Pre-Flight Lecture Checklist #2026_09_21_02_group_1 revised by #2026_09_25_03_group_1

- [ ] Are all pre-flight quality checks verified before claiming completion:
    1. **Curriculum Dependency Invariant**: Zero premature syntax smuggling; hooks and patterns strictly adhere to question order.
    2. **Archetype Alignment**: Five-stage practical example and Stage D panel align with Archetype A or Archetype B.
    3. **Skeleton Order**: Title → Question → 7 Beats → Problem Opener → Theory-First Conceptual Foundation → Principled Theory → `### Let's Design a Practical Example` → Where You Will Meet This → Glossary → Beyond the Basics → Summary → Closing Table. #2026_09_25_03_group_1
    4. **Line Ceilings**: Every code snippet ≤ 10 lines with valid continuation attributes.
    5. **Division of Labor**: Code shows syntax, comments show line mechanics, prose explains mental models.
    6. **Comment Density & Speech Bubbles**: Every narrative body code block (≥3 lines) carries inline comments on load-bearing lines with bold keywords. #2026_09_21_30_group_1
    7. **Sentence Cap**: All sentences ≤ 20 words, zero clause chaining.
    8. **Entity Qualification**: All entities qualified with roles (the component, the prop, the element).
    9. **5-Stage Assembly**: Stages A through E fully present.
    10. **Archetype Circuits**: Upward Wire & Counterfactual justified for Archetype A; Scaffolding & Entry Point mechanics deconstructed for Archetype B.
    11. **In The Wild Cards**: Placed at the end of the topic after showing mistake, explanation, rule, and working code.
    12. **Universal Scenario De-Compounding**: All applications staged one by one with concrete human scale. #2026_09_21_06_group_1
    13. **Audience Horizon Protection**: Explanations restricted to physical realities the student already understands. #2026_09_21_06_group_1
    14. **Anti-Tautology Decision Criteria**: Dilemmas and tool choices justified by concrete operational criteria. #2026_09_21_06_group_1
    15. **Visual-First Crossroad Declaration & Lexical Consistency**: Crossroads open with unordered lists with teal arrow markers and maintain consistent vocabulary. #2026_09_21_14_group_1 revised by #2026_09_22_11_group_1
    16. **Clean Build**: Zero Prince or compiler warnings on `node src/build-lectures.mjs`.
    17. **Pure HTML/Markdown Standard**: Unicode glyphs (→, ≤) and code spans used instead of raw LaTeX math. #2026_09_22_09_group_1
    18. **Callout Code Formatting**: Syntax snippets inside callouts separated onto dedicated display lines. #2026_09_22_10_group_1
    19. **Autonomous Theory & Multi-Invariant Coverage**: Zero ungrounded syntax in Stage C; all declared invariants derived in Section 2. #2026_09_24_01_group_1
    20. **Canonical Nouns with Plain Human Verbs, Editorial Division of Labor & Tangible Pedagogical Variety**: Every principle title and definition front-loads canonical platform terminology using simple everyday verbs, strictly banning inflated corporate/academic dressing. Each principle in the blueprint carries its `[principle-steps]` answers (`skills/v6.5/principle-definition/SKILL.md`), and its box follows from them: plain sentences by default (bullets only for two look-alike things the reader mixes up), what actually breaks, side notes whose phrases appear word for word in the definition, and the code pair inside the box for every `Kind: Decision` principle; the box is identical in the blueprint and the lecture, and reads like the principle boxes of Lectures 1 to 13. The prose derivation below the cards MUST provide concrete titled code blocks illustrating the physical machine trace (compiler output, evaluated expressions, browser renders, or syntax failures) anchored into the living benchmark of Lesson 04 (`01-02-md-LECTURES/v6/04.md`), selecting the pedagogical substrate that organically creates an "aha moment" without rigid cookie-cutter homogenization or numbered list quotas. Code comments must be written in clean natural English without markdown asterisks (`**...**`). Purely textual prose without code blocks under a principle is strictly forbidden. #2026_09_26_11_group_1 revised by #2026_09_26_12_group_1, #2026_09_26_13_group_1, #2026_09_26_15_group_1, #2026_09_26_16_group_1, #2026_09_26_18_group_1, #2026_10_04_09_group_1, #2026_10_04_10_group_1, and #2026_10_04_11_group_1
    21. **Zero-Gap Knowledge Flow & Commentary Quality**: All glossary terms and callouts are grounded in prior text; case studies provide meaningful pedagogical lessons instead of mechanical line recitation. #2026_09_25_03_group_1
    22. **Professional Idiom & Example Elegance**: Case study models an authentic, elegant component that a professional tutorial or senior engineer would design, capturing the essence of the mechanism while strictly avoiding contrived toy widgets, trivial 2-line helper files, or unnatural imports. #2026_09_25_05_group_1
    23. **Two-Map Scope & Principle Traceability**: Has `01-01-map/{nn}.md` been consulted for scope, has `01-01-map-principles/{nn}.md` been consulted for the exact principle set, does every lecture principle trace one-to-one to that approved map, and do the ledger's `Prerequisite`, `Preview`, and `Deferred` rows appear only as one-line recalls, one-sentence mentions that name the owner lesson, or not at all? Is every `New` JavaScript form in the map's Terms table with refresher `yes` explained where it first appears, and is no claim from the map's Open Issues quoted as fact? Does `node src/handout.mjs {nn}` show no open message for this lesson, and does each forward promise in the lecture have a `promise` message? #2026_09_25_06_group_1 revised by #2026_09_26_19_group_1, #2026_09_26_21_group_2, #2026_10_06_01_group_2, #2026_10_06_01_group_3, and #2026_10_06_02_group_5
    24. **Map Ownership & Authentic Contrasts**: Does each lecture principle stay within the decision its map entry owns, leaving decisions owned by other lessons to the ledger's `Prerequisite` and `Preview` rows, and do comparative anti-patterns represent authentic mistakes in this topic rather than generic strawmen? #2026_09_26_17_group_1 revised by #2026_09_26_19_group_1 and #2026_09_26_21_group_2

## Mechanical & Build Gates | 22 | Algorithmic Diagnostic Protocol #2026_09_21_07_group_1

- [ ] Has the author run the algorithmic diagnostic tool (`node src/diagnose-lecture.mjs <NN>`) before the final build to check comment density, sentence length profile, and line dimensions?
- [ ] Are diagnostic metrics used as informative indicators to prevent extreme drift (such as missing comments or overly long sentences)? #2026_09_21_07_group_1
