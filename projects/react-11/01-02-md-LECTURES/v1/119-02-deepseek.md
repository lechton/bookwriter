# Lecture 119: Static Prerendering: Making the About Page Once, Before Anyone Opens It

*(Why render the About page on every request when React can make the HTML once in advance?)*

> INTERVIEW QUESTION | ❱ CORE | What is static prerendering, and when is it the right choice?

---

## VS | Server Rendering on Every Request vs. Static Prerendering During the Build: identical components, different moment

> A server still renders an About page that never changes for every visitor. Ten thousand visitors means ten thousand identical renders. **Static prerendering avoids that waste: React generates the HTML once during the build with `prerenderToNodeStream` or `prerender`**. Every visitor then downloads that saved file from a CDN or static host, and no React code runs on a server for the request.

Think back to Lesson 102. Every visit to the About route entered an Express request handler. That handler called `renderToString` on `About`, and the resulting HTML string went back over the network.

Now imagine a busy afternoon. Ten thousand shoppers open the About page. The server runs React ten thousand times. It walks the same component tree and turns the same JSX into the same HTML, over and over, for a page that never changed.

*Same input, same output, ten thousand times. The work repeats, but the result does not change.*

Now look at what the page actually displays:

```page width=text caption="The About page of our shop, exactly the same for every visitor."
heading: About our shop
line: Paris
line: Berlin
```

Anna opens the page and sees the shop heading and both cities. Ben opens it two minutes later and sees the same heading and the same locations. Nothing on this screen depends on who is looking. There are no user profiles, no session cookies, and no shopping cart items.

*The page has one answer, and that answer is the same for everyone.*

In plain web development, an HTML document that never changes is not built on the fly. You write the file once, save it on disk, and let the web server hand that exact file to every visitor.

Static prerendering does the same for a React page. It moves the render to the build step. A build file named `build.js` runs once on your machine or in continuous integration. It calls React, writes the finished HTML into `about.html` inside the `dist` folder, and exits. When a real visitor arrives, the server hands over that saved file. React is not in the request path.

### The Smallest Code Side by Side

Here is the difference in two short pieces of code. The first runs for every visitor; the second runs once, before any visitor exists:

```jsx title="The request handler from Lesson 102 vs. build.js in this lesson"
app.use('/about', (request, response) => {
  response.send(~renderToString(<About />)~); // Lesson 102: executes React again for every single visitor
});

const { prelude } = await ~prerenderToNodeStream(<About />)~; // This lesson: executes React once, before any visitor arrives
prelude.pipe(createWriteStream('dist/about.html'));
```

> [!DEFINITION]
> **What is static prerendering?** [NEW] Static site generation, or SSG, means rendering a React component tree into static HTML files once during the build, before any visitor opens the page (Lesson 103). A build file calls `prerender` or `prerenderToNodeStream` from `react-dom/static` instead of calling a render function inside a request handler. The build stores the HTML on disk, and a CDN or static host serves it directly, with no React running at request time (Lesson 119).

In this first example, both approaches share almost everything. They take the same `About` component, run it outside the browser, and produce the same HTML tags. Both are forms of server rendering in the broad sense: React runs outside the browser and returns HTML.

The difference is when React runs. React documentation explains that initial HTML can be generated on the server or during the build. When React runs for each visitor, it is called server-side rendering, or SSR. When it runs once during the build, it is called static site generation, or SSG.

The visitor cannot see the difference. Anna sees the same two cities either way. The server cost is different. With `renderToString` in the request handler, React spends CPU time for every visitor. With `prerenderToNodeStream` in `build.js`, React runs once, and every visitor receives the saved file.

```tree caption="The same About component rendered at two distinct moments: on every visit vs. once during the build."
Two moments when React can render the About page
- !At each visit [`renderToString` in the request handler] | React runs **once for every visitor** | Every run recomputes **the same HTML**
- +Once during the build [`prerenderToNodeStream` in `build.js`] | React runs **once in total** before any visitor comes | Every visitor receives **the saved file**
```

### What Is at Stake

