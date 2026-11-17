# Lecture 107: What a Server Component Can Pass to a Client Component

*(Why does a number reach the browser, while a function stops the whole page?)*

> INTERVIEW QUESTION | ❱ CORE | What can you pass from a Server Component to a Client Component?

---

## VS | A Number vs. a Function in a Prop: the number reaches the browser, the function stops the page

> When components share the same browser memory, a parent component can pass any JavaScript value to its child. **When a Server Component passes a prop to a Client Component, React must serialize that value into text on the server and reconstruct it in the browser**. You can pass serializable data, including numbers, plain objects, and dates. You cannot pass a plain function, because executable code and server closures cannot travel across the network as text.

Consider how serialization works in plain JavaScript. When you send data across the network with `fetch`, you often convert an object into a character string with `JSON.stringify`. That text string travels over the network. At the destination, `JSON.parse` reads the string and rebuilds an equivalent object in memory. Now observe what happens when an object contains a function:

```js title="Plain JavaScript: what JSON.stringify keeps, and what it drops"
JSON.stringify({ likes: 12 }); // '{"likes":12}': the number travels as text
JSON.stringify({ likes: 12, ~onLike~: () => {} }); // '{"likes":12}': the function is silently gone
```

The number 12 serializes into the characters `12`, and the receiving end reconstructs the number. In contrast, `JSON.stringify` drops the function completely. A function is executable code bound to memory closures, not inert data. No character string can capture an active closure and execute it safely on another computer.

React faces this exact boundary when a Server Component renders a Client Component. The Server Component executes on the web server. The Client Component executes inside the user browser. Every prop placed on the Client Component tag must travel across the network. React serializes each prop on the server and reconstructs it inside the browser. It uses a specialized streaming format that transfers richer data types than standard JSON. When React encounters a plain function in a prop, it refuses to drop that function silently. Instead, React throws a server render error, halting page generation.

```jsx title="Two props from a Server Component to a Client Component"
<LikeButton ~initialLikes={12}~ /> {/* A number: React writes down 12, and the browser rebuilds 12 */}
<LikeButton ~onLike={() => db.posts.like(1)}~ /> {/* **WRONG:** a function: React throws, and the page does not render */}
```

Keep this central rule in mind throughout this lesson:

**Between a Server Component and a Client Component, send data, not code. Every prop must be serializable: React writes it down on the server and rebuilds it in the browser.**

> [!DEFINITION]
> **Server Component and Client Component.** [REVIEW] A Server Component executes exclusively on the server before sending HTML to the visitor. It queries databases and reads files directly, outputting a UI description without transmitting its code to the browser bundle. A Client Component ships its code to the browser to handle user interaction, enabling local state with hooks like `useState` and event listeners like `onClick`. A Client Component file begins with the `'use client'` directive (Lesson 101).

> [!DEFINITION]
> **Serializable.** [NEW] To serialize a value is to convert an in-memory runtime value into a linear stream of bytes or characters that can travel across a network connection. A value is serializable when React knows how to encode it on the server and reconstruct an equivalent value in the browser. The official React documentation establishes this firm boundary: prop values passed from a Server Component to a Client Component must be serializable (Lesson 107).

### The Same Line of Code, Two Different Trips

In earlier lessons, you passed a callback function to a child component, such as passing a remove handler to a guest list item (Lesson 23). Compare that familiar line with a line from our blog post page:

```jsx title="A function passed as a prop: from GuestList, and from Post"
<GuestRow guest={guest} ~onRemove={handleRemove}~ /> {/* Both components run in the browser: the row calls handleRemove */}
<LikeButton initialLikes={post.likes} ~onLike={() => db.posts.like(1)}~ /> {/* **WRONG:** Post runs on the server, so React throws */}
```

Both lines pass a function prop, but the execution environments differ completely:
- In the guest list, both the list component and the row component run in browser memory. The callback function never crosses a network boundary. The child row receives the in-memory function reference directly and executes it on click.
- On the blog post page, the post component executes on the server while the like button component executes in the browser. Every prop on the like button tag must travel across the network. A number serializes easily. A function closure cannot cross.

### What Crosses, and What Does Not

The list of serializable values in React Server Components is much broader than standard JSON. The official React documentation lists these supported values:
1. **Primitives.** Primitives serialize directly: strings, numbers, booleans, `null`, and `undefined`. Big integers cross as `bigint`, and registered symbols created with `Symbol.for` cross too.
2. **Collections and binary data.** Standard arrays cross, as do built-in `Map` and `Set` collections. Typed binary buffers like `TypedArray` and `ArrayBuffer` also serialize successfully.
3. **Dates.** A `Date` object arrives in the browser as an actual JavaScript `Date` instance with all its methods intact. You do not need to convert it into a string.
4. **Plain objects.** An object created with curly braces crosses as long as all of its property values are serializable. The official React documentation calls this pattern an object initializer.
5. **JSX elements.** React elements created from Server or Client Components cross the boundary. This capability allows a Server Component to pass rendered JSX elements as `children` into a Client Component (Lesson 106).
6. **Promises.** A Server Component can pass an unresolved Promise to a Client Component, where the client reads it using the `use` hook (Lesson 71). The resolved value of the Promise must also be serializable.
7. **Server Functions.** An async function marked with `'use server'` crosses the boundary as an opaque reference rather than executable code. Principle 3 explains this mechanism.

