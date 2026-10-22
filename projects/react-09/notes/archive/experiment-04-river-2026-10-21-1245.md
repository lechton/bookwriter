# Lecture 4: Component Anatomy and the Capitalization Rule
> INTERVIEW QUESTION | ❱ CORE | What is a React component, and how do you define and render one inside another component?

---

## Why We Split a Page into Components

Look at any real website: an online shop shows twenty product cards, and a news site shows twenty article cards. If you build that whole page inside one giant `App` function, you end up copying and pasting the same `<article>` markup twenty times. Tomorrow, when you want to change the card's design, you have to hunt through hundreds of lines and edit all twenty copies by hand.

In React, you never copy and paste the same piece of markup over and over. Instead, you split the page into small, reusable pieces called **components**.

```tree caption="Two ways to put twenty article cards on a page: copy-pasting markup by hand vs. splitting out a reusable component."
Two ways to put twenty article cards on a page
- !Copy and paste `<article>` 20 times inside `App` | One giant function; every design change means editing all 20 copies by hand
- +Split into a reusable `ArticleCard` component | Write the `<article>` markup once in `function ArticleCard()`; place `<ArticleCard />` wherever you need a card
```

You write the markup for one card inside its own JavaScript function:

```jsx title="App.jsx"
function ~ArticleCard~() { // 1. Define the component function once
  return (
    <article className="card">
      <h2>New Park Opens Today</h2>
      <p>The park on Main Street opens at noon.</p>
    </article>
  );
}
```

Then, wherever you want that card to appear inside `App`, you write the function's name as a tag:

```jsx title="App.jsx"
export default function App() {
  return (
    <main>
      <h1>Latest Articles</h1>
      ~<ArticleCard />~ {/* 2. Each tag puts one card on the page */}
      <ArticleCard />
    </main>
  );
}
```

Write `<ArticleCard />` twice, and two cards appear on the page. Write it ten times, and ten cards appear.

```tree dir=right caption="The two steps to create and use a React component."
How to create and use a component
- +1. Define the component function (`function ArticleCard()`) | Write the `<article>` markup once inside its own function
- +2. Use it as a JSX tag (`<ArticleCard />`) | Place `<ArticleCard />` inside `App` as many times as you need
```

### Two Kinds of Tags Side by Side in Your JSX

Look closely at the tags inside `App` above: `<main>`, `<h1>`, and `<ArticleCard />`. They all use angle brackets `< >`, and they sit right next to each other.

Why does it matter to your daily coding and interviews that `<main>` and `<ArticleCard />` are two different kinds of tags? Because **the browser only knows built-in HTML tags** (`<main>`, `<h1>`, `<article>`, `<footer>`). The browser has no idea what `<ArticleCard />` is. Whenever you write JSX or debug a missing component in the browser, you are dealing with two different kinds of tags:

> [!WAYS] Two kinds of tags inside JSX (and why telling them apart matters)
>
> (1) **Built-in HTML tags (`<main>`, `<article>`, `<footer>`) — start with a small letter**: The browser already knows these tags. React creates real `<main>`, `<article>`, and `<footer>` elements directly in the browser DOM.
>
> (2) **Your React component tags (`<ArticleCard />`, `<Footer />`) — start with a capital letter**: The browser does not know these tags. React never puts `<ArticleCard>` into the browser DOM; instead, React calls your `ArticleCard` function, takes the `<article>` HTML it returns, and puts only that real HTML into the browser DOM.

```tree caption="Every angle-bracket tag in JSX belongs to one of two groups: built-in browser HTML tags or your own React component tags."
Tags side by side inside JSX (`<main>`, `<h1>`, `<ArticleCard />`)
- +Built-in HTML tags (`<main>`, `<article>`, `<footer>`) | Start with a small letter · Known to the browser · Created directly in the browser DOM
- +Your React component tags (`<ArticleCard />`, `<Footer />`) | Start with a capital letter · Known only to React · React calls your function and puts its returned HTML into the DOM
```

### Four Principles of Component Anatomy

**PRINCIPLES:** A React component is a JavaScript function that returns JSX, which makes it look just like any other function you write in JavaScript. However, because React uses that function through a `<Tag />` to build and update the DOM, four real issues come up in daily debugging and code interviews:
1. **Declaring vs. invoking a component (Principle 1)**: Declaring `function ArticleCard()` and invoking `<ArticleCard />` are two separate steps. If you declare `ArticleCard` **but forget to write `<ArticleCard />` inside `App`**, nothing appears. When you place `<ArticleCard />` in `App`, **React calls your function** (that call is what **"rendering"** means) and puts only the returned `<article>` HTML into the browser DOM.
2. **Why a small first letter hides your component (Principle 2)**: If you name a component `articleCard` or `footer` with a small first letter (the way normal JavaScript functions use `camelCase`), React treats `<articleCard />` or `<footer />` as a built-in HTML tag and **never calls your function**. With `<footer />`, it prints zero errors in the Console!
3. **Why a line break after `return` erases your component (Principle 3)**: If you move multi-line JSX to the line below `return` **but forget to open `(` on the `return` line**, JavaScript automatically turns `return` into `return;` (`undefined`), and your component disappears with zero Console errors.
4. **Why putting a component inside another component wipes out user input (Principle 4)**: If you define `function CommentBox()` inside `function ArticleCard()`, JavaScript creates a brand-new `CommentBox` function in memory on every update, forcing React to destroy the `<input>` box and erase whatever the user was typing.

