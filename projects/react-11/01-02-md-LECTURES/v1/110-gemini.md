# Lecture 110: How 'use server' Lets a Click in the Browser Run a Function on the Server

*(How does a button in the browser save something in a database that lives on the server?)*

> INTERVIEW QUESTION | ❱ CORE | What are Server Functions, and how does 'use server' create a callable endpoint?

---

## VS | `isValidEmail(email)` vs. `subscribe(email)`: both look like a function call, only the second one travels to the server

> In standard JavaScript, persisting data from a browser interaction requires two distinct pieces: an HTTP route on the server and a `fetch` request in the browser. **A Server Function allows you to define a single `async` function in a file marked with `'use server'`, which the browser imports and invokes directly**. The call resembles a local function call, but React transmits the arguments across the network and returns the server result as a promise.

Consider how an application saves data from the browser in traditional JavaScript. The database lives on the server, while the button lives in the browser on the user device. Because client-side code cannot connect directly to a remote database, you must author and maintain two separate pieces of code:

```js title="Plain JavaScript: a URL on the server, and a fetch in the browser"
app.post(~'/api/subscribe'~, async (req, res) => { /* save the email */ }); // On the server
await ~fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })~; // In the browser
```

With a Server Function, you write only the server-side function that persists the data. You place it in a module marked with `'use server'` at the top. The Client Component imports that function and calls it directly, exactly like any local utility:

```jsx title="React: one function, imported and called from the browser"
import { subscribe } from './actions'; // actions.js starts with 'use server'
const answer = await ~subscribe(email)~; // React sends the request to the server for you
```

You never configure an API route path manually. You never write manual `fetch` calls or handle JSON serialization. React and the framework construct the entire communication channel automatically behind that single call.

Keep this core principle in mind throughout this lesson:

**A Server Function call looks like a normal function call, but it is a network request.**

> [!DEFINITION]
> **Client Component.** [REVIEW] A Client Component is a component in a file marked with `'use client'` that executes in the browser.
> 1. The bundler includes the component implementation in the JavaScript bundle downloaded by the client.
> 2. It runs on the client device, enabling user interactivity through state and event listeners.
> 3. It can access browser APIs and use client Hooks such as `useState` (Lesson 106).

> [!DEFINITION]
> **Server Component.** [REVIEW] A Server Component is a component that renders exclusively on the server runtime.
> 1. A component is a Server Component by default whenever its source file contains no directive at the top.
> 2. It executes on the server during rendering, with direct access to databases and backend resources.
> 3. Its component code never downloads to the client browser, transmitting only rendered descriptions (Lesson 101).

> [!DEFINITION]
> **Serializable.** [REVIEW] A value is serializable when React can convert it into text, transmit it across the network, and reconstruct it accurately.
> 1. React serializes data into a standardized string format suitable for HTTP transmission.
> 2. The receiving environment parses the payload to recreate an equivalent data structure.
> 3. Primitive values like strings and numbers, along with plain objects and arrays, are serializable. DOM events, JSX nodes, and arbitrary functions cannot cross network boundaries (Lesson 107).

### Two Calls That Look the Same

Consider an ordinary client utility placed beside a Server Function call. The function `isValidEmail` evaluates an input string locally in the browser. The function `subscribe` is a Server Function that persists the email address to a database:

```jsx title="An ordinary function call vs. a Server Function call"
const ok = ~isValidEmail(email)~; // Runs right here, in the browser, at once
const answer = await ~subscribe(email)~; // Runs on the server; the answer comes back later
```

**The two calls look similar in code, but their execution models are completely different.** The function `isValidEmail` executes synchronously on the user device inside the browser engine. The function `subscribe` never executes on the client device. Calling `subscribe` performs three sequential operations:
1. React serializes the email argument and transmits it across the network to the server.
2. The concrete `subscribe` function executes on the server where the database resides.
3. The server serializes the return value, `'You are subscribed!'`, and returns it to the client promise.

> [!DEFINITION]
> **Server Function.** [NEW] A Server Function is an `async` function that executes on the server and can be invoked directly from client code.
> 1. The directive `'use server'` at the top of a module marks every exported function as a Server Function.
> 2. The compiler creates a server HTTP endpoint and injects a lightweight reference stub into the client bundle.
> 3. Client Components import and call the stub like a normal function, while React handles network serialization and execution automatically (Lesson 110).
>
> A Server Function handles asynchronous backend actions. It is a tool for server-side functions, never a directive for defining components.

Each approach comes with distinct architectural trade-offs:
- **Writing endpoints manually**, you retain granular control over URL paths, HTTP methods, and payload structures. The drawback is that you must author, maintain, and synchronize two separate codebases across client and server boundaries.
- **Using a Server Function**, you write a single function without declaring manual endpoints or serialization routines. Because the call abstracts an underlying network request, three strict rules apply:
  1. The function must be declared with `async`, because network round trips are always asynchronous.
  2. Every argument passed to the function, and every value it returns, must be serializable.
  3. The resulting endpoint is publicly exposed, meaning any client can call it with arbitrary arguments.

