# Lecture 36: Separating Events from Effects with useEffectEvent

*(How can an Effect read a value without running again every time that value changes?)*

> INTERVIEW QUESTION | ❱ CORE | How do you keep non-reactive values from re-running an effect?

---

## VS | `useEffect` vs. `useEffectEvent`: the Effect runs again when a value changes, the Effect Event only reads it

> An Effect frequently needs to read the latest prop or state without restarting its synchronization process whenever that value changes. **You extract non-reactive reads into a function created with `useEffectEvent`**. That function always accesses the latest committed props and state, allowing the Effect to remain synchronized only with the values that truly trigger it.

In React, an Effect synchronizes a component with an external system. By default, every reactive value read inside an Effect must be declared in its dependency array. Whenever any listed dependency changes, React cleans up the previous synchronization and starts a new one. This behavior is ideal when an external resource must track changing data, such as connecting to a different chat room when the selected room changes.

However, an Effect often reads secondary data that has nothing to do with why the synchronization runs. Common examples include checking a notification mute switch, reading the active color theme, or inspecting cart items when logging a page visit. If you read a secondary value directly inside the Effect, the linter forces you to add it to the dependency array. Changing that secondary setting then unnecessarily tears down and restarts the entire external connection.

Consider a chat room with a Mute notifications checkbox. When a new message arrives, the application plays an alert sound unless the user ticked Mute. If the user ticks Mute, should the chat drop its socket connection and connect again? No. Only the alert sound should stop. The network connection depends on the room, while the sound depends on the checkbox setting.

**Why:** If you read the checkbox state directly inside `useEffect`, the linter requires you to list it in the dependency array. Here is what happens when the user ticks Mute:

> User ticks Mute → state updates `muted: true` → component re-renders → React detects changed dependency → cleanup disconnects socket → setup connects socket again

Every toggle of the Mute checkbox disconnects from the chat server and reconnects from scratch, simply to silence an audio alert. The Effect restarts for a value it only needs to read at the exact moment a message arrives. You must extract the mute check into an Effect Event using `useEffectEvent`. The Effect then depends exclusively on the room id, while reading the latest mute setting on demand.

### Two Things the User Does

Consider a chat application with selectable rooms. A dropdown menu allows the user to switch rooms, and a checkbox toggles notification sounds. The user performs two routine actions with completely different expectations:
1. **The user picks another room.** The application leaves the old room and connects to the new room.
2. **The user ticks Mute notifications.** The notifications stop. Everything else stays unchanged, including the active room and its open network connection.

In plain JavaScript, managing this separation is simple. You establish the connection once. The message event handler reads the `muted` variable at the moment each message arrives:

```js title="Plain JavaScript: the handler reads muted when a message arrives"
let muted = false;
const connection = createConnection(serverUrl, 'general');
connection.connect();
connection.on('message', msg => {
  if (~!muted~) showNotification('New message: ' + msg); // Reads muted now, at the moment the message arrives
});
muteCheckbox.addEventListener('change', e => {
  ~muted = e.target.checked~; // Changes the variable, and the connection stays as it is
});
```

Toggling `muted` never touches the socket connection. The listener merely reads the current value of the variable whenever a message arrives.

In React, the socket connection lives inside an Effect (Lesson 35). Incoming messages arrive through that connection, so the message listener must be registered inside the Effect setup. This introduces a dilemma: every prop and state variable read by the Effect must appear in its dependency array.

```jsx title="React, first try: muted goes in the array"
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  connection.on('message', msg => {
    if (!muted) showNotification('New message: ' + msg);
  });
  return () => connection.disconnect();
}, ~[roomId, muted]~); // muted is in the array, so every tick of the checkbox reconnects the chat
```

The user only intended to mute sound notifications, yet the chat drops its connection and reconnects. The official React documentation highlights this exact flaw: every time the mute setting changes, the Effect re-synchronizes and reconnects to the chat server, degrading user experience.

React resolves this dilemma with the `useEffectEvent` Hook. You extract the check that reads `muted` out of the Effect body and place it inside an Effect Event. The Effect then invokes this function when a message arrives:

```jsx title="React with an Effect Event: muted leaves the array"
const onMessage = ~useEffectEvent~(msg => { // An Effect Event: reads the latest muted each time it runs
  if (!muted) showNotification('New message: ' + msg);
});

useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  connection.on('message', msg => onMessage(msg));
  return () => connection.disconnect();
}, ~[roomId]~); // Only roomId: picking a room reconnects, ticking the checkbox does not
```

This restores the clean behavior of plain JavaScript. The Effect Event reads the latest state at runtime, while the socket connection remains uninterrupted.

> [!DEFINITION]
> **What is a reactive value?** [REVIEW] A reactive value is any value computed within the render data flow of a component.
> 1. Props, state variables, and local variables derived from them inside the component body are all reactive values.
> 2. An Effect that reads a reactive value must declare that value in its dependency array.
> 3. After every render commit, React compares each value in the array against the previous render using Object.is equality.
> 4. If any reactive value changed, React cleans up the previous Effect and runs the setup function again (Lesson 35).

> [!DEFINITION]
> **What is an Effect Event?** [NEW] An Effect Event is a non-reactive function created by passing a callback to the `useEffectEvent` Hook, introduced in React 19.2.
> 1. You declare an Effect Event at the top level of your component, adjacent to the Effect that calls it.
> 2. You invoke the Effect Event from inside an Effect, passing transient event data as arguments.
> 3. Whenever executed, the Effect Event reads the latest committed props and state from the most recent render pass.
> 4. The Effect Event is not reactive, meaning neither the function itself nor the values it reads belong in the dependency array (Lesson 36).

### The Rule of Thumb: does the user want the Effect to run again?

