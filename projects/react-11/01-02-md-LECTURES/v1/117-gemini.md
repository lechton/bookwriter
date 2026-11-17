# Lecture 117: How Suspense Lets the Server Send a Page in Parts

*(How can the server show the top of a page before its slow part is ready?)*

> INTERVIEW QUESTION | ❱ CORE | How does streaming SSR work with Suspense: the shell, fallbacks, and out-of-order flushes?

---

## VS | The Whole Page at Once vs. the Page in Parts: `<Suspense>` lets the server send the fast part first

> Standard server rendering produces the full page in a single transmission, so one slow query keeps the browser tab blank. **Wrap the slow component in `<Suspense>`, and the server streams the fast layout immediately while delivering deferred content later in the same HTTP response**. The user reads the product details right away, and the browser never initiates a secondary network request.

Consider how an HTTP server handles a response in Node. You do not need to buffer the entire HTML string in memory before sending it. You can call `response.write` multiple times to send sequential chunks, closing the stream with `response.end` only after the final chunk departs:

```js title="Plain Node: one response, sent in two parts"
response.write('<h1>Blue Sneakers</h1><p>$49</p>'); // Sent at once
setTimeout(() => {
  ~response.write('<ul><li>Great fit</li><li>Runs small</li></ul>')~; // Sent 2 seconds later, in the same response
  response.end(); // Now the response is over
}, 2000);
```

The browser does not wait for the response to finish before rendering. It parses the incoming stream immediately, painting the heading and price without delay, and then appends the reviews two seconds later. Transmitting an ongoing response in sequential chunks across a single connection is called **streaming**.

In React, you do not write raw streaming chunks by hand. React constructs the HTML stream directly from your JSX tree. You only need a declarative boundary that marks asynchronous sections that can arrive later. That is the exact role of `<Suspense>`:

```jsx title="The one tag that lets the reviews come later"
<h1>Blue Sneakers</h1>
<p>$49</p>
<Suspense ~fallback={<p>Loading reviews...</p>}~> {/* Sent at once, in the place of the reviews */}
  <Reviews />
</Suspense>
```

Here is how the server handles this boundary:
1. **Immediately**, it streams the outer markup, placing the fallback markup `Loading reviews...` directly where the reviews belong.
2. **Later**, once the reviews data resolves, the server appends the rendered reviews to the open stream alongside a tiny script that swaps them into place.

Official React documentation refers to this technique as streaming server rendering, or streaming SSR (Lesson 103).

Here is the core rule to remember throughout this lesson:

**The server sends everything outside `<Suspense>` at once, and each `<Suspense>` part later, when its own data is ready, in the same response.**

### What the User Sees in the First 2 Seconds

Imagine opening an online store page for a product. The page displays the title `Blue Sneakers` and the price tag `$49`. Below that information sit two customer reviews, `Great fit` and `Runs small`.

The product details reside in a fast primary record that the server retrieves instantly. The reviews require a separate query to a slower review database that takes two seconds to respond. During those two seconds, the user experiences one of two distinct loading states:

::: row caption="What the user sees during the first 2 seconds: a blank tab, or the product with a loading line where the reviews go."
::: col title="The page waits for the reviews" tag="blank for 2 seconds" tone=bad
```page size=mini
blank
```
:::
::: col title="The page sends the product first" tag="product at once" tone=good
```page size=mini
heading: Blue Sneakers
line: $49
line: Loading reviews...
```
:::
:::

After 2 seconds, both pages show the very same four lines:

```page width=text caption="What both pages show after 2 seconds: the heading, the price, and the two reviews."
heading: Blue Sneakers
line: $49
line: Great fit
line: Runs small
```

**The final visual output appears identical, but the user experience differs completely.** Under traditional rendering, the visitor stares at an unresponsive white screen for two full seconds. With streaming SSR, the visitor reads the product specifications and price immediately.

Furthermore, the client browser never issued an extra network fetch. The review markup arrived as part of the original HTML document stream.

### The Same `<Suspense>` You Know From the Browser

> [!DEFINITION]
> **`<Suspense>`.** [REVIEW] `<Suspense fallback={...}>` coordinates asynchronous rendering for a subtree. When a child component suspends while awaiting data, React pauses rendering that child and displays the fallback placeholder instead. Once the pending Promise settles, React completes rendering the inner components and swaps them in place of the fallback. All components grouped within a single boundary resolve and reveal together as one coordinated unit (Lesson 69).

Does server streaming introduce a separate component API? No. **It uses the exact same `<Suspense>` component and the same `fallback` prop.** Only the delivery mechanism differs across environments:
- **In client rendering**, React toggles DOM elements in browser memory, mounting the fallback while waiting and replacing it when data arrives.
- **In server rendering**, React emits the fallback HTML in the initial network stream, transmitting resolved content as additional HTML later in that same response.

```tree caption="The same Suspense tag in the browser and on the server: the fallback first, the content later."
One `<Suspense>` tag, two places it runs
- +In the browser [`<Suspense fallback>`] | React **shows the fallback** while the component suspends | Then React **shows the content** in its place
- +On the server [`<Suspense fallback>`] | The server **sends the fallback as HTML at once** | Then the server **sends the content as HTML later**, in the **same response**
```

### Two More Ideas From Earlier Lessons

> [!DEFINITION]
> **Reading a promise with `use`.** [REVIEW] A Promise represents an asynchronous operation whose resolved value arrives later. The `use(promise)` function unwraps that value directly inside component rendering. If the Promise is still pending, `use` suspends the component, instructing React to display the nearest ancestor fallback. When the Promise resolves, React re-renders the component, and `use` returns the unwrapped data (Lesson 71).

> [!DEFINITION]
> **Server rendering and hydration.** [REVIEW] Server rendering executes React components on the server to emit initial HTML markup, allowing users to view content before client script bundles finish downloading (Lesson 102). This early markup cannot yet respond to user interactions. Hydration occurs when client JavaScript executes `hydrateRoot`, attaching event handlers and reactive state to existing DOM elements without rebuilding the DOM structure (Lesson 104).

### What Is at Stake

