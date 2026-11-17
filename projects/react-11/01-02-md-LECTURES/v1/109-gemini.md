# Lecture 109: How a Server Component Awaits Its Data, and What It Replaces

*(How does a component get data that arrives a moment later, and what code does that remove?)*

> INTERVIEW QUESTION | ❱ CORE | How do Server Components read data with async/await, and what does that replace?

---

## VS | `fetch` in an Effect vs. `await` in a Server Component: the Effect shows a loading line first, `await` puts the data in the first page

> In standard JavaScript, asynchronous operations pause execution using await until data arrives. **A Server Component functions identically: it is an async function that queries the database directly inside its body while React waits for resolution**. The data arrives embedded in the initial page response. Complex client state, lifecycle Effects, and custom backend APIs disappear completely.

Consider how backend JavaScript queries data on a Node server. The application queries the database using await, pausing execution until the database returns records:

```js title="Plain JavaScript on a Node.js server"
const emails = ~await~ db.emails.getAll(); // The next line runs only when the emails are here
console.log(emails.length);
```

In traditional client-side React, components could never pause during render. React expects an immediate return of JSX elements. Because data fetching takes time, the initial render displays only a placeholder loading indicator. An Effect then triggers a background network request after mount. When the server responds, a state updater triggers a second render to display the records (Lesson 33).

A Server Component eliminates that limitation. On the server, React permits the component function to pause at await expressions. React waits for the database query to resolve, then continues rendering using the returned JSX output. The straightforward database query used in backend scripts now lives directly inside the component:

```jsx title="React: the same line inside a Server Component"
export default ~async~ function EmailList() { // async: this component may wait while it renders
  const emails = ~await~ db.emails.getAll(); // React waits here, then goes on with the emails
  return <ul>{emails.map(email => <li key={email.id}>{email.subject}</li>)}</ul>;
}
```

Each environment provides distinct capabilities and constraints:
- **In the browser**, the component handles user clicks directly, but lacks database access. It must return JSX immediately, forcing the initial view to show a placeholder while data loads across a second network request.
- **On the server**, the component accesses the database directly and pauses execution until records arrive. Because execution pauses before returning JSX, the component cannot render its own loading message. A parent Suspense boundary displays the fallback indicator instead.

Keep this central rule in mind throughout this lesson:

**A Server Component awaits its data inside its own body, embedding the finished content directly into the first page response.**

> [!DEFINITION]
> **Async component.** [REVIEW] An async component is a component declared as an `async` function that pauses during server rendering to await asynchronous data before returning JSX.
> 1. The component executes on the server and pauses directly at `await` operations.
> 2. React suspends the component until the underlying promise resolves with the data.
> 3. Once resolved, the component resumes and returns its JSX output.
>
> Async components run exclusively on the server. The official React documentation explicitly states that async components are not supported on the client (Lesson 108).

> [!DEFINITION]
> **Suspense boundary.** [REVIEW] A `<Suspense>` boundary wraps a subtree of components to display fallback UI while child components load asynchronous dependencies.
> 1. A parent wraps an asynchronous child: `<Suspense fallback={<p>Loading...</p>}>`.
> 2. When the child component suspends on an unresolved promise, React catches the suspension and renders the fallback element.
> 3. Other parts of the page outside the boundary render and become visible without waiting.
> 4. As soon as the promise resolves, React replaces the fallback with the rendered child content (Lesson 69).

### The Same Emails, Two Different First Pages

Consider opening an email inbox in a web client. The interface displays an Inbox heading followed by a list of incoming messages, showing the sender name and subject line for each entry:

```page caption="The inbox the user sees after opening the page: a heading and two emails."
url: mail.example.com
heading: Inbox
line: Anna: Lunch on Friday?
line: Netflix: Get your next month for $0.99
```

The visitor simply navigates to the URL. The stored emails belong to this specific account and reside in the server database. When rendering begins, the list component does not yet hold the records, and the database query requires time to complete.

