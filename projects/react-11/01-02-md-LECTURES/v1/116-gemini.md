# Lecture 116: How a Server Page Hands the Signed-In User to Client Context

*(How do Client Components read the signed-in user when only the server can read the database?)*

> INTERVIEW QUESTION | ❱ CORE | How does context behave across the server/client boundary?

---

## VS | `createContext` in a Server Component vs. in a `'use client'` Provider: context lives only in the browser

> User authentication records reside securely in the database, which only server code can query. Yet the interactive buttons and forms displaying that user profile execute in the browser. **React context operates exclusively on the client, so a Server Component queries the user record and forwards it as a prop to a client provider component**. Server Components execute once during page generation and do not retain memory state. Context exists specifically to notify active subscribers when data changes, so it belongs entirely in the browser runtime.

Consider how traditional multi-page web applications handled authentication data before client-side frameworks existed. The backend server retrieved the authenticated account from the database and injected the user object directly into a global script tag. Every browser script could then access that shared identity from window memory without connecting directly to the database:

```html title="The page the server sends: the server printed the user into a script tag"
<script>~window.currentUser = { id: 1, name: 'John' };~</script> <!-- Written by the server, read by every script in the browser -->
<button id="account"></button>
```

```js title="account.js, a script in the browser"
document.getElementById('account').textContent = ~window.currentUser.name~; // John, printed into the page by the server
```

The backend handles secure data retrieval once and transfers serialized information to the client. The browser preserves that record in a single shared location where interactive UI scripts read it. Client scripts never establish direct connections to the database.

React with Server Components follows this exact architectural boundary. The Server Component queries the user data. The hand-off occurs through standard component props. In the browser, React context serves as the shared store that distributes that user profile to interactive components.

### The Context Code From Lesson 28, Moved Into a Server Component

Consider the standard context pattern introduced in Lesson 28. Suppose you place that code inside `App.jsx`. Because the file omits the `'use client'` directive, React treats it as a Server Component. The component awaits the user record from the database module (Lesson 109):

```jsx title="App.jsx, a Server Component" startLine="1" bad="4"
import { createContext } from 'react';
import db from './db';

const UserContext = ~createContext~(null); // **WRONG:** on the server, React has no createContext, so the page stops

export default async function App() {
  const user = await db.users.get(1);
  return (
    <UserContext value={user}>
      <p>Hello, {user.name}</p>
    </UserContext>
  );
}
```

This code matches the syntax from Lesson 28 character for character. **It may look the same, but it is NOT the same thing!** In Lesson 28, that module executed in the browser. Here, it runs on the server during request processing. The server build of React does not provide `createContext`. The server process halts with an exception, and the browser receives no HTML document.

Why does React exclude context from the server runtime? Official React documentation highlights two fundamental architectural principles:
1. **Context exists to trigger re-renders.** React documentation notes that React re-renders components reading context whenever the provided value updates.
2. **Server Components do not persist in memory.** React documentation explains that Server Components execute once during rendering, retain no runtime memory state, and cannot register reactive subscriptions.

A Server Component executes during the request, serializes its UI output, and discards its component instance immediately. No persistent component tree remains on the server for context to re-render. Context belongs exclusively where component instances stay alive in memory: the browser.

This design leads directly to a three-step architecture:

```tree dir=right caption="How a value read on the server reaches context in the browser: the server reads it, a Client Component provides it, and Client Components below read it."
How the signed-in user reaches the comment form
- +1. The server reads the value [`App.jsx`, no directive] | `App` **awaits the user** from `db.js` | Passes it on as a **prop**: `user={user}`
- +2. A Client Component provides it [`UserProvider.jsx`, `'use client'`] | **Makes the context** and renders the provider | Wraps the page it receives as **`children`**
- +3. Client Components below read it [`useContext`] | `AccountButton` and `CommentForm` **read the same user** | Both show **John**
```

Keep this fundamental rule in mind throughout the entire lesson:

**Context lives exclusively in the browser. The server queries the user and forwards it as a prop to a client provider, where nested Client Components read it with `useContext`.**

### Three Ideas From Earlier Lessons

> [!DEFINITION]
> **Server Component and Client Component.** [REVIEW] A file without a directive contains Server Components. They execute on the server, support `async` database queries, and stream serialized UI descriptions to the browser. A file beginning with `'use client'` defines Client Components. Their JavaScript downloads in the browser bundle, enabling component state, reactive effects, and event listeners. Hooks do not operate inside Server Components (Lesson 108).

> [!DEFINITION]
> **Context.** [REVIEW] Context enables deeply nested components to read shared values without manual prop drilling through intermediate layers. You initialize a context object using `createContext(null)`, supplying an initial fallback value. The context provider wraps a subtree using `<UserContext value={user}>`. Any descendant client component reads that value via `useContext(UserContext)`. React automatically re-renders subscribers whenever that context value updates (Lesson 28).

> [!DEFINITION]
> **What can travel from the server to the browser.** [REVIEW] When a Server Component renders a Client Component, React serializes the props into a data stream on the server and deserializes them in the browser. Strings, numbers, booleans, arrays, plain objects, and JSX elements cross this network boundary safely. Functions and class instances cannot cross, because functions represent executable code rather than serializable data (Lesson 107).

