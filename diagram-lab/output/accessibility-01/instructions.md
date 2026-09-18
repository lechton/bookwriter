# Accessibility and Web Performance Lecture Series: Project Instructions

This document is the single source of truth for the workflow of the `accessibility-01` project inside `diagram-lab/output/`. Every question in the bank is taught as one long-form lecture: the lecture is the source of truth for depth, written first, built into HTML and PDF by the scripts in `src/`. The topic is interview readiness for Web Accessibility and Web Performance: standards (WCAG, ARIA, HTML), developer practice (MDN, web.dev, Chrome, V8, Node), measurement (Core Web Vitals, Lighthouse, real-user data), and the supporting book corpus.

## File structure and logic

```
accessibility-01/
├── instructions.md        <- this file, the project's law
├── AUTHOR-BRIEF.md        <- the compact per-lecture brief you paste into a writing model
├── md-lectures/           <- THE SOURCE OF TRUTH: one lecture markdown per question, written first
├── md-lectures-html/      <- build output: {n}.html plus deck.html (course reader); never edit by hand
├── md-lectures-pdf/       <- build output rendered by Prince; never edit by hand
└── src/
    ├── build-lectures.mjs <- reads md-lectures/, writes the html and pdf folders
    ├── a11y-canvas.mjs    <- parses ```canvas blocks into the Accessibility Canvas panel
    └── lecture.css        <- the long-form article stylesheet shared by html and pdf
```

➔ md-lectures: the comprehensive lecture source markdown files, the source of truth.
❯ md-lectures-html: the html files of the lectures, from the md files (`/md-lectures`).
❯ md-lectures-pdf: the pdf files of the lectures, from the html files, from the md files.

When the user asks "write the lecture for question 09" you start from `md-lectures/09.md` and the matching row in the question bank. There is no plan phase and no approval gate: the question bank row is the plan. The Question column fixes the topic, the Hook column is the seed of the opening scenario, the Topic tag fixes the scope. Read the row, then write the lecture directly.

## The question bank

- **Location:** `../../questions-accessibility/questions.md`, with the controlled topic vocabulary in `../../questions-accessibility/topics.md` and the design rationale in `../../questions-accessibility/README.md`.
- **Format:** every question is a row with five columns: `# | Tier | Topic | Question | Hook`. The number is the stable ID and the lecture filename. The Tier is `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`. The Question is written in interview register and becomes the `> INTERVIEW QUESTION` line of the lecture. The Hook is the pain-point seed of the Opening Ladder: grow it, never replace it.
- **Bank growth:** the bank grows in tranches from audits of the local corpus (see Sources of truth). Never invent a lecture without a bank row; if a topic is missing, add the row to the bank first, then write the lecture.

## Sources of truth

- **The corpus:** `documentation official/accessibility-performance/` is the local research corpus. Its handout is `README.md` there: read it before writing any lecture, because it defines what each of the 19 repositories and 5 books is authoritative for, with exact upstream links. The path-level map is `resources/INDEX.md`; the book inventory is `books/INDEX.md`.
- **Authority hierarchy when sources disagree:** W3C and WHATWG standards first (WCAG, ARIA, HTML), then official documentation (MDN, web.dev, Chrome, V8, Node), then books, then real-world data (Web Almanac). Community sites and the interview handbook are never technical authority.
- **Primary anchoring:** every lecture anchors its central technical claims to the corpus. WCAG criteria come from `resources/accessibility/wcag/guidelines/` and `understanding/`; component patterns from `resources/accessibility/aria-practices/content/patterns/`; accessible name computation from `resources/accessibility/aria/accname/`; keyboard and manual testing from `resources/accessibility/wai/pages/`; automated testing limits from `resources/accessibility/axe-core/doc/rule-descriptions.md`; Core Web Vitals thresholds from `resources/web-performance/web-vitals/`; rendering and loading from `resources/web-performance/mdn/files/en-us/web/performance/guides/` and the HTTP guides; DevTools diagnosis workflows from `resources/web-performance/developer-chrome/site/en/docs/devtools/`; engine internals from `resources/program-performance/v8.dev/`; networking from `resources/web-performance/hpbn/`.
- **Books:** quote books the same way as repositories, using the citation paths from each book's INDEX.md. Books are practical authority, never over a standard.

