---
name: code-and-figures-v2
description: "River Version (v2) Code Blocks & Box-to-Boxes Figures skill for `01-02-md-LECTURES/v2/{NN}.md`. Governs focused one-step code blocks during explanations, `~token~` highlight balloons, numbered comments, inline `tree` Box-to-Boxes diagrams (`+` green vs. `!` red boxes, `+` DO vs. `~` DO NOT key messages, `[...]` badge chips), and `> [!PRINCIPLE]` DO / DO NOT cards."
---

# River Version (`v2`): Code Blocks & Box-to-Boxes Figures (`01-02-md-LECTURES/v2/{NN}.md`)

> **Mandatory Quality Checkboxes**:
> - [ ] Does every code snippet during explanations show **one single step or mistake at a time**, as long as that step needs and no longer? #2026_10_24_01_group_4
> - [ ] Does every code block have its own lead-in sentence in plain words, as shown in [content-benchmarks/SKILL.md](../content-benchmarks/SKILL.md) Sections 2.4 and 2.5? #2026_10_24_01_group_3
> - [ ] Is every key idea inside a `tree` diagram or UI browser preview taught in plain words in the prose **before** the figure appears?
> - [ ] Are all `tree` labels, `[chips]`, and `| notes` short and completely free of parentheses `(` and `)`?
> - [ ] Whenever a lecture or section introduces multiple files, folder organization, or imports and exports across files, does it include a visual ```` ```files ```` File Explorer panel showing the folder hierarchy and what is exported and imported where?

## 1. Code Block Rules in the River Version (`v2`)

Unlike the Original Version (`v1`), which forbade `~token~` balloons in `01-02-md-LECTURES/v1/` and added them later in `02-01-md-revised-1/`, the **River Version (`v2`)** authors finished code blocks directly in `01-02-md-LECTURES/v2/{NN}.md`.

### 1.1 Minimal, Realistic, Video-Demo-Friendly Examples & Progressive Element Introduction (`-gemini` Standard)
- Pick examples that are **minimal** in presenting the exact code problem of the principle, without mixing unrelated principles or extra visual noise.
- **Credible to Both Junior and Senior Developers (Real-World Believability)**: Every code example and rendered UI preview must look like a real, sensible page that neither a junior developer nor a senior developer would find awkward or artificial:
  - *Proper Example (Natural Page Structure, Lecture 6)*: The page renders a header, an article list, and one complete article card with its status badges; a second `<ArticleCard />` tag is added only in the single focused step that demonstrates how one file import on disk spawns multiple component subtrees in memory.
  - *Counter-Example (Awkward Repetition)*: Rendering two identical hardcoded `"New Park Opens Today"` article cards in every browser preview across an entire lecture before `props` are introduced, so every screenshot looks like a copy-paste bug to anyone browsing the page.
- Every example must be **visually clear inside a small browser window** so it can be demonstrated live in a video and shown inside a compact UI browser preview in the book:
  - *Proper Example (Progressive Introduction, Lecture 1 `Cart.jsx`)*: Principles 1 and 2 use only two lines (`<p>Items: {count}</p>` and `<button>Buy {count} items</button>`). The third line (`<input placeholder="Note to the shop" />` with typed text `"Please ring the bell"`) is added **only in Principle 3** when demonstrating that React preserves typed text and focus while `innerHTML` destroys the `<input>` DOM node.
  - *Counter-Example (Cluttered Upfront Setup, Old `SiteHeader.jsx`)*: Five separate places (`Welcome back, Mary`, `Signed in as Mary`, `<button>Mary</button>`, `Messages: 3`, `You have 3 new messages`) plus an unused `<input placeholder="Search" />` already cluttering Principles 1 and 2.
- Reuse an example from an earlier chapter **if and only if** it naturally fits the new principle, and never weigh the prose down with cross-chapter back-references.

### 1.2 Focused Snippets That Show the Complete Picture (Never Orphan a 1-Line Handshake)
- We optimize for **maximum educational clarity, never for the shortest possible word or line count**.
- While explaining a single-file rule, keep each code snippet focused on the one step being taught so the reader's eyes go straight to the line being taught.
- **Show Both Sides of Every Two-File or Parent-Child Handshake**: Whenever a concept connects **two files or two components** (such as *Exporting File* + *Importing File* + *Rendered JSX `<Tag />`*, or *Parent passing props* + *Child reading props*), **never drop a lonely 1-line snippet** (like a bare `import StoryCard from './ArticleCard.jsx';`) that forces the reader to remember what the other file exported or guess how the imported name is used in JSX. Always show the complete handshake:
  1. What the source file or component defines/exports,
  2. How the receiving file or component imports/reads it, and
  3. How the receiving component renders `<Tag />` in its JSX return.
- Use `title="src/App.jsx"` and `startLine="N"` attributes so the reader sees which file each snippet belongs to.
- Show the complete multi-component project **once** in full in the final `## Putting All Four Principles Together` section at the end of the lecture.