The architectural choice directly dictates what users experience during initial page loading:
1. **Without a boundary, the server delays the entire response until the slowest database lookup finishes.** The user stares at an empty white tab for two full seconds because of two review comments at the bottom of the layout.
2. **With a boundary, the user inspects the product headline and price immediately while reviews load in the background.** Official React documentation emphasizes that streaming allows users to view content before all server data finishes loading.

### Where Readers Usually Go Wrong

Developers commonly stumble over four architectural misunderstandings:
1. **They assume late content arrives via a second client request**, mistaking streaming for a browser fetch inside an Effect (Lesson 33). In reality, late content travels over the original HTTP response connection.
2. **They assume the client must download and initialize React before reviews can display.** Official React documentation confirms that streaming does not wait for React to load in the browser.
3. **They expect Suspense to stream data fetched inside an Effect.** Component effects never execute during server rendering, so the server never suspends and streaming never triggers.
4. **They wrap the entire application in a single root boundary**, replacing the fast product layout with a single generic loading message.

### Three Ways to Send a Page With One Slow Part

When a specific section of a page relies on slow data, you can choose between three architectural approaches:
1. **Block until all queries settle, then transmit the complete document.** The browser remains blank until the slowest query completes. This approach suits search engine crawlers that require fully rendered HTML upfront, as well as static pages generated at build time (Lessons 118 and 119).
2. **Omit the slow section from server markup and fetch it on the client inside an Effect** (Lesson 33). The server HTML omits the reviews entirely. The user sees the reviews only after the client JavaScript bundle downloads, mounts, and finishes a separate network request.
3. **Stream with Suspense.** Wrap the slow section in `<Suspense>`. The server transmits the fast product shell and fallback immediately, streaming the reviews later across that same connection. This pattern fits dynamic pages with mixed data latencies.

```tree caption="Three ways to send a product page whose reviews take 2 seconds."
Three ways to send a page with one slow part
- !Wait for all the data | The tab stays **blank for 2 seconds** | Fits **crawlers** and pages **built ahead of time**
- !Fetch in the browser [`useEffect` `fetch`] | The reviews are **not in the server's HTML** | They show only **after the JavaScript loads** and the fetch returns
- +Stream with Suspense [`<Suspense fallback>`] | The product and **`Loading reviews...` go out at once** | The reviews follow **in the same response**
```

In frameworks supporting React Server Components, the reviews component can run as an asynchronous component that directly awaits database queries (Lesson 109). The boundary performs the exact same streaming role there. Official documentation confirms that awaiting promises in Server Components integrates directly with Suspense streaming.

## SECTION | A Product Page With Slow Reviews

We build on the product page from earlier lessons (Lessons 102 to 104) and introduce simulated network latency for reviews. Principle 4 introduces an additional deferred section, `You may also like`, positioned beneath the review list.

```files title="product-page: File Explorer" caption="The files of the product page in this lesson."
server.js | server | For each visit, starts the lookups and sends `App` to the browser in parts
src/
  db.js | stand-in for the database | Exports `getReviews` and, from Principle 4, `getSuggestions`
  App.jsx | page | Renders the heading, the price, and one `<Suspense>` boundary for each slow section
  Reviews.jsx | slow section | Reads the reviews with `use` and renders them as a list
  Suggestions.jsx | slow section, from Principle 4 | Reads the suggestions with `use` and renders them as a list
```

One structural detail is critical for server streaming. On the server, the root page component renders the entire HTML document structure, starting from the opening HTML tag down through the body element.

Why is this outer structure significant? If an unresolved boundary wraps the entire application outside document tags, React holds the stream. It cannot verify whether the boundary will emit valid document tags. Every boundary must sit comfortably inside the document body.

The complete source listings in Principles 1 and 2 display the full document wrapper. The shorter illustrative snippets focus specifically on the elements inside the body tag.

**PRINCIPLES:** The server transmits everything outside `<Suspense>` immediately, streaming each deferred section later across the same HTTP connection as data resolves. Five core principles govern this architecture:
1. **An unbuffered component outside Suspense delays the entire page.** Everything outside a boundary belongs to the shell, and the server emits no HTML until the complete shell finishes rendering.
2. **A Suspense fallback enables immediate delivery of the outer shell.** The server streams the product layout and fallback placeholder at once, delivering deferred content only when data suspends.
3. **An inline script swaps deferred content into place before client hydration.** The server streams resolved markup inside a hidden container alongside a script that swaps out the fallback.
4. **Multiple boundaries flush independently in order of data readiness.** A section placed lower in the document that resolves quickly appears before a slower section placed above it.
5. **Wrapping the entire layout in a single boundary degrades the user experience.** Boundaries should isolate slow asynchronous components so the initial shell remains minimal but structurally complete.

---

## PRINCIPLE | `Reviews` with no `<Suspense>` above it: the whole page waits for the slowest data

> [!PRINCIPLE]
> **Principle 1: The Shell: Everything Outside `<Suspense>` Must Render Before the Server Sends Anything**
>
> *Everything outside every `<Suspense>` boundary belongs to the shell, and the server emits no HTML until the complete shell finishes rendering.*
>
> The server does not stream HTML line by line as components execute. It waits until the initial shell finishes rendering and then transmits it as a unified first chunk. An asynchronous component without an enclosing boundary belongs to the shell, forcing instant content like headings and prices to wait. The slowest query in the shell dictates when the client receives the first byte.
>
> **DO THIS:**
> ```jsx
> <h1>Blue Sneakers</h1>
> <p>$49</p>
> <Suspense fallback={<p>Loading reviews...</p>}>
>   ~<Reviews reviewsPromise={reviewsPromise} />~ {/* Outside the shell: the heading and the price go out at once */}
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <h1>Blue Sneakers</h1>
> <p>$49</p>
> ~<Reviews reviewsPromise={reviewsPromise} />~ {/* **WRONG:** part of the shell, so the tab stays blank for 2 seconds! */}
> ```

Here is the product page with its reviews, and no `<Suspense>` anywhere:

```jsx title="src/App.jsx"
import Reviews from './Reviews.jsx';

export default function App({ reviewsPromise }) {
  return (
    <html>
      <body>
        <h1>Blue Sneakers</h1> {/* Ready at once */}
        <p>$49</p> {/* Ready at once */}
        ~<Reviews reviewsPromise={reviewsPromise} />~ {/* Ready after 2 seconds */}
      </body>
    </html>
  );
}
```

**When a user visits this page, the browser tab remains completely blank for two seconds, even though the headline and price are ready immediately.** Once the two seconds elapse, the entire page renders on screen all at once:

::: row caption="With no boundary, the user sees a blank tab for 2 seconds, then the whole page at once."
::: col title="During the first 2 seconds" tag="nothing sent yet" tone=bad
```page size=mini
blank
```
:::
::: col title="After 2 seconds" tag="everything at once"
```page size=mini
heading: Blue Sneakers
line: $49
line: Great fit
line: Runs small
```
:::
:::

Beginners often assume that because the heading element appears first in the component JSX, the server streams it to the client first. That assumption is incorrect.

Recall the plain Node demonstration earlier. It streamed the heading first because the code explicitly partitioned output with separate write calls. React only partitions page output where you declare a Suspense boundary. Without a boundary, the entire component tree forms a single indivisible block, which React terms the shell.

### The Shell: Everything Outside Every Boundary

> [!DEFINITION]
> **The shell.** [NEW] The shell comprises all markup and components situated outside any `<Suspense>` boundary. Like the structural framing of a building, the shell represents the base layout that must render before content displays. React documentation notes that the shell determines the earliest loading state the user can observe. The server holds all network output until every component inside the shell finishes rendering (Lesson 117).

On our unbuffered page, no boundary exists, meaning the entire document forms the shell. Because the reviews component belongs to the shell, the server cannot emit the first byte of HTML until the reviews query resolves.

```tree caption="With no Suspense boundary, the whole page is the shell, so the heading waits for the reviews."
The shell of our page with no boundary
- +`<h1>Blue Sneakers</h1>` | Ready **at once**
- +`<p>$49</p>` | Ready **at once**
- !`<Reviews />` | Ready **after 2 seconds** | The whole shell, and every byte of the page, **waits for it**
```

### Where the 2 Seconds Come From

The database file simulates an external database service (Lesson 109). Its `getReviews` function returns a Promise that resolves with customer review strings after a two-second timer:

```js title="src/db.js"
export function ~getReviews~() { // Answers with the two reviews after 2 seconds
  return new Promise(resolve => {
    setTimeout(() => resolve(['Great fit', 'Runs small']), 2000);
  });
}
```

The reviews component receives this Promise as a prop and unwraps it using `use` (Lesson 71). While the Promise remains unsettled, the component suspends:

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

The server entry module modifies the traditional route handler from Lesson 102 in two important ways:
1. **It initiates the reviews lookup on every request**, forwarding the pending Promise to the page component as a prop.
2. **It invokes `renderToPipeableStream` instead of `renderToString`.** While `renderToString` buffers a single monolithic string, `renderToPipeableStream` exposes a stream that emits HTML in incremental chunks. Lesson 118 explores this function in depth.

```jsx title="server.js"
import { renderToPipeableStream } from 'react-dom/server';
import App from './src/App.jsx';
import { getReviews } from './src/db.js';

app.use('/', (request, response) => {
  const reviewsPromise = ~getReviews()~; // Starts the 2-second lookup for this visit
  const { pipe } = renderToPipeableStream(<App reviewsPromise={reviewsPromise} />, {
    ~onShellReady~() { // Nothing reaches the browser before React calls this
      pipe(response); // Starts sending the HTML to the browser
    },
  });
});
```

Two specific identifiers warrant careful attention:
- **`onShellReady`** represents a lifecycle callback provided to React in the options argument. React documentation specifies that this callback fires right after rendering the initial shell. The server must not flush any bytes to the client prior to this notification.
- **`pipe`** is the streaming method returned by `renderToPipeableStream`. Passing the Node HTTP response into `pipe` connects React's output stream to the network socket, flushing chunks as React emits them.

Production servers also inject a script tag referencing the client JavaScript bundle. We omit that bundle script here to focus purely on HTML streaming mechanics (Lesson 118).

### Why the Tab Stays Blank

**The heading and price render instantaneously, but they remain trapped inside an incomplete shell.** Here is the runtime sequence:
1. The client requests the page, invoking the route handler in the server file.
2. The server calls `getReviews`, starting the asynchronous query that resolves after two seconds.
3. React begins rendering the component tree, producing the heading and price markup immediately.
4. React attempts to render the reviews component, which reads the pending Promise with `use` and suspends.
5. Because no Suspense boundary wraps the reviews component, it belongs directly to the shell, leaving the shell blocked.
6. React delays invoking `onShellReady`, preventing the server from flushing any data. The browser tab remains blank.
7. Two seconds later, the Promise resolves and the shell finishes rendering. React triggers `onShellReady`, and the complete page flushes in one piece.

### Real Beginner Mistake: Reviews Added With No Boundary

1. An engineering team renders reviews on the server to ensure review text appears in initial HTML markup for indexing.
2. During high-traffic periods, database query response times spike to two seconds.
3. The developers omit a Suspense boundary because the rendered document appears complete once loading finishes.
4. Every visitor experiences a two-second blank screen. Official documentation refers to this initial network delay as **Time to First Byte**, which increases by two seconds across all page views.

Remember: the server only transmits unbuffered markup after the shell completes. Without boundaries, all markup waits for the slowest query.

---

## PRINCIPLE | `<Suspense fallback>`: the product and `Loading reviews...` go out at once

