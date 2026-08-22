## 2 — Closure: a function that keeps its variables alive
@tags Scope, Privacy, State

**Q. createClapButton() has returned, so why can article.total() still read claps?**

**Answer.** A function's local variables normally vanish when it returns. But if the function hands back something that still references those variables, they stay alive. The bundle of a function plus the variables it captured is a closure, and the captured `claps` lives on, reachable only through `clap` and `total`.

**Why it works.** Both `clap` and `total` were declared inside `createClapButton`, so they close over the *same* `claps`. When the factory returns, those two methods still hold it, so JavaScript keeps the variable in memory. Nothing outside can name `claps` directly, which makes it private state you can only touch through the methods.

```js title="examples/clapButton.js"
function createClapButton() {
  let claps = 0;                       // private, starts at 0
  return {
    clap() { claps++; },               // increments the captured claps
    total() { return claps; }          // reads the captured claps
  };
}
const article = createClapButton();    // the scope stays alive
article.clap();                        // claps → 1
article.clap();                        // claps → 2
console.log(article.total());          // prints 2
console.log(article.claps);            // undefined — sealed inside
```

<div class="dg" style="padding:32px 16px 20px; background:#fff; position:relative; border:4px solid #000;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">One Hidden Variable</span>
<div style="text-align:center; margin-bottom:14px;">
<div style="display:inline-block; border:3px solid #000; background:#fef08a; padding:10px 20px; font-family:var(--mono); font-weight:800; font-size:13pt; box-shadow:4px 4px 0 0 #000;">let claps = 0</div>
<div style="font-size:7.5pt; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:#4b5563; margin-top:6px;">private · shared · alive</div>
</div>
<div style="display:flex; justify-content:space-around; align-items:flex-start; gap:10px;">
<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
<div style="font-size:18pt; font-weight:900; line-height:1;">↓</div>
<div style="border:3px solid #000; background:#bbf7d0; padding:8px 14px; font-family:var(--mono); font-weight:800; font-size:10pt; box-shadow:4px 4px 0 0 #000;">clap()</div>
<div style="font-size:7pt; font-weight:800; text-transform:uppercase; background:#fff; border:2px solid #000; padding:2px 6px;">writes claps</div>
</div>
<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
<div style="font-size:18pt; font-weight:900; line-height:1;">↓</div>
<div style="border:3px solid #000; background:#bfdbfe; padding:8px 14px; font-family:var(--mono); font-weight:800; font-size:10pt; box-shadow:4px 4px 0 0 #000;">total()</div>
<div style="font-size:7pt; font-weight:800; text-transform:uppercase; background:#fff; border:2px solid #000; padding:2px 6px;">reads claps</div>
</div>
</div>
</div>

> **Summary.** A closure keeps a function's variables alive after it returns, shared between the methods that captured them and unreachable from anywhere else. Private state is powerful, but it is trapped inside one function — what if many files needed the same value?