### The quoting law

Every lecture must contain at least one verbatim quote from an authoritative source, cited by its corpus path. The build warns when a lecture carries no citation path, and the warning is a defect you must repair.

- **Quote shape:** a markdown blockquote holding the exact words, followed by an attribution line naming the source and the citation path in backticks. For example:
```
> Web accessibility means that websites, tools, and technologies are designed and developed so that people with disabilities can use them.
*W3C WAI, Introduction to Web Accessibility, `resources/accessibility/wai/pages/fundamentals/introduction/index.md`*
```
- **Verbatim means verbatim:** copy the source's exact wording from the local file; never paraphrase inside quote marks. Decode HTML entities when quoting XHTML book files. When quoting the PDF book's extracted text, beware hyphenation and ligature artifacts; verify against the PDF when the quote must be character-perfect.
- **Normative versus informative:** quote the normative guideline text when the claim is about what a standard requires; quote Understanding documents, the APG, or books when the claim is about practice.
- **Freshness:** never call the archived web.dev snapshot or the 2019 Palani book current; the corpus README's freshness notes govern.

## The Accessibility Canvas panel

Every lecture contains at least one `canvas` panel: a generated browser-window mockup of the National Times website with accessibility annotation layers drawn on top. The panel is the project's signature visual. It is generated HTML from a fenced block, never a screenshot and never hand-authored markup.

### Architectural Modes: Full-Page vs. Minimal Component Comparison

The canvas operates in two distinct modes depending on the scope of the mechanism:
1. **Full-Page Canvas (Architecture & Flow):** Used for site-wide structural audits such as Landmark Architecture (Q08), Navigation Skip Links (Q09), and 400% Zoom Reflow (Q15). Includes page chrome (masthead, navigation, story cards, footer).
2. **Minimal Component Comparison Canvas (`layout="compare"`):** The primary pedagogical format for specific interactive mechanisms, control behaviors, states, and CSS/HTML attributes.

### The Minimal Comparison Ground Rules

When authoring component comparisons, strictly enforce these core rules:
- **Minimal Buckets of Information:** Present at most two elements per comparison canvas: exactly one flawed element (`wrong="..."`) and one accessible element (`right="..."`). Strip away all extraneous chrome (masthead, navigation links, editorial copy, footers) so the reader's attention is laser-focused on the targeted contrast.
- **Flexible Width Budget:** Default to `width="2/3"` (~660px centered) for comparisons. Full width (`100%`) is often excessive for 2-element comparisons; 2/3 width conserves vertical page budget, prevents bloated components, and harmonizes with the text column. Use `width="half"` for compact toggles or icon buttons; reserve `width="full"` strictly for wide data grids or full-page layouts.
- **Removal of the Dark Console Strip:** The dark terminal console strip at the bottom of the canvas is completely eliminated. Statuses, screen reader announcements, and verdicts live cleanly on the elements themselves via centered top tags (`WRONG: ...` / `RIGHT: ...`) and bottom status note chips (`note="..."`).
- **Dark Surface Simulation (`surface="dark"`):** When testing contrast or focus visibility against dark backgrounds (e.g. dark navy footers, cards, or hero banners), set `surface="dark"`. This renders a dark navy page (`#090d16`) with dark slate cards (`#0f172a`), ensuring that low-contrast failures (e.g. a dark ring on dark slate yielding 1.1:1 ratio) realistically blend into the background rather than accidentally showing high contrast on an unintended white card.
- **Tight Control Attachment & Visualizing Invisible States:**
  - Focus rings, ghost rings, and badges attach tightly to the interactive control itself (`.ui-control-wrapper`), never snapping to the outer container card.
  - **Emphasizing Invisible States:** When focus is present but visually stripped (`outline: none`), use `ghost` (`.meta-ghost-outline` dashed red perimeter + `✕ 0px` badge) so the reader clearly sees that the element holds focus while the indicator is wiped out.
  - **Passing States:** Bold 3px focus ring, numbered focus badge, and status note chip (e.g. `✓ 3px solid ring + 2px offset`).
