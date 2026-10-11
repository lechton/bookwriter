---
name: ui-panels
description: Governs the Rendered UI Canvas, files, and component-code panels embedded in lectures; use when adding or reviewing any UI panel in a lecture.
---

# UI Panels

This skill governs the three specialized visual panels embedded in lectures: the ` ```components ` Rendered UI Canvas, the ` ```files ` File Explorer, and the ` ```component-code ` Component Architecture panel (both Code Mode and Stage D Role Mode). It defines panel syntax, nesting rules, terminal interactive controls, and role summary cards. Plain code blocks belong to `code-blocks`, and standalone HTML figures belong to `figures`.

Digests: `skills/old-instructions/instructions.md` (rendered UI canvas, file explorer, and component role panels).

## Rendered UI Canvas | 01 | The Stage A Visual Destination

- [ ] Does Stage A of every practical example open with a ` ```components ` Rendered UI Canvas panel titled `{project} - Rendered UI Canvas`?
- [ ] Is the visual destination presented before displaying implementation code, allowing the learner to see the authentic running interface first?
- [ ] Is the canvas kept completely snippet-free, avoiding code snippets or JSX syntax inside canvas cards?
- [ ] Does the UI Canvas lead directly into the ` ```files ` panel and the Stage B assembly pipeline figure, creating a smooth transition from visual goal to disk structure and construction steps?
- [ ] Does the ` ```components ` block maintain 1-to-1 structural parity with the ` ```files ` panel, ensuring that every component file declared in the case study is represented as an indented node rather than collapsing the entire hierarchy into a single monolithic root container? #2026_09_26_04_group_1
- [ ] Are rendered DOM elements declared in Field 4 kept strictly flat using the `[elem:tag:content]` format delimited by ` ;; `, banning recursive nested brackets (`[elem:tag: [elem:...]]`) that break the compiler parser regex? #2026_09_26_04_group_1
- [ ] When an orchestrating container or intermediate branch serves strictly as a layout boundary whose visible output is composed of child components, is Field 4 left empty (`filename | none | kind |`) so child components cleanly form the container's interior rather than creating empty, detached DOM boxes? #2026_09_26_04_group_1

- [ ] PROPER EXAMPLE: Multi-component UI canvas with 1-to-1 file parity and flat element tags: #2026_09_26_04_group_1

> ```components title="corner-shop - Rendered UI Canvas"
> App.jsx | none | shell |
>   ShopHeader.jsx | none | header | [elem:h1.title: Corner Shop] ;; [elem:span.hours: Open until 8 PM]
>   ProductList.jsx | none | branch | [elem:h2.section-title: Fresh Today]
>     ProductCard.jsx | none | card | [elem:span.label: Fruit] ;; [elem:h3.name: Green Apples] ;; [elem:p.price: $3 a bag]
>     ProductCard.jsx | none | card | [elem:span.label: Bakery] ;; [elem:h3.name: Brown Bread] ;; [elem:p.price: $2 a loaf]
> ```

Notes: Demonstrates complete 1-to-1 structural parity with the files panel. Every component is represented as an indented node, terminal UI controls display flat web-inspector element badges separated by ` ;; `, and layout containers leave Field 4 empty so children naturally form their visual interior.

- [ ] COUNTER-EXAMPLE 1 (The Monolithic Collapse Fallacy): Collapsing multi-component hierarchy into a single root node with recursive nested brackets: #2026_09_26_04_group_1

> ```components title="corner-shop - Rendered UI Canvas"
> App.jsx | none | shell | [elem:div.shop-layout: [elem:header.shop-header: [elem:h1.title: Corner Shop]] ;; [elem:div.product-list: [elem:div.product-card: [elem:h3: Green Apples]]]]
> ```

Notes: Destroys the component mental model by erasing `ShopHeader.jsx`, `ProductList.jsx`, and `ProductCard.jsx` from the canvas. The parser regex cannot process recursive brackets, causing raw syntax like `[elem:header...` and `]]]]` to leak directly onto the rendered page.

- [ ] COUNTER-EXAMPLE 2 (The Empty Container Tag Trap): Placing invisible CSS layout wrapper tags in Field 4 of container components: #2026_09_26_04_group_1

> ```components title="corner-shop - Rendered UI Canvas"
> App.jsx | none | shell | [elem:div.shop-layout]
>   ProductColumn.jsx | none | card | [elem:section.product-grid]
>     FeaturedProduct.jsx | none | generic | [elem:h2.name: Strawberries] ;; [elem:p.summary: Picked this morning on a local farm.]
> ```

Notes: Renders an empty dashed box sitting directly on top of the child component card. CSS layout containers (`<section className="product-grid">`, `<div className="layout">`) have no textual or visual substrate of their own. Forcing them into Field 4 generates visual clutter and confuses learners. When a component exists to orchestrate layout, leave Field 4 empty.

## Rendered UI Canvas | 02 | Canvas Syntax and Four-Field Structure

- [ ] Is each entry in the ` ```components ` block formatted across four pipe-separated fields: `filename | props | visual kind | rendered UI elements`?
- [ ] Is Field 1 written as a bare filename (`App.jsx`, `Header.jsx`, `cart.js`), avoiding manual path prefixes?
- [ ] Is Field 2 written as `none` (or kept brief) when no props are passed?
- [ ] Does Field 3 use a supported visual kind (`shell`, `header`, `navigation`, `profile`, `badge`, `counter`, `card`, `form`, `table`, `button`, `branch`, `instances`, `generic`)?
- [ ] Does Field 4 wrap rendered elements with their semantic DOM tag descriptor using flat `[elem:tag:content]` or `[elem:tag]` (e.g. `[elem:h1: Title]`, `[elem:span.tier-tag: PRO]`), separating multiple sibling elements with ` ;; ` and strictly avoiding recursive nested brackets? #2026_09_22_02_group_1, #2026_09_26_04_group_1
- [ ] When a component functions solely as a structural layout container whose visual output is formed entirely by mounted child components, is Field 4 left blank? #2026_09_26_04_group_1
- [ ] Do semantic elements automatically inherit authentic styling without requiring redundant nested sub-tags (e.g. writing `[elem:button: Refresh Feed]` rather than `[elem:button: [btn: Refresh Feed]]`)? #2026_09_22_07_group_1
- [ ] Does every `[elem:tag:...]` include appropriate top clearance separating it from the component title above? #2026_09_22_02_group_1
- [ ] Are inspected DOM element overlays (`.ui-elem`) rendered with dashed perimeters, reserving solid borders for actual interactive form controls (`.surface-ui-input`)? #2026_09_22_08_group_1
- [ ] When representing images or icons, are native components used (`[img: caption]` or `[icon: name]`), avoiding text badges or platform emojis? #2026_09_22_03_group_1

