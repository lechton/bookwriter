# Data-Flow Companion Suitability — 200-Question Svelte 5 Bank Analysis

This document evaluates which of the 200 questions in `diagram-lab/docs/200Q/200Q.md` would genuinely benefit from a `md-data-flow/{n}.md` companion file, and for each that does, whether the ElectroShop or MyTube reference app fits better. It is the planning atlas for the data-flow pipeline: it tells the author where to spend effort and which reference app to reach for, so that the 200-question deck is authored consistently rather than ad hoc.

## 1. Methodology

Each question was tested against four positive criteria (cross-tier data movement, tier-selection tension, deep-nesting communication, global-vs-local state decision) and five negative criteria (pure compiler/build internals, single-component mechanism with no cross-tier story, pure syntax/reference lookup, tooling/testing/SSR config, pure performance theory). A question PASSES if at least one positive criterion is genuinely engaged and no negative criterion dominates; otherwise it FAILS. Calibration anchors: Q01/Q02 are the FAIL prototypes (compiler-architecture comparison, build-step internals); Q49 is the PASS prototype (`$derived` prop sync ➔ ElectroShop). For every PASS, the reference app is chosen by mapping the concept onto the existing component trees: cart/global-counter/form-filtering/deep-Header↔ShopLayout state defaults to **ElectroShop** (the primary, richer state surface); media-playback bindings (currentTime/duration/paused) and like/subscribe/feed clusters map to **MyTube**; genuinely domain-agnostic PASSes default to ElectroShop per the rule.

## 2. Summary Counts

- **Total PASS:** 31
- **Total FAIL:** 169
- **ElectroShop PASS:** 30
- **MyTube PASS:** 1
- **Ratio:** ~15.5% (roughly 1 in 6). The low rate reflects that the bank is heavily weighted toward syntax, compiler internals, and single-component mechanics; the genuinely architectural concepts cluster tightly into four bands (props/bindings, slots/snippets, events/callbacks, stores/context). MyTube is under-utilized because the bank contains no like/subscribe/playlist feature questions — only media-element bindings (Q131) land there naturally.

## 3. Full Classification Table