- **Speech Bubble Hierarchy & Natural Flow:** Assistive tooltips and Screen Reader announcement bubbles (`sr="..."`) sit directly **below** the interactive control with a centered upward pointer (`▲`) directed at the control, followed by the evaluation note chip (`note="..."`) at the bottom. Never place tooltips above or over the control.
- **Suppression of Numbered Focus Badges:** In `layout="compare"`, the numbered blue circle badge `(1)` is strictly suppressed because compare items represent alternate implementations rather than sequential keyboard tab stops.
- **Page 2 Fit Budget:** In Section 1, introductory prose must be strictly 2–3 concise sentences (3–4 lines) and code snippets strictly 2–4 lines without mid-line wrapping, ensuring Heading, Lead-in, Code Editor, and 2/3 Compare Canvas fit together on Page 2 with zero awkward page splits.

### Authoring syntax

A `canvas` fenced block contains one instruction per line. Attributes on the fence tag control geometry and environment: ` ```canvas title="..." width="2/3" layout="compare" surface="dark" `. Element lines have the shape `type | content | annotations`. Annotation values that contain spaces are quoted.

Element types: `skip` (skip link), `masthead` (newspaper nameplate), `nav` (links separated by `;`), `h1` `h2` `h3` (headings; the panel adds the level chip automatically), `text` (paragraph), `image` (picture placeholder; pair with `alt=`), `button`, `link`, `input` (pair with `label=` or `unlabelled`), `select`, `dialog` (modal card), `list` (items separated by `;`), `card` (story card), `footer`, `region` (generic labelled block).

Annotations on elements: `focus=1` (blue focus ring plus numbered tab badge; bare `focus` numbers itself in reading order), `ghost` (dashed red ghost outline plus `✕ 0px` badge for stripped focus indicators), `landmark=banner` (dashed outline plus region tag), `sr="Subscribe, button"` (screen reader announcement chip), `label="Email address"` and `placeholder="you@example.com"` (form fields), `alt="..."` or `alt=missing` (images), `aria=expanded=false` (ARIA state chip), `contrast=4.54:1` or `contrast=2.9:1 fail` (contrast chip), `kbd=Tab` (keycap), `wrong="..."` and `right="..."` (verdict tags for failing and passing variants), `note="..."` (status chip centered below the element, e.g. `note="✕ 0px outline (user blinded)"`), `style="..."` (custom inline CSS for testing exact properties), `sr-only` (ghost styling for visually hidden content).

Chrome and standalone lines: `url=www.nationaltimes.com/subscribe` (the address bar), `zoom=200%` (a zoom badge for reflow lessons).

### Worked examples

**1. Minimal 2-Element Comparison (Focus Indicator Contrast):**
````
```canvas title="Article Action Toolbar: Invisible Focus vs Visible Focus Ring" width="2/3" layout="compare"
button | Share Report | wrong="outline: none" | ghost | note="✕ 0px outline (user blinded)" | style="background:#ffffff;color:#1e293b;border:1px solid #cbd5e1;"
button | Bookmark Story | right="3px focus ring" | focus=1 | note="✓ 3px solid ring + 2px offset" | style="background:#ffffff;color:#1e293b;border:1px solid #cbd5e1;"
```
````

**2. Dark Surface Simulation (WCAG 1.4.11 Contrast):**
````
```canvas title="Dark Surface Contrast: Single Outline vs Dual Halo" width="2/3" layout="compare" surface="dark"
button | Single Ring | wrong="low contrast" | note="✕ 1.1:1 ratio · Fails WCAG" | style="background:#0f172a;color:#f8fafc;border:1px solid #334155;outline:2px solid #1e293b;outline-offset:2px;"
button | Dual Halo | right="dual halo passes" | note="✓ 3:1+ ratio · Passes WCAG" | style="background:#0f172a;color:#f8fafc;border:1px solid #334155;outline:2px solid #ffffff;box-shadow:0 0 0 3px #0284c7;outline-offset:2px;"
```
````

### Panel discipline and pertinence

The panel is a designed model of a real site, so hold it to a designer's standard: real content from the National Times world (real headlines, real prices, real button labels), never filler like "lorem" or "example text". Every annotation must serve the lecture's one mechanism: a lecture about labels shows label and unlabelled states side by side; it does not decorate unrelated elements with every chip. Computed values in fills and chips must trace to the lecture's own code and numbers. The canvas shows what the user or the assistive technology perceives; the code fence that precedes it shows what the developer writes; never duplicate one in the other.

### The Canvas Diversity Law and Archetype Matrix

To ensure visual diversity, pedagogical pertinence, and prevent recurring architectural monotony, every canvas panel is governed by strict mechanical constraints:

1. **The Six UI Archetypes:** Every canvas belongs to one of six distinct archetypes:
   - **Editorial / Article Reader:** Headlines, bylines, pull-quotes, typography, inline links, and footnote glossaries (e.g. `/investigations/transit-crisis`, `/world/tokyo-dispatch`).
   - **Media Dispatch / Player:** Audio player bars, video players, scrubber tracks, transcript toggle buttons, and closed captions (e.g. `/media/daily-podcast`).
   - **Navigation / Menu System:** Mega-menu dropdowns, breadcrumb trails, mobile hamburger drawers, and skip links (e.g. `/frontpage` focused state).
   - **Modal / Overlay / Dialog:** Paywall banners, cookie consent dialogs, newsletter overlays, and focus trap boundaries (e.g. `/subscribe` paywall).
   - **Data Visualization / Card Grid:** Election results, market tickers, archive search results cards, and zoomed reflow layouts (e.g. `/archives/search-results`).
   - **Interactive Widget / Component:** Accordion FAQs, tabbed category filters, segmented switches, and interactive timelines (e.g. `/dossier/interactive-timeline`).

2. **The Negative Constraint (Ban on Default Forms):** Unless the question is explicitly from the Forms and Labels module (Q18 `#forms` or Q19 `#labels`), the UI canvas panel **must never default to a generic text input paired with a submit button.** Choosing an input form to demonstrate general principles like POUR, Conformance Levels, or Semantics is a severe structural defect.