**Ask one question about every value an Effect reads: when this value changes, does the user want the Effect to re-synchronize? If yes, keep it in the dependency array. If no, extract it into an Effect Event.**
- **`roomId`: yes.** From the user perspective, changing the room means joining a different conversation, requiring a new socket connection.
- **`muted`: no.** Ticking the checkbox means the user wants silence, not a severed network connection.

You have four ways to handle a value read by an Effect (Lesson 35):
1. **Keep it in the dependency array** when a change means the Effect must re-synchronize, such as `roomId`.
2. **Read it in an Effect Event** when you only need its current value at the moment an event occurs, such as `muted`.
3. **Refactor the code so the value is no longer a dependency**, such as moving static constants outside the component (Lesson 37).
4. **Suppress the linter.** Suppressing the exhaustive-deps lint rule creates stale closure bugs. The official documentation strongly advises against this practice.

Experienced engineers guard against four classic mistakes when managing non-reactive values:
1. **Silencing the linter to stop unwanted reconnects.** The Effect then retains stale values, and the checkbox stops responding.
2. **Adding the Effect Event to the dependency array.** React assigns a new identity to Effect Events on every render, causing the Effect to re-run on every render pass.
3. **Wrapping entire synchronization logic inside an Effect Event.** The Effect loses its reactive triggers, trapping the application in its initial room forever.
4. **Calling an Effect Event from an event handler or passing it as a prop to a child.** Effect Events belong exclusively to their host Effect and cannot serve as general callbacks.

The rest of this lesson demonstrates each scenario using a working chat room.

## SECTION | A Chat Room with a Mute Checkbox

Our example builds on the chat room from Lesson 35, adding a Mute notifications checkbox beside the room picker:

```page width=text caption="The chat room a few seconds after the page opens: the menu is on general, Mute is off, and one notification line has appeared."
form:
  select: Choose the chat room: | general
  check: Mute notifications | off
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: 🔔 New message: hey
```

The disconnect line and the second connect line reflect the deliberate setup-cleanup-setup cycle enforced by development Strict Mode (Lesson 32). Approximately three seconds after mounting, the first simulated message arrives, and a notification appears in the Console.

Here is what the user does across four sequential interactions:
1. **The page opens.** The application connects to the general room. Every three seconds, a message arrives, and a notification logs to the Console.
2. **The user picks `travel`.** The heading updates. The application disconnects from general and connects to travel.
3. **The user ticks Mute notifications.** Messages continue to arrive over the open socket, but notifications no longer appear. The socket connection remains active.
4. **The user unticks Mute notifications.** Notifications resume appearing in the Console.

The chat connection helper extends `createConnection` from Lesson 35 with two capabilities. The `connect` method starts an interval timer that emits a message every three seconds. The `on` method registers a callback that executes whenever a message arrives:

```js title="src/chat.js"
export function createConnection(serverUrl, roomId) {
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = ~setInterval~(() => { // Every 3 seconds, a message arrives
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
      ~clearInterval(intervalId)~; // Stops the messages of this connection
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
    ~on~(event, callback) { // Keeps the function to call with each message
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

The call `connection.on('message', fn)` functions like standard browser event registration. You supply a callback, and the connection invokes it with the text of every arriving message.

The official documentation demonstrates notifications with toast popups. Our example logs them directly to the Console, allowing us to inspect and count every notification clearly:

```js title="src/notifications.js"
export function ~showNotification~(message) { // Prints one notification line in the Console
  console.log('🔔 ' + message);
}
```

The parent `App` component stores the selected room and mute toggle in state, controlling both the select dropdown and the checkbox (Lesson 20). It forwards both values to `ChatRoom` as props:

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);

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
      <label>
        <input
          type="checkbox"
          ~checked={muted}~ // Shows the tick while muted is true
          onChange={e => setMuted(e.target.checked)}
        />
        Mute notifications
      </label>
      <hr />
      ~<ChatRoom roomId={roomId} muted={muted} />~ {/* Both values arrive in ChatRoom as props */}
    </main>
  );
}
```

The parent component remains identical throughout every principle. Every architectural adjustment occurs inside `ChatRoom`:

```files title="chat-room: File Explorer" caption="How the chat room project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  chat.js | external helper | Exports `createConnection(serverUrl, roomId)` with `connect()`, `disconnect()`, and `on()`
  notifications.js | helper | Exports `showNotification(message)`, which prints a notification line
  App.jsx | parent | Keeps `roomId` and `muted` in state and renders `ChatRoom`
  components/
    ChatRoom.jsx | Effect | Connects to `roomId` in an Effect and shows a notification for each message unless `muted` is true
```

Now let us examine what happens when this separation is misconfigured. Each principle demonstrates where the mute check lives and what the user experiences:

**PRINCIPLES:** An Effect runs again when a value it reads changes. An Effect Event reads the latest value and does NOT make the Effect run again. Five principles follow:
1. **Principle 1: Every Value the Effect Reads Goes in Its Array.** With the check of `muted` inside the Effect, every tick of the checkbox reconnects the chat.
2. **Principle 2: An Effect Event Reads the Latest Value Without Reconnecting.** `onMessage` reads `muted` for each message, and neither of them goes in the array.
3. **Principle 3: A Suppressed Linter Leaves the Effect With an Old Value.** The reconnect stops, but the checkbox stops working too.
4. **Principle 4: Move Only the Lines That Should Not Run Again.** The connection must follow `roomId`, so it stays in the Effect.
5. **Principle 5: Call an Effect Event Only From Its Own Effect.** Never during rendering, never from a click handler, never from a child.

---

## PRINCIPLE | `muted` inside the Effect: every tick of the checkbox reconnects the chat

