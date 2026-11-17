# Lecture 111: Why 'use client' and 'use server' Are Directives, and Who Reads Them

*(Why does one string at the top of a file decide where the code runs?)*

> INTERVIEW QUESTION | ❱ CORE | Why are 'use client' and 'use server' called directives, and who reads them?

---

## VS | `'hello'` vs. `'use client'`: the same string to JavaScript, an order to the bundler

> In standard JavaScript, an isolated string literal like `'hello'` has no runtime effect: the engine evaluates it and immediately discards it. **The strings `'use client'` and `'use server'` are directives, read as build instructions by the bundler when it compiles the application**. That is why you never import them, and why they only take effect at the very top of a file where the bundler looks for them.

Consider the directive `'use strict'`. It is a built-in JavaScript directive created long before React. Placing `'use strict'` on line 1 instructs the JavaScript engine to evaluate the file in strict mode. The syntax requires no function call and no import statement. It is simply a string literal sitting at the top of the file.

```js title="Plain JavaScript: a directive that the engine reads"
~'use strict';~ // The JavaScript engine reads this line and switches the file to strict mode
```

React adopted this exact syntax pattern and assigned it a new reader. The directive `'use client'` is also a string literal positioned on line 1. To the browser JavaScript engine, this string performs no action. The engine evaluates the text and discards it, exactly like any unused string.

```jsx title="React: a directive that the bundler reads"
~'use client';~ // The bundler reads this line while it builds the app, and sends the file to the browser
```

The tool that acts on this string is the application bundler. A bundler does not execute component logic. It scans source files, traces imports, and determines which files belong in the client bundle. When the bundler detects `'use client'` on line 1, it treats that string as an order to package the file for the browser. An arbitrary string like `'hello'` carries no special meaning.

Only bundlers designed for React Server Components recognize these directives. You find these bundlers inside modern full-stack frameworks like the Next.js App Router (as seen in Lesson 46). The official React documentation explains: "Directives provide instructions to bundlers compatible with React Server Components."

Keep this central principle in mind throughout this lesson:

**A directive is a plain string at the very top of a file: JavaScript throws it away, and the bundler reads it as an order.**

> [!DEFINITION]
> **Bundler.** [REVIEW] A bundler is the build tool that packages application source code for execution.
> 1. It scans source files, resolves every `import` statement, and creates an application dependency graph.
> 2. In full-stack frameworks, it splits code into server bundles and browser assets based on directives.
> 3. Vite acts as the bundler and development server in a standard client-side React application (Lesson 07).

> [!DEFINITION]
> **Server Component.** [REVIEW] A Server Component is a component that renders exclusively on the server runtime.
> 1. Components default to Server Components whenever their source file contains no directive at the top.
> 2. It runs during server rendering, accessing databases and server files directly without exposing code to clients.
> 3. Its source code never downloads to the browser, transmitting only the rendered output (Lesson 101).

> [!DEFINITION]
> **Client Component.** [REVIEW] A Client Component is a component in a file marked with `'use client'` that executes in the browser.
> 1. The bundler includes the component implementation in the client JavaScript bundle.
> 2. It runs on the client device, enabling interactivity through browser events and client state.
> 3. It can access browser APIs and use client Hooks such as `useState` (Lesson 106).

> [!DEFINITION]
> **Server Function.** [REVIEW] A Server Function is an asynchronous function that executes on the server and can be invoked from client code.
> 1. It is declared inside a file marked with `'use server'` or marked at the top of its own function body.
> 2. The client bundle receives an opaque reference stub rather than the actual server implementation.
> 3. Invoking the stub sends an HTTP request across the network, executes server logic, and returns the result (Lesson 110).

> [!DEFINITION]
> **Directive.** [NEW] A directive is a standalone string literal positioned at the beginning of a file or function that instructs a build tool or engine how to process that code.
> 1. JavaScript engines discard unassigned string expressions without raising syntax errors.
> 2. A specialized build tool inspects the top of the file before bundling and treats recognized strings as configuration commands.
> 3. JavaScript engines interpret `'use strict'` to enable strict evaluation, while React bundlers interpret `'use client'` and `'use server'` to divide code between client and server (Lesson 111).

### The Same Form, Two Readers

The syntax remains identical: a standalone string literal placed at the very beginning of a file. Only the reader changes:

```tree caption="The same form, a string at the very beginning of a file, read by two different tools."
Who reads a directive
- +`'use strict'` [JavaScript's own directive] | Read by the **JavaScript engine** | Switches the file to **strict mode**
- +`'use client'` and `'use server'` [React's two directives] | Read by the **bundler** of a framework that supports React Server Components | Decides **which code goes to the browser** and **which code stays on the server**
```

### What Goes Wrong When the Bundler Misses the Line

When a bundler fails to detect `'use client'` at the head of an interactive component file, the entire module defaults to a Server Component:
1. The bundler retains the file on the server instead of packaging it for client download.
2. During rendering, the server encounters interactive elements like event handlers or client Hooks.
3. React documentation explains: "Server Components cannot support interaction as event handlers must be registered and triggered by a client." And: "Server Components cannot use most Hooks."
4. The framework halts with an error explaining that `useState` cannot run inside a Server Component (as seen in Lesson 106).

### Where Readers Usually Go Wrong

1. **Looking for `'use client'` in the React package exports.** It is not an export, a component, or a JavaScript function. The official React documentation lists directives on a dedicated page separate from runtime APIs.
2. **Placing the directive inside a component or below import statements.** When placed below code, the string becomes dead code that the bundler completely ignores.
3. **Assuming `'use server'` designates a Server Component.** The official React documentation warns: "A common misunderstanding is that Server Components are denoted by `"use server"`, but there is no directive for Server Components. The `"use server"` directive is used for Server Functions."

### Where Each Directive Can Stand

The directive `'use client'` has one valid position, whereas `'use server'` supports two distinct locations:
1. **`'use client'` at the top of a file**, above all imports. It has no individual function form because client bundling occurs at file boundaries.
2. **`'use server'` at the top of a file**, such as an actions module. Every exported function in that file becomes a Server Function. The React documentation requires this file-level form whenever client code imports the function directly.
3. **`'use server'` at the top of an `async` function body**, declared inside a Server Component. The Server Component can pass that function down to a Client Component as a prop (as seen in Lesson 107).

```tree caption="Where each of React's two directives can stand."
Where React's directives can stand
- +`'use client'` at the top of a file [`AddToCartButton.jsx`] | The file and everything it imports become **client code** | It has **no function form**
- +`'use server'` at the top of a file [`actions.js`] | Every export becomes a **Server Function** | Client code can **import** it
- +`'use server'` at the top of an `async` function body | One function inside a **Server Component** | Reaches a Client Component **as a prop**
```

## SECTION | The Product Page with an Add to Cart Button

Consider a product page in an online store. The page presents the title Headphones, an `Add to cart` button, and a count reading `In cart: 0`. When the user clicks the button, the counter updates to `In cart: 1`.

::: row caption="The product page when the user opens it, and after one click on Add to cart."
::: col title="When the page opens"
```page size=mini
heading: Headphones
line: [Add to cart]
line: In cart: 0
```
:::
::: col title="After one click" tone=good
```page size=mini
heading: Headphones
line: [Add to cart]
line: In cart: 1 | good
```
:::
:::

The button requires `useState` and `onClick`, so it must execute in the browser. The product title requires no interactivity, so it remains on the server. We construct this page using four files. Three of these files begin with different header lines: no directive, `'use client'`, and `'use server'`.

```files title="store: the product page" caption="The four files of the product page: a database stand-in, a file of Server Functions, one Client Component, and one Server Component."
src/
  db.js | stand-in | Plays the database: `db.cart.add(productId)` saves one item in the cart
  actions.js | Server Functions | Starts with `'use server'` and exports `addToCart`
  AddToCartButton.jsx | Client Component | Starts with `'use client'`; holds `count`, the button, and the `In cart:` line
  ProductPage.jsx | Server Component | No directive; shows `Headphones` and renders `<AddToCartButton />`
```

The `db.js` file serves as a local mock (as seen in Lesson 110). It simulates database persistence in memory so the application runs without configuring an external database server.

**PRINCIPLES:** A directive is a plain string at the very top of a file: JavaScript throws it away, and the bundler reads it as an order. Four principles follow:
1. **`'use client'`: the bundler reads it while it builds the app, and JavaScript throws it away.** There is nothing to import, and nothing in the line runs.
2. **`'use client'` above every import: only at the very beginning of the file is the string a directive.** One line lower, the bundler does not see it, and the button becomes a Server Component.
3. **`'use client'` and `'use server'`: two different orders to the bundler, and none for a Server Component.** The first sends a file to the browser. The second keeps a function on the server and gives the browser a reference.
4. **`'use client'` in a plain Vite app: no tool reads it, so the page stays the same.** Every file there already runs in the browser.

