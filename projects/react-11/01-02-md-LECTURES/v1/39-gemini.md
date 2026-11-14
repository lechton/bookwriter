# Lecture 39: Reusing Logic Between Components with Custom Hooks

*(How can two components use the same state and Effect without copying the code?)*

> INTERVIEW QUESTION | ❱ CORE | How do you extract and reuse stateful logic between components?

---

## VS | Copied Code vs. a Custom Hook `useOnlineStatus`: the Hook keeps one copy of the code, and each component still gets its own value

> Multiple components often require identical stateful logic, such as subscribing to network status, while maintaining independent data. **Extract that shared logic into a custom Hook.** Both components then share the exact same code, while each component instance retains its own isolated state.

In standard JavaScript, when multiple routines require identical logic, developers extract those lines into a reusable function. In React applications, components frequently share logic that requires state and Effects. For example, two separate widgets might both track network status, window resize events, or page scroll positions. Duplicating `useState` and `useEffect` calls across components creates maintenance problems. **A custom Hook is a function that encapsulates stateful logic so multiple components can reuse it while maintaining isolated state.**

Consider an application with a status bar that displays a connection indicator and a save button that disables itself when offline. Both components must monitor the network connection using the same browser APIs. If both components call the same custom Hook, do they share a single state value? They do not. Each call to `useOnlineStatus` initializes an independent `useState` cell and registers a separate Effect.

**Why this matters:** Duplicating code across components creates synchronization risks because a bug fix applied to one component is easily omitted in the other. A custom Hook consolidates that logic into a single definition. React grants each calling component its own isolated state, exactly as if the component declared those Hooks directly.

### One Function for the Same Lines

Here is that standard JavaScript refactoring pattern: identical statements moved into a single function and invoked from multiple locations.

```js title="The same lines, moved into one function, in plain JavaScript"
function formatPrice(amount) {
  return '$' + amount.toFixed(2);
}

~formatPrice(9)~; // '$9.00', from the one copy of the code
~formatPrice(25)~; // '$25.00', from the same copy
```

A custom Hook follows this exact design pattern. It is a standard JavaScript function with one distinct property: it calls other React Hooks, such as `useState` or `useEffect`. To signal this capability to React and developer tools, its identifier always begins with `use`.

> [!DEFINITION]
> **What is a custom Hook?** [REVIEW] A custom Hook is a user-defined JavaScript function that encapsulates reusable stateful logic by calling built-in React Hooks.
> 1. A function qualifies as a custom Hook when its identifier starts with `use` followed by a capital letter, and it calls other Hooks internally.
> 2. The `use` naming prefix enables React linting tools to enforce the Rules of Hooks on that function.
> 3. A function that does not call any React Hooks should remain a standard utility function without the `use` prefix, such as `getSorted` (Lesson 38).

Every function invocation in JavaScript creates a brand new execution context with its own local variables. Consider two calls to a cart factory function:

```js title="Two calls of one function, two separate arrays, in plain JavaScript"
function createCart() {
  const items = [];
  return items;
}

const cartA = ~createCart()~; // A new array
const cartB = ~createCart()~; // Another new array
cartA.push('Socks');
console.log(cartB); // [], because cartB is a different array
```

Each call creates a distinct array in memory. Modifying `cartA` leaves `cartB` completely unaffected because each call produces an isolated reference.

Custom Hooks operate on this identical principle. When two components call the same custom Hook, React executes the internal `useState` and `useEffect` calls separately for each component instance. Each component allocates its own state slot in React internal fiber tree. This establishes a fundamental rule: **a custom Hook shares stateful logic, never state itself.**

If two components must synchronize and read the exact same state value, a custom Hook is the wrong tool. That shared state must be lifted into their common parent component and passed down as props (Lesson 24).

### The Rule of Thumb: the same code, or the same value?

**Ask one central architectural question: do the components need to share the same logic, or the same state value? Shared logic belongs in a custom Hook. Shared state data belongs in a common ancestor component.**

A senior developer guards against three classic architectural mistakes:
1. **Duplicating stateful logic across multiple components.** A bug fix applied to one copy leaves the other copy outdated, creating inconsistent interface behavior.
2. **Assuming multiple invocations of a Hook share state.** Calling a custom Hook in two components creates two separate state instances, preventing direct state communication between them.
3. **Creating unnecessary or timing-based Hooks.** Wrapping a single `useState` call adds unnecessary indirection without reusing logic. Creating lifecycle-named wrappers like `useMount` obscures dependency arrays and disables linter safety checks.

