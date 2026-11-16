# Lecture 97: The Class Lifecycle Methods, and Why Three Were Renamed UNSAFE

*(How did a class component connect, reconnect, and disconnect at the right moment, and why are three of its methods called unsafe?)*

> INTERVIEW QUESTION | LEGACY | What were componentDidMount, componentDidUpdate, and componentWillUnmount, and why were some renamed UNSAFE?

---

## VS | Three Lifecycle Methods vs. One `useEffect`: the class splits one job by moment, the Effect writes it once

> Every component transitions through three distinct phases: mounting onto the screen, updating with new props or state, and unmounting from the page. **Before React introduced Hooks, a class component handled mounting through `componentDidMount` and teardown through `componentWillUnmount`**. Re-rendering with new props relied on a third method: `componentDidUpdate`. React executes each method at its designated phase. Three earlier methods executed during the render phase before DOM mutations were committed. React prefixed those older methods with `UNSAFE_` because abandoned render attempts can leave orphaned side effects.

In imperative JavaScript, your code directly controls when external resources start and stop. You open a network socket when an entry script executes, and attach a listener to terminate it on a button click. Your code explicitly controls every step in the sequence:

```js title="Plain JavaScript: you pick the moment"
const connection = createConnection('https://localhost:1234', 'general');
~connection.connect()~; // You connect right now, when the page loads
closeButton.addEventListener('click', () => ~connection.disconnect()~); // You disconnect on the click
```

In React, the declarative component model handles DOM insertions and removals for you. When a user clicks a button to open a chat, React mounts the component into the page. When the user closes the chat, React unmounts and removes its DOM nodes. Because application code does not manually append or remove nodes, the component must coordinate with React to trigger side effects when those DOM transitions occur.

In modern function components, you coordinate synchronization through `useEffect` (Lesson 35). Prior to Hooks, class components coordinated with React using built-in lifecycle methods. A developer declared methods with reserved names on the class prototype, and React invoked them automatically at predefined points in the component lifecycle:

```jsx title="A class component: you write the methods, React calls them"
class ChatRoom extends Component {
  ~componentDidMount()~ { // React calls it after the chat appears on the screen
    this.setupConnection();
  }
  ~componentWillUnmount()~ { // React calls it when it removes the chat
    this.destroyConnection();
  }
}
```

**Why:** In a class component, a single business objective like maintaining an active chat connection is fragmented across three separate lifecycle methods. These methods must coordinate perfectly. If any method is omitted or implemented incorrectly, the visual interface may appear functional while network leaks corrupt the application. Server connections multiply silently, or the client remains connected to a stale room after the user selects a new channel. Furthermore, side effects initiated in `UNSAFE_` methods can execute for discarded render passes, creating orphaned connections that cannot be cleaned up.

### The Three Moments and Their Three Methods

Here is the complete class component, defining dedicated lifecycle methods for each phase:

```jsx title="One class, one method for each moment"
class ChatRoom extends Component {
  ~componentDidMount()~ { // 1. After the chat appears: connect
    this.setupConnection();
  }
  ~componentDidUpdate(prevProps)~ { // 2. After the chat renders with a new room: reconnect
    if (this.props.roomId !== prevProps.roomId) {
      this.destroyConnection();
      this.setupConnection();
    }
  }
  ~componentWillUnmount()~ { // 3. When the chat closes: disconnect
    this.destroyConnection();
  }
}
```

> [!DEFINITION]
> **What is a lifecycle method?** [NEW] A lifecycle method is a reserved method on a React class component that the reconciler executes at a specific phase of the component's existence.
> 1. Mount: React creates the component instance, renders its elements, and commits its DOM nodes to the browser document.
> 2. Update: React re-renders the component in response to changing props or state, and commits updates to the DOM.
> 3. Unmount: React removes the component DOM nodes from the document and destroys the instance in memory.
>
> Application code declares methods like `componentDidMount`, but never calls them directly. React triggers each method automatically to notify the component of DOM additions, updates, or impending removals (Lesson 97).

```tree caption="The three moments in the life of ChatRoom, and the class method React calls at each one."
Three moments in the life of `ChatRoom`
- +1. Mount: the chat appears [`componentDidMount`] | The user clicks **Open chat** | React calls it **after** the heading is on the screen: **connect**
- +2. Update: the room changes [`componentDidUpdate`] | The user picks **travel** | React calls it **after** the new heading is on the screen: **reconnect**
- +3. Unmount: the chat closes [`componentWillUnmount`] | The user clicks **Close chat** | React calls it as it **removes** the chat: **disconnect**
```

### VS | `componentWillMount` vs. `componentDidMount`: before the commit, or after it

In legacy codebases, you will frequently find an older method named `componentWillMount` placed alongside these lifecycle hooks. Both methods might execute the identical connection logic:

```jsx title="The same connection line in two methods"
~componentWillMount()~ { this.setupConnection(); } // Runs before React puts the chat on the screen
~componentDidMount()~ { this.setupConnection(); } // Runs after the chat is on the screen
```

**It may look identical initially, but their execution phases differ fundamentally.** When a user opens the chat room, both methods run their connection routines successfully during an uninterrupted mount. The critical distinction lies in their execution phases during rendering and committing:

> [!DEFINITION]
> **Render and commit.** [REVIEW] React processes user interface updates through two distinct phases:
> 1. The render phase: React invokes your component and computes its JSX elements. The browser DOM remains unchanged during this calculation. React can pause, restart, or discard an in-progress render without affecting the screen.
> 2. The commit phase: React applies calculated mutations to the actual browser DOM. Once committed, the elements appear on screen.
>
> Side effects must run only after the commit phase. If a side effect initiates during the render phase, an abandoned render attempt will orphan external resources that never receive cleanup (Lesson 13).

- The method `componentWillMount` executes during the render phase, before React commits DOM nodes. At this stage, the component represents an unfinished attempt that React may discard entirely.
- The method `componentDidMount` executes strictly after the commit phase, guaranteeing that the component DOM nodes are active in the browser document.

This fundamental timing difference explains why React deprecated `componentWillMount` and two other pre-commit lifecycle methods by adding the `UNSAFE_` prefix.

### The Rule of Thumb: does React call it for a component that is really on the screen?

**Ask one question about every lifecycle method: does React call it only for a component that is really on the screen? If yes, it provides a safe location to initialize subscriptions, network requests, or DOM listeners. If it runs before the commit, React flagged it as `UNSAFE_`, and external side effects must stay out of it.**

