# Lecture 37: Removing Effect Dependencies by Changing the Code

*(How do you stop an Effect from running again without lying to React about what it reads?)*

> INTERVIEW QUESTION | ❱ CORE | How do you remove unnecessary effect dependencies, and when must a dependency stay?

---

## VS | Deleting a dependency vs. changing the code: the deleted value is still read, the changed code no longer reads it

> Every render pass re-executes the component function from top to bottom. Any object literal declared in the component body receives a new memory reference on every render. **You should declare dynamic objects inside the Effect rather than in the component body**. The object ceases to be a reactive dependency, and the Effect re-synchronizes only when an underlying primitive value changes.

Why do React Effects require dependencies? Dependencies establish declarative synchronization between state and external systems.

**Direct imperative control executes commands immediately.** In an imperative event handler, a user action triggers a direct instruction. Clicking a print button calls the browser print command immediately. Cause and effect exist within the exact same function block:

> button clicked → handler runs → `window.print()` called directly

**Declarative synchronization decouples actions from side effects.** Consider a travel dashboard displaying a city selector, a weather forecast panel, an interactive map, and a hotel directory. When the user selects a new city, the change handler does not command each panel directly. The handler simply updates the city state. React re-renders the component, and separate Effects synchronize each external widget to the new city value:

> city selected → handler updates state → component re-renders → Effects observe new city and synchronize

**Declarative data flow connects state to Effects.** The city selector contains no logic regarding forecasts, maps, or hotel queries. Instead, each feature runs an Effect that reads the city state as a dependency. When state updates, React re-renders the component and inspects every declared dependency. Any Effect reading that value detects the update and synchronizes its external system:

* `city` updates → **Weather Effect** detects change → fetches updated forecast
* `city` updates → **Map Effect** detects change → centers coordinates on the city
* `city` updates → **Hotel Effect** detects change → queries matching hotels

This architecture decouples user interactions from side effects. Looking at the selector handler reveals only a state setter. To understand what happens next, you inspect the Effects that declare that state variable as a dependency.

**Three execution scopes in a React component:**

1. Event handlers run strictly in response to specific user interactions, such as button clicks or keystrokes.
2. Effect callbacks run after the browser commits a render, but only when at least one declared dependency changes.
3. The component body executes repeatedly during every render pass.

**The component body runs during every render cycle.** Whenever any state setter receives a new value, React invokes the component function from top to bottom. Any object literal declared directly inside the component body is allocated anew in memory on every render. Even if every property remains identical, the newly created object holds a distinct memory reference in JavaScript. Declaring an object in the component body creates an unstable reference that changes on every render pass.

**How React evaluates object dependencies:** React compares dependencies using referential equality via `Object.is`. It does not compare nested properties or object contents. If an Effect declares an object from the component body as a dependency, every render triggers that Effect. For example, typing into an unrelated text box re-renders the component, creates a new object reference, and causes the Effect to re-run unnecessarily.

**The solution is to declare the object inside the Effect callback.** Because local variables declared inside an Effect are not reactive, the linter no longer requests the object in the dependency array. The Effect then reads only primitive values like strings or numbers from the outer component scope, re-running only when genuine data changes.

### The Same Bug in a Chat

Now observe how this behavior impacts a chat application.

React does not inspect what your Effect does internally. After every committed render pass, React inspects the dependency array and checks whether any value changed. If any dependency changed, React executes the cleanup function from the previous render, followed by the setup function. In a network chat connection, this cleanup and setup sequence drops the active socket connection and opens a new one.

You do not choose dependencies arbitrarily. The exhaustive-deps linter analyzes the Effect callback and requires every reactive value read inside it to appear in the dependency array. The dependency array is not a configuration setting. It is a strict description of the values read by the Effect code.

Here is the problem this lesson addresses. The connection settings are grouped in a single object called `options`. The Effect reads this object, so the linter requires `options` in the dependency array:

```jsx title="The linter asked for options, and the chat reconnects after every letter"
const options = { serverUrl: serverUrl, roomId: roomId };

useEffect(() => {
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, ~[options]~); // The array matches the code, and yet every letter the user types reconnects the chat
```

When the user types `hi` in the message input field, the selected room does not change. Yet the chat drops and reconnects after every keystroke. The official React documentation calls `options` an **unnecessary dependency**: a value in the dependency list whose change should not trigger a re-synchronization.

You need to remove `options` from the dependency array. Developers often consider two approaches to remove it:

```jsx title="Way 1: delete options from the array and silence the linter"
const options = { serverUrl: serverUrl, roomId: roomId };

useEffect(() => {
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, ~[]~); // **WRONG:** eslint-disable-line react-hooks/exhaustive-deps hides options from the linter
```

```jsx title="Way 2: build options inside the Effect"
useEffect(() => {
  const ~options~ = { serverUrl: serverUrl, roomId: roomId }; // Made inside the Effect, so the linter stops asking for it
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, ~[roomId]~); // The linter itself now asks only for roomId
```

Both approaches prevent the chat from reconnecting on every keystroke. While they appear similar, their underlying mechanics are fundamentally different:
1. **Way 1 continues to read `options` from component scope.** The Effect captures the initial `options` reference from the first render. When the user selects a different room, the chat remains trapped in the old room, and the silenced linter can no longer alert you.
2. **Way 2 stops reading an object from the component body.** Declaring `options` inside the Effect makes it a local variable. The linter stops requesting `options` and requests only the primitive `roomId` value.

The official React documentation states this core principle: "**If you want to change the dependencies, change the surrounding code first.**"

The documentation describes Way 2 as proving intent to the linter: "**To remove a dependency, "prove" to the linter that it *doesn't need* to be a dependency.**"

