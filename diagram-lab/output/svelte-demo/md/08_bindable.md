## 8 — Two-Way Flow: $bindable
@tags State Synchronization

**Q. How do you explicitly allow a child component to modify a value passed down from its parent?**

**Answer.** Normally, data only flows strictly down from parent to child. But if you have a custom `<TextInput>` component, you need the child to actively push the typed letters back up to the parent. You use the `$bindable` rune to explicitly create a two-way street that automatically keeps both synced.

```svelte title="Input.svelte"
<script>
  let { value = $bindable() } = $props();
</script>

<input bind:value={value} />
```

```svelte title="App.svelte"
<script>
  import Input from './Input.svelte';
  let name = $state('Alice');
</script>

<Input bind:value={name} />
```

<div class="dg" style="padding:30px 20px; background-color:#fff1f2; background-image:repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 8px); display:flex; align-items:center; justify-content:space-between; gap:0;">
  <div style="border:4px solid #000; background:#fff; padding:20px; font-weight:bold; text-align:center; width:35%; box-shadow:4px 4px 0 0 #000; z-index:2;">
    <div style="font-family:monospace; font-size:12pt;">Parent</div>
    <div style="font-size:8pt; color:#6b7280; font-weight:normal;">name</div>
  </div>
  <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; z-index:1; height:40px;">
    <div style="background:#000; color:#fff; font-family:monospace; font-size:7.5pt; font-weight:800; padding:4px 8px; border:2px solid #fff; border-radius:4px; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:3;">bind:value</div>
    <div style="width:100%; height:4px; background:#000; position:relative;">
      <div style="position:absolute; left:0; top:50%; transform:translateY(-50%) rotate(45deg); width:12px; height:12px; border-bottom:4px solid #000; border-left:4px solid #000; background:#fff1f2;"></div>
      <div style="position:absolute; right:0; top:50%; transform:translateY(-50%) rotate(45deg); width:12px; height:12px; border-top:4px solid #000; border-right:4px solid #000; background:#fff1f2;"></div>
    </div>
  </div>
  <div style="border:4px solid #000; background:#fff; padding:20px; font-weight:bold; text-align:center; width:35%; box-shadow:-4px 4px 0 0 #000; z-index:2;">
    <div style="font-family:monospace; font-size:12pt;">Child</div>
    <div style="font-size:8pt; color:#6b7280; font-weight:normal;">$bindable()</div>
  </div>
</div>

> **Summary.** The **$bindable** rune creates a two-way street. This is important because it explicitly gives a child component permission to edit the parent's state. This keeps complex data perfectly synced without writing endless callback functions.