An application can read these email records in two different locations:
- **In the browser:** The initial page delivers only a loading placeholder message. The browser downloads the client bundle, executes the component, and subsequently requests message data through a secondary HTTP call. The component stores the emails, a loading boolean, and error objects in local state, kicking off the network request inside an Effect.
- **On the server:** The component is declared as an asynchronous function. It pauses for the database query inside its own function body during server render. When execution completes, the rendered email elements are sent directly in the initial HTML payload.

```tree caption="Two places to read the emails: in the browser after the first render, or on the server while React renders."
Two places to read the user's emails
- !In the browser, in an Effect [`useState` `useEffect` `fetch`] | The first page shows **only `Loading emails...`** | The emails come after **a second request** to the server
- +On the server, with `await` [`async function EmailList`] | The component **waits for the database** while React renders it | The emails are **in the first page**
```

A Server Component is a standard JavaScript function that returns JSX elements, mirroring the familiar structure of React components. However, its execution behavior is fundamentally different. While a browser component must return JSX immediately, React allows a Server Component to pause at an await expression. React suspends the component, awaits the database response, and uses the resulting JSX once the promise resolves.

For the visitor, this architectural difference determines what displays on initial screen load:
1. **With client Effects**, the visitor sees a loading message first. Message records appear only after an additional round trip to the server. The React documentation notes that initial server rendered HTML will only include a loading state with no data.
2. **With Server Component await**, the rendered message list arrives immediately in the initial page response.

For the developer, this architecture radically simplifies codebase maintenance. The client-side Effect implementation demands three state variables, lifecycle hooks, and a dedicated API route. The Server Component implementation accomplishes the entire task in a single await expression.

### Where Readers Usually Go Wrong

Developers frequently encounter three common issues when carrying browser development habits into Server Components:
1. **Omitting the await keyword.** The variable receives an unresolved Promise rather than the resolved array. Attempting to map over a Promise throws an immediate runtime TypeError.
2. **Calling local HTTP API routes from server code.** Developers often attempt to fetch relative endpoint paths. Server environments lack origin context to resolve relative paths, and querying local APIs adds unnecessary network overhead when direct database queries are available.
3. **Declaring loading state inside the async component.** An async component pauses execution before returning JSX. Any loading message placed within its body cannot render while the component remains paused.

### Four Ways to Show Data the Server Has

When presenting server-stored data on a page, teams typically evaluate four implementation approaches:
1. **Fetching inside an Effect within a Client Component.** This pattern suits client-only applications lacking a full-stack framework (Lesson 33). The React documentation permits this fallback when full-stack architectures are unavailable.
2. **Client caching libraries or framework loaders.** Specialized client cache libraries store fetched data in browser memory, refreshing records automatically when cache entries expire. Examples include TanStack Query, SWR, and modern React Router loaders. This pattern fits data that the client must retain and re-fetch after user actions.
3. **Awaiting queries in an async Server Component.** This pattern is ideal for initial page loads in frameworks supporting Server Components (Lesson 46). The server reads persistence layers directly before sending HTML. This lesson focuses on this approach.
4. **Passing an unresolved Promise from a Server Component to a Client Component using the use hook.** In this hybrid model, the server initiates a database promise without awaiting it, passing the promise to a client component that unwraps it on demand (Lesson 71). React recommends this pattern for lower-priority data, such as comment sections located further down the page.

## SECTION | The Inbox with Two Emails

We construct a focused email inbox containing a main title and two messages:
1. A message from Anna with the subject Lunch on Friday.
2. A message from Netflix with a promotional subscription subject.

```files title="mail: the inbox" caption="The three files of our inbox: the database stand-in, the list that awaits the emails, and the page."
src/
  db.js | stand-in | Plays the database and gives `db.emails.getAll()`
  EmailList.jsx | Server Component | An `async` function that awaits the emails and renders one `<li>` per email
  App.jsx | Server Component | The page: the `Inbox` heading, and a `<Suspense>` boundary around `<EmailList />`
```

The database file represents a local mock utility, providing a simulated query function without requiring an external database cluster (Lesson 108). Because none of these files declare the client directive, all three execute strictly on the server.

