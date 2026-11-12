# Lecture 33: Fetching Data in an Effect, with Loading, Errors, and Race Conditions
> INTERVIEW QUESTION | ❱ CORE | How do you fetch data from an API in a client component, and how do you handle loading, error, and race conditions?

---

## The Collision Between Synchronous Rendering and the Asynchronous Wire

### React renders in milliseconds; the network answers in seconds

React rendering is instant and synchronous. When a component mounts or receives new props, React executes its function and expects JSX immediately. It cannot pause to wait for a remote server.

The data your component needs lives across the network. That physical separation creates the three core challenges of client-side data fetching:
1. **The Blank Screen**: React renders before the server answers. The component must supply an immediate visual fallback such as `Loading...`.
2. **The HTTP Deception**: When a server crashes with an HTTP 500 error, `fetch` treats the exchange as a successful promise resolution. The screen hangs forever unless code verifies `response.ok`.
3. **The Network Race**: The network has no memory of user intent. A slow request from an earlier click can finish after a fast request from a later click, silently overwriting fresh data with stale content.

```tree caption="What a page that loads data from a server must show, from the click to the answer."
From the click on a name to the bio on the page
- +While the page waits | The request is on its way | The page shows **`Loading...`**
- +When the server answers | The bio arrives | The page shows **the bio**
- !When the server fails | No bio arrives | The page shows **an error line**, not `Loading...` forever
```

### What is at stake: the ghost overwrite

Users click something on the screen, then another, then another. Meanwhile React is expected to fetch one thing, then another, then another. When one response comes forth, it may be too late, the user is somewhere else, expecting something else to see.

So for example picture our team directory. The user clicks Bob, whose server lookup is slow and takes two seconds. Realizing their mistake, the user immediately clicks Taylor, whose lookup takes 200 milliseconds. Taylor's bio arrives first and renders. But a moment later, Bob's late response arrives, executes its setter, and overwrites the screen.

The page now displays the wrong information! The page now displays Taylor's name with Bob's bio underneath. The console stays quiet. And the problem is not always the low speed of the internet. In a high-speed office network, responses arrive in order, if React is not set up properly the team never notices the defect. A customer on a mobile phone hits these kinds of bugs every day.

Developers commonly make four mistakes here:
1. They assume the latest click always receives the latest response.
2. They omit cleanup code (which allows stale background requests to overwrite fresh state when they finally resolve).
3. They expect `fetch` to reject on server errors.
4. Finally, when they cancel an obsolete request, they accidentally treat that cancellation as a fatal crash.

### Two cures for the late answer: discard in JavaScript or kill at the socket

When the user moves from Bob to Taylor, Bob's in-flight request becomes a **zombie request**: work that is still running, but whose answer is no longer wanted. Cleanup logic must neutralize that old dead-walking zombie (as seen in Lesson 32). You have two choices:

- **Choice A: Let the zombie finish, then ignore it.** The request completes its full round-trip across the internet. When the promise finally resolves, an `!ignore` check sees that the user moved on and quietly skips the state update.
  - *Trade-off:* Simple to write and works with any third-party promise library, but wastes mobile data and server CPU.

- **Choice B: Kill the zombie before it finishes.** The component hands `fetch` an abort signal. When cleanup runs, it calls `controller.abort`. The browser immediately tears down the TCP socket, freeing up radio power and network bandwidth.
  - *Trade-off:* Highly efficient for production mobile apps, but requires your `.catch` block to filter out the intentional `AbortError`.

From the user's perspective, both approaches look identical: Taylor's profile appears without being overwritten by Bob. In the logic of the code, Choice A lets the ghost payload travel all the way into the browser, while Choice B stops it dead in its tracks.

### Our example page: the three teammate buttons

Our team page provides three buttons: Alice, Bob, and Taylor. Below the buttons sit the chosen person's name and one line for their bio. The page opens on Alice. Here is what happens:
1. The page opens. The screen displays `Loading...`, followed by Alice's bio.
2. The user clicks Bob. The screen displays `Loading...` for two seconds because the server is slow for Bob, then shows Bob's bio.
3. The user clicks Bob and immediately clicks Taylor. The page must display Taylor's bio.

The remote server answers at a dedicated bio endpoint. It returns JSON text containing a single field, with Alice and Taylor responding in 200 milliseconds and Bob taking two full seconds.