From the user perspective, the interaction remains seamless and fast. The email persists to the database, a confirmation message appears on the current page, and the browser never performs a full page reload.

### Where Readers Usually Go Wrong

Developers frequently stumble because a Server Function call resembles a local JavaScript call:
1. **They mistake `'use server'` for a component directive.** Placing `'use server'` at the top of a component file triggers a build error, because Server Components require no directive.
2. **They pass the function directly as an event handler.** Writing `onClick={subscribe}` causes React to pass the DOM synthetic event instead of the intended data. React cannot serialize event objects, causing the call to fail.
3. **They assume the call executes instantly.** Network latency delays the server response. Without an active pending state, the user interface remains unresponsive, prompting users to click multiple times.

### Three Ways to Change Data on the Server

When a browser interaction must modify backend records, developers select from three primary techniques:
1. **A custom API route with a manual `fetch` call** (Lesson 33). This fits architectures without Server Function support, or endpoints exposed to external third-party consumers.
2. **A Server Function called from an event handler inside `startTransition`.** This approach fits standalone buttons, custom controls, and operations whose responses populate local component state. This lesson focuses on this pattern.
3. **A Server Function passed directly to `<form action>`.** This technique fits standard HTML forms containing input fields and submit buttons (Lesson 112).

Our newsletter signup has one input field, so it could be built as a form. We call `subscribe` from an explicit click handler here so that every step of the network round trip remains visible. (Lesson 112) converts this exact pattern into a declarative form.

## SECTION | The Newsletter Signup Under a Blog Post

Open any blog post and scroll to the bottom. Under the article sits a newsletter signup: an email field and a `Subscribe` button. The user types `john@example.com` and clicks `Subscribe`. A moment later, a line under the button reads `You are subscribed!`:

```page caption="The bottom of the blog post, after the user typed an email and clicked Subscribe."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | john@example.com
  button: Subscribe
line: You are subscribed! | good
```

Behind that confirmation line, the server persisted the email address to backend storage. We construct this feature using four files:

```files title="blog: the newsletter signup" caption="The four files of the newsletter signup: a database stand-in, a file of Server Functions, one Client Component, and one Server Component."
src/
  db.js | stand-in | Simulates a database: `db.subscribers.add(email)` saves one email
  actions.js | Server Functions | Starts with `'use server'` and exports `subscribe`
  NewsletterSignup.jsx | Client Component | Starts with `'use client'`; holds the email field, the button, and the answer line
  App.jsx | Server Component | Renders the post and `<NewsletterSignup />`
```

The `db.js` file serves as a local mock (Lesson 107). It simulates database persistence in memory so the project runs without an external database server.

**PRINCIPLES:** A Server Function call resembles a standard local call, but it initiates a complete network round trip. Three core principles govern this architecture:
1. **The `'use server'` directive marks backend execution boundaries.** Functions exported from marked files execute exclusively on the server, while the client bundle receives only lightweight references.
2. **Parameters and return values must cross the network as serialized data.** Every argument is serialized before transmission. Passing raw DOM events or non-serializable objects breaks execution.
3. **Transitions provide pending feedback during network round trips.** Wrapping Server Function calls in `startTransition` tracks execution state through `isPending`, preventing repeated user submissions.

---

## PRINCIPLE | `'use server'`: every function the file exports runs only on the server, and the browser gets only a reference to it

> [!PRINCIPLE]
> **Principle 1: `'use server'` Turns `subscribe` into a Server Function**
>
> *Put `'use server'` at the top of a file of `async` functions; every export becomes a Server Function that a Client Component can import, and the browser gets a reference to it, not its code.*
>
> A Client Component often needs to mutate server data, such as saving an email address to a database. Placing `'use server'` at the top of a file generates two complementary artifacts: an opaque reference stub in the client bundle and an exposed HTTP endpoint on the server. The actual function implementation, along with any database drivers and secret tokens, never downloads to the client browser. This directive applies exclusively to server-side functions. Components never use `'use server'`, because standard components run on the server by default.
>
> **DO THIS:**
> ```js
> ~'use server'~; // actions.js: every export becomes a Server Function
>
> export async function subscribe(email) {
>   await db.subscribers.add(email);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~'use server'~; // **WRONG:** App.jsx is a component file; there is no directive for Server Components
>
> export default function App() {
>   return <main><NewsletterSignup /></main>;
> }
> ```

Here is the minimal Server Function implementation. It consists of a single module containing one exported function, designated by the directive on line one:

