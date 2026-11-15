# Lecture 63: What the React Compiler Writes into Your Components, and How to Turn It On Safely

*(How do the rows of a list stop rendering on every keystroke when nobody writes `memo` or `useCallback`?)*

> INTERVIEW QUESTION | ❱❱ MORE | What does the React Compiler do, and when should you adopt it?

---

## VS | The File We Write vs. the Code the Browser Runs: the same `ChatRoom.jsx`, only the compiled version keeps a cache

> When a user types into a chat field, every keystroke triggers a state update in the parent chat room. Without optimization, the entire component tree renders again, re-evaluating every message row even when message data remains untouched. **The React Compiler automatically transforms your components during the build step, inserting a fine-grained memoization cache that returns previously generated JSX whenever inputs remain unchanged.** Writing `memo` and `useCallback` by hand introduces boilerplate and fragile dependency lists. The compiler automates this caching across plain code, provided your components obey the Rules of React.

You already rely on a compiler during everyday web development. Web browsers cannot execute JSX syntax directly. When you write markup in a JSX file, your bundler converts that markup into standard JavaScript function calls before sending files to the browser:

```jsx title="What we write in MyApp.jsx"
export default function MyApp() {
  return ~<div>Hello World</div>~; // JSX: the browser cannot read this line
}
```

```js title="What Vite sends to the browser"
import { jsx as _jsx } from "react/jsx-runtime";
export default function MyApp() {
  return ~_jsx("div", { children: "Hello World" })~; // Plain JavaScript: a call to a function that React provides
}
```

The source code in your editor and the JavaScript executing in the browser are already two distinct representations. The React Compiler inserts an additional transformation step into that build pipeline. It analyzes your components and custom Hooks, generating compiled functions equipped with an internal cache. When a component re-renders, the compiled code inspects its inputs. If dependencies remain identical, the function returns previously generated values and JSX elements rather than creating new objects in memory.

In earlier lessons, skipping redundant work required manual optimization: wrapping components in `memo`, stabilizing callback references with `useCallback`, and maintaining dependency arrays by hand (Lessons 55 to 57). The React Compiler inserts equivalent memoization directly into your compiled output. The official documentation describes this automated output as the equivalent of manual memoization.

Keep one guiding rule in mind throughout this lesson: **the file you write in your editor and the code executing in the browser are two different things.** The compiler transforms only the second one.

### The Same Chat Room, Built Twice

In a typical chat application, existing messages remain displayed while the user types a reply into an input field below. Each keystroke updates local text state, prompting React to re-render the parent chat container. By default, re-rendering the parent cascades down to evaluate every message row in the list (Lesson 54).

Consider a chat room displaying three messages, each with a Delete button, accompanied by a text field and a Send button. Each component logs a line to the console upon rendering. In development, our application runs inside `<StrictMode>`, which deliberately invokes components twice on render to surface side effects (Lesson 47):

```page width=text caption="The chat room when the page opens: three messages, an empty message field, a Send button, and two lines in the Console for each component."
line: Hi! [Delete]
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  |
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Lunch at 12?
log: Message rendered: Lunch at 12?
log: Message rendered: Sure
log: Message rendered: Sure
```

The component source files remain straightforward. Neither file imports `memo` or `useCallback`:

```jsx title="src/components/Message.jsx"
export default function Message({ text, onDelete }) {
  ~console.log('Message rendered:', text);~ // Prints one line each time this row renders
  return (
    <li>
      {text} <button onClick={onDelete}>Delete</button>
    </li>
  );
}
```

```jsx title="src/components/ChatRoom.jsx"
import { useState } from 'react';
import Message from './Message.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  ~console.log('ChatRoom rendered');~ // Prints one line each time the chat room renders

  function handleDelete(id) {
    setMessages(messages.filter(m => m.id !== id));
  }

  function handleSend() {
    setMessages([...messages, { id: crypto.randomUUID(), text }]);
    setText('');
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> // A new arrow function for each row, on every render
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

We clear the console logs. The user then types the letter `O` into the message field:

```page width=text caption="The chat room after the user types O, built without the compiler: the chat room and all three rows render again."
line: Hi! [Delete]
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  | O
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Lunch at 12?
log: Message rendered: Lunch at 12?
log: Message rendered: Sure
log: Message rendered: Sure
```

This outcome reflects default React behavior: a single keystroke triggers a state change in the parent, forcing every child row to re-render even though message data did not change (Lessons 54 to 57).

Now we modify a single configuration file without altering any component code. In the Vite configuration file, we enable the React Compiler plugin:

```js title="vite.config.js"
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    ~babel({ presets: [reactCompilerPreset()] })~, // Runs the React Compiler while Vite builds the app
  ],
});
```

The source files for the chat room and message rows remain completely untouched. We restart the development server, clear the console, and type the letter `O` into the input field once more:

```page width=text caption="The same chat room after the user types O, built with the compiler: only the chat room renders."
line: Hi! [Delete]
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  | O
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
```

**The parent chat room renders, but the three message rows do not render at all.** The parent component re-renders because its local input state updated. The child rows remain completely still, even though we never added `memo` or `useCallback` to our source code.

**It may look the same, but it is NOT the same thing!** The source files in your editor match across both builds, but the code delivered to the browser differs fundamentally. During the second build, the React Compiler analyzed both components and generated optimized functions equipped with an internal cache. Each compiled function remembers the JSX elements returned from the previous render. If the inputs for an element do not change, the compiled code returns the cached element reference directly.

```tree caption="The same two component files, built without the React Compiler and built with it."
The same `ChatRoom.jsx` and `Message.jsx`, built two ways
- !Built without the compiler | The browser runs **the functions we wrote** | Every keystroke renders **all three rows** again
- +Built with the compiler [`reactCompilerPreset`] | The browser runs **the functions the compiler wrote**, each with a cache | Every keystroke renders **only `ChatRoom`**, and the rows are **reused**
```

### Three Words for This Lesson

> [!DEFINITION]
> **What is a compiler?** [NEW] A compiler is a build-time program that reads human-written source code and transforms it into executable code for runtime environments. Vite already compiles JSX tags into standard function calls. The React Compiler operates as an additional build step: it analyzes components and Hooks, outputting specialized JavaScript that manages an internal cache to reuse JSX elements and calculated values whose inputs have not changed (Lesson 63).

> [!DEFINITION]
> **What is build time?** [NEW] Build time refers to the preprocessing phase when bundlers like Vite package and transform source files before shipping them to the client. Operations occurring at build time, such as converting JSX to JavaScript or injecting compiler caches, complete before runtime code executes in the browser. The official React documentation describes the compiler as an automated build-time optimization tool (Lesson 63).

> [!DEFINITION]
> **What is memoization?** [REVIEW] Memoization is an optimization technique that caches the return value of a computation and returns that cached result whenever identical inputs recur. In standard React, `memo` skips re-rendering a component when props remain unchanged, `useMemo` caches computed values, and `useCallback` preserves stable function references across renders (Lessons 55 to 57).

### What Is at Stake

Two primary concerns drive this architectural change: input responsiveness on active interfaces and the maintenance overhead of manual memoization.
1. **Responsiveness.** In a chat interface with hundreds of messages, rendering every row on each keystroke blocks the main browser thread. When child rows involve complex markup, typing feels sluggish and keystrokes lag.
2. **Maintenance overhead.** Manually optimizing with `memo` and `useCallback` requires strict adherence to dependency lists. A single inline callback or unmemoized object prop invalidates child memoization completely (Lessons 55 to 57). The React documentation highlights that manual memoization adds tedious maintenance burdens.
3. **Automated performance.** With the React Compiler active, unchanged child rows skip rendering automatically while source code remains concise and readable.
4. **The architectural constraint.** The compiler assumes that components obey the Rules of React. When a component violates purity or mutates state in place, caching its output can freeze stale data on the screen.

Developers frequently make assumptions in five critical areas:
1. They assume the compiler operates as a client-side library or runtime Hook. It executes strictly as a build-time transformation tool.
2. They immediately delete every memoization wrapper and Hook across their project. The documentation recommends leaving established memoization in place until thorough testing confirms safe removal.
3. They assume the compiler repairs impure code. The compiler bails out when it detects rule violations, and it can compile code containing undetected impurities, leading to stale user interfaces.
4. They expect the compiler to accelerate initial page loads. The compiler optimizes re-render performance for active components rather than initial asset downloads or hydration.
5. They enable the compiler globally across large existing codebases in a single commit, without prior linting or test verification.

### Four Ways to Stop Rows from Rendering on Every Keystroke

When child components re-evaluate repeatedly despite receiving unchanged data, teams have four architectural approaches:

```tree caption="Four ways to deal with rows that render again on every keystroke, and when each one fits."
Four ways to deal with rows that render on every keystroke
- +1. Leave it and measure first | Fits when the user feels **no lag** | React's docs: "React is often fast enough without optimization"
- +2. Move state down or pass JSX as `children` [`children`] | Fits when the fast-changing state can live **lower in the tree** | Lesson 58
- +3. `memo`, `useMemo`, and `useCallback` by hand [`memo` `useCallback`] | Fits an app that **cannot use the compiler yet**, and a few places that need **precise control** | Lessons 55 to 57
- +4. The React Compiler [`reactCompilerPreset`] | Fits **new apps from the first day**, and existing apps that follow the Rules of React, **turned on step by step** | This lesson
```

The React documentation explicitly encourages teams to adopt the compiler for modern applications. Future framework capabilities may also rely on the compiler to operate efficiently.

### The Rule of Thumb: does the component give the same JSX for the same props and state?

**Write straightforward component code and preserve render purity. The compiler safely reuses cached JSX only because it assumes identical props and state always yield identical output.**

## SECTION | The Chat Room from Lesson 57

We examine the chat application introduced in earlier chapters (Lessons 55 to 57). The interface supports three user interactions: typing into the message input, submitting a new message, and deleting an existing row. The `ChatRoom` component manages two state variables: one holds the message list, and one holds the current text draft.

The application contains the following file structure. The entry point mounts `App` inside `<StrictMode>` (Lesson 07). `App` renders the parent chat container, and the build configuration directs Vite to compile the project:

```files title="chat-room: File Explorer" caption="How the files of our chat room sit in the project folder, inside src/ and inside src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
vite.config.js | build | Tells Vite how to build the app; the compiler is turned on here
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<ChatRoom />`
  components/
    ChatRoom.jsx | state | Holds `messages` and `text`, and renders one `<Message>` per message
    Message.jsx | child | Exports `Message` as default: one row with its text and a Delete button
```

