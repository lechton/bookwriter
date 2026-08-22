## 13 — Pre-rendering Effects
@tags Lifecycle, DOM

**Q. How do you read layout dimensions or scroll positions immediately before the browser repaints the screen?**

**Answer.** If you are building an auto-scrolling chat app, reading the scroll height during a normal `$effect` happens *after* the UI updates, causing a jarring visual flicker. You use the `$effect.pre` rune to measure layouts exactly a split-second *before* the browser repaints, allowing you to create butter-smooth UI adjustments.

```svelte title="Scroll.svelte"
<script>
  let height = $state(0);

  $effect.pre(() => {
    // Runs BEFORE the DOM updates
    console.log("Old height:", document.body.scrollHeight);
  });
</script>
```

<div class="dg" style="display:flex; background:#f9fafb; padding:40px 20px; border:4px solid #000; position:relative;">
  <!-- Timeline Line -->
  <div style="position:absolute; left:50%; top:20px; bottom:20px; width:4px; background:#000; transform:translateX(-50%);"></div>
  
  <div style="display:flex; flex-direction:column; width:100%; gap:32px; z-index:2;">
    <!-- Step 1 -->
    <div style="display:flex; justify-content:flex-start; width:100%;">
      <div style="border:3px solid #000; background:#fef08a; padding:12px; width:45%; box-shadow:4px 4px 0 0 #000; position:relative;">
        <span style="position:absolute; right:-24px; top:50%; transform:translateY(-50%); font-size:16pt; font-weight:900; line-height:1;">→</span>
        <span style="font-weight:800; font-size:9pt; text-transform:uppercase;">1. $effect.pre</span>
        <div style="font-family:monospace; font-size:8pt; margin-top:4px;">Measures old layout</div>
      </div>
    </div>
    <!-- Step 2 -->
    <div style="display:flex; justify-content:center; width:100%;">
      <div style="border:4px dashed #000; background:#fff; padding:8px 24px; font-weight:bold; text-transform:uppercase; font-size:10pt;">
        DOM Updates
      </div>
    </div>
    <!-- Step 3 -->
    <div style="display:flex; justify-content:flex-end; width:100%;">
      <div style="border:3px solid #000; background:#bbf7d0; padding:12px; width:45%; box-shadow:4px 4px 0 0 #000; position:relative;">
        <span style="position:absolute; left:-24px; top:50%; transform:translateY(-50%) rotate(180deg); font-size:16pt; font-weight:900; line-height:1;">→</span>
        <span style="font-weight:800; font-size:9pt; text-transform:uppercase;">2. $effect</span>
        <div style="font-family:monospace; font-size:8pt; margin-top:4px;">Sees new layout</div>
      </div>
    </div>
  </div>
</div>

> **Summary.** **$effect.pre** fires right *before* the browser repaints the screen. This is critical because it lets you measure layouts or save scroll positions right before a UI shift happens. This allows you to create perfectly smooth animations and transitions.
