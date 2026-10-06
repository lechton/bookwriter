---
name: pre-lecture
description: Governs authoring the Phase 1 pre-lecture blueprint at 01-01-md-PRE-lectures/<version>/{nn}.md (default latest version, e.g. v1); use when a pre-lecture is about to be written or revised.
---

# Pre-Lecture

This skill governs authoring the Phase 1 pre-lecture blueprint at `01-01-md-PRE-lectures/<version>/{nn}.md` (targeting the latest version subfolder by default). The pre-lecture is the planning instrument that establishes the structural skeleton, causal explanation flow, atomic pre-elements, and authorized technical vocabulary before long-form writing in `01-02-md-LECTURES/<version>/{nn}.md` begins. Every principle below converts directly into planning decisions inside the blueprint: which atomic pre-element each bullet becomes, how code snippets are staged within line budgets, and how concepts are introduced and deconstructed. #2026_09_24_05_group_1

Digests: `skills/old-instructions/PRE-LECTURE-INSTRUCTIONS.md` and `skills/old-instructions/instructions.md`.

## Methodology & Philosophy | 01 | The Blueprint as the First Iteration

- [ ] Is the pre-lecture blueprint treated as the primary planning instrument that guarantees maximum coherence, providing an explicit causal justification for every paragraph, snippet, and panel?
- [ ] Is the exact technical vocabulary authorized for the lecture locked in the blueprint, preventing terminology drift in the production lecture?
- [ ] Is the Blueprint-First Protocol followed: authoring, auditing, and validating the blueprint in `01-01-md-PRE-lectures/<version>/{nn}.md` (targeting the latest version by default) before drafting the production lecture? #2026_09_24_05_group_1
- [ ] Is the blueprint fully verified (including micro-step allocations and quality checks) before touching `01-02-md-LECTURES/<version>/`, ensuring production converts an approved architecture rather than improvising structure? #2026_09_24_05_group_1

## Methodology & Philosophy | 01B | Mandatory Step 0: Curriculum and Principle Map Consultation #2026_09_25_06_group_1 revised by #2026_09_25_07_group_1 and #2026_09_26_19_group_1

- [ ] Is `01-01-map/{nn}.md` consulted as Mandatory Step 0 before authoring or auditing any pre-lecture blueprint? #2026_09_25_06_group_1
- [ ] Are the six authoritative syllabus dimensions extracted directly from `01-01-map/{nn}.md`: (1) Topic Tag, (2) Core Truth, (3) The Friction, (4) The Mechanism, (5) Under the Hood, and (6) The Code Experiment? #2026_09_25_06_group_1
- [ ] Is the approved `01-01-map-principles/{nn}.md` consulted for the exact principle selection and order, while the assembly step count remains derived from the source map's authentic experiment topology? #2026_09_26_19_group_1
- [ ] Does the blueprint follow the map's candidate ledger for everything that is not a principle, planning `Supporting` rows as theory prose inside the section or principle they support, `Prerequisite` rows as one-line recalls that name the owner lesson, `Preview` rows as at most one sentence that names the owner lesson, and keeping `Deferred` rows out of the lesson? #2026_09_26_21_group_2
- [ ] Does the blueprint follow the map's `## Terms` table? Plan a sentence or two of explanation where a `New` JavaScript form with refresher `yes` first appears, and recall `Recall` terms without explaining them again. #2026_10_06_01_group_2
- [ ] When blueprinting reveals a gap in the map, such as an important decision the ledger lacks or a Required Lesson Proof the scope cannot produce, is the gap reported for a map revision instead of patched into the blueprint? #2026_09_26_21_group_2
- [ ] Is the lesson's inbox read with `node src/handout.mjs {nn}` before blueprinting? Is every open message with stage `lecture` planned into the blueprint and closed with `node src/handout.mjs close {id} --status done --resolution "..."`, naming the section that carries it, or closed as `declined` with the reason? #2026_10_06_02_group_5
- [ ] When the blueprint promises that a later lesson will show something, or finds an error in an earlier lesson, is a message sent with `node src/handout.mjs add` (kind `promise` or `correction`, see `map-principles` Section 11B) instead of left only in the prose? #2026_10_06_02_group_5
- [ ] Is the `Scope Boundary` strictly enforced as a pedagogical ceiling, ensuring the blueprint does NOT introduce forward concepts, syntax, or architectural structures explicitly scoped out for that question (e.g. no props, no curly brace expressions, and no multi-file trees when scoped out for foundational component lessons)? #2026_09_25_06_group_1
- [ ] Does the planned practical example isolate the single assigned mechanism without forward concept bleeding or premature syntax smuggling, preventing knowledge gaps in adjacent lectures? #2026_09_25_06_group_1

