---
name: lecture-voice-v2
description: >
  River Version (v2) Lecture Voice & Prose Law skill for `01-02-md-LECTURES/v2/{NN}.md`.
  Governs water-like CEFR B2 single-idea sentences, Division of Labor between plain human words
  in prose and syntax in code blocks, Root-First philosophical pedagogy, strictly chronological
  explanations, zero parentheses `( )` in prose/titles/diagrams, and zero fake suspense.
---

# River Version (`v2`) — Lecture Voice & Prose Law (`01-02-md-LECTURES/v2/{NN}.md`)

> **Mandatory Pre-Writing Gate**: Before writing a single line of prose, read [01-02-md-LECTURES/v2/04.md](../../../01-02-md-LECTURES/v2/04.md) and [01-02-md-LECTURES/v2/01.md](../../../01-02-md-LECTURES/v2/01.md), and follow the three-stage quality sequence in [verification/SKILL.md](../verification/SKILL.md).

---

## 1. Water-Like Flow & Calm Conceptual Umbrella (CEFR B2 — River vs. Mountain)

Every paragraph in a **River Version (`v2`)** lecture must flow like water: simple, direct, and easy to follow on the first read.

- [ ] Does every section and subsection open with a **calm conceptual umbrella** in plain human words—stating the everyday situation and why it matters—before stepping to the keyboard?
- [ ] Does every sentence carry **one single idea or event** in plain CEFR B2 words? When a sentence reaches a comma that adds a second mechanism, is it split into two sentences?
- [ ] Is the explanation of any build or runtime step focused on the single core idea the reader needs right now, without technical name-dropping or line-by-line compiler autopsies?
- [ ] Is the prose completely free of raw Console object literals (`{ type: 'article', props: { ... } }`, `Array[2]`), file/line coordinates (`App.jsx:8`, `src/App.jsx:4:8`), em-dashes, and hard-wraps?

### PROPER 1A (Calm Conceptual Umbrella Before Stepping into Code)
> When a news page loads, each card shows a different headline and author. If we type a fixed headline directly inside the tag, every card on the page says the exact same words. We need a way to keep the card's tags while reading the headline from a JavaScript variable.

### COUNTER-EXAMPLE 1A (Premature Rain of Code Details)
> Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:
> *Notes*: Disorienting and frantic. Dumps variable names, HTML tags, and quoted attribute syntax into the opening sentence before establishing the simple human idea.

### PROPER 1B (River — Explaining a Build Rewrite Simply and Directly)
> Look at how simple that rewrite is:
> - The tag's name became the first argument, such as `"article"` or `"h2"`.
> - The tag's attributes and inner content became the properties of an object in the second argument.
>
> This rewrite by the build is called the **JSX transform**. Each call returns the plain object we saw in the Console, and React calls that object a **React element**.

### COUNTER-EXAMPLE 1B (Mountain — Technical Name-Dropping & Line-by-Line Autopsy)
> Look at what the build did from top to bottom:
> 1. **Line 1, the `_jsxDEV` import**: The build automatically added an import line at the top of the file to load a helper function named `_jsxDEV` from `"react/jsx-dev-runtime"`.
> 2. **Line 3, the `_jsxDEV` call for `"article"`**: The build rewrote `<article>` into a function call. The tag's name, `"article"`, became the first argument. Its content became the `children` property inside the second argument.

### PROPER 1C (River — Explaining the Key Idea in Plain English Before a Console Figure)
> Save the file. The card appears on the page with its heading and its text. Now look at Chrome's **Console panel**. It does not show HTML text. It shows a plain JavaScript object!
>
> When we click the small triangle in the Console to open that object, we see two main properties: **`type`** holds the tag's name, `'article'`, and **`props`** holds an object with the tag's attributes and its inner content under **`children`**.

### COUNTER-EXAMPLE 1C (Mountain — Dumping the Console Log and Line Numbers into Prose)
> In Chrome's `Console` panel: Line 8 of `App.jsx`, shown as `App.jsx:8`, does not print HTML text like `"<article>..."`. Instead, it prints a plain JavaScript object: `{ type: 'article', props: { ... } }`. At index `0`, the first inner tag is `{ type: 'h2', props: { ... } }`.

---

## 2. Division of Labor: Plain Human Words in Prose, Syntax in Code, Result in Comments

