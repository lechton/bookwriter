# Lecture 118: How the Server Sends a React Page as a Stream

*(How does the server send a React page in parts, instead of as one finished string of HTML?)*

> INTERVIEW QUESTION | ❱ CORE | How do you stream HTML on the server with renderToPipeableStream or renderToReadableStream?

---

## VS | `renderToString` vs. `renderToPipeableStream`: one returns the page, the other returns a way to send it

> Traditional server rendering uses `renderToString` to construct the entire page in memory, sending the completed markup in a single transmission. **Streaming APIs such as `renderToPipeableStream` return no HTML string at all: they return a `pipe` method that streams markup directly into the HTTP response**. This allows the user to see the initial product layout immediately, while deferred reviews stream across the same connection as soon as their data resolves.

Consider how a traditional server sends a React application (Lesson 102). The route handler renders the entire component tree into a single string, stores that string in memory, and dispatches it through the network response:

```jsx title="server.js with renderToString"
const html = ~renderToString~(<App />); // html is the whole page, as one string
response.send(html); // The server sends that string in one piece
```

This synchronous approach forces the server to buffer the full document before sending the first byte. Now compare that approach to the streaming implementation:

```jsx title="server.js with renderToPipeableStream"
const { pipe } = ~renderToPipeableStream~(<App />, { // No string comes back: React returns pipe
  onShellReady() {
    ~pipe(response)~; // React starts writing the page into the response
  }
});
```

Both function calls accept `<App />` and sit directly inside the server route handler. Yet their runtime behavior is completely different:
- **`renderToString`** evaluates the component tree synchronously and returns a completed HTML string. The server retains this string in memory until rendering finishes, then transmits it in one block.
- **`renderToPipeableStream`** returns no HTML. It returns an object containing control methods, including `pipe`. When the server invokes `pipe(response)`, React directly streams HTML chunks into the writable HTTP response.

A plain Node HTTP server can emit content across an open connection using multiple calls to `response.write`, closing the stream with `response.end` (Lesson 117). Calling `pipe(response)` delegates this streaming management to React. React writes the initial shell immediately, flushes deferred content as data arrives, and terminates the response once rendering finishes.

Here is the central rule to remember throughout this lesson:

**A streaming API gives the server no HTML. It gives a stream, and the server's job is to connect that stream to the response at the right moment.**

```tree caption="renderToString returns the page; renderToPipeableStream returns a way to send it."
Two ways the server gets a React page out
- !With `renderToString` [`const html`] | React returns **the whole page as one string** | The server sends it **in one piece**
- +With `renderToPipeableStream` [`const { pipe }`] | React returns **no HTML**, only **`pipe`** and **`abort`** | The server calls `pipe`, and React writes **the shell first, the rest later**
```

### Three Ideas From Earlier Lessons

> [!DEFINITION]
> **Server rendering.** [REVIEW] Server rendering runs React components on the server to produce HTML markup, allowing the browser to paint content before client JavaScript downloads. The traditional `renderToString(<App />)` method returns this markup as a single string that the server transmits via `response.send` (Lesson 102).

> [!DEFINITION]
> **Hydration.** [REVIEW] Server-rendered HTML paints on screen immediately, but cannot handle user interaction because event listeners are not yet active. When client JavaScript downloads, React executes `hydrateRoot` in the browser to attach state and event listeners to the existing DOM elements (Lesson 104).

> [!DEFINITION]
> **The shell.** [REVIEW] The shell is the synchronous HTML structure outside every `<Suspense>` boundary, containing static elements and each boundary's fallback placeholder. On the server, React streams this initial shell immediately so the user sees the page layout at once, while deferred content streams later in the same HTTP response (Lesson 117).

### What Is at Stake

Consider an online store product page whose customer reviews depend on a slow database query. What the user experiences depends entirely on how the server delivers the page:
1. **The server streams the response when the shell is ready.** The shopper views the product title and price instantly. The slow reviews stream into the same HTTP connection two seconds later without an extra fetch.
2. **The server calls `renderToString` with a `<Suspense>` boundary.** The HTML output stops at the fallback loading message and ends the response. The browser must wait for the client bundle to load before fetching reviews itself.
3. **The server streams the HTML but omits the bootstrap script.** The entire document arrives, including the late reviews. But when the user clicks the button, the page remains completely inert.

### Where Readers Usually Go Wrong

Readers usually encounter four common pitfalls:
1. **Expecting an HTML string from `renderToPipeableStream`.** The function returns a stream controller object with `pipe` and `abort`, rather than rendered markup.
2. **Forgetting to configure `bootstrapScripts`.** The visual layout appears complete, but omitting the script tag leaves the page unable to respond to clicks.
3. **Selecting the wrong streaming API for the host runtime.** Node servers require `renderToPipeableStream`, whereas Deno and edge runtimes require `renderToReadableStream`.
4. **Delaying transmission until all deferred content completes for every visitor.** Waiting for all data destroys progressive loading for human shoppers.

### Two Stream APIs, One Difference

React provides two streaming APIs on the server. Both accept the root element `<App />` and use the same configuration options. Both stream the page in the exact same sequence: the shell first, followed by deferred content.

Their single technical difference is the stream standard of the host environment:
- **`renderToPipeableStream`** produces a Node stream. The server pipes this stream directly into a Node response socket.
- **`renderToReadableStream`** produces a standard Web Stream. The handler returns this stream as the body of a standard `Response` object on Deno or edge runtimes.

