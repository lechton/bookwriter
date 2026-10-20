---
name: build
description: Governs running the lecture pipeline, theme publishing, and the per-question launcher; use when compiling lectures or launching a production session.
---

# Build

This skill governs the mechanical build pipeline, compiler logs, multi-theme publishing, and the automated per-question launcher (`produce_lectures.py`). Plain code authoring belongs to `code-blocks`, HTML figures belong to `figures`, and layout verification belongs to `verification`.

Digests: `skills/old-instructions/instructions.md` (build commands, themes, workflow) and `skills/old-instructions/AUTHOR-BRIEF.md`.

## Build Pipeline | 01 | Execution Context and Core Commands

- [ ] Are all build commands executed directly from the subproject directory: `projects/react-08/`?
- [ ] Is the versioned directory architecture respected across source lectures, blueprints, figures, HTML, and PDF outputs (`01-02-md-LECTURES/<version>/`, `01-01-md-PRE-lectures/<version>/`, `01-03-md-lectures-HTML/<version>/`, `01-04-md-lectures-PDF/<version>/`, and `01-02-md-LECTURES/<version>/figures/`)? #2026_09_24_05_group_1 revised by #2026_09_25_01_group_1
- [ ] Is the default curriculum version determined by the Compound Default Version convention (highest in `skills/` + highest in lessons markdown, e.g. `v6.4` skills + `v4` lessons yields `v6.4-4`)? #2026_09_25_01_group_1
- [ ] Do internal operations target the latest version by default unless an explicit version flag is passed?
- [ ] Are the primary compilation commands used appropriately for the task:
    * `node src/build-lectures.mjs`: Compiles the latest version of `01-02-md-LECTURES/<version>/` (e.g. `v4/`) into `01-03-md-lectures-HTML/<version>/` and `01-04-md-lectures-PDF/<version>/` via Prince XML, and rebuilds the multi-theme reader deck inside that version folder. By default, principles compile using full-width breakout cards (`code-plus`) with top-right watermark badges and line-targeted speech bubble cloud comments (`.cmt-bubble`). To target a specific version, pass `--version <ver>` (e.g. `node src/build-lectures.mjs --version v1` or `--version v6.4-1`). #2026_09_24_05_group_1 revised by #2026_09_25_01_group_1 and #2026_09_27_06_group_1
    * `node src/diagnose-lecture.mjs {NN}`: Audits lecture {NN}. It prints the content checks first (principle cards against the map, question cycles, `//` comments after JSX markup and `{/* */}` after a statement, side notes, a recall list that names a later lecture, curriculum and ledger owners) and the mechanical metrics last (block density, principle card comments, comment-free summary blocks, bubble stacking spacing, line width bounds, and zero multi-line code in content). When auditing code comments in Phase 2, pass `--audit --revised` (`node src/diagnose-lecture.mjs {NN} --audit --revised`) to verify the token-comment targeting invariants on the audited copy in `02-01-md-revised-1/<version>/`. Must pass with 0 gate failures before certifying a lecture. #2026_10_03_11_group_1 revised by #2026_10_04_04_group_1, #2026_10_04_06_group_1, #2026_10_04_10_group_1, #2026_10_10_01_group_4, #2026_10_11_01_group_3, and #2026_10_11_01_group_6
    * Audited copies: `02-01-md-revised-1/<version>/{nn}.md` holds the lecture with its `~token~` markers; every build also compiles it into `02-02-md-revised-1-html/<version>/` and `02-03-md-revised-1-pdf/<version>/`. The working lecture in `01-02-md-LECTURES/<version>/` stays token-free. #2026_10_04_10_group_1
    * `node src/build-lectures.mjs --compact-principles`: Compiles lectures using the alternative legacy compact principle card layout with `<pre><code>` blocks and bottom notes. #2026_09_27_06_group_1
    * `node src/build-lectures.mjs --no-pdf`: Fast HTML-only compilation; skips the Prince PDF step during rapid local iteration.
    * `node src/build-cards.mjs`: Compiles the card review deck alone into its designated output folders.
    * `node src/build-code-plus.mjs`: Dedicated standalone variant generator for code-plus builds. #2026_09_27_06_group_1
- [ ] Do pipeline folders handle absent content gracefully without throwing uncaught errors?

- [ ] PROPER EXAMPLE: Core build commands in standard workflows:

> ```bash
> node src/build-lectures.mjs                      # compiles latest version with default code-plus principles
> node src/diagnose-lecture.mjs 05                 # audits lecture 05 code block invariants (must report 0 FAIL)
> node src/build-lectures.mjs 05                   # compiles lecture 05 with default code-plus principles
> node src/build-lectures.mjs 05 --compact-principles # compiles lecture 05 using alternative compact format
> node src/build-lectures.mjs --version v1           # explicitly targets v1 (yields v6.4-1)
> node src/build-lectures.mjs 04                   # compiles lecture 04 in latest version (no single-question deck created)
> node src/build-lectures.mjs --no-pdf             # latest version, HTML only
> node src/build-cards.mjs                         # card review deck, HTML and PDF
> node src/build-cards.mjs --no-pdf                # card review deck, HTML only
> ```