> [!PRINCIPLE]
> **Principle 1: Every Value the Effect Reads Goes in Its Array**
>
> *Every reactive value an Effect reads belongs in its dependency array. So a value you only need when a message arrives still reconnects the chat when it changes.*
>
> The user ticks Mute and the chat drops its connection. The check of `muted` sits inside the Effect, because the message comes from the connection. So `muted` becomes a dependency, and every tick runs the whole connection again. The linter is right about the array. The check is in the wrong place.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   connection.on('message', msg => {
>     if (!muted) showNotification('New message: ' + msg);
>   });
>   return () => connection.disconnect();
> }, ~[roomId, muted]~); // Lists every value read inside; the reconnect on Mute shows the check must move out
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   connection.on('message', msg => {
>     if (!muted) showNotification('New message: ' + msg);
>   });
>   return () => connection.disconnect();
> }, ~[roomId]~); // **WRONG:** muted is read inside but missing from the array
> ```

### An event handler runs on a click, an Effect runs when a value changes

You already know the two fundamental locations where application code executes (Lesson 34). Here they appear side by side in React's chat model:

```jsx title="An event handler and an Effect in the same chat room"
function handleSendClick() {
  ~sendMessage(message)~; // Runs only when the user clicks Send
}

useEffect(() => {
  const connection = ~createConnection(serverUrl, roomId)~; // Runs again for every new roomId
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

The official React documentation distinguishes these two execution models:
- **Logic inside an event handler is non-reactive.** It runs only when triggered by explicit user interaction. In `handleSendClick`, typing into the input updates `message`, but does not trigger message sending. A change to `message` indicates editing, not sending.
- **Logic inside an Effect is reactive.** It re-runs automatically whenever any reactive dependency changes. A change to `roomId` indicates that the user selected another room, requiring disconnection and reconnection.

Complications arise when reactive synchronization mixes with non-reactive inspection. In our chat component, notifications depend on incoming network messages from the socket. At the same time, checking `muted` should behave like an event handler: inspect the setting when a message arrives, while ignoring checkbox toggles otherwise.

### The first try puts `muted` in the array

Here is the initial implementation. `ChatRoom` receives `muted` as a prop. The Effect passes a message callback to the connection, showing a notification unless `muted` is active:

```jsx title="src/components/ChatRoom.jsx"
import { useEffect } from 'react';
import { createConnection } from '../chat.js';
import { showNotification } from '../notifications.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId, muted }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    ~connection.on~('message', msg => { // Hands the connection a function to call with each message
      if (~!muted~) { // Reads the muted prop when a message arrives
        showNotification('New message: ' + msg);
      }
    });
    return () => connection.disconnect();
  }, ~[roomId, muted]~); // The linter asks for muted, so muted joins roomId

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Every three seconds, the simulated connection invokes our arrow function with incoming message text, which JavaScript receives in `msg`.

Because the Effect reads `muted`, and props are reactive values, `muted` must be listed in the dependency array. Omitting it triggers a linter warning stating that `useEffect` has a missing dependency.

On initial mount, everything operates as expected. The chat connects to general, and incoming messages log notifications to the Console.

### Ticking Mute disconnects the chat and connects it again

**Beware! Ticking Mute silences notifications, but it also severs the active socket and establishes a duplicate connection.** Here is the exact runtime sequence:
1. `App` updates `muted` to true. `ChatRoom` re-renders with the updated prop.
2. React compares dependencies using `Object.is`. The room remains `'general'`, but `muted` changed from false to true.
3. React executes the previous render's cleanup, logging a disconnection line.
4. React executes setup for the new render, logging a fresh connection line to the exact same room.

```page width=text caption="Right after the user ticks Mute: the heading is the same, but the Console shows a disconnect and a new connect."
form:
  select: Choose the chat room: | general
  check: Mute notifications | on | bad
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: 🔔 New message: hey
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

With `[roomId, muted]`, the Effect conflates two distinct user intents:
- **The user picks `travel`.** The Effect disconnects from general and connects to travel. This matches user expectations.
- **The user ticks Mute.** The Effect disconnects from general and reconnects to general. No user requested a network restart.

This architecture introduces an additional defect: **rapidly toggling the Mute checkbox prevents any messages from arriving**. Each reconnection runs `disconnect`, which clears the existing interval timer, and `connect`, which starts a new three-second timer. If the user toggles Mute within three seconds, the timer clears again before it can fire. The message stream appears stalled.

```tree caption="With muted read inside the Effect, picking a room and ticking Mute both reconnect the chat."
What the Effect does with `[roomId, muted]`
- +The user picks `travel` [`roomId`] | The user **wants a new room** | Disconnects from general and **connects to travel**
- !The user ticks Mute [`muted`] | The user **only wants silence** | Disconnects from general and **connects to general again**
```

The dependency array was technically correct for the code written, and the linter performed its duty. The flaw lies in the architecture: non-reactive logic was placed directly inside a reactive Effect. The remedy is extracting that non-reactive check rather than tampering with dependencies.

---

## PRINCIPLE | `useEffectEvent`: `onMessage` reads the latest `muted` without reconnecting

> [!PRINCIPLE]
> **Principle 2: An Effect Event Reads the Latest Value Without Reconnecting**
>
> *Move the line that should not be reactive into a function made with useEffectEvent, and call it from inside the Effect. Leave both the Effect Event and the values it reads out of the array.*
>
> The user ticks Mute and expects silence, not a new connection. An Effect Event reads the current `muted` each time a message arrives, while the Effect depends only on `roomId`. Picking a room still reconnects. Ticking Mute only changes what the next message does.
>
> **DO THIS:**
> ```jsx
> const onMessage = ~useEffectEvent~(msg => { // Reads the latest muted for each message
>   if (!muted) showNotification('New message: ' + msg);
> });
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   connection.on('message', msg => onMessage(msg));
>   return () => connection.disconnect();
> }, [roomId]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   connection.on('message', msg => onMessage(msg));
>   return () => connection.disconnect();
> }, ~[roomId, onMessage]~); // **WRONG:** an Effect Event in the array reconnects the chat on every render
> ```

### `useEffectEvent` in its smallest form

`useEffectEvent` is a built-in Hook exported directly from React. You supply an event callback, and React returns a non-reactive wrapper function known as an Effect Event:

```jsx title="The smallest useEffectEvent"
import { useEffect, ~useEffectEvent~ } from 'react'; // Imported from React, like useEffect

const onEvent = ~useEffectEvent(callback)~; // Returns an Effect Event that runs callback
```

As the official React documentation explains, an Effect Event forms part of your Effect logic while behaving like an event handler. The logic inside it is non-reactive, and it always accesses the latest committed values of your props and state.

An Effect Event shares its primary characteristic with an event handler: both inspect current data at the moment of execution without reacting when those values change. The sole distinction is the caller. React invokes an event handler in response to user actions, such as clicks. Your Effect invokes an Effect Event in response to internal events, such as incoming socket messages.

### Moving the check into `onMessage`

Here is `ChatRoom` with the mute check extracted into an Effect Event named `onMessage`:

```jsx title="src/components/ChatRoom.jsx"
import { useEffect, useEffectEvent } from 'react';
import { createConnection } from '../chat.js';
import { showNotification } from '../notifications.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId, muted }) {
  const onMessage = ~useEffectEvent~(msg => { // Declared at the top level, next to the Effect
    if (!muted) {
      showNotification('New message: ' + msg);
    }
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    connection.on('message', msg => ~onMessage(msg)~); // Calls the Effect Event for each message
    return () => connection.disconnect();
  }, ~[roomId]~); // Only roomId: muted and onMessage stay out

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Three structural adjustments occurred:
1. The mute check moved out of the Effect into `onMessage`, declared at the top level of the component.
2. The socket listener performs no inspection itself, forwarding incoming message data to `onMessage(msg)`.
3. The dependency array returns to `[roomId]`. The Effect no longer reads `muted`, so `muted` leaves the array. Furthermore, `onMessage` is omitted because Effect Events are non-reactive and must not be included in dependencies.

The documentation describes this process as extracting an Effect Event. Non-reactive logic moves out, leaving the Effect synchronized solely with values that require re-connection.

**It may look the same, or work the same at first, but it is NOT the same thing!** On initial page load, both implementations connect to general and log incoming messages. The difference emerges when the user ticks Mute. The first implementation drops and restarts the connection. The version with `onMessage` preserves the existing connection while cleanly silencing notifications.

```tree caption="The same chat with muted read inside the Effect, and with muted read inside the onMessage Effect Event."
Where the check of `muted` lives
- !Inside the Effect [`[roomId, muted]`] | The Effect **depends on `muted`** | Every tick of Mute **disconnects and connects again**
- +Inside `onMessage` [`useEffectEvent` `[roomId]`] | The Effect **depends only on `roomId`** | The next message reads the **latest `muted`**; the connection **stays**
```

### Ticking Mute now changes only the notifications

**When the user ticks Mute, notifications stop, and the Console records no disconnections or duplicate connections.** Here is the runtime sequence:
1. The user ticks Mute. `ChatRoom` re-renders with `muted: true`.
2. React compares the dependency array `[roomId]` against the previous render. The room is unchanged, so React skips the Effect.
3. The existing socket connection continues running undisturbed.
4. When the timer fires, the connection invokes its callback, which calls `onMessage(msg)`. `onMessage` reads the latest `muted` value, sees true, and suppresses the notification.

```page width=text caption="After the user ticks Mute: no disconnect, no new connect, and no notification line for the next messages."
form:
  select: Choose the chat room: | general
  check: Mute notifications | on | good
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: 🔔 New message: hey
```

When the user unticks Mute, `onMessage` reads false on the next message arrival. Notifications resume over the same socket connection:

```page width=text caption="After the user unticks Mute: notification lines appear again, and the connection was never replaced."
form:
  select: Choose the chat room: | general
  check: Mute notifications | off | good
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: 🔔 New message: hey
log: 🔔 New message: lol
```

### Where does `onMessage` get the latest `muted`?

From React's internal execution context. The socket callback was registered during the initial render. Ordinarily, JavaScript closures lock functions to the scope in which they were created. However, React guarantees that calling an Effect Event always accesses the latest committed values from render at the time of invocation.

In practical terms, `onMessage` always reads the props and state that currently appear on screen. You do not need to manage manual ref synchronization.

Meanwhile, `msg` originates from the socket event. The network helper passes the message payload into the arrow function, which forwards it to `onMessage` as an explicit argument.

The official documentation illustrates this same pattern with application themes. In their example, a notification logs upon connection, styling itself with the active theme:

```jsx title="The docs' version: a theme read in an Effect Event"
const onConnected = ~useEffectEvent~(() => { // Reads the latest theme when the chat connects
  showNotification('Connected!', theme);
});

useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.on('connected', () => {
    onConnected();
  });
  connection.connect();
  return () => connection.disconnect();
}, ~[roomId]~); // ✅ All dependencies declared
```

The underlying concept is identical. A secondary user preference like theme or mute state is read inside an Effect Event, leaving the dependency array scoped exclusively to `roomId`.

### `onMessage` in the array reconnects on every render

**Beware! Adding an Effect Event to the dependency array brings back unwanted reconnects and escalates them to every single render.** Developers accustomed to listing all called functions often make this mistake:

```jsx title="src/components/ChatRoom.jsx"
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  connection.on('message', msg => onMessage(msg));
  return () => connection.disconnect();
}, ~[roomId, onMessage]~); // **WRONG:** onMessage is new on every render, so the chat reconnects on every render
```

Here is why this fails:
1. The linter flags the line, warning that functions returned from `useEffectEvent` must not be included in the dependency array.
2. If executed, the Effect re-runs on every render because Effect Event functions do not have a stable identity.
3. React deliberately assigns a brand-new function object to `onMessage` on every render pass.
4. Consequently, `Object.is` comparison always evaluates to false, causing the chat to disconnect and reconnect on every render pass, including every checkbox toggle.

Remember: an Effect re-runs when a value in its dependency array changes. An Effect Event never belongs in the dependency array.

---

## PRINCIPLE | `eslint-disable-line`: the Effect keeps an old `muted`, so Mute stops working

> [!PRINCIPLE]
> **Principle 3: A Suppressed Linter Leaves the Effect With an Old Value**
>
> *Silencing the linter also stops the reconnect. But the function the connection holds keeps the muted of the render that connected, so the checkbox stops working until the room changes.*
>
> The user mutes the room and still gets notifications. The Effect did not run again, so the function it gave the connection still belongs to the old render, and it checks the old value. The linter was the only thing that could point to this, and it was silenced. An Effect Event fixes the reconnect without hiding anything.
>
> **DO THIS:**
> ```jsx
> const onMessage = useEffectEvent(msg => {
>   if (~!muted~) showNotification('New message: ' + msg); // Reads the latest muted for each message
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   connection.on('message', msg => {
>     if (~!muted~) showNotification('New message: ' + msg); // **WRONG:** muted is stuck at its value from the render that connected
>   });
>   return () => connection.disconnect();
> }, ~[roomId]~); // **WRONG:** eslint-disable-line react-hooks/exhaustive-deps hides muted from the linter
> ```

### Two Effects with the same `[roomId]`

Many developers attempt an alternative shortcut to prevent unwanted reconnections. They retain the mute check inside the Effect, remove `muted` from dependencies, and silence the linter with a comment:

```jsx title="With the linter suppressed"
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  connection.on('message', msg => {
    if (~!muted~) { // **WRONG:** reads the muted of the render that connected
      showNotification('New message: ' + msg);
    }
  });
  return () => connection.disconnect();
}, ~[roomId]~); // **WRONG:** eslint-disable-line react-hooks/exhaustive-deps hides muted from the linter
```

The inline comment instructs ESLint to ignore the missing dependency, silencing compiler warnings. Now compare this with the `onMessage` implementation from Principle 2:

```jsx title="With onMessage"
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  connection.on('message', msg => ~onMessage(msg)~); // Reads the latest muted for each message
  return () => connection.disconnect();
}, [roomId]);
```

**It may look the same, or work the same at first, but it is NOT the same thing!** Both dependency arrays read `[roomId]`, and neither logs a disconnection when Mute is toggled. However, only the version using `onMessage` actually silences notifications.

### In plain JavaScript there is one `muted`, in React every render has its own

To understand this breakdown, consider how closures operate. In plain JavaScript, a single mutable variable exists in memory. Any function referencing it reads the updated value whenever it changes.

In React, `muted` is a prop, functioning as an argument passed to the component function on each render pass. Consider what happens when a function is called repeatedly with different arguments:

```js title="Plain JavaScript: two calls, two separate muted parameters"
function render(~muted~) { // Every call gets its own muted
  return () => console.log(muted);
}
const fromFirstCall = render(false);
const fromSecondCall = render(true);
~fromFirstCall()~; // Logs false: the function sees the muted of its own call, forever
~fromSecondCall()~; // Logs true
```

React components follow this exact execution model. React invokes `ChatRoom` on every render pass with that pass's specific props. An arrow function created during the first render pass captures that first render's props in its closure forever (Lesson 15).

When the Effect does not re-run, the socket retains the arrow function instantiated during the initial render. That callback remains permanently locked to `muted: false`. This is the exact defect `useEffectEvent` solves: React routes calls through a dynamic wrapper that evaluates the latest render's values.

### The user mutes the room, and notifications keep coming

**Beware! Suppressing the linter breaks the Mute feature: the user checks Mute, yet notifications continue arriving.** Here is the runtime breakdown:
1. The component mounts with `muted: false`. The Effect setup registers a message callback from this first render, capturing `false`.
2. The user ticks Mute. `ChatRoom` re-renders with `muted: true`.
3. React compares `[roomId]` against the previous render. Because `roomId` is unchanged, React skips the Effect. The initial callback remains active.
4. When the next message arrives, the old callback evaluates its captured `muted` value, which remains false, and prints a notification.

```page width=text caption="With the linter suppressed: the first notification line came before the tick, and the next two came after the user ticked Mute."
form:
  select: Choose the chat room: | general
  check: Mute notifications | on | bad
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: 🔔 New message: hey
log: 🔔 New message: lol
log: 🔔 New message: lol
```

The documentation characterizes this defect as a stuck or stale value.

### Picking another room fixes Mute for a while

**Switching rooms temporarily masks the defect, creating an intermittent and confusing bug.** Here is what happens:
1. While Mute is active, the user switches the room to `travel`. Because `roomId` changed, React executes cleanup and runs a new setup.
2. The new setup registers a fresh callback that captures `muted: true` from the current render. Notifications cease.
3. The user unticks Mute. Because `roomId` is unchanged, the Effect does not re-run. The callback remains stuck on true, and notifications remain silenced until the next room change.

This bug is notoriously difficult to diagnose because the mute toggle appears to work or fail depending on whether the user recently changed rooms. Furthermore, silencing ESLint removes your safety net. The documentation warns that suppressing the linter blinds you to future reactive dependencies, whereas adhering to the linter eliminates stale closure bugs entirely.

```tree caption="Two Effects with the same array: the suppressed one keeps an old muted, and the one with onMessage reads the latest muted."
Two Effects with `[roomId]` after the user ticks Mute
- !With the linter suppressed [`eslint-disable-line`] | The function the connection holds **belongs to the render that connected** | Keeps the old `muted`, so **notifications keep coming**
- +With `onMessage` [`useEffectEvent`] | The function the connection holds **calls the Effect Event** | Reads the **latest `muted`**, so **the notifications stop**
```

---

## PRINCIPLE | `useEffectEvent` around the connection: the chat never leaves the first room

> [!PRINCIPLE]
> **Principle 4: Move Only the Lines That Should Not Run Again**
>
> *Move into an Effect Event only the logic that should not re-synchronize. Code that must follow a value, such as the connection to roomId, stays in the Effect. A value that belongs to the event, such as the message text, reaches the Effect Event as an argument.*
>
> When the user picks a new room, the chat must leave the old one. If the connection hides inside an Effect Event, the linter goes quiet, and the chat stays in the first room while the heading changes. Move only the lines that read a value at the moment something happens, and name the Effect Event after that event.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   connection.on('message', msg => ~onMessage(msg)~); // Only the notification check is an Effect Event
>   return () => connection.disconnect();
> }, [roomId]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const onMount = useEffectEvent(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   return connection;
> });
> useEffect(() => {
>   const connection = ~onMount()~; // **WRONG:** runs once, so the chat never leaves the first room
>   return () => connection.disconnect();
> }, []);
> ```

