---
name: lecture-structure
description: Governs the section skeleton, practical example staging, naming, and closing tables of a production lecture; use when assembling or revising lecture structure.
---

# Lecture Structure

This skill governs how a production lecture is assembled: the two-phase workflow, the section skeleton in its exact order, the staging of the practical example, component naming, and the closing comparison table. It covers structure and placement only; the wording inside each section belongs to the lecture-voice skill, code formatting to the code-blocks skill, and panel and figure syntax to the ui-panels skill.

Digests: skills/old-instructions/AUTHOR-BRIEF.md and instructions.md (phases, implementation sequence, format spec)

## Phases | 01 | Blueprint before lecture

[ ] Author the Phase 1 pre-lecture blueprint in `md-pre-lectures/{nn}.md` before any production lecture work, so structure, vocabulary, and causal flow are locked before long-form writing begins.
[ ] Have the pre-lecture blueprint mirror the final lecture headings and map every upcoming element into atomic bullets with in-situ pedagogical qualifications, so the production lecture expands a verified plan rather than improvising one.
[ ] Treat the approved blueprint as the gate for Phase 2: prefer revising the blueprint over patching structure directly in the production lecture, so the two files stay in sync.
[ ] Have the blueprint map the five practical example stages as concrete planned elements, so the staging crosses into the lecture as a planned build rather than being designed at lecture time (see the pre-lecture skill, Staging). #2026_09_20_01_group_1 revised by #2026_09_20_05_group_1

## Phases | 02 | Production lecture expands the blueprint

[ ] Write the Phase 2 production lecture in `md-lectures/{n}.md` from the approved pre-lecture blueprint, keeping the same numbering as the question bank row it answers.
[ ] Aim for comprehensive coverage of the mechanism, because the lecture is the source of depth for the whole project and a thin lecture produces thin downstream artifacts.

## Phases | 03 | Lecture-first order

[ ] Write the lecture before any distilled review artifact derived from it, so the distillation reflects a complete mental model instead of a guess at what matters.
[ ] Keep the lecture-first order because compressing before exploring tends to produce shallow bullets that name the mechanism without teaching it; the lecture is also where unfamiliar terminology gets unpacked, so later artifacts inherit terms that are already defined.

## Phases | 04 | Every lecture paragraph traces to the blueprint

[ ] Trace every paragraph in the production lecture back to an element in the approved pre-lecture blueprint, so nothing enters the lecture unplanned.
[ ] Add a new technical claim to the blueprint first, then write it into the lecture, so the two files never drift apart.
[ ] Let a ★ paragraph keep its preknowledge recap when it crosses from the blueprint into the lecture (see the pre-lecture skill), so the reader gets the same grounding in both files.

## Phases | 05 | Gates run inside the workflow, not after it

[ ] Pass the pre-lecture gate before the production lecture is written, so the lecture expands a verified plan rather than an unverified guess.
[ ] Pass the traceability and pedagogy gates before the lecture is called done, so done means taught, not just typed.
[ ] Treat a clean build alone as never meaning done, because zero warnings certifies format, not teaching quality (see the verification skill).

## Skeleton | 06 | Exact skeleton order

[ ] Assemble every production lecture in this exact order: the `#` title line, the interview question callout line, the numbered opening beats, the first `###` section, the body sections, `### Where you will meet this`, `### Glossary`, `### Summary`, and the closing comparison table as the last block of the file.
[ ] Place the Component Explorer panel after the prose that names the visual arrangement and before the first code block that implements the mechanism, with its syntax and rules owned by the ui-panels skill.
[ ] Embed at least one standalone HTML figure per lecture, authored and placed per the ui-panels skill.
[ ] Route the opening beats' wording and sentence rules to the lecture-voice skill; this skill only fixes where the beats sit and what follows them.

## Skeleton | 07 | Title line

[ ] Use exactly one `# ` heading per lecture, as the first line, in the pattern `# Lecture {n}: {Short Title}`, because the renderer uses this line as the page title and the entry heading in the course reader.

[ ] PROPER EXAMPLE: make sure you follow this example, the title line pattern with its number matched to the question bank row:

> ```markdown
> # Lecture 52: What Makes a Good Key and Why Index Fails
> ```

Notes: the lecture number matches the question row, and the short title names the chapter's idea in plain words a tired reader can hold onto.

## Skeleton | 08 | Interview question callout

[ ] Put the interview question on line 2, immediately after the title, as `> INTERVIEW QUESTION | {tier} | {question text}`, copying the question verbatim from the question bank row, so the build can render it as the pull-quote callout directly below the title.
[ ] Carry the tier exactly as the row does: `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`, with the ` (Server)` suffix on React Server questions, because the typology badge in the rendered callout depends on it.