### What the Reader of the Page Sees

This architectural boundary directly affects the user experience:
1. **Calling `createContext` inside a server file crashes the request.** The server terminates execution before generating any HTML, leaving the user with an error screen.
2. **Structuring the client provider correctly displays the username immediately in the initial page response.** The browser renders the profile name without initiating secondary network requests to authenticate the session.

### Where Readers Usually Go Wrong

Developers typically encounter three common points of confusion:
1. **They call `createContext` inside the server module**, assuming context belongs in the file where database queries execute.
2. **They import context into a Server Component and attempt to read it**, expecting server code to consume context values like client code.
3. **They worry that a client provider converts nested Server Components into client code**, so they abandon context and manually drill props through every layer.

### Four Ways to Bring a Server Value to Client Components

When Client Components require data that only the server can fetch, you choose between four architectural strategies:
1. **Pass the data down through props at each layer.** React documentation recommends starting with direct prop passing. This strategy works well across one or two component levels. Across deeply nested trees, intermediate components must carry props they never consume.
2. **Pass rendered JSX elements as children to eliminate intermediate prop drilling** (Lesson 115). This composition pattern works when intermediate wrapper components only serve layout purposes.
3. **Forward server data as a prop into a client provider, then consume it with `useContext`.** This approach excels when multiple Client Components across different branches require the same identity. This lesson demonstrates this pattern.
4. **Stream an unresolved Promise into a client provider and unwrap it with the `use` Hook.** This pattern fits slow asynchronous operations where initial UI rendering should proceed without blocking. Lesson 165 explores this technique.

Both the client provider and streaming Promise patterns serve Client Components exclusively, because Server Components cannot subscribe to context. When a Server Component needs user identity, it receives a direct prop or queries the database directly.

## SECTION | A News Article for a Signed-In User

Imagine viewing a published news article while authenticated under the username John. A navigation button at the top displays your account profile. Beneath the article body, an interactive comment section identifies your active session:

```page caption="A news article for a reader signed in as John: the name John on the account button and above the comment form."
url: news.example.com/new-park
line: [John]
heading: Our new park opens
form:
  textarea: Commenting as John |
  button: Post
console: quiet
```

This layout demands two distinct operational responsibilities distributed across the network boundary:
1. **User authentication state lives inside the database.** Only server environments possess direct access to database credentials and session storage.
2. **The navigation button and comment form handle client user interactions.** Clicking the account button reveals an interactive menu, while the comment form processes live keyboard input. Browser runtimes handle DOM events, requiring both elements to be Client Components (Lesson 108).

These interactive components occupy distant locations in the component tree. The account button resides inside the page header, while the comment form sits nested within the article body. When disparate components require shared data without cumbersome prop drilling, React context provides the standard solution (Lesson 28).

Six files make the page:

```files title="news: the article page" caption="The six files of the news page: the database stand-in, two Server Components, and three Client Components."
src/
  db.js | stand-in | Plays the database and gives `db.users.get(id)`
  UserProvider.jsx | Client Component | Starts with `'use client'`; makes `UserContext` and provides `user` to its `children`
  AccountButton.jsx | Client Component | Starts with `'use client'`; reads the user and shows the name on a button
  CommentForm.jsx | Client Component | Starts with `'use client'`; reads the user and shows `Commenting as John`, a `<textarea>`, and `Post`
  Article.jsx | Server Component | Shows the heading and renders `CommentForm`
  App.jsx | Server Component | Awaits the user and renders `UserProvider` around the header and the article
```

Three files specify the `'use client'` directive, causing them to execute inside the browser bundle. The remaining three modules omit directives, executing entirely on the server. In production systems, a server page extracts user identifiers from session cookies. Here, the `App` component queries identifier `1` directly to keep the demonstration focused.

**PRINCIPLES:** Context operates exclusively in the browser runtime. A Server Component can query data and pass it forward as props, but it cannot create or consume context. Five governing principles guide this architecture:
1. **Calling `createContext` inside a Server Component halts execution before sending the response.** The server build of React omits `createContext`.
2. **Creating `UserProvider` with `'use client'` accepts server data as a prop and instantiates client context.** The transferred data must consist of serializable values.
3. **Rendering `<UserContext>` from a Server Component passes the element down but forbids reading context.** The server module possesses only a Client Reference placeholder for the real context export.
4. **Calling `useContext` under the provider enables any Client Component to access the user profile at any nesting depth.** Context subscriptions function identical to Lesson 28, even across intermediate Server Components.
5. **Passing Server Components as children to a client provider keeps those components executing on the server.** Import graphs determine execution boundaries, rather than visual JSX hierarchy.

---

## PRINCIPLE | `createContext` in a Server Component: the server stops before it sends the page

> [!PRINCIPLE]
> **Principle 1: Context Is a Client Feature: `createContext` in `App.jsx` Stops the Page**
>
> *Never call `createContext` in a Server Component file; make every context in a file that starts with `'use client'`.*
>
> Context exists to re-render the components that read it when its value changes. A Server Component runs once, hands over its output, and does not stay in memory, so on the server there is nothing for context to update. React leaves `createContext` and `useContext` out of the copy that runs on the server, and a server file that asks for them stops the page.
>
> **DO THIS:**
> ```jsx
> 'use client';
> import { createContext } from 'react';
> export const ~UserContext~ = createContext(null); // Made in a client file, where context exists
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { createContext } from 'react';
> const UserContext = ~createContext~(null); // **WRONG:** a file with no directive runs on the server, and the page stops
> ```