What is at stake is server cost, response speed, and operational simplicity.
1. **The About page needs no live React server.** A static HTML file can sit on a CDN, with copies close to users around the world. It can also sit on a static host that serves files directly. React documentation notes that such applications run on a CDN or static host without an application server running React.
2. **The wrong build tool breaks the page for everyone.** If the build uses `renderToString` while components wait for data, React writes `<p>Loading stores...</p>` into the file. Every visitor then receives that placeholder until the next build.
3. **A personalized page cannot have one correct file for everyone.** If you prerender an account page that greets Anna and Ben by name, the build has no request to inspect. Every visitor gets the same generic file, and nobody is greeted by name.

*The first point saves work. The second warns about writing the wrong result into the file. The third names a screen that cannot answer without a visitor.*

Developers often fall into four traps:
1. They believe a static file cannot hold database data. It can: `prerenderToNodeStream` waits for the data and writes the records into the HTML.
2. They keep rendering a static page on every request because the server already has one generic handler (as seen in Lesson 102).
3. They prerender a page that depends on cookies or live updates, saving stale or generic data into the file.
4. They expect `prerenderToNodeStream` to return an HTML string at once, as `renderToString` does. It returns a Promise of two values. The first is `prelude`, a stream of HTML. The second is `postponed`, `null` when the page is complete.

*Static does not mean "no data." It means the data was read at build time. Static does mean the result is fixed until the next build.*

### The Rule of Thumb: Does the Content Depend on Who Is Visiting?

Ask two questions about every page:
1. Is the page identical for every visitor?
2. Is its data known at the moment you build the site?

Two yes answers mean you prerender the page once during the build. One no answer means React must render the page on every request.

*Both answers must be yes. One no is enough to keep React in the request path.*

## SECTION | The About Page of Our Online Shop

We build the About page of our online shop. It has a heading and a list of two store locations. The store data comes from `db.js`, our stand-in for the database (as seen in Lesson 109). It simulates a two-second query. The build writes its output to `dist`, the folder that holds files sent to visitors:

```files title="shop: File Explorer" caption="The files of the About page, and the static HTML file created by build.js."
db.js | stand-in | Exports `getStores`, which answers with Paris and Berlin after 2 seconds
Stores.jsx | child | Reads `storesPromise` with `use` and returns one list item per store
About.jsx | page | Returns the whole document: the heading, and the store list inside `<Suspense>`
build.js | build | Runs once, during the build: calls `prerenderToNodeStream` and saves the HTML
dist/
  about.html | output | Made by `build.js`: the file that every visitor gets
```

The page has nothing to click: no counters, no form inputs, no state updates. So the build passes no client script bundles. The HTML file contains zero `<script>` tags, and React never loads or runs in the visitor's browser. This lesson is about where and when the HTML is made, not about interactivity.

*A page with no controls needs no JavaScript. The saved HTML is the whole page.*

**PRINCIPLES:** Static prerendering runs React once during the build and writes plain HTML files. Three practical principles follow:
1. **Principle 1: prerenderToNodeStream Renders the Page Once Before Any Visitor Arrives.** It returns a Promise of `prelude` and `postponed`; the build pipes the stream into a file.
2. **Principle 2: prerender Waits Until Every Suspense Boundary Finishes Loading Its Data.** Unlike `renderToString`, it pauses until the data arrives, so the file holds real content instead of a fallback.
3. **Principle 3: A Build Without a Request Means Every Visitor Receives the Same Saved File.** The approach fits pages whose content is identical for all users. A page that greets a user by name, or changes every second, needs a render per request.

---

## PRINCIPLE | prerenderToNodeStream: the build renders the page once before any visitor arrives

> [!PRINCIPLE]
> **Principle 1: Build-Time Rendering: prerenderToNodeStream Writes the Page Once, Before Any Visitor Opens It**
>
> *For a page that is identical for every visitor, call `prerenderToNodeStream` or `prerender` once during the build, and save `prelude` as an HTML file that every visitor receives.*
>
> Rendering a component to HTML and serving a visitor are two independent steps. The first can happen at build time; the second happens when someone opens the page. For an About page that never changes, React does not need to sit inside a web server handler. Call `prerenderToNodeStream` in `build.js`, await its Promise of `{ prelude, postponed }`, and pipe `prelude` into `dist/about.html`. From then on, every visitor gets that file directly, and no React code runs for the request.
>
> **DO THIS:**
> ```jsx
> const { prelude } = await ~prerenderToNodeStream(<About />)~; // build.js: React renders About once during the build
> prelude.pipe(createWriteStream('dist/about.html'));
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> app.use('/about', (request, response) => {
>   response.send(~renderToString(<About />)~); // **WRONG:** the page is identical for everyone, yet React renders again on every request
> });
> ```