```js title="src/actions.js"
~'use server'~; // Every function this file exports becomes a Server Function

import { db } from './db';

export async function subscribe(email) {
  await db.subscribers.add(email);
}
```

Here is the Client Component that consumes it. The component imports `subscribe` using standard module import syntax:

```jsx title="src/NewsletterSignup.jsx"
'use client';

import { ~subscribe~ } from './actions'; // In the browser, subscribe is a reference, not the code above
```

React documentation specifies that placing the directive at the top of a module marks all exports as Server Functions. These functions can be used anywhere, including imported directly into client code.

### An Import That Does Not Bring the Code

Recall how module imports typically operate. When a bundler generates the client JavaScript asset, it copies the implementation of every imported function into the bundle (Lesson 07). Importing a client helper like `isValidEmail` embeds its complete code into the browser payload, where it executes locally.

**Importing `subscribe` looks identical, but the bundler adopts a fundamentally different strategy.** Upon detecting the `'use server'` directive at the top of the actions file, the bundler excludes the function body of `subscribe` from the client bundle. Instead, it injects an opaque **reference**: a compact descriptor object that identifies the Server Function so the browser runtime can request its execution (Lesson 107). The actual function source code, along with internal database calls, remains securely on the server.

The official React documentation illustrates what a reference looks like for an internal Server Function named `createNote`:

```js title="The reference to createNote, as React's docs show it"
{ $$typeof: Symbol.for("react.server.reference"), ~$$id~: 'createNote' } // $$id tells the server which Server Function to run
```

React and the bundler generate this object automatically. Application code never constructs `$$typeof` or `$$id` identifiers directly.

```tree caption="What a normal import puts in the browser bundle, and what an import from a 'use server' file puts there."
What the import gives the browser
- +A normal import [`import { isValidEmail }`] | The bundler puts **the code of the function** in the browser bundle | A call **runs in the browser**
- +An import from a `'use server'` file [`import { subscribe }`] | The bundler puts **a reference** in the bundle; the code **stays on the server** | A call **sends a request to the server**
```

### A Reference in the Browser, an Endpoint on the Server

The `'use server'` directive instructs the framework compiler to construct two coordinated mechanisms:
1. **A client-side reference stub.** The bundler provides the browser with a lightweight callable proxy matching the function signature.
2. **An exposed HTTP server endpoint.** The framework runtime provisions an internal server route dedicated to executing the function. Official React documentation notes that Server Functions operate as exposed server endpoints callable throughout client code.

When the client invokes the imported proxy, React dispatches an HTTP request to the auto-generated server endpoint. The server runtime receives the incoming payload, maps the request identifier to the real `subscribe` function, and executes it. Developers do not configure endpoint routes manually, as the framework manages endpoint routing internally.

```tree dir=right caption="The two things 'use server' builds: a reference in the browser, and an endpoint on the server that the reference calls."
What `'use server'` builds for `subscribe`
- +1. In the browser [`subscribe`] | A **reference** that names the Server Function | Calling it **sends a request**
- +2. On the server | An **endpoint** created by the framework | The request arrives, and **the real `subscribe` runs**
```

React documentation defines `'use server'` and `'use client'` as **directives**: module-level string literals that instruct the compiler how to partition code boundaries (Lesson 111).

### VS | `'use client'` vs. `'use server'`: they look like a pair, they are not

The naming symmetry between the two directives frequently leads to confusion. A developer might assume that because `'use client'` creates a Client Component, `'use server'` must create a Server Component. **Despite their symmetrical appearance, their roles are fundamentally different:**

```jsx title="'use client' at the top of a file vs. 'use server' at the top of a file"
~'use client'~; // NewsletterSignup.jsx: this file, and what it imports, runs in the browser too
~'use server'~; // actions.js: the functions this file exports run only on the server, and the browser can call them
```

- **The `'use client'` directive defines component boundaries.** It designates component modules intended for compilation into the interactive browser bundle.
- **The `'use server'` directive defines function endpoints.** It designates asynchronous mutation functions that execute exclusively on the server runtime.

React provides no directive for declaring Server Components. Every component in a React Server Components project is a Server Component by default unless explicitly designated otherwise (Lesson 101). The official React documentation specifically warns against this misunderstanding, stating that Server Components are not denoted by 'use server' because that directive is reserved exclusively for Server Functions.

### VS | `'use server'` at the top of a function vs. at the top of a file: the same Server Function, a different way to reach it

In earlier architectures, `'use server'` appeared as the first statement inside an individual function body declared within a Server Component (Lesson 107):

```jsx title="'use server' at the top of a function, inside a Server Component"
async function likePost() {
  ~'use server'~; // Marks this one function
  await db.posts.like(1);
}
```

In this lesson, the directive sits at the top of a dedicated module:

