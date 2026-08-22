## 10 — Component: .watermark
@tags Device, Atmosphere

**Use.** A giant faded glyph behind the content: `{ }` for scopes, `λ` for functions, a rune for its own card. Adds depth and personality at zero cost to clarity. Parent panel needs `position:relative`.

```html
<div class="dg" style="position:relative;"><span class="watermark">{ }</span> … </div>
```

<div class="dg env-blueprint" style="display:flex; align-items:center; justify-content:center; padding:44px 14px 22px; border:4px solid #000; position:relative; overflow:hidden;">
<span style="position:absolute; top:6px; left:10px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase; z-index:2;">Device · Watermark</span>
<span class="watermark">{ }</span>
<div class="bldg" style="z-index:2;"><div class="bldg-name">class Reporter</div><div class="bldg-sub">the blueprint</div></div>
</div>

> **Note.** Keep opacity near 0.07: visible on screen, a whisper in print. Always behind the content, never beside it.
