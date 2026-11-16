# Lecture 65: How flushSync Puts a New Message on the Page Before the Scroll

*(Why does a chat scroll to the message before the one you just sent?)*

> INTERVIEW QUESTION | ❱❱ MORE | What does flushSync do, and when is it the right escape hatch?

---

## VS | A Setter Alone vs. a Setter Inside `flushSync`: the setter alone changes the DOM after the handler ends, `flushSync` changes it before the next line

> In plain JavaScript, adding an element to the DOM updates the page immediately on that line. **In React, a setter only queues an update: React flushes changes after the handler ends, while flushSync updates the DOM immediately**. When the next line must scroll to the new node, wrap the setter in `flushSync`.

In plain JavaScript, you append DOM nodes directly using browser methods like `appendChild`. The browser updates the document tree synchronously on that exact line. Because the new element exists in the DOM at once, the very next statement can scroll to it without issue:

```js title="Plain JavaScript: the row is in the DOM on its own line"
list.appendChild(newRow); // The browser adds the row right now
~list.lastChild~.scrollIntoView(); // The last row is the new row
```

The browser gives every DOM element a property named `lastChild`. It points to the final child node currently present inside that parent element.

In React, you never manipulate DOM nodes by hand. You call a state setter, and React renders JSX elements into HTML on your behalf. Calling a setter does not change the page on that line. The setter merely records a pending state update in React's internal queue. React waits until the entire event handler finishes, reconciles the component tree, and updates the DOM in a single commit phase (Lesson 16). Because of this delay, a scroll command placed immediately after a setter inspects the old list:

```jsx title="React: the setter only asks for a render"
setMessages([...messages, newMessage]); // The DOM is unchanged on this line
~listRef.current.lastChild~.scrollIntoView(); // **WRONG:** the last row is still the old one
```

Consider a chat application. A user types a message and clicks Send. The new message should appear at the bottom of the list, and the view should scroll down to display it. Every chat interface relies on this pattern, and users notice immediately when it breaks.

When the scroll line executes, is the new message in the DOM? It is not. Because React has not re-rendered yet, the container scrolls to the previous message. The newly sent message remains hidden beneath the bottom edge of the container. The React documentation highlights this exact timing mistake: the scroll always lags behind by one item.

Developers often read this code sequentially as add the message, then scroll to it. But a state setter is a deferred request to React, not a direct command to the browser. When the scroll line runs, the browser DOM still displays the old list. No errors appear in the Console because every line contains valid JavaScript. The scroll simply executes before React updates the DOM.

This scenario is the primary purpose of `flushSync`, an escape hatch exported from the `react-dom` package. When you wrap a state setter inside `flushSync`, React executes a synchronous render pass and mutates the DOM immediately, before your subsequent code executes:

```jsx title="React with flushSync: the row is in the DOM before the next line"
~flushSync~(() => { // React renders and changes the DOM before this call returns
  setMessages([...messages, newMessage]);
});
listRef.current.lastChild.scrollIntoView(); // The last row is now the new message
```

Keep one core truth in mind throughout this lesson: **flushSync forces React to update the DOM before the next line of your code runs**. As the React documentation explains, by the time the next line runs, React has already updated the DOM.

### The Three Words This Lesson Stands On

> [!DEFINITION]
> **Batching.** [REVIEW] A state setter does not mutate the DOM immediately. Instead, React queues the requested update. React waits until the active event handler completes, then processes all queued updates together in a single render pass. Grouping state updates avoids redundant rendering cycles and prevents intermediate UI states from flickering on the screen (Lesson 16).

> [!DEFINITION]
> **A ref on a JSX tag.** [REVIEW] In plain JavaScript, you query elements with browser methods like `document.getElementById`. In React, you obtain direct access to a DOM node by attaching a ref: `<ul ref={listRef}>`. When React commits the element to the page, it assigns that real DOM node to `listRef.current`. Your code can then call native DOM methods on it, such as `scrollIntoView()` (Lesson 31).

> [!DEFINITION]
> **What is flushSync?** [NEW] `flushSync` is an escape hatch function exported by the `react-dom` package. You pass it a callback containing your state updates. React runs that callback immediately, then flushes all pending updates, renders the affected components, and updates the DOM synchronously before returning. The word flush means processing queued work immediately, while sync means the DOM changes before your next line of code runs (Lesson 65).

Calling `flushSync` halts React's normal batching mechanism. It instructs React to take the pending state changes, compute the UI updates right away, and commit them to the page before your code proceeds.

### What It Costs

Batching is the default behavior because it protects application speed. React normally consolidates multiple state setters into a single render pass per user interaction. Calling `flushSync` opts out of that protection. React renders and mutates the DOM immediately in the middle of your event handler.

The React documentation cautions that `flushSync` can significantly hurt performance. It serves as a specialized escape hatch, designed for rare scenarios where no declarative React pattern can satisfy the requirement.