```js title="'use server' at the top of a file, in actions.js"
~'use server'~; // Marks every function this file exports

export async function subscribe(email) {
  await db.subscribers.add(email);
}
```

**Both placements generate identical runtime primitives.** In both cases, the compiler constructs a server endpoint and a client reference stub. The difference lies entirely in distribution and module scope:
- **Inside an inline function body**, the function remains scoped to its enclosing Server Component. It cannot be imported by other files, so the parent component must pass it down to Client Components as a prop (Lesson 107).
- **At the module root**, every exported function becomes an independent Server Function. Any Client Component can import it directly, which the React documentation requires for client imports.

### The Files So Far

The `db.js` file simulates persistent backend storage. Its `add` method pushes email records into an internal array:

```js title="src/db.js"
const subscribers = [];

export const db = {
  subscribers: {
    async add(email) {
      subscribers.push(email);
    },
  },
};
```

The `actions.js` file contains our Server Function export. The `NewsletterSignup.jsx` file currently imports `subscribe`, while Principle 2 adds the input field and submit button. The `App.jsx` root renders the blog post and embeds the client signup widget:

```jsx title="src/App.jsx"
import NewsletterSignup from './NewsletterSignup';

export default function App() { // No directive: App is a Server Component
  return (
    <main>
      <h1>Park Opens Today</h1>
      <p>The city opened a new park on Main Street.</p>
      ~<NewsletterSignup />~ {/* A Client Component inside a Server Component */}
    </main>
  );
}
```

### `'use server'` on a Component File

Suppose a developer wants to guarantee that `App` runs on the server. Drawing a false parallel with `'use client'`, they place `'use server'` at the top of the component file:

```jsx title="src/App.jsx" bad="1"
~'use server'~; // **WRONG:** marks App as a Server Function, not as a Server Component

import NewsletterSignup from './NewsletterSignup';

export default function App() {
  return <main><NewsletterSignup /></main>;
}
```

**The build compiler halts with a fatal error, preventing the application from compiling.** Placing `'use server'` at the module root instructs the compiler that every export is an invocable Server Function. The component `App` is a synchronous UI rendering function, not an asynchronous action handler. React documentation mandates that 'use server' can only annotate async functions. The build step validates this constraint and rejects synchronous component exports.

Removing the erroneous directive resolves the error. The component `App` already executes as a Server Component by default because its enclosing module specifies no directive.

Remember this distinction: `'use server'` exposes callable server endpoints. It never defines a component.

---

## PRINCIPLE | `subscribe(email)`: a copy of the email goes to the server, and a copy of the answer comes back

> [!PRINCIPLE]
> **Principle 2: One Click Sends `john@example.com` and Brings Back `You are subscribed!`**
>
> *Calling a Server Function sends a network request with a copy of its arguments; the function runs on the server, and a copy of its return value comes back as the value of a promise, so pass only serializable values and `await` the answer.*
>
> Invoking a Server Function looks identical to a standard local function call, yet the function never runs in the browser. React serializes the function arguments, transmits them over an HTTP connection, executes the implementation on the server, and serializes the return value back to the client. This workflow achieves the same outcome as dispatching a manual `fetch` request, while eliminating boilerplate URL routing and response parsing. Because arguments must cross network boundaries, non-serializable objects like DOM events, React elements, and client functions cannot be passed.
>
> **DO THIS:**
> ```jsx
> async function handleClick() {
>   const answer = await ~subscribe(email)~; // A copy of email goes to the server; the answer comes back
>   setMessage(answer);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button ~onClick={subscribe}~>Subscribe</button> {/* **WRONG:** subscribe receives the click event, which cannot be sent to the server */}
> ```

### VS | `fetch('/api/subscribe')` vs. `subscribe(email)`: the same HTTP request, a different author

Both mechanisms transmit data to a backend endpoint using a standard HTTP POST request. Both receive a response payload and update the user interface. The essential distinction lies in who writes and maintains the transport code.

In a manual implementation, you must author and synchronize two distinct files. On the server, you construct an API route to handle incoming requests at a specific path:

```js title="api/subscribe.js"
export async function POST(request) {
  const { email } = await request.json();
  await db.subscribers.add(email);
  return new Response('You are subscribed!');
}
```

In the browser, the event handler manually serializes the payload, dispatches the request, checks response status, and parses text output:

```jsx title="With fetch: you write the URL, the request, and the reading of the answer"
async function handleClick() {
  const res = await ~fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })~; // You write the URL and turn the email into text
  const answer = await res.text(); // You read the answer yourself
  setMessage(answer);
}
```

With a Server Function, the `actions.js` file encapsulates the entire backend interaction. The function `subscribe` handles persistence and directly returns the confirmation string:

```js title="src/actions.js"
'use server';

import { db } from './db';

export async function subscribe(email) {
  await db.subscribers.add(email);
  ~return 'You are subscribed!'~; // The answer that travels back to the browser
}
```

