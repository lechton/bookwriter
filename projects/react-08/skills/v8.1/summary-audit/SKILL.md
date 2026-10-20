---
name: summary-audit
description: How a revision 3 summary lesson is checked before it is called done: the build gates, the visual check of every page, cold reads by fresh readers who see only the PDF, the conditions audit, how to weigh what the readers report, the life of a lesson from draft to accepted to archived, and the report to the owner. Load it once a draft of 04-01-md-revised-3/<version>/NN.md builds.
---

# Summary Audit

This skill governs the checks of a summary lesson (`summary-edition`, `summary-figures`). The author of a lesson cannot read it as a stranger: the gaps a stand-alone reader falls into are invisible to someone who knows the full lecture. So the lesson is read by fresh readers who see only the PDF, and what they report is weighed against the lecture and the map before anything changes. Lecture 10 needed four readings: the first found 34 problems, the second rated it 7 out of 10, the third 8 out of 10 with twelve smaller points, and a dedicated conditions audit found fourteen more. All commands run from `projects/react-08`. #2026_10_17_01_group_4

## The Order | 01 | From the Build to the Last Look #2026_10_17_01_group_4

1. The build passes its gates (Section 02). #2026_10_17_01_group_4
2. Every page passes the visual check (Section 03). #2026_10_17_01_group_4
3. A cold reader reads the PDF; the findings are weighed and fixed; a new cold reader reads again, until a round meets the stopping rule (Section 04). #2026_10_17_01_group_4
4. A conditions audit reads the PDF for one thing only, the conditions every description carries (Section 05). #2026_10_17_01_group_4
5. The build and the visual check run once more on the final text, because fixes move page breaks. #2026_10_17_01_group_4

- [ ] Is the lesson called done only after the last visual check of the final build? #2026_10_17_01_group_4

## Build Gates | 02 | What the Script Checks #2026_10_17_01_group_4

`node src/build-revised-3.mjs NN` builds the lesson in every theme and fails on an em-dash, a wrong first or second line, or a numbered section without a hierarchy panel, a tree, or a principle box (`summary-figures/blocks.md`). It writes the HTML and PDF even when it fails, so read the end of its output rather than trusting a fresh PDF. Then the workspace gate: `node tools/check-links.mjs`, from the workspace root, reports zero broken links. #2026_10_17_01_group_4

- [ ] Does the build end with no `[CHECK FAILED]` line and no Prince warning? A Prince warning about a selector usually means a broken comment in a theme file. #2026_10_17_01_group_4
- [ ] Does the link check report zero broken path links? #2026_10_17_01_group_4

## The Visual Check | 03 | Every Page, Then the Dense Ones Up Close #2026_10_17_01_group_4

The PDF is what the reader holds, so it is checked as images, not as HTML source. #2026_10_17_01_group_4

```bash
rm -rf /tmp/rev3 && mkdir -p /tmp/rev3
pdfinfo 04-03-md-revised-3-pdf/v1/NN.pdf | grep Pages
pdftoppm -r 45 -png 04-03-md-revised-3-pdf/v1/NN.pdf /tmp/rev3/p
ffmpeg -v error -y -pattern_type glob -i '/tmp/rev3/p-*.png' -vf tile=5x4 /tmp/rev3/sheet.png
pdftoppm -r 110 -png -f 8 -l 8 04-03-md-revised-3-pdf/v1/NN.pdf /tmp/rev3/zoom
```

The tile command lays out every page, whatever their number and however `pdftoppm` pads their names (`p-1.png` below ten pages, `p-01.png` from ten on). Read the sheet for the flow, then each page with a tree, a hierarchy, a row of panels, or a long code block at 100 to 120 dpi. To find the page of a figure, search its text: `pdftotext -f 8 -l 8 file.pdf - | grep "card runs"`. Run the same commands on `NN-paper.pdf`: the two themes break pages in different places, and both are read. #2026_10_17_01_group_4 revised by #2026_10_18_01_group_5

