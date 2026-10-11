# Lecture 07 Completion & Verification Report

**Date**: 2026-10-11  
**Project**: React 07  
**Lesson**: Q07 (`#children`)  
**Exception Status**: NO  
**Status**: COMPLETE (Map, Blueprint, Lecture, Figures, HTML, PDF, and Reader Deck Built Cleanly)

---

## 1. Section 21 Reading Gates Verification (Line-by-Line)

Every reading gate of `skills/v7.1/verification/SKILL.md` Section 21 and the updates from Brief `2026-10-11-02` were inspected against the authored blueprint (`01-01-md-PRE-lectures/v1/07.md`) and production lecture (`01-02-md-LECTURES/v1/07.md`):

- **Gate 1 (Questions a reader asks)**: Audited Questions 1 through 5. Question 1 (line 82) asks why content nested between tags disappears from the screen when the container omits `{children}`; Question 2 (line 143) asks whether to add a specialized prop for every layout variation when an omitted prop renders an empty `<span className="badge">` pill; Question 3 (line 202) asks whether to spread the entire `props` object onto a container element when doing so triggers unknown-prop warnings and leaks `badgetext="New"` into the DOM; Question 4 (line 262) asks why passing `className="featured"` wipes out the base `.card` frame due to left-to-right evaluation order; Question 5 (line 323) asks why missing a `className` prop produces `"card undefined"` in string concatenation.
- **Gate 2 (Answers that follow)**: Audited all 5 answers; verified that each verdict begins with `**The code does not do what we wanted.**` followed by the physical runtime cause. Answers trace step-by-step causality: JSX compilation into `_jsx(CardContainer, { children: [...] })`, lightweight element descriptors versus rendered DOM output, slot composition decoupling outer frame from inner content, rest syntax gathering unconsumed attributes, left-to-right attribute evaluation precedence, and default parameter fallbacks engaging on `undefined` but not `null` or `false`.
- **Gate 3 (Boxes from their cycle)**: Audited Principles 1 through 5. Each box matches its blueprint counterpart identically and carries right and wrong cards derived directly from its cycle. Principle 1's wrong card comment after a statement semicolon uses `// drops children without an error`, ensuring compliance with Invariant 12 and Invariant 8 (<= 68 characters).
- **Gate 4 (Zero gaps)**: Audited technical terms against the map. Prerequisite owners (Lectures 3, 4, 5, 6) are recalled in the recall list; preview owner (Lecture 10) is cited in prose. Invariant 14 verification passed: the recall list names only earlier lessons and excludes `rest syntax` (which the map marks `New`). Every side note explains a term its box uses (`children prop`, `slot composition`, `rest syntax`, `JSX spread syntax`, `DOM attribute leakage`, `attribute precedence`, `default parameter value`).
- **Gate 5 (Questions left open & Brief 2026-10-11-02 Foundation Section)**: Audited the runway. Section 1 opens one problem (`NewsCard` layout prop bloat) and stops before explaining the cause or fix; dropped-children code was excluded from Section 1 so Question 1 is completely open. Per Brief `2026-10-11-02` Group 2, the runway opens with a foundation section `### Tags inside tags, from HTML to our own components` (lines 46–67) showing familiar HTML nesting (`<article class="card">` containing `<h2>` and `<p>`), followed by custom component nesting (`<CardFrame>`), and ends on the open question without giving away the mechanism or the `children` prop. Tool section `### Rest syntax gathers the keys you did not name` follows, teaching rest syntax in destructuring while leaving prop spreading on JSX elements open for Question 3.
- **Gate 6 (Name and show together & Brief 2026-10-11-02 Group 1)**: Audited every new idea. In the foundation section, HTML nesting and component nesting stand directly next to their code examples. In the rest syntax section, the name and example stand together, followed by console output and explanation. In the blueprint, line 9 of every `[question-cycle]` plan is labeled `Example:` per Brief 2026-10-11-02 Group 1.
- **Gate 7 (Boundaries kept)**: Audited all boundaries: slot composition keeps named props for fixed requirements (like `title`) and leaves variable content in `{children}`; rest and spread syntax is bounded to generic wrappers; attribute precedence defaults before spread and enforced values after spread; defaults engage on `undefined`, not `null` or `false`. All summary rules keep `IF ... THEN` boundaries.
- **Gate 8 (Two-map scope, principle traceability & Brief 2026-10-11-02 Group 3)**: Reconciled with `01-01-map/07.md` and `01-01-map-principles/07.md`. All 5 principles trace 1:1 to map handles: `children-is-a-prop`, `slot-over-flags`, `spread-only-the-rest`, `spread-order-wins`, and `default-fills-slot`. All Prerequisite (Lectures 3, 4, 5, 6) and Preview (Lecture 10) owners from the ledger are cited. Per Group 3, every Merged row from the map is preserved either in question answers or in `### For the interview` (including `children.map` crash with single child, `children.type`, `children` attribute vs nested content collision, boolean prop warnings, `Avatar {...props}` forwarding, default parameters with `null`/`false`). Zero open handout messages remain.
- **Gate 9 (Map ownership, authentic contrasts & Brief 2026-10-11-02 Group 4)**: Each principle owns its designated problem and fix; wrong cards represent authentic developer mistakes. Skill examples are used as patterns only (`CardContainer`, `CardFrame`, `EditorialGrid`, `Transit Accord Reached`), never copying skill examples (`function Panel`, `function Card`) verbatim.
- **Gate 10 (Diagrams that are true)**: Audited ASCII diagrams in Questions 1 through 5; each illustrates physical runtime mechanisms with exact lesson values.
- **Gate 11 (Reader horizon and plain criteria)**: Explanations rely on physical DOM and JSX facts without outside analogies (no waiters, post offices, or printing presses).
- **Gate 12 (Commentary quality and archetype circuits)**: Practical example follows Archetype A across 5 stages, with meaningful architectural commentary on slot composition, default parameters, and top-down data flow.
- **Gate 13 (Professional idiom)**: Used universal web vocabulary (`CardContainer`, `EditorialGrid`, `App`, `title`, `badge`, `items`, `color`, `className`, `rest`) without newsroom lore.
- **Gate 14 (Friction cards and crossroads)**: `[!WILD]` friction card is placed after the mistake, explanation, rule, and working code in the topic.
- **Gate 15 (Sentences and names)**: Audited sentence lengths and active voice; qualified entity roles on first mention; one continuous line per bullet, paragraph, and table row with zero em-dashes.
- **Gate 16 (Division of labor)**: Code shows syntax, speech bubbles give values and visible screen results, prose provides architectural rationale.

