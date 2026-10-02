---
name: pre-lecture
description: Governs authoring the Phase 1 pre-lecture blueprint at 01-01-md-PRE-lectures/{nn}.md; use when a pre-lecture is about to be written or revised.
---

# Pre-Lecture

This skill governs authoring the Phase 1 pre-lecture blueprint at `01-01-md-PRE-lectures/{nn}.md`. The pre-lecture is the planning instrument that establishes the structural skeleton, causal explanation flow, atomic pre-elements, and authorized technical vocabulary before long-form writing in `01-02-md-LECTURES/{nn}.md` begins. Every principle below converts directly into planning decisions inside the blueprint: which atomic pre-element each bullet becomes, how code snippets are staged within line budgets, and how concepts are introduced and deconstructed.

Digests: `skills/old-instructions/PRE-LECTURE-INSTRUCTIONS.md` and `skills/old-instructions/instructions.md`.

## Methodology & Philosophy | 01 | The Blueprint is the First Iteration

[ ] Treat the pre-lecture blueprint as the primary planning instrument that guarantees maximum coherence. Every paragraph, code snippet, and visual panel must appear with an explicit causal justification for why it exists.
[ ] Lock the exact technical vocabulary authorized for the lecture: the production lecture introduces no technical terms outside those declared and mapped in the blueprint, preventing cognitive overload and terminology drift.
[ ] Follow the Blueprint-First Protocol: author, audit, and validate the blueprint in `01-01-md-PRE-lectures/{nn}.md` first. Enforce the 10-line code ceiling, continuation attributes, and figure references here before drafting the production lecture.
[ ] Ensure the blueprint is fully verified (including micro-step allocations and quality checks) before touching `01-02-md-LECTURES/`. The production pass then converts an approved architecture rather than improvising structure.

## Methodology & Philosophy | 02 | Grounding From Known Concepts to New Mechanics

[ ] Ground every new mechanism in foundational concepts the student already understands, establishing a clear bridge from the familiar to the unfamiliar.
[ ] Anchor form-state transitions in concrete browser reality: contrast the classic pain of manual `e.preventDefault()` (required to halt native full-page reloads that wipe memory) with modern React 19 form actions (which intercept submits automatically and provide structured `FormData`).
[ ] Grounding must be tactile and verifiable: explain what the user types, how the native browser buffer behaves, and how React processes the action.

## Methodology & Philosophy | 03 | Developer-at-the-Keyboard Stance

[ ] Write from the perspective of the developer sitting at the keyboard, guiding the reader step by step through files and screen behavior.
[ ] Use plain upper-intermediate English (CEFR B2), writing for a tired developer who demands thorough, interview-winning technical depth without unnecessary academic jargon.
[ ] Ground runtime concepts in the three-part explanation: (1) what you physically write in the file, (2) what manual boilerplate is eliminated, and (3) what the browser physically executes.
[ ] Avoid writing from the perspective of React's internal engine. Do not treat concepts as abstract compiler specifications; explain what appears in the reader's editor and browser.

## Methodology & Philosophy | 04 | Physical Reality First, Theory Second

[ ] Begin explanations with tangible physical reality: what the user sees on screen, what keys they touch, and what files exist on disk. Introduce abstract engine theory only after the physical behavior is established.
[ ] Anchor concepts to familiar physical items: an HTML tag paints elements on the screen; a JavaScript module is a file on disk; a component function returns a tree of descriptors.
[ ] Follow the fixed three-step explanation order:
    1. **Physical Markup**: What physically exists in the markup (such as an `<input name="title">` inside a `<form>`).
    2. **React Code**: How JavaScript binds or reads that markup (such as `formData.get("title")`).
    3. **Browser Consequence**: How the runtime resolves it (such as background transitions or automated input resets).

## Methodology & Philosophy | 05 | Structural Mirroring and Topic Fidelity #2026_09_21_02_group_1

