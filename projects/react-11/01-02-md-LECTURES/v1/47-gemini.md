# Lecture 47: What StrictMode Runs Twice in Development

*(Why does React run some of your code twice in development, and what is it looking for?)*

> INTERVIEW QUESTION | ❱❱ MORE | Why does React run your components, effects, and ref callbacks twice in development, and how does StrictMode audit your code?

---

## VS | One Run in Production vs. Two Runs Under `<StrictMode>`: correct code gives the same page both ways

> When you start a new React project, a wrapper called `<StrictMode>` surrounds your application in the entry file. **In development, it runs some of your code twice on purpose, making a doubled tile or an extra connection look like a React bug.** Instead of removing the wrapper, you should fix what it reveals with pure renders and cleanups, because those exact flaws will otherwise reach your users in production.

In Lesson 14, placing a log inside a component body caused the browser console to print that message twice during development. That behavior comes directly from `<StrictMode>`. Modern project templates automatically wrap the root component in this helper inside the main entry file:

```jsx title="src/main.jsx"
import { ~StrictMode~ } from 'react'; // A named export of the react package
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  ~<StrictMode>~ {/* Turns on the checks for App and every component inside it */}
    <App />
  </StrictMode>
);
```

> [!DEFINITION]
> **What is StrictMode?** [REVIEW] `<StrictMode>` is a built-in React component that activates development-only audits for every component inside its subtree.
> 1. It renders no DOM elements and does not alter the layout or styling of your application.
> 2. In development, it intentionally invokes component render functions, Effect lifecycles, and ref callbacks twice to uncover impure rendering and missing cleanup functions.
> 3. In production, it is completely inert, adding zero overhead and executing every function exactly once (Lesson 14).

Double invocation during development is not limited to logging. **In development, React intentionally runs three kinds of your code one extra time:**
1. **Your component calculations.** React calls the component function twice and discards the intermediate result, preserving the output of the second run. This verifies that your render logic is pure and does not mutate existing data.
2. **Your Effects.** Immediately after a component mounts, React runs the cleanup of each Effect, followed immediately by its setup again. This verifies that your Effect properly tears down subscriptions and connections.
3. **Your ref callbacks.** React executes ref callbacks, runs their cleanups, and runs the callbacks again when attaching DOM elements. Principle 4 examines these callbacks in detail.

React performs this cycle to simulate real production events that users trigger later:
1. The duplicate render simulates a component re-rendering in response to state updates, prop changes, or parent updates.
2. The extra Effect cleanup and setup simulates a user navigating away from a screen and then returning, which unmounts and remounts the component.
3. The extra ref callback cycle simulates an element leaving and re-entering the DOM during dynamic interface updates.

Reliable code behaves identically whether a routine runs once or twice. Code that mutates existing variables during render, or leaves network connections open, reveals its flaws immediately on the very first page load. Removing `<StrictMode>` does not resolve these defects. It merely conceals them until production users trigger them through real navigation and state changes. The official React documentation emphasizes that fixing a component so it survives StrictMode also eliminates subtle bugs before they reach production.

Remember the central lesson of this chapter: **StrictMode does not create bugs. It exposes the bugs that already exist in your code, right on initial load, so you can fix them before your users ever see them.**

### A Doubled Tile That Looks Like a React Bug

Consider a concrete scenario. A developer builds a stories tray at the top of a social media feed. The tray should display three circular tiles: John's Story, Mia's Story, and Create Story. In addition, the component maintains a live real-time connection to a stories server. Upon starting the local development server and opening the browser, two distinct defects appear on the very first page load:

```page width=full caption="The stories tray on the first load with npm run dev: Create Story appears twice, and two connections are open."
line: John's Story
line: Mia's Story
line: Create Story
line: Create Story | bad
console: Encountered two children with the same key, `create`. Keys should be unique so that components maintain their identity across updates.
log: Connected. Active connections: 1 | stories.js:7
log: Connected. Active connections: 2 | stories.js:7
```

To an unsuspecting developer, this looks like React itself is broken. A common mistake is to blame React for duplicate execution and delete `<StrictMode>` from the main entry file. Removing the wrapper silences the console warning and temporarily displays three tiles on screen, but every underlying bug remains unfixed in the codebase.

React did not invent the duplicate tile or the leaked connection. Both issues stem directly from flawed component code. StrictMode merely exposed those flaws on initial load, and this lesson demonstrates how to identify and repair each one.

```tree caption="Each extra run of StrictMode in development copies something a real user makes React do later in production."
What StrictMode repeats on the first load in development
- +An extra render [`StoryTray`] | Copies **the component rendering again** after any update | A render that changes old data shows **its change twice**
- +An extra cleanup and setup for each Effect [`useEffect`] | Copies **the user leaving the page and coming back** | A missing cleanup leaves **one more connection open**
- +An extra cleanup and setup for each ref callback [`ref`] | Copies **an element leaving the page and coming back** | A missing cleanup leaves **old nodes in a list**
```

### The Rule of Thumb: can the user tell one run from two?

Whenever you observe a function executing twice in development, apply this standard: **Can the user detect any difference between a single execution and a repeated execution? If the user observes duplicate visual elements, duplicate network transactions, or accumulated memory leaks, your code contains a bug. You must make the render pure or provide a proper cleanup function. If the operation produces identical results without unwanted side effects, the duplicate execution is harmless and expected.**