The client-side click handler now consists of a single function invocation:

```jsx title="With subscribe: React writes the request for you"
async function handleClick() {
  const answer = await ~subscribe(email)~; // React builds the request, sends it, and reads the answer
  setMessage(answer);
}
```

**Both strategies execute the exact same underlying network protocol.** Both issue an HTTP request to a server endpoint and receive a string response. With Server Functions, React compiles your call into a network request on the client, and unpacks that request into a concrete function invocation on the server.

### What Travels on One Click

**The server runtime never accesses your client-side variables directly. It receives an independent serialized copy.** To transmit data across environments, React serializes arguments into a standardized wire format, transmits the payload across the network, and deserializes equivalent values on the server (Lesson 107).

Here is the precise execution flow of a single user submission:
1. The user enters `john@example.com`, which updates the local `email` state variable.
2. The user clicks Subscribe, triggering the click handler to invoke `subscribe(email)`.
3. Inside the browser bundle, `subscribe` is an opaque reference stub. React serializes the email string and transmits an HTTP POST request to the server endpoint.
4. On the server, the framework deserializes the payload back into a string primitive and invokes the concrete `subscribe` function.
5. The function executes `db.subscribers.add(email)` to persist the record and returns the string `'You are subscribed!'`.
6. The server runtime serializes the return value into the HTTP response body.
7. Back in the browser, the promise returned by `subscribe(email)` resolves, and `setMessage(answer)` updates the rendered output.

```tree dir=right caption="The path of one click: a copy of the email goes to the server, and a copy of the return value comes back."
What crosses between the browser and the server on one click
- +1. In the browser [`await subscribe`] | React **serializes the email** and sends it | The server gets **a copy** of `'john@example.com'`
- +2. On the server [`subscribe`] | The real function **saves the email** | It returns **`'You are subscribed!'`**
- +3. Back in the browser [`setMessage`] | React **builds the string again**, and the promise resolves | The page shows **`You are subscribed!`**
```

When passing props to Client Components, React serializes data once from server to client (Lesson 107). A Server Function call involves bidirectional serialization, transmitting arguments upstream and results downstream. Official React documentation notes that calling a Server Function dispatches an HTTP request with serialized argument copies. The server then transmits a serialized return value back to the client.

This network boundary explains why every Server Function must be declared with `async`. Network transmissions are inherently asynchronous operations, returning promises that callers must await. React documentation confirms that because underlying network calls are asynchronous, 'use server' can only be used on async functions.

### The Email Field, the Button, and the Answer Line

The component `NewsletterSignup` manages two pieces of state alongside an input field, a submit button, and a confirmation line. The input acts as a controlled element driven by `value` and `onChange` (Lesson 20):

```jsx title="src/NewsletterSignup.jsx"
'use client';

import { useState } from 'react';
import { subscribe } from './actions';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleClick() {
    const answer = await ~subscribe(email)~; // A copy of email goes to the server
    setMessage(answer); // The answer that came back goes on the page
  }

  return (
    <section>
      <h2>Get new posts by email</h2>
      <label>
        Your email
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <button ~onClick={handleClick}~>Subscribe</button> {/* handleClick passes email to subscribe, not the click event */}
      <p>{message}</p>
    </section>
  );
}
```

When the page first renders, the input field is empty and no status message is visible. Once the user enters `john@example.com` and triggers the submission, the server response renders below the form:

::: row caption="The newsletter signup when the page opens, and after the user typed an email and clicked Subscribe."
::: col title="When the page opens"
```page size=mini
section: Get new posts by email
form:
  field: Your email
  button: Subscribe
```
:::
::: col title="After the click"
```page size=mini
section: Get new posts by email
form:
  field: Your email | john@example.com
  button: Subscribe
line: You are subscribed! | good
```
:::
:::

This initial implementation contains a critical user experience flaw: during the network round trip, the interface gives no visual indication that work is in progress. Principle 3 resolves this limitation.

### `onClick={subscribe}`

Developers sometimes attempt to simplify the component by passing `subscribe` directly to the button element:

```jsx title="An arrow function that passes email vs. subscribe passed straight to onClick"
<button ~onClick={() => subscribe(email)}~>Subscribe</button> {/* Sends the email */}
<button ~onClick={subscribe}~>Subscribe</button> {/* **WRONG:** React passes the click event as the first argument */}
```

**Passing a Server Function directly to a DOM event handler breaks serialization.** In React, event listeners receive a SyntheticEvent object as their default first parameter (Lesson 11). When binding `onClick={subscribe}`, React attempts to pass that event object into `subscribe` instead of the email string.

React cannot serialize complex DOM event instances across the wire. Official documentation explicitly lists DOM events among unsupported data types. When serialization fails, the framework immediately aborts the call on the client with a descriptive error:

```devconsole width=full
x Error: Only plain objects, and a few built-ins, can be passed to Server Functions. Classes or null prototypes are not supported.
```

In other runtime configurations, the client transmits an unreadable placeholder object, causing backend processing to crash.

In either scenario, the actual email payload never reaches the database. Using an inline arrow wrapper like `onClick={() => subscribe(email)}` prevents this defect. The arrow function consumes the SyntheticEvent parameter and passes only the serializable string variable to `subscribe`.

### Anyone Can Call the Endpoint

Every Server Function compiles into a publicly accessible network endpoint. Anyone capable of sending HTTP requests can target that endpoint directly, bypassing your React user interface entirely. React documentation explicitly warns that arguments supplied to Server Functions are fully client-controlled. Developers must treat all received parameters as untrusted input.

Validating inputs inside the browser using client helpers like `isValidEmail` offers convenience for users, but provides zero backend security. Attackers can dispatch custom POST payloads directly to the underlying URL. You must always enforce validation and authorization inside the Server Function body: verify data formats, check business constraints, and authenticate session permissions (Lesson 130).

Remember this rule: Server Function calls resemble local code, but they are public HTTP endpoints that accept only serializable arguments.

---

## PRINCIPLE | `startTransition`: `isPending` stays `true` until the server's answer is on the page

> [!PRINCIPLE]
> **Principle 3: `startTransition` Shows `Subscribing...` While the Server Works**
>
> *Outside a form, call a Server Function inside `startTransition`, so `isPending` is `true` while the request is on its way; wrap the state update after `await` in a second `startTransition`.*
>
> A Server Function call incurs variable network latency during the round trip to the server. If React is unaware that an asynchronous mutation is executing, the UI provides no visual feedback, the submit button remains active, and users frequently trigger duplicate submissions. Executing the call within `startTransition` turns the operation into an Action, keeping `isPending` active until the response renders. State updates occurring after `await` must be enclosed in a nested `startTransition` because asynchronous continuations lose their automatic Transition tracking.
>
> **DO THIS:**
> ```jsx
> function handleClick() {
>   ~startTransition(async () => {~ // isPending is true until the answer is on the page
>     const answer = await subscribe(email);
>     startTransition(() => { setMessage(answer); });
>   });
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> async function handleClick() {
>   const answer = await ~subscribe(email)~; // **WRONG:** nothing shows the request is on its way, and the user clicks again
>   setMessage(answer);
> }
> ```

### The Button Looks Dead

The event handler in Principle 2 functions correctly, but network round trips take time. Over mobile connections or during high server load, responses can take several seconds. Throughout this window, the page remains completely static: the button still displays `Subscribe`, and no feedback appears.

**Without an active pending indicator, the interface appears unresponsive, prompting repeated user clicks.** Users assume their initial click failed to register. Clicking the button a second time dispatches an identical network request, causing `subscribe` to insert duplicate records into the database.

The React documentation prescribes a clear remedy: Server Functions should always be invoked within a Transition. Transitions allow React to track pending state and keep the user interface responsive during asynchronous workloads (Lesson 67).

> [!DEFINITION]
> **Action.** [REVIEW] An Action is an asynchronous function executed inside `startTransition` that coordinates pending UI states.
> 1. You pass an `async` callback to `startTransition`, which treats the operation as an Action.
> 2. The `useTransition` Hook provides an `isPending` boolean that remains `true` while the asynchronous operation completes.
> 3. React coordinates pending indicators across the network round trip, resetting `isPending` to `false` when all state updates settle (Lesson 41).

### VS | `await subscribe` in a plain handler vs. inside `startTransition`: the same answer, only one shows the wait

Consider the two handler implementations. Both invoke `subscribe(email)` and both render the resulting confirmation message:

```jsx title="await subscribe in a plain handler"
async function handleClick() {
  const answer = await ~subscribe(email)~; // React does not know that a request is on its way
  setMessage(answer);
}
```

```jsx title="await subscribe inside startTransition"
function handleClick() {
  ~startTransition(async () => {~ // React knows: isPending is true until the answer is on the page
    const answer = await subscribe(email);
    startTransition(() => {
      setMessage(answer);
    });
  });
}
```

**While both handlers yield the same final data, their runtime feedback differs completely.** The plain handler executes without informing React of an active background task. The second pattern registers an Action with `startTransition`. Because React monitors the awaited `subscribe` call, `isPending` remains true throughout the network round trip, allowing the UI to disable buttons and display loading indicators.

### Why the Handler Calls `startTransition` Twice

