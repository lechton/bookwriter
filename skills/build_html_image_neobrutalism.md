# Skill: Build A Neo-Brutalist HTML Concept Art Image

This skill authors standalone Neo-Brutalist diagram images in pure HTML/CSS. Each file represents a single, focused visual metaphor that unlocks the ONE key mechanical concept of a lecture. Rather than a multi-column webpage or a cluttered dashboard, each graphic is a single, punchy, minimalist poster card (2 to 4 visual elements total), adhering strictly to the flat Neo-Brutalist design language of the series.

---

## Output Path & Canonical References

- Output path: `diagram-lab/output/<chapter>/html-image-neobrutalism/<NN>.html` (e.g. `38.html`).
- Canonical exemplars:
  - `diagram-lab/output/svelte-lecture-02/diagrams/26.html` (Vertical flow: `PARENT` ➔ intermediate layers ➔ `DEEP CHILD` with bypass arc).
  - `diagram-lab/output/svelte-lecture-02/html-image-neobrutalism/38.html` (Horizontal flow: `REACTIVE STATE` ➔ `$state.snapshot()` bridge ➔ `INERT SNAPSHOT`, with failure vs success branches).
- Design authority: `diagram-lab/output/svelte-lecture-02/img-instruction/005.md`.

---

## Standard Dimensions & Canvas Structure

- **Print & Viewport Dimensions:** `@page { size: 860px 580px; margin: 0; }` and `body { width: 860px; height: 580px; background: #faf7f0; display: flex; align-items: center; justify-content: center; }`.
- **The Diagram Card (`.dg-card`):** Centered card `740px × 470px` (or `720px × 460px`) with `border: 4px solid #000; background: #faf7f0; position: relative; padding: 38px 28px 22px;`.
- **Top-Left Caption Pill (`.caption-pill`):** `position: absolute; top: -14px; left: 16px; background: #000; color: #fff; padding: 3px 12px; font-size: 8pt; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; border: 2px solid #000;`.
- **Typography:** `font-family: 'JetBrains Mono', Menlo, Monaco, monospace;` for all code and labels, bold weights throughout.

---

## The Neo-Brutalist Design System

1. **Strict Complexity Budget (Max 4 Elements):** A diagram depicts ONE idea, not a whole lecture. If it requires more than 4 distinct elements, the concept is overloaded—strip the secondary details.
2. **Palette:**
   - Background: Warm off-white paper (`#faf7f0`).
   - Outlines & Text: Solid black (`#000000`), `4px solid #000` for cards, `2px` for nested boxes.
   - Drop Shadows: Hard offset shadows down and to the right with zero blur (`box-shadow: 4px 4px 0 0 #000`).
   - Primary Focal Accent: Muted mustard-yellow (`#facc15`), reserved for the ONE key focal element (e.g. the snapshot result or the setter/getter).
   - Supporting Accents: Bold orange (`#f97316`) for transformational vectors/arrows; muted red (`#b91c1c` / `#fff1f2`) for failure states; muted green (`#15803d` / `#f0fdf4`) for successful execution.
3. **Micro-Labels:** Black pill badges straddling container edges (`position: absolute; top: -11px; left: 10px; background: #000; color: #fff; padding: 2px 7px; font-size: 6.5pt; font-weight: 900; text-transform: uppercase; border: 2px solid #000;`).
4. **Clean Code & Payloads:** Internal data payloads sit in nested white or tinted boxes with `2px solid #000` (or `2px dashed #000` for proxied/virtual boundaries).

---

## Approved Layout Archetypes (Pick Exactly One)

1. **Linear Transformation Pipeline (e.g. Card 38):**
   - Left: Source input card (`REACTIVE STATE`).
   - Center: Bold arrow bridge representing the operation (`$state.snapshot(draft)`).
   - Right: Focal mustard-yellow output card (`INERT SNAPSHOT`).
   - Bottom: Two outcome boxes contrasting naive failure (`× structuredClone(draft)`) against safe execution (`✓ structuredClone(raw)`).
2. **Vertical Layer Bypass / Teleportation (e.g. Card 26):**
   - Top: Root setter component (`PARENT` badged `#facc15`).
   - Middle: Faded, dashed intermediate components that do not touch the data.
   - Bottom: Deep consumer component (`DEEP CHILD` badged `#facc15`).
   - Arc: Curved SVG orange arrow arcing around the middle stack (`bypass props`).
3. **Side-by-Side Comparison (A vs B, e.g. Card 01):**
   - Two equal-height cards side-by-side separated by a `vs.` divider, contrasting legacy/naive syntax against modern Svelte 5 mechanics.
4. **Single Hero Definition (e.g. Card 21):**
   - One bold mustard-yellow card on the left feeding into multiple call-site pills on the right.

---

## HTML Skeleton Template

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Lecture NN — Concept Title</title>
  <style>
    @page { size: 860px 580px; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 860px; height: 580px; background: #faf7f0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', Menlo, Monaco, monospace; -webkit-font-smoothing: antialiased; overflow: hidden; }
    .dg-card { width: 740px; height: 470px; background: #faf7f0; border: 4px solid #000; position: relative; padding: 38px 28px 22px; display: flex; flex-direction: column; justify-content: space-between; }
    .caption-pill { position: absolute; top: -14px; left: 16px; background: #000; color: #fff; padding: 3px 12px; font-size: 8pt; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; border: 2px solid #000; }
    .flow-row { display: flex; align-items: center; justify-content: space-between; position: relative; }
    .card-box { width: 256px; border: 4px solid #000; background: #fff; padding: 14px 14px 12px; box-shadow: 4px 4px 0 0 #000; position: relative; }
    .card-box.focal { background: #facc15; }
    .micro-pill { position: absolute; top: -11px; left: 10px; background: #000; color: #fff; padding: 2px 7px; font-size: 6.5pt; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; border: 2px solid #000; }
    .inner-data { margin-top: 8px; border: 2px solid #000; background: #fff; padding: 8px 10px; font-size: 7.5pt; font-weight: 700; line-height: 1.45; }
    .footer-pill { align-self: center; background: #fff; border: 2px solid #000; padding: 6px 14px; font-size: 7.5pt; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; box-shadow: 3px 3px 0 0 #000; }
  </style>
</head>
<body>
  <div class="dg-card">
    <div class="caption-pill">KEY CONCEPT METAPHOR</div>
    <!-- Diagram content here (max 4 elements) -->
    <div class="footer-pill">CORE ARCHITECTURAL TAKEAWAY IN ONE LINE</div>
  </div>
</body>
</html>
```
