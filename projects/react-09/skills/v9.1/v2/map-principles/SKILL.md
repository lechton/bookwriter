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

## 2. Four Core Verification Pillars of the River Version (`v2`) Map

Every `01-01-map-principles/v2/{NN}.md` file is authored directly in calm, plain human words from the official React documentation corpus and live runtime—**never by reading or paraphrasing `01-01-map-principles/v1/{NN}.md`, `01-01-md-PRE-lectures/v1/{NN}.md`, or `01-02-md-LECTURES/v1/{NN}.md`**. It stands on four pillars:

1. **Corpus & Runtime Verification (`## Sources Read`)**:
   - Read `questions/questions.md` (row `{NN}`), `01-01-map/{NN}.md` (the syllabus card), and the accepted `v2` reference lectures (`01-02-md-LECTURES/v2/04.md` and `01-02-md-LECTURES/v2/01.md`).
   - Resolve the official React corpus with `node ../../tools/resolve.mjs corpus` and read every `learn/` and `reference/` page for the topic, including every `<Pitfall>`, `<DeepDive>`, `<Recap>`, and `<Challenge>`. Never read `v1` maps, pre-lectures, or lectures when authoring `v2`, so `v1`'s dense prose and metaphors never enter context.
   - Reproduce every claim, console warning/error, DOM node in the Elements panel, and Vite build behavior in a real React 19 + Vite runtime driven by headless Chrome. Never guess warning strings or runtime behavior.
   - Write all explanations inside `01-01-map-principles/v2/{NN}.md` in the same simple, plain human voice as `v2` lectures so the map never seeds compiler jargon into the lecture.
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

### Upgrade B — Causal Principle Ordering (Cause Before Effect) & Philosophical `Root Distinction` per Principle

1. **Order Principles by Cause Before Effect (Producer Before Consumer)**:
   - When one principle explains **how something is created, defined, or exported** and another principle explains **how another file or component imports, reads, or matches it**, always teach the **cause (creation/export)** before the **effect (consumption/import)**.
   - *PROPER (Lecture 05)*: Teach **Principle 2 (One Default Export vs. Many Named Exports in a File)** *before* **Principle 3 (Matching Imports to Exports: No Braces & Any Name for Default, Curly Braces & Exact Name for Named)**. Once the reader has seen `ArticleCard.jsx` (one default export) and `Badges.jsx` (two named exports: `LiveBadge` and `NewBadge`), the rules for curly braces and renaming in Principle 3 make immediate intuitive sense.
   - *COUNTER-EXAMPLE (Backwards Effect-Before-Cause)*: Teaching curly braces and renaming on `import` in Principle 2 before the reader knows in Principle 3 that a file can have only one default export and multiple named exports. That forces Principle 2 to create a file with only one component as a named export for no apparent reason and to explain renaming by borrowing a rule the reader has not learned yet.
2. **Philosophical `Root Distinction` Before Any Code**:
   - Every principle in `## Principles` must define its **Philosophical Root Distinction** before any code:
   - **Junior Blurred View**: What two distinct steps or concepts blur together as one automatic thing in a junior developer's head (for example, *"I wrote `function ArticleCard()`, so my card should appear on the page"*).
   - **Senior Root Grounding (`###` Opening Heading)**: The `###` heading and opening sentence that separate those two things at the root before showing any code (for example, `### Writing the component function and using its tag are two separate steps`).

### Upgrade C — Honest Separation of `Real Beginner Mistake` vs. `Interview Depth` & Mapping Every Sub-Step's "Unwritten Bridge" ("Where Did `X` Come From?")

