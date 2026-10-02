---
name: figures
description: Governs creating the standalone HTML figures embedded in lectures via the html-figure block; use when a lecture figure is about to be designed, cloned, or revised.
---

# Figures

This skill governs the standalone HTML figures embedded in React lectures: the visual philosophy, the visual standards of the figure quality bar, the color and surface constitution, the React Component Explorer (RCE) architecture, the proven templates catalog, the authoring mechanics of one self-contained .html file per figure, and the chronological integrity rules that keep a figure honest to the narrative. Every figure is cloned from a proven archetype, never invented from scratch, so the series keeps visual unity across lectures.

Digests: skills/old-instructions/docs/figure-design-system.md, docs/professional_illustrator.md, and instructions.md (HTML figures)

## Philosophy | 01 | Opening Visual Anchor

[ ] The opening code snippet of a lecture (Section 1) is the strict case: pair it with clear conceptual framing and minimal code contrast, so the opening concept grounds the student immediately in physical reality.

[ ] The opening section is where the student either engages or tunes out, so the first thing their eye catches is a tangible screen widget rather than dry, abstract syntax.

[ ] Grounding the problem in physical reality right away is the whole point of the anchor; a lecture that delays its first figure past Section 1 loses the reader before the mechanism is taught.

## Philosophy | 02 | Visual-First by Default

[ ] Treat visual-first as an active instinct rather than an absolute tax: wherever code triggers a visible state shift, a layout division, a reconciliation fork, or a boundary contrast, prefer showing a clean panel over relying solely on abstract text.

[ ] Allow deep derivations to breathe naturally: when diving into TypeScript definitions, minor edge-case helpers, or micro-refactors, the code is free to live in prose without forcing an artificial diagram.

[ ] Aim for zero diagram inflation: avoid inventing fake, decorative diagrams for purely analytical formulas or type signatures, so visuals exist to unlock genuine insight rather than decorate every code block.

## Philosophy | 03 | Map the Topology

[ ] React applications are structural trees, not flat scripts, so before explaining a bug establish the physical relationship between the pieces.

[ ] Draw the component hierarchy: place the top-level shell at the top and branch down to its children, so the student immediately understands the chain of command.

## Philosophy | 04 | Physicalize the Invisible

[ ] The most confusing React bugs occur when components interact with things outside their immediate boundaries, and beginners cannot see module scope, ambient state, or unbound export dictionaries in a local code snippet, so give invisible concepts physical form.

[ ] Draw the external variable as a distinct floating box located physically outside the component tree, so a shared variable trap becomes visible.

[ ] Let the visual arrows reach up and out of the child nodes into that floating box, so the student instantly sees the component violating its boundaries and modifying a variable declared outside its scope.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```text
> +----------------------------------+
> | AlertBadge.jsx                   |
> |                                  |
> | function AlertBadge() {          |
> |   count = count + 1;             |
> | }                                |
> +----------------------------------+
> ```

Notes: this figure only shows the component's local code, so the culprit (the external `let count = 3` it mutates) lives outside the visible frame and the trap stays invisible.

## Philosophy | 05 | Draw the Flow of Data

[ ] Visualize where data moves rather than what the data is, because a pure function minds its own business and a side effect does not, and directional arrows as vectors of mutation make that difference visible.

[ ] In the pure model, data flows exclusively downward: explicit calculations pass strictly as props from parent to child, so draw crisp downward arrows.

[ ] In the impure model, let the arrows cross wires, reaching sideways and upwards, so the unintended side effect that modifies the outside world during execution is visually demonstrated.

## Visual Standards | 06 | The real-diagram requirement

[ ] A figure inside `.print-fig` is an illustration of spatial, temporal, mechanical, or physical reality, so every figure card carries an authentic graphical substrate: a component hierarchy tree with props flow, a Fiber work loop traversal, a state dispatch track, an immutable object copy matrix, or a live rendered UI component.

[ ] Avoid wrapping plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without any graphical diagram, because that is a table, not a figure.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```html
> <div class="print-fig">
>   <ul>
>     <li>useState returns a state value and a setter function.</li>
>     <li>Re-renders are triggered by calling the setter.</li>
>     <li>Props flow from parent to child.</li>
>   </ul>
> </div>
> ```

Notes: this is a bullet list wearing a border; there is no graphical substrate, so it reads as a table pretending to be a figure and fails the figure quality bar.

## Visual Standards | 07 | Strong Demarcation & Modern Surface Geometry

