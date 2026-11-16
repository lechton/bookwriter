# Lecture 81: How an Error Report Names the Component That Wrote the Tag

*(When the error names a component that has no bug, how do you find the component that does?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How does captureOwnerStack pinpoint which component caused a render or error?

---

## VS | The Component Stack vs. the Owner Stack: both list the components above the error, only the Owner Stack names who wrote the tag

> In plain JavaScript, when a function throws an error, the call stack lists the function that called it, pointing directly to where the invalid value originated. **In React, a parent component never directly calls child component functions. It returns JSX elements describing what to render, so the runtime stack lists the crashing component followed only by React internal functions**. `captureOwnerStack()` recovers the missing link: the exact component whose JSX authored the tag and supplied the invalid props.

When an unhandled error occurs in the browser, the console prints a red error report. Beneath the error message, the runtime lists several lines that begin with `at`. The function that crashed appears at the top. One line below sits the function that invoked it, followed by the caller of that function. This list is a **stack trace**, and each line represents a stack **frame**.

Consider a plain JavaScript function that formats a price, and another function that calls it without providing an amount:

```js title="Plain JavaScript: the caller is in the stack trace"
function formatPrice(amount) {
  return '$' + ~amount.toFixed(2)~; // Throws: amount is undefined
}

function showCart() {
  ~formatPrice()~; // The bug: showCart calls formatPrice with no amount
}

showCart();
```

`toFixed(2)` is a standard JavaScript number method that formats a numeric value to two decimal places, turning 12 into `12.00`. In this example, `amount` is `undefined`. Because `undefined` has no methods, the JavaScript engine halts execution and throws a `TypeError`:

```devconsole width=full caption="A plain JavaScript error: the caller is one line down."
x Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
  at formatPrice
  at showCart
```

The actual bug exists in `showCart`, which invoked `formatPrice` without passing an argument. In plain JavaScript, the stack trace points directly to `showCart` on the very next line, allowing you to locate and resolve the issue immediately.

### The same price in React

Now implement the same pricing logic as a React component. Here, `ProductList` displays the price using a JSX tag:

```jsx title="A component that writes a tag, and the component behind the tag"
function Price({ amount }) {
  return <span>${~amount.toFixed(2)~}</span>; // Throws: amount is undefined
}

function ProductList() {
  return <li>Cap ~<Price />~</li>; // The bug: a Price tag with no amount
}
```

The root cause is identical: the product list renders `<Price />` without passing an `amount` prop. Even so, the resulting stack trace looks completely different:

```devconsole width=full caption="The same error in React: Price, then only React's own functions."
x Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
  at Price
  at Object.react_stack_bottom_frame
  at renderWithHooks
  at updateFunctionComponent
  at ...
```

Notice that `ProductList` is missing from the stack trace. Why does `ProductList` disappear? Because `ProductList` never directly called `Price`. Instead, `ProductList` returned a JSX element description and exited. React later evaluated that element and invoked `Price` during rendering (Lesson 13). Because React called the function, the frame directly below `Price` belongs to React internal code rather than your application component. Developers refer to these internal framework entries as library frames.

### The component that wrote the tag: the owner

To fix the bug, you need the identity of the component that authored the `<Price />` tag. The React documentation defines that component as the **owner** of the element. During development, React tracks which component authored each JSX tag in memory, and provides a dedicated function to inspect that record:

```jsx title="Reading the record of who wrote each tag"
import { captureOwnerStack } from 'react';

console.log(~captureOwnerStack()~); // A string: the owner first, then the owner's owner, up to App
```

`captureOwnerStack()` returns a formatted string containing one `at` line for each step in the ownership hierarchy. The first line identifies the direct owner that authored the tag. The following lines list that owner's creator, continuing up to the root of the tree. The React documentation terms this sequence the **Owner Stack**.

### Two lists for the same error

Consider a large e-commerce application. A single shared component, `Price`, displays every monetary figure across the entire site. The application renders this component on product listings, shopping carts, checkout summaries, and invoices, totaling hundreds of locations.

If a page renders an invalid price element, an uncaught error can unmount the whole interface, presenting the user with an empty screen:

```page caption="What the user sees when the shop page opens: a blank page."
blank
```

The browser console identifies `Price` as the crash site. Yet the implementation of `Price` consists of just three lines of clean code without any internal defects. Somewhere among hundreds of call sites, a parent component rendered `<Price />` without an `amount` prop. Finding that specific tag by hand would take hours.

React offers two distinct diagnostic lists for this crash: the Owner Stack and the **Component Stack**. Here is how both stacks represent the identical failure:

```devconsole width=full caption="The Component Stack of the Price error: every component and tag around Price."
  at Price
  at li
  at ul
  at ProductList
  at main
  at Layout
  at App
```

```devconsole width=full caption="The Owner Stack of the same error: only the components that wrote the tags."
  at http://localhost:5173/src/ProductList.jsx:16:19
  at Array.map
  at ProductList
  at App
```

Both outputs begin with `at`, both originate from React diagnostics, and both describe the same failing `Price` instance. **It may look the same, or work the same at first, but it is NOT the same thing!**
- **The Component Stack** tracks where `Price` sits in the rendered UI tree. It enumerates `Price`, followed by every enclosing layout component and raw DOM tag up to `App`.
- **The Owner Stack** tracks which components authored the JSX tags. Its initial frame points directly to the line inside the ProductList file where the `<Price />` tag was authored. It then lists `ProductList` and `App`, omitting intermediate layout wrappers and raw DOM elements.

Why does that first frame lack a component name? The `<Price />` tag was written inside an anonymous arrow function passed to `products.map`. Because anonymous functions lack a name property, React outputs the source file path and line number instead. The subsequent frame, `Array.map`, names the JavaScript array method executing that callback.

By filtering out non-owning wrappers, the Owner Stack directs you immediately to the ProductList file, where the missing prop must be fixed.

```tree caption="The Component Stack follows where Price sits; the Owner Stack follows who wrote the tags."
Two lists of names for the same `Price` error
- +Component Stack [`errorInfo.componentStack`] | Follows **where `Price` sits** on the page | Lists `Price`, `li`, `ul`, `ProductList`, `main`, `Layout`, and `App`
- +Owner Stack [`captureOwnerStack`] | Follows **who wrote the tags** | Names only **`ProductList`** and **`App`**; its first line points at the `Price` tag to fix
```

### The Words of This Lesson

This lesson builds on four key concepts:

> [!DEFINITION]
> **The children prop.** [REVIEW] When you author JSX tags between the opening and closing tags of a component, such as `<Layout><ProductList /></Layout>`, React supplies them to that component through the `children` prop; the receiving component decides where to position those elements inside its own markup, such as within a `<main>` container (Lesson 09).

> [!DEFINITION]
> **An uncaught render error.** [REVIEW] When a component throws an error during its render phase and no Error Boundary wraps that part of the tree, React unmounts the entire component tree from the DOM, resulting in a blank page for the user (Lesson 72).

> [!DEFINITION]
> **The development build and the production build.** [REVIEW] While developing, your bundler executes the development build of React, which contains helpful warnings, invariant checks, and debugging APIs; the production build strips these debugging tools to minimize file size and maximize execution speed (Lesson 47).

> [!DEFINITION]
> **The Owner Stack.** [NEW] The Owner Stack is a diagnostic call trace produced by `captureOwnerStack()` in development; it reports the exact sequence of components that authored the JSX tags leading to the current component, skipping layout components that merely forward children (Lesson 81).

### Where Readers Usually Go Wrong

Developers often assume that the component positioned directly above a failing element in the tree authored that element. In React applications, that assumption frequently leads to wasted time. A layout component that renders `children` merely acts as a container for elements authored elsewhere. Similarly, standard HTML elements like `<main>` and `<li>` simply hold rendered content. The component responsible for creating the element and passing its props is often located several layers higher in the file hierarchy.

### Three Lists of Names for One Error

When an error occurs, the JavaScript engine and React generate three distinct diagnostic stacks. Each stack serves a specialized debugging purpose:
1. **The runtime error stack, `error.stack`.** The browser engine generates this call stack on the JavaScript Error object. It names the crashing function followed by React internal execution frames. It is best suited for diagnosing coding errors located inside the throwing component itself.
2. **The Component Stack, `errorInfo.componentStack`.** React supplies this hierarchical trace to root error handlers and Error Boundary lifecycle methods. It lists every ancestor component and DOM node in the rendered tree. It serves production environments because it remains available in production builds.
3. **The Owner Stack, `captureOwnerStack()`.** React provides this trace exclusively in development mode. It reports only the components whose JSX authored the elements. It works whenever React executes your code: during render passes, within Effects, inside synthetic event handlers, and inside root error callbacks.

```tree caption="Three lists of names for one error, and where each one fits."
Three lists of names for one error
- +1. The error's own stack [`error.stack`] | Names the component that threw, **then React's functions** | Fits a bug **inside** the component that threw
- +2. The Component Stack [`errorInfo.componentStack`] | Lists **every parent** in the tree | Fits **production**, where it is the only React list
- +3. The Owner Stack [`captureOwnerStack`] | Lists **only the owners** | Fits **development**, while React runs your code
```

### The Rule of Thumb: who wrote the tag?

**Ask one central question whenever an error occurs: which component authored the tag for the component that crashed? In development, `captureOwnerStack()` reveals that component on its first line. In production, where Owner Stacks are disabled, your error reporting infrastructure must rely on the Component Stack instead.**

## SECTION | A Shop Page That Goes Blank

Our example application is a miniature e-commerce storefront. It displays a heading titled `Shop` alongside a catalog containing two items. The inventory consists of an array of two objects, but the second item is missing its price property:

```js title="The two products"
const products = [
  { id: 1, name: 'Mug', price: 12 },
  { id: 2, name: ~'Cap'~ }, // The Cap product has no price field
];
```

The user performs a single action: navigating to the store page.

What is at stake is user downtime. When an unhandled error occurs within a shared component like `Price`, React unmounts the entire interface, leaving the user with a blank screen (Lesson 72). Until the developer discovers the root cause, visitors cannot interact with the store. Without the Owner Stack, debugging typically wastes time checking incorrect files:
1. The standard error stack points to `Price` followed by React internal functions. The developer inspects the Price file, only to find no internal syntax or logic bugs.
2. The Component Stack lists every visual ancestor enclosing `Price`. The developer inspects the nearest parent component, which is often a layout that merely forwards `children`, also containing no defects.
3. Only after exhausting those candidates does the developer examine `ProductList`, where the missing prop originated.

The Owner Stack eliminates this trial-and-error process by naming `ProductList` immediately on its first line.

The application structure consists of five files inside the source directory. The application entry point mounts `App` without Strict Mode, matching the official documentation examples so that diagnostic logs render exactly once (Lesson 47):

```files title="shop: File Explorer" caption="How the files of our shop sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` into `#root`, and later passes the error handlers to `createRoot`
  App.jsx | parent | Writes `<Layout><ProductList /></Layout>`
  Layout.jsx | default export | Returns `<main>` with the `Shop` heading and its `children`
  ProductList.jsx | default export | Holds `products` and writes one `<li>` with a `<Price />` per product
  Price.jsx | default export | Shows one amount, such as `$12.00`
```

**PRINCIPLES:** Although an error report names the component that crashed, the defect almost always resides in the component that authored its JSX tag. Five foundational principles trace this path, from the initial JSX element to the production monitoring pipeline:
1. **Principle 1: The owner wrote the tag; the parent only holds it.** `App` authors the `<ProductList />` tag, making that component the owner. `Layout` receives that element as `children`, acting merely as a parent container.
2. **Principle 2: The error's own stack names `Price`, then React.** `ProductList` never calls `Price` directly. React invokes `Price` during rendering, so `ProductList` never appears on the JavaScript runtime call stack.
3. **Principle 3: The Component Stack lists every parent; the Owner Stack lists only the owners.** Inside root error callbacks, `errorInfo.componentStack` lists every structural container surrounding the failed element. `captureOwnerStack()` filters that list down to the product list and the app.
4. **Principle 4: `captureOwnerStack()` answers only while React runs your code.** It returns a populated trace during render, inside Effects, within synthetic event handlers, and inside root error callbacks. It returns `null` inside timer callbacks, network promises, or native event listeners.
5. **Principle 5: In production, there is no Owner Stack.** `captureOwnerStack` is omitted from production builds. Production monitoring setups must forward `errorInfo.componentStack` to error reporting services instead.

---

## PRINCIPLE | `<ProductList />` inside `App`: the component that writes the tag is the owner, not the layout that holds it

> [!PRINCIPLE]
> **Principle 1: Owner and Parent: The Owner Is the Component Whose JSX Wrote the Tag**
>
> *The owner of an element is the component that wrote its tag; a component that only renders `children`, and every HTML tag, is a parent but not the owner.*
>
> A layout sits right above the content of almost every page, so it looks like the component that created that content. It did not. It received the content in `children` and placed it. When you look for the component that wrote a tag, you look for the owner, and the owner can sit several levels higher in the tree.
>
> **DO THIS:**
> ```jsx
> function App() {
>   return <Layout>~<ProductList />~</Layout>; // App wrote this tag: look in App for what ProductList receives
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Layout({ children }) {
>   return <main>~{children}~</main>; // **WRONG:** searching Layout for the ProductList tag; Layout only forwards children
> }
> ```

Consider the two components positioned above `ProductList` in our application structure:

```jsx title="Two components above ProductList"
function App() {
  return <Layout>~<ProductList />~</Layout>; // App writes the ProductList tag
}

function Layout({ children }) {
  return <main>~{children}~</main>; // Layout places whatever it received
}
```

In the rendered interface, the product list renders directly inside the `<main>` container returned by `Layout`. Because of this visual hierarchy, `Layout` often appears to be the component that created `ProductList` (Lesson 06).

### VS | `Layout` vs. `App`: both sit above `ProductList`, only `App` wrote its tag

**It may look the same, but it is NOT the same thing!**
- **`Layout` is the parent of `ProductList`.** The product list appears inside the layout output. However, no line of code inside `Layout` authored the `<ProductList />` tag. `Layout` merely receives and positions whatever elements arrive through its `children` prop (Lesson 09).
- **`App` is the owner of `ProductList`.** The `<ProductList />` tag is explicitly written within the JSX markup of `App`.

This distinction is fundamental: the React documentation defines the owner of an element as the component whose JSX code created it. In plain terms, `ProductList` was created by `App`. In many component trees, the parent container and the element owner are two entirely different components.

React uses the term **forwarding** to describe what `Layout` does with content it receives through props. `Layout` accepts the evaluated `<ProductList />` element and inserts it into the layout structure, without having created any part of it. Enclosing HTML tags, such as `<main>`, forward elements in precisely the same manner. React designates these native HTML tags as **DOM components**, and a DOM component is never an owner.

### Why `ProductList` sits under `Layout` but belongs to `App`

This relationship can seem counterintuitive because the final DOM hierarchy nests `ProductList` beneath `Layout`. Examining the exact execution order clarifies why ownership belongs to `App`:
1. React executes `App`. `App` evaluates its JSX and returns `<Layout><ProductList /></Layout>`.
2. The `<ProductList />` element object is created immediately inside `App`, before the layout runs.
3. React then invokes `Layout`, passing the already instantiated element object into its `children` prop.
4. `Layout` executes and returns the element wrapped inside `<main>`.
5. In the rendered tree, the product list sits beneath `Layout` and its `<main>` container. Its owner remains `App`, because `App` authored the tag in step 1.

```tree caption="The parent is where an element sits; the owner is the component whose JSX wrote its tag."
Two components above `ProductList`
- +`App`: the owner [`<Layout><ProductList /></Layout>`] | **Writes** the `<ProductList />` tag in its JSX | React's docs: `ProductList` is **created by `App`**
- +`Layout`: the parent [`<main>{children}</main>`] | **Receives** the element in `children` and places it | Only **forwards** the element; it is **not** the owner
```

### The first step of our shop

We assemble the initial storefront using these three components. `App` authors both component tags:

```jsx title="src/App.jsx"
import Layout from './Layout.jsx';
import ProductList from './ProductList.jsx';

export default function App() {
  return (
    <Layout>
      ~<ProductList />~ {/* App is the owner of ProductList */}
    </Layout>
  );
}
```

`Layout` renders the page heading and positions its `children` underneath:

```jsx title="src/Layout.jsx"
export default function Layout({ children }) {
  return (
    <main>
      <h1>Shop</h1>
      ~{children}~ {/* The ProductList element that App wrote */}
    </main>
  );
}
```

`ProductList` renders an unordered list containing one item per product. At this initial stage, each list item displays only the product name:

```jsx title="src/ProductList.jsx"
const products = [
  { id: 1, name: 'Mug', price: 12 },
  { id: 2, name: 'Cap' },
];

export default function ProductList() {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>~{product.name}~</li> // No prices yet: only the name
      ))}
    </ul>
  );
}
```

When loaded, the browser displays the store heading followed by the two product names:

```page caption="The shop after the first step: the heading from Layout and the two names from ProductList."
heading: Shop
line: Mug
line: Cap
console: quiet
```

Opening the browser Elements panel reveals only raw HTML tags. The DOM shows neither component boundaries nor ownership records. Element ownership is tracked within React internal runtime memory, rather than reflected in DOM attributes:

```dom caption="The Elements panel for the first step: main holds the heading and the list; no component name appears."
<div id="root">
  <main>
    <h1>Shop</h1>
    <ul>
      <li>Mug</li>
      <li>Cap</li>
    </ul>
  </main>
