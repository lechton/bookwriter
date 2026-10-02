---
name: figures
description: Governs creating the standalone HTML figures embedded in lectures via the html-figure block; use when a lecture figure is about to be designed, cloned, or revised.
---

# Figures

This skill governs standalone HTML figures embedded in lectures via ````html-figure src="..." caption="..."````: visual philosophy, graphic design standards, color and surface geometry, the proven template archetypes, standalone `.html` file mechanics, and chronological narrative integrity. Figures are cloned from proven archetypes and adapted to the lecture's domain, preserving aesthetic unity across the curriculum.

Digests: `skills/old-instructions/docs/figure-design-system.md`, `skills/old-instructions/docs/professional_illustrator.md`, and `skills/old-instructions/instructions.md` (HTML figures).

## Pedagogical Philosophy | 01 | The Opening Visual Anchor

[ ] Pair the opening code snippet of Section 1 with an immediate visual anchor whenever introducing a core paradigm.
[ ] Grounding the engineering problem in physical reality in Section 1 engages the reader before complex framework mechanisms appear.
[ ] Avoid opening lectures with dry, abstract syntax without a visual representation of what the screen or component looks like.

## Pedagogical Philosophy | 02 | Physicalize the Invisible Mechanisms

[ ] The most subtle React bugs involve mechanisms invisible in local code snippets: module scope, closures, reconciliation queues, and browser event dispatchers.
[ ] Give invisible mechanics a physical visual body:
    * Draw external module variables as distinct floating cards positioned outside the component tree.
    * Use directional arrows to show illegal cross-boundary mutations or external state accesses.
    * When a pure component computes output, draw clean downward arrows passing props. When a component triggers an impure side effect, draw arrows reaching out into external cards.

[ ] COUNTER-EXAMPLE: do not follow this bad example, hiding the external trap:

> ```text
> +----------------------------------+
> | AlertBadge.jsx                   |
> |                                  |
> | function AlertBadge() {          |
> |   count = count + 1;             |
> | }                                |
> +----------------------------------+
> ```

Notes: Only displays local code; the external variable being mutated (`let count = 0`) lives outside the frame, so the trap remains invisible.

## Pedagogical Philosophy | 03 | Map Component Topology and Data Flow

[ ] React applications are hierarchical trees, not flat scripts: map the structural topology before explaining complex data flow.
[ ] Draw the component hierarchy with the parent container at the top branching downward to child components and terminal UI controls.
[ ] Illustrate data movement explicitly: props flowing downward from parent to child, and callback events flowing upward from child to parent (inverse data flow).

## Pedagogical Philosophy | 04 | Visual-First Without Diagram Inflation

[ ] Prefer visual diagrams whenever code triggers a state transition, layout division, reconciliation choice, or boundary contrast.
[ ] Avoid diagram inflation: never invent decorative diagrams for purely analytical formulas, simple type signatures, or routine one-line helpers. Diagrams exist to unlock genuine mechanical comprehension, not to serve as generic wallpaper.

## Graphic Design Standards | 05 | The Genuine Graphical Substrate Law

[ ] Every figure inside `.print-fig` must feature a genuine graphical substrate: structural tree nodes, state tracks, memory matrices, device viewports, or rendered interactive UI controls.
[ ] Wrapping plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without graphical geometry is strictly prohibited (The "Never Text-Only" Law).

[ ] COUNTER-EXAMPLE: do not follow this bad example, a text list pretending to be a figure:

> ```html
> <div class="print-fig">
>   <ul>
>     <li>useState returns a state value and a setter function.</li>
>     <li>Re-renders are triggered by calling the setter.</li>
>     <li>Props flow from parent to child.</li>
>   </ul>
> </div>
> ```

Notes: A plain bulleted list wrapped in a border; contains no graphical substrate and fails the figure quality gate.

## Graphic Design Standards | 06 | Strong Demarcation & Modern Surface Geometry

[ ] Enclose every figure in the canonical `.print-fig` container: `border: 2px solid #0f172a`, `border-radius: 8px`, `background: #ffffff`, and subtle elevation via `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06)`.
[ ] Maintain crisp visual demarcation, pure white card interiors, and clear contrast.
[ ] Avoid weak 1px borders or muddy pastel container backgrounds that wash out in print.
[ ] Use monochrome SVG icons for status indicators and UI markers; colored platform emojis (such as ⚠️, ❌, or 🚀) are strictly prohibited.

## Graphic Design Standards | 07 | Symmetrical Comparison & Differential Highlighting

[ ] When contrasting two mechanisms (such as Controlled vs. Uncontrolled, or Server vs. Client Components), format the figure with balanced, side-by-side symmetrical cards.
[ ] Apply differential highlighting: use neutral tones for unchanged baselines, subtle amber/rose highlights for danger or legacy friction, and crisp emerald/teal accents for the resilient solution.
[ ] Isolate each comparative diagram so it fits comfortably within the target PDF page budget without overflowing across page breaks.

