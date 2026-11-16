# Lecture 88: How act Lets a Test See the Fetched Name

*(Why does a test read Loading... when the browser already shows John?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | What does act() do in tests, and why do state updates and effects need it?

---

## VS | render Alone vs. render Inside await act: both put the card on the page, only await act waits for John

> When a profile card mounts, it displays `Loading...` until the name arrives from the server. **An automated test executes synchronously line by line, never waiting on its own. Wrapping asynchronous operations in `await act` guarantees that React flushes every render and effect before your assertions run**. Without this wrapper, the test reads `Loading...` on a working component, fails, and prompts a hunt for a bug that does not exist.

In plain JavaScript, DOM modifications happen synchronously on the line you write. Setting `heading.textContent` changes the element immediately, so the very next statement reads the updated value. React does not work like that. Components never mutate the DOM directly. Instead, calling a root render method or a state setter asks React to schedule a render pass. In a browser, React performs this work so quickly that a user never notices the brief delay. In a test running in Node, the next JavaScript statement executes instantly, inspecting the DOM before React has processed the scheduled render.

```js title="Plain JavaScript: the page changes on this line"
heading.textContent = 'John';
console.log(~heading.textContent~); // John: the line above already changed the page
```

```jsx title="React: you ask, and React renders a moment later"
root.render(<ProfileCard />);
console.log(~container.textContent~); // An empty string: React has not rendered yet
```

To bridge this timing gap, React provides a dedicated testing helper named `act`. You place your rendering code or user interactions inside an `act` callback. The `act` helper returns only when React has completely flushed all queued work: the initial render, layout effects, passive effects, and any scheduled state updates. You already used this helper behind the scenes. In Lesson 87, the Follow button test verified the label change immediately after calling `fireEvent.click` because React Testing Library automatically wraps user events in `act`.

> [!DEFINITION]
> **What is act?** [NEW] `act` is a testing helper exported directly from `react`: `import { act } from 'react'`.
> 1. You pass a callback containing component rendering or user interactions to `act`: `await act(async () => { ... })`.
> 2. React queues all renders, passive effects, and state updates onto an internal act queue.
> 3. React flushes that queue completely, committing all changes to the DOM before `act` finishes.
>
> A helper like `act` guarantees that your assertions inspect the DOM only after React finishes updating the screen, matching what a human user observes. The name comes from the Act phase in the Arrange, Act, Assert testing pattern (Lesson 87).

### The profile card that loads its name

Consider a profile card in a web application. When the card first opens, it displays a loading placeholder:

```page width=text caption="The profile card when it opens: the name has not arrived yet."
heading: Loading...
```

A moment later, the network request finishes, and the user name replaces the placeholder:

```page width=text caption="The same card a moment later: the server has answered, and the card shows John."
heading: John | good
```

The component requests data inside an effect during its initial mount, following the standard pattern for data loading (Lesson 33). In a browser, the user waits a brief moment and sees the name appear. An automated test must verify that exact behavior: confirming that the heading displays `John`.

### Two tests for the same card

In the test environment, no real server is running. The test provides a mock implementation of `fetch` that returns `{ name: 'John' }` immediately. Principle 2 details how to configure this mock.

Both tests below locate the heading using `screen.getByRole('heading')`. In semantic HTML, heading tags from h1 to h6 share the accessible role `heading`. The first test mounts the component using `render` alone:

```jsx title="The test with render alone"
it('shows John after the server answers', () => {
  ~render(<ProfileCard />)~; // Puts the card on the page of the test
  expect(screen.getByRole('heading').textContent).toBe('John'); // **WRONG:** fails: the heading still reads Loading...
});
```

The second test wraps that same `render` call in `await act`:

```jsx title="The test with render inside await act"
it('shows John after the server answers', async () => {
  ~await act~(async () => { // Returns only when React has put John on the page
    render(<ProfileCard />);
  });
  expect(screen.getByRole('heading').textContent).toBe('John'); // Passes: the heading reads John
});
```

Both tests share almost everything: the same component, the same heading query, and the same expected text `John`. Only one thing differs. The second test waits for React before reading the heading.

It may look like the two tests do the same thing, but their runtime behavior is completely different! In a real browser, a human user waits for the network response and sees `John`. You might expect the first test to pass as well. It does not. A test never waits unless explicitly instructed to wait. The next statement executes instantly, inspecting the heading while it still displays `Loading...`:

```text title="Terminal: npm run test, the test with render alone"
 FAIL  src/ProfileCard.test.jsx > shows John after the server answers
AssertionError: expected 'Loading...' to be 'John' // Object.is equality

Expected: "John"
Received: "Loading..."
```

```tree caption="Two tests for the profile card: one reads the heading at once, one waits until React has put John on the page."
Two tests that check `John` on the profile card
- !With `render` alone [`render`] | Reads the heading **at once** | Gets **`Loading...`** and **fails**, though the card works
- +With `render` inside `await act` [`await act` `async`] | Waits until React has **applied the update after the answer** | Gets **`John`** and **passes**
```

### The Rule of Thumb: what happens inside await act is on the page

**Every state update and render triggered inside `await act` is committed to the DOM before the next statement runs. Anything React processes later is not present yet, so any asynchronous update must be awaited inside `await act`.**

Failing to coordinate this timing leads to misleading test failures:
1. The component functions properly in the browser, showing `Loading...` and then updating to `John`.
2. A test asserting on `John` fails. The developer assumes the component is broken and spends hours searching for a non-existent defect.
3. Alternatively, the developer changes the assertion to expect `Loading...` just to make the test pass. The test now passes, but it never verifies data loading, allowing components that never fetch data to pass unnoticed.
4. The terminal prints a warning stating that an update was not wrapped in `act`, leaving the developer confused about which statement caused it.

Experienced developers watch for three common misconceptions:
1. **Assuming the DOM updates synchronously on the calling line**, confusing React's scheduled rendering with direct property assignments (Lesson 01).
2. **Assuming helper functions handle every asynchronous update**, overlooking that built-in library wrappers only flush the immediate synchronous render pass (Lesson 87).
3. **Invoking `act` synchronously without `await`.** The official documentation notes that synchronous `act` cannot handle updates crossing asynchronous boundaries, and React plans to remove that form in future releases.

### Three ways to apply React's updates in a test

In production codebases, you will encounter three approaches to testing component updates:
1. **Using `act` from `react` around `root.render`.** The official React documentation presents this approach to demonstrate how React synchronizes updates without external libraries. The test creates a container DOM node and manages the testing environment flag manually. Principles 1 and 2 use this approach so you can observe exactly how `act` coordinates rendering.
2. **Using React Testing Library.** The official React documentation recommends this library to eliminate repetitive boilerplate, since its helper functions wrap renders and user events in `act` automatically. This approach serves as the standard for component tests. Principle 3 shows how it functions.
3. **Writing end-to-end browser tests.** Tools like Playwright run your application inside an actual browser engine. Because the entire browser runtime operates naturally, the official documentation notes that `act` is unnecessary in end-to-end suites. This lesson focuses on component-level tests.

## SECTION | A Profile Card That Fetches Its Name

The project is a Vite application configured with Vitest, jsdom, and React Testing Library already installed (Lesson 87). The test file sits directly next to the component it tests:

```files title="profile-card: File Explorer" caption="The files of the profile card project, with the test file next to the card it tests."
index.html | entry | The HTML page with the empty root div where React mounts
package.json | scripts | Holds the `"test": "vitest"` script, unchanged
vite.config.js | config | Names `jsdom` as the test environment, unchanged
src/
  main.jsx | boundary | Mounts `<App />` into `#root`
  App.jsx | parent | Renders `<ProfileCard />`
  ProfileCard.jsx | default export | Exports `ProfileCard`, which fetches the name in an Effect
  ProfileCard.test.jsx | test | Imports `ProfileCard` and checks the heading the user sees
```

The component stores the name in state, initialized to `null`. Its effect fetches the name from the network. While the state remains `null`, the heading displays `Loading...`:

```jsx title="src/ProfileCard.jsx"
import { useEffect, useState } from 'react';

export default function ProfileCard() {
  const [name, setName] = useState(null);

  useEffect(() => {
    ~fetch('/api/user')~ // Runs after the first render is on the page
      .then(response => response.json())
      .then(data => ~setName(data.name)~); // The name arrives, and React renders the card again
  }, []);

  return <h2>{name ?? 'Loading...'}</h2>;
}
```

The component triggers two sequential render passes. First, React renders `Loading...`. Then, after the network response arrives, calling `setName` triggers a second render pass displaying `John`. A test verifying the loaded state must wait for both passes to finish.

A production component would also include an active cleanup flag to prevent race conditions from out-of-order network responses (Lesson 33). We omit that cleanup here to keep the component focused on data fetching. The testing mechanics remain identical either way.

Now let us write tests and examine how they fail. Each principle shifts when the test inspects the DOM and demonstrates what each statement observes:

**PRINCIPLES:** A test executes synchronously, checking the DOM on the very next line. React applies its updates asynchronously. The `act` helper bridges this timing gap, ensuring React completes all pending work before assertions run. Three principles follow:
1. **Principle 1: `act` puts the first render on the page.** Calling `root.render` only schedules a render pass, leaving the container empty on the next line. Wrapping the render inside `await act` forces React to complete the initial render and execute effects before the test proceeds.
2. **Principle 2: `await act` with an async function waits until the name arrives.** Because the fetched name arrives across a promise resolution, synchronous `act` exits too early, leaving the heading at `Loading...`. Using `await act` with an async callback waits across the promise boundary and flushes the resulting state setter.
3. **Principle 3: The `act` inside `render` ends before the name arrives.** React Testing Library flushes the initial render during its mount helper, but that wrapper exits before asynchronous responses resolve. To test data arriving after a promise, you must still wrap `render` in `await act`.

---

## PRINCIPLE | `await act`: React renders the card and runs its Effect before the next line reads the page

> [!PRINCIPLE]
> **Principle 1: The First Render: `act` Puts the Card on the Page Before the Test Looks**
>
> *Wrap `root.render` in `await act(async () => { ... })`, so React renders the card and runs its Effects before the next line reads the page.*
>
> `root.render` only asks React for a render. The next line of the test runs at once, so it finds an empty container. Inside `act`, React puts the render on its act queue, applies it to the page, and runs the Effects before `act` finishes. Set `IS_REACT_ACT_ENVIRONMENT` to `true` first, so React knows it runs inside a test.
>
> **DO THIS:**
> ```jsx
> ~await act~(async () => { // React renders the card and runs its Effect first
>   createRoot(container).render(<ProfileCard />);
> });
> expect(container.textContent).toBe('Loading...');
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~createRoot(container).render(<ProfileCard />)~; // **WRONG:** React has not rendered yet, so the next line reads an empty container
> expect(container.textContent).toBe('Loading...');
> ```

To see how `act` operates without external abstractions, we start without a testing library. We write the test using `createRoot` and `root.render`, the same fundamental methods used in the application entry file (Lesson 07).

In this principle, the mock network request never resolves, so the card displays its initial state of `Loading...`. The test asserts on this loading placeholder.

### `root.render` alone vs. `root.render` inside `await act`

Here is the test attempting to assert directly after calling `root.render`:

```jsx title="The test with root.render alone"
const container = document.createElement('div');
document.body.appendChild(container);
~createRoot(container).render(<ProfileCard />)~; // Asks React for a render
expect(container.textContent).toBe('Loading...'); // **WRONG:** fails: the container is still empty
```

And here is the same render wrapped inside `await act`:

```jsx title="The test with root.render inside await act"
const container = document.createElement('div');
document.body.appendChild(container);
~await act~(async () => { // React renders and runs the Effect before act finishes
  createRoot(container).render(<ProfileCard />);
});
expect(container.textContent).toBe('Loading...'); // Passes
```

It might seem that both approaches should work, but their behavior is completely different! In an application entry file, calling `root.render` makes components appear on screen. This can lead developers to assume that rendering executes synchronously, like setting an element property.

That assumption is incorrect. Calling `root.render` does not construct DOM nodes synchronously on that line. Instead, it requests that React schedule a render pass. As the official documentation states: "Although rendering is synchronous once it starts, `root.render(...)` is not." Synchronous means an operation finishes completely before the next code statement runs. Because `root.render` is asynchronous:
1. The test executes `createRoot(container).render(<ProfileCard />)`. React records that a render is requested.
2. The next line runs immediately and reads `container.textContent`. Because React has not begun rendering, the container holds an empty string.
3. The test fails.

```text title="Terminal: npm run test, the test with root.render alone"
 FAIL  src/ProfileCard.test.jsx > shows Loading... while the server has not answered
AssertionError: expected '' to be 'Loading...' // Object.is equality

- Expected
+ Received

- Loading...
```

Vitest displays the missing content as a concise diff. The line `- Loading...` shows the expected value. No received text follows because the container remains completely blank.

React also prints a console warning stating that an update to Root was not wrapped in `act`, referring to our unwrapped call to `root.render`.

### What happens inside `await act`

When wrapped inside `act`, the execution order changes:
1. React does not attempt to render immediately. Instead, it places the render task onto its internal act queue.
2. When the callback passed to `act` finishes executing, React synchronously flushes the act queue, applying every queued update to the DOM together. The official documentation explains: "Any updates triggered within the `actFn`, are added to an internal act queue, which are then flushed together."
3. The render mounts `<h2>Loading...</h2>` inside the container, and React runs the component's effects. As the documentation confirms: "This ensures that the component is rendered and its effects are applied before making assertions."
4. Only after these DOM updates and effects finish does `act` complete. The next line inspects the container, finds `Loading...`, and the test passes.

```tree dir=right caption="Without act, the test reads the page before React renders; inside await act, React renders and runs the Effect first."
When the test reads the container
- !`root.render` alone [`root.render`] | React **notes** that a render is wanted | The next line reads **an empty container** and **fails**
- +`root.render` inside `await act` [`await act`] | React **renders the card and runs its Effect** before `act` finishes | The next line reads **`Loading...`** and **passes**
```

### The whole test file

Here is the complete test file for the initial render:

```jsx title="src/ProfileCard.test.jsx"
import { ~act~ } from 'react'; // The test helper comes from react itself
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import ProfileCard from './ProfileCard';

~globalThis.IS_REACT_ACT_ENVIRONMENT = true~; // Tells React that it runs inside a test

it('shows Loading... while the server has not answered', async () => {
  ~globalThis.fetch~ = () => new Promise(() => {}); // A fetch that never answers
  const container = document.createElement('div');
  document.body.appendChild(container);
  await act(async () => {
    createRoot(container).render(<ProfileCard />);
  });
  expect(container.textContent).toBe('Loading...');
});
```

Three critical statements appear in this test:
1. **Importing `act` directly from `react`.** In React 19, `act` is exported by the core `react` package. The test function is declared `async` because it uses `await` inside its body (Lesson 41).
2. **Creating and appending a container element.** The test creates a `<div>` and appends it to the document using `document.body.appendChild`. React mounts into this container rather than creating one automatically. The official documentation uses this exact pattern: "we create a container, append it to the document".
3. **Setting the environment flag.** Enabling `IS_REACT_ACT_ENVIRONMENT` tells React that it is running within an automated test harness.

> [!DEFINITION]
> **What is IS_REACT_ACT_ENVIRONMENT?** [NEW] `IS_REACT_ACT_ENVIRONMENT` is a global boolean flag that configures React for automated testing environments.
> Setting `globalThis.IS_REACT_ACT_ENVIRONMENT = true` informs React that test runners are managing updates through `act`.
> With this flag enabled, React warns whenever an update or effect occurs outside an `act` boundary, preventing silent timing errors.
> In real-world projects, this flag is typically defined once in a global test setup file rather than repeated in individual test files (Lesson 88).

### The test hands the card its own `fetch`

The component calls `fetch` to request user data, yet no real network request leaves the test suite. Here is how the mock operates:
1. `globalThis` refers to the top-level global object in JavaScript, providing access to built-in utilities like `fetch` across all files.
2. Before rendering, the test assigns a custom function to `globalThis.fetch`.
3. When the component effect calls `fetch`, it invokes the test's mock function instead of a browser network API.

The mock function returns `new Promise(() => {})`. Because this promise never resolves or rejects, it remains permanently pending. The MDN documentation defines a pending promise as one that is "neither fulfilled nor rejected". It never yields a value, simulating a server that has not yet responded. The effect runs inside `act`, initiating the fetch, but because the request never settles, the component continues displaying `Loading...`.

### The forgotten flag and the forgotten container

When writing component tests with direct `act` calls, developers frequently omit one of two statements.

First, omitting the environment flag prevents React from recognizing the test context. Calling `act` without the flag logs an explicit error:

```text title="Terminal: the test without IS_REACT_ACT_ENVIRONMENT"
The current testing environment is not configured to support act(...)
```

The fix requires adding `globalThis.IS_REACT_ACT_ENVIRONMENT = true;` in a setup file or at the top of the test file.

Second, omitting the DOM attachment leaves the container disconnected. The official documentation warns that dispatching DOM events requires containers to be attached to the document. In React 19, event listeners attach directly to root containers, so internal clicks still trigger handlers. However, querying elements from outside the container fails: `document.querySelector` and Testing Library's `screen` inspect the active document tree. If the container is never appended to `document.body`, external queries find nothing. Always call `document.body.appendChild(container)` when setting up manual roots.

---

## PRINCIPLE | `await act` with an `async` function: the test waits until the fetched name is on the page

> [!PRINCIPLE]
> **Principle 2: The Async Boundary: `await act` With an `async` Function Waits for the Answer**
>
> *When an update comes after a promise, write `await act(async () => { ... })`, so React runs the code after the promise and applies its setter before the test reads the page.*
>
> A promise runs its `.then` only after the current code has finished. `act` without `await` returns before that, so the test reads `Loading...`, and the setter runs outside `act` with a warning. With `await` and an `async` function, React also runs the code that crosses an async boundary and flushes the updates it schedules, such as `setName('John')`.
>
> **DO THIS:**
> ```jsx
> ~await act(async~ () => { // Waits until John has arrived and React has rendered it
>   createRoot(container).render(<ProfileCard />);
> });
> expect(container.textContent).toBe('John');
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~act~(() => { // **WRONG:** returns before setName runs, so the test reads Loading...
>   createRoot(container).render(<ProfileCard />);
> });
> expect(container.textContent).toBe('John');
> ```

Principle 1 verified the initial loading state. Now we test the text the user actually expects to see: `John`.

### Now the test's `fetch` answers

To test data arrival, the mock `fetch` must return a settled response. It returns an object matching the structure of a real response, including a `json` method (Lesson 33):

```jsx title="A fetch that answers John at once"
globalThis.fetch = () => ~Promise.resolve~({ json: () => Promise.resolve({ name: 'John' }) }); // Answers at once with an object that has a json function
```

`Promise.resolve` returns a promise that is already fulfilled with its value. Because the response resolves immediately, data comes directly from our test rather than an external server:
1. The component's first promise callback executes `response.json()`, invoking our mock method and receiving `{ name: 'John' }`.
2. The second callback executes `setName(data.name)`.
3. React re-renders the component, replacing the fallback placeholder with `John`.

### `act` without `await` vs. `await act` with an `async` function

The `act` helper can be invoked in two ways. The official documentation refers to the invocation without `await` as the synchronous version. Both wrap the same render call, followed by the same assertion:

```jsx title="act without await: the sync version"
~act~(() => { // Returns as soon as the first render and its Effect are applied
  createRoot(container).render(<ProfileCard />);
});
expect(container.textContent).toBe('John'); // **WRONG:** fails: the heading still reads Loading...
```

```jsx title="await act with an async function"
~await act(async~ () => { // Also waits for the code after the promise, and applies setName
  createRoot(container).render(<ProfileCard />);
});
expect(container.textContent).toBe('John'); // Passes
```

Both invocations look similar, but their runtime behavior differs fundamentally! For the loading test in Principle 1, no updates occur after the initial render, so both forms display `Loading...`. When state updates depend on an asynchronous promise, however, only `await act` with an async callback waits for `John`.

> [!DEFINITION]
> **What is an async boundary?** [NEW] An async boundary is a point where code yields execution to wait for a promise, such as a `.then` callback or an `await` expression.
> Any code placed after that boundary executes in a later turn of the event loop rather than synchronously on the current stack.
> In our component effect, two async boundaries exist: the chained `.then` callbacks that handle the network response and parse the JSON payload.
> The official documentation explains how `await act` handles these boundaries: "Since it is async, React will also run any code that crosses an async boundary, and flush any updates scheduled" (Lesson 88).

### Why the test without `await` still reads `Loading...`

**A promise that is already fulfilled still executes its `.then` callbacks asynchronously, never synchronously on the active stack.**

Recall how `setTimeout(fn, 0)` behaves: even with zero delay, the callback executes only after the active script finishes. A `.then` callback attached to a fulfilled promise waits in the microtask queue in the exact same way:

```js title="A fulfilled promise still runs its .then later"
Promise.resolve('John').then(name => console.log(name));
console.log('next line');
```

```page width=text caption="The Console: next line prints first, and John prints after it."
log: next line | test.js:2
log: John | test.js:1
```

Here is the exact sequence of events when running the test without `await`:
1. Inside `act`, React renders the component with `Loading...` and executes its effect.
2. The effect calls the mock `fetch`, which returns an immediately fulfilled promise.
3. The `.then` callbacks do not execute yet. They wait in the microtask queue until the active stack finishes.
4. Synchronous `act` finishes and returns immediately. The next line executes, reads `Loading...`, and the test fails.
5. Only after the test assertion fails do the microtasks execute, running `setName('John')` outside of any active `act` scope.

```text title="Terminal: npm run test, the John test with act without await"
 FAIL  src/ProfileCard.test.jsx > shows John after the server answers
AssertionError: expected 'Loading...' to be 'John' // Object.is equality

Expected: "John"
Received: "Loading..."
```

Because the environment flag is enabled, React notices that a state setter ran outside `act` and prints a console warning:

```text title="Terminal: the warning for setName outside act"
An update to ProfileCard inside a test was not wrapped in act(...).
```

The warning identifies the component name rather than the specific test line, which often leaves developers confused about where to look. The solution is replacing synchronous `act` with `await act`.

With `await act` and an async function, the execution sequence changes. React tracks the microtask queue across the promise boundary, places the resulting `setName('John')` update on its act queue, flushes it, and renders the component a second time. Only after that second render commits to the DOM does `act` complete. The assertion then reads `John`, and the test passes.

```tree dir=right caption="act without await returns before the name arrives; await act with an async function waits for the code after the promise."
When `setName` runs, compared with the test's check
- !`act` without `await` [`act`] | Returns after the **first render** | The test reads **`Loading...`** and fails, then `setName` runs **outside `act`** with a warning
- +`await act` with an `async` function [`await act` `async`] | Also runs the code **after the promise** and flushes `setName` | The test reads **`John`** and passes
```

The official documentation strongly advises awaiting an asynchronous callback: "We recommend using `act` with `await` and an async function." React plans to deprecate and remove the synchronous form in future releases.

### The timer that hides the bug

When developers encounter a failing test using synchronous `act`, they often attempt to fix it by adding an arbitrary delay before the assertion. While this delay may allow microtasks to finish, it slows down the test suite and introduces non-deterministic timing issues.

The clean fix requires just two keywords: prefixing `act` with `await`, and declaring its callback function async. The test then waits exactly as long as React needs to complete its work.

Here is the test file containing both tests:

```jsx title="src/ProfileCard.test.jsx"
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import ProfileCard from './ProfileCard';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

it('shows Loading... while the server has not answered', async () => {
  globalThis.fetch = () => new Promise(() => {});
  const container = document.createElement('div');
  document.body.appendChild(container);
  await act(async () => {
    createRoot(container).render(<ProfileCard />);
  });
  expect(container.textContent).toBe('Loading...');
});

it('shows John after the server answers', async () => {
  globalThis.fetch = () => Promise.resolve({ json: () => Promise.resolve({ name: 'John' }) });
  const container = document.createElement('div');
  document.body.appendChild(container);
  ~await act(async~ () => { // Waits for both .then calls and applies setName
    createRoot(container).render(<ProfileCard />);
  });
  expect(container.textContent).toBe('John');
});
```

Each test creates its own isolated container element, ensuring that rendering state does not leak between tests.

---

## PRINCIPLE | `render` from Testing Library: its own `act` covers the first render, not the name that arrives later

> [!PRINCIPLE]
> **Principle 3: Testing Library: Its Helpers Run `act`, but Not for the Answer That Comes Later**
>
> *React Testing Library wraps `render` and `fireEvent` with `act`; when the update comes after a promise, wrap `render` in `await act(async () => { ... })` yourself, and keep `IS_REACT_ACT_ENVIRONMENT` on for that `act`.*
>
> The `act` inside `render` applies the first render and runs the Effect, then ends when `render` returns. The fetched name arrives after a promise, so it arrives after that `act`. Our own `await act` around `render` waits for that code and applies the setter before the test checks the name.
>
> **DO THIS:**
> ```jsx
> ~await act~(async () => { // Covers the code after the promise too
>   render(<ProfileCard />);
> });
> expect(screen.getByRole('heading').textContent).toBe('John');
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> render(<ProfileCard />);
> expect(screen.getByRole('heading').textContent).toBe(~'Loading...'~); // **WRONG:** passes, but never checks that the name arrives
> ```

The test file in Principle 2 works properly, but repeating container creation and root management in every test creates excessive boilerplate. The official documentation points this out directly: "You might find using `act()` directly a bit too verbose. To avoid some of the boilerplate, you could use a library like React Testing Library, whose helpers are wrapped with `act()`."

### The same first render, with less code

The `render` utility from React Testing Library wraps component mounting in `act` automatically. Compare the two approaches for the initial render test:

```jsx title="The first render with root.render inside await act"
await act(async () => {
  ~createRoot(container).render(<ProfileCard />)~; // Our test wraps the render in act
});
expect(container.textContent).toBe('Loading...'); // Passes
```

```jsx title="The first render with render from Testing Library"
~render(<ProfileCard />)~; // Testing Library wraps the render in act for us
expect(screen.getByRole('heading').textContent).toBe('Loading...'); // Passes
```

For the initial render pass, both approaches achieve the same result: mounting the component and displaying `Loading...` before the next statement runs. Testing Library creates and attaches the container DOM node automatically, eliminating manual setup code. It also manages `IS_REACT_ACT_ENVIRONMENT` internally while executing its helpers.

### `render` alone vs. `render` inside `await act`, for the name

Now let us examine the test verifying `John` using the mock `fetch` from Principle 2. Here are the two approaches introduced at the beginning of the lesson:

```jsx title="The John test with render alone"
render(<ProfileCard />); // The act inside render ends when render returns
expect(screen.getByRole('heading').textContent).toBe('John'); // **WRONG:** fails: the heading still reads Loading...
```

```jsx title="The John test with render inside await act"
~await act~(async () => { // Our own act waits for the code after the promise
  render(<ProfileCard />);
});
expect(screen.getByRole('heading').textContent).toBe('John'); // Passes
```

Because developers know that Testing Library wraps helpers in `act`, they often assume they never need to invoke `act` manually. That assumption holds only for synchronous updates. The internal `act` wrapper inside the testing helper finishes the moment `render` returns. When data arrives across a promise resolution, that update occurs after Testing Library's wrapper has already completed.

Here is what happens step by step when using `render` alone:
1. The test calls `render(<ProfileCard />)`.
2. Inside `render`, Testing Library invokes its internal `act` wrapper. React renders `Loading...` and executes the effect, which calls the mock `fetch`.
3. The `render` utility finishes and returns. The promise callbacks remain pending in the microtask queue.
4. The next line executes immediately, reading `Loading...` where the test expected `John`, and the test fails.
5. In a subsequent microtask, `setName('John')` runs outside of any active `act` scope. When the testing flag is enabled, React prints a warning.

Wrapping `render` in our own `await act` keeps the synchronization window open across microtasks. React captures the subsequent `setName` update and flushes the second render before test execution proceeds. The heading reads `John`, and the test passes.

```tree caption="The act inside render covers only the first render; an await act around render also covers the name that arrives after the promise."
What each `act` covers in the John test
- !`render` alone [`render`] | Its `act` covers the **first render** and the **Effect**, then ends **before the name arrives** | The test gets **`Loading...`** and **fails**
- +`render` inside `await act` [`await act` `async`] | Our `act` also covers the **code after the promise** and `setName` | The test gets **`John`** and **passes**
```

### Why the click test of the Follow card needed no `await`

Recall the button click test from Lesson 87: that test verified `Following` immediately after calling `fireEvent.click` without requiring an await statement.
The state update triggered by that click involved no asynchronous promises. Testing Library's `fireEvent` helper wraps event dispatching in `act`. React flushes the resulting state change and re-render synchronously, returning only after the DOM reflects the updated label.
Fetching data over the network behaves differently because updates depend on promises. Because promise callbacks execute in subsequent microtasks after helper functions exit, testing asynchronous data flows requires an explicit `await act` boundary.

### The test that stopped checking the name

This subtle timing difference leads to a frequent testing mistake:
1. A developer writes a component test with `render` and immediately asserts on the fetched user name.
2. The test fails, reporting that the element still contains `Loading...`.
3. Knowing that Testing Library wraps helpers in `act`, the developer assumes synchronization is handled and misinterprets the failure.
4. To turn the test green, the developer changes the assertion to expect `Loading...`.
5. The test passes, but it now verifies only the initial loading skeleton. If a bug breaks data fetching entirely, the test continues to pass.

The proper fix preserves the assertion on John while wrapping `render` in `await act`:

```jsx title="src/ProfileCard.test.jsx"
import { ~act~ } from 'react'; // Still needed: Testing Library does not wrap the code after the promise
import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileCard from './ProfileCard';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

it('shows John after the server answers', async () => {
  globalThis.fetch = () => Promise.resolve({ json: () => Promise.resolve({ name: 'John' }) });
  ~await act~(async () => { // Waits until the name has arrived and React has rendered it
    render(<ProfileCard />);
  });
  expect(screen.getByRole('heading').textContent).toBe('John');
});
```

This approach eliminates manual container creation while maintaining explicit synchronization for asynchronous updates.

The environment flag line remains necessary here. While React Testing Library automatically manages `IS_REACT_ACT_ENVIRONMENT` in Jest environments, Vitest isolates global variables unless configured otherwise. Setting `globalThis.IS_REACT_ACT_ENVIRONMENT = true` ensures our custom `act` call is recognized without environment warnings.

---

## All 3 Principles Together

### The complete card and its test

The card remains unchanged from the beginning of the lesson:

```jsx title="src/ProfileCard.jsx"
import { useEffect, useState } from 'react';

export default function ProfileCard() {
  const [name, setName] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then(response => response.json())
      .then(data => ~setName(data.name)~); // Principle 2: runs after an async boundary, so the test must await act
  }, []);

  return <h2>{name ?? 'Loading...'}</h2>;
}
```

The test uses React Testing Library, retaining one `await act` call and the environment flag to handle the asynchronous response:

```jsx title="src/ProfileCard.test.jsx"
import { act } from 'react';
import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileCard from './ProfileCard';

