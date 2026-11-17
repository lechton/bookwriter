# Lecture 120: What Resuming Picks Up, Where It Comes From, and Why It Is Not Hydration

*(When the server finishes a page that the build started, what does it pick up, and what is still left for the browser?)*

> INTERVIEW QUESTION | ❱ CORE | What does resuming mean: shipping server state without shipping component code?

---

## VS | `resume` on the Server vs. `hydrateRoot` in the Browser: both continue the page, only `hydrateRoot` makes it answer a tap

> A product page displays the same name and price to every customer, but each customer sees their own shopping cart. **Resuming means the build renders the shared static content once, and the server later completes each visitor's dynamic content from the exact point where the build stopped**. Only `postponed`, a JSON object containing no executable code, travels from the build to the request server. The server must execute the component code again to generate the missing markup, and the client browser still requires hydration to make buttons interactive.

Until now, React generated HTML at one of two distinct moments. Server rendering executes React dynamically on every incoming request (Lesson 102). Static prerendering executes React once ahead of time during the project build (Lesson 119). Many web pages require both techniques at the same time. On a shoe store product page, the sneaker title and price remain identical for every user, making them ideal for build-time generation. In contrast, the shopping cart depends on personal session data, which only an active request can determine.

React combines both moments on a single page through Partial Prerendering (Lesson 103). During the build, React runs `prerender`, outputs the static shell, and pauses when encountering unfinished dynamic data. Later, when an individual visitor requests the page, the server calls `resume` to finish the remaining sections. When the server picks up this unfinished page, what does it actually receive? It receives neither the missing HTML nor a pre-compiled copy of the cart component. Instead, it receives `postponed`, a plain JSON object recording where rendering stopped, while the server provides the component source code itself.

**Why:** The term resuming often creates two dangerous misunderstandings that can break a production application. First, developers sometimes assume that the build hands over every resource the server needs to complete the page. If a deployment copies only the generated build files without the component source code, the server cannot execute the components required to render the cart. Second, developers sometimes assume that resuming eliminates the need for client hydration. If a deployment omits the client JavaScript bundle, the browser displays static markup, but the add to cart button never responds to user clicks.

### The One Line That Resumes the Page

Everything in this lesson sits in one line of the server file:

```jsx title="server.js: the one line that resumes the page"
const stream = await ~resume(<App />, postponed)~; // Two things go in: our component, and the place where prerender stopped
```

Two distinct inputs enter `resume`, and they originate from two different locations:
1. **`postponed`** comes from the build. It records where prerendering stopped, stored as plain JSON text. The build writes this text into a file, and the server reads that file back into memory.
2. **`<App />`** comes from the server's own application files. The build never transmits component code. The server imports the root component directly, exactly as the build script did.

The `resume` function combines these two pieces on the server to produce the missing HTML markup, such as `Cart: 2`. Once that markup reaches the client, the browser hydrates the page, exactly as it does for any server-rendered HTML document.

```tree dir=right caption="What goes into resume, where each piece comes from, and what comes out."
What `resume` receives and what it gives
- +From the build [`postponed`] | Saved in **`dist/blue-sneakers.json`** | **JSON text** with **no component code** in it
- +From the server's own files [`<App />`] | The server imports **`./src/App.jsx`** | The **component code** that `resume` runs again
- +Out of `resume` [`Cart: 2`] | **HTML**, made **on the server** | The browser **still hydrates** it
```

Here is the central rule to keep in mind throughout this lesson:

**Resuming splits one server render across two moments, build time and request time. Only `postponed` crosses between them, and the browser still hydrates the page afterwards.**

### `resume` vs. `hydrateRoot`: the same `<App />`, two different jobs

Both functions continue a partially prepared page after the build:

```jsx title="The two calls that continue the page after the build"
const stream = await ~resume~(<App />, postponed); // On the server: makes the HTML of the cart
~hydrateRoot~(document, <App />); // In the browser: makes Add to cart answer a tap
```

Both functions receive `<App />`. Both resume work on a partially prepared page. Both evaluate component functions. Despite these surface similarities, their execution environments and responsibilities differ completely. The `resume` function runs on the server to produce streaming HTML text. In contrast, `hydrateRoot` runs in the client browser to attach event listeners and internal state to existing DOM elements. In React architecture, resuming is strictly a server-side continuation that never replaces client hydration.

### Three Ideas From Earlier Lessons

> [!DEFINITION]
> **`prerender` and `postponed`.** [REVIEW] The `prerender` API renders a component tree during the build and returns `{ prelude, postponed }`. When the build signals an early stop through an `AbortController`, any suspended `<Suspense>` boundary outputs its fallback markup into `prelude`. The `postponed` value then captures the remaining unresolved work. Official React documentation defines `postponed` as an opaque object that application code stores and forwards without inspecting its internal structure. When all components finish rendering during the build, `postponed` resolves to `null` (Lessons 103 and 119).

