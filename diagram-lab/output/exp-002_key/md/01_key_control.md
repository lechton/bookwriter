## 19 — Key blocks: rebuilding DOM on demand
@tags Key Blocks, DOM, Components

**Q. What does the {#key} block do in Svelte?**

**Answer.** The `{#key}` block watches an expression. Whenever that expression changes, Svelte destroys everything inside the block and recreates it from scratch. Components inside are freshly instantiated, their state starts over, and transitions play again.

**Why it works.** Svelte uses the key to decide identity. Same key means same content, patched as usual. New key means new content, so the old DOM and component instances are thrown away and rebuilt.

```svelte title="ArticlePage.svelte"
<script>
  let { article } = $props();
</script>

{#key article.id}
  <ArticleView {article} />
{/key}
```

<div class="dg" style="display:flex; flex-direction:column; align-items:center; gap:10px; padding:34px 14px 18px; background:#fff; border:4px solid #000; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">What {#key} does</span>
<div style="border:3px solid #000; background:#fef08a; padding:8px 16px; font-family:var(--mono); font-weight:800; font-size:10pt; box-shadow:4px 4px 0 0 #000; text-align:center;">key = article.id</div>
<div style="display:flex; flex-direction:column; align-items:center;">
<span style="font-size:7pt; font-weight:800; text-transform:uppercase; background:#fff; border:2px solid #000; padding:2px 6px;">when the value changes</span>
<span style="font-size:16pt; font-weight:900; line-height:1;">↓</span>
</div>
<div style="border:3px solid #000; background:#bfdbfe; padding:8px 16px; font-family:var(--mono); font-weight:800; font-size:10pt; box-shadow:4px 4px 0 0 #000; text-align:center;">block contents<br/><span style="font-family:var(--sans); font-size:7.5pt; font-weight:600; color:#4b5563;">destroyed and recreated · transitions replay</span></div>
</div>

> **Summary.** When the key expression changes, Svelte throws away everything inside the block and rebuilds it. Use `{#key}` when you need a guaranteed fresh start.
