# Table of Contents: Mastering Vue.js Architecture

> A unified, dependency-ordered curriculum of **63 technical lectures** covering CSS Foundations & Layout Mechanics (Q01–Q34), Architecture & Preprocessors (Q35–Q46), and Responsive, Accessible & Cross-Browser Engineering (Q47–Q63). Designed for engineering mastery and staff-level technical interview preparation.

---

## Curriculum Architecture & Pedagogy

- **Organic Lexical Audit (OLA)**: Concepts are grounded in real-world, high-stakes editorial scenarios from the newsroom of *The National Times* (broken layouts, cascading style conflicts, unclickable overlays, clipping modals, janky animations, mobile zoom failures).
- **Harmonious Code + UI Step Rhythm**: Every section opens with contextual framing, followed immediately by a minimal code snippet directly preceding authentic UI canvases (Isolated Component, Realistic Browser Window, or Compiler Geometry Substrates) before analytical derivations.
- **Seven Proven UI Archetypes**: Visualizations employ strict graphical substrates: DOM traversal trees, realistic virtual device viewports, architectural zoom viewfinders, specificity escalation ladders, multi-paradigm design token comparisons, stylesheet growth curves, and compiler geometry AST transforms.
- **Curriculum Typology Tiers**:
  - `❱ CORE` (31 Lectures): The cascade, specificity scoring, the box model, margin collapsing, block formatting contexts, flexbox & grid track arithmetic, BEM methodology grammar, and mobile-first viewports.
  - `❱❱ MORE` (26 Lectures): Pseudo-elements, hardware-accelerated motion, dynamic cascade custom properties, intrinsic sizing, subgrid, popover & anchor positioning, Sass/Less modularity, container queries, dark mode, and accessibility preference media.
  - `❱❱❱ ADVANCED` (6 Lectures): Modern cascade layers (`@layer`) & `@scope`, preprocessor over-nesting pitfalls & compiler cost, 2026 enterprise styling migrations (BEM vs CSS Modules vs Tailwind), CSS reset vs normalization mechanics, feature queries (`@supports`), and systematic cross-browser debugging.

## Recommended Reading Paths

1. **Full Curriculum (Q01–Q63)**: Comprehensive front-to-back mastery of modern CSS architecture, layout engines, and cross-browser rendering.
2. **CSS Mechanics & Modern Layout Specialist (Q01–Q34)**: Deep dive into the cascade tournament, box geometry, flexbox/grid coordinate algorithms, modern selectors (`:is`, `:where`, `:has`), and top layer primitives (popovers, anchor positioning).
3. **Design Systems & Architecture Track (Q35–Q46)**: Scaling CSS in engineering teams, BEM namespace grammar, preprocessor modularity (`@use`/`@forward`), AST compilation mechanics, and enterprise styling migrations.
4. **Responsive, Accessible & Compatibility Track (Q47–Q63)**: Layout viewports, fluid typography without media queries, container queries, dark mode orchestration, forced-colors & reduced-motion accessibility, and cross-browser debugging.

---

## Part One: CSS Review & Core Mechanics (Q01–Q34)

