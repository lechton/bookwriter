# Lecture 35: The Lifecycle of an Effect as Its Dependencies Change

*(What happens to an Effect when a prop changes, but the component stays on the page?)*

> INTERVIEW QUESTION | ❱ CORE | What is the lifecycle of a reactive effect as its dependencies change?

---

## VS | A Component's Lifecycle vs. an Effect's Lifecycle: the component mounts once, the Effect starts and stops for every room

> Web applications often keep a view mounted while displayed data changes, such as picking a new room, browsing another city, or selecting another product variant. **You must declare every reactive value read by an Effect in its dependency array and provide a cleanup function that reverses setup work**. React then stops the previous Effect and starts a new one for the incoming data.

How does an Effect behave when a component remains visible while its data changes? In React, a component often stays mounted on screen during user navigation. A user might switch channels in a chat box, select different cities on an interactive map, or toggle product sizes on a checkout page. Many developers mistakenly imagine that an Effect runs only twice: once when the component appears, and once when it disappears. However, an Effect possesses its own independent lifecycle. Whenever any value listed in its dependency array changes, React stops the previous Effect and starts a new one with the updated values.

Consider a chat application with three distinct rooms: general, travel, and music. While the user reads a room, the client application maintains an open socket connection to the server for that room. Suppose the user finishes reading general and selects music from the dropdown menu at the top. The chat container never unmounts from the screen. What mechanism terminates the general connection and opens the music connection if the component never leaves the page? React executes a clear sequence of steps:

> User selects music → handler calls `setRoomId('music')` → component re-renders → React detects changed room → cleanup disconnects general → setup connects music

**Why:** If an Effect only ran when a component initially appeared, switching rooms would do nothing, leaving the user permanently trapped in the general room. Conversely, if React opened the music room without terminating the general connection first, messages from both rooms would arrive at the same time and scramble the conversation. The socket connection must synchronize with the active room rather than the lifespan of the chat container. React stops the previous synchronization process and starts a fresh one on every room update.

### The Room Switch in Plain JavaScript

In standard JavaScript without React, you manage connection switching manually. You store the active socket connection in a variable. When the user selects another room, you explicitly close the old connection before creating and opening the new one:

```js title="Plain JavaScript: you switch the room by hand"
let connection = createConnection(serverUrl, 'general');
connection.connect();

roomMenu.addEventListener('change', () => {
  ~connection.disconnect()~; // First, close the old room
  connection = createConnection(serverUrl, roomMenu.value);
  ~connection.connect()~; // Then, open the new room
});
```

Notice the strict order of operations: the old room must disconnect before the new room connects. If you omit the disconnection call, both socket connections remain open in memory simultaneously.

In React, you do not write manual room-switching handlers. Instead, you declare two complementary behaviors inside a single Effect: how to start synchronization, and how to stop synchronization. React coordinates their execution order whenever dependencies update:

```jsx title="React: you write the start and the stop, React does the switch"
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  ~connection.connect()~; // How to start: connect to this room
  return () => {
    ~connection.disconnect()~; // How to stop: disconnect from this room
  };
}, ~[roomId]~); // When roomId changes, React runs the stop for the old room, then the start for the new one
```

As the official React documentation explains, the Effect body specifies how to start synchronizing, while your cleanup function specifies how to stop synchronizing. React then calls these functions in the correct order with the corresponding props and state.

> [!DEFINITION]
> **What is an Effect, and what is its cleanup?** [REVIEW] An Effect synchronizes a React component with an external system outside React.
> 1. You declare an Effect with the useEffect hook, passing a setup function and an optional dependency array.
> 2. React executes the setup function after rendering commits to the screen, never during the render calculation.
> 3. The setup function optionally returns a cleanup function that tears down whatever external resources the setup created.
> 4. React runs the cleanup function when the component unmounts from the DOM, as well as before re-running the Effect when dependencies change (Lesson 32).

> [!DEFINITION]
> **What is the dependency array?** [REVIEW] The dependency array is the second argument passed to useEffect, such as [roomId]. It lists every reactive value read by the Effect.
> 1. After each render pass, React compares each value in the array against its value from the prior render using Object.is equality.
> 2. If every value matches, React skips executing the Effect for that render pass.
> 3. If any value changed, React executes the previous render's cleanup function and then runs the new setup function.
> 4. An empty array [] means the Effect reads no reactive values and runs only on mount, whereas omitting the array causes the Effect to run after every single render (Lesson 32).

### A component mounts, updates, and unmounts. An Effect only starts and stops.

A lifecycle represents the sequence of states an entity moves through over time. The official documentation highlights a fundamental architectural distinction: Effects have a different lifecycle from components. Components may mount, update, or unmount. An Effect can only do two things: start synchronizing something, and later stop synchronizing it.

Two distinct lifecycles operate simultaneously within the same application view:
- **The component lifecycle** contains three phases. A component mounts when React inserts its DOM elements into the page (Lesson 13). It updates when it re-renders with new props or state. It unmounts when React removes it from the document (Lesson 32).
- **The Effect lifecycle** contains two actions. The setup function starts synchronization by connecting to an external resource. The cleanup function stops synchronization by disconnecting from that resource. This start and stop cycle can repeat many times while the component remains mounted.

During the initial render, the two lifecycles appear identical. The component mounts into the page, and the Effect connects to the general room.

The moment the user picks travel, the two lifecycles diverge. The component does not unmount. It only updates its rendered output with the new room heading. However, the Effect must stop and start again. It disconnects from general and then establishes a new connection to travel.

> [!DEFINITION]
> **What does re-synchronizing mean?** [NEW] Re-synchronization is the cycle where React stops an active Effect and starts a new one when its dependencies change.
> 1. When a dependency like roomId updates, the open connection no longer matches the current screen.
> 2. React runs the cleanup function from the previous render, disconnecting from the old room.
> 3. React then executes the setup function for the current render, connecting to the new room.
> 4. The hosting component remains mounted on screen throughout this entire transition (Lesson 35).

```tree caption="A component mounts, updates, and unmounts; an Effect repeats one stop and one start for every new room."
Two lifecycles on the same chat page
- +The component's lifecycle [`mount` `update` `unmount`] | **Mounts** once, **updates** when `roomId` changes, **unmounts** when the chat closes | Stays **on the page** while the user switches rooms
- +The Effect's lifecycle [`useEffect`] | The setup **connects**, the cleanup **disconnects** | Repeats one **stop and start** every time `roomId` changes
```

### The Rule of Thumb: one start, one stop, and every value the Effect reads in the array

**Structure your setup function to start synchronizing with current values. Structure your cleanup function to stop that exact synchronization. Place every reactive value read by the Effect into the dependency array. React manages the rest.**