3. **The Two-Lecture Distance Rule:** No two consecutive lectures may share the same UI archetype. If Lecture N uses an Editorial layout, Lecture N+1 cannot use an Editorial layout.

4. **The Core Tranche Canvas Blueprint:** The authoring pipeline strictly adheres to this predetermined matrix for the Core accessibility tranche (Q1 to Q17):
   - **Q01 (`#what_is_accessibility`):** Modal / Overlay | `/subscribe` paywall checkout | Unlabelled credit card field, screen reader silence.
   - **Q02 (`#pour`):** Editorial + Media | `/investigations/transit-crisis` | Missing image alt, un-tabbable audio div, failing contrast.
   - **Q03 (`#wcag_levels`):** Card Grid / Reflow | `/archives/search-results` (`zoom=200%`) | Results card grid overflowing at 200% zoom (AA reflow fail) vs baseline semantic links (A pass).
   - **Q04 (`#semantics`):** Interactive Widget | `/dossier/interactive-timeline` | Div-soup fake button (`<div onclick>`) vs native button with focus ring and keyboard space/enter.
   - **Q05 (`#native_vs_aria`):** Interactive Widget | `/search/filter-tabs` | Category filter spammed with redundant `role="tab"` on native buttons vs clean semantic elements.
   - **Q06 (`#page_structure`):** Editorial / Article | `/world/tokyo-dispatch` | Missing `lang="ja"` attribute causing English screen reader pronunciation errors.
   - **Q07 (`#headings`):** Editorial / Outline | `/politics/election-special` | Heading outline jumping from `<h1>` directly to `<h4>`, breaking screen reader document navigation.
   - **Q08 (`#landmarks`):** Full Page Layout | `/frontpage` | Complete landmark regions (`banner`, `main`, `complementary`, `contentinfo`) with tab skips.
   - **Q09 (`#skip_links`):** Navigation Menu | `/frontpage` | 40-item navigation bar with a visible `:focus` Skip to Content link.
   - **Q10 (`#lists`):** Card Grid / Feed | `/markets/live-feed` | Unsemantic div stream vs structured `<ul>` list announcing total item counts.
   - **Q11 (`#alt_text`):** Editorial / Article | `/investigations/flooded-bridge` | Photo essay hero with descriptive alt text vs raw camera file name.
   - **Q12 (`#images`):** Data Visualization | `/graphics/budget-breakdown` | Complex inline SVG chart with accessible title and description vs silent graphic.
   - **Q13 (`#links`):** Editorial / Article | `/opinion/civic-reform` | Standalone "Click here" link ambiguity vs contextual anchor text and action buttons.
   - **Q14 (`#color_contrast`):** Media Dispatch | `/live/city-council-hearing` | Redesigned muted gray-on-gray captions and status badges failing 4.5:1 ratio.
   - **Q15 (`#zoom_reflow`):** Card Grid / Reflow | `/opinion/editorial-board` (`zoom=400%`) | Two-dimensional horizontal scrolling overflow at 320px vs responsive reflow.
   - **Q16 (`#motion`):** Interactive Widget | `/interactive/weather-radar` | Rapid looping autoplay animation without `prefers-reduced-motion` toggle.
   - **Q17 (`#touch_targets`):** Mobile Drawer | `/mobile/reading-controls` | Tiny 20px close link colliding with adjacent font-size buttons failing 24x24px target size.

