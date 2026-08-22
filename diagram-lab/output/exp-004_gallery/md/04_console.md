## 4 — Component: .console
@tags Object, Terminal

**Use.** A developer terminal window: traffic-light bar, title, mono log lines with a highlighted entry. Grounds anything that reports, logs, or inspects ($inspect, console debugging, devtools). Print-safe light version of the dark `.terminal` in diagrams.css.

```html
<div class="console"><div class="console-bar"><div class="console-dot r"></div><div class="console-dot y"></div><div class="console-dot g"></div><span class="console-title">devtools</span></div><div class="console-body">…</div></div>
```

<div class="dg" style="padding:36px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Object · Console</span>
<div class="console">
<div class="console-bar"><div class="console-dot r"></div><div class="console-dot y"></div><div class="console-dot g"></div><span class="console-title">$inspect</span></div>
<div class="console-body">
<div class="console-msg">&gt; init</div>
<div class="console-log">claps: 0</div>
<div class="console-msg">&gt; update</div>
<div class="console-log console-hl">claps: 1</div>
</div>
</div>
</div>

> **Note.** Use `.console-hl` on the line that changed — the highlight is where the eye should land.
