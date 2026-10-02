---
name: lecture-revision
description: Governs the revision and polishing of completed production lectures; transforms mechanical code narration, line-by-line syntax audits, and directive-heavy prose into effortless, B2 tired-reader friendly explanations using the 3-Beat Relay and Zero Syntax Smuggling, while preserving all figures, code comments, and architectural invariants.
---

# Lecture Revision

This skill governs the systematic revision and polishing of completed production lectures (`01-02-md-LECTURES/{nn}.md`) and their accompanying figures. It serves as a dedicated refinement pass: taking technically accurate prose and transforming it into effortless, engaging reading for a tired developer reading plain upper-intermediate English (CEFR B2) with a mild headache.

Digests: `skills/lecture-voice/SKILL.md`, `skills/code-blocks/SKILL.md`, and `skills/figures/SKILL.md`.

## Revision Workflow | 01 | The Single-Lecture Cycle (MD ➔ PDF ➔ Verify ➔ Next) #2026_09_20_22_group_1

[ ] Execute lecture revisions strictly in a single-lecture cycle:
    1. **Revise Markdown**: Polish `01-02-md-LECTURES/{N}.md` for Lecture N.
    2. **Compile Immediate PDF**: Run `node src/build-lectures.mjs` immediately to generate `md-lectures-pdf/{N}.pdf`.
    3. **Verify Layout & Gates**: Inspect compiler logs for zero Prince warnings, check for awkward hyphenations or code overflows, and verify the 8 readability gates.
    4. **Advance to Next**: Only after Lecture N's PDF compiles cleanly with zero warnings, advance to Lecture N+1.
[ ] Strictly ban delayed batch authoring: never revise multiple Markdown files in bulk before compiling PDFs. Batching conceals layout defects and compounds stylistic errors across lectures.

[ ] PROPER EXAMPLE: make sure you follow the single-lecture cycle:

> 1. Revise `04.md`.
> 2. Run `node src/build-lectures.mjs` to build `04.pdf`.
> 3. Verify zero warnings, check sentence length, inspect page layout.
> 4. Once `04.pdf` passes 100%, proceed to revise `05.md` and repeat the loop.

Notes: Provides immediate feedback, preventing recurring formatting errors from spreading across multiple files.

## Division of Labor | 02 | Clear Boundary Between Code, Comments, and Prose #2026_09_20_14_group_1

[ ] Enforce a strict division of labor across code blocks, inline comments, and body prose:
    * **Code Blocks**: Display clean, runnable syntax and physical component structure.
    * **Right-Hand Comments**: Explain line-level mechanics, state locks, and cross-boundary data flow (`CODE LOGIC` and `DATA FLOW` speech bubbles).
    * **Body Prose**: Explain the mental model, cause-and-effect relationships, and architectural consequences.
[ ] Ban line-by-line syntax narration in prose: cut any paragraph whose sole purpose is reciting what line 3, line 6, or line 9 contains. The reader can already see the code in the window above.

## Typography & Phrasing | 03 | Zero Syntax Smuggling in Prose #2026_09_20_14_group_1

[ ] Restrict inline backticks in body prose strictly to single identifiers, prop names, and function tokens (such as `headline`, `setHeadline`, or `onClick`).
[ ] Strictly ban embedding full multi-token statements, variable declarations, or JSX tags inside running sentences (such as `const [x, setX] = useState(...)`, `<HeadlineViewer headline={headline} />`, or `onClick={() => onUpdateHeadline('...')}`).
[ ] Embedding multi-token code inside running sentences causes awkward word breaks in print and forces the reader to mentally parse complex syntax mid-sentence. Keep all multi-token code inside code editor windows.

## Typography & Phrasing | 04 | Eliminating Directive Clutter and Eyeball Ping-Pong #2026_09_20_14_group_1

