---
name: verification
description: Governs the quality gates and visual verification protocol applied to a finished lecture or pre-lecture; use when a lecture is claimed complete or an audit is requested.
---

# Verification

This skill governs the quality gates and the visual verification protocol applied to a finished lecture or pre-lecture: for each gate it states what is checked and the pass condition, and for the audit it states when it runs, how it runs, and how its findings are written. The deep rules behind each gate live in their owning skills, so this file stays a checking protocol rather than a second rulebook (see the pre-lecture, lecture-voice, lecture-structure, code-blocks, ui-panels, and figures skills). Digests: skills/old-instructions/AUDIT-CHECKLIST.md and instructions.md (audit phase, comprehensive final checklist).

## Audit Protocol | 01 | The audit runs only when requested

[ ] The audit runs only when the user explicitly asks for it (for example "audit lecture 47"), so it stays a deliberate second pass rather than a default step in the standard authoring flow.
[ ] The audit targets a finished lecture that has been built to HTML and PDF at least once, so the independent reviewer has something stable to check against.
[ ] The audit covers the single lecture the user named, and expanding to multiple lectures happens only when the user explicitly asks, so the review keeps its depth on one target.
[ ] The audit is performed in the mindset of a fresh critical reader whose only job is finding what the original lecture missed, which is the point of running it after the author is done.

## Audit Protocol | 02 | The audit cross-checks against the authoritative local docs

[ ] The lecture is read end to end in `01-02-md-LECTURES/{n}.md` first, noting every concept, term, and example it covers.
[ ] Each covered topic is cross-checked against the authoritative local docs under `documentation official/React 19 Sept 2026/react.dev/src/content/`, because the audit's authority comes from comparing what the lecture says against what the docs say rather than from the auditor's prior knowledge.
[ ] A doc section the lecture did not draw on is recorded as a candidate gap.
[ ] The audit looks for genuinely missing material, such as related API surfaces the lecture did not mention (for example `useEffectEvent` when the lecture covered `useEffect`), alternative patterns for the same problem (for example `useReducer` when only `useState` was shown), common pitfalls left unflagged, and adjacent concepts a student would naturally need next, rather than stylistic preferences, so it stays a gap-finder rather than a rewrite.
[ ] Material the lecture already covers, even briefly, stays out of the findings, so every reported gap is net-new information for the student.

## Audit Protocol | 03 | Findings land in one appended Beyond the basics section

[ ] Findings land in a single new section appended at the very end of the lecture, titled exactly `## Beyond the basics`, and existing sections stay untouched, so the audit adds rather than edits.
[ ] The section is a bulleted list where each bullet follows the shape `- **Bold lead phrase**: explanation ...`, with the bold lead phrase naming the missing topic in 3 to 7 words and the rest explaining it in plain English with the relevant API name, code identifier, or cross-reference inline, so the format stays scannable.
[ ] Each bullet is self-contained: a student reading only the bullets, skipping the lecture body, still understands what each missing topic is and why it matters, with every technical term defined inline under the same jargon rule as the rest of the project.
[ ] Bullets cross-reference other lectures and the docs by path or number when relevant (`see Lecture 50`, `documentation official/React 19 Sept 2026/react.dev/src/content/reference/react/useEffect.md`), so the section works as a where-to-go-next hub and the explicit pointers are part of its value.
[ ] Bullets are ordered by relevance rather than source-doc order, with the most commonly needed missing topic first and the most niche last, and the section holds a reasonable 4 to 8 bullets, enough to be useful and short enough to read in one sitting.
[ ] The section stays free of new code blocks because it is high-density prose; a missing topic that genuinely needs a code example belongs in the lecture body, so it is flagged in the response to the user instead of being added inline.

[ ] PROPER EXAMPLE: make sure you follow this example, the shape of one audit bullet:

> ```markdown
> - **The useEffectEvent escape hatch**: when an effect reads a value that changes often but the effect itself should not re-run on every change, `useEffectEvent` wraps that read in a stable function (see Lecture 50, documentation official/React 19 Sept 2026/react.dev/src/content/reference/react/useEffectEvent.md).
> ```

Notes: it works because the bold lead phrase names the missing topic in a few words, the explanation defines the term inline in plain English, and the pointer tells the student exactly where to go next, so the bullet stands alone even for a reader who skips the lecture body.

## Audit Protocol | 04 | The audit closes with a rebuild and a reasoned report

[ ] The lecture is rebuilt with `node src/build-lectures.mjs` after writing the findings, so the HTML and PDF reflect the new `## Beyond the basics` section.
[ ] The rendered output is verified: the `## Beyond the basics` heading is present, the bullet count matches what was written, and the section sits at the very end of the lecture, after the Summary when one exists.
[ ] The response to the user lists the specific gaps the audit found and why each was added, citing the doc section that surfaced each gap, so the user sees the audit's reasoning and not just its output.

## Audit Protocol | 05 | Gates run inside the workflow, not after it

