# Lecture 41: The action Prop on a Form

*(What changes when a form hands its data to a function instead of a URL?)*

> INTERVIEW QUESTION | ❱ CORE | What is the action prop on a form, and how do actions modernize form handling?

---

## VS | `action` with a URL vs. `action` with a function: the URL loads a new page, the function keeps your page

> Handling a form with the classic `onSubmit` requires manual code to prevent page reloads, extract input values, and clear fields. **You should pass your function directly to `<form action={...}>` instead.** React automatically collects the field values into a `FormData` object and executes your function without reloading the page. Once the function completes successfully, React resets the uncontrolled fields for you.

Modern web applications frequently submit form data without navigating away from the current view. Common examples include chat boxes, comment threads, and newsletter signups. In standard HTML, a form `action` attribute points to a server URL, causing the browser to reload the page on submission. In earlier versions of React, developers had to intercept the submit event with `e.preventDefault()`, construct form data manually, and explicitly clear each input. **React 19 allows you to assign a JavaScript function directly to the `action` prop**. React intercepts the submission, extracts input values into a `FormData` object, invokes your function, and clears the inputs upon completion.

Consider a chat interface where a user types a message and clicks Send. The application must read the text, submit it, and clear the input field for the next message. In traditional event handling, you must write code for every single step. With a React 19 form action, you only write the logic to send the message. React automatically supplies the form data and clears the input once the operation succeeds.

**Why this matters:** Pointing a form `action` to a URL causes the browser to navigate to a new page, resetting the application and destroying all client-side state. Handling the submission manually through `onSubmit` requires preventing default navigation, building a data object, and clearing DOM inputs. Passing a function to the `action` prop eliminates all three repetitive setup tasks.

### The `action` Attribute in Plain HTML

Let's start from plain HTML. A `<form>` tag has had an `action` attribute since the first days of the web. There, it holds a URL:

```html title="A form in plain HTML"
<form ~action="/send"~> <!-- The browser sends the form data to /send and loads a new page -->
  <input name="message" />
  <button type="submit">Send</button>
</form>
```

When a user clicks Send, the browser collects every input containing a `name` attribute and sends an HTTP request to the designated server address. The browser then discards the current document and renders the server response as an entirely new page.

In a single-page React application, a full page reload resets application memory. Every component unmounts, and all active state stored in `useState` hooks is erased.

To prevent this loss of state, Lesson 40 intercepted the submit event and extracted the form values manually:

```jsx title="Reading the form with onSubmit, as in Lesson 40"
function handleSubmit(~e~) { // 1. React passes the submit event
  ~e.preventDefault();~ // 2. You stop the browser from loading a new page
  const formData = ~new FormData(e.currentTarget)~; // 3. You build the form data from the <form> element
  alert(formData.get('message'));
}

<form onSubmit={handleSubmit}>
```

> [!DEFINITION]
> **What is FormData?** [REVIEW] `FormData` is a native browser object that stores form fields as key-value pairs, creating an entry for each input that has a `name` attribute.
> You read an individual value using `formData.get('message')`, where `'message'` matches the `name` attribute on the input element.
> Any input lacking a `name` attribute is ignored, and calling `formData.get` for an absent field returns `null` without throwing an error (Lesson 40).

In React 19, the form `action` attribute can accept a JavaScript function instead of a URL:

```jsx title="Reading the form with action, in React 19"
function sendMessage(~formData~) { // React passes the form data itself
  alert(formData.get('message'));
}

<form ~action={sendMessage}~> {/* React calls sendMessage when the user clicks Send */}
```

Notice what disappears compared to the `onSubmit` approach:
1. **No event object.** The action receives the processed form data directly rather than a DOM submit event.
2. **No manual reload cancellation.** React intercepts the submission event internally, preventing the browser from navigating away.
3. **No manual FormData instantiation.** React constructs the `FormData` instance from the form inputs and passes it to your function.

The underlying data structure remains unchanged. It is the exact same `FormData` browser object introduced in Lesson 40. You retrieve field values using standard methods like `formData.get('message')`. The essential difference is responsibility: with `onSubmit` your code creates the object, whereas with `action` React creates it for you.

