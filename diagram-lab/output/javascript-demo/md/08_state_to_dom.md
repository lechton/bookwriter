## 8 — State to DOM: only the node that read the value re-runs
@tags Svelte, Runes, Fine-grained

**Q. In a button that renders {claps} claps, clicking it updates just the number and nothing else on the page. How?**

**Answer.** Because the `{claps}` text node is the effect. Reading `claps` inside the markup subscribes that one DOM node to the reactive value. Clicking writes `claps`, the write triggers, and Svelte re-runs only the nodes that read it — a single text update, not a re-render of the component.

**Why it works.** `$state(0)` is the reactive object from the previous step, handed to you as a rune. `{claps}` is the read that subscribes the text node. `claps++` is the write that triggers. So the dependent — and only the dependent — re-runs. Unlike a virtual-DOM framework, where a state change re-runs the whole component function and a diff decides what changed, Svelte tracks the dependency at the node and re-runs just that node.

```svelte title="routes/+page.svelte"
<script>
  let claps = $state(0);              // a reactive value — a signal
</script>

<button onclick={() => claps++}>       // writes claps (trigger half)
  {claps} claps                        // reads claps (this text node subscribes)
</button>
```

<div class="dg" style="display:flex; flex-direction:column; gap:12px; padding:32px 16px 20px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Two Ways to Update</span>
<div style="border:3px dashed #9ca3af; padding:12px; background:#f3f4f6;">
<div style="font-size:7pt; font-weight:800; text-transform:uppercase; background:#9ca3af; color:#fff; padding:2px 6px; display:inline-block; letter-spacing:0.08em;">virtual DOM</div>
<div style="font-family:var(--mono); font-weight:700; font-size:9pt; color:#4b5563; margin-top:8px; line-height:1.5;">
claps++ → re-run whole component → build new tree → diff vs old tree → patch
</div>
</div>
<div style="border:3px solid #000; padding:12px; background:#f0fdf4; box-shadow:4px 4px 0 0 #000;">
<div style="font-size:7pt; font-weight:800; text-transform:uppercase; background:#22c55e; color:#000; padding:2px 6px; display:inline-block; border:2px solid #000;">svelte · surgical</div>
<div style="display:flex; align-items:center; gap:8px; margin-top:10px;">
<div style="flex:1; border:2px solid #000; background:#fef08a; padding:6px 8px; font-family:var(--mono); font-weight:800; font-size:9pt; text-align:center;">$state(0)</div>
<span style="font-size:13pt; font-weight:900;">→</span>
<div style="flex:1; border:2px solid #000; background:#bfdbfe; padding:6px 8px; font-family:var(--mono); font-weight:800; font-size:9pt; text-align:center;">{claps} node</div>
</div>
<div style="font-family:var(--mono); font-weight:700; font-size:9pt; color:#166534; margin-top:8px; text-align:center;">claps++ → only this text node updates</div>
</div>
</div>

> **Summary.** `$state` is the engine we built by hand: the text node that read `claps` is the effect, the click is the trigger, and only that node re-runs. No magic was left — every piece was plain JavaScript.
