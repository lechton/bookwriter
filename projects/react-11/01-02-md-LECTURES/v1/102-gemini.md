# Lecture 102: What Server-Side Rendering Changes on the First Screen

*(Why does a server-rendered page show up at once, yet ignore the first tap?)*

> INTERVIEW QUESTION | ❱ CORE | What is server-side rendering, and what does it solve?

---

## VS | Client-Side Rendering vs. Server-Side Rendering: both end with the same page, only one sends it already filled

> In a client-only app, the server sends an empty HTML element, so the screen stays blank until the JavaScript executes. **With server-side rendering, the server executes your components first and sends complete HTML, so the screen fills immediately**. Interactive buttons still wait for the JavaScript, because the server sends static markup, not event listeners.

Consider a basic static web page. A simple HTML file contains a heading tag with text. The browser parses that file and paints the text the moment bytes arrive, requiring no JavaScript at all.

A client-only React application built with Vite works differently. **Its initial HTML document contains only an empty container element.** Everything you see is built later with JavaScript. On a fast network and a powerful laptop, that delay is barely noticeable. On a mobile device with a slow connection, the visitor stares at a blank white screen for several seconds. Server-side rendering solves this delay. **The server executes your components in advance and returns fully formed HTML markup**, delivering visible content on the very first network response.

Think of an online store. A customer follows a shared link to a product page displaying a pair of shoes, a price, and an add-to-cart button. What does the device need to display the product name and price? It needs only HTML markup and styles. What does the device need to make the button respond to clicks? It needs JavaScript, because a click handler is an executable function.

**Why:** In a client-only architecture, the product details must wait for JavaScript to download, compile, and execute before appearing on screen. The official documentation notes that this delay feels noticeably slow. Server-side rendering delivers the text content and layout immediately inside the initial HTML document. Yet the action button still cannot react until the script finishes loading. The visual presentation appears complete before the underlying logic is attached, so any tap during those opening seconds produces no response.

Keep this central principle in mind throughout this lesson:

**The server sends what the page looks like. The JavaScript brings what the page does.**

### Back to a Plain HTML File

Compare three different HTML payloads that a browser can receive across the network:

```html title="Three files the phone can receive"
<h1>Blue Sneakers</h1> <!-- A plain HTML page: you wrote the heading by hand -->
~<div id="root"></div>~ <!-- Vite alone: empty, the JavaScript fills it later -->
~<div id="root"><h1>Blue Sneakers</h1></div>~ <!-- Server-side rendering: React filled it on the server -->
```

Both the static file and the server-rendered file present the heading right away. The client-only file remains completely blank until the client script downloads and mounts the application.

> [!DEFINITION]
> **The root and createRoot.** [REVIEW] In a client-only application, the server returns an HTML shell containing an empty element, `<div id="root"></div>`, and a script tag for the application bundle.
> The entry file calls `createRoot` on that element and runs `render(<App />)` to construct the component tree and DOM nodes inside it.
> Until that script downloads and executes, the container element has no children and the screen stays blank (Lessons 07 and 46).

> [!DEFINITION]
> **First Contentful Paint.** [REVIEW] First Contentful Paint measures the exact moment the browser renders the first piece of document content, such as text, an image, or non-white canvas elements.
> MDN defines it as the first time users can consume page content.
> In a client-only app, this moment is delayed until the JavaScript bundle runs, whereas server-side rendering achieves it as soon as the HTML markup streams in (Lesson 46).

> [!DEFINITION]
> **What is server-side rendering?** [NEW] Server-side rendering is an architecture where the web server executes your React component tree, serializes the resulting markup into an HTML string, and sends that pre-filled document to the client.
> The browser parses and paints that HTML before loading client scripts, reaching First Contentful Paint immediately.
> You write and maintain one shared component: the exact same `App` runs on both the server and the client.
> Crucially, static HTML contains visual presentation and text, but cannot carry active event listeners; interactivity activates only when client scripts arrive (Lesson 102).

The official documentation summarizes this mechanism directly: "Server rendering creates an illusion that the app loads faster by showing the HTML snapshot of its output."

### Three Ways to Make the First HTML

A team decides how each page delivers its initial HTML content (as seen in Lesson 46). Three primary rendering models exist:
1. **Client-side rendering.** The server sends an empty root container, and the browser builds the entire interface using `createRoot`. This pattern works well for authenticated dashboards and private administrative tools where public search indexing is unnecessary.
2. **Server-side rendering.** The server generates fresh HTML dynamically on each incoming request. This model is ideal for public pages with frequently changing data, such as product listings with real-time inventory and pricing. MDN explains that the server generates content on the fly because pre-generating every possible page is impractical.
3. **Static site generation.** The HTML markup is generated once at build time and served through a content delivery network. This approach suits pages that remain identical for all visitors, such as documentation or legal terms (compared in Lesson 103, taught in Lesson 119).

In production, web frameworks manage these rendering strategies automatically. In this lesson, we build server-side rendering manually using its two foundational primitives:
- **A server function call:** `renderToString` executes `App` on Node.js and serializes its output into an HTML string.
- **A browser function call:** `hydrateRoot` adopts that server-rendered markup in the browser and attaches active event listeners.

