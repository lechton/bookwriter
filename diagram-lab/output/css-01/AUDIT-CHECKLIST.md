# OPERATIONAL AUDIT CHECKLIST — CSS Interview Lectures (css-01)

This checklist is the permanent, mandatory operational gate for authoring and auditing every lecture in the `css-01` series. An **AUDIT** requires full inspection against every gate below, followed immediately by executing all necessary corrections.

---

## 1. Meaningful CSS → Mandatory UI Visualization Gate
- [ ] **(a) Major Code Snippets Followed by UI (Zero Naked CSS Snippets):** Every single code block in the lecture that presents meaningful CSS (layout behavior, box generation, dimension constraints, alignment traps, syntax contrasts, keyword resets) MUST be accompanied by a rendered UI visualization directly beneath it. Never leave meaningful CSS visually naked. Check every code block: *Is this snippet followed by its corresponding UI canvas?*
- [ ] **(b) UI Design Selected for Purpose (Architecture, Archetype & Elegance):** Verify that the UI figure's form is purposefully, elegantly, and deliberately selected for the specific mechanism being taught, rather than applying a mindless one-size-fits-all template:
  - **1. Visual Architecture Paradigm (Isolated Component vs. Realistic Browser Window):**
    - *Isolated Component Canvas (Lecture 1 Benchmark):* Use clean, isolated cards/widgets with zero extraneous browser chrome (no traffic-light dots, no URL bars) for local mechanisms: Cascade priority, specificity tournaments, inheritance trees, box-model zones, flexbox axes, grid track templates, and margin collapsing. Directs 100% of cognitive energy to geometry and styling.
    - *The Realistic Browser Window Substrate (Figure 7.1 Benchmark):* Use authentic simulated browser windows (`.cb-window` with macOS traffic-light dots, clean titlebar, URL/context bar, grounded viewport canvas, and symmetrical status footers). Recognize Figure 7.1 as a versatile general presentation substrate, not a narrow viewport trick. Deploy freely for: (1) Comparative duels (Wrong vs Right), (2) Illustrative architectural diagrams (browser engine subsystems, hash bucket dispatchers), (3) DevTools inspection environments (Performance timelines, flame charts, element inspection overlays), and (4) Viewport-relative coordinate mechanics (`position: fixed/sticky`, ICB escaping, viewport units).
  - **2. Content Archetype (Comparative Duel vs. Illustrative Realization):**
    - *Comparative Figures (The Duel / Tournament):* Symmetrical side-by-side cards (`.preview-card`), matching 1-line top pills (`✕ OVERRIDDEN` vs `✓ WINNER`, or `✕ WRONG` vs `✓ RIGHT`), and strictly matched 2-line footers (`min-height: 52px;`) splitting cleanly at semicolons. Use ONLY when comparing competing declarations, specificity conflicts, or wrong vs. right fixes.
    - *Illustrative Figures (Textbook Anatomy / Code Realization):* Direct single-state rendering of code snippets showing how elements behave in space, with in-UI element identification (e.g. `.box` labels on top of child boxes), clean textbook aesthetics, and zero artificial error/winner pills. Use for neutral layout mechanics, dimensions, coordinate systems, and flow.
  - **3. Visual Elegance & Signal-to-Noise Ratio:** The figure must be aesthetically appealing, well-proportioned, uncrowded, and free of extraneous visual fluff. Every line, badge, and border must directly serve the mechanical explanation.