Here is the complete map of those four principles before we walk through each one:

| # | Principle | Why It Matters (The Real Bug or Interview Question) | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Rendering: React Calls the Component for Each Tag** | **Interview Core & Two-Step Rule:** Declaring `function ArticleCard()` without invoking `<ArticleCard />` inside `App` shows nothing on screen; and interviewers ask what "rendering" means and why `<ArticleCard>` is not in the DOM. | Place `<ArticleCard />` as a JSX tag inside `App`. React calls `ArticleCard` once per tag and puts only the returned `<article>` HTML into the browser DOM. |
| **Principle 2** | **PascalCase: Start Component Names with a Capital Letter** | **Common Bug & #1 Interview Trap:** Naming a component `articleCard` or `footer` with a small first letter makes it disappear, and `<footer />` prints zero errors! | Start every component name with a capital letter (`ArticleCard`, `Footer`) in both the function and the tag so React calls your function instead of making an empty HTML tag. |
| **Principle 3** | **Multi-Line Return: Open `(` on the `return` Line** | **Silent Debugging Nightmare:** Moving JSX to the line below a bare `return` without opening `(` makes the component vanish with zero Console or terminal errors. | When JSX spans multiple lines, put `(` on the same line as `return` (`return (`) so JavaScript does not insert a semicolon (`return;`) and return `undefined`. |
| **Principle 4** | **Top-Level Components: Never Define a Component Inside Another** | **Severe Input-Wiping Bug & Senior Interview Question:** Defining `CommentBox` inside `ArticleCard` erases whatever the user typed and loses cursor focus on every update. | Define every component at the top level of the file, outside all other functions, so React sees the same function on every render and keeps the user's DOM nodes alive. |

*(In this lesson, we keep all our components inside one file, `App.jsx`, so you can see them together at a glance. In the very next lesson, Lecture 5, we will put each component into its own file.)*

---

## 1. Principle 1: Rendering Means React Calls Your Component for Each `<Tag />`

### Why this matters: Declaring vs. invoking a component are two separate steps

Putting a component on the screen takes **two separate steps**:
1. **In coding (Declaring vs. Invoking)**: When you write `function ArticleCard()` at the top of `App.jsx` and write `function App()` below it, **but you forget to invoke `<ArticleCard />` inside `App`**, you see nothing on the screen. Why? Because **declaring** the component function and **invoking** the component are two separate steps.
2. **In an interview (What "rendering" means)**: When an interviewer asks *"What is a React component and how does it run?"*, do not stop at *"It is a function that returns JSX."* State both steps: you declare `function ArticleCard()`, and you place `<ArticleCard />` inside `App` so **React calls your function**. That function call by React is what **rendering** means.

Look at what happens when we do Step 1 (declare `function ArticleCard()`), **but forget Step 2** (never place `<ArticleCard />` inside `App`):

```jsx title="App.jsx"
function ~ArticleCard~() { // Step 1 only: declared in memory, but never used as a tag below
  console.log('ArticleCard runs');
  return (
    <article className="card">
      <h2>New Park Opens Today</h2>
      <p>The park on Main Street opens at noon.</p>
    </article>
  );
}

export default function App() {
  return (
    <main>
      <h1>Latest Articles</h1>
    </main>
  );
}
```

**Why did `ArticleCard` never run here?** Because writing `function ArticleCard() { ... }` only saves the function in memory. When the page loads, React calls `App()`. Inside `App()`, nothing invokes `<ArticleCard />`, so `ArticleCard` is never called—zero cards appear on screen, and `"ArticleCard runs"` never prints in the Console.

```tree dir=right caption="Declaring a component function in App.jsx vs. invoking its <Tag /> inside App so React renders it."
The two separate steps to make a component appear
- !Step 1 alone: Only declare `function ArticleCard() { ... }` | Saves the function in memory, but nothing invokes it: 0 cards on screen, 0 Console logs
- +Step 1 + Step 2: Also place `<ArticleCard />` inside `App`'s return | React calls `ArticleCard()` once per tag (rendering) and puts `<article>` on the page
```

### Who calls `ArticleCard`, and when?

In plain JavaScript, there are two ways to use a function:

```js title="Plain JavaScript"
function sayHello() {
  console.log('Hello');
}

~sayHello()~; // 1. With (): YOU call the function right now
button.addEventListener('click', ~sayHello~); // 2. Without (): you hand the function to the browser to call later
```

