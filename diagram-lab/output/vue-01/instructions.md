# Vue.js Interview Lecture Series: Project Instructions (vue-01)

This document is the single source of truth for the workflow of the `vue-01` project inside `diagram-lab/output/`. Every question in the bank is taught as one long-form lecture: the lecture is the source of truth for depth, written first, built into HTML and PDF by the scripts in `src/`. The topic is interview readiness for **Vue.js without Nuxt.js** in three tracks: Core Reactivity & Composition API, Component Architecture & Templates, and Application Architecture, State Management & Routing. The design benchmark and the origin of every inherited law is the sibling project `../css-01/` and `../accessibility-01/`; the dated decision journal lives in `briefs/` (read `2026_09_15_01` onward).

## Primary Pedagogical Benchmark: The "Headache & Short Attention Span" Standard

Before writing any lecture prose, authors must internalize this primary benchmark. Every paragraph in this curriculum must be written directly for a tired developer with a splitting headache and a short attention span. Use clear CEFR B2 vocabulary, short active sentences averaging 12 to 18 words, and concrete physical elements. Never make the reader re-read a sentence to parse its meaning.

### ❌ HOW YOU SHOULD NOT WRITE (Academic Throat-Clearing & Dense Overload)
> When evaluating client architecture, web applications exist on a wide spectrum between static documents and interactive software. In a conventional client-side Single-Page Application, often abbreviated as an SPA, the browser downloads an essentially empty HTML skeleton containing only an empty root container alongside a script tag. The browser engine cannot display meaningful text or interactive elements until the entire JavaScript bundle traverses the network, completes V8 engine compilation, and executes its client-side mount. On mobile devices with high network latency, this architecture forces the user to wait through a blank white screen or a spinning progress indicator for seconds.
>
> To overcome this blank screen delay, teams adopt Server-Side Rendering, widely known as SSR. Under this paradigm, a Node.js server executes the Vue application before sending the response, runs initial data fetching, and renders the component tree directly into a fully formed HTML string. The server transmits this completed markup over HTTP, allowing the browser's native layout engine to parse the HTML document and paint typography, banners, and layout structures almost instantly.

*(Why this fails: Abstract preamble, sentences spanning 28+ words with chained dependent clauses, academic Latinate vocabulary, and high cognitive friction for a tired reader).*

### ✅ HOW YOU SHOULD WRITE (Punchy B2 Clarity & Concrete Physical Reality)
> In a standard **Single-Page Application (SPA)**, the browser downloads an almost empty HTML file. Inside, there is only a blank `<div id="app"></div>` and a script tag. The browser cannot show any text until it downloads and runs your entire JavaScript bundle. On a slow mobile connection, the user stares at a blank white screen for seconds.
>
> **Server-Side Rendering (SSR)** solves this waiting problem. Instead of sending an empty page, a Node.js server runs your Vue app and builds complete HTML text first. The server sends this finished markup directly over the network. Because the text and layout are already in the HTML, the browser paints headlines, images, and articles right away.

*(Why this succeeds: Zero throat-clearing, short sentences averaging 12 to 16 words, tangible DOM elements, and clear problem-to-solution progression that requires zero re-reading).*

###  Benchmark 2: ALWAYS take the reader by the hand, use Conversational tone + Concept Building + carefully Isolating Counter-Intuitive Mechanics (The "Take By The Hand" Standard)

You must master the craft of explaining counter-intuitive technical mechanisms by guiding the reader step-by-step. Never drop an abstract concept like "hydration" like a bomb into a sentence without gradual conceptual preparation. Dissect the mechanism into distinct physical phases, use a warm conversational tone, ask the guiding question, and repeat the core term naturally so that even a sleepy developer can follow through effortlessly, without sacrificing technical depth.