[ ] Give every figure container the `.print-fig` treatment: `border: 2px solid #0f172a`, `border-radius: 8px`, `background: #ffffff`, and subtle elevation via `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06)`.

[ ] Prefer crisp borders, pure white card interiors, and clear visual contrast, so the figure reads as a modern editorial surface.

[ ] Avoid pale 1px borders and faded, muddy pastel backgrounds, because weak demarcation makes diagram regions bleed into each other on the printed page.

## Visual Standards | 08 | Monochrome SVG icons

[ ] Use clean inline SVG icons or crisp unicode text glyphs for chrome and status markers, for example `✓ REACTIVE`, `✕ BROKEN`, an inline SVG lock, or SVG arrows, so figures stay print-friendly and vector-crisp.

[ ] Avoid platform yellow emojis such as 🔒, ✓-as-emoji, ✕-as-emoji, and 📱 inside figures, because emoji rendering varies per platform and breaks the monochrome vector look.

## Visual Standards | 09 | Exact Mathematical Centering

[ ] Give timeline guides, tree tracks, and node markers identical mathematical centers, so connector lines pass cleanly through the center of every node instead of grazing edges.

## Visual Standards | 10 | Symmetrical Comparison & Page-Break Isolation

[ ] Build compare figures with matching header pills, symmetrical title bars, matching interior diagram heights, and identical 2-line footers (`min-height: 52px;`), so the two models are auditable side by side.

[ ] Keep total figure height within the printable letter-size budget of roughly 380px to 420px, so the figure and its figcaption remain unified on a single page with zero page-break splits.

## Visual Standards | 11 | Anti-Meta-Descriptor (Pure Archetypical UI)

[ ] Avoid meta-descriptions, diagnostic labels, and key-value captions inside component bodies, such as `Current count in memory: 5`, `Binding trigger: + Increment`, `DOM rendered value:`, `Engine status:`, or `Input field:`, because they turn rendered UI into a debug dump.

[ ] Make all rendered UI purely archetypical and visually self-evident, so the student immediately infers what the component is from its authentic, elegant flat design.

[ ] The canonical archetypical UIs: a Counter is a prominent bold number (`5`) with stepper buttons (`− Decrease` and `+ Increase`); an Article Feed is clean flat article cards with a bold headline, 2-line excerpt, journalist byline (`Marcus Vance · 4 min read`), and a category badge (`Metro`); a User Profile is an avatar initials circle (`MV`), journalist name, editorial title, status pill (`● Active Contributor`), and action buttons (`Following`, `Message`); a Search Box is an authentic input pill with magnifying glass SVG, active query text, `✕` clear button, and result count (`14 stories found for "climate"`); a Cart or Store is order line items with currency amounts, order total, and a `Checkout` button.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```html
> <div class="counter-body">
>   <div>DOM rendered value: 5</div>
>   <div>Binding trigger: + Increment</div>
>   <div>Engine status: re-render scheduled</div>
> </div>
> ```

Notes: these are diagnostic meta-descriptors, not UI; the student should see a real stepper widget, and the lecture prose carries the diagnostics.

## Visual Standards | 12 | Progressive Component Decomposition

[ ] When a lecture teaches a system composed of multiple interacting components, visualize in meaningful steps rather than cramming 5 to 6 components with all their internal buttons, steppers, and props into a single crowded, unreadable diagram.

[ ] Use the two-panel progression on the same page: Panel 1 (high-level macro view) presents the higher-level container highlighted in the sidebar showing its clean, intact rendered HTML view, without exposing internal component boundaries prematurely.

[ ] Panel 2 (dissected micro view) sits directly below Panel 1 and dissects that exact component into its constituent child components, for example `CartItemRow.jsx` with internal steppers `[−] 1 [+]`, unit prices, and remove buttons, plus `CartSummary.jsx`.

[ ] Synchronize sidebar state: in Panel 2 the left file tree dynamically shifts its active highlight to the child component being dissected (`.active` pill on `CartItemRow.jsx`), so the IDE file selection visually links to the deconstructed component architecture.

## Visual Standards | 13 | The side-by-side state comparison

[ ] When contrasting two mental models, execution paradigms, or state synchronization routines (for example Imperative DOM vs Declarative React), adapt the canonical comparison benchmark at `various/html/manual_vs_declarative_react.tsx`.

[ ] Put the trigger anchor first: the causal user action or mutation function call (for example `switchUser('Elena Vance')` or `dispatch({ type: 'ADD' })`) sits in a prominent top white card, so the reader sees the cause before the effects.

