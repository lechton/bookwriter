## 11 — Component: .ghost
@tags Device, Absence

**Use.** A dead, destroyed, or ignored element: dashed gray border, no shadow, washed content. Pair with `.strike` on its name. This is how a diagram shows what did NOT happen — the crossed-out expectation.

```html
<div class="bldg ghost"><div class="bldg-name strike">old value</div></div>
```

<div class="dg" style="display:flex; flex-direction:column; gap:12px; padding:36px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Device · Ghost</span>
<div class="lane"><span class="lane-label bad">what you expected</span>
<div class="bldg ghost"><div class="bldg-name strike">count destroyed</div><div class="bldg-sub">never happens</div></div>
</div>
<div class="lane"><span class="lane-label ok">what actually happens</span>
<div class="bldg"><div class="bldg-name">count retained</div><div class="bldg-sub">held by the closure</div></div>
</div>
</div>

> **Note.** Ghost plus lane-label is the violation genre in two lines: the wrong expectation gets a visible grave.
