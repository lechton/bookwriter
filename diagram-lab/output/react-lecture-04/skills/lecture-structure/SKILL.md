---
name: lecture-structure
description: Governs the section skeleton, information-flow sections, practical example staging, naming, and closing tables of a production lecture; use when assembling or revising lecture structure.
---

# Lecture Structure

This skill governs how a production lecture is assembled: the two-phase workflow, the section skeleton in its exact order, the information-flow phased text, the staging of the practical example, component naming, and the closing comparison table. It covers structure and placement only; the wording inside each section belongs to the lecture-voice skill, code formatting to the code-blocks skill, and panel and figure syntax to the ui-panels skill.

Digests: skills/old-instructions/AUTHOR-BRIEF.md and instructions.md (phases, information flow, implementation sequence, format spec)

## Phases | 01 | Blueprint before lecture

[ ] Author the Phase 1 pre-lecture blueprint in `md-pre-lectures/{nn}.md` before any production lecture work, so structure, vocabulary, and causal flow are locked before long-form writing begins.
[ ] Have the pre-lecture blueprint mirror the final lecture headings and map every upcoming element into atomic bullets with in-situ pedagogical qualifications, so the production lecture expands a verified plan rather than improvising one.
[ ] Treat the approved blueprint as the gate for Phase 2: prefer revising the blueprint over patching structure directly in the production lecture, so the two files stay in sync.
[ ] Have the blueprint map the five practical example stages and the 4-phase information flow as concrete planned elements, so the staging crosses into the lecture as a planned build rather than being designed at lecture time (see the pre-lecture skill, Staging). #2026_09_20_01_group_1

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

[ ] Order the lecture body as: (1) component architecture and explorer introducing the application layout and the paradigm shift, (2) `### Let's Design a Practical Example` with its five stages, (3) the information flow lifecycle, (4) architectural comparison and review, so the reader builds the working system first and then reads the phased flow that explains it, with each stage building on the one before it. #2026_09_20_04_group_4
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

## Information Flow | 16 | Phased text beside the diagram

[ ] Give every lecture that explains component data flow, async form transitions, or ambient state a dedicated phased text section following the 4-Phase Protocol, so the reader does not depend on an abstract diagram alone.
[ ] Treat the phased section as the place where the runtime story is actually told, because boxes and arrows on their own tend to obscure the underlying mechanics.

## Information Flow | 17 | Phase shape

[ ] Organize the flow into distinct numbered phases, `#### Phase 1: ...` through `#### Phase 4: ...`, each containing exactly 3 to 4 concise bullet points.
[ ] Open every bullet with a bold micro-lead that summarizes the takeaway, so a tired reader can reconstruct the whole flow by skimming the micro-leads alone.
[ ] Avoid long dense prose paragraphs inside the phased section, because the format's value is its scannability.

## Information Flow | 18 | Standard terminology only

[ ] Use official React and web platform terminology in the phased section, for example `Context Provider`, `prop drilling`, `native browser event`, `event bubbling`, `server action`, `re-render`, `ancestor`, `descendant`, `FormData`, `Transition`, so the reader's vocabulary matches the docs and the interview table.
[ ] Avoid creative metaphors such as radio tower, Wi-Fi bubble, or ambient receiver, so the reader is never taught a word they cannot use anywhere else.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> The Context Provider acts like a radio tower broadcasting state to every receiver in range.

Notes: the picture is vivid but the vocabulary is invented, so the reader can neither find it in official docs nor say it to an interviewer; the standard term plus an inline parenthetical gloss does the same job without the debt.

## Information Flow | 19 | Inline parenthetical gloss

[ ] Scan every technical term in the phased section and, on its introduction, follow it with a 4-to-10 word plain-English explanation enclosed in parentheses right next to it, so a tired reader is not forced to leave the page to look up jargon.

[ ] PROPER EXAMPLE: make sure you follow this example, the gloss shape placed directly next to its term:

> `re-render (executing the component function again to compute updated visual HTML on screen)`

Notes: the term stays standard, the gloss is short and physical, and the reader keeps reading without friction; the same shape applies to terms like `nested (placed inside multiple layers of components)` or `server action (an asynchronous background function running on the server to process form data)`.

## Information Flow | 20 | Phases adapt to the mechanism

[ ] Adapt the four phases to the physical and logical lifecycle of the specific mechanism being taught, so the phase titles describe that mechanism rather than a generic template.
[ ] Use the topic cadences as the model: for form actions the phases run from the submit trigger, through FormData harvesting from named fields, into the background transition execution, and end with the automatic input reset; for `useFormStatus` they run from the native submit event bubbling upward, the form becoming an automatic Context Provider, the button consuming the form context, and the laser-focused component update.

## Practical Example | 21 | Section title format

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

## Practical Example | 22 | Stage A scaffold and file explorer

[ ] Open the practical example with the Rendered UI Canvas: a snippet-free `components` panel in canvas mode showing the finished interface before any code appears, so the reader sees the destination before the road (panel modes owned by the ui-panels skill). #2026_09_20_04_group_4
[ ] Follow with the Stage A scaffold: introduce the component roles and the disk hierarchy via the `files` panel tailored to this specific lesson, with the panel syntax owned by the ui-panels skill.
[ ] Keep the scaffold specific to the lesson, so the reader meets exactly the files the upcoming steps will create.

