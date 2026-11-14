# Lecture 33: Fetching Data in an Effect, with Loading, Errors, and Race Conditions

*(How does a component load data from a server, and always show the right answer?)*

> INTERVIEW QUESTION | ❱ CORE | How do you fetch data from an API in a client component, and how do you handle loading, error, and race conditions?

---

## VS | The Order of the Clicks vs. the Order of the Answers: the last click does not always get the last answer

> When an Effect fetches data from a server, the user often moves on before the answer arrives: opening another profile, typing another search word, or switching tabs. **You should write a cleanup function.** This marks the old request as ignored, so a late answer from an old click cannot replace the newer one on the screen.

Why does the order of network responses matter? When a browser requests data across the internet, network operations are asynchronous and independent. Each request travels along its own path, and the backend processes each query at its own speed. A small query might finish in two hundred milliseconds, while a heavy database lookup takes two full seconds. Sending a request first does not guarantee its response arrives first.

Now picture a team directory with a list of teammate names and a biography paragraph below them. You click Bob, and a moment later you click Taylor. Let us follow what React does on each click, step by step:

> click on a name → handler calls `setPerson` → component renders again → React sees a new `person` → cleanup of the old Effect → new Effect sends a request

Two network requests are now traveling across the web at the same time, one for Bob and one for Taylor. Starting the request for Taylor does not automatically cancel the earlier request for Bob. When each response eventually arrives, its callback calls `setBio` with its own data. If the server takes longer to answer for Bob, Bob's response arrives last, so Bob's state setter executes last:

> Taylor's answer arrives → the page shows Taylor's bio → Bob's answer arrives → the page shows Bob's bio under Taylor's name

You selected Taylor, yet the screen displays the biography of Bob.

**Therefore, every time you fetch data in an Effect, you must provide a cleanup function that marks the old request as ignored or cancels it.** React executes that cleanup before it runs the Effect for Taylor. When Bob's late response finally arrives, the component drops it, and stale data can no longer overwrite the screen.

### Fetch in Plain JavaScript

In plain JavaScript, you ask a server for data with `fetch`, a standard function provided by the browser runtime. Then you insert the received text directly into the page:

```js title="Plain JavaScript: ask the server for Alice's bio and put it on the page"
~fetch('/api/bio/Alice')~ // Sends the request, and returns a promise at once
  .then(response => ~response.json()~) // When the server answers: reads the JSON
  .then(data => {
    document.getElementById('bio').textContent = data.bio; // Writes the bio into the paragraph
  });
```

Notice what `fetch` returns immediately. It does not return the biography data. The data has not arrived yet because the server has not responded over the network. Instead, `fetch` returns a Promise object right away.

> [!DEFINITION]
> **What is a promise?** [NEW] A promise is a JavaScript object that represents a value arriving in the future from an asynchronous operation.
> 1. Calling `fetch` returns a pending promise immediately, before the server has responded over the network.
> 2. You pass a callback function to `.then`. When the server sends back HTTP headers, JavaScript executes that callback with a `Response` object.
> 3. Calling `response.json()` reads the response stream and parses its JSON text into a JavaScript object. Reading this stream takes time, so `response.json()` returns a second promise.
> 4. If the network drops or parsing fails, the promise chain rejects, skipping `.then` handlers and executing the callback passed to `.catch` (Lesson 33).

The server delivers its answer formatted as JSON text, containing fields such as a `bio` property. The property name `bio` inside `data.bio` comes directly from the server payload, not from our React code.

### Where does fetch go in React?

In React, components never mutate the DOM directly with `textContent`. Instead, you store the incoming data in state with `setBio(data.bio)`, and React re-renders the user interface to show the new value.

The real question is where the network request belongs. A component provides three distinct places for code (Lesson 32):
1. **The component body.** It executes on every render, and its job is strictly to calculate JSX (Lesson 14). Placing `fetch` in the body triggers a network request on every single render. When the response arrives and updates state, the component re-renders, triggering another request in an infinite loop.
2. **An event handler.** It runs when the user performs an explicit action, such as clicking a button (Lesson 11). While some fetches follow a click, data for a profile or article must often load automatically when the component appears, without waiting for user input.
3. **An Effect.** It runs after React commits the component to the screen. This is the designated home for keeping component state synchronized with an external system like a backend server.

The official React documentation makes the same point for a search page: "While this component is visible, you want to keep `results` synchronized with data from the network."

```jsx title="React: ask for the bio of person, after Bio is on the screen"
useEffect(() => {
  ~fetch('/api/bio/' + person)~ // Runs after Bio is on the screen, and again when person changes
    .then(response => response.json())
    .then(data => ~setBio(data.bio)~); // The bio arrives later, and React renders again
}, [person]);
```

> [!DEFINITION]
> **An Effect and its cleanup.** [REVIEW] An Effect is code that React executes because the component is displayed on the screen, not in direct response to a user click.
> 1. You declare an Effect using `useEffect(setup, dependencies)`. React runs the setup function after painting the component to the screen.
> 2. React re-runs the Effect whenever any value listed in the dependency array changes across renders.
> 3. The setup function can return a cleanup function. React executes this cleanup before running the Effect again, and when the component unmounts from the page.
> 4. A timer setup cleans up with `clearInterval`. A network request setup cleans up by either ignoring the arriving answer or canceling the ongoing request (Lesson 32).

