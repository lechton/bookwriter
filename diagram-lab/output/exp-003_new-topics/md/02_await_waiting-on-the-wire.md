## 21 — Await blocks: the promise's whole life, in markup
@tags Async, Template, Promises

**Q. The article fetch is still in flight — where do the spinner and the error message go, without a loading boolean and a try/catch in script?**

**Answer.** Inside the `{#await}` block. It owns the promise's entire life in the template: the pending branch renders while the fetch is in flight, then exactly one of `{:then}` (the story landed) or `{:catch}` (it failed) replaces it. No booleans, no script glue, no manual state machine.

**Why it works.** The instinct to hand-roll comes from plain JavaScript, where promise states are handled in `.then` and `.catch` callbacks, so the UI for them must be driven from script too. In Svelte the template can await directly, so the three states of the promise become three named places in the markup — the spinner has a home and the error has a home, and Svelte swaps between them for you.

```svelte title="ArticlePage.svelte"
<script>
  import { fetchArticle } from './api.js';
  let { id } = $props();
</script>

{#await fetchArticle(id)}
  <p>Loading the story…</p>            <!-- pending: in flight -->
{:then article}
  <ArticleView {article} />            <!-- resolved -->
{:catch err}
  <p>Could not load: {err.message}</p> <!-- rejected -->
{/await}
```

**Diagram concept.** Waiting on the Wire: the newsroom waits for the story at the pending desk; when the wire arrives it lands exactly once — on the editor's desk with the story, or at the correction desk with the error.

<div class="dg" style="display:flex; flex-direction:column; align-items:center; gap:8px; padding:36px 14px 18px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Waiting on the Wire</span>
<div style="border:3px solid #000; background:#fef08a; padding:8px 18px; text-align:center; box-shadow:4px 4px 0 0 #000; position:relative; width:78%;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px;">1 · PENDING DESK</span>
<b style="font-family:var(--mono); font-size:9.5pt;">fetch in flight</b><br/>
<span style="font-size:6.5pt; font-weight:800; color:#92700a; text-transform:uppercase;">the spinner lives here</span>
</div>
<span style="font-size:16pt; font-weight:900; line-height:1;">↓</span>
<span style="font-size:6.5pt; font-weight:800; text-transform:uppercase; background:#000; color:#fff; padding:2px 8px;">the wire arrives once · one door only</span>
<div style="display:flex; gap:12px; width:100%; justify-content:center;">
<div style="border:3px solid #000; background:#bfdbfe; padding:8px 10px; text-align:center; box-shadow:4px 4px 0 0 #000; flex:1; position:relative;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px;">2a · THEN</span>
<b style="font-family:var(--mono); font-size:9pt;">story landed</b><br/>
<span style="font-size:6.5pt; font-weight:800; color:#1d4ed8; text-transform:uppercase;">ArticleView renders</span>
</div>
<div style="border:3px solid #000; background:#fbcfe8; padding:8px 10px; text-align:center; box-shadow:4px 4px 0 0 #000; flex:1; position:relative;">
<span style="position:absolute; top:-10px; left:8px; background:#000; color:#fff; font-size:6.5pt; font-weight:800; padding:2px 6px;">2b · CATCH</span>
<b style="font-family:var(--mono); font-size:9pt;">correction desk</b><br/>
<span style="font-size:6.5pt; font-weight:800; color:#9d174d; text-transform:uppercase;">error message renders</span>
</div>
</div>
</div>

> **Summary.** One block, three homes: pending holds the spinner, then holds the story, catch holds the error. The promise resolves once, Svelte swaps the branch, and your script stays free of loading booleans.
