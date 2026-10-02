---
name: pre-lecture
description: Governs authoring the Phase 1 pre-lecture blueprint at 01-01-md-PRE-lectures/{nn}.md; use when a pre-lecture is about to be written or revised.
---

# Pre-Lecture

This skill governs the pre-lecture, the first iteration of the material at `01-01-md-PRE-lectures/{nn}.md` that plans the causal flow of every paragraph and code block and locks in the technical vocabulary before the production lecture in `01-02-md-LECTURES/{nn}.md` is written. Every principle below converts directly into planning decisions inside the blueprint: which pre-element each bullet becomes, how code is sliced, and which terms the lecture is authorized to introduce. Digests: skills/old-instructions/PRE-LECTURE-INSTRUCTIONS.md.

## Philosophy | 01 | The pre-lecture is the first iteration, not a draft summary

- [ ] Treat the pre-lecture as the planning instrument that guarantees maximum coherence: every paragraph, code snippet, and visual element appears with an explicit causal reason to exist, so the production lecture never has to improvise structure.
- [ ] Lock in the exact technical terms this lecture is authorized to introduce, so the production lecture introduces nothing outside the terms mapped in the pre-lecture; this is the anti-jargon barrier that prevents jargon pollution and cognitive overload.
- [ ] Follow the Pre-Lecture First Protocol: author, audit, and validate the blueprint in `01-01-md-PRE-lectures/{nn}.md` first under the 10-line ceiling and the continuation attributes, and only then generate the production lecture in `01-02-md-LECTURES/{nn}.md`.
- [ ] Prefer the blueprint being fully verified (micro-steps, line budgets, self-audits) before any touch of `01-02-md-LECTURES/`, so the production pass is a conversion rather than a design session.

## Philosophy | 02 | Ground from the known to the unknown with the h-e-l-l-o standard

