# Lecture 75: How Automatic Batching Groups the Setters That Run After a Wait

*(Why do two setters that run three seconds after a click still give only one render?)*

> INTERVIEW QUESTION | ❱❱ MORE | How does automatic batching coordinate state updates across promises and timeouts?

---

## VS | Two setters in a click handler vs. two setters in a `setTimeout`: since React 18, both give one render

> In a standard click handler, calling two setters triggers only one render because React waits for the handler to finish. **Since React 18, React applies this exact batching behavior to asynchronous operations like timeouts and promises**. Because setters called within the same task run together, the user never sees a half-finished state where only one value has updated.

Many user interfaces display two values that must change together. Consider a digital wallet transfer of ten dollars. Your balance decreases by ten dollars, and your recipient balance increases by ten dollars. If the screen displayed the first change without the second, even for a moment, money would seem to vanish. In React, you store these two balances in separate state variables and update them using two consecutive setter calls.

Does React render after each setter call, or once after both? Inside a standard React event handler, React batches updates together. Calling a setter does not trigger an immediate render. Instead, React records the update in an internal queue, waits until the handler finishes, and renders once with every update applied (Lesson 16).

Real applications often update state long after a user clicks. A user clicks a button, a network request finishes, or a timer fires seconds later. The original click handler finished long ago. In React 17 and earlier, asynchronous callbacks triggered a separate render for every setter. Since React 18, automatic batching groups these updates into a single render pass wherever they run.

Before React 18, batching occurred only inside synthetic React event handlers like `onClick`. Two setters inside a `setTimeout` callback caused two separate renders, exposing an inconsistent intermediate state. The official React documentation notes that batching prevents confusing half-finished renders where only some of the variables have been updated.

### What "Run Together" Means

Before exploring the details of automatic batching, review two foundational state concepts.

> [!DEFINITION]
> **Batching.** [REVIEW] Batching is React's strategy of grouping multiple state updates into a single re-render pass.
> 1. Calling a setter does not mutate the DOM immediately; it appends an update to React's internal queue.
> 2. React waits until the current synchronous execution finishes before starting a render.
> 3. React processes all queued updates together and renders the updated UI once (Lesson 16).

> [!DEFINITION]
> **An updater function.** [REVIEW] An updater function is a callback passed to a state setter, such as `setCount(c => c + 1)`.
> 1. React queues the updater function instead of computing state immediately.
> 2. During the next render, React passes the latest pending state value into the updater.
> 3. This guarantees accurate updates when state changes depend on previous values (Lesson 16).

Now consider what it means when setters run together.

JavaScript executes code on a single thread using an event loop. A synchronous click handler runs from its first line to its last line without interruption. Later, when a timer expires, the browser queues a separate callback task on the event loop. React waits until the current synchronous execution turn completes, and then renders once for all setters called during that turn.

```jsx title="Two pieces of code, two renders"
function handleClick() {
  setPending(p => p + 1); // Piece 1: runs during the click
  ~setTimeout~(() => { // Piece 2: the browser runs it three seconds later
    setPending(p => p - 1);
    setCompleted(c => c + 1); // Same piece 2: one render for both setters
  }, 3000);
}
```

The click event represents the first execution phase. It calls `setPending`, schedules a timer, and finishes. React renders once. Three seconds later, the browser executes the timer callback. This callback calls two setters in the same turn. React batches them together and renders a second time.

> [!DEFINITION]
> **Automatic batching.** [NEW] Automatic batching is the mechanism introduced in React 18 that groups all state updates scheduled within the same synchronous event loop task into a single render pass.
> 1. Universal coverage: It applies to React event handlers, `setTimeout` callbacks, Promise chains, and native browser event listeners.
> 2. Zero configuration: It activates by default when an application mounts with `createRoot`.
> 3. Clean rendering: The React 18 upgrade guide states that all updates will be automatically batched no matter where they originate from (Lesson 75).

### The Rule of Thumb: did the setters run together?

**State setters that run together in the same synchronous execution turn produce one render. An `await` expression or a new user interaction starts a new batch.**

```tree caption="React batches the setters that run together, wherever they run; a wait and a new click each start a new batch."
What ends in one render since React 18
- +Setters that run together in one place [`onClick` `setTimeout` `then` `addEventListener`] | React groups them into **one batch** | The screen changes **once**, with **every value updated**
- !Setters on the two sides of a wait [`await`] | The code before the wait and the code after it **do not run together** | **Two batches**, so **two renders**
- !Setters in two separate clicks | Each click is **its own event** | Each click gets **its own render**
```

Experienced engineers recognize three common mistakes:
1. **Adding complex state structures to save renders.** Developers accustomed to older React versions assume setters inside timers or promises render individually. They merge independent state variables into a single object or add debounce timers. In modern React, this extra code saves nothing.
2. **Expecting one render from an async click handler.** Developers often expect an entire async function to produce one render. Pausing execution at an `await` divides the function into two turns, producing two renders.
3. **Reading stale state variables after await.** Evaluating `pending - 1` after an `await` reads the value captured at the moment of the click. The user interface ends up displaying negative values such as `Pending: -1` without producing any error.