[ ] Build dual columns with a central VS medallion: the flawed model on the left (`Manual DOM`), the sound model on the right (`Declarative React`), separated by a central floating `#9333ea` circular VS badge.

[ ] Enforce 1:1 row alignment: both columns audit the exact same elements in identical order, so the comparison is a true state audit rather than two unrelated stories.

[ ] Use calm editorial defect highlighting: mark broken or stale rows with an elegant peach warning card rather than aggressive neon red, so defects stand out immediately without visual harshness.

[ ] Frame the entire comparison stage in a soft iris/lavender wash, so the audit reads as one serene stage.

[ ] Avoid dense spaghetti wiring, crisscrossing connector lines, and confusing abstract compiler AST graphs, because they hide the very difference the audit exists to show.

## Visual Standards | 14 | Juxtaposition

[ ] Present the pattern and the anti-pattern directly next to each other, because students learn what is right much faster when they see it placed directly beside what is wrong.

[ ] Show the anti-pattern (erratic, broken syntax, illegal state) directly next to the pattern (predictable, correct syntax, verified execution), so the eye spots the architectural difference before the brain even parses the code.

[ ] Avoid showing the solution in isolation, because without its broken twin the reader has no visual anchor for why the correct shape matters.

## Visual Standards | 15 | Differential Highlighting

[ ] Use an authentic, semi-translucent yellow highlighter marker stroke (`#FDE047` / `#FEF08A`) with strict surgical restraint, because in side-by-side comparisons readers waste cognitive energy playing spot the difference and the graphic should guide the eye straight to the root-cause delta.

[ ] Highlight the exact syntax token that causes the divergence (for example `{ SiteHeader }` vs `SiteHeader`) and the immediate evaluated runtime value (for example `undefined` vs `Component`).

[ ] Keep Tier 1 source cards completely clean, so the identical, unhighlighted source instantly communicates that both paths originate from the same code.

[ ] Keep Tier 3 browser screens clean, because the screen outcomes already speak through native visual states: a crisp red error banner on a blank canvas versus a live rendered masthead.

## Visual Standards | 16 | Three-Tier Chronological Flow

[ ] Standardize comparison diagrams into three clear, labeled tiers flowing chronologically from declaration to user impact: Tier 1 (top) Source File holds the declaration site (for example `SiteHeader.jsx` with `export default function SiteHeader()`), Tier 2 (middle) Consumer File holds the execution or consumption site (for example `App.jsx` showing the import line and evaluated variable), Tier 3 (bottom) Browser Screen holds the user-facing result (a clean vector browser frame showing either a crash error or rendered UI).

[ ] Avoid arrows that loop backwards, criss-cross diagonally, or point upwards against natural reading order, so the diagram reads top to bottom the way the story unfolds.

## Palette | 17 | The lavender-and-peach comparison palette

[ ] Use the lavender-and-peach comparison palette for every symmetrical comparison stage, so all audits in the series share one visual language: stage background `#f5effd` (soft lavender wash), stage border `1px solid #e9d5ff`, brand/accent title `#7e22ce` / `#9333ea`.

[ ] Differentiate the two models by surface: the flawed stage container uses `#f0eaf7` with a `#e9e1f5` header bar and `#581c87` text, while the sound stage container uses `#ffffff` with a subtle shadow and a `#7e22ce` header bar.

[ ] Mark outcomes with two card kinds: a passing card is `#ffffff` with a `#f3e8ff` border and an `#a855f7` checkmark, and a defect card is `#fff1e5` background, `#f6c39a` border, `#c05b18` text and cross icon (`✕`).

[ ] Give the VS medallion a `#9333ea` circle with bold white text at `40px × 40px`.

## Palette | 18 | Semantic Color Coding

[ ] Treat color as a diagnostic tool that carries distinct educational meaning, never as pure decoration.

[ ] Use neutral charcoal / dark slate (`#0F172A`) for structural container outlines, grid lines, and primary text.

[ ] Use deep ocean cyan / teal (`#0E7490`) exclusively for verified safe pathways, pure functions, matching import/export channels, and successfully rendered UI.

[ ] Use warning coral / crimson red (`#DC2626`) exclusively for bugs, mutations, broken queries, `undefined` tokens, and browser crash states.

[ ] Use fluorescent study yellow (`#FDE047` / `#FEF08A`) strictly for differential highlighting, so the yellow marker always means the same thing: look here, this is the delta.

## Palette | 19 | RCE Structural Metrics

