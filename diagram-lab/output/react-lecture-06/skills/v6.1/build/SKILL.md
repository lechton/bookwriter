---
name: build
description: Governs running the lecture pipeline, theme publishing, and the per-question launcher; use when compiling lectures or launching a production session.
---

# Build

This skill governs the mechanical build pipeline, compiler logs, multi-theme publishing, and the automated per-question launcher (`produce_lectures.py`). Plain code authoring belongs to `code-blocks`, HTML figures belong to `figures`, and layout verification belongs to `verification`.

Digests: `skills/old-instructions/instructions.md` (build commands, themes, workflow) and `skills/old-instructions/AUTHOR-BRIEF.md`.

## Build Pipeline | 01 | Execution Context and Core Commands

[ ] Execute all build commands directly from the subproject directory: `diagram-lab/output/react-lecture-06/`. Executing from parent or sibling folders misdirects relative paths.
[ ] Enforce the Versioned Directory Architecture & Latest Version Law: source lectures, blueprints, figures, HTML, and PDF outputs are organized into version subfolders (`01-02-md-LECTURES/<version>/`, `01-01-md-PRE-lectures/<version>/`, `01-03-md-lectures-HTML/<version>/`, `01-04-md-lectures-PDF/<version>/`, and `01-02-md-LECTURES/<version>/figures/`). The default curriculum version is determined by the Compound Default Version Law: highest version in `skills/` AND highest version in the lesson markdown files (e.g. highest in skills `v6.1` + highest in lessons `v5` = `v6.1-5`; currently `v6.2` in skills + `v2` in lessons yields `v6.2-2`). All internal operations (building, authoring, diagnostics, sequential additions) target the latest version by default unless an explicit version is specified. #2026_09_24_05_group_1 revised by #2026_09_25_01_group_1
[ ] Use the primary compilation commands:
    * `node src/build-lectures.mjs`: Compiles the latest version of `01-02-md-LECTURES/<version>/` (e.g. `v2/`) into `01-03-md-lectures-HTML/<version>/` and `01-04-md-lectures-PDF/<version>/` via Prince XML, and rebuilds the multi-theme reader deck inside that version folder. To target a specific version, pass `--version <ver>` (e.g. `node src/build-lectures.mjs --version v1` or `--version v6.1-5`). #2026_09_24_05_group_1 revised by #2026_09_25_01_group_1
    * `node src/build-lectures.mjs --no-pdf`: Fast HTML-only compilation; skips the Prince PDF step during rapid local iteration.
    * `node src/build-cards.mjs`: Compiles the card review deck alone into its designated output folders.
[ ] Pipeline folders gracefully handle absent content: builders exit cleanly with an informational notice if a source directory is empty.

[ ] PROPER EXAMPLE: make sure you follow this example, the core build commands:

> ```bash
> node src/build-lectures.mjs            # compiles latest version (e.g. v2 -> v6.2-2), HTML and PDF
> node src/build-lectures.mjs --version v1 # explicitly targets v1 (yields v6.2-1)
> node src/build-lectures.mjs 04         # compiles lecture 04 in latest version (no single-question deck created)
> node src/build-lectures.mjs --no-pdf   # latest version, HTML only
> node src/build-cards.mjs               # card review deck, HTML and PDF
> node src/build-cards.mjs --no-pdf      # card review deck, HTML only
> ```

Notes: Commands clearly distinguish full PDF compilation from rapid HTML-only iteration, and automatically resolve the latest compound version. Single-lecture runs compile only the individual lecture (e.g. `04.pdf`), never single-question decks.

## Build Pipeline | 02 | Interpreting Build Logs and Error Remediation

[ ] Distinguish log line types:
    * `warn`: Indicates a structural or formatting defect in the Markdown source (missing callouts, invalid heading levels, syntax violations, or broken closing tables).
    * `note`: Indicates an automatic compiler formatting adjustment (such as collapsing isolated comment lines).
[ ] Enforce the zero-warnings gate: a build is only successful when it compiles with zero warnings.
[ ] Always apply fixes directly to the source Markdown files in the active version (`01-02-md-LECTURES/<version>/{nn}.md`, e.g. `01-02-md-LECTURES/v2/{nn}.md`) and recompile. Never edit generated HTML files in `01-03-md-lectures-HTML/` by hand: manual HTML edits are overwritten on the next build. #2026_09_24_05_group_1

[ ] COUNTER-EXAMPLE: do not follow this bad example, patching generated HTML:

> A warning about the closing table is resolved by manually editing `01-03-md-lectures-HTML/42.html`, without modifying the source Markdown or rebuilding.

Notes: The next compiler execution regenerates the HTML from Markdown, immediately discarding the manual edit and restoring the warning.

## Theme Publishing | 03 | Automated Multi-Theme Publishing #2026_09_21_21_group_1 revised by #2026_09_21_21_group_2 revised by #2026_09_21_24_group_1 revised by #2026_09_21_29_group_1 revised by #2026_09_22_01_group_1 revised by #2026_09_25_01_group_1

[ ] Every invocation of `node src/build-lectures.mjs` on multiple lectures automatically compiles the entire course reader across four distinct themes, dynamically named with its compound version (`React ${skillsVersion}-${lessonVersion} Q{first}-Q{last}*`, e.g. `React v6.0-1 Q01-Q10-black.pdf` or `React v6.2-2 Q01-Q13-black.pdf`):
    * **Teal Theme (`React ${ver} Q{first}-Q{last}-teal.pdf`)**: The default signature design featuring Deep Cyan-700 (`#0e7490`) accents on titles, margins, bullets, and code tabs.
    * **Black Theme (`React ${ver} Q{first}-Q{last}-black.pdf`)**: A minimalist monochrome aesthetic using solid black (`#000000`) for headings and keywords, paired with neutral slate borders and code chips.
    * **Old Theme (`React ${ver} Q{first}-Q{last}-old.pdf`)**: A classic layout inspired by the lecture-01 design, utilizing system font stacks, dark headers, and roomier comparison tables.
    * **Enhanced Theme (`React ${ver} Q{first}-Q{last}-enhanced.pdf`)**: An editorial palette based on `various/html/lecture_view_01.html`, featuring Montserrat headings, Merriweather serif italic interview questions, Inter body typography, JetBrains Mono code, vibrant teal accents (`#147b96`), and dark teal-navy code editors (`#0b2229`).
[ ] The default untagged PDF (`React ${ver} Q{first}-Q{last}.pdf`) is an alias for the Teal Theme reader.
[ ] Absolute Ban on Single-Lecture Decks: Decks are strictly multi-lecture readers spanning at least two distinct questions (`allNumFiles > 1` and `first !== last`). Single-lecture compilation (`node src/build-lectures.mjs {NN}` or `--range {NN}-{NN}`) generates strictly the isolated lecture artifacts (`{NN}.html` and `{NN}.pdf`). Creating individual file decks (e.g. `React v6.0 Q13-Q13-old.pdf`) makes no sense and is strictly prohibited; any legacy single-file decks matching `Q(\d+)-Q\1` are automatically purged by the compiler. #2026_09_25_01_group_1
[ ] In the revision pipeline (`02-01-md-revised/`), the compiler automatically publishes a full multi-theme deck across all five variants each time (`React ${ver}-rev Q{first}-Q{last}.pdf`, `-teal.pdf`, `-black.pdf`, `-old.pdf`, `-enhanced.pdf`), provided multiple revised lectures exist.
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
[ ] The orchestrator automatically resolves the latest version subdirectory (`01-02-md-LECTURES/<version>/`, `01-01-md-PRE-lectures/<version>/`, `01-04-md-lectures-PDF/<version>/`), scans answered questions in that version, and targets the next unanswered question in the latest version by default. To target an explicit version, use `--version <ver>`. #2026_09_24_05_group_1
[ ] Each session executes the full production cycle:
    1. Authors the Phase 1 blueprint (`01-01-md-PRE-lectures/<version>/{nn}.md`).
    2. Authors the Phase 2 production lecture (`01-02-md-LECTURES/<version>/{nn}.md`) and HTML figures (`01-02-md-LECTURES/<version>/figures/`).
    3. Executes `node src/build-lectures.mjs` until the build compiles with zero warnings.
[ ] Use CLI flags to control batch execution:
    * `python3 produce_lectures.py 3`: Produces the next 3 sequential questions in the latest version.
    * `python3 produce_lectures.py --version v1 2`: Targets version v1 explicitly.
    * `python3 produce_lectures.py --start 14 --chapters 1`: Targets a specific starting question.
    * `python3 produce_lectures.py --dry-run`: Displays the execution plan and prompts without invoking LLM calls.
[ ] Automated stops on failure: any build error, non-zero exit code, or missing artifact immediately halts the launcher, preventing errors from propagating down the curriculum.
