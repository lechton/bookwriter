## 4 — Component Inputs: $props
@tags Component Communication

**Q. How do you accept inputs from a parent component while maintaining type safety and reactivity?**

**Answer.** When building a reusable `<Button>` component, you need a way to pass in text and colors from the parent. You use the `$props` rune to securely accept that data. Destructuring it immediately gives you clean, type-safe variables that stay reactive if the parent changes them.

```svelte title="Parent.svelte"
<script>
  import Child from './Child.svelte';
</script>

<Child title="Hello Svelte!" />
```

```svelte title="Child.svelte"
<script>
  let { title } = $props();
</script>

<h1>{title}</h1>
```

<div class="dg" style="display:flex; justify-content:center; align-items:center; gap:20px; padding:40px 20px; background-image: radial-gradient(#000 1px, transparent 1px); background-size: 16px 16px;">
  <span style="position:absolute; top:-12px; left:20px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Data Flow Diagram</span>
  <div class="box bg-yellow" style="box-shadow: 6px 6px 0px 0px #000; font-size: 14pt;"><b>Parent.svelte</b></div>
  <div style="display:flex; flex-direction:column; align-items:center; z-index:2; background:#fff; border: 2px solid #000; padding: 4px 8px;">
    <span style="font-size:7pt; font-weight:800; text-transform:uppercase;">Passes "title"</span>
    <span style="font-size:18pt; font-weight:900; line-height:1;">→</span>
  </div>
  <div class="box bg-blue" style="box-shadow: 6px 6px 0px 0px #000; font-size: 14pt;"><b>Child.svelte</b></div>
</div>

> **Summary.** You now receive data from parent components using the **$props** rune. This is great because destructuring it immediately gives you clean, type-safe inputs. It also totally separates your component's internal state from the outside world.
