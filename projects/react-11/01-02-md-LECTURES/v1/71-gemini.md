# Lecture 71: How use Reads a Promise, Even Inside an if

*(How can a component show comments that have not arrived yet?)*

> INTERVIEW QUESTION | ❱❱ MORE | What is the use() API, and how does it read promises and context conditionally?

---

## VS | An Effect with `isLoading` vs. `use(commentsPromise)`: the component shows its own loading line, or `<Suspense>` shows it

> Network requests take time to resolve, returning a Promise immediately while the payload travels across the network. **The `use` function reads a Promise during render, delegating the waiting state to the nearest `<Suspense>` fallback**. The component needs no local loading flag, and developers can even call `use` conditionally inside regular control flow.

Network data never arrives synchronously. A web application that requests server data must handle three distinct moments: while data is in transit, when it arrives successfully, and when the network request fails.

Previously, components managed all three moments internally. The component declared an Effect alongside three state variables for data, loading state, and error handling (Lesson 33). React 19 provides a cleaner architectural alternative. The component unwraps asynchronous data directly during render:

```jsx title="src/Comments.jsx"
const comments = ~use~(commentsPromise); // Gives the comments once they have arrived
```

This single line replaces manual loading state flags. The component reads the comments array as if it were already loaded into client memory. Parent components higher in the tree coordinate the waiting state and error display.

### The Idea Behind It: `await` in Plain JavaScript

In standard JavaScript, asynchronous functions use `await` to handle promises. The JavaScript engine halts execution inside the `async` function at that exact line, resuming only after the promise settles:

```js title="Plain JavaScript: you wait for the Promise yourself"
async function showComments() {
  const comments = ~await~ fetchComments(); // The function pauses here until the comments arrive
  console.log(comments); // Runs one second later, with the comments
}
```

Browser React components cannot pause execution in this manner. React invokes components synchronously during the render phase and expects immediate JSX elements. Client components cannot be declared as `async` functions.

The `use` function bridges this requirement. It delegates the waiting phase to React:

```jsx title="React: you hand the wait to React"
const comments = ~use~(commentsPromise); // Not there yet: React stops Comments here and calls it again later
```

Unlike `await`, calling `use` never pauses the thread mid-function. Native async functions resume from the exact suspension point, whereas `use` re-renders the component once data resolves.

Keep one central distinction in mind throughout this lesson. **The `use` function unwraps a pending value during render. React displays the nearest `<Suspense>` fallback until fulfillment, then re-renders the component to deliver the value.**

### The Words This Lesson Stands On

> [!DEFINITION]
> **A Promise.** [REVIEW] A Promise is a standard JavaScript object representing an asynchronous operation and its eventual result. Calling `fetch` produces a pending Promise immediately, while the server payload resolves at a later time (Lesson 33).

> [!DEFINITION]
> **A `<Suspense>` fallback.** [REVIEW] A component suspends when it requires asynchronous resources that are not yet available. React traverses up the tree to the nearest `<Suspense>` boundary and displays its fallback prop, keeping surrounding UI fully interactive (Lesson 69).

> [!DEFINITION]
> **The Rules of Hooks.** [REVIEW] Standard React Hooks must be called unconditionally at the top level of a component. They cannot sit inside loops, conditionals, or after early returns. React preserves Hook state by matching calls to a fixed execution order (Lesson 38).

### `use` Looks Like a Hook, but It Is NOT One

Because its identifier begins with the `use` prefix, developers often assume it is a Hook and apply Hook call-order rules to it.

The React documentation states the exact opposite: "Despite its name, `use` is not a Hook. Unlike Hooks, it can be called inside loops and conditional statements like `if`."

This difference has direct runtime consequences. Before the visitor clicks the button, no Promise exists, allowing the comments component to return early without calling `use`. Skipping standard Hooks breaks component state, but `use` follows an entirely different mechanism. Principle 4 explores why this flexibility is safe.

### Who Shows the Loading Line and the Error Line

Three components cooperate to coordinate the lifecycle of the comments section:
1. **While data travels across the network**, the component calling `use` suspends. The nearest `<Suspense>` boundary displays its fallback placeholder.
2. **When data arrives successfully**, React re-renders the component from scratch, allowing `use` to return the payload and render the markup.
3. **When the request encounters an error**, the nearest Error Boundary intercepts the thrown rejection and displays an error view. Principle 5 introduces this boundary to our page.

```tree caption="Three components share the comments section, and each one shows one of its three moments."
Who shows what in the comments section
- +`<Suspense>` above `Comments` [`fallback`] | While the comments are **on their way** | Shows **`Loading comments...`**
- +`Comments` with `use` [`use`] | When the comments **have arrived** | Shows **the two comments**
- +Error Boundary above `<Suspense>` [`ErrorBoundary`] | When the request **fails** | Shows **`Could not load comments.`**
```

### What Is at Stake

Two architectural mistakes cause severe production defects:
1. **Instantiating the Promise during render.** Each render allocates a new Promise instance, triggering an infinite suspension cycle where the fallback never disappears. The documentation notes that this defect completely blocks content delivery.
2. **Omitting an Error Boundary around asynchronous components.** If a network request rejects without an enclosing boundary, React unmounts the entire component tree. The user loses the entire page instead of seeing a localized failure message.

Developers typically fall into three implementation traps:
1. **Instantiating the request directly within the component body.** Passing an un-cached fetch call to `use` causes an infinite loop of suspended renders.
2. **Wrapping `use` in native error handling blocks.** Because React uses thrown values internally to coordinate Suspense, capturing them inside the component corrupts framework lifecycle tracking.
3. **Retaining legacy loading checks below `use`.** Code following `use` never executes while the Promise is pending, rendering downstream loading checks completely inert.

### The Rule of Thumb: was the Promise created before this render?

**Verify the creation point of every Promise passed to `use`. Ensure the Promise was instantiated before the render pass, such as inside an event handler, loader, or cache. Instantiating promises during render creates an infinite loading loop.**