The root component stores the selected person in state and passes it downward:

```jsx title="src/App.jsx"
import { useState } from 'react';
import Bio from './components/Bio.jsx';

export default function App() {
  const [person, setPerson] = useState('Alice');

  return (
    <main>
      <button ~onClick={() => setPerson('Alice')}~>Alice</button> {/* Sets the active person to Alice */}
      <button onClick={() => setPerson('Bob')}>Bob</button>
      <button onClick={() => setPerson('Taylor')}>Taylor</button>
      <h2>{person}</h2>
      ~<Bio person={person} />~ {/* Renders the bio for the selected person */}
    </main>
  );
}
```

At the start of the lesson, the profile component only holds a container for the text:

```jsx title="src/components/Bio.jsx"
import { useState } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);

  return <p>{~bio ?? 'Loading...'~}</p>; // Displays placeholder text while bio is null
}
```

State starts as `null` because no data has arrived. The nullish coalescing operator falls back to the placeholder string whenever `bio` is missing.

```page width=text caption="The team page when it opens: the line under Alice's name shows Loading... and never changes."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: Loading...
console: quiet
```

Ten seconds later, the screen still displays `Loading...`. No code has requested data from the server.

The application mounts inside Strict Mode (as seen in Lesson 07):

```files title="team-page: File Explorer" caption="How the team page project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts the application inside Strict Mode
  App.jsx | parent | Manages person state and renders name buttons
  components/
    Bio.jsx | Effect | Fetches profile text for the requested person
```

### Four Principles of Fetching Data in an Effect

**PRINCIPLES:** A component that renders remote data requests it inside an Effect. It displays placeholders during transit and failure, and uses cleanup logic to prevent stale responses from overwriting fresh data. Four principles govern this pattern:
1. **Principle 1: Keep State Synchronized With Remote Data in an Effect**: The browser sends the request and receives a promise. The request lives in an Effect keyed to `person`, and the screen displays `Loading...` until data arrives.
2. **Principle 2: Interrogate response.ok Because fetch Never Rejects on Server Crashes**: Network requests only reject on connection failure. When the server returns a failure status, code must inspect `response.ok` and reveal the error message.
3. **Principle 3: Stale Payloads: The ignore Flag Drops Out-of-Order Answers**: When a user selects another teammate before the first request resolves, the older answer can land last. The cleanup routine flags stale requests so their payloads are discarded.
4. **Principle 4: Socket-Level Cancellation: AbortController Stops Wasted Bandwidth**: The browser can cancel active requests through an abort signal. Canceled requests reject with an `AbortError`, which code must silently ignore rather than treating as a page crash.

Here is the complete principle map:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Keep State Synchronized With Remote Data in an Effect** | Data arrives after initial render, so omitting loading states leaves an empty screen, and omitting dependencies freezes the display on the first person. | Call `fetch` inside `useEffect`, declare dependencies like `[person]`, and render fallback UI while data is `null`. |
| **Principle 2** | **Interrogate response.ok Because fetch Never Rejects on Server Crashes** | `fetch` resolves successfully even on HTTP 500 responses, so without status checks the component hangs on loading placeholders indefinitely. | Verify `response.ok`, throw on false values, and catch the error to set error state. |
| **Principle 3** | **Stale Payloads: The ignore Flag Drops Out-of-Order Answers** | Stale network responses can finish out of order and overwrite newer user choices without triggering errors. | Set a local flag to true in the cleanup callback, and update state only when that flag is still false. |
| **Principle 4** | **Socket-Level Cancellation: AbortController Stops Wasted Bandwidth** | Aborting cancels the socket immediately, but throwing an unhandled `AbortError` triggers false error screens for users. | Attach `controller.signal` to `fetch`, call `controller.abort` in cleanup, and bypass `AbortError` in the catch handler. |

---

## 1. Principle 1: Keep State Synchronized With Remote Data in an Effect

### fetch sends the request, and the answer comes later

The browser exposes a global function named `fetch`. It dispatches an HTTP request to a server URL. Here is how three lines request Alice's bio and log it:

```jsx title="Asking the server for Alice's bio"
~fetch('/api/bio/Alice')~ // Starts the network request and returns a promise
  .then(response => ~response.json()~) // Parses the returned JSON text into an object
  .then(data => console.log(data.bio)); // Receives the parsed profile object
```