## Writing one lecture

### Skeleton, in this order

1. Line 1, exactly: `# Lecture {n}: {Short Title}`
2. Line 2, exactly: `> INTERVIEW QUESTION | {tier} | {question text copied verbatim from the bank row}`
3. Blank line, then the Opening Ladder: 5 to 7 numbered beats that open the body, in this order: the scene, the moment of failure or surprise, the question (a clear, direct sentence stating the visible conflict), the danger, the mystery, the promise. No sentence over 20 words and no em-dashes. Never name the lecture's mechanism term in the ladder; the term is earned in the body. Each beat makes sense read alone. The build generates the "Imagine this scenario:" lead; never write it yourself.
4. Right after the ladder comes the first `### ` section: a catchy title naming the chapter's idea, then prose opening the teaching.
5. Body sections with `### ` headings only. `## ` forces a PDF page break; save it for audit or reference sections at the end. Every technical section follows the **Harmonious Code + UI Step Rhythm**:
   (a) **Mandatory Introductory Prose:** Every `### ` heading MUST open with 2–3 sentences of conceptual framing. **Hard layout rule:** Never start a section immediately with a code block or canvas, as floated marginalia headings (`h3`) collide with breakout blocks in PDF layout.
   (b) **Minimal Code Snippet:** Precedes the UI canvas every single time under the section, presenting the minimal code contrast with end-of-line comments (e.g. `<!-- **WRONG:** ... -->` vs `<!-- **RIGHT:** ... -->`). Never put comments on their own line inside code blocks; separate-line `**DO NOT DO THIS:**` and `**DO THIS:**` leads belong strictly above summary mini-fences.
   (c) **Minimal UI Canvas:** Immediately follows the code snippet, rendering the visual consequence (using `width="2/3"` and `layout="compare"` for 2-element comparisons).
   (d) **Analytical Derivation:** Directly follows the canvas, breaking down the perceptual and technical contrast, accompanied by authoritative verbatim quotes from W3C/WCAG standards at the defining moment.
   (e) For multi-step lessons, repeat this step-by-step pairing under sequential sections: `[Section Text -> Code Snippet -> UI Canvas -> Derivation]` $\to$ `[Section Text -> Code Snippet -> UI Canvas -> Derivation]`. Always explain before or after the code and UI.