Prose, code blocks, and code comments each have one job:
1. **Prose** says what we want, what we do, and why, using plain human words (*the card*, *the heading*, *the photo*, *the footer*, *the variable*).
2. **The code block** shows the exact syntax (`const title`, `<h2>`, `src={avatarUrl}`).
3. **The comment inside the code block** points to the exact token on that line and names its cause and visible effect.

- [ ] Do the sentences before and after a code block speak in plain human words (*"First, the developer writes the variable name directly inside the heading tag:"*, *"The heading on the screen shows the word title instead of the real headline."*) rather than reciting the code block's variable names and HTML tags?
- [ ] Does each snippet test **one** mistake or **one** step at a time, so the lead-in sentence only needs to state one simple action?
- [ ] Do `> [!PRINCIPLE]` explanations and conceptual summaries express the rule in clean human English without inline code litter, letting the `**DO THIS:**` and `**DO NOT DO THIS:**` blocks show the syntax?

### PROPER 2A (Plain Human Words Introducing Code — `04.md` Standard)
> First, the developer writes the footer component with a small first letter:
> ```jsx title="App.jsx" startLine="1"
> function ~footer~() { // **WRONG:** small 'f' matches the real HTML <footer> word
>   return <footer>Latest Articles, 2026</footer>;
> }
> ```
> Then the tag is also written with a small first letter:
> ```jsx title="App.jsx" startLine="5"
> export default function App() {
>   return (
>     <main>
>       <ArticleCard />
>       ~<footer />~ {/* **WRONG:** lowercase tag tells React to create an empty HTML <footer>! */}
>     </main>
>   );
> }
> ```
> The page shows the article card, but the footer at the bottom is completely blank.

### COUNTER-EXAMPLE 2A (Reciting Variable Names, Tags, and Attributes in Prose)
> Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:
> ...
> The heading on the screen literally says the word `title` instead of `New Park Opens Today`! Even worse, the `<img>` tag shows a broken image icon because the browser tried to fetch a file literally named `"{avatarUrl}"`.

### PROPER 2B (Plain Human Words & Chronological Order for a Module Mismatch)
> When you save the file, the page goes blank and the Console shows an error:
>
> ```devconsole
> x Uncaught SyntaxError: The requested module '/src/components/Badges.jsx' does not provide an export named 'default'
> ```
>
> Look at what happened across the two files in order:
> 1. In the badge file, we exported both badges **by name**, without the word `default`. So the badge file has **no default export**.
> 2. In the card file, we wrote the `import` line **without curly braces**, which asks the badge file for its single `default` export.
> 3. Because the badge file has no `default` export, the browser stops before React runs.
>
> The opposite mix-up fails the same way. If a file exports a component with `export default` and another file imports it **with** curly braces, the browser also stops with an error.

### COUNTER-EXAMPLE 2B (Dumping Error Strings, Code Statements, and "Suppose FileA..." into Prose)
> `Uncaught SyntaxError: The requested module '/src/components/Badges.jsx' does not provide an export named 'default'`
>
> Why did the page stop before React even ran? Before running a single line of component code, the browser links every `import` to its matching export slot. Because `import LiveBadge from './Badges.jsx'` has no curly braces, the browser asked `Badges.jsx` for its `default` slot. But `Badges.jsx` used `export function LiveBadge`, so its `default` slot is empty!
>
> The opposite mistake fails in the exact same way. Suppose `ArticleCard.jsx` uses `export default function ArticleCard`, and `App.jsx` imports `{ ArticleCard }` with curly braces. The browser stops and reports `does not provide an export named 'ArticleCard'`.
> *Notes*: Stuffs raw Console error strings, full `import`/`export` statements, filenames, and a hypothetical second code example (*"Suppose `ArticleCard.jsx` uses... and `App.jsx` imports..."*) directly into prose sentences in backward causal order.

---

## 2.5 Full-Section Demo: Explaining a Multi-Part Two-File Concept & Voicing Every "Unwritten Bridge" ("Where Did `X` Come From?")

Whenever two connected pieces of code use **a name, parameter, or value in Part B that is NOT visibly written in Part A** (such as `import StoryCard` when `StoryCard` is not in the other file, `function Card({ children })` when `<Card><h2>News</h2></Card>` never wrote `children=`, or `function handleClick(e)` when `onClick={handleClick}` never passed `e`), a human reader's eye immediately checks Part A and asks: **"Wait—it says `X` here, and I do not see `X` in the other code! Where did `X` come from?"**

Never leave that bridge unspoken. Call out openly in the prose that the name is **not** written in the other code, state who invents or supplies it, and walk through what JavaScript or React does step by step:

### PROPER FULL-SECTION DEMO (Complete Two-File Handshake + Explicit "Where Did `X` Come From?" Eye-Check)
````markdown
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

#### 2. Renaming a named import: write the original name first, then `as` and the new name

Our badge file is different. It has **two** named exports in the same file:

```jsx title="src/components/Badges.jsx" startLine="1"
export function ~LiveBadge~() { // 1st named export
  return <span className="badge">Live</span>;
}

export function ~NewBadge~() { // 2nd named export
  return <span className="badge">New</span>;
}
```

When an import uses **curly braces**, JavaScript **does** search the badge file by name so it knows which of the two badges we want. If our card file writes the brand-new name `BreakingBadge` directly inside curly braces, JavaScript searches the badge file for `BreakingBadge`, finds nothing, and stops with an error:

```jsx title="src/components/ArticleCard.jsx" startLine="1"
import { ~BreakingBadge~ } from './Badges.jsx'; // **WRONG:** curly braces search Badges.jsx for BreakingBadge, which does not exist!
```

To rename a named import, we write **both names** inside the curly braces with the word **`as`** between them:
1. First write **`LiveBadge`**, the exact name exported by our badge file, so JavaScript finds the right badge.
2. Then write **`as BreakingBadge`**, the new local nickname we want to use as our JSX tag:

```jsx title="src/components/ArticleCard.jsx" startLine="1"
import { ~LiveBadge as BreakingBadge~, NewBadge } from './Badges.jsx'; // 1. Finds LiveBadge first, then renames it to BreakingBadge

export default function ArticleCard() {
  return (
    <article className="card">
      ~<BreakingBadge />~ {/* 2. Renders LiveBadge under its new local nickname BreakingBadge */}
      <NewBadge />
      <h2>New Park Opens Today</h2>
    </article>
  );
}
```
````

### COUNTER-EXAMPLE FULL-SECTION DEMO (Orphaned 1-Line Snippets, Unexplained Name Trap & Code-Stuffed Prose)
````markdown
### Can the importing file choose a different name?

Because `ArticleCard.jsx` has **only one** default export, the importing file can give a default import **any local name it wants**:

```jsx title="src/App.jsx" startLine="1"
import ~StoryCard~ from './components/ArticleCard.jsx'; // Valid: renames the default import to StoryCard
```

On the other hand, when `src/components/ArticleCard.jsx` imports from `'./Badges.jsx'` inside curly braces `{ ... }`, JavaScript has to know which of the two badges in `Badges.jsx` you are asking for. If you simply wrote `import { BreakingBadge } from './Badges.jsx'`, JavaScript would look inside `Badges.jsx` for a function named `BreakingBadge`, fail to find one, and stop with an error! Instead, write `import { LiveBadge as BreakingBadge } from './Badges.jsx'`:

```jsx title="src/components/ArticleCard.jsx" startLine="1"
import { ~LiveBadge as BreakingBadge~ } from './Badges.jsx'; // Valid: renames LiveBadge to BreakingBadge
```
````
*Why this fails*:
1. **Unexplained Name Trap ("Where did `StoryCard` come from?")**: Shows `import StoryCard` without ever pointing out that `StoryCard` does **not** exist in `ArticleCard.jsx` and without explaining why no curly braces skips searching `ArticleCard.jsx` by name!
2. **Orphaned 1-Line Snippets**: Drops lonely 1-line `import` snippets without showing what `ArticleCard.jsx` or `Badges.jsx` exported or how `<StoryCard />` and `<BreakingBadge />` are rendered in JSX.
3. **Code-Stuffed Prose**: Stuffs file paths (`src/components/ArticleCard.jsx`, `'./Badges.jsx'`) and 6-word code statements (`import { BreakingBadge } from './Badges.jsx'`) directly into prose sentences instead of speaking in plain human words (*our card file*, *our badge file*) and letting a 1-line `// **WRONG:**` code block show the broken syntax.

---

## 3. Philosophical Pedagogy of the Root & Copy-Pasteable Title Catalog

Every principle (`## N. Principle N`) and its opening `###` subsection must start from the **root distinction** that blurs together as one automatic thing for a beginner, but is two separate things for an experienced developer.

### Copy-Pasteable Title & Heading Catalog (Model Your `##`, `###`, and `####` Headings on These)