## Graphic Design Standards | 08 | Anti-Meta-Descriptor (Pure Archetypical UI)

[ ] When rendering UI mockups inside figures, display authentic, believable interface elements (newsroom headlines, subscriber pills, search inputs, publish buttons).
[ ] Avoid abstract meta-descriptors (such as boxes labeled "UI Component Goes Here" or "Render Output Box"). Show the actual buttons, inputs, and badges with realistic copy.

## Palette & Surface System | 09 | Semantic Color Coding

[ ] Apply semantic color coding consistently across all figures:
    * **Emerald / Green (`#059669` / `#d1fae5`)**: Verified modern patterns, resilient architecture, declarative data flow, and successful runtime outcomes.
    * **Rose / Red (`#e11d48` / `#ffe4e6`)**: Traps, anti-patterns, full-page reloads, state drift, and runtime exceptions.
    * **Amber / Orange (`#d97706` / `#fef3c7`)**: Pending transitions, warnings, network latency, and intermediate states.
    * **Blue / Slate (`#2563eb` / `#dbeafe` / `#0f172a`)**: Structural boundaries, component names, parent containers, and neutral chrome.
[ ] Ensure all text placed on colored cards satisfies WCAG AA contrast standards (minimum 4.5:1 contrast ratio against the background surface).

## Palette & Surface System | 10 | The Lavender-and-Peach Comparison Palette

[ ] For side-by-side paradigm comparisons, use the established dual palette:
    * **Lavender (`#e0e7ff` / `#4338ca`)**: Classical baseline, legacy patterns, or client-side execution.
    * **Peach / Amber (`#ffedd5` / `#c2410c`)**: Modern React 19 pattern, server-side execution, or declarative actions.
[ ] The distinct color pairing allows the student to immediately recognize which side of the comparison represents the legacy baseline and which represents the modern architecture.

## Proven Template Catalog | 11 | Clone, Never Invent from Scratch

[ ] When authoring a new figure, select and clone from the catalog of proven archetypes in `figures/templates/`.
[ ] Adapt the chosen template's labels, components, and data values to match the current lecture's domain while preserving proven layout geometry, CSS classes, and font scales.
[ ] Inventing bespoke layout geometry from scratch leads to visual inconsistency and PDF print break errors.

## Proven Template Catalog | 12 | The Core Proven Archetypes

[ ] The canonical figure catalog includes:
    * **Archetype 01: Component Hierarchy & Props Flow**: Top-down tree diagram displaying parent containers, child nodes, and downward prop vectors.
    * **Archetype 02: Side-by-Side State Comparison**: Symmetrical dual-card layout contrasting legacy imperative mutation against declarative updates.
    * **Archetype 03: Browser Event & Network Lifecycle**: Horizontal timeline illustrating client click → transition scheduling → server response → DOM commit.
    * **Archetype 04: Two-Column Split Window**: Code editor on the left paired with real-time rendered UI output on the right.
    * **Archetype 09: Progressive Assembly Step Cards**: Vertical stack of 4 full-width horizontal step cards introducing the collaborative assembly steps. #2026_09_22_06_group_1
    * **Archetype 10: Architecture Audit Table**: Three-column comparative matrix deconstructing component layers and contrasting naive expectations with React 19 reality.

## Proven Template Catalog | 13 | Archetype 09 (Assembly Step Cards) Structural Invariant & Canonical Color Law #2026_09_20_08_group_1, #2026_09_20_11_group_1, #2026_09_22_06_group_1

[ ] Clone Archetype 09 (`figures/{NN}-01-code-assembly-pipeline.html`) directly from the canonical template (`templates/09-progressive-assembly-step-cards.html`) for Stage B of every practical example. #2026_09_22_06_group_1
[ ] Mandatory Structural Anatomy: Every assembly pipeline figure MUST use the vertical stack of full-width horizontal step cards:
    * Outer Container: `.assembly-steps-figure` (`max-width: 590px; display: flex; flex-direction: column; gap: 10px; margin: 0.85rem auto; break-inside: avoid`).
    * Step Cards (`.step-card`): Full-width row layout (`display: flex; flex-direction: row; width: 100%`) containing:
      1. `.card-edge`: Left colored accent strip (`width: 9px; flex-shrink: 0`).
      2. `.card-main`: Main pastel body containing badge, divider, and content.
      3. `.step-badge`: Left pill containing `.step-text` ("Step") and prominent bold `.step-num` ("1", "2", "3", "4").
      4. `.card-divider-wrap` / `.card-divider`: Rounded vertical divider line.
      5. `.card-content`: Right content area containing `.card-title` (mirroring collaborative step heading: `First, we...`, `Next, we...`, etc.) and `.card-components` with monospace `.component-tag` elements.