</div>
```

---

## PRINCIPLE | `error.stack`: names the component that threw, then only React's functions

> [!PRINCIPLE]
> **Principle 2: The Error's Stack: React Calls the Component, So the Tag's Author Is Not on the Stack**
>
> *When a component throws during render, the error's stack names that component and then React's functions; the component that wrote its tag is not on it.*
>
> A component never calls the components it shows. It returns their tags and finishes, and React calls them later. So the error's own stack tells you which component threw, but not which component passed it the bad props. The file the error names is where the crash happened, and often not where the bug is.
>
> **DO THIS:**
> ```jsx
> <li key={product.id}>
>   {product.name} ~<Price amount={product.price} />~ {/* Fix it here: ProductList passed undefined for Cap */}
> </li>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function Price({ amount }) {
>   return <span>${~(amount || 0)~.toFixed(2)}</span>; // **WRONG:** Cap now shows $0.00, and the missing price stays hidden
> }
> ```

In JavaScript runtimes, the engine maintains an active execution record of all currently running functions. When one function calls another, the engine pushes a new frame onto this **call stack**. If an unhandled exception occurs, the runtime captures the current state of this call stack on the resulting error object as `error.stack`.

Because the call stack reflects active function calls, it can only list functions that directly invoked one another.

### VS | `Price()` vs. `<Price />`: both mention `Price`, only the call puts `ProductList` on the stack

Developers sometimes read `<Price />` as if the product list directly invoked `Price()`. **It may look the same, but it is NOT the same thing!**
- **A direct invocation like `Price()`** would execute immediately, placing `ProductList` on the call stack beneath the price component. React explicitly forbids direct component invocations: components must never be called as plain functions.
- **A JSX tag like `<Price />`** merely returns an element descriptor object. `ProductList` finishes its execution and returns control to React. React reconciler evaluates the element tree and invokes `Price` during its own render cycle (Lesson 13).

Because React invokes the component, the frame beneath `Price` on the call stack belongs to React internal functions like `renderWithHooks`. These internal framework entries constitute the library frames referenced in the interview question.

```tree dir=right caption="A plain call keeps the caller on the stack; a JSX tag hands the call to React, so the stack continues with React."
Who sits under the failing function on the stack
- +Plain JavaScript call [`formatPrice` inside `showCart`] | `showCart` **calls** `formatPrice` | The stack reads `at formatPrice`, then **`at showCart`**
- !JSX tag [`<Price />` inside `ProductList`] | `ProductList` **returns** the tag and finishes; **React calls** `Price` | The stack reads `at Price`, then **React's functions** such as `renderWithHooks`; `ProductList` is **not there**
```

### The shop goes blank, and the Console points at `Price`

Now introduce pricing components to the store. `Price` renders a formatted currency amount prefixed with a dollar sign:

```jsx title="src/Price.jsx"
export default function Price({ amount }) {
  return <span>${~amount.toFixed(2)~}</span>; // Mug: "$12.00". Cap: amount is undefined, so this line throws
}
```

`ProductList` renders a `<Price />` tag for each catalog item, passing along the product price:

```jsx title="src/ProductList.jsx"
import Price from './Price.jsx';