> [!PRINCIPLE]
> **Principle 2: Streaming: `<Suspense>` Sends the Product With `Loading reviews...` First**
>
> *Wrap the slow component in `<Suspense>`: the server streams the shell immediately with the fallback in place, delivering deferred content later across the same response.*
>
> A Suspense boundary extracts the asynchronous component from the initial shell. Because no pending components block the shell, the server flushes the title, price, and fallback placeholder right away. When the query resolves, deferred HTML follows down the same open stream. Streaming requires data fetching that actually suspends: unwrapping a Promise with `use` triggers suspension, whereas fetching inside an Effect does not.
>
> **DO THIS:**
> ```jsx
> function Reviews({ reviewsPromise }) {
>   const reviews = ~use(reviewsPromise)~; // Suspends on the server, so the boundary streams the reviews
>   return <ul>{reviews.map(review => <li key={review}>{review}</li>)}</ul>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Reviews() {
>   const [reviews, setReviews] = useState([]);
>   ~useEffect~(() => { fetch('/api/reviews').then(res => res.json()).then(setReviews); }, []); // **WRONG:** never runs on the server, so the server sends an empty list
>   return <ul>{reviews.map(review => <li key={review}>{review}</li>)}</ul>;
> }
> ```

We introduce a single structural modification in the page file by wrapping the reviews component in `<Suspense>`.

```jsx title="src/App.jsx"
import { Suspense } from 'react';
import Reviews from './Reviews.jsx';

export default function App({ reviewsPromise }) {
  return (
    <html>
      <body>
        <h1>Blue Sneakers</h1>
        <p>$49</p>
        ~<Suspense fallback={<p>Loading reviews...</p>}>~ {/* Takes Reviews out of the shell */}
          <Reviews reviewsPromise={reviewsPromise} />
        </Suspense>
      </body>
    </html>
  );
}
```

No other files require changes. The database helper, reviews component, and server entry file remain identical.

Here is the concrete comparison between both approaches, accompanied by source syntax:

::: row caption="Without a boundary, the tab stays blank for 2 seconds; with a boundary, the product and the loading line arrive at once."
::: col title="Without <Suspense>" tag="first 2 seconds" tone=bad
```page size=mini
blank
```
```jsx
<h1>Blue Sneakers</h1>
<p>$49</p>
~<Reviews />~ {/* In the shell: the shell waits for it */}
```
:::
::: col title="With <Suspense fallback>" tag="first 2 seconds" tone=good
```page size=mini
heading: Blue Sneakers
line: $49
line: Loading reviews...
```
```jsx
<h1>Blue Sneakers</h1>
<p>$49</p>
~<Suspense fallback={<p>Loading reviews...</p>}>~ {/* Out of the shell */}
  <Reviews />
</Suspense>
```
:::
:::

Without the boundary, the reviews component remains inside the shell, forcing the entire page to pause. With the boundary in place, the reviews component moves outside the shell, allowing the shell and fallback to stream immediately. After two seconds, both strategies arrive at the exact same four lines of content.

### What the Server Sends, and When

**With the boundary declared, the server delivers the page across two sequential flushes of a single response: the shell immediately, and the reviews two seconds later.** Here is the step-by-step lifecycle:
1. The client requests the page. The server initiates `getReviews` and begins streaming rendering.
2. The reviews component suspends. React catches the suspension at our new `<Suspense>` boundary and substitutes its fallback markup.
3. Because no pending work remains outside the boundary, the shell completes without delay. React fires `onShellReady`, and the server flushes the shell.
4. The browser renders the heading, price, and fallback placeholder. The browser tab indicates active loading because the HTTP stream remains open.
5. Two seconds later, the reviews Promise resolves. React renders the reviews component into HTML and transmits the markup through the existing stream.
6. The two review items replace the fallback placeholder in the DOM, without the browser initiating a new request.

Why does the server keep the connection open after transmitting the shell? Because components enclosed within Suspense boundaries may still be awaiting asynchronous data. React documentation explains that when `onShellReady` fires, components within nested boundaries might still be loading data. The server maintains the open stream until the final boundary resolves and flushes.

On the server, the **fallback** is not a placeholder abstraction; it is concrete HTML markup included in the initial shell. React documentation confirms that React transmits the HTML for the loading fallback first.

How does the browser replace the fallback with late-arriving reviews without making a fresh network request? Principle 3 reveals the replacement mechanism.

### Real Beginner Mistake: An Effect Fetch Inside the Boundary

A developer familiar with client-side data patterns (Lesson 33) might attempt to load reviews using `fetch` inside an Effect, wrapping the component in `<Suspense>`:

```jsx title="src/Reviews.jsx, loading the reviews in an Effect"
import { useState, useEffect } from 'react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  ~useEffect~(() => { // **WRONG:** never runs on the server, so nothing suspends
    fetch('/api/reviews').then(res => res.json()).then(setReviews);
  }, []);
  return <ul>{reviews.map(review => <li key={review}>{review}</li>)}</ul>;
}
```

**In this scenario, the Suspense boundary does nothing: the user sees no reviews and no loading fallback.** Here is why this pattern fails:
1. Effects never execute during server rendering. Official React documentation emphasizes that Effects execute exclusively on the client.
2. Because the Effect never runs on the server, the reviews component never suspends. The server renders the initial empty array state, omitting both the fallback and the reviews. Official documentation notes that Suspense cannot detect data fetched inside an Effect or event listener.
3. The server finishes rendering immediately and closes the response stream. No deferred chunks ever stream.
4. Reviews only display after the client JavaScript bundle downloads, mounts, executes the Effect, and resolves a secondary network request.

Remember: server streaming requires components that actually suspend during server rendering, such as a Promise unwrapped with `use`.

---

## PRINCIPLE | The inline `<script>`: the reviews take the place of the fallback before React loads

> [!PRINCIPLE]
> **Principle 3: The Inline Script: React's Script Puts the Reviews in Place of `Loading reviews...`**
>
> *Deferred HTML from a boundary travels after the initial shell alongside an inline `<script>` that substitutes the resolved markup for the fallback, operating before client React loads.*
>
> An HTTP stream cannot mutate previously transmitted HTML. Instead, the server appends resolved reviews into the stream inside a hidden container, followed by an inline script generated by React that swaps the markup into the fallback location. Users can read the reviews immediately upon arrival. Interactive elements like buttons only respond later, once client JavaScript hydrates the markup.
>
> **DO THIS:**
> ```jsx
> <Suspense fallback={<p>Loading reviews...</p>}>
>   ~<Reviews reviewsPromise={reviewsPromise} />~ {/* The user reads the reviews before the app's JavaScript loads */}
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <li>
>   {review} ~<button onClick={markHelpful}>Helpful</button>~ {/* **WRONG:** counting on the first tap: it does nothing until the page hydrates */}
> </li>
> ```

