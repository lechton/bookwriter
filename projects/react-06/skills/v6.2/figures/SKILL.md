---
name: figures
description: Governs creating standalone HTML figures embedded in lectures via the html-figure block; use when a lecture figure is about to be designed, cloned, or revised.
---

# Figures

This skill governs standalone HTML figures embedded in lectures via ````html-figure src="..." caption="..."````: visual philosophy, graphic design standards, color and surface geometry, proven template archetypes, standalone `.html` file mechanics, and chronological narrative integrity. Figures are cloned from proven archetypes and adapted to the lecture's domain, preserving aesthetic unity across the curriculum.

Digests: `skills/old-instructions/docs/figure-design-system.md`, `skills/old-instructions/docs/professional_illustrator.md`, and `skills/old-instructions/instructions.md` (HTML figures).

## Pedagogical Philosophy | 01 | The Opening Visual Anchor

- [ ] Is the opening code snippet of Section 1 paired with an immediate visual anchor when introducing a core paradigm?
- [ ] Does grounding the engineering problem in physical reality in Section 1 engage the reader before complex framework mechanisms appear?
- [ ] Does the opening avoid dry, abstract syntax without a visual representation of what the screen or component looks like?

## Pedagogical Philosophy | 02 | Physicalizing Invisible Mechanisms

- [ ] Are invisible mechanics given a clear physical visual body (external module variables as distinct floating cards, directional arrows for cross-boundary mutations or external state accesses)?
- [ ] Are clean downward arrows used for pure prop flow, and outward arrows used for impure side effects?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Hiding external variables outside the diagram frame:

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

- [ ] Is structural topology mapped before explaining complex data flow?
- [ ] Is the component hierarchy drawn with the parent container at the top branching downward to child components and terminal UI controls?
- [ ] Is data movement illustrated clearly (downward prop vectors and upward callback events)?

## Pedagogical Philosophy | 04 | Visual-First Without Diagram Inflation

- [ ] Are visual diagrams preferred when code triggers a state transition, layout division, reconciliation choice, or boundary contrast?
- [ ] Does the lecture avoid diagram inflation, avoiding decorative diagrams for purely analytical formulas or routine one-line helpers?

## Graphic Design Standards | 05 | The Genuine Graphical Substrate Standard

- [ ] Does every figure inside `.print-fig` feature a genuine graphical substrate (structural tree nodes, state tracks, memory matrices, device viewports, or rendered interactive UI controls)?
- [ ] Does the figure avoid plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without graphical geometry?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Text bullet list wrapped in a border pretending to be a figure:

> ```html
> <div class="print-fig">
>   <ul>
>     <li>useState returns a state value and a setter function.</li>
>     <li>Re-renders are triggered by calling the setter.</li>
>     <li>Props flow from parent to child.</li>
>   </ul>
> </div>
> ```

Notes: A plain bulleted list wrapped in a border; contains no graphical substrate and fails the figure quality standard.

## Graphic Design Standards | 06 | Strong Demarcation & Modern Surface Geometry

- [ ] Is every figure enclosed in the canonical `.print-fig` container (`border: 2px solid #0f172a`, `border-radius: 8px`, `background: #ffffff`, subtle elevation via `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06)`)?
- [ ] Are crisp visual demarcation, pure white card interiors, and clear contrast maintained?
- [ ] Are weak 1px borders or washed-out pastel backgrounds avoided?
- [ ] Are monochrome SVG icons used for status indicators, avoiding colored platform emojis?

## Graphic Design Standards | 07 | Symmetrical Comparison & Differential Highlighting

- [ ] When contrasting two mechanisms (such as Controlled vs. Uncontrolled, or Server vs. Client Components), is the figure formatted with balanced, side-by-side symmetrical cards?
- [ ] Is differential highlighting applied (neutral tones for unchanged baselines, amber/rose for friction/danger, emerald/teal for resilient solutions)?
- [ ] Is each comparative diagram isolated so it fits within the target PDF page budget without overflowing across page breaks?

## Graphic Design Standards | 08 | Authentic UI Elements

- [ ] When rendering UI mockups inside figures, are authentic, believable interface elements displayed (newsroom headlines, subscriber pills, search inputs, publish buttons)?
- [ ] Are abstract meta-descriptors (such as boxes labeled "UI Component Goes Here") avoided in favor of realistic copy?

## Palette & Surface System | 09 | Semantic Color Coding

