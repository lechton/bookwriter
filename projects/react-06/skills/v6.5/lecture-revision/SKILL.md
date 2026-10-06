---
name: lecture-revision
description: Governs the pedagogical revision and publishing of completed production lectures into effortless, accessible explanations for junior developers; establishes density breakdown, conversational bridging, explicit relationship definitions (is vs is not), bolded terminology, and the revision build pipeline into 02-01-md-revised, 02-02-md-revised-html, and 02-03-md-revised-pdf.
---

# Lecture Revision

This skill governs the complete pedagogical revision of production lectures. It takes technically accurate lectures (`01-02-md-LECTURES/{NN}.md`) and rewrites them into crystal-clear, accessible lessons for junior developers, publishing the revised material to the revision directories (`02-01-md-revised/{NN}.md`, `02-02-md-revised-html/{NN}.html`, and `02-03-md-revised-pdf/{NN}.pdf`).

The core standard: **retain the exact same technical depth (no shallower, no deeper)**, while eliminating academic opacity so that a developer with zero prior knowledge can understand the physical cause-and-effect mechanics on their screen.

Digests: `skills/lecture-voice/SKILL.md`, `skills/lecture-structure/SKILL.md`, `skills/code-blocks/SKILL.md`, `skills/ui-panels/SKILL.md`, `skills/figures/SKILL.md`, and `skills/build/SKILL.md`.

## Core Mission | 01 | Equal Technical Depth with Maximum Clarity #2026_09_21_22_group_1

- [ ] Is the exact same technical depth retained as the original lecture, avoiding dumbing down the material, removing architectural edge cases, or glossing over browser engine internals?
- [ ] Are delivery, phrasing, and cognitive scaffolding simplified while preserving underlying engineering substance?
- [ ] Is clarity treated as the primary north star, unpacking complex technical mechanisms into stepped sentences where helpful?
- [ ] Is complete parity maintained across all technical invariants: component trees, prop drilling, unidirectional data flow, reconciliation diffing, browser layout reflows/repaints, input focus preservation, and compiler rules?

## Narrative Flow | 02 | Density Breakdown and Thought Unbundling #2026_09_21_22_group_1

- [ ] Are dense, academic paragraph blocks broken down into unhurried, digestible steps?
- [ ] Are paragraphs split, combined, synthesized, or expanded freely whenever doing so increases pedagogical clarity, avoiding rigid 1:1 paragraph constraints?
- [ ] Does every abstract technical mechanism have room to breathe (staging the concrete problem first, introducing the mechanism second, explaining the engine consequence third, and stating the developer takeaway fourth)?
- [ ] Are independent concepts unpacked into distinct paragraphs to prevent cognitive overload?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Dense, academic paragraphs packing four abstractions together:

> In standard web development, the browser engine creates the document tree directly from native HTML tags. When you load an HTML page, the browser parses elements like <header>, <main>, and <p> into living nodes inside the physical DOM. But in React, your code is written as component functions inside JavaScript files. A component function returns a tree of lightweight virtual descriptors called React elements, created via JSX. By itself, a JavaScript function sitting in App.jsx has zero connection to the browser document. It does not manipulate DOM nodes, it does not attach to <body>, and it cannot paint pixels on the screen without an explicit mounting engine.

Notes: Dense, academic, and breathless. It forces the reader to mentally unpack native parsing, C++ DOM trees, JSX compilation, virtual element descriptors, and mounting engines all within a single block of text without transitions.

- [ ] PROPER EXAMPLE: Density broken down into unhurried, accessible, step-by-step paragraphs:

> In traditional web development, a browser's **rendering engine** reads an HTML document. The browser directly translates native tags (such as `<header>` or `<p>`) into living nodes within the physical **Document Object Model (DOM)**. So the tags `<header>` and `<p>` and the DOM tree are not the same thing. The browser takes the html tags and builds the DOM, which operates as a UI (User Interface) that the user interacts with.
> 
> Instead of writing HTML files, React developers write JavaScript component functions that return JSX, a syntax that compiles down into "React elements" (components). These are lightweight JavaScript objects acting as virtual blueprints of the desired UI. These React components are JavaScript data structures, they sit altogether within one main component, the App.jsx.
> 
> On its own, the App.jsx that we create is powerless. It cannot manipulate physical nodes in the DOM, it cannot attach itself to the document `<body>`, and it cannot paint pixels on the screen. To bridge this gap (between the JSX data and the browser), React relies on a **mounting engine** (such as ReactDOM). So we have two things: the files that we create (jsx format), and the mounting engine (ReactDOM) that will mount these files to the browser. We use the mounting engine to read a **virtual element tree** and systematically execute the native DOM commands required to construct and render the actual interface.