Senior engineers stay vigilant regarding four common architectural misconceptions:
1. **Assuming `componentDidMount` handles all lifecycle synchronization.** Initializing a connection on mount only solves the opening moment. It ignores subsequent room changes and fails to close resources upon unmount.
2. **Assuming `componentDidUpdate` executes on the initial render.** React invokes this method exclusively after subsequent re-renders, never when the component first mounts.
3. **Assuming `UNSAFE_` implies immediate removal or newly added safety.** The prefix merely highlights inherent concurrency hazards. The underlying execution timing remains unchanged, and legacy applications continue running these methods in React 19.
4. **Translating class lifecycles by mechanical name mapping.** Replacing `componentDidMount` with an Effect using an empty dependency array causes stale closures that fail to synchronize when props change.

## SECTION | A Chat Room with Open, Switch, and Close

Picture a collaborative chat application. At the top of the page sits a selection menu offering rooms labeled general, travel, and music, followed by an action button. When the page first loads, the chat widget is closed:

```page width=full caption="The chat page when it opens: the room menu on general and the Open chat button, with the chat closed."
form:
  select: Choose the chat room: | general
  button: Open chat
console: quiet
```

The user performs three sequential actions:
1. The user clicks `Open chat`. The button label changes to `Close chat`, and a welcome heading displays for the general room.
2. The user selects `travel` from the dropdown. The welcome heading updates immediately to reflect the travel room.
3. The user clicks `Close chat`. The heading unmounts and disappears from the page.

That visual sequence represents the user experience. Behind the interface, the component must synchronize with an external chat server. Therefore, the implementation must guarantee three technical invariants:
1. When the chat appears on screen, establish a network connection to the designated room.
2. When the user selects a new room, terminate the existing connection and connect to the new room.
3. When the chat closes, terminate the active connection cleanly.

Here is the completed application immediately after clicking `Open chat`:

```page width=full caption="The same page after the user clicks Open chat, in development: the heading appears and the Console shows the connection."
form:
  select: Choose the chat room: | general
  button: Close chat
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
```

A single user click produces three log entries in the developer console. The application executes in development inside `<StrictMode>`, and Principle 2 explains why this extra connection cycle occurs.

The project structure contains four files in the source directory:

```files title="chat-room: File Explorer" caption="How the files of our chat page sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Holds `roomId` and `show` in state and renders `ChatRoom` while the chat is open
  chat.js | external system | Exports `createConnection`, which prints each connect and disconnect
  components/
    ChatRoom.jsx | class component | Exports the `ChatRoom` class as default
```

The chat utility simulates an external chat server. It mirrors the demonstration helper from the React documentation by logging connection transitions to the console instead of maintaining real web sockets:

```js title="src/chat.js"
export function ~createConnection~(serverUrl, roomId) { // Returns one connection object for one room
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

The parent `App` component is a standard function component identical to the container built in Lesson 35. Its implementation remains constant throughout this lesson:

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select value={roomId} onChange={e => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && ~<ChatRoom roomId={roomId} />~} {/* Mounts ChatRoom on Open chat, unmounts it on Close chat */}
    </>
  );
}
```

The conditional expression `{show && <ChatRoom roomId={roomId} />}` governs all three lifecycle transitions. When `show` toggles to true, React mounts `ChatRoom`. When `roomId` changes, React re-renders the component with updated props. When `show` toggles to false, React unmounts the component.

The `ChatRoom` component begins as an initial class declaration containing only a `render` method, following the syntax introduced in Lesson 96. It displays markup without initiating any network connections:

```jsx title="src/components/ChatRoom.jsx"
import { Component } from 'react';
import { createConnection } from '../chat.js';

const ~serverUrl~ = 'https://localhost:1234'; // One server for every room

export default class ChatRoom extends Component {
  render() {
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

When inheriting a legacy component containing deprecated lifecycle methods, engineering teams typically choose between three migration strategies:
1. **Automate method renaming with an official codemod.** A codemod performs automated source code transformations across entire projects. React provides the `rename-unsafe-lifecycles` codemod to prefix legacy methods automatically. This approach suppresses deprecation notices without altering runtime behavior or eliminating underlying concurrency risks.
2. **Migrate logic into safe lifecycle methods.** Side effects move into `componentDidMount` and `componentDidUpdate`. This strategy stabilizes class components that must remain classes due to project constraints.
3. **Refactor the class into a modern function component.** Rewriting the component with `useEffect` eliminates class boilerplate and unlocks modern React primitives (Lesson 96).

Each upcoming principle adds or refactors lifecycle logic inside `ChatRoom`, demonstrating the runtime consequences when methods are missing or misconfigured.

**PRINCIPLES:** A class component assigns each phase of its lifecycle to a dedicated method, which React calls at that exact moment. Six architectural principles guide this lifecycle model:
1. **Principle 1: `componentDidMount` Connects When the Chat Opens.** React executes this method once the component is committed to the DOM. It provides the required location for network connections, subscriptions, and data fetching, whereas `render` must remain strictly pure.
2. **Principle 2: `componentWillUnmount` Disconnects When the Chat Closes.** React executes this method immediately before removing the component from the DOM. It must clean up every resource created on mount, which Strict Mode verifies in development.
3. **Principle 3: `componentDidUpdate` Reconnects When the Room Changes.** React executes this method after every committed re-render, never on initial mount. The method inspects previous props and reconnects only when tracked values change.
4. **Principle 4: The Three "Will" Methods Run Before React Commits.** Pre-commit lifecycle methods execute during render passes that React can abort. React renamed these legacy methods with the prefix `UNSAFE_` to highlight their concurrency risk.
5. **Principle 5: `componentDidUpdate` Takes Over From `UNSAFE_componentWillReceiveProps`.** Side effects triggered by prop updates must wait until the new values are committed to the DOM.
6. **Principle 6: One `useEffect` Replaces the Three Lifecycle Methods.** A single Effect declaring a cleanup function and a dependency array accomplishes what previously required three separate lifecycle methods.

---

## PRINCIPLE | `componentDidMount`: React calls it once, after the component is on the screen

> [!PRINCIPLE]
> **Principle 1: `componentDidMount` Connects When the Chat Opens**
>
> *Connect, subscribe, or fetch in `componentDidMount`, which React calls after it adds the component to the screen. Never do it in `render`.*
>
> A class component must connect to something outside React at the moment it appears. React calls `componentDidMount` after the commit, once per mount, so the connection opens for a chat the user really sees. `render` runs on every render and must stay pure. And `componentDidMount` handles only the first moment: the close and the room switch need their own methods.
>
> **DO THIS:**
> ```jsx
> class ChatRoom extends Component {
>   ~componentDidMount()~ { // Connects once, after the chat is on the screen
>     this.setupConnection();
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> class ChatRoom extends Component {
>   render() {
>     ~createConnection(serverUrl, this.props.roomId).connect();~ // **WRONG:** a new connection on every render
>     return <h1>Welcome to the {this.props.roomId} room!</h1>;
>   }
> }
> ```

The initial phase of a component is mounting. When the user clicks `Open chat`, React renders the component and inserts its heading element into the DOM. The method name clearly reflects this timing: did mount. React executes this lifecycle hook only after committing the component to the browser document. The React documentation identifies the operations appropriate for this phase: setup of subscriptions, data fetching requests, and direct DOM measurements.

### Why not connect in `render`?

A developer unfamiliar with class component lifecycles might place the connection logic inside `render`, observing that `render` also executes when the chat opens:

**DO NOT DO THIS:**
```jsx title="src/components/ChatRoom.jsx" startLine="6" bad="8"
export default class ChatRoom extends Component {
  render() {
    ~createConnection(serverUrl, this.props.roomId).connect();~ // **WRONG:** connects again on every render
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

**It may look identical initially, but its runtime behavior is fundamentally defective.** On initial mount, both implementations establish a working connection. However, React executes `render` during every subsequent re-render pass. Every state change in a parent component or local update creates another active socket connection without closing existing ones.

The `render` method must remain a pure function of props and state, mirroring the strict purity demanded of modern function component bodies (Lesson 14). During development, Strict Mode intentionally invokes `render` twice to surface hidden side effects (Lesson 47). In contrast, `componentDidMount` executes strictly once per mount pass, immediately following the DOM commit.

### `ChatRoom` connects in `componentDidMount`

The `ChatRoom` class incorporates two dedicated methods. The standard lifecycle hook is `componentDidMount`, while `setupConnection` serves as an internal helper:

```jsx title="src/components/ChatRoom.jsx" startLine="6" good="7,8,9,11,12,13,14"
export default class ChatRoom extends Component {
  ~componentDidMount()~ { // React calls it after the heading is on the screen
    this.setupConnection();
  }

  setupConnection() {
    ~this.connection~ = createConnection(serverUrl, this.props.roomId); // Stored on the instance, for later
    this.connection.connect();
  }

  render() {
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

Why assign the connection to an instance field using `this.connection` rather than a local variable? A local variable declared inside a method terminates when the call frame exits. Attaching the connection reference to `this` allows future lifecycle methods to access and terminate that specific connection object. React maintains the same class instance continuously from initial mounting until eventual unmounting.

Application code never invokes `componentDidMount` directly. React invokes it automatically following this exact sequence when a user clicks `Open chat`:
1. The parent sets its display state to true and renders `<ChatRoom roomId="general" />`.
2. React allocates a new instance of the class and executes its `render` method.
3. React commits the heading element to the browser document.
4. React detects `componentDidMount` on the instance and executes it immediately.

### Two Connecting lines for one click

When the user clicks `Open chat`, the browser renders the welcome heading as expected. However, inspecting the developer console reveals two connection messages:

```page width=full caption="The page after Open chat, in development, with componentDidMount and no componentWillUnmount yet: two Connecting lines."
form:
  select: Choose the chat room: | general
  button: Close chat
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
```

This behavior is caused by Strict Mode across four sequential steps:
1. The root entry file mounts the application inside `<StrictMode>` during development.
2. In development, Strict Mode mounts the component, triggers an unmount, and immediately executes `componentDidMount` a second time.
3. Because our class lacks `componentWillUnmount`, the intermediate unmount step does nothing.
4. Consequently, the mount method runs twice, creating two concurrent connections without closing the initial socket.

In production builds, React executes `componentDidMount` once, displaying a single log entry. **Strict Mode is not creating a defect. It intentionally exposes a severe bug: our class opens an external connection and provides no mechanism to clean it up.**

This failure represents the most prevalent bug in class lifecycle management. Because the chat connects on first render, manual verification appears successful. However, when the user navigates away or closes the chat, the connection leaks indefinitely. The React documentation emphasizes that implementing `componentDidMount` almost always requires implementing companion lifecycle methods to prevent resource leaks.

---

## PRINCIPLE | `componentWillUnmount`: it closes what `componentDidMount` opened

> [!PRINCIPLE]
> **Principle 2: `componentWillUnmount` Disconnects When the Chat Closes**
>
> *Disconnect, unsubscribe, or cancel in `componentWillUnmount`, which React calls when it removes the component, so that it mirrors `componentDidMount`.*
>
> Removing a component from the DOM closes nothing outside React. A class that connects in `componentDidMount` and never disconnects leaves one more open connection after each close, while the page looks right. In development, Strict Mode calls mount, unmount, and mount again, so a missing or partial `componentWillUnmount` shows up at once in the Console.
>
> **DO THIS:**
> ```jsx
> class ChatRoom extends Component {
>   componentDidMount() {
>     this.setupConnection();
>   }
>   ~componentWillUnmount()~ { // Closes the same connection when the chat closes
>     this.destroyConnection();
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> class ChatRoom extends Component {
>   ~componentDidMount()~ { // **WRONG:** connects, and no method ever disconnects
>     this.setupConnection();
>   }
> }
> ```

The final phase of a component is unmounting. When the user clicks `Close chat`, React removes the component elements from the screen. The method name indicates this exact transition: will unmount. React executes this method immediately prior to detaching the component DOM nodes from the document. The React documentation notes that this method serves to cancel pending network requests, clear timers, and dismantle external subscriptions.

The documentation describes the relationship between mount and unmount methods using the concept of a mirror. Whatever external resource is allocated in `componentDidMount` must be symmetrically released inside `componentWillUnmount`.

```tree caption="componentDidMount and componentWillUnmount mirror each other: one opens the connection, the other closes the same connection."
The mirror pair in `ChatRoom`
- +Opens: `componentDidMount` [`setupConnection`] | Creates the connection and stores it on **`this.connection`** | Calls **`connect`**
- +Closes: `componentWillUnmount` [`destroyConnection`] | Reads the **same `this.connection`** | Calls **`disconnect`** and clears the field
```

### The heading disappears, and the connection stays open

**Without `componentWillUnmount`, the user interface appears normal while server connections accumulate indefinitely.** Consider the component from Principle 1, which defines only `componentDidMount`. Observe what occurs when a user repeatedly toggles the chat:
1. The user clicks `Open chat`. In development, two connection messages appear in the console.
2. The user clicks `Close chat`. The parent component unmounts `ChatRoom`, and the heading disappears from the DOM.
3. Because the class defines no unmount cleanup, no disconnect logic executes. The console shows no teardown message.
4. The user clicks `Open chat` once more. React instantiates a fresh component instance, and two additional connection messages appear.

```page width=full caption="The page after Open chat, Close chat, and Open chat again, in development, without componentWillUnmount: four Connecting lines and no Disconnected line."
form:
  select: Choose the chat room: | general
  button: Close chat
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
```

Removing an element from the DOM does not terminate background network activity. The external chat server retains every established socket. If a user navigates between views, orphaned connections accumulate continuously. Only declaring `componentWillUnmount` allows the component to close its active connection.

### `ChatRoom` disconnects in `componentWillUnmount`

The component adds `componentWillUnmount` alongside a teardown helper named `destroyConnection`:

```jsx title="src/components/ChatRoom.jsx" startLine="6" good="11,12,13,20,21,22,23"
export default class ChatRoom extends Component {
  componentDidMount() {
    this.setupConnection();
  }

  ~componentWillUnmount()~ { // React calls it when the user closes the chat
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(serverUrl, this.props.roomId);
    this.connection.connect();
  }

  destroyConnection() {
    ~this.connection.disconnect();~ // Closes the connection that setupConnection stored
    this.connection = null;
  }

  render() {
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

Both lifecycle methods access the identical connection reference stored on `this.connection` because React preserves the same component instance throughout its lifecycle.

### Connect, disconnect, connect: Strict Mode tests the pair

When the user clicks `Open chat` and subsequently clicks `Close chat`, each connection message is paired with a corresponding disconnection message:

```page width=full caption="The page after Open chat and then Close chat, in development, with both methods: every Connecting line has its Disconnected line."
form:
  select: Choose the chat room: | general
  button: Open chat
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
```

The initial three console messages occur on opening the chat. In development, Strict Mode invokes `componentDidMount`, triggers teardown, and mounts the instance again. This sequence verifies that cleanup logic reliably resets resources. When the user closes the chat, the final unmount executes, leaving zero lingering connections.

The initial connection cycle in development is not an error. It represents an intentional verification check. The React documentation notes that this cycle surfaces forgotten unmount hooks and unmasks asymmetric teardown logic.

Disabling Strict Mode merely conceals underlying resource leaks. In function components, `useEffect` cleanups serve this same unmount role (Lesson 32). In modern functions, cleanup callbacks also execute prior to every re-synchronization pass, as Principle 6 demonstrates.

---

## PRINCIPLE | `componentDidUpdate`: it runs after every re-render, so compare `prevProps` before you reconnect

> [!PRINCIPLE]
> **Principle 3: `componentDidUpdate` Reconnects When the Room Changes**
>
> *Handle in `componentDidUpdate` every change to the props or state that `componentDidMount` reads. React calls it after each re-render, never after the first one.*
>
> `componentDidMount` reads `this.props.roomId` once, so the connection stays on the first room unless another method replaces it. React calls `componentDidUpdate` with `prevProps` after it commits each re-render. Comparing `this.props.roomId` with `prevProps.roomId` reconnects on a real change and does nothing on any other re-render.
>
> **DO THIS:**
> ```jsx
> componentDidUpdate(prevProps) {
>   if (~this.props.roomId !== prevProps.roomId~) { // Reconnects only when the room changed
>     this.destroyConnection();
>     this.setupConnection();
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> componentDidUpdate() {
>   ~this.destroyConnection();~ // **WRONG:** reconnects after every re-render, even in the same room
>   this.setupConnection();
> }
> ```

The intermediate phase occurs between mounting and unmounting. While the chat remains open, the user can select an alternative room. The React documentation specifies that React invokes `componentDidUpdate` immediately after re-rendering with updated props or state. React never invokes this method during the initial mount.

React supplies two arguments to this lifecycle method:
- The argument `prevProps` contains the props object from the preceding render pass.
- The argument `prevState` provides the previous state snapshot. Our component manages no local state, so it leaves this argument unused.

### The heading follows the menu, and the connection does not

Consider a class that defines `componentDidMount` and `componentWillUnmount`, but omits the update method. The user opens the chat on general and selects travel:

```page width=full caption="The page after the user picks travel, without componentDidUpdate: the heading names travel, and the Console shows no new line."
form:
  select: Choose the chat room: | travel
  button: Close chat
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
```

**The heading displays travel while the network socket remains connected to general.** Although both elements reference `this.props.roomId`, only the rendered output reflects the update. The discrepancy occurs for a clear technical reason:
1. When the user selects travel, the parent component passes the new prop to `ChatRoom`.
2. React invokes `render`, producing a heading that says travel.
3. Because no update lifecycle method exists, the original connection created during mounting remains active.
4. When the user eventually closes the chat, `componentWillUnmount` terminates `this.connection`.
5. The console reports a disconnect from general, a room the user abandoned long ago.

The underlying rule is straightforward. The `render` method executes on every update pass, but `setupConnection` ran only once on mount. Only `componentDidUpdate` can re-synchronize external connections when props change.

This bug occurs frequently in legacy software. An engineer authors a component assuming a prop never changes. Later, a teammate makes that prop dynamic. The visual interface updates, creating the illusion of correctness while the underlying network layer remains out of sync.

### Where `prevProps` comes from

Application code does not construct `prevProps`. React tracks this snapshot internally:
1. React retains the committed props from the preceding render pass.
2. Following the commit of a new render, React calls `componentDidUpdate`, supplying those previous props.
3. At that moment, `this.props` already references the newly committed values, allowing direct comparison.

### `ChatRoom` reconnects in `componentDidUpdate`

The component introduces `componentDidUpdate`, completing all three core lifecycle methods:

```jsx title="src/components/ChatRoom.jsx" startLine="6" good="11,12,13,14,15,16"
export default class ChatRoom extends Component {
  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps) {
    if (~this.props.roomId !== prevProps.roomId~) { // Reconnects only when the room changed
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(serverUrl, this.props.roomId);
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

When the user selects travel, the console reflects the teardown of the old room followed by the initialization of the new room:

```page width=full caption="The page after the user picks travel, with componentDidUpdate: the Console leaves general and connects to travel."
form:
  select: Choose the chat room: | travel
  button: Close chat
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "travel" room at https://localhost:1234... | chat.js:4
```

The screen displays the identical heading with or without `componentDidUpdate`. The developer console reveals the critical correction: the final two entries disconnect from general and connect to travel.

### Why the `if` line matters

React executes `componentDidUpdate` after every re-render, not solely when the room prop changes. Suppose the parent component introduces a theme toggle. Toggling that setting re-renders the parent, which in turn re-renders `ChatRoom` with an unchanged `roomId`:
- With the conditional check, the method reconnects only when `roomId` actually changes. Toggling the theme leaves the active connection undisturbed.
- Without the conditional check, the method tears down and recreates the connection on every re-render. Toggling the theme drops and restarts the connection unnecessarily.

The React documentation warns that update logic must compare incoming values against previous values. Omitting this check creates performance degradation and risks infinite update loops if `this.setState` is executed unconditionally.

---

## PRINCIPLE | `UNSAFE_componentWillMount`: it runs before the commit, so a connection there can belong to a chat that never appears

> [!PRINCIPLE]
> **Principle 4: The Three "Will" Methods Run Before React Commits**
>
> *Keep side effects out of `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. They run before the commit, in a render React can throw away.*
>
> React can abandon a render, for example when a child suspends, and then build the component again from scratch. A connection opened in a method that runs before the commit can belong to an instance that never mounts, and no `componentWillUnmount` ever closes it. The prefix `UNSAFE_` changed only the name and marks the risk. The codemod renames the method. Moving the logic fixes it.
>
> **DO THIS:**
> ```jsx
> class ChatRoom extends Component {
>   ~componentDidMount()~ { // Connects only for the chat that reached the screen
>     this.setupConnection();
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> class ChatRoom extends Component {
>   ~UNSAFE_componentWillMount()~ { // **WRONG:** may connect for a render React throws away
>     this.setupConnection();
>   }
> }
> ```

Older codebases often place connection setup inside `UNSAFE_componentWillMount` rather than `componentDidMount`:

```jsx title="The connection in UNSAFE_componentWillMount and in componentDidMount"
~UNSAFE_componentWillMount()~ { this.setupConnection(); } // Runs right after the constructor, before the commit
~componentDidMount()~ { this.setupConnection(); } // Runs after the chat is on the screen
```

During an uninterrupted initial mount, both methods establish a working connection. The fundamental distinction lies in execution timing:
- The method `UNSAFE_componentWillMount` runs during the render phase immediately after the constructor, before React knows whether the component will reach the screen.
- The method `componentDidMount` runs strictly after React commits the component to the DOM.

### Why React can throw a render away

Since the introduction of concurrent rendering in React 18, render passes can pause, restart, or terminate before reaching the commit phase. React documentation explains that the reconciler may begin rendering, pause execution, or abandon an in-progress tree entirely (Lesson 66).

This scenario occurs frequently with Suspense (Lesson 69). If a child component suspends while awaiting asynchronous code, React pauses rendering and displays a fallback interface. React then discards the incomplete tree and attempts rendering again once resources resolve.

When an application initiates side effects inside `UNSAFE_componentWillMount`, discarded render attempts leak external resources:
1. A legacy component opens a network connection inside `UNSAFE_componentWillMount`. It resides inside a Suspense boundary alongside an asynchronous component (Lesson 70).
2. When the user opens the chat, React instantiates the component and calls `UNSAFE_componentWillMount`, opening a connection.
3. The sibling component suspends, prompting React to pause rendering and display a loading fallback.
4. React discards the in-progress tree, discarding the component instance and its connection reference.
5. React makes another render attempt while the fallback displays, invoking `UNSAFE_componentWillMount` a second time and opening a second connection.
6. Because these tentative instances never reached the commit phase, React never executes `componentWillUnmount`. Neither leaked connection is ever closed.
7. Once loading completes, React creates a final instance and connects a third time. The initial two connections remain orphaned on the server.

Moving the connection call to `componentDidMount` prevents this leak completely. The console remains quiet while the fallback displays, establishing a connection only when the component successfully commits to the screen.

### The three methods React renamed

Three class lifecycle methods execute prior to the commit phase. React prefixed each with `UNSAFE_`:
1. The method `componentWillMount` was renamed `UNSAFE_componentWillMount`. It executes immediately following the constructor.
2. The method `componentWillReceiveProps` was renamed `UNSAFE_componentWillReceiveProps`. It executes when incoming props change, before computing new elements.
3. The method `componentWillUpdate` was renamed `UNSAFE_componentWillUpdate`. It executes immediately before rendering with updated props or state.

In contrast, the three lifecycle methods analyzed in Principles 1 through 3 run at safe execution points. Both `componentDidMount` and `componentDidUpdate` execute after DOM commits. Although `componentWillUnmount` uses the prefix will, React invokes it only for components that have mounted, ensuring safe cleanup:

```tree caption="The three lifecycle methods that survive unchanged, and the three that React renamed with the prefix UNSAFE_."
Six class lifecycle methods
- +Survive unchanged [`componentDidMount` `componentDidUpdate` `componentWillUnmount`] | Run **after the commit**, or only for a component that **really mounted** | +**DO** put connections and subscriptions here
- !Renamed `UNSAFE_` [`UNSAFE_componentWillMount` `UNSAFE_componentWillReceiveProps` `UNSAFE_componentWillUpdate`] | Run **before the commit**, in a render React **can throw away** | ~Do **NOT** put side effects here
```

### What the rename changed, and what it did not

React introduced the `UNSAFE_` prefix in React 16.3 during March 2018. The legacy names are deprecated: React continues running them, issues console warnings, and intends to remove them in a future major release.

```jsx title="The old name and the new name"
~componentWillMount()~ { this.setupConnection(); } // The old name: deprecated, React warns about it
~UNSAFE_componentWillMount()~ { this.setupConnection(); } // The new name: the same method, the same moment
```

The underlying behavior is completely identical. The execution timing and method signature did not change. The prefix does not make the method safe; it serves as a visible warning highlighting concurrent rendering risks. These methods continue to execute in React 19.

This explains why running an automated codemod does not resolve lifecycle defects. Executing `rename-unsafe-lifecycles` suppresses legacy warnings, but connection setup still occurs before the commit. The true solution requires moving side effects into `componentDidMount`.

In development, Strict Mode continues flagging these renamed methods. Mounting an application inside `<StrictMode>` causes React to issue warning messages in the developer console whenever a component utilizes an unsafe lifecycle method.

### The legacy `ChatRoom` our team inherits

Consider the legacy implementation our engineering team inherits. It connects during mount preparation and reconnects during prop updates:

**DO NOT DO THIS:**
```jsx title="src/components/ChatRoom.jsx, the legacy file" startLine="6" bad="7,11"
export default class ChatRoom extends Component {
  ~UNSAFE_componentWillMount()~ { // **WRONG:** connects before React commits the chat
    this.setupConnection();
  }

  ~UNSAFE_componentWillReceiveProps(nextProps)~ { // **WRONG:** reconnects before React renders the new room
    if (nextProps.roomId !== this.props.roomId) {
      this.destroyConnection();
      this.connection = createConnection(serverUrl, nextProps.roomId);
      this.connection.connect();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(serverUrl, this.props.roomId);
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

In development, Strict Mode crashes this component on the initial room transition:
1. The user clicks `Open chat`. The component connects to general, and the console warns about unsafe lifecycle methods.
2. Strict Mode executes a simulated unmount and remount cycle. The unmount cleans up the connection and sets `this.connection` to null. Because the class lacks `componentDidMount`, the subsequent remount never reconnects. The chat remains disconnected while the heading displays general.
3. When the user selects travel, `UNSAFE_componentWillReceiveProps` calls `destroyConnection`, which attempts to call disconnect on null. The runtime crashes with a `TypeError`, producing a blank screen.

```page width=full caption="The legacy page after Open chat and a switch to travel, in development: the page goes blank."
blank
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
error: Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code.
error: Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code.
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
error: Uncaught TypeError: Cannot read properties of null (reading 'disconnect')
warn: An error occurred in the <ChatRoom> component.
error: Uncaught TypeError: Cannot read properties of null (reading 'disconnect')
warn: An error occurred in the <ChatRoom> component.
```

In production builds, the absence of Strict Mode remount cycles masks this crash, allowing the buggy component to run without throwing errors. Strict Mode did not cause the failure. It revealed that the class fails to recover from an unmount and remount sequence.

The remedy moves the connection logic into `componentDidMount`:

**DO THIS:**
```jsx title="The first fix in src/components/ChatRoom.jsx"
~componentDidMount()~ { // Takes the place of UNSAFE_componentWillMount: connects after the chat is on the screen
  this.setupConnection();
}
```

If a legacy component used `UNSAFE_componentWillMount` solely to initialize state, that logic moves to the class constructor or a state property initializer (Lesson 96).

There is another critical reason to avoid connections in pre-commit methods. The React documentation notes that `UNSAFE_componentWillMount` is the only lifecycle method that executes during server rendering. Opening a connection there leaks resources on the server because React never calls `componentWillUnmount` during server-side renders.

---

## PRINCIPLE | `componentDidUpdate` instead of `UNSAFE_componentWillReceiveProps`: a side effect waits for the props on the screen

> [!PRINCIPLE]
> **Principle 5: `componentDidUpdate` Takes Over From `UNSAFE_componentWillReceiveProps`**
>
> *Move a side effect on a prop change from `UNSAFE_componentWillReceiveProps` to `componentDidUpdate`, and compare `this.props` with `prevProps`.*
>
> `UNSAFE_componentWillReceiveProps` reacts to props React has not rendered yet, and that render may be thrown away. `componentDidUpdate` runs after the commit, so it reacts only to props that are on the screen. State that only follows a prop needs no lifecycle method at all: read the prop in `render`, reset the component with a `key`, or adjust the state during render.
>
> **DO THIS:**
> ```jsx
> componentDidUpdate(prevProps) {
>   if (~this.props.roomId !== prevProps.roomId~) { // Reacts to the room already on the screen
>     this.destroyConnection();
>     this.setupConnection();
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> UNSAFE_componentWillReceiveProps(nextProps) {
>   if (~nextProps.roomId !== this.props.roomId~) { // **WRONG:** reconnects before React commits the new room
>     this.destroyConnection();
>     this.connection = createConnection(serverUrl, nextProps.roomId);
>     this.connection.connect();
>   }
> }
> ```

Our legacy component also reconnects inside a second unsafe lifecycle method. Compare this implementation against the update method established in Principle 3:

```jsx title="Reconnecting in UNSAFE_componentWillReceiveProps"
UNSAFE_componentWillReceiveProps(~nextProps~) { // Runs before React renders with the new props
  if (nextProps.roomId !== this.props.roomId) {
    this.destroyConnection();
    this.connection = createConnection(serverUrl, nextProps.roomId);
    this.connection.connect();
  }
}
```

```jsx title="Reconnecting in componentDidUpdate"
componentDidUpdate(~prevProps~) { // Runs after React commits the new props
  if (this.props.roomId !== prevProps.roomId) {
    this.destroyConnection();
    this.setupConnection();
  }
}
```

**Both patterns appear to achieve the same result initially, but their reliability differs fundamentally.** During a normal room transition, both methods log a disconnect from general followed by a connection to travel. The critical distinction lies in which props each method evaluates:
- The method `UNSAFE_componentWillReceiveProps` receives `nextProps`, representing props the component is scheduled to receive. React has not rendered those props yet, and the associated render attempt might be discarded. Because the current props object still reflects old values, the check compares `nextProps` against `this.props`.
- The method `componentDidUpdate` receives `prevProps` following the commit phase. The updated props already reside on `this.props`. Consequently, the comparison flips: `this.props` is checked against `prevProps`.

The React documentation explains that pending props might differ from committed values by the time a render finishes. This is why triggering side effects in pre-commit methods remains unsafe. Teardown and reconnect routines must execute only for committed updates inside `componentDidUpdate`.

If an update render is abandoned mid-flight, a legacy method has already terminated one socket and opened another for interface state the user never sees.

The conditional check remains essential here as well. React invokes prop lifecycle hooks whenever a parent re-renders, even when incoming prop values are identical.

### One replacement for each `UNSAFE_` method

Executing side effects represents only one use case for older lifecycle hooks. The React documentation outlines modern alternatives for each pattern:

| Legacy method | What it did | Where it goes today |
| :--- | :--- | :--- |
| **`UNSAFE_componentWillMount`** | Set up state | The constructor, or a `state` class field |
| **`UNSAFE_componentWillMount`** | Ran a side effect or a subscription | `componentDidMount` |
| **`UNSAFE_componentWillReceiveProps`** | Ran a side effect when a prop changed | `componentDidUpdate` |
| **`UNSAFE_componentWillReceiveProps`** | Re-computed data when a prop changed | A memoization helper, which keeps the last result and computes again only when the prop changes |
| **`UNSAFE_componentWillReceiveProps`** | Reset state when a prop changed | A fully controlled component, or a `key` that resets the component (Lesson 25) |
| **`UNSAFE_componentWillReceiveProps`** | Adjusted some state when a prop changed | Computing it from props during render, or `static getDerivedStateFromProps` (Lesson 80) |
| **`UNSAFE_componentWillUpdate`** | Ran a side effect before an update | `componentDidUpdate` |
| **`UNSAFE_componentWillUpdate`** | Read the DOM before an update, such as a scroll position | `getSnapshotBeforeUpdate` |

The final two rows provide capabilities exclusive to class components. The React documentation notes that function components offer no direct equivalent for `UNSAFE_componentWillUpdate` or `getSnapshotBeforeUpdate`.

### A copied prop moved to the wrong place

Many legacy class components relied on `UNSAFE_componentWillReceiveProps` to copy incoming props into local state. In this anti-pattern, the component stores a redundant copy in `this.state.room`:

```jsx title="A prop copied into state, in a legacy class"
state = { room: this.props.roomId };

UNSAFE_componentWillReceiveProps(nextProps) {
  ~this.setState({ room: nextProps.roomId });~ // Copies the new prop into state before React renders
}

render() {
  return <h1>Welcome to the {this.state.room} room!</h1>;
}
```

During a migration, a developer might move this state assignment into `componentDidUpdate`:

**DO NOT DO THIS:**
```jsx title="The same copy moved to componentDidUpdate"
componentDidUpdate(prevProps) {
  if (this.props.roomId !== prevProps.roomId) {
    ~this.setState({ room: this.props.roomId });~ // **WRONG:** a second render after every room switch
  }
}
```

This migration triggers an unnecessary second render pass on every prop change. React renders once with the previous state, commits, calls `componentDidUpdate`, triggers `setState`, and re-renders a second time. The React documentation cautions that setting state inside update methods introduces performance bottlenecks.

Copying props into state is unnecessary because props are accessible directly. The class should read `this.props.roomId` directly inside `render`, eliminating duplicate state:

**DO THIS:**
```jsx title="Reading the prop directly in render"
render() {
  return <h1>Welcome to the {~this.props.roomId~} room!</h1>; // One render, always the current room
}
```

### No `UNSAFE_` method left

Applying Principles 4 and 5 transforms the legacy component into the resilient class established in Principle 3:
1. The connection routine in `UNSAFE_componentWillMount` moves into `componentDidMount`.
2. The reconnection routine moves into `componentDidUpdate`, comparing current props with previous props.
3. The teardown routine in `componentWillUnmount` remains unchanged.

```tree dir=right caption="How the legacy ChatRoom loses its UNSAFE_ methods: each side effect moves to a method that runs after the commit."
Moving the legacy `ChatRoom` off its `UNSAFE_` methods
- !Before: the legacy class [`UNSAFE_componentWillMount` `UNSAFE_componentWillReceiveProps`] | Connects and reconnects **before the commit** | In development, Strict Mode **warns** and the room switch **crashes**
- +After: the class of Principle 3 [`componentDidMount` `componentDidUpdate` `componentWillUnmount`] | Connects and reconnects **after the commit** | **No `UNSAFE_` method** left
```

---

## PRINCIPLE | One `useEffect` with `[roomId]`: setup, cleanup, and dependency do the work of the three methods

> [!PRINCIPLE]
> **Principle 6: One `useEffect` Replaces the Three Lifecycle Methods**
>
> *Translate `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` into one Effect whose setup connects, whose cleanup disconnects, and whose dependencies list every value the setup reads.*
>
> The setup runs after the mount and after each change of a dependency. The cleanup runs before each new setup and at the unmount. The dependency `roomId` replaces the `prevProps` check. An empty array, written by matching the class method names, keeps the mount and loses the update. Unrelated jobs that shared one class method go into separate Effects.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[roomId]~); // Reconnects whenever the user picks another room
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[]~); // **WRONG:** connects once and ignores every room switch
> ```

Review the function component implementation of this chat connection from Lesson 35:

```jsx title="The chat connection as one Effect"
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, ~[roomId]~); // Runs the cleanup and the setup again when roomId changes
```

The class architecture in Principle 3 requires three lifecycle methods and two helper routines. The modern function component achieves the identical outcome in five lines. The user interaction and console outputs remain identical across both patterns.

The React documentation emphasizes that this single Effect declaration is equivalent to the combined lifecycle methods of the class component.

The two paradigms approach component synchronization from fundamentally different perspectives:
- Class components organize code around lifecycle events, asking what logic runs on mount, update, or unmount.
- Effects organize code around continuous synchronization, defining how to start synchronizing and how to stop.

The React documentation explains that Effects follow a synchronization lifecycle separate from the component lifecycle. Components mount, update, and unmount. In contrast, an Effect simply synchronizes with an external system and cleans up when dependencies change.

### Each piece of the class, in the Effect

Each separate responsibility from the class component maps into a specific part of the Effect:
1. The mount routine `componentDidMount` becomes the main body of the Effect setup function.
2. The teardown routine `componentWillUnmount` becomes the cleanup function returned by the Effect.
3. The prop comparison in `componentDidUpdate` becomes the `roomId` value in the dependency array. When that value changes, React executes the previous cleanup and runs the setup again.
4. The instance field `this.connection` becomes a local variable captured by closure inside the Effect. No instance reference is required.

```tree caption="How each piece of the ChatRoom class lands in one place of the Effect."
The class `ChatRoom` as one Effect
- +Setup [`componentDidMount` `setupConnection`] | Runs **after the mount** and **after each room change** | Creates `connection` and calls **`connect`**
- +Cleanup [`componentWillUnmount` `destroyConnection`] | Runs **before each new setup** and **at unmount** | Calls **`disconnect`** on its own `connection`
- +Dependency `roomId` [`componentDidUpdate` `prevProps.roomId`] | React **compares** `roomId` with the last render | Runs the cleanup and the setup **only when it changed**
```

The Effect architecture eliminates manual `prevProps` comparisons because each cleanup closure preserves the specific connection created during its own render cycle:
1. Each render pass evaluates its own independent props and state (Lesson 15).
2. When `roomId` changes, React executes the cleanup function of the preceding Effect, closing the connection for general.
3. React then executes the new Effect setup, establishing a connection for travel.

The React documentation suggests two checks before migrating. First, verify that unmounting cleans up resources created on mount. Next, verify that update logic handles all prop changes.

### An empty array loses the room switch

A common migration error occurs when developers translate class methods mechanically. An engineer replaces `componentDidMount` with an Effect using an empty dependency array, relying on its cleanup for unmount while omitting update logic:

**DO NOT DO THIS:**
```jsx title="The Effect with an empty array"
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, ~[]~); // **WRONG:** never reconnects when the user picks another room
```

**While the initial mount works, the update synchronization is broken.** The chat connects to general initially, but an Effect with empty dependencies never re-runs when props change. When the user switches to travel, the heading updates while the console shows no reconnection:

```page width=full caption="The page after the user picks travel, with an empty dependency array: the heading names travel, and the Console shows no new line."
form:
  select: Choose the chat room: | travel
  button: Close chat
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
```

This reproduces the defect from Principle 3 in a function component. The React linter flags `roomId` as a missing dependency (Lesson 37). Adding `[roomId]` to the dependency array resolves the issue.

### `ChatRoom` as a function

The `ChatRoom` file becomes a modern function component containing a single Effect:

```jsx title="src/components/ChatRoom.jsx, the function" good="7,8,9,10,11"
import { useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const ~connection~ = createConnection(serverUrl, roomId); // A local variable, no this
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // Does the job of the prevProps check
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

The user opens the chat, switches to travel, and closes the chat. In development, the console output matches the class component:

```page width=full caption="The page after Open chat, a switch to travel, and Close chat, in development: the same Console lines for the class and for the Effect."
form:
  select: Choose the chat room: | travel
  button: Open chat
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "travel" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "travel" room at https://localhost:1234 | chat.js:7
```

Strict Mode verifies both implementations symmetrically in development. For a class, it runs an extra unmount and mount. For an Effect, it runs an extra cleanup and setup (Lesson 32).

### One method with two jobs becomes two Effects

Class components frequently combine unrelated concerns inside a single lifecycle method because a class provides only one `componentDidMount`. For example, suppose a legacy class also logs visit analytics:

```jsx title="Two jobs in one componentDidMount"
componentDidMount() {
  ~logVisit(this.props.roomId);~ // Job 1: record the visit
  this.setupConnection(); // Job 2: connect to the room
}
```

Migrating both operations into a single Effect creates unintended bugs when dependencies change. If an Effect re-runs due to a connection dependency update, it re-executes the logging operation unexpectedly.

The solution requires separating distinct concerns into independent Effects. Logging an analytics visit and maintaining a socket connection are distinct synchronization tasks. Function components allow developers to declare multiple focused Effects, each managing its own setup and cleanup cycle.

---

## All 6 Principles Together

### The complete files

The external chat helper and the parent component remain consistent throughout:

```js title="src/chat.js"
export function ~createConnection~(serverUrl, roomId) { // Stands in for the chat server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select value={roomId} onChange={e => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && ~<ChatRoom roomId={roomId} />~} {/* Mounts and unmounts ChatRoom */}
    </>
  );
}
```

Here is the completed class component incorporating all safe lifecycle methods:

```jsx title="src/components/ChatRoom.jsx, the class"
import { Component } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';

export default class ChatRoom extends Component {
  ~componentDidMount()~ { // Principles 1 and 4: connects after the chat appears
    this.setupConnection();
  }

  ~componentDidUpdate(prevProps)~ { // Principles 3 and 5: reconnects after a committed room change
    if (this.props.roomId !== prevProps.roomId) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  ~componentWillUnmount()~ { // Principle 2: mirrors componentDidMount
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(serverUrl, this.props.roomId);
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

Here is the modern equivalent authored as a function component:

```jsx title="src/components/ChatRoom.jsx, the function"
import { useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId }) {
  ~useEffect~(() => { // Principle 6: one Effect does the job of all three methods
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

### When React calls each lifecycle method

User interactions trigger render and commit cycles. React executes lifecycle methods only after the commit phase or during final unmounting:

```tree dir=right caption="What React calls in the ChatRoom class after each user action, in production."
The three user actions, and what React calls in `ChatRoom`
- +1. The user clicks Open chat [`componentDidMount`] | React creates the instance and calls **`render`** | React **commits** the heading | React calls **`componentDidMount`**: Connecting to general
- +2. The user picks travel [`componentDidUpdate`] | React calls **`render`** with the new props | React **commits** the new heading | React calls **`componentDidUpdate`**: Disconnected from general, Connecting to travel
- +3. The user clicks Close chat [`componentWillUnmount`] | React removes `ChatRoom` from the screen | React calls **`componentWillUnmount`**: Disconnected from travel
```

In development, the initial action triggers an additional unmount and remount under Strict Mode, producing extra console entries.

| Moment | The class | The Effect | What the Console shows |
| :--- | :--- | :--- | :--- |
| **Mount: the user clicks Open chat** | `componentDidMount` calls `setupConnection` | The setup runs | Connecting to `general` |
| **Update: the user picks travel** | `componentDidUpdate` compares `prevProps.roomId`, then disconnects and connects | The cleanup for `general` runs, then the setup for `travel` | Disconnected from `general`, then Connecting to `travel` |
| **Unmount: the user clicks Close chat** | `componentWillUnmount` calls `destroyConnection` | The cleanup runs | Disconnected from `travel` |
| **Before the commit** | `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, `UNSAFE_componentWillUpdate`: no side effects | No equivalent: the setup never runs before the commit | Nothing |

Remember the central thesis of this lesson:
**A class component coordinates mounting and unmounting through `componentDidMount` and `componentWillUnmount`. Updates execute inside `componentDidUpdate`. Pre-commit lifecycle methods were prefixed with `UNSAFE_` because discarded render attempts leak uncleaned resources.**

---

## For the Interview

> **The Interview Question:** What were componentDidMount, componentDidUpdate, and componentWillUnmount, and why were some renamed UNSAFE?

### How to Answer Clearly in 30 Seconds

"They are the core lifecycle methods of a React class component. React invokes each method at a specific phase in a component's lifecycle.
1. **`componentDidMount`** executes after the component is committed to the DOM. It is the designated location to initialize subscriptions, network requests, or DOM measurements.
2. **`componentDidUpdate`** receives `prevProps` and `prevState`, executing after every re-render committed with new props or state. It compares incoming values against previous values to perform conditional updates.
3. **`componentWillUnmount`** executes immediately before the component is detached from the DOM. It must symmetrically release resources allocated during mount. Strict Mode tests this balance in development.

These methods must coordinate because a single synchronization task is split across all three. React renamed `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate` with the prefix `UNSAFE_` because they run during the render phase before DOM commits. Under concurrent rendering, React can abort an in-progress render, meaning side effects in those methods run for trees that never reach the screen. Today, a single `useEffect` declaring setup, cleanup, and dependencies replaces all three methods."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does the `UNSAFE_` prefix change how the method works, and does the codemod fix the problem?"**
   No. The underlying execution timing and behavior remain identical. React introduced the prefix in version 16.3 to flag concurrent rendering hazards. The methods remain deprecated but continue to run in React 19. Running the official codemod only renames method declarations; it does not resolve the underlying concurrency defect. The true solution requires moving side effects into `componentDidMount` or `componentDidUpdate`. Initial state setup belongs in the constructor or a class field.

2. **"Is `componentDidMount` the same as `useEffect` with an empty array?"**
   Only for the initial mount pass. Both execute after elements commit to the screen. However, a class typically reads dynamic props during mount and relies on `componentDidUpdate` to follow prop changes. Mapping `componentDidMount` to an Effect with an empty array drops update handling entirely. This causes stale data when props update. The accurate translation is a single Effect whose dependency array includes every reactive value read by the setup. In rare cases requiring DOM measurements before paint, `useLayoutEffect` provides the equivalent timing (Lesson 49).

3. **"Why does a class component connect twice when the page opens in development?"**
   This occurs because the application renders inside `<StrictMode>`. In development, Strict Mode mounts the instance, executes an immediate unmount, and remounts it. With proper cleanup in `componentWillUnmount`, the console displays connect, disconnect, and connect, leaving one active connection. Without proper cleanup, duplicate connections accumulate. Strict Mode intentionally surfaces this failure in development so leaks do not compromise production. In production builds, React mounts the component once.
