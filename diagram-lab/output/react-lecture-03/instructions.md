# React Lecture + Card Series: Project Instructions

## General Operational Directives: `ppp` and `nnn`
- **`ppp` (Please Proceed)**: General execution trigger. When the user prompt contains `ppp`, it means "proceed" — immediately execute the approved plan, author or edit files, and run builds without requesting further confirmation.
- **`nnn` (Chat-Only Constraint)**: General chat-only constraint. When the user prompt contains `nnn`, do NOT make any edits or create any files in the workspace, and do not run modifying commands. Strictly discuss, brainstorm, analyze, and refine ideas in the chat until explicitly ordered to proceed.
- **Bold Key Terms Law**: Key terms in any paragraph MUST be in **bold** (e.g. `**imperative DOM scripting**`, `**state drift**`, `**component**`). Every concept introduced must be visually anchored with bold formatting.
- **The Complete Nomenclature Law (Classic & Modern Dual-Canon Mandate)**: Whenever you dedicate a paragraph or section to describing a runtime phenomenon, architectural pattern, or data structure, withholding its formal name is strictly prohibited (The Anti-"Voldemort" Law). You must provide the **Dual-Canon**: (1) the **Classic Industry Term** (what 95% of senior interviewers call it across the table, e.g. `**virtual DOM**`), (2) the **Modern Official Term** (what modern framework specifications call it, e.g. `**UI descriptor tree**`), and (3) its physical reality (e.g. *lightweight JavaScript objects in memory*). If the relationship or transition between terms causes student confusion, dedicate an `⚡ IN THE WILD` grounding card to discharge that confusion.
- **Zero-Unexplained-Syntax Law**: Every parameter, keyword, attribute, method, or symbol appearing in a code snippet MUST be explicitly audited and line-by-line deconstructed in the surrounding prose. Consecutive back-to-back code blocks without intervening deconstructive prose are strictly forbidden.
- **The Anti-Robotic Code Recitation & Natural Dot-Connecting Law**: Deconstructing code by reading visible syntax line-by-line or acting as a passive screen reader is strictly prohibited. You do NOT need to cite or explain line numbers each time: opening or peppering every sentence with line numbers is robotic, autistic, and disturbing to read. However, pointing to a specific line number *sometimes* is a great idea when pinpointing a critical expression, subtle parameter, or early return. The author must definitely point to the element, function, or construct in question in a natural way of conversation, **connecting the dots** between the syntax, the runtime engine, and the surrounding architecture. Obey the **Strict Locality Law**: every statement must map directly to code physically present in that specific snippet; never attribute framework-level mechanics (like page reload suppression) to an unrelated local setter or guard clause. Banish formulaic conveyor-belt handoffs (e.g. *"Next, we render..."*). Every post-code deconstruction paragraph MUST instead deliver: (a) **Inversion of Focus & Architectural Contrast** (directing attention to what is deliberately omitted or avoided compared to legacy patterns, such as zero `value` props, zero `onChange` listeners, and zero per-keystroke re-renders), (b) **Runtime Engine & Browser Mechanics** (grounding the code in physical DOM buffers, memory allocation, and React fiber work loop execution), and (c) **Engineering Rationale & Causal Transitions** (explaining what real-world bugs, stale closures, or latency bottlenecks are eliminated, and connecting sequential steps by engineering causality rather than UI checklists).
- **The Strict 10-Line Hard Ceiling & Progressive Code Assembly Law**: Monolithic code dumps exceeding 10 lines of executable code are strictly prohibited in any pre-lecture blueprint or production lecture. If a component or snippet contains line 11, it is a defect. Large or multi-step components must be progressively sliced across sequential micro-steps (max 10 lines per block) using Option A continuation attributes (`continues="bottom"`, `continues="both"`, `continues="top"`), each accompanied by focused line-by-line explanatory prose. Furthermore, when introducing a multi-step code construction sequence, the section should be preceded by an HTML pipeline schematic diagram inspired by the modular schematic design language from React 02 (compact modular cards, directional dashed purple connector lines `#8a5af7` with 10px circular waypoint dots, floating pill badges, and clean 2D orthogonal layout) to visually map the assembly pipeline before syntax appears. **Zero Leading Empty Lines Law**: No code snippet should ever start with an empty line. Any empty line at the start of a code block in the source file must be skipped, and `startLine` must begin immediately on the first line of executable code.
- **The Pre-Lecture First Protocol Law**: Always author, audit, and validate the pre-lecture blueprint in `md-pre-lectures/{NN}.md` first under the 10-line ceiling rule and Option A continuation attributes. Only once the pre-lecture's progressive micro-steps, line budgets, and self-audits are verified do we generate the production lecture in `md-lectures/{NN}.md`. Never touch `md-lectures/` before `md-pre-lectures/` is approved.
- **The Continuous Code Block Architecture & Continuation Tab Law**: Progressive code snippets across multiple steps or sections must use literal continuation attributes:
  - **Top Block**: ` ```jsx title="Filename.jsx" startLine="1" continues="bottom" ` (renders macOS window bar with dots, tab, and flat bottom).
  - **Middle Block**: ` ```jsx startLine="NN" continues="both" ` (flat top, flat bottom, resumes line numbering from `NN`).
  - **Bottom Block**: ` ```jsx startLine="NN" continues="top" ` (flat top, rounded bottom, seals the file cleanly).
  - **Continuation Sticky Note Tab**: Whenever a continued block opens a new section (`h3`/`h4`), the compiler automatically renders the continuation tab: `<div class="sticky-note"><span class="note-filename">Filename.jsx</span> <span class="note-tag">(continued)</span></div>`. It uses a neutral `#f8fafc` background, subtle hairline border `#cbd5e1`, zero shadow, unified slate `#334155` for both filename (13.5px, bold 700) and `(continued)` tag (12.5px, semibold 600), and generous padding `padding: 8px 22px 14px;`. Positioned at `top: -37px; left: 32px;` (indented from the left to align with code indentation and avoid card corner collisions). The parent `.editor.has-sticky-note` applies `margin-top: 4.4rem` and `padding-top: 22px` for comfortable ~30px+ clearance above the tab and below preceding prose. The compiler enforces a placement gate: the first continued block in a new section gets `show-sticky-note = 'true'`; subsequent continuation blocks within the same section set `show-sticky-note = 'false'` to eliminate redundant tabs and visual clutter while preserving continuous line numbers.
- **The Opening Section Syntax Pairing Law**: In introductory sections (*The Anatomy of...*), do NOT dump multiple disconnected standalone code windows with repetitive dots and tabs for the same file. Pair the hook declaration and its action reducer signature:
  - Hook declaration: ` ```jsx title="App.jsx" startLine="1" continues="bottom" `
  - Reducer signature: ` ```jsx startLine="2" continues="top" `
  - For legacy or pre-React 19 comparisons, use an explicit conceptual title without a `.jsx` extension (e.g. `title="Historical Pattern"`). Never use fictitious `.jsx` filenames that are not registered in the Component Explorer, preventing compiler completeness warnings.
- **The Pure Relational Hierarchy Law (Strict Prohibition of "Coordinator" and "Shell")**: The terms `coordinator`, `coordinator container`, `coordinator shell`, `parent coordinator`, `root coordinator`, `app shell`, `shell component`, and `shell` are PERMANENTLY BANNED from all lecture texts, pre-lectures, headings, code comments, instructions, and figure labels. Component relationships must be described strictly using standard relational nomenclature: **parent component**, **child component**, **parent container** (when referring to enclosing DOM/layout containers), **grandparent component**, **grandchild component**, and **nested relationship** (when multiple levels are nested), or by the component's concrete domain name (e.g. `App.jsx`, `StoryFeed.jsx`, `EditionPortal.jsx`). The top-level component must be named `App.jsx` (with `export default function App()`), rather than verbose 30-character names (such as `ConfidentialTipPortalApp.jsx`) which clutter component explorer panels, editor tabs, and diagrams. Frame the true architectural lesson: because modern hooks (such as `useActionState`) encapsulate submission handlers, loading flags, and error state entirely inside the child component, the parent component (`App.jsx`) remains completely lean, requiring zero state hooks, zero props, and zero callback plumbing. Step 4 in progressive assembly cards must match `App.jsx` with the role "Finally, we mount the [form/child] inside the parent component App.jsx".
- **The Code Block Terminology Law (Strict Prohibition of "Fence" and "Fences")**: The terms `fence`, `fences`, and `code fence` are PERMANENTLY BANNED from all lecture texts, instructions, checklists, and project communications. Always refer to code examples as **code block**, **code snippet**, **code example**, or **code window**.
- **The Human Action Step Titles & Stage Figures Law (Anti-Academic Action Phrasing)**: All multi-step headings (`### Step N: ...`) and all stage figure labels and headers in `*-code-assembly-pipeline.html` MUST use natural, active, practical developer actions. Stiff, robotic, pseudo-compiler phrasing is STRICTLY BANNED:
  - Banned: `Immutable Item Removal via Array Filter` ➔ Required: `Removing Stories with Array Filter` or `Filtering Out Items by ID`.
  - Banned: `Coordinator Setup and Finite State Machine Declarations` ➔ Required: `Setting Up the Form and Status State`.
  - Banned: `Form Template Projection and Container Closure` ➔ Required: `Rendering the Form and Submit Button`.
  - Banned: `Declarative App Shell Coordinator` ➔ Required: `Assembling the Parent Component App.jsx`.
- **The Pedagogical Code Comment Density Law (The Anti-Bare-Code Gate)**: Large body code blocks ($\ge 8$ lines) must NEVER sit as uncommented, bare walls of syntax. Every non-trivial body code block must carry clear, pedagogical end-of-line comments (`code; // Explanatory annotation with **BOLD KEYWORD**`) attached to critical expressions, state declarations, effects, or handler dispatches. Conversely, summary code blocks (` ```jsx right ` and ` ```jsx wrong ` in `### Summary`) remain strictly comment-free per the Right/Wrong Code Indicator Law (the bold directive line above the block carries the instruction).
- **The Grandma Common Vocabulary Law (Component Naming Law)**: Naming components is a serious source of cognitive confusion that demands extreme caution. Component names must reflect the simplest, universally understood everyday vocabulary that anyone's grandmother would intuitively grasp. (1) **The Grandma Test**: If you ask your grandma what a component is, she must immediately get the mental picture. Grandma knows what a `SearchBar` is; she knows what an `ArticleTitle` or `SearchSummary` is. But grandma does NOT know what a `Badge` is, has zero clue what a `Ticker` or `Prompter` is, and has never heard of a `WireCategory`! (2) **Strictly Banned Patterns**: Bad options include `SearchResultsCount`, `SearchResultsBadge`, `SearchTicker`, `WireStatsBadge`, `WireCategoryRow`, `WireStoryRow`, `ArticlePrompter`, `CommentSystem`, and `FeedbackSwitcher`. Combining three nouns, using visual CSS shapes (like "Badge") as component identities, or dragging in obscure 1920s newspaper slang creates cognitive paralysis. (3) **The Tag-Agnostic Principle**: Never name a component after an HTML tag or spreadsheet coordinate (`...Row`, `...Cell`, `...Div`, `...Span`). Individual entries are `...Item` (e.g. `ArticleItem`, `CartItem`), and section dividers are `...Header` (e.g. `CategoryHeader`). (4) **Good Options**: Always choose the simplest everyday words: `SearchSummary` (NOT `SearchBadge` or `SearchResultsCount`), `SearchBar` (NOT `SearchInputPrompter`), `ArticleTitle` (NOT `ArticlePrompter` or `HeadlinePill`), `CategoryHeader` (NOT `CategoryRow` or `WireCategoryRow`), `ArticleItem` (NOT `ArticleRow` or `WireStoryRow`), `CartItem` (NOT `CartItemRow`), `CommentSection` (NOT `CommentSystem`), and `FeedbackApp` (NOT `FeedbackSwitcher`).
- **The Anti-Useless-Diagram Gate & 4-Pillar Architectural Comparison Law**: Diagrams that merely rearrange text bullets into boxed cards without illustrating actual browser engines, memory state, AST transforms, or network lifecycles explain nothing and are strictly banned. When a diagram fails to provide genuine graphical value, delete it and author a dedicated `### Architectural Comparison: [Modern Hook] vs Hand-Rolled State` section deconstructing the 4 core engineering pillars: (1) State Triplication vs The Atomic Action Tuple, (2) Stale Closure Hazards vs Reducer Accumulation, (3) Synchronous Blocking vs Automated Transition Scheduling, and (4) Synthetic Interception vs Native Form Actions.
- **The Dual-Form CLI Command & Scaffolding Anatomy Law**: When introducing terminal scaffolding commands (such as `npm create vite@latest`), provide two distinct forms: (1) the **Generic Formula** in prose (e.g. `npm create vite@latest <app_name> -- --template react`), explaining that `<app_name>` defines the target directory on disk and the package name in `package.json` (requiring lowercase letters and hyphens without literal angle brackets), why `npm create` runs `create-vite` in memory without global installation, why the double-dash `--` is required to forward options to the generator rather than npm, and what `--template react` selects; and (2) the **Concrete Runnable Execution** in a terminal code block with the chapter's actual project name (e.g. `national-weather`), ensuring copy-paste safety without shell redirection errors. Furthermore, thoroughly deconstruct what happens on disk across all generated files and folders: `package.json` (manifest & scripts), root `index.html` (entry shell with `<div id="root">` and `<script type="module">`), `vite.config.js` (registering `@vitejs/plugin-react` for HMR and compilation), `src/` (`main.jsx` mounting to `#root`, `App.jsx` root component, styles), and `node_modules/` with `package-lock.json` created by `npm install`.
- **The Bullet Decompression & Anti-Jargon Smuggling Law (The Tired Reader Standard for Lists)**: Bullet points are high-risk compression traps. Authors must never treat list items as an excuse to abbreviate explanations or smuggle unbaptized jargon. Every bullet point introducing a file, configuration, or dependency must be written for a tired developer with a splitting headache using CEFR B2 vocabulary. Never chain multiple unexplained systems (e.g. *"JSX compilation, Fast Refresh, and Rollup bundling"*) into a single sentence. For every tool or compiler mentioned, explain: (1) what it is, (2) what it physically transforms from $A$ to $B$, and (3) its tangible developer or browser benefit.
- **The Problem-Condition Heading Law ("When" Over "Why" for Failure States)**: Never use "Why" for headings introducing bugs, blank screens, performance delays, or runtime failure symptoms (e.g., never write *"Why does client-side rendering show a white screen?"*). "Why" falsely implies that the failure is an intentional design choice or a permanent reality. Always use **"When"** (e.g., *"When does client-side rendering show a white screen?"*), which correctly frames the problem as a situational condition, timing delay, or operational boundary.
- **The Anti-Tail-End Name-Dropping Law (Zero Orphan Buzzwords at Paragraph Ends)**: Never conclude a paragraph, section, or callout card by dropping a new technical term or proper noun into the final sentence without immediately unpacking its mechanics. If a named system (such as **Hot Module Replacement**) represents the climax or resolution of an explanation, you must physically deconstruct it in that exact place: state how the server connects to the browser (e.g. a live connection), what payload moves (e.g. only the changed module), and how the browser swaps it in memory without refreshing or clearing form state.
- **The Standalone Glossary Page Law**: Every lecture must include a `### Glossary` section positioned directly after `### Where you will meet this` and immediately before `### Summary`. The Glossary must render on its own dedicated standalone page in the PDF (`page-break-before: always;`). It defines 4 to 6 core terms introduced or reinforced in the lecture, formatted on a single continuous line as `- **Term**: Plain-English definition and concrete engineering role without em-dashes.`, rendering as unbulleted cards with `border-left: 3.5px solid var(--accent);` and bold Slate-900 titles.
- **The Right/Wrong Code Indicator Law (Summary & Anti-Pattern Comparisons Only)**: For right and wrong code comparisons, DO NOT put comments inside the code block explaining what is right or wrong. Put the instruction on the line directly above the code block using flush-left text without emojis, where **ONLY the uppercase directive is bold**: `**DO THIS:** [instruction in normal weight]` or `**DO NOT DO THIS:** [instruction in normal weight]` (never wrap the following explanatory text in bold). Add `right` or `wrong` directly to the code block language tag (e.g. ` ```jsx right ` or ` ```jsx wrong `). This automatically generates the side-panel SVG indicator (emerald checkmark or rose cross). Scope of application is strictly restricted to: (1) closing `### Summary` blocks to summarize key points of thinking and error avoidance, and (2) direct in-body **anti-pattern comparisons** where a broken or legacy architectural approach is contrasted with a modern React 19 pattern (e.g. manual DOM queries vs declarative JSX). NEVER apply `DO NOT DO THIS` to terminal scaffolding commands, documentation placeholders, CLI flags, or standard setup steps. Both instruction line and code block are locked together in a single `snippet-unit` to guarantee they never break across page boundaries.
- **Form Vocabulary & Default Control Law**: Standard HTML inputs (`<input>`, `<textarea>`, `<select>`) without `value` or `onChange` are normal form controls. Never prefix individual elements, step headings, or code comments with the academic label "uncontrolled" (write `// Standard text input` or `// Text field read on submit`, never `// Uncontrolled text field`). Reserve "controlled" and "uncontrolled" strictly for architectural contrast sections where state ownership is explicitly debated (e.g. Lecture 20 and Lecture 37).
- **Bespoke Accent Bullet Styling**: Body unordered lists use custom, enlarged geometric bullets (`● ` at `1.25em`) colored in `var(--accent)` (`#0e7490`), with nested sub-bullets styled as matching open rings (`○ ` at `1.1em`), establishing a cohesive visual brand with card borders and grounding callouts.
- **Marginalia Section Headings & Summary Typography Law**:
  1. **Strong Modern Typeface (Avenir Next)**: All headings (`h1, h2, h3, h4`), marginalia titles, summary subtitles, and bold keywords (`p strong, p b`) explicitly utilize **Avenir Next** (with system sans fallbacks) with heavy weights (`font-weight: 800; letter-spacing: -0.015em;` for titles; `font-weight: 800;` for paragraph bold terms). This completely prevents Prince from falling back to thin serif fonts and guarantees bold keywords in the signature teal accent (`#0e7490`) deliver high contrast, punchy clarity, and crisp geometric legibility against the justified body copy.
  2. **Main Lecture Title & Left-Margin Headings**: The main lecture title (`h1`) and section headings in the left marginalia column (`main h3, main h4`) use the signature teal accent color (`var(--accent)` = `#0e7490`), creating an instantly distinguishable visual navigation hierarchy alongside the black body copy.
  3. **Accent Bold Terms in Paragraphs**: All bold key terms inside narrative paragraphs (`p strong, p b`) render in the signature teal accent color (`var(--accent)` = `#0e7490`), providing vibrant visual landmarks for newly introduced concepts and core mechanisms.
  4. **Tight Box Justification**: Narrative paragraphs are fully justified (`text-align: justify; text-align-last: left; hyphens: auto;`), creating clean, tight, book-like rectangular columns without ragged right edges. Dedicated headers, interview questions, summary lead titles, principles (`➔`), and code lead-ins explicitly preserve left alignment (`text-align: left; hyphens: none;`).
  5. **Summary `❒` In-Column Subheadings**: Lines beginning with `❒` in the `### Summary` section automatically render as bold in-column subheadings (`.summary-subtitle`) with a bold title (`font-weight: 800`) and the `❒` glyph in signature teal (`var(--accent)`). They remain cleanly within the body column, never colliding with the left-margin "Summary" title.
  6. **Thick Accent Summary Numbered Lists**: Top-level numbered list markers (`1.`, `2.`) in `### Summary` render with thicker weight (`font-weight: 800; font-size: 1.1em;`) and matching teal accent color (`color: var(--accent);`), giving high visual prominence to streetwise takeaways.