The following sections demonstrate each pattern using a resilient notes application.

## SECTION | A Notes App That Follows the Network

Our demonstration application is a notes editor that saves user work to a remote server. The interface contains a status heading and a save button.

```page width=text caption="The notes app while the network is on: the heading says Online, and the button takes clicks."
heading: Online
form:
  button: Save progress
```

When network connectivity drops, the application interface changes immediately:
1. The heading displays `Disconnected`.
2. The button disables itself, displays `Reconnecting...`, and rejects user clicks.

```page width=text caption="The same notes app right after the Wi-Fi drops: the heading says Disconnected, and the grey button takes no clicks."
heading: Disconnected
form:
  button: Reconnecting... | | disabled
```

When the network connection restores, the heading switches back to `Online`, and the button re-enables itself with the label `Save progress`.

How does the client application detect network changes? The browser provides native network status APIs. In standard JavaScript, you track connectivity like this:

```js title="What the browser tells us about the network, in plain JavaScript"
window.addEventListener(~'offline'~, () => console.log('Network off')); // The browser calls this when the network goes off
window.addEventListener(~'online'~, () => console.log('Network on')); // The browser calls this when the network comes back
console.log(~navigator.onLine~); // true or false, right now
```

The browser window emits `offline` and `online` events whenever connection availability transitions. In addition, the boolean property `navigator.onLine` reveals the immediate connection state.

In React components, subscribing to browser window events is an external integration that belongs inside an Effect.

> [!DEFINITION]
> **What is an Effect?** [REVIEW] An Effect is a side effect that executes after React commits component updates to the screen. You declare an Effect using the `useEffect` Hook.
> 1. An Effect synchronizes a component with systems outside React, such as browser APIs, timers, or network sockets. Here, it attaches listeners to `window`.
> 2. The cleanup function returned by `useEffect` runs before the component unmounts or before the Effect re-runs, removing event listeners to prevent memory leaks.
> 3. In development mode, React StrictMode mounts, unmounts, and remounts each component to verify that cleanup routines function properly (Lesson 32).

The status bar heading and the save button represent distinct UI components with completely different visual responsibilities. Yet both depend on identical external data: the active network state. Both components require the exact same synchronization logic: a local state variable and an event-listening Effect.

Here is the file structure of the completed application:

```files title="notes-app: File Explorer" caption="The files of the finished notes app inside src/: two components, the App that renders them, and the custom Hook they both call."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<StatusBar />` and `<SaveButton />`
  StatusBar.jsx | component | Exports `StatusBar` as default and renders the `Online` or `Disconnected` heading
  SaveButton.jsx | component | Exports `SaveButton` as default and renders the `Save progress` button
  useOnlineStatus.js | custom Hook | Exports `useOnlineStatus` by name and returns `isOnline`
