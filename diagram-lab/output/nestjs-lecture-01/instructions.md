# NestJS Lecture Series: Project Instructions

This document is the single source of truth for the workflow of the `nestjs-lecture-01` project inside `diagram-lab/output/`. The project mirrors the structure and the authoring logic of the sibling `react-lecture-01`, with one essential difference: this project runs **one pipeline only** — **lectures**. Every question is taught as a long-form lecture; there are no card or data-flow pipelines here. The lecture is the single source of truth for depth.

> **The demo project (structure-only policy).** `../react-lecture-01/` is the demo. Before writing any lecture, open one of its `md-lectures/` files (for example `01.md`) and study it as the model for **STRUCTURE ONLY**: the order of sections, the shape of the opening ladder, where the `components` panel sits, how code comments are disciplined, how the Summary and closing table are built, and how deep a lecture goes. **NEVER take content from it, in any shape or form:** do not copy, adapt, or echo its scenarios, its code examples, its metaphors, its interview tips, its tables, or its technical explanations. The technical content of your lecture comes from exactly two sources: the question row and the local NestJS documentation. The demo teaches form, never substance. It is also the **only** project you may consult: do not open, imitate, or cite **any other project folder** — not `svelte-lecture-01`, not `svelte-lecture-02`, not `svelte-lecture-03`, not `online-demo-01`, not anything else inside or outside `diagram-lab/output/`. When a question about style or structure comes up, the answer lives in this document; when a question about content comes up, the answer lives in the NestJS docs.

> **Project Architecture note.** This project runs a single content pipeline — **lectures** (comprehensive, long-form) — with its own source folder, build step, and HTML/PDF output folders. The pipeline draws from the 200-question NestJS curriculum at `../../questions-nestjs/` (Core & Fundamentals Q1–Q100, Ecosystem & Microservices Q101–Q200). The lecture teaches *how* a NestJS mechanism works, grounded in the running National Times newsroom world: the paper's own backend server, the API that powers its website and mobile app.

## File structure and logic

> THE LECTURES: this is the main source of truth, we start from md-lectures

When user asks "write the lecture for 09 question" then you start with the md-lecture.

### Authoring workflow (no plan phase, no approval gate)

The question bank is the plan: the Question column fixes the topic, the Hook column is the lecture's opening scenario, and the Topic tag fixes the scope. Read the row, then write the lecture directly. **ADVANCED questions only:** if the mechanism has many moving parts (for example the full request lifecycle), you may first save a five-line outline to `md-lectures-plan/{n}.md` as your own working note: the scenario, the three to five section shifts, and where `components` panels will sit. An outline is optional, is never reviewed, and never blocks writing; do not stop or wait for approval.

For lectures that must be written across several small-context sessions, see **Writing with small-context models** at the end of this document: parts are optional, they live in `md-lectures-plan/{n}-part1.md` and following, and a polish pass by a second model follows assembly.

---
➔ md-lectures: The comprehensive lecture source markdown files (the source of truth)
❯ md-lectures-html: The html files of the lectures, from the md files (`/md-lectures`)
❯ md-lectures-pdf: The pdf files of the lectures, from the html files (`/md-lectures-html`), from the md files (`/md-lectures`)

---
src: The build script (`build-lectures.mjs`, `component-explorer.mjs`) and shared stylesheet (`lecture.css`)

## Source of Content

- **Question bank:** `../../questions-nestjs/questions.md` — the 200-question curriculum (Core & Fundamentals Q1–Q100, Ecosystem & Microservices Q101–Q200), each row carrying `# | Tier | Topic | Question | Hook`. This is the single source of truth for every question. The controlled topic vocabulary lives in `../../questions-nestjs/topics.md`.
- **Local NestJS documentation (primary source for lectures):** `documentation official/nestjs/docs.nestjs.com/content/` — the official NestJS documentation as Markdown: `controllers.md`, `providers.md`, `modules.md`, `middleware.md`, `pipes.md`, `guards.md`, `interceptors.md`, `exception-filters.md`, `custom-decorators.md`, `first-steps.md`, `fundamentals/`, `techniques/`, `security/`, `cli/`, `recipes/`, and the ecosystem pages (TypeORM, microservices, queues, and more) in subfolders. Use these as the authoritative technical source for lecture content; cite them by relative path (for example `documentation official/nestjs/docs.nestjs.com/content/controllers.md`).
- **Supplementary research:** when the local docs do not fully answer a question, expand with online research, but always anchor claims back to the local docs when possible.

## Folder Layout

| Folder | Purpose | Author here? |
| --- | --- | --- |
| `md-lectures/{n}.md` | **Lecture source for question `n`.** Long-form Markdown, written FIRST per question. Full formatting (headings, bold, bullets, code fences). One lecture per question, same numbering as the question bank. | Yes |
| `md-lectures-html/` | Build output: per-lecture `{n}.html` plus a combined `deck.html` (the course reader). Never edit by hand. | No |
| `md-lectures-pdf/` | Build output rendered by Prince: per-lecture `{n}.pdf` plus `deck.pdf`. Never edit by hand. | No |
| `src/build-lectures.mjs` | **Lecture build script.** Reads `md-lectures/`, writes `md-lectures-html/` + `md-lectures-pdf/`. | Rarely |
| `src/component-explorer.mjs` | **Component explorer parser and renderer.** Converts `components` Markdown blocks into the generated Finder-style panel. | Rarely |
| `src/lecture.css` | Long-form article stylesheet used by the lecture HTML/PDF pipeline. | Rarely |

## Component Explorer Panels and the Intro Component-Tree Gate

Every lecture must actively consider whether its core logic needs a generated **component explorer panel**, the project's properly designed architecture visual, as an introductory reference. Use the panel whenever understanding the mechanism depends on seeing where something lives, which file owns a responsibility, what is nested or wired together, or what the observable outcome of a request is. A graph with several files (module, controller, service) is the obvious case, but it is not the only case: a single file that owns an important endpoint, a lifecycle hook, or a cross-cutting concern (a guard, a pipe, a filter) can also require the panel. The panel is the lecture equivalent of a Finder-style reference: a project title bar across the top, a connected file hierarchy on the left, and the runtime wiring or the observable response on the right. It is generated HTML, not a screenshot and not hand-authored markup.

### The intro architecture visual-reference gate

Before writing the first code fence for the lecture's central mechanism, answer these questions in the working plan:

1. Does the learner need to know which file owns the endpoint, the data, or the behavior?
2. Does the mechanism depend on file wiring, a module boundary, dependency injection, or the order in which the framework calls each piece?
3. Would seeing the relevant files and the observable response before the code remove ambiguity that prose alone leaves behind?

Every lecture MUST include at least one `components` panel, no exceptions: the questions above decide what the panel must show, never whether one exists. Place it after the visceral opening and a short prose description of what the learner is looking at, but before the first NestJS code fence that implements the mechanism. The panel is the learner's visual map, not an optional recap after the implementation. The generated component explorer is the required proper design; an ASCII tree, prose-only description, comparison table, or diagram placed after the code does not satisfy this gate.

A single `.ts` file is not an automatic reason to omit the panel. A decorated method that receives a validated DTO is the canonical example: the learner benefits from first seeing the owning controller, the service it calls, and the observable response that exact path produces. Use a single-root panel with the appropriate visual kind and a concise annotation naming the request path and its handler.

There is no omission path: no lecture ships without a `components` panel. If a mechanism looks wiring-free, use a single-root panel naming the owning file and its observable outcome. The build prints a warning for any lecture with zero panels, and a clean build requires at least one.

### When to use a panel

Use one panel when the surrounding lecture example contains one coherent structural model and the reader benefits from seeing both the file wiring and the observable result. Good cases include a module importing a controller, a controller delegating to a service, a service injected into another service, a guard standing in front of a route, a pipe transforming an argument before the handler runs, or a repeated endpoint pattern across one controller.

Do not merge unrelated code fences into one panel merely because they use more than one `.ts` filename. Independent examples stay independent. A separate multiple-instance case is different again: one file's handlers hit several times is not a parent-child file tree, so use the `instances` visual kind described below.

### The visual-first presentation rule

The file wiring or ownership model is the learner's destination, so show that destination before showing the code that builds it. Whenever a lecture introduces a multi-file relationship, a repeated arrangement, or request-scoped logic that passes the intro visual-reference gate, use this order:

1. **Name the intended visual arrangement in prose.** State what the server does when the request arrives, which file owns each step, and what the observable response is. Use the real example's names and stakes so the panel is an explanation, not decoration.
2. **Place the `components` block immediately after that visual explanation.** The generated panel is the first visual representation of the relationship and must appear before the first NestJS code fence that implements that relationship. Do not place a panel after the code as a recap.
3. **Read the panel as a model.** Explain the left file tree as the source relationship and the right canvas as the runtime wiring. For a single-root case, name the owning file, the request path, and the response it returns. For nesting, explain which file lives inside which wiring (a controller inside a module, a service used by a controller). For branches, explain which handler answers under each condition.
4. **Show the code in dependency order.** Start with the module or outermost wiring, then the controller, then the service or inner definition, then show the interaction or variant that completes the visual model. The code should match the panel's filenames, annotations, and nesting.
5. **Derive the mechanism after the code.** Once the learner has the visual target and its implementation in view, explain why NestJS produces that wiring and what happens when the request actually flows through it.

This rule applies to every component panel. A lecture may still show an earlier standalone code example when that example establishes a prerequisite, but the first code for the structural relationship itself must follow its visual panel.

### Markdown authoring syntax

Place a `components` fenced block immediately after the prose that explains the intended visual relationship and before the first NestJS code fence that implements it. The fence is consumed by `src/build-lectures.mjs` and becomes the complete explorer panel in the generated lecture HTML.

````
```components title="national-times-api — Component Explorer"
app.module.ts | wires every feature | shell
  users.controller.ts | GET /users | navigation
    users.service.ts | findAll() returns the roster | card
```
````

For a single-file mechanism, use a single-root panel rather than inventing unrelated components. The visual kind should match the observable surface, and the annotation should identify the exact local relationship:

````
```components title="national-times-api — Component Explorer"
stories.controller.ts | POST /stories receives the DTO | form
```
````

The syntax has one entry per line:

- **File name:** The first field is a bare filename: `app.module.ts`, `users.controller.ts`, `users.service.ts`, `main.ts`. Never write path prefixes such as `src/users.controller.ts`; the build assigns every `*.controller.ts` to the `controllers/` folder, every `*.service.ts` (and `*.repository.ts`) to `services/`, every `*.module.ts` to `modules/`, and everything else (`main.ts`, DTOs, guards, pipes, filters, interceptors, entities) to `src/`, so the left tree is always the canonical top-level shape.
- **Indentation:** Use exactly two spaces per nesting level. The first entry is the single root. A nested entry is rendered inside its parent on the right canvas; test files (`*.spec.ts`, `*.test.ts`) are listed in the left file tree only and never render on the canvas.
- **Displayed context:** The optional second field, after the first `|`, is a short route, dependency, or responsibility annotation. It appears in italic text beside the file label.
- **Visual kind:** The optional third field selects a small deterministic mock surface. Supported kinds are `shell`, `header`, `navigation`, `profile`, `badge`, `counter`, `card`, `form`, `table`, `button`, `branch`, `instances`, and `generic`. If omitted, the builder infers a kind from the filename (module → shell, controller → navigation, service → card, guard/middleware → badge).
- **Observable outcome (the fourth field):** The optional fourth field is what the learner can actually observe when this code runs: the HTTP response body, the status line, or the console output the lecture's code produces, written by the author, individual lines separated by `;;`, with `**bold**` allowed for the load-bearing value. When present, it replaces the kind's mock surface on the canvas (the kind still sets the frame color and label). This field is mandatory for every new panel; see the rendered-content rule below.
- **Window title:** The `title="..."` attribute is the project title shown in the panel's top bar. Use a short project name followed by `— Component Explorer`.