Four primary techniques exist for delivering a React page from a server:

```tree caption="The four ways to send a React page from the server, and when each one fits."
Four ways to send a React page from the server
- +`renderToString` | One string, **sent at once** | For servers **without streams**, as seen in Lesson 102
- +`renderToPipeableStream` | A stream for **Node.js** servers | **This lesson**
- +`renderToReadableStream` | A stream for **Web Streams** runtimes, such as **Deno** and **edge runtimes** | **This lesson**
- +`prerender` and `prerenderToNodeStream` | The HTML is made **at build time** | For pages that are **the same for every reader**, Lesson 119
```

Modern frameworks frequently invoke these streaming functions under the hood. Understanding their direct implementation allows you to debug server pipelines and explain them clearly in technical interviews.

## SECTION | A Product Page With Slow Reviews

We continue with the product page from earlier lessons (Lesson 102 to 104, and Lesson 117). The `Add to cart` button and the cart counter return, providing an interactive element for the user to click. When the user opens the page, the browser immediately displays the product name, its price, the button, the cart counter, and a loading message for the reviews:

```page width=text caption="What the user sees the moment the product page opens: the product at once, and a loading line where the reviews will go."
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0
line: Loading reviews...
```

The customer reviews depend on a slower database query. Two seconds later, the reviews arrive and replace the loading placeholder:

```page width=text caption="The same page two seconds later: the two reviews have taken the place of the loading line."
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0
line: Great fit
line: Runs small
```

This page requires four specific capabilities from the server, and each principle addresses one:
1. **The product must display immediately, while reviews arrive later.** Principle 1.
2. **The button must handle user clicks once loaded.** Principle 2.
3. **The same page component must run on non-Node runtimes.** Principle 3.
4. **A search engine crawler must find the reviews directly in the HTML.** Principle 4.

The project consists of six files:

```files title="product-page: File Explorer" caption="The six files of the product page and the job of each one."
server.js | Node.js server | Streams `App` with `renderToPipeableStream`
handler.js | Web Streams server | Streams the same `App` with `renderToReadableStream`
src/
  db.js | stand-in for the database | Exports `getReviews`, which answers with two reviews after 2 seconds
  Reviews.jsx | slow section | Reads `reviewsPromise` with `use` and renders one list item per review
  App.jsx | page | Renders the whole document: the product, the button, and the reviews inside `<Suspense>`
  main.jsx | browser | Calls `hydrateRoot` on the whole document
```

**PRINCIPLES:** A streaming API gives the server no HTML. It gives a stream, and the server's job is to connect that stream to the response at the right moment. Four principles follow:
1. **`pipe(response)` inside `onShellReady`: the product goes out at once.** `renderToPipeableStream` returns `pipe`, and the page starts going to the user only when the server calls it.
2. **`bootstrapScripts`: the page answers clicks.** The stream sends HTML only. The server must name the script that calls `hydrateRoot`.
3. **`renderToReadableStream`: the same page on Deno and edge runtimes.** The server awaits it, and returns the stream inside a `Response`.
4. **`onAllReady`: only the crawler waits for every part.** Every other visitor keeps `onShellReady`.

---

## PRINCIPLE | `pipe(response)` inside `onShellReady`: the product goes out at once, and the reviews follow in the same response

> [!PRINCIPLE]
> **Principle 1: `pipe(response)`: React Writes the Page into the Response, Shell First**
>
> *`renderToPipeableStream` returns `pipe` and `abort`, not HTML; call `pipe(response)` inside `onShellReady`, so the shell goes out at once and the rest follows.*
>
> The server no longer holds a page to send. It holds a way to send one. When React has rendered the shell, it calls `onShellReady`, our code calls `pipe(response)`, and the user sees the product at once. The reviews arrive later in the same response, and our server code never touches a string of HTML.
>
> **DO THIS:**
> ```jsx
> const { pipe } = renderToPipeableStream(<App reviewsPromise={getReviews()} />, {
>   onShellReady() {
>     ~pipe(response)~; // The product goes out now; the reviews follow in the same response
>   }
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const html = ~renderToString~(<App reviewsPromise={getReviews()} />); // **WRONG:** the HTML stops at Loading reviews...
> response.send(html);
> ```

Here is the smallest server route that streams a React page:

```jsx title="server.js"
app.use('/', (request, response) => {
  const { ~pipe~ } = renderToPipeableStream(<App />, { // React returns an object with pipe and abort
    ~onShellReady~() { // React calls this the moment the shell is rendered
      response.setHeader('content-type', 'text/html');
      pipe(response); // From here on, React writes the page into response
    }
  });
});
```

> [!DEFINITION]
> **`renderToPipeableStream`.** [NEW] `renderToPipeableStream` is a server method in `react-dom/server` that renders a React component tree into a writable Node stream. It returns an object containing two control methods: `pipe` to start streaming into a destination, and `abort` to cancel pending work. Its second parameter accepts configuration callbacks such as `onShellReady` (Lesson 118).