### Four Ways to Show Data That Arrives Later

Production applications generally select among four distinct strategies:
1. **An Effect with manual state management** (Lesson 33). This pattern manages loading flags and error values manually in local state. The React documentation notes that this approach requires substantial boilerplate.
2. **A Promise unwrapped with `use` under `<Suspense>` and an Error Boundary.** This is the core architectural pattern of this lesson. It suits workflows where client code creates a Promise before render, such as during user interaction.
3. **A Suspense-compatible data library.** Dedicated libraries manage caching, re-validation, and Promise lifecycles automatically. The React team recommends solutions like TanStack Query, useSWR, or integrated router loaders for complex production applications.
4. **Direct `await` statements inside Server Components.** Asynchronous components execute exclusively on the server prior to HTML streaming. Part Two explores this architecture in detail.

```tree caption="Four ways to show data that arrives after the page renders, and when each one fits."
Four ways to show data that arrives later
- +An Effect with loading and error state [`useEffect`] | The component **keeps the wait in its own state** | Fits a page that **already works this way**
- +`use` under `<Suspense>` [`use` `Suspense`] | Our code **creates the Promise before render** | Fits data needed **only after a click**, as on our page
- +A Suspense-enabled library [TanStack Query, useSWR] | The library **keeps the Promises** for us | The documentation's choice **for real apps**
- +`await` in a Server Component | Runs **on the server** | Covered in **Part Two**
```

## SECTION | An Article Page with a Show Comments Button

Our example page presents a news article. It displays a headline alongside a button to load comments. Because most readers browse only the main article, the page avoids fetching comments on initial load. It requests data only when the visitor explicitly clicks the button.

```page caption="The article page when a reader opens it: a title and a Show comments button."
heading: City park opens on Saturday
line: [Show comments]
```

When the visitor clicks the button, the application initiates a server request for the comments. The simulated network delay takes one second to resolve. During that second, the page renders a fallback message:

```page caption="The same page during the second after the click: the comments are on their way."
heading: City park opens on Saturday
line: Loading comments...
```

Once the request resolves, the comments appear on screen:

```page caption="The same page one second later: the two comments have arrived."
heading: City park opens on Saturday
line: John: Great news!
line: Mia: See you there.
```

The application divides responsibilities across four files in the project structure. The comments UI and the data request each live in their own dedicated file:

```files title="news-article: File Explorer" caption="How the files of our article page sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | root | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | The article page: holds `commentsPromise` state and the `Show comments` button
  Comments.jsx | default export | Reads the comments with `use` and shows them as a list
  fetchComments.js | helper | Exports `fetchComments`, which returns a Promise of the comments
```

The entry file mounts the root component inside StrictMode (Lesson 07), remaining unchanged throughout the lesson:

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

Each principle demonstrates one foundational rule, showing how components behave when configured correctly and how they break when misused.

**PRINCIPLES:** The `use` function unwraps values during render while React renders fallback UI during the wait. Five principles guide this architecture:
1. **Principle 1: The Click Creates the Promise and Keeps It in State.** Event handlers initiate requests and store stable Promise instances in state without blocking on resolution.
2. **Principle 2: `use` Stops the Component Until the Comments Arrive.** While data resolves, `<Suspense>` renders a fallback. Once fulfilled, React re-renders the component to output data.
3. **Principle 3: A Promise Created in the Component Body Keeps the Loading Line Forever.** Instantiating promises during render creates new instances on every pass, causing indefinite suspension.
4. **Principle 4: `use` May Sit Inside an `if`.** Because `use` is not a Hook, developers can call it conditionally or after early returns without violating call-order invariants.
5. **Principle 5: A Failed Request Goes to the Closest Error Boundary.** Rejected promises bubble up to the nearest Error Boundary. Wrapping `use` in native error blocks is strictly invalid.

---

## PRINCIPLE | `setCommentsPromise(fetchComments())` in the click handler: one Promise per click, kept in state

> [!PRINCIPLE]
> **Principle 1: Promise in State: The Click Starts the Request and Keeps One Promise**
>
> *Create the Promise in the event handler that needs the data, and store it in state, so every render of the page reads the same Promise.*
>
> Initiating network requests on interaction ensures visitors only download data they request. The click handler invokes `fetchComments()`, receiving a pending Promise immediately, and writes that single instance into state. The event handler finishes immediately without awaiting completion, leaving data unwrapping to subsequent render passes.
>
> **DO THIS:**
> ```jsx
> <button onClick={() => ~setCommentsPromise(fetchComments())~}> {/* One Promise per click, kept in state */}
>   Show comments
> </button>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> async function handleClick() {
>   const comments = ~await~ fetchComments(); // **WRONG:** for one second the page does not react, because nothing in state says the comments are coming
>   setComments(comments);
> }
> ```

Consider the initial request invocation:

```js title="Calling fetchComments"
const promise = ~fetchComments()~; // Comes back at once: the comments are not there yet
```

Calling `fetchComments()` does not return the comments array directly. It returns a Promise immediately, while the network payload arrives one second later.

In JavaScript, a Promise acts as a placeholder for a future value. Your code receives the Promise object synchronously, while the resolved data arrives at a later time.

> [!DEFINITION]
> **The three states of a Promise.** [NEW] A Promise exists in one of three mutually exclusive states defined by ECMAScript. It is pending while the asynchronous operation is in progress. It becomes fulfilled once the operation completes successfully, holding the resulting payload. It becomes rejected if the operation fails, holding an error reason (Lesson 71).

```tree dir=right caption="The three states of a Promise, and what our comments Promise holds in each one."
The three states of the comments Promise
- +pending | The comments are **on their way** | For **one second** after the click
- +fulfilled | The comments **have arrived** | Holds **the comments of John and Mia**
- !rejected | The request **failed** | Holds **an error** instead of the comments
```

### A stand-in for the server

Our example runs without a remote backend, so a helper file simulates network latency. It waits one second before returning two comment objects:

```js title="src/fetchComments.js"
const comments = [
  { id: 1, author: 'John', text: 'Great news!' },
  { id: 2, author: 'Mia', text: 'See you there.' },
];

export function fetchComments() {
  return new Promise(~resolve~ => { // JavaScript hands resolve to this function
    ~setTimeout~(resolve, 1000, comments); // After one second, calls resolve with the comments
  });
}
```

Application code never defines `resolve`. The JavaScript runtime supplies this callback to the executor function. Invoking `resolve` transitions the Promise from pending to fulfilled with the provided value.

The timer forwards additional arguments to its callback. Passing `comments` after the delay parameter instructs the timer to call `resolve` with the comments array after one second.

### The click starts the request, and the render reads it

Request initiation and data consumption happen at two separate execution phases:
1. **When the visitor clicks the button**, the handler invokes `fetchComments()` and commits that Promise reference to state. The event handler finishes immediately.
2. **During the subsequent render pass**, a child component reads the Promise using `use`. Principle 2 explores this step.

Here is the top-level application component. The state variable `commentsPromise` begins as `null`, and the click handler updates it with the new Promise:

```jsx title="src/App.jsx"
import { useState } from 'react';
import { fetchComments } from './fetchComments.js';

export default function App() {
  const [~commentsPromise~, setCommentsPromise] = useState(null); // null until the click, then the Promise
  return (
    <article>
      <h1>City park opens on Saturday</h1>
      {commentsPromise === null && (
        <button onClick={() => ~setCommentsPromise(fetchComments())~}> {/* Starts the request and keeps its Promise */}
          Show comments
        </button>
      )}
    </article>
  );
}
```

The button renders only while `commentsPromise` remains `null`. Once clicked, the button unmounts from the DOM. No comments appear yet because no child component reads the Promise:

```page caption="The page right after the click in Principle 1: the button is gone, and no component reads the Promise yet."
heading: City park opens on Saturday
```

### Why the click does not wait with `await`

The click handler could theoretically await `fetchComments()` and store the resolved comments directly. However, awaiting the network response causes the user interface to freeze without user feedback.

Because component state remains unchanged during that second, React cannot detect that background work is underway. Displaying a loading indicator would require maintaining a separate boolean state variable. Storing the Promise directly in state informs React immediately, allowing `<Suspense>` to display fallback UI.

### Why the Promise lives in state

React state preserves the identical Promise instance across component re-renders. Same instance means the exact same object reference in memory, rather than a freshly created Promise. Every render of `App` reads `commentsPromise` from state, ensuring referential stability. Principle 3 shows why `use` requires this stability.

The React documentation advises creating promises before rendering, such as inside event handlers, and passing them directly to components calling `use`.

Remember the core distinction: event handlers initiate the Promise, while component render passes consume it.

---

## PRINCIPLE | `use(commentsPromise)`: the component stops until the comments arrive, then React renders it again

> [!PRINCIPLE]
> **Principle 2: Suspend: use Stops the Component Until the Promise Is Fulfilled**
>
> *Read the Promise with `use` during render, and put a `<Suspense>` with a `fallback` above the component; while the Promise is pending, React shows the fallback.*
>
> The component reading comments requires no local loading state. While the Promise remains pending, the component suspends, and the nearest `<Suspense>` boundary renders its fallback. When the Promise fulfills, React re-renders the component from its initial line, and `use` returns the comments. Because the loading indicator belongs to `<Suspense>`, loading checks placed below `use` never execute.
>
> **DO THIS:**
> ```jsx
> <~Suspense fallback={<p>Loading comments...</p>}~> {/* Shown while Comments waits at use */}
>   <Comments commentsPromise={commentsPromise} />
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const comments = use(commentsPromise);
> if (~!comments~) { // **WRONG:** never runs, because use returns only once the comments are there
>   return <p>Fetching the latest comments...</p>;
> }
> ```

### VS | With `useEffect` vs. with `use`: the same page, NOT the same thing

Both implementations present the visitor with an identical visual sequence: a loading message for one second, followed by the comment list. The fundamental architectural difference lies in who manages the loading state.

First, examine the traditional approach using an Effect (Lesson 33). This pattern requires explicit error tracking and cleanup routines, omitted here for brevity:

```jsx title="With useEffect: the component keeps the wait in its own state"
function Comments() {
  const [comments, setComments] = useState([]);
  const [~isLoading~, setIsLoading] = useState(true); // The component tracks the wait itself
  useEffect(() => {
    fetchComments().then(data => {
      setComments(data);
      setIsLoading(false);
    });
  }, []);
  if (isLoading) {
    return ~<p>Loading comments...</p>~; // The component returns its own loading line
  }
  return <ul>{comments.map(comment => <li key={comment.id}>{comment.text}</li>)}</ul>;
}
```

Now examine the comments component powered by `use`. It receives the pending Promise as a prop:

```jsx title="With use: the component reads the comments in one line"
function Comments({ commentsPromise }) {
  const comments = ~use~(commentsPromise); // Returns the comments once the Promise is fulfilled
  return <ul>{comments.map(comment => <li key={comment.id}>{comment.text}</li>)}</ul>;
}
```

With `use`, the component delegates loading indicators to the parent boundary:

```jsx title="src/App.jsx: the Suspense boundary around Comments"
<~Suspense fallback={<p>Loading comments...</p>}~> {/* Shows the loading line while Comments waits */}
  <Comments commentsPromise={commentsPromise} />
</Suspense>
```

While the visual outcome matches, the internal mechanics differ completely:
1. **With an Effect**, the component coordinates asynchronous state locally. It renders its own placeholder whenever `isLoading` is true.
2. **With `use`**, the component tracks no internal loading flags. Execution suspends at `use`, prompting the parent `<Suspense>` boundary to render its fallback.

A Suspense boundary coordinates only with components reading data through compatible APIs. The React documentation explains: "Suspense does not detect when data is fetched inside an Effect or event handler." Only components consuming promises through `use` trigger Suspense fallbacks.