When two related values must update together after an asynchronous wait, you have three options:
1. **Call two separate setters in sequence.** React automatically batches them into a single render pass. This is the standard pattern for modern React.
2. **Combine related values into an object state variable.** Following React guidelines on grouping related state, store interdependent fields together (Lesson 22). Choose this strategy for data modeling, not to minimize render counts.
3. **Wrap a setter in `flushSync` to force an immediate render.** This function forces React to flush updates to the DOM synchronously before moving to the next line (Lesson 65). Reserve this escape hatch for external browser APIs that require immediate DOM measurements.

## SECTION | The Order Panel: Pending and Completed

Our demonstration interface models the order management panel of an online shop. It contains two counters and an action button. The official React documentation uses this exact scenario to teach batching. After three seconds, the pending counter decreases and the completed counter increases. You encounter this exact pattern in production systems like file upload lists and background processing queues.

When the page loads, no orders are waiting and no orders are finished:

```page width=text caption="The order panel when the page opens: no order is waiting, and no order is done."
line: Pending: 0
line: Completed: 0
line: [Buy]
```

The user clicks the button. The pending count increments immediately to show an order in progress:

```page width=text caption="The order panel right after the user clicks Buy: one order is waiting."
line: Pending: 1 | good
line: Completed: 0
line: [Buy]
```

Three seconds later, the server finishes processing the order. The pending count decreases and the completed count increases at the exact same moment:

```page width=text caption="The order panel three seconds after the click: the order moved from Pending to Completed in one step."
line: Pending: 0 | good
line: Completed: 1 | good
line: [Buy]
```

The order never vanishes from the screen. The user never sees zero pending next to zero completed. Automatic batching guarantees that both values update in the same render pass.

The project consists of three files:

```files title="order-panel: File Explorer" caption="The three files of our order panel inside src/."
src/
  main.jsx | boundary | Mounts `App` with `createRoot`, inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<OrderTracker />`
  OrderTracker.jsx | default export | Holds `pending` and `completed`, shows the two counts and the `Buy` button
```

The `OrderTracker` component maintains pending and completed numbers in state, initialized to zero. A console log in its body prints state values on every render (Lesson 54). This logging reveals how many renders occur per user click. Principle 1 constructs the initial implementation. Subsequent principles adjust only `OrderTracker.jsx`.

**PRINCIPLES:** React waits until a synchronous block of code finishes, then renders once for every setter called in that block. Since React 18, this holds true across all execution contexts. Four key principles follow:
1. **Principle 1: Two Setters in a setTimeout Render Once.** Setters that run together in a timeout, promise callback, or native browser listener form a single batch.
2. **Principle 2: await Splits the Buy Click into Two Renders.** Setters before the pause form one batch, and setters after the pause form a second batch. Distinct clicks are never batched together.
3. **Principle 3: pending - 1 After await Shows Pending: -1.** Code after an asynchronous pause still reads state values captured during the click. An updater function receives the latest state.
4. **Principle 4: flushSync Shows the Half-Finished Render.** Each `flushSync` call forces an immediate render, exposing an intermediate state where the order appears in neither counter.

---

## PRINCIPLE | setTimeout and promises: the setters that run together give one render, since React 18

> [!PRINCIPLE]
> **Principle 1: Automatic Batching: Two Setters in a setTimeout Render Once**
>
> *Since React 18 with `createRoot`, setters that run together inside a timeout, a promise, a native event handler, or any other event give one render, the same way as setters inside a React event handler.*
>
> Before React 18, React batched only the setters inside React event handlers, so two setters in a `setTimeout` rendered twice. Now React groups the setters that run together, wherever they run. The screen changes once, with every value updated, and your code asks for nothing.
>
> **DO THIS:**
> ```jsx
> setTimeout(() => {
>   setPending(p => p - 1);
>   ~setCompleted~(c => c + 1); // One render: both counts change together
> }, 3000);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> setTimeout(() => {
>   ~setOrder~(o => ({ pending: o.pending - 1, completed: o.completed + 1 })); // **WRONG:** merged only to save a render React already saves
> }, 3000);
> ```

Consider the same two setters placed in two different execution contexts. The first pair runs during a user click. The second pair runs inside a `setTimeout` callback one second later, when no user event is active:

```jsx title="The same two setters in a click handler and in a setTimeout"
const [count, setCount] = useState(0);
const [flag, setFlag] = useState(false);

function handleClick() {
  ~setCount(c => c + 1);~ // Runs during the click
  setFlag(f => !f); // One render for both
}