> [!DEFINITION]
> **Suspense and use.** [REVIEW] A component reads an asynchronous Promise using `use`, such as `use(getCart())`. While the Promise remains pending, the component suspends execution and yields control back to React. The closest ancestor `<Suspense>` boundary catches this pause and renders its fallback element, such as `Loading cart...`. Once the Promise resolves with data, React completes rendering the suspended component (Lessons 69 and 71).

> [!DEFINITION]
> **Hydration.** [REVIEW] A server transmits raw HTML markup that the browser renders immediately on screen, but static markup cannot handle user interactions. Once the client bundle downloads, `hydrateRoot(document, <App />)` executes component logic in the browser to bind event handlers and initialize state on the existing DOM nodes. Official React documentation explains that hydration transforms the initial server HTML snapshot into a fully interactive client application (Lesson 104).

### Three Calls That Finish a Stopped Prerender

React provides three distinct APIs that accept the stored `postponed` state and complete the unfinished page:
1. **`resume`** completes rendering at request time for an individual visitor, delivering output as a Web Stream. React documentation states that `resume` streams a prerendered React tree to a Readable Web Stream. This is the primary API explored throughout this lesson.
2. **`resumeToPipeableStream`** accomplishes the identical task for a server environment based on Node streams.
3. **`resumeAndPrerender`** completes rendering to produce static HTML files ahead of time, which can then be deployed to a storage bucket or content delivery network. React documentation explains that developers can call `resumeAndPrerender` to resume rendering and obtain static HTML for static site generation.

Guidelines for choosing among these three methods appear in a later lesson (Lesson 142).

## SECTION | The Blue Sneakers Product Page

Alice opens the product page of an online shoe store. First she sees the shoe title, its price, and a placeholder line indicating that her shopping cart is loading. A moment later, that placeholder turns into her personalized cart, accompanied by an interactive button to add another pair:

::: row caption="The Blue Sneakers page: the part made at build time arrives first, then the server fills in Alice's cart."
::: col title="The file made at build time arrives" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: $89
line: Loading cart...
```
:::
::: col title="The server fills in her cart" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: $89
line: Cart: 2 | good
line: [Add to cart]
```
:::
:::

When Alice taps the add button, her cart counter increments from 2 to 3. The heading and price were generated at build time, hours before Alice opened the website. Her shopping cart was generated only when her HTTP request reached the server. This scenario highlights the three distinct parts of the page:
1. **Content created at build time:** the product heading and price.
2. **Content created at request time:** the dynamic text displaying `Cart: 2`.
3. **Content activated by hydration:** the interactive button that adds items to the cart.

This architecture builds on the Partial Prerendering setup from Lesson 103, with one intentional structural change. The heading and price move out of the root component into a dedicated `ProductInfo` component. Isolating static markup in `ProductInfo` allows us to demonstrate how React handles components that finish at build time differently from those that remain incomplete.

```files title="blue-sneakers: File Explorer" caption="The files of the resumed Blue Sneakers page: the build, the server, the two saved files, and our components."
build.js | build time | Calls `prerender` and writes the two files in `dist/`
server.js | request time | Sends the HTML file, loads `postponed`, and calls `resume(<App />, postponed)`
dist/
  blue-sneakers.html | prelude | `Blue Sneakers`, `$89`, and `Loading cart...`, made at build time
  blue-sneakers.json | postponed | The place where `prerender` stopped, as JSON text
src/
  App.jsx | root | Returns the whole document: `<ProductInfo />`, then `<CartLine />` inside `<Suspense>`
  ProductInfo.jsx | new | Returns the heading and the price, and reads no data
  CartLine.jsx | visitor | Reads the cart with `use(getCart())` and keeps `count` in state
  cart.js | data | Exports `getCart`, which returns a Promise of the visitor's cart
  main.jsx | browser | Calls `hydrateRoot(document, <App />)`, and is built into `/main.js`
```

**PRINCIPLES:** Resuming divides a single server render across build time and request time, after which the browser completes client hydration. Three core principles govern this workflow:
1. **`postponed`: only the place where the build stopped crosses to the server, never the component code.** The request server passes this saved state to `resume` alongside `<App />`, which it imports from its own local codebase.
2. **`resume`: the render starts again at `App`, and only fully prerendered components are skipped.** Code inside the root component executes again for every incoming visitor.
3. **`hydrateRoot`: `Add to cart` answers a tap only after the browser hydrates the page.** The `resume` function produces only static HTML markup, so the client bundle and `hydrateRoot` call remain essential.

---

## PRINCIPLE | `postponed`: only the place where the build stopped crosses to the server, never the component code