The introductory demonstration used plain files to contrast runtime behavior. Our project begins at the state established in Lesson 57, utilizing manual memoization. The `Message` component is wrapped in `memo`. The deletion callback originates from `useCallback`, providing a stable function reference to each row across renders:

```jsx title="src/components/Message.jsx"
import { memo } from 'react';

const Message = ~memo~(function Message({ id, text, onDelete }) { // Skips this row when id, text, and onDelete are the same
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
});

export default Message;
```

```jsx title="src/components/ChatRoom.jsx"
import { useCallback, useState } from 'react';
import Message from './Message.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  console.log('ChatRoom rendered');

  const handleDelete = ~useCallback~((id) => { // The same function on every render
    setMessages(ms => ms.filter(m => m.id !== id));
  }, []);

  function handleSend() {
    setMessages([...messages, { id: ~crypto.randomUUID()~, text }]); // A new random id from the browser, not nextId++
    setText('');
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} id={m.id} text={m.text} onDelete={handleDelete} />
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

One implementation detail differs from Lesson 57. The send handler generates identifiers using the standard crypto `randomUUID` helper rather than mutating an external module-level counter variable. Mutating variables declared outside component scope violates functional purity expectations and triggers compiler bailouts. When the compiler encounters an unhandled external mutation, it safely skips compiling the enclosing component without raising a build error. If that occurred, the chat room would run uncompiled, re-rendering child rows on every keystroke.

By the conclusion of this lesson, both component files return to plain, unmemoized code, with the compiler handling caching automatically.

**PRINCIPLES:** The source code in your editor and the executable code delivered to the browser represent two separate layers. The React Compiler generates the executable layer at build time, inserting caching logic that preserves JSX elements and computed values whose inputs remain unchanged. This automation operates reliably only when source code conforms to the Rules of React. Four principles guide adoption:
1. **Principle 1: `reactCompilerPreset` Adds a Cache to Each Component at Build Time.** Enabling the preset in build settings activates compilation without modifying source components. The browser executes transformed functions that store and reuse JSX trees across renders.
2. **Principle 2: A Plain `ChatRoom` Keeps the Rows Still Without `memo` or `useCallback`.** When compiled, plain components avoid redundant child re-renders during input events. Pre-existing manual memoization remains untouched until automated test suites verify parity.
3. **Principle 3: `Date.now()` in `Message` Freezes the "min ago" Label.** The compiler bails out when it recognizes violations of React rules. Undetected impurities cause compiled components to serve stale values from cache.
4. **Principle 4: `"use memo"` Lets a Team Compile One Component at a Time.** New projects enable the compiler on day one. Existing applications execute lint audits first, adopting the compiler incrementally across specific components, directories, or user segments.

---

## PRINCIPLE | `reactCompilerPreset` in `vite.config.js`: every component gets a cache when Vite builds the app

> [!PRINCIPLE]
> **Principle 1: `reactCompilerPreset` Adds a Cache to Each Component at Build Time**
>
> *Turn the React Compiler on in the build config; it rewrites each component and Hook when the app is built, and our source files stay exactly as we wrote them.*
>
> Without the compiler, a component creates its JSX again on every render. With it, the browser runs a version the compiler wrote, which gets a cache from `react/compiler-runtime` and returns the stored JSX while its inputs stay the same. Nothing in our components calls the compiler, so we see it in only three places: the build config, the build output, and the Memo badge in React Developer Tools.
>
> **DO THIS:**
> ```js
> export default defineConfig({
>   plugins: [react(), ~babel({ presets: [reactCompilerPreset()] })~], // The compiler runs at build time
> });
> ```
>
> **DO NOT DO THIS:**
> ```js
> export default defineConfig({
>   plugins: [react(~{ babel: { plugins: ['babel-plugin-react-compiler'] } }~)], // **WRONG:** version 6 of the Vite plugin for React removed this inline babel option
> });
> ```

### A Cache in Plain JavaScript

To avoid redundant operations in plain JavaScript, you store calculation results in a variable. On subsequent invocations, you inspect that variable, computing a new result only when no prior value exists:

```js title="Plain JavaScript: build the result once, then hand back the stored one"
let cached;

