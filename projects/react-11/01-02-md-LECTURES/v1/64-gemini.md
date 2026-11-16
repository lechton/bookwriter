# Lecture 64: How React Developer Tools Shows Which Component Renders, What It Holds, and What It Costs

*(How do you find the component that makes typing slow, without guessing?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you inspect component trees, label and audit hook state, and profile renders with React Developer Tools?

---

## VS | The Elements Panel vs. React Developer Tools: the Elements panel shows the DOM nodes, React Developer Tools shows the components

> When an interaction like typing feels sluggish in a React application, guessing which components are re-rendering rarely finds the bottleneck. **Inspecting the browser's native Elements panel only reveals the final DOM nodes, hiding the actual React component hierarchy along with their props, state, and rendering costs**. Install React Developer Tools to inspect live components directly, audit custom Hooks, and record interactions in the Profiler tab to measure render costs.

In plain JavaScript, you create DOM elements directly using browser methods like `document.createElement`. When you right-click an element on a web page and select Inspect, the browser's native Elements panel displays the exact HTML tags you created:

```js title="Plain JavaScript: the node you create is the node you inspect"
const item = ~document.createElement('li')~; // The Elements panel shows this exact li
item.textContent = 'Hi!';
document.querySelector('ul').append(item);
```

In React, you never construct real DOM nodes by hand. You write components, such as `Message`, that return JSX element descriptions. React invokes your components, determines what changed, and updates the real DOM on your behalf. Because component names exist only in your JavaScript source code and never become HTML tags, the component name `Message` never appears in the DOM (Lesson 04):

```jsx title="React: you write Message, and the DOM gets only the li it returns"
function Message({ text }) {
  return ~<li>{text}</li>~; // The Elements panel shows this li, and never the name Message
}

<Message text="Hi!" />
```

The browser's native Elements panel reads only the real DOM tree. It cannot reveal which component produced a specific `<li>`, what props it received, or what state it stores.

React calls every component function itself. It tracks every component in the tree, the props passed to each one, the state each component stores, and how many milliseconds each render takes. React Developer Tools is an official extension that lets you query React directly. It adds two specialized tabs to your browser developer tools, right next to the Elements panel and the Console:
1. **The Components tab** displays the complete component tree as React sees it, along with the props, state, and Hooks of any selected component.
2. **The Profiler tab** records user interactions, such as typing or clicking, and measures which components rendered and how long each render took.

Keep one core rule in mind throughout this lesson: **the browser knows the DOM nodes, React knows the components, so ask React.**

> [!DEFINITION]
> **What is React Developer Tools?** [NEW] React Developer Tools, commonly called React DevTools, is an official browser extension created by the React team. It hooks into the React runtime on any web page built with React, adding two specialized tabs to the browser developer tools: Components and Profiler. The Components tab allows you to inspect component hierarchies, view and edit props and state in real time, and audit custom Hooks. The Profiler tab records user interactions to measure render durations and identify performance bottlenecks (Lesson 64).

Two actions central to this lesson stem from those panels:
- To **inspect** a component means to select it in the component tree to examine its props, state, and Hooks.
- To **profile** an application means to record a live interaction and measure how many milliseconds React spends rendering each component.

### How to Install React Developer Tools

React Developer Tools is available as an official extension for Google Chrome, Mozilla Firefox, and Microsoft Edge. You install it once from your browser extension store. After installation, whenever you visit a website built with React, the Components and Profiler tabs appear automatically inside your browser developer tools.

Browsers without direct extension support, such as Safari, mobile browsers, or embedded web views, can use the standalone `react-devtools` package. You install and launch the package from your terminal:

```bash title="Terminal"
npm install -g react-devtools
react-devtools
```

Then add a script tag pointing to `localhost:8097` at the very beginning of your page `<head>`:

```html title="index.html"
<head>
  <script src="http://localhost:8097"></script>
  <meta charset="UTF-8" />
</head>
```

When you reload the application, the web page connects to the standalone React DevTools window via WebSockets, giving you the same Components and Profiler panels.

### What Is at Stake

Imagine typing into a chat message field with a long conversation history rendered above it. Each letter appears in the field a moment after you press the key. The application works, but typing feels sluggish and unresponsive.

To solve the lag, you must answer one crucial question: which component is re-rendering on every keystroke, and which one consumes the execution time? Developers usually take one of two approaches:
1. **Guessing**: scattering console log or timer statements inside components that look slow, or blindly wrapping components in `memo` (Lessons 54 and 55). Each manual log only measures the specific lines you selected, often missing child rendering entirely.
2. **Measuring with DevTools**: opening React Developer Tools to record the typing interaction. React DevTools profiles the entire render cycle, displaying every component that executed and the exact duration each one took.

These two paths lead to very different outcomes:
- Developers who guess frequently wrap the wrong component in `memo`, leaving the input lag unchanged. The React documentation warns that unmeasured memoization is often ineffective and adds unnecessary complexity.
- Developers who profile immediately see that the message list rows re-render on every keystroke and consume most of the frame time. They apply memoization precisely where it matters, re-record the interaction, and verify that render times drop.

Asking React takes four steps:

```tree dir=right caption="The four steps to find which component makes typing slow, with React Developer Tools."
How we find the component that makes the chat lag
- +1. Open React Developer Tools | Two new tabs appear: **Components** and **Profiler**
- +2. Read the Components tab | Every **component**, with its **props** and **state**
- +3. Record in the Profiler tab | Which components **rendered** after each keystroke, and **how long** each took
- +4. Fix the costliest one, record again | The time **drops**, or the fix was the **wrong one**
```

### Where Developers Go Wrong

Developers commonly make five mistakes when using these tools:
1. Searching for custom component names like `Message` in the browser's native Elements panel, where only rendered DOM elements like `<li>` exist.
2. Adding memoization hooks everywhere before profiling, wrapping every component in `memo` and every function in `useCallback`.
3. Treating render durations measured in development as real user-facing numbers. Development mode runs `<StrictMode>` double renders and includes DevTools instrumentation overhead.
4. Expecting `<Profiler>` callbacks and the Profiler tab to collect data in standard production builds, where profiling instrumentation is disabled for speed.
5. Calling `useDebugValue` inside every custom Hook. The React documentation recommends reserving debug values for shared library Hooks with complex internal state.

### The Rule of Thumb: look in the Components tab, and measure before you fix

**Look for components in the Components tab, never in the Elements panel. To resolve performance issues, record the interaction in the Profiler tab, optimize the component with the highest render duration, and record again to verify the improvement.**

## SECTION | The Chat Room from Lesson 54

We work on the chat room from Lesson 54, without its theme toggle button and without its Send button. It displays three chat messages above an empty message input field:

```page width=text caption="The chat room when it opens: three messages above an empty message field."
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  |
```

The project keeps five files inside its source folder. The main entry file mounts `App` inside `<StrictMode>` (Lesson 47). `App` renders the chat room. `ChatRoom` renders one `Message` component for each message in the list. The custom Hook `useOnlineStatus` from Lesson 53 joins the chat room in Principle 2:

```files title="chat-room: File Explorer" caption="How the files of our chat room sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<ChatRoom />`
  useOnlineStatus.js | custom Hook | Exports `useOnlineStatus`, which reads the network status
  components/
    ChatRoom.jsx | state | Holds `messages` and `text`, and renders the list and the message field
    Message.jsx | default export | Shows one message as an `<li>`
```

`ChatRoom` preserves the message list and the input text in state:

```jsx title="src/components/ChatRoom.jsx"
import { useState } from 'react';
import Message from './Message.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

export default function ChatRoom() {
  const [messages] = useState(initialMessages);
  const [text, setText] = ~useState('')~; // Every keystroke by the user changes text
  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} text={m.text} />
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
    </section>
  );
}
```

```jsx title="src/components/Message.jsx"
export default function Message({ text }) {
  return <li>{text}</li>;
}
```

You already understand what happens after each keystroke. The text in state changes, React re-renders `ChatRoom`, and React calls every `Message` child again (Lesson 54). Right now each `Message` renders cheaply, so the interface feels fast. In Principle 3, we simulate a heavy component inside `Message` on purpose, and we pinpoint it using the Profiler tab, without guessing.

**PRINCIPLES:** The browser knows the DOM nodes, React knows the components. Four principles follow from that:
1. **Principle 1: The Components Tab Shows Components, Not DOM Nodes.** It displays `ChatRoom` and `Message` with their props and state, lets you edit values live to test UI behavior, and reveals where components sit in the tree.
2. **Principle 2: useDebugValue Labels a Custom Hook.** Calling `useDebugValue` inside a custom Hook displays a descriptive label like `OnlineStatus: "Online"` in the Components tab without changing the component's output.
3. **Principle 3: The Profiler Tab Names the Slow Component.** Recording user actions shows exactly which components re-rendered on each commit and how many milliseconds each render took.
4. **Principle 4: baseDuration Shows What memo Saved.** Comparing actual and base durations in `onRender` proves whether memoization skipped rendering work, while production builds require a special profiling build.

---

## PRINCIPLE | Components tab: every component React called, with its props and its state

> [!PRINCIPLE]
> **Principle 1: The Components Tab: React Developer Tools Shows Components, Not DOM Nodes**
>
> *Read the Components tab to inspect each component React called, along with its props and state; the Elements panel shows only the final DOM nodes.*
>
> JSX tags never appear in the real DOM, so the browser Elements panel cannot identify which component rendered an `<li>`, what props it received, or what state it stores. React tracks every component invocation internally, and the Components tab exposes this runtime hierarchy. You can select any component on the page, inspect its props and state, edit values live to test UI responses, and verify where a component sits relative to context providers.
>
> **DO THIS:**
> ```jsx
> <ThemeContext value={theme}>
>   <button onClick={toggleTheme}>Toggle theme</button>
>   ~<ChatRoom />~ {/* The Components tab shows ChatRoom under the provider */}
> </ThemeContext>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ThemeContext value={theme}>
>   <button onClick={toggleTheme}>Toggle theme</button>
> </ThemeContext>
> ~<ChatRoom />~ {/* **WRONG:** ChatRoom sits next to the provider, so every Message reads the default 'light' */}
> ```

### The Same Chat Room in Two Trees

Open the chat room in your browser and open the developer tools. First, inspect the native Elements panel. You see exactly what the browser painted: a list container with three `<li>` elements, followed by an `<input>` element:

```dom caption="What the Elements panel shows for the chat room: DOM nodes only, with no ChatRoom and no Message."
<div id="root">
  <section>
    <ul>