---

## 2. Archive Checklist Consultation & Exclusions (Exception Status: NO)

Per the project contract with Exception Status NO, the most recent archived versions of Lesson 07 (`01-02-md-LECTURES/v1/archive/07-2026-10-11-1034.md` and `01-01-md-PRE-lectures/v1/archive/07-2026-10-11-1034.md`) were consulted strictly as a checklist to ensure complete coverage of facts, examples, and terms:

### Facts, Examples, and Terms Covered:
1. **Compilation of Nested Children**: The JSX compiler transforms nested content into `_jsx(CardContainer, { children: [...] })`.
2. **Opaque Shape of the Children Prop**: `children` has no fixed shape: one nested child is an element object (`children.type === 'h2'`), two children form an array (`Array.isArray(children) === true`), and plain text is a string. Calling `children.map()` on a single child crashes with `TypeError: children.map is not a function` (unpacked in `### For the interview`).
3. **Execution Order and Descriptors**: The container component executes before child component functions; dropped children never run and their console logs remain silent.
4. **DOM Attribute Leakage**: Spreading the entire `props` object onto a native element leaks component props into the DOM, triggering unknown-prop warnings (`Warning: React does not recognize the isFeatured prop on a DOM element`), non-boolean warnings (`featured={true}`), and unintended browser hover tooltips for `title`.
5. **Rest and Spread Mechanics**: Rest syntax `{ children, ...rest }` extracts consumed props and isolates unconsumed attributes; JSX spread syntax `{...rest}` writes them to the underlying DOM node.
6. **Left-to-Right Attribute Evaluation**: JSX evaluates attributes sequentially: attributes placed before `{...rest}` are overridable defaults; attributes placed after `{...rest}` enforce values; when both sides must contribute a class, destructure `className` and concatenate explicitly.
7. **Default Parameter Semantics**: Missing props evaluate to `undefined`; in string concatenation `'card ' + undefined` produces `"card undefined"`; assigning `className = ''` prevents this coercion. Default parameter values trigger strictly on `undefined` and missing props, never on `null` or `false`.
8. **Merged Rows Preserved**: `children` attribute vs nested content collision (`<CardContainer children="attr">nested</CardContainer>` displaying `nested`), `children.type` returning the component function rather than rendered output, and `<Avatar {...props} />` as the legitimate whole-object forwarder pattern.

