# Lecture 103: Where and When the HTML of a Page Is Made

*(Why does the same product page show a blank screen, a loading line, or the finished heading in its first second?)*

> INTERVIEW QUESTION | ❱ CORE | How do CSR, SSR, streaming SSR, static prerendering, and resuming differ?

---

## VS | The Same for Every Visitor `Blue Sneakers` vs. Only for This Visitor `Cart: 2`: the first can be made in advance, the second only when the request arrives

> Every web page reaches the phone as HTML, and somebody has to write that HTML: the browser, the server, or a build that ran before anyone visited. **Client-side rendering, server-side rendering, streaming, static prerendering, and resuming are five answers to one question: where and when is the HTML made**? The answer matters, because it decides what the visitor sees in the first second, and a part made in advance can never belong to one visitor.

Think back to the earliest web page you wrote by hand. You typed a heading into an HTML file, and everyone who opened the page received that exact same heading. That file was prepared once, long before any visitor arrived.

Now consider a page that greets a signed-in user with `Hello, Alice`. Nobody could write that file months in advance, because nobody knew Alice would visit at that exact second. A computer must write that personalized markup at the moment Alice asks for it.

React pages follow the exact same rule. React can turn your components into HTML in three places:
- **In the browser**, after the JavaScript bundle downloads and runs.
- **On the server**, the instant a visitor request arrives.
- **In a build step**, once, before anyone visits the site.

**The five names you hear in technical interviews are five combinations of where, when, and how the HTML travels: in one piece, or in parts.**

Take the product page of an online shop. It displays the heading `Blue Sneakers`, a line showing the visitor cart count, and an `Add to cart` button. For Alice, the cart line says `Cart: 2`. Ask yourself: is every line on this page the same for every visitor? No. Alice, Bob, and every other visitor read the same heading. But `Cart: 2` belongs to Alice alone. Bob opens the same link and expects to see his own number.

**Why:** Each wrong answer costs something you can see immediately on the phone screen:
1. **The browser makes everything.** Alice stares at a blank screen until the JavaScript downloads and runs. React documentation warns directly that this initial blank wait can feel very slow.
2. **The server sends the page in one piece.** The heading waits for the slowest data on the page, which is Alice cart lookup.
3. **A build makes the page in advance, with the cart inside.** Every visitor gets the exact same file. MDN explains that for any given URL, all users will receive the same content. That cart is someone else cart, or no cart at all.

See the problem? The heading wants to be made early, and the cart cannot be made early. That split is the central challenge of modern web architecture.

So here is the one sentence to keep in mind for this whole lesson:

**A part that is the same for everyone can be made in advance. A part that belongs to one visitor can only be made when that visitor request arrives.**

### Five Ways to Make the Same Page

Here is the product page once it has fully loaded on Alice phone:

```page caption="The product page of the shop, once it has fully loaded on Alice's phone."
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 2
line: [Add to cart]
```

A friend sends Alice the link, and she opens it on her phone. Five teams could build this page in five different ways. The five ways differ most in what Alice sees during the first seconds:

| The way | Who makes the HTML, and when | What Alice sees first | What she sees next |
| :--- | :--- | :--- | :--- |
| **Client-side rendering** | The browser, after JavaScript runs | A blank page | The heading, and her cart last of all |
| **Server-side rendering** | The server, when her request arrives, in one piece | Nothing, while the server makes the whole page | The heading and her cart together |
| **Streaming server-side rendering** | The server, when her request arrives, in parts | The heading, with `Loading cart...` where her cart goes | `Cart: 2`, a moment later |
| **Static prerendering** | A build, before anyone visits | The heading, from a file made before she arrived | Her cart cannot be in that file |
| **Resuming** | A build makes the heading, the server makes her cart | The heading, from a file made before she arrived | `Cart: 2`, filled in by the server for her |

**It may look the same at the end, but it is NOT the same thing!** Put the five finished pages side by side. They show the same heading, the same count, and the same button. Open the Elements panel, and you find the exact same tags. Yet the HTML was not made at the same moment, or in the same place:
1. With client-side rendering, the browser generated the HTML.
2. With server-side rendering and with streaming, the server created it when Alice request arrived.
3. With static prerendering, a build created it before anyone visited.
4. With resuming, a build created the heading before anyone visited, and the server created Alice cart when her request arrived.

Only the first way makes all of the HTML inside the browser. The moment the HTML is made decides what Alice stares at while she waits.

```tree caption="The two questions that place every way of making a page, from everything in the browser to HTML made in advance."
Two questions every way of making a page answers
- +1. Where and when is the HTML made? | **In the browser**, after the JavaScript runs | **On the server**, when each request arrives | **At build time**, before anyone visits
- +2. How does the HTML arrive? | **In one piece**, when the whole page is ready | **In parts**, the first part at once and the rest as its data arrives
```

> [!DEFINITION]
> **Request time and build time.** [NEW] Request time is the moment a visitor's request reaches the server. The server does the work again for every visitor, so it can make HTML for that visitor alone. Build time is the moment the team builds the site, before any visitor arrives. The work runs once, and its result is one file that every visitor receives (Lesson 103).

### The Rule of Thumb: is this part the same for everyone?

**Ask one question about every part of a page: is it the same for every visitor? If yes, it can be made in advance, at build time. If no, it must be made at request time, on the server or in the browser.**

Teams choose between the five ways page by page. React documentation and MDN explain where each choice fits best:
1. **Client-side rendering** fits a page that nobody opens from a shared link, such as a screen behind a login. React documentation notes that single-page apps are easy to start with, but initial load times can feel slow.
2. **Server-side rendering in one piece** fits a server that cannot stream responses. React documentation explains you can continue using `renderToString` if your server environment does not support streams.
3. **Streaming server-side rendering** fits a page whose content differs for each request, with some slow data. React documentation recommends streaming calls over `renderToString` whenever possible.
4. **Static prerendering** fits a page that is identical for every visitor. MDN highlights blogs, documentation, and content sites, while React documentation highlights landing pages.
5. **Resuming** fits a page that is mostly identical for everyone, with a small part for each visitor. React documentation suggests pre-rendering static parts to serve from a CDN, then resuming on the server to fill dynamic content.

Our product page is the ideal case for all five at once. People open product pages from shared links, so something must show immediately. Its heading is identical for every visitor, so it can be made in advance. Its cart line belongs to one visitor, so it cannot.

A senior developer also knows the five classic mistakes:
1. **Picking one way for the whole app.** React lets frameworks choose the rendering strategy per route, so one application mixes several ways.
2. **Thinking a page made in advance cannot answer clicks.** It can. The browser still loads the JavaScript bundle and calls `hydrateRoot` on it, as on any server-rendered page.
3. **Thinking `renderToString` waits for data.** It does not. React documentation explicitly states that `renderToString` does not support streaming or waiting for data.
4. **Thinking the parts that arrive later need React in the browser.** They do not. React documentation explains that streaming does not wait for React to load in the browser.
5. **Thinking resuming happens in the browser and replaces hydration.** In React, `resume` runs on the server, and the browser still calls `hydrateRoot` after it.

