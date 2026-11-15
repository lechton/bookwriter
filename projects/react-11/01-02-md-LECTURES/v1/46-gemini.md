# Lecture 46: How to Choose Between a Framework and a Build Tool

*(Why does a shared link to a React page show the wrong title, and who decides what that link shows?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you choose between a full-stack framework and a standalone build tool?

---

## VS | A Build Tool `Vite` vs. a Full-Stack Framework `Next.js`: both run React, only the framework decides what the first HTML file holds

> When you open a web page, the server sends one HTML file, and then the browser runs the JavaScript inside it. **With Vite alone, that file holds one empty element, and the page appears only after the JavaScript runs.** A full-stack framework such as Next.js can put the content into the file itself, so a chat app or a slow phone sees it at once.


In Lesson 07, running the setup command produced an `index.html` file with a single empty container element: `<div id="root"></div>`. Then `main.jsx` invoked `createRoot` to mount React and fill that container in the browser. Every application built in earlier lessons followed this exact pattern: the web server delivers an empty HTML shell, and client-side JavaScript constructs the user interface afterwards.

During local development on a fast machine, this client-only approach feels instant. But **React is a view library that renders components, and that is its sole core responsibility**. The official documentation states this plainly: React lets you combine components, but it never dictates how to handle routing or fetch data. Therefore, every production React application must answer three architectural questions that React intentionally leaves open:
1. **What does the initial HTML document contain?** Does the server send an empty container element, or does it deliver pre-rendered HTML with content already inside?
2. **Which URL displays which page?** When a user visits a product page or an about page, what mechanism matches that address to a component tree? This system is called routing.
3. **When does external data load?** Does the application fetch data only after the component renders in the browser, or does data loading start beforehand?

A **full-stack framework** provides built-in answers to all three questions. Tools like Next.js and React Router version 7 handle page routing, data loading, and server rendering out of the box. The term full-stack means the framework can execute your code on a web server or during a build step, rather than running solely inside the user's browser. In contrast, a **build tool** such as Vite provides no built-in answers to these three architecture questions. It compiles code and runs a development server, leaving routing, data loading, and initial HTML rendering entirely to your team.

The distinction between a library and a framework comes down to architectural control. With a library like React, your own code remains in control. You import React to render UI, and you decide how to organize routing, state, and networking. With a framework, the framework controls the architecture and page lifecycle. It dictates file conventions, manages URLs, triggers data loading, and invokes your components at the proper moment. React supplies the component model, while a framework coordinates the system around it.

**Why this difference matters:** Inside your browser, an e-commerce store built with Vite and the same store built with Next.js can look identical once loaded. The critical difference lies in the raw HTML document that the web server first transmits across the network. A developer rarely inspects that raw incoming file, but external tools do. Chat applications, social media platforms, and search engine crawlers examine only that raw document to extract titles, descriptions, and preview images. Similarly, a mobile user on a slow wireless network stares at that raw HTML document during the seconds it takes for the JavaScript bundle to download and execute.

Keep this fundamental truth in mind throughout this lesson: **React renders UI components, while a framework coordinates how pages load, route, and reach the user. A standalone build tool leaves all of those decisions to your own application code.**

### The File Behind the Page

Here is a product page in an online shop. It shows one name, `Blue Sneakers`, and one price, `$49`:

```page caption="The product page of the shop, open in the developer's browser."
heading: Blue Sneakers
line: $49
```

A user copies the link of this page and pastes it into a chat app, to send it to a friend. Two things go wrong:
1. The chat app shows a preview card under the link, and the card says `Shop`. That is the title of every page of the shop. The name `Blue Sneakers` is missing.
2. The friend opens the link on a phone with a slow connection. The page stays blank, then shows `Loading...`, and only then shows `Blue Sneakers`.

```page caption="The preview card the chat app shows for the pasted link: the shop title, and no product name."
url: chat.example.com
section: Chat
line: shop.example.com
card: title=Shop | bad
```

::: row caption="What the friend sees on a slow phone: a blank page, then Loading..., then the product."
::: col title="1. While the JavaScript downloads" tone=bad
```page size=mini
url: shop.example.com
blank
```
:::
::: col title="2. While the product data loads" tone=bad
```page size=mini
url: shop.example.com
line: Loading...
```
:::
::: col title="3. At last" tone=good
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: $49
```
:::
:::

Why did both problems happen? The chat app and the phone did not start from the interactive page you see in your browser. They started from the raw HTML file delivered by the server. In an application built with Vite alone, that file contains only an empty root element:

```html title="The file the server sends vs. the page after the JavaScript runs in the browser"
~<div id="root"></div>~ <!-- 1. The file the server sends: the root is empty -->
~<div id="root"><h1>Blue Sneakers</h1><p>$49</p></div>~ <!-- 2. The page after the browser has loaded and run the JavaScript -->
```

The chat app never executes your JavaScript code, so it never discovers the product. The slow mobile phone does run the code, but only after enduring a lengthy download over a congested network.

> [!DEFINITION]
> **What is a crawler?** [NEW] A crawler is an automated program that fetches web pages over HTTP to index content or generate link previews.
> 1. When a user pastes a link into Slack, Discord, or iMessage, the chat service dispatches a lightweight crawler to request the page's HTML over the network.
> 2. The crawler inspects standard metadata elements like the `<title>` tag and Open Graph `<meta>` tags to construct a preview card.
> 3. Unlike modern desktop browsers, social media crawlers do not execute JavaScript bundles because running a headless browser on every shared URL is too slow and resource-intensive.
> 
> Because social media crawlers only read the raw HTML delivered by the server, any page rendered purely with client-side JavaScript appears empty to them (Lesson 46).

**It may look the same, or work the same at first, but it is NOT the same thing!** Build this shop twice, once with Vite alone and once with a framework. In your browser, the two product pages look identical. The file that leaves the server is completely different:
- **With Vite alone**, the root container in that file is empty. JavaScript injects the product later, after running in the browser.
- **With a framework that renders on the server or at build time**, the file already holds `Blue Sneakers` before any JavaScript runs.

```tree caption="React draws the components; a framework or our own code decides how the page reaches the user."
Who answers each question in a React app
- +React, a library [`<Product />`] | Puts **components together** and draws them | Does **not** decide routing, data loading, or the first HTML
- +A full-stack framework [`Next.js` `React Router`] | Decides **the first HTML**, **the URL of each page**, and **when data loads** | We follow its way of building pages
- !A build tool alone [`Vite`] | Prepares our files for the browser | Leaves **all three questions** to our own code
```

### The Rule of Thumb: does any page need to work before the JavaScript runs?

**Ask two questions about every new app. Must any page show its content before the JavaScript runs? Does any page need its own URL that people share or bookmark? If either answer is yes, start with a framework. If both answers are no, Vite alone is enough.**

The official documentation gives a concise guideline: if your app needs routing, you would probably benefit from a framework.

This architectural decision directly impacts the user experience in three concrete ways:
1. **The shared link shows the wrong title**, because external crawlers read only the raw HTML file.
2. **The user waits twice**, first for the JavaScript bundle and then for the product data request.
3. **A link to one product opens the home page**, when the app keeps the active page in component state instead of in the URL.

Three widespread misconceptions frequently mislead developers:
1. **"A framework always needs a server."** The official documentation clarifies: full-stack frameworks do not require a server. Frameworks can pre-render static HTML at build time and deploy to a static host.
2. **"Server rendering is only for search engines."** The documentation notes: a common misunderstanding is that server rendering is only for search engine optimization. Pre-rendered HTML also lets human users read content immediately before the JavaScript bundle finishes downloading.
3. **"A new app starts with Create React App."** The React team has officially deprecated Create React App.

### The Ways to Start a React App

The official documentation outlines the modern ways to create a React application:
1. **A full-stack framework.** The React team recommends this route for any new application or public website: Next.js with its App Router, React Router version 7, or Expo for cross-platform mobile apps.
2. **A build tool, from scratch.** Vite, Parcel, or Rsbuild. This approach fits when your app has specialized constraints not addressed by existing frameworks, when building a custom framework, or when learning React fundamentals.
3. **A build tool for React in part of an existing page.** Consider a server-rendered backend application such as Ruby on Rails or Django. The rest of the site already functions, and React manages a single interactive widget on the page.
4. **Not a valid choice: Create React App.** The React documentation gives an unequivocal answer: Create React App has been deprecated.

```text title="Terminal: the commands react.dev gives for each way"
npx create-next-app@latest
npx create-react-router@latest
npx create-expo-app@latest
npm create vite@latest my-app -- --template react-ts
npm install --save-dev parcel
npx create-rsbuild --template react
```

```tree caption="The ways to start a React app today, and the one way that is no longer a choice."
How to start a new React app
- +A full-stack framework [`npx create-next-app@latest` `npx create-react-router@latest` `npx create-expo-app@latest`] | react.dev's choice for **a new app or website** | Decides **the first HTML, the URLs, and the data loading**
- +A build tool from scratch [`npm create vite@latest`] | Fits a **client-only app**, a team that **builds its own framework**, or **learning** | Every other decision is **ours**
- +A build tool in part of an existing page [`Vite`] | Fits a site that **already exists** in another technology | React takes over **one element** of that page
- !Create React App [`npx create-react-app`] | ~Do **NOT** start a new app with it | react.dev **deprecated** it on February 14, 2025
```

## SECTION | A Product Page for Blue Sneakers, Made with Vite Alone

Our store is a lightweight Vite application, assembled using the client-side approach from earlier lessons. Each principle examines one part of this implementation and contrasts it with how a framework handles the same requirement.

```files title="shop: File Explorer" caption="The files of our shop made with Vite alone."
index.html | entry | The one HTML page, with `<title>Shop</title>` and the empty root div
src/
  main.jsx | boundary | Imports `App` and mounts it into `#root`, as in Lesson 07
  App.jsx | page | Exports `App` as default: the product page
  api.js | stand-in server | Exports `getProduct`, which waits one second and gives the product
```

Because this demonstration lacks a live backend database, a simulated asynchronous function stands in for the server. The `getProduct` function delays for one second before resolving with product data:

```js title="src/api.js"
export function ~getProduct~() { // Our stand-in server: answers after one second
  return new Promise(resolve => {
    setTimeout(() => resolve({ name: 'Blue Sneakers', price: 49 }), 1000);
  });
}
```

Here is the single HTML page of the application. Its document title is hardcoded to `Shop`, and its root container is completely empty:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>~Shop~</title> <!-- The one title of the whole shop -->
  </head>
  <body>
    ~<div id="root"></div>~ <!-- Empty: no product anywhere in this file -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

The component fetches product data inside a side effect and renders a loading placeholder until the network request completes (Lesson 33):

```jsx title="src/App.jsx"
import { useState, useEffect } from 'react';
import { getProduct } from './api.js';

export default function App() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    ~getProduct().then(setProduct)~; // Starts after the first render
  }, []);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      ~<h1>{product.name}</h1>~ {/* Blue Sneakers, one second after the first render */}
      <p>${product.price}</p>
    </>
  );
}
```

When a developer opens this page locally, the browser displays `Loading...` briefly, followed one second later by the product details:

::: row caption="The product page made with Vite alone, in the developer's browser."
::: col title="First render"
```page size=mini
line: Loading...
```
:::
::: col title="One second later" tone=good
```page size=mini
heading: Blue Sneakers
line: $49
```
:::
:::

The code functions in the local browser. Now observe the hidden architectural costs across six foundational principles.

**PRINCIPLES:** A framework and a build tool both run React. They differ in what they decide for you. Six principles follow:
1. **Principle 1: A Build Tool Prepares Your Files, and Nothing Else.** Vite turns JSX into JavaScript, packs a bundle, runs a development server, and makes the production files.
2. **Principle 2: The First HTML Holds Only an Empty Root.** With Vite alone, the file the server sends holds no product, so a crawler finds nothing and a slow phone shows a blank page.
3. **Principle 3: A Page Kept in State Has No URL of Its Own.** A click works, but a shared link always opens the first page. A router gives each page its own URL.
4. **Principle 4: A Loader Starts the Fetch Before the Page Renders.** An Effect waits for the bundle and the first render. A loader starts the fetch while the code is still downloading.
5. **Principle 5: A Framework Can Put the Product into the HTML.** It does this on the server or at build time, for each page, and it does not need a server.
6. **Principle 6: An Admin Tool Behind a Login Can Stay on Vite.** When no page needs its content in the HTML or its own URL, a build tool is enough.

---

## PRINCIPLE | `npm create vite`: a build tool prepares your files, and nothing else

> [!PRINCIPLE]
> **Principle 1: Build Tool: Vite Prepares Your Files, and Leaves Routing, Data, and Server HTML to You**
>
> *A build tool such as Vite turns JSX into JavaScript, packs a bundle, runs a development server, and makes production files; it does nothing else for the app.*
>
> A build tool starts you off with a client-only single-page app. It never decides which URL shows which page, when the data loads, or what the first HTML file holds. Create React App once did the same job, but react.dev deprecated it, so a new app starts with a framework or with Vite, Parcel, or Rsbuild.
>
> **DO THIS:**
> ```text
> npm create vite@latest my-app -- --template react-ts
> ```
>
> **DO NOT DO THIS:**
> ```text
> npx create-react-app my-app
> ```

Here is the standard command recommended in the React documentation to scaffold a project with Vite:

```text title="Terminal: starting a React app with Vite"
npm create vite@latest my-app -- --template react-ts
```

This command generates a new project directory and populates it with starter configuration files. Specifying the `react-ts` template configures React with TypeScript support. Omitting TypeScript and using the `react` template produces standard JavaScript JSX files, identical to our store example.

Inside this project folder, two primary npm scripts govern the development workflow (Lessons 07 and 15):

```text title="Terminal: the two daily commands"
npm run dev
npm run build
```

1. Running `npm run dev` launches a local development server with instant Hot Module Replacement as you edit source files.
2. Running `npm run build` bundles, optimizes, and compiles static production assets into a distribution folder.

The official documentation refers to this path as building a React app from scratch. That phrase might suggest advanced custom configuration. In reality, **it describes the exact project structure introduced in Lesson 07:** an `index.html` entry, a `main.jsx` mount point, and Vite. Nothing extra is included.

> [!DEFINITION]
> **What is a build tool?** [NEW] A build tool is a software utility that transforms, packages, and serves front-end source code.
> 1. It transpiles modern JSX and TypeScript syntax into standard JavaScript that browser engines can execute.
> 2. It resolves module dependencies, bundles assets, and optimizes code size for production deployment.
> 3. It hosts a local development server with Fast Refresh, updating modules in memory without triggering full browser reloads.
> 
> Popular modern build tools include Vite, Parcel, and Rsbuild. For React Native applications, the corresponding bundler is Metro (Lesson 46).

A build tool performs four specific technical tasks:
1. It compiles JSX tags into standard JavaScript function calls.
2. It bundles modular files into optimized script assets.
3. It serves files locally during development.
4. It outputs minified production bundles when running a build command.

That covers the entire scope of a build tool. The React documentation notes that build tools produce a client-only single-page application. Both technical terms carry specific architectural consequences:
- **Single-page app:** the browser requests and loads one solitary HTML document. Client-side JavaScript updates what that document displays as the user interacts with the interface.
- **Client-only:** the user's browser executes all rendering logic. The web server merely hosts static files and performs no rendering work.

Features such as client-side routing, coordinated data fetching, and server HTML generation are absent from build tools. If your project requires those features, your team must assemble and maintain them.

```tree caption="What a build tool such as Vite does for us, and what it leaves to our own code."
What `npm create vite@latest` gives a React app
- +What Vite does [`npm run dev` `npm run build`] | Turns **JSX into JavaScript** and packs a **bundle** | Runs a **development server** and makes the **production files**
- !What Vite leaves to us | **Routing**: which URL shows which page | **Data fetching** and **rendering on the server** are ours to add
```

### VS | `npm create vite` vs. `npx create-react-app`: both give a working page, only one is still maintained

Legacy tutorials frequently instruct newcomers to run an outdated setup command:

```text title="Terminal: the command of older tutorials"
npx create-react-app my-app
```

Both commands appear to deliver the same outcome at first glance: a functional local project supporting JSX, CSS, and a development server. **It may look the same, or work the same at first, but it is NOT the same thing!** The React team has officially deprecated Create React App. The documentation no longer endorses it for new projects, keeping it in maintenance mode strictly so historical codebases continue running.

Executing the command now triggers an explicit terminal warning:

```text title="Terminal: running npx create-react-app"
create-react-app is deprecated.