---

## PRINCIPLE | `'use client'`: the bundler reads it while it builds the app, and JavaScript throws it away

> [!PRINCIPLE]
> **Principle 1: A Directive: `'use client'` Is a String JavaScript Throws Away**
>
> *`'use client'` is a plain string at the very beginning of a file; JavaScript drops it, and the bundler of a framework that supports React Server Components reads it as an order while it builds the app.*
>
> An interactive button must execute in the browser, but standard JavaScript provides no syntax to move a file across network environments. React delegates this task to the bundler during the build step. The bundler reads the file text before runtime, detects `'use client'`, and includes the file in the client bundle. When the browser executes the file, the JavaScript engine ignores the string. The directive requires no import and cannot be placed inside components because it configures module packaging for the bundler.
>
> **DO THIS:**
> ```jsx
> ~'use client';~ // A bare string on line 1: the bundler reads it
>
> import { useState } from 'react';
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function AddToCartButton() {
>   ~'use client';~ // **WRONG:** inside a component it is only a string; the bundler reads 'use client' only at the top of a file
>   const [count, setCount] = useState(0);
>   return <button onClick={() => setCount(count + 1)}>Add to cart</button>;
> }
> ```

Developers frequently ask why a string that does not execute can change application behavior. The directive does not alter JavaScript runtime logic. It alters how the bundler packages and distributes the file.

Consider a minimal component with `'use client'` placed on line 1:

```jsx title="Hello.jsx"
~'use client';~ // The bundler reads this line; the component never sees it

export default function Hello() {
  return <p>Hello, John</p>;
}
```

Whether line 1 exists or not, the component renders the identical paragraph element. The directive does not change component output. It changes only which bundle receives the source code.

### Two Moments: the Build, Then the Browser

The bundler processes the directive during compilation long before the browser executes any code. On our product page, line 1 of the button file meets two different readers at two distinct moments:
1. **During application compilation**, the bundler reads the source text of the button file before code runs.
2. It discovers the exact string `'use client'` positioned at the top of the file.
3. When the server component imports this file, the bundler marks that import as a client boundary (as seen in Lesson 106).
4. The bundler includes the button file and its dependencies in the client bundle.
5. **Later in the browser**, the client JavaScript engine executes the downloaded bundle. It encounters the string on line 1 and ignores it, exactly like any unused string literal.

The architecture split does not occur at runtime inside JavaScript. It occurs ahead of time when the bundler analyzes source files.

```tree dir=right caption="The two moments when line 1 of AddToCartButton.jsx is read, and what each reader does with it."
Who reads `'use client'`, and when
- +1. While the app is built [The bundler] | Reads the **text** of the file | Finds `'use client'` and **sends the file to the browser**
- +2. While the page runs [The JavaScript engine] | Runs the file in the browser | Reads the string and **throws it away**
```

### Nothing to Import

Where is `'use client'` declared? No library exports it. Contrast the directive with a React Hook:

```jsx title="A directive is not imported; a Hook is"
~'use client';~ // No import: plain text that only the bundler understands
import { ~useState~ } from 'react'; // A function that React exports, and your component calls
```

You never import `'use client'` because React does not export it as a runtime function. It is neither a Hook nor a component configuration object. It is a module header recognized exclusively by the bundler.

Developers often mistake `'use client'` for a runtime React API. They search React documentation for export signatures or attempt to call it inside functions. The official React documentation places directives in their own dedicated section, noting that directives instruct bundlers rather than runtime engines.

### VS | `'use strict'` vs. `<StrictMode>`: both say strict, only one is a directive

Two naming conventions in the React ecosystem sound similar:

```jsx title="'use strict' at the top of a file vs. StrictMode around the app"
~'use strict';~ // A directive: the JavaScript engine reads it and switches the file to strict mode
<~StrictMode~><App /></StrictMode> {/* A React component: it checks our components in development */}
```

**These two tools serve entirely different purposes:**
- **`'use strict'`** is an ECMAScript directive parsed by the JavaScript engine to enforce strict runtime checks.
- **`<StrictMode>`** is a built-in React component that executes components twice during development to detect side-effect bugs (as seen in Lesson 47). It is not a directive.

### Our Product Page: `ProductPage.jsx` and `AddToCartButton.jsx`

Now examine the product page implementation. The button file manages state and handles user clicks:

```jsx title="src/AddToCartButton.jsx"
~'use client';~ // The bundler sends this file to the browser

import { useState } from 'react';

export default function AddToCartButton() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
      <p>In cart: {count}</p>
    </>
  );
}
```

The page file contains no directive, so the framework treats it as a Server Component by default (as seen in Lesson 101):

```jsx title="src/ProductPage.jsx"
import ~AddToCartButton~ from './AddToCartButton'; // A server file imports a 'use client' file: the boundary

export default function ProductPage() {
  return (
    <main>
      <h1>Headphones</h1>
      <AddToCartButton />
    </main>
  );
}
```

```page caption="The product page built from ProductPage.jsx and AddToCartButton.jsx, after the user clicks Add to cart once."
heading: Headphones
line: [Add to cart]
line: In cart: 1 | good
```

The rendered HTML conceals this division. Both the `<button>` and `<p>` elements render into a coherent DOM structure. The boundary exists entirely in asset distribution, organized ahead of time by the bundler.

Remember: `'use client'` is not executable code. It is a build directive read exclusively by the bundler.

---

## PRINCIPLE | `'use client'` above every import: only at the very beginning of the file is the string a directive

> [!PRINCIPLE]
> **Principle 2: The Place: A Directive Counts Only at the Very Beginning**
>
> *Put `'use client'` and `'use server'` at the very beginning of the file, above every import, with only comments before them; `'use server'` may also open an `async` function body.*
>
> The bundler scans for directives exclusively at the top of a file. Placed anywhere else, the string acts as an inert expression, and the bundler builds the file as a Server Component. The application crashes when `useState` runs, but the error message names the Hook rather than the misplaced directive. Whenever an error states that a Hook cannot run inside a Server Component, verify line 1 of the component file first.
>
> **DO THIS:**
> ```jsx
> ~'use client';~ // Line 1: the bundler sees a directive
> import { formatPrice } from './format';
> import { useState } from 'react';
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { formatPrice } from './format';
> ~'use client';~ // **WRONG:** below an import: only a string, and the file stays server code
> ```

Compare the top of the button file under two different line orders:

```jsx title="'use client' above the import"
~'use client';~ // At the very beginning of the file: a directive
import { useState } from 'react';
```

```jsx title="'use client' below the import"
import { useState } from 'react';
~'use client';~ // **WRONG:** below an import: only a string
```

**The order of these lines changes the entire build output.** Both code samples contain identical statements, but only the first file establishes a client boundary.

### Why the Place Matters

Directives must sit at line 1, above all imports, enclosed in single or double quotes, with only comments permitted above them (as seen in Lesson 106). The technical reason lies in how parsers evaluate source files.

A bundler does not execute code when parsing dependencies. It inspects source code sequentially, and the formal directive prologue terminates as soon as it encounters the first executable statement or import. If an `import` statement precedes `'use client'`, the prologue is already closed. The parser treats subsequent strings as meaningless expression statements.

JavaScript strict mode operates under this exact grammar rule. A `'use strict'` string placed below variable declarations fails to enable strict mode.

The official React documentation specifies the exact placement requirements for both directives:
- `'use client'` "must be at the very beginning of a file, above any imports or other code".
- `'use server'` "must be at the very beginning of their function or module; above any other code including imports".

### `'use server'` Has a Second Beginning

Notice the phrase "their function or module" in the documentation specification. For `'use server'`, the opening line of an `async` function body is also a valid location. This function-level directive operates inside Server Components (as seen in Lesson 107):

```jsx title="'use server' at the top of an async function body"
async function addToCart(productId) {
  ~'use server';~ // The very beginning of this function: a directive
  await db.cart.add(productId);
}
```

The directive `'use server'` supports two valid placements: the top of a file or the beginning of an `async` function body. In contrast, `'use client'` supports only the file level. Writing `'use client'` inside a function body has no effect.

### The Mistake: a New Import on Top

Adding an import above the directive breaks component interactivity:
1. A developer adds a formatting helper import to display prices, placing the `import` on line 1 above `'use client'`.
2. Both lines represent valid JavaScript syntax, so standard linters report no syntax errors.
3. The bundler encounters an `import` on line 1, terminating the directive prologue before reaching `'use client'`.
4. The bundler treats the module as server code, compiling the button as a Server Component.
5. At runtime, the server attempts to execute `useState` and throws an error.
6. The developer inspects the file, sees `'use client'` present, and struggles to identify why the Hook failed.