> [!DEFINITION]
> **What is an action?** [NEW] An action is a function passed to the `action` prop of a `<form>`, written as `<form action={sendMessage}>`.
> When the user submits the form, React intercepts the native submission and invokes this function with a single argument: a `FormData` object containing the form values.
> The browser does not reload the page, allowing your components to retain their active state in memory.
> In React 19, an action represents the dedicated handler that processes form submissions and coordinates transitions and resets (Lesson 41).

```tree caption="The action attribute on a form, holding a URL in plain HTML and holding a function in React 19."
Two things the `action` attribute on a `<form>` can hold
- !A URL, plain HTML [`action="/send"`] | The **browser** sends the form data to a server address | The browser **loads a new page**, and React state is lost
- +A function, React 19 [`action={sendMessage}`] | **React** calls the function with the form data | The **page stays**, and the component keeps its state
```

### The Rule of Thumb: an action gets the form data, not an event

**The first parameter of an action is always the form data object. Name this parameter `formData`, read values with `formData.get`, and omit event cancellation code: React prevents page reloads automatically.**

Why does this simplification matter? Consider the message input in a chat application. When a user enters text and clicks Send, they expect two things: the message appears in the conversation thread, and the input field clears for the next message.

When using `onSubmit`, your code must handle two separate tasks beyond updating the message list:
1. **Preventing the page reload.** Forgetting `e.preventDefault()` causes the browser to submit the form via HTTP and reload the page. The entire application restarts, resetting the message history back to its initial state.
2. **Clearing the input.** After the message is sent, the input element continues to display the submitted text until your code explicitly resets the form control.

With a form action, React handles both operations automatically. You do not need to write code for either one.

A senior developer watches out for three common pitfalls:
1. **Migrating an `onSubmit` handler into `action` without edits.** Calling `e.preventDefault()` on a `FormData` argument causes JavaScript to throw a runtime error, unmounting the interface if unhandled.
2. **Using controlled inputs in an action form.** React automatically resets only uncontrolled inputs, so a controlled input continues displaying the value held in state.
3. **Manually tracking submission status with local state.** React already manages the pending state of form actions through integrated transitions.

The following sections demonstrate each scenario within an interactive chat component.

## SECTION | The Message Field of a Chat

Our application represents the message interface of a chat room. It consists of three elements:
1. An unordered list displaying existing messages, initialized with one message: `Hello there!`.
2. A single input field with the attribute `name="message"`.
3. A submit button labeled Send.

```page caption="The chat page when it opens: one message in the list, an empty message field, and a Send button."
line: Hello there!
form:
  field: |
  submit: Send
console: quiet
```

The project structure contains five files. The file `api.js` serves as a mock server that introduces a one-second delay to simulate network latency, which becomes relevant in Principle 3:

```files title="chat-room: File Explorer" caption="How the files of our chat sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<ChatRoom />`
  api.js | stand-in server | Exports `deliverMessage`, which waits one second, from Principle 3
  components/
    ChatRoom.jsx | state | Holds the `messages` state and renders the list and the form with `action={sendMessage}`