### Wrapping the whole connection in an Effect Event

When developers discover that `useEffectEvent` quiets the linter without comments, some overreact by wrapping entire synchronization routines inside it. In this flawed attempt, the entire connection logic moves into an Effect Event named `onMount`, leaving the Effect with an empty dependency array:

```jsx title="With the connection inside onMount"
const onMount = ~useEffectEvent~(() => { // **WRONG:** the connection must follow roomId, so it does not belong here
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  connection.on('message', msg => onMessage(msg));
  return connection;
});

useEffect(() => {
  const connection = onMount();
  return () => connection.disconnect();
}, ~[]~); // The linter is quiet: the Effect reads no reactive value
```

**It may look the same, or work the same at first, but it is NOT the same thing!** On initial mount, both versions connect to general, and neither triggers linter warnings. The failure manifests the moment the user selects `travel`.

### The heading says travel, and the chat is still in general

**With the socket connection hidden inside `onMount`, the heading updates, but the connection remains trapped in the old room.** Here is the runtime sequence:
1. The component mounts. The Effect calls `onMount`, connecting to the general room.
2. The user selects `travel`. `ChatRoom` re-renders, updating the heading to travel.
3. React compares dependencies. The array `[]` matches `[]`, so React skips both cleanup and setup.
4. The Console displays no disconnection or reconnection. The application continues receiving and logging messages from general.