[ ] The pre-lecture gate passes before the production lecture is written, so the blueprint is verified while it can still be cheaply fixed rather than after the lecture has grown on top of it.
[ ] The traceability and pedagogy gates pass before the lecture is called done, so quality is checked while the work is being shaped rather than reconstructed afterwards.
[ ] In lecture revisions, the revision gate runs in a single-lecture cycle: revise Markdown for Lecture N, build immediate PDF, inspect layout and 8 gates, and only proceed to Lecture N+1 once Lecture N passes 100%; batching all Markdown files before building PDFs fails this gate. #2026_09_20_22_group_1
[ ] A clean build alone never means done, because zero warnings certifies format, not teaching quality.
[ ] The deep audit that writes findings stays on-demand: it runs only when the user asks, so the gates inside the workflow and the audit after it keep their separate jobs.

## Audit Protocol | 06 | Fact-check tool mechanics claims

[ ] Every claim about how a tool works (npm, Vite, the double dash argument separator, the generator, the bundler) traces to the local documentation corpus (`documentation official/React 19 Sept 2026/react.dev/`) or to official documentation before it enters a lecture.
[ ] A runtime claim with no source is treated as invented and is cut, so nothing reaches the student on the author's memory alone.
[ ] Invented mechanics (like claiming a package runs "in memory") fail this gate, because a mechanic the student cannot find in the docs teaches them to distrust the whole lecture.

## Pre-Lecture Gates | 07 | The technical grading gate for pre-lectures

[ ] Every ★ paragraph in the blueprint opens with a {preknowledge:} field whose recap is expanded in prose and escalated with one crisp physical detail, so no technical paragraph starts from zero (see the pre-lecture skill).
[ ] Every {old solution:} mention has a paired [code] element showing the old code, placed before the new solution, so the comparison is verbatim rather than remembered (see the pre-lecture skill).
[ ] No [p] element carries more than one concern: preknowledge with its problem, the old solution, and the new solution each live in their own paragraph element (see the pre-lecture skill).
[ ] The ★/◇ mix is deliberate: at least one ★ paragraph per mechanism taught and at least one ◇ paragraph per new concept introduced, with ◇ as the conceptual tag because ◼ remains the in-bullet qualifier separator (see the pre-lecture skill).
[ ] Every ◇ paragraph narrates in the three moves (known categories first, vague or problematic concepts next, the new category last with its proper name and an easily digestible definition), and every category carries the terminology the React community already uses, so no private vocabulary enters the lecture (see the pre-lecture skill).
[ ] Every technical description in the blueprint (a file, a command, a config) plans its consequence, what the described thing changes for the developer or the user, so no X-ray passage is approved for the lecture (see the pre-lecture and lecture-voice skills).
[ ] The blueprint plans the constructive staging before the production lecture begins: the five practical example stages (Stage A Rendered UI Canvas plus files panel, Stage B assembly pipeline figure, Stage C collaborative top-down Step 1-4 sequence sliced under the 10-line ceiling with continuation attributes, Stage D Lessons from the Experiment with the role panel, Stage E Architecture Audit Table), so a blueprint whose prose and grading pass while its guided build stays unplanned fails this gate (see the pre-lecture and lecture-structure skills). #2026_09_20_01_group_1 revised by #2026_09_20_04_group_8, #2026_09_20_05_group_1, and #2026_09_20_09_group_1

## Pedagogy Gates | 08 | The Developer-at-the-Keyboard gate

[ ] The prose reads from the developer's chair at the keyboard rather than from the compiler's or engine's internals, technical terms are treated as tools the reader writes rather than disembodied ideals, and bureaucratic brochure-speak (phrases like "fundamentally alters its submission runtime across four core guarantees") is kept out, so the reader feels personally guided step by step (see the lecture-voice skill).
[ ] The vocabulary stays at plain upper-intermediate English (CEFR B2) level, written for a reader who is tired with a short attention span, while the depth remains complete and interview-winning.
[ ] Every concept passes the three-part explanation (what you write, what manual work it removes, what the browser does): (1) what the developer writes, (2) what tedious boilerplate it eliminates, contrasted with painful patterns like manual `useState` keystroke tracking, `e.preventDefault()`, and `try / finally` loading flags, and (3) what concrete behavior happens in the browser (see the lecture-voice skill).
[ ] Sentences stay free of comma-separated run-ons that pack multiple conceptual stages into one line, so the prose flows like clear water: it reminds the physical basics (the form, the inputs, the `name` attributes), then what happens when the user interacts or submits, then the data aggregation into `FormData`, then where that data arrives.
[ ] Sentences are short and active (averaging 12 to 18 words, hard-capped at 20 words) and free of chained participial clauses (*"adhering to... while doing..."*). #2026_09_20_21_group_1
[ ] Every entity is verbally qualified with its architectural role ("the component `ComponentName`" vs "the component `<ComponentName />`", "the prop `propName`", "the `<span>` element", "the property `author.name`"); bare, unqualified tokens that force the reader to calculate what is what and split compound identifiers (`avatar Url`) fail this gate. #2026_09_20_23_group_1

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> When a user submits the form, React intercepts the native submit event automatically, gathers all contained inputs that declare a name attribute into a native browser FormData instance, and passes that dictionary directly to the action function.

