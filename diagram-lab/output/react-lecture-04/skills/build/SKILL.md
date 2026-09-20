---
name: build
description: Governs running the lecture pipeline, theme publishing, and the per-question launcher; use when compiling lectures or launching a production session.
---

# Build

This skill governs the mechanical side of the project: running the builders from the project folder, reading the build log, and letting Multi-Theme Publishing produce the course reader once per theme. It also fixes the lecture-first workflow order, the phased workflow for small-context writing models, and the per-question launcher (produce_lectures.py) that drives per-question production sessions. Figure authoring lives elsewhere, so see the figures skill; visual verification of compiled pages lives in the verification skill.

Digests: skills/old-instructions/instructions.md (build commands, themes, workflow, small-context workflow) and AUTHOR-BRIEF.md

## Pipeline | 01 | Run the build from the project folder

[ ] Invoke the builders from inside the project folder (`diagram-lab/output/react-lecture-04/`), so the relative source and output folders resolve to this project and not to a sibling.
[ ] `node src/build-lectures.mjs` compiles `md-lectures/` into `md-lectures-html/` and `md-lectures-pdf/` via Prince, and the same invocation rebuilds the data-flow and review pipelines.
[ ] `node src/build-cards.mjs` builds the card pipeline alone, from `md-cards/` into its own HTML and PDF output folders.
[ ] Pass `--no-pdf` to either builder when HTML output is enough, so quick iteration skips the Prince step until the final PDFs are needed.
[ ] The builders report `no markdown files in md-lectures/` (or `md-data-flow/`, `md-cards/`) and exit cleanly when a source folder is empty or absent, so it is safe to run any pipeline before its content exists.
[ ] The data-flow pipeline shares `src/build-lectures.mjs` with the lectures and the review experiment, and it skips cleanly when `md-data-flow/` is absent or empty, so one command covers all three.

[ ] PROPER EXAMPLE: make sure you follow this example, the two builders and their HTML-only variants:

> ```bash
> node src/build-lectures.mjs            # lecture + data-flow + review, html and pdf
> node src/build-lectures.mjs --no-pdf   # lecture + data-flow + review, html only
> node src/build-cards.mjs               # card html and pdf
> node src/build-cards.mjs --no-pdf      # card html only
> ```

Notes: Each command carries a comment stating exactly what it produces, so the build log can be checked against the expectation.

## Pipeline | 02 | Read the build log by line type

[ ] Treat a `warn` line as a format violation in the source markdown: fix the source file and rebuild, because the durable fix lives where the build reads it.
[ ] Treat a `note` line as something the build already repaired (for example a comment-only code line merged into the next code line), so it is safe to leave in place.
[ ] Aim for zero warnings on every build: zero warnings is the mechanical gate, and a clean build is the mechanical definition of done.
[ ] Expect warnings to name the block to fix: title shape, the interview-question line, a missing callout, a missing `### Summary`, and the closing-table shape.
[ ] Take visual checks beyond the log (screenshots of figures and visual assets) to the verification skill, since the log certifies format, not appearance.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> A warn about the closing table is fixed by editing the generated HTML in `md-lectures-html/42.html` by hand, and the build is not run again.

Notes: The build regenerates the HTML from the markdown on every run, so the hand edit is discarded and the warn returns. The durable fix belongs in the source markdown, followed by a rebuild.

## Pipeline | 03 | Know what each pipeline produces

[ ] The project runs three parallel content pipelines, each with its own source folder, build step, and HTML/PDF output folders: lectures (comprehensive, long-form), cards (distilled, reviewable), and data-flow (architectural placement in a real app).
[ ] All three pipelines draw from the same 180-question curriculum and the same local React documentation, so their numbering lines up and artifacts cross-reference each other by number (`(see Lecture 41)`, `(see Q41)`).
[ ] Each pipeline produces per-file HTML and PDF plus one combined output: the course reader for the lectures pipeline, the full card deck for the card pipeline, and the data-flow atlas for the data-flow pipeline.
[ ] The data-flow file teaches where a mechanism belongs in a real component tree, grounded in the fixed ElectroShop reference architecture, while the lecture carries the depth and the card carries the review form, so the three artifacts complement rather than duplicate each other.