[ ] Give every React Component Explorer figure the canonical container metrics cloned from the templates in `md-lectures/figures/templates/`: container `max-width: 680px; margin: 1.5rem auto; border: 1px solid #cbd5e1; border-radius: 10px; background: #ffffff; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07), 0 1px 2px rgba(15, 23, 42, 0.04); overflow: hidden;`.

[ ] Build the window chrome bar (`.rce-bar`) as `padding: 10px 14px; background: linear-gradient(to bottom, #ffffff, #edf1f5); border-bottom: 1px solid #cbd5e1;`, with traffic light dots (`.rce-dots i`) at `width: 11px; height: 11px; border-radius: 50%;` in red (`#ef4444` body, `#dc2626` border), yellow (`#f59e0b` body, `#d97706` border), and green (`#10b981` body, `#059669` border).

[ ] Style the window title (`.rce-title`) as `font-size: 0.82rem; font-weight: 700; color: #475569; letter-spacing: 0.02em; text-align: center;`.

[ ] Build the left sidebar (`.rce-sidebar`) as `flex: 0 0 30%; padding: 1.1rem 0.95rem; background: #fdfdfd; border-right: 1px solid #cbd5e1;`, with the sidebar title (`.rce-sidebar-title`) at `font-size: 0.68rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.09em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.65rem;`.

[ ] Style file tree labels (`.rce-tree-label`) as `font-size: 0.80rem; font-weight: 500; color: #0f172a; border-radius: 5px; padding: 0.28rem 0.38rem; gap: 0.45rem;`, and the active selection (`.rce-tree-label.active`) as `background: #e0f2fe; color: #0369a1; font-weight: 700;`.

[ ] Use monochromatic vector SVG file tree icons (`.rce-icon` at `width: 1.05rem; height: 1.05rem;`) with folder stroke `#f59e0b`, React JSX stroke `#087ea4`, and TypeScript TSX stroke `#3178c6`, and prefer these canonical icons over colored acronym badge pills (`.badge-html`, `.badge-ts`), so the tree matches the templates exactly.

[ ] Give the stage (`.rce-stage`) the crisp blueprint slate `background: #f1f5f9; box-shadow: inset 1px 0 3px rgba(15, 23, 42, 0.025); padding: 1.4rem to 1.6rem;` and the canvas (`.rce-canvas`) `width: 100%; max-width: 440px; margin: 0 auto;`, and avoid a plain white `#ffffff` stage, because the stage needs to contrast against the white component card sitting on it.

## Palette | 20 | RCE Node & Typography Metrics

[ ] Build each component boundary node (`.rce-node`) as `position: relative; padding: 1.85rem 1rem 0.95rem; border: 2px dashed #94a3b8; border-radius: 9px; background: #ffffff; box-shadow: 0 4px 8px -4px rgba(15, 23, 42, 0.12);`, with the node label pill (`.rce-node-label`) anchored at `position: absolute; top: -2px; left: -2px; padding: 0.32rem 0.70rem; border-top-left-radius: 7px; border-bottom-right-radius: 6px; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 0.82rem; font-weight: 700; line-height: 1; color: #ffffff;`.

[ ] Style the props chip (`.rce-node-props`) as `margin-left: 0.45rem; color: rgba(255, 255, 255, 0.9); font-weight: 400; font-style: italic;`, so props read as a quiet annotation inside the label pill.

[ ] Use the semantic kind presets for node identity: `kind-shell` uses `border-color: #475569; background: #f8fafc;` with label `background: #475569;`; `kind-counter` / `kind-button` use `border-color: #087ea4; background: #f0f9ff;` with label `background: #087ea4;` (React Cyan); `kind-card` uses `border-color: #2563eb; background: #eff6ff;` with label `background: #2563eb;` (Royal Blue); `kind-badge` uses `border-color: #d97706; background: #fffbeb;` with label `background: #d97706;` (Amber); `kind-wrong` uses `border-color: #dc2626; background: #fef2f2;` with label `background: #dc2626;` (Crimson); `kind-store` uses `border-color: #7c3aed; background: #faf5ff;` with label `background: #7c3aed;` (Purple); `kind-form` uses `border-color: #0891b2; background: #ecfeff;` with label `background: #0891b2;` (Teal).

[ ] Keep the interior typography on the canonical scale: headlines and titles (`.article-title`, `.desk-headline`) at `font-size: 0.86rem` to `0.92rem`, `font-weight: 700`, `color: #0f172a`, `line-height: 1.25`; datelines and subtext (`.article-meta`, `.desk-dateline`) at `font-size: 0.70rem` to `0.74rem`, `font-weight: 500`, `color: #64748b`.