### The Rule of Thumb: does it look ready, or is it ready?

**Always evaluate a server-rendered page with one test: does the interface merely look complete, or can it handle user interactions? The HTML produces the visual layout. Only client JavaScript activates event listeners.**

Experienced engineers watch for five widespread mistakes:
1. **Assuming visual presence equals interactivity.** A tap made before client scripts execute is dropped silently.
2. **Assuming the browser downloads less code.** The client still fetches the entire component bundle to hydrate the page.
3. **Leaving `createRoot` in the client entry point.** That call discards the server markup and rebuilds the DOM from scratch.
4. **Fetching essential data inside `useEffect`.** The server never executes Effects, so the resulting HTML delivers only a loading placeholder.
5. **Believing server rendering benefits only search crawlers.** The official documentation warns that treating server rendering strictly as an SEO tactic is a common misunderstanding.

The rest of this lesson examines each scenario using a concrete product page.

## SECTION | A Product Page on a Slow Phone

The sample application displays a product title, a price, an action button, and a counter tracking items in the cart:

```page width=text caption="The product page of the shop, open in the developer's browser."
url: shop.example.com
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0
```

Here is the complete implementation inside a single component, hardcoding the product data for this initial step:

```jsx title="src/App.jsx"
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>Blue Sneakers</h1>
      <p>$49</p>
      <button ~onClick~={() => setCount(count + 1)}>Add to cart</button> {/* A JavaScript function: it cannot travel inside HTML */}
      <p>Cart: {count}</p>
    </main>
  );
}
```

In the client-only version, the entry file mounts the tree with `createRoot` (as seen in Lesson 07). The server-rendered version introduces a server file and updates a single line in the client entry point:

```files title="shop: File Explorer" caption="The files of the server-rendered product page."
server.js | server | Calls `renderToString(<App />)` and sends the HTML inside the root
src/
  App.jsx | page | Exports `App` as default: the same component on the server and in the browser
  main.jsx | boundary | Imports `App` and calls `hydrateRoot` on the HTML from the server
```

A user opens the link on a mobile device over a congested mobile connection. The button appears immediately, and the visitor taps it without waiting. Nothing happens. Several seconds later, after client scripts finish initializing, the user taps again and the counter increments to one:

::: row caption="The same product page on a slow phone: blank without server rendering; with it, the product at once, a lost tap, and a working tap later."
::: col title="Client-only, first seconds" tone=bad
```page size=mini
url: shop.example.com
blank
```
:::
::: col title="Server-rendered, first seconds" tone=bad
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0 | bad
```
:::
::: col title="Server-rendered, after the JavaScript runs" tone=good
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 1 | good
```
:::
:::

**It may look the same, but it is NOT the same thing!** Before any user interaction, the initial server-rendered layout and the post-hydration view appear pixel-identical. Yet on the initial screen, the browser possesses no registered event listeners. Only after client hydration finishes does React attach our click handler to the rendered button.

```tree dir=right caption="What arrives with the HTML from the server, and what arrives only with the JavaScript."
What reaches the phone, in order
- +1. The HTML from the server [`Blue Sneakers` `$49` `Add to cart`] | What the page **looks like** | The user can **read the product** at once
- !2. The time in between | The button is on the screen, **but no code of ours is listening** | A tap is **lost**, and nothing on the screen says so
- +3. The JavaScript [`onClick`] | What the page **does** | The same tap now changes the line to **`Cart: 1`**
```

The overarching rule remains constant: **the server sends what the page looks like. The JavaScript brings what the page does.**

**PRINCIPLES:** Server-side rendering divides the initial visit into two distinct stages. First, the HTML document arrives to display the layout. Second, client scripts execute to activate user controls. Five core principles govern this flow:
1. **Principle 1: renderToString: The Server Runs App and Sends Its HTML.** On the server, `renderToString` executes components to produce static HTML markup. The browser paints this markup before loading client scripts.
2. **Principle 2: Non-Interactive HTML: The Server Sends the Look, Not the Clicks.** Static HTML carries visual elements but cannot serialize event handlers. Buttons stay inert until client scripts execute, whereas standard hyperlinks work immediately.
3. **Principle 3: hydrateRoot: Reuse the Server HTML Instead of Rebuilding It.** In the browser, `hydrateRoot` preserves the server-rendered DOM elements and binds event listeners. Replacing it with `createRoot` destroys and reconstructs the markup.
4. **Principle 4: Effects Run Only in the Browser: Load the Data Before the Server Renders.** React never executes `useEffect` during server rendering. Components that fetch data inside Effects will serialize only empty loading states.
5. **Principle 5: Two Runs of One App: The Content Moves Earlier, the JavaScript Does Not.** The client still downloads the same JavaScript bundle and executes `App` a second time. Server rendering accelerates initial visibility, not script delivery.

---

## PRINCIPLE | `renderToString`: the server turns `App` into HTML before any JavaScript loads

