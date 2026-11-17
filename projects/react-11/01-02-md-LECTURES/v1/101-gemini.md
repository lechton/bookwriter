# Lecture 101: What Server Components Are and Why They Exist

*(Why should every phone download a library only to show a text that is the same for everyone?)*

> INTERVIEW QUESTION | ❱ CORE | What are React Server Components, and why do they exist?

---

## VS | Client Component vs. Server Component: both are React components, only one sends its code to the browser

> A published blog post displays identical content for every visitor, yet a client-only React application forces every browser to download formatting libraries and parse that text locally. **A Server Component is a React component that executes ahead of time before the response reaches the browser, sending only its rendered output and never its source code**. Third-party dependencies remain on the server, and the complete article displays immediately on initial page load.

In traditional single-page React applications, **every component ships its JavaScript to the client bundle**. When a visitor visits a page, the browser downloads the entire component codebase and executes each function locally. That client-side execution model is essential for interactive widgets like a Like button, which must track clicks and update local state in real time. But vast portions of a modern website never change after publication, including articles, documentation, marketing copy, and product catalogs. Downloading parsing logic and re-rendering identical markdown across millions of devices wastes network bandwidth and processing power. React Server Components solve this fundamental imbalance. **A Server Component executes ahead of time on a server or build worker, delivering only the finalized UI description to the client.**

Consider an article page containing a title, an introductory sentence, and an interactive Like button with a live counter. The author writes the article body in Markdown, requiring a specialized parser library to transform the text into HTML elements. Shipping that Markdown parser to every reader is unnecessary because the article content is completely identical for all visitors. Only the Like button requires client-side JavaScript execution, because only the Like button listens for user gestures and manages dynamic counter state.

**Why this matters:** In a client-only architecture, every visiting device downloads the parsing library and fetches raw Markdown over the network. Each device then parses the text into HTML locally. Every visitor pays a dual penalty through inflated bundle downloads and blank loading screens while performing identical work. A Server Component executes that parsing work a single time on the backend before delivering the page. The client device receives the completed HTML markup immediately, downloading only the minimal JavaScript needed to operate the Like button.

### Back to a Plain Node.js Script

JavaScript running inside a Node.js runtime executes outside the browser sandbox with direct access to local filesystem resources. A Node.js build script can read files directly from the hard drive, convert Markdown into HTML using a library, and write static markup to disk. Here is a short script that turns the post into HTML:

```js title="build.js: plain Node.js, run once on your computer"
import { readFile, writeFile } from 'node:fs/promises';
import { marked } from 'marked';

const text = ~await readFile('post.md', 'utf8')~; // Reads the Markdown from the disk
await writeFile('post.html', ~marked(text)~); // Writes the finished HTML file
```

When this script runs during a build, it produces `post.html` on the server. You deploy that generated HTML file directly to a web server or content delivery network. Every visiting user downloads pure HTML. Neither the build script nor the `marked` library is ever shipped across the network to the client browser.

A React Server Component applies this identical architectural principle within the declarative React component model:

```jsx title="src/Post.jsx: the same job, as a Server Component"
import { readFile } from 'node:fs/promises';
import { marked } from 'marked';

export default ~async~ function Post() { // A component that runs before the page is sent
  const text = await readFile('post.md', 'utf8');
  return <div dangerouslySetInnerHTML={{ __html: marked(text) }} />;
}
```

Like the Node.js script, `Post` accesses the server filesystem and executes `marked` ahead of time. Unlike an isolated script, `Post` returns JSX, composing seamlessly into the React component hierarchy alongside interactive client components. Exactly like the build script, **the browser receives only the rendered UI output of `Post`, never its underlying JavaScript code and never its imported libraries.**

Mastering this boundary distinction between server execution and client delivery is the foundation of React Server Components.

### Two Kinds of React Component

> [!DEFINITION]
> **What is a Server Component?** [NEW] A Server Component is a React component that executes exclusively on the server or during the build process, ahead of time.
> The browser receives only its rendered UI description. The component source code and server-only dependencies never enter the client bundle.
> A Server Component is a standard JavaScript function returning JSX, but it can read directly from backend databases and filesystems while omitting client event listeners (Lesson 101).

> [!DEFINITION]
> **What is a Client Component?** [NEW] A Client Component is a React component whose source code is included in the client bundle, downloaded by the browser, and executed on the user device.
> All components created in previous chapters of this curriculum are Client Components.
> Because its code runs inside the browser DOM environment, a Client Component can manage interactive state with `useState` and register event listeners such as `onClick` (Lesson 101).

Both types are authentic React components. Both are functions that take props and return JSX element descriptors. The essential difference lies in their execution environment and timing:
- **A Server Component** executes ahead of time on a server or build machine before sending UI to the user.
- **A Client Component** executes inside the user browser after the client JavaScript bundle downloads.

The automated process where code compiles and assets assemble is called **build time**. A Server Component can execute a single time at build time, or dynamically on a server whenever a visitor sends a request.