#### ❌ BAD EXAMPLE (Dropping Complex Jargon Abruptly & Inverted Sequence)
> In an SSR app, the browser entry file must use createSSRApp(App).mount('#app'). This method tells Vue to run in hydration mode. Instead of wiping out the HTML, Vue reuses the existing DOM nodes and attaches event listeners. On the server side, Node.js imports renderToString from vue/server-renderer components into raw HTML strings.

*(Why this fails: Drops "hydration mode" abruptly without context, reverses the physical timeline by leaping to the browser entry before explaining the server render, uses dry robotic prose, and forces a tired reader to guess why static HTML needs "hydrating").*

#### ✅ GOOD EXAMPLE (Conversational Tone, Gradual Unpacking & Technical Depth)
> Notice that Server-Side Rendering in Vue actually happens in two distinct steps: first, the **static markup** loads, and then the **interactivity activates**. This crucial second step, when our app becomes interactive, is called hydration. During the first step, the server uses `renderToString` (from vue/server-renderer) to convert your Vue components into a string of fully formed HTML, delivering it directly to the browser. While this ensures an incredibly fast initial page load, the resulting markup is entirely static. It still lacks interactivity. The user can immediately see the UI, but there aren't any active buttons yet because the HTML cannot respond to user interactions. So, how do we load the interactivity and not merely the visual text? In other words, how does hydration actually take place?
>
> **`createSSRApp()` instead of `createApp()`**: To bring the app to life, the browser entry file must initialize Vue using `createSSRApp(App).mount('#app')` instead of the standard `createApp()`. This specific method activates hydration mode, allowing Vue to seamlessly take over the static HTML sent by the server. Rather than wiping out and re-rendering the existing DOM, hydration preserves the visible elements already on the screen. Vue simply traverses the existing markup and attaches the necessary event listeners and reactivity system, converting those static nodes into a live, fully interactive client-side app.

*(Why this succeeds: Exceptional conversational tone that takes the reader by the hand. It separates the two distinct physical steps (static markup vs activating interactivity), isolates the counter-intuitive concept of hydration, and builds the question before revealing the API. It repeats the term naturally so a sleepy reader absorbs it easily, while preserving 100% of the underlying DOM traversal and event attachment mechanics).*
====


### The "Take By The Hand" Standard: in more detail

Py close attention to the previous text (Benchmark 2), this text will be the golden standard model of your writing, we can find there these pinriples

**1. Chronological Architecture (The Timeline Rule)**
Technical explanations must follow the physical execution timeline. If the server does something before the browser, the explanation must cover the server first. Do not reverse-engineer the explanation by starting with the final API and working backward.

**2. Concept Before Jargon (The Scaffolding Rule)**
Never drop a complex term (like "hydration") without first explaining the physical reality it describes (e.g., "loading interactivity into static markup"). Establish the problem the user or browser faces *before* introducing the API that solves it.

**3. Conversational Empathy (The Cognitive Load Rule)**
Assume the reader is tired. Use conversational transitions ("Notice that...", "So, how do we...?") to pull them through the text. Repeat core concepts naturally rather than relying on the reader to memorize a definition from three sentences ago.

**4. Uncompromised Technical Depth**
Being conversational does not mean dumbing down the content. The explanation must still contain 100% of the accurate, underlying mechanics (e.g., DOM traversal, event attachment, exact API method names).

**5. Clarity Over Brevity (The Length Follows Clarity Law)**
The length of a section is never a constraint. Exceeding the standard or "proper" length of text is explicitly allowed and encouraged as long as it secures greater clarity. Between a "proper length" of text and more clarity, we ALWAYS prefer more length if it adds more clarity. Never truncate, compress, or rush an explanation to fit an arbitrary section or word budget.

**6. Surveillance Against Poisonous Documentation Jargon (Function First, Jargon in Parentheses)**
BEWARE: Official documentation itself is riddled with poisonous jargon (such as *singleton*, *factory function*, *memoization*, *idempotency*, *polymorphism*, *re-entrancy*). Authors naturally treat official docs as authoritative truth and copy these terms uncritically into prose as if they explain something. To a tired reader, they form an exclusionary jargon wall. Never use documentation jargon as a standalone explanation, subject, or bare predicate. Always state the concrete physical function or runtime behavior first, and only then write the jargon term in parentheses (e.g., "Node keeps only a single shared copy of that object alive in server memory for all visitors (a pattern known as a **singleton**)").