The official React documentation defines this exact test for Effects: users should never notice any difference between running setup once versus running setup, cleanup, and setup again.

Experienced developers watch for three common mistakes:
1. **Deleting `<StrictMode>`.** This silences development warnings without fixing the root cause, allowing broken lifecycles to reach production users.
2. **Suppressing the second run with a mutable ref.** Storing a boolean flag in a ref skips the second execution in development, but it leaves the missing cleanup unaddressed when real unmounts happen later.
3. **Interpreting an empty dependency array as once per application lifetime.** An empty dependency array means once per component mount, and users frequently mount and unmount components across page interactions.

## SECTION | A Stories Tray with Three Tiles

Our example application is the stories tray. Each tile is rendered as an `<li>` element. Below the tiles, a row of buttons scrolls the tray to any individual story. This lesson builds the feature across four files:

```files title="stories-tray: File Explorer" caption="The four files of the stories tray inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `StrictMode` and `App`, and mounts `<App />` inside `<StrictMode>`
  App.jsx | parent | Holds `stories` in state and renders `<StoryTray stories={stories} />`
  StoryTray.jsx | default export | Renders the tiles, connects to the stories server, and keeps the tile nodes for the scroll buttons
  stories.js | named export | Exports `createConnection`, a small stand-in for the stories server that counts the open connections
```

The main entry file wraps the root in `<StrictMode>`. The application component stores two stories in state and passes that array down to the tray:

```jsx title="src/App.jsx"
import { useState } from 'react';
import StoryTray from './StoryTray.jsx';

export default function App() {
  const [stories] = useState([
    { id: 'john', label: "John's Story" },
    { id: 'mia', label: "Mia's Story" },
  ]);
  return ~<StoryTray stories={stories} />~; // Passes the same array that state holds
}
```

The story tray component expands step by step. Each principle introduces one piece of logic, first displaying its flaw and then implementing its fix.

**PRINCIPLES:** `<StrictMode>` runs your code one extra time in development, and correct code survives the repeat. Five principles follow:
1. **Principle 1: StrictMode Checks Only the Components Inside It.** It turns on four checks, only in development, and it takes no props.
2. **Principle 2: A Pure Render Shows One Create Story Tile.** React calls the component twice, so a render that changes an array it received changes it twice.
3. **Principle 3: An Effect Cleanup Leaves One Connection.** React runs one extra cleanup and setup, so an Effect without a cleanup leaves two connections open.
4. **Principle 4: A Ref Callback Cleanup Keeps One Node per Tile.** React runs one extra cleanup and setup for ref callbacks too, so a list of nodes grows to six.
5. **Principle 5: Keep StrictMode On.** Removing it makes the Console look right, and the open connection still reaches users.

---

## PRINCIPLE | `<StrictMode>`: only the components inside it get the checks, and only in development

> [!PRINCIPLE]
> **Principle 1: StrictMode Scope: StrictMode Checks Only the Components Inside It**
>
> *Wrap the whole app in `<StrictMode>` in `main.jsx`; React then runs the four checks for every component inside it, and only in development.*
>
> In development, `<StrictMode>` adds an extra render, an extra Effect cleanup and setup, an extra ref callback cleanup and setup, and warnings for deprecated APIs. In production, it does nothing, so users never pay for it. It checks only the components inside it, and it takes no props, so nothing inside it can turn it off. When it wraps only one part of the app, React skips the extra Effect run on the first mount, because that run could never happen in production.
>
> **DO THIS:**
> ```jsx
> root.render(
>   ~<StrictMode>~ {/* Checks App and every component inside it */}
>     <App />
>   </StrictMode>
> );
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> root.render(
>   <>
>     <Header />
>     ~<StrictMode>~<Content /></StrictMode> {/* **WRONG:** in a new app, Header and Footer get no checks at all */}
>     <Footer />
>   </>
> );
> ```

`<StrictMode>` is a component that renders no visible DOM elements. Like other container elements, it never appears in the Elements panel of browser developer tools (Lesson 04). Its sole purpose is activating four development audits:
1. **An extra render.** React calls each component function a second time to uncover renders that are not pure.
2. **An extra cleanup and setup for every Effect.** React simulates an immediate remount to detect Effects missing a cleanup function.
3. **An extra cleanup and setup for every ref callback.** React verifies that ref callbacks properly clean up registered DOM nodes.
4. **Warnings for deprecated APIs.** React flags obsolete features scheduled for removal, such as legacy lifecycle methods in class components.

These audits reach every component nested beneath `<StrictMode>`, regardless of depth in the tree. Compiling a production build with `npm run build` removes these checks completely, guaranteeing that development audits never slow down user interactions in production.

```tree caption="The four checks that StrictMode turns on in development for every component inside it."
What `<StrictMode>` turns on in development
- +1. An extra render [`StoryTray`] | Finds **renders that are not pure**
- +2. An extra cleanup and setup for every Effect [`useEffect`] | Finds **a missing Effect cleanup**
- +3. An extra cleanup and setup for every ref callback [`ref`] | Finds **a missing ref cleanup**
- +4. Warnings for deprecated APIs [`UNSAFE_componentWillMount`] | Finds **old class component methods**
```

### VS | Around the Whole App vs. Around One Part: only the whole app gets the extra Effect run

You can also place `<StrictMode>` around a specific subtree of your application. Here is an example from the official documentation with the wrapper placed exclusively around the main content area:

```jsx title="StrictMode around one part of the app"
export default function App() {
  return (
    <>
      <Header />
      ~<StrictMode>~ {/* Checks only Sidebar and Content */}
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

Placing the wrapper around a subtree modifies which audits execute:
1. The header and footer render only once in development because they reside outside the wrapper.
2. The sidebar and content components render twice in development because they reside inside the wrapper.
3. An Effect inside the content component runs its setup only once on initial mount, skipping the extra cleanup and setup cycle.

Why does React skip the extra Effect remount when wrapping only part of the tree? On an initial page load in production, child components never unmount and remount in isolation while their parent components remain untouched. Simulating a remount for an isolated child subtree would introduce artificial lifecycle sequences that never occur in real user sessions. React only simulates behaviors that are physically possible in production.

When `<StrictMode>` wraps the entire application root, every component and Effect across the page participates together. This accurately mirrors what happens when a user navigates away from a route and returns later: the entire view unmounts and remounts as a unified unit.

```tree caption="StrictMode around the whole app versus around one part of it."
Where `<StrictMode>` sits
- +Around the whole app [`<StrictMode><App /></StrictMode>`] | **Every component** gets the extra render | **Every Effect** gets the extra cleanup and setup on the first mount
- !Around one part only [`<StrictMode><main>...</main></StrictMode>`] | `Header` and `Footer` **get no checks** | Effects inside **skip the extra run** on the first mount
```

### No Props, So Nothing Inside Can Turn It Off

`<StrictMode>` accepts no configuration props, and React provides no opt-out mechanism for child components nested beneath it. If a component tree is wrapped in `<StrictMode>`, every component within that tree undergoes these development checks. When separate teams share a codebase and disagree on strict checks, React advises moving the wrapper down to specific subtrees or establishing team consensus.

For all new applications, the official recommendation is wrapping the complete component hierarchy at the root level in the main entry file. If you use a full-stack framework that manages root creation for you, configure StrictMode through the framework configuration settings (Lesson 46).

---

## PRINCIPLE | `stories.slice()`: two calls of the component give the same three tiles

> [!PRINCIPLE]
> **Principle 2: Double Rendering: A Pure Render Shows One Create Story Tile**
>
> *Keep every render pure: copy an array or object you received before you change it, so two calls give the same result.*
>
> In development, React calls the component body twice, and also the functions passed to `useState`, `set` functions, `useMemo`, and `useReducer`, and keeps one result. A pure render shows no difference. A render that changes an array it received, such as a prop from `App`, changes it twice, so the tray shows Create Story twice. Without StrictMode, the same render adds one more tile on every later render.
>
> **DO THIS:**
> ```jsx
> function StoryTray({ stories }) {
>   const items = ~stories.slice()~; // A copy: every call gives John, Mia, and one Create Story
>   items.push({ id: 'create', label: 'Create Story' });
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function StoryTray({ stories }) {
>   const items = stories;
>   items.~push~({ id: 'create', label: 'Create Story' }); // **WRONG:** changes App's array, so every render adds one more tile
> }
> ```

> [!DEFINITION]
> **What is a pure component?** [REVIEW] A pure component returns the same JSX for the same props and state, and it changes nothing that existed before it was called. You can call it once or ten times, and the result is the same. That is why React can call it twice in development without any harm (Lesson 14).

### A Tray That Adds Its Own Create Story Tile

The tray needs an action tile at the end of the list to let users create a new story. Here is the initial version of the story tray component:

```jsx title="src/StoryTray.jsx"
export default function StoryTray({ stories }) {
  const items = ~stories~; // Looks like a new list, but it is the same array that App passed
  items.~push~({ id: 'create', label: 'Create Story' }); // Adds the tile to App's own array
  return (
    <ul className="tray">
      {items.map((story) => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
```

Upon loading the page in development, the Create Story tile appears twice:

```page width=full caption="The tray with const items = stories in development: Create Story appears twice."
line: John's Story
line: Mia's Story
line: Create Story
line: Create Story | bad
console: Encountered two children with the same key, `create`. Keys should be unique so that components maintain their identity across updates.
```

The `push` operation executes twice because React calls `StoryTray` twice in development. Here is the exact order of events on initial load:
1. The parent component supplies the `stories` prop containing John's Story and Mia's Story.
2. React executes `StoryTray` for the first time. The `push` method appends Create Story to that array, increasing its length to three.
3. StrictMode calls `StoryTray` a second time with the exact same prop reference. The second call invokes `push` again on that same array, increasing its length to four.
4. React displays the output of the second execution, rendering four tiles. Because two elements share the identical key `create`, React prints a console warning alerting you to duplicate keys.

This behavior highlights standard JavaScript reference semantics. In JavaScript, assigning an array to a new variable name does not create a copy. Writing `const items = stories` merely creates a second reference pointing to the array stored in state. Calling `push` on that reference directly mutates the incoming prop, and props in React are strictly read-only (Lesson 08). The official documentation classifies any component that mutates external variables as impure because running it multiple times produces conflicting results.

### VS | `const items = stories` vs. `stories.slice()`: the same array vs. a new copy

The solution is appending the new item to a shallow copy of the array rather than mutating the original prop. Here are the two approaches contrasted:

```jsx title="The same array, and a copy"
const items = ~stories~; // The same array: each call adds one more tile to App's state
const items = ~stories.slice()~; // A new copy: each call starts again from John and Mia
```

Invoking `slice()` without arguments returns a fresh array containing the existing elements. Both render calls now start from the original two items, produce a clean array of three items, and leave the parent state untouched.

You can also use the array spread syntax to achieve the exact same result in a single expression (Lesson 19):

```jsx title="Copy, then add, in two ways"
const items = stories.slice(); items.push({ id: 'create', label: 'Create Story' }); // Copy, then add
const items = ~[...stories, { id: 'create', label: 'Create Story' }]~; // Copy and add in one line
```

Both patterns produce a new three-item array during each execution without mutating existing data, ensuring that calling the component once or twice yields identical output.

```page width=full caption="The tray with stories.slice in development: three tiles, and a quiet Console."
line: John's Story
line: Mia's Story
line: Create Story | good
console: quiet
```

### Without StrictMode, the Extra Tile Only Waits

If you turn off StrictMode, the flawed component appears to work correctly on initial load. React calls `StoryTray` once, and the browser displays three tiles.

However, the underlying defect remains active. Every time an unrelated state change in the parent triggers a re-render, `StoryTray` executes again with the same array reference. The `push` method appends another Create Story item, creating a fourth tile, then a fifth. StrictMode exposes this mutation immediately on initial load, before users ever encounter it.

```tree caption="The same impure StoryTray with and without StrictMode."
`const items = stories` with `push`
- !With StrictMode in development | React calls `StoryTray` **twice on the first load** | **Two Create Story tiles** at once
- !Without StrictMode in production | React calls `StoryTray` **once on the first load** | **One more Create Story** on every later render
```

### What React Calls Twice, and What It Never Calls Twice

In development, React intentionally invokes several functions twice:
1. Component render bodies, excluding code inside event handlers.
2. Functions supplied to `useState` and `useMemo`.
3. State updater functions passed to state setters (Lesson 16).
4. Reducer functions supplied to `useReducer` (Lesson 27).

React uses the outcome of one execution and discards the other. Pure functions produce identical results across both passes, making the duplicate invocation completely invisible to the user.

**React never executes event handlers twice.** Event handlers respond to explicit user gestures, such as button clicks, and are designed to perform side effects. They run exactly once per interaction in both development and production.

If you place a `console.log` statement inside the body of `StoryTray`, it prints twice in development. When React Developer Tools is active, the browser console dims the output from the second execution to indicate an automated audit.

---

## PRINCIPLE | `return () => connection.disconnect()`: setup, cleanup, setup leaves one connection

> [!PRINCIPLE]
> **Principle 3: Effect Remount: An Effect Cleanup Leaves One Connection**
>
> *Return a cleanup that undoes what the setup did, so setup, cleanup, setup leaves the same result as one setup.*
>
> In development, React runs one extra cleanup and setup for every Effect right after the first mount, while the state and the DOM stay as they are. An Effect that connects without a cleanup ends at two active connections. In production, the same Effect opens one more connection every time the user leaves the tray and comes back. A cleanup that disconnects makes the extra run invisible to the user.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection();
>   connection.connect();
>   ~return () => connection.disconnect()~; // Setup, cleanup, setup leaves one connection
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection();
>   ~connection.connect()~; // **WRONG:** no cleanup, so every new mount leaves one more connection open
> }, []);
> ```

> [!DEFINITION]
> **What is an Effect cleanup?** [REVIEW] The setup is the function you pass to `useEffect`. React runs it after the component appears on the screen. If the setup returns a function, that function is the cleanup. React runs the cleanup when the component leaves the screen, so the cleanup must undo what the setup started: disconnect what it connected, stop what it started (Lesson 32).

### An Effect That Connects to the Stories Server

The stories tray maintains an open connection to the stories server while visible on screen. To model this connection, a lightweight module tracks and logs active connections:

```js title="src/stories.js"
let connections = 0;

export function createConnection() {
  return {
    connect() {
      ~connections = connections + 1~; // A real implementation would connect to the server
      console.log('Connected. Active connections: ' + connections);
    },
    disconnect() {
      ~connections = connections - 1~; // A real implementation would close the connection
      console.log('Disconnected. Active connections: ' + connections);
    },
  };
}
```

Inside the story tray component file, an Effect with an empty dependency array initiates this connection when the component mounts:

```jsx title="src/StoryTray.jsx, the Effect without a cleanup"
useEffect(() => {
  const connection = createConnection();
  ~connection.connect()~; // Opens the connection, and nothing ever closes it
}, []);
```

Upon loading the page, the console displays two active connections:

```page width=full caption="The tray with an Effect and no cleanup in development: the Console ends at two active connections."
line: John's Story
line: Mia's Story
line: Create Story
log: Connected. Active connections: 1 | stories.js:7
log: Connected. Active connections: 2 | stories.js:7
```

These two log entries result from a single component mount followed by StrictMode running an extra cleanup and setup cycle:
1. React mounts `StoryTray` and executes the setup function. The connection opens, reporting one active connection.
2. StrictMode executes the cleanup function of the Effect. Because no cleanup was returned, nothing disconnects.
3. StrictMode executes the setup function a second time. The connection opens again, reporting two active connections.

This sequence does not mean the web page loaded twice. The page loaded once, and React preserved the DOM and component state throughout. StrictMode merely exercised the Effect lifecycle by running setup, cleanup, and setup again.

An empty dependency array continues to mean run once per component mount (Lesson 32). StrictMode adds an immediate cleanup and remount cycle in development to confirm that setup actions can be cleanly reversed.

### VS | No Cleanup vs. a Cleanup That Disconnects: two connections vs. one

The fix requires returning a cleanup function that reverses what the setup initiated. Because the setup calls `connect`, the cleanup must call `disconnect`:

```jsx title="src/StoryTray.jsx" startLine="7"
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    ~return () => connection.disconnect()~; // Closes this connection before the next setup
  }, []);
```

```page width=full caption="The tray with the cleanup in development: connect, disconnect, connect, and one active connection at the end."
line: John's Story
line: Mia's Story
line: Create Story
log: Connected. Active connections: 1 | stories.js:7
log: Disconnected. Active connections: 0 | stories.js:11
log: Connected. Active connections: 1 | stories.js:7
```

With the cleanup in place, the lifecycle balances: connect, disconnect, and connect again. The sequence concludes with exactly one active connection.

For the user, one setup in production and setup, cleanup, setup in development produce the exact same outcome: an interface with a single active connection. The official documentation describes this duplicate cycle as a stress test proving that an Effect can survive repeated mounting and unmounting.

### Without StrictMode, the Connections Pile Up

Disabling StrictMode suppresses the second connection log, showing one active connection. However, the resource leak remains:
1. The user navigates to another page, causing React to unmount `StoryTray`. Without a cleanup function, the connection stays open in the background.
2. The user navigates back to the stories tray. React mounts `StoryTray` again, and its setup opens a second connection.
3. Every subsequent navigation leaves another connection open indefinitely.

As users navigate across the application, abandoned connections accumulate, consuming network sockets and degrading performance. StrictMode surfaces this missing cleanup immediately on initial load.

Remember that cleanup functions also execute whenever Effect dependencies change, ensuring obsolete subscriptions close before new ones open (Lesson 35).

---

## PRINCIPLE | Ref callback: its cleanup removes the node, so three tiles keep three nodes

> [!PRINCIPLE]
> **Principle 4: Ref Callback Cleanup: A Ref Callback Cleanup Keeps One Node per Tile**
>
> *Return a cleanup from every ref callback that removes exactly what the callback added.*
>
> React calls a ref callback with the DOM node when it adds the element to the page, and calls the returned cleanup when it removes the element. In development, StrictMode runs one extra cleanup and setup for every ref callback. A callback that pushes its node into a list, with a cleanup that removes nothing, leaves six nodes for three tiles. In production, the same list grows on every render and keeps the nodes of tiles that are gone.
>
> **DO THIS:**
> ```jsx
> <li
>   ref={(node) => {
>     itemsRef.current.push(node);
>     return () => {
>       const list = itemsRef.current;
>       ~list.splice(list.indexOf(node), 1)~; // Removes the node it added: three, zero, three
>     };
>   }}
> />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <li
>   ref={(node) => {
>     itemsRef.current.push(node);
>     return ~() => {}~; // **WRONG:** removes nothing, so the list holds six nodes for three tiles
>   }}
> />
> ```

### A Function in the `ref` Attribute

In Lesson 31, passing a ref object to an element's `ref` prop allowed React to store the corresponding DOM node inside its `current` property.

The `ref` attribute also accepts a function instead of an object. When you pass a function, React does not assign to a property; it directly invokes your callback, passing the underlying DOM node as an argument:

```jsx title="A function in the ref attribute"
<div
  ref={~(node) => {~ // React calls this with the div's DOM node when it adds the div to the page
    console.log('Attached', node);
    return ~() => {~ // React calls this when it removes the div from the page
      console.log('Clean up', node);
    };
  }}
/>
```

> [!DEFINITION]
> **What is a ref callback?** [NEW] A ref callback is a function you pass to the `ref` attribute. A callback is a function you hand over for someone else to call later, and here React calls it, never your code. When React adds the element to the page, the docs say the ref "gets attached": React calls your function with the DOM node. When React removes the element, the ref "is detached": React calls the cleanup your function returned. React 19 added this cleanup (Lesson 47).

A ref callback has both a setup and a cleanup phase, just like an Effect. StrictMode audits ref callbacks using the exact same cycle. In development, the console logs Attached, Clean up, and Attached again for this single element.

### Why the Tray Needs a Ref Callback

The stories tray requires navigation buttons that smoothly scroll the container to any selected story tile using `scrollIntoView`. To perform this scroll, the component must access the DOM element of each tile in an ordered collection.

You cannot call `useRef` inside a loop or mapping function because React forbids calling Hooks inside loops or conditions (Lesson 31). Instead, the component creates a single ref holding an array (Lesson 30):

```jsx title="src/StoryTray.jsx" startLine="5"
  const itemsRef = ~useRef([])~; // One list for the DOM nodes of all the tiles
```

Below the tiles, a navigation bar renders one button per story, invoking `scrollToStory` with the item index:

```jsx title="The scroll buttons below the tray, in src/StoryTray.jsx"
<nav>
  {items.map((story, index) => (
    <button
      key={story.id}
      ~onClick={() => scrollToStory(index)}~ // Mia's button calls scrollToStory with 1
    >
      {story.label}
    </button>
  ))}
</nav>
```

The `scrollToStory` function retrieves the DOM node at the specified index and scrolls it into view:

```jsx title="src/StoryTray.jsx" startLine="16"
  function scrollToStory(index) {
    const list = itemsRef.current;
    console.log('Tiles in the list: ' + list.length);
    ~list[index].scrollIntoView~({ behavior: 'smooth', inline: 'center' }); // Scrolls the tray to the tile at index
  }
```

Each tile attaches a ref callback that pushes its DOM node into the array. In this initial implementation, the returned cleanup function is empty:

```jsx title="src/StoryTray.jsx, the ref callback with an empty cleanup"
{items.map((story) => (
  <li
    key={story.id}
    ref={(node) => {
      ~itemsRef.current.push(node)~; // Adds this tile's node to the list
      return ~() => {}~; // **WRONG:** the cleanup removes nothing from the list
    }}
  >
    {story.label}
  </li>
))}
```

### Three Tiles, Six Nodes in the List

Clicking a story button successfully scrolls to the tile, but the console reveals that the tracking array contains six entries for only three tiles:

```page width=full caption="The tray with an empty ref cleanup in development, after the user clicks Mia's Story: the tray scrolls, and the list holds six nodes."
line: John's Story
line: Mia's Story | good
line: Create Story
line: [John's Story] [Mia's Story] [Create Story]
log: Connected. Active connections: 1 | stories.js:7
log: Disconnected. Active connections: 0 | stories.js:11
log: Connected. Active connections: 1 | stories.js:7
log: Tiles in the list: 6 | StoryTray.jsx:18
```

Although the interface appears to function initially, the internal array has doubled in size:
1. React inserts the three tiles into the document and executes each ref callback. The array now holds three DOM nodes.
2. StrictMode executes the cleanup function of each callback. Because the cleanup is empty, no nodes are removed.
3. StrictMode executes each ref callback a second time. Each callback pushes its DOM node again, resulting in six entries.

The scroll button still reached Mia's Story because the first three entries happened to be valid, making this bug easy to overlook during casual testing.

### VS | An Empty Cleanup vs. a Cleanup That Removes the Node: six nodes vs. three

The fix requires returning a cleanup function that removes the exact DOM node that was added. Using `indexOf` finds the node position, and `splice` removes that single item from the array:

```jsx title="src/StoryTray.jsx" startLine="28"
            ref={(node) => {
              itemsRef.current.push(node);
              return () => {
                const list = itemsRef.current;
                ~list.splice(list.indexOf(node), 1)~; // Removes this tile's node from the list
              };
            }}
```

```page width=full caption="The tray with the ref cleanup in development, after the user clicks Mia's Story: the list holds three nodes."
line: John's Story
line: Mia's Story | good
line: Create Story
line: [John's Story] [Mia's Story] [Create Story]
log: Connected. Active connections: 1 | stories.js:7
log: Disconnected. Active connections: 0 | stories.js:11
log: Connected. Active connections: 1 | stories.js:7
log: Tiles in the list: 3 | StoryTray.jsx:18
```

Now the lifecycle balances cleanly: adding three nodes, removing three nodes, and adding three nodes again. The array reliably maintains exactly one entry for each tile currently on the page.

### Without StrictMode, the List Grows on Every Render

Disabling StrictMode temporarily masks the bug, starting with three items in the list. However, serious problems emerge as the application runs:
1. The ref callback is defined as an inline arrow function inside the mapping loop, creating a new function instance on every render.
2. On each re-render, React runs the cleanup of the previous callback and executes the new callback with the same node.
3. With an empty cleanup, every single re-render pushes another three nodes into the array.
4. When stories expire or leave the tray, their orphaned DOM nodes remain trapped in the array. Subsequent button clicks attempt to scroll to elements that no longer exist in the document.

Retaining unneeded DOM references creates a memory leak. StrictMode catches this lifecycle imbalance immediately, before broken navigation reaches production users.

---

## PRINCIPLE | `<StrictMode>` stays on: removing it hides the open connection, it does not close it

> [!PRINCIPLE]
> **Principle 5: Keep StrictMode On: Removing StrictMode Hides the Open Connection**
>
> *Fix what StrictMode shows with a pure render or a cleanup; never remove StrictMode or block the second run to make the Console quiet.*
>
> Without StrictMode, an Effect with no cleanup shows one connection on the first load, just as the fixed Effect does. The bug is still there: each time the user leaves the tray and comes back, one more connection stays open in production. A ref that blocks the second setup hides the bug in the same way. A doubled line is a bug only when the user sees it or pays for it twice.
>
> **DO THIS:**
> ```jsx
> root.render(
>   ~<StrictMode>~ {/* Keeps the test on; the Effect returns a cleanup that disconnects */}
>     <App />
>   </StrictMode>
> );
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> root.render(~<App />~); // **WRONG:** the Console goes quiet, and the missing cleanup reaches every user
> ```

### VS | Removing StrictMode vs. Adding the Cleanup: the same Console on the first load, only one survives the user's next visit

Recall the uncleaned Effect from Principle 3. Confronted with duplicate connection logs in development, a developer might attempt two different approaches:
1. Remove `<StrictMode>` from the main entry file and leave the Effect without a cleanup.
2. Keep `<StrictMode>` and provide a proper cleanup function that disconnects.

```jsx title="Removing StrictMode, and keeping it"
root.render(~<App />~); // StrictMode removed: the Effect still has no cleanup
root.render(~<StrictMode><App /></StrictMode>~); // StrictMode kept: the Effect now disconnects in its cleanup
```

On initial load, both approaches display one active connection:

::: row caption="On the first load, the Console ends at one active connection with StrictMode removed and with the cleanup added."
::: col title="StrictMode removed, no cleanup" tag="the bug is hidden" tone=bad
```page size=mini
line: John's Story
line: Mia's Story
line: Create Story
line: [John's Story] [Mia's Story] [Create Story]
log: Connected. Active connections: 1 | stories.js:7
```
No extra run tests the Effect, so nothing shows the missing cleanup.
:::
::: col title="StrictMode kept, cleanup added" tag="the bug is fixed" tone=good
```page size=mini
line: John's Story
line: Mia's Story
line: Create Story
line: [John's Story] [Mia's Story] [Create Story]
log: Connected. Active connections: 1 | stories.js:7
log: Disconnected. Active connections: 0 | stories.js:11
log: Connected. Active connections: 1 | stories.js:7
```
The extra run proves that the cleanup closes the first connection.
:::
:::

Both console outputs display one connection, giving an illusion of equivalence. But they behave very differently after navigation. When a user in production navigates away from the feed and returns:
1. The user opens the feed, establishing one connection.
2. The user navigates to another page. React unmounts `StoryTray`, but without a cleanup, the connection stays open.
3. The user returns to the feed. React remounts `StoryTray`, opening a second connection.

The second connection stems from user navigation: the exact unmount and remount cycle that StrictMode simulated in development. Removing `<StrictMode>` removed the diagnostic test, not the underlying bug.

| The developer's choice | Console on the first load | After the user leaves the tray and comes back |
| :--- | :--- | :--- |
| **StrictMode removed, no cleanup** | `Active connections: 1` | `Active connections: 2`, and one more with every visit |
| **StrictMode kept, cleanup added** | `Active connections: 1` after connect, disconnect, connect | `Active connections: 1` |

### A Ref That Blocks the Second Setup Hides the Bug Too

Another common antipattern involves storing a connection or boolean flag in a ref to bypass the second setup execution (Lesson 32):

```jsx title="A ref that blocks the second setup"
const connectionRef = useRef(null);

useEffect(() => {
  if (~!connectionRef.current~) { // **WRONG:** skips the second setup, and still never disconnects
    connectionRef.current = createConnection();
    connectionRef.current.connect();
  }
}, []);
```

This suppresses the duplicate log in development, but it fails to address the underlying lifecycle issue. When the user navigates away and returns in production, the connection still fails to disconnect, accumulating leaked sockets. The official documentation emphasizes that the goal is never finding a trick to run an Effect once, but ensuring the Effect behaves correctly when remounted.

### VS | A Double That Is Expected vs. a Double That Is a Bug: ask what the user sees

Not every duplicate log or operation requires code modification. Apply the core standard: does the duplicate execution introduce unintended user-facing side effects or duplicate transactions?
1. **Data fetching with an ignore boolean.** Two network requests appear in the Network tab during development, but the cleanup sets an `ignore` flag so only the final response updates state. In production, only one request is dispatched (Lesson 33). This is normal and expected.
2. **Analytics page visits from `logVisit`.** Development logs two visit events, but production sends only one (Lesson 35). React documentation recommends leaving this code as is.
3. **Transactional operations and purchases.** Executing a purchase inside an Effect is a critical bug because remounting triggers duplicate transactions. Financial operations belong exclusively inside event handlers, such as a checkout button click handler, which React never executes twice (Lesson 32).

Application-wide initialization that must run strictly once per browser session belongs outside component lifecycles, either at module scope or guarded by a top-level module variable like `didInit`.

---

## All 5 Principles Together

### The Complete Stories Tray

Here are the four complete files for the finished story tray. The main entry file keeps `<StrictMode>`, and the tray component incorporates all three fixes: copying with `slice`, the Effect cleanup, and the ref callback cleanup.

```jsx title="src/main.jsx"
import { ~StrictMode~ } from 'react'; // Principles 1 and 5: kept, so the checks stay on in development
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```jsx title="src/App.jsx"
import { useState } from 'react';
import StoryTray from './StoryTray.jsx';

export default function App() {
  const [stories] = useState([
    { id: 'john', label: "John's Story" },
    { id: 'mia', label: "Mia's Story" },
  ]);
  return <StoryTray stories={stories} />;
}
```

```js title="src/stories.js"
let connections = 0;

export function createConnection() {
  return {
    connect() {
      connections = connections + 1;
      console.log('Connected. Active connections: ' + connections);
    },
    disconnect() {
      connections = connections - 1;
      console.log('Disconnected. Active connections: ' + connections);
    },
  };
}
```

```jsx title="src/StoryTray.jsx"
import { useEffect, useRef } from 'react';
import { createConnection } from './stories.js';

export default function StoryTray({ stories }) {
  const itemsRef = useRef([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    ~return () => connection.disconnect()~; // Principle 3: setup, cleanup, setup leaves one connection
  }, []);

  const items = ~stories.slice()~; // Principle 2: a copy, so both renders give three tiles
  items.push({ id: 'create', label: 'Create Story' });

  function scrollToStory(index) {
    const list = itemsRef.current;
    console.log('Tiles in the list: ' + list.length);
    list[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  return (
    <section>
      <ul className="tray">
        {items.map((story) => (
          <li
            key={story.id}
            ref={(node) => {
              itemsRef.current.push(node);
              return () => {
                const list = itemsRef.current;
                ~list.splice(list.indexOf(node), 1)~; // Principle 4: removes the node it added
              };
            }}
          >
            {story.label}
          </li>
        ))}
      </ul>
      <nav>
        {items.map((story, index) => (
          <button key={story.id} onClick={() => scrollToStory(index)}>
            {story.label}
          </button>
        ))}
      </nav>
    </section>
  );
}
```

```page width=full caption="The finished tray in development, after the user clicks Mia's Story: three tiles, one connection, and three nodes in the list."
line: John's Story
line: Mia's Story | good
line: Create Story
line: [John's Story] [Mia's Story] [Create Story]
log: Connected. Active connections: 1 | stories.js:7
log: Disconnected. Active connections: 0 | stories.js:11
log: Connected. Active connections: 1 | stories.js:7
log: Tiles in the list: 3 | StoryTray.jsx:18
```

### What React Runs on the First Load in Development

The entry file renders `<StrictMode>`, and React reconciles the components from the top down. Every step repeated by StrictMode produces consistent results across both executions:

```tree dir=right caption="The order in which React runs the code of the tray on the first load in development, and what StrictMode repeats at each step."
What React runs inside `<StrictMode>` on the first load
- +1. `App` is called twice [`App`] | Holds `stories` in state | Passes the **same array** to `StoryTray` both times
- +2. `StoryTray` is called twice [`stories.slice`] | Copies `stories` and adds Create Story | Both calls give **three tiles**
- +3. The first setup [`ref` `useEffect`] | Each `<li>` adds its node, then the Effect connects | **Three nodes** and **one connection**
- +4. The extra cleanup [`ref` `useEffect`] | Each `<li>` removes its node, then the Effect disconnects | **Zero nodes** and **zero connections**
- +5. The extra setup [`ref` `useEffect`] | Each `<li>` adds its node again, then the Effect connects again | The list ends at **three nodes**, and the Console at **one active connection**
```

| What StrictMode repeats in development | What a user makes React do later in production | The bug it shows | The fix |
| :--- | :--- | :--- | :--- |
| **An extra render** | Any update that renders the tray again | Create Story twice, from `push` on the array `App` passed | Copy with `slice` or the spread before adding |
| **An extra Effect cleanup and setup** | Leaving the page and coming back | Two active connections | A cleanup that calls `disconnect` |
| **An extra ref callback cleanup and setup** | A tile leaving the page and coming back | Six nodes in the list for three tiles | A cleanup that removes the node with `splice` |
| **No extra run at all, with StrictMode removed** | The same navigation, with no test before it | A quiet Console and a connection left open | Keep StrictMode on and fix the code |

Remember the central lesson of this chapter. **StrictMode does not create bugs. It exposes the bugs that already exist in your code, right on initial load, so you can fix them before your users ever see them.**

---

## For the Interview

> **The Interview Question:** Why does React run your components, effects, and ref callbacks twice in development, and how does StrictMode audit your code?

### How to Answer Clearly in 30 Seconds

"In development, `<StrictMode>` runs parts of our code an extra time on purpose to catch bugs that real users would encounter later in production. It activates four audits for every component inside its tree:
1. **An extra render.** React invokes component render functions twice and keeps one result, and does the same for functions passed to `useState`, state setters, `useMemo`, and `useReducer`. Pure calculations yield identical output. Event handlers never run twice.
2. **An extra cleanup and setup for every Effect.** This simulates a user navigating away and returning, exposing missing cleanup functions like unclosed connections.
3. **An extra cleanup and setup for every ref callback.** This verifies that DOM node attachments are properly cleaned up upon detachment.
4. **Warnings for deprecated APIs.**

The bugs exposed by StrictMode already exist in the codebase. The correct fix is writing code that survives repeated execution with pure rendering and cleanups, never removing `<StrictMode>`. In production builds, StrictMode is completely inert and incurs zero overhead."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"My Effect has an empty dependency array, yet it runs twice. How do I make it run once?"**
   We do not attempt to force it to run once. An empty dependency array means run once per mount, and StrictMode adds an extra cleanup and setup cycle immediately after the initial mount in development. Bypassing the second execution using a mutable ref merely hides the defect. In production, users navigate away from pages and return, and an Effect lacking a cleanup leaves leaked connections open on every visit. The official documentation frames the question properly: not how to run an Effect once, but how to ensure it works correctly when remounted. We return a cleanup function that undoes the setup. Logic that must run strictly once per application startup belongs outside all components at module scope, or guarded by a module-level variable like `didInit`.
2. **"Does StrictMode slow down the app or change anything in production?"**
   No. All four audits run exclusively during local development, and production bundles compiled with `npm run build` omit them completely. StrictMode renders no DOM nodes and adds zero runtime overhead in production. Because development renders every component twice, performance profiling should always be measured on production builds rather than in development.
3. **"What changes if you wrap only one part of the app in StrictMode?"**
   Only components within that wrapped subtree receive development audits, while components outside render only once. React also omits the extra Effect cleanup and remount cycle on initial mount for that subtree. Simulating a remount for child components while their parent components remain stationary cannot happen in production, and React only simulates lifecycles that can actually occur. Because `<StrictMode>` accepts no props, components inside cannot selectively opt out. The recommended standard for all new projects is wrapping the entire application root.

```tree dir=right caption="Interview summary: the wrong and the right way to respond to a doubled line in development."
A doubled line in development
- !Hide it [`<App />` `connectionRef`] | The Console goes quiet | The bug **reaches every user** in production
- +Fix it [`stories.slice` `connection.disconnect`] | Setup, cleanup, setup gives **the same result as one setup** | The page is **the same in development and production**
```
