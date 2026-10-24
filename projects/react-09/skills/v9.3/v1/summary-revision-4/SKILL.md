---
name: summary-revision-4
description: The revision 4 pass of a summary lesson. It copies an accepted revision 3 lesson into 05-01-md-revised-4, anchors each of its comments to a ~token~, so the balloon gets its tail and the token its underline, and builds the lesson in both themes. Load it only for this pass, once the revision 3 lesson is accepted; everything the lesson says, its comments included, is governed by summary-edition and stays as revision 3 wrote it.
---

# Summary Revision 4

This skill governs one pass over a finished summary lesson. Revision 3 (`summary-edition`, `summary-figures`, `summary-audit`) holds all of a lesson's content: its order, its words, its figures, its examples, and its comments, drawn as balloons with no tail (`summary-edition` Section 12B). Revision 4 copies that lesson and adds one thing: the `~token~` each comment points at, so the balloon gets its tail and the token its underline. The tokens are the only difference between the two revisions; the themes and the blocks are the same. The owner kept the two apart on purpose, so that the effort spent on tokens never competes with the effort spent on the content. So this skill is loaded only for the pass, and the revision 3 skills never need it. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

Lecture 10 was the experiment; Lectures 3 and 11 followed. Their copies in `05-01-md-revised-4/v1/` are the reference for every rule below. #2026_10_17_04_group_2

## The Pass | 01 | From an Accepted Revision 3 Lesson to Its Copy #2026_10_17_04_group_2

1. Copy `04-01-md-revised-3/v1/NN.md` to `05-01-md-revised-4/v1/NN.md`, and every photo it uses from `04-01-md-revised-3/v1/public/` to `05-01-md-revised-4/v1/public/`. If a revision 4 copy already exists, archive it first (Section 05). #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
2. Run `node src/build-revised-4.mjs NN` from `projects/react-09`. Its `[CHECK FAILED]` lines list every comment that still needs a token: they are the to-do list of the pass. A block that still needs a comment is a gap in revision 3, filled there first. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
3. Add the tokens (Section 02) until the build passes. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
4. Look at the pages (Section 04), then report to the owner as `summary-audit` Section 08 describes. #2026_10_17_04_group_2

- [ ] Is the lesson's text left as revision 3 wrote it, its comments included, with only `~token~` marks and line breaks for width added? #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
- [ ] When the pass finds a content problem (a wrong claim, an unclear example, data described in words, a comment that must be reworded), is it fixed in revision 3 first, under `summary-edition`, and the lesson copied again? Revision 3 is the one place content is written. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

PROPER EXAMPLE: during Lecture 10's pass, the `rain` object turned out to be a comment line rather than code. The fix went into `summary-edition` Section 11B and into `04-01-md-revised-3/v1/10.md`; the revision 4 copy then carried the same full object. #2026_10_17_04_group_2

COUNTER-EXAMPLE: rewording a paragraph of the revision 4 copy because it reads better beside a balloon. The two revisions then tell different stories, and the next copy from revision 3 silently undoes the change. #2026_10_17_04_group_2

## Tokens | 02 | Where Each Comment Points #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

The comments arrive written, by the standard of `summary-edition` Section 12B. The pass places their tokens by the full lecture's standard: `code-comment-audit`, its Token Targeting Anatomy table for where the tildes go. This section holds only what the summary edition adds to it: small columns, and comparisons side by side. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

- [ ] Does every comment carry one `~token~` on the code it names, and every token a comment? #2026_10_18_01_group_6
- [ ] In a two-column comparison, do both columns put their token on the same code, so the two tails point at the line that differs? #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