Here is the smallest `build.js` file that renders our About page:

```jsx title="build.js"
import { ~prerenderToNodeStream~ } from 'react-dom/static'; // 1. React static generation API for Node.js Streams
import { createWriteStream } from 'node:fs';
import About from './About.jsx';

const { ~prelude~ } = await prerenderToNodeStream(<About />); // 2. React renders About once at build time
prelude.pipe(~createWriteStream('dist/about.html')~); // 3. The HTML stream writes directly into a file
```

Each piece of this file comes from a specific place:
- **`react-dom/static`** is React's package for static generation. It exports the APIs that produce static HTML for React components.
- **`prerenderToNodeStream`** is React's build-time renderer for Node.js. It turns a component tree into static HTML using a Node.js Stream (as seen in Lesson 118).
- **`createWriteStream`** comes from Node.js, not React. It opens the output file as a writable stream, and `pipe` writes the HTML chunks into it. The `dist` folder must exist first, or Node.js stops with an error.
- **`await`** pauses until the Promise resolves. `build.js` is an ES module, so top-level `await` works outside any function.

Now look at `About.jsx`. It returns the entire document, starting with `<html>`:

```jsx title="About.jsx"
export default function About() {
  return (
    ~<html>~ {/* The root document: React injects the doctype above it */}
      <head>
        <title>About our shop</title>
      </head>
      <body>
        <h1>About our shop</h1>
      </body>
    </html>
  );
}
```

React expects the root component to represent the entire document, so `About` renders `<html>`. React writes the doctype above it.

> [!DEFINITION]
> **What are prelude and postponed?** [NEW] `prerender` and `prerenderToNodeStream` return a Promise that resolves to an object with two properties: `prelude` and `postponed`. `prelude` is a stream of HTML. You can pipe it into a file or a response, or read it into a string with `getReader()`. `postponed` is `null` when the prelude holds all the content and nothing needs to resume. If the render is aborted or leaves parts unfinished for later, `postponed` holds the state that `resume` needs in Partial Pre-rendering (Lesson 120).

### What renderToString and prerenderToNodeStream Return

Both functions turn the `About` component into HTML. Their return values are not interchangeable:

```jsx title="Comparing what renderToString and prerenderToNodeStream return"
const html = ~renderToString(<About />)~; // Returns an HTML string immediately
const { prelude, postponed } = await ~prerenderToNodeStream(<About />)~; // Returns a Promise resolving to an object with two fields
```

Both names contain the word render, so developers expect a string from both. Only the first call returns one. The second returns a Promise. The resolved object holds `prelude`, a stream of HTML chunks, and `postponed`. That second value is `null` when the page is complete.

*One returns text you can use at once. The other returns a Promise of a stream and a postponed state.*

### The Two Static APIs: prerender vs. prerenderToNodeStream

React provides two prerender APIs in the static package. Both take a component tree and resolve to `{ prelude, postponed }`. They differ in the kind of stream inside `prelude`:

```jsx title="The two static prerender APIs in react-dom/static"
import { ~prerender~ } from 'react-dom/static'; // prelude is a Web Stream for browsers, Deno, and edge runtimes
import { ~prerenderToNodeStream~ } from 'react-dom/static'; // prelude is a Node.js Stream for Node.js environments
```

They do the same job. `prerender` produces a standard Web Stream, the kind used in Deno, browsers, and modern edge runtimes. `prerenderToNodeStream` produces a Node.js Stream. In a Node.js build script, React recommends the Node.js version because Node.js handles a Web Stream more slowly.

*Same render and same result, delivered through a different kind of stream.*

