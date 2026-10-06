---
name: lecture-structure
description: Governs the section skeleton, practical example staging, naming, and closing tables of a production lecture; use when assembling or revising lecture structure.
---

# Lecture Structure

This skill governs how a production lecture is assembled: the two-phase workflow, the section skeleton in its exact order, the 5-stage practical example architecture, component naming rules, and the closing comparison table. It covers structure and placement only; prose wording belongs to `lecture-voice`, code formatting to `code-blocks`, UI panels to `ui-panels`, and standalone HTML figures to `figures`.

Digests: `skills/old-instructions/AUTHOR-BRIEF.md` and `skills/old-instructions/instructions.md` (phases, implementation sequence, format spec).

## Workflow & Phases | 01 | The Pre-Lecture Blueprint Precedes the Lecture

- [ ] Is the Phase 1 pre-lecture blueprint authored in `01-01-md-PRE-lectures/<version>/{nn}.md` (targeting the latest version by default) before authoring production lecture prose? #2026_09_24_05_group_1
- [ ] Does the blueprint lock the structural skeleton, authorized technical vocabulary, and causal explanation flow before long-form writing begins?
- [ ] Do blueprint headings mirror the final lecture headings, mapping upcoming elements into atomic bullets with pedagogical qualifications?
- [ ] Is the approved blueprint treated as the quality gate for Phase 2, revising the blueprint when structural defects are identified rather than improvising patches in the lecture file?
- [ ] Are all five practical example stages (Stages A through E) planned as concrete elements in the blueprint before drafting code? #2026_09_20_01_group_1 revised by #2026_09_20_05_group_1

## Workflow & Phases | 02 | The Production Lecture Expands the Blueprint

- [ ] Is the Phase 2 production lecture in `01-02-md-LECTURES/<version>/{n}.md` (targeting the latest version by default) written by systematically expanding the approved pre-lecture blueprint? #2026_09_24_05_group_1
- [ ] Do the lecture file number, blueprint number, and question bank row index match exactly?
- [ ] Does the lecture deliver comprehensive technical coverage of the assigned mechanism, providing a definitive source of depth for the curriculum?

## Workflow & Phases | 03 | Lecture-First Production Order

- [ ] Is the full production lecture authored before creating any distilled review artifacts or summaries derived from it?
- [ ] Do distillations inherit their depth from a fully resolved lecture rather than guesswork about what matters?
- [ ] Are unfamiliar concepts unpacked in the lecture so downstream materials inherit grounded definitions?

## Workflow & Phases | 04 | Blueprint Traceability

- [ ] Does every paragraph in the production lecture trace directly back to an element planned in the approved pre-lecture blueprint?
- [ ] If a new technical claim, code block, or panel is required, is it added to the blueprint first to keep the files synchronized?
- [ ] Do conceptual foundation paragraphs (marked with ◇ in the blueprint) and runtime mechanics paragraphs (marked with ★) retain their planned grounding when expanded?

## Workflow & Phases | 05 | Verification Inside the Workflow

- [ ] Are pre-lecture verification gates passed before drafting the production lecture?
- [ ] Are structural traceability and pedagogical clarity gates verified before marking any lecture complete?
- [ ] Is a clean compiler build (zero warnings) verified alongside teaching quality?

## Workflow & Phases | 06 | Topic Fidelity and Architectural Independence

- [ ] Is each lecture dedicated strictly to answering its assigned interview question from the question bank?
- [ ] Does the lecture expand the specific hook and domain scenario assigned to the question rather than replacing it with generic examples?
- [ ] Are component architectures, code setups, and figures designed specifically for the assigned mechanism rather than copied from adjacent lectures?
- [ ] Does the lecture respect the Curriculum Dependency Law, restricting code syntax, hooks, and references to what has been formally introduced up to that question (e.g. in `questions/questions.md` Version 3: no `useState` before Q14, no callback props before Q13, no `useEffect` before Q31)? #2026_09_21_02_group_1 revised by #2026_09_21_06_group_1 and #2026_10_05_04_group_1
- [ ] Is the lecture governed by both maps: `01-01-map/{nn}.md` for syllabus scope and `01-01-map-principles/{nn}.md` for the exact operational principle set and order? #2026_09_25_06_group_1 revised by #2026_09_26_19_group_1
- [ ] Does every numbered lecture principle trace one-to-one to the approved principle map, while ledger rows marked `Supporting`, `Prerequisite`, or `Preview` appear as theory prose, one-line recalls, or one-sentence forward mentions that name the owner lesson rather than as extra principles? #2026_09_26_19_group_1 revised by #2026_09_26_21_group_2

