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

### Authoring workflow (no plan phase, no approval gate)

The question bank is the plan: the Question column fixes the topic, the Hook column is the lecture's opening scenario, and the Topic tag fixes the scope. Read the row, then write the lecture directly. **ADVANCED questions only:** if the mechanism has many moving parts (for example signals under the hood), you may first save a five-line outline to `md-lectures-plan/{n}.md` as your own working note: the scenario, the three to five section shifts, and where `components` panels will sit. An outline is optional, is never reviewed, and never blocks writing; do not stop or wait for approval.

For lectures that must be written across several small-context sessions, see **Writing with small-context models** at the end of this document: parts are optional, they live in `md-lectures-plan/{n}-part1.md` and following, and a polish pass by a second model follows assembly.

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
| `src/component-explorer.mjs` | **Component explorer parser and renderer.** Converts `components` Markdown blocks into the generated Finder-style panel. | Rarely |
| `src/build-cards.mjs` | **Card build script.** Reads `md-cards/` + `diagrams/`, writes `md-cards-html/` + `md-cards-pdf/`. | Rarely |
| `src/lecture.css` | Long-form article stylesheet used by the lecture HTML/PDF pipeline. | Rarely |
| `img-instruction/005.md` | **Single source of truth for all diagram and image design** (palette, typography, components, layout patterns, the four-element complexity budget, pedagogical rules, and the Generic Prompt to prepend to image generations). | Read always; edit rarely |
| `archive/` | Reserved for snapshots and provenance. Currently empty. | No |

## Component Explorer Panels and the Intro Component-Tree Gate

Every lecture must actively consider whether its core logic needs a generated **component explorer panel**, the project's properly designed component-tree visual, as an introductory reference. Use the panel whenever understanding the mechanism depends on seeing where something lives, which component owns it, what is nested or repeated, what crosses a boundary, or which rendered element a component-local reference identifies. A graph with several components is an obvious case, but it is not the only case: a single component that owns an important DOM node, conditional subtree, action target, or lifecycle-sensitive browser resource can also require the panel. The panel is the lecture equivalent of the Finder-style reference in `demo-01.html`: a project title bar across the top, a connected file hierarchy on the left, and the visual component or rendered surface on the right. It is generated HTML, not a screenshot and not hand-authored markup.

### The intro component-tree visual-reference gate

Before writing the first code fence for the lecture's central mechanism, answer these questions in the working plan:

1. Does the learner need to know which component owns the state, reference, resource, or behavior?
2. Does the mechanism depend on component nesting, repeated instances, a conditional branch, a component boundary, or the identity and lifetime of a rendered DOM element?
3. Would seeing the relevant component and rendered target before the code remove ambiguity that prose alone leaves behind?

Every lecture MUST include at least one `components` panel, no exceptions: the questions above decide what the panel must show, never whether one exists. Place it after the visceral opening and a short prose description of what the learner is looking at, but before the first Svelte code fence that implements the mechanism. The panel is the learner's visual map, not an optional recap after the implementation. The generated component explorer is the required proper design; an ASCII tree, prose-only description, comparison table, or diagram placed after the code does not satisfy this gate.

A single `.svelte` file is not an automatic reason to omit the panel. `bind:this` is the canonical example: the learner benefits from first seeing the owning component, its rendered form or element, and the component-local variable that receives that exact node. Use a single-root panel with the appropriate visual kind and a concise annotation naming the reference and its target.

There is no omission path: no lecture ships without a `components` panel. If a mechanism looks ownership-free, use a single-root panel naming the owning component and its rendered target. The build prints a warning for any lecture with zero panels, and a clean build requires at least one.

### When to use a panel

Use one panel when the surrounding lecture example contains one coherent structural model and the reader benefits from seeing both ownership and the rendered result. Good cases include a parent importing a child, a parent passing props or callbacks to a child, a conditional branch that selects between child components, a bindable value crossing a component boundary, a snippet being passed to a child component, multiple instances with independent state, or a component-local DOM reference whose exact target and lifetime are central to the lesson.

Do not merge unrelated code fences into one panel merely because they use more than one `.svelte` filename. Lectures 4–7, 14–15, and 18–19 contain independent examples; keep those examples independent. Lecture 3 has a separate multiple-instance case: one component definition rendered several times is not a parent-child file tree, so use the `instances` visual kind described below.

### The visual-first presentation rule

The component relationship or ownership model is the learner's destination, so show that destination before showing the code that builds it. Whenever a lecture introduces a multi-component relationship, a multiple-instance arrangement, or component-scoped DOM logic that passes the intro component-tree visual-reference gate, use this order:

1. **Name the intended visual arrangement in prose.** State what the page should contain, which component owns the logic, which component or DOM target appears inside it, and what data, callback, condition, binding, snippet, or reference connects them. Use the real example's names and stakes so the panel is an explanation, not decoration.
2. **Place the `components` block immediately after that visual explanation.** The generated panel is the first visual representation of the relationship and must appear before the first Svelte code fence that implements that relationship. Do not place a panel after the code as a recap.
3. **Read the panel as a model.** Explain the left file tree as the source relationship and the right canvas as the rendered relationship. For a single-root DOM case, name the owning component, the rendered target, the local reference, and the relevant mount or removal timing. For a repeated definition, explain the independent instances and any shared module-level state. For branches, explain which child is present under each condition. For props, callbacks, bindings, snippets, or references, explain the direction and meaning of the annotation.
4. **Show the code in dependency order.** Start with the parent or repeated component arrangement, then show the child or shared definition, then show the interaction or variant that completes the visual model. The code should match the panel's filenames, instances, annotations, and nesting.
5. **Derive the mechanism after the code.** Once the learner has the visual target and its implementation in view, explain why Svelte produces that relationship and what changes when the relevant state or data changes.

This rule applies to every existing and future component panel. A lecture may still show an earlier standalone code example when that example establishes a prerequisite, but the first code for the structural relationship itself must follow its visual panel. For the multiple-instance case in lecture 3, show the `instances` panel before the `AudioPlayer.svelte` module and instance code. For lectures 8, 9, 10, 11, 12, 20, and 21, show the parent-child, prop, rest-prop, callback, conditional, bindable, or snippet-prop panel before the corresponding code fences. For a lesson such as `bind:this`, show the single-root ownership panel before the first code that binds and uses the DOM reference.

### Markdown authoring syntax

Place a `components` fenced block immediately after the prose that explains the intended visual relationship and before the first Svelte code fence that implements it. The fence is consumed by `src/build-lectures.mjs` and becomes the complete explorer panel in the generated lecture HTML.

````
```components title="dashboard-app — Component Explorer"
App.svelte | cartCount=0 | shell
  ProductCard.svelte | onadd={handleAdd} | card
```
````

For a component-local DOM identity mechanism, use a single-root panel rather than inventing unrelated components. The visual kind should match the rendered target, and the annotation should identify the exact local relationship:

````
```components title="national-times — Component Explorer"
CorrectionDesk.svelte | correctionInput receives the mounted input node | form
```
````

The syntax has one entry per line:

- **File name:** The first field is a bare filename: `App.svelte`, `Header.svelte`, `session.svelte.js`. Never write path prefixes such as `components/Header.svelte`; the build assigns every `.svelte` file to the `components/` folder and every module to the `state/` folder automatically, so the left tree is always the canonical top-level shape.
- **Indentation:** Use exactly two spaces per nesting level. The first entry is the single root. A nested `.svelte` entry is rendered inside its parent on the right canvas; module entries (`.svelte.js`, `.js`, `.ts`) are listed in the left file tree only and never render on the canvas.
- **Displayed context:** The optional second field, after the first `|`, is a short prop, binding, condition, or state annotation. It appears in italic text beside the component label.
- **Visual kind:** The optional third field selects a small deterministic mock surface. Supported kinds are `shell`, `header`, `navigation`, `profile`, `badge`, `counter`, `card`, `form`, `table`, `button`, `branch`, `instances`, and `generic`. If omitted, the builder infers a kind from the filename.
- **Rendered lines (the fourth field):** The optional fourth field is the component's real UI on screen: the actual text and numbers the lecture's code produces, written by the author, individual lines separated by `;;`, with `**bold**` allowed for the load-bearing value. When present, it replaces the kind's mock surface on the canvas (the kind still sets the frame color and label). This field is mandatory for every new panel; see the rendered-content rule below.
- **Window title:** The `title="..."` attribute is the project title shown in the panel's top bar. Use a short project name followed by `— Component Explorer`.