The rest of the lesson shows each technique on the real product page.

## SECTION | The Blue Sneakers Product Page

Our page has two components. The App component holds the heading and wraps the cart line in a `<Suspense>` boundary, so the page has content to show while the cart loads:

```jsx title="src/App.jsx"
import { Suspense } from 'react';
import CartLine from './CartLine.jsx';

export default function App() {
  return (
    <main>
      <h1>Blue Sneakers</h1>
      <Suspense ~fallback={<p>Loading cart...</p>}~> {/* Shown while CartLine waits for the cart */}
        <CartLine />
      </Suspense>
    </main>
  );
}
```

> [!DEFINITION]
> **Suspense and its fallback.** [REVIEW] `<Suspense>` wraps a part of the page that may not be ready yet. While that part waits, React shows the `fallback` written on the tag, here `<p>Loading cart...</p>`. Everything outside the `<Suspense>` shows at once (Lesson 69).

The CartLine component reads the visitor cart and tracks the item count that the button changes:

```jsx title="src/CartLine.jsx"
import { use, useState } from 'react';
import { getCart } from './cart.js';

export default function CartLine() {
  const cart = ~use(getCart())~; // Waits for this visitor's cart: { count: 2 } for Alice
  const [count, setCount] = useState(cart.count);
  return (
    <>
      <p>Cart: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
    </>
  );
}
```

> [!DEFINITION]
> **use with a promise.** [REVIEW] `use(promise)` reads the value of a promise while the component renders. While the promise still waits, the component suspends: React stops rendering it and shows the fallback of the closest `<Suspense>` above it. When the promise resolves, React renders the component again with the value. The promise must be the same one on every call, not a new one each time (Lesson 71).

The `getCart` function is the shop data loader in the cart module. It returns a promise that resolves with the visitor cart, returning the stable promise needed by `use` across renders.

These two components stay almost the same in all five ways. What changes from one way to the next is one key call in one of three files:
- **`main.jsx`** runs in the browser.
- **`server.js`** runs when a request arrives.
- **`build.js`** runs when the team builds the site.

```files title="shop: File Explorer" caption="The files of the product page. Each way of making the page changes one call in main.jsx, server.js, or build.js."
build.js | build time | Runs once, before anyone visits: calls `prerender(<App />)`
server.js | request time | Runs for each visitor's request: calls `renderToString`, `renderToReadableStream`, or `resume`
src/
  App.jsx | page | Exports `App` as default: the heading and a `<Suspense>` around `CartLine`
  CartLine.jsx | per visitor | Exports `CartLine` as default: reads the cart with `use` and shows `Cart: {count}` and the button
  cart.js | data | Exports `getCart`, the shop's function that returns a promise of the visitor's cart
  main.jsx | browser | Calls `createRoot` or `hydrateRoot`
```

Again, keep in mind the governing rule: **a part that is the same for everyone can be made in advance. A part that belongs to one visitor can only be made when that visitor request arrives.**

**PRINCIPLES:** The five ways answer the same two questions differently, and all of them end in the browser. Six principles follow:
1. **Principle 1: createRoot: The Browser Makes Every Part of the Page.** The HTML arrives with an empty root, and the phone stays blank until the JavaScript has run.
2. **Principle 2: renderToString: The Server Sends the Page in One Piece.** The server makes the HTML at each request. It does not wait for data, so a waiting part goes out as its fallback.
3. **Principle 3: renderToReadableStream: The Shell Arrives First.** The server sends everything outside the Suspense boundaries at once, and each waiting part later, in the same response.
4. **Principle 4: prerender: One File at Build Time for Every Visitor.** The build waits for all data and makes one file. No part of that file can belong to one visitor.
5. **Principle 5: resume: The Server Finishes What the Build Left Open.** The build stops early and saves the unfinished work. When Alice arrives, the server makes her cart.
6. **Principle 6: hydrateRoot: Every Way That Sends HTML Ends Here.** Four of the five ways send HTML, and all four attach the clicks with hydrateRoot. Only client-side rendering uses createRoot.

---

## PRINCIPLE | `createRoot`: the browser makes the whole page, so it stays blank until the JavaScript runs

> [!PRINCIPLE]
> **Principle 1: createRoot: The Browser Makes Every Part of the Page**
>
> *With client-side rendering, the HTML that arrives holds only an empty root, and `createRoot` makes every part of the page in the browser after the JavaScript loads.*
>
> A page made in the browser has nothing to show until the JavaScript has downloaded and run, so the visitor stares at a blank page. That is fine for a screen behind a login, which nobody opens from a shared link. It is a problem for a public page, such as a product page, that people open from links on slow phones.
>
> **DO THIS:**
> ```jsx
> createRoot(document.getElementById('root')).render(~<AccountSettings />~); // Behind a login: nobody opens it from a shared link
> ```
>
> **DO NOT DO THIS:**
> ```html
> ~<div id="root"></div>~ <!-- **WRONG:** the public product page reaches the phone empty, and the visitor sees a blank page -->
> <script type="module" src="/src/main.jsx"></script>
> ```

Remember how plain JavaScript populates an empty page? The HTML carries an empty `<div>`, and a client script creates elements and appends them to the DOM:

```js title="Plain JavaScript: a script fills an empty div"
const h1 = document.createElement('h1');
h1.textContent = 'Blue Sneakers';
~document.getElementById('root').appendChild(h1)~; // Until this line runs, the page is blank
```

A client-only React application does the exact same thing. The only difference is that React generates those DOM creation calls from your JSX. The initial HTML file delivered to the device contains only an empty root element and a script tag, as seen in Lesson 07:

```html title="index.html"
~<div id="root"></div>~ <!-- Empty: no heading, no cart, no button -->
<script type="module" src="/src/main.jsx"></script>
```

Inside the browser entry file, one call creates the entire page:

```jsx title="src/main.jsx"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

~createRoot~(document.getElementById('root')).render(<App />); // Makes the heading, the cart line, and the button in the browser
```

This architecture is **client-side rendering**: the browser constructs the HTML DOM nodes using JavaScript on the client device. The heading, the cart line, and the button are all assembled on Alice phone after the JavaScript file finishes downloading and executing. Until that execution finishes, the phone screen displays nothing.

### What Alice Sees on a Slow Phone

On a slow mobile connection, the page moves through three distinct visual stages:

::: row caption="The client-only product page on a slow phone: a blank page, then the heading, then Alice's cart last of all."
::: col title="Before the JavaScript runs" tone=bad
```page size=mini
url: shop.example.com/blue-sneakers
blank
```
:::
::: col title="After createRoot renders App" tone=bad
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Loading cart...
```
:::
::: col title="After the cart arrives" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 2
line: [Add to cart]
```
:::
:::