**PRINCIPLES:** A Server Component awaits its data inside its own body, embedding the finished records directly into the initial page response. Three foundational principles govern this flow:
1. **Awaiting data in an async component:** React suspends execution at await and resumes rendering once data arrives. Omitting await assigns a pending Promise, causing list rendering to crash.
2. **Replacing client-side fetching infrastructure:** A single database query replaces multiple state hooks, Effect subscriptions, and dedicated API endpoints, avoiding blank initial loading screens.
3. **Placing Suspense boundaries in parent components:** Because a suspended component pauses before returning JSX, fallback loading indicators must reside in an enclosing parent component.

---

## PRINCIPLE | `await` in an async component: React waits for the emails, then renders the list

> [!PRINCIPLE]
> **Principle 1: Async Components: `EmailList` Awaits the Emails While It Renders**
>
> *In a Server Component, write the component as an `async` function and `await` the data inside its body; React waits for the promise, then finishes rendering with the data.*
>
> A component in the browser must return its JSX at once, so its data can only arrive after the first render. A Server Component does not have that limit. When it reaches `await`, React suspends it, waits for the database, and resumes rendering with the emails. Only the finished list goes to the browser.
>
> **DO THIS:**
> ```jsx
> export default async function EmailList() {
>   const emails = ~await~ db.emails.getAll(); // React waits here, then renders the two emails
>   return <ul>{emails.map(email => <li key={email.id}>{email.subject}</li>)}</ul>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default async function EmailList() {
>   const emails = ~db.emails.getAll()~; // **WRONG:** emails is a promise, so emails.map throws a TypeError
>   return <ul>{emails.map(email => <li key={email.id}>{email.subject}</li>)}</ul>;
> }
> ```

Here is the whole list component:

```jsx title="src/EmailList.jsx" startLine="1"
import db from './db';

export default ~async~ function EmailList() { // async: this component may wait while it renders
  const emails = ~await~ db.emails.getAll(); // Waits for the database, then goes on with the two emails
  return (
    <ul>
      {emails.map(email => (
        <li key={email.id}>{email.from}: {email.subject}</li>
      ))}
    </ul>
  );
}
```

Each line in this component builds on familiar JavaScript patterns. Dynamic list rendering with keys originates from foundational JSX concepts (Lesson 18). Standard asynchronous execution uses language-level keywords (Lesson 41). Only two keywords introduce new behavior for React components:
- Declaring the component with **async** configures it to return a Promise. While client-side React cannot render components returning Promises, server-side React recognizes the Promise and suspends rendering until resolution.
- The **await** keyword pauses component execution until the database query settles, assigning the resolved array to local storage. While execution remains paused, React waits for the records before continuing render.

When React completes rendering the component, the interface displays both emails:

```page caption="What EmailList renders: one line per email from the database."
url: mail.example.com
line: Anna: Lunch on Friday?
line: Netflix: Get your next month for $0.99
```

### Where `db` and `emails` Come From

The mock database module provides an asynchronous data method:

```js title="src/db.js" startLine="1"
const db = {
  emails: {
    async getAll() {
      await ~new Promise(resolve => setTimeout(resolve, 1000))~; // Plays a real database: answers after one second
      return [
        { id: 1, from: 'Anna', subject: 'Lunch on Friday?' },
        { id: 2, from: 'Netflix', subject: 'Get your next month for $0.99' },
      ];
    },
  },
};

export default db;
```

The local constant receives the array produced once the database promise resolves. Each item is a distinct object containing an identifier that serves as the stable key for the rendered list element.

### How React Waits for a Component

React pauses component execution at await, resuming evaluation when data arrives. The official React documentation explains that awaiting inside an async component causes React to suspend and wait for the promise to resolve before resuming rendering. Resuming rendering means React continues evaluation from the suspended statement with resolved data in hand.

This behavior is exclusive to the server environment. Browser environments require synchronous JSX output during render, and React documentation explicitly states that async components are not supported on the client.

The sequence of operations during server rendering proceeds step by step:
1. React invokes the component function while rendering the page tree on the server.
2. Execution reaches the await expression. The async function returns a pending Promise rather than immediate JSX markup.
3. React suspends the component and waits for the underlying database promise to settle (Lesson 69).
4. One second later, the simulated database query resolves with the array of email objects.
5. React resumes rendering. The local variable holds the resolved array, and the component returns unordered list elements.
6. Only the resulting rendered markup streams to the browser. Source code for backend queries and database modules remains strictly on the server (Lesson 101).

