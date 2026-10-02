# Vue.js Interview Questions

A unified, dependency-ordered curriculum for **Vue.js without Nuxt.js** (Core Vue 3: Reactivity Engine, Component Architecture, Composition API, SFC Template Compilation, Virtual DOM patching, Vue Router, Pinia, and Performance Optimization).

Status: **FROZEN** (60 questions established).

## Format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
| :--- | :--- | :--- | :--- | :--- |
| 01 | ❱ CORE | `#script_setup` | What does the `<script setup>` block actually do during SFC compilation? | The compile-time macro transform vs the `setup()` function. |
| 02 | ❱ CORE | `#ref_vs_reactive` | When should you use `ref()` versus `reactive()` in Vue 3? | The primitive trap and object wrapping. |
| 03 | ❱❱ MORE | `#ref_vs_reactive` | How does Vue automatically unwrap refs, and where does unwrapping fail? | Template unwrapping vs reactive object unwrapping rules. |
| 04 | ❱ CORE | `#reactivity_loss` | Why does destructuring a `reactive` object break reactivity, and how do you fix it? | Losing the Proxy connection during assignment. |
| 05 | ❱ CORE | `#computed` | How do `computed` properties cache their values, and when do they re-evaluate? | Dirty-checking bitmasks and lazy evaluation. |
| 06 | ❱❱ MORE | `#computed` | Why is it considered an anti-pattern to perform side-effects inside a computed property? | Predictability and the danger of infinite render loops. |
| 07 | ❱ CORE | `#watchers` | What is the difference between `watch()` and `watchEffect()`? | Explicit source tracking vs automatic dependency collection. |
| 08 | ❱ CORE | `#props_emits` | How do you enforce prop types and default values in `<script setup>` using TypeScript? | `defineProps` and `withDefaults`. |
| 09 | ❱ CORE | `#props_emits` | Why is mutating a prop directly inside a child component forbidden? | One-way data flow and avoiding unpredictable state mutations. |
| 10 | ❱❱ MORE | `#props_emits` | How does `defineEmits` enforce event contracts between parent and child? | Typing event payloads in TypeScript. |
| 11 | ❱ CORE | `#v_model` | How does `v-model` work under the hood on custom components in Vue 3? | The `modelValue` prop and `update:modelValue` event pairing. |
| 12 | ❱❱ MORE | `#v_model` | How do you bind multiple `v-model` directives on a single component? | Argument bindings like `v-model:title` and `v-model:content`. |
| 13 | ❱❱ MORE | `#v_model` | What is the `defineModel` macro introduced in Vue 3.4, and how does it simplify two-way binding? | Returning a ref that syncs automatically with the parent. |
| 14 | ❱ CORE | `#provide_inject` | When should you use `provide`/`inject` instead of passing props? | Solving prop drilling across deep component hierarchies. |
| 15 | ❱❱ MORE | `#provide_inject` | How do you ensure injected values remain reactive but cannot be mutated by the receiver? | Passing `readonly()` refs and dedicated updater functions. |
| 16 | ❱❱ MORE | `#props_emits` | What are "fallthrough attributes" (`$attrs`) and when would you disable attribute inheritance? | Wrapping native elements and moving `class`/`style`/listeners to inner elements. |
| 17 | ❱ CORE | `#vdom_patching` | Why is the `key` attribute mandatory in a `v-for` loop? | How the Virtual DOM diffing algorithm identifies moved vs destroyed nodes. |
| 18 | ❱❱ MORE | `#template_compiler` | Why is it an anti-pattern to use `v-if` and `v-for` on the same HTML element? | Precedence rules and unintended performance penalties. |
| 19 | ❱ CORE | `#slots` | What is the difference between default slots, named slots, and dynamic slot names? | Distributing complex markup into specific component regions. |
| 20 | ❱❱ MORE | `#slots` | How do scoped slots work, and when would you use them instead of props? | Inverting control so the parent defines the UI using child-provided data. |
| 21 | ❱ CORE | `#dynamic_components` | How do you implement dynamic components using `<component :is="...">`? | Switching between tabs or views without routing. |
| 22 | ❱❱ MORE | `#dynamic_components` | How does `<KeepAlive>` interact with dynamic components, and what lifecycle hooks does it trigger? | Caching component state and the `onActivated` / `onDeactivated` hooks. |
| 23 | ❱ CORE | `#teleport` | What problem does `<Teleport>` solve for modals and popovers? | Escaping CSS `overflow: hidden` and `z-index` stacking contexts. |
| 24 | ❱❱ MORE | `#transitions` | How does the `<Transition>` component map CSS classes during enter and leave phases? | The 6-class animation lifecycle. |
| 25 | ❱ CORE | `#custom_composables` | What are composables in Vue 3, and how do they replace Vue 2 mixins? | The `useXxx` pattern and solving the mixin namespace collision. |
| 26 | ❱❱ MORE | `#custom_composables` | What is the `MaybeRef` or `MaybeRefOrGetter` pattern in VueUse? | Making composables flexible enough to accept refs, getters, or raw values. |
| 27 | ❱❱ MORE | `#custom_composables` | How do you handle setup and teardown of event listeners inside a composable? | Preventing memory leaks with `onUnmounted` and `onScopeDispose`. |
| 28 | ❱❱❱ ADVANCED | `#custom_composables` | What is `effectScope` and when would a library author use it? | Disposing multiple reactive effects at once outside of a component lifecycle. |
| 29 | ❱ CORE | `#proxy_reactivity` | How does Vue 3's reactivity system differ fundamentally from Vue 2? | The Proxy revolution and the end of `$set()`. |
| 30 | ❱❱ MORE | `#proxy_reactivity` | How does Vue's reactivity engine know which component to re-render when a property changes? | The silent `track()` and `trigger()` dependency graph. |
| 31 | ❱❱❱ ADVANCED | `#proxy_reactivity` | Can you explain the `has` and `deleteProperty` Proxy traps in Vue 3 reactivity? | Intercepting the `in` operator and `delete` keyword. |
| 32 | ❱❱ MORE | `#watchers` | When should you use `deep: true` in a watcher, and what are its performance implications? | Traversing large object trees on every mutation. |
| 33 | ❱❱❱ ADVANCED | `#effect_scheduler` | What are the differences between `flush: 'pre'`, `post`, and `sync` in Vue watchers? | Re-rendering timing and DOM state guarantees. |
| 34 | ❱❱❱ ADVANCED | `#effect_scheduler` | Why does Vue batch reactivity updates, and how does `nextTick()` interact with the microtask queue? | Preventing multiple DOM updates in the same synchronous tick. |
| 35 | ❱❱ MORE | `#shallow_reactivity` | When would you use `shallowRef()` instead of `ref()`? | Optimizing large data structures or third-party instances. |
| 36 | ❱❱❱ ADVANCED | `#shallow_reactivity` | How does `triggerRef()` work in conjunction with shallow reactivity? | Forcing a UI update when mutating deep properties of a shallow ref. |
| 37 | ❱ CORE | `#vue_router_core` | What is the difference between HTML5 Web History and Hash History in Vue Router? | URL aesthetics and server-side fallback configuration. |
| 38 | ❱ CORE | `#vue_router_core` | How do you define and access dynamic route segments in Vue Router? | Matching `/users/:id` and reading `route.params`. |
| 39 | ❱❱ MORE | `#nested_routes` | How do you implement nested routes with `<RouterView>`? | Composing complex layouts with parent and child route hierarchies. |
| 40 | ❱❱ MORE | `#navigation_guards` | What is the resolution order of Vue Router navigation guards? | The lifecycle from `beforeEach` to `beforeResolve` and `afterEach`. |
| 41 | ❱❱❱ ADVANCED | `#navigation_guards` | How do you cancel a navigation or redirect a user inside a route guard? | Returning `false`, a string path, or a route object. |
| 42 | ❱ CORE | `#pinia_stores` | Why did Vue officially replace Vuex with Pinia? | First-class TypeScript support, dropped mutations, and flat architecture. |
| 43 | ❱ CORE | `#pinia_stores` | What is the difference between a Setup Store and an Option Store in Pinia? | Using the Composition API directly inside store definitions. |
| 44 | ❱❱ MORE | `#pinia_stores` | Why must you use `storeToRefs()` when destructuring state from a Pinia store? | Preserving reactivity outside the store context. |
| 45 | ❱❱ MORE | `#pinia_plugins` | How do you subscribe to Pinia state changes outside of a component? | Using `$subscribe` for persistence like `localStorage`. |
| 46 | ❱❱ MORE | `#async_components` | How do you lazy-load a Vue component, and why is it important? | `defineAsyncComponent()` and Webpack/Vite bundle splitting. |
| 47 | ❱❱❱ ADVANCED | `#suspense` | How does the `<Suspense>` boundary orchestrate asynchronous dependencies? | Showing a fallback skeleton while multiple async components resolve. |
| 48 | ❱❱❱ ADVANCED | `#template_compiler` | What are patch flags and static hoisting in the Vue 3 compiler? | How Vue skips diffing static content to achieve near-native performance. |
| 49 | ❱❱❱ ADVANCED | `#perf_optimization` | What is `v-memo` and how does it differ from `v-once`? | Skipping VDOM sub-tree updates based on dependency arrays. |
| 50 | ❱❱❱ ADVANCED | `#perf_optimization` | How do you optimize a Vue application that renders thousands of list items? | Virtual scrolling/windowing and avoiding reactivity on static data with `markRaw`. |
| 51 | ❱❱❱ ADVANCED | `#perf_optimization` | What are the most common causes of memory leaks in a Vue SPA, and how do you find them? | Dangling DOM event listeners and uncleared third-party instances. |
| 52 | ❱ CORE | `#testing` | What is the difference between `mount` and `shallowMount` in Vue Test Utils? | Rendering full child trees vs stubbing out children. |
| 53 | ❱❱ MORE | `#testing` | How do you assert that a component emitted a specific custom event with the correct payload? | Accessing the `wrapper.emitted()` array. |
| 54 | ❱❱ MORE | `#testing` | How do you test asynchronous DOM updates triggered by an event in Vue Test Utils? | Awaiting `trigger()` and using `flushPromises()`. |
| 55 | ❱ CORE | `#ssr_hydration` | Why would you choose Server-Side Rendering (SSR) over a standard SPA, and what are the performance trade-offs? | First Contentful Paint vs Time to Interactive. |
| 56 | ❱❱ MORE | `#ssr_hydration` | What exactly is 'Hydration' in Vue, and what causes a Hydration Node Mismatch error? | When the server HTML and the browser's Virtual DOM violently disagree. |
| 57 | ❱❱❱ ADVANCED | `#ssr_hydration` | How do you avoid memory leaks and fatal crashes when writing SSR-safe Vue components? | The fatal mistake of accessing `window` in setup. |
| 58 | ❱❱ MORE | `#architecture_philosophy` | How does Vue's reactive mental model differ fundamentally from React's render cycle? | The difference between a targeted 'push' system and a top-down 'pull' diffing engine. |
| 59 | ❱❱ MORE | `#architecture_philosophy` | When architecting a large Vue application, how do you decide what state belongs in a global Pinia store versus local component state? | The trap of putting everything in a global store just because you can. |
| 60 | ❱❱❱ ADVANCED | `#legacy_migration` | You are inheriting a massive Vue 2 SPA. How do you approach migrating it to Vue 3 Composition API? | Real-world engineering isn't greenfield code; it's replacing engines mid-flight. |