### ❱ CORE — The Cascade and the Box (Q01–Q14)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **01** | [The Reactivity Trap](md-lectures/01.md)<br>([PDF](md-lectures-pdf/01.pdf)) | `#proxy_reactivity`<br>`❱ CORE` | **Q:** How does Vue 3's reactivity system differ fundamentally from Vue 2?<br>**Key:** Always use toRefs when exposing reactive properties. |
| **02** | [Proxy Reactivity](md-lectures/02.md)<br>([PDF](md-lectures-pdf/02.pdf)) | `#proxy_reactivity`<br>`❱❱ MORE` | **Q:** How does Vue's reactivity engine know which component to re-render when a property changes?<br>**Key:**  |
| **03** | [Ref Vs Reactive](md-lectures/03.md)<br>([PDF](md-lectures-pdf/03.pdf)) | `#ref_vs_reactive`<br>`❱ CORE` | **Q:** When should you use `ref()` versus `reactive()` in Vue 3?<br>**Key:**  |
| **04** | [Reactivity Loss](md-lectures/04.md)<br>([PDF](md-lectures-pdf/04.pdf)) | `#reactivity_loss`<br>`❱ CORE` | **Q:** Why does destructuring a `reactive` object break reactivity, and how do you fix it?<br>**Key:**  |
| **05** | [Ref Vs Reactive](md-lectures/05.md)<br>([PDF](md-lectures-pdf/05.pdf)) | `#ref_vs_reactive`<br>`❱❱ MORE` | **Q:** How does Vue automatically unwrap refs, and where does unwrapping fail?<br>**Key:**  |
| **06** | [Computed](md-lectures/06.md)<br>([PDF](md-lectures-pdf/06.pdf)) | `#computed`<br>`❱ CORE` | **Q:** How do `computed` properties cache their values, and when do they re-evaluate?<br>**Key:**  |
| **07** | [The Escaped Tooltip](md-lectures/07.md)<br>([PDF](md-lectures-pdf/07.pdf)) | `#computed`<br>`❱❱ MORE` | **Q:** Why is it considered an anti-pattern to perform side-effects inside a computed property?<br>**Key:** Always apply `position: relative` to the parent container when anchoring absolute tooltips, establishing an active containing block without altering normal document flow. |
| **08** | [Watchers](md-lectures/08.md)<br>([PDF](md-lectures-pdf/08.pdf)) | `#watchers`<br>`❱ CORE` | **Q:** What is the difference between `watch()` and `watchEffect()`?<br>**Key:**  |
| **09** | [Watchers](md-lectures/09.md)<br>([PDF](md-lectures-pdf/09.pdf)) | `#watchers`<br>`❱❱ MORE` | **Q:** When should you use `deep: true` in a watcher, and what are its performance implications?<br>**Key:**  |
| **10** | [Effect Scheduler](md-lectures/10.md)<br>([PDF](md-lectures-pdf/10.pdf)) | `#effect_scheduler`<br>`❱❱❱ ADVANCED` | **Q:** What are the differences between `flush: 'pre'`, `post`, and `sync` in Vue watchers?<br>**Key:**  |
| **11** | [Effect Scheduler](md-lectures/11.md)<br>([PDF](md-lectures-pdf/11.pdf)) | `#effect_scheduler`<br>`❱❱❱ ADVANCED` | **Q:** Why does Vue batch reactivity updates, and how does `nextTick()` interact with the microtask queue?<br>**Key:**  |
| **12** | [Custom Composables](md-lectures/12.md)<br>([PDF](md-lectures-pdf/12.pdf)) | `#custom_composables`<br>`❱ CORE` | **Q:** What are composables in Vue 3, and how do they replace Vue 2 mixins?<br>**Key:**  |
| **13** | [Custom Composables](md-lectures/13.md)<br>([PDF](md-lectures-pdf/13.pdf)) | `#custom_composables`<br>`❱❱ MORE` | **Q:** How do you handle setup and teardown of event listeners inside a composable?<br>**Key:**  |
| **14** | [Custom Composables](md-lectures/14.md)<br>([PDF](md-lectures-pdf/14.pdf)) | `#custom_composables`<br>`❱❱❱ ADVANCED` | **Q:** What is `effectScope` and when would a library author use it?<br>**Key:**  |