```tree caption="A Server Component and a Client Component are both React components; they differ in where and when they run."
Two kinds of React component on the blog post page
- +Server Component [`Post`] | Runs **before the page is sent** | The browser receives **only what it rendered**, never its code or its libraries
- +Client Component [`LikeButton`] | Its code is **sent to the browser** and runs there | It can use **state** and **event handlers**, so it answers taps
```

### Three Ways to Show a Markdown Post

When building a content-driven application, engineering teams choose between three primary rendering patterns:
1. **A Client Component fetches raw text inside an Effect and parses it in the browser** (Lessons 32 and 33). This pattern is typical for single-page apps built with standard bundlers where no server rendering environment exists.
2. **A Server Component reads the file directly from disk and parses it once at build time.** This architecture is ideal for static, immutable content like blog articles, marketing pages, and technical documentation.
3. **A Server Component queries data dynamically on each incoming HTTP request.** This model fits personalized or volatile data, such as private user notes or live database records, without requiring custom client API routes.

```tree caption="Three ways to show a Markdown post: in the browser, once at build time, or on each request."
Three ways to show a Markdown post in React
- +Client Component with an Effect [`useEffect` `fetch`] | Formats the post **in every user's browser** | Fits an app made with a **build tool alone**
- +Server Component at build time [`await readFile`] | Formats the post **once, when the app is built** | Fits content that **does not change**, such as a published post
- +Server Component on each request [`await` on a web server] | Formats the page **once per request** | Fits data that **changes**, such as a note in a database
```

This lesson starts from the first pattern, the familiar client-only approach, and systematically transforms it into the second pattern.

### The Rule of Thumb: does this part answer the user?

**Evaluate every component with one architectural question: does this component need to respond directly to user gestures in the browser using state or event listeners? If it does, mark it as a Client Component. If it does not, keep it as a Server Component.**

Senior engineers also recognize four misconceptions that confuse developers new to Server Components:
1. **Adding `'use server'` to create a Server Component.** Server Components have no directive because they are the framework default. The `'use server'` directive marks callable Server Functions.
2. **Assuming a Server Component requires an active web server.** Server Components can execute once during build compilation, generating static files deployable to any standard static file host.
3. **Conflating Server Components with server-side rendering.** Server Components determine where component logic executes, while server-side rendering converts rendered component trees into initial HTML markup.
4. **Calling `useState` or attaching `onClick` handlers inside a Server Component.** Server Components execute on the backend ahead of time, leaving no component instance in browser memory to manage state or handle DOM clicks.

The remainder of this lesson demonstrates each concept on a functioning blog application.

## SECTION | A Blog Post Page with a Like Button

Open a blog post on your phone. The page displays a heading, an introductory line, and an interactive Like button with a count:

```page width=text caption="The blog post page the user opens: a title, one line, and a Like button."
heading: Park Opens Today
line: The park opens at noon.
line: 0 likes [Like]
```

The author wrote this post in a Markdown file named `post.md`. Markdown is the plain text format that blogs and documentation sites use. A line that starts with a hash sign becomes a title:

```md title="post.md"
# Park Opens Today

The park opens at noon.
```

In a client-only architecture, the application is bundled for the browser using a build tool such as Vite without an integrated framework (Lesson 46). Beyond the markdown file and the two components, the application requires an API route. An API route is a small piece of server logic that handles a specific network endpoint, returning the raw text of the article:

```files title="blog: the page without Server Components" caption="The blog post page as a client-only app: the post, a route that sends it, and two components."
post.md | content | The post written in Markdown
api/
  post.js | route | Answers `/api/post` with the text of `post.md`
src/
  Post.jsx | Client Component | Fetches the text, formats it with `marked`, and renders `LikeButton`
  LikeButton.jsx | Client Component | Counts the likes with `useState` and `onClick`
```

The `Post` component fetches the markdown string inside an Effect (Lesson 33), and parses it with `marked`:

```jsx title="src/Post.jsx" startLine="1"
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import LikeButton from './LikeButton';

export default function Post() {
  const [text, setText] = useState('');

  useEffect(() => {
    ~fetch('/api/post')~ // Asks the server for the post after the first render
      .then(response => response.text())
      .then(data => setText(data));
  }, []);

  return (
    <article>
      <div ~dangerouslySetInnerHTML~={{ __html: marked(text) }} /> {/* marked runs on the phone */}
      <LikeButton />
    </article>
  );
}
```

The `LikeButton` component tracks user taps using local component state (Lesson 12):

```jsx title="src/LikeButton.jsx" startLine="1"
import { useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <>
      <span>{likes} likes</span>
      <button ~onClick~={() => setLikes(likes + 1)}>Like</button> {/* Adds one like per tap */}
    </>
  );
}
```

The `dangerouslySetInnerHTML` attribute inserts raw HTML directly into the rendered `<div>`. Because the article text originates from trusted local authors rather than untrusted user input, passing the parsed output of `marked` is secure in this scenario (Lesson 48).

