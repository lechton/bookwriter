# Skill: How To Build A Pencil Image (The Deterministic Figure Pipeline)

This skill produces the course's FIGURES: the diagrams a lecture, booklet, or Q&A digest
embeds with a normal Markdown image reference. Figures are authored as **HTML/CSS** and
rendered to a **PNG** by a headless Chrome. The source is code, so every figure is
**deterministic, diff-able, editable, and traceable** — never hand-drawn, never an AI image.

The live project lives in `/Pencil` (`render.mjs`, `pencil.config.json`, `fonts/`, `cards/`,
`build/`). Read `Pencil/README.md` for the ops view; this skill is the AUTHORING law: the
fixed format of a card and the procedure to build one that fits the pattern.

---

ROLE AND GOAL

You are given one concept (usually a line from an image list such as
`output/svelte/qa/<lesson>_images_list.md`) and the source documentation that defines it.
You return one card: a self-contained `card.html` whose rendered PNG teaches that one
concept. The card obeys the THREE-PANEL PATTERN exactly, carries correct code, and renders
to a crisp, professional figure indistinguishable in style from every other card in the set.

Three things make a good card: PATTERN FIDELITY (the three panels, in order, with a real
execution flow in the middle), CODE TRUTH (the code is real and correct), and VISUAL
CONSISTENCY (every card shares one look, so the set reads as one hand).

---

THE PATTERN: THREE PANELS, IN ORDER (THIS NEVER VARIES)

Every card is three stacked panels. This is the format; do not invent a fourth shape.

1. THE CODE. A single, short, **runnable, correct** code snippet for ONE mechanism, shown in
   a dark "editor window" with traffic-light dots, line numbers, and syntax highlighting.
   This is the thing the card is about. Panel title names it (e.g. `A CLOSURE IN JAVASCRIPT`).

2. THE EXECUTION FLOW — the heart, and the rule that decides whether a concept earns a card
   at all. This panel traces, in numbered STAGES (Stage 1 → 2 → 3 → 4), **what happens, step
   by step over time, when that code runs**. Boxes for the moving parts, arrows for the flow,
   values changing across stages. It is a TEMPORAL BEHAVIOR, not a static diagram, not a
   comparison, not a restated definition. Panel title is a `... FLOW` (e.g.
   `REACTIVITY & EXECUTION FLOW`, `EXECUTION & MEMORY FLOW`, `PROPERTY LOOKUP FLOW`).

3. THE SUMMARY. Two or three sentences distilling the concept, with the load-bearing phrases
   wrapped in `<mark>` highlights. Panel title is `SUMMARY`.

If a concept has no step-by-step runtime behavior, it does NOT fit this pattern — see below.

---

WHAT EARNS A CARD (THE FILTER)

A concept earns a card only if it has BOTH a concrete code snippet AND a genuine execution
flow (a sequence of things that happen when the code runs). Apply this filter ruthlessly:

- FITS: a closure capturing a variable; a getter running on read; a proxy trap firing; the
  observer pattern's track-then-trigger; a prototype lookup walking the chain; a change
  propagating source → derived → effect; React's rerun-diff-patch.
- DOES NOT FIT, so do not force it: a bare definition ("an object is named slots"), a
  comparison ("getter vs proxy", "three frameworks on one axis"), or a static structure
  ("the DOM is a tree", "the DAG"). Reframe a structure into its BEHAVIOR if you can
  ("the DAG" → "how a change propagates through it"); otherwise drop it.

When unsure, ask: "what are the numbered stages of what happens at runtime?" If you cannot
list them, there is no flow, and there is no card.

---

THE DESIGN THEME (CANONICAL — COPY THIS LOYALLY)

This theme is fixed. Reproduce every value; do not let it drift. The reference implementation
is `cards/04_extra_javascript_1/01-prototype-chain` — when in doubt, match that card exactly.

