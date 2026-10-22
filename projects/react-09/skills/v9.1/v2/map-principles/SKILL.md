---
name: map-principles-v2
description: >
  River Version (v2) Principle Map skill for `01-01-map-principles/v2/{NN}.md`.
  Reads the question bank, syllabus card, official React corpus, and headless Chrome
  runtime to produce a complete River Version Principle Map that includes the
  General Concepts Introduction (Runway Plan), Root Distinctions, Real Beginner
  Mistake vs. Interview Depth, and River Progression + Pertinent Visual Comparisons
  (replacing the old `pre-lecture` pass).
---

# River Version (`v2`) — Principle Map Skill (`01-01-map-principles/v2/{NN}.md`)

## 1. Purpose in the River Version (`v2`) Pipeline

In the **River Version (`v2`)** architecture (as distinct from the **Original Version (`v1`)**), creating a lesson takes two steps instead of five:
1. **Step 1 — River Version Principle Map (`01-01-map-principles/v2/{NN}.md`)**: Gathers every fact from the official corpus and headless Chrome runtime, routes every candidate in the `Candidate Ledger`, inventories every term in the `Terms` table, plans the **General Concepts Introduction (The Runway)**, and defines the **3 to 5 Principles** with their philosophical Root Distinction, progressive River Example step, pertinent `✓`/`✗` visual comparison, and clean `> [!PRINCIPLE]` box.
2. **Step 2 — River Version Lecture (`01-02-md-LECTURES/v2/{NN}.md`)**: Directly authors the finished River Version lecture from `01-01-map-principles/v2/{NN}.md`, compiled by `node src/build-river.mjs {NN}` into `01-03-md-lectures-HTML/v2/{NN}.html` and `01-04-md-lectures-PDF/v2/{NN}.pdf`.

There is **no separate `01-01-md-PRE-lectures` pass** in the River Version (`v2`), because `01-01-map-principles/v2/{NN}.md` plans both the General Concepts Runway and the progressive River Example directly inside the map.

---

## 2. What the River Version (`v2`) Map Preserves from the Original Version (`v1`) Map

Every `01-01-map-principles/v2/{NN}.md` file keeps the four rigorous verification pillars of the Original Version (`v1`):

1. **Corpus & Runtime Verification (`## Sources Read`)**:
   - Resolve the official React corpus with `node ../../tools/resolve.mjs corpus` and read every `learn/` and `reference/` page for the topic, including every `<Pitfall>`, `<DeepDive>`, `<Recap>`, and `<Challenge>`.
   - Reproduce every claim, console warning/error, DOM node in the Elements panel, and Vite build behavior in a real React 19 + Vite runtime driven by headless Chrome. Never guess warning strings or runtime behavior.
2. **Scope Routing (`## Candidate Ledger`)**:
   - Every candidate fact found in the corpus, runtime, or syllabus card gets a row in the `Candidate Ledger` with one of seven dispositions: `Principle`, `Merged`, `Supporting`, `Prerequisite`, `Preview`, `Deferred`, or `Dropped`.
   - Every `Prerequisite`, `Preview`, and `Deferred` row names its exact owning question (`QNN #topic_tag`) so no lesson steals a later chapter's topic.
3. **Lexical Hygiene (`## Terms`)**:
   - Every React, browser, JavaScript, or general term used in the lesson appears in the `Terms` table with its `kind`, `status` (`Recall` or `New`), `first lesson` (`QNN #topic_tag`), `refresher` (`yes` or `no`), and `first needed in`.
   - Every term with `refresher: yes` (or `New` general/JavaScript prerequisite concept) is scheduled into `## General Concepts Introduction (Runway Plan)` so the reader meets it in plain JavaScript/HTML before Principle 1.
4. **Spoken Interview Synthesis (`## Senior Answer`)**:
   - A natural, spoken paragraph that answers the chapter's interview question by walking through all principles in order.

---

## 3. The Four River Version (`v2`) Upgrades Inside `01-01-map-principles/v2/{NN}.md`

### Upgrade A — `## General Concepts Introduction (Runway Plan)` (Replaces `pre-lecture`)

Before the principles begin, a River Version (`v2`) lecture opens with a comprehensive **General Concepts Introduction (The Runway)** that teaches every general JavaScript, browser, or HTML prerequisite one idea at a time. The map plans this section explicitly in `## General Concepts Introduction (Runway Plan)`:
- **Theme**: The real-world page problem that motivates the chapter (for example, building a page with twenty article cards without copying and pasting markup twenty times).
- **Ways / Starting Point**: When the chapter's topic is one of 2 to 4 ways a developer can approach a problem (or contrasts two approaches, such as copy-pasting markup vs. splitting out a reusable component), plan the opening `tree` comparison or `> [!WAYS]` table.
- **What This Lesson Stands On (Recall)**: Bullet list of the exact facts recalled from earlier lessons (`Q01`, etc.) that this chapter stands on.
- **Runway Sections (`###` Headings Before Principle 1)**: Plan 2 to 5 short `###` subsections that introduce each general JavaScript/browser concept (`refresher: yes` rows from the `Terms` table, plus the project file setup) in plain JavaScript or HTML before React's rules begin. Each Runway section teaches **one concept at a time** with a 3 to 5 line snippet or `tree` diagram.