**The rendered-content rule (no empty surfaces).** The deterministic mock surfaces (grey bars, STATUS, ACTION) are placeholders of last resort, never a design choice. Every new panel must show what the learner would actually see on screen, through the fourth field, and that means the author must ALWAYS compute the final UI before writing the panel: run the lecture's code in your head with the real values from the snippet and write down what lands on the page. A reactive expression in braces is invisible to the learner until you evaluate it; `{totalPayout}` with tonight's three stories (800 + 1200 + 950 words at rate 0.5) is `1475`, and the panel must say so. The numbers in the panel are arithmetic performed on the numbers in the fence: if the code changes, the panel changes with it. An empty box or a row of grey bars where a computed result should be reads as broken and teaches nothing — it is the panel equivalent of a floating comment bubble, a shape pointing at no content.

**When emptiness is legitimate (the fill decision procedure).** A filled surface is always preferred, but filling everything would be its own absurdity: a wrapper decorated with invented chrome is out of context. Decide per entry, in this order:
- **An end component, one that renders HTML of its own, always gets rendered lines**, computed from the code block's HTML and its starting values. This is the default and covers nearly every entry: a `<p>`, a button label, a list, an `{expression}` are all knowable, and so is a literal string — `{@html content}` with `let content = "<h1>Hello</h1><p>Welcome to my blog.</p>"` renders the words inside that string. If the code block shows it, the panel shows it, evaluated.
- **An end component whose code block shows no HTML** gets its observable outcome: the one thing the learner would see happen, taken from the lecture prose ("prints Status: idle on mount"), and flagged to the owner as inferred. Never invent visible chrome the lecture never establishes.
- **A container whose children render inside it stays unfilled, on purpose.** Its UI is the nested children, and the build already draws them inside its box; adding invented titles or bars would be decoration, not content. This is the only legitimate emptiness on the canvas, and it is not really emptiness: the box is filled by its children.
- **A state module never renders.** It lives in the left file tree only; the build filters it off the canvas. Giving it lines would lie about what modules do.

**The traceability test (the guard against absurd fills).** Every word in a rendered-lines field must be traceable to one of three sources: the code block's HTML, the code block's starting values, or the prose's explicit description of the screen. A line whose content cannot be traced to one of those is invented filler; delete it. This is what keeps "prefer filled" from becoming "make things up": the fill always comes from the lecture, never from the author's imagination of a plausible app.

**Worked example (lecture 32).** The code block ends with `<p>Total payout tonight: {totalPayout}</p>`, and the panel entry must carry that line, evaluated:

````
```components title="national-times — Component Explorer"
PayoutBoard.svelte | totalPayout recomputed over every story | table | Harbor strike · 800 words;; Election night · 1200 words;; City budget · 950 words;; Total payout tonight: **1475**
```
````

The right canvas now shows the story list and, bolded under it, the total the learner's code will actually print: `Total payout tonight: 1475`. The same entry written without the fourth field (`PayoutBoard.svelte | totalPayout recomputed over every story | table`) renders three empty grey bars — the exact failure this rule exists to prevent.

**Status of existing lectures.** Panels written before the fourth field shipped show placeholder surfaces; retrofitting them with computed rendered lines is polish-pass work for the writing models. Lecture 32 is already retrofitted as the reference exemplar. New lectures carry rendered lines from the first draft.

The same file may appear more than once in the right-hand tree when the example renders multiple instances with different props:

````
```components title="dashboard-app — Props Explorer"
Dashboard.svelte | | shell
  Button.svelte | label="Save" | button
  Button.svelte | label="Delete" | button
  Button.svelte | label="Submit" | button
```
````

For one component definition rendered repeatedly, use the `instances` kind instead of inventing a parent component. Include the count as a number in the second field so the renderer can calculate the instance chips:

````
```components title="audio-player — Component Instances"
AudioPlayer.svelte | 5 independent instances share module state | instances
```
````

For mutually exclusive conditional children, keep both branches under the parent and put the condition in the second field:

````
```components title="account-app — Conditional Components"
App.svelte | loggedIn | shell
  Dashboard.svelte | when loggedIn | branch
  LoginForm.svelte | when !loggedIn | branch
```
````

### What the builder calculates

The author supplies only the component model. The builder validates the indentation, requires one root, normalizes paths, deduplicates repeated files in the left tree, derives the `src` and component folders, marks the feature child as active, renders the nested component boundaries, escapes labels and props, chooses the deterministic mock surface for each visual kind, and renders the author-supplied fourth-field lines in place of the mock surface whenever they are present. The CSS in `src/lecture.css` owns the panel's dimensions, colors, tree connectors, responsive stacking, and print behavior.

The explorer is a visual explanation of the relationship; it does not execute Svelte code. Keep the ordinary titled Svelte code fences as the technical source of truth, and keep the explorer metadata short enough that a reader can compare the panel with the code immediately beside it.

### The canonical example scaffold (top-level folders, files one level deep)

The left tree has one fixed shape, built for minimal visual real estate: **top-level folders, each holding bare filenames directly. Nothing nests deeper than one level.**

- **`components/`** holds every `.svelte` file: `App.svelte`, `Header.svelte`, `Sidebar.svelte`.
- **`state/`** holds every shared-state module (`session.svelte.js` and friends), and appears only when the lecture actually has one.
- Authors write **bare filenames** in `components` blocks (`App.svelte`, `session.svelte.js`) — never path prefixes such as `components/Header.svelte`, never nested folders. The build computes the grouping from the file type, so the tree is always the canonical shape however the entry was written.
- **Imports must reflect this structure:** within `components/`, `import Header from './Header.svelte'`; from a component to a state module, `import { session } from '../state/session.svelte.js'`.
- **Exception:** when a question's subject IS a folder structure (SvelteKit routing from Q101 on: `src/routes`, `+page.svelte` placement), the tree may show those real folders, because the folders are the lesson. For Svelte core lectures there is no exception.

**The completeness law:** every file the lecture shows, as a fence `title="..."` or as an import target, MUST appear as an entry in the lecture's `components` panel tree; the tree in turn shows no file the lecture never mentions. The tree is the contract between prose, fences, and panel. The build warns on any shown or imported file that is missing from the tree. (Non-`.svelte` entries such as `session.svelte.js` are valid entries; they appear in the **left file tree only**, under `state/`, with the module icon. The right canvas shows the **rendered visual hierarchy only** — a state module is never rendered, so it never draws a box there; the builder filters module entries out of the canvas automatically.)

**The prose-actor law (no invisible owners).** The completeness law binds the tree to files the lecture fences or imports, but prose often invokes an actor that is never fenced at all: "the page stamps out three copies", "the team passes each copy its own headline". When such an actor owns the mechanism — it decides how many instances exist, it passes the props, it triggers the change — leaving it out of every fence and panel leaves the mechanism ownerless on screen: three instance chips floating with no stamper and no visible source of the headlines. That floating is the reader's "what is going on?" moment, the exact question the panel exists to prevent. Either fence the actor (show the page rendering its three cards, which gives the tree a real parent), or rewrite the prose so it stops leaning on the invisible actor. The rule extends to names: a compound component name (`PriceBlock`, `StoryHeader`) must have its parts grounded in prose at its first appearance — one sentence saying what each noun of the name means — so the name reads as one explained idea instead of two missing components.