[ ] Mirror the exact heading structure (`#`, `##`, `###`) of the final production lecture directly in the blueprint with zero intervening meta-headings.
[ ] Name files with matching question numbers and two-digit padding: `01-01-md-PRE-lectures/{nn}.md` (for example `01.md`, `02.md`, through `180.md`).
[ ] Dedicate each blueprint 100% to its assigned interview question from the question bank. Develop the specific domain scenario, components, and pipeline assigned to it without copying from adjacent lectures.
[ ] Enforce the Curriculum Dependency Invariant: strictly avoid premature syntax smuggling. Blueprint only concepts, hooks, and primitives authorized for or prior to the current question (e.g. zero `useState` before Q16, zero callback props/inverse data flow before Q15, zero `useEffect` before Q35).
[ ] Align with the lecture's pedagogical archetype: use Archetype A (Component-Driven Assembly) when teaching multi-component composition, and Archetype B (Project Scaffolding & System Architecture Deconstruction) when teaching project initialization, tooling, or runtime entry points.
[ ] Maintain one continuous line per bullet, paragraph, and table row with zero hard-wrapping and zero em-dashes.

## Technical Density & Grading | 06 | Paragraph Grading (★ and ◇)

[ ] Tag each `[p]` paragraph bullet at its head with its technical density:
    * `★`: Highly technical paragraphs covering runtime mechanics, engine behavior, and detailed state transitions.
    * `◇`: Highly conceptual paragraphs introducing core architectural paradigms or fundamental definitions.
    * Unmarked: Standard narrative connecting paragraphs.
[ ] Let the tag drive the instructional mode: `★` paragraphs require rigorous runtime narration and paired code snippets; `◇` paragraphs require grounded conceptual definitions with everyday real-world anchors.
[ ] Maintain a balanced mix across the lecture: a blueprint with zero `★` paragraphs teaches insufficient depth, while a blueprint with all `★` and no `◇` fails to ground its concepts.

## Technical Density & Grading | 07 | The Preknowledge Field and Recap Expansion

[ ] Prefix every `★` paragraph with a `{preknowledge:}` field enumerating the concrete prior concepts it relies upon (for example: native forms, text inputs, the name attribute, button submission).
[ ] Expand `{preknowledge:}` in the final text as an active recap in plain prose, pushing one physical detail further so the reader re-anchors their mental model before meeting the new mechanism.
[ ] State the `{bridging:}` gap only after the preknowledge baseline is established, explaining what the classic path cannot do and how the new mechanism resolves it.

[ ] PROPER EXAMPLE: make sure you follow this example, expanding preknowledge to a concrete physical detail:

> We know that a form is built from several elements, like input text fields, and each input is tied to a variable "name" that passes its data upward to the application state. Type h-e-l-l-o into that input one letter at a time, and with the old wiring the page reloads on every single keystroke, wiping the field before the word is finished.

Notes: Names the components first, then escalates to a concrete physical event (typing letter by letter, page reload per keystroke) before introducing the solution.

## Technical Density & Grading | 08 | One Concern Per Paragraph Bullet

[ ] Restrict each `[p]` bullet to a single distinct pedagogical concern:
    * One bullet for preknowledge and the problem symptom.
    * One bullet for the legacy or naive solution.
    * One bullet for the modern React solution and runtime consequence.
[ ] State the `{problem:}` as a concrete runtime symptom (such as typing triggering a page reload or state dropping out of sync), never as an abstract theoretical flaw.

[ ] COUNTER-EXAMPLE: do not follow this bad example, crushing all concerns into a single bullet:

> [p] ★ {preknowledge:} forms, inputs, the name variable, submission {problem:} every keystroke submits the form {old solution:} we used e.preventDefault and manual handlers {new solution:} form actions handle it

Notes: Four distinct concerns compressed into one bullet; none can be developed with sufficient depth or paired with necessary code.

## Technical Density & Grading | 09 | Pair Old Solutions with Real Code

[ ] Whenever a bullet references a legacy pattern or naive attempt (`{old solution:}`), pair it with a literal `[code]` block showing that approach (such as manual `e.preventDefault()`, per-keystroke handlers, or local state mirrors). Include an inline comment (`// ...`) directly on the line demonstrating the friction or failure point. If the code is flat-out WRONG (illegal syntax, compiler crash, runtime exception), lead the comment with `// **WRONG:** ...`; if syntactically valid but problematic, lead with an uppercase qualifier naming the flaw (such as `// **SLOW:** 45s freeze crawling all **FILES** into memory` or `// **FRAGILE:** misses unqueried **BADGE**`); if standard working code, author clean tag-free comments with an uppercase bold keyword. #2026_09_21_30_group_1 (refining #2026_09_21_18_group_1)
[ ] Order the comparison old solution first, new solution second, so the reader experiences the friction before the resolution.
[ ] Avoid discussing past patterns in abstract prose without showing the code: ungrounded references force the reader to guess what pattern is being criticized.