The same build-time idea applies to Server Components in a full-stack setup. React documentation notes that they can run once on the build server and produce static HTML alongside serialized data.

```tree dir=right caption="From build.js to the visitor browser: React runs once at build time, and visitors receive only the file."
The static prerendering workflow
- +1. Developer runs the build [`build.js`] | React **renders `About` once** | There is **no visitor** and no `request`
- +2. Build saves the file [`dist/about.html`] | `prelude` is **piped to disk** | React injects **the doctype** automatically
- +3. Visitor opens the page | The static host **sends the saved file** | **No React runs** on the server or in the browser
```

### Inspecting the Generated HTML File

When the build finishes, `about.html` holds the full HTML document:

```html title="dist/about.html"
~<!DOCTYPE html>~ <!-- Injected automatically by React: About.jsx never writes it -->
<html>
  <head>
    <title>About our shop</title>
  </head>
  <body>
    <h1>About our shop</h1>
  </body>
</html>
```

React injects `<!DOCTYPE html>` at the start of the stream whenever the root component renders `<html>`. The JSX never writes it.

There is no `<script>` tag anywhere in the file. That is deliberate. `bootstrapScripts` is the option that adds client bundles; leave it out when you do not want React to run in the browser at all. Our About page has nothing to click, so it needs no client script. The file stays small, and the browser does no React work.

*No client script does not mean a broken page. It means a plain HTML page, which is exactly what this screen is.*

---

## PRINCIPLE | prerender: the stream waits until every Suspense boundary finishes loading its data

> [!PRINCIPLE]
> **Principle 2: Suspense Resolution: prerender Waits Until All Data Loads Before Resolving**
>
> *`prerender` and `prerenderToNodeStream` resolve only after every `<Suspense>` boundary has finished loading, so data read with `use` is written directly into the static HTML file.*
>
> A static file can hold real data, not just hardcoded text. When a component suspends on a Promise with `use`, the prerender APIs keep waiting until that Promise resolves. They replace the Suspense fallback with the real content before the HTML stream completes. `renderToString` cannot do that. It writes the fallback immediately, returns, and leaves visitors on a page permanently stuck on a loading message.
>
> **DO THIS:**
> ```jsx
> const { prelude } = await ~prerenderToNodeStream(<About storesPromise={getStores()} />)~; // Waits for getStores() to resolve before writing HTML
> prelude.pipe(createWriteStream('dist/about.html'));
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const html = ~renderToString(<About storesPromise={getStores()} />)~; // **WRONG:** returns immediately, writing Loading stores... permanently into the file
> ```

Now we add real data. Our database stand-in simulates a two-second query for store locations:

```js title="db.js"
export function ~getStores~() { // Simulates a database query returning Paris and Berlin after 2 seconds
  return new Promise(resolve => {
    setTimeout(() => resolve(['Paris', 'Berlin']), 2000);
  });
}
```

The build script calls `getStores` and passes the Promise down to `About`. A child component named `Stores` reads that Promise with `use` (as seen in Lesson 71):

```jsx title="Stores.jsx"
import { use } from 'react';

export default function Stores({ storesPromise }) {
  const stores = ~use(storesPromise)~; // Suspends the component until db.js resolves
  return (
    <ul>
      {stores.map(store => <li key={store}>{store}</li>)}
    </ul>
  );
}
```

`About` places `Stores` inside a Suspense boundary and gives it a fallback paragraph:

```jsx title="About.jsx" startLine="10"
<body>
  <h1>About our shop</h1>
  <Suspense ~fallback={<p>Loading stores...</p>}~> {/* Rendered while Stores waits for its data */}
    <Stores storesPromise={storesPromise} />
  </Suspense>
</body>
```

Here is what happens when we build this page using `renderToString` versus `prerenderToNodeStream`:

::: row caption="The same About page built with renderToString vs. prerenderToNodeStream: only prerender waits for data."
::: col title="renderToString in build.js" tag="saves the fallback" tone=bad
```page size=mini
heading: About our shop
line: Loading stores... | bad
```
```jsx title="build.js" bad="1"
const html = renderToString(
  <About storesPromise={getStores()} />
);
```
The file holds `Loading stores...` and zero stores.
:::
::: col title="prerenderToNodeStream in build.js" tag="waits for the stores" tone=good
```page size=mini
heading: About our shop
line: Paris | good
line: Berlin | good
```
```jsx title="build.js" good="1"
const { prelude } = await prerenderToNodeStream(
  <About storesPromise={getStores()} />
);
```
The file holds Paris and Berlin.
:::
:::

> [!DEFINITION]
> **What is waiting for data during prerendering?** [NEW] Unlike `renderToString`, which returns immediately and writes a Suspense fallback when data is pending, `prerender` and `prerenderToNodeStream` wait for all Suspense-visible data to load before resolving (Lesson 119). When a component suspends by reading a Promise with `use`, React pauses the prerender stream until the Promise resolves. Only data read from a source that activates a Suspense boundary causes React to wait; data fetched inside `useEffect` or event handlers is not detected by Suspense.

### Why One File Holds the Fallback and the Other Lists the Cities

Here is what happens during the build, step by step:
1. The build runs `build.js`. `getStores` starts its two-second timer and returns a pending Promise.
2. React renders `About`. At `Stores`, `use(storesPromise)` meets the pending Promise and suspends.
3. **With `renderToString`**, React does not wait. It renders the nearest `<Suspense>` fallback, `<p>Loading stores...</p>`, into the HTML string and returns. The file holds only that line. Because the page has no client scripts, no hydration runs in Anna's browser, and the loading text stays forever.
4. **With `prerenderToNodeStream`**, React pauses. Two seconds later, `getStores` resolves with `['Paris', 'Berlin']`. React finishes `Stores` as list items for both cities.
5. Only then does the Promise from `prerenderToNodeStream` resolve. `prelude` delivers the complete document, and every visitor sees both stores.

*The build does not finish while data is pending. That single fact decides whether the file holds cities or a loading line.*

```tree dir=right caption="What happens during the build when Stores suspends on pending data."
The build reaches Stores while data is pending
- !With `renderToString` | **Does not wait**: emits the **fallback** immediately | File displays **`Loading stores...`** permanently
- +With `prerenderToNodeStream` | **Waits** for every `<Suspense>` boundary to resolve | File displays **Paris and Berlin** directly
```

React documentation states the same distinction: `renderToString` returns a string at once, so it cannot wait for data during static HTML generation.

### What prerender Waits For, and What It Never Sees

`prerender` waits only for reads that activate a Suspense boundary.

Compare reading data with `use` to fetching inside an Effect:

```jsx title="Reading data with use vs. fetching inside an Effect"
const stores = ~use(storesPromise)~; // Suspends: prerender waits, and stores are saved into the HTML
useEffect(() => { ~getStores().then(setStores)~; }, []); // **WRONG:** Suspense does not detect this, so prerender never waits
```

Both lines can put stores on the screen, so they may look interchangeable. They do not act at the same moment, and prerendering sees only one of them. `prerender` never runs `useEffect`, because Effects run in a browser after React has painted the DOM. If `Stores` fetches inside an Effect, Suspense never activates, `prerender` resolves with the empty first state, and the file contains zero stores.

*Suspense makes a read visible to the build. An Effect starts only in the browser, after the build is over.*

In production, static data often comes from a database or a content management system. As long as components read it through a Promise inside Suspense, the build waits for that response and writes it into the file.

### Static Waiting vs. Live Streaming

This behavior may remind you of `renderToPipeableStream` with the `onAllReady` callback (as seen in Lesson 118). Both wait until every Suspense boundary completes before the HTML is finished. Their purpose is different. `renderToPipeableStream` is built for a live web server, where chunks can go to a visitor as they arrive. `prerenderToNodeStream` is built for ahead-of-time static generation. It does not send progressive updates over an open connection. It completes the whole render and writes one finished file to disk.

*Both wait for the data. Only one is designed to keep a visitor connected while it waits.*

What if a database or CMS hangs during the build? Pass an `AbortController` signal to `prerender` with a timeout, such as 10000 milliseconds. If the timeout fires, React aborts the wait. Incomplete Suspense boundaries output their fallback markup, and `postponed` holds the remaining work instead of `null`. That state enables Partial Pre-rendering (Lesson 120).