### The Server Cannot Change HTML It Already Sent

In the introductory plain Node example, the reviews were placed at the very bottom of the document, matching the order of arrival. The browser simply appended new elements as bytes streamed in.

A nested Suspense boundary behaves differently. By the time reviews data resolves, the fallback placeholder is already displayed in the middle of the page layout. An ongoing HTTP connection cannot reach back and rewrite bytes previously parsed by the browser. The server can only append new bytes to the end of the incoming stream.

To solve this limitation, React employs an ingenious mechanism. The server streams resolved markup at the tail of the response inside a hidden container. Right after it, an inline script swaps the elements into the fallback position. Here is a conceptual illustration using readable placeholder identifiers:

```html title="What the one response holds, simplified, with our own names for the markers"
<h1>Blue Sneakers</h1>
<p>$49</p>
<p ~id="reviews-place"~>Loading reviews...</p> <!-- The shell marks the place of the fallback -->
<div ~hidden~ id="reviews-ready"><ul><li>Great fit</li><li>Runs small</li></ul></div> <!-- Arrives 2 seconds later, hidden -->
<script>~swap('reviews-place', 'reviews-ready')~</script> <!-- Runs at once: the reviews take the place of the fallback -->
```

While React uses compact generated identifiers in production, the mechanics remain identical. Much like the native `replaceWith` method in vanilla JavaScript, the inline script locates the fallback placeholder and replaces it with the newly arrived DOM elements.

```tree dir=right caption="One HTML response in three parts: the shell, the hidden reviews, and the script that moves them into place."
One response, read by the browser from top to bottom
- +1. The shell [`<h1>` `<p>$49</p>` `<p>Loading reviews...</p>`] | Sent **at once** | The user sees the product and **`Loading reviews...`**
- +2. The reviews [`<ul>`] | Sent **2 seconds later**, at the **end** of the response | Arrives **hidden**, not where it belongs on the page
- +3. The inline script [`<script>`] | Sent **right after the reviews** | Puts the `<ul>` **in the place of `Loading reviews...`**
```

> [!DEFINITION]
> **An inline script.** [NEW] An inline `<script>` embeds executable code directly within the HTML markup rather than referencing an external file. The browser executes an inline script immediately upon parsing it in the incoming stream. Developers never write this script manually; React's server renderer generates it automatically. React documentation notes that React sends remaining HTML alongside an inline script tag that replaces the fallback. React refers to this replacement transition as a progressive reveal (Lesson 117).

### Why the Reviews Appear in the Middle of the Page

**Although the reviews arrive at the tail of the HTTP response, they display in the middle of the page without custom client code.** Here is the execution order:
1. The browser parses the initial shell chunk, displaying the heading, price, and fallback placeholder.
2. The network connection remains active for two seconds while the database query completes.
3. The HTML for the reviews arrives at the end of the response inside a hidden wrapper, preventing visual glitches at the bottom of the page.
4. An inline script tag arrives immediately afterward, and the browser executes it on the spot.
5. The script swaps the review elements into the exact DOM location held by the fallback placeholder.
6. This visual update can occur well before external client JavaScript bundles finish downloading. Official documentation highlights that server HTML is progressively revealed before external script tags finish loading.

```page width=text caption="The same page after the inline script has run: the reviews have taken the place of Loading reviews..."
heading: Blue Sneakers
line: $49
line: Great fit | good
line: Runs small | good
```

### VS | The Inline Script vs. the App's JavaScript: one moves HTML, the other makes the page answer clicks

Both scripts execute in the browser context and originate from React, making it easy to conflate their responsibilities. **Their architectural roles are fundamentally distinct:**
- **The inline script in the streaming response** performs raw DOM manipulation. It is extremely small, produced by React's server renderer, and runs immediately as bytes parse.
- **The client bundle calling `hydrateRoot`** loads React runtime libraries and application components, binding event listeners to make the page interactive (Lesson 104). It downloads from a separate asset file and initializes later.

```tree caption="The inline script that swaps in the reviews vs. the app's JavaScript that makes the page answer clicks."
Two kinds of script on the streamed page
- +The inline script [`<script>` in the response] | Written by **React's server renderer** | **Moves the reviews into place** the moment it arrives
- +The app's JavaScript [`hydrateRoot`] | Loads **React and our components** from a file | Makes the page **answer clicks**, later
```

Progressive DOM reveals require neither browser React runtime nor hydration. Hydration remains strictly necessary for user interactivity and event handling.

### Real Beginner Mistake: A Button in the Reviews, Tapped Too Early

1. A developer observes reviews appearing on screen and assumes the component is fully interactive.
2. They attach a click listener to a button inside each review item.
3. A visitor clicks the button immediately after the reviews appear, but the button does not respond.
4. The review markup is visible because the inline script swapped it into place, but client JavaScript has not yet hydrated the DOM (Lesson 104).

Remember: the inline script reveals markup, but only client hydration attaches event listeners.

---

## PRINCIPLE | Two `<Suspense>` boundaries: each section appears when its own data is ready, in any order

> [!PRINCIPLE]
> **Principle 4: Out of Order: `White Socks` Appears Before the Reviews Above It**
>
> *Each boundary flushes its HTML as soon as its underlying data resolves, independent of document order; a lower section that resolves quickly is revealed first.*
>
> The initial shell reserves a dedicated DOM position for every declared boundary. As data queries settle, the server flushes each boundary's resolved markup and replacement script in order of completion. Each inline script targets its specific placeholder. A fast component is never delayed by a slower component higher in the document, provided each resides in an independent boundary.
>
> **DO THIS:**
> ```jsx
> <Suspense fallback={<p>Loading reviews...</p>}>
>   <Reviews reviewsPromise={reviewsPromise} />
> </Suspense>
> ~<Suspense fallback={<p>Loading suggestions...</p>}>~ {/* Its own boundary: White Socks appears after half a second */}
>   <Suggestions suggestionsPromise={suggestionsPromise} />
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<Suspense fallback={<p>Loading...</p>}>~ {/* **WRONG:** one unit, so White Socks waits 2 seconds for the reviews! */}
>   <Reviews reviewsPromise={reviewsPromise} />
>   <Suggestions suggestionsPromise={suggestionsPromise} />
> </Suspense>
> ```

