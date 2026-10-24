---
name: map-principles-v2
description: "River Version (v2) principle map for `01-01-map-principles/v2/{NN}.md`, written by Opus. Reads the question bank, the syllabus card, the official React corpus, and a headless Chrome runtime, and writes a fact sheet: scope, verified behavior, root distinctions, real bugs, interview points, bridges, example steps, and code names. Argon writes every sentence the reader reads, first in the pre-lecture and then in the lecture."
---

# River Version (`v2`) Principle Map (`01-01-map-principles/v2/{NN}.md`)

## 1. The map's place in the River pipeline #2026_10_24_01_group_1

| Step | File | Written by |
| --- | --- | --- |
| 1. Principle map | `01-01-map-principles/v2/{NN}.md` | Opus |
| 2. Pre-lecture | `01-01-md-PRE-lectures/v2/{NN}.md` | Argon, under [pre-lecture/SKILL.md](../pre-lecture/SKILL.md) |
| 3. Lecture | `01-02-md-LECTURES/v2/{NN}.md` | Argon, under the lecture skills |

The map decides **what is true and what the lesson covers**. The pre-lecture decides **how the reader meets it**. The lecture is the finished pages.

## 2. The map is a fact sheet, not a draft of the lecture #2026_10_24_01_group_2

Argon writes the River voice; the map's writer does not. When a map held story sentences, the lecture copied them, and the copied sentences came out compressed and full of code names. Lecture 06's rejected first paragraph came almost word for word from its map's beginner-mistake field.

So the map gives facts in lists, and it never writes a sentence meant for the reader:
- A story becomes a numbered list of events, one event per line, in the order they happen.
- Exact names, files, strings, and error messages go in a separate **Code names** line, so they are easy to find and never glued into a story.
- Rules, boxes, previews, and spoken answers are not drafted here. The map lists the points they must cover.

### PROPER (Format sample: facts as events, code names on their own line)

This is a sample of the format, not of the reader's voice. Its facts are the facts of Lecture 06, Principle 3.

```markdown
- **Real Beginner Mistake (events, in order)**:
  1. The list file creates the section name as a local variable and shows it above the card.
  2. The header file tries to show the same section name.
  3. The page goes blank, because a function cannot see a variable created inside another function.
  4. To stop the crash, a developer copies the variable into both files.
  5. Later, a teammate changes the header file's copy and forgets the list file's copy.
  6. The page loads with no Console error, but the header and the list show two different section names.
- **Code names**: `ArticleList.jsx`, `SiteHeader.jsx`, `category`, `'City News'`, `'Local News'`, `Uncaught ReferenceError: category is not defined`
```

### COUNTER-EXAMPLE (The Lecture 06 map, whose wording the rejected lecture draft copied; one em-dash replaced by a colon)

```markdown
- **Real Beginner Mistake (Daily Coding)**:
  1. Trying to read `category` inside `SiteHeader.jsx` when `const category = 'Local News'` was declared inside `ArticleList.jsx` (which crashes with `ReferenceError: category is not defined` because sibling functions have separate local scopes), OR
  2. Copying `const category = 'Local News'` into both `SiteHeader.jsx` and `ArticleList.jsx`, and later updating one file to `'City News'` so the header says `Latest Articles: City News` while the list below it still says `Category: Local News`!
```

*Why this fails*: Each item glues four events, six code names, and an aside into one sentence. A writer who starts from it starts from a compressed story.

## 3. Four verification pillars #2026_10_24_01_group_2

The map is written from the official React documentation corpus and the live runtime. Never read Original Version (`v1`) maps, pre-lectures, or lectures for it.

1. **Corpus and runtime (`## Sources Read`)**:
   - Read `questions/questions.md` row `{NN}` and the syllabus card `01-01-map/{NN}.md`.
   - Resolve the corpus with `node ../../tools/resolve.mjs corpus` and read every `learn/` and `reference/` page for the topic, including every `<Pitfall>`, `<DeepDive>`, `<Recap>`, and `<Challenge>`.
   - Reproduce every claim, Console warning or error, Elements panel node, and Vite build behavior in a real React 19 and Vite runtime driven by headless Chrome, and copy the exact strings. Never guess a warning string or a runtime behavior.
2. **Scope routing (`## Candidate Ledger`)**: every candidate fact gets a row with one of seven dispositions: `Principle`, `Merged`, `Supporting`, `Prerequisite`, `Preview`, `Deferred`, or `Dropped`. Every `Prerequisite`, `Preview`, and `Deferred` row names its owning question (`QNN #topic_tag`), so no lesson takes a later chapter's topic.
3. **Terms (`## Terms`)**: every React, browser, JavaScript, or general term the lesson uses gets a row with its `kind`, `status` (`Recall` or `New`), `first lesson`, `refresher` (`yes` or `no`), and `first needed in`. Every `New` term and every `refresher: yes` term is scheduled into the Runway Plan.
4. **Interview points (`## Interview Points`)**: the points a complete spoken answer to the bank question must cover, one per line, in principle order. Argon writes the spoken answer itself in the lecture's `## For the Interview` section.

## 4. What each principle records #2026_10_24_01_group_2

### 4.1 Order: cause before effect