*A timeout does not throw the build away. It saves the page with fallbacks, and `resume` can fill the rest later.*

---

## PRINCIPLE | prerender without request: every visitor receives the exact same saved file

> [!PRINCIPLE]
> **Principle 3: Static Scope: Prerender Only Content That Is Identical for Every Visitor**
>
> *Static prerendering fits pages whose markup is identical for all visitors and whose data is known at build time; pages that depend on the visitor's identity or live data must be rendered per request.*
>
> During the build there is no visitor, no HTTP request object, and no session cookie. If you prerender a personalized account page, every visitor receives the same generic snapshot from build time, and nobody is greeted by name. Keep About, help, and landing pages as static files on a CDN. Serve account pages and fast-moving feeds through server-side rendering on each request.
>
> **DO THIS:**
> ```jsx
> const { prelude } = await ~prerenderToNodeStream(<About storesPromise={getStores()} />)~; // Identical About page for all visitors
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const { prelude } = await ~prerenderToNodeStream(<Account />)~; // **WRONG:** build has no request object, so nobody is greeted by name
> ```

Our shop has another page every user knows: the account page. It greets the visitor by name. Anna sees `Hi, Anna`; Ben sees `Hi, Ben`:

::: row caption="The About page is identical for all visitors; the account page differs for each user."
::: col title="The About page" tag="one file for everyone" tone=good
```page size=mini
heading: About our shop
line: Paris
line: Berlin
```
Anna and Ben see the same page.
:::
::: col title="The account page" tag="one render per visitor" tone=good
```page size=mini
heading: Hi, Anna
```
```page size=mini
heading: Hi, Ben
```
Anna and Ben each see their own name.
:::
:::

Now examine where each page runs:

```jsx title="build.js has no request; the server request handler receives request on every visit"
const { prelude } = await ~prerenderToNodeStream(<About storesPromise={getStores()} />)~; // build.js: runs once with no visitor and no request

app.use('/account', (~request~, response) => { // Runs on every visit, receiving the visitor's request and session cookies
  response.send(renderToString(<Account />));
});
```

`build.js` has no visitor. Look at the signature: `prerenderToNodeStream(reactNode, options)`. It takes a component and build options. It does not take a `request`. It cannot read session cookies, request headers, or authentication tokens.

An Express request handler is different. It receives the incoming `request` on every visit, so it can see who is signed in and render that person's name.

React renders both pages outside the browser. The two renders are NOT the same thing! The About page has one answer for all visitors, made once at build time. The account page has a different answer for each visitor, made at the moment of the request.

*One function runs before visitors exist. The other runs because a visitor exists.*

### What Goes Wrong When You Prerender a Dynamic Page

Suppose a team sees that static files are fast and cheap and decides to prerender `Account` beside `About`. Nobody is greeted by name. Here is why:
1. `build.js` runs at build time. There is no active user, no browser session, and no cookie.
2. Whatever default or blank markup `Account` renders without a user is saved into the file.
3. Anna and Ben both request the page and receive the same saved HTML. Neither sees `Hi, Anna` or `Hi, Ben`.

React prints no warning and no error. The build succeeds, but the file delivers the wrong information. The team must move `<Account />` back into the request handler.

*A successful build is not proof that the page is correct.*

### A New Store Opens in Rome

A static file is fixed across visitors. It is also fixed across time: it reflects what was true when the build ran.

Suppose the shop opens a third location in Rome, and we update `db.js`:

```js title="db.js" startLine="3"
setTimeout(() => resolve(~['Paris', 'Berlin', 'Rome']~), 2000); // A third store is added to the database
```

Anna opens `about.html` the following morning:

```page width=text caption="The About page after Rome was added to db.js, before a new build runs."
heading: About our shop
line: Paris
line: Berlin
```

Rome is missing. The file was generated yesterday during the build. A static file does not query the database when a visitor requests it. Rome appears only after the developer runs the build again:

```page width=text caption="The About page after the developer runs the build again."
heading: About our shop
line: Paris
line: Berlin
line: Rome | good
```