The core goal is absolute consistency: the heading displayed on screen and the active connection in memory must always agree on the current room. Experienced developers guard against five classic misconceptions that break this synchronization:
1. **"The cleanup function only runs when the component unmounts."** This misunderstanding leads to surprise when cleanup functions execute on every routine room switch.
2. **"The cleanup function receives the newly updated dependency values."** It does not. The cleanup retains the values from the specific render that created it, which allows it to disconnect the previous room cleanly.
3. **"Simple socket connections do not require a cleanup function."** Omitting a cleanup leaves obsolete rooms connected in the background, leaving the user in multiple rooms simultaneously.
4. **"Passing an empty dependency array ensures the connection opens only once."** Omitting dependencies leaves the Effect frozen on its initial room, ignoring all user selections.
5. **"Unrelated operations like analytics logging belong in the connection Effect."** Bundling multiple concerns forces unrelated tasks to re-run whenever any shared dependency changes.

The remainder of this lesson explores each scenario using a concrete chat room component.

## SECTION | A Chat Room Picker with Three Rooms

Our example application follows the chat room picker from the official React documentation. It features a dropdown menu for selecting rooms and a toggle button. While the chat remains open, a horizontal divider and a room welcome heading appear beneath the controls.

When the page first opens, the chat interface is closed:

```page width=text caption="The chat room picker when the page opens: the menu shows general, the button says Open chat, and the Console is quiet."
form:
  select: Choose the chat room: | general
  button: Open chat
console: quiet
```

The user performs four consecutive interactions:
1. **Clicks Open chat.** The general heading appears, and the application connects to the general room.
2. **Selects travel.** The heading updates, prompting the application to disconnect from general and connect to travel.
3. **Selects music.** The heading updates again, prompting the application to disconnect from travel and connect to music.
4. **Clicks Close chat.** The heading unmounts, and the application disconnects from music.

The chat server helper simulates an external network connection. In a production environment, this code would establish a real socket connection. Our implementation logs descriptive messages to the browser Console so we can verify each connection and disconnection event:

```js title="src/chat.js"
export function ~createConnection~(serverUrl, roomId) { // Returns an object with two methods
  return {
    ~connect~() { // Prints the connect line
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    ~disconnect~() { // Prints the disconnect line
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

The parent App component manages two state variables (Lesson 12). The `roomId` variable holds the room selected in the menu, and the `show` boolean indicates whether the chat interface is open. The menu functions as a controlled select field (Lesson 20). The button toggles the `show` state (Lesson 11). While the chat is open, App renders ChatRoom and forwards the active room as a prop (Lesson 10):

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);

  return (
    <main>
      <label>
        Choose the chat room:{' '}
        <select
          ~value={roomId}~ // The menu shows the room in state
          ~onChange={e => setRoomId(e.target.value)}~ // A pick stores the new room in state
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button ~onClick={() => setShow(!show)}~> {/* Opens or closes the chat */}
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && ~<ChatRoom roomId={roomId} />~} {/* Passes the room down while the chat is open */}
    </main>
  );
}
```

The child ChatRoom component manages the synchronization Effect. In this initial implementation, the server address never changes, so it lives as a module constant above the component definition:

```jsx title="src/components/ChatRoom.jsx"
import { useEffect } from 'react';
import { createConnection } from '../chat.js';

const ~serverUrl~ = 'https://localhost:1234'; // A fixed address, outside the component

export default function ChatRoom({ ~roomId~ }) { // general, travel, or music, from App
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    ~connection.connect()~; // Start: connect to this room
    return () => {
      ~connection.disconnect()~; // Stop: disconnect from this room
    };
  }, ~[roomId]~); // A new room means one stop and one start
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

The main entry file renders App inside Strict Mode to highlight lifecycle inconsistencies during development (Lesson 07). Principle 4 introduces an editable server address field to ChatRoom, and Principle 5 introduces an analytics logging module:

```files title="chat-room: File Explorer" caption="How the chat room project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and renders it inside `<StrictMode>`
  chat.js | external helper | Exports `createConnection(serverUrl, roomId)` with `connect()` and `disconnect()`
  analytics.js | analytics helper | Added in Principle 5: exports `logVisit(roomId)`
  App.jsx | parent | Keeps `roomId` and `show` in state and renders `ChatRoom`
  components/
    ChatRoom.jsx | Effect | Connects to the room in an Effect and disconnects in its cleanup
```

Here is the state of the page after the user opens the chat, switches to travel, and then switches to music:

```page width=text caption="After Open chat, travel, and music: three connections, and each old room disconnected before the next one connected."
form:
  select: Choose the chat room: | music | good
  button: Close chat
heading: Welcome to the music room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:1234...
log: ❌ Disconnected from "travel" room at https://localhost:1234
log: ✅ Connecting to "music" room at https://localhost:1234...
```

All console output in this lesson reflects production behavior unless development mode is explicitly mentioned. In development mode, Strict Mode adds a diagnostic remount check on initial display, which Principle 2 details.

**PRINCIPLES:** An Effect performs only two actions: it starts synchronizing, and it stops synchronizing. Whenever a dependency changes, React stops the previous Effect and starts a new one. Five core principles govern clean Effect lifecycles:
1. **Principle 1: An Effect Starts and Stops, It Does Not Mount.** The component mounts once, yet the Effect connects three separate times. Focus on a single start and stop cycle at a time.
2. **Principle 2: The Old Cleanup Runs Before the New Setup.** When switching to travel, React disconnects from general using the previous room value. Without a cleanup, the old room remains connected.
3. **Principle 3: Every Value the Effect Reads Goes in the Array.** With an empty array and a silenced linter, the heading shows travel while the connection remains stuck on general.
4. **Principle 4: Values from the Component Body Are Reactive.** A server address stored in state must join the dependency array. A constant outside the component does not, and mutable refs cannot.
5. **Principle 5: One Effect for Each Job.** Analytics logging requires its own dedicated Effect so editing the server address does not trigger false room visits.

---

## PRINCIPLE | `useEffect`: one connect and one disconnect for each room, while the component stays mounted

> [!PRINCIPLE]
> **Principle 1: An Effect Starts and Stops, It Does Not Mount**
>
> *Focus on a single start and stop cycle at a time. The setup function connects to the current room, and the cleanup function disconnects from it, regardless of whether the component is mounting, updating, or unmounting.*
>
> From the component's perspective, opening the chat, selecting two rooms, and closing the chat represents one mount, two updates, and one unmount. From the Effect's perspective, this interaction represents three distinct connection cycles in sequence: general, travel, and music. Author your Effect as a self-contained connect and disconnect pair, allowing React to repeat it whenever the room changes.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   ~return () => connection.disconnect();~ // Stops exactly what this setup started
> }, [roomId]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[]~); // **WRONG:** written as "connect on mount", so a new room never reconnects
> ```

### VS | The component's view vs. the Effect's view: four moments vs. three connections