## Rendered UI Canvas | 03 | Two-Space Nesting and Genealogical Hierarchy

- [ ] Are child components indented by exactly two spaces per tree level under their parent (`  Child.jsx`)?
- [ ] Does the canvas reflect the true multi-component hierarchy of the case study (root container, intermediate branches, and terminal UI controls), ensuring that child components are nested under their actual parent containers with two-space indentation? #2026_09_26_04_group_1
- [ ] Are standard genealogical terms used (`parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, `terminal UI control`), avoiding academic computer science terms like "leaf node"?

## File Explorer | 04 | The Files Panel and Disk Hierarchy

- [ ] Is the ` ```files ` panel positioned in Stage A immediately following the UI Canvas to display project folder and file layout on disk?
- [ ] Are entries formatted with two spaces per nesting level: `folder/` or `filename | role | description`?
- [ ] Is every file tagged with its architectural role: `parent`, `boundary`, `consumer`, `button`, `state`, or `child`?
- [ ] Does each file include a concise physical description answering what the file manages in daily practice?
- [ ] Are filenames tailored specifically to the lecture's topic rather than copied from adjacent lectures?

- [ ] PROPER EXAMPLE: Files panel for a form-actions topic:

> ```files title="corner-shop: File Explorer"
> src/
>   App.jsx | parent | Top-level layout container mounting the shop page
>   components/
>     OrderForm.jsx | boundary | Renders declarative form with action and formAction overrides
> ```

Notes: Names real files, assigns architectural roles, and describes responsibilities in a single scan.

## Component Architecture | 05 | Code Mode: The Five-Second Architectural Skeleton #2026_09_20_29_group_1

- [ ] When component hierarchy requires full code fidelity across a full-width canvas, is ` ```component-code ` used in Code Mode?
- [ ] Is Code Mode curated down to load-bearing primitives (parent mounting tags, boundary hooks, cross-component props, terminal returns) rather than a full code dump?
- [ ] Is local implementation noise excluded (imperative loops, fetch routines, styling wrappers)?
- [ ] Does the panel satisfy the 5-second scan standard, allowing an engineer to grasp data boundaries and prop flow quickly?

## Stage D Role Panels | 06 | Stage D Role Mode at Component Summary #2026_09_20_04_group_5 revised by #2026_09_21_02_group_1, #2026_09_21_16_group_1, and #2026_09_21_20_group_1

- [ ] Is the ` ```component-code ` panel in Role Mode placed at the head of Stage D directly under `### Component Summary` without intervening text?
- [ ] Are nested components rendered directly on the page substrate without outer window containers, gray cards, or traffic light dots? #2026_09_21_16_group_1
- [ ] Does the panel feature an authoritative title (`title="Summary: The Logic of Nested Components"` for Archetype A or `title="Summary: Project Architecture & File Hierarchy"` for Archetype B)? #2026_09_20_09_group_1, #2026_09_21_02_group_1
- [ ] Is the panel scoped appropriately (feature component hierarchy in Archetype A, core scaffolding in Archetype B)? #2026_09_20_30_group_1, #2026_09_21_02_group_1
- [ ] Do role-mode panels use unhurried serif prose explanations with zero code, exempt from the 5-second code-mode scan constraint? #2026_09_20_29_group_1

## Stage D Role Panels | 07 | Role-Mode Four-Field Syntax and Two-Space Indentation #2026_09_20_10_group_1

- [ ] Does every role-mode entry provide all 4 pipe-separated fields: `file | props | kind | [role: ...]`?
- [ ] Does `[role: ...]` occupy the fourth field, activating serif summary cards (`.surface-ui-role`)?
- [ ] Are all nested child components indented by exactly two spaces per tree level (`  Child.jsx`)?

## Stage D Role Panels | 08 | The Four-Beat Rhythm for Role Summaries #2026_09_20_12_group_1 revised by #2026_09_20_30_group_1 and #2026_09_21_02_group_1

- [ ] Is each `[role: ...]` payload structured according to the four-beat rhythm:
    1. **Beat One**: What the component or file is (bolded, e.g. `The **parent component**...`).
    2. **Beat Two**: What it owns, receives, exports, or configures (state variables, props, DOM root mounts, build plugins).
    3. **Beat Three**: Relational contrast against its siblings or adjacent pipeline layers.
    4. **Beat Four**: Architectural motivation, runtime payoff, or browser execution consequence.
- [ ] Does the phrasing of the fourth beat vary naturally across the panel (purpose infinitives, participial clauses, or concise questions)?

- [ ] PROPER EXAMPLE (Archetype A): Multi-component role-mode panel from Lecture 40: #2026_09_20_09_group_1, #2026_09_20_10_group_1 revised by #2026_09_20_30_group_1

> ```component-code title="Summary: The Logic of Nested Components"
> FeedbackPortal.jsx | none | parent | [role: The **parent component** orchestrates the overall portal layout. It owns the **live search state**. Also, it actively provides two things: the **state (props)** and **updater functions** downward to **LiveSearchInput**. Notice it deliberately passes **zero props** to **ArticleCorrectionForm** to isolate the parent from typing re-renders.]
>   LiveSearchInput.jsx | query={query} onChange={setQuery} | form | [role: This is the **controlled child component**. It receives two things from the parent: the **state (`query`)** and the **updater function (`onChange`)**. Notice it locks the input's displayed value directly to React state. Why? To filter published headlines in real time on every single keystroke.]
>   ArticleCorrectionForm.jsx | none | form | [role: This is the **uncontrolled child component**. Notice it receives **zero props** and **zero callbacks** from the parent. The browser stores all text in its native C++ buffer. When does React read the data? Only once, on submit, using **`FormData`**, keeping typing at 60 FPS with zero parent re-renders.]
> ```

- [ ] PROPER EXAMPLE (Archetype B): Scaffolding architecture role-mode panel: #2026_09_21_02_group_1

> ```component-code title="Summary: Project Architecture & File Hierarchy"
> App.jsx | none | parent | [role: The **root application component** provides the initial visual tree rendered by Vite. It owns the **starter UI layout** and demonstrates client-side JSX rendering in memory. Notice it imports zero global CSS side-effects directly, keeping its structure cleanly isolated. Why? To serve as the top-level boundary where feature containers mount.]
>   main.jsx | none | boundary | [role: The **client entry point** bridges the physical DOM and the React runtime. It executes `createRoot` against the native `<div id="root">` element declared in `index.html`. Notice it passes zero props to `App`, serving strictly as an imperatively invoked mounting bridge. This architecture ensures React never controls global document markup outside its designated root container.]
>   vite.config.js | none | generic | [role: The **development and build orchestrator** configures the Rolldown and esbuild transformation pipelines. It supplies the official `@vitejs/plugin-react` compiler plugin. Notice it runs entirely in Node.js at build time, never shipping configuration bytes to client browsers. This ensures rapid Hot Module Replacement during development without runtime bundle bloat.]
> ```

Notes: All 4 fields present on every row, child components indented by 2 spaces, feature tree scoped to 3 components, and fourth beat phrasing varies naturally across direct purpose, conversational inquiry, and temporal explanation.