- [ ] Ground every explanation in foundational notions the student already owns, connecting from what they know to what they do not know, repeatedly and explicitly.
- [ ] Anchor form-state grounding in the h-e-l-l-o standard, the brief recap of the form's physical parts escalated to typing h-e-l-l-o letter by letter with the old wiring paying per keystroke (see the canonical recap example in Technical Grading).
- [ ] Contrast the classic pain (a decade of `e.preventDefault()` against the native full-page reload that wipes client state) with the modern alignment (React 19 form actions hold the input in the browser's own buffer, intercept `e` automatically, and deliver the populated `FormData` package to the async action).
- [ ] Aim for this tactile, bottom-up mechanical rigor in every pre-lecture, so the student always has a physical ladder from the familiar to the new.

## Philosophy | 03 | Write from the developer-at-the-keyboard stance

- [ ] Write from the perspective of the developer sitting at the keyboard, feeling instructed and guided personally, step by step, in plain upper-intermediate English (CEFR B2) vocabulary, as if the reader is tired with a short attention span yet expects thorough, interview-winning depth.
- [ ] Prefer grounding every runtime concept in the three-part explanation: (1) what you write, (2) what manual work it removes (manual `useState` keystroke tracking, `e.preventDefault()`, `try / finally` loading flags), and (3) what the browser does concretely.
- [ ] Avoid writing from the perspective of the React internal engine, treating technical terms as disembodied Platonic forms, or reciting compiler specifications, because the reader cannot stand where the author has never stood.

## Philosophy | 04 | Physical body first, spirit second

- [ ] Start with the physical body: what the user physically sees on screen, what keys they touch, what file extension is on disk, and only then add the abstract purpose or engine theory.
- [ ] Anchor to what the reader already expects to see: a Word document is a file ending in `.docx` that opens showing white pages of typed text, an HTML element is an `<h1>Breaking News</h1>` tag that paints large bold letters on the screen, a JavaScript module is a file ending in `.js` loaded by a module script tag.
- [ ] Prefer standing where the reader stands and adding a quick physical addition to their existing mental structure, so each new concept has a place to land.

## Philosophy | 05 | Follow the fixed three-step explanation order

- [ ] Take every React concept, form mechanism, or state pattern through the fixed three-step explanation order in strict, unhurried sequence: step 1 the real markup that exists (what physically sits in the markup, like an `<input name="title">` inside a `<form>`), step 2 the React code for it (how JavaScript points to or reads that markup, like `formData.get("title")`), and step 3 what the browser then does (how the browser or React runtime resolves it in memory, like background transitions or automated input resets).
- [ ] Prefer this exact order every time, because skipping the real markup to jump straight to the browser consequence creates instant confusion and cognitive drift.

## Structure | 06 | The pre-lecture directly mirrors the final lecture

- [ ] Mirror the exact `#`, `##`, and `###` headings of the final production lecture, with no abstract meta-sections in between.
- [ ] Name files with the matching question number and two-digit padding: `01-01-md-PRE-lectures/{nn}.md` (for example `01.md`, `02.md`, through `180.md`).
- [ ] Represent every upcoming block of the lecture as a single bullet under its heading, where each bullet contains one pre-element tagged with its atomic pre-element type.
- [ ] Bold key terms in any paragraph (`**imperative DOM scripting**`, `**state drift**`, `**component**`) so every introduced concept is visually anchored.
- [ ] Keep one continuous line per bullet, paragraph, or table row, and keep em-dashes out entirely, so the file stays diff-able and TTS-safe.

## Technical Grading | 07 | Grade every paragraph element by technical density

- [ ] Tag each [p] element at its head with its density: ★ for highly technical paragraphs (runtime mechanics, code behavior, state detail), ◇ for highly conceptual paragraphs (first introduction of basic concepts), and no tag for middle paragraphs, so the blueprint doubles as a technical map of the lecture.
- [ ] Use ◇ rather than ◼ for the conceptual tag, because ◼ already serves as the in-bullet qualifier separator (content left of it, pedagogical qualification right of it), and the two jobs stay unambiguous for both reader and search.
- [ ] Let the tag drive the writing mode: ★ paragraphs get precise runtime narration and paired code, ◇ paragraphs get plain-concept definitions with everyday anchors, and middle paragraphs alternate both in balance.
- [ ] Treat the mix as a quality signal: a blueprint with zero ★ paragraphs teaches no mechanics, and a blueprint that is all ★ with no ◇ never grounds its concepts.

## Technical Grading | 08 | Every ★ paragraph opens with the knowledge it stands on

- [ ] Prefix every ★ paragraph with a {preknowledge:} field listing the concrete prior concepts it builds on (for example: forms, input texts, the name variable, button submission, the event traveling upward to state), so no technical paragraph starts from zero.
- [ ] Expand {preknowledge:} in the final text as a warm recap in plain prose, then push one detail further than the recap until the knowledge is crisp, because a recap that stops at naming never lands the point.

[ ] PROPER EXAMPLE: make sure you follow this example, a preknowledge recap escalated to a crisp physical detail:

> We know that a form is built from several elements, like input text fields, and each input is tied to a variable "name" that passes its data upward to the application state. Type h-e-l-l-o into that input one letter at a time, and with the old wiring the page reloads on every single keystroke, wiping the field before the word is finished.

Notes: the recap names the parts first, then escalates to one concrete physical moment (typing letter by letter, reload per letter), so the reader feels the knowledge instead of skimming it.

- [ ] Write the {bridging:} gap only after the preknowledge recap is on the table: state what the old path cannot do, then the new mechanism and the exact difference it makes at runtime.
- [ ] Plan the full definition shape for every [p] element that introduces a bolded concept: introduce the concept organically through narrative context and problem contrast without formulaic self-interrogations ("What is X?"), name both sides of the contrast in the same breath with their standard terms (who controls what), state the default sentence narrated as the reader's own habitual act in the plain web world with zero React code, state the takeover as the same habit performed differently, and close with the law sentence (the one invariant naming who dictates and what is now impossible), so the production lecture inherits the whole shape instead of leaving it to an allegory card (see the lecture-voice skill, The default and the law). #2026_09_20_03_group_1 revised by #2026_09_20_27_group_1

## Technical Grading | 09 | One concern per paragraph element

- [ ] Split any paragraph that mixes concerns into separate [p] elements: one for the preknowledge and the problem, one for the old solution, one for the new solution, so each concern can be written, checked, and referenced on its own.
- [ ] State the {problem:} as a concrete runtime symptom (every keystroke submits the form, the typed data is lost), never as an abstract shortcoming, so the reader meets the failure before the fix.

[ ] COUNTER-EXAMPLE: do not follow this bad example, one paragraph carrying every concern at once:

> [p] ★ {preknowledge:} forms, inputs, the name variable, submission {problem:} every keystroke submits the form {old solution:} we used e.preventDefault and manual handlers {new solution:} form actions handle it

Notes: four concerns crushed into one line; the recap cannot breathe, the old solution has no room for its code, and the new solution arrives before the reader has felt the problem.

## Technical Grading | 10 | Every old solution referenced in text appears in code

- [ ] Pair every {old solution:} mention with a real [code] element showing that old solution (the manual e.preventDefault, the per-keystroke handler, the local state mirrors), because prose that references code without showing it forces the reader to rebuild it from memory.
- [ ] Order the pair old first, new after, so the reader sees the pain before the relief and the comparison is verbatim rather than remembered.

## Technical Grading | 11 | Conceptual paragraphs take the reader by the hand

- [ ] Give ◇ paragraphs the same concern fields as ★ paragraphs ({preknowledge:}, {problem:}, {old solution:}, {new solution:}), so the one-concern-per-element law and the old-solution-in-code law apply to both densities.
- [ ] Narrate ◇ paragraphs in three moves: start from what the reader already knows (the conceptual categories that are clear to them), walk through the concepts that turn vague or problematic, then introduce the new category straight away with its proper name and an easily digestible definition, so the reader is led from their own solid ground to the new concept without a jump.
- [ ] Name every category with the terminology the React community already uses, so the blueprint never smuggles novel or idiosyncratic names for established concepts, because a private vocabulary never transfers outside the lecture.

[ ] PROPER EXAMPLE: make sure you follow this example, a conceptual paragraph moving from known ground to the new category with its proper name:

> In plain HTML, you structure documents using native HTML tags like `<header>`, `<article>`, and `<button>`. However, native HTML tags do not know anything about your application logic, your subscriber tiers, or your reader data. Traditionally, developers had to copy and paste chunks of HTML structure across templates and attach separate JavaScript scripts to add behavior. Every different page corresponded to a different .html file, and each file was a monolith of HTML markup, CSS style, and JavaScript. To solve this problem, modern web frameworks like React rely on the combination of isolated components like building blocks. It is much more effective to create isolated .jsx files and combine them together. Each component has its own HTML markup, CSS style, and logic.

Notes: the paragraph opens on the reader's own solid ground (native HTML tags), names the friction in their terms (tags know nothing about application logic, monolith files), and only then introduces the new category with its community name (isolated components) and a digestible definition (each one carries its own markup, style, and logic).

[ ] COUNTER-EXAMPLE: do not follow this bad example, an idiosyncratic renaming of a community concept:

> To solve this problem, modern web frameworks like React rely on UI snappers: self-contained building pockets that snap your page together.

Notes: the concept is a component, the community calls it a component, and renaming it forces the reader to learn a private word that no documentation, interview, or colleague will ever use.

## Technical Grading | 12 | Every technical description plans its consequence

- [ ] Plan the consequence for every technical description the blueprint contains (a file, a command, a config): the [p] element states what the described thing changes for the developer or for the user, so a description that only names contents, an X-ray passage, is never approved for the lecture (see the lecture-voice skill for the full Technical Explanations standard with the three examples).

## Pre-Elements | 13 | Use the full pre-element taxonomy

- [ ] Begin every bullet with one of the atomic pre-element tags indicating what the production element will become: `[p]` prose paragraph, `[grounding]` real-world grounding card, `[code]` literal code block, `[comparison]` architectural comparison section, `[components]` Rendered UI Canvas panel, `[files]` File Explorer panel, `[component-code]` Component Code Architecture panel (role mode with `[role:]` entries), `[figure]` standalone HTML figure, `[callout]` callout box (`> [!TIP]` or `> [!KEY]`), `[glossary]` glossary entry, `[table]` closing comparison table, the summary family (`[tip]` senior interview positioning tip, `[definition]` standalone definition entry, `[review-title]` and `[review-subtitle]` the summary header pair, `[numbered-review-point]` numbered point with its `<br>` lettered sub-points, `[never-rule]`, `[always-rule]`, `[if-then-rule]` the arrow rules, `[do-this-header]` with `[do-this-code]` and `[do-not-do-this-header]` with `[do-not-do-this-code]` the directive code pairs, `[comparison-table]` the closing three-column table), and `[ladder-1]` through `[ladder-7]` for the 7 sequential opening beats, so every element the production lecture and its summary need is planned atomically. #2026_09_20_04_group_7
- [ ] Plan the 7 ladder beats to the canonical slot blueprint: `[ladder-1]` Scene, `[ladder-2]` Setup, `[ladder-3]` the surprising action, `[ladder-4]` Question, `[ladder-5]` Danger, `[ladder-6]` Mystery, `[ladder-7]` Promise.
- [ ] Plan `[glossary]` entries under a `### Glossary` heading that lives between `### Where you will meet this` and `### Summary`, with 4 to 6 core terms, each formatted as `- [glossary] Term ◼ Plain-English definition explaining the concept and its concrete engineering role without em-dashes.`

## Pre-Elements | 14 | `[p]` bullets carry the substance itself

- [ ] Write `[p]` bullets as the actual substantive reasoning, grounded in the physical reality of what the user sees, what keys they touch, and what the browser executes, so the production lecture inherits the argument rather than a placeholder.
- [ ] Avoid meta-descriptions of what a paragraph will say, so the blueprint stays a thinking document rather than a table of contents.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> - [p] Explains that developers spent a decade writing `e.preventDefault()` before form actions existed.

Notes: This is meta-phrasing: it describes the paragraph from the outside instead of carrying the reasoning, so the production author still has to invent the substance later.

[ ] PROPER EXAMPLE: make sure you follow this example, a `[p]` bullet containing the argument itself:

> - [p] Developers wrote `e.preventDefault()` for a decade because the browser natively wants to navigate to a new URL on submit, executing a full-page reload that wipes all client state in memory, and the only defense was intercepting the event by hand. ◼ Educational objective: discharge the confusion around why the classic boilerplate existed at all; underline the physical reload consequence.

Notes: The reasoning lives in the bullet, the pedagogy lives right of the `◼`, and the production lecture can convert it directly into prose.

## Pre-Elements | 15 | `[code]` obeys the Real Code Law and the 10-line ceiling

- [ ] Make every `[code]` pre-element an exact, literal, runnable code block; abstract descriptions of code (such as "a function that does X") stay out of the blueprint.
- [ ] Keep every code block at 10 or fewer lines of executable code, so line 11 is a defect by definition; slice components longer than 10 lines into progressive micro-steps across sequential sections.
- [ ] Maintain file continuity with the continuation attributes: the top block uses `title="Name.jsx" startLine="1" continues="bottom"`, middle blocks use `startLine="NN" continues="both"`, and the bottom block uses `startLine="NN" continues="top"` to seal the file cleanly.
- [ ] Start every snippet on its first line of executable code, skipping any empty line at the top of the source block, so `startLine` never counts blank padding.

[ ] PROPER EXAMPLE: make sure you follow this example, the `[code]` pre-element with its what-this-introduces list:

> - [code] App.jsx:
>
> ```jsx title="App.jsx"
> export default function App() {
>   return <EditionForm onPublish={handlePublishLetter} />; // parent mounts the boundary
> }
> ```
>
> ◼ **The what-this-introduces list:** 1. `EditionForm`: the child boundary receiving one prop. 2. `onPublish`: the connecting action prop carrying the submission pathway. 3. `return` with a single mounting tag: the lean parent shape.

Notes: The block is literal and under the ceiling, and the list enumerates every introduced token so nothing reaches the lecture unexplained.

## Pre-Elements | 16 | Show the host element with its hero prop

- [ ] Whenever prose introduces or explains a JSX prop, HTML attribute, or element-level binding (such as `<form action={...}>` or `<button formAction={...}>`), make the immediate code snippet physically render the host element with that exact prop bound.
- [ ] Pair the concise handler or hook definition and its host JSX binding in the same code window (inside the 10-line ceiling), so the reader physically sees the exact connection the text promises.
- [ ] Avoid headless function definitions or isolated hook signatures without the host JSX tag they attach to, because prose claiming "the action prop on a form accepts an async function" above a snippet with no `<form>` tag breaks the promise the text just made.
- [ ] For legacy or pre-React 19 comparisons, use an explicit conceptual title without a `.jsx` extension (for example `title="Historical Pattern"`), because fictitious `.jsx` titles that do not exist in the files tree trigger compiler completeness warnings.
- [ ] In introductory sections, prefer one paired continuous window over multiple disconnected standalone windows with repetitive dots and tabs for the same file.

## Pre-Elements | 17 | `[components]` Rendered UI Canvas

- [ ] Plan `[components]` panels as the Stage A Rendered UI Canvas titled `{project} - Rendered UI Canvas`: (1) omit or write `none` for the props column so it is automatically suppressed, (2) keep the canvas snippet-free, focusing on the authentic interface without code distractions, (3) end terminal controls with rendered UI elements (`[button: ...]`, `[input: ...]`, `[badge: ...]`), and (4) indent child components by exactly two spaces per level under the parent container.

## Pre-Elements | 18 | The Stage D `[component-code]` role panel follows the four-beat rhythm #2026_09_20_29_group_1 revised by #2026_09_20_30_group_1

- [ ] Plan the Stage D `[component-code]` role panel strictly per the ui-panels skill (Section 15): titled `Summary: The Logic of Nested Components` with `[role: ...]` entries in the four-beat rhythm (what the component is bolded, what it owns or receives, relational contrast against siblings, and the motivation answered directly inside the entry), scoped to the feature component tree (at most 3 components, omitting outer host shells like `App.jsx`), with zero code. Avoid applying the code-mode 5-second scan constraint to the role panel, because role summaries require unhurried explanatory prose with varied sentence cadences. #2026_09_20_29_group_1 revised by #2026_09_20_30_group_1
- [ ] In the rare case where a lecture uses `[component-code]` in Code Mode to display syntax-highlighted code blocks, plan it per the ui-panels skill (Section 14) as an architectural skeleton curating the load-bearing primitives. #2026_09_20_29_group_1

## Pre-Elements | 19 | Plan the `[figure]` archetypes precisely

- [ ] When a lecture decomposes code implementation into progressive micro-steps, prescribe the Progressive Assembly Step Cards Diagram (`figures/{NN}-01-code-assembly-pipeline.html`, cloned from Template 09) in full spatial detail: the `.assembly-steps-figure` container (`max-width: 590px`, gap 10px), 4 horizontal step cards with left color edges, step badges with uppercase `STEP` and large bold numbers, a rounded vertical divider, card titles mirroring the collaborative pair-programming sequence (`First, we...`, `Next, we...`, `Then, we...`, `Finally, we...`), monospace component tags, and the 4 color schemes (Step 1 blue, Step 2 teal, Step 3 warm amber, Step 4 green).
- [ ] Conclude every code showcase with the Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`, Archetype 10) evaluating the component hierarchy across `Component Layer` | `Naive Expectation (Legacy Approach)` | `What Happened (React 19 Reality)`, with the uppercase eyebrow `LESSONS FROM THE CODE` and a final verdict row contrasting `FRAGILE COUPLING` against `BULLETPROOF MODULARITY`, tailored 100% to this lecture's specific domain challenge and components.
- [ ] When an ambient context or boundary topic genuinely needs a visual data-flow diagram in addition to the audit table, plan it as a specialized `figures/{NN}-02-information-flow-trace.html`.
- [ ] Prefer deep 4-pillar `[comparison]` sections (State Triplication vs Atomic Action Tuple, Stale Closure Hazards vs Reducer Accumulation, Synchronous Blocking vs Automated Transition Scheduling, Synthetic Interception vs Native Form Actions) over shallow diagrams that merely rearrange text bullets into boxed cards, because a diagram that illustrates no browser engine, memory state, or lifecycle explains nothing.

## Pre-Elements | 20 | Use genealogical and relational component names

- [ ] Use idiomatic genealogical terms from official React documentation: `parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, or `terminal UI control`.
- [ ] Avoid the academic computer science term "leaf" (and "leaf node", "leaf component", "leaf control"), because it is not standard React terminology and it smuggles a data-structure frame into a component-tree conversation.
- [ ] Describe component relationships with standard relational nomenclature (`parent component`, `child component`, `parent container`, `grandparent component`, `grandchild component`, `nested relationship`) or by the component's concrete domain name (for example `App.jsx`, `StoryFeed.jsx`, `EditionPortal.jsx`).
- [ ] Avoid the terms `coordinator`, `coordinator container`, `coordinator shell`, `parent coordinator`, `root coordinator`, `app shell`, and `shell component` in all lecture texts, headings, code comments, and figure labels.
- [ ] Default the top-level component to `App.jsx`, and allow a short everyday domain name (like `FeedbackPortal.jsx`) when the parent owns real architecture of its own, meaning shared state, child prop interfaces, or layout dictatorship, so the name earns its place instead of decorating a passive mount; avoid verbose 30-character names in every case. Frame the architectural lesson the parent carries either way: because modern hooks (such as `useActionState`) encapsulate submission handlers, loading flags, and error state inside the child, the parent stays lean, and when it does own state it dictates it downward through explicit prop passing. #2026_09_20_04_group_7 revised by #2026_09_20_26_group_1

## Grounding | 21 | The `[grounding]` card exists to trigger the aha moment

- [ ] Include a dedicated `[grounding]` card (compiling into a `> [!WILD]` alert with the eyebrow `⚡ IN THE WILD`) in every major technical section, so each breakthrough lands on tactile engineering reality.
- [ ] Aim the card at the single most common point of confusion for students: the exact mechanism or trade-off that feels counter-intuitive, slippery, or unnatural when first encountered in the text.
- [ ] Treat the card's job as engineering an immediate "aha moment" that permanently dissolves that confusion, rather than summarizing the section.

## Grounding | 22 | Grounding cards stay simple, familiar, and straight to the point

- [ ] Open every card with a short, punchy, bold leading question of 6 to 9 words (for example `**What is the problem with updating the physical DOM?**`), kept broad and catchy, with API methods, code syntax, and technical minutiae kept out of the question.
- [ ] Vary the question word across a lecture's cards (What, When, Where, Why), because a hook repeated card after card stops hooking; the reader's ear tires of the same opener before the card's insight arrives. #2026_09_20_12_group_1
- [ ] Take the reader by the hand with intentional repetition (etymological repetition, contrasting repetition, re-anchoring), driving the point home in plain language until it cannot be misunderstood, because the reader's attention span is short.
- [ ] Keep clarified load-bearing terms in bold every single time they appear in the card (`**imperative**`, `**declarative**`, `**physical DOM**`, `**virtual DOM**`, `**single source of truth**`).
- [ ] Strip out technical clutter (no background polling routines, no variable loops, no line numbers, no compiler trivia) and anchor purely to sensory, tactile user friction: the blinking cursor disappearing, keystrokes swallowed into thin air, on-screen badges disagreeing.
- [ ] Speak with direct, everyday familiarity ("Can you imagine...?", "Remember the blinking cursor that appears when completing a form? Well... it vanishes completely") and resolve the card by contrasting the physical friction directly with React's solution in plain English.

[ ] COUNTER-EXAMPLE: do not follow this bad example, a stiff, passive card with no leading question and no bolded key terms:

> The Renamed ID Trap. A design system refactor cleans up the HTML template, changing `<div id="user-badge">` to `<div id="account-pill">`. No TypeScript error is thrown. No compiler warns you. But three separate JavaScript files silently break in production because their document.getElementById queries now evaluate to null. Component boundaries eliminate this fragility by encapsulating markup and behavior together, making selector drift impossible.

Notes: It opens with a title instead of a question, keeps every load-bearing term unbolded, and reads like a textbook paragraph, so it never discharges the confusion.

[ ] PROPER EXAMPLE: make sure you follow this example, a cardinal-standard grounding card with repetition and bolded key terms:

> **What does imperative vs declarative really mean?** Imagine a subscriber named Elena logs into The National Times. Her name appears in ten different places across the screen, from the sidebar to the navigation bar. But what happens when she updates her account to use a pen name? In plain JavaScript, you are forced to write manual commands to find and rewrite every single spot. You need to hunt down each and every "name" variable, manually. If you miss in one place, it does not update. This is the problem with **imperative programming**: it is **imperative** to hunt down and update all variables, time and time again. Which, in turn, can lead to many silent failures. This silent failure is exactly why you need the **declarative** component model of React: it eliminates manual DOM hunting to ensure your entire interface stays perfectly synchronized automatically.

Notes: A broad bold question opens it, the everyday scenario takes the reader by the hand, repetition hammers the distinction, and both clarified terms stay bold on every appearance.

## Grounding | 23 | Anatomy and cadence of the `[grounding]` pre-element

- [ ] Plan each `[grounding]` bullet with the full anatomy: the opening question (short, catchy, bold, max 6 to 9 words, zero syntax clutter), the friction it clears (the counter-intuitive concept or friction to discharge), the Scene & Repetition (an everyday familiar hook using intentional repetition), the Key Terms (mandatory bolding of all clarified terms), and the Resolution (how React's core mechanism solves it cleanly, creating the aha moment).
- [ ] Include exactly one `[grounding]` card per major technical section (H2/H3), so the card lands as a natural cognitive resting point.

[ ] PROPER EXAMPLE: make sure you follow this example, the anatomy laid out as a checklist-style pre-element:

> - [grounding] the opening question: What is the problem with updating the physical DOM?
>
>   the friction it clears: why wiping and rebuilding the container drops focus and swallows keystrokes.
>
>   Scene & Repetition: the blinking cursor vanishing mid-form, keystrokes disappearing into thin air, told by the hand.
>
>   Key Terms (Bold): **physical DOM**, **virtual DOM**.
>
>   Resolution: React compares updates in memory and changes only what is necessary, leaving active typing untouched.

Notes: Every anatomical slot is filled, the question carries no syntax clutter, and the resolution delivers the aha moment.

## Grounding | 24 | Deliver the dual-canon nomenclature

- [ ] Whenever a paragraph or section describes a runtime phenomenon, architectural pattern, or data structure, deliver the full Dual-Canon Terminology: (1) the classic industry-standard term 95% of senior interviewers and codebases use (`virtual DOM`, `prop drilling`, `synthetic events`), (2) the modern official documentation term (`UI descriptor tree`, `React elements`, `context propagation`), (3) the concrete physical reality in plain English (lightweight plain JavaScript objects in memory), and (4) mandatory bolding of each canonical term on introduction.
- [ ] Withholding a formal name (treating a concept as a nameless "you-know-what") leaves the student unable to recognize the concept in an interview, so name it explicitly.
- [ ] When the relationship between the classic term and the modern term is itself counter-intuitive (such as "Is the virtual DOM a simulated browser or just JS objects?"), dedicate an `⚡ IN THE WILD` grounding card specifically to discharge that confusion and trigger the aha moment.

## Language | 25 | Use standard vocabulary only, explained on first introduction

- [ ] Use only standard React and web platform vocabulary as established in official specifications and `react.dev`, explaining each key term on its first introduction, in bold.
- [ ] Describe developer habits, common mistakes, and runtime problems as the plain reality in clear English, rather than reifying descriptive situations into fake proper nouns or pseudo-academic buzzwords.

[ ] COUNTER-EXAMPLE: do not follow this bad example, invented vocabulary dressed as standard terms:

> - [p] Developers often fall into the **controlled form illusion** while typing, suffering **keystroke tracking fatigue** as the component re-renders.

Notes: Neither term exists in React or web platform documentation; the plain reality ("developers often control every input, and typing triggers a render on every keypress, which gets slow") teaches the same lesson without inventing names the student will never meet in an interview.

[ ] PROPER EXAMPLE: make sure you follow this example, plain reality named with standard terms:

> - [p] Developers often fall into the habit of controlling every input, so typing triggers a render on every keypress, which gets slow; passing props through intermediate wrappers that do not need them is standard **prop drilling**, and inputs that read DOM values on submit without React state are standard **uncontrolled inputs**. ◼ Underline: the bolded terms are real, interview-recognized vocabulary.

Notes: The habits are described in plain English, and only genuine standard terms receive bold.

## Language | 26 | Write lucid, step-by-step sentences

- [ ] Spread every explanation of a mechanism across short, lucid sentences that read like clear water: one idea per sentence, reminding the physical basics first, explaining the runtime event second, explaining the data transformation third, and naming the final handoff fourth.
- [ ] Avoid compressing multiple conceptual stages (user intent, DOM event firing, element gathering, data structure packaging, function dispatch) into a single breathless, comma-spliced run-on sentence.

[ ] COUNTER-EXAMPLE: do not follow this bad example, a comma-separated multi-clause run-on:

> When a user submits the form, React intercepts the native submit event automatically, gathers all contained inputs that declare a name attribute into a native browser FormData instance, and passes that dictionary directly to the action function.

Notes: Four conceptual stages ride one sentence, so a tired reader loses the thread halfway through.

[ ] PROPER EXAMPLE: make sure you follow this example, the same mechanism in lucid steps:

> A form may consist of one or more input fields receiving data from the user, assigning the content of each input text in an attribute named `name`. When a user submits the form, React intercepts the native submit event automatically. The named fields from the various inputs all get collected into a native browser `FormData` dictionary. This dictionary then gets passed directly to the action function.

Notes: Each sentence carries one stage, in the canonical order: physical basics, trigger, data collection, destination.

## Language | 27 | Write from practical developer reality, and prefer "When" for failure states

- [ ] Write from the practical developer's lived experience, addressing natural developer questions (such as why an API behaves a certain way, when the engine updates, or what failure is prevented) and grounding the explanation in concrete browser and keyboard reality. #2026_09_20_30_group_1
- [ ] Avoid grandiose decrees about universal physical laws (such as "Developers never author `e.preventDefault()`"), because the author is not writing normative laws of the universe.

[ ] PROPER EXAMPLE: make sure you follow this example, the practical-reality register:

> Developers never need to write `e.preventDefault()` anymore. Why? React now prevents full-page document reloads automatically when handling form actions. At the same time, standard keyboard interactions are preserved: the user, for example, can press Enter to submit without any problem.

Notes: The natural "Why?" carries the explanation, and the claim is scoped to lived developer experience rather than a universe decree. The spoken Why? earns its place by following a claim the reader genuinely doubts; where several claims cluster, let all but one answer themselves as plain Because-clauses. #2026_09_20_12_group_1

- [ ] Use "When" (not "Why") for headings introducing bugs, blank screens, performance delays, or runtime failure symptoms (for example `When does client-side rendering show a white screen?`), because "Why" falsely implies intentional design while "When" frames the problem as a situational condition or timing boundary.

## Language | 28 | Anchor every concept physically and unpack every named system

- [ ] Avoid explaining jargon with jargon: explaining an abstract term with another abstract term ("state drift causes asynchronous desynchronization of the reconciliation tree") is word salad that teaches nothing.
- [ ] Anchor every abstract concept to a tangible physical HTML element, a real user action, or an editor widget, so "controlled inputs ensure unidirectional data synchronization" becomes "every time the user presses a key, your state variable updates, and React rewrites the text inside the `<input>` box to match that state variable".
- [ ] Avoid concluding a paragraph, section, or callout card by dropping a new technical term into the final sentence without unpacking it; when a named system (such as **Hot Module Replacement**) is the climax of an explanation, deconstruct it in that exact place: how the server connects to the browser, what payload moves, and how the browser swaps it in memory without clearing form state.
- [ ] Plan the new-terms check for each new technical term: (1) a real-world physical context where the developer hits a wall, (2) the naive alternatives with familiar tools, (3) the architectural need for a dedicated platform primitive, (4) the first-use definition, naming the term with classic and modern nomenclature, bolding it, and decoding any prefix or syntax, and (5) a one-sentence summary of the concrete browser or React engine consequence.

## Language | 29 | Keep empathy without narration

- [ ] Keep the author's empathy planning invisible in the blueprint: no meta-labels like `1. Novelty:`, `2. Weirdness:`, `Cognitive Inference:`, or `Part (a/b/c)` printed anywhere, and no invented metaphors like "radio towers", "Wi-Fi bubbles", "antennas", or "ambient receivers"; address the reader's surprises directly in natural prose instead (see the lecture-voice skill for the full empathy law).

## Language | 30 | Keep every pre-lecture faithful to its own question

- [ ] Dedicate every pre-lecture 100% to its own distinct interview question from `questions.md`, with its own distinct application scenario, custom components, and specialized code assembly pipeline.
- [ ] Avoid carrying over or cloning code examples, components, or diagrams from an adjacent lecture, so Lecture 41 on `#form_actions` stays about the `action` and `formAction` attributes, native `FormData` harvesting, background React Transitions, and automated input resetting rather than becoming a duplicate of Lecture 40's `useFormStatus`.

## Language | 31 | Give CLI commands in both forms and unpack the scaffold

- [ ] When introducing terminal scaffolding commands (such as `npm create vite@latest`), provide two distinct forms: the generic formula in the prose (for example `npm create vite@latest <app_name> -- --template react`) and the exact runnable command with the project's real name in the code block (for example `npm create vite@latest national-weather -- --template react`).
- [ ] Keep unquoted placeholders like `<app_name>` out of runnable bash code blocks, because unquoted `<` and `>` cause shell redirection syntax errors.
- [ ] Explain the formula's parts: what `<app_name>` means in practice (the literal folder name created on disk and the `"name"` field in `package.json`), the naming constraints (lowercase, numbers, hyphens, no spaces or uppercase), the POSIX angle-bracket notation for a required placeholder the student replaces without typing literal brackets, why `npm create` runs `create-vite` in memory without global installation, why the double-dash `--` passes arguments through npm to the generator, and what `--template react` selects.
- [ ] Deconstruct the generated project physically, file by file: `package.json` (manifest with `react` and `react-dom` dependencies, `vite` and `@vitejs/plugin-react` devDependencies, and the `dev` and `build` scripts), `index.html` (the root shell with `<div id="root"></div>` and the module script pointing at `/src/main.jsx`), `vite.config.js` (registering the React plugin across three systems: JSX compilation, Fast Refresh, and Rollup production bundling), `src/` (with `main.jsx` mounting to the DOM root, `App.jsx`, and CSS styles), and `node_modules/` with `package-lock.json` (the downloaded packages and locked dependency tree from `npm install`).

## Language | 32 | Write comparative code in full, and only where it belongs

- [ ] Write `DO THIS` and `DO NOT DO THIS` comparisons in the blueprint as full runnable code blocks with `right` / `wrong` window tags, where only the uppercase directive is bold (`**DO THIS:** [instruction in normal weight]`), each accompanied by dual what-this-introduces lists explaining what makes the right code resilient and the exact runtime failure or state drift the wrong code triggers.
- [ ] Restrict comparative blocks to two places: closing `### Summary` blocks for key points of thinking and error avoidance, and direct in-body anti-pattern comparisons where a broken or legacy approach is contrasted with a modern React 19 pattern.
- [ ] Avoid applying `DO NOT DO THIS` to terminal scaffolding commands, documentation placeholders, CLI flags, or standard setup steps, because those are not mistakes, they are instructions.
- [ ] Use `**RIGHT:**` or `**WRONG:**` inline comment prefixes only when there is an active comparison or contrast with something wrong; standard non-comparative comments carry informative annotations directly with a single caps load-bearing word in bold (for example `// Brand headline declared in **STARTER**`).

## Language | 33 | Treat plain form controls as plain form controls

- [ ] Treat standard HTML inputs, textareas, and selects without `value` or `onChange` as normal form controls, so headings and comments read `// Standard text input` or `// Text field read on submit`.
- [ ] Reserve "controlled" and "uncontrolled" for architectural contrast sections where state ownership is explicitly debated (for example Lecture 20 and Lecture 37), so the academic label never leaks onto routine markup.

## Staging | 34 | Plan the practical example stages as concrete blueprint elements #2026_09_20_01_group_1 revised by #2026_09_20_04_group_7 and #2026_09_20_05_group_1

- [ ] Plan the complete five-stage practical example in the blueprint whenever the lecture builds a working example from two or more components, so the production lecture inherits a guided build rather than a row of finished code blocks; the full stage definitions live in the lecture-structure skill (Practical Example sections 16 through 21), and the blueprint plans them as concrete pre-elements, never as a reference alone.
- [ ] Plan Stage A as the Rendered UI Canvas (a `[components]` panel in canvas mode, snippet-free, titled `{project} - Rendered UI Canvas`) followed by the `[files]` panel introducing the component roles and the disk hierarchy, Stage B as the assembly pipeline `[figure]` `figures/{NN}-01-code-assembly-pipeline.html`, Stage C as the collaborative step sequence, Stage D as the Lessons from the Experiment section contrasting the naive expectation against what the experiment showed and carrying the `[component-code]` role panel (`[role:]` entries, zero code, titled with a meaningful domain title e.g. `Summary: The Logic of Nested Components`) before the audit figure, and Stage E as the Architecture Audit Table `[figure]` `figures/{NN}-02-architecture-audit.html`. #2026_09_20_04_group_7 revised by #2026_09_20_09_group_1
- [ ] Plan Stage C as a mandatory decomposition: slice every component of the example across `[code]` pre-elements within the 10-line ceiling using the continuation attributes, under the fixed collaborative titles `Step 1: First, we...`, `Step 2: Next, we...`, `Step 3: Then, we...`, and `Step 4: Finally, we...`, with Step 1 constructing the parent container and passing the props each child needs in its JSX and the final step sealing the deepest boundary, so the reader watches the example being constructed top-down instead of reading finished files. #2026_09_20_04_group_7 revised by #2026_09_20_26_group_1
- [ ] Carry the narration itself in each Step's `[p]` bullet, not a summary of the step: the bullet names the notice-move (the concrete line or prop the reader will be pointed at), the props or attributes the step will unpack, the warning charge with its physical consequence, the inline alternative where one exists, and the recap sentence the step will close on, so the lecture's narration is planned in substance rather than improvised at lecture time (see the lecture-voice skill, the calm professor narration). #2026_09_20_04_group_7
- [ ] Plan the Upward Wire trace in the Step 2 / child callback `[p]` bullets: whenever a step builds a component that invokes a parent callback, the bullet must explicitly plan (1) the question naming the prop's origin, (2) the parent's setter or handler it points to from Step 1, (3) the child's telephone line status with zero local state, (4) the physical function execution in the parent, and (5) the inverse data flow naming, so the production author inherits an exact circuit plan rather than improvising "simply invokes" at lecture time. #2026_09_20_06_group_1
- [ ] Plan explicit architectural relations in step `[p]` bullets: whenever a step imports or mounts a component with an asymmetry (such as a shared module housing multiple components, or a prop name differing from state), the blueprint bullet must explicitly plan the module inventory (naming all components inside), the syntax rationale (why named exports/curlies are required), and the role division (why only one component is imported while its companion stays internal). #2026_09_20_13_group_1

[ ] PROPER EXAMPLE: make sure you follow this example, a Step bullet carrying the narration itself, from the shipped Lecture 40 standard: #2026_09_20_26_group_1

> - [p] Step 2 receives the props: Notice the destructured `{ query, onChange }` matching the props passed in Step 1; the two critical props are `value={query}`, which locks the displayed text strictly to React, and `onChange`, which forwards each typed character upward to `setQuery` in the parent; Mind you, leaving the input alone is easier in plain HTML, but binding `value` without an `onChange` handler locks the field read-only; recap: data flows down from the parent through `query`, and user events flow up through `onChange`. ◼ Narration planned in substance: notice-move, both props, the warning charge, the alternative, the recap.

Notes: the production author converts this bullet directly into the calm professor narration instead of inventing it; every beat the shipped Lecture 40 standard delivers is already on the page.

[ ] HALF WAY EXAMPLE: do not follow this example, a true but thin step bullet from the pre-40 blueprints: #2026_09_20_26_group_1

> - [p] Step 2 builds the controlled child LiveSearchInput.jsx, receiving the props passed by the parent for live headline filtering. ◼ Introduces Step 2 implementation.

Notes: the bullet summarizes what the step does instead of carrying the narration: no notice-move, no warning, no alternative, no recap. The production author inherits a topic, not a teaching plan, and the narration gets improvised at lecture time, which is exactly how the calm professor standard gets lost between blueprint and lecture.

[ ] PROPER EXAMPLE: make sure you follow this example, the five stages planned as concrete blueprint bullets under the mirrored heading, mirroring the shipped Lecture 40 standard: #2026_09_20_04_group_7 revised by #2026_09_20_09_group_1 and #2026_09_20_26_group_1

> ### Let's Design a Practical Example LiveSearchInput ArticleCorrectionForm
> - [components] Stage A Rendered UI Canvas: `national-times - Rendered UI Canvas`, snippet-free, showing the finished portal with the search pill and the correction form before any code appears. ◼ The reader sees the destination before the road.
> - [files] Stage A scaffold: the disk hierarchy of the editorial portal, tagging FeedbackPortal.jsx as the parent container and the two form components by their architectural roles. ◼ Introduces the exact files the steps will create.
> - [figure] Stage B assembly pipeline: `figures/40-01-code-assembly-pipeline.html`, four step cards starting from the parent container. ◼ Gives the reader the roadmap before any syntax appears.
> - [code] Stage C Step 1: First, we construct the parent container FeedbackPortal.jsx, passing the props of both children in its JSX. ◼ The architecture is dictated before it is populated.
> - [code] Stage C Steps 2 and 3: Next, we build the controlled child LiveSearchInput.jsx; Then, we declare the uncontrolled form ArticleCorrectionForm.jsx, sliced under the 10-line ceiling with continuation attributes. ◼ The child components are built to receive and render those props one component at a time.
> - [code] Stage C Step 4: Finally, we seal the form with native action submission. ◼ Closes the build at the deepest boundary.
> - [p] Stage D lessons from the experiment: the naive expectation (control every input) contrasted with what the experiment showed. ◼ Draws the lesson from the code the reader just watched.
> - [component-code] Stage D component role panel: Summary: The Logic of Nested Components panel with `[role:]` entries in the four-beat rhythm, zero code, titled `Summary: The Logic of Nested Components`. ◼ The hierarchy on record in serif prose before the audit.
> - [figure] Stage E architecture audit: `figures/40-02-architecture-audit.html`. ◼ The concluding lessons table ending the showcase.

Notes: every stage appears as a real pre-element under the mirrored heading, the canvas opens the build, Step 1 constructs the parent and passes the props, and the role panel precedes the audit, so the production lecture expands a planned top-down build instead of improvising one.

[ ] HALF WAY EXAMPLE: do not follow this example, a partial fix that looks improved and is still not allowed:

> - [code] LiveSearchInput.jsx: the full 13-line component as a single block.
> - [code] ArticleCorrectionForm.jsx: the full 15-line component as a single block.
> - [figure] Controlled versus uncontrolled architecture comparison.

Notes: the components are present and a figure exists, but they arrive as finished blocks with no Stage A scaffold, no Stage B roadmap, no collaborative step titles, no Stage D lessons, and no Stage E audit table; even slicing the blocks under the ceiling without staging them as Step 1 through Step 4 keeps the same defect in smaller pieces, because the reader still never watches the example being built.

[ ] COUNTER-EXAMPLE: do not follow this bad example, a blueprint that defers the staging to lecture time:

> - [p] The lecture will later include a practical example section following the lecture-structure skill.

Notes: the staging is referenced but never planned, so the production author inherits a placeholder instead of a build plan; this is exactly how a lecture ships clean prose with no constructive demonstration.

## Bullets | 35 | Every bullet splits at the `◼` separator

- [ ] Structure every bullet into two parts separated by the black square: `- [pre-element] Content & Causal Flow ◼ Pedagogical Qualifications`.
- [ ] Keep left of the `◼` for the substance: what the element covers (the concept, code snippet, or visual arrangement), the actual substantive reasoning and technical derivation itself, and the causal flow (why this element belongs here, why it naturally follows the previous one, and how it leads into the next through engineering necessity).
- [ ] Keep right of the `◼` for the pedagogy: the educational objective, what to underline for the learner, and any standard React or web platform term this element introduces and explains.

[ ] PROPER EXAMPLE: make sure you follow this example, a post-code bullet with both halves working:

> - [p] Architectural Focus & Inversion: The function `handlePublishLetter` receives `formData` directly from the browser on submit, reading the submitted values with `formData.get('contributor')` and `formData.get('topic')` instead of storing every keystroke in state hooks, which eliminates three separate controlled state variables. ◼ Educational objective: teach what deliberate omission buys; underline keystroke isolation and zero-re-render typing; term introduced: **uncontrolled inputs**.

Notes: The causal derivation lives left of the `◼`, the pedagogical contract lives right of it, and both are complete enough to convert straight into lecture prose.

## Bullets | 36 | Decompress every bullet for the tired reader

- [ ] Treat bullets as high-risk compression traps: use them without abbreviating explanations or smuggling unexplained jargon, writing every bullet that introduces a file, configuration, or dependency for a tired developer with a splitting headache in plain upper-intermediate English vocabulary.
- [ ] Avoid packing multiple unexplained systems into a single sentence (for example "JSX compilation, Fast Refresh, and Rollup bundling"); for every tool or compiler mentioned, unpack (1) what it is, (2) what it physically transforms from A to B, and (3) its tangible developer or browser benefit.
- [ ] For post-code deconstruction bullets, guide the final lecture to address the 3 load-bearing pillars: the inversion of focus (what is deliberately absent compared to naive code, such as zero `value` props, zero `onChange` listeners, zero local `useState` hooks, zero per-keystroke re-renders), the runtime engine and browser mechanics (what happens in memory and the DOM, such as the native input buffer holding keystrokes without waking the fiber work loop), and the engineering rationale with causal transitions (the concrete production bug, race condition, or latency bottleneck avoided, and the bridge to the next step).
- [ ] Avoid opening post-code bullets with line numbers ("In lines 28 to 36...") or merely echoing visible syntax; cite a specific line number only sometimes, when pinpointing a critical expression, a subtle parameter, an early return, or a tricky callback signature where exact visual precision genuinely helps.
- [ ] Anchor prose directly to the construct in natural conversation: name the function (`handlePublishLetter`), the element (`<input name="contributor">`), or the mechanism (the guard clause, the early return, the default value), connecting the dots between syntax, browser reality, and architecture.
- [ ] Keep end-of-line code comments (`code; // annotation`) in direct inspiration from the surrounding commentary text, so the comments and the prose align and read effortlessly together.
- [ ] Respect strict locality: map every claim in a post-code paragraph to code physically present in that snippet, so a simple setter or `if` check never gets credited with framework-level superpowers (like suppressing page reloads) that belong to a `<form action>` in a later step.
- [ ] Avoid mechanical conveyor-belt handoffs at paragraph ends ("Next, we render the desk category dropdown:"), and connect to subsequent steps through engineering necessity and causality instead.

[ ] COUNTER-EXAMPLE: do not follow this bad example, vague throat-clearing with phantom attribution:

> Notice the architectural contrast in how values enter the handler: rather than synchronizing multiple local state hooks on every keystroke, the action receives the entire submission payload in a single native FormData dictionary.

Notes: It names no function, no method, no element; the reader is told to "notice" instead of being guided, and nothing concrete is anchored.

[ ] PROPER EXAMPLE: make sure you follow this example, natural dot-connecting with strict locality:

> The guard clause protects the editorial queue by halting execution before any network request occurs. If the contributor name or commentary is blank, the action writes an error message to `lastNotice` and exits early with a simple `return`. This keeps validation lightweight and local to the component, preventing invalid payloads from reaching `onPublish`.

Notes: Every claim maps to code physically in the snippet, the construct is named, and the causality is engineering-driven rather than a UI inventory handoff.

## Quality Gate | 37 | Verify the blueprint before touching the lecture

- [ ] Structural Mirror: the pre-lecture matches the final lecture's headings and sections 1:1.
- [ ] Literal Code: every `[code]` pre-element contains the real, runnable code block, never an abstract summary.
- [ ] Zero Unexplained Syntax: every code snippet includes the what-this-introduces list, and every audited item has an assigned `[p]` deconstruction bullet.
- [ ] No Back-to-Back Code: consecutive code blocks without intervening deconstructive prose are absent.
- [ ] Causal Continuity: every bullet explains why it follows the previous block and leads into the next.
- [ ] Dual-Canon Nomenclature: all technical mechanisms carry both their classic industry term and their modern official term, with no nameless circumlocutions.
- [ ] Term Locking & Standard Vocabulary: all technical terms intended for the lecture are declared inside their `[p]` bullets, and zero invented buzzwords can enter the subsequent lecture.
- [ ] Bullet Decompression: no bullet bundles multiple unexplained concepts; every file and tool introduced in a list is deconstructed into its A to B transformation and developer benefit.
- [ ] Conditional Headings: failure-state cards and questions use "When" instead of "Why".
- [ ] Zero Tail-End Name Drops: no paragraph or callout card terminates on an unexplained buzzword.
- [ ] Glossary Section: `### Glossary` is explicitly planned with 4 to 6 terms between `Where you will meet this` and `Summary`.
- [ ] Full Comparative Code: all `DO THIS` and `DO NOT DO THIS` blocks feature full runnable code blocks with dual what-this-introduces lists.
- [ ] Formatting: one continuous line per bullet, no hard-wrapping, and zero em-dashes.
- [ ] Continuous Code Block Pairing: multi-step component blocks specify literal continuation attributes, opening syntax is planned as a paired continuous block on `App.jsx`, and legacy comparisons use conceptual titles without `.jsx`.
- [ ] Clean Parent Component Naming: the parent defaults to `App.jsx`, or carries a short everyday domain name when it owns real architecture (shared state, child prop interfaces, layout dictatorship) of its own, framing parent simplicity via child state encapsulation in both cases. #2026_09_20_04_group_7 revised by #2026_09_20_26_group_1
- [ ] 4-Pillar Architectural Comparison: uninformative boxed-card diagrams give way to the deep 4-pillar comparison section.
- [ ] 10-Line Ceiling: every `[code]` block contains at most 10 lines of executable code, with longer components progressively decomposed.
- [ ] Assembly Figure Prescription: the code showcase prescribes the Step Cards Diagram (Template 09) whose cards mirror the collaborative 4-step sequence, and the Architecture Audit Table (Archetype 10) with the `LESSONS FROM THE CODE` eyebrow as the final step.
- [ ] Practical Example Staging: the blueprint plans all five stages (Stage A Rendered UI Canvas plus `[files]` panel, Stage B assembly pipeline `[figure]`, Stage C Step 1-4 top-down sequence sliced under the 10-line ceiling with continuation attributes, Stage D Lessons from the Experiment with the `[component-code]` role panel titled `Summary: The Logic of Nested Components`, Stage E Architecture Audit Table) whenever the example builds two or more components. #2026_09_20_04_group_7 revised by #2026_09_20_09_group_1
- [ ] Step Narration in Substance: every Stage C `[p]` bullet carries the narration beats (the notice-move, the props unpacked, the warning charge with its physical consequence, the alternative where one exists, the recap sentence) instead of a summary of the step. #2026_09_20_04_group_7
- [ ] Figure Src Integrity: every `[figure]` bullet's `src` names a file that exists on disk in `01-02-md-LECTURES/figures/` and matches its stage bullet, so no stale pointer survives a figure rename; this is the check that would have caught a blueprint pointing at a deleted `40-02-01` file while the shipped figure was `40-01`. #2026_09_20_04_group_7
- [ ] Default and Law: every bolded concept's defining [p] plans organic narrative introduction without formulaic "What is X?" self-questioning, both named sides of the contrast with their standard terms, the default sentence (the reader's habitual act in the plain web world with zero React code), the takeover as the same habit performed differently, and the closing law sentence (the one invariant naming who dictates and what is now impossible) in its own substance, not only inside a [grounding] card. #2026_09_20_03_group_1 revised by #2026_09_20_27_group_1
- [ ] Zero Leading Empty Lines: no snippet starts on an empty line.
- [ ] Natural Dot-Connecting & Strict Locality: post-code deconstructions point to the specific element or function in natural conversation, with line numbers used selectively and every claim mapped to code physically present.
- [ ] Form Vocabulary: standard inputs stay unlabeled as "uncontrolled" outside explicit state-ownership debates.
- [ ] Contrast-Grounded Verdicts: `**RIGHT:**` / `**WRONG:**` prefixes appear only inside active comparisons.
- [ ] Empathy Without Narration: the reader's surprises are addressed directly in natural prose with zero meta-labels printed anywhere (see the lecture-voice skill for the full empathy law).
- [ ] Topic Fidelity: the pre-lecture is 100% faithful to its assigned question, with nothing cloned from an adjacent lecture.
- [ ] Role Panel Fidelity: `[component-code]` role panels in Stage D follow the four-beat rhythm in serif prose per the ui-panels skill (Section 15), while code-mode panels carry only load-bearing primitives per Section 14. #2026_09_20_29_group_1
- [ ] Host Element Visibility: every prop or binding explained in prose is physically rendered bound in the snippet directly beneath it.
- [ ] Developer-at-the-Keyboard: the perspective stays at the keyboard in plain upper-intermediate English, and every runtime concept satisfies the three-part explanation (what you write, what manual work it removes, what the browser does).
- [ ] Foundational Grounding: the h-e-l-l-o keystroke analysis connects the known to the unknown, contrasting per-keystroke re-renders against native browser buffering (see the canonical recap example in Technical Grading).
- [ ] Physical Body First & Fixed Three-Step Order: explanations begin with the physical body and follow the fixed three-step explanation order in strict sequence, from the real markup that exists to the React code for it to what the browser then does.
- [ ] Concrete Physical Anchor: jargon is never explained with jargon, and new terms follow the new-terms check.
- [ ] Zero Meta-Phrasing: `[p]` bullets contain the actual substantive derivation, with "Explains that..." and "Demonstrates how..." openings absent.
- [ ] Technical Grading: every ★ paragraph opens with an expanded preknowledge recap, every {old solution:} is paired with real old code placed before the new solution, no [p] carries more than one concern, the ★/◇ mix is deliberate, and every planned technical description (a file, a command, a config) carries its consequence, what it changes for the developer or the user (see the Technical Grading principles above).
- [ ] Negative Counterfactual Planning: every Stage C step that separates architectural concerns (presenter vs effect, parent vs child state) plans the Negative Counterfactual question (*"What would happen if [Component A] handled [Responsibility B] directly?"*), the concrete disaster (trapped state, inaccessible resources, re-render churn), the physical code invariant (*"zero useState, zero useEffect"*), and the Decoupling Proof (modifying UI touches zero network code, modifying network touches zero UI code). #2026_09_20_07_group_1
- [ ] Visual Verification Discipline: taking screenshots during routine lecture and figure production is strictly banned; standard lecture authoring, panel embedding, and adapting figures from proven templates rely entirely on clean compiler output (`node src/build-lectures.mjs` with zero warnings); screenshots via pdftoppm and view_file are strictly reserved for testing brand-new experimental template designs in figures/templates/ from scratch or upon explicit user command. #2026_09_20_28_group_1
