---
name: build
description: Governs running the lecture pipeline, theme publishing, and the per-question launcher; use when compiling lectures or launching a production session.
---

# Build

This skill governs the mechanical build pipeline, compiler logs, multi-theme publishing, and the automated per-question launcher (`produce_lectures.py`). Plain code authoring belongs to `code-blocks`, HTML figures belong to `figures`, and layout verification belongs to `verification`.

Digests: `skills/old-instructions/instructions.md` (build commands, themes, workflow) and `skills/old-instructions/AUTHOR-BRIEF.md`.

## Build Pipeline | 01 | Execution Context and Core Commands

[ ] Execute all build commands directly from the subproject directory: `diagram-lab/output/react-lecture-05/`. Executing from parent or sibling folders misdirects relative paths.
[ ] Use the primary compilation commands:
    * `node src/build-lectures.mjs`: Compiles `01-02-md-LECTURES/` into `01-03-md-lectures-HTML/` and `01-04-md-lectures-PDF/` via Prince XML, and rebuilds the combined reader.
    * `node src/build-lectures.mjs --no-pdf`: Fast HTML-only compilation; skips the Prince PDF step during rapid local iteration.
    * `node src/build-cards.mjs`: Compiles the card review deck alone into its designated output folders.
[ ] Pipeline folders gracefully handle absent content: builders exit cleanly with an informational notice if a source directory is empty.

[ ] PROPER EXAMPLE: make sure you follow this example, the core build commands:

> ```bash
> node src/build-lectures.mjs            # lecture + data-flow + reader, HTML and PDF
> node src/build-lectures.mjs --no-pdf   # lecture + data-flow + reader, HTML only
> node src/build-cards.mjs               # card review deck, HTML and PDF
> node src/build-cards.mjs --no-pdf      # card review deck, HTML only
> ```

Notes: Commands clearly distinguish full PDF compilation from rapid HTML-only iteration.

## Build Pipeline | 02 | Interpreting Build Logs and Error Remediation

[ ] Distinguish log line types:
    * `warn`: Indicates a structural or formatting defect in the Markdown source (missing callouts, invalid heading levels, syntax violations, or broken closing tables).
    * `note`: Indicates an automatic compiler formatting adjustment (such as collapsing isolated comment lines).
[ ] Enforce the zero-warnings gate: a build is only successful when it compiles with zero warnings.
[ ] Always apply fixes directly to the source Markdown files (`01-02-md-LECTURES/{nn}.md`) and recompile. Never edit generated HTML files in `01-03-md-lectures-HTML/` by hand: manual HTML edits are overwritten on the next build.

[ ] COUNTER-EXAMPLE: do not follow this bad example, patching generated HTML:

> A warning about the closing table is resolved by manually editing `01-03-md-lectures-HTML/42.html`, without modifying the source Markdown or rebuilding.

Notes: The next compiler execution regenerates the HTML from Markdown, immediately discarding the manual edit and restoring the warning.

## Theme Publishing | 03 | Automated Multi-Theme Publishing #2026_09_21_21_group_1 revised by #2026_09_21_21_group_2 revised by #2026_09_21_24_group_1 revised by #2026_09_21_29_group_1 revised by #2026_09_22_01_group_1

[ ] Every invocation of `node src/build-lectures.mjs` automatically compiles the entire course reader across four distinct themes:
    * **Teal Theme (`React v5.2 Q{first}-Q{last}-teal.pdf`)**: The default signature design featuring Deep Cyan-700 (`#0e7490`) accents on titles, margins, bullets, and code tabs.
    * **Black Theme (`React v5.2 Q{first}-Q{last}-black.pdf`)**: A minimalist monochrome aesthetic using solid black (`#000000`) for headings and keywords, paired with neutral slate borders and code chips.
    * **Old Theme (`React v5.2 Q{first}-Q{last}-old.pdf`)**: A classic layout inspired by the lecture-01 design, utilizing system font stacks, dark headers, and roomier comparison tables.
    * **Enhanced Theme (`React v5.2 Q{first}-Q{last}-enhanced.pdf`)**: An editorial palette based on `various/html/lecture_view_01.html`, featuring Montserrat headings, Merriweather serif italic interview questions, Inter body typography, JetBrains Mono code, vibrant teal accents (`#147b96`), and dark teal-navy code editors (`#0b2229`).
[ ] The default untagged PDF (`React v5.2 Q{first}-Q{last}.pdf`) is an alias for the Teal Theme reader.
[ ] In the revision pipeline (`02-01-md-revised/`), the compiler automatically publishes a full multi-theme deck across all five variants each time (`React v5.2-rev Q{first}-Q{last}.pdf`, `-teal.pdf`, `-black.pdf`, `-old.pdf`, `-enhanced.pdf`), even when compiling a single targeted lecture.
[ ] Format fixes authored once in source Markdown automatically publish cleanly across all four themes without manual theme-specific adjustments.

## Production Workflow | 04 | Lecture-First Production Order

[ ] For every curriculum question, author the comprehensive lecture (`01-02-md-LECTURES/{n}.md`) before creating any distilled review cards or data-flow files.
[ ] Distillation artifacts must inherit their depth from a fully resolved lecture, rather than constraining the lecture's technical depth with an abbreviated card.
[ ] Consult authoritative local React documentation (`documentation official/React 19 Sept 2026/react.dev/src/content/`) before authoring to ensure complete technical accuracy.

## Production Workflow | 05 | Search Before Introducing Existing Concepts

[ ] Before introducing a concept or hook, search existing lectures in `01-02-md-LECTURES/` to determine if it was taught earlier in the sequence.
[ ] When an earlier lecture has already established the concept, re-anchor with a brief reminder and a formal cross-reference (`(see Lecture N)`) rather than re-explaining the primitive from scratch.
[ ] Assign each concept one definitive home: avoid using conflicting metaphors across different lectures for the same mechanism.

## Automation Launcher | 06 | The `produce_lectures.py` Production CLI

[ ] Use `produce_lectures.py` to drive automated, per-question production sessions in fresh CLI processes.
[ ] Each session executes the full production cycle:
    1. Authors the Phase 1 blueprint (`01-01-md-PRE-lectures/{nn}.md`).
    2. Authors the Phase 2 production lecture (`01-02-md-LECTURES/{nn}.md`) and HTML figures.
    3. Executes `node src/build-lectures.mjs` until the build compiles with zero warnings.
[ ] Use CLI flags to control batch execution:
    * `python3 produce_lectures.py 3`: Produces the next 3 sequential questions.
    * `python3 produce_lectures.py --start 40 --chapters 1`: Targets a specific starting question.
    * `python3 produce_lectures.py --dry-run`: Displays the execution plan and prompts without invoking LLM calls.
[ ] Automated stops on failure: any build error, non-zero exit code, or missing artifact immediately halts the launcher, preventing errors from propagating down the curriculum.