### The Rule of Thumb: does the next line need the new DOM?

Ask one question about every state setter: does the next line of code read the DOM, such as scrolling or measuring an element? If yes, wrap the setters in `flushSync`. If the following code only handles JavaScript logic, a standard setter is preferred.

Senior developers recognize four classic mistakes:
1. **Expecting a setter to mutate the page immediately.** The following line reads stale DOM nodes, causing the scroll to stop one item short.
2. **Placing the scroll logic inside the flushSync callback.** The scroll executes before React performs the synchronous render pass, so the container still lags.
3. **Calling flushSync inside an Effect.** React cannot flush synchronously while actively rendering or committing, so it logs a warning and does nothing.
4. **Wrapping every setter in a separate flushSync call.** Each call triggers an independent render pass, turning a single user action into multiple renders.

Another common pitfall involves imports: developers often look for `flushSync` inside `react`. Because it interacts directly with the browser document tree, it lives in `react-dom`.

The remainder of this lesson demonstrates each mistake in a live chat interface.

## SECTION | A Chat Room That Scrolls

Our example features a chat room with six messages inside a scrollable container. The message list has a fixed height that fits only three rows. When the chat interface loads, it displays the first three items, while the remaining three rest below the visible boundary:

```page width=text caption="The chat room when it opens: the list shows the first three of six messages, above an empty message field and a Send button."
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  |
  button: Send
```

The project keeps four files inside the source folder:

```files title="chat-room: File Explorer" caption="How the files of our chat room sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `index.css` and mounts `App` inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<ChatRoom />`
  index.css | styles | Gives the list a fixed height and lets it scroll
  components/
    ChatRoom.jsx | state | Holds `messages` and `text`, and renders the list, the message field, and the Send button
```

The entry file mounts the application inside `<StrictMode>` (Lesson 47). The top component `App` renders the chat room. The stylesheet establishes the fixed container height:

```css title="src/index.css"
.messages {
  height: 90px;
  overflow-y: auto;
}

.messages li {
  line-height: 30px;
}
```

Each row has a line height of 30 pixels, and the container height is 90 pixels, displaying exactly three messages at a time. The CSS rule `overflow-y: auto` enables vertical scrolling when items overflow the container. Users can scroll the message history independently while the rest of the application remains stationary.

`ChatRoom` stores the message history and the input draft in component state, while attaching a ref to the list container:

```jsx title="src/components/ChatRoom.jsx"
import { useState, useRef } from 'react';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
  { id: 4, text: 'Where?' },
  { id: 5, text: 'The cafe on Main Street' },
  { id: 6, text: 'See you there' },
];