**Where did the parentheses go?** Look at how `addEventListener` works on the last line above. Do you notice something strange? It passes `sayHello` and not `sayHello()`—it does not have parentheses. We hand the function itself (a **function reference**) to the browser, and then the browser calls it later whenever the user clicks.

**React works the same way!** When we put two cards on the page, we do not call `ArticleCard()` with parentheses. Instead, we write `<ArticleCard />` twice inside `App`, just like we handed `sayHello` to `addEventListener` in plain JavaScript:

```tree caption="Why we do not call a component with parentheses () in JSX, and instead hand it to React as a <Tag />."
How to invoke a component in JSX (compared with plain JavaScript)
- !Do NOT call the component yourself with `()` (`{ArticleCard()}`) | In plain JS we write `sayHello()` to run a function right now, but we do NOT write `{ArticleCard()}` in JSX
- +DO hand the component to React as a tag (`<ArticleCard />`) | Just like `addEventListener('click', sayHello)` hands `sayHello` to the browser without `()`, `<ArticleCard />` hands `ArticleCard` to React to call
```

```jsx title="App.jsx"
export default function App() {
  return (
    <main>
      <h1>Latest Articles</h1>
      ~<ArticleCard />~ {/* 1st tag: React calls ArticleCard() a 1st time */}
      ~<ArticleCard />~ {/* 2nd tag: React calls ArticleCard() a 2nd time */}
    </main>
  );
}
```

Save the file, and two things happen immediately:
1. **On the page**: Two article cards appear below the heading.
2. **In the Console panel**: `"ArticleCard runs"` prints **twice**, once for each `<ArticleCard />` tag.

```tree caption="Each <ArticleCard /> tag inside App triggers one separate call to your ArticleCard function."
`App` renders `<main>` with two `<ArticleCard />` tags
- +First `<ArticleCard />` tag | React calls `ArticleCard()` (1st time) · Logs `"ArticleCard runs"` and returns the 1st `<article>`
- +Second `<ArticleCard />` tag | React calls `ArticleCard()` (2nd time) · Logs `"ArticleCard runs"` and returns the 2nd `<article>`
```

**What does the word "rendering" mean?** When React calls your component function to ask what markup it returns, that function call is called **rendering**.

### Why doesn't `<ArticleCard>` show up in the browser's Elements panel?

When you inspect the page in the browser's **Elements panel** to check layout or CSS, you will see `<main>` and two `<article class="card">` elements, **but no `<ArticleCard>` tag anywhere**:

```html title="Browser Elements Panel"
<main>
  <h1>Latest Articles</h1>
  ~<article class="card">~ <!-- Only the returned <article> HTML is in the DOM; <ArticleCard> is gone -->
    <h2>New Park Opens Today</h2>
    <p>The park on Main Street opens at noon.</p>
  </article>
  <article class="card">
    <h2>New Park Opens Today</h2>
    <p>The park on Main Street opens at noon.</p>
  </article>
</main>
```

**Where did `<ArticleCard>` go?** It is not in the DOM because the browser only understands built-in HTML tags (`<main>`, `<article>`, `<h2>`, `<p>`). `<ArticleCard />` is a tag for React: React calls `ArticleCard()`, takes the `<article>` HTML it returns, and puts only that real HTML into the browser DOM.

```tree dir=right caption="What happens to the two kinds of tags in App.jsx when React builds the browser DOM (Elements panel)."
Tags written in `App.jsx`
- +HTML tags (`<main>`, `<h1>`, `<article>`, `<h2>`, `<p>`) | Kept in the browser's Elements panel as real DOM nodes
- +Component tags (`<App />`, `<ArticleCard />`) | Called by React and replaced by the HTML they return; `<ArticleCard>` never appears in the DOM
```

> [!PRINCIPLE]
> **Principle 1: Rendering: React Calls the Component Wherever a Tag Names It**
>
> *Use a component by writing its name as a JSX tag (`<ArticleCard />`) inside another component's markup; React calls the function once for each tag.*
>
> Defining a component function does not put it on the page until a rendered component includes its `<Tag />`. During rendering, each `<ArticleCard />` tag hands React a reference to the function so React can call it and insert the returned HTML tags (`<article>`) into the browser DOM; the component tag `<ArticleCard>` itself never appears in the DOM.
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

---

## 2. Principle 2: Start Component Names with a Capital Letter (`PascalCase`)

### Why this matters: Naming a component with a small first letter makes React ignore your function

Because variable and function names in JavaScript cannot contain spaces, programmers use three common naming conventions to join multiple words into one name:
- **`camelCase`** (`myName`, `articleCard`, `formatDate`): the first word starts with a small letter, and each later word starts with a capital letter. This is the normal habit for variables and functions in JavaScript, **but you must NOT use it for React components**.
- **`PascalCase`** (`ArticleCard`, `CommentBox`, `Footer`): **every** word—including the very first letter—starts with a capital letter. **You MUST use `PascalCase` for every React component.**
- **`snake_case`** (`my_name`, `article_card`): all words are written in small letters and joined with an underscore `_`. Because its first letter is small, **you must NOT use it for React components** either.

