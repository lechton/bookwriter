---
name: skill-surveillance
description: "Super-Skill that governs how all skills in `skills/v9.2/` are written, edited, and audited. Replaces isolated abstract rules and bans with load-bearing full-section demos, title catalogs, and cross-skill demo maintenance, and requires every good example inside a skill to be approved lecture text."
---

# Skill Surveillance: The Super-Skill Governing All Skills (`skills/v9.2/`)

Whenever you create, edit, or review any skill in `skills/v9.2/`, run this super-skill first.

## Why Abstract Rules and Bans Fail

When a skill tries to fix a writing or pedagogical problem by adding abstract rules and negative bans, such as *"Never drop a lonely 1-line snippet; always include (1) the source file, (2) the receiving file, and (3) the rendered JSX tag"*, models react by stuffing all three requirements into convoluted, code-heavy prose sentences just to prove they obeyed the checklist.

What actually works is **mapping the problem**, giving **large, load-bearing demos at the exact scale of the problem**, and **surveilling the output line by line**.

---

## Mandatory Skill-Surveillance Checkboxes

Check every item below whenever you edit any file under `skills/v9.2/`:

- [ ] **1. Scale the Demo to the Size of the Problem (Full Demos Over Short Fragments)**:
  - If the skill section is about **titles or headings**, does it provide a **copy-pasteable Title & Heading Catalog** (10+ real `##`, `###`, and `####` titles across different topics) paired with convoluted counter-titles?
  - If the skill section is about **how to explain a multi-part concept, a two-file handshake, or a complex interview question**, does it include an **entire working section from top to bottom as a Full Section Demo** (40 to 80 lines showing the `###` opening, `####` sub-steps, plain human words before and after each code block, `~token~` balloons, `::: row` / `::: col` comparison, and summary table) rather than a tiny 4-line fragment?
- [ ] **2. Keep Rule Text Short and Let the Demo Carry the Load**:
  - Is the explanation above the demo limited to **2 to 4 plain sentences** that map the problem and point out what to notice in the demo, with zero stacked negative bans?
- [ ] **3. Audit and Upgrade Existing Demos Across Sibling Skills**:
  - Did you inspect the existing demos in `map-principles`, `pre-lecture`, `lecture-structure`, `lecture-voice`, `code-and-figures`, and `verification` and update any older demo that still shows the old flaw or contradicts the new pattern?
- [ ] **4. Good Examples Come Only from Approved Lecture Text** #2026_10_24_01_group_5:
  - Is every `PROPER` example a verbatim passage from an approved River lecture, or the owner's own rewrite, with its source named in the label? Only the layout may change, for example when lecture sentences are staged as pre-lecture beats.
  - Is every `COUNTER-EXAMPLE` a rejected draft or an invented failure, labelled as such?
  - Did you leave the build script's limits out of the author-facing text? Numbers such as a maximum of code spans per sentence read as permission, and authors write up to the limit. The script keeps its limits; the skills describe the standard and show it.
  - Does every `~token~` line in a `PROPER` code block carry an inline `//` or `{/* */}` comment, with no comment-only lines?

---

## Living Exemplar: How to Write a Skill Section

### PROPER SKILL SECTION (Short Problem Map + Full Load-Bearing Section Demo)

````markdown
### Teaching a Two-File Handshake (Exporting, Importing, and Renaming)

When a concept connects two files, such as how one file exports a component and how another file imports, renames, and renders it, a 1-line `import` snippet hides half the relationship, and leaving a new name like `StoryCard` unexplained leaves the reader asking *"Wait, I do not see `StoryCard` in the other file! Where did it come from?"* Instead, walk through each case with a two-file pair where the prose speaks in plain human words, explicitly voices the reader's eye-check when a name is not in the other file, and pairs every `~token~` with an inline speech-bubble comment:

#### FULL SECTION DEMO, PROPER, from Lecture 05 (Complete Two-File Handshake + Explicit "Where Did `X` Come From?" Eye-Check)
```markdown
### Can the importing file give an imported component a different tag name?

Sometimes the file that imports a component wants to use a different local tag name on the page. For example, our main file might want to call the card `<StoryCard />`. Or our card file might want to call the live badge `<BreakingBadge />`.

Whether you can write that new name directly depends on **how many exports** the other file has.

#### 1. Renaming a default import: write any new name directly

Our card file has **only one** default export:

```jsx title="src/components/ArticleCard.jsx" startLine="1"
~export default~ function ArticleCard() { // 1. The only default export in this file
  return <article className="card"><h2>New Park Opens Today</h2></article>;
}
```

When our main file imports from the card file **without curly braces**, it can invent a brand-new local name on the spot:

```jsx title="src/App.jsx" startLine="1"
import ~StoryCard~ from './components/ArticleCard.jsx'; // 2. StoryCard is a new local nickname invented here!

export default function App() {
  return (
    <main>
      <h1>Latest Articles</h1>
      ~<StoryCard />~ {/* 3. Renders ArticleCard under its new local nickname StoryCard */}
    </main>
  );
}
```

Look closely at those two files. The word `StoryCard` does not exist anywhere inside our card file! Inside the card file, the function is still named `ArticleCard`. Why doesn't JavaScript complain that `StoryCard` is missing?

Because the import line has **no curly braces**, JavaScript does **not** search the card file for a function named `StoryCard`. Instead, leaving out the curly braces tells JavaScript to do two simple steps:
1. Go to the card file and grab whatever single function is marked `export default`, which is `ArticleCard`.
2. Give that function the brand-new local nickname `StoryCard` inside our main file so we can render it as `<StoryCard />`.
```
````

### COUNTER-EXAMPLE SKILL SECTION (Abstract Bans with No Full Demo)

````markdown
### Rules for Two-File Concepts
- Never drop a lonely 1-line snippet when teaching a two-file or parent-child concept.
- Always show (1) what the source file defines/exports, (2) how the receiving file imports/reads it, and (3) how the receiving component renders `<Tag />` in JSX.
- Never use a linear 3-box `tree` diagram when a concept has multiple parameters across two files; always use `::: row` / `::: col` and a table instead.
````
*Why this fails*: Gives three abstract orders and zero demonstration of how to write the prose and code blocks together. The author obeys the three orders by stuffing `src/components/ArticleCard.jsx` and `import { BreakingBadge } from './Badges.jsx'` into dense prose sentences.