Calling `fetch` does not return the bio immediately. The bio is still traveling across the network. Instead, `fetch` returns a promise right away. A promise is a JavaScript object representing a future value. Calling `.then` attaches a callback that runs once the network responds:
1. `fetch` starts the request and returns a promise.
2. When the server replies, the browser creates a `response` object and passes it to the first callback.
3. Calling `response.json` reads the response stream and parses the JSON text. That reading step also takes time and returns another promise.
4. When parsing finishes, the second callback receives the resulting data object.

```tree dir=right caption="How the bio travels from the server to our code, one promise at a time."
From `fetch` to the bio
- +1. Send [`fetch`] | The browser **sends the request** | Our code gets a **promise** at once
- +2. Answer [`response`] | The server **answers**; the first `.then` runs | `response.json` **reads the JSON**
- +3. Data [`data.bio`] | The second `.then` runs | Our code has **the bio**
```

### Why the request goes in an Effect

The request must run because the profile component is visible on the screen and must synchronize with the selected teammate. No button click happens inside this child component. Synchronizing with external systems while a component stays visible is the exact purpose of an Effect (as seen in Lesson 32).

We place the request inside `useEffect`, and let the final callback save the result into state:

```jsx title="src/components/Bio.jsx" startLine="1"
import { useState, ~useEffect~ } from 'react'; // Imports the Effect hook from React

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);

  useEffect(() => {
    ~setBio(null);~ // Resets state to null so the loading message reappears during transit
    fetch('/api/bio/' + person)
      .then(response => response.json())
      .then(data => ~setBio(data.bio)~); // Stores the arrived text and triggers a re-render
  }, ~[person]~); // Re-executes the Effect whenever the selected person changes

  return <p>{bio ?? 'Loading...'}</p>;
}
```

Because the target address depends on `person`, the Effect reads `person` and must list it in its dependency array. Every time the user selects another person, the prop changes, and React schedules the Effect to run for that new name. Resetting `bio` to `null` at the start of the callback ensures old bio text clears immediately instead of lingering during the fetch.

The page opens on `Loading...`, and a moment later displays Alice's bio:

```page width=text caption="The team page a moment after it opens: the Effect has loaded Alice's bio."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: This is Alice’s bio. | good
console: quiet
```

When the user selects Bob, the screen displays `Loading...` for two seconds, and then renders Bob's bio:

```page width=text caption="The team page right after the user clicks Bob: Loading... for two seconds, while the server answers."
line: [Alice] [Bob] [Taylor]
heading: Bob
line: Loading...
console: quiet
```

This fallback text represents the loading state. It costs nothing extra: state starts at `null`, and our JSX displays `Loading...` whenever the value is missing.

### Dependencies control re-fetching

The dependency array determines whether selecting a new teammate triggers a new network request:

```jsx title="Comparing correct and empty dependency arrays"
useEffect(() => { /* fetch profile */ }, ~[person]~); // Triggers a new request whenever person updates
useEffect(() => { /* fetch profile */ }, ~[]~); // **WRONG:** runs only on initial mount and leaves the display frozen
```

Both options load Alice when the page first appears. But with an empty array, the Effect never runs again. When the user clicks Bob, the heading updates to Bob while the bio paragraph stays stuck on Alice.

### Two requests during development

In development mode, opening the page causes two network requests for Alice. This double invocation stems from Strict Mode (as seen in Lesson 32). React intentionally runs setup, cleanup, and setup again on mount to expose missing cleanup logic. In production builds, React executes the Effect setup only once.