- **Multi-Theme Publishing Law**: Every compilation (`node src/build-lectures.mjs`) automatically publishes the entire course reader in three distinct visual themes, dynamically named with its question range (e.g. `React 19 Q01-Q39-teal.pdf`), once per theme, under the pipeline's reader name:
  1. `React 19 Q{first}-Q{last}-teal.pdf` (**Teal Theme**, e.g. `React 19 Q01-Q39-teal.pdf`): Signature Deep Teal / Cyan-700 (`#0e7490`) applied to the main title `h1`, left-margin headings (`main h3, main h4`), narrative bold keywords (`p strong, p b`), list bullets, code pills, and summary markers.
  2. `React 19 Q{first}-Q{last}-black.pdf` (**Monochrome Black Theme**, e.g. `React 19 Q01-Q39-black.pdf`): Solid black (`#000000`) applied to the main title `h1`, left-margin headings (`main h3, main h4`), summary subtitles, and all bold keywords (`p strong, p b`) inside narrative paragraphs, paired with neutral slate inline code pills and slate borders.
  3. `React 19 Q{first}-Q{last}-old.pdf` (**Old Theme**, the react-lecture-01 look, e.g. `React 19 Q01-Q39-old.pdf`): The same teal accent (`#0e7490`) on callout borders, but the -01 typography: system font stack instead of Avenir Next, weight-700 black `h1` and left-margin headings, plain black bold keywords, default-size bullets, the plain grey inline code chip (no pill border), left-aligned paragraphs (no justification), and the roomier comparison tables (`padding: 1.8rem`, 40% dimension column).
  The untagged `React 19 Q{first}-Q{last}.pdf` (and `.html`, e.g. `React 19 Q01-Q39.pdf`) is the teal alias. No separate `deck-*` reader files are produced for the lectures pipeline; the generic `deck.html`/`deck.pdf` names are used only by pipelines that have no dedicated reader name (review, data-flow).
- **Cautious Visual Verification Law (Anti-Screenshot-Waste Gate)**: Be cautious and do NOT scan screenshots or render pages (`pdftoppm`) of the build result during routine prose authoring, text revisions, or copy editing. Scanning screenshots is strictly reserved ONLY for when you have made an actual change to the visual design, layout CSS, component template geometry, or visual styling of the page/figure, OR if there is a serious grounded suspicion of an actual visual layout collision. Clean up any inspection PNGs immediately.

This document is the single source of truth for the workflow of the `react-lecture-03` project inside `diagram-lab/output/`. The project is a fully self-contained silo with one essential rule: **every question is taught first as a long-form lecture, and only afterwards distilled into a review card**. The lecture is the source of truth for depth; the card is the review artifact.

> **Project Architecture note.** This project runs three parallel content pipelines — **lectures** (comprehensive, long-form), **cards** (distilled, reviewable), and **data-flow** (architectural placement in a real app) — each with its own source folder, build step, and HTML/PDF output folders. All three pipelines draw from the same 180-question curriculum (React Q1–Q100, React Server Q101–Q180) and the same local React documentation. The lecture pipeline is authored first per question; the card and data-flow pipelines follow. The lecture teaches *how* a React mechanism works; the card distills it for review; the data-flow file teaches *where that mechanism belongs* in a real component tree, grounding the concept in the fixed ElectroShop reference architecture.

## File structure and logic

archive: Reserved for snapshots and provenance
docs: Documentation including the component data flow architecture (the dedicated project-level question bank lives at `./questions/`)

> THE WORKFLOW: Phase 1 Pre-Lecture Blueprint -> Phase 2 Full Production Lecture -> Phase 3 Card & Data Flow

### Phase 1: Pre-Lecture / Prelecture Blueprint (`md-pre-lectures/{nn}.md`)
Before authoring a production lecture, create the pre-lecture (or prelecture) blueprint in `md-pre-lectures/{nn}.md` following `PRE-LECTURE-INSTRUCTIONS.md`. The prelecture directly mirrors the final lecture headings (`#`, `##`, `###`), mapping every upcoming element into an atomic pre-element bullet (`[p]`, `[code]`, `[components]`, `[figure]`, `[callout]`, `[table]`) with in-situ pedagogical qualifications attached via `◼`. It locks in the technical vocabulary to prevent jargon pollution and ensures complete causal flow across the lecture.

### Phase 2: Production Lecture (`md-lectures/{nn}.md`)
The comprehensive, long-form lecture written from the approved prelecture blueprint. Follows all rules in `instructions.md` and `AUTHOR-BRIEF.md`.

---
➔ md-pre-lectures: First-iteration pre-lecture / prelecture blueprints mapping elements and in-situ pedagogy
➔ md-lectures: The comprehensive lecture source markdown files (the source of truth)
❯ md-lectures-html: The html files of the lectures, from the md files (`/md-lectures`)
❯ md-lectures-pdf: The pdf files of the lectures, from the html files (`/md-lectures-html`), from the md files (`/md-lectures`)

---

---
md-data-flow: The data-flow source markdown files mapping concepts onto the reference architecture
md-data-flow-html: The html files of the data flows, from the md files (`/md-data-flow`)
md-data-flow-pdf: The pdf files of the data flows, from the html files (`/md-data-flow-html`), from the md files (`/md-data-flow`)

---
md-lectures-review: The review experiment markdown files distilled from the lectures
md-lectures-review-html: The html files of the lecture reviews, from the md files (`/md-lectures-review`)
md-lectures-review-pdf: The pdf files of the lecture reviews, from the html files (`/md-lectures-review-html`), from the md files (`/md-lectures-review`)
--
src: The build scripts (`build-lectures.mjs`, `build-cards.mjs`) and shared stylesheet (`lecture.css`)

## Source of Content

- **Question bank:** `./questions/questions.md` — the 180-question curriculum (React Q1–Q100, React Server Q101–Q180), each row carrying `# | Tier | Topic | Question | Hook`. This is the single source of truth for every question. The controlled topic vocabulary lives in `./questions/topics.md`, and the design rationale in `./questions/README.md`.
- **Local React documentation (primary source for lectures):** `documentation official/React 19 Sept 2026/react.dev/src/content/` — the official react.dev content as Markdown: `learn/` (50 teaching files), `reference/react/` (hooks, APIs, components), `reference/react-dom/` (client, server, and static rendering plus the built-in HTML components), `reference/rsc/` (Server Components, Server Functions, directives), `reference/rules/`, `reference/react-compiler/`, `reference/eslint-plugin-react-hooks/`, and `reference/dev-tools/`. Use these as the authoritative technical source for lecture content; cite them by relative path (for example `documentation official/React 19 Sept 2026/react.dev/src/content/reference/react/useState.md`).
- **Supplementary research:** when the local docs do not fully answer a question, expand with online research, but always anchor claims back to the local docs when possible.
- **Reference architecture for the data-flow pipeline (primary source for `md-data-flow/`):** `docs/component_data_flow.md` and `docs/component_language.md`. The first fixes the multi-scale A/B/C explanation structure that every data-flow file must follow; the second fixes the ElectroShop component tree, the component-relationship shorthand, and the server/client boundary notation for Q101+.
- **Figure design system (primary source for `md-lectures/figures/`):** `docs/figure-design-system.md` — the visual constitution for every embedded HTML figure: the 7 proven RCE archetypes in `md-lectures/figures/templates/`, the color and metric tokens, the Never Text-Only law, the Rule of 3, the Symmetrical State Audit benchmark (`various/html/manual_vs_declarative_react.tsx`), and the print-safety rules (no raw `<h2>`/`<h3>` inside figures).

## Folder Layout

| Folder | Purpose | Author here? |
| --- | --- | --- |
| `md-pre-lectures/{nn}.md` | **Pre-lecture blueprint for question `nn`.** First iteration of material before creating the full lecture. Structured bullet-point format under preserved titles/subtitles, gathers raw official docs, and fixes pedagogical decisions. Governed by `PRE-LECTURE-INSTRUCTIONS.md`. | Yes |
| `md-lectures/{n}.md` | **Lecture source for question `n`.** Long-form Markdown, written in Phase 2 from the pre-lecture blueprint. Full formatting (headings, bold, bullets, code blocks). One lecture per question, same numbering as the question bank. | Yes |
| `md-lectures/figures/{nn}-{seq}-{slug}.html` | **Standalone HTML figure for lecture `nn`.** A self-contained HTML/CSS file (locally scoped styles) embedded into the lecture via a ` ```html-figure src="figures/{nn}-{seq}-{slug}.html" caption="..." ` code block. Cloned from the closest proven archetype in `md-lectures/figures/templates/`, obeying `docs/figure-design-system.md`. At least one per lecture; the build warns on zero. | Yes |
| `md-lectures-html/` | Build output: per-lecture `{n}.html` plus the combined course reader (`React 19 Q{first}-Q{last}.html`, e.g. `React 19 Q01-Q39.html`, and one per theme: `-teal`, `-black`, `-old`). Never edit by hand. | No |
| `md-lectures-pdf/` | Build output rendered by Prince: per-lecture `{n}.pdf` plus the reader PDFs (`React 19 Q{first}-Q{last}.pdf`, e.g. `React 19 Q01-Q39.pdf`, `-teal.pdf`, `-black.pdf`, `-old.pdf`). Never edit by hand. | No |
| `md-data-flow/{n}.md` | **Data-flow source for question `n`.** Maps the lecture's concept onto the fixed ElectroShop reference architecture using the multi-scale A/B/C structure from `docs/component_data_flow.md`. Written AFTER the lecture, in parallel with the card. One file per question, same numbering as the question bank. | Yes |
| `md-data-flow-html/` | Build output: per-question `{n}.html` plus combined `deck.html`. Never edit by hand. | No |
| `md-data-flow-pdf/` | Build output rendered by Prince: per-question `{n}.pdf` plus `deck.pdf`. Never edit by hand. | No |
| `src/build-lectures.mjs` | **Lecture build script.** Reads `md-lectures/`, writes `md-lectures-html/` + `md-lectures-pdf/`. | Rarely |
| `src/component-explorer.mjs` | **Component explorer parser and renderer.** Converts `components` Markdown blocks into the generated Finder-style panel. | Rarely |
| `src/build-cards.mjs` | **Card build script.** Reads `md-cards/` + `diagrams/`, writes `md-cards-html/` + `md-cards-pdf/`. | Rarely |
| `src/lecture.css` | Long-form article stylesheet used by the lecture HTML/PDF pipeline. | Rarely |
| `archive/` | Reserved for snapshots and provenance. Currently empty. | No |

## Component Explorer Panels and the Intro Component-Tree Gate

Every lecture must actively consider whether its core logic needs a generated **component explorer panel**, the project's properly designed component-tree visual, as an introductory reference. Use the panel whenever understanding the mechanism depends on seeing where something lives, which component owns it, what is nested or repeated, what crosses a boundary, or which rendered element a component-local reference identifies. A graph with several components is an obvious case, but it is not the only case: a single component that owns an important DOM node, conditional subtree, ref target, or lifecycle-sensitive browser resource can also require the panel. The panel is the lecture equivalent of a Finder-style reference: a project title bar across the top, a connected file hierarchy on the left, and the visual component or rendered surface on the right. It is generated HTML, not a screenshot and not hand-authored markup.

### The intro component-tree visual-reference gate

Before writing the first code block for the lecture's central mechanism, answer these questions in the working plan:

1. Does the learner need to know which component owns the state, ref, resource, or behavior?
2. Does the mechanism depend on component nesting, repeated instances, a conditional branch, a component boundary, or the identity and lifetime of a rendered DOM element?
3. Would seeing the relevant component and rendered target before the code remove ambiguity that prose alone leaves behind?

Every lecture MUST include at least one `components` panel, no exceptions: the questions above decide what the panel must show, never whether one exists. Place it after the visceral opening and a short prose description of what the learner is looking at, but before the first React code block that implements the mechanism. The panel is the learner's visual map, not an optional recap after the implementation. The generated component explorer is the required proper design; an ASCII tree, prose-only description, comparison table, or diagram placed after the code does not satisfy this gate.

A single `.jsx` file is not an automatic reason to omit the panel. A DOM `ref` is the canonical example: the learner benefits from first seeing the owning component, its rendered form or element, and the component-local variable that receives that exact node. Use a single-root panel with the appropriate visual kind and a concise annotation naming the reference and its target.

There is no omission path: no lecture ships without a `components` panel. If a mechanism looks ownership-free, use a single-root panel naming the owning component and its rendered target. The build prints a warning for any lecture with zero panels, and a clean build requires at least one.

### When to use a panel

Use one panel when the surrounding lecture example contains one coherent structural model and the reader benefits from seeing both ownership and the rendered result. Good cases include a parent importing a child, a parent passing props or callbacks to a child, a conditional branch that selects between child components, a controlled value crossing a component boundary, children passed into a layout component, multiple instances with independent state, or a component-local DOM ref whose exact target and lifetime are central to the lesson.

Do not merge unrelated code blocks into one panel merely because they use more than one `.jsx` filename. Independent examples stay independent. A separate multiple-instance case is different again: one component definition rendered several times is not a parent-child file tree, so use the `instances` visual kind described below.

### The visual-first presentation rule

The component relationship or ownership model is the learner's destination, so show that destination before showing the code that builds it. Whenever a lecture introduces a multi-component relationship, a multiple-instance arrangement, or component-scoped DOM logic that passes the intro component-tree visual-reference gate, use this order:

1. **Name the intended visual arrangement in prose.** State what the page should contain, which component owns the logic, which component or DOM target appears inside it, and what data, callback, condition, or reference connects them. Use the real example's names and stakes so the panel is an explanation, not decoration.
2. **Place the `components` block immediately after that visual explanation.** The generated panel is the first visual representation of the relationship and must appear before the first React code block that implements that relationship. Do not place a panel after the code as a recap.
3. **Read the panel as a model.** Explain the left file tree as the source relationship and the right canvas as the rendered relationship. For a single-root DOM case, name the owning component, the rendered target, the local ref, and the relevant mount or removal timing. For a repeated definition, explain the independent instances and their independent hooks. For branches, explain which child is present under each condition. For props, callbacks, context, or refs, explain the direction and meaning of the annotation.
4. **Show the code in dependency order.** Start with the parent or repeated component arrangement, then show the child or shared definition, then show the interaction or variant that completes the visual model. The code should match the panel's filenames, instances, annotations, and nesting.
5. **Derive the mechanism after the code.** Once the learner has the visual target and its implementation in view, explain why React produces that relationship and what changes when the relevant state or data changes.

This rule applies to every component panel. A lecture may still show an earlier standalone code example when that example establishes a prerequisite, but the first code for the structural relationship itself must follow its visual panel.

### Markdown authoring syntax

Place a `components` code block immediately after the prose that explains the intended visual relationship and before the first React code block that implements it. The code block is consumed by `src/build-lectures.mjs` and becomes the complete explorer panel in the generated lecture HTML.

````
```components title="dashboard-app — Component Explorer"
Dashboard.jsx | theme={theme} | shell
  Button.jsx | label="Save" onClick={handleSave} | button
