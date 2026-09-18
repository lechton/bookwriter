# Brief 03 — Source Research & Download Plan: The Authoritative Vue.js Corpus (vue-01)

Date: 2026-09-15 · Number: 03 · Status: research complete, download plan approved and executed 2026-09-15

## What this brief decides

This brief defines the definitive local documentation corpus for `vue-01`, based on our systematic analysis of `documentation official/vue/resources/chatGPT_resources.md`. The target domain is **Vue.js without Nuxt.js** (Core Vue 3: Reactivity Engine, Component Architecture, Composition API, SFC Template Compilation, Virtual DOM patching, Vue Router, Pinia, and Performance Optimization).

The goal of this corpus is not to build a generic tutorial stash, but to create a searchable, highly authoritative technical knowledge base that equips an AI author (and human candidates) to pass staff-level interview questions.

---

## 1. The Core Canon (What Makes a Source Authoritative)

In technical interviews, candidate answers typically fall into three depth tiers:
- **Junior/Mid**: *"What is the syntax for `watch`?"* (Answered by general documentation).
- **Senior**: *"When does the watcher run relative to DOM flushing and child component updates?"* (Answered by scheduler architecture and API contracts).
- **Staff/Lead**: *"How does Vue's dependency graph deduplicate jobs in the microtask queue, why does computed caching rely on dirty-checking bitmasks, and why was Reactivity Transform dropped?"* (Answered by `vuejs/core` source code, RFC design discussions, and compiler transforms).

To answer at all three levels, our local corpus must combine **specifications & RFCs** (the *why*), **official documentation** (the *contract*), **engine source code & tests** (the *mechanical truth*), and **idiomatic enterprise composables** (the *practice at scale*).

---

## 2. Inventory of Repositories to Clone

We propose organizing the local corpus under `documentation official/vue/resources/` into five clean domains:

| Category | Repository | Upstream Link | Depth Tier | Authoritative For |
|---|---|---|---|---|
| **Core** | `vuejs/docs` | https://github.com/vuejs/docs | Tier 1 (10/10) | The single most important repository. Official Vue 3 Guide, API reference, Essentials, Components in Depth, Reactivity in Depth, TypeScript guide, Performance, Security, Accessibility. |
| **Core** | `vuejs/core` | https://github.com/vuejs/core | Tier 1 (10/10) | The normative engine implementation. Packages: `@vue/reactivity` (`ref.ts`, `reactive.ts`, `effect.ts`, `computed.ts`, `dep.ts`), `@vue/runtime-core` (`renderer.ts`, `vnode.ts`, `scheduler.ts`, `component.ts`), `@vue/compiler-sfc`, and tests (`packages/reactivity/__tests__/`). |
| **Core** | `vuejs/rfcs` | https://github.com/vuejs/rfcs | Tier 1 (10/10) | Architectural rationale. Contains the Composition API RFC, `<script setup>` RFC, defineModel RFC, Reactive Props Destructure RFC, and dropped proposals (Reactivity Transform). Answers "Why did Vue design it this way?". |
| **Ecosystem** | `vuejs/router` | https://github.com/vuejs/router | Tier 1 (9/10) | Vue Router 4 documentation and source. History modes (HTML5 Web History vs Hash), navigation guard resolution lifecycle, scroll behavior, dynamic routes, typed routes, route records. |
| **Ecosystem** | `vuejs/pinia` | https://github.com/vuejs/pinia | Tier 1 (9/10) | Official Vue 3 store. Setup stores vs Option stores, reactive state unwrapping, `storeToRefs()`, actions, getters, subscriptions (`$subscribe`, `$onAction`), plugins, and SSR hydration. |
| **Ecosystem** | `vueuse/vueuse` | https://github.com/vueuse/vueuse | Tier 2 (9/10) | Premier standard for enterprise Composition API design. Teaches composable conventions (`useXxx`), `MaybeRef` reactive wrapping, cleanup with `onScopeDispose`, SSR-safe browser events. |
| **Tooling** | `vuejs/create-vue` | https://github.com/vuejs/create-vue | Tier 2 (7/10) | The official Vite-powered project scaffolder representing what the Vue team considers the canonical modern project structure (replacing legacy Vue CLI). |
| **Tooling** | `vuejs/eslint-plugin-vue` | https://github.com/vuejs/eslint-plugin-vue | Tier 2 (8/10) | The living best-practices catalog. Rule documentation provides concrete real-world anti-patterns and preferred patterns (mutating props, side-effects in computed, unsafe v-html). |
| **Tooling** | `vuejs/language-tools` | https://github.com/vuejs/language-tools | Tier 2 (8/10) | Volar and `vue-tsc` source. Explains template type checking, SFC virtual code generation, and TypeScript compilation in `.vue` files. |
| **Testing** | `vuejs/test-utils` | https://github.com/vuejs/test-utils | Tier 2 (8/10) | Official low-level component testing library (`mount`, wrappers, stubbing, emitted event assertion, asynchronous state updates). |
| **History** | `vuejs/v3-migration-guide` | https://github.com/vuejs/v3-migration-guide | Tier 2 (8/10) | Detailed architectural diff between Vue 2 and Vue 3 (Reactivity changes, `$listeners` removal, `v-model` unification, filters removal). Crucial for legacy migration interview questions. |