~setTimeout~(() => { // Runs one second after the timer starts
  setCount(c => c + 1);
  setFlag(f => !f); // Since React 18: one render for both
}, 1000);
```

Since React 18, both locations behave identically. React waits until both setters finish and executes a single render pass.

### VS | React 17 vs. React 18: the same two setters in a setTimeout

This unified behavior is a modern improvement. The same timer code produces different render counts in older React versions:
- **In React 17:** React applied batching only inside React event handlers like `onClick`. The two setters inside `setTimeout` triggered two separate renders. The React team noted in documentation that React would render twice, once for each state update.
- **In React 18 and newer:** When using `createRoot`, the two setters produce one render pass. As the React release notes state, React re-renders once at the end.

```tree caption="The same two setters in a setTimeout, before and after React 18."
Two setters inside a `setTimeout`
- !React 17 | React batched **only inside React event handlers** | **Two renders**, one for each setter
- +React 18 and React 19 with `createRoot` | React batches **wherever the setters run** | **One render** after both setters
```

Automatic batching provides both performance efficiency and visual consistency. Without batching, React performs redundant component renders, and the browser paints an intermediate frame showing inconsistent state.

### Every place where setters run together

The React release notes list the contexts covered by automatic batching: updates inside timeouts, promises, native event handlers, or any other event are batched.

> [!DEFINITION]
> **A native event handler.** [NEW] A native event handler is a DOM listener attached directly to a browser element using `addEventListener`, such as `document.addEventListener('keydown', handleKey)`.
> 1. Browser-managed: The browser invokes the function directly rather than routing it through React's synthetic event system.
> 2. Historical limitation: In React 17, updates inside native listeners triggered individual unbatched renders.
> 3. Modern batching: In React 18 and newer, updates inside native event listeners are automatically batched into a single render pass (Lesson 11).

Here are four common contexts where two consecutive setters yield a single render pass in modern React:

```jsx title="Four places where two setters give one render since React 18"
<button ~onClick~={() => { setCount(c => c + 1); setFlag(f => !f); }}>Add</button> {/* A React event handler: one render */}

~setTimeout~(() => { setCount(c => c + 1); setFlag(f => !f); }, 1000); // A timeout: one render

fetch('/api/orders').~then~(() => { setCount(c => c + 1); setFlag(f => !f); }); // A promise: one render

document.~addEventListener~('keydown', () => { setCount(c => c + 1); setFlag(f => !f); }); // A native event handler: one render
```

Automatic batching requires mounting the application with `createRoot` (Lesson 07). In React 18, applications that continued using the legacy `ReactDOM.render` entry point retained React 17 behavior, displaying a console warning:

```devconsole width=full caption="The Console of a React 18 app still mounted with ReactDOM.render."
x Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot
```

React 19 completely removed the legacy root method. Every React 19 application mounts using `createRoot`, so automatic batching is always active.

### Step 1: the order panel with a setTimeout

The main entry point mounts the root component with `createRoot` inside Strict Mode:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

~createRoot~(document.getElementById('root')).render( // createRoot turns on automatic batching
  <StrictMode>
    <App />
  </StrictMode>
);
```

The `App` component renders the order tracker:

```jsx title="src/App.jsx"
import OrderTracker from './OrderTracker.jsx';

export default function App() {
  return <OrderTracker />;
}
```

Inside `OrderTracker.jsx`, the click handler increments the pending count immediately. It then starts a three-second timer that transfers the order to completed:

```jsx title="src/OrderTracker.jsx"
import { useState } from 'react';

export default function OrderTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);
  console.log('OrderTracker rendered', pending, completed);

  function handleClick() {
    setPending(p => p + 1); // The order is waiting
    ~setTimeout~(() => { // Runs three seconds after the click, when no handler is running
      setPending(p => p - 1); // One order less waiting
      setCompleted(c => c + 1); // One order more done, in the same render
    }, 3000);
  }

  return (
    <>
      <h3>Pending: {pending}</h3>
      <h3>Completed: {completed}</h3>
      <button onClick={handleClick}>Buy</button>
    </>
  );
}
```

Each setter receives an updater function. Principle 3 explains why updater functions are essential here.

The user loads the page and clicks the button once. Here is the component state three seconds later, showing the recorded console output:

```page width=text caption="The order panel three seconds after one click on Buy, with the Console lines of the page load, the click, and the timeout."
line: Pending: 0 | good
line: Completed: 1 | good
line: [Buy]
log: OrderTracker rendered 0 0 | OrderTracker.jsx:6
log: OrderTracker rendered 0 0 | OrderTracker.jsx:6
log: OrderTracker rendered 1 0 | OrderTracker.jsx:6
log: OrderTracker rendered 1 0 | OrderTracker.jsx:6
log: OrderTracker rendered 0 1 | OrderTracker.jsx:6
log: OrderTracker rendered 0 1 | OrderTracker.jsx:6
```

Each render logs twice because Strict Mode renders components twice in development to identify unexpected side effects (Lessons 14 and 47). The logs demonstrate that the component rendered exactly three times: on initial mount, following the click, and following the timer. The output transitions directly from `1 0` to `0 1` without intermediate entries. The two setters inside the timer callback triggered a single render pass.

Even though no React event handler is running when the timer fires, React coordinates both updates into one render:
1. The user clicks the button. The handler enqueues `setPending(p => p + 1)` and starts the timer.
2. The click handler completes its synchronous execution. React flushes the queue and renders `Pending: 1`.
3. Three seconds later, the browser invokes the timer callback. It calls `setPending(p => p - 1)` followed by `setCompleted(c => c + 1)`.
4. React waits until the callback function finishes its execution, queuing both updates.
5. React applies both updates together, transitioning the interface directly to `Pending: 0` and `Completed: 1`.

### The real mistake: extra code to save renders that React already saves

