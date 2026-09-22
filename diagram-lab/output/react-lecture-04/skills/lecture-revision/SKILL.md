---
name: lecture-revision
description: Governs the pedagogical revision and publishing of completed production lectures into effortless, accessible explanations for junior developers; establishes density breakdown, conversational bridging, explicit relationship definitions (is vs is not), bolded terminology, and the revision build pipeline into 02-01-md-revised, 02-02-md-revised-html, and 02-03-md-revised-pdf.
---

# Lecture Revision

This skill governs the complete pedagogical revision of production lectures. It takes technically accurate lectures (`01-02-md-LECTURES/{NN}.md`) and rewrites them into crystal-clear, accessible lessons for junior developers, publishing the revised material to the revision directories (`02-01-md-revised/{NN}.md`, `02-02-md-revised-html/{NN}.html`, and `02-03-md-revised-pdf/{NN}.pdf`).

The core standard: **retain the exact same technical depth (no shallower, no deeper)**, but eliminate academic opacity so that a developer with zero prior knowledge can understand the physical cause-and-effect mechanics on their screen.

Digests: `skills/lecture-voice/SKILL.md`, `skills/lecture-structure/SKILL.md`, `skills/code-blocks/SKILL.md`, `skills/ui-panels/SKILL.md`, `skills/figures/SKILL.md`, and `skills/build/SKILL.md`.

## Core Mission | 01 | Equal Technical Depth with Maximum Clarity #2026_09_21_22_group_1

[ ] Retain the EXACT same technical depth as the original lecture: never dumb down the material, never remove architectural edge cases, and never gloss over browser engine internals.
[ ] Simplify the delivery, phrasing, and cognitive scaffolding, never the underlying engineering substance. The goal is to make advanced concepts immediately understandable to a junior developer while remaining rigorous enough to pass demanding technical interviews.
[ ] Treat clarity as the single north star: if a technical mechanism requires three calm, stepped sentences instead of one dense, packed sentence, unpack it without hesitation.
[ ] Maintain complete parity across all technical invariants: component trees, prop drilling, unidirectional data flow, reconciliation diffing, browser layout reflows/repaints, input focus preservation, and compiler rules.

## Narrative Flow | 02 | Density Breakdown and Thought Unbundling #2026_09_21_22_group_1

[ ] Break down dense, academic paragraph blocks into unhurried, digestible steps.
[ ] Abolish strict 1:1 paragraph mapping: feel completely free to split, combine, synthesize, or expand ideas whenever doing so increases pedagogical clarity.
[ ] Give every abstract technical mechanism room to breathe: stage the concrete problem first, introduce the mechanism second, explain the physical browser/engine consequence third, and state the developer takeaway fourth.
[ ] Avoid compressing multiple independent concepts into a single clause-heavy paragraph. Present one distinct idea at a time so the reader never experiences cognitive overload.

[ ] COUNTER-EXAMPLE: do not write dense, academic paragraphs that pack four separate abstractions together:

> In standard web development, the browser engine creates the document tree directly from native HTML tags. When you load an HTML page, the browser parses elements like <header>, <main>, and <p> into living nodes inside the physical DOM. But in React, your code is written as component functions inside JavaScript files. A component function returns a tree of lightweight virtual descriptors called React elements, created via JSX. By itself, a JavaScript function sitting in App.jsx has zero connection to the browser document. It does not manipulate DOM nodes, it does not attach to <body>, and it cannot paint pixels on the screen without an explicit mounting engine.

Notes: dense, academic, and breathless. It forces the reader to mentally unpack native parsing, C++ DOM trees, JSX compilation, virtual element descriptors, and mounting engines all within a single block of text without transitions.

[ ] PROPER EXAMPLE: break down the density into unhurried, accessible, step-by-step paragraphs:

> In traditional web development, a browser's **rendering engine** reads an HTML document. The browser directly translates native tags (such as `<header>` or `<p>`) into living nodes within the physical **Document Object Model (DOM)**. So the tags `<header>` and `<p>` and the DOM tree are not the same thing. The browser takes the html tags and builds the DOM, which operates as a UI (User Interface) that the user interacts with.
> 
> Instead of writing HTML files, React developers write JavaScript component functions that return JSX, a syntax that compiles down into "React elements" (components). These are lightweight JavaScript objects acting as virtual blueprints of the desired UI. These React components are JavaScript data structures, they sit altogether within one main component, the App.jsx.
> 
> On its own, the App.jsx that we create is powerless. It cannot manipulate physical nodes in the DOM, it cannot attach itself to the document `<body>`, and it cannot paint pixels on the screen. To bridge this gap (between the JSX data and the browser), React relies on a **mounting engine** (such as ReactDOM). So we have two things: the files that we create (jsx format), and the mounting engine (ReactDOM) that will mount these files to the browser. We use the mounting engine to read a **virtual element tree** and systematically execute the native DOM commands required to construct and render the actual interface.

Notes: Breaks the dense block into three focused movements: (1) native HTML tags vs living DOM nodes, (2) component functions returning virtual blueprints, (3) the mounting engine bridging JavaScript memory to the browser screen.

## Concept Introduction | 03 | Lexical Bolding of Core Terminology #2026_09_21_22_group_1

[ ] Emphasize key terms using **bold text** upon their first formal introduction in prose (for example: **rendering engine**, **Document Object Model (DOM)**, **imperative DOM scripting**, **declarative UI**, **state drift**, **mounting engine**, **component**, **props**, **evaluation window**, **unidirectional data flow**, **reflow**, **repaint**, **virtual DOM**, **reconciliation**).
[ ] Bold the term at the exact moment it is explained and grounded in physical behavior, not as an afterthought or mere decorative styling.
[ ] Avoid bolding everyday conversational vocabulary, file names, or routine code identifiers; reserve bold styling for load-bearing architectural concepts and framework mechanisms.

## Conversational Bridging | 04 | Plain-English Conversational Transitions #2026_09_21_22_group_1

[ ] Connect abstract technical data to practical reality using plain-English transitional phrases (such as "So we have two things...", "To bridge this gap...", "What does this mean in day-to-day coding?", "Notice the profound difference:...", "So let us be very clear about...").
[ ] Use natural rhetorical bridges that enter the student's mind, acknowledging what might feel unfamiliar or surprising before moving forward.
[ ] Replace stiff, academic connectors (such as "consequently", "hitherto", "furthermore", "it is imperative to note") with clear conversational signposts that guide the developer smoothly from one thought to the next.

## Conceptual Boundaries | 05 | Defining Relationships (What Things Are vs. What They Are Not) #2026_09_21_22_group_1

[ ] Explicitly define relationships by clarifying what entities *are* and what they are *not*. Junior developers frequently conflate related but distinct tools and layers; prevent confusion by establishing sharp conceptual boundaries:
    * **HTML Tags vs. DOM Nodes**: Static tags written in an HTML file and dynamic living nodes in browser C++ memory are *not* the same thing. The browser parses text tags to build the DOM tree.
    * **Components vs. DOM Elements**: A React component is a JavaScript function acting as a blueprint; it is *not* a browser DOM element and cannot touch pixels directly.
    * **Virtual DOM vs. Physical DOM**: The virtual DOM is a tree of plain, lightweight JavaScript objects in memory; it is *not* a C++ browser tree and does not trigger browser reflows.
    * **Props vs. State**: Props are immutable inputs passed downward from a parent; they are *not* local variables that a child can reassign or mutate.
    * **Imperative vs. Declarative**: Imperative is giving turn-by-turn driving directions where missing one turn breaks the route; declarative is entering your destination into a GPS navigation system.
[ ] Follow the "Is / Is Not" formula whenever introducing a framework abstraction: state what it physically is in JavaScript memory, and explicitly state what browser layer it does *not* touch.

## Formatting & Constraints | 06 | Markdown Hygiene, No Hard-Wrapping, and Code Ceilings #2026_09_21_22_group_1