Notes: Commands clearly distinguish full PDF compilation from rapid HTML-only iteration, and automatically resolve the latest compound version. Default builds use the full-width code-plus layout, with `--compact-principles` remaining available as an alternative. Single-lecture runs compile only the individual lecture (e.g. `04.pdf`), avoiding single-question decks.

## Build Pipeline | 02 | Interpreting Build Logs and Error Remediation

- [ ] Are log line types accurately distinguished:
    * `warn`: Indicates a structural or formatting defect in the Markdown source (missing callouts, invalid heading levels, syntax violations, or broken closing tables).
    * `note`: Indicates an automatic compiler formatting adjustment (such as collapsing isolated comment lines).
- [ ] Does the build satisfy the zero-warnings gate, compiling cleanly before considering a lecture complete?
- [ ] Does the audited copy pass `node src/diagnose-lecture.mjs {NN} --audit --revised` with zero gate failures (`[PASS]` on every invariant, including zero orphan target tokens, zero lines >80 characters, and zero multi-line code in content) following the on-demand audit pass? #2026_10_03_11_group_1 revised by #2026_10_04_04_group_1 and #2026_10_04_10_group_1
- [ ] Are fixes applied directly to the source Markdown files in the active version (`01-02-md-LECTURES/<version>/{nn}.md`, e.g. `01-02-md-LECTURES/v2/{nn}.md`) and recompiled, avoiding manual edits to generated HTML in `01-03-md-lectures-HTML/`? #2026_09_24_05_group_1
- [ ] **Terminal Build Boundary & Routine vs. Experimental Screenshot Law**: Does the author treat a clean compiler exit (code 0, zero warnings) as the definitive end of routine builds? Executing `pdftoppm`, converting PDFs to images, or calling `view_file` on page screenshots is STRICTLY BANNED during routine lecture authoring, revising markdown, or adapting routine figures (Archetypes 01–10). Visual screenshots are warranted ONLY in two rare, explicit circumstances: (1) engineering a brand-new experimental visual blueprint/template from scratch in `figures/templates/` with unproven CSS geometry, or (2) diagnosing an explicit visual layout defect (e.g. clipping, overlapping text) or upon explicit user request. #2026_09_26_10_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Patching generated HTML files directly:

> A warning about the closing table is resolved by manually editing `01-03-md-lectures-HTML/42.html`, without modifying the source Markdown or rebuilding.

Notes: The next compiler execution regenerates the HTML from Markdown, immediately discarding the manual edit and restoring the warning.

## Theme Publishing | 03 | Automated Multi-Theme Publishing #2026_09_21_21_group_1 revised by #2026_09_21_21_group_2 revised by #2026_09_21_24_group_1 revised by #2026_09_21_29_group_1 revised by #2026_09_22_01_group_1 revised by #2026_09_25_01_group_1

- [ ] Does compiling multiple lectures automatically generate the full course reader across the four distinct themes with compound version naming (`React ${skillsVersion}-${lessonVersion} Q{first}-Q{last}*`, e.g. `React v6.0-1 Q01-Q10-black.pdf` or `React v6.4-4 Q01-Q05-black.pdf`):
    * **Teal Theme (`React ${ver} Q{first}-Q{last}-teal.pdf`)**: The default signature design featuring Deep Cyan-700 (`#0e7490`) accents on titles, margins, bullets, and code tabs.
    * **Black Theme (`React ${ver} Q{first}-Q{last}-black.pdf`)**: A minimalist monochrome aesthetic using solid black (`#000000`) for headings and keywords, paired with neutral slate borders and code chips.
    * **Old Theme (`React ${ver} Q{first}-Q{last}-old.pdf`)**: A classic layout inspired by the lecture-01 design, utilizing system font stacks, dark headers, and roomier comparison tables.
    * **Enhanced Theme (`React ${ver} Q{first}-Q{last}-enhanced.pdf`)**: An editorial palette based on `various/html/lecture_view_01.html`, featuring Montserrat headings, Merriweather serif italic interview questions, Inter body typography, JetBrains Mono code, vibrant teal accents (`#147b96`), and dark teal-navy code editors (`#0b2229`).
    * **Max Theme (`React ${ver} Q{first}-Q{last}-max.pdf`)**: A modern editorial design based on `various/html/react_lecture_cheatsheet.html`, featuring Merriweather serif bold/black headings (`#000000`), vibrant mint/cyan accents (`#2eb0a1`), warm peach interview question cards with orange headers (`#fce3cc` / `#e08953`), elevated white scenario cards with circular badges, dark slate code blocks (`#2c2e3a`), and Inter body typography.