**The rendered-content rule (no empty surfaces).** The deterministic mock surfaces (grey bars, STATUS, ACTION) are placeholders of last resort, never a design choice. Every new panel must show what the learner would actually observe, through the fourth field, and that means the author must ALWAYS compute the observable outcome before writing the panel: run the lecture's code in your head with the real values from the snippet and write down what the response or console shows. A method call is invisible to the learner until you evaluate it; `getPayoutTotal()` with tonight's three stories (800 + 1200 + 950 words at rate 0.5) returns `1475`, and the panel must say so. The numbers in the panel are arithmetic performed on the numbers in the fence: if the code changes, the panel changes with it. An empty box or a row of grey bars where a computed response should be reads as broken and teaches nothing — it is the panel equivalent of a floating comment bubble, a shape pointing at no content.

**When emptiness is legitimate (the fill decision procedure).** A filled surface is always preferred, but filling everything would be its own absurdity: a wiring container decorated with invented chrome is out of context. Decide per entry, in this order:
- **A leaf file, one that produces an observable outcome (an endpoint handler, a service method with a return), always gets rendered lines**, computed from the code block's values. This is the default and covers nearly every entry: a returned object, a status code, a console line are all knowable. If the code block shows it, the panel shows it, evaluated.
- **A leaf file whose code block shows no observable outcome** gets its one thing the learner would see happen, taken from the lecture prose ("prints Server listening on 3000 at boot"), and flagged to the owner as inferred. Never invent visible chrome the lecture never establishes.
- **A container whose children render inside it stays unfilled, on purpose.** Its behavior is the nested children, and the build already draws them inside its box; adding invented lines would be decoration, not content. This is the only legitimate emptiness on the canvas, and it is not really emptiness: the box is filled by its children.
- **A test file never renders.** It lives in the left file tree only; the build filters it off the canvas. Giving it lines would lie about what spec files do.

**The traceability test (the guard against absurd fills).** Every word in a rendered-lines field must be traceable to one of three sources: the code block's return values, the code block's starting values, or the prose's explicit description of the observable behavior. A line whose content cannot be traced to one of those is invented filler; delete it. This is what keeps "prefer filled" from becoming "make things up": the fill always comes from the lecture, never from the author's imagination of a plausible app.

**Worked example (a payout endpoint).** The code block ends with `return { total: this.payoutService.getTotal(stories) };`, and the panel entry must carry that response, evaluated:

````
```components title="national-times-api — Component Explorer"
payout.controller.ts | GET /payout/tonight | table | Harbor strike · 800 words;; Election night · 1200 words;; City budget · 950 words;; "total": **1475**
```
````

The right canvas now shows the story list and, bolded under it, the total the learner's code will actually return: `"total": 1475`. The same entry written without the fourth field (`payout.controller.ts | GET /payout/tonight | table`) renders three empty grey bars — the exact failure this rule exists to prevent.

The same file may appear more than once in the right-hand tree when the example registers several handlers with different routes:

````
```components title="national-times-api — Route Explorer"
stories.controller.ts | | shell
  stories.controller.ts | GET /stories | button | 200 OK;; [ ...stories ]
  stories.controller.ts | POST /stories | button | 201 Created;; "id": 4102
```
````

For one file's pattern applied repeatedly, use the `instances` kind instead of inventing a parent file. Include the count as a number in the second field so the renderer can calculate the instance chips:

````
```components title="national-times-api — Handler Instances"
stories.controller.ts | 5 endpoints each with own service call | instances
```
````

For mutually exclusive conditional handlers, keep both branches under the parent and put the condition in the second field:

````
```components title="national-times-api — Conditional Routes"
app.controller.ts | featureFlag | shell
  legacy-feed.controller.ts | when featureFlag is off | branch
  feed-v2.controller.ts | when featureFlag is on | branch
```
````

### What the builder calculates

The author supplies only the file model. The builder validates the indentation, requires one root, normalizes paths, deduplicates repeated files in the left tree, derives the `controllers/`, `services/`, `modules/`, and `src/` folders from the filename suffix, marks the feature child as active, renders the nested wiring boundaries, escapes labels and annotations, chooses the deterministic mock surface for each visual kind, and renders the author-supplied fourth-field lines in place of the mock surface whenever they are present. The CSS in `src/lecture.css` owns the panel's dimensions, colors, tree connectors, responsive stacking, and print behavior.

The explorer is a visual explanation of the wiring; it does not execute NestJS code. Keep the ordinary titled code fences as the technical source of truth, and keep the explorer metadata short enough that a reader can compare the panel with the code immediately beside it.

### The canonical example scaffold (top-level folders, files one level deep)

The left tree has one fixed shape, built for minimal visual real estate: **top-level folders, each holding bare filenames directly. Nothing nests deeper than one level.**

- **`controllers/`** holds every `*.controller.ts` file: `users.controller.ts`, `stories.controller.ts`.
- **`services/`** holds every `*.service.ts` (and `*.repository.ts`) file: `users.service.ts`, `payout.service.ts`.
- **`modules/`** holds every `*.module.ts` file: `app.module.ts`, `users.module.ts`.
- **`src/`** holds everything else: `main.ts`, DTOs (`create-story.dto.ts`), guards, pipes, filters, interceptors, entities. It appears only when the lecture actually has such a file.
- Authors write **bare filenames** in `components` blocks (`users.controller.ts`, `main.ts`) — never path prefixes such as `src/users.controller.ts`, never nested folders. The build computes the grouping from the filename suffix, so the tree is always the canonical shape however the entry was written.
- **Imports must reflect this structure:** within `controllers/`, `import { UsersService } from '../services/users.service'`; from a controller to a DTO, `import { CreateStoryDto } from '../src/create-story.dto'`. NestJS imports omit the `.ts` extension; the build's completeness check strips the suffix on both sides, so `./users.service` matches the tree entry `users.service.ts`.
- **Exception:** when a question's subject IS a folder structure (Ecosystem & Microservices questions from Q101 on: the microservice transport split, hybrid application wiring, monorepo libraries), the tree may show those real folders, because the folders are the lesson. For Core & Fundamentals lectures there is no exception.

**The completeness law:** every file the lecture shows, as a fence `title="..."` or as an import target, MUST appear as an entry in the lecture's `components` panel tree; the tree in turn shows no file the lecture never mentions. The tree is the contract between prose, fences, and panel. The build warns on any shown or imported file that is missing from the tree. (Because NestJS imports omit the `.ts` extension, the comparison normalizes `app.module.ts` and `./app.module` to the same key. Test files are valid entries; they appear in the **left file tree only**. The right canvas shows the **runtime wiring only** — a spec file never runs in it, so the builder filters test files out of the canvas automatically.)

**The prose-actor law (no invisible owners).** The completeness law binds the tree to files the lecture fences or imports, but prose often invokes an actor that is never fenced at all: "the framework instantiates the service", "the guard stops the request before the handler". When such an actor owns the mechanism — it decides what runs, it passes the data, it triggers the response — leaving it out of every fence and panel leaves the mechanism ownerless on screen: three endpoint chips floating with no controller and no visible source of the responses. That floating is the reader's "what is going on?" moment, the exact question the panel exists to prevent. Either fence the actor (show the module registering the controller, which gives the tree a real parent), or rewrite the prose so it stops leaning on the invisible actor. The rule extends to names: a compound file name (`UsersService`, `StoryFeedController`) must have its parts grounded in prose at its first appearance — one sentence saying what each noun of the name means — so the name reads as one explained idea instead of two missing files.

### Placement and quality rules

- Add the panel at the smallest useful scope, immediately before the module/controller/service code blocks that form the graph.
- For a single-root ownership panel, place it in the introduction to the mechanism, immediately before the first code block that creates or uses the relationship.
- Use the actual filenames and actual route or dependency names from the example. Do not add decorative files that the lecture never mentions.
- Use one panel for one relationship. If a lecture moves from a module-controller example to an unrelated standalone service, start a new panel or omit the panel.
- Use `branch` for conditional alternatives, `instances` for repeated copies of one definition, and ordinary nesting for wiring composition.
- The left tree and right canvas are generated together; never hand-write a second HTML version of the panel in a lecture file or in `md-lectures-html/`.
- A malformed `components` block should be fixed in the Markdown source rather than hidden with custom HTML or a special-case CSS patch.

This convention applies to every pertinent lecture example. The generated HTML remains build output and must be refreshed with `node src/build-lectures.mjs --no-pdf`. When the source or layout changes are ready for delivery, run `node src/build-lectures.mjs` to regenerate both the HTML and PDF outputs.

## Build Commands

This project uses **one local builder**, invoked from inside the project folder.

```sh
# Lecture pipeline:
node src/build-lectures.mjs            # build lecture html + pdf
node src/build-lectures.mjs --no-pdf   # build lecture html only
```

The pipeline produces per-file HTML/PDF plus a combined `deck.html`/`deck.pdf` (the course reader for lectures). The build script gracefully reports `no markdown files in md-lectures/` and exits cleanly when the source folder is empty — so it is safe to run the pipeline before any content exists.

## The Lecture-First Workflow

For every new question processed in this project, the following steps are executed in exact order. There is no card or data-flow step in this project; the lecture is the whole deliverable.

### Step 1: Write the lecture (`md-lectures/{n}.md`)

- Extract question `n` from the source document.
- **Search the deck before teaching a term.** Concepts repeat across the 200 questions, and the reader meets them in order. Before baptizing any term, scan the earlier lectures for it (search `md-lectures/` for the hook name, the API name, or the concept phrase). If an earlier lecture already taught it, this lecture re-anchors instead of re-teaching: the term, its one-line reminder, and `(see Lecture N)` — then it may deepen, contrast, or extend, but never start from zero with a fresh metaphor. Two lectures teaching one concept with two metaphors and no cross-reference ("guard" in one, "gatekeeper" in the other) double the reader's vocabulary for a single idea and leave neither lecture the term's home.
- Read the relevant local NestJS documentation under `documentation official/nestjs/docs.nestjs.com/content/`. Anchor every technical claim to the docs when possible; expand with research when the docs are insufficient.
- Write a **pedagogically clear, extended, comprehensive lecture** that teaches the concept as if to someone who needs to genuinely understand it, not just memorize it.
- The first line is `# Lecture {n}: {Short Title}`.
- Apply the **Lecture format spec** below.
- Run the **intro architecture visual-reference gate** before drafting the first code example for the central mechanism. If ownership, wiring, boundary flow, or the order of execution matters, introduce the logic with a `components` panel before that code. Do not exempt a lesson merely because its main example uses one `.ts` file.
- In the lecture, always add code snippets that are clear, concise, representative of the idea

Example of snippet (add the file name on title)

```ts title="stories.controller.ts"
import { Controller, Get } from '@nestjs/common';
import { StoriesService } from '../services/stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private readonly stories: StoriesService) {} // the framework injects the service, you never call new

  @Get()
  findAll() {
    return this.stories.findAll(); // the return value becomes the JSON response body
  }
}
```

Important: notice that "the response" arrives through the return value. You never touch the HTTP response object by hand; whatever the handler returns, the framework serializes it as the JSON body.

### Step 1b: The Organic Lexical Audit (OLA)