Although `onMount` can read the latest `roomId`, nothing ever triggers it again after mount.

```page width=text caption="With the connection inside onMount, the heading says travel, but the Console shows only the connection to general."
form:
  select: Choose the chat room: | travel | bad
  check: Mute notifications | off
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: 🔔 New message: hey
```

The React documentation explicitly cautions against this misapplication: do not use `useEffectEvent` simply to omit dependencies from your Effect. Doing so conceals defects and complicates maintenance. The Hook should be applied exclusively to lines of code that must not be reactive.

### Name the Effect Event after what the user thinks happened

The identifier `onMount` was an immediate indicator of flawed design. It describes when code runs rather than what occurred in the user's mental model. React guidelines instruct developers to name Effect Events after user-perceived events rather than lifecycle moments.

Avoid lifecycle names like `onMount` or `onUpdate`. Generic lifecycle names encourage developers to place reactive logic inside them by mistake. High-quality names describe concrete occurrences, such as `onMessage` or `onConnected`.

To decide what code to extract, apply the Rule of Thumb to each operation:
1. **The socket connection: reactive.** Changing `roomId` means joining a different room. The connection stays in the Effect with `roomId` in dependencies.
2. **The notification check: non-reactive.** Toggling `muted` does not mean reconnecting. The check belongs in `onMessage`.