- [ ] PROPER EXAMPLE: Step 0 syllabus and scope boundary consultation:
> Before blueprinting Q02 (*Component Anatomy*), the author reads `01-01-map/02.md`, notes the scope boundary ("Focus strictly on the single component function, its capitalization, its pure return contract, and declarative invocation (<Card /> vs Card()). Do not introduce props, curly brace expressions, or multi-file trees."), and designs a 2-step single-component example (`ArticleCard.jsx` and its declarative mount in `App.jsx`) with static copy, deferring props to Q06.

- [ ] HALF WAY EXAMPLE: Reading the question title but ignoring the scope boundary:
> The author reads the interview question in `01-01-map/02.md` ("What is a React component..."), notices that components can take props, and blueprints a complex parent-child hierarchy passing destructured props, unaware that props and curly brace interpolation are formally introduced in subsequent lessons (Q04 and Q06).

- [ ] COUNTER-EXAMPLE: Bypassing `01-01-map/` entirely:
> The author starts writing `01-01-md-PRE-lectures/v3/02.md` directly from general React intuition, inventing a multi-file widget with callback handlers and state hooks, creating massive forward concept bleeding and severe knowledge gaps for students progressing sequentially through the bank.

Notes: `01-01-map/` is the curriculum syllabus that establishes the progression order across the 180 questions. Consulting its `Scope Boundary` is mandatory before designing code experiments or outlines. #2026_09_25_06_group_1

## Methodology & Philosophy | 02 | Grounding From Known Concepts to New Mechanics

- [ ] Is every new mechanism grounded in foundational concepts the student already understands, establishing a clear bridge from the familiar to the unfamiliar?
- [ ] Are form-state transitions anchored in concrete browser reality: contrasting the classic pain of manual `e.preventDefault()` (required to halt native full-page reloads that wipe memory) with modern React 19 form actions (which intercept submits automatically and provide structured `FormData`)?
- [ ] Is grounding tactile and verifiable: explaining what the user types, how the native browser buffer behaves, and how React processes the action?

## Methodology & Philosophy | 03 | Developer-at-the-Keyboard Stance

- [ ] Is the blueprint written from the perspective of the developer sitting at the keyboard, guiding the reader step by step through files and screen behavior?
- [ ] Does the text use plain upper-intermediate English (CEFR B2), writing for a tired developer who demands thorough technical depth without unnecessary academic jargon?
- [ ] Are runtime concepts grounded in the three-part explanation: (1) what you physically write in the file, (2) what manual boilerplate is eliminated, and (3) what the browser physically executes?
- [ ] Does the stance focus on what appears in the reader's editor and browser, avoiding abstract compiler specifications?

## Methodology & Philosophy | 04 | Physical Reality First, Theory Second

- [ ] Do explanations begin with tangible physical reality: what the user sees on screen, what keys they touch, and what files exist on disk, before introducing abstract engine theory?
- [ ] Are concepts anchored to familiar physical items: an HTML tag paints elements on the screen; a JavaScript module is a file on disk; a component function returns a tree of descriptors?
- [ ] Is the three-step explanation order followed:
    1. **Physical Markup**: What physically exists in the markup (such as an `<input name="title">` inside a `<form>`).
    2. **React Code**: How JavaScript binds or reads that markup (such as `formData.get("title")`).
    3. **Browser Consequence**: How the runtime resolves it (such as background transitions or automated input resets).

## Methodology & Philosophy | 05 | Structural Mirroring and Topic Fidelity #2026_09_21_02_group_1