### Placement and quality rules

- Add the panel at the smallest useful scope, immediately before the parent and child code blocks that form the graph.
- For a single-root ownership or DOM-identity panel, place it in the introduction to the mechanism, immediately before the first code block that creates or uses the relationship.
- Use the actual filenames and actual prop or callback names from the example. Do not add decorative files that the lecture never mentions.
- Use one panel for one relationship. If a lecture moves from a parent-child example to an unrelated standalone component, start a new panel or omit the panel.
- Use `branch` for conditional alternatives, `instances` for repeated copies of one definition, and ordinary nesting for parent-child composition.
- The left tree and right canvas are generated together; never hand-write a second HTML version of the panel in a lecture file or in `md-lectures-html/`.
- A malformed `components` block should be fixed in the Markdown source rather than hidden with custom HTML or a special-case CSS patch.

This convention applies to every pertinent lecture example, including the component relationship examples in lectures 8, 9, 10, 11, 12, 20, and 21 and the multiple-instance example in lecture 3. The generated HTML remains build output and must be refreshed with `node src/build-lectures.mjs --no-pdf`. When the source or layout changes are ready for delivery, run `node src/build-lectures.mjs` to regenerate both the HTML and PDF outputs.

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
- **Search the deck before teaching a term.** Concepts repeat across the 210 questions, and the reader meets them in order. Before baptizing any term, scan the earlier lectures for it (search `md-lectures/` for the rune, the API name, or the concept phrase). If an earlier lecture already taught it, this lecture re-anchors instead of re-teaching: the term, its one-line reminder, and `(see Lecture N)` — then it may deepen, contrast, or extend, but never start from zero with a fresh metaphor. Two lectures teaching one concept with two metaphors and no cross-reference ("communal brain" in one, "whiteboard" in the other) double the reader's vocabulary for a single idea and leave neither lecture the term's home.
- Read the relevant local Svelte documentation under `documentation 2026 June/svelte-docs/`. Anchor every technical claim to the docs when possible; expand with research when the docs are insufficient.
- Write a **pedagogically clear, extended, comprehensive lecture** that teaches the concept as if to someone who needs to genuinely understand it, not just memorize it.
- The first line is `# Lecture {n}: {Short Title}`.
- Apply the **Lecture format spec** below.
- Run the **intro component-tree visual-reference gate** before drafting the first code example for the central mechanism. If ownership, nesting, element identity, lifetime, or boundary flow matters, introduce the logic with a `components` panel before that code. Do not exempt a lesson merely because its main example uses one `.svelte` file.
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
   * **Step 2: The Naïve Alternatives.** Pose highly specific, tangible, and simple alternatives for how this could be done. (e.g., *"Should we name new pages automatically with 'p', for example, `/p/1` is page 1, and `/p/2` is page 2? Or maybe we should write `/page-1` for page 1?"*) **The first alternative posed must be the strongest one the course itself has equipped the reader to think of.** Ask: what tool from an earlier lecture partially solves this scenario? If props were taught and passing a value down would plausibly work, raise that alternative and answer it — why it fails here, or what it cannot do — before any weaker strawman such as a separate file or "shouting up to the page". A lecture that dismisses only weak alternatives, while the reader's actual first thought ("why not just pass it as a prop?") goes unasked, has a motivation hole: the tool never becomes necessary and the scenario reads as contrived.
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
- **Give structural logic an introductory visual reference.** Immediately after the opening establishes the pain and before the first code that implements the central mechanism, run the **intro component-tree visual-reference gate** from “Component Explorer Panels and the Intro Component-Tree Gate.” If the learner must understand component ownership, nesting, repetition, a conditional subtree, boundary flow, or the identity and lifetime of a rendered element, place the matching `components` panel there and explain how to read it. This is mandatory even for a single-component example when the component-to-DOM relationship is the mechanism; `bind:this` is the canonical case. A panel may be omitted only when the working plan records why the concept has no useful structural model.
- **Combine theory, technical definitions, and practical examples.** Every lecture should braid three threads: (1) the formal definition of the mechanism, (2) why it exists and what pain it removes, and (3) at least one concrete code example drawn from realistic Svelte code.
- **Earn a new technical term before you name it.** When a concept is about to land — especially one that looks imposing at first glance — do NOT rush straight into the jargon. If a reader is still wondering *why this thing even needs to exist*, hitting them with the formal vocabulary (the named phases, the rune names, the API surface) feels estranging rather than enlightening; the term arrives before its necessity does, and complexity reads as overwhelm. The fix is a short orienting paragraph that first establishes the human problem the machinery solves, and only then introduces the term as the name for that solution. The term should feel like a relief — "oh, *that's* what this is called" — not a wall.

  **Worked example — introducing component lifecycle phases.** Do NOT open by listing the `mounted`, `updated`, and `destroying` phases cold. A reader who has never thought about component lifetimes will not yet see why those names matter. Instead, earn the vocabulary with an intro paragraph like this:

  > Components in every web framework — Vue, React, Svelte — have a brief, eventful life. A component *appears* on the screen (it gets mounted), it *changes* as the user interacts with it (it updates), and eventually it *vanishes* from the screen (it gets destroyed). Why does this matter? Because you can write code that runs at one of these moments and not the others. You need to make sure your data is fetched *before* the component is mounted, so there is something to show. You need to react when the component updates, so the screen stays in sync. And you need to make sure data leaks are halted — timers cancelled, subscriptions torn down, listeners removed — when the component is destroyed, so it does not leave garbage behind.

  Only after that grounding does the term arrive as the name for what the reader already understands: the three moments are the component's **lifecycle phases**, and the hooks (or, in Svelte 5, the `$effect` rune) are the tools that run code at exactly the phase you choose. The named vocabulary now labels a concept the reader already holds; it does not introduce one they do not.

  This rule is the **front half** of the jargon rule directly below. First earn the term (this rule); then, once named, define it immediately in plain English (the next rule).