[ ] Style pills and badges (`.live-pill`, `.article-badge`) at `font-size: 0.65rem` to `0.68rem`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.04em`, `padding: 2px 7px`, `border-radius: 4px`, and metric numbers (`.counter-value`, `.metric-value`) at `font-size: 1.8rem` to `2.4rem`, `font-weight: 800`, `color: #087ea4`, `line-height: 1`, `font-feature-settings: "tnum"`.

[ ] Build buttons (`.counter-btn`, `.action-btn`) at `font-size: 0.82rem` to `0.84rem`, `font-weight: 600`, `padding: 0.45rem 0.95rem`, `border-radius: 6px`, `border: 1.5px solid #cbd5e1;`, so controls look like authentic, minimal, modern UI.

## Architecture | 21 | The Two-Column Split Window

[ ] Build the React Component Explorer as a two-column split window: the left sidebar (28 to 30 percent width) shows the project file tree with `src/components/`, `src/hooks/`, and `src/context/`, and the right live stage (70 percent width) is a soft blueprint canvas (`#f1f5f9`) displaying the active component's memory and DOM boundary.

[ ] Highlight the file being actively taught with an `.active` pill, accompanied by crisp `.jsx` (React cyan) or `.tsx` (TypeScript blue) vector badges, so the reader always knows which file the stage is exposing.

## Architecture | 22 | Component Boundary & Name Tagging

[ ] Have every component on stage declare its identity via an anchored top-left tag (for example `<Masthead.jsx>`, `<CounterButton.jsx>`) with a cyan status dot and optional prop chips (for example `readerName="Morgan"`).

[ ] Nest child components cleanly inside the parent box with their own distinct child tags, so the visual nesting mirrors the component tree.

## Architecture | 23 | The Rule of 3

[ ] Demonstrate repetition with at most 3 items, because three items are mathematically sufficient to prove a loop, key tracking, and layout flow without inducing cognitive fatigue or visual clutter.

[ ] Avoid displaying 10 rows of articles or massive lists, because long lists prove nothing three items cannot and they waste the printable height budget.

## Architecture | 24 | Interactive Control Fidelity

[ ] Make buttons, inputs, counters, and badges inside the component body look like authentic, minimal, modern UI controls: crisp 1.5px borders, subtle button drop shadows, bold numbers, high contrast, so the stage reads as a live app rather than a wireframe sketch.

## Templates | 25 | Clone, Don't Invent

[ ] Treat the proven archetypes in `md-lectures/figures/templates/` as the origin of every figure: select the closest template, clone it into `md-lectures/figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html`, and adapt it, so the series keeps absolute visual harmony and no author invents designs from scratch.

[ ] When authoring a new lecture, choose the template by scenario first and aesthetics second, because each archetype exists to explain a specific kind of mechanism.

## Templates | 26 | The Ten Proven Templates

[ ] Use template 01 (`01-single-control.html`) for a single stepper and the canonical starter (Vite + React): left file tree (`App.tsx` or `CounterButton.jsx`), right the canonical starter counter widget (`count is 0`, `Vite + React`, `Edit src/App.tsx and save to test HMR`); it is the mandatory archetype for project scaffolding CLI steps.

[ ] Use template 02 (`02-list-repeat-3-items.html`) for collection rendering and the Rule of 3: an `ArticleList.jsx` tree and strictly 3 minimal flat news cards with bold headlines, excerpts, author bylines, and category tags.

[ ] Use template 03 (`03-parent-child-props.html`) for component hierarchy via the User Profile: profile masthead (avatar initials, name, title) hosting nested `<StatusBadge.jsx>` (`● Active Contributor`) and `<ActionButton.jsx>` (`Following`, `Message`).

[ ] Use template 04 (`04-compare-wrong-right.html`) for the side-by-side state comparison: top trigger card (for example `switchUser('Elena Vance')`), central floating VS medallion, dual columns with 1:1 row parity, soft lavender `#f5effd` stage, white cards with purple checkmarks, and warm peach `#fff1e5` error highlight.

[ ] Use template 05 (`05-controlled-input.html`) for controlled input and search filter: a real search input with SVG magnifying glass, active query text (`climate`), `✕` clear pill, and live results bar (`14 stories found`).