### ❱ CORE — Layout Systems & Track Geometry (Q15–Q20)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **15** | [Custom Composables](md-lectures/15.md)<br>([PDF](md-lectures-pdf/15.pdf)) | `#custom_composables`<br>`❱❱ MORE` | **Q:** What is the `MaybeRef` or `MaybeRefOrGetter` pattern in VueUse?<br>**Key:**  |
| **16** | [Shallow Reactivity](md-lectures/16.md)<br>([PDF](md-lectures-pdf/16.pdf)) | `#shallow_reactivity`<br>`❱❱ MORE` | **Q:** When would you use `shallowRef()` instead of `ref()`?<br>**Key:**  |
| **17** | [Shallow Reactivity](md-lectures/17.md)<br>([PDF](md-lectures-pdf/17.pdf)) | `#shallow_reactivity`<br>`❱❱❱ ADVANCED` | **Q:** How does `triggerRef()` work in conjunction with shallow reactivity?<br>**Key:**  |
| **18** | [Proxy Reactivity](md-lectures/18.md)<br>([PDF](md-lectures-pdf/18.pdf)) | `#proxy_reactivity`<br>`❱❱❱ ADVANCED` | **Q:** Can you explain the `has` and `deleteProperty` Proxy traps in Vue 3 reactivity?<br>**Key:**  |
| **19** | [Script Setup](md-lectures/19.md)<br>([PDF](md-lectures-pdf/19.pdf)) | `#script_setup`<br>`❱ CORE` | **Q:** What does the `<script setup>` block actually do during SFC compilation?<br>**Key:**  |
| **20** | [Props Emits](md-lectures/20.md)<br>([PDF](md-lectures-pdf/20.pdf)) | `#props_emits`<br>`❱ CORE` | **Q:** How do you enforce prop types and default values in `<script setup>` using TypeScript?<br>**Key:**  |

### ❱❱ MORE — Mechanics and Modern CSS (Q21–Q33)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **21** | [Props Emits](md-lectures/21.md)<br>([PDF](md-lectures-pdf/21.pdf)) | `#props_emits`<br>`❱ CORE` | **Q:** Why is mutating a prop directly inside a child component forbidden?<br>**Key:**  |
| **22** | [Props Emits](md-lectures/22.md)<br>([PDF](md-lectures-pdf/22.pdf)) | `#props_emits`<br>`❱❱ MORE` | **Q:** How does `defineEmits` enforce event contracts between parent and child?<br>**Key:**  |
| **23** | [V Model](md-lectures/23.md)<br>([PDF](md-lectures-pdf/23.pdf)) | `#v_model`<br>`❱ CORE` | **Q:** How does `v-model` work under the hood on custom components in Vue 3?<br>**Key:**  |
| **24** | [V Model](md-lectures/24.md)<br>([PDF](md-lectures-pdf/24.pdf)) | `#v_model`<br>`❱❱ MORE` | **Q:** How do you bind multiple `v-model` directives on a single component?<br>**Key:**  |
| **25** | [V Model](md-lectures/25.md)<br>([PDF](md-lectures-pdf/25.pdf)) | `#v_model`<br>`❱❱ MORE` | **Q:** What is the `defineModel` macro introduced in Vue 3.4, and how does it simplify two-way binding?<br>**Key:**  |
| **26** | [Provide Inject](md-lectures/26.md)<br>([PDF](md-lectures-pdf/26.pdf)) | `#provide_inject`<br>`❱ CORE` | **Q:** When should you use `provide`/`inject` instead of passing props?<br>**Key:**  |
| **27** | [Provide Inject](md-lectures/27.md)<br>([PDF](md-lectures-pdf/27.pdf)) | `#provide_inject`<br>`❱❱ MORE` | **Q:** How do you ensure injected values remain reactive but cannot be mutated by the receiver?<br>**Key:**  |
| **28** | [Props Emits](md-lectures/28.md)<br>([PDF](md-lectures-pdf/28.pdf)) | `#props_emits`<br>`❱❱ MORE` | **Q:** What are "fallthrough attributes" (`$attrs`) and when would you disable attribute inheritance?<br>**Key:**  |
| **29** | [Vdom Patching](md-lectures/29.md)<br>([PDF](md-lectures-pdf/29.pdf)) | `#vdom_patching`<br>`❱ CORE` | **Q:** Why is the `key` attribute mandatory in a `v-for` loop?<br>**Key:**  |
| **30** | [Template Compiler](md-lectures/30.md)<br>([PDF](md-lectures-pdf/30.pdf)) | `#template_compiler`<br>`❱❱ MORE` | **Q:** Why is it an anti-pattern to use `v-if` and `v-for` on the same HTML element?<br>**Key:**  |
| **31** | [Slots](md-lectures/31.md)<br>([PDF](md-lectures-pdf/31.pdf)) | `#slots`<br>`❱ CORE` | **Q:** What is the difference between default slots, named slots, and dynamic slot names?<br>**Key:**  |
| **32** | [Slots](md-lectures/32.md)<br>([PDF](md-lectures-pdf/32.pdf)) | `#slots`<br>`❱❱ MORE` | **Q:** How do scoped slots work, and when would you use them instead of props?<br>**Key:**  |
| **33** | [Template Compiler](md-lectures/33.md)<br>([PDF](md-lectures-pdf/33.pdf)) | `#template_compiler`<br>`❱❱❱ ADVANCED` | **Q:** What are patch flags and static hoisting in the Vue 3 compiler?<br>**Key:**  |