- [ ] Does the blueprint mirror the exact heading structure (`#`, `##`, `###`) of the final production lecture directly, with zero intervening meta-headings?
- [ ] Are files named with matching question numbers and two-digit padding: `01-01-md-PRE-lectures/{nn}.md` (for example `01.md`, `02.md`, through `180.md`)?
- [ ] Is each blueprint dedicated 100% to its assigned interview question from the bank, developing the specific domain scenario, components, and pipeline without copying from adjacent lectures?
- [ ] Is premature syntax smuggling avoided, blueprinting only concepts, hooks, and primitives authorized for or prior to the current question (e.g. in `questions/questions.md` Version 3: zero `useState` before Q14, zero callback props/inverse data flow before Q13, zero `useEffect` before Q31)? #2026_10_05_04_group_1
- [ ] Does the blueprint plan complete theoretical introduction sections (`### ...`, such as *What is a React Component?* or *The Three Trees Model*) before planning `### Principles of React: {Topic}`? #2026_09_25_03_group_1
- [ ] Does the blueprint allocate exactly one `[principle]` element for every approved entry in `01-01-map-principles/{nn}.md`, preserving its order and planning its Required Lesson Proof, without independently adding, merging, or rediscovering principles? #2026_09_26_19_group_1 revised by #2026_09_26_21_group_2
- [ ] Is each principle planned as an optional `[principle-notes]` element followed by the finished `> [!PRINCIPLE]` callout (written under `principle-definition/SKILL.md` and its casebook, ending with its code pair)? Phase 2 copies the callout unchanged and leaves the notes in the blueprint. #2026_10_04_09_group_1 revised by #2026_10_04_10_group_1, #2026_10_04_11_group_1, and #2026_10_06_04_group_3
- [ ] Is every bullet, paragraph, and table row authored as a single continuous line without manual line breaks or em-dashes?
- [ ] Does the document maintain pure HTML/Markdown standards: using unicode glyphs (`→`, `≤`) and inline code spans (`` `y = f(x)` ``) rather than raw LaTeX syntax? #2026_09_22_09_group_1

## Technical Density & Grading | 06 | Paragraph Grading (★ and ◇)

- [ ] Is each `[p]` paragraph bullet tagged at its head with its technical density:
    * `★`: Highly technical paragraphs covering runtime mechanics, engine behavior, and detailed state transitions.
    * `◇`: Highly conceptual paragraphs introducing core architectural paradigms or fundamental definitions.
    * Unmarked: Standard narrative connecting paragraphs.
- [ ] Does the tag drive the instructional mode: `★` paragraphs pairing runtime narration with code snippets; `◇` paragraphs providing grounded conceptual definitions with everyday real-world anchors?
- [ ] Is a balanced mix maintained across the lecture, ensuring sufficient technical depth alongside conceptual clarity?

## Technical Density & Grading | 07 | The Preknowledge Field and Recap Expansion

- [ ] Does every `★` paragraph begin with a `{preknowledge:}` field enumerating the concrete prior concepts it relies upon (such as native forms, text inputs, the name attribute, button submission)?
- [ ] Is `{preknowledge:}` expanded in the text as an active recap in plain prose, pushing one physical detail further so the reader re-anchors their mental model before meeting the new mechanism?
- [ ] Is the `{bridging:}` gap stated only after the preknowledge baseline is established, explaining what the classic path cannot do and how the new mechanism resolves it?

- [ ] PROPER EXAMPLE: Expanding preknowledge to a concrete physical detail:

> We know that a form is built from several elements, like input text fields, and each input is tied to a variable "name" that passes its data upward to the application state. Type h-e-l-l-o into that input one letter at a time, and with the old wiring the page reloads on every single keystroke, wiping the field before the word is finished.

Notes: Names the components first, then escalates to a concrete physical event (typing letter by letter, page reload per keystroke) before introducing the solution.

## Technical Density & Grading | 08 | One Concern Per Paragraph Bullet

- [ ] Is each `[p]` bullet restricted to a single distinct pedagogical concern:
    * One bullet for preknowledge and the problem symptom.
    * One bullet for the legacy or naive solution.
    * One bullet for the modern React solution and runtime consequence.
- [ ] Is the `{problem:}` stated as a concrete runtime symptom (such as typing triggering a page reload or state dropping out of sync), avoiding abstract theoretical flaws?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Compressing multiple concerns into a single bullet:

> [p] ★ {preknowledge:} forms, inputs, the name variable, submission {problem:} every keystroke submits the form {old solution:} we used e.preventDefault and manual handlers {new solution:} form actions handle it

Notes: Four distinct concerns compressed into one bullet; none can be developed with sufficient depth or paired with necessary code.