---

## 3. Deliberate Exclusions

1. **Nuxt.js (`nuxt/nuxt`)**: Explicitly excluded. Nuxt is a full-stack meta-framework. Including it would dilute the focus of `vue-01`, which is dedicated to core Vue 3 client-side architecture, Vue Router, and Pinia.
2. **Generic Question Repositories (`sudheerj/vuejs-interview-questions`)**: Excluded from local technical authority. Question lists may be consulted as indexes, but will never be cited in lectures.
3. **Heavy Build Output & Lockfiles**: All clones will exclude `node_modules/`, `dist/`, `.output/`, and lockfiles to keep the workspace token-efficient and lightweight.

---

## 4. Proposed Local Folder Organization

```
documentation official/vue/
├── README.md                  <- Master handout and authority hierarchy map
├── books/                     <- Unpacked licensed EPUBs / reference texts
└── resources/
    ├── core/
    │   ├── docs/              <- vuejs/docs (shallow clone)
    │   ├── core/              <- vuejs/core (shallow clone)
    │   └── rfcs/              <- vuejs/rfcs (shallow clone)
    ├── ecosystem/
    │   ├── router/            <- vuejs/router (shallow clone)
    │   ├── pinia/             <- vuejs/pinia (shallow clone)
    │   └── vueuse/            <- vueuse/vueuse (shallow clone)
    ├── tooling/
    │   ├── create-vue/        <- vuejs/create-vue (shallow clone)
    │   ├── eslint-plugin-vue/ <- vuejs/eslint-plugin-vue (shallow clone)
    │   └── language-tools/    <- vuejs/language-tools (shallow clone)
    ├── testing/
    │   └── test-utils/        <- vuejs/test-utils (shallow clone)
    └── history/
        └── migration-guide/   <- vuejs/v3-migration-guide (shallow clone)
```

---

## 5. Authority Hierarchy When Sources Disagree

1. **Vue Core Source Code & RFCs First (`resources/core/core/`, `resources/core/rfcs/`)**: The definitive normative authority for how reactivity executes, how the scheduler batches jobs, and how patch flags optimize the VDOM.
2. **Official Documentation Second (`resources/core/docs/`, `resources/ecosystem/`)**: The primary authority for idiomatic API contracts, public guarantees, and recommended practices.
3. **Ecosystem Standards Third (`resources/ecosystem/vueuse/`, `resources/tooling/eslint-plugin-vue/`)**: The authority for practical composable patterns, naming conventions, and anti-pattern linting.
4. **Published Books Fourth**: Useful for overarching enterprise design patterns and long-form context.
5. **Third-Party Cheat Sheets Never**: Never cited.

---

## 6. Execution Command (Shallow Clone Script)

When approved, the following automated shell execution will download all 11 selected repositories using git shallow clones (`--depth 1`):

```bash
mkdir -p "documentation official/vue/resources/core" \
         "documentation official/vue/resources/ecosystem" \
         "documentation official/vue/resources/tooling" \
         "documentation official/vue/resources/testing" \
         "documentation official/vue/resources/history"

# Core
git clone --depth 1 https://github.com/vuejs/docs.git "documentation official/vue/resources/core/docs"
git clone --depth 1 https://github.com/vuejs/core.git "documentation official/vue/resources/core/core"
git clone --depth 1 https://github.com/vuejs/rfcs.git "documentation official/vue/resources/core/rfcs"

# Ecosystem
git clone --depth 1 https://github.com/vuejs/router.git "documentation official/vue/resources/ecosystem/router"
git clone --depth 1 https://github.com/vuejs/pinia.git "documentation official/vue/resources/ecosystem/pinia"
git clone --depth 1 https://github.com/vueuse/vueuse.git "documentation official/vue/resources/ecosystem/vueuse"

# Tooling
git clone --depth 1 https://github.com/vuejs/create-vue.git "documentation official/vue/resources/tooling/create-vue"
git clone --depth 1 https://github.com/vuejs/eslint-plugin-vue.git "documentation official/vue/resources/tooling/eslint-plugin-vue"
git clone --depth 1 https://github.com/vuejs/language-tools.git "documentation official/vue/resources/tooling/language-tools"

# Testing
git clone --depth 1 https://github.com/vuejs/test-utils.git "documentation official/vue/resources/testing/test-utils"

# History & Migration
git clone --depth 1 https://github.com/vuejs/v3-migration-guide.git "documentation official/vue/resources/history/migration-guide"
```

---

## 7. Next Steps

1. User approves the 11-repository download plan.
2. Execute the shallow clones into `documentation official/vue/resources/`.
3. Update `documentation official/vue/README.md` with the verified local file paths and question-to-authority citation mapping.
4. Proceed to finalize the 60-question bank in `diagram-lab/questions-vue/questions.md`.