## Themes | 04 | Expect Multi-Theme Publishing on every compilation

[ ] Every compilation of `node src/build-lectures.mjs` automatically publishes the entire course reader once per theme under the pipeline's reader name, so a single build yields every theme variant with no extra step.
[ ] The teal theme (`React 19 Q{first}-Q{last}-teal.pdf`) applies the signature Deep Teal / Cyan-700 `#0e7490` to the main title `h1`, left-margin headings, narrative bold keywords, list bullets, code pills, and summary markers.
[ ] The black theme (`React 19 Q{first}-Q{last}-black.pdf`) applies solid black `#000000` to the main title, the left-margin headings, summary subtitles, and all bold keywords inside narrative paragraphs, paired with neutral slate inline code pills and slate borders.
[ ] The old theme (`React 19 Q{first}-Q{last}-old.pdf`) reproduces the react-lecture-01 look: the same teal accent `#0e7490` on callout borders, with the -01 typography, meaning the system font stack instead of Avenir Next, weight-700 black `h1` and left-margin headings, plain black bold keywords, default-size bullets, the plain grey inline code chip, left-aligned paragraphs, and roomier comparison tables.
[ ] Treat the themes as cosmetic variants of the same compiled content, so a format fix lands once in the markdown and republishes across all three.

## Readers | 05 | Know the reader names and their aliases

[ ] The lectures pipeline publishes its combined reader under the reader name `React 19 Q{first}-Q{last}` (for example `React 19 Q01-Q39`), dynamically named with its question range, so the coverage is readable from the filename.
[ ] The untagged `React 19 Q{first}-Q{last}.pdf` (and `.html`) is the teal alias, so the default reader and the teal reader carry the same content under two names.
[ ] The card pipeline publishes the full card deck and the data-flow pipeline publishes the atlas, both as `deck.html`/`deck.pdf`, because those pipelines have no dedicated reader name.
[ ] Expect no separate `deck-*` reader files from the lectures pipeline, so the reader set stays free of duplicates of the same content.

## Workflow | 06 | Keep the lecture first

[ ] For every new question, write the lecture (`md-lectures/{n}.md`) before any card or data-flow file, because writing the card first risks losing the depth the lecture is meant to establish.
[ ] The lecture pipeline is authored first per question and the card and data-flow pipelines follow, so both later artifacts distill from a finished lecture instead of setting its ceiling.
[ ] Start the lecture file with `# Lecture {n}: {Short Title}` as its first line, so the build recognizes the title shape.
[ ] Read the matching local React documentation under `documentation official/React 19 Sept 2026/react.dev/src/content/` before writing, anchoring every technical claim to the docs when possible and expanding with research where the docs are insufficient.
[ ] Finish the lecture with the new-terms check so no jargon lands superficially; see the lecture-voice skill for the 5-step intervention.
[ ] Draw the lecture's format details from their own skills rather than from memory: see the lecture-structure, code-blocks, and ui-panels skills.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> Question 42 arrives, so the card `md-cards/42.md` is drafted first, and the lecture is planned afterwards as an expansion of the card.

Notes: The card is a distillation artifact, so writing it first fixes the vocabulary and the depth ceiling before the lecture establishes them, and the lecture inherits the card's compression instead of the card inheriting the lecture's depth.

## Workflow | 07 | Search the deck before teaching a term

[ ] Before introducing and explaining any term, scan the earlier lectures for it (search `md-lectures/` for the hook name, the API name, or the concept phrase), because concepts repeat across the 180 questions and the reader meets them in order.
[ ] When an earlier lecture already taught the term, re-anchor instead of re-teaching: give the term, its one-line reminder, and `(see Lecture N)`, then deepen, contrast, or extend from there.
[ ] Give each concept one home: two lectures teaching one concept with two metaphors and no cross-reference (a "snapshot" in one, a "photocopy" in the other) double the reader's vocabulary for a single idea and leave neither lecture the term's home.