And these values cannot cross the boundary:
1. **Plain functions.** Standard JavaScript functions, event callbacks, and closures cannot cross unless they are Server Functions or imported from a client module.
2. **Classes.** Class declarations and constructors cannot be serialized.
3. **Class instances.** Custom class instances and third-party objects cannot cross, except for the built-in types listed above. Objects created with a null prototype via `Object.create` are also rejected.
4. **Unregistered symbols.** Symbols created with the plain `Symbol` constructor without `Symbol.for` cannot cross.

```tree caption="What React can write down on the server and rebuild in the browser, and what it cannot."
What a Server Component can pass to a Client Component
- +Crosses: data [`12` `'Park Opens Today'` `{ likes: 12 }` `[1, 2]`] | Primitives, arrays, **plain objects**, `Date`, `Map`, `Set` | Also **JSX**, **Promises**, and **Server Functions**
- !Does not cross: code, and objects built by a class [`function` `class`] | **Plain functions** and **classes** | **Instances of a class** other than the built-ins, and symbols not made with `Symbol.for`
```

### What the Wrong Prop Costs

What the visitor receives depends on the value placed in the prop:
1. **A plain function.** The server render crashes immediately. React throws an error about event handlers or non-serializable values, halting the entire page render.
2. **A class instance from a database.** The server render crashes as well, rejecting the custom class prototype.
3. **An entire database row as a plain object.** The page renders without any errors. However, every field on that record, including private data like the author email address, travels across the network to every visitor.

The third case is particularly dangerous because no console error or visual defect warns you about the data leak.

### The Rule of Thumb: is it data, or is it code?

**Before placing a value on a Client Component tag, ask one question: is it data, or is it code? Data crosses. A plain function does not.**

When a Client Component needs functionality related to a server function, consider these three solutions:
1. **Call the function on the server, and pass its result.** Pass a computed string or number. This fits a formatting function that merely prepares text for display.
2. **Move the function into the Client Component file.** Define the logic directly in client code (Lesson 106). This fits local interaction logic, such as incrementing a counter in state.
3. **Mark the function with `'use server'`.** Turn it into a Server Function. The browser receives an action reference, and calling it sends a network request to the server. This fits a user action that must update data in the database.

Experienced developers watch for five classic mistakes:
1. **Passing a callback prop down as in client-only code**, assuming identical syntax means identical behavior.
2. **Assuming serializable means anything except a function**, then passing a database model instance created by a class.
3. **Removing methods from a class**, expecting the instance to cross without realizing the class prototype itself causes the failure.
4. **Passing an entire database record to save typing**, exposing unrendered sensitive fields in the client network payload.
5. **Converting a date into a string manually**, unaware that React Server Components serialize `Date` instances natively.

The rest of this lesson examines each scenario using an interactive blog post page.

## SECTION | The Blog Post with a Like Button

Open the blog post page from earlier lessons (Lesson 101). The page displays the article title, Park Opens Today, followed by a like button and its count. The count does not start at zero. Twelve readers have already liked the post, so the initial screen displays 12 likes.

```page width=text caption="The blog post page with the like count read from the database, before the tap."
heading: Park Opens Today
line: 12 likes [Like]
```

The user taps the button once, and the count increments to 13:

```page width=text caption="The same page after the user taps Like once."
heading: Park Opens Today
line: 13 likes [Like] | good
```

The count 12 originates in a database on the server. Two components divide the responsibilities:
1. **`Post` is a Server Component.** It fetches the article record from the database and renders the heading.
2. **`LikeButton` is a Client Component.** It manages local interaction state and updates the count on screen. The post component passes the initial count to the button via a prop.

```files title="blog: the post page with a database" caption="The three files of our post page: the database stand-in, one Server Component, and one Client Component."
src/
  db.js | stand-in | Plays the database: `db.posts.get(id)` returns one post
  Post.jsx | Server Component | Reads the post and renders `LikeButton`
  LikeButton.jsx | Client Component | Starts with `'use client'` and counts the likes
```

The database module acts as a stand-in for this lesson: a compact file that simulates database queries without requiring a live database server. The official React documentation uses this exact pattern when demonstrating data queries with mock helpers. To keep our focus on props, the post record stores only its title and like count.

Remember the central thesis of this lesson: **between a Server Component and a Client Component, send data, not code.**