**A single `startTransition` call loses its transition context after an `await` expression.** In synchronous workflows, a single transition wrapper coordinates state updates without issue (Lesson 67). With asynchronous Server Functions, execution proceeds through distinct stages:
1. The initial `startTransition` invokes the asynchronous Action immediately. The flag `isPending` switches to true, allowing the submit button to render a loading state like Subscribing.
2. Execution pauses at `await subscribe(email)` while waiting for the server response. The flag `isPending` remains `true` because React tracks awaited promises inside Actions.
3. When the promise resolves, execution resumes in a new microtask. Official React documentation notes that when using `await` inside `startTransition`, state updates that execute after that point lose their Transition context.
4. Wrapping `setMessage(answer)` in a nested `startTransition` re-establishes the transition boundary for that state update. React documentation identifies this requirement as a known limitation scheduled for future optimization.
5. React holds `isPending` as true until the final state update paints to the screen. Once rendered, `isPending` resets to false, and the button returns to its initial label.

```tree dir=right caption="The two startTransition calls in handleClick, and what isPending is during each step."
What happens in `handleClick` after one click
- +1. First `startTransition` [`async`] | The Action **starts** | `isPending` turns **`true`**: the button reads **`Subscribing...`**
- +2. `await subscribe` | The Action **waits** for the server | `isPending` **stays `true`**
- +3. Second `startTransition` [`setMessage`] | The update after `await` is **part of the Transition** | The answer appears, and `isPending` turns **`false`**
```

### The Pending Button

The component incorporates the `useTransition` Hook, which returns a pending boolean flag and the transition dispatcher `startTransition`:

```jsx title="src/NewsletterSignup.jsx" startLine="9"
  const [isPending, ~startTransition~] = ~useTransition()~; // isPending is true while the Action runs
```

The updated `handleClick` function coordinates the two `startTransition` calls:

```jsx title="src/NewsletterSignup.jsx" startLine="11"
function handleClick() {
  ~startTransition(async () => {~ // 1. The Action starts: isPending turns true
    const answer = await subscribe(email); // 2. The Action waits for the server
    ~startTransition(() => {~ // 3. The update after await stays part of the Transition
      setMessage(answer);
    });
  });
}
```

The submit button reflects the active transition state via `disabled` and conditional text:

```jsx title="src/NewsletterSignup.jsx" startLine="27"
<button onClick={handleClick} ~disabled={isPending}~> {/* The user cannot click again while the request is on its way */}
  {isPending ? 'Subscribing...' : 'Subscribe'}
</button>
```

When a user submits `john@example.com`, the button immediately changes its text to `Subscribing...` and disables further clicks (Lesson 21). Multiple rapid clicks are ignored because the button element remains disabled throughout the request. When the server response resolves, the confirmation line renders and the button returns to its active state:

::: row caption="The newsletter signup while the request is on its way, and after the server answered."
::: col title="While the server works"
```page size=mini
section: Get new posts by email
form:
  field: Your email | john@example.com
  button: Subscribing... | | disabled
```
:::
::: col title="After the server answered" tone=good
```page size=mini
section: Get new posts by email
form:
  field: Your email | john@example.com
  button: Subscribe
line: You are subscribed! | good
```
:::
:::

### A Form Does This by Itself

In this implementation, `subscribe` is triggered from a manual button click handler, requiring explicit `startTransition` coordination. When using HTML forms, React manages transitions automatically. Official React documentation notes that forms automatically wrap Server Functions in transitions. Binding a Server Function to `<form action>` achieves the same pending state management without writing manual `startTransition` wrappers (Lesson 112).

Remember this principle: Server Function calls are asynchronous network requests, and `startTransition` ensures the interface reflects that pending latency.

---

## All 3 Principles Together

### The Complete Code

The `db.js` file simulates persistent backend storage:

```js title="src/db.js"
const subscribers = [];

export const db = {
  subscribers: {
    async add(email) {
      subscribers.push(email);
    },
  },
};
```

The `actions.js` file defines the Server Function:

```js title="src/actions.js"
~'use server'~; // Principle 1: every export becomes a Server Function

import { db } from './db';

export async function subscribe(email) {
  await db.subscribers.add(email);
  ~return 'You are subscribed!'~; // Principle 2: a copy of this string travels back to the browser
}
```

The `NewsletterSignup.jsx` file implements the interactive Client Component:

```jsx title="src/NewsletterSignup.jsx"
'use client';

import { useState, useTransition } from 'react';
import { ~subscribe~ } from './actions'; // Principle 1: a reference, not the code

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    ~startTransition(async () => {~ // Principle 3: isPending is true until the answer is on the page
      const answer = await ~subscribe(email)~; // Principle 2: a copy of email goes to the server
      startTransition(() => {
        setMessage(answer);
      });
    });
  }

  return (
    <section>
      <h2>Get new posts by email</h2>
      <label>
        Your email
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <button onClick={handleClick} ~disabled={isPending}~> {/* Principle 3: no second click while waiting */}
        {isPending ? 'Subscribing...' : 'Subscribe'}
      </button>
      <p>{message}</p>
    </section>
  );
}
```