- [ ] **Complete Preceding Code Description (HTML + CSS):** Every component figure must be preceded by BOTH the physical HTML markup and the CSS rules targeting it. The student must see the physical DOM elements before observing their styling.
- [ ] **Strict 1:1 Code Synchronization:** Every selector, class, HTML element, attribute, and dimension rendered in a figure canvas MUST appear in the code snippet directly preceding it (or be labeled conceptually as a plain content role, never as an undeclared CSS selector).
- [ ] **Modern Standalone HTML Figure Architecture:** All visual aids are authored as standalone HTML/CSS components in `md-lectures/figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html` and embedded via ````markdown ```html-figure src="..." caption="..."``` ````. JavaScript and external CDNs are strictly banned.
- [ ] **Unique Container CSS Scoping:** Every figure stylesheet must be strictly scoped under a unique root container class (e.g. `.fig-inherit`, `.fig-box-sizing`, `.fig-margin-collapse`) to prevent Prince global CSS cascade collisions across lectures.
- [ ] **No Arbitrary Numerical Quotas:** Never enforce artificial minimums or maximums (never limit to "2 to 4" figures). If five distinct mechanisms or code snippets benefit from visual rendering, provide five figures.

---

## 2. 10/10 Perfection Self-Audit & Visual Quality Gate
- [ ] **The 10/10 Perfection Self-Audit Gate (Zero Disturbances Law):** Quality must be strictly 10/10 with zero compromises. At the conclusion of authoring every image, the author must rigorously audit the result:
  - *Does this image PERFECTLY represent the spirit and craftsmanship of the canonical reference benchmark (clean authentic HTML elements only, generous breathing room, elegant symmetry, 100% saturated true-to-code colors)?*
  - *Does it introduce ANY new disturbances in clarity, layout crowding, forced line-wrapping of labels, unnatural inspection outlines, or visual clutter?*
  - *Are all diagnostic comments and analytical metrics strictly confined to the top header pills and the dedicated 2-line symmetrical footer strip?*
  If any disturbance or imperfection is detected, rework it immediately. Never accept a 7/10 or 8/10 compromise.
- [ ] **Clean Component Separation (No "Box Next to Box"):** The rendered component body must contain ONLY its authentic HTML elements matching the code fence above. NEVER place explanatory comment boxes, tag pills, or diagnostic metrics inside the component body next to interactive elements. Diagnostic explanations live strictly in the header pills or the dedicated full-width footer strip.
- [ ] **Zero Duplicate Annotations Law (No Dual Notes / Anti-Gullibility Law):** NEVER tolerate duplicate explanatory descriptions or redundant error notes on the same diagram panel. For example, never place an explanatory paragraph inside the component card body while also repeating an explanation in the footer strip! The component preview body must display strictly the authentic HTML element (with at most a clean structural badge or technical perimeter). The diagnostic cause-and-effect explanation belongs strictly in ONE place: the dedicated footer strip. Never be gullible and preserve weird legacy text blocks or redundant descriptions—audit ruthlessly and purge all clutter.
- [ ] **Negative Space & Invisibility Representation Law:** When presenting negative space of information (invisibility, disappearing text, 1.1:1 contrast failure), mimic a serious rendering machine by marking the exact physical boundary with a technical perimeter (e.g. dashed red inspector frame) and explicitly naming the area with its class/selector (e.g. `a.footer-link invisible (#000000)`), making what has become invisible immediately identifiable.
- [ ] **100% Saturated True-to-Code Colors (Zero Opacity Bleaching):** Never use `opacity: 0.45` or `0.55` on overridden elements or text. Render the actual, full-saturation colors from the code block (e.g. `#d97706`, `#ea580c`, `#1e3a8a`, `#dc2626`). The overridden verdict belongs strictly to the top pill, container border, and footer strip.
- [ ] **Visual Horizontal Centering:** Header verdict pills (`WRONG` / `RIGHT`), labels, and tags on top must be visually and mathematically centered horizontally over the primary diagram elements.
- [ ] **Clean Typography & Zero Border Collisions:** Zero letters walking over dashed or solid borders, zero text collision, and $\ge 8\text{px}$ breathing room between text badges and borders.
- [ ] **Legible Typography Floor ($\ge 11.5\text{px}$ / Ban on Micro-Print):** Micro-print ($7\text{px}$ to $9\text{px}$) is strictly banned. All text, dimensions, and badges must be $\ge 11.5\text{px}$ (with primary element text at $13\text{px}$ to $14\text{px}$) for guaranteed print and screen legibility.
- [ ] **Spatial Boundary Enclosure Fidelity:** Container perimeters (containing blocks, BFC boundaries, flex/grid containers, wrapper cards) must physically and accurately enclose the exact child elements that are nested inside them in the preceding HTML markup.