Regarding Way 1, the documentation warns: "By suppressing the linter, you "lie" to React about the values your Effect depends on."

```tree caption="Two ways to get a value out of the dependency array: silence the linter, or change the code so the Effect no longer reads it."
Two ways to get a value out of the dependency array
- !Way 1: delete it and silence the linter | The Effect **still reads the value** | It keeps an **old copy**, and the linter can **no longer warn you**
- +Way 2: change the code first | The Effect **no longer reads a reactive value** there | The linter **stops asking for it** by itself
```

> [!DEFINITION]
> **What is a reactive value?** [REVIEW] A reactive value is any value computed within the render data flow of a component.
> 1. Props, state variables, and local variables calculated from them inside the component body are all reactive values.
> 2. When an Effect reads a reactive value, the exhaustive-deps linter requires it in the dependency array.
> 3. Values declared outside the component at module scope, or inside the Effect callback itself, are not reactive because renders cannot change them.
> 4. State setter functions like `setMessages` and ref objects are stable: React guarantees their identity remains unchanged across renders, so they never trigger Effect re-synchronization (Lesson 35).

### Why a new `options` counts as a change

After every render commit, React compares each dependency against its value from the previous render. React uses `Object.is` comparison, which evaluates equality identically to the strict equality operator in this scenario (Lesson 32).

This behavior stems from standard JavaScript object comparison. Two primitive strings with matching characters are equal. In contrast, two distinct object literals containing identical properties are not equal. You can verify this behavior in the browser console:

```js title="Two objects with the same contents, and two strings with the same text"
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };
console.log(~Object.is(options1, options2)~); // false: two different objects

const roomId1 = 'music';
const roomId2 = 'music';
console.log(~Object.is(roomId1, roomId2)~); // true: the same string
```

> [!DEFINITION]
> **What is an object dependency?** [NEW] An object dependency is an object or array declared in the dependency array. A function listed there is a function dependency.
> 1. Primitive values like strings, numbers, and booleans are compared by their content. Two identical `'music'` strings evaluate as the exact same value.
> 2. Objects and functions are compared by reference identity. Every object literal allocates a new reference, even when its properties match an existing object.
> 3. React documentation explains that in JavaScript, each newly created object or function is considered distinct from all others, regardless of contents.
> 4. An object created during rendering produces a brand-new value on every render, forcing any Effect listing it to re-run after every commit (Lesson 37).

```tree caption="How Object.is compares two strings with the same text and two objects with the same contents."
What `Object.is` compares
- +Two strings with the same text [`'music'` `'music'`] | Compared **by their content** | `Object.is` returns **`true`**: the same value
- !Two objects with the same contents [`options1` `options2`] | Compared by **which object they are** | `Object.is` returns **`false`**: two different values
```

### The Rule of Thumb: must the Effect run again when this value changes?

**Ask one diagnostic question about every dependency: when this value changes, does the user expect the Effect to re-synchronize? If yes, keep it in the array. If no, refactor the code until the Effect stops reading that reactive value.**
- **`roomId`: yes.** The user selected a different room, so the chat must disconnect from the previous room and connect to the new one.
- **A new `options` object after typing: no.** The server and room remain identical. Move the object declaration inside the Effect.
- **A new message added to the conversation: no.** Pass an updater function to the state setter so the Effect avoids reading the message array.

The official React documentation outlines this refactoring workflow in three clear steps:
1. First, you **change the code** of your Effect or how your reactive values are declared.
2. Then, you follow the linter and adjust the dependencies to **match the code you have changed.**
3. If you are not satisfied with the revised dependency list, you **return to the first step**.

The documentation compares this process to solving an equation: you determine the target dependency list, such as `[roomId]`, and structure your code to produce that list naturally.

Experienced engineers avoid three common dependency mistakes:
1. **Deleting the dependency and silencing the linter.** The Effect retains a stale closure over initial values, producing silent runtime bugs.
2. **Assuming an object with identical properties is the same dependency.** The object reference is new on every render, triggering unwanted Effect executions.
3. **Removing a required dependency like `roomId`.** The Effect stops responding to state changes, leaving the chat stuck in the initial room when the user switches rooms.

The rest of this lesson demonstrates each scenario in a working chat room application.

## SECTION | A Chat Room with a Message Field

Our demonstration page is the chat room from Lessons 35 and 36. A dropdown menu selects the active room. A heading displays the current room name. Arriving messages appear in a list below the heading, and an `<input>` field at the bottom accepts new messages.

When the application loads in development mode, React Strict Mode executes an initial setup, cleanup, and setup cycle, logging three initial lines in the console (Lesson 32):

```page width=text caption="The chat room when the page opens: the menu is on general, and the message field is empty."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
form:
  field:  |
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

The user performs three distinct interactions, expecting specific outcomes:
1. **The user types `hi` in the message field.** Characters appear in the input field. The active socket connection remains completely untouched.
2. **The user picks `travel` in the menu.** The heading updates. The chat disconnects from the general room and establishes a connection to the travel room.
3. **The user waits.** Simulated incoming messages arrive roughly every three seconds, appending to the message list without disturbing the connection.

Only the second interaction should touch the network connection. Message arrival logic is integrated in Principle 3.

The connection utility is the `createConnection` function from Lesson 36, modified to accept connection options in a single configuration object. Many real-world networking libraries structure connection parameters this way:

```js title="src/chat.js"
export function createConnection(~{ serverUrl, roomId }~) { // One object now, instead of two separate arguments
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey');
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

Incoming messages are chosen randomly, so a live session alternates between `hey` and `lol`. The page previews below illustrate a typical run.

The parent `App` component stores the selected room in state, manages the room dropdown, and passes `roomId` downward as a prop (Lesson 20):

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');

  return (
    <main>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      ~<ChatRoom roomId={roomId} />~ {/* The room arrives in ChatRoom as a prop */}
    </main>
  );
}
```

The connection helper and `App` component remain identical throughout every principle. Every refinement in this lesson occurs inside `ChatRoom`:

```files title="chat-room: File Explorer" caption="How the chat room project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  chat.js | external helper | Exports `createConnection({ serverUrl, roomId })` with `connect()`, `disconnect()`, and `on()`
  App.jsx | parent | Keeps `roomId` in state and renders `ChatRoom`
  components/
    ChatRoom.jsx | Effect | Connects to `roomId` in an Effect, keeps the message field, and shows the messages that arrive