- [ ] Is any box overflowing, any code clipped, or any label broken onto three lines? (Lecture 10's Summary tree once clipped `if (!article) return null` into its neighbour; a decision tree once broke "The card itself" onto three lines.) #2026_10_17_01_group_4
- [ ] Is any heading, lead-in sentence, or fact note separated from the block it introduces? #2026_10_17_01_group_4
- [ ] Is any text unreadable on its background (light text on a light highlight inside a dark panel, as the Elements panel once showed)? #2026_10_17_01_group_4
- [ ] Does every chart pass the chart test with its text covered (`summary-figures` Section 02B)? #2026_10_17_02_group_1
- [ ] Is any glyph out of place (a stray check mark from a class name collision, a missing symbol)? #2026_10_17_01_group_4
- [ ] Does every frame line end where its box ends? Lecture 3's file tab once ran its side borders down past the bar's bottom line into the first line of code. #2026_10_18_01_group_4
- [ ] Does each comment balloon sit under its line and inside its block? #2026_10_18_01_group_6
- [ ] Is each half-empty page the price of keeping a figure whole, rather than an accident? #2026_10_17_01_group_4

## Cold Reads | 04 | A Fresh Reader Who Sees Only the PDF #2026_10_17_01_group_4

Each round uses a new reader, a subagent started fresh, because a reader who has seen an earlier version is no longer cold. The reader opens only the PDF: not the repository, the lecture, the map, or an earlier revision. Run it in the foreground, since the next step depends on its report. The reader is the one `summary-edition` Section 01 defines, built from the map's Terms: what the lectures before this one taught, and nothing of this one. #2026_10_17_01_group_4

The prompt that worked for Lecture 10. Fill `{{path}}` with the PDF's absolute path, `{{ranges}}` with two page ranges from `pdfinfo` (about half the pages each), and `{{reader}}` with the reader for this lecture: #2026_10_17_01_group_4

```
You are a cold reader testing whether a short illustrated lesson stands on its own. Read ONLY this PDF, all pages, with the Read tool (use the pages parameter: {{ranges}}): {{path}}. Do not open any other file in the repository, do not search the codebase, and do not read any other version of this lesson.

Read it as {{reader}}, who has never seen this lesson or the longer version it summarizes. Read from start to finish, in order.

Report every place where the text stops standing on its own: UNDEFINED (used before explained or shown), JUMP (a missing step in logic), STAKES (options compared without saying what is at stake), LOCATION (unclear where code sits), FIGURE (a figure, tree, or hierarchy that is unclear or confusing), ORDER, REDUNDANT, WRONG (technically incorrect, or one page contradicting another, including code that is inconsistent between sections), EXAMPLE (a part of the page, a user action, or a piece of code you had to work out before you could see the concept, or one that carries more than the concept needs), HEADING (a title, subtitle, column title, or chart label that names something other than what the text under it teaches), AHA (an explanation of a cause you cannot see on the page that starts above the most basic fact it rests on, skips a link, or uses a shorthand it never defined, such as "the email" or "the row", so the surprise does not follow from the steps), LAYOUT. For each: page, short quote, type, one sentence of fix. Only report real problems; do not pad the list.

Two extra checks. CHART TEST: look at each chart, tree, chain, table or diagram alone with the text covered, and report any box, label, or connection that cannot be understood from the chart itself. BOX TEST: each numbered section opens with its principle box; report any box whose sentences are long or hard to read, whose code is more complex than the rule needs, or whose flagged comment does not name the cause.

Then rate from 1 to 10 how well a reader with only this PDF could learn the topic from it, and say in two or three sentences what still holds the rating back.
```

For Lecture 10, `{{reader}}` was "a junior developer who knows basic HTML, CSS, and JavaScript, and has learned React components, JSX, curly braces in JSX, and passing props". #2026_10_17_01_group_4

The HEADING category asks the reader for the standard of `summary-edition` Section 07B: a title that names one symptom while its text teaches the cause. #2026_10_18_01_group_2

The AHA category asks the reader for the standard of `summary-edition` Section 07C: a What is going on box whose first step could have a step before it, whose steps do not each follow from the one above, or whose words are shorthand it never defined. #2026_10_18_02_group_1 revised by #2026_10_18_03_group_1

The stopping rule: stop the cold reads when a round reports no UNDEFINED, JUMP, STAKES, WRONG, or EXAMPLE finding and rates the lesson 8 or higher. Fix that round's remaining points, then go on to the conditions audit. The EXAMPLE category asks the reader for the standard of `summary-edition` Section 03B: an example the reader had to decode is a defect, however correct it is. #2026_10_17_01_group_4 revised by #2026_10_17_06_group_1

- [ ] Is each round read by a new reader with the same reader description, so the ratings compare? #2026_10_17_01_group_4
- [ ] Is the report to the owner given the last round's rating and its remaining points? #2026_10_17_01_group_4

## The Conditions Audit | 05 | One Reading for One Defect #2026_10_17_01_group_4

The most persistent gap is a description that states a result without the case it holds for (`summary-edition` Section 08). A general cold read finds some of these; a reading aimed at them finds the rest. Run it after the cold reads, on a lesson that already stands on its own, so its findings are not drowned among larger ones. #2026_10_17_01_group_4

```
Audit a short illustrated React lesson. Read ONLY this PDF: {{path}}, pages {{ranges}}. Do not open any other file. Read it as {{reader}}, who has never seen this lesson.

The main thing to check: every description must carry, in a few words, the conditions it depends on, so the reader never has to reconstruct them. A caption, a column note, a figure lead-in, a table, a decision-tree branch, or a summary line that states a result without its condition is a finding; so is a condition stated imprecisely or wrongly (for example naming the wrong variable as null), and so is a nuance that the text drops in one place after stating it in another (which card, which count, which reader, whether a value is true or false).

Also report anything else that still breaks the lesson for this reader. For each finding give the page, a short quote, what condition or nuance is missing or wrong, and the exact words you would add or change. Then rate from 1 to 10 how completely the descriptions carry their conditions.
```

## Weighing Findings | 06 | Check Each Finding Before Acting on It #2026_10_17_01_group_4

A cold reader is right about where it got lost and often right about why; its proposed fix is a suggestion. Each finding is checked against the lecture and the map, then fixed the way the edition's standards ask. #2026_10_17_01_group_4

- [ ] Is a reader's claim about what React, the browser, or the build does checked by running it, when the lecture and the map do not settle it? A small script with React's development build and `jsdom` in a scratch folder settles a Console message in a minute. Lecture 3's readers twice claimed that a `<div>` inside a `<ul>` logs a Console error; React 19.3.1 logs none there, and logs one for a `<div>` inside a `<tr>`, so the lesson kept its sentence and said exactly that. #2026_10_17_02_group_3
- [ ] Is each finding checked against the lecture's verified results before it changes the text? A reader's technical claim can be partly right: "six falsy values" misses `-0` and `0n`, so the wording became "the common falsy values"; it was not expanded into a lesson on `0n`. #2026_10_17_01_group_4
- [ ] Is a finding about a principle box weighed against the map's Rule: a finding about wording or length is fixed in the box's short sentences, while the rule's conditions stay as the owner approved them (`summary-edition` Section 12)? #2026_10_17_01_group_4 revised by #2026_10_17_02_group_2
- [ ] Is the fix the smallest change that removes the gap: a condition added, a sentence moved, an example corrected, a contradiction resolved at its source? A warning sentence stacked on a confusing passage leaves the confusion in place. #2026_10_17_01_group_4
- [ ] When several findings share a cause (the running code drifting between sections, a division mixing two lines), is the cause fixed once, rather than each symptom patched? #2026_10_17_01_group_4
- [ ] When a fix changes a lead or an explanation, are the headings and labels of its section checked against it again, before the build (`summary-edition` Section 07B)? #2026_10_18_01_group_2
- [ ] When the owner points at a visual defect, is the exact place zoomed in the page image, and the element named (the file tab's side borders, not "the code box"), before anything changes? When two readings are possible, is the owner asked which one is meant? On Lecture 3's file tab, a first fix changed the wrong border, and the owner saw "the same problem". #2026_10_18_01_group_4
- [ ] When a finding conflicts with an owner's decision (the house style, an approved Rule, the order of the skeleton), does the owner's decision stand, with the finding reported? #2026_10_17_01_group_4

## The Life of a Lesson | 07 | Draft, Accepted, Archived #2026_10_17_01_group_4

The workspace retires lecture files by moving them with `archive_lecture.py`, never by deleting or overwriting them. A summary lesson lives through three states. #2026_10_17_01_group_4

- **Draft.** While a lesson is being written and audited, each build overwrites its own HTML and PDF; that is expected, and nothing needs archiving. #2026_10_17_01_group_4
- **Accepted.** Once the owner accepts a lesson, its Markdown, HTML, and PDF are archived before any rework, so the accepted version can be restored: #2026_10_17_01_group_4

```bash
python3 archive_lecture.py NN --version v1 --in 04-01-md-revised-3 --in 04-02-md-revised-3-html --in 04-03-md-revised-3-pdf --reason "before reworking the accepted summary" --dry-run
python3 archive_lecture.py NN --version v1 --in 04-01-md-revised-3 --in 04-02-md-revised-3-html --in 04-03-md-revised-3-pdf --reason "before reworking the accepted summary"
```

- **Retired outputs.** A theme the owner drops leaves its PDFs behind; they are archived by name, after a dry run: `python3 archive_lecture.py NN --version v1 --in 04-02-md-revised-3-html --in 04-03-md-revised-3-pdf --match 'NN-<theme>.*' --reason "retire the <theme> theme"`. The theme file itself moves to `src/revised-3/archive/`, a folder the build does not read. #2026_10_17_01_group_4

`--version` is given every time, because the script otherwise takes the newest version of `01-02-md-LECTURES`, which need not match the summary's. A new version folder (`v2`) is opened only when the owner wants the whole edition redone while keeping `v1` as it stands. #2026_10_17_01_group_4

## Reporting | 08 | What the Owner Sees #2026_10_17_01_group_4

- [ ] Does the report show page images of what changed, with the PDF's path? #2026_10_17_01_group_4
- [ ] Does it say what each reader found and what was fixed? #2026_10_17_01_group_4
- [ ] Does it name what was deliberately left (a principle box, an owner's style choice), the examples the lesson chose, and every proof moved into them (`summary-edition` Sections 02 and 03B)? #2026_10_17_01_group_4 revised by #2026_10_17_06_group_1
- [ ] Does it give the page count and the checks run, and name any code that could not be run? #2026_10_17_01_group_4
- [ ] Is nothing committed unless the owner asks? #2026_10_17_01_group_4
