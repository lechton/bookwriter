# Image List — 04_extra_javascript_1.md (JavaScript Foundations → The Reactive Graph)

**STATUS: all 15 built, rendered, and published** to `output/svelte/images/04_extra_javascript_1/`,
each with a content twin in `output/svelte/image-content/04_extra_javascript_1/`. Cards live in
`Pencil/cards/04_extra_javascript_1/<NN-slug>/`, numbered to match the shot numbers below.

Shot list for Pencil cards. Titles only, grouped by source section.

Pattern (the filter): each card is **one runnable code snippet → a staged execution flow
(what happens, step by step, when it runs) → a summary**. Every title below names a
*mechanism with a behavior* the flow can trace over time. Pure definitions, comparisons,
and static structures are excluded (they don't have an execution flow); structural
concepts are reframed into their behavior.

## 1. Objects
1. Property lookup walks the prototype chain  ✓ `01-prototype-chain`

## 2. Functions & Closures
2. A closure keeps private memory alive  ✓ `02-closure`
3. Sharing state across files with a module closure  ✓ `03-module-closure`

## 3. Getters & Setters
4. A getter runs a function on a plain property read  ✓ `04-getter`

## 4. The Proxy
5. A proxy intercepts every read and write through traps  ✓ `05-proxy-traps`

## 5. The Observer Pattern
6. The observer pattern: track on read, trigger on write  ✓ `06-observer-pattern`

## 6. The Signal
7. A reactive object is a proxy bundling one signal per property  ✓ `07-reactive-object`
8. $state drives a fine-grained DOM update  ✓ `08-state-dom`
9. Raw state: mutation ignored, reassignment fires  ✓ `09-raw-state`

## 7. The Dependency Graph
10. A change propagates through source → derived → effect  ✓ `10-propagation`
11. The diamond problem: why update order matters  ✓ `11-diamond`

## 8. The DOM
12. From tag to element: how the browser builds the DOM tree  ✓ `12-dom-tree`

## 9. Three Frameworks, Three Answers
13. React: rerun, then diff the virtual DOM  ✓ `13-react-diff`
14. Vue: track through a proxy, then diff  ✓ `14-vue-track-diff`
15. Svelte: compiled signals, no virtual DOM  ✓ `15-svelte-compiled`