6. At least one `> [!TIP]` callout with a `**To impress the interviewer:**` lead, placed at the moment the tip matters. Use `> [!KEY]` for one-line insider takeaways.
7. Right before the Summary, a `### Where you will meet this` section: 3 to 5 one-line uses of today's concept in real apps the reader knows; each line is one pictureable moment plus what the concept does there.
8. A `### Glossary` section positioned directly after `### Where you will meet this` and immediately before `### Summary`: 4 to 6 core terms introduced or reinforced in the lecture. Each term is a single bullet line formatted as `- **Term**: Plain-English definition explaining the concept and its practical engineering role.` No em-dashes and no hard-wrapping.
9. Close with `### Summary` written as a Streetwise Review from an experienced developer's daily perspective.

### The Opening Ladder laws

- Single actor throughout: one person with one unambiguous role (a subscriber, a journalist, a checkout visitor); never rotate synonyms for the actor.
- Every noun is exactly one thing: a person, a thing visible on the screen, a thing in the code, or a machine event. Never a bare overloaded word: "live" (say "the site is open in the reader's browser right now"), "focus" before it is taught (say "the blue ring that shows where the keyboard is"), "landmark", "aria", "alt" (say "the image description text"). Write the visible behavior instead of the term.
- The beat that sets up the scenario must directly expose the contradiction between what the site was told to do and what the screen or the reader actually experiences.
- The last beat promises, never explains: promise what today brings in plain words; the answer belongs to the body's first section.
- Scenario clarity is absolute: write for a tired B2 English reader with a headache. The ladder is the clearest part of the whole lecture.

### Code fences

