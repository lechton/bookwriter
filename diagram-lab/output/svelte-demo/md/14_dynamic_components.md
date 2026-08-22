## 14 — Dynamic Components
@tags Architecture, Routing

**Q. How do you render a component dynamically based on a variable without using the verbose svelte:component tag?**

**Answer.** If you are building a dynamic dashboard where a user can choose to view a `<LineChart>` or a `<PieChart>`, you need to swap the UI out on the fly. Instead of writing massive `if/else` blocks, you assign the chosen component to a capitalized variable and render it directly as an HTML tag.

```svelte title="App.svelte"
<script>
  import Home from './Home.svelte';
  import About from './About.svelte';
  
  let Tag = $state(Home);
</script>

<!-- Renders whichever component is currently assigned -->
<Tag />
```

<div class="dg" style="display:flex; flex-direction:column; align-items:center; background:repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 11px); padding:40px 20px; border:4px solid #000;">
  
  <div style="border:4px solid #000; background:#fff; padding:12px 32px; font-family:monospace; font-weight:bold; font-size:18pt; box-shadow:6px 6px 0 0 #000; margin-bottom:24px;">
    &lt;<span style="color:#ef4444;">Tag</span> /&gt;
  </div>
  
  <div style="display:flex; gap:16px; align-items:center;">
    <div style="display:flex; flex-direction:column; align-items:center;">
      <span style="font-size:24pt; font-weight:900; transform:rotate(-135deg); margin-bottom:8px; line-height:1;">↓</span>
      <div style="border:3px dashed #3b82f6; background:#eff6ff; padding:8px; font-weight:bold; font-family:monospace; font-size:8pt;">Home</div>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center;">
      <span style="font-size:24pt; font-weight:900; margin-bottom:8px; line-height:1;">↓</span>
      <div style="border:3px dashed #10b981; background:#ecfdf5; padding:8px; font-weight:bold; font-family:monospace; font-size:8pt;">About</div>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center;">
      <span style="font-size:24pt; font-weight:900; transform:rotate(135deg); margin-bottom:8px; line-height:1;">↓</span>
      <div style="border:3px dashed #8b5cf6; background:#f5f3ff; padding:8px; font-weight:bold; font-family:monospace; font-size:8pt;">Profile</div>
    </div>
  </div>
</div>

> **Summary.** Svelte 5 removes the verbose `<svelte:component>` tag entirely. This is fantastic because you can now assign an imported component straight to a **capitalized variable**. You can render it directly, making dynamic routing cleaner and more native-feeling.
