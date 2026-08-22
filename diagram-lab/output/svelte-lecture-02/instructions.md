# Svelte 5 Lecture + Card Series: Project Instructions

This document is the single source of truth for the workflow of the `svelte-lecture-02` project inside `diagram-lab/output/`. The project mirrors the structure of the sibling `online-demo-01`, with one essential difference: **every question is taught first as a long-form lecture, and only afterwards distilled into a review card**. The lecture is the source of truth for depth; the card is the review artifact.

> **Project Architecture note.** This project runs three parallel content pipelines — **lectures** (comprehensive, long-form), **cards** (distilled, reviewable), and **data-flow** (architectural placement in a real app) — each with its own source folder, build step, and HTML/PDF output folders. All three pipelines draw from the same 210-question curriculum (Svelte 5 + SvelteKit, Q1–Q210) and the same local Svelte documentation. The lecture pipeline is authored first per question; the card and data-flow pipelines follow. The lecture teaches *how* a Svelte mechanism works; the card distills it for review; the data-flow file teaches *where that mechanism belongs* in a real component tree, grounding the concept in the fixed ElectroShop reference architecture.


## File structure and logic 

archive: Reserved for snapshots and provenance
diagrams: The raw HTML/CSS diagram snippets injected into the rendered cards
docs: Documentation including the component data flow architecture (the question bank itself now lives at `../../questions/`)
img: The standalone generated PNG images for the cards
img-instruction: The design system rules, palette, typography, and image generation prompts

> THE LECTURES: this is the main source of truth, we start from md-lectures

When user asks "write the lecture for 09 question" then you start with the md-lecture. 

---
➔ md-lectures: The comprehensive lecture source markdown files (the source of truth)
❯ md-lectures-html: The html files of the lectures, from the md files (`/md-lectures`)
❯ md-lectures-pdf: The pdf files of the lectures, from the html files (`/ md-lectures-html`), from the md files (`/md-lectures`)

---
md-design: The image-generator spec for each card (design descriptions)
md-cards: The card source markdown files distilled from the lectures
md-cards-html: The html files of the cards, from the md files (`/md-cards`)
md-cards-pdf: The pdf files of the cards, from the html files (`/md-cards-html`), from the md files (`/md-cards`)

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

- **Question bank:** `../../questions/questions.md` — the redesigned 210-question curriculum (Svelte 5 Q1–Q100, SvelteKit Q101–Q210), each row carrying `# | Tier | Topic | Question | Hook`. This is the single source of truth for every question and replaces the old flat 200-question list. The controlled topic vocabulary lives in `../../questions/topics.md`, and the design rationale in `../../questions/README.md`. (A legacy copy of the old list remains at `diagram-lab/docs/200Q/200Q.md` for backward reference only — do not author new lectures from it.)
- **Local Svelte documentation (primary source for lectures):** `documentation 2026 June/svelte-docs/` — 106 Markdown files covering runes, template syntax, styling, special elements, runtime, and reference material. Use these as the authoritative technical source for lecture content.
- **Supplementary research:** when the local docs do not fully answer a question, expand with online research, but always anchor claims back to the local docs when possible.
- **Reference architecture for the data-flow pipeline (primary source for `md-data-flow/`):** `docs/component_data_flow.md`, `docs/component_language.md`, and `docs/component_flow_lecture_49.md`. The first two fix the ElectroShop component tree, the component-relationship shorthand, and the multi-scale A/B/C explanation structure that every data-flow file must follow. The third is the prototype; use it as a *format* template only, never as faithful content for question 49 (see the **Data-Flow Format Spec** below for the faithfulness rules).

## Folder Layout

| Folder | Purpose | Author here? |
| --- | --- | --- |
| `md-lectures/{n}.md` | **Lecture source for question `n`.** Long-form Markdown, written FIRST per question. Full formatting (headings, bold, bullets, code fences). One lecture per question, same numbering as the question bank. | Yes |
| `md-lectures-html/` | Build output: per-lecture `{n}.html` plus a combined `deck.html` (the course reader). Never edit by hand. | No |
| `md-lectures-pdf/` | Build output rendered by Prince: per-lecture `{n}.pdf` plus `deck.pdf`. Never edit by hand. | No |
| `md-data-flow/{n}.md` | **Data-flow source for question `n`.** Maps the lecture's concept onto the fixed ElectroShop reference architecture using the multi-scale A/B/C structure from `docs/component_data_flow.md`. Written AFTER the lecture, in parallel with the card. One file per question, same numbering as the question bank. | Yes |
| `md-data-flow-html/` | Build output: per-question `{n}.html` plus combined `deck.html`. Never edit by hand. | No |
| `md-data-flow-pdf/` | Build output rendered by Prince: per-question `{n}.pdf` plus `deck.pdf`. Never edit by hand. | No |
| `md-cards/{n}.md` | **Card source for question `n`.** Distilled from the lecture. Question, bulleted answer, code, diagram placeholder, summary. Written AFTER the lecture. | Yes |
| `md-cards-html/` | Build output: per-card `{n}.html` plus combined `deck.html`. Never edit by hand. | No |
| `md-cards-pdf/` | Build output rendered by Prince: per-card `{n}.pdf` plus `deck.pdf`. Never edit by hand. | No |
| `md-design/{n}.md` | **Image-generator spec for card `n`.** One `Design description:` paragraph (one continuous line, never hard-wrapped). Parallel numbering to `md-cards/`. | Yes |
| `diagrams/{n}.html` | Raw HTML/CSS snippet injected into the rendered card, authored per the design system in `img-instruction/005.md`. | Yes |
| `img/{n}.png` | Standalone generated images (external step, not produced by the build scripts). | N/A |
| `src/build-lectures.mjs` | **Lecture build script.** Reads `md-lectures/`, writes `md-lectures-html/` + `md-lectures-pdf/`. | Rarely |
| `src/build-cards.mjs` | **Card build script.** Reads `md-cards/` + `diagrams/`, writes `md-cards-html/` + `md-cards-pdf/`. | Rarely |
| `src/lecture.css` | Long-form article stylesheet used by the lecture HTML/PDF pipeline. | Rarely |
| `img-instruction/005.md` | **Single source of truth for all diagram and image design** (palette, typography, components, layout patterns, the four-element complexity budget, pedagogical rules, and the Generic Prompt to prepend to image generations). | Read always; edit rarely |
| `archive/` | Reserved for snapshots and provenance. Currently empty. | No |

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

Each pipeline produces per-file HTML/PDF plus a combined `deck.html`/`deck.pdf` (the course reader for lectures, the full card deck for cards, and the data-flow atlas for the data-flow pipeline). The build scripts gracefully report `no markdown files in md-lectures/`, `no markdown files in md-data-flow/`, or `no markdown files in md-cards/` and exit cleanly when their source folder is empty — so it is safe to run any pipeline before its content exists. The data-flow pipeline shares `src/build-lectures.mjs` with the lectures and review experiment: one invocation rebuilds all three, and it skips cleanly if `md-data-flow/` is absent or empty.

## The Lecture-First Workflow

For every new question processed in this project, the following five steps are executed in exact order. The order is non-negotiable: writing the card first risks losing the depth the lecture is meant to establish.

**Before any design or build work:** read `img-instruction/005.md` end to end. It is the single source of truth for how every diagram looks, what palette to use, how many elements are allowed, and which Generic Prompt to prepend to image generations.

### Step 1: Write the lecture (`md-lectures/{n}.md`)