- [ ] Is semantic color coding applied consistently across figures:
    * **Emerald / Green (`#059669` / `#d1fae5`)**: Verified modern patterns, resilient architecture, declarative data flow, and successful runtime outcomes.
    * **Rose / Red (`#e11d48` / `#ffe4e6`)**: Traps, anti-patterns, full-page reloads, state drift, and runtime exceptions.
    * **Amber / Orange (`#d97706` / `#fef3c7`)**: Pending transitions, warnings, network latency, and intermediate states.
    * **Blue / Slate (`#2563eb` / `#dbeafe` / `#0f172a`)**: Structural boundaries, component names, parent containers, and neutral chrome.
- [ ] Does all text placed on colored cards satisfy WCAG AA contrast standards (minimum 4.5:1 contrast ratio against the background surface)?

## Palette & Surface System | 10 | The Lavender-and-Peach Comparison Palette

- [ ] For side-by-side paradigm comparisons, is the established dual palette used:
    * **Lavender (`#e0e7ff` / `#4338ca`)**: Classical baseline, legacy patterns, or client-side execution.
    * **Peach / Amber (`#ffedd5` / `#c2410c`)**: Modern React 19 pattern, server-side execution, or declarative actions.
- [ ] Does the distinct pairing help students immediately differentiate legacy baselines from modern architecture?

## Proven Template Catalog | 11 | Clone from Proven Archetypes

- [ ] When authoring a new figure, is it cloned from the catalog of proven archetypes in `figures/templates/`?
- [ ] Are the chosen template's labels, components, and data values adapted to match the current lecture's domain while preserving proven layout geometry, CSS classes, and font scales?
- [ ] Is inventing bespoke layout geometry avoided to protect against visual inconsistency and PDF print break errors?

## Proven Template Catalog | 12 | The Core Proven Archetypes

- [ ] Does the figure leverage one of the canonical catalog archetypes:
    * **Archetype 01: Component Hierarchy & Props Flow**: Top-down tree diagram displaying parent containers, child nodes, and downward prop vectors.
    * **Archetype 02: Side-by-Side State Comparison**: Symmetrical dual-card layout contrasting legacy imperative mutation against declarative updates.
    * **Archetype 03: Browser Event & Network Lifecycle**: Horizontal timeline illustrating client click → transition scheduling → server response → DOM commit.
    * **Archetype 04: Two-Column Split Window**: Code editor on the left paired with real-time rendered UI output on the right.
    * **Archetype 09: Progressive Assembly Step Cards**: Vertical stack of 2 to 4 full-width horizontal step cards introducing the collaborative assembly steps. #2026_09_22_06_group_1 revised by #2026_09_25_05_group_1
    * **Archetype 10: Architecture Audit Table**: Three-column comparative matrix deconstructing component layers and contrasting naive expectations with React 19 reality.

## Proven Template Catalog | 13 | Archetype 09 (Assembly Step Cards) Structural Standard & Canonical Color Palette #2026_09_20_08_group_1, #2026_09_20_11_group_1, #2026_09_22_06_group_1, and #2026_09_25_05_group_1

- [ ] Is Archetype 09 (`figures/{NN}-01-code-assembly-pipeline.html`) cloned directly from the canonical template (`templates/09-progressive-assembly-step-cards.html`) for Stage B of every practical example? #2026_09_22_06_group_1
- [ ] Does the assembly pipeline figure use the vertical stack of full-width horizontal step cards matching the 2 to 4 planned assembly steps ($N \in \{2, 3, 4\}$): #2026_09_25_05_group_1
    * Outer Container: `.assembly-steps-figure` (`max-width: 590px; display: flex; flex-direction: column; gap: 10px; margin: 0.85rem auto; break-inside: avoid`).
    * Step Cards (`.step-card`): Full-width row layout (`display: flex; flex-direction: row; width: 100%`) containing:
      1. `.card-edge`: Left colored accent strip (`width: 9px; flex-shrink: 0`).
      2. `.card-main`: Main pastel body containing badge, divider, and content.
      3. `.step-badge`: Left pill containing `.step-text` ("Step") and prominent bold `.step-num` ("1", "2", "3", "4").
      4. `.card-divider-wrap` / `.card-divider`: Rounded vertical divider line.
      5. `.card-content`: Right content area containing `.card-title` (mirroring collaborative step heading: `First, we...`, `Next, we...`, etc.) and `.card-components` with monospace `.component-tag` elements.
- [ ] Are 4-column side-by-side grid layouts (`.pipeline-grid`, `grid-template-columns: repeat(4, 1fr)`) avoided, preventing squished steps in narrow vertical boxes? #2026_09_22_06_group_1
- [ ] Is the canonical pastel color palette maintained across `.card-main` in sequential order matching the step count: #2026_09_25_05_group_1
    * `Step 1`: Blue (`#d4e1f1`)
    * `Step 2`: Teal (`#d0e6e1`)
    * `Step 3`: Warm Amber (`#f9e0c5`) (when 3 or 4 steps)
    * `Step 4`: Green (`#d2ebc9`) (when 4 steps)