## Technical Density & Grading | 10 | Conceptual Paragraphs Lead From Known Ground

[ ] Structure conceptual (`◇`) paragraphs in three distinct moves:
    1. Open on solid ground the reader already understands (native HTML elements, plain JavaScript functions).
    2. Identify the specific engineering limitation or maintenance friction that arises.
    3. Introduce the new React category using its standard community name and an accessible definition.
[ ] Use standard industry nomenclature only; never invent private or idiosyncratic names for established concepts.

[ ] PROPER EXAMPLE: make sure you follow this example, leading from solid ground to a standard concept:

> In plain HTML, you structure documents using native HTML tags like `<header>`, `<article>`, and `<button>`. However, native HTML tags do not know anything about your application logic, your subscriber tiers, or your reader data. Traditionally, developers had to copy and paste chunks of HTML structure across templates and attach separate JavaScript scripts to add behavior. Every different page corresponded to a different .html file, and each file was a monolith of HTML markup, CSS style, and JavaScript. To solve this problem, modern web frameworks like React rely on the combination of isolated components like building blocks. It is much more effective to create isolated .jsx files and combine them together. Each component has its own HTML markup, CSS style, and logic.

Notes: Opens on familiar native HTML, explains the modularity problem, and introduces components using standard terms and a clear definition.

[ ] COUNTER-EXAMPLE: do not follow this bad example, inventing private jargon:

> To solve this problem, modern web frameworks like React rely on UI snappers: self-contained building pockets that snap your page together.

Notes: Replaces standard industry terminology ("components") with an invented term that will never appear in documentation or interviews.

## Pre-Element Taxonomy | 11 | Complete Atomic Pre-Element Tag Set

[ ] Tag every bullet in the blueprint with its specific pre-element type:
    * `[p]`: Prose paragraph, graded with `★` or `◇` where appropriate.
    * `[grounding]`: Real-world friction card compiling into a `> [!WILD]` alert box.
    * `[code]`: Literal, executable code block within the 10-line ceiling.
    * `[components]`: Rendered UI Canvas panel showing finished UI controls.
    * `[files]`: File Explorer panel showing the project disk hierarchy.
    * `[component-code]`: Component Architecture panel in role mode (with `[role:]` entries).
    * `[figure]`: Standalone HTML figure reference.
    * `[callout]`: Alert box (`> [!TIP]`, `> [!KEY]`, `> [!WARNING]`, `> [!CAUTION]`).
    * `[glossary]`: Glossary entry formatted with `Term ◼ Definition`.
    * `[comparison]`: Architectural comparison matrix.
    * `[beyond-basics]`: Advanced topic bullet under `## Beyond the basics` carrying a live, clickable link to the official website formatted as `(see [react.dev/...](https://react.dev/...))`. #2026_09_21_33_group_1
    * `[ladder-1]` through `[ladder-7]`: The 7 sequential opening beats.
    * Summary family: `[review-title]`, `[review-subtitle]`, `[numbered-review-point]`, `[never-rule]`, `[always-rule]`, `[if-then-rule]`, `[comparison-table]`.
[ ] Map the 7 ladder beats to the canonical opening sequence: `[ladder-1]` Scene, `[ladder-2]` Setup, `[ladder-3]` Surprising Action, `[ladder-4]` Question, `[ladder-5]` Danger, `[ladder-6]` Mystery, `[ladder-7]` Promise.
[ ] Plan `[glossary]` entries under `### Glossary` with 4 to 6 core terms formatted as `- [glossary] Term ◼ Plain-English definition and concrete engineering role.`

## Pre-Element Taxonomy | 12 | `[p]` Bullets Carry Substantive Derivations

[ ] Write `[p]` bullets as actual substantive arguments rather than meta-descriptions of what a paragraph will say.
[ ] Ground every derivation in physical reality: what the user sees, what keystrokes occur, and what the runtime executes.
[ ] Reject meta-phrasing (such as "Explains why developers wrote `e.preventDefault()`"): the blueprint must provide the reasoning so the lecture author expands verified substance rather than inventing arguments.

[ ] COUNTER-EXAMPLE: do not follow this bad example, meta-describing a paragraph:

> - [p] Explains that developers spent a decade writing `e.preventDefault()` before form actions existed.

Notes: Describes the paragraph from the outside without providing the technical rationale.