**PRINCIPLES:** A Server Component can pass props to a Client Component, but only values that React can serialize on the server and reconstruct in the browser. Four principles follow:
1. **Principle 1: A number crosses as a number.** The like button receives its initial count exactly as it would from a client parent. Dates, plain objects, arrays, JSX elements, and Promises cross the same way.
2. **Principle 2: A plain function stops the whole page.** React throws an error while rendering the post component on the server, preventing the visitor from receiving the page.
3. **Principle 3: A Server Function crosses as a reference.** The function body stays on the server, and the browser receives an action identifier that triggers a server request when invoked.
4. **Principle 4: Pass only the fields the button uses.** Passing a class instance crashes the render. Spreading an entire database row sends private fields over the wire to every browser.

---

## PRINCIPLE | `initialLikes={post.likes}`: `LikeButton` receives the same number as from any parent

> [!PRINCIPLE]
> **Principle 1: Serializable Props: A Number Crosses as a Number**
>
> *A Server Component can pass a Client Component any value React can write down on the server and rebuild in the browser: primitives, arrays, plain objects, `Date`, `Map`, `Set`, JSX, Promises, and Server Functions.*
>
> The post component runs on the server and the like button runs in the browser, so every prop on the tag must cross the network. A number serializes cleanly into the network payload, and the button receives the number 12 just as it would from a client parent. The list of supported types is extensive, meaning you do not need to convert dates or plain objects into strings before passing them.
>
> **DO THIS:**
> ```jsx
> <LikeButton ~initialLikes={post.likes}~ /> // A number crosses as a number
> <PublishedDate ~publishedAt={post.publishedAt}~ /> // A Date crosses as a Date
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <PublishedDate ~publishedAt={post.publishedAt.toISOString()}~ /> // **WRONG:** a Date already crosses; the string only forces a new Date back in the browser
> ```

### VS | A Server Parent vs. a Client Parent: `LikeButton` receives the same 12

Consider the simplest prop that crosses the boundary: the number 12. Compare passing this number from a Server Component versus passing it from a Client Component:

```jsx title="Post.jsx: a Server Component passes 12"
export default async function Post() {
  return <LikeButton ~initialLikes={12}~ />; // LikeButton receives the number 12
}
```

```jsx title="Page.jsx: a Client Component passes 12"
'use client';

export default function Page() {
  return <LikeButton ~initialLikes={12}~ />; // LikeButton receives the number 12
}
```

Inside the like button component, the experience is identical. In both cases, the prop arrives as the number 12. The button component reads the value from its props object during render (Lesson 08). Nothing inside the child component needs to change.

What changes is the physical journey the number takes across environments. When the parent is a Client Component, both components run inside browser memory, passing values directly. When the parent is a Server Component, the two components execute in separate environments. As the official React documentation explains, passing data from a Server Component to a Client Component requires extra care because they run in different environments. Between these environments, React serializes the number on the server and reconstructs it inside the browser. That process defines serialization.

### The First Version of the Post Page

The database module defines an initial post record and provides a query method:

```js title="src/db.js" startLine="1"
const rows = {
  1: { title: 'Park Opens Today', likes: 12 },
};

export const db = {
  posts: {
    async ~get~(id) { // Returns the post with this id, as a database would
      return rows[id];
    },
  },
};
```

The post component is an async Server Component (Lesson 101). It awaits the record from the database, renders the title, and passes the count prop to the like button:

```jsx title="src/Post.jsx" startLine="1"
import { db } from './db';
import LikeButton from './LikeButton';

export default async function Post() {
  const post = await db.posts.get(1);
  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton ~initialLikes={post.likes}~ /> {/* A number: React writes down 12 */}
    </article>
  );
}
```

The like button initializes its local state with the passed prop instead of starting at zero. This naming pattern mirrors the official React documentation, where an interactive counter receives an initial value from a server parent:

```jsx title="src/LikeButton.jsx" startLine="1"
'use client';

import { useState } from 'react';

export default function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(~initialLikes~); // The state starts at 12
  return (
    <>
      <span>{likes} likes</span>
      <button onClick={() => setLikes(likes + 1)}>Like</button>
    </>
  );
}
```

When the page loads, it displays 12 likes from the database record:

```page width=text caption="The post page with the count passed from Post, before the tap."
heading: Park Opens Today
line: 12 likes [Like]
```

Each user tap updates the local state in the browser:

```page width=text caption="The same page after the user taps Like once."
heading: Park Opens Today
line: 13 likes [Like] | good
```

### VS | A Date vs. the Same Date as a String: both cross, the string is extra work

Developers accustomed to plain JSON often assume that dates must be manually formatted as strings before crossing the network. Suppose our post page displays a publication timestamp:

```jsx title="Passing a date, and passing the same date turned into a string"
<PublishedDate ~publishedAt={post.publishedAt}~ /> {/* A Date: crosses as a Date */}
<PublishedDate ~publishedAt={post.publishedAt.toISOString()}~ /> {/* A string: crosses too, then needs new Date back in the browser */}
```