## Section Skeleton | 07 | Canonical Skeleton Order #2026_09_25_03_group_1

- [ ] Is every production lecture assembled in this top-to-bottom sequence:
    1. Document Title: `# Lecture {n}: {Short Title}` on line 1.
    2. Interview Question Callout: `> INTERVIEW QUESTION | ...` on line 2.
    3. The 7 Numbered Opening Beats (bare under the callout).
    4. First Section: `### {Catchy Section Title}` introducing the core engineering challenge and native baseline friction.
    5. Theory-First Conceptual Foundation: `### {Theoretical Concept}` (such as *What is a React Component?* or *The Three Trees Model*) providing a complete theoretical introduction, syntax grammar, and mental model before principles.
    6. Autonomous Principled Theory: `### Principles of React: {Topic}` with one canonical `> [!PRINCIPLE]` callout per approved principle-map entry, preserving its order and expanding it through operational definitions, relevant review cases, and engine deconstructions. #2026_09_26_19_group_1
    7. Practical Example Section:
       - `### Let's Design a Practical Example`: Open the practical example section with this exact clean heading, avoiding trailing component names. #2026_09_21_11_group_1
       - Stage A: Scaffold UI Canvas (` ```components `) and File Explorer (` ```files `).
       - Stage B: Assembly / Scaffolding Pipeline Figure (`figures/{NN}-01-code-assembly-pipeline.html`).
       - Stage C: 2 to 4 Organic Sequential Assembly Steps ($N \in \{2, 3, 4\}$, accompanied by Meaningful Pedagogical Commentary explaining architectural lessons rather than mechanical line mapping). #2026_09_25_05_group_1
       - Stage D: Component Summary (`### Component Summary` with Role Mode panel).
       - Stage E: Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`).
    8. Real-World Applications: `### Where you will meet this`.
    9. Reference Glossary: `### Glossary` (defining bolded terms introduced earlier in text; zero orphan terms).
    10. Advanced Topics & Official Documentation: `## Beyond the basics` (4 to 6 authoritative bullets linking directly to live official website documentation via `(see [react.dev/...](https://react.dev/...))`; local repository paths and GitHub links are avoided; forces a PDF page break via `## `). #2026_09_21_32_group_1 revised by #2026_09_21_33_group_1
    11. Practical Review: `### Summary`.
    12. Closing Comparison Table: Three-column comparative matrix as the final block of the file.
- [ ] Is at least one standalone HTML figure embedded per lecture adhering strictly to the `figures` skill?

## Section Skeleton | 08 | Document Title Formatting

- [ ] Is there exactly one `# ` heading per lecture, placed on line 1?
- [ ] Does it follow the standard pattern: `# Lecture {n}: {Short Title}`?
- [ ] Does the lecture number `{n}` match the question bank row, with a title that captures the core technical takeaway in plain language?

- [ ] PROPER EXAMPLE: Matching number and clear title:

> ```markdown
> # Lecture 61: What Makes a Good Key and Why Index Fails
> ```

Notes: The number matches the question bank, and the title states the technical topic clearly.

## Section Skeleton | 09 | Line-2 Interview Question Callout

- [ ] Is the interview question callout placed on line 2, immediately below the document title with no blank line between them?
- [ ] Is the callout formatted using the exact syntax: `> INTERVIEW QUESTION | {tier} | {question text}`?
- [ ] Is the question text copied verbatim from the question bank row?
- [ ] Is the curriculum tier specified accurately: `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED` (appended with ` (Server)` for server-focused questions)?