The official React documentation examines these four user interactions from two contrasting viewpoints: how the component perceives them, and how the Effect perceives them.

The component observes four distinct lifecycle moments:
1. ChatRoom mounts with `roomId` set to general.
2. ChatRoom updates with `roomId` set to travel.
3. ChatRoom updates with `roomId` set to music.
4. ChatRoom unmounts from the DOM.

The Effect observes three sequential synchronization cycles:
1. Connected to the general room, until disconnected.
2. Connected to the travel room, until disconnected.
3. Connected to the music room, until disconnected.

Notice the discrepancy: four lifecycle events for the component, but three connection cycles for the Effect. While mounting, updating, and unmounting describe component behavior accurately, the documentation warns that thinking about Effects in component lifecycle terms creates confusion. The recommended mental model requires focusing strictly on a single start and stop cycle at a time, independent of whether the component is mounting or updating.

```tree caption="The same four clicks seen by the component vs. seen by the Effect: four moments vs. three connections."
Four clicks across three rooms
- !The component's view [`ChatRoom`] | 1. Mounted with `general` | 2. Updated with `travel` | 3. Updated with `music` | 4. Unmounted
- +The Effect's view [`useEffect`] | 1. Connected to `general`, until it disconnected | 2. Connected to `travel`, until it disconnected | 3. Connected to `music`, until it disconnected
```

### One mount, three connections

**The ChatRoom component mounts exactly once, yet its Effect connects three separate times.** Here is how React handles each interaction:
1. **Open chat.** App renders ChatRoom for the first time with the general room. ChatRoom mounts into the DOM, paints the general heading, and executes the setup function to connect to general.
2. **Select travel.** App passes the travel prop to the existing ChatRoom instance. The component does not remount. It re-renders, updating its heading text in the DOM. React then executes the previous cleanup function to disconnect from general, followed by the new setup function to connect to travel.
3. **Select music.** The heading text updates again. React executes the cleanup function from the travel render, and then runs the setup function for the music render.
4. **Close chat.** App stops rendering ChatRoom, causing it to unmount. React executes the final cleanup function from the music render, terminating the connection to music.

You can verify in the browser developer tools that the component never remounts during room switches. The heading element remains in the DOM tree, and only its text content updates.

What happens if an Effect omits a cleanup function entirely? As the documentation notes, React behaves as if the setup returned an empty cleanup function. The stop phase still occurs, but it performs no work. In our chat application, this means disconnect is never called, leaving obsolete socket connections open in memory. Principle 2 examines this defect in detail.

### The bug: "connect on mount, disconnect on unmount"

Framing Effects around component lifecycles frequently results in broken application logic:
1. A developer examines ChatRoom and assumes the connection should open when the component mounts and close when it unmounts.
2. Because mounting and unmounting happen once, the developer passes an empty dependency array (Lesson 32).
3. The user opens the chat. ChatRoom mounts with general, and the Effect connects to general.
4. The user selects travel. ChatRoom updates rather than remounting. Because the dependency array is empty, React skips the Effect entirely, leaving the application connected to general while the heading displays travel. Principle 3 resolves this dependency issue.

The solution requires a shift in perspective. When authoring JSX markup, you describe what the screen should look like rather than tracking whether a render is initial or subsequent. An Effect functions on the same declarative principle. It represents part of the rendered output, synchronizing external systems with current values.

When the cleanup logic cleanly mirrors the setup logic, an Effect remains resilient regardless of how often React starts and stops it.

---

## PRINCIPLE | The cleanup function: the old room disconnects before the new room connects

> [!PRINCIPLE]
> **Principle 2: The Old Cleanup Runs Before the New Setup**
>
> *When a dependency updates, React first executes the cleanup function from the previous render using previous values, and then runs the setup function for the current render using current values.*
>
> Each render pass captures its own immutable props and state. When switching to travel, the cleanup function executed by React was created during the general render, ensuring it cleanly disconnects from general. Only then does the new setup connect to travel. Without a cleanup function, obsolete connections remain open indefinitely.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   ~return () => connection.disconnect();~ // Closes the old room before the new setup runs
> }, [roomId]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   ~connection.connect();~ // **WRONG:** no cleanup, so every new room leaves the old one connected
> }, [roomId]);
> ```

### When React calls the setup and the cleanup

The official useEffect documentation specifies the exact timing of setup and cleanup execution across three distinct phases:
1. **On component mount:** React executes the setup function after inserting the component into the page DOM.
2. **On re-renders with changed dependencies:** React first executes the cleanup function using the props and state from the prior render, and then runs the setup function using the newly received props and state.
3. **On component unmount:** React executes the cleanup function one final time when removing the component from the DOM.

The second phase represents the core mechanism of this lesson. It frequently surprises developers who assume cleanups run exclusively on unmount. The cleanup function runs before every re-render with changed dependencies.

### VS | The new setup vs. the old cleanup: the same name `roomId`, two different rooms

Examine both functions within ChatRoom:

```jsx title="The setup and the cleanup inside ChatRoom.jsx"
useEffect(() => {
  const connection = createConnection(serverUrl, ~roomId~); // The roomId of the render that ran this setup
  connection.connect();
  return () => {
    ~connection.disconnect()~; // Disconnects the connection made with that same roomId
  };
}, [roomId]);
```

Both functions reside within the same `useEffect` block. When the user selects travel, developers sometimes assume that both functions now observe the new travel value. That assumption is incorrect.

**The screen heading updates to travel first, and then the browser Console logs a disconnection message for general.** React executes the transition in a strict sequence:
1. The user selects travel, prompting `setRoomId` to schedule a re-render.
2. App renders and forwards travel to ChatRoom. React updates the heading text in the browser DOM.
3. React compares the new dependency array containing travel against the previous array containing general. Because the values differ, the Effect must re-synchronize.
4. React invokes the cleanup function returned by the general render pass, which closes the general connection.
5. React invokes the setup function created during the travel render pass, which opens the travel connection.

React always cleans up the previous render's Effect before executing the next render's Effect.

```tree dir=right caption="What React runs after a render where roomId changed from general to travel."
React re-synchronizes when `roomId` changes from `general` to `travel`
- +1. Update the screen [`Welcome to the travel room!`] | React puts the new heading text **into the DOM first**
- +2. Run the OLD cleanup [`roomId` is `general`] | Calls `disconnect` from the **general render**
- +3. Run the NEW setup [`roomId` is `travel`] | Calls `connect` from the **travel render**
```

### Why the cleanup still holds general

> [!DEFINITION]
> **What is a render's snapshot?** [REVIEW] Each render pass represents an independent invocation of a component function.
> 1. In that execution, props, state, and local variables exist as fixed, immutable snapshot values.
> 2. Every function instantiated during that execution, including Effects and their cleanups, retains access to those specific values forever through closure.
> 3. Subsequent renders invoke the component anew, generating fresh snapshots and new function instances.
> 4. As a result, a cleanup function created in an earlier render always accesses its original values, even after the screen displays new data (Lesson 15).

During the first render pass, `roomId` was general. The setup function and its returned cleanup function captured that general value within their closure. If you inspected the first render's Effect directly, it would look like this:

```jsx title="The first render's Effect, with general captured"
() => {
  const connection = createConnection(serverUrl, ~'general'~); // Captured in the first render
  connection.connect();
  return () => ~connection.disconnect()~; // Always disconnects the general connection
}
```

This closure behavior guarantees correctness. The cleanup function must terminate the specific socket connection opened by its corresponding setup function, which belongs to general.

The same principle applies during unmounting. When the user clicks Close chat while viewing music, ChatRoom unmounts. React invokes the cleanup function from the music render pass one final time, terminating the music connection.

### In development, Open chat prints three lines

**In development mode, a single click on Open chat logs three consecutive messages: connect, disconnect, and connect again.** React Strict Mode executes this cycle intentionally:
1. React executes the setup function for general, producing the initial connection message.
2. React immediately invokes the cleanup function, producing the disconnection message.
3. React executes the setup function for general a second time, producing the final connection message.

```page width=text caption="After Open chat in development: Strict Mode runs setup, cleanup, and setup to test the cleanup."
form:
  select: Choose the chat room: | general
  button: Close chat
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
log: ❌ Disconnected from "general" room at https://localhost:1234 | chat.js:7
log: ✅ Connecting to "general" room at https://localhost:1234... | chat.js:4
```

Strict Mode remounts each component once in development to verify that cleanup routines properly reverse all setup logic (Lesson 32). When your cleanup cleanly mirrors your setup, the user experiences no visible disruption. Lesson 47 examines Strict Mode stress tests in full.

### A render with the same room skips the Effect

Suppose ChatRoom re-renders while `roomId` remains general. React does not reconnect. It compares the dependency array containing general against the prior array containing general. Because `Object.is` confirms equality, React ignores the Effect for that render pass.

Now suppose a subsequent render updates `roomId` to travel. Which cleanup runs? Because the intermediate render skipped its Effect, it generated no new cleanup function. React executes the cleanup function from the last render that actually ran. That corresponds to the initial render, cleanly disconnecting general.

### The bug: no cleanup function

**Without a cleanup function, switching from general to travel leaves general open. The application remains connected to both rooms at once.** Here is what occurs when the return statement is omitted:
1. The setup function connects to the room but returns no cleanup function.
2. The user selects travel. The screen updates to display the travel heading, but React has no cleanup function to run for general.
3. React executes the travel setup function. The Console displays a connection message for travel with no prior disconnection message.
4. The general socket connection remains active in background memory. Each room switch leaks another active connection.

::: row caption="A switch from general to travel without a cleanup function vs. with a cleanup function."
::: col title="Without a cleanup function" tag="two open connections" tone=bad
```page size=mini
form:
  select: Choose the chat room: | travel
  button: Close chat
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ✅ Connecting to "travel" room at https://localhost:1234...
```
```jsx title="src/components/ChatRoom.jsx" bad="3"
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    ~connection.connect();~ // **WRONG:** no cleanup, so general never disconnects
  }, [roomId]);