const products = [
  { id: 1, name: 'Mug', price: 12 },
  { id: 2, name: 'Cap' },
];

export default function ProductList() {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name} ~<Price amount={product.price} />~ {/* For Cap, product.price is undefined */}
        </li>
      ))}
    </ul>
  );
}
```

When the user visits the page, the entire screen renders blank. The crash occurs inside `Price`, well after `ProductList` has finished executing. Here is the exact sequence of events:
1. React executes `App`, then the layout, and finally `ProductList`.
2. `ProductList` returns two list items, each containing a `Price` element descriptor. Because the Cap data object lacks a price property, the `amount` prop received by that element evaluates to `undefined`.
3. `ProductList` completes its execution and exits the call stack.
4. React renders the Mug item, calling `Price` with 12 to produce `$12.00`.
5. React renders the Cap item, calling `Price` with `undefined`. Calling `amount.toFixed(2)` throws a `TypeError`.
6. Because no Error Boundary wraps this component tree, React unmounts the whole page (Lesson 72).

```page caption="The shop after the prices are added: the Cap row has no price, and the page is blank."
blank
```

The browser console displays the error alongside its stack trace. The trace names `Price` at the top, followed strictly by React internal methods. `ProductList` nowhere appears:

```devconsole width=full caption="The Console after the crash: the stack names Price, then React's functions."
x Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
  at Price
  at Object.react_stack_bottom_frame
  at renderWithHooks
  at updateFunctionComponent
  at ...