### The message text arrives as an argument

`onMessage` receives the message text as an argument passed from the Effect. The component cannot read message text from props or state because that data exists only when emitted by the socket. The documentation supports this: an Effect Event can accept any number of arguments and return any value.

Notice how two distinct types of data enter `onMessage`:

```jsx title="The two kinds of values inside onMessage"
const onMessage = useEffectEvent(~msg~ => { // Belongs to this one message: passed in by the Effect
  if (!~muted~) { // A setting looked up when the message arrives: always the latest value
    showNotification('New message: ' + msg);
  }
});
```

1. **Transient event data**, such as the message payload `msg`, passes in as an argument from the Effect.
2. **Component reactive state**, such as `muted`, is read directly inside the Effect Event body, always evaluating to its latest committed value.

```tree caption="Moving the whole connection into an Effect Event vs. moving only the notification check."
What moves into an Effect Event
- !The whole connection in `onMount` [`[]`] | Quiets the linter, **but the connection no longer follows `roomId`** | The heading says travel; the chat **stays in general**
- +Only the check in `onMessage` [`[roomId]`] | The connection **stays in the Effect** | Picking a room **reconnects**; ticking Mute **only changes the notifications**
```

---

## PRINCIPLE | `onMessage`: call it only from inside its own Effect

> [!PRINCIPLE]
> **Principle 5: Call an Effect Event Only From Its Own Effect**
>
> *Call an Effect Event only from its own Effect or from another Effect Event. Never call it during rendering or from an event handler, never pass it to another component or Hook, and declare it next to the Effect that uses it.*
>
> An Effect Event looks like any other function, but it is a piece of one Effect. Called during rendering, it throws an error and the page goes blank. Called from a click or passed to a child, it breaks a rule the linter checks, and a child that depends on it runs its Effect after every render. Clicks and children get regular functions.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   connection.on('message', msg => ~onMessage(msg)~); // Called from inside its own Effect
>   return () => connection.disconnect();
> }, [roomId]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button onClick={() => ~onMessage('test')~}> {/* **WRONG:** an Effect Event called from a click handler */}
>   Test notification
> </button>
> ```

### Three places to call the same function

Because `onMessage` is a JavaScript function, developers are tempted to invoke it across different parts of a component. Consider three potential call sites:

```jsx title="Three places to call onMessage"
connection.on('message', msg => ~onMessage(msg)~); // 1. Inside the Effect: allowed