### Some time later: the two problems

Between dispatching the request and receiving the response, time passes. That network latency introduces two distinct problems:
1. **The interface needs feedback during the wait.** React paints the page before the data arrives from the backend. The component must display a loading indicator while waiting, and an error message if the server fails.
2. **Responses do not always arrive in the order requests were sent.** As the official React documentation warns: "network responses may arrive in a different order than you sent them."

The second problem is especially dangerous. Here is how it plays out in a team directory:

```tree dir=right caption="The user clicks Bob, then Taylor, and the two answers come back in the other order."
Two clicks, two answers, in the wrong order
- +1. Click Bob | The request for Bob goes out | The server needs **two seconds**
- +2. Click Taylor | The request for Taylor goes out | The server needs **a fifth of a second**
- +3. Taylor's answer | Arrives **first** | The page shows **Taylor's bio**
- !4. Bob's answer | Arrives **last** | The page shows **Bob's bio under Taylor's name**
```

The screen now displays Taylor's heading with Bob's biography underneath it. No error is thrown, and the browser Console remains completely quiet.

This issue is tricky to catch because on a fast development machine with zero network latency, local requests return in order. The developer never observes the defect during local testing. A user on a fluctuating mobile network encounters it frequently.

### The Rule of Thumb: every fetch Effect needs three things

**A loading indicator for the wait, an error state for a failed server, and a cleanup function that drops or cancels the old answer.**

A senior engineer also watches for four classic mistakes:
1. **Assuming the last click receives the last response.** The network delivers answers in its own timing.
2. **Leaving out the cleanup function.** Without cleanup, nothing prevents a stale response from overwriting fresh data.
3. **Expecting `fetch` to reject when the server returns an error.** The `fetch` promise succeeds whenever the server responds, even with an error status.
4. **Treating an aborted request as a real error.** When your own cleanup cancels a request, the cancellation is intentional and should not show an error state to the user.

The rest of the lesson examines each pitfall on a live page.

## SECTION | A Team Page with Three Names

Our page provides three buttons: Alice, Bob, and Taylor. Underneath sits the name of the selected teammate, followed by a paragraph displaying that person's biography. The page opens with Alice selected.

```page width=text caption="The team page when it opens: the paragraph under Alice's name shows Loading... and never changes."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: Loading...
console: quiet
```

Here is what the user does, and what each action must display:
1. The page opens. The paragraph displays `Loading...`, followed by Alice's biography.
2. The user clicks Bob. The paragraph displays `Loading...` for two seconds, followed by Bob's biography.
3. The user clicks Bob and immediately clicks Taylor. The page must settle on Taylor's biography.

The backend responds at an address such as the profile path for Alice. It returns within two hundred milliseconds for Alice and Taylor, but takes two seconds for Bob.

The top-level component `App` stores `person` in state and passes it downward:

```jsx title="src/App.jsx"
import { useState } from 'react';
import Bio from './components/Bio.jsx';

export default function App() {
  const [person, setPerson] = useState('Alice');

  return (
    <main>
      <button ~onClick={() => setPerson('Alice')}~>Alice</button> {/* Each click sets person */}
      <button onClick={() => setPerson('Bob')}>Bob</button>
      <button onClick={() => setPerson('Taylor')}>Taylor</button>
      <h2>{person}</h2>
      ~<Bio person={person} />~ {/* Bio must show the bio of this person */}
    </main>
  );
}
```

At the beginning, `Bio` only provides a placeholder for the text:

```jsx title="src/components/Bio.jsx"
import { useState } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);

  return <p>{~bio ?? 'Loading...'~}</p>; // bio is null, so the paragraph shows Loading...
}
```

The state variable `bio` starts as `null` because no biography has arrived yet. The `??` operator yields the fallback on its right when the value on its left is `null` or `undefined`. While the state remains `null`, the paragraph renders `Loading...`.

Ten seconds later, the screen still displays `Loading...`. No line in our component has asked the server for data yet.

The application entry file mounts `App` inside `<StrictMode>` (Lesson 07). Here is the project structure:

```files title="team-page: File Explorer" caption="How the team page project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Keeps `person` in state, renders the three buttons, and passes `person` to `Bio`
  components/
    Bio.jsx | Effect | Keeps `bio` in state and asks the server for the bio of `person` in an Effect
```

**PRINCIPLES:** Network responses take time and arrive out of order. Four core principles guide our implementation:
1. **Principle 1: fetch Inside useEffect Loads the Bio of Each person.** The request lives inside an Effect with `person` in its dependency array, and the UI displays `Loading...` until data arrives.
2. **Principle 2: response.ok Turns a Server Error into the Error Line.** The `fetch` promise rejects only on complete network failure. When the server answers with an error status, our code must inspect `response.ok`.
3. **Principle 3: The ignore Variable Drops a Late Answer.** The cleanup function flags the old request, discarding its response when it arrives late.
4. **Principle 4: AbortController Stops the Old Request.** The cleanup function cancels the old network request directly. The canceled request rejects with an `AbortError`, which our catch handler ignores.