The `App.jsx` file implements the root Server Component rendering the blog post:

```jsx title="src/App.jsx"
import NewsletterSignup from './NewsletterSignup';

export default function App() { // No directive: a Server Component
  return (
    <main>
      <h1>Park Opens Today</h1>
      <p>The city opened a new park on Main Street.</p>
      <NewsletterSignup />
    </main>
  );
}
```

```page caption="The finished page after the user typed john@example.com and clicked Subscribe."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | john@example.com
  button: Subscribe
line: You are subscribed! | good
```

### The Order in Which Things Run

```tree dir=right caption="The order in which the components and the Server Function run, from the first render to the answer on the page."
From the first render to `You are subscribed!`
- +1. On the server [`App`] | The framework renders `App`, a **Server Component** | `App` places **`<NewsletterSignup />`**
- +2. In the browser [`NewsletterSignup`] | React renders the **Client Component** | The bundle holds a **reference** to `subscribe`, not its code
- +3. The click [`handleClick`] | The Action starts; the button reads **`Subscribing...`** | React sends **a copy of the email** to the endpoint
- +4. On the server [`subscribe`] | The real function **saves the email** | Returns **`'You are subscribed!'`**
- +5. In the browser [`setMessage`] | The promise resolves | The page shows **`You are subscribed!`**, and the button reads **`Subscribe`**
```

### Summary

| Aspect | What a Developer Might Expect | What React Does |
| :--- | :--- | :--- |
| **`'use server'`** | Marks a Server Component, as the partner of `'use client'` | Marks every export of a file as a Server Function; there is no directive for Server Components |
| **The import** | Brings the code of `subscribe` into the browser | Brings a reference; the code, with `db`, stays on the server |
| **The call** | Runs `subscribe` right away, with your variable | Sends a network request with a copy of the arguments, and brings back a copy of the return value |
| **The arguments** | Anything, such as the click event from `onClick={subscribe}` | Only serializable values, such as the email string |
| **The wait** | The click is done at once | The call lasts a trip to the server and back; `startTransition` and `isPending` show it |

Remember the central principle of this lesson. **A Server Function call looks like a normal function call, but it is a network request.**

---

## For the Interview

> **The Interview Question:** What are Server Functions, and how does 'use server' create a callable endpoint?

### How to Answer Clearly in 30 Seconds

"A Server Function is an `async` function that executes on the server and can be invoked directly from client code. Placing `'use server'` at the top of a module marks every export as a Server Function. A Client Component imports the function like any standard utility. Behind the scenes, the bundler provides a lightweight reference stub, while the framework provisions a server endpoint. Three essential rules apply:
1. **Every call is a network request.** React transmits serialized argument copies to the endpoint, runs the function on the backend, and returns a serialized result through a promise.
2. **All transferred data must be serializable.** Strings and plain objects cross safely; DOM events, JSX elements, and functions cannot. This is why we write `onClick={() => subscribe(email)}` instead of `onClick={subscribe}`.
3. **Outside of forms, calls belong inside `startTransition`.** This ensures `isPending` tracks the active request, and state updates after `await` require a second `startTransition` to stay in the transition."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does `'use server'` mark a Server Component?"**
   **No.** React provides no directive for Server Components. Components without directives run on the server by default. The `'use server'` directive exposes callable network endpoints for functions. Placing it on a component module causes the compiler to treat the component as a Server Function, triggering a build error because components are not asynchronous actions.
2. **"Can anyone call a Server Function, and should I use one to read data?"**
   Anyone can call it. A Server Function compiles into a public HTTP endpoint, and React documentation emphasizes that arguments are fully client-controlled. Always validate inputs and verify authentication permissions inside the function body. Server Functions are designed for state mutations, not data fetching. To read data, Server Components fetch directly during render (Lesson 109).
3. **"What is the difference between `'use server'` at the top of a file and at the top of a function?"**
   Both create Server Functions with exposed server endpoints and client reference stubs. At the top of an inline function inside a Server Component, the function is scoped locally and must be passed to Client Components as a prop. At the top of a module, every exported function becomes an independent Server Function that any Client Component can import directly.

```tree caption="Interview comparison: the two places 'use server' can go, and the one place it must never go."
Where `'use server'` goes
- +Top of a file of `async` functions [`actions.js`] | Every export becomes a **Server Function** | Client code **imports** it and gets a **reference**
- +Top of an `async` function body [`likePost`] | One function inside a **Server Component** | Reaches a Client Component **as a prop**
- !Top of a component file [`App.jsx`] | ~Do **NOT** use it to make a Server Component | +**DO** leave the file with **no directive**
```