- **Explain every difficult term inline.** The same jargon rule as the cards applies: keep the technical term, then immediately define it in plain English in the same sentence. Pattern: `the **microtask queue** — a built-in JavaScript list of tiny tasks the browser runs after your current function finishes, but before it paints anything`.
- **Ground every new term in what the reader has already done or seen, never only in another term.** A definition built from other technical words defines one unknown with more unknowns. Find what the reader has already done or seen in this course that *is* the term, and define the term from there. The full standard, with the pattern, is **The experience standard** below.
- **These instructions supply method, never wording.** No phrase from this document — a rule name, a worked case, an analogy, an example sentence — may appear in a lecture. When a rule shows you a sentence, that sentence shows the move; write your own sentence for your own case.
- **Teach a structural surprise before the fence that shows it.** Lecture by lecture, the reader builds a model of what a `.svelte` file can contain — whatever the course has shown them so far. When a lecture introduces a construct that breaks this model, the surprise itself is content, and it must be taught in prose ahead of the first fence that shows it. The prose does four things: it names the model the reader holds; it tells the reader, in the lecture's own words, that the construct is allowed and normal; it places the construct against the familiar one (where it sits, and what marks the difference — an extra word on the tag, a different tag, an attribute); and it anchors to the form the reader has already used in earlier lessons. Structural surprises include a second block of a kind the course has so far shown only once per file, a new top-level block in the markup, a `.svelte.js` module file sitting beside the `.svelte` files, or an unfamiliar attribute on a known tag. Worked case, told as the cooking analogy: every recipe in the course so far has used milk, so the reader's model of a recipe is "ingredients plus milk". One day a recipe quietly shows butter going into the same pan, and the reader stalls: wait, butter and milk, together in one recipe? Is that even allowed? The prose above the recipe must answer before the question forms: every recipe you have cooked so far used milk; a recipe can hold both milk and butter, that is allowed and normal in this kitchen; and here is what marks the difference — milk is the everyday liquid you pour without thinking, butter is the solid made from it, and each does a different job. In code the shape is identical whenever a fence contains a construct in a place the reader's model says is impossible; the four prose duties are the same. A fence that breaks the model silently forces the reader to rebuild it mid-code — the exact moment they stop following.
- **Numbering.** Lecture file `{n}.md` corresponds to question `{n}` in the source bank. The numbering matches `md-cards/{n}.md`, `md-design/{n}.md`, and `diagrams/{n}.html` exactly, so any artifact can be cross-referenced by number.
- **Every lecture has a `### Where you will meet this` section, right before `### Summary`.** The mechanism is taught first; this section then answers the reader's natural next question: where does this show up in real apps? It is a list of 3 to 5 uses, one line each. The first line may be tonight's own case; the rest are other apps the reader knows. Every line is one pictureable moment plus what the concept does there (shape: "the cart total changes the moment you add an item: the total is computed from the cart it watches"). Each line passes the experience standard — a concrete situation, never an abstract category. No more than five lines. This section is the one sanctioned widening of the lecture's world: the story never switches worlds; this list surveys other places on purpose.
- **Every lecture closes with `### Summary` plus a comparison table.** This is a hard structural rule, not an optional flourish — the lecture is incomplete without both. The closing has two parts, in this order:
  1. **`### Summary`** — a short prose paragraph (3–6 sentences) that distills the lecture's core mechanism into its cleanest form. It is not a recap of the sections; it is the one-paragraph version a reader would carry away. Write it so that a reader who skipped the body could still leave with the answer.
  2. **A comparison table** — a markdown table immediately below the Summary paragraph that contrasts the lecture's mechanism against its nearest alternative (e.g. Svelte vs React/Vue, `$state` vs plain `let`, `mount` vs `hydrate`, Svelte 4 vs Svelte 5). Two or three columns: the dimension on the left, the alternatives across the top. 
  **Table Alignment Formatting:** You MUST right-align the first column (the row headers) and left-align the remaining columns. Use the exact markdown syntax `| ---: | :--- | :--- |` for the divider row. This is the visual anchor that lands the "what makes this different" point, and it is what the audit phase, the card, and the reader all lean on. If the lecture genuinely has no meaningful contrast (rare), substitute a "what to remember" two-column table of term → one-line definition, using the same `| ---: | :--- |` alignment.

  This rule exists because the Summary + table pair was an *unwritten convention* in `svelte-lecture-01` and got dropped under context pressure, as did the cleaner right-aligned first column styling. Making it explicit here prevents that regression. The canonical template is `md-lectures/01.md` (the "What is Svelte?" lecture) — its closing is the reference shape every lecture should match.

### The experience standard: how a new concept is defined

A new concept can be defined in two ways. Only one of them teaches.

- **Definition through other words.** The concept is explained with other concepts. "It is a document where you can write." Nothing can be pointed at. The reader memorizes words.
- **Definition through experience.** The concept is explained through what the reader can see, open, or has already done. "In your folders you have files that end in .doc. Open one: a title, paragraphs, formatted text. Those files are Word documents." The reader can point at the thing.

Five rules follow:

- **Experience first.** The first definition of a concept always goes through experience. A definition through other words may follow, as a short summary. It never leads.
- **Start from the closest known action.** Find the nearest thing the reader has already done in this course. The new concept is that action plus one change. "You already write a line like this. Write it again, and add one extra word. That is the new concept." Teach the change, never the whole idea from zero.
- **If the concept is visible in code, the definition is its shape.** Some concepts appear as a visible part of a file: a tag, a block, an attribute, a file ending. Define them by comparison. Your files so far contained A. This file also contains B, one extra thing, placed there. Without it: the problem you just watched. With it: what changes. The before-and-after shape of the file is the definition.
- **When the new part is the topic, it is the headline.** Some lectures exist to add one new part to the reader's model of the file. The headline of such a lecture is: your file grows a new part today. Say it plainly in the first section. The story and the example demonstrate the part; they are not the headline. The opening ladder ends by promising the new part, not only the story's outcome.
- **The check.** After every definition ask: can the reader point at a file, a folder, a line of code, or a thing on the screen, and say what it does? If yes, the definition passes. If it only connects words to words, rewrite it.

### The one thing, and the question the reader is already asking

**Every lecture has one thing.** One concrete change carries the whole concept. One line, written differently. One tag, added. One file, created. One call, made. Find it before writing anything. It is the smallest complete form of the concept: the thing the reader could rebuild from memory when every other sentence is gone.

- **The one thing is the center.** Show it early. Show it alone, clean, with nothing competing beside it. Then let everything else — mechanism, contrast, story — explain what stands around it. If the reader keeps one item from the lecture, it is this one.
- **Every concept has a concrete form, even the invisible ones.** A tag is a thing in a file. A block is a place in the file. An external file is a thing in a folder. Even a concept with no shape of its own is created by one line, called by one line, or kept in one file. Find that line, that place, that file. That concrete something stands at the center of the presentation, in its clearest form. The abstract is explained from it, never instead of it.
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

### The Hook Ladder (opening pattern)

Every lecture opens with two parts: a **hook line**, then the **Hook Ladder**. The pattern exists for the tired, low-attention reader: one beat at a time, each beat numbered, forward pull from number to number, and the mystery held back until the body earns it.

**Part 1 — nothing.** The Interview Question box shows the question and its tier badge only. There is no hook line in the ladder format: never write a leading scene line between the question line and the ladder, and never write the ladder's "Imagine this scenario:" lead yourself — the build generates it. (Legacy lectures written before this rule have their opening prose line pulled into the box; the build keeps doing that for them, but it never treats a list line as a hook.)

**Part 2 — the Hook Ladder.** Immediately after the question line (and its blank line), the body opens with 5–7 numbered beats, in this order: the scene, the code moment, the question (a clear, direct question stating the visible conflict without cryptic brevity), the danger, the mystery, the promise. Each beat is one continuous markdown line, one idea per line, no sentence over 20 words. The objective is absolute clarity, never cryptic telegraphic riddles. The ladder ends on the mystery or the promise, never on the answer.

**Part 3 — the first section after the ladder.** Immediately after the ladder, the teaching begins under a `### ` heading with a catchy title that names the chapter's idea (for lecture 26: `### The Invisible Bucket`). A bare paragraph must never sit between the ladder and the first heading: after the scenario, a properly titled section opens the explanation, carries the naming of the mechanism, and leads into the first code. Every later block of teaching gets the same treatment — prose lives inside titled sections, not loose between them.

**The lead sentence and the wrapper are the build's job.** The build detects the ladder structurally — the first numbered list of the body, before any section heading — wraps it in its own `<div class="hook-ladder">` section (styled by `src/lecture.css`, never split across pages), and generates the lead line `Imagine this scenario:` above the beats. Authors write ONLY the numbered beats: never write the lead sentence, and never wrap anything in a div by hand. Any numbered list appearing after the first section heading renders as an ordinary list.

