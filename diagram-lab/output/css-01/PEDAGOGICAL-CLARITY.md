# PEDAGOGICAL CLARITY LAW — CSS Interview Lectures (css-01)

This document is the permanent teaching standard for the `css-01` lecture series. Teaching is not documenting. A specification or API reference states technical facts; a world-class lecture takes a tired developer with a headache and patiently walks their eyes and mind from visual confusion to technical mastery.

Every lecture in this series must strictly obey these pedagogical clarity laws.

---

## 1. The "Insightful Guide" Principle (Cause, Effect, and Mechanism Over SVG Pixel Inventory)

When explaining a diagram, code block, or browser preview, **never narrate the graphic designer's visual props or repeat robotic eyeball commands**. 

A human reader looking at the page can already see that there is a box, an arrow, or a badge. They do not need an audio transcript of the illustration's vector coordinates. They need to understand **what went wrong on screen, which line of code caused it, and what internal browser rule produced that visual result**.

### The "Robotic Tour Guide" Anti-Pattern (BANNED):
- ❌ **DO NOT WRITE (Robotic, repetitive eye commands):**
  > *"Look at the left panel... Look at the navigation links at the bottom... Notice the callout with an arrow pointing down... Look closely at the dashed red box... Now look at the right panel... Look at the green checkmark..."*  
  *(Why this fails: It reads like a robotic loop jerking the reader's head from coordinate to coordinate. It describes arrows and dashed lines instead of teaching CSS).*

- ❌ **DO NOT WRITE (Hyper-dense academic compression):**
  > *"In the left panel, the `.card-deck.flex` container distributes its four `.story-card` children across two lines."*

### The Insightful Senior Engineer Standard (MANDATORY):
- ✅ **DO WRITE (Cause, effect, and mechanism in natural prose):**
  > *"In the left panel, the link has completely disappeared into the dark footer. Zoe wrote `color: initial`, assuming it would reset the link to a readable state. Instead, the CSS specification defines the initial value for `color` as pure black (`#000000`)—so against the dark slate background, the text is completely swallowed. In the right panel, switching to `color: inherit` tells the link to stop asking the specification and simply copy the white color from the footer container, making it immediately readable."*

### The Three Rules of Diagram Prose:
1. **Never repeat eyeball commands:** Ban starting consecutive sentences with *"Look at..."*, *"Notice the..."*, or *"Look closely at..."*. Use natural transitions (*"In the left panel...", "By contrast, on the right...", "Notice what happens when..."*).
2. **Describe the layout drama, not the SVG drawing:** Talk about the headline breaking onto a new line, the column overflowing by 72px, or the link vanishing into the background. Never waste prose cataloging arrows, pointer triangles, dashed borders, or checkmark icons.
3. **Connect Code Directly to Consequence:** Every sentence discussing the visual failure must tie directly back to the specific CSS declaration that caused it.

---

## 2. Lexical Baptism Before Visual Debut

**No technical term, metaphor, or industry slang may debut inside a diagram badge, callout, or label.** If a word appears on a graphic, the reader must have already met it, seen it defined in plain English, and understood why it exists in the paragraph directly preceding the figure.

### Concrete Example:
- ❌ **DO NOT WRITE (Rushed, awkward, or missing baptism):**
  Prose: *"When the fourth card wraps to row 2, it finds itself as the sole resident of that flex line..."*
  Diagram badge: `✕ 1D flex line stretches orphan card`
  *(The reader sees "orphan card" on the badge and gets confused because the text never baptized the term.)*

- ❌ **DO NOT WRITE (Overly academic, backward definition):**
  > "When a card wraps alone onto the last row without enough siblings to fill the row, it becomes an orphan card."

- ✅ **DO WRITE (Visceral, intuitive, step-by-step baptism):**
  > "When multiple children (siblings) fill a row, sometimes one card needs to be left alone in the next row. This is called an **orphan card**, and it fills the last row. Because flexbox only looks at one line at a time, that single orphan card stretches across the entire screen."

---

## 3. The Physical Wall (Symptom First, Engine Second)

Always present the visible, physical catastrophe before explaining the internal browser algorithm. A developer does not care about "formatting contexts" or "lexical scope" in the abstract; they care because a button broke, text vanished into a black background, or a card suddenly expanded into an enormous banner nobody ordered.

1. **What the user sees:** The physical error on screen (e.g., "The card stretches across the entire width of the page like a giant banner ad").
2. **The naive developer reflex:** What a junior developer immediately tries (e.g., "Let us slap a hardcoded `width: 30%` on the card").
3. **Why the naive fix breaks:** The real-world consequence (e.g., "On mobile, three cards now crush into unreadable vertical slivers, and on large monitors they leave gaping holes").
4. **The browser engine truth:** Why the engine is designed this way (e.g., "Flex lines are completely blind to each other; row two has zero memory of row one").
5. **The architectural cure:** The clean, modern standard (e.g., "CSS Grid defines the column blueprint on the parent container prior to placing content").

---

## 4. No Word Count Ceilings — Comprehensive Depth (The Universal Standard: 16–32+ Pages)

The previous artificial ceilings are **permanently abolished**. Every lecture in the series must deliver the comprehensive, step-by-step depth established across the production series (Lectures 01 to 10):

- **Target Depth:** Lectures must deliver the expansive, authoritative, multi-step depth demonstrated in production: **3,000 to 4,500+ words**, naturally formatting into **16 to 32+ PDF pages**.
- **Multi-Step Rhythm:** Do not stop after a single comparison. Break complex topics into sequential, progressive steps:
  - **Step 1: The Naive Habit & Visual Defect** (The common mistake, code snippet, failure figure, and guided derivation).
  - **Step 2: The Failed Quick-Fix** (Why band-aids like `!important`, fake spacer divs, or hardcoded percentages create worse bugs).
  - **Step 3: The Engine Architectural Solution** (The standard-compliant model, clean code, winning figure, and W3C specification quote).
  - **Step 4: Production Edge Cases & Stress Testing** (Dynamic content, mixed aspect ratios, internationalization, or container resizing).
  - **Step 5: Interview Mastery & Streetwise Summary** (High-stakes interview drill, where you will meet this, comprehensive glossary, and 3-column master table).

---

## 5. Absolute Code, Figure, and Prose Synchronization

A lecture is a unified multimedia lesson. Every moving part must speak the exact same language:

1. **Every selector in the diagram must be declared in the code above it.**
   If the diagram shows `.story-card`, the code must define `.story-card`.
2. **Every label in the diagram must be used in the prose above it.**
   If the diagram badge says `orphan card`, the prose must have baptized `orphan card`.
3. **Every dimension in the diagram must match the code values.**
   If the code sets `gap: 12px`, the diagram calipers must measure `12px`.
4. **UI Image Verification Gate (Strictly Focused Visual Audits):**
   Zero build warnings is merely a mechanical syntax check. Take screenshots (via `pdftoppm -png -r 150 -f <page> -l <page> md-lectures-pdf/{n}.pdf md-lectures-pdf/audit-page<page>-{n}`) **after creating or modifying every UI image / figure canvas mode (in `src/css-figure.mjs`), and ONLY in this case, OR if there is a serious grounded suspicion of a visual error**.
   
   STRICT NEGATIVE INSTRUCTION: Do NOT run routine screenshot audits when merely authoring, editing, or auditing lecture text or markdown prose without modifying canvas modes or without grounded suspicion of visual defects.
   
   When auditing a UI image, verify:
   - **Compositional Purpose & Structural Naturalness**: Does every visual element serve a distinct structural role and occupy an organic, well-proportioned position within the layout? (Zero tacked-on artifacts, zero redundant status strips duplicating verdict pills, and balanced negative space).
   - **The Authentic UI Rule:** Does the canvas depict an authentic, pristine UI component (using the standard visual substrate like the macOS browser window or `.share-card`) rather than a conceptual abstraction (e.g., no fake 'Document Stream' boxes or instructional text posing as HTML content)?
   - **The Strict External Callouts Rule:** Are all technical diagnostics, explanations, and labels strictly separated into external callouts or distinct badges that do not masquerade as, or interfere with, the underlying UI elements?
   - **The Visual Substrate Rule:** Does this image share the exact same structural visual language (colors, framing, typography) as the rest of the chapter, or did it invent a one-off design layout just for this specific concept?
   - **Visual Centering**: Header verdict pills, labels, and tags on top must be visually and mathematically centered horizontally over primary diagram elements.
   - **Clean Typography & Zero Border Overlaps**: Zero letters walking over dashed or solid borders, zero text collision, and $\ge 8\text{px}$ breathing room.
   - **Natural Label Blending**: Labels must blend cleanly and directly into the pastel fill of the area they label without adding fake inner white cards or extra borders that create visual friction or look like extra margins to calculate.
   - **Interrupted Lines for Over-Line Labels**: Any label positioned over or across a line must cleanly interrupt the line with horizontal clearance: `---------  label  ---------`.
   - **Border Distinction & High Contrast**: Adjoining or overlapping regions must have distinct hues/opacities and clear border demarcation.
   - **Code-Figure Synchronization**: Every selector, element, and property shown in the diagram must be explicitly declared in the code snippet directly above it.

---

## 6. Two-Tier Clarity: Parenthetical Grounding vs. Load-Bearing Primitives

Teaching requires recognizing the difference between a passing conversational term and a foundational engine primitive. A quick parenthesis is helpful for a background term, but **a parenthesis is a lazy band-aid when introducing a core mechanical unit**. Every concept must be handled according to its tier:

### Tier 1: Parenthetical Grounding (Peripheral & Passing Terms)
For background concepts, umbrella terms, or incidental jargon that a learner might stumble over, **ALWAYS immediately follow the term with a parenthetical concrete definition and real-world examples**:
- ❌ **BAD (Abstract & Unclear):** `...their first instinct is rarely to switch layout models.`
- ✅ **GOOD (Parenthetically Grounded):** `...their first instinct is rarely to switch layout models (the underlying layout system governing the container, such as switching from Flexbox to CSS Grid).`
- ❌ **BAD (Vague, Fuzzy Metaphor):** `...establishes a new formatting context (an isolated rendering bubble that prevents elements from leaking).`
- ✅ **GOOD (Concrete Physical Behavior):** `...establishes a new formatting context (a self-contained layout boundary where the container is forced to stretch around its own internal floats and keep all child margins locked inside).`

**Strict Prohibition on Fuzzy Metaphors:** Never replace academic jargon with vague, poetic, or whimsical metaphors (such as *"rendering bubble"*, *"isolated universe"*, or *"magic container"*). Always explain the **literal, concrete physical behavior** of the browser.

---

#### Tier 2: The Load-Bearing Primitive Law (Upfront Baptism & Core Mechanisms)
When a lecture introduces a core unit, property, keyword, or browser mechanism that drives the entire topic (e.g., `fr`, `ch`, `currentColor`, `auto-fit` / `auto-fill`, `minmax()`, `BFC`, `stacking context`, `containing block`):

**1. Upfront Baptism in Section 1 (No "Swallowing the Camel"):**
The central CSS engine primitive that answers the interview question MUST be explicitly defined in plain, visceral English **in the very first paragraph of Section 1**, BEFORE any code block, figure, or specification quote appears!
- Never drop a core primitive casually into a sentence as if the student already knows it.
- Never use an unintroduced acronym in a code comment, badge, or caption (e.g., ban `/* **RIGHT:** BFC isolates... */` unless `Block Formatting Context (often abbreviated as BFC)` was explicitly baptized in the prose directly above it).

**2. The Four-Pillar Deep Dive (Unpacking the Engine, Not Delaying the Concept):**
A quick parenthetical like `(fr, a unit that represents a flexible share...)` is an instructional failure. In Section 2, every load-bearing primitive MUST receive a dedicated architectural breakdown containing all four pillars:

1. **Technical Nomenclature & Syntax Decoding (Strict Ban on Latin/Greek Pseudo-Etymology):** What the letters or words literally stand for in W3C specifications (`fr` = *fraction* of leftover free space; `BFC` = *Block Formatting Context*; `rem` = *root em*), or what engine coordinate reference frame the keyword selects (`relative` = offset from *its natural normal-flow position*; `fixed` = anchored to *the viewport*). **DO NOT cite Latin, Ancient Greek, or dictionary roots for everyday English words (`context`, `fixed`, `relative`, `collapse`, `inherit`, `initial`, `revert`, `static`, `block`). That is straining out a gnat while swallowing the camel.**
2. **Tactile Everyday Physical Analogy:** An intuitive mental model grounded in physical reality (e.g., thinking of `fr` as **shares of a pie** or cuts of cake: `1fr 2fr 1fr` means $1 + 2 + 1 = 4$ slices).
3. **The "Why We Suffered Before" Contrast:** The exact historical nightmare and broken hacks that preceded it (e.g., why traditional `33.333%` exploded the moment a `20px` gap was added, because $100\% + 40\text{px} > 100\%$, forcing columns onto the next line).
4. **The Physical Browser Routine (Calculation Order):** The step-by-step mechanical sequence of how the engine computes space (e.g., the "smart baker" who subtracts fixed widths and gutters *first*, and only then distributes the remaining pie according to `fr` shares).

---

## 7. The Concrete Physical Anchor Law (Anti-Word-Salad Law)

Never explain technical jargon by introducing more technical jargon or formal computer-science glossary definitions.

- ❌ **STRICTLY PROHIBITED (Word-Salad & Nested Abstraction):**
  > `This step manages isolated web components (self-contained custom elements with their own private DOM tree). When the main document and an encapsulated shadow tree clash over a boundary...`
  *(Why this fails: The reader does not know what a "DOM tree" is, let alone a "private DOM tree" or "encapsulated shadow tree". It replaces one mystery with three more abstract mysteries.)*

- ✅ **MANDATORY (Concrete Physical Anchor):**
  > `Think of an embedded <video-player> widget on a news article. Inside that widget is a small play button. If your newspaper's global CSS says button { background: green }, but the video player's internal stylesheet that wants the button black, which one wins? That is Context. The browser checks whether a style belongs to the outer page or the self-contained widget. By default, the outer page wins so you can theme the button. But if the widget's creator wrote !important inside the player, the widget defends itself and keeps its black button so your site's styles do not break its controls.`

### The Three Inviolable Anchors:
1. **The Physical Actor on Screen:** Always introduce an actual, tangible HTML element or UI component (e.g. an embedded `<video-player>` tag, a `<dialog>` modal popup, a date-picker dropdown, an article card) before explaining its engine rules.
2. **The Visual Drama / Real Stakes:** Show two competing forces fighting over a visible property (e.g. outer site CSS wants a green button vs inner widget CSS wants a black button).
3. **No CS Dictionaries in Parentheses:** When providing a parenthetical for a passing term, describe what it looks like or does in plain English (`(an independent, pre-packaged widget on the page, like a custom <video-player>)`), NEVER its internal data structure (`(a self-contained custom element with its own private DOM tree)`).

---

## 8. The "Three-Floor Elevator" Law (HTML First, Notation Second, Engine Third)

No CSS concept, selector, or rule may ever be discussed without following the Three-Floor Elevator in strict, unhurried sequence:

1. **Floor 1: The HTML Reality (What physically exists in the markup)**  
   Before mentioning a CSS property or selector, you MUST show the HTML markup on the page and dissect its physical anatomy:
   `<button class="btn-subscribe">Subscribe</button>`  
   Dissect the parts in plain English: `<button>` is the generic HTML tag (the species). `class="btn-subscribe"` is a custom name tag pinned to its chest.
2. **Floor 2: The CSS Notation (How CSS points to Floor 1)**  
   Explain the exact syntax, character prefixes, and why they exist:  
   - To style every button of that species: write `button`.  
   - To style only elements wearing that specific name tag: write a dot followed by the name: `.btn-subscribe`. (The dot `.` literally means *"match the class attribute"*).
3. **Floor 3: The Engine Consequence (How the browser resolves conflicts)**  
   *Only now* do you explain specificity or the cascade algorithm:  
   - Because a custom name tag is more specific than a generic species name, `.btn-subscribe` beats `button`.

**Mechanical Gate:** If any paragraph discusses a selector or specificity without first establishing Floor 1 (the HTML element), it is an automatic defect.

---

## 9. The "First-Time Baptism" Law (Character-Level Syntax Decoding)

In early lectures (Lectures 1 through 3), you must assume the reader has never written a line of CSS in their life. **Zero prior syntax knowledge is assumed.**

Whenever a CSS punctuation mark or selector type appears for the first time, it must be decoded at the character level:
- **The dot (`.`):** Explain that the dot is not decorative—it is the CSS command meaning *"match the HTML `class` attribute"*.
- **The hash (`#`):** Explain that the hash means *"match the HTML `id` attribute"*.
- **The colon (`:`):** Explain that the colon means *"match a temporary state (like mouse hovering)"*.
- **Parentheses inside tags:** Never mention a tag name without showing its brackets (`<button>`, not "a button tag").

**Strict Prohibition on Developer Slang:** Any informal industry shorthand—such as *"bare tag"*, *"wrapper"*, *"pill"*, *"bubble"*, or *"ratchet"*—is strictly forbidden unless explicitly dissected and defined from first principles.

---

## 10. The "Target & Arrow" Principle (Every Selector is a Pointer)

A CSS selector does not exist in a vacuum. A selector is an **arrow** shot at an **HTML target**.
- **The Rule:** You cannot discuss the arrow without showing the target.
- If you want to show why an ID beats a class, you must show the HTML element carrying both:
  `<div id="paywall" class="modal-card">...</div>`
- If you want to show why inline styles beat stylesheets, you must show the `style=""` attribute written directly inside the opening tag.

---

## 11. The "Physical Body First" Law (The .docx Principle: Practical Body Over Ontological Spirit)

There are two distinct ways to describe any concept, feature, or mechanism:
1. **Ontologically (The Spirit):** Explaining its abstract purpose, philosophical rationale, or grand conceptual architecture.
2. **Practically (The Physical Body):** Describing its literal, physical appearance, where it physically lives on your computer, what characters you type in your editor, what extension is on the file, or what you see when you open browser DevTools.

**The Inviolable Law:** The shortest, most painless path to introduce anything for the very first time is **ALWAYS via the physical body**. We must stand where the reader stands, anchor to what the reader already expects to see, and add a quick physical addition to their existing mental structure to point out the exact physical extension.

---

### Four Benchmark Examples of the "Physical Body First" Law:

#### Example 1: The Word Document (.docx)
- ❌ **DO NOT START WITH THE SPIRIT (Ontological, abstract):**  
  > *"A Word document is an instrument of human textual composition, enabling editorial collaboration, semantic structure, and formatted linguistic communication..."*  
  *(This produces instant mental fog; it tells the beginner nothing about what they are physically dealing with).*
- ✅ **ALWAYS START WITH THE PHYSICAL BODY (Practical, concrete):**  
  > *"A Word document is a file that ends with `.docx` in your folder. When you double-click it, Microsoft Word opens up, and you see white digital pages with typed text on your screen."*

#### Example 2: The "DOM Element" vs. The `<h1>` Tag
- ❌ **DO NOT START WITH THE SPIRIT (Ontological, abstract):**  
  > *"A DOM element is a programmatic node instance in an in-memory document object model tree, representing a layout primitive instantiated by the HTML parsing pipeline..."*  
  *(The beginner has no idea what a 'DOM tree' is. It explains an unknown with three more unknowns).*
- ✅ **ALWAYS START WITH THE PHYSICAL BODY (Practical, concrete):**  
  > *"Instead of talking about an abstract 'DOM element', look at the HTML tag you already know: like the `<h1>Breaking News</h1>` tag sitting at the top of your `index.html` file that physically paints a large, bold headline on your screen."*

#### Example 3: `<script type="module">`
- ❌ **DO NOT START WITH THE SPIRIT (Ontological, abstract):**  
  > *"An ES module script is an encapsulated lexical environment executing asynchronously with deferred evaluation semantics, strict-mode scoping, and static module resolution..."*  
  *(Terrifying academic jargon that paralyses the reader).*
- ✅ **ALWAYS START WITH THE PHYSICAL BODY (Practical, concrete):**  
  > *"Normally, in your HTML file you have one plain script tag: `<script src="app.js"></script>`. But this time, we add a second tag on top with an extra attribute typed inside its opening angle brackets: `<script type="module" src="app.js"></script>`. That extra word physically tells the browser to treat this file as a module rather than a legacy script."*

#### Example 4: CSS Cascade Layers (`@layer`)
- ❌ **WHAT WAS WRITTEN BEFORE (The Bloated Ontological Dissertation):**  
  > *"The keyword `@layer` comes from the metaphor of transparent acetate sheets stacked on an architect's drafting table. Each sheet represents a dedicated tier of your styling system: reset (baseline browser normalization), framework (third-party vendor code), components (design systems), and utilities. Think of `@layer` as stacking clear sheets of glass on a drafting table. When you declare `@layer reset, framework, components, utilities;`, you place the reset sheet at the bottom... whatever is drawn on the top glass sheet completely covers lower sheets regardless of pencil pressure..."*  
  *(Why this fails: It drops a multi-paragraph dissertation full of architectural concepts, acetate sheets, and vendor tiers onto a beginner who just asked what the syntax is).*
- ✅ **WHAT SHOULD HAVE BEEN WRITTEN (The Direct Physical Body):**  
  > *"In your `.css` file, you usually write rules out in the open, like `button { background: blue; }`.*  
  > *With `@layer`, you take those exact same rules and wrap them inside an extra pair of curly braces with a label name:*  
  > ```css
  > @layer my-styles {
  >   button { background: blue; }
  > }
  > ```  
  > *That named curly-bracket block tells the browser: 'treat everything inside these braces as one prioritized group.' When you inspect the element in Chrome DevTools, it physically shows `layer: my-styles` and makes your rules win over any imported third-party library without needing to fight their selectors."*

---

## 12. The "Invisible Scaffolding" Law (Internal Pedagogical Rules Must NEVER Leak into Student-Facing Text)

The pedagogical laws, frameworks, and authoring guidelines in this document (e.g., *"The Three-Floor Elevator"*, *"Floor 1/2/3"*, *"The Four Pillars"*, *"Pillar 1/2/3/4"*, *"Law 8"*, *"Law 11"*, *"Organic Lexical Audit"*, *"Guided Seeing"*) are **STRICTLY INTERNAL AUTHORING DIRECTIVES**. They are mental blueprints and checklists for the author to guarantee educational depth. They must **NEVER** be presented, named, or mentioned to the student.

- ❌ **STRICTLY PROHIBITED IN HEADINGS, LABELS, CALLOUTS, OR PROSE:**
  - Never write `"The Three-Floor Elevator"`, `"step onto the Three-Floor Elevator"`, or `"ride the three-floor elevator"`.
  - Never write `"Floor 1 (The HTML Reality)"`, `"Floor 2 (The CSS Notation)"`, or `"Floor 3 (The Browser Engine Consequence)"`.
  - Never write `"The Four-Pillar Deep Dive"`, `"Pedagogical Pillars"`, or `"Pillar 1"`, `"Pillar 2"`, `"Pillar 3"`, `"Pillar 4"`.
  - Never cite internal rules or laws to the student (`"Under Law 11..."`, `"Following our pedagogical framework..."`).

- ✅ **HOW TO APPLY THE METHOD NATURALLY (Seamless Student Experience):**
  - **Natural Progression instead of Elevator Jargon:**
    Instead of:
    `### The Three-Floor Elevator: HTML Reality to Display Geometry`
    `To understand how the browser engine translates markup into visual geometry, we must ride the three-floor elevator...`
    Write:
    `### From HTML Markup to Display Geometry`
    `To see how the browser resolves this on the physical screen, trace the flow from the HTML tags, through the CSS declarations, to the layout engine's box generation routine:`
    `1. **The HTML Structure:** Daniel writes a <header> containing a <span>...`
    `2. **The CSS Declarations:** Daniel styles the badge with...`
    `3. **The Engine Resolution:** The browser constructs the layout tree...`
  - **Natural Topical Headings instead of "Pillar" Scaffolding:**
    Instead of:
    `### The Four-Pillar Deep Dive: The Box-Sizing Primitives`
    `**Pillar 1 (Name Etymology):** ... **Pillar 2 (Tactile Everyday Physical Analogy):** ... **Pillar 3 (The "Why We Suffered Before" Contrast):** ... **Pillar 4 (The Physical Browser Routine):**`
    Write:
    `### Deep Dive: Deconstructing the Box-Sizing Primitives`
    `**Name and Origins:** ...`
    `**Everyday Physical Analogy:** ...`
    `**Historical Context (The Problem It Solved):** ...`
    `**Browser Calculation Sequence:** ...`

The student must experience a seamless, authoritative, textbook-grade lecture. The author's pedagogical scaffolding must remain 100% invisible.

---

## 13. UI Visualizations of CSS (Whenever It Clarifies or Distinguishes Behavior)

Every time it helps to distinguish or clarify things, fill the lecture with UI visualizations of the CSS provided in the code.

- **No Arbitrary Quotas:** Never impose artificial quotas or rigid numbers of figures (never mandate arbitrary counts like "2 to 4"). If five distinct mechanisms or edge cases benefit from visual rendering, provide five figures. If a single focused visual comparison completely settles a simple concept, do not pad with redundant drawings.
- **Not Always Compare Mode:** Visualizations do not always need to be parallel comparisons (wrong vs right). While side-by-side comparisons are powerful for contrasting broken vs fixed states, a single-scene visualization (`layout="single"`) that directly renders the UI consequence of the CSS provided in the code is completely valid and encouraged whenever visual representation aids comprehension.
- **Strict 1:1 Code Synchronization:** Every element, class, and property shown in the UI visualization must be explicitly declared in the code snippet directly preceding it.
- **DevTools Element Inspection Overlays:** When showing how the browser translates markup into geometry, utilize authentic DevTools-style inspection overlays (simulated browser viewport chrome, cyan content-box selection outline, green dashed phrasing box, and directly anchored dark `#1E293B` inspector tooltips with pointer notches `▲` physically touching the inspected elements) rather than abstract geometric diagrams or confusing floating arrows. Use Lecture 6 (Figure 6.2, `mode="banner"`) as the reference benchmark.
- **The Figure 7.1 Realistic Browser Window Paradigm (The General Presentation Template):** The Figure 7.1 visual architecture (`.cb-window` with macOS window-control dots, titlebar, URL/context bar, grounded viewport canvas, and symmetrical status footers) is the canonical reference benchmark for realistic browser environments. Figure 7.1 is not a narrow viewport coordinate trick, nor is it restricted to comparative "wrong vs. right" tooltips. It is a general presentation substrate that authors are explicitly mandated to deploy across: (1) Dialectical duels (symmetrical side-by-side browser windows contrasting competing declarations or broken vs. fixed implementations); (2) Illustrative architectural realizations (single browser windows rendering internal browser engine subsystems, rule indexers, or hash bucket dispatchers); (3) DevTools runtime profiling (browser windows simulating Chrome DevTools Performance timelines, flame charts, recalculate style passes, and layout inspection panels); and (4) Viewport and environmental mechanics (`position: fixed/sticky`, ICB absolute escaping, viewport units). Whenever grounding the lesson in an authentic browser environment clarifies cause, effect, or execution order, deploy the Figure 7.1 window substrate freely.
- **The Lecture 40 & 41 Compiler Geometry Canvas Paradigm (Build-Time Code Architecture Substrate):** The visual architecture established across Lectures 40 and 41 (Figures 40.1, 40.2, 40.3, 41.1, 41.2, 41.3, originating from `lecture_41_excerpt.html`) is the canonical reference benchmark for all build-time, compiler, preprocessor, and code-transformation diagrams. When explaining mechanisms that execute before code reaches the browser (e.g., Sass maps and loops, mixin declaration cloning vs placeholder selector grouping, compile-time variable replacement vs runtime cascade, build-time module bundling vs network waterfalls, and selector explosion traps), authors must deploy this substrate.
  - **Strict Canonical Two-Color Palette Law (Zero Outside Innovations):** Authors are STRICTLY BANNED from inventing or introducing arbitrary new colors (e.g. no random navy blues, no purples/indigos, no bright greens). The palette is strictly sealed to two contrasting canonical colors:
    1. **Primary / Active Panel:** Dark Teal (`#0e7490`) with white text, `#0e7490` borders, and light teal caption tint (`#e0f2fe`).
    2. **Secondary / Contrast Panel:** Deep Crimson (`#9f1239`) with white text, `#9f1239` borders, and light crimson caption tint (`#ffe4e6` / `#fff1f2`).
    3. **Neutral Chrome:** Black (`#000000`), Slate Gray (`#4b5563`), Border Gray (`#d1d5db` / `#e5e7eb`), Background Gray (`#f9fafb` / `#f3f4f6`), and White (`#ffffff`).
  - **Symmetrical 2-Card Mode:** Full-width header pills (`padding: 12px; font-size: 13.5px–14px; font-weight: 800; border: 2px solid;`), integrated monospace title bars (`12px` bold uppercase), 6px solid accent left borders on code blocks (`.code-node`), centered monospace process arrows (`.arrow-step`), centered verdict chips (`.node-caption`), and grounded footers (`.card-footer`).
  - **Single-Topic Trap Mode (Figure 41.2 Benchmark):** Solid black `#000000` header pill and frame, Slate Gray `#4b5563` input block, centered downward arrow, and Deep Crimson `#9f1239` output explosion block.
  - **Typography & Formatting Floor:** Strict $\ge 11.5\text{px}$ floor on all labels and code. Code statements must be cleanly line-broken to prevent mid-property hyphenation breaks (e.g., `var(--brand-blue);` on its own line).

### UI Image Verification Gate & Visual Standards:
1. **Compositional Purpose & Structural Naturalness:** Does every visual element serve a distinct structural role and occupy an organic, well-proportioned position within the layout? (Zero tacked-on artifacts, zero redundant status strips, and balanced negative space).
1. **Screenshot Policy (Strict Negative Instruction):** Take screenshots (via `pdftoppm -png -r 150 -f <page> -l <page> md-lectures-pdf/{n}.pdf ...`) **after creating or modifying every UI image / figure canvas mode (in `src/css-figure.mjs`), and ONLY in this case, OR if there is a serious grounded suspicion of a visual error**. Do NOT run routine screenshot audits when authoring, auditing, or revising text/markdown prose.
2. **The Authentic UI Rule:** Does the canvas depict an authentic, pristine UI component (using the standard visual substrate like the macOS browser window or `.share-card`) rather than a conceptual abstraction (e.g., no fake 'Document Stream' boxes or instructional text posing as HTML content)?
3. **The Strict External Callouts Rule:** Are all technical diagnostics, explanations, and labels strictly separated into external callouts or distinct badges that do not masquerade as, or interfere with, the underlying UI elements?
4. **The Visual Substrate Rule:** Does this image share the exact same structural visual language (colors, framing, typography) as the rest of the chapter, or did it invent a one-off design layout just for this specific concept?
5. **Visual Horizontal Centering:** Header verdict pills, labels, and tags on top must be visually and mathematically centered horizontally over the primary diagram elements.
6. **Clean Typography & Zero Border Collisions:** Zero letters walking over dashed or solid borders, zero text collision, and $\ge 8\text{px}$ breathing room.
7. **Natural Label Blending (No Extra Calculation Friction):** Labels must blend cleanly and directly into the pastel fill of the area they label without adding fake inner white cards or extra borders that create visual confusion or look like extra margins to calculate.
8. **Interrupted Lines for Over-Line Labels:** Any label positioned over or across a line must cleanly interrupt the line with horizontal clearance: `---------  label  ---------`.
9. **Border Distinction & High Contrast:** Adjoining or overlapping regions must have distinct hues/opacities and clear, crisp border demarcation.
10. **Legible Typography Floor ($\ge 11.5\text{px}$ / Ban on Micro-Print):** Micro-print ($7\text{px}$ to $9\text{px}$) is strictly banned. All text, dimensions, and badges must be $\ge 11.5\text{px}$ (with primary element text at $12.5\text{px}$ to $14\text{px}$) for guaranteed print and screen legibility.
11. **Directly Anchored Tooltips (No Floating Trajectory Lines):** Inspector tooltips and diagnostic cards must sit directly adjacent to the element they evaluate with centered pointer notches (`▲` or `▼`) touching the element boundary. Diagonal dotted trajectory lines and floating dots slicing through graphics are strictly banned.
12. **UI vs. Diagnostic Disambiguation:** Rendered webpage UI components (buttons, dropdowns, status cards, tooltips) and browser diagnostic overlays (DevTools element pills, coordinate origin badges, inspector tags) must NEVER share identical visual styling, background hues, or shapes. Never stack two identical-looking dark floating boxes that resemble competing tooltips. Diagnostic tools must be instantly recognizable as browser chrome/overlays (e.g. translucent cyan element highlight with an authentic compact DevTools dimension pill `div.tooltip | 120 × 24`, or a distinct high-contrast inspector pill), completely separate from the rendered page content.
13. **Spatial Boundary Enclosure Fidelity:** Container perimeters (containing blocks, BFC boundaries, flex/grid containers, wrapper cards) must physically and accurately enclose the exact child elements that are nested inside them in the preceding HTML markup. If an outer `.share-card` wraps both `<button>` and `.tooltip` in HTML, its visual containing block frame must physically enclose both elements, rather than drawing a misleading outline around only one child.
14. **Pedagogical Signal-to-Noise Floor (Anti-Clutter Principle):** Every figure has ONE primary visual mechanism. Diagnostic props (DevTools pills, dashed perimeters, warning badges, pointer notches) must support the primary mechanism without overwhelming the canvas. Maximum of one primary diagnostic callout per subject. Cascading chains of multiple stacked pointer notches (such as an inspector notch pointing to a tooltip notch pointing to a button) are strictly prohibited.
15. **Zero Duplicate Annotations Law (No Dual Notes / Anti-Gullibility Law):** NEVER tolerate duplicate explanatory descriptions or redundant error notes on the same diagram panel. For example, never place an explanatory paragraph inside the component card body while also repeating an explanation in the footer strip! The component preview body must display strictly the authentic HTML element (with at most a clean structural badge or technical perimeter). The diagnostic cause-and-effect explanation belongs strictly in ONE place: the dedicated footer strip. Never be gullible and preserve weird legacy text blocks or redundant descriptions—audit ruthlessly and purge all clutter.

---

## 14. The Preemptive Nomenclature & Pearls of Wisdom Law (`> [!WISDOM]`)

In real-world front-end engineering, practical code examples inevitably feature established industry naming conventions (e.g. `<span class="badge">`, `.card__header`, `.btn-group`, status chips, wrapper containers, alert bars) and design system idioms (Bootstrap, Tailwind, BEM, design tokens). For a student, these conventions often clash with naive visual intuition (e.g., *"This looks like a button on screen; why is it coded as a `<span>` and named `.badge`?"*). When students encounter unfamiliar customs inside a code block, their attention fractures: they spend mental energy questioning the markup philosophy instead of grasping the underlying CSS engine mechanism.

### The Preemptive Condition (MANDATORY):
Whenever upcoming code examples or HTML markups rely on industry conventions, component nomenclature, or design patterns that could trigger visual-semantic confusion, you **MUST insert a `> [!WISDOM]` callout immediately BEFORE the code and markup breakdown**.

### The Three Mandatory Pillars of a Wisdom Callout:
1. **Nomenclature and Etymology:** Proactively decode why the element, class, or selector is named this way in professional practice (distinguishing non-interactive semantic metadata from actionable UI controls).
2. **Ecosystem Customs and Industry Practice:** Explain how mainstream design systems, UI component kits, and production teams standardize these patterns in the wild.
3. **Resolving the Visual vs. Semantic Illusion:** Explicitly acknowledge the optical illusion (what the student's eyes see on screen, such as background color, rounded corners, and padding mimicking an interactive button) versus what the semantic architecture actually is (a non-interactive phrasing element), directly explaining why the specific CSS rule (e.g., `display: inline-block`) was required to bridge the gap.

### Concrete Example from Production:
- ❌ **DO NOT DO THIS (Plunging into code with unexplained customs):**
  > Jumping straight into `<span class="badge">LIVE</span>` with `display: inline-block` without explanation. The student spends the entire section wondering why a "button" is called a "badge" and written as a `<span>`.
- ✅ **DO THIS (Preemptive Pearls of Wisdom Callout):**
  ```markdown
  > [!WISDOM]
  > **Industry Naming Conventions: Badges versus Buttons:** In professional UI component systems like Bootstrap or Tailwind, a "badge" (often termed a tag, pill, or chip) is a non-interactive status indicator such as `[LIVE]`, `[NEW]`, or `[BREAKING]`. Because a badge represents visual metadata rather than an actionable control, developers mark it up as an inline phrasing element like `<span class="badge">` rather than an interactive `<button>` or `<a>` element. However, because CSS applies a bold background color, padding, and rounded corners, it visually mimics a button to the human eye. Recognizing that a badge is an inline phrasing label rather than an actionable widget clarifies why its box model must be promoted with `display: inline-block` to sit cleanly inside the headline flow without breaking layout geometry.
  ```

### Syntax and Styling:
- Uses blockquote syntax `> [!WISDOM]`.
- Compiles with a warm amber border (`#D97706`), warm cream background (`#FFFBEB`), and the lamp SVG icon (`💡 Pearls of Wisdom`).
- Written on a single continuous line per paragraph (zero hard-wrapping) with zero em-dashes (`—` or `--`).

---

## 15. The Code Editor Window Fidelity & Word-Break Integrity Law

Every code block in the lecture body must render as an authentic, high-fidelity macOS editor window (`.editor`) with traffic-light dots, filename tab (`title="..."`), numbered rows, and tabbed comment speech bubbles (`.cmt-bubble`).

### Core Requirements:
1. **Top-Level Code Fences (Ban on Mini-Code Swallowing):** Code fences must always start at column 0 and be separated from preceding ordered lists, unordered lists, or paragraphs by a blank line. Never allow code blocks to be swallowed into list items as raw, unstyled `.mini-code` blocks.
2. **Comment Speech Bubbles:** In body code blocks, comments live strictly at the end of the line (`code; /* **WRONG:** ... */` or `code; /* **RIGHT:** ... */`). The build compiler extracts these comments and renders them into dedicated, tabbed comment speech bubbles (`.cmt-bubble`) with color-coded verdict badges (`<b class="tag tag-wrong">WRONG:</b>` and `<b class="tag tag-right">RIGHT:</b>`).
3. **Word-Break Integrity (Zero Mid-Word Splitting):** Code text and comment annotations must NEVER be subjected to `word-break: break-all` or `overflow-wrap: anywhere`. Hyphenating or breaking words across lines mid-syllable (e.g. `Grandch / ild` or `Flat el / ement`) is a critical visual defect.
4. **Summary Fences Distinction:** Summary code blocks (````css right```` / ````css wrong````) are strictly separate from body editor windows. They sit under `**DO THIS:**` / `**DO NOT DO THIS:**` headers and contain ZERO comments inside the code block.

---

## 16. The Cognitive Accessibility & B2 Language Law (The "Headache & Short Attention Span" Standard)

A world-class technical lecture does not flaunt the author's vocabulary; it removes every trace of cognitive friction between the reader's brain and the browser engine. 

### Core Mandates:

1. **The Target Reader Profile ("Headache & Short Attention Span"):**
   Write directly for a developer who has a splitting headache and a short attention span. They are tired, working under pressure, and have zero patience for academic fluff or convoluted sentence structures. If a student has to re-read a sentence to parse its grammatical structure before grasping the technical concept, the sentence is defective and must be broken apart into clean, punchy units.

2. **The CEFR B2 Language Ceiling (Clarity Over Purple Prose):**
   Use clear, accessible, everyday English vocabulary (CEFR B2 level). Ban elevated, Latinate, or purple academic jargon where a straightforward B2 word exists:
   - Write *"runs on your computer"* instead of *"executes within the compilation lifecycle"*.
   - Write *"turns into standard CSS"* instead of *"transforms into a static stylesheet asset"*.
   - Write *"saves browser memory"* instead of *"incurs zero runtime memory footprint"*.
   - Write *"catches mistakes before shipping"* instead of *"enforces compile-time architectural contracts"*.
   - Keep sentences short, active, and direct: **target average 12 to 18 words**, rarely exceeding 22 words.
   - Keep paragraphs short: **2 to 4 sentences per paragraph** to give the reader's eyes generous whitespace and breathing room.

3. **Strict Zero-Degradation Gate (No Dumbing Down):**
   Cognitive accessibility is NEVER an excuse to dumb down technical depth, omit difficult edge cases, or adopt a childish or patronizing tone. The student will be asked the **exact same demanding interview questions** as any senior web developer. All architectural mechanisms (compile-time data structures, DOM inheritance overhead, network waterfalls, Core Web Vitals impact, error assertions, scoping, and specifications) must be taught with 100% precision and authority.

4. **Proper Step-by-Step Concept Building (Physical Body First):**
   Never drop abstract conclusions onto the reader. Always start with the physical reality:
   - What file is open in your editor? (`.scss` vs `.css`)
   - Where does it run? (On your laptop in the terminal/build tool vs inside Chrome/Safari)
   - What file does the browser physically download over the network?
   - Trace causality in strict, unhurried order: **What you type in your editor $\to$ What the compiler does on your computer $\to$ What the browser downloads $\to$ What happens on screen**.

5. **Mandatory Bold Baptism of Key New Terms:**
   In key paragraphs where new terms, keywords, concepts, or primitives are first baptized and introduced, **they MUST be formatted in bold (`**term**`)**.
   - Bolding terms on their initial introduction provides immediate visual anchors for the reader's scanning eyes.
   - A tired reader skimming the page can instantly locate where a concept is defined without searching through walls of text.
   - Example: *"A **CSS preprocessor** is a program that runs on your computer during your build step... explain the difference between two stages: **build time** and **runtime**... Sass solves this maintenance problem using a **Sass map** and an **`@each` loop**."*

6. **Iterative Versioning & Archival Protocol:**
   When revising or re-authoring a lecture:
   - The active, production chapter is ALWAYS named `{n}.md` (and builds to `{n}.html`, `{n}.pdf`).
   - Every prior iteration must be preserved and archived as `{n}-old-01`, `{n}-old-02`, etc., appending to the old numbering sequence.
   - This ensures full history, continuous benchmarking, and zero loss of iterative progress.

---

## 17. The Modern Figure Architecture & Visual Substrate Law (The Lecture 40–47 Benchmark)

Every HTML figure in the lecture series must strictly obey the Modern Figure Design System codified in `FIGURE-DESIGN-SYSTEM.md` and benchmarked in Lectures 40, 41, 45, 46, and 47.

### Core Visual Mandates:

1. **The "Never Text-Only" Law (The Anti-Ugly Gate):**
   A figure card is an illustration of spatial, temporal, mechanical, or physical reality. Wrapping plain text bullet lists, prose paragraphs, or key-value tables inside bordered cards without an authentic graphical substrate is STRICTLY FORBIDDEN. Every figure MUST feature real graphical substrates: DOM traversal trees with connector circles, realistic device frames with browser chrome, architectural canvases with calipers, or zoom viewfinder lenses.

2. **The Seven Mandatory Archetypes (Never Invent from Scratch):**
   Select, clone, and adapt from the canonical catalog:
   - **Archetype 1: DOM Traversal & Selector Matching Pipeline** (`45.2`: `.traversal-tree`, `.tree-line`, centered node circles, `MATCH`/`WALK ↑` badges).
   - **Archetype 2: Realistic Virtual Device & Mobile Browser** (`47.1`: `.phone-frame`, `.phone-notch`, `.phone-browser-bar` with monochrome SVG lock and URL pill, `.web-masthead` serif logo, 1:1 mobile vs 38% scaled desktop).
   - **Archetype 3: Architectural Canvas & Zoom Viewfinder Lens** (`47.2`: `.caliper-bar` with end ticks, layout blueprint canvas, floating `.viewfinder-lens` with zoom badge, `.metric-grid`).
   - **Archetype 4: Specificity Ladder & Cascade Escalation** (`45.3`: `.ladder-tier`, `.tier-score`, `.verdict-box`).
   - **Archetype 5: Multi-Paradigm Comparison & Token Stacks** (`46.1`, `46.3`: 3-card comparisons, `.brand-row`, high-contrast swatches).
   - **Archetype 6: Stylesheet Growth Curves & Performance Charts** (`46.2`: `.chart-box`, `.bar-track`, `.bar-fill` with `min-width` protection).
   - **Archetype 7: Compiler Geometry & AST Transforms** (`40.1`, `41.1`: build-time expansions and traps).

3. **Mathematical Concentric Centering:**
   Whenever drawing timeline lines and circular markers (e.g. `45.2`), the vertical line and the circle markers MUST share the exact same mathematical center coordinate (`left: 11px; width: 2px;` + `left: -19px; width: 10px; margin-top: -5px;`). Tangent lines or off-center circles are critical visual defects.

4. **Zero Platform Emojis:**
   Never use raw platform yellow emojis (`🔒`, `✓`, `✕`, `📱`). Always use clean inline SVG vector paths or crisp monochrome text glyphs.

5. **Anti-Collision Table Spacing:**
   In diagnostic tables or key/value grids inside cards, keys must be short tokens (`JS API`, `MEDIA QUERIES`) with explicit `gap: 8px` and `white-space: nowrap` to prevent text touching.

---

## 18. The Zero-Orphan-Syntax & Explanatory Proximity Law (Code Scoping & Explanation)

Code snippets in these lectures are not decorative illustrations or pre-baked component downloads; they are surgical objects of direct study. Every single line of code shown to the student must be earned, scoped, and thoroughly taught.

### Core Rules of Law 18:

1. **The 8–12 Line Snippet Budget (Ban on Monolithic Component Dumps):**
   - Body code snippets must never exceed 8 to 12 lines of active code.
   - Dumping full 20-to-40-line production templates (such as an entire 30-line HTML table or an entire CSS stylesheet) is STRICTLY FORBIDDEN.
   - Code snippets must be isolated surgical specimens demonstrating a single mechanism.

2. **The Zero-Orphan-Syntax Contract (Every Property Must Be Earned):**
   - Every single CSS property, HTML attribute, or JavaScript method rendered in a code snippet MUST be explicitly named, unpacked, and mechanically justified in the surrounding prose (either in the lead-in setup or the immediate analytical derivation).
   - If a snippet declares `position: sticky; left: 0; background-color: #ffffff; z-index: 2;`, the text must explain *why* each of those properties exists (e.g. explaining why `background-color: #fff` is physically required to prevent transparent scrolling text bleed, and why `z-index: 2` prevents content overlap).
   - If a property or attribute is not explained in the text, it is an "orphan property" and is STRICTLY FORBIDDEN from appearing in the code block. Delete it.

3. **Strict Ban on Back-to-Back Code Blocks:**
   - Placing two code blocks consecutively without intervening prose is an automatic audit failure.
   - Every code snippet must follow the strict pedagogical loop:
     `[Prose Setup & Problem Framing] → [Minimal Code Snippet (max 8–12 lines)] → [Prose Mechanical Derivation / Visual Consequence / Figure]`.

4. **Algorithmic Idiom & CSS Trick Deconstruction:**
   - Whenever an advanced CSS idiom, layout trick, or browser hack is shown (such as Lea Verou's `background-attachment: local, scroll` shadow, or `content: attr(data-label)`), the author cannot just present the code and move on.
   - The prose must explicitly deconstruct the underlying browser layout, paint, or scroll algorithm that makes the trick function.

---

## Mandatory Pre-Flight Self-Interrogation Checklist

Before completing or signing off on any lecture, run this 21-point interrogation on every section:
1. *Did I mention a CSS selector without showing the HTML markup it targets?* (If yes: add HTML markup first).
2. *Did I use insider developer slang (like "bare tag")?* (If yes: replace with plain English and real syntax).
3. *Did I explain the browser outcome before showing the physical markup?* (If yes: invert to HTML -> CSS -> Engine order).
4. *Did I assume the reader knows why a punctuation mark (`.`, `#`) exists?* (If yes: decode the character).
5. *Did I describe a feature ontologically ("the spirit") instead of its physical body?* (If yes: start with where it lives in the file, what characters are typed, and what DevTools physically displays).
6. *Did any internal rule names or author scaffolding ("Three-Floor Elevator", "Floor 1/2/3", "Pillar 1/2/3/4", "Four Pillars") leak into the text or headings?* (If yes: replace with natural, professional textbook headings and prose).
7. *Did I write a robotic eyeball-tracking loop ("Look at... Notice the arrow...") or narrate SVG graphic props instead of explaining cause, effect, and CSS mechanism?* (If yes: rewrite in natural prose focusing on what broke and why).
8. *Did I visualize the CSS in the code whenever it helps to clarify or distinguish behavior, without imposing arbitrary quotas or forcing unnecessary compare modes?* (If no: add UI visualizations of the CSS).
9. *Did I use real-world industry naming conventions, component patterns, or markup customs (e.g. badges, pills, wrappers) that could confuse a student without preemptively deconfusing them in a `> [!WISDOM]` callout?* (If yes: insert a preemptive Pearls of Wisdom callout before the code block).
10. *Did every body code block render with its full macOS editor window, titlebar tab, line numbers, and comment speech bubbles, with zero raw mini-code swallowing and zero mid-word line wrapping?* (If no: separate code fences from preceding lists with a blank line and verify clean bubble rendering).
11. *Did I pass the "Headache & Short Attention Span" test with CEFR B2 language?* (Are sentences short, active, 12–18 words on average? Are paragraphs kept to 2–4 sentences? Is all academic/purple fluff removed?).
12. *Did I maintain 100% technical rigor without dumbing down?* (Will the student be fully equipped to answer the exact same demanding interview questions as a senior web developer?).
13. *Are all key newly introduced terms formatted in bold (`**term**`) on their initial baptism in key paragraphs?* (If no: bold them to provide instant scanning anchors).
14. *If this was a revision, was the prior version properly archived under `{n}-old-NN`?* (If no: archive prior version before proceeding).
15. *Is any figure card merely text bullets or tables without a graphical substrate?* (If yes: REJECT. Add genuine calipers, device mockup, DOM tree, or lens).
16. *Are all figure circular markers mathematically centered on their guide lines?* (If no: synchronize `left`, `width`, and `margin-top`).
17. *Are all figure chrome icons crisp monochrome SVGs rather than yellow platform emojis?* (If no: replace with clean SVG paths).
18. *Does the entire figure and its caption fit on a single PDF page without splitting across a page boundary?* (If no: tune `.card-canvas` padding and gap to respect page budget).
19. *Zero Orphan Syntax (Law 18): Is every CSS property, HTML attribute, and method in each code snippet explicitly unpacked and explained in the prose?* (If no: explain the property or delete it from the code block).
20. *Snippet Budget Gate (Law 18): Does any body code snippet exceed 8–12 lines?* (If yes: split it into surgical, focused snippets).
21. *Zero Back-to-Back Snippets (Law 18): Are any two code blocks placed consecutively without intervening explanatory prose?* (If yes: insert a pedagogical paragraph connecting them).