> [!PRINCIPLE]
> **Principle 1: renderToString: The Server Runs App and Sends Its HTML**
>
> *On the server, call `renderToString(<App />)` from `react-dom/server` and send the string inside the root, so the browser shows the content before any JavaScript loads.*
>
> In a client-only app, the root arrives empty and the user waits on a blank page. `renderToString` runs the same `App` the browser runs and returns its HTML as plain text. When the server sends that text inside the root, the phone paints the product as soon as the file arrives. `renderToString` belongs in the server file only: imported into browser code, it only makes the bundle bigger.
>
> **DO THIS:**
> ```jsx
> app.use('/', (request, response) => {
>   const html = ~renderToString(<App />)~; // In server.js: the server runs App and gets its HTML
>   response.send(`<div id="root">${html}</div><script type="module" src="/bundle.js"></script>`);
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { ~renderToString~ } from 'react-dom/server'; // **WRONG:** in browser code, this only makes the bundle bigger
>
> const iconHtml = renderToString(<Icon />);
> ```

In standard JavaScript, generating markup involves joining strings together:

```js title="Plain JavaScript: HTML as a string"
const name = 'John';
const html = ~'<h1>Hello, ' + name + '</h1>'~; // html holds the text '<h1>Hello, John</h1>'
```

The `renderToString` function performs the same role for your React components. It evaluates your JSX hierarchy and outputs the generated markup as a standard string:

```jsx title="The same string, from a React component"
import { ~renderToString~ } from 'react-dom/server'; // The part of React that runs on the server

function App() {
  return <h1>Hello, John</h1>;
}

const html = ~renderToString(<App />)~; // html holds the text '<h1>Hello, John</h1>'
```

The web server transmits neither an image nor a live application runtime. It returns plain text identical to handcrafted HTML.

> [!DEFINITION]
> **What is renderToString?** [NEW] `renderToString` is a React server API that evaluates your component hierarchy and returns its rendered HTML as a plain string. React exposes it through the `react-dom/server` package.
> The official documentation notes that these APIs run solely on the server to produce initial markup, and regular components should never import them.
> Importing `react-dom/server` in client-side code causes no syntax crash, but forces the browser to download dead server serialization code, needlessly bloating bundle size (Lesson 102).

### The Same `App` on the Server and in the Browser

Which component does the server render? It renders the exact same component used by the client. Both environments import the identical file:

```jsx title="One App file, imported in two places"
import ~App~ from './src/App.jsx'; // In server.js: the server runs App to write the HTML
import ~App~ from './App.jsx'; // In main.jsx: the browser runs App to make the page answer
```

**Yes, it is the exact same thing!** The relative import paths differ only because the server entry script sits in a different directory. The same component executes twice: first on the server to produce markup, and later in the browser to bind event listeners.

### The Server Sends the HTML Inside the Root

Here is the server implementation for the store. For each incoming request, it executes `App` and injects the resulting HTML into the root container:

```jsx title="server.js"
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

app.use('/', (request, response) => {
  const html = ~renderToString(<App />)~; // Runs App and returns its HTML as a string
  response.send(`
    <div id="root">${html}</div>
    <script type="module" src="/bundle.js"></script>
  `); // Sends the page: the HTML inside the root, then the script tag that loads the bundle
});
```

Several identifiers here belong to the Node.js server framework rather than React. The official documentation points out that route handler syntax varies across backend frameworks.
- **`app`** represents the web server instance created by the backend framework.
- **`app.use`** registers a route handler that executes whenever a client requests the root path.
- **`request`** and **`response`** represent the incoming HTTP request and the outgoing HTTP response streams.
- **`response.send`** delivers the final HTML string back to the requesting browser.

The root container and the script tag match the structure of a client-only document (as seen in Lesson 07). The key distinction is that the container arrives fully populated.

### The Empty Root vs. the Root with the Product

Compare the root elements delivered to the browser across both rendering strategies:

```html title="The root in the file that reaches the phone, without and with server rendering"
~<div id="root"></div>~ <!-- With createRoot only: empty until the JavaScript runs -->
~<div id="root"><main><h1>Blue Sneakers</h1><p>$49</p>...</main></div>~ <!-- With renderToString: the product is already inside -->
```

**It may look the same at the end, but it is NOT the same thing!** After client scripts initialize, both pages present identical content. Before that execution completes, only the server-rendered page displays any information. Server-side rendering shifts First Contentful Paint from the end of script execution to the arrival of the first HTML document.

```tree caption="The HTML that reaches the phone with createRoot only, and with renderToString on the server."
What the root holds when the file reaches the phone
- !Client-only, with `createRoot` [`<div id="root"></div>`] | The root is **empty** | **Blank page** until the JavaScript downloads and runs
- +Server-rendered, with `renderToString` [`<div id="root"><main>...</main></div>`] | The root holds **the product** | First Contentful Paint comes **as soon as the HTML arrives**
```

### The Empty Comments React Writes into the HTML

Inspect the raw page source of the server-rendered document as delivered over the network. The cart line contains an unexpected artifact:

```html title="The page source: the root of the product page"
<div id="root"><main><h1>Blue Sneakers</h1><p>$49</p><button>Add to cart</button><p>Cart: <!-- -->0</p></main></div>
```

An empty comment sits between the static label and the dynamic number. React automatically inserts this marker during server rendering. In standard HTML, adjacent text nodes merge into a single text node during parsing. React inserts comment boundaries so client-side hydration can distinguish static text from dynamic expressions without re-rendering adjacent words. The official documentation displays this identical comment structure. Application code never writes these markers, and browsers never render them visually.

