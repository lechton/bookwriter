## Description

A flat 2D orthogonal comparative schematic contrasting legacy monolithic compilation against modern native toolchains, organized into two symmetrical horizontal rows separated by open lavender negative space. Above the upper row, a centered title in purple uppercase monospace reads "LEGACY WEBPACK MONOLITH (O(N))". The upper row features a compact peach card labeled "Source Components" connecting rightward via a dashed path with a purple waypoint dot into a peach card labeled "Full Graph Compilation" with sub-label "Crawls Entire Codebase Before Boot", connecting rightward via a dashed path into a single card labeled "Monolithic Client Bundle" with a pill badge labeled "High Startup Latency". Above the lower row, a centered title in purple uppercase monospace reads "MODERN TOOLCHAIN (VITE / ESM)". The lower row features a matching peach card labeled "Source Components" connecting rightward into two parallel pathways via dashed paths with waypoint dots: an upper path leading to a peach card labeled "Native Dev Server" outputting to "Instant ESM Server", and a lower path leading to a peach card labeled "Native Compiler" outputting to "Tree-Shaken Route Chunks", accompanied by a pill badge labeled "Sub-Second Startup". All entities are clean peach rectangular cards with ochre borders; all lines are dashed purple with centered waypoint dots.

## Design Theme

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
  * Fixed modular proportions (approx. 120px wide × 80px high).
  * 8px corner radius.
  * 2px solid borders (#e39c4a) over flat peach fill (#f9b874).
  * Subtle elevation: light ambient drop shadow (0 1px 2px rgba(0,0,0,0.05)).
- Connectors & Flow Indicators:
  * Dash Pattern: All connecting lines must be dashed (stroke-width 2px, stroke-dasharray "6 6"), colored vibrant purple (#8a5af7).
  * Connector Waypoints: Every connector line features a solid circular dot (diameter 10px) centered at its midpoint, colored solid purple (#8a5af7).
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
- Low-Density Negative Space Law: When a diagram features few elements (e.g., 2 or 3 nodes), DO NOT zoom in and DO NOT enlarge the nodes or typography to fill the canvas. Keep the nodes compact and the font small, leaving open lavender negative space around the elements.
- Typographic Uniformity: All text across all diagrams must use the exact same small editorial monospace font scale (captions 11pt, labels 12px–14px, titles 16px equivalent). Never render oversized headline-scale letters.