**Beware! The cart comes last of all.** In a client-only architecture, the browser initiates the cart data request only after the component mounts on the screen:
1. The HTML arrives empty, leaving the screen completely blank.
2. The JavaScript bundle downloads and executes, and `createRoot` renders the App component. The heading and `Loading cart...` appear.
3. Only now does `CartLine` execute `getCart()`, so the cart count arrives last of all.

### The Blank Page Comes from the Browser, Not from React

Many developers assume that React pages always start blank because React renders them. That is not the reason. **The blank page is caused by where the HTML is generated**. Here it is generated inside the browser, so the browser has no markup to paint until JavaScript executes. React can create the exact same HTML on a server, or during a build step. The remaining principles demonstrate that server execution.

Client-side rendering still suits pages that visitors never access via shared direct links, such as an account settings dashboard behind authentication. The user has already waited during login, and nobody shares that private URL with friends.

### Why This Bug Ships

Here is how this blank page defect reaches production:
1. A team deploys the public product catalog as a client-only single-page app, because standard build tools default to that setup.
2. A customer opens a shared product link on a congested mobile connection.
3. The phone displays a white screen for several seconds while scripts download. On high-speed office networks, the engineering team never observed the delay.

---

## PRINCIPLE | `renderToString`: the server sends the page in one piece, and a waiting part goes out as its fallback

> [!PRINCIPLE]
> **Principle 2: renderToString: The Server Sends the Page in One Piece**
>
> *With server-side rendering, the server makes the HTML when each request arrives and sends it in one piece; `renderToString` does not wait for data, so a part that suspends is sent as its fallback.*
>
> Server-side rendering moves the HTML from the browser to the server, so the visitor sees the heading before any JavaScript runs. But one piece means one moment. Whatever is not ready at that moment either holds back the whole page, or goes out as its fallback. With `renderToString`, it goes out as the fallback, and the real content waits for the client code. When the server can send streams, React's docs point to the streaming call of Principle 3 instead.
>
> **DO THIS:**
> ```jsx
> const stream = await ~renderToReadableStream~(<App />); // Sends the heading now, and the cart when it is ready
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const html = ~renderToString~(<App />); // **WRONG:** expects Cart: 2, but the HTML always holds Loading cart...
> ```

Lesson 102 moved HTML generation to the server. Here are the two calls side by side, both rendering the exact same App component:

```jsx title="The same App, rendered in the browser and on the server"
~createRoot~(document.getElementById('root')).render(<App />); // main.jsx: the browser makes the HTML after the JavaScript loads
const html = ~renderToString~(<App />); // server.js: the server makes the HTML before it answers
```

**It may look the same, but it is NOT the same thing!** Both calls construct the finished page from the same App component. With `createRoot`, the browser creates the DOM nodes after scripts load. With `renderToString`, the backend generates an HTML string before sending the HTTP response, so the heading reaches Alice before any JavaScript executes.

The server executes `renderToString` for every incoming request, generating HTML at request time. Inside the browser, the main entry file changes as well. It now calls `hydrateRoot` instead of `createRoot`, enabling the button to handle click events. Principle 6 examines that hydration step in detail.

> [!DEFINITION]
> **createRoot and hydrateRoot.** [REVIEW] `createRoot(element).render(<App />)` builds the page from nothing inside an empty element. `hydrateRoot(element, <App />)` takes HTML that is already on the page, keeps it, and attaches the click handlers to it. A page whose HTML comes from a server calls `hydrateRoot` (Lesson 102).

### What "In One Piece" Does to Alice's Cart

The `renderToString` function returns a single synchronous string. Think of `JSON.stringify`: it outputs a complete string at once, with no way to transmit the first half now and stream the rest later. Because the server delivers the page in one rigid piece, a team faces two choices for Alice cart, each carrying a penalty:
1. **The server fetches cart data before rendering**, using framework data loaders as seen in Lesson 102. The rendered HTML contains `Cart: 2`, but the heading is blocked while waiting for data. Nothing reaches Alice until the slowest database lookup completes.
2. **The CartLine component reads data through Suspense**, as our example does. The synchronous function `renderToString` cannot await pending promises. It renders the fallback placeholder `Loading cart...` for Alice and every other visitor.

Our implementation makes the second choice, and the outcome surprises many engineers. **The HTML delivered from the server never contains `Cart: 2`.** Here is why:
1. The `renderToString` function renders the App component, and the heading text enters the HTML string.
2. The CartLine component executes `use(getCart())`. Because the cart promise is pending, CartLine suspends.
3. The synchronous renderer `renderToString` cannot pause to await promises. It finds the nearest enclosing Suspense boundary and writes its fallback markup into the HTML string.
4. Alice receives the document and immediately sees `Blue Sneakers` alongside `Loading cart...`.
5. The text `Cart: 2` appears only after the client JavaScript bundle downloads and executes in her browser. React documentation confirms that the real content will not appear until client code loads.

::: row caption="The product page made with renderToString: the fallback arrives in the server HTML, and the cart appears only after the client code loads."
::: col title="The HTML from renderToString" tone=bad
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Loading cart... | bad
```
:::
::: col title="After the client code loads" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 2 | good
line: [Add to cart]
```
:::
:::

The fallback text `Loading cart...` in the server markup came directly from our own code. It is the fallback defined on the `<Suspense>` tag in App, which React rendered when the component suspended.

When the client JavaScript bundle finishes loading, React mounts the CartLine component inside the browser. At that point, React logs this explanatory error in the browser Console:

```devconsole width=full caption="The Console after hydrateRoot, when renderToString sent the fallback of the cart line."
x Uncaught Error: Switched to client rendering because the server rendering aborted due to:
  The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server
```

### Server-Side Rendering Sends What Is Ready, Not the Finished Page

**Server-side rendering does not guarantee that the server delivers fully resolved data.** The server sends only the markup ready at that exact moment. When using synchronous `renderToString`, any component awaiting asynchronous data is emitted as its fallback placeholder, leaving real data resolution to client scripts.

Here is how this misconception reaches production:
1. An engineer renders a dynamic page using `renderToString`.
2. A child component reads asynchronous data through Suspense.
3. The engineer expects the server HTML to contain resolved user data, but the HTML always contains the fallback placeholder.
4. Web crawlers, search engines, and visitors on slow networks see the loading fallback rather than real content.

React documentation recommends the streaming methods described in Principle 3 whenever possible, reserving `renderToString` strictly for legacy environments that cannot stream responses.

---

## PRINCIPLE | `renderToReadableStream`: the shell arrives first, and each Suspense part follows in the same response

