# Revision 2: the short, visual edition

Revision 2 rewrites a finished lecture from `01-02-md-LECTURES/<version>/NN.md` into the shortest form that still teaches every principle, and shows each idea in a figure the reader can see at a glance. The full lecture stays the source of truth; this edition is derived from it and never replaces it. Lecture 10 is the first one written this way.

Build from the project folder:

```bash
node src/build-revised-2.mjs                   # every lecture
node src/build-revised-2.mjs 10                # lecture 10
node src/build-revised-2.mjs 10 --no-pdf       # html only
```

Each build writes `03-03-md-revised-2-pdf/v1/NN.pdf` and `03-02-md-revised-2-html/v1/NN.html` in the default theme, `original`. The script prints the prose word count and the figure count, and fails on an em-dash or a missing title or interview line.

## Themes

Styles live in `src/revised-2/`: `base.css` holds the structure (sizes, spacing, layout) and reads every colour and font from a variable; each file in `src/revised-2/themes/` sets those variables and adds its own touches. The one theme in use is `original`: Avenir Next text, dark code windows, green principle boxes.

A new theme is a new file in `src/revised-2/themes/`; the build picks it up by its file name and writes `NN-<theme>.pdf` beside `NN.pdf`, and `--theme <name>` builds one theme alone. `DEFAULT_THEME` in `src/build-revised-2.mjs` names the theme that writes `NN.pdf`. Figure numbers ("Figure 10.3") are written into every page and hidden by `base.css`; a theme shows them with `.fig-num { display: inline; }`.

Retired trial themes (`classic`, `sections`, `sections-2`, `sections-3`, `ink`) wait in `src/revised-2/archive/`, which the build does not read; their PDFs and HTML were archived with `archive_lecture.py` on 2026-10-17 under stamp `2026-10-17-1047`.

## What the edition keeps and what it drops

Each principle is stated once, in its box, and shown once, in a figure. The full lecture says each principle many times because it is also written for the ear; the page lets the reader look back instead.

Kept, in this order: the title and the interview question; the opening problem as a picture of the page; the two ways, side by side, with the DOM each one leaves; one map of all the principles (for Lecture 10, the ladder of nothing, one or nothing, one of two, one of many); one section per principle with the trap, the one fact it needs, the fix, and the principle box word for word; For the interview, folding in the wild card question; Where you will meet this, one line per case; and a summary table with the closing line and the DO THIS / DO NOT DO THIS pair.

Dropped: the recall list, the runway as a separate block (each fact moves into the principle that needs it), the spoken preview, the practical example with its steps and component summary, the glossary (each term is bold where it is first used), and Beyond the basics.

Each principle section keeps only the strongest wrong attempt. Lecture 10's first question, for example, keeps `article.title` and `article?.title` and drops the class name and `getElementById` attempts, which teach nothing the other two do not.

## The Markdown format

Plain Markdown, one line per paragraph, plus these blocks.

- ```` ```jsx title="ArticleCard.jsx" good="2-4" bad="6" ```` is a code window; `good` and `bad` tint lines green or red, and `right` or `wrong` as a flag gives the DO THIS / DO NOT DO THIS border. A `// **WRONG:** ...` or `// **PROBLEMATIC:** ...` comment renders as a red or amber tag.
- ```` ```page ```` is a browser window with the article site. Lines: `heading: Latest Articles`, `card: title=... | author=... | text=... | label=New | foot=3 comments | raw=0 | missing=author | good=label | bad=raw`, `card: ghost` for an empty card box, `blank` for a blank page, `console: TypeError: ...` for a red console line. Add `size=mini` for a small window inside a column. `[Sign in]` in a text renders as a link.
- ```` ```dom title="Elements panel: the rain card" ```` is the Elements panel. A line starting with `!` is marked red, `+` green, `*` blue (look here), `-` struck through.
- ```` ```ladder anchor="..." ```` is the map of the principles: one line per step, `size | tool | example`, drawn left to right with the pieces growing.
- ```` ```chain ```` is a row of boxes joined by arrows, one row per line: `` `count: 0` -> No comments yet ``.
- `::: row caption="..."`, then `::: col title="..." tag="..." tone=good|bad|plain` with any blocks inside and `:::` to close the column, and a last `:::` to close the row, puts figures and code side by side. A `title` may hold inline code in backticks; `tone=good` adds a check mark, `tone=bad` a cross.
- A table row whose first cell starts with `!` is marked red; a first cell starting with `+` renders as a dark pill.
- `caption="..."` on any figure block adds a caption under it.
- `> [!PRINCIPLE]` boxes keep the lecture's form: the bold `**Principle N: Title**` line, the statement, then `*We should do this:*` and `*We should not do this:*` each followed by a code block.
