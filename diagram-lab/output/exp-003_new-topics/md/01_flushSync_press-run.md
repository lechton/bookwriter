## 20 — flushSync: state writes are batched, DOM reads are stale
@tags Reactivity, DOM, Timing

**Q. You set claps = 5 and the very next line reads the DOM — why does it still show 4?**

**Answer.** Because assigning state does not touch the DOM. Svelte queues the change and applies all queued updates together after your code finishes. Any DOM read between the assignment and that batch reads the previous frame. Calling `flushSync()` right after the write forces the queue to apply immediately, so the next line sees the new value.

**Why it works.** The expectation feels right because JavaScript lines run in order and every `let` change you ever made was visible on the next line. But the DOM is not the variable; it is a printout of the variable, and Svelte prints on a schedule, not per keystroke. Batching is what keeps a burst of ten writes from repainting ten times.

```svelte title="ClapButton.svelte"
<script>
  import { flushSync } from 'svelte';
  let claps = $state(4);
  let counterEl;

  function read() {
    claps = 5;
    flushSync(); // apply the pending DOM update now
    console.log(counterEl.textContent); // "5" — without flushSync: "4"
  }
</script>

<h1 bind:this={counterEl}>{claps}</h1>
<button onclick={read}>Clap and read</button>
```

**Diagram concept.** The Press Run: writes are stories filed to the press room and printed on a schedule; `flushSync` is a special edition printed on the spot, so the next line reads fresh news instead of yesterday's paper.

<div class="dg" style="display:flex; flex-direction:column; gap:14px; padding:36px 14px 18px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">The Press Run</span>
<div style="display:flex; flex-direction:column; gap:6px;">
<span style="font-size:6.5pt; font-weight:800; text-transform:uppercase; color:#6b7280;">no flushSync · reads the old edition</span>
<div style="display:flex; align-items:center; gap:8px;">
<div style="flex:1; border:3px solid #000; background:#fef08a; padding:8px 6px; font-family:var(--mono); font-weight:800; font-size:8.5pt; text-align:center; box-shadow:4px 4px 0 0 #000; white-space:nowrap;">claps = 5</div>
<div style="flex:1.1; border:3px dashed #9ca3af; background:#f9fafb; padding:8px 6px; text-align:center;">
<b style="font-family:var(--mono); font-size:8pt; color:#4b5563;">PRESS QUEUE</b><br/>
<span style="font-size:6.5pt; font-weight:800; color:#9ca3af; text-transform:uppercase;">5 sits unprinted</span>
</div>
<div style="flex:1.1; border:3px dashed #9ca3af; background:#f3f4f6; padding:8px 6px; text-align:center; opacity:0.85;">
<b style="font-family:var(--mono); font-size:9pt; color:#6b7280;">DOM: 4</b><br/>
<span style="font-size:6.5pt; font-weight:800; color:#9ca3af; text-transform:uppercase;">yesterday's paper</span>
</div>
</div>
</div>
<div style="display:flex; flex-direction:column; gap:6px;">
<span style="font-size:6.5pt; font-weight:800; text-transform:uppercase; color:#1d4ed8;">flushSync() · special edition prints now</span>
<div style="display:flex; align-items:center; gap:8px;">
<div style="flex:1; border:3px solid #000; background:#fef08a; padding:8px 6px; font-family:var(--mono); font-weight:800; font-size:8.5pt; text-align:center; box-shadow:4px 4px 0 0 #000; white-space:nowrap;">claps = 5</div>
<div style="flex:1.1; position:relative; display:flex; align-items:center; justify-content:center; height:26px;">
<div style="position:absolute; left:0; right:-6px; top:50%; border-top:4px solid #000;"></div>
<div style="position:absolute; right:-8px; top:50%; transform:translateY(-50%); width:0; height:0; border-top:6px solid transparent; border-bottom:6px solid transparent; border-left:8px solid #000;"></div>
<span style="position:relative; background:#000; color:#fef08a; font-size:6pt; font-weight:800; text-transform:uppercase; padding:2px 5px;">special edition</span>
</div>
<div style="flex:1.1; border:3px solid #000; background:#bfdbfe; padding:8px 6px; text-align:center; box-shadow:4px 4px 0 0 #000;">
<b style="font-family:var(--mono); font-size:9pt;">DOM: 5</b><br/>
<span style="font-size:6.5pt; font-weight:800; color:#1d4ed8; text-transform:uppercase;">fresh off the press</span>
</div>
</div>
</div>
</div>

> **Summary.** A state write joins a queue; the DOM updates when the batch prints. Reach for `flushSync()` only when the very next line must read fresh DOM — everywhere else, let the press run on schedule.