Notes: it fails because one sentence carries four conceptual stages at once, which a tired reader cannot parse; the same content delivered as short single-action sentences keeps every stage visible.

[ ] The author writes from the practical developer's lived reality rather than proclaiming normative universe decrees: a claim like "developers never need to write e.preventDefault() anymore" is followed by its reason (React now prevents full-page document reloads, and standard keyboard interactions such as pressing Enter to submit are preserved).

## Pedagogy Gates | 09 | Topic fidelity and architectural independence

[ ] The lecture is checked against its assigned row in `questions/questions.md` (`# | Tier | Topic | Question | Hook`), and the title, numbered opening beats, code examples, and figures derive 100 percent from that exact question (see the pre-lecture skill).
[ ] Components, hooks, scenarios, and diagrams are authored fresh for this question, avoiding carry-over, reuse, or cloning from an adjacent lecture, so each lecture demonstrates its own unique platform primitives.
[ ] The hero mechanism belongs to this lecture's own topic: for example a lecture on form actions is built around the `<form action={fn}>` and `<button formAction={fn}>` attributes, native `FormData` harvesting, background React Transitions, and uncontrolled input resetting, and is not turned into a clone of the adjacent lecture's `useFormStatus` and `<SubmitButton>`.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> Lecture 41 opens with a SubmitButton component that reads useFormStatus to disable itself while pending.

Notes: it fails because SubmitButton and useFormStatus are the hero mechanism of the adjacent lecture; reusing them here clones the neighbor and starves this lecture's own topic of its demonstration.

## Pedagogy Gates | 09B | The Pre-Example Mechanism Bridge Gate #2026_09_20_24_group_1

[ ] Every lecture contains a dedicated conceptual section immediately before `### Let's Design a Practical Example...` that teaches the core React mechanism **dedicated to this particular lecture** (such as `### Components as Reusable Blueprints` or `### Fragments as Invisible Containers`), answering the plain platform limitation, defining the React primitive, stating the non-negotiable rule or syntax trap, and bridging to the practical scenario files; jumping directly from problem motivation into code fails this gate (see the lecture-structure and lecture-revision skills). #2026_09_20_24_group_1

## Pedagogy Gates | 10 | Typology tagging and the numbered opening beats

[ ] Line 2 matches `> INTERVIEW QUESTION | {tier} | {question text copied verbatim}`, with ` (Server)` appended to the level for Q101 to Q180.
[ ] The body opens with exactly 7 numbered beats following the Canonical 7-Slot Blueprint: (1) Scene, (2) Setup, (3) the surprising action, (4) Direct Conflict Question, (5) Danger, (6) Mystery, (7) Promise (see the lecture-structure skill).
[ ] Every beat sentence holds to 20 words or fewer.
[ ] Formatting is clean: zero em-dashes, numbered beats (`1.`, `2.`), and a single continuous line per beat with no hard wrapping.
[ ] Beats 1 to 6 describe the visible physical behavior and stay free of the lecture's mechanism terms, so the mechanism is earned later in the body rather than named early.
[ ] The numbered opening beats follow a single tangible actor, one person with an unambiguous real-world role (for example Elena, a newsroom journalist).
[ ] Newsroom jargon ("byline", "masthead", "copy", "wire", "dispatch desk") is replaced with plain words ("author profile", "site header", "text", "live feed"), so every reader can picture the scene (see the lecture-voice skill).

## Pedagogy Gates | 11 | Empathy without narration

[ ] The lecture reminds the reader how the problem used to be solved and shows what the new feature makes easier, so the change is visible.
[ ] Patterns that look weird or surprising to an experienced reader (zero props for ambient context, or the total absence of `onSubmit`, `e.preventDefault()`, and `useState` for form actions) are addressed directly in the prose, so the surprise is defused instead of left festering.
[ ] Complex terms are explained in plain English before they are used, keeping raw jargon dumps out of the text.
[ ] Meta-labels (`1. Novelty:`, `2. Weirdness:`, `Cognitive Inference:`, `Part (a/b/c)`) stay invisible everywhere in the output, so the empathy is felt rather than announced.
[ ] Unofficial metaphors ("radio tower", "Wi-Fi bubble", "ambient receiver", "satellite dish") are avoided in favor of standard React and web platform vocabulary as established in official specifications and react.dev, so the reader's vocabulary transfers to real documentation and real codebases.
[ ] Descriptive situations are told as plain reality rather than reified into fake proper nouns or pseudo-academic buzzwords, and key terms are explained at their first introduction, so "developers often fall into the habit of controlling every input" stays a plain sentence while standard terms like `prop drilling` and `uncontrolled inputs` are used where they exist (see the lecture-voice skill).

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> Typing triggers a render on every keypress, which gets slow. This is the **keystroke tracking fatigue** problem.