> [!PRINCIPLE]
> **Principle 1: What Is Resumed: `postponed` From Storage, `<App />` From the Server's Own Files**
>
> *When `prerender` stops early, the work it still has to do is saved as `postponed`, a JSON object with no component code in it; to finish the page, the request server passes `postponed` together with the same `<App />`, which it imports from its own copy of the code.*
>
> The build and the request may occur hours apart on completely different machines, so whatever crosses between them must exist as durable stored data. The `postponed` object fulfills this role by recording where rendering halted. Because a React component is an executable JavaScript function and JSON cannot serialize functions, component code never travels within `postponed`. The server must import `App` directly, and `resume` requires both inputs to construct the missing HTML.
>
> **DO THIS:**
> ```jsx
> import App from './src/App.jsx';
> const postponed = JSON.parse(await readFile('dist/blue-sneakers.json', 'utf8'));
> const stream = await resume(~<App />~, postponed); // The same <App /> that went to prerender
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import CartLine from './src/CartLine.jsx';
> const postponed = JSON.parse(await readFile('dist/blue-sneakers.json', 'utf8'));
> const stream = await resume(~<CartLine />~, postponed); // **WRONG:** not the node passed to prerender, so the server never makes Cart: 2
> ```

The build script and the request server represent two ends of an extended rendering pipeline. In the build script, `prerender` returns `postponed`, which the build writes to disk as a JSON file:

```jsx title="build.js" startLine="8"
const { prelude, ~postponed~ } = await prerender(<App />, { // The work prerender did not finish
  signal: controller.signal,
  bootstrapScripts: ['/main.js'],
});
await mkdir('dist', { recursive: true });
await writeFile('dist/blue-sneakers.html', prelude);
await writeFile('dist/blue-sneakers.json', ~JSON.stringify(postponed)~); // Written into a file as JSON text
```

In the request server, the handler reads the serialized JSON file back into memory and imports the root component from its local files:

```jsx title="server.js"
import { readFile } from 'node:fs/promises';
import { resume } from 'react-dom/server';
import ~App~ from './src/App.jsx'; // The component code: the server's own copy of our files

export async function handler(request) {
  return new Response(ReadableStream.from(sendPage()), { headers: { 'content-type': 'text/html' } });
}

async function* sendPage() {
  yield await readFile('dist/blue-sneakers.html');
  const postponed = ~JSON.parse~(await readFile('dist/blue-sneakers.json', 'utf8')); // The JSON text, turned back into an object
  const stream = await resume(<App />, postponed);
  yield* stream;
}
```

**The `postponed` state travels from the build environment to the request server, while the component code never travels over the wire because each environment imports it independently.**

### Why `postponed` Can Wait in a File for Hours

Remember how `JSON.stringify` converts a JavaScript data structure into plain text, while `JSON.parse` reconstructs the original object from that string.

Official React documentation defines `postponed` as a JSON-serializable, opaque object. Being JSON-serializable means it can be transformed into standard text and stored safely on disk, in a database, or across network boundaries. This serialization allows a continuous integration server to run the build today, while production web servers load the data hours or days later.

When the request server loads this object, React documentation refers to it as the postponed state. This represents the `postponedState` argument expected by `resume`, loaded from whichever storage backend your system uses. React documentation cites Redis in-memory storage, local files, or Amazon S3 object storage as practical examples. Because the state persists in external storage, the server responding to Alice can run on a completely separate host from the system that executed the build.

```tree dir=right caption="How the two pieces of resume reach the server: postponed from the build, App from the server's own files."
How the two pieces reach `resume` on the server
- +`postponed` from the build [`prerender` `JSON.stringify`] | The build writes it into **`dist/blue-sneakers.json`** | The server reads it back with **`JSON.parse`**
- +`App` from the server's own files [`import App`] | The server imports **`./src/App.jsx`** | The **same file** that the build imported
- +Both together [`resume` `<App />` `postponed`] | React continues the render **on the server** | Makes **`Cart: 2`** for Alice
```

### What `postponed` Cannot Hold: a Component

Inspect the JSON file in the distribution directory after a build, and you will find serialized text. It contains neither HTML markup nor executable JavaScript functions. Although React treats `postponed` as an opaque data structure whose internal fields are private, standard JavaScript rules dictate what it can and cannot hold. Test this snippet in a browser developer console:

```js title="JSON has no place for a function"
JSON.stringify({ count: 2, add: ~() => 1~ }); // Gives '{"count":2}': the function is gone
```

Standard JSON supports strings, numbers, booleans, null, arrays, and plain objects. It provides no mechanism to serialize executable functions or closures. Because every React component is a JavaScript function, the actual implementation of the cart component cannot exist inside `postponed`.

This technical limitation explains why `resume` requires a root React element alongside the stored state. Official React documentation defines this primary parameter as the React node originally passed to `prerender`, typically a root JSX element such as `<App />`.