```
````

For a component-local DOM identity mechanism, use a single-root panel rather than inventing unrelated components. The visual kind should match the rendered target, and the annotation should identify the exact local relationship:

````
```components title="national-times — Component Explorer"
CorrectionDesk.jsx | inputRef receives the rendered input node | form
```
````

The syntax has one entry per line:

- **File name:** The first field is a bare filename: `App.jsx`, `Header.jsx`, `cart.js`. Never write path prefixes such as `components/Header.jsx`; the build assigns every `.jsx`/`.tsx` file to the `components/` folder and every plain module (`.js`/`.ts`) to the `state/` folder automatically, so the left tree is always the canonical top-level shape.
- **Indentation:** Use exactly two spaces per nesting level. The first entry is the single root. A nested `.jsx`/`.tsx` entry is rendered inside its parent on the right canvas; module entries (`.js`, `.ts`) are listed in the left file tree only and never render on the canvas.
- **Displayed context:** The optional second field, after the first `|`, is a short prop, callback, condition, or state annotation. It appears in italic text beside the component label.
- **Visual kind:** The optional third field selects a small deterministic mock surface. Supported kinds are `shell`, `header`, `navigation`, `profile`, `badge`, `counter`, `card`, `form`, `table`, `button`, `branch`, `instances`, and `generic`. If omitted, the builder infers a kind from the filename.
- **Rendered lines (the fourth field):** The optional fourth field is the component's real UI on screen and connecting code snippets, written by the author, individual lines separated by `;;`, with `**bold**` allowed for the load-bearing value. When present, it replaces the kind's mock surface on the canvas (the kind still sets the frame color and label). This field is mandatory for every new panel; see the Component Explorer Code-Connection Standard below.
- **Window title:** The `title="..."` attribute is the project title shown in the panel's top bar. Use a short project name followed by `— Component Explorer`.

### The Component Explorer Code-Connection Standard (The 4 Canonical Rules)

Modern Component Explorer panels in React 19 lectures bridge the gap between the static file tree on the left and the rendered UI on the right by making the actual JSX glue and hook calls visible. Every panel must follow the 4 Canonical Rules:

1. **Rule 1 (The Ghost Prop Rule / Zero "none")**: The second column is strictly reserved for meaningful passed props (e.g. `onSubmit={handleSubmit}` or `title="Whistleblower"`). When no props are passed, write `none` (or leave it empty). The parser suppresses the literal string `"none"` entirely so it never clutters the component title.
2. **Rule 2 (Connecting JSX & Hook Snippets via `[code: ...]`)**: Every parent component in the explorer must declare the exact connecting JSX snippet that mounts its child: root container (`[code: return <Child />]`), enclosing wrapper/form (`[code: <form action={handleFeedback}>] ;; [code:   <SubmitButton />] ;; [code: </form>]`). Nested consumers declare the load-bearing hook or state connecting them to the parent context (`[code: const { pending } = useFormStatus();] ;; [code: <button disabled={pending}>]`). Leading spaces in `[code:   <Child />]` are preserved to render natural JSX indentation.
3. **Rule 3 (Strict Top-Retention Rule / No Bottom Fragments)**: All code snippets stay **at the top** of the component card before nested children. Even wrapping tags (like `<form>` and `</form>`) stay together at the top, indented to show what is being mounted. The nested child card sits directly below the code block inside the dashed perimeter. Nothing is ever placed at the bottom below the child.
4. **Rule 4 (Leaf Element & Multi-Line Element Wrapping)**: Leaf components (buttons, input fields, badges, status banners) culminate in the **rendered UI element** (`[button: ...]`, `[input: ...]`, `[badge: ...]`). Monospace code uses transparent, unformatted styling embedded directly into the card background. Crucially, all code and JSX elements MUST word-wrap (`white-space: pre-wrap; word-wrap: break-word;`): never crush a multi-token JSX element (such as `<button disabled={pending}>Submit</button>`) into a single horizontal line that collides with the card's dashed border. Break the element cleanly across separate lines with indentation:
   `[code: <button type="submit" disabled={pending} className="submit-btn">] ;; [code:   {pending ? "Transmitting..." : "Submit Feedback"}] ;; [code: </button>]`
5. **Rule 5 (The Code Truth & Existence Law / Zero Fictional Code)**: Every code snippet, prop, variable name, hook invocation, and JSX tag rendered in Component Explorer panels, pipeline figures, or diagrams **MUST ALWAYS ACTUALLY EXIST** in the lecture's runnable script blocks. Never display fictional props, mock hooks, or simplified variants that do not exist in the code (for example, showing a single boolean `useOptimistic(isSaved)` in the Explorer while the lecture code actually defines `{ isSaved, count }` with a reducer). The visual tools must be a direct, faithful window into the real code.
6. **Rule 6 (The Crisp Exactness & Redaction Law / Crisp Partial Syntax)**: Even when code snippets in Component Explorers or visual cards are redacted, condensed, or multi-line, they **MUST ALWAYS BE PRESENTED WITH CRISP EXACTNESS**. Props must use exact casing and values matching the code, tags must close cleanly, multi-line elements must wrap cleanly with proper indentation, and there must be zero ambiguous, naked, or broken fragments (such as naked unparenthesized returns or mismatched closing tags). When rendering JSX elements, use clean, pure markup tags matching the parent hierarchy.

### The Principle of Full Coherence & Two-Way Traceability

The Component Explorer is designed to provide full two-way traceability so that any student can trace every key construct up and down the component hierarchy without mystery:

1. **Tracing Downwards (Props Flow)**:
   - When a parent passes props to a child, the parent card's JSX snippet writes `<Child prop={value} />`.
   - The child card's top label pill displays the incoming prop (e.g. `Child prop="value"`), making it immediately visible in the layer's header menu.
   - The child card's code snippet shows `{prop}` being projected into its own markup or local expressions.

2. **Tracing Upwards (Hooks & Form / Context Flow)**:
   - When a child consumes status or context from an ancestor, the parent card's JSX snippet shows the enclosing boundary (`[code: <form action={handleFeedback} className="feedback-form">] ;; [code:   <SubmitButton />] ;; [code: </form>]`).
   - The child card's top pill shows a clean component name without clutter (zero props).
   - The child card's code snippet declares the upward hook connection (`[code: const { pending } = useFormStatus();]`).

3. **Tracing to Physical UI (The Leaf & Multi-Line Tags)**:
   - The child card concludes its code with its complete JSX element wrapped cleanly across lines (e.g. `[code: <button type="submit" disabled={pending} className="submit-btn">] ;; [code:   {pending ? "Transmitting..." : "Submit Feedback"}] ;; [code: </button>]`), showing how the state or prop directly controls the element without horizontal cramping.
   - Directly beneath that code line sits the real rendered UI element matching the idle state of the code (e.g. `[button: Submit Feedback]`).

#### Canonical Benchmark Example (useFormStatus Form Architecture):
```components title="national-times — Component Explorer"
App.jsx | none | generic | [code: <main className="feedback-app">] ;; [code:   <ArticleFeedbackForm />] ;; [code: </main>]
  ArticleFeedbackForm.jsx | none | form | [code: <form action={handleFeedback} className="feedback-form">] ;; [code:   <SubmitButton />] ;; [code: </form>]
    SubmitButton.jsx | none | button | [code: const { pending } = useFormStatus();] ;; [code: <button type="submit" disabled={pending} className="submit-btn">] ;; [code:   {pending ? "Transmitting..." : "Submit Feedback"}] ;; [code: </button>] ;; [button: Submit Feedback]
```

**The rendered-content rule (no empty surfaces).** The deterministic mock surfaces (grey bars, STATUS, ACTION) are placeholders of last resort, never a design choice. Every new panel must show what the learner would actually see on screen, through the fourth field, and that means the author must ALWAYS compute the final UI before writing the panel: run the lecture's code in your head with the real values from the snippet and write down what lands on the page. A JSX expression in braces is invisible to the learner until you evaluate it; `{totalPayout}` with tonight's three stories (800 + 1200 + 950 words at rate 0.5) is `1475`, and the panel must say so. The numbers in the panel are arithmetic performed on the numbers in the code block: if the code changes, the panel changes with it. An empty box or a row of grey bars where a computed result should be reads as broken and teaches nothing — it is the panel equivalent of a floating comment bubble, a shape pointing at no content.

**When emptiness is legitimate (the fill decision procedure).** A filled surface is always preferred, but filling everything would be its own absurdity: a wrapper decorated with invented chrome is out of context. Decide per entry, in this order:
- **An end component, one that renders JSX of its own, always gets rendered lines**, computed from the code block's JSX and its starting values. This is the default and covers nearly every entry: a `<p>`, a button label, a list, a `{count}` expression are all knowable, and so is a literal string. If the code block shows it, the panel shows it, evaluated.
- **An end component whose code block shows no JSX** gets its observable outcome: the one thing the learner would see happen, taken from the lecture prose ("prints Status: idle on mount"), and flagged to the owner as inferred. Never invent visible chrome the lecture never establishes.
- **A container whose children render inside it stays unfilled, on purpose.** Its UI is the nested children, and the build already draws them inside its box; adding invented titles or bars would be decoration, not content. This is the only legitimate emptiness on the canvas, and it is not really emptiness: the box is filled by its children.
- **A state module never renders.** It lives in the left file tree only; the build filters it off the canvas. Giving it lines would lie about what modules do.

**The traceability test (the guard against absurd fills).** Every word in a rendered-lines field must be traceable to one of three sources: the code block's JSX, the code block's starting values, or the prose's explicit description of the screen. A line whose content cannot be traced to one of those is invented filler; delete it. This is what keeps "prefer filled" from becoming "make things up": the fill always comes from the lecture, never from the author's imagination of a plausible app.

**Worked example (a payout lecture).** The code block ends with `<p>Total payout tonight: {totalPayout}</p>`, and the panel entry must carry that line, evaluated:

````
```components title="national-times — Component Explorer"
PayoutBoard.jsx | totalPayout recomputed over every story | table | Harbor strike · 800 words;; Election night · 1200 words;; City budget · 950 words;; Total payout tonight: **1475**
```
````

The right canvas now shows the story list and, bolded under it, the total the learner's code will actually print: `Total payout tonight: 1475`. The same entry written without the fourth field (`PayoutBoard.jsx | totalPayout recomputed over every story | table`) renders three empty grey bars — the exact failure this rule exists to prevent.

The same file may appear more than once in the right-hand tree when the example renders multiple instances with different props:

````
```components title="dashboard-app — Props Explorer"
Dashboard.jsx | | shell
  Button.jsx | label="Save" | button
  Button.jsx | label="Delete" | button
  Button.jsx | label="Submit" | button
```
````

For one component definition rendered repeatedly, use the `instances` kind instead of inventing a parent component. Include the count as a number in the second field so the renderer can calculate the instance chips:

````
```components title="audio-player — Component Instances"
AudioPlayer.jsx | 5 independent instances each with own useState | instances
```
````

For mutually exclusive conditional children, keep both branches under the parent and put the condition in the second field:

````
```components title="account-app — Conditional Components"
App.jsx | isLoggedIn | shell
  Dashboard.jsx | when isLoggedIn | branch
  LoginForm.jsx | when !isLoggedIn | branch
```
````

### What the builder calculates

The author supplies only the component model. The builder validates the indentation, requires one root, normalizes paths, deduplicates repeated files in the left tree, derives the `components` and `state` folders, marks the feature child as active, renders the nested component boundaries, escapes labels and props, chooses the deterministic mock surface for each visual kind, and renders the author-supplied fourth-field lines in place of the mock surface whenever they are present. The CSS in `src/lecture.css` owns the panel's dimensions, colors, tree connectors, responsive stacking, and print behavior.

The explorer is a visual explanation of the relationship; it does not execute React code. Keep the ordinary titled code blocks as the technical source of truth, and keep the explorer metadata short enough that a reader can compare the panel with the code immediately beside it.

### The canonical example scaffold (top-level folders, files one level deep)

The left tree has one fixed shape, built for minimal visual real estate: **top-level folders, each holding bare filenames directly. Nothing nests deeper than one level.**

- **`components/`** holds every `.jsx` (or `.tsx`) file: `App.jsx`, `Header.jsx`, `Sidebar.jsx`.
- **`state/`** holds every shared-logic module (`cart.js`, `api.js`, a context module), and appears only when the lecture actually has one.
- Authors write **bare filenames** in `components` blocks (`App.jsx`, `cart.js`) — never path prefixes such as `components/Header.jsx`, never nested folders. The build computes the grouping from the file type, so the tree is always the canonical shape however the entry was written.
- **Imports must reflect this structure:** within `components/`, `import Header from './Header.jsx'`; from a component to a logic module, `import { cart } from '../state/cart.js'`.
- **Exception:** when a question's subject IS a folder structure (React Server questions from Q101 on: the `app/` route tree, the `'use client'` / `'use server'` module split, server-only versus client-only code), the tree may show those real folders, because the folders are the lesson. For React core lectures there is no exception.

**The completeness law:** every file the lecture shows, as a code block `title="..."` or as an import target, MUST appear as an entry in the lecture's `components` panel tree; the tree in turn shows no file the lecture never mentions. The tree is the contract between prose, code blocks, and panel. The build warns on any shown or imported file that is missing from the tree. (Non-`.jsx` entries such as `cart.js` are valid entries; they appear in the **left file tree only**, under `state/`, with the module icon. The right canvas shows the **rendered visual hierarchy only** — a logic module is never rendered, so it never draws a box there; the builder filters module entries out of the canvas automatically.)

**The prose-actor law (no invisible owners).** The completeness law binds the tree to files the lecture code blocks or imports, but prose often invokes an actor that never appears in a code block at all: "the page stamps out three copies", "the parent passes each copy its own headline". When such an actor owns the mechanism — it decides how many instances exist, it passes the props, it triggers the change — leaving it out of every code block and panel leaves the mechanism ownerless on screen: three instance chips floating with no stamper and no visible source of the headlines. That floating is the reader's "what is going on?" moment, the exact question the panel exists to prevent. Either show the actor in a code block (show the page rendering its three cards, which gives the tree a real parent), or rewrite the prose so it stops leaning on the invisible actor. The rule extends to names: a compound component name (`PriceBlock`, `StoryHeader`) must have its parts grounded in prose at its first appearance — one sentence saying what each noun of the name means — so the name reads as one explained idea instead of two missing components.

### Placement and quality rules

- Add the panel at the smallest useful scope, immediately before the parent and child code blocks that form the graph.
- For a single-root ownership or DOM-identity panel, place it in the introduction to the mechanism, immediately before the first code block that creates or uses the relationship.
- Use the actual filenames and actual prop or callback names from the example. Do not add decorative files that the lecture never mentions.
- Use one panel for one relationship. If a lecture moves from a parent-child example to an unrelated standalone component, start a new panel or omit the panel.
- Use `branch` for conditional alternatives, `instances` for repeated copies of one definition, and ordinary nesting for parent-child composition.
- The left tree and right canvas are generated together; never hand-write a second HTML version of the panel in a lecture file or in `md-lectures-html/`.
- A malformed `components` block should be fixed in the Markdown source rather than hidden with custom HTML or a special-case CSS patch.

This convention applies to every pertinent lecture example. The generated HTML remains build output and must be refreshed with `node src/build-lectures.mjs --no-pdf`. When the source or layout changes are ready for delivery, run `node src/build-lectures.mjs` to regenerate both the HTML and PDF outputs.

## Build Commands

This project uses **two separate local builders**, one per pipeline. Both are invoked from inside the project folder.

```sh
# Lecture pipeline (also builds data-flow and review experiment):
node src/build-lectures.mjs            # build lecture + data-flow + review html/pdf
node src/build-lectures.mjs --no-pdf   # build lecture + data-flow + review html only

# Card pipeline:
node src/build-cards.mjs               # build card html + pdf
node src/build-cards.mjs --no-pdf      # build card html only
```

Each pipeline produces per-file HTML/PDF plus a combined reader (the course reader for lectures, published under the pipeline's reader name `React 19 Q{first}-Q{last}*.html/pdf`, e.g. `React 19 Q01-Q39*.html/pdf`, with one file per theme; the full card deck for cards and the data-flow atlas for the data-flow pipeline, both published as `deck.html`/`deck.pdf`). The build scripts gracefully report `no markdown files in md-lectures/`, `no markdown files in md-data-flow/`, or `no markdown files in md-cards/` and exit cleanly when their source folder is empty — so it is safe to run any pipeline before its content exists. The data-flow pipeline shares `src/build-lectures.mjs` with the lectures and review experiment: one invocation rebuilds all three, and it skips cleanly if `md-data-flow/` is absent or empty.

## The Lecture-First Workflow

For every new question processed in this project, the following steps are executed in exact order. The order is non-negotiable: writing the card first risks losing the depth the lecture is meant to establish.


### Step 1: Write the lecture (`md-lectures/{n}.md`)

- Extract question `n` from the source document.
- **Search the deck before teaching a term.** Concepts repeat across the 180 questions, and the reader meets them in order. Before baptizing any term, scan the earlier lectures for it (search `md-lectures/` for the hook name, the API name, or the concept phrase). If an earlier lecture already taught it, this lecture re-anchors instead of re-teaching: the term, its one-line reminder, and `(see Lecture N)` — then it may deepen, contrast, or extend, but never start from zero with a fresh metaphor. Two lectures teaching one concept with two metaphors and no cross-reference ("snapshot" in one, "photocopy" in the other) double the reader's vocabulary for a single idea and leave neither lecture the term's home.
- Read the relevant local React documentation under `documentation official/React 19 Sept 2026/react.dev/src/content/`. Anchor every technical claim to the docs when possible; expand with research when the docs are insufficient.
- Write a **pedagogically clear, extended, comprehensive lecture** that teaches the concept as if to someone who needs to genuinely understand it, not just memorize it.
- The first line is `# Lecture {n}: {Short Title}`.
- Apply the **Lecture format spec** below.
- Run the **intro component-tree visual-reference gate** before drafting the first code example for the central mechanism. If ownership, nesting, element identity, lifetime, or boundary flow matters, introduce the logic with a `components` panel before that code. Do not exempt a lesson merely because its main example uses one `.jsx` file.
- In the lecture, always add code snippets that are clear, concise, representative of the idea

Example of snippet (add the file name on title)

```jsx title="App.jsx"
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const double = count * 2; // Recomputed from the current state on every render
  function handleClick() {
    setCount(count + 1); // Asks React to re-render with a new state snapshot
  }
  return (
    <button onClick={handleClick}>
      Clicks: {count} (double: {double})
    </button>
  );
}
```

Important: notice that "change" arrives through a new render. Plain variable mutation never updates the screen; the setter function is the only door.

### Step 1b: The Organic Lexical Audit (OLA)