Notes: it fails because "keystroke tracking fatigue" is an invented term that exists nowhere in React or web platform vocabulary; the plain reality already communicates everything, and the fake label forces the reader to memorize a word they will never meet again.

## Pedagogy Gates | 12 | Natural conversational dot-connecting and strict locality

[ ] Deconstructions read like natural engineering conversation rather than robotic recitation, avoiding openers that repeat line numbers at the start of every sentence or passively read syntax (see the lecture-voice skill).
[ ] The prose points directly at the specific function, input, or attribute in question, naming the construct precisely whenever precision helps the reader follow.
[ ] Strict locality holds: every statement maps to code physically present in that snippet, so external framework behaviors (like page reload suppression) are attributed to the framework itself rather than to local setters or guard clauses, and the reader never catches the prose crediting the wrong line.
[ ] The deconstruction carries the 3 load-bearing pillars: (1) inversion of focus, what is deliberately omitted compared to legacy code (zero `value`/`onChange`, zero keystroke re-renders), (2) runtime engine and browser mechanics, what happens in memory, DOM buffers, and React's fiber work loop, and (3) engineering rationale, why this pattern prevents real-world bugs, with sequential steps connected by engineering necessity.

## Pedagogy Gates | 13 | Technical descriptions end in a consequence

[ ] Every technical description in the lecture (a file, a command, a config) ends in a consequence, what the described thing changes for the developer or the user, so zero inventory entries survive: a passage that only names and describes is cut or completed (see the lecture-voice skill).
[ ] Every paragraph that explains two or more parallel things gives each one a lettered anchor built in the four-part shape (kind-name, short reminder, contents, consequence), so no anchor ends as an inventory entry with letters (see the lecture-voice skill).

## Pedagogy Gates | 14 | In The Wild grounding cards

[ ] Each major technical section (H2/H3) carries exactly one `> [!WILD]` card, so the cadence stays predictable across the lecture (see the lecture-voice skill).
[ ] The card opens with a short, punchy, bold leading question of 6 to 9 words with zero syntax clutter.
[ ] The card speaks with everyday tactile familiarity ("Can you imagine...", "Remember the blinking cursor...") and takes the reader by the hand with intentional repetition.
[ ] All clarified key terms are bolded inside the card (`**imperative**`, `**declarative**`, `**physical DOM**`, `**virtual DOM**`, `**action prop**`).
[ ] The card banishes technical minutiae and method names and cuts straight to the aha moment, so the reader feels the concept in daily life before meeting its API.

## Pedagogy Gates | 15 | The Upward Wire Gate #2026_09_20_06_group_1

[ ] Every child component that invokes a callback prop (`onSelect`, `onChange`, `onSubmit`, `onSave`) has its origin explicitly traced back to the parent's passed function in the accompanying prose (see the lecture-voice and lecture-structure skills).
[ ] The phrase "simply invokes [callback]", "just calls [prop]", or any variation that presents the callback as self-evident or treats the parent update as telepathy is absent.
[ ] The deconstruction explicitly answers "Where does [prop] come from?", points back to the Step 1 JSX binding, explains that the child holds only a telephone line, names the exact parent function that runs in memory, and names the mechanism as **inverse data flow**.

## Pedagogy Gates | 16 | The Negative Counterfactual Gate #2026_09_20_07_group_1

[ ] Every step that explains component separation or architectural boundaries (e.g., UI controls vs. side-effects, parent layout vs. child subscriptions) demonstrates the Negative Counterfactual rather than relying on abstract praise.
[ ] Abstract platitudes like *"the cleanest architecture keeps X separate from Y"*, *"Component X is a pure presenter"*, or *"this promotes clean separation of concerns"* without negative proof are absent.
[ ] The architectural justification explicitly executes the 4-part circuit:
    (a) Asks *"What would happen if [Component A] handled [Responsibility B] directly?"*
    (b) Describes the concrete disaster (trapped state/sockets, inaccessible data, re-render churn, untestable UI).
    (c) Defines the boundary by physical code invariants (*"zero useState and zero useEffect"* / *"zero network awareness"*).
    (d) Provides the Decoupling Proof showing how modifying UI touches zero backend code, and modifying backend touches zero UI code.

## Pedagogy Gates | 17 | The Explicit Architectural Relations Gate #2026_09_20_13_group_1

[ ] Every code step that connects two files, components, or props makes the relationship explicit rather than relying on shorthand labels like "imported from a shared module" or "passes a callback down" (see the lecture-voice and lecture-structure skills).
[ ] Any relation with an asymmetry—such as a file containing multiple components, or a prop name differing from a state variable—states the exact count and names of all components involved, explains why the syntax differs (such as named exports requiring curly braces), and clarifies why one part is imported while another remains internal.

## Visual Gates | 18 | Archetype 09 Color Fidelity and Template Cloning Gate #2026_09_20_08_group_1