function getGreeting() {
  if (~cached === undefined~) { // Nothing stored yet: build it now
    cached = buildGreeting();
  }
  return cached; // Every later call: the stored result
}
```

The storage variable functions as a cache, and the conditional statement serves as a cache check. The React Compiler injects this exact caching mechanism into components around individual JSX expressions and computations.

### The Smallest Component, Compiled

React documentation demonstrates compiler mechanics using a minimal component returning a single container:

```jsx title="MyApp.jsx: the smallest component in React's docs"
export default function MyApp() {
  return ~<div>Hello World</div>~; // Creates a new div element on every render
}
```

When compilation is active, the bundler ships transformed JavaScript rather than original source text. The generated output reveals the exact cache structure inserted by the compiler:

```js title="Build output: MyApp after the React Compiler"
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = ~_c~(1); // Gets this component's cache from React
  let t0;
  if (~$[0] === Symbol.for("react.memo_cache_sentinel")~) { // The cache check: is anything stored here yet?
    t0 = <div>Hello World</div>;
    ~$[0] = t0;~ // First render: stores the new div in the cache
  } else {
    ~t0 = $[0];~ // Every later render: takes the div stored last time
  }
  return t0;
}
```

This transformed output mirrors the manual caching pattern shown earlier. Step by step, runtime execution proceeds as follows:
1. The component invokes `_c` with an argument indicating the required slot count, receiving a dedicated cache array named `$`. Here, the array holds a single slot, `$[0]`.
2. During the initial render, `$[0]` contains an uninitialized sentinel value created with `Symbol.for`. This sentinel denotes an empty cache slot. The condition evaluates to true, so the component creates the element and assigns it to `$[0]`.
3. During subsequent renders, `$[0]` already stores the previously instantiated element. The condition evaluates to false, allowing the function to skip element creation and return the cached reference directly.

**It may look the same, but it is NOT the same thing!** The browser displays identical markup either way. However, original source code produces a brand new React element on every execution. Transformed code produces that element once on mount, returning the cached reference thereafter. The conditional statement represents a **cache check**: before producing JSX, the compiled code verifies whether stored output remains valid for the current inputs.

```tree caption="The function we write versus the function the compiler writes for the browser."
Two versions of `MyApp`
- !The file we write [`return <div>Hello World</div>`] | Runs the same way **on every render** | Creates a **new `<div>`** each time
- +The build output [`$[0]` `t0`] | Asks the **cache** first | Creates the `<div>` **once**, then returns **the stored one**
```

Three identifiers in the build output never exist in source files. The compiler generates all three automatically:
1. **`_c`** represents the cache allocation function imported from `react/compiler-runtime`. React 19 exposes this runtime export alongside standard JSX helpers.
2. **`$`** represents the memoization cache array returned by `_c`. Each mounted component instance receives its own isolated cache.
3. **`t0`** represents an internal variable declared by the compiler to hold intermediate JSX results.

Developers never invoke compiler functions directly. You do not import custom Hooks or configure runtime listeners. Because these transformations occur entirely at build time, a developer inspecting only source code cannot see why a component skips rendering.

### The Compiler Turned On in Our Chat Room

The compiler core resides in the package `babel-plugin-react-compiler`. **Babel** parses JavaScript and produces transformed syntax, with the React Compiler executing as a dedicated plugin. For Vite projects using modern versions of `@vitejs/plugin-react`, installation requires two packages:

```bash title="Terminal"
npm install -D babel-plugin-react-compiler@latest
npm install -D @rolldown/plugin-babel
```

The `-D` flag installs these packages as development dependencies, ensuring they remain part of build tooling without inflating production client bundles. The companion package `@rolldown/plugin-babel` executes Babel transformations inside the Vite build lifecycle.

Next, the project configuration incorporates the compiler preset:
1. **`reactCompilerPreset`** is exported by the Vite React plugin. A preset bundles preconfigured Babel settings, including compiler options.
2. **`babel`** runs that preset during build compilation.

```js title="vite.config.js" good="8"
import { defineConfig } from 'vite';
import react, { ~reactCompilerPreset~ } from '@vitejs/plugin-react'; // Provided by the Vite plugin for React
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    ~babel({ presets: [reactCompilerPreset()] })~, // Runs the compiler on every component and Hook
  ],
});
```

Legacy documentation frequently passed compiler settings through an inline `babel` configuration on `react()`. Version 6 of the Vite React plugin deprecated that inline property, establishing dedicated Babel plugins as the modern standard.

At this stage, our component files still contain the manual memoization from Lesson 57. The rendered interface displays identical DOM elements, and console output shows no new warnings. The architectural transition exists entirely in the generated code sent to the client.

### Mistake: The Compiler Turned On in a React 18 App

Importing `react/compiler-runtime` causes errors in applications running React 18:
1. A team using React 18 installs the compiler while retaining the default `target` configuration, which defaults to React 19.
2. Transformed files attempt to import `react/compiler-runtime`, an entry point that does not exist in React 18 core packages.
3. The application crashes during startup, with bundlers reporting that `./compiler-runtime` is not exported from `react`.

Resolving this incompatibility requires two adjustments. First, install the standalone runtime polyfill as a standard production dependency, since the client requires it at runtime:

```bash title="Terminal"
npm install react-compiler-runtime@latest
```

Then configure the compiler target to match React 18:

```js title="vite.config.js"
babel({
  presets: [reactCompilerPreset({ ~target: '18'~ })], // Compiled files import from react-compiler-runtime
}),
```

Remember the distinction: source files and runtime bundles remain separate. When the compiler is active, the runtime bundle imports dependencies that you never declared in your original source code.

---

## PRINCIPLE | `ChatRoom` without `memo` or `useCallback`: the compiled version still skips the rows on every keystroke

> [!PRINCIPLE]
> **Principle 2: A Plain `ChatRoom` Keeps the Rows Still Without `memo` or `useCallback`**
>
> *With the compiler on, write new components plain; keep the `memo`, `useMemo`, and `useCallback` already in the code, or remove them only after testing.*
>
> Without the compiler, every keystroke renders every row, and only `memo` with a stable function from `useCallback` stops it. With the compiler, the compiled `ChatRoom` returns the same `<Message>` elements while `messages` stays the same array, so React skips the rows, even with an arrow function on the tag. `useMemo` and `useCallback` remain an escape hatch for values that must stay the same, such as an Effect dependency.
>
> **DO THIS:**
> ```jsx
> function handleDelete(id) {
>   setMessages(messages.filter(m => m.id !== id));
> }
> <Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> // The compiler reuses this element while messages stays the same
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const options = ~{ serverUrl, roomId }~; // **WRONG:** its useMemo was deleted on day one, so the Effect below may now fire at other moments
> useEffect(() => {
>   const connection = createConnection(options);
>   connection.connect();
>   return () => connection.disconnect();
> }, [options]);
> ```

### Why Plain Rows Skip a Keystroke

Consider an unmemoized row rendered with an inline arrow function:

```jsx title="A plain row, and a new arrow function on its tag"
export default function Message({ text, onDelete }) {
  return <li>{text} <button onClick={onDelete}>Delete</button></li>;
}

<Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> {/* A new function on every render of ChatRoom */}
```

Developers accustomed to standard React anticipate that omitting `memo` and `useCallback` causes every child row to re-render whenever parent state changes. In an uncompiled project, that assumption holds true. In a compiled project, child rows remain untouched.

**The rows do not re-render because the compiled parent returns the exact same cached element instances from the previous render.** Step by step, the runtime sequence unfolds as follows:
1. The user types `O` into the text input. The state updater modifies `text`, prompting React to re-render `ChatRoom`. The console outputs `ChatRoom rendered`.
2. When execution reaches the message list, the compiler cache check evaluates dependencies. The cache check verifies whether the `messages` array has mutated. Because typing updates only `text`, the reference to `messages` remains identical in memory.
3. The compiled parent retrieves and returns the previously generated `<Message>` React element objects, preserving the cached callback references inside them.
4. React reconciles the tree. When React encounters an identical element object reference where previous and next elements match by reference, its reconciler bails out, skipping child execution entirely. No row console logs appear.

No manual source code cached these elements. The compiler wrapped the mapping transformation in a cache check, detecting that array inputs were stable and reusing previously created JSX element objects.

### VS | `memo` with `useCallback` vs. Plain Code with the Compiler: the same quiet rows, stopped in two different places

Compare two implementations of `ChatRoom` running under the React Compiler: one using manual memoization, and one using plain JavaScript.

::: row caption="Two versions of the chat room, both built with the compiler, after the user types O."
::: col title="With memo and useCallback" tag="React compares the props" tone=good
```jsx title="ChatRoom.jsx"
const handleDelete = ~useCallback~((id) => { // Kept the same by hand
  setMessages(ms => ms.filter(m => m.id !== id));
}, []);

<Message key={m.id} id={m.id} text={m.text} onDelete={handleDelete} />
```
Wrapping the component in `memo` forces React to perform shallow comparisons across every prop before executing the child.
:::
::: col title="Plain" tag="the compiler reuses the element" tone=good
```jsx title="ChatRoom.jsx"
function handleDelete(id) {
  setMessages(messages.filter(m => m.id !== id));
}

<Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> // Reused while messages stays the same
```
The compiled parent hands React the identical element reference allocated during the previous render.
:::
:::

**During typing, both implementations yield identical console output: `ChatRoom rendered` logs once, while child rows log nothing.** The official documentation states that compiler optimizations match or exceed manual memoization accuracy, performing the structural equivalent of `React.memo`.

The critical distinction lies in where execution halts:
1. **With manual `memo`**, evaluation proceeds to the child boundary, where React inspects incoming props one by one. To prevent re-rendering, developers must manually stabilize callback identities using `useCallback` and accurate dependency arrays.
2. **With the React Compiler**, the parent component reuses the cached element directly, halting reconciliation before prop inspection occurs. Consequently, plain code requires no manual dependency arrays.

```tree caption="Two ways the rows skip a keystroke: memo by hand, and the cache the compiler writes."
How the rows skip a keystroke
- +With `memo` and `useCallback` [`memo` `useCallback`] | We write the memoization **by hand** | React **compares the props** of each row, so every prop must stay the same
- +Plain, with the compiler [`reactCompilerPreset`] | The compiler writes the memoization **at build time** | `ChatRoom` returns **the stored element**, so the row gets nothing new
```

### The Memo Badge: Which Components Were Compiled

Source code appears identical whether a component was transformed by the compiler or left in its original form. To verify compiler activity in development, open React Developer Tools. The component tree displays a distinctive badge labeled Memo accompanied by a sparkle icon next to optimized components.

In our unmemoized project, both components display this badge despite omitting manual `memo` wrappers. Inspecting this badge in developer tooling confirms compilation status directly without inspecting build bundles.

### What the Compiler Speeds Up

The React documentation emphasizes that compiler memoization targets **update performance**: expediting re-renders for components currently mounted on screen. It does not directly reduce initial bundle download sizes or speed up initial page hydration. It optimizes two primary scenarios:
1. Skipping child component re-renders when relevant props and contextual dependencies remain identical.
2. Skipping expensive calculations within component bodies or custom Hooks, automating the role of `useMemo` (Lesson 56).

Two architectural boundaries apply:
1. The compiler targets only React components and custom Hooks, ignoring arbitrary utility functions in your codebase.
2. Cache allocations remain local to individual component instances. Caching is not shared across instances, meaning an intensive operation invoked in ten distinct components executes at least once per mounted component.

### The `memo`, `useMemo`, and `useCallback` Already in the Code

The compiler integrates seamlessly with pre-existing memoization constructs:
1. It preserves explicit `memo` wrappers around components.
2. It replaces manual `useMemo` and `useCallback` calls with its own internal cache checks.
3. If internal analysis cannot guarantee stability equivalent to manual annotations, the compiler skips transforming the component.

**For new development**, documentation recommends relying primarily on compiler automation. Manual `useMemo` and `useCallback` remain available as an **escape hatch** when developers require explicit, fine-grained control over reference stability. A common scenario involves preserving exact object identities passed into `useEffect` dependency arrays (Lesson 37).

**For established codebases**, documentation provides two recommendations:
1. Retain existing manual memoization, as indiscriminate removal may alter compiler optimization decisions.
2. Strip manual memoization only after validating behavior through comprehensive automated tests.

For `memo` wrappers specifically, documentation indicates they can be safely removed once compiler optimizations are verified.

### Mistake: Every `useMemo` Deleted on the First Day

Prematurely removing all manual memoization introduces subtle regressions:
1. A team enables the compiler in an existing project containing established `useMemo` and `useCallback` instances.
2. Developers immediately perform global search-and-replace removals, deleting all manual memoization under the belief that compiler automation replaces every instance.
3. A deleted `useMemo` call previously stabilized an options object supplied to a `useEffect` dependency array.
4. The compiler memoizes that object according to broader component heuristics, causing the Effect to re-execute on unexpected cycles. Common symptoms include runaway network requests, infinite re-render loops, or missed updates.

Because the Effect code was never touched directly, diagnosing the root cause proves difficult. Mitigate this risk by leaving established memoization intact, stripping manual annotations incrementally alongside regression testing.

### The Chat Room Becomes Plain

In our chat application, no side effects depend on callback references, meaning removing `memo` and `useCallback` introduces zero side effects. We restore both components to clean, idiomatic JavaScript:

```jsx title="src/components/Message.jsx"
export default function Message({ text, onDelete }) {
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <button ~onClick={onDelete}~>Delete</button> {/* No memo: the compiled ChatRoom decides when this row renders */}
    </li>
  );
}
```

```jsx title="src/components/ChatRoom.jsx" startLine="15"
  function ~handleDelete~(id) { // A plain function: no useCallback, no dependency list
    setMessages(messages.filter(m => m.id !== id));
  }