- [ ] Are standard `.step-[1-N]` classes used on cards, avoiding manual class mutation or inline background overrides? #2026_09_25_05_group_1
- [ ] Are bleached white (`#ffffff`) or light grey (`#f8fafc`) card backgrounds avoided, preserving immediate visual differentiation across all steps?

## Proven Template Catalog | 14 | Archetype 10 (Architecture Audit Table) #2026_09_21_28_group_1

- [ ] Does Stage D conclude with Archetype 10 (`figures/{NN}-02-architecture-audit.html`)?
- [ ] Is it cloned directly from the canonical template (`templates/10-architecture-audit-vtable.html`) and structured with:
    * Editorial Substrate: Sits directly on the page substrate without outer card borders, rounded corners, or drop shadows; anchored strictly by heavy 3px black rules (`border-top: 3px solid #0f172a; border-bottom: 3px solid #0f172a`).
    * Table Layout & Margin Reset: Nested table neutralizes parent figure margins with `margin: 8px 0 0 0 !important; margin-left: 0 !important; width: 100% !important; table-layout: fixed !important; border: none !important;` to eliminate PDF page clipping.
    * An uppercase eyebrow header: `LESSONS FROM THE CODE`.
    * A title identifying the specific domain challenge.
    * Three comparative columns calibrated for single-page print budgets: `Component Layer` (22% width), `Naive Expectation` (39% width), and `What Happened` (39% width).
    * Subtle background shading on the reality column to emphasize modern patterns.
    * Layer breakdown rows traversing the architecture from parent container to terminal UI control (anti-leaf standard).
    * A final verdict row contrasting fragile state drift/coupling in red against modular resilience/synchronized truth in teal. #2026_09_21_28_group_1

## Authoring Mechanics | 15 | One Figure, One Self-Contained File

- [ ] Is every standalone figure saved as an independent `.html` file inside the active version's figures directory (e.g. `01-02-md-LECTURES/<version>/figures/{NN}-01-{slug}.html`)? #2026_09_24_05_group_1
- [ ] Is each figure file structured as a complete, self-contained HTML document containing its own `<style>` block and clean HTML structure?
- [ ] Are styles locally scoped under specific container classes (such as `.pipeline-container` or `.audit-table`), preventing CSS bleeding into the parent lecture page?

## Authoring Mechanics | 16 | Embedding via `html-figure`

- [ ] Are standalone figures embedded in lecture Markdown using the `html-figure` block:
    ```markdown
    ````html-figure src="figures/40-01-code-assembly-pipeline.html" caption="Figure 40.1: The progressive assembly pipeline of the feedback portal"
    ````
    ```
- [ ] Does the `src` attribute point to a valid file on disk, avoiding broken links?
- [ ] Does the figure provide an authoritative caption describing its educational takeaway?

## Authoring Mechanics | 17 | Print Safety and Height Budgets

- [ ] Is figure height calibrated to fit comfortably within standard PDF page budgets (maximum height of 380px to 420px)?
- [ ] Does the layout avoid exceeding the height budget, preventing awkward page breaks, orphaned headings, or pushed captions?
- [ ] Are compact font sizing (`13px` to `15px` body labels, `11px` to `12px` badges) and disciplined vertical padding (`8px` to `12px`) used for comfortable page fit?

## Integrity & Verification | 18 | Chronological Narrative Fidelity

- [ ] Do figures maintain strict chronological narrative synchronization with the lecture text:
    * Does an introductory figure in Section 1 or Stage B avoid displaying advanced child components or submission handlers that have not yet been introduced?
    * Do figures illustrate what the reader currently understands or is about to build, avoiding premature spoilers of end-of-lecture mechanics?

## Integrity & Verification | 19 | 1:1 Code-Figure Synchronization

- [ ] Does every identifier, component name, prop, and attribute rendered in a figure match the surrounding code snippets exactly?
- [ ] Does the diagram avoid divergent naming (e.g. displaying `searchText` when code declares `query`), preserving cognitive clarity for the student?

## Integrity & Verification | 20 | Verification Protocol #2026_09_20_28_group_1

- [ ] During routine lecture production and adaptation of proven figure templates, does verification rely primarily on clean compiler builds (`node src/build-lectures.mjs` with zero warnings)?
- [ ] Is routine screenshot inspection via `pdftoppm` avoided during regular authoring, reserving visual scans for new experimental template designs created in `figures/templates/` or explicit audit requests?