```tree caption="The three naming conventions in code: which ones we do NOT use for React components vs. the one we DO use."
Variable and function naming conventions (which one works for React components?)
- !`camelCase` (`myName`, `articleCard`) — Do NOT use for React components | First word starts with a small letter · Good for normal JS variables/functions, but JSX treats `<articleCard />` as an HTML tag
- +`PascalCase` (`ArticleCard`, `CommentBox`) — DO use for React components | Every word starts with a capital letter · Required so JSX knows `<ArticleCard />` is your component function
- !`snake_case` (`my_name`, `article_card`) — Do NOT use for React components | Small letters joined by `_` · Starts with a small letter, so JSX also treats `<article_card />` as an HTML tag
```

**Why is a small first letter a trap in React?** In plain JavaScript, choosing `camelCase` (`let myName = 'John'`) vs. `PascalCase` (`let MyName = 'John'`) is only a style habit for humans. In React JSX, however, **the first letter of a tag is a strict compiler rule**:
1. **In coding**: When you declare `function articleCard()` and write `<articleCard />` with a small first letter, **React never calls your function** because JSX treats any tag starting with a small letter as a built-in browser HTML tag.
2. **In an interview**: When an interviewer asks *"Why do React components start with a capital letter (`PascalCase`)? Is it just a naming convention?"*, never say *"Yes, it's best practice."* State clearly: **No, it is a JSX compiler rule—if a tag starts with a small letter, React treats it as an HTML tag string and never calls your function.**

```tree caption="Do not confuse plain JavaScript's style habit with React JSX's compiler rule."
Is a capital first letter (`PascalCase`) just a style convention?
- !In Plain JavaScript (`let myName` vs. `let MyName`): Only a style habit | JavaScript runs both names the exact same way; do NOT give this answer in a React interview
- +In React JSX (`<articleCard />` vs. `<ArticleCard />`): A strict compiler rule | Small first letter = built-in HTML tag string; Capital first letter = React calls your component function
```

### What happens when you name a component `articleCard` with a small `a`?

Look at what happens when we declare `function articleCard()` and invoke `<articleCard />`, both starting with a small `a`:

```jsx title="App.jsx"
function ~articleCard~() { // **WRONG:** small 'a'
  console.log('articleCard runs');
  return (
    <article className="card">
      <h2>New Park Opens Today</h2>
      <p>The park on Main Street opens at noon.</p>
    </article>
  );
}

export default function App() {
  return (
    <main>
      ~<articleCard />~ {/* **WRONG:** small 'a' — JSX treats this as an HTML tag, so articleCard() never runs! */}
    </main>
  );
}
```

**Even though both names match, `articleCard()` never runs!** When you save the file:
1. **On the page**: No card appears.
2. **In the Console panel**: `"articleCard runs"` never prints, and React prints two red warnings saying `<articleCard />` uses incorrect casing and is unrecognized in this browser.
3. **In the Elements panel**: Sitting inside `<main>` is an empty, unknown HTML tag in all small letters:

```html title="Browser Elements Panel"
<main>
  ~<articlecard></articlecard>~ <!-- Empty unknown HTML tag in the DOM -->
</main>
```

### Why did a small `a` turn our component into an empty HTML tag?

**How does the JSX compiler decide whether `<Tag />` is an HTML tag or your JavaScript function?** Remember from Lecture 2 that the JSX compiler rewrites every `<Tag />` into a `_jsx(...)` call. It looks only at the **first letter of the tag**:

```js title="How the JSX Compiler Rewrites Each Tag"
~<articleCard />~ // Small 'a' -> _jsx('articleCard', {}) — quoted HTML tag string; function never runs!
~<ArticleCard />~ // Capital 'A' -> _jsx(ArticleCard, {}) — passes your function so React calls it!
```

```tree dir=right caption="How the JSX compiler rewrites a tag based on its first letter."
How JSX compiles `<Tag />`
- !Small first letter (`<articleCard />`) | Compiled with quotes: `_jsx('articleCard', {})` · Treated as an HTML tag string; your function never runs
- +Capital first letter (`<ArticleCard />`) | Compiled without quotes: `_jsx(ArticleCard, {})` · Passes your JavaScript function so React calls it
```

**What happens if you capitalize `<ArticleCard />` in `App`, but forget to capitalize `function articleCard()` at the top?** The two names no longer match, and your page crashes with `ReferenceError: ArticleCard is not defined`. You must capitalize **both** the function declaration and the JSX tag:

```tree caption="Capitalizing both the function and the tag vs. the half-fix that causes a ReferenceError."
Where you must capitalize a component's name
- +Capitalize BOTH `function ArticleCard()` and `<ArticleCard />` | Names match and start with a capital letter · React calls `ArticleCard()`
- !Capitalize only `<ArticleCard />` while leaving `function articleCard()` | Names no longer match · Page crashes with `ReferenceError: ArticleCard is not defined`
```

