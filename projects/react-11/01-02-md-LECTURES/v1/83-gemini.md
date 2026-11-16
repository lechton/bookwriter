# Lecture 83: React's Built-in Components vs. Raw HTML

*(If a tag in JSX looks like HTML, why does React ask for className, a style object, and one string inside a title?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do React's built-in HTML components differ from raw HTML?

---

## VS | Raw HTML vs. a Built-in Component in JSX: the tag looks the same, but React reads it, not the browser

> In an HTML file, the browser parses markup tags directly into DOM nodes. **In React, the browser never parses JSX tags directly. React processes JSX into virtual elements and creates real DOM nodes using DOM APIs.** This explains why JSX attribute names match JavaScript DOM property names like `className`. It also explains why React can hoist a `<title>` directly into the document head.

Remember `document.createElement`? In plain JavaScript, your script creates a DOM element directly and configures its properties in code:

```js title="Plain JavaScript: you create the input and set its class"
const input = ~document.createElement('input')~; // Your code creates the DOM node
~input.className~ = 'search'; // The DOM calls the class className, not class
```

In React, application code never invokes `document.createElement` directly. You declare a JSX tag, and React handles DOM node construction internally:

```jsx title="React: you write the tag, and React creates the input"
<input ~className~="search" /> {/* React creates the input and sets its className */}
```

Observe the attribute name on the JSX tag. It is not the HTML attribute `class`. It is `className`, matching the exact property assigned on the DOM node in JavaScript. Both techniques produce `<input class="search">` in the DOM tree.

This highlights the central lesson: **a JSX tag is not raw HTML. It is a declarative description that React converts into real DOM nodes, so it speaks the native language of the DOM.**

> [!DEFINITION]
> **What is a built-in browser component?** [NEW] React treats standard HTML and SVG elements such as `<div>`, `<input>`, `<li>`, or `<title>` as built-in browser components.
> A built-in component always begins with a lowercase letter, distinguishing it from custom components like `<Inbox>` that begin with an uppercase letter.
> React supports every standard HTML and SVG tag and constructs the corresponding real DOM nodes automatically (Lesson 83).

### What React Adds to Plain HTML

React organizes built-in browser components into three categories based on the capabilities it layers on top of standard HTML:

```tree caption="React's docs sort the built-in browser components into three groups, by what React adds to plain HTML."
React's built-in browser components
- +Common components [`<div>` `<li>` `<label>` `<h1>`] | Every tag of the browser | Names follow the **DOM**: `className`, `htmlFor`, a `style` object
- +Form components [`<input>` `<select>` `<textarea>`] | Everything the common components do | Passing `value` makes them **controlled**
- +Resource and metadata components [`<title>` `<meta>` `<link>` `<script>` `<style>`] | Everything the common components do | React can place them in the **document head**
```

This lesson examines common components and metadata components. Form controls and controlled inputs appear in Lesson 20.

### Three Ways to Put a Count in the Browser Tab

An email application often displays its unread message count in the browser tab, such as `Inbox (2)`. That count lives inside component state deep in the React tree. However, the browser tab reads its label from a `<title>` tag inside the document `<head>`, located outside the root DOM container where React mounts.

Developers choose between three architectural approaches to update the tab title:
1. **Render a `<title>` element directly in the component.** React 19 hoists this tag to the document head automatically.
2. **Assign `document.title` inside a `useEffect` hook.** This manual imperative approach was standard before React 19 (Lesson 32).
3. **Manage document head tags with an external metadata library.** Libraries such as `react-helmet` remain useful for routing suites that orchestrate full page metadata sets (Lesson 121).

### The Rule of Thumb: type the DOM's name, and let React place the head tags

**When writing JSX tags, supply the property names used by the JavaScript DOM API, such as `className` instead of `class`. Pass a JavaScript object to `style` rather than a CSS string. Render `<title>` directly from the component that owns the data, and ensure it contains exactly one string child.**

Treating JSX as literal HTML leads directly to severe runtime issues:
1. Pasting a raw CSS string into `style` throws an unhandled runtime error that unmounts the component tree, leaving the user with a blank screen.
2. Supplying a title with mixed text and expressions side by side prevents the tab from updating because React expects a single string.
3. Rendering multiple `<title>` tags from competing components causes browser and search engine conflicts due to non-deterministic metadata.

Developers often assume JSX is merely HTML with minor spelling adjustments. They copy snippets directly from design mockups and expect standard browser HTML behaviors. Furthermore, they do not expect React to relocate elements into `<head>` away from where they were declared.

---

## SECTION | An Inbox with a Search Field and Three Emails

Our demonstration project is a focused email inbox. The interface includes an inbox heading, an accessible search field, and a list of three email rows. Two emails arrive unread, displaying bold text, while the browser tab displays `Inbox (2)`.

```page caption="The inbox when it opens. On the real page the first two emails are bold, and the browser tab shows the unread count, 2."
heading: Inbox
form:
  field: Search mail
line: Get your next month for $0.99
line: Your order has shipped
line: Welcome to the team
```

When the user clicks the first unread email, two synchronized UI updates occur:
1. The clicked email row changes to normal font weight.
2. The browser tab updates to display `Inbox (1)`.

The project is structured within a standard Vite workspace:

```files title="inbox: File Explorer" caption="How the inbox files sit in the project. The stylesheet arrives in Principle 5."
index.html | entry | The HTML page with the empty root div where React renders
public/
  email-row.css | stylesheet | A border under every email row, added in Principle 5
src/
  main.jsx | boundary | Imports `Inbox` and renders it into `#root`
  Inbox.jsx | parent | Holds the emails in state, renders the title, the search field, and one `EmailRow` per email
  EmailRow.jsx | child | Returns one `<li>`, bold while the email is unread
```

The email dataset begins as an array of three objects. Each object provides a unique numeric identifier, a subject line, and an `unread` boolean flag:

```jsx title="src/Inbox.jsx" startLine="4"
const initialEmails = [
  { id: 0, subject: 'Get your next month for $0.99', ~unread: true~ }, // Unread, so bold
  { id: 1, subject: 'Your order has shipped', unread: true },
  { id: 2, subject: 'Welcome to the team', unread: false },
];
```

The `Inbox` component stores this array in local state and calculates the unread count during render evaluation (Lesson 22). It renders an `EmailRow` for each message and supplies an `onOpen` callback. The row triggers `onOpen` when clicked to update state (Lesson 23).

**PRINCIPLES:** Every JSX tag inside this inbox represents a declarative instruction that React transforms into a DOM element. Five architectural principles govern this process:
1. **Principle 1: className and htmlFor Are the DOM's Names.** Built-in tags require DOM property identifiers instead of HTML attribute names. Only `aria-*` and `data-*` preserve hyphenated formatting.
2. **Principle 2: style Takes an Object.** The `style` prop accepts an object mapping camelCase CSS properties to values. Pasting raw CSS strings causes fatal render exceptions.
3. **Principle 3: React Places a title in the Head.** React 19 automatically hoists `<title>` elements from anywhere in the component hierarchy directly into `<head>`. Never render multiple active title elements.
4. **Principle 4: A title Takes One String.** Adjacent text nodes and dynamic expressions produce child arrays that fail title reconciliation. Wrap interpolated title text in a single template literal.
5. **Principle 5: precedence Gives One Stylesheet Link for Every Row.** Providing `precedence` on a stylesheet link enables automatic deduplication in the document head and suspends rendering until CSS assets finish loading.

---

## PRINCIPLE | `className` and `htmlFor`: a JSX tag takes the names the DOM uses in JavaScript

> [!PRINCIPLE]
> **Principle 1: DOM Names: `className` and `htmlFor` Replace HTML `class` and `for`**
>
> *On a built-in tag, specify the DOM property name, such as `className`, `htmlFor`, and `tabIndex`; only `aria-*` and `data-*` keep their hyphens.*
>
> JSX compiles into JavaScript object properties, where `class` and `for` are reserved language keywords. Therefore, React adopts the standard property names established by the JavaScript DOM API. React sets the corresponding HTML attributes on the real DOM element, ensuring the browser inspector displays standard `class` and `for` attributes. Pasting raw HTML attribute names triggers descriptive console warnings.
>
> **DO THIS:**
> ```jsx
> <label ~htmlFor~="search">Search mail</label> {/* The DOM's name: a click on the label puts the cursor in the field */}
> <input id="search" className="search" />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <label ~for~="search">Search mail</label> {/* **WRONG:** the HTML name, so the Console asks for htmlFor */}
> <input id="search" class="search" />
> ```

The inbox search bar consists of an associated `<label>` and `<input>`. Compare the raw HTML declaration directly with the JSX equivalent:

```jsx title="The search field in HTML, and the same field in JSX"
<label ~for~="search">Search mail</label> <input id="search" ~class~="search"> {/* HTML: for and class */}
<label ~htmlFor~="search">Search mail</label> <input id="search" ~className~="search" /> {/* JSX: htmlFor and className */}
```

Both declarations generate identical runtime structures. Each produces an `<input>` styled by the `search` class alongside a bound label. In both implementations, clicking the label text focuses the input element. The browser inspector reveals identical DOM markup for both versions:

```dom caption="The Elements panel shows the same nodes for the HTML version and for the JSX version of the search field."
<label for="search">Search mail</label>
<input id="search" class="search">
```

The underlying DOM output is identical. Only the authoring syntax changes between raw HTML markup and JSX.

### Why React Renamed `class` and `for`

React did not invent arbitrary attribute replacements. It maps attributes directly to the established JavaScript properties of browser DOM nodes:

```js title="Plain JavaScript: the DOM's own names for class and for"
const input = document.getElementById('search');
~input.className~ = 'search'; // The DOM calls the class className

const label = document.querySelector('label');
~label.htmlFor~ = 'search'; // The DOM calls the for link htmlFor
```

> [!DEFINITION]
> **What is a DOM property?** [NEW] A DOM property is a JavaScript object property on a browser DOM node used to read or mutate node state, such as `input.className` or `label.htmlFor`.
> While many properties match their HTML attributes directly, such as `id`, others differ: HTML `class` reflects as the JavaScript DOM property `className`.
> When writing JSX, you provide values to React that map onto these native DOM properties (Lesson 83).

The guideline is straightforward. **When writing JSX, use the property name you would assign on a native DOM node in JavaScript.** React adopted this standard for two concrete reasons.

First, JSX transpiles directly into JavaScript function calls (Lesson 02). Every JSX attribute becomes an object property in a props map:

```js title="What the JSX compiler makes of the input tag"
<input id="search" ~className~="search" /> // Becomes _jsx('input', { id: 'search', className: 'search' })
```

Components frequently destructure props into local variables. In JavaScript, variable identifiers cannot contain hyphens and cannot use language keywords. Attempting to destructure a prop named `class` throws a syntax error that crashes compilation:

```jsx title="Why class cannot be a variable name"
function SearchField({ ~class~ }) { // **WRONG:** class is a reserved word, so JavaScript reports a syntax error and the file never runs
  return <input className={class} />;
}
```

Second, consistency across the API surface. Because language constraints prevent using keywords like `class` and `for`, React aligns fully with the browser DOM property convention. That is why `for` becomes `htmlFor`. Multi-word properties also use camelCase formatting, such as `tabIndex`.

### Which Names Change, and Which Stay as in HTML

Most common attributes retain their standard HTML spelling, including `id` and `href`, because their native DOM properties share the same exact name. Three naming categories change: reserved words `class` and `for`, plus multi-word attributes that convert to camelCase. Two attribute families retain their hyphenated format: accessibility attributes prefixed with `aria-` and custom data attributes prefixed with `data-`:

```jsx title="Which names change in JSX, and which stay as in HTML"
<input ~className~="search" /> {/* class becomes className */}
<label ~htmlFor~="search">Search mail</label> {/* for becomes htmlFor */}
<li ~tabIndex~={0}>Welcome to the team</li> {/* tabindex becomes tabIndex, in camelCase */}
<li ~data-id~="2">Welcome to the team</li> {/* data-* keeps its dashes */}
<input ~aria-label~="Search mail" /> {/* aria-* keeps its dashes */}
```

You can also attach custom attributes to built-in DOM elements. React forwards custom attributes directly to the DOM if the name is lowercase and does not begin with the `on` event prefix. React converts the supplied value into a string.

```tree caption="On a built-in tag, most names follow the DOM's camelCase names, and two families keep their HTML dashes."
Attribute names on a built-in tag in JSX
- +The DOM's name [`className` `htmlFor` `tabIndex`] | Replaces HTML's `class`, `for`, and `tabindex` | React writes the **HTML attribute** on the node
- +Dashes kept [`aria-label` `data-id`] | `aria-*` and `data-*` keep the HTML spelling | For **historical reasons**, as React's docs say
- +Unchanged [`id` `href` `placeholder`] | One plain word, the same in HTML and in the DOM | Typed **exactly as in HTML**
```

### Pasting the HTML of the Search Field into `Inbox`

A common mistake occurs when pasting existing HTML snippets into a component. Consider pasting raw markup into `Inbox` without adjusting attribute names:

```jsx title="src/Inbox.jsx" startLine="1"
export default function Inbox() {
  return (
    <main>
      <h1>Inbox</h1>
      <label ~for~="search">Search mail</label> {/* **WRONG:** for is the HTML name */}
      <input id="search" ~class~="search" /> {/* **WRONG:** class is the HTML name */}
    </main>
  );
}
```

The browser still renders the input element. However, the browser development console logs warnings for each incorrect attribute, identifying the proper DOM property replacement:

```page width=full caption="The pasted HTML names: the field appears, and the Console shows one message for each HTML name."
heading: Inbox
form:
  field: Search mail
console: Invalid DOM property `for`. Did you mean `htmlFor`?
  error: Invalid DOM property `class`. Did you mean `className`?
```

The resolution is replacing HTML attributes with proper DOM property names. Automated migration tools and converters can transform extensive HTML blocks into valid JSX:

```jsx title="src/Inbox.jsx" startLine="1"
export default function Inbox() {
  return (
    <main>
      <h1>Inbox</h1>
      <label ~htmlFor~="search">Search mail</label> {/* A click on these words puts the cursor in the field */}
      <input id="search" ~className~="search" /> {/* The Elements panel shows class="search" */}
    </main>
  );
}
```

```page width=full caption="The search field with the DOM's names: the same page, and a quiet Console."
heading: Inbox
form:
  field: Search mail
console: quiet
```

Notice that while application code specifies `className`, the browser inspector displays `class="search"`. React reconciles this mapping in three sequential phases:
1. The JSX compiler converts the element into a virtual element object whose props map contains `className: "search"`.
2. React creates the physical `<input>` DOM node via browser DOM creation APIs.
3. React applies the CSS class to the DOM node, prompting the browser to render `class="search"` in the inspector.

---

## PRINCIPLE | `style={{ fontWeight: 'bold' }}`: style takes an object, like the DOM's `style` property

> [!PRINCIPLE]
> **Principle 2: Style Object: `style` Takes an Object with camelCase Names**
>
> *Pass `style` a JavaScript object with camelCase CSS property names, such as `{ fontWeight: 'bold' }`, and reserve inline styles for data-driven rules.*
>
> React's `style` prop models the native DOM `element.style` object instead of an HTML text string. Numeric values receive automatic `px` unit suffixes unless applied to unitless CSS properties like `opacity` or `zIndex`. Passing a raw CSS string throws a fatal runtime exception that unmounts the component tree. Static, unchanging styles should always be declared in external stylesheets with `className`.
>
> **DO THIS:**
> ```jsx
> <li ~style={{ fontWeight: email.unread ? 'bold' : 'normal' }}~> {/* Bold while the email is unread */}
>   {email.subject}
> </li>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <li ~style="font-weight: bold"~> {/* **WRONG:** a string of CSS, so React stops and the inbox disappears */}
>   {email.subject}
> </li>
> ```

An unread email must display with bold typography. Contrast the inline style syntax of raw HTML with JSX:

```jsx title="A bold row in HTML, and the same row in JSX"
<li ~style="font-weight: bold"~>Your order has shipped</li> {/* HTML: a string of CSS */}
<li ~style={{ fontWeight: 'bold' }}~>Your order has shipped</li> {/* JSX: an object with a camelCase name */}
```

Both declarations target the same visual CSS rule, but they rely on fundamentally different mechanisms. In standard HTML, `style` contains a serialized CSS text string. In JSX, `style` requires a JavaScript key-value object.

This requirement mirrors the native browser DOM interface. In JavaScript, an element's `style` property is an object instance, and CSS property names map to camelCase keys:

```js title="Plain JavaScript: the DOM's style property is an object"
const row = document.querySelector('li');
~row.style.fontWeight~ = 'bold'; // The DOM writes font-weight as fontWeight
```

Consequently, the `style` prop in JSX adheres to two primary conventions:
1. **Property keys use camelCase.** The hyphenated CSS rule `font-weight` becomes `fontWeight`. Similarly, background color becomes `backgroundColor`.
2. **Values accept numbers or strings.** When passing numbers to dimensional properties, React automatically appends pixel units, so `margin: 20` resolves to 20 pixels.

> [!DEFINITION]
> **What is a unitless property?** [NEW] A unitless property is a CSS property where pixel measurements are invalid, such as `opacity`, `lineHeight`, or `zIndex`.
> React detects these specific property names and preserves the raw numeric value without appending a `px` suffix, ensuring `opacity: 0.5` remains `0.5`.
> Dimensional styles like `width` or `padding` still receive automatic pixel units when specified as numbers (Lesson 83).

The double curly brace syntax represents standard JSX syntax (Lesson 03). The outer pair creates a JavaScript evaluation container. The inner pair instantiates an object literal.

### Pasting the Bold Row from an HTML Mockup

Next, the inbox integrates its message list. The `Inbox` component stores the email collection in state. When the user selects a message, `handleOpen` maps over the array and marks that specific email as read (Lesson 19):

```jsx title="src/Inbox.jsx" startLine="1"
import { useState } from 'react';
import EmailRow from './EmailRow.jsx';

const initialEmails = [
  { id: 0, subject: 'Get your next month for $0.99', unread: true },
  { id: 1, subject: 'Your order has shipped', unread: true },
  { id: 2, subject: 'Welcome to the team', unread: false },
];

export default function Inbox() {
  const [emails, setEmails] = useState(initialEmails);

  function handleOpen(id) {
    ~setEmails~(emails.map(e => (e.id === id ? { ...e, unread: false } : e))); // Only the clicked email becomes read
  }

  return (
    <main>
      <h1>Inbox</h1>
      <label htmlFor="search">Search mail</label>
      <input id="search" className="search" />
      <ul>
        {emails.map(email => (
          <EmailRow key={email.id} email={email} onOpen={handleOpen} />
        ))}
      </ul>
    </main>
  );
}
```

Each email item renders through an individual component in `EmailRow.jsx`. It accepts the email record and the `onOpen` handler, returning an `<li>` element. Suppose a developer copies raw HTML markup from an existing template:

```jsx title="src/EmailRow.jsx" startLine="1"
export default function EmailRow({ email, onOpen }) {
  return (
    <li ~style="font-weight: bold"~ onClick={() => onOpen(email.id)}> {/* **WRONG:** a string of CSS, pasted from HTML */}
      {email.subject}
    </li>
  );
}
```

The editor may not catch the invalid prop type immediately. When the application loads in the browser, the entire screen goes blank and the console logs an unhandled error:

```page width=full caption="A style string pasted from HTML: the whole inbox disappears, and the Console shows an error."
blank
console: Uncaught Error: The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.
  warn: An error occurred in the <li> component. Consider adding an error boundary to your tree to customize error handling behavior.
```

A syntax error in a single list row unmounts the search field, the heading, and the entire application. The underlying failure sequence unfolds as follows:
1. React begins rendering the first email row and encounters `"font-weight: bold"` assigned to the `style` prop.
2. The renderer throws an uncaught exception stating that `style` expects an object mapping properties to values.
3. Because no Error Boundary wraps this component branch, React unmounts the entire component tree to avoid inconsistent state (Lesson 72).

A common second mistake occurs when converting the string to an object while retaining hyphenated CSS identifiers:

```jsx title="An object with the CSS name as its key"
<li ~style={{ font-weight: 'bold' }}~> {/* **WRONG:** a dash in a key without quotes, so JavaScript reports a syntax error */}
```

In JavaScript, hyphens represent subtraction operators and cannot appear inside unquoted object keys. Furthermore, React expects DOM property names, making `fontWeight` the required property key.

### Making the Unread Rows Bold

The official React documentation recommends reserving `style` props for dynamic values derived from runtime application state. Static visual rules belong in external stylesheets applied through `className`.

Our typography rule is state-driven: rows display bold text exclusively when `email.unread` evaluates to `true`. An inline style object using a ternary expression models this requirement cleanly:

```jsx title="src/EmailRow.jsx" startLine="1"
export default function EmailRow({ email, onOpen }) {
  return (
    <li
      ~style~={{ fontWeight: email.unread ? 'bold' : 'normal' }} // Bold while unread, normal once read
      onClick={() => onOpen(email.id)} // Asks Inbox to mark this email as read
    >
      {email.subject}
    </li>
  );
}
```

On initial render, the two unread emails appear with bold styling. When the user clicks **Get your next month for $0.99**, only **Your order has shipped** remains bold. Inspecting the DOM reveals that React serializes the style object into a native HTML `style` attribute string:

::: row caption="The Elements panel before and after the user clicks the first email."
::: col title="Before the click" tone=good
```dom
<ul>
+ <li style="font-weight: bold;">Get your next month for $0.99</li>
+ <li style="font-weight: bold;">Your order has shipped</li>
  <li style="font-weight: normal;">Welcome to the team</li>
</ul>
```
:::
::: col title="After the click on the first email" tone=good
```dom
<ul>
  <li style="font-weight: normal;">Get your next month for $0.99</li>
+ <li style="font-weight: bold;">Your order has shipped</li>
  <li style="font-weight: normal;">Welcome to the team</li>
</ul>
```
:::
:::

The browser DOM ultimately receives standard inline CSS strings. React derives and serializes those style declarations automatically from the JavaScript objects in JSX.

```tree caption="A string of CSS and a style object ask for the same rule, but only the object works in JSX."
Two ways to write a bold row
- !A string of CSS [`style="font-weight: bold"`] | HTML's way, pasted into JSX | React stops with an error and **the whole inbox disappears**
- +An object with camelCase names [`style={{ fontWeight: 'bold' }}`] | Works like the DOM `style` property | The row is **bold**, and the Elements panel shows the CSS string
```

---

## PRINCIPLE | `<title>` inside a component: React places it in the document head

> [!PRINCIPLE]
> **Principle 3: Hoisting: React Places a `<title>` from Any Component in the Head**
>
> *Render `<title>`, `<meta>`, and `<link>` elements from the component that owns the data; React hoists them directly into the document `<head>`, and only one `<title>` may be active at a time.*
>
> In React 19, metadata and resource components land directly in `<head>`, regardless of where they reside within the component hierarchy. This architectural feature allows `Inbox`, which owns the unread count in state, to control the browser tab title directly. React leaves a `<title>` in place only when rendered inside an `<svg>` element or when attributed with `itemProp`. Rendering multiple competing title tags creates conflicting metadata in browsers and search engines.
>
> **DO THIS:**
> ```jsx
> function Inbox() {
>   return <main>~<title>Inbox</title>~<h1>Inbox</h1></main>; // React places the title in the head
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Settings() {
>   return <section>~<title>Settings</title>~</section>; // **WRONG:** another component also rendering a title at the same time
> }
> ```

Standard JSX tags render physical DOM nodes directly at the position where they are declared in the component tree. In React 19, five specific metadata and resource tags behave differently: title, meta, link, script, and style. When a component returns one of these elements, React hoists its DOM node into the document `<head>`, decoupled from the component's placement in the body container.

Consider an inbox component returning both `<title>` and `<h1>` inside a shared container:

```jsx title="A title and a heading inside the same div"
export default function Inbox() {
  return (
    <div>
      ~<title>Inbox</title>~ {/* React places this one in the document head */}
      ~<h1>Inbox</h1>~ {/* React places this one where it is written */}
    </div>
  );
}
```

Although authored side by side in JSX, the resulting DOM nodes reside in separate document subtrees:

```dom caption="The Elements panel: React places the h1 inside the root div, and the title inside the head."
<head>
  <meta charset="UTF-8">
+ <title>Inbox</title> | note: Placed in the head by React
</head>
<body>
  <div id="root">
    <div>
+     <h1>Inbox</h1> | note: Placed where Inbox wrote it
    </div>
  </div>
</body>
```

This DOM relocation occurs in four clear steps:
1. React executes the component, which returns `<title>` and `<h1>` within a common JSX container.
2. React mounts the `<h1>` node at its expected position inside the `#root` application container.
3. React identifies `<title>` as a metadata tag and relocates its DOM node into the document `<head>`.
4. The browser reads the hoisted `<title>` element from the document head and updates the browser tab to display Inbox.

This behavior aligns with web standards. The HTML specification mandates that `<title>` elements reside exclusively in `<head>`. React automatically manages this DOM placement on your behalf.

> [!DEFINITION]
> **What does it mean that React hoists a tag?** [NEW] Hoisting describes the automated relocation of DOM nodes from component render trees into `<head>`.
> When React 19 encounters metadata tags such as `<title>`, `<meta>`, or `<link>` during rendering, it lifts those nodes out of the local DOM container and appends them to the document `<head>`.
> This mechanism ensures compliance with HTML document specifications while allowing nested components to manage their own metadata (Lesson 83).

### Which Tags React Moves to the Head

The `<title>` tag belongs to the category of **resource and metadata components**. This category encompasses five elements: title, meta, link, script, and style. These tags describe global document state rather than localized interface widgets. React allows rendering metadata elements from any component in the tree, automatically placing the resulting DOM nodes in `<head>`.

This architecture ensures colocation: the component that holds the state owns the metadata that reflects that state. Because only `Inbox` tracks the unread email count, `Inbox` directly declares the document title.

Metadata `<meta>` elements follow the same hoisting behavior into `<head>`. A hoisted meta tag must provide an identifying prop, such as `name` or `charset`. The other supported props are `httpEquiv` and `itemProp`. Comprehensive route metadata patterns appear in Lesson 121.

React avoids hoisting metadata tags in two specific scenarios:
1. **A `<title>` rendered inside an `<svg>` element.** Here it acts as an accessible graphic label read by assistive technologies.
2. **A tag configured with an `itemProp` prop.** Here it defines structured microdata scoped to an individual page element rather than the global document.

### Keep One Title at a Time

React documentation emphasizes an important operational rule: render only one `<title>` element at any given time. If two active components on the same screen render competing `<title>` tags, React inserts both into `<head>`. This causes unpredictable browser tab titles and indexing issues in search engines.

This requirement also applies to static boilerplate in the root HTML template. Standard Vite templates include a default `<title>` inside `index.html`. Once a component renders its own `<title>`, remove the static tag from the HTML template so that the document head maintains a single authoritative title source.

### Adding the Title to the Inbox

The `Inbox` component calculates the unread count on each render pass by filtering state. Initially, it renders a static title above the heading:

```jsx title="src/Inbox.jsx" startLine="10"
export default function Inbox() {
  const [emails, setEmails] = useState(initialEmails);
  const ~unreadCount~ = emails.filter(e => e.unread).length; // 2 when the page opens

  function handleOpen(id) {
    setEmails(emails.map(e => (e.id === id ? { ...e, unread: false } : e)));
  }

  return (
    <main>
      ~<title>Inbox</title>~ {/* React places it in the head, and the tab reads Inbox */}
      <h1>Inbox</h1>
```

The visible layout remains identical while the browser tab now displays `Inbox`. Principle 4 enhances this title by binding the unread count dynamically.

```tree dir=right caption="How a title written inside Inbox reaches the browser tab."
How `<title>Inbox</title>` reaches the browser tab
- +1. Our code [`<title>` inside `<main>`] | `Inbox` returns the title **next to the heading**
- +2. React [`<head>`] | React sees a resource and metadata component | Places its DOM node **in the document head**
- +3. The browser [the tab] | The browser reads the title in the head | The tab reads **Inbox**
```

---

## PRINCIPLE | `<title>` children: one string, built with a template literal, or the tab loses its count

> [!PRINCIPLE]
> **Principle 4: Single String Child: A `<title>` Requires Exactly One String Child**
>
> *Provide `<title>` with a single string child, constructed via a JavaScript template literal.*
>
> Placing text and dynamic expressions side by side creates separate child elements, turning `Inbox ({unreadCount})` into an array of three distinct items. Standard elements like `<h1>` render arrays of child nodes without issue, but React's `<title>` metadata reconciler requires exactly one string value. Constructing the string beforehand using a template literal satisfies this requirement and ensures the tab updates correctly.
>
> **DO THIS:**
> ```jsx
> <title>~{`Inbox (${unreadCount})`}~</title> // One string: the tab reads Inbox (2)
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <title>~Inbox ({unreadCount})~</title> // **WRONG:** three children, so the tab does not show the count
> ```

The browser tab must reflect the current count, displaying `Inbox (2)`. Developers instinctively interleave static text and dynamic variables using curly braces, identical to how they write standard JSX tags:

```jsx title="The same text and count in an h1 and in a title"
<h1>~Inbox ({unreadCount})~</h1> {/* Shows Inbox (2) on the page */}
<title>~Inbox ({unreadCount})~</title> {/* **WRONG:** the title does not get one string */}
```

Both declarations share the same textual structure and interpolation tokens, yet only the heading functions properly. The `<h1>` displays `Inbox (2)` on the page as expected. The `<title>` fails to update the tab title correctly, triggering an error described in React's official documentation.

This discrepancy stems from how React reconciles metadata elements. Standard container elements like `<h1>` accept collections of diverse children, including text nodes, numbers, and nested elements. Conversely, React's `<title>` reconciler explicitly requires a single string child.

### Why the Text Between the Tags Is Not One String

While `Inbox ({unreadCount})` appears as a unified string to a human reader, the JSX parser interprets it as three separate child expressions:
1. The static string `'Inbox ('` preceding the expression.
2. The evaluated numeric value of `unreadCount`, which is `2`.
3. The static string `')'` following the expression.

Each segment represents an independent child node passed into `props.children` as an array (Lesson 09). Consequently, `<title>` receives a three-element array containing two strings and an intermediate number.

When rendering `<h1>`, React creates separate DOM text nodes for each array element and appends them sequentially to the container. But React's `<title>` reconciler updates the browser tab directly and enforces a strict contract: `props.children` must evaluate to a single string primitive, not an array of child nodes.

```tree caption="Text and a value in curly braces side by side give three children, and a title accepts only one."
What `<title>` receives as its children
- !Text and curly braces side by side | The text before, the count, and the text after become **three children** in an array | The tab does **not** get the count
- +One template literal inside curly braces | The backticks build **one string** with the count inside | The tab shows the **unread count**
```

### Building One String with a Template Literal

The solution is formatting the complete text into a single unified string prior to passing it to `<title>`. In modern JavaScript, this is accomplished through string interpolation using template literals:

```js title="A template literal"
const name = 'John';
const greeting = ~`Hello ${name}`~; // The one string 'Hello John'
```

> [!DEFINITION]
> **What is a template literal?** [NEW] A template literal is a JavaScript string enclosed in backtick characters rather than standard quotes.
> Embedded expressions inside `${}` evaluate at runtime and interpolate into the surrounding text.
> Regardless of how many variables or expressions are embedded, the evaluation always yields a single primitive string (Lesson 83).

Applying a template literal ensures `<title>` receives a single string child:

```jsx title="The title with one string"
<title>~{`Inbox (${unreadCount})`}~</title> {/* Builds Inbox (2) as one string */}
```

Evaluating from the inside out clarifies the data flow. The template literal evaluates the string `'Inbox (2)'` inside JavaScript first. The `<title>` component then receives this solitary string as its sole child prop.

```jsx title="src/Inbox.jsx" startLine="18"
  return (
    <main>
      <title>~{`Inbox (${unreadCount})`}~</title> {/* The tab reads Inbox (2), then Inbox (1) */}
      <h1>Inbox</h1>
```

On initial load, the browser tab reads `Inbox (2)`. When the user clicks **Get your next month for $0.99**, state and metadata update in sequence:
1. The `handleOpen` callback mutates the emails collection via state setter.
2. React re-renders the component, recalculating `unreadCount` as 1.
3. React reconciles the hoisted title in `<head>`, and the browser tab updates to `Inbox (1)`.

::: row caption="The head of the page before and after the user clicks the first email."
::: col title="Before the click" tone=good
```dom
<head>
+ <title>Inbox (2)</title>
</head>
```
:::
::: col title="After the click on the first email" tone=good
```dom
<head>
+ <title>Inbox (1)</title>
</head>
```
:::
:::

The page heading maintains its clean title text `Inbox`. Meanwhile, the dynamic unread badge lives in the browser tab, remaining visible even when the user switches to other browser windows.

---

## PRINCIPLE | `precedence` on a stylesheet `<link>`: one copy in the head, and React waits for it to load

> [!PRINCIPLE]
> **Principle 5: Stylesheet Links: `precedence` Enables Head Hoisting and Deduplication**
>
> *Specify `precedence` on a stylesheet `<link>` rendered within a component so React hoists a single deduplicated copy to `<head>`, ranks it, and suspends rendering until loaded.*
>
> Adding `precedence` instructs React to deduplicate stylesheet links by `href`. Three identical component instances produce a single `<link>` in `<head>`, and React suspends rendering to prevent visual layout shifts while the stylesheet loads. Without `precedence`, the link behaves as an ordinary DOM element: every component instance retains a redundant inline copy, and React neither ranks nor suspends for the asset. Supplying `onLoad`, `onError`, or `disabled` disables automated resource management.
>
> **DO THIS:**
> ```jsx
> <link rel="stylesheet" href="/email-row.css" ~precedence="default"~ /> // One copy in the head for every row
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <link rel="stylesheet" ~href="/email-row.css"~ /> // **WRONG:** no precedence, so every row keeps its own copy
> ```

Each email row requires a bottom border separator. That style rule lives in a standalone stylesheet, `email-row.css`, stored in the public assets directory. Developers typically choose between two architectural patterns to load component stylesheets:
1. **Import the CSS file directly in JavaScript.** A module bundler like Vite bundles and injects the stylesheet into the document.
2. **Render a `<link>` element directly inside the component.** Introduced in React 19, this colocation pattern declares stylesheet dependencies alongside the components that require them.

This principle focuses on the second pattern, where `EmailRow` declares its own stylesheet link directly inside JSX.

### The Same Link With and Without `precedence`

Consider declaring the stylesheet link inside `EmailRow`, once with a `precedence` prop and once without it:

```jsx title="The stylesheet link with precedence, and without it"
<link rel="stylesheet" href="/email-row.css" ~precedence="default"~ /> {/* React manages it: one copy in the head */}
<link rel="stylesheet" href="/email-row.css" /> {/* An ordinary tag: it stays inside each row */}
```

Both tags reference the same stylesheet from the same component. However, the presence of `precedence` activates React's built-in resource management pipeline.

> [!DEFINITION]
> **What is `precedence`?** [NEW] `precedence` is an attribute on a stylesheet `<link>` indicating its cascade order relative to other hoisted stylesheets in `<head>`.
> In the CSS cascade, stylesheets declared later take precedence over earlier declarations when specificity is equal.
> You define precedence levels with arbitrary category strings like `"default"` or `"high"`. React orders these groups in `<head>` and maintains that cascade order consistently (Lesson 83).

When `precedence` is provided, React provides three automated resource capabilities:
1. **Document head hoisting and cascade sorting.** React moves the link to `<head>` and positions it according to its precedence level.
2. **Asset deduplication.** When multiple components render identical stylesheet links sharing the same `href`, React inserts only one physical `<link>` in the DOM.
3. **Suspense integration.** React suspends component rendering until the browser finishes downloading and parsing the stylesheet, eliminating Flash of Unstyled Content (Lesson 69).

Without `precedence`, React treats `<link>` as an ordinary inline element. It remains nested inside the component container, duplicates across instances, and does not suspend rendering.

### Three Rows, One Link in the Head

Here is the CSS file and the updated `EmailRow` component containing the `<link>` declaration:

```css title="public/email-row.css"
li {
  border-bottom: 1px solid #ddd;
  padding: 8px 0;
}
```

```jsx title="src/EmailRow.jsx" startLine="1"
export default function EmailRow({ email, onOpen }) {
  return (
    <li
      style={{ fontWeight: email.unread ? 'bold' : 'normal' }}
      onClick={() => onOpen(email.id)}
    >
      <link rel="stylesheet" href="/email-row.css" ~precedence~="default" /> {/* Every row asks for the same stylesheet */}
      {email.subject}
    </li>
  );
}
```

Because the inbox renders three emails, three distinct component instances return the stylesheet link. While standard DOM operations would create three redundant tags, React coordinates the output efficiently:
1. All three `EmailRow` instances declare an identical `<link rel="stylesheet">`.
2. React detects `rel="stylesheet"` alongside the `precedence` property, triggering resource management.
3. React matches all three elements by their shared `href` attribute.
4. React injects a single deduplicated `<link>` into the document head with `data-precedence="default"`.
5. React also emits an accompanying `<link rel="preload">` to trigger immediate network discovery.

```dom caption="With precedence: one stylesheet link in the head for three rows, and no link inside any row."
<head>
+ <link rel="stylesheet" href="/email-row.css" data-precedence="default"> | note: One copy for three rows
  <meta charset="UTF-8">
  <link rel="preload" as="style" href="/email-row.css">
  <title>Inbox (2)</title>
</head>
<body>
  <div id="root">
    <main>
      <h1>Inbox</h1>
      <label for="search">Search mail</label>
      <input id="search" class="search">
      <ul>
        <li style="font-weight: bold;">Get your next month for $0.99</li>
        <li style="font-weight: bold;">Your order has shipped</li>
        <li style="font-weight: normal;">Welcome to the team</li>
      </ul>
    </main>
  </div>
</body>
```

If you remove `precedence`, React bypasses automated resource handling. Each list item keeps a redundant copy of `<link>` inside its `<li>`, without head hoisting, deduplication, or suspense waiting:

```dom caption="Without precedence: each row keeps its own copy of the link, inside the li."
<ul>
! <li style="font-weight: bold;"><link rel="stylesheet" href="/email-row.css">Get your next month for $0.99</li>
! <li style="font-weight: bold;"><link rel="stylesheet" href="/email-row.css">Your order has shipped</li>
! <li style="font-weight: normal;"><link rel="stylesheet" href="/email-row.css">Welcome to the team</li>
</ul>
```

Three specific props explicitly disable React resource management, even if `precedence` is present:
1. `onLoad`
2. `onError`
3. `disabled`

Providing these props signals that your application code manages the asset lifecycle directly. React relinquishes control, and supplying `onLoad` or `onError` logs an advisory console warning.

```tree caption="The same stylesheet link with and without precedence: React manages only the link with precedence."
The same `<link rel="stylesheet">` inside `EmailRow`
- +With `precedence` [`precedence="default"`] | React places **one copy in the head**, ranked among the stylesheets | React **waits for it to load** before it shows the rows
- !Without `precedence` [`rel` and `href` only] | An **ordinary tag**: each row keeps its own copy | React neither ranks it **nor waits** for it
```

### Four More Facts About Managed Links

Four additional technical behaviors often arise in advanced technical evaluations:
1. Once React renders a managed link into `<head>`, subsequent changes to its props are ignored without throwing warnings.
2. React intentionally leaves hoisted stylesheet links in `<head>` even after all components that rendered them have unmounted.
3. Similar resource rules apply to other tags. Inline style tags with `href` and `precedence` receive identical deduplication. Asynchronous `<script async>` tags are deduplicated by their `src` URL.
4. React provides a programmatic `preinit` API to initiate stylesheet preloading before components render, as explored in Lesson 84.

---

## All 5 Principles Together

### The Complete Inbox

Here is the unified inbox project demonstrating all five principles. Notice that the root HTML template omits a static `<title>` tag, allowing `Inbox` to serve as the single source of truth for tab metadata:

```html title="index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```jsx title="src/main.jsx"
import { createRoot } from 'react-dom/client';
import Inbox from './Inbox.jsx';

createRoot(document.getElementById('root')).render(~<Inbox />~); // 1. React renders Inbox first
```

```jsx title="src/Inbox.jsx"
import { useState } from 'react';
import EmailRow from './EmailRow.jsx';

const initialEmails = [
  { id: 0, subject: 'Get your next month for $0.99', unread: true },
  { id: 1, subject: 'Your order has shipped', unread: true },
  { id: 2, subject: 'Welcome to the team', unread: false },
];

export default function Inbox() {
  const [emails, setEmails] = useState(initialEmails);
  const unreadCount = emails.filter(e => e.unread).length;

  function handleOpen(id) {
    setEmails(emails.map(e => (e.id === id ? { ...e, unread: false } : e)));
  }

  return (
    <main>
      <title>~{`Inbox (${unreadCount})`}~</title> {/* Principles 3 and 4: one string, placed in the head */}
      <h1>Inbox</h1>
      <label ~htmlFor~="search">Search mail</label> {/* Principle 1: htmlFor, the DOM's name for for */}
      <input id="search" ~className~="search" /> {/* Principle 1: className, the DOM's name for class */}
      <ul>
        {emails.map(email => (
          ~<EmailRow~ key={email.id} email={email} onOpen={handleOpen} /> // 2. React renders one EmailRow per email
        ))}
      </ul>
    </main>
  );
}
```

```jsx title="src/EmailRow.jsx"
export default function EmailRow({ email, onOpen }) {
  return (
    <li
      ~style~={{ fontWeight: email.unread ? 'bold' : 'normal' }} // Principle 2: an object with a camelCase name
      onClick={() => onOpen(email.id)}
    >
      <link rel="stylesheet" href="/email-row.css" ~precedence~="default" /> {/* Principle 5: one copy in the head */}
      {email.subject}
    </li>
  );
}
```

```css title="public/email-row.css"
li {
  border-bottom: 1px solid #ddd;
  padding: 8px 0;
}
```

### How React Renders the Inbox, and Where Each Node Lands

On initial page mount, React executes `Inbox` first, followed by each `EmailRow` instance. Most visual elements mount inside the `#root` container, while metadata and stylesheet assets hoist into `<head>`:

```tree caption="The order in which React renders the components, and where each node lands in the DOM."
`main.jsx` renders `<Inbox />` | React renders **Inbox first**
- +`Inbox` [1. Rendered first] | Counts **2 unread emails** | The title goes to the **head**; the heading, the label, and the field go inside the root
  - +`EmailRow` for the first email [2. Rendered second] | A **bold** `<li>` inside the root | Its stylesheet link goes to the **head**
  - +`EmailRow` for the second email [3. Rendered third] | A **bold** `<li>` inside the root | The same link: **no second copy**
  - +`EmailRow` for the third email [4. Rendered fourth] | A **normal** `<li>` inside the root | The same link: **no third copy**
```

| Aspect | The Raw HTML Habit | The React Rule |
| :--- | :--- | :--- |
| **Names** | `class`, `for`, `tabindex`, which make the Console ask for other names | The DOM's names `className`, `htmlFor`, `tabIndex`; `aria-*` and `data-*` keep their dashes |
| **Style** | A string of CSS such as `"font-weight: bold"`, which blanks the whole page | An object with camelCase names, such as `{ fontWeight: 'bold' }`, for styles that depend on data |
| **Title** | A fixed title in `index.html`, or `document.title` set in an Effect | A `<title>` rendered by the component that knows the data, placed in the head by React, one at a time |
| **Title text** | Text and curly braces side by side, which give an array, and the tab loses the count | One string, built with a template literal |
| **Stylesheet** | A `<link>` without `precedence`, which every row keeps a copy of | A `<link>` with `precedence`: one copy in the head, ranked, and waited for |

Keep the central thesis in focus: **a tag in JSX is not raw HTML. It is a declarative description that React compiles into DOM API operations, adhering to DOM object conventions and enabling automatic document placement.**

---

## For the Interview

> **The Interview Question:** How do React's built-in HTML components differ from raw HTML?

### How to Answer Clearly in 30 Seconds

"In JSX, a built-in tag like `<input>` or `<title>` is not raw HTML parsed by the browser. It is a declarative instruction that React evaluates to construct DOM nodes via native browser APIs. React classifies these as built-in browser components, and they differ from raw HTML in three major areas:
1. **Property naming follows the DOM.** Attributes map to JavaScript object keys where `class` and `for` are reserved keywords. Consequently, React adopts DOM property names: `className`, `htmlFor`, and camelCase properties like `tabIndex`. Hyphens are retained only on `aria-*` and `data-*` attributes.
2. **Inline styling requires an object.** The `style` prop models the native DOM `element.style` object using camelCase keys. Numbers receive automatic pixel units unless applied to unitless properties. Passing a raw CSS string throws a fatal render exception.
3. **Metadata and resource tags gain automated hoisting in React 19.** Elements like `<title>`, `<meta>`, and `<link>` hoist directly into `<head>` regardless of where they are rendered. Stylesheets configured with `precedence` undergo automated deduplication and suspense integration. Form elements also gain controlled state synchronization when supplied with a `value` prop."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why did React rename `class` to `className` at all?"**
   JSX compiles into standard JavaScript function calls where attributes become keys in a props object. In JavaScript, `class` is a reserved language keyword and cannot be used as an unquoted identifier or destructured variable without syntax errors. React resolved this by aligning with standard DOM properties such as `element.className` and `label.htmlFor`. React still writes standard HTML attributes to the physical DOM, producing `class="search"` in the browser inspector. If a developer accidentally writes `class` in JSX, React logs a development warning pointing to `className`.
2. **"Why does `<title>Inbox ({unreadCount})</title>` fail in the tab, when the same structure works in an `<h1>`?"**
   Placing text and JSX expressions side by side creates multiple child elements, yielding a three-item array. Standard container tags like `<h1>` accept arrays of children and render their text nodes sequentially. By contrast, React's document metadata reconciler for `<title>` explicitly requires a single primitive string child to assign to the document title. Passing multiple child nodes causes an error and fails to update the tab. Wrapping the interpolated expression in a template literal evaluates the text into a single string before passing it to the element.
3. **"If several components render the same stylesheet `<link>`, how many link tags end up in the DOM?"**
   When `precedence` is specified, React inserts exactly one link tag in the DOM. React deduplicates stylesheet links by their `href` attribute, hoists that single instance into `<head>`, and positions it according to its precedence ranking. Furthermore, React suspends component rendering until the stylesheet finishes loading to prevent layout shifts. Without `precedence`, React treats `<link>` as an unmanaged inline element, leaving duplicate links inside every component container without suspense waiting. Specifying `onLoad`, `onError`, or `disabled` also turns off automated resource management.

```tree caption="Interview summary: what React does with a built-in tag beyond raw HTML."
What React adds to a built-in tag
- +Common components [`className` `htmlFor` `style`] | Names follow the **DOM**, and `style` is an **object** | React writes the usual **HTML attributes** on the node
- +Form components [`value` `onChange`] | Passing `value` makes the field **controlled** | Lesson 20 covers them
- +Resource and metadata components [`<title>` `<meta>` `<link>`] | React places them in the **head** from any component | A stylesheet link with `precedence` is **de-duplicated and waited for**
```