```

Notice that the custom Hook file uses the `.js` file extension rather than `.jsx`. It computes and returns pure JavaScript data rather than JSX markup.

**Core Architectural Principles:** A custom Hook shares stateful logic rather than state values. This core doctrine establishes three practical principles:
1. **Principle 1: Extract Repeated Logic into a Custom Hook.** Consolidating state and Effects into `useOnlineStatus` guarantees that bug fixes apply everywhere instantly.
2. **Principle 2: Every Hook Call Generates Independent State.** Each component instance allocates distinct state slots and registers its own Effect lifecycle.
3. **Principle 3: Share Singleton Values Through Ancestor Components.** Shared mutable application state belongs in a common parent, rather than inside a custom Hook.

---

## PRINCIPLE | `useOnlineStatus`: the network code lives once, so one fix reaches both components

> [!PRINCIPLE]
> **Principle 1: Extracting a Custom Hook: Move the Copied State and Effect into One use Function**
>
> *When two components copy the same state variable and Effect, move that code into one function named use plus a capital letter, return the value the components need, and call that function from each component.*
>
> Copied code drifts apart: a fix goes into one copy, and the other component keeps showing an old answer. A custom Hook holds the code once. Its code runs as part of each component that calls it, so the page works exactly as before. The last line of the Hook hands the value back. Without it, every component receives undefined.
>
> **DO THIS:**
> ```jsx
> function StatusBar() {
>   const isOnline = ~useOnlineStatus()~; // The network code lives once, in useOnlineStatus.js
>   return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
> }
> function SaveButton() {
>   const isOnline = ~useOnlineStatus()~; // The same Hook, so a fix inside it reaches both components
>   return <button disabled={!isOnline}>Save progress</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function StatusBar() {
>   const [isOnline, setIsOnline] = ~useState(navigator.onLine)~; // **WRONG:** a copy of the network state, fixed in this copy only
>   return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
> }
> function SaveButton() {
>   const [isOnline, setIsOnline] = ~useState(true)~; // **WRONG:** the second copy still assumes the network is on
>   return <button disabled={!isOnline}>Save progress</button>;
> }
> ```

Imagine for a moment that React provided a built-in `useOnlineStatus` Hook. Each component would express its network requirement in a single concise line:

```jsx title="StatusBar and SaveButton, if React had a useOnlineStatus Hook"
function StatusBar() {
  const isOnline = ~useOnlineStatus()~; // true while the network is on, false while it is off
  return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = ~useOnlineStatus()~; // The same question, asked by a second component
  return <button disabled={!isOnline}>{isOnline ? 'Save progress' : 'Reconnecting...'}</button>;
}
```

React does not ship with this specific Hook built-in. Because a custom Hook is simply a JavaScript function, we can construct it ourselves. Before creating the Hook, examine the duplicate implementation we begin with.

### The two copies we start with

Here is the status bar heading component, maintaining its own private state variable and network Effect:

```jsx title="src/StatusBar.jsx"
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = ~useState(true)~; // Assumes the network is on when the page opens
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener(~'online'~, handleOnline); // The browser calls handleOnline when the network comes back
    window.addEventListener(~'offline'~, handleOffline); // The browser calls handleOffline when the network goes off
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
}
```

The save button requires identical awareness of the network. A developer copies the exact same state and Effect lines into the button component:

```jsx title="src/SaveButton.jsx"
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = ~useState(true)~; // The same line, copied from StatusBar
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

Both components render and function as expected initially. Every line of logic from `useState` through the Effect cleanup now exists in duplicate across two files.

### A fix in one copy splits the page

Both initial implementations configure state with `useState(true)`. Both components naively assume the user is connected to the internet when the page loads. If a user opens the application while already offline, this hardcoded default displays incorrect information.

The fix requires querying the browser directly. The property `navigator.onLine` accurately evaluates to `false` when offline. A developer patches this logic in the heading file, but neglects to update the button file:

```jsx title="The starting value in each copy, after the fix went into StatusBar only"
const [isOnline, setIsOnline] = useState(~navigator.onLine~); // StatusBar.jsx: asks the browser, so false for an offline user
const [isOnline, setIsOnline] = useState(~true~); // SaveButton.jsx: still assumes the network is on
```

A user now visits the application while offline:

```page width=text caption="A user opens the app while offline, after the fix went into the heading only: the heading says Disconnected, and the button still offers to save."
heading: Disconnected
form:
  button: Save progress | | bad
console: quiet
```

**The user interface now presents conflicting states for the same physical condition, and the browser console remains completely quiet.** The status heading indicates `Disconnected`. Right beside it, the button indicates `Save progress` and accepts clicks.

This silent divergence reveals the primary danger of copied code. Duplicate implementations work during initial development, but desynchronize as soon as a maintenance fix updates only one copy.

### Moving the copies into useOnlineStatus

The solution is to extract the duplicated logic into a custom Hook. Extracting logic means isolating repeated statements into a single reusable function. This process requires three steps:
1. Create a file named `useOnlineStatus.js`, and export a function named `useOnlineStatus`.
2. Move the state variable and the Effect into that function, initializing state with `navigator.onLine`.
3. Conclude the function with `return isOnline;`, exposing the reactive value to caller components.

```js title="src/useOnlineStatus.js"
import { useState, useEffect } from 'react';

export function ~useOnlineStatus~() { // Our own function: use plus a capital letter, and it calls Hooks
  const [isOnline, setIsOnline] = useState(~navigator.onLine~); // The fix, written once for both components
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
  ~return isOnline;~ // Hands the value back to whichever component called the Hook
}
```

The final `return` statement determines what calling components receive. A custom Hook can return any JavaScript value, such as a boolean, a tuple array, or a configuration object. Because our components only need connection status, the Hook returns the boolean `isOnline`.

Both components now shrink to their core presentation responsibilities:

```jsx title="src/StatusBar.jsx"
import { ~useOnlineStatus~ } from './useOnlineStatus.js'; // A named export, so the name goes inside curly braces

export default function StatusBar() {
  const isOnline = ~useOnlineStatus()~; // Holds whatever useOnlineStatus returned: true or false
  return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
}
```