```

**PRINCIPLES:** You never pick dependencies independently. The code dictates them. Four principles guide proper dependency management:
1. **Principle 1: An Object Made in the Component Body Is New on Every Render.** Declaring an object in render scope forces the chat to reconnect on every keystroke.
2. **Principle 2: Build the Object Inside the Effect.** Relocating object creation eliminates the reactive object dependency, leaving only the primitive `roomId` string.
3. **Principle 3: An Updater Function Reads No State.** Passing an updater function allows appending messages without reading state, keeping incoming messages from reconnecting the chat.
4. **Principle 4: A Dependency Stays When Its Change Must Run the Effect Again.** The `roomId` dependency remains because switching rooms requires establishing a new connection.

---

## PRINCIPLE | options in the component body: a new object on every render reconnects the chat

> [!PRINCIPLE]
> **Principle 1: Object Dependencies: An Object Made in the Component Body Is New on Every Render**
>
> *An object or function declared in the component body receives a new memory reference on every render, forcing any Effect that lists it to re-run after every render even when its properties remain identical.*
>
> React evaluates each dependency using `Object.is`. While primitive strings and numbers are compared by value, every new object literal is treated as a distinct reference. Every character typed into the message input triggers a component re-render, creating a new `options` reference and forcing React to disconnect and reconnect the chat. An object declared once outside the component retains the same reference across all render passes.
>
> **DO THIS:**
> ```jsx
> const options = { serverUrl: 'https://localhost:1234', roomId: 'music' };
>
> function ChatRoom() {
>   useEffect(() => {
>     const connection = createConnection(options);
>     connection.connect();
>     return () => connection.disconnect();
>   }, ~[]~); // options is made once, outside the component: typing never reconnects
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ChatRoom({ roomId }) {
>   const options = { serverUrl: serverUrl, roomId: roomId };
>   useEffect(() => {
>     const connection = createConnection(options);
>     connection.connect();
>     return () => connection.disconnect();
>   }, ~[options]~); // **WRONG:** a new options on every render reconnects the chat after every letter
> }
> ```

React re-executes the component function from top to bottom on every render. Every statement inside the component body runs again, including object declarations:

```jsx title="A line in the component body runs on every render"
const options = ~{ serverUrl: serverUrl, roomId: roomId }~; // The curly braces build a brand-new object every time
```

The `options` object from the previous render and the `options` object from the current render share identical properties. However, because each object literal expression allocates a new object in memory, `Object.is` returns `false`. React documentation emphasizes: "A new `options` object is created from scratch on every re-render of the `ChatRoom` component."

### The chat page with `options` in the component body

Here is `ChatRoom` with `options` declared in the component body. The component also manages the text input via local `message` state (Lesson 20):

```jsx title="src/components/ChatRoom.jsx" bad="9,15"
import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const ~options~ = { serverUrl: serverUrl, roomId: roomId }; // A new object on every render

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, ~[options]~); // **WRONG:** a new options after every render reconnects the chat

  return (
    <section>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => ~setMessage(e.target.value)~} // Every letter the user types renders ChatRoom again
      />
    </section>
  );
}
```

The user types `hi` in the text box. The interface appears responsive: characters appear in the field, and the room heading remains unchanged. The defect is visible only in the browser console, which logs a complete disconnect and reconnect cycle for every typed character:

```page width=text caption="After the user types hi with options in the component body: the page looks right, and the Console shows one disconnect and one connect for each letter."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
form:
  field:  | hi
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

Declaring `options` in the component body causes every keystroke to sever and recreate the chat connection. Here is the exact sequence of events for a single keystroke:
1. The user types `h`. The input change handler calls `setMessage('h')`, scheduling a re-render of `ChatRoom`.
2. React re-executes `ChatRoom` from top to bottom. The `options` declaration allocates a brand-new object in memory.
3. React compares the new `options` reference to the previous render using `Object.is`. Because memory references differ, `Object.is` returns `false`.
4. React runs the previous render cleanup function, severing the active socket connection and logging the disconnection.
5. React runs the new Effect setup function, opening a new socket connection and logging the reconnection.

The official React documentation points out the flaw from the user perspective: "From the user's perspective, this should not affect the chat connection."

```tree dir=right caption="Why one letter typed in the message field reconnects the chat when options is made in the component body."
What one letter in the message field does
- +1. The user types a letter [`setMessage`] | `ChatRoom` **renders again** from the top
- +2. A new `options` object [`options`] | Same server, same room, but a **different object**
- !3. React compares with `Object.is` | The answer is **`false`** | React runs the **cleanup and the setup**: the chat **reconnects**
```

The linter detects this issue immediately. With `[options]` in the dependency array, the linter no longer flags a missing dependency. Instead, it warns that the object changes Effect dependencies on every render and advises moving the object declaration inside the Effect. Principle 2 carries out this exact refactoring.

React documentation warns about this issue in bold text: "**Object and function dependencies can make your Effect re-synchronize more often than you need.**"

### A function in the component body does the same