The destructuring syntax `const { pipe }` extracts the piping function from the returned stream controller (Lesson 08). Here is what each piece does:
- **`pipe(response)`** connects React's internal HTML output stream directly to Node's writable HTTP response object. Once piped, React writes markup chunks into the socket as rendering progresses.
- **`onShellReady`** is a callback provided in the options object. React executes this function as soon as the initial markup outside all Suspense boundaries finishes rendering.
- **`response.setHeader('content-type', 'text/html')`** informs the browser that the response body contains HTML markup. This header must be set before invoking `pipe`, because HTTP headers cannot be modified once byte streaming begins.

In Node, streams use `pipe` to feed data from a readable source directly into a writable destination while managing network backpressure. Calling `pipe(response)` links React directly to the outgoing network connection, allowing generated markup to reach the client immediately without buffering.

### Why `pipe` Waits for `onShellReady`

React fires `onShellReady` once all synchronous components outside Suspense boundaries complete their initial render. At that moment, React has assembled a complete HTML frame containing the page layout, titles, and loading placeholders. That marks the earliest moment the server can transmit a meaningful visual display to the client.

### The Product Page as a Stream

Two files require updates. First, the root App component renders the entire document structure, starting from the root HTML element. It also includes the interactive button. In streaming SSR, React expects the root component to represent the full document, which means the App component must render the root HTML element directly:

```jsx title="src/App.jsx"
import { Suspense, useState } from 'react';
import Reviews from './Reviews.jsx';

export default function App({ reviewsPromise }) {
  const [count, setCount] = useState(0);
  return (
    ~<html>~ {/* App renders the whole document */}
      <head>
        <title>Blue Sneakers</title>
      </head>
      <body>
        <h1>Blue Sneakers</h1>
        <p>$49</p>
        <button onClick={() => setCount(count + 1)}>Add to cart</button>
        <p>Cart: {count}</p>
        <Suspense fallback={<p>Loading reviews...</p>}>
          <Reviews reviewsPromise={reviewsPromise} />
        </Suspense>
      </body>
    </html>
  );
}
```

The component does not need to define an explicit doctype declaration. React automatically prepends the standard HTML5 doctype declaration to the outgoing stream whenever the root element renders an HTML tag.

Second, the server file replaces `renderToString` with `renderToPipeableStream`:

```jsx title="server.js"
import { renderToPipeableStream } from 'react-dom/server';
import App from './src/App.jsx';
import { getReviews } from './src/db.js';

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App reviewsPromise={getReviews()} />, {
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      ~pipe(response)~; // The shell goes to the browser now; the reviews follow later
    }
  });
});
```

The server instance registers this route handler using standard middleware conventions (Lesson 102). The mock database file and the reviews component remain identical to their earlier implementations.

### One Visit, in Order

The server never holds the complete HTML document in memory, and the connection remains open while the user views the product. Here is the step-by-step lifecycle of a single request:
1. The user requests the product page, and the incoming connection reaches the server route handler.
2. The server initiates `getReviews()` and calls `renderToPipeableStream`. No data has been sent to the network socket yet.
3. React renders the initial shell: the title, price, button, cart counter, and the fallback message for reviews.
4. React fires `onShellReady`. The server configures the response headers and calls `pipe(response)`, transmitting the shell to the client.
5. The browser displays the product details alongside the loading placeholder while the network connection stays open.
6. Two seconds later, the reviews query resolves on the server. React writes the review HTML into the open response, accompanied by an inline script that replaces the fallback.
7. React terminates the stream. At no point did server code allocate a single complete HTML string.

```tree dir=right caption="One visit to the product page with renderToPipeableStream: the shell goes out first, and the reviews follow in the same response."
One response, sent in two parts
- +1. The shell is rendered [`onShellReady`] | Our code calls **`pipe`** | The user sees **`Blue Sneakers`**, **`$49`**, and **`Loading reviews...`**
- +2. The reviews are ready, two seconds later | React writes them into **the same response** | **`Great fit`** and **`Runs small`** take the place of the loading line
- +3. Nothing is left to render | React **ends the response** | Our server code **never held a string** of HTML
```

### VS | `renderToString` With `<Suspense>` vs. `pipe` in `onShellReady`: the first response ends at the fallback

Consider what happens if a server uses `renderToString` with the exact same Suspense boundary around reviews. Both implementations show the loading message initially. However, their network behavior diverges fundamentally. When `renderToString` encounters a suspended component, it immediately flushes the fallback markup and concludes the string. The response ends at that moment, so late review markup is never sent. Only a stream keeps the response open to transmit deferred chunks.

::: row caption="What the response alone puts on the screen, two seconds after the user opens the page."
::: col title="With renderToString" tag="the response ends at the fallback" tone=bad
```page size=mini
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0
line: Loading reviews... | bad
```
The response ended at the loading line.
:::
::: col title="With pipe in onShellReady" tag="the reviews arrive in the same response" tone=good
```page size=mini
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0
line: Great fit | good
line: Runs small | good
```
The reviews arrived in the same response.
:::
:::

### Real Beginner Mistake: `renderToString` Around a `<Suspense>`

1. A team wraps slow review components inside `<Suspense>` to let product details load first.
2. The server continues using `renderToString`, generating HTML that terminates at the loading fallback.
3. The server closes the response immediately, omitting the actual reviews from the server markup.
4. The user sees the reviews only after client JavaScript downloads and executes a separate fetch in the browser.
5. The browser console emits a React hydration warning requesting a migration to `renderToPipeableStream` (Lesson 102).
6. Search engine crawlers reading raw server markup find only the fallback text instead of real reviews.