## Technical Density & Grading | 09 | Pairing Old Solutions with Real Code

- [ ] Whenever a bullet references a legacy pattern or naive attempt (`{old solution:}`), is it paired with a literal `[code]` block showing that approach?
- [ ] Does the legacy code snippet include an inline comment demonstrating the friction or failure point (leading with `// **WRONG:** ...` for broken code, or uppercase qualifiers like `// **SLOW:**` / `// **FRAGILE:**` for flawed code)? #2026_09_21_30_group_1 (refining #2026_09_21_18_group_1)
- [ ] Is the comparison ordered with the old solution first and the new solution second, so the reader experiences the friction before the resolution?
- [ ] Does the text avoid discussing past patterns in abstract prose without showing code?

## Technical Density & Grading | 10 | Conceptual Paragraphs Lead From Known Ground

- [ ] Do conceptual (`◇`) paragraphs open on solid ground the reader already understands, identify the specific engineering limitation, and introduce the new React category using standard community nomenclature?
- [ ] Does the text stick to standard industry terminology, avoiding private or invented terms?
- [ ] **Probabilistic Framing of Naive Attempts in Planning**: When planning `{problem:}` or naive developer patterns (`{old solution:}`), does the blueprint frame them as realistic, empathetic scenarios (e.g. *"a junior developer may fall into this trap..."*, *"it is possible that a student of React may assume X because of Y..."*, *"we sometimes see developers make this mistake..."*) rather than asserting absolute claims about what beginners always do? Does the blueprint plan the intuitive motivation behind the naive attempt, starting from the map's `Tempting Belief`, so the downstream lecture validates the reader's thought process? #2026_09_27_05_group_1 revised by #2026_10_06_01_group_1

- [ ] PROPER EXAMPLE: Leading from solid ground to a standard concept:

> In plain HTML, you structure documents using native HTML tags like `<header>`, `<article>`, and `<button>`. However, native HTML tags do not know anything about your application logic, your subscriber tiers, or your reader data. Traditionally, developers had to copy and paste chunks of HTML structure across templates and attach separate JavaScript scripts to add behavior. Every different page corresponded to a different .html file, and each file was a monolith of HTML markup, CSS style, and JavaScript. To solve this problem, modern web frameworks like React rely on the combination of isolated components like building blocks. It is much more effective to create isolated .jsx files and combine them together. Each component has its own HTML markup, CSS style, and logic.

Notes: Opens on familiar native HTML, explains the modularity problem, and introduces components using standard terms and a clear definition.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Inventing private jargon instead of standard terms:

> To solve this problem, modern web frameworks like React rely on UI snappers: self-contained building pockets that snap your page together.

Notes: Replaces standard industry terminology ("components") with an invented term that will never appear in documentation or interviews.

## Pre-Element Taxonomy | 11 | Complete Atomic Pre-Element Tag Set

- [ ] Is every bullet in the blueprint tagged with its specific pre-element type:
    * `[p]`: Prose paragraph, graded with `★` or `◇` where appropriate.
    * `[grounding]`: Real-world friction card compiling into a `> [!WILD]` alert box.
    * `[code]`: Literal, executable code block within the 10-line ceiling.
    * `[components]`: Rendered UI Canvas panel showing finished UI controls with 1-to-1 component file parity and flat element tags. #2026_09_26_04_group_1
    * `[files]`: File Explorer panel showing the project disk hierarchy.
    * `[component-code]`: Component Architecture panel in role mode (with `[role:]` entries).
    * `[principle-notes]`: Free notes behind one principle (what the reader expects, what the proofs show, the casebook case it learned from), placed directly before its `> [!PRINCIPLE]` callout; blueprint-only, never carried into the lecture. #2026_10_04_10_group_1 revised by #2026_10_06_04_group_3 and #2026_10_06_05_group_4
    * `[figure]`: Standalone HTML figure reference.
    * `[callout]`: Alert box (`> [!TIP]`, `> [!KEY]`, `> [!WARNING]`, `> [!CAUTION]`).
    * `[glossary]`: Glossary entry formatted with `Term ◼ Definition`.
    * `[comparison]`: Architectural comparison matrix.
    * `[beyond-basics]`: Advanced topic bullet under `## Beyond the basics` carrying a live link to the official documentation `(see [react.dev/...](https://react.dev/...))`. #2026_09_21_33_group_1
    * `[ladder-1]` through `[ladder-7]`: The 7 sequential opening beats.
    * Summary family: `[review-title]`, `[review-subtitle]`, `[numbered-review-point]`, `[never-rule]`, `[always-rule]`, `[if-then-rule]`, `[comparison-table]`.