### The sneakiest version of this bug: `<footer />` vs. `<Footer />`

**Why is `<footer />` an even sneakier bug than `<articleCard />`?** With `<articleCard />`, React printed a Console warning because `<articlecard>` is not a real HTML word. When your component's name matches a **real HTML word** (`footer`, `header`, `button`, `form`) and you write it with a small first letter (`function footer()` and `<footer />`), **React prints zero warnings in the Console!**

```jsx title="App.jsx"
function ~footer~() { // **WRONG:** small 'f' matches the real HTML <footer> word
  console.log('footer runs');
  return <footer>Latest Articles, 2026</footer>;
}

export default function App() {
  return (
    <main>
      <h1>Latest Articles</h1>
      <ArticleCard />
      ~<footer />~ {/* **WRONG:** creates an empty HTML <footer></footer> with 0 Console warnings! */}
    </main>
  );
}
```

**Why is the Console completely empty here?** Because `<footer>` with a small `f` is a real, valid HTML tag! When you write `<footer />`, React thinks you simply want an empty HTML `<footer></footer>` tag on the page, and ignores your `footer()` function completely. Change both the function and the tag to a capital `F` (`function Footer()` and `<Footer />`), and `"Latest Articles, 2026"` appears right away.

```tree dir=right caption="The three things that happen depending on the first letter of your JSX tag."
First letter of a tag in JSX
- !Small letter, not a real HTML word (`<articleCard />`) | `_jsx('articleCard', {})` · Empty `<articlecard>` in DOM + 2 red Console warnings
- !Small letter, matches a real HTML word (`<footer />`) | `_jsx('footer', {})` · Empty `<footer></footer>` in DOM + 0 Console warnings (silent bug!)
- +Capital first letter (`<ArticleCard />`, `<Footer />`) | `_jsx(ArticleCard, {})` · React calls your function and puts its returned HTML into the DOM
```

> [!PRINCIPLE]
> **Principle 2: PascalCase: React Calls Only the Tags That Start with a Capital Letter**
>
> *Start every component's name with a capital letter (`PascalCase`) in both the `function` declaration and the JSX `<Tag />`.*
>
> JSX decides what a tag means by its first letter: a tag starting with a small letter (`<articleCard />` or `<footer />`) is treated as a built-in HTML tag name, so the browser creates an empty element and your function never runs. A capital first letter (`<ArticleCard />` or `<Footer />`) tells JSX to pass your function to React so React calls it.
>
> **DO THIS:**
> ```jsx
> function Footer() {
>   return <footer>Latest Articles, 2026</footer>;
> }
> export default function App() {
>   return <main>~<Footer />~</main>; // Capital F: React calls Footer()
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function footer() {
>   return <footer>Latest Articles, 2026</footer>;
> }
> export default function App() {
>   return <main>~<footer />~</main>; // **WRONG:** small f creates an empty HTML <footer>; footer() never runs!
> }
> ```

---

## 3. Principle 3: Open the Parenthesis on the `return` Line (`return (`)

### Why this matters: Pressing `Enter` right after a bare `return` makes your component return `undefined` with zero errors

When code crashes with a big red error box, it is easy to find and fix. The bugs that give developers a real headache are **silent bugs**: your component disappears from the screen, the browser Console shows **no error**, and the terminal shows **no warning**.

```tree caption="Two kinds of bugs when a component fails to appear: loud crashes vs. silent bugs."
Two kinds of bugs when a component fails
- +Loud crash (easy to spot: red error box in the browser or terminal) | Tells you the exact file and line number (for example, `ReferenceError: ArticleCard is not defined`)
- !Silent bug (hard to spot: component vanishes with 0 errors) | Nothing on screen, 0 Console errors, 0 terminal warnings (for example, `<footer />` or bare `return` + `Enter`)
```

**When you move multi-line JSX to the line below `return`, but forget to open `(` on the `return` line, your component returns `undefined` and disappears!**

Suppose our one-line `Footer` grows to two lines inside `<footer>`, so we press `Enter` right after the word `return` without adding `(`:

```jsx title="App.jsx"
function Footer() {
  ~return~ // **WRONG:** bare return at the end of the line becomes return; (undefined)!
    <footer>
      <p>Latest Articles, 2026</p>
      <a href="/contact">Contact us</a>
    </footer>;
}
```

### How JavaScript's Automatic Semicolon Insertion cuts off a bare `return`

**Why did pressing `Enter` after `return` erase our footer with zero Console errors?** Because in JavaScript, when you leave out a semicolon `;` at the end of a line (`const city = 'Boston'`), JavaScript automatically inserts `;` for you. This rule is called **Automatic Semicolon Insertion (ASI)**.

When JavaScript sees the word `return` sitting alone at the end of a line with nothing after it, **it automatically inserts a semicolon right after `return` (`return;`)**:

```tree dir=right caption="Where JavaScript's Automatic Semicolon Insertion (ASI) helps vs. where it sets a trap."
Automatic Semicolon Insertion (ASI) at the end of a line
- +Normal statement (`const city = 'Boston'`) | JavaScript turns it into `const city = 'Boston';` · Works as expected
- !Bare `return` at the end of a line (`return` + `Enter`) | JavaScript turns it into `return;` · Stops the function immediately and returns `undefined`
```

```js title="Plain JavaScript"
function getTitle() {
  ~return~ // JavaScript automatically inserts a semicolon here: return;
    'New Park Opens Today'; // Never reached!
}

console.log(~getTitle()~); // Logs undefined
```

**Why is the Console completely silent when this happens in `Footer()`?** Because `return;` is valid JavaScript! When React calls `Footer()`, the function stops on the `return;` line, never reaches `<footer>`, and returns `undefined`. When a component returns `undefined`, React 19 renders nothing on the screen and logs no error at all. (Your code editor will often dim the `<footer>` lines as `"Unreachable code"` because those lines can never run.)

### The 1-second fix: Keep `(` on the `return` line

Whenever your JSX spans multiple lines, open a parenthesis `(` **on the exact same line as `return`** (`return (`):

```jsx title="App.jsx"
function Footer() {
  ~return (~ // '(' on the return line keeps the statement open across lines
    <footer>
      <p>Latest Articles, 2026</p>
      <a href="/contact">Contact us</a>
    </footer>
  );
}
```

**Why does `return (` prevent the bug?** Because in JavaScript, a statement cannot end while a parenthesis `(` is still open. Putting `(` on the `return` line forces JavaScript to keep reading across the line breaks until the closing `)`.