```

Now let's build the chat, and break it on the way:

**PRINCIPLES:** Assigning a function to the `action` prop allows React to pass the form data directly to your handler. There is no event to manage, no navigation to cancel, and uncontrolled inputs clear automatically upon successful completion. Three core principles govern this workflow:
1. **Principle 1: The Action Receives the Form Data.** React invokes the action with the populated `FormData` object, preventing page reloads automatically. Calling `e.preventDefault()` on this object throws an error.
2. **Principle 2: React Empties Uncontrolled Fields After Success.** React automatically restores uncontrolled inputs to their default values once the action finishes without errors. Controlled inputs continue reflecting their React state.
3. **Principle 3: An async Action Resets Fields After Completion.** React awaits asynchronous operations, keeps the page interactive inside a Transition, and resets fields only after the promise resolves successfully.

---

## PRINCIPLE | `action={sendMessage}`: React calls the function with the form data, and the page stays

> [!PRINCIPLE]
> **Principle 1: The action Prop: React Calls the Function with the Form Data**
>
> *Pass a function to `<form action>`; when the user submits the form, React calls it with one argument, the form data, and the page does not reload.*
>
> With `onSubmit`, your code stops the reload and builds the form data by hand. With a function in `action`, React handles the submit, builds the `FormData` object from the `name` of every field, and passes it in. The action never sees an event, so a leftover `e.preventDefault()` throws an error, and the page goes blank.
>
> **DO THIS:**
> ```jsx
> function sendMessage(~formData~) { // React passes the form data
>   setMessages([...messages, { id: nextId++, text: formData.get('message') }]);
> }
> <form action={sendMessage}>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function sendMessage(e) {
>   ~e.preventDefault();~ // **WRONG:** e is the form data, and FormData has no preventDefault!
> }
> <form action={sendMessage}>
> ```

### Where does `formData` come from?

You do not instantiate the object in your code. React constructs it behind the scenes, performing the exact setup you wrote manually in Lesson 40. When the user submits the form, React executes three steps:
1. React intercepts the native submit event and prevents the browser from making a network navigation request.
2. React reads the form elements in the DOM, collecting every input with a `name` attribute into a new `FormData` instance.
3. React invokes `sendMessage`, passing that populated `FormData` instance as its sole argument.

The browser does not reload, even though your code contains no explicit event handling. Whenever the `action` prop receives a function, React intercepts the submission lifecycle completely.

### Building the chat with `action`

The list of messages comes from `messages` stored in component state. Each new entry receives a unique identifier from `nextId`, an incrementing counter declared outside the component (Lesson 19):

```jsx title="src/components/ChatRoom.jsx" startLine="1"
import { useState } from 'react';

const initialMessages = [{ id: 1, text: 'Hello there!' }];
let nextId = 2;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);

  function sendMessage(~formData~) { // 1. React calls this on Send, with the form data
    setMessages([...messages, { id: nextId++, text: ~formData.get('message')~ }]); // 2. Adds the typed text to the list
  }

  return (
    <section>
      <ul>
        {messages.map(m => <li key={m.id}>{m.text}</li>)}
      </ul>
      <form ~action={sendMessage}~> {/* 3. Hands sendMessage to React, not to the browser */}
        <input name="message" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
```

The root component `App` renders the chat interface:

```jsx title="src/App.jsx" startLine="1"
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return ~<ChatRoom />~; // React calls ChatRoom and puts the list and the form on the page
}
```

When the user types `Hi` into the input and clicks Send, the new entry joins the list and the page remains in place:

```page caption="The chat after the user types Hi and clicks Send: Hi joins the list, and the page does not reload."
line: Hello there!
line: Hi | good
form:
  field: |
  submit: Send
console: quiet
```

Notice that the input field is already empty again. Principle 2 explains how React resets the field.

### The mistake: moving the old `onSubmit` handler into `action`

A developer transitioning from `onSubmit` might paste their existing handler directly into the `action` prop without removing legacy event code:

```jsx title="src/components/ChatRoom.jsx" startLine="9"
function sendMessage(~e~) { // **WRONG:** React passes the form data here, not an event
  ~e.preventDefault();~ // **WRONG:** FormData has no preventDefault, so JavaScript throws a TypeError
  const formData = new FormData(e.target);
  setMessages([...messages, { id: nextId++, text: formData.get('message') }]);
}
```

**When the user clicks Send, the entire chat interface disappears from the screen.** This runtime crash occurs through a predictable sequence of events:
1. React invokes `sendMessage` and passes the prepared `FormData` instance. Although the developer named the parameter `e`, the runtime value is a `FormData` object, not a DOM event.
2. The `FormData` prototype does not define a `preventDefault` method. JavaScript immediately throws an uncaught `TypeError` on the very first line.
3. React propagates unhandled errors thrown inside an action to the nearest error boundary, a fallback component designed to render error screens (Lesson 38).
4. Because this example contains no error boundary, React unmounts the entire component tree to avoid leaving corrupted UI state on the screen.

```page caption="The chat after the user clicks Send when the action still calls e.preventDefault: nothing is left on the screen."
blank
console: Uncaught TypeError: e.preventDefault is not a function
  warn: An error occurred in the <form> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The user loses both the conversation history and the form, and the pending message is discarded. Resolving this requires two simple adjustments:
1. Name the parameter `formData` to accurately reflect its data type.
2. Delete both the `e.preventDefault()` call and the redundant `new FormData(e.target)` constructor.

Remember: a React form action receives form data, never an event.

---

## PRINCIPLE | `action` with an uncontrolled field: React empties the field after the action succeeds

> [!PRINCIPLE]
> **Principle 2: The Automatic Reset: React Empties Uncontrolled Fields After the Action Succeeds**
>
> *After the function in `action` succeeds, React resets every uncontrolled field in the form; a controlled field keeps showing its state.*
>
> A chat field that still shows the sent text invites the user to send it twice. With `onSubmit`, your code must empty the field itself. With a function in `action`, React resets the form after the action ends without an error, so a field with only a `name` is empty again. A field with `value` shows what state holds, so React's reset cannot empty it.
>
> **DO THIS:**
> ```jsx
> <form action={sendMessage}>
>   ~<input name="message" />~ {/* Uncontrolled: React empties it after Send */}
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <form action={sendMessage}>
>   <input name="message" ~value={text}~ onChange={e => setText(e.target.value)} /> {/* **WRONG:** controlled, so the field still shows Hi after Send */}
> </form>
> ```

### The same field, with `onSubmit` and with `action`

Compare how both approaches handle the message input. The form using `onSubmit` relies on `handleSubmit` from the beginning of this lecture, updated to append messages to state. The form using `action` delegates submission to `sendMessage`.

Both forms render an identical uncontrolled input: `<input name="message" />`. Because this input omits the `value` prop, the browser maintains its internal text buffer directly (Lesson 20). The user enters `Hi` into each input and clicks Send:

::: row caption="The same field after Send: the form with onSubmit keeps Hi, the form with action is empty again."
::: col title="Form with onSubmit" tag="still shows Hi" tone=bad
```page size=mini
line: Hello there!
line: Hi
form:
  field: | Hi | bad
  submit: Send
```
```jsx title="ChatRoom.jsx"
<form ~onSubmit={handleSubmit}~> {/* Nothing empties the field */}
  <input name="message" />
</form>
```
:::
::: col title="Form with action" tag="empty again" tone=good
```page size=mini
line: Hello there!
line: Hi
form:
  field: | | good
  submit: Send
```
```jsx title="ChatRoom.jsx"
<form ~action={sendMessage}~> {/* React empties the field after Send */}
  <input name="message" />
</form>
```
:::
:::

Both implementations successfully append `Hi` to the message list. However, after submission, the form using `onSubmit` leaves the text sitting in the input, while the form using `action` resets the input to an empty state.

This behavioral difference directly affects user experience. Leaving submitted text in the field often confuses users, causing them to click Send a second time and post accidental duplicate messages.

### Who empties the field?

React resets the form automatically without requiring any manual cleanup code. Here is the exact runtime sequence when the user submits `Hi`:
1. React invokes `sendMessage`, passing the populated `FormData` object.
2. The `sendMessage` function appends `Hi` to the message state and completes without encountering errors.
3. React executes a form reset, restoring every uncontrolled field to its initial default value. Because our input started empty, it returns to an empty string.
4. The message list displays the new entry, and the input field is ready for the user's next message.

This mechanism mirrors native DOM behavior, where HTML form elements expose a built-in `reset()` method. In traditional `onSubmit` handlers, React performs no automatic reset, forcing you to invoke `form.reset()` manually. With the `action` prop, React invokes this reset automatically once the action finishes successfully. If the action encounters an error and throws an exception, React skips the reset, preserving the user's text so they do not have to retype it.

### The mistake: a controlled field inside an action form