```
Two connect lines and no disconnect line: general and travel are both open.
:::
::: col title="With a cleanup function" tag="one open connection" tone=good
```page size=mini
form:
  select: Choose the chat room: | travel | good
  button: Close chat
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:1234...
```
```jsx title="src/components/ChatRoom.jsx" good="4,5,6"
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      ~connection.disconnect();~ // Closes general before travel connects
    };
  }, [roomId]);
```
React disconnects from general before it connects to travel. Only one room is open.
:::
:::

In development mode, omitting a cleanup produces immediate errors. Because Strict Mode runs setup twice at mount, two general connections open before the user even interacts with the page.

Every setup routine requires a matching cleanup function that reverses its actions. Conversely, cleanup routines should only reverse work initiated by their corresponding setup.

---

## PRINCIPLE | `[roomId]` in the dependency array: the Effect follows every room change

> [!PRINCIPLE]
> **Principle 3: Every Value the Effect Reads Goes in the Array**
>
> *Declare every reactive value read by an Effect inside its dependency array, and never suppress the exhaustive-deps linter to artificially shorten the list.*
>
> React re-synchronizes an Effect only when a value in the dependency array fails an Object.is equality check against the previous render. With an empty array, no dependency can ever change, so the initial render's Effect remains active indefinitely. The application stays connected to the first room while the heading displays the new one.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, ~roomId~); // Reads roomId
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[roomId]~); // Lists roomId, so a new room reconnects
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[]~); // **WRONG:** tells React the Effect reads nothing that can change
> ```

### VS | `[roomId]` vs. `[]`: the same connection code, only one follows the menu

Both Effect implementations below execute identical connection and disconnection logic. Only their dependency arrays differ:

```jsx title="roomId in the dependency array"
useEffect(() => {
  const connection = createConnection(serverUrl, ~roomId~); // Reads roomId
  connection.connect();
  return () => connection.disconnect();
}, ~[roomId]~); // Tells React: this Effect depends on roomId
```

```jsx title="roomId left out of the dependency array"
useEffect(() => {
  const connection = createConnection(serverUrl, ~roomId~); // Reads roomId
  connection.connect();
  return () => connection.disconnect();
}, ~[]~); // **WRONG:** tells React: this Effect depends on nothing
```

When the user clicks Open chat, both implementations connect to general with identical console output. The difference emerges on the first room switch. With `[roomId]`, React disconnects from general and connects to travel. With an empty array, React skips the Effect entirely, leaving the connection on general.

How does React determine when to reconnect? It relies on the explicit dependency contract you provide. When authoring an Effect, you recognize that `roomId` is a prop that changes over time, and that your Effect code reads that prop. Declaring `roomId` in the dependency array communicates that relationship directly to React.

The dependency array is not a configurable preference. It represents an objective inventory of reactive values read by the Effect code. The `exhaustive-deps` lint rule inspects the Effect body and validates this list automatically:

```jsx title="The exhaustive-deps example: a missing userId vs. a complete array"
useEffect(() => {
  fetchUser(~userId~); // Reads userId
}, ~[]~); // **WRONG:** Missing 'userId' in the dependency array

useEffect(() => {
  fetchUser(~userId~); // Reads userId
}, ~[userId]~); // Runs again when userId changes
```

Declaring dependencies is also distinct from omitting the array entirely. Omitting the array causes the Effect to run after every single render pass (Lesson 32). If ChatRoom included a text input for drafting messages, omitting the array would cause the component to disconnect and reconnect on every keystroke.

