# FIGURE DESIGN SYSTEM — CSS Interview Lectures (css-01)
## The Modern Benchmark Standard (Lectures 40 to 47)

This document is the permanent visual pattern catalog for all figures across the `css-01` lecture series. It codifies the breakthrough visual architecture established from Lecture 40 onwards (Lectures 40, 41, 45, 46, and 47) and permanently bans the obsolete, low-contrast, text-only card patterns from earlier drafts.

When creating a new figure for any CSS lecture, **NEVER invent a design from scratch**. Select, clone, and adapt one of the proven Figure Archetypes documented below.

---

## 1. The Cardinal Visual Laws (The "Anti-Ugly" Gate)

### Law 1: The "Never Text-Only" Law
A figure inside `.print-fig` is an illustration of **spatial, temporal, mechanical, or physical reality**.
- ❌ **BANNED:** Wrapping plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without any graphical diagram. That is a table, not a figure.
- ✅ **MANDATORY:** Every figure card MUST contain an authentic graphical substrate: a DOM traversal tree with connector circles, a realistic device mockup with browser chrome, an architectural blueprint canvas with technical calipers, a zoom viewfinder lens, a specificity ladder, or a growth curve track.

### Law 2: Strong Demarcation & Modern Surface Geometry
- Container: `.print-fig` with `border: 2px solid #0f172a`, `border-radius: 6px`–`8px`, `background: #ffffff`, and subtle elevation `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06)`.
- Cards: `border: 2px solid`, pure white interiors, crisp borders. Never use pale 1px borders or faded pastel backgrounds.
- Canonical Palette:
  - **Teal (#0e7490)**: Base/good state, layout canvas, valid rules, single-step lookups.
  - **Crimson (#9f1239)**: Failure state, over-nesting, specificity creep, zoom magnification lines.
  - **Slate (#1e293b / #0f172a)**: Neutral structure, physical screen glass, device chrome, metric grids.

### Law 3: Native Vector Chrome (Zero Platform Emojis)
- ❌ **BANNED:** Using platform yellow emojis (e.g. `🔒`, `✓`, `✕`, `📱`). They render inconsistently and look like toys.
- ✅ **MANDATORY:** Use clean inline SVG icons or crisp unicode text glyphs (`✓ MATCH`, `✕ ESCALATION`, SVG monochrome lock `<svg class="url-lock">`).

### Law 4: Exact Mathematical Centering for Guides & Markers
- When drawing timeline lines and circular nodes (like the DOM matching engine in 45.2):
  - Guide line: `left: 11px; width: 2px;` (center at `X = 12px`).
  - Node circle: `box-sizing: border-box; width: 10px; height: 10px; border: 2px solid; left: -19px; top: 50%; margin-top: -5px;`.
  - Both share the exact same mathematical center (`X = 12px`). The line passes directly through the dead center of every circle.

### Law 5: Symmetrical Comparison & Page-Break Isolation
- Compare figures must feature matching header pills, symmetrical title bars (`span` left, `span` right), matching interior diagram heights, and identical 2-line footers (`padding: 10px 14px; font-size: 11.5px; line-height: 1.35;`).
- Height must strictly respect the printable letter-size budget (~380px–420px total) so figure and figcaption remain unified on a single page with zero page-break splits.

---

## 2. The Seven Proven Figure Archetypes

### Archetype 1: DOM Traversal & Selector Matching Pipeline
- **Reference File:** `md-lectures/figures/45-02-browser-selector-matching-engine.html`
- **Use When:** Teaching selector evaluation order (right-to-left), key selector lookups, ancestor tree climbing, or rule bucket matching.
- **Key Components:**
  - `.traversal-tree`: relative container with `padding-left: 24px`.
  - `.tree-line`: vertical track (`left: 11px; width: 2px;`).
  - `.tree-node`: individual step card with `.tree-node::before` concentric circle marker (`width: 10px; height: 10px; left: -19px; top: 50%; margin-top: -5px;`).
  - Status badges: `.badge-status.badge-pass` (`✓ MATCH`) and `.badge-status.badge-walk` (`WALK ↑`).

### Archetype 2: Realistic Virtual Device & Mobile Browser
- **Reference File:** `md-lectures/figures/47-01-mobile-viewport-meta-comparison.html`
- **Use When:** Teaching viewport meta tags, responsive vs desktop rendering, mobile breakpoints, touch targets, or mobile-first layouts.
- **Key Components:**
  - `.phone-frame`: `width: 200px; height: 242px; border: 2.5px solid #0f172a; border-radius: 18px;`.
  - `.phone-notch` with speaker bar (`.notch-speaker`).
  - `.phone-browser-bar`: browser URL pill (`.browser-url-pill`) with inline SVG lock and publication domain.
  - `.web-masthead`: publication logo (`THE NATIONAL TIMES` in Georgia serif), date tag, and category kicker in crimson.
  - `.scaled-desktop`: 480px desktop layout scaled to 0.38 (`transform: scale(0.38); transform-origin: top left;`) showing multi-column articles, nav links, and secondary cards zoomed out.

### Archetype 3: Architectural Canvas & Zoom Viewfinder Lens
- **Reference File:** `md-lectures/figures/47-02-layout-vs-visual-viewport-anatomy.html`
- **Use When:** Teaching layout viewport vs visual viewport, pinch-zoom mechanics, coordinate systems, `position: fixed` anchoring, or keyboard popups.
- **Key Components:**
  - `.canvas-diagram`: virtual document blueprint with technical dimension caliper (`.caliper-bar` with tick marks `::before`/`::after` and labeled line).
  - `.mock-fixed-header`: element anchored to layout boundary (`position: fixed; ANCHORED TO TOP`).
  - `.viewfinder-lens`: elevated floating frame representing the screen glass (`width: 175px; height: 105px; box-shadow: 0 6px 16px rgba(15, 23, 42, 0.15);`) with `2.0× ZOOM` badge and red caliper line.
  - `.ghost-background-content`: ghosted boxes (`.ghost-box`) showing off-screen clipped canvas area.
  - `.metric-grid`: 2-column key/val matrix with short tokens (`JS API`, `MEDIA QUERIES`).

### Archetype 4: Specificity Ladder & Cascade Escalation
- **Reference File:** `md-lectures/figures/45-03-specificity-ladder-override-trap.html`
- **Use When:** Teaching cascade tournaments, specificity score comparisons, `!important` escalation traps, or inheritance battles.
- **Key Components:**
  - `.ladder-tier`: tiered horizontal steps displaying selector strings.
  - `.tier-score`: monospace score chips (`(0, 1, 0)` vs `(0, 4, 0)`).
  - `.verdict-box`: clear architectural derivation callout.

### Archetype 5: Multi-Paradigm Comparison & Token Stacks
- **Reference Files:** `md-lectures/figures/46-01-three-styling-paradigms-architecture.html`, `46-03-multibrand-token-theming.html`
- **Use When:** Contrasting CSS methodologies (BEM vs CSS Modules vs Tailwind), multi-tier design token pipelines, or abstraction layers.
- **Key Components:**
  - 3-card grid layout with decoupled metadata chips.
  - Layered token stacks (`.token-stack`, `.brand-row`, `.brand-swatch`) with high-contrast color swatches.

### Archetype 6: Stylesheet Growth Curves & Performance Charts
- **Reference File:** `md-lectures/figures/46-02-stylesheet-growth-curve-comparison.html`
- **Use When:** Teaching stylesheet size over time, bundle bloat, runtime style recalculation cost, or performance budgets.
- **Key Components:**
  - `.chart-box`: horizontal bar tracks (`.bar-track`, `.bar-fill`) with monospace size indicators (`min-width: 48px; white-space: nowrap;`).

### Archetype 7: Compiler Geometry & Preprocessor Transformations
- **Reference Files:** `md-lectures/figures/40-01`, `40-02`, `41-01`, `41-02`
- **Use When:** Teaching preprocessor compilation (Sass/Less), compile-time AST transforms, variable scope resolution, or mixin expansions.
- **Key Components:**
  - Build-time code expansion panels, AST step arrows, input/output syntax comparison.

---

## 3. Pre-Flight Checklist for Every New Figure

Before building any HTML figure file:
1. *Is this card merely text and tables?* -> **REJECT**. Add an authentic graphical substrate (calipers, device mockup, DOM tree, or lens).
2. *Does it use the canonical `.print-fig` shell with 2px solid borders and box shadow?* -> Enforce.
3. *Do circles on vertical lines share the exact center coordinate?* -> Calculate `left` and `margin-top`.
4. *Are all table/metric keys short enough to prevent column collisions?* -> Use `JS API` instead of `JAVASCRIPT API`; enforce `gap: 8px`.
5. *Does the entire figure fit within the 400px–420px height budget on its target PDF page?* -> Verify with Prince compilation and `pdftoppm`.