Both lines transmit data successfully, but manual string conversion is unnecessary. In standard JSON, a date degrades into a plain string. In React Server Components, a date instance arrives in the browser as an actual `Date` object, because React includes dates in its supported serialization list. Converting the date to an ISO string forces the server to format text and forces the client to parse it back into a date. Lesson 135 explores how dates, maps, and sets serialize across the boundary.

Remember: serializable data crosses cleanly, and the Client Component receives it just like props from any parent.

---

## PRINCIPLE | `onLike` with a plain function: React throws, and the whole post page does not render

> [!PRINCIPLE]
> **Principle 2: Functions Across the Boundary: A Plain Function Stops the Whole Page**
>
> *A plain function cannot cross from a Server Component to a Client Component; React throws while the server renders, and the whole page fails, not only the Client Component.*
>
> A function is executable code that may capture server-only resources like database connections. React cannot serialize a live function closure into text for the browser to run, so it throws an error while rendering the post component on the server. To resolve this, use one of three established patterns: call the function on the server, move the code to the client, or mark it with `'use server'`.
>
> **DO THIS:**
> ```jsx
> <LikeButton ~likesText={formatLikes(post.likes)}~ /> // Calls the function on the server, and passes the string
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <LikeButton ~onLike={() => db.posts.like(1)}~ /> // **WRONG:** a plain function, so the post page does not render
> ```

### Saving Each Like on the Server

Currently, tapping the like button updates only the local count in the user's browser. If the user refreshes the page, the count resets to 12 because the database was never updated. We need each click to persist in the database.

First, we add a mutation function to our database module that increments the stored count:

```js title="src/db.js" startLine="5"
export const db = {
  posts: {
    async get(id) {
      return rows[id];
    },
    async ~like~(id) { // Saves one more like for this post
      rows[id].likes += 1;
    },
  },
};
```

The post component already imports the database module. A developer might try passing a callback function directly as an event prop, mimicking how client components share callbacks:

```jsx title="src/Post.jsx" startLine="4"
export default async function Post() {
  const post = await db.posts.get(1);
  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton
        initialLikes={post.likes}
        ~onLike={() => db.posts.like(1)}~ // **WRONG:** a plain function cannot cross to the browser
      />
    </article>
  );
}
```

The like button accepts the callback prop and invokes it after updating state:

```jsx title="src/LikeButton.jsx" startLine="5"
export default function LikeButton({ initialLikes, onLike }) {
  const [likes, setLikes] = useState(initialLikes);
  return (
    <>
      <span>{likes} likes</span>
      <button onClick={() => { setLikes(likes + 1); ~onLike()~; }}>Like</button> {/* Shows the new count, then saves it */}
    </>
  );
}
```

### Why the Page Stops

The post page fails to render entirely, even though the like button component contains valid syntax. The failure occurs during server-side prop serialization, before the client component ever executes in the browser. Here is the exact failure sequence:
1. The framework calls the post component on the server. The component fetches the article record and encounters the like button tag.
2. React begins serializing props to prepare the network stream for the client.
3. The count prop is a number, so React serializes 12 into the stream.
4. The callback prop is an inline arrow function closure referencing the server database. React has no valid mechanism to serialize executable code across the network, so it immediately halts and throws an error.
5. Because the error happens while rendering the server parent, the entire page generation crashes.

Here is the exact error React produces:

```text title="The error React throws while the server renders Post"
Event handlers cannot be passed to Client Component props.
  <... initialLikes={12} onLike={function onLike}>
                                ^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

The highlighted indicators point directly to the prop that failed serialization. The official React documentation states the underlying principle clearly: event handlers like `onClick` can only be defined in Client Components.

### VS | `onLike` vs. `save`: the same mistake, two messages

React tailors its error message based on the name of the prop. If a prop name begins with `on` followed by a capital letter, React assumes it is an event handler and warns that event handlers cannot be passed. If you rename that identical function prop to `save`, React generates a different error message:

```jsx title="The same function under two prop names"
<LikeButton ~onLike={() => db.posts.like(1)}~ /> {/* "Event handlers cannot be passed to Client Component props." */}
<LikeButton ~save={() => db.posts.like(1)}~ /> {/* "Functions cannot be passed directly to Client Components..." */}
```

```text title="The error React throws for a function under any other prop name"
Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  <... initialLikes={12} save={function save}>
                              ^^^^^^^^^^^^^^^