```tree caption="Three ways to end the useEffect call when the Effect reads roomId."
Three endings for an Effect that reads `roomId`
- +With `[roomId]` | Lists the value the Effect reads | Reconnects **only when `roomId` changes**
- !With `[]` | ~Leaves `roomId` out | Never reconnects, **stuck on general**
- !With no array | ~No dependency array at all | Reconnects **after every render**, even on every typed letter
```

### The bug: `[]` and a silenced linter

When an Effect reads `roomId` while specifying an empty dependency array, the linter reports missing dependencies. Some developers attempt to suppress this warning with an `eslint-disable` comment. The official documentation strongly advises against suppressing the linter.

**Suppressing the linter with an empty array causes the screen heading to show travel while the connection remains stuck on general.** Step by step:
1. A developer attempts to prevent repeated executions by passing an empty array and suppressing the linter.
2. The user opens the chat, and the Effect connects to general.
3. The user selects travel. The screen updates to display the travel heading.
4. React compares the empty dependency arrays using `Object.is`. Because nothing changed, React skips the Effect.
5. No cleanup runs and no new setup executes. The Effect remains bound to the stale general value from the initial render (Lesson 34). The visual interface and network state diverge completely.

::: row caption="A pick of travel with the empty array and a silenced linter vs. with roomId in the array."
::: col title="With [] and a silenced linter" tag="stuck on general" tone=bad
```page size=mini
form:
  select: Choose the chat room: | travel
  button: Close chat
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
```
```jsx title="src/components/ChatRoom.jsx" bad="5"
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[]~); // **WRONG:** the disable comment hides the missing roomId
```
The heading says travel, but the Console stopped at general. The user is still in the old room.
:::
::: col title="With [roomId] in the array" tag="reconnects to travel" tone=good
```page size=mini
form:
  select: Choose the chat room: | travel | good
  button: Close chat
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:1234...
```
```jsx title="src/components/ChatRoom.jsx" good="5"
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // Reconnects whenever roomId changes
```
React disconnects from general and connects to travel.
:::
:::

Suppressing the linter misrepresents the values your Effect depends on. Maintaining an honest dependency array ensures your code avoids stale values.

### The name for this bug: a stale closure

> [!DEFINITION]
> **What is a stale closure?** [NEW] A closure is a function that retains access to variables from its outer lexical scope.
> 1. In React, a stale closure occurs when a function created in an earlier render continues executing with outdated props or state.
> 2. Omitting a reactive value from the dependency array prevents React from refreshing the Effect when that value changes.
> 3. The Effect remains bound to the snapshot values captured during its initial execution.
> 4. For instance, an event listener or socket created during mount will permanently read initial values instead of current ones (Lesson 35).

### What to do when an Effect runs too often

Why does an Effect re-synchronize? Effects represent reactive code blocks. Unlike event handlers, which run only in response to specific user interactions, Effects run whenever re-synchronization becomes necessary.

If you need an Effect to perform actions only under specific conditions, place that conditional logic inside the Effect body. You must never wrap the `useEffect` call itself in an `if` statement, as Hooks must always execute at the top level of the component (Lesson 38).

If the linter flags a dependency that causes an Effect to re-run too frequently, do not suppress the lint warning. Instead, adjust your implementation so the Effect no longer depends on that value. Subsequent lessons explore two proven techniques:
1. Read the latest value inside an Effect Event without triggering a re-synchronization cycle (Lesson 36).
2. Eliminate unnecessary object or function dependencies created during render (Lesson 37).

---

## PRINCIPLE | `[roomId, serverUrl]`: every prop, state, and body variable the Effect reads goes in the array

> [!PRINCIPLE]
> **Principle 4: Values from the Component Body Are Reactive**
>
> *Props, state variables, and local variables calculated in the component body can change on re-render, so they must be declared in the dependency array. Constants declared outside rendering stay out, while values that change without triggering a render, such as ref.current, cannot be dependencies.*
>
> A value is considered reactive when React computes it during the rendering data flow. Moving serverUrl from module scope into state allows it to change across renders, requiring the dependency array to include both roomId and serverUrl. Modifying ref.current or browser globals does not schedule a render pass, meaning React never evaluates the dependency array.
>
> **DO THIS:**
> ```jsx
> function ChatRoom({ roomId }) {
>   const [~serverUrl~, setServerUrl] = useState('https://localhost:1234'); // State: reactive
>   useEffect(() => {
>     const connection = createConnection(serverUrl, roomId);
>     connection.connect();
>     return () => connection.disconnect();
>   }, ~[roomId, serverUrl]~); // Both reactive values the Effect reads
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ChatRoom({ roomId }) {
>   const [serverUrl, setServerUrl] = useState('https://localhost:1234');
>   useEffect(() => {
>     const connection = createConnection(serverUrl, roomId);
>     connection.connect();
>     return () => connection.disconnect();
>   }, ~[roomId]~); // **WRONG:** serverUrl is state now, so a new address never reconnects
> }
> ```

### VS | `serverUrl` above the component vs. `serverUrl` in state: the same call, only one is reactive

In our initial implementation, `serverUrl` existed as a constant above the component definition. Suppose we now allow users to customize the server address directly. Moving the address into component state alters its reactivity:

```jsx title="serverUrl above the component: not reactive"
const ~serverUrl~ = 'https://localhost:1234'; // Outside the component: no render can change it

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // Only roomId can change
}
```

```jsx title="serverUrl in state: reactive"
function ChatRoom({ roomId }) {
  const [~serverUrl~, setServerUrl] = useState('https://localhost:1234'); // Inside the component: can change

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId, serverUrl]~); // Both can change, so both are listed
}
```

The invocation of `createConnection` remains identical in both examples. The critical difference lies in where `serverUrl` is declared.

When declared above the component, the address cannot change across renders, so the dependency array only requires `roomId`. When stored in state, the address can change over time, requiring it to join the dependency array. Dependencies serve a purpose only when the values they represent can change across renders.

> [!DEFINITION]
> **What is a reactive value?** [NEW] A reactive value is any value that can change from one render pass to the next.
> 1. Props, state, and local variables declared inside the component body are reactive because React computes them during render execution.
> 2. This execution path is known as the rendering data flow.
> 3. Because any value produced within this flow can change on subsequent renders, any Effect reading it must list it as a dependency.
> 4. Constants declared outside the component function sit outside this flow and are not reactive (Lesson 35).

### Which values go in the array, and which do not

The official documentation classifies values read by an Effect into four distinct categories:
1. **Reactive values belong in the dependency array.** This includes props, state variables, and all local variables computed within the component body during render.
2. **Constants outside rendering stay out of the array.** Fixed values declared above the component or variables defined entirely inside the Effect never change across renders.
3. **Stable values may be omitted.** React guarantees that state setter functions from `useState` and ref objects from `useRef` retain stable references across all renders (Lesson 30). Including them is harmless, but unnecessary.
4. **Mutable external values cannot be dependencies.** Values like `location.pathname` or `ref.current` change outside React's rendering data flow without triggering a re-render.