Most e-commerce storefronts include a recommended products section beneath customer reviews. We introduce this section inside its own distinct boundary:

```jsx title="src/App.jsx"
<h1>Blue Sneakers</h1>
<p>$49</p>
<Suspense fallback={<p>Loading reviews...</p>}>
  <Reviews reviewsPromise={reviewsPromise} /> {/* Ready after 2 seconds */}
</Suspense>
<h2>You may also like</h2>
~<Suspense fallback={<p>Loading suggestions...</p>}>~ {/* A second boundary, lower on the page */}
  <Suggestions suggestionsPromise={suggestionsPromise} /> {/* Ready after half a second */}
</Suspense>
```

The suggestions Promise originates from the server file just like the reviews Promise. The underlying query resolves with `White Socks` after 500 milliseconds. Although the recommendations section is positioned lower in the visual hierarchy, its data resolves four times faster.

**The bottom section of the page populates before the middle section.** The suggested product appears on screen while the review section above it continues to show a loading placeholder:

```page width=text caption="At once: the product, both loading lines, and the You may also like heading."
heading: Blue Sneakers
line: $49
line: Loading reviews...
section: You may also like
line: Loading suggestions...
```

```page width=text caption="After about half a second: White Socks has appeared, and Loading reviews... is still above it."
heading: Blue Sneakers
line: $49
line: Loading reviews...
section: You may also like
line: White Socks | good
```

```page width=text caption="After about 2 seconds: the reviews have appeared too."
heading: Blue Sneakers
line: $49
line: Great fit | good
line: Runs small | good
section: You may also like
line: White Socks
```

Developers accustomed to linear top-down rendering often assume the lower section must wait for earlier elements. While top-down ordering applies to the initial shell, it does not constrain Suspense boundaries.

### Out of Order: In the Order the Data Is Ready

This out-of-order capability highlights the power of inline replacement scripts. The initial shell anchors a designated marker for each boundary. When asynchronous data resolves, the server flushes that boundary's HTML alongside an inline script that targets its specific marker. Official documentation notes that the streaming server renderer delivers HTML out of order. Deferred chunks stream in order of data readiness rather than visual document layout.

React refers to the act of writing ready content into the response stream as a **flush**. Each individual transmission is called a **chunk**. On this page, the server emits three distinct chunks:

```tree dir=right caption="The three chunks of one response, flushed in the order the data is ready, not the order of the page."
What the server flushes, and when
- +At once: the shell | `Blue Sneakers`, `$49`, `Loading reviews...`, `You may also like`, `Loading suggestions...`
- +After about half a second: the suggestions | Their HTML and script | `White Socks` **takes the place** of `Loading suggestions...`
- +After about 2 seconds: the reviews | Their HTML and script | `Great fit` and `Runs small` **take the place** of `Loading reviews...`
```

Here is the precise runtime progression:
1. The server transmits the shell immediately, including headings, price, and both loading placeholders.
2. After 500 milliseconds, the suggestions query settles. React flushes the suggestions markup and script, replacing the lower loading placeholder with `White Socks`.
3. The review loading placeholder remains visible above the newly revealed suggestions.
4. After two seconds, the reviews query settles. React flushes the review markup and script, replacing the middle loading placeholder.
5. With all boundaries resolved, the server terminates the HTTP response.

Why do timing descriptions say approximately half a second? React throttles progressive reveal executions. Official documentation states that React reveals suspended content at most once every 300 milliseconds. If multiple boundaries finish loading within that window, React flushes and reveals them together. Because 500 milliseconds and two seconds sit far apart, our two reveals occur independently.

Implementing the recommendation feature requires minimal code. The database mock exports an additional query function:

```js title="src/db.js"
export function ~getSuggestions~() { // Answers with one suggestion after half a second
  return new Promise(resolve => {
    setTimeout(() => resolve(['White Socks']), 500);
  });
}
```

The suggestions component unwraps this Promise following the same pattern used for reviews:

```jsx title="src/Suggestions.jsx"
import { use } from 'react';

export default function Suggestions({ suggestionsPromise }) {
  const suggestions = ~use(suggestionsPromise)~; // Suspends until the suggestions arrive
  return (
    <ul>
      {suggestions.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}
```

The server entry point initiates both queries simultaneously and passes both Promises to the root component:

```jsx title="server.js" startLine="5"
app.use('/', (request, response) => {
  const reviewsPromise = getReviews();
  const suggestionsPromise = ~getSuggestions()~; // Starts at the same moment as the reviews lookup
  const { pipe } = renderToPipeableStream(
    <App reviewsPromise={reviewsPromise} suggestionsPromise={suggestionsPromise} />,
    {
      onShellReady() {
        pipe(response);
      },
    },
  );
});
```

The top of the server module imports both database functions, as displayed in the full listing at the end of the lesson.

### VS | Two Boundaries vs. One Boundary Around Both: one boundary is one unit

Consider what happens if you place both components inside a single shared boundary. **The syntax looks similar, but the loading behavior changes drastically:**
- **With two separate boundaries**, each section reveals independently as its data resolves. Recommendations appear after half a second.
- **With one boundary wrapping both**, React documentation dictates that the entire tree inside Suspense is treated as a single unit (Lesson 69). The suggestions, ready after half a second, remain hidden behind the fallback until the slower reviews resolve at two seconds.

On the server, boundary placement determines what flushes and when.

### Real Beginner Mistake: One Boundary for Parallel Loading

1. A developer initiates concurrent data queries for reviews and recommendations, placing both components inside one `<Suspense>` tag.
2. The asynchronous operations execute concurrently on the server because the route handler calls both functions before rendering.
3. However, the shared Suspense boundary coordinates display as an indivisible unit.
4. The recommendations content, ready in half a second, remains trapped behind a loading placeholder until the two-second review lookup finishes.

