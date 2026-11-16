# Lecture 82: How the Three Rules of React Keep a Stories Tray Working

*(If React, not your code, calls your components, what must your code promise React?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | What are the Rules of React, and how do the three rules interlock?

---

## VS | Writing the Tag vs. Calling the Component Yourself: both run the same function, only the tag lets React do the calling

> In plain JavaScript, you write a function and decide when to call it. **In React, you write the component, but React calls it on its own schedule and keeps its state between renders**. This introduces the three Rules of React: let React do the calling, change nothing outside the call, and call Hooks in the same order every time.

Remember a plain function call? You write `greet('John')`, and the function runs once, right there, because your code called it:

```js title="Plain JavaScript: you call the function"
~greet('John')~; // Runs once, right now, because your code called it
```

A component is also a function. It accepts props and returns JSX (Lesson 04). But your application code almost never invokes it directly. You write a JSX element tag, and React executes the component function for you:

```jsx title="React: you write a tag, and React calls the function"
return ~<Greeting name="John" />~; // React calls Greeting, when it decides and as often as it decides
```

When does React invoke your component? It executes on initial page mount. It runs again after any state update inside the component or anywhere above it. In development mode, Strict Mode deliberately executes the component function twice per render to catch unintended side effects. You define the function once. React evaluates it repeatedly on its own schedule.

> [!DEFINITION]
> **What is Strict Mode?** [REVIEW] `<StrictMode>` is a built-in React component that wraps your application in the root entry file.
> In development, it executes every component render function twice to reveal bugs caused by impure calculations.
> In production, it incurs zero runtime overhead and renders each component once (Lesson 47).

### Three Rules, One Fact

Because React controls component execution rather than your application code, your components must respect three foundational contracts. The official documentation defines these contracts as the **Rules of React**:
1. **React calls Components and Hooks.** You write a JSX tag such as `<StoryTray />`. You never execute the component function directly, and you never pass a Hook around as a regular runtime value.
2. **Components and Hooks must be pure.** Because React can execute a component repeatedly at any time, a render pass must never mutate variables or data structures that existed before it ran.
3. **Rules of Hooks.** The state hook accepts no unique label or name. React associates each Hook with its stored state by counting execution order. Therefore, every render pass must execute the exact same Hooks in the exact same sequence.

The official documentation lists purity first. This lesson begins with component invocation because who executes the component explains why purity and Hook ordering are required. These principles are strict runtime requirements rather than optional style preferences. Violating any rule leads directly to subtle defects or application crashes.

```tree caption="The three Rules of React, each one side of the same fact: React runs the components, not your code."
React runs your components, so your code keeps three rules
- +React calls Components and Hooks [`<StoryTray />`] | Your code **writes a tag** | React decides **when and how often** to call the function
- +Components and Hooks must be pure | React may call a component **again** | One call **changes nothing** that existed before it ran
- +Rules of Hooks [`useState`] | React finds each Hook's state **by counting the calls** | Every render calls the **same Hooks in the same order**
```

### The Rule of Thumb: a tag for every component, nothing changed, Hooks at the top

**Write every component as a JSX tag. Inside that component, construct new data structures rather than mutating incoming values. Always call Hooks at the top level of a component function, never inside a loop or conditional branch.**

Developers frequently treat these three rules as isolated tips. In practice, they operate as an interdependent system. Consider a common mistake where a table requires local state for each row. A developer moves `useState` inside a dedicated `Row` component to satisfy the Rules of Hooks. Then, inside the parent loop, they invoke the component function directly:

```jsx title="Calling Row as a function, and writing its tag, inside the same map"
{items.map(item => ~Row({ item })~)} {/* Your code calls Row: its useState runs inside this loop */}
{items.map(item => ~<Row key={item.id} item={item} />~)} {/* React calls Row: each row keeps its own state */}
```

Both lines display identical visual markup on initial mount. However, only the second pattern is safe. Direct invocation breaks the requirement that React must execute component functions. That violation immediately corrupts Hook call order across renders. The following real-world scenario demonstrates the physical failure on screen.

---

## SECTION | A Stories Tray with Two Taps

Social applications commonly display a horizontal stories tray at the top of the interface. The tray presents individual story tiles for contacts, such as Ankit and Taylor, followed by an action tile labeled Create Story. In code, each tile renders as a list item element. In the completed user interface, each list item contains an interactive button:

```page caption="The stories tray when the page opens: two story tiles and the Create Story tile."
line: [Ankit's Story]
line: [Taylor's Story]
line: [Create Story]
```

The user performs two distinct actions on this interface:
1. The user clicks a friend's story, displaying a seen label on that tile.
2. The user clicks Create Story, inserting a new tile labeled My Story directly before the action button.

```page caption="The same tray after the user taps Ankit's Story and then taps Create Story."
line: [Ankit's Story (seen)] | good
line: [Taylor's Story]
line: [My Story] | good
line: [Create Story]
```

The official React documentation uses this exact scenario to demonstrate purity failures. The implementation spans four modular files in the source tree:

```files title="stories-tray: File Explorer" caption="How the four files of the stories tray sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Renders `<App />` inside `<StrictMode>`
  App.jsx | parent | Holds `stories` in state and renders `<StoryTray>`
  StoryTray.jsx | child | Renders one tile per story and the Create Story tile
  StoryTile.jsx | child | From Principle 3 on: holds `seen` for one story
```

Here is how breaking each rule affects the user interface:
1. **Violating component purity** causes the tray to render duplicate Create Story tiles during development. In production, initial load appears normal, but every subsequent render appends an additional duplicate tile.
2. **Violating Hook call rules** permits clicking existing story tiles normally. However, clicking Create Story immediately crashes the render pass, replacing the entire user interface with an empty screen.
3. **Invoking a component function directly** inside a loop attaches child Hooks to the parent component. Clicking Create Story triggers the identical blank-screen crash.

**PRINCIPLES:** React executes the component functions, each render pass leaves existing data unchanged, and Hook calls follow a stable sequence. Five core principles govern this implementation:
1. **Principle 1: React Calls StoryTray From Its Tag.** Writing `<StoryTray />` delegates scheduling to React. Direct function execution returns identical initial HTML, but deprives React of component metadata.
2. **Principle 2: A Render Builds a New Array and Changes Nothing It Received.** Mutating the stories prop with an array push alters parent state directly. In development, the double render of Strict Mode produces a duplicate Create Story tile.
3. **Principle 3: useState Inside map Blanks the Page When the List Grows.** React indexes Hooks by execution count. Adding an item increases the number of Hook calls, causing React to abort rendering with a fatal error.
4. **Principle 4: StoryTile Called as a Function Runs Its useState in StoryTray.** Executing a child component directly runs its state Hook in the parent loop. Breaking the invocation rule directly corrupts Hook ordering.
5. **Principle 5: Strict Mode Runs the Code, the Linter Reads It.** Strict Mode exposes impure renders dynamically in the browser. The ESLint plugin inspects code statically and flags invalid Hook usage during editing.

---

## PRINCIPLE | `<StoryTray />`: React calls the component, so React decides when and how often it runs

> [!PRINCIPLE]
> **Principle 1: React Calls Components and Hooks: Use a Component Only as a JSX Tag**
>
> *Write a component as a tag, such as `<StoryTray stories={stories} />`, and never call it as a function, so React decides when and how often it runs.*
>
> Direct execution such as `StoryTray({ stories })` outputs identical markup on initial render, concealing the mistake. However, React never registers the component instance. Because React only receives the returned HTML elements, it cannot attach local state, match elements by component type, yield to the browser main thread, display the component in developer tools, or skip unneeded renders.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   const [stories, setStories] = useState(initialStories);
>   return ~<StoryTray stories={stories} />~; // React calls StoryTray during render
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   const [stories, setStories] = useState(initialStories);
>   return ~StoryTray({ stories })~; // **WRONG:** App calls StoryTray itself, React only sees the list
> }
> ```

The `StoryTray` component is a JavaScript function that returns JSX elements. Inside the parent component, two approaches can display the tray on screen: authoring a JSX element tag, or invoking the function directly in application code:

```jsx title="Writing the StoryTray tag, and calling StoryTray as a function"
return ~<StoryTray stories={stories} />~; // React calls StoryTray when it renders App
return ~StoryTray({ stories })~; // App calls StoryTray itself and hands React only the list
```

Both techniques execute the identical function using the same array input. Both paint the same initial tiles, leaving the browser console completely clear of runtime warnings:

```page caption="With the tag or with the direct call, the first load shows the same two stories."
line: Ankit's Story
line: Taylor's Story
```

```devconsole width=full caption="The Console on the first load, with the tag or with the direct call: no messages."
= No messages
```

Despite identical visual output, a critical architectural difference exists: **who executes `StoryTray`.**
- **Using a JSX tag**, the parent provides an element descriptor to React. React manages scheduling and executes the function during its reconciliation cycle.
- **Using direct invocation**, the parent executes the function immediately as an inline JavaScript call during its own render. React never creates a component instance for `StoryTray`, receiving only the raw list elements that return from the call.

The official React documentation summarizes this model: React must decide when your component function is called during rendering. In React, you do this using JSX.

```tree caption="Two ways to run StoryTray: write its tag so React calls it, or call it from App as a plain function."
Who calls `StoryTray`?
- +React calls it [`<StoryTray stories={stories} />`] | `App` **writes a tag** | React decides **when and how often** `StoryTray` runs
- !Your code calls it | `App` runs the function **as a plain call** | React only gets **the returned list**, never a `StoryTray` component
```

### What React gives a component only when React does the calling

Why does execution ownership matter when initial output looks identical? When React manages execution, it creates an internal fiber record representing that component. That record provides five essential runtime capabilities that direct function calls lose completely:
1. **Isolated component state.** React binds Hook state to the component node at its exact position in the render tree (Lesson 25).
2. **Type reconciliation.** React evaluates component type across renders to determine whether to preserve existing DOM state or mount a fresh tree (Lesson 77).
3. **Responsive rendering.** React can pause execution between component fibers to yield to the browser main thread. This cooperative multitasking keeps page scrolling and tap interactions responsive.
4. **Developer tools integration.** React Developer Tools inspects and visualizes component nodes only when React owns their creation (Lesson 64).
5. **Selective re-rendering.** React inspects props to skip rendering unchanged subtrees, conserving computing resources (Lesson 55).

In this initial implementation, direct function execution causes no immediate crash because the tray component contains no local Hooks. Principle 4 illustrates the catastrophic failure that occurs as soon as the invoked function relies on state.

### The first version of the tray

The application entry point wraps the root component in `<StrictMode>`, mirroring the official documentation example:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* In development, calls each component twice on every render */}
    <App />
  </StrictMode>
);
```