---

## PRINCIPLE | `fetch` in `useEffect`: every new `person` sends a new request

> [!PRINCIPLE]
> **Principle 1: fetch Inside useEffect Loads the Bio of Each person**
>
> *When a component must display server data matching its props, it calls fetch inside useEffect, lists those props in the dependency array, and updates state when the response arrives. While the state is still null, the JSX renders a loading indicator.*
>
> The request belongs in an Effect because the biography must stay synchronized with the person prop while Bio is on the screen, rather than waiting for an event handler click. The request address includes the person prop, so person belongs in the dependency array, sending a fresh request whenever the name changes. Resetting bio to null at the start of each run restores Loading... during the wait.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   setBio(null);
>   fetch('/api/bio/' + person)
>     .then(response => response.json())
>     .then(data => setBio(data.bio));
> }, ~[person]~); // A new request each time the user clicks a name
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   fetch('/api/bio/' + person)
>     .then(response => response.json())
>     .then(data => setBio(data.bio));
> }, ~[]~); // **WRONG:** runs only on mount, so the page keeps Alice's bio after a click on Bob
> ```

We place the network request inside `useEffect`, and the second `.then` callback stores the biography in state:

```jsx title="src/components/Bio.jsx" startLine="1"
import { useState, ~useEffect~ } from 'react'; // useEffect comes from react, as in Lesson 32

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);

  useEffect(() => {
    ~setBio(null);~ // Shows Loading... again while the new bio is on its way
    fetch('/api/bio/' + person)
      .then(response => response.json())
      .then(data => ~setBio(data.bio)~); // The bio arrives, and React renders the paragraph again
  }, ~[person]~); // The Effect reads person, so it runs again whenever person changes

  return <p>{bio ?? 'Loading...'}</p>;
}
```

Here is what happens, step by step:
1. React renders `Bio` with `person="Alice"`. Because state is `null`, the paragraph renders `Loading...`.
2. React commits the DOM to the screen and executes the Effect. The browser sends the request for Alice.
3. Two hundred milliseconds later, the server answers, and `setBio` updates state with Alice's biography.
4. React re-renders `Bio`, and the paragraph displays the biography.

```page width=text caption="The team page a moment after it opens: the Effect has loaded Alice's bio."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: This is Alice’s bio. | good
console: quiet
```

Then the user clicks Bob. The prop `person` changes to Bob, so React re-runs the Effect for Bob. For two seconds the paragraph shows `Loading...`, followed by Bob's biography:

```page width=text caption="The team page right after the user clicks Bob: Loading... for two seconds, while the server answers."
line: [Alice] [Bob] [Taylor]
heading: Bob
line: Loading...
console: quiet
```

This `Loading...` text represents the loading state: what the component displays before network data arrives. It requires no extra state variable. While waiting, `bio` evaluates to `null`, and our JSX already handles that fallback.

Why does the setup call `setBio(null)` at the very beginning? Without that line, Alice's biography would remain visible under Bob's name for the two seconds Bob's request takes to finish. Clearing state immediately restores the loading indicator while the new data travels across the network.

### VS | `[person]` vs. `[]`: both load Alice, only `[person]` loads Bob

The dependency array determines whether selecting a new teammate fetches a new biography:

```jsx title="The same Effect with [person] and with []"
useEffect(() => { /* fetch the bio of person */ }, ~[person]~); // Runs again after each click on a name
useEffect(() => { /* fetch the bio of person */ }, ~[]~); // **WRONG:** runs only on mount, so the page keeps Alice's bio
```

Both options load Alice's biography when the page initially opens. With an empty dependency array `[]`, React executes the Effect only when the component mounts. When the user clicks Bob, the heading updates to Bob, but the paragraph continues displaying Alice's biography. The React linter flags `person` as a missing dependency (Lesson 32).

### Two requests in development

Open the Network panel of your browser developer tools. It records every network request the page dispatches. In development mode, you will notice two requests for Alice when the page first loads.

This behavior comes from Strict Mode (Lesson 32). On initial mount, React executes the setup function, runs the cleanup function, and then runs the setup function a second time. Each setup call dispatches a request. The official documentation confirms: "In development, you will see two fetches in the Network tab. There is nothing wrong with that." And: "In production, there will only be one request."

Our Effect lacks a cleanup function right now. Both responses call `setBio` with identical data, so the page looks correct by coincidence. Principle 3 adds the cleanup function that production code requires.

---

## PRINCIPLE | `response.ok`: a server error shows the error line, not `Loading...` forever

> [!PRINCIPLE]
> **Principle 2: response.ok Turns a Server Error into the Error Line**
>
> *The fetch promise fails only when the network request cannot reach the server at all. When the server responds with an error status such as 500, the promise resolves successfully. The code must inspect response.ok, throw an error when it is false, and render an error line from .catch.*
>
> Without checking response.ok, an error response continues to response.json, the data field evaluates to undefined, and the page stays on Loading... indefinitely. Checking response.ok throws an error into .catch, allowing the component to store it in state and present an error message to the user. Clearing the error before each new request ensures that a past failure does not linger on the screen.
>
> **DO THIS:**
> ```jsx
> fetch('/api/bio/' + person)
>   .then(response => {
>     if (~!response.ok~) throw new Error('Status ' + response.status); // The error goes to catch
>     return response.json();
>   })
>   .then(data => setBio(data.bio))
>   .catch(err => setError(err));
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> fetch('/api/bio/' + person)
>   .then(response => ~response.json()~) // **WRONG:** a status 500 answer is read as a bio, and the page says Loading... forever
>   .then(data => setBio(data.bio));
> ```

Servers occasionally crash. When an internal failure occurs on the backend, the server still sends an HTTP response, but it marks that response with an error status code.

> [!DEFINITION]
> **What is a status code?** [NEW] Every response from an HTTP server carries a numeric status code indicating what happened.
> 1. Status codes from `200` to `299` indicate success, such as `200 OK`.
> 2. Status `404` means the requested endpoint was not found, while status `500` means the server crashed internally.
> 3. In client code, the `response` object holds this number in `response.status`.
> 4. The property `response.ok` is a boolean that evaluates to `true` for status codes from 200 through 299, and `false` for any other code.
> 5. The native `fetch` API never checks this status for you; its promise resolves successfully even for an HTTP `500` response (Lesson 33).

### VS | A Lost Network vs. a Broken Server: for the user both mean no bio, for `fetch` only one is a failure

The MDN web documentation states this rule directly. The promise returned by `fetch` rejects only when the browser cannot complete the network transaction, such as when the URL is invalid or the internet connection drops. It does not reject when the server answers with an error status like `404` or `500`.

From the user's perspective, a broken server and a dropped connection mean the same thing: no biography appears. For `fetch`, they follow two completely different paths:
1. **A dropped network connection.** No response arrives, so the `fetch` promise rejects directly into `.catch`.
2. **A broken server.** An HTTP response arrives successfully, so the `fetch` promise resolves, and the error code sits inside `response.status`.

### The server fails, and the page says Loading... forever

Suppose the server crashes while the user views Alice. It answers with status `500` and the JSON body `{ "message": "Server error" }`. Without an explicit status check, our code behaves like this:
1. The setup calls `setBio(null)`, causing the paragraph to display `Loading...`.
2. The server responds with status `500`.
3. The `fetch` promise resolves successfully because an HTTP answer was received.
4. Calling `response.json()` parses the error object. That object contains no `bio` property, so `data.bio` evaluates to `undefined`.
5. The setter `setBio(undefined)` stores `undefined` in state. The nullish coalescing operator treats `undefined` identically to `null`, so the paragraph remains stuck on `Loading...`.

```page width=text caption="The team page when the server answers with status 500 and the code has no check: Loading... with no end."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: Loading... | bad
console: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
console: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