Notes: Breaks the dense block into three focused movements: (1) native HTML tags vs living DOM nodes, (2) component functions returning virtual blueprints, (3) the mounting engine bridging JavaScript memory to the browser screen.

## Concept Introduction | 03 | Lexical Bolding of Core Terminology #2026_09_21_22_group_1

- [ ] Are key terms emphasized using **bold text** upon their first formal introduction in prose (for example: **rendering engine**, **Document Object Model (DOM)**, **imperative DOM scripting**, **declarative UI**, **state drift**, **mounting engine**, **component**, **props**, **evaluation window**, **unidirectional data flow**, **reflow**, **repaint**, **virtual DOM**, **reconciliation**)?
- [ ] Is the term bolded at the exact moment it is explained and grounded in physical behavior, rather than as decorative styling?
- [ ] Is bolding reserved for load-bearing architectural concepts and framework mechanisms, avoiding everyday conversational vocabulary or routine code identifiers?

## Conversational Bridging | 04 | Plain-English Conversational Transitions #2026_09_21_22_group_1

- [ ] Are abstract technical details connected to practical reality using plain-English transitional phrases (such as "So we have two things...", "To bridge this gap...", "What does this mean in day-to-day coding?", "Notice the profound difference:...", "So let us be very clear about...")?
- [ ] Do natural rhetorical bridges anticipate what might feel unfamiliar or surprising to the reader?
- [ ] Are stiff, academic connectors (such as "consequently", "hitherto", "furthermore", "it is imperative to note") replaced with clear conversational signposts?

## Conceptual Boundaries | 05 | Defining Relationships (What Things Are vs. What They Are Not) #2026_09_21_22_group_1

- [ ] Are relationships explicitly defined by clarifying what entities *are* and what they are *not*, preventing confusion between distinct tools and layers:
    * **HTML Tags vs. DOM Nodes**: Static tags written in an HTML file and dynamic living nodes in browser C++ memory are distinct. The browser parses text tags to build the DOM tree.
    * **Components vs. DOM Elements**: A React component is a JavaScript function acting as a blueprint; it is not a browser DOM element and does not touch pixels directly.
    * **Virtual DOM vs. Physical DOM**: The virtual DOM is a tree of plain JavaScript objects in memory; it is not a C++ browser tree and does not trigger browser reflows.
    * **Props vs. State**: Props are immutable inputs passed downward from a parent; they are not local variables that a child can reassign or mutate.
    * **Imperative vs. Declarative**: Imperative is giving turn-by-turn driving directions where missing one turn breaks the route; declarative is entering your destination into a GPS navigation system.
- [ ] Is the "Is / Is Not" formula applied when introducing framework abstractions, stating what it physically is in memory and what browser layer it does not touch?

## Formatting & Constraints | 06 | Markdown Hygiene, Continuous Lines, and Code Ceilings #2026_09_21_22_group_1

- [ ] Is every paragraph, list item, blockquote line, and table row authored as a single continuous line without manual line breaks?
- [ ] Does the text avoid em-dashes (`—`), preferring colons, parentheses, commas, or separate short sentences for synthetic voice compatibility?
- [ ] Does every body code block adhere to the 10-line ceiling unless carrying valid continuation attributes?
- [ ] Are narrative code comments free of bureaucratic category tags, while preserving the broken code verdict tag (`// **WRONG:** [consequence with uppercase bold **KEYWORD**]`) on runtime traps and syntax errors? #2026_09_21_23_group_1 revised by #2026_09_21_25_group_1
- [ ] In summary comparison snippets, is the directive header format enforced (`**DO THIS:**` / `**DO NOT DO THIS:**` on the line immediately above the fence, with `right` or `wrong` appended to the fence)?