You can find a list of up-to-date React frameworks on react.dev
For more info see:https://react.dev/link/cra

This error message will only be shown once per install.
```

Developers who disregard this warning construct their new application on an obsolete build tool that receives no active feature updates. The React team's recommendation is clear: choose a modern full-stack framework, or select an active build tool like Vite, Parcel, or Rsbuild.

When introduced in 2016, Create React App solved a real problem by packaging Babel, Webpack, and ESLint into a single managed dependency. Today, modern build tools and full-stack frameworks solve these challenges with far superior performance, leading to the official deprecation on February 14, 2025.

---

## PRINCIPLE | `<div id="root"></div>`: with Vite alone, the first HTML file holds no content

> [!PRINCIPLE]
> **Principle 2: Client-Side Rendering: The First HTML Holds Only an Empty Root**
>
> *In a client-only app, the HTML file the server sends holds only `<div id="root"></div>`; the content exists only after the JavaScript loads and runs.*
>
> The developer's browser runs the JavaScript, so the page looks complete. A chat app's crawler usually does not run it, so its preview card shows only the title of `index.html`. A user on a slow phone sees a blank page while the bundle downloads. When a page must show its content before the JavaScript runs, its HTML must be made on the server or at build time.
>
> **DO THIS:**
> ```html
> <div id="root">~<h1>Blue Sneakers</h1>~<p>$49</p></div> <!-- Made on the server or at build time: a crawler reads the product -->
> ```
>
> **DO NOT DO THIS:**
> ```html
> ~<div id="root"></div>~ <!-- **WRONG:** for a public product page: the crawler finds no product, and the preview card says Shop -->
> ```

**Beware: when using Vite alone, the HTML file delivered by the server never contains your component output.** The live page rendered on your monitor and the raw HTML text sent across the network are two separate entities.

### VS | The Elements panel vs. View Page Source: the page right now vs. the file the server sent

When an engineer inspects the page using browser developer tools, the product heading and price appear directly inside the root element:

```dom caption="The Elements panel after the JavaScript has run: the product sits inside the root."
<div id="root">
+ <h1>Blue Sneakers</h1> | note: Added by JavaScript in the browser
+ <p>$49</p> | note: Added by JavaScript in the browser
</div>
```

This live DOM tree explains why developers easily overlook client-rendering limitations. The Elements tab reflects the current state of the in-memory DOM after client JavaScript has run. It does not represent what originally arrived over the HTTP connection. To inspect the actual payload sent by the server, right-click the page and select View Page Source. The source view reveals an empty root tag, completely devoid of product markup.

External scrapers and crawlers inspect only that raw initial source payload.

### What the chat app receives

**The shared preview card displays the generic text `Shop` because the chat service crawler never executes client JavaScript.** Here is the sequence of events when a link is shared:
1. The chat crawler issues an HTTP GET request for the product URL.
2. The crawler receives the raw HTML document and stops, executing no client scripts.
3. In that raw document, the `<title>` tag contains only `Shop`, while the root container is empty.
4. Consequently, the preview card displays `Shop`. It shows that identical fallback title for every product link, because a single-page app serves the exact same `index.html` across all routes.

Building the project with `npm run build` does not alter this reality. The build command compiles JavaScript and injects an optimized script tag into `index.html`, but the markup remains empty:

```html title="The file the server sends after npm run build, shortened"
<title>~Shop~</title> <!-- The same title for every product -->
<div ~id="root"~></div> <!-- Still empty: Blue Sneakers is not in the file -->
```

Major web search engines operate sophisticated web crawlers that can parse JavaScript after a queuing delay. However, social media crawlers and chat applications avoid the computational overhead of running JavaScript engines, reading only raw HTML.

> [!DEFINITION]
> **What is client-side rendering?** [NEW] Client-side rendering, or CSR, is an architectural pattern where the browser downloads a minimal HTML shell and uses JavaScript to construct the DOM dynamically.
> 1. The web server delivers an HTML file containing little more than `<div id="root"></div>` and a link to a JavaScript bundle.
> 2. The client browser parses and executes the JavaScript code, which runs React components and renders HTML elements into the DOM tree.
> 3. While this approach enables dynamic interactions once loaded, initial page displays remain blank until client script execution finishes (Lesson 46).

### What the friend's slow phone shows

**On a slow connection, the visitor experiences two consecutive delays: first for the script bundle, then for the product data.** Here is the loading sequence on a mobile device:
1. The browser displays a blank white screen while downloading and parsing the JavaScript bundle. The official documentation confirms that users see a blank page until the application JavaScript code loads and runs.
2. React initializes, mounts the component tree, and renders `Loading...`. Only then does the side effect dispatch the API call.
3. Once the network request finishes, `Blue Sneakers` finally renders on screen.

On a high-speed fiber connection, this script download completes in milliseconds, making the initial white flash imperceptible. On a congested cellular network, that blank screen represents an annoying delay for the user.

### Why this bug ships

Teams routinely launch public web applications with this defect without realizing it:
1. The team starts a public store using Vite alone because setup is fast and simple.
2. Every feature renders seamlessly on high-powered development workstations.
3. Weeks later, marketing distributes product URLs, only to discover that every link card across social channels shows the identical shop title.
4. Investigation reveals that every URL serves the identical empty HTML container.
5. Resolving the problem requires pre-rendering HTML on the server or during the build. Teams building from scratch must engineer this complex infrastructure themselves.

The React documentation offers a direct solution: pre-render the initial HTML from components on the server or during a build step. The documentation explicitly advises adopting a framework that handles this generation automatically. Principle 5 explores this implementation.

Client-side rendering offers legitimate advantages. Once the initial bundle loads, navigating between internal views is instantaneous and requires no subsequent page refreshes. The trade-off is an empty initial document.

```tree dir=right caption="The same product page, seen by the developer's browser and by the chat app's crawler."
Who sees `Blue Sneakers` on the page made with Vite alone
- +The developer's browser [`App.jsx`] | Downloads the file **and runs the JavaScript** | Shows **Blue Sneakers** one second after **Loading...**
- !The chat app's crawler [`index.html`] | Downloads the file and **does not run the JavaScript** | Finds only the title **Shop** and an **empty root**
```

Remember: React is solely responsible for rendering components. The contents of the initial HTML document are determined either by a framework, or by nobody.

---

## PRINCIPLE | `useState` for the current page: every page shares one URL

> [!PRINCIPLE]
> **Principle 3: Routing: A Page Kept in State Has No URL of Its Own**
>
> *Give every page that a user can share or bookmark its own URL with a router; `useState` can switch what is shown, but it creates no URL.*
>
> When the app picks its page with `useState`, the click changes state and the address bar stays the same. A friend who opens the shared link starts the app from the first state again and sees the home page. A router ties each URL to a page, so `/products/1` always opens the sneakers. Once an app needs routing, react.dev suggests a framework.
>
> **DO THIS:**
> ```jsx
> const router = createBrowserRouter([
>   { path: '/', element: <Home /> },
>   { ~path: '/products/1'~, element: <Product /> }, // A shared link opens the product
> ]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [route, setRoute] = ~useState('home')~; // **WRONG:** for pages users share: every link opens the home page
> ```

Our store now introduces a landing page. It displays the store heading and a navigation button for `Blue Sneakers`. Clicking that button displays the product, prompting the user to copy the URL from the browser address bar.

```page caption="The home page of the shop, at the shop's address: one product to click."
url: shop.example.com
heading: Shop
line: [Blue Sneakers]
```

Here is a vital architectural reality: React component state exists exclusively inside the ephemeral memory heap of a single open browser tab. Refreshing the tab or opening the URL in a new window destroys that state. **The URL string in the address bar is the only piece of navigation state that travels inside a shared link.**

### VS | `useState` vs. a router: both show the product after a click, only the router changes the address

Developers can transition between views using two distinct approaches:

```jsx title="With useState: a state variable picks the page"
const [~route~, setRoute] = useState('home'); // The current page lives in state

{route === 'home' && <Home />}
{route === 'product' && <Product />}
```

```jsx title="With a router: each page has its own URL"
const router = createBrowserRouter([
  { ~path: '/'~, element: <Home /> }, // The home page lives at /
  { ~path: '/products/1'~, element: <Product /> }, // The product page lives at /products/1
]);
```

**It may look the same, or work the same at first, but it is NOT the same thing!** In both implementations, clicking the button presents the product component on screen. But only the router synchronizes that view with the browser address bar. The official React documentation highlights this in a code example comment: storing current views in component state does not generate URLs.

> [!DEFINITION]
> **What are routing, a router, and a route?** [NEW] Routing is the system that coordinates browser URLs with application views.
> 1. Routing is the architectural process that determines what visual content to render when a visitor navigates to a specific URL path.
> 2. A router is a dedicated software library that listens to browser navigation events and renders the matching component tree.
> 3. A route is a single configuration rule that binds an explicit path, like `/products/1`, to a corresponding component, like `<Product />` (Lesson 46).

### The shop with the page kept in `useState`

To build this with basic state, the product logic moves into a standalone file named `Product.jsx`. Its implementation remains unchanged. A companion `Home.jsx` renders the shop title and a button:

```jsx title="src/Home.jsx"
export default function Home({ onOpen }) {
  return (
    <>
      <h1>Shop</h1>
      <button ~onClick={onOpen}~>Blue Sneakers</button> {/* Calls the function App passed in */}
    </>
  );
}
```

The parent component retains the active view in a state variable and conditionally renders one component at a time (Lessons 10 and 12):

```jsx title="src/App.jsx"
import { useState } from 'react';
import Home from './Home.jsx';
import Product from './Product.jsx';

export default function App() {
  const [route, setRoute] = useState(~'home'~); // Every visit starts on the home page

  return (
    <>
      {route === 'home' && <Home onOpen={() => ~setRoute('product')~} />} {/* Changes state, not the URL */}
      {route === 'product' && <Product />}
    </>
  );
}
```

```files title="shop: File Explorer" caption="The shop gains a home page and moves the product page into its own file."
index.html | entry | The one HTML page, with `<title>Shop</title>` and the empty root div
src/
  main.jsx | boundary | Imports `App` and mounts it into `#root`
  App.jsx | parent | Keeps the current page in `route` and shows `Home` or `Product`
  Home.jsx | page | Shows the shop title and one button for `Blue Sneakers`
  Product.jsx | page | The product page of the example, now named `Product`
  api.js | stand-in server | Exports `getProduct`
```

### What the friend receives

**Button interactions succeed locally, but shared links fail to preserve navigation context.** The initial user views the sneaker details, but their friend lands on the storefront:
1. The user visits shop.example.com and clicks the `Blue Sneakers` button.
2. The `setRoute('product')` updater executes, and React renders the product screen.
3. The browser address bar remains parked at the root domain: shop.example.com. No code updated the URL.
4. The user copies the address bar text and sends it to a friend.
5. The friend opens the link, initializing the application with `useState('home')`, which renders the storefront.

::: row caption="The user's screen one second after the click: the same product page, with and without its own URL."
::: col title="With `useState`" tag="the address stays the same" tone=bad
```page size=mini
url: shop.example.com
heading: Blue Sneakers
line: $49
```
:::
::: col title="With a router" tag="the product has its own address" tone=good
```page size=mini
url: shop.example.com/products/1
heading: Blue Sneakers
line: $49
```
:::
:::

```page caption="What the friend sees after opening the link from the version with useState: the home page, not the product."
url: shop.example.com
heading: Shop
line: [Blue Sneakers]
```

Browser bookmarks break under the identical failure mode. If a customer bookmarks the product page and revisits it tomorrow, the application boots up from initial state, once again presenting the storefront.

### The same shop with a router

A client-side routing library maps distinct application screens to unique URLs. React Router and TanStack Router are two options suggested in the official documentation for build tool setups. They install via npm as separate packages:

```jsx title="src/App.jsx with a router"
import { ~createBrowserRouter~, RouterProvider } from 'react-router'; // Builds the list of routes, one per URL
import Home from './Home.jsx';
import Product from './Product.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { ~path: '/products/1'~, element: <Product /> }, // The product has its own address
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

With this architecture, the parent component no longer manages custom navigation callbacks. In the home component, the button transforms into a router link component. This link updates the browser address bar via the History API without triggering a full-page reload.

Clicking the link changes the browser URL to shop.example.com/products/1. When a friend visits that shared link, the router inspects the URL path, matches the product route configuration, and renders the sneakers immediately.

```tree caption="Switching pages with useState vs. with a router: both show the product after a click, only one gives it a URL."
How the shop switches to the product page
- !With `useState` [`route` `setRoute`] | The click changes **state**; the address bar **stays the same** | A shared link or a bookmark opens **the home page**
- +With a router [`createBrowserRouter` `path`] | The click changes the **URL** to **/products/1** | A shared link or a bookmark opens **the product page**
```

### Why a router pulls in a framework

In production environments, adopting a router naturally introduces further architectural demands:
1. An engineer working in a Vite app introduces a secondary view using `useState` because component state is already familiar.
2. Local clicks function as expected, so the feature ships.
3. Users report that bookmarking or sharing links resets their position to the home screen.
4. The team installs a routing library to fix URL synchronization.
5. The router now requires integration with asynchronous data loading and dynamic code-splitting. The React documentation notes that modern routers naturally coordinate with data fetching and code-splitting strategies (Lesson 70).

At this juncture, the team is manually constructing the architecture of a custom framework. This progressive escalation is why the official documentation states: if your application needs routing, you will probably benefit from a framework.

---

## PRINCIPLE | `loader`: the fetch starts before the page renders

> [!PRINCIPLE]
> **Principle 4: Loader: The Router Starts the Fetch Before the Page Renders**
>
> *A fetch in an Effect starts only after the bundle has loaded and the page has rendered once; a framework's loader starts it before the route renders, in parallel with the code download.*
>
> With `useEffect`, the user waits for the HTML, then the bundle, then the first render with `Loading...`, and only then for the data. react.dev calls this chain a network waterfall. A framework's router calls `loader` before it renders the route and hands the result to the component as `loaderData`, so the component renders with the product already there.
>
> **DO THIS:**
> ```jsx
> export async function ~loader~() { // The router fetches before Product renders
>   return getProduct();
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   ~getProduct().then(setProduct)~; // **WRONG:** in a framework: waits for the bundle and the first render
> }, []);
> ```

Recall when React executes a component side effect: strictly after the component renders and commits to the DOM (Lesson 32). This execution timing introduces a major performance bottleneck. A component cannot render until its JavaScript bundle arrives. Consequently, data fetching placed inside an Effect must wait for the entire script bundle to download, parse, and execute, followed by an initial render displaying `Loading...`.

### VS | `useEffect` vs. `loader`: the same fetch, started at two different moments

Both patterns invoke the identical `getProduct` function and present the identical data. They differ fundamentally in when that network request begins:

```jsx title="With useEffect: the fetch starts after the first render"
useEffect(() => {
  ~getProduct().then(setProduct)~; // Waits for the bundle and the first render
}, []);
```

```jsx title="With loader: the fetch starts before the page renders"
export async function ~loader~() { // The router calls this before the page renders
  return getProduct();
}
```

**It may look the same, or work the same at first, but it is NOT the same thing!** While both strategies ultimately display `Blue Sneakers`, the loader approach reduces user waiting time because data fetching does not stall behind component rendering.

### Counting the waits with `useEffect`

**With `useEffect`, every step in the pipeline must finish before the next step can even begin.** Here is the timeline of events when a visitor arrives at the client-rendered product page:
1. The client browser downloads the empty HTML shell.
2. The browser discovers the script tag and downloads the JavaScript bundle.
3. React executes and renders `Product` for the first time, placing `Loading...` on screen.
4. Only after this initial paint does the Effect callback trigger `getProduct()`.
5. One full second later, the API promise resolves and the product details appear.

> [!DEFINITION]
> **What is a network waterfall?** [NEW] A network waterfall is a sequence of dependent requests where each network call is blocked from starting until the previous step completes.
> 1. In client-side component fetching, the browser waits for JavaScript to load and render before discovering what backend data the view requires.
> 2. As nested child components mount, they trigger their own nested Effects, compounding latency into sequential loading tiers.
> 3. The official documentation notes that network waterfalls occur when apps fetch data inside renders rather than in parallel as code downloads (Lesson 46).

On real-world web pages, waterfalls quickly compound. A parent product component finishes loading, which triggers a reviews component to mount, which initiates another fetch, subjecting visitors to successive loading flickers.

### The same page with a loader

A framework router provides an asynchronous loader mechanism: a function exported alongside the route component. The router invokes this function to retrieve required data before rendering the route. The React documentation explains that on initial load, the router can initiate data fetching immediately before rendering the route.

Here is the product route implemented using React Router in a full-stack configuration:

```jsx title="The product route in a framework"
import { getProduct } from './api.js';

export async function ~loader~() { // Runs before Product renders
  return getProduct();
}

export default function Product({ ~loaderData~ }) { // Holds { name: 'Blue Sneakers', price: 49 }
  return (
    <>
      <h1>{loaderData.name}</h1>
      <p>${loaderData.price}</p>
    </>
  );
}
```

Two identifiers here originate from the framework architecture rather than your own code:
- **`loader`:** your application never invokes this function directly. The router detects the exported function in the route module and runs it automatically prior to rendering `Product`.
- **`loaderData`:** your code never manually supplies this prop. The router passes the resolved loader value directly into `Product` (Lesson 08).

This exemplifies architectural inversion of control: the framework orchestrates data retrieval timing, leaving you responsible only for writing the loader query.

Observe what this eliminates: no local state hooks, no lifecycle Effects, and no placeholder loading checks. When `Product` renders, its required data is already present.

```tree dir=right caption="When the fetch starts: after the first render in an Effect, or before the render in a loader."
When `getProduct` starts on the friend's first visit
- !With `useEffect` [`useEffect` `setProduct`] | HTML, then bundle, then **Loading...**, then the fetch | **Each wait starts after the one before**: a network waterfall
- +With `loader` [`loader` `loaderData`] | The router starts the fetch **before the route renders** | The fetch runs **while the code is still downloading**
```

The React documentation reinforces this principle: fetching data inside components creates network waterfalls, whereas routing loaders fetch data in parallel as application code downloads.

### What a loader costs

Adopting route loaders introduces architectural considerations. The React documentation observes that configuring loaders trades initial structural complexity for runtime performance gains. Full-stack frameworks wire this behavior together automatically. In a standalone Vite setup, engineering teams must connect data loaders and routing primitives manually.

For codebases that continue fetching data on the client, the React documentation recommends using the framework's native fetching primitives. When operating without a framework, the documentation advises adopting established client-side caching libraries like TanStack Query, SWR, or RTK Query (Lesson 60).

---

## PRINCIPLE | SSR and SSG: the HTML file already holds the product, route by route

> [!PRINCIPLE]
> **Principle 5: Server Rendering: A Framework Can Put the Product into the HTML, Route by Route**
>
> *A framework can render a route on the server or at build time, so the file that leaves the server already holds the page's content; it chooses this per route, and it does not require a server.*
>
> With server-side rendering, the framework makes the HTML for every request. With static site generation, it makes the HTML once during the build, and a static host can send it with no server. Either way, a crawler finds the product in the file, and a user on a slow phone sees it before the JavaScript loads. A route that does not need this can stay client-only, as with Vite.
>
> **DO THIS:**
> ```html
> <body>~<h1>Blue Sneakers</h1>~<p>$49</p></body> <!-- Rendered by the framework: the product is in the file -->
> ```
>
> **DO NOT DO THIS:**
> ```html
> <body>~<div id="root"></div>~</body> <!-- **WRONG:** for a shared product page: the file holds no product -->
> ```

**A full-stack framework can deliver fully rendered markup directly inside the incoming HTML payload.** When this occurs, text and structure appear before client JavaScript executes.

### VS | The file with an empty root vs. the file with the product: the same page, only one can be read without JavaScript

Compare the meaningful payload delivered by the server across both architectures for the identical product route:

```html title="With Vite alone: the file the server sends, shortened"
<body>
  ~<div id="root"></div>~ <!-- Empty: JavaScript adds the product later -->
</body>
```

```html title="With a framework that renders on the server: the file the server sends, shortened"
<body>
  ~<h1>Blue Sneakers</h1>~ <!-- Already in the file before any JavaScript runs -->
  <p>$49</p>
</body>
```

Frameworks surround this markup with auxiliary container tags and script loaders, which are omitted here for clarity.

**It may look the same, or work the same at first, but it is NOT the same thing!** After client scripts finish loading, both applications render `Blue Sneakers` in a desktop browser. However, only the pre-rendered document displays content to automated crawlers and users waiting on congested mobile connections.

### Who made that HTML

Your client code did not construct that markup: the framework did. The framework executed your components with React alongside data resolved from `loader`, serializing the result into an HTML document. Frameworks can execute this rendering work at two distinct stages:

> [!DEFINITION]
> **What are SSR and SSG?** [NEW] Server-side rendering and static site generation are two strategies to pre-render React components into full HTML documents.
> 1. In Server-Side Rendering, or SSR, the framework renders the HTML dynamically on a web server for each incoming HTTP request. When a visitor navigates to a URL, the server executes the loader, renders the component, and returns a tailored document.
> 2. In Static Site Generation, or SSG, the framework renders the HTML once ahead of time during the production build. These pre-built HTML files deploy to a static file host or Content Delivery Network, requiring no live server computation during user visits (Lesson 46).

Both pre-rendering techniques yield an initial document holding real content. They differ in when that document is generated. The React documentation contrasts their application: static generation fits content that changes infrequently, like terms of service or documentation, while frequently updating feeds perform best with server rendering.

```tree caption="Three ways a framework can make a page, chosen for each route."
How a framework can make each route
- +Server-side rendering [`SSR`] | HTML made **on the server**, for **every request** | Fits a page whose data **changes often**, such as a content feed
- +Static site generation [`SSG`] | HTML made **once, at build time** | Fits a page that **rarely changes**, such as a Terms of Service page
- +In the browser only [`SPA`] | The file holds an **empty root**, as with Vite | Fits a page that **only signed-in users** open
```

Crucially, modern frameworks configure rendering strategies on a per-route basis rather than locking the entire project into one mode. The official documentation emphasizes that frameworks permit applying server-side rendering selectively where justified by use cases. A public store route can render on the server, while an internal settings panel remains purely client-rendered.

### What the chat app and the slow phone receive now

Migrating the store to a full-stack framework with a route loader transforms the user and crawler experience:
1. A user pastes the product link into a messaging application.
2. The platform crawler fetches the raw HTML file, which now contains `Blue Sneakers` directly in its markup.
3. The crawler reads the product title and description without executing client JavaScript. Supplying route metadata tags ensures the link card renders the proper title (Lesson 121).
4. A visitor on a weak cellular connection sees product text immediately, well before the script bundle completes downloading.
5. Interactive controls become responsive once client scripts execute. The React documentation notes that visitors can read server-rendered HTML while client code loads in the background.

This final transition has a specific technical name: **hydration** (Lesson 104). The initial markup from the server is static HTML. Once the JavaScript bundle loads, React traverses the existing DOM tree and attaches event listeners rather than recreating elements from scratch. In a framework setup, you rarely write `createRoot` manually, as the framework generates this bootstrap logic for you.

This immediate visibility explains why server rendering extends far beyond search engine optimization. Delivering a complete HTML document accelerates First Contentful Paint, the metric measuring when visible content first appears on the screen.

### A framework does not require a server

**Full-stack frameworks can run without an active server.** The React documentation explicitly confirms: full-stack frameworks do not require a server. Frameworks support client-only single-page applications and static site generation, deploying seamlessly to static hosting platforms or CDNs. Next.js, for instance, provides a static export option requiring no backend infrastructure.

This clarification resolves a common architectural trap:
1. A team planning an application assumes that choosing a framework mandates operating a Node.js server.
2. To avoid server maintenance overhead, the team defaults to Vite.
3. Months later, product requirements demand public pages with crawler-accessible metadata.
4. The team must now implement custom server rendering on top of Vite. The React documentation warns that configuring this manually can prove complex to build and sustain.

Modern frameworks eliminate this dilemma by allowing teams to start with a client-only deployment, preserving the option to adopt server features later without requiring an architectural rewrite.

Server rendering introduces its own trade-off. Generating pages on demand requires server computation, which can increase Time to First Byte. That metric measures how long the browser waits before receiving its first byte (Lesson 156).

---

## PRINCIPLE | Vite alone: an admin tool behind a login needs nothing more

> [!PRINCIPLE]
> **Principle 6: Choosing the Tool: A Client-Only App Behind a Login Can Stay on Vite**
>
> *Start a new app with a framework; choose a build tool when the app is client-only and will never need URLs per page or HTML with content, when React goes into part of an existing page, when the team wants to build its own framework, or when the goal is to learn.*
>
> The tool follows what the pages need. A public shop needs its products in the HTML and a URL for each page, which a framework gives. An internal admin tool opened only by signed-in staff needs neither, so Vite is enough. Picking Vite for a public site means building an ad hoc framework later, one problem at a time.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   return <h1>~Welcome to the Admin Tool!~</h1>; // Behind a login: Vite alone is enough
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   return <h1>~Blue Sneakers~</h1>; // **WRONG:** a public product page that users share, on Vite alone: its HTML file holds no product
> }
> ```

Not every application requires a full-stack framework. The React documentation specifically highlights internal administrative dashboards as ideal candidates for a standalone build tool. Only authenticated personnel access such tools, and their introductory screen welcomes signed-in users:

```jsx title="src/App.jsx: react.dev's admin tool"
export default function App() {
  return (
    <div>
      ~<h1>Welcome to the Admin Tool!</h1>~ {/* Seen only by signed-in staff, after the JavaScript runs */}
    </div>
  );
}
```

```page caption="The first page of the internal admin tool."
heading: Welcome to the Admin Tool!
```

### VS | The public shop vs. the internal admin tool: both run on Vite at first, only the shop pays for it

Both applications are React projects, and both execute without issues during initial development on Vite. They diverge in user access patterns and environmental requirements:
- **The public storefront:** visitors share URLs across social platforms, crawlers index listings, and shoppers browse on mobile devices. Every view requires unique shareable URLs and pre-rendered markup.
- **The internal admin dashboard:** authenticated employees access the tool on desktop workstations over fast corporate networks. No public crawlers index private screens, making an empty initial HTML container and a brief loading indicator entirely acceptable.

The selection criteria reduce to the two questions from our initial rule of thumb:
1. Must any screen display its content before client JavaScript executes?
2. Does the application require shareable URLs, coordinated data loaders, and automatic code-splitting?

When both requirements are absent, Vite provides a complete and lightweight solution.

```tree caption="The one difference between the public shop and the admin tool that decides the tool."
Which tool fits the app
- +The public shop [`Blue Sneakers`] | Links are **shared**, read by **crawlers**, opened on **slow phones** | Needs **URLs per page** and **HTML with content**: a **framework**
- +The internal admin tool [`Welcome to the Admin Tool!`] | Opened only by **signed-in staff**, after the JavaScript runs | Needs none of that: **Vite** is enough
```

### When react.dev says a build tool fits

The official React documentation outlines specific scenarios where starting with a standalone build tool fits. It fits applications with specialized requirements not met by existing frameworks. It also suits teams building a custom framework, or developers learning React fundamentals.

A fourth scenario involves integrating React into an existing multi-page backend like Ruby on Rails. In that setup, Vite compiles a specific React bundle, and `createRoot` mounts the component into a designated DOM container. If the entire application later transitions to React, the documentation advises evaluating a framework.

The documentation gives an explicit warning. Choose a standalone build tool only if you are comfortable solving these problems independently, or confident your project will never need these features.

### What Vite costs on a public site

Here is the common progression when using a build tool for a public product:
1. A developer initializes a public application with Vite because starter templates feel familiar.
2. As the product expands, requirements emerge for distinct URLs, dynamic metadata, and pre-fetching.
3. The engineering team adds a routing package, integrates caching libraries, configures code-splitting, and attempts custom server-side rendering.
4. These separate layers interact in complex ways. The React documentation notes that limitations encountered here prove challenging to resolve because each concern is deeply intertwined.

The documentation labels this outcome building an ad hoc framework. The engineering team ends up designing and maintaining a bespoke internal framework, diverting development effort away from core product features.

Frameworks carry their own trade-off. They introduce structural conventions regarding file organization and data retrieval patterns. For an internal administrative dashboard with simple needs, those conventions provide little value.

---

## All 6 Principles Together

### The complete shop made with Vite alone

Here is the complete storefront as built with Vite alone, coordinating navigation through component state:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>~Shop~</title> <!-- Principle 2: one title for every page, so the preview card shows Shop -->
  </head>
  <body>
    ~<div id="root"></div>~ <!-- Principle 2: empty until the JavaScript runs -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```jsx title="src/main.jsx"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

