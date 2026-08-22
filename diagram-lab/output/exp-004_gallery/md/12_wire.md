## 12 — Component: .wire
@tags Device, Connector

**Use.** A connector with an inline label tag and an optional drawn arrowhead: every arrow in a scene is an operation, and the tag names it. `.head` adds the arrowhead, `.down` turns it vertical, `.dashed` makes it a dead or scheduled link. Tag variants: default black, `.red` (destructive), `.yel` (highlight), `.mut` (inactive).

```html
<div class="wire head"><span class="wire-tag">patch</span></div>
<div class="wire down head"></div>
```

<div class="dg" style="display:flex; flex-direction:column; gap:12px; padding:36px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Device · Wire</span>
<div style="display:flex; align-items:center; gap:8px;">
<div class="bldg" style="flex:1;"><div class="bldg-name">write</div></div>
<div class="wire head"><span class="wire-tag">delivers</span></div>
<div class="bldg" style="flex:1;"><div class="bldg-name">DOM</div></div>
</div>
<div style="display:flex; align-items:center; gap:8px;">
<div class="bldg" style="flex:1;"><div class="bldg-name">write</div></div>
<div class="wire dashed"><span class="wire-tag mut">lost</span></div>
<div class="bldg ghost" style="flex:1;"><div class="bldg-name strike">DOM</div></div>
</div>
</div>

> **Note.** The tag floats on the wire and interrupts it — the reader reads the operation while following the flow.