[ ] PROPER EXAMPLE: make sure you follow this example, the callout line with a server-tier question:

> ```markdown
> > INTERVIEW QUESTION | ❱ CORE (Server) | What is a Server Component and how does it differ from a Client Component?
> ```

Notes: the tier keeps its server suffix and the question text is copied verbatim, so the rendered badge and pull-quote match the bank exactly.

## Skeleton | 09 | First section follows the opening beats directly

[ ] Follow the numbered opening beats immediately with the first `### ` section: a catchy title that names the chapter's idea, then the paragraphs that open the teaching and lead into the first code.
[ ] Avoid leaving a bare paragraph between the beats and the first heading, so the rendered opening-beats section closes cleanly and the body begins at a heading.

## Skeleton | 10 | Heading levels carry structure

[ ] Use `### ` as the default section heading, because it flows inline without forcing a page break.
[ ] Reserve `## ` for genuine page boundaries such as a `## Beyond the basics` audit section or a major part boundary inside a long lecture, because every `## ` forces the PDF to start a new page; aim for at most one or two per lecture.
[ ] Apply the quick test: if the heading introduces a new subsection of the current lecture and the section should flow inline, it is `### `; if the next page should start at that heading, it is `## `; the title at the top is always `# `.

## Skeleton | 11 | Standard body progression

[ ] Order the lecture body as: (1) component architecture and explorer introducing the application layout and the paradigm shift, (2) `### Let's Design a Practical Example` with its five stages, (3) architectural comparison and review, so the reader builds the working system first and then reads the comparative analysis, with each stage building on the one before it. #2026_09_20_04_group_4 revised by #2026_09_20_05_group_1
[ ] When the lecture contrasts two paradigms that both modify one platform default, establish that shared default in plain prose before the first paradigm is defined, so the first paradigm reads as a departure from the default and the baseline never hides inside the second paradigm's section. #2026_09_20_03_group_1

## Skeleton | 12 | Where you will meet this placement

[ ] Place `### Where you will meet this` right before `### Summary`, holding 3 to 5 one-line uses of today's concept in real apps the reader knows, because this is the one sanctioned widening of the lecture's world beyond The National Times.
[ ] Make each line one pictureable moment plus what the concept does there, a concrete situation rather than an abstract category, with the first line allowed to be tonight's own case.

## Skeleton | 13 | Glossary placement

[ ] Place `### Glossary` directly after `### Where you will meet this` and immediately before `### Summary`, defining 4 to 6 core terms, so the glossary renders on its own dedicated standalone page in the PDF.
[ ] Format each term on a single continuous line as `- **Term**: Plain-English definition and concrete engineering role.`, so the rendered term cards stay clean.

## Skeleton | 14 | Plain-talk summary structure

[ ] Write `### Summary` as a plain-talk review from an experienced developer's daily perspective, answering when the reader will actually write this code and why it matters in daily practice.
[ ] Open the summary body with an authoritative **Technical Title** in bold on its own line, followed by an empty line before the opening paragraph.
[ ] Break the summary into `❒ {Subtitle}` section headers, numbered points under each, and sub-points as `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` kept on one continuous line, so the PDF never hard-wraps.
[ ] Mark core principles with the `➔ NEVER / ALWAYS / IF ... THEN ...` pattern and bold load-bearing words in every bullet, so the summary stays skimmable in roughly one page.

## Skeleton | 15 | Topic fidelity and architectural independence

[ ] Dedicate every lecture strictly to its own interview question from the question bank, growing the hook it was given rather than replacing it, so each lecture earns its own number.
[ ] Avoid cloning code setups, components, or diagrams from adjacent lectures, so two lectures never answer their questions with the same example.

## Practical Example | 16 | Section title format

[ ] Title the implementation section exactly `### Let's Design a Practical Example <Component1> <Component2>`, naming the actual components of this lecture's example in the title.
[ ] Avoid over-engineered corporate jargon headings for this section, so it reads as an invitation to build rather than a process document.

[ ] PROPER EXAMPLE: make sure you follow this example, the practical example title naming the two components being built:

> ```markdown
> ### Let's Design a Practical Example StoryForm SubmitButton
> ```

Notes: the heading names the two concrete components the steps will assemble, so the reader knows exactly what they are about to build.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```markdown
> ### Progressive Assembly: Code Implementation Pipeline
> ```

Notes: it names a process instead of the components, and it reads like a slide deck rather than a pair-programming session.

## Practical Example | 17 | Stage A scaffold and file explorer