```tree caption="The same loading line on the page, shown by the component itself with useEffect, or by Suspense with use."
Who shows `Loading comments...`?
- +With `useEffect` [`isLoading`] | The component **keeps the wait in its own state** | The component **returns the loading line itself**
- +With `use` [`use` `Suspense`] | The component **has no loading variable** | The **`<Suspense>` above it** shows the loading line
```

### Adding `Comments` and the Suspense boundary to the page

The `use` function is a built-in export from React. Here is the comments component in its dedicated file:

```jsx title="src/Comments.jsx"
import { ~use~ } from 'react'; // use comes from React

export default function Comments({ commentsPromise }) {
  const comments = ~use~(commentsPromise); // Returns the two comments once the Promise is fulfilled
  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.author}: {comment.text}</li>
      ))}
    </ul>
  );
}
```

The application file imports Suspense and places the boundary beneath the headline. At this stage, the page renders `Comments` only after interaction, once state holds a Promise:

```jsx title="src/App.jsx"
import { useState, ~Suspense~ } from 'react'; // Suspense comes from React
import { fetchComments } from './fetchComments.js';
import Comments from './Comments.jsx';

export default function App() {
  const [commentsPromise, setCommentsPromise] = useState(null);
  return (
    <article>
      <h1>City park opens on Saturday</h1>
      {commentsPromise === null && (
        <button onClick={() => setCommentsPromise(fetchComments())}>
          Show comments
        </button>
      )}
      {commentsPromise !== null && (
        <~Suspense fallback={<p>Loading comments...</p>}~> {/* Shows the loading line while Comments waits */}
          <Comments commentsPromise={commentsPromise} />
        </Suspense>
      )}
    </article>
  );
}
```

### What happens after the click

The `use` function never halts execution inline like `await`. The component suspends, and React subsequently re-executes the function from its first line. Here is the interaction lifecycle step by step:
1. The user clicks the button. The event handler writes a new pending Promise into state.
2. React re-renders `App`. Because the Promise exists, React renders the Suspense boundary wrapping `Comments`.
3. React renders `Comments`. Execution reaches `use`, encountering a pending Promise.
4. `Comments` suspends. React halts rendering of that subtree and displays the nearest Suspense fallback:

```page caption="The page while the Promise is pending: the Suspense boundary shows its fallback."
heading: City park opens on Saturday
line: Loading comments...
```

5. One second later, the Promise fulfills with the comments array.
6. React re-renders `Comments` from the beginning. The documentation states: "After each suspension, React retries rendering from scratch".
7. On this second pass, `use` unwraps the resolved array, rendering the list in place of the fallback:

```page caption="The page after the Promise is fulfilled: use returns the comments, and the list replaces the fallback."
heading: City park opens on Saturday
line: John: Great news!
line: Mia: See you there.
```

React evaluates the component function twice. On the first pass, execution suspends at `use`. On the second pass, `use` delivers the resolved payload.

```tree dir=right caption="React renders Comments twice: once to find the Promise pending, once to read the comments."
After the click on Show comments
- +1. First render of `Comments` | `use` finds the Promise **pending** | `Comments` **suspends**; the page shows **`Loading comments...`**
- +2. One second later | The Promise is **fulfilled** | React **renders `Comments` again from its first line**
- +3. Second render of `Comments` | `use` **returns the two comments** | The list **replaces the loading line**
```

### Real mistake: a loading check below `use`

This issue frequently surfaces during refactoring:
1. A developer refactors a component to use `use`, adding a Suspense boundary in the parent. Out of habit, they retain a legacy loading check below `use`.
2. Later, product requirements request a new loading string. A teammate locates the legacy check and edits the text there:

```jsx title="src/Comments.jsx"
const comments = use(commentsPromise);
if (~!comments~) { // **WRONG:** never true: use returns only once the comments are there
  return <p>Fetching the latest comments...</p>;
}
```

3. The developer reloads the page and clicks the button. The screen continues to show the original fallback text.

The conditional check inside the comments component never runs. While the Promise is pending, execution suspends at `use` without reaching downstream statements. Once `use` returns, the data is already present.

The rendered loading indicator originates from the fallback prop on the parent boundary. That boundary is the only place to update loading copy.

Remember this division of labor: child components render resolved data, while parent boundaries coordinate loading indicators.

---

## PRINCIPLE | `use(fetchComments())` in the component body: a new Promise on every render, so the comments never appear

> [!PRINCIPLE]
> **Principle 3: Same Instance: Never Create the Promise in the Component Body**
>
> *Pass `use` a Promise created before render or taken from a cache; a Promise created in the component body is a new one on every render, and the fallback never goes away.*
>
> React renders a suspended component again from scratch, and that render runs every line of the component again. A call to `fetchComments()` in the body creates a new pending Promise each time, so `use` keeps waiting, the page keeps showing `Loading comments...`, and the Console stays empty. Create the Promise in the click handler and keep it in state, or let a Suspense-enabled library keep it.
>
> **DO THIS:**
> ```jsx
> <button onClick={() => ~setCommentsPromise(fetchComments())~}> {/* Created once, on click, and kept in App state */}
>   Show comments
> </button>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Comments() {
>   const comments = use(~fetchComments()~); // **WRONG:** a new Promise on every render, so the comments never appear
> }
> ```

### VS | `use(fetchComments())` vs. `use(commentsPromise)`: a new Promise every time, or the same one

Both statements below pass `use` a Promise delivering identical comments. The crucial architectural distinction is where the Promise is allocated:

```jsx title="A Promise created during render vs. a Promise created on click"
const comments = use(~fetchComments()~); // 1. Created during render: a new Promise every time Comments renders
const comments = use(~commentsPromise~); // 2. Created on click: the one Promise kept in App state
```

Instantiating the request directly in render appears simpler by removing state variables and click handlers. However, this code introduces a catastrophic bug.

Each invocation of `fetchComments()` allocates a distinct Promise object in memory. The React documentation warns that promises created during render are recreated on every render pass, causing React to display the fallback repeatedly and blocking content delivery.