let nextId = 7;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const listRef = ~useRef(null)~; // React puts the ul element here when it adds it to the DOM

  function handleSend() {
    const newMessage = { id: nextId++, text: text };
    setText('');
    setMessages([...messages, newMessage]);
  }

  return (
    <section>
      <ul className="messages" ref={listRef}>
        {messages.map(m => (
          <li key={m.id}>{m.text}</li>
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

Two identifiers come from earlier lessons:
- The variable `nextId` acts as a module-scoped counter, ensuring each new message receives a unique `key` prop (Lesson 18).
- The property `listRef.current` stores the `<ul>` DOM node, assigned by React during DOM reconciliation (Lesson 31).

At present, clicking Send appends the message and resets the input field, but the container does not scroll. The new item is placed into a seventh row below the visible view. Next, we implement scrolling and observe four distinct failure modes:

**PRINCIPLES:** A state setter never mutates the DOM immediately on its line of code. React applies DOM updates after the event handler ends, while `flushSync` forces immediate reconciliation. Four core principles guide this behavior:
1. **Principle 1: A Setter Does Not Change the DOM on Its Own Line.** Calling a scroll method right after a setter reads the un-updated DOM, causing the view to stop one item short.
2. **Principle 2: flushSync Puts the New Message in the DOM Before the Next Line.** Wrap the state setters in `flushSync`, and place DOM inspection logic on the line immediately following it.
3. **Principle 3: flushSync Inside an Effect Forces Nothing.** Because React is actively rendering or committing, it ignores the synchronous flush and logs a console error.
4. **Principle 4: Every flushSync Call Is One More Render.** Each call forces a separate render and DOM commit, so use one wrapper per user event.

---

## PRINCIPLE | A setter: React changes the DOM only after the event handler ends

> [!PRINCIPLE]
> **Principle 1: Batching: A Setter Does Not Change the DOM on Its Own Line**
>
> *A state setter inside an event handler only queues a request to render. React updates the DOM after the entire handler completes, so code following the setter still inspects the previous DOM state.*
>
> When a user sends a message, the list scrolls down but halts on the previous message. The setter scheduled an update without modifying DOM nodes immediately. Code that only reads JavaScript data, such as sending a payload to an API, can use `newMessage` immediately. Code that targets new DOM elements must wait for React to finish rendering, or force a synchronous flush as shown in Principle 2.
>
> **DO THIS:**
> ```jsx
> function handleSend() {
>   setMessages([...messages, newMessage]);
>   ~sendToServer(newMessage)~; // Uses the message itself, not the DOM, so nothing lags
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleSend() {
>   setMessages([...messages, newMessage]);
>   ~listRef.current.lastChild~.scrollIntoView(); // **WRONG:** the DOM still holds the old list
> }
> ```

### VS | `appendChild` vs. a Setter: the browser adds the row on that line, React adds it after the handler

Both snippets below append a row to a list and scroll to the final item. They differ in which system modifies the document: native browser code or React's reconciler.

```js title="Plain JavaScript: a command to the browser"
list.appendChild(newRow); // The DOM has the new row right now
~list.lastChild~.scrollIntoView(); // Scrolls to the new row
```

```jsx title="React: a request to React"
setMessages([...messages, newMessage]); // The DOM is unchanged on this line
~listRef.current.lastChild~.scrollIntoView(); // **WRONG:** scrolls to the old last row
```

Both examples read as append the row, then scroll to it. While they look similar syntactically, their underlying execution models are fundamentally different. Calling `appendChild` is an imperative browser command that inserts a DOM node immediately (Lesson 13). Calling a state setter is a declarative update request, and React processes that request only after your event handler exits.

### The Scroll Line in the Chat Room

We add a scroll statement to the end of `handleSend`:

```jsx title="src/components/ChatRoom.jsx" startLine="19"
  function handleSend() {
    const newMessage = { id: nextId++, text: text };
    setText('');
    setMessages([...messages, newMessage]);
    ~listRef.current.lastChild~.scrollIntoView(); // **WRONG:** the last row in the DOM is still See you there
  }
```

The user types `On my way` into the message field:

```page width=text caption="The chat room before the click: the first three messages, and On my way typed into the message field."
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  | On my way
  button: Send
```

Next, the user clicks Send. The list scrolls downward, but stops on `See you there`. The newly submitted message exists in the list, but sits one position below the visible boundary:

```page width=text caption="The chat room after the click: the list stops on See you there, and the message field is empty."
line: Where?
line: The cafe on Main Street
line: See you there | bad
form:
  field:  |
  button: Send
```

Did React fail to render the message? The Elements panel reveals that React did insert the new item as the seventh `<li>`:

```dom caption="The Elements panel after the click: React added On my way as the seventh li, after the scroll had already run."
<ul class="messages">
  <li>Hi!</li>
  <li>Lunch at 12?</li>
  <li>Sure</li>
  <li>Where?</li>
  <li>The cafe on Main Street</li>
  <li>See you there</li>
+ <li>On my way</li> | note: Added by React after handleSend ended
</ul>
```

### Why the List Stops on See you there

The scroll executes before React updates the DOM tree. The runtime follows this exact sequence:
1. The user clicks Send, and React invokes `handleSend`.
2. The two state setters place update requests into React's queue, leaving the DOM untouched.
3. The scroll statement reads `listRef.current.lastChild`. Because the DOM still contains the initial six items, `lastChild` resolves to `See you there`.
4. The browser scrolls the list container down to `See you there`.
5. The `handleSend` function concludes. React now re-renders `ChatRoom` with seven messages and commits the seventh `<li>` to the DOM.

The React documentation explains the cause: state updates are queued, and setters do not update the DOM immediately. When the scroll statement executes, the new item has not yet been added to the document.

Is batching a defect here? It is not. Batching is a vital performance feature that prevents multiple re-renders during a single event. The issue stems solely from our scroll logic requiring the future DOM state while the current event handler is still running.

### The Real Mistake: Blaming the Scroll

Developers confronting this bug often blame the `scrollIntoView()` method. They configure options like smooth scrolling or compute custom scroll offsets by hand. Yet the scroll continues to stop one item short. The browser scrolling method works properly. The issue is entirely an execution timing error.

Remember: a state setter queues a request, and React mutates the DOM only after the event handler completes.

---

## PRINCIPLE | `flushSync`: the DOM is updated before the next line runs

> [!PRINCIPLE]
> **Principle 2: flushSync: The New Message Is in the DOM Before the Next Line**
>
> *When code in an event handler must read or scroll the DOM immediately after a state update, wrap the setters in `flushSync` from `react-dom`, and place the DOM logic on the following line.*
>
> React executes the callback immediately, reconciles component changes, and mutates the DOM before `flushSync` returns. The scroll on the subsequent line targets the new message, making it visible to the user. Only the DOM is updated synchronously: the active event handler continues reading its original state snapshot.
>
> **DO THIS:**
> ```jsx
> flushSync(() => {
>   setMessages([...messages, newMessage]);
> });
> ~listRef.current.lastChild~.scrollIntoView(); // The new message is already in the DOM
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> flushSync(() => {
>   setMessages([...messages, newMessage]);
>   ~listRef.current.lastChild~.scrollIntoView(); // **WRONG:** runs before React renders, so it still stops one message short
> });
> ```

### VS | The Setters Alone vs. the Setters Inside `flushSync`: both lists get the new message, only one shows it

Both event handlers below call the exact same state setters with identical values. Following the button click, both message lists contain the item `On my way`. Yet only one approach displays it:

::: row caption="The same Send handler with the setters alone and with the setters inside flushSync."
::: col title="The setters alone" tag="stops one message short" tone=bad
```page size=mini
line: Where?
line: The cafe on Main Street
line: See you there | bad
form:
  field:  |
  button: Send
```
```jsx title="ChatRoom.jsx" bad="5"
function handleSend() {
  const newMessage = { id: nextId++, text: text };
  setText('');
  setMessages([...messages, newMessage]);
  listRef.current.lastChild.scrollIntoView();
}
```
The scroll runs before React changes the DOM, so it stops on `See you there`.
:::
::: col title="The setters inside flushSync" tag="reaches the new message" tone=good
```page size=mini
line: The cafe on Main Street
line: See you there
line: On my way | good
form:
  field:  |
  button: Send
```
```jsx title="ChatRoom.jsx" good="3,7"
function handleSend() {
  const newMessage = { id: nextId++, text: text };
  flushSync(() => {
    setText('');
    setMessages([...messages, newMessage]);
  });
  listRef.current.lastChild.scrollIntoView();
}
```
React changes the DOM inside `flushSync`, so the scroll reaches `On my way`.
:::
:::

In both implementations, React appends `On my way` to the document. But only when using `flushSync` does the node exist in the DOM before the scroll runs.

### What One flushSync Call Does

The function passed to `flushSync` is its execution callback. React runs this callback immediately inside `flushSync`. The React documentation notes that React will immediately execute this callback and flush any contained updates synchronously.

Here is the operational sequence inside a single `flushSync` call:

```tree dir=right caption="What happens inside one flushSync call, in order."
One `flushSync` call
- +1. React calls our callback [`flushSync`] | The setters inside it **queue their updates**
- +2. React renders [`ChatRoom`] | `ChatRoom` runs with the **new list**
- +3. React changes the DOM | The new `<li>` is **in the DOM**
- +4. `flushSync` returns | The next line **sees the new DOM**
```

### flushSync in the Chat Room

`flushSync` does not belong to the core `react` package. We import it from `react-dom`, the same package whose client entry provides `createRoot` (Lesson 07). The React documentation categorizes it among browser-specific utilities that are rarely needed.

```jsx title="src/components/ChatRoom.jsx" startLine="1"
import { useState, useRef } from 'react';
import { ~flushSync~ } from 'react-dom'; // From react-dom, not from react
```

Next, we wrap both state updates inside a single `flushSync` call, mirroring the official solution in the React documentation:

```jsx title="src/components/ChatRoom.jsx" startLine="20"
  function handleSend() {
    const newMessage = { id: nextId++, text: text };
    ~flushSync~(() => { // React renders and changes the DOM for both updates before this call returns
      setText('');
      setMessages([...messages, newMessage]);
    });
    listRef.current.lastChild.scrollIntoView(); // The last row is now On my way
  }
```

The user types `On my way` and clicks Send. The list scrolls directly to the new message, and the message field empties:

```page width=text caption="The chat room after the click with flushSync: the list scrolls to On my way, and the message field is empty."
line: The cafe on Main Street
line: See you there
line: On my way | good
form:
  field:  |
  button: Send
```

The React documentation confirms this outcome: the last item will already exist in the DOM by the time the scroll logic targets it.

### The DOM Changes, the Variable Does Not

A critical distinction often trips up developers: **flushSync mutates the DOM, not the local state variable.** When the call returns, the DOM displays seven list items. But inside the active `handleSend` execution, `messages` still contains six items.

Why does this happen? The variable `messages` represents a state snapshot bound to the render pass during which the click occurred (Lesson 15). Calling `flushSync` instructs React to compute and commit the next render cycle, which produces its own separate state snapshot. The running event handler closure continues reading its original variables:

```jsx title="The DOM and the snapshot right after flushSync"
flushSync(() => {
  setMessages([...messages, newMessage]);
});
console.log(~listRef.current.lastChild.textContent~); // On my way: the DOM already has the new row
console.log(~messages[messages.length - 1].text~); // See you there: this handler still reads its own snapshot
```

What does `flushSync` return? It returns whatever value your callback returns. Because our callback produces no return value, `flushSync` evaluates to `undefined`.

### Only the Setters Go Inside the Callback

A developer might assume that `flushSync` manages all immediate actions, moving the scroll call inside the callback as well:

```jsx title="The scroll written inside the callback"
flushSync(() => {
  setMessages([...messages, newMessage]);
  ~listRef.current.lastChild~.scrollIntoView(); // **WRONG:** React has not rendered yet, so this still finds See you there
});
```

The container still stops one message short. React initiates rendering only after the callback finishes execution. Placing the scroll logic inside the callback executes it before the render pass, producing the exact same bug.

The React documentation states precisely when the DOM updates: right after the code wrapped in `flushSync` executes. Place state updates inside the callback, and place DOM reading or scrolling code on the following line.

### What Else flushSync May Flush

In addition to the updates inside its callback, `flushSync` may synchronously flush related pending work:
1. **Pending updates outside the callback.** If an earlier user action queued state updates that have not yet rendered, React may flush those updates before executing the callback.
2. **Pending Effects.** React may flush queued passive Effects that have not yet executed.
3. **Updates within those Effects.** React may synchronously apply any secondary state updates triggered by those Effects before returning.

While an earlier setter in the same handler might be flushed automatically, the React documentation provides no guarantee. For that reason, we wrap both related state setters inside the single `flushSync` callback.

Remember: `flushSync` forces React to update the DOM before the next line of your code runs.

---

## PRINCIPLE | `flushSync` inside an Effect: React is busy, so it forces nothing and prints an error

> [!PRINCIPLE]
> **Principle 3: Where flushSync Runs: Inside an Effect It Forces Nothing**
>
> *Invoke `flushSync` from an event handler. React cannot perform a synchronous flush while actively rendering or committing inside `useEffect`, `useLayoutEffect`, or lifecycle methods, so it ignores the call and logs an error.*
>
> React can perform a synchronous render pass only when it is not already executing its own rendering pipeline. An event handler executes while React is idle. An Effect executes during React's commit phase, so `flushSync` is rejected, and the Console warns that `flushSync` was called from inside a lifecycle method. Move the call into an event handler, or defer it using `queueMicrotask` as a last resort.
>
> **DO THIS:**
> ```jsx
> function handleSend() {
>   ~flushSync~(() => { // In an event handler, React can flush
>     setMessages([...messages, newMessage]);
>   });
>   listRef.current.lastChild.scrollIntoView();
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   ~flushSync~(() => { // **WRONG:** inside an Effect, React prints an error and forces nothing
>     setMessages([...messages, { id: nextId++, text: 'Welcome to the chat' }]);
>   });
> }, []);
> ```

### VS | `flushSync` in a Click Handler vs. in an Effect: React can flush after a click, not in the middle of its own work

Both code examples below execute the same `flushSync` statement. One resides in a click handler, while the other sits inside an Effect:

```jsx title="flushSync in a click handler"
function handleSend() {
  ~flushSync~(() => { // React is not rendering: it can flush now
    setMessages([...messages, newMessage]);
  });
}
```

```jsx title="flushSync in an Effect"
useEffect(() => {
  ~flushSync~(() => { // **WRONG:** React is still finishing its own work: it cannot flush here
    setMessages([...messages, { id: nextId++, text: 'Welcome to the chat' }]);
  });
}, []);
```

While the two calls look identical, their runtime contexts differ completely. When a user clicks a button, React is idle and can cleanly execute a synchronous render pass. When an Effect runs, React is actively completing a commit phase and cannot start a nested render cycle.

The React documentation states this clearly: React cannot flush synchronously during a render, and doing so causes React to warn and take no action.

### A Welcome Line When the Chat Opens

Suppose a developer attempts to add an automated greeting to the list when the chat room loads. They write an Effect and wrap the state update in `flushSync` under the assumption that it guarantees safety:

```jsx title="src/components/ChatRoom.jsx"
useEffect(() => {
  ~flushSync~(() => { // **WRONG:** called inside an Effect, so React prints an error and forces nothing
    setMessages([...messages, { id: nextId++, text: 'Welcome to the chat' }]);
  });
}, []);
```

The chat opens, and the Console displays the same red error message twice:

```devconsole width=full caption="The Console when the chat opens with flushSync inside the Effect: one error for each run of the Effect."
x flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.
x flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.
```

The `flushSync` call produced no synchronous update. The execution unfolds as follows:
1. The chat room loads, and React renders `ChatRoom` with the initial six messages.
2. React executes the Effect, which invokes `flushSync`.
3. Because React is currently in the middle of its commit phase, `flushSync` cannot run a new render. React logs a console error instead.
4. The greeting still renders later when React processes normal queued updates. But the synchronous guarantee promised by `flushSync` did not occur.

Why does the error print twice? In development mode, `<StrictMode>` mounts and remounts components to verify cleanup routines (Lesson 47). Each run invokes `flushSync` and logs the warning.

### Why the Error Names a Lifecycle Method

Our component uses modern Hooks rather than class lifecycle methods, yet the warning cites a lifecycle method. React shares this internal warning across all execution phases where the renderer is busy. The documentation identifies three such locations:
1. While a component is actively executing its render function.
2. Inside the body of `useLayoutEffect` or `useEffect`.
3. Inside class component lifecycle methods.

An Effect falls directly into the second category. The suggestion in the warning points to the fallback solution described below.

### The Two Fixes from React's Docs

The React documentation outlines two approaches to resolve this warning:
1. **Move the call to an event handler.** The recommended solution is placing `flushSync` in response to user gestures. Our Send handler already follows this pattern.
2. **Defer execution using a microtask.** A microtask is a brief JavaScript task executed immediately after the current call stack clears. The browser utility `queueMicrotask` schedules work to run right after React finishes its commit phase:

```jsx title="The last-resort fix: flushSync inside queueMicrotask"
useEffect(() => {
  ~queueMicrotask~(() => { // Runs after React finishes its current work
    flushSync(() => {
      setMessages([...messages, { id: nextId++, text: 'Welcome to the chat' }]);
    });
  });
}, []);
```

The React documentation emphasizes that this pattern damages performance even further. Exhaust every alternative before using `flushSync` inside a microtask.

### The Welcome Line Needs Neither Fix

Our welcome message requires neither workaround. Because no code reads the DOM immediately after adding the greeting, a standard state setter is completely sufficient.

Furthermore, an Effect already executes after React updates the DOM (Lesson 32). Any logic inside an Effect that inspects DOM nodes already sees the rendered result without `flushSync`. We remove the welcome Effect, returning the chat room to its standard six messages.

Remember: `flushSync` belongs inside an event handler where React is idle.

---

## PRINCIPLE | `flushSync`: every call is one more render, so use one call per event

> [!PRINCIPLE]
> **Principle 4: The Cost of flushSync: Two Calls Turn One Send into Two Renders**
>
> *Every `flushSync` invocation forces an immediate render cycle and DOM commit. Use at most one call per user event, and only when logic requires immediate DOM access.*
>
> Automatic batching consolidates multiple state setters into a single render pass. Calling `flushSync` bypasses batching and renders immediately, so two separate calls in one handler force two renders for a single user action. It can also re-trigger Suspense fallbacks and interrupt View Transitions. Reserve it for immediate DOM scrolling, measurements, or browser events like `beforeprint` that inspect the document synchronously.
>
> **DO THIS:**
> ```jsx
> ~flushSync~(() => { // One render and one DOM change for the whole Send
>   setText('');
>   setMessages([...messages, newMessage]);
> });
> listRef.current.lastChild.scrollIntoView();
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~flushSync~(() => { // **WRONG:** a second flushSync below makes one click render twice
>   setText('');
> });
> flushSync(() => {
>   setMessages([...messages, newMessage]);
> });
> ```

### VS | One `flushSync` Around Both Setters vs. One per Setter: the same page, twice the renders

Both event handlers below leave the application in the same final state: an empty text input and the list scrolled to `On my way`. They differ in the number of render passes executed by React:

```jsx title="One flushSync around both setters"
~flushSync~(() => { // One render for both updates
  setText('');
  setMessages([...messages, newMessage]);
});
listRef.current.lastChild.scrollIntoView();
```

```jsx title="One flushSync per setter"
~flushSync~(() => { // First render: only the message field changes
  setText('');
});
~flushSync~(() => { // Second render: now the list changes
  setMessages([...messages, newMessage]);
});
listRef.current.lastChild.scrollIntoView();
```

While the visual outcome is identical, the rendering cost doubles. Each `flushSync` call initiates a separate render cycle. Between the two invocations, React commits an incomplete UI to the screen: an emptied text input alongside the old message list. Batching exists specifically to prevent these intermediate UI states (Lesson 16).

### Count the Renders in the Console

To track render cycles, we log a message whenever React invokes `ChatRoom` (Lesson 54):

```jsx title="src/components/ChatRoom.jsx" startLine="15"
export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const listRef = useRef(null);
  ~console.log('ChatRoom rendered')~; // Prints once each time React calls ChatRoom
```

Two details apply to our render counting:
- In development, `<StrictMode>` executes components twice per render pass to detect side effects (Lesson 47). Each render outputs a pair of log statements.
- Typing each character triggers an independent render pass. We type `On my way` first, clear the Console, and then click Send.

Wrapping both state setters in a single `flushSync` call produces one render pass, logged as a single pair of statements:

```page width=text caption="After one click with one flushSync around both setters: one render, printed as one pair of lines."
line: The cafe on Main Street
line: See you there
line: On my way | good
form:
  field:  |
  button: Send
log: ChatRoom rendered | ChatRoom.jsx:19
log: ChatRoom rendered | ChatRoom.jsx:19
```

Using separate `flushSync` calls for each setter causes two render passes, producing four log statements:

```page width=text caption="After one click with one flushSync per setter: the same page, but two renders, printed as two pairs of lines."
line: The cafe on Main Street
line: See you there
line: On my way | good
form:
  field:  |
  button: Send
log: ChatRoom rendered | ChatRoom.jsx:19
log: ChatRoom rendered | ChatRoom.jsx:19
log: ChatRoom rendered | ChatRoom.jsx:19
log: ChatRoom rendered | ChatRoom.jsx:19
```

The user sees the same visual end state. But React performed two full component render passes and layout updates for a single button click.

What about the standard implementation from Principle 1 without `flushSync`? It also executes one render pass, matching the efficiency of a single `flushSync` wrapper. The difference is timing: standard batching updates the DOM after the handler exits, while `flushSync` updates the DOM inside the handler before the scroll line runs.

### What flushSync Costs

A developer might be tempted to wrap every setter across an application in `flushSync` to ensure the DOM is constantly updated. The React documentation enumerates the performance penalties:
1. **Excessive rendering cycles.** Each call triggers an immediate render pass that cannot be batched with other state updates. React identifies `flushSync` as the direct mechanism to opt out of automatic batching.
2. **Premature Suspense fallbacks.** Calling `flushSync` can force pending Suspense boundaries to reveal their fallback indicators prematurely (Lesson 69).
3. **Aborted View Transitions.** If `flushSync` executes during an active View Transition, React cancels the transition animation (Lesson 74).

The React documentation states this clearly: using `flushSync` is uncommon, and using it frequently can significantly degrade application performance. In most situations `flushSync` should be avoided and used strictly as a last resort.

### When flushSync Is the Right Escape Hatch

Like a ref, `flushSync` acts as an escape hatch outside React's typical declarative data flow (Lesson 30). The React documentation identifies two valid use cases:
1. **An event handler must read, measure, or scroll the DOM immediately after updating state.** Our chat scrolling feature represents this case.
2. **A third-party integration or browser API inspects the DOM synchronously within a callback.** Some browser APIs require DOM updates to complete before their callback exits so the browser can process the rendered elements.

The React documentation illustrates the second use case with browser printing. The browser emits a `beforeprint` event right before displaying the print preview window. It prints the document as it exists when that event handler exits.

The example features an interface with a status indicator that displays `isPrinting: yes` or `isPrinting: no`:

```jsx title="React's docs: setting isPrinting inside flushSync before the browser prints"
export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      ~flushSync~(() => { // The DOM shows isPrinting: yes before the print dialog reads it
        setIsPrinting(true);
      });
    }
    function handleAfterPrint() {
      setIsPrinting(false);
    }
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>Print</button>
    </>
  );
}
```

Using `flushSync` ensures the print preview displays `isPrinting: yes`. Without it, the print preview captures `isPrinting: no` because React would defer DOM updates until after the browser reads the page.

Does this snippet violate Principle 3? It does not. The Effect only attaches and cleans up event listeners. The `flushSync` invocation sits inside `handleBeforePrint`, which the browser invokes later while React is not rendering.

Outside these specific integration needs, `flushSync` is unnecessary. The React documentation confirms that standard React applications without specialized third-party dependencies rarely need `flushSync`. When an update is not tied to a discrete user event, an Effect is typically the proper declarative solution.

Remember: use at most one `flushSync` wrapper per event, and only when the following line requires the updated DOM.

---

## All 4 Principles Together

### The Complete Chat Room

Here is the finished project. The entry file imports styles and mounts `App` inside `<StrictMode>`:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

The `App` component renders the chat interface:

```jsx title="src/App.jsx"
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return <ChatRoom />;
}
```

The stylesheet establishes the three-row container height and enables scrolling:

```css title="src/index.css"
.messages {
  height: 90px;
  overflow-y: auto;
}

.messages li {
  line-height: 30px;
}
```

`ChatRoom` wraps both state updates in a single `flushSync` call and scrolls on the subsequent line:

```jsx title="src/components/ChatRoom.jsx"
import { useState, useRef } from 'react';
import { ~flushSync~ } from 'react-dom'; // Principle 2: from react-dom, not from react

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
  { id: 4, text: 'Where?' },
  { id: 5, text: 'The cafe on Main Street' },
  { id: 6, text: 'See you there' },
];

let nextId = 7;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const listRef = useRef(null);
  console.log('ChatRoom rendered');

  function handleSend() {
    const newMessage = { id: nextId++, text: text };
    ~flushSync~(() => { // Principles 1, 3 and 4: one call, in an event handler, around both setters
      setText('');
      setMessages([...messages, newMessage]);
    });
    ~listRef.current.lastChild~.scrollIntoView(); // Principle 2: on the line after, it finds On my way
  }

  return (
    <section>
      <ul className="messages" ref={listRef}>
        {messages.map(m => (
          <li key={m.id}>{m.text}</li>
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

### What Happens When the User Clicks Send

When the application loads, React calls `App`, which renders `ChatRoom`. When the user clicks Send, the following sequence executes inside `handleSend` before the handler completes:

```tree dir=right caption="The order of events in handleSend after the user clicks Send, with flushSync around both setters."
One click on Send
- +1. React calls `handleSend` [`handleSend`] | `newMessage` holds **On my way**
- +2. `flushSync` calls our callback [`setText` `setMessages`] | Both updates are **queued**
- +3. React renders `ChatRoom` | **One render** with seven messages and an empty field
- +4. React changes the DOM | The seventh `<li>` is **in the DOM**
- +5. The scroll line runs [`scrollIntoView`] | The list stops on **On my way**
```

The user types `On my way`, we clear the Console, and the user clicks Send:

```page width=text caption="The finished chat room after one click on Send: the list shows the new message, the message field is empty, and one render prints one pair of lines."
line: The cafe on Main Street
line: See you there
line: On my way | good
form:
  field:  |
  button: Send
log: ChatRoom rendered | ChatRoom.jsx:19
log: ChatRoom rendered | ChatRoom.jsx:19
```

| Aspect | The Common Habit | The React Rule |
| :--- | :--- | :--- |
| **The scroll after a setter** | Scroll on the next line and expect the new row, so the list stops one message short | A setter only queues a render; React changes the DOM after the handler ends |
| **flushSync** | Put the scroll inside the callback too, or look for `flushSync` in `react` | Import it from `react-dom`, put only the setters inside the callback, and scroll on the next line |
| **Where to call it** | Copy `flushSync` into an Effect, which prints an error and forces nothing | Call it from an event handler; defer it with `queueMicrotask` only as a last resort |
| **How often** | Wrap every setter in its own `flushSync`, so one click renders several times | One call per event, only where code must see the DOM right after an update |

Remember the central thesis of this lesson: **flushSync forces React to update the DOM before the next line runs**. Use it only when the following line requires the updated DOM.

---

## For the Interview

> **The Interview Question:** What does flushSync do, and when is it the right escape hatch?

### How to Answer Clearly in 30 Seconds

"Under default React behavior, state setters only queue updates, and React batches renders until the active event handler exits. Any code placed immediately after a setter reads the un-updated DOM. In an interface like a chat list, scrolling right after sending a message targets the previous item because the new DOM node has not been created yet.

`flushSync` from `react-dom` resolves this timing issue. It accepts a callback containing state updates, invokes it immediately, and synchronously flushes the render and DOM commit phases before returning. By the time the next line runs, the DOM reflects the updated state. Three core rules govern its use:
1. **Place only state setters inside the callback**, and place DOM reading or scrolling logic on the subsequent line.
2. **Invoke it only from event handlers.** Calling it inside render functions, `useEffect`, or `useLayoutEffect` triggers a console warning and forces no synchronous update because React is already executing.
3. **Use it sparingly.** Each invocation forces an immediate render pass without batching, which can degrade responsiveness and cause Suspense fallbacks to flash. It is the proper escape hatch when an event handler must inspect the DOM immediately, or when an API like `beforeprint` requires synchronous DOM updates."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"After flushSync returns, does the local state variable hold the new value?"**
   No. `flushSync` updates the browser DOM synchronously, but it does not mutate local state variables in the executing function closure. In `handleSend`, the variable `messages` represents the immutable state snapshot captured during the render pass that created the handler. React cannot rewrite existing JavaScript local variables mid-execution. While `listRef.current.lastChild` reflects the newly committed DOM element, `messages` retains its original array. The new state value will only become available as a variable when React executes subsequent render passes of `ChatRoom`. Furthermore, `flushSync` returns whatever value its callback returns, evaluating to `undefined` when no value is returned.
2. **"What exactly does flushSync flush?"**
   `flushSync` flushes the state updates contained inside its callback. The React documentation notes that it may also flush pending updates queued earlier, along with pending Effects and their internal updates. If an update suspends, React may also force Suspense boundaries to reveal their fallback states immediately. Outside component trees, `flushSync` can also wrap `root.render(...)` calls to ensure an initial render completes synchronously before subsequent code executes.
3. **"Why not call flushSync inside useEffect?"**
   Because React cannot initiate a synchronous render cycle while in the middle of an active commit or render phase. When an Effect runs, React is already finalizing component reconciliation. Calling `flushSync` in an Effect causes React to ignore the flush and log a console warning. Furthermore, an Effect already runs after React has updated the DOM, meaning code inside an Effect can read the updated DOM directly without needing `flushSync`. If an Effect genuinely must force a synchronous update, the React documentation suggests wrapping `flushSync` in `queueMicrotask`, though it cautions that this pattern introduces severe performance penalties.

```tree caption="Interview summary: where flushSync helps, and where it fails or costs too much."
Where `flushSync` belongs
- +In an event handler, before DOM code [`flushSync` `scrollIntoView`] | React renders and changes the DOM **inside the call** | The next line **sees the new DOM**
- !Inside an Effect or during a render [`useEffect` `useLayoutEffect`] | React is **already busy** | It **forces nothing** and prints an **error**
- !Around every setter [`flushSync` everywhere] | **One render per call**, no batching | Slower clicks and **fallbacks shown again**
```