Developers accustomed to controlled inputs often bind inputs to local state out of habit (Lesson 20), introducing a `text` state variable into `ChatRoom`:

```jsx title="src/components/ChatRoom.jsx" startLine="8"
const [text, setText] = useState('');
```

```jsx title="src/components/ChatRoom.jsx" startLine="19"
<form action={sendMessage}>
  <input
    name="message"
    ~value={text}~ // **WRONG:** React resets only uncontrolled fields, so this field keeps showing text
    onChange={e => setText(e.target.value)}
  />
  <button type="submit">Send</button>
</form>
```

When the user enters `Hi` and clicks Send, the message appears in the list, but `Hi` remains visible in the input field:

```page caption="The chat after Send when the message field is controlled with value and onChange: the field still shows Hi."
line: Hello there!
line: Hi
form:
  field: | Hi | bad
  submit: Send
console: quiet
```

Why does this happen? A controlled input displays whatever value is supplied to its `value` prop. Because the action did not update `text` in state, React re-renders the input with the unchanged string. React only resets uncontrolled DOM fields; it cannot alter your component's state variables on its own.

A developer might try to fix this by adding `setText('')` inside `sendMessage`. That introduces unnecessary state management for an operation the browser already handles natively. The cleaner solution is to delete the `text` state variable and its `onChange` handler entirely. Keep the input uncontrolled by specifying only `name="message"` without a `value` prop.

Remember: within an action form, an uncontrolled field containing only a `name` attribute resets automatically after successful submission.

---

## PRINCIPLE | `async` action: React waits for `await`, then empties the field

> [!PRINCIPLE]
> **Principle 3: The async Action: React Waits, Then Resets the Form**
>
> *The function in `action` may be `async`; React waits for its promise, runs it in a Transition, and resets the form only after it succeeds.*
>
> A real chat must wait for the server before the message counts as sent. With `async` and `await`, the action pauses until the server answers. React waits with it, keeps the page usable, tracks the pending state, and empties the field only after the action ends without an error.
>
> **DO THIS:**
> ```jsx
> ~async~ function sendMessage(formData) { // React waits for this action, then empties the field
>   const message = { id: nextId++, text: formData.get('message') };
>   await deliverMessage(message.text);
>   setMessages(m => [...m, message]);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> async function sendMessage(formData) {
>   ~setIsSending(true)~; // **WRONG:** a hand-written copy of the pending state React already tracks
>   await deliverMessage(formData.get('message'));
>   setIsSending(false);
> }
> ```

### A function that waits: `async` and `await`

Production chat applications must transmit each message over a network to a backend server, which takes time to respond. To simulate this delay without an actual backend, we create a mock server utility in `api.js`. It waits for one second before returning the text:

```js title="src/api.js" startLine="1"
export ~async~ function deliverMessage(text) { // async: this function may wait inside
  ~await~ new Promise(resolve => setTimeout(resolve, 1000)); // await: pauses here for one second
  return text; // Runs only after the wait
}
```

JavaScript provides two keywords for asynchronous operations:
1. **`async`**, placed before a function declaration, indicates that the function performs asynchronous work and returns a Promise (Lesson 33).
2. **`await`**, placed before a Promise, pauses execution inside the function until the promise settles, resolving to the completed value.

Form actions can also be declared as async functions. When an action returns a promise, React pauses the form lifecycle until that promise settles, treating the submission as active throughout the wait.

### The chat waits for the server

Updating `sendMessage` to an async function allows it to construct the message, wait for server delivery, and update the state only after the network operation succeeds:

```jsx title="src/components/ChatRoom.jsx" startLine="1"
import { useState } from 'react';
import { deliverMessage } from '../api.js';

const initialMessages = [{ id: 1, text: 'Hello there!' }];
let nextId = 2;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);

  ~async~ function sendMessage(formData) { // 1. React waits for this action until its promise is done
    const message = { id: nextId++, text: formData.get('message') }; // 2. Builds the message once, before the wait
    ~await deliverMessage(message.text)~; // 3. Pauses here for one second
    setMessages(~m => [...m, message]~); // 4. Adds the message to the newest list
  }
```