### What Happens When a User Opens the Link

**In a client-only architecture, every visiting device downloads the parsing library and issues a secondary network request simply to display static content that never changes.** Consider the exact runtime sequence:
1. The browser downloads the application JavaScript bundle, which contains the complete `marked` library.
2. React mounts the component tree on the client. Because state begins empty, the initial render displays only the Like button below an empty content area.
3. The `useEffect` Hook initiates a network fetch to retrieve the Markdown file from the backend API route.
4. When the HTTP response arrives, `marked` compiles the Markdown string into HTML inside the browser, triggering a secondary re-render that finally displays the article.

```page width=text caption="What the user sees after step 2: the Like button is there, and the post is not."
empty: no post yet
line: 0 likes [Like]
```

Every subsequent visitor experiences this identical four-step delay. Every client device downloads the parsing package and expends device CPU cycles parsing identical static text. Yet the published article never changes.

Consider the physical performance penalty: official React documentation highlights that `marked` adds over 11 kilobytes of compressed JavaScript to the client bundle. Pairing it with an HTML sanitization library inflates the client payload by roughly 75 kilobytes. Meanwhile, every visitor endures visual layout shift, viewing a blank placeholder while waiting for the secondary network request to resolve.

By migrating `Post` to a Server Component, the framework renders the content ahead of time. Visitors view the completed article immediately upon initial page load without downloading formatting libraries.

Our architecture maintains the identical user interface while relocating `Post` to the server environment. The project structure simplifies to three essential files: the article Markdown, `Post.jsx`, and `LikeButton.jsx`. The separate API endpoint is eliminated entirely.

**PRINCIPLES:** A Server Component runs before the page is sent, and the browser receives only what it rendered. Five principles follow:
1. **Principle 1: An Async Server Component Reads Its Data While It Renders.** `Post` waits for the file in its own body, so it needs no Effect, no empty first render, and no route.
2. **Principle 2: A Server Component's Imports Stay Out of the Bundle.** `marked` runs on the server. The browser downloads only the code of Client Components.
3. **Principle 3: The Like Button Needs `'use client'`.** A component with state or a tap must be a Client Component, marked by one line at the top of its file.
4. **Principle 4: No Directive Marks a Server Component.** Server Components are the default. The line `'use server'` marks Server Functions.
5. **Principle 5: A Server Component Can Run Once at Build Time.** It needs no web server. Turning its output into HTML is a separate step, server-side rendering.

---

## PRINCIPLE | `async function Post`: the component waits for its data, then renders once, with the text

> [!PRINCIPLE]
> **Principle 1: Async Server Component: Post Reads Its Data While It Renders**
>
> *Write a Server Component as an async function and await its data in its own body; it needs no Effect, no empty first render, and no route of its own.*
>
> A Client Component cannot wait inside its body, so it renders empty first and fetches in an Effect. A Server Component runs before the page is sent, so it can wait for the file and render once, with the text. Keeping useState and useEffect in a Server Component does not work, because a Server Component cannot use them.
>
> **DO THIS:**
> ```jsx
> export default ~async~ function Post() { // React waits for the file, then renders once
>   const text = await readFile('post.md', 'utf8');
>   return <p>{text}</p>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function Post() {
>   const [text, setText] = ~useState~(''); // **WRONG:** a Server Component cannot use useState or useEffect
>   useEffect(() => { fetch('/api/post').then(r => r.text()).then(setText); }, []);
>   return <p>{text}</p>;
> }
> ```

In client-side data fetching, a Client Component cannot pause synchronous execution inside its function body (Lesson 33). React calls the component function, and that function must return JSX immediately. To display remote content, the component initializes state to an empty string, schedules a network fetch inside an Effect, and triggers a secondary re-render when the Promise settles.

A Server Component eliminates that client-side detour by executing asynchronously on the backend. Here are the two implementations of `Post`, each shown in minimal form:

```jsx title="With an Effect: Post fetches the text after its first render"
export default function Post() {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('/api/post')
      .then(response => response.text())
      .then(data => ~setText(data)~); // Starts the second render, in the browser: the text appears
  }, []);

  return <p>{~text~}</p>; // Empty on the first render, filled on the second
}
```

```jsx title="With await in the body: Post reads the file before it returns"
import { readFile } from 'node:fs/promises';

export default ~async~ function Post() { // A Server Component may be an async function
  const text = ~await~ readFile('post.md', 'utf8'); // React waits here until the file is read
  return <p>{text}</p>;
}
```

Both implementations ultimately display identical paragraph markup. However, the physical timing of data resolution differs completely:
- **With an Effect**, `Post` renders twice inside the client browser. The initial render contains empty text, and the secondary render populates the paragraph only after the network request resolves.
- **With `await` in the body**, `Post` renders a single time on the backend before the response reaches the browser. React pauses at the `await` statement until the filesystem read resolves, then produces completed markup immediately.