~createRoot(document.getElementById('root'))~.render(<App />); // Principle 1: fills the empty root in the browser
```

```js title="src/api.js"
export function ~getProduct~() { // Our stand-in server: answers after one second
  return new Promise(resolve => {
    setTimeout(() => resolve({ name: 'Blue Sneakers', price: 49 }), 1000);
  });
}
```

```jsx title="src/App.jsx"
import { useState } from 'react';
import Home from './Home.jsx';
import Product from './Product.jsx';

export default function App() {
  const [route, setRoute] = ~useState('home')~; // Principle 3: the page lives in state, so there is no URL per page

  return (
    <>
      {route === 'home' && <Home onOpen={() => setRoute('product')} />}
      {route === 'product' && <Product />}
    </>
  );
}
```

```jsx title="src/Home.jsx"
export default function Home({ onOpen }) {
  return (
    <>
      <h1>Shop</h1>
      <button ~onClick={onOpen}~>Blue Sneakers</button> {/* Principle 3: switches the page, not the URL */}
    </>
  );
}
```

```jsx title="src/Product.jsx"
import { useState, useEffect } from 'react';
import { getProduct } from './api.js';

export default function Product() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    ~getProduct().then(setProduct)~; // Principle 4: starts after the bundle and the first render
  }, []);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </>
  );
}
```

In a full-stack framework, this implementation simplifies into the route structure shown in Principle 4. The router executes `loader` before rendering, passing resolved data directly through `loaderData`. Furthermore, Principle 5 enables pre-rendering markup on the server or at build time, ensuring incoming HTML contains full content.

### What happens on the friend's first visit, in order

When a visitor navigates to a shared product link, the two architectural strategies execute their responsibilities in a completely different sequence:

```tree dir=right caption="The order of work on the first visit: the shop made with Vite alone vs. the shop made with a framework."
The friend opens the product link
- !With Vite alone [`index.html` `main.jsx` `App` `Home` `Product`] | 1. The server sends the file with an **empty root** | 2. The browser downloads the **bundle** | 3. React calls `App`, then `Home`: the link holds no product address, so the friend lands on **the home page** | 4. After a click, React calls `Product`, which shows **Loading...** | 5. The Effect calls `getProduct`, and one second later **Blue Sneakers** appears
- +With a framework rendering on the server [`loader` `Product`] | 1. The server calls `loader`, which calls `getProduct` | 2. The server renders `Product` with `loaderData` | 3. The server sends a file that **already holds Blue Sneakers** | 4. The browser downloads the bundle, and React **hydrates** the page | 5. The address bar shows **/products/1**
```

| Question | With a build tool such as Vite | With a full-stack framework |
| :--- | :--- | :--- |
| **What does the first HTML file hold?** | Only `<div id="root"></div>`; JavaScript adds the content in the browser | The finished page, made on the server or at build time, or an empty root where we choose |
| **Which URL shows which page?** | Our own code; `useState` creates no URL, so we add a router ourselves | The framework's router: each page has its own URL |
| **When does the data load?** | In an Effect, after the bundle and the first render | In a loader, before the route renders |
| **Does it need a server?** | No | No; it can also run client-only or as static files |
| **When does it fit?** | A client-only app such as an admin tool, React in part of an existing page, a team building its own framework, or learning | A new app or website, especially one that needs routing |
| **What does it cost?** | Every missing piece becomes part of our own ad hoc framework | Its rules about how to structure the app |

Remember the central thesis of this lesson: **React renders the components. A framework also decides how the page reaches the user: the initial HTML file, the URL of each page, and when data loading occurs. A standalone build tool leaves all three responsibilities to you.**

---

## For the Interview

> **The Interview Question:** How do you choose between a full-stack framework and a standalone build tool?

### How to Answer Clearly in 30 Seconds

"React is an interface library. It renders component trees, but it leaves routing, data loading, and initial HTML generation undecided. A build tool like Vite compiles JSX, bundles code, runs a local development server, and outputs static production files for a client-side single-page application. Because its initial HTML contains only an empty root container, social crawlers receive no preview content, and data fetching in Effects introduces sequential waterfalls. A full-stack framework like Next.js or React Router supplies file-based routing, parallel loaders, and server-side rendering or static generation per route without requiring a dedicated server runtime. For public websites or applications requiring shareable URLs, I choose a full-stack framework. The official guideline is clear: if an app needs routing, it benefits from a framework. I reserve standalone Vite setups for authenticated client-only dashboards, isolated components embedded in legacy backends, or exploratory learning. I never adopt Create React App for new work because it is officially deprecated."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Doesn't a framework force you to pay for and run a server?"**
   **No.** The official React documentation explicitly states that full-stack frameworks do not require a server. Modern frameworks support client-only single-page apps and static site generation, deploying directly to CDNs or static storage without an active Node.js server. Next.js supports static HTML exports, and React Router can output static bundles. Frameworks allow projects to launch client-only and selectively adopt server capabilities on individual routes later without architectural rewrites. The true trade-off of a framework lies in adhering to its structural conventions.
2. **"Isn't server rendering just for SEO?"**
   **No.** The React documentation classifies that belief as a widespread misunderstanding. Server rendering allows social media crawlers and search indexers to parse page content from raw HTML, but its primary benefit is faster First Contentful Paint for real users. Visitors on slow mobile connections view rendered text and interface layouts immediately while JavaScript bundles download in the background. The primary operational trade-off of server rendering is computational work per request, which can elevate Time to First Byte.
3. **"Why is fetching in `useEffect` slower than fetching in a loader?"**
   An Effect runs strictly after a component completes its render, and that render can only occur after the browser finishes downloading and parsing the JavaScript bundle. This sequential dependency creates a network waterfall: the client waits for HTML, waits for scripts, executes an initial render displaying loading indicators, and only then initiates data fetching. A framework loader enables the router to dispatch data queries immediately upon matching a URL, fetching data in parallel while application scripts download. The component renders directly with data supplied through `loaderData`.

```tree dir=right caption="Interview comparison: what Vite alone and a framework share, and where they differ."
Vite alone vs. a full-stack framework
- !Vite alone [`npm create vite@latest`] | Runs React, **empty root** in the first HTML | Routing and data loading are **ours to add**
- +A full-stack framework [`Next.js` `React Router`] | Runs React, **content in the HTML** where we choose | A **URL per page** and a **loader** before each render
```