[ ] Eliminate relentless tour-guide directives that whip the reader's eyes back and forth across the page (such as "Look at line 6...", "Notice the function parameter...", "Where does X come from? Look back at Step 1...").
[ ] Replace line-number commands with natural cause-and-effect narrative: describe what the user does on screen, how the component responds, and what changes in application state.
[ ] If a line number is genuinely required to pinpoint a subtle expression, state the action first and the address second so the concept lands before the reader inspects the code.

## Typography & Phrasing | 05 | The 20-Word Sentence Ceiling and Single-Action Focus #2026_09_20_21_group_1

[ ] Cap individual sentences at 20 words. Aim for 7 to 15 words per sentence.
[ ] Ban clause chaining: avoid stacking contrast clauses, participial phrases, and subordinate clauses into breathless run-on sentences.
[ ] Restrict each sentence to a single technical mechanism or event, allowing the tired reader to process thoughts cleanly one by one.

[ ] COUNTER-EXAMPLE: do not chain multiple clauses into a single sentence:

> Instead of the reserved JavaScript keyword `class`, it assigns `className`, adhering strictly to JSX naming conventions while mapping directly to the DOM property.

Notes: 23 words across four chained clauses. In print, this causes mid-word hyphenations and overburdens working memory.

[ ] PROPER EXAMPLE: make sure you break chained thoughts into single-idea sentences:

> Notice the attribute: it uses `className` instead of `class`. In JavaScript, `class` is a reserved keyword. React uses `className` to avoid that conflict and map directly to the browser's native DOM property.

Notes: Three short, active sentences (7, 7, and 15 words). The contrast lands first, the reason lands second, and the engine consequence lands third.

## Narrative Flow | 06 | The Socratic Anticipation Pattern ("Why Not the Obvious Way?") #2026_09_20_17_group_1

[ ] Never explain unfamiliar syntax with passive, abstract descriptions. Voice the exact skeptical question the developer is silently asking at that moment (such as "Why not wrap them in a `<div>` instead?").
[ ] Structure the explanation across the 4-Beat Socratic Arc:
    1. **Beat 1: The Choice**: State what the component did or returned (`The component ArticlePreview returns a Fragment <>...</>`).
    2. **Beat 2: The Skeptic's Question**: Ask why the familiar alternative wasn't chosen (*Why not wrap them in a `<div>` instead?*).
    3. **Beat 3: The Mechanical Reality**: State what the chosen syntax physically produces in the DOM (with the Fragment, the elements become direct siblings without adding an extra wrapper).
    4. **Beat 4: The Concrete Breakdown and Relief**: Put the developer in the broken scenario (an extra `<div>` breaking CSS Grid or Flexbox column calculations) and show the relief.

[ ] PROPER EXAMPLE: make sure you follow this Socratic breakdown:

> Notice what the component `ArticlePreview` returns: a Fragment (`<>...</>`). Why not wrap them in a `<div>` element instead?
> 
> With the Fragment, the two elements we added (the `<h2>` heading and the `<p>` excerpt) become direct siblings in the DOM, without adding an extra `<div>` element that could break CSS rules.
> 
> Imagine if the parent page used CSS Grid or Flexbox: an extra `<div>` element would break your layout. Now both elements align directly to your layout tracks without an extra container breaking your styles.

Notes: Enters the reader's mind, voices their skepticism, contrasts the physical DOM outcome, and explains the CSS layout benefit.

## Narrative Flow | 07 | Non-Repetition of Idiosyncratic Vignettes #2026_09_20_19_group_1

[ ] Reinforce core mechanisms across steps, but never repeat the same idiosyncratic failure scenario, specific metaphor, or detailed layout breakdown across multiple steps in the same lecture.
[ ] Ensure each step explores a unique angle of the architecture. If Step 1 already explained why Fragments prevent broken CSS Grid layouts, Step 4 must not repeat that layout scenario; Step 4 should focus on outward integration or submission sealing.

## Narrative Flow | 08 | Explicit Entity Qualification ("What Is What" Rule) #2026_09_20_23_group_1