```tree caption="With an Effect, Post renders empty and then again with the text; with await in the body, Post renders once with the text, before the page is sent."
Two ways for `Post` to get the text of `post.md`
- !With an Effect [`useEffect` `fetch`] | Renders **empty first**, then fetches, then **renders again** | All of it happens **in every user's browser**
- +With `await` in the body [`async function Post` `await readFile`] | Waits for the file **inside its own body** | Renders **once, with the text**, before the page is sent
```

### A Component with `async` in Front of It

The second implementation is an **async component**: a component declared as an `async` function that pauses execution using `await`. In standard client-side React, declaring a component as an `async` function is unsupported because client rendering must return JSX synchronously.

In a Server Component, React supports asynchronous rendering natively. When the runtime encounters the `await` keyword, it pauses rendering for `Post` until the Promise resolves. Once the file read completes, React resumes rendering and produces the resolved JSX tree.

Attempting to declare an async Client Component causes runtime errors. Official React documentation explicitly confirms that async components are not supported on the client.

### Who Calls `Post`, If the Browser Never Does?

The server framework executes `Post`. Modern frameworks like Next.js App Router manage the lifecycle of Server Components (Lesson 46). The framework invokes `Post` before sending the response to the user. For static articles, the framework executes `Post` a single time during the build step, long before any user requests the URL.

### Where `readFile` Comes From

The `readFile` utility is part of Node.js rather than the core React library. Imported from the built-in Node filesystem promises module, it reads file data from the host filesystem and returns a Promise resolving to the file contents. Passing `'utf8'` as the second argument decodes raw file buffers into a standard JavaScript string.

Web browsers operate inside a security sandbox that prohibits direct access to the server filesystem. Consequently, code importing filesystem modules can only execute inside Server Components.

### Our Post Page: `Post.jsx` Becomes a Server Component

On our blog page, the post component strips out state, the Effect, and the browser `fetch` call. It reads `post.md` directly from the filesystem. The markdown parsing logic remains in place, and Principle 2 analyzes its bundle impact. We temporarily omit the Like button, which Principle 3 reinstates.

```jsx title="src/Post.jsx" startLine="1" good="4,5"
import { readFile } from 'node:fs/promises';
import { marked } from 'marked';

export default ~async~ function Post() { // Called by the framework, never by the browser
  const text = await readFile('post.md', 'utf8');
  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: marked(text) }} />
    </article>
  );
}
```

We also remove the dedicated API route file. Because `Post` reads the markdown file directly from the filesystem, maintaining a separate HTTP endpoint is no longer necessary.

```page width=text caption="The post page after Post becomes a Server Component: the title and the line are there from the start, with no empty first render."
heading: Park Opens Today
line: The park opens at noon.
```

Because `Post` executes ahead of time, the browser receives the rendered article markup directly, without downloading the filesystem reading logic.

---

## PRINCIPLE | `import` in a Server Component: the library runs on the server and never reaches the bundle

> [!PRINCIPLE]
> **Principle 2: Bundle: A Server Component's Imports Stay on the Server**
>
> *A library imported by a Server Component runs on the server and is not included in the bundle; only Client modules are bundled and run by the browser.*
>
> The same import line does two different things, depending on the component that holds it. In a Client Component, every user downloads the library and runs it. In a Server Component, the library runs once, and the browser receives only the rendered output.
>
> **DO THIS:**
> ```jsx
> import { ~marked~ } from 'marked'; // Runs on the server; the browser gets the finished HTML
>
> export default async function Post() {
>   const text = await readFile('post.md', 'utf8');
>   return <div dangerouslySetInnerHTML={{ __html: marked(text) }} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { ~marked~ } from 'marked'; // **WRONG:** in a Client Component, every user downloads marked for the same text
>
> export default function Post() {
>   const [text, setText] = useState('');
>   useEffect(() => { fetch('/api/post').then(r => r.text()).then(setText); }, []);
>   return <div dangerouslySetInnerHTML={{ __html: marked(text) }} />;
> }
> ```

> [!DEFINITION]
> **What is the bundle?** [REVIEW] When compiling a client React application, a bundler packages your component source code and all imported libraries into static JavaScript files called bundles.
> Every visitor downloads these bundle files over the network, and the client browser executes them.
> Larger bundles increase network download times and delay the moment when users can interact with the page (Lesson 07).

### The Same Import Line in Two Files

Here is the top of `Post.jsx` in the Effect version and in the Server Component version:

```jsx title="The marked import in a Client Component"
import { useState, useEffect } from 'react';
import { ~marked~ } from 'marked'; // Added to the bundle: every user downloads it

export default function Post() {
```

```jsx title="The marked import in a Server Component"
import { readFile } from 'node:fs/promises';
import { ~marked~ } from 'marked'; // Not included in the bundle: it runs on the server

export default async function Post() {
```

