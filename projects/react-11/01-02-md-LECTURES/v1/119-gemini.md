# Lecture 119: Static Prerendering: Making the About Page Once, Before Anyone Opens It

*(How can React make the HTML of a page once, before any visitor opens it?)*

> INTERVIEW QUESTION | ❱ CORE | What is static prerendering, and when is it the right choice?

---

## VS | `renderToString` in the Request Handler vs. `prerenderToNodeStream` in `build.js`: the same HTML, made for every visitor or made once

> Traditional server rendering executes components inside the request handler, creating identical HTML from scratch for every incoming visitor. **Static prerendering renders the component tree once during the project build and writes the output to a static HTML file**. When a page presents identical content to every user, the server does not need to run React on each visit. It simply transmits the saved file from storage.

Consider the simplest web page: a static HTML file stored on a disk. You create the file, upload it to a web server, and the server transmits that exact document whenever a client requests it. The server executes no application code during the visit. The document sits ready before anyone arrives.

In traditional server rendering, the server runs React components dynamically on every incoming request (Lesson 102):

```jsx title="server.js: the About page, rendered for every visitor"
app.use('/about', (request, response) => {
  response.send(~renderToString(<About />)~); // Runs React again for every visitor who opens the page
});
```

Now examine the About page of our online shop. It displays a heading and the two store locations in Paris and Berlin. When Anna opens the page, she sees Paris and Berlin. When Ben opens the page a minute later, he receives the exact same markup. Nothing on this page depends on user identity or request headers. If one thousand visitors receive identical HTML, running component code one thousand times wastes server memory and processing power.

React does not need to render this page on every request. **React can render the component tree once ahead of time and store the resulting HTML in a file.** This technique is called static prerendering. It restores the performance of a static web page, while letting developers build the layout with reusable React components.

Generating HTML during request handling repeats identical computations. Only the first render produces meaningful new markup; subsequent renders duplicate that exact work. A saved static file requires no server-side React execution at runtime. A Content Delivery Network, known as a CDN, can cache the file across distributed edge servers worldwide and deliver it from the closest physical location. A static hosting service can deliver the document directly from object storage without maintaining an active Node server. Official React documentation notes that such applications can be deployed to a CDN or static hosting service without a server.

### When the File Is Made: the Build

> [!DEFINITION]
> **The build.** [NEW] The build is the ahead-of-time phase where tools transform source code into deployable production assets before any visitor accesses the site. Triggered by a command such as `npm run build`, it executes on a developer machine or continuous integration server without incoming HTTP requests or user sessions. Its output collects in a distribution directory, containing the exact static assets served to users (Lesson 119).

To implement static prerendering, we create a script named `build.js` that runs during this compilation step. The script renders the `About` component once and writes the resulting HTML markup to disk:

```jsx title="build.js: renders the About page once, during the build"
const { prelude } = await ~prerenderToNodeStream(<About />)~; // Runs React once, before any visitor comes
prelude.pipe(createWriteStream('dist/about.html'));
```

Both approaches execute the same `About` component outside a browser environment. Both turn React JSX elements into identical HTML text. Both represent server rendering. Yet their operational architectures differ completely:
- **`renderToString` in a request handler** runs React dynamically on every incoming request, computing markup per visitor.
- **`prerenderToNodeStream` in a build script** runs React once during compilation, producing a fixed file that every visitor shares.

Official React documentation states that initial HTML can be generated on the server or during the build. The terminology reflects this timing distinction. **Server-side rendering** generates HTML dynamically per request, while **static site generation**, commonly abbreviated as SSG, generates HTML ahead of time during the build.

```tree caption="The same About component, rendered at two moments: at each visit, or once during the build."
Two moments when React can render the About page
- !At each visit [`renderToString` in the request handler] | React runs **once for every visitor** | Every run gives **the same HTML** again
- +Once, during the build [`prerenderToNodeStream` in `build.js`] | React runs **once in total**, before any visitor comes | Every visitor gets **the saved file**
```

Here is the central rule to remember throughout this lesson:

**Static prerendering is server rendering done once, during the build, instead of once for every visitor.**

### The Two Words in the Name

The two terms in static prerendering describe the exact architecture:
- **Prerender** indicates that component evaluation occurs ahead of time, before any visitor requests the URL.
- **Static** indicates that the resulting HTML file remains fixed, serving identical content to every subsequent visitor. React documentation refers to this output as static HTML.

### Three Ideas From Earlier Lessons