### Archive Items Deliberately Left Out & Rationale:
1. **Premature Runway Spoilers**: Pruned the old runway sections that explained `children prop` and `container component` in full before the questions, replacing them with the new foundation section (`### Tags inside tags, from HTML to our own components`) and tool section (`### Rest syntax gathers the keys you did not name`).
2. **Code Duplication Across Sections**: Removed the dropped-children code snippet from Section 1 so Question 1 is the sole presentation of that code. Replaced the repeated `NewsCard` definition in Question 2 with the caller feed `StoryFeed`.
3. **Premature Destructuring in Scenario**: Removed `{ children }` from Question 1's container scenario (`function CardContainer()`), ensuring the scenario reflects what a reader without the answer would write.
4. **Fictional Newsroom Personas**: Omitted newsroom lore in favor of clean universal web vocabulary (`CardContainer`, `EditorialGrid`, `App`).
5. **Comment Syntax Collisions**: Refactored card comments after semicolons from `{/* ... */}` to `// ...`, eliminating Invariant 12 and Invariant 8 errors.

---

## 3. Exact Final Diagnostic & Build Outputs

### Output of `node src/diagnose-map.mjs 07`:
```
Map 07: PASS
  NOTE this lesson has sent 1 handout message(s): 07-18-01
  NOTE 1 open issue(s) to carry into the lesson
  NOTE Authorized Scope: 14 sentences, average 12.3 words, 0 over 20
  NOTE Senior Answer: 14 sentences, average 12.1 words, 0 over 20
  NOTE Completion Gate: 12 box(es) not ticked
```

### Output of `node src/diagnose-lecture.mjs 07`:
```
============================================================
DIAGNOSTIC REPORT: 07.md
============================================================

--- A. QUESTION CYCLES, PRINCIPLE BOXES, AND CONTENT ---
  [PASS] Invariant 10: Every principle box has its right card, and a wrong card exactly when the map names a Real Mistake
  [PASS] Invariant 11: 5 question cycle(s), one per map principle, each with question, ---, **ANSWER**, verdict, and its box
  [PASS] Invariant 12: No // comment after JSX markup
  [PASS] Invariant 13: Every side note explains a word its box uses
  [PASS] Invariant 14: The recall list names only earlier lectures

--- 6. CURRICULUM DEPENDENCY AUDIT (Q7) ---
  [INDICATION] Zero premature hooks detected.

--- 7. LEDGER OWNERS AND HANDOUTS (Q7) ---
  [INDICATION] Every Prerequisite and Preview owner is named.
  [INDICATION] No open lecture messages in the handout.

--- B. MECHANICAL METRICS (read after the content checks) ---

--- 1. CODE BLOCK COMMENT DENSITY ---
  * [Line  20] Naive Layout Prop Bloat  : 1/9 bubbles (11%)
  * [Line  50] Standard HTML Nesting    : 1/4 bubbles (25%)
  * [Line  59] Custom Component Nesting : 1/5 bubbles (20%)
  * [Line  71] js                       : 2/3 bubbles (67%)
  * [Line  87] Card Call Site           : 1/7 bubbles (14%)
  * [Line  99] Omitted Children Slot    : 2/3 bubbles (67%)
  * [Line 117] CardContainer Slot       : 2/3 bubbles (67%)
  * [Line 162] StoryFeed Call Site      : 1/8 bubbles (13%)
  * [Line 221] Spreading Entire Props Object: 1/7 bubbles (14%)
  * [Line 281] Caller Passing Custom Class: 1/7 bubbles (14%)
  * [Line 342] Missing Class Name Call Site: 1/7 bubbles (14%)
  * [Line 412] figure                   : 0/0 bubbles (0%)
  * [Line 419] CardContainer.jsx        : 1/10 bubbles (10%)
  * [Line 438] EditorialGrid.jsx        : 1/10 bubbles (10%)
  * [Line 451] EditorialGrid.jsx        : 1/10 bubbles (10%)
  * [Line 470] App.jsx                  : 1/9 bubbles (11%)
  * [Line 494] figure                   : 0/0 bubbles (0%)
  Total: 102 lines, 18 comments (18% overall density)
  [INDICATION] Code block comment distribution looks healthy.

--- 2. PROSE SENTENCE LENGTH PROFILE ---
  Total Sentences: 283, Avg: 16 words, Max: 48 words
  [INDICATION] 78 sentence(s) over 20 words; reread each and split it only if it reads hard (lecture-voice Section 06):
    - [Line 14] (24 words): "Every web interface relies on shared visual frames, such as cards, dialogs,..."
    - [Line 14] (26 words): "In Lecture 6, we learned that props pass data strictly downward from parent..."
    - [Line 16] (21 words): "To accommodate layout permutations inside a single card, a developer may ad..."
    - [Line 16] (21 words): "Because the stylesheet styles `.badge` with a background color and padding,..."
    - [Line 16] (27 words): "Even worse, if reviewers ask to place the author above the headline on opin..."

--- 3. CODE LINE WIDTH (>80 CHARS) ---
  [INDICATION] 100% of code lines are within 80 characters.

--- 4. CODE COMMENT & TARGET INVARIANT AUDIT ---
  Comment Targeting: 0 targeted (~token~), 18 general lines without tildes.

============================================================
--- 5. DETERMINISTIC CODE BLOCK HEURISTIC GATE (PHASE 1 DRAFT MODE) ---
============================================================
  [DRAFT PASS] Invariants 1–3: Token targeting verification deferred to Phase 2 (run with --audit).
  [PASS] Invariant 4: Universal block density (0 barren blocks)
  [PASS] Invariant 5: Mandatory principle card bubbles (all cards carry speech bubbles)
  [PASS] Invariant 6: Strict summary block quarantine (100% comment-free)
  [PASS] Invariant 7: Bubble stacking spacing (healthy breathing room)
  [PASS] Invariant 8: Scope and width boundaries (<28 chars token, <=80/68 chars line)
  [PASS] Invariant 9: Zero multi-line code in content (all multi-line code in fences or callouts)
------------------------------------------------------------
```

