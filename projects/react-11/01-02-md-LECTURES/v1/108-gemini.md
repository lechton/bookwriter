# Lecture 108: What Each Side Can Do: the Server Component and the Client Component

*(Why can one component read the database but not count a click, while another counts the click but cannot read the database?)*

> INTERVIEW QUESTION | ❱ CORE | What can a Server Component do that a Client Component cannot, and vice versa?

---

## VS | A Server Component vs. a Client Component: one reads the database on the server, the other answers the user in the browser

> Every React component is a function that returns JSX, but that function can execute in one of two places: on the server, or in the browser. **A Server Component runs on the server and is never sent to the browser, while a Client Component is sent to the browser and remains in memory**. Each component does only what its environment allows. On the server, query databases and safeguard secrets. In the browser, hold state and handle clicks.

Before React introduced Server Components, web development separated server code from browser code. On the server, a Node route queries the database, constructs an HTML document, and transmits it over HTTP. The browser receives the finished HTML markup without ever seeing the database logic or credentials that created it. In contrast, client scripts download into the browser alongside the webpage. Those scripts attach event listeners and remain active in browser memory, waiting to handle visitor input.

```js title="Plain JavaScript: one line that runs on the server, one line that runs in the browser"
const product = ~await db.products.get(1)~; // On the server: the database is here, the user is not
button.~addEventListener~('click', addToCart); // In the browser: the user is here, the database is not
```

Each environment provides distinct capabilities and constraints:
- The server environment has direct access to backend databases, file systems, and private secrets. However, the server does not receive direct browser events, and its work concludes as soon as it streams the response.
- The browser environment captures every mouse click and keyboard event, keeping scripts alive in memory while the tab remains open. However, the browser lacks direct database access, and storing private passwords on the client exposes them to the public network.

React components follow this exact division. A Server Component represents server-side execution: it runs on the server and never downloads to the user device. A Client Component represents browser-side execution: its JavaScript code ships to the browser and stays resident in memory throughout the visit.

Keep this central rule in mind throughout this lesson:

**A component can do only what its execution environment provides. The server possesses the data layer and private secrets. The browser possesses the active user.**

> [!DEFINITION]
> **Server Component and Client Component.** [REVIEW] A Server Component executes exclusively on the server before sending HTML to the visitor. It queries databases and reads files directly, outputting a UI description without transmitting its component code to the client bundle. A Client Component ships its code to the browser to enable client-side interactivity, allowing local state and event listeners. A Client Component file begins with the `'use client'` directive, and every file it imports becomes client code as well (Lesson 101).

### It Looks the Same, but It Runs Somewhere Else

At first glance, a Server Component and a Client Component look identical in source code. Both are standard JavaScript functions that accept props and return JSX elements. Both can render identical HTML markup, such as displaying the text Blue Sneakers on the screen. Developers can even write identical JSX structures for both.

Although the syntax appears identical, the runtime behavior and execution context differ completely. The fundamental distinction is where the function executes and whether it stays resident in memory:
- A Server Component executes exclusively on the server, either ahead of time during the build step or dynamically for an incoming HTTP request. Its code never ships to the client. The official React documentation explains this lifecycle by noting that Server Components do not persist in memory after render.
- A Client Component transmits its source code to the browser inside the application JavaScript bundle. It remains loaded in browser memory for the entire duration of the session, enabling React to re-render the component whenever the user interacts with the page.

To persist in memory means to remain resident in runtime memory between renders, ready to re-evaluate when state changes. A Server Component renders its output once and finishes. A Client Component stays alive in browser memory.

```tree caption="A Server Component and a Client Component: both are React components, and they differ in where they run and whether they stay."
Two kinds of React component
- +Server Component | Runs **on the server**, at build time or for each request | Is **not sent** to the browser and **does not stay** in memory after it renders
- +Client Component | Is **sent to the browser** with the page's JavaScript | **Stays in memory** while the page is open and runs again on every update
```

### The Two Lists

Every capability on both sides stems directly from this architectural divide.

What only a Server Component can do:
1. Declare an `async` function and `await` asynchronous operations directly during render.
2. Read directly from databases or the server file system without requiring an intermediate API layer.
3. Access private secrets, including database passwords and secret keys, keeping them secure on the server.
4. Add zero bytes to the client JavaScript bundle, because server component code never ships to the browser.

What only a Client Component can do:
1. Retain local component state across renders using hooks like `useState` and `useReducer`.
2. Attach event listeners, such as `onClick` and `onChange`, to handle user actions immediately.
3. Execute post-render side effects using lifecycle hooks like `useEffect` and `useLayoutEffect`.
4. Access browser platform APIs directly, including `window.localStorage`, geolocation, and media hardware.

A Server Component is not a restricted version of a Client Component. Each kind possesses exclusive capabilities tailored to its runtime environment.

### The Rule of Thumb: does this line need the server or the user?

Before writing a line of code inside a component, evaluate one question: does this logic require the server, or does it require the user? Backend databases, file storage, and private secrets require the server. Mouse clicks, active state updates, and browser window objects require the user.

When a single webpage requires both capabilities, split the responsibilities cleanly. The root page component acts as a Server Component to fetch the data. It then renders a focused Client Component, passing down only what the interactive elements need.

Placing code in the wrong environment produces immediate runtime failures:
1. Placing `useState` or `onClick` in a Server Component causes the server render to crash immediately.
2. Referencing `window.localStorage` in a Server Component crashes with a reference error, because Node has no window global.
3. Adding `'use client'` to the entire page file strips away direct database access, while pulling sensitive backend modules into the public browser bundle.
4. Converting the entire page into a Client Component that fetches data inside an Effect forces visitors to wait for a secondary network request, delaying the initial content display.