!     <li>Hi!</li> | note: No node is called Message
      <li>Lunch at 12?</li>
      <li>Sure</li>
    </ul>
    <input>
  </section>
</div>
```

Look for `Message` or `ChatRoom` in the Elements panel. You will not find them. No DOM node is called `Message`. React evaluated each `<Message />` tag in memory and placed only the returned `<li>` into the DOM.

Now switch to the Components tab on the same page:

```tree caption="What the Components tab shows for the same chat room: the components React called, with the state of ChatRoom and the props of each Message."
Components tab: the chat room as React sees it
- +`App` | The **root** component
  - +`ChatRoom` | Two rows named **State**: the **three messages** and the empty **`text`**
    - +`Message` | Props: text **`"Hi!"`**
    - +`Message` | Props: text **`"Lunch at 12?"`**
    - +`Message` | Props: text **`"Sure"`**
```

This is the component hierarchy React preserves in memory, displaying the exact component names you authored in your source files. Each `Message` node displays its text prop, and `ChatRoom` displays its state.

How does the extension know the names `ChatRoom` and `Message` when they never appear in the DOM? React preserves component function names in its internal runtime fiber tree. React Developer Tools connects to that runtime tree through a global hook, reading component names, props, and state directly from React. As the React rules explain: "If components are first-class citizens that the library is aware of, we can build rich developer tools for introspection in development."

```tree caption="The Elements panel shows what the browser draws; the Components tab shows what React keeps."
Two trees of the same chat room
- !Elements panel [`ul` `li` `input`] | Shows the **DOM nodes** | No `ChatRoom`, no `Message`, **no props, no state**
- +Components tab [`ChatRoom` `Message`] | Shows the **components React called** | Each one with its **props** and **state**
```

Remember: **the Elements panel shows what the browser draws. The Components tab shows what React keeps, and that is what you debug.**

### Click a Message on the Page, Read Its Props

The Components tab includes an inspection tool in its top-left corner, represented by a cursor icon. Click that icon, then click the message `Lunch at 12?` on the web page. React DevTools instantly highlights and selects the second `Message` component in the tree. In the right-hand panel, under Props, it displays `text: "Lunch at 12?"`.

Now select `ChatRoom` in the component tree. The right-hand panel displays its Hook state. It shows two rows, and both rows are labeled generically as `State`. The Components tab does not display your local variable names, `messages` and `text`. It lists Hook state rows in the exact order of your `useState` calls:
1. The first `State` row holds the array of three message objects.
2. The second `State` row holds the string representing the message field text, which starts empty.

When the user types the letter O into the input field, the second `State` row immediately updates to `"O"`.

### Change State by Hand, Without a Button

The Components tab also allows you to edit props and state interactively. Click into the second `State` row, the one holding the input text, and change its value to `"Hello"`. The input field on the page displays `Hello` immediately, even though nobody typed into the field:

```page width=text caption="The chat room after the developer changes the text state to Hello in the Components tab: the field shows Hello."
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  | Hello | good
```

This edit works exactly as if your component code had executed `setText('Hello')`. DevTools updates the component state in React's internal fiber tree, prompting React to re-render `ChatRoom` with the new value. This capability lets you test boundary cases, lengthy text inputs, or error states quickly without adding temporary test buttons to your code.

### A Provider in the Wrong Place

The Components tab is also the fastest place to diagnose context hierarchy mistakes. When a component reads a context and unexpectedly receives the default value, the React documentation gives clear guidance: "Check whether the hierarchy is right using React DevTools."

Consider this common mistake. Suppose the chat room includes a theme toggle, where `Message` reads the active theme using `useContext(ThemeContext)`. The default value of `ThemeContext` is `'light'`. The theme state in `App` initializes to `'dark'`, yet every message continues to display the light theme. The provider code in `App.jsx` looks deceptively plausible at first glance:

```jsx title="src/App.jsx"
export default function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <>
      <ThemeContext ~value={theme}~> {/* **WRONG:** only the button sits inside the provider */}
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Toggle theme
        </button>
      </ThemeContext>
      <ChatRoom />
    </>
  );
}
```

In the editor, closing `<ThemeContext>` early is easy to overlook. In the Components tab, the structural mistake becomes obvious immediately. The tab displays `ThemeContext` as `Context.Provider`, with only the button nested beneath it. `ChatRoom` appears as a sibling beside the provider, not as a child inside it. Because context resolution walks upward through ancestor components, `Message` finds no provider and falls back to the default `'light'` value (Lesson 28):

```tree caption="The Components tab shows ChatRoom next to the provider, not inside it, so every Message reads the default theme."
Components tab: `App`
- +`Context.Provider`: our `ThemeContext` | Holds **`'dark'`** | Wraps **only the button**
- !`ChatRoom` | Sits **next to** the provider | Every `Message` reads the default **`'light'`**
```

The fix is to move `<ChatRoom />` inside `<ThemeContext>`, as shown in the principle card. The Components tab then shows `ChatRoom` nested beneath the provider, and every message receives the dark theme.

---

## PRINCIPLE | `useDebugValue`: a custom Hook shows a readable label in the Components tab

> [!PRINCIPLE]
> **Principle 2: useDebugValue: A Custom Hook Gets a Readable Label in React DevTools**
>
> *Call `useDebugValue` at the top level of a shared custom Hook to label its value in the Components tab; pass a formatting function when the label costs work.*
>
> Without a label, the Components tab displays a custom Hook with no summary value, requiring you to expand internal Hook rows to find raw values like `true` or `false`. Calling `useDebugValue` returns nothing and produces zero DOM changes; it solely supplies a descriptive string to React DevTools. When computing the label requires expensive processing, such as date formatting or JSON parsing, provide a formatting function as the second argument so the calculation runs only when a developer inspects the component.
>
> **DO THIS:**
> ```js
> useDebugValue(date, ~date => date.toDateString()~); // React DevTools formats the date only while it inspects the component
> ```
>
> **DO NOT DO THIS:**
> ```js
> useDebugValue(~date.toDateString()~); // **WRONG:** formats the date on every render, even with React DevTools closed
> ```

### `useDebugValue` in Its Smallest Form

Recall `useOnlineStatus`, the custom Hook from Lesson 53. It returns `true` while the browser has network connectivity and `false` when offline. Here is the Hook in two versions. The second version adds one line:

```js title="useOnlineStatus without a label"
export function useOnlineStatus() {
  return ~useSyncExternalStore(subscribe, getSnapshot)~; // Returns true or false
}
```

```js title="useOnlineStatus with useDebugValue"
export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  ~useDebugValue(isOnline ? 'Online' : 'Offline')~; // Gives React DevTools a label, and returns nothing
  return isOnline;
}
```

On the rendered web page, both versions behave identically: any component calling the Hook receives true or false. In the Components tab, their presentation differs completely:
- **Without `useDebugValue`**, the Components tab shows an expandable row named `OnlineStatus` with no value next to it. You must expand the row to inspect the underlying primitive Hook value: `SyncExternalStore: true`. As the React documentation explains, without this call, only the underlying raw data is displayed.
- **With `useDebugValue`**, the Components tab displays a clear label directly beside the Hook: `OnlineStatus: "Online"`.

> [!DEFINITION]
> **What is useDebugValue?** [NEW] `useDebugValue` is a built-in React Hook that assigns a custom, human-readable label to a custom Hook inside the React DevTools Components tab. Unlike `useState` or `useSyncExternalStore`, it does not store application data, does not trigger re-renders, and returns `undefined`. You invoke it at the top level of a custom Hook to display immediate context for developers inspecting component state, rather than forcing them to expand low-level primitive Hook values (Lessons 38 and 64).

### The Chat Room Shows Online or Offline

Chat applications often display connection status, so we add an online indicator heading to our chat room. `ChatRoom` imports and invokes `useOnlineStatus`, displaying Online or Offline above the message list:

```jsx title="src/components/ChatRoom.jsx"
import { useState } from 'react';
import Message from './Message.jsx';
import { useOnlineStatus } from '../useOnlineStatus.js';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