- Extract question `n` from the source document.
- Read the relevant local Svelte documentation under `documentation 2026 June/svelte-docs/`. Anchor every technical claim to the docs when possible; expand with research when the docs are insufficient.
- Write a **pedagogically clear, extended, comprehensive lecture** that teaches the concept as if to someone who needs to genuinely understand it, not just memorize it.
- The first line is `# Lecture {n}: {Short Title}`.
- Apply the **Lecture format spec** below.
- In the lecture, always add code snippets that are clear, concise, representative of the idea

Example of snippet  (add the file name on title )
```svelte title="App.svelte"
<script>
  let count = 0;

  
  $: double = count * 2; // Reactive declaration of variable "double"

  $: console.log('Count updated:', count); // Reactive statement (with side-effects)

  
  $: {
    if (count > 10) {
      alert('Threshold reached');  // Reactive block (multiple lines)
    }
  }
</script>
```

Important: Notice the word "change" is new row, as it it sensi

### Step 1b: The Organic Lexical Audit (OLA)

Before finishing any lecture, you MUST run the OLA to ensure no jargon is introduced superficially.
1. **Scan the text** to find lexical terms a newbie would not be familiar with (e.g., *router, bundler, scaffolding, single-page application, compiler*).
2. For each term, you must write a **Specific Organic Intervention** that follows this exact 5-step progression:
   * **Step 1: The Context.** State what the user is trying to achieve. **CRITICAL RULE: The example must be visceral, not theoretical.** Do not use abstract examples (e.g., "What if we need a global counter?"). Find a real-world, high-stakes scenario where the newbie would physically hit a wall without this feature. (e.g., *"Imagine you have 5 Audio Players on a webpage. When a user clicks 'Play' on Player #3, Player #1 needs to pause. How do these 5 isolated copies talk to each other to share a 'currently playing' status?"*)
   * **Step 2: The Naïve Alternatives.** Pose highly specific, tangible, and simple alternatives for how this could be done. (e.g., *"Should we name new pages automatically with 'p', for example, `/p/1` is page 1, and `/p/2` is page 2? Or maybe we should write `/page-1` for page 1?"*)
   * **Step 3: The Architectural Need.** Frame this explicitly as an architectural decision or mechanical requirement. (e.g., *"This is a decision about the architecture of our app. We have to make sure that when a specific path is visited by the user, a specific part of our app is activated."*)
   * **Step 4: Naming the Term.** Now, and only now, introduce the lexical term as the name for this mechanism. (e.g., *"This mechanism is called the router of the app."*)
   * **Step 5: The Summary.** Summarize what the term does using the context just built. (e.g., *"The router makes sure to match all the paths with the proper components of the app."*)
3. **Integrate** this specific 5-step intervention into the text, replacing the original superficial use of the term.

### Step 2: Draft the card (`md-cards/{n}.md`)

- Distill the lecture into the review-card format. Apply the **Card format spec** below — the same bulleted-answer format used in `online-demo-01`.
- The card is the review artifact: short, scannable, high-density. Every bullet must stand on its own without the lecture, but the lecture is where the depth lives.

### Step 3: Map the concept onto the ElectroShop architecture (`md-data-flow/{n}.md`)

- This step runs **in parallel with the card** (Step 2), after the lecture (Step 1) is settled. You can only map a concept onto a real component tree once the lecture's mechanism is fixed; never write the data-flow file before the lecture.
- Apply the **Data-Flow Format Spec** below. Every file follows the multi-scale A/B/C structure from `docs/component_data_flow.md`, set on the fixed ElectroShop tree defined in `docs/component_language.md`.
- **Always use ElectroShop.** Even when the lecture's running example fits MyTube better (for example, Q49's `Post`/`likes`), re-cast it into ElectroShop terms before writing the data-flow file. Consistency across the 210-question atlas is the whole point of pinning one scaffold; drifting to a second reference app doubles the maintenance cost and fragments the deck.
- **The rune and the mechanism must match the lecture.** The prototype `docs/component_flow_lecture_49.md` is a *format* template only; it illustrates `$derived.by` with a VIP-discount scenario that does **not** match Q49's actual concept (plain `$derived`, one-line prop sync). Re-use the structure, never the prototype's specific rune or example. If the lecture teaches `$derived`, the data-flow file shows `$derived` — not `$derived.by`, not a callback form.

### Step 4: Compose the design description (`md-design/{n}.md`)

- Create `md-design/{n}.md` (parallel numbering to `md-cards/`).
- Write exactly one `Design description:` paragraph — one continuous line, never hard-wrapped (per AGENTS.md).
- Describe the visual metaphor for this card. All aesthetic, palette, typography, layout-pattern, and complexity-budget rules live in `img-instruction/005.md` — follow them, do not restate them here. This file only describes *what* this specific diagram shows and which one of the sanctioned layout patterns it uses.

### Step 5: Author the diagram (`diagrams/{n}.html`) and build the card

- Author the raw HTML/CSS diagram in `diagrams/{n}.html`, strictly following the metaphor in `md-design/{n}.md` and the design system in `img-instruction/005.md`.
- Run `node src/build-cards.mjs` from inside the project folder to inject the diagram and compile the card PDF.
- Optionally run `node src/build-lectures.mjs` to refresh the lecture PDF.

### Step 6: Generate the PNG image (`img/{n}.png`)

- Generate the standalone image artifact by prepending the **Generic Prompt** from `img-instruction/005.md` (section 8) to the specific `Design description:` paragraph read from `md-design/{n}.md`.
- Save the result as `img/{n}.png`.

## The Audit Phase (on-demand, runs only when the user asks)

The six steps above are the standard authoring flow for one question. The audit is **not** part of that flow — it is a separate, on-demand phase that runs only when the user explicitly asks for it (for example, "audit lecture 49"). Treat the audit as a second pass performed by a fresh, critical reader whose only job is to find what the original lecture missed. The point of running it as a separate phase, after the lecture is finished and only on request, is to simulate an independent review: the author is done, the lecture exists, and now a different perspective asks "what did this leave out that a student will actually need?"

### When to run the audit

- **Only when the user asks.** Never run the audit automatically as part of Step 1–6. The audit is a deliberate, requested review, not a default step.
- **Only on a finished lecture.** The audit makes no sense on a draft or a half-written lecture; it assumes Step 1 is complete and the lecture has been built to HTML/PDF at least once.
- **One lecture at a time.** The user will name the lecture (e.g. "audit lecture 49"). Do not audit multiple lectures unless explicitly asked.

### How to run the audit

- **Read the lecture end to end** in `md-lectures/{n}.md`. Note every concept, term, and example it covers.
- **Cross-check against the authoritative local docs.** Open the relevant files under `documentation 2026 June/svelte-docs/` for the lecture's topic. The audit's authority comes from comparing what the lecture says against what the docs say — not from the auditor's prior knowledge. If a doc section exists that the lecture did not draw on, that is a candidate gap.
- **Look for genuinely missing material, not stylistic preferences.** The audit is not a rewrite. It looks for: related API surfaces the lecture did not mention (e.g. `$bindable` when the lecture covered `$props`), alternative patterns for the same problem (e.g. `$derived.by` when only `$derived(expr)` was shown), common pitfalls the lecture did not flag, and adjacent concepts a student would naturally need next.
- **Do not duplicate what the lecture already says.** If the lecture covered it, even briefly, do not include it in the audit. The audit's value is net-new information.

### How to write the audit findings