Declaring a helper function inside the component body introduces the exact same flaw:

```jsx title="A createOptions function in the component body" bad="8"
function ~createOptions~() { // A new function on every render of ChatRoom
  return { serverUrl: serverUrl, roomId: roomId };
}

useEffect(() => {
  const options = createOptions();
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, ~[createOptions]~); // **WRONG:** a new function after every render reconnects the chat
```

In JavaScript, functions are objects. Declaring a function inside a component creates a new function reference during each render pass. Listing that function in the dependency array causes the Effect to re-run after every single commit.

Creating functions or objects during render is not inherently problematic. The React documentation clarifies: "By itself, creating a function from scratch on every re-render is not a problem. You don't need to optimize that." The defect emerges only when that unstable reference is listed in an Effect dependency array.

---

## PRINCIPLE | options inside the Effect: only the string roomId stays in the array

> [!PRINCIPLE]
> **Principle 2: Moving the Object: options Built Inside the Effect Leaves Only roomId**
>
> *Declare dynamic objects or functions that depend on props or state directly inside the Effect, and static values outside the component, eliminating non-reactive references so only primitive values like roomId remain in the dependency array.*
>
> You do not manually remove `options` from the dependency array. You relocate its declaration into the Effect callback, allowing the linter to narrow the required dependencies automatically. Values declared inside an Effect are not reactive, and the primitive string `roomId` is compared by value, ensuring the chat reconnects only when the user selects a different room. When an object arrives via props, extract its primitive values before the Effect and declare those primitives as dependencies.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const ~options~ = { serverUrl: serverUrl, roomId: roomId }; // Made inside the Effect: not reactive
>   const connection = createConnection(options);
>   connection.connect();
>   return () => connection.disconnect();
> }, [roomId]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const options = { serverUrl: serverUrl, roomId: roomId };
> useEffect(() => {
>   const connection = createConnection(options);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[options]~); // **WRONG:** options is made in the component body, so every letter reconnects the chat
> ```

### VS | `options` in the component body vs. `options` inside the Effect: the same line, only one reconnects on every letter

Principle 1 identified the root cause: the line declaring `options` sits directly in the component body. Relocating that declaration inside the Effect resolves the issue:

```jsx title="With options in the component body"
const options = { serverUrl: serverUrl, roomId: roomId };

useEffect(() => {
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, ~[options]~); // A new object after every render: the chat reconnects on every letter
```

```jsx title="With options inside the Effect"
useEffect(() => {
  const ~options~ = { serverUrl: serverUrl, roomId: roomId }; // Made inside the Effect: no longer a reactive value
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, ~[roomId]~); // Only a string: the chat reconnects only when the room changes
```

Both implementations establish a connection to the general room on initial load. Both reconnect when the user selects `travel`. However, only the first implementation disconnects and reconnects when typing in the message field.

Why does moving the declaration solve the problem? Any variable declared inside an Effect is a local block-scoped variable rather than a reactive value from the component scope (Lesson 35). The official React documentation explains: "Now that `options` is declared inside of your Effect, it is no longer a dependency of your Effect."

The linter now inspects what the Effect reads from the outer component scope. The only reactive value referenced is `roomId`. If you omit `roomId` from the dependency array, the linter correctly flags `roomId` as a missing dependency.

This illustrates what proving your intent to the linter means. You do not disable or override the lint rule. You restructure the surrounding code, and the linter updates its requirements automatically.

### Why `roomId` causes no trouble in the array

The `roomId` value is a primitive string. JavaScript evaluates primitive strings by their character contents, as demonstrated by our earlier comparison of `'music'` strings.

As long as the user remains in the general room, every render provides the exact same string value, `'general'`. React detects no change and keeps the existing connection open. When the user selects `travel`, the string value changes, prompting React to disconnect from the previous room and connect to the new one.

The React documentation recommends three strategies for unstable dependencies. You can move them outside the component, move them inside the Effect, or extract primitive values from them.

### Static objects go above the component, dynamic ones inside the Effect

Where should you place an object declaration? The decision depends on whether the object reads reactive values:
1. **A static object** does not depend on any props or state. Declare it outside the component function at module scope. JavaScript allocates the object once when the module loads, so its reference never changes across renders, allowing an empty dependency array `[]`.
2. **A dynamic object** depends on reactive values that can change across renders, such as the `roomId` prop. Declare it inside the Effect callback so the dependency array lists only the underlying values it reads, such as `[roomId]`.

The React documentation demonstrates the static pattern using a chat room permanently set to the music room:

```jsx title="A static options object above the component"
const ~options~ = { serverUrl: 'https://localhost:1234', roomId: 'music' }; // Made once, when the file loads

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, ~[]~); // options is not reactive, so the array is empty
}
```

In our application, the dropdown menu allows the user to switch rooms, so `options` reads the dynamic `roomId` prop. Because `options` is dynamic, it belongs inside the Effect callback.

```tree caption="Where an object dependency goes: a static object above the component, a dynamic object inside the Effect."
Where to make the object the Effect reads
- +Static: depends on no props and no state [`roomId: 'music'`] | Make it **above the component**, once | The array is **empty**
- +Dynamic: depends on a prop or state [`roomId: roomId`] | Make it **inside the Effect** | The array lists only **`roomId`**
```

Helper functions follow the exact same rule. If you define a helper function like `createOptions`, declare it inside the Effect callback. React documentation confirms: "As long as you also declare them *inside* your Effect, they're not reactive values, and so they don't need to be dependencies of your Effect."

### The chat page with `options` inside the Effect

Here is the refactored `ChatRoom` component. Only the location of the `options` declaration and the dependency array have changed:

```jsx title="src/components/ChatRoom.jsx" startLine="6" good="5,9"
export default function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ~options~ = { serverUrl: serverUrl, roomId: roomId }; // Moved inside the Effect
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // The only reactive value the Effect reads

  return (
    <section>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </section>
  );
}
```

When the user types `hi` in the message input, the characters appear immediately, and the console records no new connection activity:

```page width=text caption="After the user types hi with options inside the Effect: the Console still shows only the three lines of the page opening."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
form:
  field:  | hi | good
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