```

```jsx title="src/components/ChatRoom.jsx" startLine="27"
        {messages.map(m => (
          <Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> // The arrow function knows the id, so the row passes nothing back
        ))}
```

---

## PRINCIPLE | `Date.now()` during render: the compiler reuses the row, so the "min ago" label stops changing

> [!PRINCIPLE]
> **Principle 3: `Date.now()` in `Message` Freezes the "min ago" Label**
>
> *The compiler assumes pure components, props and state never changed in place, and Hooks at the top level; keep render pure, and let `eslint-plugin-react-hooks` show every break.*
>
> When the compiler sees a component break the Rules of React, such as a Hook called inside a condition, it skips that component quietly and keeps compiling the rest, so the page shows no error. When it cannot see the break, as with `Date.now()` during render, it compiles the component anyway, and reused output can show old information, such as a "min ago" label that stops changing. The fix is pure render: read the clock in an interval, keep the time in state, and pass the minutes as a prop.
>
> **DO THIS:**
> ```jsx
> const id = ~setInterval(() => setNow(Date.now()), 60000)~; // The clock is read outside render, once a minute
> <Message key={m.id} text={m.text} minutes={Math.floor((now - m.sentAt) / 60000)} onDelete={() => handleDelete(m.id)} />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const minutes = Math.floor((~Date.now()~ - sentAt) / 60000); // **WRONG:** reads the clock during render; the label goes stale once the row is reused
> ```

### What the Compiler Trusts: the Rules of React

Revisit the core mechanics of the compiler cache check. The compiled component returns cached JSX whenever inputs match prior renders. That optimization assumes that identical inputs invariably generate identical JSX. If a component produces different output for the same props and state, serving cached JSX corrupts user interface state.

The official documentation codifies these expectations as the **Rules of React**:
1. **Components and Hooks must remain pure.** Identical props and state must yield identical JSX, with side effects executing strictly outside the render phase (Lesson 14). Props and state objects must never be mutated directly (Lessons 17 and 19).
2. **React controls component and Hook execution.** Applications declare element trees such as `<Message />`, permitting React to invoke component functions. Developers must never call component functions directly (Lesson 04).
3. **Hooks obey ordering constraints.** Hooks must be invoked unconditionally at the top level of component functions, never nested inside conditional branches or loops (Lesson 38).

When static analysis detects code that might violate these constraints, the compiler safely skips optimization. It leaves the suspect component in its original form and compiles the remainder of the application, raising no fatal build errors.

### A "min ago" Label That Reads the Clock During Render

Chat interfaces frequently display relative timestamps indicating when messages were sent. We augment each message object with a `sentAt` timestamp, updating `Message` to calculate elapsed minutes:

```jsx title="src/components/ChatRoom.jsx" startLine="4"
const initialMessages = [
  { id: 1, text: 'Hi!', ~sentAt: Date.now()~ }, // Read once, when the file loads
  { id: 2, text: 'Lunch at 12?', sentAt: Date.now() },
  { id: 3, text: 'Sure', sentAt: Date.now() },
];
```

```jsx title="src/components/ChatRoom.jsx" startLine="19"
  function handleSend() {
    setMessages([...messages, { id: crypto.randomUUID(), text, ~sentAt: Date.now()~ }]); // Read in an event handler: allowed
    setText('');
  }
```

```jsx title="src/components/ChatRoom.jsx" startLine="28"
          <Message key={m.id} text={m.text} ~sentAt={m.sentAt}~ onDelete={() => handleDelete(m.id)} /> // Each row gets the moment its message was sent
```

```jsx title="src/components/Message.jsx"
export default function Message({ text, sentAt, onDelete }) {
  console.log('Message rendered:', text);
  const minutes = Math.floor((~Date.now()~ - sentAt) / 60000); // Reads the clock during render
  return (
    <li>
      {text} <small>{minutes} min ago</small> <button onClick={onDelete}>Delete</button>
    </li>
  );
}
```

The call to `Date.now()` returns the current unix timestamp in milliseconds, with `60000` converting that duration into elapsed minutes. The architectural placement of this call dictates system correctness:
1. **Inside `handleSend`, the call is valid.** Event handlers execute outside render in response to explicit user interaction.
2. **Inside `Message`, the call violates render purity.** Because time advances continuously, invoking the system clock inside render means identical props yield different output across subsequent renders.

Upon initial load, every message displays an elapsed label of `0 min ago`:

```page width=text caption="The chat room when the page opens, with a min ago label next to each message."
line: Hi! 0 min ago [Delete]
line: Lunch at 12? 0 min ago [Delete]
line: Sure 0 min ago [Delete]
form:
  field:  |
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Lunch at 12?
log: Message rendered: Lunch at 12?
log: Message rendered: Sure
log: Message rendered: Sure
```

The browser displays no errors, and console output shows expected lifecycle logs. We clear the console. Two minutes elapse, and the user types `O` into the input:

::: row caption="Two minutes after the page opens, the user types O: the labels without the compiler and with it."
::: col title="Built without the compiler" tag="the label moves on a keystroke" tone=bad
```page size=mini
line: Hi! 2 min ago [Delete]
line: Lunch at 12? 2 min ago [Delete]
line: Sure 2 min ago [Delete]
form:
  field:  | O
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Lunch at 12?
log: Message rendered: Lunch at 12?
log: Message rendered: Sure
log: Message rendered: Sure
```
The timestamps suddenly jump to `2 min ago` because typing forced child rows to re-render. If the user never types, the labels never update.
:::
::: col title="Built with the compiler" tag="the label stays old" tone=bad
```page size=mini
line: Hi! 0 min ago [Delete]
line: Lunch at 12? 0 min ago [Delete]
line: Sure 0 min ago [Delete]
form:
  field:  | O
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
```
The timestamps still display `0 min ago`, even though two full minutes have elapsed.
:::
:::

**Neither implementation functions correctly.** Timestamps must update when time advances, not as an incidental byproduct of keyboard events. When the compiler is active, execution unfolds as follows:
1. At build time, the compiler optimizes both `ChatRoom` and `Message`. Because general static analysis cannot track arbitrary global clock reads, it compiles `Message` without warning.
2. Two minutes later, the user types `O`. The compiled parent reuses the previously cached `<Message>` elements because the `messages` array remains stable.
3. Because child elements are reused directly, the row component never executes, and the clock is never re-read. The labels remain frozen at `0 min ago`.

The compiler did not introduce the defect. The component was flawed initially due to render impurity. The compiler merely exposed the flaw by eliminating accidental re-renders. The Rules of React are foundational requirements rather than loose recommendations. Violating them creates subtle user interface defects.

### Who Shows the Break: `eslint-plugin-react-hooks`

Because runtime browsers remain silent, developers rely on editor tooling to catch impurities. **ESLint** analyzes source code statically to flag structural errors. Compiler safety audits are integrated directly into `eslint-plugin-react-hooks`, using its recommended configuration preset:

```bash title="Terminal"
npm install -D eslint-plugin-react-hooks@latest
```

The purity lint rule flags the `Date.now()` invocation within `Message`, reporting that impure functions cannot be called during render. The linter treats clock reads identically to non-deterministic helpers like `Math.random()`.

Static linting provides the primary warning for this defect. The production build step avoids running expensive AST validation, meaning the compiler compiles `Message` anyway while client output remains silent. The ESLint plugin operates independently of compiler adoption, making it the essential prerequisite for evaluating existing projects.

### VS | The Clock Read During Render vs. the Time Kept in State: the same label, only one moves on time

The recommended architectural solution models time as observable application state: read the clock outside render, store the timestamp in state, and deliver elapsed values to child components through props. Compare the two implementation strategies:

```jsx title="The clock read inside Message, during render"
const minutes = Math.floor((~Date.now()~ - sentAt) / 60000); // **WRONG:** the same props give a different label each render
```

```jsx title="The time kept in ChatRoom's state, updated once a minute"
const [now, setNow] = useState(() => Date.now()); // Reads the clock once, when ChatRoom appears

