---
name: lecture-structure
description: Governs the section skeleton, practical example staging, naming, and closing tables of a production lecture; use when assembling or revising lecture structure.
---

# Lecture Structure

This skill governs how a production lecture is assembled: the two-phase workflow, the mandatory section skeleton in its exact order, the 5-stage practical example architecture, component naming rules, and the closing comparison table. It covers structure and placement only; prose wording belongs to `lecture-voice`, code formatting to `code-blocks`, UI panels to `ui-panels`, and standalone HTML figures to `figures`.

Digests: `skills/old-instructions/AUTHOR-BRIEF.md` and `skills/old-instructions/instructions.md` (phases, implementation sequence, format spec).

## Workflow & Phases | 01 | The Pre-Lecture Blueprint Precedes the Lecture

[ ] Author the Phase 1 pre-lecture blueprint in `01-01-md-PRE-lectures/{nn}.md` before authoring any production lecture prose.
[ ] Ensure the blueprint locks the structural skeleton, authorized technical vocabulary, and causal explanation flow before long-form writing begins.
[ ] Mirror the final lecture headings inside the blueprint, mapping every upcoming element into atomic bullets with pedagogical qualifications.
[ ] Treat the approved blueprint as the strict quality gate for Phase 2: revise the blueprint when structural defects are identified rather than improvising patches in the lecture file.
[ ] Plan all five practical example stages (Stages A through E) as concrete elements in the blueprint before drafting code. #2026_09_20_01_group_1 revised by #2026_09_20_05_group_1

## Workflow & Phases | 02 | The Production Lecture Expands the Blueprint

[ ] Write the Phase 2 production lecture in `01-02-md-LECTURES/{n}.md` by systematically expanding the approved pre-lecture blueprint.
[ ] Maintain exact matching between the lecture file number, blueprint number, and question bank row index.
[ ] Deliver comprehensive technical coverage of the assigned mechanism: the production lecture is the primary source of depth for the course, and downstream review materials inherit its definitions.

## Workflow & Phases | 03 | Lecture-First Production Order

[ ] Author the full production lecture before creating any distilled review artifacts or summaries derived from it.
[ ] Following the lecture-first order ensures that distillations reflect a fully resolved mental model rather than guesswork about what matters.
[ ] The lecture is where unfamiliar terminology is unpacked, so downstream materials inherit concepts that are already defined and grounded.

## Workflow & Phases | 04 | Strict Blueprint Traceability

[ ] Trace every paragraph in the production lecture directly back to an element planned in the approved pre-lecture blueprint.
[ ] If a new technical claim, code block, or panel is required, add it to the blueprint first to keep the two files synchronized.
[ ] Ensure that conceptual foundation paragraphs (marked with ◇ in the blueprint) and deep runtime mechanics paragraphs (marked with ★) retain their planned grounding when expanded into the lecture.

## Workflow & Phases | 05 | Verification Gates Run Inside the Workflow

[ ] Pass all pre-lecture verification gates before drafting the production lecture.
[ ] Pass structural traceability and pedagogical clarity gates before marking any lecture complete.
[ ] Treat a clean compiler build (zero warnings) as a baseline format requirement, not as final proof of teaching quality (see the `verification` skill).

## Workflow & Phases | 06 | Topic Fidelity and Architectural Independence

[ ] Dedicate each lecture strictly to answering its assigned interview question from the question bank.
[ ] Expand the specific hook and domain scenario assigned to the question rather than replacing it with generic examples.
[ ] Avoid copying component architectures, code setups, or figures from adjacent lectures: each lecture must feature an example designed specifically for its mechanism.

## Section Skeleton | 07 | Canonical Skeleton Order

[ ] Assemble every production lecture in this exact top-to-bottom sequence:
    1. Document Title: `# Lecture {n}: {Short Title}` on line 1.
    2. Interview Question Callout: `> INTERVIEW QUESTION | ...` on line 2.
    3. The 7 Numbered Opening Beats (bare under the callout).
    4. First Section: `### {Catchy Section Title}` introducing the core problem.
    5. Conceptual Foundation & Mechanism Bridge: `### {Mechanism Name}`.
    6. Practical Example Section: `### Let's Design a Practical Example <Component1> <Component2>`.
       - Stage A: Scaffold UI Canvas (` ```components `) and File Explorer (` ```files `).
       - Stage B: Assembly Pipeline Figure (`figures/{NN}-01-code-assembly-pipeline.html`).
       - Stage C: Sequential Assembly Steps 1 through 4 (top-down construction).
       - Stage D: Lessons from the Experiment (`### Lessons from the Experiment: Naive Expectation vs Reality` with Component Role panel).
       - Stage E: Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`).
    7. Real-World Applications: `### Where you will meet this`.
    8. Reference Glossary: `### Glossary`.
    9. Practical Review: `### Summary`.
    10. Closing Comparison Table: Three-column comparative matrix as the final block of the file.