### Why the comments never appear

Creating promises during render causes an infinite suspension cycle. The component never encounters a Promise that has had time to resolve. Here is what happens when the component creates the Promise internally:
1. React begins rendering the comments component, invoking `fetchComments()` to allocate a new pending Promise.
2. The `use` function suspends execution, prompting React to display the loading fallback.
3. React discards the uncommitted render pass. The documentation notes: "React does not preserve any state for renders that got suspended before they were able to mount for the first time."
4. One second later, that initial Promise fulfills, and React retries rendering the component from scratch.
5. The retry executes the entire function body again, calling `fetchComments()` and allocating a second pending Promise.
6. Execution suspends again on this new Promise, locking the interface on the fallback indefinitely.

No statement in application code requested multiple fetches. The request helper sits in the render body, executing on every evaluation pass.

The browser console produces zero warnings for this defect:

```page caption="With use and fetchComments in the component body: the loading line stays, the comments never appear, and the Console is empty."
heading: City park opens on Saturday
line: Loading comments... | bad
console: quiet
```

This lifecycle behavior also explains why the child component cannot store the Promise in local state. Because the component suspends before its initial mount, React preserves none of its local state records. The Promise must live higher in the tree or inside a cache.

```tree caption="A Promise created during render vs. a Promise created on click, and what use does with each one."
Where the Promise passed to `use` is created
- !In the component body [`fetchComments` inside `Comments`] | A **new Promise on every render** | `Loading comments...` **stays**; the comments **never appear**
- +In the click handler [`commentsPromise` in `App` state] | The **same Promise on every render** | `Loading comments...` for one second, **then the comments**
```

### Where the Promise may come from

Two architectural patterns supply `use` with stable Promise references across renders:
1. **Created before render and preserved in state.** Our click handler demonstrates this pattern.
2. **Retrieved from an external cache.** A cache stores pending requests and returns stable Promise references on repeated queries. The documentation states: "The Promise must be cached so that the same instance is reused across re-renders". Data libraries such as TanStack Query and useSWR manage this caching layer automatically.

### Real mistake: two more ways to create a new Promise in render

Developers familiar with the rule can still introduce new Promise instances unintentionally. The React documentation highlights two subtle variations:

```jsx title="Two more ways to create a new Promise during render"
const comments = use(~loadComments()~); // **WRONG:** loadComments is an async function, so every call returns a new Promise
const comments = use(~cachedPromise.then(list => list.slice(0, 1))~); // **WRONG:** .then returns a new Promise on every render
```

1. **Invoking an `async` function during render.** Async functions return a newly allocated Promise on every call. This triggers the identical infinite suspension loop without logging console warnings.
2. **Chaining `.then` onto a cached Promise during render.** Although the base Promise is cached, chaining `.then` returns a new Promise instance on every render pass. In this scenario, once the initial Promise fulfills, the UI updates, but React logs a warning in the console:

```devconsole width=full caption="The Console when Comments adds .then to a cached Promise during render."
x A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.
```

Because content eventually renders, developers often overlook this warning. The remedy is identical: instantiate the Promise once outside render, and provide that stable instance to `use`.

Remember the foundational rule: event handlers create the Promise, while render passes consume it.

---

## PRINCIPLE | `use` inside an `if`: allowed, because `use` is not a Hook

> [!PRINCIPLE]
> **Principle 4: Not a Hook: use May Sit Inside an if or After an Early Return**
>
> *Call `use` inside an `if`, a loop, or after an early return when the component needs it only sometimes; it must still be called inside a component or a Hook.*
>
> Standard Hooks map to an internal array indexed by call order, meaning skipping a call breaks state alignment for all following Hooks. In contrast, `use` attaches tracking directly to the Promise or resolves Context by walking the ancestor tree. Skipping `use` preserves framework state without disruption. Before interaction, `Comments` returns null early, avoiding `use` entirely.
>
> **DO THIS:**
> ```jsx
> if (commentsPromise === null) {
>   return null;
> }
> const comments = ~use~(commentsPromise); // After an early return: allowed for use
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> if (commentsPromise === null) {
>   return null;
> }
> const theme = ~useContext~(ThemeContext); // **WRONG:** a Hook after an early return breaks the Rules of Hooks
> ```

### VS | `useContext` inside an `if` vs. `use` inside an `if`: the same theme, only one is allowed

The `use` function reads both promises and React context. The documentation illustrates conditional usage with context, similar to theming setups (Lesson 28). Consider a divider component reading a theme only when its visibility flag is active. First examine the attempt with `useContext`:

```jsx title="useContext inside an if"
function HorizontalRule({ show }) {
  if (show) {
    const theme = ~useContext~(ThemeContext); // **WRONG:** a Hook inside an if breaks the Rules of Hooks
    return <hr className={theme} />;
  }
  return false;
}
```

Now examine the same component using `use`:

```jsx title="use inside an if"
function HorizontalRule({ show }) {
  if (show) {
    const theme = ~use~(ThemeContext); // Allowed: use may be called inside an if
    return <hr className={theme} />;
  }
  return false;
}
```

Both snippets read the identical context value from the nearest provider. However, the Rules of Hooks strictly forbid the first pattern, whereas React officially supports the second: "Despite its name, `use` is not a Hook."

### Why `use` may be skipped and a Hook may not

This architectural difference stems from how each tool resolves values internally. The React documentation clarifies this distinction across three principles:
1. **Hooks match state using call-order indexing.** Internally, React maintains an ordered array of state cells for each component fiber (Lesson 38). Skipping a Hook shifts the call index, assigning corrupted values to subsequent Hooks.
2. **Reading a Promise with `use` inspects the Promise directly.** React inspects metadata properties attached to the Promise object. The documentation confirms that React checks these fields whenever `use` executes.
3. **Reading Context with `use` traverses the component tree.** React walks upward through the fiber hierarchy to find the nearest provider component.

Because `use` never consumes an entry in the component fiber hook array, skipping it during conditional execution cannot misalign surrounding state.