```jsx title="src/AddToCartButton.jsx" bad="1"
import { formatPrice } from './format';
~'use client';~ // **WRONG:** a new import above it: the bundler no longer sees a directive

import { useState } from 'react';
```

The fix requires moving `'use client'` back to line 1, positioned above every import statement.

Remember: a directive functions as an instruction only at the very top of a file. Placed below other code, it is merely an inert string.

---

## PRINCIPLE | `'use client'` and `'use server'`: two different orders to the bundler, and none for a Server Component

> [!PRINCIPLE]
> **Principle 3: Two Orders: `'use client'` Sends Code to the Browser, `'use server'` Keeps It on the Server**
>
> *Both directives are read by the same bundler, but `'use client'` sends a file and everything it imports to the browser, and `'use server'` keeps each function on the server and gives the browser only a reference; a Server Component needs no directive.*
>
> Our product page requires three runtime locations: the main page on the server, the button in the browser, and cart mutations in the database. The bundler requires distinct instructions for each piece. The directive `'use client'` marks browser code. The directive `'use server'` exposes a server function to client callers. The container page requires no directive because server execution is the default architecture.
>
> **DO THIS:**
> ```js
> ~'use server';~ // actions.js: addToCart stays on the server; the browser gets a reference
>
> export async function addToCart(productId) {
>   await db.cart.add(productId);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~'use server';~ // **WRONG:** ProductPage.jsx is a component file; there is no directive for Server Components
>
> export default function ProductPage() {
>   return <main><h1>Headphones</h1></main>;
> }
> ```

Observe the header lines of our three application files:

```jsx title="The first line of ProductPage.jsx, AddToCartButton.jsx, and actions.js"
~import AddToCartButton from './AddToCartButton';~ // ProductPage.jsx: no directive, a Server Component
~'use client';~ // AddToCartButton.jsx: send this file, and what it imports, to the browser
~'use server';~ // actions.js: keep these functions on the server, give the browser a reference
```

### VS | `'use client'` vs. `'use server'`: the same reader, two different orders

Both directives are processed by the same tool during compilation. Both adopt identical string syntax. However, they convey opposing instructions:
- **`'use client'`** instructs the bundler to package the file for browser execution. The official React documentation states: "`'use client'` lets you mark what code runs on the client." The bundler establishes a client boundary where this module is imported (as seen in Lesson 106).
- **`'use server'`** instructs the bundler to keep function implementations on the server while creating network endpoints. The official React documentation notes: "`'use server'` marks server-side functions that can be called from client-side code." The bundler excludes the function body from client bundles, replacing it with an RPC reference stub (as seen in Lesson 107).

**These directives are not symmetrical opposites.** The directive `'use server'` does not define a Server Component. Server Components require no directive whatsoever. As the official React documentation emphasizes: "there is no directive for Server Components."

```tree caption="Three first lines on one product page, and the order each one gives the bundler."
What the bundler does with each first line
- +No directive [`ProductPage.jsx`] | A **Server Component** by default | Its code **stays on the server**
- +`'use client'` [`AddToCartButton.jsx`] | Send the file **and everything it imports** to the browser | Its code **runs in the browser**
- +`'use server'` [`actions.js`] | Keep each exported function **on the server** | The browser gets **a reference**, and a call **sends a request**
```

### Our Product Page: `actions.js` and `db.js`

Now expand the product page functionality. Clicking `Add to cart` must persist the selected product to the server cart. The database mock maintains items in an in-memory array:

```js title="src/db.js"
const cart = [];

export const db = {
  cart: {
    async add(productId) {
      cart.push(productId);
    },
  },
};
```

The actions module declares the Server Function:

```js title="src/actions.js"
~'use server';~ // Order to the bundler: keep addToCart and db.js on the server

import { db } from './db';

export async function addToCart(productId) {
  await db.cart.add(productId);
}
```

The button component imports `addToCart` and invokes it within an event listener. The invocation is wrapped in `startTransition` to track asynchronous execution state (as seen in Lesson 110):

```jsx title="src/AddToCartButton.jsx"
'use client';

import { useState, startTransition } from 'react';
import { ~addToCart~ } from './actions'; // In the browser, addToCart is a reference, not the code

export default function AddToCartButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    startTransition(() => ~addToCart('headphones')~); // Sends a request; the server runs the real addToCart
  }

  return (
    <>
      <button onClick={handleClick}>Add to cart</button>
      <p>In cart: {count}</p>
    </>
  );
}
```

