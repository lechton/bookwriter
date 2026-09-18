# OPERATIONAL AUDIT CHECKLIST — Vue.js Interview Lectures (vue-01)

This checklist is the permanent, mandatory operational gate for authoring and auditing every lecture in the `vue-01` series. An **AUDIT** requires full inspection against every gate below, followed immediately by executing all necessary corrections.

---

## 1. Meaningful Code → Mandatory UI / Architecture Visualization Gate
- [ ] **(a) Major Code Snippets Followed by Visualization (Zero Naked Snippets):** Every single code block in the lecture that presents meaningful Vue logic (reactivity definitions, component props/emits, watchers, slots, store mutations, router guards) MUST be accompanied by a rendered figure or architecture visualization directly beneath it. Never leave meaningful logic visually naked.
- [ ] **(b) Visual Architecture Selected for Purpose:**
  - *Comparative Figures (Duel / Tournament):* Symmetrical side-by-side cards, matching 1-line top pills (`✕ BROKEN` vs `✓ REACTIVE`, or `✕ WRONG` vs `✓ RIGHT`), and strictly matched 2-line footers (`min-height: 52px;`) splitting cleanly at semicolons. Use ONLY when comparing competing patterns, reactivity errors vs fixes, or Options vs Composition API.
  - *Illustrative Figures (Textbook Anatomy / Execution Realization):* Direct structural rendering of how data and effects flow in the Vue engine (Proxy trap pipelines, dependency graphs, component trees, patch flag matrices).
- [ ] **Strict 1:1 Code Synchronization:** Every reactive property, prop name, event, method, and element rendered in a figure canvas MUST appear in the code snippet directly preceding it.
- [ ] **Modern Standalone HTML Figure Architecture:** All visual aids are authored as standalone HTML/CSS components in `md-lectures/figures/{lecture_num:02d}-{figure_seq:02d}-{slug}.html` and embedded via ````markdown ```html-figure src="..." caption="..."``` ````. JavaScript and external CDNs are strictly banned.
- [ ] **Unique Container CSS Scoping:** Every figure stylesheet must be strictly scoped under a unique root container class (e.g. `.fig-proxy-trap`, `.fig-ref-unwrapping`, `.fig-pinia-store`) to prevent Prince global CSS cascade collisions across lectures.

---

## 2. 10/10 Perfection Self-Audit & Visual Quality Gate
- [ ] **The 10/10 Perfection Self-Audit Gate (Zero Disturbances Law):** Quality must be strictly 10/10 with zero compromises. At the conclusion of authoring every image, audit the result against the reference benchmark. If any visual disturbance, layout crowding, or label clipping is detected, rework it immediately.
- [ ] **Clean Component Separation (No "Box Next to Box"):** The rendered component body must contain ONLY its authentic UI elements matching the code fence above. NEVER place explanatory comment boxes or tag pills inside the component body next to interactive elements. Diagnostic explanations live strictly in the header pills or the dedicated full-width footer strip.
- [ ] **Zero Duplicate Annotations Law (No Dual Notes / Anti-Gullibility Law):** NEVER tolerate duplicate explanatory descriptions or redundant error notes on the same diagram panel. The component preview body displays strictly the element/state; the diagnostic cause-and-effect explanation belongs strictly in ONE place: the dedicated footer strip.
- [ ] **100% Saturated True-to-Code Colors (Zero Opacity Bleaching):** Render actual full-saturation colors. Overridden or broken status belongs strictly to the top pill, container border, and footer strip.
- [ ] **Visual Horizontal Centering:** Header verdict pills, labels, and tags on top must be visually and mathematically centered horizontally over primary diagram elements.
- [ ] **Clean Typography & Zero Border Collisions:** Zero letters walking over borders, zero text collision, and $\ge 8\text{px}$ breathing room between text badges and borders.
- [ ] **Legible Typography Floor ($\ge 11.5\text{px}$ / Ban on Micro-Print):** All text, dimensions, and badges must be $\ge 11.5\text{px}$.
- [ ] **Clean Inspection Images (Zero Workspace Clutter):** Temporary inspection PNG files created via `pdftoppm` or test scripts MUST be cleaned up immediately after visual verification by running `node src/clean-inspection-images.mjs`. Never commit or leave temporary PNGs in output or template folders.

