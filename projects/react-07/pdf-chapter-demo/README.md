# pdf-chapter-demo (React 07)

A small standalone experiment that recreates the Lecture 17 chapter spread
(Batching & Updater Functions) as a self-contained HTML + CSS template, so the
visual rhythm of the lecture book can be inspected without running the full
pipeline.

## Files

- [index.html](index.html) — the chapter page markup (banner, callout, four
  concept cards, page numbers).
- [styles.css](styles.css) — teal banner, peach callout, slate code blocks,
  black card footer, two centered card columns.
- [_shots/render.png](_shots/render.png) — Chrome-headless render of the page
  for visual review.

## Render it locally

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --hide-scrollbars --no-sandbox \
  --virtual-time-budget=5000 --force-device-scale-factor=2 \
  --window-size=880,1220 --screenshot=_shots/render.png file://$(pwd)/index.html
```

## Layout anatomy (matches the reference image)

1. Teal banner spans the full page width and contains both registers:
   - a flush-left parallelogram `LECTURE 17` badge (slanted right edge) next to
     the two-line serif chapter title,
   - the peach interview-question callout nested inside the banner, with the
     darker `INTERVIEW QUESTION | > CORE` tab stacked above the bold serif
     question.
2. Below the banner, two independent card columns on cream paper, each column
   vertically centering its own stack: 01 EVENT HANDLERS and 02 STATE &amp;
   SETTERS on the left, 04 FIXED SNAPSHOTS and 05 RENDER PURITY on the right.
3. Card heads pair a heavy numeral with a slanted slash (teal on 01/05, peach
   on 02/04), an uppercase sans title, an italic serif lecture reference, and
   an outline icon (monitor, sliders, camera, shield-check).
4. Slate code blocks on cards 01 and 02 use night-owl-style tokens: pink tags
   and `const`, light-blue attributes and bindings, green `handleClick`,
   orange `0`.
5. Card 02 ends with a black footer slab carrying the numbered `tickets` /
   `setTickets` list in white, with mono term chips.
6. Key phrases in cards 04 and 05 carry a peach inline highlight
   (`tickets`, `snapshot`, `pure`).
7. Serif page numbers 114 (left) and 115 (right) sit at the foot of the page.