Developers who learned older React versions often believe that setters inside timers render one by one. To prevent multiple renders, they consolidate multiple values into a single object:

**DO NOT DO THIS:**
```jsx bad="3"
const [order, setOrder] = useState({ pending: 0, completed: 0 });

~setOrder~(o => ({ pending: o.pending - 1, completed: o.completed + 1 })); // **WRONG:** merged only to save a render that React 18 already saves
```

**DO THIS:**
```jsx good="1,2"
setPending(p => p - 1);
~setCompleted~(c => c + 1); // The two setters already give one render
```

In modern React, two distinct setters already produce only one render pass. Merging independent variables into a wrapper object provides no performance benefit. The same is true for debounce timers added solely to reduce render counts.

Be careful not to confuse performance workarounds with good data modeling. React documentation does advise grouping related state variables into a single object when fields are interdependent (Lesson 22). However, that choice should be based on data structure requirements, not render optimization.

Automatic batching also operates across component boundaries. When a single asynchronous event dispatches updates across multiple components, React coordinates all updates into a single render pass.

---

## PRINCIPLE | await: the setters before it and the setters after it render separately

> [!PRINCIPLE]
> **Principle 2: The Wait Splits the Batch: await Splits the Buy Click into Two Renders**
>
> *In an async event handler, the setters before the first `await` form one batch and render when that part of the click ends; the setters after the `await` run later and form a second batch.*
>
> Batching groups the setters that run together. JavaScript runs the code up to the first `await` during the click and the rest later, so one click gives two renders. That first render is how the user sees the order waiting. If every setter sits after the `await`, the user clicks and sees nothing change for three seconds. Two separate clicks are never batched together either: each click gets its own render.
>
> **DO THIS:**
> ```jsx
> async function handleClick() {
>   ~setPending~(p => p + 1); // Batch 1: Pending: 1 shows at once
>   await delay(3000);
>   setPending(p => p - 1);
>   setCompleted(c => c + 1);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> async function handleClick() {
>   await delay(3000);
>   ~setPending~(p => p + 1); // **WRONG:** after the wait, in one batch with the next two lines: Pending: 1 never shows
>   setPending(p => p - 1);
>   setCompleted(c => c + 1);
> }
> ```

Production applications rarely use standalone timeouts. Instead, they use `async` and `await` to manage network requests and server operations. Here is a click handler structured with an asynchronous pause:

```jsx title="One async handler, two batches"
async function handleClick() {
  setCount(c => c + 1); // Batch 1: renders when the click's code stops at await
  ~await~ delay(1000); // The click's code stops here; the rest runs one second later
  setCount(c => c + 1); // Batch 2: runs one second later
  setFlag(f => !f); // Same batch 2: one render for both
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

The `delay` function wraps a standard timer inside a Promise, allowing the caller to pause execution with `await`. In a real application, this pause represents a server request using `fetch`.

This single click handler produces two distinct renders. The `await` keyword divides function execution into two separate phases, each forming its own batch.

Why does this split happen? In JavaScript, an async function executes synchronously until it reaches its first `await` expression. At that boundary, the function pauses execution and returns a pending Promise to the caller. Because synchronous execution has completed, React flushes all state updates queued before the `await` and commits them to the DOM immediately. When the awaited Promise resolves three seconds later, the browser schedules the remainder of the function as a separate task. React collects all updates scheduled after the `await` and renders them in a second batch.

```tree dir=right caption="How await splits one click handler into two batches and two renders."
One `Buy` click with a wait in the middle
- +Piece 1: the code up to `await` [`setPending`] | Runs **during the click** | React renders **once**: `Pending: 1`
- +The wait [`await` `delay`] | The handler **stops here** and returns a promise | The click's code is **finished for now**
- +Piece 2: the code after `await` [`setPending` `setCompleted`] | Runs **three seconds later**, both setters together | React renders **once**: `Pending: 0` and `Completed: 1`
```

### VS | A setTimeout callback vs. await delay: the same two batches

From the standpoint of React's batching engine, using `await delay` functions identically to registering a `setTimeout` callback:

```jsx title="The same move of the order, written with a setTimeout and with await"
setTimeout(() => { setPending(p => p - 1); setCompleted(c => c + 1); }, 3000); // Principle 1: one render after the wait
~await delay(3000)~; setPending(p => p - 1); setCompleted(c => c + 1); // Principle 2: one render after the wait
```

In both implementations, the setter preceding the delay runs during the initial user click. The two setters following the delay run together three seconds later as a single task. The `await` keyword provides a sequential syntax for deferred execution.

### Step 2: the Buy handler with await

Inside `OrderTracker.jsx`, convert the click handler into an asynchronous function using `await`:

```jsx title="src/OrderTracker.jsx" startLine="8"
  ~async~ function handleClick() { // async lets the handler wait with await
    setPending(p => p + 1); // Batch 1: Pending: 1
    ~await delay(3000)~; // The click's code stops here for three seconds
    setPending(p => p - 1); // Batch 2, three seconds later
    setCompleted(c => c + 1); // Same batch 2: one render for both counts
  }
```

The `delay` utility function sits at the bottom of the file:

```jsx title="src/OrderTracker.jsx" startLine="24"
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