---

## 3. Logical Clarity & Concise but Never Cryptic Law
- [ ] **Concise but Never Cryptic Law:** Footer comments must directly explain cause-and-effect contrast using concrete property and state references: (1) what state or binding was declared, (2) the semicolon break `;`, and (3) the physical on-screen consequence.
- [ ] **Universal Familiar Lexicon Law (No Designer/Esoteric Jargon):** Every visual figure, card label, button label, caption, and diagnostic comment must use language that the student is already intuitively familiar with or has been explicitly baptized and introduced previously in prose.
- [ ] **Surveillance Against Poisonous Documentation Jargon (Function First, Jargon in Parentheses):** Official documentation contains poisonous jargon (*singleton*, *factory function*, *memoization*, *idempotency*, *polymorphism*). Verify that no classical design pattern or compiler abstraction is used as a bare predicate or standalone explanation. The physical runtime function or operational behavior must always be stated first, followed by the jargon term in parentheses (e.g., "Node keeps only a single shared copy of that object alive in server memory for all visitors (a pattern known as a **singleton**)").

---

## 4. Opening Ladder Gate
- [ ] **Beat Count:** Exactly 5 to 7 numbered beats opening the body.
- [ ] **Sentence Length Ceiling:** Strict $\le 20$ words per sentence. No sentence over 20 words.
- [ ] **Structural Progression:** (1–2) The scene $\to$ (3–4) The failure moment $\to$ (5) The question (stating visible conflict) $\to$ (6) The danger $\to$ (7) The promise.
- [ ] **Strict Ban on Premature Mechanism Naming:** Never name the lecture's mechanism terms in beats 1-6. Write the visible physical behavior instead.
- [ ] **Single Actor Throughout:** One person with one unambiguous role (a frontend engineer, a junior developer, a checkout developer).
- [ ] **Tangible Nouns:** Every noun is exactly one tangible thing: a person, a visible button/input, a file, or a runtime event.

---

## 5. Pedagogical Clarity & Depth Gates
- [ ] **Harmonious Code + UI Step Rhythm:** Every section starts with 2–3 sentences of introductory framing before any code or figure appears.
- [ ] **Inverted Pyramid of Truth & Anti-Truth-Bomb Gate:** Key operational constraints and companion declarations (e.g. `reactive` with `toRefs`, `v-for` with `:key`, composable event listeners with `onScopeDispose`) are taught upfront in Section 1. The `> [!TIP]` callout provides architectural synthesis only, never an omission dump of a fatal platform gotcha.
- [ ] **Upfront Baptism in Section 1:** The primary mechanism that answers the interview question is baptized in the very first paragraph of Section 1.
- [ ] **Four-Pillar Architectural Breakdown in Section 2:** Load-bearing primitives receive all 4 pillars: Technical Nomenclature, Everyday Physical Analogy, "Why We Suffered Before" Contrast, and Physical Engine Routine.
- [ ] **Zero-Orphan-Syntax (Law 18):** 8–12 lines per snippet budget; every declared property, method, or directive is mechanically justified in surrounding prose. Ban back-to-back code blocks.
- [ ] **Authoritative Quoting Law:** At least one verbatim quote from official Vue sources cited with its file path in `resources/` (or `documentation official/vue/`). No book citations.
- [ ] **Glossary:** 4 to 6 core terms formatted as `- **Term**: Plain-English definition without em-dashes.`
- [ ] **Summary Structure:** Starts with bold `**Technical Title**` on its own line, practical context, `❒ Subtitles`, numbered points with `<br>&nbsp;&nbsp;&nbsp;&nbsp;`, right/wrong mini-fences with verdict in tag (` ```vue right `) under `**DO THIS:**` / `**DO NOT DO THIS:**` headers.
- [ ] **Closing Table:** Strictly 3 columns (`| | **COL B**<br>(subtitle) | **COL C**<br>(subtitle) |`), divider `| ---: | :--- | :--- |`, bold dimension in column 1. Transposition Law strictly applied.
- [ ] **Mechanical Build Gate:** `node src/build-lectures.mjs` exits with ZERO warnings.