Remember: a streaming API gives the server no HTML string. The server connects the stream to the response, and React handles progressive writes directly.

---

## PRINCIPLE | `bootstrapScripts`: React loads in the browser, so `Add to cart` answers the click

> [!PRINCIPLE]
> **Principle 2: `bootstrapScripts`: The Stream Brings the Page, the Script Brings React**
>
> *Name the script that calls `hydrateRoot(document, ...)` in `bootstrapScripts`; React adds its `<script>` tag to the stream.*
>
> A streamed page can look finished, reviews included, without React ever running in the browser, because the inline script that swaps the reviews does not need React. Until a bootstrap script calls `hydrateRoot`, no click handler is attached, and `Add to cart` ignores every click with no error.
>
> **DO THIS:**
> ```jsx
> const { pipe } = renderToPipeableStream(<App reviewsPromise={getReviews()} />, {
>   ~bootstrapScripts: ['/main.js']~, // React adds <script src="/main.js"> and the button answers clicks
>   onShellReady() {
>     pipe(response);
>   }
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const { pipe } = renderToPipeableStream(<App reviewsPromise={getReviews()} />, {
>   ~onShellReady~() { // **WRONG:** no bootstrapScripts, so the page arrives and Add to cart does nothing
>     pipe(response);
>   }
> });
> ```

The streaming pipeline delivers HTML structure, not the client React runtime. With the server from Principle 1, the full page arrives, reviews included, but clicking the button produces no result:

```page width=text caption="The streamed page after the user clicks Add to cart: the reviews are in, and the cart line has not moved."
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0 | bad
line: Great fit
line: Runs small
```

Here is the exact runtime sequence:
1. The server streams the shell layout, followed by the deferred reviews and their inline swap script.
2. The user sees the completed page approximately two seconds after opening the link.
3. The user clicks the button.
4. The button in the browser is currently plain HTML lacking JavaScript event listeners. The click handler lives inside the React component, which has not yet executed in the browser.
5. The cart counter remains at zero. No error appears in the console because no client code exists to report an issue.

The reviews swapped into place successfully, but that DOM mutation was performed by a small inline script written directly into the stream by React. That inline script relies on native DOM methods and requires zero React runtime code in the browser.

### Where the Script Tag Went

In traditional server rendering (Lesson 102), the server placed rendered markup into a static HTML wrapper that contained a `<script>` tag loading the client application bundle.

In streaming SSR, the App component renders the entire document structure from the root HTML element downward. No surrounding wrapper template remains. Unless server configuration instructs React to inject the client script, the browser receives pure HTML and never downloads React.

### The Fix: One Option on the Server, One Call in the Browser

On the server, specify the script URL inside the `bootstrapScripts` array:

```jsx title="server.js" startLine="5"
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App reviewsPromise={getReviews()} />, {
    ~bootstrapScripts: ['/main.js']~, // React adds a <script> tag for /main.js to the stream
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

In the browser, the entry script invokes `hydrateRoot` across the complete document:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { getReviews } from './db.js';

hydrateRoot(~document~, <App reviewsPromise={getReviews()} />); // App renders <html>, so React hydrates the whole document
```

> [!DEFINITION]
> **`bootstrapScripts`.** [NEW] `bootstrapScripts` is an option in `renderToPipeableStream` that accepts an array of script URLs. React emits a `<script async>` tag for each URL into the stream body, alongside a matching `<link rel="preload">` in the document `<head>` so the browser starts downloading the bundle immediately. This entry bundle is called the bootstrap script (Lesson 118).

Here is what the supporting elements handle:
- **The bootstrap script** represents the compiled client bundle of the client entry script, served at `/main.js`. In production builds, asset filenames include content hashes to ensure reliable caching (Lesson 143).
- **`hydrateRoot(document, ...)`** attaches React to the existing DOM structure (Lesson 104). Because the root component renders the `<html>` tag, hydration must target the entire document node.
- **`getReviews()` on the client** ensures that client rendering matches server output during initial hydration. In production apps, server data is serialized directly into the initial payload to prevent duplicate client fetches (Lesson 109).

With the bootstrap script active, the button works as expected. The client bundle downloads, attaches event listeners, and increments the cart counter on click:

::: row caption="The same streamed page after one click on Add to cart, without and with the bootstrap script."
::: col title="Without bootstrapScripts" tag="React never runs in the browser" tone=bad
```page size=mini
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 0 | bad
line: Great fit
line: Runs small
```
The click does nothing.
:::
::: col title="With bootstrapScripts" tag="React answers the click" tone=good
```page size=mini
heading: Blue Sneakers
line: $49
line: [Add to cart]
line: Cart: 1 | good
line: Great fit
line: Runs small
```
The click adds one shoe to the cart.
:::
:::

Both pages look visually identical prior to user interaction. However, only the configuration with `bootstrapScripts` loads the React runtime into the browser to attach interactive event listeners.

### A Click Before the Browser Has the Reviews

The mock database file highlights an important concurrency detail. When the client bundle loads, its call to `getReviews()` also initiates a two-second timer. Until that Promise resolves, client-side React lacks the review data in memory.