Before finishing any lecture, you MUST run the OLA to ensure no jargon is introduced superficially.
1. **Scan the text** to find lexical terms a newbie would not be familiar with (e.g., *reconciliation, hydration, bundler, tree, transpile, hook*).
2. For each term, you must write a **Specific Organic Intervention** that follows this exact 5-step progression:
   * **Step 1: The Context.** State what the user is trying to achieve. **CRITICAL RULE: The example must be a *truly practical* problem the developer actually faces in modern workflows, not a theoretical or imaginary one.** Do not artificially make up a scenario that modern scaffolding (like Vite or Next.js) solves automatically just to check this box. If the boilerplate handles the basics, find the *real* situation where they hit the wall. For example, instead of a vague "Why is my component not mounting?" (which Vite does for them), use "How do I embed a React widget into a legacy PHP CMS article?" or "How do I fix a `ReactDOM.render` crash after upgrading to React 19?". Find the real-world, high-stakes scenario where the newbie physically hits a wall.
   * **Step 2: The Naïve Alternatives.** Pose highly specific, tangible, and simple alternatives for how this could be done. (e.g., *"Should we name new pages automatically with 'p', for example, `/p/1` is page 1, and `/p/2` is page 2? Or maybe we should write `/page-1` for page 1?"*) **The first alternative posed must be the strongest one the course itself has equipped the reader to think of.** Ask: what tool from an earlier lecture partially solves this scenario? If props were taught and passing a value down would plausibly work, raise that alternative and answer it — why it fails here, or what it cannot do — before any weaker strawman such as a separate file or "shouting up to the page". A lecture that dismisses only weak alternatives, while the reader's actual first thought ("why not just pass it as a prop?") goes unasked, has a motivation hole: the tool never becomes necessary and the scenario reads as contrived.
   * **Step 3: The Architectural Need.** Frame this explicitly as an architectural decision or mechanical requirement. (e.g., *"This is a decision about the architecture of our app. We have to make sure that when a specific path is visited by the user, a specific part of our app is activated."*)
   * **Step 4: Naming the Term.** Now, and only now, introduce the lexical term as the name for this mechanism. (e.g., *"This mechanism is called reconciliation."*)
   * **Step 5: The Summary.** Summarize what the term does using the context just built. (e.g., *"Reconciliation compares the new element tree with the old one and reuses DOM nodes wherever type and key match."*)
3. **Integrate** this specific 5-step intervention into the text, replacing the original superficial use of the term.

## The Audit Phase (on-demand, runs only when the user asks)

The six steps above are the standard authoring flow for one question. The audit is **not** part of that flow — it is a separate, on-demand phase that runs only when the user explicitly asks for it (for example, "audit lecture 47"). Treat the audit as a second pass performed by a fresh, critical reader whose only job is to find what the original lecture missed. The point of running it as a separate phase, after the lecture is finished and only on request, is to simulate an independent review: the author is done, the lecture exists, and now a different perspective asks "what did this leave out that a student will actually need?"

### When to run the audit

- **Only when the user asks.** Never run the audit automatically as part of Step 1–6. The audit is a deliberate, requested review, not a default step.
- **Only on a finished lecture.** The audit makes no sense on a draft or a half-written lecture; it assumes Step 1 is complete and the lecture has been built to HTML/PDF at least once.
- **One lecture at a time.** The user will name the lecture (e.g. "audit lecture 47"). Do not audit multiple lectures unless explicitly asked.

### How to run the audit

- **Read the lecture end to end** in `md-lectures/{n}.md`. Note every concept, term, and example it covers.
- **Cross-check against the authoritative local docs.** Open the relevant files under `documentation official/React 19 Sept 2026/react.dev/src/content/` for the lecture's topic. The audit's authority comes from comparing what the lecture says against what the docs say — not from the auditor's prior knowledge. If a doc section exists that the lecture did not draw on, that is a candidate gap.
- **Look for genuinely missing material, not stylistic preferences.** The audit is not a rewrite. It looks for: related API surfaces the lecture did not mention (e.g. `useEffectEvent` when the lecture covered `useEffect`), alternative patterns for the same problem (e.g. `useReducer` when only `useState` was shown), common pitfalls the lecture did not flag, and adjacent concepts a student would naturally need next.
- **Do not duplicate what the lecture already says.** If the lecture covered it, even briefly, do not include it in the audit. The audit's value is net-new information.

### How to write the audit findings

- **Append a single new section at the end of the lecture** titled exactly `## Beyond the basics`. Do not modify or rewrite any existing section of the lecture — the audit adds, it does not edit.
- **The section is a bulleted list.** Each bullet follows the format: `- **Bold lead phrase**: explanation ...`. The bold lead phrase names the missing topic in 3–7 words; the rest of the bullet explains it in plain English with the relevant API name, code identifier, or cross-reference inline.
- **Each bullet is self-contained.** A student reading only the bullets (skipping the lecture body) should still understand what each missing topic is and why it matters. Define every technical term inline, the same jargon rule as the rest of the project.
- **Cross-reference other lectures and the docs by path or number** when relevant (`see Lecture 50`, `see Lecture 21`, `documentation official/React 19 Sept 2026/react.dev/src/content/reference/react/useEffect.md`). The audit is a hub for "where to go next," and explicit pointers are part of its value.
- **Order the bullets by relevance**, not by source-doc order. The most commonly needed missing topic goes first; the most niche goes last. A reasonable size is 4–8 bullets — enough to be useful, short enough to read in one sitting.
- **Do not add new code blocks to the audit section.** The audit is high-density prose. If a code example is genuinely necessary to explain the missing topic, that is a signal the topic belongs in the lecture body, not the audit — flag it in the response to the user instead of adding it inline.

### After writing the audit

- **Rebuild the lecture** with `node src/build-lectures.mjs` so the HTML and PDF reflect the new `## Beyond the basics` section.
- **Verify the section rendered correctly**: confirm the `## Beyond the basics` heading is present, the bullet count matches what was written, and the section sits at the very end of the lecture (after Summary, if one exists).
- **In the response to the user, list the specific gaps the audit found** and why each was added. The user asked for an audit; they should see the audit's reasoning, not just its output. Cite the doc section that surfaced each gap.

## Lecture Format Spec

The lecture pipeline uses a full Markdown renderer (`src/build-lectures.mjs`). Unlike the card pipeline, there are no card-specific constraints — you may use any combination of standard Markdown.

- **Plain markdown with full formatting.** **bold**, *italic*, bullet lists, numbered lists, inline `` `code` ``, code blocks with optional `title=""`, blockquotes, and inline `[text](url)` links are all supported and render correctly to HTML and PDF. (See the **heading rules** below for the specific roles of `#`, `##`, and `###`.)
- **The interview question is embedded in the lecture source** — it is the second line of every lecture file, immediately after the title, as a blockquote with the exact pattern `> INTERVIEW QUESTION | ❱ [TYPOLOGY] | <question text>`. The typology is `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`, with the suffix ` (Server)` on React Server questions (Q101–Q180), copied verbatim from the Tier column of `./questions/questions.md`. The build script parses this line and renders it as a pull-quote callout **directly below the title** (an `<aside class="interview-question">` styled by `src/lecture.css`), including a premium badge for the typology (e.g. `❱ CORE (Server)`). The visual order matches the source order: title first, then the question, then the lecture body. The author copies the **Question** column verbatim from `./questions/questions.md` (row `n`) when creating the lecture and may edit it inline afterward. The build no longer reads `questions.md` — the lecture file is the single source of truth for its own question.
- **Long-form, not summary.** Aim for comprehensive coverage of the concept. The lecture is the source of depth for the whole project; a thin lecture produces a thin card.
- **Lead with critical questions and visceral pain points (Organic Lexical Audit - OLA).** Always introduce new lexical terms using visceral, real-world, high-stakes contexts. Don't just explain a feature theoretically—create a scenario where a newbie would physically hit a wall without it (e.g., "if you mutate the state object, the screen keeps the old headline and you lose the sale"). Open each lecture by surfacing this real-world failure or confusion that motivates the concept. Build tension before revealing the solution.
- **Give structural logic an introductory visual reference.** Immediately after the opening establishes the pain and before the first code that implements the central mechanism, run the **intro component-tree visual-reference gate** from "Component Explorer Panels and the Intro Component-Tree Gate." If the learner must understand component ownership, nesting, repetition, a conditional subtree, boundary flow, or the identity and lifetime of a rendered element, place the matching `components` panel there and explain how to read it. This is mandatory even for a single-component example when the component-to-DOM relationship is the mechanism; a DOM `ref` is the canonical case.
- **Combine theory, technical definitions, and practical examples.** Every lecture should braid three threads: (1) the formal definition of the mechanism, (2) why it exists and what pain it removes, and (3) at least one concrete code example drawn from realistic React code.
- **Earn a new technical term before you name it.** When a concept is about to land — especially one that looks imposing at first glance — do NOT rush straight into the jargon. If a reader is still wondering *why this thing even needs to exist*, hitting them with the formal vocabulary (the named phases, the API names, the render pipeline) feels estranging rather than enlightening; the term arrives before its necessity does, and complexity reads as overwhelm. The fix is a short orienting paragraph that first establishes the human problem the machinery solves, and only then introduces the term as the name for that solution. The term should feel like a relief — "oh, *that's* what this is called" — not a wall.

  **Worked example — introducing the render and commit phases.** Do NOT open by listing trigger, render, and commit cold. A reader who has never thought about the render pipeline will not yet see why those names matter. Instead, earn the vocabulary with an intro paragraph like this:

  > Every React component has a rhythm. Something changes (the reader clicks, a fetch resolves), your component function runs again from top to bottom, and the screen ends up matching the new data. Why does this matter? Because you can write code that runs at one of these moments and not the others. Your component body runs during the render pass, and it must not touch the outside world yet. Your effects run after the DOM has been updated, which is the legal moment to measure, focus, or subscribe. And between the two, React has already decided which DOM nodes actually changed, so only those are touched.

  Only after that grounding does the term arrive as the name for what the reader already understands: those three moments are the **trigger**, **render**, and **commit** phases, and knowing which phase your code runs in is the key to almost every React rule. The named vocabulary now labels a concept the reader already holds; it does not introduce one they do not.

  This rule is the **front half** of the jargon rule directly below. First earn the term (this rule); then, once named, define it immediately in plain English (the next rule).
- **Explain every difficult term inline.** The same jargon rule as the cards applies: keep the technical term, then immediately define it in plain English in the same sentence. Pattern: `the **commit phase** — the moment React writes the agreed changes into the real DOM, after your component function has finished`.
- **Ground every new term in what the reader has already done or seen, never only in another term.** A definition built from other technical words defines one unknown with more unknowns. Find what the reader has already done or seen in this course that *is* the term, and define the term from there. The full standard, with the pattern, is **The experience standard** below.
- **These instructions supply method, never wording.** No phrase from this document — a rule name, a worked case, an analogy, an example sentence — may appear in a lecture. When a rule shows you a sentence, that sentence shows the move; write your own sentence for your own case.
- **Teach a structural surprise before the code block that shows it.** Lecture by lecture, the reader builds a model of what a React file can contain — whatever the course has shown them so far. When a lecture introduces a construct that breaks this model, the surprise itself is content, and it must be taught in prose ahead of the first code block that shows it. The prose does four things: it names the model the reader holds; it tells the reader, in the lecture's own words, that the construct is allowed and normal; it places the construct against the familiar one (where it sits, and what marks the difference — an extra line at the top of the file, a different function shape, an unfamiliar prop); and it anchors to the form the reader has already used in earlier lessons. Structural surprises in this course include: a hook called at the top of a function when the reader's model says functions run top-to-bottom conditionally, a file whose first line is a bare string directive (`'use client'`), an `async` component that awaits inside its body, a component that receives JSX between its tags for the first time, a custom hook file, or a fragment where an element was expected. Worked case, told as the cooking analogy: every recipe in the course so far has used milk, so the reader's model of a recipe is "ingredients plus milk". One day a recipe quietly shows butter going into the same pan, and the reader stalls: wait, butter and milk, together in one recipe? Is that even allowed? The prose above the recipe must answer before the question forms. In code the shape is identical whenever a code block contains a construct in a place the reader's model says is impossible; the four prose duties are the same. A code block that breaks the model silently forces the reader to rebuild it mid-code — the exact moment they stop following.
- **Numbering.** Lecture file `{n}.md` corresponds to question `{n}` in the source bank. The numbering matches `md-cards/{n}.md`, `md-design/{n}.md`, and `diagrams/{n}.html` exactly, so any artifact can be cross-referenced by number.
- **Every lecture has a `### Where you will meet this` section, right before `### Summary`.** The mechanism is taught first; this section then answers the reader's natural next question: where does this show up in real apps? It is a list of 3 to 5 uses, one line each. The first line may be tonight's own case; the rest are other apps the reader knows. Every line is one pictureable moment plus what the concept does there (shape: "the cart total changes the moment you add an item: the total is derived from the cart it watches"). Each line passes the experience standard — a concrete situation, never an abstract category. No more than five lines. This section is the one sanctioned widening of the lecture's world: the story never switches worlds; this list surveys other places on purpose.
- **Every lecture closes with `### Summary` plus a comparison table.** This is a hard structural rule, not an optional flourish — the lecture is incomplete without both. The closing has two parts, in this order:
  1. **`### Summary`** — **The Streetwise Review**. The body of text under `### Summary` MUST begin with an authoritative **Technical Title** formatted in bold (`**Technical Title**`) that encapsulates the architectural mechanism, followed by an empty line, before the opening review paragraph begins. Instead of a dry academic recap, adopt the perspective of an experienced developer giving streetwise advice to a junior colleague. Tell them *when* they will actually write this code (Once per app? In every component? Never?) and *why* it matters in daily practice. **NEVER open the summary with conversational filler or verbal tics such as "Look," or "Look, in practice...".** State the practical reality or daily developer frequency directly (for example: "In daily production, you configure this entry point exactly once per app...", or "Every interactive feature in your codebase eventually relies on...").
     - **Structure**: Break the summary into logical sections starting with `❒ {Subtitle}`.
     - **Bullets**: Use numbered lists (`1.`, `2.`) for points under each subtitle. For sub-points, use indented letters with HTML breaks: `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` so they remain on one continuous line without hard-wrapping.
     - **Principles**: Start important principles with the `➔` arrow symbol (e.g., `➔ NEVER do this...`, `➔ ALWAYS do this...`, `➔ IF you want to **do this** THEN **do that**`).
     - **Emphasis**: ALWAYS bold key words or phrases in every bullet to make it skimmable. Keep it to roughly one page.
  2. **A comparison table** — a markdown table immediately below the Summary that contrasts the lecture's mechanism against its nearest alternative (e.g. React hooks vs class components, `useState` vs `useRef`, controlled vs uncontrolled inputs, Server vs Client Components, React vs Svelte). Two or three columns: the dimension on the left, the alternatives across the top.
  **Table Alignment Formatting:** You MUST right-align the first column (the row headers) and left-align the remaining columns. Use the exact markdown syntax `| ---: | :--- | :--- |` for the divider row. This is the visual anchor that lands the "what makes this different" point, and it is what the audit phase, the card, and the reader all lean on. If the lecture genuinely has no meaningful contrast (rare), substitute a "what to remember" two-column table of term → one-line definition, using the same `| ---: | :--- |` alignment.
  **Table Code Formatting (CRITICAL — No Auto-Wrapping of Code):** Table columns in the PDF are narrow (~240px). If an inline code string is long or contains slashes, dots, or parentheses, Prince will wrap it mid-token (e.g. `react-dom/` on one line and `client` on the next, or `createRoot(node).render(<App` on one line and `/>)` on the next), producing ugly broken grey boxes with dangling padding. To completely prevent this:
  - ALWAYS separate explanatory prose from code with `<br>`: `Imported from<br>`react-dom/client`` instead of `Imported from `react-dom/client``.
  - ALWAYS split multi-part expressions or method chains across separate backtick spans with `<br>`: `createRoot(node)`<br>`.render(<App />)`, or `ReactDOM.render`<br>`(<App />, node)`.
  - ALWAYS split long identifiers across separate backtick spans with `<br>`: `ReactDOM.`<br>`unmountComponentAtNode`.
  - Never put `<br>` inside the backticks (`foo<br>bar`); put `<br>` between separate backtick spans (`foo`<br>`bar`).

  This rule exists because the Summary + table pair was an *unwritten convention* in earlier projects and got dropped under context pressure, as did the cleaner right-aligned first column styling. Making the streetwise format explicit here prevents dry recaps and anchors the lesson in reality.

### The experience standard: how a new concept is defined

A new concept can be defined in two ways. Only one of them teaches.

- **Definition through other words.** The concept is explained with other concepts. "It is a function that returns markup." Nothing can be pointed at. The reader memorizes words.
- **Definition through experience.** The concept is explained through what the reader can see, open, or has already done. "In your files you have functions whose names start with a capital letter and whose return is JSX. Open one: it receives props, it returns markup, the app renders it. Those functions are React components." The reader can point at the thing.

Five rules follow:

- **Experience first.** The first definition of a concept always goes through experience. A definition through other words may follow, as a short summary. It never leads.
- **Start from the closest known action.** Find the nearest thing the reader has already done in this course. The new concept is that action plus one change. "You already write a function that returns JSX. Write it again, and wrap one line in `useMemo`. That is the new concept." Teach the change, never the whole idea from zero.
- **If the concept is visible in code, the definition is its shape.** Some concepts appear as a visible part of a file: a hook call, a directive line, a file ending, a prop name. Define them by comparison. Your files so far contained A. This file also contains B, one extra thing, placed there. Without it: the problem you just watched. With it: what changes. The before-and-after shape of the file is the definition.
- **When the new part is the topic, it is the headline.** Some lectures exist to add one new part to the reader's model of the file. The headline of such a lecture is: your file grows a new part today. Say it plainly in the first section. The story and the example demonstrate the part; they are not the headline. The opening ladder ends by promising the new part, not only the story's outcome.
- **The check.** After every definition ask: can the reader point at a file, a folder, a line of code, or a thing on the screen, and say what it does? If yes, the definition passes. If it only connects words to words, rewrite it.

### The one thing, and the question the reader is already asking

**Every lecture has one thing.** One concrete change carries the whole concept. One line, written differently. One prop, added. One file, created. One call, made. Find it before writing anything. It is the smallest complete form of the concept: the thing the reader could rebuild from memory when every other sentence is gone.