A single user click triggers two distinct rendering passes: one before the pause and one after it:
1. The user clicks the button. React invokes `handleClick`.
2. Calling `setPending(p => p + 1)` enqueues an update in React's state queue.
3. The `await delay(3000)` expression pauses function execution, returning a pending Promise.
4. Because the synchronous call stack has cleared, React processes the queue and renders `Pending: 1`.
5. Three seconds later, the Promise resolves, and execution resumes.
6. The setters `setPending(p => p - 1)` and `setCompleted(c => c + 1)` execute within the same resumption turn.
7. React batches both updates into a single render pass, displaying `Pending: 0` and `Completed: 1`.

React renders at step 4 because synchronous execution has paused. As the React documentation explains, React waits until all synchronous code in an event handler completes before processing updates. When an `await` is reached, the handler has completed all work possible for the current turn, so React flushes pending updates immediately.

The console output matches Principle 1: two log lines for `1 0` after the click, and two log lines for `0 1` after the delay.

This execution boundary is practical and necessary. It allows an interface to show a loading state before an asynchronous operation starts, and then dismiss the loader while presenting final results in a single batched render.

### Two fast clicks are two batches

What happens if the user clicks the button twice in rapid succession?

> [!DEFINITION]
> **An intentional event.** [NEW] An intentional event is a distinct user interaction initiated directly by a human action, such as a mouse click or a keyboard key press.
> 1. Discrete boundary: React treats each deliberate user interaction as an independent transaction.
> 2. No cross-event batching: React documentation emphasizes that React does not batch across multiple intentional events like clicks.
> 3. Predictable order: Each user interaction receives its own render pass, ensuring input reactions remain responsive and deterministic (Lesson 75).

Each user click is an independent event with its own render, and each resulting delay resolves in its own batch. Here is the console output when a user clicks twice rapidly:

```page width=text caption="The order panel after two fast clicks on Buy, with one render per click and one render per finished wait."
line: Pending: 0 | good
line: Completed: 2 | good
line: [Buy]
log: OrderTracker rendered 1 0 | OrderTracker.jsx:6
log: OrderTracker rendered 1 0 | OrderTracker.jsx:6
log: OrderTracker rendered 2 0 | OrderTracker.jsx:6
log: OrderTracker rendered 2 0 | OrderTracker.jsx:6
log: OrderTracker rendered 1 1 | OrderTracker.jsx:6
log: OrderTracker rendered 1 1 | OrderTracker.jsx:6
log: OrderTracker rendered 0 2 | OrderTracker.jsx:6
log: OrderTracker rendered 0 2 | OrderTracker.jsx:6
```

Each click event and each finished delay produces a distinct render:
1. The first click renders `Pending: 1`.
2. The second click renders `Pending: 2`.
3. Three seconds after the first click, its batch updates state to `Pending: 1` and `Completed: 1`.
4. Three seconds after the second click, its batch updates state to `Pending: 0` and `Completed: 2`.

React deliberately isolates separate user clicks. Batching across separate intentional events could produce unexpected bugs. For example, consider a button click that disables a form. React must render the disabled state immediately to prevent duplicate form submissions.

---

## PRINCIPLE | An updater after await: React passes the latest state, not the value from the click

> [!PRINCIPLE]
> **Principle 3: Snapshot After the Wait: pending - 1 After await Shows Pending: -1**
>
> *Code after `await` still reads the values of the click's render; when the next value depends on the previous one, pass an updater, which React calls with the latest state.*
>
> Batching decides when React renders. It does not change what `pending` holds inside the handler. Three seconds later, `pending` is still the value from the click's render, so `pending - 1` computes from an old number. An updater such as `p => p - 1` receives the latest state from React.
>
> **DO THIS:**
> ```jsx
> await delay(3000);
> setPending(~p => p - 1~); // React passes the latest pending: Pending: 0
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> await delay(3000);
> setPending(~pending - 1~); // **WRONG:** pending is 0 from the click's render, so the screen shows Pending: -1
> ```

The React documentation initially presents the click handler without updater functions to highlight a critical trap:

```jsx title="The Buy handler without updaters"
setPending(pending + 1);
await delay(3000);
~setPending(pending - 1)~; // **WRONG:** pending still holds the value from the click's render
setCompleted(completed + 1);
```

This code causes an impossible state: the screen ends up showing `Pending: -1`. The official React documentation explains that clicking the button causes the pending counter to drop to `-1`, and clicking rapidly causes both counters to behave unpredictably.

This error reveals a crucial distinction in React's execution model. Batching controls when React triggers a render pass, but it does not change how JavaScript closures capture variable values.

> [!DEFINITION]
> **A snapshot.** [REVIEW] In React, each render captures its own immutable snapshot of state and props.
> 1. Lexical closure: A handler created during a render captures the variable values available during that specific render.
> 2. Immutability: Variables inside a function closure remain unchanged throughout that execution, even when asynchronous operations resume much later.
> 3. Render isolation: Invoking a setter requests a future update; it does not alter variable values in current executing code (Lesson 15).

Developers often assume that three seconds after a click, the `pending` variable automatically reflects the updated count shown on screen. It does not. Although the screen now displays one pending order, the paused function remains bound to its original render closure where `pending` evaluated to zero.