| Heading Level | PROPER River Headings (Copy This Pattern) | COUNTER-EXAMPLE Headings (Do Not Write This) |
| :--- | :--- | :--- |
| **`##` Principle Titles** | `## 1. Principle 1: Rendering: React Calls the Component Wherever a Tag Names It`<br>`## 2. Principle 2: Naming: Every React Component Name Must Start with a Capital Letter`<br>`## 2. Principle 2: Default vs. Named Exports: One Default for the Main Component, Named Exports for Multiple Components`<br>`## 3. Principle 3: Match Imports to Exports: No Braces for Default, Curly Braces for Named`<br>`## 4. Principle 4: Import Paths: Every Relative Path Starts from the Importing File's Folder` | `## Principle 1: Component Rendering`<br>`## Principle 2: Capitalization Rules`<br>`## Principle 3: Imports and Exports`<br>`## Principle 4: Relative Paths` |
| **`###` Root-Distinction Openings** | `### Writing the component function and using its tag are two separate steps`<br>`### In JSX, the first letter of a tag tells React whether it is HTML or your component`<br>`### Plain text inside a tag and a JavaScript value inside curly braces are two separate worlds`<br>`### Old HTML script tags share one global space, but each module file keeps its names private`<br>`### A file can have only one default export, so a file with multiple components exports them by name`<br>`### A relative path does not start from the project root, because it starts from the folder of the file you are editing` | `### How ArticleCard renders inside App.jsx`<br>`### Using curly braces in JSX`<br>`### Default and named exports in ES modules`<br>`### Resolving relative paths in Vite` |
| **`###` & `####` Step Headings** | `### What happens when you import a named export without curly braces`<br>`### Wrapping named imports in curly braces fixes the mismatch`<br>`### Can the importing file give an imported component a different tag name?`<br>`#### 1. Renaming a default import: write any new name directly`<br>`#### 2. Renaming a named import: write the original name first, then as and the new name` | `### Named import syntax error`<br>`### Default vs. named aliasing` |

- [ ] Does the opening `###` heading of each Principle section state the root distinction in plain words (such as `### Writing the component function and using its tag are two separate steps` or `### Plain text inside a tag and a JavaScript value inside curly braces are two separate worlds`)?
- [ ] Does the opening of each Principle explain why that distinction matters both **In daily coding** and **In an interview** before showing the code step?

### PROPER (`###` Heading and Opening Grounded at the Root)
```markdown
### Writing the component function and using its tag are two separate steps

Putting a component on the screen takes **two separate steps**: first you declare the function, and then you use its tag inside `App`.

- **In daily coding**: If you write the card function, **but forget to place its tag inside `App`**, you see nothing on the screen. Declaring the function and using its tag are two separate steps.
- **In an interview**: When an interviewer asks what a component is and how it runs, do not stop at *"It is a function that returns JSX."* State both steps: you write the function, and you place its tag in `App` so **React calls your function**. That call by React is what **rendering** means.
```

### COUNTER-EXAMPLE (Starting in the Middle of Code Details Instead of the Root)
```markdown
### How `ArticleCard` renders inside `App.jsx`

Here is our `ArticleCard` function with a `console.log` inside it so we can check when it runs.
```

---

## 4. Strictly Zero Parentheses `( )` in Prose, Headings, and Diagrams

Parentheses break the forward flow of a sentence by forcing the reader to step sideways into an aside and then step back out.

- [ ] Are all body paragraphs, bullet points, `##` / `###` headings, table cells, `> [!PRINCIPLE]` explanations, and `tree` diagrams completely free of parentheses `(` and `)`?
- [ ] Where an example or clarification would normally sit inside parentheses, is it written smoothly with `, such as ... ,` or `: ...` or as its own short sentence?

### PROPER (Zero Parentheses in Prose)
> **The browser only knows built-in HTML tags**, such as a main wrapper, a heading, an article, or a footer. It has no idea what our custom card tag is.

### COUNTER-EXAMPLE (Parenthetical Asides in Prose)
> **The browser only knows built-in HTML tags** (such as `<main>`, `<h1>`, `<article>`, or `<footer>`) and has no idea what our custom card tag (`<ArticleCard />`) is.

---

## 5. Strictly Chronological Explanations & Conditions on Every Result

- [ ] Does every code explanation walk through the file in **strictly chronological order** (top-to-bottom through the file, left-to-right across a statement, before-vs.-after in time)?
- [ ] Does every statement of a result carry its **condition** (*when the curly braces are left out*, *when quotes wrap the curly braces*, *when an object is placed directly inside curly braces*) so a reader looking at any paragraph or panel caption knows which case it describes?
- [ ] Is the lecture completely free of fake suspense or riddle openers?