> [!DEFINITION]
> **Server rendering.** [REVIEW] Server rendering executes React components on a server to generate HTML strings or streams, allowing browsers to display visual structure before downloading client JavaScript. Invoking `renderToString(<About />)` inside an HTTP route handler evaluates components dynamically, re-rendering the tree on every incoming visitor request (Lesson 102).

> [!DEFINITION]
> **Suspense and use.** [REVIEW] A component reads an asynchronous Promise with the `use` API, such as `use(storesPromise)`. When the Promise remains pending, the component suspends, pausing its rendering. The nearest `<Suspense>` boundary catches this pause and displays its fallback UI until the Promise resolves, allowing React to render the component with loaded data (Lessons 69 and 71).

> [!DEFINITION]
> **A stream of HTML.** [REVIEW] A stream delivers HTML progressively in chunks rather than buffering a single finished string in memory. Node.js provides a native stream implementation, while modern edge runtimes and browsers use the standard Web Streams API. Calling `pipe` connects a Node.js stream to a writable destination, directing chunks into an HTTP response or a local file (Lesson 118).

### Which Pages Can Be Made in Advance

Every web page reaches a visitor as HTML markup, but teams can generate that markup at different stages (Lesson 103):
1. **Client-side rendering:** the browser receives an empty root element and generates DOM nodes using client JavaScript.
2. **Server-side rendering:** the server executes components on each incoming request using `renderToString` or streaming APIs (Lessons 117 and 118).
3. **Static prerendering:** React evaluates components once during the build process, saving completed markup to disk.
4. **Partial prerendering:** React prerenders static page shells ahead of time, while streaming dynamic data holes on each request (Lesson 120).

Official React documentation summarizes the architectural trade-off: marketing landing pages benefit from static generation, whereas dynamic content feeds perform best with server-side rendering. Our store About page matches the static pattern perfectly. Its company overview and store locations remain identical for every user, updating only when the business expands.

## SECTION | The About Page of Our Shop

The About page presents a top-level heading followed by a list of two retail locations:

```page width=text caption="The About page of our shop, exactly the same for every visitor who opens it."
heading: About our shop
line: Paris
line: Berlin
```

The store records originate from a database helper module (Lesson 109), which resolves after two seconds. The build script outputs the generated document into a distribution directory containing deployable assets:

```files title="shop: File Explorer" caption="The files of the About page, and the HTML file that build.js makes."
db.js | stand-in for the database | Exports `getStores`, which answers with Paris and Berlin after 2 seconds
Stores.jsx | child | Reads `storesPromise` with `use` and returns one list item per store
About.jsx | page | Returns the whole document: the heading, and the store list inside `<Suspense>`
build.js | build | Runs once, during the build: calls `prerenderToNodeStream` and saves the HTML
dist/
  about.html | output | Made by `build.js`: the file that every visitor gets
```

Because this static page contains no interactive controls, it requires no client-side JavaScript bundles. React never executes inside the visitor browser. The entire architecture focuses on a single operational question: at what moment does React compile component markup into HTML?

**PRINCIPLES:** Static prerendering is server rendering done once during the build, rather than once per incoming request. Three fundamental principles govern this process:
1. **`prerenderToNodeStream` in a build script renders the page once.** It returns a Promise resolving to `{ prelude, postponed }`, allowing the build script to stream `prelude` into a static file.
2. **`prerenderToNodeStream` pauses until asynchronous data resolves.** It completes only after all `<Suspense>` boundaries render their loaded content. In contrast, `renderToString` terminates immediately and saves fallback loaders.
3. **A prerendered file serves identical content to all users until the next build.** This model suits universal pages backed by stable build-time data. Pages requiring user authentication or live feeds must render per request.

---

## PRINCIPLE | `prerenderToNodeStream` in `build.js`: React renders the page once, before any visitor comes

> [!PRINCIPLE]
> **Principle 1: Static Prerendering: `prerenderToNodeStream` Renders the Page Once, During the Build**
>
> *For a page that is the same for every visitor, call `prerenderToNodeStream` or `prerender` once in the build, and save `prelude` as an HTML file that every visitor gets.*
>
> Rendering a page and answering a visitor are two separate steps. A page that never changes needs only one render. The build calls `prerenderToNodeStream`, the Promise resolves to `{ prelude, postponed }`, and the build pipes `prelude` into a file. From then on, each visit only sends that file, and no React runs for the visitor.
>
> **DO THIS:**
> ```jsx
> const { prelude } = await ~prerenderToNodeStream(<About />)~; // build.js: React renders About once, before any visitor
> prelude.pipe(createWriteStream('dist/about.html'));
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> app.use('/about', (request, response) => {
>   response.send(~renderToString(<About />)~); // **WRONG:** the page is the same for everyone, yet React runs again for every visitor
> });
> ```