If a user clicks the button before those two seconds elapse, state updates to increment the cart counter. Re-rendering the App component on the client encounters an unresolved Promise in the reviews component, momentarily displaying the loading fallback until the client query finishes. In production applications, frameworks pass server data directly to the client to avoid duplicate fetching and prevent this momentary fallback.

### VS | The Inline Script vs. the Bootstrap Script: one moves HTML, the other brings React

The outgoing stream contains two distinct script elements, both generated by React:
- **The inline swap script.** React emits this script into the stream alongside each deferred boundary (Lesson 117). It contains minimal JavaScript that moves late HTML chunks into placeholder slots without requiring React.
- **The bootstrap script.** React emits this script tag when configured via `bootstrapScripts`. It downloads the application bundle, initializes the React runtime, and attaches event listeners across the DOM.

Two related configuration options provide additional control:
- **`bootstrapModules`** injects script tags configured with `type="module"`.
- **`bootstrapScriptContent`** embeds an inline script containing raw JavaScript, commonly used to serialize configuration or state prior to bundle execution.

### Real Beginner Mistake: The Template Is Gone, and the Script With It

1. A developer migrates a page from `renderToString` to `renderToPipeableStream`.
2. The root component renders the entire document, leading the developer to delete the legacy HTML wrapper template.
3. The developer forgets to configure `bootstrapScripts`, but the rendered layout and late reviews appear visually correct.
4. Users attempt to click buttons, but nothing happens because client hydration never initialized.

Remember: streaming delivers the HTML structure, while the bootstrap script delivers client interactivity.

---

## PRINCIPLE | `renderToReadableStream`: the same page on Deno and edge runtimes, returned inside a `Response`

> [!PRINCIPLE]
> **Principle 3: `renderToReadableStream`: The Same Page, Returned Inside a `Response`**
>
> *On Deno or an edge runtime, `await renderToReadableStream(...)` and return the stream inside `new Response(stream, ...)`; on Node.js, use `renderToPipeableStream`.*
>
> Both APIs send the user the same page in the same order. The one difference is the shape of the code. On Node.js, React calls `onShellReady` and our code pipes. On Web Streams, the `await` ends when the shell is ready, and the handler returns the stream while React keeps writing the rest into it.
>
> **DO THIS:**
> ```jsx
> const stream = await ~renderToReadableStream~(<App />, { bootstrapScripts: ['/main.js'] }); // On Deno or an edge runtime
> const { pipe } = ~renderToPipeableStream~(<App />, { bootstrapScripts: ['/main.js'] }); // On a Node.js server
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const stream = await ~renderToReadableStream~(<App />, { bootstrapScripts: ['/main.js'] }); // **WRONG:** on a Node.js server it works, but React's docs warn of worse performance
> ```

Many modern environments run outside traditional Node architectures:
- **Deno** provides an alternative JavaScript runtime built on web standards.
- **Edge runtimes** execute server code across globally distributed nodes close to end users.

Both environments use Web Streams, the streaming standard native to modern browsers. React provides `renderToReadableStream` specifically for these platforms. Compare the Node server implementation to the equivalent Web Streams handler:

```jsx title="server.js on Node.js"
const { pipe } = ~renderToPipeableStream~(<App reviewsPromise={getReviews()} />, { // Returns pipe at once
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response); // The shell is ready: React writes into response
  }
});
```

```jsx title="handler.js on a Web Streams runtime"
async function handler(request) {
  const stream = await ~renderToReadableStream~(<App reviewsPromise={getReviews()} />, { // Waits for the shell
    bootstrapScripts: ['/main.js'],
  });
  return ~new Response~(stream, { // The shell is ready: the handler returns the stream as the body
    headers: { 'content-type': 'text/html' },
  });
}
```

From the perspective of the user, both implementations deliver identical results: the same markup, the same bootstrap script, and the same progressive loading sequence.

In server code, the key distinction lies in how each API signals that the shell is ready:
- **With `renderToPipeableStream`**, completion is signaled via a callback. React invokes `onShellReady`, and the server calls `pipe(response)` inside it.
- **With `renderToReadableStream`**, completion is signaled through Promise resolution. The function returns a Promise that resolves to a readable stream as soon as the initial shell finishes rendering. The handler then returns that stream as the body of a standard `Response` object.

> [!DEFINITION]
> **`renderToReadableStream`.** [NEW] `renderToReadableStream` is a server method in `react-dom/server` that renders a React tree into a standard Web ReadableStream. The function returns a Promise resolving to this stream once the shell has rendered. Server code does not consume the stream directly; it passes the stream as the body of a standard `Response` object provided by the web platform (Lesson 118).

The `handler(request)` signature represents the standard interface defined by web fetch specifications, though exact routing conventions vary by runtime.

### The Handler Returns Before the Reviews Exist

The route handler function concludes execution while the outgoing stream continues transmitting data:
1. The handler invokes `renderToReadableStream`, pausing at the `await` statement.
2. React renders the synchronous shell layout and loading placeholders.
3. The Promise resolves to a readable stream, and the handler returns a new `Response` object. The handler function has finished running.
4. The client browser displays the initial shell and fallback UI immediately.
5. Two seconds later, the reviews query finishes on the server. React pushes the rendered review markup into the open readable stream.

The handler function has already returned, but React retains control of the underlying stream controller and continues flushing late chunks across the network.

### The Lines That Match in the Two APIs

