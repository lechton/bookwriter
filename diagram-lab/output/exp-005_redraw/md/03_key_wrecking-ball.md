## 19 — Key blocks: a key change never updates, it rebuilds
@tags Key Blocks, State, Components

**Q. I switched articles and my half-typed comment draft vanished — I only changed the key, so why did everything inside rebuild?**

**Answer.** Because `{#key}` never updates anything. When the key expression changes, Svelte destroys everything inside the block — the component instance, its local state, your draft — and builds a brand-new instance from zero. A key change is not a refresh; it is a teardown followed by a fresh start.

**Why it works.** Every normal state change in Svelte patches the DOM in place and preserves component state, so it is natural to expect a key change to behave the same way. But the key exists to declare identity: a new key means "this is a different thing," and Svelte takes you literally, throwing the old instance away so no stale state leaks into the new one.

```svelte title="ArticlePage.svelte"
<script>
  let { article } = $props();
</script>

{#key article.id}
  <ArticleView {article} />
  <!-- new id → old instance destroyed, fresh state, transitions replay -->
{/key}
```

**Diagram concept.** The Wrecking Ball: a normal state change is a renovation — the building stays, the furniture stays; a key change is a demolition at the same address — old instance razed, new one erected, nothing inside survives.

<div class="dg env-hatch" style="display:flex; flex-direction:column; gap:14px; padding:36px 14px 18px; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">The Wrecking Ball</span>
<div class="lane">
<span class="lane-label ok">id stays 7 · renovation</span>
<div style="display:flex; align-items:center; gap:8px;">
<div class="bldg" style="flex:1.1; background:#fef08a;"><div class="bldg-name">claps = 12</div></div>
<div class="wire head"><span class="wire-tag">patch</span></div>
<div class="bldg" style="flex:1.2; background:#bbf7d0;"><div class="bldg-name">ArticleView</div><div class="bldg-wins"><div class="bldg-win"></div><div class="bldg-win"></div><div class="bldg-win"></div></div><div class="bldg-sub">draft survives</div></div>
</div>
</div>
<div class="lane">
<span class="lane-label bad">id goes 7 → 8 · demolition</span>
<div style="display:flex; align-items:center; gap:8px;">
<div class="bldg ghost" style="flex:1.1;"><div class="bldg-name strike">ArticleView</div><div class="bldg-sub">draft destroyed</div></div>
<div class="wire head"><span class="wire-tag red">teardown</span></div>
<div class="bldg" style="flex:1.2; background:#bfdbfe; position:relative;"><div class="bldg-name">ArticleView</div><div class="bldg-wins"><div class="bldg-win"></div><div class="bldg-win"></div><div class="bldg-win"></div></div><div class="bldg-sub">state from zero</div><span class="stamp red" style="position:absolute; top:-14px; right:-8px; font-size:6.5pt;">reset</span></div>
</div>
</div>
</div>

> **Summary.** A key change is a demolition, not a refresh: everything inside `{#key}` is destroyed and rebuilt with fresh state. Reach for it when switching to a new article should feel like opening a clean page — and expect anything unsaved inside to be gone.