### The Data Is Here, So the Context Goes Here

Suppose an engineering team migrates a news website to React Server Components. The root `App.jsx` component awaits user records directly from the database. Following traditional client patterns, a developer initializes a context object directly inside that server module:

```jsx title="src/App.jsx" startLine="1" bad="4"
import { createContext } from 'react';
import db from './db';

const UserContext = ~createContext~(null); // **WRONG:** App.jsx runs on the server, where React has no createContext
```

At first glance, this placement seems intuitive. The database query resolves in this file, suggesting that context initialization belongs alongside the data.

### Why the Page Never Arrives

The user receives no rendered article and no greeting header. The server crashes immediately upon evaluating `App.jsx`, before producing any HTML output. Here is the exact runtime sequence:
1. Because `App.jsx` lacks a directive, React treats it as a Server Component. Server Components represent the default execution model and require no explicit markers. React documentation emphasizes that Server Components require no directive.
2. The server runtime evaluates the module using the server-specific export bundle of React.
3. The server package of React omits `createContext` and `useContext`. React documentation designates `createContext` as an API restricted exclusively to client environments.
4. The import statement attempts to destructure `createContext` from the React package and encounters an undefined export. The Node process or server worker throws an error referencing the missing export.
5. The server terminates response generation immediately, so the client browser never receives an HTML document.

This crash occurs strictly on the server. You observe the stack trace in server terminal logs or framework error overlays. The browser cannot display runtime errors, because network transmission never completed.

```tree caption="The same createContext line in a client file vs. in a server file."
Where `createContext` runs
- +In a file with `'use client'` [`createContext`] | The file **runs in the browser** | Components that read the context **stay alive** and re-render when it changes
- !In a file without a directive [`App.jsx`] | The file **runs on the server** | The copy of React on the server has **no `createContext`**, so the page **never arrives**
```

Remember this foundational distinction: context belongs exclusively to the browser runtime, so `createContext` must reside in a file marked with `'use client'`.

---

## PRINCIPLE | `UserProvider` with `'use client'`: the server passes `user` as a prop, and the provider makes the context

> [!PRINCIPLE]
> **Principle 2: The Client Provider: `UserProvider` Takes `user` as a Prop From the Server**
>
> *Put `createContext` and the provider in a file with `'use client'`; let the Server Component read the value, pass it as a prop, and pass the page between the tags as `children`.*
>
> The server can read the database but cannot make context. The browser can make context but cannot read the database. So the server reads the user and hands it over as an ordinary prop, and a small Client Component provides it. Because the value travels from the server to the browser, it must be plain data.
>
> **DO THIS:**
> ```jsx
> export default async function App() {
>   const user = await db.users.get(1);
>   return ~<UserProvider user={user}>~<Article /></UserProvider>; // The server reads; the client provider provides
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default async function App() {
>   const row = await db.users.get(1);
>   return <UserProvider ~user={row}~><Article /></UserProvider>; // **WRONG:** row holds a signOut method, which cannot cross, so the page stops
> }
> ```

### Two Small Files: One Reads the User, One Provides It

The correct architecture mirrors the separation of concerns found in traditional JavaScript applications. The server file retains responsibilities unique to the server: querying database records. A dedicated client module handles duties exclusive to the browser: instantiating context and providing values.

```jsx title="src/UserProvider.jsx" startLine="1"
'use client';

import { createContext } from 'react';

export const UserContext = createContext(null);

export default function UserProvider({ ~user, children~ }) { // user and the page both arrive as props from App
  return <UserContext value={user}>{children}</UserContext>;
}
```

```jsx title="src/App.jsx" startLine="1"
import UserProvider from './UserProvider';
import AccountButton from './AccountButton';
import Article from './Article';
import db from './db';

export default async function App() {
  const user = await db.users.get(1);
  return (
    ~<UserProvider user={user}>~ {/* The server value crosses as an ordinary prop */}
      <header><AccountButton /></header>
      <Article />
    </UserProvider>
  );
}
```

The `App` component renders `<UserProvider user={user}>`, nesting page content between component tags. **This mechanism matches standard prop passing into any Client Component.** React documentation demonstrates an identical pattern with counter components. A Server Component reads initial data and renders a client component with props. In this architecture, the prop contains user data and the Client Component serves as a context provider.

The `UserProvider` component fulfills a single dedicated responsibility: wrapping received elements in a context provider. It remains decoupled from header navigation or article layout details.

### Where `user`, `children`, and `UserContext` Come From

Each identifier in this architecture serves a distinct structural role:
1. **The `user` prop** represents the serialized data object supplied by `App`. React assigns this object to `props.user` through standard prop mechanics (Lesson 08).
2. **The `children` prop** receives the header and article elements nested between provider tags (Lesson 09).
3. **The exported `UserContext` object** allows distant client components, like navigation buttons and comment forms, to import that exact identifier. React documentation recommends declaring contexts in separate modules and exporting them for consuming components.