---

## PRINCIPLE | `onClick` in the server HTML: the button shows, but a tap does nothing until the JavaScript runs

> [!PRINCIPLE]
> **Principle 2: Non-Interactive HTML: The Server Sends the Look, Not the Clicks**
>
> *The HTML from the server has no click handlers; a button with `onClick` answers only after the JavaScript has loaded and React has attached to the page, while a plain link works at once.*
>
> The user sees the product page as soon as the HTML arrives, so it looks ready. But `onClick` is a JavaScript function, and it never travels inside the HTML. Until the JavaScript has run, a tap on the button is lost, and nothing on the screen says so. Plan for that time instead of counting the page as ready when it looks ready. When a control only takes the user to another page, make it a link, because a link works before the JavaScript arrives.
>
> **DO THIS:**
> ```jsx
> <a ~href="/"~>All products</a> {/* Works before the JavaScript loads: the browser follows the link */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button ~onClick~={() => { window.location.href = '/'; }}>All products</button> {/* **WRONG:** a tap before the JavaScript runs is lost */}
> ```

Here is a minimal interactive button along with the markup generated by the server:

```jsx title="A button with a click handler"
function App() {
  const [count, setCount] = useState(0);
  return <button ~onClick~={() => setCount(count + 1)}>Cart: {count}</button>; // The click handler is a JavaScript function
}
```

```html title="The same button in the HTML from the server"
<button>Cart: <!-- -->0</button>
```

The visible text renders into the HTML string, but the click handler is omitted completely. An HTML document is flat text and cannot serialize function closures or memory references. Consequently, the server sends the visual representation of the control without the logic needed to respond.

> [!DEFINITION]
> **What is non-interactive HTML?** [NEW] Non-interactive HTML is markup that the browser paints visually, but which cannot handle user events because no JavaScript listeners are registered.
> The official documentation describes this output as an initial non-interactive HTML snapshot of your components.
> A snapshot captures the visual state of the component tree at a single point in time, omitting all behavioral handlers (Lesson 102).

### Why the First Tap on `Add to cart` Is Lost

**Beware! A page that looks finished is not a page that works.** Here is the progression of an initial visit over a slow mobile connection:
1. The server responds with the HTML document for the product listing.
2. The browser parses the document and paints the title, price, button, and cart counter.
3. The browser initiates the download of the client JavaScript bundle and its dependencies.
4. The visitor taps the add-to-cart button immediately.
5. Because the browser has not yet registered an event listener on the element, the click is ignored without error.
6. The JavaScript bundle finishes downloading and executes, enabling React to attach event listeners to the DOM.
7. The visitor taps the button a second time, and the counter successfully increments to one.

```page width=text caption="The product page on the slow phone after a tap on Add to cart, before the JavaScript has run."
url: shop.example.com
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0 | bad
```

Notice where the initial zero originated: the server initialized state at zero and serialized that value into static text. That counter existed solely during the server rendering pass. Until client hydration completes, no active state binding connects the number to the button on screen.

### A Link vs. a Button in the Server HTML

Now add a navigation hyperlink to the product layout, leading back to the catalog:

```jsx title="src/App.jsx" startLine="6"
    <main>
      ~<a href="/">All products</a>~ {/* A plain HTML link: the browser follows it by itself */}
      <h1>Blue Sneakers</h1>
      <p>$49</p>
      ~<button onClick={() => setCount(count + 1)}>Add to cart</button>~ {/* What it does lives in our JavaScript */}
      <p>Cart: {count}</p>
    </main>
```

Both controls appear inside the server-rendered HTML. **It may look the same, but it is NOT the same thing!** Before client scripts execute:
- **Tapping the catalog link** navigates to the target URL immediately. The browser possesses native navigation behavior for anchor tags that requires zero custom JavaScript.
- **Tapping the cart button** produces no result. The button depends entirely on our custom click handler, which exists only inside the pending JavaScript bundle.

MDN confirms this distinction across all server-rendered applications: basic navigation and text consumption function without scripts, while client-side interaction remains disabled until hydration.

```tree caption="A link and a button in the server HTML, before the JavaScript has run."
Two parts of the server HTML before the JavaScript runs
- +A link [`<a href="/">`] | The **browser** knows what a link does | A tap **opens the list** at once
- !A button with a handler [`onClick`] | What it does lives in **our JavaScript** | A tap is **lost**, and `Cart: 0` stays
```

### Why This Bug Ships

Teams frequently release this flaw without detecting it during local development:
1. The team enables server-side rendering and observes fast visual rendering during internal testing.
2. Metrics show that initial content paints in under one second.
3. A customer on an unstable mobile connection visits the site and taps the action button during initial rendering.
4. The application drops the unhandled tap, leading the frustrated visitor to abandon the store.
5. Developers on high-speed office networks never observe the issue because client scripts execute before a human can tap.

Always remember: **the server sends what the page looks like. The JavaScript brings what the page does.**

---

## PRINCIPLE | `hydrateRoot`: React keeps the server HTML and attaches the click handlers to it