[ ] PROPER EXAMPLE: make sure you follow this example, carrying the actual argument:

> - [p] Developers wrote `e.preventDefault()` for a decade because the browser natively wants to navigate to a new URL on submit, executing a full-page reload that wipes all client state in memory, and the only defense was intercepting the event by hand. ◼ Educational objective: discharge the confusion around why the classic boilerplate existed at all; underline the physical reload consequence.

Notes: The substantive argument sits left of `◼`, and the pedagogical contract sits right of it.

## Pre-Element Taxonomy | 13 | The Real Code Law and the 10-Line Ceiling

[ ] Make every `[code]` pre-element an exact, runnable code block. Abstract pseudocode or verbal summaries of code are strictly disallowed in the blueprint.
[ ] Keep every code snippet at 10 or fewer executable lines. Slicing components longer than 10 lines across progressive micro-steps is mandatory.
[ ] Plan inline comments with uppercase bold keywords directly inside blueprint `[code]` elements: ensure every narrative code block (≥3 lines) includes planned end-of-line comments on load-bearing lines so comment density is verified before production authoring. #2026_09_21_30_group_1
[ ] Maintain file continuity across multi-step components using continuation attributes:
    * First snippet: `title="Name.jsx" startLine="1" continues="bottom"`
    * Middle snippets: `startLine="NN" continues="both"` (where `NN > 1`, continuing cumulative line count)
    * Final snippet: `startLine="NN" continues="top"` (where `NN > 1`, sealing the file)
[ ] Enforce the Non-Overlapping Continuation Law: Continuation fences must never repeat code or function signatures from preceding snippets. Each slice must start strictly on the next consecutive line number. #2026_09_21_31_group_1
[ ] Start every code snippet on its first line of executable code; never count leading blank lines in `startLine`.
[ ] Accompany every code snippet with a "what-this-introduces" list right of the `◼` enumerating every new token, hook, or prop introduced.

[ ] PROPER EXAMPLE: make sure you follow this example, a code block with its introduced tokens:

> - [code] App.jsx:
>
> ```jsx title="App.jsx"
> export default function App() {
>   return <EditionForm onPublish={handlePublishLetter} />; // parent mounts the boundary
> }
> ```
>
> ◼ **The what-this-introduces list:** 1. `EditionForm`: the child boundary receiving one prop. 2. `onPublish`: the connecting action prop carrying the submission pathway. 3. `return` with a single mounting tag: the lean parent shape.

Notes: Fully literal, stays within the line ceiling, and audits every introduced identifier.

## Pre-Element Taxonomy | 14 | Host Element Visibility

[ ] Whenever prose introduces a prop or event binding, the immediately following code snippet must render the host JSX element containing that prop (for example, `<form action={...}>` or `<button formAction={...}>`).
[ ] Pair handler or hook definitions with their host JSX elements in the same code window (within the 10-line budget) so the reader physically sees how the parts connect.
[ ] Avoid headless function declarations or isolated hook calls that fail to show the host markup they operate upon.
[ ] For historical or pre-React 19 comparisons, use an explicit conceptual title without a `.jsx` extension (such as `title="Historical Pattern"`).

## Practical Example Staging | 15 | Mandatory Five-Stage Blueprint Planning #2026_09_20_01_group_1 revised by #2026_09_20_04_group_7, #2026_09_20_05_group_1, and #2026_09_21_02_group_1

