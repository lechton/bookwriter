# Revision 3: the short, visual edition that stands on its own

Revision 3 turns a finished lecture and its principle map into the shortest lesson that teaches every principle with strong visual elements and that a reader who never saw the full lecture can follow from start to finish. Lecture 10 is the first one written this way, and the reference lesson. Revision 2 stays as it is in `03-01-md-revised-2/`.

The standard for this edition lives in three skills; read them before writing a lesson:

- `skills/v9.1/summary-edition`: the method, from the lecture and the map to the lesson, with a casebook of Lecture 10's and Lecture 11's drafts in `examples.md`;
- `skills/v9.1/summary-figures`: the figures, the house style, and the block syntax in `blocks.md`;
- `skills/v9.1/summary-audit`: the checks, the cold reads, and the life of a lesson from draft to archive.

## The folder

- `v1/NN.md`: the lessons. Build each from `projects/react-09` with `node src/build-revised-3.mjs NN`.
- `../04-02-md-revised-3-html/v1/` and `../04-03-md-revised-3-pdf/v1/`: the outputs. `NN.pdf` is the `original` theme; `NN-original-margins.pdf` is the same look with side margins of 22 mm instead of 17 mm. `NN-paper-2.pdf` is an experiment on `paper`: every box (comparison columns, facts, principle boxes, the interview question, the What is going on box) on the light blue of the component panels, with no frame and a white line between the parts of a box.
- Styles: `src/revised-3/base.css` (structure, the hierarchy panel, the spacing) and `src/revised-3/themes/` (one file per theme).

## History of Lecture 10

Lecture 10 went through four readings by fresh readers who saw only the PDF: 34 problems, then a rating of 7 out of 10, then 8 out of 10 with twelve smaller points, then a conditions audit with fourteen findings, all fixed. A review of the skills then brought the lesson in line with them: the map's proofs for the logged lines and the parse error were added, the division's heading and the Summary tree follow the two-level tree, and the comparison operators get their fact note.

Lectures 3 and 11 were then written to the skills, and all three lessons follow the later standards of batch `#2026_10_17_02`: the principle box opens each section in short sentences, every chart reads on its own, the opening's rules point at its picture, and every comparison shows its whole line.

Lecture 11 was then rewritten on an inbox (batch `#2026_10_18_02`): the keys are taught by a tick that stays in the first row when a new email arrives, so Delete selected deletes the wrong email, explained in the first What is going on box, and every browser is a mail app in the manner of Gmail. Its articles versions are in `v1/archive/`.

Lecture 11's section 3 then became a story in pictures (batch `#2026_10_18_06`): a light blue think-aloud page with four steps, built in the experiment `v1/11b.md`, whose earlier forms are in `v1/archive/11b-*.md`. The ticked email is now the spam mail in every section, and the lesson has no colon lead-ins.

Lecture 1 was then rewritten to the same standard (batch `#2026_10_18_10_group_1`): the theory first, then `# Principles` with the route of subtitles in every section, the worked example and its components at the end, `App.jsx` placing `Cart.jsx` from the first lesson, and every browser drawn as an online shop with the new `shop` block. Its third principle answers the reader's own question, whether React rebuilds the cart, with a note that stays in its box after the save; a first draft that told it as a story against `innerHTML` was withdrawn as a comparison of unlike things. The header version with Mary and the search box is in `v1/archive/01-2026-10-18-1624.md`.

The experiment `v1/11-gemini.md` then announced each worked example as `Example for Principle N:` in a larger heading, with the component hierarchy right under it, and put the page we build on top of every hierarchy, in the same box, with each component framed and labelled on the page as Chrome's inspector labels an element. Principle 3's story page now carries the banner Example for Principle 3, The tick that stays in the first row. The version before is in `v1/archive/11-gemini-2026-10-18-2347.md`.

Each of those hierarchy boxes then lost its We want note and the heading over the tree, and gained a last line, Point of failure, that says what the example breaks. The version before is in `v1/archive/11-gemini-2026-10-19-0002.md`.

The four examples of `11-gemini.md` then got one component hierarchy, `EmailList` as PARENT and `EmailRow` as CHILD, with the same notes, so each Point of failure is the only line that changes. Principle 2 lost `App.jsx` and its two folder sections: `EmailList` receives the `folder` the reader opened, and the page check shows the empty Spam folder two ways. The closing example keeps `App`, which the whole app needs. The version before is in `v1/archive/11-gemini-2026-10-19-0006.md`.

Its four comparisons of code and its result then read downwards with `::: row flow=down`: the code on top, on frames of one height, a thick arrow from the code down, in the grey of the browser's top bar, then the browser and the Console, lined up across the two columns. The version before is in `v1/archive/11-gemini-2026-10-19-1710.md`.

The experiments `v1/11-argon.md` (11 pages), `v1/01-argon.md` (8 pages), and `v1/02-argon.md` (10 pages) then introduced the two-page Rule Page + Tinted Bug Lab spread with zero orphan spills, and `11-argon.md`, `11-gemini.md`, `01-argon.md`, and `02-argon.md` adopted the root-first, trap-first conversational Principle box format (`**Why it happens:**` + `**The Rule:**`, batch `#2026_10_20_01_group_1`): starting from the root mental model (such as the data/description in JavaScript memory and the DOM elements on the screen being two separate things), pausing to warn the reader of the trap, naming the visible screen consequence before the JS/React reason, and using clear general-concept titles with concrete examples in parentheses (`(e.g. ...)` / `(like ...)`). `02-argon.md` also adds `footer:` and `dom:` (an inline DevTools Elements strip) to the `page` browser block.