```

Although the two error messages use different phrasing, both point to the exact same architectural flaw: passing a plain function across the server-client boundary. Both crash the page. The second message explicitly highlights two valid remedies: mark the function with `'use server'`, or invoke the function to pass its return value.

### VS | Passing `formatLikes` vs. Passing What `formatLikes` Returns: only the result crosses

The second error message asks whether you intended to call the function instead of passing it. This addresses a very common oversight. Suppose our server file includes a helper function that formats a number into readable text:

```jsx title="Passing the helper vs. passing what the helper returns"
<LikeButton ~likesText={formatLikes}~ /> {/* **WRONG:** passes the function itself, and the page stops */}
<LikeButton ~likesText={formatLikes(post.likes)}~ /> {/* Calls it on the server, and passes the string "12 likes" */}
```

Notice the critical distinction between these two lines. In the first line, omitting parentheses passes the function object itself, which cannot be serialized across the boundary. In the second line, parentheses execute the function on the server during rendering. The prop receives the resulting text string, which serializes without issue. This is the first solution: execute logic on the server and pass the resulting data.

### The Quick Fix That Makes Things Worse

Faced with a serialization error, developers sometimes reach for a quick workaround: adding `'use client'` to the top of the post component file. That change forces both components into client code, matching how client-only components share callbacks.

```jsx title="src/Post.jsx" startLine="1"
~'use client';~ // **WRONG:** Post and everything it imports become client code, db.js included
import { db } from './db';
import LikeButton from './LikeButton';
```

This quick fix creates much more severe architectural problems. The `'use client'` directive marks the file and its entire chain of imports as client code (Lesson 106). The post component ceases to be a Server Component, and the page still fails to render. The post component is an `async` function, and React restricts async component definitions to Server Components. In the browser, React stops and logs an error in the console:

```text title="The error React prints when Post.jsx starts with use client"
<Post> is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.
```

Furthermore, the database module is bundled into the client download, exposing internal database logic and connection secrets to the browser. This eliminates the core benefit of Server Components: querying backend data securely on the server (Lesson 101). The proper remedy is the one suggested in the second error message: mark the mutation function with `'use server'`.

---

## PRINCIPLE | `'use server'`: the function stays on the server, and the browser gets a reference to call it

> [!PRINCIPLE]
> **Principle 3: Server Functions: A Function Marked `'use server'` Crosses as a Reference**
>
> *When a click must change data on the server, mark the function with `'use server'`; React passes the browser a reference to it, and a call from the browser sends a request to run it on the server.*
>
> A plain function cannot cross the network boundary, but persisting a like requires executing logic on the server where the database lives. A Server Function bridges this gap. Its executable code stays securely on the server. The browser receives only an action identifier that points to the function, and invoking that reference triggers an automated server request.
>
> **DO THIS:**
> ```jsx
> async function likePost() {
>   ~'use server'~; // A Server Function: crosses as a reference
>   await db.posts.like(1);
> }
> <LikeButton initialLikes={post.likes} onLike={likePost} />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <LikeButton
>   initialLikes={post.likes}
>   ~onLike={() => db.posts.like(1)}~ // **WRONG:** a plain function, so the post page does not render
> />
> ```

### Which Way Out Fits Each Function

Each of the three solutions aligns with a specific programming need:

```tree caption="Three ways to give a Client Component what a plain function would have given it."
A Client Component needs something that is a function on the server
- +1. Call it on the server and pass the result [`likesText="12 likes"`] | Fits a function that **only computes something to show** | The prop holds a **string or a number**, which crosses
- +2. Move it into client code [`setLikes` in `LikeButton.jsx`] | Fits a function about **what happens in the browser** | It is **client code** from the start, so it never crosses
- +3. Mark it `'use server'` [`likePost`] | Fits a click that must **change data on the server** | React passes a **reference**, and a call **sends a request to the server**
```

Our like button component already implements the second pattern for local visual updates. Incrementing the local count lives directly in the button file, without requiring props from the server parent. Persisting that change to the database requires the third pattern. Database updates must run on the server, so the button requires a Server Function.

> [!DEFINITION]
> **Server Function.** [NEW] A Server Function is an async function marked with the `'use server'` directive that runs on the server while remaining callable from the browser. The official React documentation explains that Server Functions allow Client Components to call async functions executed on the server. When a Server Component passes a Server Function as a prop, the browser receives an opaque reference rather than executable code (Lesson 107).

### A Server Function Inside `Post`

We define the Server Function directly inside our post component, following the canonical structure recommended in the official React documentation:

```jsx title="src/Post.jsx" startLine="4"
export default async function Post() {
  const post = await db.posts.get(1);

  async function likePost() {
    ~'use server'~; // Marks likePost as a Server Function
    await db.posts.like(1);
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton initialLikes={post.likes} ~onLike={likePost}~ /> {/* Crosses as a reference to likePost */}
    </article>
  );
}
```

The like button file remains unchanged. It continues invoking its callback prop after updating local state.

### What the Browser Receives: a Reference, Not the Code

In the browser, the callback prop does not contain the actual JavaScript source code of the function. Instead, it contains an action reference. As the official React documentation explains, your framework automatically creates a reference to the Server Function and passes that reference to the Client Component. An action reference is an opaque identifier that points to the server function endpoint, allowing the browser to request its execution. Think of it like a URL endpoint used with `fetch`. The browser does not hold the backend code behind that URL; it only knows where to dispatch the request. The implementation code, along with database credentials, remains securely on the server.

When a user taps the like button, the interface updates immediately in the browser while the database update runs on the server:
1. The like button updates its local state, immediately showing 13 likes on screen.
2. The button calls its callback prop, which holds the action reference to the server function.
3. React dispatches an automated network request to the server to invoke that function.
4. On the server, the function executes and updates the database record.

```page width=text caption="The post page after the user taps Like once: the count changed in the browser, and likePost saved the like on the server."
heading: Park Opens Today
line: 13 likes [Like] | good
```

If the user now refreshes the page, the initial render displays 13 likes because the update was successfully persisted in the database. The official React documentation recommends invoking Server Functions within a Transition. Lesson 110 explores Transitions and covers Server Functions in full detail. Here, we maintain the focused structure from the official introductory documentation.

Remember: plain functions stay strictly within their execution environment. A Server Function also executes on the server, but React provides the browser with a secure reference to trigger it.

---

## PRINCIPLE | `post.likes`, not `post`: nothing else from the database row reaches the browser

> [!PRINCIPLE]
> **Principle 4: Shape the Props: Pass Only the Fields the Client Component Uses**
>
> *Pass a Client Component only the fields it uses, as primitives or a small plain object; an instance of a class does not cross at all, and a plain copy of a database row crosses with every field in it.*
>
> Passing a custom class instance crashes the render, even if the class contains no methods, because React verifies the prototype constructor of the object. Passing a plain object copy of the entire database row crosses without error, but exposes all columns, such as private author emails, in the client network payload. Props passed to a Client Component define what the browser downloads, so extract only the specific fields required.
>
> **DO THIS:**
> ```jsx
> <LikeButton ~initialLikes={post.likes}~ onLike={likePost} /> // Only the number 12 reaches the browser
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <LikeButton ~post={{ ...post }}~ onLike={likePost} /> // **WRONG:** authorEmail reaches every reader's browser
> ```

### The Post from the Database Is an Instance of a Class

Recall how classes function in JavaScript. A class provides a blueprint for instantiating objects. Calling `new Date()` constructs an object from the built-in `Date` class. That constructed object is an instance of the class, inheriting methods like `getFullYear` from its prototype.

`Date` is a built-in standard class that React explicitly supports in its serialization protocol. Custom classes written by developers or database libraries do not have built-in support. Many database query builders and object-relational mapping tools wrap database rows in custom class instances rather than returning plain objects.

Furthermore, our database record includes an internal column that the user interface never displays: the email address of the post author.

```js title="src/db.js" startLine="1"
class ~PostRow~ { // A template for every post the database returns
  constructor(row) {
    this.title = row.title;
    this.likes = row.likes;
    this.authorEmail = row.authorEmail;
  }
  isNew() {
    return this.likes < 5;
  }
}

