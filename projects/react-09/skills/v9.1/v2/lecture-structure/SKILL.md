---
name: lecture-structure-v2
description: >
  River Version (v2) Lecture Structure skill for `01-02-md-LECTURES/v2/{NN}.md`.
  Governs the three-zone architecture of a River Version lecture:
  Zone 1 (Comprehensive General Concepts Introduction / The Runway),
  Zone 2 (Unified River Principles 1..N with Root Distinctions, progressive
  example growth, Box-to-Boxes `tree` figures, and `> [!PRINCIPLE]` cards), and
  Zone 3 (Complete Working Example in App.jsx, Summary Table, and For the Interview).
---

# River Version (`v2`) — Lecture Structure Skill (`01-02-md-LECTURES/v2/{NN}.md`)

> **Mandatory Pre-Writing Gate**: Before writing a single line, complete **Stage A** of [verification/SKILL.md](../verification/SKILL.md), starting by reading the accepted reference chapters [01-02-md-LECTURES/v2/04.md](../../../01-02-md-LECTURES/v2/04.md) and [01-02-md-LECTURES/v2/01.md](../../../01-02-md-LECTURES/v2/01.md).

## 1. The Core Architecture of a River Version (`v2`) Lecture

- [ ] Have you read `01-02-md-LECTURES/v2/04.md` and `01-02-md-LECTURES/v2/01.md` before drafting this lecture?
- [ ] Does the lecture flow through the three zones in one forward movement without repeating the principles a second time at the end?

The **Original Version (`v1`)** repeated the chapter's principles twice: first as abstract `### Question 1..N` cycles, and then a second time from scratch in `### Let's Design a Practical Example` (Stages A, B, C, D, E).

The **River Version (`v2`)** eliminates that 2x repetition while preserving **100% of the comprehensiveness** of the Original Version's opening General Concepts Introduction (The Runway). A River Version (`v2`) lecture flows through **three zones** in one forward movement:

1. **Zone 1 — Comprehensive General Concepts Introduction (The Runway)**:
   - Motivates why the chapter's concept exists on a real webpage, shows the shortest 2-step preview, divides the core elements visually with `tree` Box-to-Boxes diagrams, recalls the exact facts from earlier chapters that this lesson builds on, explains the project setup, and previews the chapter's principles in a numbered `**PRINCIPLES:**` list + scannable 4-column overview table.
2. **Zone 2 — Unified River Principles (`## 1. Principle 1..N`)**:
   - Each principle is a self-contained `## N. Principle N: ...` section that starts from its philosophical **Root Distinction** (`###` heading), teaches any general JavaScript mechanism needed for that step with a short plain-JavaScript snippet, grows the chapter's single practical example (`App.jsx`) step by step, contrasts the right and wrong paths in prescriptive Box-to-Boxes ```` ```tree ```` figures, and locks the rule in a `> [!PRINCIPLE]` card (`DO THIS` vs. `DO NOT DO THIS`).
3. **Zone 3 — Complete Working Example & For the Interview**:
   - Shows the complete working `App.jsx` once at the end (`## Putting All Four Principles Together in App.jsx`), traces the exact call order in a `tree` diagram, summarizes the habits vs. rules in a comparison table, and closes with `## For the Interview` (30-second spoken answer + classic interviewer follow-up questions).

---

## 2. Zone 1: Comprehensive General Concepts Introduction (The Runway)

Never rush into Principle 1 before the reader has the big picture and the foundational concepts they need. Zone 1 opens the lecture with the following subsections in order:

### 2.1 Header and Interview Question Banner
```markdown
# Lecture {NN}: [Chapter Title]
> INTERVIEW QUESTION | ❱ CORE | [Exact question text from `questions/questions.md`]
```