> [!PRINCIPLE]
> **Principle 3: renderToReadableStream: The Shell Arrives First**
>
> *With streaming server-side rendering, the server sends the shell, the part outside every `<Suspense>` boundary, as soon as it is ready, and sends each waiting part later in the same response, before any JavaScript of ours runs.*
>
> Streaming takes away both waits of server-side rendering in one piece. The heading no longer waits for the slowest data, and the cart no longer waits for the JavaScript, because React on the server sends a small script that swaps the cart in. The boundary decides what goes into the shell, so wrap only the part that is slow.
>
> **DO THIS:**
> ```jsx
> <h1>Blue Sneakers</h1>
> ~<Suspense fallback={<p>Loading cart...</p>}>~ {/* The heading is in the shell; only the cart waits */}
>   <CartLine />
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<Suspense fallback={<p>Loading...</p>}>~ {/* **WRONG:** the whole page waits, so the shell is a loading line */}
>   <h1>Blue Sneakers</h1>
>   <CartLine />
> </Suspense>
> ```

You have experienced this behavior across modern web applications. The page header and navigation layout appear instantly, a placeholder line sits where dynamic content belongs, and moments later the finalized data slides into place. The backend did not transmit the entire page in one delayed burst. It transmitted the page progressively across one open connection.

We retain the exact same App component and Suspense boundary, changing only the rendering call inside the server handler:

```jsx title="The same App, sent in one piece and sent in parts"
const html = ~renderToString~(<App />); // Sends Loading cart..., and stops
const stream = await ~renderToReadableStream~(<App />); // Sends Loading cart..., then Cart: 2 in the same response
```

**It may look the same, but it is NOT the same thing!** Both methods begin by delivering the heading and the fallback `Loading cart...`. The synchronous `renderToString` function stops right there. In contrast, `renderToReadableStream` keeps the HTTP response stream open, and when Alice cart data finishes loading on the server, it streams the cart HTML into the same response.

> [!DEFINITION]
> **What is streaming?** [NEW] Streaming means the server sends the HTML in parts, each part as soon as it is ready, in one response. React's docs: "Streaming allows the user to start seeing the content even before all the data has loaded on the server." `renderToReadableStream`, from `react-dom/server`, is the call that does it. Its name says what it returns: a stream, which the server sends to the browser part by part (Lesson 103).

> [!DEFINITION]
> **What is the shell?** [NEW] The shell is everything outside every `<Suspense>` boundary: the first part the server sends. React's docs: "It determines the earliest loading state that the user may see." On our page, the shell is the heading and the fallback, `Loading cart...` (Lesson 103).

### The Two Small Changes in Our Files

Streaming examples in React documentation have the App component return the entire document, starting from the root `<html>` tag. This allows React to stream the page from its very first byte. Our App component adopts this complete structure:

```jsx title="src/App.jsx"
import { Suspense } from 'react';
import CartLine from './CartLine.jsx';

export default function App() {
  return (
    ~<html>~ {/* The whole document, so React can send it from the first byte */}
      <body>
        <main>
          <h1>Blue Sneakers</h1>
          <Suspense fallback={<p>Loading cart...</p>}>
            <CartLine />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
```

The server script streams the App component for each request and instructs React which client script to inject into the document:

```jsx title="server.js"
import { renderToReadableStream } from 'react-dom/server';
import App from './src/App.jsx';

export async function handler(request) {
  const stream = await ~renderToReadableStream~(<App />, { // Resolves as soon as the shell is ready
    ~bootstrapScripts: ['/main.js']~, // React writes the script tag that loads our bundle
  });
  return new Response(stream, { headers: { 'content-type': 'text/html' } });
}
```

The handler function runs on the server for every incoming request. It returns a web-standard `Response` object with the readable stream as its body. By providing `bootstrapScripts`, developers no longer manually maintain script tags in static templates. React injects the necessary script tags directly into the HTML stream, and Principle 6 explains how that client script takes over.

### The Cart Appears Before Any JavaScript of Ours Runs

**Beware! Under streaming SSR, the placeholder `Loading cart...` updates to `Cart: 2` while your client bundle is still downloading.** This mechanism operates in a strict, progressive sequence:
1. The server immediately transmits the shell containing `Blue Sneakers` and `Loading cart...`.
2. Alice phone displays this markup right away, while her browser continues downloading the client bundle in the background.
3. On the server, Alice cart lookup resolves.
4. React renders the CartLine component on the backend and transmits the resulting HTML down the open response stream. As React documentation notes, this chunk arrives alongside an inline script that replaces the loading fallback with the new HTML.
5. The browser executes that tiny inline script the instant the chunk arrives, swapping `Cart: 2` into the document in place of `Loading cart...`.
6. The `Add to cart` button is now visible on screen, but it does not respond to clicks until the client JavaScript bundle finishes loading. Principle 6 covers that final step.

::: row caption="The streamed product page: the shell first, then the cart in the same response, all before the bundle runs."
::: col title="The shell arrives" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Loading cart...
```
:::
::: col title="The cart's HTML arrives in the same response" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 2 | good
line: [Add to cart]
```
:::
:::

Who performs the DOM replacement that reveals the cart? Neither React on the client nor our application bundle. React on the server embeds a tiny inline script into the stream, and the browser executes it on arrival. React documentation emphasizes that streaming does not need to wait for client React to load or for the application to become interactive.

### One Suspense Around the Whole Page Turns the Shell into a Loading Line

The shell determines what the visitor sees first, making boundary placement critical. Compare placing a boundary tightly around the cart line versus wrapping the entire page:

```jsx title="A boundary around the cart line vs. a boundary around the whole page"
<h1>Blue Sneakers</h1>
~<Suspense fallback={<p>Loading cart...</p>}>~ {/* Only the cart waits: the heading is in the shell */}
  <CartLine />
</Suspense>

~<Suspense fallback={<p>Loading...</p>}>~ {/* **WRONG:** the heading is inside too, so the shell holds only Loading... */}
  <h1>Blue Sneakers</h1>
  <CartLine />
</Suspense>
```

Wrapping the entire page forces the heading to wait alongside the cart. The initial shell holds nothing except the fallback placeholder, reducing the first visual paint to a single loading message:

