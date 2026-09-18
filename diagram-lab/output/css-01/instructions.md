# CSS Interview Lecture Series: Project Instructions (css-01)

This document is the single source of truth for the workflow of the `css-01` project inside `diagram-lab/output/`. Every question in the bank is taught as one long-form lecture: the lecture is the source of truth for depth, written first, built into HTML and PDF by the scripts in `src/`. The topic is interview readiness for CSS in three tracks: CSS review (cascade, box model, layout, modern selectors), BEM methodology with LESS and SASS, and responsive, accessible, cross-browser CSS. The design benchmark and the origin of every inherited law is the sibling project `../accessibility-01/`; the dated decision journal that records how this project was designed lives in `briefs/` (read `2026_09_13_01` through `04` in order).

## File structure and logic

```
css-01/
├── instructions.md        <- this file, the project's law
├── AUTHOR-BRIEF.md        <- the compact per-lecture brief you paste into a writing model
├── briefs/                <- the dated decision journal (YYYY_MM_DD_NN_<title>.md)
├── md-lectures/           <- THE SOURCE OF TRUTH: one lecture markdown per question, written first
├── md-lectures-html/      <- build output: {n}.html plus deck.html (course reader); never edit by hand
├── md-lectures-pdf/       <- build output rendered by Prince; never edit by hand
├── src/
│   ├── build-lectures.mjs <- reads md-lectures/, writes the html and pdf folders, enforces the gates
│   ├── css-figure.mjs     <- parses ```figure blocks into the CSS Figure panel
│   ├── lecture.css        <- the long-form article stylesheet shared by html and pdf
│   └── canvas-lab/        <- the prototype lab where the figure canvas was designed (reference; the demo lesson 08 lives here)
└── various/               <- reference material (demo UI, design instructions, the GPT resources consultation)
```

➔ md-lectures: the comprehensive lecture source markdown files, the source of truth.
❯ md-lectures-html: the html files of the lectures, from the md files (`/md-lectures`).
❯ md-lectures-pdf: the pdf files of the lectures, from the html files, from the md files.

When the user asks "write the lecture for question 09" you start from `md-lectures/09.md` and the matching row in the question bank. There is no plan phase and no approval gate: the question bank row is the plan. The Question column fixes the topic, the Hook column is the seed of the opening scenario, the Topic tag fixes the scope. Read the row, then write the lecture directly.

## The question bank

- **Location:** `../../questions-css/questions.md`, with the controlled topic vocabulary in `../../questions-css/topics.md` and the design rationale in `../../questions-css/README.md`. The bank holds 60 questions in three parts: CSS Review (1–31), BEM with LESS and SASS (32–45), Responsive + Accessible + Cross-Browser CSS (46–60).
- **Format:** every question is a row with five columns: `# | Tier | Topic | Question | Hook`. The number is the stable ID and the lecture filename. The Tier is `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`. The Question is written in interview register and becomes the `> INTERVIEW QUESTION` line of the lecture. The Hook is the pain-point seed of the Opening Ladder: grow it, never replace it.
- **Bank growth:** the bank grows from audits of the local corpus (see Sources of truth). Never invent a lecture without a bank row; if a topic is missing, add the row to the bank first, then write the lecture. Once the bank is approved its numbers freeze; later growth appends a new tranche, never renumbers.

## Sources of truth