The import syntax is identical in both files. However, the operational environment changes the cost of that dependency completely:
- **In a Client Component**, the bundler includes `marked` in the client JavaScript bundle. Every visitor downloads the parser library over the network and executes it locally on identical Markdown text.
- **In a Server Component**, `marked` executes exclusively in the server environment. Official React documentation annotates this exact import with the comment "Not included in bundle".

### What the Browser Receives Instead

The browser never downloads `Post.jsx` or the `marked` library. Instead, the browser receives only the **rendered output** of `Post`: the pure JSX representation resulting from the component function execution.

On the server, `marked` converts the Markdown text into an HTML string, which `dangerouslySetInnerHTML` embeds inside the wrapper div. The rendered output delivered to the client already contains the completed title and paragraph elements. Inspecting the DOM tree in the browser Elements panel displays standard semantic elements with no trace of the underlying parsing library:

```dom title="Elements panel" caption="The post in the Elements panel: a finished div from the rendered output of Post, with no marked code behind it."
<article>
+ <div>
+   <h1>Park Opens Today</h1>
+   <p>The park opens at noon.</p>
+ </div>
</article>
```

React documentation describes files shipped to the client as **Client modules**. Only Client modules are bundled and executed by the browser. Consequently, the total volume of JavaScript downloaded and parsed by the user device drops dramatically.

When the React core team first unveiled this architecture in 2020, they titled the official announcement "Introducing Zero-Bundle-Size React Server Components".

```tree caption="The same import of marked adds the library to the bundle in a Client Component, and leaves it on the server in a Server Component."
Where `marked` runs, depending on the component that imports it
- !Imported in a Client Component [`import { marked }` in an Effect-based `Post`] | `marked` and `Post` go **into the bundle** | Every user **downloads and runs** them on the same text
- +Imported in a Server Component [`import { marked }` in an async `Post`] | `marked` runs **once, where `Post` runs** | The browser receives **only the rendered `<div>`**
```

### Smaller Is Not Always the Result

A Server Component reduces overall download weight when component logic and third-party dependencies are heavy compared to the generated markup. This is true for Markdown parsing, where a substantial library produces a concise HTML string.

The reverse trade-off can also occur. Official React documentation describes a component that procedurally calculates a complex graphic and returns a massive SVG coordinate string. In that scenario, the rendered output string is substantially larger than the compact mathematical algorithm that generated it. For output-heavy components, retaining the component as a Client Component and shipping the small generation algorithm across the network can result in fewer total transferred bytes.

---

## PRINCIPLE | `'use client'`: only the file that needs state or a tap goes to the browser

> [!PRINCIPLE]
> **Principle 3: `'use client'`: Only the Part That Answers Taps Runs in the Browser**
>
> *A component that uses `useState` or an event handler such as `onClick` must be a Client Component, marked with `'use client'` at the top of its file; a Server Component can render it.*
>
> A Server Component runs once before the page is sent and is gone, so it cannot hold state or answer a tap. Put `'use client'` on the small file that needs the tap, and let the post around it stay on the server.
>
> **DO THIS:**
> ```jsx
> ~'use client';~ // Only LikeButton.jsx goes to the browser
>
> export default function LikeButton() {
>   const [likes, setLikes] = useState(0);
>   return <button onClick={() => setLikes(likes + 1)}>{likes} likes</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~'use client';~ // **WRONG:** on Post.jsx, this sends Post and marked to every user again
> import { marked } from 'marked';
>
> export default function Post({ text }) {
>   const [likes, setLikes] = useState(0);
>   return (
>     <article>
>       <div dangerouslySetInnerHTML={{ __html: marked(text) }} />
>       <button onClick={() => setLikes(likes + 1)}>{likes} likes</button>
>     </article>
>   );
> }
> ```

### The Same Button, with One More Line

Here is the Like button exactly as you wrote it before, with one new line at the top:

```jsx title="src/LikeButton.jsx" startLine="1"
~'use client';~ // This file is client code: it goes into the bundle

import { useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <>
      <span>{likes} likes</span>
      <button onClick={() => setLikes(likes + 1)}>Like</button>
    </>
  );
}
```

The string `'use client'` represents a **directive**: a special statement positioned at the beginning of a source file that provides instructions to the bundler. This directive declares that the module and its exported components belong in the client bundle. The bundler includes `LikeButton.jsx` in the client JavaScript bundle, and the browser executes it as a Client Component.

### Why the Button Cannot Be a Server Component

A Server Component executes on the backend and completes rendering before sending the response to the user. It does not remain active in browser memory, meaning it cannot maintain mutable state across user interactions. When a user clicks the Like button, no Server Component exists in the browser environment to intercept the click event. Managing local state with `useState` and listening for events with `onClick` require code executing directly in the client runtime.

In a project configured for Server Components, all components default to Server Components unless designated otherwise. Omitting `'use client'` leaves `LikeButton.jsx` as a Server Component. The framework halts compilation with an explicit error, explaining that Server Components cannot access `useState` or browser event handlers.