```tree dir=right caption="The three ways to write return in a component and what JavaScript returns for each."
How you write `return` in a component
- +One-line return (`return <footer>...</footer>;`) | JSX starts on the `return` line · Returns the `<footer>` markup
- +Multi-line with `(` on the `return` line (`return (`) | Open `(` keeps the statement alive across lines · Returns the `<footer>` markup
- !Bare `return` + `Enter` (JSX on the next line) | JavaScript inserts `;` (`return;`) · Returns `undefined` (blank on screen, 0 Console errors)
```

> [!PRINCIPLE]
> **Principle 3: Automatic Semicolon Insertion: Open `(` on the `return` Line**
>
> *When a component's markup spans multiple lines, always open the parenthesis on the same line as `return` (`return (`).*
>
> Leaving `return` alone at the end of a line triggers JavaScript's Automatic Semicolon Insertion (`return;`), which stops the function immediately and returns `undefined`. React renders nothing for `undefined` and logs no error, whereas opening `return (` on the same line keeps the return statement open until the closing `)`.
>
> **DO THIS:**
> ```jsx
> function Footer() {
>   ~return (~ // '(' on the return line keeps the statement open
>     <footer>
>       <p>Latest Articles, 2026</p>
>       <a href="/contact">Contact us</a>
>     </footer>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Footer() {
>   ~return~ // **WRONG:** becomes return; and returns undefined!
>     <footer>
>       <p>Latest Articles, 2026</p>
>       <a href="/contact">Contact us</a>
>     </footer>;
> }
> ```

---

## 4. Principle 4: Define Every Component at the Top Level, Never Inside Another Component

### Why this matters: Defining one component inside another wipes out what the user is typing on every update

Suppose we want to add a comment input box (`<CommentBox />`) inside each `ArticleCard`.

**When you define one component function inside another component function (`function CommentBox()` inside `function ArticleCard()`), every update of the outer component destroys the inner component's `<input>` DOM node and erases whatever the user typed!**

Why do developers fall into this trap? In plain JavaScript, putting a small helper function inside another function is normal. In React, however, **you must never define a component inside another component**—always define every component at the **top level** of the file:

```tree caption="What we must never do with a component in React vs. where every React component must be defined."
Where to define a component function in React
- !Do NOT define a component inside another component (`function CommentBox()` inside `ArticleCard`) | Recreates `CommentBox` on every render, destroying its `<input>` DOM node and wiping user text
- +DO define every component at the top level of the file (outside all other functions) | Created once when the file loads, so React keeps its `<input>` DOM node and user text alive
```

Look at what happens when `function CommentBox()` is defined **inside** `function ArticleCard()`:

```jsx title="App.jsx"
function ArticleCard() {
  function ~CommentBox~() { // **WRONG:** defined inside ArticleCard — recreated on every render!
    return <input placeholder="Write a comment" />;
  }

  return (
    <article className="card">
      <h2>New Park Opens Today</h2>
      <p>The park on Main Street opens at noon.</p>
      <CommentBox />
    </article>
  );
}
```

**Why is this bug so dangerous?** Because on the very first page load, the comment box looks normal! The bug strikes as soon as `ArticleCard` updates:
1. The user clicks into the comment box and types `"See you there"`.
2. Now `ArticleCard` runs again to update the card (for example, we change the `<h2>` title to `"New Park Opens on Saturday"` and save, or any data in the card updates).
3. The moment `ArticleCard` runs again, **the user's typed text `"See you there"` is completely erased, and their blinking cursor disappears from the box!**

### Why does defining a component inside another component wipe out the DOM?

**How does JavaScript create a top-level function vs. a nested function in memory?**
- A function at the **top level** of a file (outside all other functions) is created **once**, when the file first loads.
- A function **nested inside another function** is created **brand-new in memory every single time the outer function runs**:

```js title="Plain JavaScript"
function makeGreeter() {
  function ~greet~() { // Created brand-new in memory every time makeGreeter() runs
    return 'Hello';
  }
  return greet;
}

const firstRun = makeGreeter();
const secondRun = makeGreeter();

console.log(~firstRun === secondRun~); // false — two different functions in memory!
```

```tree caption="Two places to define a component function in App.jsx and how JavaScript creates each one in memory."
Where a component function (`CommentBox`) is defined in `App.jsx`
- +At the top level of the file (outside all functions) | Created ONCE when the file loads · Same function in memory on every render (`CommentBox === CommentBox` is `true`)
- !Nested inside another component (inside `ArticleCard`) | Created BRAND-NEW every time `ArticleCard` runs · Different function each time (`CommentBox #1 === CommentBox #2` is `false`)
```

**Why does `CommentBox #1 !== CommentBox #2` erase the user's input?** Remember from Lecture 1 that React keeps existing DOM nodes alive on updates so `<input>` boxes do not lose their text or cursor focus. To decide whether it can keep the old `<input>`, React checks whether the component function at that spot is the **exact same function** as on the previous render (`OldFn === NewFn`):
1. **First run of `ArticleCard()`**: Creates **`CommentBox #1`** in memory and mounts the `<input>`. The user types `"See you there"`.
2. **Second run of `ArticleCard()` (on update)**: Reaches `function CommentBox()` again and creates a **brand-new function in memory (`CommentBox #2`)**.
3. **React compares `CommentBox #1 === CommentBox #2`**: The result is **`false`**. To React, a different function in memory means a **different component**, so React destroys the old `<input>` (along with `"See you there"` and the cursor) and mounts a brand-new empty `<input>`!

```tree dir=right caption="How React decides whether to keep or destroy an existing DOM node when a component updates."
React compares the component function at the same spot (`OldFn === NewFn`)
- +Same function (`CommentBox === CommentBox` is `true`) | Top-level component · React keeps the existing `<input>` DOM node, `"See you there"`, and cursor focus
- !Different function (`CommentBox #1 === CommentBox #2` is `false`) | Nested component · React destroys the old `<input>` and mounts a brand-new empty `<input>`
```

### The fix: Define every component at the top level of the file

Move `function CommentBox()` out of `ArticleCard` so it sits at the **top level of the file**, beside `ArticleCard` and `App`:

```jsx title="App.jsx"
function ~CommentBox~() { // 1. Top level of the file: created ONCE when the file loads
  return <input placeholder="Write a comment" />;
}

function ArticleCard() {
  return (
    <article className="card">
      <h2>New Park Opens on Saturday</h2>
      <p>The park on Main Street opens at noon.</p>
      ~<CommentBox />~ {/* 2. ArticleCard only renders the <CommentBox /> tag */}
    </article>
  );
}
```

**Why does the `<input>` keep its text now?** Because `CommentBox` is at the top level, JavaScript creates `CommentBox` only once when the file loads. When `ArticleCard` runs again, React checks `CommentBox === CommentBox`, gets `true`, and keeps the `<input>`, `"See you there"`, and the blinking cursor untouched. *(And if `CommentBox` ever needs a value from `ArticleCard`, you still keep `CommentBox` at the top level and pass that value to its tag, which Lecture 8 covers.)*

> [!PRINCIPLE]
> **Principle 4: Top-Level Components: Define Every Component at the Top Level**
>
> *Define every component at the top level of the file, outside all other functions, and never inside another component.*
>
> A component defined inside another component creates a brand-new function in memory on every render of the outer component (`OldFn !== NewFn`). When React sees a different function in the same spot, it destroys the old DOM nodes and builds new ones from scratch, wiping out any text the user typed and losing cursor focus.
>
> **DO THIS:**
> ```jsx
> function ~CommentBox~() { // Top level: same function in memory on every render
>   return <input placeholder="Write a comment" />;
> }
> function ArticleCard() {
>   return <article><CommentBox /></article>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ArticleCard() {
>   function ~CommentBox~() { // **WRONG:** nested inside ArticleCard — new function every render, wipes input!
>     return <input placeholder="Write a comment" />;
>   }
>   return <article><CommentBox /></article>;
> }
> ```

---

## Putting All Four Principles Together in `App.jsx`

Here is our complete `App.jsx` file with all four components (`CommentBox`, `ArticleCard`, `Footer`, and `App`) working together. Notice how every component sits at the top level, starts with a capital letter, opens `return (` on the `return` line when its markup spans multiple lines, and is rendered as a `<Tag />`:

```jsx title="src/App.jsx"
function ~CommentBox~() { // 3. Called 3rd (inside ArticleCard)
  console.log('CommentBox runs');
  return <input placeholder="Write a comment" />;
}

function ~ArticleCard~() { // 2. Called 2nd (1st child tag inside App)
  console.log('ArticleCard runs');
  return (
    <article className="card">
      <h2>New Park Opens on Saturday</h2>
      <p>The park on Main Street opens at noon.</p>
      <CommentBox />
    </article>
  );
}

function ~Footer~() { // 4. Called 4th (2nd child tag inside App)
  console.log('Footer runs');
  return (
    <footer>
      <p>Latest Articles, 2026</p>
      <a href="/contact">Contact us</a>
    </footer>
  );
}

export default function ~App~() { // 1. Called 1st when the page loads
  console.log('App runs');
  return (
    <main>
      <h1>Latest Articles</h1>
      <ArticleCard />
      <Footer />
    </main>
  );
}
```

**In what order does React call these four components when the page loads?** React starts at `App` and walks down each component's returned tags from top to bottom (1 to 4):

```tree caption="The component tree in App.jsx and the exact order (1 to 4) in which React calls each component."
`App` (1. logs `"App runs"`) | Root component returning `<main>` with `<ArticleCard />` and `<Footer />`
- +`ArticleCard` (2. logs `"ArticleCard runs"`) | First child tag in `App`; returns `<article>` with `<CommentBox />`
  - +`CommentBox` (3. logs `"CommentBox runs"`) | Child tag inside `ArticleCard`; returns `<input />`
- +`Footer` (4. logs `"Footer runs"`) | Second child tag in `App`; returns `<footer>`
```

---

## For the Interview

> **The Interview Question:** What is a React component, and how do you define and render one inside another component?

### How to Answer Clearly in 30 Seconds

"A React component is a JavaScript function whose name starts with a capital letter and that returns JSX describing one piece of the UI. To render it inside another component, we never call the function ourselves; we write its name as a JSX tag, like `<ArticleCard />`, and React calls the function for each tag. That call is what 'rendering' means. Three rules keep components working properly:
1. **Capital first letter (`PascalCase`)**: a lowercase tag like `<footer />` or `<articleCard />` is treated as a built-in HTML tag, so our function never runs.
2. **Open `(` on the `return` line**: a bare `return` with JSX on the next line triggers Automatic Semicolon Insertion (`return;`) and returns `undefined`.
3. **Top-level definition**: we define every component at the top level of the file, never inside another component, because a nested component creates a new function in memory on every render and forces React to destroy and recreate its DOM nodes."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Is starting a component name with a capital letter (`PascalCase`) just a naming convention?"**
   **No.** In plain JavaScript, `camelCase` (`let myName = 'John'`) is only a style convention for humans. In React, the first letter of a JSX tag is how the compiler tells built-in HTML tags apart from your components. A lowercase first letter (`<articleCard />` or `<footer />`) is compiled as an HTML tag string (`'articleCard'` or `'footer'`), so the browser creates an empty HTML element and your function never runs. A capital first letter (`<ArticleCard />` or `<Footer />`) passes your JavaScript function to React so React calls it.
2. **"What happens if you define a child component inside a parent component (`function CommentBox()` inside `function ArticleCard()`)?"**
   On the first render, it appears to work. On every re-render of the parent, however, JavaScript creates a **brand-new function object in memory** for the inner component (`oldFn !== newFn`). When React compares the new render with the previous one, it sees a different function at that position, assumes it is a completely different component, and unmounts the old DOM nodes and mounts new ones from scratch. Any typed input text or cursor focus inside that child component is wiped out on every update.
3. **"Does `<ArticleCard>` appear in the browser's DOM (Elements panel), and is `<ArticleCard />` the same as calling `{ArticleCard()}`?"**
   No to both. First, the browser DOM only holds real HTML tags (`<main>`, `<article>`, `<h2>`); `<ArticleCard />` is for React, so `<ArticleCard>` never appears in the Elements panel. Second, writing `<ArticleCard />` hands the function reference to React so React knows a component lives at that spot on the page, whereas calling `{ArticleCard()}` yourself only hands React the returned `<article>` HTML and hides the component from React.

```tree dir=right caption="Interview comparison: rendering a component as a JSX tag (<ArticleCard />) vs. calling it directly ({ArticleCard()})."
`<ArticleCard />` vs. `{ArticleCard()}` in an interview
- +JSX tag (`<ArticleCard />`) | Hands the `ArticleCard` function to React · React tracks `ArticleCard` as its own component in the tree
- !Direct function call (`{ArticleCard()}`) | You call the function yourself · React only sees the returned `<article>` HTML; the component is hidden from React
```
