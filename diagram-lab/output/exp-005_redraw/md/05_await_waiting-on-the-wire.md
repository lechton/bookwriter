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

<div class="dg env-blueprint" style="display:flex; flex-direction:column; align-items:center; gap:8px; padding:36px 14px 18px; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">Waiting on the Wire</span>
<div class="bldg" style="background:#fef08a; width:80%; position:relative;">
<span class="badge" style="position:absolute; top:-11px; left:50%; transform:translateX(-50%);">1</span>
<div class="bldg-name" style="margin-top:6px;">pending desk · fetch in flight</div>
<div class="bldg-sub">the spinner lives here</div>
</div>
<div class="wire down head"></div>
<span class="wire-tag">the wire arrives once · one door only</span>
<div style="display:flex; gap:12px; width:100%; justify-content:center; margin-top:4px;">
<div class="bldg" style="flex:1; background:#bfdbfe; position:relative;">
<span class="zone-label">then</span>
<div class="bldg-name">story landed</div>
<div class="bldg-sub">ArticleView renders</div>
</div>
<div class="bldg" style="flex:1; background:#fbcfe8; position:relative;">
<span class="zone-label">catch</span>
<div class="bldg-name">correction desk</div>
<div class="bldg-sub">error message renders</div>
</div>
</div>
</div>

> **Summary.** One block, three homes: pending holds the spinner, then holds the story, catch holds the error. The promise resolves once, Svelte swaps the branch, and your script stays free of loading booleans.