### 1.3 `~token~` Highlight Balloons and Comments (Every `~token~` Must Have an Inline Speech-Bubble Comment)
- Wrap the 1 or 2 focal tokens of a code snippet in `~...~` tildes (for example, `~export default~ function ArticleCard()` or `~return (~`) and **always pair that exact line with an inline comment (`// 1. ...` or `{/* 2. ... */}`)**.
- **Never leave an orphan `~token~` without an inline comment on the same line** (including inside `::: row` / `::: col` comparison columns and `> [!PRINCIPLE]` cards): in `src/build-river.mjs`, an inline comment on a `~token~` line renders as a visual speech bubble pointing directly at the highlighted token. Without an inline comment, `~token~` renders as a silent dotted underline that never tells the reader why it is highlighted!
- **Highlight the token that actually causes the rule**: For example, when showing why a file has only one default export so the importing file does not need its original name, highlight `~export default~` in the exporting file rather than `~ArticleCard~`.
- **Never write comment-only lines (`// ...`) inside a code block**: `src/build-river.mjs` turns a standalone `// ...` line into a speech bubble attached to the next line and auto-capitalizes its first letter (turning `// src/App.jsx` into a speech bubble reading `Src/App.jsx`). Always put file names in the `title="..."` attribute of the code fence (` ```jsx title="src/App.jsx" `).
- When showing a broken snippet, start the comment with `// **WRONG:** ...` so the reader sees immediately at a glance that the line is the bug.
- Never place `~token~` inside a comment, and never use more than 3 `~token~` balloons in one short snippet.

### PROPER (Short Focused Code Block with `~token~` Balloon and Clear Comment)
````markdown
```jsx title="App.jsx"
function Footer() {
  ~return~ // **WRONG:** bare return at the end of the line becomes return; and returns undefined!
    <footer>
      <p>Latest Articles, 2026</p>
      <a href="/contact">Contact us</a>
    </footer>;
}
```
````

---

## 2. Inline Box-to-Boxes Visual Figures (```` ```tree ````)

The River Version (`v2`) uses **zero external `.html` figure files**. Every Box-to-Boxes diagram is authored inline in `01-02-md-LECTURES/v2/{NN}.md` using a fenced ```` ```tree ```` block rendered by `src/build-river.mjs`.

### 2.1 Two Directions for ```` ```tree ```` Box-to-Boxes Figures
1. **Vertical Top-Down Division (```` ```tree caption="..." ````)**:
   - Places the root concept box at the top and forks into side-by-side comparison columns below it (ideal for contrasting 2 or 3 categories, such as `camelCase` vs. `PascalCase` vs. `snake_case`, or built-in HTML tags vs. React component tags).
2. **Horizontal Left-to-Right Flow (```` ```tree dir=right caption="..." ````)**:
   - Places the root box on the left and branches horizontally to the right with an arrow into the result box (ideal for step sequences or input-to-output runtime consequences).

### 2.2 Semantic Color & Icon Prefixes Inside ```` ```tree ````
- **Branch Box Theme (`+` vs. `!`)**:
  - `- +Title ...` themes the branch box in the **Green (`✓`) palette**.
  - `- !Title ...` themes the branch box in the **Red (`✗`) palette**.
- **Badge Chips (`[...]`)**:
  - Wrap code examples or tags in square brackets (`[`<main>` `<article>`]`) inside a box title; `build-river.mjs` renders them as clean `.t-chips` badges with **zero parentheses**.
- **Notes and Prescriptive Key Messages (`|` Pipe Segments)**:
  - Separate bullet notes inside a box with `|`:
  - `| Plain text` renders a regular point with a chevron icon.
  - `| !Important text` renders an emphasized point with an exclamation icon.
  - `| +**DO** ...` renders a **Green (`✓`) Key Message** banner inside the box.
  - `| ~Do **NOT** ...` renders a **Red (`✗`) Key Message** banner inside the box.
- **Strictly Zero Parentheses `(` or `)`**:
  - Never use `(` or `)` anywhere inside a ```` ```tree ```` block or its `caption`.

### 2.3 Embedded Minimal UI Browser Previews (`page`, `shop`, `mail`, `dom`, `devconsole`, `overlay`, and `::: row` / `::: col`)

To make every example visually clear in the book as well as in a live video demo, pair the archetypical code example with an embedded **UI browser preview** rendered by `src/build-river.mjs`:

1. **General Page Browser (` ```page ` / ` ```page size=mini `)**:
   - Renders a browser frame (`localhost:5173`) showing headings (`heading: Latest Articles`), cards (`card: badge=Live | badge=New | title=New Park Opens Today | author=By John Hall | text=The city opened a new park with walking paths.`), lines (`line: Hello, John Hall | good`), empty placeholders (`empty: no card on the page`), inputs (`input=Write a comment | bad=input` or `typed=See you there | good=typed`), or `blank`.
   - **100% Browser-to-Code Fidelity**: Every browser preview must faithfully reflect the exact elements returned by the code alongside it: rendering every visible heading, section line, card, and badge from the code, without inventing text that is absent from the code or hiding components that the code renders.
2. **Shopping Cart Browser (` ```shop ` / ` ```shop size=mini `)**:
   - Renders a compact online store (`Shop`) with an optional product shelf (`product: 🧦 | Wool socks | $9`) and the `Shopping Cart` box (`text: Items: 3 | good`, `input: Note to the shop | bad | empty again`, `typed: Please ring the bell | good | still here`, `button: Buy 2 items | bad | old count`).
3. **Mail App Browser (` ```mail ` / ` ```mail size=mini `)**:
   - Renders an inbox browser (`Mail`) with `toolbar:`, `section:`, and `email: From | Subject | time | flags | note` rows (`unread`, `checked`, `good`, `bad`).
4. **DevTools Elements (` ```dom `), Console (` ```devconsole `), and Vite Error Overlay (` ```overlay `)**:
   - `dom`: Shows the live browser DOM in the Elements panel, highlighting added/right nodes with `+`, broken/wrong nodes with `!`, and notes with `*`.
   - `devconsole`: Shows Chrome Console output (`x Warning: ...` in red, `= No messages` in quiet grey, or `v {type: 'p', ...}` object inspection).
   - `overlay`: Shows Vite's dark compile/runtime error overlay (`message:`, `file:`, `help:`, and code frame).