```tree caption="Where a Hook and use each find their value, and why only use may sit inside an if."
Where each one finds its value
- !A Hook [`useState` `useContext`] | By its **place in the order of calls** | Skipping it on one render gives **every later Hook the wrong value**
- +`use` with a Promise [`use`] | On **the Promise itself** | Skipping it **moves nothing out of place**
- +`use` with a context [`use`] | In **the closest provider above** | Skipping it **moves nothing out of place**
```

### Moving the `if` into `Comments`

In our application, the comments component can handle its own pre-interaction state. It returns `null` while no Promise exists, calling `use` only after that early return:

```jsx title="src/Comments.jsx"
import { use } from 'react';

export default function Comments({ commentsPromise }) {
  if (commentsPromise === null) {
    return ~null~; // Before the click: no Promise yet, so nothing on the page
  }
  const comments = ~use~(commentsPromise); // After an early return: allowed for use
  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.author}: {comment.text}</li>
      ))}
    </ul>
  );
}
```

The application file no longer needs conditional guards around the Suspense boundary. It renders `Comments` continuously, keeping only the button conditional:

```jsx title="src/App.jsx" startLine="10"
      {commentsPromise === null && (
        <button onClick={() => setCommentsPromise(fetchComments())}>
          Show comments
        </button>
      )}
      <Suspense fallback={<p>Loading comments...</p>}>
        ~<Comments commentsPromise={commentsPromise} />~ {/* Rendered always: Comments decides what to show */}
      </Suspense>
```

The user experience remains identical. Before the click, the page displays the headline and the button, while the comments component returns `null` without invoking `use`:

```page caption="The page before the click: Comments returns null, and use is not called at all."
heading: City park opens on Saturday
line: [Show comments]
```

Following the click, the page displays the fallback and then the resolved comments.

The React linter enforces this distinction. Official lint documentation explicitly marks conditional calls to `use` as valid:

```jsx title="Valid code in the lint documentation"
if (shouldFetch) {
  const data = ~use~(fetchPromise); // Valid: the linter accepts use inside an if
}
```

Even with this flexibility, two operational rules remain:
1. **It must execute inside a component or custom Hook.** The documentation mandates that `use` must run during render passes.
2. **It cannot sit inside native error blocks.** Principle 5 explores why.

### Real mistake: skipping `use` when the Promise is already fulfilled

Developers sometimes attempt manual performance micro-optimizations:
1. A developer recognizes that `use` supports conditional execution.
2. They inspect internal status properties on the Promise to bypass `use` when data is already resolved:

```jsx title="src/Comments.jsx"
let comments;
if (~commentsPromise.status === 'fulfilled'~) { // **WRONG:** skips use based on the Promise itself
  comments = commentsPromise.value;
} else {
  comments = use(commentsPromise);
}
```

3. The application functions in local testing, and the code is deployed.
4. However, the documentation warns that manually bypassing `use` breaks Suspense optimizations and disables DevTools inspection features.

The documentation establishes a definitive guideline: "You can `use(promise)` conditionally, but don't conditionally `use(promise)` based on the promise itself." Our early return adheres to this rule by checking whether a Promise reference exists, rather than inspecting its resolution status.

Remember the distinction: Hooks rely on call-order indexing, while `use` relies on Promise references and Context providers.

---

## PRINCIPLE | `<ErrorBoundary>` above `<Suspense>`: a failed request shows an error line, and the title stays

> [!PRINCIPLE]
> **Principle 5: Error Boundary: A Rejected Promise Goes to the Closest Error Boundary**
>
> *Wrap the `<Suspense>` in an Error Boundary to show a fallback when the Promise is rejected, and never wrap `use` in `try` and `catch`.*
>
> When a Promise rejects, React retries the suspended component, causing `use` to throw the underlying error. The nearest enclosing Error Boundary catches this error and renders its fallback, preserving surrounding layout elements. Without an Error Boundary, unhandled render errors cause React to unmount the entire page. Because `use` integrates with Suspense by throwing internally, wrapping it in `try...catch` is strictly invalid.
>
> **DO THIS:**
> ```jsx
> <~ErrorBoundary fallback={<p>Could not load comments.</p>}~> {/* Catches the rejected Promise of the comments */}
>   <Suspense fallback={<p>Loading comments...</p>}>
>     <Comments commentsPromise={commentsPromise} />
>   </Suspense>
> </ErrorBoundary>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> try {
>   comments = ~use~(commentsPromise); // **WRONG:** use cannot be called inside try and catch
> } catch (error) {
>   return <p>Could not load comments.</p>;
> }
> ```

### A request that fails

Network operations inherently risk failure from server downtime or connectivity drops. To test failure handling, we add an error simulation helper to the request module:

```js title="src/fetchComments.js"
export function fetchCommentsWithError() {
  return new Promise((resolve, ~reject~) => { // JavaScript hands reject to this function as its second argument
    setTimeout(reject, 1000, ~new Error('Could not load comments')~); // After one second, the Promise is rejected
  });
}
```

The runtime provides `reject` alongside `resolve`. Calling `reject` with an Error instance transitions the Promise into a rejected state, recording that error as the failure reason.

### VS | `try` and `catch` vs. an Error Boundary: the error line inside the component, or above it

In standard JavaScript, functions intercept exceptions by wrapping operations in `try` and `catch` blocks. Developers instinctively attempt this pattern inside components:

```jsx title="try and catch around use"
let comments;
try {
  comments = ~use~(commentsPromise); // **WRONG:** use cannot be called inside try and catch
} catch (error) {
  return <p>Could not load comments.</p>;
}
```

React manages asynchronous rendering errors through component boundaries placed higher in the tree hierarchy. An Error Boundary wraps the Suspense boundary:

```jsx title="An Error Boundary around the Suspense boundary"
<~ErrorBoundary fallback={<p>Could not load comments.</p>}~> {/* Shown when the Promise is rejected */}
  <Suspense fallback={<p>Loading comments...</p>}>
    <Comments commentsPromise={commentsPromise} />
  </Suspense>
</ErrorBoundary>
```

