# Brief 06 — The Vue Component Explorer (VCE) & Figure Templates System

Date: 2026-09-15 · Number: 06 · Status: design language established & templates compiled

## 1. Context & Motivation

In the React lecture series (`react-lecture-01`), a Component Explorer panel showcased the file tree on the left and the rendered component on the right. However, that was generated via ad-hoc Markdown code blocks (` ```components `).

For `vue-01`, we require a design language that:
1. Retains **pure standalone Prince-ready HTML figures** (`md-lectures/figures/{n}-{seq}-{slug}.html` via ````html-figure src="..." caption="..."````).
2. Features a modern split layout: Project File Tree on the left (~28-30% width) and Live Component Stage on the right (~70% width).
3. Demonstrates components with **high-contrast, minimal, cool UI controls** (buttons, inputs, counter badges) with component name badges (`<ComponentName.vue>`) anchored directly on the boundary border.
4. Enforces the **"Rule of 3" (Minimal Repetition Ceiling)**: Lists and loops must show strictly at most 3 items to demonstrate repetition cleanly without visual clutter.

## 2. The 6 Standalone Figure Templates (`md-lectures/figures/templates/`)

Six production-ready templates were created in `md-lectures/figures/templates/`:

1. **`01-single-control.html` (Single Component Interactive Preview):** Demonstrates isolated component reactivity with a reactive value badge, increment button (`@click`), and tracking status.
2. **`02-list-repeat-3-items.html` (Collection Rendering & The Rule of 3):** Demonstrates `v-for` and `:key` identification across strictly 3 minimal article items with category pills.
3. **`03-parent-child-props-emits.html` (Component Hierarchy & Data Flow):** Visualizes parent container `<UserProfile.vue>` delivering downward props (`:status`) and nested child `<StatusBadge.vue>` firing upward emits (`@toggle`).
4. **`04-compare-wrong-right.html` (Symmetrical Comparative Duel):** Side-by-side cards contrasting an anti-pattern (severed Proxy, frozen count, red border) with the idiomatic solution (tethered `toRefs`, live updated count, emerald border).
5. **`05-two-way-binding.html` (Two-Way Form Binding & defineModel):** Demonstrates custom input synchronization with parent ref reflection and `defineModel()` internal tracking.
6. **`06-pinia-store-dispatch.html` (Global State & Pinia Store Architecture):** Decoupled store compartments (State, Getters) wired directly to a consumer component dispatching actions.

## 3. Dedicated PDF Showcase

A dedicated compilation tool `src/build-figure-showcase.mjs` was built to assemble all 6 templates into:
- **`diagram-lab/output/vue-01/Vue Figure Templates.pdf`**

Each template was rendered to high-resolution PNG (`preview-1.png` through `preview-6.png`) and audited for visual perfection. All templates meet the 10/10 quality standard.