[ ] Use template 06 (`06-context-state-dispatch.html`) for context and reducer dispatch: a file tree with `CartDrawer.jsx` and `CartContext.jsx`, and context wiring into `<CartDrawer.jsx>` showing line items, order total, and `Checkout` button.

[ ] Use template 07 (`07-progressive-decomposition.html`) for the two-panel progressive decomposition: Panel 1 with `CartDrawer.jsx` active in the sidebar and its rendered HTML view, Panel 2 with the sidebar switching to `CartItemRow.jsx` and the container dissected into `<CartItemRow.jsx>` (internal stepper `[−] 1 [+]`, unit price, remove action) and `<CartSummary.jsx>`.

[ ] Use template 08 (`08-progressive-assembly-pipeline.html`) for the progressive code assembly pipeline: an ice-slate panel (`#f4f6f9`) with dark slate header bar (`#344154`, custom-made uppercase topic title such as `EXAMPLE OF FORM HANDLING`), sequential cards (`#fcfcfb`) with 10px teal left accent (`#0e7490`) and centered vertical SVG connectors with bold directional arrowheads (zero bullet dots), each card defining Step N, title, code token, and a centered italic role statement with bold action verbs.

[ ] Use template 09 (`09-progressive-assembly-step-cards.html`) as the mandatory visual roadmap for multi-step progressive code assembly: 4 horizontal step cards (`.step-card`) featuring muted left edge bars, prominent step badges with uppercase `STEP` and bold numbers `1` to `4`, and a unified soft pastel background across the entire card body (`.card-main`), strictly matching the collaborative sequence (`First, we...`, `Next, we...`, `Then, we...`, `Finally, we...`).

[ ] Use template 10 (`10-architecture-audit-vtable.html`) as the mandatory concluding step of practical code examples: a clean editorial substrate sitting directly on the page without outer card borders, rounded corners, or drop shadows, bounded by heavy 3px black top and bottom rules (`border-top: 3px solid #0f172a; border-bottom: 3px solid #0f172a`), with the eyebrow `LESSONS FROM THE CODE` in uppercase tracking-widest typography, three comparative columns calibrated for single-page print budgets (`Component Layer` at 22%, `Naive Expectation` at 39%, `What Happened` at 39%), a layer breakdown from parent container through intermediaries down to the terminal UI control (anti-leaf law), a final verdict row contrasting `FRAGILE COUPLING` (red) with `BULLETPROOF MODULARITY` (teal), calibrated font sizes (`0.86rem` body, `0.92rem` titles), and nested table margin neutralization (`margin: 8px 0 0 0 !important; margin-left: 0 !important; width: 100% !important; table-layout: fixed !important; border: none !important;`) to permanently eliminate PDF page clipping. #2026_09_21_28_group_1

## Templates | 26B | Archetype 09 (Progressive Assembly Step Cards) Canonical Color & Surface Law

[ ] When authoring or cloning Archetype 09 (`figures/{NN}-01-code-assembly-pipeline.html`), authors MUST clone `templates/09-progressive-assembly-step-cards.html` 1:1 and NEVER invent, inline, or alter the color system. `#2026_09_20_08_group_1`
[ ] Ban 4-Column Vertical Grids: Strictly forbid 4-column side-by-side grid layouts (`.pipeline-grid`, `grid-template-columns: repeat(4, 1fr)`). The assembly pipeline figure MUST be a vertical stack of full-width horizontal step cards (`.assembly-steps-figure`). Never squish steps into narrow vertical boxes with dark top headers and bottom tags. `#2026_09_22_06_group_1`

[ ] Enforce the canonical 4-tone pastel color palette via CSS classes on `.step-card`: `#2026_09_20_08_group_1`
- **Step 1 (Blue)**: `.step-1 .card-edge { background: #7495be; }`, `.step-1 .card-main { background: #d4e1f1; }`, `.step-1 .card-divider { background: #b0c4dd; }`
- **Step 2 (Teal)**: `.step-2 .card-edge { background: #66a49b; }`, `.step-2 .card-main { background: #d0e6e1; }`, `.step-2 .card-divider { background: #aed1cb; }`
- **Step 3 (Warm Amber)**: `.step-3 .card-edge { background: #e09f67; }`, `.step-3 .card-main { background: #f9e0c5; }`, `.step-3 .card-divider { background: #eac4a1; }`
- **Step 4 (Soft Green)**: `.step-4 .card-edge { background: #74ad68; }`, `.step-4 .card-main { background: #d2ebc9; }`, `.step-4 .card-divider { background: #b2d5a5; }`