### The "Take By The Hand" Standard:  The Quality Assurance Checklist

Use this checklist to evaluate technical paragraphs before finalizing them:

#### Structure & Sequencing

* [ ] **Is the chronological order correct?** (Example: Does the explanation move linearly from Server ➔ Browser ➔ User Interaction in careful and slow and easy to follow narration?)
* [ ] **Are distinct phases clearly separated?** (Example: Are concepts like "rendering text" vs. "activating interactivity" clearly divided into steps?)

#### Pedagogy & Jargon

* [ ] **Is the problem established before the solution?** (Does the text explain *why* static HTML is an issue before revealing `createSSRApp()`?)
* [ ] **Is jargon defined by its real-world effect?** (e.g., Defining hydration as "when the app becomes interactive", at least two different times, rather than just a "Vue mode".)
* [ ] **Are poisonous documentation jargon terms written function-first with the term in parentheses?** (e.g., Writing "keeps a single shared copy in server memory for all visitors (a pattern known as a singleton)" instead of bare "becomes a singleton".)
* [ ] **Are questions used as transitions?** (Does the text use a guiding question like "So, how does hydration take place?" to bridge concepts?)

#### Tone & Cognitive Load

* [ ] **Is the tone conversational and empathetic?** (Does it read like a senior developer mentoring a junior over a coffee, rather than a robotic manual?)
* [ ] **Are key terms naturally repeated?** (Is the core concept reinforced without sounding robotic, accommodating a distracted reader?)

#### Technical Integrity

* [ ] **Are the underlying mechanics explicitly stated?** (e.g., DOM traversal, event listeners, preserving nodes rather than destroying them).
* [ ] **Are the exact APIs and module names correct?** (e.g., Explicitly naming `createSSRApp(App).mount('#app')` and `vue/server-renderer`).

=====

### Benchmark 3: The Goldilocks Principle of Technical Depth (Neither Jargon Blizzard Nor Baby Talk)

When explaining advanced engine internals, authors constantly face two opposite failure modes: dumping dense compiler jargon without explanation, or stripping away technical terms completely into condescending baby-talk. Authors must hit the precise middle: keep 100% of the exact technical terms, but ground them immediately in elementary programming primitives and physical operational realities.

#### ❌ BAD OPTION 1: The Jargon Blizzard (Robotic Textbook Overload)
> When a visitor requests a page, Vue executes a specialized, stripped-down render routine. The template compiler generates fast string concatenation helpers instead of creating virtual nodes. It completely bypasses the creation of in-memory Virtual DOM trees.

*(Why this fails: High cognitive friction. It dumps five compiler concepts in two sentences without context. It never explains why the server would want to bypass the Virtual DOM, never defines what a "string concatenation helper" actually is, and forces a tired reader to re-read multiple times).*

#### ❌ BAD OPTION 2: The Baby-Talk Trap (Dumbing Down & Loss of Technical Rigor)
> To make the server fast, Vue runs a clever shortcut: it skips the Virtual DOM completely. Instead of making objects, it just stitches text together. It glues HTML tags and text variables directly into one long string, using almost zero memory.

*(Why this fails: Dumbs down the curriculum. It strips out precise engineering terms like "string concatenation", "Virtual DOM nodes (VNodes)", and "object allocation". A senior developer cannot say "Vue glues text together" in a technical interview without sounding like a novice. It robs the candidate of professional technical depth).*