- [ ] Do the 7 ladder beats follow the canonical opening sequence: `[ladder-1]` Scene, `[ladder-2]` Setup, `[ladder-3]` Surprising Action, `[ladder-4]` Question, `[ladder-5]` Danger, `[ladder-6]` Mystery, `[ladder-7]` Promise?
- [ ] Are `[glossary]` entries planned under `### Glossary` with 4 to 6 core terms formatted as `- [glossary] Term ◼ Plain-English definition and concrete engineering role.`?

## Pre-Element Taxonomy | 12 | `[p]` Bullets Carry Substantive Derivations

- [ ] Are `[p]` bullets written as actual substantive arguments rather than meta-descriptions of what a paragraph will say?
- [ ] Is every derivation grounded in physical reality: what the user sees, what keystrokes occur, and what the runtime executes?
- [ ] Does the text avoid meta-phrasing (such as "Explains why developers wrote `e.preventDefault()`"), ensuring the blueprint provides the reasoning directly?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Meta-describing a paragraph:

> - [p] Explains that developers spent a decade writing `e.preventDefault()` before form actions existed.

Notes: Describes the paragraph from the outside without providing the technical rationale.

- [ ] PROPER EXAMPLE: Carrying substantive argument and educational objective:

> - [p] Developers wrote `e.preventDefault()` for a decade because the browser natively wants to navigate to a new URL on submit, executing a full-page reload that wipes all client state in memory, and the only defense was intercepting the event by hand. ◼ Educational objective: discharge the confusion around why the classic boilerplate existed at all; underline the physical reload consequence.

Notes: The substantive argument sits left of `◼`, and the pedagogical contract sits right of it.

## Pre-Element Taxonomy | 13 | Real Code, Natural Comments, and the 10-Line Ceiling #2026_09_21_30_group_1 revised by #2026_10_03_04_group_1 #2026_10_03_05_group_1 #2026_10_04_01_group_1

- [ ] Does every `[code]` pre-element contain exact, runnable code, avoiding abstract pseudocode or verbal summaries?
- [ ] Does every code snippet stay within 10 executable lines, slicing components longer than 10 lines across progressive micro-steps?
- [ ] **Natural Comments without Tildes**: Are inline comments in `[code]` elements written as natural, conversational human explanations of purpose or consequence, strictly omitting `~target~` tildes during blueprinting? Detecting focal tokens and positioning speech bubble pointers is deferred entirely to the secondary audit pass. #2026_10_04_01_group_1
- [ ] Are comments formulated as complete, natural 4-to-8-word mini-clauses, strictly avoiding 1-word or 2-word telegram shorthand (such as "Click", "Input", "Bound", or "Submit")? #2026_10_03_05_group_1
- [ ] Are comparative summary blocks (`right`/`wrong`) planned strictly comment-free, reserving comments for explanatory bodies? #2026_10_03_04_group_1
- [ ] Is file continuity maintained across multi-step components using continuation attributes:
    * First snippet: `title="Name.jsx" startLine="1" continues="bottom"`
    * Middle snippets: `startLine="NN" continues="both"` (where `NN > 1`, continuing cumulative line count)
    * Final snippet: `startLine="NN" continues="top"` (where `NN > 1`, sealing the file)
- [ ] Do continuation fences avoid repeating code or function signatures from preceding snippets, starting strictly on the next consecutive line number? #2026_09_21_31_group_1
- [ ] Does every code snippet start on its first line of executable code, avoiding leading blank lines in `startLine`?
- [ ] Does every code snippet accompany a what-this-introduces list right of the `◼` enumerating every new token, hook, or prop introduced?

- [ ] PROPER EXAMPLE: Literal code block with targeted comment and what-this-introduces list:

> - [code] App.jsx:
>
> ```jsx title="App.jsx"
> export default function App() {
>   return <EditionForm onPublish={handlePublishLetter} />; // Passes submission handler downward to boundary
> }
> ```
>
> ◼ **The what-this-introduces list:** 1. `EditionForm`: the child boundary receiving one prop. 2. `onPublish`: the connecting action prop carrying the submission pathway. 3. `return` with a single mounting tag: the lean parent shape.

Notes: Fully literal, stays within the line ceiling, carries a plain trailing comment with zero tildes, and audits every introduced identifier. #2026_10_04_10_group_1

## Pre-Element Taxonomy | 13B | Principle Notes Before a Principle Box #2026_10_04_10_group_1 revised by #2026_10_06_04_group_3

- [ ] When a principle needed thought, does a `[principle-notes]` element before its box say, in a few plain lines, what the reader expects, what actually happens (from the verified proofs), and which casebook move the box takes? The notes have no fixed fields; they exist so a reviewer can see the reasoning before the lecture is written. #2026_10_06_04_group_3

- [ ] PROPER EXAMPLE: Notes followed by the box they explain: #2026_10_06_04_group_3

> - [principle-notes] Principle 2: The reader has just seen that changing a variable does not change the screen. They have never thought about how often React runs a component, so the box must state that fact first. The proof shows `count` back at 0 after the component runs again. Cause, in the reader's JavaScript: running a component calls its function from the first line, so `let count = 0` runs again. Move from casebook Case 2: basic fact first, then the line that runs again, then the rule.
>
> > [!PRINCIPLE]
> > **Principle 2: Each Run of a Component Starts Its Variables Over**
> > React runs a component more than once: every time the screen must change. Each time, it calls the component's function again from its first line. So `let count = 0` runs again, and `count` is back to 0, whatever it held before. A plain variable inside a component never lasts from one run to the next.
> >
> > *We should do this:*
> > `function Counter() {`
> > `  const [count, setCount] = useState(0); // keeps its value`
> > `  return <p>{count}</p>;`
> > `}`
> >
> > *We should not do this:*
> > `function Counter() {`
> > `  let count = 0; // back to 0 on every run`
> > `  return <p>{count}</p>;`
> > `}`

Notes: The notes record the reader's expectation and the proof, so the reviewer can check the box against both. #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Notes that only label (*"Shape: prose. Defect: the bug. Terms: checked."*). Notes: They carry no reasoning, so nothing in the box can be checked against them. #2026_10_06_04_group_3

## Pre-Element Taxonomy | 14 | Host Element Visibility

- [ ] When prose introduces a prop or event binding, does the immediately following code snippet render the host JSX element containing that prop (such as `<form action={...}>` or `<button formAction={...}>`)?
- [ ] Are handler or hook definitions paired with their host JSX elements in the same code window (within the 10-line budget) so the reader physically sees how the parts connect?
- [ ] Are headless function declarations or isolated hook calls avoided?
- [ ] For historical or pre-React 19 comparisons, is an explicit conceptual title used without a `.jsx` extension (such as `title="Historical Pattern"`)?

## Practical Example Staging | 15 | Five-Stage Blueprint Planning #2026_09_20_01_group_1 revised by #2026_09_20_04_group_7, #2026_09_20_05_group_1, #2026_09_21_02_group_1, and #2026_09_25_05_group_1