! An error occurred in the <Price> component.
  Consider adding an error boundary to your tree to customize error handling behavior.
  Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

Inspecting the DOM confirms that React emptied the root container completely:

```dom caption="The Elements panel after the error: React removed everything from the root div."
! <div id="root"></div>
```

### The fix that hides the bug

Because the console identifies `Price` as the crash site, developers are often tempted to patch `Price` directly, which leaves the root defect undetected. Here is how that mistake typically unfolds:
1. The page crashes, displaying a blank screen, and the console reports an unhandled error inside `Price`.
2. A developer modifies `Price` to add a fallback value, causing missing amounts to default to zero.
3. The page renders again, but the Cap item now displays a price of `$0.00`.
4. The underlying bug, an inventory record created without a price, persists within the data of `ProductList`. The defect is now hidden, presenting misleading financial data to shoppers.

The stack trace named `Price` solely because that is where the runtime exception was triggered, not because `Price` contained invalid logic. To fix the issue properly, you must locate the component that authored the tag without supplying required data. The following principle demonstrates how React provides that information.

---

## PRINCIPLE | `captureOwnerStack()` in `onUncaughtError`: only the components that wrote the tags, not every parent

> [!PRINCIPLE]
> **Principle 3: Two Stacks: The Component Stack Lists Every Parent, the Owner Stack Lists Only the Owners**
>
> *`errorInfo.componentStack` lists the failing component and everything above it; `captureOwnerStack()` lists only the components that wrote the tags on the way to it.*
>
> React gives both lists to the error handlers of the root. The Component Stack answers "where did it break?", and on a real page it is long. The Owner Stack answers "whose code passed the bad props?", and its first name is the component to open.
>
> **DO THIS:**
> ```jsx
> createRoot(document.getElementById('root'), {
>   onUncaughtError: (error, errorInfo) => {
>     console.log(~captureOwnerStack()~); // ProductList first: the component that wrote the Price tag
>   },
> }).render(<App />);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const root = createRoot(document.getElementById('root'));
> root.render(<App />, ~{ onUncaughtError }~); // **WRONG:** render takes one argument; React logs an error and never calls the handler
> ```

Up to this point, the application entry point mounted `App` using standard syntax (Lesson 07):

```jsx title="src/main.jsx"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(~document.getElementById('root')~).render(<App />); // One argument: the root div
```

`createRoot` also accepts an optional configuration object as its second argument. The React documentation refers to these configuration properties as **root options**. Three of these options allow you to handle runtime errors:
1. **`onUncaughtError`**: React invokes this callback when an error throws during rendering and no Error Boundary catches it. The missing price crash in our Cap component triggers this callback.
2. **`onCaughtError`**: React invokes this callback when an Error Boundary successfully intercepts an error.
3. **`onRecoverableError`**: React invokes this callback when the runtime encounters an issue it can recover from automatically, such as server hydration mismatches.

React passes two arguments to each callback: the underlying `error` object, and a metadata object named `errorInfo`. The Component Stack is available inside that metadata object under `errorInfo.componentStack`.

Here is the entry point configured with `onUncaughtError`. The handler logs both diagnostic lists sequentially:

```jsx title="src/main.jsx"
import { captureOwnerStack } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root'), {
  ~onUncaughtError~: (error, errorInfo) => { // React calls it with the error and errorInfo
    console.log(~errorInfo.componentStack~); // 1. The Component Stack
    console.log(~captureOwnerStack()~); // 2. The Owner Stack
  },
}).render(<App />);
```

`captureOwnerStack` is imported from `react` as a named export (Lesson 05). It accepts no parameters. When called, it inspects React internal state and returns the current Owner Stack formatted as a string.

An important behavioral detail: configuring these options replaces React default error logging. Because React default console logger is superseded, the console outputs only our two custom log statements, while the page remains blank:

```devconsole width=full caption="The Console with onUncaughtError: the Component Stack first, then the Owner Stack."
  at Price | 1. errorInfo.componentStack
  at li
  at ul
  at ProductList
  at main
  at Layout
  at App
  at http://localhost:5173/src/ProductList.jsx:16:19 | 2. captureOwnerStack()
  at Array.map
  at ProductList
  at App
```

In a real browser environment, each line also includes the file URL, line number, and column number. The diagrams in this lesson omit those coordinates for clarity, except on the first line of the Owner Stack where no component name exists.

### VS | `errorInfo.componentStack` vs. `captureOwnerStack()`: both come from the same handler, only the Owner Stack skips what was only forwarded

The two console logs might resemble the same data formatted at different lengths. **It may look the same, but it is NOT the same thing!**
- **The Component Stack** lists the failing component alongside every ancestor component and DOM node in the rendered tree. The React documentation describes this as the throwing component and all its parent components.
- **The Owner Stack** lists only the components whose JSX authored the elements leading down to the failure.

The React documentation highlights three reasons why the Owner Stack remains so compact:
1. Enclosing layout components and raw DOM tags, such as `<main>` and `<li>`, merely forwarded the element through props, meaning they are not owners.
2. The Mug item is a sibling of the Cap item. Sibling branches are not part of the creation path for the failed `Price` tag, so neither list includes them.
3. `Price` itself is excluded, because the standard error stack already identifies the throwing component.

As a result, the Owner Stack contains only `ProductList` followed by `App`. Its first line, pointing to the anonymous arrow function inside `products.map`, gives the exact line number of the `<Price />` tag where the missing prop was passed. That line in the ProductList file is the code you need to inspect.

```tree caption="The same Price error read through the Component Stack and through the Owner Stack."
The two lists for the Cap error
- !Component Stack [`errorInfo.componentStack`] | Starts with **`Price`**, the component that threw | Then **every parent**: `li`, `ul`, `ProductList`, `main`, `Layout`, `App`
- +Owner Stack [`captureOwnerStack`] | Starts with **`ProductList`**, the component that **wrote the `Price` tag** | Then **`App`**, which wrote the `ProductList` tag; nothing that only forwarded
```

### Reading the Component Stack from the top

In our small demonstration, `ProductList` appears as the fourth entry in the Component Stack. In large production codebases, dozens of wrappers separate a leaf component from its owner: grid systems, cards, theme containers, and HTML elements. Consider what happens when an engineer investigates an error by reading the Component Stack from top to bottom:
1. The topmost line identifies the component that crashed, which often contains no internal defects.
2. The subsequent lines represent structural HTML elements.
3. The next component listed is typically a container or layout that merely forwards `children`. Inspecting that file reveals no bugs.
4. The component that authored the tag sits buried further down the list.

The Owner Stack bypasses those irrelevant container layers entirely, pointing directly to the owning component on its very first line.

### The same two lists in an Error Boundary

Error Boundaries receive the same Component Stack information. The class lifecycle method `componentDidCatch` receives this data through `info.componentStack` (Lesson 72). The React documentation recommends capturing both stacks when reporting caught errors. In official examples, `logErrorToMyService` represents an external logging utility:

```jsx title="Logging both lists from an Error Boundary"
componentDidCatch(error, info) {
  logErrorToMyService(error, ~info.componentStack~, ~captureOwnerStack()~); // Both lists, in development
}
```

Pay close attention to ownership context: the Owner Stack captured inside `componentDidCatch` reflects the component currently executing. Because React is running the Error Boundary during this lifecycle call, `captureOwnerStack()` reports the owners of the Error Boundary itself rather than `Price`.

In our application, wrapping the product list with an Error Boundary inside `App` produces an Owner Stack containing only `at App`. In contrast, the root `onCaughtError` callback retains the Owner Stack of the original throwing component, `Price`. This is why our production configuration relies on root handlers in Principle 5.

### Where the root options go

Root options must be provided to `createRoot`, never to `render`. When options are mistakenly passed to `root.render`, React ignores them completely and never invokes your error callbacks. Instead, React logs a warning in the console and falls back to default error logging, leaving the crash unhandled:

```devconsole width=full caption="The Console when the root options are passed to root.render."
x You passed a second argument to root.render(...) but it only accepts one argument.
x Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
! An error occurred in the <Price> component.
  Consider adding an error boundary to your tree to customize error handling behavior.
  Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

---

## PRINCIPLE | `captureOwnerStack()`: returns the list only while React runs your code, and `null` after

> [!PRINCIPLE]
> **Principle 4: When It Answers: captureOwnerStack Gives a List Only While React Runs Your Code**
>
> *Call `captureOwnerStack()` during render, in an Effect, in a React event handler, or in a React error handler; in a `setTimeout` callback, after `fetch`, or in an `addEventListener` listener, it returns `null`.*
>
> The Owner Stack belongs to the component that React is running right now. When the browser runs our code later, React is not running any component, so there is no Owner Stack to read. A log that prints `null` does not mean the tool is broken. It means the call ran outside React. Capture the string earlier, while React runs the code, and keep it.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const ownerStack = ~captureOwnerStack()~; // In the body of the Effect: the Owner Stack
>   function handleEvent() {
>     console.log('Owner Stack: ', ownerStack);
>   }
>   document.addEventListener('click', handleEvent);
>   return () => document.removeEventListener('click', handleEvent);
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   function handleEvent() {
>     console.log('Owner Stack: ', ~captureOwnerStack()~); // **WRONG:** the browser calls handleEvent, so this is null
>   }
>   document.addEventListener('click', handleEvent);
>   return () => document.removeEventListener('click', handleEvent);
> });
> ```

Imagine an `Add to cart` button in our store, defined within a component named `AddButton`. When clicked, the event handler inspects the Owner Stack immediately, and then inspects it again inside a scheduled timer:

```jsx title="The same captureOwnerStack call in onClick and in setTimeout"
function AddButton() {
  function handleClick() {
    console.log('Owner Stack: ', ~captureOwnerStack()~); // 1. In onClick: logs the Owner Stack
    setTimeout(() => {
      console.log('Later: ', ~captureOwnerStack()~); // 2. In a setTimeout callback: logs null
    }, 0);
  }

  return <button onClick={handleClick}>Add to cart</button>;
}
```

When the user clicks the button, the console outputs two contrasting results:

```devconsole caption="The Console after one click on Add to cart: the Owner Stack from onClick, then null from setTimeout."
Owner Stack:  | 1. from onClick
  at button
  at AddButton
  at App
Later:  null | 2. from setTimeout
```

### VS | `onClick` vs. `setTimeout`: both run after the same click, only `onClick` runs while React is running

