# Retrofit brief: real rendered UI in every components panel (lectures 01–31)

You are the writing model for the svelte-lecture-02 lecture pipeline. Your job is a narrow, mechanical retrofit: add the fourth field (rendered lines) to every `components` explorer panel entry, so that no panel ever shows an empty placeholder surface. Lecture 32 is already retrofitted and is the reference exemplar; do not touch it.

## Where things live
- Lectures: `md-lectures/{n}.md` for n = 01 to 31, inside `diagram-lab/output/svelte-lecture-02/`.
- The panel syntax and the new rule: `instructions.md`, section "Component Explorer Panels", subsection "The rendered-content rule (no empty surfaces)".
- The build: `node src/build-lectures.mjs`, run from the project folder.

## The syntax
An entry is `File.svelte | annotation | visual kind | rendered lines`. The fourth field is the component's real UI on screen: the actual text and numbers the lecture's code produces, individual lines separated by `;;`, with `**bold**` for the load-bearing value. No em-dashes anywhere in the field; use `·` middots to separate items inside one line, exactly as the exemplar does. Keep it tight: at most about six lines, each line short enough to sit comfortably in the narrow canvas.

## The exemplar (lecture 32, verbatim)
The code block ends with `<p>Total payout tonight: {totalPayout}</p>` and the stories array holds 800, 1200, and 950 words at rate 0.5:

```components title="national-times — Component Explorer"
PayoutBoard.svelte | totalPayout recomputed over every story | table | Harbor strike · 800 words;; Election night · 1200 words;; City budget · 950 words;; Total payout tonight: **1475**
```

## The core rule: compute before you write
For every panel entry, you MUST calculate the final UI by hand before writing the field. Read the component's template markup in the lecture's code blocks (the `<p>` tags, headings, buttons, list items it actually renders), take the starting values from its `$state` declarations, evaluate every `{expression}` with those values, and write the result as literal text. A brace token is invisible to the learner until you evaluate it: `{count}` starting at 0 renders as `0`; `{totalPayout}` over 800 + 1200 + 950 words at rate 0.5 renders as `1475`. The panel always shows the first paint, the initial state, not a later interaction. The numbers in the panel are arithmetic performed on the numbers in the code block; double-check every sum before you write it.

## How to work, one lecture at a time
1. Read the lecture end to end. List every `components` block and every code block that shows HTML markup.
2. For each `.svelte` entry in each block, run the fill decision procedure below, then write the fourth field mirroring the real UI text, top to bottom, one line per visible line of UI.

## The fill decision procedure (in this order)
- **End component that renders HTML of its own: always fill.** Compute from the code block's HTML and starting values. A `<p>`, a button label, a list, an `{expression}` are all knowable, and so is a literal string: `{@html content}` with `let content = "<h1>Hello</h1><p>Welcome to my blog.</p>"` renders the words inside that string. If the code block shows it, the panel shows it, evaluated. This case covers nearly every entry.
- **End component whose code block shows no HTML: fill with the observable outcome.** Take the one thing the learner would see happen, from the lecture prose ("prints Status: idle on mount"), and flag the lecture in your report as "UI inferred from prose". Never invent visible chrome the lecture never establishes.
- **Container whose children render inside it: leave unfilled, on purpose.** Its UI is the nested children, and the build already draws them inside its box; invented titles or bars would be decoration, not content. This is the only legitimate emptiness.
- **State modules (`.svelte.js`, `.js`, `.ts`): never render, never get a field.** The build keeps them in the left file tree only; giving them lines would lie about what modules do.
- **The traceability test, applied to every line you write:** each word must be traceable to the code block's HTML, the code block's starting values, or the prose's explicit description of the screen. A line that cannot be traced to one of those three is invented filler; delete it. Filled beats empty, but traced beats invented.

## Standing rules while you edit
1. Entries using the `instances` kind keep their instance chips; leave them alone unless the lecture shows the item's real UI text, in which case that text becomes the rendered lines.
2. Edit ONLY the `components` blocks. Do not touch prose, code blocks, headings, tables, callouts, or line wrapping anywhere. One continuous line per entry, never hard-wrapped.

## Definition of done
After each batch, run `node src/build-lectures.mjs` from `diagram-lab/output/svelte-lecture-02/` and confirm three things: the build completes, every touched lecture produces its HTML, and no NEW `warn` line appears that was not there before you started. Verify the lines landed: the built `md-lectures-html/{n}.html` must contain your text inside `<div class="surface-render">` elements.

## Final report
End with a table, one row per lecture: the panel entries you edited, the computed values you derived with the arithmetic behind them (for example "1475 = (800 + 1200 + 950) × 0.5"), and any lecture you skipped (no panel at all, or UI inferred from prose). The owner audits the arithmetic; show it plainly, do not bury it.