The user waits for content that will never arrive, and the interface provides no explanation. The only indicator appears in the browser Console, where the browser logs the 500 status for each request sent in development. Our component code never inspected that status.

### The fix: check response.ok and throw

When `response.ok` is `false`, we explicitly turn the response into an error using `throw`. This skips any subsequent `.then` handlers and executes the callback in `.catch` with the error object.

The text inside the error, such as `Status 500`, helps developers debugging the application. The user sees a clear error message. We store the error in a dedicated state variable, `error`, and check it first in our JSX:

```jsx title="src/components/Bio.jsx" startLine="3" good="10,11,12,17"
export default function Bio({ person }) {
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBio(null);
    ~setError(null);~ // Clears an old error before each new request
    fetch('/api/bio/' + person)
      .then(response => {
        if (~!response.ok~) { // Status 500: the server answered with an error
          throw new Error('Status ' + response.status); // Skips the next then and goes to catch
        }
        return response.json();
      })
      .then(data => setBio(data.bio))
      ~.catch(err => setError(err));~ // Keeps the error, and React shows the error line
  }, [person]);

  if (error) {
    return <p>Could not load the bio.</p>;
  }
  return <p>{bio ?? 'Loading...'}</p>;
}
```

Now the same crashed server provides immediate feedback on the screen:

```page width=text caption="The team page when the server answers with status 500 and the code checks response.ok: the error line."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: Could not load the bio. | good
console: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
console: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

The browser still prints its message in the Console because the server returned status `500`. The difference is on the screen: the user now clearly sees that the biography could not be loaded.

The same `.catch` handler also catches network drops, because when the connection fails, the `fetch` promise itself rejects. A single error state handles both scenarios.

### Why clearing the error at the top matters

Calling `setError(null)` at the beginning of the setup function is just as important as checking `response.ok`. Without that line, an error stays in state after the user selects a different teammate. Even if the new biography loads successfully, the JSX checks `error` first. The screen continues displaying `Could not load the bio.` under a teammate whose data arrived without issue.

The paragraph now supports three distinct states:
1. **The loading state.** The state is `null`, and the paragraph displays `Loading...`.
2. **The error state.** The state `error` holds an Error object, and the paragraph displays the error message.
3. **The data state.** The state `bio` holds the biography text, and the paragraph displays it.

Each new request resets to the loading state, clearing any previous data and errors.

---

## PRINCIPLE | The `ignore` variable: a late answer for an old request never reaches the screen

> [!PRINCIPLE]
> **Principle 3: The ignore Variable Drops a Late Answer**
>
> *When the user selects a new teammate before the previous request finishes, the older response can arrive last and overwrite the newer biography. The cleanup function sets an ignore flag to true, and each Effect execution updates state only while its own ignore flag remains false.*
>
> The network delivers responses in its own order, not in the sequence of user clicks. Each run of the Effect setup maintains its own ignore flag, and React executes the cleanup of the previous Effect before starting the new setup. This ensures every response except the one matching the current request is safely dropped. Because this defect produces no error in the Console, the cleanup belongs in every data-fetching Effect.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   let ignore = false;
>   fetch('/api/bio/' + person)
>     .then(response => response.json())
>     .then(data => { ~if (!ignore)~ setBio(data.bio); }); // Only the current request sets the bio
>   return () => { ignore = true; };
> }, [person]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   fetch('/api/bio/' + person)
>     .then(response => response.json())
>     .then(data => ~setBio(data.bio)~); // **WRONG:** Bob's late answer replaces Taylor's bio
> }, [person]);
> ```

