## 1 — Reactivity: $state
@tags State Management

**Q. How do you declare a variable that automatically updates the DOM when its value changes in Svelte 5?**

**Answer.** Normally, JavaScript variables are completely dead: changing a `let` variable does not update your UI. You use the `$state` rune to wrap your initial value, turning it into a live variable that Svelte tracks. Any time that value changes, Svelte instantly updates the DOM for you.

```svelte title="App.svelte"
<script>
  let count = $state(0);
  let user = $state({ name: 'Nikos' });

  function update() {
    count++;
    user.name = 'Hugo'; // Deeply reactive
  }
</script>
```

**Diagram concept.** Dead Wire vs Live Wire: a plain `let` is a dead wire, change it and nothing reaches the page; `$state` is a live wire, every change is delivered to the DOM.

<div class="dg env-dots" style="display:flex; flex-direction:column; gap:14px; padding:36px 14px 18px; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Dead Wire vs Live Wire</span>
<div class="lane">
<span class="lane-label mut">plain let · the dead wire</span>
<div style="display:flex; align-items:center; gap:8px;">
<div class="bldg" style="flex:1.4;"><div class="bldg-name">let count = 0</div></div>
<div class="wire dashed"><span class="wire-tag mut">lost</span></div>
<div class="bldg ghost" style="flex:1;"><div class="bldg-name strike">DOM: 0</div><div class="bldg-sub">never arrives</div></div>
</div>
</div>
<div class="lane">
<span class="lane-label ok">$state · the live wire</span>
<div style="display:flex; align-items:center; gap:8px;">
<div class="bldg" style="flex:1.4; background:#fef08a;"><div class="bldg-name" style="font-size:8pt; white-space:nowrap;">let count = $state(0)</div></div>
<div class="wire head"><span class="wire-tag yel">live</span></div>
<div class="bldg" style="flex:1; background:#bfdbfe;"><div class="bldg-name">DOM: {count}</div><div class="bldg-sub">always delivered</div></div>
</div>
</div>
</div>

> **Summary.** A plain `let` is a dead wire: change it and the page never hears about it. `$state` makes the wire live, so every change is delivered to the screen and you never touch the DOM by hand again.
