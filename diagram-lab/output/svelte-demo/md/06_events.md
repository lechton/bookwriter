## 6 — Standard Events
@tags Event Handling

**Q. How do you attach an event listener to a DOM element in Svelte 5?**

**Answer.** When you want to trigger a function when a user clicks a button, you used to need Svelte-specific syntax like `on:click`. Now, you use standard HTML event attributes like `onclick` and pass in a normal JavaScript function, making your code immediately readable to anyone who knows plain JavaScript.

```svelte title="Button.svelte"
<script>
  function handleClick(e) {
    e.preventDefault();
    console.log("Clicked!");
  }
</script>

<button onclick={handleClick}>
  Click Me
</button>
```

<div class="dg" style="display:flex; justify-content:center; gap:20px; padding:30px 10px; background:repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #fff 10px, #fff 20px);">
  <div style="flex:1; border:4px solid #000; padding:30px 10px; background:#e5e7eb; position:relative; display:flex; flex-direction:column; align-items:center; opacity:0.6;">
    <span style="position:absolute; top:-12px; background:#000; color:#fff; font-size:7pt; font-weight:800; padding:2px 8px; text-transform:uppercase; border:2px solid #000;">The Old Way</span>
    <div style="font-size:18pt; font-family:monospace; font-weight:bold; text-decoration:line-through; color:#6b7280; text-decoration-color:#ef4444; text-decoration-thickness:4px;">on:click</div>
    <div style="font-size:8pt; font-weight:bold; color:#9ca3af; margin-top:8px;">|preventDefault</div>
  </div>
  <div style="flex:1; border:4px solid #000; padding:30px 10px; background:#f0fdf4; position:relative; display:flex; flex-direction:column; align-items:center; box-shadow:6px 6px 0 0 #000;">
    <span style="position:absolute; top:-12px; background:#4ade80; color:#000; font-size:7pt; font-weight:800; padding:2px 8px; text-transform:uppercase; border:2px solid #000; box-shadow: 2px 2px 0 0 #000;">Svelte 5</span>
    <div style="font-size:22pt; font-family:monospace; font-weight:bold; color:#000;">onclick</div>
    <div style="font-size:7.5pt; font-weight:bold; color:#166534; background:#fff; border:2px solid #000; padding:4px 6px; transform:rotate(-4deg); margin-top:8px;">Standard JS Event Object</div>
  </div>
</div>

> **Summary.** Svelte 5 drops the custom `on:` syntax in favor of plain old **onclick**. This simplifies things because you stop learning framework-specific magic. You just use standard, predictable JavaScript to handle events. This makes your code portable and easy to read.
