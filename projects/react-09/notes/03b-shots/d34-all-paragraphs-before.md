# Lecture 3: JSX Syntax and the Single-Root Rule
> INTERVIEW QUESTION | ❱ CORE | What is JSX, what syntax rules must every snippet follow, and how do Fragments group elements without wrapper nodes?

::: pagebreak

# React JSX Syntax

## Two different ways to write markup

The same markup can reach the page in two ways:

```tree caption="Two places markup can live: an HTML file the browser reads, or a component the build turns into JavaScript."
Two different ways to write markup
- The normal HTML markup | the browser reads it as it is, and forgives open tags
- The React markup (JSX): it is not simple HTML | the build turns it into JavaScript first, and stops at any open tag
```

Why does the difference matter? An HTML file forgives: a tag left open, or two tags side by side at the top of the file, still gives a page. The build does not: one open tag, or two tags side by side directly after `return`, stops the whole file, and nothing in it runs. Of this lecture's mistakes, only wrong attribute names get past it, and they show up as errors in the Console, as section 5 shows. In exchange, markup in a component is part of a function, so the component can be placed anywhere with one tag, and later fill its markup from data. So markup moves into components, and it follows JavaScript's rules.

## The React markup (JSX) vs Normal HTML

Pasted markup must follow five rules in a component. Two words first: a **box** here means an extra element on the page, such as a `<div>`, which the interview question calls a wrapper node; and a **root** is the one outermost tag a component returns, which holds all the others.

```tree caption="The five rules of JSX."
Five rules for JSX in a component
- Each tag becomes a call | `<h2>` becomes a function call
  - A small letter: an HTML tag | `"h2"`, a string
  - A capital letter: our component | `ArticleCard`, our function
- Every tag is closed | `<img />`, `<br />`
- One root per return | one `<article>` around the rest
- A Fragment when no box is wanted | `<>` and `</>`
- Attributes use JavaScript names | `className`, `htmlFor`
```

We take the rules in this order. The first explains all the others: once a tag is a call, the next two rules follow, and the build checks them before anything runs, so they appear as error overlays. The Fragment answers the problem the one-root rule creates. The attribute names come last, because the build accepts the wrong ones; only the Console complains, once the page runs.

::: pagebreak

# Principles

## 1. Each tag becomes a call that returns an object

*How? Due to a proper JSX transform*

```tree size=mini here="Each tag becomes a call"
Five rules for JSX in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!FACT] A JavaScript **object** keeps values under names: `{ name: 'John Hall', city: 'Boston' }`. Each name with its value is a **property**. Stored in a variable, as `const author = { name: 'John Hall' };`, a property is read with a dot: `author.name` gives `'John Hall'`. An object can hold other objects.

> [!PRINCIPLE]
> **Principle 1: Each tag becomes a call that returns an object**
>
> We read JSX as JavaScript. On the dev server, the build turns each tag into a call of `_jsxDEV`, a function it imports from React.
>
> The call returns an object that describes the element. React builds the DOM, the page's real elements, from those objects.
>
> *We should do this:*
>
> ```jsx
> function Greeting() {
>   const note = ~<p>Hello, John Hall</p>~; // The build turns this tag into a call that returns an object
>   return note;
> }
> ```

### Example: let's log a tag in the Console (it is an object!)

We want a greeting on the page. The greeting comes from the child, `Greeting.jsx`. The parent, `App.jsx`, imports it and places it with its tag. Each component lives in its own file, named after it:

::: row caption="The greeting on the page, and the two components that put it there."
::: col title="The page" tone=plain
```page
line: Hello, John Hall
```
The page shows the tag's text.
:::
::: col title="React Components" tone=plain
```jsx title="App.jsx" role=PARENT
import ~Greeting~ from './Greeting.jsx'; // Our component, from its own file

export default function App() {
  return <Greeting />;
}
```
```jsx title="Greeting.jsx" good="3" role=CHILD
export default function Greeting() {
  const note = <p>Hello, John Hall</p>;
  console.log(~note~); // Logs the object the tag became
  return note;
}
```
:::
:::
### Component Hierarchy

How the two components connect:

```hierarchy
App | holds: the page
  Greeting | holds: one greeting, in a variable | here: logs the greeting, then returns it