- **Append a single new section at the end of the lecture** titled exactly `## Beyond the basics`. Do not modify or rewrite any existing section of the lecture — the audit adds, it does not edit.
- **The section is a bulleted list.** Each bullet follows the format: `- **Bold lead phrase**: explanation ...`. The bold lead phrase names the missing topic in 3–7 words; the rest of the bullet explains it in plain English with the relevant API name, code identifier, or cross-reference inline.
- **Each bullet is self-contained.** A student reading only the bullets (skipping the lecture body) should still understand what each missing topic is and why it matters. Define every technical term inline, the same jargon rule as the rest of the project.
- **Cross-reference other lectures and the docs by path or number** when relevant (`see Lecture 50`, `see Lecture 21`, `documentation 2026 June/svelte-docs/02-runes/05-$props.md`). The audit is a hub for "where to go next," and explicit pointers are part of its value.
- **Order the bullets by relevance**, not by source-doc order. The most commonly needed missing topic goes first; the most niche goes last. A reasonable size is 4–8 bullets — enough to be useful, short enough to read in one sitting.
- **Do not add new code blocks to the audit section.** The audit is high-density prose. If a code example is genuinely necessary to explain the missing topic, that is a signal the topic belongs in the lecture body, not the audit — flag it in the response to the user instead of adding it inline.

### After writing the audit

- **Rebuild the lecture** with `node src/build-lectures.mjs` so the HTML and PDF reflect the new `## Beyond the basics` section.
- **Verify the section rendered correctly**: confirm the `## Beyond the basics` heading is present, the bullet count matches what was written, and the section sits at the very end of the lecture (after Summary, if one exists).
- **In the response to the user, list the specific gaps the audit found** and why each was added. The user asked for an audit; they should see the audit's reasoning, not just its output. Cite the doc section that surfaced each gap.

## Lecture Format Spec

The lecture pipeline uses a full Markdown renderer (`src/build-lectures.mjs`). Unlike the card pipeline, there are no card-specific constraints — you may use any combination of standard Markdown.

- **Plain markdown with full formatting.** **bold**, *italic*, bullet lists, numbered lists, inline `` `code` ``, fenced code blocks with optional `title=""`, blockquotes, and inline `[text](url)` links are all supported and render correctly to HTML and PDF. (See the **heading rules** below for the specific roles of `#`, `##`, and `###`.)
- **The interview question is embedded in the lecture source** — it is the second line of every lecture file, immediately after the title, as a blockquote with the exact pattern `> INTERVIEW QUESTION | ❱ [TYPOLOGY] | <question text>`. The build script parses this line and renders it as a pull-quote callout **directly below the title** (an `<aside class="interview-question">` styled by `src/lecture.css`), including a premium badge for the typology (e.g. `❱ CORE`, `❱❱ MORE`, `❱❱❱ ADVANCED`). The visual order matches the source order: title first, then the question, then the lecture body. The author copies the **Question** column verbatim from `../../questions/questions.md` (row `n`) when creating the lecture and may edit it inline afterward. The build no longer reads `questions.md` — the lecture file is the single source of truth for its own question.
- **Long-form, not summary.** Aim for comprehensive coverage of the concept. The lecture is the source of depth for the whole project; a thin lecture produces a thin card.
- **Lead with critical questions and visceral pain points (Organic Lexical Audit - OLA).** Always introduce new lexical terms using visceral, real-world, high-stakes contexts. Don't just explain a feature theoretically—create a scenario where a newbie would physically hit a wall without it (e.g., "if you rename the ID, the button breaks silently and you lose the sale"). Open each lecture by surfacing this real-world failure or confusion that motivates the concept. Build tension before revealing the solution.
- **Combine theory, technical definitions, and practical examples.** Every lecture should braid three threads: (1) the formal definition of the mechanism, (2) why it exists and what pain it removes, and (3) at least one concrete code example drawn from realistic Svelte code.
- **Earn a new technical term before you name it.** When a concept is about to land — especially one that looks imposing at first glance — do NOT rush straight into the jargon. If a reader is still wondering *why this thing even needs to exist*, hitting them with the formal vocabulary (the named phases, the rune names, the API surface) feels estranging rather than enlightening; the term arrives before its necessity does, and complexity reads as overwhelm. The fix is a short orienting paragraph that first establishes the human problem the machinery solves, and only then introduces the term as the name for that solution. The term should feel like a relief — "oh, *that's* what this is called" — not a wall.

  **Worked example — introducing component lifecycle phases.** Do NOT open by listing the `mounted`, `updated`, and `destroying` phases cold. A reader who has never thought about component lifetimes will not yet see why those names matter. Instead, earn the vocabulary with an intro paragraph like this:

  > Components in every web framework — Vue, React, Svelte — have a brief, eventful life. A component *appears* on the screen (it gets mounted), it *changes* as the user interacts with it (it updates), and eventually it *vanishes* from the screen (it gets destroyed). Why does this matter? Because you can write code that runs at one of these moments and not the others. You need to make sure your data is fetched *before* the component is mounted, so there is something to show. You need to react when the component updates, so the screen stays in sync. And you need to make sure data leaks are halted — timers cancelled, subscriptions torn down, listeners removed — when the component is destroyed, so it does not leave garbage behind.

  Only after that grounding does the term arrive as the name for what the reader already understands: the three moments are the component's **lifecycle phases**, and the hooks (or, in Svelte 5, the `$effect` rune) are the tools that run code at exactly the phase you choose. The named vocabulary now labels a concept the reader already holds; it does not introduce one they do not.

  This rule is the **front half** of the jargon rule directly below. First earn the term (this rule); then, once named, define it immediately in plain English (the next rule).
- **Explain every difficult term inline.** The same jargon rule as the cards applies: keep the technical term, then immediately define it in plain English in the same sentence. Pattern: `the **microtask queue** — a built-in JavaScript list of tiny tasks the browser runs after your current function finishes, but before it paints anything`.
- **Numbering.** Lecture file `{n}.md` corresponds to question `{n}` in the source bank. The numbering matches `md-cards/{n}.md`, `md-design/{n}.md`, and `diagrams/{n}.html` exactly, so any artifact can be cross-referenced by number.
- **Every lecture closes with `### Summary` plus a comparison table.** This is a hard structural rule, not an optional flourish — the lecture is incomplete without both. The closing has two parts, in this order:
  1. **`### Summary`** — a short prose paragraph (3–6 sentences) that distills the lecture's core mechanism into its cleanest form. It is not a recap of the sections; it is the one-paragraph version a reader would carry away. Write it so that a reader who skipped the body could still leave with the answer.
  2. **A comparison table** — a markdown table immediately below the Summary paragraph that contrasts the lecture's mechanism against its nearest alternative (e.g. Svelte vs React/Vue, `$state` vs plain `let`, `mount` vs `hydrate`, Svelte 4 vs Svelte 5). Two or three columns: the dimension on the left, the alternatives across the top. 
  **Table Alignment Formatting:** You MUST right-align the first column (the row headers) and left-align the remaining columns. Use the exact markdown syntax `| ---: | :--- | :--- |` for the divider row. This is the visual anchor that lands the "what makes this different" point, and it is what the audit phase, the card, and the reader all lean on. If the lecture genuinely has no meaningful contrast (rare), substitute a "what to remember" two-column table of term → one-line definition, using the same `| ---: | :--- |` alignment.

  This rule exists because the Summary + table pair was an *unwritten convention* in `svelte-lecture-01` and got dropped under context pressure, as did the cleaner right-aligned first column styling. Making it explicit here prevents that regression. The canonical template is `md-lectures/01.md` (the "What is Svelte?" lecture) — its closing is the reference shape every lecture should match.