The parent component preserves the initial stories collection in local state and renders the tray tag:

```jsx title="src/App.jsx"
import { useState } from 'react';
import StoryTray from './StoryTray.jsx';

const initialStories = [
  { id: 0, label: "Ankit's Story" },
  { id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState(initialStories);
  return ~<StoryTray stories={stories} />~; // React calls StoryTray with { stories }
}
```

The tray component iterates through the collection and returns a list item for each story:

```jsx title="src/StoryTray.jsx"
export default function StoryTray({ ~stories~ }) { // Comes from the stories attribute on App's tag
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
```

Where does the collection parameter originate inside the child component? Application code never passes arguments directly. The parent assigns the array to a JSX attribute on the tray tag. React packs that attribute into the props object and delivers it when calling the component function (Lesson 08).

### A Hook is never passed around as a value

The same restriction applies to Hooks. Because Hooks are standard JavaScript functions, a programmer might attempt to pass a Hook as a component prop, or dynamically generate a Hook using higher-order functions during runtime. The official React documentation explicitly prohibits treating Hooks as ordinary values:

```jsx title="Two ways to pass a Hook around as a value"
<Button ~useData={useDataWithLogging}~ /> {/* **WRONG:** a Hook passed down as a prop */}
const useDataWithLogging = ~withLogging(useData)~; // **WRONG:** a function builds a new Hook while the app runs
```

