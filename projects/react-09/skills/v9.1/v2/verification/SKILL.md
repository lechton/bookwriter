---
name: verification-v2
description: >
  River Version (v2) Quality & Pre-Flight Verification Skill for `01-02-md-LECTURES/v2/{NN}.md`.
  Enforces the three-stage quality sequence: Stage A (Mandatory Pre-Writing Checkboxes, including
  reading the accepted v2 reference chapters 04.md and 01.md first), Stage B (Human Reading Quality
  Checkboxes read top-to-bottom as a learner BEFORE any script runs), and Stage C (Mechanical build
  and link check ONLY AFTER every reading gate is verified and reported line-by-line).
---

# River Version (`v2`) — Quality & Pre-Flight Verification (`01-02-md-LECTURES/v2/{NN}.md`)

## Why Reading Gates Must Precede Algorithmic Tests

When a build script prints `0 violations`, an author is tempted to believe the chapter is easy to read. In reality, an algorithmic script can only count words and parentheses. A chapter can pass every script while still dumping a rain of code tokens into a sentence, mixing two bugs into one snippet, or forcing the reader to read a paragraph three times.

In the **River Version (`v2`)**, quality is secured by **three ordered stages**:
1. **Stage A — Mandatory Pre-Writing Checkboxes (`- [ ]` BEFORE writing a single line)**
2. **Stage B — Human Reading Quality Checkboxes (`- [ ]` read top-to-bottom as a learner BEFORE running any script)**
3. **Stage C — Mechanical Build & Link Gate (`- [ ]` ONLY AFTER Stages A and B have been checked and reported item by item)**

---

## Stage A: Mandatory Pre-Writing Checkboxes (Before Writing a Single Line)

Check every box below before drafting `01-01-map-principles/v2/{NN}.md` or `01-02-md-LECTURES/v2/{NN}.md`:

- [ ] **Gate A1 — Read the accepted `v2` reference chapters first**: Have you read [01-02-md-LECTURES/v2/04.md](../../../01-02-md-LECTURES/v2/04.md) and [01-02-md-LECTURES/v2/01.md](../../../01-02-md-LECTURES/v2/01.md) in this session before writing a line? Notice how `04.md` introduces each snippet in plain human words (*"First, the developer writes the footer component with a small first letter:"*, *"Then the tag is also written with a small first letter:"*) and shows the concept in 3 to 6 clean lines.
- [ ] **Gate A2 — Read the `v1` chapter and `v2` principle map**: Have you read `01-02-md-LECTURES/v1/{NN}.md` and `01-01-map-principles/v2/{NN}.md` so that every prerequisite, nuance, condition, and edge case is preserved?
- [ ] **Gate A3 — Design the simplest one-thing-at-a-time example**: Does each principle's code snippet test **one** idea or **one** mistake at a time in the fewest possible lines, with zero unused variables riding along? Is each new UI line introduced only in the principle section that needs it?

```
PROPER EXAMPLE (Gate A3 — One Thing at a Time in Lecture 04 & Lecture 03):
- In Lecture 04 Principle 2, the snippet tests only the lowercase component name `footer` returning `<footer>Latest Articles</footer>`.
- In Lecture 03 Principle 2, first test a variable inside text (`<h2>title</h2>` vs. `<h2>{title}</h2>`) with a 1-variable component; then separately test a variable inside an attribute (`src="avatarUrl"` vs. `src={avatarUrl}`).

COUNTER-EXAMPLE (Gate A3 — Mixing Multiple Variables and Bugs into One Snippet):
- Declaring `title`, `author`, and `avatarUrl` all at once and testing both `<h2>title</h2>` and `<img src="{avatarUrl}" />` in the same snippet.
Notes: The reader has to track three variables and two different mistakes at once. Split them so each snippet shows one thing.
```

---

## Stage B: Human Reading Quality Checkboxes (Before Any Script Runs)

Read `01-02-md-LECTURES/v2/{NN}.md` from top to bottom as a learner who is meeting this concept for the first time. Check every gate below and write a one-line report per gate **before** running `src/build-river.mjs`:

### Gate B1 — Calm Conceptual Umbrella First (No Premature Rain of Code Details)
- [ ] Does every section and subsection open with the everyday situation and the high-level point in plain human words, before stepping to the keyboard?
- [ ] Are the opening sentences of every section completely free of variable declarations, attribute strings, and syntax debugging steps?

```
PROPER EXAMPLE:
When a news page loads, each card shows a different headline and author. If we type a fixed headline directly inside the tag, every card on the page says the exact same words. We need a way to keep the card's tags while reading the headline from a JavaScript variable.

COUNTER-EXAMPLE:
Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:
Notes: Throws a rain of code details at the reader in one breath—reciting variable names, HTML tags, and quoted attribute syntax before the reader even looks at the code block.
```

### Gate B2 — Division of Labor: Plain Human Words in Prose, Syntax in Code, Result in Comments
- [ ] Do the sentences before and after a code block speak in plain human words (*the card*, *the heading*, *the photo*, *the footer*, *the variable*) and state **what we want** and **why**, leaving the exact syntax to the code block?
- [ ] Does the prose never recite variable declarations, HTML tag names, and attribute strings that are sitting right below in the code block?
- [ ] Do code comments state the cause and the visible result right on the line (`// **WRONG:** quotes turn {avatarUrl} into literal text`), so the prose after the block does not have to repeat the syntax a third time?

```
PROPER EXAMPLE (from Lecture 04, Section 2):
First, the developer writes the footer component with a small first letter:
```jsx title="App.jsx"
function ~footer~() { // **WRONG:** starts with a small f instead of a capital F!
  return <footer>Latest Articles, 2026</footer>;
}
```
Then the tag is also written with a small first letter:
```jsx title="App.jsx"
export default function App() {
  return (
    <main>
      <ArticleCard />
      ~<footer />~ {/* **WRONG:** lowercase tag tells React to create an empty HTML <footer>! */}
    </main>
  );
}
```
The page shows the article card, but the footer at the bottom is completely blank.

COUNTER-EXAMPLE (from the rejected Lecture 03 draft):
Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:
...
The heading on the screen literally says the word `title` instead of `New Park Opens Today`! Even worse, the `<img>` tag shows a broken image icon because the browser tried to fetch a file literally named `"{avatarUrl}"`.
Notes: The prose recites the code block line by line in backticks both before and after the block. Speak in human words in the prose ("First, the developer writes the variable name directly inside the heading tag:") and let the code block show `<h2>title</h2>`.
```

### Gate B3 — Radically Simple Snippets: One Mistake or One Step at a Time
- [ ] Does every code snippet during explanations stay between 3 and 10 lines and test **one** single step or **one** single mistake?
- [ ] Is everything that the current step does not ask about left out of the snippet, so the reader's eye goes straight to the one line that matters?
- [ ] In every side-by-side comparison (`::: row` / `::: col`), do the two columns differ only in the exact line being compared?

```
PROPER EXAMPLE:
Testing text inside a tag first with a 5-line snippet that has only `title` and `<h2>`, and then testing an image attribute in its own separate 5-line snippet with `avatarUrl` and `<img>`.

COUNTER-EXAMPLE:
Testing `<h2>title</h2>`, `<p>By author</p>`, and `<img src="{avatarUrl}" />` all inside one 11-line snippet.
Notes: Two different JSX rules (text between tags vs. quotes on an attribute) are tangled together in one block.
```

### Gate B4 — First-Read River Flow (One Fact per Sentence, Chronological Order, Zero Parentheses)
- [ ] Can a human reader understand every sentence on the first read without pausing or rereading?
- [ ] Does every sentence carry one clear event or fact in plain B2 English?
- [ ] Does every explanation of code walk through the lines in the exact top-to-bottom order in which they are written or run?
- [ ] Are prose paragraphs, headings, table cells, and `tree` diagrams completely free of parentheses `(` and `)` (outside the verbatim interview question banner and fenced code blocks)?
- [ ] Is the prose completely free of raw multi-property Console objects (`{ $$typeof: ..., type: ... }`) and file/line coordinates (`App.jsx:5`)?

