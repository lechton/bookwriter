## 9 — Logging: $inspect
@tags Developer Tools

**Q. How do you automatically log the old and new values of a state variable every time it changes for debugging?**

**Answer.** When an object is changing unexpectedly and breaking your UI, manually writing `console.log()` inside every single update function is exhausting. You drop the `$inspect` rune into your component and pass it the broken variable. Svelte acts as a security camera, automatically logging the exact old and new values every time it shifts.

```svelte title="App.svelte"
<script>
  let count = $state(0);
  let user = $state({ role: 'admin' });

  // Logs automatically on any change
  $inspect(count, user);
</script>
```

<div class="dg" style="border:none; padding:0; background:none; margin-top:24px;">
  <div style="border-radius:12px; box-shadow:8px 8px 0 0 #000; overflow:hidden; border:4px solid #000;">
    <div style="background:#e5e5e5; padding:12px 16px; border-bottom:3px solid #000; display:flex; gap:8px;">
      <div style="width:12px; height:12px; border-radius:50%; background:#ef4444; border:2px solid #000;"></div>
      <div style="width:12px; height:12px; border-radius:50%; background:#eab308; border:2px solid #000;"></div>
      <div style="width:12px; height:12px; border-radius:50%; background:#22c55e; border:2px solid #000;"></div>
      <span style="margin-left:auto; color:#4b5563; font-family:monospace; font-size:7.5pt; font-weight:800; text-transform:uppercase; letter-spacing:0.1em;">Developer Console</span>
    </div>
    <div style="padding:16px; font-family:monospace; font-size:9pt; line-height:1.8; background:#f9fafb;">
      <div style="color:#6b7280; margin-bottom:4px;">&gt; $inspect initialization</div>
      <div style="color:#059669; border-left:2px solid #d1d5db; padding-left:12px; margin-bottom:12px; display:flex; gap:16px;">
        <span>count: <span style="color:#d97706;">0</span></span>
        <span style="color:#2563eb;">Object { role: "admin" }</span>
      </div>
      <div style="color:#6b7280; margin-bottom:4px;">&gt; count updated</div>
      <div style="color:#059669; border-left:2px solid #d1d5db; padding-left:12px; background:rgba(0,0,0,0.05); padding-top:4px; padding-bottom:4px; display:flex; gap:16px;">
        <span>count: <span style="color:#d97706;">1</span></span>
        <span style="color:#2563eb;">Object { role: "admin" }</span>
      </div>
    </div>
  </div>
</div>

> **Summary.** Drop **$inspect** into any component to watch your variables. This is incredibly handy because it acts as a built-in debugger. It automatically prints out the exact old and new values to the console every single time your state changes.