- **The one thing is the center.** Show it early. Show it alone, clean, with nothing competing beside it. Then let everything else — mechanism, contrast, story — explain what stands around it. If the reader keeps one item from the lecture, it is this one.
- **Every concept has a concrete form, even the invisible ones.** A hook call is a thing in a file. A directive is a line at the top of a file. An external module is a thing in a folder. Even a concept with no shape of its own is created by one line, called by one line, or kept in one file. Find that line, that place, that file. That concrete something stands at the center of the presentation, in its clearest form. The abstract is explained from it, never instead of it.
- **The test for the one thing.** Say it as one visible change. If you need a paragraph, you have not found it yet. Keep cutting until one line is left.

**Move from concrete to abstract through the reader's own question.** The reader is not empty. They already know a way — the old way, taught in earlier lessons. The moment they see the one thing, that knowledge fires a question: Why this? We already have a way to do this. Why here, in this file, in this form? Ask that question out loud, in the reader's words, at the exact moment the reader thinks it. Then answer it. Every step toward the abstract is the answer to a question the reader is already asking. An abstraction that answers no live question teaches nothing — cut it, or find the question it should answer.

### Comparison table format (the title row is the markdown header)

Every Summary table follows **one fixed shape**. The title row is the markdown header — it renders as a real `<thead>` and is visible. The leftmost header cell is left **empty**, so the top-left corner of the table is blank by design: there is no title over the leftmost "dimension" column. The column titles go in the remaining header cells, formatted as `**TITLE**<br>(subtitle)`.

**Exact markdown skeleton** (three columns; adapt the count for your contrast):

```
| | **COLUMN B TITLE**<br>(subtitle) | **COLUMN C TITLE**<br>(subtitle) |
| ---: | :--- | :--- |
| **Dimension one** | value | value |
| **Dimension two** | value | value |
```

