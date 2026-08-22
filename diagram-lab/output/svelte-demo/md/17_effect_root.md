## 17 — Manual Reactivity: $effect.root
@tags Advanced, Lifecycle

**Q. How do you use reactivity like $effect outside of a component lifecycle (e.g., in a global store) without causing memory leaks?**

**Answer.** Normally, effects live inside components so Svelte can automatically destroy them when the component unmounts. But if you create global state in a plain `.js` file and want an effect there (e.g., to auto-save to `localStorage`), Svelte blocks it to prevent memory leaks. You wrap it in `$effect.root`, which hands you a manual cleanup function to run when you're done.

```svelte title="logger.js"
import { $effect } from 'svelte';

export function createGlobalLogger(stateValue) {
  // Returns a manual cleanup function
  const cleanup = $effect.root(() => {
    
    $effect(() => {
      console.log("State changed:", stateValue());
    });

  });

  return cleanup;
}
```

<div class="dg" style="padding:40px 20px; background:repeating-linear-gradient(45deg, #fff, #fff 10px, #f4f4f5 10px, #f4f4f5 20px); border:6px solid #000; position:relative; display:flex; justify-content:center; align-items:center; gap:24px;">
  
  <div style="border:4px solid #000; background:#fff; box-shadow:6px 6px 0 0 #000; padding:20px; width:45%; text-align:center;">
    <div style="background:#000; color:#fff; font-weight:bold; padding:4px 8px; margin-bottom:16px;">Component.svelte</div>
    <div style="border:3px solid #000; background:#3b82f6; color:#fff; font-weight:bold; padding:12px; border-radius:50px;">$effect</div>
    <div style="margin-top:16px; font-family:monospace; font-weight:bold;">Auto Cleanup 🗑️</div>
  </div>

  <div style="border:4px solid #000; background:#fff; box-shadow:6px 6px 0 0 #000; padding:20px; width:45%; text-align:center; position:relative;">
    <div style="background:#ef4444; color:#fff; font-weight:bold; padding:4px 8px; margin-bottom:16px; border:2px solid #000;">store.js (Global)</div>
    <div style="border:4px dashed #000; padding:16px; position:relative;">
      <div style="position:absolute; top:-14px; left:50%; transform:translateX(-50%); background:#fef08a; border:2px solid #000; padding:2px 8px; font-family:monospace; font-weight:bold; font-size:10px;">$effect.root</div>
      <div style="border:3px solid #000; background:#3b82f6; color:#fff; font-weight:bold; padding:12px; border-radius:50px;">$effect</div>
    </div>
    <div style="margin-top:16px; font-family:monospace; font-weight:bold;">Manual Cleanup ✋</div>
  </div>

</div>

> **Summary.** Normal effects die when their component unmounts. This is crucial because `$effect.root` lets you safely build global state managers or listeners in plain JavaScript files. It hands you the exact cleanup function you need to prevent memory leaks.
