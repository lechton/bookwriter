## 08 — Closure
@tags JavaScript Mechanics, Privacy, State

**The Core Concept.** A closure occurs when an inner function retains access to the variables of its outer function, even after the outer function has finished running. This securely traps the data in a private persistent state.

**The Nuance.** Normally, when a function finishes executing, its local variables are destroyed by the JavaScript garbage collector. However, if that function returns an inner function that still references those local variables, the engine preserves that specific variable environment (the activation record) in memory. This creates truly private state. The variables are entirely inaccessible from the outside world, forming an impenetrable vault that can only be modified through the returned "privileged" methods.

**Framework Context.** Svelte's reactivity system relies heavily on closures. It is the foundational JavaScript mechanic that modern framework systems use to encapsulate data and reliably track reactive changes over time. When you write a reactive `$effect()`, Svelte executes this closure to track dependencies, and because the closure holds onto those variables, it can accurately re-evaluate the exact same logic whenever the underlying state changes.

```js title="counter.js"
function createCounter() {
  let count = 0; // Private state
  return function() {
    count++; 
    return count;
  };
}

const increment = createCounter();
console.log(increment()); // 1
console.log(increment()); // 2
```

<div class="brutal-diagram">
    <span class="brutal-diagram-label">Lexical Environment</span>
    <div class="brutal-header">Outer Function<br/><span class="brutal-header-sub">createCounter()</span></div>
    <div class="brutal-grid">
        <div class="brutal-box">
            <span class="brutal-box-label">Retained Scope</span>
            <div class="brutal-box-content">let count = 0;</div>
        </div>
        <div class="brutal-connector">
            <span class="brutal-connector-label">Accesses</span>
            <div class="brutal-connector-line">
                <div class="brutal-connector-arrow"></div>
            </div>
        </div>
        <div class="brutal-box solid">
            <span class="brutal-box-label">Inner Function</span>
            <div class="brutal-box-content">count++</div>
        </div>
    </div>
</div>

> **The move.** Closures create private state vaults. By returning a function that references outer variables, you prevent those variables from being garbage collected, giving you precise, controlled access to state.