Both lines of code execute in response to the same user click within the same component. **It may look the same, but it is NOT the same thing!**
- **`handleClick` is a React synthetic event handler.** Because you attached it to the JSX `onClick` prop, React dispatches the event and invokes your handler (Lesson 11). React is actively executing your code, so it maintains full awareness of the active component context. The generated trace starts with the `<button>` element, followed by `AddButton` and the root app component.
- **The `setTimeout` callback** runs later, triggered asynchronously by the browser timer system (Lesson 15). At the moment the callback fires, React is idle and no component execution is active. With no component context available, `captureOwnerStack()` returns `null`.

The React documentation identifies four execution contexts where `captureOwnerStack()` returns a valid trace:
1. During a component render pass.
2. Inside the synchronous body of an Effect.
3. Within React synthetic event handlers.
4. Inside React root error callbacks, such as `onUncaughtError`.

The documentation likewise identifies three asynchronous contexts where it returns `null`:
1. Inside a `setTimeout` or `setInterval` callback.
2. Inside asynchronous code executing after an awaited `fetch` call.
3. Inside a custom DOM event listener registered directly through `addEventListener`, which the browser dispatches independently of React (Lesson 79).

```tree caption="captureOwnerStack gives a list only while React is running our code."
Where `captureOwnerStack` is called
- +While React runs our code [render, Effects, `onClick`, `onUncaughtError`] | React knows **which component** the code belongs to | Returns **the Owner Stack** as a string
- !Outside React [`setTimeout`, after `fetch`, `addEventListener`] | The browser runs the code; **React is not running** | Returns **`null`**
```

### A listener added in an Effect logs `null`

The React documentation emphasizes a common mistake when using `addEventListener`. Suppose a component attaches a global click listener inside an Effect, attempting to read the Owner Stack inside the listener:

```jsx title="Calling captureOwnerStack inside a custom DOM event handler"
useEffect(() => {
  function handleEvent() {
    console.log('Owner Stack: ', ~captureOwnerStack()~); // **WRONG:** the browser calls handleEvent, so this logs null
  }

  document.addEventListener('click', handleEvent);
  return () => document.removeEventListener('click', handleEvent);
});
```

When the user clicks anywhere on the page, the listener logs `null`:

```devconsole caption="The Console after a click on the page: the listener logs null."
Owner Stack:  null | from handleEvent
```

The solution recommended by the React documentation is to call `captureOwnerStack()` synchronously within the Effect body while React is executing. The listener can then access the captured string from its outer closure:

```jsx title="Calling captureOwnerStack in the body of the Effect"
useEffect(() => {
  const ownerStack = ~captureOwnerStack()~; // In the body of the Effect: React is running, so this is the Owner Stack

  function handleEvent() {
    console.log('Owner Stack: ', ~ownerStack~); // Logs the string captured above
  }

  document.addEventListener('click', handleEvent);
  return () => document.removeEventListener('click', handleEvent);
});
```

### `Price` names its owner during render

Because rendering is one of the four contexts where `captureOwnerStack()` succeeds, `Price` can capture its own ownership trace the moment it receives an invalid prop. Instead of crashing, `Price` logs an error alongside its Owner Stack and displays a graceful fallback message:

```jsx title="src/Price.jsx"
import { captureOwnerStack } from 'react';

export default function Price({ amount }) {
  if (amount === undefined) {
    console.error('Price got no amount', ~captureOwnerStack()~); // During render: names the component that wrote the Price tag
    return <span>Price unavailable</span>;
  }
  return <span>${amount.toFixed(2)}</span>;
}
```

With this safeguard in place, the application no longer unmounts. The Mug item displays its price correctly, while the Cap item shows an informative message:

```page caption="The shop after Price stops throwing: the Cap row shows Price unavailable."
heading: Shop
line: Mug $12.00 | good
line: Cap Price unavailable | bad
```

The console pinpoints the exact line where the defective tag was authored:

```devconsole width=full caption="The Console after Price logs its Owner Stack during render."
x Price got no amount
  at http://localhost:5173/src/ProductList.jsx:16:19
  at Array.map
  at ProductList
  at App
```

### The same idea in an error overlay

Development tooling uses this exact technique to construct error overlays, the visual modal panels displayed over a page when runtime errors occur. By wrapping `console.error`, development tools ensure that any error logged during render or event handling automatically includes the Owner Stack of the responsible component. In the React documentation, `onConsoleError` represents the function responsible for rendering the overlay:

```js title="Adding the Owner Stack to every console.error"
const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args); // The Console still shows the error
  const ownerStack = ~captureOwnerStack()~; // The owners of the component that logged
  onConsoleError({ consoleMessage: args[0], ownerStack });
};
```

The React documentation includes an important caveat. Because `console.error` accepts multiple arguments, a production-grade overlay must handle all passed arguments rather than inspecting only the first.

---

## PRINCIPLE | `captureOwnerStack` in production: `undefined`, so the report sends `errorInfo.componentStack`

> [!PRINCIPLE]
> **Principle 5: Production: Report the Component Stack, and Keep captureOwnerStack Behind a Check**
>
> *`captureOwnerStack` exists only in development builds, so reach it through `import * as React` inside a `process.env.NODE_ENV !== 'production'` check, and send `errorInfo.componentStack` to production reports.*
>
> The Owner Stack is a development tool. A named import of `captureOwnerStack` is `undefined` in production, and calling it throws the very error you meant to report. In production, the report sends the Component Stack from the root options, and sourcemaps turn its short minified names back into your names.
>
> **DO THIS:**
> ```jsx
> import * as React from 'react';
> if (~process.env.NODE_ENV !== 'production'~) { // Skipped in production
>   console.log(React.captureOwnerStack());
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { captureOwnerStack } from 'react';
> console.log(~captureOwnerStack()~); // **WRONG:** undefined in production, so this line throws a TypeError
> ```

Our storefront operates as expected in development mode. Next, consider building the application for production deployment (Lesson 47). The React documentation makes a critical distinction: Owner Stacks are supported exclusively in development builds. Only the development build of React exports `captureOwnerStack`. In production builds, that export is omitted, leaving the identifier `undefined`.

There are two ways to import `captureOwnerStack` in application code. The first approach is the named import used in our earlier examples:

```jsx title="A named import of captureOwnerStack"
import { ~captureOwnerStack~ } from 'react'; // undefined in a production build

captureOwnerStack();
```

The second approach uses a namespace import combined with an environment guard:

```jsx title="A namespace import, with the call behind a check"
import * as ~React~ from 'react'; // Every export of react, collected in one object

if (~process.env.NODE_ENV !== 'production'~) { // Skipped in a production build
  React.captureOwnerStack(); // Runs only in development
}
```

### VS | The named import vs. the namespace import: both give the Owner Stack in development, only the namespace import survives production

**It may look the same, or work the same at first, but it is NOT the same thing!**
- **Using a named import**, the production bundle contains no `captureOwnerStack` export. The imported variable evaluates to `undefined`. Attempting to call `undefined` as a function throws an immediate `TypeError` at runtime.
- **Using a namespace import**, the import statement gathers all exports from the `react` module into a single namespace object named `React`. The code accesses `React.captureOwnerStack` dynamically as an object property. When placed behind an environment guard, bundlers eliminate the entire block during production compilation.

`process.env.NODE_ENV` is the standard environment variable compared against `'production'`. In production builds, bundlers replace this expression with the literal string `'production'`, allowing minifiers to strip out development-only branches completely.

### Why the production shop goes blank again

Our implementation of `Price` in Principle 4 relied on a direct named import. Consequently, when built for production, the application crashes on the exact line intended to handle missing data. Here is the failure sequence when a user opens the production storefront:
1. React renders `Price` for the Cap item, where the price amount is `undefined`.
2. `Price` attempts to invoke `captureOwnerStack()`. Because the export does not exist in production, the identifier is `undefined`, and the call throws a `TypeError`.
3. With no Error Boundary present, React unmounts the whole component tree, presenting the user with an empty screen once again.

To prevent this crash, `Price` must adopt a namespace import protected by an environment check. It continues to display the fallback message in production without triggering an unhandled exception:

```jsx title="src/Price.jsx"
import * as React from 'react';

export default function Price({ amount }) {
  if (amount === undefined) {
    if (~process.env.NODE_ENV !== 'production'~) { // The Owner Stack exists only in development
      console.error('Price got no amount', React.captureOwnerStack());
    }
    return <span>Price unavailable</span>;
  }
  return <span>${amount.toFixed(2)}</span>;
}
```

### What a production error report can send

The interview question explores how to capture the Owner Stack in production environments. The answer is that you cannot, because the feature is omitted from production builds. A production monitoring setup must capture and report the Component Stack instead, using the root options.

Most engineering teams forward client runtime errors to a dedicated error monitoring platform. In our project, a dedicated module represents this external monitoring service by logging reports to the console:

```js title="src/reportError.js"
export function reportError({ error, componentStack }) {
  console.error(~error, componentStack~); // A real app sends both to its error reporting service
}
```

The application entry point from Principle 3 also used a named import, so it must likewise transition to a namespace import. It forwards all root errors to `reportError`, while restricting Owner Stack logging strictly to development:

```jsx title="src/main.jsx"
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { reportError } from './reportError.js';

function logError(error, errorInfo) {
  reportError({ error, componentStack: ~errorInfo.componentStack~ }); // Sent in development and in production
  if (process.env.NODE_ENV !== 'production') {
    console.log(~React.captureOwnerStack()~); // Logged in development only
  }
}

createRoot(document.getElementById('root'), {
  onUncaughtError: logError,
  onCaughtError: logError,
}).render(<App />);
```

The information collected by error reports differs between build environments:

| What the report holds | In development | In production |
| :--- | :--- | :--- |
| **`errorInfo.componentStack`** | The real names: `Price`, `li`, `ul`, `ProductList`, `main`, `Layout`, `App` | **Minified** names, such as `m` for `Price` and `g` for `ProductList`; HTML tags such as `li` keep their names |
| **The Owner Stack** | The `<Price />` line in the file of `ProductList`, then `ProductList` and `App` | None: `captureOwnerStack` is `undefined` in the production build |

**Minification** is the process where production build tools compress JavaScript files by shortening variables and function names to one or two characters. Because of this transformation, a production Component Stack displays single-letter identifiers such as `m` or `g` instead of original component names.

Production crash reporters decode these minified identifiers using **sourcemaps**. Sourcemaps are auxiliary metadata files generated alongside the production bundle, mapping minified identifiers and coordinates back to original source code locations. You decode component stacks using sourcemaps in the same manner as standard JavaScript runtime traces.

```tree caption="What an error report can send in development and in production."
The same error report in the two builds
- +Development | `errorInfo.componentStack` with **real names** | `captureOwnerStack` with **the owners**
- !Production | `errorInfo.componentStack` with **minified names**, decoded with **sourcemaps** | **No Owner Stack**: `captureOwnerStack` is `undefined`
```

The React documentation highlights one additional production practice: filtering out known or expected errors before dispatching data to remote logging services. In official examples, `reportCaughtError` represents the external logging client:

```jsx title="The production sample from React's docs"
onCaughtError: (error, errorInfo) => {
  if (~error.message !== "Known error"~) { // Skip an error the team already knows about
    reportCaughtError({ error, componentStack: errorInfo.componentStack });
  }
},
```

---

## All 5 Principles Together

### The complete project

The shop now has six files under `src/`: the five from the start, and the report file from Principle 5. `App` owns the product list, the product list owns every `Price`, and in development the logs name them:

```files title="shop: File Explorer" caption="The finished shop: six files inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` and passes `onUncaughtError` and `onCaughtError` to `createRoot`
  reportError.js | named export | Exports `reportError`, which stands in for an error reporting service
  App.jsx | parent | Writes `<Layout><ProductList /></Layout>`
  Layout.jsx | default export | Returns `<main>` with the `Shop` heading and its `children`
  ProductList.jsx | default export | Writes one `<li>` with a `<Price />` per product
  Price.jsx | default export | Shows one amount, or `Price unavailable` with its Owner Stack in development
```

```jsx title="src/main.jsx"
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { reportError } from './reportError.js';

function logError(error, errorInfo) {
  reportError({ error, componentStack: ~errorInfo.componentStack~ }); // Principle 5: the Component Stack goes to the report
  if (process.env.NODE_ENV !== 'production') {
    console.log(~React.captureOwnerStack()~); // Principles 3 and 5: the Owner Stack, in development only
  }
}

createRoot(document.getElementById('root'), {
  onUncaughtError: logError,
  onCaughtError: logError,
}).render(<App />);
```

```js title="src/reportError.js"
export function reportError({ error, componentStack }) {
  console.error(~error, componentStack~); // Stands in for an error reporting service
}
```

```jsx title="src/App.jsx"
import Layout from './Layout.jsx';
import ProductList from './ProductList.jsx';