The `db.js` module simulates a persistent database, resolving queries with plain JavaScript objects:

```js title="src/db.js" startLine="1"
const users = [{ id: 1, name: 'John' }];

const db = {
  users: {
    async get(id) {
      return ~users.find(user => user.id === id)~; // Plays a real database: answers with the user whose id is 1
    },
  },
};

export default db;
```

### What Happens When the Reader Opens the Page

Execution proceeds seamlessly across both environments. Here is the complete lifecycle of the user data:
1. On the server, `App` awaits the database query and receives a user object containing numeric and string properties.
2. The `App` component renders `<UserProvider user={user}>`. Because the provider module contains `'use client'`, React marks `UserProvider` as a Client Component.
3. The user record crosses the network boundary as serialized prop data. Because it contains only serializable primitive values, React streams it safely to the client (Lesson 107). React documentation explicitly includes plain objects with serializable properties among valid props for Client Components.
4. In the browser, `UserProvider` mounts with deserialized user data in its props. Because context initialization occurred in client code, the provider delivers that identity to all nested components.

The provider component introduces no extra DOM nodes to the browser document. Inspecting the Elements panel reveals `<header>` and `<article>` elements sitting directly in the DOM without wrapper tags.

### VS | `<UserContext value={user}>` vs. `<UserContext.Provider value={user}>`: two spellings of the same provider

Inside provider modules, you will encounter two equivalent syntaxes for rendering context providers:

```jsx title="Two ways to write the provider inside UserProvider.jsx"
<UserContext ~value={user}~>{children}</UserContext> {/* React 19: the context itself is the provider */}
<UserContext.Provider ~value={user}~>{children}</UserContext.Provider> {/* Before React 19: the same provider */}
```

**Both syntaxes produce identical runtime behavior.** React documentation explains that starting in React 19, you can render context objects directly as providers. In legacy versions of React, you write the provider property explicitly.

### The Database Row That Cannot Cross

Our simulated database returns a plain object literal. In production systems, database drivers and object-relational mappers often return complex class instances or model records containing instance methods. Suppose a developer passes that raw database entity directly into the client provider:

```jsx title="src/App.jsx" startLine="6" bad="8"
export default async function App() {
  const user = await db.users.get(1);
  return <UserProvider ~user={user}~><Article /></UserProvider>; // **WRONG:** user holds a signOut method, which cannot cross to the browser
}
```

**The server crashes during serialization because functions and prototype methods cannot cross the network boundary.** React documentation specifies that functions without explicit server directives and instances of custom classes cannot be passed as props across the network boundary (Lesson 107). The solution requires extracting only the serializable data fields required by client views:

```jsx title="src/App.jsx" startLine="6"
export default async function App() {
  const row = await db.users.get(1);
  const user = ~{ id: row.id, name: row.name }~; // Only plain fields cross: the id 1 and the name John
  return <UserProvider user={user}><Article /></UserProvider>;
}
```

```tree dir=right caption="The two files of the fix: App.jsx reads the user on the server, and UserProvider.jsx provides it in the browser."
How `App` hands the user to the provider
- +1. `App.jsx` on the server [`await`] | Reads **the user John** from `db.js` | Passes plain fields as **`user={user}`**
- +2. The prop crosses [`user`] | A **plain object** with a number and a string | ~Do **NOT** pass a row with **methods** or a **class instance**
- +3. `UserProvider.jsx` in the browser [`'use client'`] | **Makes `UserContext`** and renders the provider | Provides **John** to its **`children`**
```

Remember: the Server Component queries the data record, and the client provider distributes it to subscribers.

---

## PRINCIPLE | `<UserContext>` in a Server Component: the server can pass the context on, but never read it

> [!PRINCIPLE]
> **Principle 3: The Server Passes, Never Reads: `App.jsx` Can Write `<UserContext>` but Cannot Read It**
>
> *A Server Component never reads context; it can only pass a value to a client provider, and leave the reading to Client Components.*
>
> When a server file imports from a `'use client'` file, it holds only a placeholder that points to the real export in the browser. It can pass that placeholder on as a tag, and React renders it in the browser. It cannot look inside it: `use(UserContext)` stops the page, and `useContext` does not exist on the server.
>
> **DO THIS:**
> ```jsx
> export default async function App() {
>   const user = await db.users.get(1); // The server reads the database, not the context
>   return <p>Hello, {~user.name~}</p>; // The greeting shows John, with no context involved
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default async function App() {
>   const user = ~use(UserContext)~; // **WRONG:** Cannot use() an already resolved Client Reference
>   return <p>Hello, {user.name}</p>;
> }
> ```

### VS | Writing `<UserContext>` vs. Reading `UserContext` in `App.jsx`: the server can pass it on, but not read it

Following Principle 2, `UserContext` resides in a client file with an explicit export. Because it is exported, `App.jsx` can import that identifier. A developer might then experiment with two different patterns inside the server file. First, the developer renders the context provider tag directly in JSX without a custom wrapper component:

```jsx title="App.jsx writes the UserContext tag"
import { UserContext } from './UserProvider';

export default async function App() {
  const user = await db.users.get(1);
  return <~UserContext~ value={user}><Article /></UserContext>; // The server passes the tag on: the page shows John
}
```