```tree dir=right caption="How React renders EmailList on the server: it suspends at await and resumes when the emails arrive."
How React renders `EmailList` on the server
- +1. React calls `EmailList` [`async function EmailList`] | The function reaches `await` | It hands React **a promise**, not JSX
- +2. React suspends it [`await`] | React **waits** for the promise | The database answers **after one second**
- +3. React resumes rendering [`emails.map`] | `emails` holds **the two emails** | `EmailList` returns the `<ul>`, and only that **output** goes to the browser
```

In the browser, the Elements panel shows only what `EmailList` returned:

```dom
+ <ul>
+   <li>Anna<!-- -->: <!-- -->Lunch on Friday?</li>
+   <li>Netflix<!-- -->: <!-- -->Get your next month for $0.99</li>
+ </ul>
```

The server renderer inserts HTML comment delimiters where static text borders interpolated values. These markers allow client hydration algorithms to recognize boundary points between separate text nodes (Lesson 102).

### Forgetting `await`

The most common mistake is to leave out the one word that makes the component wait:

```jsx title="src/EmailList.jsx" startLine="3" bad="4"
export default async function EmailList() {
  const emails = ~db.emails.getAll()~; // **WRONG:** no await, so emails holds a promise, not the array
  return (
    <ul>
      {emails.map(email => (
        <li key={email.id}>{email.from}: {email.subject}</li>
      ))}
    </ul>
  );
}
```

Omitting the await keyword causes the list to fail, triggering an immediate error during server rendering. Without await, the component does not pause execution. The variable holds an unresolved Promise instance rather than an array of records. Because Promises do not define collection iteration methods, evaluating array mapping throws a runtime TypeError.

This error originates directly from the JavaScript runtime rather than React internals. The code attempts to invoke an array method on an unresolved Promise.

Remember that an async component pauses only at statements explicitly preceded by await.

---

## PRINCIPLE | `await db.emails.getAll()`: one line replaces three state variables, an Effect, and an API

> [!PRINCIPLE]
> **Principle 2: What `await` Replaces: The Effect Version Opens on `Loading emails...`**
>
> *When a Server Component can read the data, one `await` replaces the three state variables, the Effect, and the API file that a Client Component needs to fetch the same data.*
>
> The Effect version and the async version end with the same emails on the screen. But the Effect runs only in the browser, after the first render, so the first page holds only a loading line, and the emails come after a second request to an API built just for them. The async version reads the database while React renders on the server, so the emails are in the first page.
>
> **DO THIS:**
> ```jsx
> export default async function EmailList() {
>   const emails = ~await db.emails.getAll()~; // Reads the database directly while React renders
>   return <ul>{emails.map(email => <li key={email.id}>{email.subject}</li>)}</ul>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default async function EmailList() {
>   const emails = await ~fetch('/api/emails')~.then(res => res.json()); // **WRONG:** the server calls its own API, and the relative URL fails
>   return <ul>{emails.map(email => <li key={email.id}>{email.subject}</li>)}</ul>;
> }
> ```

### The Same List, Read in the Browser

Prior to the introduction of Server Components, implementing this list required a Client Component that fetched data inside a lifecycle Effect (Lesson 33). The standard implementation follows the pattern documented by React:

```jsx title="src/EmailList.jsx, written as a Client Component that fetches in an Effect" startLine="1"
'use client';

import { useState, useEffect } from 'react';

export default function EmailList() {
  const [emails, setEmails] = ~useState~(null); // 1. The emails, empty until the request answers
  const [isLoading, setIsLoading] = useState(true); // 2. The loading flag
  const [error, setError] = useState(null); // 3. The error, if the request fails

  ~useEffect~(() => { // Runs in the browser, after the first render
    fetch('/api/emails')
      .then(res => res.json())
      .then(data => {
        setEmails(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading emails...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <ul>
      {emails.map(email => (
        <li key={email.id}>{email.from}: {email.subject}</li>
      ))}
    </ul>
  );
}
```

