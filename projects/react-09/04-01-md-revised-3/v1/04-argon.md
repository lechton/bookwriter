# Lecture 4: Component Anatomy and the Capitalization Rule
> INTERVIEW QUESTION | ❱ CORE | What is a React component, what rules govern how you write and name one, and how do you render a child component inside a parent?

In React, a page is built from **components**: JavaScript functions that return **JSX** markup. `App.jsx` exports the root **parent** component (`export default function App()`), while a reusable piece such as a news card (`function ArticleCard()`) is a **child** component. When `ArticleCard` sits in the same `App.jsx` script above `App`, it is already in scope (no `import` needed; Lecture 5 moves it to its own file), yet it never appears on the page until `App` includes `<ArticleCard />` inside `App`'s `return`, governed by four rules in two pairs:

```tree caption="The four rules of defining a child component and rendering it inside a parent component."
Defining a child component (`ArticleCard`) and rendering it inside a parent (`App`)
- How the parent (`App`) includes and calls the child | inside `App`'s `return`
  - Include as a `<Tag />` in `App` (not `{ArticleCard()}`) | `react-calls-it`
  - Start the name with a capital (e.g. `ArticleCard`) | `capital-name`
- Where the child's JSX and `function` live | inside the script
  - Start JSX or `(` on the `return` line (e.g. `return (`) | `return-parentheses`
  - Define `function` at the top level outside `App` | `top-level-components`
```

::: row caption="Plain JavaScript function habits versus React's parent-and-child component rules."
::: col tone=bad title="Plain JS habits (`articleCard` + `{articleCard()}`)"
```jsx bad="1-2"
function articleCard() { return // Lowercase + bare return
  <article><h2>New Park</h2></article>; }
```
A lowercase name (`articleCard`), a newline after `return`, or calling `{articleCard()}` as a function breaks React's component tree.
:::
::: col tone=good title="React rules (`ArticleCard` + `<ArticleCard />` in `App`)"
```jsx good="1-2"
function ArticleCard() { return ( // Top-level PascalCase
  <article><h2>New Park</h2></article> ); }
```
Defined at the top level in **PascalCase** with `return (` and placed inside `App` as `<ArticleCard />`, React renders the card cleanly.
:::
:::

::: pagebreak

## 1. Include the child inside the parent as `<ArticleCard />`
*Once `function ArticleCard()` is written in `App.jsx`, is it shown automatically, and should `App` include it as `<ArticleCard />` or `{ArticleCard()}`?*

```tree size=mini here="Include as a `<Tag />` in `App` (not `{ArticleCard()}`)"
Defining a child component (`ArticleCard`) and rendering it inside a parent (`App`)
- How the parent (`App`) includes and calls the child
  - Include as a `<Tag />` in `App` (not `{ArticleCard()}`)
  - Start the name with a capital (e.g. `ArticleCard`)
- Where the child's JSX and `function` live
  - Start JSX or `(` on the `return` line (e.g. `return (`)
  - Define `function` at the top level outside `App`
```

> [!FACT]
> In `App.jsx`, `export default function App()` is the root **parent** component that React mounts. A **child** component (`function ArticleCard()`) in the same script is already in scope without `import`, yet React never runs it until `App` includes `<ArticleCard />` inside `App`'s `return` (**rendering**).

> [!PRINCIPLE]
> **Principle 1: (`react-calls-it`) Include a child inside its parent as `<ArticleCard />`, never `{ArticleCard()}`**
>
> **Why it happens:** Writing `function ArticleCard()` at the top of `App.jsx` only defines the function in memory; by default, React only mounts the parent `App`. Knowing JSX tags (Lecture 2) and `{}` expressions (Lecture 3), you might try two ways to include `ArticleCard` inside `App`: as a tag (`<ArticleCard />`) or as a function call (`{ArticleCard()}`). Omitting it renders nothing, while calling `{ArticleCard()}` runs it as a raw helper inside `App`, hiding `ArticleCard` from React's component tree and breaking Hooks! Always place the child inside `App` as `<ArticleCard />` so React calls `ArticleCard()` once per tag.
>
> **The Rule:** Always include a child component inside its parent's JSX as a tag (`<ArticleCard />`) - never leave it unplaced or call `{ArticleCard()}` as a function.
>
> *We should do this:*
>
> ```jsx
> return <main><ArticleCard /><ArticleCard /></main>; // Tag in parent: React calls it twice
> ```
>
> *We should not do this:*
>
> ```jsx
> return <main>{ArticleCard()}</main>; // **PROBLEMATIC:** function call hides child from React
> ```

```tree dir=right caption="What happens when you omit ArticleCard from App, call {ArticleCard()} as a function, or place <ArticleCard /> as a tag."
How do we include the child `ArticleCard` inside the parent `App`?
- +Include as a JSX tag (`<ArticleCard />`) inside `App` | React registers `ArticleCard` as a child component under `App` and calls it once per tag
- !Include as a function call (`{ArticleCard()}`) or omit from `App` | `{ArticleCard()}` hides the child from React's tree (breaks Hooks); omitting it renders 0 cards
```

::: page tint=blue kicker="Bug Lab · Principle 1" title="A Child Component Must Be Placed Inside the Parent App as <ArticleCard /> (Not Omitted or {ArticleCard()})" tagline="Defining ArticleCard at the top of App.jsx does nothing on its own; placing <ArticleCard /> inside App makes React call it once per tag."

```hierarchy
App | holds: the news page (`<main>`) | here: parent (`export default`) that must include `<ArticleCard />`
  ArticleCard | holds: `<article>` card + `console.log` | here: child defined at the top of `App.jsx`
notes:
`ArticleCard` (CHILD) and `App` (PARENT) share the same `App.jsx` script, so no `import` line is needed yet (multi-file `import`/`export` is Lecture 5).
By default, React only mounts `export default function App()`; `ArticleCard` never runs unless `App` includes it inside `App`'s `return`.
Point of failure: omitting `ArticleCard` from `App` leaves it uncalled (0 cards), and calling `{ArticleCard()}` bypasses React's tree; placing `<ArticleCard />` as a tag renders it properly.
```

::: row
::: col tone=bad title="Defined in `App.jsx`, not placed as `<ArticleCard />`"
```page size=mini
empty: no card on the page (ArticleCard never ran)
dom: * <main><h1>Latest Articles</h1></main>
```

> [!THINK]
> `ArticleCard()` is in `App.jsx` - why isn't it shown, and do I use `{ArticleCard()}` or `<ArticleCard />`?!

```jsx title="App.jsx (not placed in parent)" bad="3-4"
function ArticleCard() {
  return <article><h2>News</h2></article>; }
export default function App() { // PARENT
  return <main><h1>News</h1></main>; }
```
:::
::: col tone=good title="Placed inside parent `App` as `<ArticleCard />` tags"
```page size=mini
card: title=New Park Opens Today | good=card
dom: + <main><article>...</article><article>...</article></main>
```

> [!THINK]
> Placing `<ArticleCard />` as a tag inside `App` registers the child and calls `ArticleCard()` once per tag!

```jsx title="App.jsx (placed as tags in parent)" good="3-4"
function ArticleCard() {
  return <article><h2>News</h2></article>; }
export default function App() { // PARENT
  return <main><ArticleCard /></main>; }
```
:::
:::

```chain
!Not placed in `App` (or called as `{ArticleCard()}`) -> Uncalled (0 cards), or hidden from React's component tree
+Placed inside `App` as `<ArticleCard />` tags -> React calls `ArticleCard()` per tag -> Child nodes mounted in DOM
```

:::

## 2. Capitalize every component name (e.g. `ArticleCard`)
*In plain JavaScript we name functions in camelCase (`articleCard`). Why does `<articleCard />` or `<footer />` never call our child function in React?*

```tree size=mini here="Start the name with a capital (e.g. `ArticleCard`)"
Defining a child component (`ArticleCard`) and rendering it inside a parent (`App`)
- How the parent (`App`) includes and calls the child
  - Include as a `<Tag />` in `App` (not `{ArticleCard()}`)
  - Start the name with a capital (e.g. `ArticleCard`)
- Where the child's JSX and `function` live
  - Start JSX or `(` on the `return` line (e.g. `return (`)
  - Define `function` at the top level outside `App`
```

> [!FACT]
> Plain JavaScript functions use **camelCase** (`articleCard`), HTML tags use lowercase (`<article>`, `<footer>`), and React components use **PascalCase** (`ArticleCard`, `Footer`). React checks the **first letter** of every JSX tag inside `App` to tell an HTML tag from a child component.

> [!PRINCIPLE]
> **Principle 2: (`capital-name`) Start every component name with a capital (e.g. `ArticleCard`)**
>
> **Why it happens:** Inside `App`'s JSX, built-in HTML tags (`<article>`, `<footer>`) and your own child components (`<ArticleCard />`, `<Footer />`) share the exact same angle-bracket syntax. This is a trap when you bring JavaScript's `camelCase` habit into React and write `function articleCard()` and `<articleCard />`. Your card vanishes, the Elements panel shows an empty `<articlecard></articlecard>`, and the Console prints two errors (`incorrect casing` and `unrecognized in this browser`) - or for `<footer />`, silently builds an empty `<footer></footer>` with **zero errors**! You see, a lowercase first letter tells React to create an HTML tag string (`"articleCard"`) instead of calling your child function; a capital letter tells React to call your function (`ArticleCard`).
>
> **The Rule:** Name every React component in **PascalCase** (`ArticleCard`, `Footer`), starting with a capital letter in both the `function` declaration and the JSX tag inside the parent.
>
> *We should do this:*
>
> ```jsx
> function ArticleCard() { return <article><h2>News</h2></article>; } // Capital A
> ```
>
> *We should not do this:*
>
> ```jsx
> function articleCard() { return <article><h2>News</h2></article>; } // **WRONG:** small a
> ```

```tree dir=right caption="What React and the browser do for each combination of child function and tag casing."
What does the tag's first letter do?
- +Capitalize both `ArticleCard` and `<ArticleCard />` | React calls `ArticleCard()` and puts `<article>` in the DOM
- !Lowercase `<articleCard />` or `<footer />` | treated as HTML tag: empty `<articlecard>` (2 errors) or empty `<footer>` (0 errors)
```

::: page tint=blue kicker="Bug Lab · Principle 2" title="A Lowercase Tag (e.g. <articleCard />) Builds an Empty HTML Tag Instead of Calling the Child Function" tagline="React reads a lowercase first letter as a built-in HTML tag string, puts an empty <articlecard> in the DOM, and logs two Console errors."

```hierarchy
App | holds: `<main>` | here: parent placing `<articleCard />` (lowercase) vs `<ArticleCard />` (capital)
  ArticleCard | holds: `<article>` card | here: child called only when its tag starts with a capital `A`
notes:
In the broken version, both the child function (`function articleCard()`) and its tag inside `App` (`<articleCard />`) start with a lowercase `a`.
React sees the lowercase `a`, treats the tag as a built-in HTML element named `"articleCard"`, and never calls `articleCard()`.
Fixing only the tag `<ArticleCard />` while leaving `function articleCard()` lowercase crashes the page with `ReferenceError: ArticleCard is not defined`.
```

::: row
::: col tone=bad title="Lowercase: `articleCard` & `<articleCard />`"
```page size=mini
empty: no card on the page (articleCard never ran)
error: <articleCard /> is using incorrect casing (unrecognized tag)
```

> [!THINK]
> Both `articleCard()` and `<articleCard />` match - why did React build an empty `<articlecard>` tag?!

```jsx title="App.jsx (lowercase child name)" bad="1,4"
function articleCard() { // **WRONG:** small a
  return <article><h2>News</h2></article>; }
export default function App() { // PARENT
  return <main><articleCard /></main>; }
```
:::
::: col tone=good title="PascalCase: `ArticleCard` & `<ArticleCard />`"
```page size=mini
card: title=New Park Opens Today | good=card
quiet: Console: No messages (<article> rendered in DOM)
```

> [!THINK]
> Capitalizing `ArticleCard` in both the function and `<ArticleCard />` makes React call our child function!

```jsx title="App.jsx (capital A: PascalCase)" good="1,4"
function ArticleCard() { // CHILD: capital A
  return <article><h2>News</h2></article>; }
export default function App() { // PARENT
  return <main><ArticleCard /></main>; }
```
:::
:::

```chain
!`<articleCard />` (lowercase `a`) -> Treated as HTML tag string -> Empty `<articlecard>` + 2 errors
+`<ArticleCard />` (capital `A`) -> React calls `ArticleCard()` -> `<article>` rendered, 0 errors
```

:::

## 3. Open JSX or `(` on the `return` line (e.g. `return (`)
*Why does putting a line break right after a bare `return` make the child component disappear with zero Console errors?*

```tree size=mini here="Start JSX or `(` on the `return` line (e.g. `return (`)"
Defining a child component (`ArticleCard`) and rendering it inside a parent (`App`)
- How the parent (`App`) includes and calls the child
  - Include as a `<Tag />` in `App` (not `{ArticleCard()}`)
  - Start the name with a capital (e.g. `ArticleCard`)
- Where the child's JSX and `function` live
  - Start JSX or `(` on the `return` line (e.g. `return (`)
  - Define `function` at the top level outside `App`
```

> [!FACT]
> When `return` stands alone at the end of a line in JavaScript, **automatic semicolon insertion (ASI)** silently adds `;` (`return;`), exiting with `undefined`. React renders nothing for `undefined` with zero Console errors; only **ESLint** (`no-unreachable`) flags `"Unreachable code"`.

> [!PRINCIPLE]
> **Principle 3: (`return-parentheses`) Start JSX or `(` on the `return` line (e.g. `return (`)**
>
> **Why it happens:** In HTML, line breaks and indentation never change what markup does, so it feels natural to put `return` on one line and indent `<article>` on the next line. In JavaScript, that newline is a silent trap! If you put a line break right after a bare `return`, your child component's card vanishes from the page while Vite and the browser Console show **zero errors and zero warnings**! You see, JavaScript's automatic semicolon insertion sees `return` at the end of the line, inserts an invisible `;` (`return;`), and exits the function with `undefined` before reaching `<article>`. Because React allows a component to return nothing, it quietly renders an empty spot.
>
> **The Rule:** Start a one-line JSX tag on the `return` line (`return <footer>2026</footer>;`), or open `(` on the `return` line (`return (`) when JSX spans multiple lines.
>
> *We should do this:*
>
> ```jsx
> return ( <article><h2>New Park Opens Today</h2></article> ); // "(" on return line
> ```
>
> *We should not do this:*
>
> ```jsx
> return /* **WRONG:** newline after bare return -> JS adds ; and returns undefined */
> ```

```tree dir=right caption="What JavaScript returns for each way of formatting return and JSX."
Where does the JSX after `return` start?
- +Open `return (` or start `<tag>` on the `return` line | expression continues across lines and returns the `<article>` or `<footer>` JSX
- !Leave `return` alone on its line and put `<article>` below | ASI turns `return` into `return;`, returning `undefined` with 0 Console errors
```

::: page tint=blue kicker="Bug Lab · Principle 3" title="A Line Break Right After a Bare return Silently Returns undefined (Zero Console Errors)" tagline="Automatic semicolon insertion turns a bare return line into return;, so ArticleCard returns undefined and renders nothing while Footer still shows."

```hierarchy
App | holds: `<main>` with `<ArticleCard />` and `<Footer />`
  ArticleCard | holds: multi-line `<article>` | here: bare `return` vs `return (`
  Footer | holds: `<footer>2026</footer>` | here: 1-line `return`
notes:
`Footer` fits on one line (`return <footer>2026 Local News</footer>;`), so it appears at the bottom in both columns.
In the left column, `ArticleCard` puts `<article>` on the line after a bare `return`; JS inserts `;` after `return` and returns `undefined`.
The browser Console prints `"No messages"`; only ESLint in the code editor flags `<article>` as `"Unreachable code"` (`no-unreachable`).
```

::: row
::: col tone=bad title="Bare `return` + newline (`undefined`)"
```page size=mini
empty: no card on the page (ArticleCard returned undefined)
quiet: Console: No messages (ESLint: "Unreachable code")
```

> [!THINK]
> My JSX has no syntax errors and the Console is silent - why did `ArticleCard` vanish while `Footer` shows?!

```jsx title="App.jsx (bare return)" bad="2-3"
function ArticleCard() {
  return // **WRONG:** ASI adds ; -> undefined!
    <article><h2>New Park</h2></article>; }
```
:::
::: col tone=good title="`return (` opened on the `return` line"
```page size=mini
card: title=New Park Opens Today | good=card
quiet: Console: No messages (<article> and <footer> rendered)
```

> [!THINK]
> Opening `(` right on the `return` line stops JS from adding `;`, so `ArticleCard` returns `<article>`!

```jsx title="App.jsx (return with parentheses)" good="2-3"
function ArticleCard() {
  return ( // "(" on the return line: no ;
    <article><h2>New Park</h2></article> ); }
```
:::
:::

```chain
!Bare `return` + newline -> JS inserts `;` (`return;`) -> Returns `undefined` -> Card vanishes (0 errors)
+`return (` on `return` line -> Expression continues to `)` -> Returns `<article>` -> Card renders on page
```

:::

## 4. Define the child's `function` at the top level outside `App`
*To show `ArticleCard` inside `App`, we place `<ArticleCard />` inside `App`'s `return`. Why must we never define `function ArticleCard()` itself inside `function App()`?*

```tree size=mini here="Define `function` at the top level outside `App`"
Defining a child component (`ArticleCard`) and rendering it inside a parent (`App`)
- How the parent (`App`) includes and calls the child
  - Include as a `<Tag />` in `App` (not `{ArticleCard()}`)
  - Start the name with a capital (e.g. `ArticleCard`)
- Where the child's JSX and `function` live
  - Start JSX or `(` on the `return` line (e.g. `return (`)
  - Define `function` at the top level outside `App`
```

> [!FACT]
> Rendering a child inside a parent means placing its **tag** (`<ArticleCard />`) inside `App`'s `return`, while defining `function ArticleCard()` at the **top level** outside `App`. Nesting `function ArticleCard()` *inside* `App()` creates a **brand-new function in memory** every render (`fn #1 !== fn #2`).

> [!PRINCIPLE]
> **Principle 4: (`top-level-components`) Define every component `function` at the top level outside `App`**
>
> **Why it happens:** Because the child (`ArticleCard`) is rendered inside the parent (`App`), it is easy to confuse *placing `<ArticleCard />` inside `App`* with *defining `function ArticleCard()` inside `function App()`*. Suppose `ArticleCard` renders an `<input />` box where the reader types `"See you there"`. If `function ArticleCard()` sits inside `function App()`, the moment `App` re-renders, `"See you there"` is **wiped out** and the input loses **focus**! Every time `App()` runs, JavaScript creates a brand-new `ArticleCard` function in memory, so React destroys the old `<input>` DOM node and mounts an empty one.
>
> **The Rule:** Always define each component `function` at the **top level** of the script (outside `App`), and place only its JSX tag (`<ArticleCard />`) inside `App`'s `return`.
>
> *We should do this:*
>
> ```jsx
> function ArticleCard() { return <article><input /></article>; } // Top level outside App
> ```
>
> *We should not do this:*
>
> ```jsx
> function App() { function ArticleCard() { return <input />; } } // **WRONG:** function inside App
> ```

```tree dir=right caption="Where the child's function definition lives vs where its <ArticleCard /> tag is placed."
Where is `function ArticleCard()` defined?
- +Defined at top level outside `App()` | same function every render; React keeps `<input>`, `"See you there"`, and focus
- !Defined inside `function App() { ... }` | new function every render; React destroys `<input>` and wipes `"See you there"`
```

::: page tint=blue kicker="Bug Lab · Principle 4" title="Defining function ArticleCard() Inside App() Destroys Its DOM; Define It Outside App" tagline="Define the child function at the top level outside App, and place only its <ArticleCard /> tag inside App's return."

```hierarchy
App | holds: `<main>` | here: parent (`export default`) that places `<ArticleCard />` in its `return`
  ArticleCard | holds: `<article>` + `<input />` | here: child `function` defined inside `App` (bad) vs outside `App` (good)
notes:
In both columns, the parent `App` includes `<ArticleCard />` inside `<main><ArticleCard /></main>`.
In the left column, `function ArticleCard()` is defined *inside* `function App()`; when `App` re-renders, JS creates a brand-new `ArticleCard` function and React destroys the `<input>` DOM node.
In the right column, `function ArticleCard()` sits at the **top level outside `App`** and only `<ArticleCard />` is inside `App`, so React keeps `<input>` and its typed text.
```

::: row
::: col tone=bad title="`function ArticleCard()` defined inside `App`"
```page size=mini
card: title=New Park Opens on Saturday | input=Write a comment (typed text wiped!) | bad=input
dom: ! Old <input> destroyed; new empty <input> mounted
```

> [!THINK]
> Why did defining `function ArticleCard()` inside `App()` destroy `<input>` and wipe `"See you there"`?!

```jsx title="App.jsx (function nested inside App)" bad="2"
export default function App() { // PARENT
  function ArticleCard() { return <input />; } // **WRONG**
  return <main><ArticleCard /></main>; }
```
:::
::: col tone=good title="`function` outside `App`, `<ArticleCard />` inside `App`"
```page size=mini
card: title=New Park Opens on Saturday | typed=See you there | good=typed
dom: + Same <input> DOM node kept; only <h2> updated
```

> [!THINK]
> Defining `function ArticleCard()` outside `App` and placing `<ArticleCard />` inside `App` keeps `"See you there"`!

```jsx title="App.jsx (defined outside, placed inside)" good="1,3"
function ArticleCard() { return <input />; } // 1. Top level
export default function App() { // 2. PARENT
  return <main><ArticleCard /></main>; }
```
:::
:::

```chain
!`function ArticleCard()` inside `App()` -> New function on render -> Destroys `<input>` -> Wipes `"See you there"`
+`function ArticleCard()` outside `App()` -> Same function on render -> Keeps `<input>` -> Keeps `"See you there"`
```

:::

## Summary

| Principle | The Trap | The Fix |
| :--- | :--- | :--- |
| **1. `react-calls-it`** | Leaving `ArticleCard()` unplaced in `App` or calling `{ArticleCard()}` as a function. | Include the child inside the parent's `return` as a JSX tag (`<ArticleCard />`). |
| **2. `capital-name`** | Naming in camelCase (`<articleCard />` or `<footer />`): treated as an HTML tag. | Name every component in **PascalCase** (`ArticleCard`, `Footer`) with a capital letter. |
| **3. `return-parentheses`** | Putting a newline after a bare `return`: ASI turns it into `return;` (`undefined`). | Start one-line JSX on the `return` line or open `(` on the `return` line (`return (`). |
| **4. `top-level-components`** | Defining `function ArticleCard()` inside `function App()`: recreates fn and wipes DOM. | Define `function ArticleCard()` at the **top level** outside `App`; place only `<ArticleCard />` inside `App`. |

**Place the child inside the parent as `<ArticleCard />`, capitalize its name, open `return (`, and define its `function` at the top level outside `App`.**

**DO THIS:**
```jsx right
function ArticleCard() {
  return ( <article><h2>New Park Opens Today</h2><input placeholder="Write a comment" /></article> );
}
export default function App() { return <main><h1>Latest Articles</h1><ArticleCard /></main>; }
```

**DO NOT DO THIS:**
```jsx wrong
export default function App() {
  function articleCard() { return
    <article><h2>New Park Opens Today</h2></article>; }
  return <main><h1>Latest Articles</h1><articleCard />{articleCard()}</main>; }
```

> **ANSWERING THE INTERVIEW QUESTION:** A React component is a JavaScript function that returns JSX describing a reusable piece of the UI. When a child component (`ArticleCard`) is defined in the same script (`App.jsx`) as the root parent (`export default function App()`), it is already in scope without an `import` line, but React never renders it until the parent includes it inside `App`'s `return`. Four rules govern how we write and render it. First, we always include the child inside the parent as a JSX tag (`<ArticleCard />`), never by calling `{ArticleCard()}` as a plain function (which hides the child from React's component tree and breaks Hooks). Second, every component name must use *PascalCase* (`ArticleCard`, `Footer`) in both the `function` and the JSX tag, because React treats any lowercase tag (`<articleCard />`, `<footer />`) as a built-in HTML tag string. Third, returned JSX must start on the `return` line or open `(` on the `return` line (`return (`), because a newline after a bare `return` triggers *automatic semicolon insertion* (`return;`), returning `undefined` with zero Console errors. Fourth, we must define `function ArticleCard()` at the *top level* of the file outside `App` and place only `<ArticleCard />` inside `App`, because nesting `function ArticleCard()` inside `App()` recreates the function on every render and destroys its DOM subtree.