1. **Separate Daily Mistake from Interview Depth**:
   Never invent a fake beginner mistake just to force a code comparison. In every principle, record two separate fields:
   - **Real Beginner Mistake (Daily Coding)**: What a developer actually does wrong in daily work (for example, writing `function ArticleCard()` and forgetting to place `<ArticleCard />` inside `App`, so the page is blank).
   - **Interview Depth (Nuance / Follow-Up)**: What a senior interviewer probes as a follow-up (for example, why we write `<ArticleCard />` instead of calling `{ArticleCard()}` directly, or why `<ArticleCard>` never appears in the browser's Elements panel).
2. **Map Every Sub-Step (`Merged` Concepts) and Every "Unwritten Bridge" ("Where Did `X` Come From?")**:
   - Whenever a principle includes a second teaching step (any `Merged` row from the Candidate Ledger) or whenever two connected pieces of code use **a name, parameter, or value in Part B that is NOT visibly written in Part A** (such as `import StoryCard` when `StoryCard` is not in the other file, `function Card({ children })` when `<Card><h2>News</h2></Card>` never wrote `children=`, `function handleClick(e)` when `onClick={handleClick}` never passed `e`, or `const [count, setCount] = useState(0)` when `useState` never knew those names), do not flatten it into a 1-line summary.
   - Map each sub-step explicitly with:
     - **Reader Eye-Check ("I Do Not See `X` in the Other Code!")**: What looks missing or contradictory when a human reader compares the two pieces of code side by side.
     - **Who Provides `X` & What Happens Step-by-Step**: Whether `X` is a brand-new local name invented on the spot by our code or a value supplied automatically by JavaScript/React behind the scenes, followed by the exact step-by-step action JavaScript or React performs.

#### Full Demo: Mapping an "Unwritten Bridge" Sub-Step in the Principle Map (PROPER vs. COUNTER-EXAMPLE)

````markdown
### PROPER (Mapping the Reader Eye-Check and Step-by-Step Runtime Bridge for Every Sub-Step)
- **Sub-Step 3B (Merged — Renaming an Imported Component Across Two Files)**:
  - **Reader Eye-Check ("I Do Not See `X` in the Other Code!")**:
    - When `ArticleCard.jsx` defines `export default function ArticleCard()` and `App.jsx` writes `import StoryCard from './components/ArticleCard.jsx'`, the reader's eye checks `ArticleCard.jsx` and says: *"Wait—it says `import StoryCard`, but I do not see `StoryCard` anywhere in `ArticleCard.jsx`!"*
    - Likewise, when `Badges.jsx` defines `LiveBadge` and `NewBadge`, `BreakingBadge` does not exist in `Badges.jsx`.
  - **Who Invents the Name & What JavaScript Actually Does Step-by-Step**:
    1. **For a default import (`import StoryCard`)**: `StoryCard` does not exist in `ArticleCard.jsx`—it is a **brand-new local nickname invented on the spot by `App.jsx`**. Because `import StoryCard` has **no curly braces**, JavaScript does **not** search `ArticleCard.jsx` for the word `StoryCard`. Instead, no curly braces tells JavaScript: *"Grab whatever single function is marked `export default` in `ArticleCard.jsx` (which is `ArticleCard`), and give it the brand-new nickname `StoryCard` inside `App.jsx`."*
    2. **For a named import (`import { LiveBadge as BreakingBadge }`)**: Because curly braces `{ }` **do** search `Badges.jsx` by name (since `Badges.jsx` has multiple exports), writing `import { BreakingBadge }` alone crashes because `BreakingBadge` is not in `Badges.jsx`. Inside `{ }`, you must write the existing exported name first (`LiveBadge`) so JavaScript finds it in `Badges.jsx`, followed by `as BreakingBadge` to give it its new local nickname.

### COUNTER-EXAMPLE (Flattening a Sub-Step into a 1-Line Summary That Hides the Unwritten Bridge)
- **Interview Depth (Nuance / Follow-Up)**: Why a default export has only one default component so `App.jsx` can import it under any name (`import StoryCard`), whereas `Badges.jsx` has multiple named exports so `ArticleCard.jsx` must rename with `as`.
*Why this fails*: States only the compiler syntax rule. Never identifies the reader's eye-check (*"`StoryCard` is not in `ArticleCard.jsx`!"*) and never explains that `import StoryCard` without curly braces skips name lookup in File 1 and invents `StoryCard` as a new nickname in File 2.
````

### Upgrade D — Minimal, Video-Demo-Friendly `River Progression`, Optional Reuse Without Back-Reference Load, and Embedded `UI Browser Previews`

Because the River Version (`v2`) builds a clean, progressive practical example across Principles 1..N (never repeating the principles a second time in a separate `Let's Design a Practical Example` section at the end), every principle in `## Principles` specifies:
- **Minimal, Video-Demo-Friendly Example (`-gemini` Standard)**:
  - Pick an archetypical example whose rendered UI is **immediately visible and visually clear inside a small browser window** for both a live video demo and an embedded book browser preview (for example, Lecture 1's `Cart` with `Items: 3` and `Buy 3 items`, Lecture 4's `ArticleCard` / `Footer` / `CommentBox`, or Lecture 11's `Mail` inbox).
  - **Introduce each element only in the Principle that needs it**: Never clutter Principle 1 or 2 with elements that are only tested in Principle 3 (for example, in Lecture 1, Principles 1 and 2 contain only `<p>Items: {count}</p>` and `<button>Buy {count} items</button>`, and `<input placeholder="Note to the shop" />` is added only in Principle 3).
  - **Reuse across chapters only when natural, with zero back-reference cognitive load**: You may reuse or extend an example from an earlier chapter **if and only if** it naturally fits the new principle, and without heavy *"As we saw in Lecture X..."* prose.
- **Embedded UI Browser Previews & Pertinent Visual Comparisons**:
  - Specify the exact **UI browser mockups** (` ```page `, ` ```shop `, ` ```mail `, ` ```dom `, ` ```devconsole `, ` ```overlay `, and side-by-side `::: row` / `::: col` comparisons), visual folder-structure panels (` ```files ` whenever file organization, folders, or imports/exports across files are pertinent), and structural `tree` Box-to-Boxes diagrams that show the reader what happens on the screen in each principle.
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