5. **Side-by-Side Visual Comparisons (`::: row` and `::: col`)**:
   - Wrap two or three `::: col title="..." tag="..." tone=bad|good|plain` blocks inside `::: row caption="..."` so the reader compares the broken UI browser and code on the left against the working UI browser and code on the right in one glance.
6. **Visual Folder & File Explorer (` ```files title="..." caption="..." `)**:
   - Whenever a lecture or section deals with project folder organization, splitting components across files, or importing and exporting across modules, include a ```` ```files ```` File Explorer block to show the disk hierarchy visually.
   - Indent nested folders and files by **2 spaces per level**. Write folders with a trailing slash (`src/`, `  components/`) and files as `filename | role | description` (using roles such as `entry`, `parent`, `child`, `boundary`, `default export`, `named exports`, `state`, or `server`).
   - In import/export or multi-file sections, use the description column to show clearly **what each file exports and what it imports from where** (with zero parentheses in prose).

### PROPER (Visual Folder Structure with ` ```files ` Showing Exports and Imports Across Folders)
````markdown
```files title="article-site: File Explorer" caption="How our project files sit inside src/ and src/components/, and what each file exports or imports."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Exports `App` as default and imports `ArticleCard` from `./components/ArticleCard.jsx`
  components/
    ArticleCard.jsx | default export | Exports `ArticleCard` as default and imports `{ LiveBadge, NewBadge }` from `./Badges.jsx`
    Badges.jsx | named exports | Exports `LiveBadge` and `NewBadge` as named exports
    ArticleList.jsx | default export | Exports `ArticleList` as default and imports `ArticleCard` from `./ArticleCard.jsx`
```
````

### PROPER (Side-by-Side UI Browser Preview + Code Comparison with `::: row` / `::: col`)
````markdown
::: row caption="Plain JavaScript updates the line and forgets the button; React updates both from count."
::: col title="Plain JavaScript" tag="one place forgotten" tone=bad
```shop size=mini
text: Items: 3 | good
button: Buy 2 items | bad | old count
```
```js title="page.js" bad="2"
const count = 3;
items.textContent = 'Items: ' + count; // Updates the line; forgets the button
```
The line says `3`. The button still says `2`.
:::
::: col title="React" tag="both places match" tone=good
```shop size=mini
text: Items: 3 | good
button: Buy 3 items | good
```
```jsx title="Cart.jsx" good="4,5"
export default function Cart() {
  const count = 3;
  return (
    <section>
      <p>Items: {count}</p>
      <button>Buy {count} items</button>
    </section>
  );
}
```
Both places read `count`, so both show `3`.
:::
:::
````

### PROPER (Vertical Box-to-Boxes Division with `+` and `!` Branches and Key Messages)
````markdown
```tree caption="The three naming conventions in code: which ones we do NOT use for React components vs. the one we DO use."
Variable and function naming conventions in code
- !`camelCase` [`myName` `articleCard`] | ~Do **NOT** use for React components | First word starts with a **small letter** | JSX treats `<articleCard />` as an **HTML tag**
- +`PascalCase` [`ArticleCard` `CommentBox`] | +**DO** use for every React component | Every word starts with a **capital letter** | JSX knows `<ArticleCard />` is **your component function**
- !`snake_case` [`my_name` `article_card`] | ~Do **NOT** use for React components | All words use **small letters** joined by `_` | JSX also treats `<article_card />` as an **HTML tag**
```
````

### PROPER (Horizontal `dir=right` Box-to-Boxes Runtime Flow)
````markdown
```tree dir=right caption="Declaring a component function in App.jsx vs. invoking its <Tag /> inside App so React renders it."
The two separate steps to make a component appear
- !Step 1 alone: Only declare the function [`function ArticleCard`] | Saves the function in memory, **but nothing calls it** | **0 cards** on screen and **0 messages** in the Console
- +Step 1 + Step 2: Also place the tag inside `App` [`<ArticleCard />`] | React **calls `ArticleCard` once per tag** during rendering | Puts the returned `<article>` **onto the page**
```
````

### 2.4 Match the Visual Format to the Shape of the Concept (Full Demo: Two-File `::: row` + Table vs. Flattened `tree`)

A 3-box ```` ```tree ```` diagram is built for **single-dimension categories or linear step sequences**. When a concept coordinates **multiple moving parts across two files or two components** (such as how Default vs. Named exports are written in File 1, imported and renamed in File 2, and rendered as a `<Tag />` in JSX), a 1-line `tree` chip hides the exporting file and the JSX tag. Instead, pair a **two-file `::: row` / `::: col` comparison** with a **4-column Markdown table**, as shown in the full demo below:

### PROPER DEMO (Self-Contained Two-File `::: row` / `::: col` Comparison with Speech Bubbles on Every `~token~` + 4-Column Overview Table)
````markdown
Look at both two-file handshakes side by side:

::: row caption="Why a default import can invent a new name directly, while a named import must write OriginalName as NewName inside curly braces."
::: col title="Renaming a Default Import" tag="no braces: any new name works" tone=good
```jsx title="src/components/ArticleCard.jsx"
~export default~ function ArticleCard() { // 1. Only ONE default export in this file
  return <article>New Park Opens Today</article>;
}
```
```jsx title="src/App.jsx" good="1,5"
import ~StoryCard~ from './components/ArticleCard.jsx'; // 2. No braces: grabs the default export and names it StoryCard

export default function App() {
  return (
    <StoryCard />
  );
}
```
`StoryCard` is not in the card file. Because there are no curly braces, JavaScript grabs the single `export default` and gives it the new nickname `StoryCard`.
:::
::: col title="Renaming a Named Import" tag="curly braces: OriginalName as NewName" tone=good
```jsx title="src/components/Badges.jsx"
export function ~LiveBadge~() { // 1. Exported by the exact name LiveBadge
  return <span>Live</span>;
}
export function NewBadge() {
  return <span>New</span>;
}
```
```jsx title="src/components/ArticleCard.jsx" good="1,5"
import { ~LiveBadge as BreakingBadge~ } from './Badges.jsx'; // 2. Finds LiveBadge first, then renames it to BreakingBadge

export default function ArticleCard() {
  return (
    <BreakingBadge />
  );
}
```
`BreakingBadge` is not in the badge file. Inside curly braces, you write `LiveBadge` first so JavaScript finds it, then `as BreakingBadge`.
:::
:::

Here is the complete picture of how default and named exports work across both files:

| Export Style | 1. In the Exporting File | 2. Normal Import in the Importing File | 3. Importing Under a Different Name |
| :--- | :--- | :--- | :--- |
| **Default Export: at most 1 per file** | `export default function ArticleCard` | `import ArticleCard from './ArticleCard.jsx'` | `import StoryCard from './ArticleCard.jsx'` |
| **Named Export: unlimited per file** | `export function LiveBadge` | `import { LiveBadge } from './Badges.jsx'` | `import { LiveBadge as BreakingBadge } from './Badges.jsx'` |
````

### COUNTER-EXAMPLE DEMO (Flattening a Two-File Relationship into a 3-Box `tree` with Mismatched Chips)
````markdown
```tree caption="How default imports and named imports differ in curly braces and renaming."
Two ways to import a component
- +Default import [`import StoryCard from './ArticleCard.jsx'`] | **No curly braces** | Any name works because the file has **only one** default export
- +Named import [`import { LiveBadge } from './Badges.jsx'`] | **Inside curly braces `{ }`** | Must match `LiveBadge` **exactly**, or rename explicitly with `as`
```
````
*Why this fails*:
1. Hides the exporting files (`ArticleCard.jsx` and `Badges.jsx`) and hides how `<StoryCard />` and `<BreakingBadge />` are rendered in JSX.
2. Shows a **renamed** import (`StoryCard`) in the first branch's `[chip]`, while showing an **un-renamed** import (`{ LiveBadge }`) in the second branch's `[chip]`, leaving the reader confused about what is being compared.

### PROPER (Concise `tree dir=right` Notes Whose Key Ideas Were Already Taught in Prose)
````markdown
```tree dir=right caption="The four stages of a JSX tag on its way from your file to the page."
One JSX tag on its way to the page
- +1. You write JSX [`App.jsx`] | `<h2 className="title">Library Hours</h2>`
- +2. The build writes a call [JSX transform] | Calls `_jsxDEV` with `"h2"` and `props`
- +3. The call returns an object [`Console` panel] | React element with `type: "h2"` and `props`
- +4. React builds the DOM [`Elements` panel] | `<h2 class="title">Library Hours</h2>` on the page
```
````

### COUNTER-EXAMPLE (Stuffing Unintroduced Panels and Long Object Literals into `tree dir=right`)
````markdown
```tree dir=right caption="The four stages of a single JSX tag on its way from your editor to the browser screen."
One JSX tag on its way to the screen
- +1. You write JSX in your editor [`App.jsx`] | `<h2 className="title">Library Hours</h2>`
- +2. Build rewrites the tag into a call [`Network panel Response`] | Calls `_jsxDEV` with `"h2"` and `{ className: "title", children: "Library Hours" }`
- +3. The call returns a React element [`Console panel`] | Plain object `{ type: "h2", props: { className: "title", children: "Library Hours" } }`
- +4. React builds the real DOM node [`Elements panel`] | Browser DOM node `<h2 class="title">Library Hours</h2>`
```
````

---

## 3. Principle Cards (`> [!PRINCIPLE]`)

At the end of each Principle section, lock the rule in a `> [!PRINCIPLE]` block containing:
1. `> **Principle N: [Short Name]: [Core Rule]**`
2. `> *[One-sentence italicized rule summary]*`
3. `> [A short explanation that starts from the root of the problem and talks to the reader in human words, with zero parentheses; the voice is shown in content-benchmarks Section 2.12]` #2026_10_24_01_group_3
4. `> **DO THIS:**` followed by a short fenced `jsx` block with a `~token~` highlight
5. `> **DO NOT DO THIS:**` followed by a short fenced `jsx` block with `// **WRONG:** ...`

### PROPER (`> [!PRINCIPLE]` Card layout, Lecture 04)

This card shows the layout: title, italic rule, explanation, and the two blocks. Its explanation still names the tags in code; for the voice of the explanation, follow [content-benchmarks/SKILL.md](../content-benchmarks/SKILL.md) Section 2.12. #2026_10_24_01_group_5

````markdown
> [!PRINCIPLE]
> **Principle 1: Rendering: React Calls the Component Wherever a Tag Names It**
>
> *Use a component by writing its name as a JSX tag, such as `<ArticleCard />`, inside another component's markup; React calls the function once for each tag.*
>
> Defining a component function does not put it on the page until a rendered component includes its `<Tag />`. During rendering, each `<ArticleCard />` tag hands the function to React so React calls it and puts the returned `<article>` HTML into the browser DOM. The component tag `<ArticleCard>` itself never appears in the DOM.
>
> **DO THIS:**
> ```jsx
> function ArticleCard() {
>   return <article>New Park Opens Today</article>;
> }
> export default function App() {
>   return <main>~<ArticleCard />~</main>; // React calls ArticleCard() and puts <article> in the DOM
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~ArticleCard~() { // **WRONG:** declared, but no <ArticleCard /> tag in App, so ArticleCard() never runs!
>   return <article>New Park Opens Today</article>;
> }
> export default function App() {
>   return <main></main>;
> }
> ```
````
