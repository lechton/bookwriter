## 9 — Component: .badge
@tags Device, Sequence

**Use.** A numbered circle pinned to a step: chronological flows, lifecycle stages, pipelines. The number does the ordering so the layout can relax.

```html
<div style="position:relative;"><span class="badge" style="position:absolute; top:-11px; left:50%; transform:translateX(-50%);">1</span> … </div>
```

<div class="dg" style="display:flex; flex-direction:column; align-items:center; gap:10px; padding:36px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Device · Badge</span>
<div class="bldg" style="width:70%; position:relative;"><span class="badge" style="position:absolute; top:-11px; left:50%; transform:translateX(-50%);">1</span><div class="bldg-name">effect runs</div><div class="bldg-sub">timer starts</div></div>
<div class="wire down head"></div>
<div class="bldg" style="width:70%; position:relative;"><span class="badge" style="position:absolute; top:-11px; left:50%; transform:translateX(-50%);">2</span><div class="bldg-name">state changes</div></div>
<div class="wire down head"></div>
<div class="bldg" style="width:70%; position:relative;"><span class="badge" style="position:absolute; top:-11px; left:50%; transform:translateX(-50%);">3</span><div class="bldg-name">cleanup runs</div><div class="bldg-sub">timer stops</div></div>
</div>

> **Note.** Overlap the badge onto the box border; the white ring keeps it readable over any background.