Second, the developer attempts to read the context value directly inside the Server Component to display a greeting:

```jsx title="App.jsx reads UserContext"
import { use } from 'react';
import { UserContext } from './UserProvider';

export default async function App() {
  const user = ~use(UserContext)~; // **WRONG:** the server cannot read context, and the page stops
  return <p>Hello, {user.name}</p>;
}
```

Both examples import the exact same `UserContext` identifier from the client module. **Yet their runtime behavior differs completely.** Rendering the provider tag succeeds and correctly renders the username in the browser. Attempting to consume context on the server crashes with a specific exception:

```text title="The error when App.jsx reads UserContext with use"
Cannot use() an already resolved Client Reference.
```

### What the Server Holds When It Imports From a `'use client'` File

> [!DEFINITION]
> **A Client Reference.** [NEW] When a server module imports an export from a `'use client'` file, the bundler supplies a Client Reference rather than executable code. This placeholder object records two pieces of metadata: the module path and the export name. The server includes this reference in the serialized stream sent to the browser, where React resolves it to the real client module. The server cannot execute or inspect the reference, because the underlying implementation exists only in the client bundle (Lesson 116).

The server module holds a reference placeholder rather than the real context instance. Here is how React handles each operation:
1. **Rendering `<UserContext value={user}>`** serializes the Client Reference metadata into the server response stream alongside the provided prop value. The browser runtime receives this instruction, resolves the context export, and renders the provider.
2. **Reading context via `use(UserContext)`** commands the server runtime to inspect active context providers in memory. Because the server holds only a reference placeholder without an active provider tree, React throws the Client Reference exception. React documentation confirms that reading context with the `use` API is unsupported in Server Components.
3. **Attempting to call `useContext(UserContext)`** fails before execution begins. The server build of React omits `useContext` entirely, as demonstrated in Principle 1.

A Server Component can forward client exports as elements in the UI stream, but it cannot inspect their internal state.

```tree caption="Writing the UserContext tag vs. reading UserContext, both in App.jsx: the server can pass the export on, but cannot look inside it."
What `App.jsx` can do with the imported `UserContext`
- +Write its tag [`<UserContext value={user}>`] | The server **passes the placeholder on** to the browser | In the browser, React renders the provider, and the page **shows John**
- !Read it [`use` `useContext`] | The server would need to **look inside the context** | React **stops the page** with an error, or finds **no `useContext`** at all
```

### Why We Still Write `UserProvider`

In React 19, rendering `<UserContext value={user}>` directly produces the same visual output as wrapping it in `<UserProvider user={user}>`. However, establishing a dedicated `UserProvider` component remains the recommended pattern for two critical reasons:
1. **It adheres strictly to documented component boundaries.** React documentation specifies that Server Components should import React components or serializable prop values from client modules. A component like `UserProvider` adheres to this standard. A raw context object is neither a standard component nor serializable data.
2. **It provides an architectural foundation for client state.** If the user changes preferences later, such as toggling dark mode or editing profile names, the provider must hold state. Only component functions can call `useState` to trigger dynamic updates across subscribers.

Remember: Server Components can forward context tags to the client stream, but only Client Components can subscribe to context values.

---

## PRINCIPLE | `useContext` under the provider: every Client Component reads the same user, at any depth

> [!PRINCIPLE]
> **Principle 4: Reading Context: `CommentForm` Reads `John` With `useContext`**
>
> *Read the server value in any Client Component under the provider with plain `useContext`; keep a provider above every component that reads it.*
>
> The component that reads the context does not know where the value came from. `useContext` finds the closest provider above it, through any components in the middle, Server Components included. With no provider above, it returns the default value, and reading a field of `null` stops the page.
>
> **DO THIS:**
> ```jsx
> 'use client';
> export default function CommentForm() {
>   const user = ~useContext(UserContext)~; // UserProvider above provides John
>   return <p>Commenting as {user.name}</p>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function GalleryPage() {
>   return ~<CommentForm />~; // **WRONG:** no UserProvider above, so useContext returns null and user.name throws
> }
> ```

### The Same `useContext` Line From Lesson 28

Once the client provider receives user data, any nested Client Component accesses that record using standard context syntax:

```jsx title="src/AccountButton.jsx" startLine="1"
'use client';

import { useContext } from 'react';
import { UserContext } from './UserProvider';

export default function AccountButton() {
  const user = ~useContext(UserContext)~; // Reads the user John from the closest provider
  return <button>{user.name}</button>;
}
```

**This consumption mechanism works identical to client-only React.** The `AccountButton` component remains unaware that the user record originated from a server database query. Subscribing components observe only the delivered value, remaining completely decoupled from data sourcing details.

### `CommentForm`, Deep Inside a Server Component

The comment form accesses the authenticated user using the exact same Hook call, even though it sits nested inside `Article`, an intermediate Server Component:

```jsx title="src/CommentForm.jsx" startLine="1"
'use client';

import { useContext } from 'react';
import { UserContext } from './UserProvider';

export default function CommentForm() {
  const user = ~useContext(UserContext)~; // The same user, read one level deeper than AccountButton
  return (
    <div>
      <p>Commenting as {user.name}</p>
      <textarea />
      <button>Post</button>
    </div>
  );
}
```