**Rules:**
- **Never name the mechanism term in the ladder.** No "deep proxying", no rune names doing the reveal, no "the answer is". The ladder poses; the body answers. The term is earned where the lecture body builds it (the OLA and jargon rules apply from there).
- **The last beat promises, it never explains.** The closing beat may promise what today brings, in plain words. It may not answer the question the ladder posed; the explanation belongs to the body's first section. A ladder that ends by explaining the mystery has spent its tension one beat early.
- **Numbers, not bullets.** The beats are an ordered escalation; bullets are reserved for unordered lists (Summary takeaways, feature lists). A number promises a next one; that forward pull is the whole point.
- **No label on the page.** The ladder is presented bare, directly under the Interview Question box; no "Intro" heading, no extra chrome. The internal name lives only in these instructions, the AUTHOR BRIEF, and in conversation with writing models. If a public marker is ever wanted, use a small purpose-named eyebrow ("The Setup"), never a position name ("Intro").
- **Consistency of world.** The ladder's scene is the same world the hook column of the question bank seeds, and the same world the lecture body keeps; no context switching.

**Who you are writing for: the tired-reader standard.** Before writing one beat, fix the reader in your mind: a person reading English at B2 level (comfortable with everyday words, lost in idioms and rare vocabulary), at the end of the day, tired, with a mild headache, giving the page one chance. The ladder is the reader's first contact with the topic, so its beats must be the clearest sentences in the entire lecture, clearer than the body and clearer than the summary. If a beat can be read two ways, a tired reader takes the wrong way, and the lecture loses them in its first ten seconds. Write every beat so it survives that reader.

**The identity test: one noun, one thing.** Every noun in every beat must be exactly one of four things, and only one: (a) a person, (b) something visible on the screen, (c) something in the code (a file, a variable, a line), (d) a machine event (the browser, the network). A noun that can be read as two of these fails the beat. Name each thing so only one reading survives: a person gets an unambiguous human role ("a journalist types a new headline", never write unnatural boilerplate like "a real person"), the program gets its full name ("your code editor, the program, like VS Code"), the screen gets its place ("the headline at the top of the page"), the code gets its shape ("one line of your code", "the variable that holds the headline"), the machine gets its name ("the browser").

**The overloaded-word list.** Web work reuses ordinary words as technical terms, and a beat has no room to carry both meanings. Never write these bare in a ladder beat; replace each with the concrete, observable thing:
- **"editor"** — the worst offender: it can be the human editing the site, the site visitor, or the code editor program. Write "the journalist" or "the visitor" for the person; write "your code editor, the program" for VS Code.
- **"live"** — broadcast-live? deployed? running? reactive? Say the observable fact instead: "the site is open in the reader's browser right now".
- **"script"** — in a coding lecture it reads as a code file or the `<script>` tag. If the scenario world means a broadcast script, name it in full ("the broadcast script, the text of tonight's show") or cut it.
- **"log"** — as a verb it collides with `console.log`; as a noun it is a file or firewood. Write "print it to the console".
- **"ship", "frozen", "dead", "state", "store", "mount", "render", "trigger"** — mechanism vocabulary wearing everyday clothes; the ladder never names the mechanism, and these words are the mechanism by another door. Write the visible behavior: "the page keeps showing the old headline", "the page never prints the second change".
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

**The Proper-Scenario Checklist (run on every ladder before the lecture is finished):**
- [ ] Every noun in every beat is exactly one thing — a person, a thing on the screen, a thing in the code, or a machine event — and cannot be read as two.
- [ ] No overloaded word appears bare: "editor", "live", "script", "log", "ship", "frozen", "dead", and every mechanism word in disguise, replaced by observable behavior.
- [ ] Every person is named with a human word, never with a bare ambiguous role.
- [ ] Every word is B2: everyday vocabulary, no idioms, no rare words, nothing a tired reader must reread.
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

What a tired B2 reader stumbles on: "the newsroom desk" (a desk? a team? a component named Desk?), "is live" (on air? deployed? running?), "an editor" (a person editing the site? the visitor? the IDE?), "log" (a verb? a file? firewood?), "the script" (a news script? a code file? the `<script>` tag?), "print" (a printer? the console?), "frozen" (the browser froze? the value cannot change?), "ships" (deploys? delivers?), "the log is dead" (which log? what does dead mean?). Every beat carries at least one double reading.

The same scenario, rebuilt so each noun has exactly one identity:

1. You built a news website called The National Times, and real readers are using it right now.
2. A journalist types a new headline into the page and saves it.
3. Your code has one job: print the headline to the console every time it changes.
4. Why does the code print only once?
5. Readers keep seeing the wrong headline.
6. Something in your code read the headline once, then stopped looking.
7. Today, the print will follow every change.

Same world, same mystery, same promise, but now every beat paints one picture a tired reader cannot misread. Note what disappeared: "editor", "live", "script", "log", "frozen", "ships", all replaced by people, screens, code lines, and observable behavior.

**Second worked example: the ladder with the missing logic.** This ladder (an early draft of lecture 32) passes the identity test — every noun is one thing — and still fails, because the value at the center of the story is a cipher and the reasoning is compressed into shorthand:

1. A journalist files the last story of the night in the National Times newsroom.
2. The payout total under the story list sits frozen at its old number.
3. Why is it frozen?
4. The correct total needs a loop over every story, plus a safety check for broken records.
5. One line cannot hold a loop.
6. Svelte ships a second form of the same tool, one that takes a whole function.
7. Inside it, loops and safety checks are just normal JavaScript.

Read it as a tired B2 reader. What is a "payout total", why does it exist, what does it compute, and why would filing a story change it? The ladder never says. Why is the number "frozen" — what moved that it should have followed? Nothing is shown changing. What is "a loop over every story", why would a total need one, what is a "safety check", what is a "broken record"? All assumed previous knowledge. The same ladder, rebuilt by the logic rules:

1. A journalist files one more story at the end of the night at the National Times. The paper pays by the word.
2. The page shows one payout total under the story list. That total counts the words of every story, because the paper pays by the word.
3. The new story lands on the list.
4. But the payout total still shows the old number. Why does it not move?
5. The correct total is a derived value, a number computed from other data. This one needs steps: visit every story, add its words, skip any story with no word count.
6. One line cannot hold those steps.
7. Svelte has a second form of the same tool, one that takes a whole function. Inside it, loops and safety checks are just normal JavaScript.

Note what appeared and what changed. The business rule ("pays by the word") arrives as the explanatory sentence in the first beat and is repeated, attached to the on-screen value, in the second. The change (the story lands on the list) now precedes the stale number, so "Why does it not move?" points at a watched event. The shorthand of the old beat four ("a loop over every story, plus a safety check for broken records") became "visit every story, add its words, skip any story with no word count" — the same logic, stated as operations a tired reader can picture. And the wall ("one line cannot hold a loop") now stands on an earned chain: the value is classified first (a derived value that needs steps, not one formula), so the wall lands as a conclusion instead of an assertion. Two banned words from the old draft ("frozen", "ships") left with it.

**Primary Mandate — The Lecture 36 Case Study (Role Rotation, Phantom Routines, and Cryptic Questions):** This case study demonstrates why clarity must always defeat artificial word-count constraints, synonym rotation, and phantom background routines. Full breakdown lives in `docs/HOOK-LADDER-CASE-STUDY.md`.

*The Flawed Draft (REJECTED):*
1. A reporter opens the bureau directory to update a foreign correspondent's assignment record.
2. A background routine receives fresh coordinates and updates reporter.location.city = 'Geneva' in the profile data.
3. Why did nothing move?
4. Readers see the journalist stationed in London while their breaking dispatch publishes from Switzerland.
5. The nested city text changed inside computer memory, but the badge on screen stayed frozen on London.
6. Today you learn the exact boundary where deep updates stop, and how to keep nested values linked to the screen.

Why it failed: Rotating between "reporter", "foreign correspondent", and "journalist" confuses international B2 readers (sounds like three people or three technical roles); "A background routine receives fresh coordinates" introduces novel technical jargon ("routine") that distracts from Svelte; and "Why did nothing move?" is a cryptic, metaphorical question forced into an artificial 4-word rule. On a screen, "move" means CSS animation.