[ ] Every introductory code assembly figure (`figures/{NN}-01-code-assembly-pipeline.html` or Archetype 09) clones `templates/09-progressive-assembly-step-cards.html` 1:1 and adheres strictly to its CSS classes and color tokens (see the figures skill).
[ ] The four step cards use classes `.step-card.step-1`, `.step-card.step-2`, `.step-card.step-3`, and `.step-card.step-4` rather than ad-hoc inline styles.
[ ] The canonical pastel palette is present across `.card-main`: Step 1 `#d4e1f1` (blue), Step 2 `#d0e6e1` (teal), Step 3 `#f9e0c5` (amber), Step 4 `#d2ebc9` (green), with matching edge colors (`#7495be`, `#66a49b`, `#e09f67`, `#74ad68`) and divider colors (`#b0c4dd`, `#aed1cb`, `#eac4a1`, `#b2d5a5`).
[ ] Zero inline `style="background:..."` attributes exist on `.card-edge`, `.step-badge`, `.card-divider-wrap`, or `.card-content`.
[ ] The content area (`.card-content`) sits on the unified pastel surface of `.card-main` and is NEVER bleached with `background: #f8fafc` or `background: #ffffff`.
[ ] Every assembly pipeline figure passes the mechanical compiler audit in `src/build-lectures.mjs`: zero `#f8fafc` / `#ffffff` bleached backgrounds, all 4 canonical pastels present (`#d4e1f1`, `#d0e6e1`, `#f9e0c5`, `#d2ebc9`), and zero `.card-[1-4]` mutated class names. #2026_09_20_11_group_1

## Structure Gates | 18 | Structural scaffold and visual panels

[ ] The `files` panel is dedicated strictly to disk hierarchy with clean macOS chrome (`File | Role | Description`), tagged with roles (`parent`, `boundary`, `consumer`, `button`, `state`, `child`) and matching the real code 1:1 (see the ui-panels skill).
[ ] The `component-code` panel displays the component hierarchy as a full-width canvas with tokenized code, connecting JSX, hook subscriptions, colored kind tabs, and rendered terminal UI controls, scannable in under 5 seconds.
[ ] The `component-code` panel curates architectural skeletons only: the parent mounting tag, the boundary declaration, key inputs, and terminal UI indicators; full component code and local logic stay in the body editor blocks, so the panel stays an architectural map.
[ ] Column 2 of the canvas carries meaningful props only, with `none` suppressed automatically rather than displayed.
[ ] The academic term "leaf" is kept out of the prose, which uses `parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, or `terminal UI control` instead, so the vocabulary matches official React genealogy (see the lecture-voice skill).
[ ] The practical example opens with the Rendered UI Canvas: a snippet-free `components` panel in canvas mode titled `{project} - Rendered UI Canvas`, sitting before the `files` scaffold and before Step 1, so the reader sees the finished interface before the first line of code (see the ui-panels skill). #2026_09_20_04_group_8
[ ] The Lessons from the Experiment stage opens with the Component Role panel: a `component-code` panel in role mode titled `Summary: The Logic of Nested Components` with `[role:]` entries in the four-beat rhythm and zero code, scoped to the feature component hierarchy (at most 3 components, omitting outer host shells like `App.jsx`), so the hierarchy is on record in serif prose before the audit table. Every line must use all 4 pipe-separated fields (`file | props | kind | [role: ...]`) and every child component must be indented by 2 spaces per tree level (see the ui-panels skill). #2026_09_20_04_group_8 revised by #2026_09_20_09_group_1, #2026_09_20_10_group_1, and #2026_09_20_30_group_1

## Structure Gates | 19 | The 5-stage practical example

[ ] The code implementation section is titled `### Let's Design a Practical Example <Component1> <Component2>`, free of corporate buzzword headings, and unfolds in 5 stages (see the lecture-structure skill).
[ ] Stage A opens with the Rendered UI Canvas (a snippet-free `components` panel in canvas mode) followed by the `files` panel introducing component roles and disk hierarchy. #2026_09_20_04_group_8
[ ] Stage B embeds the introductory Progressive Assembly Step Cards figure (`figures/{NN}-01-code-assembly-pipeline.html`) with color-coded horizontal stage cards mirroring the collaborative step sequence (see the figures skill).
[ ] Stage C walks the code assembly through the collaborative pair-programming sequence: `### Step 1: First, we...`, `### Step 2: Next, we...`, `### Step 3: Then, we...`, `### Step 4: Finally, we...`, assembling top-down, with Step 1 constructing the parent container and passing the props each child needs in its JSX, and the final step sealing the deepest boundary instead of mounting the parent. #2026_09_20_04_group_8 revised by #2026_09_20_26_group_1
[ ] Each Step of Stage C carries the calm professor narration: at least one notice-move anchored to a concrete line or prop, a closing recap sentence (To recap this step: ...), and the mechanical template question (Are you curious how we build this?) absent (see the lecture-voice skill). #2026_09_20_04_group_8
[ ] Stage D concludes with `### Lessons from the Experiment: Naive Expectation vs Reality`, contrasting the naive expectation against what the experiment taught, and opening with the `component-code` role panel (`[role:]` entries, zero code, titled `Summary: The Logic of Nested Components`) before the audit figure, so the lesson is drawn from the code the reader just watched. #2026_09_20_04_group_8 revised by #2026_09_20_09_group_1
[ ] Stage E closes with the Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`): the eyebrow reads `LESSONS FROM THE CODE` in uppercase, the title reflects the lecture's domain challenge, the 3-column matrix reads `Component Layer` | `Naive Expectation (Legacy Approach)` | `What Happened (React 19 Reality)`, the layer rows are customized to this lecture's architecture, and the final verdict row contrasts `FRAGILE COUPLING` in red uppercase against `BULLETPROOF MODULARITY` in teal uppercase, with the table sitting directly on the page substrate with heavy 3px rules and fitting cleanly on a single PDF page with its caption (see the figures skill).

## Structure Gates | 20 | The strict 10-line code ceiling and continuation attributes

[ ] Every code block in the pre-lecture and lecture holds at most 10 lines of executable code, so an 11th line counts as a defect and long components are sliced across micro-steps with intervening prose (see the code-blocks skill).
[ ] No code snippet starts with an empty line, and `startLine` begins immediately on the first line of executable code.
[ ] Option A continuation attributes are used correctly: the first block carries `continues="bottom"`, middle blocks carry `continues="both"` (rather than "top bottom"), and the final block carries `continues="top"`, with sticky continuation tabs across section boundaries, so a sliced file reads as one continuous whole.
[ ] `startLine` reflects exact continuous line numbers within the same file across the sliced blocks.
[ ] Two consecutive code blocks always have intervening prose between them, so every block is interpreted rather than stacked.
[ ] Large body code blocks (8 lines or more) carry end-of-line comments (`code; // annotation with **BOLD KEYWORD**`), while summary code blocks (`right`/`wrong`) carry zero comments.
[ ] The host element and hero prop stay visible together: whenever prose introduces or explains a JSX prop, HTML attribute, or element-level binding (such as `<form action={...}>` or `<button formAction={...}>`), the immediate code snippet physically renders the host element with that prop bound, so headless functions and isolated hook signatures stay out of the spotlight position.

