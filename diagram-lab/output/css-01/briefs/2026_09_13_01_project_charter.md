# Brief 01 — Project Charter: css-01, the CSS Interview Lecture Series

Date: 2026-09-13 · Number: 01 · Status: foundational

## What we are doing

We are creating `diagram-lab/output/css-01/`, a new lecture series for a web developer preparing for job interviews, covering three tracks: (1) CSS review for interview, (2) BEM methodology with LESS and SASS for interview, (3) responsive design plus accessible and cross-browser compatible CSS for interview. The series follows the design of `../accessibility-01/`, the first complete project of the family, whose clarity and comprehensiveness is our benchmark. Three problems are open: (a) we have no question bank yet for CSS, (b) we have no local authoritative corpus for these topics yet, (c) we need a new UI template for visually representing CSS with code and with rendered UI, one that stays visually calm because the topic itself is visually loud. This brief records what I studied, what I conclude, and the execution order.

## What I studied

- `../accessibility-01/`: `instructions.md` (the project law), `AUTHOR-BRIEF.md` (the per-lecture writing brief), `00_TOC.md` (54 lectures with per-question takeaways), `src/build-lectures.mjs` (the md -> html -> pdf pipeline with Prince), `src/a11y-canvas.mjs` (the canvas generator), `src/lecture.css`, sample lecture `md-lectures/14.md` and its built HTML, rendered in a browser for visual confirmation.
- `../react-lecture-01/`: `AUTHOR-BRIEF.md` and folder layout (12 lectures, same skeleton, a different signature panel: the Component Explorer tree instead of the canvas).
- `../../questions-accessibility/`: `README.md`, `questions.md` (the five-column bank: `# | Tier | Topic | Question | Hook`), `topics.md` (controlled vocabulary).
- `documentation official/accessibility-performance/README.md`: the corpus handout model (19 repos + 5 books, authority hierarchy, freshness flags, question-to-authority map).
- The pre-existing `css-01/various/` folder: `demo UI /design_instructions.md` (a complete academic-textbook design language for CSS figures), `demo UI /css_flexbox_layout_guide.html` (a working two-figure flexbox demo), and `demo images/` (reference figures). Verified the demo renders beautifully in a browser.

## What makes the benchmark good (the nine laws css-01 inherits)

1. **The question bank is the plan.** Every lecture exists because a bank row exists: number, tier, topic tag, question in interview register, hook as the pain-point seed. No plan phase, no approval gate per lecture; the row is the plan.
2. **The corpus-first quoting law.** Every lecture carries at least one verbatim quote from a local authoritative source with a citation path; the build warns when it is missing; standards outrank docs outrank books outrank data outrank community.
3. **One signature generated panel per lecture.** The panel is generated HTML from a fenced block, never a screenshot, never hand-authored markup per lecture. For accessibility it is the Accessibility Canvas (browser mock plus annotation chips for focus, contrast, screen reader). For css-01 it must be a CSS figure canvas.
4. **The Harmonious Code + UI Step Rhythm.** Every technical section: 2-3 sentences of framing, minimal code snippet, minimal UI panel, analytical derivation. Repeat per step. Explain before and after, always.
5. **The Opening Ladder.** 5-7 numbered beats: scene, failure moment, question, danger, mystery, promise. No mechanism term named; one actor; every noun exactly one thing.
6. **Curriculum typology tiers.** `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED`, tagged on the interview question line.
7. **The closing 3-column table** with the Transposition Law, plus `### Where you will meet this` and `### Glossary` before the streetwise `### Summary`.
8. **Mechanical build gates with a zero-warning policy.** Title and question line shapes, mandatory canvas placement, citation path, summary opening, closing table shape; a `warn` is a defect to repair.
9. **The National Times world.** Every example is a real runnable scenario inside the newspaper: its subscribe flow, story pages, journalists, subscribers. The world stays.

## What must change for CSS

- **The panel.** The a11y canvas annotates *invisible assistive states* (screen reader announcements, focus order, contrast numbers) on top of a mocked UI. For CSS the rendered UI *is* the topic: geometry (axes, tracks, gaps, box edges), naming (BEM class anatomy), and resolution (specificity, cascade, breakpoints) are the annotations. New generator, new annotation vocabulary, calmer surface. This is the creative core; brief 03 develops it.
- **The corpus.** CSS needs its own authoritative corpus. Good news discovered today: the existing accessibility-performance corpus already contains the full MDN CSS tree, the archived web.dev `learn/css` and `learn/design` courses, the Web Almanac `css.md` chapters, and the interview handbook's `css-questions.md`. Only a handful of new clones is required. Brief 02 develops it.
- **The question bank.** A new bank of roughly 54 questions across the three tracks, mirroring the accessibility scale. Brief 04 develops it; the full draft sits at `../../questions-css/questions.md`.

## Conclusions and decisions made today

1. Folder structure created: `briefs/`, `md-lectures/`, `md-lectures-html/`, `md-lectures-pdf/`, `src/canvas-lab/`, plus `../../questions-css/` for the draft bank.
2. The briefs journal lives at `css-01/briefs/` with the naming `YYYY_MM_DD_NN_<title>.md`.
3. The discovered `various/demo UI /design_instructions.md` is adopted as the seed of the CSS figure design language (academic textbook, flat pastel, mono captions, precise geometric annotations); brief 03 synthesizes it with the accessibility canvas discipline.
4. The world, skeleton, rhythm, quoting law, tier system, table law, and build-gate philosophy carry over unchanged.

## Execution order (agreed with the requester)

1. Briefs (this journal) — done today.
2. The creative part first: the UI template. Discuss brief 03, then build a demo markdown lesson on a hard topic (flexbox) inside `src/canvas-lab/` and test the aesthetics in browser and in Prince PDF.
3. The intellectual part second: approve the download plan (brief 02), fetch the corpus, then finalize the question bank (brief 04) together.
4. Fork the build pipeline from `../accessibility-01/src/` (`build-lectures.mjs`, new `css-canvas.mjs`, `lecture.css`) and write css-01's own `instructions.md` and `AUTHOR-BRIEF.md`.
5. Lecture production, one bank row at a time.
