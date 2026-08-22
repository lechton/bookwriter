## 3 — Component: .env-blueprint
@tags Environment, Texture

**Use.** A blue-tinted drafting grid. Signals plans, blueprints, templates, definitions — anything that stamps out instances (snippets, classes, component definitions).

```html
<div class="dg env-blueprint"> … </div>
```

<div class="dg env-blueprint" style="display:flex; flex-direction:column; align-items:center; gap:8px; padding:36px 14px 18px; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Environment · Blueprint</span>
<div style="border:4px dashed #3b82f6; background:#fff; padding:8px 20px; font-family:var(--mono); font-weight:800; font-size:11pt; color:#1d4ed8;">#snippet row</div>
<div class="wire down head"></div>
<div style="display:flex; gap:10px;">
<div class="bldg"><div class="bldg-name">{@render}</div><div class="bldg-sub">news</div></div>
<div class="bldg"><div class="bldg-name">{@render}</div><div class="bldg-sub">sports</div></div>
</div>
</div>

> **Note.** Dashed blue borders read as "the plan"; solid black boxes below read as "the built thing". Keep that contrast.