#### ✅ PROPER OPTION: The Masterclass Standard (Grounded Intuition + Exact Technical Terms)
> On the server, Vue's job is completely different from its job in the browser.
>
> In the browser, Vue must act as an interactive engine. It creates a **Virtual DOM** (a tree of JavaScript objects in memory) so it can watch for user clicks, calculate differences, and update the screen. But on the server, there is no screen, there are no user clicks, and there are no state updates. The server has only one single goal: turn your component into a plain text string of HTML and send it down the network wire.
>
> Does Node.js really need to build a heavy tree of Virtual DOM objects just to produce a piece of text? No. Building thousands of temporary JavaScript objects for every single HTTP request would quickly choke the server's memory. Instead, Vue's server compiler uses **direct string concatenation**.
>
> What does **string concatenation** actually mean here? In basic JavaScript, concatenation simply means joining pieces of text together with plus signs, like `'Hello ' + name`. Vue's server compiler does the exact same thing with your templates. Instead of allocating complex virtual node objects, it transforms your template into code that literally joins HTML tags and variables together into a single text string: `'<h1 class="headline">' + headline.value + '</h1>'`.
>
> By relying on **direct string concatenation**, Vue completely bypasses the Virtual DOM on the server. Node.js never has to allocate in-memory trees or track reactive dependencies. It simply assembles strings and streams the finished HTML response at lightning speed.

*(Why this succeeds: Zero cognitive friction and zero technical degradation. It contrasts the browser's need for an interactive engine against the server's need for plain text, grounds the advanced term "string concatenation" in elementary JavaScript (`'Hello ' + name`), shows the literal code output, and retains every rigorous technical term: Virtual DOM, object allocation, template compiler, and string concatenation).*

---

### The Goldilocks Standard: Core Principles & Quality Assurance Checklist

#### 1. The Purpose Contrast Rule
Never explain an optimization in isolation. First establish the conflicting physical environments: what the browser needs (an interactive engine to diff and patch) versus what the server needs (an HTTP stream of plain text).

#### 2. The Elementary Code Anchor Rule
Whenever introducing an abstract compiler or architectural term (such as "string concatenation", "proxy interception", or "bitmask matching"), immediately anchor it to an elementary JavaScript primitive (such as `'Hello ' + name`, a getter/setter trap, or binary `&`) before showing the framework-level implementation.

#### 3. The Object Allocation & Garbage Collection Anchor
Technical explanations must ground performance arguments in physical runtime penalties. Explain that allocating thousands of short-lived JavaScript objects triggers severe V8 garbage collection overhead and memory exhaustion on a multi-tenant Node.js server.

#### Quality Assurance Checklist for Benchmark 3:
* [ ] **Does the text avoid the Jargon Blizzard?** (Are compiler terms prevented from piling up without immediate context?)
* [ ] **Does the text avoid Baby Talk?** (Are exact terms like "Virtual DOM", "string concatenation", and "object allocation" retained?)
* [ ] **Is the term anchored to a basic language primitive?** (Is the concept explained using fundamental JavaScript syntax that every junior knows?)
* [ ] **Is the runtime purpose contrasted?** (Is the difference between browser execution and server generation made visceral?)
* [ ] **Is the physical machine penalty stated?** (Is the memory/CPU consequence on Node.js explicitly linked to the mechanism?)

=====


## File structure and logic

