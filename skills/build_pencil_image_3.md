# Skill: Build A Pencil Image, v3 — The Three-Block Code Figure (Theme 03)

This is the central reference for THEME 03: an alternative look for the same teaching figure (title, code editor, line-by-line, summary, Explanation), rendered deterministically by the Pencil CLI to a PNG. It is a parallel pipeline to theme 02 (`build_pencil_image_2.md`) — same machinery, a very different skin — living in its own folders so the two never collide.

The theme lives in ONE stylesheet — `Pencil/styles/figure-03.css` (the kit) — which every theme-03 card links; it is independent of `figure.css`. The CANONICAL TEMPLATE is `Pencil/cards 03/04_extra_javascript_1/03-module-closure/card.html`: copy it and adapt. Every theme-03 figure should match it.

---

## HOW IT WORKS (the pipeline)

- A figure is one `card.html` at `Pencil/cards 03/<lesson>/<NN-slug>/card.html`. Structural HTML only.
- It links the theme-03 kit: `<link rel="stylesheet" href="../../../styles/figure-03.css">`.
- `render.mjs` opens it in headless Chrome, injects fonts, and screenshots the `#card` element at 3×.
- Output PNGs go to `Pencil/build 03/<lesson>/png/<NN-slug>.png` (the renderer writes into a `png/` subfolder whenever `PENCIL_OUT` is set).
- Each lesson folder `Pencil/build 03/<lesson>/` mirrors theme 02: `md-img/` = the figure DESCRIPTIONS (build the card from these), `png/` = the Pencil renders, `png-gemini/` = manual Gemini reference images.

## RENDER IT (live, from the Pencil folder)

Run from `Pencil/`: `PENCIL_CARDS="cards 03" PENCIL_OUT="build 03" PENCIL_VW=950 node render.mjs <match>`. `PENCIL_VW=950` is REQUIRED — the figure is 850px wide, over the default 820 viewport. Every render also writes a scalable, self-contained `.svg` into a sibling `svg/` folder (SVG export is ON by default; `--publish` copies both PNG and SVG; `--no-svg` skips it for throwaway iterations). WHEN ITERATING, render each attempt to a fresh filename (the viewer caches by filename) and inspect that.

---

## THE BIG IDEA: A WHITE SHEET ON A GREY PAGE