PROPER EXAMPLE (Lecture 3, the worked example's two columns): the HTML file reads `<img src="/library.jpg" ~alt="Library">~ <!-- No end: the browser closes it by itself -->` and the component reads `<img src="/library.jpg" ~alt="Library">~ {/* **WRONG:** no end: the build waits for </img> */}`. Note: the same token in both columns, so the row shows one line meeting two readers. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

COUNTER-EXAMPLE (Lecture 11's card, its comment without a token): `{items.map(item => { // **PROBLEMATIC:** curly braces open a body with no return`. Note: with no token, the balloon's tail lands at the left margin. Revision 4 reads `{items.map(~item => {~ // **PROBLEMATIC:** curly braces open a body with no return`. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

## Width | 02B | A Line That Fits Its Box #2026_10_17_04_group_2

A balloon's tail is placed by counting characters along the line. When a line wraps, the token moves to the next visual line and the tail no longer meets it. So every line before a balloon fits its box: 80 characters in the body, 68 in a principle box, about 46 in a two-column row, about 28 in three. The build warns about a column line that is too wide and fails on a body or box line. #2026_10_17_04_group_2

- [ ] Is a line that does not fit broken the way a code formatter would break it, the `&&` or the ternary over its own lines, a tag's attributes one per line, and are the `good=` and `bad=` line numbers moved to match? #2026_10_17_04_group_2

PROPER EXAMPLE (Lecture 10, section 3, both columns): `{article.commentCount > 0 && (` / `<p>{article.commentCount} comments</p>` / `)}`, with the balloon on the first line and `good="8-10"`. COUNTER-EXAMPLE: the same 69 characters on one line in a column 46 wide, where the dotted underline fell onto the wrapped half of the line. #2026_10_17_04_group_2

## The Look | 03 | What the Build Draws #2026_10_17_04_group_2

These are the build's decisions, listed so the pages can be checked against them; the pass does not change them. #2026_10_17_04_group_2

- The lesson builds in the same two themes as revision 3, `original` as `NN.pdf` and `paper` as `NN-paper.pdf` (`summary-figures` Section 05). #2026_10_18_01_group_5
- Code blocks are the full lecture's light editor, made compact: a file tab when the block has a title, white and grey lines in turn, line numbers, and the full lecture's token colours. A one-line snippet with no title and no comment is a single white line with no number. #2026_10_17_04_group_2
- A balloon sits under its line, starts at the line's indent, and its tail points at the middle of the `~token~`, which gets a dotted underline. When the token sits on the right and the balloon fits to its left, the balloon ends just past the token instead. `**WRONG:**` and `**PROBLEMATIC:**` become red and amber chips. #2026_10_17_04_group_2
- DO THIS and DO NOT DO THIS, and the cards of each principle box, are the full lecture's green and red editors with a tick or cross column. #2026_10_17_04_group_2
- Elements and Console panels are light, as Chrome draws them; Vite's error overlay is dark in `original` and light in `paper`. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_5
- A downward tree is laid out one row per level, so every box on a level is as tall as the tallest one there. #2026_10_17_04_group_2

The code is `src/build-revised-4.mjs` and `src/revised-4/editor.mjs`; the styles are `src/revised-4/base.css` and `src/revised-4/themes/` (`original.css`, `paper.css`). The editor counts every balloon position in characters, and the CSS multiplies by `--ch`, the width of one code character, so a tail stays on its token in the smaller code of columns and principle boxes. #2026_10_17_04_group_2

## Checks | 04 | The Build Gate, Then the Pages #2026_10_17_04_group_2

The build checks every rule a script can see: each balloon has a token and each token a balloon, tildes come in pairs, titled blocks and principle cards carry a balloon, no three commented lines run in a row, DO THIS and DO NOT DO THIS carry no comment, and lines fit their width. What remains for the eye is where the balloons land, in both PDFs. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_5

```bash
node src/build-revised-4.mjs NN
pdftoppm -r 45 -png 05-03-md-revised-4-pdf/v1/NN.pdf /tmp/rev4/p
ffmpeg -loglevel error -pattern_type glob -i '/tmp/rev4/p-*.png' -vf tile=5x4 -frames:v 1 /tmp/rev4/sheet.png -y
pdftoppm -r 110 -png -f 8 -l 8 05-03-md-revised-4-pdf/v1/NN.pdf /tmp/rev4/zoom
```

- [ ] Does the build end with no `[CHECK FAILED]` line and no column warning? #2026_10_17_04_group_2
- [ ] On every page with code, does each tail touch the middle of its underlined token, and does every balloon stay inside its block? #2026_10_17_04_group_2
- [ ] Is the page count close to revision 3's? Balloons add height, so a few pages more is expected; a page left half empty is a layout matter for the owner to see, not a reason to cut text. #2026_10_17_04_group_2

The text is revision 3's and was already read by fresh readers, so the pass needs no cold read of its own. A cold read is due only when revision 3 changed. #2026_10_17_04_group_2

## The Life of a Copy | 05 | Archive Before Replacing #2026_10_17_04_group_2

A revision 4 copy follows its revision 3 lesson. When revision 3 changes, the copy is archived and the pass runs again on a fresh copy, because balloons added to an old text may no longer fit the new one. #2026_10_17_04_group_2

```bash
python3 archive_lecture.py NN --version v1 --in 05-01-md-revised-4 --in 05-02-md-revised-4-html --in 05-03-md-revised-4-pdf --reason "revision 3 changed" --dry-run
python3 archive_lecture.py NN --version v1 --in 05-01-md-revised-4 --in 05-02-md-revised-4-html --in 05-03-md-revised-4-pdf --reason "revision 3 changed"
```

The archived copy keeps its balloons; most of them carry over to the new copy unchanged, so read them back from `05-01-md-revised-4/v1/archive/` before writing new ones. #2026_10_17_04_group_2
