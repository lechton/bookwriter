# Svelte 5 Lecture Authoring: Project Instructions

This document outlines the standard workflow and instructions for the `online-demo-01` project inside the `diagram-lab/output/` directory.

> **Note on Project Architecture:** Each local project inside the `output/` folder (such as this one, `output/online-demo-01`) must maintain its own `instructions.md` file to track specific guidelines, architectural decisions, and workflows localized to that project. As of 2026-07-21, `online-demo-01` is the only project under `output/` that uses the `md-card/` + `md-design/` split; every sibling project (`exp-001_state`, `exp-002_key`, `exp-003_new-topics`, `exp-004_gallery`, `exp-005_redraw`, `javascript-demo`, `javascript-demo-02`, `svelte-demo`) still uses the unified `md/` folder and the global builder.

## Source of Content
The source text and questions for this deck are pulled from:
`/Users/techton/lechton/research-code/svelte dev 2026/diagram-lab/docs/200Q/200Q.md`

## Folder Layout

| Folder | Purpose | Author here? |
| --- | --- | --- |
| `md-card/{n}.md` | The learner-facing card source: question, answer, code, `<div class="dg">` diagram HTML, and the `> **Summary.**` takeaway. **No `Design description:` paragraph lives here.** | Yes |
| `md-design/{n}.md` | The image-generator spec for card `n`. One file per card; contains a single `Design description:` paragraph (one continuous line, never hard-wrapped). Empty placeholder files are kept for cards that have no design authored yet (e.g., `26.md`, `27.md`). | Yes |
| `diagrams/{n}.html` | Raw HTML/CSS snippet injected into the rendered card, authored per the design system. | Yes |
| `html/{n}.html`, `html/deck.html` | Build output. Never edit by hand. | No |
| `pdf/{n}.pdf`, `pdf/deck.pdf` | Build output rendered by Prince. Never edit by hand. | No |
| `img/{n}.png` | Standalone generated images for reference or alternative use. | N/A |
| `src/build.mjs` | **The local build script for this project.** Reads `md-card/`, writes `html/` + `pdf/`. | Rarely |
| `archive/build/v01/` | Snapshot of the original global `diagram-lab/src/build.mjs` plus a `readme.md` describing what it served. Reference only. | No |
| `img-instruction/005.md` | **The single source of truth for all diagram and image design.** Aesthetic, palette, typography, components, layout patterns, the four-element complexity budget, pedagogical rules, and the Generic Prompt to prepend to every image generation. Files `001.md`–`004.md` in the same folder are retained as historical options only — do not use them. | Read always; edit rarely |

## Build Commands

This project uses its **own local builder**, not the global one.

```sh
# From inside this project folder (online-demo-01/):
node src/build.mjs            # build html + pdf
node src/build.mjs --no-pdf   # build html only
```

The global `diagram-lab/src/build.mjs` is **not** used here. It still builds every sibling project under `output/` via their `md/` folders, but it cannot build this project (it would look for `md/`, which no longer exists). If you ever need to recall the original global invocation form (`node src/build.mjs <demo-name>` from inside `diagram-lab/`), see `archive/build/v01/readme.md`.

## The 4-Step Question Workflow

For every new question processed in this project, the following four steps MUST be executed in exact order. This ensures that the pedagogical design is deeply analyzed and uniquely tailored to the specific concept being taught.

**Before any design work:** read `img-instruction/005.md` end to end. It is the single source of truth for how diagrams look, what palette to use, how many elements are allowed, and which Generic Prompt to prepend to image generations. Do not improvise aesthetic decisions in the steps below — every visual choice is decided there.

### Step 1: Draft the Card Markdown
- Extract the next question from the source document.
- Write the file `md-card/{number}.md` using the structure and rules below.
- **Never** put a `Design description:` paragraph in `md-card/`. That content now lives exclusively in `md-design/`.

**File structure (in this exact order):**

- **Title line:** `## Q{number} — {Short Title}` — the question header. Always starts with `## Q` and an en-dash separator.
- **Tags line:** `@tags Topic1, Topic2, Subtopic3` — comma-separated chips that the renderer turns into tag pills. Three to five tags is typical.
- **Blank line, then the question:** `**Question.** {the full question text, one continuous line, never hard-wrapped.}`
- **Blank line, then the answer:** `**Answer.**` on its own line, then the answer body structured per the "Answer body format" rules below.
- **Blank line, then the code block:** a fenced ` ```svelte title="App.svelte" ` (or ` ```js `) block with a real, runnable example that fits the National-Exams review spirit — short, focused on the one mechanism, not an exhaustive tutorial.
- **Blank line, then the diagram placeholder:** an empty `<div class="dg" style="..."></div>` block. This is required by the parser as an anchor; the actual diagram content is injected from `diagrams/{number}.html` at build time.
- **Blank line, then the summary:** `> **Summary.** {one continuous line, never hard-wrapped, distilling the takeaway.}`