**Canonical example** (a React lecture's closing table):

```
| | **VANILLA JS**<br>(Manual DOM) | **REACT**<br>(Declarative Components) |
| ---: | :--- | :--- |
| **Who updates the DOM** | You, node by node, by hand | React, from the description your component returns |
| **Screen and data** | Drift apart the moment you forget an update | One source of truth: state renders to screen |
| **Reuse** | Copy-paste with different IDs | Components carry their own logic everywhere |
| **Cost** | Nothing extra at runtime | The React runtime in the bundle |
```

**Rules, in order of importance:**

1. **The first header cell is always empty** — `| |` at the start of the title row. This blanks the top-left corner: no title over the leftmost "dimension" column. The empty cell is structurally still a normal title cell (it keeps its borders and padding so the top line runs the full width of the table), it just has no text. The CSS keys off `thead th:empty` only to neutralize any stray background — leave the cell empty in the markdown and the rest is automatic.
2. **Column titles live in the header row**, formatted as `**TITLE**<br>(subtitle)`. The build runs header cells through the inline formatter, so `**bold**`, `<br>`, and inline `` `code` `` all work. The title is the short name (e.g. `VANILLA JS`); the parenthetical is the one-word gloss of what kind of thing it is (e.g. `Manual DOM`).
3. **Prevent awkward code wrapping (CRITICAL RULE FOR PDF TABLES)**. Table columns in the PDF are narrow (~240px). Never let inline code strings wrap naturally across lines—doing so causes Prince to break the grey background padding into awkward, ugly fragmented chips across lines (e.g. splitting `react-dom/client` into `react-dom/` and `client`, or splitting `createRoot(node).render(<App />)` mid-expression).
   - **Separate prose from code:** Put `<br>` between leading prose and the code span, e.g. `Imported from<br>`react-dom/client``, `Two-step:<br>`createRoot(node)`<br>`.render(<App />)``.
   - **Split long code strings:** Break multi-part code across `<br>` using separate backticks: `createRoot(node)`<br>`.render(<App />)`, `ReactDOM.render`<br>`(<App />, node)`, or `ReactDOM.`<br>`unmountComponentAtNode`.
   - Never put `<br>` inside the same backtick pair (e.g. `foo<br>bar`); always put `<br>` between distinct backtick spans (`foo`<br>`bar`).
4. **The divider row is `| ---: | :--- | :--- |`** — right-align the first (dimension) column, left-align the rest. This is load-bearing for the rendered look.
5. **Body rows start with a bold dimension** in the leftmost cell: `**Architecture**`, `**Bundle Size**`, etc. The CSS sizes `td:first-child strong` larger, so the dimension reads as a sub-heading inside its row.
6. **Never put titles in a body row.** The markdown header is the real title row; putting titles in a body row produces a duplicate, unstyled title strip.

### Heading rules (load-bearing)

The three markdown heading levels have distinct, non-interchangeable roles. Using the wrong level changes both the rendered HTML and the PDF pagination.

- **`# ` (h1) — the lecture title.** Used exactly once per lecture, as the first line. Pattern: `# Lecture {n}: {Short Title}` — for example, `# Lecture 52: What Makes a Good Key and Why Index Fails`. The renderer uses this line as the page title and the entry heading in the course reader.
- **`## ` (h2) — page break.** Every `## ` heading forces the PDF to start a new page (and the deck HTML to insert a lecture-break rule). Use `## ` sparingly: only when a section genuinely needs its own page — for example `## Beyond the basics` (the audit section) or a major part boundary inside a long lecture. Most lectures should have at most one or two `## ` headings.
- **`### ` (h3) — the default section heading.** Every normal section inside a lecture uses `### ` — the "Problem," the "Mechanism," the "Worked example," and so on. `### ` does NOT trigger a page break; the section flows inline. If you catch yourself reaching for `## ` for a regular section, switch to `### `.

Quick test: if the heading introduces a new subsection of the current lecture and you do NOT want a page break, it is `### `. If you want the next page to start here, it is `## `. The title at the top is always `# `.

### The interview-question line (exact pattern)

- **Position**: line 2 of the lecture file, immediately after `# Lecture {n}: ...`. No blank line between them.
- **Format**: a markdown blockquote, prefixed with `> `, then the literal token `INTERVIEW QUESTION`, then a space, a vertical bar, a space, then the curriculum typology (`❱ CORE`, `❱❱ MORE`, `❱❱❱ ADVANCED`, each optionally followed by ` (Server)` for Q101–Q180), a vertical bar, a space, then the question text.
- **Example** (verbatim, including the `>` and the `|`):
  ```
  > INTERVIEW QUESTION | ❱ CORE | Why do ordinary variables forget their values between renders, and how does useState remember?
  ```
  and for the server course:
  ```
  > INTERVIEW QUESTION | ❱ CORE (Server) | What is hydration, and how does hydrateRoot attach interactivity?
  ```
- **A blank line follows** before the rest of the lecture body begins.
- **Editing**: to change the question, edit this single line. Do not edit `./questions/questions.md` and do not edit the build script — the build reads only from this line.
- **If the line is missing**, the build renders the lecture without a callout (no error, but the visual anchor is gone — always include it).

### The Opening Ladder (opening pattern)

> **Naming note.** In a React course the word **hook** belongs to React, so the author-facing name for the opening scenario built from the question bank's Hook column is the **Opening Ladder**. The build's internal CSS class `hook-ladder` is a historical artifact; authors never see or write it.

Every lecture opens with two parts: nothing, then the **Opening Ladder**. The pattern exists for the tired, low-attention reader: one beat at a time, each beat numbered, forward pull from number to number, and the mystery held back until the body earns it.

**Part 1 — nothing.** The Interview Question box shows the question and its tier badge only. There is no hook line in the ladder format: never write a leading scene line between the question line and the ladder, and never write the ladder's "Imagine this scenario:" lead yourself — the build generates it. (The build keeps pulling a legacy prose opening into the box for lectures written before this rule, but it never treats a list line as a hook.)

**Part 2 — the Opening Ladder.** Immediately after the question line (and its blank line), the body opens with exactly 7 numbered beats adhering strictly to the Canonical 7-Slot Ladder Blueprint: (1) Scene, (2) Setup, (3) Mismatch Action, (4) Question, (5) Danger, (6) Mystery, (7) Promise. Each beat is one continuous markdown line, one idea per line, no sentence over 20 words. The objective is absolute clarity, never cryptic telegraphic riddles. The ladder ends on the mystery or the promise, never on the answer.

**The Canonical 7-Slot Ladder Blueprint:**
- **Beat 1 (The Scene)**: `[Named person with role] [takes single action] on The National Times website.` (budget: <= 16 words)
- **Beat 2 (The Setup)**: `The webpage displays [visible value or element] across [N] separate places on the screen.` (budget: <= 16 words)
- **Beat 3 (The Mismatch Action)**: `[Person] saves [new value], but [your code] updates [N-1] spots and misses [the last one].` (budget: <= 18 words)
- **Beat 4 (The Question)**: `Why does [the broken element] on the screen still show [the old value]?` (budget: <= 15 words; must end with a question mark)
- **Beat 5 (The Danger)**: `[Conflicting state] confuses [users] and makes the website look broken and unreliable.` (budget: <= 15 words)
- **Beat 6 (The Mystery)**: `The [system or memory] holds [new value], but [the webpage cannot update itself].` (budget: <= 16 words)
- **Beat 7 (The Promise)**: `Today you learn how React [solves this problem] and keeps [the interface in sync].` (budget: <= 16 words)

**Part 3 — the first section after the ladder.** Immediately after the ladder, the teaching begins under a `### ` heading with a catchy title that names the chapter's idea. A bare paragraph must never sit between the ladder and the first heading: after the scenario, a properly titled section opens the explanation, carries the naming of the mechanism, and leads into the first code. Every later block of teaching gets the same treatment — prose lives inside titled sections, not loose between them.

**The lead sentence and the wrapper are the build's job.** The build detects the ladder structurally — the first numbered list of the body, before any section heading — wraps it in its own styled section (never split across pages), and generates the lead line `Imagine this scenario:` above the beats. Authors write ONLY the numbered beats: never write the lead sentence, and never wrap anything in a div by hand. Any numbered list appearing after the first section heading renders as an ordinary list.

**Rules:**
- **Never name the mechanism term in the ladder.** No hook names, no API doing the reveal, no "the answer is". The ladder poses; the body answers. The term is earned where the lecture body builds it (the OLA and jargon rules apply from there). (The words "hook", "state", "render", "component" are course vocabulary, not automatically the mechanism: if the lecture's mechanism IS one of them, do not name it.)
- **The last beat promises, it never explains.** The closing beat may promise what today brings, in plain words. It may not answer the question the ladder posed; the explanation belongs to the body's first section. A ladder that ends by explaining the mystery has spent its tension one beat early.
- **Numbers, not bullets.** The beats are an ordered escalation; bullets are reserved for unordered lists (Summary takeaways, feature lists). A number promises a next one; that forward pull is the whole point.
- **No label on the page.** The ladder is presented bare, directly under the Interview Question box; no "Intro" heading, no extra chrome. The internal name lives only in these instructions and in conversation with writing models.
- **Consistency of world.** The ladder's scene is the same world the hook column of the question bank seeds, and the same world the lecture body keeps; no context switching. The course's running world is the National Times newsroom.
- **Mechanism vocabulary in disguise is still naming.** Words like "re-render", "reconcile", "hydrate", "commit", "memoize" are the mechanism by another door. Write the visible behavior instead: "the page keeps showing the old headline", "the list prints the wrong rows".

**Who you are writing for: the tired-reader standard.** Before writing one beat, fix the reader in your mind: a person reading English at B2 level (comfortable with everyday words, lost in idioms and rare vocabulary), at the end of the day, tired, with a mild headache, giving the page one chance. The ladder is the reader's first contact with the topic, so its beats must be the clearest sentences in the entire lecture, clearer than the body and clearer than the summary. If a beat can be read two ways, a tired reader takes the wrong way, and the lecture loses them in its first ten seconds. Write every beat so it survives that reader.

**The identity test: one noun, one thing.** Every noun in every beat must be exactly one of four things, and only one: (a) a person, (b) something visible on the screen, (c) something in the code (a file, a variable, a line), (d) a machine event (the browser, the network, the server). A noun that can be read as two of these fails the beat. Name each thing so only one reading survives: a person gets an unambiguous human role ("a journalist types a new headline", never write unnatural boilerplate like "a real person"), the program gets its full name ("your code editor, the program, like VS Code"), the screen gets its place ("the headline at the top of the page"), the code gets its shape ("one line of your code", "the variable that holds the headline"), the machine gets its name ("the browser").

**The overloaded-word list.** Web work reuses ordinary words as technical terms, and a beat has no room to carry both meanings. Never write these bare in a ladder beat; replace each with the concrete, observable thing:
- **"editor"** — the worst offender: it can be the human editing the site, the site visitor, or the code editor program. Write "the journalist" or "the visitor" for the person; write "your code editor, the program" for VS Code.
- **"live"** — broadcast-live? deployed? running? reactive? Say the observable fact instead: "the site is open in the reader's browser right now".
- **"script"** — in a coding lecture it reads as a code file or a `<script>` tag. If the scenario world means a broadcast script, name it in full ("the broadcast script, the text of tonight's show") or cut it.
- **"log"** — as a verb it collides with `console.log`; as a noun it is a file or firewood. Write "print it to the console".
- **"state", "props", "hook", "render", "mount", "hydrate", "trigger", "store"** — mechanism vocabulary wearing everyday clothes; the ladder never names the mechanism, and these words are the mechanism by another door. Write the visible behavior: "the page keeps showing the old headline", "the button does nothing until the whole page has loaded".
- **World furniture** ("the newsroom desk", "the studio", "the bullpen") — the reader has never seen your scenario's office. Keep it only when the beat itself says what the thing is, or drop it.

**The logic-first rule (no unexplained value on screen).** Every value the ladder turns into a problem — a total, a count, a badge, a price — must have its logic stated on the ladder, in plain words, before it breaks. The reader must be told what the number computes, from what inputs, and why anyone cares. A value that merely appears ("The payout total under the story list sits frozen at its old number") is a cipher: the reader cannot fear the loss of a number whose meaning was never given.

The pattern is two beats, and both are required:
- **Beat one carries the explanation.** The beat that introduces the actor or event adds a second sentence stating the business rule: "The paper pays by the word."
- **Beat two carries the repetition.** The very next beat repeats that rule attached to the on-screen value: "That total counts the words of every story, because the paper pays by the word."

The explanation gives the rule; the repetition welds the rule to the value that is about to break. This rule overrides beat brevity: a beat may run to two short sentences when the second sentence carries the logic. The 20-word-per-sentence limit still holds.

**The cause-before-symptom rule.** Show the change before the break. The event that should have moved the number — a new story lands on the list, a name is typed, a save happens — gets its own beat or sentence ahead of the stale screen. Only then may the "why" beat fire, because only then does it point at a cause the reader just watched. A freeze with no shown change is trivia; and a change the reader cannot connect to the value (because the value's logic was never stated, per the logic-first rule) is invisible.

**No assumed previous knowledge (unpack the technical shorthand).** Banning the mechanism's name is not enough: the ladder may not use technical shorthand as a substitute for logic either. A phrase like "needs a loop over every story, plus a safety check for broken records" silently assumes the reader already knows why a total needs a loop, what a safety check is, and what a broken record is. The ladder may assume none of this. Three requirements follow:
- **Unpack technical phrases into operations the reader can picture.** Not "a loop over every story, plus a safety check for broken records" but "visit every story, add its words, skip any story with no word count."
- **Restate taught terms in the beat where they appear.** "A derived value, a number computed from other data" is admissible; a bare "derived value" is not.
- **Earn every "does not fit" wall as a chain.** When the lecture's point is that something does not fit the form already taught, the ladder walks the chain in order: the kind of value, named in taught words; then what makes this one harder than the easy case, meaning the steps; and only then the wall, that one line cannot hold steps. A wall stated as an assertion, with the chain compressed into a noun phrase, assumes the reader already knows the taxonomy — previous knowledge the ladder may not assume.

**B2 vocabulary.** Every word in a beat is either everyday English or a word the course has already taught. Prefer "change" over "mutate", "show" over "render", "save" over "persist", "old" over "stale", "follow" over "propagate". No idioms, no unusual phrasal verbs, no word that makes a tired reader stop and reread. One concrete picture per beat.

**The Global Newsroom Rule (No Journalism Jargon).** While every scenario takes place at "The National Times," the vocabulary used to describe the app must strictly be globally understood web or business terms. Never use journalism-specific jargon. A global B2 reader will not know what a "byline," "lede," "masthead," "copy," "wire," or "dispatch desk" is. You must translate these into their universal, structural equivalents: use "author profile" (not byline), "intro" (not lede), "site header" (not masthead), "text" (not copy), and "live feed" (not wire). If a word requires a dictionary of news jargon to understand, it is banned. This applies strictly to component names (`<AuthorProfile />`, never `<AuthorByline />`) and prose alike.

**The Proper-Scenario Checklist (run on every ladder before the lecture is finished):**
- [ ] Every noun in every beat is exactly one thing — a person, a thing on the screen, a thing in the code, or a machine event — and cannot be read as two.
- [ ] No overloaded word appears bare: "editor", "live", "script", "log", and every mechanism word in disguise ("state", "hook", "render", "hydrate", "trigger"), replaced by observable behavior.
- [ ] Every person is named with a human word, never with a bare ambiguous role.
- [ ] Every word is B2: everyday vocabulary, no idioms, no rare words, nothing a tired reader must reread. **Crucially: No journalism jargon** ("byline", "masthead", "copy") even though the setting is a newsroom; always use global structural terms ("author profile", "site header", "text").
- [ ] Each beat makes sense read alone and out of order — no pronoun with two possible owners.
- [ ] No beat names the mechanism term or hints at it with jargon.
- [ ] The world of the scene matches the hook's world and the lecture body's world.
- [ ] Every value the ladder turns into a problem has its logic stated before it breaks: the explanatory sentence with the business rule in the introducing beat, then the repetition beat attaching that rule to the on-screen value.
- [ ] The change event is shown before the stale screen: the "why" beat points at an input the reader just watched move.
- [ ] No technical shorthand ("a loop over every story", "a safety check for broken records") stands in for logic — every such phrase is unpacked into operations the reader can picture, taught terms carry their plain re-definition in the beat, and a "does not fit" wall is earned by first classifying the value (it needs steps, not one formula).

**Worked example: a failing ladder, then the same ladder fixed.** This ladder (an early draft) fails the gate; read each beat and count how many things every noun could be:

1. The newsroom desk is live.
2. An editor rewrites the breaking headline.
3. You log the headline at the top of the script.
4. Why only one print?
5. A frozen badge ships the wrong headline.
6. The value is moving, but the log is dead.
7. We will watch the value as it actually changes.

What a tired B2 reader stumbles on: **"byline" (a line? a person? an author profile?)**, "the newsroom desk" (a desk? a team? a component named Desk?), "is live" (on air? deployed? running?), "an editor" (a person editing the site? the visitor? the IDE?), "log" (a verb? a file? firewood?), "the script" (a news script? a code file? a `<script>` tag?), "print" (a printer? the console?), "frozen" (the browser froze? the value cannot change?), "ships" (deploys? delivers?), "the log is dead" (which log? what does dead mean?). Every beat carries at least one double reading.

The same scenario, rebuilt so each noun has exactly one identity:

1. You built a news website called The National Times, and real readers are using it right now.
2. A journalist types a new headline into the page and saves it.
3. Your code has one job: print the headline to the console every time it changes.
4. Why does the code print only once?
5. Readers keep seeing the wrong headline.
6. Something in your code read the headline once, then stopped looking.
7. Today, the print will follow every change.

Same world, same mystery, same promise, but now every beat paints one picture a tired reader cannot misread. Note what disappeared: "editor", "live", "script", "log", "frozen", "ships", all replaced by people, screens, code lines, and observable behavior.

**Second worked example: the ladder with the missing logic.** This ladder (an early draft of a payout lecture) passes the identity test — every noun is one thing — and still fails, because the value at the center of the story is a cipher and the reasoning is compressed into shorthand:

1. A journalist files the last story of the night in the National Times newsroom.
2. The payout total under the story list sits frozen at its old number.
3. Why is it frozen?
4. The correct total needs a loop over every story, plus a safety check for broken records.
5. One line cannot hold a loop.
6. React ships a second form of the same tool, one that takes a whole function.
7. Inside it, loops and safety checks are just normal JavaScript.

Read it as a tired B2 reader. What is a "payout total", why does it exist, what does it compute, and why would filing a story change it? The ladder never says. Why is the number "frozen" — what moved that it should have followed? Nothing is shown changing. What is "a loop over every story", why would a total need one, what is a "safety check", what is a "broken record"? All assumed previous knowledge. The same ladder, rebuilt by the logic rules:

1. A journalist files one more story at the end of the night at the National Times. The paper pays by the word.
2. The page shows one payout total under the story list. That total counts the words of every story, because the paper pays by the word.
3. The new story lands on the list.
4. But the payout total still shows the old number. Why does it not move?
5. The correct total is a computed value, a number calculated from other data. This one needs steps: visit every story, add its words, skip any story with no word count.
6. One line cannot hold those steps.
7. React has a place for steps like these. Inside it, loops and safety checks are just normal JavaScript.

**Canonical Benchmark Case Study: Bloated Draft versus Debloated 7-Slot Standard (Lecture 1).** This case study establishes the cardinal benchmark for debloating opening ladders, eliminating journalism jargon, removing ghost database actors, respecting word limits, and holding back the mechanism until the lecture body.

*The Flawed Draft (REJECTED):*
1. A subscriber named Elena logs into her online account on The National Times news website.
2. The webpage displays Elena's name in ten different places across the navigation bar, sidebar, and article header.
3. Elena changes her account name to her pen name and clicks save in her account settings.
4. Plain JavaScript executes ten manual element queries, updates nine of them, but misses the tenth spot in the masthead.
5. Why does the tenth badge on the screen keep displaying her old identity even though the database saved the new name?
6. The updated string exists safely in computer memory, but one forgotten HTML node on the screen never received the manual update command.
7. Today you learn how React's declarative component model eliminates manual DOM queries and keeps your entire user interface synchronized automatically.

Why it failed: (1) Narrative bloat: Logging in, navigating to account settings, and changing to a "pen name" introduces three separate actions before the problem even begins. (2) Journalism jargon violation: Beat 4 uses "masthead", violating The Global Newsroom Rule (structural web terms like "site header" are required). (3) Shifting UI terms: The location of the name jumps between "navigation bar, sidebar, and article header", "masthead", and "badge". (4) Ghost external actor: Beat 5 introduces an unannounced backend database ("even though the database saved the new name") into a client-side DOM lesson. (5) Word-count violations: Beat 5 runs to 21 words and Beat 6 runs to 22 words, breaking the strict 20-word limit. (6) Missing Danger beat: The ladder jumps from the question straight to explaining the bug, skipping the tangible user or business consequence. (7) Premature mechanism reveal: Beat 6 gives away the technical explanation early, and Beat 7 leaks textbook jargon ("declarative component model") before the body earns it.

*The Corrected Standard (MANDATED -- Option A Benchmark):*
1. A subscriber named Elena updates her account name on The National Times website.
2. The webpage displays her name in ten separate places across the screen.
3. Elena saves her new name, but your code updates nine spots and misses the tenth.
4. Why does that tenth badge on the screen still show her old name?
5. Conflicting names confuse the subscriber and make the website look broken and unreliable.
6. The computer holds the new name in memory, but the webpage cannot update itself.
7. Today you learn how React replaces manual updates and keeps your whole interface in sync.

Why it succeeds: Single actor throughout; zero journalism jargon; every sentence under 18 words; incorporates the Mismatch Law (updates nine, misses the tenth); includes high-stakes Danger in Beat 5; holds back the mechanism name in Beat 7 while delivering an accessible promise to a tired B2 reader.

**Primary Mandate — Role Rotation, Phantom Routines, and Cryptic Questions.** This case study demonstrates why clarity must always defeat artificial word-count constraints, synonym rotation, and phantom background routines.


*The Flawed Draft (REJECTED):*
1. A reporter opens the bureau directory to update a foreign correspondent's assignment record.
2. A background routine receives fresh coordinates and updates reporter.location.city = 'Geneva' in the profile data.
3. Why did nothing move?
4. Readers see the journalist stationed in London while their breaking dispatch publishes from Switzerland.
5. The nested city text changed inside computer memory, but the badge on screen stayed frozen on London.
6. Today you learn the exact boundary where deep updates stop, and how to keep nested values linked to the screen.

Why it failed: Rotating between "reporter", "foreign correspondent", and "journalist" confuses international B2 readers (sounds like three people or three technical roles); "A background routine receives fresh coordinates" introduces novel technical jargon ("routine") that distracts from React; and "Why did nothing move?" is a cryptic, metaphorical question forced into an artificial 4-word rule. On a screen, "move" means CSS animation.

*The Corrected Standard (MANDATED), in the React version of the scenario (nested state mutation):*
1. A journalist opens their profile page on the National Times website to update their current city.
2. The profile displays a location badge on screen, showing London from journalist.location.city.
3. The journalist selects Geneva, writing journalist.location.city = 'Geneva' on the profile object.
4. Why did London stay as the registered location, even after the update?
5. Readers still see London on the published website while the journalist reports breaking news from Geneva.
6. The city text changed inside the data object, but the badge on screen never received the update.
7. Today you learn how React decides what changed and how to keep nested data connected to the screen.

Why it succeeds: One actor throughout ("a journalist"); direct user action (selects Geneva); and Beat 4 asks a natural, complete, non-cryptic question stating the exact observable paradox ("Why did London stay as the registered location, even after the update?").

**Second Mandate — The Jargon Trap and Inside-Out Engine Trap.**

*Stage 1 — The Jargon and Abstraction Trap (FAILED):*
1. A news reporter reviews three breaking wire reports on the National Times dispatch desk.
2. The dispatch desk requires every published report to be manually verified by its unique bulletin number.
3. The developer adds a verify button that passes bulletin number 402 directly to the click handler.
4. Why did it run?
5. Every bulletin verifies itself the instant the page loads, publishing unread reports before the reporter touches the mouse.
6. Writing parentheses directly in the template attribute executes the action immediately during rendering instead of waiting for clicks.
7. Today your handlers learn to wait for user interaction, receive custom values, and read native browser events.

Why Stage 1 fails: "Wire reports" and "dispatch desk" sound like hardware or network libraries; "bulletin 402" looks like HTTP 402; and "template attribute" is vague academic jargon hiding `onClick={...}`.

*Stage 2 — The Inside-Out Engine and Broken Causality Trap (FAILED):*
1. A writer opens a dashboard showing three draft articles on a news website.
2. Each draft article has a simple identification number, such as article 5 or article 12.
3. Next to article 12, the developer writes onClick={deleteArticle(12)} on the delete button.
4. Why did it run?
5. All three articles delete themselves the second the page loads, wiping out the work before any click.
6. Writing parentheses directly inside the onClick attribute calls the function immediately during page rendering.
7. Today your buttons learn to wait for user clicks, pass custom values safely, and inspect browser events.

Why Stage 2 fails: "Why did it run?" is programmer shorthand from inside the engine. To a screen observer, no one clicked, and articles do not "run". Causality was broken by asking the question before showing the empty screen.

*Stage 3 — The Outside-In Screen Truth (MANDATED):*
1. A writer opens a dashboard to edit three draft articles on a website.
2. Each article has a delete button written as onClick={deleteArticle(id)} to remove that draft.
3. The writer loads the page without touching the mouse or clicking any button.
4. Where did they go?
5. The list is completely empty because the delete function executed during page load, erasing all drafts.
6. Writing parentheses (id) after the function name executes the code during render instead of waiting for clicks.
7. Today you learn how to pass arguments safely and inspect browser events when users click buttons.

Why Stage 3 succeeds: Universal nouns; user inaction is explicit (did not touch the mouse); Beat 4 asks the natural human reaction to a blank screen; and Beat 6 identifies the exact characters: writing parentheses `(id)` after the function name.

**Third Mandate — The Mismatch Law (the invisible contradiction).**

*The Flawed Draft (REJECTED):*
1. A journalist loads a directory of ten thousand global news bureaus on the National Times editorial portal.
2. The page stores the article list in state so the display updates as the journalist searches.
3. The journalist types a word into the search box to find an old article.
4. Why does the search box lag on every keystroke, even though no article ever changes?
5. Letters appear seconds late on screen, locking up the page while the journalist types.
6. React re-renders thousands of article rows on every keystroke for data that never changes.
7. Today you learn how to render massive datasets without losing fast updates.

Why it failed: First, "global news bureaus" and "editorial portal" use specialized, confusing institutional jargon. A newspaper publishes articles; an archive of 10,000 published articles is the only sane, universal domain entity. Second, Beat 2 missed the fundamental architectural contradiction (The Mismatch Law): writing *"The page stores the article list in state so the display updates as the journalist searches"* sounds harmonious and correct, hiding the clash. The reader's screen shows twenty rows; the code re-renders ten thousand. The mismatch must be stated, not smoothed over.

*The Corrected Standard (MANDATED):*
1. A journalist opens the search archive on the National Times website to browse 10,000 published articles.
2. The code renders all ten thousand article rows into the page, but the reader's screen shows only twenty rows at a time.
3. The journalist types a single letter into the search box to find a story.
4. Why does typing in the search box freeze the screen, even though no article ever changes?
5. Letters appear seconds late on screen, locking up the interface while the journalist types.
6. Every keystroke re-renders all ten thousand rows, and most of them sit below the screen, where nobody reads them.
7. Today you learn how to render only the rows the reader can actually see.

Why it succeeds: Universal nouns; single actor; and Beat 2 explicitly exposes the architectural contradiction between what the code does (renders all 10,000 rows) and what the screen needs (twenty visible rows).

**Status of existing lectures.** The first lectures written for this project use the ladder from the first draft; there is no legacy-prose retrofit burden yet. Keep it that way.

### Alert callouts (`> [!TIP]`)

Lectures support GitHub-style **alert callouts** — a blockquote whose first line is `> [!TYPE]`, rendered as a styled box with an eyebrow label and a tinted accent border. The project uses these to deliver *interview-strategy guidance* (how to frame an answer, what to emphasize, what interviewers want to hear) alongside the technical content.

**Syntax.** Open with `> [!TYPE]` on its own line, then the body on the following `>` lines:

```
> [!TIP]
> **To impress the interviewer:** Most candidates will say "React re-renders the component when state changes." If you want to show deep understanding, explain the snapshot model: the setter does not change the variable in the running code, it asks React to render again with a new value — and that distinction explains half of React's rules.
```

**Supported types and their eyebrows** (the build parses exactly these five; anything else falls back to a plain blockquote so the typo is visible):

- `[!TIP]` → **Interview Tip** (the project's signature callout; accent-teal border). Use this for "here is how to win this answer in an interview" guidance.
- `[!NOTE]` → **Note** (neutral informational aside; accent-teal border).
- `[!KEY]` → **Key Takeaway** (warm amber). This is the callout for **insider allegories and key takeaways** — the one-line distillation that separates a framework user from someone who grasps the underlying idea. Reach for it when you have a single sentence that reframes the concept as a memorable comparison, analogy, or load-bearing truth. A good KEY callout reads like something a senior engineer would murmur after years with the tool — not a summary of the section, but the *why-it-matters* the section is building toward.
- `[!WARNING]` → **Warning** (amber; a real pitfall to avoid).
- `[!CAUTION]` → **Caution** (red; a destructive or breaking action).
- `[!WILD]` → **⚡ IN THE WILD** (signature real-world friction card; cyan-slate border). Isolates the student's single most common counter-intuitive confusion point (including any friction or confusion around classic vs modern framework nomenclature) and discharges it with an immediate "aha moment". Strictly obeys **The Knife Paradigm**: opens with a **short, catchy, bold leading question** (6–9 words, zero syntax clutter), maintains tactile conversational familiarity (*"Can you imagine...", "Remember the blinking cursor...?"*), takes the reader by the hand with intentional repetition, **always bolds all clarified key terms** (`**imperative**`, `**declarative**`, `**physical DOM**`, `**virtual DOM**`), avoids technical trivia or method names inside the body, and delivers razor-sharp points cutting like a knife (matching the cardinal benchmark in `PRE-LECTURE-INSTRUCTIONS.md`). Exactly one per major technical section.

**Authoring rules:**

- **The marker line is `> [!TYPE]`** — uppercase type in square brackets, immediately after `> `. A blank `>` line may precede the body but is not required; the body lines are everything from the next `>` line until a non-`>` line.
- **Use `> [!TIP]` as the default** in this project. The eyebrow renders as "Interview Tip" precisely because every lecture is interview prep; reaching for NOTE/WARNING/CAUTION is fine when the content genuinely fits one of those tones, but TIP is the on-brand choice for framing advice.
- **Reach for `> [!KEY]` for allegories and insider takeaways.** These are the highest-value lines in the whole lecture — the comparisons and compressed truths that show deep understanding and that interviewers and insiders recognize. Do not waste the KEY box on a routine "remember to..." note; reserve it for the kind of sentence that earns its own box.
- **One callout per point.** A callout carries a single, self-contained tip. If you have three tips, write three callouts — do not cram a bulleted list of tips into one box.
- **Body formatting is full markdown.** Bold (`**...**`), italic (`*...*`), and inline code (`` `...` ``) all work inside the callout body. Keep the body to a short paragraph; if it needs a code example, the example belongs in a code block adjacent to the callout, not inside it.
- **Lead the body with a bold lead-in.** Pattern: `> **To impress the interviewer:** ...` or `> **Common mistake:** ...`. The bold lead-in names what kind of tip it is before the reader reaches the explanation, mirroring the bulleted-answer convention used elsewhere in the project. The KEY allegory is the one exception: its body is often a single bare sentence with no lead-in, because the sentence *is* the takeaway.
- **Place callouts inline, at the moment the tip matters.** A callout that teaches how to answer the *current* concept goes right after the section that establishes it. Do not bank all tips at the end of the lecture; their value is contextual.
- **Never substitute a callout for the lecture's actual content.** The callout is framing advice — how to talk about the concept. The mechanism itself belongs in the lecture prose and code blocks. A lecture full of callouts and thin on explanation has failed its job.

### Repeat and emphasize the important statements

A key statement does not earn its place by being said once. The project's convention is that an **important allegory or insider takeaway is stated twice, in two registers**: first as the punchy `[!KEY]` callout (the compressed form a reader can quote), then again, expanded, in the prose immediately following (the unpacked form that explains *why* the allegory holds). The compressed line earns the box; the prose earns understanding.

The model:

```
> [!KEY]
> The render is a photograph, not a film.

When your component function runs, it does not stream changes to the screen as
it goes. It computes one complete picture of the UI for the current state — a
photograph — hands it to React, and finishes. That is why reading a state
variable after setting it shows the old value: the variable in the running
photo belongs to the photo, not to the next one.
```

The callout and the paragraph say the *same thing* deliberately. The callout is the hook (a reader can carry it away in one read); the paragraph is the proof (it walks the analogy through so the reader sees the mapping). Do not put the callout in without the unpacking, and do not unpack an idea in prose without giving its load-bearing line a `[!KEY]` callout to live in. If a takeaway is worth the reader's long-term memory, it is worth stating in both registers.

**What counts as an insider takeaway worth this treatment.** Allegories that map the unfamiliar onto the familiar ("the render is a photograph, not a film"), naming the exact mechanism a senior engineer would point to ("reconciliation never reads your code's intent, it only compares type and key"), and the one sentence that, once heard, makes the rest of the lecture click into place. These are the lines a student repeats to themselves before the interview; surface them, box them, and unpack them.

## Code Block Format (auto-highlighted)

Every code block in a lecture is automatically transformed by `src/build-lectures.mjs` into an editor-style display: a thin-bordered window with a filename tab, three traffic-light dots, numbered lines, zebra striping, and syntax-highlighted tokens. A `//` comment renders as a **speech bubble hung directly below its code line**, with a small tail pointing up at that line. The author writes plain Markdown; the build script produces the styled HTML. **Never hand-write `<span>` tags, CSS classes, or bubble markup in lecture Markdown** — the highlighter will double-encode them and the output will be wrong.

### How to author a code block

- **Open with a code block**: ` ```jsx ` (or ` ```js ` / ` ```tsx ` / ` ```typescript `; all use the same JS/JSX tokenizer).
- **Filename tab is always shown.** The editor chrome (three dots + filename pill) renders for every code block. If you omit `title=`, the highlighter derives a default filename from the code block language: `jsx`/`javascript` → `App.jsx`, `tsx`/`typescript` → `App.tsx`, `js` → `App.js`, `ts` → `App.ts`, anything else → `code.txt`. To override, write ` ```jsx title="Dashboard.jsx" `.
- **Blank lines render as ordinary numbered rows.** Every source line inside the code block gets a row and a line number, and blank lines show as empty numbered rows. To keep the editor dense, write snippets without blank lines where you can. Keep top-level code flush against the left margin; indentation inside code blocks is rendered literally.
- **Keep every line inside a code block under about 80 characters.** Longer lines wrap in the built output (the row grows taller, the number column stays left) — that wrap is a safety net, not the style. Break long object literals and JSX attributes across rows yourself, one property or attribute per row, so the break lands where the code reads best. JSX especially wants one prop per line in lectures.
- **Close with ` ``` `** on its own line. Every code block opener must have a matching closer.
- **Write comments normally**: use `//` followed by a space and the comment text. The highlighter renders the `//` as `→` in the output. Example source: `const [count, setCount] = useState(0); // the pair every component starts from`.
- **Bold inside comments**: wrap key terms in `**double asterisks**`. The highlighter renders these as bold inside the comment span. Example source: `// adds an **own** state cell`.
- **No other comment formatting**: italic, inline code, and links are not supported inside comments. Use `**bold**` only.
- **`{/* */}` JSX comments**: not supported as bubbles. Annotate the JSX line's neighbor or the opening tag's line with a `//` comment placed on a line with code (for example on the attribute line), or explain in prose.

### The `//` comment rule (exact behavior)

- The first `//` on a line that is **followed by a space or end-of-line** is treated as the comment start.
- Everything from that `//` to the end of the line becomes the text of a comment bubble rendered below the code line (white box, grey border, small upward tail, Georgia serif italic). The first letter is auto-capitalized, and `**bold**` runs render as tag-styled bold inside the bubble.
- **`✔️` / `✖️` glyphs are stripped from comments on purpose.** The owner decided verdict icons do not belong in the rendered output. Signal do/don't verdicts with words instead: `// **WRONG:** reads the prop once`, `// **RIGHT:** stays reactive`.
- **`//` inside URLs is preserved.** A string like `'https://example.com'` is untouched because the `//` is followed by `example`, not a space. The same protection applies to `file://`, `http://`, and regex literals.
- **Empty trailing `//` is dropped.** A line ending in bare `//` with no comment text renders without any arrow — clean output, no dangling `→`.
- **`//` at the very start of a line** (a comment-only line, flush-left or indented) is auto-repaired by the build: its text is merged into the bubble of the next code line (the previous one if the block ends first), no empty row is rendered for it, and the build log prints a note naming the source line. **Authors must still never write comments this way.** End-of-line comments remain the rule; the merge is a safety net that guarantees no comment bubble ever floats beside an empty row, not permission to park comments on their own lines (see **Comment placement** below).

### Comment placement (load-bearing)

Comments in this project are **always attached to the code line they annotate**: they are written at the end of that line, after a `//`, never on their own line above the code. This is non-negotiable. The reason is that a comment renders on screen as a speech bubble hung directly **below** its code line, with a small tail pointing up at it. Its entire job is to deliver clear, short visual information about that one line. A comment with no code on its line is a bubble pointing at nothing — the reader cannot tell which line it belongs to. (If a comment-only line slips into a code block anyway, the build folds it into the next code line's bubble and logs a note in the build output — a safety net, not an excuse.)

**The rule, stated plainly:** write `code; // annotation`, never `// annotation` on its own line followed by `code;`. If you find yourself wanting to introduce a block of code with a comment, write the introduction in the prose above the snippet instead — do not park it as a comment-only line inside the code block.

**Exception for extremely wide lines:** If the line of code itself is exceptionally long (e.g., a wide JSX attribute row), attaching a comment to the end will cause it to hit the right edge of the editor container and wrap into two lines, breaking the parallel visual layout. In this specific scenario, place the comment on its own line *inside the block* (e.g., on the very next line) instead of trailing the wide line.

**The canonical discipline:** every comment in a lecture sits at the end of its code line, with not a single comment-only line anywhere. The models of the discipline (glyphs replaced with word verdicts, since the build strips them):

1. **The trap verdict, end-of-line:** `const [count, setCount] = useState(initialCount); // **WRONG:** copies the prop **ONCE** into local state` — a wrong-pattern line, the verdict word leading the comment, the load-bearing word in caps, at the end of the line it warns about.

2. **The correct-pattern verdict, end-of-line:** `const double = useMemo(() => count * 2, [count]); // **RIGHT:** recomputes only when count changes` — the recommended pattern, takeaway word in caps.

3. **The numbered-step sequence across three lines:**
   ```
   likes += 1;        // 1. optimistic override: increment **LOCALLY** immediately
   await saveLike();  // 2. tell the server to **SAVE** the change
   likes -= 1;        // 3. rollback: if the request failed, **REVERT** the override
   ```
   — a three-step narrative told as three aligned comments; the reader's eye tracks down the bubbles and reads the story.

4. **The one-line gotcha:** `const { title } = props; // **WRONG:** reads the prop once, never follows updates` — the comment names the exact consequence beside the offending line.

5. **The three-way contrast block:**
   ```
   const a = useRef(value);  // **WRONG:** a ref changes do not **RE-RENDER** anything
   const b = useState(value); // **RIGHT:** changes schedule a **RE-RENDER**, reads live
   const c = useMemo(f, []); // **WARNING:** frozen **FOREVER** with an empty dep list
   ```
   — three lines, three contrasting caps words; the comparison lives in the bubbles, not in prose.

**What makes a good comment.** Because the bubble hangs directly under its code line, it must be short and self-contained — a verdict word, a step number, or a one-phrase gloss, plus one caps load-bearing word. It is a *label* for the line, not an explanation of the line; explanations belong in the prose around the snippet. If a comment needs more than roughly one short sentence, it is too long for the bubble — move that material into prose and leave a shorter label on the line.

**The anti-pattern (do not do this).** The following is exactly wrong — every comment is a comment-only line parked above the code it describes:

```
// 1. the element is created through React
const el = <h1>Hello</h1>;
```

On screen this renders as a `➔`-prefixed annotation with no code beside it, followed on the next row by code with no annotation. The reader cannot pair them. The correct form attaches the comment to the line it labels:

```
const el = <h1>Hello</h1>; // 1. React turns this markup into an **ELEMENT** object
```

### Comment appearance and conventions

Comments in lecture code blocks are not styled like ordinary code. They have their own visual treatment designed to make the *meaning* of a line jump out, separate from the *mechanics*.

**Visual treatment of every comment:**

- **A bubble, not an arrow.** Every comment renders as a white speech bubble with a grey border and a small tail, pointing up at the code line it annotates. The bubble sits directly below that line, indented to line up under the code.
- **Serif italic text.** Bubble text uses Georgia (Times fallback), italic, at roughly the code's size — a typographic shift that signals "annotation, not code" without a color change.
- **`**bold**` renders as a tag chip.** Bold runs in comments render as monospace, tag-styled bold, used for the caps load-bearing word.
- **Multi-line bubbles.** A comment containing `<br>` renders as a taller bubble with the lines stacked; the build also merges consecutive comment-only lines into one bubble joined by `<br>`.

**Comment content conventions (the author's job):**

Comments in this project are not neutral developer notes. They are **pedagogical annotations** that teach the reader what the line *does* or *means* in the context of the lecture. Three patterns are the model for new lectures:

- **Verdict comments with a leading word (ONLY for active comparisons or traps)**: start the comment with `**RIGHT:**` or `**WRONG:**` ONLY when there is a direct comparison with something wrong, a bug, or an anti-pattern (such as in paired right/wrong comparison blocks or direct trap contrasts). Do NOT prefix standard, non-comparative code with `**RIGHT:**`—author insightful explanatory annotations directly (e.g. `// Brand headline declared in **STARTER**`). Do not write `✔️`/`✖️` glyphs: the build strips them, so they cost effort and render nothing. Examples:
  - `// **WRONG:** copies the prop **ONCE** into local state` — a trap; the line is shown to warn against it.
  - `// **RIGHT:** recomputes only when the inputs change` — the recommended pattern contrasting the trap above.
  - `// **WRONG:** mutating props during render is **FORBIDDEN**` — a trap with the specific consequence called out.
- **`**CAPS**` for the single load-bearing word.** Wrap the one keyword that carries the lesson in bold-uppercase. The highlighter renders `**REACTIVE**` as `<b>REACTIVE</b>` — bold, in a darker grey (`#374151`) than the surrounding comment text. Use this for the term the reader must take away from the line: **SNAPSHOT**, **ONCE**, **RE-RENDER**, **DEAF**, **READ-ONLY**, **NEW-OBJECT**, **LOCALLY**, **SAVE**, **REVERT**, **SOURCE**, **KEY**, **COMMIT**. One per comment, occasionally two — never a whole sentence in caps.
- **Numbered steps inside a single snippet.** When a code block shows a sequence of operations, prefix each comment with its step number: `// 1. optimistic override: increment **LOCALLY** immediately`, then `// 2. tell the server to **SAVE** the change`, then `// 3. rollback: ...`. The numbers survive into the rendered comments, giving the reader a clear path through the snippet.

**Long bubbles wrap by themselves.** A bubble that would overflow the editor width wraps internally onto additional bubble lines. The author does not control this — it happens in the build. If a comment is so long that the wrapped bubble looks awkward, shorten the comment; the code block is not the place for paragraphs.

**What comments are NOT in this project:**

- **Not collapsible.** Every comment always renders. If a comment is not pedagogically necessary, delete it; do not leave it "for completeness."
- **Not links or code.** Inline `` `code` ``, `[links](url)`, and `*italic*` are not parsed inside comments. Only `**bold**` is supported. If you need to reference an identifier inside a comment, write it as plain text (optionally in CAPS if it is the load-bearing word).
- **Not for section narration.** If a comment needs more than one short sentence, the explanation belongs in the prose around the code block, not inside the code. Comments annotate lines; prose explains snippets.

### Token classes produced by the highlighter

The highlighter classifies code tokens into five color classes. The author does not control these — they are derived from the source. Listed so the author knows what to expect:

- **`.kw`** (deep magenta `#93275a`) — JavaScript keywords: `let`, `const`, `var`, `function`, `return`, `if`, `else`, `for`, `while`, `new`, `class`, `extends`, `this`, `await`, `async`, `import`, `export`, `from`, `default`, `try`, `catch`, `throw`, `typeof`, `instanceof`, `in`, `of`, `true`, `false`, `null`, `undefined`, `break`, `continue`, `switch`, `case`, and the rest of the standard keyword set.
- **`.fn`** (teal `#156a64`) — identifier followed by `(` (with optional whitespace between), e.g. `createRoot()`, `map(`, `console.log(`.
- **`.nl`** (magenta `#93275a`) — number literals: `0`, `42`, `3.14`.
- **`.str`** (green `#1a7d2e`) — string literals in `"double"`, `'single'`, or `` `template` `` quotes. Note: the `'use client'` and `'use server'` directives are strings and render green.
- **`.hook`** (orange `#c2410c`) — React hooks: every identifier of the form `useXxx` — the built-ins (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useReducer`, `useRef`, `useId`, `useTransition`, `useDeferredValue`, `useLayoutEffect`, `useOptimistic`, `useActionState`, `useSyncExternalStore`, `useImperativeHandle`, `useInsertionEffect`, `useDebugValue`, `useFormStatus`, `use`) and any custom hook (`useCart`, `useOnlineStatus`) by naming convention.

Plain identifiers (variable names, property accesses, component names) are rendered in the default ink color with no span.

### Example (source and result)

**Source Markdown** in `md-lectures/NN.md`:

````markdown
```jsx title="App.jsx"
import { useState } from 'react';
export default function App() {
  const [count, setCount] = useState(0); // the pair every component starts from
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicks: {count}
    </button>
  );
}
```
````

**Rendered HTML** (what the build script produces, simplified):

- A `<div class="editor">` block
- An editor chrome bar with three dots and an `App.jsx` filename tab
- Nine numbered rows with zebra striping
- `import`, `export`, `default`, `function`, `return`, `const` styled magenta (keywords); `useState` styled orange (hook); `App` left plain (a component name is an identifier, not a call here); `'react'` styled green (string)
- The `//` comment rendered as a speech bubble below its line — `The pair every component starts from` — in the italic serif bubble style

The bubble markup and all `<span>` tags are produced by the build script. The author wrote only `//` comments and plain code.

### Supported languages

`jsx`, `js`, `tsx`, `ts`, `javascript`, and `typescript` all use the same JS/JSX highlighter. There is no language-specific branching; if you need CSS, HTML, or shell tokenized differently, that requires extending the highlighter in `src/build-lectures.mjs` (add a new tokenizer branch keyed on the code block language).

### Known limitations

- **Template literals with `${}`**: a template string like `` `Hello ${name}` `` is treated as one string token. The `${name}` part is not separately highlighted as an identifier. Acceptable for typical lecture snippets; document long template literals in prose if the interpolation matters.
- **Regex literals containing `//`**: rare in React teaching material. The "followed by space or EOL" rule protects most cases, but a regex like `/foo//bar/` would mis-tokenize. Avoid regex literals with `//` in lecture code.
- **Block comments `/* ... */`**: not currently supported. Multi-line block comments are rendered as plain code (no bubble styling). Use `//` per-line comments in lectures — they produce the bubble aesthetic and align with the rest of the design system.
- **No syntax highlighting inside the card pipeline.** This highlighting applies only to lecture code blocks. Cards use the minimal `<pre><code>` style defined in the card CSS; do not expect the same editor treatment there.

## Card Format Spec

The card pipeline uses the same constrained Markdown subset as the sibling projects. The constraints exist because the card parser is minimal and intentional; violating them produces silent mis-renders or, in one case, an out-of-memory crash.

**File structure (in this exact order):**

- **Title line:** `## Q{number} — {Short Title}` — the question header. Always starts with `## Q` and an en-dash separator.
- **Tags line:** `@tags Topic1, Topic2, Subtopic3` — comma-separated chips that the renderer turns into tag pills. Three to five tags is typical.
- **Blank line, then the question:** `**Question.** {the full question text, one continuous line, never hard-wrapped.}`
- **Blank line, then the answer:** `**Answer.**` on its own line, then the answer body structured per the "Answer body format" rules below.
- **Blank line, then the code block:** a ` ```jsx title="App.jsx" ` (or ` ```js `) code block with a real, runnable example.
- **Blank line, then the diagram placeholder:** an empty `<div class="dg" style="..."></div>` block. Required by the parser as an anchor; the actual diagram content is injected from `diagrams/{number}.html` at build time.
- **Blank line, then the summary:** `> **Summary.** {one continuous line, never hard-wrapped, distilling the takeaway.}`

**Answer body format (mandatory for all new cards):**

- **Use bullet points, not prose paragraphs.** The answer body is a list of `- ` bullets, grouped under bold-titles.
- **Group with bold-titles, never markdown headers.** Each group starts with a standalone line of bold text: `**The mechanism — what happens on every update**` on its own paragraph, immediately followed by the bullet list for that group.
- **Each bullet leads with a bold mini-title.** Format: `- **Mini-title:** rest of the bullet.`
- **Bold the most important keywords inside each bullet** — the technical terms, the function names, the invariant.
- **Every technical term is kept AND immediately defined in plain English** in the same sentence.
- **Prescriptive, not descriptive.** Each group should make an argument, not merely describe what exists.
- **Reference related cards by number** when relevant: `(see Q47)`, `(see Q35)`.

**Parser constraints (do not violate — the build will crash or misrender):**

- **Never use `### ` (h3) or deeper markdown headers** inside a card. The card parser has no handler for `### `; using it causes an infinite loop and an out-of-memory crash. Use bold-text standalone lines as group titles instead.
- **Only `## ` (question header) and `# ` (h1) are supported** as markdown headers in the card pipeline.
- **One continuous line per paragraph, per bullet, per tag line, per summary** — never hard-wrap (per AGENTS.md).
- **Blank lines separate blocks.** Every block (question, answer, code, diagram, summary) is preceded and followed by a blank line.
- **The `<div class="dg">` block must have no blank lines inside it** and must be immediately closed with `</div>` on the last line.
- **Code blocks must be closed.** Every ` ``` ` opener needs a matching ` ``` ` closer.

## Data-Flow Format Spec

The data-flow pipeline uses the same full Markdown renderer as lectures (`src/build-lectures.mjs`), so every formatting feature available to lectures — bold, italic, bullets, inline code, code blocks with `title=`, blockquotes, links — is available here too, with one structural exception noted below. The data-flow file is *not* a second lecture: it does not re-teach how the mechanism works. It teaches **where the mechanism belongs** in a real component tree, and *why one placement beats another*. The lecture already carries the depth; this file carries the spatial reasoning.

**File structure (in this exact order):**

- **Title line:** `# Data Flow {n}: {Short Title}` — for example, `# Data Flow 41: Where useMemo Belongs in the Product Tree`. Used exactly once, as line 1.
- **No interview-question line.** The `> INTERVIEW QUESTION |` blockquote is a lecture-pipeline convention; do not put it here. The data-flow file has its own framing paragraph (below) instead.
- **Framing paragraph:** one short paragraph (never hard-wrapped) stating which ElectroShop interaction this file maps the concept onto. It names the concrete scenario (e.g. "applying a VIP discount to a price") in ElectroShop terms, and points back to the lecture by number for the mechanism itself: `(see Lecture 41 for how useMemo works)`.
- **The A/B/C body:** three sections in fixed order, headed `### A) The Technical React Information`, `### B) Large Scale Data Flow Context`, `### C) Nuanced Small Scale Data Flow`. The exact wording of these three headers is load-bearing — a consistent header set is what makes the atlas scannable across 180 files.
- **Closing reasoning section:** headed `### Why this placement`, this is where the file earns its keep. It asks "why not one tier up or down?" and answers concretely. Two to four numbered points.

**The A/B/C sections, in detail:**

- **`### A) The Technical React Information`** — a short, mechanism-level paragraph restating *the API or feature the lecture taught*, in the minimal form needed for the placement argument. This is a callback, not a re-teach. State the API, what it depends on, and what triggers recomputation — do not re-derive the whole mechanism. If the lecture covered it, point there: `(mechanism explained in Lecture 41)`.
- **`### B) Large Scale Data Flow Context`** — exactly one blockquote showing the full path from `ElectroShopApp` down to the component where the concept lives, using the `➔` arrow and backticked component names. Mark the component where the interception/placement happens in **bold**. Format, verbatim:
  ```
  > `ElectroShopApp` (Holds global VIP status) ➔ `ShopLayout` ➔ `ProductGrid` (Holds raw products) ➔ **`ProductCard`** (Where interception occurs) ➔ `PriceBlock` (Displays final price)
  ```
  A parenthetical after each backticked name says what that tier holds or does. One line, never hard-wrapped. For Q101+ server questions, tag the boundary per `docs/component_language.md` section 4 (for example `ProductGrid` (Server Component) ➔ **`AddToCartButton`** (Client Component, `'use client'`)).
- **`### C) Nuanced Small Scale Data Flow`** — exactly one blockquote zooming inside the **bold** component from section B. It traces the journey of one specific variable from prop arrival, through the API, into the child that consumes it. Same `➔` arrow and backtick conventions. Mark the API call or the interception point in **bold**. Format, verbatim:
  ```
  > `ProductGrid` (passes raw `product` object as prop) ➔ `ProductCard` (receives `product` and `isVIP` as props) ➔ **`useMemo(() => finalPrice(product, isVIP), [product, isVIP])`** (logic before the return, cached per input) ➔ `PriceBlock` (receives `finalPrice`)
  ```

**Flow-path conventions (apply to both B and C blockquotes):**

- **Arrow glyph is `➔`** (U+2794, the heavy rightwards arrow the project already uses for code comments). Do not use `->`, `→` (U+2192), or `=>`; they break the visual consistency with the rest of the project.
- **Component and identifier names are backticked**: `` `ProductCard` ``, `` `product` ``, `` `useState()` ``.
- **One flow path per blockquote, on one continuous line.** Never hard-wrap; if a path is long, abbreviate intermediate tiers rather than breaking the line.
- **Bold marks the load-bearing element.** In B, bold the component where the concept lives. In C, bold the API call or the specific line where data is intercepted/transformed.
- **The B and C paths must be consistent** — the component bolded in B is the same component the C path zooms inside. The child named at the end of B is the same child that receives the result at the end of C.

**Faithfulness rules (the format is a template, not a source of truth):**

- **The API and the mechanism must match the lecture, exactly.** If `md-lectures/{n}.md` teaches plain `useMemo`, the data-flow file shows `useMemo` — never `useCallback`, `useReducer`, or a hand-rolled cache. Re-use the A/B/C structure and the flow-path conventions; never substitute a neighboring API because it makes the path prettier.
- **Re-cast the lecture's example into ElectroShop.** Even when the lecture's running example lives in the National Times newsroom (a `StoryList`/`correction` flow), the data-flow file restates it in ElectroShop terms before mapping it onto the tree. Find the ElectroShop component that plays the same role: `StoryList`/`corrections` → `ProductGrid`/`wishlistCount`; `VideoCard`/`views` → `ProductCard`/`reviewCount`. The re-cast must preserve the lecture's actual mechanics, not invent new ones.
- **The placement argument must be genuine.** The closing `### Why this placement` section must give a real architectural reason for the chosen tier — not a restatement of the mechanism. "Doing it in `ProductGrid` would recompute the discount for every product on every VIP toggle; doing it in `PriceBlock` would put business logic in a presentational component; `ProductCard` is the middle tier that intercepts cleanly" is the model. If you cannot articulate why the placement matters, the concept may not need a data-flow file yet.

**Numbering and cross-reference:**

- Data-flow file `{n}.md` corresponds to question `{n}` and lecture `{n}`. The numbering matches `md-lectures/{n}.md`, `md-cards/{n}.md`, `md-design/{n}.md`, and `diagrams/{n}.html` exactly, so any artifact cross-references by number: `(see Lecture 41)`, `(see Q41)`.
- Point back to the lecture for mechanism depth, and forward to the card for the review form. Never duplicate the lecture's prose or the card's bullets — the data-flow file's contribution is the placement reasoning, which neither other artifact carries.

## Why the lecture-first order exists

The lecture is the comprehensive source for a question; the card is its distilled review form. Writing the card first forces the author to compress before they have explored, which tends to produce shallow bullets that name the mechanism without teaching it. By writing the lecture first — driven from the local React documentation and supplementary research — the author builds a complete mental model, and the subsequent card becomes a genuine distillation of that model rather than a guess at what matters. The lecture is also where unfamiliar terminology gets unpacked; the card inherits the same terms, already defined, and trusts the reader to recall the lecture for depth.

## HTML Figures (the embedded React Component Explorer)

Every lecture embeds at least one standalone HTML figure: a real HTML/CSS file authored inside this project, inlined into the built page by the lecture build, and rendered into the PDF by Prince. The build warns on any lecture without one.

- **Authoring:** one figure is one self-contained `.html` file at `md-lectures/figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html`, with locally scoped styles (every rule prefixed with the figure's root class, so nothing leaks into the page). NEVER invent designs from scratch: select, clone, and adapt the closest of the 7 proven archetypes in `md-lectures/figures/templates/` (single control, 3-item list, parent-child props, wrong-vs-right comparison, controlled input, context dispatch, progressive decomposition), obeying the visual constitution in `docs/figure-design-system.md`.
- **Embedding:** in the lecture markdown, on its own code block:

  ````html-figure src="figures/01-01-masthead.html" caption="Live browser viewport of the masthead after the vanilla script runs."````

  The `src` path resolves against `md-lectures/` (so `figures/...` works) or the project root. The build inlines the file verbatim, numbers it `Fig {lecture}.{n}` in reading order, and renders the `caption` attribute as the figcaption. A figure may also carry its HTML inline inside the code block.
- **Mandatory placement:** the opening section's first code snippet never sits naked; pair it immediately with an html-figure panel, exactly as the other visual scaffolds pair code with the component explorer.
- **Print safety:** never place raw `<h2>` or `<h3>` tags inside a figure (the print stylesheet forces a page break on `main h2`, severing the figure window in half); use styled `<div>`/`<span>` elements instead. Keep the total figure height within the ~380px to 420px printable budget so figure and figcaption stay unified on one page.
- **Never text-only:** every figure needs a genuine graphical substrate (a component hierarchy tree, a state dispatch track, a rendered UI widget). Wrapping plain bullet lists, prose paragraphs, or key-value tables inside bordered cards is banned.
- **Verification:** after building, verify the figure visually. Render the lecture PDF page to PNG with `pdftoppm -png -r 150 -f <page> -l <page> md-lectures-pdf/{n}.pdf` and check: 1:1 code-figure synchronization (every element, class, or selector in the figure appears in the snippet above it), zero overlapping text, and clear borders with breathing room.

## Where to look for related context

- `img-instruction/005.md` — the design system that decides how every diagram looks and how images are generated.
- `md-lectures/figures/templates/` and `docs/figure-design-system.md` — the 7 proven HTML figure archetypes and the visual constitution every embedded figure must obey.
- `documentation official/React 19 Sept 2026/react.dev/src/content/` — the primary source for lecture content.
- `./questions/` — the dedicated project-level question bank: `questions.md` (the 180 rows), `topics.md` (the controlled tag vocabulary), `README.md` (the design rationale and reading paths).
- `docs/component_data_flow.md` and `docs/component_language.md` — the primary sources for the data-flow pipeline: the fixed ElectroShop component tree, the component-relationship shorthand, the server/client boundary notation, and the A/B/C multi-scale structure every `md-data-flow/` file follows.
- **Screenshots folder** (outside the project, on disk): `/Users/techton/Images/CleanShotX/` — CleanShot X saves every screen capture here, newest first by filename timestamp. Use this folder to find before/after comparisons when iterating on visual output. Files are named `CleanShot YYYY-MM-DD at HH.MM.SS@2x.png`.

## Visual reference for the Pencil book design

The lecture pipeline's code-block presentation is meant to mimic the visual style of the Pencil book at `/Users/techton/lechton/research-code/svelte dev 2026/Pencil/`. The canonical references are:

- `Pencil/styles/figure-03.css` — the source-of-truth stylesheet for the editor code-block look.
- `Pencil/cards 05/04_extra_javascript_1/01-prototype/card.html` — a hand-curated example of the editor HTML structure.
- `Pencil/book/out/04_extra_javascript_1.pdf` — the full reference chapter in PDF form.

These files are **reference only** — never modify them. When matching the look, copy values inline into `src/lecture.css`; do not link to or import the Pencil CSS. (The Pencil book itself is a Svelte course; only its code-block aesthetic is the reference here, not its content.)

**Important limitation**: the ZCode client cannot display images to its model. When iterating on visual output, either (a) describe the gap in plain language, (b) hand the work off to a tool that can read images, or (c) compare the rendered HTML structure and CSS values against the reference directly without relying on screenshots.

### The Comprehensive Lecture Checklist (MANDATORY FINAL GATE)

Before generating or finishing any `.md` lecture file, you MUST verify every single item on this list. Do not output the lecture until it passes this entire audit:

**1. The Header & Hook**
- [ ] **Typology Tagging:** Does the lecture start exactly with `> INTERVIEW QUESTION | ❱ [LEVEL] | [Question]` (with ` (Server)` appended to the level for Q101–Q180)?
- [ ] **The Hook (OLA):** Does the opening establish a visceral, real-world, high-stakes scenario?
- [ ] **The Opening Ladder:** Does the body open directly with 5–7 numbered beats (no leading scene line, no hand-written lead) ending on the mystery, with the mechanism term never named, followed immediately by a titled `### ` section that opens the teaching?
- [ ] **The Proper-Scenario Checklist:** Does every ladder beat pass the scenario-clarity gate in the Opening Ladder section — B2 vocabulary for a tired reader, every noun exactly one thing (a person, a thing on the screen, a thing in the code, or a machine event), no bare overloaded word ("editor", "live", "script", "log", "state", "hook", "render"), every beat readable alone and out of order, the problem value's logic explained then repeated (logic-first), the change event shown before the stale screen, and no technical shorthand left unpacked?
- [ ] **The Last Beat:** Does the ladder close on a plain promise of what today brings, never on the explanation of the mystery it posed?
- [ ] **Experience-First Definitions:** Does every new concept pass the experience standard — defined through what the reader can point at, starting from their closest known action, or by the visible before-and-after shape when the concept appears in code — and never only through other words?
- [ ] **The One Thing:** Is the lecture built around one visible change (one line, one prop, one file), shown early and alone? Does every abstraction answer a question the reader is already asking, voiced aloud at the moment it arises?
- [ ] **The Headline:** When the lecture's topic is a new part of the file, do the first section and the ladder's promise beat headline that growth, with the story as the demonstration?
- [ ] **Structural Surprises:** Is every construct that breaks the reader's accumulated model of a React file (a hook at the top of a conditional flow, a `'use client'` line, an `async` component, children between tags, a fragment) taught in prose BEFORE the first code block that shows it — naming the old model, saying the new construct is allowed, and marking what distinguishes it?
- [ ] **Strongest Naive Alternative:** Does the lecture raise and answer the strongest alternative the course has equipped the reader to think of (a prop, a plain variable, an effect), not only weak strawmen?
- [ ] **Deck Cross-Reference:** Did the lecture search earlier lectures for its concepts, re-anchoring and citing `(see Lecture N)` for every term an earlier lecture already baptized, instead of re-teaching it with a fresh metaphor?
- [ ] **Narrative Continuity:** Does the entire lecture stick strictly to this single domain without abrupt context switching? (One exception: the `Where you will meet this` list widens to other apps on purpose.)
- [ ] **Bullet Decompression:** Does every bullet item introducing a file, configuration, or dependency deconstruct all named tools into their physical $A \to B$ transformations and developer benefits, without chaining unbaptized jargon?
- [ ] **Problem-Condition Headings:** Do all failure-state and bug-related callout cards and headings use "When" instead of "Why" (e.g. "When does client-side rendering show a white screen?")?
- [ ] **Zero Tail-End Name Drops:** Does every paragraph and callout card conclude without dropping an unbaptized buzzword on the final line? If a named concept is introduced at the end, are its concrete physical mechanics immediately unpacked?

**2. The Visual Scaffold**
- [ ] **Component Architecture:** Is there a ` ```components ` explorer panel? (MANDATORY in every lecture, no exceptions. State implies ownership; ownership must be mapped. The build warns on any lecture with zero panels.)
- [ ] **Rendered Content:** Does every end component carry rendered lines computed by hand from the code block's real values (e.g. `<p>Total payout tonight: {totalPayout}</p>` becomes `Total payout tonight: **1475**`) — never empty grey bars, STATUS/ACTION placeholders, or a bare `{value}` token — with only two legitimate exceptions: containers whose children render inside them (unfilled on purpose) and logic modules (never render)? See the fill decision procedure and the traceability test.
- [ ] **No Invisible Owners:** Does every prose actor that owns the mechanism (the page that stamps out the copies, the parent that passes the props) appear in a code block or the panel — or has the prose been rewritten to stop leaning on it? Do compound component names have their parts grounded at first appearance?
- [ ] **HTML Figure:** Does the lecture embed at least one ` ```html-figure ` panel (mandatory, the build warns)? Is it a self-contained file in `md-lectures/figures/` cloned from a proven template in `md-lectures/figures/templates/` per `docs/figure-design-system.md`, free of raw `<h2>`/`<h3>` tags, paired with the opening code snippet, within the ~380px to 420px printable height budget, and carrying a genuine graphical substrate (never text-only)?

**3. The Code Executions**
- [ ] **Code Blocks:** Are all code blocks labeled with `title="..."`?
- [ ] **Comment Formatting:** Are all `//` comments strictly at the *end* of the line (no floating bubbles on empty lines)?
- [ ] **Validation Marks:** Do verdict comments lead with `**RIGHT:**` / `**WRONG:**` words? (Never `✔️`/`✖️` glyphs: the build strips them.)
- [ ] **Inline Code Pills:** Are inline code terms and commands styled with the modern rounded pill aesthetic (`#eef7f9` ice-cyan tint, `border-radius: 5px`, `white-space: nowrap`, `hyphens: none`) so code terms, attributes, and CLI formulas never awkwardly split across line breaks?
- [ ] **Table Code Wrapping (CRITICAL):** Are ALL code strings in table cells manually wrapped with `<br>` (separating prose from code with `<br>`, and splitting multi-part expressions across separate backtick spans like `createRoot(node)`<br>`.render(<App />)`) so Prince never breaks grey-box padding mid-token or mid-string?

**4. The Conclusion**
- [ ] **Use Cases:** Is there a `### Where you will meet this` section right before the Glossary — 3 to 5 one-line, pictureable real-app uses of today's concept, each line a concrete moment plus what the concept does there?
- [ ] **Standalone Glossary:** Is there a `### Glossary` section directly between `### Where you will meet this` and `### Summary` with 4 to 6 core terms, each formatted as `- **Term**: Plain-English definition and concrete engineering role without em-dashes.` on a single continuous line?
- [ ] **Streetwise Summary:** Is there a `### Summary` section opened with a bold **Technical Title** on its own line, followed by an empty line and a streetwise review from an experienced coder's daily perspective (using `❒` subtitles, numbered bullets with `(a)`/`(b)` sub-points, and `➔` principles)?
- [ ] **Right/Wrong Code Blocks:** Are comparative examples authored with `**DO THIS:**` / `**DO NOT DO THIS:**` headers (with only the uppercase directive in bold) and language tags `right` / `wrong` without internal comments, strictly limited to summary error avoidance and genuine in-body anti-pattern comparisons?
- [ ] **Comparison Table:** Does the lecture end with a markdown table comparing the React mechanic against its nearest alternative, with the first column right-aligned (`| ---: | :--- | :--- |`) and all inline code manually wrapped with `<br>`?

**5. The TTS & Format Safety**
- [ ] **No Em-Dashes:** Are all em-dashes completely removed or replaced with commas/colons for synthetic voice safety?
- [ ] **Paragraph Flow:** Is every paragraph, bullet, and table row on one continuous line without hard wraps?

## Writing with small-context models (the phased workflow)

- **Length standard:** a completed lecture targets **800 to 1,200 words, about 1,000 on average**. ADVANCED questions may run to 1,500. Most lectures fit one writing session.
- **Parts are optional.** Split a lecture into parts only when one session cannot write it well (typically long ADVANCED lectures). Write parts to `md-lectures-plan/{n}-part1.md`, `{n}-part2.md`, and so on; start every part session by re-reading the outline (if any) and the previous part's last paragraph, which is how a forgetful model stays continuous. Never leave part files anywhere else.
- **Assemble and build.** Concatenate the parts into `md-lectures/{n}.md`, then run `node src/build-lectures.mjs`. The build prints `note` lines for anything it auto-repaired (for example comment-only lines merged into the next code line) and `warn` lines for format violations: title shape, interview-question line, missing callout, missing `### Summary`, closing-table shape. Fix every warning and rebuild. A clean build is the mechanical definition of done.
- **The polish pass (second model, full edit authority).** After assembly, a different model or a fresh session may edit the finished lecture: add at least one interview `[!TIP]` callout, add or sharpen `[!KEY]` takeaways, tighten the Summary and closing table, and fix every warning the build printed. The polish model ends by running the build; zero warnings is its exit condition. This pass is where interview voice and principles are added deliberately, rather than being demanded from the writer.
- **The audit phase stays as defined above** (on demand, append-only `## Beyond the basics`); it is a content-gap review, not the polish pass.