```tree caption="LikeButton.jsx with the use client line is bundled and counts taps; without it, the file is a Server Component and cannot use useState."
`LikeButton.jsx` in an app with Server Components
- +With `'use client'` at the top [`'use client';`] | The file is **client code** and goes into the bundle | The button **counts every tap** in the browser
- !Without `'use client'` [`import { useState }` on line 1] | The file is a **Server Component** | It **cannot use `useState`**, so the framework stops with an error
```

### Our Post Page: `Post` Renders the Like Button Again

A Server Component can render a Client Component seamlessly. Inside `Post.jsx`, we import the button component and insert `<LikeButton />` directly into the JSX tree beneath the article container:

```jsx title="src/Post.jsx" startLine="1" good="3,10"
import { readFile } from 'node:fs/promises';
import { marked } from 'marked';
import ~LikeButton~ from './LikeButton'; // A 'use client' file: its code goes to the browser

export default async function Post() {
  const text = await readFile('post.md', 'utf8');
  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: marked(text) }} />
      <LikeButton />
    </article>
  );
}
```

The server rendering pass does not execute the interactive button logic. Instead, the server output emits a placeholder boundary indicating where `LikeButton` should mount. The client browser downloads the JavaScript bundle containing `LikeButton.jsx` and hydrates the interactive component in place.

The page now unites both rendering strategies. The article title and body arrive pre-rendered from the server, while the counter and interactive button execute in the client browser:

```page width=text caption="The post page with the Like button back, before any tap."
heading: Park Opens Today
line: The park opens at noon.
line: 0 likes [Like]
```

```page width=text caption="The same page after the user taps Like once."
heading: Park Opens Today
line: The park opens at noon.
line: 1 likes [Like] | good
```

### The Quick Fix That Brings `marked` Back

**Applying a naive fix to resolve a `useState` compiler error can accidentally turn the entire component tree into client code, forcing every browser to download `marked` again.** Developers frequently encounter this architectural regression through a common sequence:
1. A developer places the Like button state and click handler directly inside `Post.jsx`.
2. The compilation tool halts with an error indicating that Server Components cannot call `useState`.
3. To silence the error quickly, the developer adds `'use client'` to the top of `Post.jsx`.
4. While the compilation error disappears, `Post.jsx` is now marked as client code. Because `Post.jsx` imports `marked`, the bundler includes the entire Markdown library in the client bundle, restoring the original performance defect.

The architecture recommended by official React documentation solves this cleanly. Retain `Post.jsx` as a Server Component, and isolate interactive elements into dedicated leaf components marked with `'use client'`.

---

## PRINCIPLE | No directive: every component is a Server Component by default, and `'use server'` marks Server Functions

> [!PRINCIPLE]
> **Principle 4: The Default: Server Components Have No Directive**
>
> *In an app with Server Components, every component is a Server Component unless its file, or a file that imports it, has `'use client'`; `'use server'` marks Server Functions, not Server Components.*
>
> Developers who learn `'use client'` expect a matching line for the server side. There is none. A Server Component is the file with no directive at all, and `'use server'` turns the exports of a file into functions the browser can call.
>
> **DO THIS:**
> ```jsx
> ~export default async function Post()~ { // No directive: a Server Component by default
>   const text = await readFile('post.md', 'utf8');
>   return <p>{text}</p>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~'use server';~ // **WRONG:** this marks Server Functions; there is no directive for Server Components
>
> export default async function Post() {
>   const text = await readFile('post.md', 'utf8');
>   return <p>{text}</p>;
> }
> ```

### Three Ways a File Can Start

Look at the first line of three files:

```jsx title="The first line of three files"
~'use client';~ // LikeButton.jsx: client code, sent to the browser
~'use server';~ // A file of Server Functions, which the browser can call
~import { readFile } from 'node:fs/promises';~ // Post.jsx: no directive at all, a Server Component
```

The directives `'use client'` and `'use server'` appear to form a balanced pair, suggesting one directive for each environment. However, these directives are not symmetrical opposites:
- **The `'use client'` directive** designates a boundary for client code. The marked file and its imported dependencies are added to the client bundle and execute in the browser.
- **The `'use server'` directive** does not define a Server Component. It declares **Server Functions**: individual backend functions exposed as endpoints that client components can invoke over the network (Lesson 110).
- **No directive at all** is the standard syntax for a Server Component. The `Post.jsx` file contains no directive header and executes exclusively on the server.

Official React documentation warns against this exact misunderstanding: Server Components require no directive because they represent the default component model in supported frameworks.

### Server Components Are the Default

The `Post.jsx` module requires no directive because modern React application frameworks treat all components as Server Components by default. Every component executes on the server unless a `'use client'` boundary explicitly redirects execution to the client. You only write a directive when declaring an exception to this default architecture.