Here is the minimal build script that generates the About page. In this initial step, `About` returns only the document heading:

```jsx title="build.js"
import { ~prerenderToNodeStream~ } from 'react-dom/static'; // The static APIs of React
import { createWriteStream } from 'node:fs';
import About from './About.jsx';

const { ~prelude~ } = await prerenderToNodeStream(<About />); // React renders About once
prelude.pipe(~createWriteStream('dist/about.html')~); // The HTML flows into a file
```

Five lines assemble this prerendering pipeline, combining APIs from React and Node.js:
- The **static package entrypoint** belongs to React. It exposes static generation methods designed to compile components into HTML ahead of time.
- **`prerenderToNodeStream`** is provided by React. Like traditional server rendering, it turns components into HTML, but returns a stream controller wrapped in a Promise.
- **`createWriteStream`** belongs to the native file system module in Node.js. It opens a writable file stream pointing to the destination path. While Lesson 118 piped markup into a network response, this script pipes markup directly into a local file.
- The **`await`** keyword pauses execution until the prerender Promise resolves (Lesson 41). Because this script runs as an ES module, top-level `await` operates directly without a wrapping async function.

Notice an important file system requirement: `createWriteStream` cannot create missing directories. The distribution folder must already exist before compilation starts. If that directory is missing, the build terminates with a file system error.

The `About` component renders the root `<html>` element. React documentation expects prerendered root components to represent complete HTML documents, containing head and body tags:

```jsx title="About.jsx"
export default function About() {
  return (
    ~<html>~ {/* The whole document: React adds the doctype above it */}
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

### What Happens When the Developer Runs the Build

**React executes for the About page exactly once during the project build. After that single compilation, React never executes for any visitor, neither on a server nor in a browser.** Here is the sequential runtime order:
1. The developer triggers the build command. The build script invokes `prerenderToNodeStream` with the root component element.
2. React renders the component tree. No incoming network request or HTTP response object exists during this step.
3. The returned Promise resolves to an object with two properties: `prelude` and `postponed`. In this static build, `postponed` is null.
4. The script pipes `prelude` into a write stream, saving markup to the target HTML file.
5. Later, Anna visits the website. The static file server returns the stored document immediately without executing React.
6. Because the build script omitted bootstrap script options, the HTML contains no script tags (Lesson 118). React never executes inside Anna's browser.

```tree dir=right caption="Two separate moments: React renders once during the build, and each visit only sends the saved file."
From `build.js` to Anna's browser
- +1. The developer runs the build [`build.js`] | React **renders `About` once** | There is **no visitor** and no `request`
- +2. The build saves the HTML [`dist/about.html`] | `prelude` is **piped into the file** | The file starts with **the doctype**
- +3. Anna opens the page | The static host **sends the saved file** | **No React runs** for Anna
```

### VS | `renderToString` vs. `prerenderToNodeStream`: a string right away, or a Promise of an object

Both functions transform the `About` component into HTML markup, but their return signatures differ fundamentally:

```jsx title="What renderToString and prerenderToNodeStream give back"
const html = ~renderToString(<About />)~; // A string of HTML, right away
const { prelude, postponed } = await ~prerenderToNodeStream(<About />)~; // A Promise that resolves to an object with two fields
```

Both function names include the word render, which can lead developers to expect identical return types. Yet their runtime behavior is completely different:
- **`renderToString`** evaluates components synchronously and returns a completed HTML string immediately.
- **`prerenderToNodeStream`** returns a Promise that resolves to an object holding `prelude` and `postponed`.

Developers switching from older server rendering methods often expect an immediate string. Attempting to pass the return value of `prerenderToNodeStream` directly to a synchronous sink causes runtime failures because the function returns a pending Promise.

When that Promise resolves, its payload contains two distinct properties:
- **`prelude`** contains the generated HTML as a readable stream. React documentation explains that you can stream this output in chunks or read the entire stream into a single string. Our build script pipes this stream directly into a file.
- **`postponed`** holds null in this complete build. React documentation explains that a null value signals that `prelude` contains all page markup, requiring no subsequent resume phase. When `postponed` contains an object, deferred sections of the page remain unrendered (Lesson 120).

The object destructuring syntax extracts `prelude` directly from the resolved object, exactly as component arguments extract individual properties from props (Lesson 08).

### VS | `prerender` vs. `prerenderToNodeStream`: the exact same job, two kinds of stream

React provides two static prerendering functions in its static package. Both functions accept identical component trees and return identical Promise payloads. Their single difference lies in the stream implementation assigned to `prelude`:

```jsx title="The two prerender APIs, one for each kind of stream"
import { ~prerender~ } from 'react-dom/static'; // prelude is a Web Stream: browsers, Deno, and some edge runtimes
import { ~prerenderToNodeStream~ } from 'react-dom/static'; // prelude is a Node.js Stream: Node.js
```

Both functions carry out the exact same prerendering operation. Only the stream format differs:
- **`prerender`** produces a standard Web Streams readable stream.
- **`prerenderToNodeStream`** produces a native Node.js stream.

This design parallels the streaming pair from Lesson 118, where `renderToReadableStream` serves Web Stream runtimes and `renderToPipeableStream` serves Node.js. Because our build script runs inside a Node.js process, it imports `prerenderToNodeStream`. Although modern Node.js versions support Web Streams, React documentation explicitly warns against using them in Node build scripts due to slower performance.

### What the Saved File Holds

After compilation completes, the saved file holds the document that `About` returned. Here is the generated markup structure:

```html title="dist/about.html"
~<!DOCTYPE html>~ <!-- Added by React: About.jsx never writes it -->
<html>
  <head>
    <title>About our shop</title>
  </head>
  <body>
    <h1>About our shop</h1>
  </body>