When the user selects `travel` from the room dropdown, the chat disconnects from the general room and connects to the travel room. The input field still displays `hi` because `ChatRoom` remains mounted and preserves its internal state:

```page width=text caption="After the user picks travel: one disconnect from general and one connect to travel."
form:
  select: Choose the chat room: | travel
heading: Welcome to the travel room!
form:
  field:  | hi
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:1234...
```

The React documentation confirms both outcomes. Regarding typing: "Thanks to this fix, the chat no longer re-connects if you edit the input." Regarding room selection: "it *does* re-connect when you change the `roomId` dropdown, as you would expect."

### When `options` arrives as a prop

Occasionally an object is passed down as a prop, making it impossible to move its declaration inside the child Effect. A React documentation challenge highlights this scenario:
1. The parent component builds an `options` object from local state and passes it to `ChatRoom` as a prop.
2. `ChatRoom` reads the prop inside an Effect and declares `[options]` in its dependency array.
3. The user clicks a theme toggle in the parent component, updating only the visual theme.
4. The parent component re-renders and constructs a new `options` object reference, triggering an unnecessary reconnect in the child. The documentation notes: "Your Effect is re-running because it depends on the `options` object."

Because `ChatRoom` cannot move a prop declaration into its Effect, it extracts primitive values from the object before the Effect and lists those primitives as dependencies:

```jsx title="Reading primitive values out of an options prop"
function ChatRoom({ options }) {
  const { roomId, serverUrl } = ~options~; // Reads two strings out of the object, outside the Effect

  useEffect(() => {
    const connection = createConnection({ roomId: roomId, serverUrl: serverUrl });
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId, serverUrl]~); // Two strings: a new options with the same room does not reconnect
}
```

The documentation explains: "If an object is re-created unintentionally by the parent component, the chat would not re-connect. However, if `options.roomId` or `options.serverUrl` really are different, the chat would re-connect."

Function props behave similarly. If a parent passes a function prop like `getOptions`, call it outside the Effect, extract the primitive values from its return value, and list those primitives.

The documentation adds one important requirement: this pattern is safe only for pure functions because pure functions can execute during rendering without side effects (Lesson 14). When you control the parent component, the cleanest solution is to pass primitive props like `roomId` and `serverUrl` directly.

---

## PRINCIPLE | setMessages with an updater function: new messages never reconnect the chat

> [!PRINCIPLE]
> **Principle 3: Updater Functions: Reading No State Removes the State Dependency**
>
> *When an Effect updates state based on previous state, pass an updater function to the state setter so the Effect avoids reading the state variable directly, removing it from the dependency array.*
>
> Reading a state array directly inside an Effect forces you to include that array as a dependency, causing every state update to trigger an Effect re-synchronization. Silencing the linter stops the reconnection loop but traps the Effect in a stale closure over initial render state, overwriting previous data. Passing an updater function eliminates the state read entirely. React supplies the current state at execution time, allowing the dependency array to remain clean without lint suppressions.
>
> **DO THIS:**
> ```jsx
> connection.on('message', msg => {
>   setMessages(~msgs => [...msgs, msg]~); // React passes the current list: every message is kept
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> connection.on('message', msg => {
>   setMessages(~[...messages, msg]~); // **WRONG:** with the linter silenced, messages stays the empty list of the first render
> });
> ```

### VS | Reading `messages` vs. an updater function: both add the message, only one makes `messages` a dependency

Now the chat room displays incoming messages. The Effect registers an event callback on the connection via its `on` method, and the connection invokes that callback whenever a message arrives (Lesson 36). Inside that callback, each incoming message is appended to the `messages` state array. There are two ways to write that update:

```jsx title="Reading messages, and passing an updater function"
setMessages(~[...messages, msg]~); // Reads messages: the Effect now depends on messages
setMessages(~msgs => [...msgs, msg]~); // Never reads messages: React passes the current list as msgs
```

Both lines append `msg` to the end of the message list. However, the first line reads the `messages` state variable, requiring the linter to request `messages` in the dependency array. The second line reads only the incoming `msg` parameter, avoiding any reference to the `messages` state variable.

Developers frequently attempt two alternative approaches before discovering updater functions. Each approach introduces a distinct defect.

### First try: `messages` in the array reconnects the chat on every message

The developer adds `messages` state and renders a message list under the heading. Because the Effect reads `messages`, the developer follows the linter and includes `messages` in the dependency array:

```jsx title="src/components/ChatRoom.jsx" startLine="6" bad="13"
export default function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { serverUrl: serverUrl, roomId: roomId };
    const connection = createConnection(options);
    connection.on('message', msg => {
      setMessages(~[...messages, msg]~); // Reads the messages of this render
    });
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId, messages]~); // **WRONG:** every new message is a new array, so the chat reconnects

  return (
    <section>
      <h1>Welcome to the {roomId} room!</h1>
      <ul>
        {messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </section>
  );
}
```

Index keys can cause rendering issues when items reorder (Lesson 18). Here, items only append to the end and duplicate text can occur, making index keys acceptable for this demonstration.

Two messages arrive. The list appears to render correctly. However, the console reveals a severe defect:

```page width=text caption="After two messages with messages in the array: the list shows both, and the Console shows a reconnect after each one."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
line: hey
line: lol
form:
  field:  |
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

Including `messages` in the dependency array forces the chat to disconnect and reconnect on every incoming message. This triggers the exact same failure chain seen with object references in Principle 1:
1. A message arrives, and the listener calls `setMessages` with a newly constructed array.
2. `ChatRoom` re-renders. The new array holds a distinct memory reference, so `Object.is` evaluates to `false`.
3. React runs the Effect cleanup function, disconnecting the socket, and then runs setup to connect again.

The React documentation emphasizes the poor user experience: "every new message will make the chat re-connect. The user would not like that!"

### Second try: with the linter silenced, the list never grows past one message

To stop the reconnection loop, the developer removes `messages` from the array and suppresses the linter using a comment (Lesson 36):

```jsx title="src/components/ChatRoom.jsx" startLine="10" bad="9"
  useEffect(() => {
    const options = { serverUrl: serverUrl, roomId: roomId };
    const connection = createConnection(options);
    connection.on('message', msg => {
      setMessages(~[...messages, msg]~); // Reads the messages of the first render: always the empty list
    });
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // **WRONG:** eslint-disable-line react-hooks/exhaustive-deps hides messages from the linter
```

When the first message arrives, the list displays `hey`:

```page width=text caption="With the linter silenced, after the first message: the list shows hey."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
line: hey
form:
  field:  |
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

Three seconds later, the second message arrives. The message list does not grow. It displays only `lol`, and the initial `hey` message vanishes:

```page width=text caption="With the linter silenced, after the second message: hey is gone, and the list shows only lol."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
line: lol | bad
form:
  field:  |
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

Suppressing the linter prevents socket reconnections, but causes each incoming message to overwrite the previous one. Here is why:
1. The Effect executed after the initial render, when `messages` held its initial empty array `[]`.
2. Because the dependency array is `[roomId]` and `roomId` never changed, React never executed a new setup function.
3. The callback held by the connection object remains trapped in the closure of the initial render (Lesson 15).
4. Every incoming message invokes `setMessages` using the initial empty array plus the single new message.

The React documentation demonstrates the identical bug using a timer counter: when an Effect increments a counter closure without declaring dependencies, the counter remains stuck at `1` permanently.

### The fix: an updater function never reads `messages`

The proper solution is an updater function (Lesson 16). Instead of referencing `messages` directly, the Effect passes a callback function to the state setter. React invokes this callback with the most current state:

```jsx title="src/components/ChatRoom.jsx" startLine="10" good="5,9"
  useEffect(() => {
    const options = { serverUrl: serverUrl, roomId: roomId };
    const connection = createConnection(options);
    connection.on('message', msg => {
      setMessages(~msgs => [...msgs, msg]~); // React passes the current list as msgs
    });
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // messages is not read, so it is not a dependency
```

The React documentation points out: "**Notice how your Effect does not read the `messages` variable at all now.**"

Where does the `msgs` parameter come from? React provides it automatically during state reconciliation. The documentation explains: "React puts your updater function in a queue and will provide the `msgs` argument to it during the next render." You can choose any parameter name for this argument.

What about `setMessages`? The linter does not require state setters in dependency arrays because React guarantees their identity remains stable across all render cycles (Lesson 35). The documentation notes: "Stable values aren't reactive, so you may omit them from the list. Including them is allowed".

Three messages arrive. The list preserves all three messages, and the console records no reconnection logs after the initial page load:

```page width=text caption="With the updater function, after three messages: the list keeps all three, and the Console shows no reconnect."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
line: hey | good
line: lol | good
line: hey | good
form:
  field:  |
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

The silenced version and the updater version both specify `[roomId]` as their dependency array, and both keep the connection open. However, their behaviors differ completely:
1. **The silenced version continues reading `messages` from render scope.** It reads the empty array from the initial render forever.
2. **The updater version avoids reading `messages` entirely.** React provides the up-to-date message array directly to the updater callback.

```tree caption="Three ways to add an arriving message: list messages, silence the linter, or pass an updater function."
Three ways to add a message to `messages` inside the Effect
- !List `messages` in the array [`messages`] | The list **grows correctly** | Every message **reconnects the chat**
- !Silence the linter [`eslint-disable-line`] | The chat **stays connected** | The list **shows only the newest message**
- +Pass an updater function [`msgs`] | The Effect **never reads `messages`** | The chat stays connected, and the list **keeps every message**
```

---

## PRINCIPLE | roomId: it stays, because picking a room must reconnect the chat

> [!PRINCIPLE]
> **Principle 4: Required Dependencies: roomId Stays Because Picking a Room Must Reconnect**
>
> *A dependency must remain in the array whenever its change signifies that the external synchronization must restart, and it should be removed only by refactoring the code so the Effect no longer reads a reactive value from the component scope.*
>
> Every entry in the dependency array answers whether changing that value should restart the external system. For `roomId`, the answer is yes because selecting a new room requires connecting to a different chat channel. For keystrokes or incoming messages, the answer is no, so we refactor the code until the Effect stops reading those values from render scope. Deleting a required dependency from the array conceals the dependency from the linter without fixing the underlying synchronization contract.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const options = { serverUrl: serverUrl, roomId: roomId };
>   const connection = createConnection(options);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[roomId]~); // Picking another room reconnects the chat to that room
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const options = { serverUrl: serverUrl, roomId: roomId };
>   const connection = createConnection(options);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[]~); // **WRONG:** with the linter silenced, the chat stays in general after the user picks travel
> ```

### Read the final Effect value by value

Following Principles 2 and 3, the dependency array contains exactly one value:

```jsx title="The final Effect in src/components/ChatRoom.jsx" startLine="10"
  useEffect(() => {
    const options = { serverUrl: serverUrl, roomId: ~roomId~ }; // The only reactive value the Effect reads
    const connection = createConnection(options);
    connection.on('message', msg => {
      setMessages(msgs => [...msgs, msg]);
    });
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // Changes only when the user picks another room
```

Examine every identifier referenced by the Effect to confirm whether it belongs in the dependency array:
1. **`roomId`** is a reactive prop read inside the Effect. It changes when the user switches rooms, which requires reconnecting. It stays in the array.
2. **`serverUrl`** is a static constant declared at module scope outside the component. It cannot change across renders and is not reactive.
3. **`options`** is declared locally inside the Effect callback. It is not reactive, as established in Principle 2.
4. **`messages`** is not referenced in the Effect. The updater function receives `msgs` dynamically from React, as established in Principle 3.
5. **`setMessages`** is a state setter function with a stable identity guaranteed by React across all renders.
6. **`message`** represents the text inside the input field and is never referenced by the Effect.

Typing a letter and selecting a different room both update state, and both trigger a component re-render. However, from the user perspective, their meanings differ fundamentally. Typing a letter edits message text without altering the active conversation. Selecting a new room requests a completely different chat channel. Consequently, only `roomId` belongs in the dependency array.

The React documentation recommends reviewing dependencies after every refactoring step: "Every time you adjust the Effect's dependencies to reflect the code, look at the dependency list. Does it make sense for the Effect to re-run when any of these dependencies change?" For `roomId`, the answer is yes. The documentation confirms: "It is important to declare it as a dependency!"

```tree caption="Which values stay in the final array, and why each of the others is not there."
The values the final Effect touches
- +Stays in the array [`roomId`] | A prop **read inside the Effect** | Picking a room **must reconnect** the chat
- +Not reactive [`serverUrl` `options`] | Made **above the component** or **inside the Effect** | Never a dependency
- +Not read [`messages`] | The updater function reads **`msgs`** | Never a dependency
- +Stable [`setMessages`] | A **`set` function** from `useState` | The linter **never asks** for it
```

### VS | `roomId` moved above the component vs. `roomId` deleted from the array: both end with an empty array, only one tells the truth

The `roomId` dependency can legitimately leave the array in one specific scenario: when the room is constant and the code reflects that reality. Compare two ways to produce an empty dependency array:

```jsx title="With roomId moved above the component"
const ~roomId~ = 'music'; // Outside the component: not reactive, and the room never changes

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection({ serverUrl: serverUrl, roomId: roomId });
    connection.connect();
    return () => connection.disconnect();
  }, []);
}
```

```jsx title="With roomId deleted from the array"
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection({ serverUrl: serverUrl, roomId: roomId });
    connection.connect();
    return () => connection.disconnect();
  }, ~[]~); // **WRONG:** the linter reports a missing dependency: 'roomId'
}
```

While both examples specify an empty dependency array, their technical validity differs completely:
1. **With `roomId` moved above the component**, the Effect reads a static constant that never changes. The linter agrees with the empty array. This architecture fits an application permanently bound to a single room.
2. **With `roomId` deleted from the array**, the Effect continues reading a dynamic prop that changes across renders. The linter flags `roomId` as a missing dependency.

If you silence that lint warning, the user interface heading updates to the travel room while the socket remains connected to the general room (Lesson 35).

### Five questions for an unnecessary dependency

The React documentation outlines three primary reasons developers seek to remove dependencies:
1. You might want to re-execute different parts of your Effect under different conditions.
2. You might want to read the latest value of a dependency without reacting to its changes.
3. A dependency might change unintentionally because it is an object or a function.

For each unwanted dependency, the documentation provides five diagnostic questions. Each answer maps directly to a specific refactoring pattern:
1. **"Should this code move to an event handler?"** Logic triggered by a specific user interaction, such as submitting a form, belongs in an event handler (Lesson 34).
2. **"Is your Effect doing several unrelated things?"** Split the logic into separate Effects, each managing its own independent dependency array (Lesson 35).
3. **"Are you reading some state to calculate the next state?"** Pass an updater function to the state setter, as demonstrated with `messages` in Principle 3.
4. **"Do you want to read a value without "reacting" to its changes?"** Extract the read into an Effect Event using `useEffectEvent` (Lesson 36).
5. **"Does some reactive value change unintentionally?"** If an object or function changes on every render, relocate it inside the Effect or extract its primitive values.

Suppressing the linter is never a recommended solution. The React documentation emphasizes: "We recommend treating the dependency lint error as a compilation error."

The first question prevents a common architecture mistake involving form submissions:
1. When a user submits a form, code sets a `submitted` state flag to `true`. An Effect watching `[submitted]` sends data and displays a toast notification.
2. Later, the notification reads the application theme, prompting the developer to add `theme` to the dependency array.
3. Now, if the user submits the form and subsequently switches themes, the Effect re-runs and displays the same notification a second time.

The documentation identifies the underlying flaw: "**The problem here is that this shouldn't be an Effect in the first place.**"

Moving the submission logic directly into the form submit handler eliminates the Effect entirely, resolving the dependency problem permanently.

---

## All 4 Principles Together

### The complete code

The connection utility and `App` component remain identical to their initial implementations. Here is the refactored `ChatRoom` component featuring `options` declared inside the Effect, the updater function, and a minimal dependency array:

```jsx title="src/components/ChatRoom.jsx"
import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const ~serverUrl~ = 'https://localhost:1234'; // Above the component: not reactive