- [ ] PROPER EXAMPLE: Line-2 callout with server tier:

> ```markdown
> > INTERVIEW QUESTION | ❱ CORE (Server) | What is a Server Component and how does it differ from a Client Component?
> ```

Notes: Placed on line 2, preserves the server tier tag, and quotes the bank question verbatim.

## Section Skeleton | 10 | Semantic Heading Levels

- [ ] Is `### ` used as the standard heading level for all lecture sections and assembly steps so they flow inline without forcing page breaks?
- [ ] Is `## ` reserved exclusively for major structural milestones requiring a forced page break in the PDF (such as `## Beyond the basics`)?
- [ ] Is the document title on line 1 the single `# ` heading in the file?
- [ ] Do the numbered opening beats lead immediately into the first `### ` heading with no orphan paragraphs between them?

## Section Skeleton | 11 | Standard Body Progression & Engine Mechanics #2026_09_20_04_group_4 revised by #2026_09_20_05_group_1, #2026_09_20_27_group_1, and #2026_09_25_03_group_1

- [ ] Does the lecture body progress logically: (1) core engineering problem and native baseline, (2) foundational theoretical introduction (`### {Theoretical Concept}`), (3) autonomous principled theory (`### Principles of React: {Topic}`), (4) 5-stage practical example assembly, and (5) architectural comparison and review? #2026_09_25_03_group_1
- [ ] Are underlying browser engine consequences explicitly deconstructed (for example, showing how replacing HTML with `innerHTML` wipes input focus and resets CSS transitions, whereas React reconciliation preserves node identity and focus)? #2026_09_20_27_group_1
- [ ] Are friction cards placed at the end of the topic after walking through the broken attempt, engine behavior, and working code? #2026_09_21_03_group_1 revised by #2026_09_21_08_group_1 and #2026_09_21_09_group_1

## Section Skeleton | 12 | Theory-First Foundation & Pre-Example Grounding #2026_09_20_24_group_1 revised by #2026_09_20_25_group_1 and #2026_09_25_03_group_1

- [ ] Does the text avoid jumping directly from high-level problem motivation into the practical code assembly section?
- [ ] Is a dedicated theoretical foundation section (such as `### What is a React Component?`, `### Components as Reusable Blueprints`, or `### JSX as Compiled JavaScript`) placed before the principled theory section, establishing core concepts, syntax grammar, and mental models? #2026_09_25_03_group_1
- [ ] In foundational lectures, does this section introduce and deconstruct syntax primitives before they appear in multi-file code examples or formal principles?
- [ ] In 3 to 4 focused paragraphs, does the section address:
    1. What limitation in plain HTML or vanilla JavaScript does this feature solve?
    2. What is the React mechanism, how is it written, and what happens under the hood?
    3. What is the standard rule or common syntax trap?
    4. Which core mental model anchors the student's understanding before formal principles?

- [ ] PROPER EXAMPLE: Grounded mechanism bridge from Lecture 1:

> ### Components as Reusable Blueprints
> 
> In plain HTML, you structure documents using native tags like the `<header>`, `<article>`, and `<button>` elements. 
> 
> However, native HTML tags know nothing about your application logic or subscriber data. Traditionally, developers had to copy and paste HTML markup across separate templates. Then, they attached external JavaScript scripts to add interactive behavior. This separation split structure from logic, creating fragmented and fragile codebases.
> 
> To solve this fragmentation, React unifies markup, style, and logic into a single cohesive structure. This mechanism is called a **component**. A component is a self-contained, reusable JavaScript function. It accepts input data called **props** and returns markup describing a piece of the user interface.
> 
> In React, every component function name must start with a capital letter. **Capitalization** is a strict compiler requirement. It tells React that `<SiteHeader />` is your custom component, while `<header>` is a built-in browser DOM tag. Components can be **nested** inside one another. This allows you to assemble complex pages out of small, focused building blocks.
> 
> To see this in action on The National Times, we organize our site header into three distinct files:
> 1. The **parent component** `SiteHeader.jsx` acts as the orchestrating container.
> 2. The **child component** `ReaderGreeting.jsx` renders the personalized welcome message.
> 3. The **child component** `SubscriberInfo.jsx` displays the subscriber tier details.
> 
> Both child components receive the subscriber's name through the prop `readerName` passed directly from their parent.

