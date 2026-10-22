---
name: code-and-figures-v2
description: >
  River Version (v2) Code Blocks & Box-to-Boxes Figures skill for `01-02-md-LECTURES/v2/{NN}.md`.
  Governs short 3 to 10 line code blocks during explanations, `~token~` highlight balloons,
  numbered comments, inline `tree` Box-to-Boxes diagrams (`+` green vs. `!` red boxes,
  `+` DO vs. `~` DO NOT key messages, `[...]` badge chips), and `> [!PRINCIPLE]` DO / DO NOT cards.
---

# River Version (`v2`) — Code Blocks & Box-to-Boxes Figures (`01-02-md-LECTURES/v2/{NN}.md`)

> **Mandatory Quality Checkboxes**:
> - [ ] Does every code snippet during explanations stay between **3 and 10 lines** and test **one single step or mistake at a time**?
> - [ ] Do the sentences before and after a code block speak in plain human words (*the card*, *the heading*, *the photo*, *the footer*) and let the code block show the exact syntax?
> - [ ] Is every key idea inside a `tree` diagram or UI browser preview taught in plain words in the prose **before** the figure appears?
> - [ ] Are all `tree` labels, `[chips]`, and `| notes` short and completely free of parentheses `(` and `)`?

## 1. Code Block Rules in the River Version (`v2`)

Unlike the Original Version (`v1`), which forbade `~token~` balloons in `01-02-md-LECTURES/v1/` and added them later in `02-01-md-revised-1/`, the **River Version (`v2`)** authors finished code blocks directly in `01-02-md-LECTURES/v2/{NN}.md`.

### 1.1 Minimal, Video-Demo-Friendly Examples & Progressive Element Introduction (`-gemini` Standard)
- Pick examples that are **minimal** in presenting the exact code problem of the principle, without mixing unrelated principles or extra visual noise.
- Every example must be **visually clear inside a small browser window** so it can be demonstrated live in a video and shown inside a compact UI browser preview in the book:
  - *Proper Example (Lecture 1 — `Cart.jsx`)*: Principles 1 and 2 use only two lines (`<p>Items: {count}</p>` and `<button>Buy {count} items</button>`). The third line (`<input placeholder="Note to the shop" />` with typed text `"Please ring the bell"`) is added **only in Principle 3** when demonstrating that React preserves typed text and focus while `innerHTML` destroys the `<input>` DOM node.
  - *Counter-Example (Old `SiteHeader.jsx`)*: Five separate places (`Welcome back, Mary`, `Signed in as Mary`, `<button>Mary</button>`, `Messages: 3`, `You have 3 new messages`) plus an unused `<input placeholder="Search" />` already cluttering Principles 1 and 2.
- Reuse an example from an earlier chapter **if and only if** it naturally fits the new principle, and never weigh the prose down with cross-chapter back-references.

### 1.2 Short Focused Snippets During Explanations (Full Code Only Once at the End)
- While explaining a concept in the Runway or inside `## 1. Principle 1..N`, keep every code block **short and focused (3 to 10 lines)** so the reader's eyes go straight to the line being taught.
- Use `title="App.jsx"` and `startLine="N"` attributes so the reader sees where each snippet sits in the file.
- Show the complete multi-component `App.jsx` file **only once**, in the final `## Putting All Principles Together` section at the end of the lecture.

### 1.3 `~token~` Highlight Balloons and Comments
- Wrap the 1 or 2 focal tokens of a code snippet in `~...~` tildes (for example, `function ~ArticleCard~()` or `~return (~`) and pair that line with a concise comment (`// 1. ...` or `{/* 2. ... */}`).
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
   - Renders a browser frame (`localhost:5173`) showing headings (`heading: Latest Articles`), cards (`card: label=Local | title=New Park Opens Today | author=By John Hall | text=The city opened a new park with walking paths.`), lines (`line: Hello, John Hall | good`), empty placeholders (`empty: no card on the page`), inputs (`input=Write a comment | bad=input` or `typed=See you there | good=typed`), or `blank`.
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

### 2.4 Introduce Every Significant Key Idea Before the Figure & Keep `tree` Notes Concise

1. **Every Significant Key Idea in a Diagram Must Be Taught in the Prose First**:
   - Never sneak a **new concept or key idea** into a diagram title, subtitle, `[chip]`, or `| note` when the prose before the diagram has not taught that idea yet.
   - Do **not** misapply this rule by dumping raw Console objects, file/line coordinates, or every literal word from a figure into the prose. Teach the **significant key ideas** naturally in warm, direct English before the figure, and let the figure summarize or display them visually.
2. **Keep `tree` (Especially `tree dir=right`) Labels, Chips, and Notes Short**:
   - Keep each branch label, `[chip]`, and `| note` inside a ```` ```tree ```` block to a short phrase or compact token so the left root box is never crushed and the right-hand result cards never overflow with long code lines or multi-property object literals.

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
3. `> [2 to 3 sentence plain-English explanation with zero parentheses and zero function-call parentheses in prose]`
4. `> **DO THIS:**` followed by a short fenced `jsx` block with a `~token~` highlight
5. `> **DO NOT DO THIS:**` followed by a short fenced `jsx` block with `// **WRONG:** ...`

### PROPER (`> [!PRINCIPLE]` Card)
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
