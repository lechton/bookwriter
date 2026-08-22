## 2 — Derived Values: $derived
@tags Computed Values

**Q. How do you compute a value based on other reactive state so that it updates automatically without manual recalculation?**

**Answer.** When building a shopping cart, you need the `totalPrice` to update automatically whenever items are added or removed. Instead of manually recalculating the total every time, you use the `$derived` rune to create an auto-updating formula. Svelte caches the result and only re-runs the math when the underlying items actually change.

```svelte title="App.svelte"
<script>
  let count = $state(1);
  let doubled = $derived(count * 2);

  // Derived from objects
  let user = $state({ first: 'Ada', last: 'Lovelace' });
  let full = $derived(`${user.first} ${user.last}`);
</script>
```

<div class="dg">
  <div class="stack">
    <div class="box bg-yellow"><span class="box-title">Input</span><b>$state()</b><i>Data changes</i></div>
    <div class="arrow-down"></div>
    <div class="box bg-green"><span class="box-title">Formula</span><b>$derived()</b><i>Recalculates automatically</i></div>
  </div>
</div>

> **Summary.** Think of **$derived** as an auto-updating formula. This is powerful because it calculates a value once and caches it. It only re-runs when the inputs actually change. This keeps your app blazing fast without manual recalculation logic.