When a Hook requires shared behavior, such as diagnostic logging, declare a dedicated custom Hook function at module scope (Lesson 39). Passing Hooks as dynamic values breaks static code comprehension and prevents compilers from optimizing component execution safely.

Always remember: your code writes the element tag, and React manages function execution.

---

## PRINCIPLE | `[...stories]`: each render builds its own new array, so every call gives the same tray

> [!PRINCIPLE]
> **Principle 2: Components and Hooks Must Be Pure: A Render Changes Nothing It Received**
>
> *A render changes nothing that existed before it ran, props and state included; to add an item, build a new array during the render.*
>
> React may execute a component function multiple times for a single view, and Strict Mode enforces this intentionally in development. The assignment `const items = stories` copies only an object reference, so `push` modifies state in `App` directly. Every render pass appends another tile. Generating a fresh array with spread syntax confines modifications to that specific pass, ensuring consistent output across renders.
>
> **DO THIS:**
> ```jsx
> function StoryTray({ stories }) {
>   const items = ~[...stories, { id: 'create', label: 'Create Story' }]~; // New array: the same three tiles on every call
>   return <ul>{items.map(story => <li key={story.id}>{story.label}</li>)}</ul>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function StoryTray({ stories }) {
>   ~stories.push~({ id: 'create', label: 'Create Story' }); // **WRONG:** changes App's state, one more tile on every call
>   return <ul>{stories.map(story => <li key={story.id}>{story.label}</li>)}</ul>;
> }
> ```

React invokes `StoryTray` whenever the interface requires an update. Because rendering can repeat at any time, identical inputs must always produce identical visual output.

The tray requires a trailing action tile for creating stories. A common mistake is invoking the array `push` method to append the new item directly onto the incoming collection:

```jsx title="src/StoryTray.jsx"
export default function StoryTray({ stories }) {
  const items = ~stories~; // items is a second name for App's own array
  ~items.push~({ id: 'create', label: 'Create Story' }); // **WRONG:** adds a tile to App's state
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
```

The source code appends the item once. However, the browser displays duplicate action tiles immediately upon loading:

```page caption="The first load in development: the tray shows Create Story twice."
line: Ankit's Story
line: Taylor's Story
line: Create Story
line: Create Story | bad
```

```devconsole width=full caption="The Console on the first load: React warns about two items with the same key."
x Encountered two children with the same key, `create`. Keys should be unique so that components maintain their identity across updates.
```

**The push operation did not modify an isolated copy. It mutated the array stored in parent state, while Strict Mode executed the tray component twice.** Here is the runtime sequence on initial load:
1. React executes `StoryTray` once, and `push` appends Create Story to the end of the collection.
2. In development, Strict Mode immediately executes `StoryTray` a second time using the identical array reference.
3. Because that array already contains the newly appended item, the second execution appends another tile.
4. The rendered interface displays both appended tiles. Because both list items carry the identical key value, React logs a duplicate key warning to the console.

In production environments, Strict Mode is inactive (Lesson 47). Initial page load appears visually correct, hiding the underlying mutation. However, every time the parent component re-renders, the mutation appends yet another tile, causing the list to grow indefinitely.

> [!DEFINITION]
> **What is a pure component?** [NEW] In software engineering, a pure function produces identical output whenever provided with identical inputs, without causing external side effects. A pure React component adheres to three core rules.
> First, it is deterministic: given identical props, state, and context, it always returns the exact same JSX tree.
> Second, it introduces zero side effects during render: it never mutates the DOM, dispatches network requests, or alters external variables while executing.
> Third, it leaves pre-existing data untouched: it never mutates objects, arrays, or references that existed before the current render pass.
> Mutating props with `push` violates determinism and immutability: the identical input produces three items on the first execution and four items on the second (Lesson 14).

### `const items = stories` is not a copy

The defect originates in the reference assignment `const items = stories`. Programmers frequently assume this creates an isolated local array. In JavaScript, arrays are objects stored on the heap, and variable assignment copies only the reference pointer. Both variables point to the exact same array in memory. Contrast that reference alias with creating an independent array during render:

```jsx title="A second name for the same array, and a new array made in this call"
const items = ~stories~; // Same array as App's state: push changes App's state
const items = ~[...stories, { id: 'create', label: 'Create Story' }]~; // New array made in this call: safe to build
```

The decisive distinction is where the array was allocated in memory:
- **With reference assignment**, the array was allocated by the parent before this render pass. Mutating that reference directly alters parent state.
- **With array spread syntax**, a brand new array is allocated during the current render pass (Lesson 19). No external component holds a reference to this fresh instance. Mutating an object created entirely within the current render execution is a permitted local mutation (Lesson 14).