notes:
`App`, in `App.jsx`, imports `Greeting` from `Greeting.jsx` and places it with `<Greeting />`.
`Greeting` stores its tag in a variable, `note`, logs it with `console.log`, and returns it.
We want: to see what the tag really is, once the build has rewritten it.
```

### Let's check our console log

The Console does not show the markup as text: it shows an object, which we open by clicking its triangle. This project leaves Strict Mode out, so the object is logged once:

```devconsole source="Greeting.jsx:3" caption="The object in Chrome's Console, opened with its triangles; React adds more properties, left out here."
v {type: 'p', props: {…}}
  type: "p" | The tag's name, kept as text
  v props: {children: 'Hello, John Hall'}
    children: "Hello, John Hall" | The tag's content
```
### What is the JSX transform?

> [!FACT] To see a file as the browser received it, after the build: in the developer tools, open the **Network panel**, reload the page, click `Greeting.jsx`, and open its Response. The Sources panel shows our original file by default, because the dev server also sends a source map, a file that links the rewritten code back to our lines.

In that Response, `Greeting.jsx` has no tags at all. The greeting's tag, followed from the file to the page:

```stages caption="One tag on its way to the page, and where to see each stage."
We write | Greeting.jsx | <p>Hello, John Hall</p>
The build writes a call | Network panel, shortened | _jsxDEV("p", { children: "Hello, John Hall" })
The call returns an object | Console panel, with console.log | { type: 'p', props: { children: 'Hello, John Hall' } }
React builds the DOM | Elements panel | <p>Hello, John Hall</p>
```

This rewrite is the **JSX transform**. The tag's name becomes the call's first argument; its attributes and its content become one object, the second, which React keeps under the name `props`, a word a later lecture builds on. The call returns a plain object, a **React element**, and React builds the DOM from those objects, so the browser never receives JSX: it receives calls, and React builds the elements from them. The dev server also adds a line at the top of the file that imports `_jsxDEV` from React. A separate command, `npm run build`, is a second rewrite, not the dev server's build: it rewrites every file once to publish the site, and there the call is the shorter `jsx`.

## 1B. A component's name starts with a capital letter

*Why? Otherwise the JSX transform fails*

```tree size=mini here="A capital letter: our component"
Five rules for JSX in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!PRINCIPLE]
> **Principle 1B: A component's name starts with a capital letter**
>
> The tag's name becomes the call's first argument, and its first letter decides what that argument is. A name with a capital letter is written as it is, a reference to our function, and React calls it. A name with a small letter is written in quotes, a string that names an HTML tag.
>
> *We should do this:*
>
> ```jsx
> function App() {
>   return ~<ArticleCard />~; // A capital: the call receives our function
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function App() {
>   return ~<articleCard />~; // **PROBLEMATIC:** a small letter: only a string
> }
> ```

### Example: let's name our component with a small letter (it fails!)

The same rewrite that turns `<p>` into a call also turns the tags of our own components into calls. We want the card's heading on the page. The heading comes from the child, `ArticleCard.jsx`. The parent, `App.jsx`, imports it but places it with a small letter, `<articleCard />`, and the card does not appear:

```jsx title="App.jsx" bad="4" role=PARENT
import ~ArticleCard~ from './ArticleCard.jsx'; // Our component, from its own file

export default function App() {
  return ~<articleCard />~; // **PROBLEMATIC:** a small letter: only a string
}
```

```jsx title="ArticleCard.jsx" role=CHILD
export default function ArticleCard() {
  return ~<h2>Library Hours</h2>~; // Never drawn: React never calls this function
}
```

### Component Hierarchy

How the two components connect:

```hierarchy
App | holds: the page | here: places the card with its tag
  ArticleCard | holds: the card's heading
notes:
`App` places the card with a tag, `<articleCard />`, its name written with a small letter.
The tag's name becomes the call's first argument, so its first letter decides what the call receives.
We want: React to call our function and draw the card.
```
### The JSX transform that fails

A name with a capital is written into the call as it is, as a reference to our function; a name with a small letter is written in quotes, as a string that names an HTML tag. With a small letter, the card does not appear, and the Console shows two errors, `<articleCard /> is using incorrect casing` and `The tag <articleCard> is unrecognized in this browser`:

```chain caption="Two tags and the calls the build writes for them, shortened."
+`<ArticleCard />` -> `_jsxDEV(ArticleCard)` -> the call holds our function: React calls it
!`<articleCard />` -> `_jsxDEV("articleCard")` -> the call holds only a string: an empty <articlecard> in the Elements panel, and two Console errors
```