const rows = {
  1: { title: 'Park Opens Today', likes: 12, authorEmail: 'john@example.com' },
};
```

The database query now returns an instance of this custom class instead of a plain object:

```js title="src/db.js" startLine="16"
export const db = {
  posts: {
    async get(id) {
      return ~new PostRow(rows[id])~; // An instance of PostRow, with authorEmail inside
    },
    async like(id) {
      rows[id].likes += 1;
    },
  },
};
```

### Passing the Whole Post: `post={post}`

The like button needs the like count today, but a developer might anticipate needing the title tomorrow. To avoid writing explicit props, the developer passes the entire post object:

```jsx title="src/Post.jsx" startLine="15"
<LikeButton ~post={post}~ onLike={likePost} /> {/* **WRONG:** an instance of PostRow, so the post page does not render */}
```

If this worked, the button component would read the count from the nested property. However, React halts execution before the button ever renders in the browser. The page crashes on the server with a serialization error:

```text title="The error React throws for an object built by a class"
Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
  <... post={{title: ..., likes: 12, authorEmail: ...}} onLike=...>
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

### VS | `PostRow` with `isNew` vs. `PostRow` without `isNew`: both stop the page

A developer who recalls that functions cannot cross might suspect the class method is causing the issue. They might attempt to fix the error by deleting the method from the class definition:

```js title="PostRow with isNew, and PostRow without it"
class ~PostRow~ { constructor(row) { this.likes = row.likes; } isNew() { return this.likes < 5; } } // With isNew: an instance of a class, and the page stops
class ~PostRow~ { constructor(row) { this.likes = row.likes; } } // Without isNew: still an instance of a class, and the page still stops
```

Deleting the method changes nothing. Both versions construct an instance of a custom class, and both fail with the exact same error. React does not merely inspect whether the object contains function properties. It inspects the prototype constructor of the object. The official React documentation explicitly prohibits objects that are instances of any class other than the few supported built-ins. A custom class instance fails serialization even if it contains no methods at all.

### VS | The Instance vs. a Plain Copy `{ ...post }`: the copy crosses with every field

