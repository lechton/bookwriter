# Lecture 70: How lazy Loads a Component Only When It Renders

*(How can a page skip the code of a panel that most visitors never open?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you code-split a component and load it on demand with lazy?

---

## VS | A Static `import` Line vs. `lazy(() => import())`: the code arrives with the page, or the first time React renders the component

> Large components that only some users open can bloat the initial JavaScript bundle if loaded upfront. **A static import at the top of the file forces every visitor to download that hidden code on page load, even if they never click**. Importing the component with `lazy` defers that download, fetching the code only when React attempts to render it for the first time.

In standard React applications, components are brought into a file using top-level import declarations (Lesson 05). Conditional rendering with logical operators controls whether those components appear on screen (Lesson 10):

```jsx title="src/App.jsx"
~import Stats from './Stats.jsx';~ // Downloads Stats.jsx when the page loads

{showStats && <Stats />} {/* Shows the panel only while showStats is true */}
```

When a visitor never clicks the button, the stats panel never mounts to the DOM. Many developers assume that because the component never appears on screen, its JavaScript was never fetched over the network.

That assumption is incorrect. Two independent mechanisms decide this behavior:
1. **The conditional expression controls DOM rendering.** While the state flag remains `false`, React skips the component during reconciliation and renders nothing to the DOM.
2. **The static import declaration controls network loading.** Top-level imports are evaluated when the script first loads, downloading the component for every visitor before any interaction occurs.

Using `lazy` alters only the network timing. The conditional JSX expression and component usage remain identical.

### The Idea Behind It: `import()` in Plain JavaScript

In standard JavaScript, ECMAScript modules support on-demand loading through the dynamic `import()` operator. Writing import as a function call instructs the browser to request and evaluate the script only when that expression runs:

```js title="Plain JavaScript: you download the file yourself, on the click"
button.addEventListener('click', async () => {
  const module = await ~import('./stats.js')~; // The browser downloads stats.js only now
  module.default(); // Calls the function that stats.js exports as default
});
```

In React, developers cannot trigger component downloads directly inside click handlers in this manner. Components are declarative functions invoked by React during render passes, rather than called manually in event listeners.

React provides `lazy` to bridge this gap. We pass React a loader function that returns a dynamic import promise, delegating the execution timing to React:

```jsx title="React: you hand the download to React"
const Stats = ~lazy(() => import('./Stats.jsx'))~; // React calls this arrow function the first time it renders <Stats />
```

The name reflects its deferred behavior. The official React documentation states: "`lazy` lets you defer loading component's code until it is rendered for the first time."

Keep one central distinction in mind throughout this lesson. **A static import downloads component code during initial page load, whereas `lazy` defers downloading until React renders the component.**

### The Words This Lesson Stands On

> [!DEFINITION]
> **A promise.** [REVIEW] A promise is a JavaScript object that represents an asynchronous value that arrives later, such as a file downloading over the network. While the operation is underway, the promise remains pending. Once the file arrives, the promise resolves and provides access to the loaded module (Lesson 33).

> [!DEFINITION]
> **A `<Suspense>` fallback.** [REVIEW] A component suspends when its required resources are not yet ready during render. React halts rendering that subtree, traverses up to the nearest `<Suspense>` boundary, and renders its fallback UI until the component resolves (Lesson 69).

> [!DEFINITION]
> **The bundler.** [REVIEW] A bundler is a build tool that combines application files into optimized JavaScript bundles for the browser. Our bundler is Vite. During local development, Vite serves files individually. During production build passes, Vite packages modules into combined bundle files (Lesson 46).

> [!DEFINITION]
> **The static `import` declaration.** [NEW] A static import declaration imports a module at the top level of a file. The browser evaluates and loads the referenced file before running any application code, regardless of whether the imported component ever renders. MDN notes that static imports result in the imported module being evaluated at load time (Lesson 70).

> [!DEFINITION]
> **The dynamic `import()`.** [NEW] Dynamic `import()` is a built-in JavaScript operator that loads an ECMAScript module asynchronously at runtime. It returns a promise resolving to the module namespace object. MDN defines it as a function-like expression that allows loading an ECMAScript module asynchronously and dynamically (Lesson 70).

### What Is at Stake

The official React documentation highlights the performance cost plainly. "Apps can become slow to load because all of the code for the entire app needs to be sent before it can be used."

In our demonstration, the statistics panel contains only a single paragraph. In production systems, secondary panels often import hefty charting libraries that outweigh the rest of the application code. Mobile visitors on constrained connections must download all of that unused JavaScript before reading the main content.

Applying `lazy` ensures visitors download only the code required for their immediate view. The author incurs a minor network wait only when opening the panel for the first time.

Developers frequently run into five common architectural mistakes:
1. **Assuming hidden elements avoid network downloads.** Static imports download code immediately, completely ignoring runtime JSX conditions.
2. **Omitting the required `<Suspense>` boundary.** React requires a fallback boundary to display while the asynchronous chunk is traveling.
3. **Using a named export instead of a default export.** React expects the resolved module object to expose its component under the default key.
4. **Declaring lazy components inside render functions.** Re-declaring lazy components on every render resets their internal cache and causes repeated fallback flashes.
5. **Over-splitting every small component into separate chunks.** Excessive splitting introduces latency waterfalls that degrade performance compared to bundled code.

### The Rule of Thumb: does every visitor see it at once?

**Evaluate every component with one question: does every visitor see it immediately upon opening the page? If yes, keep the static import at the top. If only some users view it after an interaction, defer it with `lazy`.**

### Three Ways to Bring In the Code of a Component

In production architectures, engineering teams choose between three primary strategies:
1. **Static import declarations at the file header** (Lesson 05). This approach serves critical above-the-fold content like article titles and body text. MDN recommends this format for loading initial dependencies required on page launch.
2. **`lazy` paired with `<Suspense>` boundaries.** This is the primary focus of this lesson. It suits secondary widgets and conditional panels that open on demand.
3. **Route-based code splitting managed by a router or framework** (Lesson 46). This strategy divides whole routes like dashboard and settings views into independent bundles. The React documentation notes that route splitting substantially reduces initial application load time.

```tree caption="Three ways to bring the code of a component into the page, and the part of the page each one fits."
Three ways to bring in the code of a component
- +The `import` line at the top [`import Stats from './Stats.jsx'`] | Loads **with the page** | Fits what **every visitor sees at once**, such as the title and the text
- +`lazy` with `<Suspense>` [`lazy` `<Suspense>`] | Loads **the first time React renders it** | Fits a part that **only some users open**, such as the stats panel
- +Split by route [router or framework] | Loads **each page on its own** | Fits **whole pages**, and routers and frameworks do it for you
```

## SECTION | An Article Page with a Show Stats Button

Our example page presents an article on a news website. It displays a heading, one paragraph of story text, and a toggle button labelled Show stats. The button exists specifically for the article author. When the author clicks it, a small panel reports how many readers viewed the article today.

```page caption="The article page when a visitor opens it: a title, one line of text, and a Show stats button."
heading: Main Street park opens today
line: The park opens at noon.
line: [Show stats]
```

```page caption="The same page after the author clicks Show stats: the panel shows the views of the day."
heading: Main Street park opens today
line: The park opens at noon.
line: [Hide stats]
line: Views today: 120 | good
```

Most visitors never click the button. They read the article and navigate away.

The application organizes its code across three files in the project folder. The statistics panel lives in its own dedicated component file:

```files title="news-article: File Explorer" caption="How the files of our article page sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | root | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | The article page: holds `showStats` state and brings in `Stats`
  Stats.jsx | default export | Exports the stats panel `Stats` as default
```

The application entry file mounts `App` inside `<StrictMode>` (Lesson 07). This mounting configuration remains unchanged throughout the lesson:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

The stats panel component renders a single paragraph:

```jsx title="src/Stats.jsx"
~export default~ function Stats() { // The panel, exported as the default export of its file
  return <p>Views today: 120</p>;
}
```

The main application file imports the panel using a standard static import. A state variable, `showStats`, initializes to `false`, and the button toggles this flag on click:

```jsx title="src/App.jsx"
import { useState } from 'react';
~import Stats from './Stats.jsx';~ // Downloads Stats.jsx when the page loads

export default function App() {
  const [showStats, setShowStats] = useState(false);
  return (
    <>
      <h1>Main Street park opens today</h1>
      <p>The park opens at noon.</p>
      <button onClick={() => setShowStats(!showStats)}>
        {showStats ? 'Hide stats' : 'Show stats'}
      </button>
      {~showStats &&~ <Stats />} {/* The panel appears only while showStats is true */}
    </>
  );
}
```

These three files produce the two interface states shown above. The following five principles examine how `lazy` modifies this delivery process and benefits both visitor and author.

**PRINCIPLES:** A static import downloads component code during page load. React `lazy` defers downloading until React renders the component for the first time. Five principles follow:
1. **Principle 1: A Static `import` Sends `Stats` to Every Visitor.** The top-level import downloads the file during page load. Hiding the element with conditional JSX alters only what renders, not what downloads.
2. **Principle 2: `lazy` Waits for the First Render of `Stats`.** The component code downloads only when React first attempts to render `<Stats />`. A `<Suspense>` boundary above the element displays a fallback during transmission.
3. **Principle 3: `lazy` Renders Only the Default Export.** The target file must export the component using `export default`. If the file uses a named export, clicking the button crashes the view.
4. **Principle 4: React Loads the Code Once.** The initial click triggers the network request and shows the fallback. Every subsequent interaction renders the cached component immediately.
5. **Principle 5: Write `lazy` at the Top Level of the File.** Declaring lazy components inside render functions recreates the component on every update, flashing the fallback repeatedly.

---

## PRINCIPLE | `import Stats from`: the code arrives with the page, even when the component never renders

> [!PRINCIPLE]
> **Principle 1: Static import: The Code Arrives with the Page, Whether or Not the Component Renders**
>
> *A static `import` declaration loads its file when the page loads; hiding the component with `&&` changes only what React shows, never what the visitor downloads.*
>
> A visitor who never clicks `Show stats` never sees the panel, yet their browser downloaded it with the page. The `import` line at the top of the file runs when the file loads, before React renders anything, and it never looks at the JSX. To keep a rarely opened panel off the visitor's phone, change the line that brings it in, not the JSX that shows it.
>
> **DO THIS:**
> ```jsx
> const Stats = ~lazy~(() => import('./Stats.jsx')); // The code of Stats loads only when <Stats /> first renders
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import Stats from './Stats.jsx';
> {~showStats &&~ <Stats />} {/* **WRONG:** hides the panel, but every visitor already downloaded Stats.jsx */}
> ```

Every component in our layout involves two separate concerns:
1. **When does its code reach the browser?** The import statement controls this timing.
2. **Is it on screen right now?** The JSX conditional expression controls this visibility.

```jsx title="The two lines that decide the stats panel"
~import Stats from './Stats.jsx';~ // 1. Decides WHEN the code arrives: when the page loads
{~showStats &&~ <Stats />} {/* 2. Decides WHAT React shows: the panel only while showStats is true */}
```

These two lines operate completely independently. The conditional JSX can withhold the component indefinitely, while the static import has already fetched its code over the wire.

### What the visitor downloads without ever clicking

Notice the disconnect between the rendered DOM and network activity. Here is what happens when a visitor opens the article page and never clicks:
1. The visitor navigates to the article page.
2. The browser evaluates the application script. The static import declaration instructs the module loader to fetch the stats module immediately, before React executes any component function.
3. React renders the page. Because the state flag starts as `false`, the conditional expression evaluates to `false`. React never invokes the stats component.
4. The visitor finishes reading and exits. The stats script resides in browser memory, having consumed network bandwidth without ever being executed.

The rendered user interface appears normal:

```page caption="What the visitor sees: the article and the Show stats button, with no panel on the page."
heading: Main Street park opens today
line: The park opens at noon.
line: [Show stats]
console: quiet
```

Inspecting the Elements panel confirms that no DOM nodes exist for the panel:

```dom caption="The Elements panel before any click: the title, the text, and the button, and no panel."
<div id="root">
  <h1>Main Street park opens today</h1>
  <p>The park opens at noon.</p>
  <button>Show stats</button>
</div>
* No Views today paragraph: React never called Stats
```

Only the Network tab reveals the upfront download (Lesson 33). In development mode, Vite serves each file separately, so the Network tab records a request for the stats file during initial page load. In a production build, Vite packages the stats component directly into the primary application bundle (Lesson 46). Every visitor who downloads the article inevitably downloads the stats code as well.

| Where we look | What it shows before any click |
| :--- | :--- |
| **The page** | The title, the text, and `Show stats`, with no panel |
| **The Elements panel** | No `<p>` for the panel |
| **The Network tab, with `npm run dev`** | A request for `Stats.jsx` when the page loads |
| **The files after `npm run build`** | One JavaScript bundle that holds `App` and `Stats` together |

```tree dir=right caption="What happens when a visitor opens the article page and never clicks Show stats."
A visitor opens the page and never clicks
- +1. The browser loads `App.jsx` | The static `import` at the top **loads `Stats.jsx` with it**
- +2. React renders `App` | `showStats` is `false`, so React **never calls `Stats`**
- !3. The visitor leaves | The code of `Stats` was **downloaded for nothing**
```

### Real mistake: a hidden panel that every visitor still downloads

Here is how this scenario unfolds in production teams:
1. An engineer implements an administrative stats widget on an article layout using a static import.
2. The engineer hides the widget behind conditional JSX so typical visitors never see it.
3. Verification in the browser confirms the layout renders cleanly without the widget.
4. Months later, the stats widget expands to include complex charting dependencies.
5. Every visitor now downloads the chart library before the main page responds, significantly degrading mobile load times.

Because the interface rendered correctly, the performance regression went unnoticed. The official React documentation explains this compounding issue: "An app's code size increases with every new feature and additional dependency."

Modern web tooling solves this through **code splitting**. MDN explains: "This allows an application to load only the code it actually needs at a given point in time, and load other bundles on demand." In our application, on demand means loading the code only when the author clicks Show stats.

Remember the operational division: conditional JSX dictates what React renders, while import syntax dictates what the browser downloads.

---

## PRINCIPLE | `lazy(() => import())`: the code arrives the first time React renders the component

> [!PRINCIPLE]
> **Principle 2: lazy: The Code Arrives the First Time React Renders the Tag**
>
> *Write `const Stats = lazy(() => import('./Stats.jsx'))` at the top of the file, and place a `<Suspense>` with a `fallback` above the `<Stats />` tag.*
>
> The `<Stats />` tag stays the same; only the line that brings `Stats` in changes. React calls the arrow function the first time it tries to render `<Stats />`, so a visitor who never clicks never downloads the panel. While the code travels, `Stats` suspends, and the closest `<Suspense>` shows its fallback.
>
> **DO THIS:**
> ```jsx
> const Stats = lazy(() => import('./Stats.jsx'));
> <~Suspense fallback={<p>Loading stats...</p>}~><Stats /></Suspense> {/* Shows Loading stats... until the code arrives */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const Stats = lazy(() => import('./Stats.jsx'));
> {showStats && ~<Stats />~} {/* **WRONG:** no Suspense above, so React has no fallback to show while the code loads */}
> ```

Both code examples below define a component named `Stats` from the same file. The critical distinction is when that code travels across the network:

```jsx title="The static import line vs. lazy with a dynamic import"
~import Stats from './Stats.jsx';~ // 1. Static: loads Stats.jsx when the page loads
const Stats = lazy(() => ~import('./Stats.jsx')~); // 2. Dynamic: loads Stats.jsx the first time React renders <Stats />
```

The import keyword serves two distinct functions in JavaScript:
1. **In static declarations**, the import keyword declares a top-level dependency evaluated when the module script first loads.
2. **In dynamic import expressions**, the import keyword functions like an operator that evaluates asynchronously on demand and returns a promise.

### Why `lazy` gets an arrow function, not the `import()` itself

React provides `lazy` as a named export from `'react'`. Notice that we do not pass an already-invoked promise directly into `lazy`. Instead, we pass an arrow function:

```jsx
const Stats = lazy(() => import('./Stats.jsx'));
```

Why wrap the import in an arrow function? The distinction comes down to invocation timing:
1. Invoking dynamic `import()` directly starts the network request immediately during script evaluation.
2. Wrapping the expression in a function defers execution until React explicitly calls that function.

When the application script loads, `const Stats = lazy(...)` executes, but no network request occurs. The network request begins only when React attempts to render the lazy component for the first time.

> [!DEFINITION]
> **`load` and the lazy component.** [NEW] The official React documentation refers to the callback passed to `lazy` as the `load` function. It receives no arguments and must return a promise resolving to an ECMAScript module. The documentation specifies: "React will not call `load` until the first time you attempt to render the returned component." The returned value is a lazy component that can be rendered directly in JSX (Lesson 70).

```tree caption="The static import line and lazy with a dynamic import both give us Stats, but the code arrives at a different time."
Two ways to bring `Stats` into `App.jsx`
- !Static `import` declaration [`import Stats from './Stats.jsx'`] | Runs **when the file loads** | `Stats.jsx` arrives **with the page**, for every visitor
- +`lazy` with a dynamic `import` [`lazy` `import`] | React calls `load` only **when it first renders `<Stats />`** | `Stats.jsx` arrives **after the click** on Show stats
```

### Adding `lazy` and `<Suspense>` to the article page

Converting our application requires three targeted adjustments in the parent file, while leaving the stats component completely unchanged:
1. Import Suspense and `lazy` from the React package.
2. Replace the static import declaration with the `lazy` definition.
3. Wrap `<Stats />` in a Suspense boundary with a fallback prop.

```jsx title="src/App.jsx"
import { useState, ~Suspense, lazy~ } from 'react'; // Both come from React

const Stats = ~lazy~(() => import('./Stats.jsx')); // Replaces the static import line

export default function App() {
  const [showStats, setShowStats] = useState(false);
  return (
    <>
      <h1>Main Street park opens today</h1>
      <p>The park opens at noon.</p>
      <button onClick={() => setShowStats(!showStats)}>
        {showStats ? 'Hide stats' : 'Show stats'}
      </button>
      {showStats && (
        <~Suspense fallback={<p>Loading stats...</p>}~> {/* Shows this line while the code of Stats loads */}
          <Stats />
        </Suspense>
      )}
    </>
  );
}
```

Why is `<Suspense>` mandatory here? When React reconciles `<Stats />` for the first time, its underlying function has not arrived in memory. The official React documentation explains: "While the code for the lazy component is still loading, attempting to render it will suspend." When a component suspends, React yields control to the nearest `<Suspense>` ancestor, displaying its `fallback` UI until the chunk arrives (Lesson 69).

### What happens when the author clicks Show stats

A visitor who never toggles the panel never downloads its code. The author triggers the download upon opening the panel:
1. A reader visits the article page. The `lazy` declaration has registered, but React has not rendered the component, so no network request occurs.
2. The reader leaves the site. The stats code was never transmitted over the network.
3. The author opens the page and clicks Show stats. React attempts to render `<Stats />` for the first time and invokes the loader function, firing the dynamic import.
4. While the chunk is in transit, the lazy component suspends. The parent `<Suspense>` boundary catches the suspension and renders the fallback message.
5. The promise resolves. React resumes rendering, renders `Stats`, and displays the live view count.

```page caption="The page during step 4: the code of Stats is still loading, so the Suspense boundary shows its fallback."
heading: Main Street park opens today
line: The park opens at noon.
line: [Hide stats]
line: Loading stats...
```

```page caption="The page after step 5: the code of Stats has arrived, and React shows the panel."
heading: Main Street park opens today
line: The park opens at noon.
line: [Hide stats]
line: Views today: 120 | good
```

Application code does not need to attach `.then()` handlers to the import promise. React manages the promise lifecycle automatically through Suspense.

During local development, step 4 completes too quickly to observe because files load from the local filesystem. Principle 4 introduces an artificial delay to make this loading state visible.

### Where the code of Stats goes

The Network tab highlights this architectural shift. In development mode, the request for the stats module appears only after the user clicks the toggle button.

Production bundling changes as well. When Vite encounters a dynamic import expression, it designates that module as a code-splitting boundary and outputs the component into an independent chunk.

> [!DEFINITION]
> **Code splitting and a chunk.** [NEW] Code splitting is the practice of dividing an application bundle into discrete files that download on demand. The official React documentation explains: "Code-splitting is the process of breaking your app into smaller bundles that can be loaded on demand." MDN refers to each separate output file as a chunk, noting that dynamic import expressions create dynamic splitting boundaries (Lesson 70).

| Where we look | With the static `import` line | With `lazy` |
| :--- | :--- | :--- |
| **Network tab, page load** | Requests `Stats.jsx` | Does not request `Stats.jsx` |
| **Network tab, first click on `Show stats`** | No new request | Requests `Stats.jsx` |
| **Files after `npm run build`** | One bundle holds `App` and `Stats` | `Stats` sits in its own chunk |

Notice that the `<Stats />` JSX element never changed. Only the declaration syntax bringing the component into scope changed, deferring network transmission until the component renders.

---

## PRINCIPLE | `export default`: `lazy` renders only the default export of the file

> [!PRINCIPLE]
> **Principle 3: Default Export: lazy Renders What the File Exports as default**
>
> *The file you pass to `import()` must export the component with `export default`; with a named export, `lazy` finds no component and the page goes blank.*
>
> When the promise of `import()` resolves, it holds one object with everything the file exports. React reads only the field named `default` of that object. A named export puts the panel under its own name, so `default` is missing, and the click on `Show stats` breaks the whole page. The fix is one word in `Stats.jsx`, not a change in `App.jsx`.
>
> **DO THIS:**
> ```jsx
> ~export default~ function Stats() { // lazy finds the panel under default
>   return <p>Views today: 120</p>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~export function~ Stats() { // **WRONG:** no default export, so lazy finds no component and the page goes blank
>   return <p>Views today: 120</p>;
> }
> ```

In our earlier plain JavaScript example, invoking `await import(...)` returned an object where we accessed `module.default()`. Dynamic imports do not return a single bare function; they return an object representing the entire exported namespace of that module.

> [!DEFINITION]
> **The module namespace object.** [NEW] The module namespace object is the object returned when a dynamic import promise resolves. It exposes every export of that module as a named property. MDN notes that this namespace object makes the default export available as a key called `default`. A named export appears under its identifier name, omitting the default property (Lesson 70).

React expects the target component on the default property. The official React documentation states that React will "render the resolved value's `.default` as a React component". It emphasizes: "Using this pattern requires that the lazy component you're importing was exported as the `default` export."

While static imports can easily import named exports using object destructuring, `lazy` requires a default export:

```jsx title="Two ways Stats.jsx can export the panel"
~export default~ function Stats() { return <p>Views today: 120</p>; } // 1. The object holds the panel under default: lazy finds it
~export function~ Stats() { return <p>Views today: 120</p>; } // 2. The object holds the panel under Stats: there is no default key
```

### Real mistake: switching a named export to `lazy`

Here is how this issue frequently occurs in development:
1. An engineer builds a component with a named export, imported into parent components using curly braces.
2. The engineer switches the parent import statement to `lazy`, but forgets to adjust the child file.
3. The user triggers the button to display the component.
4. The chunk downloads successfully, but the module namespace object lacks a `default` property. React encounters an invalid component type and crashes the render tree.

```page caption="The page after the click, when Stats.jsx has only a named export: React removed everything."
blank
```

```devconsole width=full caption="The Console after the click, when Stats.jsx has only a named export."
x Uncaught TypeError: Cannot convert object to primitive value
! An error occurred in one of your React components. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The error message does not clearly state that the default export was omitted. React attempted to log a warning regarding the invalid component type, and the browser runtime failed while converting the module object to a string. Identifying this problem requires understanding the contract expected by `lazy`.

The resolution requires editing the target component file rather than the consumer:

```jsx title="src/Stats.jsx"
~export default~ function Stats() { // The panel now sits under the key default, where lazy looks
  return <p>Views today: 120</p>;
}
```

```tree caption="Why the file passed to import must export the component as its default export."
What `import` hands to React
- +`export default function Stats` [`default`] | The object holds the panel **under the key `default`** | React **renders `Stats`**
- !`export function Stats` [`Stats`] | The object holds the panel **under the key `Stats`** | **No `default` key**: React has nothing to render and **the page goes blank**
```

Remember the module contract: `lazy` looks exclusively on the default key.

---

## PRINCIPLE | `lazy` caches the code: only the first render waits

> [!PRINCIPLE]
> **Principle 4: Cached: React Calls load Once, So Only the First Render Waits**
>
> *The first render of a lazy component shows the closest fallback while its code loads; React keeps the result and never calls `load` again, so every later render shows the component at once.*
>
> The author waits once, the first time they open the panel. React keeps the loaded panel, so closing and opening it again shows `Views today: 120` at once. A missing fallback on the second click is React reusing the code it already has, not a sign that the split failed. To watch the loading state again, reload the page.
>
> **DO THIS:**
> ```jsx
> const Stats = lazy(() => ~delayForDemo~(import('./Stats.jsx'))); // In the demo only: Loading stats... on the first open, then never again
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~import Stats from './Stats.jsx';~ // **WRONG:** switched back because the second open showed no fallback; every visitor downloads Stats again
> ```

### Slowing the load down so we can see the fallback

In local testing, the fallback message often disappears too rapidly to verify visually. The official React documentation demonstrates this pattern with an artificial delay helper named `delayForDemo`. We wrap the dynamic import with this helper at the bottom of the parent file:

```jsx title="src/App.jsx: the lazy line at the top and the helper at the bottom"
const Stats = lazy(() => ~delayForDemo~(import('./Stats.jsx'))); // Waits 2 seconds before handing over the code

function delayForDemo(promise) {
  return new Promise(resolve => {
    ~setTimeout(resolve, 2000)~; // Starts a 2-second timer
  }).then(() => promise); // Then gives back the promise of import()
}
```

This helper exists strictly for demonstration and testing purposes. In production code, you omit this artificial delay.

### The first click and the second click

Clicking the toggle button displays the fallback during the first render, but never on subsequent renders. The execution logic remains identical, but React's internal cache state changes:
1. The user clicks Show stats. React renders `<Stats />` for the first time and executes the `load` callback.
2. The delay helper waits two seconds. The component suspends and the boundary renders `Loading stats...`.
3. When the promise resolves, React renders the loaded component and displays the stats line.
4. The user clicks Hide stats. React unmounts the component and removes it from the DOM.
5. The user clicks Show stats again. React renders `<Stats />`, but skips calling `load`.
6. The stats line appears immediately. No fallback appears, despite the two-second delay helper remaining in code.

::: row caption="The same click on Show stats, the first time and the second time."
::: col title="First click on Show stats" tag="Loading stats... for 2 seconds"
```page size=mini
heading: Main Street park opens today
line: The park opens at noon.
line: [Hide stats]
line: Loading stats...
```
React calls `load`, waits two seconds, then shows the panel.
:::
::: col title="Second click on Show stats" tag="the panel at once" tone=good
```page size=mini
heading: Main Street park opens today
line: The park opens at noon.
line: [Hide stats]
line: Views today: 120 | good
```
React does not call `load`. The panel appears at once.
:::
:::

No custom logic was written to suppress the fallback on step 5. React automatically caches the result of the loader callback. The official documentation states: "Both the returned Promise and the Promise's resolved value will be cached, so React will not call `load` more than once." Because React already possesses the resolved component, the lazy component does not suspend, and `<Suspense>` does not display its fallback.

The browser module registry provides a second layer of caching. MDN explains that an ECMAScript module is never executed more than once, even if imported multiple times. The Network tab records a network request for the chunk on the initial click, and zero requests on subsequent clicks.

To observe the fallback UI again, the browser page must be refreshed. A page reload clears memory and resets all module caches.

```tree dir=right caption="The first click on Show stats loads the code; every later click uses what React kept."
Opening the stats panel twice
- +1. First click on Show stats | React **calls `load`** | `Loading stats...` for 2 seconds, then **`Views today: 120`**
- +2. Click on Hide stats | React **unmounts `Stats`** | The panel is gone; React **keeps the loaded code**
- +3. Second click on Show stats | React **does not call `load`** | **`Views today: 120` at once**, with no fallback
```

The author experiences a brief loading transition only on the initial interaction. All subsequent toggles render with the same speed as a statically imported component.

### Real mistake: giving up on `lazy` because the fallback disappeared

Here is a common confusion among developers:
1. An engineer implements `lazy` and tests the panel in the browser. The initial loading state flashes by almost imperceptibly.
2. The engineer toggles the panel closed and open again to inspect the loading state. No fallback appears.
3. The engineer assumes code splitting failed to function and reverts back to a static import.
4. All visitors are once again forced to download the secondary component upfront.

The developer overlooked that React intentionally cached the resolved module after the initial load. Refreshing the browser while using an artificial delay confirms the loading state functions properly.

Remember: React downloads and evaluates component chunks once. Only the initial render undergoes a network delay.

---

## PRINCIPLE | `lazy` at the top level of the file: one component for every render, so the panel stays on the screen

> [!PRINCIPLE]
> **Principle 5: Top Level: Call lazy Once, Outside Every Component**
>
> *Call `lazy` at the top level of the file; inside a component, it makes a new lazy component on every render, so the panel disappears behind its fallback on every update.*
>
> `lazy` makes a component, and a component is made once, at the top level of the file (Lesson 04). Inside `App`, every click on `Like` creates a new lazy `Stats` with nothing loaded, so the panel disappears behind `Loading stats...` until the new promise resolves. Above `App`, the same click changes only the like count, and the panel stays on the screen.
>
> **DO THIS:**
> ```jsx
> const Stats = ~lazy~(() => import('./Stats.jsx')); // Top level: one Stats for every render of App
> export default function App() {
>   return <Suspense fallback={<p>Loading stats...</p>}><Stats /></Suspense>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   const Stats = ~lazy~(() => import('./Stats.jsx')); // **WRONG:** a new Stats on every render brings back Loading stats...
>   return <Suspense fallback={<p>Loading stats...</p>}><Stats /></Suspense>;
> }
> ```

### The page grows: a Like button and two range buttons

Our application expands with two interactive elements. The article gains an interactive Like button with an incrementing counter. The stats panel gains two timeframe buttons, Today and This week, allowing the author to select their view:

```jsx title="src/Stats.jsx"
import { useState } from 'react';

export default function Stats() {
  const [~range~, setRange] = useState('today'); // Remembers which button the author chose
  return (
    <section>
      <button onClick={() => setRange('today')}>Today</button>
      <button onClick={() => setRange('week')}>This week</button>
      <p>{range === 'today' ? 'Views today: 120' : 'Views this week: 840'}</p>
    </section>
  );
}
```

### Two places for the `lazy` line

Where should the `lazy` declaration be placed? A developer might position the statement in one of two locations:

```jsx title="The lazy line above App"
const Stats = ~lazy~(() => import('./Stats.jsx')); // Runs once, when the file loads

export default function App() {
  const [likes, setLikes] = useState(3);
  return <button onClick={() => setLikes(likes + 1)}>Like ({likes})</button>;
}
```

```jsx title="The lazy line inside App"
export default function App() {
  const Stats = ~lazy~(() => import('./Stats.jsx')); // **WRONG:** runs again on every render of App
  const [likes, setLikes] = useState(3);
  return <button onClick={() => setLikes(likes + 1)}>Like ({likes})</button>;
}
```

Upon the first click on Show stats, both approaches display the fallback and eventually reveal the panel. However, the architectural difference becomes apparent during subsequent updates to the parent component:
1. **With `lazy` declared above `App`**, the call executes once during module evaluation. Every render pass of `App` references the same stable lazy component instance.
2. **With `lazy` declared inside `App`**, the function executes on every render pass. Each execution creates a brand-new lazy component instance with an uninitialized cache.

This trap mirrors the mistake of nesting component declarations inside other components (Lesson 04). Because each new lazy instance possesses an empty internal cache, React must invoke its loader function and suspend until the promise resolves.

The official React documentation specifies the proper location: always declare lazy components at the top level of your module.

### What the author sees when they click Like

Declaring `lazy` inside a parent component causes child panels to vanish behind fallbacks on every unrelated update. Consider what occurs when `lazy` sits inside `App` with the demo delay in place:

The author opens the panel and selects This week:

```page caption="With lazy inside App: the page after the author opens the panel and chooses This week."
heading: Main Street park opens today
line: The park opens at noon.
line: [Like (3)] [Hide stats]
line: [Today] [This week]
line: Views this week: 840 | good
```

Next, the author clicks the Like button:
1. State increments, prompting React to re-render `App`.
2. Re-rendering `App` executes `lazy` again, creating an entirely new component wrapper. Because this instance is fresh, its internal cache is empty.
3. React attempts to render the new component and invokes its loader, causing the component to suspend.
4. Because this update was triggered by standard user interaction, the boundary falls back to displaying `Loading stats...` (Lesson 69).
5. When the promise resolves, React re-renders the panel and restores the selected timeframe.

```page caption="With lazy inside App: the page right after the author clicks Like."
heading: Main Street park opens today
line: The park opens at noon.
line: [Like (4)] [Hide stats]
line: Loading stats... | bad
```

```page caption="With lazy inside App: two seconds later, the panel comes back, still on This week."
heading: Main Street park opens today
line: The park opens at noon.
line: [Like (4)] [Hide stats]
line: [Today] [This week]
line: Views this week: 840
```

Notice that the repeated loading state appears even though the browser already holds the JavaScript file in memory. The Network tab records no new HTTP request because the browser cache satisfies the import. The delay occurs entirely because React must reconcile an uninitialized lazy wrapper instance.

When `lazy` is placed at the top level of the module, clicking Like updates only the button:

```page caption="With lazy above App: after the author clicks Like, the panel stays on the screen with This week."
heading: Main Street park opens today
line: The park opens at noon.
line: [Like (4)] [Hide stats]
line: [Today] [This week]
line: Views this week: 840 | good
```

```tree caption="The same lazy line above App or inside App, and what the panel shows after a click on Like."
Where the `lazy` line sits
- +Above `App`, at the top level of the file | `lazy` runs **once**, when the file loads | After a click on Like, the panel **stays on the screen** with `Views this week: 840`
- !Inside `App` | `lazy` runs **on every render** and returns a **new lazy component** | After a click on Like: **`Loading stats...` again**, then the panel comes back
```

### Real mistake: moving `lazy` next to the state lines

Here is how this bug typically introduces itself:
1. A developer moves `lazy` into the component body alongside state hooks for perceived organizational neatness.
2. The initial load works as expected, and the code passes basic manual testing.
3. In production, users interact with other controls on the page while viewing the panel.
4. The panel flickers behind a loading fallback on every state update across the page.
5. Developers mistakenly search for bugs inside the child component, when moving one line outside the component solves the problem.

The React documentation establishes a clear standard: "Do not declare `lazy` components *inside* other components. Instead, always declare them at the top level of your module."

Remember: `lazy` creates a component definition. Define it once at the module top level.

---

## All 5 Principles Together

### The complete files

Here are the complete source files for the finished feature. Three core standards make it function seamlessly:
1. The `lazy` declaration sits at the module top level, outside the `App` component.
2. The stats component file exports its function using `export default`.
3. A `<Suspense>` boundary wraps the `<Stats />` element with an informative fallback.

The temporary demo delay helper is removed for production use. The entry file remains identical to the start of the lesson.

```jsx title="src/App.jsx"
import { useState, Suspense, lazy } from 'react';

const Stats = ~lazy~(() => import('./Stats.jsx')); // Principles 2 and 5: one lazy Stats, at the top level

export default function App() {
  const [showStats, setShowStats] = useState(false);
  const [likes, setLikes] = useState(3);
  return (
    <>
      <h1>Main Street park opens today</h1>
      <p>The park opens at noon.</p>
      <button onClick={() => setLikes(likes + 1)}>Like ({likes})</button>
      <button onClick={() => setShowStats(!showStats)}>
        {showStats ? 'Hide stats' : 'Show stats'}
      </button>
      {showStats && (
        <~Suspense fallback={<p>Loading stats...</p>}~> {/* Principles 2 and 4: shown only on the first open */}
          <Stats />
        </Suspense>
      )}
    </>
  );
}
```

```jsx title="src/Stats.jsx"
import { useState } from 'react';

~export default~ function Stats() { // Principle 3: the default export that lazy renders
  const [range, setRange] = useState('today');
  return (
    <section>
      <button onClick={() => setRange('today')}>Today</button>
      <button onClick={() => setRange('week')}>This week</button>
      <p>{range === 'today' ? 'Views today: 120' : 'Views this week: 840'}</p>
    </section>
  );
}
```

```page caption="The finished page after the author opens the panel, chooses This week, and likes the article."
heading: Main Street park opens today
line: The park opens at noon.
line: [Like (4)] [Hide stats]
line: [Today] [This week]
line: Views this week: 840 | good
console: quiet
```

### How React renders the page from the first visit to the second open

When the page loads, React renders `App` while the stats code remains unrequested on the server. The code downloads only upon clicking Show stats, and React caches it for all subsequent renders:

```tree dir=right caption="The order in which React renders App and the lazy Stats panel, from the first visit to the second open."
From the first visit to the second open of the panel
- +1. The page loads | React renders **`App` only** | The browser has **not asked for `Stats.jsx`**
- +2. First click on Show stats | React tries to render `Stats` and **calls `load`** | `Stats` suspends: **`Loading stats...`**
- +3. The code arrives | React **renders `Stats`** | **`Views today: 120`**
- +4. Click on Like | React renders `App` again with the **same `Stats`** | The panel **stays on the screen**
- +5. Hide, then Show stats again | React **does not call `load`** | The panel appears **at once**
```

### The habit that hurts, and the rule

| Principle | The habit that hurts | The React rule |
| :--- | :--- | :--- |
| **1. Static import** | Hide a rarely used panel with `&&` and believe it is never downloaded | The `import` line loads its file with the page; change that line to keep the code off the visitor's phone |
| **2. lazy** | Switch to `lazy` and leave out `<Suspense>` | Write `lazy(() => import('./Stats.jsx'))`, and wrap the tag in `<Suspense>` with a `fallback` |
| **3. Default export** | Switch to `lazy` and leave the component as a named export | Export the component with `export default`, because React renders the `default` key |
| **4. Cached** | Test twice in the same tab, see no fallback, and remove `lazy` | React calls `load` once and keeps the result; reload the page to see the fallback again |
| **5. Top level** | Put the `lazy` line inside the component, next to its state | Call `lazy` at the top level of the file, so every render uses the same component |

Keep the guiding standard of this lesson in focus. **A static import at the top downloads code during page load, whereas `lazy` defers downloading until React renders the component.**

---

## For the Interview

> **The Interview Question:** How do you code-split a component and load it on demand with lazy?

### How to Answer Clearly in 30 Seconds

"A top-level static import bundles a component directly into the initial payload, even if it remains hidden behind conditional JSX. To code-split a component, I replace that static import with `const Stats = lazy(() => import('./Stats.jsx'))`. The dynamic `import()` marks a bundle chunk boundary for the bundler, and React invokes that loader function only when `<Stats />` first renders. Four essential practices ensure it works reliably:
1. **Export as default**: React renders the `default` export property of the resolved module object.
2. **Provide Suspense**: while the chunk is in transit, the lazy component suspends, requiring a `<Suspense>` boundary with a `fallback` prop.
3. **Rely on caching**: React and the browser cache the loaded chunk after the initial fetch, so subsequent renders paint immediately.
4. **Declare at the module top level**: declaring `lazy` inside a parent component recreates the lazy wrapper on every render pass, resetting the cache and repeatedly flashing the fallback."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What happens if the chunk fails to load, for example due to a dropped network connection?"**
   The promise returned by dynamic `import()` rejects on network error. The official React documentation specifies: "If the Promise rejects, React will `throw` the rejection reason for the nearest Error Boundary to handle." In production applications, lazy components must be wrapped in an Error Boundary alongside `<Suspense>` to display recovery UI instead of crashing the page (Lesson 72).
2. **"My component uses a named export. Can I still code-split it using `lazy`?"**
   Yes. React requires that the promise resolves to an object whose `default` property points to a valid React component. You can chain `.then()` on the dynamic import: `lazy(() => import('./Stats.jsx').then(module => ({ default: module.Stats })))`. In most codebases, refactoring the file to provide an explicit default export is the cleaner approach.
3. **"Should you split every component using `lazy`?"**
   No. Code splitting adds latency on the initial render of each chunk. The official documentation warns that excessive splitting can make loading slower than having no code splitting at all. If a lazy component fetches data after mounting, it creates a network waterfall: the user waits for JavaScript, and then waits for data (Lesson 46). Split heavy, low-traffic views like admin panels, modals, and complex charts, while keeping above-the-fold content in the main bundle.

```tree caption="When to split a component with lazy, and when to keep the static import line."
Should this component use `lazy`?
- +Split it with `lazy` | Only **some users** open it, or it opens **after a click** | The author's **stats panel**, an admin screen, an editor's preview
- !Keep the static `import` | **Every visitor** sees it as soon as the page loads | The **title and text** of the article; splitting them only **adds a wait**
```