export default function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ~options~ = { serverUrl: serverUrl, roomId: roomId }; // Principle 2: built inside the Effect
    const connection = createConnection(options);
    connection.on('message', msg => {
      setMessages(~msgs => [...msgs, msg]~); // Principle 3: the Effect never reads messages
    });
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // Principle 4: only a change of room reconnects the chat

  return (
    <section>
      <h1>Welcome to the {roomId} room!</h1>
      <ul>
        {messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <input
        value={message}
        onChange={e => ~setMessage(e.target.value)~} // Principle 1: typing renders ChatRoom, and the chat stays connected
      />
    </section>
  );
}
```

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* Runs one extra setup and cleanup of each Effect in development */}
    <App />
  </StrictMode>
);
```

### How React calls the components, and when the Effect runs

When the application loads, React renders `App`, followed by `ChatRoom`. After the browser commits the render, the Effect establishes a connection to the general room:

```tree dir=right caption="What runs when the chat page opens in development."
What runs when the page opens
- +1. `main.jsx` [`<StrictMode>`] | Mounts `App` inside **Strict Mode**
- +2. `App` [`roomId`] | Renders the menu on **general** and the `ChatRoom` tag
- +3. `ChatRoom` [`messages` `message`] | Renders the heading, the **empty list**, and the **empty message field**
- +4. The Effect [`roomId`] | After the commit, **connects to general**; Strict Mode adds **one extra cleanup and setup**
```