```tree caption="Three ways a file can start: use client marks client code, use server marks Server Functions, and no directive is the default Server Component."
What the first line of a file means in an app with Server Components
- +`'use client'` [`LikeButton.jsx`] | Marks **client code** | The file is **bundled** and runs in the browser
- !`'use server'` | Marks **Server Functions**, not Server Components | ~Do **NOT** write it to make a Server Component
- +No directive [`Post.jsx`] | The **default** in an app with Server Components | A **Server Component**, with no line of its own
```

Our blog post architecture remains stable under this principle: the post component contains no directive, while `LikeButton.jsx` declares `'use client'` at the top of the file.

---

## PRINCIPLE | Server Component at build time: it runs once, with no web server

> [!PRINCIPLE]
> **Principle 5: Build Time: A Server Component Does Not Need a Web Server**
>
> *A Server Component runs at build time or on each request; its output can then be server-side rendered to HTML as a separate step, so Server Components are not SSR, and a post that never changes needs no web server.*
>
> The word "server" makes developers expect a computer that renders the page for every request. For content that does not change, the framework runs the Server Component once, during the build, and the finished page can sit on static hosting.
>
> **DO THIS:**
> ```jsx
> export default ~async~ function Post() { // Runs once at build time; the page can sit on a CDN
>   const text = await readFile('post.md', 'utf8');
>   return <div dangerouslySetInnerHTML={{ __html: marked(text) }} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function Post() {
>   const [text, setText] = useState('');
>   useEffect(() => { ~fetch('/api/post')~.then(r => r.text()).then(setText); }, []); // **WRONG:** for a post that never changes, every user downloads marked and waits for a second request
>   return <div dangerouslySetInnerHTML={{ __html: marked(text) }} />;
> }
> ```

### A Server Component with No Web Server

Because the word "server" is in the name, developers frequently assume Server Components require a persistent server process running continuously to handle every visitor request. Our blog post requires no such server process.

**A Server Component can execute a single time during application compilation and never run again.** Official React documentation identifies two distinct execution environments for Server Components: once at build time on a build runner, or dynamically on an active web server per request:
- A **web server** is an active server process that handles incoming network requests from visitors in real time.
- A **build server** is an automated continuous integration environment that compiles code and produces static deployment assets.

Because published blog articles remain static after authoring, executing the Server Component during the build step is the optimal strategy.

### The Path from the Build to the Phone

Tracing the deployment and delivery pipeline illustrates how the rendered markup reaches the user:
1. During project compilation on the build server, the framework calls `Post`. The component reads `post.md` from disk and parses it using `marked`.
2. The rendered output of `Post` is compiled into static HTML files and uploaded to a content delivery network or static hosting provider (Lesson 46).
3. When a visitor requests the page, the hosting provider delivers the pre-rendered HTML immediately. The client browser never receives `Post.jsx` or the `marked` library.
4. Among our application files, only `LikeButton.jsx` is downloaded as JavaScript, allowing the button to hydrate and track clicks.

No server process is required to render the post after the build completes. Official React documentation emphasizes that Server Components can execute at build time without requiring an active web server.

### Server Components and Server-Side Rendering: Two Separate Steps

Converting component trees into initial HTML markup is known as **server-side rendering** or SSR (Lesson 102).

Because both techniques operate prior to client delivery and share the word "server", developers often conflate them. However, they address two distinct architectural concerns:
- **React Server Components** determine where component logic and dependencies execute. They ensure heavy libraries and server resources remain off the client device.
- **Server-side rendering** determines how component trees convert into raw HTML strings, enabling the browser to display initial content before JavaScript executes.

Official React documentation clearly separates these concepts. Server Components execute in an environment isolated from your client application and SSR server. Their rendered output can subsequently undergo server-side rendering in an independent processing step.

```tree caption="Server Components decide where a component's code runs; server-side rendering turns rendered components into the page's first HTML."
Two steps that both run before the page reaches the browser
- +Server Component [`Post`] | Decides **where the code runs**: before the page is sent | `Post` and `marked` **stay out of the bundle**
- +Server-side rendering [SSR] | Turns rendered components into the page's **first HTML** | The user sees the post **before any JavaScript runs**
```

### At Build Time or on Each Request

The identical component code can execute either during the build or dynamically on incoming requests. The timing of execution is determined entirely by framework orchestration:
- **At build time**, `Post` executes once to produce immutable static markup, which suits our published article.
- **On each request**, `Post` executes dynamically per visitor on a live web server, which suits volatile data like private database records.

The component source code remains identical across both operational models.

---

## All 5 Principles Together

### The complete code

Here is the finished post page. Three files, and no route:

```files title="blog: the page with Server Components" caption="The finished blog post page: the post, one Server Component, and one Client Component."
post.md | content | The post written in Markdown
src/
  Post.jsx | Server Component | Reads `post.md`, formats it with `marked`, and renders `LikeButton`
  LikeButton.jsx | Client Component | Starts with `'use client'` and counts the likes
```

```md title="post.md"
# Park Opens Today

The park opens at noon.
```