Compare what occurs when invoking `resume` with and without the root element:

```jsx title="postponed alone vs. <App /> and postponed together"
resume(~postponed~); // **WRONG:** resume needs <App /> first, so this throws a TypeError on the server
resume(~<App />, postponed~); // The code from our files, and the place where the build stopped: makes Cart: 2
```

Storing `postponed` might look like saving a self-contained snapshot of unfinished page work. Yet stored state alone is insufficient. The `postponed` object merely informs React where rendering was interrupted, while `<App />` provides the executable component definitions needed to resume rendering. React provides no mechanism to resume rendering without passing the root component.

### The Same `App.jsx`, Imported Twice

Now compare the two places where `<App />` is written:

```jsx title="The <App /> of build.js and the <App /> of server.js"
await prerender(~<App />~, { signal: controller.signal }); // build.js: imported from ./src/App.jsx
await resume(~<App />~, postponed); // server.js: imported from the same ./src/App.jsx
```

Both calls reference the identical source file, imported into two separate scripts and executed at two distinct times. This matches the exact requirement of the React node parameter.

Resuming cannot proceed if the server passes only the specific component that was postponed. Suppose the server attempts to call `resume` with `<CartLine />` instead of the root component. The server console throws an explicit mismatch error:

```text title="The terminal when server.js resumes with CartLine"
Error: Expected the resume to render <App> in this slot but instead it rendered <CartLine>. The tree doesn't match so React will fallback to client rendering.
```

When this mismatch occurs, React cannot align the resumed execution with the stored tree structure, forcing the browser to fall back to client-side rendering. Alice sees the fallback message `Loading cart...` until the browser bundle finishes loading and renders her cart on the client.

This architectural requirement carries a vital operational consequence. The build process exports only the static files placed in the distribution folder. Consequently, the request server must maintain its own copy of the application source tree, from the root component down to every data module. If a team deploys only the distribution directory without the source files, the server lacks the root component required by `resume`, and dynamic visitor content cannot render.

Keep this distinction clear: `postponed` records where prerendering stopped, while `<App />` supplies the code that executes the remaining work.

---

## PRINCIPLE | `resume`: the render starts again at `App`, and only fully prerendered components are skipped

> [!PRINCIPLE]
> **Principle 2: Re-rendering From the Root: `resume` Calls `App` Again and Skips Only Fully Prerendered Components**
>
> *`resume` does not jump straight to the unfinished part; it renders our components again on the server, starting from `App`, and skips only a component that finished prerendering together with all its children.*
>
> On the page, only the missing part arrives, so resuming looks like running only what is missing. On the server, React starts again at the root, calls every component on the path down to the unfinished one, and skips the components that were complete at build time. Code in `App` therefore runs at build time and again for every visitor.
>
> **DO THIS:**
> ```jsx
> const { prelude, postponed } = await prerender(<App />, { signal: controller.signal, bootstrapScripts: ['/main.js'] });
> ~console.log('Blue Sneakers built');~ // build.js: runs once, at build time
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   ~console.log('Blue Sneakers built');~ // **WRONG:** resume calls App again, so this also prints at every request
>   return (
>     <html>
>       <body>
>         <main>
>           <ProductInfo />
>           <Suspense fallback={<p>Loading cart...</p>}>
>             <CartLine />
>           </Suspense>
>         </main>
>       </body>
>     </html>
>   );
> }
> ```

The phrase resuming where rendering stopped sounds as though the server executes only the missing component. On the rendered web page, that appears to be what happens: only the cart line streams in. Behind the scenes, however, the server must evaluate `App` once again.

We can verify this execution pattern by placing a logging statement inside each component and inspecting terminal output. These logging statements serve solely to track component evaluation across environments.

`ProductInfo` renders the product title and price without fetching external data:

```jsx title="src/ProductInfo.jsx"
export default function ProductInfo() {
  ~console.log('ProductInfo renders');~ // Reads no data, so it finishes at build time
  return (
    <>
      <h1>Blue Sneakers</h1>
      <p>$89</p>
    </>
  );
}
```

`App` renders `<ProductInfo />` alongside the cart component inside a Suspense boundary, logging its own evaluation:

```jsx title="src/App.jsx"
import { Suspense } from 'react';
import ProductInfo from './ProductInfo.jsx';
import CartLine from './CartLine.jsx';

export default function App() {
  ~console.log('App renders');~ // Prints each time React calls App
  return (
    <html>
      <body>
        <main>
          <ProductInfo />
          <Suspense fallback={<p>Loading cart...</p>}>
            <CartLine />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
```

Inside `CartLine`, the logging statement follows the asynchronous `use` call:

```jsx title="src/CartLine.jsx"
import { use, useState } from 'react';
import { getCart } from './cart.js';

export default function CartLine() {
  const cart = use(getCart());
  ~console.log('CartLine renders');~ // Below use: prints only once the visitor's cart has arrived
  const [count, setCount] = useState(cart.count);
  return (
    <>
      <p>Cart: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
    </>
  );
}
```

The user interface presented to Alice remains unchanged. Only the terminal logs reveal which component functions executed in each environment.

### What the Terminal Shows at Build Time and at Request Time

When the build script executes, the terminal shows the following output:

```text title="The terminal while build.js runs"
App renders
ProductInfo renders
DOMException [AbortError]: This operation was aborted
```

Notice that `CartLine renders` does not appear in the build output. The build script aborts `prerender` using an abort controller shortly after starting. At that precise moment, `CartLine` was suspended at `use` while waiting for cart data, preventing execution from ever reaching its log statement. The final logged line displays the abort error emitted when prerendering stops (Lesson 103).

Hours later, when Alice visits the store, her HTTP request triggers the server handler, producing the following terminal output:

```text title="The terminal when Alice's request reaches server.js"
App renders
CartLine renders
```

**During request handling, `App` executes a second time, whereas `ProductInfo` does not execute at all.** Here is the exact sequence React follows on the server:
1. The server invokes `resume(<App />, postponed)`.
2. React begins rendering from the root of the tree and invokes `App` once again. As a result, the message `App renders` prints in the server console even though the server script never called the component directly.
3. React encounters `ProductInfo`. Because this component and all of its descendants completed during the build, React skips it entirely, so no log message appears.
4. React reaches the Suspense boundary wrapping `CartLine`. Because this subtree remained unfinished during the build, React invokes `CartLine`, awaits Alice's cart data, and outputs `CartLine renders`.
5. The resulting stream delivers `Cart: 2` to replace the initial fallback markup on the client.

The final browser view presents the product heading only once. The heading originated in the prerendered HTML file, while the streaming response from `resume` supplies only the deferred content:

```page caption="The Blue Sneakers page after resume: one heading from the file, and Alice's cart from the stream."
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: $89
line: Cart: 2 | good
line: [Add to cart]
```

Official React documentation articulates this behavior in two rules. First, `resume` re-renders from the root until it finds a component that was not fully prerendered. Re-rendering from the root means React begins traversal at `App`, the top of the supplied tree, and evaluates components downward. Second, only fully prerendered components are skipped entirely. The documentation defines fully prerendered to mean that both the component and all of its child elements completed during the build. Being skipped means React avoids invoking that component function during request handling.

### `App` vs. `ProductInfo`: both finished their markup, only `ProductInfo` is skipped

The static product information and dynamic cart components sit side by side inside `App`, yet React treats them differently during request handling:
- **`ProductInfo` requires no external data.** It completed during the build alongside all child elements, so `resume` skips its execution.
- **`CartLine` suspends on asynchronous data.** Because it remained incomplete during the build, `resume` renders it dynamically for each visitor.

Now consider the root component. During the build, `App` and `ProductInfo` seem comparable because both completed their initial JSX markup. Yet at request time, their positions differ fundamentally. The root component contains `CartLine` further down its tree, and that child component was never finished. Because an unfinished child sits within its branch, `App` cannot be classified as fully prerendered, compelling `resume` to re-execute it.

```tree caption="Which of our three components resume calls at request time, and why."
Our three components when Alice's request arrives
- !`App` [`App renders`] | Finished its own markup, **but `CartLine` below it did not** | Not fully prerendered: **called again**
- +`ProductInfo` [no log line] | Finished at build time **with all its children** | Fully prerendered: **skipped**
- !`CartLine` [`CartLine renders`] | **Waited for the cart** and never finished | Unfinished: **rendered for Alice**
```

### Mistake: Build-Only Work Inside `App`

Consider a developer who wants to record build progress by logging a message whenever a page is generated. Because the primary layout in `App` appears in the prerendered file, the developer assumes `App` executes exclusively during the build. They insert a build log at the top of the component:

```jsx title="src/App.jsx" bad="6"
import { Suspense } from 'react';
import ProductInfo from './ProductInfo.jsx';
import CartLine from './CartLine.jsx';

export default function App() {
  ~console.log('Blue Sneakers built');~ // **WRONG:** resume calls App again, so this prints for every visitor too
  return (
    <html>
      <body>
        <main>
          <ProductInfo />
          <Suspense fallback={<p>Loading cart...</p>}>
            <CartLine />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
```

This logging statement prints once during the build, but it prints again in the server console for every incoming visitor request. The same rule applies to any computation placed inside `App` or along the path to `CartLine`. If expensive calculations or environment-specific setup are placed in the root component, every user request pays that performance penalty repeatedly. Logic intended strictly for the build belongs in the build script itself, immediately following the completion of `prerender`.