Because browser environments cannot query server databases directly, the server required a dedicated API route to handle incoming client requests:

```js title="api.js" startLine="1"
app.get(~'/api/emails'~, async (req, res) => { // Answers the browser's second request
  const emails = await db.emails.getAll();
  res.send(emails);
});
```

Standard server routing constructs receive the incoming network request and return JSON records. This API route serves no external consumer; it exists solely to support the client component fetch call.

### VS | The Effect Version vs. the `await` Version: the same emails in the end, a different first page

Both approaches ultimately display the same two email messages on screen, yet their execution timing differs entirely. The fundamental contrast lies in when and where data retrieval occurs. React documentation highlights this distinction directly: the Effect pattern loads data after initial render, whereas the async Server Component loads data during render.

The visual experience on initial page load highlights this difference:

::: row caption="The first page the user gets: from EmailList with an Effect, and from EmailList with await."
::: col title="EmailList with an Effect" tone=bad
```page size=mini
url: mail.example.com
line: Loading emails...
```
The emails wait for a second request.
:::
::: col title="EmailList with await" tone=good
```page size=mini
url: mail.example.com
line: Anna: Lunch on Friday?
line: Netflix: Get your next month for $0.99
```
The emails are in the first page.
:::
:::

Under the Effect model, the visitor endures two round trips to the server before viewing data. The execution path follows five distinct steps:
1. The server transmits initial HTML. Because Effects do not run on the server, the delivered markup contains only the loading fallback message.
2. The browser downloads application scripts and executes client rendering. The React documentation observes that the browser must download all JavaScript and render your app only to discover that it must load data.
3. Following the initial render, the Effect executes and initiates an HTTP fetch request across the network.
4. The backend server processes the route request, queries the database, and transmits the JSON response.
5. State updater functions trigger a second render pass, finally displaying the resolved email elements.

Using await inside a Server Component collapses these five steps into a unified pass. The server queries data during the initial render and delivers completed HTML directly.

### What Goes Away

Comparing the two component implementations reveals four substantial pieces of boilerplate that disappear completely:
1. **Local state management hooks.** The client implementation requires separate state declarations for data storage, loading status, and error states. In the async component, results assign directly to a local constant.
2. **Lifecycle Effects and network calls.** A single await expression replaces the Effect subscription and its nested fetch promise chain.
3. **Conditional return guards.** The component eliminates branching logic that returned loading indicators or error messages.
4. **The dedicated backend endpoint.** Server Components query data sources directly without intermediate routing layers. The React documentation emphasizes that Server Components let you access your data layer without having to build an API.

```tree caption="What one await line replaces: three state variables, an Effect, two if lines, and an API file."
`EmailList` with an Effect vs. with `await`
- !With an Effect [`useState` `useEffect` `fetch` `api.js`] | Three state variables, **an Effect**, two `if` lines, and **an API file** | The first page shows **`Loading emails...`**, the list comes after **a second request**
- +With `await` [`async function EmailList`] | **One line**, no state, no Effect, no API | The first page **holds the list**
```

Fetching inside an Effect remains supported. React documentation permits this technique in client-only applications lacking server infrastructure, and it remains useful for loading data triggered by user interactions (Lesson 128). However, for records available on initial page load, a server await handles the entire requirement.

### Keeping the Old `fetch` in a Server Component

Migrating a component to the server while preserving its old fetch call causes immediate failure:

```jsx title="src/EmailList.jsx" startLine="3" bad="4"
export default async function EmailList() {
  const emails = await ~fetch('/api/emails')~.then(res => res.json()); // **WRONG:** the server has no page address to complete /api/emails
  return (
    <ul>
      {emails.map(email => (
        <li key={email.id}>{email.from}: {email.subject}</li>
      ))}
    </ul>
  );
}
```

The message list fails to render. A relative path specifies only the pathname without domain or protocol information. In a browser, the runtime resolves relative paths against the active document origin. On the server, no active browser window or URL origin exists to resolve the path, causing network fetching to throw a URL parsing TypeError.