[ ] Plan the complete five-stage practical example matching the lecture's designated archetype:
    * **Archetype A (Component-Driven Practical Assembly)**:
        * **Stage A**: Rendered UI Canvas (`[components]`, snippet-free) followed by the File Explorer (`[files]`) introducing the disk hierarchy.
        * **Stage B**: Visual assembly pipeline figure (`[figure]` `figures/{NN}-01-code-assembly-pipeline.html`).
        * **Stage C**: 4 sequential collaborative assembly steps (`Step 1: First, we...` through `Step 4: Finally, we...`) assembled strictly top-down, with each step heading explicitly naming the target file (`ArticleCard.jsx`, `ArticleHeader.jsx`). #2026_09_21_10_group_1
        * **Stage D**: Component Summary section with the `[component-code]` role panel (`Summary: The Logic of Nested Components`) before the audit table.
        * **Stage E**: Concluding Architecture Audit Table figure (`[figure]` `figures/{NN}-02-architecture-audit.html`).
    * **Archetype B (Project Scaffolding & System Architecture Deconstruction)**:
        * **Stage A**: Rendered application destination / starter terminal output (`[components]`, snippet-free) followed by the File Explorer (`[files]`) introducing the scaffolded disk hierarchy.
        * **Stage B**: Scaffolding and execution pipeline figure (`[figure]` `figures/{NN}-01-code-assembly-pipeline.html`).
        * **Stage C**: 4 sequential collaborative steps deconstructing project initialization and anatomy: Step 1 scaffolding CLI invocation, Step 2 project manifest and build configuration, Step 3 HTML and JavaScript entry points, Step 4 starter component and client-side rendering model.
        * **Stage D**: Component Summary section with the `[component-code]` role panel (`Summary: Project Architecture & File Hierarchy`) deconstructing core architecture files before the audit table.
        * **Stage E**: Concluding Architecture Audit Table figure (`[figure]` `figures/{NN}-02-architecture-audit.html` contrasting toolchains and rendering strategies).
[ ] For Archetype A, plan Stage C as a strict top-down construction: Step 1 builds the parent container and declares child prop interfaces in JSX before child files exist; subsequent steps build child components to fulfill those props; the final step seals the deepest boundary. #2026_09_20_04_group_7 revised by #2026_09_20_26_group_1

## Practical Example Staging | 16 | Step Bullets Carry Narration in Substance #2026_09_20_04_group_7 revised by #2026_09_21_02_group_1

[ ] Write each Stage C `[p]` bullet to carry the actual instructional beats rather than a vague summary of the step:
    1. The notice-move pointing to a specific line, prop, attribute, command flag, or configuration key.
    2. The props, attributes, exports, or flags being unpacked.
    3. The warning charged with its physical runtime consequence.
    4. The inline alternative where a simpler option exists.
    5. The closing architectural takeaway.
[ ] In Archetype A lectures, plan callback invocations in step bullets using the Upward Wire circuit: identify callback origin in the parent, explain that the child holds a communication line with zero local state, trace parent memory execution, and name inverse data flow. #2026_09_20_06_group_1
[ ] In Archetype A lectures, plan architectural separation using the Negative Counterfactual circuit: pose provocation question, describe the concrete disaster of merging responsibilities, state physical invariants (`zero useState, zero useEffect`), and provide symmetric refactoring proofs. #2026_09_20_07_group_1
[ ] In Archetype B lectures, plan file and tooling deconstructions: deconstruct CLI arguments, separate runtime dependencies from build tooling devDependencies, explain browser native ESM script resolution (`type="module"`), trace root DOM attachment (`createRoot`), and analyze client-side rendering boundaries with zero premature hook smuggling. #2026_09_21_02_group_1

[ ] PROPER EXAMPLE: make sure you follow this example, a step bullet carrying substantive narration:

> - [p] Step 2 receives the props: Notice the destructured `{ query, onChange }` matching the props passed in Step 1; the two critical props are `value={query}`, which locks the displayed text strictly to React, and `onChange`, which forwards each typed character upward to `setQuery` in the parent; Mind you, leaving the input alone is easier in plain HTML, but binding `value` without an `onChange` handler locks the field read-only; recap: data flows down from the parent through `query`, and user events flow up through `onChange`. ◼ Narration planned in substance: notice-move, both props, the warning charge, the alternative, the recap.

Notes: The bullet contains all five instructional beats, allowing the production author to expand directly into prose without improvising structure.

## Grounding & Vocabulary | 17 | The `[grounding]` Friction Card (⚡ IN THE WILD)

