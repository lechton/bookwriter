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

<div class="dg" style="display:flex; flex-direction:column; gap:14px; padding:36px 14px 18px; border:4px solid #000; position:relative; background:#fff;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">The Press Run</span>
<div class="lane">
<span class="lane-label mut">no flushSync · reads the old edition</span>
<div style="display:flex; align-items:center; gap:6px;">
<div class="bldg" style="flex:1; background:#fef08a;"><div class="bldg-name" style="font-size:8pt; white-space:nowrap;">claps = 5</div></div>
<div class="wire dashed"><span class="wire-tag mut">queued</span></div>
<div class="tray" style="flex:1.1;"><span class="tray-label">press queue</span><br/><span class="tray-item" style="font-size:7pt;">claps = 5</span></div>
<div class="wire dashed"><span class="wire-tag mut">later</span></div>
<div class="paper old" style="flex:1;"><div class="paper-mast">current edition</div><div class="paper-body">DOM: 4</div></div>
</div>
</div>
<div class="lane">
<span class="lane-label info">flushSync() · special edition prints now</span>
<div style="display:flex; align-items:center; gap:6px;">
<div class="bldg" style="flex:1.4; background:#fef08a;"><div class="bldg-name" style="font-size:8pt;">claps = 5 · flushSync()</div></div>
<div class="wire head"><span class="wire-tag yel">prints now</span></div>
<div class="paper" style="flex:1.1;"><div class="paper-mast">special edition</div><div class="paper-body">DOM: 5</div></div>
</div>
</div>
</div>

> **Summary.** A state write joins a queue; the DOM updates when the batch prints. Reach for `flushSync()` only when the very next line must read fresh DOM — everywhere else, let the press run on schedule.