---

## 3. Logical Clarity & Concise but Never Cryptic Law
- [ ] **Concise but Never Cryptic Law:** Footer comments must directly explain the cause-and-effect contrast using concrete color, property, and order references. Copy must be concise and punchy, but **NEVER cryptic, abbreviated, or grammatically distorted**:
  - Never write terse, confusing shorthand that distorts what was actually written in code (e.g. do NOT say "Black text declared with initial"—the author never declared black text, they declared `color: initial`, which evaluated to default black).
  - Always explicitly state: (1) what CSS property or keyword was declared and what value the browser computed from it (e.g. `color: initial resets text to default black`), (2) the semicolon break `;`, and (3) the physical on-screen consequence (e.g. `Black link vanishes against dark slate surface`).
- [ ] **Minimal Physical Specificity (No Naked Colors):** Never refer merely to a raw color in isolation (e.g. "orange", "blue", "green"). Always name the concrete CSS property or visual role being modified: e.g. **"orange background"**, **"blue background"**, **"green text"**, **"red border"**.
- [ ] **Universal Familiar Lexicon Law (No Designer/Esoteric Jargon):** Every visual figure, card label, button label, caption, and diagnostic footer comment must ALWAYS use language that:
  - (a) The student is already intuitively familiar with from everyday life (e.g. `blue`, `green`, `red`, `orange`, `black`, `white`, `button`, `card`, `link`, `element`, `title`, `text`); OR
  - (b) Has been explicitly baptized, introduced, and explained previously in the lecture prose.
  - **Strict Prohibition on Esoteric/Designer Vocabulary:** NEVER use obscure, specialized, or designer color names (e.g. "amber", "teal", "slate", "indigo", "mauve", "chartreuse", "fuchsia") in diagrams. If a hex code is `#d97706`, call it **orange background**, not "amber". If a hex code is `#1e3a8a`, call it **blue background**, not "navy".

---

## 4. Opening Ladder Gate
- [ ] **Beat Count:** Exactly 5 to 7 numbered beats opening the body.
- [ ] **Sentence Length Ceiling:** Strict $\le 20$ words per sentence. No sentence over 20 words.
- [ ] **Structural Progression:** (1–2) The scene $\to$ (3–4) The failure moment $\to$ (5) The question (stating the visible conflict) $\to$ (6) The danger $\to$ (7) The promise.
- [ ] **Strict Ban on Premature Mechanism Naming:** Never name the lecture's mechanism terms in beats 1-6 (the term is earned in the body). Write the visible physical behavior instead (e.g. "controls which boxes can accept dimensions", "the score that decides which rule wins", "the two gaps that merge into one").
- [ ] **Single Actor Throughout:** One person with one unambiguous role (a front-page editor, a junior developer, a subscriber).
- [ ] **Tangible Nouns:** Every noun is exactly one tangible thing: a person, a visible screen element, a file, or a machine event.

---

## 5. Target & Arrow Law (HTML Reality First)
- [ ] **HTML Precedes CSS:** Every CSS selector is an arrow shot at an HTML target. Never present a CSS selector without first establishing or displaying the physical HTML markup it targets.
- [ ] **First-Time Baptism:** Decode punctuation characters from zero prior knowledge in early encounters: dot (`.`) means *"match class attribute"*, hash (`#`) means *"match id attribute"*, colon (`:`) means *"match temporary state"*. Ban developer slang (e.g. "bare tag") without explicit plain-English definitions.

---