### ❱❱❱ ADVANCED — The Modern Cascade & Architecture (Q34)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **34** | [Dynamic Components](md-lectures/34.md)<br>([PDF](md-lectures-pdf/34.pdf)) | `#dynamic_components`<br>`❱ CORE` | **Q:** How do you implement dynamic components using `<component :is="...">`?<br>**Key:**  |

---

## Part Two: Architecture and Preprocessors (Q35–Q46)

### ❱ CORE — Naming and Methodology (Q35–Q38)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **35** | [Dynamic Components](md-lectures/35.md)<br>([PDF](md-lectures-pdf/35.pdf)) | `#dynamic_components`<br>`❱❱ MORE` | **Q:** How does `<KeepAlive>` interact with dynamic components, and what lifecycle hooks does it trigger?<br>**Key:**  |
| **36** | [Teleport](md-lectures/36.md)<br>([PDF](md-lectures-pdf/36.pdf)) | `#teleport`<br>`❱ CORE` | **Q:** What problem does `<Teleport>` solve for modals and popovers?<br>**Key:**  |
| **37** | [Transitions](md-lectures/37.md)<br>([PDF](md-lectures-pdf/37.pdf)) | `#transitions`<br>`❱❱ MORE` | **Q:** How does the `<Transition>` component map CSS classes during enter and leave phases?<br>**Key:**  |
| **38** | [Suspense](md-lectures/38.md)<br>([PDF](md-lectures-pdf/38.pdf)) | `#suspense`<br>`❱❱❱ ADVANCED` | **Q:** How does the `<Suspense>` boundary orchestrate asynchronous dependencies?<br>**Key:**  |

### ❱❱ MORE — Architecture in Practice (Q39–Q44)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **39** | [Vue Router Core](md-lectures/39.md)<br>([PDF](md-lectures-pdf/39.pdf)) | `#vue_router_core`<br>`❱ CORE` | **Q:** What is the difference between HTML5 Web History and Hash History in Vue Router?<br>**Key:**  |
| **40** | [Vue Router Core](md-lectures/40.md)<br>([PDF](md-lectures-pdf/40.pdf)) | `#vue_router_core`<br>`❱ CORE` | **Q:** How do you define and access dynamic route segments in Vue Router?<br>**Key:**  |
| **41** | [Navigation Guards](md-lectures/41.md)<br>([PDF](md-lectures-pdf/41.pdf)) | `#navigation_guards`<br>`❱❱ MORE` | **Q:** What is the resolution order of Vue Router navigation guards?<br>**Key:**  |
| **42** | [Navigation Guards](md-lectures/42.md)<br>([PDF](md-lectures-pdf/42.pdf)) | `#navigation_guards`<br>`❱❱❱ ADVANCED` | **Q:** How do you cancel a navigation or redirect a user inside a route guard?<br>**Key:**  |
| **43** | [Pinia Stores](md-lectures/43.md)<br>([PDF](md-lectures-pdf/43.pdf)) | `#pinia_stores`<br>`❱ CORE` | **Q:** Why did Vue officially replace Vuex with Pinia?<br>**Key:**  |
| **44** | [Pinia Stores](md-lectures/44.md)<br>([PDF](md-lectures-pdf/44.pdf)) | `#pinia_stores`<br>`❱ CORE` | **Q:** What is the difference between a Setup Store and an Option Store in Pinia?<br>**Key:**  |