Experienced developers recognize five classic misconceptions:
1. Adding `useState` and `onClick` directly to a page component out of habit from legacy client-only React (Lesson 12).
2. Reading `window.localStorage` at the top level of a page component, assuming it runs only after loading in the browser.
3. Adding `'use client'` to a server page to silence a state error, accidentally breaking backend database queries.
4. Treating a Server Component as an inferior Client Component rather than a specialized data-rendering tool.
5. Assuming every React hook is forbidden on the server, overlooking hooks like `use` and `useId`.

Developers generally choose between three architectural patterns:
1. Build the entire application using Client Components, fetching data through manual API endpoints inside `useEffect` (Lesson 33). This fits environments without a React-capable server, such as a static Vite application (Lesson 07).
2. Author the page as a Server Component that queries the database directly, embedding a compact Client Component for interactive controls (Lesson 46). This lesson implements this recommended pattern.
3. Write shared components that use neither server-only nor client-only features, leaving off any directive. Such components execute on the server or the client depending on where they are imported (Lesson 127).

The rest of this lesson examines each scenario using an interactive product page.

## SECTION | The Product Page with an Add to cart Button

Open the online store product page from earlier lessons (Lesson 102). The page displays the product title, Blue Sneakers, followed by an `Add to cart` button and a cart counter. The design omits the price to keep the code focused entirely on component boundaries.

The user performs three sequential actions:
1. The user opens the page, and the product title appears immediately on screen.
2. The user taps `Add to cart` twice, and the cart counter updates to read `Cart: 2`.
3. The user returns the next day and reloads the page, and the counter still reads `Cart: 2`.

::: row caption="The product page when it opens, after two taps on Add to cart, and after a reload the next day."
::: col title="When the page opens"
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 0
```
:::
::: col title="After two taps"
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 2 | good
```
:::
::: col title="After a reload the next day"
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 2 | good
```
:::
:::

Behind these three interactions, the application performs three distinct tasks:
1. It queries the product title from a backend database protected by a secret password.
2. It increments and displays the item count after each button click.
3. It persists the current count inside browser storage, restoring the value after subsequent page reloads.

Applying the architectural rule of thumb clarifies where each task belongs. Reading the database requires server access, placing it squarely inside a Server Component. Handling clicks, updating the active count, and reading browser storage require the visitor browser, placing them inside a Client Component.

```files title="shop: the product page" caption="The three files of our product page: the database stand-in, one Server Component, and one Client Component."
src/
  db.js | stand-in | Reads the database password and gives `db.products.get(id)`
  ProductPage.jsx | Server Component | Awaits the product, renders its title and `CartButton`
  CartButton.jsx | Client Component | Starts with `'use client'`, counts the taps, and saves the count in the browser
