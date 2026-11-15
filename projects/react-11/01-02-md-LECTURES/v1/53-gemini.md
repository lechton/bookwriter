# Lecture 53: How a Component Subscribes to a Store Outside React

*(How does React find out that the browser changed a value React never touched?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you subscribe to a store that lives outside React?

---

## VS | A Copy in State `useState` + `useEffect` vs. a Subscription `useSyncExternalStore`: the copy can be wrong, the subscription reads the real value

> When the network connection drops, the browser detects the change immediately, but React remains unaware. React schedules a re-render only when internal state or props change. **To display values stored outside React, subscribe to the data source using `useSyncExternalStore`**. You provide a subscription function and a snapshot reader so React reads the latest value directly. Copying external data into component state with an Effect introduces synchronization lag, initial state mismatches, and visual inconsistencies across components.

In standard JavaScript, your application listens for browser events and updates the DOM directly:

```js title="Plain JavaScript: you listen, and you write into the page yourself"
window.addEventListener('offline', () => {
  ~heading.textContent = 'Disconnected'~; // Your own code writes the new text into the DOM
});
```

In declarative React, components do not manipulate the DOM directly. React computes the DOM representation from your JSX during its render phase. React schedules a component re-render only when its internal state, props, or consumed context change (Lesson 12). When the browser updates an internal property, no React state change occurs. As a result, React receives no notification that the rendered UI is out of date.

To bridge this gap, React must register an active subscription with the external data source. Instead of polling the browser repeatedly, the component registers a listener that notifies React whenever the underlying value updates. To establish this bridge, you supply React with two dedicated functions:

```jsx title="React: you tell React how to hear about a change and how to read the value"
const isOnline = ~useSyncExternalStore(subscribe, getSnapshot)~; // React listens through subscribe and reads through getSnapshot
```

1. **`subscribe`** registers a change listener with the external data source. In this scenario, it connects React to the browser `online` and `offline` events.
2. **`getSnapshot`** reads the current value from the external store. In this scenario, it reads and returns `navigator.onLine`.

React invokes the subscription callback to receive change notifications. It invokes the snapshot reader to inspect the current data value during each render pass.

> [!DEFINITION]
> **navigator.onLine and the online and offline events.** [REVIEW] `navigator.onLine` is a built-in browser property available on the global navigator object. It returns `true` when the browser maintains network connectivity and `false` when completely disconnected. When connectivity drops, the browser dispatches an `offline` event on `window`. When connectivity returns, it dispatches an `online` event. A custom Hook can listen to these window events to track network status (Lesson 39).

> [!DEFINITION]
> **An external store.** [NEW] An external store is any state container that exists outside React internal fiber architecture and mutates outside the React dispatch cycle. It generally falls into two categories. First, browser APIs that expose mutable environment state, such as `navigator.onLine` or `window.innerWidth`. Second, third-party state management libraries that store application state in independent JavaScript objects rather than React state hooks (Lesson 53).

### Who Owns the Data

To choose between `useSyncExternalStore` and internal React state, determine which system manages and mutates the underlying data:
1. **React code owns the data.** When component event handlers create and update the values, use `useState` or `useReducer`. The official React documentation recommends built-in state hooks whenever your application controls the data lifecycle.
2. **The browser or an external library owns the data.** When data updates occur outside React component lifecycles, use `useSyncExternalStore`. Examples include browser properties like `navigator.onLine` or standalone stores from state libraries.
3. **The anti-pattern: duplicating external data into state.** Storing external values in `useState` and syncing them through `useEffect` creates duplicate sources of truth. The official React documentation describes this approach as not ideal, recommending `useSyncExternalStore` as the standard, resilient solution.

```tree caption="Three ways to keep a value on the screen, chosen by who changes the data."
Who changes the data on the screen?
- +Our own React code [`useState` `useReducer`] | Our handlers **create and change** the data | The **first choice** whenever it is possible
- +Something outside React [`useSyncExternalStore`] | The browser or a library **changes the data** without React's knowledge | React **subscribes** and **reads the value itself**
- !A copy of the outside value in state [`useState` `useEffect`] | Our code keeps **a second copy** up to date by hand | React's docs label it **Not ideal**
```

### What a Wrong Status Costs the User

Displaying an active online status when connectivity has dropped misleads the user. The user assumes their work is syncing, clicks a save button, and loses data when the request fails silently.

The problem compounds when separate components display conflicting network states. A header might indicate that the user is offline, while an adjacent action button still indicates an active connection.

### The Rule of Thumb: subscribe to what React cannot see

**When a mutable value lives outside React, never read it directly during render, and avoid manually synchronizing it into state. Subscribe to the external store using `useSyncExternalStore`, typically encapsulated within a reusable custom Hook.**

Engineers frequently encounter two common pitfalls:
1. **Reading an external property directly during render.** The component reads the correct initial value upon mounting, concealing the bug until the underlying external value changes.
2. **Duplicating external values into component state using an Effect.** While both approaches expose boolean flags, manually synchronizing state introduces stale initial values and concurrent rendering bugs, as detailed in Principle 3.

Keep the central rule of this lesson in mind. **React cannot detect changes in external data sources automatically, requiring components to subscribe to updates and delegate snapshot reads directly to React.**

## SECTION | The Notes App with a Heading and a Save Button

Our interface is the note-taking application from Lesson 39. At the top of the view, a status header displays `Online`. Below the header, the user edits text inside a `<textarea>` element. Beneath the text field sits a `Save progress` button.

```page caption="The notes app while the network is on: the heading reads Online, and the button takes clicks."
heading: Online
form:
  textarea:  | Buy milk
  button: Save progress
console: quiet
```

When network connectivity drops, two UI elements must update simultaneously:
1. The status heading updates its text to `Disconnected`.
2. The save button disables user interaction, displays a disabled visual style, and changes its label to `Reconnecting...`.

```page caption="The same notes app right after the Wi-Fi drops: the heading reads Disconnected, and the button is grey and takes no clicks."
heading: Disconnected
form:
  textarea:  | Buy milk
  button: Reconnecting... | | disabled
console: quiet
```

When network connectivity returns, both elements immediately revert to their active states, displaying `Online` and `Save progress`.

The application comprises six files. Both interactive components consume the same custom Hook, `useOnlineStatus`. At the beginning of this lesson, that Hook relies on the state and Effect pattern from Lesson 39. By the end of this lesson, we will refactor only the internal implementation of that single Hook file.

```files title="notes-app: File Explorer" caption="How the files of the notes app sit inside src/: the App, two components, and the custom Hook both components call."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Holds the `note` state and renders `<StatusBar />`, the `<textarea>`, and `<SaveButton />`
  StatusBar.jsx | component | Renders the `Online` or `Disconnected` heading
  SaveButton.jsx | component | Renders the `Save progress` or `Reconnecting...` button
  useOnlineStatus.js | custom Hook | Exports `useOnlineStatus`, which returns `true` or `false`; this lesson rewrites its inside
```

The application entry point mounts the root component inside strict mode (Lesson 07). The root component stores the text area content in state, meaning every keystroke triggers a state update and re-renders the component tree:

```jsx title="src/App.jsx"
import { useState } from 'react';
import StatusBar from './StatusBar.jsx';
import SaveButton from './SaveButton.jsx';

export default function App() {
  const [note, setNote] = useState('Buy milk');
  return (
    <>
      <StatusBar />
      <textarea value={note} ~onChange={e => setNote(e.target.value)}~ /> {/* Every letter renders App, StatusBar, and SaveButton again */}
      <SaveButton />
    </>
  );
}
```

The save button reads the network status through the custom Hook and disables itself whenever the client disconnects:

```jsx title="src/SaveButton.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';

export default function SaveButton() {
  const isOnline = ~useOnlineStatus()~; // true or false, from the Hook
  function handleSaveClick() {
    console.log('Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

**CORE ARCHITECTURE:** React initiates rendering passes in response to internal state transitions and prop changes. To synchronize with external values, components must register active subscriptions and delegate snapshot reads directly to React. Six core principles govern this architecture:
1. **Principle 1: A Direct Read of navigator.onLine Never Updates the Page.** A direct read provides the correct value during initial render, but subsequent external mutations trigger no component re-renders.
2. **Principle 2: useSyncExternalStore Takes Two Functions.** The `subscribe` function connects React to external change notifications, while `getSnapshot` reads the current value synchronously.
3. **Principle 3: The Effect Version Is NOT the Same Thing.** While an Effect-based implementation returns a matching boolean, it requires manual state synchronization and risks displaying incorrect initial states.
4. **Principle 4: Every Component Shows the Same Version of the Store.** During concurrent rendering, React re-evaluates snapshots before committing changes, preventing inconsistent UI tearing across components.
5. **Principle 5: getSnapshot Returns the Same Value While Nothing Changed.** The snapshot reader must maintain referential stability for unchanged data, or React detects continuous changes and triggers an infinite render loop.
6. **Principle 6: Declare subscribe Outside the Hook.** Declaring the subscription function inside the Hook body generates a new function reference on every render, causing React to resubscribe unnecessarily on every state update.

---

## PRINCIPLE | navigator.onLine in the component body: read once, and the page never hears the change

> [!PRINCIPLE]
> **Principle 1: A Direct Read of navigator.onLine Never Updates the Page**
>
> *A value that lives outside React, read directly in the component body, is right on the first render and then stays old.*
>
> React renders a component again only after a state update, in the component itself or in a parent above it. When the browser changes `navigator.onLine`, no state changes, so React never calls the component again. The page keeps the old value, with no error. A value like this must be subscribed to.
>
> **DO THIS:**
> ```jsx
> export default function StatusBar() {
>   const isOnline = ~useOnlineStatus()~; // Subscribes, so React renders again when the network changes
>   return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function StatusBar() {
>   const isOnline = ~navigator.onLine~; // **WRONG:** read once per render, so the heading stays on Online after the Wi-Fi drops
>   return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
> }
> ```

### Reading the browser's value directly

Developers sometimes question the need for state hooks or subscription effects when the browser already exposes `navigator.onLine` globally. A developer might attempt to read the property directly during render:

```jsx title="src/StatusBar.jsx"
export default function StatusBar() {
  const isOnline = ~navigator.onLine~; // Reads the browser's value once, during this render
  return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
}
```

When the application loads while connected to the network, the header displays `Online`. The initial visual output appears correct. The save button component continues to consume the existing custom Hook backed by an Effect.

When the user disconnects from the network, a visual discrepancy emerges immediately:

```page caption="The notes app after the Wi-Fi drops, when StatusBar reads navigator.onLine directly: the heading still says Online, while the button already says Reconnecting."
heading: Online | bad
form:
  textarea:  | Buy milk
  button: Reconnecting... | | disabled
console: quiet
```

**The header continues displaying `Online`, while the save button immediately updates to `Reconnecting...`, without generating any console errors.**

### Why the heading stays on Online

The expression `navigator.onLine` executes only during a component render phase. Without a scheduled render, the component code never re-runs:
1. The application mounts while online. React renders the status bar, reads `true` from the browser, and renders the `Online` text.
2. The network disconnects. The browser environment mutates `navigator.onLine` to `false`.
3. Because no state or prop changes occurred inside the status bar or its parent component, React schedules no render pass.
4. The status bar retains its stale DOM markup, showing `Online`.

The save button updates correctly because its underlying Hook registers an event listener for `offline` and invokes a state setter. Calling a state setter notifies React to schedule a re-render for the save button. Because the status bar contains no state setter, React receives no notification.

This behavior can produce deceptive bugs because an unrelated update can cause the stale component to re-render by coincidence. When the user types a character into the note field, the parent component updates its state. Re-rendering the parent component forces all child components to re-render, at which point the status bar finally re-evaluates `navigator.onLine` and updates to `Disconnected`. The interface updates as a side effect of typing, rather than in response to the network change.

```tree dir=right caption="Why a direct read of navigator.onLine freezes the heading: the browser changes the value, but nothing tells React to render again."
What happens when the Wi-Fi drops
- +1. First render [`navigator.onLine`] | React calls `StatusBar` and reads **`true`** | The heading reads **Online**
- !2. The browser changes the value | `navigator.onLine` becomes **`false`** | **No state changed**, so React does **not** call `StatusBar`
- !3. The page stays old | The heading still reads **Online** | The Console shows **no error**
```

Reading a value during render and receiving notifications when that value mutates are fundamentally distinct operations. A read inside the component function body occurs exclusively when React initiates a render pass.

Furthermore, reading mutable external properties directly during render violates component purity (Lesson 14). Pure components must produce predictable output based strictly on their props, state, and context. Reading an external browser property introduces an untracked dependency that mutates outside the React runtime.

### A dependency array does not help either

Placing `navigator.onLine` inside an Effect dependency array fails to resolve the issue. React evaluates Effect dependencies only after completing a render cycle (Lesson 35). Because mutating an external browser property does not trigger a render cycle, React never inspects the dependency array.

The official React documentation provides the exact architectural solution: read and subscribe to external mutable values using `useSyncExternalStore`.

---

## PRINCIPLE | useSyncExternalStore: subscribe hears every change, getSnapshot reads the real value

> [!PRINCIPLE]
> **Principle 2: useSyncExternalStore Takes Two Functions**
>
> *Call `useSyncExternalStore(subscribe, getSnapshot)` at the top level; `subscribe` hands React's `callback` to the store's change events, and `getSnapshot` returns the value.*
>
> React cannot see a value outside React change, so we give it two functions. React calls `subscribe` with its own `callback`, and our code hands that `callback` to the store's events. When an event fires, React calls `getSnapshot`. If the value is different from the last one, React renders the component again.
>
> **DO THIS:**
> ```jsx
> function subscribe(callback) {
>   window.addEventListener('online', callback);
>   window.addEventListener('offline', callback);
>   return () => {
>     window.removeEventListener('online', callback);
>     window.removeEventListener('offline', callback);
>   };
> }
> const isOnline = ~useSyncExternalStore(subscribe, getSnapshot)~; // React hears every change and reads the real value
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~subscribe~(callback) { // **WRONG:** returns no cleanup function, so the listeners stay after StatusBar leaves the screen
>   window.addEventListener('online', callback);
>   window.addEventListener('offline', callback);
> }
> ```

`useSyncExternalStore` is a built-in React Hook imported from `'react'`. Following the rules of Hooks, you invoke it unconditionally at the top level of your component or custom Hook (Lesson 38). The Hook accepts two required function arguments, `subscribe` and `getSnapshot`, and returns the current store value. Each function fulfills a dedicated role in managing synchronization.

### getSnapshot: how React reads the value

`getSnapshot` serves as the reader function that React invokes synchronously to inspect the store:

```jsx title="getSnapshot: how React reads the value"
function getSnapshot() {
  return ~navigator.onLine~; // true while the network is on, false while it is off
}
```

The returned value represents a **snapshot**, capturing the immutable state of the external store at a single point in time. The Hook returns this snapshot directly to your component, where it assigns to `isOnline`.

### subscribe: how React hears about a change

The `subscribe` function registers React's internal update listener with the external event target:

```jsx title="subscribe: how React hears about a change"
function subscribe(~callback~) { // React writes callback and passes it in
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

This implementation attaches listeners to the same native window events used in Lesson 39. The returned arrow function serves as a cleanup callback, mirroring the cleanup phase of an Effect (Lesson 32). React preserves this cleanup function and invokes it when unsubscribing, such as when the component unmounts from the DOM.

### Where callback comes from

In conventional browser scripting, you define the event handler logic manually before passing it to `addEventListener`. When configuring `useSyncExternalStore`, you declare `callback` as a parameter but never define its internal implementation. **React creates this callback internally and supplies it as an argument when calling your subscription function.** The event flow proceeds through four stages:
1. React accepts your `subscribe` function as the first argument to `useSyncExternalStore`.
2. React invokes `subscribe`, supplying an internal dispatcher function as the `callback` argument.
3. Your subscription function registers that dispatcher with the native `addEventListener` targets.
4. When the browser dispatches an event, it triggers React's internal dispatcher.

Upon receiving the notification, React invokes `getSnapshot` to read the updated value. If the new snapshot differs from the previous one, React schedules a component re-render.

### StatusBar with useSyncExternalStore

Combining these elements produces a synchronized component. Declaring both functions at the module level keeps their references stable across render cycles:

```jsx title="src/StatusBar.jsx"
import { useSyncExternalStore } from 'react';

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

export default function StatusBar() {
  const isOnline = ~useSyncExternalStore(subscribe, getSnapshot)~; // Reads navigator.onLine again whenever the browser fires online or offline
  return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
}
```

When the user disconnects the network under this configuration, both components transition simultaneously:

```page caption="The notes app after the Wi-Fi drops, when StatusBar calls useSyncExternalStore: the heading and the button agree."
heading: Disconnected | good
form:
  textarea:  | Buy milk
  button: Reconnecting... | | disabled
console: quiet
```

### What React does when the Wi-Fi drops

When the client loses connectivity, React and the browser execute a coordinated sequence:
1. React renders the status bar, invokes `getSnapshot`, and receives `true`. The header renders the text `Online`.
2. React invokes `subscribe`, providing its internal update callback. The subscription function registers that callback with both window events.
3. The network disconnects. The browser dispatches the `offline` event on `window`, triggering React's registered callback.
4. React invokes `getSnapshot` to read the latest store state, receiving `false`.
5. React compares the previous snapshot with the new snapshot using `Object.is` (Lesson 32). Because the values differ, React schedules a re-render for the status bar, updating the header to `Disconnected`.

```tree dir=right caption="How React follows the network with the two functions: subscribe hears the change, getSnapshot reads it, and a different value makes React render again."
What happens when the Wi-Fi drops
- +1. React subscribes [`subscribe`] | React passes **its own `callback`** | Our code adds it to the **`online` and `offline` events**
- +2. The browser fires `offline` [`callback`] | React's **`callback` runs** | React calls **`getSnapshot`** again and gets **`false`**
- +3. React compares [`Object.is`] | **`true` and `false` differ** | React renders `StatusBar`, and the heading reads **Disconnected**
```

React possesses no native awareness of external browser properties. The `subscribe` function provides the exclusive channel through which React receives mutation events. The `getSnapshot` function provides the exclusive mechanism for reading the underlying data.

### When not to reach for it

Because network connectivity resides in the browser environment, it requires an active subscription. Application state that originates within React does not. The official React documentation recommends built-in state hooks like `useState` whenever possible. It notes that `useSyncExternalStore` exists primarily to integrate with non-React state systems.

Migrating standard component state, such as form inputs, into an external store adds unnecessary complexity. It forces you to author and maintain subscription mechanisms without providing architectural benefits.

---

## PRINCIPLE | useState plus useEffect: the copy returns the same boolean, but it starts from a guess

> [!PRINCIPLE]
> **Principle 3: The Effect Version Is NOT the Same Thing**
>
> *Do not copy an outside value into state with `useState` and `useEffect`; subscribe to it with `useSyncExternalStore`, usually from a custom Hook.*
>
> The Effect version returns the same `true` or `false`, so it looks like the same thing. It is not. It keeps a second copy of the value in state, and our code must keep that copy right by hand, starting with its first value. A wrong start, such as `useState(true)`, shows `Online` to a user who opens the app offline. `useSyncExternalStore` keeps no copy and reads the real value on the first render and on every render after it.
>
> **DO THIS:**
> ```js
> export function useOnlineStatus() {
>   return ~useSyncExternalStore(subscribe, getSnapshot)~; // Reads navigator.onLine on every render, starting with the first
> }
> ```
>
> **DO NOT DO THIS:**
> ```js
> export function useOnlineStatus() {
>   const [isOnline, setIsOnline] = ~useState(true)~; // **WRONG:** a guess, so an offline user sees Online and no event ever corrects it
>   useEffect(() => { /* copies the online and offline events into state */ }, []);
>   return isOnline;
> }
> ```

### Two versions of useOnlineStatus

The save button still relies on the Effect-based implementation of the custom Hook. Moving `subscribe` and `getSnapshot` into the Hook module allows both components to share the robust subscription pattern. The initial Hook file relies on manual state synchronization:

```js title="src/useOnlineStatus.js, with useState and useEffect"
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = ~useState(navigator.onLine)~; // A copy in state, with a starting value our code must choose
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Refactoring the Hook to use `useSyncExternalStore` places both helper functions in module scope:

```js title="src/useOnlineStatus.js, with useSyncExternalStore"
import { useSyncExternalStore } from 'react';

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
  return ~useSyncExternalStore(subscribe, getSnapshot)~; // No copy: React reads navigator.onLine on every render
}
```

The status bar simplifies to a single call: `const isOnline = useOnlineStatus();`. The save button requires no changes whatsoever.

### Who holds the value

Both implementations listen to the identical browser events and return boolean values. Under standard conditions when the browser starts online, both implementations render identical user interfaces. However, their underlying state management architectures differ fundamentally.

The primary distinction lies in data ownership:
- **Using `useState` and `useEffect` creates a secondary duplicate of the browser state inside React.** Your application code assumes full responsibility for keeping this duplicate synchronized, including setting the initial value, handling event listeners, invoking state setters, and running cleanup routines. Furthermore, every component calling the Hook instantiates its own isolated state copy (Lesson 39).
- **Using `useSyncExternalStore` eliminates state duplication entirely.** React queries the authoritative browser value directly using `getSnapshot` during the initial mount and throughout all subsequent renders.

### A copy starts from a guess

**State duplicates depend on the initial argument passed to `useState`, and no subsequent event will fire to correct an inaccurate starting value.** An initial implementation might pass `useState(true)`, guessing that the user is online. When a user opens the application while disconnected, this assumption fails:
1. Component state initializes to `true`. The initial render displays `Online`, and the save button remains active and clickable.
2. Because the network state did not transition after page load, the browser dispatches neither an `online` nor an `offline` event. The state copy remains persistently incorrect until connectivity changes.
3. In contrast, `useSyncExternalStore` requires no initial state guess. The initial render invokes `getSnapshot`, immediately reading the actual `false` value. The header displays `Disconnected`, and the save button renders in its disabled reconnecting state.

::: row caption="A user opens the notes app while already offline: the copy that starts from useState true shows Online, and useSyncExternalStore reads the real value."
::: col title="useState with a starting guess of true" tag="starts from a guess" tone=bad
```page size=mini
heading: Online | bad
form:
  textarea:  | Buy milk
  button: Save progress | | bad
```
The user clicks `Save progress`, and the note never reaches the server.
:::
::: col title="useSyncExternalStore" tag="reads the real value" tone=good
```page size=mini
heading: Disconnected | good
form:
  textarea:  | Buy milk
  button: Reconnecting... | | disabled
```
The first render reads `false`, so the page is right from the start.
:::
:::

The official React documentation highlights this precise failure mode. An Effect-based subscription presumes active connectivity on mount, causing persistent display errors when a client initializes while disconnected.

### A better starting value is still not the same thing

Initializing state dynamically using `useState(navigator.onLine)` resolves the initial value in a browser environment. However, manual state synchronization remains architecturally inferior to `useSyncExternalStore` for two reasons:
1. **Server environments lack the `navigator` object.** During server-side rendering, global browser APIs are unavailable (Lessons 101 to 105). To support server rendering, `useSyncExternalStore` accepts an optional third parameter, `getServerSnapshot`, which supplies a fallback snapshot for server HTML generation.
2. **Manual state duplicates lack consistency guarantees.** When using `useSyncExternalStore`, React ensures that every mounted component renders against a consistent snapshot of the store, as explored in Principle 4. Manually synchronized state copies provide no such guarantee.

The official React documentation classifies manual store subscriptions in Effects as not ideal. The documentation identifies `useSyncExternalStore` as the preferred, resilient approach for consuming external mutable data.

### Only the Hook file changed

Migrating to `useSyncExternalStore` required modifying only the custom Hook file. Both the status bar and save button continue calling `useOnlineStatus()`. Each component consumes the identical boolean contract without alterations. The official React documentation emphasizes this advantage: encapsulating the subscription inside a custom Hook isolates external store mechanics from consumer components.

```tree caption="The Effect version and the useSyncExternalStore version of useOnlineStatus return the same boolean, but only one keeps a copy of the value."
Two versions of `useOnlineStatus`
- !With `useState` and `useEffect` [`useState` `useEffect`] | Our code keeps **a copy in state** and keeps it right **by hand** | A wrong **starting value** shows **Online** to an offline user
- +With `useSyncExternalStore` [`subscribe` `getSnapshot`] | **No copy**: React reads `navigator.onLine` **itself** | The **first render is right**, and every component shows **the same version**
```

---

## PRINCIPLE | useSyncExternalStore: every component on the screen shows the same version of the store

> [!PRINCIPLE]
> **Principle 4: Every Component Shows the Same Version of the Store**
>
> *With `useSyncExternalStore`, every component on the screen shows the same version of the store, even when React pauses a render.*
>
> When React pauses a render, a store outside React can change in the middle, and two components could read two versions of it. For a Transition, React calls `getSnapshot` a second time just before it changes the DOM. If the value moved, React starts over as a blocking update, so the heading and the button never disagree.
>
> **DO THIS:**
> ```js
> export function useOnlineStatus() {
>   return ~useSyncExternalStore(subscribe, getSnapshot)~; // React checks getSnapshot again before changing the DOM
> }
> ```
>
> **DO NOT DO THIS:**
> ```js
> export function useOnlineStatus() {
>   return ~navigator.onLine~; // **WRONG:** no subscription, so React never checks the store again before changing the DOM
> }
> ```

### One store, one answer on the whole screen

Both the status bar and the save button read the identical external data source. The user interface must never present an inconsistent visual state:

```page caption="A torn screen that useSyncExternalStore never lets the user see: the heading says Disconnected while the button still offers to save."
heading: Disconnected
form:
  textarea:  | Buy milk
  button: Save progress | | bad
```

In this broken state, the header announces that the network is disconnected, while the adjacent action button still invites the user to save. When the user clicks the button, the request fails. **An external store holds exactly one authoritative value at any instant, and the entire rendered UI must reflect that single source of truth.**

### How a paused render can split the screen

Rendering does not always execute synchronously in an uninterrupted sequence. Under concurrent rendering, React can yield control back to the browser to process high-priority user input before resuming the render work (Lesson 66). Non-blocking updates, including Transitions, take advantage of this time-slicing mechanism (Lesson 67).

If an external store mutates during this interleaved yield, subsequent components in the same render pass will read different values. If React evaluates `StatusBar` before yielding and `SaveButton` after resuming, the components render inconsistent store snapshots.

> [!DEFINITION]
> **Tearing.** [NEW] Tearing refers to a visual defect where different components on the screen display conflicting values derived from the same underlying store during the same render pass. This inconsistency occurs when external data mutates mid-render while React yields execution during concurrent time-slicing. In our application, tearing manifests when the header displays `Disconnected` while the save button simultaneously displays `Save progress` (Lesson 53).

```tree caption="A torn screen and a consistent screen: two components that read one store show either two versions of it or one."
Two components read one store during one render
- !A torn screen | `StatusBar` reads the store **before** a pause; `SaveButton` reads it **after** | The heading says **Disconnected**, and the button says **Save progress**
- +One version on the whole screen [`useSyncExternalStore`] | React **checks the store again** before changing the DOM | The heading and the button **always agree**
```

### What React does to prevent it

**When using `useSyncExternalStore`, React performs a consistency check before committing changes to the DOM, restarting the render if the external data mutated.** During concurrent transitions, React executes this synchronization protocol:
1. React begins a Transition render, invoking `getSnapshot` for each subscribing component.
2. An external mutation occurs before React commits changes to the DOM. In our example, the network disconnects during the yield.
3. Immediately before committing DOM updates, React invokes `getSnapshot` a second time to verify store consistency.
4. React detects that the second snapshot differs from the value read during the initial render pass.
5. React discards the interrupted render pass and restarts the update synchronously as a blocking render that cannot be paused.
6. All subscribing components render the identical store state, displaying `Disconnected` and `Reconnecting...` in unison.

Application code never invokes `getSnapshot` manually. React orchestrates these reads internally. This consistency mechanism explains the "Sync" designation in `useSyncExternalStore`: React synchronizes external store updates through non-interruptible, synchronous passes.

### What the guarantee costs

This synchronization guarantee introduces specific architectural trade-offs that frequently appear in technical interviews. Because external store mutations enforce synchronous consistency, they cannot execute as interruptible Transitions. If an external store update causes a component to suspend, React displays the nearest Suspense fallback immediately. It cannot preserve existing UI content during the transition (Lesson 69). Consequently, the official React documentation advises against suspending on values read from `useSyncExternalStore`.

This consistency guarantee motivated state management libraries to adopt `useSyncExternalStore` in React 18. Third-party stores that read external state during render without this Hook risk exposing torn user interfaces under concurrent rendering.

---

## PRINCIPLE | getSnapshot: the same value while nothing changed, or React renders forever

> [!PRINCIPLE]
> **Principle 5: getSnapshot Returns the Same Value While Nothing Changed**
>
> *While the store has not changed, every call to `getSnapshot` must return the very same value.*
>
> React compares each snapshot with the last one using `Object.is`, and renders again when they differ. A `getSnapshot` that builds a new object on every call is always different from the last one, so React renders without end and stops with an error. Return the value itself, or return the last snapshot again until the store changes.
>
> **DO THIS:**
> ```js
> function getSnapshot() {
>   return ~navigator.onLine~; // The same true or false until the network changes
> }
> ```
>
> **DO NOT DO THIS:**
> ```js
> function getSnapshot() {
>   return ~{ isOnline: navigator.onLine }~; // **WRONG:** a new object every call, so React renders forever and stops with an error
> }
> ```

### A snapshot that looks harmless

Developers sometimes attempt to wrap primitive snapshot values inside an object to allow future extensibility. A developer might structure `getSnapshot` like this:

```js title="src/useOnlineStatus.js" startLine="3"
function getSnapshot() {
  return ~{ isOnline: navigator.onLine }~; // **WRONG:** a brand-new object on every call
}
```

While the returned object contains accurate data, the application crashes immediately upon mounting:

```page caption="The notes app when getSnapshot returns a new object on every call: the page is blank."
blank
```

```devconsole width=full caption="The Console when getSnapshot returns a new object on every call."
x The result of getSnapshot should be cached to avoid an infinite loop
x Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
! An error occurred in the <StatusBar> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

### Why a new object never matches

React evaluates store mutations by comparing the previous snapshot to the newly returned snapshot using `Object.is` (Lesson 32). When comparing objects, `Object.is` checks referential identity rather than structural equality:
1. React renders `StatusBar`, invokes `getSnapshot`, and receives a new object reference.
2. React invokes `getSnapshot` again to verify store stability, receiving another newly allocated object reference containing identical values.
3. Because the two references occupy distinct memory addresses, `Object.is` evaluates to `false`. React treats this difference as an external mutation and schedules an immediate re-render.
4. The subsequent render invokes `getSnapshot` again, allocating yet another object reference and triggering another re-render.
5. This continuous loop exceeds React's nested update limit, causing the runtime to crash with the `Maximum update depth exceeded` error.

Compare the two implementations side by side:

```js title="Returning the value itself, and returning a new object around it"
return ~navigator.onLine~; // true is always Object.is equal to true: React renders only when the network changes
return ~{ isOnline: navigator.onLine }~; // **WRONG:** a new object is never equal to the last one: React renders forever
```

Although both returns expose the identical boolean data, primitive booleans maintain value equality across calls. In contrast, object literals allocate fresh memory references on every invocation, preventing `Object.is` from recognizing unchanged state.

### The rule for every snapshot

The official React documentation establishes a strict invariant: if the external store has not mutated, repeated calls to `getSnapshot` must return referentially identical values. Furthermore, returned snapshots must remain immutable to prevent undetected background mutations.

This referential mismatch frequently surfaces when consuming third-party data stores. Writing `return { todos: myStore.todos };` triggers the identical infinite render loop. You can prevent this failure using two strategies:
1. **Return the underlying store reference directly.** If the store maintains immutable data structures, returning `myStore.todos` directly preserves referential stability until an update occurs.
2. **Cache and memoize the snapshot.** If the external store mutates data in place, cache the computed snapshot and return the cached reference until an actual data mutation occurs.

Because our network status is an immutable primitive boolean, the solution is straightforward: return `navigator.onLine` directly.

---

## PRINCIPLE | subscribe outside the Hook: React subscribes once, not after every letter

> [!PRINCIPLE]
> **Principle 6: Declare subscribe Outside the Hook**
>
> *Declare `subscribe` at the top level of the file, so React receives the same function on every render.*
>
> A function declared inside a component or a custom Hook is created again on every render. When React receives a different `subscribe`, it unsubscribes and subscribes again. On a page that renders on every letter the user types, that means removing and adding the listeners for every letter. When `subscribe` needs a prop, wrap it in `useCallback` instead.
>
> **DO THIS:**
> ```js
> function ~subscribe~(callback) { // Declared once, so React subscribes once
>   window.addEventListener('online', callback);
>   window.addEventListener('offline', callback);
>   return () => {
>     window.removeEventListener('online', callback);
>     window.removeEventListener('offline', callback);
>   };
> }
>
> export function useOnlineStatus() {
>   return useSyncExternalStore(subscribe, getSnapshot);
> }
> ```
>
> **DO NOT DO THIS:**
> ```js
> export function useOnlineStatus() {
>   function ~subscribe~(callback) { // **WRONG:** a new function every render, so React subscribes again after every letter
>     window.addEventListener('online', callback);
>     window.addEventListener('offline', callback);
>     return () => {
>       window.removeEventListener('online', callback);
>       window.removeEventListener('offline', callback);
>     };
>   }
>   return useSyncExternalStore(subscribe, getSnapshot);
> }
> ```

### Two places to write subscribe

You can place the `subscribe` function in two locations: at module scope outside the Hook, or inside the Hook body alongside the `useSyncExternalStore` call. Inlining the function inside the Hook body might seem cleaner by keeping related logic proximate. Adding a console log statement illustrates how React handles each approach.

Declaring `subscribe` outside the Hook creates a single, stable function reference:

```js title="src/useOnlineStatus.js, with subscribe declared outside the Hook"
function ~subscribe~(callback) { // Created once, when the file loads
  console.log('Subscribing to the network');
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
```

In contrast, declaring `subscribe` inside the Hook redefines the function on every render pass:

```js title="src/useOnlineStatus.js, with subscribe declared inside the Hook"
import { useSyncExternalStore } from 'react';

function getSnapshot() {
  return navigator.onLine;
}

export function useOnlineStatus() {
  function ~subscribe~(callback) { // **WRONG:** created again every time a component calls the Hook
    console.log('Subscribing to the network');
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }
  return useSyncExternalStore(subscribe, getSnapshot);
}
```

Both versions display accurate connectivity status initially. However, their underlying subscription lifecycles behave very differently under active component re-renders.

### Why the inside version subscribes again

A custom Hook executes as part of the component calling it (Lesson 39). Declaring `subscribe` inside the Hook allocates a new function instance on every render pass, mirroring the instability of nesting component declarations (Lesson 04).

During reconciliation, React checks the subscription argument against its previous reference using `Object.is`. If `useSyncExternalStore` receives a new function instance, React tears down the existing subscription by calling its cleanup function and registers the new subscription immediately.

In our notes application, this churn occurs continuously. The root component stores user input in state, re-rendering the entire component tree on every keystroke. Clearing the developer console and typing a single character reveals this thrashing:

```devconsole caption="The Console after the developer clears it and the user types one letter, when subscribe is declared inside useOnlineStatus."
+ Subscribing to the network | useOnlineStatus.js:9
+ Subscribing to the network | useOnlineStatus.js:9
```

**Typing a single character triggers two resubscription logs, one for `StatusBar` and one for `SaveButton`, despite no errors being thrown.** Every keystroke detaches and re-attaches native browser event listeners across all consumer components. The official React documentation warns against this pattern, noting that re-attaching listeners on every render degrades performance.

When you declare `subscribe` in module scope, React receives the identical function reference across every render cycle. As the official documentation states, React skips resubscription whenever the subscription function reference remains unchanged. The console remains completely quiet while the user types.

```tree caption="Where subscribe is declared decides whether React subscribes once or after every render."
Where `subscribe` is declared
- +Outside the Hook, at the top of the file | Created **once**, when the file loads | React **subscribes once** and keeps the listeners
- !Inside the Hook | Created **again on every render** | React **unsubscribes and subscribes again** after every letter the user types
```

### When subscribe needs a prop

When a subscription depends on component props or state, such as a `userId`, it cannot reside in static module scope. The official React documentation provides the standard remedy: memoize the subscription function using `useCallback`, declaring `userId` in its dependency array (Lesson 57). This ensures React receives a stable function reference across standard renders, resubscribing only when the tracked dependency actually mutates.

---

## All 6 Principles Together

### The complete project files

Here is the finished notes app. The network code lives once, in the Hook file. Both helper functions sit outside the Hook. The snapshot function returns a primitive boolean, and both components read the value through the Hook:

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
import { useState } from 'react';
import StatusBar from './StatusBar.jsx';
import SaveButton from './SaveButton.jsx';

export default function App() {
  const [note, setNote] = ~useState('Buy milk')~; // Principle 6: every letter renders App and both components again
  return (
    <>
      <StatusBar />
      <textarea value={note} onChange={e => setNote(e.target.value)} />
      <SaveButton />
    </>
  );
}
```

```jsx title="src/StatusBar.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';

export default function StatusBar() {
  const isOnline = ~useOnlineStatus()~; // Principle 1: a subscription, not a direct read of navigator.onLine
  return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
}
```

```jsx title="src/SaveButton.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';

export default function SaveButton() {
  const isOnline = ~useOnlineStatus()~; // Principle 4: always the same version of the store as StatusBar
  function handleSaveClick() {
    console.log('Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

```js title="src/useOnlineStatus.js"
import { useSyncExternalStore } from 'react';

function ~getSnapshot~() { // Principle 5: the same true or false until the network changes
  return navigator.onLine;
}

function ~subscribe~(callback) { // Principle 6: declared outside the Hook, so React subscribes once
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return ~useSyncExternalStore(subscribe, getSnapshot)~; // Principles 2 and 3: React subscribes and reads the value itself, with no copy in state
}
```

### How React renders the notes app

Upon initial page load, React executes the root component, initializing the note state container. React then evaluates the status bar, whose call to `useOnlineStatus` queries current network connectivity using `getSnapshot`. React next renders the save button, which queries the identical store snapshot. Finally, React registers each component subscription using `subscribe`, ensuring subsequent browser events update both components simultaneously.

```tree dir=right caption="The order in which React calls the components of the notes app, and where each one reads the network status."
How React renders the notes app
- +1. `App` [`note`] | React calls **`App`** first | It holds the **note text** and renders `<StatusBar />`, the `<textarea>`, and `<SaveButton />`
- +2. `StatusBar` [`useOnlineStatus`] | `useSyncExternalStore` calls **`getSnapshot`** | The heading reads **Online** or **Disconnected**
- +3. `SaveButton` [`useOnlineStatus`] | Reads **the same store** the same way | The button reads **Save progress** or **Reconnecting...**
```

```page caption="The finished notes app after the Wi-Fi drops: the heading and the button agree."
heading: Disconnected | good
form:
  textarea:  | Buy milk
  button: Reconnecting... | | disabled
console: quiet
```

| Topic | The Habit to Avoid | The React Rule |
| :--- | :--- | :--- |
| **Reading an outside value** | Read `navigator.onLine` directly during render, causing the status header to freeze after network changes | Subscribe with `useSyncExternalStore` so React receives external change notifications |
| **The two functions** | Expect React to detect external store updates automatically | Provide `subscribe` to register change listeners and `getSnapshot` to read store values |
| **The Effect version** | Synchronize external values into state with `useState` and `useEffect`, risking stale initial values | Read external stores directly using `useSyncExternalStore` within a reusable custom Hook |
| **Two components, one store** | Assume render cycles always execute uninterrupted without yields | Allow React to verify snapshot consistency before committing DOM changes, preventing tearing |
| **The snapshot** | Return a freshly allocated object literal from `getSnapshot` on every call | Return referentially stable values while the underlying store remains unchanged |
| **Where `subscribe` lives** | Declare `subscribe` inside the component or Hook body, recreating it on every render | Declare `subscribe` in module scope, or memoize it with `useCallback` when referencing props |

Remember the central rule of this lesson. **React cannot detect changes in external data sources automatically, requiring components to subscribe to updates and delegate snapshot reads directly to React.**

---

## For the Interview

> **The Interview Question:** How do you subscribe to a store that lives outside React?

### How to Answer Clearly in 30 Seconds

"An external store is any state container that exists outside React's fiber tree and mutates without triggering React state updates, such as `navigator.onLine` or an external state library. Because React only re-renders when internal state, props, or context update, you must subscribe to external stores using `useSyncExternalStore`. It accepts two primary functions:
1. **`subscribe`** receives React's internal update callback, registers it with the external store's change events, and returns an unsubscription cleanup function.
2. **`getSnapshot`** returns the current immutable store value, which React compares with the previous snapshot using `Object.is` to determine if a re-render is required.

To ensure stability, `getSnapshot` must return referentially stable values when data has not changed, avoiding infinite render loops. Additionally, `subscribe` should maintain a stable reference to avoid resubscribing on every render. For server-rendered applications, an optional `getServerSnapshot` argument provides the initial server state."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What does `useSyncExternalStore` guarantee during concurrent rendering?"**
   It guarantees visual consistency across all components on screen by eliminating UI tearing. In concurrent React, renders can yield to higher-priority work. If an external store mutates during this pause, different components could read inconsistent values. To prevent this, React re-invokes `getSnapshot` immediately before committing changes to the DOM. If the store mutated, React discards the interrupted render and restarts the update synchronously as a non-interruptible render. Consequently, store updates cannot be deferred as interruptible transitions, which is why React warns against suspending on values read from external stores.
2. **"Why not copy the value into state with `useState` and `useEffect`?"**
   Duplicating external state into `useState` creates synchronization hazards. The state duplicate must be seeded with an initial value. If an initial value is guessed, such as assuming the user is online, an offline client will display incorrect data because no subsequent event fires to correct it. While reading the browser property directly during initialization works in client browsers, it fails during server-side rendering. Furthermore, manual state duplication lacks React's concurrent consistency guarantees, making it susceptible to UI tearing.
3. **"When should you not use `useSyncExternalStore`?"**
   You should not use it when data lifecycle is fully managed within React components. The official React documentation advises using `useState` and `useReducer` for internal application state, restricting `useSyncExternalStore` to non-React data sources. In application development, engineers rarely write custom stores from scratch; instead, they interact with `useSyncExternalStore` through third-party state management libraries that implement the Hook internally.

```tree dir=right caption="Interview summary: how a component subscribes to a store outside React, and the two rules that keep it working."
Subscribing to a store outside React
- +Subscribe [`useSyncExternalStore`] | `subscribe` hands **React's `callback`** to the store; `getSnapshot` **reads the value** | React renders again only when **the value is different**
- +The guarantee | React **checks the store again** before changing the DOM | **Every component** shows the same version of the store
- !The two rules [`getSnapshot` `subscribe`] | ~Do **NOT** return a new object or declare `subscribe` inside | A new object **loops forever**; a new `subscribe` **subscribes again on every render**
```