Next, the developer tries spreading the properties into a plain object literal using the object spread operator (Lesson 09):

```jsx title="src/Post.jsx" startLine="15"
<LikeButton ~post={{ ...post }}~ onLike={likePost} /> {/* A plain object: no error, and authorEmail goes to the browser */}
```

The serialization error disappears, but this introduces a severe data privacy vulnerability: the author email address is now transmitted to every visitor. The page renders normally and displays 12 likes, giving no hint of a problem. Here is why this occurs:
1. The spread operator copies enumerable own properties from the instance into a new object literal. Prototype methods remain attached to the class and are excluded.
2. The resulting object is a plain object literal. All copied properties are strings and numbers, so React serializes every property into the network stream.
3. The browser reconstructs the full plain object for the like button. Even though the button component only displays the like count, the author email has been downloaded into the client runtime.

The custom class instance and the spread object contain the exact same data fields, but produce opposite outcomes:
- The class instance crashes the render with an explicit error.
- The plain copy serializes without errors, silently leaking every property over the wire.

The official React documentation warns against this pattern directly, noting that a Client Component should never accept objects that carry sensitive data. Sensitive data includes any field that users should not access, such as email addresses, user IDs, or billing details. The official documentation flags passing an entire user record to a Client Component as an anti-pattern.

Note also that a plain object serializes only if all of its properties are serializable. If an object literal includes a method property, React rejects it with the function serialization error described in Principle 2.

### Pass Only What the Button Uses

The robust solution is to pass only the specific field required by the child component as a primitive value. The official React documentation provides the exact same guidance: pick off the specific properties you need for this use case.

```jsx title="src/Post.jsx" startLine="15"
<LikeButton ~initialLikes={post.likes}~ onLike={likePost} /> {/* Only the number 12 crosses */}
```

```page width=text caption="The post page with only the count passed to LikeButton: the same screen, and no email in the browser."
heading: Park Opens Today
line: 12 likes [Like]
```

On screen, the rendered output matches the previous version. The critical difference lies in what crosses the network: a single primitive number, completely isolating internal database columns from the client bundle.

```tree caption="Three ways to pass the post from the database to LikeButton, and what each one sends to the browser."
Passing the post from `Post` to `LikeButton`
- !The instance [`post={post}`] | Built by the class `PostRow` | The page **does not render**: only plain objects can be passed
- !A plain copy of the whole row [`post={{ ...post }}`] | Crosses **with no error** | `authorEmail` reaches **every reader's browser**
- +Only the field the button uses [`initialLikes={post.likes}`] | One **number** crosses | The browser gets **12**, and nothing else from the row
```

Remember: props passed to a Client Component define the exact data payload sent to the user browser. Transmit only the data your interactive component needs, and nothing more.

---

## All 4 Principles Together

### The complete code

Here is the complete implementation of our blog post page: the database stand-in, one Server Component, and one Client Component.

```files title="blog: the finished post page" caption="The finished post page: the database stand-in, one Server Component, and one Client Component."
src/
  db.js | stand-in | Builds each post with `PostRow` and saves likes with `db.posts.like`
  Post.jsx | Server Component | Reads the post, defines the Server Function `likePost`, and passes `initialLikes` and `onLike`
  LikeButton.jsx | Client Component | Starts with `'use client'`, counts the likes, and calls `onLike`
```

```js title="src/db.js" startLine="1"
class ~PostRow~ { // Principle 4: an instance of a class never crosses
  constructor(row) {
    this.title = row.title;
    this.likes = row.likes;
    this.authorEmail = row.authorEmail;
  }
  isNew() {
    return this.likes < 5;
  }
}

const rows = {
  1: { title: 'Park Opens Today', likes: 12, authorEmail: 'john@example.com' },
};

export const db = {
  posts: {
    async get(id) {
      return new PostRow(rows[id]);
    },
    async like(id) {
      rows[id].likes += 1;
    },
  },
};
```

```jsx title="src/Post.jsx" startLine="1"
import { db } from './db';
import LikeButton from './LikeButton';

export default async function Post() {
  const post = await db.posts.get(1);

  async function likePost() {
    ~'use server'~; // Principle 3: a Server Function crosses as a reference
    await db.posts.like(1);
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton ~initialLikes={post.likes}~ onLike={likePost} /> {/* Principles 1 and 4: only the number 12 crosses */}
    </article>
  );
}
```

```jsx title="src/LikeButton.jsx" startLine="1"
'use client';

import { useState } from 'react';

export default function LikeButton({ initialLikes, onLike }) {
  const [likes, setLikes] = useState(initialLikes);
  return (
    <>
      <span>{likes} likes</span>
      <button onClick={() => { setLikes(likes + 1); ~onLike()~; }}>Like</button> {/* Principle 3: sends a request to run likePost on the server */}
    </>
  );
}
```

```page width=text caption="The finished post page: the title from Post, and the count and the button from LikeButton."
heading: Park Opens Today
line: 12 likes [Like]
```

