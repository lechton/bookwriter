## 3 — Side Effects: $effect
@tags Lifecycle & Tracking

**Q. How do you synchronize an external system (like a canvas or local storage) with your internal reactive state?**

**Answer.** If you need to draw on an HTML `<canvas>` or save a user's theme preference to `localStorage` every time they click a button, plain Svelte variables can't reach those outside APIs automatically. You use the `$effect` rune to run a side effect that automatically tracks its dependencies and runs exactly when needed.

```svelte title="App.svelte"
<script>
  let canvas = $state();

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Runs automatically after DOM updates
    // whenever 'canvas' changes.
  });
</script>
```

<div class="dg">
  <div class="stack">
    <div class="box bg-yellow"><span class="box-title">Trigger</span><b>$state() updates</b></div>
    <div class="arrow-down"></div>
    <div class="box bg-gray"><span class="box-title">Wait</span><b>DOM Renders</b></div>
    <div class="arrow-down"></div>
    <div class="box bg-pink"><span class="box-title">Action</span><b>$effect()</b><i>Interacts with outside world</i></div>
  </div>
</div>

> **Summary.** **$effect** is your bridge to the outside world. This is essential because it automatically tracks the variables you use inside it. This guarantees that things like analytics, local storage, or canvas drawings always stay perfectly synced with your state.
