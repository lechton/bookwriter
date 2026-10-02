## Core Design Principles & Aesthetic Strategy

The design language is strictly rooted in academic, professional textbook publishing (akin to modern McGraw-Hill layouts). It prioritizes flat design, maximal visual clarity, and high precision. All brutalist characteristics (harsh shadows, high-contrast black borders) are removed. The UI relies on subtle color coding, precise geometric alignment, and distinct typographic hierarchies to explain complex technical concepts without overwhelming the reader.

## Color Palette & Typography

The color system uses soft, muted pastels and distinct semantic accents to map visual elements directly to code logic.

**Color Palette:**

* **Canvas Backgrounds:** Ultra-light, desaturated tones. Use a very soft slate/gray (`#F8FAFC` or similar) for neutral structural diagrams, and pale thematic pastels (like soft lavender `#F3E8FF`) for specific layout concepts.
* **Item Fill & Borders:** Flex items and blocks use flat pastel fills, such as a soft muted orange (`#FFCC80`), enclosed by a slightly darker border of the same hue (`#F6A23E`) to define the edge without stark contrast.
* **Semantic Accents (Arrows & Annotations):** Use distinct, readable, but slightly muted primary colors to track concepts. For example, muted red (`#EF4444`) for the Main Axis and soft blue (`#3B82F6`) for the Cross Axis.
* **Text & Captions:** Dark slate (`#334155`) for primary reading text, and lighter cool gray (`#64748B`) for structural labels, figure captions, and placeholder text inside diagrams.

**Typography Rules:**

* **Prose & Explanations:** Use a clean, highly legible geometric sans-serif (e.g., Inter, Roboto, or Helvetica) for all standard body text and descriptive paragraphs.
* **Technical Labels & Captions:** Use a crisp, modern monospace font (e.g., JetBrains Mono, Fira Code) for any text referring to code, diagram labels (like `main axis`), inner-box placeholders (like `flex item`), and figure captions.
* **Hierarchy:** Keep font weights normal (400) to medium (500) to maintain the flat, unaggressive aesthetic. Only use bolding for explicit structural titles (e.g., **space-between**).

## Structural Elements

Diagrams must feel like precise mathematical canvases rather than interactive web components.

* **The Master Canvas (Browser/Container):** The outermost bounding box of a diagram must feature a generous border radius (e.g., 8px to 12px) and a thin, 1px solid border that is a slightly darker shade of its background color. No drop shadows.
* **The Flex Items (Inner Blocks):** These must feature a slightly smaller border radius than the master canvas (e.g., 6px) to maintain geometric harmony. They require a solid 1px or 2px border and a flat fill.
* **Padding and Whitespace:** Generous internal padding is mandatory. Diagrams must never feel cramped; the empty space is critical for demonstrating how CSS distribution properties operate.

## Diagram Annotations

The visual tools used to explain the code must resemble precise vector graphics.

* **Directional Arrows (Axes):** Use solid, straight 2px lines. Arrowheads should be solid, flat triangles (not barbed or open paths). Labels for these axes should be positioned flush against the line or slightly intersecting it, colored to match the axis line perfectly.
* **Invisible Forces (Spacing & Distribution):** Represent negative space or calculated distribution (like `justify-content`) using dashed lines (e.g., 2px dash, 4px gap).
* **Mathematical Nodes:** When indicating where space is divided (e.g., the exact center point between two distributed flex items), use small, solid circular dots (4px to 6px diameter) placed precisely on the dashed lines.
* **Figure Captions:** Every diagram must be followed immediately by a figure caption placed outside the main canvas. The caption must be centered, monospaced, colored in muted gray, and prefixed with standard academic numbering (e.g., `Fig 4.2: The foundational coordinate system...`).

## Authentic Components & Demarcation Laws (Gold Standard)

The reference implementation in `demo_lecture_03_inherit.html` and `canvas-lab/md/03.md` demonstrates the three core rules for UI figures:

1. **Zero CSS Code in Figures:** Code belongs in the code editor fence preceding the figure. The figure itself must never repeat raw CSS blocks with curly braces. It is purely the browser's rendered UI consequence.
2. **Authentic UI Components:** Elements must look like genuine, styled website components (e.g. an authentic dark website footer with branding and links, or a styled button with an SVG icon) rather than abstract grey wireframes. Elements contain ONLY their natural user-facing text.
3. **The Demarcation Law for Invisible Elements:** When an element is visually swallowed by its container (e.g., black `#000000` text on dark slate `#0F172A`), never leave a blank void that confuses the reader ("*I did not see what I did not see*"). Always draw a dashed ghost demarcation box (dashed perimeter with a subtle contrast wash and a failure value tag like `#000000`) so the exact position and identity of the failing element are unmistakably visible.
4. **Strict External Callouts:** All technical diagnostics, coordinates, and error explanations MUST be presented strictly in clean external callout badges with directional pointers (`▼` / `▲`), keeping the interactive elements themselves pristine.

Implementing these rules guarantees a highly legible, print-friendly, and authoritative educational interface that allows the CSS concepts to remain the primary focus.