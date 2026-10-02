# Controlled Topic Vocabulary (Vue.js without Nuxt.js)

Status: **FINALIZED**

One primary tag per question. Add a tag here before using it in `questions.md`.

## Track One — Core Reactivity & Composition API
- `#proxy_reactivity` — ES6 Proxy traps vs getter/setter reactivity, handler operations (`get`, `set`, `deleteProperty`, `has`)
- `#ref_vs_reactive` — primitive wrapping, object wrappers, unwrapping rules in templates and reactive objects
- `#reactivity_loss` — destructuring traps, `toRef()`, `toRefs()` mechanics and preservation of reactivity
- `#shallow_reactivity` — `shallowRef()`, `shallowReactive()`, mutation bypass and `triggerRef()`
- `#computed` — dirty-checking flags, caching behavior, lazy evaluation, computed setter usage
- `#watchers` — `watch()` vs `watchEffect()`, deep watching, immediate triggers, cleanup callbacks
- `#effect_scheduler` — flush timing (`pre`, `post`, `sync`), microtask queue, batching, and `nextTick()`
- `#custom_composables` — stateful logic extraction, scope cleanup, naming conventions, singleton vs instance state

## Track Two — Component Architecture, Templates & Directives
- `#script_setup` — compile-time transform, macro ergonomics (`defineProps`, `defineEmits`, `defineExpose`, `defineSlots`)
- `#props_emits` — one-way data flow, prop validation, event contracts, typed declarations in TypeScript
- `#v_model` — two-way binding mechanics, argument bindings (`v-model:title`), custom modifiers
- `#slots` — default, named, and scoped slot geometry, slot compilation to functions
- `#provide_inject` — dependency injection across component hierarchy, Symbol keys, reactivity guarantees
- `#template_compiler` — SFC compiler stages, AST transforms, static hoisting, patch flags, block tree
- `#vdom_patching` — Virtual DOM diffing algorithm, keyed vs non-keyed fragment reconciliation, `key` attribute traps
- `#dynamic_components` — `<component :is="...">`, component caching with `<KeepAlive>`, max cached instances
- `#teleport` — portal DOM rendering, target resolution, modal/popover stacking contexts
- `#suspense` — async dependency orchestration, fallback rendering
- `#transitions` — CSS transition/animation classes, JavaScript lifecycle hooks, `<TransitionGroup>` coordinate transforms

## Track Three — Application Architecture, State & Routing
- `#vue_router_core` — history modes (HTML5 Web History vs Hash), route matching, dynamic segments
- `#navigation_guards` — global, per-route, and in-component guards execution order, async cancellation
- `#nested_routes` — `<RouterView>` nesting, layout composition, child route hierarchies
- `#pinia_stores` — setup stores vs option stores, state, getters, actions, direct state mutation
- `#pinia_plugins` — store hydration, state persistence, subscriptions (`$subscribe`, `$onAction`)
- `#async_components` — `defineAsyncComponent`, bundle splitting, lazy loading strategies
- `#perf_optimization` — `v-once`, `v-memo`, large list virtualization, reducing reactivity overhead
- `#testing` — unit testing with Vitest and Vue Test Utils, shallow mounting vs full mounting, event triggering

## Track Four — Architectural Philosophy & SSR
- `#ssr_hydration` — `createSSRApp` vs `createApp`, hydration mismatches, Node.js server constraints
- `#architecture_philosophy` — Vue's reactive "push" vs React's immutable "pull" diffing, state boundaries
- `#legacy_migration` — Refactoring Vue 2 Options API to Vue 3 Composition API at scale
