
Description

A horizontal communication diagram displaying two parallel endpoint nodes—a "Client" node on the left and a "Server" node on the right—connected by two opposing directional paths arranged vertically one above the other. The upper path extends from the Client to the Server with an arrow pointing right toward the Server, carrying a midpoint badge labeled GET /index.html HTTP/1.1 to designate the outbound client request. Directly beneath it, running parallel across the same gap, the lower path extends from the Server back to the Client with an arrow pointing left toward the Client, carrying a midpoint badge labeled HTTP/1.1 200 OK to designate the returning server response. Both rectangular nodes share the same vertical height and horizontal alignment, centered symmetrically across a wide intermediate negative space that leaves ample room for the parallel request and response vectors.



Design System & Visual Aesthetic: "Editorial Technical Manuscript (Diagram Only)"

1. CORE PALETTE & COLOR ASSIGNMENTS
Use this strict, high-contrast pastel palette. Do not introduce extraneous gradients, glossy finishes, or 3D skeuomorphism.
- Canvas / Outer Page Background: #ffffff (Pure solid white, RGB 255, 255, 255; must blend 100% invisibly into printed white book pages with zero margin tint)
- Diagram Container Fill: #f4ecfd (Soft lavender tint; STRICTLY SINGULAR, exactly one outer container signaling the boundary of the figure)
- Diagram Container Stroke: 2px solid #d2bbf6 (Light violet border)
- Primary Vector Line & Accent: #8a5af7 (Vibrant purple; used for dashed paths, connector nodes, and group titles)
- Diagram Primary Nodes / Blocks:
  * Fill: #f9b874 (Warm pastel peach/apricot)
  * Stroke: 2px solid #e39c4a (Warm ochre border)
  * Node Label Text: #a16315 (Deep burnt amber for high contrast and readability)
- Node Font: Monospace (JetBrains Mono, SF Mono, or Fira Code), medium-to-bold, 12px–14px, letter-spacing +0.05em.

2. CONTAINER ARCHITECTURE & SCOPE
- The image must contain ONLY the diagram frame and internal elements.
- Container Shape: Rounded rectangle with a 12px to 16px corner radius.
- Stroke: Uniform 2px solid border in lavender (#d2bbf6).
- Padding: Generous interior negative space (minimum 32px to 48px padding around inner diagrams).
- SINGULAR CONTAINER LAW: The lavender background is strictly singular. NEVER create nested mini-backgrounds, secondary tinted boxes, or shaded horizontal strata inside the container.
- INTERNAL GROUPING & SUB-AREAS: When elements form logical groups (such as trees or comparison lanes), demarcate them ONLY with delicate dashed perimeter outlines (stroke 1.5px in #d2bbf6 or #8a5af7) or negative whitespace—never tinted fill planes.
- TITLE PLACEMENT & COLOR LAW:
  * Whole-Image Indicative Title (if present): Can sit subtly at the top-left of the overall container.
  * Internal Group / Block / Lane Titles: MUST be horizontally CENTERED directly above or within their respective dashed perimeter, sub-group, or comparison lane.
  * Title Styling: Uppercase monospace font, styled in the exact vibrant purple accent color (#8a5af7) used for connector lines.
- STRICT EXCLUSIONS: Do NOT generate external figure titles, headers, slug names, metadata, figure numbers (e.g., "Fig 1.1"), or captions outside the container. The only allowed text lives inside blocks, on path badges, or as centered internal block/group labels.

3. COMPONENT & VECTOR NODES
- Geometric Node Blocks:
  * Fixed modular proportions (approx. 120px wide × 80px high; maximum 20%–25% of container height).
  * 8px corner radius.
  * 2px solid borders (#e39c4a) over flat peach fill (#f9b874).
  * Subtle elevation: light ambient drop shadow (0 1px 2px rgba(0,0,0,0.05)).
  * ANTI-CLIP-ART BAN: Strictly forbid hand-drawn document sheets, scribbled icons, or glyphs (<..>, </>). Every entity must be a clean, geometric peach rectangular card.
- Connectors & Flow Indicators:
  * Dash Pattern: MANDATORY dashed pattern for ALL connecting lines (stroke-width 2px, stroke-dasharray "6 6"), colored vibrant purple (#8a5af7). Solid lines are strictly prohibited.
  * Connector Waypoints: Every connector line MUST feature a solid circular dot (diameter 10px) centered at its midpoint, colored solid purple (#8a5af7).
  * Directional Flow: Orthogonal or parallel lines with sharp vector arrowheads.
- Pill Badges:
  * Floating labels along connector paths.
  * Pill shapes with rounded ends, filled with #f4ecfd, bordered with a thin purple stroke, containing bold monospace text.

4. COMPOSITION & RESTRICTIONS
- Clean, flat, 2D vector technical illustration.
- Strict horizontal/vertical grid alignment and symmetry.
- No photorealism, no 3D rendering, no gradients, and no drop shadows on lines.

5. UNIFORM CAMERA PERSPECTIVE & SCALE LAW (ANTI-ZOOM INVARIANT)
- Strict Orthogonal View: Flat 2D top-down orthogonal schematic diagram from a fixed, standardized camera distance. Zero isometric angle, zero 3D tilt, zero perspective distortion.
- Fixed Modular Scale: All rectangular nodes must occupy compact dimensions (approx. 15% to 25% of canvas height).
- Low-Density Negative Space Law: When a diagram features few elements (e.g., 2 or 3 nodes), the generator must NEVER zoom in and NEVER enlarge the nodes or typography to fill the canvas. Keep the nodes compact and small in a central horizontal band, leaving generous open lavender negative space around the elements.
- Typographic Uniformity: All text across all diagrams must use the exact same small editorial monospace font scale (captions 11pt, labels 12px–14px, titles 16px equivalent). Never render oversized headline-scale letters.
- ANTI-ACRONYM & PLAIN B2 TEXT LAW: Strictly ban unbaptized technical acronyms, networking metrics, and pseudo-math (e.g. RTT, TTL, TTFB, MTU, CDN, P99, 3x RTT) from all node labels, path badges, and lane titles. Every label must use plain, tangible English words describing physical entities or real-world actions (e.g., "Three Round Trips Over the Internet" instead of "3x RTT"; "Single Parallel Query" instead of "1x RTT"). A tired reader with a headache must understand every card in two seconds.