Remember: resuming does not bypass ancestor components. It evaluates the tree downward starting at `App`.

---

## PRINCIPLE | `hydrateRoot`: `Add to cart` answers a tap only after the browser hydrates the page

> [!PRINCIPLE]
> **Principle 3: Resuming Is Not Hydration: `Add to cart` Answers Only After `hydrateRoot`**
>
> *`resume` only makes HTML on the server; for `Add to cart` to answer a tap, the browser must still load the bundle with the component code and call `hydrateRoot(document, <App />)`, and Effects run only then.*
>
> Because both `resume` and `hydrateRoot` accept `<App />` and continue work started on the server, the term resuming is easily misconstrued as replacing client hydration. In React, `resume` completes server-side markup generation and outputs HTML text. Event handlers such as `onClick` are JavaScript functions that cannot exist inside HTML markup. The handler travels inside the client bundle, and `hydrateRoot` attaches it to the button element.
>
> **DO THIS:**
> ```jsx
> await prerender(<App />, { signal: controller.signal, ~bootstrapScripts: ['/main.js']~ }); // build.js: writes the script tag for the bundle
> hydrateRoot(document, <App />); // src/main.jsx: makes Add to cart answer
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> await prerender(<App />, ~{ signal: controller.signal }~); // **WRONG:** no bootstrapScripts, so the bundle never loads and Add to cart never answers
> ```

Consider a standard HTML document containing a button element. The server transmits markup such as `<button>Add to cart</button>`, which the browser renders immediately on screen. If a user clicks that button, nothing occurs. Raw HTML is purely visual markup, whereas an event handler is an executable JavaScript function living in a script file. The button responds only after client-side script execution registers an event listener on the corresponding DOM element.

React operates under this identical constraint. The streaming markup emitted by `resume` renders a button that appears complete, yet no event listener is attached to the DOM node. The click handler function lives within the component source code. The only channel through which this logic reaches the browser is the client JavaScript bundle. The `hydrateRoot` call serves as the bridge that binds component logic to server-rendered DOM nodes.

### `resume` in the Server File vs. `hydrateRoot` in the Browser File

Both calls receive the root component, and both continue a page that originated on the server. Despite these surface parallels, their responsibilities contrast sharply:

| | With `resume` | With `hydrateRoot` |
| :--- | :--- | :--- |
| **Where it runs** | On the server | In the browser |
| **What it takes** | `<App />` and `postponed` | `document` and `<App />` |
| **What it gives** | A stream of HTML | A root that answers clicks |
| **Which package** | `react-dom/server` | `react-dom/client` |

Official React documentation demonstrates this three-tier architecture in its reference examples. The documentation labels prerendering during the build as layer one, server resumption as layer two, and client hydration as layer three. The interactive button in the official example states this plainly with the label Clicking me requires hydration.

Now examine the root component passed to each call. The server imports the root component from local source files, while the browser downloads the same component within the client bundle. The client browser cannot perform hydration without this component code. Consequently, the JavaScript bundle delivered to the client must contain every component needed for the page, including the root layout, static information, and interactive cart components.

### An Effect Shows the Moment `Add to cart` Starts to Answer

To observe when the page becomes interactive, we place a single Effect inside `CartLine`. The logging statements from Principle 2 have been removed:

```jsx title="src/CartLine.jsx"
import { use, useState, useEffect } from 'react';
import { getCart } from './cart.js';

export default function CartLine() {
  const cart = use(getCart());
  const [count, setCount] = useState(cart.count);

  ~useEffect~(() => { // Runs only in the browser, after hydrateRoot
    console.log('Cart is interactive');
  }, []);

  return (
    <>
      <p>Cart: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
    </>
  );
}
```

Official React reference examples use an identical pattern with a console log announcing that the component reached interactivity.

**The cart count and add button appear on screen before the button can respond to user interaction.** Here is the precise sequence of events:
1. The stream from `resume` reaches the browser. Alice sees her cart count and the add button.
2. If Alice clicks the button immediately, nothing happens. The DOM node exists, but no click handler has been bound to it yet.
3. The server terminal never logs that the cart is interactive, neither during the build nor during request handling. Official React documentation emphasizes that effects run exclusively on the client and never execute during server rendering.
4. The browser finishes downloading the client bundle. The build script injected the necessary script tag into the HTML document through the bootstrap scripts configuration (Lesson 103).
5. Invoking `hydrateRoot(document, <App />)` executes component functions on the client. Every component in the tree runs here, including `ProductInfo`, even though `resume` bypassed it on the server.
6. React attaches event listeners to the existing DOM elements, and the browser console prints that the cart is interactive.
7. When Alice clicks the button now, React updates state and increments the cart counter from 2 to 3.