### 2.2 Why We Need This Concept (`## Why We ...`)
- **Real-Page Motivation (`###` heading) + Archetypical UI Browser Preview**: Open with a concrete webpage situation the reader recognizes immediately, paired with an embedded **UI browser preview** (` ```page `, ` ```shop `, or ` ```mail `) showing the finished archetypical UI and a `tree` Box-to-Boxes diagram comparing the manual approach (`!`) against the React approach (`+`).
- **Minimal, Realistic, Video-Demo-Friendly Example Selection (`-gemini` Standard)**:
  - Pick an example that is **minimal** in presenting the code problem (no hyper-complex mixing of unrelated principles), **looks like a real, sensible page to both a junior developer and a senior developer** (never an awkward contrivance such as repeating two identical hardcoded articles across every preview of a chapter), and is **visually clear inside a small browser window** so it works in a live video demo and in the book's embedded browser mockups.
  - Introduce each UI element **only in the Principle section that needs it** (for example, in Lecture 1's `Cart`, Principles 1 and 2 have only the `Items: 3` line and the `Buy 3 items` button; the `Note to the shop` input is added only in Principle 3).
  - Reuse or extend an example from an earlier chapter **if and only if** it naturally fits the new principle—and **without heavy back-reference prose** (*"As we saw in Lecture 1 and Lecture 2..."*) that adds cognitive load.
- **First Taste of the Mechanism (`###` heading)**: Show the shortest 2-step preview followed by a `tree dir=right` diagram or side-by-side `::: row` / `::: col` browser + code preview.
- **Pertinent Division of Elements (`###` heading)**: Show how the elements sit side by side in JSX and divide them visually in a `tree` diagram (for example, built-in lowercase HTML tags known to the browser vs. capital-letter React component tags known only to React).
- **Light, Self-Contained Prerequisites & Project Setup (`###` heading)**:
  - Keep any prerequisite reminders self-contained in 1 or 2 plain sentences without heavy cross-chapter back-references.
  - Explain how the lesson's project files are organized in one brief paragraph. When the lesson spans multiple files, teaches module imports/exports, or organizes files across folders such as `src/` and `src/components/`, include a visual ```` ```files ```` File Explorer panel right after the paragraph so the reader sees the folder tree and what is exported and imported where.

### 2.3 Overview of the Chapter's Principles (`### Four Principles of ...`)
Close Zone 1 with:
1. **`**PRINCIPLES:**` Numbered Summary**: A bold `**PRINCIPLES:**` lead-in followed by a numbered list (`1. **Principle 1 — ...**`) stating the daily debugging bug and interview trap of each principle.
2. **Overview Table**: A 4-column Markdown table (`| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |`) so the reader sees the whole river before stepping into Principle 1.

---

## 3. Zone 2: Unified River Principles (`## 1. Principle 1..N`)

Order the principles in **causal order (Cause Before Effect)**: whenever one principle governs how a file or component defines or provides something and another principle governs how another file or component consumes it, teach the defining principle first and the consuming principle second.

### Full Demo: Causal Handoff Between Two Principles (Principle 2 Sets Up the Files $\rightarrow$ Principle 3 Consumes Them)

````markdown
## 2. Principle 2: Default vs. Named Exports: One Default for the Main Component, Named Exports for Multiple Components

### A file can have only one default export, so a file with multiple components exports them by name

In Principle 1, `ArticleCard.jsx` had only one component, so we exported it with `export default`. What happens when we want one file to hold **two or three small components**, such as status badges?
...
To export both badges from the badge file, we remove the word `default` and write `export function` in front of each badge. That makes both of them **named exports**:

```jsx title="src/components/Badges.jsx" startLine="1"
~export function LiveBadge~() { // 1st named export: exported under the name "LiveBadge"
  return <span className="badge">Live</span>;
}

~export function NewBadge~() { // 2nd named export: exported under the name "NewBadge"
  return <span className="badge">New</span>;
}
```
...

---

## 3. Principle 3: Match Imports to Exports: No Braces for Default, Curly Braces for Named

### How a file exports a component determines whether the importing file uses curly braces and whether it can pick a new name

Now look at the two component files we have built so far:
1. **Our card file, `ArticleCard.jsx`**, exports **one default component** with `export default`.
2. **Our badge file, `Badges.jsx`**, exports **two named components** with `export function`.

How does another file import from each one?
````

Each principle is a top-level `## N. Principle N: [Title]` section that advances the chapter's practical example by one step and follows this internal rhythm:

1. **Philosophical Root Distinction (`###` Opening Heading)**:
   - Start from the fundamental root distinction that blurs together for a junior developer but is separate for a senior developer (for example, `### Writing the component function and using its tag are two separate steps`).
   - State why this distinction matters both **In daily coding** and **In an interview**.
2. **Plain-JavaScript Grounding + Progressive River Step**:
   - Whenever a principle rests on a plain-JavaScript mechanism (such as function call `sayHello()` vs. function reference `sayHello`, `camelCase` vs. `PascalCase` vs. `snake_case`, Automatic Semicolon Insertion after a bare `return`, or top-level vs. nested function creation `firstRun === secondRun`), show a 4 to 6 line `Plain JavaScript` snippet and a `tree` Box-to-Boxes diagram first.
   - Grow the chapter's working example (`App.jsx`) by one step using short 3 to 10 line code snippets with `~token~` balloons and clear comments.
   - Trace what appears on the **page**, in the **Console panel**, and in the **Browser Elements panel**.
3. **Prescriptive `> [!PRINCIPLE]` Card**:
   - Close each principle with a `> [!PRINCIPLE]` card containing the bold title, italicized one-sentence rule, plain-English explanation (zero parentheses), and `**DO THIS:**` / `**DO NOT DO THIS:**` code blocks.

---

## 4. Zone 3: Complete Working Example & For the Interview

After the last principle, close the lecture with:
1. **`## Putting All Four Principles Together in App.jsx`**:
   - Show the complete, working `src/App.jsx` code block once in full, followed by a `tree` diagram tracing the exact order (`1` to `4`) in which React calls each component, and a summary table (`| Aspect | The Plain JavaScript Habit | The React Rule |`).
2. **`## For the Interview`**:
   - **`### How to Answer Clearly in 30 Seconds`**: A natural, spoken 30-second answer covering the definition and all principles.
   - **`### Three Classic Follow-Up Questions Interviewers Ask`**: Numbered Q&A items answering the exact follow-up traps interviewers probe (including `<ArticleCard />` vs. calling the function directly), closed with a final `tree dir=right` Box-to-Boxes comparison.
