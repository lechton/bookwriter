# FIGURE DESIGN SYSTEM — Vue.js Interview Lectures (vue-01)
## The Modern Benchmark Standard

This document is the permanent visual pattern catalog for all figures across the `vue-01` lecture series. It codifies the breakthrough visual architecture established in `../css-01/` and adapts it to Vue.js runtime, reactivity, and component architecture.

When creating a new figure for any Vue lecture, **NEVER invent a design from scratch**. Select, clone, and adapt one of the proven Figure Archetypes documented below.

---

## 1. The Cardinal Visual Laws (The "Anti-Ugly" Gate)

### Law 1: The "Never Text-Only" Law
A figure inside `.print-fig` is an illustration of **spatial, temporal, mechanical, or physical reality**.
- ❌ **BANNED:** Wrapping plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without any graphical diagram. That is a table, not a figure.
- ✅ **MANDATORY:** Every figure card MUST contain an authentic graphical substrate: a Proxy trap flow with connector circles, a component hierarchy tree with data flow arrows, an AST compiler pipeline, a Virtual DOM diffing matrix with patch flag badges, or a Pinia action dispatch track.

### Law 2: Strong Demarcation & Modern Surface Geometry
- Container: `.print-fig` with `border: 2px solid #0f172a`, `border-radius: 6px`–`8px`, `background: #ffffff`, and subtle elevation `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06)`.
- Cards: `border: 2px solid`, pure white interiors, crisp borders. Never use pale 1px borders or faded pastel backgrounds.
- Canonical Palette:
  - **Emerald/Vue Green (#059669 / #10b981)**: Reactive updates, successful bindings, pass state, clean flow.
  - **Teal (#0e7490)**: Component layout, blueprint structures, props/events pipelines.
  - **Crimson (#9f1239)**: Reactivity loss, stale cache, silent mutations, infinite loops.
  - **Slate (#1e293b / #0f172a)**: Neutral structure, physical browser chrome, runtime queues.

### Law 3: Native Vector Chrome (Zero Platform Emojis)
- ❌ **BANNED:** Using platform yellow emojis (e.g. `🔒`, `✓`, `✕`, `📱`).
- ✅ **MANDATORY:** Use clean inline SVG icons or crisp unicode text glyphs (`✓ REACTIVE`, `✕ BROKEN`, inline SVG lock/arrows).

### Law 4: Exact Mathematical Centering for Guides & Markers
- Timeline guides, tree tracks, and node markers must share identical mathematical centers so connector lines pass cleanly through the center of every node.

### Law 5: Symmetrical Comparison & Page-Break Isolation
- Compare figures must feature matching header pills, symmetrical title bars, matching interior diagram heights, and identical 2-line footers (`min-height: 52px;`).
- Total figure height must strictly respect the printable letter-size budget (~380px–420px total) so figure and figcaption remain unified on a single page with zero page-break splits.

### Law 6: The Anti-Meta-Descriptor Law (Pure Archetypical UI)
- ❌ **BANNED:** Never use meta-descriptions, diagnostic labels, or key-value captions inside component bodies (e.g. `Current count in memory: 5`, `Binding trigger: + Increment`, `DOM rendered value:`, `Engine status:`, `Input field:`).
- ✅ **MANDATORY:** Make all rendered UI purely archetypical and visually self-evident. The student must immediately infer what the component is from its authentic, elegant flat design:
  - **Counter**: A prominent bold number (`5`) with stepper buttons (`− Decrease` and `+ Increase`).
  - **Article Feed**: Clean flat article cards showing a bold headline, 2-line excerpt, journalist byline (`Marcus Vance · 4 min read`), and a category badge (`Metro`).
  - **User Profile**: Avatar initials circle (`ER`), journalist name, editorial title, status pill (`● Active Contributor`), and action buttons (`Following`, `Message`).
  - **Music Player**: Track title, artist, progress scrubber bar with playhead thumb, timestamps (`02:28 / 04:15`), and vector transport controls (`⏮`, `▶ Play` / `⏸ Pause`, `⏭`).
  - **Search Box**: An authentic input pill with magnifying glass SVG, active query text, `✕` clear button, and result count (`14 stories found for "climate"`).
  - **Cart / Store**: Order line items with currency amounts, order total, and `Checkout` button.

### Law 7: Progressive Component Decomposition (Meaningful Stepped Visualization)
- When a lecture teaches a system composed of multiple interacting components (e.g. a higher-level composite component and its nested sub-components):
  - ❌ **BANNED:** Never cram 5–6 components with all their internal buttons, steppers, and props into a single crowded, unreadable diagram.
  - ✅ **MANDATORY: Visualize in Meaningful Steps (Two-Panel Progression on the Same Page)**:
    - **Panel 1 (High-Level / Macro View)**: Present the higher-level container (e.g., `CartDrawer.vue` highlighted in the sidebar) showing its clean, intact rendered HTML view without exposing internal component boundaries prematurely.
    - **Panel 2 (Dissected / Micro View)**: Directly below Panel 1, present the second panel that takes that exact component and dissects it into its constituent child components (e.g., `<CartItemRow.vue>` with internal steppers `[−] 1 [+]`, unit prices, and remove buttons, plus `<CartSummary.vue>`).
    - **Sidebar State Synchronization:** In Panel 2, the left file tree **dynamically shifts its active highlight** to the child component being dissected (`CartItemRow.vue` with `.active` pill). This immediately visually links the IDE file selection to the deconstructed component architecture.

---

## 2. The Vue Component Explorer (VCE) Design Language

Adapted from modern component explorer interfaces and reimagined for standalone Prince-ready HTML figures, the **Vue Component Explorer (VCE)** is the primary visual architecture for the `vue-01` series. It displays the codebase architecture on the left and the live rendered UI consequence on the right.

### Core Architectural Laws of the VCE:
1. **The Two-Column Split Window:** Every VCE figure features a macOS window chrome bar with traffic lights (red, yellow, green dots), an active title (e.g. `ArticleFeed.vue — Component Explorer`), and a two-column body:
   - **Left Sidebar (28–30% width):** The project file tree showing `src/components/`, `src/composables/`, and `src/stores/`. The file being actively taught is highlighted with an `.active` pill, accompanied by crisp `.vue` (Vue emerald) or `.ts` (TypeScript blue) vector badges.
   - **Right Live Stage (70% width):** A soft blueprint canvas displaying the active component's memory and DOM boundary.
2. **Component Boundary & Name Tagging:** Every component on stage MUST declare its identity via an anchored top-left tag (e.g., `<ArticleFeed.vue>`, `<CounterButton.vue>`) with an emerald status dot and optional prop chips (e.g. `:step="1"`, `v-model="query"`). Nested child components nest cleanly inside the parent box with their own distinct child tags.
3. **The "Rule of 3" (The Minimal Repetition Ceiling):** NEVER play around with 10 rows of articles or massive lists. In this curriculum, **repetition must be demonstrated with strictly at most 3 items**. Three items are mathematically sufficient to prove a loop, key tracking, and layout flow without inducing cognitive fatigue or visual clutter.
4. **Interactive Control Fidelity:** Buttons, inputs, counters, and badges inside the component body must look like authentic, minimal, cool modern UI controls (crisp 1.5px borders, subtle button drop shadows, bold numbers, high contrast).
5. **Standalone HTML Figure Packaging:** All figures live in `md-lectures/figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html` with locally scoped styles, embedded directly via ````html-figure src="..." caption="..."````.

---

## 3. The Proven Templates Catalog (`figures/templates/`)

All archetypes have been implemented as reusable, standalone HTML templates in `md-lectures/figures/templates/` and compiled into the visual reference manual **`Vue Figure Templates.pdf`**:

| Template | File | Core Scenario & Role | Key Elements |
| :--- | :--- | :--- | :--- |
| **01** | `01-single-control.html` | **Single Component Stepper Control** | Left: File tree (`CounterButton.vue`). Right: Authentic counter widget with bold number (`5`), caption (`Items in Cart`), and stepper buttons (`− Decrease`, `+ Increase`). |
| **02** | `02-list-repeat-3-items.html` | **Collection Rendering & The Rule of 3** | Left: File tree (`ArticleFeed.vue`). Right: `<ArticleFeed.vue>` rendering **strictly 3 minimal flat news cards** with bold headlines, excerpts, author bylines, and category tags. |
| **03** | `03-parent-child-props-emits.html` | **Component Hierarchy & User Profile** | Left: File tree (`UserProfile.vue`). Right: Profile masthead (avatar initials, name, title) hosting nested `<StatusBadge.vue>` (`● Active Contributor`) and `<ActionButton.vue>` (`Following`, `Message`). |
| **04** | `04-compare-wrong-right.html` | **Music Player Symmetrical Duel** | Symmetrical duel: Top `✕ BROKEN` (frozen at 00:00 with `▶ Play`) vs Bottom `✓ REACTIVE` (playing at 02:28 with 58% scrubber bar and `⏸ Pause`). |
| **05** | `05-two-way-binding.html` | **Two-Way Binding & Search Filter** | Left: File tree (`SearchFilter.vue`). Right: Real search input with SVG magnifying glass, active query text (`climate`), `✕` clear pill, and live results bar (`14 stories found`). |
| **06** | `06-pinia-store-dispatch.html` | **Decomposition Step 1: Macro Composite** | Left: File tree (`CartDrawer.vue`, `cart.ts`). Right: Pinia user store wiring into `<CartDrawer.vue>` showing line items, order total, and `Checkout` button. |
| **07** | `07-progressive-decomposition-step2.html` | **Two-Panel Progressive Decomposition** | **Panel 1 (Top):** `CartDrawer.vue` active in sidebar, rendered HTML view.<br>**Panel 2 (Bottom):** Active sidebar switches to `CartItemRow.vue`, dissecting the container into `<CartItemRow.vue>` (with internal stepper `[−] 1 [+]`, unit price, and remove action) and `<CartSummary.vue>`. |

When authoring a new lecture, select the closest template from `figures/templates/`, clone it into `figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html`, and customize the component names and values to match the code snippet directly preceding it.