[ ] Embed at least one standalone HTML figure per lecture adhering strictly to the `figures` skill.

## Section Skeleton | 08 | Document Title Formatting

[ ] Use exactly one `# ` heading per lecture, placed on line 1.
[ ] Follow the standard pattern: `# Lecture {n}: {Short Title}`.
[ ] Match the lecture number `{n}` to the question bank row, and choose a short title that captures the core technical takeaway in plain language.

[ ] PROPER EXAMPLE: make sure you follow this example, matching number and clear title:

> ```markdown
> # Lecture 52: What Makes a Good Key and Why Index Fails
> ```

Notes: The number matches the question bank, and the title states the technical topic clearly.

## Section Skeleton | 09 | Line-2 Interview Question Callout

[ ] Place the interview question callout on line 2, immediately below the document title with no blank line between them.
[ ] Format the callout using the exact syntax: `> INTERVIEW QUESTION | {tier} | {question text}`.
[ ] Copy the question text verbatim from the question bank row.
[ ] Specify the curriculum tier exactly: `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED` (appended with ` (Server)` for server-focused questions).

[ ] PROPER EXAMPLE: make sure you follow this example, the callout line with a server tier:

> ```markdown
> > INTERVIEW QUESTION | ❱ CORE (Server) | What is a Server Component and how does it differ from a Client Component?
> ```

Notes: Placed on line 2, preserves the server tier tag, and quotes the bank question verbatim.

## Section Skeleton | 10 | Semantic Heading Levels

[ ] Use `### ` as the standard heading level for all lecture sections and assembly steps so they flow inline without forcing page breaks.
[ ] Reserve `## ` exclusively for major structural milestones that require a forced page break in the PDF (such as a major part divider in a long lecture).
[ ] The document title on line 1 is always the single `# ` heading in the file.
[ ] Follow the numbered opening beats immediately with the first `### ` heading with no orphan paragraphs between them.

## Section Skeleton | 11 | Standard Body Progression & Engine Mechanics #2026_09_20_04_group_4 revised by #2026_09_20_05_group_1 and #2026_09_20_27_group_1