THE THREE REGIONS (top → middle → bottom). The card is one vertical stack of three light
panels on a soft, dotted background. The panels are IDENTICAL in chrome; the rhythm comes
from their CONTENTS, not from different panel colors:
- TOP (code): a light panel framing a DARK slate code window (`#25343b`) — the only dark mass.
- MIDDLE (flow): a light, airy panel of white boxes, thin arrows, and short captions.
- BOTTOM (summary): a light panel of body text with warm gold highlights.
One accent color threads through all three (boxed token in the code, the "found" box in the
flow, the highlights in the summary), so the color MEANS the concept top to bottom.

THE SHELL & BACKGROUND.
- `#card`: width 760px, padding 24px, radius 18px, border 1px `#c4cdd6`. It is the only
  element the renderer captures.
- Background: a dot grid — `radial-gradient(circle, #cfd8e0 1px, transparent 1.4px)` tiled at
  24px — layered over a soft vertical gradient `#eef2f6 → #e7edf3`. The dots read in the
  margins and gaps; the panels cover the centre.

THE PANEL (all three identical).
- Fill `#f0f4f8`, border 1px `#d6dde4`, radius 14px, padding 20px 22px.
- 18px gap between panels (margin-bottom). Shadow `0 1px 3px rgba(20,40,70,.06)`.
- Panel title: Inter, 20px, weight 800, letter-spacing .07em, UPPERCASE, centred, `#36424f`,
  18px space beneath.

TYPOGRAPHY SCALE (Inter = UI, JetBrains Mono = code). The RELATIVE sizes are the design — keep
them: title biggest, body/code/headers in the 16–17 band, captions/labels in 12–14.5. Never
shrink the code or summary below 16/17.
- Panel title ........ 20px / 800 / uppercase / +.07em tracking / `#36424f`
- Summary body ....... 17px / 400 / line-height 1.72 / `#38424e`
- Stage header ....... 17px / 800 ("Stage N:" prefix in `#6a7686`, the rest in `#2b3440`)
- Code .............. 16px / line-height 1.70 / JetBrains Mono / `#d6dee8`
- Note (caption) .... 14.5px / 400 / line-height 1.5 / `#51606e`
- Node body ......... 14.5px / mono; node header `.nh` 12px / 800 / Inter / `#46535f`
- Codebox / chip .... 14px / 13px mono
- Inline code in summary `.mono` ... 15px / 700 / `#c25b18`

SPACING SCALE.
- Card padding 24 · panel padding 20/22 · gap between panels 18 · title-to-body 18.
- Flow grid: 2 columns, gap 20 (row) / 24 (col), `align-items:start`.
- Inside a stage: `.row-mid` gap 10 · vertical chain `.col-mid` gap 4 · stage-header-to-visual 10.
- Code window: dots padding 12/15 (dot 13, gap 8) · code padding 10/0/16 · row side padding 18 ·
  line-number gutter 32 wide with 18 right padding.