### Comparison table format (the title row is the markdown header)

Every Summary table follows **one fixed shape**. The title row is the markdown header — it renders as a real `<thead>` and is visible. The leftmost header cell is left **empty**, so the top-left corner of the table is blank by design: there is no title over the leftmost "dimension" column. The column titles go in the remaining header cells, formatted as `**TITLE**<br>(subtitle)`.

**Exact markdown skeleton** (three columns; adapt the count for your contrast):

```
| | **COLUMN B TITLE**<br>(subtitle) | **COLUMN C TITLE**<br>(subtitle) |
| ---: | :--- | :--- |
| **Dimension one** | value | value |
| **Dimension two** | value | value |
```

**Canonical example** (from `md-lectures/01.md`):

```
| | **REACT / VUE**<br>(Runtime Library) | **SVELTE**<br>(Build-Time Compiler) |
| ---: | :--- | :--- |
| **Architecture** | Ships a framework engine to the browser | Compiles components to vanilla JS at build time |
| **State Updates** | Virtual DOM diffing | Direct, surgical DOM updates |
| **Bundle Size** | Includes the framework runtime engine | Contains only the generated vanilla JavaScript |
| **Performance** | Overhead from keeping a virtual tree in memory | Bare-metal performance by updating nodes directly |
```

**Rules, in order of importance:**

1. **The first header cell is always empty** — `| |` at the start of the title row. This blanks the top-left corner: no title over the leftmost "dimension" column. The empty cell is structurally still a normal title cell (it keeps its borders and padding so the top line runs the full width of the table), it just has no text. The CSS keys off `thead th:empty` only to neutralize any stray background — leave the cell empty in the markdown and the rest is automatic.
2. **Column titles live in the header row**, formatted as `**TITLE**<br>(subtitle)`. The build runs header cells through the inline formatter, so `**bold**`, `<br>`, and inline `` `code` `` all work. The title is the short name (e.g. `REACT / VUE`); the parenthetical is the one-word gloss of what kind of thing it is (e.g. `Runtime Library`).
3. **Prevent awkward code wrapping**. If a table cell contains a long inline code string (e.g., `` `element.addEventListener('click', fn)` ``), use `<br>` to manually split it (e.g., `` `element.addEventListener`<br>`('click', fn)` ``) to avoid breaking the grey background padding awkwardly across lines in the PDF.
4. **The divider row is `| ---: | :--- | :--- |`** — right-align the first (dimension) column, left-align the rest. This is load-bearing for the rendered look.
4. **Body rows start with a bold dimension** in the leftmost cell: `**Architecture**`, `**Bundle Size**`, etc. The CSS sizes `td:first-child strong` larger, so the dimension reads as a sub-heading inside its row.
5. **Never put titles in a body row.** The previous project smuggled the title row into the first `<tbody>` row because `thead` was hidden by a CSS hack. That hack is gone in this project — `thead` is visible and is the title row. Putting titles in a body row produces a duplicate, unstyled title strip.

**Why this is encoded here.** In `svelte-lecture-01`, `thead` was hidden with `thead { display: none; }`, and authors worked around it by writing the title row as the first body row. That workaround was never documented, so it was lost under context pressure and tables rendered with no visible titles at all. This project removed the CSS hack and made the markdown header the real title row; this subsection pins the authoring rule so it cannot regress.

### Heading rules (load-bearing)

The three markdown heading levels have distinct, non-interchangeable roles. Using the wrong level changes both the rendered HTML and the PDF pagination.

- **`# ` (h1) — the lecture title.** Used exactly once per lecture, as the first line. Pattern: `# Lecture {n}: {Short Title}` — for example, `# Lecture 50: Array Updates in $state vs Legacy Re-assignment`. The renderer uses this line as the page title and the entry heading in the course reader.
- **`## ` (h2) — page break.** Every `## ` heading forces the PDF to start a new page (and the deck HTML to insert a lecture-break rule). Use `## ` sparingly: only when a section genuinely needs its own page — for example `## Beyond the basics` (the audit section) or a major part boundary inside a long lecture. Most lectures should have at most one or two `## ` headings.
- **`### ` (h3) — the default section heading.** Every normal section inside a lecture uses `### ` — the "Problem," the "Mechanism," the "Worked example," and so on. `### ` does NOT trigger a page break; the section flows inline. If you catch yourself reaching for `## ` for a regular section, switch to `### `.

Quick test: if the heading introduces a new subsection of the current lecture and you do NOT want a page break, it is `### `. If you want the next page to start here, it is `## `. The title at the top is always `# `.

### The interview-question line (exact pattern)

- **Position**: line 2 of the lecture file, immediately after `# Lecture {n}: ...`. No blank line between them.
- **Format**: a markdown blockquote, prefixed with `> `, then the literal token `INTERVIEW QUESTION`, then a space, a vertical bar, a space, then the curriculum typology (`❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`), a vertical bar, a space, then the question text.
- **Example** (verbatim, including the `>` and the `|`):
  ```
  > INTERVIEW QUESTION | ❱ CORE | How do you initialize a reactive local variable that dynamically syncs with an incoming prop using Runes?
  ```
- **A blank line follows** before the rest of the lecture body begins.
- **Editing**: to change the question, edit this single line. Do not edit `../../questions/questions.md` and do not edit the build script — the build reads only from this line.
- **If the line is missing**, the build renders the lecture without a callout (no error, but the visual anchor is gone — always include it).

### Alert callouts (`> [!TIP]`)

Lectures support GitHub-style **alert callouts** — a blockquote whose first line is `> [!TYPE]`, rendered as a styled box with an eyebrow label and a tinted accent border. The project uses these to deliver *interview-strategy guidance* (how to frame an answer, what to emphasize, what interviewers want to hear) alongside the technical content. The canonical example is `md-lectures/01.md` (the "What is Svelte?" lecture), which demonstrates both a `[!KEY]` and a `[!TIP]` callout in context.

**Syntax.** Open with `> [!TYPE]` on its own line, then the body on the following `>` lines:

```
> [!TIP]
> **To impress the interviewer:** During an interview, most candidates will simply state that "Svelte doesn't use a Virtual DOM." If you want to show deep technical background, explain *why* it doesn't need one — this proves you understand the mechanics, not just the marketing.
```

**Supported types and their eyebrows** (the build parses exactly these five; anything else falls back to a plain blockquote so the typo is visible):