export default function App() {
  return (
    <Layout>
      ~<ProductList />~ {/* Principle 1: App is the owner of ProductList */}
    </Layout>
  );
}
```

```jsx title="src/Layout.jsx"
export default function Layout({ children }) {
  return (
    <main>
      <h1>Shop</h1>
      ~{children}~ {/* Principle 1: Layout only forwards what App wrote */}
    </main>
  );
}
```

```jsx title="src/ProductList.jsx"
import Price from './Price.jsx';

const products = [
  { id: 1, name: 'Mug', price: 12 },
  { id: 2, name: 'Cap' },
];

export default function ProductList() {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name} ~<Price amount={product.price} />~ {/* Principle 2: ProductList writes the tag, React calls Price */}
        </li>
      ))}
    </ul>
  );
}
```

```jsx title="src/Price.jsx"
import * as React from 'react';

export default function Price({ amount }) {
  if (amount === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Price got no amount', ~React.captureOwnerStack()~); // Principle 4: during render, the Owner Stack names ProductList
    }
    return <span>Price unavailable</span>;
  }
  return <span>${amount.toFixed(2)}</span>;
}
```

In development, the user sees both rows, and the Console names the component that passed no amount:

```page caption="The finished shop in development: the Mug price and the Cap row without a price."
heading: Shop
line: Mug $12.00 | good
line: Cap Price unavailable | bad
```

```devconsole width=full caption="The Console of the finished shop in development."
x Price got no amount
  at http://localhost:5173/src/ProductList.jsx:16:19
  at Array.map
  at ProductList
  at App
```

### The order in which React calls the components

When the page loads, React executes `App` first. `App` evaluates its JSX and returns the `Layout` element containing the product list, prompting React to execute that layout next. The layout renders its container and returns the `ProductList` element, which React executes in turn. Finally, React invokes `Price` once for each catalog item:

```tree caption="The component tree of the shop, in the order React calls each component, with the owner of each one."
`App` [1. Called first] | **Root component**, mounted by `main.jsx` | Writes the `Layout` and `ProductList` tags
- +`Layout` [2. Called second] | Owner: **`App`** | Returns `<main>` with the heading and its `children`
  - +`ProductList` [3. Called third] | Parent: **`Layout`**; owner: **`App`** | Writes one `<li>` and one `Price` tag per product
    - +`Price` for Mug [4. Called fourth] | Owner: **`ProductList`** | Returns `$12.00`
    - !`Price` for Cap [5. Called fifth] | Owner: **`ProductList`** | Gets no amount, logs its Owner Stack, returns `Price unavailable`
```

| Principle | What the developer writes or reads | What it tells about the Cap error |
| :--- | :--- | :--- |
| **1. Owner and parent** | `<Layout><ProductList /></Layout>` in `App` | `App` owns `ProductList`; `Layout` only holds it |
| **2. The error's own stack** | `error.stack` in the Console | `Price`, then React's functions; `ProductList` is missing |
| **3. Two stacks** | `errorInfo.componentStack` and `captureOwnerStack()` in `onUncaughtError` | Every parent of `Price`, against only `ProductList` and `App` |
| **4. When it answers** | `captureOwnerStack()` during render in `Price` | `ProductList` first; in a `setTimeout` callback, `null` |
| **5. Production** | `React.captureOwnerStack()` behind a `process.env.NODE_ENV` check | No Owner Stack; the report sends a minified Component Stack |

Remember the foundational takeaway of this lesson. **An error report names the component that threw, but the underlying bug usually resides in the component that wrote its tag. In development, `captureOwnerStack()` names that owning component on its first line.**

---

## For the Interview

> **The Interview Question:** How does captureOwnerStack pinpoint which component caused a render or error?

### How to Answer Clearly in 30 Seconds

"`captureOwnerStack()` returns the Owner Stack: a trace of the components whose JSX authored the elements leading to the currently executing component. The owner of an element is the component whose JSX code created its tag. This differs from the parent component: a layout component that renders `children` acts as a parent, but is not the owner. Three core characteristics make this tool essential:
1. **The runtime call stack cannot identify the owner.** Because React reconciler invokes components during rendering, the JavaScript call stack lists only the throwing component followed by React internal library frames.
2. **The Component Stack contains extra hierarchy.** `errorInfo.componentStack` lists every structural container and DOM tag in the tree. The Owner Stack filters out intermediate wrappers, revealing the component that supplied the bad props on its first line.
3. **It is strictly a development tool.** It functions during render passes, within Effects, inside synthetic event handlers, and inside root error callbacks, returning `null` inside timers or native event listeners. It is omitted from production builds, so it must be accessed through a guarded namespace import, while production logging relies on `errorInfo.componentStack` decoded via sourcemaps."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What is the difference between the owner and the parent of a component?"**
   The parent represents visual nesting in the rendered tree, whereas the owner is the component whose JSX markup created the element. In our store example, `App` authors the `ProductList` tag nested inside `Layout`. `Layout` is the parent of `ProductList` because it places `ProductList` within its `<main>` container. `App` is the owner because its JSX authored the element. A component that merely forwards `children`, as well as native DOM components like `<main>` or `<li>`, are parents rather than owners.
2. **"An error was thrown inside a tree of two hundred components, and the stack shows only library frames. What does the Owner Stack reveal?"**
   The Owner Stack reveals which component authored the tag for the component that threw. The standard error stack lists only the throwing component followed by React internal methods, because React invoked the component rather than its owner. The Owner Stack starts with the direct owner, followed by that owner's creator, all the way to the root. It strips out layout wrappers that only forwarded elements, sibling components, and the crashing leaf itself. Its first line pinpoints the exact file and line number requiring correction.
3. **"How do you log the Owner Stack in production?"**
   You cannot, because Owner Stacks are disabled in production builds. The production build of React does not export `captureOwnerStack`, causing named imports to evaluate to `undefined`. For production logging, configure `onUncaughtError`, `onCaughtError`, and `onRecoverableError` in `createRoot`, and forward `error` alongside `errorInfo.componentStack` to your monitoring platform. Because production component names are minified into single letters, decode the Component Stack using sourcemaps, matching how standard JavaScript stack traces are processed.

```tree caption="Interview comparison: the three lists of names for one error."
Three lists of names for one error
- !The error's own stack [`error.stack`] | The component that threw, **then React's functions** | Cannot name the owner, because **React called** the component
- +The Component Stack [`errorInfo.componentStack`] | **Every parent**, from the failing component up to the root | Available **in production**, with minified names
- +The Owner Stack [`captureOwnerStack`] | **Only the owners**, starting with the component that wrote the tag | **Development only**; `null` outside the code React runs
```\n