*Fixed for every visitor also means fixed until the next build.*

For an About page, this behavior is ideal. Store locations change once a year, and rebuilding on deployment is fast and reliable. For a page with fast-changing data, which React documentation calls a content feed, static prerendering is the wrong choice. Feed pages must be rendered on the server for each request (Lesson 129).

Modern full-stack frameworks handle the choice per route. React documentation explains that you can choose static generation for a landing page and server rendering for a feed in the same application.

### The Security Caveat: CSP and Nonces

Why can you never include a Content Security Policy, or CSP, `nonce` in a static prerendered file?

React documentation warns directly: nonces must be unique per request. A `nonce` is a single-use cryptographic token that tells the browser which scripts may run. If you write one nonce into a static file shared by thousands of visitors, it stops being unique per request, and the protection is gone. React documentation says it is inappropriate and insecure to put the nonce value in the prerender itself.

*A nonce protects one response. A static file sends the same response to everyone.*

```tree caption="Deciding whether static prerendering is the right choice for a page."
Is static prerendering the right choice for this page?
- +Identical for all visitors, data known at build time [About page, landing page, documentation] | +**DO** prerender in `build.js` | Saved file served directly from a **CDN or static host**
- !Different for each visitor [Account page, settings, shopping cart] | ~Do **NOT** prerender | `build.js` has **no visitor request**, so nobody is greeted by name
- !Data changes continuously [Live content feed, stock prices] | ~Do **NOT** prerender | Static file displays **stale data from the last build**
```

---

## All Three Principles Together

### The Complete About Page Project

Here are the four files that produce the page. `db.js` is the database stand-in:

```js title="db.js"
export function ~getStores~() { // Simulates a database query returning Paris and Berlin after 2 seconds
  return new Promise(resolve => {
    setTimeout(() => resolve(['Paris', 'Berlin']), 2000);
  });
}
```

`Stores.jsx` reads the Promise with `use` and suspends until the data arrives:

```jsx title="Stores.jsx"
import { use } from 'react';

export default function Stores({ storesPromise }) {
  const stores = ~use(storesPromise)~; // Suspends the component until db.js resolves
  return (
    <ul>
      {stores.map(store => <li key={store}>{store}</li>)}
    </ul>
  );
}
```

`About` renders the entire document and places `Stores` inside a Suspense boundary:

```jsx title="About.jsx"
import { Suspense } from 'react';
import Stores from './Stores.jsx';

export default function About({ storesPromise }) {
  return (
    ~<html>~ {/* The root document: React injects the doctype above it */}
      <head>
        <title>About our shop</title>
      </head>
      <body>
        <h1>About our shop</h1>
        <Suspense fallback={<p>Loading stores...</p>}>
          <Stores storesPromise={storesPromise} />
        </Suspense>
      </body>
    </html>
  );
}
```

`build.js` runs once at build time. It awaits `prerenderToNodeStream` and pipes the stream to disk:

```jsx title="build.js"
import { prerenderToNodeStream } from 'react-dom/static';
import { createWriteStream } from 'node:fs';
import About from './About.jsx';
import { getStores } from './db.js';

const { prelude } = await ~prerenderToNodeStream(~ // Resolves only after all Suspense boundaries complete
  <About storesPromise={getStores()} />
);
prelude.pipe(~createWriteStream('dist/about.html')~); // Writes the static HTML file to disk
```

Here is the page visitors receive from the CDN or static host, with zero server React work:

```page width=text caption="The finished About page: identical prerendered HTML served to every visitor."
heading: About our shop
line: Paris
line: Berlin
```

### The Build-Time Lifecycle

When the developer runs the build, React renders from `About` down to `Stores`, pauses while the data loads, and writes the finished HTML:

*React starts the page, stops at the missing data, then finishes the file when the data arrives.*

