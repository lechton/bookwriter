### Project Summary: Svelte 5 Educational Deck Expansion

**Objective Completed**
Expanded the Svelte 5 flashcard web application by engineering five additional educational modules. Each card seamlessly integrates responsive code comparisons, direct technical explanations, and pure-HTML/CSS data visualization diagrams to illustrate complex framework mechanics.

---

### Content Architecture

The content translates core reactivity and structural updates in Svelte 5 into accessible, highly specific learning modules:

* **Card 6: Event Handling:** Demonstrates the shift from `on:click` directives to standard HTML attribute syntax (`onclick`).
* **Card 7: Snippets (`#snippet`):** Illustrates how to declare and render reusable UI blocks within the same component, acting as lightweight, stampable templates.
* **Card 8: Bindable Props (`$bindable`):** Explains two-way data synchronization between parent and child components without boilerplate event dispatchers.
* **Card 9: State Inspection (`$inspect`):** Details the built-in debugging rune that automatically logs reactive state changes to the console.
* **Card 10: Effect Cleanup:** Maps the teardown lifecycle within an `$effect` closure, showing how returning a function prevents memory leaks.

---

### Visual Diagram Typology

Each card features a bespoke, semantic HTML diagram designed to visually map the data flow and logical structure of the code snippets:

* **The Switch (Events):** A side-by-side comparative grid contrasting the legacy syntax against the modern approach.
* **The Blueprint (Snippets):** A top-down "Factory Stamp" tree diagram showing a single source of truth stamping out multiple UI instances.
* **The Two-Way Street (Bindable):** A horizontal flow layout utilizing crossing, bi-directional arrows to depict seamless data synchronization.
* **The Terminal (Inspect):** A high-contrast, inverted dark-mode block mimicking a developer console to ground the abstract concept in a familiar visual environment.
* **The Lifecycle Flow (Cleanup):** A sequential, 1-2-3 pipeline diagram detailing chronological execution and teardown.

---

### Design Philosophy: Neo-Brutalism & Print-Readability

The aesthetic philosophy is strictly **Neo-Brutalist**, prioritized for absolute clarity and dual-medium delivery (screen and print).

* **Stark Contrast:** Relies exclusively on absolute black (#000) and pure white (#FFF), with minimal gray for code blocks. This guarantees zero information loss when routed through a standard monochrome printer.
* **Structural Borders:** Uses heavy, thick borders to define spatial boundaries, eliminating the need for delicate drop shadows or subtle background tints that fail in print.
* **CSS Geometry:** Visual flair (like the jagged, torn-paper bottom edge) is generated mathematically via CSS linear gradients rather than image assets, ensuring infinite scalability and fast rendering.

---

### The Designer's Mindset

When creating diagrams within this framework, a designer must operate with an engineering mindset, adhering to the following principles:

1. **Function Dictates Form:** Every dashed line, solid box, and arrow must represent a specific technical relationship (e.g., dashed for abstract data flow, solid for component files). Do not add elements purely for decoration.
2. **Spatial Efficiency over Proportional Scaling:** Structural padding must be kept deliberately tight. If a user needs to scale up the typography for accessibility or readability, the layout engine must not proportionally inflate the surrounding whitespace, which would choke the content and break the print layout.
3. **Semantic Layouts:** The physical arrangement of the diagram should mirror the mental model of the code. If data flows downward through props, the diagram must be strictly vertical. If components are siblings, they must sit horizontally.
4. **Resilience without JS/SVGs:** Build diagrams using standard HTML elements (flexbox, grid, borders). This ensures the diagrams remain selectable, accessible to screen readers, and perfectly printable without relying on heavy external vector graphics.

---

### PDF Dimensions and Print Constraints

The project relies on Prince to generate precise PDF flashcards. All layouts must be built with the strict page dimensions in mind:

* **Flashcard Aspect Ratio:** The CSS sets `@page { size: 130mm 270mm; margin: 6mm; }`. This creates a very tall, narrow card.
* **Horizontal Constraints:** Diagrams MUST NOT exceed the horizontal bounds of this narrow format. Avoid wide side-by-side flex layouts that contain long text, as they will cause the page to shrink-to-fit, making the text illegible.
* **Vertical Flow Preference:** Prefer vertical stacking (`flex-direction: column`) over horizontal rows for comparing concepts, unless the horizontal elements are extremely concise.
* **Testing:** Any diagram added to `javascript-demo` or `svelte-demo` must be checked against this 130mm width to ensure readability in the final PDF.