useEffect(() => {
  const id = ~setInterval(() => setNow(Date.now()), 60000)~; // Reads the clock again every minute, outside render
  return () => clearInterval(id);
}, []);

<Message key={m.id} text={m.text} ~minutes={Math.floor((now - m.sentAt) / 60000)}~ onDelete={() => handleDelete(m.id)} /> {/* Message gets the minutes as a prop */}
```

While both approaches calculate elapsed minutes from `sentAt`, their execution semantics differ fundamentally:
1. **The first implementation** queries the system clock during render execution, tying timestamp accuracy to arbitrary re-render timing.
2. **The second implementation** queries the clock on an explicit interval outside render (Lesson 32). The `Message` component receives deterministic props, ensuring render output depends strictly on incoming values.

With this timer in place, the interval updates `now` once every sixty seconds. React re-renders `ChatRoom`, updating the `minutes` prop passed to child rows. Each row updates predictably on schedule, while keyboard input remains isolated from row rendering. The `Message` component accepts a clean `minutes` prop:

```jsx title="src/components/Message.jsx"
export default function Message({ text, ~minutes~, onDelete }) { // Only props: the same props give the same row
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <small>{minutes} min ago</small> <button onClick={onDelete}>Delete</button>
    </li>
  );
}
```

### A Compiler Error vs. a Runtime Issue

Documentation classifies compiler complications into two distinct categories:
1. **A compiler error** halts the build pipeline. This outcome is rare under default configurations because the compiler bails out gracefully when encountering unhandled AST patterns, leaving suspect components uncompiled while building the rest of the app.
2. **A runtime issue** produces client-side behavior that diverges from original source intent. Runtime regressions typically stem from undetected rule violations, causing the compiler to optimize components that should have been bypassed. Code that relies on intentional re-render side effects can break similarly.

### Mistake: A Form Library That Changes Values in Place

Third-party libraries sometimes employ patterns that conceal mutations from static analysis:
1. A form component subscribes to field values using `watch('name')` from a third-party form library.
2. The returned value resides within a persistent object reference whose internal properties mutate in place. Documentation refers to this as **interior mutability**. Because the outer object identity never changes, compiler cache checks assume data remains untouched.
3. While specialized lint rules recognize common form libraries and instruct the compiler to bail out, other reactive libraries like MobX with `observer` wrappers may elude detection.
4. When the compiler optimizes a component with undetected interior mutations, cached JSX references fail to reflect internal changes, causing interfaces to appear frozen. The official documentation notes that patterns breaking manual `useMemo` will break automated compiler memoization identically.

The recommended remediation involves adopting immutable subscription APIs like `useWatch`, or temporarily annotating the affected component with `"use no memo"` until data flow is refactored.

The fundamental rule remains: the compiler reuses output because it assumes functional purity. Preserving pure render functions ensures caching remains dependable.

---

## PRINCIPLE | `"use memo"`: a team compiles one component at a time, and `"use no memo"` takes one out

> [!PRINCIPLE]
> **Principle 4: `"use memo"` Lets a Team Compile One Component at a Time**
>
> *Start new apps with the compiler on; in an existing app, run the lint first, then compile one component, one folder, or one group of users at a time, and pin an exact version.*
>
> A break of the rules that the compiler cannot see shows up only while the app runs. Compiling a small part first lets the team find it on a few screens, measure the gain, and fix rule breaks one by one. `"use memo"` in `'annotation'` mode marks a component to compile, and `"use no memo"` takes one out for a while, with a note that says why.
>
> **DO THIS:**
> ```jsx
> export default function ChatRoom() {
>   ~"use memo";~ // The first line of the body: the compiler compiles ChatRoom
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function Message({ text }) {
>   const data = getData();
>   ~"use no memo";~ // **WRONG:** not the first line, so the compiler ignores it
> }
> ```

### A Directive: a Plain String at the Top of a Function

In traditional JavaScript, placing `"use strict"` at the top of a file or function alters evaluation semantics. That string represents a **directive**: a literal string positioned as the initial statement in a function body or module. Standard JavaScript engines treat free-standing string literals as no-op statements, but build tools parse them as configuration instructions.

The React Compiler inspects directives during AST analysis at build time:

```jsx title="A directive at the top of Message"
export default function Message({ text, onDelete }) {
  ~"use memo";~ // JavaScript ignores this string; the compiler reads it at build time
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <button onClick={onDelete}>Delete</button>
    </li>
  );
}
```

### VS | `"use memo"` vs. `"use no memo"`: one word apart, opposite jobs

The compiler recognizes two directives with contrasting objectives:

```jsx title="Asking the compiler to compile Message, and asking it to skip Message"
function Message({ text, onDelete }) {
  ~"use memo";~ // Compile this component: needed mainly in annotation mode
}