## Structural Integrity | 07 | Preserving the 5-Stage Practical Example and Pipeline Markers #2026_09_21_22_group_1

- [ ] Is the complete anatomical skeleton preserved as required by the build compiler (`src/build-lectures.mjs`):
    1. **Title Line**: `# Lecture {n}: {Short Title}`
    2. **Line 2 Callout**: `> INTERVIEW QUESTION | ❱ TIER | {Question text}`
    3. **Hook Ladder**: 7 numbered beats opening the lesson with an authentic newsroom dilemma (The National Times).
    4. **Section 1**: Imperative/naive friction section containing a historical code snippet and the `[!WILD]` friction card.
    5. **Section 2**: Conceptual mechanism bridge introducing the core React primitive before code assembly.
    6. **Section 3 (`### Let's Design a Practical Example`)**: The 5-stage progressive guided build:
       - **Stage A**: ````components title="... - Rendered UI Canvas"```` and ````files title="...: File Explorer"````. Completeness: every file imported or shown exists in both panels.
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

- [ ] Are terminal sections (Sections 5, 6, and 7) authored with a junior-friendly pedagogical lens rather than copied verbatim?
- [ ] In `### Where you will meet this`, are vivid scenarios authored that explain the concrete problem, the mechanism's solution, and the exact physical bug that occurs if the rule is violated?
- [ ] In `### Glossary`, are definitions grounded in tactile physical reality: (1) what the entity physically is in memory or on disk, (2) what action it performs during execution, and (3) what runtime defect it prevents?
- [ ] In `### Summary`, is the `> [!TIP]` interviewer callout written as a calm, conversational explanation a candidate can speak naturally out loud?
- [ ] Are the `❒ Daily Engineering Reality` takeaways de-compressed into clear, unhurried sentences that synthesize the core mental models?

## Naming Conventions | 10 | The Two-Tier Convention Protocol: Prune First, Decode Second ([!CONVENTION]) #2026_09_21_27_group_1

- [ ] Are domain metaphors, editorial vocabulary, and UI naming conventions audited during revision?
- [ ] Is the Two-Tier Convention Protocol followed:
    * **Tier 1 (First Priority: Prune & Replace in Text and Figures)**: Can the convention be replaced with a self-evident everyday English term (e.g. replacing "masthead" with "site header") without loss of meaning?
    * **Tier 2 (Fallback: The Inescapable Industry Standard)**: If the term is an inescapable web development standard (e.g. "slug", "accordion", "toast", "drawer", "breadcrumb")—or if it is baked into a legacy figure that cannot be edited without breaking code-figure synchronization—is it decoded immediately using an explicit `> [!CONVENTION]` callout?
- [ ] Does every `> [!CONVENTION]` callout explain: (1) physical origin, (2) web engineering reality, and (3) operational justification?

## Publishing Pipeline | 11 | The Revision Build Workflow and Folder Architecture #2026_09_21_22_group_1 revised by #2026_09_21_24_group_1 and #2026_09_21_26_group_1 and #2026_09_22_01_group_1

- [ ] Is the revision workflow executed in sequential order:
    1. **Study Canonical Lecture**: Read `01-02-md-LECTURES/{NN}.md` to absorb all technical invariants, figures, and code snippets.
    2. **Author Revised Lesson**: Write `02-01-md-revised/{NN}.md` applying density breakdown, bold terminology, conversational bridges, and explicit relationship definitions, while strictly observing continuous lines.
    3. **Compile via Build Pipeline**: Run `node src/build-lectures.mjs {NN}`.
    4. **Verify Compiler Logs**: Confirm exit code 0 and clean build logs with zero warnings.
    5. **Inspect Artifacts**: Verify that `02-02-md-revised-html/{NN}.html`, `02-03-md-revised-pdf/{NN}.pdf`, and all five deck variants exist on disk with healthy byte sizes.
- [ ] Does the compiler resolve figure paths against `01-02-md-LECTURES/figures/` when referenced from `02-01-md-revised/`?
- [ ] Does each multi-lecture build assemble all available revised lessons into multi-theme decks under the `React ${ver}-rev Q{first}-Q{last}` prefix?