::: row caption="What Alice sees first: a boundary around the cart line vs. a boundary around the whole page."
::: col title="Suspense around the cart line" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers | good
line: Loading cart...
```
:::
::: col title="Suspense around the whole page" tone=bad
```page size=mini
url: shop.example.com/blue-sneakers
line: Loading... | bad
```
:::
:::

React documentation warns that presenting a full-page loading spinner often feels slower to users than rendering the real page layout right away. Wrap only components with slow data dependencies, keeping layout and static titles in the immediate shell.

---

## PRINCIPLE | `prerender`: one file made at build time, the same for every visitor

> [!PRINCIPLE]
> **Principle 4: prerender: One File at Build Time for Every Visitor**
>
> *With static prerendering, `prerender` runs at build time, waits for all data, and makes one HTML file that every visitor receives, so no part of that file can belong to one visitor.*
>
> Static prerendering makes the same page as server-side rendering, at a different moment: once, before anyone visits, instead of at every request. The file can be sent from a CDN at once. But no visitor exists at build time, so a cart rendered into the file is the same cart for everyone, and React prints a hydration error once the browser reads the real cart.
>
> **DO THIS:**
> ```jsx
> const { prelude } = await ~prerender~(<LandingPage />); // The same for every visitor: made once, at build time
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const { prelude } = await ~prerender~(<App />); // **WRONG:** CartLine is read at build time, so every visitor sees the same cart
> ```

Remember that static HTML file you authored by hand? It was ready before any visitor arrived, and every visitor downloaded the identical file. Static prerendering applies that same strategy to React components, generating static markup ahead of time.

Now move rendering out of the request lifecycle and into the build script. Here are the two rendering calls compared:

```jsx title="The same App, rendered at request time and at build time"
const stream = await ~renderToReadableStream~(<App />); // server.js: runs again for every visitor's request
const { prelude } = await ~prerender~(<App />); // build.js: runs once, when the team builds the site
```

This comparison highlights two distinct dimensions:
- **The resulting markup: yes, it is the exact same thing!** Both execute the App component with React, producing identical markup for the heading, the cart line, and the button.
- **The execution timing: it may look the same, but it is NOT the same thing!** The streaming call runs dynamically when Alice sends an HTTP request. The `prerender` call runs once at build time, long before any visitor opens the site.

Generating HTML ahead of time during the build phase is called **static prerendering**, or **static site generation**, often abbreviated as SSG. MDN explains that content for a static site is created at build time, not at request time.

### The Build File

The `prerender` function performs this build-time compilation. Exported from the static rendering package of React, it waits for all asynchronous data dependencies across the tree to resolve before completing. Here is how it operates in the build script:

```jsx title="build.js"
import { mkdir, writeFile } from 'node:fs/promises';
import { prerender } from 'react-dom/static';
import App from './src/App.jsx';

const { ~prelude~ } = await prerender(<App />, { // Waits for all data, then gives back the HTML
  bootstrapScripts: ['/main.js'],
});
await mkdir('dist', { recursive: true }); // Creates the dist folder on the first build
await writeFile('dist/blue-sneakers.html', prelude); // One file, sent to every visitor
```

The `prelude` stream comes from the result object returned by `prerender`:
1. Calling `prerender(<App />)` returns a promise.
2. That promise resolves to an object containing two fields: `prelude` and `postponed`.
3. The `prelude` field is a readable stream of HTML representing the finished page. When rendering completes without interruption, `postponed` is null. Principle 5 uses `postponed` when prerendering is paused.

> [!DEFINITION]
> **What is a CDN?** [NEW] A CDN, a content delivery network, is a set of servers in many places that keep copies of the same files close to the visitors. A file made once at build time is usually sent from a CDN, because it is the same file for everyone. MDN: static sites "can be served from a CDN" (Lesson 103).

### VS | One String `renderToString` vs. A Build File `prerender`: the first writes the fallback into the file, while the second waits for the data

During a build step, `prerender` and `renderToString` behave very differently. The synchronous `renderToString` function aborts suspended components and writes their loading fallbacks into the file. The `prerender` function waits for all suspended promises to resolve, ensuring the resulting static file contains fully resolved markup.

### The File Cannot Hold Alice's Cart

**Beware! A file created before visitors arrive embeds the exact same cart count for every user.** Here is why:
1. The build script reaches the CartLine component during static prerendering.
2. No visitor is present during the build, so no authenticated user session exists. The data function reads default build data, returning an empty cart.
3. That identical static file is deployed globally and served to Alice and Bob. MDN confirms that for a given static URL, all users receive identical content.

::: row caption="The prerendered product page on two phones: the same file, with the same cart line, for every visitor."
::: col title="Alice opens the file" tone=bad
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 0 | bad
line: [Add to cart]
```
:::
::: col title="Bob opens the same file" tone=bad
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 0 | bad
line: [Add to cart]
```
:::
:::

The static page displays incorrect data. Alice has two items in her real cart, but the page greets her with `Cart: 0`. Every customer receives that stale count until the next build deploys.

The incorrect count causes immediate runtime issues. When the client bundle loads, client-side code fetches Alice real cart, rendering `Cart: 2`. React compares this client output against the server HTML saying `Cart: 0`. Detecting the conflict, React logs a hydration mismatch error and rebuilds the DOM node on the client:

```devconsole width=full caption="The Console after hydrateRoot, when the static file says Cart: 0 and the browser reads Alice's cart."
x Uncaught Error: Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
  - A server/client branch `if (typeof window !== 'undefined')`.
  - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
  - Date formatting in a user's locale which doesn't match the server.
  - External changing data without sending a snapshot of it along with the HTML.
  - Invalid HTML tag nesting.
  It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
  https://react.dev/link/hydration-mismatch