> [!DEFINITION]
> **An Error Boundary.** [NEW] An Error Boundary is a React component that intercepts JavaScript errors thrown during the render phase of its child subtree. It displays a designated fallback user interface in place of the crashed subtree, keeping the rest of the application intact and interactive (Lesson 72).

Both techniques aim to display a failure message when requests fail. However, standard error handling violates framework requirements. The React documentation notes: "`use` throws internally to integrate with Suspense, so it cannot be wrapped in try-catch." Error handling must sit above the component.

```tree caption="Two ways to show an error line when the comments fail, and which one React allows."
Where the failure of the comments is handled
- !Inside `Comments` [`try` `catch`] | Wraps the line with `use` | **Not allowed**: `use` cannot sit inside `try` and `catch`
- +Above `Comments` [`ErrorBoundary`] | Wraps the `<Suspense>` around `Comments` | Shows **`Could not load comments.`** in place of the list
```

### Adding the Error Boundary to the page

React provides no built-in functional component for error boundaries. The official documentation states: "There is currently no way to write an Error Boundary as a function component." The React documentation relies on the `react-error-boundary` package, which we also adopt here. Lesson 72 demonstrates how to implement a custom class-based boundary.

Install the package via the terminal:

```bash title="Terminal"
npm install react-error-boundary
```

The application component imports `ErrorBoundary` and wraps the Suspense boundary. For testing purposes, the click handler invokes our failing helper:

```jsx title="src/App.jsx"
import { useState, Suspense } from 'react';
import { ~ErrorBoundary~ } from 'react-error-boundary'; // Comes from the react-error-boundary package
import { fetchCommentsWithError } from './fetchComments.js';
import Comments from './Comments.jsx';

export default function App() {
  const [commentsPromise, setCommentsPromise] = useState(null);
  return (
    <article>
      <h1>City park opens on Saturday</h1>
      {commentsPromise === null && (
        <button onClick={() => setCommentsPromise(~fetchCommentsWithError()~)}> {/* For this principle only: a request that fails */}
          Show comments
        </button>
      )}
      <~ErrorBoundary fallback={<p>Could not load comments.</p>}~> {/* Wraps only the comments section */}
        <Suspense fallback={<p>Loading comments...</p>}>
          <Comments commentsPromise={commentsPromise} />
        </Suspense>
      </ErrorBoundary>
    </article>
  );
}
```

### What the reader sees when the comments fail

The headline remains visible while the comments area displays the error message. Here is the operational sequence:
1. The user clicks the button, writing the failing Promise into state.
2. The comments component suspends, and the page displays the loading indicator.
3. One second later, the Promise rejects.
4. React retries rendering the comments component, causing `use` to throw the rejection error.
5. The nearest Error Boundary catches the error, rendering its fallback text in place of the loading indicator.
6. The headline remains rendered on screen because the boundary isolates only the comments subtree.

React logs the error to the console and identifies the catching boundary class. The production package minifies this class name to `C`, resulting in a message referencing `C`:

```page caption="The page after the Promise is rejected: the Error Boundary shows its fallback, and the title stays."
heading: City park opens on Saturday
line: Could not load comments.
console: Error: Could not load comments
  error: The above error occurred in the <Comments> component. React will try to recreate this component tree from scratch using the error boundary you provided, C.
```

### Without the Error Boundary, the whole article disappears

Consider what occurs if we omit `<ErrorBoundary>` and retain only `<Suspense>`. When the Promise rejects, no boundary catches the thrown error. The React documentation states: "By default, if your application throws an error during rendering, React will remove its UI from the screen."

The application crashes completely, removing the headline alongside the comments:

```page caption="The page after the Promise is rejected, with no Error Boundary: React removed everything."
blank
```

```devconsole width=full caption="The Console after the Promise is rejected, with no Error Boundary."
x Uncaught Error: Could not load comments
x An error occurred in the <Comments> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

```tree caption="The same rejected Promise, with and without an Error Boundary around the comments."
What the reader sees after the comments fail
- +With an Error Boundary around the comments [`ErrorBoundary`] | The boundary **catches the error** | The title stays, and the page shows **`Could not load comments.`**
- !Without an Error Boundary | **No component catches the error** | React **removes the whole page**, title included
```

### Real mistake: `try` and `catch` around `use`

This issue occurs when developers treat `use` like synchronous code:
1. A developer wraps `use` in a `try...catch` block to handle errors locally.
2. The user clicks the button. The screen immediately displays the error message, even with successful requests. When `use` suspends, it throws internally, and `catch` intercepts this signal as an application error.
3. The error view remains stuck on screen after data arrives, and React reports a warning in the console:

```page caption="With try and catch around use: the error line appears right after the click, while the request is still on its way."
heading: City park opens on Saturday
line: Could not load comments. | bad
console: `use` was called from inside a try/catch block. This is not allowed and can lead to unexpected behavior. To handle errors triggered by `use`, wrap your component in a error boundary.
```

4. Framework lint rules also flag `try` blocks enclosing `use`.

The React documentation documents this scenario under Troubleshooting with the heading "Suspense Exception: This is not a real error!" The resolution requires removing local catch blocks and wrapping components in Error Boundaries.

Remember the hierarchy: `<Suspense>` manages pending states, while Error Boundaries manage failures. Both operate above child components.

---

## All 5 Principles Together

### The complete files

Here is the finalized implementation. The click handler initiates the Promise and stores it in state. Prior to interaction, the comments component returns `null`. Following interaction, it unwraps the Promise using `use`. A Suspense boundary renders the loading indicator, while an Error Boundary coordinates error handling.

The click handler invokes `fetchComments` once again to restore standard resolution. The root entry file remains unchanged from the beginning of the lesson.

```js title="src/fetchComments.js"
const comments = [
  { id: 1, author: 'John', text: 'Great news!' },
  { id: 2, author: 'Mia', text: 'See you there.' },
];

