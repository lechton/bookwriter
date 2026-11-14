# Lecture 30: How useRef Keeps a Value Between Renders

*(How can a component remember a number without rendering again?)*

> INTERVIEW QUESTION | ❱ CORE | How do you keep a value between renders without triggering a re-render?

---

## VS | State `useState` vs. a Ref `useRef`: both remember the value, only state renders again

> Some values, like a timer ID or a background click counter, never show up on the screen, but still need to survive between renders. **You should keep that value in a ref.** React keeps the ref across renders, and changing it does not make React draw the screen again.

In React, **not all information belongs on the screen**. A component frequently tracks behind-the-scenes data that never affects its visual layout, such as a background timer ID, a cached measurement, or an analytics click counter. Normally, we store component data in state with `useState` so values survive between renders. Every time a state setter receives a new value, React re-renders the component to update the user interface. For invisible data, re-rendering the component is wasted work. This is why React provides `useRef`. It preserves a value across renders without triggering a re-render, allowing your event handlers to save data now and read it during a later user interaction.

Consider a product card where the user selects different shirt colors and then clicks **Buy**. Suppose you want to track how many times the user switched colors before purchasing, and send that total when they click **Buy**. Does the user ever see this interaction counter on the screen? No, only the selected shirt color updates visually. The counter stays internal to the component, and only the purchase handler reads that number when sending analytics.

**Why:** A plain JavaScript variable like `let clicks = 0` fails here because it resets on every render. Each time the user selects a new color, state updates, the component function executes again from the top, and `let clicks = 0` reinitializes to zero. Conversely, storing the counter in `useState` forces an unnecessary re-render on every single click, redrawing the entire product card for a number the user never sees. We need the value to survive between renders without triggering any redraws. `useRef` provides this exact capability: it holds the count across renders without forcing React to draw the screen again.

### A Ref in Two Lines of Code

Here is a ref in two lines of code:

```jsx title="A ref"
const countRef = ~useRef(0)~; // countRef is the object { current: 0 }
~countRef.current = 5~; // Change it like any field of any object: no setter, no render
```

> [!DEFINITION]
> **What is a ref?** [NEW] A ref is a plain JavaScript object with a single property, `current`, that React retains for a component instance across renders.
> 1. You create a ref inside your component: `const countRef = useRef(0)`. On the initial render, React creates the object `{ current: 0 }`.
> 2. On every subsequent render, React hands back the exact same object reference in memory.
> 3. You read and write `countRef.current` directly, without a setter function: `countRef.current = 5`.
> 
> A ref holds mutable data without affecting rendering. Modifying `current` changes the value immediately in memory, but because there is no setter, React is not notified and never triggers a re-render (Lesson 30).

The official React documentation summarizes this difference in two sentences: "Like state, refs are retained by React between re-renders. However, setting state re-renders a component. Changing a ref does not!"

### The smallest ref: a click counter

Here is a button that counts its clicks in a ref, and logs the count:

```jsx title="Counter.jsx"
import { useRef } from 'react';

export default function Counter() {
  const countRef = ~useRef(0)~; // The object { current: 0 }

  function handleClick() {
    ~countRef.current = countRef.current + 1~; // Changes the field, and React does not render
    console.log('You clicked ' + countRef.current + ' times');
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

The user clicks three times:

```page width=text caption="After three clicks: the button is unchanged, and the Console shows every click."
line: [Click me]
log: You clicked 1 times | Counter.jsx:8
log: You clicked 2 times | Counter.jsx:8
log: You clicked 3 times | Counter.jsx:8
```

The ref preserved the count across clicks, progressing from 1 to 2 to 3. The user interface on the screen remained completely static because no state setter was called to request a new render.

### The Rule of Thumb: is the value on the screen?

**Ask one decisive question about every piece of data: does this value appear on the screen? If yes, store it in `useState`. If only your event handlers or background tasks need it, store it in `useRef`.**

The official React documentation recommends the same distinction: "When a piece of information is used for rendering, keep it in state. When a piece of information is only needed by event handlers and changing it doesn't require a re-render, using a ref may be more efficient."

A senior developer understands the three classic pitfalls when managing component values:
1. **A local variable inside the component body.** Declaring `let` inside the component resets on every render (Lesson 13), discarding the stored value as soon as React re-renders.
2. **A module variable outside the component body.** Declaring `let` outside the component survives renders, but every mounted copy of the component shares that single variable.
3. **Reading or writing a ref in JSX.** Mutating a ref does not trigger a re-render, so the user interface continues displaying stale information.

The rest of this lesson explores each pitfall using a working stopwatch.

## SECTION | A Stopwatch with Start and Stop

Our page displays a stopwatch with one display line and two buttons.

```page width=text caption="The stopwatch when the page opens."
line: Seconds: 0
line: [Start] [Stop]
console: quiet
```

To count elapsed seconds, the stopwatch uses a browser timer function:

```js title="Start a timer, stop a timer"
const id = ~setInterval(tick, 1000)~; // Calls tick every second, and returns a number: the interval ID
~clearInterval(id)~; // Stops the timer with that ID
```

> [!DEFINITION]
> **What is setInterval?** [NEW] `setInterval` is a standard browser API that repeatedly executes a callback function at a fixed time interval.
> 1. Calling `setInterval(tick, 1000)` schedules the browser to execute `tick` every 1000 milliseconds, or once per second.
> 2. It returns a positive integer called the interval ID, which uniquely identifies that active timer in the browser runtime.
> 3. To stop the timer, you pass that specific ID to `clearInterval(id)`. If your code loses this numeric ID, it can never cancel the timer.
> 
> If you pass `null`, `undefined`, or an invalid number to `clearInterval`, the browser silently ignores the call without throwing an error, and the active timer continues running in the background. Unlike `setTimeout`, which runs its callback once (Lesson 15), `setInterval` repeats indefinitely until cancelled (Lesson 30).

The stopwatch component must track two distinct values:
1. **The elapsed seconds.** This value is rendered directly in JSX, so it must live in state.
2. **The interval ID.** This value is never rendered to the user. Only the Start and Stop click handlers need it, so it belongs in a ref.

Here is the working stopwatch implementation:

```jsx title="src/Stopwatch.jsx"
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = ~useState(0)~; // On the screen: state
  const intervalRef = ~useRef(null)~; // Not on the screen: a ref, starts as { current: null }

  function handleStart() {
    clearInterval(intervalRef.current);
    ~intervalRef.current = setInterval~(() => { // Stores the new interval ID in the ref
      setSeconds(s => s + 1);
    }, 1000);
  }

  function handleStop() {
    ~clearInterval(intervalRef.current)~; // Reads the same ID, many renders later
  }

  return (
    <section>
      <p>Seconds: {seconds}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </section>
  );
}
```

The user clicks Start, waits three seconds, and clicks Stop. Ten seconds later:

```page width=text caption="Ten seconds after Stop: the line still says 3."
line: Seconds: 3 | good
line: [Start] [Stop]
console: quiet
```

The stopwatch functions correctly. The timer calls `setSeconds` every second, prompting React to re-render the component and update the display. Throughout all those re-renders, `intervalRef` preserves the timer ID intact. When the user clicks Stop several seconds later, the click handler retrieves that exact ID from `intervalRef.current` and halts the timer.

Notice an essential detail: the timer callback updates state using an updater function, `setSeconds(s => s + 1)` (Lesson 16). If it called `setSeconds(seconds + 1)`, the closure would capture the `seconds` value from the initial render where Start was clicked. The display would increment from 0 to 1 on the first tick and then remain stuck at 1 forever (Lesson 15).

Now let us deliberately break this implementation. Each upcoming principle moves the interval ID to a different location to demonstrate what fails:

**PRINCIPLES:** `useState` remembers data and triggers a re-render. `useRef` remembers data and does NOT trigger a re-render. Five core principles follow:
1. **Principle 1: useRef Returns the Same Object on Every Render.** React consumes the initial argument on the first render, and returns the exact same object reference on all subsequent renders.
2. **Principle 2: A let Inside the Component Resets on Every Render.** The local variable reinitializes to `null` on every tick, leaving the Stop button unable to halt the timer.
3. **Principle 3: Keep in State Only What the Screen Shows.** Storing the timer ID in state works, but triggers redundant re-renders for data the user never sees.
4. **Principle 4: A let Outside the Component Is Shared.** A module-level variable is shared across all instances, causing separate stopwatch components to cancel each other.
5. **Principle 5: Never Read a Ref in the JSX.** Reading a ref in JSX leaves the display frozen, because mutating a ref never notifies React to redraw the screen.

---

## PRINCIPLE | useRef: the value survives every render

> [!PRINCIPLE]
> **Principle 1: useRef Returns the Same Object on Every Render**
>
> *React uses the initial argument of useRef only on the first render. On every subsequent render, it returns the exact same object, preserving whatever value you stored in current.*
>
> The line calling useRef runs on every render alongside the rest of your component body. Although it appears to reinitialize the ref, it does not. React creates the container object once and keeps it attached to that component instance. When you mutate current, the new value is available immediately on the very next line of code.
>
> **DO THIS:**
> ```jsx
> function handleStart() {
>   clearInterval(intervalRef.current);
>   ~intervalRef.current~ = setInterval(tick, 1000); // The old timer stops first, then the new ID is stored
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleStart() {
>   ~intervalRef.current~ = setInterval(tick, 1000); // **WRONG:** a second click loses the first ID, and that timer never stops
> }
> ```

Consider how this declaration behaves across renders:

```jsx title="A line that runs on every render"
const intervalRef = ~useRef(null)~; // The null is used on the first render only
```

This line executes on every single render. Why does it not overwrite `intervalRef.current` back to `null` each time? React treats initial and subsequent renders differently:
1. **On the initial render**, React allocates the object `{ current: null }` and attaches it to this component instance.
2. **On every subsequent render**, React returns that existing object reference. The `null` argument is completely ignored.

The official React documentation confirms this behavior: "This argument is ignored after the initial render."

```tree dir=right caption="The same useRef line on the first render and on every later render."
The line `useRef` with the start value `null`
- +First render | React **creates** the object | `current` is `null`
- +Every later render | React **returns the same object** | `current` keeps **what you stored**
```

### current changes at once

State variables operate as per-render snapshots. When you call `setCount(5)`, the local `count` variable retains its previous value throughout the remainder of the current function call (Lesson 15). A ref does not use snapshots. It is a plain mutable JavaScript object, and mutating its property updates the value immediately:

```jsx title="Right after the setter, and right after changing current"
setCount(5);
console.log(~count~); // The old value: this render's snapshot
countRef.current = 5;
console.log(~countRef.current~); // 5: the field changed right away
```

### Why Start stops the old timer first

The opening statement in `handleStart` calls `clearInterval(intervalRef.current)`. Without this defensive check, clicking Start twice in rapid succession corrupts the stopwatch:
1. The first click starts timer A, and its ID is assigned to `intervalRef.current`.
2. The second click starts timer B, overwriting `intervalRef.current` with B's ID. The reference to timer A is permanently lost.
3. Both timers now execute their callbacks every second, causing the counter to increment twice as fast.
4. When the user clicks Stop, `clearInterval` cancels only timer B. Timer A continues running in the background indefinitely, with no remaining reference to stop it.

Calling `clearInterval(intervalRef.current)` first ensures that any existing timer is cancelled before a new one begins. On the initial click, the ref holds null, and passing it to `clearInterval` is safely ignored by the browser.

---

## PRINCIPLE | let inside a component: the value resets on every render

> [!PRINCIPLE]
> **Principle 2: A let Inside the Component Resets on Every Render**
>
> *A local let variable inside the component body reinitializes on every render. The interval ID saved during the Start click is lost before the Stop click can read it.*
>
> The running timer calls setSeconds once every second, triggering a component re-render on every tick. Each re-render executes the component body again from the start, creating a brand-new local variable initialized to null. When the user clicks Stop, the handler reads that new null, clearInterval does nothing, and the timer continues ticking without any error.
>
> **DO THIS:**
> ```jsx
> const intervalRef = ~useRef(null)~; // The same object on every render
> function handleStop() { clearInterval(intervalRef.current); }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> let ~intervalId = null~; // **WRONG:** a new null on every render, so Stop has no ID
> function handleStop() { clearInterval(intervalId); }
> ```

Most developers first attempt to store the ID in a local variable, following normal JavaScript intuition:

```jsx title="src/Stopwatch.jsx" bad="5,14"
import { useState } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  let ~intervalId = null~; // **WRONG:** this line runs again on every render

  function handleStart() {
    intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function handleStop() {
    clearInterval(~intervalId~); // **WRONG:** reads the new null, so nothing stops
  }

  return (
    <section>
      <p>Seconds: {seconds}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </section>
  );
}
```

The user clicks Start, waits three seconds, and clicks Stop. Two seconds later:

```page width=text caption="Two seconds after Stop: the line went on from 3 to 5."
line: Seconds: 5 | bad
line: [Start] [Stop]
console: quiet
```

**The stopwatch completely ignores the Stop button, and the browser Console displays no error.** Here is the exact sequence of events:
1. The user clicks Start. The browser returns an interval ID, and code assigns it to `intervalId`.
2. One second later, the timer fires and calls `setSeconds`, prompting React to re-render the component.
3. During this re-render, React re-executes the component function from top to bottom. The declaration `let intervalId = null` runs again, creating a fresh local variable initialized to null.
4. The re-render also creates a fresh `handleStop` function, which closes over the newly created variable holding null.
5. When the user clicks Stop, `clearInterval(null)` executes. The browser silently ignores null, and the timer continues ticking uninterrupted.

This defect can easily mislead developers during quick manual testing. If you click Start and immediately click Stop within less than one second, the timer stops successfully. Because one second has not elapsed, `setSeconds` has not fired, no re-render has occurred, and `intervalId` still holds the active ID. Once the first second passes and a re-render runs, the ID is lost forever.

The official React documentation highlights this exact bug in an example with an Undo button that stores a timeout ID in a local variable. When the component re-renders, the timeout ID is lost, and clicking Undo fails. The official solution matches ours: "store it in a ref, which React will preserve between renders."

Remember this fundamental distinction: a local `let` inside a component body forgets its value on every render, while `useRef` remembers it.

---

## PRINCIPLE | useState: every change renders again, so keep only what the screen shows

> [!PRINCIPLE]
> **Principle 3: Keep in State Only What the Screen Shows**
>
> *Storing the interval ID in state works, but every state update triggers an unnecessary re-render for data that never appears on the screen.*
>
> Calling a state setter always requests a new render from React. For elapsed seconds, that re-render is essential because the screen must display the updated count. For the interval ID, re-rendering changes nothing visible on the screen. Store values that drive the user interface in state, and store values used only by event handlers in a ref.
>
> **DO THIS:**
> ```jsx
> const [seconds, setSeconds] = useState(0);
> const intervalRef = ~useRef(null)~; // Not on the screen, so changing it does not render
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [seconds, setSeconds] = useState(0);
> const [intervalId, setIntervalId] = ~useState(null)~; // **WRONG:** every new ID renders the component again for nothing
> ```

A developer who knows only `useState` might store the interval ID in state. The stopwatch stops when clicking Stop, but it introduces an invisible performance defect.

To observe this defect, place a log statement at the top of the component, and clear the Console right before clicking Stop:

::: row caption="One click on Stop: the ID in state renders the component again, the ID in a ref does not."
::: col title="The ID in state" tag="Stop renders again" tone=bad
```page size=mini
line: Seconds: 3
line: [Start] [Stop]
log: Stopwatch rendered | Stopwatch.jsx:6
log: Stopwatch rendered | Stopwatch.jsx:6
```
```jsx title="Stopwatch.jsx" startLine="5" bad="1,5"
const [intervalId, setIntervalId] = useState(null);
console.log('Stopwatch rendered');
function handleStop() {
  clearInterval(intervalId);
  setIntervalId(null);
}
```
The setter makes React render, so the log prints.
:::
::: col title="The ID in a ref" tag="Stop does not render" tone=good
```page size=mini
line: Seconds: 3
line: [Start] [Stop]
quiet: No messages
```
```jsx title="Stopwatch.jsx" startLine="5" good="1,4"
const intervalRef = useRef(null);
console.log('Stopwatch rendered');
function handleStop() {
  clearInterval(intervalRef.current);
}
```
No setter, so no render, and the Console stays empty.
:::
:::

The visible output on the screen is identical in both versions. With state, however, calling `setIntervalId(null)` forces React to re-render the entire component for a number that never appears in the JSX. The exact same redundant render occurs when clicking Start. The console log prints twice because React Strict Mode invokes component functions twice during development to detect unexpected side effects (Lesson 14).

There is also a second pitfall with state. If you log `intervalId` immediately after calling `setIntervalId(id)`, the console still outputs null. The new ID is not lost, but state updates do not mutate the local variable in the running render pass (Lesson 15).

How do you decide between state and a ref? Return to the primary question: **does the value appear on the screen?**
- **The `seconds` counter** is rendered directly in JSX, so it belongs in state.
- **The interval ID** is never rendered in JSX, and is read only by the Start and Stop handlers, so it belongs in a ref.

A single component can seamlessly use both tools side by side. The official React documentation notes: "You can combine refs and state in a single component."

---

## PRINCIPLE | useRef: each copy of the same component keeps its own separate value

> [!PRINCIPLE]
> **Principle 4: A let Outside the Component Is Shared**
>
> *A let variable declared outside the component at the module level survives re-renders, but every mounted instance of the component shares that single variable. A ref is isolated to one specific component instance.*
>
> Moving the let declaration above the component function resolves the re-render reset issue from Principle 2, and a single stopwatch works as expected. If you render two stopwatches on the same page, however, both instances read and write the exact same variable. Starting or stopping one timer overwrites and corrupts the timer ID of the other.
>
> **DO THIS:**
> ```jsx
> export default function Stopwatch({ label }) {
>   const intervalRef = ~useRef(null)~; // Tea and Eggs each get their own ref
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> let ~intervalId = null~; // **WRONG:** Tea and Eggs share this one variable
> export default function Stopwatch({ label }) {}
> ```

A `let` variable declared at the module level outside the component executes once when the module file loads. No component render reinitializes it. With a single stopwatch on the screen, Stop functions properly:

```jsx title="src/Stopwatch.jsx" bad="3"
import { useState } from 'react';

let ~intervalId = null~; // **WRONG:** one variable for every stopwatch on the page

export default function Stopwatch({ label }) {
  const [seconds, setSeconds] = useState(0);

  function handleStart() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function handleStop() {
    clearInterval(intervalId);
  }
```

Now consider an interface that requires two independent stopwatches, one for brewing tea and one for boiling eggs. `App` renders two instances:

```jsx title="src/App.jsx"
import Stopwatch from './Stopwatch.jsx';

export default function App() {
  return (
    <main>
      ~<Stopwatch label="Tea" />~ {/* The first copy of Stopwatch */}
      ~<Stopwatch label="Eggs" />~ {/* The second copy, with its own state */}
    </main>
  );
}
```

Each `<Stopwatch />` element mounts as an independent instance of the component, maintaining its own isolated state. Each instance displays its `label` prop as a heading. The user starts Tea, waits four seconds, and then starts Eggs. Two seconds later:

```page width=text caption="Two seconds after Eggs started: Tea is stuck on 4, and only Eggs counts."
section: Tea
line: Seconds: 4 | bad
line: [Start] [Stop]
section: Eggs
line: Seconds: 2 | good
line: [Start] [Stop]
console: quiet
```

**The user never clicked Stop on Tea, yet Tea stopped ticking.** Here is the explanation:
1. Clicking Start on Tea creates a timer and stores its ID in the shared module variable `intervalId`.
2. Clicking Start on Eggs executes `clearInterval(intervalId)`. Because `intervalId` currently holds the ID for Tea, the browser stops Tea.
3. Eggs then stores its newly created interval ID in that same shared variable.
4. If the user subsequently clicks Stop on Tea, it halts the Eggs timer.

Because a module-scoped variable exists once for the entire file, all instances of `Stopwatch` compete for the same storage location.

A ref solves this conflict cleanly. React allocates an isolated ref container for each mounted instance, exactly as it maintains isolated state containers (Lesson 12). The Tea stopwatch keeps its own ref, and the Eggs stopwatch keeps its own ref. The official React documentation confirms: "The information is local to each copy of your component."

---

## PRINCIPLE | useRef: changing the value does not update the screen

> [!PRINCIPLE]
> **Principle 5: Never Read a Ref in the JSX**
>
> *Any value rendered on the screen must live in state. Mutating a ref does not trigger a re-render, leaving the user interface showing outdated values.*
>
> The user interface displays only what React evaluated during the most recent render pass. Because mutating a ref does not request a re-render, the JSX continues showing the old number. If another unrelated event later triggers a re-render, the displayed value will suddenly jump forward. Read and update refs inside event handlers or Effects, never during the rendering of JSX.
>
> **DO THIS:**
> ```jsx
> const [seconds, setSeconds] = useState(0);
> return <p>Seconds: ~{seconds}~</p>; // The setter renders again, so every new number shows
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const secondsRef = useRef(0);
> return <p>Seconds: ~{secondsRef.current}~</p>; // **WRONG:** nothing renders again, so it stays on 0
> ```

Developers who notice that a ref updates immediately are sometimes tempted to place visible counters inside a ref:

```jsx title="src/Stopwatch.jsx" startLine="5" bad="1,6,15"
const secondsRef = ~useRef(0)~; // **WRONG:** the value on the screen, in a ref

function handleStart() {
  clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    ~secondsRef.current = secondsRef.current + 1~; // Changes the field, and React does not render
  }, 1000);
}

function handleStop() {
  clearInterval(intervalRef.current);
}

return (
  <p>Seconds: ~{secondsRef.current}~</p> // **WRONG:** read once, in the last render
);
```

The user clicks Start under Tea and waits six seconds:

```page width=text caption="Six seconds after Start: secondsRef.current is 6, and the screen still says 0."
section: Tea
line: Seconds: 0 | bad
line: [Start] [Stop]
section: Eggs
line: Seconds: 0
line: [Start] [Stop]
console: quiet
```

The timer runs and `secondsRef.current` increments to 6 in memory. Because no state setter is called, React never schedules a re-render, and the display remains frozen on 0. The official React documentation explains: "React is not aware of when you change it because a ref is a plain JavaScript object."

This bug introduces confusing visual jumps. If another component action triggers a state update, React re-renders the component, reads `secondsRef.current`, and the displayed number suddenly leaps from 0 to 6. The interface appears to freeze and jump randomly.

The remedy is straightforward: store `seconds` in state, as shown in our initial working stopwatch. Values shown on the screen must live in state.

> [!DEFINITION]
> **What does "during rendering" mean?** [NEW] During rendering means the phase where React executes your component function to calculate its JSX.
> 1. Statements written in the component body and expressions inside returned JSX run during rendering.
> 2. Event handlers such as `handleStart` execute later, in response to user actions like clicks.
> 3. An expression like `{secondsRef.current}` in JSX evaluates during rendering, whereas modifying `intervalRef.current` inside `handleStart` does not.
> 
> The official React documentation establishes a strict rule: "Do not write or read `ref.current` during rendering, except for initialization." React requires rendering to be pure: identical props and state must always produce identical JSX (Lesson 14). Reading mutable ref properties during rendering causes non-deterministic output and breaks concurrent rendering features (Lesson 30).

### `useRef(null)`: create an expensive object only once

Sometimes the value stored in a ref is computationally expensive to create, such as instantiating a custom video player or a large data parser. Compare these two approaches:

```jsx title="A new player on every render"
const playerRef = useRef(~new VideoPlayer()~); // Creates a player on every render, and React keeps only the first
```

```jsx title="A player created once"
const playerRef = useRef(null);
if (~playerRef.current === null~) { // True only on the first render
  playerRef.current = new VideoPlayer();
}
```

Both patterns provide access to a video player instance. In the first example, however, JavaScript executes the expression `new VideoPlayer()` on every single render before passing the result to `useRef`. React retains only the instance from the initial render and discards every subsequent one, needlessly wasting CPU time and memory. The second pattern initializes the ref with null, and instantiates the player strictly once when `playerRef.current` is empty. The official React documentation explicitly permits this pattern during rendering because the initialization condition executes only once and produces an identical result.

---

## All 5 Principles Together

### The complete files

`App` renders two stopwatches:

```jsx title="src/App.jsx"
import Stopwatch from './Stopwatch.jsx';

export default function App() {
  return (
    <main>
      ~<Stopwatch label="Tea" />~ {/* Principle 4: its own seconds and its own ref */}
      ~<Stopwatch label="Eggs" />~ {/* Principle 4: its own seconds and its own ref */}
    </main>
  );
}
```

`Stopwatch` keeps the seconds in state and the interval ID in a ref:

```jsx title="src/Stopwatch.jsx"
import { useState, useRef } from 'react';

export default function Stopwatch({ label }) {
  const [seconds, setSeconds] = ~useState(0)~; // Principles 3 and 5: on the screen, so state
  const intervalRef = ~useRef(null)~; // Principles 1, 2 and 4: not on the screen, one ref per copy

  function handleStart() {
    ~clearInterval(intervalRef.current)~; // Principle 1: stop the old timer first
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function handleStop() {
    ~clearInterval(intervalRef.current)~; // Principle 2: the same ID, many renders later
  }

  return (
    <section>
      <h2>{label}</h2>
      <p>Seconds: ~{seconds}~</p> {/* Principle 5: state in the JSX, never a ref */}
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </section>
  );
}
```

The user starts Tea, waits five seconds, starts Eggs, waits three seconds, and stops Tea:

```page width=text caption="The finished page: Tea stopped on 8, and Eggs counts on its own."
section: Tea
line: Seconds: 8 | good
line: [Start] [Stop]
section: Eggs
line: Seconds: 3 | good
line: [Start] [Stop]
console: quiet
```

### Where the ID lives, and what the user sees

| Where the interval ID lives | What the user sees |
| :--- | :--- |
| **A `let` inside the component** | Stop does nothing |
| **State** | It works, but every new ID renders the component again |
| **A `let` outside the component** | Tea and Eggs stop each other |
| **A ref** | Each stopwatch starts and stops on its own |
| **The seconds in a ref** | The line stays at 0 |

```tree caption="Where a component can keep a value, and the job each place fits."
Where a component can keep a value
- !A let inside [`let intervalId`] | Created again **on every render** | Fits a value **calculated fresh** each render
- !A let outside [`let` at the top of the file] | Survives renders, **shared by every copy** | Fits a value that **never changes**
- +State [`useState`] | Remembers and **renders again** | Fits what **the screen shows**
- +A ref [`useRef`] | Remembers and **does not render**, one per copy | Fits what **only handlers need**
```

Remember the primary lesson of this chapter. **`useRef` preserves a value across renders without redrawing the screen, so your code can save information now and read it during later interactions.**

---

## For the Interview

> **The Interview Question:** How do you keep a value between renders without triggering a re-render?

### How to Answer Clearly in 30 Seconds

"I use a ref. The `useRef` Hook returns a plain JavaScript object with a single property, `current`. React creates this container on the initial render and returns the exact same object reference on all subsequent renders, preserving the value across re-renders like state. The fundamental difference is that modifying `ref.current` does not trigger a re-render, and the updated value is available immediately in memory. A classic example is a timer: the interval ID is stored in a ref so the Stop click handler can pass it to `clearInterval` many renders later. Three rules govern this choice:
1. **A local `let` inside the component resets on every render.** A module `let` outside the component is shared across all instances, so neither can safely store instance data across renders.
2. **Values that determine what appears on the screen belong in state.** Values needed only by event handlers or background tasks, such as timer IDs, belong in a ref.
3. **Never read or write `ref.current` during rendering**, except during lazy initialization. Reading a ref in JSX causes stale or desynchronized user interfaces."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"How is `useRef` different from `useState`? Could you build one from the other?"**
   Both preserve data across re-renders, maintaining an isolated value per component instance. Calling a state setter requests a re-render from React, and the updated value arrives with that subsequent render. A ref provides no setter: you mutate `ref.current` directly, the change occurs immediately in memory, and React is never notified. As shown in the React documentation, `useRef` can be implemented using `useState` by storing `{ current: initialValue }` in state and never calling the setter. For this reason, React describes a ref as a regular state variable without a setter.
2. **"Why not read `ref.current` during rendering? When is it allowed?"**
   React expects component rendering to be pure: identical props and state must always produce identical JSX. Because a ref mutates without triggering a re-render, reading it during rendering produces inconsistent JSX and causes visual jumps when unrelated state updates occur. The `react-hooks/refs` lint rule and the React Compiler both flag reading or writing a ref during rendering. The single permitted exception is lazy initialization, where code checks if `ref.current` is `null` and assigns an initial value strictly once before returning JSX.
3. **"When would you use a ref at all?"**
   You use refs when an interaction requires mutable data that does not drive visual rendering. Primary examples include storing timeout and interval IDs, tracking previous prop or state values, and holding custom non-React objects. The most common use case is storing references to real DOM elements via the JSX `ref` attribute, which enables manual focus, scrolling, and DOM measurements. In development under Strict Mode, React executes component bodies twice to verify purity, but committed ref objects remain stable across renders.

```tree dir=right caption="Interview comparison: what state and a ref share, and the one way they differ."
State vs. a ref
- +State [`useState`] | Kept between renders, **one per copy** | The setter **renders again**, and the new value comes **with the next render**
- +A ref [`useRef`] | Kept between renders, **one per copy** | No setter; a change is there **at once** and **does not render**
```
