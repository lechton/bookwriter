# AGENTS.md — Svelte 5 Lecture Authoring

This workspace authors a Svelte 5 teaching series. Each lesson has figures, a Q&A digest, and an audio lecture. The methods live as skills in `skills/`; load the skill that matches the task.

## Authoring an audio lecture (in parts)
- Orchestration: `skills/write_lecture_in_parts.md` — one lecture part per coding snippet, threaded into a single chapter lecture, written to the chapter's `md-lecture/` folder.
- Method per part: `skills/write_lecture_plus_5.md` — the World / Term / Mechanism systems, the voice and its banned moves, TTS-safety, and the eight-gate final check.
- A chapter lives at `Pencil/build 05/<chapter>/`: `chapter.md` (the arc), `md/` (the snippet sections), `md-lecture/` (the lecture parts to write). A ready task brief sits at `Pencil/build 05/04_extra_javascript_1/md-lecture/_ANTIGRAVITY_TASK.md`.

## Always-on conventions
- Never hard-wrap. One continuous line per paragraph, bullet, or prompt, in every file.
- Lectures are TTS-safe: no code, no symbols a synthetic voice cannot read, no em-dashes; a standalone lesson that never addresses whoever commissioned it.
- **Organic Lexical Audit (OLA)**: Always introduce new lexical terms using visceral, real-world, high-stakes contexts. Don't just explain the feature—create a scenario where the newbie would physically hit a wall without it (e.g., "if you rename the ID, the button breaks silently and you lose the sale").
- **Typology Tagging**: Every lecture's interview question must include its curriculum typology (`❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`). Format: `> INTERVIEW QUESTION | ❱ CORE | [Question text]`.
- **Table Formatting**: The top row of a markdown table acts as the header. Format column titles using a break: `**MAIN TITLE**<br>(subtitle)`. To prevent awkward grey-box padding breaks in the PDF, use `<br>` to manually wrap long code strings inside table cells (e.g., `` `element.addEventListener`<br>`('click', fn)` ``).
- In code snippets, use ✔️ and ✖️ in comments to indicate what one should do or NOT do.
- NEVER put a comment (`//` or `<!--`) on an empty line inside a code snippet. It renders as an ugly, disconnected floating bubble. Always attach comments to the end of the line of code they describe (use `<br>` inside the comment for multi-line explanations).
- Do not edit a section's `## Explanation`. It builds the figure (PNG), which guides the Gemini infographic.
- A section's title format is "Topic: Lesson"; examples are real, runnable scripts in the National Times world.

## Building PDFs and Screenshots
When asked to rebuild a PDF or update screenshots, follow these steps:
1. **Regenerate screenshots**: `cd Pencil && node render.mjs`
2. **Build a chapter PDF**: `cd Pencil && node book/build-book.mjs <chapter_folder>` followed by `cd book/out && prince <chapter_folder>.html -o <chapter_folder>.pdf`
3. **Build the whole book**: `cd Pencil && node book/build-book.mjs all && cd book/out && prince book.html -o book.pdf`