- [ ] Is the default untagged PDF (`React ${ver} Q{first}-Q{last}.pdf`) an alias for the Teal Theme reader?
- [ ] Are reader decks compiled exclusively for ranges of two or more distinct questions (`allNumFiles > 1` and `first !== last`), avoiding single-question decks (e.g. `React v6.0 Q13-Q13-old.pdf`)? #2026_09_25_01_group_1
- [ ] Does single-lecture compilation (`node src/build-lectures.mjs {NN}`) generate strictly the isolated lecture artifacts (`{NN}.html` and `{NN}.pdf`)?
- [ ] In the revision pipeline (`02-01-md-revised-1/`), does the compiler publish the full multi-theme deck across all five variants each time (`React ${ver}-rev Q{first}-Q{last}.pdf`, `-teal.pdf`, `-black.pdf`, `-old.pdf`, `-enhanced.pdf`), provided multiple revised lectures exist?
- [ ] Do formatting fixes authored in source Markdown publish cleanly across all themes without theme-specific manual overrides?

## Production Workflow | 04 | Lecture-First Production Order

- [ ] For every curriculum question, is the comprehensive lecture (`01-02-md-LECTURES/{n}.md`) authored before creating distilled review cards or summary data-flow files?
- [ ] Do distillation artifacts inherit their technical depth from the fully resolved lecture, rather than constraining the lecture's technical depth with an abbreviated card?
- [ ] Has authoritative local React documentation (`documentation official/React 19 Sept 2026/react.dev/src/content/`) been consulted before authoring to verify factual and architectural accuracy?

## Production Workflow | 05 | Search Before Introducing Existing Concepts

- [ ] Has existing curriculum in `01-02-md-LECTURES/` been searched before introducing a concept or hook to verify whether it was taught earlier in the sequence?
- [ ] When an earlier lecture has already established the concept, is it re-anchored with a brief reminder and a formal cross-reference (`(see Lecture N)`) rather than re-explaining the primitive from scratch?
- [ ] Does each concept have one definitive home, avoiding conflicting metaphors across different lectures for the same mechanism?

## Automation Launcher | 06 | The `produce_lectures.py` Production CLI

- [ ] Is `produce_lectures.py` used to drive automated, per-question production sessions in fresh CLI processes?
- [ ] Does the orchestrator automatically resolve the latest version subdirectory (`01-02-md-LECTURES/<version>/`, `01-01-md-PRE-lectures/<version>/`, `01-04-md-lectures-PDF/<version>/`), scan answered questions, and target the next unanswered question in the latest version by default? #2026_09_24_05_group_1
- [ ] Does each session execute the full production cycle:
    1. Authors the Phase 1 blueprint (`01-01-md-PRE-lectures/<version>/{nn}.md`), with the recall list, the runway, and one `[question-cycle]` plan before the finished box of every principle, under `pre-lecture/SKILL.md`, `principle-definition/SKILL.md`, and its casebook. #2026_10_04_09_group_1 revised by #2026_10_04_10_group_1, #2026_10_06_04_group_3, and #2026_10_10_01_group_3
    2. Authors the Phase 2 production lecture (`01-02-md-LECTURES/<version>/{nn}.md`) and HTML figures (`01-02-md-LECTURES/<version>/figures/`) with pure code and natural comments (zero tildes).
    3. After the reading gates of `verification/SKILL.md` Section 21, runs `node src/diagnose-lecture.mjs {nn}` in Phase 1 draft mode (no `--audit`) until it ends without `[GATE FAILED]`; Invariants 1-3 report `[DRAFT PASS]` by design. The code comment audit (`code-comment-audit/SKILL.md`, `--audit --revised`, `~token~` markers in `02-01-md-revised-1/`) is a separate on-demand session, never part of a production session. #2026_10_03_11_group_1 revised by #2026_10_04_04_group_1, #2026_10_04_06_group_1, #2026_10_04_09_group_1, and #2026_10_04_10_group_1
    4. Executes `node src/build-lectures.mjs {nn}` until the build compiles with zero warnings.
- [ ] With `--force`, does the launcher move the existing blueprint and lecture to their `archive/` folders before the session starts, so the rewrite never inherits the previous draft? #2026_10_04_09_group_1
- [ ] Are CLI flags used to control batch execution appropriately (`python3 produce_lectures.py 3`, `--version v1`, `--start 14`, `--dry-run`)?
- [ ] Does the launcher halt immediately on any build error, non-zero exit code, or missing artifact, preventing defects from cascading?