```jsx title="src/Article.jsx" startLine="1"
import CommentForm from './CommentForm';

export default function Article() { // No directive: a Server Component in the middle
  return (
    <article>
      <h1>Our new park opens</h1>
      ~<CommentForm />~ {/* A Client Component inside a Server Component */}
    </article>
  );
}
```

With all components connected, the finished page displays the user identity in both locations:

```page caption="The finished news page: the account button and the comment form both read John from UserProvider."
url: news.example.com/new-park
line: [John]
heading: Our new park opens
form:
  textarea: Commenting as John |
  button: Post
console: quiet
```

The comment form resolves the user record successfully, even though its parent `Article` component cannot access context. Here is the architectural reason:
1. `UserProvider` wraps the entire page hierarchy, establishing an active context provider above both components.
2. The `useContext` Hook searches upward through parent tree nodes to find the closest matching provider. React documentation specifies that context returns the value supplied to the nearest provider above the calling component.
3. Intermediate components do not interrupt context propagation, regardless of whether they execute on the client or server. React documentation confirms that context passes transparently through all intermediate layers. The server component `Article` acts simply as another intermediate container.

From the perspective of context resolution, the header button and the nested comment form function identically. Both resolve to the same enclosing `UserProvider`.

The browser DOM inspector reflects this clean structure, rendering only native HTML tags without provider artifacts:

```dom caption="What the Elements panel shows: the button and the comment form, with no element for UserProvider."
<header>
+ <button>John</button> | note: From AccountButton
</header>
<article>
  <h1>Our new park opens</h1>
+ <div> | note: From CommentForm, inside the Server Component Article
    <p>Commenting as John</p>
    <textarea></textarea>
    <button>Post</button>
  </div>
</article>
```

### A Page With No Provider Above the Comment Form

If a Client Component consumes context without an enclosing provider, it receives the fallback default value, often causing runtime crashes. Suppose a developer places `CommentForm` inside an unauthenticated photo gallery page without rendering `UserProvider`. When a user navigates to the gallery, rendering fails immediately:
1. When no matching provider exists in the ancestor tree, `useContext` returns the default value supplied to `createContext`. Our implementation specified `null` as that default fallback. React documentation states that missing providers cause context to resolve to `defaultValue`.
2. The component attempts to evaluate `user.name`, performing property access on a `null` value.
3. The JavaScript runtime throws an uncaught `TypeError`, causing the entire client component tree to unmount.

The solution requires ensuring that `UserProvider` wraps every route containing components that consume user context. Building defensive custom consumer Hooks that throw descriptive error messages for missing providers is covered in Lesson 165.

```tree caption="AccountButton and CommentForm read the same provider at two depths; a CommentForm with no provider above it gets null."
Where a Client Component reads `UserContext`
- +In the header [`AccountButton`] | The closest provider above is **`UserProvider`** | Shows **John**
- +Inside a Server Component [`CommentForm` in `Article`] | Context **passes through `Article`** | Shows **Commenting as John**
- !With no provider above [`CommentForm` on the gallery page] | Gets the default value **`null`** | **`TypeError`** at `user.name`
```

Remember: when positioned under a provider, standard `useContext` calls resolve shared values across any depth.

---

## PRINCIPLE | `children` of the provider: a Server Component inside `UserProvider` stays on the server

> [!PRINCIPLE]
> **Principle 5: The Imports Decide: `Article` Inside `UserProvider` Stays a Server Component**
>
> *Wrap the page in the client provider from a Server Component, and pass the page as `children`; those components stay on the server, and they read server data themselves, never the context.*
>
> A provider at the top of the page does not move the page to the browser. Only the files that a `'use client'` file imports become client code. `Article` is imported by `App`, so it runs on the server, and `UserProvider` receives only its output. Because `Article` runs on the server, it cannot read the context around it.
>
> **DO THIS:**
> ```jsx
> export default async function App() {
>   const user = await db.users.get(1);
>   return <UserProvider user={user}>~<Article />~</UserProvider>; // App imports Article: it stays on the server
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> 'use client';
> ~import Article from './Article';~ // **WRONG:** the provider file pulls Article and its imports into the browser
> ```

### VS | Inside the Provider on the Screen vs. Imported by the Provider File: the imports decide where `Article` runs

Examine the JSX tree of our application. All page content, including the header and article, sits visually nested inside `UserProvider`. Because `UserProvider` is a Client Component, developers often assume the entire page becomes client-rendered. **However, visual nesting does not determine execution boundaries.** Compare two distinct ways to place `Article` within `UserProvider`:

```jsx title="App.jsx writes Article between the provider tags"
<UserProvider user={user}>
  ~<Article />~ {/* App imports Article: Article runs on the server */}
</UserProvider>
```

```jsx title="UserProvider.jsx imports Article itself"
'use client';
import Article from './Article';

export default function UserProvider({ user }) {
  return <UserContext value={user}>~<Article />~</UserContext>; // **WRONG:** Article becomes client code
}
```