```tree caption="Which values an Effect reads go in the dependency array, and which do not."
Four kinds of values an Effect can read
- +Props, state, and body variables [`roomId` `serverUrl`] | Calculated **during rendering** | **Reactive**: they go in `[roomId, serverUrl]`
- +Constants outside rendering [`const serverUrl` at the top of the file] | No render **can change** them | **Not reactive**: they stay out
- +Stable values from React [`setServerUrl` `ref` object] | Guaranteed **not to change** on a re-render | **Stable**: listed or not, both are allowed
- !Mutable values [`location.pathname` `ref.current`] | ~Change **outside the rendering data flow** | **Cannot be dependencies**: a change never renders the component
```

### A variable calculated in the body is reactive too

A value does not need to be a raw prop or state variable to be reactive. Any variable computed inside the component body during rendering is reactive. Consider an example where `serverUrl` is derived from a prop or fallback context value using the nullish coalescing operator (Lesson 28):

```jsx title="A variable calculated in the body is reactive"
function ChatRoom({ roomId, selectedServerUrl }) {
  const settings = useContext(SettingsContext);
  const ~serverUrl~ = selectedServerUrl ?? settings.defaultServerUrl; // Calculated during rendering, so reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, ~serverUrl~]); // Listed, because the next render can calculate a new address
}
```

Because `serverUrl` is computed during rendering, subsequent renders can produce a different address. The Effect must include `serverUrl` in its dependencies.

### `[]` means "this Effect reads no reactive values"

When neither the address nor the room depends on props or state, you can declare both as constants, either above the component or inside the Effect:

```jsx title="Constants above the component"
const ~serverUrl~ = 'https://localhost:1234'; // Outside the component: not calculated during rendering
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[]~); // Reads no reactive values
}
```

```jsx title="Constants inside the Effect"
function ChatRoom() {
  useEffect(() => {
    const ~serverUrl~ = 'https://localhost:1234'; // Inside the Effect: not calculated during rendering
    const roomId = 'general';
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[]~); // The same empty array
}
```

Both approaches achieve the same outcome for the dependency array. Because these values are not computed during rendering, they are not reactive. Moving non-reactive logic outside the component or inside the Effect provides a legitimate way to remove dependencies without violating lint rules.

Passing an empty array `[]` does not mean execute exclusively on mount. It explicitly declares that the Effect reads no reactive values from the rendering data flow. If those values later become reactive state, they must be added to the dependency array.

### Four ways to handle a value an Effect reads

In total, the documentation provides four architectural patterns for managing values read by an Effect:
1. **Declare it in the dependency array.** Use this for any reactive value from props, state, or component calculations. React re-synchronizes when the value changes.
2. **Move it above the component.** Use this for static constants that never change across renders. The value leaves the dependency array.
3. **Move it inside the Effect.** Use this for local variables used exclusively by the Effect that do not depend on props or state. The value leaves the dependency array.
4. **Read it inside an Effect Event.** Use this when an Effect needs the latest value of a prop or state without re-synchronizing when that value changes. Lesson 36 details `useEffectEvent`.

```tree caption="The four places a value read by an Effect can live, and what each one means for the array."
Four ways to handle a value an Effect reads
- +1. Keep it in the body and list it [`[roomId]`] | Can change on a **re-render** | React **re-synchronizes** when it changes
- +2. Move a fixed constant above the component [`const serverUrl` at the top of the file] | No render **can change** it | It **leaves the array**
- +3. Move a helper value inside the Effect [declared inside `useEffect`] | Created **when the Effect runs**, not during rendering | It **leaves the array**
- +4. Read it in an Effect Event [`useEffectEvent`] | Reads the **latest value** without a reconnect | Covered in **Lesson 36**
```

### The Server URL field: every letter reconnects

Now ChatRoom stores the server address in state and provides a controlled text input (Lesson 20). The `serverUrl` variable joins the dependency array:

```jsx title="src/components/ChatRoom.jsx"
import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

export default function ChatRoom({ roomId }) {
  const [~serverUrl~, setServerUrl] = useState('https://localhost:1234'); // Reactive state

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, ~[roomId, serverUrl]~); // A new room or a new address means one stop and one start

  return (
    <section>
      <label>
        Server URL:{' '}
        <input
          ~value={serverUrl}~ // The field shows the address in state
          ~onChange={e => setServerUrl(e.target.value)}~ // Every typed letter stores a new address
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </section>
  );
}
```

**Each keystroke entered in the Server URL field disconnects from the previous address and connects to the new one.** Here is the sequence when the user appends 5 to the address:
1. The user types 5 into the input, updating the field to `https://localhost:12345`.
2. The `setServerUrl` updater schedules a re-render of ChatRoom with the new state.
3. React compares the updated dependency array against the prior array. Because `serverUrl` changed, React initiates re-synchronization.
4. React executes the previous cleanup function, disconnecting from `https://localhost:1234`.
5. React executes the new setup function, connecting to `https://localhost:12345`.

```page width=text caption="After the user types 5 at the end of the Server URL field: the Effect disconnects from the old address and connects to the new one."
form:
  select: Choose the chat room: | general
  button: Close chat
  field: Server URL: | https://localhost:12345 | good
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:12345...
```

This behavior is correct because the active connection must match the address displayed on screen. Whenever a reactive dependency changes, the Effect re-establishes synchronization.

### Why `ref.current` and `location.pathname` cannot be dependencies

**Placing a mutable external value in a dependency array does not cause an Effect to re-run when that value mutates.** The official documentation explains this limitation in four steps:
1. A developer places `ref.current` or `location.pathname` into a dependency array (Lesson 30).
2. Application code subsequently modifies `ref.current` or updates the browser location pathname.
3. Because this mutation occurs outside React's rendering data flow, no component render is scheduled.
4. Without a render pass, React never evaluates the dependency array, leaving the Effect unaware of the change.

To synchronize with external mutable sources like the window pathname, use the dedicated `useSyncExternalStore` hook (Lesson 53).

Conversely, creating new objects or functions inside the component body creates the opposite issue. Because JavaScript creates a new reference on each render, `Object.is` evaluation always fails, causing the Effect to re-synchronize on every render pass. Replacing an inline object or function with primitive props prevents unnecessary re-synchronization (Lesson 37).

---

## PRINCIPLE | Two `useEffect` calls: the visit log and the connection each run again only for their own values