Before finishing any lecture, you MUST run the OLA to ensure no jargon is introduced superficially.
1. **Scan the text** to find lexical terms a newbie would not be familiar with (e.g., *decorator, provider, dependency injection, middleware, guard, interceptor, DTO, module*).
2. For each term, you must write a **Specific Organic Intervention** that follows this exact 5-step progression:
   * **Step 1: The Context.** State what the user is trying to achieve. **CRITICAL RULE: The example must be a *truly practical* problem the developer actually faces in modern workflows, not a theoretical or imaginary one.** Do not artificially make up a scenario that modern scaffolding (like the Nest CLI) solves automatically just to check this box. If the boilerplate handles the basics, find the *real* situation where they hit the wall. For example, instead of a vague "Why is my controller not working?" (which the CLI generates for them), use "The same tax logic is copy-pasted into three controllers; how do you extract it so the invoice generator reuses it?" or "The service needs database credentials at boot; where do they come from when nobody calls `new` on it?". Find the real-world, high-stakes scenario where the newbie physically hits a wall.
   * **Step 2: The Naïve Alternatives.** Pose highly specific, tangible, and simple alternatives for how this could be done. **The first alternative posed must be the strongest one the course itself has equipped the reader to think of.** Ask: what tool from an earlier lecture partially solves this scenario? If services were taught and extracting the method would plausibly work, raise that alternative and answer it — why it fails here, or what it cannot do — before any weaker strawman such as a separate file or "a helper function". A lecture that dismisses only weak alternatives, while the reader's actual first thought ("why not just instantiate it myself?") goes unasked, has a motivation hole: the tool never becomes necessary and the scenario reads as contrived.
   * **Step 3: The Architectural Need.** Frame this explicitly as an architectural decision or mechanical requirement. (e.g., *"This is a decision about the architecture of our server. We have to make sure that when the paper publishes a story, every reader-facing surface reads the same data without each endpoint rebuilding the logic."*)
   * **Step 4: Naming the Term.** Now, and only now, introduce the lexical term as the name for this mechanism. (e.g., *"This mechanism is called dependency injection."*)
   * **Step 5: The Summary.** Summarize what the term does using the context just built. (e.g., *"Dependency injection means the framework builds your service's dependencies for you: you declare what you need in the constructor, and the container supplies a ready instance."*)
3. **Integrate** this specific 5-step intervention into the text, replacing the original superficial use of the term.

## The Audit Phase (on-demand, runs only when the user asks)

The steps above are the standard authoring flow for one question. The audit is **not** part of that flow — it is a separate, on-demand phase that runs only when the user explicitly asks for it (for example, "audit lecture 47"). Treat the audit as a second pass performed by a fresh, critical reader whose only job is to find what the original lecture missed. The point of running it as a separate phase, after the lecture is finished and only on request, is to simulate an independent review: the author is done, the lecture exists, and now a different perspective asks "what did this leave out that a student will actually need?"

### When to run the audit

- **Only when the user asks.** Never run the audit automatically as part of the authoring flow. The audit is a deliberate, requested review, not a default step.
- **Only on a finished lecture.** The audit makes no sense on a draft or a half-written lecture; it assumes the lecture is complete and has been built to HTML/PDF at least once.
- **One lecture at a time.** The user will name the lecture (e.g. "audit lecture 47"). Do not audit multiple lectures unless explicitly asked.

### How to run the audit

- **Read the lecture end to end** in `md-lectures/{n}.md`. Note every concept, term, and example it covers.
- **Cross-check against the authoritative local docs.** Open the relevant files under `documentation official/nestjs/docs.nestjs.com/content/` for the lecture's topic. The audit's authority comes from comparing what the lecture says against what the docs say — not from the auditor's prior knowledge. If a doc section exists that the lecture did not draw on, that is a candidate gap.
- **Look for genuinely missing material, not stylistic preferences.** The audit is not a rewrite. It looks for: related API surfaces the lecture did not mention (e.g. `@Session()` when the lecture covered `@Req()`), alternative patterns for the same problem (e.g. a pipe when only a manual check was shown), common pitfalls the lecture did not flag, and adjacent concepts a student would naturally need next.
- **Do not duplicate what the lecture already says.** If the lecture covered it, even briefly, do not include it in the audit. The audit's value is net-new information.

### How to write the audit findings

- **Append a single new section at the end of the lecture** titled exactly `## Beyond the basics`. Do not modify or rewrite any existing section of the lecture — the audit adds, it does not edit.
- **The section is a bulleted list.** Each bullet follows the format: `- **Bold lead phrase**: explanation ...`. The bold lead phrase names the missing topic in 3–7 words; the rest of the bullet explains it in plain English with the relevant API name, code identifier, or cross-reference inline.
- **Each bullet is self-contained.** A student reading only the bullets (skipping the lecture body) should still understand what each missing topic is and why it matters. Define every technical term inline, the same jargon rule as the rest of the project.
- **Cross-reference other lectures and the docs by path or number** when relevant (`see Lecture 50`, `see Lecture 21`, `documentation official/nestjs/docs.nestjs.com/content/pipes.md`). The audit is a hub for "where to go next," and explicit pointers are part of its value.
- **Order the bullets by relevance**, not by source-doc order. The most commonly needed missing topic goes first; the most niche goes last. A reasonable size is 4–8 bullets — enough to be useful, short enough to read in one sitting.
- **Do not add new code blocks to the audit section.** The audit is high-density prose. If a code example is genuinely necessary to explain the missing topic, that is a signal the topic belongs in the lecture body, not the audit — flag it in the response to the user instead of adding it inline.

### After writing the audit

- **Rebuild the lecture** with `node src/build-lectures.mjs` so the HTML and PDF reflect the new `## Beyond the basics` section.
- **Verify the section rendered correctly**: confirm the `## Beyond the basics` heading is present, the bullet count matches what was written, and the section sits at the very end of the lecture (after Summary, if one exists).
- **In the response to the user, list the specific gaps the audit found** and why each was added. The user asked for an audit; they should see the audit's reasoning, not just its output. Cite the doc section that surfaced each gap.

## Lecture Format Spec

The lecture pipeline uses a full Markdown renderer (`src/build-lectures.mjs`). There are no card-specific constraints in this project — you may use any combination of standard Markdown.

- **Plain markdown with full formatting.** **bold**, *italic*, bullet lists, numbered lists, inline `` `code` ``, fenced code blocks with optional `title=""`, blockquotes, and inline `[text](url)` links are all supported and render correctly to HTML and PDF. (See the **heading rules** below for the specific roles of `#`, `##`, and `###`.)
- **The interview question is embedded in the lecture source** — it is the second line of every lecture file, immediately after the title, as a blockquote with the exact pattern `> INTERVIEW QUESTION | ❱ [TYPOLOGY] | <question text>`. The typology is `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`, copied verbatim from the Tier column of `../../questions-nestjs/questions.md` (the bank uses the same three tiers across both parts, with no suffix). The build script parses this line and renders it as a pull-quote callout **directly below the title** (an `<aside class="interview-question">` styled by `src/lecture.css`), including a premium badge for the typology. The visual order matches the source order: title first, then the question, then the lecture body. The author copies the **Question** column verbatim from `../../questions-nestjs/questions.md` (row `n`) when creating the lecture and may edit it inline afterward. The build does not read `questions.md` — the lecture file is the single source of truth for its own question.
- **Long-form, not summary.** Aim for comprehensive coverage of the concept. The lecture is the source of depth for the whole project.
- **Lead with critical questions and visceral pain points (Organic Lexical Audit - OLA).** Always introduce new lexical terms using visceral, real-world, high-stakes contexts. Don't just explain a feature theoretically—create a scenario where a newbie would physically hit a wall without it (e.g., "if the client sends the age as the string `"25"`, the database query fails and the signup is lost"). Open each lecture by surfacing this real-world failure or confusion that motivates the concept. Build tension before revealing the solution.
- **Give structural logic an introductory visual reference.** Immediately after the opening establishes the pain and before the first code that implements the central mechanism, run the **intro architecture visual-reference gate** from "Component Explorer Panels and the Intro Architecture Visual-Reference Gate." If the learner must understand file ownership, wiring, module boundaries, or the order of execution, place the matching `components` panel there and explain how to read it. This is mandatory even for a single-file example when the file-to-response relationship is the mechanism; a decorated route handler is the canonical case.
- **Combine theory, technical definitions, and practical examples.** Every lecture should braid three threads: (1) the formal definition of the mechanism, (2) why it exists and what pain it removes, and (3) at least one concrete code example drawn from realistic NestJS code.
- **Earn a new technical term before you name it.** When a concept is about to land — especially one that looks imposing at first glance — do NOT rush straight into the jargon. If a reader is still wondering *why this thing even needs to exist*, hitting them with the formal vocabulary (the decorator names, the lifecycle hooks, the request pipeline) feels estranging rather than enlightening; the term arrives before its necessity does, and complexity reads as overwhelm. The fix is a short orienting paragraph that first establishes the human problem the machinery solves, and only then introduces the term as the name for that solution. The term should feel like a relief — "oh, *that's* what this is called" — not a wall.

  **Worked example — introducing decorators.** Do NOT open by listing `@Controller`, `@Get`, and `@Injectable` cold. A reader who has written plain TypeScript has a model where a class is just a class. Instead, earn the vocabulary with an intro paragraph like this:

  > Every endpoint needs two facts recorded somewhere: which URL path it answers, and which HTTP verb it listens for. The class itself cannot hold those facts; a method name like `findAll` says nothing about `GET /stories`. Something must attach a label to the class and to each method, a label the framework can read at boot when it builds the route table. The label must live right on the declaration it describes, so the route and the code sit on the same line of the file.

  Only after that grounding does the term arrive as the name for what the reader already understands: those labels are called **decorators**, the `@`-prefixed words stacked on top of classes and methods, and NestJS reads them at boot to wire the routes. The named vocabulary now labels a concept the reader already holds; it does not introduce one they do not.

  This rule is the **front half** of the jargon rule directly below. First earn the term (this rule); then, once named, define it immediately in plain English (the next rule).