<button onClick={() => ~onMessage('test')~}>Test notification</button> {/* 2. In a click handler: not allowed */}

<MessageList ~onMessage={onMessage}~ /> {/* 3. Passed to a child as a prop: not allowed */}
```

**It may look the same, but it is NOT the same thing!** All three lines call the identical function, but React permits only the first. The official documentation establishes two strict constraints: only call Effect Events from inside Effects, and never pass them to other components or custom Hooks.

This restriction reinforces the architectural boundary: an Effect Event conceptually belongs to one specific Effect rather than serving as a general escape hatch from reactivity.

### A call during rendering throws an error

**Calling an Effect Event directly in the component body triggers a fatal runtime error and renders a blank screen.** Here is the invalid call:

```jsx title="src/components/ChatRoom.jsx"
export default function ChatRoom({ roomId, muted }) {
  const onMessage = useEffectEvent(msg => {
    if (!muted) {
      showNotification('New message: ' + msg);
    }
  });

  ~onMessage('test')~; // **WRONG:** runs while React renders ChatRoom

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

The component body executes during the render phase (Lesson 13). Calling an Effect Event during rendering violates React's purity rules. React immediately aborts rendering, logging an uncaught error to the Console:

```devconsole caption="The Console after onMessage is called in the body of ChatRoom."
x Uncaught Error: A function wrapped in useEffectEvent can't be called during rendering.
! An error occurred in the <ChatRoom> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

### A click handler and a child get the linter's warning

In the browser, calling an Effect Event inside a click handler or passing it as a prop does not crash immediately. Instead, the linter flags it as an error.

Each restriction serves a clear technical purpose:
1. **Event handlers do not require Effect Events.** User interactions like clicks are already non-reactive and execute standard event handlers (Lesson 11).
2. **Passing an Effect Event to a child destabilizes child dependencies.** React creates a new function instance for an Effect Event on every render pass. If a child component includes that function in its own Effect dependency array, the child's Effect re-runs on every render pass.

The documentation illustrates this risk using a timer hook. Passing an Effect Event to `useTimer` causes the interval to reset on every render pass. The recommended approach is using a standard function, or memoizing with `useCallback` when child components require stable function references (Lesson 57).

For standalone user actions like the Test notification button, a standard event handler is the correct solution:

```jsx title="A regular event handler for the Test notification button"
function ~handleTestClick~() { // A regular function: runs only when the user clicks
  showNotification('Test notification');
}

<button onClick={handleTestClick}>Test notification</button>
```

### Declared next to its Effect, at the top level

Like all Hooks, `useEffectEvent` adheres to the Rules of Hooks. Declare it unconditionally at the top level of your component, never inside conditions, loops, or nested functions (Lesson 38). Position the Effect Event directly above the Effect that consumes it. Co-locating the two makes it clear that the Effect Event is an extracted piece of that specific synchronization.

```tree caption="The four places a developer might put a call to onMessage, and which one React allows."
Where `onMessage` can be called
- +Inside its own Effect [`connection.on`] | **Allowed** | Reads the latest `muted` each time a message arrives
- !In the component body [`onMessage`] | Runs **during rendering** | React **throws an error**
- !In a click handler [`onClick`] | The linter **reports it** | Use a **regular event handler** instead
- !Passed to a child [`<MessageList onMessage>`] | A **new function object** on every render | Use a **regular function** or `useCallback` instead
```

---

## All 5 Principles Together

### The complete files

The chat helper creates a connection that delivers a message every three seconds:

```js title="src/chat.js"
export function ~createConnection~(serverUrl, roomId) { // The message version of the helper from React's docs
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

The notification helper prints one line for each notification:

```js title="src/notifications.js"
export function ~showNotification~(message) { // Our stand-in for a pop-up notification
  console.log('🔔 ' + message);
}
```

`App` keeps the room and the Mute setting in state, and passes both to `ChatRoom`:

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);

  return (
    <main>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          ~onChange={e => setRoomId(e.target.value)}~ // Picking a room changes roomId
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={muted}
          ~onChange={e => setMuted(e.target.checked)}~ // Ticking the checkbox changes muted
        />
        Mute notifications
      </label>
      <hr />
      <ChatRoom roomId={roomId} muted={muted} />
    </main>
  );
}
```

`ChatRoom` keeps the connection in the Effect, and the check of `muted` in the Effect Event:

```jsx title="src/components/ChatRoom.jsx"
import { useEffect, useEffectEvent } from 'react';
import { createConnection } from '../chat.js';
import { showNotification } from '../notifications.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId, muted }) {
  const onMessage = ~useEffectEvent~(msg => { // Principles 2 and 4: only the non-reactive check, named after the event
    if (!muted) {
      showNotification('New message: ' + msg);
    }
  });

  useEffect(() => {
    const connection = ~createConnection(serverUrl, roomId)~; // Principle 4: the connection stays in the Effect
    connection.connect();
    connection.on('message', msg => ~onMessage(msg)~); // Principle 5: called only from its own Effect
    return () => connection.disconnect();
  }, ~[roomId]~); // Principles 1 and 3: every reactive value the Effect reads, with no suppression

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