Take the code from Principle 2, which has no cleanup. The user clicks Bob, and half a second later clicks Taylor:
1. The user clicks Bob. The Effect dispatches the request for Bob, which takes two seconds. The paragraph displays `Loading...`.
2. The user clicks Taylor. The Effect dispatches the request for Taylor, which takes two hundred milliseconds.
3. Taylor's response arrives first. The setter `setBio` updates state with Taylor's biography.
4. Bob's response arrives more than a second later. Its `.then` callback still executes because nothing signaled that the user moved on. Its setter `setBio` puts Bob's biography into state.

```page width=text caption="The team page three seconds after the user clicks Bob and then Taylor, with no cleanup: Bob's bio under Taylor's name."
line: [Alice] [Bob] [Taylor]
heading: Taylor
line: This is Bob’s bio. | bad
console: quiet
```

> [!DEFINITION]
> **What is a race condition?** [NEW] A race condition is a software defect where the final outcome depends unpredictably on which of two concurrent operations finishes first.
> 1. In this scenario, two asynchronous requests race against each other across the network.
> 2. The request for Bob started first, but because its response took longer, it arrived last and overwrote Taylor's data.
> 3. The official React documentation explains: "two different requests 'raced' against each other and came in a different order than you expected."
> 4. This bug produces no error messages, leaving the browser Console quiet. On high-speed local networks, responses arrive in order, hiding the defect during development (Lesson 33).

### The ignore variable

The solution relies on the Effect cleanup function (Lesson 32). In plain words: when the user selects a new teammate, the previous request becomes obsolete. Its response may still return across the network, but our component must not apply it to state.

Each execution of the Effect setup creates its own local boolean variable, `ignore`, initialized to `false`. The cleanup function returned by that same execution flips `ignore` to `true`. When the response arrives, the callback updates state only if `ignore` remains `false`.

The official documentation demonstrates this technique with a custom helper function named `fetchBio`, which returns a promise for the biography:

```jsx title="The docs' ignore variable, with their fetchBio function"
useEffect(() => {
  ~let ignore = false;~ // This run's own variable
  fetchBio(person).then(result => {
    if (~!ignore~) { // Only while this run is still the current one
      setBio(result);
    }
  });
  return () => {
    ~ignore = true;~ // The cleanup marks this run's answer as one to drop
  };
}, [person]);
```

The documentation notes: "Note the `ignore` variable which is initialized to `false`, and is set to `true` during cleanup."

How does the cleanup function target the correct `ignore` variable? Every time React runs the Effect setup, it invokes the setup function anew. This creates a fresh local scope containing a brand-new `let ignore = false` variable. The cleanup function is created within that same execution context, forming a closure over that specific run's `ignore` variable. This closure mechanism is identical to how the cleanup function in Lesson 32 remembered its specific timer identifier.

### The ignore variable in Bio

In `Bio`, the check guards both state setters, ensuring that an outdated error is dropped as well:

```jsx title="src/components/Bio.jsx" startLine="7" good="8,18,19,21"
  useEffect(() => {
    ~let ignore = false;~ // Each run of the setup gets its own variable
    setBio(null);
    setError(null);
    fetch('/api/bio/' + person)
      .then(response => {
        if (!response.ok) {
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => { if (!ignore) setBio(data.bio); }) // Only the current request sets the bio
      .catch(err => { if (!ignore) setError(err); }); // Only the current request sets the error
    return () => {
      ~ignore = true;~ // Runs when person changes: the old answer will be dropped
    };
  }, [person]);
```

Here are the same two clicks with the cleanup function active:
1. The user clicks Bob. The Bob run sends the request for Bob with its own `ignore` flag set to `false`.
2. The user clicks Taylor. Before running the new setup, React executes the cleanup function from the Bob run. The Bob run's `ignore` flag becomes `true`. Then the Taylor run starts and sends its request for Taylor with its own `ignore` flag set to `false`.
3. Taylor's response arrives. The Taylor run has its ignore flag set to `false`, so `setBio` renders Taylor's biography.
4. Bob's response arrives later. The Bob run has its ignore flag set to `true`, so `setBio` is skipped.