- **Explain every difficult term inline.** The same jargon rule applies: keep the technical term, then immediately define it in plain English in the same sentence. Pattern: `a **provider** — a class the framework can create, hold, and hand to whoever asks for it by type`.
- **Ground every new term in what the reader has already done or seen, never only in another term.** A definition built from other technical words defines one unknown with more unknowns. Find what the reader has already done or seen in this course that *is* the term, and define the term from there. The full standard, with the pattern, is **The experience standard** below.
- **These instructions supply method, never wording.** No phrase from this document — a rule name, a worked case, an analogy, an example sentence — may appear in a lecture. When a rule shows you a sentence, that sentence shows the move; write your own sentence for your own case.
- **Teach a structural surprise before the fence that shows it.** Lecture by lecture, the reader builds a model of what a NestJS file can contain — whatever the course has shown them so far. When a lecture introduces a construct that breaks this model, the surprise itself is content, and it must be taught in prose ahead of the first fence that shows it. The prose does four things: it names the model the reader holds; it tells the reader, in the lecture's own words, that the construct is allowed and normal; it places the construct against the familiar one (where it sits, and what marks the difference — an `@` word stacked above the class, a constructor parameter nobody passes an argument for, a class with only properties and no methods); and it anchors to the form the reader has already used in earlier lessons. Structural surprises in this course include: a word starting with `@` stacked above a class when the reader's model says classes stand alone, a constructor with parameters the caller never supplies (the framework passes them), a class whose only content is property declarations (a DTO), a file that only wires arrays (a module), a parameter decorator like `@Body()` marking where each argument comes from, or a handler that returns an object instead of calling a response method. Worked case, told as the cooking analogy: every recipe in the course so far has used milk, so the reader's model of a recipe is "ingredients plus milk". One day a recipe quietly shows butter going into the same pan, and the reader stalls: wait, butter and milk, together in one recipe? Is that even allowed? The prose above the recipe must answer before the question forms. In code the shape is identical whenever a fence contains a construct in a place the reader's model says is impossible; the four prose duties are the same. A fence that breaks the model silently forces the reader to rebuild it mid-code — the exact moment they stop following.
- **Numbering.** Lecture file `{n}.md` corresponds to question `{n}` in the source bank, so any artifact can be cross-referenced by number.
- **Every lecture has a `### Where you will meet this` section, right before `### Summary`.** The mechanism is taught first; this section then answers the reader's natural next question: where does this show up in real backends? It is a list of 3 to 5 uses, one line each. The first line may be tonight's own case; the rest are other systems the reader knows. Every line is one pictureable moment plus what the concept does there (shape: "the login endpoint refuses a bad token before any handler code runs: the guard answers first"). Each line passes the experience standard — a concrete situation, never an abstract category. No more than five lines. This section is the one sanctioned widening of the lecture's world: the story never switches worlds; this list surveys other places on purpose.
- **Every lecture closes with `### Summary` plus a comparison table.** This is a hard structural rule, not an optional flourish — the lecture is incomplete without both. The closing has two parts, in this order:
  1. **`### Summary`** — **The Streetwise Review**. The body of text under `### Summary` MUST begin with an authoritative **Technical Title** formatted in bold (`**Technical Title**`) that encapsulates the architectural mechanism, followed by an empty line, before the opening review paragraph begins. Instead of a dry academic recap, adopt the perspective of an experienced developer giving streetwise advice to a junior colleague. Tell them *when* they will actually write this code (Once per app? In every controller? Never?) and *why* it matters in daily practice. **NEVER open the summary with conversational filler or verbal tics such as "Look," or "Look, in practice...".** State the practical reality or daily developer frequency directly (for example: "In daily production, you configure the bootstrap file exactly once per app...", or "Every endpoint in your codebase is reachable through...").
     - **Structure**: Break the summary into logical sections starting with `❒ {Subtitle}`.
     - **Bullets**: Use numbered lists (`1.`, `2.`) for points under each subtitle. For sub-points, use indented letters with HTML breaks: `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` so they remain on one continuous line without hard-wrapping.
     - **Principles**: Start important principles with the `➔` arrow symbol (e.g., `➔ NEVER do this...`, `➔ ALWAYS do this...`, `➔ IF you want to **do this** THEN **do that**`).
     - **Emphasis**: ALWAYS bold key words or phrases in every bullet to make it skimmable. Keep it to roughly one page.
  2. **A comparison table** — a markdown table immediately below the Summary that contrasts the lecture's mechanism against its nearest alternative (e.g. a NestJS controller versus an Express route handler, a pipe versus a manual check, a guard versus a middleware check, NestJS versus Express). Two or three columns: the dimension on the left, the alternatives across the top.
  **Table Alignment Formatting:** You MUST right-align the first column (the row headers) and left-align the remaining columns. Use the exact markdown syntax `| ---: | :--- | :--- |` for the divider row. This is the visual anchor that lands the "what makes this different" point, and it is what the audit phase and the reader all lean on. If the lecture genuinely has no meaningful contrast (rare), substitute a "what to remember" two-column table of term → one-line definition, using the same `| ---: | :--- |` alignment.
  **Table Code Formatting (CRITICAL — No Auto-Wrapping of Code):** Table columns in the PDF are narrow (~240px). If an inline code string is long or contains slashes, dots, or parentheses, Prince will wrap it mid-token (e.g. `@Controller` on one line and `('users')` on the next, or `ParseIntPipe` broken after `Parse`), producing ugly broken grey boxes with dangling padding. To completely prevent this:
  - ALWAYS separate explanatory prose from code with `<br>`: `Documented at<br>`controllers.md`` instead of `Documented at `controllers.md``.
  - ALWAYS split multi-part expressions or method chains across separate backtick spans with `<br>`: `@Controller`<br>`('users')`, or `constructor`<br>`(private users:`<br>`UsersService)`.
  - ALWAYS split long identifiers across separate backtick spans with `<br>`: `Users`<br>`Service`.
  - Never put `<br>` inside the backticks (`foo<br>bar`); put `<br>` between separate backtick spans (`foo`<br>`bar`).

  This rule exists because the Summary + table pair was an *unwritten convention* in earlier projects and got dropped under context pressure, as did the cleaner right-aligned first column styling. Making the streetwise format explicit here prevents dry recaps and anchors the lesson in reality.

### The experience standard: how a new concept is defined

A new concept can be defined in two ways. Only one of them teaches.

- **Definition through other words.** The concept is explained with other concepts. "It is a class annotated with a decorator." Nothing can be pointed at. The reader memorizes words.
- **Definition through experience.** The concept is explained through what the reader can see, open, or has already done. "In your files you have classes with `@Injectable()` on top, whose methods hold logic other files call. Open one: the controller asks for it in the constructor, the framework hands over a ready instance. Those classes are services." The reader can point at the thing.

Five rules follow:

- **Experience first.** The first definition of a concept always goes through experience. A definition through other words may follow, as a short summary. It never leads.
- **Start from the closest known action.** Find the nearest thing the reader has already done in this course. The new concept is that action plus one change. "You already write a class whose methods return data. Write it again, and stack `@Injectable()` on top so the framework can create and share it. That is the new concept." Teach the change, never the whole idea from zero.
- **If the concept is visible in code, the definition is its shape.** Some concepts appear as a visible part of a file: a decorator line, a constructor parameter, a DTO class, a module's arrays. Define them by comparison. Your files so far contained A. This file also contains B, one extra thing, placed there. Without it: the problem you just watched. With it: what changes. The before-and-after shape of the file is the definition.
- **When the new part is the topic, it is the headline.** Some lectures exist to add one new part to the reader's model of the file. The headline of such a lecture is: your file grows a new part today. Say it plainly in the first section. The story and the example demonstrate the part; they are not the headline. The opening ladder ends by promising the new part, not only the story's outcome.
- **The check.** After every definition ask: can the reader point at a file, a folder, a line of code, or an observable response, and say what it does? If yes, the definition passes. If it only connects words to words, rewrite it.

### The one thing, and the question the reader is already asking

**Every lecture has one thing.** One concrete change carries the whole concept. One line, written differently. One decorator, added. One file, created. One call, made. Find it before writing anything. It is the smallest complete form of the concept: the thing the reader could rebuild from memory when every other sentence is gone.

- **The one thing is the center.** Show it early. Show it alone, clean, with nothing competing beside it. Then let everything else — mechanism, contrast, story — explain what stands around it. If the reader keeps one item from the lecture, it is this one.
- **Every concept has a concrete form, even the invisible ones.** A decorator is a thing in a file. A constructor parameter is a thing in a class. A DTO is a thing in a folder. Even a concept with no shape of its own is created by one line, called by one line, or kept in one file. Find that line, that place, that file. That concrete something stands at the center of the presentation, in its clearest form. The abstract is explained from it, never instead of it.
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