### One visit to the chat

In development, the user opens the page, waits for a message, ticks Mute, picks `travel`, and then unticks Mute. The Console shows one reconnect, for the room change, and none for Mute:

```page width=text caption="The finished chat after the user mutes, picks travel, and unmutes: one reconnect for the room change, and none for Mute."
form:
  select: Choose the chat room: | travel | good
  check: Mute notifications | off | good
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: 🔔 New message: hey
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:1234...
log: 🔔 New message: lol
```

```tree dir=right caption="How React runs App, ChatRoom, the Effect, and onMessage across one visit to the chat."
From opening the page to unmuting in the travel room
- +1. The page opens [`roomId: 'general'` `muted: false`] | React calls **`App`**, then **`ChatRoom`** | After the commit, the Effect **connects to general**; in development, Strict Mode adds one extra cleanup and setup
- +2. A message arrives [`onMessage`] | The connection calls its function, which calls **`onMessage`** | `onMessage` reads `muted` as **false** and prints **a notification line**
- +3. The user ticks Mute [`muted: true`] | `ChatRoom` renders again; **`[roomId]` is unchanged** | The Effect **does not run**; the next messages print **nothing**
- +4. The user picks travel [`roomId: 'travel'`] | `ChatRoom` renders again; **`roomId` changed** | The old cleanup **disconnects from general**; the new setup **connects to travel**
- +5. The user unticks Mute [`muted: false`] | `ChatRoom` renders again; **`[roomId]` is unchanged** | The connection stays; the next message prints **a notification line**
```

### Where the check of `muted` lives, and what the user sees

| Where the check of `muted` lives | What the user sees |
| :--- | :--- |
| **Inside the Effect, with `muted` in the array** | Every tick of Mute disconnects and connects again |
| **In `onMessage`, with `onMessage` in the array** | The chat reconnects after every render |
| **Inside the Effect, with the linter suppressed** | Mute stops working until the room changes |
| **In `onMount`, together with the connection** | The heading says travel, and the chat stays in general |
| **In `onMessage`, called from a click or during rendering** | The linter reports it, or the page goes blank |
| **In `onMessage`, called only from its own Effect** | Picking a room reconnects, and ticking Mute only stops the notifications |

One last time, the sentence of this lesson: **An Effect runs again when a value it reads changes. An Effect Event reads the latest value and does NOT make the Effect run again.**

---

## For the Interview

> **The Interview Question:** How do you keep non-reactive values from re-running an effect?

### How to Answer Clearly in 30 Seconds

"Every reactive value read inside an Effect must be declared in its dependency array. If an Effect reads secondary data needed only when an event occurs, like a mute toggle checked on message arrival, changing that value triggers an unwanted re-synchronization. React 19.2 resolves this with `useEffectEvent`:

1. **Extract non-reactive logic:** move lines that read non-reactive values into an Effect Event declared with `useEffectEvent` at the component top level, and call it from inside the Effect.
2. **Omit it from dependencies:** the Effect Event always accesses the latest committed props and state at call time. Neither the Effect Event nor the values read inside it belong in dependencies.
3. **Respect boundaries:** never suppress the linter to hide dependencies. Call the Effect Event exclusively from inside its own Effect, never during rendering, from click handlers, or as props to children."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why not just suppress the linter and leave the value out of the array?"**
   Suppressing the linter creates stale closure bugs. Callbacks registered during an Effect setup close over props and state from that specific render pass. If the Effect does not re-run when those values change, the callback continues executing with outdated values. In our chat example, checking Mute fails to silence notifications because the callback remains locked to the initial render's value. Furthermore, silencing ESLint blinds the compiler to any future reactive dependencies added to the Effect. Using `useEffectEvent` prevents unwanted re-runs while ensuring the callback always accesses the latest committed values.
2. **"When should a value be passed to the Effect Event as an argument instead of read inside it?"**
   Pass a value as an argument when that value belongs to the event occurrence itself rather than component state. For instance, incoming socket message text exists only when emitted by the external system, so the Effect passes it to `onMessage(msg)`. The official documentation provides a second example: logging page visits. An Effect synchronizing with a URL change calls `onVisit(url)`, passing the URL as an argument so the log attributes the visit to the exact page that triggered synchronization. If `onVisit` read `url` from component scope instead, it could capture a newer URL if navigation occurred before the event fired. Passing event data as arguments also enforces proper dependency declaration in the parent Effect.
3. **"Why does an Effect Event get a new identity on every render, unlike a setter or a ref?"**
   React intentionally generates a fresh function identity on every render pass as a runtime safety mechanism. If a developer mistakenly includes an Effect Event in a dependency array, the changing reference causes the Effect to re-run on every render pass, immediately exposing the defect. This unstable identity also reinforces that Effect Events are not general callbacks meant to be passed down through props. If a child component requires a stable function reference across renders, use a standard function wrapped in `useCallback`.

```tree dir=right caption="Interview summary: how one Effect separates the logic that re-synchronizes from the logic that only reads the latest values."
One Effect, two kinds of logic
- +Reactive logic [`[roomId]`] | Must **follow its value** | Stays in the Effect, and a change **re-synchronizes** the connection
- +Non-reactive logic [`useEffectEvent`] | Only **reads a value when something happens** | Moves into an Effect Event that reads the **latest props and state**
- !Suppressed linter [`eslint-disable-line`] | Stops the re-run **by hiding a dependency** | The value **gets stuck**, and the linter stays silent afterwards
```