```jsx title="src/SaveButton.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';

export default function SaveButton() {
  const isOnline = ~useOnlineStatus()~; // The same call, in a second component
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

Two important implementation details deserve attention:
- **The variable identifier `isOnline` in each component** represents a local constant. It matches the Hook internal variable name only by convention. A component could rename it to `connected` without issue.
- **The React imports `useState` and `useEffect` are gone** from both component files. Only the Hook file imports them now, because only the Hook invokes React primitives.

### The page works exactly as before

Extracting logic into a custom Hook does not alter component execution at runtime. Calling `useOnlineStatus` inside `StatusBar` produces the exact same execution sequence as inlining the code directly.

When React renders `StatusBar`, execution proceeds through these concrete steps:
1. React executes the `StatusBar` component function.
2. `StatusBar` calls `useOnlineStatus`.
3. The custom Hook executes `useState` and registers `useEffect`.

Those React primitives run during the render cycle of `StatusBar`, in the exact same order. From the perspective of React, the execution sequence remains unchanged. The browser screen updates identically.

What fundamentally changes is code readability and maintainability. The component now declares *what* data it requires: the online status. The custom Hook encapsulates *how* to acquire and synchronize that data using browser APIs. The official React documentation highlights this architectural benefit: custom Hooks let your component code describe intent rather than low-level implementation details.

```tree dir=right caption="The same page before and after extracting useOnlineStatus: the lines move into one function, and every component calls it."
Moving the network code out of both components
- !Before: copied into each component [`useState` `useEffect` in StatusBar.jsx and SaveButton.jsx] | The same lines live in **two files** | A fix in one file **splits the page in two**
- +After: extracted into one custom Hook [`useOnlineStatus`] | The lines live **once**, in `useOnlineStatus.js` | Each component **calls the Hook** and reads `isOnline`; the page works **exactly as before**
```

### Forgetting return isOnline

Forgetting the final `return` statement is a frequent mistake because internal Hook logic functions without it. Compare the two implementations:

```js title="src/useOnlineStatus.js, ending with return isOnline" startLine="18"
  }, []);
  ~return isOnline;~ // StatusBar receives true while the network is on
}
```

```js title="src/useOnlineStatus.js, ending without return" startLine="18"
  ~}, []);~ // **WRONG:** the function ends after the Effect, so StatusBar receives undefined
}
```

In standard JavaScript, a function without an explicit `return` statement evaluates to `undefined`. Without a return value, calling components receive `undefined`, causing both components to render as if offline:
- The heading evaluates `undefined` as falsy, rendering the label `Disconnected`.
- The button evaluates the negated value as `true`, disabling the button and displaying `Reconnecting...`.

```page width=text caption="The notes app while the network is on, when useOnlineStatus has no return line: both components behave as if the network were off."
heading: Disconnected
form:
  button: Reconnecting... | | disabled