> [!PRINCIPLE]
> **Principle 3: hydrateRoot: Reuse the Server HTML Instead of Rebuilding It**
>
> *When the root arrives with HTML from the server, start React with `hydrateRoot(document.getElementById('root'), <App />)`, not with `createRoot`.*
>
> `createRoot` was made for an empty root. On a root full of server HTML, its `render` call deletes that HTML and builds every node again, which drops the user's focus and puts any list that scrolls inside the page back at its top. `hydrateRoot` runs `App` in the browser, keeps the nodes the server sent, and attaches the click handlers to them.
>
> **DO THIS:**
> ```jsx
> ~hydrateRoot~(document.getElementById('root'), <App />); // Reuses the server HTML and attaches onClick
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> createRoot(document.getElementById('root')).~render(<App />)~; // **WRONG:** deletes the server HTML and builds it again
> ```

Recall how DOM event listeners work in vanilla JavaScript. When markup already exists in the document, you avoid recreating the nodes. You query the existing element and register a listener directly:

```js title="Plain JavaScript: the HTML is already there, add only the behavior"
const button = document.querySelector('button');
~button.addEventListener('click', addToCart)~; // The same button stays on the page, now it answers
```

The existing DOM structure remains intact while gaining interactive behavior. The `hydrateRoot` function accomplishes this exact operation across your entire application. It scans the existing DOM tree produced by the server, preserves each element, and binds your React event handlers directly to those nodes.

In contrast, `createRoot` clears the container completely and reconstructs every DOM node from scratch. While appropriate for an empty container, calling it on server-rendered markup destroys the server work and forces wasteful DOM reconstruction.

```jsx title="The two ways main.jsx can start React"
createRoot(document.getElementById('root')).~render(<App />)~; // Deletes the HTML inside the root, then builds every node again
~hydrateRoot~(document.getElementById('root'), <App />); // Keeps the HTML inside the root and attaches the click handlers to it
```

Both functions reside in the client package of React DOM. Unlike `createRoot`, `hydrateRoot` receives the component element directly and immediately initiates reconciliation without a separate render invocation. The official documentation advises calling `hydrateRoot` to attach React to markup previously generated in a server environment.

> [!DEFINITION]
> **What is hydration?** [NEW] In everyday language, hydrating means adding moisture to a dry structure. Static server HTML represents the dry foundation: it defines visual layout and content, but lacks active logic.
> Hydration is the process where React traverses that existing DOM structure, reconciles it with the component tree, and binds event listeners without recreating DOM elements.
> The official documentation explains that hydration transforms an initial server snapshot into a fully responsive, interactive client application (Lesson 102).

Detailed mechanics of the hydration algorithm are explored in Lesson 104.

### Where the Click Handler Comes From

The client button receives its event listener through a second execution of `App`. React executes the component tree inside the browser, matches virtual nodes against the rendered DOM elements, and registers event handlers. The official documentation notes that client rendering executes again specifically to attach event handlers to that existing markup.

This requirement explains why `hydrateRoot` requires `<App />`. The client must evaluate the exact same component structure that the server passed to `renderToString`. Any divergence between the two render passes risks hydration mismatch errors.

```jsx title="src/main.jsx"
import { ~hydrateRoot~ } from 'react-dom/client'; // The same package as createRoot
import App from './App.jsx';

~hydrateRoot~(document.getElementById('root'), <App />); // The same App the server rendered: React reuses its HTML and attaches onClick
```

### Mistake: Keeping `createRoot` After Adding the Server

**It may work the same at first, but it is NOT the same thing!** Because both methods eventually produce a functional page, developers often overlook this defect. Here is what happens when an engineer implements server rendering but fails to update the client entry point:
1. The browser renders the initial layout immediately from the server markup.
2. A keyboard user presses the Tab key, focusing the add-to-cart button.
3. Client scripts finish downloading and trigger `render` on a container that already holds DOM nodes.
4. React wipes out all existing children within the container and creates new DOM nodes from scratch.
5. The focused button element is destroyed, clearing user focus. Any scrollable container resets its scroll position to the top.

The official documentation notes that calling `createRoot` and `render` on existing markup deletes that HTML and re-creates all DOM nodes from scratch. This introduces performance penalties, destroys keyboard focus, resets scroll positions, and discards uncommitted form inputs.

With `hydrateRoot`, React preserves existing DOM nodes rather than destroying and recreating them.

::: row caption="The same main.jsx with createRoot and with hydrateRoot, on a root that arrives full of HTML from the server."
::: col title="createRoot on server HTML" tone=bad
```jsx title="src/main.jsx" bad="4"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
```
React deletes the server HTML and builds it again. The focused button loses its focus.
:::
::: col title="hydrateRoot on server HTML" tone=good
```jsx title="src/main.jsx" good="4"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

hydrateRoot(document.getElementById('root'), <App />);
```
React keeps the server HTML and attaches the click handlers to it.
:::
:::

The requirement applies symmetrically across architectures:
- **When the container arrives pre-filled with server markup:** call `hydrateRoot`. The documentation warns that `createRoot` is unsupported for server-rendered HTML.
- **When the container arrives empty:** call `createRoot`. The documentation specifies that `hydrateRoot` is unsupported when no server HTML is present.

