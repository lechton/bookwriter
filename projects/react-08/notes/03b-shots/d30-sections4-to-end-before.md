## 4. A Fragment when no box is wanted

*When? The tags need one root, but the page needs no extra box*

```tree size=mini here="A Fragment when no box is wanted"
Five rules for pasted HTML in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!FACT] In CSS, `display: flex` on a list makes a **flex layout**: the list's children sit side by side in a row. `.articles > li` is a **child selector**: it styles only an `<li>` that sits directly inside `.articles`, not one deeper down.

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

Section 3 gave `Author` one root, a `<section>`, which the page wants anyway. Sometimes the page wants no extra box at all. The home page shows its featured articles in a row, styled by `index.css`, which `main.jsx` imports:

```css title="index.css"
.articles { display: flex; gap: 24px; }
.articles > li { border: 1px solid #999; }
```

```hierarchy
App | holds: the list, `<ul className="articles">` | here: draws the list around the items
  FeaturedArticles | holds: two featured articles | here: returns the two list items
notes:
`App` owns the list, styled as a row, with a border on each item that sits directly inside it.
`FeaturedArticles` returns the two `<li>` items, and `App` places it inside the list: `<ul className="articles"><FeaturedArticles /></ul>`.
Two `<li>` side by side would stop the build, so they need one root.
We want: one root for the two items, and nothing between the list and its items, so the row and the borders still apply.
```

The quickest way to give the two items one root is a `<div>` around them. With the `<div>`, the build passes, and the Console stays clean (React checks some nesting rules, such as a `<div>` inside a table row, but not a `<div>` inside a `<ul>`), yet the row breaks; with a Fragment instead, the row and the borders appear:

::: row caption="The two featured articles, grouped by a div and by a Fragment. Compare the Elements panels and the two rows."
::: col title="Grouped by a `<div>`" tone=bad
```jsx
~<div>~ {/* **PROBLEMATIC:** now the list's only child */}
  <li>Ten easy summer recipes</li>
  <li>New park opens today</li>
</div>
```
```dom title="Elements panel"
<ul class="articles">
!  <div>
    <li>Ten easy summer recipes</li>
    <li>New park opens today</li>
!  </div>
</ul>
```
```page size=mini
stack: Ten easy summer recipes ; New park opens today
```
With the `<div>`, the list's only child is the `<div>`: the items stack, with no border.
:::
::: col title="Grouped by a Fragment, `<>`" tone=good
```jsx
~<>~ {/* No element: the items stay the list's children */}
  <li>Ten easy summer recipes</li>
  <li>New park opens today</li>
</>
```
```dom title="Elements panel"
<ul class="articles">
+  <li>Ten easy summer recipes</li>
+  <li>New park opens today</li>
</ul>
```
```page size=mini
row: Ten easy summer recipes ; New park opens today
```
With the Fragment, the items are the list's own children: a row, each with its border.
:::
:::

A `<div>` is a real element, so React builds it in the DOM, between the list and its items. The flex layout arranges the list's children, and its only child is now the `<div>`; the child selector finds no `<li>` directly inside the list. A **Fragment**, written `<>` and `</>`, is one call too, so it gives one root, but React builds no element for it and puts its children straight into the parent.

```tree dir=right caption="What to group tags with, and what each leaves in the DOM."
What groups the tags into one root?
- +a Fragment, <> and </> | when the page needs no box: nothing added to the DOM
- +an element, such as <article> | when the page needs the box, for its meaning or a style
- !a <div> between a list or a flex row and its items | when a style targets direct children, it misses the items
```

## 5. Attributes use JavaScript names: className, htmlFor

*Why? `class` and `for` are reserved words in JavaScript*

```tree size=mini here="Attributes use JavaScript names"
Five rules for pasted HTML in a component
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

The build now accepts every pasted tag: each is closed, and each component has one root. One habit gets past the build: HTML's attribute names. The old newsletter form is pasted into `SignUp` with its HTML attributes:

```hierarchy
App | holds: the page
  SignUp | holds: the newsletter form | here: returns the form
notes:
`SignUp` returns the form from the old site, with a label and an email field.
In HTML, `for="email"` ties the label to the field, so a click on the label puts the cursor in the field.
We want: the same form, and a clean Console.
```

```jsx title="SignUp.jsx" bad="4-5"
export default function SignUp() {
  return (
    <form>
      <label ~class~="label" for="email">Your email</label> {/* **PROBLEMATIC:** HTML names: class and for */}
      <input id="email" type="email" ~tabindex~="0" /> {/* **PROBLEMATIC:** React wants tabIndex */}
    </form>
  );
}
```

With the HTML names, the page looks right, and the label still works, but the Console fills with errors. With the JavaScript names, the same page has a clean Console:

::: row caption="The same form with HTML names and with JavaScript names. The pages look the same; compare the Consoles."
::: col title="HTML names" tone=bad
```jsx
<label class="label" for="email">
<input id="email" tabindex="0" />
```
```page size=mini
form: Your email
error: Invalid DOM property `class`. Did you mean `className`?
error: Invalid DOM property `for`. Did you mean `htmlFor`?
error: Invalid DOM property `tabindex`. Did you mean `tabIndex`?
```
With `class`, `for`, and `tabindex`, three errors fill the Console.
:::
::: col title="JavaScript names" tone=good
```jsx
<label className="label" htmlFor="email">
<input id="email" tabIndex="0" />
```
```page size=mini
form: Your email
quiet: Console: no messages
```
With `className`, `htmlFor`, and `tabIndex`, the Console is clean.
:::
:::

The attributes of a tag become properties of the object its call receives, next to `children`, which section 1 showed holding the tag's content, and React mostly names them as the DOM does: in JavaScript, an element's class is `element.className`, and a label's target is `label.htmlFor`. Other names of several words, SVG ones such as `stroke-width` included, simply use camelCase:

| in HTML | in JSX | why |
| --- | --- | --- |
| `class` | `className` | the DOM's name, since `class` is a reserved word |
| `for` | `htmlFor` | the DOM's name, since `for` is a reserved word |
| `tabindex` | `tabIndex` | a name of several words uses camelCase |
| `aria-label`, `data-form-id` | unchanged | `aria-*` and `data-*` keep their dashes |

Given `class` and `for`, React still writes them into the page as attributes, which is why the page looks right and the label still works. Only the Console shows the mistake, and only on the dev server: the site built with `npm run build` logs nothing, so the wrong names ship silently. A Console full of these errors also hides the one error that matters. In the Elements panel, the fixed form still shows `class="label"` and `for="email"`: React writes the HTML names into the DOM itself.

## Putting the five together

The old card, moved into a component the way the five sections showed: every tag a call, the image closed with a slash, one `<article>` as the root that the page needs, and `className` for `class`:

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

The same card as it would come from an old page with no `<article>` around it, with three mistakes marked in red: the image left open, so the build stops (line 3); three tags side by side after `return`, so the build would stop there next (lines 3 to 5); and `class` instead of `className`, so the Console shows an error once the build passes (line 4):

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

**One call per tag, every tag closed, one root, a Fragment when the page needs no box, and JavaScript names.**

::: pagebreak

## Example: moving an old site's article card into React

The example for this whole lecture is a news site that is moving to React. Its old pages are plain HTML files, and their markup has to move into components. Here is one article card from the old site, first in its HTML file, then pasted as it is into the `return` of a component, `ArticleCard`:

::: row arrows caption="The same five lines of markup: in the old HTML file, the card shows; pasted into a component, an error overlay covers the page. The overlay counts lines in the whole file, where the image is line 4."
::: col title="In `old-site/index.html`" tone=plain
```html bad="2,3"
<article>
  <img src="/library.jpg" ~alt="Library">~ <!-- No end: the browser closes it by itself -->
  <h2 ~class~="title">Library Hours</h2> <!-- HTML's name: it styles the heading -->
  <p>Open until nine.</p>
</article>
```
```page size=mini
card: img=/library.jpg | alt=Library | title=Library Hours | text=Open until nine.
```
The browser reads the file as it is, and the card shows.
:::
::: col title="Pasted into `ArticleCard`'s `return`" tone=bad
```jsx bad="2,3"
<article>
  <img src="/library.jpg" ~alt="Library">~ {/* **WRONG:** no end: the build waits for </img> */}
  <h2 ~class~="title">Library Hours</h2> {/* **PROBLEMATIC:** HTML's name: a Console error */}
  <p>Open until nine.</p>
</article>
```
```overlay size=mini
message: [PARSE_ERROR] Expected corresponding JSX closing tag for 'img'.
file: src/ArticleCard.jsx:4:8
```
The same lines in a component: the `<img>` has no end, so the build stops and an error overlay covers the page.
:::
:::

The browser never reads a component file as we wrote it. The dev server, Vite, first rewrites it into plain JavaScript; this rewrite is the **build**. When the build cannot read a file, nothing in that file runs, and Vite covers the page with a dark panel that names the problem, the **error overlay**. Look closely at the two lines marked in red. Each works in the HTML file. In the component, the image stops the build, and `class` still styles the heading but logs an error in the Console:

| in the pasted markup | in the HTML file | in the component |
| --- | --- | --- |
| `<img src="/library.jpg" alt="Library">`, with no end | the browser closes it by itself | the build stops: the overlay above (section 2) |
| `class="title"` | styles the heading | an error in the Console, once the build gets past the image (section 5) |
| the whole card | shows on the page | an error overlay instead of the card |

The markup is the same, so what changed is where it lives. In a component, markup is written in **JSX**: it looks like HTML, but it is JavaScript. That is the topic of this lecture: what changes when HTML moves into a component, and which rules every piece of JSX must follow?

## The components behind the page

Each of this lecture's components lives in its own file, named after it: `Greeting.jsx`, `ArticleCard.jsx`, `FeaturedArticles.jsx`, `SignUp.jsx`, and `App.jsx`, which imports the other four. `main.jsx`, the file Vite runs first, shows `App` on the page:

```hierarchy layout=stack caption="The components of this lecture, one file each."
App | holds: the page | here: names each component with a tag
  Greeting | holds: one greeting
  ArticleCard | holds: the card pasted from the old site
  FeaturedArticles | holds: two featured articles, as list items
  SignUp | holds: the newsletter form
notes:
Each component is a function that returns JSX, the markup it draws.
`App` imports the others from their files and places them with their tags, `<Greeting />`, `<ArticleCard />`, `<FeaturedArticles />`, `<SignUp />`, and React calls each function where its tag stands.
The old site's markup goes into these functions, after `return`. Every problem in this lecture appears when that markup meets JavaScript.
```