~globalThis.IS_REACT_ACT_ENVIRONMENT = true~; // Principles 1 and 3: our own act runs outside the helpers of Testing Library

it('shows John after the server answers', async () => {
  ~globalThis.fetch~ = () => Promise.resolve({ json: () => Promise.resolve({ name: 'John' }) }); // Principle 2: the test's fetch answers John
  ~await act~(async () => { // Principles 1, 2 and 3: applies the render, the Effect, and setName before the check
    render(<ProfileCard />);
  });
  expect(screen.getByRole('heading').textContent).toBe('John');
});
```

When you execute `npm run test`, Vitest runs the suite and the test passes:

```text title="Terminal: npm run test on the finished test file"
 ✓ src/ProfileCard.test.jsx (1 test) 20ms
   ✓ shows John after the server answers 20ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  07:18:59
   Duration  300ms
```

### The order of one test run

**Every update scheduled inside `await act` is committed to the DOM before the test assertion executes.** That is the fundamental purpose of `act`. Here is the full execution order, from mocking network responses to verifying the rendered name:

```tree dir=right caption="The order of one test run: everything inside await act is applied before the test reads the heading."
How the test reaches `John`
- +1. The test replaces `fetch` [`globalThis.fetch`] | The card will get **the test's answer**
- +2. Inside `await act`: the first render [`render`] | The card shows **`Loading...`** | React **runs the Effect**, which calls `fetch`
- +3. Inside `await act`: the code after the promise [`.then`] | The two `.then` calls run | `setName` puts **`John`** in state
- +4. React flushes the act queue | React **renders the card again** | The heading now reads **`John`**
- +5. `act` finishes, then the check [`expect`] | The test reads the heading | **`John`**, and the test **passes**
```

| What the test does | What it reads | The fix |
| :--- | :--- | :--- |
| **Calls `root.render` and reads the next line** | An empty container | Wrap the render in `await act`, so React renders and runs the Effects first |
| **Calls `act` without the flag** | The error `The current testing environment is not configured to support act(...)` | Set `IS_REACT_ACT_ENVIRONMENT` to `true` whenever the test calls `act` itself |
| **Writes `act` without `await`** | `Loading...`, and `setName` runs outside `act` | Write `await act(async () => { ... })`, which also runs the code after the promise |
| **Trusts that `render` waits for everything** | `Loading...`, so the test gets changed to check `Loading...` | `render` covers the first render only; wrap it in `await act` when the update comes later |

Remember the core takeaway of this chapter. **A test executes synchronously line by line. Wrap asynchronous rendering in `await act` so React flushes every update and promise resolution before your assertions run.**

---

## For the Interview

> **The Interview Question:** What does act() do in tests, and why do state updates and effects need it?

### How to Answer Clearly in 30 Seconds

"In React tests, `act` ensures that all pending renders, lifecycle effects, and state updates are flushed to the DOM before assertions run. Tests execute synchronously line by line, but React schedules renders and state updates asynchronously. Calling `root.render` does not construct DOM nodes synchronously, so an immediate assertion inspects an empty element. Wrapping interactions in `act` places tasks onto an internal act queue that React flushes completely before the helper resolves. When updates depend on asynchronous operations like network fetches, you must use `await act` with an async callback. This keeps the synchronization window open across microtasks, allowing React to capture resolved promises and commit the resulting state updates before assertions execute."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What work does `act` flush internally during a test?"**
   It flushes all updates scheduled inside its callback scope: the initial virtual DOM render, layout and passive effects, and any state setter calls triggered by those effects. React queues these updates on an internal act queue and processes them synchronously in batch, committing the final DOM modifications before `act` returns. When using `await act` with an async callback, React tracks microtasks across promise boundaries. It ensures that state updates scheduled inside `.then` callbacks are fully applied before assertions run.
2. **"How do testing libraries like React Testing Library integrate with `act`?"**
   Testing libraries wrap their core utilities, such as `render` and `fireEvent`, in `act` by default. This automatic wrapping ensures that synchronous user events like button clicks flush state changes and re-render the DOM immediately before the next test line executes. However, this built-in wrapping only covers synchronous execution paths within the helper itself. When component updates depend on unresolved promises or delayed timers, the helper's internal `act` completes before those asynchronous tasks resolve. In those cases, developers must wrap the operation in an explicit `await act` block or use asynchronous utilities like `waitFor` to coordinate DOM assertions.
3. **"Where is `act` imported from in React 19, and is it used in production code?"**
   In React 19, `act` is imported directly from the core `react` package: `import { act } from 'react'`. The historical import from `react-dom/test-utils` has been deprecated. `act` is strictly a testing utility and is omitted from production builds; attempting to call it in production throws a `TypeError`. In real browser environments, React coordinates its own scheduling across event loops naturally. If production code ever requires immediate, synchronous DOM flushing for specialized use cases like measuring layouts, React provides `flushSync` rather than `act`.

```tree dir=right caption="Interview comparison: what a test sees without act, with the sync version, and with await act and an async function."
What the line after the render sees
- !No `act` [`root.render`] | React has **not rendered yet** | An **empty container**
- !`act` without `await` [`act`] | First render and Effects **applied** | **`Loading...`**, and `setName` later runs **outside `act`**
- +`await act` with an `async` function [`await act` `async`] | Also the **code after the promise** and its setter | **`John`**, the word the user sees
```