```page width=text caption="The team page three seconds after the user clicks Bob and then Taylor, with the ignore variable: Taylor's bio under Taylor's name."
line: [Alice] [Bob] [Taylor]
heading: Taylor
line: This is Taylor’s bio. | good
console: quiet
```

The documentation explains this guarantee: "cleanup ensures that the `'Alice'` response is ignored even if it arrives after `'Bob'`."

Notice an important nuance: when a user clicks one button and waits for the data to arrive, the code with cleanup and the code without cleanup behave identically. They differ only when the user triggers a second request before the first one completes. This is why casual manual testing easily overlooks race conditions.

### The two requests in development, explained

This `ignore` pattern also clarifies the documentation remark from Principle 1. On initial mount, Strict Mode executes the setup, the cleanup, and the setup again. The cleanup flips the first run's `ignore` flag to `true`. While the first request still travels over the network, its response is discarded when it returns.

The documentation confirms: "even though there is an extra request, it won't affect the state". The check on `ignore` safely drops the result.

### What ignore does not do

The `ignore` variable pattern works with any JavaScript promise, not just native `fetch`. The documentation's `fetchBio` function is an example of an arbitrary asynchronous function.

However, observe what happens to Bob's network request. It continues running across the wire to completion. The backend processes the query, and the browser downloads and parses Bob's biography, only for our frontend code to discard the result. Principle 4 shows how to cancel the underlying network request itself.

---

## PRINCIPLE | `AbortController`: the cleanup stops the old request, and `.catch` skips the `AbortError`

> [!PRINCIPLE]
> **Principle 4: AbortController Stops the Old Request**
>
> *When fetching data with the native fetch API, the cleanup function can cancel the previous request using an AbortController. The setup creates an AbortController instance, passes its signal to fetch, and the cleanup calls controller.abort(). Because canceling a request causes fetch to reject with an AbortError, the .catch handler must explicitly ignore this cancellation so it does not display an error message.*
>
> The ignore variable allows an outdated request to finish and discards its response. In contrast, calling controller.abort() cancels the network request immediately, stopping the browser from waiting for unused data. Canceling the request makes the fetch promise reject with an AbortError, so .catch must check err.name and show the error state only for genuine network failures.
>
> **DO THIS:**
> ```jsx
> const controller = new AbortController();
> fetch('/api/bio/' + person, { signal: controller.signal })
>   .then(response => response.json())
>   .then(data => setBio(data.bio))
>   .catch(err => { ~if (err.name === 'AbortError') return;~ setError(err); }); // Skips our own stop
> return () => controller.abort();
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const controller = new AbortController();
> fetch('/api/bio/' + person, { signal: controller.signal })
>   .then(response => response.json())
>   .then(data => setBio(data.bio))
>   ~.catch(err => setError(err));~ // **WRONG:** our own stop shows the error line on a page that works
> return () => controller.abort();
> ```

The browser provides a built-in tool to cancel a `fetch` request before it completes: `AbortController`. It operates in three steps:

```jsx title="Stopping a request with AbortController"
const controller = ~new AbortController()~; // 1. Creates the controller
fetch('/api/bio/Bob', { ~signal: controller.signal~ }); // 2. Gives fetch the controller's signal
~controller.abort();~ // 3. Stops the request
```

> [!DEFINITION]
> **What is an AbortController?** [NEW] An `AbortController` is a browser utility object used to cancel one or more web requests when needed.
> 1. The property `controller.signal` provides an `AbortSignal` object that you pass to `fetch` in its options: `{ signal: controller.signal }`.
> 2. When your code calls `controller.abort()`, the browser cancels the HTTP request immediately, and the `fetch` promise rejects.
> 3. The promise rejects with a `DOMException` error whose `name` property is `'AbortError'`.
> 4. An abort signal can be triggered only once. Therefore, each run of an Effect setup must instantiate its own controller (Lesson 33).

### VS | `ignore = true` vs. `controller.abort()`: both keep Taylor's bio, only `abort` stops Bob's request

Here are the two cleanup strategies side by side:

```jsx title="The cleanup with the ignore variable, and with abort on the controller"
return () => { ~ignore = true;~ }; // Bob's request runs to the end, and its answer is dropped
return () => ~controller.abort()~; // Bob's request is stopped, and no answer comes
```

When the user clicks Bob and then Taylor in quick succession, both cleanup strategies leave Taylor's biography on the screen. The difference is how they treat the network connection:
1. **With `ignore`,** the browser continues waiting for Bob's response and parses its JSON, after which client code discards it.
2. **With `abort`,** the browser cancels Bob's HTTP request the moment the user clicks Taylor.

The official documentation leaves the choice open, stating that cleanup "should either abort the fetch or ignore its result". Using `abort` saves bandwidth and processing power for requests the user no longer needs. Using `ignore` works for any asynchronous operation, even those without native cancellation support.

### The stop reaches .catch

Suppose a developer switches from the `ignore` variable to an `AbortController`, but keeps the error handler from Principle 2. In development mode, the page immediately displays an error line when it opens:

```page width=text caption="The team page when it opens in development, with abort in the cleanup and a catch that keeps every error: the error line."
line: [Alice] [Bob] [Taylor]
heading: Alice
line: Could not load the bio. | bad
console: quiet
```

**The server is running, the network is functional, yet the screen claims the biography could not be loaded.** Here is why:
1. React mounts `Bio` and runs the setup. It creates the first controller, sends the first request for Alice, and sets `error` to `null`.
2. Strict Mode immediately runs the cleanup. Calling `controller.abort()` cancels that first request.
3. Strict Mode runs the setup again. It creates a second controller, sends the second request for Alice, and sets `error` to `null`.
4. The first request's promise rejects with an `AbortError`. Its catch handler executes now, after the second setup has run, and passes the cancellation error to `setError`.
5. The second request succeeds and delivers Alice's biography, calling `setBio`. But because `error` is populated in state, the JSX evaluates the error condition first and renders the error message.

Why does step 4 run after step 3? A promise callback never interrupts synchronously running code. It waits in the microtask queue until the current execution context finishes. React executes the initial setup, cleanup, and second setup in one continuous synchronous pass. Therefore, the `.catch` callback for the aborted request can only run after all three steps complete.

The same defect appears in production whenever a user clicks Bob and then Taylor. The cleanup cancels Bob's request, its `AbortError` enters `.catch`, and the user sees an error message displayed under Taylor's name.

An `AbortError` is not an application failure. It is our own cleanup function doing its job. Therefore, the `.catch` handler must inspect the error name and ignore cancellations:

```jsx title="Skipping the AbortError in catch"
.catch(err => {
  if (~err.name === 'AbortError'~) return; // Our own cleanup stopped this request: nothing to show
  setError(err); // A real error: show the error line
});
```

### The final Bio

Here is the Effect inside `Bio` with an abort controller in place of the ignore flag:

```jsx title="src/components/Bio.jsx" startLine="7" good="8,11,20,23"
  useEffect(() => {
    const ~controller~ = new AbortController(); // A new controller for each run of the setup
    setBio(null);
    setError(null);
    fetch('/api/bio/' + person, { ~signal: controller.signal~ }) // fetch listens to this run's controller
      .then(response => {
        if (!response.ok) {
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => setBio(data.bio))
      .catch(err => {
        if (err.name === 'AbortError') return; // Skips the request our cleanup stopped
        setError(err);
      });
    return () => ~controller.abort()~; // Stops this run's request when person changes or Bio unmounts
  }, [person]);
```

The setup creates a fresh controller on every run because an abort signal can be used only once. The cleanup accesses the controller from its own execution context, canceling only that run's request.

Now the page opens on Alice's biography, even in development mode under Strict Mode. When the user clicks Bob and then Taylor, the cleanup cancels Bob's request, its `AbortError` is skipped, and the page settles on Taylor's biography:

```page width=text caption="The finished team page after the user clicks Bob and then Taylor: Bob's request was stopped, and the paragraph shows Taylor's bio."
line: [Alice] [Bob] [Taylor]
heading: Taylor
line: This is Taylor’s bio. | good
console: quiet
```

The cleanup also executes when `Bio` leaves the screen, as taught in Lesson 32. If the user navigates away from the team directory while a biography is still loading, the cleanup cancels that ongoing request immediately.

---

## All 4 Principles Together

### The complete files

The entry file mounts `App` inside `<StrictMode>`:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* Setup, cleanup, setup in development: the cleanup must make it look like one setup */}
    <App />
  </StrictMode>
);
```

The parent `App` component stores the selected teammate and passes it to `Bio`:

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
      ~<Bio person={person} />~ {/* Principle 1: a new person brings a new request */}
    </main>
  );
}
```

The `Bio` component requests data from the backend, renders distinct UI states for loading and errors, and cancels stale requests during cleanup:

```jsx title="src/components/Bio.jsx"
import { useState, useEffect } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setBio(null);
    setError(null);
    ~fetch~('/api/bio/' + person, { signal: controller.signal }) // Principle 1: the request goes in an Effect
      .then(response => {
        if (~!response.ok~) { // Principle 2: a server error goes to catch
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => setBio(data.bio))
      .catch(err => {
        if (~err.name === 'AbortError'~) return; // Principle 4: our own stop is not an error
        setError(err);
      });
    return () => ~controller.abort()~; // Principles 3 and 4: the old request never sets state
  }, ~[person]~); // Principle 1: runs again whenever person changes

  if (error) {
    return <p>Could not load the bio.</p>;
  }
  return <p>{bio ?? 'Loading...'}</p>;
}
```

The user opens the page, clicks Bob, and clicks Taylor half a second later:

```page width=text caption="The finished team page after the user clicks Bob and then Taylor: Taylor's name and Taylor's bio."
line: [Alice] [Bob] [Taylor]
heading: Taylor
line: This is Taylor’s bio. | good
console: quiet
```

### How React calls the components and runs the Effect

When the user clicks Taylor, React calls `App`, then `Bio`, and commits the new name with the old biography still in state. Then React executes the cleanup function from the Bob run and starts the new setup for Taylor. The network response arrives last:

```tree dir=right caption="The order of events from the click on Taylor to Taylor's bio on the page."
From the click on Taylor to Taylor's bio
- +1. Render [`App` `Bio`] | React calls `App`, then `Bio`, with `person` set to Taylor | `Bio` **hands React the new setup**
- +2. Commit [`<h2>Taylor</h2>`] | React puts **Taylor's name** into the DOM | The paragraph still shows the old text
- +3. Cleanup [`controller.abort`] | React runs **the Bob run's cleanup** | Bob's request **stops**
- +4. Setup [`fetch`] | React runs **the Taylor run's setup** | The paragraph shows **`Loading...`**; the request goes out
- +5. Answer [`setBio`] | Taylor's bio **arrives** | React renders the paragraph with **Taylor's bio**
```

### What the Effect does, and what the user sees

| What the Effect does | What the user sees | Why |
| :--- | :--- | :--- |
| **Fetches with `[]`** | The paragraph keeps Alice's bio after a click on Bob | The Effect runs only on mount |
| **Fetches with `[person]` and no `response.ok` check** | `Loading...` forever when the server fails | `fetch` succeeds whenever the server answers, and the bio is `undefined` |
| **Checks `response.ok`, with no cleanup** | Bob's bio under Taylor's name after two quick clicks | Bob's late answer still calls `setBio` |
| **Uses the `ignore` variable** | Taylor's bio | Bob's answer arrives and is dropped |
| **Uses `controller.abort`, and `.catch` keeps every error** | The error line on a page that works | The `AbortError` of the stopped request reaches `setError` |
| **Uses `controller.abort` and skips the `AbortError`** | Taylor's bio | Bob's request is stopped, and only real errors show |

The fundamental rule of this lesson is: **The server responds after a delay, and not always in the order requested. Therefore, the user interface must display `Loading...` during the wait, an error message if the server fails, and only the response matching the most recent request.**

---

## For the Interview

> **The Interview Question:** How do you fetch data from an API in a client component, and how do you handle loading, error, and race conditions?

### How to Answer Clearly in 30 Seconds

"I call `fetch` inside `useEffect` because client data must stay synchronized with props and state while the component is visible on screen. I specify every prop or state variable read by the request in the dependency array, such as `[person]`. Because network data arrives asynchronously, the component manages three distinct states: loading, error, and data. Three rules ensure robust behavior:
1. **Loading state**: State begins at `null`, the JSX renders a loading indicator while state is `null`, and each new request resets state back to `null`.
2. **Error handling**: The `fetch` promise rejects only on complete network failure, not on HTTP error status codes. I verify `response.ok`, throw an Error when it is `false`, and capture it in state within `.catch`.
3. **Race condition prevention**: Network responses can arrive in a different order than requests were sent. The cleanup function either toggles an `ignore` boolean flag so late responses are discarded, or calls `abort` on an `AbortController` to cancel stale requests. When using `abort`, the `.catch` handler explicitly ignores `AbortError`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does my page send every request twice in development?"**
   In development, Strict Mode mounts the component, runs setup, runs cleanup, and runs setup again to verify that your Effect cleans up properly. Consequently, two network requests leave the browser. The official React documentation explains: "There is nothing wrong with that. In production, there will only be one request." With a proper cleanup function, the first request is either canceled or its response is ignored, so it never causes unexpected side effects on component state.

   The correct resolution is never to disable Strict Mode or block the second execution. The resolution is providing a proper cleanup function that makes the two executions seamless to the user.
2. **"What about the warning 'Can't perform a React state update on an unmounted component'?"**
   React 18 removed that warning entirely. The official upgrade guide explains that React originally warned about memory leaks when calling `setState` on unmounted components. In practice, setting state was often harmless, and developer workarounds made code worse. React 19 silently ignores state updates on unmounted components without logging warnings.

   However, cleanup remains essential. It prevents race conditions from overwriting active state with stale data, and using `AbortController` terminates unneeded network requests to conserve bandwidth.
3. **"Would you write fetch in an Effect in a real app?"**
   The official React documentation classifies writing `fetch` directly inside `useEffect` as a manual approach with three major limitations. First, Effects do not execute during server rendering, so initial HTML contains only loading states. Second, nested parent and child components fetching in separate Effects create slow network waterfalls. Third, manual Effects lack automated caching, refetching, and deduplication, meaning unmounting and remounting a component triggers unnecessary network traffic.

   Production applications typically use data fetching integrated into frameworks like Next.js or Remix, or client-side caching libraries like TanStack Query and SWR (Lesson 60). In smaller setups without a framework, fetching logic can be abstracted into reusable custom Hooks like `useData` (Lesson 39). React 19 also introduces the `use` API paired with Suspense (Lesson 71), alongside React Server Components (Lesson 101).

```tree dir=right caption="Interview comparison: what each part of a fetch Effect protects the user from."
What each part of a fetch Effect protects
- +The array [`[person]`] | A new prop brings **a new request** | The page never keeps **the old person's data**
- +The loading and error states [`response.ok` `.catch`] | The page always shows **one answer**: loading, error, or data | The user never waits for **a bio that will not come**
- +The cleanup [`ignore` `abort`] | Every answer except **the last one requested** is dropped or stopped | The page never shows **the wrong person's data**
```