## 6. Harmonious Code + UI Step Rhythm
- [ ] **Mandatory Introductory Prose:** Every `### ` heading MUST open with 2–3 sentences of conceptual framing before any code block or figure appears (prevents floated marginalia `h3` collisions in PDF layout).
- [ ] **Lexical Baptism Before Graphics:** Never debut a term, keyword, or concept in an image without prior plain-English definition in the text immediately preceding it.
- [ ] **Minimal Code Precedes UI:** Under each section, the minimal code snippet directly precedes the UI canvas.
- [ ] **Analytical Derivation Follows UI:** Directly follows the figure, breaking down the perceptual and technical contrast.
- [ ] **Multi-Step Rhythm:** Multi-step lessons repeat this loop cleanly: `[Section Text -> Code Snippet -> Figure -> Derivation]`.

---

## 7. Two-Tier Clarity & Upfront Primitive Baptism
- [ ] **Upfront Baptism of Load-Bearing Primitives (No Swallowed Camels):** The central CSS engine primitive driving the lecture (e.g. Stacking Context, Block Formatting Context, Containing Block, Cascade Layer, Margin Collapsing, Specificity) MUST be explicitly defined in plain English **in the very first paragraph of Section 1**, BEFORE any code block, figure, or specification quote appears. Never drop a load-bearing primitive casually into prose as if the student already knows it.
- [ ] **Preemptive Acronym Baptism:** If a primitive or concept has an abbreviation or acronym (e.g. `Block Formatting Context (BFC)`, `Initial Containing Block (ICB)`), the acronym MUST be explicitly expanded and baptized in the introductory prose before it ever appears in a code comment, diagram badge, or figure caption. NEVER use unbaptized acronyms in code comments (e.g. ban `/* **RIGHT:** BFC isolates... */` unless BFC was defined in the text directly above).
- [ ] **Strict Prohibition on Academic Etymology / Latin Pedantry (No Gnat Filtering):** NEVER cite Latin, Ancient Greek, Old English, or dictionary roots for everyday English words (`context`, `fixed`, `relative`, `collapse`, `inherit`, `initial`, `revert`, `static`, `block`, `margin`, `display`). Developers do not need high-school philology. Replace pseudo-etymology with direct **Technical Nomenclature & Engine Reference Frames**.
- [ ] **Tier 1 (Passing Terms):** Ground incidental terminology parenthetically with concrete physical behavior without fuzzy metaphors (e.g. `layout models (the underlying layout system governing the container, such as switching from Flexbox to CSS Grid)`). Strict prohibition on fuzzy metaphors (no "rendering bubbles").
- [ ] **Tier 2 (Load-Bearing Primitives):** Core primitives (`fr`, `ch`, `currentColor`, `auto-fit`, `BFC`, `stacking context`, `float`, `flow-root`, `isolation`, `inline-block`, `inherit`, `initial`, `unset`, `revert`) MUST receive a dedicated 4-pillar architectural breakdown:
  1. *Technical Nomenclature & Syntax Decoding:* What the letters literally stand for in W3C specs (`fr` = *fraction* of free space; `BFC` = *Block Formatting Context*; `rem` = *root em*), or what engine reference frame the keyword selects (`relative` = offset from *its natural normal-flow position*; `fixed` = anchored to *the viewport viewport*). Zero Latin roots.
  2. *Tactile Everyday Physical Analogy:* (notebook paper, wooden bench, postage stamp, pie shares, suitcase).
  3. *Historical Context / Why We Suffered Before:* (the tangible crisis developers fought in earlier browsers).
  4. *Physical Browser Engine Calculation Routine:* (the exact sequential arithmetic/algorithm).
- [ ] **Law 7 (Concrete Physical Anchor / Anti-Word-Salad Law):** Never explain jargon with more jargon. Anchor to physical HTML widgets (`<video-player>`, `<dialog>`).
- [ ] **Law 11 (Physical Body First / .docx Principle):** Anchor to the developer's actual editor, the typed characters, and what DevTools physically displays. Ban detached fantastical/industrial analogies (factories, vacuum tubes, photocopiers).
- [ ] **Law 12 (Invisible Scaffolding Law):** Internal authoring scaffolding ("The Three-Floor Elevator", "Floor 1/2/3", "The Four Pillars", "Pillar 1/2/3/4") are STRICTLY INTERNAL blueprints and must NEVER be named or exposed to the student in headings, callouts, or prose.