Full-stack frameworks usually generate this initialization code behind the scenes. Nonetheless, understanding this boundary is essential for diagnosing hydration defects.

Revisit the core takeaway: **the server sends what the page looks like. hydrateRoot brings what the page does**, preserving existing visual elements.

---

## PRINCIPLE | `useEffect` on the server: it never runs, so the server HTML holds only the loading line

> [!PRINCIPLE]
> **Principle 4: Effects Run Only in the Browser: Load the Data Before the Server Renders**
>
> *A product loaded in `useEffect` is not in the server HTML; get the data before the render, with the framework's data loading, so the server can write it into the HTML.*
>
> The server runs `App` once and never runs its Effects. If the product arrives in an Effect, the server writes the loading line, and the product appears only after the JavaScript has run and the request has come back. When the data is ready before the render, the server writes the product straight into the HTML.
>
> **DO THIS:**
> ```jsx
> export async function ~loader~() { // The framework calls this before rendering, on the server too
>   return getProduct();
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   ~getProduct().then(setProduct)~; // **WRONG:** never runs on the server, so the server HTML holds only Loading...
> }, []);
> ```

In real production applications, product data arrives dynamically from a database or service API. Here is the product component fetching data inside an Effect (as seen in Lesson 33). The asynchronous helper function simulates fetching from a backend service (as seen in Lesson 46):

```jsx title="src/App.jsx"
export default function App() {
  const [product, setProduct] = useState(null);
  ~useEffect~(() => { // Never runs on the server
    getProduct().then(setProduct);
  }, []);
  if (!product) return <p>Loading...</p>;
  return (
    <main>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </main>
  );
}
```

```html title="The root in the HTML from the server"
~<div id="root"><p>Loading...</p></div>~ <!-- The product is not here -->
```

Consider how the server processes the `App` component. It invokes the function synchronously once to serialize the returned JSX into a string. During that initial synchronous pass, state remains `null`, causing the component to render the fallback loading element. Effects execute only after React commits changes to a live browser DOM. Because Node.js lacks a browser document and display surface, React never executes Effects on the server. The official documentation confirms that Effects run solely on the client and never execute during server rendering.

### Why the First Screen Still Says `Loading...`

**Beware! The team added server rendering for a fast first screen, and the first screen says Loading... .** Here is how this architectural defect unfolds on a mobile connection:
1. The server evaluates the component while the product state holds its initial `null` value.
2. The server bypasses the Effect and serializes the fallback loading message into HTML.
3. The mobile device receives the document and paints the loading placeholder immediately.
4. Client scripts download and execute, hydrating the static loading placeholder.
5. Only after hydration does the client mount trigger the Effect, initiating a network request for product data.
6. The network response arrives, triggers a state update, and finally renders the actual product details.

The official documentation explains this pitfall directly: the initial server markup includes only a loading indicator. The client must download all JavaScript and render the app before it even discovers that it needs to fetch data.

**It may look the same, but it is NOT the same thing!** On a high-speed development machine, both approaches appear instantaneous. Over a sluggish mobile connection, the flawed version forces the user to wait through a loading screen, while properly pre-fetched data renders immediately:

::: row caption="The first screen on the slow phone: data loaded in an Effect, and data the server has before it renders."
::: col title="Product loaded in an Effect" tone=bad
```page size=mini
url: shop.example.com
line: Loading... | bad
```
:::
::: col title="Product ready before the render" tone=good
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: $49 | good
```
:::
:::

### Getting the Data Before the Server Renders

The solution requires loading data before the component renders on the server. Modern full-stack frameworks accomplish this through asynchronous route loaders (as seen in Lesson 46). The framework invokes the loader function, awaits the resolved data, and provides that data directly to the component before generating markup:

```jsx title="The product route in a framework"
export async function ~loader~() { // The framework calls it before Product renders, on the server too
  return getProduct();
}

export default function Product({ loaderData }) {
  return (
    <main>
      <h1>{loaderData.name}</h1> {/* Blue Sneakers is already in the server HTML */}
      <p>${loaderData.price}</p>
    </main>
  );
}
```

The official documentation advises teams using a framework to rely on its native data loading mechanisms. Advanced patterns for structuring server data fetching are taught in Lesson 128.

### Why This Bug Ships

This misunderstanding leads many engineering teams to abandon server rendering prematurely:
1. The team migrates a client-rendered application to a server-rendering framework.
2. The components retain existing data fetching routines inside `useEffect`.
3. The server produces an HTML document containing only a loading spinner or placeholder.
4. Automated search indexers and social media crawlers read the loading message instead of relevant product data. MDN emphasizes that crawlers typically do not execute JavaScript.
5. Mobile visitors experience no performance improvement, prompting the team to conclude mistakenly that server rendering provides no benefit.

---

## PRINCIPLE | `import App` in `main.jsx`: the browser still downloads and runs the whole app

> [!PRINCIPLE]
> **Principle 5: Two Runs of One App: The Content Moves Earlier, the JavaScript Does Not**
>
> *With `renderToString` and `hydrateRoot`, the browser downloads the same JavaScript as in the client-only app and runs `App` again; server rendering changes when the content appears, not how much JavaScript the page needs before it answers a tap.*
>
> The server runs `App` to write the HTML. The browser runs `App` again to attach the click handlers, so `App` and all its imports must still download. To make the first working tap come earlier, the code itself must shrink or split, with tools such as Server Components and code splitting.
>
> **DO THIS:**
> ```jsx
> const Reviews = ~lazy~(() => import('./Reviews.jsx')); // Code splitting: the code of Reviews downloads later, so the button answers sooner
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import ~Reviews~ from './Reviews.jsx'; // **WRONG:** the server already rendered the reviews, but their code still downloads before the button answers
> ```

Examine the import declarations in the client entry file:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
~import App from './App.jsx';~ // App and everything it imports go into the bundle, as before

hydrateRoot(document.getElementById('root'), <App />);
```