Supplying an absolute domain URL does not resolve the underlying design flaw. The server would issue a network request to itself over HTTP simply to access a local database. Server Components should query the database directly and remove the redundant API route.

Remember that the server environment possesses direct access to backend data sources. A Server Component queries the database directly rather than calling its own HTTP endpoints.

---

## PRINCIPLE | `<Suspense fallback>` above `EmailList`: the loading line shows while the emails are on their way

> [!PRINCIPLE]
> **Principle 3: Suspense Above the Async Component: `<Suspense>` Shows `Loading emails...` While `EmailList` Waits**
>
> *The wait does not vanish with the loading flag; to show a loading line while an async component awaits, place `<Suspense fallback>` above that component, in its parent.*
>
> An async component waits for its data, so the user still needs a line that says the emails are on their way. The component cannot draw that line itself, because it is stopped at `await` before it returns anything. The parent draws it, as the `fallback` of a `<Suspense>` boundary, and React puts the list in its place when the component resumes.
>
> **DO THIS:**
> ```jsx
> <h1>Inbox</h1>
> <Suspense ~fallback~={<p>Loading emails...</p>}> {/* In App: shown while EmailList waits */}
>   <EmailList />
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default async function EmailList() {
>   const emails = await db.emails.getAll();
>   return <~Suspense~ fallback={<p>Loading emails...</p>}><ul>...</ul></Suspense>; // **WRONG:** returned only after the wait, so the fallback never shows
> }
> ```

### The Loading Line Is Back

The async list component manages no internal loading state. Nonetheless, when a visitor navigates to the inbox, the browser displays a loading indicator during the one-second query delay:

::: row caption="The finished inbox when the user opens it, and one second later."
::: col title="When the page opens"
```page size=mini
url: mail.example.com
heading: Inbox
line: Loading emails...
```
:::
::: col title="One second later"
```page size=mini
url: mail.example.com
heading: Inbox
line: Anna: Lunch on Friday?
line: Netflix: Get your next month for $0.99
```
:::
:::

The responsibility for displaying loading feedback has moved. In the client Effect pattern, loading UI was driven by internal state. In the Server Component architecture, loading UI is defined by the fallback prop of an enclosing Suspense boundary. That boundary wraps the component from its parent (Lesson 69):

```jsx title="src/App.jsx" startLine="1"
import { Suspense } from 'react';
import EmailList from './EmailList';

export default function App() {
  return (
    <>
      <h1>Inbox</h1>
      <Suspense ~fallback~={<p>Loading emails...</p>}> {/* Shown while EmailList waits for the database */}
        <EmailList />
      </Suspense>
    </>
  );
}
```

The component and database files remain identical to their earlier implementations. The list component contains no internal references to loading states.

### What Happens When the User Opens the Inbox

Asynchronous delays still occur during database queries. The fundamental change is which component controls the loading display while waiting. The runtime sequence proceeds in order:
1. The visitor opens the inbox application.
2. React renders the parent component on the server, outputting the main heading immediately before encountering the child component within its boundary.
3. The child component executes its database query, and React suspends execution at the await expression.
4. React displays the fallback UI of the nearest parent boundary. The static heading appears without delay.
5. One second later, the backend database promise resolves, allowing React to resume rendering the list items.
6. The resolved list replaces the loading fallback in the DOM. This UI transition occurs automatically without requiring manual state updates.

The completed list streams into the active webpage over the initial server connection. This technique is known as HTML streaming (Lesson 117).

```tree dir=right caption="How the inbox opens: the heading at once, the fallback while EmailList waits, then the list."
What the user sees when the inbox opens
- +1. At once [`<h1>Inbox</h1>`] | The heading **does not wait** | The user sees **`Inbox`**
- +2. While `EmailList` waits [`<Suspense fallback>`] | `EmailList` is **suspended** at `await` | The user sees **`Loading emails...`**
- +3. After one second [`<ul>`] | React **resumes** `EmailList` | The two emails **take the place** of the loading line
```

### VS | `isLoading` vs. `<Suspense fallback>`: the same words on the screen, a different owner

