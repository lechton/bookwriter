## 12 — Ignoring Changes: untrack
@tags Reactivity, Performance

**Q. How do you read a reactive variable inside an $effect without causing the effect to re-run when that variable changes?**

**Answer.** By default, Svelte automatically tracks every reactive variable you touch inside an `$effect`. If you want to use a variable's value (like sending a `sessionToken` inside a `fetch()` call) *without* letting its changes trigger the effect again, you must hide it from Svelte. You do this by passing a function into `untrack()`. It safely returns the current value, but completely blocks Svelte from tracking the dependency.

```svelte title="Analytics.svelte"
<script>
  import { untrack } from 'svelte';
  let actionCount = $state(0);
  let sessionToken = $state('xyz-987');

  $effect(() => {
    // 1. Read the token while Svelte is "blindfolded"
    // untrack() executes the function and returns its value, but blocks reactivity.
    const currentToken = untrack(() => sessionToken);

    // 2. Perform the action (this ONLY re-runs when actionCount changes)
    fetch('/api/log', {
      method: 'POST',
      body: JSON.stringify({ action: actionCount, token: currentToken })
    });
  });
</script>
```

<div class="dg" style="padding:40px 20px; background:#f4f4f5; border:6px solid #000; position:relative; display:flex; justify-content:center; align-items:center;">
  
  <div style="display:flex; flex-direction:column; gap:24px; z-index:2; width:100%;">
    <!-- Normal Var -->
    <div style="display:flex; align-items:center; justify-content:center; gap:16px;">
      <div style="border:3px solid #000; background:#fef08a; padding:8px 16px; font-family:monospace; font-weight:bold; box-shadow:4px 4px 0 0 #000;">actionCount</div>
      <span style="font-size:24pt; font-weight:900; color:#000; line-height:1;">→</span>
      <div style="border:3px solid #000; background:#ef4444; color:#fff; padding:8px 16px; font-weight:bold; box-shadow:4px 4px 0 0 #000; text-transform:uppercase;">Triggers Re-run</div>
    </div>
    <!-- Untracked Var -->
    <div style="display:flex; align-items:center; justify-content:center; gap:16px;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <div style="border:3px solid #000; background:#a8a29e; color:#000; padding:8px 16px; font-family:monospace; font-weight:bold; box-shadow:4px 4px 0 0 #000; border-style:dashed;">untrack(() => sessionToken)</div>
        <div style="font-size:12px; font-family:monospace; font-weight:bold; text-align:center;">Returns "xyz-987"</div>
      </div>
      <span style="font-size:24pt; font-weight:900; color:#000; line-height:1;">→</span>
      <div style="border:3px solid #000; background:#22c55e; color:#000; padding:8px 16px; font-weight:bold; box-shadow:4px 4px 0 0 #000; text-transform:uppercase;">Ignored by Svelte</div>
    </div>
  </div>
</div>

> **Summary.** `untrack()` lets you read a variable without Svelte watching it. This is essential because it gives you precise control. You can safely fetch data or log analytics using live variables without accidentally firing duplicate network requests every time those background variables update.