Both patterns position the article inside the provider visually. But execution environments depend entirely on module import graphs rather than JSX hierarchy (Lesson 115):
1. **When `App.jsx` renders `<Article />` as a child between provider tags,** the client provider file never imports the article module. The server component `App` imports `Article`, ensuring that the article executes on the server. The provider receives only finished rendered output through `children`. React documentation explains this mechanism using their generator example, noting that the client generator never imports or executes the server component directly.
2. **When `UserProvider.jsx` imports `Article` directly,** the article module joins the client bundle along with all its transitive dependencies. React documentation clarifies that adding `'use client'` marks that file and its imported dependencies as client-side code.

Because our architecture renders `<Article />` from `App.jsx`, only three small modules ship to the browser bundle: the provider, the account button, and the comment form. The article body, root page layout, and database module remain securely on the server.

```tree caption="Article inside UserProvider on the screen vs. Article imported by UserProvider.jsx: the imports decide where it runs."
Where does `Article` run?
- +`App.jsx` imports it [`<Article />` between the provider tags] | `Article` **runs on the server** | `UserProvider` gets **only its output** in `children`
- !`UserProvider.jsx` imports it [`import Article` under `'use client'`] | `Article` and its imports **become client code** | Its code **joins the bundle** every reader downloads
```

### A Server Component Inside the Provider Still Cannot Read It

Executing on the server entails an important consequence: `Article` cannot consume the client context that surrounds it. Suppose requirements dictate displaying a personalized greeting within the article headline. A developer might attempt to consume `UserContext` directly inside `Article`:

```jsx title="src/Article.jsx" startLine="1" bad="5"
import { useContext } from 'react';
import { UserContext } from './UserProvider';

export default function Article() {
  const user = ~useContext~(UserContext); // **WRONG:** Article is a Server Component, and the copy of React on the server has no useContext
  return <h1>Hello, {user.name}</h1>;
}
```

This attempt crashes the server immediately, as described in Principle 1. Even though `Article` sits nested inside `UserProvider` in the component tree, it executes as a Server Component. Server Components cannot read context. When a Server Component requires user identity, it queries the database directly on the server:

```jsx title="src/Article.jsx" startLine="1"
import db from './db';

export default async function Article() {
  const user = ~await db.users.get(1)~; // A Server Component reads the user itself, not from context
  return <h1>Hello, {user.name}</h1>;
}
```

In this scenario, both `App` and `Article` query the database for the active user. To deduplicate multiple identical database calls during a single render pass, React provides the `cache` utility (Lesson 123).

Developers who mistakenly assume client providers turn entire subtrees into client code often make the opposite error. They avoid root-level providers entirely and manually pass user props through every intermediate Server Component down to interactive forms. This practice reintroduces cumbersome prop drilling across every layout layer.

Remember: module import graphs govern where components execute, so Server Components passed as children remain safely on the server.

---

## All 5 Principles Together

### The Complete Code

Here is the complete implementation of the authenticated news page: the database simulation module, the client provider, two Client Components that consume the user, and two Server Components.

```files title="news: the finished article page" caption="The finished news page: three Client Components in the bundle, and everything that reads the database on the server."
src/
  db.js | stand-in | Gives `db.users.get(id)`, one user for each id
  UserProvider.jsx | Client Component | Makes `UserContext` and provides `user` to its `children`
  AccountButton.jsx | Client Component | Reads the user with `useContext` and shows the name on a button
  CommentForm.jsx | Client Component | Reads the user with `useContext` and shows `Commenting as John`
  Article.jsx | Server Component | Shows the heading and renders `CommentForm`
  App.jsx | Server Component | Awaits the user and wraps the page in `UserProvider`
```

```js title="src/db.js" startLine="1"
const users = [{ id: 1, name: 'John' }];

const db = {
  users: {
    async get(id) {
      return ~users.find(user => user.id === id)~; // Plays a real database: answers with one user
    },
  },
};

export default db;
```

```jsx title="src/UserProvider.jsx" startLine="1"
'use client';

import { createContext } from 'react';

export const ~UserContext~ = createContext(null); // Principle 1: made in a client file

export default function UserProvider({ ~user~, children }) { // Principle 2: the server value arrives as a prop
  return <UserContext value={user}>{children}</UserContext>;
}
```

```jsx title="src/AccountButton.jsx" startLine="1"
'use client';

import { useContext } from 'react';
import { UserContext } from './UserProvider';

export default function AccountButton() {
  const user = ~useContext(UserContext)~; // Principle 4: the same line as in Lesson 28
  return <button>{user.name}</button>;
}
```

```jsx title="src/CommentForm.jsx" startLine="1"
'use client';

import { useContext } from 'react';
import { UserContext } from './UserProvider';

export default function CommentForm() {
  const user = ~useContext(UserContext)~; // Principle 4: read through the Server Component Article
  return (
    <div>
      <p>Commenting as {user.name}</p>
      <textarea />
      <button>Post</button>
    </div>
  );
}
```

```jsx title="src/Article.jsx" startLine="1"
import CommentForm from './CommentForm';

export default function ~Article~() { // Principle 5: imported by App, so it stays on the server
  return (
    <article>
      <h1>Our new park opens</h1>
      <CommentForm />
    </article>
  );
}
```