Every feature in the Node API maps directly to a corresponding mechanism in the Web Streams API. Node uses callbacks and method calls, whereas Web Streams uses Promises and stream properties:

| What the server needs | With `renderToPipeableStream` on Node.js | With `renderToReadableStream` on Web Streams |
| :--- | :--- | :--- |
| **Start to send when the shell is ready** | `onShellReady() { pipe(response); }` | `const stream = await renderToReadableStream(...)`, then `return new Response(stream, ...)` |
| **Wait for every part, for crawlers** | `onAllReady() { pipe(response); }`, Principle 4 | `await stream.allReady`, Principle 4 |
| **Handle a shell that fails to render** | `onShellError`, Lesson 125 | a `try` and `catch` around the `await`, Lesson 125 |
| **Stop the wait for slow parts** | call `abort()` | the `signal` option with an `AbortController` |

### The Runtime Picks the API

The host server runtime dictates which API to use, rather than personal preference or API naming:

```tree caption="The runtime the server runs on decides which streaming API to call."
Which streaming API fits which server
- +A **Node.js** server [`renderToPipeableStream`] | Node.js Streams | The server calls **`pipe`** with the response
- +**Deno** or an **edge runtime** [`renderToReadableStream`] | Web Streams | The handler returns the stream inside a **`Response`**
```

Although modern Node includes compatibility support for Web Streams, React documentation explicitly discourages calling `renderToReadableStream` on Node due to performance penalties caused by stream adaptation layers.

### Real Beginner Mistake: Web Streams on a Node.js Server

1. A team selects `renderToReadableStream` for a Node server because it matches browser web standards.
2. The server functions properly during local development because Node implements Web Streams compatibility.
3. Under production loads, the server experiences unnecessary memory and CPU overhead adapting Web Streams across Node networking layers.

Remember: match the API directly to the runtime. Node servers call `renderToPipeableStream`, while Deno and edge runtimes call `renderToReadableStream`.

---

## PRINCIPLE | `onAllReady`: the crawler gets the final HTML, and every other visitor keeps `onShellReady`

> [!PRINCIPLE]
> **Principle 4: `onAllReady`: Wait for Every Part Only for Crawlers**
>
> *Call `pipe` in `onAllReady`, or `await stream.allReady`, only for crawlers; every other visitor keeps `onShellReady`.*
>
> `onShellReady` and `onAllReady` end with the same page, on two schedules. With `onShellReady`, the shopper sees the product at once and the reviews follow. With `onAllReady`, nothing reaches the browser until the slowest part is rendered. A crawler needs that final HTML. A shopper needs the product now.
>
> **DO THIS:**
> ```jsx
> onShellReady() {
>   if (!isCrawler) pipe(response);
> },
> ~onAllReady~() { // Only the crawler waits for the reviews
>   if (isCrawler) pipe(response);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~onAllReady~() { // **WRONG:** every shopper sees a blank tab until the reviews are rendered
>   pipe(response);
> }
> ```

The configuration options object provides another lifecycle callback: `onAllReady`. Both callbacks can contain the same piping statement:

```jsx title="pipe in onShellReady, and pipe in onAllReady"
~onShellReady~() { pipe(response); } // Sends the product at once, and the reviews two seconds later
~onAllReady~() { pipe(response); } // Sends nothing for two seconds, then the whole page at once
```

After two seconds, both approaches result in the exact same rendered document. However, the user experience during those two seconds is completely different: one displays the product shell immediately, while the other shows a blank screen until all data resolves.

React executes `onAllReady` only when all rendering across the entire component tree finishes, including every nested Suspense boundary. Starting transmission here eliminates progressive loading entirely.

Progressive loading refers to delivering the visual shell immediately and streaming deferred sections down the wire as each boundary resolves.

### The Visitor Who Wants to Wait: the Crawler

One specific visitor benefits from waiting: a search engine crawler. Automated indexing bots typically read server HTML in a single pass without executing client JavaScript or waiting for late DOM script swaps. If a crawler inspects a streamed response piped at the shell, it may only index the fallback placeholder message.

The server can support both requirements by inspecting the incoming request headers to identify search engine crawlers:

```jsx title="server.js" startLine="5"
app.use('/', (request, response) => {
  const ~isCrawler~ = request.headers['user-agent']?.includes('Googlebot'); // Our code decides who is a crawler
  const { pipe } = renderToPipeableStream(<App reviewsPromise={getReviews()} />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      if (!isCrawler) { // A shopper gets the shell at once
        response.setHeader('content-type', 'text/html');
        pipe(response);
      }
    },
    ~onAllReady~() { // React calls this when the reviews are rendered too
      if (isCrawler) {
        response.setHeader('content-type', 'text/html');
        pipe(response);
      }
    }
  });
});
```

Crawler detection logic is defined entirely in application code. Applications commonly evaluate the incoming user agent header to detect search indexing bots.

During a single request, React calls `onShellReady` first and `onAllReady` once all suspended boundaries complete. Because each callback checks the crawler status flag, `pipe` executes exactly once per request.

### Two Requests in the Same Second

Different visitors receive the same page across two distinct delivery schedules:
1. A search engine crawler requests the page, setting the crawler detection flag to true.
2. React renders the initial shell and triggers `onShellReady`. The server skips piping, so no bytes leave the server.
3. Two seconds later, the reviews data finishes rendering and React triggers `onAllReady`.
4. The server calls `pipe(response)`, delivering a complete static HTML document containing all review text in place.
5. A human shopper requests the exact same page concurrently. Because the crawler flag is false, the shopper receives the shell immediately.