Here is the exact runtime sequence:
1. The screen shows `Pending: 0`. The user clicks the button.
2. The expression `setPending(pending + 1)` evaluates `0 + 1`. React renders `Pending: 1`.
3. The function pauses for three seconds. In this function closure, `pending` remains `0`.
4. Resuming execution, `setPending(pending - 1)` calculates zero minus one, yielding minus one. Concurrently, `setCompleted(completed + 1)` calculates zero plus one.
5. React batches both updates into a single render pass.
6. The screen displays `Pending: -1` and `Completed: 1`.

```page width=text caption="The order panel three seconds after one click on Buy, when the handler computes pending - 1 from the click's value."
line: Pending: -1 | bad
line: Completed: 1
line: [Buy]
log: OrderTracker rendered 1 0 | OrderTracker.jsx:6
log: OrderTracker rendered 1 0 | OrderTracker.jsx:6
log: OrderTracker rendered -1 1 | OrderTracker.jsx:6
log: OrderTracker rendered -1 1 | OrderTracker.jsx:6
```

The developer console reports no warnings or runtime exceptions. The application computed `0 - 1` from the captured state value, and React applied that requested number.

Rapid consecutive clicks cause silent data loss:
1. The first click runs in the render where `pending` is 0. It enqueues `0 + 1`, and the interface renders `Pending: 1`.
2. The second click runs in the render where `pending` is 1. It enqueues `1 + 1`, and the interface renders `Pending: 2`.
3. Three seconds after the first click, its handler resumes using its captured values, requesting `-1` and `1`.
4. Three seconds after the second click, its handler resumes using its captured values, requesting `0` and `1`.

The user ordered two items, but the completed counter ends at one while the pending counter resets to zero. Captured closure values overwrite each other silently.

### VS | pending - 1 vs. p => p - 1 after await: the old value or the latest one

```jsx title="A value computed from the click's render vs. an updater, both after await"
setPending(~pending - 1~); // Computes from the click's render: 0 - 1 gives -1
setPending(~p => p - 1~); // React passes the latest state: 1 - 1 gives 0
```

These two lines appear similar, but they retrieve data from different sources. As the React documentation explains, passing `pending - 1` calculates from values captured at the moment of the click. An updater function works relative to the latest state value at execution time. React invokes `p => p - 1` with the most recent pending state after processing all updates queued prior to it (Lesson 16).

```tree caption="A value computed from the click's render vs. an updater that React calls with the latest state."
Changing `pending` three seconds after the click
- !A computed value [`pending - 1`] | Reads `pending` from **the click's render**, where it is **0** | The screen shows **`Pending: -1`**
- +An updater [`p => p - 1`] | React passes **the latest state**, which is **1** | The screen shows **`Pending: 0`**
```

The recommended solution uses updater functions for both state updates:

```jsx title="src/OrderTracker.jsx" startLine="8"
  async function handleClick() {
    setPending(~p => p + 1~); // React passes 0: Pending: 1
    await delay(3000);
    setPending(~p => p - 1~); // React passes the latest pending: Pending: 0
    setCompleted(~c => c + 1~); // React passes the latest completed: Completed: 1
  }
```

This implementation matches the pattern introduced in Principle 2. By convention, updater parameters use the first letter of the corresponding state variable, such as `p` for pending and `c` for completed. Because updater functions execute during React's render phase, they must remain pure functions without side effects. Under Strict Mode in development, React invokes each updater function twice to verify purity (Lesson 16).

Always remember: when updating state after an asynchronous pause, compute new values using an updater function rather than referencing closed-over state variables directly.

---

## PRINCIPLE | flushSync: each call renders at once, so React renders a half-finished state

> [!PRINCIPLE]
> **Principle 4: The Way Out: flushSync Shows the Half-Finished Render**
>
> *To opt out of automatic batching, wrap a setter in `flushSync`; each `flushSync` renders its own update at once, so two setters in two `flushSync` calls give two renders, and the first shows only one of the two changes.*
>
> Batching is the default, and `flushSync` is the exception. It forces a render before the next line runs, so the render between the two calls is a half-finished render: the order sits in neither count. Use it only when outside code must see the DOM at once.
>
> **DO THIS:**
> ```jsx
> await delay(3000);
> setPending(p => p - 1);
> ~setCompleted~(c => c + 1); // One batch: the order moves in one step
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> await delay(3000);
> ~flushSync~(() => { setPending(p => p - 1); }); // **WRONG:** renders 0 0 before the next line, a half-finished render
> flushSync(() => { setCompleted(c => c + 1); });
> ```

React provides an explicit escape hatch from automatic batching via `flushSync`, exported from `react-dom` (Lesson 65). The React 18 upgrade guide explains that developers can use `flushSync` to opt out of automatic batching when immediate DOM synchronization is necessary.

> [!DEFINITION]
> **flushSync.** [REVIEW] `flushSync` is a utility from `react-dom` that forces React to flush queued state updates synchronously.
> 1. Synchronous flush: React executes the callback, immediately computes the component render, and commits DOM mutations before executing the next line of code.
> 2. Disables batching: Updates inside `flushSync` do not participate in automatic batching.
> 3. Performance trade-off: It incurs significant performance overhead by forcing synchronous layout computations and extra rendering passes (Lesson 65).