### ❱❱❱ ADVANCED — Preprocessor Mastery & System Design (Q45–Q46)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **45** | [The Inception Rule: Over-Nesting, Specificity Creep, and Rendering Cost](md-lectures/45.md)<br>([PDF](md-lectures-pdf/45.pdf)) | `#pinia_stores`<br>`❱❱ MORE` | **Q:** Why must you use `storeToRefs()` when destructuring state from a Pinia store?<br>**Key:** Over-nesting creates runtime debt by multiplying descendant combinator overhead and specificity; author flat, shallow selectors decoupled from DOM nesting. |
| **46** | [Architecture at Scale: Choosing Between BEM, CSS Modules, and Tailwind in 2026](md-lectures/46.md)<br>([PDF](md-lectures-pdf/46.pdf)) | `#pinia_plugins`<br>`❱❱ MORE` | **Q:** How do you subscribe to Pinia state changes outside of a component?<br>**Key:** For modern component frameworks, Tailwind with token variables maximizes velocity; for clean separation of concerns, CSS Modules excels; across heterogeneous backend templates, BEM delivers zero-dependency resilience. |

---

## Part Three: Responsive, Accessible, and Cross-Browser CSS (Q47–Q63)

### ❱ CORE — Responsive Foundations & Fluid Layout (Q47–Q53)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **47** | [The Viewport Contract: Layout Viewports, Visual Viewports, and the Mobile Meta Tag](md-lectures/47.md)<br>([PDF](md-lectures-pdf/47.pdf)) | `#async_components`<br>`❱❱ MORE` | **Q:** How do you lazy-load a Vue component, and why is it important?<br>**Key:** Never include `user-scalable=no` or `maximum-scale=1.0` in viewport meta tags; preserving user pinch-zoom is mandatory under WCAG 1.4.4. |
| **48** | [Perf Optimization](md-lectures/48.md)<br>([PDF](md-lectures-pdf/48.pdf)) | `#perf_optimization`<br>`❱❱❱ ADVANCED` | **Q:** What is `v-memo` and how does it differ from `v-once`?<br>**Key:**  |
| **49** | [Perf Optimization](md-lectures/49.md)<br>([PDF](md-lectures-pdf/49.pdf)) | `#perf_optimization`<br>`❱❱❱ ADVANCED` | **Q:** How do you optimize a Vue application that renders thousands of list items?<br>**Key:**  |
| **50** | [Perf Optimization](md-lectures/50.md)<br>([PDF](md-lectures-pdf/50.pdf)) | `#perf_optimization`<br>`❱❱❱ ADVANCED` | **Q:** What are the most common causes of memory leaks in a Vue SPA, and how do you find them?<br>**Key:**  |
| **51** | [Testing](md-lectures/51.md)<br>([PDF](md-lectures-pdf/51.pdf)) | `#testing`<br>`❱ CORE` | **Q:** What is the difference between `mount` and `shallowMount` in Vue Test Utils?<br>**Key:**  |
| **52** | [Testing](md-lectures/52.md)<br>([PDF](md-lectures-pdf/52.pdf)) | `#testing`<br>`❱❱ MORE` | **Q:** How do you test asynchronous DOM updates triggered by an event in Vue Test Utils?<br>**Key:**  |
| **53** | [Nested Routes](md-lectures/53.md)<br>([PDF](md-lectures-pdf/53.pdf)) | `#nested_routes`<br>`❱❱ MORE` | **Q:** How do you implement nested routes with `<RouterView>`?<br>**Key:**  |