**Answer body format (mandatory for all new cards):**

- **Use bullet points, not prose paragraphs.** The answer body is a list of `- ` bullets, grouped under bold-titles.
- **Group with bold-titles, never markdown headers.** Each group starts with a standalone line of bold text: `**The mechanism — what happens on every write**` on its own paragraph, immediately followed by the bullet list for that group. Two to four groups per answer is typical.
- **Each bullet leads with a bold mini-title.** Format: `- **Mini-title:** rest of the bullet.` The mini-title names the concept; the rest of the bullet explains it.
- **Bold the most important keywords inside each bullet** — the technical terms, the function names, the invariant. A reader skimming only the bold text should still grasp the card's point.
- **Every technical term is kept AND immediately defined in plain English** in the same sentence. Never use jargon alone. Pattern: `the **microtask queue** — a built-in JavaScript list of tiny tasks the browser runs after your current function finishes, but before it paints anything`. The term stays (so the reader builds vocabulary), the parenthetical or em-dash clause explains what it actually means.
- **Prescriptive, not descriptive.** Each group should make an argument (do this, avoid that, this is the only case where X applies), not merely describe what exists.
- **Reference related cards by number** when relevant: `(see Q47)`, `(see Q35)`. This builds the deck into a connected review guide.

**Parser constraints (do not violate — the build will crash or misrender):**

- **Never use `### ` (h3) or deeper markdown headers** inside a card. The parser at `src/build.mjs` has no handler for `### `; using it causes an infinite loop and an out-of-memory crash. Use bold-text standalone lines as group titles instead (see above).
- **Only `## ` (question header) and `# ` (h1) are supported** as markdown headers.
- **One continuous line per paragraph, per bullet, per tag line, per summary** — never hard-wrap (per AGENTS.md). The parser joins consecutive non-blank lines into one paragraph, so a hard-wrapped sentence will still render correctly, but the source must stay unwrapped for diff readability and TTS safety.
- **Blank lines separate blocks.** Every block (question, answer, code, diagram, summary) is preceded and followed by a blank line. Without the blank line, the parser merges adjacent blocks.
- **The `<div class="dg">` block must have no blank lines inside it** and must be immediately closed with `</div>` on the last line. The parser reads raw HTML until the first blank line.
- **Fenced code blocks must be closed.** Every ` ``` ` opener needs a matching ` ``` ` closer, or the parser will swallow the rest of the file as code.

### Step 2: Compose the Design Description (separate file)
- Create `md-design/{number}.md` (parallel numbering to `md-card/`).
- Write exactly one `Design description:` paragraph — one continuous line, never hard-wrapped (per AGENTS.md).
- Describe the visual metaphor for this card. All aesthetic, palette, typography, layout-pattern, and complexity-budget rules live in `img-instruction/005.md` — follow them, do not restate them here. This file only describes *what* this specific diagram shows and which one of the sanctioned layout patterns it uses.

### Step 3: Create the HTML Design and PDF Build
- Author the raw HTML/CSS diagram in `diagrams/{number}.html`, strictly following the metaphor in `md-design/{number}.md` and the design system in `img-instruction/005.md`.
- Run the build script (`node src/build.mjs` from inside this project folder) to inject the HTML into the deck and compile the final `.pdf` output.

### Step 4: Generate the PNG Image
- Generate the standalone image artifact by prepending the **Generic Prompt** from `img-instruction/005.md` (section 8) to the specific `Design description:` paragraph read from `md-design/{number}.md`.
- Save the resulting image as `img/{number}.png` inside the project folder for reference or alternative use.

## Why the split exists

Before 2026-07-21, both the card content and the `Design description:` lived in the same `md/{n}.md` file. The global builder had to carry a strip hack (`if (!text.startsWith('Design description:'))`) so the spec paragraph would not leak onto the rendered card. Splitting card (`md-card/`) from spec (`md-design/`) removes that hack, gives each concern its own numbered file, and lets the local builder be simpler than the global one. The strip line is gone from `src/build.mjs`; if a stray `Design description:` ever appears in `md-card/` it will now render onto the card, so keep the two folders disciplined.

A parallel consolidation happened the same day for the design system: the four prior instruction files (`img-instruction/001.md` through `004.md`) described three mutually contradictory aesthetics (dark-mode-with-glow, paper Neo-Brutalism, and Tailwind-pastel Neo-Brutalism with playful tilts). They are retained as historical options but are no longer authoritative. `005.md` is the only file that decides how diagrams look. If you find yourself reaching for a palette rule or a Generic Prompt fragment that is not in `005.md`, add it there first — never inline it back into `instructions.md` or into an individual `md-design/` file.