Notes: Teaches specific syntax and engine rules (components, capitalization, props, nesting) and smoothly bridges into the files of Stage A.

## Section Skeleton | 12B | Autonomous Theory, Boxed Principles, and Multi-Invariant Coverage #2026_09_24_01_group_1

- [ ] Is theory completely separated from application: is the conceptual foundation in Section 2 fully autonomous, clear, and comprehensive before the practical case study begins?
- [ ] When a lecture covers multiple foundational syntax rules or invariants, does every declared rule receive dedicated mechanical derivation and code demonstration in theory?
- [ ] In lectures establishing core grammar or architectural foundations, is the theory organized around numbered, boxed Principles (`> [!PRINCIPLE]`) that expand each approved rule through relevant code proof and engine deconstruction, using comparison only when it clarifies a real choice or failure? #2026_09_26_19_group_1
- [ ] Do these boxed principles match `01-01-map-principles/{nn}.md` one-to-one in order and operational decision, with no downstream rediscovery of the principle set? #2026_09_26_19_group_1 revised by #2026_09_26_21_group_2
- [ ] Is each principle box copied from the blueprint as finished, with its `[principle-steps]` reasoning left behind in the blueprint? #2026_10_04_10_group_1
- [ ] Are interior reference tables styled as full-width (`table.reference-table`) and kept modular?
- [ ] Does the practical case study (Stage C) contain zero syntax tokens, props, HTML tags, or attributes that were not formally taught and grounded in theory first?

- [ ] PROPER EXAMPLE: Autonomous boxed principle format from a JSX grammar lecture: #2026_09_26_21_group_3

> > [!PRINCIPLE]
> > **Principle N: Align Attribute Names with DOM Properties and Keywords**
> > Attribute names in JSX follow camelCase DOM property conventions like `className` and `htmlFor`. This aligns JSX directly with browser DOM object properties and prevents collisions with JavaScript reserved keywords.
> 
> When the browser parses an HTML document, it instantiates JavaScript objects in memory. In JavaScript, `class` is a reserved keyword for classes, and `for` is a reserved keyword for loops. Decades before React existed, the native browser DOM API named these object properties `element.className` and `labelElement.htmlFor`.
> 
> | **HTML ATTRIBUTE**<br>(raw markup string) | **DOM PROPERTY**<br>(browser element object) | **REACT JSX ATTRIBUTE**<br>(transpiled object key) | **JAVASCRIPT COLLISION MECHANISM**<br>(engine rationale) |
> | :--- | :--- | :--- | :--- |
> | `class` | `element.className` | `className` | ECMAScript reserved keyword `class` used for OOP classes |
> | `for` | `labelElement.htmlFor` | `htmlFor` | ECMAScript reserved keyword `for` used for iterative loops |
> 
> ```jsx title="DOM Property Alignment"
> // JSX Source:
> <label className="field" htmlFor="email-box">Email</label>
> <input id="email-box" tabIndex={0} />
> 
> // Transpiled JavaScript Output:
> _jsx("label", { className: "field", htmlFor: "email-box", children: "Email" });
> _jsx("input", { id: "email-box", tabIndex: 0 });
> ```

Notes: Defines the principle in an authoritative box on line 1, derives DOM object and ECMAScript collision mechanics, provides a reference table, and demonstrates transpiled output before any multi-file case study begins.

## Section Skeleton | 13 | Where You Will Meet This, Glossary & Summary #2026_09_21_19_group_1

