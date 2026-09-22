---
name: ui-panels
description: Governs the Rendered UI Canvas, files, and component-code panels embedded in lectures; use when adding or reviewing any UI panel in a lecture.
---

# UI Panels

This skill governs the three specialized visual panels embedded in lectures: the ` ```components ` Rendered UI Canvas, the ` ```files ` File Explorer, and the ` ```component-code ` Component Architecture panel (both Code Mode and Stage D Role Mode). It defines the panel syntax, nesting rules, terminal interactive controls, and role summary cards. Plain code blocks belong to `code-blocks`, and standalone HTML figures belong to `figures`.

Digests: `skills/old-instructions/instructions.md` (rendered UI canvas, file explorer, and component role panels).

## Rendered UI Canvas | 01 | The Stage A Visual Destination

[ ] Open Stage A of every practical example with a ` ```components ` Rendered UI Canvas panel titled `{project} - Rendered UI Canvas`.
[ ] Present the visual destination before displaying any implementation code: the learner should see the authentic running interface before learning how to build its parts.
[ ] Keep the canvas completely snippet-free: do not embed code snippets or JSX syntax inside canvas cards. Code belongs in subsequent code editor blocks.
[ ] Follow the UI Canvas immediately with the ` ```files ` panel and the Stage B assembly pipeline figure, creating a smooth transition from visual goal to disk structure and construction steps.

[ ] PROPER EXAMPLE: make sure you follow this example, a clean multi-component canvas:

> ```components title="national-times - Rendered UI Canvas"
> FeedbackPortal.jsx | none | shell
>   LiveSearchInput.jsx | none | form | [input: Filter headlines...] ;; [badge: Live Headline Filter]
>   ArticleCorrectionForm.jsx | none | form | [input: Elena Rostova] ;; [input: Describe the correction...] ;; [button: Submit Correction]
> ```

Notes: Displays the orchestrating container and child controls with zero code snippets, allowing the reader to picture the finished portal.

## Rendered UI Canvas | 02 | Canvas Syntax and Four-Field Structure

[ ] Write one entry per line in the ` ```components ` block, formatted across four pipe-separated fields: `filename | props | visual kind | rendered UI elements`.
[ ] Field 1 (Filename): Write as a bare filename (`App.jsx`, `Header.jsx`, `cart.js`). Do not add path prefixes like `components/`; the compiler automatically assigns `.jsx` files to `components/` and plain modules to `state/`.
[ ] Field 2 (Props Context): When no props are passed, write `none` or leave empty; the parser automatically suppresses `none` so it never renders on the card. When props are passed, keep them brief (e.g. `query={query}`).
[ ] Field 3 (Visual Kind): Choose from the supported kinds: `shell`, `header`, `navigation`, `profile`, `badge`, `counter`, `card`, `form`, `table`, `button`, `branch`, `instances`, `generic`.
[ ] Field 4 (Rendered Controls): Render native UI controls using `[button: ...]`, `[input: ...]`, or `[badge: ...]`. Separate multiple controls on the same component using `;;`.

## Rendered UI Canvas | 03 | Two-Space Nesting and Genealogical Hierarchy

[ ] Indent child components by exactly two spaces per tree level under their parent (`  Child.jsx`).
[ ] Use standard genealogical terms to describe hierarchy: `parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, and `terminal UI control`.
[ ] Strictly avoid academic computer science jargon like "leaf" (or "leaf node", "leaf component"). Use "terminal UI control" or "child component" instead.

## File Explorer | 04 | The Files Panel and Disk Hierarchy

[ ] Use the ` ```files ` panel in Stage A immediately following the UI Canvas to display the project's folder and file layout on disk.
[ ] Format entries with two spaces per nesting level: `folder/` or `filename | role | description`.
[ ] Tag every file with its architectural role: `parent`, `boundary`, `consumer`, `button`, `state`, or `child`.
[ ] Add a concise physical description answering what the file manages in daily practice.
[ ] Tailor filenames specifically to the lecture's topic; never copy unrelated filenames from adjacent lectures.

[ ] PROPER EXAMPLE: make sure you follow this example, a files panel for a form-actions topic:

> ```files title="national-times: File Explorer"
> src/
>   App.jsx | parent | Top-level layout container mounting the newsroom workspace
>   components/
>     ArticleEditor.jsx | boundary | Renders declarative form with action and formAction overrides
> ```

Notes: Names real files, assigns architectural roles, and describes responsibilities in a single scan.

## Component Architecture | 05 | Code Mode: The Five-Second Architectural Skeleton #2026_09_20_29_group_1