| Q# | Verdict | App | One-line rationale |
|----|---------|-----|--------------------|
| 1 | FAIL | — | Pure framework-architecture comparison vs React/Vue; no runtime tree to place. |
| 2 | FAIL | — | Build-step compiler internals (parse/codegen/CSS extract). |
| 3 | FAIL | — | Compile-time vs runtime performance theory; no placement decision. |
| 4 | FAIL | — | Surgical-update compiler internals; no component tree. |
| 5 | FAIL | — | Single-file component anatomy; single-component, no cross-tier story. |
| 6 | FAIL | — | CSS scoping is a compiler mechanism. |
| 7 | FAIL | — | Unused-CSS elimination is compiler internals. |
| 8 | FAIL | — | Global-CSS syntax inside scoped block; pure syntax. |
| 9 | FAIL | — | Role of `<script>`; single-component structure. |
| 10 | FAIL | — | TypeScript setup; tooling/config. |
| 11 | FAIL | — | Compiled component default export; compiler-output internals. |
| 12 | FAIL | — | Programmatic instantiation in vanilla JS; API internals. |
| 13 | FAIL | — | Compiler DOM-vs-SSR targets; compiler config. |
| 14 | FAIL | — | Bundle-size performance theory; no placement. |
| 15 | FAIL | — | Elements-vs-components in compilation output; compiler internals. |
| 16 | FAIL | — | Event-listener compilation; compiler internals. |
| 17 | FAIL | — | `svelte/internal` helpers; compiler internals. |
| 18 | FAIL | — | CSS selector rewriting at compile time; compiler CSS. |
| 19 | FAIL | — | Compiler warning flags; compiler config. |
| 20 | FAIL | — | Vite project setup; tooling. |
| 21 | FAIL | — | `svelte.config.js` purpose; config. |
| 22 | FAIL | — | SSR at framework-core level; framework internals. |
| 23 | FAIL | — | Multiple `<script>` tags; single-component syntax. |
| 24 | FAIL | — | Legacy `<script context="module">`; legacy compiler mechanism. |
| 25 | FAIL | — | `<svelte:head>` is per-component; mostly syntax, weak placement tension. |
| 26 | FAIL | — | Legacy reactivity overview; single-component concept. |
| 27 | FAIL | — | Assignment-operator reactivity; single-component under-the-hood. |
| 28 | FAIL | — | Why `.push()` fails; under-the-hood mechanics. |
| 29 | FAIL | — | Force reactive update after mutation; single-component mechanics. |
| 30 | FAIL | — | `$:` statement structure; single-component syntax. |
| 31 | FAIL | — | Compiler dependency inference for `$:`; compiler internals. |
| 32 | FAIL | — | Multi-line `$:`; syntax. |
| 33 | FAIL | — | Runes conceptual overview; mechanism/limitations, not placement. |
| 34 | FAIL | — | Plain `$state` declaration; single-component (contrast Q49's prop sync). |
| 35 | FAIL | — | `$state` deep reactivity; single-component under-the-hood. |
| 36 | FAIL | — | `$state.frozen`; single-component, when-to-use. |
| 37 | FAIL | — | Generic `$derived` concept; single-component (contrast Q49). |
| 38 | FAIL | — | `$derived.by`; single-component syntax. |
| 39 | FAIL | — | `$inspect`; single-component debugging. |
| 40 | FAIL | — | Fine-grained tracking under the hood; internals. |
| 41 | **PASS** | ElectroShop | Runes in `.svelte.js/.ts` modules = the "where does shared reactive state live" decision (component-local vs shared module). |
| 42 | FAIL | — | Migration refactor mechanics; single-component. |
| 43 | FAIL | — | Mixing legacy + Runes; syntax/mechanics. |
| 44 | FAIL | — | Fine-grained vs component-level invalidation; performance internals. |
| 45 | FAIL | — | Async mutation in reactive cycle; single-component mechanics. |
| 46 | FAIL | — | Microtask batching; under-the-hood internals. |
| 47 | FAIL | — | `tick()` mechanics; single-component. |
| 48 | FAIL | — | `tick()` DOM-read scenario; single-component. |
| 49 | **PASS** | ElectroShop | Calibration: `$derived` syncing local var from a prop; ProductCard derives wishlistCount from product prop ➔ WishlistButton. |
| 50 | FAIL | — | `$state` array vs Svelte 4 reassignment; single-component mechanics. |
| 51 | FAIL | — | Getters/setters with `$state`; single-component encapsulation. |
| 52 | FAIL | — | Rune invocation boundaries; syntax rules. |
| 53 | FAIL | — | Destructuring reactive objects; reactivity mechanics. |
| 54 | **PASS** | ElectroShop | Passing a `$state` primitive to a nested child is the canonical reactivity-preservation-across-tiers question (ProductCard ➔ ProductTitle/PriceBlock). |
| 55 | FAIL | — | Signal vs dirty-mask overhead; performance theory. |
| 56 | FAIL | — | Memoization pattern with Runes; single-component. |
| 57 | FAIL | — | Infinite loops in `$derived`; under-the-hood. |
| 58 | FAIL | — | Inline vs function-bound mutation; single-component mechanics. |
| 59 | FAIL | — | Reactivity inside `{#each}`; single-component. |
| 60 | FAIL | — | `$derived` returning a function; single-component mechanics. |
| 61 | FAIL | — | Reactivity in class fields; tracking mechanics. |
| 62 | **PASS** | ElectroShop | Reactive class models for shared client logic = where does shared domain state live (e.g. a CartStore class used across Header + ShopLayout). |
| 63 | FAIL | — | Reactive Map/Set; single-component mechanics. |
| 64 | FAIL | — | Conditional-branch dependency tracking; under-the-hood. |
| 65 | FAIL | — | Untrack/bypass; single-component mechanics. |
| 66 | FAIL | — | Declare prop in Svelte 3/4; syntax. |
| 67 | FAIL | — | Default prop value in Svelte 3/4; syntax. |
| 68 | FAIL | — | Declare/destructure props with Runes; declaration-side syntax. |
| 69 | FAIL | — | `$props` replacing `export let`; mechanism overview. |
| 70 | FAIL | — | TS interfaces for props; tooling/types. |
| 71 | FAIL | — | Prop spreading to HTML element; single-component. |
| 72 | FAIL | — | `$$props`/`$$restProps` implications; single-component. |
| 73 | FAIL | — | Rest props in `$props`; single-component syntax. |
| 74 | **PASS** | ElectroShop | Read-only vs two-way bindable props is a core tier-selection decision (does the child own the state or the parent?); FilterPanel/SortDropdown forms. |
| 75 | **PASS** | ElectroShop | `$bindable` rune — when two-way is warranted; same tier tension as Q74. |
| 76 | FAIL | — | Component class as prop; niche mechanism. |
| 77 | FAIL | — | Multi-root fragments; single-component syntax. |
| 78 | FAIL | — | `<svelte:component>` dynamic rendering; single-component. |
| 79 | FAIL | — | State on `<svelte:component>` this-change; single-component mechanics. |
| 80 | **PASS** | ElectroShop | Slots are inherently cross-tier content projection (parent supplies markup consumed by child); ProductCard layout slots. |
| 81 | **PASS** | ElectroShop | Named/scoped slots push data child➔parent via slot props; rich cross-tier; ProductCard exposing product to parent. |
| 82 | FAIL | — | Slots-deprecation overview; legacy/mechanism. |
| 83 | **PASS** | ElectroShop | `{#snippet}` is the cross-tier content-projection primitive of Svelte 5; ProductCard snippet props. |
| 84 | FAIL | — | Typed snippet args; typing syntax. |
| 85 | **PASS** | ElectroShop | Snippets as first-class props to children is explicitly cross-tier; pass a render snippet into ProductCard's actions. |
| 86 | FAIL | — | Default fallback slot vs snippet; single-mechanism comparison. |
| 87 | **PASS** | ElectroShop | Snippet vs standalone component is an architectural "where does this chunk live" decision. |
| 88 | **PASS** | ElectroShop | Child➔parent custom-event dispatch (Svelte 4); AddToCartButton dispatches to ProductCard/ProductGrid. |
| 89 | **PASS** | ElectroShop | `createEventDispatcher` is the cross-tier event channel; placement of dispatch vs listen. |
| 90 | **PASS** | ElectroShop | Callback props replacing dispatcher; the modern child➔parent channel. |
| 91 | **PASS** | ElectroShop | Callback-prop type safety over event forwarding; cross-tier contract design. |
| 92 | **PASS** | ElectroShop | Event bubbling/forwarding across tiers (grandchild➔grandparent). |
| 93 | **PASS** | ElectroShop | `bind:this` to child instance/DOM; parent reaches into child tier. |
| 94 | **PASS** | ElectroShop | What's exposed when binding to a child instance; cross-tier surface design. |
| 95 | FAIL | — | Conditional slot/snippet instantiation; single-component decision. |
| 96 | FAIL | — | `{#if}` syntax; single-component. |
| 97 | FAIL | — | `{:else if}`/`{:else}`; syntax. |
| 98 | FAIL | — | `{#each}` syntax; single-component. |
| 99 | FAIL | — | Keying lists; syntax/perf reference. |
| 100 | FAIL | — | Key declaration syntax; pure syntax. |
| 101 | FAIL | — | Loop index access; pure syntax. |
| 102 | FAIL | — | `{:else}` in `{#each}`; syntax. |
| 103 | FAIL | — | `{#await}` syntax; single-component. |
| 104 | FAIL | — | Pending/fulfilled/rejected phases; syntax. |
| 105 | FAIL | — | Omitting pending phase; syntax. |
| 106 | FAIL | — | `{#key}` purpose; single-component. |
| 107 | FAIL | — | `{#key}` DOM teardown; single-component mechanics. |
| 108 | FAIL | — | `{@html}`; syntax. |
| 109 | FAIL | — | `{@html}` security; security. |
| 110 | FAIL | — | Logic blocks in `{@html}`; mechanism. |
| 111 | FAIL | — | `{@const}`; single-component syntax. |
| 112 | FAIL | — | `{@const}` in loops; single-component optimization. |
| 113 | FAIL | — | Literal braces; pure syntax. |
| 114 | FAIL | — | Static-text compiler optimization; compiler internals. |
| 115 | FAIL | — | Nullish in template brackets; single-component rendering. |
| 116 | FAIL | — | Complex expressions in brackets; syntax rules. |
| 117 | FAIL | — | Forbidden template patterns; syntax rules. |
| 118 | FAIL | — | Inline `console.log` in template; single-component debugging. |
| 119 | FAIL | — | Comments; syntax. |
| 120 | FAIL | — | Whitespace normalization; compiler internals. |
| 121 | FAIL | — | Two-way binding on an element; single-component (component-binding covered by Q139). |
| 122 | FAIL | — | Text input binding; single-component. |
| 123 | FAIL | — | Numeric `bind:value` coercion; single-component. |
| 124 | FAIL | — | Checkbox boolean; single-component. |
| 125 | FAIL | — | Checkbox group via `bind:group`; single-component form. |
| 126 | FAIL | — | Radio group via `bind:group`; single-component. |
| 127 | FAIL | — | `<select>` binding; single-component. |
| 128 | FAIL | — | Multi-select; single-component. |
| 129 | FAIL | — | `<textarea>` binding; single-component. |
| 130 | FAIL | — | Contenteditable bindings; single-component. |
| 131 | **PASS** | MyTube | Media bindings (currentTime/duration/paused) are MyTube's signature surface; bind player state in a video-player component under VideoCard. |
| 132 | FAIL | — | Dimension bindings; single-component (read in one place). |
| 133 | FAIL | — | clientWidth vs offsetWidth; reference. |
| 134 | FAIL | — | Dimension binding read-only/two-way; mechanics. |
| 135 | FAIL | — | Dimension binding perf; perf theory. |
| 136 | FAIL | — | Scroll bindings; single-component. |
| 137 | FAIL | — | `<svelte:window>` bindings; single-component/global but no tier tension. |
| 138 | FAIL | — | `bind:files`; single-component. |
| 139 | **PASS** | ElectroShop | Parent binds to child's internal property; canonical cross-tier two-way decision (cart count in Header bound to UserCartMenu). |
| 140 | **PASS** | ElectroShop | Two-way component bindings as anti-pattern; explicit tier-selection/ownership reasoning. |
| 141 | FAIL | — | Lifecycle hooks overview; single-component. |
| 142 | FAIL | — | `onMount`; single-component. |
| 143 | FAIL | — | `onMount` cleanup; single-component. |
| 144 | FAIL | — | `onDestroy`; single-component. |
| 145 | FAIL | — | `onMount` cleanup vs `onDestroy`; single-component. |
| 146 | FAIL | — | `beforeUpdate`/`afterUpdate`; single-component. |
| 147 | FAIL | — | `onMount` synchronous rule; single-component mechanics. |
| 148 | FAIL | — | Extracting lifecycle to utilities; context-tracking mechanics. |
| 149 | FAIL | — | `$effect` replacing lifecycle; overview/mechanism. |
| 150 | FAIL | — | `$effect` timing; single-component mechanics. |
| 151 | FAIL | — | `$effect` dep tracking; single-component mechanics. |
| 152 | FAIL | — | `$effect` cleanup; single-component. |
| 153 | FAIL | — | `$effect.pre`; single-component mechanics. |
| 154 | FAIL | — | When to use `$effect.pre`; single-component decision. |
| 155 | FAIL | — | `$effect.tracking()`; debugging. |
| 156 | FAIL | — | Mutating state in effect; single-component mechanics. |
| 157 | FAIL | — | Browser-only effects vs lifecycle; single-component mechanics. |
| 158 | FAIL | — | Effects on unmount; single-component mechanics. |
| 159 | FAIL | — | Conditional `$effect` placement; syntax rules. |
| 160 | **PASS** | ElectroShop | Standalone effect scope outside any component (`effect.root`); where does a global reactive system live — root/app level, not in a component. |
| 161 | FAIL | — | Action concept; single-node overview. |
| 162 | FAIL | — | Action signature; syntax. |
| 163 | FAIL | — | Attach action to node; single-component syntax. |
| 164 | FAIL | — | Action parameters; single-component. |
| 165 | FAIL | — | Action lifecycle; single-component mechanics. |
| 166 | FAIL | — | Action teardown; single-component mechanics. |
| 167 | FAIL | — | Actions for third-party plugins; conceptual recommendation, weak placement tension. |
| 168 | FAIL | — | Multiple actions per element; single-component. |
| 169 | FAIL | — | Action reacting to external state; single-component. |
| 170 | FAIL | — | Click-outside action; single-component pattern. |
| 171 | FAIL | — | Actions vs lifecycle for DOM; single-component decision. |
| 172 | FAIL | — | Action dispatching custom events; single-component. |
| 173 | FAIL | — | Actions in SSR; mechanics. |
| 174 | FAIL | — | TS types for actions; tooling/types. |
| 175 | **PASS** | ElectroShop | Actions vs wrapper components is an architectural placement decision (DOM-node behavior vs extra component tier). |
| 176 | FAIL | — | Built-in transitions; single-component syntax. |
| 177 | FAIL | — | `transition:`/`in:`/`out:`; single-component syntax. |
| 178 | FAIL | — | Transition config; single-component syntax. |
| 179 | FAIL | — | Local transitions; single-component mechanics. |
| 180 | FAIL | — | Parent-removal vs element-toggle transitions; single-tree behavior. |
| 181 | FAIL | — | Custom CSS transition; single-component pattern. |
| 182 | FAIL | — | Custom JS transition; single-component pattern. |
| 183 | FAIL | — | Transition events; single-component. |
| 184 | FAIL | — | `svelte/animate`; single-component syntax. |
| 185 | FAIL | — | FLIP technique; single-component list reordering. |
| 186 | FAIL | — | `animate:flip` block placement; syntax. |
| 187 | **PASS** | ElectroShop | Deferred crossfade transitions between two lists require cross-list/cross-tier coordination (ProductGrid item ➔ cart dropdown). |
| 188 | FAIL | — | Transitions in SSR; mechanics. |
| 189 | FAIL | — | Disable transitions / reduced-motion; config/a11y. |
| 190 | FAIL | — | CSS keyframe vs JS loop perf; perf theory. |
| 191 | **PASS** | ElectroShop | Store contract (subscribe protocol); stores exist for cross-component state — where does the store live, who subscribes (CartStore). |
| 192 | **PASS** | ElectroShop | writable/readable/derived stores; cross-tier state; derived cart count consumed across Header + ShopLayout. |
| 193 | FAIL | — | Manual subscribe/unsubscribe mechanics; single-concern leak avoidance. |
| 194 | **PASS** | ElectroShop | `$store` auto-subscribe in templates is the cross-tier subscription pattern; cleanup is automatic per subscribing component. |
| 195 | FAIL | — | `$store` prefix in `.js`/`.ts`; constraint/mechanics. |
| 196 | **PASS** | ElectroShop | Custom store exposing curated domain actions (subscribe + addToCart/removeItem); rich "who owns the cart API" placement; CartStore factory. |
| 197 | **PASS** | ElectroShop | Context API scope vs global store; THE tier-scope decision (component subtree vs global); cart provided via context to ShopLayout subtree. |
| 198 | **PASS** | ElectroShop | Reactivity across context boundaries; passing a store/value through context and keeping it reactive across tiers. |
| 199 | **PASS** | ElectroShop | Stores vs Context use-case comparison; explicit architectural placement decision. |
| 200 | FAIL | — | Vitest + Testing Library; tooling/testing. |

## 4. Thematic Observations

- **The compiler/build-internals band Q1–Q25 is a near-total FAIL zone.** Only structural/syntax/mechanism questions live here; none present a runtime component-tree placement problem. This validates the negative criteria and means none of these questions warrant a data-flow file.
- **The pass criterion cuts *within* a topic, not *by* topic.** The Svelte-5 Runes block Q34–Q65 is mostly FAIL (mechanism), yet the genuinely cross-tier ones surface cleanly: Q41 (shared runes modules), Q49 (derived prop sync), Q54 (passing state to a child), Q62 (shared reactive class). This confirms that "it uses runes" is not enough — the placement tension is what matters.
- **Q80–Q94 is the densest PASS cluster in the entire bank.** Slots, scoped slots, snippets-as-props, snippet-vs-component, child→parent events, `createEventDispatcher`, callback props, event forwarding, and `bind:this` almost all PASS — and all land on ElectroShop. This is the cross-component-communication core and the highest-yield authoring target.
- **Stores/Context (Q191–Q199) is the second-densest PASS cluster** — everything except Q193 (mechanics) and Q195 (constraint). The global-vs-local and subtree-scope questions are exactly the architectural placement reasoning data-flow files are designed to teach; default ElectroShop (CartStore) throughout.
- **MyTube is severely under-utilized (1 of 31).** The bank contains no like/subscribe-count or playlist feature questions, so the only natural MyTube mapping is media-element bindings (Q131). If the bank is ever expanded, MyTube-flavored questions on feed iteration, ActionRow deep nesting, or persistent media layout would rebalance the app split.
- **Lifecycle/effects (Q141–Q159) and transitions (Q176–Q190) are near-total FAIL** — they are predominantly single-component mechanics. The only escapees are Q160 (a global `effect.root` scope, which *does* have a placement decision) and Q187 (crossfade coordination between two lists). Authors should not expect yield from these bands.
- **Pure syntax bands ({#if}/{#each}/{#await}/{@html} Q96–Q120, and form bindings Q121–Q130) are uniformly single-component and uniformly FAIL.** The two-way-binding tier tension is captured upstream by Q74/Q75/Q139/Q140 (component bindings), so the element-level binding questions add no placement value.

## 5. Recommended Authoring Order

Prioritized by tier-selection tension (richest placement reasoning first). Each of these earns its data-flow file; the rest can wait or be skipped.

**Tier 1 — author first (master placement comparisons):**
1. **Q199** — Stores vs Context (the canonical global-vs-subtree decision)
2. **Q197** — Context scope vs global store (where the boundary lands)
3. **Q198** — Reactivity across context boundaries (store-in-context pattern)
4. **Q139** — Parent binds to child's property (two-way ownership)
5. **Q140** — Two-way component binding as anti-pattern (when *not* to bind across tiers)
6. **Q196** — Custom store with domain actions (who owns the cart API)
7. **Q49** — Derived prop sync (calibration anchor; tier-local derivation)

**Tier 2 — core cross-tier mechanics:**
8. **Q54** — Passing `$state` primitive to a nested child (reactivity preservation)
9. **Q74 / Q75** — Read-only vs `$bindable` two-way props (own the state at the right tier)
10. **Q81** — Scoped slots (child→parent data via slot props)
11. **Q92** — Event bubbling/forwarding (grandchild→grandparent)
12. **Q88 / Q90** — Dispatcher (Svelte 4) vs callback props (Svelte 5) — author as a pair
13. **Q85** — Snippets as first-class props to children
14. **Q87** — Snippet vs standalone component (where does the chunk live)
15. **Q93 / Q94** — `bind:this` to a child instance (parent reaching into a child tier)

**Tier 3 — shared/global state and specialized surfaces:**
16. **Q41** — Runes in `.svelte.js` shared modules (component-local vs shared module)
17. **Q62** — Reactive class for shared client logic (CartStore class across Header + ShopLayout)
18. **Q192** — writable/readable/derived stores (derived cart count across tiers)
19. **Q194** — `$store` auto-subscribe in templates (per-component subscription cleanup)
20. **Q131** — Media bindings (the sole MyTube anchor; player state under VideoCard)
21. **Q160** — Standalone `effect.root` scope outside any component
22. **Q175** — Actions vs wrapper components (DOM-node behavior vs extra tier)
23. **Q187** — Deferred crossfade transitions between two lists

Authoring Tiers 1–2 alone (≈15 files) covers every distinct placement pattern in the bank; Tier 3 fills in the shared-state and specialized-surface variants.