When one principle explains how something is made, defined, or exported, and another explains how it is used, read, or imported, the making comes first.

- *PROPER (Lecture 05)*: Principle 2, one default export or many named exports in a file, comes before Principle 3, matching the import to the export. Once the reader has seen a card file with one default export and a badge file with two named exports, the rules for curly braces and renaming make sense at once.
- *COUNTER-EXAMPLE*: teaching curly braces and renaming in Principle 2 before the reader learns in Principle 3 that a file can have one default export and many named ones. Principle 2 then has to export a lone component by name for no visible reason.

### 4.2 The fields of a principle

Each `### Principle N` in `## Principles` records these fields as short facts:

- **Handle**: a few words that name the principle.
- **Rule**: the rule in one plain line, with its condition.
- **Root Distinction**: the two things a junior developer sees as one (*Junior blurred view*) and the separation a senior developer keeps (*Senior grounding*), each as one line. Example: *junior*: "I wrote the card function, so the card should appear"; *senior*: declaring the function and placing its tag are two separate steps.
- **Real Beginner Mistake (events, in order)**: what developers really do wrong in daily coding, as numbered events. Never invent a mistake to force a comparison.
- **Interview Depth**: what a senior interviewer probes as a follow-up, one point per line, kept apart from the daily mistake.
- **Bridges**: every place where a second piece of code uses a name, parameter, or value that the first piece never wrote, such as `import StoryCard` when the card file never says `StoryCard`, `children` in a child when the parent tag never wrote `children=`, or `e` in a handler when `onClick` never passed it. For each, record what the reader will not find in the first piece, who invents or supplies it, and what JavaScript or React does, as numbered steps.
- **React Does**: the verified runtime facts for this principle: what appears on the page, in the Console, and in the Elements panel, with exact strings.
- **Example Step**: what the chapter's example adds in this principle, which files change, and which new page element enters here and nowhere earlier.
- **Code names**: every file, variable, tag, string, and error message this principle uses.
- **Visual idea**: what a figure or preview could compare, in one line. The pre-lecture decides whether a figure helps.

### 4.3 Real beginner mistake and interview depth stay apart

- *PROPER (Lecture 04, Principle 1)*: the daily mistake is writing the card function and forgetting to place its tag, so the page is empty. The interview depth is why we write the tag instead of calling the function ourselves, and why the component tag never appears in the Elements panel.
- *COUNTER-EXAMPLE*: recording calling the component function with parentheses inside the markup as the main beginner bug. Developers rarely write it; it is an interview question.

### 4.4 Bridges are recorded as steps, not as a summary

- *PROPER (facts behind Lecture 05, Principle 3)*:
  - **Reader will not find**: `StoryCard` anywhere in the card file, where the function is still `ArticleCard`.
  - **Who supplies it**: the main file invents `StoryCard` as a new local name.
  - **What JavaScript does**: 1. With no curly braces, it does not search the card file by name. 2. It takes the single default export, `ArticleCard`. 3. It gives that function the local name `StoryCard` in the main file.
- *COUNTER-EXAMPLE*: "Why a default export has only one default component so `App.jsx` can import it under any name (`import StoryCard`), whereas `Badges.jsx` has multiple named exports so `ArticleCard.jsx` must rename with `as`." It states the syntax rule and never records that the reader cannot find `StoryCard` in the first file.

## 5. The Runway Plan #2026_10_24_01_group_2

`## General Concepts Introduction (Runway Plan)` lists, as facts:
- **Theme**: the real page problem that motivates the chapter, in one line, such as twenty article cards that should not be copied and pasted twenty times.
- **Ways**: when developers really choose between two to four approaches for the same job, the approaches and when each fits. Otherwise, `Ways: none`.
- **Recall**: the exact facts from earlier lessons this chapter stands on, each with its lesson number.
- **Runway topics**: the general JavaScript, browser, or HTML ideas the principles need, one per line, from the `New` and `refresher: yes` rows of the Terms table, plus how the project files are organized.
- **Example**: the page the chapter builds, small enough to read in a little browser window, and believable to a junior and a senior developer alike.

## 6. Section order of `01-01-map-principles/v2/{NN}.md` #2026_10_24_01_group_2

1. `# Q{NN} Principle Map (River Version v2): [Chapter Title]` with the `Version`, `Bank Row`, `Topic Tag`, and `Interview Question` bullets
2. `## Authorized Scope`
3. `## General Concepts Introduction (Runway Plan)`
4. `## Principle Thread`: `Anchor`, `Axis`, `Why This Axis`
5. `## Sources Read`
6. `## Candidate Ledger`
7. `## Terms`
8. `## Principles`: `### Principle 1..N`, each with the fields of Section 4.2
9. `## Interview Points`
10. `## Reported Conflicts`
11. `## Open Issues`
12. `## Completion Gate`

## 7. Completion Gate #2026_10_24_01_group_2

- [ ] Is every runtime claim and every exact string reproduced in the live runtime?
- [ ] Does every candidate fact have a ledger row, and does every deferred row name its owner?
- [ ] Is every story a list of events, with its code names on their own line?
- [ ] Does every principle record its root distinction, real mistake, interview depth, bridges, and example step?
- [ ] Is the map free of drafted lecture sentences, drafted principle boxes, and drafted spoken answers?