Because the client entry imports `App`, the root component and its full dependency tree remain bundled into client assets. The client runtime requires all of this code because it must execute the component hierarchy to attach event listeners. The official documentation highlights this two-pass lifecycle: rendering occurs on the server to produce initial HTML, and occurs again on the client to bind event handlers.

### The Client-Only Visit vs. the Server-Rendered Visit

Compare the sequential phases of an initial visit across both architectures:

| Step | Client-only | Server-rendered |
| :--- | :--- | :--- |
| **1. The HTML arrives** | An empty root | The product inside the root |
| **2. The user sees** | A blank page | `Blue Sneakers` and `$49` |
| **3. The JavaScript** | Downloads | Downloads: the same files |
| **4. `App` runs in the browser** | `createRoot` renders it and builds the page | `hydrateRoot` renders it again and attaches the handlers |
| **5. The button works** | Only after step 4 | Only after step 4 |

Observe the contrast between initial display and interactive readiness:
- **For initial content visibility, the difference is substantial.** The server-rendered architecture presents product content in step two, whereas client rendering leaves the viewport blank.
- **For user interaction, the timeline is identical.** In both architectures, user controls become responsive only in step five after downloading scripts and executing client reconciliation.

### When the Browser Really Downloads Less

The official documentation notes that server rendering generally reduces client JavaScript. That observation applies to integrated frameworks that combine server rendering with complementary architectural features. Using `renderToString` and `hydrateRoot` alone does not reduce bundle size. Client downloads decrease only when specific code is deferred or excluded entirely:
- **React Server Components** execute exclusively on the server, ensuring their implementation logic never ships to the client (as seen in Lesson 101).
- **Dynamic code splitting** using `lazy` delays downloading component chunks until React renders them (as seen in Lesson 70).

Assume our product page includes an extensive customer reviews section positioned below the action button. Basic server rendering serializes those reviews into the HTML response. However, the JavaScript for that reviews component must still download before the button can respond to clicks. Applying `lazy` defers that chunk, keeping the initial script payload compact:

```jsx title="src/App.jsx"
import { ~lazy~ } from 'react'; // React provides lazy for code splitting

const Reviews = ~lazy~(() => import('./Reviews.jsx')); // The code of Reviews downloads only when React first renders it
```

When used with `renderToString`, this optimization introduces a drawback. The synchronous string renderer cannot await suspended boundaries, causing the server to emit only the fallback placeholder (as seen in Lesson 69). The browser subsequently renders the real content after downloading the chunk, outputting a descriptive warning to the developer console:

```devconsole width=full caption="The Console after hydrateRoot, when renderToString sent the fallback of a lazy component."
x Uncaught Error: Switched to client rendering because the server rendering aborted due to:
  The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server
```

Modern streaming APIs resolve this dilemma by awaiting asynchronous boundaries or streaming them progressively (taught in Lessons 117 and 118).

```tree dir=right caption="What server-side rendering moves, and what it leaves where it was."
What server-side rendering changes on the first visit
- +Moves earlier | The **first content**: the HTML holds the product | First Contentful Paint comes **when the HTML arrives**
- !Stays the same | The **JavaScript** the browser downloads | `App` and its imports are **still in the bundle**
- !Stays the same | The **first working tap** | Comes only after `App` has **run again in the browser**
```

### Why This Bug Ships

Engineering teams frequently misjudge the scope of server rendering:
1. An application suffers from slow load performance due to an overgrown JavaScript bundle.
2. The team adopts server rendering expecting it to solve both visual latency and bundle weight.
3. The initial layout appears on screen much earlier than before.
4. The action controls remain unresponsive until the entire oversized bundle downloads and executes.
5. The team discovers that server rendering solved visual paint time, but bundle optimization still requires code splitting.

Reiterate the core rule: **the server sends what the page looks like. The JavaScript brings what the page does**, and that script bundle remains unchanged.

---

## All 5 Principles Together

### The Complete Server-Rendered Product Page

Here is the complete codebase across all three files. The `App` component executes identically on both server and client:

```jsx title="src/App.jsx"
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      ~<a href="/">All products</a>~ {/* Principle 2: a link works before the JavaScript runs */}
      <h1>Blue Sneakers</h1>
      <p>$49</p>
      <button ~onClick~={() => setCount(count + 1)}>Add to cart</button> {/* Principle 2: works only after hydrateRoot has run */}
      <p>Cart: {count}</p>
    </main>
  );
}
```