## 2. Every tag is closed: <img />

*What if not? The build stops, and nothing in the file runs*

```tree size=mini here="Every tag is closed"
Five rules for JSX in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!FACT] Some HTML tags can never hold anything inside them, such as `<img>`, `<br>`, and `<input>`. They are called **void elements**, and HTML lets them stay open, with no closing tag.

> [!PRINCIPLE]
> **Principle 2: Every tag is closed, `<img />` and `<br />` too**
>
> We close every tag, with a closing tag or with a slash. That includes tags that hold nothing, such as `<img />` and `<br />`.
>
> The build must know where each tag ends. A tag left open stops the build, and nothing in the file runs.
>
> *We should do this:*
>
> ```jsx
> function Author() {
>   return (
>     <section>
>       <img src="/john.jpg" ~alt="John Hall" />~ {/* Closed with a slash: the tag ends here */}
>       <p>John Hall<br />Boston</p>
>     </section>
>   );
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function Author() {
>   return (
>     <section>
>       <img src="/john.jpg" ~alt="John Hall">~ {/* **WRONG:** no slash: the build waits for </img> */}
>       <p>John Hall~<br>~Boston</p> {/* **WRONG:** the br is left open too */}
>     </section>
>   );
> }
> ```

### Example: let's use `<img>` instead of `<img />` (it fails!)

> [!FACT] Inside JSX markup, a comment is written in curly braces, `{/* like this */}`; in plain JavaScript lines, `//` works as usual. The boxes use both. An HTML comment, `<!-- ... -->`, pasted into JSX stops the build with "HTML comments are not allowed in modules".

We want a photo, with a name and a city under it. The parent, `App.jsx`, places the child, `Author.jsx`. We leave the `<img>` open, as HTML allows, and the build stops. Only the image is left open, so the build has one problem to report:

```jsx title="App.jsx" role=PARENT
import ~Author~ from './Author.jsx'; // Our component, from its own file

export default function App() {
  return <Author />;
}
```

```jsx title="Author.jsx" bad="4" role=CHILD
export default function Author() {
  return (
    <section>
      <img src="/john.jpg" ~alt="John Hall">~ {/* **WRONG:** no slash: the build waits for </img> */}
      <p>John Hall<br />Boston</p>
    </section>
  );
}
```

### Component Hierarchy

How the two components connect:

```hierarchy
App | holds: the page
  Author | holds: a photo, a name, and a city | here: returns the image left open
notes:
`App`, in `App.jsx`, imports `Author` from `Author.jsx` and places it with `<Author />`.
The `<img>` in `Author` is written as HTML allows: open, with no closing tag.
We want: the photo, then the name and the city on two lines.
```

### Let's check the error overlay

When `<img>` has no slash, the build stops and an error overlay covers the page; with the slash, the page appears. The two versions differ in one line. Each browser shows the result, and under it, the code that made it:

::: row caption="The image left open, and the image closed with a slash. The browsers on top, the code under each."
::: col title="The image left open" tone=bad
```overlay size=mini
message: [PARSE_ERROR] Expected corresponding JSX closing tag for 'img'.
 4 │ <img src="/john.jpg" alt="John Hall">
   │  ─┬─
   │   ╰─── Opened here
 6 │ </section>
   │   ───┬───
   │      ╰───── Expected `</img>`
```
```jsx
<img src="/john.jpg" alt="John Hall">
```
With the image open, the build reads on to line 6, finds `</section>` where it expected `</img>`, and stops; the overlay points back to line 4, where the image opened. Nothing in the file runs.
:::
::: col title="The image closed with a slash" tone=good
```page size=mini
card: img=/john.jpg | alt=John Hall | lines=John Hall; Boston
```
```jsx
<img src="/john.jpg" alt="John Hall" />
```
With the slash, the photo appears, with the name and the city on two lines.
:::
:::

A `<br>` left open, as in the principle's second box, stops the build in the same way, with `'br'` in the message.

### Why does an open tag stop the build?

Section 1 showed that each tag becomes a call. To write a call, the build must know where each tag's content ends. After an open tag, the build reads everything as that tag's content, until it finds the matching closing tag. HTML makes an exception for void elements; JSX makes none:

```chain caption="What the build reads after the image, in each version."
!`<img ...>` opens -> the `<p>` becomes the image's content -> at `</section>`, it still waits for `</img>`: the build stops
+`<img ... />` closes at once -> the `<p>` sits next to the image -> `</section>` closes the section
```

### How each kind of tag is closed

One question decides how we close a tag, whether it can ever hold anything:

```tree dir=right caption="How each kind of tag is closed in JSX."
How is a tag closed in JSX?
- +a tag with content | a closing tag: <p>...</p>, <li>...</li>
- +a void element, which never holds anything | a slash: <img />, <br />
- +any other tag, when empty | a slash or a closing tag: <div />
- !a tag left open, as HTML allows | the build stops
```
## 3. One root per return

*Why? Each component creates a JS function that returns one value*

```tree size=mini here="One root per return"
Five rules for JSX in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!PRINCIPLE]
> **Principle 3: One root per return**
>
> A component returns one root: one element, or a Fragment as section 4 shows, that holds the rest.
>
> Each tag is one call, and so one value. Two values side by side, with nothing joining them, are not valid JavaScript, so two tags side by side stop the build. This holds wherever JSX stands: after `return`, or in a variable.
>
> *We should do this:*
>
> ```jsx
> function Author() {
>   return (
>     ~<section>~ {/* One root holds both tags */}
>       <h2>John Hall</h2>
>       <p>Author of 12 articles</p>
>     </section>
>   );
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function Author() {
>   return (
>     <h2>John Hall</h2>
>     ~<p>Author of 12 articles</p>~ {/* **WRONG:** a second root: the build stops */}
>   );
> }
> ```

### Example: let's try to return two roots (it fails!)

We want the author's name, with a line under it. The parent, `App.jsx`, places the child, `Author.jsx`. We return the two tags side by side, as an HTML file allows, and the build stops. Every tag is closed, so this is the only problem:

```jsx title="App.jsx" role=PARENT
import ~Author~ from './Author.jsx'; // Our component, from its own file

export default function App() {
  return <Author />;
}
```

```jsx title="Author.jsx" bad="4" role=CHILD
export default function Author() {
  return (
    <h2>John Hall</h2>
    ~<p>Author of 12 articles</p>~ {/* **WRONG:** a second root: the build stops */}
  );
}
```

### Component Hierarchy

How the two components connect:

```hierarchy
App | holds: the page
  Author | holds: a heading and a paragraph | here: returns two tags side by side
notes:
`App`, in `App.jsx`, imports `Author` from `Author.jsx` and places it with `<Author />`.
`Author` returns two tags, `<h2>` and `<p>`, side by side, with nothing around them, as an HTML file allows.
We want: the name, and the line under it, on the page.
```

### Let's check the error overlay

When the two tags stand side by side after `return`, the build stops; with one element around both, the page appears. Each browser shows the result, and under it, the code that made it:

::: row caption="Two tags side by side after return, and the same tags inside one section. The browsers on top, the code under each."
::: col title="Two tags side by side" tone=bad
```overlay size=mini
message: Adjacent JSX elements must be wrapped in an enclosing tag.
help: Did you want a JSX fragment <>...</>?
```
```jsx
return (
  <h2>John Hall</h2>
  ~<p>Author of 12 articles</p>~ {/* **WRONG:** a second root: the build stops */}
);
```
With two tags side by side, the build stops, and nothing in the file runs.
:::
::: col title="One `<section>` around both" tone=good
```page size=mini
card: title=John Hall | text=Author of 12 articles
```
```jsx
return (
  ~<section>~ {/* One root around both: the build passes */}
    <h2>John Hall</h2>
    <p>Author of 12 articles</p>
  </section>
);
```
With one element around both, the name and the line appear.
:::
:::

### Why do two tags side by side stop the build?

Section 1 showed that each tag becomes a call, and that a call returns one value. `return` gives back one value too, so it has room for one call, not two:

```chain caption="Why two tags side by side stop the build."
!two tags after `return` -> two calls, so two values side by side -> nothing joins them, so it is not valid JavaScript: the build stops
+one `<section>` around both -> one call, whose content holds the other two -> one value: the name and the line appear
```

The two inner calls become the content of the outer one: in the object of `<section>`, `children` holds the objects of the `<h2>` and the `<p>`, where in section 1 it held the greeting's text. The overlay's help line points at a second way to give one root, which section 4 takes up.
## 4. A Fragment when no box is wanted

*When? The tags need one root, but the page needs no extra box*

```tree size=mini here="A Fragment when no box is wanted"
Five rules for JSX in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!FACT] In CSS, `display: flex` on a list makes a **flex layout**: the list's children sit side by side in a row. `.items > li` is a **child selector**: it styles only an `<li>` that sits directly inside `.items`, not one deeper down. In JSX, the `class` attribute is written `className`, as a later principle explains: `<ul className="items">`.

> [!PRINCIPLE]
> **Principle 4: A Fragment when the page needs no extra box**
>
> When tags need one root but the page needs no extra box, we group them with a Fragment, `<>` and `</>`. React adds no element for it.
>
> We keep a real element as the root only when the page needs that box, for its meaning or for a style.
>
> *We should do this:*
>
> ```jsx
> function Items() {
>   return (
>     ~<>~ {/* Groups the items, and adds no element to the DOM */}
>       <li>First</li>
>       <li>Second</li>
>     </>
>   );
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function Items() {
>   return (
>     ~<div>~ {/* **PROBLEMATIC:** a box between the list and its items */}
>       <li>First</li>
>       <li>Second</li>
>     </div>
>   );
> }
> ```

### Example: let's group the items with a `<div>` (the row breaks!)

In the previous examples, an extra element around the tags did no harm: a `<section>` around a name and a line changed nothing on the page. Here an extra `<div>` or `<section>` breaks the page's style.

CSS is sensitive to the hierarchy of DOM elements. Many CSS rules style an element by its place under its parent: a rule can style only the `<li>` items that sit directly inside a list, for example. When we add a new element in between, such as a `<div>`, the items are no longer directly inside the list, and the rule stops applying. The page loses that style, and neither the build nor the Console warns us.

These CSS rules often come from a web designer, not from the React developer. So a React developer can break a style without knowing that it exists. A React developer needs to know how the page's CSS depends on its elements.

We want a list with two items. The list is in the parent, `App.jsx`. The items come from the child, `Items.jsx`. A component returns one root, so we wrap the two items in a `<div>`:

::: row
::: col tone=none
```jsx title="App.jsx" role=PARENT
import ~Items~ from './Items.jsx'; // Our component, from its own file

export default function App() {
  return (
    <ul className="items">
      <Items />
    </ul>
  );
}
```
:::
::: col tone=none
```jsx title="Items.jsx" bad="3" role=CHILD
export default function Items() {
  return (
    ~<div>~ {/* **PROBLEMATIC:** a box between the list and its items */}
      <li>First</li>
      <li>Second</li>
    </div>
  );
}
```
:::
:::

A stylesheet, `index.css`, shows the list as a row, with a border on each item that sits directly inside the list:

```css title="index.css"
.items { display: flex; gap: 24px; }
.items > li { border: 1px solid #999; }
```

### Component Hierarchy

How the two components connect:

```hierarchy
App | holds: the list, `<ul className="items">` | here: draws the list around the items
  Items | holds: two list items | here: returns them inside a `<div>`
notes:
`App`, in `App.jsx`, imports `Items` from `Items.jsx` and places it inside the list: `<ul className="items"><Items /></ul>`.
`index.css` styles the list as a row, with a border on each item that sits directly inside it.
We want: one root for the two items, and nothing between the list and its items, so the row and the borders still apply.
```

### Let's check the Elements panel

With the `<div>`, the build passes, and the Console stays clean (React checks some nesting rules, such as a `<div>` inside a table row, but not a `<div>` inside a `<ul>`), yet the row breaks; with a Fragment instead, the row and the borders appear. Each column shows the page on top, then the Elements panel, then the code that made it:

::: row caption="The two items, grouped by a div and by a Fragment. The pages on top, then the Elements panels, then the code."
::: col title="Grouped by a `<div>`" tone=bad
```page size=mini
stack: First ; Second
```
```dom title="Elements panel"
<ul class="items">
!  <div>
    <li>First</li>
    <li>Second</li>
!  </div>
</ul>
```
```jsx
~<div>~ {/* **PROBLEMATIC:** now the list's only child */}
  <li>First</li>
  <li>Second</li>
</div>
```
With the `<div>`, the list's only child is the `<div>`: the items stack, with no border.
:::
::: col title="Grouped by a Fragment, `<>`" tone=good
```page size=mini
row: First ; Second
```
```dom title="Elements panel"
<ul class="items">
+  <li>First</li>
+  <li>Second</li>
</ul>
```
```jsx
~<>~ {/* No element: the items stay the list's children */}
  <li>First</li>
  <li>Second</li>
</>
```
With the Fragment, the items are the list's own children: a row, each with its border.
:::
:::

### Why does a `<div>` break the row?

A `<div>` is a real element, so React builds it in the DOM, between the list and its items. The flex layout arranges the list's children, and its only child is now the `<div>`; the child selector finds no `<li>` directly inside the list. A **Fragment**, written `<>` and `</>`, is one call too, so it gives one root, but React builds no element for it and puts its children straight into the parent.

### What to group tags with

The choice depends on one question, whether the page needs the box:

```tree dir=right caption="What to group tags with, and what each leaves in the DOM."
What groups the tags into one root?
- +a Fragment, <> and </> | when the page needs no box: nothing added to the DOM
- +an element, such as <section> | when the page needs the box, for its meaning or a style
- !a <div> between a list or a flex row and its items | when a style targets direct children, it misses the items
```
## 5. Attributes use JavaScript names: className, htmlFor

*Why? `class` and `for` are reserved words in JavaScript*

```tree size=mini here="Attributes use JavaScript names"
Five rules for JSX in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!FACT] JavaScript keeps some words for itself, such as `return`, `class`, and `for`: they are **reserved words**. HTML's `aria-*` attributes, such as `aria-label`, describe an element to screen readers; `data-*` attributes, such as `data-form-id`, store our own values on an element.

> [!PRINCIPLE]
> **Principle 5: Attributes use JavaScript names**
>
> Each attribute becomes a property of the object the call receives, and React mostly uses the DOM's own property names. So `class` becomes `className`, and `for` becomes `htmlFor`. The DOM chose those names because `class` and `for` are reserved words in JavaScript.
>
> Names of several words use camelCase, where each later word starts with a capital, such as `tabIndex`. Only `aria-*` and `data-*` keep their dashes.
>
> *We should do this:*
>
> ```jsx
> function SignUp() {
>   return <label ~className~="label" htmlFor="name">Name</label>; // JavaScript names: the Console stays clean
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function SignUp() {
>   return <label ~class~="label" for="name">Name</label>; // **PROBLEMATIC:** HTML names: React logs an error for each
> }
> ```

### Example: let's keep HTML's attribute names (the Console fills with errors!)

We want a form with a label and a field. The parent, `App.jsx`, places the child, `SignUp.jsx`. We keep HTML's attribute names, `class`, `for`, and `tabindex`, and the Console fills with errors. The build accepts these names, so the page still appears:

```jsx title="App.jsx" role=PARENT
import ~SignUp~ from './SignUp.jsx'; // Our component, from its own file

export default function App() {
  return <SignUp />;
}
```

```jsx title="SignUp.jsx" bad="4-5" role=CHILD
export default function SignUp() {
  return (
    <form>
      <label ~class~="label" for="name">Name</label> {/* **PROBLEMATIC:** HTML names: class and for */}
      <input id="name" ~tabindex~="0" /> {/* **PROBLEMATIC:** React wants tabIndex */}
    </form>
  );
}
```

### Component Hierarchy

How the two components connect:

```hierarchy
App | holds: the page
  SignUp | holds: a form, with a label and a field | here: returns the form with HTML names
notes:
`App`, in `App.jsx`, imports `SignUp` from `SignUp.jsx` and places it with `<SignUp />`.
In HTML, `for="name"` ties the label to the field with `id="name"`, so a click on the label puts the cursor in the field.
We want: the same form, and a clean Console.
```

### Let's check our console log

With the HTML names, the page looks right, and the label still works, but the Console fills with errors. With the JavaScript names, the same page has a clean Console. Each column shows the page on top, then its Console, then the code that made it:

::: row caption="The same form with HTML names and with JavaScript names. The pages look the same; compare the Consoles."
::: col title="HTML names" tone=bad
```page size=mini
form: Name
```
```devconsole
x Invalid DOM property `class`. Did you mean `className`?
x Invalid DOM property `for`. Did you mean `htmlFor`?
x Invalid DOM property `tabindex`. Did you mean `tabIndex`?
```
```jsx
<label class="label" for="name">
<input id="name" tabindex="0" />
```
With `class`, `for`, and `tabindex`, three errors fill the Console.
:::
::: col title="JavaScript names" tone=good
```page size=mini
form: Name
```
```devconsole
= No messages
```
```jsx
<label className="label" htmlFor="name">
<input id="name" tabIndex="0" />
```
With `className`, `htmlFor`, and `tabIndex`, the Console is clean.
:::
:::

### Why does React want JavaScript names?

The attributes of a tag become properties of the object its call receives, next to `children`, which section 1 showed holding the tag's content, and React mostly names them as the DOM does: in JavaScript, an element's class is `element.className`, and a label's target is `label.htmlFor`. Other names of several words, SVG ones such as `stroke-width` included, simply use camelCase:

| in HTML | in JSX | why |
| --- | --- | --- |
| `class` | `className` | the DOM's name, since `class` is a reserved word |
| `for` | `htmlFor` | the DOM's name, since `for` is a reserved word |
| `tabindex` | `tabIndex` | a name of several words uses camelCase |
| `aria-label`, `data-form-id` | unchanged | `aria-*` and `data-*` keep their dashes |

### Why does the page still look right?

Given `class` and `for`, React still writes them into the page as attributes, which is why the page looks right and the label still works. Only the Console shows the mistake, and only on the dev server: the site built with `npm run build` logs nothing, so the wrong names ship silently. A Console full of these errors also hides the one error that matters. In the Elements panel, the fixed form still shows `class="label"` and `for="name"`: React writes the HTML names into the DOM itself.
## Putting the rules together

One article card, with a photo, a heading, and a line of text, written so that it follows every rule of this lecture: every tag a call, the component's name with a capital letter, the image closed with a slash, one `<article>` as the root the page needs, and `className` for `class`:

**DO THIS:**

```jsx right
export default function ArticleCard() {
  return (
    <article>
      <img src="/library.jpg" alt="Library" />
      <h2 className="title">Library Hours</h2>
      <p>Open until nine.</p>
    </article>
  );
}
```

The same card as it would come from an old HTML page with no `<article>` around it, with three mistakes marked in red: the image left open, so the build stops (line 3); three tags side by side after `return`, so the build would stop there next (lines 3 to 5); and `class` instead of `className`, so the Console shows an error once the build passes (line 4):

**DO NOT DO THIS:**

```jsx wrong bad="3,4,5"
export default function ArticleCard() {
  return (
    <img src="/library.jpg" alt="Library">
    <h2 class="title">Library Hours</h2>
    <p>Open until nine.</p>
  );
}
```

## For the interview

- **What is JSX?** Not HTML. The build turns each tag into a function call; the call returns a plain object, a React element; and React builds the DOM from those objects. The browser never sees JSX, and every rule follows from that.
- **Is JSX just HTML with a few differences?** That is the classic trap. An open `<img>` stops the build, two tags side by side directly after `return` stop it again, and `class` fills the Console with errors. An HTML file accepts all three; in a component, the first two stop the build, and `class` still works but logs an error.
- **Does a Fragment appear in the Elements panel?** No. Its children sit directly inside the parent, as the two `<li>` items did in the list.
- **Can I keep the HTML comments of my old page?** No: `<!-- ... -->` stops the build. Inside the markup, a comment is written `{/* ... */}`.
- **Old tutorials start each file with `import React from 'react'`. Do I need it?** Not for JSX. The old transform turned each tag into `React.createElement`, which needed `React` in the file. React 19 requires the new transform, which adds its own import, as the Network panel's Response shows.

## Where you will meet this

- A designer's HTML mockup, or a snippet copied from a CSS library: every open `<input>` or `<img>`, every group of tags side by side at the top of a `return`, and every `class` needs the five checks of this lecture.
- A component that returns several table cells for one row: when the cells sit side by side with no box around them, a Fragment, because a `<div>` inside a `<tr>` breaks the table, and React logs an error that a `<div>` cannot be a child of a `<tr>`.
- An icon pasted from a design tool as SVG markup: an attribute of several words with a dash, such as `stroke-width`, becomes `strokeWidth`.

::: pagebreak

## Summary

```tree caption="The whole lecture as one tree."
Two different ways to write markup
- The normal HTML markup | the browser reads it as it is
- The React markup (JSX): it is not simple HTML | the build turns it into JavaScript
  - Each tag becomes a call | a call that returns an object; React builds the DOM
    - A small letter: an HTML tag | a string, such as `"h2"`
    - A capital letter: our component | our function: React calls it
  - Every tag is closed | a closing tag, or a slash: `<img />`
  - One root per return | one element, or a Fragment, around the rest
  - A Fragment when no box is wanted | `<>` and `</>`: no element in the DOM
  - Attributes use JavaScript names | `className`, `htmlFor`, `tabIndex`
```

**One call per tag, a capital letter for our components, every tag closed, one root, a Fragment when the page needs no box, and JavaScript names.**

::: pagebreak

## Example: moving an old site's article card into React

The rules of this lecture meet in one real task: a news site that is moving to React. Its old pages are plain HTML files, and their markup has to move into components. Here is one article card from the old site, first in its HTML file, then pasted as it is into the `return` of a component, `ArticleCard`:

::: row arrows caption="The same five lines of markup: in the old HTML file, the card shows; pasted into a component, an error overlay covers the page. The browsers on top, the code under each. The overlay counts lines in the whole file, where the image is line 4."
::: col title="In `old-site/index.html`" tone=plain
```page size=mini
card: img=/library.jpg | alt=Library | title=Library Hours | text=Open until nine.
```
```html bad="2,3"
<article>
  <img src="/library.jpg" ~alt="Library">~ <!-- No end: the browser closes it by itself -->
  <h2 ~class~="title">Library Hours</h2> <!-- HTML's name: it styles the heading -->
  <p>Open until nine.</p>
</article>
```
The browser reads the file as it is, and the card shows.
:::
::: col title="Pasted into `ArticleCard`'s `return`" tone=bad
```overlay size=mini
message: [PARSE_ERROR] Expected corresponding JSX closing tag for 'img'.
file: src/ArticleCard.jsx:4:8
```
```jsx bad="2,3"
<article>
  <img src="/library.jpg" ~alt="Library">~ {/* **WRONG:** no end: the build waits for </img> */}
  <h2 ~class~="title">Library Hours</h2> {/* **PROBLEMATIC:** HTML's name: a Console error */}
  <p>Open until nine.</p>
</article>
```
The same lines in a component: the `<img>` has no end, so the build stops and an error overlay covers the page.
:::
:::

The browser never reads a component file as we wrote it. The dev server, Vite, first rewrites it into plain JavaScript; this rewrite is the **build**. When the build cannot read a file, nothing in that file runs, and Vite covers the page with a panel that names the problem, the **error overlay**. Look closely at the two lines marked in red. Each works in the HTML file. In the component, the image stops the build, and `class` still styles the heading but logs an error in the Console:

| in the pasted markup | in the HTML file | in the component |
| --- | --- | --- |
| `<img src="/library.jpg" alt="Library">`, with no end | the browser closes it by itself | the build stops: the overlay above (section 2) |
| `class="title"` | styles the heading | an error in the Console, once the build gets past the image (section 5) |
| the whole card | shows on the page | an error overlay instead of the card |

The markup is the same, so what changed is where it lives. In a component, markup is written in **JSX**: it looks like HTML, but it is JavaScript. That was the topic of this lecture: what changes when HTML moves into a component, and which rules every piece of JSX must follow.

## The components behind the page

Each of this lecture's components lives in its own file, named after it: `Greeting.jsx`, `ArticleCard.jsx`, `Author.jsx`, `Items.jsx`, `SignUp.jsx`, and `App.jsx`, which imports the other five. `main.jsx`, the file Vite runs first, shows `App` on the page:

```hierarchy layout=stack caption="The components of this lecture, one file each."
App | holds: the page | here: names each component with a tag
  Greeting | holds: one greeting
  ArticleCard | holds: the article card
  Author | holds: a photo, a name, and a city
  Items | holds: two list items
  SignUp | holds: a form, with a label and a field
notes:
Each component is a function that returns JSX, the markup it draws.
`App` imports the others from their files and places them with their tags, `<Greeting />`, `<ArticleCard />`, `<Author />`, `<Items />`, `<SignUp />`, and React calls each function where its tag stands.
The old site's markup goes into these functions, after `return`. Every problem in this lecture appears when that markup meets JavaScript.
```