- [ ] Is `### Where you will meet this` placed immediately after Stage E, including 3 to 5 concise real-world use cases?
- [ ] Is `### Glossary` placed immediately after `Where you will meet this`, defining 4 to 6 core terms formatted on single lines as `- **Term**: Plain-English definition and concrete engineering role.`?
- [ ] Is `### Summary` placed immediately after the Glossary, written as a practical review of when to write this code and why it matters?
- [ ] Is the summary structured with an authoritative bold title on line 1, followed by `❒ {Subtitle}` category headings and `➔ {DECISION_RULE}` lines formatted as independent paragraphs separated by blank lines?
- [ ] Are actionable decision rules emphasized on dedicated lines starting with `➔` using bold keywords?
- [ ] Are nested sub-points or secondary notes rendered as `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` on continuous lines?

- [ ] PROPER EXAMPLE: Summary decision rules and subtitles separated by blank lines:

> ```markdown
> ### Summary
> 
> **Architectural Takeaways & Decision Matrix**
> 
> ❒ Direct Root Mounting
> 
> ➔ ALWAYS verify that the DOM container element exists before calling `createRoot()` to prevent fatal null pointer exceptions.
> 
> ➔ IF building a single-page application THEN mount the root component once at the application entry point.
> 
> ❒ Multi-Tree Applications
> 
> ➔ ALWAYS isolate independent micro-frontends into separate `createRoot()` trees with dedicated DOM nodes.
> ```

## Practical Example | 14 | Section Title Format & Clean Heading #2026_09_21_02_group_1 revised by #2026_09_21_11_group_1

- [ ] Is the practical example section titled simply and cleanly as `### Let's Design a Practical Example`?
- [ ] Does the heading avoid appending component names, file names, or domain features? #2026_09_21_11_group_1
- [ ] Does the heading avoid generic corporate process labels, reading as an inviting invitation to build?

- [ ] PROPER EXAMPLE: Clean, universal practical example heading:

> ```markdown
> ### Let's Design a Practical Example
> ```

Notes: Inviting, concise, and uncluttered; component names belong in the File Explorer and individual step titles.

## Practical Example | 15 | Stages A & B: Visual Destination & Assembly Pipeline

- [ ] Does Stage A open with the Rendered UI Canvas (` ```components `) showing the completed interface and interactive controls before presenting code?
- [ ] Does the UI Canvas lead directly into the File Explorer (` ```files `) showing the disk hierarchy of files about to be created or inspected?
- [ ] Does Stage B follow immediately with the introductory assembly pipeline figure (`figures/{NN}-01-code-assembly-pipeline.html`), displaying color-coded horizontal stage cards corresponding to the 2 to 4 planned assembly steps? #2026_09_25_05_group_1

## Practical Example | 16 | Stage C: Content-Driven Assembly Step Allocation ($N \in \{2, 3, 4\}$) #2026_09_20_04_group_4 revised by #2026_09_20_26_group_1, #2026_09_21_02_group_1, #2026_09_25_05_group_1, and #2026_09_25_07_group_1

- [ ] Is the practical example structured across 2 to 4 organic sequential steps ($N \in \{2, 3, 4\}$) derived directly from the syllabus experiment in `01-01-map/{nn}.md`: #2026_09_25_07_group_1
    * **4 Steps**: Multi-widget synchronization or parent-to-multiple-children topologies (e.g. parent container + child widget 1 + child widget 2 + app root mount).
    * **3 Steps**: Focused orchestrating container + interactive child/input + consumer/feed.
    * **2 Steps**: Single component declaration + application root mount (strictly reserved for foundational single-component anatomy like Q02).