```

React flags the paragraph inside CartLine where the client rendered 2 while the HTML contained 0. Alice sees the cart count flash from 0 to 2 as the tree regenerates.

### Why This Bug Ships

Here is how this defect reaches production:
1. A team statically prerenders the entire product catalog, including user-specific cart badges.
2. Build workers compile pages in an environment with no logged-in user context.
3. Every visitor receives the identical cached file until the next site deployment.
4. When client bundles load, client fetches retrieve real user data, causing visible layout shifts and hydration errors.

Static prerendering fits content that remains identical for all visitors, such as product titles, images, and descriptions. Dynamic per-visitor data belongs on a static page in one of two ways:
1. The client browser fetches and renders the data after initial page load.
2. A live server injects the dynamic content at request time, as shown in Principle 5.

### A Static Page Still Answers Clicks

Many developers assume that a statically prerendered page lacks React functionality. That is false. **A static page is React HTML produced in advance.** The `prerender` call accepts `bootstrapScripts`, embedding bundle script tags into the file. In the browser, client scripts execute `hydrateRoot`, connecting event listeners exactly as on server-rendered pages. Principle 6 details this connection.

---

## PRINCIPLE | `resume`: the build makes the shared part, and the server fills in each visitor's part

> [!PRINCIPLE]
> **Principle 5: resume: The Server Finishes What the Build Left Open**
>
> *With resuming, `prerender` is stopped early with a `signal`; the parts that were not ready stay as their fallbacks in the `prelude`, the rest of the work is saved as `postponed`, and at request time `resume(<App />, postponed)` streams the missing parts for that visitor.*
>
> Resuming puts static prerendering and streaming on one page. The part that is the same for everyone is made once, at build time, and can be sent at once. The part that belongs to one visitor is made when that visitor's request arrives. `resume` runs on the server, so the browser still calls `hydrateRoot` afterwards.
>
> **DO THIS:**
> ```jsx
> await prerender(<App />, { signal: controller.signal, ~bootstrapScripts: ['/main.js']~ }); // build.js: the script tag goes into the prelude
> const stream = await resume(<App />, postponed); // server.js: continues the saved prerender for this visitor
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> await prerender(<App />, { signal: controller.signal });
> const stream = await resume(<App />, postponed, { ~bootstrapScripts: ['/main.js']~ }); // **WRONG:** resume does not accept bootstrapScripts
> ```

Principle 4 revealed a conflict on the product page. The title can be prepared in advance, but the user cart cannot. Resuming resolves this conflict by generating each section at its ideal moment. Here is what Alice sees:

::: row caption="The resumed product page: the heading from a file made before Alice came, then her cart, filled in by the server at request time."
::: col title="The prerendered part arrives" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Loading cart...
```
:::
::: col title="The server fills in her cart" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 2 | good
line: [Add to cart]
```
:::
:::

The product title and loading fallback arrive from a static file created long before Alice visited. A moment later, the server streams her personalized `Cart: 2` count. This architecture combines Principle 4 and Principle 3 on a single route: static content generates at build time, while user-specific content streams at request time.

### Stopping prerender Works Like Cancelling a fetch

Recall how you cancel an in-flight network request with fetch. You create an `AbortController` instance and pass its `signal` into the request options. Calling `controller.abort()` terminates the request immediately. The `prerender` function supports this exact cancellation signal. When aborted, React halts the build-time render, returns the static HTML generated so far, and outputs an object describing the unfinished tree.

The rendering pipeline splits across two files and two distinct phases. At build time, the build script starts `prerender` and aborts it before dynamic cart data can be accessed:

```jsx title="build.js"
import { mkdir, writeFile } from 'node:fs/promises';
import { prerender } from 'react-dom/static';
import App from './src/App.jsx';

const controller = new AbortController();
setTimeout(() => ~controller.abort()~); // Stops prerender a moment after it starts: the heading is done, the cart is not

const { prelude, ~postponed~ } = await prerender(<App />, { // postponed holds the work prerender did not finish
  ~signal: controller.signal~, // Lets controller.abort() reach prerender
  bootstrapScripts: ['/main.js'],
});
await mkdir('dist', { recursive: true });
await writeFile('dist/blue-sneakers.html', prelude); // Blue Sneakers and Loading cart...
await writeFile('dist/blue-sneakers.json', JSON.stringify(postponed)); // Saved as JSON text for request time
```

At request time, the server handler transmits the pre-built HTML file first, then resumes rendering the unfinished components for that specific visitor:

```jsx title="server.js"
import { readFile } from 'node:fs/promises';
import { resume } from 'react-dom/server';
import App from './src/App.jsx';

export async function handler(request) {
  return new Response(ReadableStream.from(sendPage()), { headers: { 'content-type': 'text/html' } });
}