Remember: content reveals independently only when isolated in separate boundaries. Components intended to stream separately require distinct boundaries.

---

## PRINCIPLE | One `<Suspense>` around the whole page: the first screen is only `Loading...`

> [!PRINCIPLE]
> **Principle 5: Minimal but Complete: A Boundary Around the Whole Page Sends Only `Loading...`**
>
> *Position boundaries so the shell remains minimal but complete, providing a layout skeleton with fallbacks isolating only slow data.*
>
> A Suspense boundary extracts enclosed elements from the initial shell. Wrapping an entire page inside a root boundary reduces the shell to a single fallback message, forcing instant layout elements to wait for the slowest query. Isolating slow sections individually allows users to read available page content while asynchronous data streams.
>
> **DO THIS:**
> ```jsx
> <h1>Blue Sneakers</h1>
> <p>$49</p>
> ~<Suspense fallback={<p>Loading reviews...</p>}>~ {/* Only the slow part: the product goes out at once */}
>   <Reviews reviewsPromise={reviewsPromise} />
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<Suspense fallback={<p>Loading...</p>}>~ {/* **WRONG:** the shell is only Loading..., and the product waits 2 seconds! */}
>   <h1>Blue Sneakers</h1>
>   <p>$49</p>
>   <Reviews reviewsPromise={reviewsPromise} />
> </Suspense>
> ```

If declaring a boundary allows the product layout to stream first, why not wrap the entire component tree and stream everything? Consider this implementation:

```jsx title="src/App.jsx"
~<Suspense fallback={<p>Loading...</p>}>~ {/* **WRONG:** the product is inside the boundary too */}
  <h1>Blue Sneakers</h1>
  <p>$49</p>
  <Reviews reviewsPromise={reviewsPromise} />
</Suspense>
```

**The visitor observes only a generic loading indicator for two full seconds.** The heading and price are available immediately, but because they share a boundary with the reviews, they are held back by boundary unity.

::: row caption="During the first 2 seconds: a boundary around the whole page sends only a loading line; a boundary around the reviews sends the product."
::: col title="<Suspense> around the whole page" tag="first 2 seconds" tone=bad
```page size=mini
line: Loading...
```
:::
::: col title="<Suspense> around Reviews only" tag="first 2 seconds" tone=good
```page size=mini
heading: Blue Sneakers
line: $49
line: Loading reviews...
```
:::
:::

**Both implementations utilize streaming SSR, and both arrive at the exact same markup after two seconds.** However, only the targeted boundary configuration presents the product layout immediately.

Here is the sequence when a boundary wraps the entire page:
1. A developer wraps the root layout in `<Suspense>`, intending to enable streaming across the whole view.
2. The server flushes the shell immediately, which now consists solely of the fallback string `Loading...`.
3. Although the heading and price components render immediately, they reside in the same boundary as the suspended reviews component.
4. The rendered heading and price markup may travel to the client hidden, awaiting boundary completion.
5. After two seconds, the reviews query settles, and React reveals the entire boundary subtree together.

Compare this behavior with Principle 1, where no boundary was declared. Both patterns withhold product content from the screen for two seconds. A root boundary does emit an early first byte containing the loading text, but in terms of meaningful content presentation, both approaches perform similarly.

### Minimal but Complete

Suspense boundaries define the boundaries of the shell. The design challenge centers on determining what users should see during the initial render. Official React documentation advises keeping the shell minimal but complete, functioning like a structural skeleton of the entire page layout. The documentation notes that confronting a large loading spinner often feels slower and more frustrating than waiting slightly longer to view actual layout framing.

On this page, the shell is complete because it includes the heading, price, navigation cues, and designated fallbacks. It is minimal because no component in the shell blocks on asynchronous queries.

Overly granular boundaries introduce their own drawbacks. React documentation notes that Suspense boundaries should not be more granular than the intended user loading experience. Place boundaries only where you want distinct loading placeholders to display (Lesson 69).

```tree caption="Three places for Suspense on the product page, and what the user sees during the first 2 seconds."
Where the boundary goes on the product page
- !No boundary | The whole page is the shell | **Blank tab** for 2 seconds
- !One boundary around the whole page | The shell is **only `Loading...`** | The product **waits 2 seconds** with the reviews
- +One boundary around each slow section | The shell is **the real page** with a loading line for each slow section | The product shows **at once**
```

### Real Beginner Mistake: One Spinner Around the Whole App

1. An engineering team enables streaming and wraps the root application component in a single `<Suspense>` boundary displaying a spinner.
2. Every page in the application now opens with a generic full-screen spinner.
3. Fast layout elements like titles and headers only appear after the slowest database query finishes.

Remember: everything outside `<Suspense>` flushes immediately in the shell, so keep fast layout framing outside and wrap only slow queries.

---

## All 5 Principles Together

### The Complete Product Page

The database file holds both lookups:

```js title="src/db.js"
export function getReviews() {
  return new Promise(resolve => {
    setTimeout(() => resolve(['Great fit', 'Runs small']), 2000);
  });
}

export function getSuggestions() {
  return new Promise(resolve => {
    setTimeout(() => resolve(['White Socks']), 500);
  });
}
```

`Reviews` and `Suggestions` each read their promise the same way:

```jsx title="src/Reviews.jsx"
import { use } from 'react';

export default function Reviews({ reviewsPromise }) {
  const reviews = use(reviewsPromise);
  return (
    <ul>
      {reviews.map(review => <li key={review}>{review}</li>)}
    </ul>
  );
}
```

```jsx title="src/Suggestions.jsx"
import { use } from 'react';

export default function Suggestions({ suggestionsPromise }) {
  const suggestions = use(suggestionsPromise);
  return (
    <ul>
      {suggestions.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}
```

`App` renders the whole document, from `<html>` down, as React's docs do on the server. The shell is the heading, the price, the `You may also like` heading, and one fallback for each slow section:

```jsx title="src/App.jsx"
import { Suspense } from 'react';
import Reviews from './Reviews.jsx';
import Suggestions from './Suggestions.jsx';

export default function App({ reviewsPromise, suggestionsPromise }) {
  return (
    <html>
      <body>
        <h1>Blue Sneakers</h1> {/* Principles 1 and 5: the shell, sent at once */}
        <p>$49</p>
        ~<Suspense fallback={<p>Loading reviews...</p>}>~ {/* Principles 2 and 3: flushed after about 2 seconds */}
          <Reviews reviewsPromise={reviewsPromise} />
        </Suspense>
        <h2>You may also like</h2>
        ~<Suspense fallback={<p>Loading suggestions...</p>}>~ {/* Principle 4: flushed after about half a second */}
          <Suggestions suggestionsPromise={suggestionsPromise} />
        </Suspense>
      </body>
    </html>
  );
}
```

The server file starts both lookups for each visit, and starts sending as soon as the shell is ready:

```jsx title="server.js"
import { renderToPipeableStream } from 'react-dom/server';
import App from './src/App.jsx';
import { getReviews, getSuggestions } from './src/db.js';

app.use('/', (request, response) => {
  const reviewsPromise = getReviews();
  const suggestionsPromise = getSuggestions();
  const { pipe } = renderToPipeableStream(
    <App reviewsPromise={reviewsPromise} suggestionsPromise={suggestionsPromise} />,
    {
      ~onShellReady~() { // Principle 1: the shell has rendered, so start sending
        pipe(response);
      },
    },
  );
});
```

### The Order of One Response

```tree dir=right caption="The order in which the server sends one response for the product page, what the user sees after each part, and when the page starts to answer clicks."
One response for the product page, then hydration
- +1. At once: the shell | `Blue Sneakers`, `$49`, `Loading reviews...`, `You may also like`, `Loading suggestions...` | Sent when React calls **`onShellReady`**
- +2. After about half a second: the suggestions | Hidden HTML and an **inline script** | `White Socks` **takes the place** of its loading line
- +3. After about 2 seconds: the reviews | Hidden HTML and an **inline script** | `Great fit` and `Runs small` **take the place** of `Loading reviews...`
- +4. The app's JavaScript [`hydrateRoot`] | Loads from **its own file** and **hydrates** the page | Only then do **buttons answer clicks**
```

### Summary

| Aspect | The Habit That Breaks the Page | The React Rule |
| :--- | :--- | :--- |
| **1. The shell** | Leaving a slow component without an enclosing boundary, keeping the tab blank until data resolves | Everything outside Suspense forms the shell, and the server flushes nothing until the shell renders |
| **2. The fallback** | Fetching data inside an Effect and expecting server streaming to detect it | Read Promises with `use` inside a boundary so the fallback streams in the shell and content streams later |
| **3. The swap** | Expecting browser React to perform the swap and buttons to handle clicks immediately | An inline script swaps in markup before React loads; event listeners become active after hydration |
| **4. The order** | Combining independent sections in a single boundary to load in parallel | Assign each section an independent boundary so each flushes and reveals as soon as its query settles |
| **5. The placement** | Wrapping the entire application in a single root boundary | Wrap only slow asynchronous sections so the initial shell provides a complete layout skeleton |

Remember the core rule of this lesson. **The server sends everything outside `<Suspense>` at once, and each `<Suspense>` part later, when its own data is ready, in the same response.**

---

## For the Interview

> **The Interview Question:** How does streaming SSR work with Suspense: the shell, fallbacks, and out-of-order flushes?

### How to Answer Clearly in 30 Seconds

"With streaming server rendering, the server delivers a single HTML document across sequential chunks of one HTTP response. Everything outside Suspense boundaries constitutes the shell. The server holds transmission until the complete shell finishes rendering, sending fallback markup inside the shell where deferred components will go.

When a boundary's asynchronous data settles, React streams its rendered HTML down the same connection. An accompanying inline script swaps the content into the fallback location. This DOM replacement operates before client React loads and without waiting for hydration. Separate boundaries flush out of order, matching data readiness rather than visual hierarchy. A fast section lower on the page reveals before a slower section above it.

Keep three architectural rules in mind:
1. **Streaming requires data that suspends**, such as a Promise unwrapped with `use`. Client Effects never run on the server.
2. **A boundary acts as an indivisible unit**: components that should reveal independently require separate boundaries.
3. **Keep the shell minimal but complete**: wrapping an entire page in one boundary reduces the initial view to a generic spinner."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does streaming require React to load in the browser before deferred content can display?"**
   **No.** Deferred HTML arrives alongside an inline script tag generated by React's server renderer, and the browser executes it as soon as the chunk parses. React documentation states that streaming does not need to wait for React to load in the browser or for the application to become interactive. User clicks only execute once the client JavaScript bundle finishes hydrating the DOM. Suspense boundaries also enable piecemeal hydration, known as Selective Hydration (Lesson 151).
2. **"Why is out-of-order HTML delivery significant for application architecture?"**
   **Because stream transmission order no longer matches the DOM hierarchy.** A fast component positioned near the footer flushes before a slow component in the main content area, with inline scripts placing each element correctly. This non-linear delivery is a primary reason `useId` generates stable deterministic identifiers across server and client boundaries (Lesson 52). Furthermore, React batches reveal operations to at most once every 300 milliseconds, ensuring boundaries that resolve near each other reveal together without layout jitter.
3. **"How do you ensure search engine crawlers receive complete HTML without streaming fallbacks?"**
   **Buffer the response until all data queries settle.** When using `renderToPipeableStream`, connect the response pipe inside `onAllReady` rather than `onShellReady`. React documentation notes that piping inside `onAllReady` disables progressive loading, ensuring the stream contains the final complete document. Search engine crawlers then ingest the entire page in a single finished transmission containing all review text (Lesson 118).

```tree dir=right caption="Interview summary: the shell goes out at once, each boundary follows when its data is ready, and hydration comes last."
Streaming server rendering with Suspense
- +The shell [`onShellReady`] | Everything **outside every boundary** | Sent **at once**, with a **fallback** in each boundary's place
- +Each boundary [`<Suspense fallback>`] | Flushed **when its own data is ready**, in **any order** | An **inline script** puts it in place of its fallback
- !What breaks it [`useEffect` `fetch`] | Data that **never suspends** on the server | The boundary **streams nothing**
```