</html>
```

The saved document contains the complete HTML structure returned by the `About` component. Notice that React automatically prepends the standard doctype declaration. React documentation confirms that the static renderer injects this doctype whenever the rendered component includes the root html element.

The file contains no script tags. When you omit client script options, React avoids injecting client bootstrap bundles. Because the About page contains static presentation without event handlers, omitting client scripts eliminates all client-side JavaScript execution. The browser displays raw HTML with zero runtime hydration overhead.

When Anna visits the URL, her browser renders the pre-built document instantly:

```page width=text caption="What Anna sees when the static host sends her dist/about.html."
heading: About our shop
```

### Real Beginner Mistake: the About Page Left in the Request Handler

Consider a common architectural pitfall in server rendering:
1. A team adopts server rendering and routes all incoming URLs through a single request handler, including static informational routes.
2. Every visitor requesting the About page forces the Node server to re-render the component tree, producing identical HTML strings repeatedly.
3. Because the page renders successfully on screen, the team fails to notice the unnecessary CPU and memory consumption.

The correct architectural solution moves static routes out of dynamic request handlers and into the build script. The underlying component code remains unchanged, but the generated HTML can now deploy to high-speed static storage or edge CDNs without server overhead.

Always remember: static prerendering is server rendering executed once during compilation, rather than on every incoming visitor request.

---

## PRINCIPLE | `prerenderToNodeStream`: the build waits for the data, so the stores are in the file

> [!PRINCIPLE]
> **Principle 2: Waiting for Data: `prerender` Resolves Only After Every Suspense Boundary Has Its Content**
>
> *`prerender` and `prerenderToNodeStream` finish only after every `<Suspense>` boundary has its content, so data read with `use` is inside the file; `renderToString` does not wait and saves the fallback.*
>
> A static page can hold data. The build calls `getStores`, `Stores` suspends while the Promise waits, and `prerenderToNodeStream` keeps waiting until Paris and Berlin arrive. Only then does `prelude` hold the full list. `renderToString` returns at once with the fallback, and on a page with no script, that loading line stays on every visitor's screen. Data fetched in an Effect does not suspend, so `prerender` never waits for it.
>
> **DO THIS:**
> ```jsx
> const { prelude } = await ~prerenderToNodeStream(<About storesPromise={getStores()} />)~; // Waits until the stores are in the HTML
> prelude.pipe(createWriteStream('dist/about.html'));
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const html = ~renderToString(<About storesPromise={getStores()} />)~; // **WRONG:** returns at once, so the saved file says Loading stores... for good
> ```

A static document is stored as a file on disk. Many developers assume that static generation cannot incorporate database records. That assumption is incorrect. A static file can include external data, provided the build process pauses until that asynchronous data resolves.

Consider our mock database helper, which simulates a network request by resolving store locations after two seconds:

```js title="db.js"
export function ~getStores~() { // Answers with Paris and Berlin after 2 seconds
  return new Promise(resolve => {
    setTimeout(() => resolve(['Paris', 'Berlin']), 2000);
  });
}
```

The build script initiates the database query and passes the pending Promise to `About`. The page forwards that Promise to a nested `Stores` component, which unwraps the value using the `use` hook:

```jsx title="Stores.jsx"
import { use } from 'react';