async function* sendPage() {
  yield await readFile('dist/blue-sneakers.html'); // 1. Sent at once: Blue Sneakers and Loading cart...
  const postponed = JSON.parse(await readFile('dist/blue-sneakers.json', 'utf8'));
  const stream = await ~resume~(<App />, postponed); // 2. Continues the prerender for this visitor: makes Cart: 2
  yield* stream; // 3. Sent next, in the same response
}
```

These two files introduce five important concepts:
- **`AbortController` and `signal`** provide the standard mechanism to stop ongoing asynchronous operations. The abort signal goes to `prerender`, and calling abort halts the process.
- **`setTimeout` with zero delay** triggers `controller.abort()` shortly after prerendering begins. By that time, React has rendered static layout components, while dynamic data components remain suspended.
- **`postponed`** holds the serialized state of components that did not finish rendering. React documentation defines it as an opaque, JSON-serializable object intended for `resume`. Being opaque, applications store and pass it without inspecting internal properties.
- **`resume`** is the server function that continues a paused render at request time, returning a readable stream of HTML.
- **`sendPage`** is an async generator function. Marked with an asterisk, it yields response chunks in order: first the static file, then streamed chunks from `resume`. The helper `ReadableStream.from` converts those yielded parts into a single response stream.

During the build step, terminal logs may display an abort notification indicating the operation stopped before completing. Because this early termination is intentional, the build succeeds and outputs both static artifacts.

> [!DEFINITION]
> **What is resuming?** [NEW] Resuming means continuing a stopped prerender later, on the server, when a visitor's request arrives. `prerender` stops early and returns `postponed`, and `resume(<App />, postponed)` makes the missing parts for that visitor. React's docs call this way of working Partial Pre-rendering: part of the page is prerendered, and the rest is made per request (Lesson 103).

### VS | Prerender Alone `prerender` vs. Prerender Then Resume `resume`: one file for everyone, while each visitor gets a part filled in

**It may look the same, but it is NOT the same thing!** Both start with the `prerender` function in the build script. With `prerender` alone, the compiler waits for all data and outputs a single static file for every visitor. With an abort signal followed by `resume`, every visitor downloads the shared pre-rendered shell instantly, while a backend server streams dynamic user data upon arrival.

### One Page, Made Hours Apart

**The page heading was compiled during the build step, and Alice cart was calculated when she arrived, perhaps days later. Both pieces reach her inside one cohesive document.** Here is the full execution lifecycle in order:
1. At build time, `prerender` begins rendering the component tree, and `controller.abort()` interrupts execution before CartLine resolves data.
2. React documentation explains that Suspense boundaries with incomplete children are emitted into the prelude using their fallback markup. The prelude holds the heading alongside `Loading cart...`.
3. The build function returns the `postponed` state, which the build script persists to storage.
4. Alice request reaches the production server, which immediately flushes the pre-rendered prelude file to her browser.
5. The server reads the saved `postponed` state and calls `resume` with that data.
6. The `resume` function traverses the component tree directly to components that were left incomplete. On our page, it invokes CartLine with Alice request context.
7. Alice cart data resolves, and the resulting HTML chunk containing `Cart: 2` streams to her browser.
8. The client bundle finishes downloading, `hydrateRoot` executes, and the `Add to cart` button becomes interactive.

```tree dir=right caption="One product page made at two moments: the heading at build time, Alice's cart at request time, and the clicks in the browser."
How the resumed product page is made
- +1. Build time [`prerender` `signal`] | Makes **`Blue Sneakers`** and **`Loading cart...`** | Saves the unfinished work as **`postponed`**
- +2. Request time [`resume`] | Continues from **`postponed`** for this visitor | Streams **`Cart: 2`** in place of the fallback
- +3. In the browser [`hydrateRoot`] | Attaches **our click handler** | **`Add to cart`** answers a tap
```

### Resuming Happens on the Server, Not in the Browser

The term resume leads some developers to imagine that the client browser continues the build render without needing hydration. That is a misunderstanding. **The `resume` function executes on the server to stream server HTML**. It belongs to the server package of React and outputs markup. The client browser must still download JavaScript and execute `hydrateRoot`. In official React examples, buttons explicitly state that interaction requires hydration.

A related mistake involves script configuration. The script options belong to the initial prerender call, not to the resume call:

```jsx title="Where bootstrapScripts goes when you resume"
await prerender(<App />, { signal: controller.signal, ~bootstrapScripts: ['/main.js']~ }); // build.js: the script tag is written here
await resume(<App />, postponed, { ~bootstrapScripts: ['/main.js']~ }); // **WRONG:** resume does not accept bootstrapScripts
```

React documentation specifies three configuration options that `resume` does not accept:
- `bootstrapScripts`
- `bootstrapScriptContent`
- `bootstrapModules`

These script options must be supplied to the initial `prerender` call so that script tags enter the static prelude markup. If passed to `resume`, React silently ignores them, leaving the page without bundle script tags and preventing buttons from ever becoming interactive.

---

## PRINCIPLE | `hydrateRoot`: in every way that sends HTML, the button answers only after the bundle runs

> [!PRINCIPLE]
> **Principle 6: hydrateRoot: Every Way That Sends HTML Ends Here**
>
> *Every way that sends HTML from a server or a build ends in the browser with `hydrateRoot`, which attaches the event handlers to that HTML; only client-side rendering uses `createRoot`.*
>
> The five ways decide when and where the HTML is made, but HTML has no place for a click handler. The handler arrives with the bundle, and `hydrateRoot` attaches it to the HTML that is already on the page, reusing its nodes. `createRoot` on server HTML throws that HTML away and makes it again.
>
> **DO THIS:**
> ```jsx
> ~hydrateRoot~(document, <App />); // Reuses the prerendered HTML and attaches the click handler
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~createRoot~(document.getElementById('root')).render(<App />); // **WRONG:** #root already holds the server HTML, and React throws it away and makes it again
> ```

Remember native DOM event listeners? HTML markup conveys visual layout and attributes, but event listeners are JavaScript functions in memory. Only JavaScript running inside the client browser can attach listeners to DOM nodes. That principle holds regardless of whether HTML was generated by the browser, a live server, or a build script.

Four of the five rendering strategies deliver server-rendered HTML, while client-side rendering delivers an empty document. Here is the client entry call for each strategy:

```jsx title="The one call in main.jsx, for each of the five ways"
~createRoot~(document.getElementById('root')).render(<App />); // Client-side rendering: the HTML arrives empty
~hydrateRoot~(document.getElementById('root'), <App />); // Server-side rendering with renderToString: App fills only #root
~hydrateRoot~(document, <App />); // Streaming, static prerendering, and resuming: App returns the whole document
```

This code block illustrates two essential distinctions:
- **`createRoot` and `hydrateRoot`: NOT the same thing!** The `createRoot` call generates elements from scratch inside an empty container. The `hydrateRoot` call takes existing DOM nodes delivered from the server, preserves them, and attaches event listeners. React documentation highlights that hydration reuses existing DOM nodes instead of destroying and recreating them.
- **Streaming, static prerendering, and resuming: yes, it is the exact same thing!** All three methods deliver HTML generated from the root `<html>` element downward. Consequently, all three invoke `hydrateRoot` across the full document. Traditional SSR with `renderToString` hydrates a specific root container because the component rendered only container children as seen in Lesson 102.

The five architectures dictate when and where HTML is generated. None of them transmits event handlers across the network. Event handlers activate only after the client JavaScript bundle finishes downloading.

### What Alice Sees Until the Bundle Runs

**In every architecture that delivers pre-rendered HTML, the button appears on screen before it can respond to taps.** If Alice taps the button during the first seconds of page load, nothing happens. After `hydrateRoot` executes, the exact same tap increments the display to `Cart: 3`:

::: row caption="The product page in any of the four ways that send HTML: Alice taps the button before and after hydrateRoot runs."
::: col title="Alice taps before hydrateRoot runs" tone=bad
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 2 | bad
line: [Add to cart]
```
:::
::: col title="Alice taps after hydrateRoot runs" tone=good
```page size=mini
url: shop.example.com/blue-sneakers
heading: Blue Sneakers
line: Cart: 3 | good
line: [Add to cart]
```
:::
:::

Many developers assume a page is interactive simply because it arrived from a server with content visible. Visual markup is ready, but interactivity requires hydration. Buttons handle user events only after `hydrateRoot` mounts React listeners. This rule applies equally to resumed pages: `resume` streams additional HTML from the server, but the client must still hydrate those nodes.

### Where the Script That Runs main.jsx Comes From

In a client-only single-page app, developers write the script tag into `index.html` manually. On streamed or pre-rendered pages, developers avoid manual script tags. **React injects the script automatically using `bootstrapScripts`:**
1. The server or build rendering call receives `bootstrapScripts`, specifying the path to the compiled client bundle.
2. React emits a script tag into the HTML stream pointing to that bundle URL.
3. The browser downloads that bundle file and executes `hydrateRoot`.

### Why This Bug Ships

This error frequently occurs when migrating existing applications away from client-side rendering as covered in Lesson 102:
1. A team upgrades a product page from client-side rendering to server-rendered or pre-rendered HTML.
2. The client entry file continues calling `createRoot`.
3. React discards the pre-rendered HTML and reconstructs the DOM tree from scratch. The application appears functional, concealing the wasteful destruction of server-rendered nodes.

The reverse mistake also causes failures. Calling `hydrateRoot` on an empty container in a client-only application is unsupported. React logs a hydration error warning that server-rendered HTML did not match client markup, before rebuilding the entire tree in the browser. Lesson 104 covers the mechanics and performance costs of the hydration process.

---

## All 6 Principles Together

### The Complete Resumed Product Page

Resuming incorporates every technique covered in this lesson. Here is the complete implementation across all application files. The App component returns the complete document, positioning the static heading in the shell and enclosing the cart line within Suspense:

```jsx title="src/App.jsx"
import { Suspense } from 'react';
import CartLine from './CartLine.jsx';

export default function App() {
  return (
    <html>
      <body>
        <main>
          <h1>Blue Sneakers</h1> {/* Principle 4: the same for every visitor, made at build time */}
          ~<Suspense fallback={<p>Loading cart...</p>}>~ {/* Principle 3: the shell ends here, so Loading cart... goes into the file */}
            <CartLine />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
```

The CartLine component reads visitor cart data and manages the local item count:

```jsx title="src/CartLine.jsx"
import { use, useState } from 'react';
import { getCart } from './cart.js';

export default function CartLine() {
  const cart = ~use(getCart())~; // Principle 5: belongs to one visitor, made at request time by resume
  const [count, setCount] = useState(cart.count);
  return (
    <>
      <p>Cart: {count}</p>
      <button ~onClick~={() => setCount(count + 1)}>Add to cart</button> {/* Principle 6: answers only after hydrateRoot */}
    </>
  );
}
```

The build script executes once at build time:

```jsx title="build.js"
import { mkdir, writeFile } from 'node:fs/promises';
import { prerender } from 'react-dom/static';
import App from './src/App.jsx';

const controller = new AbortController();
setTimeout(() => controller.abort());

const { prelude, postponed } = await ~prerender~(<App />, { // 1. Build time: makes the heading and the fallback
  signal: controller.signal,
  bootstrapScripts: ['/main.js'],
});
await mkdir('dist', { recursive: true });
await writeFile('dist/blue-sneakers.html', prelude);
await writeFile('dist/blue-sneakers.json', JSON.stringify(postponed));
```

The server script handles incoming visitor requests:

```jsx title="server.js"
import { readFile } from 'node:fs/promises';
import { resume } from 'react-dom/server';
import App from './src/App.jsx';

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

The client entry file executes in the browser:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

~hydrateRoot~(document, <App />); // 3. In the browser: Add to cart answers a tap
```

### The Order in Which Each Part of the Page Is Made

The product heading, the cart count, and the event handlers reach Alice at distinct moments in time, with React invoking components across three distinct phases:

```tree dir=right caption="When React calls App and CartLine in the resumed product page, and what each call makes."
How the resumed product page reaches Alice
- +1. Build time: `prerender` [`App` `CartLine`] | React calls `App`, and **`CartLine` suspends** | The file holds **`Blue Sneakers`** and **`Loading cart...`**
- +2. Request time: `resume` [`App` `CartLine`] | React calls `App` again from the root and **reaches `CartLine`** for Alice | The stream fills in **`Cart: 2`**
- +3. In the browser: `hydrateRoot` [`App` `CartLine`] | React calls both again and **reuses the HTML** | **`Add to cart`** answers a tap
```

### The Five Ways Side by Side

| The way | Where and when the HTML is made | One piece or parts | The React call | `main.jsx` | What Alice sees first | Fits |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Client-side rendering** | In the browser, after the JavaScript runs | Only an empty root is sent: the browser makes the rest | `createRoot` | `createRoot` | A blank page | A screen behind a login |
| **Server-side rendering** | On the server, at each request | One piece | `renderToString` | `hydrateRoot` on `#root` | The heading and `Loading cart...`, or nothing until the cart is loaded | A server without streams |
| **Streaming server-side rendering** | On the server, at each request | Parts: the shell, then each `<Suspense>` part | `renderToReadableStream` | `hydrateRoot` on `document` | The heading and `Loading cart...`, then `Cart: 2` | Content per request, with slow data |
| **Static prerendering** | At build time, once | One file, with all data waited for | `prerender` | `hydrateRoot` on `document` | The whole file at once, the same for everyone | A landing page, a blog, documentation |
| **Resuming** | The shared part at build time, the visitor's part at request time | Parts: the `prelude`, then the stream from `resume` | `prerender` with a `signal`, then `resume` | `hydrateRoot` on `document` | The heading from the file, then `Cart: 2` | A page mostly the same for everyone, with a small part per visitor |

Modern applications often combine these architectures across different routes. React documentation notes that an application landing page benefits from static pre-rendering, while a dynamic content feed performs best with server-side rendering. Private screens behind authentication can remain client-side rendered.

Keep the core governing rule of this lesson in mind: **a part that is the same for everyone can be made in advance. A part that belongs to one visitor can only be made when that visitor request arrives.**

---

## For the Interview

> **The Interview Question:** How do CSR, SSR, streaming SSR, static prerendering, and resuming differ?

### How to Answer Clearly in 30 Seconds

"All five strategies answer two questions: where and when the HTML is generated, and whether it arrives all at once or in progressive parts.
1. **Client-side rendering** creates HTML inside the browser using `createRoot`, leaving users on a blank screen until JavaScript executes.
2. **Server-side rendering** creates HTML on the server upon each request in a single string. The synchronous `renderToString` function does not await asynchronous data, sending suspended components as their fallback placeholders.
3. **Streaming server-side rendering** with `renderToReadableStream` flushes the layout shell immediately, streaming suspended components later down the open connection. Small inline scripts swap content into place before client React loads.
4. **Static prerendering** with `prerender` generates HTML once during the build step, awaiting all data dependencies to produce identical files for all visitors.
5. **Resuming** halts `prerender` early to emit a static shell and a `postponed` state, allowing the server at request time to stream personalized content using `resume`.

Every architecture that transmits server HTML ends with `hydrateRoot` in the browser. Production applications select strategies per route, balancing Time to First Byte, First Contentful Paint, and Largest Contentful Paint."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does resuming replace hydration?"**
   **No.** The `resume` function belongs to `react-dom/server`. It runs on the backend server to continue a paused prerender and stream missing HTML chunks for a specific visitor. The client browser must still download the client bundle and execute `hydrateRoot` before buttons become interactive. Official React resume examples feature buttons indicating that interactivity requires hydration. Resuming alters when HTML markup is produced, not how client interactivity attaches.
2. **"Can a statically prerendered page answer clicks?"**
   **Yes.** A static page is React HTML pre-compiled ahead of time, not an application devoid of React. The `prerender` call accepts `bootstrapScripts`, causing React to inject bundle script tags into the file. In the browser, client scripts execute `hydrateRoot` to attach event listeners. What a static file cannot do is store personalized data for an individual visitor, because no visitor session exists during the build phase. MDN reminds us that for any given static URL, all users receive identical content.
3. **"Why does the same `<Suspense>` boundary show `Loading cart...` with `renderToString` and `Cart: 2` with `renderToReadableStream`?"**
   Because `renderToString` produces a single synchronous string in one pass. When a component suspends, it immediately writes the fallback markup into the string and terminates, leaving resolved content to client scripts. In contrast, `renderToReadableStream` keeps the response stream open. It transmits the shell with the fallback immediately. Then it streams the resolved component markup alongside a small inline script that swaps it into place before client React loads. React documentation recommends streaming over `renderToString` whenever the hosting environment permits.

```tree caption="Interview comparison: the five ways of making a page, by the moment the HTML is made."
When the HTML of the product page is made
- !In the browser [`createRoot`] | Client-side rendering | A **blank page** until the JavaScript runs
- +At each request [`renderToString` `renderToReadableStream`] | Server-side rendering, **in one piece or streamed** | The heading at once; the cart **as its fallback** or **streamed in**
- +At build time [`prerender`] | Static prerendering | **One file for everyone**, with no visitor's data
- +Build time, then request time [`prerender` `resume`] | Resuming | The heading **from the file**, the cart **for each visitor**
```
