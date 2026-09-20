# 05 — Visual Aesthetics & Figure Design System (react-lecture-04)

This document is the permanent visual constitution and design system across the `react-lecture-04` lecture series. It unifies the breakthrough visual architecture of this series with the canonical comparison benchmark established in `various/html/manual_vs_declarative_react.tsx`.

When creating figures or visual panels for any React lecture, **NEVER invent designs from scratch**. Select, clone, and adapt one of the proven Figure Archetypes documented below.

---

## 1. The Visual-First Philosophy & Opening Anchor Law

### Principle 1: The Opening Visual Anchor (Strict)
The opening technical code snippet of a lecture (Section 1) must **never sit naked**. 
- The opening section is where the student either engages or tunes out. 
- Pairing that initial code immediately with an authentic visual panel (such as the Symmetrical State Audit or React Component Explorer) grounds the problem in physical reality right away.
- The student's eye must be caught by a tangible screen widget rather than dry, abstract syntax.

### Principle 2: Visual-First by Default (Pragmatic Restraint)
- **Visual-first as an active instinct, not an absolute tax:** Wherever code triggers a visible state shift, a layout division, a reconciliation fork, or a boundary contrast, prioritize showing a clean panel rather than relying solely on abstract text.
- **Freedom for deep derivations:** When diving into subsequent analytical details—such as TypeScript definitions, minor edge-case helpers, or micro-refactors—the code is free to breathe naturally in prose without forcing an artificial diagram.
- **Zero Diagram Inflation:** Never invent fake, decorative diagrams for purely analytical formulas or type signatures. Visuals exist to unlock genuine insight, not to decorate every code block.

---

## 2. The Cardinal Visual Laws (The "Anti-Ugly" Gate)

### Law 1: The "Never Text-Only" Law
A figure inside `.print-fig` is an illustration of **spatial, temporal, mechanical, or physical reality**.
- ❌ **BANNED:** Wrapping plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without any graphical diagram. That is a table, not a figure.
- ✅ **MANDATORY:** Every figure card MUST contain an authentic graphical substrate: a component hierarchy tree with props flow, a Fiber work loop traversal, a state dispatch track, an immutable object copy matrix, or a live rendered UI component.

### Law 2: Strong Demarcation & Modern Surface Geometry
- Container: `.print-fig` with `border: 2px solid #0f172a`, `border-radius: 8px`, `background: #ffffff`, and subtle elevation `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06)`.
- Cards: Crisp borders, pure white interiors, clear visual contrast. Never use pale 1px borders or faded, muddy pastel backgrounds.

### Law 3: Native Vector Chrome (Zero Platform Emojis)
- ❌ **BANNED:** Using platform yellow emojis (e.g. `🔒`, `✓`, `✕`, `📱`).
- ✅ **MANDATORY:** Use clean inline SVG icons or crisp unicode text glyphs (`✓ REACTIVE`, `✕ BROKEN`, inline SVG lock/arrows).

### Law 4: Exact Mathematical Centering for Guides & Markers
- Timeline guides, tree tracks, and node markers must share identical mathematical centers so connector lines pass cleanly through the center of every node.

### Law 5: Symmetrical Comparison & Page-Break Isolation
- Compare figures must feature matching header pills, symmetrical title bars, matching interior diagram heights, and identical 2-line footers (`min-height: 52px;`).
- Total figure height must strictly respect the printable letter-size budget (~380px–420px total) so figure and figcaption remain unified on a single page with zero page-break splits.

### Law 6: The Anti-Meta-Descriptor Law (Pure Archetypical UI)
- ❌ **BANNED:** Never use meta-descriptions, diagnostic labels, or key-value captions inside component bodies (e.g. `Current count in memory: 5`, `Binding trigger: + Increment`, `DOM rendered value:`, `Engine status:`, `Input field:`).
- ✅ **MANDATORY:** Make all rendered UI purely archetypical and visually self-evident. The student must immediately infer what the component is from its authentic, elegant flat design:
  - **Counter**: A prominent bold number (`5`) with stepper buttons (`− Decrease` and `+ Increase`).
  - **Article Feed**: Clean flat article cards showing a bold headline, 2-line excerpt, journalist byline (`Marcus Vance · 4 min read`), and a category badge (`Metro`).
  - **User Profile**: Avatar initials circle (`MV`), journalist name, editorial title, status pill (`● Active Contributor`), and action buttons (`Following`, `Message`).
  - **Search Box**: An authentic input pill with magnifying glass SVG, active query text, `✕` clear button, and result count (`14 stories found for "climate"`).
  - **Cart / Store**: Order line items with currency amounts, order total, and `Checkout` button.

