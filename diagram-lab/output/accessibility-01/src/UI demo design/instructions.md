## Design Specification: The Accessibility Canvas

The core challenge in illustrating accessibility failures—such as the silent "Card number" field that costs a publication its subscribers—is cognitive blending. When educational meta-data (like screen reader announcements or HTML tags) is rendered inline with a mock user interface, readers cannot instantly distinguish the website's actual visual design from the pedagogical annotations.

To solve this, the "Accessibility Canvas" must employ the **Inspector Principle**: a strict visual and spatial segregation between the UI layer and the meta-layer.

### 1. Typographic Segregation

Never use the same font family for both the UI and the annotations. The human eye uses typographic texture as a primary cue for categorization.

* **The UI Layer:** Use standard, readable proportional fonts (e.g., `-apple-system`, `Georgia`, or `Inter`) to represent the mock website accurately.


* **The Meta-Layer:** Strictly use a monospace font (e.g., `SF Mono`, `Menlo`, or `JetBrains Mono`) for all accessibility chips, tags, and screen reader readouts.


* **Text Treatment:** Force all structural meta-tags (like `banner`, `navigation`, `H1`) into uppercase with aggressive letter-spacing (e.g., `0.06em` to `0.08em`) and heavy font weights (`700` or `800`). This mimics the aesthetic of a code editor or developer console, instantly signaling "this is under the hood."



### 2. Spatial and Z-Index Offset

Annotations must not push, stretch, or alter the natural layout of the UI elements.

* **Floating Badges:** Landmark tags and verdict flags must use absolute positioning, anchored to the top-left or top-right corners of their target elements (e.g., `top: -9px; left: 8px;`).


* **Ghost Borders:** When highlighting a structural region (like a `<nav>` or a `<form>`), use dashed or dotted outlines with an `outline-offset` rather than solid borders. Solid lines read as UI boxes; dashed lines read as selection marquees.


* **Drop Shadows:** Apply tight, hard-edged drop shadows (e.g., `box-shadow: 2px 2px 0 rgba(0,0,0,0.2)`) to floating chips like the Screen Reader (SR) announcements. This physically lifts the annotation off the canvas.



### 3. Color Taxonomy

The mock UI should utilize a muted or distinct brand palette (e.g., the National Times styling). The meta-layer must utilize a strict, functional color taxonomy that heavily contrasts with the UI.

* **Verdicts:** Reserve stark Crimson/Red (`#f04438`) strictly for `WRONG` failures (like an unlabelled input) and Emerald/Green (`#12b76a`) strictly for `RIGHT` accessible patterns.


* **Structure:** Use vibrant Orange (`#ea580c`) for structural landmarks (`banner`, `navigation`) and bright Blue (`#1570ef`) for focus order badges.


* **Screen Reader (SR) Output:** Instead of a single static color, Screen Reader tooltips dynamically inherit the semantic color of the element's validity bounding box (Emerald/Green for `RIGHT`, Crimson/Red for `WRONG`). This visually and conceptually ties the structural state of the element to the exact words the software reads aloud. If an element has no validity state, it defaults to deep Violet/Purple (`#7c3aed`).



### 4. Component Anatomy

* **Minimal 2-Element Comparison (`layout="compare"`):** Instead of large, monolithic page mockups with dozens of elements, component mechanism comparisons must use minimal buckets of information: exactly two elements (one `WRONG`, one `RIGHT`). All unrelated chrome is stripped away to keep cognitive focus entirely on the mechanism.

* **Removal of the Dark Terminal Strip:** The dark terminal/console strip at the bottom of the canvas is completely eliminated to prevent visual distraction and conserve page budget. Element statuses, screen reader readings, and contrast values are cleanly presented using centered top pill tags (`WRONG: ...` / `RIGHT: ...`) and bottom status note chips (`note="..."`).

* **Tight Control Attachment:** Absolute focus rings, ghost rings, and badges must attach directly to the interactive control (`.ui-control-wrapper`), never snapping to the outer container card.

* **Ghost Outlines for Stripped/Invisible Focus:** When illustrating an invisible failure (e.g. `outline: none`), use `ghost`. This renders a dashed red perimeter (`border: 2px dashed #f43f5e`) at the exact focus ring boundary with a corner badge (`✕ 0px`), paired with a status chip (e.g. `✕ 0px outline (user blinded)`). This visually emphasizes that the element holds active focus even though the ring was stripped.

* **Dark Surface Simulation (`surface="dark"`):** When evaluating contrast against dark backgrounds (footers, dark cards, hero sections), set `surface="dark"`. The canvas renders a dark navy background (`#090d16`) with dark slate cards (`#0f172a`), ensuring that low-contrast failures (e.g. 1.1:1 ratio) realistically blend into the background rather than sitting on an unintended white card.

* **Ghost Elements (Visually Hidden):** Elements that are visually hidden but available to screen readers (`.is-sr-only`) should be rendered with 50% opacity, a dashed gray border, and a "visually hidden" label to convey their presence in the DOM but absence on the screen.

* **Dynamic Canvas Rhythm (Spacing):** Standard mock UI elements preserve tight, native web spacing (`margin-bottom: 24px`). The canvas dynamically injects larger vertical gaps (`margin-bottom: 72px`) *only* underneath elements containing a Screen Reader tooltip (`.has-sr`) in full-page mode.

* **Validity Marking (Markdown):** Always provide an explicit validity state (`right` or `wrong`) in the markdown for interactive elements. In `layout="compare"`, this generates a clean centered pill tag above the card without drawing noisy outer card borders.



### 5. Interactive Unmasking (The Ultimate Clarifier)

While static design cues are powerful, interactivity cements the mental model. The final implementation of the Canvas should include an "X-Ray" toggle switch in the chrome header.

* **State 0 (UI Only):** The reader sees only the clean National Times UI, exactly as a sighted user does. The invisible failures (like the placeholder-only input) look perfectly normal.


* **State 1 (Inspector Mode):** The meta-layer fades in. The dashed outlines, red/green verdicts, and purple screen reader chips appear, immediately mapping the invisible accessibility tree directly over the visual DOM.

How much control do you want the user to have over this canvas in the final educational product—should they be able to click individual elements to see their specific code, or is a global "reveal" toggle sufficient for the lesson?