- [ ] Does the practical example plan an authentic, elegant component that a professional tutorial or senior staff engineer would design, capturing the genuine essence of the mechanism while strictly avoiding contrived toy widgets or artificial multi-file shredding? #2026_09_25_05_group_1
- [ ] Is the complete five-stage practical example planned to match the lecture's designated archetype:
    * **Archetype A (Component-Driven Practical Assembly)**:
        * **Stage A**: Rendered UI Canvas (`[components]`, snippet-free) followed by the File Explorer (`[files]`) introducing the disk hierarchy.
        * **Stage B**: Visual assembly pipeline figure (`[figure]` `figures/{NN}-01-code-assembly-pipeline.html` with cards matching the 2 to 4 planned steps).
        * **Stage C**: 2 to 4 organic sequential collaborative assembly steps ($N \in \{2, 3, 4\}$, e.g. `Step 1: First...` through `Step 2/3/4: Finally...`) assembled top-down, with each step heading explicitly naming the target file (`ArticleCard.jsx`, `ArticleHeader.jsx`). #2026_09_21_10_group_1 revised by #2026_09_25_05_group_1
        * **Stage D**: Component Summary section with the `[component-code]` role panel (`Summary: The Logic of Nested Components`) before the audit table.
        * **Stage E**: Concluding Architecture Audit Table figure (`[figure]` `figures/{NN}-02-architecture-audit.html`).
    * **Archetype B (Project Scaffolding & System Architecture Deconstruction)**:
        * **Stage A**: Rendered application destination / starter terminal output (`[components]`, snippet-free) followed by the File Explorer (`[files]`) introducing the scaffolded disk hierarchy.
        * **Stage B**: Scaffolding and execution pipeline figure (`[figure]` `figures/{NN}-01-code-assembly-pipeline.html`).
        * **Stage C**: 2 to 4 sequential collaborative steps deconstructing project initialization and anatomy (e.g. Step 1 scaffolding CLI invocation, Step 2 project manifest and build configuration, Step 3 HTML and JavaScript entry points, Step 4 starter component and client-side rendering model).
        * **Stage D**: Component Summary section with the `[component-code]` role panel (`Summary: Project Architecture & File Hierarchy`) deconstructing core architecture files before the audit table.
        * **Stage E**: Concluding Architecture Audit Table figure (`[figure]` `figures/{NN}-02-architecture-audit.html` contrasting toolchains and rendering strategies).
- [ ] For Archetype A, is Stage C planned as a top-down construction: Step 1 building the parent container and declaring child prop interfaces before child files exist; subsequent steps fulfilling those props; the final step sealing the deepest boundary or consumer integration? #2026_09_20_04_group_7 revised by #2026_09_20_26_group_1 and #2026_09_25_05_group_1

## Practical Example Staging | 16 | Meaningful Pedagogical Commentary in Step Bullets #2026_09_25_03_group_1

- [ ] Does each Stage C `[p]` bullet plan **Meaningful Pedagogical Commentary** that deconstructs the architectural lessons from the code, strictly avoiding mechanical, autistic line-by-line recitation (such as "Notice line 6 calls onSelect")?
- [ ] Do step bullets articulate the clear architectural message:
    1. The core design motivation: why this component is structured this way rather than inlined into its parent.
    2. The real-world protection: which specific runtime bugs, unstopped cascades, or state drift this implementation prevents.
    3. The cause-and-effect path: how data flows downward and actions flow upward across component boundaries.
    4. The senior interview takeaway: how this component pattern exemplifies idiomatic React engineering.
- [ ] In Archetype A lectures, are callback invocations planned in step bullets using the Upward Wire circuit: identifying callback origin, explaining that the child holds a communication line with zero local state, tracing parent memory execution, and naming inverse data flow? #2026_09_20_06_group_1
- [ ] In Archetype A lectures, is architectural separation planned using the Negative Counterfactual circuit: posing a provocation question, describing the concrete disaster of merging responsibilities, stating physical invariants (`zero useState, zero useEffect`), and providing symmetric refactoring proofs? #2026_09_20_07_group_1
- [ ] In Archetype B lectures, are file and tooling deconstructions planned: deconstructing CLI arguments, separating runtime dependencies from devDependencies, explaining native ESM script resolution (`type="module"`), tracing root DOM attachment (`createRoot`), and analyzing client-side rendering boundaries without premature hooks? #2026_09_21_02_group_1

- [ ] PROPER EXAMPLE: Step bullet carrying meaningful pedagogical commentary:

> - [p] Step 2 constructs the interactive card boundary: We decouple card selection from nested bookmark actions; by wrapping the selection callback in an arrow function, we pass the story identifier upward only when the reader physically clicks the card, avoiding premature render-time execution; notice how the card owns zero persistent data, acting as a clean presentation bridge between the parent feed and nested actions. ◼ Meaningful pedagogical commentary: architectural motivation, premature execution prevention, clear data flow path.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Mechanical, autistic line-by-line recitation:

> - [p] Notice line 4 calls `onClick={() => onSelect(story.id)}`. On line 5 we have `story.category`. On line 6 we render `story.title`. Then on line 7 we mount `BookmarkButton`.

Notes: Mechanically recites lines without explaining architectural decisions, leaving the student without pedagogical insight.

## Grounding & Vocabulary | 17 | Proper Order Audit & Zero-Gap Knowledge Flow #2026_09_25_03_group_1

