# Pencil — the figure pipeline for the Svelte course

Deterministic documentation images. Each figure is authored as **HTML/CSS** and rendered
to a **PNG** by a headless Chrome you already have installed. The output is a normal image
that any lecture / booklet / Q&A file references with standard Markdown:

```md
![How $state drives a fine-grained reactive update](images/01-state-reactivity.png)
```

No AI image guesswork, no hand-drawing. The source is code, so every figure is
**reproducible, diff-able, and editable** — the same input always produces the same image.

---

## The architecture (and why)

```
design (HTML/CSS)  ──►  render (Chrome, headless)  ──►  PNG  ──►  ![](…) in a .md file
 cards/<lesson>/        render.mjs (puppeteer-core)    build/      output/svelte/images/
   <NN-slug>/card.html  clip #card, inject fonts, 3×   <lesson>/   <lesson>/

For the authoring law (the three-panel card pattern, format, accents), see
/skills/build_pencil_image.md. This file is the ops view.
```

Four decisions, each with its reason:

1. **Author in HTML/CSS, not an image model.** Code is deterministic and traceable; an AI
   image generator is neither (it garbles code and can't be diffed). This is the whole point.

2. **Render with `puppeteer-core` + your installed Chrome — output PNG.** A real browser
   renders *everything* (connector arrows, 2-D layouts, gradients, syntax colors, highlighter
   spans) exactly as designed. `puppeteer-core` downloads **no** browser; it drives the Chrome
   already at `/Applications/Google Chrome.app`. We capture **PNG at `deviceScaleFactor: 3`**,
   which is razor-sharp on screen and at print DPI.

   *Why PNG and not SVG?* A Markdown `![](x.svg)` loads SVG through an `<img>` tag, which runs
   in a restricted mode where embedded HTML (`<foreignObject>`) does **not** render — so a
   "snapshot the page into SVG" file shows up blank. True-vector SVG (via a tool like Satori)
   *does* work in `![]()`, but only supports a subset of CSS (flexbox, no arbitrary
   box-to-box arrows), which a rich infographic like the demo card exceeds. So: **PNG for rich
   figures** (the default); SVG is a future option for simple, flat cards (see below).

3. **Clip to `#card`, not the whole page.** Every card has one element `id="card"`. The
   renderer screenshots exactly that element, so the page can carry padding/scaffolding without
   leaking into the output.

4. **Pin everything for determinism.** Fixed Chrome path, fixed viewport width, fixed scale,
   `document.fonts.ready` awaited before the shot, animations disabled, sRGB color profile,
   and **bundled fonts** — Inter (UI) + JetBrains Mono (code) live in `fonts/`. The renderer
   **injects** them (with absolute paths) at render time, so output is byte-identical on any
   machine *and* cards need no font `<link>` and work at any folder depth.

---

## Layout

```
Pencil/
  README.md                 ← this guide
  pencil.config.json        ← chrome path, scale, dirs
  render.mjs                ← the renderer
  fonts/
    fonts.css               ← @font-face (injected by the renderer, not linked)
    *.woff2                 ← bundled font files (deterministic, professional)
  cards/
    01-state-reactivity/card.html       ← early demo cards (flat)
    02-closure/card.html
    04_extra_javascript_1/              ← cards grouped by lesson
      01-prototype-chain/card.html      ← one self-contained figure, has id="card"
  build/
    04_extra_javascript_1/01-prototype-chain.png   ← output mirrors the card path
  demo/
    demo_001.png            ← the reference image we reproduced
    example_usage.md        ← what a finished .md with a figure looks like
```

---

## Usage

```bash
cd Pencil

# render every card under cards/
node render.mjs

# render cards whose path contains the match (a slug or a whole lesson)
node render.mjs prototype
node render.mjs 04_extra_javascript_1

# render AND copy PNGs into output/svelte/images/ (mirrors the card path)
node render.mjs prototype --publish
```

Each run prints the figure's pixel size and the exact Markdown line to paste.

---

## Authoring a new figure

The full authoring law — the fixed three-panel card pattern, the visual format, and the
accent convention — is in **`/skills/build_pencil_image.md`**. In short:

1. `cards/<lesson>/<NN-slug>/card.html` — copy a sibling card or the skill's CSS template.
2. Keep one wrapper element `<div id="card">…</div>` — that is what gets captured.
3. Three panels, in order: code → a numbered **execution flow** → a highlighted summary.
4. No font `<link>` (the renderer injects fonts). Design with HTML/CSS + inline SVG.
5. `node render.mjs <slug>`, check `build/<lesson>/<NN-slug>.png`, then `--publish`.

### Where Pencil.dev (the canvas tool) fits — optional

You can design a figure visually in Pencil.dev and export its HTML/CSS into a `card.html`,
*or* hand-author the HTML directly. Either way it flows through the **same** render step, so
the pipeline never depends on a tool that has to be running. Use the canvas when you want to
design by eye; skip it for code-card-style figures that are faster to type.

---

## TODO / options not yet built

- **SVG path** (Satori) for simple flat cards that benefit from true vector + tiny files.
- **Batch manifest** mapping each card to its destination lecture, for one-command publish-all.