[ ] Progress the lecture body logically: (1) core engineering problem and native baseline, (2) foundational React mechanism bridge, (3) 5-stage practical example assembly, and (4) architectural comparison and review.
[ ] Deconstruct the underlying browser engine consequences explicitly: in foundational lectures, explain why naive DOM updates fail (for example, showing how replacing HTML with `innerHTML` wipes input focus and resets CSS transitions, whereas React's Virtual DOM and reconciliation preserve node identity and focus). #2026_09_20_27_group_1
[ ] When contrasting two paradigms that modify the same platform default, establish the native baseline in plain prose before introducing either framework approach. #2026_09_20_03_group_1

## Section Skeleton | 12 | Pre-Example Mechanism Bridge #2026_09_20_24_group_1 revised by #2026_09_20_25_group_1

[ ] Never jump directly from high-level problem motivation or philosophical contrast into the practical code assembly section.
[ ] Place a dedicated conceptual section (such as `### Components as Reusable Blueprints` or `### JSX as Compiled JavaScript`) immediately before `### Let's Design a Practical Example...`.
[ ] In foundational lectures, use this section to introduce and deconstruct syntax primitives (such as component functions, prop signatures, evaluation curly braces, and Fragment syntax) before they appear in multi-file code examples.
[ ] In 3 to 4 focused paragraphs, address:
    1. What limitation in plain HTML or vanilla JavaScript does this feature solve?
    2. What is the React mechanism, how is it written, and what happens under the hood?
    3. What is the non-negotiable rule or common syntax trap (such as capitalization for components, single-root return for Fragments, or expression-only rules for curly braces)?
    4. Which files in our practical scenario will demonstrate this mechanism?

[ ] PROPER EXAMPLE: follow this grounded mechanism bridge from Lecture 1:

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

Notes: Teaches the specific syntax and engine rules (components, capitalization, props, nesting) and smoothly bridges into the files of Stage A.

## Section Skeleton | 13 | Where You Will Meet This, Glossary & Summary

[ ] Place `### Where you will meet this` immediately after Stage E and before the Glossary. Include 3 to 5 concise real-world use cases showing how the lecture's concept is applied across production applications.
[ ] Place `### Glossary` immediately after `Where you will meet this`. Define 4 to 6 core terms introduced in the lecture, formatted on single lines as `- **Term**: Plain-English definition and concrete engineering role.` so they render cleanly on a standalone page.
[ ] Place `### Summary` immediately after the Glossary. Write it as an experienced developer's practical review answering when to write this code and why it matters in daily workflows.
[ ] Structure the summary with an authoritative bold title on line 1, followed by `❒ {Subtitle}` category headings with numbered points. Render sub-points as `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` on continuous lines.
[ ] Emphasize actionable decision rules using bold keywords (such as `➔ NEVER / ALWAYS / IF ... THEN ...`).

## Practical Example | 14 | Section Title Format

[ ] Title the practical example section using the exact pattern: `### Let's Design a Practical Example <Component1> <Component2>`, naming the actual components assembled in this lecture.
[ ] Avoid generic corporate process headings (such as "Progressive Assembly: Code Implementation Pipeline"). The heading should read as an invitation to build.

[ ] PROPER EXAMPLE: make sure you follow this example, naming the concrete components:

> ```markdown
> ### Let's Design a Practical Example StoryForm SubmitButton
> ```

Notes: Names the exact components being built so the reader knows what will be assembled.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```markdown
> ### Progressive Assembly: Code Implementation Pipeline
> ```

Notes: Reads like an abstract corporate slide deck instead of a practical engineering tutorial.

## Practical Example | 15 | Stages A & B: Visual Destination & Assembly Pipeline

[ ] Open Stage A with the Rendered UI Canvas (` ```components `) showing the completed interface and interactive controls (`[button: ...]`, `[input: ...]`) before presenting any code.
[ ] Follow the UI Canvas immediately with the File Explorer (` ```files `) showing the disk hierarchy of the files about to be created.
[ ] Embed Stage B immediately following Stage A: include the introductory assembly pipeline figure (`figures/{NN}-01-code-assembly-pipeline.html`), displaying color-coded horizontal stage cards that map directly to the upcoming assembly steps.

## Practical Example | 16 | Stage C: Top-Down Assembly Law #2026_09_20_04_group_4 revised by #2026_09_20_26_group_1

[ ] Author the code assembly in Stage C across 4 collaborative pair-programming steps titled with active phrasing:
    * `### Step 1: First, we construct the parent container ...`
    * `### Step 2: Next, we build the child ...`
    * `### Step 3: Then, we declare ...`
    * `### Step 4: Finally, we seal ...`
[ ] Assemble components strictly top-down:
    * Step 1 builds the parent container and declares the props each child component requires in its JSX before those child components are created.
    * Middle steps construct the child components to receive and render those props.
    * The final step seals the deepest boundary or completes submission handling.
[ ] Ban forward references: every child component mounted in a parent's JSX must have its props and handler interfaces fully declared in Step 1, even if the child's file is coded in a later step.
[ ] In foundational lectures, prefer complete, bite-sized component files over artificially splitting simple components across multiple continuations. #2026_09_20_27_group_1
[ ] Keep each step's code snippet strictly within the 10-line ceiling with zero leading blank lines (per `code-blocks`).

[ ] PROPER EXAMPLE: make sure you follow this example, the four step titles of top-down assembly from Lecture 40:

> ```markdown
> ### Step 1: First, we construct the parent container FeedbackPortal.jsx
> ### Step 2: Next, we build the controlled child LiveSearchInput.jsx
> ### Step 3: Then, we declare the uncontrolled form ArticleCorrectionForm.jsx
> ### Step 4: Finally, we seal the form with native action submission
> ```

Notes: Step 1 builds the parent and dictates data requirements; subsequent steps build children; Step 4 seals the deepest boundary.

[ ] PROPER EXAMPLE: make sure you follow this example, defining child props in Step 1 before the child is built:

> Look at how the parent mounts `<LiveSearchInput query={query} onChange={setQuery} />`. We have not coded the child component `LiveSearchInput` yet. But right here in the parent, we decide what data it needs: the variable `query` to display the search text, and the callback `setQuery` to report keypresses. We will build the component `LiveSearchInput` next in Step 2.

Notes: The child's props are fully defined in the parent's JSX in Step 1, establishing data contracts before the child file is authored.

[ ] COUNTER-EXAMPLE: do not follow this bad example, assembling bottom-up where the parent arrives last:

> ```markdown
> ### Step 1: First, we build the search input component
> ### Step 2: Next, we write the correction form
> ### Step 3: Then, we add the submit button
> ### Step 4: Finally, we mount everything inside the parent App.jsx
> ```

Notes: Children are built in isolation without knowing what the parent will pass, and the parent is reduced to an afterthought mounting step.

## Practical Example | 17 | Stage C: Callback Tracing & Architectural Separation

[ ] When a child component invokes a callback prop (`onSelect`, `onChange`, `onSubmit`), trace the complete Upward Wire circuit:
    1. Ask where the callback originates.
    2. Point back to Step 1 where the parent declared the handler or state setter.
    3. Explain that the child owns no state and merely holds a communication line.
    4. Trace the physical function execution that runs in the parent's memory upon user interaction.
    5. Name the pattern as standard **inverse data flow** (props flow down, actions flow up).
[ ] Justify component boundaries using the Negative Counterfactual circuit:
    1. Ask what breaks if the two responsibilities are merged into one component.
    2. Detail the concrete disaster (such as network logic tangled in navigation buttons).
    3. Define the boundary by what is physically absent in code (`zero useState and zero useEffect`).
    4. Prove decoupling through two symmetric refactoring scenarios (swapping UI touches zero network code; swapping network touches zero UI code).
[ ] Make inter-file relationships explicit: state the exact count and names of components in shared modules, and explain syntax differences (such as curly braces for named exports).

## Practical Example | 18 | Stage D: Lessons from the Experiment #2026_09_20_09_group_1

[ ] Conclude the practical experiment under the heading `### Lessons from the Experiment: Naive Expectation vs Reality`.
[ ] Place the Component Role panel at the opening of Stage D:
    * Use a `component-code` panel in role mode with a meaningful domain title (such as `Summary: The Logic of Nested Components`).
    * Scope the panel to the feature component hierarchy (orchestrating container and direct children, maximum 3 components), omitting outer host shells like `App.jsx`. #2026_09_20_30_group_1
    * Describe each component's architectural role in clear serif prose without code distractions.
[ ] Contrast the naive expectation against the React 19 reality:
    * Explain what a developer instinctively assumes is required (such as manual event interception or complex state synchronization).
    * Contrast with what the working code demonstrated (automatic form actions, clean modularity, and native platform alignment).

## Practical Example | 19 | Stage E: Architecture Audit Table

[ ] Conclude Stage D with Stage E: the dedicated Architecture Audit Table figure (`figures/{NN}-02-architecture-audit.html`).
[ ] Structure the table with an uppercase eyebrow (`LESSONS FROM THE CODE`) and a title naming the lecture's engineering challenge.
[ ] Use a three-column matrix: `Component Layer`, `Naive Expectation (Legacy Approach)`, and `What Happened (React 19 Reality)`.
[ ] Apply subtle background shading on the reality column to highlight the modern pattern.
[ ] Deconstruct the component hierarchy across the layers built in Stage C (parent container, intermediate coordinators, terminal UI controls).
[ ] Conclude the audit table with a verdict row contrasting fragile coupling in red uppercase against modular resilience in teal uppercase.

## Component Naming | 20 | Everyday Vocabulary and Clear Roles

[ ] Choose component names from universally understood everyday English words. Any developer should instantly picture what the component represents.
[ ] Reject names that fail the everyday-words test, even if they sound technically sophisticated: if a reader cannot immediately picture the on-screen element, the name must be simplified.

[ ] PROPER EXAMPLE: make sure you follow this example, components named with everyday words:

> `SearchBar`, `ArticleTitle`, `SearchSummary`, `CommentSection`, `FeedbackPortal`

Notes: Each name conveys an immediate mental image, allowing the reader to understand the component's role before inspecting its code.

## Component Naming | 21 | Avoid Noun Pileups and Visual Shape Slang

[ ] Avoid combining three or more nouns into a single component name. Compound names force the reader to decode language before understanding code.
[ ] Avoid naming components after visual shapes or internal jargon (such as `Badge`, `Ticker`, `Prompter`, or `WireCategory`). Name components after what they represent in the application.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> `SearchResultsBadge`, `WireStatsBadge`, `ArticlePrompter`, `FeedbackSwitcher`

Notes: Piles up nouns and relies on visual shape jargon rather than meaningful application roles.

## Component Naming | 22 | Name by Role, Not HTML Tags

[ ] Never name components after raw HTML tags or table coordinates (avoid `...Row`, `...Cell`, `...Div`, or `...Span`).
[ ] Name components after their functional role in the user interface:
    * Use `...Item` for individual list entries (such as `ArticleItem` or `CartItem`).
    * Use `...Header` for section dividers (such as `CategoryHeader`).

[ ] PROPER EXAMPLE: make sure you follow this example, naming by role instead of HTML tags:

> `ArticleItem` instead of `ArticleRow`, `CartItem` instead of `CartItemRow`, `CategoryHeader` instead of `CategoryRow`

Notes: The names describe the functional role of the element, ensuring the name remains accurate even if markup is refactored from table rows to list elements.

## Component Naming | 23 | Standard Genealogical Hierarchy Terms

[ ] Use standard genealogical terms when describing component relationships across prose, figures, and UI panels.
[ ] Supported genealogical terms: `parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, and `terminal UI control`.
[ ] Avoid informal or idiosyncratic terms like `leaf component` or `outer shell wrapper` when standard genealogical terms apply.

## Closing Tables | 24 | Closing Table Placement & Contrast

[ ] End every lecture with the comparison table as the definitive final block of the Markdown file, placed directly under `### Summary`.
[ ] Center the table on a genuine technical contrast: compare the lecture's primary mechanism against its nearest alternative (such as `useState` vs `useRef`, controlled vs uncontrolled inputs, or Server vs Client Components).
[ ] In rare lectures where no direct alternative exists, use a structured "What to Remember" matrix mapping core terms to their operational invariants.

## Closing Tables | 25 | Standard Three-Column Table Shape

[ ] Format the closing comparison table in a fixed three-column markdown structure:
    1. Leave the first header cell empty (`| |`).
    2. Format the second and third column titles as uppercase names with a one-word lowercase subtitle: `**CAPS**<br>(subtitle)`.
    3. Set the table alignment divider row strictly to `| ---: | :--- | :--- |` (right-aligning the first dimension column, and left-aligning the two content columns).
    4. Start every body row with a bold dimension title (`**Dimension**`).
[ ] Keep all titles inside the header row to ensure clean table rendering in the PDF without duplicate unstyled rows.

[ ] PROPER EXAMPLE: make sure you follow this example, the standard closing table layout:

> ```markdown
> | | **VANILLA JS**<br>(Manual DOM) | **REACT**<br>(Declarative Components) |
> | ---: | :--- | :--- |
> | **Who updates the DOM** | You, node by node, by hand | React, from the description your component returns |
> | **Reuse** | Copy-paste with different IDs | Components carry their own logic everywhere |
> ```

Notes: Leaves the top-left cell empty, formats headers with capitalized names and subtitles, right-aligns dimensions, and provides direct, concise contrasts.

## Closing Tables | 26 | Inline Code Wrapping in Table Cells

[ ] Separate explanatory prose from an inline code string inside table cells using a `<br>` tag placed after the prose.
[ ] In narrow PDF table columns, a long code span attached to prose wraps mid-token into broken grey background fragments.
[ ] When rendering multi-expression code, split the code across separate inline code spans joined by `<br>` rather than a single long span.
[ ] Place `<br>` between separate code spans, never inside an inline code span.

[ ] PROPER EXAMPLE: make sure you follow this example, splitting code spans cleanly:

> ```markdown
> | **Mounting** | Two-step:<br>`createRoot(node)`<br>`.render(<App />)` | One call: `hydrateRoot` |
> ```

Notes: Each code span remains whole and uninterrupted, avoiding awkward hyphenations and background breaks in print.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```markdown
> | **Mounting** | `createRoot(node).render(<App />)` | One call: `hydrateRoot` |
> ```

Notes: The single long code span wraps mid-expression across narrow column boundaries, creating broken background padding in the PDF.