Here is the upgrade guide's example demonstrating unbatched setters:

```jsx title="Two setters, each inside its own flushSync"
import { flushSync } from 'react-dom';

~flushSync~(() => { // React renders and updates the DOM before the next line
  setCount(c => c + 1);
});
flushSync(() => {
  setFlag(f => !f); // React renders and updates the DOM again
});
```

Because each setter is wrapped in its own `flushSync` block, React executes two separate render passes, recreating the unbatched behavior of older React versions.

### VS | Two plain setters vs. each setter in its own flushSync: one render or two

Compare standard batched setters with setters wrapped in `flushSync` after an asynchronous delay:

```jsx title="Two plain setters vs. each setter inside its own flushSync"
setPending(p => p - 1); setCompleted(c => c + 1); // One batch: one render with 0 1
~flushSync~(() => { setPending(p => p - 1); }); flushSync(() => { setCompleted(c => c + 1); }); // Two renders: 0 0, then 0 1
```

Standard setters form a single batch and trigger one consolidated render. With `flushSync`, React renders the first update immediately before running the second setter. In that intermediate render, the order appears in neither counter.

> [!DEFINITION]
> **A half-finished render.** [NEW] A half-finished render is an intermediate UI state where only a portion of interdependent state updates has been applied to the DOM.
> 1. Inconsistent view: In our order tracker, it manifests as `Pending: 0` alongside `Completed: 0`, temporarily losing track of the processed order.
> 2. Flashing artifacts: Unbatched renders can cause visual flickers and layout instability.
> 3. Automatic prevention: Automatic batching prevents half-finished renders by grouping all co-occurring updates into a single atomic commit (Lesson 75).

### Step 3: the half-finished render in the Console

To observe this intermediate state directly, import `flushSync` into `OrderTracker.jsx` and wrap each setter after the delay in its own call:

```jsx title="src/OrderTracker.jsx" startLine="1"
import { useState } from 'react';
import { ~flushSync~ } from 'react-dom'; // From react-dom, not from react
```

```jsx title="src/OrderTracker.jsx" startLine="9"
  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    ~flushSync~(() => { // Opts this setter out of batching
      setPending(p => p - 1); // React renders and updates the DOM now: 0 0
    });
    flushSync(() => {
      setCompleted(c => c + 1); // React renders and updates the DOM again: 0 1
    });
  }
```

Following the delay, the console logs an intermediate render with state `0 0`. For that render pass, the order is counted nowhere:

```page width=text caption="The order panel three seconds after one click on Buy, when each setter after the wait sits in its own flushSync; the Console shows the half-finished render with 0 0."
line: Pending: 0
line: Completed: 1
line: [Buy]
log: OrderTracker rendered 1 0 | OrderTracker.jsx:7
log: OrderTracker rendered 1 0 | OrderTracker.jsx:7
log: OrderTracker rendered 0 0 | OrderTracker.jsx:7
log: OrderTracker rendered 0 0 | OrderTracker.jsx:7
log: OrderTracker rendered 0 1 | OrderTracker.jsx:7
log: OrderTracker rendered 0 1 | OrderTracker.jsx:7
```

Here is what occurs after the asynchronous delay:
1. The first `flushSync` executes `setPending(p => p - 1)`. React immediately halts script progression, renders the component, and updates the DOM.
2. In that intermediate render, pending is zero and completed is still zero. The DOM briefly displays `Pending: 0` and `Completed: 0`.
3. The second `flushSync` executes `setCompleted(c => c + 1)`. React renders again and updates the DOM to display zero and one.

The browser may coalesce paints so the user never sees a visible flicker. Even so, React committed that intermediate tree to the DOM. Any external library or mutation observer reading the document during that moment would observe the broken state.

Having inspected this behavior, remove `flushSync` and restore the clean batched setters from Principle 3.

### The real mistake: flushSync to show the change right now

Developers sometimes wrap setters in `flushSync` in ordinary application code hoping to force instant screen updates. Every call forces a synchronous render pass and risks exposing half-finished renders. The official React documentation warns that `flushSync` can significantly hurt performance and should be used only as a last resort.

Using `flushSync` is appropriate only when external browser integrations or third-party libraries require synchronous DOM measurements before a callback returns (Lesson 65). A classic example is the browser `onbeforeprint` event, which fires immediately before the print dialog opens. Without `flushSync`, React batches updates asynchronously, causing the print dialog to capture the document before new state updates appear.

Always treat automatic batching as the standard default and `flushSync` as a rare escape hatch.

---

## All 4 Principles Together

### The complete code

The main file mounts the application with `createRoot`, enabling automatic batching:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

~createRoot~(document.getElementById('root')).render( // Principle 1: automatic batching needs createRoot
  <StrictMode>
    <App />
  </StrictMode>
);
```

The `App` component renders the tracker:

```jsx title="src/App.jsx"
import OrderTracker from './OrderTracker.jsx';

export default function App() {
  return <OrderTracker />;
}
```

The order tracker component pauses with `await`, applies updater functions, and avoids `flushSync`:

```jsx title="src/OrderTracker.jsx"
import { useState } from 'react';