The official React documentation defines props and state as immutable snapshots for each render pass. A render pass may freely transform objects it creates locally, but it must never alter data structures received from the outside.

```tree caption="Where the array was made decides whether StoryTray may change it."
Two ways to add the Create Story tile
- !A second name for the prop [`const items = stories`] | The array was **made by `App`** before this render | `push` changes **`App`'s state**, so every call adds **one more tile**
- +A new array made in this call [`[...stories]`] | The array is **made during this render** | Every call builds the **same three tiles** from the same `stories`
```

### The fixed tray

The corrected component creates a fresh array using array spread syntax on each render pass:

```jsx title="src/StoryTray.jsx"
export default function StoryTray({ stories }) {
  const items = ~[...stories, { id: 'create', label: 'Create Story' }]~; // A new array made in this call
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
```

Strict Mode continues to execute `StoryTray` twice in development. However, each execution constructs its own separate array instance from the untouched props collection, guaranteeing identical output across both passes:

```page caption="The first load in development after the fix: one Create Story tile."
line: Ankit's Story
line: Taylor's Story
line: Create Story | good
```

```devconsole width=full caption="The Console after the fix: no messages."
= No messages
```

The purity requirement strictly prohibits three additional operations during component rendering:
1. **Reading non-deterministic values**, such as `new Date()` or `Math.random()`. Because each call produces different output, the render pass is no longer reproducible.
2. **Directly mutating external DOM nodes**, such as assigning to `document.title` within the component body. DOM mutations are side effects that belong exclusively in event handlers or `useEffect` (Lesson 32).
3. **Mutating values after passing them to Hooks or JSX elements.** Once passed into framework APIs, data structures must remain immutable.

Always remember: a pure render constructs fresh data structures and never modifies received data.

---

## PRINCIPLE | `useState` inside `map`: one more story makes one more Hook call, and the page goes blank

> [!PRINCIPLE]
> **Principle 3: Rules of Hooks: Call the Same Hooks in the Same Order on Every Render**
>
> *Call Hooks only at the top level of a component or a custom Hook, never inside a loop; when each item needs its own state, give each item its own component.*
>
> `useState` takes no name, so React finds the state of each Hook only by counting the calls of a component, in order. A `useState` inside `map` makes the count follow the length of the list. Every tap works until the list grows. Then React finds one more Hook than before, and the page goes blank.
>
> **DO THIS:**
> ```jsx
> function StoryTile({ story }) {
>   const [seen, setSeen] = ~useState(false)~; // One call per tile on every render
>   return <li><button onClick={() => setSeen(true)}>{story.label}{seen && ' (seen)'}</button></li>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function StoryTray({ stories }) {
>   return <ul>{stories.map(story => {
>     const [seen, setSeen] = ~useState(false)~; // **WRONG:** one more call when a story is added, the page goes blank
>     return <li key={story.id}>{story.label}</li>;
>   })}</ul>;
> }
> ```

Each story tile requires individual interaction tracking: when the user clicks a tile, it displays a seen status. A common developer instinct is calling `useState` directly inside the iteration loop:

```jsx title="useState called once per story, inside the map"
{stories.map(story => {
  const [seen, setSeen] = ~useState(false)~; // **WRONG:** one Hook call per story, inside a loop
  return <li key={story.id}>{story.label}</li>;
})}
```

Notice that `useState(false)` accepts no key or identifier parameter. How does React know which state value belongs to which tile? React tracks Hooks purely by sequential execution order. The first Hook call receives the first state slot, and the second call receives the second. Each subsequent call increments an internal index counter.

The React documentation describes this internal mechanism: React maintains an array of state pairs for every component. It also maintains the current pair index, which resets to zero before rendering. Each time a Hook executes, React retrieves the state pair at the current index and increments the counter.

> [!DEFINITION]
> **What are the Rules of Hooks?** [REVIEW] Always invoke Hooks at the top level of component functions or custom Hooks.
> Never call Hooks inside loops, conditions, or nested functions, and never execute them after an early return statement.
> React maps Hook calls to persistent state slots using execution order. Every render pass of a component must execute the identical sequence of Hooks (Lesson 38).

```tree dir=right caption="React matches each useState call in StoryTray to a state pair by counting the calls, starting from pair 0."
How React finds the state of each `useState` call in `StoryTray`
- +Render with two stories | 1st call gets **pair 0**, for Ankit | 2nd call gets **pair 1**, for Taylor
- !Render with three stories | Pairs 0 and 1 **match** | The 3rd call asks for **pair 2**, which **does not exist**
```

### Every tap works, until the list grows

To support creating stories, the parent component defines an event handler that appends a story item, passing the callback to the tray as `onCreate` (Lesson 23):

```jsx title="src/App.jsx" startLine="9"
export default function App() {
  const [stories, setStories] = useState(initialStories);

  function ~handleCreate~() { // Adds My Story with the next id
    setStories([...stories, { id: stories.length, label: 'My Story' }]);
  }

  return <StoryTray stories={stories} ~onCreate={handleCreate}~ />; // The tray calls onCreate on a tap
}
```

The action tile renders a button wired to the creation handler. The intermediate array calculation from Principle 2 is no longer needed. Each story item renders as a button with `useState` invoked directly inside the collection loop:

```jsx title="src/StoryTray.jsx"
import { useState } from 'react';

export default function StoryTray({ stories, onCreate }) {
  return (
    <ul>
      {stories.map(story => {
        const [seen, setSeen] = ~useState(false)~; // **WRONG:** the number of calls follows the number of stories
        return (
          <li key={story.id}>
            <button onClick={() => setSeen(true)}>
              {story.label}{seen && ' (seen)'}
            </button>
          </li>
        );
      })}
      <li>
        <button ~onClick={onCreate}~>Create Story</button> {/* Asks App to add My Story */}
      </li>
    </ul>
  );
}
```

The user clicks Ankit's Story, and the button displays the seen indicator without error:

```page caption="After the user taps Ankit's Story: the tile shows it was seen."
line: [Ankit's Story (seen)] | good
line: [Taylor's Story]
line: [Create Story]
```

Next, the user clicks Create Story. The entire screen goes completely blank:

```page caption="After the user taps Create Story: the whole page is blank."
empty: the whole page is blank
```

```devconsole width=full caption="The Console after the tap on Create Story: a warning about the order of Hooks, then the error that removes the page."
x React has detected a change in the order of Hooks called by StoryTray. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks
  Previous render            Next render
  1. useState                useState
  2. useState                useState
  3. undefined               useState
x Uncaught Error: Rendered more hooks than during the previous render.
! An error occurred in the <StoryTray> component.
  Consider adding an error boundary to your tree to customize error handling behavior.
  Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

**Interacting with existing stories succeeds, but adding a story crashes the application because the hook count inside the tray grows from two to three.** Here is the runtime sequence:
1. On initial mount, the collection holds two stories. The tray executes the state hook twice, allocating state slots zero and one.
2. Clicking a story triggers a re-render with the identical collection length. The tray executes the exact same two hook calls. Slot zero updates to true, and rendering succeeds.
3. Clicking Create Story executes the creation callback, adding a third item to the parent collection.
4. React renders the tray component again, and the loop now executes the state hook three times.
5. React compares hook calls against the previous render pass. Finding an unexpected third hook execution, it logs an order violation warning and throws a runtime exception.
6. Because unhandled render errors bubble up the component tree, React unmounts the interface and blanks the display (Lesson 72).

### One component per tile, one Hook call per component

The correct architectural solution satisfies the Rules of Hooks: extract each story tile into a dedicated `StoryTile` component with `useState` declared at its top level:

```jsx title="src/StoryTile.jsx"
import { useState } from 'react';

export default function StoryTile({ story }) {
  const [seen, setSeen] = ~useState(false)~; // Top level: exactly one call on every render of this tile
  return (
    <li>
      <button onClick={() => setSeen(true)}>
        {story.label}{seen && ' (seen)'}
      </button>
    </li>
  );
}
```

The parent tray component contains zero Hook invocations. It maps over the stories collection, rendering a `StoryTile` JSX tag with an explicit key:

```jsx title="src/StoryTray.jsx"
import StoryTile from './StoryTile.jsx';

