# Lecture 73: Hiding a Tab Without Losing Its State with Activity

*(How can a tab leave the screen and come back exactly as the user left it?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you hide a subtree without losing its state with <Activity>?

---

## VS | Removing a tab with `&&` vs. hiding it with `<Activity>`: one throws the state away, the other keeps it

> Operating systems let you close a window or minimize it. Both take the window off your screen, but only a minimized window retains your work. **In React, `<Activity>` provides that same minimized behavior for components.** Setting `mode="hidden"` visually conceals the subtree while preserving its internal state. In contrast, conditional rendering with `&&` unmounts the component and discards everything the user typed.

Modern web applications frequently display one view at a time. Examples include settings tabs, multi-step checkout flows, or a chat pane paired with a contacts list. Developers commonly manage these views with conditional rendering using the logical AND operator. When the condition evaluates to false, React unmounts the inactive component and discards its state. React provides `<Activity>` to solve this problem. The component visually conceals the inactive view while keeping its state intact.

Consider a messaging application with two tabs: Chat and Contacts. A user starts typing a draft message to a colleague. Before sending, the user opens the Contacts tab to verify a spelling, then returns to the Chat tab. The user naturally expects the message field to retain the drafted text. The user only looked away for a few seconds.

With logical conditional rendering, React cannot distinguish a temporary view switch from a permanent removal. When the active tab state changes, the condition evaluates to false. React unmounts the chat component completely, destroying the input draft stored in its state. Wrapping the tab in an Activity component configured with `mode="hidden"` prevents this destruction. React conceals the chat view while preserving its internal state in memory.

### The Draft Is Gone After One Look at the Contacts

Here is the Chat tab after the user enters a draft:

```page caption="The Chat tab after the user types Hello John into the message field."
line: [Chat] [Contacts]
form:
  textarea: Message | Hello John
```

The user switches to the Contacts tab and then returns to the Chat tab:

```page caption="The Chat tab after the user clicks Contacts and then clicks Chat again, with &&."
line: [Chat] [Contacts]
form:
  textarea: Message | | bad
```

The message textarea is empty. The user must retype the entire message from scratch. Two foundational concepts and one new component explain why this reset happens:

> [!DEFINITION]
> **Unmount.** [REVIEW] Unmounting is React's process for removing a component from the tree. React runs cleanup functions for active Effects, removes the underlying DOM elements, and discards all associated state. When the component renders again later, React mounts a fresh instance initialized from scratch (Lesson 32).

> [!DEFINITION]
> **State lives at its place in the tree.** [REVIEW] React retains component state only as long as that component remains rendered at its position in the tree. Unmounting a component destroys its internal state, forcing any future render of that component to rebuild state from its initial values (Lesson 25).

> [!DEFINITION]
> **Activity.** [NEW] `<Activity>` is a built-in React component that controls the visibility and lifecycle of its child subtree. You wrap `<Activity>` around UI elements and configure its `mode` prop as `'visible'` or `'hidden'`. It lets you hide and restore the interface and internal state of child components without unmounting them (Lesson 73).

### `<Activity>` in Two Lines

Here are the two ways to take the Chat tab off the screen, side by side:

```jsx title="Removing the Chat tab with && vs. hiding it with Activity"
{~tab === 'chat' &&~ <ChatTab />} {/* The user comes back to an empty field */}
<Activity ~mode={tab === 'chat' ? 'visible' : 'hidden'}~><ChatTab /></Activity> {/* The user comes back to Hello John */}
```

While the user views the Contacts tab, neither approach displays the chat interface. Both approaches appear identical to the end user on screen. However, their internal execution models differ fundamentally. Conditional rendering with `&&` unmounts the chat component, destroying its state. The Activity component retains the component in the React tree, hiding its output so the drafted text remains preserved.

```tree caption="Two ways to take the Chat tab off the screen: remove it with && or hide it with Activity."
Two ways to take the Chat tab off the screen
- !Remove it with `&&` [`tab === 'chat' && <ChatTab />`] | React **unmounts `ChatTab`** | The user comes back to an **empty field**
- +Hide it with `<Activity>` [`<Activity mode="hidden">`] | React **keeps `ChatTab`** in the tree and hides it | The user comes back to **`Hello John`**
```

### Hidden Is More Than `display: none`

In standard CSS, an element styled with `display: none` occupies no visual space, but remains present in the DOM tree. A hidden Activity component uses this same mechanism. React applies `display: none` to the child DOM nodes automatically.

Because React manages this visibility state directly, React coordinates component execution with visual presence. This coordination provides two major advantages over manual CSS rules:
1. **React cleans up active Effects.** React executes Effect cleanup functions, behaving as if the subtree unmounted. A WebSocket connection disconnects while the tab remains hidden.
2. **React deprioritizes background updates.** Updates targeted at hidden subtrees run at low priority. The visible UI that the user interacts with always receives immediate processing priority.

Conceptually, a hidden Activity behaves like an unmounted component that retains its state.

Keep this central rule in mind throughout this lesson: **a hidden Activity preserves component state and DOM elements, while pausing active Effects and lowering update priority.**

### The Rule of Thumb: should the tab come back as the user left it?

Evaluate one requirement for each tab in an application. When a tab should return in the exact state the user left it, hide the tab using `<Activity>`. When a tab should reset and start fresh, remove the tab using conditional rendering.

Developers employ four common strategies to retain draft content across tab switches:
1. **Render every tab and toggle visual styles.** Keeping all tabs mounted with manual CSS preserves state and DOM nodes. However, large hidden subtrees increase DOM weight and continue running unneeded background Effects.
2. **Lift state to a common parent component.** Storing draft state in the parent component preserves data across tab unmounts (Lesson 24). This pattern remains widespread, but requires prop drilling or context wiring across components.
3. **Persist state to browser storage.** Saving state in local storage survives tab switching and full browser reloads. This approach requires serialization and manual cleanup logic.
4. **Wrap each tab in `<Activity>`.** The component preserves local state and DOM elements without code changes to the child component. React pauses child Effects while the tab remains inactive.

The Activity component is ideal when a tab should preserve its internal state and DOM, yet pause background work while concealed.

Experienced engineers recognize three common pitfalls:
1. **Expecting conditional rendering to preserve state.** Unmounting a component through `&&` destroys its internal state completely.
2. **Treating hidden mode as pure CSS.** Concealing a component with `<Activity>` runs Effect cleanups, pausing network connections and timers.
3. **Assuming media playback stops automatically.** Because hidden DOM elements stay attached to the document, audio and video elements continue playing unless explicitly paused.

The following sections demonstrate each behavior using a chat application.

## SECTION | A Chat App with Two Tabs

Our example application features a chat interface with two navigation buttons: Chat and Contacts. A single state variable in the main component stores the active tab selection. The Chat tab displays a message draft field and maintains an active connection to a chat server. The Contacts tab displays a list of team members.

```files title="chat-app: File Explorer" caption="The files of our chat app inside public/ and src/."
public/
  john-voice.mp3 | asset | John's voice message, new in Principle 5
src/
  App.jsx | parent | Holds `tab` and shows one tab at a time; imports `ChatTab` and `ContactsTab`
  ChatTab.jsx | default export | The message field with the draft, and the connection to the chat server
  ContactsTab.jsx | default export | The list of contacts, John and Mia
  chat.js | helper | Exports `createConnection`, the fake chat server from React's docs
  data.js | helper | Exports `fetchData`, new in Principle 6
```

The main component stores the active view name in state. Each button updates that state, and conditional statements determine which tab renders:

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatTab from './ChatTab.jsx';
import ContactsTab from './ContactsTab.jsx';

export default function App() {
  const [tab, setTab] = useState('chat');

  return (
    <main>
      <button onClick={() => setTab('chat')}>Chat</button>
      <button onClick={() => setTab('contacts')}>Contacts</button>
      {~tab === 'chat' &&~ <ChatTab />} {/* Shows ChatTab only while tab is 'chat' */}
      {~tab === 'contacts' &&~ <ContactsTab />} {/* Shows ContactsTab only while tab is 'contacts' */}
    </main>
  );
}
```

The draft string does not live in the parent component. It lives inside the chat tab as local state. The textarea operates as a controlled component, displaying the draft value and calling the state setter on every keystroke (Lesson 20):

```jsx title="src/ChatTab.jsx"
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatTab() {
  const [~draft~, setDraft] = useState(''); // The draft lives inside ChatTab

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <section>
      <label>
        Message
        <textarea value={draft} onChange={e => setDraft(e.target.value)} />
      </label>
    </section>
  );
}
```

An Effect connects the chat tab to the server on mount, and its cleanup function disconnects on unmount (Lesson 32). The server helper simulates a remote chat service, logging connection events to the console:

```js title="src/chat.js"
export function createConnection() {
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    },
  };
}
```

The contacts tab renders an unordered list:

```jsx title="src/ContactsTab.jsx"
export default function ContactsTab() {
  return (
    <ul>
      <li>John</li>
      <li>Mia</li>
    </ul>
  );
}
```

**PRINCIPLES:** The Activity component hides a tab instead of unmounting it. Six core principles govern this lifecycle:
1. **Conditional rendering discards draft state.** Leaving the tab unmounts the component, causing React to discard its state.
2. **A hidden Activity retains state.** The component remains in the React tree, so state persists across switches.
3. **Hidden mode extends beyond basic CSS.** React applies `display: none` to the DOM while stopping active Effects and deprioritizing updates.
4. **A hidden Activity cleans up active Effects.** React runs Effect cleanups upon hiding the subtree and re-executes Effects upon restoring visibility.
5. **A hidden media element continues playing.** Because the DOM element remains in the document, a cleanup function must pause playback.
6. **A hidden Activity pre-renders child components.** React renders hidden subtrees in the background, allowing data read with `use` to finish loading before the user opens the tab.

---

## PRINCIPLE | `&&` on a tab: leaving the tab unmounts it, so its state is thrown away

> [!PRINCIPLE]
> **Principle 1: Removing a Tab: A Removed Component Loses Its State**
>
> *When `&&` stops rendering a tab, React unmounts it and throws away its state; coming back mounts a new tab with its initial state.*
>
> The user only looks away from the Chat tab for a moment, but React does not know that. When `tab === 'chat'` becomes false, `ChatTab` leaves the tree: its Effect is cleaned up, its `<textarea>` leaves the DOM, and `draft` is gone. The next `<ChatTab />` is a brand-new component, and its `useState('')` starts empty.
>
> **DO THIS:**
> ```jsx
> {~tab === 'contacts' &&~ <ContactsTab />} {/* The list holds nothing the user typed, so removing it loses nothing */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {~tab === 'chat' &&~ <ChatTab />} {/* **WRONG:** the draft the user typed is thrown away on every switch */}
> ```

The user enters text into the message field, selects Contacts, and returns to Chat. **The message field returns completely empty.** Here is the sequence of events:
1. The user types into the textarea. The state setter updates the draft variable in component state.
2. The user selects Contacts. State in the main component updates to the contacts view.
3. The condition for the chat tab evaluates to false. The main component omits the chat component from returned JSX.
4. React unmounts the chat component. React executes the Effect cleanup, removes the textarea from the DOM, and discards component state.
5. The user selects Chat. React mounts an entirely new chat component instance.
6. The state hook initializes with an empty string, leaving the textarea blank.

The console records this exact lifecycle. The chat service connects on initial mount, disconnects on unmount, and reconnects when the replacement component mounts:

```page caption="The page after the user types Hello John, clicks Contacts, and clicks Chat again, with the Console."
line: [Chat] [Contacts]
form:
  textarea: Message | | bad
log: ✅ Connecting... | chat.js:4
log: ❌ Disconnected. | chat.js:7
log: ✅ Connecting... | chat.js:4
```

These console previews illustrate execution in a production build. In development mode, StrictMode executes an extra unmount and remount cycle to catch missing cleanups (Lesson 47).

Inspecting the Elements panel while viewing the contacts tab confirms that the chat DOM structure is completely gone:

```dom caption="The Elements panel while the user is on the Contacts tab: no section and no textarea."
<main>
  <button>Chat</button>
  <button>Contacts</button>
+ <ul> | note: Only the Contacts tab is in the DOM
    <li>John</li>
    <li>Mia</li>
  </ul>
</main>
```

### How developers meet this bug

Developers often build tabbed navigation using conditional rendering, testing each tab independently. Everything appears functional during manual verification. However, a user typing a lengthy message who briefly checks another tab loses their drafted message. The console outputs no errors because unmounting cleans up state normally.

Resetting state upon unmounting is occasionally the intended behavior. When switching between conversations with different people, the draft message must not carry over to the new recipient. For that scenario, assigning a unique `key` prop based on the contact ID intentionally resets state upon switching (Lesson 25).

---

## PRINCIPLE | `<Activity mode="hidden">`: the tab stays in the tree, so its state comes back

> [!PRINCIPLE]
> **Principle 2: Hiding a Tab: A Hidden Child Stays in the Tree**
>
> *Wrap the tab in `<Activity>` and switch `mode` between `'visible'` and `'hidden'` instead of removing the tab; React keeps its state while it is hidden.*
>
> With `&&`, the tab leaves the tree, and React throws away its state. With a hidden Activity, the tab stays in the tree, and React saves its state for later. When `mode` becomes `'visible'` again, the tab comes back exactly as the user left it, and the tab itself needs no change.
>
> **DO THIS:**
> ```jsx
> <Activity ~mode={tab === 'chat' ? 'visible' : 'hidden'}~> {/* ChatTab stays in the tree; the draft waits */}
>   <ChatTab />
> </Activity>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Activity mode={tab === 'chat' ? 'visible' : 'hidden'}>
>   {~tab === 'chat' &&~ <ChatTab />} {/* **WRONG:** && still removes ChatTab, so the draft is lost */}
> </Activity>
> ```

### The smallest Activity boundary

Import the Activity component from the core React library and wrap it around the target tab:

```jsx title="The smallest Activity boundary"
import { ~Activity~ } from 'react'; // React provides Activity, as it provides useState

<Activity ~mode="hidden"~> {/* Hides ChatTab and keeps its state */}
  <ChatTab />
</Activity>
```

In addition to child elements, `<Activity>` accepts a `mode` prop with two options:
- **`'visible'`** displays child elements normally. This setting is the default when `mode` is omitted.
- **`'hidden'`** visually hides child elements while preserving their internal state in memory.

The elements placed between opening and closing tags are component children (Lesson 9). The `<Activity>` wrapper together with its children forms an Activity boundary. When documentation references a hidden boundary, it means its `mode` prop is set to `'hidden'`.

### Replacing both `&&` lines in `App`

Only the main component requires changes. Each conditional expression becomes an Activity boundary, passing a ternary expression to the `mode` prop (Lesson 10):

```jsx title="src/App.jsx"
import { ~Activity~, useState } from 'react'; // The only new import
import ChatTab from './ChatTab.jsx';
import ContactsTab from './ContactsTab.jsx';

export default function App() {
  const [tab, setTab] = useState('chat');

  return (
    <main>
      <button onClick={() => setTab('chat')}>Chat</button>
      <button onClick={() => setTab('contacts')}>Contacts</button>
      <Activity ~mode={tab === 'chat' ? 'visible' : 'hidden'}~> {/* ChatTab stays in the tree on every switch */}
        <ChatTab />
      </Activity>
      <Activity ~mode={tab === 'contacts' ? 'visible' : 'hidden'}~> {/* ContactsTab stays in the tree too */}
        <ContactsTab />
      </Activity>
    </main>
  );
}
```

The chat tab component remains completely unchanged. The user enters text, navigates to Contacts, and returns to Chat:

::: row caption="The Chat tab after the user types Hello John, clicks Contacts, and clicks Chat again, with && and with Activity."
::: col title="With &&" tag="draft thrown away" tone=bad
```page size=mini
line: [Chat] [Contacts]
form:
  textarea: Message | | bad
```
```jsx title="src/App.jsx" bad="1"
{tab === 'chat' && <ChatTab />}
```
React unmounted `ChatTab` on the switch, so the field starts empty.
:::
::: col title="With Activity" tag="draft kept" tone=good
```page size=mini
line: [Chat] [Contacts]
form:
  textarea: Message | Hello John | good
```
```jsx title="src/App.jsx" good="1"
<Activity mode={tab === 'chat' ? 'visible' : 'hidden'}>
  <ChatTab />
</Activity>
```
React kept `ChatTab` on the switch, so the field shows `Hello John`.
:::
:::

When a component hides inside an Activity boundary, React retains its state in memory. When the boundary becomes visible again, React restores the children with their previous state intact.

```tree dir=right caption="What happens to the Chat tab when the user clicks Contacts and then Chat, with && and with Activity."
The user leaves the Chat tab and comes back
- !With `&&` [`tab === 'chat' && <ChatTab />`] | `ChatTab` **leaves the tree** | Coming back mounts a **new `ChatTab`** with an **empty draft**
- +With `<Activity>` [`mode={tab === 'chat' ? 'visible' : 'hidden'}`] | `ChatTab` **stays in the tree**, hidden | Coming back shows the **same `ChatTab`** with **`Hello John`**
```

### VS | A draft in state vs. a draft kept by the `<textarea>`: both come back

Consider an uncontrolled textarea element that manages its own content without React state:

```jsx title="A draft kept in state vs. a draft kept by the textarea itself"
<textarea ~value={draft} onChange={e => setDraft(e.target.value)}~ /> {/* The draft lives in React state */}
<textarea /> {/* The draft lives in the textarea, kept by the browser */}
```

Under `<Activity>`, both approaches preserve the draft message for different technical reasons:
- **Controlled inputs** retain content because React preserves the internal state of the hidden component.
- **Uncontrolled inputs** retain content because React keeps their DOM nodes attached to the document.

Under conditional rendering with `&&`, both implementations lose their draft because React unmounts the component and destroys its DOM nodes.

### Keeping `&&` inside the boundary

A common oversight occurs when a developer introduces `<Activity>` but leaves the conditional check inside the boundary:

```jsx title="src/App.jsx"
<Activity mode={tab === 'chat' ? 'visible' : 'hidden'}>
  {~tab === 'chat' &&~ <ChatTab />} {/* **WRONG:** && still removes ChatTab, so the draft is still lost */}
</Activity>
```

The draft message is still lost. When the user navigates away, the logical AND expression evaluates to false and unmounts the child component. The Activity boundary cannot preserve a child that has already been unmounted.

---

## PRINCIPLE | `mode="hidden"`: React hides the tab with `display: none`, and also stops its Effects

> [!PRINCIPLE]
> **Principle 3: Hidden Is More Than CSS: React Writes display: none and Knows the Tab Is Hidden**
>
> *A hidden Activity keeps its children in the DOM with `display: none`; unlike your own CSS, it also cleans up their Effects and renders them at a lower priority.*
>
> React hides the top element of each hidden child with `display: none`, so the `<textarea>` and its text stay in the DOM. Your own `display: none` keeps them too, but React never learns that the tab is hidden, so the tab's Effects keep running and its updates keep full priority.
>
> **DO THIS:**
> ```jsx
> <Activity ~mode={tab === 'chat' ? 'visible' : 'hidden'}~> {/* React hides the tab and cleans up its Effects */}
>   <ChatTab />
> </Activity>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div ~style={{ display: tab === 'chat' ? 'block' : 'none' }}~> {/* **WRONG:** hidden on the screen, but the chat server stays connected */}
>   <ChatTab />
> </div>
> ```

### What React writes on the hidden tab

A hidden Activity boundary does not detach child elements from the DOM. Instead, React hides them visually using inline CSS.

Inspecting the Elements panel while viewing Contacts reveals that the chat elements remain present in the DOM:

```dom caption="The Elements panel while the user is on Contacts: React put display none on the Chat tab, and the textarea is still inside it."
<main>
  <button>Chat</button>
  <button>Contacts</button>
! <section style="display: none !important;"> | note: Written by React, not by our code
    <label>
      Message
      <textarea>Hello John</textarea>
    </label>
  </section>
  <ul style=""> | note: Emptied by React when the Contacts tab became visible
    <li>John</li>
    <li>Mia</li>
  </ul>
</main>
```

React injects the inline style directly onto the root DOM element returned by the hidden component. The important declaration guarantees this rule overrides competing style rules. The chat view disappears from the screen, yet the textarea element and its content stay in the DOM.

The unordered list for contacts displays an empty style attribute. The contacts boundary was hidden when the page loaded, receiving an inline style rule from React. When the user navigated to Contacts, React cleared that inline style.

### VS | Your own `display: none` vs. a hidden Activity: the same DOM, but only Activity stops the Effects

Developers often hide components by applying inline styles manually:

```jsx title="Hiding the Chat tab with your own CSS vs. with Activity"
<div ~style={{ display: tab === 'chat' ? 'block' : 'none' }}~><ChatTab /></div> {/* Your own CSS hides the tab */}
<Activity ~mode={tab === 'chat' ? 'visible' : 'hidden'}~><ChatTab /></Activity> {/* React hides the tab */}
```

Both strategies retain child DOM nodes and preserve input drafts. However, their internal execution models differ fundamentally. When you apply styles manually, React remains unaware that the component is hidden. With `<Activity>`, React detects the hidden state and introduces two critical behaviors:
1. **React cleans up active Effects.** React executes Effect cleanups, disconnecting active subscriptions and listeners. Principle 4 examines this in the console.
2. **React lowers render priority for hidden trees.** Updates inside hidden components execute at lower priority than active screen updates (Lesson 66). React prioritizes user interactions on the active tab.

The console reflects this difference immediately upon leaving the chat tab:

::: row caption="The Console after the user leaves the Chat tab, with your own display none and with Activity."
::: col title="With your own display: none" tag="still connected" tone=bad
```page size=mini
line: [Chat] [Contacts]
line: John
line: Mia
log: ✅ Connecting... | chat.js:4
```
The hidden Chat tab stays connected to the chat server.
:::
::: col title="With Activity" tag="disconnected" tone=good
```page size=mini
line: [Chat] [Contacts]
line: John
line: Mia
log: ✅ Connecting... | chat.js:4
log: ❌ Disconnected. | chat.js:7
```
React ran the cleanup, so the hidden Chat tab is disconnected.
:::
:::

```tree caption="What your own display none and a hidden Activity keep and what they stop."
Two ways to hide the Chat tab with `display: none`
- !Your own CSS [`style={{ display: 'none' }}`] | **Keeps** the DOM and the draft | Effects **keep running**; updates at **normal priority**
- +A hidden Activity [`<Activity mode="hidden">`] | **Keeps** the DOM and the draft | Effects are **cleaned up**; updates at a **lower priority**
```

### Replacing Activity with a plain `<div>`

A developer might consider replacing `<Activity>` with a plain wrapper div using custom styles. Entered form data remains visible upon return, making the page appear functional. However, every hidden tab continues running background work. The hidden chat tab maintains an active server connection for an invisible view, and its re-renders compete with the visible tab at full priority.

---

## PRINCIPLE | `useEffect` cleanup in a hidden tab: React disconnects on hiding and connects again on showing

> [!PRINCIPLE]
> **Principle 4: Hidden Effects: React Runs Every Cleanup When the Boundary Is Hidden**
>
> *When a boundary becomes hidden, React runs the cleanup of every Effect inside it; when it becomes visible, React runs the Effects again.*
>
> A hidden Activity keeps the state and the DOM, and it stops the Effects. The chat server disconnects when the user leaves the tab and connects again when the user comes back, while the draft waits in the `<textarea>`. So every Effect must do its stopping work in its cleanup function.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection();
>   connection.connect();
>   ~return () => connection.disconnect();~ // Disconnects when the tab is hidden, connects again when it is visible
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection();
>   ~connection.connect();~ // **WRONG:** no cleanup, so the hidden tab stays connected and coming back opens a second connection
> }, []);
> ```

Here is the Effect of the chat tab once more:

```jsx title="src/ChatTab.jsx" startLine="7"
useEffect(() => {
  const connection = createConnection();
  connection.connect(); // Runs when the tab appears
  ~return () => connection.disconnect();~ // Runs when the boundary becomes hidden
}, []);
```

When an Activity boundary hides, React runs cleanup functions for every Effect in the subtree. When the boundary becomes visible again, React re-executes those Effects. For Effects, hiding behaves like unmounting. For state and DOM elements, hiding preserves existing instances.

### The draft survives, and the connection does not

Because the draft survived, developers might expect the server connection to remain open as well. It does not. Here is the operational sequence:
1. The application loads displaying the Chat tab. React runs the Effect, logging a connection message.
2. The user enters a draft message into the input field.
3. The user selects Contacts, setting the chat boundary to hidden mode.
4. React runs the Effect cleanup, logging a disconnection message.
5. The draft message remains stored inside the hidden textarea.
6. The user selects Chat, restoring the boundary to visible mode.
7. React re-runs the Effect. The console logs a new connection message while the textarea displays the draft.

```page caption="The page after the user types Hello John, clicks Contacts, and clicks Chat again, with Activity."
line: [Chat] [Contacts]
form:
  textarea: Message | Hello John | good
log: ✅ Connecting... | chat.js:4
log: ❌ Disconnected. | chat.js:7
log: ✅ Connecting... | chat.js:4
```

Compare this console output with Principle 1. Under conditional rendering, the console printed identical logs, but the input field returned empty. With `<Activity>`, the Effects cycle normally while the component state persists.

```tree dir=right caption="What a hidden Activity keeps and what it stops while the user is on Contacts."
The Chat tab inside a hidden Activity
- +Kept [`draft` and the `<textarea>`] | React **saves the state** and **keeps the DOM** | The user comes back to **`Hello John`**
- !Stopped [`useEffect` and its cleanup] | React **runs the cleanup** on hiding | The chat server is **disconnected** until the tab is visible again
```

Pausing subscriptions on hidden views conserves memory and network bandwidth. Only Effects pause. Hidden components continue responding to updated props, rendering at a lower priority.

### Two mistakes with Effects in a hidden tab

1. **Expecting hidden components to process live background events.** A developer might attempt to receive incoming chat notifications while the user views contacts. Because the connection lives inside the chat component, the Effect disconnects upon hiding, preventing notifications. Tasks that must continue while a tab is hidden belong in persistent components like `App`.
2. **Omitting the cleanup function.** Without a cleanup function, React cannot tear down active subscriptions when the boundary hides. The hidden component remains connected. When the user returns, React executes the Effect again, opening a second connection alongside the orphaned original.

Here is the console output when the cleanup function is omitted:

```page caption="The page after the user leaves the Chat tab and comes back, when the Effect has no cleanup."
line: [Chat] [Contacts]
form:
  textarea: Message | Hello John
log: ✅ Connecting... | chat.js:4
log: ✅ Connecting... | chat.js:4
```

Two connections remain active simultaneously without a single disconnection event. Any Effect establishing an external subscription must return a cleanup function. In development, StrictMode unmounts and remounts subtrees eagerly to reveal missing cleanups (Lesson 47).

---

## PRINCIPLE | `<audio>` in a hidden tab: the element stays in the DOM, so a cleanup must pause it

> [!PRINCIPLE]
> **Principle 5: Hidden Media: Stop DOM Side Effects in a Cleanup**
>
> *A hidden Activity keeps its DOM, so a playing `<audio>`, `<video>`, or `<iframe>` keeps going; stop it in an Effect cleanup, such as `audio.pause()`.*
>
> `display: none` changes how an element looks, not what it does. With `&&`, removing the `<audio>` stopped the sound for free. With a hidden Activity, the `<audio>` stays in the DOM, so a cleanup in `useLayoutEffect` must pause it at the moment the tab is hidden.
>
> **DO THIS:**
> ```jsx
> useLayoutEffect(() => {
>   const audio = audioRef.current;
>   ~return () => audio.pause();~ // The sound stops when the user leaves the tab
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<audio ref={audioRef} src="/john-voice.mp3" />~ {/* **WRONG:** no cleanup, so John keeps talking on the Contacts tab */}
> ```

### A voice message under `display: none`

The chat tab now includes a voice message with a play button:

```page caption="The Chat tab with John's voice message and the message field."
line: [Chat] [Contacts]
line: John sent a voice message [Play]
form:
  textarea: Message |
```

```jsx title="src/ChatTab.jsx"
const ~audioRef~ = useRef(null); // Holds the <audio> element after the first render

<p>
  John sent a voice message
  <button onClick={() => audioRef.current.play()}>Play</button>
</p>
~<audio ref={audioRef} src="/john-voice.mp3" />~ {/* Plays John's voice message, and shows nothing on the page */}
```

A ref stores the underlying DOM element after initial rendering (Lesson 31). This element represents the standard audio node provided by the browser. Invoking the play method initiates native audio playback.

If the user starts playback and switches to Contacts, the audio continues playing. The chat tab disappears from the screen, yet the sound persists. Here is why:
1. The user clicks play, prompting the browser to start streaming audio.
2. The user switches to Contacts, setting the chat boundary to hidden mode. React applies `display: none` to the container.
3. The audio element remains attached to the DOM. CSS display properties alter visual layout, not native audio streams.
4. The audio continues playing while the user navigates contacts.

Because DOM elements in hidden subtrees remain attached, their native browser behaviors persist. Elements exhibiting this persistence include video, audio, and iframes.

With conditional rendering, React detached the audio element from the DOM, causing playback to halt automatically. With `<Activity>`, the element remains attached.

### Pausing the audio in the cleanup

When a component renders DOM elements with autonomous side effects, add an Effect that pauses playback during cleanup:

```jsx title="src/ChatTab.jsx"
useLayoutEffect(() => {
  const audio = audioRef.current;
  ~return () => audio.pause();~ // Stops John's voice when the boundary becomes hidden
}, []);
```

Copying the ref value into a local variable inside the effect ensures the cleanup references the correct element.

Audio playback now pauses synchronously when leaving the tab. When the user returns, the audio element remains at its paused timestamp without reloading media files.

### VS | `useLayoutEffect` vs. `useEffect` for the pause: only one pauses at the moment the tab is hidden

Comparing layout effects with standard effects for pausing playback:

```jsx title="Pausing in a useLayoutEffect cleanup vs. in a useEffect cleanup"
~useLayoutEffect~(() => { const audio = audioRef.current; return () => audio.pause(); }, []); // Pauses at the moment the tab is hidden
~useEffect~(() => { const audio = audioRef.current; return () => audio.pause(); }, []); // Also pauses, but React may run this cleanup later
```

In straightforward layouts, both hooks pause playback successfully. However, their timing guarantees differ under complex transitions. The cleanup logic belongs to the exact moment the interface hides visually.

React can defer standard Effect cleanups when suspending or animating view transitions. In those situations, standard cleanups may allow audio to continue playing briefly after the view disappears. Using `useLayoutEffect` guarantees playback pauses synchronously before the browser paints layout updates.

```tree dir=right caption="What happens to John's voice message when the user leaves the Chat tab."
The user plays John's voice message and clicks Contacts
- !Hidden Activity, no cleanup [`<audio>` with `display: none`] | The `<audio>` is **still in the DOM** | The user **still hears John** on the Contacts tab
- +Hidden Activity, pause in the cleanup [`useLayoutEffect` with `audio.pause`] | React runs the cleanup **as the tab is hidden** | The sound **stops**, and resumes **where it stopped**
```

Most standard components do not require manual DOM cleanup. Only elements controlling native browser playback or external documents need explicit cleanup logic.

---

## PRINCIPLE | `use` in a hidden tab: React renders the tab before the click, so its data is ready

> [!PRINCIPLE]
> **Principle 6: Pre-rendering: A Hidden Boundary Renders Its Children in the Background**
>
> *A boundary hidden on the first render still renders its children at a lower priority, so data read with `use` loads before the user opens the tab; data fetched in an Effect does not.*
>
> `&&` renders nothing until the user opens the tab, so the request starts on the click and the user waits. A hidden Activity renders the tab in the background when the page loads, without running its Effects. A list read with `use` is ready by the time the user clicks.
>
> **DO THIS:**
> ```jsx
> const contacts = ~use(fetchData('/contacts'))~; // Starts loading while the tab is still hidden
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   ~fetchData('/contacts').then(setContacts);~ // **WRONG:** hidden Effects do not run, so loading starts on the click
> }, []);
> ```

### A hidden boundary still renders

Previous examples examined tabs hidden after being opened. Now consider a tab configured as hidden upon initial page load:

```jsx title="A boundary that is hidden on the first render"
<Activity ~mode="hidden"~> {/* Not on the screen, but React still renders ContactsTab in the background */}
  <ContactsTab />
</Activity>
```

A hidden boundary still executes render logic. React invokes component functions inside hidden boundaries in the background at low priority.

> [!DEFINITION]
> **Pre-rendering.** [NEW] Pre-rendering is the process of executing component render logic before content is displayed on screen. An Activity boundary configured with `mode="hidden"` pre-renders its children in the background without executing their Effects, preparing data and UI structures ahead of time (Lesson 73).

### The Contacts tab reads its list with `use`

In production applications, contact lists load from remote servers. The contacts component reads data using the `use` hook (Lesson 71):

```jsx title="src/ContactsTab.jsx"
import { use } from 'react';
import { fetchData } from './data.js';

export default function ContactsTab() {
  const contacts = ~use(fetchData('/contacts'))~; // Waits for the list; Suspense shows the fallback meanwhile
  return (
    <ul>
      {contacts.map(name => <li key={name}>{name}</li>)}
    </ul>
  );
}
```

A caching helper retains promises by URL, ensuring repeated renders read the identical request. The promise resolves after one second to simulate network latency:

```js title="src/data.js"
const cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getContacts());
  }
  return cache.get(url);
}

async function getContacts() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return ['John', 'Mia'];
}
```

In the parent component, a Suspense boundary displays fallback content while the request resolves (Lesson 69).

### VS | `&&` vs. a hidden Activity on the first click: one starts loading on the click, the other is already done

The application loads displaying Chat. The user types for several seconds, then selects Contacts for the first time:

::: row caption="What the user sees right after the first click on Contacts, with && and with a hidden Activity."
::: col title="With &&" tag="waits after the click" tone=bad
```page size=mini
line: [Chat] [Contacts]
line: Loading contacts... | bad
```
```jsx title="src/App.jsx" bad="1"
{tab === 'contacts' && (
  <Suspense fallback={<p>Loading contacts...</p>}>
    <ContactsTab />
  </Suspense>
)}
```
`ContactsTab` first renders on the click, so the request starts on the click.
:::
::: col title="With a hidden Activity" tag="ready before the click" tone=good
```page size=mini
line: [Chat] [Contacts]
line: John | good
line: Mia | good
```
```jsx title="src/App.jsx" good="1"
<Activity mode={tab === 'contacts' ? 'visible' : 'hidden'}>
  <Suspense fallback={<p>Loading contacts...</p>}>
    <ContactsTab />
  </Suspense>
</Activity>
```
`ContactsTab` rendered when the page loaded, so the list was already there.
:::
:::

Because both views remain off screen initially, developers often assume both initiate fetching on click. With a hidden Activity, pre-rendering occurs instead:
1. The application loads displaying the Chat tab while the Contacts boundary mounts in hidden mode.
2. React renders the hidden contacts component in the background, initiating the request through the cached helper.
3. The request resolves after one second while the user enters text in Chat.
4. The user selects Contacts and views the list immediately without experiencing a loading state.

Under conditional rendering, React avoids rendering the contacts component until clicked, delaying data loading until user interaction. Pre-rendering prepares the component ahead of time.

### Fetching in an Effect is not pre-rendered

Wrapping a component that fetches data inside `useEffect` in a hidden Activity fails to accelerate loading. The initial navigation still displays the loading placeholder. Hidden boundaries render components, but they do not execute their Effects. Consequently, data loading inside an Effect waits until the user opens the tab. Only data fetching integrated with Suspense, such as promises read with `use`, executes during pre-rendering.

```tree dir=right caption="Which Contacts tabs load their list before the first click."
The first click on Contacts
- !With `&&` [`tab === 'contacts' && <ContactsTab />`] | `ContactsTab` **first renders on the click** | The user sees **`Loading contacts...`** for one second
- !Hidden Activity, fetch in `useEffect` | React renders the tab but **runs no Effects** | The request **starts on the click**, and the user waits
- +Hidden Activity, list read with `use` | React **renders the tab when the page loads** | The list is **ready** when the user clicks
```

---

## All 6 Principles Together

### The complete files

Here is the complete parent component. Each view sits inside an Activity boundary, and the contacts view includes Suspense handling:

```jsx title="src/App.jsx"
import { Activity, Suspense, useState } from 'react';
import ChatTab from './ChatTab.jsx';
import ContactsTab from './ContactsTab.jsx';

export default function App() {
  const [tab, setTab] = useState('chat');

  return (
    <main>
      <button onClick={() => setTab('chat')}>Chat</button>
      <button onClick={() => setTab('contacts')}>Contacts</button>
      <Activity ~mode={tab === 'chat' ? 'visible' : 'hidden'}~> {/* Principle 2: the draft survives every switch */}
        <ChatTab />
      </Activity>
      <Activity ~mode={tab === 'contacts' ? 'visible' : 'hidden'}~> {/* Principle 6: hidden on load, so the list loads early */}
        <Suspense fallback={<p>Loading contacts...</p>}>
          <ContactsTab />
        </Suspense>
      </Activity>
    </main>
  );
}
```

The finished chat tab includes two cleanup functions, managing the chat server and the voice message:

```jsx title="src/ChatTab.jsx"
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createConnection } from './chat.js';

export default function ChatTab() {
  const [draft, setDraft] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    ~return () => connection.disconnect();~ // Principle 4: disconnects when the tab is hidden
  }, []);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    ~return () => audio.pause();~ // Principle 5: stops John's voice when the tab is hidden
  }, []);

  return (
    <section>
      <p>
        John sent a voice message
        <button onClick={() => audioRef.current.play()}>Play</button>
      </p>
      <audio ref={audioRef} src="/john-voice.mp3" />
      <label>
        Message
        <textarea value={draft} onChange={e => setDraft(e.target.value)} />
      </label>
    </section>
  );
}
```

The contacts component and data module match the implementations from Principle 6. The chat server helper matches the initial setup.

### How React renders the chat app

The user enters text, plays the voice message, navigates to Contacts, and returns to Chat. The draft persists, playback pauses upon leaving, and the chat connection re-establishes:

```page caption="The finished chat app after the user types Hello John, plays the voice message, clicks Contacts, and clicks Chat again."
line: [Chat] [Contacts]
line: John sent a voice message [Play]
form:
  textarea: Message | Hello John | good
log: ✅ Connecting... | chat.js:4
log: ❌ Disconnected. | chat.js:7
log: ✅ Connecting... | chat.js:4
```

On initial load, React renders the main component first. React renders the chat tab inside the visible boundary at normal priority, and pre-renders the contacts tab inside the hidden boundary:

```tree caption="The order in which React renders the chat app when the page loads on the Chat tab."
1. React calls `App` | Holds `tab`, which starts as `'chat'`
- +Visible Activity [`mode="visible"`] | Shows its child **on the screen**
  - +2. `ChatTab` at normal priority | Its Effects run: it **connects** to the chat server
- +Hidden Activity [`mode="hidden"`] | Hides its child with **`display: none`**
  - +3. `<Suspense>` and `ContactsTab` in the background | **Lower priority**, no Effects | `use` starts loading **John and Mia**
```

| Aspect | Removing the tab with `&&` | Hiding the tab with `<Activity>` |
| :--- | :--- | :--- |
| **State** | Thrown away; the tab comes back with its initial state | Saved; the tab comes back as the user left it |
| **DOM** | Removed | Kept, with `display: none` written by React |
| **Effects** | Cleaned up when the tab is removed | Cleaned up when the tab is hidden, run again when it is visible |
| **Media such as `<audio>`** | Stops, because the element leaves the DOM | Keeps playing unless a cleanup pauses it |
| **Updates while away** | None; the tab does not exist | Rendered at a lower priority |
| **A tab hidden on page load** | Not rendered until the first click | Pre-rendered, so data read with `use` loads early |

Remember the essential distinction of this lesson. **Conditional rendering with `&&` removes a component and discards its state. Hiding a component with `<Activity mode="hidden">` keeps its state and DOM intact while pausing active Effects until the user returns.**

---

## For the Interview

> **The Interview Question:** How do you hide a subtree without losing its state with <Activity>?

### How to Answer Clearly in 30 Seconds

"When conditionally rendering tabs with `&&`, leaving an active tab unmounts it, destroying its internal state and DOM nodes. To preserve both, wrap the tab in an `<Activity>` component imported from `react` and toggle its `mode` prop between `'visible'` and `'hidden'`. Setting `mode="hidden"` provides four key behaviors:
1. **Preserved state.** React retains component state in memory and restores it when visibility returns.
2. **Preserved DOM.** React applies `display: none` to the DOM elements, preserving uncontrolled form inputs and scroll positions.
3. **Paused Effects.** React runs Effect cleanups as if the subtree unmounted, re-executing Effects when the component becomes visible again.
4. **Lower update priority.** Hidden components still re-render in response to updated props, but at lower priority. A boundary hidden on initial load pre-renders in the background, allowing data read with `use` to finish loading before navigation.

Always ensure Effects clean up active subscriptions, and pause playing media such as `<audio>` or `<video>` inside a `useLayoutEffect` cleanup."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Isn't `<Activity mode="hidden">` just `display: none`?"**
   **No.** The `display: none` rule only controls DOM visibility. Applying CSS directly leaves React unaware that the component is hidden. Consequently, its Effects keep running and updates retain normal priority. In contrast, `<Activity>` informs React that the subtree is concealed. React cleans up active Effects and renders background updates at lower priority. The React team originally named this component Offscreen. They renamed it to Activity because components can be visible yet inactive, such as content obscured behind a modal dialog. It officially shipped in React 19.2.
2. **"What happens to Effects, timers, and media inside a hidden Activity?"**
   React executes Effect cleanups when an Activity boundary hides, and re-executes Effects when visibility returns. Timers stop only if scheduled within an Effect that clears them during cleanup. Media elements require explicit handling because their DOM nodes remain attached to the document. Playing `<video>`, `<audio>`, or `<iframe>` elements continue playback unless paused. The recommended approach registers a `useLayoutEffect` hook whose cleanup pauses playback synchronously upon concealment. In development, StrictMode unmounts and remounts subtrees to uncover missing cleanup logic.
3. **"When would you not use Activity to keep a tab's state?"**
   When a view should start fresh, such as opening a new conversation, unmounting or assigning a dynamic `key` is preferred. When state must be shared with other parts of the application, lifting state up to a common ancestor remains the standard solution. When data must survive closing the page, saving state in browser storage is required. Furthermore, hidden components fetching data inside `useEffect` do not benefit from pre-rendering. Only Suspense-compatible resources read with `use` prefetch during pre-rendering.

```tree dir=right caption="Interview comparison: removing a tab, hiding it with your own CSS, and hiding it with Activity."
Three ways to take a tab off the screen
- !Remove it with `&&` | State and DOM are **thrown away** | The user comes back to an **empty tab**
- !Hide it with your own `display: none` | State and DOM are kept | Effects **keep running** at **full priority**
- +Hide it with `<Activity mode="hidden">` | State and DOM are kept | Effects are **cleaned up**; updates at a **lower priority**; data read with `use` **loads early**
```