### The order in which React calls the components

React renders the post component on the server and mounts the like button in the browser. Props travel across the network from server to browser, and user actions travel back:

```tree dir=right caption="The path of the post page: Post on the server, the props across, LikeButton in the browser, and a tap back to the server."
How the post page reaches the user, and how a tap comes back
- +1. On the server [`Post`] | The framework calls `Post`; it **awaits the post** from `db.posts.get` | React **writes down `12`** and a **reference to `likePost`**
- +2. In the browser [`LikeButton`] | React **rebuilds `initialLikes` and `onLike`**, and calls `LikeButton` | The page shows **12 likes**
- +3. The user taps Like [`setLikes` `onLike`] | The count becomes **13** in the browser | React **sends a request** to run `likePost`
- +4. Back on the server [`likePost`] | `likePost` calls **`db.posts.like`** | The database **saves the like**
```

### Summary

| Value on the `LikeButton` tag | Crosses? | What the reader of the blog gets |
| :--- | :--- | :--- |
| `initialLikes={post.likes}`, a number | Yes | The page with `12 likes` |
| `publishedAt={post.publishedAt}`, a `Date` | Yes | A real date in the browser, with no conversion needed |
| `onLike={() => db.posts.like(1)}`, a plain function | No | No page: `Event handlers cannot be passed to Client Component props.` |
| `likesText={formatLikes(post.likes)}`, the result of a call | Yes | The string `12 likes` |
| `onLike={likePost}`, a Server Function | Yes, as a reference | A tap that saves the like on the server |
| `post={post}`, an instance of `PostRow` | No | No page: `Only plain objects, and a few built-ins, can be passed...` |
| `post={{ ...post }}`, a plain copy of the row | Yes, every field | The page, and the email of the author in every reader's browser |

Remember the central thesis of this lesson. **Between a Server Component and a Client Component, send data, not code. Every prop must be serializable: React writes it down on the server and rebuilds it in the browser.**

---

## For the Interview

> **The Interview Question:** What can you pass from a Server Component to a Client Component?

### How to Answer Clearly in 30 Seconds

"Server Components and Client Components execute in different environments, meaning every prop passed between them must be serializable so React can stream it across the network. Three clear rules govern this boundary:
1. **Data crosses.** Primitives, arrays, plain object literals, `Date` objects, `Map`, `Set`, JSX elements, and unresolved Promises all serialize cleanly, and the Client Component receives them like ordinary props.
2. **Plain functions cannot cross.** Passing a callback or event handler stops rendering with an error. To handle logic, compute the value on the server and pass data, or manage local interaction in client state. When a click must persist data on the server, mark the mutation with `'use server'` so React passes an action reference that triggers a server request.
3. **Class instances fail, and entire rows leak data.** Custom class instances fail serialization, even without methods. Spreading an entire database record crosses without error, but leaks private columns over the wire. Always shape props to pass only the specific fields the Client Component requires."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What does serializable mean here? Is it the same as JSON?"**
   Serialization here means React can encode the runtime value into its streaming RSC payload on the server and reconstruct an equivalent value inside the browser. It is not limited to standard JSON. React natively serializes richer types including `Date` instances, `Map`, `Set`, typed arrays, and unresolved Promises. A Promise can stream across the network before resolving. The Client Component reads it with the `use` hook, provided the eventual resolved value is also serializable.
2. **"Why can't you pass a function, and what do you do instead?"**
   A function is executable code that captures execution context and server closures, such as private database connections. React cannot serialize arbitrary closures into client-side code, so it throws an error. If the prop name begins with `on` followed by a capital letter, React warns that event handlers cannot be passed. For any other name, it warns that functions cannot cross unless marked with `'use server'`. To solve this, compute display data on the server, keep client logic inside the Client Component, or mark backend mutations with `'use server'` to pass a callable reference.
3. **"Can you pass a whole object from the database?"**
   If the object is an instance of a custom class or ORM model, React halts serialization with an error because custom class prototypes are not supported. If you convert the record into a plain object literal, React serializes it successfully, but this introduces a security vulnerability. Every field on the record, including sensitive or private columns like email addresses and internal tokens, is transmitted in the network payload and exposed in browser DevTools. Instead of spreading database records, explicitly extract and pass only the specific fields the Client Component needs.

```tree dir=right caption="Interview summary: what a Server Component can pass to a Client Component, and what to do with the rest."
Props from a Server Component to a Client Component
- +Data [`12` `{ likes: 12 }` `Date` `<p>` `Promise`] | React **writes it down and rebuilds it** | The Client Component receives it **as from any parent**
- !A plain function [`onLike`] | ~Do **NOT** pass code | +**DO** call it on the server, move it to client code, or mark it `'use server'`
- !A class instance or a whole row [`post={post}`] | Instance: **the render stops**; plain row: **every field leaks** | +**DO** pass only the fields the component uses
```
