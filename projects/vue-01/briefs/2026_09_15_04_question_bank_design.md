# Brief 04 — Question Bank Design & Freeze (vue-01)

Date: 2026-09-15 · Number: 04 · Status: question bank finalized and frozen

## What this brief decides

This brief records the design and population of the 60-question interview bank for the `vue-01` project (Vue.js without Nuxt.js), frozen as of 2026-09-15 in `diagram-lab/questions-vue/questions.md`.

## Curriculum Architecture

The curriculum is structured sequentially into four primary tracks, mirroring the natural learning progression and dependency graph of Vue 3's architecture.

### Track 1: Core Reactivity & Composition API (Q01-Q18)
Before a developer can build components, they must understand the engine. This track covers the ES6 Proxy revolution over Vue 2's `Object.defineProperty`, primitive vs object wrapping (`ref` vs `reactive`), reactivity unwrapping rules, the traps of destructuring, dirty-checking in computed properties, and the microtask scheduler. It concludes with the Composition API paradigm (`useXxx` composables, `MaybeRefOrGetter`, and `onScopeDispose` cleanup).

### Track 2: Component Architecture, Templates & Directives (Q19-Q38)
With the reactivity engine understood, this track focuses on the UI layer. It covers the `<script setup>` compile-time transform, strict one-way data flow (props down, events up), two-way binding mechanics (`v-model` and `defineModel`), dependency injection (`provide`/`inject`), Virtual DOM diffing (patch flags and the necessity of `key`), slot geometry, dynamic components, `<KeepAlive>`, and boundary management (`<Teleport>`, `<Suspense>`).

### Track 3: Application Architecture, State Management, Routing & Testing (Q39-Q54)
The final track zooms out to the Single-Page Application (SPA) scale. It covers Vue Router 4 (history modes, route matching, navigation guard resolution), Pinia (replacing Vuex, setup stores, state destructuring, subscriptions), performance optimization (virtualization, `v-memo`, memory leak prevention), async component chunking, and Vue Test Utils (`mount`, `shallowMount`, `flushPromises`).

### Track 4: Architectural Philosophy & SSR (Q55-Q60)
The capstone track. It addresses the reality of Vue running on a Node.js server (core SSR mechanics, hydration mismatches, and memory leak prevention) without introducing Nuxt, and explicitly covers the architectural trade-offs: the mental model comparison against React, defining state boundaries, and strategies for migrating massive legacy Vue 2 applications to Vue 3.

## Typology & Depth Tiering

The 60 questions are distributed across three depth tiers to cover the full spectrum of technical interviews:

- `❱ CORE` (22 questions): The foundational mechanics every professional Vue developer must know (e.g., `v-show` vs `v-if`, Vuex to Pinia migration, `mount` vs `shallowMount`, SSR vs SPA performance).
- `❱❱ MORE` (26 questions): Deep mechanical understanding expected at the mid-to-senior level (e.g., unwrapping rules, `defineModel` macros, route guard lifecycle, Vue vs React mental models).
- `❱❱❱ ADVANCED` (12 questions): Staff/Lead level architectural insight (e.g., `flush: 'pre/post/sync'`, microtask job batching, patch flags and static hoisting compiler optimizations, SSR memory leaks, legacy migrations).

## Controlled Vocabulary

To ensure thematic consistency, the 54 questions draw from a strict controlled vocabulary of 29 topic tags defined in `diagram-lab/questions-vue/topics.md` (e.g., `#proxy_reactivity`, `#effect_scheduler`, `#vdom_patching`).

## Next Steps

With the question bank frozen, the project officially enters the **Lecture Production** phase. Production will proceed row-by-row, building each markdown lecture into `md-lectures/`, adhering strictly to `PEDAGOGICAL-CLARITY.md` and maintaining the zero-warning Prince PDF build gate.