### Law 7: Progressive Component Decomposition (Meaningful Stepped Visualization)
- When a lecture teaches a system composed of multiple interacting components (e.g. a higher-level composite container and its nested children):
  - ❌ **BANNED:** Never cram 5–6 components with all their internal buttons, steppers, and props into a single crowded, unreadable diagram.
  - ✅ **MANDATORY: Visualize in Meaningful Steps (Two-Panel Progression on the Same Page)**:
    - **Panel 1 (High-Level / Macro View)**: Present the higher-level container (e.g. `CartDrawer.jsx` highlighted in the sidebar) showing its clean, intact rendered HTML view without exposing internal component boundaries prematurely.
    - **Panel 2 (Dissected / Micro View)**: Directly below Panel 1, present the second panel that takes that exact component and dissects it into its constituent child components (e.g. `<CartItemRow.jsx>` with internal steppers `[−] 1 [+]`, unit prices, and remove buttons, plus `<CartSummary.jsx>`).
    - **Sidebar State Synchronization:** In Panel 2, the left file tree **dynamically shifts its active highlight** to the child component being dissected (`CartItemRow.jsx` with `.active` pill). This immediately visually links the IDE file selection to the deconstructed component architecture.

### Law 8: The Symmetrical State Audit (The Canonical Comparison Benchmark)
Adapted from `various/html/manual_vs_declarative_react.tsx`:
- When contrasting two mental models, execution paradigms, or state synchronization routines (e.g. Imperative DOM vs. Declarative React):
  - ❌ **BANNED:** Dense spaghetti wiring, crisscrossing connector lines, or confusing abstract compiler AST graphs.
  - ✅ **MANDATORY: Symmetrical Row Parity with Trigger Card**:
    - **Trigger Anchor First:** Feature the causal user action / mutation function call (e.g. `switchUser('Elena Vance')`, `dispatch({ type: 'ADD' })`) in a prominent top white card. The reader must see the *cause* before they see the *effects*.
    - **Dual Columns with Central VS Medallion:** Flawed model on the left (`Manual DOM`), sound model on the right (`Declarative React`), separated by a central floating `#9333ea` circular "VS" badge.
    - **1:1 Row Alignment:** Both columns audit the exact same elements in identical order.
    - **Calm Editorial Defect Highlighting:** Never use aggressive neon red. Mark broken/stale rows with an elegant peach warning card (`bg: #fff1e5`, `border: 1.5px solid #f6c39a`, `text/icon: #c05b18`, `✕` icon) so defects stand out immediately without visual harshness.
    - **Soft Iris/Lavender Framing:** Frame the entire comparison stage in a serene `#f5effd` iris wash with subtle `#e9d5ff` borders.

---

## 3. The Color & Surface Constitution

### A. The Comparison Palette (The Iris & Peach System)
- **Stage Background:** `#f5effd` (soft lavender wash).
- **Stage Border:** `1px solid #e9d5ff` (subtle purple boundary).
- **Brand / Accent Title:** `#7e22ce` / `#9333ea` (primary purple for metadata and active headers).
- **Flawed Stage Container:** `#f0eaf7` with `#e9e1f5` header bar and `#581c87` text.
- **Sound Stage Container:** `#ffffff` with subtle shadow and `#7e22ce` header bar.
- **Passing Card:** `#ffffff` with `#f3e8ff` border and `#a855f7` checkmark.
- **Defect Card:** `#fff1e5` background, `#f6c39a` border, `#c05b18` text and cross icon (`✕`).
- **VS Medallion:** `#9333ea` circle with bold white text (`40px × 40px`).

### B. The Component Explorer Palette & Metric Constitution (Strict)
To ensure absolute visual harmony and permanently prevent arbitrary styling drift, all React Component Explorer figures MUST strictly adhere to the following color, font-size, and geometry tokens cloned from the canonical templates (`md-lectures/figures/templates/`):

