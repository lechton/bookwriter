## 1 — Reactivity: $state
@tags State Management

**Q. How do you declare a variable that automatically updates the DOM when its value changes in Svelte 5?**

**Answer.** Normally, JavaScript variables are completely dead—changing a `let` variable doesn't update your UI. You use the `$state` rune to wrap your initial value, turning it into a live variable that Svelte tracks. Any time that value changes, Svelte instantly updates the DOM for you.

```svelte title="App.svelte"
<script>
  let count = $state(0);
  let user = $state({ name: 'Nikos' });

  function update() {
    count++;
    user.name = 'Hugo'; // Deeply reactive
  }
</script>
```

<div class="dg">
  <div class="stack">
    <div class="box bg-yellow"><span class="box-title">Source of Truth</span><b>$state()</b><i>Holds reactive data</i></div>
    <div class="arrow-down"></div>
    <div class="box bg-blue"><span class="box-title">UI</span><b>DOM Element</b><i>Refreshes on change</i></div>
  </div>
</div>

> **Summary.** The **$state** rune tells Svelte to watch a variable closely. This matters because it automates your UI. Any time you change that variable, Svelte instantly updates the screen for you. You never have to manually touch the DOM again.
