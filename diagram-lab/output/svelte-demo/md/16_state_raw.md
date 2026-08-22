## 16 — Shallow State: $state.raw
@tags Performance, Reactivity

**Q. How would you handle a massive array of 10,000 data points in Svelte 5 without causing severe memory and performance overhead?**

**Answer.** Normally, `$state` builds a heavy 'proxy' around every single nested property of an object to track microscopic changes. But if you have 10,000 data points for a financial chart, that tracking overhead will freeze the browser. You use `$state.raw` to completely skip deep tracking, guaranteeing blazing fast renders as long as you swap the whole array out at once.

```svelte title="ChartData.svelte"
<script>
  // Perfect for thousands of data points
  let data = $state.raw([
    { x: 1, y: 10 },
    { x: 2, y: 15 }
  ]);

  function loadNewData(newData) {
    // You MUST replace the whole array.
    // data.push() will not trigger updates.
    data = newData;
  }
</script>
```

<div class="dg" style="padding:40px 20px; background:#f4f4f5; border:6px solid #000; position:relative; display:flex; justify-content:center; align-items:center; gap:40px;">
  <div style="border:4px solid #000; background:#fff; padding:20px; box-shadow:6px 6px 0 0 #000; flex:1; position:relative;">
    <div style="position:absolute; top:-12px; left:-12px; background:#ef4444; color:#fff; font-weight:900; padding:4px 12px; border:2px solid #000;">$state</div>
    <div style="font-family:monospace; font-weight:bold; margin-bottom:12px;">DEEP PROXY</div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <div style="border:2px dashed #000; background:#fef08a; padding:8px;">Object 1 (Tracked)</div>
      <div style="border:2px dashed #000; background:#fef08a; padding:8px;">Object 2 (Tracked)</div>
      <div style="border:2px dashed #000; background:#fef08a; padding:8px;">Object 3 (Tracked)</div>
    </div>
  </div>

  <span style="font-size:24pt; font-weight:900;">VS</span>

  <div style="border:4px solid #000; background:#fff; padding:20px; box-shadow:6px 6px 0 0 #000; flex:1; position:relative;">
    <div style="position:absolute; top:-12px; right:-12px; background:#22c55e; color:#fff; font-weight:900; padding:4px 12px; border:2px solid #000;">$state.raw</div>
    <div style="font-family:monospace; font-weight:bold; margin-bottom:12px;">SHALLOW</div>
    <div style="display:flex; flex-direction:column; gap:8px; border:4px solid #fef08a; padding:8px;">
      <div style="background:#e5e7eb; padding:8px; border:1px solid #9ca3af;">Object 1 (Ignored)</div>
      <div style="background:#e5e7eb; padding:8px; border:1px solid #9ca3af;">Object 2 (Ignored)</div>
      <div style="background:#e5e7eb; padding:8px; border:1px solid #9ca3af;">Object 3 (Ignored)</div>
    </div>
  </div>
</div>

> **Summary.** Deep reactivity is expensive on massive datasets. This matters because `$state.raw` lets you opt out of that overhead. You get blazing fast renders for large lists as long as you swap the whole array instead of mutating individual items.