> [!PRINCIPLE]
> **Principle 5: One Effect for Each Job**
>
> *Each Effect should represent an independent synchronization process with its own dedicated dependency array.*
>
> Combining unrelated tasks into a single Effect forces them to share a combined dependency array. As a result, both tasks re-run whenever any dependency for either task changes. To verify separation, ask yourself: if one Effect is deleted, does the other still function properly? If yes, each task belongs in its own useEffect hook.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   ~logVisit(roomId);~ // Job 1: runs again only for a new room
> }, [roomId]);
>
> useEffect(() => {
>   const connection = ~createConnection(serverUrl, roomId)~; // Job 2: runs again for a new room or a new address
>   connection.connect();
>   return () => connection.disconnect();
> }, [roomId, serverUrl]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   ~logVisit(roomId);~ // **WRONG:** shares [roomId, serverUrl], so a new address logs a false visit
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   return () => connection.disconnect();
> }, [roomId, serverUrl]);
> ```

### VS | One Effect for both jobs vs. two Effects: the same on a room switch, different on an address edit

Suppose we want to record an analytics visit whenever a user navigates to a room using `logVisit` (Lesson 34). Compare two implementation approaches:

```jsx title="logVisit inside the connection Effect"
useEffect(() => {
  ~logVisit(roomId);~ // **WRONG:** also runs every time serverUrl changes
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, ~[roomId, serverUrl]~); // Runs again when roomId OR serverUrl changes
```

```jsx title="logVisit in its own Effect"
useEffect(() => {
  ~logVisit(roomId);~ // Job 1: logs a visit
}, ~[roomId]~); // Runs again only when roomId changes

useEffect(() => {
  const connection = ~createConnection(serverUrl, roomId)~; // Job 2: connects
  connection.connect();
  return () => connection.disconnect();
}, ~[roomId, serverUrl]~); // Runs again when roomId or serverUrl changes
```

When switching rooms, both approaches log a visit and re-establish the connection. The flaw appears when the user edits the server address. With a single shared Effect, modifying `serverUrl` triggers the entire block, causing `logVisit` to record a duplicate visit. With two separate Effects, React reconnects to the new address while skipping the visit logger because `roomId` did not change.

The official documentation emphasizes that each Effect must represent a separate and independent synchronization process. In our chat application, recording page analytics is an independent process from maintaining socket connections. One Effect synchronizes analytics with the room name, while the second synchronizes the socket connection with both `roomId` and `serverUrl`.

### The test: delete one Effect, does the other still work?

To determine whether logic belongs in one Effect or two, apply a simple diagnostic check: would deleting one Effect break the logic of the other?
- Deleting the visit analytics Effect leaves the socket connection working normally.
- Deleting the socket connection Effect leaves the visit analytics working normally.

Because neither process depends on the other, they represent independent concerns and belong in separate `useEffect` calls.

However, avoid splitting a single cohesive process across multiple Effects purely for visual aesthetics. If removing one block disrupts the other, they belong together. Focus on whether synchronization processes are genuinely independent rather than attempting to minimize block length.

```tree caption="One Effect or two Effects: ask whether the jobs are separate processes."
One Effect or two? Ask whether the processes are separate
- !Two processes in one Effect [`logVisit` and `createConnection` in one `useEffect`] | ~Both jobs share `[roomId, serverUrl]` | A new address **logs a false visit** for the same room
- +One Effect per process [`[roomId]` for the visit, `[roomId, serverUrl]` for the connection] | +Deleting one **does not break** the other | Each runs again **only for its own values**
- !One process split in two for looks | ~One setup cut across two blocks | **Harder to maintain**, with no real gain
```

### `analytics.js` and the false visit

The analytics utility logs a message whenever a room visit is recorded:

```js title="src/analytics.js"
export function ~logVisit~(roomId) { // Records one visit to roomId
  console.log('Visited "' + roomId + '" room');
}
```

**Placing `logVisit` inside the connection Effect causes every keystroke in the Server URL field to log a false visit to a room the user never left.** The defect unfolds as follows:
1. A developer places `logVisit` inside an existing connection Effect because both tasks execute when entering a room.
2. The `serverUrl` state is introduced later, expanding the dependency array to `[roomId, serverUrl]`.
3. While remaining in general, the user appends 5 to the server address.
4. Because `serverUrl` changed, React executes the cleanup function and re-runs the entire Effect setup.
5. The setup invokes `logVisit` again for general, recording an unintended visit. Each keystroke records another duplicate visit.

::: row caption="One letter typed in the Server URL field when logVisit shares the connection Effect vs. when it has its own Effect."
::: col title="logVisit inside the connection Effect" tag="false visit on an address edit" tone=bad
```page size=mini
form:
  select: Choose the chat room: | general
  button: Close chat
  field: Server URL: | https://localhost:12345
heading: Welcome to the general room!
log: Visited "general" room
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: Visited "general" room
log: ✅ Connecting to "general" room at https://localhost:12345...
```
```jsx title="src/components/ChatRoom.jsx" bad="2,6"
  useEffect(() => {
    ~logVisit(roomId);~ // **WRONG:** runs again when only serverUrl changes
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId, serverUrl]~); // One array for both jobs
```
The address changed, so the whole Effect ran again, and a second visit to general appears.
:::
::: col title="logVisit in its own Effect" tag="no visit on an address edit" tone=good
```page size=mini
form:
  select: Choose the chat room: | general
  button: Close chat
  field: Server URL: | https://localhost:12345 | good
heading: Welcome to the general room!
log: Visited "general" room
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:12345...
```
```jsx title="src/components/ChatRoom.jsx" good="1,2,3"
  useEffect(() => {
    ~logVisit(roomId);~ // Runs again only when roomId changes
  }, ~[roomId]~); // Skipped when only serverUrl changes

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
```
`roomId` is still general, so React skips the visit Effect and only reconnects.
:::
:::

In development mode, Strict Mode executes the visit Effect twice on initial mount (Lesson 34). The documentation recommends preserving this behavior without adding custom flags to block execution. On mount, React executes Effects in the order they appear: first recording the visit, then establishing the connection.

### Two related cases: two fetches, and a value read without a reconnect

The same architectural principle applies when fetching dependent data. Consider a country and city picker: one Effect fetches countries on mount, while a second Effect fetches cities whenever the selected country updates. Because these are separate synchronization processes, combining them into a single Effect would cause country data to re-fetch on every city selection.

Effects should not be used as a tool for arbitrary code reuse. When multiple Effects share data fetching logic, extract that behavior into a custom Hook (Lesson 39).

In other scenarios, an analytics logger might need to inspect state, such as cart item counts, without re-triggering when that count changes. Reading the latest state without creating a synchronization dependency is the specific purpose of Effect Events (Lesson 36).

---

## All 5 Principles Together

### The complete files

The chat helper returns an object with `connect` and `disconnect`:

```js title="src/chat.js"
export function ~createConnection~(serverUrl, roomId) { // The stand-in chat server from the React docs
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

The analytics helper logs one visit:

```js title="src/analytics.js"
export function ~logVisit~(roomId) { // Logs one visit to roomId
  console.log('Visited "' + roomId + '" room');
}
```

App keeps the room and `show` in state. It renders ChatRoom while the chat is open:

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);

  return (
    <main>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          ~onChange={e => setRoomId(e.target.value)}~ // A new room becomes a new roomId prop for ChatRoom
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button ~onClick={() => setShow(!show)}~> {/* Mounts or unmounts ChatRoom */}
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </main>
  );
}
```

ChatRoom has two Effects, one for each job:

```jsx title="src/components/ChatRoom.jsx"
import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';
import { logVisit } from '../analytics.js';