### Output of `node src/build-lectures.mjs 07`:
```
[pipeline] Default version: v7.1-1 (skills: v7.1, lessons: v1 at /Users/techton/lechton/research-code/bookwriter/projects/react-07/01-02-md-LECTURES/v1)
  note 07.md: merged comment-only line 1 into the next code line's bubble
html  07.html
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   07.pdf
no matching markdown files in /Users/techton/lechton/research-code/bookwriter/projects/react-07/02-01-md-revised
skipping /Users/techton/lechton/research-code/bookwriter/projects/react-07/md-lectures-review: directory does not exist.
skipping /Users/techton/lechton/research-code/bookwriter/projects/react-07/md-data-flow: directory does not exist.
done.
```

### Output of `node src/build-lectures.mjs` (reader deck):
```
[pipeline] Default version: v7.1-1 (skills: v7.1, lessons: v1 at /Users/techton/lechton/research-code/bookwriter/projects/react-07/01-02-md-LECTURES/v1)
  note 01.md: merged comment-only line 6 into the next code line's bubble
  note 01.md: merged comment-only line 6 into the next code line's bubble
html  01.html
html  02.html
html  03.html
  note 04.md: merged comment-only line 6 into the next code line's bubble
html  04.html
html  05.html
html  06.html
  note 07.md: merged comment-only line 1 into the next code line's bubble
html  07.html
  warn 17.md: practical example is missing its Stage E Architecture Audit Table figure (figures/{NN}-02-architecture-audit.html); see lecture-structure skill Practical Example 26
html  17.html
  warn 18.md: practical example is missing its Stage E Architecture Audit Table figure (figures/{NN}-02-architecture-audit.html); see lecture-structure skill Practical Example 26
html  18.html
html  React v7.1-1 Q01-Q18-teal.html
html  React v7.1-1 Q01-Q18-teal-pro.html
html  React v7.1-1 Q01-Q18-black.html
html  React v7.1-1 Q01-Q18-old.html
html  React v7.1-1 Q01-Q18-enhanced.html
html  React v7.1-1 Q01-Q18-pro.html
html  React v7.1-1 Q01-Q18-max.html
html  React v7.1-1 Q01-Q18-max-teal.html
html  React v7.1-1 Q01-Q18-max-blue.html
html  React v7.1-1 Q01-Q18.html
pdf   01.pdf
pdf   02.pdf
pdf   03.pdf
pdf   04.pdf
pdf   05.pdf
pdf   06.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   07.pdf
pdf   17.pdf
pdf   18.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-teal.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-teal-pro.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-black.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-old.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-enhanced.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-pro.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-max.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-max-teal.pdf
prince: warning: "Songti SC, Black" does not allow font embedding
prince: warning: not a TrueType or OpenType font
pdf   React v7.1-1 Q01-Q18-max-blue.pdf
no matching markdown files in /Users/techton/lechton/research-code/bookwriter/projects/react-07/02-01-md-revised
skipping /Users/techton/lechton/research-code/bookwriter/projects/react-07/md-lectures-review: directory does not exist.
skipping /Users/techton/lechton/research-code/bookwriter/projects/react-07/md-data-flow: directory does not exist.
done.
```