[ ] Verbally qualify every code entity with its architectural role on every reference: "the component `ReaderGreeting`", "the prop `readerName`", "the `<span>` element", "the property `author.name`".
[ ] Distinguish component references by their syntax role: use "the component `ComponentName`" when referring to the function or module, and "the component `<ComponentName />`" when referring to its JSX usage.
[ ] Never drop bare, unqualified tokens that force the reader to calculate what kind of entity is being discussed.

## Narrative Flow | 09 | Concrete Specificity (Name Every Actor) #2026_09_20_15_group_1

[ ] Eliminate vague collective abstractions (such as "the children", "in-scope variables", or "the component state").
[ ] Name every actor explicitly using single-token backticks: specify the exact component name (`ReaderGreeting`), the specific state variable (`readerName`), and the exact updater function (`setReaderName`).
[ ] Ground interactions in concrete terms: state who supplies the data, who receives it, and what method extracts it.

## Architectural Rationale | 10 | The Three-Beat Relay for Data Flow & Callback Tracing #2026_09_20_14_group_1

[ ] Trace cross-component communication across three structured beats:
    1. **Parent Origin**: Point to the state variable and setter declared in the parent container.
    2. **Props Transmission**: Trace how the parent passes the data or callback downward in JSX.
    3. **Child Invocation & Parent Execution**: Show the child calling the callback prop, and trace the physical execution running back in the parent's memory.
[ ] Strictly avoid dismissive hand-waving phrases like "it simply calls the callback" or "the callback updates the parent".

## Architectural Rationale | 11 | Purpose-Driven Functional Descriptions #2026_09_20_16_group_1

[ ] Replace abstract spec-sheet labels (such as "Function call evaluation" or "Method chain in attributes") with the real-world destination or purpose of the operation (human readers, search engine crawlers, or responsive layout).
[ ] Describe code in terms of developer intent and browser consequence rather than reciting AST node types.

## Architectural Rationale | 12 | The Negative Counterfactual Circuit #2026_09_20_14_group_1

[ ] When explaining architectural separation between components, strictly eliminate empty praise (such as "the cleanest architecture keeps X separate from Y").
[ ] Apply the 4-part counterfactual circuit:
    1. Provocation question: What breaks if both responsibilities are merged into one component?
    2. Concrete disaster: Describe trapped state, re-render churn, or tight coupling.
    3. Physical code invariant: State what is physically absent in code (`zero useState and zero useEffect`).
    4. Decoupling proof: Prove that changing UI touches zero backend code, and changing backend touches zero UI code.

## Architectural Rationale | 13 | Pre-Example Mechanism Bridge Audit #2026_09_20_24_group_1

[ ] Audit the transition between high-level problem motivation and `### Let's Design a Practical Example...`.
[ ] If the lecture jumps directly into code assembly without introducing the core React primitive, author and insert a dedicated conceptual bridge section (`### Components as Reusable Blueprints`, `### The JSX Evaluation Window`).
[ ] In 3 to 4 focused paragraphs, explain: what limitation in plain HTML/JS this feature solves, how the React mechanism operates under the hood, the non-negotiable rule or syntax trap, and which files will demonstrate it.

## Verification Gate | 14 | The 8-Gate Readability Audit #2026_09_20_17_group_1

[ ] Before declaring a revised lecture complete, audit against the 8 readability gates:
    1. **Single-Lecture Build**: Verified PDF output with zero Prince compiler warnings.
    2. **Division of Labor**: Zero line-by-line code recitation in prose; comments carry line mechanics, prose carries mental models.
    3. **Zero Syntax Smuggling**: Only single tokens in backticks in body text; zero multi-token statements embedded in prose.
    4. **Directive Clutter Eliminated**: No "Look at line X" eyeball ping-pong; natural cause-and-effect transitions.
    5. **Sentence Length**: All sentences capped at 20 words; zero clause chaining.
    6. **Entity Qualification**: All entities qualified with their role (component, prop, element).
    7. **Socratic Anticipation**: Unfamiliar syntax justified via the 4-beat Socratic arc.
    8. **Upward Wire & Counterfactual**: Callbacks traced through the 3-beat relay; architectural boundaries justified via counterfactual proofs.