- [ ] Is the Minimization Fallacy avoided: ensuring the author does NOT collapse a multi-widget experiment (like Q01's greeting + badge synchronization) into 2 steps by dropping one of the required widgets? #2026_09_25_07_group_1
- [ ] Does the example model an authentic, elegant component that a professional tutorial or senior staff engineer would design, capturing the genuine essence of the mechanism rather than a contrived, artificial toy widget? #2026_09_25_05_group_1
- [ ] Does the progression avoid the artificial "4-file shredding" pattern, keeping closely related logic cohesive rather than inventing trivial 2-line helper files or unnatural imports just to fill an arbitrary step quota? #2026_09_25_05_group_1
- [ ] Does each Stage C heading end with the exact file being built, using active collaborative phrasing tailored to the step count (e.g. for 2 steps: `Step 1: First...` / `Step 2: Finally...`; for 3 steps: `Step 1: First...` / `Step 2: Next...` / `Step 3: Finally...`; for 4 steps: `Step 1: First...` / `Step 2: Next...` / `Step 3: Then...` / `Step 4: Finally...`)? #2026_09_21_10_group_1 revised by #2026_09_25_05_group_1
- [ ] Does the final step represent a meaningful architectural milestone (such as completing the feature, wiring the interactive loop, or composing the widget into a realistic consumer feed), avoiding perfunctory boilerplate mounts that teach nothing new? #2026_09_25_05_group_1
- [ ] Are UI building blocks called components, avoiding "presenter" jargon ("pure presenter", "header presenter")? #2026_09_21_10_group_1
- [ ] In Archetype A (Component-Driven Assembly), are components assembled top-down (parent container declaring child prop interfaces first; child components fulfilling props middle; consumer integration sealed last)?
- [ ] Does every code snippet across all steps stay within the 10-line code ceiling with zero leading blank lines, focusing on clean idiomatic component architecture and natural explanatory comments without tildes? #2026_10_03_04_group_1 revised by #2026_10_04_01_group_1

- [ ] PROPER EXAMPLE: Professional, cohesive 3-step component assembly:

> ### Step 1: First, we construct the news banner container <BreakingNewsBanner.jsx>
> ### Step 2: Next, we build the interactive alert input <LiveFeedSubscriber.jsx>
> ### Step 3: Finally, we compose the live newsroom feed <NewsroomFeed.jsx>

Notes: 3 steps; each file represents an authentic component with a load-bearing architectural role; zero trivial helper files.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Artificial 4-file shredding and trivial helper components:

> ### Step 1: First, we construct the outer container <NewsAlert.jsx>
> ### Step 2: Next, we build the headline text <AlertHeadline.jsx>
> ### Step 3: Then, we declare the input control <AlertControls.jsx>
> ### Step 4: Finally, we mount the feature inside <App.jsx>

Notes: Forces 4 files by extracting a 2-line `<h2>` and a single `<input>` into separate files just to fulfill a 4-step quota, resulting in unnatural imports and amateurish code architecture.

## Practical Example | 17 | Stage C: Callback Tracing, Decoupling & Scaffolding Narration #2026_09_21_02_group_1 revised by #2026_09_25_03_group_1

- [ ] Does the commentary in each assembly step deliver meaningful architectural explanations connecting code to developer intent and engine behavior, strictly avoiding mechanical line-by-line recitation or robotic code-mapping formulas? #2026_09_25_03_group_1
- [ ] In component-driven lectures, when a child invokes a callback prop (`onSelect`, `onChange`, `onSubmit`), does prose trace the complete Upward Wire circuit (callback origin, parent declaration, child statelessness, parent memory execution, inverse data flow)?
- [ ] In component-driven lectures, are component boundaries justified using the Negative Counterfactual circuit (what breaks if merged, concrete disaster, physical code invariants, symmetric refactoring proofs)?
- [ ] In scaffolding and tooling lectures, are concrete engine mechanics narrated (what is written to disk, what the browser parses and runs, what runtime failures are eliminated)?

## Practical Example | 18 | Pedagogical Crossroads: Grasping Opportunities to Teach Fundamentals #2026_09_21_12_group_1 revised by #2026_09_21_14_group_1 and #2026_09_22_11_group_1

- [ ] When a step introduces a syntax pattern, architectural choice, or language feature that developers often confuse, does the text pause to teach the fundamental mechanics?
- [ ] Does the crossroad follow the [pedagogical-crossroads](../pedagogical-crossroads/SKILL.md) skill:
    1. Declaring both options upfront in an unordered bullet list with teal arrow markers (`- **Option 1...` and `- **Option 2...`), previewing concrete syntax tokens? #2026_09_22_11_group_1
    2. Maintaining strict lexical consistency across the entire crossroad, avoiding shifting labels?
    3. Presenting the two options in separate, integrated code snippets with symmetric margin comments?
    4. Providing focused prose deconstructing engine behavior, junior pitfalls, and senior architectural trade-offs?

## Practical Example | 19 | Stage D: Component Summary #2026_09_20_09_group_1 revised by #2026_09_21_02_group_1, #2026_09_21_16_group_1, and #2026_09_21_20_group_1

- [ ] Is the practical experiment concluded under the heading `### Component Summary` without trailing subtitles?
- [ ] Does the heading render as a full-width horizontal title across the page with generous vertical space below it?
- [ ] Is the Component Role panel placed immediately below the heading, scoped to the core architecture (maximum 3 items), and rendered bare on the page substrate?
- [ ] Does subsequent prose contrast naive expectations against React 19 reality?

## Practical Example | 20 | Stage E: Architecture Audit Table

- [ ] Does Stage D conclude with Stage E: the dedicated Architecture Audit Table figure (`figures/{NN}-02-architecture-audit.html`)?
- [ ] Is the table structured with an uppercase eyebrow (`LESSONS FROM THE CODE`) and a title naming the lecture's engineering challenge?
- [ ] Does it use a three-column matrix (`Component Layer`, `Naive Expectation`, `What Happened`) with subtle background shading on the reality column?
- [ ] Does it deconstruct the hierarchy across layers built in Stage C and conclude with a verdict row contrasting fragile coupling against modular resilience?

## Component Naming | 21 | Everyday Vocabulary and Clear Roles

- [ ] Are component names chosen from universally understood everyday English words, allowing any developer to instantly picture what the component represents?
- [ ] Are names simplified if a reader cannot immediately picture the on-screen element?

- [ ] PROPER EXAMPLE: Components named with everyday words:

> `SearchBar`, `ArticleTitle`, `SearchSummary`, `CommentSection`, `FeedbackPortal`

Notes: Each name conveys an immediate mental image, allowing the reader to understand the component's role before inspecting its code.

## Component Naming | 22 | Avoid Noun Pileups and Visual Shape Slang

- [ ] Does the naming avoid combining three or more nouns into a single component name?
- [ ] Are components named after what they represent in the application rather than visual shapes or internal jargon (`Badge`, `Ticker`, `Prompter`, `WireCategory`)?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Piling up nouns and visual shape slang:

> `SearchResultsBadge`, `WireStatsBadge`, `ArticlePrompter`, `FeedbackSwitcher`

Notes: Piles up nouns and relies on visual shape jargon rather than meaningful application roles.

## Component Naming | 23 | Name by Role, Not HTML Tags

- [ ] Are components named after their functional role in the user interface rather than raw HTML tags or table coordinates (avoiding `...Row`, `...Cell`, `...Div`, `...Span`):
    * `...Item` for individual list entries (such as `ArticleItem` or `CartItem`).
    * `...Header` for section dividers (such as `CategoryHeader`).

- [ ] PROPER EXAMPLE: Naming by role instead of HTML tags:

> `ArticleItem` instead of `ArticleRow`, `CartItem` instead of `CartItemRow`, `CategoryHeader` instead of `CategoryRow`

Notes: The names describe the functional role of the element, ensuring the name remains accurate even if markup is refactored from table rows to list elements.

## Component Naming | 24 | Standard Genealogical Hierarchy Terms

- [ ] Are standard genealogical terms used when describing component relationships across prose, figures, and UI panels (`parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, and `terminal UI control`)?
- [ ] Are informal or idiosyncratic terms like `leaf component` or `outer shell wrapper` avoided?

## Closing Tables | 25 | Closing Table Placement & Contrast

- [ ] Does the lecture end with the comparison table as the definitive final block of the Markdown file, placed directly under `### Summary`?
- [ ] Is the table centered on a genuine technical contrast comparing the primary mechanism against its nearest alternative?
- [ ] In lectures where no direct alternative exists, is a structured "What to Remember" matrix used mapping core terms to operational invariants?
- [ ] In the summary comparative decision blocks (under `**DO THIS:**` and `**DO NOT DO THIS:**`), are code blocks kept strictly comment-free, obeying workspace law that keeps summary decision cards stark and uncluttered? #2026_10_03_04_group_1

## Closing Tables | 26 | Standard Three-Column Table Shape

- [ ] Is the closing comparison table formatted in a fixed three-column markdown structure:
    1. First header cell empty (`| |`).
    2. Second and third column titles formatted as uppercase names with a one-word lowercase subtitle: `**CAPS**<br>(subtitle)`.
    3. Table alignment divider row set to `| ---: | :--- | :--- |` (right-aligning dimension column, left-aligning content columns).
    4. Every body row starting with a bold dimension title (`**Dimension**`).
- [ ] Are all titles kept inside the header row to ensure clean table rendering in the PDF without duplicate unstyled rows?

- [ ] PROPER EXAMPLE: Standard closing table layout:

> ```markdown
> | | **VANILLA JS**<br>(Manual DOM) | **REACT**<br>(Declarative Components) |
> | ---: | :--- | :--- |
> | **Who updates the DOM** | You, node by node, by hand | React, from the description your component returns |
> | **Reuse** | Copy-paste with different IDs | Components carry their own logic everywhere |
> ```

Notes: Leaves the top-left cell empty, formats headers with capitalized names and subtitles, right-aligns dimensions, and provides direct, concise contrasts.

## Closing Tables | 27 | Inline Code Wrapping in Table Cells

- [ ] Is explanatory prose separated from an inline code string inside table cells using a `<br>` tag placed after the prose?
- [ ] Are multi-expression code strings split across separate inline code spans joined by `<br>` rather than a single long span that wraps mid-token?
- [ ] Is `<br>` placed between separate code spans, avoiding placement inside an inline code span?

- [ ] PROPER EXAMPLE: Splitting code spans cleanly:

> ```markdown
> | **Mounting** | Two-step:<br>`createRoot(node)`<br>`.render(<App />)` | One call: `hydrateRoot` |
> ```

Notes: Each code span remains whole and uninterrupted, avoiding awkward hyphenations and background breaks in print.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Single long code span wrapping mid-expression:

> ```markdown
> | **Mounting** | `createRoot(node).render(<App />)` | One call: `hydrateRoot` |
> ```

Notes: The single long code span wraps mid-expression across narrow column boundaries, creating broken background padding in the PDF.

## Closing Tables | 28 | Pure HTML/Markdown Standard & Anti-LaTeX Syntax #2026_09_22_09_group_1

- [ ] Does the document avoid all LaTeX math syntax (`$...$`, `$$...$$`) and LaTeX commands (`\rightarrow`, `\leftarrow`, `\le`, `\ge`, `\times`, `\cdot`, `\frac`) across all prose, bullets, and table cells?
- [ ] When authoring directional sequences, hierarchies, or life cycles, is the unicode arrow (`→`, U+2192) or descriptive English words ("to", "leads to") used?
- [ ] When rendering mathematical formulas or purity expressions, are they wrapped as inline code spans (e.g. `y = f(x)`, `UI = f(state)`) or written in standard prose?
- [ ] When rendering mathematical inequalities or relational comparisons, are unicode characters (`≤`, `≥`, `≠`) or standard comparison operators (`<=`, `>=`, `!==`) used in code spans?

- [ ] PROPER EXAMPLE: Clean code spans and unicode symbols:

> ```markdown
> | **Purity Guarantee** | Strictly pure function: `y = f(x)` with identical inputs producing identical JSX |
> | **Component Hierarchy** | Top-down tree flow: NewsLayout → ArticleGrid → StoryCard |
> ```

Notes: Uses standard code spans and unicode arrows that render natively without raw dollar signs or LaTeX commands.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Raw unrendered LaTeX math syntax:

> ```markdown
> | **Purity Guarantee** | Strictly pure function: $y = f(x)$ with identical inputs producing identical JSX |
> | **Component Hierarchy** | Top-down tree flow: NewsLayout $\rightarrow$ ArticleGrid $\rightarrow$ StoryCard |
> ```

Notes: Emits raw unrendered dollar signs (`$y = f(x)$`) and broken LaTeX backslash commands (`\rightarrow`) into the output document.