## Practical Example | 23 | Stage B assembly pipeline figure

[ ] Follow with Stage B: embed the introductory assembly pipeline figure, `figures/{NN}-01-code-assembly-pipeline.html`, with color-coded horizontal stage cards whose roles mirror this lesson's collaborative step sequence, authored per the ui-panels skill.
[ ] Place the pipeline before any syntax appears, so the reader holds the roadmap while reading the steps.

## Practical Example | 24 | Stage C sequential steps

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

## Practical Example | 25 | Stage D direct lessons

[ ] Conclude the experiment with Stage D under the heading `### Direct Lessons from the Experiment: Naive Expectation vs Reality`.
[ ] Carry the Component Role panel at the head of Stage D: a `component-code` panel in role mode explaining each component's responsibilities in serif prose without code distractions, so the lessons that follow have the hierarchy on record (panel modes owned by the ui-panels skill). #2026_09_20_04_group_4
[ ] Detail what the naive expectation would have been, meaning the classical mental model, manual state hooks, or imperative event-interception routines developers instinctively assume are required.
[ ] Contrast it against what the experiment showed, meaning the modern React 19 engine reality, platform alignment, and clean modularity proven by the working code, so the lesson lands as a before and after rather than a verdict from nowhere.

## Practical Example | 26 | Stage E concluding lessons comparison table

[ ] Close the practical example with Stage E: the dedicated Architecture Audit Table, `figures/{NN}-02-architecture-audit.html`, as the definitive final step of the code showcase, authored per the ui-panels skill.
[ ] Build it with the uppercase eyebrow `LESSONS FROM THE CODE`, a title naming this lecture's concrete domain challenge, and a three-column comparative matrix of `Component Layer`, `Naive Expectation (Legacy Approach)`, and `What Happened (React 19 Reality)` with subtle shading on the reality column.
[ ] Deconstruct the hierarchy across the layers relevant to this lesson, meaning the parent, intermediate boundaries, and terminal UI control, using the genealogical naming from this skill.
[ ] End the table with a final verdict row contrasting fragile coupling in red uppercase against bulletproof modularity in teal uppercase, and calibrate padding and font sizes so the table and its caption fit on a single PDF page.

## Naming | 27 | The everyday-words naming rule

[ ] Choose component names from the simplest, universally understood everyday vocabulary, words any reader knows, so the name carries the mental picture by itself.
[ ] Treat a failed everyday-words check, meaning a reader has no clue what the word refers to, as a signal the name is wrong even if it sounds precise to an engineer.

[ ] PROPER EXAMPLE: make sure you follow this example, names that pass the everyday-words check:

> `SearchBar`, `ArticleTitle`, `SearchSummary`, `CommentSection`, `FeedbackApp`

Notes: each name is one everyday idea any reader immediately pictures, so the reader decodes the component before reading a line of its code.

## Naming | 28 | Avoid pileups and visual-shape names

[ ] Avoid combining three nouns into one component name, so the reader is not forced to decode a compound before understanding the code.
[ ] Avoid CSS visual shapes and insider slang as component identities, names like `Badge`, `Ticker`, `Prompter`, or `WireCategory`, because the reader has to translate them into a real thing first.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> `SearchResultsBadge`, `WireStatsBadge`, `ArticlePrompter`, `FeedbackSwitcher`

Notes: each name either piles up nouns, names a visual shape, or reaches for jargon the reader does not own, and the decoded meaning arrives too late to help.

## Naming | 29 | Name by role, not by HTML tag

[ ] Avoid naming a component after an HTML tag or a spreadsheet coordinate, patterns like `...Row`, `...Cell`, `...Div`, or `...Span`, because the tag is presentation and the name should say what the thing is.
[ ] Prefer `...Item` for individual entries, for example `ArticleItem` or `CartItem`, and `...Header` for section dividers, for example `CategoryHeader`, so the name describes the thing's role in the interface rather than its markup.

[ ] PROPER EXAMPLE: make sure you follow this example, the swaps from tag names to role names:

> `ArticleItem` instead of `ArticleRow`, `CartItem` instead of `CartItemRow`, `CategoryHeader` instead of `CategoryRow`

Notes: each corrected name describes the thing's role in the interface, not the HTML tag it happens to render as, so the name survives a markup refactor.

## Naming | 30 | Genealogical terms, not leaf

[ ] Name components and describe component relationships with the official family terms: parent, child, nested child, grandchild, ancestor, descendant, terminal UI control (the full vocabulary law lives in the ui-panels skill).

## Tables | 31 | Closing table as the last block

[ ] End every lecture with `### Summary` followed by the comparison table as the last block of the file, so the "what makes this different" point is the visual anchor the reader leaves with.
[ ] Contrast the lecture's mechanism against its nearest alternative, for example `useState` vs `useRef`, controlled vs uncontrolled inputs, or Server vs Client Components, so the table has a genuine tension to resolve.
[ ] When the lecture genuinely has no meaningful contrast, substitute a "what to remember" two-column table of term to one-line definition, keeping the same alignment as the standard shape.

## Tables | 32 | Exact table shape

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

## Tables | 33 | Code wrapping inside table cells

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