```jsx title="src/Post.jsx" startLine="1"
import { readFile } from 'node:fs/promises';
import { ~marked~ } from 'marked'; // Principle 2: stays out of the bundle
import LikeButton from './LikeButton';

export default ~async~ function Post() { // Principles 1 and 4: an async Server Component, with no directive
  const text = ~await~ readFile('post.md', 'utf8'); // Principle 5: runs once at build time
  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: marked(text) }} />
      <LikeButton />
    </article>
  );
}
```

```jsx title="src/LikeButton.jsx" startLine="1"
~'use client';~ // Principle 3: the only file of ours the browser downloads as code

import { useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <>
      <span>{likes} likes</span>
      <button onClick={() => setLikes(likes + 1)}>Like</button>
    </>
  );
}
```

```page width=text caption="The finished post page: the title and the line from the Server Component, the count and the button from the Client Component."
heading: Park Opens Today
line: The park opens at noon.
line: 0 likes [Like]
```

### The order in which React calls the components

React calls `Post` and `LikeButton` in two different places, at two different times. `Post` runs on the CI server, during the build. `LikeButton` runs later, in each user's browser:

```tree dir=right caption="The order in which React calls the components of the post page: Post at build time, LikeButton in the user's browser."
How the post page reaches the user
- +1. At build time, on the CI server [`Post`] | The framework calls `Post`; it **awaits `readFile`** and **runs `marked`** | Its rendered output holds the finished post and **marks where `LikeButton` goes**
- +2. Optional: server-side rendering [first HTML] | The output can be turned into the page's **first HTML** | The page is **uploaded to a CDN**
- +3. In the user's browser [`LikeButton`] | Of our files, the bundle holds **only `LikeButton.jsx`** | React calls `LikeButton`, and **every tap adds one like**
```

### Summary

| Aspect | The Client-Only Habit | The Server Component Rule |
| :--- | :--- | :--- |
| **Where the data is read** | Renders empty, then fetches in an Effect through a route | An `async` Server Component awaits its data in its own body |
| **What the browser downloads** | Every imported library, even one that formats a text that never changes | Only Client modules; a Server Component's imports stay on the server |
| **State and taps** | Any component can use `useState` and `onClick` | Only Client Components, marked with `'use client'` at the top of the file |
| **How a Server Component is marked** | Expects `'use server'` to match `'use client'` | No directive at all; `'use server'` marks Server Functions |
| **Where "server" runs** | Expects a web server rendering every request | At build time on a CI server, or on each request on a web server; SSR is a separate step |

Remember the one sentence of this lesson. **A Server Component runs before the page is sent, and the browser receives only what it rendered, never its code and never the libraries it imported.**

---

## For the Interview

> **The Interview Question:** What are React Server Components, and why do they exist?

### How to Answer Clearly in 30 Seconds

"A Server Component is a React component that executes ahead of time in an environment separate from the browser. It runs either at build time or on each incoming request. The browser receives only its rendered UI output, never its source code or dependencies. Server Components exist because web applications display substantial content that never changes between visitors, such as published articles or documentation. Without Server Components, every client browser must download parsing libraries and execute redundant parsing locally. Server Components can be declared as `async` functions to await backend data directly during rendering, eliminating client-side data fetching waterfalls and dedicated API routes. Because they execute ahead of time, Server Components cannot manage state or handle browser events. Interactive elements are isolated into Client Components marked with `'use client'`. Server Components require no directive because they represent the default component model in modern React frameworks."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does `'use server'` mark a Server Component?"**
   No. Server Components require no directive because they are the default in supported frameworks. The `'use server'` directive marks Server Functions, which are backend functions that client components can invoke asynchronously. Conflating `'use server'` with Server Components is one of the most common misconceptions in React interviews.
2. **"Are Server Components the same thing as server-side rendering, and do they need a web server?"**
   No to both. Server Components govern where component logic executes and keep dependencies out of the client bundle. Server-side rendering converts rendered component trees into initial HTML markup so browsers can display content before JavaScript executes. Server Components can run during build compilation without requiring a live web server, allowing pre-rendered pages to deploy directly to static hosts or CDNs.
3. **"Do Server Components always make the bundle smaller?"**
   They reduce client bundle size by keeping component code and heavy dependencies on the server. However, they do not guarantee smaller network payloads in every case. Some components contain compact procedural code that generates massive markup, such as a long SVG path string. In those cases, sending the client component code transfers fewer bytes than streaming the vast rendered output.

```tree dir=right caption="Quick comparison of Server Components and Client Components for interviews."
Server Component vs. Client Component
- +Server Component [`async function Post`] | Runs **at build time or on each request** | Can **await data** and import **heavy libraries** | **No directive**; not in the bundle
- +Client Component [`'use client'` `LikeButton`] | Its code **runs in the browser** | Can use **`useState`** and **`onClick`** | Marked with **`'use client'`**; in the bundle
```