The count display continues to read from local component state, so the interface updates immediately. The difference is that each click now triggers a background server mutation.

### A Browser File That Imports a Server File

The button component executes in the browser and imports a module that interacts with the database. Yet the database implementation never reaches the client bundle:
1. The bundler identifies `'use server'` at the top of the actions module during the build.
2. It excludes the concrete implementation of `addToCart`, along with the imported database driver, from the client bundle.
3. It generates an opaque client reference stub and places that stub into the client bundle.
4. The client import resolves to this network reference stub.
5. When the user clicks the button, the stub initiates an HTTP request, prompting the server to execute the genuine function.

You can inspect this client stub directly by logging the imported function inside the button component:

```jsx title="Logging addToCart in AddToCartButton.jsx"
console.log(~addToCart~); // Prints a short function that React made, not the code of addToCart
```

```devconsole caption="The Console in the browser after logging addToCart: a short function, not the code of addToCart."
(...args) => server(...args)
```

The browser receives only a lightweight stub. The stub forwards function arguments to React, which packages them into an HTTP request. The client bundle contains neither database queries nor server implementation logic.

On the server, the function reference carries metadata generated by React and the compiler. The property `$$typeof` identifies the object as a server reference, and `$$id` records its unique endpoint identifier. Application code never creates these properties directly.

```tree dir=right caption="What the bundler puts in the browser files for an import from a 'use server' file."
From `addToCart` in `actions.js` to a click in the browser
- +1. The bundler reads `'use server'` [`actions.js`] | Keeps the **body** of `addToCart` and **`db.js`** on the server
- +2. The browser files [`import { addToCart }`] | Hold a **reference** to `addToCart` | Not its code
- +3. The click [`handleClick`] | The reference **sends a request** | The server runs **the real `addToCart`**
```

### The Mistake: `'use server'` on `ProductPage.jsx`

Seeing that `'use client'` designates client components, developers sometimes place `'use server'` at the top of page files to denote Server Components:

```jsx title="src/ProductPage.jsx" bad="1"
~'use server';~ // **WRONG:** marks every export of this file as a Server Function, not as a Server Component

import AddToCartButton from './AddToCartButton';
```

The official React documentation explicitly warns against this assumption: "A common misunderstanding is that Server Components are denoted by `"use server"`." This misconfiguration gives the bundler an invalid command:
1. The directive designates every export in the module as an asynchronous Server Function callable from the browser.
2. Component functions return JSX elements rather than serializable server function results.
3. The build tool detects non-async exports or invalid signatures and halts compilation with a build error (as seen in Lesson 110).

Removing the line resolves the issue. The page module already operates as a Server Component because it omits client directives.

Remember: `'use client'` packages code for the browser, `'use server'` creates callable server endpoints, and Server Components require no directive.

---

## PRINCIPLE | `'use client'` in a plain Vite app: no tool reads it, so the page stays the same

> [!PRINCIPLE]
> **Principle 4: The Reader: Without a Compatible Bundler, `'use client'` Has No Effect**
>
> *`'use client'` is an order to a bundler that splits server code from browser code; in a client-side rendered app, such as a plain Vite app, there is nothing to split, and the line has no effect.*
>
> A directive depends entirely on whether a compatible tool processes it. In full-stack frameworks supporting React Server Components, the bundler inspects `'use client'` to divide modules between server and client bundles. In a standard client-side Vite application, every file downloads to the browser by default. No build tool acts on the directive, leaving application behavior unchanged. Always recognize the application architecture before introducing directives or debugging errors.
>
> **DO THIS:**
> ```jsx
> ~import { useState } from 'react';~ // Line 1 in a Vite app: no directive, and the button works
>
> export default function AddToCartButton() {
>   const [count, setCount] = useState(0);
>   return <button onClick={() => setCount(count + 1)}>Add to cart</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~'use client';~ // **WRONG:** added so the button works in a Vite app; no tool here acts on it
> import { useState } from 'react';
> ```

Place the button component into a standard client-side Vite project (as seen in Lesson 07). Test the component with `'use client'` present on line 1, and test it again with the line removed. The root component renders the heading and button:

```jsx title="src/App.jsx"
import ~AddToCartButton~ from './AddToCartButton'; // In a Vite app, every file goes to the browser

export default function App() {
  return (
    <main>
      <h1>Headphones</h1>
      <AddToCartButton />
    </main>
  );
}
```

