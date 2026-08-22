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

<div class="dg" style="display:flex; flex-direction:column; align-items:center; gap:8px; padding:36px 14px 18px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">The Live Feed</span>
<div style="border:3px solid #000; background:#fef08a; padding:8px 18px; font-family:var(--mono); font-weight:800; font-size:10pt; box-shadow:4px 4px 0 0 #000; text-align:center; position:relative;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px; text-transform:uppercase;">the wire · one source</span>
let count = $state(0)
</div>
<div style="display:flex; justify-content:center; gap:64px; width:100%;">
<span style="font-size:18pt; font-weight:900; line-height:1;">↓</span>
<span style="font-size:18pt; font-weight:900; line-height:1;">↓</span>
</div>
<div style="display:flex; justify-content:center; gap:16px; width:100%;">
<div style="border:3px solid #000; background:#bfdbfe; padding:8px 14px; text-align:center; box-shadow:4px 4px 0 0 #000;">
<b style="font-family:var(--mono); font-size:9pt;">&lt;h1&gt;{count}&lt;/h1&gt;</b><br/>
<span style="font-size:6.5pt; font-weight:800; color:#1d4ed8; text-transform:uppercase;">subscriber · re-renders</span>
</div>
<div style="border:3px solid #000; background:#bfdbfe; padding:8px 14px; text-align:center; box-shadow:4px 4px 0 0 #000;">
<b style="font-family:var(--mono); font-size:9pt;">&lt;button&gt;{count}&lt;/button&gt;</b><br/>
<span style="font-size:6.5pt; font-weight:800; color:#1d4ed8; text-transform:uppercase;">subscriber · re-renders</span>
</div>
</div>
<span style="font-size:6.5pt; font-weight:800; text-transform:uppercase; background:#000; color:#fef08a; padding:2px 8px; margin-top:4px;">one update · every subscriber re-renders</span>
</div>

> **Summary.** A plain `let` is a dead wire: change it and the page never hears about it. `$state` makes the wire live, so every change is delivered to the screen and you never touch the DOM by hand again.