export default function OrderTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);
  console.log('OrderTracker rendered', pending, completed);

  async function handleClick() {
    setPending(p => p + 1); // Principle 2: batch 1 renders Pending: 1
    ~await~ delay(3000); // Principle 2: the wait starts a new batch
    setPending(~p => p - 1~); // Principle 3: the updater reads the latest pending
    setCompleted(c => c + 1); // Principles 1 and 4: one render for both counts, no flushSync
  }

  return (
    <>
      <h3>Pending: {pending}</h3>
      <h3>Completed: {completed}</h3>
      <button onClick={handleClick}>Buy</button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

### When React calls the components

When the page loads, React calls `App` followed by `OrderTracker`. After that initial mount, only `OrderTracker` owns state, so each user click and each completed delay invokes only `OrderTracker`, once per batch:

```tree dir=right caption="When React calls the components of the order panel for one click on Buy, and what each render logs."
The renders of the order panel
- +1. The page opens [`createRoot`] | React calls **`App`**, then **`OrderTracker`** | Logs **`0 0`**
- +2. The click, up to `await` [`setPending`] | Batch 1: React calls **`OrderTracker`** once | Logs **`1 0`**: `Pending: 1`
- +3. Three seconds later, after `await` [`setPending` `setCompleted`] | Batch 2: both setters, **one render** | Logs **`0 1`**: `Pending: 0` and `Completed: 1`
```

| Aspect | What readers expect | What React does |
| :--- | :--- | :--- |
| **Setters in a timeout or a promise** | One render for each setter, as in React 17 | One render for the setters that run together, since React 18 with `createRoot` |
| **An async handler with `await`** | One click, one render | One batch before the wait and one batch after it: two renders |
| **Two fast clicks** | React groups them to save work | Each click is its own event with its own render |
| **`pending - 1` after `await`** | `pending` holds the number on the screen | `pending` holds the click's value; an updater gets the latest state |
| **`flushSync`** | A way to show the change faster | A way out of batching that adds a render; a last resort |

Remember this central rule: **React renders once for all setters that execute within the same synchronous turn, while every `await` and every new click initiates a separate batch.**

---

## For the Interview

> **The Interview Question:** How does automatic batching coordinate state updates across promises and timeouts?

### How to Answer Clearly in 30 Seconds

"Batching is React's mechanism for grouping multiple queued state updates into a single re-render pass. Before React 18, batching was limited to synthetic React event handlers like `onClick`. Setters invoked inside timers, promises, or native browser listeners triggered individual renders. Since React 18 with `createRoot`, automatic batching applies universally across all asynchronous callbacks, eliminating half-finished renders and minimizing unnecessary DOM diffing. Two important boundaries govern batching:
1. **An `await` expression divides an async handler:** Setters before the `await` run synchronously and render immediately, while setters after the `await` run in a separate execution turn as a second batch.
2. **Distinct user interactions are never merged:** Each intentional event, such as a click or keydown, receives its own independent render pass.

Code after an `await` reads closure variables captured during the initial render. You must use an updater function like `p => p - 1` to ensure calculations use the latest state. To opt out, `flushSync` from `react-dom` forces synchronous DOM flushes, but it should remain a last resort."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does automatic batching work in every React app?"**
   It requires `createRoot`. In React 18, applications that mounted using the legacy `ReactDOM.render` API preserved React 17 behavior, logging a migration notice. React 19 completely removed `ReactDOM.render`, so every React 19 application uses `createRoot` and benefits from automatic batching. The React team classified this as a breaking change that reduces rendering overhead and improves application performance.
2. **"Why does my async click handler render twice?"**
   Because the `await` expression divides execution into two phases. JavaScript executes code up to the first `await` synchronously during the click event. When execution pauses, React renders those initial updates immediately. Code after the `await` resumes in a later event loop turn, forming a second batch. This division is beneficial: it lets an interface display a loading indicator immediately, and then hide the indicator while displaying fetched results in a single batched render. When working inside Transitions, updates after an `await` must be wrapped in their own `startTransition` call (Lesson 67).
3. **"Are there other places where React batches updates?"**
   Yes, there are three additional contexts:
   - **Transitions and Actions.** When multiple Transitions run simultaneously, React batches their updates together. The same batching applies to ongoing Actions in `useActionState` (Lesson 42).
   - **Animations.** A `<ViewTransition>` component automatically batches updates that occur while an animation is actively playing (Lesson 74).
   - **Server rendering.** React 19.2 batches the reveal of server-rendered Suspense boundaries across brief coordination windows.

   To observe batching in a live application, open the React DevTools Profiler: it shows one commit for a batched update, and two commits when using `flushSync` (Lesson 64).

```tree caption="Interview summary: where automatic batching applies, and where a new batch starts."
Automatic batching since React 18 with `createRoot`
- +Batched together | Setters that run together in a **click handler**, a **timeout**, a **promise**, or a **native event handler** | **One render**, no half-finished render
- !A new batch starts | At every **`await`**, and at every **new click** | **One render per batch**
- !Opted out | Each **`flushSync`** call | **One render per call**, a last resort
```