export default function ChatRoom() {
  const isOnline = ~useOnlineStatus()~; // true while the browser is online
  const [messages] = useState(initialMessages);
  const [text, setText] = useState('');
  return (
    <section>
      <h1>{isOnline ? 'Online' : 'Offline'}</h1>
      <ul>
        {messages.map(m => (
          <Message key={m.id} text={m.text} />
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
    </section>
  );
}
```

```page width=text caption="The chat room with its status heading: Online above the three messages."
heading: Online
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  |
```

Select `ChatRoom` in the Components tab. Above its two `State` rows, you see a new row for your custom Hook, labeled `OnlineStatus`. Notice that your source code never defined that string. React DevTools automatically derives the row name from the function name `useOnlineStatus`, stripping the `use` prefix by convention.

Before adding `useDebugValue`, that row displays no summary value. You must expand it to view the primitive Hook value inside: `SyncExternalStore: true`. In an application where components invoke multiple custom Hooks, expanding row after row to decipher raw booleans, IDs, and timestamps wastes valuable debugging time.

Now we add `useDebugValue` to the Hook. We store the result in `isOnline` so we can pass a descriptive label to `useDebugValue` and return the boolean to callers:

```js title="src/useOnlineStatus.js"
import { useSyncExternalStore, ~useDebugValue~ } from 'react'; // useDebugValue comes from react

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  ~useDebugValue(isOnline ? 'Online' : 'Offline')~; // Our own words for the label
  return isOnline;
}
```

Reload the web page. The user interface remains unchanged, with `Online` above the messages. In the Components tab, selecting `ChatRoom` now displays `OnlineStatus: "Online"` directly on the summary row.

The row name OnlineStatus comes from the Hook name, while the label string comes from the argument passed to `useDebugValue`. When the network disconnects, the heading switches to `Offline` and the DevTools label updates to `OnlineStatus: "Offline"`.

```tree caption="What the Components tab shows for ChatRoom before and after the call to useDebugValue; the page stays the same."
The row of `useOnlineStatus` in the Components tab
- !Without `useDebugValue` | Shows **`OnlineStatus`** with **no value** | The raw **`true`** sits inside, under `SyncExternalStore`
- +With `useDebugValue` | Shows **`OnlineStatus: "Online"`** | Reads **`OnlineStatus: "Offline"`** when the Wi-Fi drops
```

This label appears automatically on every component that calls the Hook. As the React documentation explains: "This gives components calling `useOnlineStatus` a label like `OnlineStatus: "Online"` when you inspect them."

### A Label That Costs Work: a Function as the Second Argument

Suppose a custom Hook tracks a user's last-seen timestamp as a JavaScript `Date` object. By default, displaying the raw object in DevTools yields an unformatted timestamp. You want a concise string, such as `Fri Nov 13 2026`, produced by `date.toDateString()`. There are two ways to pass this to `useDebugValue`:

```js title="The date formatted on every render vs. a formatting function"
~useDebugValue(date.toDateString())~; // Runs toDateString on every render, even with React DevTools closed
~useDebugValue(date, date => date.toDateString())~; // React DevTools runs toDateString only when it inspects the component
```

Both lines produce the exact same visual label in the Components tab, but their performance impact is very different:
- **With `date.toDateString()` as the direct argument**, JavaScript formats the date on every single render. It runs for every user, even when React DevTools is closed.
- **With a formatting function as the second argument**, the Hook passes the raw `date` object. The second argument is a **formatting function**: a function that converts the value into display text. React DevTools calls the formatting function only when a developer inspects the component. On normal renders, the formatting calculation never runs.

The React documentation highlights this optimization: "This lets you avoid running potentially expensive formatting logic unless the component is actually inspected."

### When a Hook Deserves a Label

Developers who discover `useDebugValue` often start adding it to every custom Hook across their project. The React documentation recommends against this practice: "Don't add debug values to every custom Hook. It's most valuable for custom Hooks that are part of shared libraries and that have a complex internal data structure that's difficult to inspect."

Our `useOnlineStatus` Hook returns a simple boolean, serving as an accessible learning example. In production code, reserve `useDebugValue` for shared library Hooks that maintain complex internal structures, such as finite state machines, stream subscriptions, or cache managers.

---

## PRINCIPLE | Profiler tab: it lists every component that rendered on a keystroke, and how long it took

> [!PRINCIPLE]
> **Principle 3: The Profiler Tab: Record the Interaction, Then Fix the Component It Names**
>
> *Record the slow interaction in the Profiler tab, inspect which components rendered in each commit and how long each one took, optimize the component with the highest cost, and record again to verify.*
>
> Guessing performance bottlenecks with `console.time` often fails because timers placed inside a parent component measure only the parent's execution, ending before React renders the child elements. The Profiler tab profiles the full render and commit cycle, measuring exact render durations for every component across each commit without modifying application code. Re-profiling after applying `memo` proves whether unnecessary re-renders were eliminated. Development timings are inflated by tooling overhead, making them valuable for identifying relative bottlenecks rather than absolute user-facing latencies.
>
> **DO THIS:**
> ```jsx
> export default ~memo(Message)~; // The recording named Message: it no longer renders on a keystroke
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default ~memo(ChatRoom)~; // **WRONG:** a guess from console.time: ChatRoom renders from its own state, and the three rows still take the time
> ```

### A Message That Is Slow on Purpose

To locate a slow component with profiling tools, we first need a component with measurable render cost. The React documentation constructs performance demonstrations by introducing an **artificially slowed down** component: a component that runs an intentional delay loop to represent computationally heavy rendering logic. Here is our `Message` component, slowed down:

```jsx title="src/components/Message.jsx"
export default function Message({ text }) {
  let startTime = performance.now();
  ~while (performance.now() - startTime < 20)~ { // Waits 20 milliseconds on every render, to stand for slow code
  }
  return <li>{text}</li>;
}
```

The browser method `performance.now()` returns a high-resolution timestamp in milliseconds. The `while` loop blocks the JavaScript main thread until 20 milliseconds have elapsed. In the official documentation, the tutorial adds a 1-millisecond delay across 250 list items. Because our example uses only three message rows, each row pauses for 20 milliseconds so the latency is easy to observe.

When the user types `OK` into the message input field, each keystroke lags. Why does this happen? Each keypress updates the text state, prompting React to re-render `ChatRoom` and call all three `Message` components. Each message row blocks execution for 20 milliseconds. In development, `<StrictMode>` calls every component function twice (Lesson 47). Consequently, three rows running twice produce approximately 120 milliseconds of synchronous work on every single keystroke.

### VS | `console.time` vs. the Profiler Tab: the timer measures only the lines you chose, the Profiler tab measures every component

When an application experiences input lag, developers often attempt to locate the bottleneck using `console.time` inside the parent component holding the input state:

```jsx title="A guess: console.time inside ChatRoom"
export default function ChatRoom() {
  ~console.time('ChatRoom')~; // Starts a timer each time React calls ChatRoom
  const isOnline = useOnlineStatus();
  const [messages] = useState(initialMessages);
  const [text, setText] = useState('');
  ~console.timeEnd('ChatRoom')~; // Prints a tiny time: no Message has rendered yet
  return (
    <section>
      ...
    </section>
  );
}
```

**The Console prints a tiny duration, well under a tenth of a millisecond, after every keystroke.** Why is the logged time so small when typing feels so slow? The timer stops before `ChatRoom` returns its JSX. In React, a parent component does not invoke its child components directly; it merely returns JSX descriptors for them. React evaluates child component functions only after the parent function has completed. As a result, the expensive `Message` components execute completely outside the `console.time` measurement block.

Misled by this timing, the developer assumes the chat room is fast and wraps `ChatRoom` in `memo` as a defensive guess. The typing lag remains. Remember that `memo` skips rendering only when component props remain identical (Lesson 55). `ChatRoom` is re-rendering because its own text state changed. Wrapping the parent in `memo` does nothing, and all three `Message` rows re-render on every keystroke as before.

The manual timer and the DevTools profiler might appear to accomplish similar goals, but their capabilities are fundamentally different:
- **`console.time`** measures only the exact lines of code you manually enclose, completely missing subsequent child renders.
- **The Profiler tab** automatically records every component that React rendered in response to an interaction, along with exact execution durations, without requiring any code changes.

React's documentation recommends the Profiler tab whenever an interaction lags. Use the profiler to identify which components benefit most from memoization, and add memoization only where needed.

### Record the Keystrokes in the Profiler Tab

**Recording the interaction reveals that the three `Message` rows consume almost all execution time, while `ChatRoom` takes virtually none.** Here is the profiling workflow:
1. Open the Profiler tab in React Developer Tools and click the round Record button.
2. Type `O` and `K` into the message input field.
3. Click the Stop button to finish recording.
4. The recording displays one commit for each keystroke, showing two commits in total.
5. In each commit, `ChatRoom` rendered, and all three `Message` rows rendered as well, even though only the input text changed.

> [!DEFINITION]
> **What is a commit?** [REVIEW] A commit is the phase where React applies calculated changes to the real browser DOM. React first executes components during the render phase to determine what the UI should look like, and then commits those changes to the DOM in a single pass. In our chat application, each keystroke triggers a render phase followed by one commit (Lesson 13).

For each commit, the Profiler draws a hierarchical chart displaying every component rendered, with children nested beneath parents. The width of each bar reflects how long that component took to render, including its descendants. The React documentation calls this visualization a **flamegraph**: a chart where "each entry represents the duration of the corresponding component render and all its descendant children components."

```tree caption="What one commit of the recording shows after the user types O: ChatRoom is cheap, and the three Message rows take the time."
One commit of the recording: the user types `O`
- +`ChatRoom` | Rendered because **its state `text` changed** | Its own time is **almost zero**
- !`Message` Hi! | Rendered with the **same props** | About **40 milliseconds**
- !`Message` Lunch at 12? | Rendered with the **same props** | About **40 milliseconds**
- !`Message` Sure | Rendered with the **same props** | About **40 milliseconds**
```

Each `Message` row consumes about 40 milliseconds here rather than 20 because `<StrictMode>` executes render functions twice in development.

Notice that you wrote no measurement code to generate these numbers. React automatically measures component render durations while the Profiler tab records. This uses the exact same profiling engine that powers the `<Profiler>` component in application code (Lesson 54).

### Fix the Component the Profiler Tab Names, Then Record Again

The recording clearly identifies `Message` as the bottleneck. Armed with that data, you wrap `Message` in `memo`, and you optimize only that component:

```jsx title="src/components/Message.jsx"
import { memo } from 'react';

function Message({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 20) {
  }
  return <li>{text}</li>;
}

export default ~memo(Message)~; // The props of each row stay the same while the user types, so React skips it
```

Record the exact same typing interaction again in the Profiler tab. In the new recording, each commit shows that `ChatRoom` rendered, while all three `Message` rows appear grayed out and labeled as not rendered. The commit duration drops to a fraction of a millisecond, and typed characters appear in the input field instantly.

### Development Numbers Are Not the User's Numbers

The 40-millisecond duration recorded for each message row is a development measurement. In development mode, Strict Mode executes renders twice, and React Developer Tools injects instrumentation to collect profiling data. Realistic production timings require testing a production build without React DevTools open. You should test on devices similar to the hardware your users actually use.

Development profiling is designed to identify *which* component is relatively expensive, not to measure the exact millisecond latency your end users will experience.

---

## PRINCIPLE | `baseDuration` in `onRender`: the gap to `actualDuration` is what `memo` saved

> [!PRINCIPLE]
> **Principle 4: actualDuration Against baseDuration: Two Numbers Prove That memo Works**
>
> *Compare `baseDuration` against `actualDuration` in `onRender`; the difference between them reveals what memoization saved, and collecting these metrics in production requires a dedicated profiling build.*
>
> `actualDuration` measures how many milliseconds React spent rendering the subtree for the current update. `baseDuration` estimates the total time required to render that same subtree without any memoization, summing the most recent render durations of each child component. When memoization works, `actualDuration` drops close to zero while `baseDuration` stays high. Standard production builds disable profiling callbacks entirely to avoid performance penalties, so measuring production performance requires building with React's profiling entry point.
>
> **DO THIS:**
> ```jsx
> function onRender(id, phase, actualDuration, baseDuration) {
>   console.log(id, phase, actualDuration.toFixed(2), ~baseDuration.toFixed(2)~); // With memo: 0.10 next to 120.55
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Profiler id="App" onRender={onRender}>
>   ~<App />~ {/* **WRONG:** adds overhead to every render of the app, and prints nothing in a normal production build */}
> </Profiler>
> ```

### Two Numbers on One Console Line

The Profiler tab displays timings visually inside browser developer tools. The `<Profiler>` component gives your application code programmatic access to the same timing measurements (Lesson 54). In Lesson 54, our `onRender` callback logged only `actualDuration`. Now we log `baseDuration` directly beside it:

```jsx title="Printing actualDuration and baseDuration"
import { Profiler } from 'react';

function onRender(id, phase, actualDuration, ~baseDuration~) { // The fourth argument React passes to onRender
  console.log(id, phase, actualDuration.toFixed(2), baseDuration.toFixed(2));
}

<Profiler id="MessageList" onRender={onRender}>
  <ul>
    {messages.map(m => (
      <Message key={m.id} text={m.text} />
    ))}
  </ul>
</Profiler>
```

These two metrics answer two distinct architectural questions:
1. **`actualDuration`** represents the time in milliseconds that React spent rendering the `<Profiler>` subtree for this specific update.
2. **`baseDuration`** estimates how long rendering the entire subtree would take if React had skipped nothing. As the React documentation specifies, it is "calculated by summing up the most recent render durations of each component in the tree."

A common mistake is assuming that `baseDuration` represents the initial mount time. It does not. React calculates baseDuration on every commit by summing the latest render durations of every component in the subtree. This sum includes components skipped during the current commit. In effect, `baseDuration` represents the cost of rendering the subtree without memoization. As the documentation advises: "Compare `actualDuration` against it to see if memoization is working."

### Measure the List of Messages

In `ChatRoom.jsx`, we import `Profiler` and wrap the message list inside it. The `onRender` callback function is defined outside the component:

```jsx title="src/components/ChatRoom.jsx"
import { useState, Profiler } from 'react';
import Message from './Message.jsx';
import { useOnlineStatus } from '../useOnlineStatus.js';

function onRender(id, phase, actualDuration, baseDuration) {
  console.log(id, phase, actualDuration.toFixed(2), baseDuration.toFixed(2));
}

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

export default function ChatRoom() {
  const isOnline = useOnlineStatus();
  const [messages] = useState(initialMessages);
  const [text, setText] = useState('');
  return (
    <section>
      <h1>{isOnline ? 'Online' : 'Offline'}</h1>
      ~<Profiler id="MessageList" onRender={onRender}>~ {/* Measures the list and its three rows */}
        <ul>
          {messages.map(m => (
            <Message key={m.id} text={m.text} />
          ))}
        </ul>
      </Profiler>
      <input value={text} onChange={e => setText(e.target.value)} />
    </section>
  );
}
```

The string `'MessageList'` is our custom identifier. React passes this identifier back as the first parameter to `onRender`, allowing a single shared callback to handle logs from multiple `<Profiler>` trees.

### Without `memo`: the Two Numbers Agree

To observe the baseline behavior, remove `memo` from `Message` temporarily. Reload the page, clear the Console, and type the letter `O` into the message field:

```page width=text caption="The chat room after the user types O, with no memo on Message: onRender prints two numbers that are about the same."
heading: Online
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  | O | good
log: MessageList update 120.40 120.55 | ChatRoom.jsx:6
```

Both numbers are virtually identical, appearing as if the same measurement printed twice. While the numbers look similar, they represent two different calculations. `actualDuration` is the time spent on this specific update. `baseDuration` is the estimate for the entire subtree with nothing skipped. They match here because React skipped nothing: every message row was evaluated.

### With `memo`: the Two Numbers Split

Now wrap `Message` in `memo` again, as established in Principle 3. Reload the page, clear the Console, and type `O` once more:

```page width=text caption="The same chat room after the user types O, with memo on Message: actualDuration falls near zero, and baseDuration stays near the cost of the three rows."
heading: Online
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  | O | good
log: MessageList update 0.10 120.55 | ChatRoom.jsx:6
```

**`actualDuration` plummets close to zero, while `baseDuration` remains near the full cost of rendering the three rows.** React skipped evaluating the three message components because their props remained unchanged. Yet `baseDuration` still tallies the most recent render costs of those rows. The gap between the two numbers, about 120 milliseconds, represents the exact time saved by memoization on this keystroke. If a later code change breaks memoization, actualDuration will immediately jump back up to match baseDuration. The console immediately exposes the regression.

```tree caption="What the two numbers of onRender show on one keystroke, without memo and with memo on Message."
`actualDuration` against `baseDuration` on one keystroke
- !Without `memo` | All three rows **render** | Both numbers are about **120**: nothing was skipped
- +With `memo` on `Message` | React **skips** the three rows | `actualDuration` near **0**, `baseDuration` still about **120**
```

### The Other Two Numbers: `startTime` and `commitTime`

React passes two additional timestamp arguments to `onRender`, following `baseDuration`:
- **`startTime`** is a high-resolution timestamp indicating when React began rendering this specific update.
- **`commitTime`** is a high-resolution timestamp indicating when React committed the completed update to the DOM. As the React documentation explains, it "is shared between all profilers in a commit, enabling them to be grouped if desirable."

A complex interface can include multiple `<Profiler>` trees monitoring different regions of the page. When a single interaction triggers updates across several profilers, all corresponding `onRender` invocations receive the identical `commitTime`. This shared timestamp enables telemetry code to group measurements that belong to the same user action.

### A Production Build Prints No `onRender` Line

To evaluate optimizations under real production conditions, you run `npm run build` and launch the production build (Lesson 46). When the user types into the input field, the Console outputs no `MessageList` lines whatsoever.

Developers often misinterpret this silence as a bug, assuming the component failed to render or that `<Profiler>` is broken. Both interpretations are incorrect. The React documentation clarifies why this occurs: "Profiling adds some additional overhead, so it is disabled in the production build by default. To opt into production profiling, you need to enable a special production build with profiling enabled."

This configuration is known as the **profiling build**: a React production build with profiling hooks retained. To use it, your application imports from React DOM's profiling entry point rather than the standard client package:

```jsx title="src/main.jsx in the profiling build"
import { createRoot } from ~'react-dom/profiling'~; // Instead of react-dom/client: the production build, with profiling on
```

The documentation recommends configuring this swap at build time using a bundler alias. A bundler, such as Vite, compiles and packages modules for the browser (Lesson 46). In a diagnostic build configuration, a bundler alias maps standard client imports to the profiling package.

When running under the profiling build, the production application outputs `MessageList` logs normally. The reported durations are smaller than in development because production mode omits `<StrictMode>` double renders and development warning checks.

Remember that `<Profiler>` itself introduces slight overhead. As the React documentation notes: "Each use adds some CPU and memory overhead to an application." Overhead refers to the additional processing required by the measurement tools themselves. Therefore, place `<Profiler>` components only around subtrees you actively need to measure, and remove both the profiler boundaries and the build alias once performance auditing is complete.

---

## All 4 Principles Together

### The Complete Chat Room

Here is the complete project structure. `Message` preserves its artificial delay loop, representing heavy rendering work, and its `memo` wrapper, as directed by our profiling data:

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

```js title="src/useOnlineStatus.js"
import { useSyncExternalStore, useDebugValue } from 'react';

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  ~useDebugValue(isOnline ? 'Online' : 'Offline')~; // Principle 2: the Components tab shows OnlineStatus: "Online"
  return isOnline;
}
```

```jsx title="src/components/ChatRoom.jsx"
import { useState, Profiler } from 'react';
import Message from './Message.jsx';
import { useOnlineStatus } from '../useOnlineStatus.js';

function onRender(id, phase, actualDuration, ~baseDuration~) { // Principle 4: the cost if React skipped nothing
  console.log(id, phase, actualDuration.toFixed(2), baseDuration.toFixed(2));
}

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

export default function ChatRoom() {
  const isOnline = useOnlineStatus();
  const [messages] = useState(initialMessages);
  const [text, setText] = ~useState('')~; // Principle 1: the Components tab shows this state and lets us change it
  return (
    <section>
      <h1>{isOnline ? 'Online' : 'Offline'}</h1>
      <Profiler id="MessageList" onRender={onRender}>
        <ul>
          {messages.map(m => (
            <Message key={m.id} text={m.text} />
          ))}
        </ul>
      </Profiler>
      <input value={text} onChange={e => setText(e.target.value)} />
    </section>
  );
}
```

```jsx title="src/components/Message.jsx"
import { memo } from 'react';

function Message({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 20) {
  }
  return <li>{text}</li>;
}

export default ~memo(Message)~; // Principle 3: the recording named Message, so only Message gets memo
```

### How React Calls the Components, and What One Keystroke Does

When the user types a character into the input field, React initiates rendering at `ChatRoom`, whose internal text state updated. React skips calling `App` because `App` state remained untouched (Lesson 54). Inside `ChatRoom`, execution reaches the `<Profiler>`. Because `Message` is wrapped in `memo` and its text prop has not changed, React skips all three rows. React commits the DOM update for the input field, then fires `onRender`:

```tree dir=right caption="What React does after each keystroke in the finished chat room, and where each tool of this lesson reads it."
One keystroke in the finished chat room
- +1. `ChatRoom` | Its state **`text`** changed | `useOnlineStatus` gives **`true`**, labelled **Online** in the Components tab
- +2. `Profiler` MessageList | Measures the **list** and its rows | Adds **no node** to the DOM
- +3. Three `Message` rows | **Skipped** by `memo`: same props | The Profiler tab lists them as **not rendered**
- +4. Commit, then `onRender` | React updates **only the field** | Prints `actualDuration` near **0** next to `baseDuration` near **120**
```

After the page finishes loading, clear the Console and type `OK` into the message field. Each keystroke logs one line:

```page width=text caption="The finished chat room after the user types OK: the letters appear at once, and onRender prints a small actualDuration for each keystroke."
heading: Online
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  | OK | good
log: MessageList update 0.10 120.55 | ChatRoom.jsx:6
log: MessageList update 0.10 120.55 | ChatRoom.jsx:6
```

| Aspect | The Habit to Avoid | The React Rule |
| :--- | :--- | :--- |
| **Finding a component** | Search the Elements panel for `Message`, and find only `<li>` nodes | Read the Components tab, where each component shows its props and state |
| **Checking where a component sits** | Read the provider code repeatedly in the editor | Check the hierarchy in the Components tab, and ensure the provider wraps the consumer component |
| **Reading a custom Hook** | Guess what a raw boolean or number represents | Call `useDebugValue` in shared Hooks, supplying a formatting function when label generation is costly |
| **Finding the slow part** | Time arbitrary lines with `console.time`, then wrap guesses in `memo` | Record the interaction in the Profiler tab, optimize the component with the highest cost, and record again |
| **Proving the fix** | Rely on subjective impressions of responsiveness | Compare `actualDuration` against `baseDuration` in `onRender` to confirm render skipping |
| **Measuring what users get** | Rely on development numbers, or expect `onRender` in standard production builds | Use the profiling build, `react-dom/profiling`, and remove `<Profiler>` when auditing is done |

Remember the central thesis of this lesson: **the browser knows the DOM nodes, React knows the components, so ask React**. Inspect components in the Components tab, label your shared Hooks with `useDebugValue`, and profile real interactions before introducing optimizations.

---

## For the Interview

> **The Interview Question:** How do you inspect component trees, label and audit hook state, and profile renders with React Developer Tools?

### How to Answer Clearly in 30 Seconds

"React Developer Tools is a browser extension that inspects React's runtime component hierarchy rather than the browser DOM. It provides two essential panels:
1. **The Components tab** displays the live component tree along with the props, state, and Hooks of any selected component. It allows developers to edit state interactively to test UI behavior and visually verify whether components sit correctly within context providers.
2. **The Profiler tab** records user interactions and displays flamegraph visualizations of each commit, identifying which components re-rendered and their exact render durations. This allows developers to pinpoint slow components with empirical data rather than guesswork before applying optimizations like `memo`.

For custom Hooks, `useDebugValue` adds readable status labels in the Components tab, using an optional formatting function to avoid computing labels when DevTools is closed. In application code, `<Profiler>` provides `actualDuration` and `baseDuration` in its `onRender` callback to verify memoization efficiency, which requires React's dedicated profiling build in production."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does the Elements panel not show your components, while React Developer Tools does?"**
   The browser Elements panel displays the real DOM tree, where component tags never exist. React components are JavaScript functions that return JSX element descriptors; React calls them and inserts the resulting native DOM nodes into the page. React Developer Tools hooks directly into React's internal fiber architecture, which preserves component function names, props, state, and context relationships. This internal view also allows developers to inspect context hierarchy and verify whether consumers are correctly nested under providers. For browsers without extension support, the standalone react-devtools package provides the exact same tools. It connects to the web page via a local WebSocket connection.
2. **"When do you use `useDebugValue`, and why does it accept a function?"**
   `useDebugValue` is best reserved for shared custom Hooks in design systems or libraries, especially those maintaining complex internal state that is hard to interpret from raw values alone. It returns nothing and does not affect the component's rendered output. The optional second argument is a formatting function that transforms the raw value into display text. Because arguments are evaluated eagerly in JavaScript, passing a formatted string directly runs formatting logic on every render for every user. Passing a formatting function allows React DevTools to defer execution, running the formatter only when a developer actively selects and inspects that component in the Components tab.
3. **"Your recording in development shows 40 milliseconds for each row. Is that what users get, and how do you measure production?"**
   No. Development timings are significantly higher than real-world user latency. In development, `<StrictMode>` executes render functions twice to catch side effects, runtime warning checks run continuously, and DevTools hooks inject measurement overhead. Development profiling indicates *which* component is relatively expensive, not its absolute production speed. Standard production builds disable profiling instrumentation completely to maximize runtime performance, causing `<Profiler>` callbacks to stay silent. To measure production performance, you must create a profiling build by aliasing `react-dom/client` to `react-dom/profiling`. Additionally, React 19.2 integrates with browser Performance tracks, allowing React component flamegraphs to appear directly in the browser's native Performance panel alongside network and layout tracks.

```tree dir=right caption="Interview summary: what each tool of React Developer Tools answers, and the code version of each."
What React Developer Tools answers
- +Components tab | **Which component**, with what **props and state** | Checks the **hierarchy**, such as a provider in the wrong place
- +`useDebugValue` | **What a custom Hook holds**, in words | Shows **`OnlineStatus: "Online"`** instead of `true`
- +Profiler tab | **Which component rendered**, and **how long** it took | Record, fix the costliest one, **record again**
- +`Profiler` in code | `actualDuration` against **`baseDuration`** | Proves `memo` works; needs the **profiling build** in production
```