::: row caption="The resumed Blue Sneakers page: Alice taps Add to cart before and after hydrateRoot runs in the browser."
::: col title="Alice taps before hydrateRoot runs" tone=bad
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: $89
line: Cart: 2 | bad
line: [Add to cart]
console: quiet
```
:::
::: col title="Alice taps after hydrateRoot runs" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: $89
line: Cart: 3 | good
line: [Add to cart]
log: Cart is interactive | CartLine.jsx:9
```
:::
:::

### `postponed` Never Reaches the Browser

The click listener for the add button originates in client bundle code, and React binds it directly to the HTML markup rendered by the server (Lesson 104). The `postponed` state plays no role in client-side execution. That serialized state travels strictly from the build to the request server and terminates there. In the browser environment, `CartLine` executes again, reading cart data through `use` and managing local interaction with component state just as it did on the server.

```tree dir=right caption="The three steps of the resumed page: prerender at build time, resume at request time, hydrateRoot in the browser."
How the Blue Sneakers page becomes interactive
- +1. Build time [`prerender`] | Makes **`Blue Sneakers`**, **`$89`**, and **`Loading cart...`** | Saves the unfinished work as **`postponed`**
- +2. Request time [`resume`] | Runs **on the server** with `postponed` and `<App />` | Streams **`Cart: 2`**, with **no click handler**
- +3. In the browser [`hydrateRoot`] | Loads **`/main.js`** and runs **`App` again** | **`Add to cart` answers**, and the Effect runs
```

### Mistake: No Bundle, Because Resuming Sounds Like No Hydration

The phrasing of the interview question frequently triggers a major misconception. Here is how that mistake unfolds:
1. A developer reads that resuming represents shipping server state without shipping component code.
2. They interpret the term according to other web frameworks, where resumability means client event handlers execute without evaluating component functions in the browser.
3. They assume the React application requires neither client JavaScript bundles nor client hydration.
4. They omit bootstrap scripts from the prerender configuration or delete the client entry script entirely.
5. The browser displays the cart count and button markup, but user clicks never produce a response.

React documentation defines no architecture where client hydration is eliminated for interactive elements. Any HTML produced by React server APIs requires client hydration before event listeners become active. The server state that travels in React is `postponed`, which moves strictly from the build environment to the request server. Component code must still be delivered to the client browser inside the compiled bundle.

Remember: `resume` produces HTML markup on the server, while `hydrateRoot` activates event handlers in the browser.

---

## All 3 Principles Together

### The Complete Resumed Product Page

Here is the complete project, without the temporary log lines and Effect added during our investigation. The data module remains identical to the version from Lesson 103.

`App` returns the whole document, with the product in the shell and the cart inside `<Suspense>`:

```jsx title="src/App.jsx"
import { Suspense } from 'react';
import ProductInfo from './ProductInfo.jsx';
import CartLine from './CartLine.jsx';

export default function App() {
  return (
    <html>
      <body>
        <main>
          ~<ProductInfo />~ {/* Principle 2: finished at build time, so resume skips it */}
          <Suspense fallback={<p>Loading cart...</p>}>
            <CartLine />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
```

`ProductInfo` reads no data:

```jsx title="src/ProductInfo.jsx"
export default function ProductInfo() {
  return (
    <>
      <h1>Blue Sneakers</h1>
      <p>$89</p>
    </>
  );
}
```

`CartLine` reads the visitor's cart and keeps the count that the button changes:

```jsx title="src/CartLine.jsx"
import { use, useState } from 'react';
import { getCart } from './cart.js';

export default function CartLine() {
  const cart = ~use(getCart())~; // Principle 2: unfinished at build time, so resume renders it for each visitor
  const [count, setCount] = useState(cart.count);
  return (
    <>
      <p>Cart: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
    </>
  );
}
```

The build file runs once, at build time:

```jsx title="build.js"
import { mkdir, writeFile } from 'node:fs/promises';
import { prerender } from 'react-dom/static';
import App from './src/App.jsx';

const controller = new AbortController();
setTimeout(() => controller.abort());

const { prelude, postponed } = await ~prerender~(<App />, { // 1. Build time: makes the heading, the price, and the fallback
  signal: controller.signal,
  bootstrapScripts: ['/main.js'],
});
await mkdir('dist', { recursive: true });
await writeFile('dist/blue-sneakers.html', prelude);
await writeFile('dist/blue-sneakers.json', ~JSON.stringify(postponed)~); // Principle 1: only JSON text crosses to the server
```

The server file runs for each visitor's request:

```jsx title="server.js"
import { readFile } from 'node:fs/promises';
import { resume } from 'react-dom/server';
import ~App~ from './src/App.jsx'; // Principle 1: the server's own copy of the component code

export async function handler(request) {
  return new Response(ReadableStream.from(sendPage()), { headers: { 'content-type': 'text/html' } });
}

async function* sendPage() {
  yield await readFile('dist/blue-sneakers.html');
  const postponed = JSON.parse(await readFile('dist/blue-sneakers.json', 'utf8'));
  const stream = await ~resume~(<App />, postponed); // 2. Request time: makes Cart: 2 for this visitor
  yield* stream;
}
```

