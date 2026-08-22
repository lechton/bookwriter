## 1 — Component: .env-dots
@tags Environment, Texture

**Use.** A dotted grid on the diagram panel. The quietest environment: adds depth without stealing focus. Good default for flow scenes (wires, feeds, pipelines).

```html
<div class="dg env-dots"> … </div>
```

<div class="dg env-dots" style="display:flex; flex-direction:column; align-items:center; gap:8px; padding:36px 14px 18px; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Environment · Dots</span>
<div class="bldg" style="width:60%;"><div class="bldg-name">content box</div><div class="bldg-sub">floats over the grid</div></div>
<div class="wire down head"></div>
<div class="bldg" style="width:60%;"><div class="bldg-name">content box</div></div>
</div>

> **Note.** Light enough to vanish on a monochrome printer while keeping the panel from looking empty.