---

## 8. Preemptive Nomenclature & Pearls of Wisdom Gate (`> [!WISDOM]`)
- [ ] **Preemptive Timing:** When upcoming code or markup introduces real-world industry nomenclature, component patterns, or front-end conventions (e.g. `.badge`, `.card__header`, `.btn-group`, status chips, wrapper containers, alert bars) that could create cognitive dissonance or contradict naive visual intuition, a `> [!WISDOM]` callout MUST appear BEFORE the code block.
- [ ] **Tri-Partite Deconfusion:** The callout must explicitly resolve: (1) *Nomenclature and Etymology* (why it is named this way in professional ecosystems), (2) *Ecosystem Customs* (how design systems like Bootstrap or Tailwind use it), and (3) *The Experiential Visual vs Semantic Illusion* (acknowledging what the eye sees vs what the semantic markup represents, explaining why the physical CSS layout property was required).
- [ ] **Syntax and Typography:** Callout strictly uses `> [!WISDOM]` (renders with the 💡 Pearls of Wisdom lamp icon), leads with bold title (`> **Industry Naming Conventions: ...**` or `> **Pearls of Wisdom: ...**`), contains zero hard-wraps, and contains zero em-dashes (`—` or `--`).

---

## 9. Authoritative Quoting Law
- [ ] **Primary Source Authority:** At least one verbatim quote from primary official specifications (W3C Bikeshed `.bs` files) or official documentation (MDN Web Docs).
- [ ] **Blockquote Syntax:** Formatted as a blockquote (`> quote text`).
- [ ] **Repository Citation Path:** Attribution line directly below must cite a valid local repository path: `*Spec Title, `resources/spec/csswg-drafts/...`*`.
- [ ] **Zero Book Citations:** Never cite or quote books directly to the reader (books are author research background only).

---

## 10. Code Formatting & Comment Discipline
- [ ] **Dense, Numbered Lines:** Keep code snippets concise and dense; lines under ~80 characters.
- [ ] **Full macOS Editor Window Fidelity (Ban on Mini-Code Swallowing):** Every body code snippet must render as an authentic macOS editor window (`.editor`) with titlebar dots, filename tab (`title="..."`), line numbers, and tabbed comment speech bubbles (`.cmt-bubble`). Code blocks following ordered or unordered lists must always be top-level blocks preceded by a blank line; never allow code blocks to be swallowed into list items as raw `.mini-code`.
- [ ] **End-of-Line Body Comments:** Comments in body code blocks live strictly at the END of the line (`code; /* annotation */`), never on their own line.
- [ ] **Bold Load-Bearing Words:** Comments lead with `**RIGHT:**` / `**WRONG:**` (or `**WINNER:**` / `**LOSER:**`) with one caps load-bearing word in `**bold**`. Zero check/cross emojis.
- [ ] **Comment Rendering & Word-Break Integrity:** In body code blocks, comments live at the end of the line (`code; /* **WRONG:** ... */`) and are parsed by the build engine into tabbed comment speech bubbles (`.cmt-bubble`). Never leave raw comments unparsed in unstyled boxes, and never allow code or comment copy to break mid-word (zero `word-break: break-all`).
- [ ] **Summary Code Blocks (Zero Comments Rule):** DO NOT put comments inside summary code blocks. Use ````css right ```` or ````css wrong ```` with `**DO THIS:**` / `**DO NOT DO THIS:**` headers on the line immediately above.
- [ ] **Zero Orphan Syntax (Law 18):** Every single CSS property, HTML attribute, and method in each code snippet MUST be explicitly named, unpacked, and mechanically justified in the surrounding prose. If an attribute or property is not explained in the text, delete it from the code block.
- [ ] **Snippet Budget Gate (Law 18):** Body code snippets must not exceed 8 to 12 lines of active code. Monolithic multi-component dumps (e.g. whole 30-line HTML tables or full CSS files) are strictly forbidden.
- [ ] **Zero Back-to-Back Snippets (Law 18):** Placing two code snippets consecutively without intervening explanatory prose is an automatic audit failure. Every code snippet must follow: `[Prose Setup] -> [Snippet] -> [Prose Derivation / Figure]`.
- [ ] **Algorithmic Idiom Deconstruction (Law 18):** Whenever an advanced CSS idiom or hack is shown (e.g. `background-attachment: local, scroll` or `content: attr()`), the prose must deconstruct the underlying browser layout or painting algorithm.


