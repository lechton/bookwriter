# Vue.js Interview Question Bank (vue-01)

Status: **FINALIZED AND FROZEN (60 Questions)**

This directory hosts the question bank and topic vocabulary for the `vue-01` lecture series (`diagram-lab/output/vue-01/`), covering **Vue.js without Nuxt.js** (Core Vue 3: Reactivity Engine, Component Architecture, Composition API, SFC Template Compilation, Virtual DOM patching, Vue Router, Pinia, and Performance Optimization). The design rationale and track decisions are recorded in `diagram-lab/output/vue-01/briefs/2026_09_15_04_question_bank_design.md`.

## Files

- `questions.md`: The question bank formatted as `# | Tier | Topic | Question | Hook`. The rows define the curriculum, with question numbers matching lecture filenames (`md-lectures/{n}.md`).
- `topics.md`: Controlled topic vocabulary for tagging each question.
- `README.md`: This file, documenting curriculum design and rationale.

## Question Tracks (Vue.js without Nuxt.js)

1. **Track 1: Core Reactivity & Composition API**
   - ES6 Proxy reactivity vs Vue 2 `Object.defineProperty`
   - `ref()` vs `reactive()` (unwrapping rules, destructuring reactivity loss)
   - `computed()` (caching, dependency tracking, dirty checking)
   - `watch()` vs `watchEffect()` (immediate, flush timing: `pre`, `post`, `sync`)
   - `toRef()`, `toRefs()`, `shallowRef()`, `shallowReactive()`, `triggerRef()`
   - Custom composables architecture and state isolation

2. **Track 2: Component Architecture, Templates & Directives**
   - `<script setup>` syntax and compile-time macros (`defineProps`, `defineEmits`, `defineExpose`, `defineSlots`)
   - Props down, events up, `v-model` with arguments and custom modifiers
   - Slots (default, named, scoped slots, dynamic slot names)
   - Dependency injection: `provide()` and `inject()` (injection keys with Symbols, reactivity guarantees)
   - Template compilation: Static hoisting, patch flags, block tree optimization
   - Virtual DOM diffing & key attribute mechanics
   - Built-in components: `<KeepAlive>`, `<Teleport>`, `<Suspense>`, `<Transition>`

3. **Track 3: Application Architecture, State Management & Routing**
   - Single-Page Application (SPA) architecture without meta-frameworks
   - Vue Router 4: dynamic routing, nested routes, navigation guards lifecycle, scroll behavior
   - Pinia state management: stores (Setup stores vs Option stores), actions, getters, subscriptions, plugin system
   - Performance optimization: async components, `v-once`, `v-memo`, bundle splitting
   - Testing strategies: Unit testing with Vitest & Vue Test Utils, component interaction testing

4. **Track 4: Architectural Philosophy & SSR**
   - Core SSR mechanics (`createSSRApp`), Hydration mismatches, Node server constraints
   - Vue's reactive "push" vs React's immutable "pull" diffing
   - Global vs Local state boundaries
   - Legacy Vue 2 to Vue 3 migration strategies at scale