```tree caption="The same product page sent to a shopper with onShellReady and to a crawler with onAllReady."
One page, two schedules
- +A shopper [`onShellReady`] | Gets **the product at once** | The reviews arrive **two seconds later** in the same response
- +A crawler [`onAllReady`] | Gets **nothing for two seconds** | Then gets **the final HTML**, with both reviews in place
```

### The Same Wait on Web Streams

In Web Streams runtimes, this scheduling distinction is handled via the `allReady` Promise property on the stream object. The route handler awaits this Promise before returning the response when a crawler is detected:

```jsx title="handler.js"
async function handler(request) {
  const isCrawler = request.headers.get('user-agent')?.includes('Googlebot');
  const stream = await renderToReadableStream(<App reviewsPromise={getReviews()} />, {
    bootstrapScripts: ['/main.js'],
  });
  if (isCrawler) {
    await ~stream.allReady~; // The crawler waits until the reviews are rendered too
  }
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Piping inside `onAllReady` on Node and awaiting `stream.allReady` on Web Streams produce identical results on their respective runtimes.

Forcing crawlers to wait also carries trade-offs. If a deferred data source hangs or errors, the crawler request may time out. Applications must determine whether to stream the shell or wait for complete HTML based on specific SEO priorities.

### Real Beginner Mistake: `onAllReady` for Every Visitor

1. A developer observes that `onAllReady` produces a complete HTML document with all data in place, and configures all requests to use it.
2. Automated test suites pass because the resulting HTML contains all expected content.
3. In production, every human visitor experiences prolonged blank screens while waiting for slow database queries, destroying progressive loading.
4. No runtime errors are thrown, making the performance degradation difficult to diagnose without monitoring first paint times.

Remember: connect the stream to the response at the appropriate lifecycle moment. Regular visitors receive the shell immediately, while indexing bots wait for complete markup.

---

## All 4 Principles Together

### The Complete Code

Here is the complete implementation of the product page across all files. The database module provides the asynchronous query (Lesson 109):

```js title="src/db.js"
export function getReviews() {
  return new Promise(resolve => {
    setTimeout(() => resolve(['Great fit', 'Runs small']), ~2000~); // The reviews arrive after two seconds
  });
}
```

The reviews component resolves review data using the `use` hook (Lesson 117):

```jsx title="src/Reviews.jsx"
import { use } from 'react';

export default function Reviews({ reviewsPromise }) {
  const reviews = ~use(reviewsPromise)~; // Suspends until the reviews arrive
  return (
    <ul>
      {reviews.map(review => <li key={review}>{review}</li>)}
    </ul>
  );
}
```

The App component renders the complete document structure:

```jsx title="src/App.jsx"
import { Suspense, useState } from 'react';
import Reviews from './Reviews.jsx';

export default function App({ reviewsPromise }) {
  const [count, setCount] = useState(0);
  return (
    ~<html>~ {/* Principle 1: the root component renders the whole document */}
      <head>
        <title>Blue Sneakers</title>
      </head>
      <body>
        <h1>Blue Sneakers</h1>
        <p>$49</p>
        <button onClick={() => setCount(count + 1)}>Add to cart</button>
        <p>Cart: {count}</p>
        <Suspense fallback={<p>Loading reviews...</p>}>
          <Reviews reviewsPromise={reviewsPromise} />
        </Suspense>
      </body>
    </html>
  );
}
```

The Node server file streams the document using `renderToPipeableStream`:

```jsx title="server.js"
import { renderToPipeableStream } from 'react-dom/server';
import App from './src/App.jsx';
import { getReviews } from './src/db.js';

app.use('/', (request, response) => {
  const isCrawler = request.headers['user-agent']?.includes('Googlebot');
  const { pipe } = renderToPipeableStream(<App reviewsPromise={getReviews()} />, {
    ~bootstrapScripts: ['/main.js']~, // Principle 2: React adds the script that brings React
    ~onShellReady~() { // Principle 1: a shopper gets the shell at once
      if (!isCrawler) {
        response.setHeader('content-type', 'text/html');
        pipe(response);
      }
    },
    ~onAllReady~() { // Principle 4: a crawler gets the final HTML
      if (isCrawler) {
        response.setHeader('content-type', 'text/html');
        pipe(response);
      }
    }
  });
});
```

The browser entry script hydrates the document from `/main.js`:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { getReviews } from './db.js';

hydrateRoot(~document~, <App reviewsPromise={getReviews()} />); // Principle 2: React takes over the whole document
```

The Web Streams handler delivers the same application from Deno or an edge runtime:

```jsx title="handler.js"
import { renderToReadableStream } from 'react-dom/server';
import App from './src/App.jsx';
import { getReviews } from './src/db.js';

async function handler(request) {
  const isCrawler = request.headers.get('user-agent')?.includes('Googlebot');
  const stream = await ~renderToReadableStream~(<App reviewsPromise={getReviews()} />, { // Principle 3: resolves when the shell is ready
    bootstrapScripts: ['/main.js'],
  });
  if (isCrawler) {
    await ~stream.allReady~; // Principle 4: a crawler waits for the reviews
  }
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

### What React Does for One Shopper's Visit

On the server, React evaluates the App component, reaching the reviews component inside the Suspense boundary. Because the data Promise is pending, the reviews component suspends, prompting React to emit the fallback element and fire `onShellReady`. The server pipes the shell to the client immediately. Two seconds later, the reviews Promise resolves, and React renders the reviews component into the open stream alongside an inline swap script. In the browser, the client bootstrap script executes `hydrateRoot`, activating interactivity so the button responds to clicks.

```tree dir=right caption="The order of events for one shopper's visit, from the server to the browser."
One shopper opens the product page
- +1. On the server, React calls `App`, then `Reviews` | `Reviews` **suspends** on `use` | React puts **`Loading reviews...`** in its place
- +2. The shell is ready [`onShellReady`] | Our code calls **`pipe`** | The browser shows **the product** at once
- +3. Two seconds later, React calls `Reviews` again | The reviews are **rendered** | React writes them into **the same response**
- +4. In the browser, the bootstrap script runs [`hydrateRoot`] | React **runs `App`** in the browser | **`Add to cart`** answers the click
```

### Summary

| Aspect | The Mistake | The React Rule |
| :--- | :--- | :--- |
| **1. What the API returns** | Expect HTML from `renderToPipeableStream`, or keep `renderToString` with `<Suspense>` and stop at the loading line | Take `pipe` from what it returns, and call `pipe(response)` in `onShellReady` |
| **2. The script** | Leave out `bootstrapScripts`, so the page looks finished and ignores every click | Name the script that calls `hydrateRoot(document, ...)` in `bootstrapScripts` |
| **3. The runtime** | Pick the API by its name, and run the Web Streams API on Node.js | `renderToPipeableStream` on Node.js; `await renderToReadableStream` and a `Response` on Deno and edge runtimes |
| **4. The wait** | Call `pipe` in `onAllReady` for every visitor, and lose progressive loading | Wait with `onAllReady` or `await stream.allReady` only for crawlers |

Remember the central rule of this lesson. **A streaming API gives the server no HTML. It gives a stream, and the server's job is to connect that stream to the response at the right moment.**

---

## For the Interview

> **The Interview Question:** How do you stream HTML on the server with renderToPipeableStream or renderToReadableStream?

### How to Answer Clearly in 30 Seconds

"Neither streaming method returns an HTML string. Each method yields a stream that the server connects to the outgoing network response. On Node.js, `renderToPipeableStream` returns a controller containing `pipe` and `abort`. I invoke `pipe(response)` inside `onShellReady`, allowing the visual shell to reach the user immediately while deferred `<Suspense>` components stream into the same connection later. On Deno or edge runtimes, I await `renderToReadableStream`, which resolves as soon as the shell is ready, and return the resulting readable stream inside a standard `Response`. Three configuration options are vital:
1. **`bootstrapScripts`** designates the client bundle that invokes `hydrateRoot(document, ...)`. Without it, the markup renders but user clicks do nothing.
2. **`onShellReady`**, or the resolution of the stream Promise, marks when human visitors begin receiving the page.
3. **`onAllReady`**, or `await stream.allReady`, waits for all suspended boundaries to finish rendering. I reserve this exclusively for search crawlers to ensure full content indexing while preserving progressive loading for users."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What does `renderToPipeableStream` return, and why do you call `pipe` in `onShellReady` instead of right away?"**
   It returns a stream controller object providing `pipe` and `abort` methods, with no HTML markup. The `onShellReady` callback fires as soon as the initial shell finishes rendering, marking the earliest moment React has assembled a complete HTML frame to display. Calling `pipe` here enables progressive loading. It also represents the final moment to configure HTTP status codes and response headers, because headers cannot be modified once byte streaming begins (Lesson 125).
2. **"Which options control the scripts?"**
   The `bootstrapScripts` option accepts an array of script URLs. React emits a matching `<script async>` tag for each entry into the stream, alongside a `<link rel="preload">` in the document `<head>` to begin downloading early. The related `bootstrapModules` option injects ES module scripts, while `bootstrapScriptContent` embeds inline script text. The client script must pass `document` to `hydrateRoot` because the root component renders the `<html>` tag directly.
3. **"What if a slow part never arrives, and the user waits forever?"**
   The server can terminate pending rendering by aborting the stream. On Node.js, the server calls the `abort()` method returned by `renderToPipeableStream`. On Web Streams runtimes, the server supplies an `AbortSignal` from an `AbortController`. When aborted, React flushes remaining loading fallbacks as raw HTML and leaves client-side rendering to resolve deferred components in the browser. Production servers commonly set a timeout such as ten seconds before aborting.

```tree dir=right caption="Interview summary: the two streaming APIs, the script option, and the two moments to start the stream."
How the server streams a React page
- +Node.js [`renderToPipeableStream`] | Returns **`pipe` and `abort`** | Call **`pipe`** inside **`onShellReady`**
- +Deno or an edge runtime [`renderToReadableStream`] | Resolves **when the shell is ready** | Return the stream inside a **`Response`**
- +The script [`bootstrapScripts`] | React adds the **`<script>` that calls `hydrateRoot`** | Without it, **no click works**
- !The wait [`onAllReady` `stream.allReady`] | Sends **only the final HTML** | **Crawlers only**, or every shopper sees a blank tab
```