[ ] Strictly enforce the repository-wide **Never Hard-Wrap** rule: author every paragraph, list item, blockquote line, and table row as a single continuous line without manual line breaks inside the paragraph.
[ ] Strictly ban em-dashes (`—`): PrinceXML and synthetic TTS engines stumble on em-dashes. Use colons, parentheses, commas, or separate short sentences instead.
[ ] Enforce the 10-line ceiling on all body code blocks: no code fence in the lecture body may exceed 10 executable lines unless it is a slice of a continuous assembly chain carrying valid `continues` and `startLine` markers.
[ ] Keep narrative code comments free of bureaucratic category tags (dropping labels like `CODE LOGIC:` or `DATA FLOW:`), while preserving the broken code verdict tag (`// **WRONG:** [consequence with uppercase bold **KEYWORD**]`) on runtime traps and syntax errors as mandated by `code-blocks/SKILL.md`. #2026_09_21_23_group_1 revised by #2026_09_21_25_group_1
[ ] In summary comparison snippets, enforce the directive header format: place `**DO THIS:**` or `**DO NOT DO THIS:**` on the line immediately above the fence, and append `right` or `wrong` directly to the language tag (` ```jsx right ` or ` ```jsx wrong `).

## Structural Integrity | 07 | Preserving the 5-Stage Practical Example and Pipeline Markers #2026_09_21_22_group_1

[ ] Preserve the complete anatomical skeleton required by the build compiler (`src/build-lectures.mjs`):
    1. **Title Line**: `# Lecture {n}: {Short Title}`
    2. **Line 2 Callout**: `> INTERVIEW QUESTION | ❱ TIER | {Question text}`
    3. **Hook Ladder**: 7 numbered beats opening the lesson with an authentic newsroom dilemma (The National Times).
    4. **Section 1**: Imperative/naive friction section containing a historical code snippet and the `[!WILD]` friction card.
    5. **Section 2**: Conceptual mechanism bridge introducing the core React primitive before code assembly.
    6. **Section 3 (`### Let's Design a Practical Example`)**: The 5-stage progressive guided build:
       - **Stage A**: ````components title="... - Rendered UI Canvas"```` and ````files title="...: File Explorer"````. Completeness law: every file imported or shown must exist in both panels.
       - **Stage B**: Introductory assembly pipeline figure: ````html-figure src="figures/{NN}-01-code-assembly-pipeline.html" caption="..."````.
       - **Stage C**: Progressive implementation steps with collaborative headings ending in the exact component filename:
         * `### Step 1: First, we construct the parent container ...`
         * `### Step 2: Next, we build the child component ...`
         * `### Step 3: Then, we declare the child component ...`
         * `### Step 4: Finally, we mount the complete header inside the page shell ...`
       - **Stage D**: `### Component Summary` with the Component Role panel: ````component-code title="Summary: The Logic of Nested Components"````.
       - **Stage E**: Architecture Audit matrix figure: ````html-figure src="figures/{NN}-02-architecture-audit.html" caption="..."````.
    7. **Section 4**: Engine mechanics under the hood (reflow, repaint, the `innerHTML` focus-loss trap, virtual DOM diffing, and surgical reconciliation).
    8. **Section 5**: `### Where you will meet this` (4 real-world production use cases).
    9. **Section 6**: `### Glossary` (4 to 6 core terms).
    10. **Section 7**: `### Summary` with `> [!TIP]`, ❒ Daily Engineering Reality, ❒ Core Architectural Principles (➔ rules), `**DO THIS:**` & `**DO NOT DO THIS:**` blocks, and the closing 3-column comparison table (`| | **VANILLA JAVASCRIPT**<br>(Imperative DOM) | **REACT 19**<br>(Declarative Components) |`).

## Terminal Digest Revision | 08 | Real-World Scenarios, Tactile Glossary, and Interview Takeaways #2026_09_21_26_group_1