#### 1. Container & Window Metrics
- **Container Box:** `max-width: 680px; margin: 1.5rem auto; border: 1px solid #cbd5e1; border-radius: 10px; background: #ffffff; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07), 0 1px 2px rgba(15, 23, 42, 0.04); overflow: hidden;`
- **Window Chrome Bar (`.rce-bar`):** `padding: 10px 14px; background: linear-gradient(to bottom, #ffffff, #edf1f5); border-bottom: 1px solid #cbd5e1;`
- **Traffic Light Dots (`.rce-dots i`):** `width: 11px; height: 11px; border-radius: 50%;`
  - Red: `background: #ef4444; border: 1px solid #dc2626;`
  - Yellow: `background: #f59e0b; border: 1px solid #d97706;`
  - Green: `background: #10b981; border: 1px solid #059669;`
- **Window Title (`.rce-title`):** `font-size: 0.82rem; font-weight: 700; color: #475569; letter-spacing: 0.02em; text-align: center;`

#### 2. Left Sidebar Metrics (`.rce-sidebar`)
- **Sidebar Box:** `flex: 0 0 30%; padding: 1.1rem 0.95rem; background: #fdfdfd; border-right: 1px solid #cbd5e1;`
- **Sidebar Title (`.rce-sidebar-title`):** `font-size: 0.68rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.09em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.65rem;`
- **File Tree Labels (`.rce-tree-label`):** `font-size: 0.80rem; font-weight: 500; color: #0f172a; border-radius: 5px; padding: 0.28rem 0.38rem; gap: 0.45rem;`
- **Active File Selection (`.rce-tree-label.active`):** `background: #e0f2fe; color: #0369a1; font-weight: 700;`
- **File Tree Icons (`.rce-icon`):** Monochromatic vector SVGs (`width: 1.05rem; height: 1.05rem;`), folder stroke `#f59e0b`, React JSX stroke `#087ea4`, TypeScript TSX stroke `#3178c6`. Never use colored acronym badge pills (`.badge-html`, `.badge-ts`) in place of canonical tree icons.

#### 3. Stage & Canvas Metrics (`.rce-stage`, `.rce-canvas`)
- **Stage Background (`.rce-stage`):** Crisp blueprint slate `background: #f1f5f9; box-shadow: inset 1px 0 3px rgba(15, 23, 42, 0.025); padding: 1.4rem to 1.6rem;` (NEVER plain white `#ffffff`—the stage MUST contrast against the component card).
- **Stage Canvas (`.rce-canvas`):** `width: 100%; max-width: 440px; margin: 0 auto;`

#### 4. Component Boundary Node (`.rce-node`) & Semantic Kinds
- **Node Container (`.rce-node`):** `position: relative; padding: 1.85rem 1rem 0.95rem; border: 2px dashed #94a3b8; border-radius: 9px; background: #ffffff; box-shadow: 0 4px 8px -4px rgba(15, 23, 42, 0.12);`
- **Node Label Pill (`.rce-node-label`):** `position: absolute; top: -2px; left: -2px; padding: 0.32rem 0.70rem; border-top-left-radius: 7px; border-bottom-right-radius: 6px; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 0.82rem; font-weight: 700; line-height: 1; color: #ffffff;`
- **Props Chip (`.rce-node-props`):** `margin-left: 0.45rem; color: rgba(255, 255, 255, 0.9); font-weight: 400; font-style: italic;`
- **Semantic Kind Presets:**
  - `kind-shell`: `border-color: #475569; background: #f8fafc;` label `background: #475569;`
  - `kind-counter` / `kind-button`: `border-color: #087ea4; background: #f0f9ff;` label `background: #087ea4;` (React Cyan)
  - `kind-card`: `border-color: #2563eb; background: #eff6ff;` label `background: #2563eb;` (Royal Blue)
  - `kind-badge`: `border-color: #d97706; background: #fffbeb;` label `background: #d97706;` (Amber)
  - `kind-wrong`: `border-color: #dc2626; background: #fef2f2;` label `background: #dc2626;` (Crimson)
  - `kind-store`: `border-color: #7c3aed; background: #faf5ff;` label `background: #7c3aed;` (Purple)
  - `kind-form`: `border-color: #0891b2; background: #ecfeff;` label `background: #0891b2;` (Teal)