The whole figure is a contained white "sheet" (rounded, soft shadow, hairline border) sitting on a soft grey page. `#card` is the GREY PAGE (so its padding becomes the grey margin and the sheet's shadow is captured); the white `.sheet` holds everything. Stack inside the sheet, top to bottom:

TITLE (left-aligned) → PROJECT EXPLORER (`.explorer` — a file tree, ALWAYS first, with the current file highlighted) → TOPIC LABEL (`.snip-h`, names what the snippet shows) → CODE EDITOR → per-line comments DIRECTLY under it (no "Line by Line" heading, no divider, flush) → SUMMARY callout → thin divider → "Explanation". Block 3 is ALWAYS headed exactly "Explanation". A TWO-SNIPPET demo repeats [topic label → editor → comments] twice with a `.connector` between, then one Summary (see the `demos/demo_01` figure).

---

## THE THEME, BLOCK BY BLOCK

### Frame
`#card` = grey page (`--page #f9fafb`, 40px padding, 850px wide). `.sheet` = white card (`border-radius:14px`, `box-shadow` lg, hairline border, 40px padding). `.title` is LEFT-aligned, 30px/700, not centered.

### Project Explorer (block 0) — ALWAYS first
A file-tree window `.explorer` (same grey chrome as the editor, with a centered "Project Explorer" title) sits at the very top, before the topic label and editor. EVERY figure starts with it. It shows a small, plausible project structure: folders (`.trow.folder`, bold, folder icon) and files (`.trow.file`, document icon), indented by depth (`.l1` = 20px, `.l2` = 40px), with the CURRENT file highlighted (`.trow.cur` — teal tint + teal border + teal icon). The highlighted file's path MUST match the editor tab (tree `src/ › store/ › session.js` ⇒ tab `src/store/session.js`). Folder/file icons are inline heroicons SVGs — copy THOSE verbatim from the canonical demo (the icon markup is shared), but NEVER copy the demo's file names or folders. CRITICAL: DESIGN the tree for THIS figure's own content. It must contain the files the example actually involves, placed in a realistic SvelteKit layout under `src/lib/…` with role subfolders (`stores/`, `components/`, `models/`, `utils/`, …) — or `src/routes/…` for pages: the module-closure shows `session.js` in `src/lib/stores/` plus its two real importers (`comment-form.js`, `masthead.js`) in `src/lib/components/`; the prototype figure shows the `Article` model in `src/lib/models/`. Indent depth uses `.l1`/`.l2`/`.l3` (20/40/60px). At most add ONE plausible domain sibling for context (e.g. an `Author.js` beside `Article.js`) — never unrelated filler like a stray `+page.svelte`. The highlighted file's path always equals the editor tab.

### Editor (block 1)
Greyer, heavier chrome than theme 02: border `#9ca3af`, `#f0f0f0` bar, three grey dots, a BOLD white filename tab. Line numbers are CENTERED and bold (`.num`, no continuous gutter line). Code is 15px mono; keywords deep magenta (`--kw #93275a`), function names teal (`--fn #156a64`), both bold. Even rows zebra `#f4f4f4`. Clean code only. Keep lines short enough to fit the ~690px sheet width. ABOVE every editor sits a `.snip-h` TOPIC LABEL — a short uppercase line naming what that snippet shows (single snippet: e.g. "One private value, three exported functions"; multi-component demo: the role, e.g. "Parent — passes it down" / "Child — receives it"). ALWAYS include it. The filename tab shows a realistic project PATH, not a bare name — e.g. `src/lib/session.js`, `src/lib/Byline.svelte`.

### Line by Line (block 2)
The per-line comments sit DIRECTLY under the editor — there is NO "Line by Line" heading and NO divider, and `.editor` has no bottom margin, so the first comment is flush against the code (the `.snip-h` topic label above the editor already names the section). Each `.entry` is a `.bcol` (56px rail, `border-right`, holding a 26px rounded-square teal `.badge`) + a `.tcol` (text, 16px regular sans). The WHOLE row zebra-stripes (`.entry:nth-child(odd)` — badge rail included). Code tokens use `<code>`/`<b>` (bold mono 15px); emphasis uses `<strong>`. (The old `.lbl-h` "Line by Line" label is retired.) ONE `.entry` per explained code line — the `.badge` is that single line's number. NEVER merge two lines into a range badge (no `9–10`): if two lines are identical code, give each its OWN entry describing that specific call.

### Summary (the callout, between block 2 and 3)
A teal-tinted card `.summary` (`#f8fbfb` / `#d2e0dd` border, rounded, soft shadow) holding ONE distilled paragraph (17px). It carries a floating pill `.stag` (an inline SVG sun icon + the word "Summary", teal, uppercase) straddling its top-left edge, and a small `.tail` (a rotated square) at the bottom — a downward speech-bubble pointer toward the Explanation. Key phrases are `<mark>` = golden-yellow bold pills (`--hl #ffdf70`). No "Summary" heading and no divider above it — the pill is the label.

### Explanation (block 3)
Heading `.h` "Explanation" (24px/700, left). `.how` stacks, gap 28px: a `.callout` (grey box `#f3f4f6` with a 4px left border, yellow-200 `<mark>`s), a `.dcap` caption, a boxed diagram `.drow` (white bordered box) of `.node`s (grey, mono `<code>` imports in pink `#be185d`; the focus node `.node.teal`) joined by `.alabel` arrows (uppercase label ABOVE a teal arrow), an `.outcomes` list (`.outcome.teal` = teal-tint + ✓, `.outcome.bad` = red-tint + ✗), and a `.glossary` of stacked `.gloss` lines (2px left border, grey-mono `<mark>` headword). Note: theme 03 DOES use red (`.bad`) for the failing case.

---

## THE HTML SKELETON (copy the canonical demo; this is the shape)

```html
<!doctype html><html lang="en"><head><meta charset="utf-8" />
<link rel="stylesheet" href="../../../styles/figure-03.css" /></head><body>
<div id="card"><div class="sheet">

  <div class="title">The moral lesson, one clear line</div>

  <div class="explorer">   <!-- block 0, ALWAYS first; copy the folder/file icon SVGs verbatim from the demo -->
    <div class="exp-bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="exp-title">Project Explorer</span></div>
    <div class="tree">
      <div class="trow folder"><svg>…folder icon…</svg><span>src/</span></div>
      <div class="trow folder l1"><svg>…folder icon…</svg><span>lib/</span></div>
      <div class="trow file l2 cur"><svg>…file icon…</svg><span>file.js</span></div>
    </div>
  </div>

  <div class="snip-h">What this snippet shows — a short topic label</div>
  <div class="editor">
    <div class="bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="tab">src/lib/file.js</span></div>
    <div class="code">
      <div class="row"><span class="num">1</span><span class="src"><span class="kw">const</span> x = <span class="nl">1</span>;</span></div>
    </div>
  </div>

  <div class="lbl">
    <div class="entry"><div class="bcol"><span class="badge">1</span></div><div class="tcol">Explain line 1, with a <code>token</code> and an <strong>important phrase</strong>.</div></div>
  </div>

  <div class="summary">
    <div class="stag"><svg viewBox="0 0 20 20"><path d="…sun icon path…"/></svg>Summary</div>
    <p>One tight paragraph; wrap load-bearing phrases in <mark>…</mark> (golden-yellow pills).</p>
    <div class="tail"></div>
  </div>

  <hr class="divider" />
  <div class="h">Explanation</div>
  <div class="how">
    <div class="callout">Rule, with <mark>highlights</mark> and a <strong>term</strong>.</div>
    <div class="dcap">Caption for the diagram:</div>
    <div class="drow"> … nodes + .alabel arrows (#246a63) … </div>
    <div class="outcomes">
      <div class="outcome teal"><span class="ck">&#10003;</span> success → <code>call()</code> → result</div>
      <div class="outcome bad"><span class="ck">&#10007;</span> <code>fails</code> → why</div>
    </div>
    <div class="glossary"><div class="gloss"><mark>term</mark> &mdash; definition</div></div>
  </div>

</div></div>
</body></html>
```

---

## CANONICAL DEMO FILES
- THEME / CSS: `Pencil/styles/figure-03.css` — the kit; change the look here and every theme-03 figure follows.
- HTML demo (the template to copy): `Pencil/cards 03/04_extra_javascript_1/03-module-closure/card.html`.
- Rendered PNG: `Pencil/build 03/04_extra_javascript_1/png/03-module-closure.png`.
- Description / spec: `Pencil/build 03/<lesson>/md-img/<NN-slug>.md` (build the card from this).
- Rendered SVG: `Pencil/build 03/<lesson>/svg/<NN-slug>.svg` (true-vector; produced on every render alongside the PNG).
- TWO-SNIPPET demo (two `[topic label → editor → comments]` blocks joined by a `.connector`, then one Summary, no Explanation): `Pencil/cards 03/demos/demo_01/card.html`.

## BUILD PROCEDURE
1. Read the figure's description in `build 03/<lesson>/md-img/<NN-slug>.md`, then copy the canonical demo card to `cards 03/<lesson>/<NN-slug>/card.html`; swap the title, a `.snip-h` topic label per editor, code, line-by-line entries, the Summary paragraph (a fresh 3–4 sentence distillation with ~4 `<mark>` phrases), and the Explanation; put a realistic `src/lib/...` path in each editor tab.
2. Keep the frame (`#card` > `.sheet`), the SVG "Summary" pill, and the "Explanation" heading exactly.
3. Render with the env command (including `PENCIL_VW=950`); save to a fresh filename and inspect.
4. Tune the shared look in `figure-03.css`; tune one figure's content in its `card.html`.

## CHECKLIST
- `#card` (grey page) wraps one `.sheet` (white card); links `figure-03.css`; no font link.
- Left title → PROJECT EXPLORER (`.explorer` file tree, current file highlighted, ALWAYS first) → `.snip-h` topic label → editor (grey chrome, centered bold numbers, magenta keywords + teal functions, a real `src/...` PATH in the tab) → full-row-zebra entries DIRECTLY under the code (NO "Line by Line" heading, NO divider, flush) → Summary callout (SVG pill + yellow highlights + tail) → thin divider → "Explanation" (grey-left-border callout, boxed diagram, teal/red outcomes, stacked glossary).
- Every figure opens with the explorer; the highlighted file's tree path equals the editor tab; every editor has a `.snip-h` topic label; comments sit flush under the code.
- Renders via the env command with `PENCIL_VW=950`; produces BOTH a PNG and a true-vector SVG; visually matches the canonical demo.
