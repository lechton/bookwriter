## 13 — Component: .zone
@tags Device, Region

**Use.** A named dashed region grouping elements: retained scope, error boundary, safe area, old way. Zones answer "where does this live?" — the fog genre's best friend.

```html
<div class="zone"><span class="zone-label">retained scope</span> … </div>
```

<div class="dg" style="padding:40px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Device · Zone</span>
<div class="bldg" style="text-align:left; margin-bottom:10px;"><div class="bldg-name">createCounter() · outer function</div></div>
<div class="zone" style="display:flex; align-items:center; gap:8px;">
<span class="zone-label">retained scope</span>
<div class="bldg" style="flex:1;"><div class="bldg-name">count = 0</div></div>
<div class="wire head"><span class="wire-tag">accesses</span></div>
<div class="bldg" style="flex:1; background:#fef08a;"><div class="bldg-name">count++</div></div>
</div>
</div>

> **Note.** The label sits on the zone's border, like a sign on a fence — the region reads as a place, not a rectangle.
