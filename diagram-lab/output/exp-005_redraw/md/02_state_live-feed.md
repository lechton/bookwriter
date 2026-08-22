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

**Diagram concept.** The Live Feed: `$state` is the news wire desk, and every `{count}` in the markup is a subscriber; one update crosses the wire and every subscriber re-renders.

<div class="dg env-dots" style="display:flex; flex-direction:column; align-items:center; gap:8px; padding:36px 14px 18px; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">The Live Feed</span>
<div class="bldg" style="background:#fef08a; width:72%; position:relative;">
<span class="zone-label">the wire desk · one source</span>
<div class="bldg-name">let count = $state(0)</div>
</div>
<div style="display:flex; justify-content:center; gap:56px; width:100%;">
<div class="wire down head"></div>
<div class="wire down head"></div>
</div>
<div style="display:flex; justify-content:center; gap:12px; width:100%;">
<div class="bldg" style="flex:1; background:#bfdbfe;"><div class="bldg-name" style="font-size:8pt;">&lt;h1&gt;{count}&lt;/h1&gt;</div><div class="bldg-sub">subscriber · re-renders</div></div>
<div class="bldg" style="flex:1; background:#bfdbfe;"><div class="bldg-name" style="font-size:8pt;">&lt;button&gt;{count}&lt;/button&gt;</div><div class="bldg-sub">subscriber · re-renders</div></div>
</div>
<span class="stamp grn">live</span>
</div>

> **Summary.** A plain `let` is a dead wire: change it and the page never hears about it. `$state` makes the wire live, so every change is delivered to the screen and you never touch the DOM by hand again.
