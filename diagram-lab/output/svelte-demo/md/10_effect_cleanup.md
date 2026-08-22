## 10 — Teardown: Effect Cleanup
@tags Lifecycle

**Q. How do you prevent memory leaks from timers or subscriptions created inside an $effect?**

**Answer.** If you start a `setInterval` timer inside a component to build a stopwatch, that timer will keep firing forever—even if the user navigates to a totally different page, severely lagging the browser. You return a cleanup function from within the `$effect` block, guaranteeing the timer is destroyed the second the component leaves the screen.

```svelte title="Timer.svelte"
<script>
  $effect(() => {
    const timer = setInterval(() => console.log('tick'), 1000);

    // Return a function to clean up
    return () => clearInterval(timer);
  });
</script>
```

<div class="dg" style="border-color:#000; padding:30px 20px; background:#faf5ff; display:flex; flex-direction:column; gap:12px; align-items:center;">
  <div style="border:3px solid #000; background:#fff; padding:12px; text-align:center; width:80%; position:relative; box-shadow:4px 4px 0 0 #000;">
    <div style="width:24px; height:24px; background:#000; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:10pt; position:absolute; top:-12px; left:50%; transform:translateX(-50%); border:2px solid #fff;">1</div>
    <span style="font-weight:800; font-size:9pt; display:block; margin:8px 0 4px;">Effect Runs</span>
    <span style="font-size:7pt; color:#6b21a8; background:#f3e8ff; padding:2px 4px; font-weight:bold; border:1px solid #d8b4fe;">Timer starts</span>
  </div>
  <span style="font-size:18pt; font-weight:900; line-height:1;">↓</span>
  <div style="border:3px solid #000; background:#fff; padding:12px; text-align:center; width:80%; position:relative; box-shadow:4px 4px 0 0 #000;">
    <div style="width:24px; height:24px; background:#000; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:10pt; position:absolute; top:-12px; left:50%; transform:translateX(-50%); border:2px solid #fff;">2</div>
    <span style="font-weight:800; font-size:9pt; display:block; margin:8px 0 4px;">State Changes</span>
    <span style="font-size:7pt; color:#4b5563; background:#f3f4f6; padding:2px 4px; font-weight:bold; border:1px solid #d1d5db;">(or unmount)</span>
  </div>
  <span style="font-size:18pt; font-weight:900; line-height:1;">↓</span>
  <div style="border:3px solid #000; background:#e9d5ff; padding:12px; text-align:center; width:80%; position:relative; box-shadow:4px 4px 0 0 #000;">
    <div style="width:24px; height:24px; background:#000; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:10pt; position:absolute; top:-12px; left:50%; transform:translateX(-50%); border:2px solid #fff;">3</div>
    <span style="font-weight:800; font-size:9pt; display:block; margin:8px 0 4px;">Cleanup Runs</span>
    <span style="font-size:7pt; color:#b91c1c; background:#fee2e2; padding:2px 4px; font-weight:bold; border:1px solid #fca5a5;">Timer stops</span>
  </div>
</div>

> **Summary.** Return a function from your **$effect** to clean up tasks. This is important because it guarantees that existing timers or data subscriptions are safely destroyed when the component unmounts. This prevents massive memory leaks with zero extra boilerplate.