[ ] When component hierarchy requires full code fidelity across a full-width canvas, use ` ```component-code ` in Code Mode.
[ ] Treat Code Mode as an architectural skeleton rather than a full code dump: curate the panel down to load-bearing primitives (parent mounting tags, boundary hooks, cross-component props, and terminal returns).
[ ] Exclude local implementation noise: omit imperative loops, fetch routines, styling wrappers, and secondary validation checks.
[ ] Enforce the 5-second scan standard: an engineer should grasp data boundaries and prop flow across the entire component tree within five seconds.

## Stage D Role Panels | 06 | Stage D Role Mode at Lessons from the Experiment #2026_09_20_04_group_5 revised by #2026_09_21_02_group_1 and #2026_09_21_16_group_1

[ ] Place the ` ```component-code ` panel in Role Mode at the head of Stage D directly under `### Lessons from the Experiment` without intervening text.
[ ] Render the nested components directly on the page substrate without outer window containers, gray background cards, or traffic light dots, preserving the original centered dimensions of the component cards. #2026_09_21_16_group_1
[ ] Give the panel an authoritative domain title: `title="Summary: The Logic of Nested Components"` for Archetype A (Component-Driven Assembly) or `title="Summary: Project Architecture & File Hierarchy"` for Archetype B (Scaffolding & System Architecture Deconstruction). Avoid generic corporate labels or project prefixes. #2026_09_20_09_group_1, #2026_09_21_02_group_1
[ ] Scope the panel appropriately: in Archetype A, scope strictly to the feature component hierarchy (orchestrating container and direct children, maximum 3 components), omitting outer host shells like `App.jsx` that merely mount the container; in Archetype B, scope to the core scaffolding files deconstructed in the lecture (e.g. `App.jsx`, `main.jsx`, `vite.config.js`). #2026_09_20_30_group_1, #2026_09_21_02_group_1
[ ] Role-mode panels present unhurried serif prose explanations with zero code; they are exempt from the 5-second code-mode scan constraint. #2026_09_20_29_group_1

## Stage D Role Panels | 07 | Role-Mode Four-Field Syntax and Two-Space Indentation #2026_09_20_10_group_1

[ ] Every role-mode entry must provide all 4 pipe-separated fields: `file | props | kind | [role: ...]`.
[ ] Placing `[role: ...]` in field 2 or 3 is invalid: the parser only activates serif summary cards (`.surface-ui-role`) when `[role: ...]` occupies the fourth field.
[ ] Indent all nested child components by exactly two spaces per tree level (`  Child.jsx`). Zero indentation causes the parser to treat children as orphan root nodes, triggering a build error.

## Stage D Role Panels | 08 | The Four-Beat Rhythm for Role Summaries #2026_09_20_12_group_1 revised by #2026_09_20_30_group_1 and #2026_09_21_02_group_1

[ ] Author each `[role: ...]` payload according to the four-beat rhythm:
    1. **Beat One**: What the component or file is (bolded, e.g. `The **parent component**...` or `The **root application component**...`).
    2. **Beat Two**: What it owns, receives, exports, or configures (state variables, props, DOM root mounts, build plugins).
    3. **Beat Three**: Relational contrast against its siblings or adjacent pipeline layers.
    4. **Beat Four**: The architectural motivation, runtime payoff, or browser execution consequence.
[ ] Vary the phrasing of the fourth beat across the panel using natural sentence structures: purpose infinitives ("to isolate the parent"), participial clauses (", eliminating per-keystroke re-renders"), or concise questions ("Why? To filter headlines"). Avoid repetitive formulas.

[ ] PROPER EXAMPLE (Archetype A): make sure you follow this example, a multi-component role-mode panel from Lecture 40: #2026_09_20_09_group_1, #2026_09_20_10_group_1 revised by #2026_09_20_30_group_1

> ```component-code title="Summary: The Logic of Nested Components"
> FeedbackPortal.jsx | none | parent | [role: The **parent component** orchestrates the overall portal layout. It owns the **live search state**. Also, it actively provides two things: the **state (props)** and **updater functions** downward to **LiveSearchInput**. Notice it deliberately passes **zero props** to **ArticleCorrectionForm** to isolate the parent from typing re-renders.]
>   LiveSearchInput.jsx | query={query} onChange={setQuery} | form | [role: This is the **controlled child component**. It receives two things from the parent: the **state (`query`)** and the **updater function (`onChange`)**. Notice it locks the input's displayed value directly to React state. Why? To filter published headlines in real time on every single keystroke.]
>   ArticleCorrectionForm.jsx | none | form | [role: This is the **uncontrolled child component**. Notice it receives **zero props** and **zero callbacks** from the parent. The browser stores all text in its native C++ buffer. When does React read the data? Only once, on submit, using **`FormData`**, keeping typing at 60 FPS with zero parent re-renders.]
> ```

[ ] PROPER EXAMPLE (Archetype B): make sure you follow this example, a scaffolding architecture role-mode panel: #2026_09_21_02_group_1

> ```component-code title="Summary: Project Architecture & File Hierarchy"
> App.jsx | none | parent | [role: The **root application component** provides the initial visual tree rendered by Vite. It owns the **starter UI layout** and demonstrates client-side JSX rendering in memory. Notice it imports zero global CSS side-effects directly, keeping its structure cleanly isolated. Why? To serve as the top-level boundary where feature containers mount.]
>   main.jsx | none | boundary | [role: The **client entry point** bridges the physical DOM and the React runtime. It executes `createRoot` against the native `<div id="root">` element declared in `index.html`. Notice it passes zero props to `App`, serving strictly as an imperatively invoked mounting bridge. This architecture ensures React never controls global document markup outside its designated root container.]
>   vite.config.js | none | generic | [role: The **development and build orchestrator** configures the Rolldown and esbuild transformation pipelines. It supplies the official `@vitejs/plugin-react` compiler plugin. Notice it runs entirely in Node.js at build time, never shipping configuration bytes to client browsers. This ensures rapid Hot Module Replacement during development without runtime bundle bloat.]
> ```

Notes: All 4 fields present on every row, child components indented by 2 spaces, feature tree scoped to 3 components, and fourth beat phrasing varies naturally across direct purpose, conversational inquiry, and temporal explanation.