```
vue-01/
├── instructions.md        <- this file, the project's law
├── AUTHOR-BRIEF.md        <- the compact per-lecture brief you paste into a writing model
├── PEDAGOGICAL-CLARITY.md <- the permanent teaching standard (insightful guide, lexical baptism, physical wall)
├── FIGURE-DESIGN-SYSTEM.md<- visual pattern catalog for Vue figure components
├── AUDIT-CHECKLIST.md     <- the mandatory operational audit checklist
├── 00_COVER.html          <- Prince-ready cover page
├── 00_TOC.md              <- table of contents
├── briefs/                <- the dated decision journal (YYYY_MM_DD_NN_<title>.md)
├── md-lectures/           <- THE SOURCE OF TRUTH: one lecture markdown per question, written first
│   └── figures/           <- standalone HTML/CSS figure components embedded via html-figure
├── md-lectures-html/      <- build output: {n}.html plus deck.html (course reader); never edit by hand
├── md-lectures-pdf/       <- build output rendered by Prince; never edit by hand
├── src/
│   ├── build-lectures.mjs <- reads md-lectures/, writes html and pdf folders, enforces the gates
│   ├── vue-figure.mjs     <- parses ```figure blocks into the Vue Figure panel
│   ├── lecture.css        <- the long-form article stylesheet shared by html and pdf
│   ├── build-toc.py       <- TOC generator
│   └── build-book.py      <- PDF compilation script
└── various/               <- reference material (demo UI, design instructions, consultations)
```

➔ **md-lectures**: the comprehensive lecture source markdown files, the source of truth.  
❯ **md-lectures-html**: the html files of the lectures, generated from `/md-lectures`.  
❯ **md-lectures-pdf**: the pdf files of the lectures, rendered by PrinceXML from the html files.  

When the user asks "write the lecture for question 09" you start from `md-lectures/09.md` and the matching row in the question bank. There is no plan phase and no approval gate: the question bank row is the plan. The Question column fixes the topic, the Hook column is the seed of the opening scenario, the Topic tag fixes the scope. Read the row, then write the lecture directly.

## The question bank

- **Location:** `../../questions-vue/questions.md`, with the controlled topic vocabulary in `../../questions-vue/topics.md` and the design rationale in `../../questions-vue/README.md`.
- **Format:** every question is a row with five columns: `# | Tier | Topic | Question | Hook`. The number is the stable ID and the lecture filename. The Tier is `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`. The Question is written in interview register and becomes the `> INTERVIEW QUESTION` line of the lecture. The Hook is the pain-point seed of the Opening Ladder: grow it, never replace it.
- **Bank growth:** the bank grows from audits of the local corpus. Never invent a lecture without a bank row; if a topic is missing, add the row to the bank first, then write the lecture. Once the bank is approved its numbers freeze; later growth appends a new tranche, never renumbers.

## Sources of truth

- **Corpus Location:** `documentation official/vue/` (supplemented by standard web specifications in `documentation official/`).
- **Authority hierarchy when sources disagree:** Vue Core implementation code and official RFCs first (`resources/core/vue-core/`, `resources/rfcs/vue-rfcs/`), then official documentation (`resources/docs/vue-docs/`, `resources/router/vue-router/`, `resources/state/pinia/`), then published books, then practitioner sources, and interview cheat sheets never.
- **Normative versus informative:** quote the Vue core source code, type definitions, or RFCs when the claim is about the internal engine implementation (e.g. Proxy handlers, reactive effect scheduling, patch flag bitmasks, Virtual DOM diffing); quote official documentation when the claim is about developer API contracts and best practices.
- **Primary anchoring:** every lecture anchors its central technical claims to the corpus.
- **Freshness:** strictly focus on modern Vue 3 (Composition API, `<script setup>`, Vite, Pinia, Vue Router 4). Options API is addressed for migration and interview comparison context, but modern architecture defaults to pure Composition API. Nuxt is deliberately excluded: all routing, state, and rendering are deconstructed from core Vue principles.

### The quoting law

Every lecture must contain at least one verbatim quote from an authoritative source, cited by its corpus path. The build warns when a lecture carries no citation path, and the warning is a defect you must repair.

- **Quote shape:** a markdown blockquote holding the exact words, followed by an attribution line naming the source and the citation path in backticks. For example:
```
> The reactivity system in Vue 3 is built on top of JavaScript Proxy objects. A Proxy wraps another object and intercepts operations like property access and assignment.
*Vue 3 Official Documentation (Reactivity in Depth), `resources/docs/vue-docs/src/guide/extras/reactivity-in-depth.md`*
```
- **Authoritative sources only (No books directly):** You are invited to cite primary authoritative sources like Vue Core source files, RFCs, and official documentation. **Never quote or cite from books directly** in the lecture text; books exist solely for background research and context, never as reader-facing citations.
- **Verbatim means verbatim:** copy the source's exact wording from the local file; never paraphrase inside quote marks.