- Fences are ` ```html title="index.html" `, ` ```svelte title="SubscribeForm.svelte" `, ` ```css title="styles.css" `, ` ```javascript title="app.js" `. Real, runnable examples in the National Times world, kept under about 80 characters per line; every line renders as a numbered row, blank lines included, so keep fences dense.
- Plain HTML fences are the default: semantic markup, ARIA attributes, and loading attributes ARE the topic. Reach for a Svelte 5 fence when component logic carries the mechanism (focus management in an action, a dialog's state, an event handler, runes like `$state` and `$effect`); the highlighter colors runes automatically. A Svelte fence must still be honest Svelte 5: runes, not stores; `onclick`, not `on:click`.
- Comments live at the END of the code line as `code; // annotation` (or `<!-- annotation -->` in HTML, or `/* annotation */` in CSS), never on their own line. Lead verdicts with `**RIGHT:**` and `**WRONG:**` and put one caps load-bearing word in `**bold**`. Never write check or cross emoji; the build strips them and the summary's side-panel icons come from the fence language tag instead.

### Glossary shape

- Section heading is exactly `### Glossary`, positioned directly after `### Where you will meet this` and immediately before `### Summary`.
- Contains 4 to 6 core terms introduced or reinforced in the lecture.
- Each term is an unnested bullet on a single continuous line (no hard-wrapping) formatted as: `- **Term**: Clear, concise definition in plain English explaining the concept and its concrete role in code or user experience.`
- Never use em-dashes (`—` or `--`); always separate the bold term and definition with a colon.
- Anchor definitions in observable engineering and assistive technology behavior rather than abstract dictionary definitions.

### Summary shape

- Lead the summary body with an authoritative `**Technical Title**` in bold on its own line, followed by an empty line before the opening paragraph. Open directly with the developer frequency, architectural role, or consequence; never with conversational filler like "Look,".
- Use `❒ {Subtitle}` section headers.
- Under each subtitle, use numbered points with indented sub-lines formatted with `<br>&nbsp;&nbsp;&nbsp;&nbsp;` so they stay on one continuous line without hard-wrapping.
- For right and wrong examples in the summary, DO NOT put comments inside the code block. Add `right` or `wrong` directly to the fence language tag (` ```html right ` or ` ```html wrong `), and put the instruction on the line exactly above the block using flush-left bold text without emojis: `**DO THIS:** {instruction}` or `**DO NOT DO THIS:** {instruction}`.
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
- **The Transposition Law:** When comparing three or more entities (such as the four POUR principles, three WCAG conformance levels A/AA/AAA, or multiple cache directives), NEVER make the entities into separate columns. Instead, transpose the table: place the entities as the **rows** (starting each row with a bold dimension in column 1), and use the two table columns for the analytical axes (such as `**PRIMARY BARRIER**<br>(symptom)` and `**ENGINEERING FIX**<br>(mechanism)`).
- **Code splitting:** PDF table columns are narrow, so separate prose from code with `<br>` and manually wrap multi-part code across separate backticks with `<br>` between them (for example `` `<button>`<br>`type="submit"` ``). Never put `<br>` inside backticks. Table strings longer than about 20 characters inside one pair of backticks draw a build warning: split them.

## Hard format rules

- One continuous line per paragraph, bullet, and table row. Never hard-wrap.
- No em-dashes anywhere in the lecture.
- Keep every technical term, and immediately define it in plain English in the same sentence.
- Define through experience, never only through other words: start every new concept from what the reader has already done or seen in this course; define it as that known thing plus one change, and teach only the change.
- Build the lecture around the one thing: every concept reduces to one visible change, one attribute added, one element replaced, one panel annotation. Find it, show it early and alone, center the lecture on it.
- Raise the strongest naive alternative first: the first "how else could we do this?" must be the one a working developer would actually reach for (why not just a placeholder? why not just aria-label everywhere? why not just Lighthouse?). Answer it before any weaker strawman.
- Search the deck before baptizing a term: grep `md-lectures/` for the concept first; if an earlier lecture taught it, re-anchor with a one-line reminder plus `(see Lecture N)` and deepen.
- Organic Lexical Audit: introduce every new term from a visceral, high-stakes moment where the newbie physically hits a wall without it (the renamed ID that silently breaks the update, the purchase the keyboard user cannot complete).
- Examples live in the National Times world: the newspaper, its subscribe flow, its story pages, its checkout, its journalists and subscribers.
- Length: 800 to 1,200 words. ADVANCED questions may reach 1,500. Do not pad; do not rush the mechanism either.

## Build and gates

From this folder run `node src/build-lectures.mjs` (add `--no-pdf` to skip Prince). The combined reader is written as `md-lectures-html/deck.html`, and its PDF is always named with the question range it contains, in the `Accessibility Q01-Q03.pdf` style, computed from the first and last lecture present; the build removes any previous range's deck PDF so the folder never carries two readers. Read the log: a `warn` line is a format violation you must fix in the source and rebuild; a `note` line is something the build already repaired and is safe to leave. The mechanical gate is zero warnings. The build enforces: the title and question line shapes, the presence of a callout, the mandatory canvas panel and its placement before the first central code fence, the quoting law's citation path, the Summary section and its non-filler opening, and the closing table's exact shape including the long-code-string split rule.

When the build log is clean, the lecture is mechanically done. The eight-gate human check is the AUTHOR-BRIEF's final read: ladder laws, one thing, naive alternative raised, quote verbatim and cited, panel serves the mechanism, code runs, summary is streetwise, table closes.
