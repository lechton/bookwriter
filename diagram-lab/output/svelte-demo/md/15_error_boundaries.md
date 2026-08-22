## 15 — Error Boundaries
@tags Architecture, Safety

**Q. How do you catch fatal JavaScript errors thrown by a child component and display a fallback UI instead of crashing the app?**

**Answer.** If you fetch data for a weather widget and the third-party API returns malformed garbage, the resulting JavaScript error will instantly white-screen your entire application. You wrap the widget inside a `<svelte:boundary>` tag, catching the localized error and displaying a safe fallback UI so the rest of the app stays alive.

```svelte title="App.svelte"
<script>
  import RiskyWidget from './RiskyWidget.svelte';
</script>

<svelte:boundary>
  <RiskyWidget />
  
  <!-- Fallback UI if RiskyWidget throws an error -->
  {#snippet failed(error, reset)}
    <p>Crash: {error.message}</p>
    <button onclick={reset}>Retry</button>
  {/snippet}
</svelte:boundary>
```

<div class="dg" style="padding:40px; background:#fff; border:4px solid #000; position:relative; overflow:hidden; display:flex; justify-content:center; align-items:center;">
  
  <!-- Outer App -->
  <div style="position:absolute; top:10px; left:10px; font-weight:900; font-size:14pt; color:#d1d5db; text-transform:uppercase;">Safe App Zone</div>
  
  <!-- The Boundary -->
  <div style="border:6px dashed #ef4444; background:#fef2f2; padding:32px; position:relative; display:flex; flex-direction:column; align-items:center; z-index:2; box-shadow:0 0 0 100px rgba(255,255,255,0.8);">
    <span style="position:absolute; top:-16px; background:#ef4444; color:#fff; font-weight:900; padding:4px 12px; text-transform:uppercase; letter-spacing:0.1em; border:2px solid #000; font-size:8pt;">&lt;svelte:boundary&gt;</span>
    
    <span style="font-size:32pt; margin-bottom:8px;">💥</span>
    <span style="font-weight:900; color:#991b1b; text-transform:uppercase; font-size:10pt; text-align:center;">
      Fatal Error<br/>Contained
    </span>
  </div>
</div>

> **Summary.** Svelte 5 introduces the **`<svelte:boundary>`** wrapper. This is a lifesaver because it catches fatal JavaScript errors inside child components and displays a clean fallback UI instead. This guarantees that one bad widget never crashes your entire app again.