The remaining markup in `ChatRoom` remains unchanged. The two highlighted updates address specific concurrency requirements:
1. **The state updater callback `m => [...m, message]`.** When an asynchronous action pauses at `await`, the closed-over `messages` array represents the state at the exact moment the user clicked Send (Lesson 15). If the user submits a second message during the wait, both invocations reference the same initial list, causing the second message to overwrite the first. Using a functional state updater guarantees access to the latest state at the moment the update applies (Lesson 16).
2. **Instantiating the message object before `await`.** React StrictMode invokes updater functions twice in development to identify unintended side effects (Lesson 14). Placing `nextId++` inside the updater would increment the counter twice for a single message. Constructing the message object before the asynchronous operation ensures `nextId` increments exactly once.

### What the user sees during that one second

During the one-second network delay, the interface appears static: the input continues displaying `Hi`, and the message list has not updated yet. Here is the chronological execution sequence:
1. The user enters `Hi` and clicks Send.
2. React invokes `sendMessage` with the populated `FormData` object.
3. The `sendMessage` function encounters `await deliverMessage(...)` and pauses execution for one second.
4. The simulated server promise resolves, and `setMessages` appends `Hi` to the list.
5. The action function finishes without errors, prompting React to reset the form and clear the input field.

::: row caption="The chat during the one second wait after Send, and after the stand-in server answers."
::: col title="During the wait" tag="field still shows Hi"
```page size=mini
line: Hello there!
form:
  field: | Hi
  submit: Send
console: quiet
```
:::
::: col title="After the wait" tag="Hi sent, field empty" tone=good
```page size=mini
line: Hello there!
line: Hi | good
form:
  field: | | good
  submit: Send
console: quiet
```
:::
:::

Because the input clears only after the action completes successfully, the user's text remains visible while the server processes the submission. If the network request fails, the input preserves the draft so the user does not lose their typed message.

Throughout this delay, the interface remains fully interactive: the user can scroll, click buttons, or interact with other controls. React executes every form action inside a Transition, which ensures that asynchronous updates do not block the main thread. React also tracks whether an action is currently executing, exposing this duration through its internal pending state.

### The mistake: tracking the wait by hand

A developer accustomed to managing form loading states manually might declare a local boolean state flag (Lesson 21):

```jsx title="src/components/ChatRoom.jsx" startLine="9"
const [isSending, setIsSending] = useState(false);

async function sendMessage(formData) {
  ~setIsSending(true)~; // **WRONG:** React already tracks the pending state of every action
  const message = { id: nextId++, text: formData.get('message') };
  await deliverMessage(message.text);
  setMessages(m => [...m, message]);
  ~setIsSending(false)~; // **WRONG:** the second line to copy next to every form
}
```

While functional, this approach forces you to duplicate identical state declarations and setter calls across every form in the application. React already monitors this pending status automatically whenever an action runs.

React provides specialized hooks to access this pending state in subsequent lessons. The `useActionState` hook arrives in Lesson 42, followed by `useFormStatus` in Lesson 43 to show pending indicators like Sending without manual state flags.

Remember: an async action coordinates network delays automatically, and React waits for the returned promise before resetting the form.

---

## All 3 Principles Together

### The complete project

Here is the complete chat implementation. The mock server introduces a one-second delivery delay, and the component submits data using an asynchronous form action:

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

```js title="src/api.js"
export async function deliverMessage(text) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return text;
}
```

```jsx title="src/components/ChatRoom.jsx"
import { useState } from 'react';
import { deliverMessage } from '../api.js';

const initialMessages = [{ id: 1, text: 'Hello there!' }];
let nextId = 2;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);

  ~async~ function sendMessage(~formData~) { // Principles 1 and 3: React passes the form data and waits
    const message = { id: nextId++, text: formData.get('message') };
    await deliverMessage(message.text);
    setMessages(m => [...m, message]);
  }

  return (
    <section>
      <ul>
        {messages.map(m => <li key={m.id}>{m.text}</li>)}
      </ul>
      <form ~action={sendMessage}~> {/* Principle 1: React handles the submit */}
        ~<input name="message" />~ {/* Principle 2: uncontrolled, so React empties it after Send */}
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
```

