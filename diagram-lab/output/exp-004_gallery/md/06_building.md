## 6 — Component: .bldg
@tags Object, Instance

**Use.** A building unit with lit windows: a component instance, an object, anything that gets constructed and can be demolished. Pair with `.ghost` + `.strike` for the destroyed version — the wrecking-ball move.

```html
<div class="bldg"><div class="bldg-name">ArticleView</div><div class="bldg-wins"><div class="bldg-win"></div><div class="bldg-win"></div></div><div class="bldg-sub">draft inside</div></div>
```

<div class="dg env-hatch" style="display:flex; align-items:center; gap:8px; padding:36px 14px 18px; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Object · Building</span>
<div class="bldg ghost" style="flex:1;"><div class="bldg-name strike">ArticleView</div><div class="bldg-sub">demolished</div></div>
<div class="wire head"><span class="wire-tag red">teardown</span></div>
<div class="bldg" style="flex:1;"><div class="bldg-name">ArticleView</div><div class="bldg-wins"><div class="bldg-win"></div><div class="bldg-win"></div><div class="bldg-win"></div></div><div class="bldg-sub">fresh instance</div></div>
</div>

> **Note.** Lit windows = live state inside. A demolished building with dark windows needs no extra caption.