[ ] Ban 4-Column Vertical Grids: Strictly forbid 4-column side-by-side grid layouts (`.pipeline-grid`, `grid-template-columns: repeat(4, 1fr)`). Never squish steps into narrow vertical boxes with dark top headers and bottom tags. #2026_09_22_06_group_1
[ ] Maintain the canonical four-tone pastel color palette across `.card-main`:
    * `Step 1`: Blue (`#d4e1f1`)
    * `Step 2`: Teal (`#d0e6e1`)
    * `Step 3`: Warm Amber (`#f9e0c5`)
    * `Step 4`: Green (`#d2ebc9`)
[ ] Use strict `.step-[1-4]` classes on cards; never mutate class names or override card backgrounds with inline styles.
[ ] Forbid bleaching card backgrounds with pure white (`#ffffff`) or light grey (`#f8fafc`): the four distinct pastel tones provide immediate visual differentiation for the four steps.

## Proven Template Catalog | 14 | Archetype 10 (Architecture Audit Table) #2026_09_21_28_group_1

[ ] Conclude Stage D of every practical example with Archetype 10 (`figures/{NN}-02-architecture-audit.html`).
[ ] Clone directly from the canonical template (`templates/10-architecture-audit-vtable.html`) and structure with:
    * Editorial Substrate: Sits directly on the page substrate without outer card borders, rounded corners, or drop shadows; anchored strictly by heavy 3px black rules (`border-top: 3px solid #0f172a; border-bottom: 3px solid #0f172a`).
    * Table Layout & Margin Reset: Nested table must neutralize parent figure margins with `margin: 8px 0 0 0 !important; margin-left: 0 !important; width: 100% !important; table-layout: fixed !important; border: none !important;` to eliminate PDF page clipping.
    * An uppercase eyebrow header: `LESSONS FROM THE CODE`.
    * A title identifying the specific domain challenge.
    * Three comparative columns calibrated for single-page print budgets: `Component Layer` (22% width), `Naive Expectation` (39% width), and `What Happened` (39% width).
    * Subtle background shading on the reality column to emphasize modern patterns.
    * Layer breakdown rows traversing the architecture from parent container to terminal UI control (anti-leaf law).
    * A final verdict row contrasting fragile state drift/coupling in red against modular resilience/synchronized truth in teal. #2026_09_21_28_group_1

## Authoring Mechanics | 15 | One Figure, One Self-Contained File

[ ] Save every standalone figure as an independent `.html` file inside `figures/`: `figures/{NN}-01-{slug}.html`.
[ ] Structure each figure file as a complete, self-contained HTML document containing its own `<style>` block and clean HTML structure.
[ ] Keep styles locally scoped: encapsulate CSS rules under specific container classes (such as `.pipeline-container` or `.audit-table`) to prevent styles from bleeding into the parent lecture page.

## Authoring Mechanics | 16 | Embedding via `html-figure`

[ ] Embed standalone figures in lecture Markdown using the `html-figure` block:
    ```markdown
    ````html-figure src="figures/40-01-code-assembly-pipeline.html" caption="Figure 40.1: The progressive assembly pipeline of the feedback portal"
    ````
    ```
[ ] Ensure the `src` attribute points to a valid file on disk; stale or misspelled figure paths trigger build failures.
[ ] Provide an authoritative caption describing the educational takeaway of the figure.

## Authoring Mechanics | 17 | Print Safety and Height Budgets

[ ] Calibrate figure height to fit within standard PDF page budgets (maximum height of 380px to 420px).
[ ] A figure that exceeds the height budget forces awkward page breaks, leaving orphaned headings or pushed captions.
[ ] Use compact font sizing (`13px` to `15px` for body labels, `11px` to `12px` for badges) and disciplined vertical padding (`8px` to `12px`) to ensure comfortable page fit.

## Integrity & Verification | 18 | Chronological Narrative Fidelity

[ ] Ensure figures maintain strict chronological narrative synchronization with the lecture text:
    * An introductory figure in Section 1 or Stage B must not display advanced child components, complex hooks, or submission handlers that have not yet been introduced.
    * Figures illustrate what the reader currently understands or is about to build, never spoiling deep end-of-lecture mechanisms prematurely.

## Integrity & Verification | 19 | 1:1 Code-Figure Synchronization

[ ] Ensure every identifier, component name, prop, and attribute rendered in a figure matches the surrounding code snippets exactly.
[ ] If a code snippet declares `query` and `setQuery`, the figure must not display `searchText` or `onUpdate`. Inconsistent naming between code and diagrams creates immediate cognitive dissonance for the student.

## Integrity & Verification | 20 | Visual Verification Protocol #2026_09_20_28_group_1

[ ] During routine lecture production and adaptation of proven figure templates, visual screenshot verification via `pdftoppm` is strictly prohibited.
[ ] Routine figure verification relies entirely on clean compiler builds: `node src/build-lectures.mjs` with zero warnings.
[ ] Taking screenshots and inspecting rendered PNGs is reserved exclusively for brand-new experimental template designs created in `figures/templates/`, or upon explicit user command.