```jsx title="src/App.jsx" startLine="1"
import UserProvider from './UserProvider';
import AccountButton from './AccountButton';
import Article from './Article';
import db from './db';

export default async function App() {
  const user = await db.users.get(1);
  return (
    ~<UserProvider user={user}>~ {/* Principles 2 and 3: the server passes the value, never reads context */}
      <header><AccountButton /></header>
      <Article />
    </UserProvider>
  );
}
```

```page caption="The finished news page when the reader opens it."
url: news.example.com/new-park
line: [John]
heading: Our new park opens
form:
  textarea: Commenting as John |
  button: Post
console: quiet
```

### The Order in Which React Renders the Page

When a user requests the page, React first executes Server Components on the backend. Next, Client Components hydrate and render in the browser with deserialized user data ready, allowing context to distribute identity across subscribers:

```tree dir=right caption="The order in which React renders the news page: the server reads the user, the provider provides it, and two Client Components read it."
The order in which React renders the news page
- +1. `App` on the server [`await`] | Reads **John** from `db.js` | Writes `<UserProvider user={user}>` around the page
- +2. `Article` on the server [`<Article />`] | Returns the heading and a **`<CommentForm />` tag** | Its code **stays on the server**
- +3. `UserProvider` [`'use client'`] | Receives **`user`** and the finished page in **`children`** | **Provides John** to everything inside
- +4. `AccountButton` and `CommentForm` [`useContext`] | Each finds the **closest provider above** | The button shows **John**, the form shows **Commenting as John**
```

### Summary

| Principle | What the code does | What the reader sees |
| :--- | :--- | :--- |
| **1. Context made in a client file** | `createContext` runs only in `UserProvider.jsx` | The page arrives, instead of crashing the server |
| **2. The value crosses as a prop** | `App` reads the user and passes plain fields as `user={user}` | The username appears in the first page the server sends |
| **3. The server passes, never reads** | `App` renders the provider and never calls `use` or `useContext` | The page renders cleanly without server exceptions |
| **4. Plain `useContext` at any depth** | `AccountButton` and `CommentForm` read the closest provider | The username displays on the button and comment form |
| **5. `children` stay on the server** | Only `App` imports `Article` | Article server code stays out of the client bundle |

Remember the core principle of this lesson: **Context lives exclusively in the browser. The server queries the user and forwards it as a prop to a client provider, where nested Client Components read it with `useContext`.**

---

## For the Interview

> **The Interview Question:** How does context behave across the server/client boundary?

### How to Answer Clearly in 30 Seconds

Context operates strictly as a client-side feature. Server Components execute once during request handling and do not persist in memory, meaning there are no active component instances on the server for context to re-render. The server build of React omits `createContext` and `useContext`, and reading context using the `use` API is unsupported in Server Components.

The architecture cleanly divides into three phases:
1. **The server queries the data.** A Server Component awaits the authenticated record from the database.
2. **A Client Component provides the context.** A dedicated `'use client'` module initializes the context and renders the provider. The Server Component renders this provider, forwarding the data as a serializable prop and passing page content as `children`.
3. **Client Components consume the value.** Any descendant Client Component reads the value using standard `useContext`, regardless of nesting depth or intermediate Server Components.

Page content passed through `children` remains executing on the server, because module import graphs decide execution boundaries rather than JSX hierarchy. Those Server Components cannot read context directly and must fetch their own data.

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does a provider rendered from a Server Component throw?"**
   **Exceptions occur whenever a Server Component attempts to initialize or read context.** A server module that calls `createContext` fails immediately because the server build of React omits that function. A server module that calls `use(UserContext)` crashes with a `Cannot use() an already resolved Client Reference` exception. When importing from a `'use client'` file, the server holds only a Client Reference placeholder. The server can stream this placeholder to the client as a JSX tag, but cannot inspect its internals. The correct approach encapsulates context initialization inside a dedicated Client Component like `UserProvider`, passing server data through serializable props.
2. **"Does a client provider at the root make the whole app client-rendered?"**
   **No.** Components passed as `children` to a client provider remain Server Components. React documentation illustrates this with the `Copyright` and `InspirationGenerator` example: because the client provider never imports the server component directly, that component stays on the server. Only files directly or transitively imported by a `'use client'` module become client code. The client bundle includes only the provider and its direct client imports, leaving server pages on the server.
3. **"What if the browser must change the value, such as a theme the user switches?"**
   **The client provider stores state initialized from the incoming server prop.** A `UserProvider` or `ThemeProvider` initializes `useState(initialTheme)` from the server-supplied prop, mirroring the `Counter` with `initialValue` pattern in React documentation. When the user triggers an update, the state setter modifies local state, causing React to re-render all client components subscribed to that context. This ability to trigger reactive updates in browser memory is precisely why providers belong in Client Components. Optimizing those subscriber re-renders is examined in Lesson 59.

```tree dir=right caption="Interview summary: the server reads the value, a client provider provides it, and only Client Components read it."
Context across the server and client boundary
- +The server [`App.jsx`, no directive] | **Reads the value** from the database | Passes it as a **serializable prop**, and the page as **`children`**
- +The client provider [`UserProvider.jsx`, `'use client'`] | **Makes the context** and renders the provider | The place to add **state** when the browser must change the value
- !What breaks it [`createContext` `use` `useContext` on the server] | Making or reading context **in a Server Component** | The server **stops the page**, and the reader gets **no article**
```