```

The database module acts as a stand-in: a lightweight mock file that simulates real database queries without requiring an external database server (Lesson 107).

Server Components and Client Components share standard React syntax, but they execute in different environments and follow distinct rules. Five principles govern their interaction:
1. **`async ProductPage`: the title arrives in the first page, with no API.** A Server Component can await database queries directly during render, while a Client Component cannot.
2. **A Server Component sends its output, never its code.** Only Client modules enter the browser bundle. Server Component code, database drivers, and private passwords stay on the server.
3. **`useState` and `onClick` work only in a Client Component.** State and event listeners require components that remain resident in browser memory, requiring the button to live in its own client file.
4. **`window.localStorage` goes inside `useEffect`.** Browser storage APIs exist only in the browser, and lifecycle Effects guarantee client-side execution.
5. **`'use client'` goes on the smallest file.** Placing `'use client'` on the page file destroys backend database access. Placing it on the button file ships only the interactive button.

---

## PRINCIPLE | `async ProductPage`: the title arrives in the first page, with no API and no second request

> [!PRINCIPLE]
> **Principle 1: Async Server Components: `ProductPage` Awaits the Database While It Renders**
>
> *A Server Component may be an `async` function that awaits the database, a file, or another server resource while it renders, with no API in between; a Client Component cannot.*
>
> A Server Component runs on the server, where the database is. So it can stop in the middle of rendering, wait for the data, and put the title in the first page the user gets. A Client Component runs in the browser, where the database is not, and React does not support async components there. It must render first and fetch from an API in an Effect.
>
> **DO THIS:**
> ```jsx
> export default ~async~ function ProductPage() { // A Server Component: waits for the database while it renders
>   const product = await db.products.get(1);
>   return <h1>{product.title}</h1>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> 'use client';
> export default function ProductPage() {
>   const [product, setProduct] = useState(null);
>   useEffect(() => {
>     ~fetch('/api/products/1')~.then(r => r.json()).then(setProduct); // **WRONG:** an API and a second request for data the page could read itself
>   }, []);
>   return <h1>{product === null ? 'Loading...' : product.title}</h1>;
> }
> ```

In a Node backend, reading a product takes a single line of code: `await db.products.get(1)`. A Server Component allows you to write that exact database call directly inside the component body:

```jsx title="src/ProductPage.jsx" startLine="1"
import db from './db';

export default ~async~ function ProductPage() { // async: this component may wait while it renders
  const product = ~await~ db.products.get(1); // Waits for the database, then goes on with product
  return <h1>{product.title}</h1>;
}
```

Compare this structure with standard components from previous lessons (Lesson 02). The syntax follows the familiar React function pattern: the component accepts props and returns JSX. The crucial addition is the `async` keyword, which allows the function to pause render execution with `await` until asynchronous data resolves (Lesson 41).

> [!DEFINITION]
> **Async component.** [NEW] An async component is a component written as an `async` function, so it can `await` data in the middle of rendering and return its JSX only when the data is there. React's docs: "Async Components are a new feature of Server Components that allow you to `await` in render." Only a Server Component can be async; in the browser, React does not support it (Lesson 108).

The component awaits the database query and returns the rendered title. The initial page arrives with the title already populated, avoiding loading spinners, empty placeholders, or flashes of unstyled content:

```page caption="The product page rendered by ProductPage: the title is there from the first moment."
url: shop.example.com
heading: Blue Sneakers
```

### Where `db` and `product` Come From

The `db` object originates from the database stand-in module:

```js title="src/db.js" startLine="1"
const password = ~process.env.DB_PASSWORD~; // Read on the server when the file runs; the password is never written in the code

const db = {
  products: {
    async ~get~(id) { // Plays the database: gives back one product
      return { id, title: 'Blue Sneakers' };
    },
  },
};

export default db;
```

The property `process.env.DB_PASSWORD` represents an environment variable: a configuration setting provided by the hosting server outside the application source code. The secret password remains protected in the server environment, never exposed in client bundles. A production database client relies on this secret to open database connections. Our stand-in mock reads the variable to demonstrate server-side access without external dependencies.

The `product` variable receives the plain JavaScript object returned by the database helper:

```js title="What product holds after the await"
const product = ~await db.products.get(1)~; // product is { id: 1, title: 'Blue Sneakers' }
```

Server Components can read local disk files just as easily using Node file system utilities such as `readFile` (Lesson 101). In full-stack React, querying databases and reading files share identical mechanics. Both run on the server host, consuming backend resources without intermediate HTTP routes.

### VS | `await` in `ProductPage` vs. `fetch` in an Effect: the same title, one request later

A Client Component cannot read the database directly. It must fetch data using patterns familiar from client-only applications (Lesson 33). The component renders an initial skeleton, and then triggers a network request inside an Effect directed at a custom API endpoint:

```jsx title="src/ProductPage.jsx, written as a Client Component that fetches in an Effect" startLine="1"
'use client';

import { useState, useEffect } from 'react';

export default function ProductPage() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    ~fetch('/api/products/1')~ // A second request, to an API route the developer built
      .then(response => response.json())
      .then(data => setProduct(data));
  }, []);

  if (product === null) {
    return <h1>Loading...</h1>;
  }
  return <h1>{product.title}</h1>;
}
```

Both approaches eventually display Blue Sneakers on screen. But the timing and network overhead differ substantially:
- Using `await` inside a Server Component resolves the title before transmitting HTML. The visitor receives the rendered product title in the initial HTTP document. The official React documentation classifies this approach as loading during render.
- Using `fetch` inside an Effect renders an initial empty or loading state. The browser then dispatches a secondary HTTP request to an API endpoint. The server queries the database, responds with JSON, and only then does the component update state to render the title. The React documentation classifies this approach as loading after first render.

::: row caption="The first thing the user sees: with await in ProductPage, and with fetch in an Effect."
::: col title="await in ProductPage" tone=good
```page size=mini
url: shop.example.com
heading: Blue Sneakers
```
The title is there from the start.
:::
::: col title="fetch in an Effect" tone=bad
```page size=mini
url: shop.example.com
heading: Loading...
```
The title waits for a second request.
:::
:::

Why can a Client Component not declare `async` and use `await` directly? The React client runtime does not support async component functions. The browser rendering engine requires synchronous component returns during reconciliation. When a Client Component needs to read a Promise, it unwraps the Promise using the `use` hook wrapped in a Suspense boundary (Lesson 71).

Remember: the server hosts the database, allowing components executing there to await queries directly.

---

## PRINCIPLE | A Server Component: the browser gets the rendered `<h1>`, never the code or the password

> [!PRINCIPLE]
> **Principle 2: Zero Bundle Cost: The Browser Gets `Blue Sneakers`, Never the Code of `ProductPage`**
>
> *Only Client modules are bundled and sent to the browser; a Server Component, the files it imports, and the secrets it reads stay on the server, and the browser receives only what it rendered.*
>
> When the page is a Server Component, the user's browser downloads no code for it. It gets the `<h1>` with `Blue Sneakers`, and nothing of `ProductPage.jsx`, `db.js`, or the password. This holds as long as no `'use client'` file imports `db.js` and no prop carries the secret to a Client Component.
>
> **DO THIS:**
> ```jsx
> import db from './db'; // Imported only by a Server Component: db.js stays on the server
>
> export default async function ProductPage() {
>   const product = await db.products.get(1);
>   return <h1>~{product.title}~</h1>; // The browser receives only the rendered <h1>
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default async function ProductPage() {
>   const product = await db.products.get(1);
>   return <CartButton ~password={process.env.DB_PASSWORD}~ />; // **WRONG:** CartButton is a Client Component, so this prop travels to the browser with the secret in it
> }
> ```

Consider how server-rendered web applications traditionally work. When inspecting the source code of an HTML page generated by Node, you see clean HTML markup. You never see backend JavaScript routines, database connection strings, or server environment passwords. That source code executed entirely on the server, sending only its rendered product over the network.

Server Components operate under this exact principle. React executes the component on the server, serializing only its returned UI description:

```html title="What the browser receives for ProductPage"
<h1>Blue Sneakers</h1>
```

Neither the page component file nor the database module ships to the user device. Only files tagged with the `'use client'` directive, along with their transitive dependencies, are bundled into the client JavaScript assets (Lesson 106).

> [!DEFINITION]
> **Client modules, rendered output, and zero bundle cost.** [NEW] Client modules are the files marked with `'use client'` and the files they import; React's docs: "Only Client modules are bundled and evaluated by the client." The rendered output is what a Server Component returned, such as `<h1>Blue Sneakers</h1>`; React's docs: "only the rendered output is sent to the client." Developers call the result zero bundle cost: a Server Component adds nothing to the bundle, because its code never leaves the server (Lesson 108).

During the initial page load, this UI output arrives as standard HTML markup (Lesson 102). Subsequent dynamic navigations transfer this output using React Server Component payload streams (Lesson 124).

### VS | `fetch` in an Effect vs. a Server Component: the same title, two different downloads

Both implementations from Principle 1 deliver the title to the user screen. But the network payload and security profile differ completely:

| What the browser gets | `ProductPage` with `fetch` in an Effect | `ProductPage` as a Server Component |
| :--- | :--- | :--- |
| **The code of `ProductPage.jsx`** | Downloaded and run in the browser | Stays on the server |
| **The code of `db.js` and its password** | Stays on the server, behind an API route the developer had to build | Stays on the server, with no API route |
| **The title** | Arrives after a second request | Arrives in the first page as `<h1>Blue Sneakers</h1>` |

### What Stays on the Server

Three critical assets remain strictly on the server when a page is authored as a Server Component:
1. The source code of the page component. The client browser downloads only the generated HTML elements, not the underlying function logic.
2. The implementation of the database module. Because only the Server Component imports this module, it never enters the client bundle.
3. The database password and backend credentials. The database module reads secrets from the server environment without exposing them over HTTP.

A password represents a private secret: a sensitive credential that must never leak to client devices. The official React documentation specifically cautions developers regarding private keys and passwords, including database credentials.

This boundary applies equally to heavy third-party libraries. When a Server Component imports a large parsing or markdown utility, the library executes on the server and contributes zero bytes to the client bundle. As the React documentation highlights, the client bundle excludes expensive libraries required only for generating static content.

Backend secrets remain protected only when two safety conditions are satisfied:
1. No client module tagged with `'use client'` imports the database file. If a client file imports a server utility, that utility and its dependencies get compiled into the client bundle, as Principle 5 demonstrates.
2. The Server Component never passes secret values to a Client Component through props. Every prop value placed on a Client Component tag serializes and travels across the network to the browser (Lesson 107).

### The Browser Cannot Run `ProductPage` Again

Zero bundle cost introduces a deliberate trade-off. Because the browser never downloads the code for the page component, it cannot re-execute the function locally. When the interface needs to refresh server data, the client must request a fresh render pass from the server. The React documentation notes that Server Components can be re-rendered on demand by re-fetching them from the server, where they re-query data and produce updated UI streams.

Remember: a Server Component transmits its rendered output rather than its source code. That mechanism eliminates bundle bloat and keeps server secrets secure.

---

## PRINCIPLE | `useState` and `onClick`: they work only in a `'use client'` file such as `CartButton`

> [!PRINCIPLE]
> **Principle 3: State and Events: `onClick` and `useState` Move Add to cart into `CartButton`**
>
> *State and event handlers need a component that stays in the browser, so `useState`, `useReducer`, and `onClick` belong in a Client Component, which the Server Component renders as a child.*
>
> A Server Component runs once on the server and is not sent to the browser. It has nowhere to keep `count` and nothing in the browser to answer a tap, so the product page does not render. Put the button and its state in a file that starts with `'use client'`, and render that file from the page.
>
> **DO THIS:**
> ```jsx
> 'use client';
> export default function CartButton() {
>   const [count, setCount] = ~useState(0)~; // A Client Component keeps count in the browser
>   return <button onClick={() => setCount(count + 1)}>Cart: {count}</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default async function ProductPage() {
>   const [count, setCount] = ~useState(0)~; // **WRONG:** a Server Component cannot hold state, and the page does not render
>   return <button onClick={() => setCount(count + 1)}>Cart: {count}</button>;
> }
> ```

Consider a standard static HTML document delivered by a server. Once the server sends the HTML bytes over the network, its execution context terminates. If a user clicks a button on that rendered page, no server process is running to detect that click. Only client JavaScript executing inside the browser can register DOM events and update the view.

A Server Component operates under this exact server lifecycle. Now imagine adding the interactive cart button to the page. A developer might instinctively add `useState` and an `onClick` listener directly to the page component, repeating patterns used in client-only code (Lesson 12):

```jsx title="src/ProductPage.jsx" startLine="1" bad="5,10"
import { useState } from 'react';
import db from './db';

export default async function ProductPage() {
  const [count, setCount] = ~useState(0)~; // **WRONG:** a Server Component cannot hold state
  const product = await db.products.get(1);
  return (
    <>
      <h1>{product.title}</h1>
      <button ~onClick={() => setCount(count + 1)}~>Add to cart</button> {/* **WRONG:** a Server Component cannot answer a tap */}
      <p>Cart: {count}</p>
    </>
  );
}
```

Although the syntax looks familiar, the execution context breaks the component completely. Those lines functioned previously because the components executed inside the browser and remained mounted in memory. React stored the state variable and triggered the callback whenever the user clicked. In contrast, the page component executes on the server, produces rendered output once, and terminates. No server state store persists in the browser, and no server listener exists to intercept clicks.

The server render crashes immediately. Here is the exact failure sequence:
1. The server runtime begins executing the page component and reaches the `useState(0)` call.
2. The React server renderer does not provide state hook dispatchers. The official React documentation explains that Server Components are not transmitted to the browser and therefore cannot utilize interactive state hooks like `useState`.
3. The server halts with an unhandled exception, preventing the page from rendering. In React's standalone server renderer, the operation fails with the first error message shown below.
4. Even if the state declaration is removed, the `onClick` prop alone prevents the page from rendering. React must serialize JSX element attributes to transmit them across the network, but JavaScript function references cannot be serialized (Lesson 107). React throws the second error message shown below.

```text title="The two errors from React's own server renderer"
useState is not a function or its return value is not iterable
Event handlers cannot be passed to Client Component props.
```

The React documentation establishes a strict rule for event props: event handlers like `onClick` can only be defined inside Client Components. Furthermore, the documentation explains the root cause: Server Components do not persist in memory after render and cannot maintain local state. Component state represents memory that survives across renders (Lesson 12). A component that does not remain loaded in memory cannot maintain state.

### Move the Button into Its Own File

The standard solution extracts the interactive button and its state into a dedicated component file. That file starts with the `'use client'` directive, allowing the Server Component to import and render it. The React documentation notes that developers compose Server Components with Client Components using the `'use client'` directive to add interactivity.

```jsx title="src/CartButton.jsx" startLine="1"
~'use client';~ // This file and what it imports become client code

import { useState } from 'react';

export default function CartButton() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
      <p>Cart: {count}</p>
    </>
  );
}
```

The page component retains the database query and renders the button component below the heading:

```jsx title="src/ProductPage.jsx" startLine="1"
import db from './db';
import ~CartButton~ from './CartButton'; // The import of a 'use client' file is the boundary