### ❱❱ MORE — Adaptation, Container Queries & User Preferences (Q54–Q60)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **54** | [Testing](md-lectures/54.md)<br>([PDF](md-lectures-pdf/54.pdf)) | `#testing`<br>`❱❱ MORE` | **Q:** How do you assert that a component emitted a specific custom event with the correct payload?<br>**Key:**  |
| **55** | [Ssr Hydration](md-lectures/55.md)<br>([PDF](md-lectures-pdf/55.pdf)) | `#ssr_hydration`<br>`❱ CORE` | **Q:** Why would you choose Server-Side Rendering (SSR) over a standard SPA, and what are the performance trade-offs?<br>**Key:**  |
| **56** | [Ssr Hydration](md-lectures/56.md)<br>([PDF](md-lectures-pdf/56.pdf)) | `#ssr_hydration`<br>`❱❱ MORE` | **Q:** What exactly is 'Hydration' in Vue, and what causes a Hydration Node Mismatch error?<br>**Key:**  |
| **57** | [Pointer Interaction Media: Hover Traps and Touch Adaptation](md-lectures/57.md)<br>([PDF](md-lectures-pdf/57.pdf)) | `#ssr_hydration`<br>`❱❱❱ ADVANCED` | **Q:** How do you avoid memory leaks and fatal crashes when writing SSR-safe Vue components?<br>**Key:** Wrap desktop hover styles and tooltips inside `@media (hover: hover) and (pointer: fine)` to prevent sticky ghost hover states and unintended navigation on touch screens. |
| **58** | [The Elastic Layout: Surviving 400% Zoom and Text-Spacing Overrides](md-lectures/58.md)<br>([PDF](md-lectures-pdf/58.pdf)) | `#architecture_philosophy`<br>`❱❱ MORE` | **Q:** How does Vue's reactive mental model differ fundamentally from React's render cycle?<br>**Key:** Ban fixed-height containers, express typography and spacing in `rem` and `em`, and audit with WCAG text-spacing overrides to prevent catastrophic content clipping. |
| **59** | [Logical Properties and Values: Decoupling Direction from Flow](md-lectures/59.md)<br>([PDF](md-lectures-pdf/59.pdf)) | `#architecture_philosophy`<br>`❱❱ MORE` | **Q:** When architecting a large Vue application, how do you decide what state belongs in a global Pinia store versus local component state?<br>**Key:** Replace physical coordinate properties with flow-relative logical properties like `margin-inline` and `inset-inline-start` to support RTL and vertical writing modes effortlessly. |
| **60** | [Print Stylesheets: Media Architecture, Page Breaks, and Clean Layouts](md-lectures/60.md)<br>([PDF](md-lectures-pdf/60.pdf)) | `#legacy_migration`<br>`❱❱❱ ADVANCED` | **Q:** You are inheriting a massive Vue 2 SPA. How do you approach migrating it to Vue 3 Composition API?<br>**Key:** Use `@media print` to suppress interactive navigation, unclamp scrollable containers, expand link URLs with `attr(href)`, and prevent awkward splits with `break-inside: avoid`. |

### ❱❱❱ ADVANCED — Cross-Browser Engineering & Progressive Enhancement (Q61–Q63)

| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |
|---|---|---|---|
| **61** | [Resets Versus Normalization: Evolution of Cross-Browser Baselines](md-lectures/61.md)<br>([PDF](md-lectures-pdf/61.pdf)) | `#topic_61`<br>`❱❱❱ ADVANCED` | **Q:** Lecture 61: Resets Versus Normalization: Evolution of Cross-Browser Baselines<br>**Key:** CSS resets aggressively zero out all browser default styles, whereas Normalize.css preserves useful element defaults while correcting cross-browser bugs; modern architectures combine box-sizing resets with opinionated baseline styles. |
| **62** | [Progressive Enhancement with Feature Queries: The @supports Rule](md-lectures/62.md)<br>([PDF](md-lectures-pdf/62.pdf)) | `#topic_62`<br>`❱❱❱ ADVANCED` | **Q:** Lecture 62: Progressive Enhancement with Feature Queries: The @supports Rule<br>**Key:** Feature queries allow developers to test browser engine support for CSS properties, layering modern layout mechanisms over stable fallback baselines without fragile user-agent sniffing. |
| **63** | [Systematic Cross-Browser Debugging: Isolation, Reduction, and Workarounds](md-lectures/63.md)<br>([PDF](md-lectures-pdf/63.pdf)) | `#topic_63`<br>`❱❱❱ ADVANCED` | **Q:** Lecture 63: Systematic Cross-Browser Debugging: Isolation, Reduction, and Workarounds<br>**Key:** Isolate browser layout discrepancies by reducing code to a minimal reproducible test case, inspecting computed user-agent properties on real hardware, and deploying targeted standards-based workarounds. |

---

## Master Reader Deck
- **Lecture Deck (Q01–Q56)**: [CSS Q01-Q56.pdf](md-lectures-pdf/CSS%20Q01-Q56.pdf) — Production lectures compiled in sequential order.
