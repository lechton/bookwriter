## 2 — Component: .env-hatch
@tags Environment, Texture

**Use.** Diagonal stripes on the diagram panel. Reads as a road, a workbench, a construction site — use when the metaphor has a physical surface (streets, factories, workshops).

```html
<div class="dg env-hatch"> … </div>
```

<div class="dg env-hatch" style="display:flex; align-items:center; gap:8px; padding:36px 14px 18px; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Environment · Hatch</span>
<div class="bldg" style="flex:1;"><div class="bldg-name">Parent</div></div>
<div class="wire head"><span class="wire-tag">bind:</span></div>
<div class="bldg" style="flex:1;"><div class="bldg-name">Child</div></div>
</div>

> **Note.** Stronger personality than dots; pair with solid (never dashed) content boxes so the stripes do not fight the content.
