# Brief 03 — Canvas Template Study: how the CSS figure panel should look and behave

Date: 2026-09-13 · Number: 03 · Status: validated by the demo lesson; generator promoted to production

## Addendum (2026_09_13, recorded after the fact)

The demo lesson was built in `src/canvas-lab/` (demo `md/08.md` "The Box That Forgot Its Children", compiled to `html/08.html` and `pdf/08.pdf`) and validated visually in browser and in Prince: the five initial modes shipped in `css-figure.mjs` are `box`, `margin`, `float`, `float-text`, and `center` (modes 2–5 of this proposal's family; the flex/grid geometry, cascade scorecard, and BEM dissection modes remain future generator extensions, added to `src/css-figure.mjs` before first use per the panel discipline in `instructions.md`). Later on 2026-09-13 the generator and stylesheet were promoted to `src/css-figure.mjs` and `src/lecture.css`, and the production pipeline `src/build-lectures.mjs` was forked with the full gate battery (figure panels instead of canvas). Note the demo covers three mechanisms as one lesson (box model, margin collapse, float collapse) for canvas-exercising purposes; production lectures follow the bank's one-mechanism rows (Q4, Q5, Q9, Q10 cover the same ground separately).

## Why this is the hard part

Problem (c) in the commission: in the accessibility project, rules appear as code and then appear as annotated UI elements, and that works because accessibility is largely *invisible* (focus order, screen reader announcements, contrast numbers), so the panel's job is to make the invisible visible with chips, rings, and tooltips. CSS is the opposite: the rendering *is* the topic. A flexbox lecture must show real geometry, a specificity lecture must show a score, a BEM lecture must dissect a class name. If we keep the a11y canvas's heavy chip-stack aesthetic on top of an already expressive layout figure, the panel becomes visual noise. The requester's instinct is right: **the CSS panel must be calmer than the a11y panel precisely because the subject is visually loud.**

## The two assets we already own

1. **`various/demo UI /design_instructions.md`** (found in this project): a complete design language for CSS figures. Academic textbook publishing (modern McGraw-Hill), strictly flat, muted pastels, no brutalist shadows. Key rules: ultra-light canvas backgrounds (`#F8FAFC`, thematic tints like lavender `#F3E8FF`); items with flat pastel fills (`#FFCC80` with a same-hue darker border); semantic accent colors for annotation lines (muted red `#EF4444` for the main axis, soft blue `#3B82F6` for the cross axis); Inter for prose, JetBrains Mono for technical labels and captions; directional arrows as solid 2px lines with flat triangle heads; *invisible forces* (injected space, distribution) as dashed lines with small solid dots at division points; every figure followed by a centered mono caption numbered like `Fig 4.2: ...`.
2. **`various/demo UI /css_flexbox_layout_guide.html`**: a working two-figure demo in exactly that language. Fig 4.2 draws the main/cross axis coordinate system over two flex items; Fig 4.3 draws `space-between` as three orange items on a lavender container with purple dashed "injected space" lines and center dots. I rendered it in the browser: it is clean, print-friendly, and genuinely calm.

## The a11y canvas anatomy (what we keep and what we drop)

Keep: the generator discipline (a ` ```canvas ` fenced block compiled to HTML by a build-time module, never hand-authored per lecture, never screenshots); the wrong/right verdict law with red/green top tags; the `note="..."` status chip; the `width="2/3"` default budget; `layout="compare"` with at most two elements; the dotted blueprint page background (it reads as "graph paper", which fits CSS perfectly); the National Times content rule.

Drop or demote for css-01: the screen reader tooltip layer, the focus-order badges, the contrast chips (those belong to the accessibility series; Part 3 of css-01 links back to those lectures instead of re-annotating them); the browser chrome (dots + URL bar) as the *default* frame, because `design_instructions.md` requires figures to feel like precise mathematical canvases, not interactive web components.

## The proposal: `css-canvas.mjs`, one generator with six figure modes

A single fenced-block generator compiled by the build, in the a11y tradition, whose annotation layer is *measurement graphics* (thin lines, small mono labels, pastel fills, dashed invisible forces) instead of chip stacks. Every figure gets an auto-numbered mono caption (`Fig {lecture}.{n}`).

**Mode 1 — `mode="flex"` (and `mode="grid"`): geometry figures.** The container renders its children with the real CSS being taught (the build parses the declaration and applies it). Overlay vocabulary: solid 2px axis arrows with flat triangle heads (red main axis, blue cross axis, purple for distribution forces), dashed lines with center dots for injected free space (`justify-content`), gap measurement ticks (`gap: 16px`), item order numbers, and for grid: track index lines (1..n), explicit vs implicit track tinting, `grid-area` outlines. Anchor: the existing demo is already the proof of concept for this mode.

**Mode 2 — `mode="boxmodel"`: the DevTools-style concentric band figure.** One element drawn as nested bands: margin (soft orange), border, padding (soft green), content (soft blue), each with a small mono measurement label (`margin 24 · border 2 · padding 16 · content 200×80`). Wrong/right compare shows `content-box` vs `border-box` on identical declarations. This replaces a thousand words about why two 50% columns with padding overflow.

**Mode 3 — `mode="cascade"`: resolution figures.** Two or three "selector cards" (`.nav a`, `#nav a`, `.nav .active a`) each showing its specificity score as three mono digits `(0,1,0)` in labeled a/b/c columns, with the winning card edged in green and losers dimmed; for `@layer` lectures, a horizontal layer stack with the declared order. No UI mock at all: the subject is arithmetic, so the figure is arithmetic.

**Mode 4 — `mode="bem"`: naming dissection figures.** A class name exploded into color-coded segments: `.card__title--featured` rendered as three joined tokens (block = slate, element = indigo, modifier = amber) with mono part labels beneath, above a small rendered component it styles. Compare mode shows the forbidden grandchild chain `.card__header__title__link` struck through in red versus the flat correct form.

**Mode 5 — `mode="viewport"`: responsive figures.** Two device frames side by side (width badges `320px` and `1024px`, a thin ruler with breakpoint ticks) rendering the same component at both widths; dashed overflow regions in red where content escapes. This is the one mode that keeps a browser-like frame, because the browser context *is* the subject (viewport meta, media queries, container queries).

**Mode 6 — `layout="compare"` (mode-less): plain rendered contrast.** The a11y compare discipline, visually quiet: two rendered elements (a centered card done with margin hacks versus three lines of flexbox), wrong/red tag and right/green tag, one `note` chip each, nothing else. This is the default for "before/after one property" moments.

## The calm-panel budget (the "less loaded" law)

1. **One mechanism per panel.** One axis pair, or one measurement, or one score, or one dissection. Never two vocabularies in one figure.
2. **Maximum three overlay glyphs per element** (an arrow, a measurement, a dot). If the mechanism needs more, split it into a second figure; the build rhythm (code -> figure -> derivation, repeated) already supports multi-step panels.
3. **Annotation palette is measurement-only:** slate/indigo/purple lines and mono labels; red and green are reserved for wrong/right verdicts exactly as in the a11y series, preserving cross-series visual continuity.
4. **Figures are honest:** the rendered geometry must be what the CSS actually computes (the demo already does this with mathematically locked `calc()` positions); annotations never fake a layout the code does not produce.
5. **Caption law:** every figure ends with a centered mono caption `Fig {lecture}.{n}: one sentence stating the mechanism`, which also gives the PDF a textbook spine.

## The demo lesson plan (next step after this discussion)

Build one complete demo lesson in `src/canvas-lab/` on the hardest mainstream topic: **flexbox main axis vs cross axis, `justify-content` vs `align-items`** (draft bank Q13). The demo package: (1) a hand-written `flex-demo.md` in full lecture skeleton (ladder, sections, summary, table) so we test the real authoring experience; (2) a prototype `css-canvas.mjs` implementing `mode="flex"` + plain compare first (the two modes the lesson needs); (3) a forked `build-lectures.mjs` pointing at the lab folder; (4) screenshots in browser and a Prince PDF, reviewed against the a11y Lecture 14 benchmark for density and calm. Success criteria: a tired reader understands the axis distinction from the figure alone; the panel has strictly less visual weight than the a11y canvas; nothing in the figure is faked.

## Open questions for discussion

1. **Browser chrome:** drop it for pure geometry figures (my recommendation) and keep a device frame only for `mode="viewport"`, or keep the a11y chrome everywhere for series continuity?
2. **Figure numbering:** auto-number per lecture (`Fig 13.1`, `Fig 13.2`) versus per-part numbering (`Fig 4.2` style from the demo)? I recommend per-lecture: lectures are the unit of reading.
3. **Grid line rendering:** for `mode="grid"`, do we draw the classic DevTools grid overlay (numbered lines, tinted tracks)? It is the densest proposed vocabulary; budget rule 2 may force a "max 4 tracks" cap.
4. **The BEM mode audience:** is an exploded class-name figure enough for Part 2, or do we also want a small "file tree to compiled CSS" figure for `@use`/`@forward` architecture lectures?
5. **Preprocessors in figures:** LESS/Sass lectures show source *and* compiled output. Should the figure mode `mode="compile"` render a two-pane arrow figure (`.scss source -> compiled .css`), or is that better served by two stacked code fences with a derivation, no canvas at all? I lean to the latter: not everything deserves a figure.
6. **Prince fidelity:** the demo's SVG overlays and `calc()` locks must survive Prince. The a11y build already proves Prince handles inline SVG and absolute overlays, but the demo lesson must confirm it before we commit the vocabulary.