#### 5. Interior Component Typography & Controls Scale
- **Headline / Title (`.article-title`, `.desk-headline`):** `font-size: 0.86rem–0.92rem; font-weight: 700; color: #0f172a; line-height: 1.25;`
- **Dateline / Subtext (`.article-meta`, `.desk-dateline`):** `font-size: 0.70rem–0.74rem; font-weight: 500; color: #64748b;`
- **Pills & Badges (`.live-pill`, `.article-badge`):** `font-size: 0.65rem–0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 2px 7px; border-radius: 4px;`
- **Metric Numbers (`.counter-value`, `.metric-value`):** `font-size: 1.8rem–2.4rem; font-weight: 800; color: #087ea4; line-height: 1; font-feature-settings: "tnum";`
- **Buttons (`.counter-btn`, `.action-btn`):** `font-size: 0.82rem–0.84rem; font-weight: 600; padding: 0.45rem 0.95rem; border-radius: 6px; border: 1.5px solid #cbd5e1;`

#### 6. STRICT PRINT RULE: Banned Raw Heading Tags (`<h2>`, `<h3>`) in Figures
- ❌ **STRICTLY BANNED:** Never use raw `<h2>` (or `<h3>`) tags inside an HTML figure component. In `lecture.css`, the print stylesheet enforces `main h2 { page-break-before: always; break-before: page; }`. Placing a native `<h2>` inside a figure triggers an unconditional page break in Prince, severing the figure window in half.
- ✅ **MANDATORY:** Always use styled semantic `<div>` or `<span>` elements with class names (e.g., `<div class="desk-headline">`, `<span class="card-title">`).

---

## 4. The React Component Explorer (RCE) Architecture

Adapted from modern component explorers and reimagined for standalone Prince-ready HTML figures, the **React Component Explorer (RCE)** is the primary architectural window for the series:

1. **The Two-Column Split Window:**
   - **Left Sidebar (28–30% width):** The project file tree showing `src/components/`, `src/hooks/`, and `src/context/`. The file being actively taught is highlighted with an `.active` pill, accompanied by crisp `.jsx` (React cyan) or `.tsx` (TypeScript blue) vector badges.
   - **Right Live Stage (70% width):** A soft blueprint canvas (`#f1f5f9`) displaying the active component's memory and DOM boundary.
2. **Component Boundary & Name Tagging:** Every component on stage MUST declare its identity via an anchored top-left tag (e.g., `<Masthead.jsx>`, `<CounterButton.jsx>`) with a cyan status dot and optional prop chips (e.g. `readerName="Morgan"`). Nested child components nest cleanly inside the parent box with their own distinct child tags.
3. **The "Rule of 3" (The Minimal Repetition Ceiling):** NEVER display 10 rows of articles or massive lists. In this curriculum, **repetition must be demonstrated with strictly at most 3 items**. Three items are mathematically sufficient to prove a loop, key tracking, and layout flow without inducing cognitive fatigue or visual clutter.
4. **Interactive Control Fidelity:** Buttons, inputs, counters, and badges inside the component body must look like authentic, minimal modern UI controls (crisp 1.5px borders, subtle button drop shadows, bold numbers, high contrast).
5. **Standalone HTML Figure Packaging:** All figures live in `md-lectures/figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html` with locally scoped styles, embedded directly via ````html-figure src="..." caption="..."````.

---

## 5. The Proven Templates Catalog (`figures/templates/`)

All archetypes are implemented as reusable, standalone HTML templates in `md-lectures/figures/templates/`:

| Template | File | Core Scenario & Role | Key Elements |
| :--- | :--- | :--- | :--- |
| **01** | `01-single-control.html` | **Single Stepper & Canonical Starter Template (Vite + React)** | Left: File tree (`App.tsx` or `CounterButton.jsx`). Right: Canonical starter counter widget (`count is 0`, `Vite + React`, `Edit src/App.tsx and save to test HMR`). **Mandatory archetype for project scaffolding CLI steps**: never mutate into unwritten domain features. |
| **02** | `02-list-repeat-3-items.html` | **Collection Rendering & The Rule of 3** | Left: File tree (`ArticleList.jsx`). Right: `<ArticleList.jsx>` rendering **strictly 3 minimal flat news cards** with bold headlines, excerpts, author bylines, and category tags. |
| **03** | `03-parent-child-props.html` | **Component Hierarchy & User Profile** | Left: File tree (`UserProfile.jsx`). Right: Profile masthead (avatar initials, name, title) hosting nested `<StatusBadge.jsx>` (`● Active Contributor`) and `<ActionButton.jsx>` (`Following`, `Message`). |
| **04** | `04-compare-wrong-right.html` | **Symmetrical State Audit (Canonical Comparison)** | Top: Trigger card (`switchUser('Elena Vance')`). Center: Floating `VS` medallion. Dual columns with 1:1 row parity. Soft lavender `#f5effd` stage, white cards with purple checkmarks, and warm peach `#fff1e5` error highlight. |
| **05** | `05-controlled-input.html` | **Controlled Input & Search Filter** | Left: File tree (`SearchFilter.jsx`). Right: Real search input with SVG magnifying glass, active query text (`climate`), `✕` clear pill, and live results bar (`14 stories found`). |
| **06** | `06-context-state-dispatch.html` | **Context & Reducer Dispatch** | Left: File tree (`CartDrawer.jsx`, `CartContext.jsx`). Right: Context wiring into `<CartDrawer.jsx>` showing line items, order total, and `Checkout` button. |
| **07** | `07-progressive-decomposition.html` | **Two-Panel Progressive Decomposition** | **Panel 1 (Top):** `CartDrawer.jsx` active in sidebar, rendered HTML view.<br>**Panel 2 (Bottom):** Active sidebar switches to `CartItemRow.jsx`, dissecting the container into `<CartItemRow.jsx>` (with internal stepper `[−] 1 [+]`, unit price, and remove action) and `<CartSummary.jsx>`. |
| **08** | `08-progressive-assembly-pipeline.html` | **Progressive Code Assembly Pipeline** | Container: ice-slate panel (`#f4f6f9`) with dark slate header bar (`#344154`, custom-made uppercase topic title, e.g., `EXAMPLE OF FORM HANDLING`, `EXAMPLE OF MANAGING ACTION STATE`). Body: sequential cards (`#fcfcfb`) with 10px teal left accent (`#0e7490`) and centered vertical SVG connectors with bold directional arrowheads (zero bullet dots). Each card defines Step N, title, code token, and centered italic role statement with bold action verbs. Mandatory visual roadmap for multi-step progressive architecture. |
| **09** | `09-progressive-assembly-step-cards.html` | **Progressive Assembly Step Cards** | Container: ice-slate panel (`#f4f6f9`) with dark slate header bar (`#344154`). Body: floating step cards with top badges, step indicators, code tokens, and bold action verbs. Alternative visual roadmap for multi-step progressive architecture. |
| **10** | `10-architecture-audit-vtable.html` | **Architecture Audit Table (Mandatory Concluding Step of Practical Code Examples)** | Clean editorial substrate sitting directly on the page without outer card borders or drop shadows, bounded by heavy 3px black top and bottom rules. Eyebrow strictly `LESSONS FROM THE CODE` in uppercase tracking-widest typography. Three-column comparative matrix: Component Layer | Naive Expectation (Manual Prop Drilling / Legacy Approach) | What Happened (React 19 Reality). Layer breakdown from parent container through intermediaries down to the terminal UI control (anti-leaf law enforced). Final verdict row: `FRAGILE COUPLING` (red) vs `BULLETPROOF MODULARITY` (teal). Calibrated font sizes (`0.86rem` body, `0.92rem` titles) for maximum readability on a single-page PDF budget. |

### Scaffolding Command & Chronological Integrity Rules
When a lecture introduces project creation or scaffolding (e.g. `npm create vite`, `npx create-next-app`):
1. **Template 01 is the mandatory archetype:** It MUST render the pristine default starter template (`src/App.tsx`) with the authentic out-of-the-box UI (`Vite + React`, `count is 0`, `Edit src/App.tsx and save to test HMR`).
2. **Zero Future Feature Leaks:** Custom domain components (e.g. `LiveDesk.tsx`, `CartDrawer.tsx`, `ArticleFeed.tsx`) are strictly forbidden in scaffolding figures. They can only debut in subsequent sections after the narrative reaches the point where the developer actually creates and authors the file.
3. When authoring a new lecture, select the closest template from `figures/templates/`, clone it into `figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html`, and strictly obey the Narrative Chronology Law.