::: row caption="The same AddToCartButton.jsx in a plain Vite app, with and without 'use client' on line 1, after one click."
::: col title="With 'use client' in the Vite app" tag="same page" tone=good
```page size=mini
heading: Headphones
line: [Add to cart]
line: In cart: 1 | good
```
```jsx title="src/AddToCartButton.jsx" startLine="1"
~'use client';~ // No tool in this app acts on the line
import { useState } from 'react';
```
:::
::: col title="Without 'use client' in the Vite app" tag="same page" tone=good
```page size=mini
heading: Headphones
line: [Add to cart]
line: In cart: 1 | good
```
```jsx title="src/AddToCartButton.jsx" startLine="1"
import { useState } from 'react';
```
:::
:::

In this architecture, both versions function identically. In both configurations, the page initializes with `In cart: 0` and increments to `In cart: 1` upon clicking.

### Why the Line Has No Reader Here

A directive produces effects only when an active tool processes it. A standard Vite project is a client-side rendered application: the bundler ships all application code directly to the browser (as seen in Lesson 103). There are no Server Components to isolate from client modules. The official React documentation explains: "When a `'use client'` module is imported from another client-rendered module, the directive has no effect." In a client-side application, every module is client-rendered.

The directive retains only its native JavaScript meaning as an unused string expression:
1. **During local development**, the browser evaluates the source file with the string intact, and the engine discards it.
2. **During production builds**, Vite strips the unassigned string literal from the compiled output.
3. **For an unknown string like `'hello'`**, Vite logs a build warning noting that module-level directives may be discarded.
4. **For `'use client'`**, the official Vite React plugin suppresses this warning because it recognizes the directive syntax.

```tree caption="The same AddToCartButton.jsx with 'use client', in a framework that supports React Server Components and in a plain Vite app."
`'use client'` on line 1 of `AddToCartButton.jsx`
- +In a framework that supports React Server Components | The **bundler reads** the line | Splits the app: this file and its imports **go to the browser**
- +In a plain Vite app | **No tool acts on** the line as an order | Every file **already runs in the browser**; the line has **no effect**
```

The source file remains completely identical in both environments. The difference rests entirely on whether the bundler includes React Server Component compilation logic.

### Where You Meet `'use client'` in a Vite App

You encounter this directive within client-side applications in two common scenarios:
1. Copying existing component files from a full-stack framework project into a standalone Vite project.
2. Installing third-party component libraries that support React Server Components. The official React documentation notes that compatible libraries "will already include `'use client'` markers of their own."

In both scenarios, the directive remains entirely benign in Vite applications. It triggers no errors, and removing it is unnecessary.

### The Mistake: `'use client'` Everywhere

Because the directive produces no side effects in client-rendered applications, developers often develop misleading habits:
1. A developer transitions from a full-stack framework to a standard client-rendered project.
2. They add `'use client'` to every interactive component out of habit, believing the directive is mandatory for state management.
3. The application functions properly with or without the directive, masking the fact that no tool is reading the line.
4. Later, returning to a full-stack framework, they routinely attach `'use client'` to parent layout or page modules.
5. Marking parent modules forces entire component subtrees into client bundles, increasing browser payload size unnecessarily (as seen in Lesson 106).

Remember: a directive functions as a build command, and commands require an active tool to read them. In a standard client-side Vite project, no tool acts on the directive.

---

## All 4 Principles Together

### The Complete Code

The database mock module:

```js title="src/db.js"
const cart = [];

export const db = {
  cart: {
    async add(productId) {
      cart.push(productId);
    },
  },
};
```

The actions module declares the Server Function:

```js title="src/actions.js"
~'use server';~ // Principles 2 and 3: at the very beginning, keep addToCart on the server

import { db } from './db';

export async function addToCart(productId) {
  await db.cart.add(productId);
}
```

The button component functions as the Client Component:

```jsx title="src/AddToCartButton.jsx"
~'use client';~ // Principles 1 and 2: a string the bundler reads, above every import

import { useState, startTransition } from 'react';
import { ~addToCart~ } from './actions'; // Principle 3: a reference, not the code

export default function AddToCartButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    startTransition(() => addToCart('headphones'));
  }

  return (
    <>
      <button onClick={handleClick}>Add to cart</button>
      <p>In cart: {count}</p>
    </>
  );
}
```

The page component serves as the Server Component:

```jsx title="src/ProductPage.jsx"
import AddToCartButton from './AddToCartButton';

export default function ~ProductPage~() { // Principle 3: no directive, a Server Component
  return (
    <main>
      <h1>Headphones</h1>
      <AddToCartButton />
    </main>
  );
}
```