export default async function ProductPage() {
  const product = await db.products.get(1);
  return (
    <>
      <h1>{product.title}</h1>
      ~<CartButton />~ {/* A Client Component inside a Server Component */}
    </>
  );
}
```

The button file begins with `'use client'`. That import statement establishes the client boundary: server-only execution ends at this point, and client execution begins (Lesson 106). The button component ships to the browser, mounts in memory, manages its local state, and responds to every user click:

::: row caption="The product page with CartButton: when it opens, and after the user taps Add to cart twice."
::: col title="When the page opens"
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 0
```
:::
::: col title="After two taps"
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 2 | good
```
:::
:::

```tree caption="useState and onClick in ProductPage, and the same two lines in CartButton with 'use client'."
Where `useState` and `onClick` can live
- !In `ProductPage`, a Server Component [`useState` `onClick`] | Runs **once on the server** and is **not sent** | The product page **does not render**
- +In `CartButton`, a Client Component [`'use client'`] | Is **sent to the browser** and **stays there** | Keeps `count` and **answers every tap**
```

This restriction targets hooks that rely on persistent component memory and browser lifecycles, rather than banning every React hook. The React documentation states that Server Components cannot use most hooks, while deliberately excluding `use` and `useId` from the client-only hook list.

Remember: the browser hosts the active user. Interactive state and event listeners belong exclusively in components that reside in browser memory.

---

## PRINCIPLE | `window.localStorage`: read it inside `useEffect`, which runs only in the browser

> [!PRINCIPLE]
> **Principle 4: Browser APIs and Effects: `useEffect` Brings Back the Saved `Cart: 2`**
>
> *Browser APIs such as `window.localStorage` exist only in the browser, and Effects run only in the browser, so code that reads or writes the browser goes in a Client Component, inside an Effect or an event handler, never in a Server Component.*
>
> A Server Component never runs in the browser, so `window` does not exist where it runs, and the page does not render. Even a Client Component is first rendered on the server for the HTML. Only its Effects and its event handlers are sure to run in the browser, where the saved count is.
>
> **DO THIS:**
> ```jsx
> 'use client';
> export default function CartButton() {
>   const [count, setCount] = useState(0);
>   ~useEffect~(() => { // Runs in the browser, after the button is on the screen
>     setCount(Number(window.localStorage.getItem('cart')));
>   }, []);
>   return <p>Cart: {count}</p>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default async function ProductPage() {
>   const saved = ~window~.localStorage.getItem('cart'); // **WRONG:** runs on the server, where there is no window, and the page does not render
>   return <p>Cart: {saved}</p>;
> }
> ```

In the current implementation, refreshing the page resets the counter back to `Cart: 0`. The online store requires a guest cart: persistent client-side storage that remembers cart selections for unauthenticated visitors across browser reloads.

Standard JavaScript web applications use `localStorage` to retain client data. A webpage stores preference settings with a single method call, and retrieves them after a page refresh:

```js title="Plain JavaScript: save a value, reload, read it back"
~localStorage.setItem~('theme', 'dark'); // Saves the value under the name 'theme', in this browser
~localStorage.getItem~('theme'); // After a reload, the next day too: gives back 'dark'
```

Managing the cart count relies on the same storage methods:
- `window.localStorage.setItem('cart', 2)` stores the count under the key `'cart'`.
- `window.localStorage.getItem('cart')` retrieves the stored string, returning `'2'`.

> [!DEFINITION]
> **Browser APIs.** [NEW] Browser APIs are the tools the browser gives a page and the server does not have, such as `window`, `window.localStorage`, audio, and video. React's docs list "the browser's APIs for web storage, audio and video manipulation, and device hardware", and add: "Since those APIs are only available in the browser, it must be marked as a Client Component" (Lesson 108).

### VS | The Read in `ProductPage` vs. the Read in an Effect: the same call, two different places

A developer can place the local storage read in two different places:

```jsx title="Reading the saved count in ProductPage, and inside an Effect in CartButton"
const saved = ~window.localStorage.getItem('cart')~; // In ProductPage: runs on the server, where there is no window

useEffect(() => {
  setCount(Number(~window.localStorage.getItem('cart')~)); // In CartButton: runs in the browser, after the button is on the screen
}, []);
```

Both lines invoke the identical storage API method. However, the runtime environments dictate success or failure:
- Inside the page component, the code executes on the server runtime. Because Node environments do not provide a `window` global, the expression throws a reference error and crashes page generation.
- Inside the `useEffect` callback within the button component, the code executes exclusively in the browser after the button renders to the DOM. The React documentation emphasizes this distinction: Effects run only on the client and never execute during server rendering.

### The Trap: the Body of `CartButton` Also Runs on the Server

Developers often attempt to initialize state directly from browser storage within the main function body of the button component. Because the file declares `'use client'`, developers assume the code is protected:

```jsx title="Reading the saved count in the body of CartButton"
const [count, setCount] = useState(Number(~window.localStorage.getItem('cart')~)); // **WRONG:** this body also runs on the server
```

This implementation fails because Client Components undergo Server-Side Rendering to produce the initial HTML markup (Lesson 102). During this initial server render pass, the top-level component function body executes in the server runtime where `window` is undefined:
1. Written without guards, the code crashes during server rendering with a missing window reference.
2. If guarded with a window check, the server produces initial HTML containing `Cart: 0`, while the first client render evaluates to `Cart: 2`. The server and client DOM trees fail to match, causing React to log a hydration mismatch warning (Lesson 105).

Lifecycle Effects and user event handlers provide the only guaranteed browser-only execution contexts.

### `CartButton` Saves the Count and Reads It Back

The click handler updates state and persists the new count to storage after every tap. The Effect reads the stored count once the button mounts in the browser:

```jsx title="src/CartButton.jsx" startLine="1"
'use client';

import { useState, useEffect } from 'react';

export default function CartButton() {
  const [count, setCount] = useState(0);

  ~useEffect~(() => { // Runs only in the browser, after the button is on the screen
    setCount(Number(window.localStorage.getItem('cart'))); // '2' becomes 2; with nothing saved, null becomes 0
  }, []);

  function handleClick() {
    setCount(count + 1);
    ~window.localStorage.setItem('cart', count + 1)~; // Saves the new count for the next visit
  }

  return (
    <>
      <button onClick={handleClick}>Add to cart</button>
      <p>Cart: {count}</p>
    </>
  );
}
```

The page component file remains unchanged.

### Why `Cart: 0` Shows for a Moment After the Reload

When the page reloads, the count briefly displays `Cart: 0` before updating to `Cart: 2`. The server has no access to client browser storage, so it renders HTML using the default initial state of 0. Once the client script loads in the browser, the Effect reads local storage and updates the state. Here is the step-by-step sequence:
1. The server renders the page component and generates the initial HTML markup for the button component. Because Effects do not execute on the server, the generated HTML renders `Cart: 0`.
2. The browser displays the initial HTML layout, showing the title, the button, and `Cart: 0`.
3. The browser downloads the client bundle for the button component, and React hydrates the existing DOM elements (Lesson 104).
4. The Effect fires in the browser, retrieving the stored string from local storage and calling `setCount(2)`.
5. React re-renders the component in the browser, updating the counter to display `Cart: 2`.

::: row caption="The product page after a reload: the HTML from the server, and the same page after the Effect runs in the browser."
::: col title="HTML from the server"
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 0
```
:::
::: col title="After the Effect runs"
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 2 | good
```
:::
:::

The React documentation outlines this lifecycle. Users first view server-rendered output while the page loads. Then, after hydration, your Effect executes in the browser.

Remember: the `window` object exists only in browser runtimes, and only Effects or event listeners execute strictly on the client.

---

## PRINCIPLE | `'use client'`: put it on the small `CartButton` file, never on the page that reads the database

> [!PRINCIPLE]
> **Principle 5: The Smallest Client File: `'use client'` on `ProductPage` Breaks the Database Read**
>
> *A Client Component cannot be async, cannot read the database or the file system, and cannot keep a secret, because its code goes to the browser; so `'use client'` goes on the small interactive file, never on the page file that reads the data.*
>
> `'use client'` sends the file and everything it imports to the browser, and turns off every server ability of that file. On the page file, it breaks the async read, takes away the title, and pulls `db.js` toward the browser. On the button file, it sends only the button.
>
> **DO THIS:**
> ```jsx
> ~'use client';~ // At the top of CartButton.jsx: only the button goes to the browser
> export default function CartButton() {
>   const [count, setCount] = useState(0);
>   return <button onClick={() => setCount(count + 1)}>Cart: {count}</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~'use client';~ // **WRONG:** at the top of ProductPage.jsx: an async Client Component, and db.js goes to the browser
> export default async function ProductPage() {
>   const product = await db.products.get(1);
>   return <h1>{product.title}</h1>;
> }
> ```

Developers often misunderstand the `'use client'` directive as a switch that unlocks React hooks in a file. It is not an enablement toggle. The directive declares: send this file, and every file it imports, to the browser bundle. Every architectural consequence flows directly from this definition.

Recall the state error from Principle 3. Developers frequently attempt to fix the error by placing `'use client'` at the very top of the page component file, leaving the rest of the file unchanged:

```jsx title="src/ProductPage.jsx" startLine="1" bad="1"
~'use client';~ // **WRONG:** ProductPage and everything it imports become client code, db.js included

import { useState } from 'react';
import db from './db';

export default async function ProductPage() {
  const [count, setCount] = useState(0);
  const product = await db.products.get(1);
  return (
    <>
      <h1>{product.title}</h1>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
      <p>Cart: {count}</p>
    </>
  );
}
```

The `useState` error disappears, and the syntax appears unchanged. But the execution context has shifted completely. Although the file still calls `await db.products.get(1)`, the page component is now a Client Component, and Client Components cannot perform server-only operations.

Eliminating the state error triggers a catastrophic failure in database access. Here is the chain of events:
1. The page file and all of its imported dependencies, including the database module, become classified as client code (Lesson 106). The React documentation confirms this behavior, stating that all code within a Client module subtree is bundled and executed by the client.
2. The page component is now an async Client Component. Because the React client runtime rejects async component functions, React halts rendering and displays an error screen. The browser console logs the error twice followed by a component warning:

```devconsole width=full caption="The Console when ProductPage.jsx starts with 'use client' and ProductPage is still async."
x <ProductPage> is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.
x Uncaught Error: An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.
! An error occurred in the <ProductPage> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

3. The database module now compiles into the browser bundle. In the browser runtime, `process.env.DB_PASSWORD` does not contain server credentials, and real database drivers cannot establish database connections from client environments.
4. The page completely loses its ability to query product data. The title fails to render, leaving the page broken.

The React documentation highlights this exact dilemma. Reading local files requires a Server Component. That direct file system access is impossible inside client code.

### The Next Wrong Step

To bypass the async component error, developers frequently remove the `async` keyword, add an Effect with `fetch`, and construct a separate API endpoint to serve the product data. This rebuilds the legacy client-side data fetching pattern from Principle 1. The title now suffers from delayed secondary network requests, and server component logic ends up bloated inside client bundles. The page functions, but all performance and security benefits of Server Components are lost.

### VS | `'use client'` on the Page File vs. on the Button File: the same line, two different amounts of code in the browser

The proper solution moves the directive rather than adding it everywhere. The same directive line can sit at the top of either file:

```jsx title="The same line at the top of two different files"
~'use client';~ // **WRONG:** at the top of ProductPage.jsx
~'use client';~ // At the top of CartButton.jsx
```

Although the code line is identical, the architectural impact differs completely depending on which file it marks:

```tree caption="'use client' on the page file vs. 'use client' on the button file: the same line, two different amounts of code sent to the browser."
Where `'use client'` goes
- !On `ProductPage.jsx` [`'use client'` `async` `db.js`] | The page **and `db.js`** become client code | The page **loses its database read** and gets an **async Client Component** error
- +On `CartButton.jsx` [`'use client'` `useState` `onClick`] | Only **the button** and what it imports become client code | `ProductPage` **reads the database**; the button **answers the taps**
```

When the button component needs database values, the Server Component queries the data first. It passes the value down as a prop: `<CartButton title={product.title} />`. Serializable strings transfer cleanly from the server to the browser (Lesson 107). The Client Component never queries the database directly.

Remember: `'use client'` marks an entry point into the browser bundle. Place it at the leaf boundaries of your component tree, on the smallest interactive files.

---

## All 5 Principles Together

### The Complete Code

Here is the finished product page implementation: the database stand-in, one Server Component, and one Client Component.

```files title="shop: the finished product page" caption="The finished product page: the database stand-in, one Server Component, and one Client Component."
src/
  db.js | stand-in | Reads `process.env.DB_PASSWORD` on the server and gives `db.products.get(id)`
  ProductPage.jsx | Server Component | Awaits the product, renders the title and `<CartButton />`
  CartButton.jsx | Client Component | Starts with `'use client'`, keeps the count in state, saves it in `window.localStorage`, and reads it back in an Effect
```

```js title="src/db.js" startLine="1"
const password = ~process.env.DB_PASSWORD~; // Principle 2: read on the server, never sent to the browser

const db = {
  products: {
    async get(id) {
      return { id, title: 'Blue Sneakers' };
    },
  },
};

export default db;
```

```jsx title="src/ProductPage.jsx" startLine="1"
import db from './db';
import CartButton from './CartButton';

export default ~async~ function ProductPage() { // Principles 1 and 5: a Server Component, with no 'use client'
  const product = await db.products.get(1);
  return (
    <>
      <h1>{product.title}</h1>
      ~<CartButton />~ {/* Principle 3: the only part of the page sent to the browser */}
    </>
  );
}
```

```jsx title="src/CartButton.jsx" startLine="1"
~'use client';~ // Principles 3 and 5: the smallest file that needs the browser

import { useState, useEffect } from 'react';

export default function CartButton() {
  const [count, setCount] = useState(0);

  ~useEffect~(() => { // Principle 4: reads the saved count in the browser
    setCount(Number(window.localStorage.getItem('cart')));
  }, []);

  function handleClick() {
    setCount(count + 1);
    window.localStorage.setItem('cart', count + 1);
  }

  return (
    <>
      <button onClick={handleClick}>Add to cart</button>
      <p>Cart: {count}</p>
    </>
  );
}
```

```page caption="The finished product page after a reload the next day: the title from ProductPage, and the button and the saved count from CartButton."
url: shop.example.com
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 2 | good
```

### Where React Runs Each Component, in Order

When the user opens the page, React executes `ProductPage` on the server first. When the server renderer encounters `<CartButton />`, it renders its initial HTML on the server as well, shipping only the JavaScript code of `CartButton` to the browser bundle. In the browser, React hydrates `CartButton`, and its Effect retrieves the saved count from local storage:

```tree caption="The order in which React runs the components of the product page, on the server and in the browser."
`ProductPage` [1. On the server] | **Server Component** | Awaits the product from `db` and returns the `<h1>` and `<CartButton />`
- +`<h1>Blue Sneakers</h1>` [2. Rendered output] | Sent to the browser **as output**, not as code | The browser **never gets** `ProductPage.jsx` or `db.js`
- +`CartButton` [3. On the server, then in the browser] | **Client Component** | First HTML with **`Cart: 0`**; then hydrated in the browser, where the Effect shows **`Cart: 2`** and every tap adds one
```

### Summary

| Ability | Server Component | Client Component |
| :--- | :--- | :--- |
| **`async` and `await` while rendering** | Yes, as `ProductPage` does | No: "async components are not supported on the client" |
| **The database or the file system, with no API** | Yes, as the database read in `ProductPage` | No: it needs an API and a second request |
| **Secrets such as the database password** | Yes, read in `db.js` on the server | No: all its code "is sent to and run by the client" |
| **Its own code in the browser bundle** | No: the browser gets only the rendered output | Yes: "Only Client modules are bundled" |
| **State with `useState` or `useReducer`** | No: it does not persist in memory after render | Yes, as `count` in `CartButton` |
| **Event handlers such as `onClick`** | No: "can only be defined in Client Components" | Yes, as `handleClick` in `CartButton` |
| **Effects with `useEffect` or `useLayoutEffect`** | No: "Effects only run on the client" | Yes, as the Effect in `CartButton` |
| **Browser APIs such as `window.localStorage`** | No: the server has no `window` | Yes, inside an Effect or an event handler |

Remember the central principle of this lesson: a component can do only what its execution environment provides. The server possesses the data layer and private secrets. The browser possesses the active user.

---

## For the Interview

> **The Interview Question:** What can a Server Component do that a Client Component cannot, and vice versa?

### How to Answer Clearly in 30 Seconds

"Both are React components. The difference is where they execute. A Server Component runs exclusively on the server, during build time or per request, and never ships to the browser bundle. A Client Component ships its code to the browser and remains in memory while the page is open. Every capability stems from that divide:
1. **A Server Component** can be async and await data while rendering. It can query databases and access local files directly without custom APIs, and safely read private credentials. It adds zero bytes to the client bundle because only Client modules are bundled.
2. **A Client Component** can maintain local state, attach interactive event listeners like `onClick`, execute lifecycle Effects, and access browser APIs like `window.localStorage`. A Server Component cannot, because it does not persist in memory after rendering and never executes in the browser.
3. **The standard pattern**: author the page as a Server Component to fetch data, and extract interactive UI controls into focused Client Components marked with `'use client'`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Can a Server Component use any Hooks at all?"**
   **A few.** The React documentation explains that Server Components cannot use most hooks, rather than banning all of them:
   - `use` and `useId` are explicitly permitted on the server, though `useId` cannot currently be used inside async Server Components.
   - The React server renderer supports `useMemo` and `useCallback`, though they are rarely necessary on the server. The renderer does not provide `useState`, `useReducer`, `useEffect`, or `useLayoutEffect`.
   - The `cache` utility function is designed exclusively for Server Components (Lesson 123).
   - Any custom hook that internally invokes client hooks like `useState` is strictly client-only.

   For third-party libraries, components must run on the client if they rely on `createContext`, interactive hooks, `forwardRef`, `memo`, `startTransition`, or browser globals.
2. **"How does a Client Component get data from the server, then?"**
   **Three primary ways.**
   - A parent Server Component queries the data and passes it down as serializable props (Lesson 107).
   - The Client Component invokes a Server Function marked with `'use server'` (Lesson 110).
   - The Client Component fetches data from an HTTP API endpoint inside an Effect (Lesson 33).

   Additionally, a Client Component can render server-generated elements passed through its `children` prop (Lesson 115).
3. **"Is it always cheaper to keep a component on the server?"**
   **No.** A Server Component transmits serialized rendered output rather than component source code. Some components generate massive HTML from concise code, such as generating complex SVG paths. In those cases, sending rendered markup uses more bandwidth than shipping the compact generator code to run in the browser. The React documentation notes that when HTML output is large relative to source code, forcing the component to run on the client is often more efficient.

```tree dir=right caption="Interview summary: what each kind of component can do, and how a real page splits the work."
What each side can do
- +Server Component [`async` `await` `db`] | Awaits data while it renders, **reads the database** with no API, **keeps secrets** | **Costs the browser nothing**: only its output is sent
- +Client Component [`useState` `onClick` `useEffect`] | Holds **state**, answers **events**, runs **Effects**, uses **browser APIs** | Is **sent to the browser** and **stays** there
- +The split [`'use client'` on `CartButton.jsx`] | The page reads the data **on the server** | Only the **small interactive file** goes to the browser
```