```tree dir=right caption="The complete static prerendering pipeline from build script to visitor browser."
How `build.js` generates `dist/about.html`
- +1. `build.js` calls `prerenderToNodeStream` | `getStores` **starts its 2-second database query** | No visitor, no `request`
- +2. React renders `About` | Heading is **rendered immediately** | `Stores` **suspends on `use`**
- +3. Database resolves | React renders `Stores` with **Paris and Berlin** | Promise resolves with **`{ prelude, postponed }`**
- +4. Build pipes stream | `prelude` writes into **`dist/about.html`** | `postponed` is **`null`**
- +5. Visitor opens page | CDN or static host **serves the saved file** | **Zero React code executes** on request
```

| Aspect | The Habit That Breaks | The React Rule |
| :--- | :--- | :--- |
| **When React runs** | Render the About page on every request in the server handler | Render it once in `build.js` with `prerenderToNodeStream`, and serve the saved file |
| **What is returned** | Expect an HTML string immediately, as from `renderToString` | Expect a Promise of `{ prelude, postponed }`: `prelude` is an HTML stream, and `postponed` is `null` when complete |
| **Which API to call** | Call Web Stream methods inside Node.js scripts | Call `prerenderToNodeStream` in Node.js, and `prerender` in Web Stream environments |
| **Asynchronous data** | Build with `renderToString` or fetch in `useEffect`, saving `Loading stores...` | Read data with `use` inside `<Suspense>`, so `prerender` waits until real data is in the HTML |
| **Which pages to prerender** | Prerender every page because static files are fast | Prerender only pages that are identical for every visitor and whose data is known at build time |

---

## For the Interview

> **The Interview Question:** What is static prerendering, and when is it the right choice?

### How to Answer Clearly in 30 Seconds

"Static prerendering means React renders a component tree to static HTML once during the build. The result is saved to disk, and every visitor receives that same saved file. React documentation also calls this static site generation, or SSG. It uses the same components as server-side rendering. The only difference is when React runs: once per request for SSR, once per build for SSG. In React 19, call `prerender` for Web Streams or `prerenderToNodeStream` for Node.js; both come from `react-dom/static`. Four facts define how they work:
1. **Return value**: both return a Promise of `{ prelude, postponed }`. `prelude` is a stream of HTML, and `postponed` is `null` when the page is complete.
2. **Waiting for data**: unlike `renderToString`, both wait for every Suspense boundary to finish loading data read with `use`. The real records go into the HTML, not the fallback.
3. **When to choose it**: the page is identical for all visitors and its data is known at build time. About, help, and landing pages fit. They can be served from a CDN or static host with no server.
4. **When to avoid it**: personalized pages such as accounts, and fast-changing feeds. Those need a render per request."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why is `prelude` a stream instead of a plain string?"**
   Because a stream avoids holding a large document in memory. You can pipe it to a file, send it in chunks, or read it into a string with `getReader()`. `prerender` itself does not stream progressive updates as data arrives. It waits for the whole tree and every Suspense boundary before it resolves.
2. **"What happens if data fetching hangs or times out during the build?"**
   You can pass an `AbortController` signal to `prerender` with a timeout, such as 10000 milliseconds. If the timeout elapses before the data resolves, React aborts the wait. Incomplete Suspense boundaries stay in the `prelude` as fallbacks, and `postponed` holds the remaining work instead of `null`. That state can be resumed later with `resume` in Partial Pre-rendering (Lesson 120).
3. **"Can a static prerendered page be interactive, and why can it not use a CSP nonce?"**
   Yes, it can be interactive. Pass client bundle paths through `bootstrapScripts`; the browser downloads the bundle and calls `hydrateRoot` to attach event listeners (as seen in Lesson 104). If the page has no controls, omit `bootstrapScripts` and the file ships zero client JavaScript. The nonce is the part that cannot work. A CSP nonce must be unique per HTTP request. A static file is the same response for every visitor, so a nonce written into it is no longer unique, and the protection is compromised.

```tree dir=right caption="Interview comparison: per-request SSR vs. build-time SSG."
`renderToString` on each request vs. `prerenderToNodeStream` during the build
- +At each request [`renderToString`] | React runs **once per visitor** with the `request` in hand | Best for **personalized pages** or **live feeds**
- +Once during the build [`prerender` `prerenderToNodeStream`] | React runs **once in total** and waits for every Suspense boundary | Best for **pages identical for all visitors**, served from a **CDN or static host**
```