console: quiet
```

The custom Hook continues to listen to network events, and its internal state updates correctly. Calling components never receive those updates because the Hook fails to expose its state. The browser console produces no warnings.

Always verify that custom Hooks end with an explicit `return` statement exposing the computed state values.

---

## PRINCIPLE | `useOnlineStatus` in two components: each one gets its own `isOnline` and its own Effect

> [!PRINCIPLE]
> **Principle 2: Independent Calls: Each Call to a Custom Hook Gets Its Own State and Its Own Effect**
>
> *Every call to a custom Hook runs the Hooks inside it again, so two components that call useOnlineStatus hold two separate isOnline values and run two separate Effects.*
>
> A custom Hook shares the code that makes state, not the state itself. When two components call the same Hook, each one gets its own state variable, its own setter, and its own Effect. The heading and the button change at the same moment only because both listen to the same browser events. The Console shows the Effect's setup once for each component.
>
> **DO THIS:**
> ```jsx
> function StatusBar() {
>   const isOnline = ~useOnlineStatus()~; // StatusBar's own isOnline, kept up to date by the browser's events
>   return <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function SaveButton() {
>   const isOnline = ~useOnlineStatus()~; // **WRONG:** read as the isOnline of StatusBar; it is a second state, with its own Effect
>   return <button disabled={!isOnline}>Save progress</button>;
> }
> ```

When network connectivity drops, the status heading and the save button update at the exact same instant. Because their visual updates occur simultaneously, developers often assume both components share a single underlying state variable. In reality, each component holds completely separate state.

Recall the `createCart` utility function from earlier. Two function calls produce two completely independent arrays in memory. Custom Hooks behave in this exact manner:

```jsx title="What the two calls to useOnlineStatus really run"
function StatusBar() {
  const isOnline = ~useOnlineStatus()~; // Runs useState and useEffect for StatusBar
}

function SaveButton() {
  const isOnline = ~useOnlineStatus()~; // Runs useState and useEffect again, this time for SaveButton
}
```

Compare the components that invoke `useOnlineStatus` with the earlier components that duplicated code directly. Their runtime execution models are identical. Both versions allocate two distinct state slots and register two separate Effects. Extracting logic into a custom Hook eliminates duplicated source code, but it does not consolidate state instances.

> [!DEFINITION]
> **What is stateful logic?** [NEW] Stateful logic is the programmatic mechanism that defines and coordinates state across render cycles. In our application, this logic consists of the `useState` declaration and the event-listening `useEffect` routine.
> 1. Stateful logic describes how state initializes, changes, and synchronizes with outside systems.
> 2. The state itself is the actual data value preserved in React memory for a specific component instance on screen.
> 3. Custom Hooks share stateful logic across components, but each Hook invocation allocates independent state memory (Lesson 39).

### Counting the Effects in the Console

The browser console provides direct visual proof that two separate Effects run. Insert a log statement inside the setup callback of the Effect:

```js title="src/useOnlineStatus.js" startLine="3"
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    ~console.log('Listening to the network');~ // Prints once each time React runs this setup
    function handleOnline() {
```

Load the application in development mode:

```devconsole caption="The Console in development after the page opens: the setup line of useOnlineStatus appears four times."
+ Listening to the network | useOnlineStatus.js:6
+ Listening to the network | useOnlineStatus.js:6
+ Listening to the network | useOnlineStatus.js:6
+ Listening to the network | useOnlineStatus.js:6
```

Four log messages appear in the console. Here is the concrete technical explanation:
1. React renders `StatusBar`. Its invocation of `useOnlineStatus` allocates state and registers an Effect for `StatusBar`.
2. React renders `SaveButton`. Its invocation of `useOnlineStatus` allocates a separate state slot and registers an Effect for `SaveButton`.
3. React commits the DOM and executes setup routines for both Effects. That accounts for two log entries. In a production build, logging halts here.
4. In development mode, React StrictMode unmounts and remounts components to verify cleanup reliability (Lesson 32). Running two Effects twice produces four total messages.

If both components shared a single Effect, the console would log only once in production and twice under development StrictMode.

### When the network goes off

A single native browser event notifies two separate Effects, causing both components to update concurrently:
1. The browser fires an `offline` event on `window`.
2. Two independent event listeners receive the event, one registered by each Effect. The browser executes both `handleOffline` callbacks.
3. The heading callback invokes the state setter for `StatusBar`. The button callback invokes the state setter for `SaveButton`.
4. React schedules re-renders for both components. The heading renders `Disconnected`, and the button renders `Reconnecting...`.

Notice that the save button file never explicitly imports or calls `setIsOnline`. The setter function originates from the `useState` call executed while React renders `SaveButton`. The event listener attaches to the window during that same component lifecycle.

```tree caption="One browser event, two calls to useOnlineStatus: each component holds its own isOnline and its own Effect, and both follow the same browser."
The browser fires `offline` on `window`
- +StatusBar calls `useOnlineStatus` | Its **own** `isOnline` and its **own** Effect | Its `handleOffline` sets **its own** state, and the heading says **Disconnected**
- +SaveButton calls `useOnlineStatus` | Its **own** `isOnline` and its **own** Effect | Its `handleOffline` sets **its own** state, and the button says **Reconnecting...**
```

No internal state channel connects the two components. Their values remain synchronized solely because both components subscribe to identical external browser events.

You can now remove the diagnostic logging statement from the Hook file.

Always remember: a custom Hook shares stateful logic, never state values.

---

## PRINCIPLE | `isSaved` in `App`: two components read one value, passed down as props

> [!PRINCIPLE]
> **Principle 3: Sharing the Value Itself: Lift the State into the Parent, Not into a Custom Hook**
>
> *When two components must show one value that changes, such as whether the work was saved, put that state in their closest common parent and pass it down as props.*
>
> A custom Hook gives every component that calls it a separate copy of its state. That is right for isOnline, because the browser keeps every copy in step. It is wrong for isSaved: the button changes its own copy, and the heading keeps reading the other one, with no error and no warning. The parent owns one value, passes it down, and hands the button a function that changes it.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   const [isSaved, setIsSaved] = useState(false);
>   return (
>     <>
>       <StatusBar ~isSaved={isSaved}~ /> {/* Both components read the one isSaved of App */}
>       <SaveButton onSave={() => setIsSaved(true)} />
>     </>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function StatusBar() {
>   const [isSaved] = ~useSaveStatus()~; // **WRONG:** a separate isSaved that the click in SaveButton never changes
>   return isSaved && <p>All changes saved</p>;
> }
> ```

Consider adding a new user requirement: when a user clicks `Save progress`, the status area beneath the heading must display a confirmation message reading `All changes saved`.

The confirmation label renders inside the status heading component. The save click handler executes inside the button component. Both components must reflect a single shared question: has user progress been saved?

A developer who observed `useOnlineStatus` synchronize both components might attempt to solve this by creating another custom Hook:

```js title="src/useSaveStatus.js"
import { useState } from 'react';

export function ~useSaveStatus~() { // A custom Hook that holds one state variable
  const [isSaved, setIsSaved] = useState(false);
  return [isSaved, setIsSaved];
}
```

The status bar imports the Hook and reads its state value:

```jsx title="src/StatusBar.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';
import { useSaveStatus } from './useSaveStatus.js';

export default function StatusBar() {
  const isOnline = useOnlineStatus();
  const [isSaved] = ~useSaveStatus()~; // StatusBar reads isSaved from its own call
  return (
    <>
      <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>
      {isSaved && <p>All changes saved</p>}
    </>
  );
}
```

The save button also calls the Hook and invokes the returned setter on click:

```jsx title="src/SaveButton.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';
import { useSaveStatus } from './useSaveStatus.js';

export default function SaveButton() {
  const isOnline = useOnlineStatus();
  const [isSaved, setIsSaved] = ~useSaveStatus()~; // SaveButton gets the setter from its own call
  function handleSaveClick() {
    console.log('Progress saved');
    setIsSaved(true);
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

This structure mimics `useOnlineStatus` by calling a shared Hook from two components. Yet it fails completely. The two `isOnline` values stayed in step because an external system, the browser, broadcast events to both listeners. The `isSaved` states have no external event source to synchronize them.

### Why All changes saved never appears

When a user clicks the button, the application fails to display the confirmation message on screen. Here is the exact execution breakdown:
1. During initial mounting, each component invokes `useSaveStatus`, receiving an independent saved status initialized to `false`.
2. The status component inspects its local `isSaved` variable. Because the boolean evaluates to `false`, no confirmation renders.
3. The user clicks `Save progress`. The click handler logs a message and invokes the setter belonging to `SaveButton`.
4. React re-renders `SaveButton`. The button local state transitions to `true`.
5. No routine ever invoked the setter belonging to `StatusBar`. The heading local state remains `false`, giving React no reason to re-render it.
6. The expected confirmation message never renders on screen.

```page width=text caption="The notes app after the user clicks Save progress, when each component calls useSaveStatus: the Console says the progress was saved, and the page shows no confirmation."
heading: Online
form:
  button: Save progress
console:
  log: Progress saved | SaveButton.jsx:8
```

Recall the cart analogy: adding an item to `cartA` never modifies `cartB`. Similarly, updating state inside `SaveButton` cannot alter independent state inside `StatusBar`. The browser console displays no error.

### Moving isSaved into App

When multiple components must consume and mutate a single source of truth, that state cannot reside in a custom Hook. It must be lifted into their common ancestor component.

> [!DEFINITION]
> **What is lifting state up?** [REVIEW] Lifting state up is the established React pattern of relocating shared state to the closest common parent of the components that require it.
> 1. You remove isolated state declarations from individual child components.
> 2. You declare a single state variable in their closest common parent component.
> 3. The parent provides the state value downward through props, while passing updater functions to children that must trigger modifications (Lesson 24).

The official React documentation states this rule plainly: to share state between multiple components, lift it up to their closest common parent.

We delete the file `useSaveStatus.js`. The parent component `App` now manages the single authoritative `isSaved` state:

```jsx title="src/App.jsx"
import { useState } from 'react';
import StatusBar from './StatusBar.jsx';
import SaveButton from './SaveButton.jsx';

export default function App() {
  const [isSaved, setIsSaved] = ~useState(false)~; // One isSaved, owned by the parent of both components
  return (
    <>
      <StatusBar ~isSaved={isSaved}~ /> {/* The heading reads the value as a prop */}
      <SaveButton ~onSave={() => setIsSaved(true)}~ /> {/* The button gets a function that changes the value in App */}
    </>
  );
}
```

The status heading receives `isSaved` as a prop. The button receives `onSave`, a callback provided by `App` (Lesson 23). Both child components retain their call to `useOnlineStatus` because each component requires its own network subscription:

```jsx title="src/StatusBar.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';

export default function StatusBar(~{ isSaved }~) { // The one isSaved of App, passed down as a prop
  const isOnline = useOnlineStatus();
  return (
    <>
      <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>
      {isSaved && <p>All changes saved</p>}
    </>
  );
}
```

```jsx title="src/SaveButton.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';

export default function SaveButton(~{ onSave }~) { // A function from App that sets the isSaved of App
  const isOnline = useOnlineStatus();
  return (
    <button disabled={!isOnline} onClick={onSave}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

The button component passes `onSave` directly to its `onClick` prop, executing the parent updater when clicked.

### VS | `useSaveStatus` in Each Component vs. `isSaved` in App: the Hook gives two values, the parent gives one

Here is the resulting interface behavior after the user clicks save:

::: row caption="The notes app right after the user clicks Save progress: with useSaveStatus in each component, and with isSaved in App."
::: col title="useSaveStatus in each component" tag="two separate isSaved values" tone=bad
```page size=mini
heading: Online
form:
  button: Save progress
console:
  log: Progress saved | SaveButton.jsx:8
```
The button set its own `isSaved`. The heading still reads `false`, so no line appears.
:::
::: col title="isSaved in App, passed down" tag="one isSaved for both" tone=good
```page size=mini
heading: Online
line: All changes saved | good
form:
  button: Save progress
```
The click changed the one `isSaved` of `App`. React renders `App` again, and the heading receives `true`.
:::
:::

The Elements inspector reveals the confirmation element inserted directly beneath the heading:

```dom caption="The Elements panel after the click, when isSaved lives in App: StatusBar renders a new paragraph under the heading."
<div id="root">
  <h1>Online</h1>
+ <p>All changes saved</p> | note: Rendered by StatusBar from the isSaved prop
  <button>Save progress</button>
</div>
```

When interacting components are deeply nested within the component hierarchy, passing props through intermediate layers can become verbose. In those architectures, React Context distributes shared state downward without intermediate prop drilling (Lesson 28). The architectural rule remains unchanged: a single provider component owns the state value, and consumer components read that value.

```tree caption="What a custom Hook shares and what a parent shares: the code that makes state, or one value for several components."
Two ways to reuse something between components
- +A custom Hook [`useOnlineStatus`] | Shares the **code** that makes state | Each component gets **its own value**; fits `isOnline`, which the browser keeps in step
- !A custom Hook for a shared value [`useSaveStatus`] | Gives each component **its own `isSaved`** | A click in the button **never reaches** the heading
- +State in the parent, passed down [`isSaved` in `App`] | Shares **one value** | Both components read the **same `isSaved`**, so the heading confirms the save
```

Remember the rule of thumb: shared stateful logic belongs in a custom Hook, while shared state data belongs in an ancestor component.

---

## All 3 Principles Together

### The complete files

Here is the completed notes application. Network synchronization logic lives once in the custom Hook, while the single `isSaved` state resides in `App`:

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
  const [isSaved, setIsSaved] = ~useState(false)~; // Principle 3: one shared value lives in the parent
  return (
    <>
      <StatusBar isSaved={isSaved} />
      <SaveButton onSave={() => setIsSaved(true)} />
    </>
  );
}
```

```jsx title="src/StatusBar.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';

export default function StatusBar({ isSaved }) {
  const isOnline = ~useOnlineStatus()~; // Principle 2: StatusBar's own isOnline and its own Effect
  return (
    <>
      <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>
      {isSaved && <p>All changes saved</p>}
    </>
  );
}
```

```jsx title="src/SaveButton.jsx"
import { useOnlineStatus } from './useOnlineStatus.js';

export default function SaveButton({ onSave }) {
  const isOnline = ~useOnlineStatus()~; // Principle 2: a second, separate isOnline
  return (
    <button disabled={!isOnline} onClick={onSave}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

```js title="src/useOnlineStatus.js"
import { useState, useEffect } from 'react';

export function ~useOnlineStatus~() { // Principle 1: the copied state and Effect, written once
  const [isOnline, setIsOnline] = useState(navigator.onLine);
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
  ~return isOnline;~ // Principle 1: the value each component reads
}
```

### How React renders the notes app

When the page loads, React evaluates `App` first, creating the single `isSaved` state slot. React then evaluates `StatusBar`, whose call to the Hook allocates the first connection state. Finally, React evaluates `SaveButton`, whose call allocates the second independent connection state:

```tree dir=right caption="The order in which React calls the components of the notes app, and the state each call creates."
How React renders the notes app
- +1. `App` [`isSaved`] | React calls **`App`** first | It owns the **one `isSaved`** and renders `<StatusBar />` and `<SaveButton />`
- +2. `StatusBar` [`useOnlineStatus`] | Receives `isSaved` as a **prop** | Its call creates the **first** `isOnline` and the **first** Effect
- +3. `SaveButton` [`useOnlineStatus`] | Receives `onSave` as a **prop** | Its call creates the **second** `isOnline` and the **second** Effect
```

```page width=text caption="The finished notes app after the user clicks Save progress while the network is on."
heading: Online
line: All changes saved | good
form:
  button: Save progress
console: quiet
```

| What you want | The habit to avoid | The React rule |
| :--- | :--- | :--- |
| **Reuse stateful code** | Copy the same `useState` and `useEffect` into a second component, then fix only one copy | Extract one custom Hook, such as `useOnlineStatus`, and call it from each component |
| **Get a value out of the Hook** | Forget `return isOnline;`, so every component receives `undefined` | End the Hook with `return` and the value the components need |
| **Understand two calls of one Hook** | Believe both components read one shared `isOnline` | Each call creates its own state and its own Effect; the browser keeps them in step |
| **Show one value in two components** | Put `isSaved` in a custom Hook and call it in both components | Lift `isSaved` into `App` and pass it down as props |

One concluding summary captures the essence of this lesson: **a custom Hook shares stateful logic, never state data.**

---

## For the Interview

> **The Interview Question:** How do you extract and reuse stateful logic between components?

### How to Answer Clearly in 30 Seconds

"When two or more components share identical stateful behavior, such as synchronizing with browser network status or window dimensions, I extract that logic into a custom Hook. A custom Hook is a JavaScript function whose name starts with `use` followed by an uppercase letter, and it composes built-in React Hooks like `useState` and `useEffect`. Calling components invoke the Hook and receive reactive values, keeping UI code focused on presentation while encapsulating side effects.

Two crucial principles govern custom Hooks:
1. **Hooks share logic, not state:** every invocation runs independent Hook calls, allocating private state storage for each component instance.
2. **To share mutable state data,** I lift the state up to the closest common parent and distribute it through props or React Context."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"If two components call the same custom Hook, do they share its state?"**
   **No.** Every call to a custom Hook is completely isolated. When `StatusBar` and `SaveButton` both call `useOnlineStatus`, each component receives its own independent state cell, setter, and Effect subscription. They reflect identical values only because both subscribe to the same external window events. An internal state variable declared inside a custom Hook cannot pass data between components. To synchronize state between two components, that state must be lifted into their common parent.
2. **"Should every piece of repeated code become a custom Hook?"**
   **No.** You should only create a custom Hook when logic involves React state or Effects. A function wrapping a single `useState` call adds indirection without architectural value. Custom Hooks provide the greatest value when encapsulating complex side effects, such as browser subscriptions, timers, or web socket connections. Always name custom Hooks after their functional purpose, such as `useOnlineStatus`, rather than lifecycle timing, such as `useMount`. Wrapper Hooks named after timing obscure dependencies and degrade ESLint verification. Functions without Hook calls should remain regular utilities without the `use` prefix, such as `getSorted` (Lesson 38).
3. **"Why wrap an Effect in a custom Hook even when it already works inside the component?"**
   Because extracting the Effect separates component intent from concrete implementation. The component declares what data it needs, while the custom Hook manages how that data is subscribed to and updated. This abstraction decouples components from underlying APIs. If you later optimize the subscription using `useSyncExternalStore` (Lesson 53), consumer components require zero code modifications. In addition, custom Hooks re-execute on every component render, so they must remain pure while continuously receiving fresh props and state (Lesson 14).

```tree dir=right caption="Interview summary: what a custom Hook shares between components, and what it does not."
What a custom Hook shares between components
- +The code that makes state [`useState` `useEffect` inside `useOnlineStatus`] | Written **once**, called from **every component** | Each fix happens **in one place**
- !Not the state itself [`isOnline` in StatusBar and SaveButton] | Every call creates its **own value** and its **own Effect** | To share **one value**, lift it into the **parent** and pass it down
```