[ ] PROPER EXAMPLE: make sure you follow this example, the Option A continuation attributes across a sliced component:

> ```jsx title="src/App.jsx" continues="bottom" startLine="1"
> import { useState } from 'react';
> function App() {
>   const [page, setPage] = useState(0);
>   return <FeedPager page={page} onTurn={setPage} />;
> }
> ```

> ```jsx title="src/FeedPager.jsx" continues="top" startLine="1"
> export function FeedPager({ page, onTurn }) {
>   return <button onClick={() => onTurn(page + 1)}>Next page</button>;
> }
> ```

Notes: it works because the first block hands off downward with `continues="bottom"`, the second receives the handoff with `continues="top"`, each block stays within the 10-line ceiling, and each carries its own `title` and exact `startLine`, so the reader sees one continuous file sliced for teaching.

## Structure Gates | 21 | The standalone glossary and real-world contexts

[ ] A `### Where you will meet this` section sits right before the Glossary, holding 3 to 5 concrete one-line scenarios describing real-world application moments, each line a concrete moment plus what the concept does there (see the lecture-structure skill).
[ ] A `### Glossary` section sits directly between `### Where you will meet this` and `### Summary`, holding 4 to 6 core terms introduced in the lecture, so the reader can rehearse the lecture's vocabulary in one place.
[ ] Each glossary term is formatted as `- **Term**: Plain-English definition and concrete engineering role without em-dashes.` on a single continuous line, and the section renders on its own dedicated standalone page in the PDF (`page-break-before: always;`).

## Structure Gates | 22 | The plain-talk summary and closing comparison table

[ ] The `### Summary` opens with an authoritative **Technical Title** in bold on its own line, followed by an empty line and a plain-talk review from an experienced coder's daily perspective, opening directly with practical context rather than conversational filler (see the lecture-structure skill).
[ ] The summary uses `❒` section headers, numbered points (`1.`, `2.`) with indented sub-points as `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` on a single continuous line, and core principles highlighted with `➔ NEVER / ALWAYS / IF ... THEN ...`.
[ ] Comparative examples use a `**DO THIS:**` header with a jsx code window tagged `right` and a `**DO NOT DO THIS:**` header with a jsx code window tagged `wrong`, both with zero comments inside the code, and stay limited to summary error avoidance and genuine in-body anti-pattern comparisons (see the code-blocks skill).
[ ] The lecture ends with a comparison table against the nearest alternative: exactly 3 columns shaped `| | **COLUMN B**<br>(subtitle) | **COLUMN C**<br>(subtitle) |`, divider row `| ---: | :--- | :--- |`, bold dimensions in column 1, and long code strings split across separate backtick spans joined by `<br>`, so Prince never breaks grey-box padding mid-token or mid-string.