[ ] Class-Name Integrity Law: The step cards MUST be classed as `.step-1`, `.step-2`, `.step-3`, `.step-4`. Mutated class names such as `.card-1`, `.card-2`, or `.pipeline-step-1` are strictly forbidden. `#2026_09_20_11_group_1`

[ ] Enforce Surface Continuity & Anti-Bleaching Law: The pastel background belongs exclusively on `.card-main` so that both `.step-badge` and `.card-content` sit on the exact same tinted surface. NEVER set `background: #f8fafc` or `background: #ffffff` on `.step-card`, `.card-main`, or `.card-content`: bleaching the card into stark white or grey-slate is strictly prohibited. `#2026_09_20_08_group_1`, `#2026_09_20_11_group_1`

[ ] Strict Ban on Inline Styles: NEVER use inline `style="background: ..."` on `.card-edge`, `.step-badge`, `.card-divider-wrap`, or `.card-content`. All styling must flow through the scoped `.step-1`, `.step-2`, `.step-3`, `.step-4` CSS classes. `#2026_09_20_08_group_1`

[ ] Mechanical Compiler Validation: Every assembly pipeline figure is validated at build time by `src/build-lectures.mjs`. The build script checks the HTML file directly on disk, verifying the 4 canonical pastels, banning `#f8fafc` / `#ffffff` card backgrounds, and enforcing `.step-1..4` class names. A defect in any of these checks triggers a build warning. `#2026_09_20_11_group_1`

[ ] PROPER EXAMPLE: make sure you follow this example, the canonical Archetype 09 card markup with scoped classes and unified pastel surfaces: `#2026_09_20_08_group_1`

> ```html
> <!-- Step 1 -->
> <div class="step-card step-1">
>   <div class="card-edge"></div>
>   <div class="card-main">
>     <div class="step-badge">
>       <span class="step-text">Step</span>
>       <span class="step-num">1</span>
>     </div>
>     <div class="card-divider-wrap">
>       <div class="card-divider"></div>
>     </div>
>     <div class="card-content">
>       <div class="card-title">First, we construct the parent container EditorialDesk.jsx</div>
>       <div class="card-components">
>         <span class="component-tag">&lt;EditorialDesk /&gt;</span>
>       </div>
>     </div>
>   </div>
> </div>
> ```

[ ] FLAWED EXAMPLE: never do this, using inline styles, harsh saturated primaries, and bleaching the content box with stark white or #f8fafc: `#2026_09_20_08_group_1`

> ```html
> <!-- DO NOT DO THIS: inline styles and bleached white content box -->
> <div class="step-card">
>   <div class="card-edge" style="background: #2563eb;"></div>
>   <div class="card-main">
>     <div class="step-badge" style="background: #eff6ff;">
>       <span class="step-text">STEP</span>
>       <span class="step-num">1</span>
>     </div>
>     <div class="card-divider-wrap" style="background: #eff6ff;">
>       <div class="card-divider" style="background: #93c5fd;"></div>
>     </div>
>     <div class="card-content" style="background: #f8fafc;">
>       <div class="card-title">First, we construct the parent container EditorialDesk.jsx</div>
>       <div class="card-components">
>         <span class="component-tag">&lt;EditorialDesk /&gt;</span>
>       </div>
>     </div>
>   </div>
> </div>
> ```

## Authoring | 27 | One Figure, One File

[ ] Author each figure as one self-contained `.html` file at `md-lectures/figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html`, so the build can inline it verbatim and the figure stays independently openable and diffable.

[ ] PROPER EXAMPLE: make sure you follow this example, the figure file naming for lecture 7, first figure, masthead scenario:

> ```text
> md-lectures/figures/07-01-masthead.html
> ```

Notes: the lecture number is zero-padded to two digits, the figure sequence within the lecture follows, and a short slug identifies the scenario, so files sort chronologically and read naturally in the figures folder.

## Authoring | 28 | Embedding via the html-figure block

[ ] Embed each figure in the lecture markdown on its own code block via the html-figure block, with the `src` path resolving against `md-lectures/` (so `figures/...` works) or the project root, and the `caption` attribute rendered as the figcaption.

[ ] The build inlines the file verbatim, numbers it `Fig {lecture}.{n}` in reading order, and warns on any lecture without a figure, so every lecture carries at least one.

[ ] A figure may also carry its HTML inline inside the code block when a tiny fragment is cleaner than a separate file, though the standalone file is the default.