```page caption="The finished product page after the user clicks Add to cart once."
heading: Headphones
line: [Add to cart]
line: In cart: 1 | good
```

### The Order in Which Things Run

```tree dir=right caption="The order in which the directives are read and the components and the Server Function run, from the build to one click."
From the build to one click on `Add to cart`
- +1. The build [The bundler] | Reads **`'use client'`** and **`'use server'`** | Sends `AddToCartButton.jsx` to the browser; puts a **reference** to `addToCart` in the browser files
- +2. On the server [`ProductPage`] | The framework renders the **Server Component** | `ProductPage` places **`<AddToCartButton />`**
- +3. In the browser [`AddToCartButton`] | React renders the **Client Component** | The engine **throws away** the string on line 1
- +4. The click [`handleClick`] | `setCount` shows **`In cart: 1`** | The reference **sends a request** to the server
- +5. On the server [`addToCart`] | The real function runs | **`db.cart.add`** saves `headphones`
```

### Summary

| Aspect | What a Developer Might Expect | What React Does |
| :--- | :--- | :--- |
| **What the line is** | An import or a React function | A bare string; JavaScript reads it and throws it away |
| **Who reads it** | React, while the page runs | The bundler of a framework that supports React Server Components, while it builds the app |
| **Where it stands** | Anywhere in the file | At the very beginning of the file, above every import; `'use server'` may also open an `async` function |
| **`'use server'`** | Marks a Server Component, as the partner of `'use client'` | Marks functions the browser may call; there is no directive for Server Components |
| **In a plain Vite app** | Every interactive component needs `'use client'` | No tool acts on the line, so it has no effect |

Remember the central principle of this lesson. **A directive is a plain string at the very top of a file: JavaScript throws it away, and the bundler reads it as an order.**

---

## For the Interview

> **The Interview Question:** Why are 'use client' and 'use server' called directives, and who reads them?

### How to Answer Clearly in 30 Seconds

"`'use client'` and `'use server'` are not imports or runtime React functions. Each is a standalone string literal placed at the top of a file, or at the start of an `async` function for `'use server'`. They are termed directives because they inherit the syntax pattern of JavaScript's `'use strict'`. The JavaScript engine discards the string without effect, while compatible build tools read it as a bundling instruction. For React Server Components, the bundler interprets these instructions to organize the application:
1. **`'use client'`** instructs the bundler that the module and its dependencies belong in the client bundle. The import of this file from a Server Component establishes a client boundary.
2. **`'use server'`** instructs the bundler to retain function code on the server and export a client reference stub, enabling network invocations.
3. **Server Components require no directive.** Components default to server execution whenever no directive is specified."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Can I write `'use client'` below my imports, or inside a component?"**
   **No.** The bundler scans for directives only within the directive prologue at the very beginning of a file, above all import statements. Only comments may precede it, and it must use single or double quotes rather than template literals. Placed below an `import`, the string becomes an inert expression, leaving the file as a Server Component. Placing `'use client'` inside a component body has no effect because client boundaries apply to entire modules. The directive `'use server'` differs by supporting placement at the top of an `async` function body.
2. **"Does `'use client'` do anything in a Vite app?"**
   **No.** A standard Vite project is entirely client-side rendered, meaning all modules download to the browser by default. React documentation specifies: "When a `'use client'` module is imported from another client-rendered module, the directive has no effect." The directive produces meaningful architectural splits only within frameworks supporting React Server Components, such as the Next.js App Router.
3. **"Are there other directives in React?"**
   `'use client'` and `'use server'` are the two core module directives for React Server Components. Additional tools utilize the directive pattern for distinct purposes. For example, the React Compiler recognizes `"use memo"` and `"use no memo"`. The React documentation explains: "React Compiler directives are special string literals that control whether specific functions are compiled." These directives share identical string syntax but target compiler optimization rather than bundle partitioning (as seen in Lesson 63).

```tree caption="Interview comparison: the same form, a string at the very beginning, read by three different tools."
Who reads which directive
- +`'use strict'` | Read by the **JavaScript engine** | Switches on **strict mode**
- +`'use client'` and `'use server'` | Read by the **bundler** of a framework that supports React Server Components | Split code between **the server and the browser**
- +`"use memo"` and `"use no memo"` | Read by the **React Compiler** | Turn compiling **on or off** for a function
```