## Mechanical Gates | 23 | The mechanical build gate

[ ] The single-lecture build runs with `node src/build-lectures.mjs {n}` and exits at the zero warnings gate: zero warnings, because a warn counts as a defect.
[ ] Warn versus note is applied correctly: a `warn` means the fix belongs in the source markdown followed by a rebuild, while a `note` means the build already repaired it, so a note needs no source fix.
[ ] The full compilation `node src/build-lectures.mjs` generates all three reader themes (`teal`, `black`, `old`) without warnings.

[ ] PROPER EXAMPLE: make sure you follow this example, the single-lecture build invocation:

> ```bash
> node src/build-lectures.mjs 42
> ```

Notes: it works because the command targets one lecture, so the compiler output stays small enough to catch every warn and note at a glance before the zero warnings gate is declared passed.

## Visual Gates | 24 | Routine production screenshot ban and compiler sufficiency

[ ] The routine production screenshot ban holds: taking screenshots via pdftoppm and view_file during routine lecture authoring, text editing, pre-lecture blueprinting, or routine figure creation is STRICTLY FORBIDDEN. #2026_09_20_28_group_1
[ ] Standard lecture authoring, embedding markdown layout panels (`files`, `component-code`), and adapting HTML figures from existing proven templates (`figures/templates/*.html`) rely entirely on clean compiler output (`node src/build-lectures.mjs` with zero warnings) as the mechanical and layout certificate of done. #2026_09_20_28_group_1
[ ] Pretexts for routine screenshots ("checking pagination", "verifying page breaks", "inspecting figure aesthetics on a new lecture", confirming "zero pagination defects") are strictly recognized and banned, eliminating wasteful token consumption. #2026_09_20_28_group_1
[ ] Blanket multi-page dumps (e.g. `pdftoppm -f 1 -l 10`) are permanently banned across all workflows. #2026_09_20_28_group_1

[ ] COUNTER-EXAMPLE: do not follow this bad example of routine lecture screenshotting:

> ```bash
> pdftoppm -png -r 150 -f 8 -l 8 01-04-md-lectures-PDF/42.pdf /tmp/routine-check
> ```

Notes: it fails because Lecture 42's figure was adapted from an established template in figures/templates/; clean compiler output with zero warnings already certifies the build, so spending tokens rendering and viewing screenshots during routine production violates the routine production ban. #2026_09_20_28_group_1

## Visual Gates | 25 | Experimental design gate and surgical template inspection

[ ] Visual screenshots via pdftoppm and view_file are strictly confined to exactly two rare conditions: (1) creating or experimenting with a brand-new, experimental HTML figure template in `01-02-md-LECTURES/figures/templates/` from scratch that has never existed before, or (2) when the human user explicitly commands a visual screenshot check in chat. #2026_09_20_28_group_1
[ ] Standard lecture figures (`01-02-md-LECTURES/figures/*.html`) cloned or adapted from proven templates do NOT trigger screenshots; they are certified by compiler zero warnings. #2026_09_20_28_group_1
[ ] When (and only when) testing a brand-new experimental template design under authorized conditions, the exact single page where the experimental design lands is rendered at 150 dpi and inspected via view_file. #2026_09_20_28_group_1
[ ] The inspection verifies 1:1 code synchronization and zero visual collisions: zero overlapping text or badges, zero letters walking over borders, and at least 8px of breathing room, with distinct borders and clean demarcation. #2026_09_20_28_group_1
[ ] The temporary inspection image in /tmp is deleted immediately after viewing, leaving zero inspection artifacts in the workspace. #2026_09_20_28_group_1

[ ] PROPER EXAMPLE: make sure you follow this example, the surgical single-page inspection of a brand-new experimental template:

> ```bash
> pdftoppm -png -r 150 -f 14 -l 14 01-04-md-lectures-PDF/42.pdf /tmp/experimental-template-audit
> ```

Notes: it works because the author designed a brand-new experimental figure template from scratch in figures/templates/ that had never been tested before, rendering ONLY that single target page at 150 dpi, inspecting it once, and deleting the temporary image immediately. #2026_09_20_28_group_1

## Final Gate | 26 | The Comprehensive Lecture Checklist before marking complete