[ ] PROPER EXAMPLE: make sure you follow this example, a figure embedded on its own code block in the lecture markdown:

> ````markdown
> ```html-figure src="figures/01-01-masthead.html" caption="Live browser viewport of the masthead after the vanilla script runs."```
> ````

Notes: the src path is relative to `md-lectures/`, the caption is a full sentence that survives as the figcaption under the rendered figure, and the html-figure block sits on its own line so the build can detect and inline it.

## Authoring | 29 | Locally Scoped Styles

[ ] Keep every CSS rule locally scoped by prefixing it with the figure's root class, so nothing leaks from the figure into the surrounding built page.

[ ] Avoid external assets (remote fonts, images, scripts) inside a figure, because the build inlines the file verbatim and Prince renders it offline; everything the figure needs lives inside the one .html file.

## Authoring | 30 | Print Safety

[ ] Avoid raw `<h2>` and `<h3>` tags inside an HTML figure, because `lecture.css` enforces `main h2 { page-break-before: always; break-before: page; }` in the print stylesheet and a native heading triggers an unconditional page break in Prince that severs the figure window in half.

[ ] Use styled semantic `<div>` or `<span>` elements with class names for every heading-like text inside a figure, so titles look right and the page stays whole.

[ ] PROPER EXAMPLE: make sure you follow this example, a heading-like title inside a figure:

> ```html
> <div class="desk-headline">The National Times</div>
> <span class="card-title">Order Summary</span>
> ```

Notes: both elements carry the visual weight of a heading through their classes while remaining inert to the print stylesheet, so Prince keeps the figure on one page.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```html
> <h2>Order Summary</h2>
> ```

Notes: the print stylesheet forces a page break before every `main h2`, so this innocent-looking tag splits the figure window in half in the PDF.

[ ] Keep the total figure height within the ~380px to 420px printable budget, so figure and figcaption stay unified on one page (see Visual Standards 10 for the comparison-specific budget).

## Authoring | 31 | The Specification File Recipe

[ ] Focus each visual aid on the single most counter-intuitive trap of its chapter (for example curly braces on default exports causing `undefined`, or an external counter incrementing across renders), because one figure that kills the #1 confusion beats three figures that graze the surface.

[ ] Draft the specification file before generating the image, saved to `md-images/<chapter>_<image>.md`, using the exact 5-part template: `# Visual Aid Specification - Lecture <NN>: <Title>`, then `Where:` (exact placement point in `md-lectures/<NN>.md`), `Accompanying Book Paragraph:` (full polished narrative paragraph), `Instruction:` (concrete prompt blueprint detailing the 2 columns, 3 tiers, and spot-color rules), `Style:` (modern Swiss editorial / Tufte / Stripe Press textbook aesthetic on pure white `#FFFFFF`), and `Description:` (the pedagogical aha moment and cognitive breakthrough).

[ ] Save the finalized generated asset to `img/<chapter>_<image>.jpg`, so specifications and assets pair by name and stay traceable.

## Integrity | 32 | Chronological Narrative Fidelity

[ ] A figure reflects the state of the codebase at that exact moment in the lecture, so leaking a future unwritten feature into an earlier figure is a defect, not a shortcut.

[ ] When a lecture introduces project creation or scaffolding (for example `npm create vite` or `npx create-next-app`), use template 01 as the mandatory archetype and render the pristine default starter template (`src/App.tsx`) with the authentic out-of-the-box UI (`Vite + React`, `count is 0`, `Edit src/App.tsx and save to test HMR`).

[ ] Keep custom domain components (for example `LiveDesk.tsx`, `CartDrawer.tsx`, `ArticleFeed.tsx`) out of scaffolding figures; they debut only in subsequent sections, at the point where the narrative reaches the moment the developer actually creates and authors the file.

[ ] Obey the narrative chronology law whenever cloning a template into a new figure, so the visual story and the code story advance in lockstep.

## Integrity | 33 | Code-Figure Synchronization

[ ] Keep the figure in 1:1 synchronization with the snippet above it: every element, class, or selector rendered in the figure appears in the lecture's preceding code snippet, so the student can trace each visual token back to real code.

[ ] Label any figure content that is not literally in the snippet as a plain content role, never as an undeclared CSS selector or class, so the figure never shows markup the code does not define.

[ ] Standard figures adapted from proven templates in md-lectures/figures/templates/ are verified via clean compiler output; screenshots via pdftoppm are strictly reserved for testing brand-new experimental templates or upon explicit user command (see the verification skill). #2026_09_20_28_group_1
