## 18 — Complex Formulas: $derived.by
@tags Reactivity, Logic

**Q. How do you calculate a derived value that requires multiple lines of logic, temporary variables, or loops?**

**Answer.** Normally, a `$derived` value is just a single math equation. But if you need to filter a massive list of products based on five different search criteria, you need `if` statements and loops. You use `$derived.by` to run a massive, multi-line JavaScript function that unlocks the full power of the language while keeping the result perfectly cached.

```svelte title="Stats.svelte"
<script>
  let numbers = $state([1, -5, 10, 42, -3]);

  // Use .by() when you need a full function block
  let positiveTotal = $derived.by(() => {
    let sum = 0;
    for (let num of numbers) {
      if (num > 0) sum += num;
    }
    return sum;
  });
</script>
```

<div class="dg" style="padding:40px; background:#f4f4f5; border:6px solid #000; display:flex; flex-direction:column; gap:20px; position:relative; align-items:center;">
  
  <div style="display:flex; width:100%; gap:20px; align-items:stretch;">
    <!-- Normal Derived -->
    <div style="flex:1; border:4px solid #000; background:#fff; padding:20px; box-shadow:6px 6px 0 0 #000;">
      <div style="background:#22c55e; color:#000; font-family:monospace; font-weight:900; padding:4px 8px; border:2px solid #000; display:inline-block; margin-bottom:12px;">$derived</div>
      <div style="border-left:4px solid #d1d5db; padding-left:12px; font-family:monospace; color:#4b5563;">
        One line only.<br>
        x * 2
      </div>
    </div>

    <!-- Derived By -->
    <div style="flex:1; border:4px solid #000; background:#fff; padding:20px; box-shadow:6px 6px 0 0 #000; position:relative;">
      <div style="background:#fef08a; color:#000; font-family:monospace; font-weight:900; padding:4px 8px; border:2px solid #000; display:inline-block; margin-bottom:12px;">$derived.by</div>
      <div style="border-left:4px solid #d1d5db; padding-left:12px; font-family:monospace; color:#4b5563;">
        Full function.<br>
        Loops allowed.<br>
        If statements.<br>
        Must <b>return</b>.
      </div>
    </div>
  </div>
</div>

> **Summary.** Sometimes a simple math expression isn't enough to calculate a derived value. This is powerful because `$derived.by` unlocks the full power of JavaScript inside your reactivity. You can write complex parsing or filtering algorithms that still auto-update efficiently.
