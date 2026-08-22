# Skill: Write a Concept MD (the content source for a figure/lesson)

A Concept MD is the readable, structured markdown SOURCE for ONE concept — its title, the project files, the code snippet(s), the per-line comments, the summary, and the explanation. It is the CONTENT, written to be read on its own. It is NOT image instructions: how to turn it into a figure lives entirely in `build_pencil_image_3.md`, never here. One file per concept. A theme-03 figure is built FROM a Concept MD; a lecture, booklet, or Q&A digest can also draw from it.

Location: `Pencil/build 04/<lesson>/<NN-slug>.md`; multi-file demos under `Pencil/build 04/demos/`. (`build 04` is the content tree — parallel to the image-build trees `build 02`/`build 03`, but it holds source content, not renders.)

---

## THE FORMAT (sections, in order)

### `# [Topic]: [Concept title]` — H1
Start with the OBJECT/topic, then a colon, then the moral lesson (one clear declarative line). The topic names the concept plainly so the reader knows the subject at a glance. Examples: `# Closure: A Closure Keeps a Function's Variables Alive and Private`; `# Prototype: Own Properties First, Then Inherited from the Prototype`; `# Module Closure: A Module's State Is Created Once and Shared by Every Importer`.

### `## Project`
An ASCII file tree of a realistic layout for THIS example's domain: JavaScript-foundation examples live in `js_review/examples/`; Svelte examples in `src/lib/…` (role subfolders `stores/`, `components/`, `models/`…) or `src/routes/…`. It contains ONLY the files THIS example involves — often TWO (a module and the file that imports it) — with the file(s) in focus marked `◀ …`. Clean file names, no trailing slash. DESIGN it per example; never reuse another's tree. The paths here match the code fences' `title=`.

### `## [Snippet topic]` — one or more
A short heading naming what the snippet shows. Single-script: a description (e.g. "One private value, three exported functions"). Multi-script: the role (e.g. "Parent — passes it down" / "Child — receives it"). Then the code, clean only:

    ```js title="src/lib/stores/session.js"
    …code…
    ```

### `### Code Comments`
Directly under each snippet. Exactly ONE comment per explained code line, keyed by that line's number, blank-line separated, in `**N** | …` form. NEVER merge line numbers into a range (no `**9–10**`): if two lines are identical code — e.g. `article.clap();` twice — give EACH its own entry describing what that specific call does. Repeat the line. Example:

`**2** | login()` is exported. It writes the private `reader` …

Skip trivial lines (lone braces, `<script>` tags). For a MULTI-script concept, repeat the trio `## [topic] → code → ### Code Comments` for each snippet, in order.

### `## Summary`
One tight paragraph distilling the lesson. **Bold** the load-bearing phrases — those become the figure's highlights.

### `## Explanation`
The concept, carried as CONTENT (never image instructions), in this order:
1. A short prose paragraph stating the rule.
2. An ASCII DIAGRAM of the relationship, in a fenced code block (see below).
3. Outcomes as a checklist — `✅` for each resolved case, `❌` for the failing case.
4. A glossary — `- **term** — definition`.
5. `**Takeaway:** …` — one line.

`## Explanation` STAYS in every md — it is what builds the figure/PNG, which in turn guides the Gemini infographic. Do not remove it for the book; the book simply renders the `## Lecture` prose in its place.

### `## Lecture` (last field)
A pedagogically independent spoken lecture for this section (a few paragraphs, ~300–450 words) — the source for BOTH the chapter audio (TTS) and the book body (the prose that replaces the diagram on the page). It teaches the concept in full from the foundations up: it recalls the basics, defines jargon on the spot, and works the example with concrete values and outcomes, so a listener who never sees the figure still learns it — and it carries the connective tissue (bridge from the previous concept, hook into the next). Never a watered-down précis of the Summary. Audio-safe (nothing the eye must find). See `write_chapter_lecture.md` for the full rules and the `00-intro`/`99-outro` frame files.

---

## THE EXPLANATION DIAGRAM IS ASCII, NOT INSTRUCTIONS
Draw the diagram in ASCII characters inside a code block — boxes, arrows (`──▶`, `◀──`, `│`, `╳`), short labels — so the md is concrete and self-contained. Do NOT write a prose "instruction to draw an image". The figure-builder skill reads the ASCII + the surrounding content and produces the designed (Pencil) diagram; all rendering rules live there, not here.

---

## THE CODE MUST RUN
Every example is a real, runnable standalone script a developer could paste and run — not an abstract sketch. Make it print its result with `console.log(...)` (the output is explained in the Code Comments, NOT as inline `//` comments — keep the fenced code clean). Use concrete, human values (`"John"`, `"Ada Lovelace"`), never a bare `null`/`undefined` as the subject. Reach for the real shape the concept needs: TWO files when it is about imports (a module + the file that imports it, run with `node app.js`); `setTimeout(...)` to mimic a slow data load for async; or a free open API (e.g. `https://jsonplaceholder.typicode.com/...`, `https://api.github.com/...`) for a real `fetch`. Simple, practical, runnable locally — close enough to real code to train a working developer.

## CONVENTIONS
- Code fence: ` ```lang title="src/lib/path/File.ext" ` — the title is the file's REAL path, and it agrees with the `## Project` tree and (later) the figure's editor tab.
- Clean code only in the fence — no inline comments; all per-line explanation goes in `### Code Comments`.
- Never hard-wrap any line; every comment, paragraph, and bullet is one continuous line.
- Summary highlights are `**bold**`; glossary terms are `**bold**`; the takeaway is one bold-led line.

## WORKED EXAMPLES
- Single-script: `Pencil/build 04/04_extra_javascript_1/03-module-closure.md`.
- Multi-script: `Pencil/build 04/demos/demo_01.md`.

## HOW THIS FEEDS A FIGURE
`build_pencil_image_3.md` maps each section to a block: title → title; Project → the explorer (block 0); each `## topic` → a `.snip-h` + editor; `### Code Comments` → the line-by-line; Summary → the Summary callout; Explanation prose+ASCII+outcomes+glossary+takeaway → the Explanation block (callout, diagram, outcomes, glossary, takeaway). The Concept MD holds WHAT; the figure skill holds HOW.