### What React does when the user clicks Send

When the application loads, React renders `App` and `ChatRoom`. When the user submits the form, React coordinates the submission lifecycle, invokes the action, awaits the promise, and resets the input fields:

```tree dir=right caption="The order of events in our chat, from the first render to the empty field after Send."
From the first render to the empty field
- +1. First render [`App` then `ChatRoom`] | The list shows **`Hello there!`** | The field is **empty**
- +2. The user clicks Send | React builds the **form data** | React calls **`sendMessage`** in a Transition
- +3. The action waits [`await deliverMessage`] | One second **with no change** on the page | The field still shows **`Hi`**
- +4. The action succeeds | `setMessages` adds **`Hi`** to the list | React **resets the form**, and the field is empty
```

| Aspect | The `onSubmit` Way | The `action` Way |
| :--- | :--- | :--- |
| **What the function receives** | The submit event `e`; your code builds `new FormData(e.currentTarget)` | The form data itself, a `FormData` object |
| **The page reload** | Your code must call `e.preventDefault()` | React handles the submit, so the page never reloads |
| **The field after Send** | Keeps the sent text until your code empties it | Empty again, because React resets uncontrolled fields after success |
| **Waiting for a server** | Your code tracks the wait with an `isSending` state | React waits for the `async` action and tracks its pending state |

One last time, the core takeaway of this lesson: **pass a function to the `action` prop**. React manages form submission with native `FormData`, prevents page reloads, and resets uncontrolled fields automatically upon success.

---

## For the Interview

> **The Interview Question:** What is the action prop on a form, and how do actions modernize form handling?

### How to Answer Clearly in 30 Seconds

"In standard HTML, a form `action` takes a URL and reloads the page upon submission. In React 19, the `action` prop accepts a JavaScript function. When a user submits the form, React intercepts the event and passes a populated `FormData` object directly to that function. Form actions modernize form handling in three key ways:
1. **Eliminating event boilerplate**: React prevents browser navigation automatically, eliminating the need for `e.preventDefault()` and manual `FormData` construction.
2. **Automating form resets**: upon successful completion of the action, React automatically resets all uncontrolled fields to their default values.
3. **Managing asynchronous workflows**: actions can be declared as async functions, running inside non-blocking React Transitions while React tracks their pending state automatically."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Should we still use `onSubmit`?"**
   The `onSubmit` prop remains fully supported for backward compatibility and for scenarios requiring direct access to the native submit event. However, the `action` prop is preferred for new React 19 forms. It integrates directly with Transitions, routes unhandled errors to error boundaries, works with `useActionState` and `useOptimistic` (Lesson 44), and supports Server Functions (Lesson 110).
2. **"What can an action return?"**
   A standard form action can return a Promise, allowing React to wait for asynchronous operations before resetting fields. When passed directly to `<form action>`, any resolved value returned by the action is ignored by React. To capture and display return values like server validation errors, wrap the action in `useActionState` (Lesson 42). That hook converts the returned value into reactive component state.
3. **"Why did my field not empty after Send, and how do I stop a field from emptying?"**
   React only resets uncontrolled fields, which lack a `value` prop. If an input is controlled through `value` and `onChange`, it continues rendering the value stored in React state. To preserve values in an uncontrolled field, such as retaining a search query, bind it to controlled state or read values from `useActionState` (Lesson 45).

```tree dir=right caption="Interview comparison: what onSubmit and action share, and what action adds."
`onSubmit` vs. `action` on a form
- +`onSubmit` [`onSubmit={handleSubmit}`] | Gets the **submit event** | Your code stops the reload, builds the **form data**, and empties the fields
- +`action` [`action={sendMessage}`] | Gets the **form data** | React keeps the page, **resets uncontrolled fields**, and **waits** for an `async` action
```
