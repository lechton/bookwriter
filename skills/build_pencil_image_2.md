# Skill: Build A Pencil Image, v2 — The Three-Block Code Figure

This is the central reference for the deterministic three-block teaching figure (the "build 2" style): a moral-lesson title, a light VS-Code editor, a condensed line-by-line, and an Explanation panel — authored as HTML/CSS and rendered to a PNG by the Pencil CLI (headless Chrome). It is the print-friendly, editable, reproducible counterpart to the Gemini AI images.

The theme lives in ONE stylesheet — `Pencil/styles/figure.css` (the kit) — which every card links, so this skill describes it and the kit IS the source of truth. The canonical demo is `Pencil/cards 02/04_extra_javascript_1/04-getter/card.html`; when in doubt, copy it.

---

## HOW IT WORKS (the pipeline)

- A figure is one `card.html` at `Pencil/cards 02/<lesson>/<NN-slug>/card.html`. It is lean: structural HTML only.
- It links the shared kit: `<link rel="stylesheet" href="../../../styles/figure.css">` (all cards sit at the same depth; the link loads under file:// in both a browser and the renderer).
- `render.mjs` opens the card in headless Chrome (your installed Google Chrome), injects the bundled fonts, finds the one `id="card"` element, and screenshots just it to a PNG at 3× — a real browser renders the HTML/CSS exactly, so the PNG is a deterministic photo of the page.
- Output PNGs go to `Pencil/build 02/<lesson>/png/<NN-slug>.png` — the renderer automatically writes project-2 renders into a `png/` subfolder (it does this whenever `PENCIL_OUT` is set).
- Each lesson folder `Pencil/build 02/<lesson>/` holds three subfolders: `md-img/` = the figure DESCRIPTIONS (the `.md` content spec for each image — build the card FROM this); `png/` = the Pencil renders (the output above); `png-gemini/` = the manual Gemini reference images and prompts (the AI route, kept for comparison).

## RENDER IT (live, from the Pencil folder)

Run from `Pencil/`: `PENCIL_CARDS="cards 02" PENCIL_OUT="build 02" node render.mjs <match>`. Add `PENCIL_VW=1100` only if a card is wider than the default viewport (the current card is 700px wide, under the 820 viewport, so it is not needed). Every render also writes a scalable, self-contained `.svg` into a sibling `svg/` folder — SVG export is ON by default; `--publish` copies BOTH the PNG and the SVG into the docs images tree; pass `--no-svg` only for throwaway iteration renders. WHEN ITERATING, render each new attempt to a new/versioned filename (the viewer caches by filename) — e.g. copy the output to `<slug>-v2.png` — and inspect that.

---

## THE FIXED STRUCTURE (three blocks, top to bottom)

1. TITLE — the moral lesson, centered, big and bold.
2. CODE EDITOR — a light VS-Code window (clean code only).
3. a dark 2px divider, then "Line by Line" — the per-line explanation, condensed.
4. a dark 2px divider, then "Explanation" — the designed concept panel.

RULE: block 3 is ALWAYS headed exactly "Explanation" (not "How the … Works"). This is the default for every figure.

---

## THE THEME (explicit)

### Fonts (bundled in `fonts/`, injected by render.mjs — no font link needed)
- IBM Plex Sans — title, callout, glossary, prose.
- IBM Plex Mono — editor code and inline code tokens.
- IBM Plex Sans Condensed — the line-by-line prose only (packs more per line, reads large yet tight).

### Colour tokens (`:root` in figure.css)
```
--ink:#1f2430; --muted:#6a7686; --paper:#fff; --edge:#d8dce1; --band:#f2f2f2;
--accent:#1b5e50;            /* teal: badges, resolved boxes */   --accent-soft:#e3f1ed;
--hl:#f7d99c;                /* amber highlighter (Explanation only) */
/* light VS-Code syntax palette (editor) */
--kw:#0000ff; --fn:#795e26; --str:#a31515; --num:#098658; --tag:#a31515; --rune:#005cc5; --attr:#b55e00;
```

### Block 1 — the editor (light VS-Code window)
White card, rounded 12, soft shadow. A bar (`#f6f8fa`) with three COLOURED Mac dots (red `#ff5f56`, yellow `#ffbd2e`, green `#27c93f`, each with a darker border) and a white filename tab seated at the bottom of the bar. A line-number gutter (gray `#9ca3af`, right border). Code rows zebra-striped (even rows `#f6f8fa`). Code is semibold (600) IBM Plex Mono at 15px, syntax-coloured by the palette above (`.kw .fn .str .nl .tag .rune .attr`); plain identifiers/operators are near-black. The editor shows ONLY code — no comments. Keep code lines short (≤ ~60 characters): the editor is `white-space: pre`, so a line wider than the 700px card is clipped, not wrapped — shorten variable names (e.g. `t`, `k`, `v`) if needed.

### Block 2 — Line by Line
Heading "Line by Line" (26px bold). One row per explained line (skip trivial lines). Each row: a teal badge (`--accent`, 26px) whose number matches the gutter, an em-dash, then the explanation in IBM Plex Sans Condensed at 18px. Rows zebra-stripe (odd rows `#f2f2f2`). Inside the text: code tokens use `<b>` (mono, `.entry b`); important phrases use `<strong>` (bold condensed, `.entry strong`).

### Block 3 — Explanation (always headed "Explanation")
A professional designer's panel built from kit components: a rule `.callout` (outlined box with a speech-bubble tail and a few amber `<mark>` highlights), a small diagram from primitives (`.drow` rows of `.pill` / `.node` joined by inline `<svg>` arrows; a contrast or flow as the concept needs), a row of `.outcome` bars (`.teal` with a circled `.ck`, `.grey`, or `.split`), a `.glossary` of `.gloss` cards, and a `.takeaway` line.

### Dividers
A dark 2px line (`#1f2937`) separates the blocks (`hr.divider`).

---

## THE HTML SKELETON (copy this shape; the kit styles it)

```html
<!doctype html><html lang="en"><head><meta charset="utf-8" />
<link rel="stylesheet" href="../../../styles/figure.css" /></head><body>
<div id="card">
  <div class="title">The moral lesson, one clear line</div>

  <div class="editor">
    <div class="bar"><i class="dot r"></i><i class="dot y"></i><i class="dot g"></i><span class="tab">file.js</span></div>
    <div class="code">
      <div class="row"><span class="num">1</span><span class="src"><span class="kw">const</span> x = <span class="num">1</span>;</span></div>
    </div>
  </div>

  <hr class="divider" />
  <div class="h">Line by Line</div>
  <div class="lbl">
    <div class="entry"><span class="badge">1</span><span class="dash">—</span><span>Explain line 1, with a <b>codeToken</b> and an <strong>important phrase</strong>.</span></div>
  </div>

  <hr class="divider" />
  <div class="h">Explanation</div>
  <div class="how"> … callout, diagram, outcome rows, glossary, takeaway … </div>
</div>
</body></html>
```

---

## CANONICAL DEMO FILES (the live reference)
- THEME / CSS: `Pencil/styles/figure.css` — the kit; change the look here and every figure follows.
- HTML demo: `Pencil/cards 02/04_extra_javascript_1/04-getter/card.html` — copy this for a new card.
- Rendered PNG: `Pencil/build 02/04_extra_javascript_1/png/04-getter.png`.
- Description / spec: `Pencil/build 02/04_extra_javascript_1/md-img/04-getter.md` (build the card from this).
- Gemini reference: `Pencil/build 02/04_extra_javascript_1/png-gemini/` (the manual AI version, for comparison).

## BUILD PROCEDURE
1. Read the figure's description in `build 02/<lesson>/md-img/<NN-slug>.md`, then copy the getter card to `cards 02/<lesson>/<NN-slug>/card.html`; swap the title, the code lines (with syntax spans), the line-by-line entries, and the Explanation content.
2. Block 3 heading is "Explanation"; block 2 is "Line by Line".
3. Render with the env command; save the attempt to a fresh filename and inspect.
4. Tune shared look in `figure.css` (affects all cards); tune one figure's content in its `card.html`.

## CHECKLIST
- One `id="card"`; links `figure.css`; no font link.
- Title (centered) → editor (clean code, colored dots, zebra, light syntax) → dark divider → "Line by Line" (condensed, teal badges, `<b>` code + `<strong>` emphasis) → dark divider → "Explanation".
- Renders via the env command; visually matches the canonical getter card.