[ ] Apply the junior-friendly pedagogical lens across all terminal sections (Sections 5, 6, and 7): never copy closing sections verbatim from the canonical source.
[ ] In `### Where you will meet this`, author vivid, active scenarios that explain the concrete problem, the mechanism's solution, and the exact physical bug that occurs if the rule is violated. Banish dry colon-appositive fragments.
[ ] In `### Glossary`, eliminate circular academic jargon. Ground every definition in tactile physical reality: (1) what the entity physically is in JavaScript memory or on disk, (2) what action it performs during execution, and (3) what runtime defect it prevents.
[ ] In `### Summary`, rewrite the `> [!TIP]` interviewer callout as a calm, conversational explanation a candidate can speak naturally out loud without reciting a textbook.
[ ] De-compress the `❒ Daily Engineering Reality` takeaways into clear, unhurried sentences that synthesize the core mental models without academic sentence cramming.

## Naming Conventions | 10 | The Two-Tier Convention Protocol: Prune First, Decode Second ([!CONVENTION]) #2026_09_21_27_group_1

[ ] Audit all domain metaphors, editorial vocabulary, and UI naming conventions during revision: scan for terms like "masthead", "byline", "slug", "hero section", "accordion", "toast", "drawer", or "pill".
[ ] Follow the Two-Tier Convention Protocol:
    * **Tier 1 (First Priority: Prune & Replace in Text and Figures)**: Check if the convention can be replaced with a self-evident everyday English term (e.g. replacing "masthead" with "site header"). If replacing the word eliminates confusion and can be reflected cleanly across both prose and figures, purge the jargon entirely.
    * **Tier 2 (Fallback: The Inescapable Industry Standard)**: If the term is an inescapable web development standard (e.g. "slug", "accordion", "toast", "drawer", "breadcrumb")—or if it is baked into a legacy figure that cannot be edited without breaking code-figure synchronization—decode it immediately using an explicit `> [!CONVENTION]` callout.
[ ] Structure every `> [!CONVENTION]` callout across three facts: (1) physical origin, (2) web engineering reality, and (3) operational justification.

## Publishing Pipeline | 11 | The Revision Build Workflow and Folder Architecture #2026_09_21_22_group_1 revised by #2026_09_21_24_group_1 and #2026_09_21_26_group_1

[ ] Understand the revision folder structure in `react-lecture-05`:
    * Canonical Production Source: `01-02-md-LECTURES/{NN}.md`
    * Revised Markdown Target: `02-01-md-revised/{NN}.md`
    * Revised HTML Target: `02-02-md-revised-html/{NN}.html`
    * Revised PDF Target: `02-03-md-revised-pdf/{NN}.pdf`
[ ] Execute the revision workflow in strict sequential order:
    1. **Study Canonical Lecture**: Read `01-02-md-LECTURES/{NN}.md` to absorb all technical invariants, figures, and code snippets.
    2. **Author Revised Lesson**: Write `02-01-md-revised/{NN}.md` applying density breakdown, bold terminology, conversational bridges, and explicit relationship definitions, while strictly observing the no-hard-wrap convention.
    3. **Compile via Build Pipeline**: Run the subproject build script targeting the specific lecture number:
       ```bash
       node src/build-lectures.mjs {NN}
       ```
       (Example: `node src/build-lectures.mjs 01` compiles both the canonical and revised versions of Lecture 1).
    4. **Verify Compiler Logs**: Confirm exit code 0 and verify that PrinceXML outputs the PDF with zero linter errors or warnings.
    5. **Inspect Artifacts**: Verify that both `02-02-md-revised-html/{NN}.html` and `02-03-md-revised-pdf/{NN}.pdf` exist on disk with healthy byte sizes.
[ ] How the pipeline manages revision folders under the hood:
    * In `src/build-lectures.mjs`, the directories are wired directly into the compiler:
      ```javascript
      dirs.mdLecturesRevised = join(ROOT, '02-01-md-revised');
      dirs.htmlRevised = join(ROOT, '02-02-md-revised-html');
      dirs.pdfRevised = join(ROOT, '02-03-md-revised-pdf');
      buildDirectory(dirs.mdLecturesRevised, dirs.htmlRevised, dirs.pdfRevised, 'auto', true, 'auto');
      ```
    * Figure resolution: when an ````html-figure src="figures/..."```` is processed in `02-01-md-revised/`, the build script automatically resolves the figure path against `01-02-md-LECTURES/figures/` if not present in the revision folder, inlining the card HTML seamlessly.