## The HTML Figure Architecture & Visual Design Language

Every lecture contains high-impact visual aids authored as standalone HTML/CSS components in `md-lectures/figures/` and referenced via `html-figure` blocks. This ensures real HTML elements styled with real CSS rules, rendered natively by PrinceXML into publication-grade PDF graphics.

### Authoring Syntax & Pipeline

A figure is embedded in lecture markdown using the `html-figure` fence:

````markdown
```html-figure src="md-lectures/figures/01-01-proxy-reactivity-trap.html" caption="The ES6 Proxy intercepts property access via the get trap to register dependencies, and mutation via the set trap to trigger subscribers."
```
````

- **File Naming Convention:** Every figure file must live in `md-lectures/figures/` and follow the systematic two-part numeric schema: `{lecture_num:02d}-{figure_seq:02d}-{descriptive-slug}.html` (e.g. `01-01-proxy-reactivity-trap.html`, `02-01-ref-unwrapping-geometry.html`).
- **Automated Captioning & Numbering:** The build script (`build-lectures.mjs`) reads the external HTML file, wraps it inside a `<figure class="vue-figure">` container, injects auto-numbered `<figcaption>Fig {lecture}.{n}: {caption}</figcaption>`, and enforces global page-break isolation.
- **Standalone CSS Scoping:** Each figure file includes an embedded `<style>` block scoped to its container class (e.g. `.fig-proxy`, `.fig-vdom-patch`, `.fig-pinia-flow`). PrinceXML renders standard CSS natively (flexbox, borders, shadows, transforms, SVG overlays). JavaScript and external Tailwind CDNs are strictly banned.

### The Visual Design Language: Modern Figure Design System

Authors are strictly **mandated** to adhere to the Figure Design System codified in `FIGURE-DESIGN-SYSTEM.md`. Every figure MUST select, clone, and adapt from one of the proven Figure Archetypes:

#### The "Never Text-Only" Law (The Anti-Ugly Gate)
A figure card is an illustration of spatial, temporal, mechanical, or physical reality. Wrapping plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without an authentic graphical substrate is STRICTLY FORBIDDEN. Every figure MUST feature real graphical substrates: Proxy trap pipelines, reactivity dependency graphs with connector circles, realistic component hierarchy trees with data flow arrows, compiler AST-to-render function transforms, or Pinia store state dispatch matrices.

#### Strict Canonical Shell & Color Standards:
- Container: `.print-fig` with `border: 2px solid #0f172a`, `border-radius: 6px-8px`, pure white card containers, `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06)`.
- Palette: Primary Emerald/Vue Green `#059669` / `#10b981`, Accent Teal `#0e7490`, Secondary Crimson `#9f1239`, Neutral Slate `#1e293b` / `#0f172a`.
- Zero Platform Emojis: Never use raw yellow system emojis (`🔒`, `✓`, `✕`); always use inline SVG icons or monochrome unicode glyphs.
- Anti-Collision Spacing: Metric tables inside cards must use short keys with explicit `gap: 8px` and `white-space: nowrap`.
- Height Budget: Total figure height must strictly respect ~380px–420px to prevent multi-page fragment splits.
- Typography Floor and Formatting Integrity: Strict $\ge 11.5\text{px}$ floor on all text, dimensions, and timeline labels. Code inside nodes must be cleanly formatted on dedicated lines to prevent awkward hyphenated line-breaks.

### The Two Content Archetypes: Comparative versus Illustrative Figures