export default function Stores({ storesPromise }) {
  const stores = ~use(storesPromise)~; // Suspends until db.js answers
  return (
    <ul>
      {stores.map(store => <li key={store}>{store}</li>)}
    </ul>
  );
}
```

The parent component wraps the store list inside `<Suspense>`, providing a fallback paragraph during data loading:

```jsx title="About.jsx" startLine="10"
<body>
  <h1>About our shop</h1>
  <Suspense ~fallback={<p>Loading stores...</p>}~> {/* Shown while Stores waits for its data */}
    <Stores storesPromise={storesPromise} />
  </Suspense>
</body>
```

Now compare the output when building the same page with two different server rendering functions:

::: row caption="The same About page built with renderToString and with prerenderToNodeStream: only the second waits for the stores."
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
The file holds `Loading stores...` and no store.
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

Both build scripts evaluate the `About` component on the server, and both output a file to disk. Yet their contents are completely different. The synchronous `renderToString` call saves fallback loading text. In contrast, `prerenderToNodeStream` pauses until the database responds and saves the resolved store names. Official React documentation emphasizes this distinction: unlike `renderToString`, the static prerender functions wait for all data to load before resolving.

### Why One File Says `Loading stores...` and the Other Lists the Stores

Here is the precise sequence of events during each build:
1. The developer executes the build script. The data function initiates its two-second timer and returns a pending Promise.
2. React begins rendering the component tree. The child component reads the pending Promise with `use` and suspends.
3. When using `renderToString`, React cannot await asynchronous operations. It immediately renders the fallback placeholder and emits the markup string. The saved file contains only the loading message.
4. Because the static page includes no client scripts, the browser never runs JavaScript to update the DOM. Visitors remain stuck viewing the fallback text permanently.
5. When using `prerenderToNodeStream`, React pauses resolution. After two seconds, the Promise resolves, and React renders the child component with the completed location list.
6. Only after all Suspense boundaries complete does the prerender Promise resolve. The resulting stream outputs the complete list of stores into the final static file.

```tree dir=right caption="What each build does when Stores suspends: renderToString writes the fallback at once; prerenderToNodeStream waits for the stores."
The build reaches `Stores`, which is still waiting for its data
- !With `renderToString` | **Does not wait**: writes the **fallback** and returns | The file shows **`Loading stores...`** to every visitor
- +With `prerenderToNodeStream` | **Waits** until every `<Suspense>` boundary has its content | The file shows **Paris and Berlin** to every visitor
```

When a static file compiles incorrectly, that defect affects every subsequent visitor rather than an isolated user. React documentation explains why `renderToString` cannot support this workflow: it returns a string immediately and cannot wait for data loading during static generation.

### VS | `use` vs. an Effect: only `use` makes the build wait

Static prerendering pauses only for data sources that activate a Suspense boundary. React documentation states that only data read from a suspending source, such as a Promise unwrapped with the `use` hook, pauses rendering. Suspense cannot detect data requested inside an Effect or event handler:

```jsx title="Reading the stores with use, and fetching them in an Effect"
const stores = ~use(storesPromise)~; // Stores suspends: prerender waits, and the stores are in the file
useEffect(() => { ~getStores().then(setStores)~; }, []); // **WRONG:** Suspense never sees this, so prerender does not wait for it
```

Both patterns appear to perform identical tasks by requesting store data. Yet their execution environments differ entirely. The `use` hook pauses component rendering, triggering the Suspense boundary and signaling `prerenderToNodeStream` to await resolution. In contrast, `useEffect` hooks run exclusively in the browser after initial paint. They never execute during server rendering or build-time compilation. When using an Effect, the static renderer compiles only the initial empty state, leaving static page visitors with an empty list.

This architectural bug frequently occurs when teams migrate existing client-side components to static prerendering without replacing legacy Effects with suspending data patterns.

### `prerenderToNodeStream` vs. `onAllReady`: the same wait, made for different jobs

The behavior of `prerenderToNodeStream` closely resembles calling the Node streaming renderer with the `onAllReady` option (Lesson 118). Both mechanisms wait until every `<Suspense>` boundary finishes rendering before considering the markup complete.

Their difference lies in their deployment targets. The static prerenderer is designed specifically for build-time compilation, returning `prelude` and `postponed` for file generation. Dynamic streaming APIs are designed to answer incoming network requests with live HTTP chunking. React documentation notes that `prerender` is designed for ahead-of-time static generation and cannot stream incremental chunks across a live connection as data loads.

Remember: a static page can display dynamic database records, provided the build script pauses until the data resolves.

---

## PRINCIPLE | A prerendered file: every visitor gets the same HTML until the next build

> [!PRINCIPLE]
> **Principle 3: The Right Choice: Prerender Only Pages That Are the Same for Every Visitor**
>
> *Static prerendering fits a page that is the same for every visitor and whose data is known when the site is built; a page that depends on who opens it, or on data that changes all the time, is rendered at each request.*
>
> `build.js` runs once and has no visitor, so a static file holds one answer for everyone, made at one moment. That is exactly right for the About page, which can then come from a CDN with no server running React. It is wrong for the account page, which must greet each visitor by name, and for a content feed, whose file would show old data until the next build.
>
> **DO THIS:**
> ```jsx
> const { prelude } = await ~prerenderToNodeStream(<About storesPromise={getStores()} />)~; // The same About page for every visitor
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const { prelude } = await ~prerenderToNodeStream(<Account />)~; // **WRONG:** build.js has no visitor, so nobody is greeted by name
> ```

Because static files deploy cheaply and transmit quickly across CDNs, developers often ask why every page is not prerendered. The limitation is inherent to static files: a compiled file represents a single immutable response shared by all visitors.

Consider our online shop account page. Unlike the About page, the account page greets each customer personally by name, displaying `Hi, Anna` or `Hi, Ben`:

::: row caption="The About page is the same for every visitor; the account page is different for each one."
::: col title="The About page" tag="one answer for everyone" tone=good
```page size=mini
heading: About our shop
line: Paris
line: Berlin
```
Anna and Ben see the same page.
:::
::: col title="The account page" tag="one answer per visitor" tone=good
```page size=mini
heading: Hi, Anna
```
```page size=mini
heading: Hi, Ben
```
Anna and Ben each see their own name.
:::
:::

Now examine where each page executes in the server architecture:

```jsx title="build.js has no visitor; the request handler has one"
const { prelude } = await ~prerenderToNodeStream(<About storesPromise={getStores()} />)~; // build.js: runs once, with no visitor