[ ] Open the practical example with the Rendered UI Canvas: a snippet-free `components` panel in canvas mode showing the finished interface before any code appears, so the reader sees the destination before the road (panel modes owned by the ui-panels skill). #2026_09_20_04_group_4
[ ] Follow with the Stage A scaffold: introduce the component roles and the disk hierarchy via the `files` panel tailored to this specific lesson, with the panel syntax owned by the ui-panels skill.
[ ] Keep the scaffold specific to the lesson, so the reader meets exactly the files the upcoming steps will create.

## Practical Example | 18 | Stage B assembly pipeline figure

[ ] Follow with Stage B: embed the introductory assembly pipeline figure, `figures/{NN}-01-code-assembly-pipeline.html`, with color-coded horizontal stage cards whose roles mirror this lesson's collaborative step sequence, authored per the ui-panels skill.
[ ] Place the pipeline before any syntax appears, so the reader holds the roadmap while reading the steps.

## Practical Example | 19 | Stage C sequential steps

[ ] Walk the code assembly in Stage C using the collaborative 4-step pair-programming title sequence, so the reader feels guided rather than lectured.
[ ] Assemble top-down: Step 1 constructs the parent container and establishes every child's contract in its JSX before any child exists, the middle steps fulfill those contracts one component at a time, and the final step seals the deepest boundary instead of mounting the parent, so the architecture is dictated before it is populated. #2026_09_20_04_group_4
[ ] Ban forward references that defer a contract to a later step: every child introduced in a parent's JSX gets its contract established in the same step, even when the child's own file is built later. #2026_09_20_04_group_4

[ ] PROPER EXAMPLE: make sure you follow this example, the four step titles of the top-down assembly, from Lecture 40:

> ```markdown
> ### Step 1: First, we construct the parent container FeedbackPortal.jsx
> ### Step 2: Next, we build the controlled child LiveSearchInput.jsx
> ### Step 3: Then, we declare the uncontrolled form ArticleCorrectionForm.jsx
> ### Step 4: Finally, we seal the form with native action submission
> ```

Notes: Step 1 constructs the parent and dictates the data architecture; steps 2 and 3 fulfill the contracts the parent wrote; step 4 seals the form boundary, the deepest layer, instead of mounting the parent.

[ ] PROPER EXAMPLE: make sure you follow this example, the contract established inside Step 1 for a child that does not exist yet, from Lecture 40:

> Now look at line 6: `<LiveSearchInput query={query} onChange={setQuery} />`. We have not coded `LiveSearchInput` yet. But right here in the parent, we establish its contract. The parent owns the search text, and passes a callback so the child can report keypresses. We will build that child next in step 2.

Notes: the child's file comes later, but its contract is fully established in the parent's JSX in Step 1, and the forward link names exactly where it will be fulfilled. This is what top-down means: the parent dictates, the children comply.

- [ ] Deconstruct callback invocations in child steps using the Upward Wire Standard: when a child component calls a function passed from its parent, the prose must not treat the call as self-evident; it must trace back to the parent's Step 1 JSX contract, name the parent setter being invoked, and explain the inverse data flow (see the lecture-voice skill, The Upward Wire Law). #2026_09_20_06_group_1

[ ] PROPER EXAMPLE: make sure you follow this example, fulfilling and deconstructing a callback contract in Step 2, from Lecture 38: #2026_09_20_06_group_1

> Look at the button click handler on line 6: `onClick={() => onSelect(room)}`.
> 
> Where does `onSelect` come from? Look back at Step 1 in `ChatWorkspace.jsx`. The parent declared `const [roomId, setRoomId] = useState('general')`, and then rendered: `<ChannelSelector activeRoom={roomId} onSelect={setRoomId} />`.
> 
> Notice what happened: the parent handed its private updater function `setRoomId` to the child under the prop name `onSelect`. `ChannelSelector` does not own state, and it does not know what `roomId` is used for. It only holds a telephone line called `onSelect`.
> 
> When the reporter clicks a button, the native browser `onClick` fires and calls `onSelect(room)`. Because `onSelect` points directly to `setRoomId`, that call immediately executes `setRoomId('politics')` back in `ChatWorkspace`.
> 
> This is standard **inverse data flow**: data flows down through props (`activeRoom`), and user actions flow up through callbacks (`onSelect`).

Notes: Step 1 established the contract (`onSelect={setRoomId}`); Step 2 fulfills it by calling `onSelect(room)` and tracing the physical execution back to the parent's `setRoomId`. The circuit is complete in both directions.