#### Archetype 1: Comparative Figures (The Duel / Tournament)
- **When to Use:** When evaluating state bugs vs solutions, Options API vs Composition API, naive destructuring vs `toRefs()`, or broken reactivity vs correct reactive wrapping (`ref vs reactive`, `Wrong vs Right`).
- **Visual Structure:** Symmetrical side-by-side cards (`.preview-card`), comparison header pills (`✕ BROKEN` vs `✓ REACTIVE`, or `✕ WRONG` vs `✓ RIGHT`), and matching diagnostic footer strips.
- **Rules:** Enforce strict visual symmetry: identical line counts in header pills, identical card padding, matching 2-line footer heights (`min-height: 52px;`) wrapping cleanly at semicolons.

#### Archetype 2: Illustrative Figures (The Textbook Anatomy / Code Realization)
- **When to Use:** When explaining internal mechanics and data flows in isolation (e.g. Proxy track/trigger lifecycle, Virtual DOM patch flag bitmasks, Component Slot distribution, Pinia action dispatch flow).
- **Core Principle:** There is NO "wrong" or "right" way here. The diagram illustrates how the Vue engine executes the provided code.
- **Visual Strategy:** Present clean structural diagrams with labeled nodes, data-flow arrows, and clear state transitions.

## Writing one lecture

### Skeleton, in this order

1. Line 1, exactly: `# Lecture {n}: {Catchy Title}`. Compelling, visceral hook that draws the reader in (e.g. "The Destructuring Trap", "When Reactivity Goes Silent", "The Lost Props Contract"). Restricted to **B2 English vocabulary**; avoid obscure words.
2. Line 2, exactly: `> INTERVIEW QUESTION | {tier} | {question text copied verbatim from the bank row}`
3. Blank line, then the Opening Ladder: 5 to 7 numbered beats that open the body: scene, failure moment, question (direct sentence stating the visible conflict), danger, mystery, promise. No sentence over 20 words and no em-dashes. Never name the lecture's mechanism term in the ladder; the term is earned in the body.
4. Right after the ladder comes the first `### ` section: catchy title, then prose opening the teaching.
5. Body sections with `### ` headings only (`## ` forces a PDF page break). Every technical section follows the **Harmonious Code + UI Step Rhythm**:
   (a) **Mandatory Introductory Prose:** Every `### ` heading MUST open with 2–3 sentences of conceptual framing. Never start immediately with a code block or figure.
   (b) **Code Snippet Precedes Figure:** Precedes the figure every single time, presenting the code contrast with end-of-line comments (e.g. `// **WRONG:** ...` vs `// **RIGHT:** ...`).
   (c) **Vue Figure:** Immediately follows the code snippet, rendering the visual or architectural consequence.
   (d) **Analytical Derivation:** Directly follows the figure, deconstructing the engine mechanics accompanied by authoritative quotes.
   (e) For multi-step lessons, repeat this loop: `[Section Text -> Code Snippet -> Figure -> Derivation]`.
6. At least one `> [!TIP]` callout with a `**To impress the interviewer:**` lead. Use `> [!KEY]` for one-line takeaways. Use `> [!WISDOM]` to preemptively clarify industry conventions and mental models before code examples.
7. Right before the Summary, a `### Where you will meet this` section: 3 to 5 one-line uses of the concept in real Vue applications.
8. A `### Glossary` section positioned directly after `### Where you will meet this` and immediately before `### Summary`: 4 to 6 core terms introduced or reinforced. Format: `- **Term**: Plain-English definition explaining the concept and its concrete engineering role.` No em-dashes.
9. Close with `### Summary` written as a Streetwise Review from an experienced developer's daily perspective.

### The Opening Ladder laws

- Single actor throughout: one person with one unambiguous role (a frontend engineer, a senior architect, a checkout developer).
- Every noun is exactly one tangible thing: a person, a visible button/form, a file, a property, or a runtime event.
- The beat that sets up the scenario must directly expose the contradiction between what the developer expected the reactive state to do and what the browser actually rendered.
- The last beat promises, never explains.
- Scenario clarity is absolute: write for a tired B2 English reader with a headache.

### Code fences