*The Corrected Standard (MANDATED):*
1. A journalist opens their profile page on the National Times website to update their current city.
2. The profile displays a location badge on screen, showing London from journalist.location.city.
3. The journalist selects Geneva, updating journalist.location.city = 'Geneva' in the profile data.
4. Why did London stay as the registered location, even after the update?
5. Readers still see London on the published website while the journalist reports breaking news from Geneva.
6. The city text changed inside the data object, but the badge on screen never received the update.
7. Today you learn how deep reactivity works in Svelte and how to keep nested data connected to the screen.

Why it succeeds: One actor throughout ("a journalist"); direct user action (selects Geneva); and Beat 4 asks a natural, complete, non-cryptic question stating the exact observable paradox ("Why did London stay as the registered location, even after the update?").

**Second Mandate — The Lecture 35 Case Study (The Jargon Trap and Inside-Out Engine Trap):** Full analysis lives in `docs/HOOK-LADDER-CASE-STUDY.md`.

*Stage 1 — The Jargon and Abstraction Trap (FAILED):*
1. A news reporter reviews three breaking wire reports on the National Times dispatch desk.
2. The dispatch desk requires every published report to be manually verified by its unique bulletin number.
3. The developer adds a verify button that passes bulletin number 402 directly to the click handler.
4. Why did it run?
5. Every bulletin verifies itself the instant the page loads, publishing unread reports before the reporter touches the mouse.
6. Writing parentheses directly in the template attribute executes the action immediately during rendering instead of waiting for clicks.
7. Today your handlers learn to wait for user interaction, receive custom values, and read native browser events.

Why Stage 1 fails: "Wire reports" and "dispatch desk" sound like hardware or network libraries; "bulletin 402" looks like HTTP 402; and "template attribute" is vague academic jargon hiding `onclick={...}`.

*Stage 2 — The Inside-Out Engine and Broken Causality Trap (FAILED):*
1. A writer opens a dashboard showing three draft articles on a news website.
2. Each draft article has a simple identification number, such as article 5 or article 12.
3. Next to article 12, the developer writes onclick={deleteArticle(12)} on the delete button.
4. Why did it run?
5. All three articles delete themselves the second the page loads, wiping out the work before any click.
6. Writing parentheses directly inside the onclick attribute calls the function immediately during page rendering.
7. Today your buttons learn to wait for user clicks, pass custom values safely, and inspect browser events.

Why Stage 2 fails: "Why did it run?" is programmer shorthand from inside the JS engine. To a screen observer, no one clicked, and articles do not "run". Causality was broken by asking the question before showing the empty screen.

*Stage 3 — The Outside-In Screen Truth (MANDATED):*
1. A writer opens a dashboard to edit three draft articles on a website.
2. Each article has a delete button written as onclick={deleteArticle(id)} to remove that draft.
3. The writer loads the page without touching the mouse or clicking any button.
4. Where did they go?
5. The list is completely empty because the delete function executed during page load, erasing all drafts.
6. Writing parentheses (id) after the function name executes the code during render instead of waiting for clicks.
7. Today you learn how to pass arguments safely and inspect browser events when users click buttons.

Why Stage 3 succeeds: Universal nouns; user inaction is explicit (did not touch the mouse); Beat 4 asks the natural human reaction to a blank screen; and Beat 6 identifies the exact characters: writing parentheses `(id)` after the function name.

**Third Mandate — The Lecture 37 Case Study (`$state.raw` and The Mismatch Law):** Full analysis lives in `docs/HOOK-LADDER-CASE-STUDY.md`.

*The Flawed Draft (REJECTED):*
1. A journalist loads a directory of ten thousand global news bureaus on the National Times editorial portal.
2. The page stores the article list in state so the display updates as the journalist searches.
3. The journalist types a word into the search box to find an old article.
4. Why does the search box lag on every keystroke, even though no article ever changes?
5. Letters appear seconds late on screen, locking up the page while the journalist types.
6. Svelte creates thousands of reactive wrappers around data that never needs fine-grained property tracking.
7. Today you learn how to opt out of deep tracking for massive datasets without losing reactive updates.

Why it failed: First, "global news bureaus" and "editorial portal" use specialized, confusing institutional jargon (in France "bureau" = desk; in India "bureau" = government department). A newspaper publishes articles; an archive of 10,000 published articles is the only sane, universal domain entity. Second, Beat 2 missed the fundamental architectural contradiction (The Mismatch Law): writing *"The page stores the article list in state so the display updates as the journalist searches"* sounds harmonious and correct, hiding the clash. In reality, the articles are static and read-only; nobody edits an article on this page. Wrapping 10,000 articles in deep reactive proxies tells Svelte to watch properties that will never change, even though the display only updates to filter search results.

*The Corrected Standard (MANDATED):*
1. A journalist opens the search archive on the National Times website to browse 10,000 published articles.
2. The code stores the articles in $state(articles), but the display only updates when the journalist searches.
3. The journalist types a single letter into the search box to find a story.
4. Why does typing in the search box freeze the screen, even though no article ever changes?
5. Letters appear seconds late on screen, locking up the interface while the journalist types.
6. Svelte creates ten thousand deep reactive proxies to track properties that are never edited.
7. Today you learn how shallow state ignores nested properties to keep large datasets fast.

Why it succeeds: Universal nouns; single actor; and Beat 2 explicitly exposes the architectural contradiction between the tool chosen (`$state(articles)` watching every property) and the screen's real need (only filtering search results; data never changes).