app.use('/account', (~request~, response) => { // Runs at each visit, with the visitor's request in hand
  response.send(renderToString(<Account />));
});
```

A build script executes in isolation without incoming visitor traffic. The `prerenderToNodeStream` function accepts only the component tree and options. It receives no HTTP request object, cookie headers, or session identifiers, making it impossible to determine user identity. In contrast, an HTTP request handler receives a distinct `request` object on every visit, allowing the server to inspect authentication headers and render customized markup.

Both pages render components on a server, but their delivery models differ fundamentally. The About page delivers a single universal answer generated ahead of time. The account page generates a unique answer tailored to the active user at request time.

### Real Beginner Mistake: the Account Page in `build.js`

Seeing the performance benefits of static delivery, a team might attempt to prerender the account page alongside the About page:
1. The team adds the `Account` component to the build script.
2. The build runs in an automated pipeline where no active user session exists.
3. React renders whatever fallback or guest state the component defaults to, baking that markup into the static file.
4. When Anna and Ben log in, the static server delivers that identical pre-built file to both users. Neither visitor sees personalized account details.

Because React emits no build errors, the application fails silently in production. The team must move personalized routes back into dynamic request handlers, reserving static prerendering exclusively for universal public pages.

### A New Store Opens in Rome

A static document is immutable across visitors, and it is also immutable over time. It reflects the exact data state present when the build script executed.

Suppose the company adds a new store location in Rome, updating the database records to three entries:

```js title="db.js" startLine="3"
setTimeout(() => resolve(~['Paris', 'Berlin', 'Rome']~), 2000); // The database now has three stores
```

Anna opens the About page the next morning, but the new location does not appear:

```page width=text caption="The About page after Rome was added to db.js, before a new build."
heading: About our shop
line: Paris
line: Berlin
```

When Anna visits the website the following morning, she still sees only Paris and Berlin. Because the pre-rendered file was written before the Rome location existed, the saved HTML remains unchanged. The new city appears only after a developer or deployment pipeline executes a fresh build:

```page width=text caption="The About page after the developer runs the build again."
heading: About our shop
line: Paris
line: Berlin
line: Rome | good
```

For an About page, this build-time snapshot works reliably. Company locations change rarely, and the team triggers a deployment whenever store details update. In contrast, a high-frequency content feed changes continuously. React documentation categorizes active feeds under server-side rendering, where fresh data must be retrieved per request. Balancing these rendering strategies is explored in Lesson 129.

### When Static Prerendering Is the Right Choice

Static prerendering represents the optimal choice when two requirements are met:
1. **Content is universal:** the markup remains identical for every visitor without user personalization.
2. **Data changes predictably:** the underlying information remains accurate between scheduled build deployments.

Public landing pages, marketing brochures, and documentation sites satisfy both requirements. Personalized account dashboards fail the first requirement. Real-time stock tickers and social feeds fail the second requirement. Pages meeting both criteria can deploy directly to CDNs or object storage buckets without managing runtime Node servers.

Modern web applications frequently combine both rendering models across different routes. Frameworks handle this hybrid architecture naturally. React documentation notes that modern frameworks allow teams to apply server rendering selectively on a per-route basis, frequently invoking static prerendering APIs under the hood.

```tree caption="Which pages of the shop go into build.js and which are rendered at each request."
Is static prerendering the right choice for this page?
- +The same for every visitor, data known at build time [About page, landing page, help page] | +**DO** prerender it in `build.js` | Every visitor gets **the saved file**, from a CDN or a static host
- !Different for each visitor [account page] | ~Do **NOT** prerender it | `build.js` has **no visitor**, so nobody is greeted by name
- !Data that changes all the time [content feed] | ~Do **NOT** prerender it | The file shows **what was true at the last build**
```

Remember: a prerendered document provides one immutable answer to every visitor until the next build deployment.

---

## All 3 Principles Together

### The Complete About Page

Here are the four files that implement our prerendered About page. First, the mock database helper returns location records after an asynchronous delay:

```js title="db.js"
export function ~getStores~() { // Answers with the two stores after 2 seconds
  return new Promise(resolve => {
    setTimeout(() => resolve(['Paris', 'Berlin']), 2000);
  });
}
```

Next, `Stores` reads the pending Promise with `use`, suspending execution until the location records resolve:

```jsx title="Stores.jsx"
import { use } from 'react';