export default function ChatRoom({ roomId }) {
  const [~serverUrl~, setServerUrl] = useState('https://localhost:1234'); // Principle 4: reactive state

  useEffect(() => {
    ~logVisit(roomId);~ // Principle 5: its own Effect for the visit
  }, ~[roomId]~); // Principle 3: the one reactive value this Effect reads

  useEffect(() => {
    const connection = ~createConnection(serverUrl, roomId)~; // Principle 1: start
    connection.connect();
    return () => {
      ~connection.disconnect()~; // Principle 2: stop, with this render's room and address
    };
  }, ~[roomId, serverUrl]~); // Principles 3 and 4: every reactive value this Effect reads

  return (
    <section>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </section>
  );
}
```

The user clicks Open chat, picks travel, and then types 5 at the end of the address:

```page width=text caption="The finished page after general, travel, and an address edit: every old connection closes before the new one opens, and the edit logs no false visit."
form:
  select: Choose the chat room: | travel | good
  button: Close chat
  field: Server URL: | https://localhost:12345 | good
heading: Welcome to the travel room!
log: Visited "general" room
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: Visited "travel" room
log: ✅ Connecting to "travel" room at https://localhost:1234...
log: ❌ Disconnected from "travel" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:12345...
```

### How React runs the two Effects across a session

```tree dir=right caption="How React runs the visit Effect and the connection Effect across four clicks and edits."
From Open chat to Close chat
- +1. Click Open chat [`roomId: 'general'`] | `ChatRoom` **mounts** | The visit Effect logs **general** · The connection Effect **connects** to general
- +2. Pick `travel` [`roomId: 'travel'`] | `roomId` changed, so **both Effects** run again | The old cleanup **disconnects from general** · The visit Effect logs **travel** · The new setup **connects to travel**
- +3. Edit the Server URL field [`serverUrl: 'https://localhost:12345'`] | `roomId` is still travel, `serverUrl` changed | The visit Effect is **skipped** · The old cleanup **disconnects** from the old address · The new setup **connects** to the new address
- +4. Click Close chat [`show: false`] | `ChatRoom` **unmounts** | The last cleanup **disconnects** from travel at the new address
```

### The mistake, and what the user sees

| The mistake | What the user sees | The rule |
| :--- | :--- | :--- |
| **Thinking in mount and unmount** | A new room never connects | One start and one stop for each value of the dependencies |
| **No cleanup function** | Every old room stays connected | The cleanup undoes exactly what the setup did |
| **Expecting the new `roomId` in the cleanup** | A confusing Console, read the wrong way | The cleanup holds the values of its own render |
| **`[]` with a silenced linter** | The heading says travel, the chat stays on general | Every reactive value the Effect reads goes in the array |
| **`serverUrl` in state, left out of the array** | A new address never connects | Props, state, and body variables are reactive |
| **`ref.current` in the array** | The Effect never runs again when it changes | A value that changes without a render cannot be a dependency |
| **Two jobs in one Effect** | An address edit logs a false visit | One Effect for each separate process |

An Effect performs only two actions: it starts synchronizing, and it stops synchronizing. Whenever a dependency changes, React stops the previous Effect and starts a new one.

---

## For the Interview

> **The Interview Question:** What is the lifecycle of a reactive effect as its dependencies change?

### How to Answer Clearly in 30 Seconds

"Components mount, update, and unmount. An Effect operates on a completely different lifecycle: its setup starts synchronization, and its cleanup stops synchronization. While a component remains mounted on screen, that start and stop cycle can repeat many times. A chat room illustrates this: the setup connects to the active room, and the cleanup disconnects. Three core rules govern this lifecycle:
1. **How React decides to re-run:** after each render pass, React compares each value in the dependency array against the prior render using Object.is. If all values match, React skips the Effect.
2. **The execution sequence on change:** React updates the DOM first. It then runs the cleanup function from the previous render, which closed over the previous props and state, before executing the new setup function with updated values. On unmount, the final cleanup runs once.
3. **What belongs in the array:** developers do not choose dependencies arbitrarily. Every prop, state variable, and local variable read by the Effect from the component body is reactive and must be listed. Non-reactive constants belong outside the component, and independent synchronization tasks belong in separate Effects."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"When `roomId` changes from general to travel, why does the cleanup disconnect from general rather than travel?"**
   Each render pass creates its own setup and cleanup functions, capturing that specific render's props and state through closure. When `roomId` was general, React executed that setup and retained its returned cleanup function. When the user switches to travel, React invokes that retained cleanup before executing the new setup. Because the cleanup closed over general, it disconnects the exact room that its corresponding setup opened. A cleanup must always reverse its own setup.
2. **"What counts as a reactive value? Can I place `ref.current` or `location.pathname` in the dependency array?"**
   Reactive values include props, state, and any variable or function computed inside the component body, because React calculates them during the rendering data flow. Values like `ref.current` or `location.pathname` change outside this flow without scheduling a component render. Because React only evaluates dependency arrays during render passes, placing mutable external values in the array accomplishes nothing. To synchronize with external values like URL pathnames, use `useSyncExternalStore`. State setters and ref objects are stable references, so they may be omitted safely.
3. **"What happens if I silence `exhaustive-deps` and pass an empty array so my Effect runs only once?"**
   The Effect's closure remains permanently locked to the props and state captured during the initial mount. When props or state change later, React compares the empty arrays, detects no difference, and skips re-synchronization. The user interface updates to display new data, but the Effect continues executing with outdated values, creating a stale closure. The official documentation considers suppressing the linter a violation of React's contract. The correct solution is refactoring the code so the Effect no longer reads unnecessary values, such as using an Effect Event.

```tree dir=right caption="Interview summary: the lifecycle of a reactive Effect from mount to unmount."
The lifecycle of a reactive Effect
- +1. Mount [`useEffect` `[roomId, serverUrl]`] | React puts the component into the DOM | React runs **the first setup**, and in development Strict Mode runs **setup, cleanup, setup** to test the cleanup
- +2. Render with the same dependencies [`Object.is` is `true`] | Every item matches the previous render | React **skips the Effect**, and the connection stays open
- +3. Render with a changed dependency [`Object.is` is `false`] | At least one item changed | React runs **the old cleanup** with the old values, then **the new setup** with the new values
- +4. Unmount [`cleanup`] | The component leaves the screen | React runs **the last cleanup** one final time, so nothing stays open
```