export function fetchComments() {
  return new Promise(~resolve~ => { // Principle 1: the Promise is fulfilled with the comments after one second
    setTimeout(resolve, 1000, comments);
  });
}
```

```jsx title="src/Comments.jsx"
import { use } from 'react';

export default function Comments({ commentsPromise }) {
  if (commentsPromise === null) {
    return ~null~; // Principle 4: before the click, use is not called at all
  }
  const comments = ~use~(commentsPromise); // Principles 2 and 3: suspends, then returns the comments
  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.author}: {comment.text}</li>
      ))}
    </ul>
  );
}
```

```jsx title="src/App.jsx"
import { useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchComments } from './fetchComments.js';
import Comments from './Comments.jsx';

export default function App() {
  const [commentsPromise, setCommentsPromise] = useState(null);
  return (
    <article>
      <h1>City park opens on Saturday</h1>
      {commentsPromise === null && (
        <button onClick={() => ~setCommentsPromise(fetchComments())~}> {/* Principles 1 and 3: one Promise, created on click */}
          Show comments
        </button>
      )}
      <~ErrorBoundary fallback={<p>Could not load comments.</p>}~> {/* Principle 5: shown when the Promise is rejected */}
        <~Suspense fallback={<p>Loading comments...</p>}~> {/* Principle 2: shown while the Promise is pending */}
          <Comments commentsPromise={commentsPromise} />
        </Suspense>
      </ErrorBoundary>
    </article>
  );
}
```

```page caption="The finished page one second after the reader clicks Show comments."
heading: City park opens on Saturday
line: John: Great news!
line: Mia: See you there.
console: quiet
```

### How React renders the page from the first visit to the comments

On initial load, React renders `App` and `Comments`. The comments component returns `null`. Clicking the button commits the Promise to state. React then renders `Comments` once to detect pending data, and once more following fulfillment:

```tree dir=right caption="The order in which React renders App and Comments, from the first visit to the comments on the page."
From the first visit to the comments on the page
- +1. The page loads | React renders `App` and `Comments` | `commentsPromise` is `null`: `Comments` **returns null**
- +2. The reader clicks Show comments | The handler **stores a new Promise** | React renders `App` again
- +3. React renders `Comments` | `use` finds the Promise **pending** | `Comments` suspends: **`Loading comments...`**
- +4. The Promise is fulfilled | React renders `Comments` **again from its first line** | `use` returns the comments: **John and Mia**
- !If the Promise is rejected | `use` **throws the error** | The Error Boundary shows **`Could not load comments.`**
```

### The habit that hurts, and the rule

| Principle | The habit that hurts | The React rule |
| :--- | :--- | :--- |
| **1. Promise in state** | Awaiting network calls inside handlers, leaving the UI unresponsive | Create the Promise in the handler and preserve it in state |
| **2. Suspend** | Retaining legacy loading checks below `use` | Read the Promise with `use` and configure a Suspense fallback above |
| **3. Same instance** | Calling fetch helpers directly in render bodies | Provide stable promises created before render or retrieved from cache |
| **4. Not a Hook** | Checking promise status flags manually to skip `use` | Call `use` conditionally inside `if` statements or after early returns |
| **5. Error Boundary** | Enclosing `use` inside native `try` and `catch` blocks | Wrap boundaries with an Error Boundary to coordinate failure states |

Remember the central thesis of this lesson. **The `use` function unwraps a pending value during render. React displays the nearest `<Suspense>` fallback until fulfillment, then re-renders the component to deliver the value.**

---

## For the Interview

> **The Interview Question:** What is the use() API, and how does it read promises and context conditionally?

### How to Answer Clearly in 30 Seconds

"`use` is a React API that reads values during render from either a Promise or a Context. When unwrapping a Promise, `const data = use(promise)` returns the payload once fulfilled. While the Promise remains pending, the component suspends, prompting the nearest `<Suspense>` boundary to display its fallback. If the Promise rejects, the nearest Error Boundary catches the error and displays its fallback. Unlike standard Hooks, `use` can be called conditionally inside loops, `if` statements, or after early returns. Three core rules govern its usage:
1. **Referential stability**: Pass promises created before render, such as in event handlers or caches. Creating promises inside render bodies creates an infinite suspension loop.
2. **No native error handling**: Because `use` integrates with Suspense by throwing internally, wrapping it in `try...catch` blocks is invalid; rely on Error Boundaries instead.
3. **Execution scope**: While `use` can be called conditionally, it must execute within a component render pass or a custom Hook."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why can `use` sit inside an `if` when `useContext` cannot?"**
   Standard Hooks map to an internal linked list of hook records on the component fiber. React matches state pairs strictly by execution order. Skipping a Hook on a conditional render misaligns the pointer, handing subsequent Hooks corrupted data. The `use` API operates independently of the fiber hook list. When unwrapping a Promise, React attaches status and value tracking directly to the Promise object. When reading Context, React searches upward through the ancestor tree for the nearest provider. Because skipping `use` never alters a sequential call index, conditional calls remain completely safe.
2. **"What does `use` do with a Promise that is already fulfilled?"**
   It returns the resolved payload synchronously without suspending, provided React has already processed that Promise instance. The documentation explains that when `use` receives a previously fulfilled Promise, it reads the resolved value immediately. React caches the resolution status directly on the Promise object. If a Promise fulfills before React encounters it, such as when pre-fetching on hover, `use` still suspends briefly. React then reads the resolved value and mounts the subtree.
3. **"How do you let the reader try again after `Could not load comments.`?"**
   Retrying an operation requires instantiating a fresh Promise and resetting the Error Boundary. In practice, components render a retry button that triggers `startTransition` alongside a state setter to store a new Promise (Lesson 67). The parent supplies that Promise reference to the `resetKeys` prop of `ErrorBoundary`. When the key updates, the boundary automatically clears its error state and mounts the Suspense subtree to begin fetching again. Lesson 72 explores internal Error Boundary mechanics.
