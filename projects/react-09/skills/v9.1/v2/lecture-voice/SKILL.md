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

---

## 3. Philosophical Pedagogy of the Root (Start from the Fundamental Distinction)

Every principle (`## N. Principle N`) and its opening `###` subsection must start from the **root distinction** that blurs together as one automatic thing for a beginner, but is two separate things for an experienced developer.

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
