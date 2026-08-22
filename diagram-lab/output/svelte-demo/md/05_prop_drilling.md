## 5 — Avoiding Prop Drilling
@tags Architecture

**Q. How do you share reactive data across multiple unrelated components without prop drilling or third-party state managers?**

**Answer.** In the past, sharing a user's login status across 15 different components required messy prop-drilling or bulky external libraries like Redux. Now, you just export `$state` variables directly from a plain JavaScript file. Any component can import that file and share the exact same live data instantly.

```svelte title="store.svelte.js"
export const theme = $state({ dark: false });
```

```svelte title="DeepChild.svelte"
<script>
  import { theme } from './store.svelte.js';
</script>

<button onclick={() => theme.dark = true}>
  Dark Mode
</button>
```

<div class="dg" style="display:flex; justify-content:center; gap:16px; padding:30px 10px; background:#f9fafb;">
  <div style="flex:1; border:3px dashed #9ca3af; padding:24px 10px 16px; position:relative; display:flex; flex-direction:column; align-items:center; background:#fff;">
    <span style="position:absolute; top:-10px; background:#9ca3af; color:#fff; font-size:6pt; font-weight:800; padding:2px 6px; text-transform:uppercase;">The Old Way</span>
    <div class="code-inline" style="width:100%; text-align:center; padding:6px; background:#f3f4f6; color:#6b7280; border-color:#9ca3af;">App.svelte</div>
    <div style="height:12px; width:2px; background:#9ca3af; margin:4px 0;"></div>
    <div class="code-inline" style="width:100%; text-align:center; padding:6px; background:#f3f4f6; color:#6b7280; border-color:#9ca3af;">Layout.svelte</div>
    <div style="height:12px; width:2px; background:#9ca3af; margin:4px 0;"></div>
    <div class="code-inline" style="width:100%; text-align:center; padding:6px; background:#f3f4f6; color:#6b7280; border-color:#9ca3af;">DeepChild.svelte</div>
  </div>
  <div style="flex:1; border:4px solid #000; padding:24px 10px 16px; position:relative; display:flex; flex-direction:column; align-items:center; background:#f0fdf4;">
    <span style="position:absolute; top:-12px; background:#22c55e; color:#000; font-size:6.5pt; font-weight:800; padding:4px 8px; border:2px solid #000; text-transform:uppercase; box-shadow: 2px 2px 0 0 #000;">Universal State</span>
    <div class="box bg-yellow" style="width:100%; padding:8px; box-shadow: 4px 4px 0 0 #000; margin-bottom:12px;"><b>store.svelte.js</b></div>
    <div style="display:flex; flex-direction:column; align-items:center; z-index:2;">
      <span style="font-size:16pt; font-weight:900; line-height:1;">↓</span>
      <span style="font-size:6.5pt; font-weight:800; text-transform:uppercase; background:#fff; border:2px solid #000; padding:2px 4px; margin-top:-2px;">Direct Import</span>
    </div>
    <div class="box bg-blue" style="width:100%; padding:8px; box-shadow: 4px 4px 0 0 #000; margin-top:12px;"><b>DeepChild.svelte</b></div>
  </div>
</div>

> **Summary.** Svelte 5 introduces **universal reactivity**. This is useful because you can export `$state` directly from a plain JavaScript file. This lets any component across your entire app import and share live data instantly. It completely removes the need for messy prop drilling.