- [ ] Justify architectural separation in steps using The Negative Counterfactual Law: when explaining why two responsibilities are separated across components (e.g., UI controls vs. side-effects), the prose must not rely on vague praise (*"the cleanest architecture keeps X separate from Y"*); it must state what breaks if you merge them, define the boundary by physical code invariants (*"zero useState, zero useEffect"*), and prove decoupling by showing that modifying UI touches zero network code and modifying network touches zero UI code (see the lecture-voice skill, The Negative Counterfactual Law). #2026_09_20_07_group_1

[ ] PROPER EXAMPLE: make sure you follow this example, justifying architectural separation in Step 2, from Lecture 38: #2026_09_20_07_group_1

> What would happen if `ChannelSelector` opened the websocket connection itself?
> 
> If you put the `useEffect` or socket connection inside `ChannelSelector`, the navigation buttons would be trapped managing network sockets, reconnection timers, and message buffers. Worse, the chat message area in `ChatRoom` would have no way to access that socket without messy prop-drilling or global state hacks. You would have buttons and network protocols tangled in a single file.
> 
> By separating them, `ChannelSelector` owns zero `useState` and zero `useEffect`. It is a pure presenter: given the same `activeRoom` string and `onSelect` callback, it will always render the exact same three buttons.
> 
> This separation gives you two concrete superpowers:
> 1. If tomorrow you replace the button pills with a dropdown `<select>` menu, you touch zero lines of websocket code.
> 2. If you swap the websocket protocol in `ChatRoom` for a mock test service, you touch zero lines of button code.

Notes: Instead of vague praise, the text poses the obvious merge question, details the concrete disaster (trapped socket, unreachable chat area), defines the presenter by physical code absence (zero useState, zero useEffect), and proves decoupling with symmetric refactoring scenarios.

[ ] COUNTER-EXAMPLE: do not follow this bad example, the bottom-up shape where the parent arrives last:

> ```markdown
> ### Step 1: First, we build the search input component
> ### Step 2: Next, we write the correction form
> ### Step 3: Then, we add the submit button
> ### Step 4: Finally, we mount everything inside the parent App.jsx
> ```

Notes: the children are built with no contract to fulfill, and the parent is reduced to a mounting step at the end, so the architecture is discovered instead of dictated.

[ ] Keep each step's runnable snippet within the 10-line ceiling with zero leading empty lines, per the code-blocks skill.
[ ] Phrase step titles as natural, active, practical developer actions rather than stiff pseudo-compiler phrasing, per the lecture-voice skill.

## Practical Example | 20 | Stage D lessons from the experiment

[ ] Conclude the experiment with Stage D under the heading `### Lessons from the Experiment: Naive Expectation vs Reality`. #2026_09_20_09_group_1
[ ] Carry the Component Role panel at the head of Stage D: a `component-code` panel in role mode with a meaningful domain title (e.g. `Summary: The Logic of Nested Components`) explaining each component's responsibilities in serif prose without code distractions, so the lessons that follow have the hierarchy on record (panel modes owned by the ui-panels skill). #2026_09_20_04_group_4 revised by #2026_09_20_09_group_1
[ ] Detail what the naive expectation would have been, meaning the classical mental model, manual state hooks, or imperative event-interception routines developers instinctively assume are required.
[ ] Contrast it against what the experiment showed, meaning the modern React 19 engine reality, platform alignment, and clean modularity proven by the working code, so the lesson lands as a before and after rather than a verdict from nowhere.

## Practical Example | 21 | Stage E concluding lessons comparison table

[ ] Close the practical example with Stage E: the dedicated Architecture Audit Table, `figures/{NN}-02-architecture-audit.html`, as the definitive final step of the code showcase, authored per the ui-panels skill.
[ ] Build it with the uppercase eyebrow `LESSONS FROM THE CODE`, a title naming this lecture's concrete domain challenge, and a three-column comparative matrix of `Component Layer`, `Naive Expectation (Legacy Approach)`, and `What Happened (React 19 Reality)` with subtle shading on the reality column.
[ ] Deconstruct the hierarchy across the layers relevant to this lesson, meaning the parent, intermediate boundaries, and terminal UI control, using the genealogical naming from this skill.
[ ] End the table with a final verdict row contrasting fragile coupling in red uppercase against bulletproof modularity in teal uppercase, and calibrate padding and font sizes so the table and its caption fit on a single PDF page.

## Naming | 22 | The everyday-words naming rule

[ ] Choose component names from the simplest, universally understood everyday vocabulary, words any reader knows, so the name carries the mental picture by itself.
[ ] Treat a failed everyday-words check, meaning a reader has no clue what the word refers to, as a signal the name is wrong even if it sounds precise to an engineer.

[ ] PROPER EXAMPLE: make sure you follow this example, names that pass the everyday-words check:

> `SearchBar`, `ArticleTitle`, `SearchSummary`, `CommentSection`, `FeedbackApp`

Notes: each name is one everyday idea any reader immediately pictures, so the reader decodes the component before reading a line of its code.

## Naming | 23 | Avoid pileups and visual-shape names

[ ] Avoid combining three nouns into one component name, so the reader is not forced to decode a compound before understanding the code.
[ ] Avoid CSS visual shapes and insider slang as component identities, names like `Badge`, `Ticker`, `Prompter`, or `WireCategory`, because the reader has to translate them into a real thing first.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> `SearchResultsBadge`, `WireStatsBadge`, `ArticlePrompter`, `FeedbackSwitcher`

Notes: each name either piles up nouns, names a visual shape, or reaches for jargon the reader does not own, and the decoded meaning arrives too late to help.

## Naming | 24 | Name by role, not by HTML tag

[ ] Avoid naming a component after an HTML tag or a spreadsheet coordinate, patterns like `...Row`, `...Cell`, `...Div`, or `...Span`, because the tag is presentation and the name should say what the thing is.
[ ] Prefer `...Item` for individual entries, for example `ArticleItem` or `CartItem`, and `...Header` for section dividers, for example `CategoryHeader`, so the name describes the thing's role in the interface rather than its markup.

[ ] PROPER EXAMPLE: make sure you follow this example, the swaps from tag names to role names:

> `ArticleItem` instead of `ArticleRow`, `CartItem` instead of `CartItemRow`, `CategoryHeader` instead of `CategoryRow`

Notes: each corrected name describes the thing's role in the interface, not the HTML tag it happens to render as, so the name survives a markup refactor.

## Naming | 25 | Genealogical terms, not leaf

[ ] Name components and describe component relationships with the official family terms: parent, child, nested child, grandchild, ancestor, descendant, terminal UI control (the full vocabulary law lives in the ui-panels skill).

## Tables | 26 | Closing table as the last block

[ ] End every lecture with `### Summary` followed by the comparison table as the last block of the file, so the "what makes this different" point is the visual anchor the reader leaves with.
[ ] Contrast the lecture's mechanism against its nearest alternative, for example `useState` vs `useRef`, controlled vs uncontrolled inputs, or Server vs Client Components, so the table has a genuine tension to resolve.
[ ] When the lecture genuinely has no meaningful contrast, substitute a "what to remember" two-column table of term to one-line definition, keeping the same alignment as the standard shape.

## Tables | 27 | Exact table shape

[ ] Build the closing table in the fixed three-column shape: the first header cell always empty, column titles formatted as `**CAPS**` plus `<br>` plus a one-word subtitle, the divider row exactly `| ---: | :--- | :--- |`, and every body row starting with a bold dimension.
[ ] Keep titles in the markdown header row only, because the header renders as the real table head and a title placed in a body row produces a duplicate unstyled strip.

[ ] PROPER EXAMPLE: make sure you follow this example, the fixed closing table skeleton:

> ```markdown
> | | **VANILLA JS**<br>(Manual DOM) | **REACT**<br>(Declarative Components) |
> | ---: | :--- | :--- |
> | **Who updates the DOM** | You, node by node, by hand | React, from the description your component returns |
> | **Reuse** | Copy-paste with different IDs | Components carry their own logic everywhere |
> ```

Notes: the empty first header cell blanks the top-left corner by design, each column title pairs a caps title with a one-word subtitle, the divider right-aligns the dimension column so dimensions read as sub-headings, and the shape renders identically in every lecture.

## Tables | 28 | Code wrapping inside table cells

[ ] Separate explanatory prose from an inline code string with `<br>` placed after the prose, because table columns in the PDF are narrow and a code chip left attached to prose wraps mid-token into fragmented grey boxes.
[ ] Split long or multi-part code across separate inline code spans joined by `<br>`, for example `createRoot(node)` and `.render(<App />)` as two spans, and place `<br>` between distinct spans rather than inside any span.

[ ] PROPER EXAMPLE: make sure you follow this example, code broken across spans inside a cell:

> ```markdown
> | **Mounting** | Two-step:<br>`createRoot(node)`<br>`.render(<App />)` | One call: `hydrateRoot` |
> ```

Notes: each code span stays whole, the `<br>` sits between spans and never inside one, and no chip breaks mid-token in the narrow PDF column.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```markdown
> | **Mounting** | `createRoot(node).render(<App />)` | One call: `hydrateRoot` |
> ```

Notes: the single long code span wraps mid-expression in the narrow column, and the renderer breaks the grey background into dangling padding fragments that read as broken.