## Workflow | 08 | Run the audit phase on demand

[ ] Run the audit phase when the user asks for it, so a writing session is free to end at a clean build without an uninvited review pass.
[ ] Treat the audit as a content-gap review, not the polish pass: it appends to a `## Beyond the basics` section (append-only), so it adds depth rather than re-editing existing prose.

## Workflow | 09 | Split long lectures across sessions when one session cannot finish them

[ ] Target 800 to 1,200 words for a completed lecture (about 1,000 on average), with ADVANCED questions running up to 1,500, so most lectures fit one writing session.
[ ] Treat parts as optional: split a lecture into parts when one session cannot write it well, typically a long ADVANCED lecture.
[ ] Write parts to `md-lectures-plan/{n}-part1.md`, `{n}-part2.md`, and so on, and keep part files in that folder, so in-progress pieces have a single home.
[ ] Start every part session by re-reading the outline (if any) and the previous part's last paragraph, which is how a forgetful model stays continuous across sessions.
[ ] Concatenate the parts into `md-lectures/{n}.md`, then run `node src/build-lectures.mjs` and fix every warning it prints.
[ ] After assembly, give the lecture a polish pass with a different model or a fresh session holding full edit authority: add at least one interview `[!TIP]` callout, add or sharpen `[!KEY]` takeaways, tighten the Summary and the closing table, and fix every warning the build printed.
[ ] End the polish pass by running the build, with zero warnings as its exit condition; this pass is where interview voice and principles are added deliberately, rather than being demanded from the writer.

## Launcher | 10 | One fresh CLI session per question

[ ] `produce_lectures.py` is the per-question launcher: it runs one fresh CLI session per question, so each lecture starts from a clean context instead of inheriting the previous question's clutter.
[ ] Each session drives the full per-question sequence: write the prelecture (`md-pre-lectures/{nn}.md`), write the production lecture (`md-lectures/{nn}.md`) with its HTML figure files, then build with `node src/build-lectures.mjs` until the build is clean, producing the per-lecture PDF (`md-lectures-pdf/{nn}.pdf`) and the combined course-reader deck.
[ ] Question file basenames are zero-padded for 1 to 99 and natural for 100 and up (`01.md`, `100.md`), matching the numbering across the per-question folders, so artifacts cross-reference cleanly.

[ ] PROPER EXAMPLE: make sure you follow this example, the launcher's usage surface:

> ```bash
> python3 produce_lectures.py 3                     # next 3 questions, auto-detect start
> python3 produce_lectures.py --start 40 --chapters 1
> python3 produce_lectures.py --dry-run             # show plan + prompt, invoke nothing
> ```

Notes: `--dry-run` prints the plan and the prompt without invoking the CLI, so a run can be reviewed before it commits.

## Launcher | 11 | The next-question logic stops the run on any failure

[ ] The launcher launches the next iteration with a brand-new CLI process after the current question's PDF is verified fresh on disk, so a stale or missing artifact is caught before the run moves on.
[ ] Any failure (model not available, the CLI exits non-zero, missing or stale PDF or deck) stops the whole run, so a failed question surfaces immediately instead of being skipped.
[ ] Verification floors on file sizes (prelecture, lecture, and PDF) catch stub files the agent may leave behind, so an empty or placeholder file counts as a failure.

## Launcher | 12 | Treat the launcher's embedded prompts as reference until rewired

[ ] Know the caveat: `produce_lectures.py` still points its embedded prompts at the old root filenames (`PRE-LECTURE-INSTRUCTIONS.md`, `AUTHOR-BRIEF.md`, `instructions.md`), which now live under `skills/old-instructions/`, so the prompt strings await rewiring to the new skills.
[ ] Until that rewiring lands, treat the launcher as reference for how a production session flows, and read the current skills directly when you need the binding standards.