---

## 11. Closing Summary & Table Gate
- [ ] **Streetwise Review Header:** Lead with bold `**Technical Title**` on its own line, followed by practical context (never conversational filler like "Look,").
- [ ] **Section Subtitles:** Use `❒ {Subtitle}` headers.
- [ ] **Indented Points:** Numbered points with `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` sub-lines formatted on a single continuous line.
- [ ] **Core Takeaways:** Use `➔ NEVER`, `➔ ALWAYS`, and `➔ IF ... THEN ...` bullets with bolded load-bearing words.
- [ ] **Closing Table Position:** Comparison table must be the LAST block in the file.
- [ ] **Strict 3-Column Budget:** Printable PDF width allows strictly 3 columns (`| | **COL B**<br>(subtitle) | **COL C**<br>(subtitle) |`).
- [ ] **Exact Divider Syntax:** Divider row is exactly `| ---: | :--- | :--- |`.
- [ ] **Bold Dimensions First:** Column 1 starts with a bold dimension in every row.
- [ ] **Transposition Law:** When comparing 3 or more entities, transpose the table so concepts are rows, never expanding to 4 or 5 columns.
- [ ] **Code Splitting:** Separate prose from code with `<br>` and split multi-part code strings across separate backticks with `<br>` between them.

---

## 12. Mechanical & TTS-Safety Gate
- [ ] **Zero Hard-Wraps:** One continuous line per paragraph, bullet, and table row. Never hard-wrap.
- [ ] **Zero Em-Dashes:** No em-dashes (`—` or `--`) anywhere in the lecture.
- [ ] **Comprehensive Depth:** Word count between 3,000 and 4,500+ words.
- [ ] **Page Count:** 16 to 32+ PDF pages.
- [ ] **Zero Build Warnings:** `node src/build-lectures.mjs {n}` exits with Code 0 and ZERO warnings.

---

## 13. Cognitive Accessibility, B2 Language & Bold Baptism Gate
- [ ] **The "Headache & Short Attention Span" Test:** Can a tired developer with a splitting headache read through the text without experiencing mental fog? Are sentences short, active, and direct (target average 12–18 words, never over 22 words)? Are paragraphs strictly 2–4 sentences with generous whitespace?
- [ ] **CEFR B2 Language Ceiling:** Is the text written in clear, accessible everyday English? Are all elevated, convoluted, Latinate, or purple academic phrases purged in favor of direct, plain equivalents (*"runs on your computer"* instead of *"executes within the compilation lifecycle"*)?
- [ ] **Strict Zero-Degradation Gate:** Is 100% of the technical depth and precision preserved? Does the lecture fully equip the student to ace the exact same demanding interview questions as a senior web developer without dumbing down?
- [ ] **Proper Step-by-Step Concept Building:** Does the lecture start from the physical reality (file extension, terminal build step vs browser runtime, HTML tags on screen) and build causality step-by-step before introducing advanced rules?
- [ ] **Mandatory Bold Baptism of Key New Terms:** In key paragraphs where new terms, keywords, concepts, or primitives are first baptized and introduced, are they formatted in bold (`**term**`) to provide instant visual scanning anchors?
- [ ] **Iterative Chapter Versioning:** If this lecture is a revision, has the prior version been properly archived under `{n}-old-01`, `{n}-old-02`, etc., keeping the active version as `{n}.md`?

