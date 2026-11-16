# Lecture 79: How One Listener at the Root Runs Every onClick

*(Where does React really listen for your clicks?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How does React's SyntheticEvent delegator work at the root DOM container?

---

## VS | `addEventListener` on the button vs. `onClick` on the button: both run your function, only the first puts a listener on the button

> In standard JavaScript, `addEventListener` registers an event listener directly on the target button element. **In React, `onClick` does not attach a native DOM listener to the button element**. Instead, React attaches listeners once at the application root container. That single container listener intercepts every bubbling click across the entire component tree. This explains why document listeners run after React handlers, and why your callback receives a synthetic event wrapper rather than the browser event.

Consider how the browser registers event listeners in native JavaScript. You query a DOM button element and attach a callback directly to it. In React, you pass an `onClick` prop to a JSX element. Here are both approaches side by side:

```jsx title="Two ways to print Settings when the user clicks Settings"
const button = document.querySelector('button');
button.~addEventListener~('click', () => console.log('Settings')); // Plain JavaScript: the browser keeps our function on the button
<button ~onClick~={() => console.log('Settings')}>Settings</button> {/* React: our function goes to React, not to the button */}
```

Both approaches print `Settings` when clicked, creating the illusion of identical runtime behavior. In reality, their underlying mechanics differ completely:
1. **With `addEventListener`**, the browser engine registers the callback directly in the DOM node listener table. When the user clicks the button, the browser invokes the callback immediately at the target phase.
2. **With `onClick`**, React receives the callback during JSX evaluation and stores it in the component Fiber node. React creates the DOM button element without attaching your callback to it. The browser DOM node never holds a direct reference to your function.

How does React invoke your function if the button DOM node has no listener? The answer lies in standard DOM event bubbling (Lesson 11). When a user clicks an element, the browser generates an event that travels upward through every parent element to the top of the document. Every click inside your application passes through the root DOM container on its journey upward. This container is the host element passed to `createRoot` during application initialization (Lesson 07). React attaches its own listeners to this root element. When a bubbling event reaches the root, React intercepts it, looks up the corresponding `onClick` prop in the component tree, and executes your function.

You may already be familiar with this architectural pattern from standard JavaScript development. When handling interactions across a list containing 100 items, you avoid attaching 100 individual listeners. Instead, you attach a single listener to the parent `<ul>` element and read `e.target` to determine which item was clicked:

```js title="Event delegation by hand, in plain JavaScript"
const list = document.querySelector('ul');
list.~addEventListener~('click', e => console.log(e.target.textContent)); // One listener on the list hears a click on any item
```

This technique is called **event delegation**. In DOM programming, delegation means allowing an ancestor element to manage events triggered by its descendants. Instead of registering hundreds of individual listeners on list items, a single listener on the parent container handles interactions for all of them. React applies this pattern automatically to your entire application. The root container acts as the universal parent, and central listeners managed by React process every `onClick` handler you write.

```tree caption="A listener added with addEventListener sits on the button; onClick hands our function to React, whose listener sits on the root."
Where the browser listener sits
- +With `addEventListener` on the button [`button.addEventListener`] | The browser keeps our function **on the button** | One button, **one listener**
- +With `onClick` on the button [`<button onClick>`] | React keeps our function and puts **no listener of ours** on the button | React's listener sits **once on `<div id="root">`** and serves **every `onClick`**
```

Why this distinction matters: In straightforward applications, you rarely need to think about where listeners reside, because user clicks trigger their intended actions. The architectural differences become critical when React components interact with native browser event listeners.

Consider a dropdown account menu designed to dismiss whenever the user clicks elsewhere on the page. To detect outside clicks, developers frequently register a native click listener on the `document` object. When a user clicks an option inside the open menu, the menu unexpectedly closes immediately. The browser console reports no runtime errors. The native listener on `document` executed after React completed its event handling, unaware that the click originated inside the menu.

### The Four Facts of Event Delegation

Here are the four core concepts this lesson builds on. Three are reminders, and one introduces the core architectural pattern:

> [!DEFINITION]
> **Bubbling and capture.** [REVIEW] The browser dispatches DOM events in two distinct phases across nested elements (Lesson 11).
> 1. In the capture phase, the event travels downward from the document window through ancestor elements to the target node.
> 2. In the target phase, the event arrives at the element that the user directly clicked.
> 3. In the bubbling phase, the event travels upward from the target element through each parent container back to the document root.
>
> In React, handlers with the `Capture` suffix (such as `onClickCapture`) execute during the downward journey, while standard props (such as `onClick`) execute during the upward bubbling phase.

> [!DEFINITION]
> **The root container.** [REVIEW] The root is the host DOM element where React mounts the component tree and attaches its event infrastructure (Lesson 07).
> 1. An HTML file supplies a static mounting element, typically an empty `<div id="root"></div>`.
> 2. The application entry file passes this host element to `createRoot`, initializing the React rendering engine.
> 3. React mounts the entire component hierarchy inside this container and registers its top-level event listeners directly on it.
>
> The root element serves as the single physical boundary where React intercepts native browser events and delegates them to component handlers.

> [!DEFINITION]
> **The event object.** [REVIEW] When an event fires, the runtime constructs an event descriptor object and passes it to the active callback (Lesson 11).
> 1. The target property `e.target` refers to the specific DOM element where the user interaction originated.
> 2. The current target property `e.currentTarget` refers to the element whose event handler is currently executing.
> 3. The method `e.stopPropagation()` prevents the event from continuing its journey through subsequent listeners.
>
> Native browser handlers receive a DOM Event instance, whereas React handlers receive a SyntheticEvent wrapper constructed by React at runtime.

> [!DEFINITION]
> **Event delegation.** [NEW] Event delegation is an architectural pattern where a single parent element handles interactions on behalf of all descendant elements (Lesson 79).
> 1. Descendant elements avoid attaching individual event listeners to their own DOM nodes.
> 2. The browser automatically bubbles user interaction events upward to the shared ancestor container.
> 3. The ancestor listener inspects the event target and dispatches the appropriate callback for the clicked descendant.
>
> React delegates nearly all supported events to the root DOM container, eliminating the overhead of managing thousands of separate listeners across individual elements.

Four architectural facts follow from delegating events to the root container:
1. **`onClick` registers no native listener on the element.** React stores your callback internally, and root listeners invoke it when the bubbling event reaches the container.
2. **`e` is a synthetic wrapper constructed by React.** React instantiates this object at the root, while preserving the original browser event inside `e.nativeEvent`.
3. **React replicates standard browser propagation order.** Once the event reaches the root, React dispatches capture handlers downward and bubbling handlers upward along the component tree.
4. **Native listeners on `document` execute after React finishes.** The native browser event reaches `document` only after bubbling through the root and triggering all corresponding React handlers.

### Where Readers Usually Go Wrong

Developers often assume that browser handlers and React handlers execute within a single continuous event chain along the DOM tree. They imagine the button handler running first, followed by the menu wrapper handler, and then an outside click listener on `document`. That unified chain does not exist in the DOM. Here is the physical sequence:
1. The native click bubbles from the button through intermediate elements up to the root container without executing any React handler callbacks.
2. At the root container, React intercepts the native event and sequentially dispatches all associated React handlers.
3. Once React completes its dispatches, the native browser event resumes bubbling past the root to `<body>` and `document`.

### The Rule of Thumb: React processes handlers while the event resides at the root

**React executes all component handlers while the native browser event resides at the root container.** Consequently, a native listener attached to an element inside the root runs before React handlers. A native listener attached to an ancestor above the root, such as `document`, runs strictly after React handlers.

## SECTION | The Account Menu in the Site Header

Our demonstration application features an account menu. It displays a Menu toggle button. Clicking the toggle reveals two sub-buttons: Settings and Sign out. Below the menu sits a welcome paragraph reading `Welcome back, John`, providing an area outside the menu for testing outside clicks:

```page width=text caption="The account menu after the user clicks Menu: Settings and Sign out appear, and the page text sits below."
line: [Menu]
line: [Settings] [Sign out]
line: Welcome back, John
console: quiet
```

The project comprises four files. The HTML template and JavaScript entry point remain structured as established in Lesson 07. They play a pivotal role here because they define the root container where React registers its event delegator:

```files title="account-menu: File Explorer" caption="Our project files: index.html holds the root, main.jsx mounts App, and App renders AccountMenu."
index.html | entry | Holds the empty `<div id="root">` where React mounts and listens
src/
  main.jsx | boundary | Calls `createRoot` on `<div id="root">` and renders `App`
  App.jsx | parent | Renders the header with `AccountMenu` and the line `Welcome back, John`
  AccountMenu.jsx | default export | The `Menu` button, the `open` state, and the `Settings` and `Sign out` buttons
```

Here is the initial implementation of the menu component. The `open` state variable determines whether the dropdown menu renders. Conditional rendering using the logical AND operator displays the menu items while `open` remains true (Lesson 10):

```jsx title="src/AccountMenu.jsx"
import { useState } from 'react';

export default function AccountMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <div>
          <button ~onClick~={() => console.log('Settings')}>Settings</button> {/* Prints Settings when the user clicks it */}
          <button>Sign out</button>
        </div>
      )}
    </div>
  );
}
```

The `App` component places the menu inside a semantic header element, followed by the welcome paragraph:

```jsx title="src/App.jsx"
import AccountMenu from './AccountMenu.jsx';

export default function App() {
  return (
    <main>
      <header>
        <AccountMenu />
      </header>
      <p>Welcome back, John</p>
    </main>
  );
}
```

When the user clicks Menu and then Settings, the dropdown opens smoothly and the console logs `Settings`:

```page width=text caption="After the user clicks Menu and then Settings: the list is open and the Console prints Settings."
line: [Menu]
line: [Settings] [Sign out]
line: Welcome back, John
log: Settings | AccountMenu.jsx:11
```

The interface behaves as expected. Now each principle inspects the underlying runtime mechanics to reveal how the browser and React handle the click:

**PRINCIPLES:** While an `onClick` prop appears to attach a listener directly to a button, React retains the callbacks in component memory and coordinates dispatching from the root container. Four principles explain this architecture:
1. **Principle 1: Event Delegation at the Root.** Declaring `onClick` on a JSX element attaches no native listener to that DOM node. React listens at the root container and dispatches the callback.
2. **Principle 2: SyntheticEvent Construction.** React instantiates its own event object around the native browser event. The native event is preserved in `e.nativeEvent`, where `currentTarget` points to the root container.
3. **Principle 3: Propagation Along the Component Tree.** At the root, React executes capture handlers downward and bubbling handlers upward along the React component hierarchy.
4. **Principle 4: Coordination with Native Listeners.** A native listener on `document` runs strictly after React handlers. It will dismiss an active menu unless propagation is halted with `e.stopPropagation()`.

---

## PRINCIPLE | `onClick`: React keeps your function, and one listener on the root calls it

> [!PRINCIPLE]
> **Principle 1: Event Delegation: React Listens at the Root, Not on Each Tag**
>
> *Writing `onClick` on a tag adds no listener of ours to that tag; React attaches its listeners to the root, the DOM node given to `createRoot`, and they serve every `onClick` in the app.*
>
> A click starts on the button and bubbles up through every parent to `<div id="root">`. React's listener waits there, finds the `onClick` functions on the clicked tag and its parents, and calls them. That is why DevTools shows the click listeners on the root, and why a thousand `onClick` props never hand the browser a thousand of our functions.
>
> **DO THIS:**
> ```jsx
> <div>
>   <button ~onClick={handleSettings}~>Settings</button> {/* React calls handleSettings from its listener on the root */}
>   <button onClick={handleSignOut}>Sign out</button>
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div ~onClick={e => handleButton(e.target)}~> {/* **WRONG:** delegating by hand saves no listener, React already listens at the root */}
>   <button>Settings</button>
>   <button>Sign out</button>
> </div>
> ```

Consider the Settings button in isolation:

```jsx title="One button with onClick"
<button ~onClick~={() => console.log('Settings')}>Settings</button> {/* React keeps this function; the browser never gets it */}
```

When a user clicks the button, the browser console prints `Settings`. While the syntax feels familiar from Lesson 11, the mechanism raises a core architectural question. Which browser listener intercepts the click, and where does it reside in the DOM?

### Inspecting event listeners in browser DevTools

Browser developer tools allow you to inspect the active event listeners attached to any DOM element. In DevTools, select an element in the Elements inspector, then navigate to the **Event Listeners** tab adjacent to Styles. By default, the panel displays listeners inherited from all ancestor nodes. Untick the **Ancestors** checkbox to isolate listeners attached directly to the selected element.

**The active listener that executes our `onClick` handler does not reside on the Settings button. It resides on the root container element.**
1. **Selecting the Settings button DOM node.** The panel reveals a single `click` registration pointing to an empty no-operation function. React attaches this empty handler to interactive elements because Mobile Safari on iOS requires an event listener to bubble clicks reliably. Without it, Safari drops bubbling on certain tags. This handler performs no application logic and does not reference your callback.
2. **Selecting the `<div id="root">` container node.** The panel displays three click entries, all registered by React. One is the same empty placeholder attached during initialization. The remaining two entries are the functional delegator listeners registered when `createRoot` initializes.

These two delegator listeners divide event handling across the two primary DOM propagation phases:
- **The capture listener** activates as the browser event descends through ancestor elements.
- **The bubbling listener** activates as the event bubbles back up the document hierarchy. This listener executes standard `onClick` handlers.

The root container also displays listeners for numerous other event types, including keyboard input, pointer interactions, and form change events. React registers listeners for all supported synthetic events during root initialization, regardless of whether your components currently declare matching props.

```dom caption="The Elements panel: the click listeners that run our onClick sit on div#root, not on the Settings button."
<body>
+ <div id="root"> | note: React's two click listeners, added by createRoot
    <main>
      <header>
        <div>
          <button>Menu</button>
          <div>
*           <button>Settings</button> | note: Only an empty function from React, never our own
            <button>Sign out</button>
          </div>
        </div>
      </header>
      <p>Welcome back, John</p>
    </main>
  </div>
</body>
```

### How the root container registers delegator listeners

Our application code never explicitly calls `addEventListener` on the root container. React attaches these listeners automatically during initial startup. Here are the mounting files from Lesson 07:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <body>
    <div ~id="root"~></div> <!-- The root: React renders our app inside it -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```jsx title="src/main.jsx"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const container = document.getElementById('root');
const root = ~createRoot(container)~; // React takes over this div, and listens for events on it
root.render(<App />);
```

When `createRoot` executes, React completes three initialization steps:
1. The entry script invokes `createRoot` with a reference to the `<div id="root">` element.
2. React initializes its internal Fiber tree and claims ownership of the container DOM subtree.
3. Before rendering any component, React registers its delegator listeners on the container node. For click interactions, it attaches two listeners: one configured for capture and one configured for bubbling.

The root container actively listens for interactions before component rendering begins. Passing an `onClick` prop to a JSX element attaches no new listeners to the DOM. It merely registers a callback in React's component memory for invocation when a matching event bubbles to the root.

```tree dir=right caption="How a click on Settings reaches our function: the browser carries it up to the root, and React calls our onClick there."
How a click on Settings reaches our `onClick`
- +1. The user clicks Settings [`<button>Settings</button>`] | The browser starts the click event **on the button**
- +2. The click bubbles up [`div` `header` `main`] | The browser carries it **through every parent** | None of them has a listener of ours
- +3. React's listener on the root runs [`<div id="root">`] | React finds the `onClick` on the button | React **calls our function**, and the Console prints `Settings`
```

### Manual delegation patterns provide zero performance benefit in React

Developers transitioning from native DOM scripting often assume that every `onClick` prop creates a separate browser listener. In an effort to optimize memory, they attempt manual event delegation: removing handlers from child buttons and attaching a single `onClick` handler to a shared parent element. That parent handler manually inspects `e.target` to determine which button was clicked.

In React, manual delegation provides zero performance or memory benefit. React already delegates all events to the root container. Removing child handlers does not reduce the number of DOM listeners. It only introduces unnecessary branching logic and obscures component intent. You should declare `onClick` directly on the elements that handle the interaction.

Remember: an `onClick` prop registers your callback in component memory, while React's centralized listener at the root manages event dispatching.

---

## PRINCIPLE | `e`: React builds its own event object, and the browser's event sits inside `e.nativeEvent`

> [!PRINCIPLE]
> **Principle 2: The React Event Object: The Browser's Event Lives in `e.nativeEvent`**
>
> *Our handler receives a React event object, also called a synthetic event, that React builds from the browser event; the browser's own event is `e.nativeEvent`, and its `currentTarget` is the root, while `e.currentTarget` is the tag whose handler React is calling.*
>
> React's object follows the browser's event standard and fixes some browser differences, so `e` works like a browser event. But the browser's listener really runs on `<div id="root">`, so the browser event inside reports the root as its `currentTarget`. Read the clicked tag from React's object.
>
> **DO THIS:**
> ```jsx
> function handleSettings(e) {
>   console.log(~e.currentTarget~); // The Settings button, the tag whose onClick React is calling
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleSettings(e) {
>   console.log(~e.nativeEvent.currentTarget~); // **WRONG:** logs <div id="root">, where the browser's listener runs
> }
> ```

Your component event handlers receive an argument convention named `e`. This object exposes familiar properties from the W3C DOM specification, including `target` and `currentTarget`, as well as standard propagation methods. Despite its resemblance to a native DOM event, it is a custom wrapper instantiated by React.

Consider the output when logging `currentTarget` from both the wrapper and the underlying browser event:

```jsx title="Logging the two currentTarget values"
<button onClick={e => console.log(~e.currentTarget~, ~e.nativeEvent.currentTarget~)}>Settings</button> {/* Logs the button, then the root div */}
```

Both properties share the name `currentTarget` and originate from a single user click. Yet the first property evaluates to the Settings button, while the second evaluates to the root container element.

> [!DEFINITION]
> **SyntheticEvent object.** [NEW] A SyntheticEvent is a cross-browser wrapper instantiated by React that conforms to the standard W3C DOM event specification (Lesson 79).
> 1. When a native event bubbles to the root container, React constructs a synthetic event wrapper around the underlying browser event.
> 2. The wrapper normalizes behavioral inconsistencies across different browser engines, ensuring identical event attributes across platforms.
> 3. The underlying browser event remains accessible through the `e.nativeEvent` property.
>
> React instantiates this wrapper to decouple component logic from browser-specific quirks while maintaining full compatibility with standard event interfaces.

Why does React describe this wrapper as synthetic? In software architecture, synthetic refers to an artifact constructed programmatically by a framework rather than generated directly by the underlying host platform. The browser engine instantiates the native event in C++, whereas React constructs the synthetic event object in JavaScript.

The synthetic event implements the standard DOM event interface, allowing standard event handling patterns to operate seamlessly. In TypeScript, this abstraction is typed through `React.SyntheticEvent`, which provides the foundation for the interview question discussed later. Lesson 91 explores event typing patterns in depth.

The **`e.nativeEvent`** property preserves a direct reference to the original browser event. React retains this reference in case low-level code requires direct access to browser-specific properties, though standard application development rarely demands it.

```tree caption="One click, two event objects: the React event object our handler receives, and the browser event inside it."
What our handler receives when the user clicks Settings
- +The React event object [`e`] | Built **by React** from the browser event | `e.currentTarget` is **the Settings button**, the tag whose handler React is calling
- +The browser event inside it [`e.nativeEvent`] | Created **by the browser** for the click | `e.nativeEvent.currentTarget` is **`<div id="root">`**, where the browser's listener runs
```

### The menu logs both values

Now the Settings button receives a named handler, `handleSettings`, that logs both values. Only the menu component file changes:

```jsx title="src/AccountMenu.jsx" startLine="3"
export default function AccountMenu() {
  const [open, setOpen] = useState(false);

  function handleSettings(e) {
    console.log(~e.currentTarget~, ~e.nativeEvent.currentTarget~); // Logs the Settings button, then <div id="root">
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <div>
          <button onClick={~handleSettings~}>Settings</button> {/* React passes its own event object to handleSettings */}
          <button>Sign out</button>
        </div>
      )}
    </div>
  );
}
```

The user opens the menu and clicks Settings. The browser console displays the button element first and the root container second:

```devconsole caption="The Console after the user clicks Settings: e.currentTarget is the button, and e.nativeEvent.currentTarget is the root div."
+ <button>Settings</button> <div id="root">…</div> | AccountMenu.jsx:7
```

### Why the two values differ

In event systems, `currentTarget` identifies the element whose listener is actively processing the event. From the browser engine's perspective, the active listener is attached to `<div id="root">`. From React's perspective, the active callback belongs to the button component. Here is the physical execution sequence:
1. The user clicks the Settings button.
2. The browser event bubbles upward through intermediate DOM elements until reaching the root container.
3. React's listener on the root container executes. Because the browser listener is attached to the root, the native event assigns `<div id="root">` to `nativeEvent.currentTarget`.
4. React constructs the synthetic event from the native event. It locates the `onClick` prop in the component tree and dynamically assigns the button element to `e.currentTarget`.
5. React invokes `handleSettings(e)` with the synthetic event object.

By contrast, both `e.target` and `e.nativeEvent.target` reference the exact same DOM node. Both properties point directly to the physical button element where the user initiated the click. Only `currentTarget` diverges.

The underlying native event can also represent a different event type than the React prop suggests. For example, the official React documentation notes that React maps `onMouseLeave` props internally to native `mouseout` browser events. The documentation cautions that this mapping constitutes an internal implementation detail rather than a public API contract, so application logic should never depend on specific native event types.

### The mistake: reading the button from the browser's event

Developers occasionally assume that `e.nativeEvent` is more authoritative than React's synthetic wrapper because it represents the raw browser event. If they attempt to inspect the clicked element by reading `e.nativeEvent.currentTarget`, they receive the root container node instead of the button. Attempting to extract element data, such as dataset attributes or text content, will read attributes from the root container rather than the clicked button. Always inspect `e.currentTarget` to access the element associated with the executing React handler.

Remember: `e` is a synthetic wrapper constructed at the root container, holding the underlying browser event inside `e.nativeEvent`.

---

## PRINCIPLE | `onClick` order: React calls the clicked tag's handler first, then each parent's, along the React tree

> [!PRINCIPLE]
> **Principle 3: Propagation: React Copies the Browser's Order Along the React Tree**
>
> *React calls the capture handlers from the top of the React tree down to the clicked tag, then the `onClick` handlers from the clicked tag up, so the order matches the browser's; it walks the React tree, not the DOM tree.*
>
> The browser only calls React's listeners on the root. React then visits each tag of the React tree on the way up from the clicked button, and calls its `onClick`. On most pages the two trees match, so the order is the familiar one. A portal shows the difference: its clicks reach its React parent. `onScroll` is the one event that does not walk up.
>
> **DO THIS:**
> ```jsx
> <div onClick={() => console.log('menu')}>
>   <button onClick={e => { ~e.stopPropagation()~; handleSettings(e); }}>Settings</button> {/* React calls no onClick above the button */}
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div ~onScroll~={() => console.log('scrolled')}> {/* **WRONG:** onScroll does not propagate, so this never runs when the list scrolls */}
>   <ul className="notifications">{notifications}</ul>
> </div>
> ```

Consider what happens when you place an `onClick` prop on the Settings button and another on its surrounding container element:

```jsx title="An onClick on the button and on its parent div"
<div ~onClick~={() => console.log('menu')}> {/* Runs second */}
  <button ~onClick~={() => console.log('Settings')}>Settings</button> {/* Runs first */}
</div>
```

When the user clicks Settings, the console outputs `Settings` followed by `menu`. The child button handler executes first, followed by the parent container handler, matching standard browser bubbling order (Lesson 11).

While the dispatch order mirrors native browser bubbling, the dispatching engine is entirely different. The browser never invokes the parent container handler during native bubbling, because no native listeners exist on the parent element. React orchestrates the entire traversal internally.

### How React simulates event propagation at the root

As established in Principle 1, React attaches two delegator listeners to the root container. React utilizes these listeners to simulate the standard DOM dispatch phases:
1. **The capture phase.** As the browser dispatches the click downward from the document window toward the target, the event encounters the root container first. React's capture listener executes, invoking all `onClickCapture` handlers from the top of the component tree down to the target.
2. **The target phase.** The native event arrives at the clicked button element in the DOM. Because no native listeners reside on the button, no application code executes at this stage.
3. **The bubbling phase.** The native event bubbles upward from the button back to the root container. React's bubbling listener executes, invoking all standard `onClick` handlers upward from the target component to the root.

React resolves these handler functions by traversing the **React component tree** (Lesson 06), rather than the browser DOM tree. In typical components, the component hierarchy matches the DOM hierarchy, producing identical traversal sequences.

React Portals demonstrate the fundamental distinction between the two trees. A portal renders its underlying DOM nodes into an external container, such as `document.body`, completely outside the application root container (Lesson 51). Nevertheless, an interaction inside a portal still triggers `onClick` handlers on its parent React components. The official React documentation explains that portal events propagate according to the React component hierarchy rather than the physical DOM hierarchy.

```tree dir=right caption="A click on Settings: the browser carries it down and up, and React calls the handlers each time the click passes the root."
How React runs the handlers for one click on Settings
- +1. Capture phase, at the root [`onClickCapture`] | React's capture listener runs | React calls capture handlers **from the top down**
- +2. At the button [`<button>Settings</button>`] | The browser event reaches **the clicked tag** | No code of ours runs here
- +3. Bubbling phase, at the root [`onClick`] | React's bubbling listener runs | React calls `onClick` **from the button up**: `Settings`, then `menu`
```

### The menu shows the walk

For this demonstration step, the outer container element of the menu receives an `onClick` prop that logs the string `menu`. Only the menu file changes:

```jsx title="src/AccountMenu.jsx" startLine="10"
  return (
    <div ~onClick~={() => console.log('menu')}> {/* React calls this after the handler of any button inside */}
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <div>
          <button onClick={handleSettings}>Settings</button>
          <button>Sign out</button>
        </div>
      )}
    </div>
  );
```

The user clicks Menu, then Settings. The initial `menu` log entry originates from clicking the Menu toggle, because the toggle button resides inside the menu container. The subsequent two entries originate from clicking Settings:

```devconsole caption="The Console after the user clicks Menu and then Settings: on each click, the button's handler runs first and the menu div's handler second."
+ menu | AccountMenu.jsx:11
+ <button>Settings</button> <div id="root">…</div> | AccountMenu.jsx:7
+ menu | AccountMenu.jsx:11
```

By the time your handler executes, the native browser event has already bubbled past the menu container and reached the root. The execution sequence feels like native bubbling because React traverses the component tree from the target upward, invoking matching callbacks one node at a time:
1. The user clicks the Settings button.
2. The native browser event bubbles from the button through intermediate container tags up to the root container. No application code executes during this ascent.
3. React's bubbling listener on the root container intercepts the event.
4. React begins at the Settings button Fiber node and invokes `handleSettings`. The console prints the target elements.
5. React ascends to the parent menu container Fiber node and invokes its `onClick` prop, printing `menu` to the console.

### Halting propagation with `e.stopPropagation()`

Invoking `e.stopPropagation()` inside a React handler stops this upward traversal. The official React documentation notes that stopping propagation halts event progression through the React tree. As a result, React skips all handlers registered on ancestor components.

### The propagation exception: `onScroll`

The official React documentation states that nearly all events propagate in React, with the notable exception of `onScroll`. Scroll events do not bubble in the DOM specification. In React, `onScroll` handlers execute only on the specific JSX element that triggers scrolling. Attaching an `onScroll` prop to a parent container will never intercept scrolling inside a nested scrollable list.

Remember: while event dispatch order mirrors browser bubbling conventions, React manages traversal internally at the root container along the component hierarchy.

---

## PRINCIPLE | `document.addEventListener`: the listener runs after every `onClick`, unless a React handler stops the click

> [!PRINCIPLE]
> **Principle 4: React and the Browser: A `document` Listener Runs After Every React Handler**
>
> *A browser listener on `document` hears a click only after the browser event has left the root, so it runs after every React handler; a React handler that calls `e.stopPropagation()` keeps the click from reaching it.*
>
> React runs every `onClick` while the browser event sits at `<div id="root">`. `document` sits above the root, so its listener runs last. Stop the click on the `div` that holds the whole menu, or let it through and check with `contains()` whether it happened inside the menu.
>
> **DO THIS:**
> ```jsx
> <div onClick={e => ~e.stopPropagation()~}> {/* Every click inside the menu stops here, before document */}
>   <button onClick={() => setOpen(!open)}>Menu</button>
>   {open && <button onClick={handleSettings}>Settings</button>}
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div>
>   <button onClick={e => { ~e.stopPropagation()~; setOpen(!open); }}>Menu</button> {/* **WRONG:** a click on Settings still reaches document and closes the menu */}
>   {open && <button onClick={handleSettings}>Settings</button>}
> </div>
> ```

A common UI requirement is closing an active dropdown menu when a user clicks anywhere outside its boundary. No individual React element encompasses the entire viewport, because an interaction may occur on unrelated elements across the page. Developers typically address this by registering a native listener on the top-level `document` object. An Effect registers the listener when the menu opens, and its cleanup function unbinds it upon dismissal (Lesson 32):

```jsx title="Closing the menu on any click on the page"
useEffect(() => {
  if (!open) return;
  function handleDocumentClick() {
    setOpen(false);
  }
  ~document.addEventListener~('click', handleDocumentClick); // A browser listener, outside React
  return () => document.removeEventListener('click', handleDocumentClick);
}, [open]);
```

**Native event listeners attached to `document` always execute after React finishes processing component handlers.** The document node sits at the top of the DOM hierarchy above `<body>` and `<div id="root">`. When a user clicks an element, the native event bubbles to the root container first, where React executes all matching `onClick` callbacks. Only after React completes its event cycle does the native event resume bubbling upward through `<body>` to `document`.

### Why registering the document listener inside an Effect prevents the menu from opening

Incorporate the Effect into the menu component and remove the temporary logging handler from Principle 3:

```jsx title="src/AccountMenu.jsx"
import { useEffect, useState } from 'react';

export default function AccountMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleDocumentClick() {
      setOpen(false);
    }
    ~document.addEventListener~('click', handleDocumentClick); // Hears every click that leaves the root
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [open]);
```

When the user clicks the Menu button, **the dropdown menu fails to open**. The menu opens and closes within the exact same user interaction, rendering it invisible to the user:

```page width=text caption="After the user clicks Menu with only the document listener added: the list never appears."
line: [Menu] | bad
line: Welcome back, John
console: quiet
```

The single click that triggers the opening logic also registers the document listener, and that same bubbling event immediately triggers the newly attached listener:
1. The user clicks the Menu button.
2. The native event bubbles to the root container. React invokes the `onClick` handler on the Menu button, triggering `setOpen(true)`.
3. React updates component state and schedules a render. For discrete user interactions such as clicks, React flushes updates and executes pending Effects synchronously before the browser completes event dispatching.
4. Because `open` evaluates to true, the Effect executes immediately and registers the native click listener on `document`.
5. The original native click event continues its ascent from the root container through `<body>` to `document`. The newly attached document listener intercepts this ongoing event and invokes `setOpen(false)`.
6. React schedules another render to close the menu. The user observes no visual change.

The synchronous execution described in step 3 represents core React runtime behavior since React 18. The official upgrade guide explains that React flushes passive effect functions synchronously when triggered by discrete user inputs like clicks.

### Why stopping propagation on the toggle button alone introduces submenu bugs

To prevent the initial click from reaching `document`, the event must be intercepted. In React, calling `e.stopPropagation()` halts React's component tree traversal and simultaneously calls `stopPropagation` on the underlying native browser event resting at the root container. Because `document` resides above the root in the DOM hierarchy, the native event never reaches it.

A naive initial attempt places `e.stopPropagation()` exclusively on the Menu toggle button:

```jsx title="src/AccountMenu.jsx" startLine="19"
  return (
    <div>
      <button onClick={e => { ~e.stopPropagation()~; setOpen(!open); }}>Menu</button> {/* The opening click never reaches document */}
      {open && (
        <div>
          <button onClick={handleSettings}>Settings</button>
          <button>Sign out</button>
        </div>
      )}
    </div>
  );
```

With this change, clicking the Menu button opens the dropdown menu as expected:

```page width=text caption="With e.stopPropagation on the Menu button only, after the user clicks Menu: the menu opens and shows Settings and Sign out."
line: [Menu]
line: [Settings] [Sign out]
line: Welcome back, John
console: quiet
```

However, when the user clicks Settings inside the open menu, **the dropdown menu abruptly closes**. This reproduces the defect highlighted at the beginning of the lesson:

```page width=text caption="The same page right after the user clicks Settings: the list is gone, though the click was inside the menu."
line: [Menu]
line: Welcome back, John | bad
log: <button>Settings</button> <div id="root">…</div> | AccountMenu.jsx:16
```

The click on Settings closes the menu because nothing halted its bubbling path:
1. The user clicks Settings inside the active menu.
2. The native event bubbles to the root container. React invokes `handleSettings`, logging both target elements.
3. No handler along this component branch calls `e.stopPropagation()`. The handler on the Menu button lies on an adjacent branch and is never evaluated.
4. The native event leaves the root container and bubbles to `document`. The document listener receives the event and executes `setOpen(false)`.
5. The menu collapses despite the interaction occurring within its boundary.

Clicking the Sign out button triggers the identical defect. Manually adding `e.stopPropagation()` to every present and future button inside the menu is tedious and error-prone.

### Halting propagation on the shared menu container

The robust architectural solution attaches a single `e.stopPropagation()` call to the container element enclosing both the toggle button and the dropdown list. During React's upward component traversal, every interaction inside the menu must pass through this container node, ensuring propagation stops before reaching the document listener:

```jsx title="src/AccountMenu.jsx" startLine="19"
  return (
    <div onClick={e => ~e.stopPropagation()~}> {/* No click inside the menu reaches document */}
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <div>
          <button onClick={handleSettings}>Settings</button>
          <button>Sign out</button>
        </div>
      )}
    </div>
  );
```

When the user clicks Menu, the dropdown opens. Clicking Settings executes its action while the menu remains visible:

```page width=text caption="With e.stopPropagation on the menu div, after the user clicks Settings: the list stays open."
line: [Menu]
line: [Settings] [Sign out] | good
line: Welcome back, John
log: <button>Settings</button> <div id="root">…</div> | AccountMenu.jsx:16
```

When the user subsequently clicks the welcome text outside the menu, the dropdown dismisses. Because that paragraph sits outside the menu container, its event bubbles uninhibited to the root and onto `document`:

```page width=text caption="The same page after the user then clicks Welcome back, John: the list closes."
line: [Menu]
line: Welcome back, John | good
log: <button>Settings</button> <div id="root">…</div> | AccountMenu.jsx:16
```

The placement of `e.stopPropagation()` determines interaction boundaries across the component hierarchy:
- **Calling `e.stopPropagation()` on the toggle button** traps only the opening click. Clicks on nested menu items escape to `document` and unintentionally dismiss the menu.
- **Calling `e.stopPropagation()` on the parent menu container** encapsulates all nested interactions. Every interaction inside the menu encounters the container handler and halts propagation before escaping the root.

### Execution timing of native listeners registered inside the root container

A native browser listener can also be attached directly to an element inside the root container using `addEventListener` via a React DOM ref (Lesson 31). Such listeners execute prior to any React `onClick` handler. The native event bubbles past the element before arriving at the root container delegator. If a React handler subsequently calls `e.stopPropagation()`, the nested native listener has already finished execution. React cannot prevent it from running.

The placement of a native browser listener relative to the root container dictates its execution order:

```tree caption="Where a browser listener sits decides when it hears a click, compared with React's onClick handlers."
When a browser listener hears a click on Settings
- +On a tag inside the root [`addEventListener` through a ref] | The click passes the tag **before** it reaches the root | Runs **before every `onClick`**; `e.stopPropagation` in React **cannot stop it**
- +On `<div id="root">` [React's listeners] | React runs **every `onClick`** here | `e.stopPropagation` stops React's walk **and the browser event**
- !On `document` [`document.addEventListener`] | The click arrives **after** it has left the root | Runs **after every `onClick`**; never runs if a React handler stopped the click
```

### Alternative pattern: inspecting element boundaries with contains

Calling `e.stopPropagation()` on the menu container conceals all internal interactions from listeners registered on window or document. This approach works when no external systems require click data. However, enterprise applications frequently run global analytics listeners that log user interactions across the entire viewport. Blanket propagation suppression prevents these monitoring tools from recording button clicks.

In such architectures, you should allow native events to bubble freely to `document` and inspect event boundaries using a React ref and the native `Node.contains` method (Lesson 31). The document listener checks whether the clicked target resides inside the menu container:

```jsx title="src/AccountMenu.jsx with a contains check instead of e.stopPropagation"
import { useEffect, useRef, useState } from 'react';

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleDocumentClick(e) {
      if (~menuRef.current.contains(e.target)~) return; // A click inside the menu: keep it open
      setOpen(false);
    }
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [open]);

  function handleSettings(e) {
    console.log(e.currentTarget, e.nativeEvent.currentTarget);
  }

  return (
    <div ~ref={menuRef}~> {/* No e.stopPropagation: every click still reaches document */}
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <div>
          <button onClick={handleSettings}>Settings</button>
          <button>Sign out</button>
        </div>
      )}
    </div>
  );
}
```

From the user perspective, the UI behaves identically. The menu opens, remains open when clicking Settings, and dismisses when clicking the outside welcome text. The initial click on the toggle button also bubbles to `document`, but because `menuRef.current.contains(e.target)` evaluates to true, the handler takes no action.

### Comparing propagation suppression with boundary inspection

While both approaches achieve identical visual behavior, their architectural implications differ significantly:
- **Using `e.stopPropagation()` on the container element** halts native event propagation at the root container. Listeners attached to `document` never receive events originating inside the component.
- **Using boundary inspection with `Node.contains`** permits native events to bubble freely throughout the entire DOM. Global listeners for telemetry or analytics receive all interactions, while the menu handler selectively ignores internal clicks.

Remember: listeners attached to `document` execute strictly after React handlers. You must either encapsulate interactions with container-level propagation control or inspect element containment at the document boundary.

---

## All 4 Principles Together

### The complete files

The HTML template and entry files remain identical to the setup from Lesson 07 shown in Principle 1. Here are the completed component files:

```jsx title="src/App.jsx"
import AccountMenu from './AccountMenu.jsx';

export default function App() {
  return (
    <main>
      <header>
        <AccountMenu />
      </header>
      <p>Welcome back, John</p> {/* A click here reaches document and closes the menu */}
    </main>
  );
}
```

```jsx title="src/AccountMenu.jsx"
import { useEffect, useState } from 'react';

export default function AccountMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleDocumentClick() {
      setOpen(false);
    }
    ~document.addEventListener~('click', handleDocumentClick); // Principle 4: runs after every React handler
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [open]);

  function handleSettings(e) {
    console.log(~e.currentTarget~, ~e.nativeEvent.currentTarget~); // Principle 2: the button, then the root div
  }

  return (
    <div onClick={e => ~e.stopPropagation()~}> {/* Principles 3 and 4: React reaches this div after the button, and stops the click here */}
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <div>
          <button ~onClick~={handleSettings}>Settings</button> {/* Principle 1: no listener of ours on this button */}
          <button>Sign out</button>
        </div>
      )}
    </div>
  );
}
```

### The order of one click on Settings

When a user clicks Settings within the open menu, the browser engine and React coordinate execution in this sequence:

```tree dir=right caption="One click on Settings in the finished menu: who runs, in which order, and where the click stops."
One click on Settings
- +1. Capture phase, at the root [React's capture listener] | React looks for `onClickCapture` | There is none, so nothing of ours runs
- +2. Bubbling phase, at the root [React's bubbling listener] | React calls `handleSettings`, then the `onClick` of the menu `div` | The Console logs the button and the root; the `div` calls `e.stopPropagation`
- !3. `document` [`handleDocumentClick`] | The browser event **never arrives** | The menu **stays open**
```

### What developers expect, and what React really does

| Principle | What a developer expects | What React really does |
| :--- | :--- | :--- |
| **1. The listener sits on the root** | `onClick` adds a click listener to the Settings button | React's listener on `<div id="root">` hears the click and calls our function |
| **2. `e.nativeEvent`** | `e` is the browser's click event | `e` is React's event object; the browser event is `e.nativeEvent`, whose `currentTarget` is the root |
| **3. React's walk** | The browser calls the parent's `onClick` as the click passes the parent | React calls each `onClick` from the button up the React tree, after the click has reached the root |
| **4. The `document` listener** | All handlers run in one chain, in the order of the tags | A listener on `document` runs after every React handler, unless a React handler stopped the click |

Remember the foundational rule of this lecture: **An `onClick` prop attaches no direct listener to its element. React's centralized delegator at the root executes all component handlers, after which the native event continues to document listeners.**

---

## For the Interview

> **The Interview Question:** How does React's SyntheticEvent delegator work at the root DOM container?

### How to Answer Clearly in 30 Seconds

"React avoids attaching individual native event listeners to DOM nodes for every element declaring an `onClick` prop. When `createRoot` initializes, React attaches top-level delegator listeners directly to the root DOM container element. Through event delegation, interactions bubble from the target DOM element up to the root container, where React intercepts them.
1. **Event object synthesis:** React constructs a synthetic event wrapper that normalizes cross-browser differences while complying with the W3C event specification. The underlying browser event remains accessible via `e.nativeEvent`.
2. **Tree propagation:** Within its root listeners, React reproduces standard capture and bubbling phases by traversing the React component Fiber tree. It dispatches capture handlers downward and bubbling handlers upward, honoring `e.stopPropagation()`.
3. **Native coordination:** Because React processes events at the root container, native listeners attached to `document` execute strictly after all React handlers have completed."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"If a list has ten thousand rows, each with `onClick`, does the browser get ten thousand click listeners?"**
   The browser does not register ten thousand separate listeners. React registers its delegator listeners on the root container once during initialization, and none of the row callbacks are attached to individual DOM nodes. Each row element receives only an empty no-op handler required for Mobile Safari bubbling compatibility. In large lists, performance overhead stems from component rendering and memory allocation for callback closures. It does not come from registering native DOM listeners (Lessons 54 and 62).
2. **"Why can `e.currentTarget` and `e.nativeEvent.currentTarget` be different?"**
   They diverge because they reflect two distinct event listeners executing at different architectural levels. For the browser engine, the actively executing listener is React's delegator attached to `<div id="root">`, so `e.nativeEvent.currentTarget` points to the root container. As React traverses its internal component tree, it sets `e.currentTarget` on the synthetic wrapper to the specific element whose component handler is currently executing. The synthetic event provides the element reference expected by application logic.
3. **"Where did React attach its listeners before React 17, and why did it move them?"**
   Prior to React 17, React attached all delegated event listeners to the global `document` node. React 17 relocated delegators to the host root container passed to `createRoot`. Under the legacy architecture, delegating to `document` caused `e.stopPropagation()` inside React handlers to execute too late to prevent other document-level listeners from firing. Furthermore, embedding multiple React applications or microfrontends on a single page caused conflicting event interception. Delegating to the root container ensures each React instance safely encapsulates its own event dispatching without cross-app interference.