### Upgrade B — Philosophical `Root Distinction` per Principle

Every principle in `## Principles` must define its **Philosophical Root Distinction** before any code:
- **Junior Blurred View**: What two distinct steps or concepts blur together as one automatic thing in a junior developer's head (for example, *"I wrote `function ArticleCard()`, so my card should appear on the page"*).
- **Senior Root Grounding (`###` Opening Heading)**: The `###` heading and opening sentence that separate those two things at the root before showing any code (for example, `### Writing the component function and using its tag are two separate steps`).

### Upgrade C — Honest Separation of `Real Beginner Mistake` vs. `Interview Depth`

Never invent a fake beginner mistake just to force a code comparison. In every principle, record two separate fields:
- **Real Beginner Mistake (Daily Coding)**: What a developer actually does wrong in daily work (for example, writing `function ArticleCard()` and forgetting to place `<ArticleCard />` inside `App`, so the page is blank).
- **Interview Depth (Nuance / Follow-Up)**: What a senior interviewer probes as a follow-up (for example, why we write `<ArticleCard />` instead of calling `{ArticleCard()}` directly, or why `<ArticleCard>` never appears in the browser's Elements panel). Keep interview-only nuances planned as a separate `> **In an interview (...)**` callout after the Principle Box so they never clutter the primary beginner mental model.

### Upgrade D — Minimal, Video-Demo-Friendly `River Progression`, Optional Reuse Without Back-Reference Load, and Embedded `UI Browser Previews`

Because the River Version (`v2`) builds a clean, progressive practical example across Principles 1..N (never repeating the principles a second time in a separate `Let's Design a Practical Example` section at the end), every principle in `## Principles` specifies:
- **Minimal, Video-Demo-Friendly Example (`-gemini` Standard)**:
  - Pick an archetypical example whose rendered UI is **immediately visible and visually clear inside a small browser window** for both a live video demo and an embedded book browser preview (for example, Lecture 1's `Cart` with `Items: 3` and `Buy 3 items`, Lecture 4's `ArticleCard` / `Footer` / `CommentBox`, or Lecture 11's `Mail` inbox).
  - **Introduce each element only in the Principle that needs it**: Never clutter Principle 1 or 2 with elements that are only tested in Principle 3 (for example, in Lecture 1, Principles 1 and 2 contain only `<p>Items: {count}</p>` and `<button>Buy {count} items</button>`, and `<input placeholder="Note to the shop" />` is added only in Principle 3).
  - **Reuse across chapters only when natural, with zero back-reference cognitive load**: You may reuse or extend an example from an earlier chapter **if and only if** it naturally fits the new principle, and without heavy *"As we saw in Lecture X..."* prose.
- **Embedded UI Browser Previews & Pertinent Visual Comparisons**:
  - Specify the exact **UI browser mockups** (` ```page `, ` ```shop `, ` ```mail `, ` ```dom `, ` ```devconsole `, ` ```overlay `, and side-by-side `::: row` / `::: col` comparisons) and structural `tree` Box-to-Boxes diagrams that show the reader what happens on the screen in each principle.
- **Drafted Principle Box (`> [!PRINCIPLE]`)**: The exact 2-part Principle Box title (`> [!PRINCIPLE] Principle N: [Short Name] — [Core Rule]`) and 2 to 3 sentence plain-English body (with **zero inline code blocks or backtick code calls** and **zero parentheses**).

---

## 4. Required Section Order of `01-01-map-principles/v2/{NN}.md`

1. `# Q{NN} Principle Map (River Version v2): [Chapter Title]` + metadata bullets (`Version`, `Bank Row`, `Topic Tag`, `Interview Question`)
2. `## Authorized Scope`
3. `## General Concepts Introduction (Runway Plan)` (`Theme`, `Ways / Starting Point`, `Recall List`, `Runway Subsections 1..K`, `Four-Principle Overview Table`)
4. `## Principle Thread` (`Anchor`, `Axis`, `Why This Axis`, `Spoken Preview`, `Closing Line`)
5. `## Sources Read`
6. `## Candidate Ledger`
7. `## Terms`
8. `## Principles` (`### Principle 1..N` with `Handle`, `Thread Step`, `Rule`, `Root Distinction`, `Reader Question`, `Real Beginner Mistake (Daily Coding)`, `Interview Depth (Nuance / Follow-Up)`, `React Does`, `River Progression`, `Pertinent Division & Visual Comparison`, `Drafted Principle Box`)
9. `## Senior Answer`
10. `## Reported Conflicts`
11. `## Open Issues`
12. `## Completion Gate`