Here is a full user session with the completed implementation. The page loads, the user types `hi`, two messages arrive, and the user switches to the travel room:

```page width=text caption="The final chat after the user types hi, two messages arrive, and the user picks travel: one reconnect, for the new room only."
form:
  select: Choose the chat room: | travel
heading: Welcome to the travel room!
line: hey
line: lol
form:
  field:  | hi
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:1234...
```

The two messages from the general room remain on screen because our demonstration code does not clear the message state array on room transitions.

### What the user does, and what the code changed

| What the user does | The broken code | The change in the code | What the user sees now |
| :--- | :--- | :--- | :--- |
| **Types a letter** | `options` in the component body, with `[options]` | `options` inside the Effect, with `[roomId]` | The letter appears, and the chat stays connected |
| **Waits for a message** | The Effect reads `messages`, with `[roomId, messages]` | An updater function, with `[roomId]` | The message is added, and the chat stays connected |
| **Waits, with the linter silenced** | The Effect reads `messages`, with `[roomId]` and the comment | An updater function, with no comment | The list keeps every message instead of only the newest |
| **Picks another room** | Nothing to fix: `roomId` must stay | `roomId` stays in the array | The chat leaves the old room and connects to the new one |

The central lesson of this chapter remains: **You never choose dependencies independently. The code dictates them. To remove an unwanted dependency, refactor the code so the Effect no longer reads that reactive value.**

---

## For the Interview

> **The Interview Question:** How do you remove unnecessary effect dependencies, and when must a dependency stay?

### How to Answer Clearly in 30 Seconds

"I never pick dependencies independently. The dependency array is a strict contract listing every reactive value read by the Effect, verified by the linter. To remove a dependency, I refactor the code so the Effect no longer reads that reactive value from component scope. Three strategies solve most scenarios:
1. **Relocate objects and functions**: values declared in render scope receive new references on every render. I declare static values at module scope, move dynamic values inside the Effect, or extract primitive properties.
2. **Use updater functions**: when an Effect updates state based on previous state, passing an updater function like `msgs => [...msgs, msg]` eliminates reading that state variable.
3. **Move logic where it belongs**: place user interaction logic into event handlers, split unrelated tasks into separate Effects, or use Effect Events to read values without reacting.

A dependency must stay whenever its change represents a genuine synchronization trigger, such as switching chat rooms. I never suppress the linter because suppression creates stale closures and silent bugs."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does an `options` object re-run the Effect when its contents did not change?"**
   React compares dependencies using `Object.is` referential equality. Primitive values like strings and numbers are compared by value, but objects, arrays, and functions are compared by memory reference.
   Every object literal declared in the component body allocates a new reference during each render pass.
   Even when properties remain identical, `Object.is` returns `false` between renders.
   The Effect concludes a dependency changed and re-runs cleanup and setup. The solution is declaring the object inside the Effect or outside the component so the array tracks only primitive values like `roomId`.
2. **"Can an object in the dependency array cause an infinite loop?"**
   An object dependency causes an infinite loop only when the Effect also triggers a state update.
   React documentation notes that infinite render loops require two conditions: the Effect updates state, and that state update causes a re-render that changes the Effect dependencies.
   In our chat application, the Effect with `[options]` does not update state, so it executes once per render and halts.
   If that Effect also called a state setter with a new object or value on every run, an infinite loop would occur. Each Effect execution would schedule a render, and that render would create a new `options` reference. The Effect would fire endlessly until React throws the error `Maximum update depth exceeded`.
3. **"What if the object comes from a parent as a prop, and you cannot move it?"**
   Extract the primitive properties outside the Effect during render, such as `const { roomId, serverUrl } = options;`, and declare `[roomId, serverUrl]` in the dependency array. An unrelated parent re-render then does not trigger the Effect unless the underlying primitive values change.
   For pure function props, invoke the function during render to extract primitive values. When possible, refactor the parent component to pass primitive props directly. React documentation reserves `useMemo` and `useCallback` as optimization tools for cases where props cannot be split (Lessons 56 and 57).

```tree dir=right caption="Interview summary: how to remove an unnecessary dependency, and when a dependency must stay."
Removing a dependency vs. keeping it
- +Removable: the code can stop reading it [`options` `messages`] | **Change the code**: move the object, or pass an updater function | The linter **stops asking** for it, with **no comment**
- +Must stay: its change must run the Effect again [`roomId`] | The user **picked another room** | The chat **must reconnect**
- !Never: delete it and silence the linter | The Effect **keeps stale values** | The linter **can no longer warn you**
```