**Status of existing lectures.** Lectures written before this pattern have prose openings; retrofitting them to the Hook Ladder is polish-pass work for the writing models (the owner's rule: only the writing models edit lecture text). New lectures use the ladder from the first draft.

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

Every fenced code block in a lecture is automatically transformed by `src/build-lectures.mjs` into an editor-style display: a thin-bordered window with a filename tab, three traffic-light dots, numbered lines, zebra striping, and syntax-highlighted tokens. A `//` comment renders as a **speech bubble hung directly below its code line**, with a small tail pointing up at that line. The author writes plain Markdown; the build script produces the styled HTML. **Never hand-write `<span>` tags, CSS classes, or bubble markup in lecture Markdown** — the highlighter will double-encode them and the output will be wrong.

### How to author a code block

- **Open with a fenced block**: ` ```svelte ` or ` ```js ` or ` ```javascript ` (all three use the same JS/Svelte tokenizer).
- **Filename tab is always shown.** The editor chrome (three dots + filename pill) renders for every fenced block. If you omit `title=`, the highlighter derives a default filename from the fence language: `svelte` → `App.svelte`, `js`/`javascript` → `App.js`, `ts`/`typescript` → `App.ts`, anything else → `code.txt`. To override, write ` ```svelte title="RealName.svelte" `.
- **`<script>` wrapper tags and blank lines render as ordinary numbered rows.** The build does not strip `<script>`, `</script>`, `<script module>`, `<style>`, or blank lines: every source line inside the fence gets a row and a line number, and blank lines show as empty numbered rows. To keep the editor dense, write snippets without blank lines where you can, and mention wrapper tags in prose (`` `<script>` ``) rather than fencing them when they are not part of the lesson. Keep top-level code flush against the left margin; indentation inside fences is rendered literally.
- **Keep every line inside a fence under about 80 characters.** Longer lines wrap in the built output (the row grows taller, the number column stays left) — that wrap is a safety net, not the style. Break long object literals and long calls across rows yourself, one property or argument per row, so the break lands where the code reads best. A row of data like an article record is written one field per line, indented under its braces, never as one long strip.
- **Close with ` ``` `** on its own line. Every fence opener must have a matching closer.
- **Write comments normally**: use `//` followed by a space and the comment text. The highlighter renders the `//` as `→` in the output. Example source: `let count = 0; // Reactive declaration of variable "double"`.
- **Bold inside comments**: wrap key terms in `**double asterisks**`. The highlighter renders these as bold inside the comment span. Example source: `// adds an **own** prop`.
- **No other comment formatting**: italic, inline code, and links are not supported inside comments. Use `**bold**` only.

### The `//` comment rule (exact behavior)

- The first `//` on a line that is **followed by a space or end-of-line** is treated as the comment start.
- Everything from that `//` to the end of the line becomes the text of a comment bubble rendered below the code line (white box, grey border, small upward tail, Georgia serif italic). The first letter is auto-capitalized, and `**bold**` runs render as tag-styled bold inside the bubble.
- **`✔️` / `✖️` glyphs are stripped from comments on purpose.** The owner decided verdict icons do not belong in the rendered output. Signal do/don't verdicts with words instead: `// **WRONG:** reads the prop once`, `// **RIGHT:** stays reactive`.
- **`//` inside URLs is preserved.** A string like `'https://example.com'` is untouched because the `//` is followed by `example`, not a space. The same protection applies to `file://`, `http://`, and regex literals.
- **Empty trailing `//` is dropped.** A line ending in bare `//` with no comment text renders without any arrow — clean output, no dangling `→`.
- **`//` at the very start of a line** (a comment-only line, flush-left or indented) is auto-repaired by the build: its text is merged into the bubble of the next code line (the previous one if the block ends first), no empty row is rendered for it, and the build log prints a note naming the source line. **Authors must still never write comments this way.** End-of-line comments remain the rule; the merge is a safety net that guarantees no comment bubble ever floats beside an empty row, not permission to park comments on their own lines (see **Comment placement** below).

### Comment placement (load-bearing)

Comments in this project are **always attached to the code line they annotate**: they are written at the end of that line, after a `//`, never on their own line above the code. This is non-negotiable. The reason is that a comment renders on screen as a speech bubble hung directly **below** its code line, with a small tail pointing up at it. Its entire job is to deliver clear, short visual information about that one line. A comment with no code on its line is a bubble pointing at nothing — the reader cannot tell which line it belongs to. (If a comment-only line slips into a fence anyway, the build folds it into the next code line's bubble and logs a note in the build output — a safety net, not an excuse.)

**The rule, stated plainly:** write `code; // annotation`, never `// annotation` on its own line followed by `code;`. If you find yourself wanting to introduce a block of code with a comment, write the introduction in the prose above the snippet instead — do not park it as a comment-only line inside the fence.

**Exception for extremely wide lines:** If the line of code itself is exceptionally long (e.g., a wide function declaration like `function react_style_update(oldTree, newTree) {`), attaching a comment to the end will cause it to hit the right edge of the editor container and wrap into two lines, breaking the parallel visual layout. In this specific scenario, place the comment on its own line *inside* the block (e.g., inside the function body on the very next line) instead of trailing the wide line.

The canonical reference is **`md-lectures/49.md`** in the sibling `svelte-lecture-01` project: every comment in that lecture sits at the end of its code line, with not a single comment-only line anywhere. The models of the discipline, adapted (glyphs replaced with word verdicts, since the build strips them):

1. **The trap verdict, end-of-line:** `let count = $state(initialCount); // **WRONG:** reads initialCount **ONCE** during creation` — a wrong-pattern line, the verdict word leading the comment, the load-bearing word in caps, at the end of the line it warns about.

2. **The correct-pattern verdict, end-of-line:** `let likes = $derived(post.likes); // **RIGHT:** creates a continuous, **REACTIVE** relationship` — the recommended pattern, takeaway word in caps.

3. **The numbered-step sequence across three lines:**
   ```
   likes += 1;        // 1. optimistic override: increment **LOCALLY** immediately
   await like();      // 2. tell the server to **SAVE** the change
   likes -= 1;        // 3. rollback: if the request failed, **REVERT** the override
   ```
   — a three-step narrative told as three aligned comments; the reader's eye tracks down the bubbles and reads the story.

4. **The one-line gotcha:** `let { title } = $props(); // **WRONG:** severs the **REACTIVE** connection to the prop` — the comment names the exact consequence beside the offending line.

5. **The three-way contrast block:**
   ```
   let a = $state(data);               // **WRONG:** initializes once, then goes **DEAF**
   let b = $derived(data);             // **RIGHT:** listens forever, but is **READ-ONLY**
   let { c = $bindable() } = $props(); // **RIGHT:** listens forever AND is **WRITABLE**
   ```
   — three lines, three contrasting caps words; the comparison lives in the bubbles, not in prose.

**What makes a good comment.** Because the bubble hangs directly under its code line, it must be short and self-contained — a verdict word, a step number, or a one-phrase gloss, plus one caps load-bearing word. It is a *label* for the line, not an explanation of the line; explanations belong in the prose around the snippet. If a comment needs more than roughly one short sentence, it is too long for the bubble — move that material into prose and leave a shorter label on the line.

**The anti-pattern (do not do this).** The following, taken from an early draft of lecture 02, is exactly wrong — every comment is a comment-only line parked above the code it describes:

```
// ✔️ 1. CSS is extracted and scoped with a hash
const h1 = document.createElement('h1');
```

On screen this renders as a `➔`-prefixed annotation with no code beside it, followed on the next row by code with no annotation. The reader cannot pair them. The correct form attaches the comment to the line it labels:

```
const h1 = document.createElement('h1'); // 1. the **DOM** element is created via JavaScript
```

### Comment appearance and conventions

Comments in lecture code blocks are not styled like ordinary code. They have their own visual treatment designed to make the *meaning* of a line jump out, separate from the *mechanics*. The in-project demo of the comment features is **`md-lectures/23.md`** (multi-line bubbles, merged comments); the dense historical reference is `../svelte-lecture-01/md-lectures/49.md`. Open the built `md-lectures-html/23.html` alongside the source `.md` to see exactly how each comment style renders.

**Visual treatment of every comment:**

- **A bubble, not an arrow.** Every comment renders as a white speech bubble with a grey border and a small tail, pointing up at the code line it annotates. The bubble sits directly below that line, indented to line up under the code.
- **Serif italic text.** Bubble text uses Georgia (Times fallback), italic, at roughly the code's size — a typographic shift that signals "annotation, not code" without a color change.
- **`**bold**` renders as a tag chip.** Bold runs in comments render as monospace, tag-styled bold, used for the caps load-bearing word.
- **Multi-line bubbles.** A comment containing `<br>` renders as a taller bubble with the lines stacked; the build also merges consecutive comment-only lines into one bubble joined by `<br>`.

**Comment content conventions (the author's job):**

Comments in this project are not neutral developer notes. They are **pedagogical annotations** that teach the reader what the line *does* or *means* in the context of the lecture. Three patterns appear throughout lecture 49 and should be the model for new lectures:

- **Verdict comments with a leading word**: start the comment with `**RIGHT:**` (recommended pattern) or `**WRONG:**` (trap) so the reader instantly knows whether the line is a pattern to copy or a trap to avoid. Do not write `✔️`/`✖️` glyphs: the build strips them, so they cost effort and render nothing. Examples adapted from lecture 49:
  - `// **WRONG:** reads initialCount **ONCE** during creation` — a trap; the line is shown to warn against it.
  - `// **RIGHT:** creates a continuous, **REACTIVE** relationship` — the recommended pattern.
  - `// **WRONG:** mutating state here is a **COMPILE ERROR**` — a trap with the specific consequence called out.
- **`**CAPS**` for the single load-bearing word.** Wrap the one keyword that carries the lesson in bold-uppercase. The highlighter renders `**REACTIVE**` as `<b>REACTIVE</b>` — bold, in a darker grey (`#374151`) than the surrounding comment text. Use this for the term the reader must take away from the line: **REACTIVE**, **DEAF**, **READ-ONLY**, **WRITABLE**, **LOCALLY**, **SAVE**, **REVERT**, **ONCE**, **SOURCE**, **FLOW**, **LOGIC**, **UPSTREAM**, **CLONED**, **COMPILE ERROR**. One per comment, occasionally two — never a whole sentence in caps.
- **Numbered steps inside a single snippet.** When a code block shows a sequence of operations (the optimistic-UI example in lecture 49 is the demo), prefix each comment with its step number: `// 1. optimistic override: increment **LOCALLY** immediately`, then `// 2. tell the server to **SAVE** the change`, then `// 3. rollback: ...`. The numbers survive into the rendered comments, giving the reader a clear path through the snippet.

**Long bubbles wrap by themselves.** A bubble that would overflow the editor width wraps internally onto additional bubble lines. The author does not control this — it happens in the build. If a comment is so long that the wrapped bubble looks awkward, shorten the comment; the code block is not the place for paragraphs.

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
- The three `// ...` comments rendered as speech bubbles below their lines — `Reactive declaration of variable "double"`, `Reactive statement (with side-effects)`, and `Reactive block (multiple lines)` — in the italic serif bubble style

The bubble markup and all `<span>` tags are produced by the build script. The author wrote only `//` comments and plain code.

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

### The Comprehensive Lecture Checklist (MANDATORY FINAL GATE)
Before generating or finishing any `.md` lecture file, you MUST verify every single item on this list. Do not output the lecture until it passes this entire audit:

**1. The Header & Hook**
- [ ] **Typology Tagging:** Does the lecture start exactly with `> INTERVIEW QUESTION | ❱ [LEVEL] | [Question]`?
- [ ] **The Hook (OLA):** Does the opening establish a visceral, real-world, high-stakes scenario?
- [ ] **The Hook Ladder:** Does the body open directly with 5–7 numbered beats (no leading scene line, no hand-written lead) ending on the mystery, with the mechanism term never named, followed immediately by a titled `### ` section that opens the teaching?
- [ ] **The Proper-Scenario Checklist:** Does every ladder beat pass the scenario-clarity gate in the Hook Ladder section — B2 vocabulary for a tired reader, every noun exactly one thing (a person, a thing on the screen, a thing in the code, or a machine event), no bare overloaded word ("editor", "live", "script", "log"), every beat readable alone and out of order, the problem value's logic explained then repeated (logic-first), the change event shown before the stale screen, and no technical shorthand left unpacked?
- [ ] **The Last Beat:** Does the ladder close on a plain promise of what today brings, never on the explanation of the mystery it posed?
- [ ] **Experience-First Definitions:** Does every new concept pass the experience standard — defined through what the reader can point at, starting from their closest known action, or by the visible before-and-after shape when the concept appears in code — and never only through other words?
- [ ] **The One Thing:** Is the lecture built around one visible change (one line, one tag, one file), shown early and alone? Does every abstraction answer a question the reader is already asking, voiced aloud at the moment it arises?
- [ ] **The Headline:** When the lecture's topic is a new part of the file, do the first section and the ladder's promise beat headline that growth, with the story as the demonstration?
- [ ] **Structural Surprises:** Is every construct that breaks the reader's accumulated model of a `.svelte` file (a second block of a kind shown only once per file, a new top-level block, an unfamiliar attribute) taught in prose BEFORE the first fence that shows it — naming the old model, saying the new construct is allowed, and marking what distinguishes it?
- [ ] **Strongest Naive Alternative:** Does the lecture raise and answer the strongest alternative the course has equipped the reader to think of (a prop, an each index), not only weak strawmen?
- [ ] **Deck Cross-Reference:** Did the lecture search earlier lectures for its concepts, re-anchoring and citing `(see Lecture N)` for every term an earlier lecture already baptized, instead of re-teaching it with a fresh metaphor?
- [ ] **Narrative Continuity:** Does the entire lecture stick strictly to this single domain without abrupt context switching? (One exception: the `Where you will meet this` list widens to other apps on purpose.)

**2. The Visual Scaffold**
- [ ] **Component Architecture:** Is there a ````components` explorer panel? (MANDATORY in every lecture, no exceptions. State implies ownership; ownership must be mapped. The build warns on any lecture with zero panels.)
- [ ] **Rendered Content:** Does every end component carry rendered lines computed by hand from the code block's real values (e.g. `<p>Total payout tonight: {totalPayout}</p>` becomes `Total payout tonight: **1475**`) — never empty grey bars, STATUS/ACTION placeholders, or a bare `{value}` token — with only two legitimate exceptions: containers whose children render inside them (unfilled on purpose) and state modules (never render)? See the fill decision procedure and the traceability test.
- [ ] **No Invisible Owners:** Does every prose actor that owns the mechanism (the page that stamps out the copies, the parent that passes the props) appear in a fence or the panel — or has the prose been rewritten to stop leaning on it? Do compound component names have their parts grounded at first appearance?

**3. The Code Executions**
- [ ] **Fenced Code:** Are all code blocks labeled with `title="..."`?
- [ ] **Comment Formatting:** Are all `//` comments strictly at the *end* of the line (no floating bubbles on empty lines)?
- [ ] **Validation Marks:** Do verdict comments lead with `**RIGHT:**` / `**WRONG:**` words? (Never `✔️`/`✖️` glyphs: the build strips them.)
- [ ] **Table Wrapping:** If code strings are inside tables, are they manually wrapped with `<br>` to prevent PDF padding breaks?

**4. The Conclusion**
- [ ] **Use Cases:** Is there a `### Where you will meet this` section right before the Summary — 3 to 5 one-line, pictureable real-app uses of today's concept, each line a concrete moment plus what the concept does there?
- [ ] **Summary Paragraph:** Is there a `### Summary` section wrapping up the narrative?
- [ ] **Takeaways:** Is there a bulleted list of actionable takeaways immediately following the summary?
- [ ] **Comparison Table:** Does the lecture end with a markdown table comparing the Svelte 5 mechanic against Svelte 3/4 or Vanilla JS?

**5. The TTS & Format Safety**
- [ ] **No Em-Dashes:** Are all em-dashes completely removed or replaced with commas/colons for synthetic voice safety?
- [ ] **Paragraph Flow:** Is every paragraph, bullet, and table row on one continuous line without hard wraps?

## Writing with small-context models (the phased workflow)

- **Length standard:** a completed lecture targets **800 to 1,200 words, about 1,000 on average**. ADVANCED questions may run to 1,500. The old 2,500-to-3,000-word rule matched no lecture on disk and produced Summary sections too tall for one page (the split-table bug); it is repealed. Most lectures fit one writing session.
- **Parts are optional.** Split a lecture into parts only when one session cannot write it well (typically long ADVANCED lectures). Write parts to `md-lectures-plan/{n}-part1.md`, `{n}-part2.md`, and so on; start every part session by re-reading the outline (if any) and the previous part's last paragraph, which is how a forgetful model stays continuous. Never leave part files anywhere else.
- **Assemble and build.** Concatenate the parts into `md-lectures/{n}.md`, then run `node src/build-lectures.mjs`. The build prints `note` lines for anything it auto-repaired (for example comment-only lines merged into the next code line) and `warn` lines for format violations: title shape, interview-question line, missing callout, missing `### Summary`, closing-table shape. Fix every warning and rebuild. A clean build is the mechanical definition of done.
- **The polish pass (second model, full edit authority).** After assembly, a different model or a fresh session may edit the finished lecture: add at least one interview `[!TIP]` callout, add or sharpen `[!KEY]` takeaways, tighten the Summary and closing table, and fix every warning the build printed. The polish model ends by running the build; zero warnings is its exit condition. This pass is where interview voice and principles are added deliberately, rather than being demanded from the writer.
- **The audit phase stays as defined above** (on demand, append-only `## Beyond the basics`); it is a content-gap review, not the polish pass.