### Gate B5 — Figures Visualise Ideas Already Taught in Prose
- [ ] Is every significant key idea that appears inside a `tree` diagram or side-by-side browser preview taught in plain words in the prose **before** the figure appears?
- [ ] Are all labels, `[chips]`, and `| notes` inside `tree` (and especially `tree dir=right`) short and compact so boxes never crush or overflow?
- [ ] Does every `tree` comparison mark right vs. wrong paths with `+` (green) and `!` (red), and include `+**DO**` / `~Do **NOT**` key messages where appropriate?

### Gate B6 — Root-First Principle Boxes and Complete Nuances
- [ ] Does every `## N. Principle N` section open its `###` subtitle with the philosophical **Root Distinction** that separates two things a beginner blurs together?
- [ ] Does every `> [!PRINCIPLE]` card explain the rule in clean, natural human English without inline code litter, followed by minimal `**DO THIS:**` and `**DO NOT DO THIS:**` snippets?
- [ ] Does every statement of a result carry its condition (*when the curly braces are left out*, *when quotes wrap the braces*, *when an object is placed directly inside curly braces*)?

---

## Stage C: Mechanical Build & Link Gate (ONLY After Stages A & B Pass)

Only after you have verified every checkbox in **Stage A** and **Stage B** and written out the 1-line report for each reading gate, run the mechanical tools:

- [ ] **Gate C1 — Build HTML and PDF outputs**: Run `node src/build-river.mjs {NN}` from `projects/react-09`. Verify that `{NN}.html`, `{NN}-old.html`, `{NN}.pdf`, and `{NN}-old.pdf` build cleanly with `0 parenthesis violations`. Treat any `sentences > 28 words` output as a pointer to reread that sentence for river flow, never as the definition of quality itself.
- [ ] **Gate C2 — Workspace link integrity**: Run `node ../../tools/check-links.mjs` from `projects/react-09` and verify `0 broken links`.

```
PROPER EXAMPLE (Completion Report After Stages A, B, and C):
- Gate A1 (Reference chapters read): Read `v2/04.md` and `v2/01.md` before drafting; matched `04.md`'s plain-English lead-ins and 4-to-6-line single-concept snippets.
- Gate A2 (`v1` & map checked): Checked `v1/03.md` and `v2/03.md` map; all 4 principles, prerequisites, and interview follow-ups covered.
- Gate A3 (Minimal one-thing-at-a-time examples): Split Principle 2 into two separate minimal steps (first `<h2>title</h2>` vs `<h2>{title}</h2>`, then `src="avatarUrl"` vs `src={avatarUrl}`).
- Gate B1 (Calm conceptual umbrella): Verified every section opens with the real-page problem in plain words before introducing any code.
- Gate B2 (Division of labor): Removed all sentences that recited `const title`, `<h2>`, and `src="{avatarUrl}"` before/after code blocks; prose now uses plain human words ("the heading", "the variable name", "the image address").
- Gate B3 (One step per snippet): Verified every explanation snippet is 3–8 lines and tests one single change.
- Gate B4 (First-read river flow): Reread top-to-bottom; every sentence carries one fact in chronological order with 0 parentheses in prose/diagrams.
- Gate B5 (Figures taught in prose first): Verified every `tree` diagram only visualizes concepts already introduced in prose above it.
- Gate B6 (Root-first principles & conditions): Verified all 4 `###` root-distinction headings and `> [!PRINCIPLE]` cards.
- Gate C1 & C2 (Mechanical build & links): `node src/build-river.mjs 03` (0 parenthesis violations, 0 long-sentence warnings) and `check-links.mjs` (0 broken links).

COUNTER-EXAMPLE (Forbidden Mechanical-Only Report):
"Built 03.html and 03.pdf. Prose audit: 0 parenthesis violations, 0 sentences > 28 words. Link check: 0 broken."
Notes: Relied on algorithmic counters without performing or reporting the Stage A and Stage B reading gates.
```