- **The dual corpus.** css-01 cites TWO corpus roots, and the handout at `documentation official/css/README.md` (read it before writing any lecture) defines what every source is authoritative for:
  1. `documentation official/css/` — the CSS-specific corpus: `resources/spec/csswg-drafts/` (the CSS Working Group specification source, sparse checkout of 25 modules; quote a module's `Overview.bs` when the question is "what does the standard require"), `resources/methodology/bem-method/` (the original Yandex BEM documentation, the primary BEM authority), `resources/methodology/getbem/` (the popular two-dashes teaching interpretation, secondary), `resources/preprocessors/sass-site/` and `resources/preprocessors/less-docs/` (the official language documentations), `resources/cross-browser/normalize.css/` and `resources/cross-browser/sanitize.css/` (primary code artifacts), `resources/practice/` (sass-guidelines, moderncss, smolcss; phrasing only), and `books/` (unpacked EPUBs with per-book INDEX.md).
  2. `documentation official/accessibility-performance/` — the pre-existing corpus whose CSS zones this project reuses: the full MDN tree (`resources/web-performance/mdn/files/en-us/web/css/`), the archived web.dev snapshot (`resources/web-performance/web-dev/src/site/content/en/learn/css/` and `learn/design/`), the Web Almanac `css.md` chapters (2019–2022, 2025), and the Front End Interview Handbook (`resources/interview/front-end-interview-handbook/`).
- **Authority hierarchy when sources disagree:** CSSWG specifications first, then official documentation (MDN first for CSS itself; sass-site, less-docs, and bem-method for their own languages and methodology), then books, then real-world data (Web Almanac), then practitioner sources, and the interview handbook never.
- **The BEM two-source rule:** cite `bem-method` for what the methodology defines (classical notation, key concepts, history); cite `getbem` only for the two-dashes convention the industry commonly writes. A strong lecture on BEM naming teaches both and their provenance.
- **Primary anchoring:** every lecture anchors its central technical claims to the corpus. The question-to-authority map in `documentation official/css/README.md` assigns the cite-first source per topic family (cascade to `css-cascade-5/`, flexbox to `css-flexbox-1/`, Sass modules to `sass-site/source/documentation/`, normalization to the normalize/sanitize source, and so on).
- **Freshness:** never call the archived web.dev snapshot current (frozen March 2024; the live Learn CSS course was refreshed in September 2025 with no cloneable repository, so MDN and the specifications are the currentness authorities); teach Less as the living legacy codebase it is; verify Sass claims against `sass-site/source/documentation/breaking-changes/` (the `@import` deprecation, `math.div()`, Dart Sass as the only living implementation).

### The quoting law

Every lecture must contain at least one verbatim quote from an authoritative source, cited by its corpus path. The build warns when a lecture carries no citation path, and the warning is a defect you must repair.

- **Quote shape:** a markdown blockquote holding the exact words, followed by an attribution line naming the source and the citation path in backticks. For example:
```
> The cascade is an algorithm that defines how user agents combine property values originating from different sources.
*CSS Cascading and Inheritance Level 5 (W3C Working Draft), `resources/spec/csswg-drafts/css-cascade-5/Overview.bs`*
```
- **Authoritative sources only (No books directly):** You are invited to cite primary authoritative sources like W3C specifications (`resources/spec/csswg-drafts/`) and official developer documentation (MDN, Sass, Less, BEM). **Never quote or cite from the books directly** in the lecture text; books exist solely for background research and context, never as reader-facing citations.
- **Normative versus informative:** quote the W3C specification when the claim is about what the standard requires; quote official documentation (MDN, preprocessor docs, BEM) when the claim is about practice.
- **Verbatim means verbatim:** copy the source's exact wording from the local file; never paraphrase inside quote marks. Specification sources are Bikeshed `.bs` files: quote the prose, skip the markup tags.

## The HTML Figure Architecture & Visual Design Language

Every lecture contains high-impact visual aids authored as standalone HTML/CSS components in `md-lectures/figures/` and referenced via `html-figure` blocks. This replaces the legacy JS-based string generation with pure web authoring: real HTML elements styled with real CSS rules, rendered natively by PrinceXML into publication-grade PDF graphics.

### Authoring Syntax & Pipeline

A figure is embedded in lecture markdown using the `html-figure` fence:

````markdown
```html-figure src="md-lectures/figures/01-01-cascade-order.html" caption="Order of appearance decides between two rules targeting the exact same class. The later declaration in the document stream wins."
```
````

- **File Naming Convention:** Every figure file must live in `md-lectures/figures/` and follow the systematic two-part numeric schema: `{lecture_num:02d}-{figure_seq:02d}-{descriptive-slug}.html` (e.g. `01-01-cascade-order.html`, `07-01-position-tooltip.html`, `07-02-relative-shift.html`).
- **Automated Captioning & Numbering:** The build script (`build-lectures.mjs`) reads the external HTML file, wraps it inside a `<figure class="css-figure">` container, injects auto-numbered `<figcaption>Fig {lecture}.{n}: {caption}</figcaption>`, and enforces global page-break isolation.
- **Standalone CSS Scoping:** Each figure file includes an embedded `<style>` block scoped to its container class (e.g. `.fig-cascade`, `.cb-figure`, `.fig-wrapper`). PrinceXML renders standard CSS natively (flexbox, borders, shadows, transforms, SVG overlays). JavaScript and external Tailwind CDNs are strictly banned.

### The Visual Design Language: Modern Figure Design System (Lectures 40–47 Benchmark)

Authors are strictly **mandated** to adhere to the Figure Design System codified in `FIGURE-DESIGN-SYSTEM.md`. Applying obsolete pre-40 flat pastel boxes or text-only bullet cards is permanently forbidden. Every figure MUST select, clone, and adapt from one of the **Seven Mandatory Archetypes**:

#### The "Never Text-Only" Law (The Anti-Ugly Gate)
A figure card is an illustration of spatial, temporal, mechanical, or physical reality. Wrapping plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without an authentic graphical substrate is STRICTLY FORBIDDEN. Every figure MUST feature real graphical substrates: DOM traversal trees with connector circles, realistic device frames with browser chrome, architectural canvases with calipers, or zoom viewfinder lenses.

#### The Seven Mandatory Figure Archetypes (Reference: `FIGURE-DESIGN-SYSTEM.md`)
1. **Archetype 1: DOM Traversal & Selector Matching Pipeline (`45.2`):**
   - Relative container `.traversal-tree`, vertical `.tree-line` (`left: 11px; width: 2px;`), and mathematically concentric circle markers on `.tree-node::before` (`left: -19px; width: 10px; height: 10px; margin-top: -5px;`). Status badges: `badge-pass` (`✓ MATCH`) and `badge-walk` (`WALK ↑`).
2. **Archetype 2: Realistic Virtual Device & Mobile Browser (`47.1`):**
   - Authentic `.phone-frame` with `.phone-notch` speaker bar, `.phone-browser-bar` with monochrome SVG lock and URL pill, `.web-masthead` with serif logo, financial ticker chips, and 1:1 responsive layout vs 38% scaled desktop canvas.
3. **Archetype 3: Architectural Canvas & Zoom Viewfinder Lens (`47.2`):**
   - Virtual document blueprint with technical dimension calipers (`.caliper-bar` with end ticks `::before`/`::after` and labeled line), layout bounds, and elevated floating `.viewfinder-lens` (`2.0× ZOOM` badge, red dimension caliper, and ghosted off-screen content).
4. **Archetype 4: Specificity Ladder & Cascade Escalation (`45.3`):**
   - Symmetrical tiered ladder cards (`.ladder-tier`), scores `(0, 1, 0)` vs `(0, 4, 0)`, and verdict callouts (`.verdict-box`).
5. **Archetype 5: Multi-Paradigm Comparison & Token Stacks (`46.1`, `46.3`):**
   - Symmetrical 3-card or multi-brand comparison, decoupled metadata pills, color-coded tokens (Dark Teal `#0e7490`, Deep Crimson `#9f1239`, Dark Slate `#1e293b`).
6. **Archetype 6: Stylesheet Growth Curves & Performance Charts (`46.2`):**
   - Horizontal bar tracks (`.bar-track`, `.bar-fill`), clear KB metrics with `min-width` preventing text wraps.
7. **Archetype 7: Compiler Geometry & Preprocessor Transformations (`40.1`, `41.1`):**
   - Build-time code expansion panels, AST step arrows, input/output syntax comparison.

#### Strict Canonical Shell & Color Standards:
- Container: `.print-fig` with `border: 2px solid #0f172a`, `border-radius: 6px-8px`, pure white card containers, `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06)`.
- Palette: Primary Teal `#0e7490`, Secondary Crimson `#9f1239`, Neutral Slate `#1e293b` / `#0f172a`.
- Zero Platform Emojis: Never use raw yellow system emojis (`🔒`, `✓`, `✕`); always use inline SVG icons or monochrome unicode glyphs.
- Anti-Collision Table Spacing: Metric tables inside cards must use short keys (`JS API`, `MEDIA QUERIES`) with explicit `gap: 8px` and `white-space: nowrap`.
- Height Budget: Total figure height must strictly respect ~380px–420px to prevent multi-page fragment splits.
  2. **The Single-Topic Hazard / Trap Architecture (Figure 41.2 Benchmark):**
     - `.trap-header`: Solid Black `#000000`, uppercase bold `14px–16px`, centered, border-radius 6px 6px 0 0.
     - `.trap-card`: Solid 3px black border (`#000000`), border-top none, border-radius 0 0 6px 6px, white background, padding 20px–24px.
     - `.section-input`: Slate Gray (`border: 2px solid #4b5563;` with `.trap-bar` `background: #4b5563; color: #ffffff;` and code `background: #f9fafb; color: #111827;`).
     - Centered directional arrow pointing down.
     - `.section-output`: Deep Crimson (`border: 2px solid #9f1239;` with `.trap-bar` `background: #9f1239; color: #ffffff;` and code `background: #fff1f2; color: #7f1d1d;`).
- **Typography Floor and Formatting Integrity:** Strict $\ge 11.5\text{px}$ floor on all text, dimensions, and timeline labels. Code inside nodes must be cleanly formatted on dedicated lines to prevent awkward hyphenated line-breaks (e.g., `var(--brand-blue);` must never split mid-property or mid-variable).

---

### The Two Content Archetypes: Comparative versus Illustrative Figures

A real CSS textbook cannot and must not obsessively repeat a single comparative template. In CSS pedagogy, figures serve two distinct cognitive purposes, and authors have the explicit mandate and creative freedom to select the archetype that naturally fits the lesson:

#### Archetype 1: Comparative Figures (The Duel / Tournament)
- **When to Use:** When evaluating style collisions, cascade priority, specificity tournaments, origin precedence (`!important`), or bug reproduction versus architectural fix (e.g. `Order #1 vs Order #2`, `Classes vs ID`, `Wrong vs Right`).
- **Visual Structure:** Symmetrical side-by-side cards (`.preview-card`), comparison header pills (`✕ OVERRIDDEN` vs `✓ WINNER`, or `✕ WRONG` vs `✓ RIGHT`), and matching diagnostic footer strips.
- **Rules:** Enforce strict visual symmetry: identical line counts in header pills, identical card padding, matching 2-line footer heights (`min-height: 52px;`) wrapping cleanly at semicolons, and minimal physical specificity naming the concrete property (e.g. `Orange background declared with classes...`).

#### Archetype 2: Illustrative Figures (The Textbook Anatomy / Code Realization)
- **When to Use:** When explaining how CSS properties and layout models actually function in isolation (e.g. Flexbox item distribution, Grid track templates, Box Model margin/padding boundaries, float flow, positioning coordinate systems, or multi-column layout).
- **Core Principle:** There is NO "wrong" or "right" way here—neither state is broken. Forcing artificial "winner" and "loser" badges onto a neutral layout is an anti-pattern. The diagram simply renders what the browser produces from the provided code snippet.
- **Visual Strategy & In-UI Element Identification:**
  - Present the rendered HTML elements cleanly inside an authentic layout stage or container card.
  - Clearly identify the constituent elements inside the UI to visually reinforce the code (just like classic, premier CSS textbooks such as *CSS: The Definitive Guide*).
  - **The In-UI Element Label Rule:** When demonstrating multiple elements (for example, three child elements named `.box` inside a `.container`), display the three boxes inside the container and show a clean, subtle `.box` badge or label directly on or within each box. This instantly connects the reader's eyes from `.box` in the code fence to the physical rectangles on the page.
  - Keep the presentation aesthetically appealing, crisp, and textbook-grade: subtle pastel fills, distinct borders, and clean typography.
  - Add dimension callouts, track markers, or axis arrows only when they illuminate the mechanism—never overload the canvas with unnecessary decorative noise.
  - **Author Freedom:** No forced comparison splits. No artificial error states. Focus 100% on making the code's spatial behavior crystal clear, beautiful, and intuitive.

---

### Craftsmanship & Production Quality Gates

Every HTML figure must satisfy the following strict publication criteria:
1. **Benchmark: Visual Symmetry in Comparative Mode (And Clean Focus in Illustrative Mode):** When authoring side-by-side comparison panels (Comparative Archetype), maintain strict vertical symmetry: matching header pills, identical card padding, and matching 2-line footer heights (`min-height: 52px;`) wrapping cleanly at semicolons. When authoring single-state mechanical illustrations (Illustrative Archetype), ensure clean centering, generous internal padding, and distinct in-UI element identification (e.g. `.box` labels on top of child boxes). Never force artificial comparison splits or winner/loser pills onto neutral layout demonstrations.
2. **Clean Component Separation (No "Box Next to Box"):** The rendered component body must contain ONLY its authentic HTML elements matching the code fence above (e.g. title, copy, and the single `<button class="btn-subscribe">`). NEVER place explanatory comment boxes or tag pills inside the component next to interactive elements. That creates visual confusion where the student cannot distinguish the element from the comment. Diagnostic explanations live strictly in a dedicated full-width footer strip across the bottom of the card.
3. **Logical Clarity in Comparative Wording & Concise but Never Cryptic Law:** Footer comments must directly explain the cause-and-effect contrast using concrete color, property, and order references. Copy must be concise and punchy, but **NEVER cryptic, abbreviated, or grammatically distorted**:
   - **Concise but Never Cryptic:** Never write terse, confusing shorthand that distorts what was actually written in code (e.g. do NOT say "Black text declared with initial"—the author never declared black text, they declared `color: initial`, which evaluated to default black). Always explicitly state: (1) what CSS property or keyword was declared and what value the browser computed from it (e.g. `color: initial resets text to default black`), (2) the semicolon break `;`, and (3) the physical on-screen consequence (e.g. `Black link vanishes against dark slate surface`). A student must understand the line immediately without having to solve a riddle.
   - **Minimal Physical Specificity (No Naked Colors):** Never refer merely to a raw color in isolation (e.g. "orange", "blue", "green"). Always name the concrete CSS property or visual role being modified: e.g. **"orange background"**, **"blue background"**, **"green text"**, **"red border"**. Merely saying "orange" leaves the student wondering whether the text, icon, or background was modified. Naming the physical role (e.g. "orange background") connects the stylesheet rule to the exact UI element on the screen.
   - **Comparative Repetition:** Explicitly repeat the position and relationship of both competing states (e.g. `✕ Overridden: Blue background declared first, before green; Blue background is suppressed` vs `✓ Cascaded Value: Green background declared second, after blue; Green background wins the page`). Repeating the exact role provides instant cognitive clarity.
4. **Human-Scale Typography (No Micro-Text, No Giant Text):** All UI copy, button labels, and diagnostic notes must use comfortable, readable font sizes:
   - Component Titles: `17px`–`18px` bold.
   - Body Copy & Buttons: `13.5px`–`14px`.
   - Header Pills & Diagnostic Footers: `13px`–`13.5px`.
   - Never use microscopic `9px`–`10px` text that strains the reader's eyes, and never use oversized fonts that cause text collisions.
5. **No Redundant Takeaway Panels:** Do not append artificial summary boxes below comparison cards when the card footers and figure caption already convey the lesson.
6. **Breathing Room & Vertical Margins:** Figures must maintain generous vertical spacing from surrounding text (`margin-top: 2.0rem; margin-bottom: 3.2rem;` in stylesheet). Body text following a figure must never visually collide with or hug the caption.
7. **Page-Break Isolation:** Every root figure container must declare `page-break-inside: avoid; break-inside: avoid;` in its CSS. Multi-card figures must never split mid-card across two PDF pages.
8. **Safe Typography & Zero Build Warnings:** Use `font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;` for UI copy. Never set `font-weight: 800` on special unicode characters like `✕` or `✓`, keeping bold symbols at `font-weight: 700`. Zero warnings from `node src/build-lectures.mjs` is the mandatory quality gate.
9. **Code-Diagram 1:1 Synchronization:** Every selector, class name, and property value rendered in the figure canvas must match the preceding code fence exactly. Never invent classes in the diagram that do not exist in the code.
10. **Universal Familiar Lexicon Law (No Designer/Esoteric Jargon):** Every visual figure, card label, button label, caption, and diagnostic footer comment must ALWAYS use language that:
    - (a) The student is already intuitively familiar with from everyday life (e.g. standard elementary color names: `blue`, `green`, `red`, `orange`, `yellow`; standard UI nouns: `button`, `card`, `link`, `element`, `title`, `text`); OR
    - (b) Has been explicitly baptized, introduced, and explained previously in the lecture prose or in the curriculum pearls of wisdom.
    - **Strict Prohibition on Esoteric/Designer Vocabulary:** NEVER use obscure, specialized, or designer color names (e.g. "amber", "teal", "slate", "indigo", "mauve", "chartreuse", "fuchsia") or unfamiliar keywords in diagrams. A novice student should never have to wonder what color or concept a label refers to. If a hex code is `#d97706` or `#ea580c`, call it **orange background**, not "amber". If a hex code is `#1e3a8a`, call it **blue background**, not "navy".
    - **Prior Explanation Requirement:** If an author uses any term, keyword, or concept that is remotely unfamiliar or specialized, that term MUST have been thoroughly explained and defined in the student's materials beforehand. Using unbaptized jargon inside an image creates instant cognitive confusion and is strictly forbidden.
11. **The 10/10 Perfection Self-Audit Gate (Zero Disturbances Law):** Quality must be strictly 10/10 with zero compromises. At the conclusion of authoring every image, the author must rigorously audit the result against this mandatory standard:
    - *Does this image PERFECTLY represent the spirit and craftsmanship of the canonical reference benchmark (clean authentic HTML elements only, generous breathing room, elegant symmetry, 100% saturated true-to-code colors)?*
    - *Does it introduce ANY new disturbances in clarity, layout crowding, or design principles (e.g. artificial diagnostic badges/chips placed inside the component body, forced line-wrapping of labels, unnatural inspection outlines, or visual clutter)?*
    - *Are all diagnostic comments and analytical metrics strictly confined to the top header pills and the dedicated 2-line symmetrical footer strip?*
    If any disturbance or imperfection is detected, the figure is defective and must be reworked immediately. Never accept a 7/10 or 8/10 compromise.

---

### Canonical Reference Implementation: Abstract Component UI

The following exact, complete HTML file ([`md-lectures/figures/01-01-cascade-order.html`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/css-01/md-lectures/figures/01-01-cascade-order.html)) serves as the gold standard reference template for Paradigm 1 (Abstract Component UI). Copy and adapt this structure for all component-level comparisons:

```html
<style>
  .fig-cascade {
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    box-sizing: border-box;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Comparison Header Pills — Identical 1-Line Symmetry */
  .cascade-header {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
  }
  .cascade-pill {
    flex: 1;
    text-align: center;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13.5px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
  .pill-overridden {
    background: #fde8e8;
    border: 1px solid #f9b4b4;
    color: #b91c1c;
  }
  .pill-winner {
    background: #def7ec;
    border: 1px solid #84e1bc;
    color: #03543f;
  }

  /* Side-by-Side Cards */
  .cascade-grid {
    display: flex;
    gap: 16px;
    align-items: stretch;
  }
  .preview-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
  }
  .card-overridden {
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  }
  .card-winner {
    border: 1.5px solid #84e1bc;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
  }

  /* Authentic Card Body (ONLY the HTML elements — No "Box Next to Box") */
  .card-body {
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .comp-title {
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px 0;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
  .comp-copy {
    font-size: 13.5px;
    color: #475569;
    margin: 0 0 14px 0;
    line-height: 1.4;
  }

  /* The Single Button Element */
  .btn-wrapper {
    margin-top: auto;
  }
  .btn-subscribe {
    display: inline-block;
    padding: 7px 22px;
    font-size: 13.5px;
    font-weight: 600;
    border-radius: 5px;
    border: none;
    color: #ffffff;
    cursor: default;
    font-family: inherit;
    text-align: center;
  }
  .btn-blue {
    background: #2563eb;
    box-shadow: 0 1px 3px rgba(37, 99, 235, 0.35);
  }
  .btn-green {
    background: #16a34a;
    box-shadow: 0 1px 3px rgba(22, 163, 74, 0.35);
  }

  /* Card Diagnostic Footer Strip — Strictly Symmetrical Height & Line Count */
  .card-footer {
    padding: 10px 16px;
    font-size: 13px;
    line-height: 1.35;
    font-weight: 500;
    border-top: 1px solid;
    min-height: 52px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .footer-overridden {
    background: #fef2f2;
    border-top-color: #fee2e2;
    color: #991b1b;
  }
  .footer-winner {
    background: #f0fdf4;
    border-top-color: #dcfce7;
    color: #166534;
  }
  .card-footer strong {
    font-weight: 700;
  }
</style>

<div class="fig-cascade">

  <!-- Top Verdict Pills: Perfectly Symmetrical 1-Line Headers -->
  <header class="cascade-header">
    <div class="cascade-pill pill-overridden">
      ✕ OVERRIDDEN — theme-modern.css
    </div>
    <div class="cascade-pill pill-winner">
      ✓ WINNER — theme-legacy.css
    </div>
  </header>

  <!-- Side-by-Side Rendered Components -->
  <div class="cascade-grid">

    <!-- LEFT CARD: Modern Theme (Overridden) -->
    <article class="preview-card card-overridden">
      <div class="card-body">
        <h3 class="comp-title">The Evening Edition</h3>
        <p class="comp-copy">Daily investigative reporting delivered at 6 PM.</p>
        <div class="btn-wrapper">
          <span class="btn-subscribe btn-blue">Subscribe</span>
        </div>
      </div>
      <div class="card-footer footer-overridden">
        <span><strong>✕ Overridden:</strong> Blue background declared first, before green; Blue background is suppressed</span>
      </div>
    </article>

    <!-- RIGHT CARD: Legacy Theme (Winner) -->
    <article class="preview-card card-winner">
      <div class="card-body">
        <h3 class="comp-title">The Evening Edition</h3>
        <p class="comp-copy">Daily investigative reporting delivered at 6 PM.</p>
        <div class="btn-wrapper">
          <span class="btn-subscribe btn-green">Subscribe</span>
        </div>
      </div>
      <div class="card-footer footer-winner">
        <span><strong>✓ Cascaded Value:</strong> Green background declared second, after blue; Green background wins the page</span>
      </div>
    </article>

  </div>

</div>
```

### Canonical Reference Implementation: Illustrative Figure (Direct Code Realization)

The following HTML pattern demonstrates Archetype 2 (Illustrative Figures). It renders a single layout scenario directly from a code snippet (e.g. three child `.box` elements distributed inside a `.container`), with clean in-UI badges (`.box`) labeling each element on top, clear axis guides, subtle dimensions, and zero forced comparison splits or fake error pills:

```html
<style>
  .fig-illustrative {
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    box-sizing: border-box;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .stage-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  }
  .stage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    color: #64748b;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }
  .stage-axis {
    font-weight: 600;
    color: #475569;
  }
  .flex-container {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: #f8fafc;
    border: 1.5px dashed #cbd5e1;
    border-radius: 6px;
  }
  .child-box {
    flex: 1;
    padding: 14px 12px;
    background: #e0e7ff;
    border: 1px solid #c7d2fe;
    border-radius: 6px;
    text-align: center;
  }
  .child-badge {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    font-weight: 700;
    color: #3730a3;
    display: block;
    margin-bottom: 4px;
  }
  .child-detail {
    font-size: 13px;
    color: #4338ca;
    font-weight: 500;
  }
</style>

<div class="fig-illustrative">
  <div class="stage-card">
    <div class="stage-header">
      <span>.container (display: flex; gap: 16px;)</span>
      <span class="stage-axis">Main Axis →</span>
    </div>
    <div class="flex-container">
      <div class="child-box">
        <span class="child-badge">.box (1)</span>
        <span class="child-detail">flex: 1</span>
      </div>
      <div class="child-box">
        <span class="child-badge">.box (2)</span>
        <span class="child-detail">flex: 1</span>
      </div>
      <div class="child-box">
        <span class="child-badge">.box (3)</span>
        <span class="child-detail">flex: 1</span>
      </div>
    </div>
  </div>
</div>
```

## Writing one lecture

### Skeleton, in this order

1. Line 1, exactly: `# Lecture {n}: {Catchy Title}`. The title must be a compelling, visceral hook that draws the reader in (e.g., "The Z-Index Trap", "When Margins Collide", or "The 100vw Screen Jump"). **CRITICAL:** You must restrict the title to **B2 English vocabulary**; do not use obscure words (like "wobble" or "quirk") that a non-native reader might not know. Leave the dry technical wording for the Interview Question below it.
2. Line 2, exactly: `> INTERVIEW QUESTION | {tier} | {question text copied verbatim from the bank row}`
3. Blank line, then the Opening Ladder: 5 to 7 numbered beats that open the body, in this order: the scene, the moment of failure or surprise, the question (a clear, direct sentence stating the visible conflict), the danger, the mystery, the promise. No sentence over 20 words and no em-dashes. Never name the lecture's mechanism term in the ladder; the term is earned in the body. Each beat makes sense read alone. The build generates the "Imagine this scenario:" lead; never write it yourself.
4. Right after the ladder comes the first `### ` section: a catchy title naming the chapter's idea, then prose opening the teaching.
5. Body sections with `### ` headings only. `## ` forces a PDF page break; save it for audit or reference sections at the end. Every technical section follows the **Harmonious Code + UI Step Rhythm**:
   (a) **Mandatory Introductory Prose:** Every `### ` heading MUST open with 2–3 sentences of conceptual framing. **Hard layout rule:** Never start a section immediately with a code block or figure, as floated marginalia headings (`h3`) collide with breakout blocks in PDF layout.
   (b) **Code Snippet Precedes Figure:** Precedes the figure every single time under the section, presenting the code contrast with end-of-line comments (e.g. `/* **WRONG:** ... */` vs `/* **RIGHT:** ... */`). Never put comments on their own line inside code blocks; separate-line `**DO NOT DO THIS:**` and `**DO THIS:**` leads belong strictly above summary mini-fences. **Code and Figure Synchronization:** Every element, class, or selector rendered in a figure canvas MUST appear in the code snippet directly above it (or be clearly labeled by its plain layout role, never as an undeclared CSS selector). Page 2 fit is a guideline to aim for, but NEVER a hard limit that sacrifices clarity. When clarity demands showing parent-child hierarchy, markup context, or child rules, always show them.
   (c) **CSS Figure:** Immediately follows the code snippet, rendering the geometric consequence (using `layout="compare"` and `width="2/3"` for wrong/right contrasts).
   (d) **Analytical Derivation:** Directly follows the figure, breaking down the perceptual and technical contrast, accompanied by authoritative verbatim quotes from the specifications or MDN at the defining moment.
   (e) For multi-step lessons, repeat this step-by-step pairing under sequential sections: `[Section Text -> Code Snippet -> Figure -> Derivation]` $\to$ `[Section Text -> Code Snippet -> Figure -> Derivation]`. Always explain before or after the code and figure.
6. At least one `> [!TIP]` callout with a `**To impress the interviewer:**` lead, placed at the moment the tip matters. Use `> [!KEY]` for one-line insider takeaways. Use `> [!WISDOM]` (rendering with the 💡 Pearls of Wisdom lamp icon) to preemptively clarify industry nomenclature, design system customs, and experiential practice before practical code examples.
7. Right before the Summary, a `### Where you will meet this` section: 3 to 5 one-line uses of today's concept in real apps the reader knows; each line is one pictureable moment plus what the concept does there.
8. A `### Glossary` section positioned directly after `### Where you will meet this` and immediately before `### Summary`: 4 to 6 core terms introduced or reinforced in the lecture. Each term is a single bullet line formatted as `- **Term**: Plain-English definition explaining the concept and its practical engineering role.` No em-dashes and no hard-wrapping.
9. Close with `### Summary` written as a Streetwise Review from an experienced developer's daily perspective.

### The Opening Ladder laws

- Single actor throughout: one person with one unambiguous role (a front-page editor, a junior developer, a subscriber); never rotate synonyms for the actor.
- Every noun is exactly one thing: a person, a thing visible on the screen, a thing in the code, or a machine event. Never a bare overloaded word: "specificity" before it is taught (say "the score that decides which rule wins"), "float" (say "the image the text wraps around"), "margin collapse" (say "the two gaps that merge into one"). Write the visible behavior instead of the term.
- The beat that sets up the scenario must directly expose the contradiction between what the stylesheet was told to do and what the screen actually shows.
- The last beat promises, never explains: promise what today brings in plain words; the answer belongs to the body's first section.
- Scenario clarity is absolute: write for a tired B2 English reader with a headache. The ladder is the clearest part of the whole lecture.

### Code fences

- Fences are ` ```css title="styles.css" `, ` ```scss title="_card.scss" `, ` ```less title="theme.less" `, ` ```html title="index.html" `, ` ```javascript title="app.js" `. Real, runnable examples in the National Times world, kept under about 80 characters per line; every line renders as a numbered row, blank lines included, so keep fences dense.
- Every body code snippet must render as an authentic macOS editor window (`.editor`) with titlebar dots, filename tab (`title="..."`), line numbers, and tabbed comment speech bubbles (`.cmt-bubble`). Code fences must always start flush at column 0, separated from preceding lists or paragraphs by a blank line. Never allow code blocks to be treated as list continuations or rendered into unstyled `.mini-code` boxes.
- Plain CSS fences are the default: the declaration IS the topic, and the build's CSS tokenizer paints selectors, properties, values, and a live color swatch before every color value. Use `scss` and `less` fences in Part Two so preprocessor syntax gets the same CSS-aware highlighting.
- Comments live at the END of the code line as `code; /* annotation */` in CSS and preprocessor fences (or `// annotation` in JS, `<!-- annotation -->` in HTML), never on their own line. Lead verdicts with `**RIGHT:**` and `**WRONG:**` when code is strictly correct or incorrect. When a snippet is technically valid but demonstrates an overridden or unexpected outcome (such as in cascade resolution), use descriptive labels like `**WINNER:**` and `**LOSER:**`. Put one caps load-bearing word in `**bold**`. The build engine automatically parses these end-of-line comments into tabbed comment speech bubbles (`.cmt-bubble`) with color-coded verdict badges. Never allow code comments to break mid-word (zero `word-break: break-all`). Never write check or cross emoji; the build strips them and the summary's side-panel icons come from the fence language tag instead.

### Glossary shape

- Section heading is exactly `### Glossary`, positioned directly after `### Where you will meet this` and immediately before `### Summary`.
- Contains 4 to 6 core terms introduced or reinforced in the lecture.
- Each term is an unnested bullet on a single continuous line (no hard-wrapping) formatted as: `- **Term**: Clear, concise definition in plain English explaining the concept and its concrete role in code or rendering.`
- Never use em-dashes (`—` or `--`); always separate the bold term and definition with a colon.
- Anchor definitions in observable rendering behavior rather than abstract dictionary definitions.

### Summary shape

- Lead the summary body with an authoritative `**Technical Title**` in bold on its own line, followed by an empty line before the opening paragraph. Open directly with the developer frequency, architectural role, or consequence; never with conversational filler like "Look,".
- Use `❒ {Subtitle}` section headers.
- Under each subtitle, use numbered points with indented sub-lines formatted with `<br>&nbsp;&nbsp;&nbsp;&nbsp;` so they stay on one continuous line without hard-wrapping.
- For right and wrong examples in the summary, DO NOT put comments inside the code block. Add `right` or `wrong` directly to the fence language tag (` ```css right ` or ` ```css wrong `), and put the instruction on the line exactly above the block using flush-left bold text without emojis: `**DO THIS:** {instruction}` or `**DO NOT DO THIS:** {instruction}`.
- Highlight core principles with `➔ NEVER`, `➔ ALWAYS`, and `➔ IF ... THEN ...`. Bold the load-bearing words in every bullet.
- End with the comparison table as the LAST block of the file.

### The closing table (exact shape and Transposition Law)

```
| | **COLUMN B**<br>(subtitle) | **COLUMN C**<br>(subtitle) |
| ---: | :--- | :--- |
| **Dimension** | value | value |
```

First header cell always empty; header titles are `**CAPS**` plus `<br>` plus a one-word subtitle; the divider row is exactly `| ---: | :--- | :--- |`; every body row starts with a bold dimension.

- **The 3-Column Budget:** Printable PDF width on Letter portrait is ~175mm (~660px). Closing tables must strictly have exactly 3 columns (the first dimension column followed by two comparative columns). A 4- or 5-column table causes catastrophic horizontal overflow where outer columns clip off the right edge of the page.
- **The Transposition Law:** When comparing three or more entities (such as the five positioning schemes, the four cascade origins, or the BEM plus utility-first plus CSS-in-JS strategies), NEVER make the entities into separate columns. Instead, transpose the table: place the entities as the **rows** (starting each row with a bold dimension in column 1), and use the two table columns for the analytical axes (such as `**VISIBLE SYMPTOM**<br>(what you see)` and `**MECHANISM**<br>(why it happens)`).
- **Code splitting:** PDF table columns are narrow, so separate prose from code with `<br>` and manually wrap multi-part code across separate backticks with `<br>` between them (for example `` `box-sizing`<br>`: border-box` ``). Never put `<br>` inside backticks. Table strings longer than about 20 characters inside one pair of backticks draw a build warning: split them.

## Hard format rules

- One continuous line per paragraph, bullet, and table row. Never hard-wrap.
- No em-dashes anywhere in the lecture.
- Keep every technical term, and immediately define it in plain English in the same sentence.
- Define through experience, never only through other words: start every new concept from what the reader has already done or seen in this course; define it as that known thing plus one change, and teach only the change.
- **Cognitive Accessibility & B2 Language Standard (The "Headache & Short Attention Span" Law)**: Write directly for a developer who has a splitting headache and a short attention span. If a sentence requires re-reading to parse its grammatical structure, it is defective and must be broken down. Use clear, accessible, everyday English vocabulary (CEFR B2 level). Sentences must be short, active, and direct (target average 12 to 18 words; paragraphs 2 to 4 sentences). Strictly ban academic puffery, Latinate jargon, and convoluted clauses (*"runs on your computer"* instead of *"executes within the compilation lifecycle"*). Strictly enforce zero content degradation: the student must be fully equipped to answer the exact same demanding interview questions as any senior web developer. Build concepts properly step-by-step from the physical reality (file extensions, build tools on your laptop vs browser runtime, HTML tags on screen).
- **Mandatory Bold Baptism of New Terms**: In key paragraphs where new terms, keywords, concepts, or primitives are first baptized and introduced, **they MUST be formatted in bold (`**term**`)** to provide instant visual scanning anchors for tired readers.
- **Iterative Chapter Versioning**: The active chapter is always `{n}.md` (and builds to `{n}.html`, `{n}.pdf`). When revising or iterating on a chapter, prior iterations are archived under `{n}-old-01`, `{n}-old-02`, etc., appending to the old numbering sequence.
- Build the lecture around the one thing: every concept reduces to one visible change, one declaration added, one value swapped, one figure annotation. Find it, show it early and alone, center the lecture on it.
- Raise the strongest naive alternative first: the first "how else could we do this?" must be the one a working developer would actually reach for (why not just `!important`? why not just add another wrapper class? why not just test in Chrome?). Answer it before any weaker strawman.
- Search the deck before baptizing a term: grep `md-lectures/` for the concept first; if an earlier lecture taught it, re-anchor with a one-line reminder plus `(see Lecture N)` and deepen. Part Three deliberately re-anchors the accessibility series' contrast, zoom, and target-size lectures instead of re-teaching them; cross-link as `(see the accessibility series, Lecture N)`.
- **Comprehensive Lecture Depth (The Universal Standard)**: The previous word ceilings are permanently abolished. Every lecture on CSS must deliver the comprehensive, step-by-step depth established across the production series (Lectures 01 to 10): **3,000 to 4,500+ words**, naturally spanning **16 to 32+ PDF pages**. Take all the space needed to guide the reader patiently through visual breakdowns, naive quick-fix failures, architectural engine mechanics, production edge cases, and high-stakes interview drills.

### Pedagogical Clarity Law (The Maximum Clarity Standard)

Teaching is not documenting. A reference manual merely states technical rules; a world-class lecture takes a tired developer and gently, patiently walks their eyes and mind from visual confusion to technical mastery. Every lecture must obey the principles detailed in `PEDAGOGICAL-CLARITY.md`:

1. **The "Insightful Guide" Principle (Cause, Effect, and Mechanism Over SVG Pixel Inventory):**
   - When explaining a diagram, code block, or browser preview, **never narrate the graphic designer's visual props or repeat robotic eyeball commands**.
   - ❌ **DO NOT WRITE (Robotic, repetitive eye commands):** *"Look at the left panel... Look at the navigation links at the bottom... Notice the callout with an arrow pointing down... Look closely at the dashed red box... Now look at the right panel... Look at the green checkmark..."*
   - ✅ **DO WRITE (Cause, effect, and mechanism in natural prose):** *"In the left panel, the link has completely disappeared into the dark footer. Zoe wrote `color: initial`, assuming it would reset the link to a readable state. Instead, the CSS specification defines the initial value for `color` as pure black (`#000000`)—so against the dark slate background, the text is completely swallowed. In the right panel, switching to `color: inherit` tells the link to stop asking the specification and simply copy the white color from the footer container, making it immediately readable."*
   - Three Rules of Diagram Prose: (1) Never repeat eyeball commands ("Look at", "Notice the arrow"); (2) Describe the layout drama, not the SVG drawing; (3) Connect code directly to consequence.

2. **Lexical Baptism Before Visual Debut:**
   - NO technical term, metaphor, or industry slang may debut inside a diagram badge, callout, or label without prior introduction.
   - If a word appears on a graphic, the reader must have already met it, seen it defined in plain English, and understood why it exists in the paragraph directly preceding the figure.
   - ❌ **DO NOT DO THIS (Missing or backward definition):** Putting `✕ 1D flex line stretches orphan card` on a diagram badge while the prose only says *"When a card wraps alone onto the last row without enough siblings to fill the row, it becomes an orphan card."*
   - ✅ **DO THIS (Intuitive, forward, step-by-step baptism):** *"When multiple children (siblings) fill a row, sometimes one card needs to be left alone in the next row. This is called an **orphan card**, and it fills the last row. Because flexbox only looks at one line at a time, that single orphan card stretches across the entire screen."*

3. **Cause-and-Effect Narrative Progression (The Physical Wall):**
   - Every mechanism must progress naturally: (1) The physical symptom on screen $\to$ (2) The naive quick-fix that fails $\to$ (3) The browser engine root cause $\to$ (4) The architectural cure $\to$ (5) Real-world edge cases.

4. **1:1 Code, Diagram, and Prose Synchronization:**
   - Every selector in the diagram must be in the code above it.
   - Every label in the diagram must be used in the prose above it.
   - Every dimension in the diagram must match the code values.

5. **Two-Tier Clarity: Parenthetical Grounding vs. Load-Bearing Primitives:**
   - **Tier 2 (Load-Bearing Primitives & Core Units):** When a lecture introduces a core unit, property, or engine primitive that drives the entire topic (e.g. `fr`, `ch`, `currentColor`, `auto-fit`, `BFC`, `stacking context`, `float`, `flow-root`, `isolation`, `containing block`):
     - **Upfront Baptism in Section 1:** The central engine primitive MUST be baptized and defined in plain English in the very first paragraph of Section 1, BEFORE any code block, figure, or spec quote appears! Preemptively baptize acronyms (e.g. `Block Formatting Context (BFC)`) before code comments or diagram badges use them. Never drop primitives as unexplained passing words.
     - **Four-Pillar Architectural Breakdown in Section 2:** **A parenthetical is strictly banned as a cop-out**. Every load-bearing primitive MUST receive a dedicated pedagogical breakdown with four pillars: (1) *Technical Nomenclature & Syntax Decoding* (what the letters or keywords literally stand for in W3C specs; **strictly ban Latin/Greek etymology lookups on everyday English words like `context`, `fixed`, `relative`, `collapse`, `inherit`**), (2) *Tactile Everyday Physical Analogy* (e.g. `fr` as shares of a pie: $1 + 2 + 1 = 4$ slices), (3) *The "Why We Suffered Before" Contrast* (why `33.333% + 20px gap` broke the layout), and (4) *The Physical Browser Routine* (the smart baker who carves out fixed costs and gaps *before* slicing the pie).

6. **The Concrete Physical Anchor Law (Anti-Word-Salad Law):**
   - Never explain technical jargon by introducing more technical jargon or abstract CS structures (e.g. "encapsulated shadow DOM trees"). Always anchor every abstract concept to a tangible physical HTML element or widget on the screen (e.g. an embedded `<video-player>` tag with a play button fighting outer page styles).

7. **The "Three-Floor Elevator" Law (HTML First, Notation Second, Engine Third):**
   - Always trace the sequence: Floor 1 HTML Reality (the physical tags and markup) $\to$ Floor 2 CSS Notation (decoding the selector and punctuation) $\to$ Floor 3 Browser Engine Consequence (how specificity and cascade resolve). Never jump to CSS notation or engine rules without first establishing the HTML target.

8. **The "First-Time Baptism" Law (Character-Level Syntax Decoding):**
   - In early lectures, decode punctuation marks from zero prior knowledge: dot (`.`) means *"match class attribute"*, hash (`#`) means *"match id attribute"*, colon (`:`) means *"match temporary state"*. Ban developer slang (e.g. "bare tag", "pill", "bubble") unless explicitly dissected from first principles.

9. **The "Target & Arrow" Principle:**
   - Every selector is an arrow shot at an HTML target. Never discuss an arrow without showing the HTML markup it targets.

10. **The "Physical Body First" Law (The .docx Principle):**
    - Always introduce any concept by its practical physical body (what file it lives in, what literal characters and brackets you type in your editor, what Chrome DevTools physically displays on screen) rather than its abstract ontological spirit. Never drop detached, fantastical, or industrial analogies (factory floors, vacuum tubes, photocopiers, time machines). Ground every mental model in the developer's actual editor and browser DevTools.

11. **The "Invisible Scaffolding" Law:**
    - Internal authoring frameworks, rule names, and pedagogical scaffolding (such as *"The Three-Floor Elevator"*, *"Floor 1/2/3"*, *"The Four Pillars"*, *"Pillar 1/2/3/4"*) are STRICTLY INTERNAL AUTHORING BLUEPRINTS. They must NEVER be named, cited, or exposed to the student in headings, callouts, or prose. The student experience must be 100% natural, authoritative, and seamless.

12. **UI Visualizations of CSS (Whenever It Clarifies or Distinguishes Behavior):**
    - Every time it helps to distinguish or clarify things, fill the lecture with UI visualizations of the CSS provided in the code.
    - There are no arbitrary numerical quotas (never impose rigid counts like "2 to 4")—visualize whenever visual representation clarifies or distinguishes behavior.
    - Visualizations do not always need to be in parallel comparisons (wrong vs right); single-scene visualizations (`layout="single"`) or direct UI renderings of the CSS in code are fully supported and encouraged whenever visual representation aids comprehension.
    - Every selector, element, and dimension in the figure must strictly synchronize 1:1 with the code snippet directly preceding it.

13. **The Preemptive Nomenclature & Pearls of Wisdom Law (`> [!WISDOM]`):**
    - In professional engineering, real-world stylesheets and markup employ industry conventions (such as marking status tags as `<span class="badge">`, wrapping components in layout wrappers, or chaining utility modifiers) that frequently contradict a beginner's naive visual intuition (for example: *"This looks like a button to my eyes; why is it coded as a span and named badge?"*). Whenever practical examples feature such industry customs, you MUST insert a preemptive `> [!WISDOM]` callout placed immediately BEFORE the code and markup breakdown.
    - Preemptively demystify the nomenclature, design system customs (Bootstrap, Tailwind, design tokens, component libraries), and experiential engineering practices that explain the philosophy of the upcoming practical code. By deconfusing the visual versus semantic illusion beforehand, the student's cognitive bandwidth is preserved 100% for the core CSS engine mechanism being taught.
    - The Three Mandatory Pillars of a Wisdom Callout: (1) *Nomenclature and Etymology:* Explain why the element, class, or selector is named this way in professional practice (distinguishing non-interactive semantic metadata from actionable controls); (2) *Ecosystem Customs:* Explain how production design systems and UI frameworks structure and categorize these patterns in the real world; (3) *The Practice of Experience (Deconfusing the Visual Illusion):* Acknowledge what the student's eyes see (e.g., bold background, rounded corners, padding looking like an actionable button) versus what the semantic reality is (a non-interactive phrasing label), explaining why specific CSS layout properties (like `display: inline-block`) are necessary to bridge the gap.
14. **The Cognitive Accessibility & B2 Language Law (The "Headache & Short Attention Span" Standard):**
    - **Target Reader:** Address a developer with a splitting headache and a short attention span. Keep working memory load to an absolute minimum. If a sentence requires re-reading to parse its grammatical structure, it is defective.
    - **Sentence & Paragraph Ceilings:** Sentences target an average of 12 to 18 words (rarely exceeding 22 words). Paragraphs are strictly 2 to 4 sentences, providing generous whitespace and visual breathing room.
    - **CEFR B2 English:** Use clear, straightforward vocabulary. Ban purple prose, elevated Latinate abstractions, and passive academic phrasing.
    - **Strict Zero-Degradation Gate (No Dumbing Down):** The candidate will be asked the exact same demanding interview questions as any senior web developer. Technical rigor, architectural edge cases, and browser engine mechanics must be taught with 100% precision and authority.
    - **Mandatory Bold Baptism of New Terms:** In key paragraphs where new terms, keywords, concepts, or primitives are first baptized and introduced, **they MUST be formatted in bold (`**term**`)** to provide instant visual scanning anchors for tired readers.
    - **Iterative Chapter Versioning:** The active chapter is always `{n}.md` (and builds to `{n}.html`, `{n}.pdf`). When revising or iterating on a chapter, prior iterations are archived under `{n}-old-01`, `{n}-old-02`, etc., appending to the old numbering sequence.

## Build and gates

- **Mandatory Operational Audit Checklist:** Before marking any lecture authored, audited, or revised, run through every item in [`AUDIT-CHECKLIST.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/css-01/AUDIT-CHECKLIST.md). An **AUDIT** requires full inspection against all gates followed immediately by executing all necessary fixes.

From this folder run `node src/build-lectures.mjs` (add `--no-pdf` to skip Prince). The combined reader is written as `md-lectures-html/deck.html`, and its PDF is always named with the question range it contains, in the `CSS Q01-Q03.pdf` style, computed from the first and last lecture present; the build removes any previous range's deck PDF so the folder never carries two readers. Read the log: a `warn` line is a format violation you must fix in the source and rebuild; a `note` line is something the build already repaired and is safe to leave. The mechanical gate is zero warnings. The build enforces: the title and question line shapes, the presence of a callout, the mandatory figure panel, the section lead-in rule, the quoting law's citation path, the Summary section and its non-filler opening, and the closing table's exact shape including the long-code-string split rule.

When the build log is clean, the lecture is mechanically done. The eight-gate human check is the AUTHOR-BRIEF's final read: ladder laws, one thing, naive alternative raised, quote verbatim and cited, figure serves the mechanism, code runs, summary is streetwise, table closes.

### Mandatory Visual Quality Gate: UI Image Verification Gate

Zero build warnings from Prince and `build-lectures.mjs` is only the mechanical syntax gate. Take screenshots (via `pdftoppm -png -r 150 -f <page> -l <page> md-lectures-pdf/{n}.pdf md-lectures-pdf/audit-page<page>-{n}`) **after creating or modifying every UI image / figure canvas mode (in `src/css-figure.mjs`), and ONLY in this case, OR if there is a serious grounded suspicion of a visual error**. 

STRICT NEGATIVE INSTRUCTION: Do NOT run routine screenshot audits when merely authoring, editing, or auditing lecture text or markdown prose without modifying canvas modes or without grounded suspicion of visual defects.

When visually auditing a UI image, verify:
1. **Visual Centering**: Header verdict pills, labels, and tags on top must be visually and mathematically centered horizontally over the primary diagram elements.
2. **Clean Typography & Zero Border Overlaps**: Zero letters walking over dashed or solid borders, zero text collision, and $\ge 8\text{px}$ breathing room.
3. **Natural Label Blending**: Labels must blend cleanly and directly into the pastel fill of the area they label without adding fake inner white cards or extra borders that create visual friction or look like extra margins to calculate.
4. **Interrupted Lines for Over-Line Labels**: Any label positioned over or across a line must cleanly interrupt the line with horizontal clearance: `---------  label  ---------`.
5. **Border Distinction & High Contrast**: Adjoining or overlapping regions must have distinct hues/opacities and clear border demarcation.
6. **Code-Figure Synchronization**: Every selector, element, and property shown in the diagram must be explicitly declared in the code snippet directly above it.
7. **Legible Typography Floor ($\ge 11.5\text{px}$ / Ban on Micro-Print)**: Micro-print ($7\text{px}$ to $9\text{px}$) is strictly banned. All text, dimensions, and badges must be $\ge 11.5\text{px}$ (with primary element text at $12.5\text{px}$ to $14\text{px}$) for guaranteed print and screen legibility.
8. **Directly Anchored Tooltips (No Floating Trajectory Lines)**: Inspector tooltips and diagnostic cards must sit directly adjacent to the element they evaluate with centered pointer notches (`▲` or `▼`) touching the element boundary. Diagonal dotted trajectory lines and floating dots slicing through graphics are strictly banned.
9. **UI vs. Diagnostic Disambiguation**: Rendered webpage UI components (buttons, dropdowns, status cards, tooltips) and browser diagnostic overlays (DevTools element pills, coordinate origin badges, inspector tags) must NEVER share identical visual styling, background hues, or shapes. Never stack two identical-looking dark floating boxes that resemble competing tooltips. Diagnostic tools must be instantly recognizable as browser chrome/overlays (e.g. translucent cyan element highlight with an authentic compact DevTools dimension pill `div.tooltip | 120 × 24`, or a distinct high-contrast inspector pill), completely separate from the rendered page content.
10. **Spatial Boundary Enclosure Fidelity**: Container perimeters (containing blocks, BFC boundaries, flex/grid containers, wrapper cards) must physically and accurately enclose the exact child elements that are nested inside them in the preceding HTML markup. If an outer `.share-card` wraps both `<button>` and `.tooltip` in HTML, its visual containing block frame must physically enclose both elements, rather than drawing a misleading outline around only one child.
11. **Pedagogical Signal-to-Noise Floor (Anti-Clutter Principle)**: Every figure has ONE primary visual mechanism. Diagnostic props (DevTools pills, dashed perimeters, warning badges, pointer notches) must support the primary mechanism without overwhelming the canvas. Maximum of one primary diagnostic callout per subject. Cascading chains of multiple stacked pointer notches (such as an inspector notch pointing to a tooltip notch pointing to a button) are strictly prohibited.