**Canonical example** (a NestJS lecture's closing table):

```
| | **EXPRESS**<br>(Manual Wiring) | **NESTJS**<br>(Declarative Modules) |
| ---: | :--- | :--- |
| **Who builds the classes** | You, with new, at every call site | The framework, once, at boot |
| **Shared logic** | Copy-paste or hand-rolled singletons | Providers, injected by type |
| **Cross-cutting concerns** | Repeated inside every handler | Guards, pipes, interceptors, declared once |
| **Cost** | Nothing extra at runtime | A layer of decorators to learn |
```

**Rules, in order of importance:**

1. **The first header cell is always empty** — `| |` at the start of the title row. This blanks the top-left corner: no title over the leftmost "dimension" column. The empty cell is structurally still a normal title cell (it keeps its borders and padding so the top line runs the full width of the table), it just has no text. The CSS keys off `thead th:empty` only to neutralize any stray background — leave the cell empty in the markdown and the rest is automatic.
2. **Column titles live in the header row**, formatted as `**TITLE**<br>(subtitle)`. The build runs header cells through the inline formatter, so `**bold**`, `<br>`, and inline `` `code` `` all work. The title is the short name (e.g. `EXPRESS`); the parenthetical is the one-word gloss of what kind of thing it is (e.g. `Manual Wiring`).
3. **Prevent awkward code wrapping (CRITICAL RULE FOR PDF TABLES)**. Table columns in the PDF are narrow (~240px). Never let inline code strings wrap naturally across lines—doing so causes Prince to break the grey background padding into awkward, ugly fragmented chips across lines (e.g. splitting `@Controller('users')` into `@Controller/` and `('users')`, or splitting `constructor(private users: UsersService)` mid-expression).
   - **Separate prose from code:** Put `<br>` between leading prose and the code span, e.g. `Declared with<br>`@Injectable()``, `Two-step:<br>`@Get()`<br>`then the method`.
   - **Split long code strings:** Break multi-part code across `<br>` using separate backticks: `@Controller`<br>`('users')`, `constructor`<br>`(private users:`<br>`UsersService)`, or `Parse`<br>`IntPipe`.
   - Never put `<br>` inside the same backtick pair (e.g. `foo<br>bar`); always put `<br>` between distinct backtick spans (`foo`<br>`bar`).
4. **The divider row is `| ---: | :--- | :--- |`** — right-align the first (dimension) column, left-align the rest. This is load-bearing for the rendered look.
5. **Body rows start with a bold dimension** in the leftmost cell: `**Architecture**`, `**Runtime cost**`, etc. The CSS sizes `td:first-child strong` larger, so the dimension reads as a sub-heading inside its row.
6. **Never put titles in a body row.** The markdown header is the real title row; putting titles in a body row produces a duplicate, unstyled title strip.

### Heading rules (load-bearing)

The three markdown heading levels have distinct, non-interchangeable roles. Using the wrong level changes both the rendered HTML and the PDF pagination.

- **`# ` (h1) — the lecture title.** Used exactly once per lecture, as the first line. Pattern: `# Lecture {n}: {Short Title}` — for example, `# Lecture 52: Validation Pipes and the DTO Contract`. The renderer uses this line as the page title and the entry heading in the course reader.
- **`## ` (h2) — page break.** Every `## ` heading forces the PDF to start a new page (and the deck HTML to insert a lecture-break rule). Use `## ` sparingly: only when a section genuinely needs its own page — for example `## Beyond the basics` (the audit section) or a major part boundary inside a long lecture. Most lectures should have at most one or two `## ` headings.
- **`### ` (h3) — the default section heading.** Every normal section inside a lecture uses `### ` — the "Problem," the "Mechanism," the "Worked example," and so on. `### ` does NOT trigger a page break; the section flows inline. If you catch yourself reaching for `## ` for a regular section, switch to `### `.

Quick test: if the heading introduces a new subsection of the current lecture and you do NOT want a page break, it is `### `. If you want the next page to start here, it is `## `. The title at the top is always `# `.

### The interview-question line (exact pattern)

- **Position**: line 2 of the lecture file, immediately after `# Lecture {n}: ...`. No blank line between them.
- **Format**: a markdown blockquote, prefixed with `> `, then the literal token `INTERVIEW QUESTION`, then a space, a vertical bar, a space, then the curriculum typology (`❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`), a vertical bar, a space, then the question text.
- **Example** (verbatim, including the `>` and the `|`):
  ```
  > INTERVIEW QUESTION | ❱ CORE | What is a Controller in NestJS?
  ```
  and from part two:
  ```
  > INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do you use the QueryBuilder for complex database queries?
  ```
- **A blank line follows** before the rest of the lecture body begins.
- **Editing**: to change the question, edit this single line. Do not edit `../../questions-nestjs/questions.md` and do not edit the build script — the build reads only from this line.
- **If the line is missing**, the build renders the lecture without a callout (no error, but the visual anchor is gone — always include it).

### The Opening Ladder (opening pattern)

> **Naming note.** The author-facing name of this pattern is the **Opening Ladder**, the same name used in the demo project `react-lecture-01`. The build's internal CSS class `hook-ladder` is a historical artifact; authors never see or write it.

Every lecture opens with two parts: nothing, then the **Opening Ladder**. The pattern exists for the tired, low-attention reader: one beat at a time, each beat numbered, forward pull from number to number, and the mystery held back until the body earns it.

**Part 1 — nothing.** The Interview Question box shows the question and its tier badge only. There is no hook line in the ladder format: never write a leading scene line between the question line and the ladder, and never write the ladder's "Imagine this scenario:" lead yourself — the build generates it. (The build keeps pulling a legacy prose opening into the box for lectures written before this rule, but it never treats a list line as a hook.)

**Part 2 — the Opening Ladder.** Immediately after the question line (and its blank line), the body opens with 5–7 numbered beats, in this order: the scene, the code moment, the question (a clear, direct question stating the visible conflict without cryptic brevity), the danger, the mystery, the promise. Each beat is one continuous markdown line, one idea per line, no sentence over 20 words. The objective is absolute clarity, never cryptic telegraphic riddles. The ladder ends on the mystery or the promise, never on the answer.

**Part 3 — the first section after the ladder.** Immediately after the ladder, the teaching begins under a `### ` heading with a catchy title that names the chapter's idea. A bare paragraph must never sit between the ladder and the first heading: after the scenario, a properly titled section opens the explanation, carries the naming of the mechanism, and leads into the first code. Every later block of teaching gets the same treatment — prose lives inside titled sections, not loose between them.

**The lead sentence and the wrapper are the build's job.** The build detects the ladder structurally — the first numbered list of the body, before any section heading — wraps it in its own styled section (never split across pages), and generates the lead line `Imagine this scenario:` above the beats. Authors write ONLY the numbered beats: never write the lead sentence, and never wrap anything in a div by hand. Any numbered list appearing after the first section heading renders as an ordinary list.

**Rules:**
- **Never name the mechanism term in the ladder.** No decorator names, no API doing the reveal, no "the answer is". The ladder poses; the body answers. The term is earned where the lecture body builds it (the OLA and jargon rules apply from there). (The words "endpoint", "server", "file", "request" are course vocabulary, not automatically the mechanism: if the lecture's mechanism IS one of them, do not name it.)
- **The last beat promises, it never explains.** The closing beat may promise what today brings, in plain words. It may not answer the question the ladder posed; the explanation belongs to the body's first section. A ladder that ends by explaining the mystery has spent its tension one beat early.
- **Numbers, not bullets.** The beats are an ordered escalation; bullets are reserved for unordered lists (Summary takeaways, feature lists). A number promises a next one; that forward pull is the whole point.
- **No label on the page.** The ladder is presented bare, directly under the Interview Question box; no "Intro" heading, no extra chrome. The internal name lives only in these instructions and in conversation with writing models.
- **Consistency of world.** The ladder's scene is the same world the hook column of the question bank seeds, and the same world the lecture body keeps; no context switching. The course's running world is the National Times newsroom: the paper's website, its mobile app, and the backend API that serves both.
- **Mechanism vocabulary in disguise is still naming.** Words like "inject", "validate", "intercept", "register", "resolve", "serialize" are the mechanism by another door. Write the visible behavior instead: "the server answers with a number, not an error", "the log shows one line, not three".

**Who you are writing for: the tired-reader standard.** Before writing one beat, fix the reader in your mind: a person reading English at B2 level (comfortable with everyday words, lost in idioms and rare vocabulary), at the end of the day, tired, with a mild headache, giving the page one chance. The ladder is the reader's first contact with the topic, so its beats must be the clearest sentences in the entire lecture, clearer than the body and clearer than the summary. If a beat can be read two ways, a tired reader takes the wrong way, and the lecture loses them in its first ten seconds. Write every beat so it survives that reader.

**The identity test: one noun, one thing.** Every noun in every beat must be exactly one of four things, and only one: (a) a person, (b) something visible on the screen or in the observable response, (c) something in the code (a file, a variable, a line), (d) a machine event (the server, the network, the database). A noun that can be read as two of these fails the beat. Name each thing so only one reading survives: a person gets an unambiguous human role ("a journalist types a new headline", never write unnatural boilerplate like "a real person"), the program gets its full name ("your code editor, the program, like VS Code"), the response gets its place ("the number inside the JSON body"), the code gets its shape ("one line of your code", "the file that answers the request"), the machine gets its name ("the server").

**The overloaded-word list.** Web work reuses ordinary words as technical terms, and a beat has no room to carry both meanings. Never write these bare in a ladder beat; replace each with the concrete, observable thing:
- **"editor"** — the worst offender: it can be the human editing the site, the site visitor, or the code editor program. Write "the journalist" or "the visitor" for the person; write "your code editor, the program" for VS Code.
- **"live"** — broadcast-live? deployed? running? Say the observable fact instead: "the server is running right now".
- **"script"** — in a coding lecture it reads as a code file or a startup script. If the scenario world means a broadcast script, name it in full ("the broadcast script, the text of tonight's show") or cut it.
- **"log"** — as a verb it collides with `console.log`; as a noun it is a file or firewood. Write "print it to the console".
- **"route", "handler", "provider", "module", "middleware", "guard", "pipe", "inject", "interceptor", "decorator"** — mechanism vocabulary wearing everyday clothes; the ladder never names the mechanism, and these words are the mechanism by another door. Write the visible behavior: "the endpoint answers every request with the wrong number", "the server rejects the call before your code runs".
- **World furniture** ("the newsroom desk", "the studio", "the bullpen") — the reader has never seen your scenario's office. Keep it only when the beat itself says what the thing is, or drop it.

**The logic-first rule (no unexplained value on screen).** Every value the ladder turns into a problem — a total, a count, a badge, a price — must have its logic stated on the ladder, in plain words, before it breaks. The reader must be told what the number computes, from what inputs, and why anyone cares. A value that merely appears ("The payout total in the response sits frozen at its old number") is a cipher: the reader cannot fear the loss of a number whose meaning was never given.

The pattern is two beats, and both are required:
- **Beat one carries the explanation.** The beat that introduces the actor or event adds a second sentence stating the business rule: "The paper pays by the word."
- **Beat two carries the repetition.** The very next beat repeats that rule attached to the observable value: "That total counts the words of every story, because the paper pays by the word."

The explanation gives the rule; the repetition welds the rule to the value that is about to break. This rule overrides beat brevity: a beat may run to two short sentences when the second sentence carries the logic. The 20-word-per-sentence limit still holds.

**The cause-before-symptom rule.** Show the change before the break. The event that should have moved the number — a new story lands in the database, a price changes, a save happens — gets its own beat or sentence ahead of the wrong response. Only then may the "why" beat fire, because only then does it point at a cause the reader just watched. A freeze with no shown change is trivia; and a change the reader cannot connect to the value (because the value's logic was never stated, per the logic-first rule) is invisible.

**No assumed previous knowledge (unpack the technical shorthand).** Banning the mechanism's name is not enough: the ladder may not use technical shorthand as a substitute for logic either. A phrase like "needs a join across the story table and the author table, plus a check for archived rows" silently assumes the reader already knows why a total needs a join, what a check is, and what an archived row is. The ladder may assume none of this. Three requirements follow:
- **Unpack technical phrases into operations the reader can picture.** Not "a join across the story table and the author table, plus a check for archived rows" but "visit every story, take its author, skip any story the archive already holds."
- **Restate taught terms in the beat where they appear.** "A computed value, a number calculated from other data" is admissible; a bare "computed value" is not.
- **Earn every "does not fit" wall as a chain.** When the lecture's point is that something does not fit the form already taught, the ladder walks the chain in order: the kind of value, named in taught words; then what makes this one harder than the easy case, meaning the steps; and only then the wall, that one line cannot hold steps. A wall stated as an assertion, with the chain compressed into a noun phrase, assumes the reader already knows the taxonomy — previous knowledge the ladder may not assume.

**B2 vocabulary.** Every word in a beat is either everyday English or a word the course has already taught. Prefer "change" over "mutate", "answer" over "respond", "save" over "persist", "old" over "stale", "follow" over "propagate". No idioms, no unusual phrasal verbs, no word that makes a tired reader stop and reread. One concrete picture per beat.

**The Global Newsroom Rule (No Journalism Jargon).** While every scenario takes place at "The National Times," the vocabulary used to describe the app must strictly be globally understood web or business terms. Never use journalism-specific jargon. A global B2 reader will not know what a "byline," "lede," "masthead," "copy," "wire," or "dispatch desk" is. You must translate these into their universal, structural equivalents: use "author profile" (not byline), "intro" (not lede), "site header" (not masthead), "text" (not copy), and "live feed" (not wire). If a word requires a dictionary of news jargon to understand, it is banned. This applies strictly to file names (`AuthorProfile`, never `AuthorByline`) and prose alike.

**The Proper-Scenario Checklist (run on every ladder before the lecture is finished):**
- [ ] Every noun in every beat is exactly one thing — a person, a thing in the observable response, a thing in the code, or a machine event — and cannot be read as two.
- [ ] No overloaded word appears bare: "editor", "live", "script", "log", and every mechanism word in disguise ("route", "handler", "provider", "inject", "guard", "pipe"), replaced by observable behavior.
- [ ] Every person is named with a human word, never with a bare ambiguous role.
- [ ] Every word is B2: everyday vocabulary, no idioms, no rare words, nothing a tired reader must reread. **Crucially: No journalism jargon** ("byline", "masthead", "copy") even though the setting is a newsroom; always use global structural terms ("author profile", "site header", "text").
- [ ] Each beat makes sense read alone and out of order — no pronoun with two possible owners.
- [ ] No beat names the mechanism term or hints at it with jargon.
- [ ] The world of the scene matches the hook's world and the lecture body's world.
- [ ] Every value the ladder turns into a problem has its logic stated before it breaks: the explanatory sentence with the business rule in the introducing beat, then the repetition beat attaching that rule to the observable value.
- [ ] The change event is shown before the wrong response: the "why" beat points at an input the reader just watched move.
- [ ] No technical shorthand ("a join across two tables", "a check for archived rows") stands in for logic — every such phrase is unpacked into operations the reader can picture, taught terms carry their plain re-definition in the beat, and a "does not fit" wall is earned by first classifying the value (it needs steps, not one formula).

**Worked example: a failing ladder, then the same ladder fixed.** This ladder (an early draft) fails the gate; read each beat and count how many things every noun could be:

1. The newsroom desk is live.
2. An editor rewrites the breaking headline.
3. You log the payload at the top of the handler.
4. Why only one print?
5. A frozen badge ships the wrong headline.
6. The value is moving, but the log is dead.
7. We will watch the value as it actually changes.

What a tired B2 reader stumbles on: **"byline" (a line? a person? an author profile?)**, "the newsroom desk" (a desk? a team? a component named Desk?), "is live" (on air? deployed? running?), "an editor" (a person editing the site? the visitor? the IDE?), "log" (a verb? a file? firewood?), "payload" (jargon), "print" (a printer? the console?), "frozen" (the server froze? the value cannot change?), "ships" (deploys? delivers?), "the log is dead" (which log? what does dead mean?). Every beat carries at least one double reading.

The same scenario, rebuilt so each noun has exactly one identity:

1. You built the news website's server for The National Times, and the website is using it right now.
2. A journalist saves a new headline, and the server stores it.
3. Your code has one job: print the headline to the console every time it changes.
4. Why does the code print only once?
5. Readers keep seeing the wrong headline on the website.
6. Something in your code read the headline once, then stopped looking.
7. Today, the print will follow every change.

Same world, same mystery, same promise, but now every beat paints one picture a tired reader cannot misread. Note what disappeared: "editor", "live", "payload", "log", "frozen", "ships", all replaced by people, responses, code lines, and observable behavior.

**Second worked example: the ladder with the missing logic.** This ladder (an early draft of a payout endpoint lecture) passes the identity test — every noun is one thing — and still fails, because the value at the center of the story is a cipher and the reasoning is compressed into shorthand:

1. A journalist files the last story of the night in the National Times newsroom.
2. The payout total in the response sits frozen at its old number.
3. Why is it frozen?
4. The correct total needs a pass over every story, plus a safety check for archived rows.
5. One line cannot hold a pass over an array.
6. NestJS ships a second form of the same tool, one that takes a whole service.
7. Inside it, passes and safety checks are just normal TypeScript.

Read it as a tired B2 reader. What is a "payout total", why does it exist, what does it compute, and why would filing a story change it? The ladder never says. Why is the number "frozen" — what moved that it should have followed? Nothing is shown changing. What is "a pass over every story", why would a total need one, what is a "safety check", what is an "archived row"? All assumed previous knowledge. The same ladder, rebuilt by the logic rules:

1. A journalist files one more story at the end of the night at the National Times. The paper pays by the word.
2. The server returns one payout total in its response. That total counts the words of every story, because the paper pays by the word.
3. The new story lands in the database.
4. But the response still shows the old total. Why does it not move?
5. The correct total is a computed value, a number calculated from other data. This one needs steps: visit every story, add its words, skip any story the archive already holds.
6. One handler line cannot hold those steps.
7. NestJS has a place for steps like these. Inside it, passes and safety checks are just normal TypeScript.

Note what appeared and what changed. The business rule ("pays by the word") arrives as the explanatory sentence in the first beat and is repeated, attached to the observable value, in the second. The change (the story lands in the database) now precedes the stale number, so "Why does it not move?" points at a watched event. The shorthand of the old beat four ("a pass over every story, plus a safety check for archived rows") became "visit every story, add its words, skip any story the archive already holds" — the same logic, stated as operations a tired reader can picture. And the wall ("one handler line cannot hold a pass") now stands on an earned chain: the value is classified first (a computed value that needs steps, not one formula), so the wall lands as a conclusion instead of an assertion. One banned word from the old draft ("ships") left with it.

**Primary Mandate — Role Rotation, Phantom Routines, and Cryptic Questions.** This case study demonstrates why clarity must always defeat artificial word-count constraints, synonym rotation, and phantom background routines.

*The Flawed Draft (REJECTED):*
1. A reporter opens the bureau directory to update a foreign correspondent's assignment record.
2. A background routine receives fresh coordinates and updates reporter.location.city = 'Geneva' in the profile data.
3. Why did nothing move?
4. Readers see the journalist stationed in London while their breaking dispatch publishes from Switzerland.
5. The nested city text changed inside computer memory, but the badge on screen stayed frozen on London.
6. Today you learn the exact boundary where deep updates stop, and how to keep nested values linked to the screen.
7. (The same beat structure continues.)

Why it failed: Rotating between "reporter", "foreign correspondent", and "journalist" confuses international B2 readers (sounds like three people or three technical roles); "A background routine receives fresh coordinates" introduces novel technical jargon ("routine") that distracts from the lesson; and "Why did nothing move?" is a cryptic, metaphorical question forced into an artificial 4-word rule. On a server, "move" means nothing observable.

*The Corrected Standard (MANDATED), in the NestJS version of the scenario (nested data in a response):*
1. A journalist opens their profile page on the National Times website to update their current city.
2. The profile displays a location badge on screen, showing London from the reporter object in the server's response.
3. The journalist selects Geneva, and the server saves reporter.location.city = 'Geneva' on the profile object.
4. Why did London stay as the registered location, even after the update?
5. Readers still see London on the published website while the journalist reports breaking news from Geneva.
6. The city text changed inside the data object, but the response never received the update.
7. Today you learn how a plain object freezes inside a handler, and how NestJS keeps nested data connected to the response.

Why it succeeds: One actor throughout ("a journalist"); direct user action (selects Geneva); and Beat 4 asks a natural, complete, non-cryptic question stating the exact observable paradox ("Why did London stay as the registered location, even after the update?").

**Second Mandate — The Jargon Trap and Inside-Out Engine Trap.**

*Stage 1 — The Jargon and Abstraction Trap (FAILED):*
1. A news reporter reviews three breaking wire reports on the National Times dispatch desk.
2. The dispatch desk requires every published report to be manually verified by its unique bulletin number.
3. The developer adds a verify endpoint that passes bulletin number 402 directly to the service call.
4. Why did it run?
5. Every bulletin verifies itself the instant the server boots, publishing unread reports before the reporter touches the mouse.
6. Writing parentheses directly in the decorator executes the action immediately during startup instead of waiting for requests.
7. Today your handlers learn to wait for user interaction, receive custom values, and read native request objects.

Why Stage 1 fails: "Wire reports" and "dispatch desk" sound like hardware or network libraries; "bulletin 402" looks like HTTP 402; and "the decorator" is vague academic jargon hiding the exact syntax.

*Stage 2 — The Inside-Out Engine and Broken Causality Trap (FAILED):*
1. A writer opens a dashboard showing three draft articles on a news website.
2. Each draft article has a simple identification number, such as article 5 or article 12.
3. Next to article 12, the developer writes deleteUser(12) inside the boot file of the server.
4. Why did it run?
5. All three articles delete themselves the second the server starts, wiping out the work before any request arrives.
6. Writing parentheses directly inside the boot file calls the function immediately during startup.
7. Today your endpoints learn to wait for requests, pass custom values safely, and inspect native request objects.

Why Stage 2 fails: "Why did it run?" is programmer shorthand from inside the engine. To an outside observer, no one sent a request, and articles do not "run". Causality was broken by asking the question before showing the empty list.

*Stage 3 — The Outside-In Truth (MANDATED):*
1. A writer opens a dashboard to edit three draft articles on a website.
2. Each article has a delete endpoint meant to run only when the client asks for that article.
3. The writer starts the server without any client sending a single request.
4. Where did they go?
5. The list is completely empty because the delete code executed during startup, erasing all drafts.
6. Writing parentheses (12) after the function name executes the code during boot instead of waiting for requests.
7. Today you learn how to pass arguments safely and inspect native request objects when clients call endpoints.

Why Stage 3 succeeds: Universal nouns; machine inaction is explicit (no request was sent); Beat 4 asks the natural human reaction to an empty list; and Beat 6 identifies the exact characters: writing parentheses `(12)` after the function name.

**Third Mandate — The Mismatch Law (the invisible contradiction).**

*The Flawed Draft (REJECTED):*
1. A journalist loads a directory of ten thousand global news bureaus on the National Times editorial portal.
2. The endpoint stores the article list so the display updates as the journalist searches.
3. The journalist types a word into the search box to find an old article.
4. Why does the search feel slow on every keystroke, even though no article ever changes?
5. Results appear seconds late on screen, locking up the page while the journalist types.
6. The endpoint re-reads all ten thousand article rows on every keystroke for data that never changes.
7. Today you learn how to serve massive datasets without losing fast responses.

Why it failed: First, "global news bureaus" and "editorial portal" use specialized, confusing institutional jargon. A newspaper publishes articles; an archive of 10,000 published articles is the only sane, universal domain entity. Second, Beat 2 missed the fundamental architectural contradiction (The Mismatch Law): writing *"The endpoint stores the article list so the display updates as the journalist searches"* sounds harmonious and correct, hiding the clash. The reader's screen shows twenty results; the server re-reads ten thousand rows. The mismatch must be stated, not smoothed over.

*The Corrected Standard (MANDATED):*
1. A journalist opens the search archive on the National Times website to browse 10,000 published articles.
2. The search endpoint reads all ten thousand article rows from the database on every keystroke, but the reader's screen shows only twenty results at a time.
3. The journalist types a single letter into the search box to find a story.
4. Why does every keystroke feel slow, even though no article ever changes?
5. Results appear seconds late on screen, while the server re-reads rows nobody will look at.
6. Every keystroke triggers a fresh read of all ten thousand rows, and most of them sit far below the first page, where nobody reads them.
7. Today you learn how to answer only with the rows the reader can actually see.

Why it succeeds: Universal nouns; single actor; and Beat 2 explicitly exposes the architectural contradiction between what the code does (reads all 10,000 rows) and what the screen needs (twenty visible results).

**Status of existing lectures.** The first lectures written for this project start from a clean slate; there is no legacy-prose retrofit burden. Keep it that way.

### Alert callouts (`> [!TIP]`)

Lectures support GitHub-style **alert callouts** — a blockquote whose first line is `> [!TYPE]`, rendered as a styled box with an eyebrow label and a tinted accent border. The project uses these to deliver *interview-strategy guidance* (how to frame an answer, what to emphasize, what interviewers want to hear) alongside the technical content.

**Syntax.** Open with `> [!TYPE]` on its own line, then the body on the following `>` lines:

```
> [!TIP]
> **To impress the interviewer:** Most candidates will say "NestJS uses decorators." If you want to show deep understanding, explain what the decorator actually does: it attaches metadata the framework reads once at boot to build the route table — and that distinction explains why decorator order matters and why the framework, not you, instantiates the classes.
```

**Supported types and their eyebrows** (the build parses exactly these five; anything else falls back to a plain blockquote so the typo is visible):

- `[!TIP]` → **Interview Tip** (the project's signature callout; accent-teal border). Use this for "here is how to win this answer in an interview" guidance.
- `[!NOTE]` → **Note** (neutral informational aside; accent-teal border).
- `[!KEY]` → **Key Takeaway** (warm amber). This is the callout for **insider allegories and key takeaways** — the one-line distillation that separates a framework user from someone who grasps the underlying idea. Reach for it when you have a single sentence that reframes the concept as a memorable comparison, analogy, or load-bearing truth. A good KEY callout reads like something a senior engineer would murmur after years with the tool — not a summary of the section, but the *why-it-matters* the section is building toward.
- `[!WARNING]` → **Warning** (amber; a real pitfall to avoid).
- `[!CAUTION]` → **Caution** (red; a destructive or breaking action).

**Authoring rules:**

- **The marker line is `> [!TYPE]`** — uppercase type in square brackets, immediately after `> `. A blank `>` line may precede the body but is not required; the body lines are everything from the next `>` line until a non-`>` line.
- **Use `> [!TIP]` as the default** in this project. The eyebrow renders as "Interview Tip" precisely because every lecture is interview prep; reaching for NOTE/WARNING/CAUTION is fine when the content genuinely fits one of those tones, but TIP is the on-brand choice for framing advice.
- **Reach for `> [!KEY]` for allegories and insider takeaways.** These are the highest-value lines in the whole lecture — the comparisons and compressed truths that show deep understanding and that interviewers and insiders recognize. Do not waste the KEY box on a routine "remember to..." note; reserve it for the kind of sentence that earns its own box.
- **One callout per point.** A callout carries a single, self-contained tip. If you have three tips, write three callouts — do not cram a bulleted list of tips into one box.
- **Body formatting is full markdown.** Bold (`**...**`), italic (`*...*`), and inline code (`` `...` ``) all work inside the callout body. Keep the body to a short paragraph; if it needs a code example, the example belongs in a fenced block adjacent to the callout, not inside it.
- **Lead the body with a bold lead-in.** Pattern: `> **To impress the interviewer:** ...` or `> **Common mistake:** ...`. The bold lead-in names what kind of tip it is before the reader reaches the explanation. The KEY allegory is the one exception: its body is often a single bare sentence with no lead-in, because the sentence *is* the takeaway.
- **Place callouts inline, at the moment the tip matters.** A callout that teaches how to answer the *current* concept goes right after the section that establishes it. Do not bank all tips at the end of the lecture; their value is contextual.
- **Never substitute a callout for the lecture's actual content.** The callout is framing advice — how to talk about the concept. The mechanism itself belongs in the lecture prose and code blocks. A lecture full of callouts and thin on explanation has failed its job.

### Repeat and emphasize the important statements

A key statement does not earn its place by being said once. The project's convention is that an **important allegory or insider takeaway is stated twice, in two registers**: first as the punchy `[!KEY]` callout (the compressed form a reader can quote), then again, expanded, in the prose immediately following (the unpacked form that explains *why* the allegory holds). The compressed line earns the box; the prose earns understanding.

The model:

```
> [!KEY]
> You never call new; the framework calls you.

When your controller needs a service, you do not build one. You write the type
in the constructor, with no argument of your own, and NestJS builds the
service first, keeps one copy of it, and hands that copy to every controller
that asks. The direction of control is inverted from plain TypeScript: there,
your code decides when classes are born; here, the framework decides. That is
why services can share database connections and configuration without any
file ever calling new on them.
```

The callout and the paragraph say the *same thing* deliberately. The callout is the hook (a reader can carry it away in one read); the paragraph is the proof (it walks the analogy through so the reader sees the mapping). Do not put the callout in without the unpacking, and do not unpack an idea in prose without giving its load-bearing line a `[!KEY]` callout to live in. If a takeaway is worth the reader's long-term memory, it is worth stating in both registers.

**What counts as an insider takeaway worth this treatment.** Allegories that map the unfamiliar onto the familiar ("a decorator is a sticky label, not a function call"), naming the exact mechanism a senior engineer would point to ("the route table is built once at boot, never per request"), and the one sentence that, once heard, makes the rest of the lecture click into place. These are the lines a student repeats to themselves before the interview; surface them, box them, and unpack them.

## Code Block Format (auto-highlighted)

Every fenced code block in a lecture is automatically transformed by `src/build-lectures.mjs` into an editor-style display: a thin-bordered window with a filename tab, three traffic-light dots, numbered lines, zebra striping, and syntax-highlighted tokens. A `//` comment renders as a **speech bubble hung directly below its code line**, with a small tail pointing up at that line. The author writes plain Markdown; the build script produces the styled HTML. **Never hand-write `<span>` tags, CSS classes, or bubble markup in lecture Markdown** — the highlighter will double-encode them and the output will be wrong.

### How to author a code block

- **Open with a fenced block**: ` ```ts ` (or ` ```typescript `) for NestJS files, ` ```bash ` for terminal commands, ` ```json ` for payload examples.
- **Filename tab is always shown.** The editor chrome (three dots + filename pill) renders for every fenced block. If you omit `title=`, the highlighter derives a default filename from the fence language: `ts`/`typescript` → `app.ts`, `js`/`javascript` → `app.js`, `json` → `data.json`, `html` → `index.html`, anything else → `code.txt`. To override, write ` ```ts title="users.controller.ts" `. Nearly every fence should carry an explicit title, because NestJS file roles live in the filename suffix.
- **Blank lines render as ordinary numbered rows.** Every source line inside the fence gets a row and a line number, and blank lines show as empty numbered rows. To keep the editor dense, write snippets without blank lines where you can. Keep top-level code flush against the left margin; indentation inside fences is rendered literally.
- **Keep every line inside a fence under about 80 characters.** Longer lines wrap in the built output (the row grows taller, the number column stays left) — that wrap is a safety net, not the style. Break long constructor signatures and object literals across rows yourself, one parameter or property per row, so the break lands where the code reads best. Decorated handlers especially want one decorator or parameter per line in lectures.
- **Close with ` ``` `** on its own line. Every fence opener must have a matching closer.
- **Write comments normally**: use `//` followed by a space and the comment text. The highlighter renders the `//` as `→` in the output. Example source: `constructor(private readonly users: UsersService) {} // the framework injects the service, you never call new`.
- **Bold inside comments**: wrap key terms in `**double asterisks**`. The highlighter renders these as bold inside the comment span. Example source: `// adds an **OWN** route to the controller`.
- **No other comment formatting**: italic, inline code, and links are not supported inside comments. Use `**bold**` only.
- **`/* */` block comments and JSDoc-style `/** */` comments**: not supported as bubbles. Annotate the declaration line with a `//` comment instead, or explain in prose.

### The `//` comment rule (exact behavior)

- The first `//` on a line that is **followed by a space or end-of-line** is treated as the comment start.
- Everything from that `//` to the end of the line becomes the text of a comment bubble rendered below the code line (white box, grey border, small upward tail, Georgia serif italic). The first letter is auto-capitalized, and `**bold**` runs render as tag-styled bold inside the bubble.
- **`✔️` / `✖️` glyphs are stripped from comments on purpose.** The owner decided verdict icons do not belong in the rendered output. Signal do/don't verdicts with words instead: `// **WRONG:** builds its own copy of the service`, `// **RIGHT:** one shared instance for the whole app`.
- **`//` inside URLs is preserved.** A string like `'https://example.com'` is untouched because the `//` is followed by `example`, not a space. The same protection applies to `file://`, `http://`, and regex literals.
- **Empty trailing `//` is dropped.** A line ending in bare `//` with no comment text renders without any arrow — clean output, no dangling `→`.
- **`//` at the very start of a line** (a comment-only line, flush-left or indented) is auto-repaired by the build: its text is merged into the bubble of the next code line (the previous one if the block ends first), no empty row is rendered for it, and the build log prints a note naming the source line. **Authors must still never write comments this way.** End-of-line comments remain the rule; the merge is a safety net that guarantees no comment bubble ever floats beside an empty row, not permission to park comments on their own lines (see **Comment placement** below).

### Comment placement (load-bearing)

Comments in this project are **always attached to the code line they annotate**: they are written at the end of that line, after a `//`, never on their own line above the code. This is non-negotiable. The reason is that a comment renders on screen as a speech bubble hung directly **below** its code line, with a small tail pointing up at it. Its entire job is to deliver clear, short visual information about that one line. A comment with no code on its line is a bubble pointing at nothing — the reader cannot tell which line it belongs to. (If a comment-only line slips into a fence anyway, the build folds it into the next code line's bubble and logs a note in the build output — a safety net, not an excuse.)

**The rule, stated plainly:** write `const id = Number(idParam); // annotation`, never `// annotation` on its own line followed by `const id = Number(idParam);`. If you find yourself wanting to introduce a block of code with a comment, write the introduction in the prose above the snippet instead — do not park it as a comment-only line inside the fence.

**Exception for extremely wide lines:** If the line of code itself is exceptionally long (e.g., a wide constructor signature row), attaching a comment to the end will cause it to hit the right edge of the editor container and wrap into two lines, breaking the parallel visual layout. In this specific scenario, place the comment on its own line *inside the block* (e.g., on the very next line) instead of trailing the wide line.

**The canonical reference for comment discipline is `../react-lecture-01/md-lectures/01.md`** (the demo project): every comment sits at the end of its code line. The models of the discipline, adapted to NestJS:

1. **The trap verdict, end-of-line:** `const service = new UsersService(); // **WRONG:** builds a **PRIVATE** copy, unshared and unmanaged` — a wrong-pattern line, the verdict word leading the comment, the load-bearing word in caps, at the end of the line it warns about.

2. **The correct-pattern verdict, end-of-line:** `constructor(private readonly users: UsersService) {} // **RIGHT:** the framework supplies the **ONE** shared instance` — the recommended pattern, takeaway word in caps.

3. **The numbered-step sequence across three lines:**
   ```
   const dto = await this.parseBody(req); // 1. read the raw body from the request
   const story = this.validate(dto);      // 2. check the **SHAPE** before trusting it
   return this.repository.save(story);    // 3. **SAVE** only after the checks pass
   ```
   — a three-step narrative told as three aligned comments; the reader's eye tracks down the bubbles and reads the story.

4. **The one-line gotcha:** `@Get(':id') findOne(@Param('id') id: string) { // **WRONG:** id arrives as a **STRING**, always` — the comment names the exact consequence beside the offending line.

5. **The three-way contrast block:**
   ```
   const a = req.body;                 // **WRONG:** raw input, **UNTRUSTED**
   const b = plainToInstance(Dto, a);  // **RIGHT:** checked against the **CONTRACT**
   const c = plainToInstance(Dto, a, { enableImplicitConversion: true }); // **WARNING:** silently **COERCES** types
   ```
   — three lines, three contrasting caps words; the comparison lives in the bubbles, not in prose.

**What makes a good comment.** Because the bubble hangs directly under its code line, it must be short and self-contained — a verdict word, a step number, or a one-phrase gloss, plus one caps load-bearing word. It is a *label* for the line, not an explanation of the line; explanations belong in the prose around the snippet. If a comment needs more than roughly one short sentence, it is too long for the bubble — move that material into prose and leave a shorter label on the line.

**The anti-pattern (do not do this).** The following is exactly wrong — every comment is a comment-only line parked above the code it describes:

```
// 1. the route is declared through the decorator
@Get('stories')
```

On screen this renders as a `➔`-prefixed annotation with no code beside it, followed on the next row by code with no annotation. The reader cannot pair them. The correct form attaches the comment to the line it labels:

```
@Get('stories') // 1. this word registers the **ROUTE** the method answers
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

- **Verdict comments with a leading word**: start the comment with `**RIGHT:**` (recommended pattern) or `**WRONG:**` (trap) so the reader instantly knows whether the line is a pattern to copy or a trap to avoid. Do not write `✔️`/`✖️` glyphs: the build strips them, so they cost effort and render nothing. Examples:
  - `// **WRONG:** copies the logic **ONCE** into a private helper` — a trap; the line is shown to warn against it.
  - `// **RIGHT:** reuses the one service the framework already built` — the recommended pattern.
  - `// **WRONG:** touching the raw response object is **FORBIDDEN** in pass-through mode` — a trap with the specific consequence called out.
- **`**CAPS**` for the single load-bearing word.** Wrap the one keyword that carries the lesson in bold-uppercase. The highlighter renders `**SHARED**` as `<b>SHARED</b>` — bold, in a darker grey (`#374151`) than the surrounding comment text. Use this for the term the reader must take away from the line: **BOOT**, **ONCE**, **SHARED**, **INVERTED**, **UNTRUSTED**, **NEW-OBJECT**, **LOCALLY**, **SAVE**, **REVERT**, **SOURCE**, **ROUTE**, **CONTRACT**. One per comment, occasionally two — never a whole sentence in caps.
- **Numbered steps inside a single snippet.** When a code block shows a sequence of operations, prefix each comment with its step number: `// 1. read the raw body from the request`, then `// 2. check the **SHAPE** before trusting it`, then `// 3. ...`. The numbers survive into the rendered comments, giving the reader a clear path through the snippet.

**Long bubbles wrap by themselves.** A bubble that would overflow the editor width wraps internally onto additional bubble lines. The author does not control this — it happens in the build. If a comment is so long that the wrapped bubble looks awkward, shorten the comment; the code block is not the place for paragraphs.

**What comments are NOT in this project:**

- **Not collapsible.** Every comment always renders. If a comment is not pedagogically necessary, delete it; do not leave it "for completeness."
- **Not links or code.** Inline `` `code` ``, `[links](url)`, and `*italic*` are not parsed inside comments. Only `**bold**` is supported. If you need to reference an identifier inside a comment, write it as plain text (optionally in CAPS if it is the load-bearing word).
- **Not for section narration.** If a comment needs more than one short sentence, the explanation belongs in the prose around the code block, not inside the code. Comments annotate lines; prose explains snippets.

### Token classes produced by the highlighter

The highlighter classifies code tokens into four color classes. The author does not control these — they are derived from the source. Listed so the author knows what to expect:

- **`.kw`** (deep magenta `#93275a`) — TypeScript/JavaScript keywords: `let`, `const`, `var`, `function`, `return`, `if`, `else`, `for`, `while`, `new`, `class`, `extends`, `this`, `await`, `async`, `import`, `export`, `from`, `default`, `try`, `catch`, `throw`, `typeof`, `instanceof`, `in`, `of`, `true`, `false`, `null`, `undefined`, `break`, `continue`, `switch`, `case`, `public`, `private`, `protected`, `readonly`, `implements`, `interface`, `type`, `enum`, and the rest of the standard keyword set.
- **`.fn`** (teal `#156a64`) — identifier followed by `(` (with optional whitespace between), e.g. `findAll(`, `console.log(`, `parseInt(`. **Decorators render teal through this rule**: in `@Controller('users')` the `@` is a plain character and `Controller(` is a function call, so every decorator name — `@Get`, `@Injectable`, `@Module`, `@Body`, `@Param` — renders teal, which is exactly the visual emphasis decorators deserve.
- **`.nl`** (magenta `#93275a`) — number literals: `0`, `42`, `3.14`.
- **`.str`** (green `#1a7d2e`) — string literals in `"double"`, `'single'`, or `` `template` `` quotes. Route paths (`'users'`), DTO examples, and import specifiers all render green.

Plain identifiers (variable names, property accesses, class names without a following parenthesis) are rendered in the default ink color with no span. The `@` of a decorator and TypeScript type annotations (`:`, `UsersService`, `<`, `>`) render as plain characters.

### Example (source and result)

**Source Markdown** in `md-lectures/NN.md`:

````markdown
```ts title="app.controller.ts"
import { Controller, Get } from '@nestjs/common';
@Controller('hello')
export class AppController {
  @Get()
  findAll() { // the return value becomes the JSON response body
    return { message: 'hello' };
  }
}
```
````

**Rendered HTML** (what the build script produces, simplified):

- A `<div class="editor">` block
- An editor chrome bar with three dots and an `app.controller.ts` filename tab
- Seven numbered rows with zebra striping
- `import`, `export`, `class`, `return` styled magenta (keywords); `@Controller` and `@Get` styled teal (function calls); `'hello'` and `'@nestjs/common'` styled green (strings)
- The `//` comment rendered as a speech bubble below its line — `The return value becomes the JSON response body` — in the italic serif bubble style

The bubble markup and all `<span>` tags are produced by the build script. The author wrote only `//` comments and plain code.

### Supported languages

`ts`, `typescript`, `js`, and `javascript` all use the same JS/TS tokenizer. `json` and `bash` are rendered through the same tokenizer without language-specific branching. If you need CSS or another language tokenized differently, that requires extending the highlighter in `src/build-lectures.mjs` (add a new tokenizer branch keyed on the fence language).

### Known limitations

- **Template literals with `${}`**: a template string like `` `User ${id} not found` `` is treated as one string token. The `${id}` part is not separately highlighted as an identifier. Acceptable for typical lecture snippets; document long template literals in prose if the interpolation matters.
- **Type annotations in parameters**: the type after the colon renders as a plain identifier unless followed by `(`. Acceptable: the decorator or parameter name carries the emphasis.
- **Regex literals containing `//`**: rare in NestJS teaching material. The "followed by space or EOL" rule protects most cases, but a regex like `/foo//bar/` would mis-tokenize. Avoid regex literals with `//` in lecture code.
- **Block comments `/* ... */`**: not currently supported. Multi-line block comments are rendered as plain code (no bubble styling). Use `//` per-line comments in lectures — they produce the bubble aesthetic and align with the rest of the design system.

## Why the lecture-only shape exists

This project deliberately runs a single pipeline. The lecture is the comprehensive source for a question; it is written once, driven from the local NestJS documentation and supplementary research, and it is the whole deliverable. There is no downstream card or data-flow artifact to distill, so the lecture must carry the full depth itself: the OLA unpacking, the component panel, the worked examples, and the streetwise summary all live in this one file. A thin lecture has no second artifact to rescue it.

## Where to look for related context

- `../react-lecture-01/` — **the demo project, the only sibling you may open, and only for structure.** Its `md-lectures/` files are the model for section order, ladder shape, panel placement, comment discipline, Summary and table shape, and depth calibration — never for content: no scenarios, no examples, no metaphors, no code, no phrasing may be copied or adapted from it. Its `instructions.md` is the model this document was adapted from.
- **Every other project folder is off limits.** Do not open, imitate, or cite `svelte-lecture-01`, `svelte-lecture-02`, `svelte-lecture-03`, `online-demo-01`, or any other folder in `diagram-lab/output/`. When a question about style or structure comes up, the answer comes from `../react-lecture-01/` or from this document, never from another project.
- `documentation official/nestjs/docs.nestjs.com/content/` — the primary source for lecture content.
- `../../questions-nestjs/` — the question bank: `questions.md` (the 200 rows) and `topics.md` (the controlled tag vocabulary).
- **No screenshots, no photos of the result — unless the user explicitly asks.** By default do not capture or examine images of the built HTML or PDF at any point; see the **no-screenshot rule** in "Visual reference for the Pencil book design" below.

## Visual reference for the Pencil book design

The lecture pipeline's code-block presentation is meant to mimic the visual style of the Pencil book at `/Users/techton/lechton/research-code/svelte dev 2026/Pencil/`. The canonical references are:

- `Pencil/styles/figure-03.css` — the source-of-truth stylesheet for the editor code-block look.
- `Pencil/cards 05/04_extra_javascript_1/01-prototype/card.html` — a hand-curated example of the editor HTML structure.
- `Pencil/book/out/04_extra_javascript_1.pdf` — the full reference chapter in PDF form.

These files are **reference only** — never modify them. When matching the look, copy values inline into `src/lecture.css`; do not link to or import the Pencil CSS.

**Important limitation — the no-screenshot rule.** **NEVER take screenshots of the built HTML or PDF, and NEVER examine photos of the result, at any point of writing, polishing, or verifying a lecture — UNLESS the user explicitly asks for a screenshot or an image check in that specific request.** The default authoring loop is text-only. The reason is structural: the ZCode client cannot display images to its model, so a screenshot teaches the author nothing while costing a full build cycle. The only mechanical gate is the build log: `node src/build-lectures.mjs` with zero warnings. When the rendered output looks wrong, diagnose it by reading the generated HTML in `md-lectures-html/` and the CSS values in `src/lecture.css` and comparing them against the format rules in this document — never by capturing or inspecting images of the page. If a visual judgment genuinely requires human eyes, say so in plain language to the owner and let the owner decide; do not attempt the judgment yourself from images. When the user does explicitly ask, follow that instruction for that task only, then return to the text-only default.

### The Comprehensive Lecture Checklist (MANDATORY FINAL GATE)

Before generating or finishing any `.md` lecture file, you MUST verify every single item on this list. Do not output the lecture until it passes this entire audit:

**1. The Header & Hook**
- [ ] **Typology Tagging:** Does the lecture start exactly with `> INTERVIEW QUESTION | ❱ [LEVEL] | [Question]`?
- [ ] **The Hook (OLA):** Does the opening establish a visceral, real-world, high-stakes scenario?
- [ ] **The Opening Ladder:** Does the body open directly with 5–7 numbered beats (no leading scene line, no hand-written lead) ending on the mystery, with the mechanism term never named, followed immediately by a titled `### ` section that opens the teaching?
- [ ] **The Proper-Scenario Checklist:** Does every ladder beat pass the scenario-clarity gate in the Opening Ladder section — B2 vocabulary for a tired reader, every noun exactly one thing (a person, a thing in the observable response, a thing in the code, or a machine event), no bare overloaded word ("editor", "live", "script", "log", "route", "handler", "provider", "inject"), every beat readable alone and out of order, the problem value's logic explained then repeated (logic-first), the change event shown before the wrong response, and no technical shorthand left unpacked?
- [ ] **The Last Beat:** Does the ladder close on a plain promise of what today brings, never on the explanation of the mystery it posed?
- [ ] **Experience-First Definitions:** Does every new concept pass the experience standard — defined through what the reader can point at, starting from their closest known action, or by the visible before-and-after shape when the concept appears in code — and never only through other words?
- [ ] **The One Thing:** Is the lecture built around one visible change (one line, one decorator, one file), shown early and alone? Does every abstraction answer a question the reader is already asking, voiced aloud at the moment it arises?
- [ ] **The Headline:** When the lecture's topic is a new part of the file, do the first section and the ladder's promise beat headline that growth, with the story as the demonstration?
- [ ] **Structural Surprises:** Is every construct that breaks the reader's accumulated model of a NestJS file (an `@` word above a class, a constructor with parameters nobody passes, a DTO class with only properties, a module file of only arrays) taught in prose BEFORE the first fence that shows it — naming the old model, saying the new construct is allowed, and marking what distinguishes it?
- [ ] **Strongest Naive Alternative:** Does the lecture raise and answer the strongest alternative the course has equipped the reader to think of (a manual instantiation, a helper function, an inline check), not only weak strawmen?
- [ ] **Deck Cross-Reference:** Did the lecture search earlier lectures for its concepts, re-anchoring and citing `(see Lecture N)` for every term an earlier lecture already baptized, instead of re-teaching it with a fresh metaphor?
- [ ] **Narrative Continuity:** Does the entire lecture stick strictly to this single domain without abrupt context switching? (One exception: the `Where you will meet this` list widens to other systems on purpose.)

**2. The Visual Scaffold**
- [ ] **Component Architecture:** Is there a ` ```components ` explorer panel? (MANDATORY in every lecture, no exceptions. Responsibility implies ownership; ownership must be mapped. The build warns on any lecture with zero panels.)
- [ ] **Rendered Content:** Does every leaf file carry rendered lines computed by hand from the code block's real values (e.g. `return { total: this.payoutService.getTotal(stories) };` over three stories of 800, 1200, and 950 words at rate 0.5 becomes `"total": **1475**`) — never empty grey bars, STATUS/ACTION placeholders, or a bare method-call token — with only two legitimate exceptions: containers whose children render inside them (unfilled on purpose) and test files (never render)? See the fill decision procedure and the traceability test.
- [ ] **No Invisible Owners:** Does every prose actor that owns the mechanism (the framework that instantiates the service, the module that registers the controller) appear in a fence or the panel — or has the prose been rewritten to stop leaning on it? Do compound file names have their parts grounded at first appearance?

**3. The Code Executions**
- [ ] **Fenced Code:** Are all code blocks labeled with `title="..."`?
- [ ] **Comment Formatting:** Are all `//` comments strictly at the *end* of the line (no floating bubbles on empty lines)?
- [ ] **Validation Marks:** Do verdict comments lead with `**RIGHT:**` / `**WRONG:**` words? (Never `✔️`/`✖️` glyphs: the build strips them.)
- [ ] **Table Code Wrapping (CRITICAL):** Are ALL code strings in table cells manually wrapped with `<br>` (separating prose from code with `<br>`, and splitting multi-part expressions across separate backtick spans like `@Controller`<br>`('users')`) so Prince never breaks grey-box padding mid-token or mid-string?

**4. The Conclusion**
- [ ] **Use Cases:** Is there a `### Where you will meet this` section right before the Summary — 3 to 5 one-line, pictureable real-backend uses of today's concept, each line a concrete moment plus what the concept does there?
- [ ] **Streetwise Summary:** Is there a `### Summary` section opened with a bold **Technical Title** on its own line, followed by an empty line and a streetwise review from an experienced coder's daily perspective (using `❒` subtitles, numbered bullets with `(a)`/`(b)` sub-points, and `➔` principles)?
- [ ] **Comparison Table:** Does the lecture end with a markdown table comparing the NestJS mechanic against its nearest alternative, with the first column right-aligned (`| ---: | :--- | :--- |`) and all inline code manually wrapped with `<br>`?

**5. The Format Safety**
- [ ] **No Em-Dashes:** Are all em-dashes completely removed or replaced with commas/colons?
- [ ] **Paragraph Flow:** Is every paragraph, bullet, and table row on one continuous line without hard wraps?
- [ ] **No Screenshots:** Did you verify the lecture through the build log and the generated HTML only, with no screenshots taken and no photos of the result examined at any point — unless the user explicitly asked for an image check in this specific task?

## Writing with small-context models (the phased workflow)

- **Length standard:** a completed lecture targets **800 to 1,200 words, about 1,000 on average**. ADVANCED questions may run to 1,500. Most lectures fit one writing session.
- **Parts are optional.** Split a lecture into parts only when one session cannot write it well (typically long ADVANCED lectures). Write parts to `md-lectures-plan/{n}-part1.md`, `{n}-part2.md`, and so on; start every part session by re-reading the outline (if any) and the previous part's last paragraph, which is how a forgetful model stays continuous. Never leave part files anywhere else.
- **Assemble and build.** Concatenate the parts into `md-lectures/{n}.md`, then run `node src/build-lectures.mjs`. The build prints `note` lines for anything it auto-repaired (for example comment-only lines merged into the next code line) and `warn` lines for format violations: title shape, interview-question line, missing callout, missing `components` panel, missing `### Summary`, closing-table shape. Fix every warning and rebuild. A clean build is the mechanical definition of done.
- **The polish pass (second model, full edit authority).** After assembly, a different model or a fresh session may edit the finished lecture: add at least one interview `[!TIP]` callout, add or sharpen `[!KEY]` takeaways, tighten the Summary and closing table, and fix every warning the build printed. The polish model ends by running the build; zero warnings is its exit condition. This pass is where interview voice and principles are added deliberately, rather than being demanded from the writer.
- **The audit phase stays as defined above** (on demand, append-only `## Beyond the basics`); it is a content-gap review, not the polish pass.
