## 14 — Component: .lane
@tags Device, Comparison

**Use.** A comparison row with a color-coded semantic label: `.ok` green (what works), `.bad` red (what fails), `.info` blue (the new way), `.mut` gray (the inactive way). Lanes are the skeleton of the violation and choice genres — identical chrome, one differing fate.

```html
<div class="lane"><span class="lane-label bad">without cleanup · timers pile up</span> … </div>
```

<div class="dg" style="display:flex; flex-direction:column; gap:12px; padding:36px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Device · Lane</span>
<div class="lane"><span class="lane-label bad">without cleanup · timers pile up</span>
<div style="display:flex; gap:6px;"><div class="bldg" style="flex:1;"><div class="bldg-name">timer 1</div></div><div class="bldg" style="flex:1;"><div class="bldg-name">timer 2</div></div><div class="bldg" style="flex:1;"><div class="bldg-name">timer 3</div></div></div>
</div>
<div class="lane"><span class="lane-label ok">with cleanup · one at a time</span>
<div style="display:flex; gap:6px;"><div class="bldg" style="flex:1;"><div class="bldg-name">timer 1</div></div><div class="bldg ghost" style="flex:1;"><div class="bldg-name strike">timer 2</div></div><div class="bldg ghost" style="flex:1;"><div class="bldg-name strike">timer 3</div></div></div>
</div>
</div>

> **Note.** The label carries the rule, the boxes carry the evidence. Color-code the labels, keep the boxes neutral.