export default function Stores({ storesPromise }) {
  const stores = ~use(storesPromise)~; // Principle 2: suspends until db.js answers, so the build waits
  return (
    <ul>
      {stores.map(store => <li key={store}>{store}</li>)}
    </ul>
  );
}
```

The `About` component constructs the complete HTML document, wrapping the store list inside `<Suspense>`:

```jsx title="About.jsx"
import { Suspense } from 'react';
import Stores from './Stores.jsx';

export default function About({ storesPromise }) {
  return (
    ~<html>~ {/* Principle 1: the whole document, and React adds the doctype above it */}
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

Finally, `build.js` executes once during compilation to evaluate the component tree and write the completed HTML file:

```jsx title="build.js"
import { prerenderToNodeStream } from 'react-dom/static';
import { createWriteStream } from 'node:fs';
import About from './About.jsx';
import { getStores } from './db.js';

const { prelude } = await ~prerenderToNodeStream(~ // Principles 1 and 2: resolves only after the stores are in
  <About storesPromise={getStores()} />
);
prelude.pipe(~createWriteStream('dist/about.html')~); // Principle 3: the one file every visitor gets
```

This static file deploys directly to a CDN or static web host, serving every visitor without executing server-side React or client JavaScript:

```page width=text caption="The finished About page: the same saved file for every visitor."
heading: About our shop
line: Paris
line: Berlin
```

### How React Renders the About Page During the Build

When the developer executes the build command, React begins rendering the `About` component from the top of the tree. It renders the heading, encounters the suspending `Stores` component, and pauses until the database Promise resolves. Once the data arrives, the Promise resolves, and the script writes completed markup to disk:

```tree dir=right caption="The order of events when build.js prerenders the About page, from the build to the saved file."
How `build.js` makes `dist/about.html`
- +1. `build.js` calls `prerenderToNodeStream` | `getStores` **starts its 2-second wait** | No visitor, no `request`
- +2. React renders `About` | The **heading** is ready | `Stores` **suspends** on `use`
- +3. React waits | After **2 seconds** the stores arrive | React renders `Stores` with **Paris and Berlin**
- +4. The Promise resolves [`prelude` and `postponed`] | `postponed` is **`null`** | `prelude` is **piped into `dist/about.html`**
```

### Summary

| Aspect | The Habit That Breaks | The React Rule |
| :--- | :--- | :--- |
| **When React runs** | Render the About page in the request handler, again for every visitor | Render it once in `build.js` with `prerenderToNodeStream`, and send the saved file |
| **What comes back** | Expect a string, as from `renderToString` | Expect a Promise of `{ prelude, postponed }`: `prelude` is a stream of HTML, and `postponed` is `null` when the page is complete |
| **Which API** | Use the Web Stream method in Node.js | Use `prerenderToNodeStream` in Node.js, and `prerender` with Web Streams |
| **Data** | Build with `renderToString`, or fetch in an Effect, and save `Loading stores...` | Read data with `use` inside `<Suspense>`, so `prerender` waits and the data is in the file |
| **Which pages** | Prerender every page because static files are fast | Prerender only pages that are the same for every visitor until the next build |

Remember the one sentence of this lesson. **Static prerendering is server rendering done once, during the build, instead of once for every visitor.**

---

## For the Interview

> **The Interview Question:** What is static prerendering, and when is it the right choice?

### How to Answer Clearly in 30 Seconds

"Static prerendering means React renders a page to HTML once during the project build and saves it as a static file that every visitor shares. React documentation also refers to this architecture as static site generation, or SSG. It runs the exact same component logic as server rendering; the fundamental difference is when React executes. In React 19, we call `prerender` for Web Streams or `prerenderToNodeStream` for Node.js, both exported from `react-dom/static`. Three key architectural facts define this pattern:
1. **Return payload:** they return a Promise resolving to `{ prelude, postponed }`. The `prelude` property is an HTML stream that can be piped into a file or buffered as a string. The `postponed` property is null when the markup is fully rendered.
2. **Suspense coordination:** unlike `renderToString`, the prerender functions pause until all Suspense boundaries settle, ensuring that data unwrapped with `use` is baked into the output file.
3. **Architectural fit:** static prerendering fits universal pages whose data is known at build time, such as landing pages or company profiles. The resulting markup deploys directly to CDNs without maintaining a live Node server. Pages requiring personalized data or frequent updates should be rendered on each incoming request."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does `prerender` return `prelude` as a stream rather than a string?"**
   A readable stream provides architectural flexibility. Build scripts can pipe it directly into local file streams or cloud storage sinks without buffering massive HTML strings in memory. Servers can also stream chunks or convert the stream into a string using reader utilities. Importantly, `prerender` does not emit partial chunks during rendering: it waits for all Suspense boundaries to settle before resolving the stream.
2. **"What happens if asynchronous data loading hangs or exceeds reasonable build times?"**
   Pass an `AbortSignal` configured with an `AbortController` timeout, where official documentation suggests 10000 milliseconds. If aborted, React halts pending boundaries: incomplete boundaries render their fallback UI into `prelude`, while `postponed` returns an object tracking the unfinished boundaries. A server can subsequently resume and stream the missing content dynamically at request time (Lesson 120).
3. **"Can a prerendered static page support client-side interactivity, and can it include Content Security Policy nonces?"**
   A prerendered page supports client interactivity if you pass `bootstrapScripts` in the prerender options. The browser loads the script, invokes `hydrateRoot`, and attaches event listeners (Lesson 104). Without client scripts, the markup remains completely inert. However, prerendered pages cannot safely embed cryptographic CSP nonces. Nonces must be unique, cryptographically random values generated per HTTP request. Because static prerendering creates an identical file shared across all visitors, embedding a build-time nonce violates Content Security Policy requirements.

```tree dir=right caption="Interview comparison: rendering at each request vs. static prerendering during the build."
`renderToString` in the request handler vs. `prerenderToNodeStream` in the build
- +At each request [`renderToString`] | React runs **once per visitor**, with the `request` in hand | Fits pages that **differ per visitor** or **change all the time**
- +Once, during the build [`prerender` `prerenderToNodeStream`] | React runs **once in total**, waits for every Suspense boundary | Fits pages that are **the same for every visitor**, served from a **CDN or a static host**
```