The server file runs `App` and sends its HTML inside the root:

```jsx title="server.js"
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

app.use('/', (request, response) => {
  const html = ~renderToString(<App />)~; // Principle 1: the server runs App and gets its HTML
  response.send(`
    <div id="root">${html}</div>
    <script type="module" src="/bundle.js"></script>
  `);
});
```

The client entry file runs `App` again in the browser and attaches active click handlers to the server markup:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
~import App from './App.jsx';~ // Principle 5: App and its imports are still in the bundle

~hydrateRoot~(document.getElementById('root'), <App />); // Principle 3: the browser runs App again and attaches onClick
```

### The Order of the First Visit

During an initial visit, `App` executes twice: initially on the server, and subsequently in the browser. During the window between those two runs, the interface is visible but inert:

```tree dir=right caption="The first visit to the server-rendered product page, from the request to the first working tap."
The first visit on the slow phone
- +1. The server runs `App` [`renderToString`] | Writes the HTML of the product page | Effects **do not run** here
- +2. The HTML arrives [`<div id="root"><main>...</main></div>`] | The user **sees** `Blue Sneakers` and `$49` | First Contentful Paint
- !3. The JavaScript downloads | The button is on the screen, **but no code of ours is listening** | A tap on `Add to cart` is **lost**
- +4. The browser runs `App` again [`hydrateRoot`] | React **keeps** the HTML and attaches `onClick` | A tap now shows **`Cart: 1`**
```

### Summary

| Aspect | The Client-Only Habit | The Server-Rendering Rule |
| :--- | :--- | :--- |
| **The first HTML** | The root arrives empty, and the user sees a blank page | `renderToString(<App />)` on the server puts the product inside the root |
| **The first tap** | The page appears and answers at the same moment | The page appears first; the button answers only after the JavaScript has run |
| **`main.jsx`** | `createRoot(...).render(<App />)` on an empty root | `hydrateRoot(..., <App />)` on the root full of server HTML |
| **The data** | Loaded in an Effect after the first render | Ready before the render, with the framework's data loading |
| **The JavaScript** | `App` and its imports in the bundle | The same bundle; `App` runs again in the browser |

Anchor your understanding in the central theme of this lesson: **the server sends what the page looks like. The JavaScript brings what the page does.**

---

## For the Interview

> **The Interview Question:** What is server-side rendering, and what does it solve?

### How to Answer Clearly in 30 Seconds

"Server-side rendering executes our React component tree on the server to generate complete HTML markup before answering an HTTP request. This allows the browser to paint visible content immediately, before downloading application scripts. On the server, `renderToString` from `react-dom/server` serializes components to text, though modern architectures favor streaming APIs instead. In the browser, `hydrateRoot` binds to that existing markup rather than recreating DOM elements. This pattern eliminates the blank initial screen common to client-only applications. First Contentful Paint occurs as soon as the HTML document arrives, and non-JavaScript web crawlers can index the page reliably. However, server rendering leaves three challenges unaddressed:
1. **Interactivity is not immediate.** Static HTML carries no event listeners; buttons respond only after scripts load and hydration completes, though native hyperlinks function immediately.
2. **Bundle size remains unchanged.** The browser still downloads the full component bundle and executes client rendering to attach event listeners.
3. **Effects never execute on the server.** Data requested inside `useEffect` is absent from server markup, yielding only initial loading states."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"If a server-rendered page shows up fast, why does a tap sometimes do nothing?"**
   Because the server delivers non-interactive markup. The HTML document includes the visual button element but cannot serialize its `onClick` handler, which arrives inside the client script bundle. Between First Contentful Paint and client hydration, user taps reach no event listeners. MDN refers to the moment an interface becomes responsive as Time to Interactive, which requires active event listeners. React provides selective hydration through Suspense boundaries to make critical components interactive in stages, taught in Lesson 117.
2. **"Is server-side rendering the same thing as Server Components?"**
   No. Server-side rendering creates initial HTML from the same component code that runs in the browser. That code must still remain in the client bundle. React Server Components execute exclusively on the server and never ship their JavaScript implementation to the browser, as seen in Lesson 101. The two patterns complement each other: server component output can be rendered into initial HTML on the server.
3. **"Why does react.dev recommend other APIs over `renderToString`?"**
   The `renderToString` method operates synchronously and generates the entire HTML payload in a single blocking pass, offering no support for streaming or waiting for data. If any component suspends, it immediately emits the fallback markup instead. Modern applications use streaming APIs like `renderToPipeableStream` on Node.js or `renderToReadableStream` on Web Streams. These modern APIs stream HTML progressively as asynchronous tasks complete, taught in Lessons 117 and 118. Alternatively, generating HTML at build time provides static site generation, taught in Lesson 119.

```tree dir=right caption="Interview summary: what server-side rendering solves, and what it leaves to other tools."
Server-side rendering in an interview
- +What it solves | The **blank first screen**: content appears **when the HTML arrives** | Crawlers that do not run JavaScript **can read the page**
- !What it does not solve | The button answers only **after the JavaScript runs** | The **same bundle** downloads, and Effects **do not run on the server**
```
