## 7 — Fragments: #snippet
@tags Reusability

**Q. How do you pass reusable chunks of UI into a child component instead of using the old slot system?**

**Answer.** If you are building a complex `<Table>` component, you need the parent to dictate exactly how each row's data is formatted as HTML. Instead of relying on rigid, clunky `<slot>` tags, you define dynamic UI blocks using the `#snippet` syntax and pass them directly into the child component like a normal function.

```svelte title="App.svelte"
{#snippet card(title, content)}
  <div class="ui-card">
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
{/snippet}

{@render card("News", "Svelte 5 is out!")}
{@render card("Sports", "Local team wins!")}
```

<div class="dg" style="background:#fff; padding:40px 20px 20px; border-width:6px; position:relative;">
  <span style="position:absolute; top:0; left:0; background:#000; color:#fff; padding:4px 12px; font-size:7.5pt; font-weight:800; text-transform:uppercase; border-bottom:4px solid #000; border-right:4px solid #000;">Blueprint Factory</span>
  <div style="display:flex; flex-direction:column; align-items:center;">
    <div style="border:4px dashed #3b82f6; background:#eff6ff; padding:8px 24px; font-family:monospace; font-weight:bold; font-size:14pt; color:#1d4ed8; display:flex; align-items:center; gap:8px;">
      <span style="font-size:18pt;">📦</span> #snippet
    </div>
    <div style="display:flex; justify-content:space-between; width:100%; max-width:200px; padding:0 20px; margin:16px 0;">
      <span style="font-size:20pt; font-weight:900; transform:rotate(135deg); line-height:1;">↓</span>
      <span style="font-size:20pt; font-weight:900; line-height:1;">↓</span>
      <span style="font-size:20pt; font-weight:900; transform:rotate(-135deg); line-height:1;">↓</span>
    </div>
    <div style="display:flex; gap:12px; width:100%; justify-content:center;">
      <div style="border:2px solid #000; background:#fef08a; padding:8px 12px; font-family:monospace; font-weight:bold; text-align:center; box-shadow:4px 4px 0 0 #000;">{@render}<br><span style="font-family:sans-serif; font-size:8pt; font-weight:normal;">'News'</span></div>
      <div style="border:2px solid #000; background:#fef08a; padding:8px 12px; font-family:monospace; font-weight:bold; text-align:center; box-shadow:4px 4px 0 0 #000;">{@render}<br><span style="font-family:sans-serif; font-size:8pt; font-weight:normal;">'Sports'</span></div>
    </div>
  </div>
</div>

> **Summary.** Snippets replace the old `<slot>` system. This is a game changer because they let you define mini, reusable chunks of UI right inside your component. This creates an incredibly powerful and programmatic way to pass layout pieces around your app.