function Message({ text, onDelete }) {
  ~"use no memo";~ // Skip this component entirely, in every mode
}
```

**It looks the same, but it is NOT the same thing!** The two directives differ by a single word and perform opposite instructions:
1. **`"use memo"`** explicitly opts a function into compilation when running under selective compilation modes.
2. **`"use no memo"`** forces the compiler to skip the function completely. Documentation confirms that `"use no memo"` overrides all global compilation modes and competing directives.

### `compilationMode`: Which Functions the Compiler Compiles

The need for `"use memo"` arises from the configuration option `compilationMode`. This setting determines how the compiler selects target functions:
1. **`'infer'`**, the default mode. The compiler automatically targets functions following component naming conventions, capitalizing the first letter, or Hook conventions starting with `use`, provided they return JSX or call Hooks.
2. **`'annotation'`**, an explicit opt-in mode. The compiler ignores components by default, compiling only functions annotated with `"use memo"`.

In large legacy applications, teams can configure `'annotation'` mode to test compilation on isolated components. We supply this option directly to `reactCompilerPreset`, annotating only the parent `ChatRoom`:

```js title="vite.config.js"
babel({
  presets: [reactCompilerPreset({ ~compilationMode: 'annotation'~ })], // Compiles only functions marked "use memo"
}),
```

```jsx title="src/components/ChatRoom.jsx" startLine="10"
export default function ChatRoom() {
  ~"use memo";~ // The only marked component in the app
  const [messages, setMessages] = useState(initialMessages);
```

We clear the console and enter `O` into the text input. The console registers activity only for the parent:

```page width=text caption="Annotation mode with use memo only in ChatRoom: after the user types O, only the chat room renders."
line: Hi! 0 min ago [Delete]
line: Lunch at 12? 0 min ago [Delete]
line: Sure 0 min ago [Delete]
form:
  field:  | O
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
```

The compiled parent caches and reuses the `<Message>` element objects, preserving row stability even though `Message` itself remains uncompiled. Removing the directive disables compilation across the entire project, returning child rows to re-rendering on every keystroke.

### Three Ways to Compile One Part of the App at a Time

The documentation outlines three incremental adoption strategies for introducing the compiler to existing repositories:

```tree caption="Three ways to compile one part of an existing app at a time."
Three ways to compile one part of an app at a time
- +1. One folder at a time [`overrides`] | A Babel option applies the compiler only to the folders listed in `test` | Fits an app with **one newer folder** that follows the rules
- +2. One component at a time [`"use memo"`] | `compilationMode` set to `'annotation'` | Fits picking **the first few components** by hand
- +3. One group of users at a time [`gating`] | The build holds **both versions** and a feature flag picks one | Fits an **A/B test** that measures the gain on real users
```

Folder-level scoping utilizes the `overrides` configuration in `babel.config.js` to target specific directories such as a newly refactored module:

```js title="babel.config.js"
module.exports = {
  overrides: [
    {
      ~test: './src/modern/**/*.{js,jsx,ts,tsx}'~, // Only files inside src/modern are compiled
      plugins: ['babel-plugin-react-compiler'],
    },
  ],
};
```

The user-segmentation approach incorporates two deployment concepts:
1. A **feature flag** provides runtime branching in application logic to toggle functionality across user cohorts.
2. An **A/B test** serves the compiled variant to a test cohort and the uncompiled variant to a control cohort to quantify performance deltas.

The gating strategy involves two trade-offs:
1. Bundle size expands because the delivered bundle contains both compiled and uncompiled variants of target components.
2. Cohort evaluation runs upon initial module evaluation, keeping user assignment static until subsequent page reloads.

### Mistake: A Directive the Compiler Ignores

Directives must obey strict syntax conventions to be recognized:
1. **Placement must be the very first statement.** Declaring variables or invoking functions before `"use no memo"` causes the parser to treat the directive as an ordinary string expression, ignoring it. Documentation marks delayed directives as invalid.
2. **Quotation style must be standard.** Directives must use standard single or double quotation marks. Template literals using backticks are not recognized as directives.
3. **New components require explicit annotations in annotation mode.** In `'annotation'` mode, newly authored components omit optimization unless `"use memo"` is explicitly added.

In `'infer'` mode, utility functions lacking the `use` prefix or components omitting uppercase naming are bypassed. Documentation recommends correcting naming conventions rather than overriding behavior with directives.

### `"use no memo"` Is for a While, Not for Good

When an individual component exhibits regressions following compiler adoption, `"use no memo"` provides immediate isolation:

```jsx title="One component taken out while the team finds the bug"
export default function Message({ text, minutes, onDelete }) {
  ~"use no memo";~ // Rows stopped updating after compiling; remove once the cause is fixed
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <small>{minutes} min ago</small> <button onClick={onDelete}>Delete</button>
    </li>
  );
}
```

If opting out resolves the issue, documentation suggests the defect almost certainly stems from a violation of the Rules of React. Developers should rectify the underlying impurity and remove the directive. Official guidance characterizes `"use no memo"` as a temporary triage mechanism rather than a permanent workaround, advising teams to document the underlying reason directly in accompanying comments.

### New Apps and Existing Apps

**For greenfield projects, adopt the compiler from day one.** Standard project generators in Vite and Next.js provide built-in compiler templates, and Expo enables the compiler by default in modern SDK releases.

**For brownfield codebases, proceed incrementally:**
1. Install `eslint-plugin-react-hooks` configured with the recommended ruleset. The linter executes independently of the compiler, allowing teams to resolve reported impurities at a sustainable pace.
2. Scope compilation to a limited boundary, such as an isolated subdirectory, a key component annotated with `"use memo"`, or an A/B test cohort using gating.
3. Verify compiler engagement using React Developer Tools badges, execute existing automated test suites, and profile user interactions on previously sluggish views.
4. Broaden the compilation perimeter systematically until the entire project is optimized.

The adoption velocity of any team directly mirrors how rigorously their existing codebase conforms to functional React standards.

### Mistake: A Version Range on the Compiler

A common operational hazard requires zero source code modifications. In `package.json`, declaring dependencies with caret prefixes such as `^1.0.0` allows package managers to install newer minor and patch releases automatically:
1. A team specifies a flexible version range for the compiler in a project with limited test coverage.
2. A subsequent package installation pulls in an updated compiler release that refines dependency heuristics or expands memoization scopes.
3. A distant `useEffect` hook that relied on previous reference stability cycles now fires on altered intervals.
4. Because application source files remained untouched in source control, identifying the cause of the regression proves difficult.

Documentation recommends pinning the compiler to an exact version string in repositories with minimal test automation, managing upgrades intentionally. The `--save-exact` CLI flag enforces exact version locking:

```bash title="Terminal"
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```

Remember that executable JavaScript originates from the compiler transformation. Upgrading the compiler alters the generated runtime code, even when source files remain untouched.

---

## All 4 Principles Together

### The Complete Project

Here is the finished chat room. The compiler runs in its default `'infer'` mode with no directives, both component files are plain, and the clock is read outside render:

```js title="vite.config.js"
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    ~babel({ presets: [reactCompilerPreset()] })~, // Principle 1: the compiler runs at build time
  ],
});
```

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

```jsx title="src/App.jsx"
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return <ChatRoom />;
}
```

```jsx title="src/components/ChatRoom.jsx"
import { useEffect, useState } from 'react';
import Message from './Message.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!', sentAt: Date.now() },
  { id: 2, text: 'Lunch at 12?', sentAt: Date.now() },
  { id: 3, text: 'Sure', sentAt: Date.now() },
];

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const [now, setNow] = useState(() => Date.now());
  console.log('ChatRoom rendered');

  useEffect(() => {
    const id = ~setInterval(() => setNow(Date.now()), 60000)~; // Principle 3: the clock is read outside render
    return () => clearInterval(id);
  }, []);

  function ~handleDelete~(id) { // Principle 2: a plain function, no useCallback
    setMessages(messages.filter(m => m.id !== id));
  }

  function handleSend() {
    setMessages([...messages, { id: crypto.randomUUID(), text, sentAt: Date.now() }]);
    setText('');
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message
            key={m.id}
            text={m.text}
            ~minutes={Math.floor((now - m.sentAt) / 60000)}~ // Principle 3: the row gets the minutes as a prop
            onDelete={() => handleDelete(m.id)}
          />
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

```jsx title="src/components/Message.jsx"
export default function ~Message~({ text, minutes, onDelete }) { // Principle 2: no memo; Principle 3: only props
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <small>{minutes} min ago</small> <button onClick={onDelete}>Delete</button>
    </li>
  );
}
```

### How React Calls the Components, and What It Skips

Upon initial load, React renders the root application, evaluates `ChatRoom`, and subsequently renders each child message row. Subsequent runtime interactions proceed as follows:
1. **A keystroke in the input** triggers a render of `ChatRoom` alone, skipping all child rows.
2. **A timer tick** re-renders `ChatRoom` along with every row, because the computed `minutes` prop updates.
3. **Adding or removing a message** re-renders `ChatRoom` and child rows, because the underlying `messages` array reference changes.

```tree caption="The order in which React calls the components of the chat room, and what each event renders with the compiler on."
`App` [1. Called first] | **Root component** | Renders `<ChatRoom />`
- +`ChatRoom` [2. Holds `messages`, `text`, and `now`] | Renders again on **every keystroke** and **every minute** | Compiled: reuses the `<Message>` elements while `messages` and `now` stay the same
  - +3. `Message` for `Hi!` | Skipped on a keystroke | Renders when **a minute passes**, or when a message is sent or deleted
  - +4. `Message` for `Lunch at 12?` | Skipped on a keystroke | Renders when **a minute passes**, or when a message is sent or deleted
  - +5. `Message` for `Sure` | Skipped on a keystroke | Renders when **a minute passes**, or when a message is sent or deleted
```

To observe timer behavior, we wait for sixty seconds, clear the console, and allow the interval timer to trigger at the two-minute mark without user input:

```page width=text caption="The finished chat room two minutes after it opens, right after the interval updates now: every label reads 2 min ago, and every row renders."
line: Hi! 2 min ago [Delete]
line: Lunch at 12? 2 min ago [Delete]
line: Sure 2 min ago [Delete]
form:
  field:  |
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Lunch at 12?
log: Message rendered: Lunch at 12?
log: Message rendered: Sure
log: Message rendered: Sure
```

### Without the Compiler and With It

| Aspect | Without the React Compiler | With the React Compiler |
| :--- | :--- | :--- |
| **Where it runs** | Standard JavaScript transforms only; the browser executes author-written component functions directly | The compiler rewrites components and Hooks during build time; the browser executes cached functions |
| **Skipping rows** | Manual `memo` on child components combined with stable callbacks via `useCallback` | Plain component code; compiled parents reuse cached element references, even with inline callbacks |
| **Existing memoization** | Required manually whenever preventing unnecessary re-renders is critical | Integrates with existing hooks; preserved until validated by tests; retained as an explicit escape hatch |
| **Code that breaks the rules** | Impurities execute whenever parent state updates trigger child renders | Compiler bails out on recognized violations; undetected impurities can freeze stale output in cache |
| **Adoption strategy** | No specialized build setup required | Active from day one in new apps; existing apps lint first, adopting incrementally by directory, component, or user cohort |

Remember the guiding rule of this chapter: **the source code you author in your editor and the executable code running in the browser are two distinct layers.** Author your components using clean, pure JavaScript, and allow the compiler to generate the optimized execution layer.

---

## For the Interview

> **The Interview Question:** What does the React Compiler do, and when should you adopt it?

### How to Answer Clearly in 30 Seconds

"The React Compiler is a build-time tool that analyzes components and custom Hooks, transforming them into code that manages an internal memoization cache. It automatically caches JSX elements and intermediate computations whose dependencies remain unchanged, eliminating the need to write `memo`, `useMemo`, and `useCallback` manually. Inline callbacks no longer trigger child re-renders because the compiled parent reuses cached element instances directly.

The compiler relies strictly on the Rules of React: pure render functions, immutable props and state, and unconditional Hook calls. When the compiler detects rule violations, it bails out safely and leaves the component uncompiled. When violations go undetected, cached values can freeze stale data on screen. Adoption strategy therefore divides cleanly:
1. **New projects** should activate the compiler immediately.
2. **Existing projects** should run `eslint-plugin-react-hooks` first to resolve impurities, adopting compilation incrementally by directory, component directive, or feature-flagged user cohorts.
3. **Pre-existing manual memoization** should remain in place until verified by tests, with compiler versions pinned strictly in dependency manifests."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Once the compiler is on, can we delete all our `useMemo` and `useCallback` calls?"**
   **Do not delete them immediately.** For new development, official guidance recommends relying on compiler automation, retaining `useMemo` and `useCallback` strictly as escape hatches for values requiring explicit reference stability, such as `useEffect` dependencies. For established codebases, documentation advises keeping manual memoization intact or removing it incrementally with test verification. The compiler replaces manual Hooks with internal cache checks, compiling a component only when automated caching matches or exceeds manual stability. Component-level `memo` wrappers can generally be removed safely once compilation is active.
2. **"What happens when a component breaks the Rules of React?"**
   **Behavior depends on static detection.** When the compiler recognizes a violation, such as invoking a Hook conditionally, it bails out safely, leaving that component untransformed while continuing to compile the rest of the application. The ESLint plugin surfaces the violation in the editor, and the component omits the Memo badge in React Developer Tools.

   When a violation eludes static analysis, the compiler proceeds with optimization, and cached references can cause interfaces to freeze. Reading `Date.now()` during render represents such an impurity: only the linter flags it. Interior mutations inside third-party objects present similar hazards. Adding `"use no memo"` serves as an immediate diagnostic test: if the issue vanishes, the regression stems from an underlying rule violation.
3. **"Does the compiler make the app faster on the first load?"**
   **Initial load speed is not its primary focus.** The compiler targets update performance, eliminating redundant re-renders of active components and skipping costly re-computations during state changes. It caches only components and custom Hooks, without sharing cache slots across distinct component instances.

   Production case studies show substantial interaction gains. Teams report interaction responsiveness improving by more than two and a half times, alongside modest initial load improvements of up to twelve percent, with memory consumption remaining flat. Furthermore, the compiler optimizes computations located after early return statements, a capability impossible with manual `useMemo` due to Hook rules (Lesson 38).

```tree dir=right caption="How the compiler handles a component, from the build to the screen."
What the compiler does with each component
- +1. Reads it at build time [`babel-plugin-react-compiler`] | Checks it against the **Rules of React**
- !2a. Sees a break | **Skips** the component and leaves it as written | The lint shows the break; **no Memo badge**
- +2b. Sees no break | Writes a version with a **cache** | JSX and values are **reused** while their inputs stay the same
- !3. A break it could not see | The compiled code **reuses old output** | The screen can **stop updating**; `"use no memo"` takes it out while the team fixes it
```
