## 5 — Component: .paper
@tags Object, Page

**Use.** A printed page or newspaper: masthead rule plus mono body. For anything printed, rendered, or published — DOM output, batched updates, editions. `.paper.old` (dashed, gray) is yesterday's edition: stale output, superseded values.

```html
<div class="paper"><div class="paper-mast">National Times</div><div class="paper-body">DOM: 5</div></div>
<div class="paper old">…</div>
```

<div class="dg" style="display:flex; gap:12px; padding:36px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Object · Paper</span>
<div class="paper old" style="flex:1;"><div class="paper-mast">yesterday</div><div class="paper-body">DOM: 4</div></div>
<div class="paper" style="flex:1;"><div class="paper-mast">special edition</div><div class="paper-body">DOM: 5</div></div>
</div>

> **Note.** Fresh vs old side by side is a ready-made staleness contrast — batching, caching, derived values.
