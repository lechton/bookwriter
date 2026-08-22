## 8 — Component: .stamp
@tags Device, Verdict

**Use.** A rotated tag for verdicts and emphasis: APPROVED, DEPRECATED, SURVIVED, RESET. The tilt makes it read as a physical stamp pressed onto the page — the card's verdict in one word.

```html
<span class="stamp red">deprecated</span>
```

<div class="dg" style="display:flex; align-items:center; justify-content:center; gap:18px; padding:40px 14px 22px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Device · Stamp</span>
<div class="bldg"><div class="bldg-name strike">on:click</div></div>
<span class="stamp red">deprecated</span>
<div class="bldg"><div class="bldg-name">onclick</div></div>
<span class="stamp grn">standard</span>
</div>

> **Note.** One stamp per scene, two at most. A third stamp turns the card into a passport page.