> [!PRINCIPLE]
> **Principle 1: Fetching: Keep State Synchronized With Remote Data in an Effect**
>
> *When a component needs remote data matching its props, it calls `fetch` inside `useEffect`. It lists dynamic props in the array, updates state upon arrival, and shows fallback UI during transit.*
>
> `fetch` issues a network request and returns a promise that resolves later. The operation belongs in an Effect because the component must stay synchronized with server data while mounted. Listing every dynamic prop ensures each user selection starts a fresh request.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   setBio(null);
>   fetch('/api/bio/' + person)
>     .then(response => response.json())
>     .then(data => setBio(data.bio));
> }, ~[person]~); // Fires a new request whenever person updates
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   fetch('/api/bio/' + person)
>     .then(response => response.json())
>     .then(data => setBio(data.bio));
> }, ~[]~); // **WRONG:** runs only on mount and ignores subsequent person changes
> ```

---

## 2. Principle 2: Interrogate response.ok Because fetch Never Rejects on Server Crashes

### fetch fails only when it cannot reach the server

Servers sometimes experience outages. When an internal error strikes, the server still returns an HTTP response, but with an error status such as 500 instead of 200. Crucially, the browser's `fetch` function treats that error response as a successful promise resolution. The promise returned by `fetch` only rejects when an actual network failure occurs, such as a dropped internet connection or an invalid domain name.

```tree dir=right caption="Why fetch treats server failure codes as resolved promises."
How fetch separates network errors from HTTP status codes
- !Network failure [fetch rejects] | DNS fails or device goes offline | Code jumps straight to **catch**
- +Server status 200 [fetch resolves] | Server answers with data | `response.ok` is **true**
- !Server status 500 [fetch resolves] | Server answers with an error | `response.ok` is **false** and must be thrown
```

For the user, a broken server and a lost connection produce the same outcome: no bio. But for `fetch`, they take two entirely different code paths. With a severed connection, the promise rejects. With an HTTP 500 response, the promise resolves normally, carrying the error code inside the response object.

### The server fails, and the page says Loading... forever

**Beware! If the server crashes, fetch still succeeds, and without a status check the screen stays stuck on Loading... forever.** Here is why: the server returns an error object with no bio property, so the component keeps waiting for data that will never arrive.

Consider what happens when the server fails with status 500:
1. The Effect sets state to `null`, displaying the loading message.
2. The server responds with status code 500.
3. The `fetch` promise resolves successfully because communication occurred.
4. Parsing the error JSON yields an object with no `bio` property, making `data.bio` undefined.
5. Calling the setter assigns undefined to state, causing the component to fall back to `Loading...` forever.

```page width=text caption="The team page when the server answers with status 500 and the code has no check: Loading... with no end."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: Loading... | bad
console: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
console: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

The user waits endlessly for data that will never arrive. The only clue appears in the browser console, which logs the 500 error code for each request.

### Checking response.ok and showing the error line

The `response` object provides a boolean property named `ok`. It evaluates to true for status codes from 200 through 299, and false for any other number. When `response.ok` is false, our code must throw an Error explicitly. Throwing inside a promise callback rejects that promise, skipping subsequent success handlers and jumping directly to the catch block.

We store the failure in dedicated error state:

```jsx title="src/components/Bio.jsx" startLine="3" good="10,11,12,17"
export default function Bio({ person }) {
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBio(null);
    ~setError(null);~ // Clears previous error state before launching a new request
    fetch('/api/bio/' + person)
      .then(response => {
        if (~!response.ok~) { // Detects HTTP error codes such as 404 or 500
          throw new Error('Status ' + response.status); // Diverts execution into the catch block
        }
        return response.json();
      })
      .then(data => setBio(data.bio))
      ~.catch(err => setError(err));~ // Captures the thrown error and triggers an error display
  }, [person]);

  if (error) {
    return <p>Could not load the bio.</p>;
  }
  return <p>{bio ?? 'Loading...'}</p>;
}
```

Now a failing server provides immediate visual feedback:

```page width=text caption="The team page when the server answers with status 500 and the code checks response.ok: the error line."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: Could not load the bio. | good
console: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
console: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

Clearing `error` state back to `null` at the start of each Effect run is vital. Without that reset, clicking another teammate leaves the old error message visible even when the new request succeeds.

The component now supports three clean UI states: loading, error, and content.

> [!PRINCIPLE]
> **Principle 2: Errors: Interrogate response.ok Because fetch Never Rejects on Server Crashes**
>
> *Because `fetch` treats error status codes like 500 as resolved promises, code must verify `response.ok` and handle the resulting rejection to render helpful feedback.*
>
> Without verifying response status, error payloads pass into data parsers where missing properties leave the screen hanging on loading placeholders. Checking `response.ok` directs failed status codes into the catch block, allowing components to present helpful error messages.
>
> **DO THIS:**
> ```jsx
> fetch('/api/bio/' + person)
>   .then(response => {
>     if (~!response.ok~) throw new Error('Status ' + response.status); // Diverts HTTP failures to catch
>     return response.json();
>   })
>   .then(data => setBio(data.bio))
>   .catch(err => setError(err));
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> fetch('/api/bio/' + person)
>   .then(response => ~response.json()~) // **WRONG:** passes status 500 responses into JSON parsing
>   .then(data => setBio(data.bio));
> ```

---

## 3. Principle 3: Stale Payloads: The ignore Flag Drops Out-of-Order Answers

### Bob's late answer replaces Taylor's bio

**Beware! Without cleanup, what the screen displays at the end is NOT what you clicked last; it is whatever arrived last.** Let's see an example where the information about one name, Bob arrives slowly, the initial click lands last and overwrites the final and actual choice.

Consider what happens when our component lacks cleanup code and the user clicks twice in rapid succession:
1. The user clicks Bob. State updates to Bob, and the Effect launches a request that takes two seconds to finish. The screen shows `Loading...`.
2. Half a second later, the user clicks Taylor. A new Effect run launches a request for Taylor, which takes 200 milliseconds.
3. Taylor's response returns first. The setter updates state with Taylor's bio.
4. Over a second later, Bob's response finally arrives. Because no cleanup told it to stop, its success callback runs and overwrites the screen with Bob's bio.

```page width=text caption="The team page three seconds after the user clicks Bob and then Taylor, with no cleanup: Bob's bio under Taylor's name."
line: [Alice] [Bob] [Taylor]
heading: Taylor
line: This is Bob’s bio. | bad
console: quiet
```

This bug is a **race condition**. Two network requests raced against each other across the internet and resolved in a different order than they were dispatched. No crash occurred, and the console shows no warning.

```tree dir=right caption="How a slow network request overtakes a fast one in a race condition."
Timeline of two clicks without cleanup
- +User clicks Bob [0.0s] | Server request starts | Bob takes two full seconds to answer
- +User clicks Taylor [0.5s] | Second request starts | Taylor takes only a fifth of a second
- +Taylor arrives first [0.7s] | `setBio` runs | Screen displays Taylor
- !Bob arrives last [2.0s] | Bob `setBio` runs late | Screen displays Bob under Taylor
```

### The ignore flag

The official React documentation recommends a local flag pattern. Every time the Effect executes, it creates a local boolean variable named `ignore`, initialized to false. The cleanup callback sets that variable to true. The promise handler updates state only if `ignore` remains false:

```jsx title="The ignore flag pattern"
useEffect(() => {
  ~let ignore = false;~ // Creates a local flag scoped to this specific Effect execution
  fetchBio(person).then(result => {
    if (~!ignore~) { // Verifies this execution is still active before updating state
      setBio(result);
    }
  });
  return () => {
    ~ignore = true;~ // Marks this run as stale when cleanup executes
  };
}, [person]);
```

Each Effect invocation closes over its own independent `ignore` variable. When `person` changes, React executes the previous invocation's cleanup before running the new setup. That cleanup flips the previous flag to true.

```tree dir=right caption="How the ignore flag drops the late response."
Timeline of two clicks with the ignore flag
- +User clicks Bob [0.0s] | First setup runs | Flag `ignore` is false
- +User clicks Taylor [0.5s] | Bob cleanup runs first | Bob flag `ignore` flips to true
- +Taylor arrives [0.7s] | Taylor flag is false | Screen displays Taylor
- +Bob arrives late [2.0s] | Bob flag is true | Bob setter is skipped
```

### The ignore flag in Bio

In our component, the flag guards both data and error setters so late errors are dropped too:

```jsx title="src/components/Bio.jsx" startLine="7" good="8,18,19,22,23,24"
  useEffect(() => {
    ~let ignore = false;~ // Scopes a fresh boolean flag to this execution
    setBio(null);
    setError(null);
    fetch('/api/bio/' + person)
      .then(response => {
        if (!response.ok) {
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => { if (!ignore) setBio(data.bio); }) // Discards the data if a newer request started
      .catch(err => { if (!ignore) setError(err); }); // Discards the error if a newer request started
    return () => {
      ~ignore = true;~ // Invalidates this request when person changes or the component unmounts
    };
  }, [person]);
```

Here is how the two rapid clicks play out with the flag active:
1. The user clicks Bob. The first Effect run dispatches Bob's request with its local flag set to false.
2. The user clicks Taylor. Before launching the second Effect, React calls the cleanup of the first run, setting the first flag to true. The second Effect runs with its own flag set to false.
3. Taylor's bio arrives first. Its flag is false, so the screen renders Taylor's profile.
4. Bob's bio arrives later. Its flag is now true, so state updates are bypassed completely.

```page width=text caption="The team page three seconds after the user clicks Bob and then Taylor, with the ignore flag: Taylor's bio under Taylor's name."
line: [Alice] [Bob] [Taylor]
heading: Taylor
line: This is Taylor’s bio. | good
console: quiet
```

The ignore flag works with any asynchronous operation, including custom API libraries. However, while the stale payload is discarded, Bob's request still consumed server resources and bandwidth. Principle 4 cancels the request directly.

> [!PRINCIPLE]
> **Principle 3: Race Conditions: Stale Payloads: The ignore Flag Drops Out-of-Order Answers**
>
> *Because network responses can resolve out of order, cleanup logic must flag stale requests so late-arriving responses never overwrite newer state.*
>
> A slow initial request can easily finish after a faster subsequent request. Initializing a local boolean to false and flipping it to true in the cleanup function guarantees that only the most recently initiated request updates component state.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   let ignore = false;
>   fetch('/api/bio/' + person)
>     .then(response => response.json())
>     .then(data => { ~if (!ignore)~ setBio(data.bio); }); // Applies data only if this request is still active
>   return () => { ignore = true; };
> }, [person]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   fetch('/api/bio/' + person)
>     .then(response => response.json())
>     .then(data => ~setBio(data.bio)~); // **WRONG:** allows stale responses to overwrite newer user selections
> }, [person]);
> ```

---

## 4. Principle 4: Socket-Level Cancellation: AbortController Stops Wasted Bandwidth

### Stopping a request with AbortController

The browser provides a native mechanism to terminate active fetches: the `AbortController`. It works in three concise steps:

```jsx title="Stopping a request with AbortController"
const controller = ~new AbortController()~; // 1. Instantiates a new abort controller
fetch('/api/bio/Bob', { ~signal: controller.signal~ }); // 2. Hands the controller signal to fetch
~controller.abort();~ // 3. Cancels the in-flight network request
```

The `signal` property communicates cancellation to the underlying network stack. Passing the signal option instructs `fetch` to monitor that controller. When code calls `controller.abort`, the browser terminates the HTTP socket, causing the promise to reject with an `AbortError`.

### Comparing the ignore flag and abort

Compare the two cleanup strategies side by side:

```jsx title="Comparing ignore flag cleanup with controller abort cleanup"
return () => { ~ignore = true;~ }; // Completes the transfer but discards the payload
return () => ~controller.abort()~; // Cancels the network transfer immediately
```

Both strategies protect the user interface from stale data. With an `ignore` flag, the browser still downloads Bob's bio in the background before discarding it. With `controller.abort`, the browser closes the network connection the moment the user selects Taylor, saving bandwidth and mobile data.

### The abort reaches .catch

**Beware! Stopping a request with AbortController makes fetch reject with an AbortError.** If your error handler does not filter out this specific name, every normal cancellation displays a false error screen to the user.

Consider what happens when a developer replaces the ignore flag with `AbortController` without updating the catch block:

```page width=text caption="The team page when it opens in development, with abort in the cleanup and a catch that keeps every error: the error line."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: Could not load the bio. | bad
console: quiet
```

The server is healthy, yet the screen claims loading failed. Here is why:
1. React mounts the component and executes the Effect, creating the first controller and dispatching the first request.
2. Strict Mode runs cleanup, calling `controller.abort` on that first controller.
3. Strict Mode executes the Effect again, creating a second controller and dispatching a fresh request.
4. The first aborted request rejects with an `AbortError`. Because the catch handler treats all errors equally, it stores that `AbortError` into state.
5. Even though the second request succeeds, the component checks error state first and displays the failure banner.

An `AbortError` is not an application failure. It is the expected result of intentional cleanup. Therefore, the catch block must inspect the error name and ignore cancellations:

```jsx title="Filtering out AbortError in the catch block"
.catch(err => {
  if (~err.name === 'AbortError'~) return; // Ignores intentional cancellations without setting error state
  setError(err); // Preserves genuine network failures
});
```

### The final Bio component

Here is the complete profile component using `AbortController`:

```jsx title="src/components/Bio.jsx" startLine="7" good="8,12,19,20,23"
  useEffect(() => {
    const ~controller~ = new AbortController(); // Creates a dedicated controller for this Effect run
    setBio(null);
    setError(null);
    fetch('/api/bio/' + person, { ~signal: controller.signal~ }) // Links the network request to the controller
      .then(response => {
        if (!response.ok) {
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => setBio(data.bio))
      .catch(err => {
        if (err.name === 'AbortError') return; // Silently ignores intentional aborts
        setError(err);
      });
    return () => ~controller.abort()~; // Aborts the active fetch when person changes or the component unmounts
  }, [person]);
```

Every Effect run instantiates its own controller because an `AbortSignal` can only trigger once. When the user switches from Bob to Taylor, Bob's request aborts cleanly, the rejection is ignored, and Taylor's bio renders without delay.

```page width=text caption="The finished team page after the user clicks Bob and then Taylor: Bob's request was stopped, and the line shows Taylor's bio."
line: [Alice] [Bob] [Taylor]
heading: Taylor
line: This is Taylor’s bio. | good
console: quiet
```

> [!PRINCIPLE]
> **Principle 4: Aborting: Socket-Level Cancellation: AbortController Stops Wasted Bandwidth**
>
> *To avoid wasting bandwidth on stale requests, cleanup routines call `controller.abort`. Because canceled requests reject with an `AbortError`, error handlers must filter out that error name.*
>
> Passing an abort signal allows the browser to close outgoing network connections immediately during cleanup. Because intentional aborts reject the `fetch` promise, the catch callback must verify that the error name is not `AbortError` before writing to error state.
>
> **DO THIS:**
> ```jsx
> const controller = new AbortController();
> fetch('/api/bio/' + person, { signal: controller.signal })
>   .then(response => response.json())
>   .then(data => setBio(data.bio))
>   .catch(err => { ~if (err.name === 'AbortError') return;~ setError(err); }); // Filters out expected aborts
> return () => controller.abort();
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const controller = new AbortController();
> fetch('/api/bio/' + person, { signal: controller.signal })
>   .then(response => response.json())
>   .then(data => setBio(data.bio))
>   ~.catch(err => setError(err));~ // **WRONG:** displays error banners whenever requests are canceled
> return () => controller.abort();
> ```

---

## Putting All Four Principles Together

### The complete team page project

Here are the three completed files of our team directory. The entry point mounts the application within Strict Mode:

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

The parent component manages the selected teammate:

```jsx title="src/App.jsx"
import { useState } from 'react';
import Bio from './components/Bio.jsx';

export default function App() {
  const [person, setPerson] = useState('Alice');

  return (
    <main>
      <button onClick={() => setPerson('Alice')}>Alice</button>
      <button onClick={() => setPerson('Bob')}>Bob</button>
      <button onClick={() => setPerson('Taylor')}>Taylor</button>
      <h2>{person}</h2>
      ~<Bio person={person} />~ {/* Principle 1: passing person ensures updates trigger new fetches */}
    </main>
  );
}
```

The profile component coordinates fetching, status validation, race condition prevention, and request cancellation:

```jsx title="src/components/Bio.jsx"
import { useState, useEffect } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setBio(null);
    setError(null);
    ~fetch~('/api/bio/' + person, { signal: controller.signal }) // Principle 1: starts request inside Effect
      .then(response => {
        if (~!response.ok~) { // Principle 2: throws on HTTP failure codes
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => setBio(data.bio))
      .catch(err => {
        if (~err.name === 'AbortError'~) return; // Principle 4: ignores intentional cancellations
        setError(err);
      });
    return () => ~controller.abort()~; // Principles 3 and 4: cancels in-flight fetches on cleanup
  }, ~[person]~); // Principle 1: dependencies track active person prop

  if (error) {
    return <p>Could not load the bio.</p>;
  }
  return <p>{bio ?? 'Loading...'}</p>;
}
```

The resulting UI responds predictably under rapid navigation:

```page width=text caption="The finished team page after the user clicks Bob and then Taylor: Taylor's name and Taylor's bio."
line: [Alice] [Bob] [Taylor]
heading: Taylor
line: This is Taylor’s bio. | good
console: quiet
```

### How React calls the components and runs the Effect

When the user selects Taylor, React executes render, commit, cleanup, setup, and resolution in a strict sequence:

```tree dir=right caption="The order of events from the click on Taylor to Taylor's bio on the page."
From the click on Taylor to Taylor's bio
- +1. Render [`App` `Bio`] | React calls `App`, then `Bio`, with `person` set to Taylor | `Bio` **hands React the new setup**
- +2. Commit [`<h2>Taylor</h2>`] | React puts **Taylor's name** into the DOM | The line still shows the old text
- +3. Cleanup [`controller.abort`] | React runs **the Bob run's cleanup** | Bob's request **stops**
- +4. Setup [`fetch`] | React runs **the Taylor run's setup** | The line shows **`Loading...`**; the request goes out
- +5. Answer [`setBio`] | Taylor's bio **arrives** | React renders the line with **Taylor's bio**
```

| What the Effect does | What the user sees | Why |
| :--- | :--- | :--- |
| **Fetches with empty array `[]`** | Display stays stuck on Alice after clicking Bob | The Effect runs only during mount |
| **Omits `response.ok` check** | `Loading...` indefinitely when the server fails | `fetch` resolves on HTTP 500, yielding undefined data |
| **Omits cleanup logic** | Bob's bio shown under Taylor's name after rapid clicks | Bob's slower response resolves last and overwrites state |
| **Uses an `ignore` flag** | Taylor's bio correctly shown | Bob's response arrives later and is safely discarded |
| **Aborts without error filtering** | False error screen appears | The `AbortError` from cleanup reaches error state |
| **Aborts with error filtering** | Taylor's bio correctly shown | Outgoing requests cancel immediately, and abort errors are ignored |

---

## For the Interview

> **The Interview Question:** How do you fetch data from an API in a client component, and how do you handle loading, error, and race conditions?

### How to Answer Clearly in 30 Seconds

"I call `fetch` inside `useEffect` and list the dynamic variables it reads, such as `person`, in its dependency array. Because network data arrives asynchronously, the component manages three distinct states: loading, error, and content.
1. **Loading**: I initialize state to `null` and render a fallback message whenever data is missing, resetting state to `null` whenever dependencies change.
2. **Errors**: `fetch` only rejects on network disconnection, not on HTTP 500 or 404 codes. I check `response.ok`, throw on false values, and store the resulting error in state inside the catch block.
3. **Race conditions**: Network responses can arrive out of order. In the cleanup function, I either set an `ignore` flag to discard stale payloads or call `controller.abort` on an `AbortController`. When aborting, I verify that the catch handler ignores `AbortError` so intentional cancellations do not display error screens."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does my page send every request twice in development?"**
   Strict Mode deliberately mounts, unmounts, and remounts components in development to verify that cleanup routines function properly. With cleanup logic in place, the first request is either ignored or canceled, preventing state pollution. In production builds, React runs the Effect setup only once.

2. **"What happened to the warning about setting state on an unmounted component?"**
   React 18 removed that warning. The React team noted that setting state after unmount does not cause genuine memory leaks. Developers often wrote cumbersome workarounds to silence the old warning. However, cleanup remains necessary to prevent race conditions from overwriting active state and to cancel unnecessary network traffic.

3. **"Would you fetch in useEffect in a production app?"**
   For production applications, raw fetching inside Effects is discouraged because it leads to network waterfalls, lacks automatic caching, and does not execute during server-side rendering. Modern architectures use React Server Components, the React 19 `use` hook with Suspense, or dedicated client libraries like TanStack Query. Raw Effects remain valuable for lightweight synchronization or custom hooks.

```tree dir=right caption="Interview comparison: what each part of a fetch Effect protects the user from."
What each part of a fetch Effect protects
- +The array [`[person]`] | A new prop brings **a new request** | The page never keeps **the old person's data**
- +The loading and error states [`response.ok` `.catch`] | The page always shows **one answer**: loading, error, or data | The user never waits for **a bio that will not come**
- +The cleanup [`ignore` `abort`] | Every answer except **the last one requested** is dropped or stopped | The page never shows **the wrong person's data**
```
