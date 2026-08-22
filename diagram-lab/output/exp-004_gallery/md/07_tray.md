## 7 — Component: .tray
@tags Object, Queue

**Use.** A dashed inbox holding `.tray-item`s: pending writes, queued tasks, waiting subscribers. The queue makes "not yet processed" physically visible — the gap between write and apply.

```html
<div class="tray"><span class="tray-label">press queue</span><br/><span class="tray-item">claps = 5</span><span class="tray-item">title = …</span></div>
```

<div class="dg" style="display:flex; align-items:center; gap:8px; padding:36px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Object · Tray</span>
<div class="tray" style="flex:1;"><span class="tray-label">press queue</span><br/><span class="tray-item">claps = 5</span></div>
<div class="wire dashed"><span class="wire-tag mut">on schedule</span></div>
<div class="paper old" style="flex:1;"><div class="paper-mast">current edition</div><div class="paper-body">DOM: 4</div></div>
</div>

> **Note.** Items sitting in the tray while output stays stale is the whole story of batching — say it with placement, not paragraphs.