[ ] Before any lecture is marked complete, the Comprehensive Lecture Checklist runs as the mandatory final gate, covering all five groups end to end: the Header and Hook, the Visual Scaffold, the Code Executions, the Conclusion, and the TTS and Format Safety, and the lecture is released only when every item passes.
[ ] Header and Hook passes: the exact typology tag line, the new-terms check hook establishing a visceral real-world high-stakes scenario, the 5 to 7 numbered opening beats ending on the mystery with the mechanism never named, and every beat passing the proper-scenario clarity gate (plain upper-intermediate English vocabulary for a tired reader, every noun exactly one thing, no bare overloaded word like "editor", "live", "script", "log", "state", "hook", "render", every beat readable alone and out of order, the problem value's logic explained then repeated, the change event shown before the stale screen, and no technical shorthand left unpacked), with the last beat closing on a plain promise of what today brings rather than on the explanation of the mystery it posed (see the lecture-voice and lecture-structure skills).
[ ] Every new concept passes the experience standard: defined through what the reader can point at, starting from their closest known action, or by the visible before-and-after shape when the concept appears in code, so no concept is defined only through other words (see the lecture-voice skill).
[ ] Every load-bearing concept is defined through the default and the law: the concept is introduced organically through narrative context and problem contrast without repetitive "What is X?" formulaic interrogations, both sides of the ownership contrast are named with their standard terms, the default sentence narrates the reader's own habitual act in the plain web world with zero React code before the React version, the law sentence closes with the one quotable invariant naming who dictates and what is now impossible, and when an allegory card carries any of these, the plain-prose twin exists in the section body (see the lecture-voice skill, The default and the law). #2026_09_20_03_group_1 revised by #2026_09_20_27_group_1
[ ] Core computer science mechanisms and browser engine consequences (such as why naive DOM destruction drops focus/transitions, and how the Virtual DOM and Reconciliation diff and patch) are thoroughly explained and never omitted for boilerplate. #2026_09_20_27_group_1
[ ] The lecture is built around one visible change (one line, one prop, one file) shown early and alone, every abstraction answers a question the reader is already asking voiced aloud at the moment it arises, the first section and the promise beat of the numbered opening beats headline the growth when the topic is a new part of the file, and every construct that breaks the reader's accumulated model of a React file (a hook at the top of a conditional flow, a `'use client'` line, an `async` component, children between tags, a fragment) is taught in prose before the first code block that shows it, naming the old model, saying the new construct is allowed, and marking what distinguishes it (see the lecture-structure skill).
[ ] The lecture raises and answers the strongest alternative the course has equipped the reader to think of (a prop, a plain variable, an effect) rather than only weak strawmen, searches earlier lectures for its concepts and cites `(see Lecture N)` for every term an earlier lecture already introduced instead of re-teaching it with a fresh metaphor, and sticks to its single domain without abrupt context switching, with the `Where you will meet this` list as the one deliberate widening (see the lecture-structure skill).
[ ] Every bullet that introduces a file, configuration, or dependency deconstructs the named tools into their physical A to B transformations and developer benefits without chaining unexplained jargon, failure-state callout cards and headings use "When" instead of "Why" (for example "When does client-side rendering show a white screen?"), and no paragraph or callout card concludes by dropping an unexplained buzzword on the final line, with the concrete physical mechanics of any tail-end named concept unpacked immediately (see the lecture-voice skill).
[ ] Every technical description ends in a consequence (what the described thing changes for the developer or the user), and every paragraph explaining parallel things carries lettered anchors in the four-part shape (kind-name, short reminder, contents, consequence), so zero X-ray passages and zero lettered inventory entries survive into the finished lecture (see the lecture-voice skill).
[ ] Visual Scaffold passes: every practical example carries its Stage A `components` Rendered UI Canvas panel, every end component shows rendered lines matching the real application interface rather than empty grey bars, STATUS/ACTION placeholders, or bare tokens (containers whose children render inside them and logic modules are the two legitimate exceptions), every prose actor that owns the mechanism appears in a code block or the panel or the prose is rewritten to stop leaning on it, with compound component names grounded at first appearance, and the lecture embeds at least one `html-figure` panel, self-contained in `01-02-md-LECTURES/figures/`, cloned from a proven template in `01-02-md-LECTURES/figures/templates/` per the figure design system, free of raw `<h2>`/`<h3>` tags, within the ~380px to 420px printable height budget, and carrying a genuine graphical substrate rather than text-only content (see the ui-panels and figures skills).
[ ] Code Executions passes: all code blocks are labeled with `title="..."`, all `//` comments sit strictly at the end of the line with no floating bubbles on empty lines, verdict comments lead with `**RIGHT:**` / `**WRONG:**` words rather than glyphs (the build strips the glyphs), inline code terms and commands render with the modern rounded pill aesthetic so code terms, attributes, and CLI formulas never split awkwardly across line breaks, and all code strings in table cells are manually wrapped with `<br>`, separating prose from code and splitting multi-part expressions across separate backtick spans, so Prince never breaks grey-box padding mid-token or mid-string (see the code-blocks skill).
[ ] Conclusion and TTS safety pass: the four closing artifacts pass their gates (`### Where you will meet this`, the standalone `### Glossary`, the plain-talk `### Summary`, and the closing comparison table), all em-dashes are removed or replaced with commas or colons for synthetic voice safety, and every paragraph, bullet, and table row sits on one continuous line without hard wraps (see the lecture-structure skill).
[ ] The ten out of ten perfection standard governs the final gate: the lecture is marked complete only at ten out of ten with zero compromises, because anything less surfaces later as a student's confusion.