- Fences are ` ```vue title="Counter.vue" `, ` ```javascript title="useCart.js" `, ` ```typescript title="types.ts" `, ` ```html title="index.html" `, ` ```css title="styles.css" `. Real, runnable examples in the National Times world, kept under about 80 characters per line.
- Every body code snippet renders as an authentic macOS editor window (`.editor`) with titlebar dots, filename tab (`title="..."`), line numbers, and tabbed comment speech bubbles (`.cmt-bubble`). Code fences must start flush at column 0, separated from preceding text by a blank line.
- Comments live at the END of the code line (`// annotation` in JS/TS, `<!-- annotation -->` in HTML/Vue template, `/* annotation */` in CSS), never on their own line. Lead verdicts with `**RIGHT:**` and `**WRONG:**`.

### Summary shape

- Lead the summary body with an authoritative `**Technical Title**` in bold on its own line.
- Use `❒ {Subtitle}` section headers.
- Under each subtitle, use numbered points with indented sub-lines formatted with `<br>&nbsp;&nbsp;&nbsp;&nbsp;`.
- For right and wrong examples in the summary, DO NOT put comments inside the code block. Add `right` or `wrong` directly to the fence language tag (` ```vue right ` or ` ```vue wrong `), and put the instruction on the line above: `**DO THIS:** {instruction}` or `**DO NOT DO THIS:** {instruction}`.
- Highlight core principles with `➔ NEVER`, `➔ ALWAYS`, and `➔ IF ... THEN ...`.
- End with the comparison table as the LAST block of the file.

### The closing table (exact shape and Transposition Law)

```
| | **COLUMN B**<br>(subtitle) | **COLUMN C**<br>(subtitle) |
| ---: | :--- | :--- |
| **Dimension** | value | value |
```

- Strictly 3 columns (`| | **COL B**<br>(subtitle) | **COL C**<br>(subtitle) |`).
- Divider row is exactly `| ---: | :--- | :--- |`.
- Every body row starts with a bold dimension in column 1.
- **The Transposition Law:** When comparing three or more entities (such as `ref` vs `reactive` vs `shallowRef`, or Pinia Options vs Setup stores), transpose the table so the entities are the **rows**, and use the two table columns for analytical axes (e.g. `**REACTIVITY MECHANISM**<br>(how it tracks)` and `**COMMON TRAP**<br>(when it fails)`).

## Hard format rules

- One continuous line per paragraph, bullet, and table row. Never hard-wrap.
- No em-dashes anywhere in the lecture.
- Keep every technical term, and immediately define it in plain English in the same sentence.
- Cognitive Accessibility & B2 Language Standard (The "Headache & Short Attention Span" Law).
- Clarity Over Brevity (The Length Follows Clarity Law): The length of a section is never a constraint. Exceeding standard length is explicitly permitted and encouraged as long as it secures clarity. Between "proper length" and more clarity, we ALWAYS prefer more length if it adds more clarity.
- Mandatory Bold Baptism of New Terms: format newly introduced terms in bold (`**term**`) on first introduction.
- Iterative Chapter Versioning: active chapter is `{n}.md`; prior iterations archived as `{n}-old-01.md`.
- Comprehensive Lecture Depth: **3,000 to 4,500+ words**, spanning **16 to 32+ PDF pages**.

## Build and gates

From this folder run `node src/build-lectures.mjs` (add `--no-pdf` to skip Prince). The combined reader is written as `md-lectures-html/deck.html`, and its PDF is named `Vue Q01-Q{last}.pdf`. A `warn` line is a format violation you must fix in the source; zero warnings is the mechanical gate.

### Inspection Image Cleanup Command

Whenever you generate temporary PNG images via `pdftoppm` or build scripts for visual inspection, **never leave them in the workspace**. Immediately run:

```bash
node src/clean-inspection-images.mjs
```

This cleans up all temporary `.png` files across `md-lectures-pdf/`, `md-lectures/figures/templates/`, and `md-lectures/figures/` without touching source markdown, HTML, or compiled PDF files.