export default function StoryTray({ stories, onCreate }) {
  return (
    <ul>
      {stories.map(story => (
        ~<StoryTile key={story.id} story={story} />~ // React calls each StoryTile and keeps its seen
      ))}
      <li>
        <button onClick={onCreate}>Create Story</button>
      </li>
    </ul>
  );
}
```

The user clicks Ankit's Story, followed by Create Story. The new tile renders smoothly, and the existing tile preserves its seen status:

```page caption="After the fix: the user taps Ankit's Story, then Create Story, and the tray keeps working."
line: [Ankit's Story (seen)] | good
line: [Taylor's Story]
line: [My Story] | good
line: [Create Story]
```

```devconsole width=full caption="The Console after both taps: no messages."
= No messages
```

Both implementations call the state hook once per story item. What changed? **Which component owns each Hook invocation.**
- **When the state hook sits inside the loop**, the single tray component executes one hook per array element: two calls before the update, and three after.
- **When the state hook sits at the top of the tile component**, each tile instance executes exactly one hook call per render pass. Adding a story introduces a separate component instance rather than changing the hook count of an existing component.

Where does React store each tile's interaction state? React executes the component function for each `<StoryTile>` element in the tree. Each instance executes one Hook call, and React stores that state on the tile fiber node, preserving identity across renders using the item key (Lessons 18 and 25).

Always remember: React matches Hooks by sequence count, so the count within any single component must never change.

---

## PRINCIPLE | `StoryTile({ story })` inside `map`: its `useState` runs as a Hook of `StoryTray`

> [!PRINCIPLE]
> **Principle 4: How the Rules Interlock: A Component Called as a Function Runs Its Hooks in the Caller**
>
> *Write a tag for every component, even inside a loop, so its Hooks belong to it and not to the loop that calls it.*
>
> A Hook belongs to the component React is rendering when the Hook runs. `StoryTile({ story })` inside `map` runs the `useState` of `StoryTile` while React renders `StoryTray`, so it becomes a Hook of `StoryTray`, inside a loop. Breaking the rule that React calls components breaks the Rules of Hooks, and the page goes blank when the list grows.
>
> **DO THIS:**
> ```jsx
> {stories.map(story => ~<StoryTile key={story.id} story={story} />~)} {/* React calls each tile, one Hook each */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {stories.map(story => ~StoryTile({ story })~)} {/* **WRONG:** the useState of StoryTile becomes a Hook of StoryTray in a loop */}
> ```

This scenario reveals the dangerous trap described at the beginning of the lesson. Both lines below reference the extracted `StoryTile` component from Principle 3:

```jsx title="Calling StoryTile as a function, and writing its tag, inside the same map"
{stories.map(story => ~StoryTile({ story })~)} {/* StoryTray calls StoryTile inside its own loop */}
{stories.map(story => ~<StoryTile key={story.id} story={story} />~)} {/* React calls each StoryTile */}
```

Both lines pass the identical story prop to the identical function. Both display identical initial tiles, and clicking an item marks it as seen in both cases. The singular difference is execution ownership: whether the loop executes the function directly, or React executes it through an element tag.

A developer writing the direct function call assumes that moving `useState` into the child function placed the Hook at the top level. While syntactically at the top level of that function, runtime execution works differently: **a Hook attaches to whatever component React is currently evaluating**. During direct execution, React is actively evaluating `StoryTray`. Therefore, the Hook inside `StoryTile` executes as a Hook belonging to `StoryTray`, nested directly inside a loop.

Here is the tray component using direct function invocation:

```jsx title="src/StoryTray.jsx"
import StoryTile from './StoryTile.jsx';

export default function StoryTray({ stories, onCreate }) {
  return (
    <ul>
      {stories.map(story => ~StoryTile({ story })~)} {/* **WRONG:** StoryTile's useState runs inside this loop */}
      <li>
        <button onClick={onCreate}>Create Story</button>
      </li>
    </ul>
  );
}
```

On initial render, the markup displays properly, but the console immediately registers a missing key warning:

```page caption="The first load with StoryTile called as a function: the same three tiles."
line: [Ankit's Story]
line: [Taylor's Story]
line: [Create Story]
```

```devconsole width=full caption="The Console on the first load: the list items that StoryTile returns have no key."
x Each child in a list should have a unique "key" prop.
  Check the render method of `ul`. It was passed a child from StoryTray. See https://react.dev/link/warning-keys for more information.
```

The warning occurs because direct function invocation provides no JSX element boundary. Keys belong on JSX tags. Without a parent tag, the returned list item lacks a key, causing React to flag the parent container element during list reconciliation.

Next, the user clicks Create Story. The entire view crashes to an empty white screen with the identical Hook count error observed in Principle 3:

```page caption="After the user taps Create Story: the whole page is blank again."
empty: the whole page is blank
```

```devconsole width=full caption="The Console after the tap on Create Story: the warning names StoryTray, not StoryTile."
x React has detected a change in the order of Hooks called by StoryTray. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks
  Previous render            Next render
  1. useState                useState
  2. useState                useState
  3. undefined               useState
x Uncaught Error: Rendered more hooks than during the previous render.
! An error occurred in the <StoryTray> component.
  Consider adding an error boundary to your tree to customize error handling behavior.
  Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

**The console diagnostic explicitly targets `StoryTray` rather than `StoryTile`. Direct function execution placed child Hooks back into the render loop of the parent component.** Here is how React evaluates the call stack:
1. React initiates rendering for the parent tray component.
2. The loop inside the parent executes the child function directly on each iteration.
3. The state hook inside the child function runs synchronously while the parent component is still evaluating.
4. React registers this invocation as the next hook record belonging to the parent component. With two stories, the parent records two hook invocations. When the user creates a third story, the parent executes three hook calls, triggering the runtime crash.

The official React documentation highlights this precise vulnerability: if a component contains Hooks, calling that component directly inside a loop or condition easily violates the Rules of Hooks.

```tree caption="Who calls StoryTile decides whose Hook its useState is."
Two ways to run `StoryTile` inside the `map`
- !The loop in `StoryTray` calls it | `useState` runs **while React renders `StoryTray`** | Counts as a **Hook of `StoryTray`**: two calls, then **three**, then the page goes **blank**
- +React calls it [`<StoryTile key={story.id} story={story} />`] | Each tile is **its own component** | Each one makes **exactly one** `useState` call, kept with **its own tile**
```

### Why the three rules only work together

The three Rules of React form a unified architecture where each contract guarantees the next:
1. **React controls component execution.** Because React executes components, it can associate state with each element position in the tree.
2. **React indexes state by call sequence.** Because React tracks state slots by counting Hook executions, Hooks must execute in a deterministic sequence at the top level.
3. **Direct function execution breaks isolation.** When application code invokes a component function directly inside loops or branches, child Hooks leak into the caller. Violating execution ownership directly corrupts Hook ordering.
4. **React varies execution frequency.** React may execute components repeatedly during Strict Mode or restart interrupted renders. Purity ensures that executing a component multiple times introduces no side effects.

Consequently, extracting child components to isolate Hook state succeeds only when React executes those components via JSX tags.

```tree dir=right caption="How the three Rules of React hold each other up on the stories tray."
The three rules work as one system
- +React calls components [`<StoryTile />`] | React ties **state to each tile** in the tree
- +Rules of Hooks [`useState` at the top level] | React finds that state **by counting the calls** in each component
- +Pure components | React may call a component **again**, so a call **changes nothing** outside it
- !A component called as a function | Its Hooks join **the caller's loop** | Breaking **React calls components** breaks the **Rules of Hooks**
```

The React Compiler relies on all three rules simultaneously (Lesson 63). The compiler analyzes components statically, skipping optimization whenever potential rule violations are detected. The official documentation offers a clear test for compilation issues. If an application bug persists even after removing all manual memoization, the underlying code violates a Rule of React and requires correction.

Always remember: calling a component as a plain function attaches its Hooks to the caller.

---

## PRINCIPLE | `<StrictMode>` and `eslint-plugin-react-hooks`: one runs the code, the other reads it

> [!PRINCIPLE]
> **Principle 5: The Checks: Strict Mode Runs the Code, the Linter Reads It**
>
> *Keep `<StrictMode>` on in development and run `eslint-plugin-react-hooks` while editing; never silence a lint to make a page work.*
>
> Strict Mode calls each component twice in development, so an impure render shows on the page at the first load. The linter reads the code and names a Hook inside a loop, or a change to a prop, before the code runs. Neither one alone covers all three rules, and a first load that looks right proves nothing.
>
> **DO THIS:**
> ```jsx
> createRoot(document.getElementById('root')).render(
>   ~<StrictMode>~ {/* Calls each component twice in development to show impure renders */}
>     <App />
>   </StrictMode>
> );
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {stories.map(story => { // eslint-disable-next-line react-hooks/rules-of-hooks
>   const [seen, setSeen] = ~useState(false)~; // **WRONG:** the lint is silenced, the page still goes blank after Create Story
>   return <li key={story.id}>{story.label}</li>;
> })}
> ```

Examine the four flawed implementations reviewed in this lesson. On initial page load, three of those four implementations rendered without visual defect. **An initial render that appears visually correct proves nothing about code reliability.** Without Strict Mode, mutation bugs remain undetected. Similarly, Hook ordering bugs lie dormant until specific user interactions trigger list expansion. Untested defects reach production systems where Strict Mode is absent, crashing when users perform dynamic actions.

React provides two complementary diagnostic safety nets that developers should always employ together: runtime Strict Mode and static linter rules.

> [!DEFINITION]
> **What is ESLint?** [NEW] ESLint is a static analysis tool that parses source code in your editor without executing it, flagging violations against pre-configured rules.
> The React team maintains the official plugin `eslint-plugin-react-hooks`, which provides linting rules to enforce the Rules of React automatically.
> It guards codebases effectively even before adopting the React Compiler (Lesson 95).

### Strict Mode runs the code, the linter reads it

Both verification mechanisms identify rule violations, but operate at distinct phases:
- **Strict Mode inspects runtime execution.** In development, it executes component render passes twice, immediately exposing visual artifacts caused by data mutation. It surfaced the duplicate action tile on initial page mount.
- **The linter inspects code structure.** During editing, it analyzes the syntax tree and flags rule violations before runtime. Its rules-of-hooks rule flags the state hook placed inside the loop:

```jsx title="src/StoryTray.jsx, as the editor marks it" startLine="6"
      {stories.map(story => {
        const [seen, setSeen] = ~useState~(false); // **WRONG:** React Hook "useState" cannot be called inside a callback
```

Neither tool alone provides comprehensive protection. Strict Mode demonstrates runtime defects visually in the browser. The linter identifies structural flaws directly in the code editor, catching dormant defects before users ever trigger them:

| Bug on the tray | Strict Mode in development | `eslint-plugin-react-hooks` while editing |
| :--- | :--- | :--- |
| **`push` into the `stories` prop, Principle 2** | Shows a second Create Story tile on the first load | The `immutability` lint marks a change to a prop |
| **`useState` inside `map`, Principle 3** | Finds nothing on the first load; the page breaks only after Create Story | The `rules-of-hooks` lint marks the `useState` line |
| **`StoryTile({ story })` inside `map`, Principle 4** | Finds nothing on the first load; the page breaks only after Create Story | React's docs mark a direct call such as `{Article()}` as an error that React Compiler reports, and the plugin shows those reports in the editor |

```tree caption="Strict Mode and the React Hooks plugin for ESLint find broken rules at different moments."
Two checks for the Rules of React
- +Strict Mode [`<StrictMode>`] | **Runs** the code in development and calls each component **twice** | Shows an **impure render** on the page, such as a **second Create Story tile**
- +`eslint-plugin-react-hooks` | **Reads** the code while you edit | Names the **broken line**, such as a `useState` **inside a loop**, before it runs
```

### Silencing the linter hides the bug, it does not fix it

The React documentation highlights a classic defect on a feedback form:
1. A developer encounters a linter warning regarding a state hook placed inside a conditional branch.
2. Rather than restructuring the code, the developer silences the warning using an inline disable comment.
3. Upon form submission, the application crashes in production with an error stating that fewer hooks were rendered than expected.

When diagnosing mysterious crashes, search for linter suppression comments. Suppressing warnings silences compiler feedback without resolving underlying memory corruption.

When installed, the React Compiler reports detected rule breaks through this same plugin interface. Compiler diagnostic warnings do not halt production builds. The compiler skips optimization for that single component while keeping the rest of the application optimized, allowing teams to address violations incrementally.

Always remember: Strict Mode exposes defects at runtime, while the linter identifies them in code.

---

## All 5 Principles Together

### The complete stories tray

Here is the robust stories tray implemented across four clean modules. React invokes every component via JSX tags, every render pass treats inputs as immutable, and every Hook executes unconditionally at the top level:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* Principle 5: calls each component twice in development */}
    <App />
  </StrictMode>
);
```

```jsx title="src/App.jsx"
import { useState } from 'react';
import StoryTray from './StoryTray.jsx';

const initialStories = [
  { id: 0, label: "Ankit's Story" },
  { id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState(initialStories);

  function handleCreate() {
    ~setStories([...stories, { id: stories.length, label: 'My Story' }])~; // Principle 2: a new array, never a push
  }

  return ~<StoryTray stories={stories} onCreate={handleCreate} />~; // Principle 1: React calls StoryTray
}
```

```jsx title="src/StoryTray.jsx"
import StoryTile from './StoryTile.jsx';

export default function StoryTray({ stories, onCreate }) {
  return (
    <ul>
      {stories.map(story => (
        ~<StoryTile key={story.id} story={story} />~ // Principle 4: a tag, so each tile owns its Hook
      ))}
      <li>
        <button onClick={onCreate}>Create Story</button>
      </li>
    </ul>
  );
}
```

```jsx title="src/StoryTile.jsx"
import { useState } from 'react';

export default function StoryTile({ story }) {
  const [seen, setSeen] = ~useState(false)~; // Principle 3: one call at the top level on every render
  return (
    <li>
      <button onClick={() => setSeen(true)}>
        {story.label}{seen && ' (seen)'}
      </button>
    </li>
  );
}
```

### How React calls the components, in order

When the interface mounts, React starts at the root component and traverses element descriptors downward. It calls the root component first, then the tray component, followed by a tile component for each story. In development, Strict Mode executes each component function twice. Because every render pass is pure, both evaluations produce identical markup:

```tree caption="The order in which React calls the components of the stories tray, from App down to each StoryTile."
`App` [1. Called first] | Holds **`stories`** in state | Writes **one** `<StoryTray>` tag
- +`StoryTray` [2. Called second] | Holds **no Hooks** | Writes **one `<StoryTile>` tag per story** and the Create Story button
  - +`StoryTile` for Ankit [3. Called third] | **One** `useState` call | Keeps **its own `seen`**
  - +`StoryTile` for Taylor [4. Called fourth] | **One** `useState` call | Keeps **its own `seen`**
```

When the user interacts with an existing story and clicks Create Story, React mounts a third tile component instance. Because each tile component maintains its own isolated Hook count, rendering completes without error:

```page caption="The finished tray after the user taps Ankit's Story and then Create Story."
line: [Ankit's Story (seen)] | good
line: [Taylor's Story]
line: [My Story] | good
line: [Create Story]
```

| Rule of React | What it forbids | What the user sees when it is broken | The check that finds it |
| :--- | :--- | :--- | :--- |
| **React calls Components and Hooks** | Calling a component as a function, and passing a Hook around as a value | A blank page after Create Story, when the called component holds a Hook and the call sits inside a loop | React Compiler's reports, shown by `eslint-plugin-react-hooks` |
| **Components and Hooks must be pure** | Changing props, state, or any value made before the render; reading the clock or a random number; changing the page during render | A second Create Story tile in development, and one more after every render in production | Strict Mode, and the `purity` and `immutability` lints |
| **Rules of Hooks** | Calling a Hook in a loop, an `if`, after an early return, or anywhere outside the top level of a component or custom Hook | A blank page after Create Story, with an error about the order of Hooks | The `rules-of-hooks` lint |

Remember the core lesson. You write the component, but React calls it. Let React do the calling, change nothing outside the call, and call hooks in the same order every time.

---

## For the Interview

> **The Interview Question:** What are the Rules of React, and how do the three rules interlock?

### How to Answer Clearly in 30 Seconds

"React defines three foundational Rules of React that stem directly from one architectural reality: React controls component execution rather than application code.
1. **Components and Hooks must be pure**: because React can execute a component repeatedly, rendering must be deterministic and never mutate pre-existing data.
2. **React calls Components and Hooks**: we author components as JSX element tags, never as direct function calls, and never pass Hooks as runtime values. This allows React to attach state, manage reconciliation, and schedule rendering.
3. **Rules of Hooks**: React indexes Hook state purely by sequential execution order. Hooks must execute unconditionally at module top level in an unchanging sequence.

These rules interlock tightly. Calling a component directly inside a loop moves child Hooks into the parent loop, breaking Hook ordering. Strict Mode identifies impure renders dynamically in development, while official ESLint rules flag structural violations statically during editing."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"If `StoryTile({ story })` returns the same JSX as `<StoryTile />`, why does it matter?"**
   A Hook attaches to whichever component React is actively evaluating. With a JSX tag, React manages each tile instance separately, executing one Hook per tile. With direct invocation, React is evaluating the parent tray, so every child Hook executes as a Hook of the parent inside a loop. Initial rendering appears identical. However, when the list expands, the parent executes more Hooks than before, causing React to throw a fatal error. Direct invocation in loops or conditions directly corrupts Hook ordering.
2. **"What does purity let React do, and why does Strict Mode call my component twice?"**
   Purity enables React to execute rendering safely across concurrent and speculative operations. React can re-render components, yield to user interactions, restart interrupted renders, skip unchanged subtrees, and evaluate components on the server. Strict Mode evaluates components twice in development to verify purity. Pure components return identical results on both passes. Impure components reveal mutations immediately, such as duplicate list items created by array mutation. Strict Mode has zero impact in production.
3. **"Can I pass a Hook as a prop, or wrap a Hook in a function that returns a new Hook?"**
   No. The official documentation prohibits passing Hooks as regular runtime values. Treating Hooks as dynamic values obscures data dependencies, complicates component reasoning, and prevents compiler optimizations. It also makes accidental Hook rule violations far more likely. Instead, declare reusable behavior as a standard custom Hook at module scope, and invoke that custom Hook unconditionally at the top level of your component.

```tree dir=right caption="Interview summary: the three Rules of React and how each one holds up the others."
The three Rules of React as one system
- +React calls components [`<StoryTile />`] | React **owns the call** | So React can **tie state** to each component and **call it again**
- +Pure components | Every call **gives the same result** | So React may **repeat, pause, restart, or skip** a call safely
- +Rules of Hooks [`useState` at the top level] | Same Hooks, **same order** | So React finds **each Hook's state** by counting
- !Calling a component as a function | Its Hooks join **the caller's loop** | Breaking **React calls components** breaks the **Rules of Hooks**
```