[ ] Include a dedicated `[grounding]` card in every major technical section to isolate and resolve the single most common counter-intuitive friction point students encounter.
[ ] Finish teaching the concept before planning a `[grounding]` card: place the card at the end of the topic. The blueprint must first plan the broken attempt, explain why it failed, state the rule, and show the working code. Never drop a `[grounding]` card between a broken code snippet and the explanation that fixes it. #2026_09_21_03_group_1 revised by #2026_09_21_08_group_1 and #2026_09_21_09_group_1
[ ] Ground the question in earlier text: the opening question (6 to 9 words) must target a trap the reader already saw resolved. Never introduce new terms or rules inside the card before the main text explains them. #2026_09_21_08_group_1 revised by #2026_09_21_09_group_1
[ ] Structure every `[grounding]` bullet with the complete 5-part anatomy:
    1. **Opening Question**: A short, catchy, bold question of 6 to 9 words naming the friction point (such as `**When does submitting a form wipe your screen?**`).
    2. **Friction Target**: The specific confusion, timing trap, or counter-intuitive mechanism being resolved.
    3. **Tactile Scene**: A familiar, everyday scenario with intentional repetition, concrete human actors, and unhurried alternative staging (stage all hypothetical and analytical scenarios one by one; ban compound "X or Y" cramming; use "Alternatively, what if..."). #2026_09_21_06_group_1
    4. **Key Terms**: Mandatory bolding of clarified load-bearing terms (`**physical DOM**`, `**virtual DOM**`).
    5. **Resolution**: Concrete operational decision criteria (SEO/indexing requirements, private tools behind login, server hosting overhead) delivering an immediate aha moment without circular tautologies. #2026_09_21_06_group_1
[ ] Vary opening question words (What, When, Where, Why) across cards in a lecture to prevent repetitive phrasing.

## Grounding & Vocabulary | 18 | Dual-Canon Nomenclature and Standard Vocabulary

[ ] Whenever describing a technical pattern, data structure, or runtime event, provide the complete dual-canon terminology:
    1. The classic industry-standard term used by interviewers (`virtual DOM`, `prop drilling`, `synthetic events`).
    2. The official modern documentation term from `react.dev` (`UI descriptor tree`, `React elements`, `context propagation`).
    3. The concrete physical reality in plain English (plain JavaScript objects in memory).
    4. Bold formatting on first introduction.
[ ] Use standard React vocabulary only. Never invent pseudo-academic buzzwords or reify common habits into fake proper nouns (avoid terms like "controlled form illusion" or "keystroke tracking fatigue").
[ ] Ban "presenter" jargon: call every UI building block a component. Never use "presenter", "header presenter", or "pure presenter". Stick to standard React terms: "parent component", "child component", or the exact file name. #2026_09_21_10_group_1
[ ] Use genealogical component nomenclature: `parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, or `terminal UI control`. Avoid data-structure terms like "leaf component".

## Pre-Flight Verification Gate | 19 | Blueprint Verification Checklist #2026_09_21_02_group_1

[ ] Before proceeding to Phase 2 production authoring, verify that the blueprint satisfies every quality gate:
    1. **Structural Mirror**: The blueprint headings match the final lecture skeleton 1:1.
    2. **Curriculum Dependency Invariant**: Zero premature syntax smuggling; hooks and patterns strictly adhere to question order.
    3. **Archetype Alignment**: Stages A through E and Stage D title correctly align with Archetype A or Archetype B.
    4. **Literal Code Blocks**: Every `[code]` pre-element contains runnable code adhering strictly to the 10-line ceiling and continuation attributes.
    5. **Zero Unexplained Tokens**: Every code snippet includes a what-this-introduces list with all identifiers audited.
    6. **Substantive Arguments**: All `[p]` bullets carry actual technical derivations left of `◼`, with zero meta-phrasing.
    7. **Technical Grading**: Every `★` paragraph opens with a preknowledge recap, and every `{old solution:}` is paired with literal code.
    8. **Five-Stage Staging**: Stages A through E are planned as concrete pre-elements with top-down Top-Down Assembly in Stage C.
    9. **Step Narration in Substance**: Every Stage C step bullet contains notice-moves, unpacked tokens/props, warnings with physical consequences, and recaps.
    10. **Archetype Circuits**: For Archetype A, Upward Wire and Counterfactual circuits are planned; for Archetype B, tooling and entry-point mechanics are deconstructed without premature hooks.
    11. **Grounding Card Anatomy**: Every major technical section includes a `[grounding]` card with a 6–9 word bold question and aha resolution.
    12. **Dual-Canon Terminology**: Load-bearing mechanisms carry both classic industry terms and modern official terminology.
    13. **Component & File Naming**: Files and components use everyday vocabulary and standard architectural roles.
    14. **Formatting Discipline**: Exactly one continuous line per bullet, zero hard-wrapping, zero em-dashes, and valid figure `src` paths.
    15. **Beyond the Basics Planning**: Exactly 4 to 6 authoritative bullets planned under `## Beyond the basics` carrying active, clickable official website links (`https://react.dev/...`) before the Summary; local filesystem paths and GitHub links are forbidden. #2026_09_21_33_group_1