- `[!TIP]` → **Interview Tip** (the project's signature callout; accent-teal border). Use this for "here is how to win this answer in an interview" guidance.
- `[!NOTE]` → **Note** (neutral informational aside; accent-teal border).
- `[!KEY]` → **Key Takeaway** (warm amber). This is the callout for **insider allegories and key takeaways** — the one-line distillation that separates a framework user from someone who grasps the underlying idea. Reach for it when you have a single sentence that reframes the concept as a memorable comparison, analogy, or load-bearing truth. Example (from `md-lectures/01.md`): `> What the DOM is to HTML, the AST is to code.` That is a sentence a reader carries out of the lecture; the amber box exists to make sure it lands. A good KEY callout reads like something a senior engineer would murmur after years with the tool — not a summary of the section, but the *why-it-matters* the section is building toward.
- `[!WARNING]` → **Warning** (amber; a real pitfall to avoid).
- `[!CAUTION]` → **Caution** (red; a destructive or breaking action).

**Authoring rules:**

- **The marker line is `> [!TYPE]`** — uppercase type in square brackets, immediately after `> `. A blank `>` line may precede the body but is not required; the body lines are everything from the next `>` line until a non-`>` line.
- **Use `> [!TIP]` as the default** in this project. The eyebrow renders as "Interview Tip" precisely because every lecture is interview prep; reaching for NOTE/WARNING/CAUTION is fine when the content genuinely fits one of those tones, but TIP is the on-brand choice for framing advice.
- **Reach for `> [!KEY]` for allegories and insider takeaways.** These are the highest-value lines in the whole lecture — the comparisons and compressed truths that show deep understanding and that interviewers and insiders recognize. Do not waste the KEY box on a routine "remember to..." note; reserve it for the kind of sentence that earns its own box.
- **One callout per point.** A callout carries a single, self-contained tip. If you have three tips, write three callouts — do not cram a bulleted list of tips into one box.
- **Body formatting is full markdown.** Bold (`**...**`), italic (`*...*`), and inline code (`` `...` ``) all work inside the callout body. Keep the body to a short paragraph; if it needs a code example, the example belongs in a fenced block adjacent to the callout, not inside it.
- **Lead the body with a bold lead-in.** Pattern: `> **To impress the interviewer:** ...` or `> **Common mistake:** ...`. The bold lead-in names what kind of tip it is before the reader reaches the explanation, mirroring the bulleted-answer convention used elsewhere in the project. The KEY allegory is the one exception: its body is often a single bare sentence with no lead-in, because the sentence *is* the takeaway.
- **Place callouts inline, at the moment the tip matters.** A callout that teaches how to answer the *current* concept goes right after the section that establishes it. Do not bank all tips at the end of the lecture; their value is contextual.
- **Never substitute a callout for the lecture's actual content.** The callout is framing advice — how to talk about the concept. The mechanism itself belongs in the lecture prose and code blocks. A lecture full of callouts and thin on explanation has failed its job.

### Repeat and emphasize the important statements

A key statement does not earn its place by being said once. The project's convention is that an **important allegory or insider takeaway is stated twice, in two registers**: first as the punchy `[!KEY]` callout (the compressed form a reader can quote), then again, expanded, in the prose immediately following (the unpacked form that explains *why* the allegory holds). The compressed line earns the box; the prose earns understanding.

The model is `md-lectures/01.md`:

```
> [!KEY]
> What the DOM is to HTML, the AST is to code.

Just as the browser parses a flat HTML string into a Document Object Model (DOM)
tree so it can manipulate the web page, a compiler parses a flat string of code
into an Abstract Syntax Tree (AST) so it can analyze and manipulate the program.
```

The callout and the paragraph say the *same thing* deliberately. The callout is the hook (a reader can carry it away in one read); the paragraph is the proof (it walks the analogy through so the reader sees the mapping: HTML string ➔ DOM tree, code string ➔ AST tree). Do not put the callout in without the unpacking, and do not unpack an idea in prose without giving its load-bearing line a `[!KEY]` callout to live in. If a takeaway is worth the reader's long-term memory, it is worth stating in both registers.

**What counts as an insider takeaway worth this treatment.** Allegories that map the unfamiliar onto the familiar ("the DOM is to HTML as the AST is to code"), naming the exact mechanism a senior engineer would point to ("Svelte bakes the reactivity graph into the compiled output at build time, so the runtime has nothing to diff"), and the one sentence that, once heard, makes the rest of the lecture click into place. These are the lines a student repeats to themselves before the interview; surface them, box them, and unpack them.




## Code Block Format (auto-highlighted)

Every fenced code block in a lecture is automatically transformed by `src/build-lectures.mjs` into an editor-style display: a thin-bordered window with optional filename tab, three traffic-light dots, numbered lines, zebra striping, syntax-highlighted tokens, and **`//` comments rendered with a `→` arrow instead of the slash characters**. The author writes plain Markdown; the build script produces the styled HTML. **Never hand-write `<span>` tags, CSS classes, or `→` arrows in lecture Markdown** — the highlighter will double-encode them and the output will be wrong.

### How to author a code block

- **Open with a fenced block**: ` ```svelte ` or ` ```js ` or ` ```javascript ` (all three use the same JS/Svelte tokenizer).
- **Filename tab is always shown.** The editor chrome (three dots + filename pill) renders for every fenced block. If you omit `title=`, the highlighter derives a default filename from the fence language: `svelte` → `App.svelte`, `js`/`javascript` → `App.js`, `ts`/`typescript` → `App.ts`, anything else → `code.txt`. To override, write ` ```svelte title="RealName.svelte" `.
- **`<script>`, `<style>`, `<template>` wrapper tags are auto-stripped.** A line whose trimmed content is exactly one of these tags (with or without attributes like `<script lang="ts">`) is removed from the rendered output entirely — not numbered, not shown. This matches the reference aesthetic, which never displays the Svelte boilerplate wrappers. If you genuinely need to show a wrapper tag, use inline code in prose (`` `<script>` ``), not a fenced block.
- **Do not indent code inside stripped wrappers.** Because `<script>` tags are auto-stripped, any leading spaces you add to indent the code *inside* the script tag will be left behind in the final render. This pushes the code too far to the right and breaks the math that aligns parallel-right comments. For `.js` blocks, do not use `<script>` wrappers at all. For `.svelte` blocks, keep your top-level code flush against the left margin.
- **Blank lines are dropped.** Empty lines in the source are removed from the rendered output, so the editor stays dense — no empty numbered rows. The line numbering reflects the post-strip, post-drop line positions (so a snippet with 5 visible lines numbers them 1–5, regardless of where blanks or wrappers sat in the source).
- **Close with ` ``` `** on its own line. Every fence opener must have a matching closer.
- **Write comments normally**: use `//` followed by a space and the comment text. The highlighter renders the `//` as `→` in the output. Example source: `let count = 0; // Reactive declaration of variable "double"`.
- **Bold inside comments**: wrap key terms in `**double asterisks**`. The highlighter renders these as bold inside the comment span. Example source: `// adds an **own** prop`.
- **No other comment formatting**: italic, inline code, and links are not supported inside comments. Use `**bold**` only.

### The `//` → `→` rule (exact behavior)

- The first `//` on a line that is **followed by a space or end-of-line** is treated as the comment start.
- Everything from that `//` to the end of the line is rendered as `<span class="cmt">→ ...</span>` — a sans-serif, slightly muted grey, with an 18px left margin so it sits clearly to the right of the code.
- **`//` inside URLs is preserved.** A string like `'https://example.com'` is untouched because the `//` is followed by `example`, not a space. The same protection applies to `file://`, `http://`, and regex literals.
- **Empty trailing `//` is dropped.** A line ending in bare `//` with no comment text renders without any arrow — clean output, no dangling `→`.
- **`//` at the very start of a line** (a comment-only line) is technically converted to `→` by the build, but **authors must never write comments this way.** A comment-only line renders as a `➔` with no code beside it — an orphaned annotation floating in the editor with nothing to annotate. This is a build fallback for edge cases, not an authoring pattern. Every comment must sit at the end of a real code line (see **Comment placement** below).

### Comment placement (load-bearing)

Comments in this project are **always parallel-right**: they sit at the end of the code line they annotate, after a `//`, never on their own line above the code. This is non-negotiable. The reason is that a comment renders on screen as a `➔`-prefixed annotation in a column to the *right* of the code. Its entire job is to deliver clear, short visual information about the line it sits beside. A comment with no code beside it is an annotation of nothing — it floats orphaned in the editor and the reader cannot tell which line it belongs to.

**The rule, stated plainly:** write `code; // annotation`, never `// annotation` on its own line followed by `code;`. If you find yourself wanting to introduce a block of code with a comment, write the introduction in the prose above the snippet instead — do not park it as a comment-only line inside the fence.

**Exception for extremely wide lines:** If the line of code itself is exceptionally long (e.g., a wide function declaration like `function react_style_update(oldTree, newTree) {`), attaching a comment to the end will cause it to hit the right edge of the editor container and wrap into two lines, breaking the parallel visual layout. In this specific scenario, place the comment on its own line *inside* the block (e.g., inside the function body on the very next line) instead of trailing the wide line.

The canonical reference is **`md-lectures/49.md`**: every comment in that lecture is parallel-right, with not a single comment-only line anywhere. Study these five examples as the models of the discipline (each is a real line from 49.md):

1. **The trap verdict, parallel-right:**
   `let count = $state(initialCount); // ✖️ reads initialCount **ONCE** during creation`
   — a wrong-pattern line, flagged with `✖️`, the load-bearing word `**ONCE**` in caps, sitting at the end of the line it warns about.

2. **The correct-pattern verdict, parallel-right:**
   `let likes = $derived(post.likes); // ✔️ creates a continuous, **REACTIVE** relationship`
   — the recommended pattern, flagged with `✔️`, the takeaway word `**REACTIVE**` in caps.

3. **The numbered-step sequence, parallel-right across three lines:**
   ```
   likes += 1;        // 1. optimistic override: increment **LOCALLY** immediately
   await like();      // 2. tell the server to **SAVE** the change
   likes -= 1;        // 3. rollback: if network request failed, **REVERT** the override
   ```
   — a three-step narrative told as three parallel-right comments, each with its step number and one caps word. The reader's eye tracks down the comment column and reads the story.

4. **The severing trap, parallel-right:**
   `let { title } = $props(); // ✖️ severs the **REACTIVE** connection to the prop`
   — a one-line gotcha; the comment names the exact consequence (`severs the REACTIVE connection`) right beside the offending line.

5. **The three-way contrast block, parallel-right:**
   ```
   let a = $state(data);             // ✖️ initializes once, then goes **DEAF**
   let b = $derived(data);           // ✔️ listens forever, but is **READ-ONLY**
   let { c = $bindable() } = $props(); // ✔️ listens forever AND is **WRITABLE**
   ```
   — three lines, three parallel-right comments, three contrasting caps words (`**DEAF**` / `**READ-ONLY**` / `**WRITABLE**`). The comparison lives in the aligned comment column, not in prose.

**What makes a parallel-right comment good.** Because the comment appears on screen beside its code, it must be short and self-contained — a verdict (`✔️`/`✖️`), a step number, or a one-phrase gloss, plus one caps load-bearing word. It is a *label* for the line, not an explanation of the line; explanations belong in the prose around the snippet. If a comment needs more than roughly one short sentence, it is too long for the comment column — move that material into prose and leave a shorter label beside the code.

**The anti-pattern (do not do this).** The following, taken from an early draft of lecture 02, is exactly wrong — every comment is a comment-only line parked above the code it describes:

```
// ✔️ 1. CSS is extracted and scoped with a hash
const h1 = document.createElement('h1');
```

On screen this renders as a `➔`-prefixed annotation with no code beside it, followed on the next row by code with no annotation. The reader cannot pair them. The correct form attaches the comment to the line it labels:

```
const h1 = document.createElement('h1'); // ✔️ 1. the **DOM** element is created via JavaScript
```

### Comment appearance and conventions

Comments in lecture code blocks are not styled like ordinary code. They have their own visual treatment designed to make the *meaning* of a line jump out, separate from the *mechanics*. The canonical demo of every comment feature is **`md-lectures/49.md`** — every pattern below appears there and should be studied as the reference. Open `md-lectures-html/49.html` (or `md-lectures-pdf/49.pdf`) alongside the source `.md` to see exactly how each comment style renders.

**Visual treatment of every comment:**

- **Arrow prefix, not `//`.** Every comment renders with a `➔` (heavy rightwards arrow) glyph at its start, replacing the `//` you wrote in source. The arrow visually separates the code on the left from the explanation on the right.
- **Different font from the code.** Comments use IBM Plex Sans Condensed (with fallbacks), not the monospace code font. This typographic shift signals "this is annotation, not code" without needing a color change to do the work.
- **Slightly larger size.** Comments render a touch larger than the code (around `0.96rem` vs `0.92rem`) so they read comfortably even when packed to the right of long lines.
- **Muted grey, not black.** Comment text is `#4b5563` (slate); the surrounding code is darker (`#1f2937`). The contrast is enough to read but clearly secondary.
- **18px left margin.** A gap sits between the end of the code and the start of the arrow, so the comment column does not crowd the code.

**Comment content conventions (the author's job):**

Comments in this project are not neutral developer notes. They are **pedagogical annotations** that teach the reader what the line *does* or *means* in the context of the lecture. Three patterns appear throughout lecture 49 and should be the model for new lectures:

- **Verdict comments with a leading glyph**: use `✔️` (correct choice) or `✖️` (wrong choice / trap) as the first non-space character after `//`. The glyph survives into the rendered comment and instantly tells the reader whether the line is a pattern to copy or a trap to avoid. Examples from lecture 49:
  - `// ✖️ reads initialCount **ONCE** during creation` — a trap; the line is shown to warn against it.
  - `// ✔️ creates a continuous, **REACTIVE** relationship` — the recommended pattern.
  - `// ✖️ mutating state here is a **COMPILE ERROR**` — a trap with the specific consequence called out.
- **`**CAPS**` for the single load-bearing word.** Wrap the one keyword that carries the lesson in bold-uppercase. The highlighter renders `**REACTIVE**` as `<b>REACTIVE</b>` — bold, in a darker grey (`#374151`) than the surrounding comment text. Use this for the term the reader must take away from the line: **REACTIVE**, **DEAF**, **READ-ONLY**, **WRITABLE**, **LOCALLY**, **SAVE**, **REVERT**, **ONCE**, **SOURCE**, **FLOW**, **LOGIC**, **UPSTREAM**, **CLONED**, **COMPILE ERROR**. One per comment, occasionally two — never a whole sentence in caps.
- **Numbered steps inside a single snippet.** When a code block shows a sequence of operations (the optimistic-UI example in lecture 49 is the demo), prefix each comment with its step number: `// 1. optimistic override: increment **LOCALLY** immediately`, then `// 2. tell the server to **SAVE** the change`, then `// 3. rollback: ...`. The numbers survive into the rendered comments, giving the reader a clear path through the snippet.

**Long comments wrap automatically.** When a code-plus-comment line exceeds the editor width, the highlighter splits the comment across two visual rows. The first row shows the code and the start of the comment with the `➔` arrow; the second row shows the remainder of the comment with a *transparent* (invisible) `➔` placeholder that keeps the comment column aligned. The author does not control this — it happens in the build. If a comment is so long that even the wrap looks awkward, shorten the comment; the code block is not the place for paragraphs.

**What comments are NOT in this project:**

- **Not collapsible.** Every comment always renders. If a comment is not pedagogically necessary, delete it; do not leave it "for completeness."
- **Not links or code.** Inline `` `code` ``, `[links](url)`, and `*italic*` are not parsed inside comments. Only `**bold**` is supported. If you need to reference an identifier inside a comment, write it as plain text (optionally in CAPS if it is the load-bearing word).
- **Not for section narration.** If a comment needs more than one short sentence, the explanation belongs in the prose around the code block, not inside the code. Comments annotate lines; prose explains snippets.

### Token classes produced by the highlighter

The highlighter classifies code tokens into five color classes. The author does not control these — they are derived from the source. Listed so the author knows what to expect:

- **`.kw`** (deep magenta `#93275a`) — JavaScript keywords: `let`, `const`, `function`, `return`, `if`, `else`, `for`, `while`, `new`, `class`, `extends`, `this`, `await`, `async`, `import`, `export`, `from`, `try`, `catch`, `throw`, `typeof`, `instanceof`, `in`, `of`, `true`, `false`, `null`, `undefined`, `break`, `continue`, `switch`, `case`, and the rest of the standard keyword set.
- **`.fn`** (teal `#156a64`) — identifier followed by `(` (with optional whitespace between), e.g. `createClapButton()`, `push(`, `console.log(`.
- **`.nl`** (magenta `#93275a`) — number literals: `0`, `42`, `3.14`.
- **`.str`** (green `#1a7d2e`) — string literals in `"double"`, `'single'`, or `` `template` `` quotes.
- **`.rune`** (orange `#c2410c`) — Svelte 5 runes: `$state`, `$state.raw`, `$state.snapshot`, `$state.eager`, `$derived`, `$derived.by`, `$effect`, `$effect.pre`, `$props`, `$bindable`, `$inspect`, `$host`.

Plain identifiers (variable names, property accesses) are rendered in the default ink color with no span.

### Example (source and result)

**Source Markdown** in `md-lectures/NN.md`:

````markdown
```svelte title="App.svelte"
<script>
  let count = 0;

  $: double = count * 2; // Reactive declaration of variable "double"
  $: console.log('Count updated:', count); // Reactive statement (with side-effects)

  $: {
    if (count > 10) {
      alert('Threshold reached'); // Reactive block (multiple lines)
    }
  }
</script>
```
````

**Rendered HTML** (what the build script produces, simplified):

- A `<figure class="codeblock editor">` block
- An editor chrome bar with three dots and an `App.svelte` filename tab
- Eight numbered rows with zebra striping
- `let`, `if` styled magenta (keywords); `$:` left plain (not a rune); `console.log`, `alert` styled teal (function calls); `0`, `2`, `10` styled magenta (number literals); `'Count updated:'` and `'Threshold reached'` styled green (strings)
- The three `// ...` comments rendered as `→ Reactive declaration of variable "double"`, `→ Reactive statement (with side-effects)`, and `→ Reactive block (multiple lines)` in the muted-grey sans-serif comment style

The arrow `→` and all `<span>` tags are produced by the build script. The author wrote only `//` comments and plain code.

### Supported languages

`svelte`, `js`, and `javascript` all use the same JS/Svelte highlighter. There is no language-specific branching; if you need Python, CSS, or another language tokenized differently, that requires extending the highlighter in `src/build-lectures.mjs` (add a new tokenizer branch keyed on the fence language).

### Known limitations

- **Template literals with `${}`**: a template string like `` `Hello ${name}` `` is treated as one string token. The `${name}` part is not separately highlighted as an identifier. Acceptable for typical lecture snippets; document long template literals in prose if the interpolation matters.
- **Regex literals containing `//`**: rare in Svelte 5 teaching material. The "followed by space or EOL" rule protects most cases, but a regex like `/foo//bar/` would mis-tokenize. Avoid regex literals with `//` in lecture code.
- **Block comments `/* ... */`**: not currently supported. Multi-line block comments are rendered as plain code (no `.cmt` styling). Use `//` per-line comments in lectures — they produce the arrow aesthetic and align with the rest of the design system.
- **No syntax highlighting inside the card pipeline.** This highlighting applies only to lecture fenced code blocks. Cards use the minimal `<pre><code>` style defined in the card CSS; do not expect the same editor treatment there.

## Card Format Spec

The card pipeline uses the same constrained Markdown subset as `online-demo-01`. The constraints exist because the card parser is minimal and intentional; violating them produces silent mis-renders or, in one case, an out-of-memory crash.

**File structure (in this exact order):**

- **Title line:** `## Q{number} — {Short Title}` — the question header. Always starts with `## Q` and an en-dash separator.
- **Tags line:** `@tags Topic1, Topic2, Subtopic3` — comma-separated chips that the renderer turns into tag pills. Three to five tags is typical.
- **Blank line, then the question:** `**Question.** {the full question text, one continuous line, never hard-wrapped.}`
- **Blank line, then the answer:** `**Answer.**` on its own line, then the answer body structured per the "Answer body format" rules below.
- **Blank line, then the code block:** a fenced ` ```svelte title="App.svelte" ` (or ` ```js `) block with a real, runnable example.
- **Blank line, then the diagram placeholder:** an empty `<div class="dg" style="..."></div>` block. Required by the parser as an anchor; the actual diagram content is injected from `diagrams/{number}.html` at build time.
- **Blank line, then the summary:** `> **Summary.** {one continuous line, never hard-wrapped, distilling the takeaway.}`

**Answer body format (mandatory for all new cards):**

- **Use bullet points, not prose paragraphs.** The answer body is a list of `- ` bullets, grouped under bold-titles.
- **Group with bold-titles, never markdown headers.** Each group starts with a standalone line of bold text: `**The mechanism — what happens on every write**` on its own paragraph, immediately followed by the bullet list for that group.
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
- **Fenced code blocks must be closed.** Every ` ``` ` opener needs a matching ` ``` ` closer.

## Data-Flow Format Spec

The data-flow pipeline uses the same full Markdown renderer as lectures (`src/build-lectures.mjs`), so every formatting feature available to lectures — bold, italic, bullets, inline code, fenced code blocks with `title=`, blockquotes, links — is available here too, with one structural exception noted below. The data-flow file is *not* a second lecture: it does not re-teach how the mechanism works. It teaches **where the mechanism belongs** in a real component tree, and *why one placement beats another*. The lecture already carries the depth; this file carries the spatial reasoning.

**File structure (in this exact order):**

- **Title line:** `# Data Flow {n}: {Short Title}` — for example, `# Data Flow 49: Where `$derived` Belongs in the Product Tree`. Used exactly once, as line 1.
- **No interview-question line.** The `> INTERVIEW QUESTION |` blockquote is a lecture-pipeline convention; do not put it here. The data-flow file has its own framing paragraph (below) instead.
- **Framing paragraph:** one short paragraph (never hard-wrapped) stating which ElectroShop interaction this file maps the concept onto. It names the concrete scenario (e.g. "applying a VIP discount to a price") in ElectroShop terms, and points back to the lecture by number for the mechanism itself: `(see Lecture 49 for how $derived works)`.
- **The A/B/C body:** three sections in fixed order, headed `### A) The Technical Svelte Information`, `### B) Large Scale Data Flow Context`, `### C) Nuanced Small Scale Data Flow`. The exact wording of these three headers is load-bearing — they match `docs/component_data_flow.md` and the prototype, and a consistent header set is what makes the atlas scannable across 210 files.
- **Closing reasoning section:** headed `### Why this placement`, this is where the file earns its keep. It asks "why not one tier up or down?" and answers concretely (see the prototype's "How This Elaborates the Lecture's Point" for the model). Two to four numbered points.

**The A/B/C sections, in detail:**

- **`### A) The Technical Svelte Information`** — a short, mechanism-level paragraph restating *the rune or feature the lecture taught*, in the minimal form needed for the placement argument. This is a callback, not a re-teach. State the rune, what it tracks, and what triggers recalculation — do not re-derive the whole mechanism. If the lecture covered it, point there: `(mechanism explained in Lecture 49)`.
- **`### B) Large Scale Data Flow Context`** — exactly one blockquote showing the full path from `ElectroShopApp` down to the component where the concept lives, using the `➔` arrow and backticked component names. Mark the component where the interception/placement happens in **bold**. Format, verbatim:
  ```
  > `ElectroShopApp` (Holds global VIP Status) ➔ `ShopLayout` ➔ `ProductGrid` (Holds raw Products) ➔ **`ProductCard`** (Where interception occurs) ➔ `PriceBlock` (Displays final price)
  ```
  A parenthetical after each backticked name says what that tier holds or does. One line, never hard-wrapped.
- **`### C) Nuanced Small Scale Data Flow`** — exactly one blockquote zooming inside the **bold** component from section B. It traces the journey of one specific variable from prop arrival, through the rune, into the child that consumes it. Same `➔` arrow and backtick conventions. Mark the rune or the interception point in **bold**. Format, verbatim:
  ```
  > `ProductGrid` (passes raw `product` object as prop) ➔ `ProductCard` (receives `let { product, isVIP } = $props()`) ➔ **`$derived.by(() => { ... })`** (logic before the return) ➔ `PriceBlock` (receives `finalPrice`)
  ```

**Flow-path conventions (apply to both B and C blockquotes):**

- **Arrow glyph is `➔`** (U+2794, the heavy rightwards arrow the project already uses for code comments). Do not use `->`, `→` (U+2192), or `=>`; they break the visual consistency with the rest of the project.
- **Component and identifier names are backticked**: `` `ProductCard` ``, `` `product` ``, `` `$props()` ``.
- **One flow path per blockquote, on one continuous line.** Never hard-wrap; if a path is long, abbreviate intermediate tiers rather than breaking the line.
- **Bold marks the load-bearing element.** In B, bold the component where the concept lives. In C, bold the rune or the specific line where data is intercepted/transformed.
- **The B and C paths must be consistent** — the component bolded in B is the same component the C path zooms inside. The child named at the end of B is the same child that receives the result at the end of C.

**Faithfulness rules (the prototype is a template, not a source of truth):**

- **The rune and the mechanism must match the lecture, exactly.** If `md-lectures/{n}.md` teaches plain `$derived`, the data-flow file shows `$derived` — never `$derived.by`, `$bindable`, or a callback form. The prototype file `docs/component_flow_lecture_49.md` illustrates `$derived.by` with a VIP-discount scenario; that is an *illustration of the format*, not faithful content for Q49. Re-use the A/B/C structure and the flow-path conventions; do not lift the prototype's rune, example, or wording.
- **Re-cast the lecture's example into ElectroShop.** Even when the lecture's running example fits another domain (Q49's `Post`/`likes` is MyTube-flavored), the data-flow file restates it in ElectroShop terms before mapping it onto the tree. Find the ElectroShop component that plays the same role: `Post`/`likes` → `ProductCard`/`wishlistCount`; `VideoCard`/`views` → `ProductCard`/`reviewCount`. The re-cast must preserve the lecture's actual mechanics, not invent new ones.
- **The placement argument must be genuine.** The closing `### Why this placement` section must give a real architectural reason for the chosen tier — not a restatement of the mechanism. "Doing it in `ProductGrid` would re-loop the whole array on every VIP toggle; doing it in `PriceBlock` would put business logic in a presentational component; `ProductCard` is the middle tier that intercepts cleanly" is the model. If you cannot articulate why the placement matters, the concept may not need a data-flow file yet.

**Numbering and cross-reference:**

- Data-flow file `{n}.md` corresponds to question `{n}` and lecture `{n}`. The numbering matches `md-lectures/{n}.md`, `md-cards/{n}.md`, `md-design/{n}.md`, and `diagrams/{n}.html` exactly, so any artifact cross-references by number: `(see Lecture 49)`, `(see Q49)`.
- Point back to the lecture for mechanism depth, and forward to the card for the review form. Never duplicate the lecture's prose or the card's bullets — the data-flow file's contribution is the placement reasoning, which neither other artifact carries.

## Why the lecture-first order exists

The lecture is the comprehensive source for a question; the card is its distilled review form. Writing the card first forces the author to compress before they have explored, which tends to produce shallow bullets that name the mechanism without teaching it. By writing the lecture first — driven from the local Svelte documentation and supplementary research — the author builds a complete mental model, and the subsequent card becomes a genuine distillation of that model rather than a guess at what matters. The lecture is also where unfamiliar terminology gets unpacked; the card inherits the same terms, already defined, and trusts the reader to recall the lecture for depth.

## Where to look for related context

- `online-demo-01/instructions.md` — the sibling project whose card pipeline this project mirrors. The card format spec above is intentionally identical.
- `online-demo-01/md-card/46.md` — a reference exemplar of the bulleted-answer card format with inline jargon definitions. Use it as a template when in doubt.
- `img-instruction/005.md` — the design system that decides how every diagram looks and how images are generated.
- `documentation 2026 June/svelte-docs/` — the primary source for lecture content.
- `docs/component_data_flow.md` and `docs/component_language.md` — the primary sources for the data-flow pipeline: the fixed ElectroShop component tree, the component-relationship shorthand, and the A/B/C multi-scale structure every `md-data-flow/` file follows.
- `docs/component_flow_lecture_49.md` — the data-flow prototype. Use as a *format* template only; its `$derived.by` VIP-discount scenario is not faithful to Q49 (see the Data-Flow Format Spec's faithfulness rules).
- `docs/` — local project documentation. Currently contains `CODE-BLOCK-VISUAL-FIX.md`, a detailed brief for a separate AI tool (Antigravity) brought in to close the visual gap between this project's code blocks and the Pencil book reference. Read this if working on code-block styling.
- **Screenshots folder** (outside the project, on disk): `/Users/techton/Images/CleanShotX/` — CleanShot X saves every screen capture here, newest first by filename timestamp. Use this folder to find before/after comparisons when iterating on visual output. Files are named `CleanShot YYYY-MM-DD at HH.MM.SS@2x.png`.

## Visual reference for the Pencil book design

The lecture pipeline's code-block presentation is meant to mimic the visual style of the Pencil book at `/Users/techton/lechton/research-code/svelte dev 2026/Pencil/`. The canonical references are:

- `Pencil/styles/figure-03.css` — the source-of-truth stylesheet for the editor code-block look.
- `Pencil/cards 05/04_extra_javascript_1/01-prototype/card.html` — a hand-curated example of the editor HTML structure.
- `Pencil/book/out/04_extra_javascript_1.pdf` — the full reference chapter in PDF form.

These files are **reference only** — never modify them. When matching the look, copy values inline into `src/lecture.css`; do not link to or import the Pencil CSS.

**Important limitation**: the ZCode client cannot display images to its model. When iterating on visual output, either (a) describe the gap in plain language, (b) hand the work off to a tool that can read images (see `docs/CODE-BLOCK-VISUAL-FIX.md`), or (c) compare the rendered HTML structure and CSS values against the reference directly without relying on screenshots.