Both approaches render identical loading text on screen, but component ownership differs completely:
- Under local state management, the component declares a boolean flag, manually toggles values across promise callbacks, and returns its own fallback JSX.
- Under Suspense boundaries, the parent declares the fallback element once. React manages visibility automatically, rendering the fallback during suspension and removing it once the promise resolves.

The Effect approach required custom state flags because standard Effects do not trigger Suspense mechanisms. The React documentation notes that Suspense does not detect when data is fetched inside an Effect or event handler. Consequently, client-side Effect fetching required manual state tracking.

### Putting `<Suspense>` Inside `EmailList`

Developers sometimes mistakenly place the boundary inside the awaiting component itself:

```jsx title="src/EmailList.jsx" startLine="3" bad="6"
export default async function EmailList() {
  const emails = await db.emails.getAll();
  return (
    ~<Suspense~ fallback={<p>Loading emails...</p>}> {/* **WRONG:** this boundary does not exist yet while EmailList waits */}
      <ul>
        {emails.map(email => (
          <li key={email.id}>{email.from}: {email.subject}</li>
        ))}
      </ul>
    </Suspense>
  );
}
```

The fallback message never renders. In JavaScript, function execution pauses at await before reaching the return statement. While the component awaits its query, the return expression has not executed, meaning the boundary does not yet exist.

The React documentation specifies that the closest Suspense boundary above the suspending component shows its fallback. Searching upward from the suspending child, React finds no enclosing boundary in the parent component. As a result, the entire page render blocks until the database responds, preventing even the static heading from appearing.

Remember that a component that pauses execution cannot render its own loading indicator. The enclosing parent component must provide the boundary.

---

## All 3 Principles Together

### The Complete Code

The complete inbox implementation comprises the simulated database utility, the asynchronous list component, and the parent container with its Suspense boundary:

```files title="mail: the finished inbox" caption="The finished inbox: the database stand-in and two Server Components."
src/
  db.js | stand-in | Gives `db.emails.getAll()`, which answers after one second
  EmailList.jsx | Server Component | An `async` function that awaits the emails and renders one `<li>` per email
  App.jsx | Server Component | Renders the `Inbox` heading and a `<Suspense>` boundary around `<EmailList />`
```

```js title="src/db.js" startLine="1"
const db = {
  emails: {
    async getAll() {
      await ~new Promise(resolve => setTimeout(resolve, 1000))~; // Plays a real database: answers after one second
      return [
        { id: 1, from: 'Anna', subject: 'Lunch on Friday?' },
        { id: 2, from: 'Netflix', subject: 'Get your next month for $0.99' },
      ];
    },
  },
};

export default db;
```

```jsx title="src/EmailList.jsx" startLine="1"
import db from './db';

export default ~async~ function EmailList() { // Principles 1 and 2: no state, no Effect, no API
  const emails = ~await~ db.emails.getAll(); // Principle 1: React suspends here and resumes with the emails
  return (
    <ul>
      {emails.map(email => (
        <li key={email.id}>{email.from}: {email.subject}</li>
      ))}
    </ul>
  );
}
```

```jsx title="src/App.jsx" startLine="1"
import { Suspense } from 'react';
import EmailList from './EmailList';

export default function App() {
  return (
    <>
      <h1>Inbox</h1>
      <Suspense ~fallback~={<p>Loading emails...</p>}> {/* Principle 3: the loading line lives here, above EmailList */}
        <EmailList />
      </Suspense>
    </>
  );
}
```

```page caption="The finished inbox one second after the user opens it."
url: mail.example.com
heading: Inbox
line: Anna: Lunch on Friday?
line: Netflix: Get your next month for $0.99
```

### The Order in Which React Renders the Inbox

When a visitor navigates to the inbox, React executes the parent component on the server. It outputs the static heading, encounters the Suspense boundary, and invokes the list component. The list component suspends at await, triggering immediate delivery of the fallback UI. When the database query settles, React resumes execution and streams the finished list elements into the document:

```tree dir=right caption="The order in which React renders the components of the inbox on the server."
The order in which React renders the inbox
- +1. `App` [`<h1>Inbox</h1>`] | React renders the heading **at once** | The user sees **`Inbox`** first
- +2. `<Suspense>` and `EmailList` [`await`] | `EmailList` **suspends** at `await` | The boundary shows **`Loading emails...`**
- +3. `EmailList` again [`<ul>`] | After one second React **resumes** `EmailList` | The two emails **replace the fallback**
```

| Principle | What the code does | What the user sees |
| :--- | :--- | :--- |
| **1. `EmailList` awaits the emails** | `async function EmailList` with `await db.emails.getAll()` | The two emails, rendered on the server |
| **2. What `await` replaces** | No `useState`, no `useEffect`, no `fetch`, no `api.js` | The emails in the first page, with no second request |
| **3. `<Suspense>` above `EmailList`** | `<Suspense fallback={<p>Loading emails...</p>}>` in `App` | `Inbox` and `Loading emails...` first, then the emails |

Remember the primary lesson takeaway: **A Server Component awaits its data inside its own body, embedding the finished records directly into the initial page response.**

---

## For the Interview

> **The Interview Question:** How do Server Components read data with async/await, and what does that replace?

### How to Answer Clearly in 30 Seconds

"A Server Component can be declared as an async function that awaits data directly inside its body, such as `const emails = await db.emails.getAll()`. React documents this pattern as an async component.
1. **How suspension functions:** Upon encountering an await expression, React suspends the component, waits for the underlying Promise to settle, and resumes rendering with the resolved records. Only the completed HTML output ships to the browser.
2. **What this architecture replaces:** It replaces a Client Component that stored records, loading indicators, and error objects across multiple useState hooks. That legacy approach initiated fetches inside useEffect following initial mount, requiring a dedicated backend API route. Because Effects do not execute during server rendering, the initial HTML delivered only an empty loading state, forcing a second network round trip.
3. **Where loading feedback resides:** Loading indicators move out of the data component into the fallback prop of an enclosing Suspense boundary in the parent component."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Can a Client Component be async too?"**
   **No.** The official React documentation explicitly states that async components are not supported on the client. To consume asynchronous promises within a Client Component, pass the pending Promise as a prop from a Server Component and unwrap it using the use hook (Lesson 71). This architecture is commonly employed for secondary, non-critical data such as user comments. The Server Component initiates the Promise without awaiting it, and the Client Component suspends on demand. Any value transmitted across this boundary must remain serializable (Lesson 107). However, React guidance notes that the simplest design awaits the promise directly where it is created.
2. **"Is fetching in an Effect dead now?"**
   **No.** React identifies four primary shortcomings of fetching inside Effects:
   - Effects do not run on the server, so initial server-rendered HTML delivers only an empty loading placeholder.
   - They frequently trigger network waterfalls, where child components cannot initiate their own requests until parents complete rendering.
   - They provide no built-in data preloading or cross-request caching mechanisms.
   - They require repetitive boilerplate code to track loading flags, capture network failures, and guard against race conditions (Lesson 33).

   Nonetheless, fetching inside Effects remains supported for client-only applications lacking server infrastructure and for data fetching triggered by user actions. Data fetching architectural patterns are examined in Lesson 128.
3. **"When does the await run: on every request?"**
   **It depends on the data.** For user-specific or dynamic data such as a personal email inbox, the Server Component executes on every incoming request on the server. For static content that remains identical across all visitors, such as documentation rendered from markdown files, execution can occur once during the build step. In subsequent lessons, multiple sequential awaits evaluate in series (Lesson 138). Duplicate queries within a single render pass can be deduplicated using cache (Lesson 123).

```tree dir=right caption="Interview summary: how an async Server Component reads data, and what it replaces."
Reading data in a Server Component
- +`async` and `await` [`async function EmailList`] | React **suspends** the component at `await` | React **resumes rendering** with the data and sends **only the output**
- !What it replaces [`useState` `useEffect` `fetch` `api.js`] | State, an Effect, and **an API** built for one fetch | A first page with **only a loading state**
- +Where the loading line goes [`<Suspense fallback>`] | A boundary **above** the async component | React shows the fallback **while the component waits**
```