The browser file runs in the browser:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

~hydrateRoot~(document, <App />); // 3. In the browser, Principle 3: Add to cart answers a tap
```

### The Order in Which React Calls Our Components

React calls our components at three moments, and a different set of them each time:

```tree dir=right caption="Which components React calls at build time, at request time, and in the browser."
When React calls our three components
- +1. Build time: `prerender` [`App` `ProductInfo` `CartLine`] | Calls all three; **`CartLine` waits** for the cart and is stopped | The file holds **`Blue Sneakers`**, **`$89`**, and **`Loading cart...`**
- +2. Request time: `resume` [`App` `CartLine`] | Calls `App` again from the root, **skips `ProductInfo`**, renders `CartLine` | The stream fills in **`Cart: 2`**
- +3. In the browser: `hydrateRoot` [`App` `ProductInfo` `CartLine`] | Calls **all three** again and reuses the HTML | **`Add to cart`** answers a tap
```

| The question | The answer on our page |
| :--- | :--- |
| **What is resumed?** | The render that `prerender` stopped before `CartLine` had its cart, saved as `postponed`. |
| **From where?** | `postponed` from `dist/blue-sneakers.json`; the component code from the server's own import of `App`. |
| **What runs again on the server?** | `App` and `CartLine`. `ProductInfo` finished at build time, so `resume` skips it. |
| **What reaches the browser?** | The HTML of the file and of the stream, and the bundle `/main.js` with all three components. Never `postponed`. |
| **When does `Add to cart` answer?** | After `hydrateRoot(document, <App />)` runs in the browser. |

Remember the core rule of this lesson. **Resuming divides a single server render across build time and request time. Only `postponed` state travels between those two environments, and the browser must still perform hydration afterwards.**

---

## For the Interview

> **The Interview Question:** What does resuming mean: shipping server state without shipping component code?

### How to Answer Clearly in 30 Seconds

"In React, resuming means continuing a server render that was intentionally paused during the build step. React implements this through Partial Prerendering. Shared static content is generated once during compilation, while user-specific dynamic content is generated during request handling. Three core facts explain the architecture:
1. **What resumes and where it comes from**: the unfinished rendering work is stored as `postponed`, an opaque, JSON-serializable object. During request handling, the server loads this state from storage and passes it to `resume` alongside the root component element. The stored state contains no executable component code.
2. **What executes on the server**: `resume` re-renders down from the root until it reaches components that were not completed at build time. Components that fully completed alongside all descendants are skipped.
3. **Why resuming is not hydration**: `resume` executes on the server to generate streaming HTML text. The browser must still download the client bundle and invoke `hydrateRoot` before event handlers and effects can activate."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Is the server state shipped to the browser?"**
   No. The server state that travels is `postponed`, and it moves strictly from the build machine to the request server. Official React documentation notes that this state can be loaded from Redis, local files, or S3 storage. It enters `resume` on the server and never reaches the client. The browser receives only HTML markup from the static file and dynamic stream, accompanied by the client bundle for hydration. The state must be JSON-serializable because it is persisted across different processes and machines. Because JSON cannot represent functions, component code cannot travel inside it.
2. **"Does `resume` render the whole tree again?"**
   React re-renders from the root component downward until it reaches incomplete subtrees. Official documentation specifies that `resume` evaluates components down from the root until encountering a component that was not fully prerendered. Components that finished completely alongside all children during the build are skipped. On our page, `App` runs again because its child `CartLine` was suspended, while `ProductInfo` is skipped. If `prerender` completes the entire tree during the build, `postponed` is `null` and there is nothing to resume (Lesson 119).
3. **"Then what in React ships no component code to the browser?"**
   React Server Components ship no component code to the browser. React documentation confirms that Server Components never execute on the client and only their rendered output travels across the network. That capability is an entirely different architectural feature from resuming (Lesson 101). In a resumed application, Client Components like `CartLine` are still packaged into the client bundle and hydrated. The exact format Server Components send to the browser instead of source code is explored in Lesson 124.

```tree dir=right caption="Interview summary: what resuming moves, where it runs, and what still happens in the browser."
Resuming in React vs. hydration
- +Resuming [`prerender` `resume`] | Continues **the server render** from `postponed` | Runs **on the server** and makes **HTML**
- +Hydration [`hydrateRoot`] | Runs **our components again in the browser** | Connects **click handlers** and starts **Effects**
- !Not in React [no component runs in the browser] | A click handler that runs **without hydration** | React's docs **describe no such step**
```