- [ ] Does the blueprint pass the **Proper Order Audit**, ensuring zero knowledge gaps across the curriculum progression?
- [ ] Is every technical term, platform mechanism, and concept introduced, grounded, and baptized in explanatory prose *before* it appears in principles, callouts, or the downstream glossary (permanently banning orphan terms like "reconciliation" in early glossaries without prior text definition)?
- [ ] Does every `[grounding]` (In the Wild) card and takeaway make a **genuinely new conceptual contribution** (such as a subtle runtime edge case, timing trap, or browser surprise), strictly avoiding mere repetition of what was already stated in the main text?
- [ ] Is the concept fully taught before planning a `[grounding]` card, placing the card at the end of the topic after the broken attempt, rule, and working code are established? #2026_09_21_03_group_1 revised by #2026_09_21_08_group_1 and #2026_09_21_09_group_1
- [ ] Does every `[grounding]` bullet include the complete 5-part anatomy: (1) Opening Question (6 to 9 words), (2) Friction Target, (3) Tactile Scene, (4) Bold Key Terms, and (5) Concrete Operational Resolution?

## Grounding & Vocabulary | 18 | Dual-Canon Nomenclature and Standard Vocabulary

- [ ] Whenever describing a technical pattern, data structure, or runtime event, does the text provide dual-canon terminology:
    1. The classic industry-standard term used by interviewers (`virtual DOM`, `prop drilling`, `synthetic events`).
    2. The official modern documentation term from `react.dev` (`UI descriptor tree`, `React elements`, `context propagation`).
    3. The concrete physical reality in plain English (plain JavaScript objects in memory).
    4. Bold formatting on first introduction.
- [ ] Is standard React vocabulary used, avoiding invented buzzwords (e.g. "controlled form illusion")?
- [ ] Are UI building blocks called components, avoiding "presenter" jargon ("pure presenter", "header presenter")? #2026_09_21_10_group_1
- [ ] Is genealogical component nomenclature used: `parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, or `terminal UI control`?

## Pre-Flight Verification Gate | 19 | Blueprint Verification Checklist #2026_09_21_02_group_1

- [ ] Before proceeding to Phase 2 production authoring, does the blueprint satisfy each quality gate:
    1. **Structural Mirror**: Do blueprint headings match the final lecture skeleton 1:1?
    2. **Curriculum Dependency Invariant**: Is premature syntax avoided, adhering strictly to question order?
    3. **Archetype Alignment**: Do Stages A through E and Stage D titles align with Archetype A or Archetype B?
    4. **Literal Code Blocks**: Does every `[code]` pre-element contain runnable code adhering to the 10-line ceiling and continuation attributes?
    5. **Audited Identifiers**: Does every code snippet include a what-this-introduces list auditing all tokens?
    5B. **Principle Boxes**: Does every principle box pass the reading test of `principle-definition/SKILL.md` and end with its code pair? #2026_10_04_10_group_1 revised by #2026_10_06_04_group_3
    6. **Substantive Arguments**: Do all `[p]` bullets carry actual technical derivations left of `◼`?
    7. **Technical Grading**: Does every `★` paragraph open with a preknowledge recap, and every `{old solution:}` pair with literal code?
    8. **Five-Stage Staging**: Are Stages A through E planned as concrete pre-elements with top-down assembly in Stage C?
    9. **Step Narration in Substance**: Does every Stage C step bullet contain notice-moves, unpacked tokens/props, warnings with physical consequences, and recaps?
    10. **Archetype Circuits**: Are Upward Wire and Counterfactual circuits (Archetype A) or tooling deconstructions (Archetype B) planned?
    11. **Grounding Card Anatomy**: Does every major technical section include a `[grounding]` card with a 6–9 word bold question and concrete resolution?
    12. **Dual-Canon Terminology**: Do load-bearing mechanisms carry both classic industry terms and modern official terminology?
    13. **Component & File Naming**: Do files and components use everyday vocabulary and standard architectural roles?
    14. **Formatting Discipline**: Is there exactly one continuous line per bullet, zero hard-wrapping, zero em-dashes, and valid figure `src` paths?
    15. **Beyond the Basics Planning**: Are 4 to 6 authoritative bullets planned under `## Beyond the basics` carrying active official documentation links (`https://react.dev/...`)? #2026_09_21_33_group_1