THE CODE WINDOW.
- Background `#25343b` (the demo's measured slate), radius 11px, inset hairline highlight. Traffic lights `#ff5f56` /
  `#ffbd2e` / `#27c93f`, 13px. Line numbers `#5b6b80`.
- Syntax palette: `.tag` `#f7869b` · `.kw` `#5aa6e8` · `.fn` `#e6d27a` · `.var` `#9fd0f0` ·
  `.num` `#b5cea0` · `.com` `#7fae7a` italic · `.pl` `#cdd6e2` · `.str` `#ce9178`.
- HIGHLIGHT BAND `.hl`: a full-width olive/khaki wash `rgba(158,138,68,.6)` (composites to ~`#6e6840` over the slate) on the key line.
- BOXED TOKEN `.tok`: 1px accent border, radius 5, faint accent fill, light text — rings the
  one token the card is about.

THE FLOW VOCABULARY.
- `.node`: white, 1px `#c2ccd6`, radius 9, padding 10/13, mono body; `.nh` header 12px/800 Inter.
- `.found`: the ACCENT box (1.5px accent border, faint accent fill, accent-dark header) — marks
  the resolved / star element.
- `.chip`: small pill, 1px `#cdd5dd`, `#f3f5f7` fill, radius 7.
- `.codebox`: mono mini-snippet / result box, 1px `#c7d0d9`, `#fbfcfd` fill, radius 8.
- Arrows: inline `<svg>`. Grey `#9aa6b2` for neutral hops; the ACCENT color for the active
  "found" arrow; dashed for a reference/capture link. A labelled arrow puts its tiny label
  ABOVE the line (a small mono span), never as cramped text inside the SVG.
- Marks: `.ok` `#2e9e6b`, `.no` `#b04a4a` for ✓ / ✗.

THE SUMMARY.
- Body 17px / 1.72. `<mark>` = gold `rgba(206,170,86,.7)` (composites to ~`#d8c088`), padding 1/3, radius 3. Inline code
  in `.mono` (orange `#c25b18`, 700). Highlight only the load-bearing phrases — usually 3–4.

ONE ACCENT PER CARD. Pick one accent for the concept's STAR element; everything else stays
neutral grey/navy. Each preset is four values — border, soft fill (`.tok`), faint fill
(`.found`), and ink (`.found` header):
- green — resolved / found:      `--accent #3fae6b` · soft `rgba(63,174,107,.16)` · faint `#e9f8ef` · ink `#1f7a4d`
- blue  — reactive / live value: `--accent #2f6fc4` · soft `rgba(47,111,196,.14)`  · faint `#eaf2fb` · ink `#1f4f8f`
- amber — captured / private:    `--accent #d9b65a` · soft `rgba(217,182,90,.18)`  · faint `#fdf6e3` · ink `#8a6d1f`

FONTS. The renderer INJECTS Inter + JetBrains Mono at render time. Cards use the families and
add NO `<link>` — fonts are guaranteed regardless of folder depth.

TEXT DISCIPLINE. The code panel holds the only long text. Box labels and captions stay short;
explanation goes in the `.note`, never a wall of prose inside a box.

---

FOLDERS, NAMING, OUTPUT, AND THE MARKDOWN REFERENCE

- SOURCE. One folder per card, grouped by lesson:
  `Pencil/cards/<lesson>/<NN-slug>/card.html`
  e.g. `Pencil/cards/04_extra_javascript_1/01-prototype-chain/card.html`.
  The `<lesson>` matches the source file stem; `NN` is the image-list number; `slug` is short.
- THE CLIP. `card.html` must contain exactly one `<div id="card"> … </div>`.
- OUTPUT mirrors the path: `Pencil/build/<lesson>/<NN-slug>.png`.
- PUBLISH copies into the docs tree: `output/svelte/images/<lesson>/<NN-slug>.png`.
- THE CONTENT TWIN: a parallel Markdown file holding the figure's exact content, at
  `output/svelte/image-content/<lesson>/<NN-slug>.md` (sibling to the PNG, same name). See its own
  section below.
- THE REFERENCE pasted into the lecture/booklet/qa file is standard Markdown:
  `![<short alt>](images/<lesson>/<NN-slug>.png)`.

---

THE CONTENT TWIN (THE FIGURE'S EXACT CONTENT, IN MARKDOWN)

Every published card has a twin Markdown file recording, in full, the LOGICAL CONTENT of the figure —
the code, the flow, the summary — and nothing about the LOOK (no colors, fonts, layout). It is the
figure made readable, reviewable, and diffable as text. Save it at
`output/svelte/image-content/<lesson>/<NN-slug>.md`, named as the PNG's twin.

It transcribes the three panels EXACTLY, block by block:
- HEADER: a title line `# NN · <Card Title> — Figure Content`, a one-line blockquote stating it is the
  *what it says, not how it looks*, then three bullets — Concept (shot #), Source (digest section),
  Why it earns a card.
- BLOCK 1 — Code: the panel's code VERBATIM in a fenced ```js block — the real, runnable snippet, not
  a paraphrase. Then a line naming the highlighted line(s) and the boxed token(s).
- BLOCK 2 — Execution Flow: one bullet per stage, each with the stage's exact title, the exact box /
  chip / arrow labels (left-to-right, using → and ↓), and the stage's note verbatim.
- BLOCK 3 — Summary: the summary prose WORD FOR WORD, with **bold** on the phrases the figure marks and
  `code` on the inline mono terms; close with the one-line legend.

Two hard rules. (1) Transcribe the EXACT content — a reader must see the real code and the real
summary, never a reworded version; the code fence carries real code, the summary is verbatim. (2)
Write every paragraph and bullet as a SINGLE UNBROKEN LINE — no manual mid-sentence wrapping, which
breaks the rendering. The locked reference is
`output/svelte/image-content/04_extra_javascript_1/01-prototype-chain.md`; match it exactly.

---

THE BUILD PROCEDURE (FOLLOW IN ORDER)

1. CONFIRM THE FLOW. State, in one line each, the numbered stages of what happens at runtime.
   If you cannot, stop — the concept does not fit the pattern (see THE FILTER).
2. WRITE THE CODE. The smallest correct, runnable snippet that demonstrates the mechanism.
   Verify it against the source documentation; wrong code is a wrong lesson.
3. PICK THE ACCENT. One color, marking the concept's star element.
4. AUTHOR `card.html`. Start from THE CSS TEMPLATE below (or copy a sibling card). Fill the
   three panels: code (with line numbers, syntax classes, the `hl` band, boxed `.tok`s); the
   staged flow (2-col grid, nodes + arrows + notes); the summary (with `<mark>`s).
5. RENDER. `node render.mjs <match>` and open `build/<…>.png`. Check legibility, the type
   scale, alignment, and that the flow reads left-to-right / top-to-bottom.
6. ITERATE then PUBLISH. When it matches the set, `node render.mjs <match> --publish` and
   paste the printed `![]()` line into the target file.
7. WRITE THE CONTENT TWIN. Save `output/svelte/image-content/<lesson>/<NN-slug>.md` — the figure's
   exact code, flow, and summary as text (see THE CONTENT TWIN). Match `01-prototype-chain.md`.

---

THE CSS TEMPLATE (COPY, THEN ADD ONE ACCENT)

Paste this as the `<style>` of a new card, then add the card's single accent (set `--accent`
and any card-specific box classes). Everything below is the shared, fixed look.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<!-- Fonts (Inter + JetBrains Mono) are injected by render.mjs. -->
<style>
  :root{
    --ink:#2b3440; --muted:#6a7686; --panel:#f0f4f8; --panel-edge:#d6dde4;
    --code-bg:#25343b; --hl:rgba(158,138,68,.6); --arrow-grey:#9aa6b2;
    /* ONE accent per card — pick a preset (green/blue/amber) from THE DESIGN THEME */
    --accent:#3fae6b; --accent-soft:rgba(63,174,107,.16); --accent-faint:#e9f8ef; --accent-ink:#1f7a4d;
  }
  *{box-sizing:border-box} body{margin:0}
  #card{width:760px;padding:24px;color:var(--ink);
    font-family:"Inter",-apple-system,"Helvetica Neue",Arial,sans-serif;
    background:radial-gradient(circle,#cfd8e0 1px,transparent 1.4px) 0 0/24px 24px,
               linear-gradient(180deg,#eef2f6,#e7edf3);
    border:1px solid #c4cdd6;border-radius:18px}
  .panel{background:var(--panel);border:1px solid var(--panel-edge);border-radius:14px;
    padding:20px 22px;margin-bottom:18px;box-shadow:0 1px 3px rgba(20,40,70,.06)}
  .panel:last-child{margin-bottom:0}
  .panel-title{text-align:center;font-weight:800;letter-spacing:.07em;font-size:20px;
    color:#36424f;margin:2px 0 18px}
  .window{background:var(--code-bg);border-radius:11px;overflow:hidden;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}
  .dots{padding:12px 15px;display:flex;gap:8px;background:rgba(255,255,255,.03)}
  .dot{width:13px;height:13px;border-radius:50%}
  .r{background:#ff5f56}.y{background:#ffbd2e}.g{background:#27c93f}
  .code{font-family:"JetBrains Mono",Menlo,Monaco,monospace;font-size:16px;line-height:1.7;
    padding:10px 0 16px;color:#d6dee8}
  .row{display:flex;padding:0 18px;white-space:pre}
  .row.hl{background:var(--hl)}
  .ln{width:32px;flex:none;color:#5b6b80;text-align:right;padding-right:18px;user-select:none}
  .tag{color:#f7869b}.kw{color:#5aa6e8}.fn{color:#e6d27a}.var{color:#9fd0f0}
  .num{color:#b5cea0}.com{color:#7fae7a;font-style:italic}.pl{color:#cdd6e2}.str{color:#ce9178}
  .tok{border:1px solid var(--accent);border-radius:5px;padding:0 4px;background:var(--accent-soft);color:#e8eef6}
  .stage-h{font-weight:800;font-size:17px;margin:2px 0 10px;color:#2b3440}
  .stage-h span{color:var(--muted);font-weight:800}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px 24px;align-items:start}
  .node{border:1px solid #c2ccd6;border-radius:9px;background:#fff;padding:10px 13px;font-size:14.5px;
    display:inline-block;font-family:"JetBrains Mono",Menlo,Monaco,monospace}
  .node .nh{font-weight:800;font-size:12px;letter-spacing:.04em;color:#46535f;margin-bottom:6px;font-family:"Inter",sans-serif}
  .found{border:1.5px solid var(--accent);background:var(--accent-faint);border-radius:9px;padding:10px 13px;
    font-size:14.5px;display:inline-block;font-family:"JetBrains Mono",Menlo,Monaco,monospace}
  .found .nh{font-weight:800;font-size:12px;color:var(--accent-ink);margin-bottom:6px;font-family:"Inter",sans-serif}
  .chip{border:1px solid #cdd5dd;border-radius:7px;background:#f3f5f7;padding:3px 10px;font-size:13px;
    display:inline-block;font-family:"JetBrains Mono",Menlo,Monaco,monospace}
  .row-mid{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .col-mid{display:flex;flex-direction:column;align-items:flex-start;gap:4px}
  .codebox{font-family:"JetBrains Mono",Menlo,Monaco,monospace;font-size:14px;color:#3b4756;line-height:1.55;
    border:1px solid #c7d0d9;border-radius:8px;background:#fbfcfd;padding:9px 11px}
  .note{font-size:14.5px;color:#51606e;line-height:1.5}
  .ok{color:#2e9e6b;font-weight:800}.no{color:#b04a4a;font-weight:800}
  svg.ico{display:inline-block;vertical-align:middle}
  .summary{font-size:17px;line-height:1.72;color:#38424e}
  mark{background:rgba(206,170,86,.7);padding:1px 3px;border-radius:3px;color:#2b3440}
  .mono{font-family:"JetBrains Mono",monospace;font-size:15px;color:#c25b18;font-weight:700}
</style>
</head>
<body>
  <div id="card">
    <div class="panel"><div class="panel-title">…CODE…</div> … </div>
    <div class="panel"><div class="panel-title">…FLOW…</div> <div class="grid"> … </div></div>
    <div class="panel"><div class="panel-title">SUMMARY</div> <div class="summary"> … </div></div>
  </div>
</body>
</html>
```

---

COMMANDS

```bash
cd Pencil
node render.mjs <match>            # render cards whose path contains <match>
node render.mjs <match> --publish  # render + copy to output/svelte/images/ + print ![]()
node render.mjs                    # render every card
```

`<match>` is any substring of the card path — a slug (`prototype`) or a whole lesson
(`04_extra_javascript_1`).

---

FINAL CHECKLIST

Not done until all hold:

- The card has exactly THREE panels, in order: code, execution FLOW, summary.
- Panel 2 is a numbered, temporal flow of what happens at runtime — not a static diagram or
  a comparison. (If it can't be, the concept should not have been a card.)
- The code is real, minimal, and correct against the source documentation.
- One accent color, used consistently for `.tok`, the star box, and the `<mark>`s.
- Visual format matches the template exactly (shell, panels, window, syntax colors, type scale).
- No font `<link>`; fonts come from the renderer.
- Folder is `cards/<lesson>/<NN-slug>/card.html` with one `id="card"`; it renders and reads
  cleanly at 3×; the `![]()` reference points to `images/<lesson>/<NN-slug>.png`.
- The content twin exists at `image-content/<lesson>/<NN-slug>.md`: code/flow/summary transcribed
  verbatim (real code fence, word-for-word summary), every paragraph one unbroken line.
