# Lecture 86: How a Weather Chart Cleans Up After Its `<div>` Leaves

*(How does a ref callback stop the work it started when its DOM node leaves the page?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do React 19 ref cleanup functions work, and how do they eliminate memory leaks?

---

## VS | A Ref Callback That Waits for `null` vs. a Ref Callback That Returns a Cleanup: in React 19, the setup hands React its own undo

> When you hand a `<div>` element to an external chart library, that library draws visuals inside it and frequently listens to the browser window. React knows nothing about that window listener. **In React 19, the ref callback that receives the `<div>` can return a cleanup function, called the moment the `<div>` unmounts**. Whatever work the ref callback starts outside React, the returned cleanup function must stop.

In production applications, many user interface elements are not written in React. Specialized tools such as charting packages, interactive maps, and media players are often written in plain JavaScript. These libraries all follow a similar pattern: they require an existing DOM element to draw into. In addition, many of these libraries register event listeners on the global browser window, allowing them to redraw their contents whenever the user resizes the browser viewport.

In standard browser JavaScript, every `addEventListener` call must be paired with a corresponding `removeEventListener` call. If an application registers an event listener on `window` and never removes it, that listener remains active in browser memory for the lifetime of the page. Even worse, the listener keeps alive every object, closure variable, and DOM node referenced inside its callback.

Consider a weather application with two navigation tabs: Today and Week. The Week tab displays a weather forecast chart drawn by an external library into a `<div>` container. Every time the user navigates to Week, a new chart initializes. Every time the user navigates back to Today, that `<div>` unmounts and leaves the document. Who stops the chart and removes its window listener?

**Why this matters:** React automatically removes the `<div>` element when unmounting, because React created that node from your JSX markup. However, React has no knowledge of the internal `addEventListener` call executed inside the external chart library. Because React never saw that listener registered, React cannot remove it for you. Only your own application code can instruct the chart library to shut down, typically by calling a teardown method such as `chart.destroy()`. Your code needs an exact signal when the `<div>` leaves the DOM. In React 19, a ref callback provides that exact signal: return a cleanup function from the callback, and React calls it the moment the `<div>` unmounts.

### Back to plain JavaScript

In plain JavaScript, your code manages both ends of the lifecycle manually. You find the element, initialize the chart, and later invoke its teardown method when the view changes:

```js title="Plain JavaScript: you start the chart, and you destroy it"
const div = ~document.getElementById('chart')~; // You grab the element yourself
const chart = createChart(div); // The library draws into the div and listens to window
~chart.destroy()~; // When the chart must go: you remove the listener yourself
```

In React, you do not query or create DOM elements manually. React creates the DOM nodes during the commit phase based on your JSX declarations, and React unmounts them when conditional logic changes. A ref callback allows you to request the real DOM node directly from React. When you pass a function to the `ref` prop, React invokes your function and passes the underlying DOM element as an argument as soon as it mounts. In React 19, that callback function can return a second function, instructing React to invoke it when the element leaves the page:

```jsx title="React 19: the ref callback starts the chart, and the function it returns destroys it"
<div
  ref={(node) => {
    const chart = ~createChart(node)~; // React calls the ref callback when the div is added to the page
    return () => ~chart.destroy()~; // React calls this function when the div is removed
  }}
/>
```

> [!DEFINITION]
> **A ref callback.** [REVIEW] A ref callback is a function passed to the `ref` prop of a JSX element, allowing you to access the underlying DOM node directly.
> 1. You pass a function to a JSX tag: `<div ref={(node) => { ... }} />`.
> 2. During the commit phase, React mounts the DOM node and invokes your callback with the raw DOM element as its argument.
> 3. Your callback can read dimensions, focus elements, or initialize third-party widgets on that DOM element.
>
> Unlike an object ref created with `useRef`, a ref callback does not store the node in a `.current` property automatically. Instead, React hands the real DOM node directly to your function, giving you full programmatic control over when and how your code interacts with the DOM element (Lesson 31).

> [!DEFINITION]
> **A ref cleanup function.** [NEW] A ref cleanup function is a teardown function returned directly by a ref callback in React 19.
> 1. Inside your ref callback, you initialize external resources and return an arrow function: `return () => chart.destroy()`.
> 2. React holds this returned function in memory as long as the DOM node remains attached to the document.
> 3. When the DOM element unmounts, or when a new ref callback replaces the old one on a re-render, React automatically invokes the cleanup function.
>
> React 19 introduces ref cleanups to pair setup logic with its corresponding teardown logic. Before React 19, React ignored any return value from a ref callback and instead invoked the callback a second time with `null`. Returning a cleanup function eliminates manual state tracking and stops external processes at the exact moment the element leaves the page (Lesson 86).

### The same idea as an Effect's cleanup

The returned cleanup function follows the same design as an Effect cleanup. In an Effect, the setup routine returns a cleanup function that undoes its work when the component unmounts or before re-running (Lesson 32).

In structure, both mechanisms are identical. The setup logic initializes a resource, and the returned function tears it down. In development, Strict Mode validates both features using the same sequence: setup, cleanup, and setup again (Lesson 47).

In execution timing, however, they differ completely. An Effect follows the lifecycle of the component and its dependency values. A ref callback follows the physical lifecycle of an individual DOM node. React executes the ref callback when that specific node is inserted into the document, and executes its cleanup function when that node is removed. On our weather page, the `<div>` appears and disappears conditionally while the parent component stays mounted. Principle 5 explores this distinction in detail.

### The Rule of Thumb: what did the ref callback start?

**Whatever the ref callback starts outside React, the function it returns must stop.** React provides the timing and executes the cleanup function at the right moment. The responsibility of what to destroy remains entirely with your code.

Failing to clean up leaves a page that looks visually correct while background resource usage accumulates steadily:
1. The user navigates to Week, and the chart renders. The user returns to Today, and the chart container leaves the document.
2. Without a cleanup function, the chart library continues listening to the window for an element that no longer exists in the DOM. Each visit to Week registers another active listener.
3. After several tab switches, the browser shows one visual chart, but multiple chart instances remain active in memory. Resizing the browser window causes every orphaned chart to recalculate and redraw simultaneously.

The official React documentation defines such accumulating listeners as memory leaks that cause serious performance degradation in production applications (Lesson 47).

Experienced developers guard against three common mistakes:
1. **Assuming React cleans up everything attached to the DOM node.** React removes the `<div>` element from the DOM tree. The browser garbage collector can then reclaim memory for the node itself. However, event listeners registered on global objects like `window` remain permanently active, keeping the chart instance in memory.
2. **Handling only the node argument in legacy callbacks.** When writing older ref callbacks without cleanups, developers often write a condition to handle the DOM element, but forget to write the corresponding branch that handles `null`.
3. **Defining the ref callback as an inline arrow function.** An inline function creates a new reference on every render, causing React to detach the previous callback and attach the new one during unrelated re-renders.

The rest of this lesson examines each scenario using our weather application.

## SECTION | A Weather Page with a Today Tab and a Week Tab

Our weather application displays temperature data for Paris across two selectable tabs. It opens on the Today tab, showing the current temperature:

```page width=text caption="The weather page when it opens: the Today tab shows the temperature in Paris."
heading: Paris
line: [Today] [Week]
line: 18°
```

When the user clicks the Week tab, the single temperature reading disappears and a weekly forecast chart appears in its place:

```page width=text caption="The same page after the user clicks Week: the chart of the seven days takes the place of the number."
heading: Paris
line: [Today] [Week]
line: Mon 18° Tue 20° Wed 17° Thu 19° Fri 21° Sat 22° Sun 20°
```

A full production charting library would render canvas graphics or SVG paths. In this lesson, a concise local module serves as our stand-in library, outputting the weekly temperatures as formatted text. This design keeps the code small while replicating the exact lifecycle behavior of a real library.

```files title="weather-page: File Explorer" caption="The files of the weather page inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `<App />` inside `<StrictMode>`, unchanged from the Vite template
  App.jsx | parent | Holds `tab` in state, renders the two tabs, and puts the chart's div on the page when `tab` is `'week'`
  weather-chart.js | named export | Exports `createChart`, our small stand-in for a chart library
```

Our stand-in module in `weather-chart.js` performs the three critical tasks of an external graphics library (Lesson 47):
1. **It renders content into the container element.** It writes the weekly forecast into the `<div>` element.
2. **It registers global browser listeners.** It attaches a `resize` event listener to `window`.
3. **It tracks active instances.** It maintains an active instance counter, logging creations and destructions to the Console so memory leaks become immediately visible.

In production development, you will encounter three distinct ways to initialize and clean up work tied to a DOM node:
1. **A ref callback that returns a cleanup function.** This is the React 19 approach taught throughout this lesson. It is ideal for work tied to a single DOM node that mounts and unmounts conditionally. It also fits items inside a dynamic list, where `useRef` cannot be called inside `.map()`.
2. **An object ref paired with `useEffect`.** This pattern is ideal when the third-party library must re-synchronize whenever component props or state values update, such as updating a map whenever zoom coordinates change (Lesson 32).
3. **A legacy ref callback that waits for `null`.** This older pre-React 19 pattern uses a single callback to handle both mounting and unmounting. It remains supported in React 19 for backward compatibility, but the React documentation indicates it will be phased out in future releases.

**Five core principles govern ref callbacks and cleanups:**
1. **Principle 1: A ref callback with no return is called again with `null`.** Without a cleanup function, the callback must branch on `if (node)` and store the instance in a ref so the subsequent call with `null` can destroy it.
2. **Principle 2: A returned function destroys the chart it created.** Returning a cleanup function lets the setup tear down its own instance directly, prompting React to skip the legacy call with `null`.
3. **Principle 3: Curly braces keep the ref callback from returning the node.** A concise arrow function without curly braces implicitly returns the assigned DOM node, causing TypeScript to reject the function because an HTML element is not a valid cleanup.
4. **Principle 4: The same function on every render leaves the chart alone.** Passing an inline arrow function creates a new reference on each render, forcing React to destroy and recreate the chart on every unrelated state update.
5. **Principle 5: The ref cleanup follows the `<div>`, the Effect cleanup follows the component.** A conditionally rendered DOM node triggers a ref callback the moment it mounts, whereas an Effect with an empty dependency array runs only once after initial component mount.

---

## PRINCIPLE | Ref callback with no return: React calls it again with `null` when the `<div>` leaves

> [!PRINCIPLE]
> **Principle 1: The Call with null: A Ref Callback Without a Cleanup Hears the Node Leave Through null**
>
> *When a ref callback returns no function, React calls the same callback again with `null` when the `<div>` leaves; destroy the chart in that call.*
>
> React 19 still makes this second call for backwards compatibility, and its docs say the call will be removed in a future version. The call that created the chart is over by then, so the chart must wait in a ref. A callback that handles only `if (node)` creates a chart on every visit and never destroys one: the page shows one chart while the window keeps redrawing all of them.
>
> **DO THIS:**
> ```jsx
> ref={(node) => {
>   if (node) {
>     chartRef.current = createChart(node);
>   } ~else~ { // The call with null destroys the chart we kept
>     chartRef.current.destroy();
>   }
> }}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ref={(node) => {
>   ~if (node)~ { // **WRONG:** the call with null does nothing, so every chart stays alive
>     createChart(node);
>   }
> }}
> ```

### One function, called with the node and then with `null`

We begin by examining how React invokes a ref callback across tab switches. The application renders two navigation buttons and attaches a ref callback that logs every value React passes to it. The container element renders conditionally only when `tab` equals `'week'` (Lesson 10):

```jsx title="src/App.jsx"
import { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState('today');

  return (
    <main>
      <h1>Paris</h1>
      <nav>
        <button onClick={() => setTab('today')}>Today</button>
        <button onClick={() => setTab('week')}>Week</button>
      </nav>
      {tab === 'today' && <p>18°</p>}
      {~tab === 'week' &&~ ( // The div is on the page only while tab is 'week'
        <div
          className="chart"
          ref={(node) => {
            ~console.log('Called with', node)~; // Logs what React hands the ref callback
          }}
        />
      )}
    </main>
  );
}
```

The user clicks Week, and then clicks Today. The browser Console displays four separate invocations:

```page width=text caption="The page after the user clicks Week and then Today: the div is gone, and the Console shows four calls."
heading: Paris
line: [Today] [Week]
line: 18°
log: Called with <div class="chart"></div> | App.jsx:18
log: Called with null | App.jsx:18
log: Called with <div class="chart"></div> | App.jsx:18
log: Called with null | App.jsx:18
```

**React invokes the exact same callback function first with the DOM element, and later with `null`.** Here is the complete execution order:
1. The user clicks Week. React inserts the `<div>` into the document and immediately calls the ref callback with that DOM element.
2. In development mode, Strict Mode automatically tests the ref callback by simulating an unmount and remount (Lesson 47). It invokes the callback with `null`, and then immediately invokes it again with the DOM element.
3. The user clicks Today. State updates, the condition evaluates to false, and React removes the `<div>` from the document. Because the callback returned no cleanup function, React invokes the callback again with `null`.

In React documentation, these two lifecycle transitions have specific names. When React links the ref to the element, the ref is **attached**. When React disconnects the ref from the element, the ref is **detached**. When no cleanup function is returned, receiving `null` is the only signal your callback receives that the element was detached.

React 19 maintains this legacy invocation for **backwards compatibility**. Existing codebases written for earlier React versions rely on receiving `null` during unmount. The official React documentation notes that this dual-invocation behavior will be deprecated in future versions.

### The chart stand-in

Now we connect our external library stand-in to the container element. Here is the implementation of `weather-chart.js`:

```js title="src/weather-chart.js"
let activeCharts = 0;

export function createChart(node) {
  node.textContent = 'Mon 18° Tue 20° Wed 17° Thu 19° Fri 21° Sat 22° Sun 20°';
  function redraw() {
    console.log('Chart redrawn');
  }
  ~window.addEventListener('resize', redraw)~; // The listener lives on window, outside the div
  activeCharts += 1;
  console.log('Chart created. Active charts: ' + activeCharts);
  return {
    destroy() {
      ~window.removeEventListener('resize', redraw)~; // Only destroy removes the listener
      activeCharts -= 1;
      console.log('Chart destroyed. Active charts: ' + activeCharts);
    },
  };
}
```

The `createChart` function returns an object containing a single `destroy` method. Calling `destroy` is the only way to remove the listener from `window` and decrement the active chart counter. In our component file, `App.jsx` imports `createChart` directly from this module.

### Creating the chart without destroying it

A developer creates a first version of the component. The callback handles only the call that delivers the DOM element, ignoring the unmount phase entirely:

```jsx title="src/App.jsx" startLine="15"
      {tab === 'week' && (
        <div
          className="chart"
          ref={(node) => {
            ~if (node)~ { // **WRONG:** handles only the call with the div; the call with null does nothing
              createChart(node);
            }
          }}
        />
      )}
```

The user clicks Week, switches to Today, and clicks Week again. The visual UI shows only a single chart. However, the Console reveals four active instances:

```page width=text caption="The page after the user clicks Week, Today, and Week again: one chart on the page, four live charts in the Console."
heading: Paris
line: [Today] [Week]
line: Mon 18° Tue 20° Wed 17° Thu 19° Fri 21° Sat 22° Sun 20°
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart created. Active charts: 2 | weather-chart.js:10
log: Chart created. Active charts: 3 | weather-chart.js:10
log: Chart created. Active charts: 4 | weather-chart.js:10
```

**The browser displays one visual chart, but four separate chart instances remain active in memory.** Each visit to the Week tab instantiates two charts because the code never performs teardown:
1. The user clicks Week. React calls the callback with the DOM element, creating the first chart instance.
2. Strict Mode invokes the callback with `null`. The `if (node)` check ignores this call, leaving the first chart running.
3. Strict Mode calls the callback with the DOM element again. A second chart initializes inside the same container.
4. The user clicks Today. React removes the container element and invokes the callback with `null`. Once again, the `if (node)` check ignores the call.
5. The user clicks Week again, repeating the cycle and driving the active count to four.

If the user resizes the browser window, every active listener executes. The Console logs four redraw messages for a single visible chart on the screen. Two of those chart instances point to an orphaned container that was already unmounted.

Strict Mode makes this memory leak apparent immediately upon mounting (Lesson 47). In production builds without Strict Mode, each visit to Week still adds one orphaned chart, and the instance count steadily increases over time.

### VS | Without the `else` Branch vs. With It: only the `else` branch destroys the chart

Resolving this bug requires two coordinated steps:
1. **The callback must handle the unmount call with `null`.** This requires an `else` branch in the callback logic.
2. **The callback must retain access to the chart instance.** When React invokes the callback with `null`, the original setup execution is finished and its local variables are gone. The legacy pattern stores the chart instance inside a ref container, which persists values across renders (Lesson 30).

We import `useRef` alongside `useState` to store the chart instance:

```jsx title="src/App.jsx" startLine="5"
  const [tab, setTab] = useState('today');
  const ~chartRef~ = useRef(null); // Keeps the chart between the call with the div and the call with null
```

```jsx title="src/App.jsx" startLine="16"
      {tab === 'week' && (
        <div
          className="chart"
          ref={(node) => {
            if (node) {
              ~chartRef.current = createChart(node)~; // The call with the div: create the chart and keep it
            } ~else~ { // The call with null: destroy the chart we kept
              chartRef.current.destroy();
            }
          }}
        />
      )}
```

Now when the user navigates between Week and Today, the active chart count never exceeds one:

```page width=text caption="With the else branch, after the user clicks Week, Today, and Week again: one chart on the page, one live chart in the Console."
heading: Paris
line: [Today] [Week]
line: Mon 18° Tue 20° Wed 17° Thu 19° Fri 21° Sat 22° Sun 20°
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
log: Chart created. Active charts: 1 | weather-chart.js:10
```

Both implementations produce the same visual output on the screen. However, their underlying memory management differs completely. With the `else` branch in place, each unmount invocation cleans up the existing chart and unregisters its window listener. Without it, the unmount call is ignored and resources leak.

Although this legacy approach functions correctly, it introduces unnecessary complexity:
1. **The chart instance must be stored in `chartRef`**, requiring an extra ref declaration outside the callback.
2. **A single function must manage two conflicting responsibilities**, separated only by conditional branching. It is easy for developers to forget the unmount branch.

```tree caption="The old ref callback that waits for null, without the else branch and with it."
One ref callback, two calls from React
- !Without the `else` branch [`if`] | The call with the div **creates a chart** | The call with `null` **does nothing**, so every chart **stays alive**
- +With the `else` branch and `chartRef` [`if` `else` `chartRef`] | The call with the div **creates the chart and keeps it in a ref** | The call with `null` **destroys the kept chart**
```

Notice that an object ref created with `useRef` never requires an `else` branch. When an element unmounts, React automatically resets `ref.current` to `null` on built-in JSX tags (Lesson 31). The manual `null` check is necessary only when using a function callback to orchestrate external side effects.

---

## PRINCIPLE | Ref callback that returns a function: React calls it when the `<div>` leaves, and it destroys the exact chart it created

> [!PRINCIPLE]
> **Principle 2: Ref Cleanup: The Returned Function Destroys the Chart It Created**
>
> *In React 19, return a cleanup function from the ref callback that undoes exactly what the setup started; React calls it when the `<div>` leaves and skips the call with `null`.*
>
> The setup creates the cleanup in the same call, so the cleanup sees the chart and the node of that setup. There is no ref to carry the chart and no branch for `null` to forget. React undoes nothing by itself: an empty cleanup is called at the right moment and leaves every listener running.
>
> **DO THIS:**
> ```jsx
> ref={(node) => {
>   const chart = createChart(node);
>   return ~() => chart.destroy()~; // Removes the window listener of this exact chart
> }}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ref={(node) => {
>   createChart(node);
>   return ~() => {}~; // **WRONG:** React calls it when the div leaves, and nothing is destroyed
> }}
> ```

### The setup returns its own undo

In React 19, a ref callback can return its own teardown routine directly:

```jsx title="A ref callback that returns its own cleanup"
ref={(node) => {
  const chart = createChart(node);
  return ~() => chart.destroy()~; // React keeps this function and calls it when the div leaves
}}
```

When the `<div>` unmounts, React automatically executes the returned function. Furthermore, when a ref callback returns a cleanup function, React skips the legacy second call with `null`. Because React never invokes this callback with `null`, the `node` argument is always guaranteed to be a valid DOM element. Defensive `if (node)` checks are no longer needed.

### VS | The `null` Branch vs. the Returned Function: the same result for the user, half the parts in the code

Comparing the two approaches side by side reveals the structural simplification:

```jsx title="With the null branch and chartRef"
ref={(node) => {
  if (node) {
    chartRef.current = createChart(node);
  } else {
    ~chartRef.current.destroy()~; // The chart must come back from the ref
  }
}}
```

```jsx title="With the returned cleanup"
ref={(node) => {
  const chart = createChart(node);
  return () => ~chart.destroy()~; // The chart is right here, in the same function
}}
```

From the perspective of the user and the instance count, both techniques accomplish the same goal. Both instantiate the chart when clicking Week, both tear it down when clicking Today, and the active instance count never exceeds one.

In code architecture, however, the patterns are fundamentally different:
1. **The legacy approach** requires managing two separate phases inside one function, supported by an external ref to hold the chart instance between calls.
2. **The React 19 cleanup approach** pairs setup and teardown within a single closure. There is no external ref to synchronize, and no conditional branch to overlook.

### Why the cleanup still sees `chart`

The cleanup function executes much later, when the user navigates away from the Week tab. By that time, the initial execution of the ref callback has long since finished. How does the cleanup function still hold a reference to that specific chart instance?

This works because JavaScript functions form closures over their lexical scope (Lesson 15). The cleanup function is declared in the exact same execution context as the `chart` variable:
1. React mounts the `<div>` and calls the ref callback with the DOM node.
2. The callback calls `createChart` and defines the cleanup arrow function in the same scope.
3. The callback returns that arrow function, which React preserves in memory.
4. When the `<div>` unmounts, React executes that preserved arrow function, which accesses the exact `chart` instance captured in its closure.

For this same reason, if the cleanup function logs `node`, it logs the specific DOM element that was originally mounted, never `null`.

The cleanup function is not an independent callback that React invents. Your setup code defines it, and React simply stores it until the proper unmount moment arrives.

### The returned cleanup on our page

In `App.jsx`, we can eliminate the external ref declaration and conditional checks entirely. We also remove `useRef` from our imports, while `weather-chart.js` remains unchanged:

```jsx title="src/App.jsx"
import { useState } from 'react';
import { createChart } from './weather-chart.js';

export default function App() {
  const [tab, setTab] = useState('today');

  return (
    <main>
      <h1>Paris</h1>
      <nav>
        <button onClick={() => setTab('today')}>Today</button>
        <button onClick={() => setTab('week')}>Week</button>
      </nav>
      {tab === 'today' && <p>18°</p>}
      {tab === 'week' && (
        <div
          className="chart"
          ref={(node) => {
            const chart = ~createChart(node)~; // The setup: draws the chart and starts the window listener
            return ~() => chart.destroy()~; // The cleanup: removes the listener of this exact chart
          }}
        />
      )}
    </main>
  );
}
```

When the user clicks Week, development mode Console output shows the chart created, destroyed, and recreated via Strict Mode:

```page width=text caption="With the returned cleanup, after one click on Week in development: Strict Mode's extra test ends at one live chart."
heading: Paris
line: [Today] [Week]
line: Mon 18° Tue 20° Wed 17° Thu 19° Fri 21° Sat 22° Sun 20°
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
log: Chart created. Active charts: 1 | weather-chart.js:10
```

This reflects the standard Strict Mode verification cycle: setup, cleanup, and setup. React documentation explains that this cycle verifies whether the cleanup function properly mirrors the setup routine. Because our cleanup removes the window listener, the verification succeeds with exactly one active chart remaining. When the user clicks Today, the Console logs destruction, returning the active count to zero.

### A cleanup undoes only what you write in it

Technical interviews often ask how ref cleanups prevent memory leaks. The crucial technical reality is that a ref cleanup does not automatically destroy external resources. React simply provides the trigger, calling the cleanup function at the precise unmount moment. What actually gets torn down depends entirely on the code you place inside that cleanup function.

If a ref callback returns an empty cleanup function, memory still leaks. React calls the empty function on unmount and skips the legacy call with `null`, leaving external listeners running unchecked. The official React documentation highlights this mistake, categorizing an incomplete cleanup as a serious production bug (Lesson 47).

The principle mirrors `useEffect`: the cleanup function must undo every side effect initiated by the setup. In our weather chart, this means removing the `resize` listener from `window` and decrementing the active instance count.

```tree dir=right caption="The life of one chart on our page, with the returned cleanup."
One visit to the Week tab
- +1. The user clicks Week [`createChart`] | React adds the div and **calls the ref callback with it** | The setup **creates `chart`** and **returns its own cleanup**
- +2. React keeps the cleanup | The cleanup **sees `chart`** because it was **created in the same call** | `chartRef` and the **call with `null`** are **not needed**
- +3. The user clicks Today [`destroy`] | React removes the div and **calls the kept cleanup** | That exact chart **stops listening to the window**
```

Ref cleanup functions are not limited to standard DOM elements. According to the official React 19 announcement, ref cleanups function across DOM refs, class component refs, and handles created with `useImperativeHandle`. The cleanup also runs automatically whenever the parent component unmounts, since removing a parent unmounts all nested DOM nodes as well.

---

## PRINCIPLE | `node => { ... }` with curly braces: the ref callback returns nothing or a cleanup, never the node by accident

> [!PRINCIPLE]
> **Principle 3: Block Bodies: A Ref Callback Returns Nothing or a Cleanup**
>
> *Write a ref callback with curly braces, so that it returns either nothing or a cleanup function, never a value by accident.*
>
> React 19 reads what a ref callback returns as its cleanup. An arrow function with parentheses returns the value of its body, so `current => (instance = current)` hands the node back to React. TypeScript cannot tell whether that node was meant as a cleanup, so it rejects the line.
>
> **DO THIS:**
> ```jsx
> <div ref={current => ~{instance = current}~} /> {/* Curly braces: returns nothing */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div ref={current => ~(instance = current)~} /> {/* **WRONG:** returns the node, which TypeScript rejects as a cleanup */}
> ```

### VS | Parentheses vs. Curly Braces After the Arrow: one returns the node, the other returns nothing

Prior to React 19, React completely ignored whatever value a ref callback returned. Because of this, developers frequently wrote compact single-line arrow callbacks to store DOM nodes in an instance variable. React documentation contrasts these two concise forms:

```jsx title="Storing the node with parentheses, and with curly braces"
<div ref={current => ~(instance = current)~} /> {/* Parentheses: stores the node, and returns it */}
<div ref={current => ~{instance = current}~} /> {/* Curly braces: stores the node, and returns nothing */}
```

Both lines assign the DOM element to the variable `instance`. However, their underlying behavior differs significantly. The first line assigns the node and also returns it to the caller.

In JavaScript, wrapping an arrow function body in parentheses creates an expression body that implicitly returns the result of the expression (Lesson 18). An assignment expression evaluates to the assigned value itself. Consequently, `(instance = current)` returns the DOM element back to React. In contrast, wrapping the body in curly braces creates a block body. Without an explicit `return` statement, a block body returns `undefined`.

### Why React 19 cares about the return value

In React 19, the return value of a ref callback carries specific architectural meaning: it defines the cleanup function. When an arrow callback accidentally returns a DOM element, React interprets that element as a cleanup routine.

TypeScript detects this ambiguity immediately. As the React 19 release notes explain, the type checker cannot distinguish whether you intended to return a cleanup function or accidentally leaked an implicit return value. Therefore, TypeScript type definitions in React 19 strictly reject any ref callback that returns a non-function value.

Engineering teams migrating to React 19 regularly encounter this compiler error:
1. Legacy code written for React 18 assigns an element using concise syntax: `current => (instance = current)`.
2. The team upgrades their project dependencies to React 19 and runs the TypeScript compiler.
3. TypeScript flags a type error because the callback returns an `HTMLDivElement` instead of a cleanup function or `void`.
4. The developers convert the concise expression into a block body using curly braces, ensuring the callback returns nothing and satisfying the type checker.

The React documentation advises developers to avoid implicit returns in ref callbacks. To automate this migration across large codebases, the React team published an automated codemod named `no-implicit-ref-callback-return`.

```tree caption="The same one-line ref callback with parentheses and with curly braces, in React 19."
What the ref callback hands back to React
- !Parentheses after the arrow | Stores the node **and returns it** | TypeScript **rejects it**: the node is **not a cleanup**
- +Curly braces after the arrow | Stores the node **and returns nothing** | React uses the **call with `null`** when the div leaves
```

This follows the established rule for `useEffect`: an Effect setup may return only a cleanup function or `undefined` (Lesson 32). In React 19, ref callbacks strictly follow this same contract.

---

## PRINCIPLE | `ref={attachChart}`: the same function on every render, so a re-render leaves the chart alone

> [!PRINCIPLE]
> **Principle 4: The Same Function Reference: Clicking Save Leaves the Chart Alone**
>
> *When the setup is costly, pass the same function to `ref` on every render, written outside the component or kept with `useCallback`.*
>
> An arrow function written inside `ref` is a new function on every render. After each re-render, React detaches the old ref callback and attaches the new one, so it runs the old cleanup and the new setup on the same `<div>`. The cleanup keeps the count right, so this is not a leak, but every unrelated state change throws the chart away and builds it again.
>
> **DO THIS:**
> ```jsx
> function attachChart(node) {
>   const chart = createChart(node);
>   return () => chart.destroy();
> }
>
> <div ~ref={attachChart}~ /> {/* The same function on every render: Save leaves the chart alone */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div
>   ref={~(node) => {~ // **WRONG:** a new function on every render, so Save destroys and rebuilds the chart
>     const chart = createChart(node);
>     return () => chart.destroy();
>   }}
> />
> ```

### A Save button that has nothing to do with the chart

In real applications, users interact with multiple features on the same screen. We add a Save button next to the city heading. Clicking this button toggles a boolean state variable, updating the button text to Saved:

```jsx title="src/App.jsx" startLine="4"
export default function App() {
  const [tab, setTab] = useState('today');
  const [saved, setSaved] = useState(false);

  return (
    <main>
      <h1>Paris</h1>
      <button ~onClick={() => setSaved(true)}~>{saved ? 'Saved' : 'Save'}</button> {/* Changes saved, not tab */}
```

The remainder of `App.jsx` retains the ref callback written as an inline arrow function, exactly as structured in Principle 2.

The user navigates to the Week tab, rendering the active chart. Next, the user clicks the Save button. The button text updates to Saved, and the Console logs two additional operations beneath the initial Strict Mode logs:

```page width=text caption="The Week tab after the user clicks Save: the label says Saved, and the last two Console lines show the chart destroyed and created again."
heading: Paris
line: [Saved]
line: [Today] [Week]
line: Mon 18° Tue 20° Wed 17° Thu 19° Fri 21° Sat 22° Sun 20°
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
log: Chart created. Active charts: 1 | weather-chart.js:10
```

**Even though the container element remained continuously in the DOM, React destroyed and recreated the chart.** Here is why this occurs:
1. The user clicks Save. Calling `setSaved(true)` triggers a re-render of `App`.
2. As React executes `App`, JavaScript evaluates the JSX and constructs a brand new arrow function for the `ref` prop. In JavaScript, every function declared inside a component body receives a new memory reference on each render (Lesson 15).
3. During the commit phase, React compares the newly passed ref callback against the callback from the previous render. Because their memory references differ, React treats the callback as changed.
4. React detaches the previous ref callback by executing its cleanup function, destroying the active chart.
5. React attaches the new ref callback by invoking it with the existing DOM node, constructing an entirely new chart instance.

The official React documentation explicitly warns about this behavior. Unless you pass the same function reference on every render, React detaches the old callback and attaches the new callback on every render cycle.

The active chart counter still resolves to one, so no memory leak occurs. However, rebuilding complex visualizations on unrelated state updates wastes significant CPU resources. While our stand-in module simply updates text, a production chart library would re-parse datasets, rebuild SVG nodes, and re-allocate canvas buffers.

Legacy ref callbacks without cleanups suffer from this same issue. React calls the previous callback with `null` and invokes the new callback with the DOM element during every re-render.

### VS | An Arrow Inside `ref` vs. a Function Written Outside the Component: only the second is the same function on every render

React avoids reattaching the callback when you provide a stable function reference across renders. A **function reference** is the function identifier passed by name without invoking it, such as `ref={attachChart}`. When the reference remains identical between renders, React skips teardown and setup completely.

Because our ref callback does not depend on any state or props inside `App`, we can declare it once outside the component scope:

```jsx title="src/App.jsx" startLine="4"
function ~attachChart~(node) { // Written once, when the file loads: the same function on every render
  const chart = createChart(node);
  return () => chart.destroy();
}
```

```jsx title="src/App.jsx" startLine="22"
      {tab === 'week' && <div className="chart" ~ref={attachChart}~ />} {/* The same function reference on every render */}
```

Now the user opens Week and clicks Save. The button updates to Saved, and the Console displays no additional logs:

```page width=text caption="With ref={attachChart}, the Week tab after the user clicks Save: the label says Saved, and the chart is left alone."
heading: Paris
line: [Saved]
line: [Today] [Week]
line: Mon 18° Tue 20° Wed 17° Thu 19° Fri 21° Sat 22° Sun 20°
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
log: Chart created. Active charts: 1 | weather-chart.js:10
```

The initial three log entries represent Strict Mode's mount verification. Clicking Save produces no new console output because React sees the same `attachChart` reference and leaves the DOM element untouched.

When switching tabs, both the inline arrow and `attachChart` perform the necessary setup and teardown. But during unrelated re-renders, their performance differs dramatically. Using `attachChart` preserves the existing chart instance and eliminates redundant work.

If a ref callback must access component props or state, such as a localized temperature unit, it cannot reside outside the component. In that scenario, wrap the callback in `useCallback` to maintain reference stability across re-renders (Lesson 57).

```tree caption="The ref callback written as an arrow inside ref, and written once outside the component, when the user clicks Save."
What React does with the chart when the user clicks Save
- !An arrow written inside `ref` | Every render **creates a new function** | React **calls the old cleanup** and **the new callback**: the chart is **destroyed and built again**
- +A function written outside the component [`attachChart`] | Every render passes the **same function reference** | React **leaves the ref alone**: the chart **stays as it is**
```

---

## PRINCIPLE | Ref callback, not `useEffect`: the work starts and stops with the `<div>`, not with the component

> [!PRINCIPLE]
> **Principle 5: The Right Moment: The Ref Cleanup Follows the div, the Effect Cleanup Follows the Component**
>
> *Use a ref callback for work that starts and stops with one DOM node, and an Effect for work that follows the component and its dependencies.*
>
> Both return the same kind of cleanup, and Strict Mode tests both the same way. But React calls a ref callback when its `<div>` is attached or detached, while an Effect runs after the component mounts and again only when a dependency changes. A `<div>` that appears after a click inside the same component starts the ref callback and never starts an Effect with `[]`.
>
> **DO THIS:**
> ```jsx
> {tab === 'week' && <div ~ref={attachChart}~ />} {/* Runs each time the div is attached */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   if (!divRef.current) return;
>   const chart = createChart(divRef.current);
>   return () => chart.destroy();
> }, ~[]~); // **WRONG:** runs once while the page shows Today, so the Week div stays empty
> ```

### The same chart in an Effect

Developers accustomed to `useEffect` often attempt to manage DOM widgets using an object ref and an Effect hook (Lesson 32). In this pattern, the developer attaches `divRef` to the element and places chart initialization inside an Effect with an empty dependency array:

```jsx title="The same chart in an Effect, inside App"
const divRef = useRef(null);

useEffect(() => {
  if (!divRef.current) {
    return; // No div on the page: nothing to draw
  }
  const chart = createChart(divRef.current);
  return ~() => chart.destroy()~; // The same cleanup as the ref callback
}, ~[]~); // Runs once, after App mounts

{tab === 'week' && <div className="chart" ref={divRef} />}
```

Both approaches return a cleanup function that invokes `chart.destroy()`. Both pass the standard Strict Mode verification cycle of setup, cleanup, and setup. However, their execution triggers differ fundamentally.

### An empty `<div>` on the Week tab

When the application loads, it opens on the Today tab. The user then clicks the Week tab. The Today temperature disappears, but no weekly forecast chart renders:

```page width=text caption="With the Effect inside App, the page after the user clicks Week: no chart under the tabs."
heading: Paris
line: [Save]
line: [Today] [Week]
console: quiet
```

Inspecting the Elements panel confirms that the container element exists in the DOM, but remains completely empty:

```dom caption="The Elements panel after the user clicks Week, with the Effect inside App: the chart's div is on the page, and it is empty."
<main>
  <h1>Paris</h1>
  <button>Save</button>
  <nav>
    <button>Today</button>
    <button>Week</button>
  </nav>
  ! <div class="chart"></div> | note: On the page, with no chart inside
</main>
```

**The container element is present on the page, but no initialization logic ever executed.** Here is the underlying breakdown:
1. The page loads on the Today tab, mounting `App`. Because the Week tab is inactive, the chart container is not rendered, leaving `divRef.current` initialized to `null` (Lesson 31).
2. The Effect executes once following this initial commit. It checks `!divRef.current`, finds `null`, and returns early without initializing anything.
3. Later, the user clicks Week. React re-renders the component, inserts the `<div>` into the document, and sets `divRef.current` to the real DOM element.
4. However, because the Effect has an empty dependency array, React does not execute the Effect again (Lesson 35). The chart initialization never runs, leaving the container blank.

With `ref={attachChart}`, step 3 renders the chart immediately. Mounting the `<div>` is the exact trigger that causes React to invoke the ref callback.

You could force the Effect to run by adding `tab` to its dependency array. But this requires writing defensive checks and manually synchronizing the Effect with every state condition that controls DOM visibility. A ref callback encapsulates this lifecycle automatically: it runs when the element enters the DOM, and cleans up when the element leaves.

```tree caption="The same chart started by an Effect inside App and by a ref callback on the div."
What starts the chart when the user clicks Week
- !An Effect with `[]` inside `App` [`useEffect` `divRef`] | Runs **once, after `App` mounts**, when there is **no div** | The click on Week **does not run it again**: the div **stays empty**
- +A ref callback on the div [`attachChart`] | Runs **when the div is attached** and cleans up **when it is detached** | Every click on Week **draws the chart**
```

### When the Effect is the right tool

Using `useEffect` is not incorrect in all scenarios; it simply synchronizes with different entities: the component instance and its state dependencies.
1. **When the DOM element mounts alongside its own component**, an Effect with an empty dependency array works reliably. If the chart lived inside its own child component, that component would mount alongside its container element. Its Effect would find the DOM node reliably on mount.
2. **When the external widget must synchronize with changing state or props**, `useEffect` is the proper tool. For instance, the React documentation presents a map widget that updates its zoom level whenever a `zoomLevel` state variable changes (Lesson 32).

A ref callback is the ideal mechanism when setup and teardown are bound directly to the presence of a single DOM node. It is also the standard pattern for managing elements inside a list, because the Rules of Hooks prevent calling `useRef` inside a `.map()` callback (Lesson 38).

---

## All 5 Principles Together

### The complete files

Here is the finished implementation of `App.jsx`. The ref callback is declared once outside the component scope and returns its own cleanup function:

```jsx title="src/App.jsx"
import { useState } from 'react';
import { createChart } from './weather-chart.js';

function ~attachChart~(node) { // Principles 2 and 4: one setup that returns its undo, the same function on every render
  const chart = createChart(node);
  return () => chart.destroy(); // Principle 3: a block body that returns a cleanup
}

export default function App() {
  const [tab, setTab] = useState('today');
  const [saved, setSaved] = useState(false);

  return (
    <main>
      <h1>Paris</h1>
      <button onClick={() => setSaved(true)}>{saved ? 'Saved' : 'Save'}</button>
      <nav>
        <button onClick={() => setTab('today')}>Today</button>
        <button onClick={() => setTab('week')}>Week</button>
      </nav>
      {tab === 'today' && <p>18°</p>}
      {tab === 'week' && <div className="chart" ~ref={attachChart}~ />} {/* Principle 5: starts with the div, not with App */}
    </main>
  );
}
```

The stand-in module in `weather-chart.js` remains unchanged:

```js title="src/weather-chart.js"
let activeCharts = 0;

export function createChart(node) {
  node.textContent = 'Mon 18° Tue 20° Wed 17° Thu 19° Fri 21° Sat 22° Sun 20°';
  function redraw() {
    console.log('Chart redrawn');
  }
  window.addEventListener('resize', redraw);
  activeCharts += 1;
  console.log('Chart created. Active charts: ' + activeCharts);
  return {
    destroy() {
      ~window.removeEventListener('resize', redraw)~; // Principle 1: the work outside the div that must be stopped
      activeCharts -= 1;
      console.log('Chart destroyed. Active charts: ' + activeCharts);
    },
  };
}
```

The user clicks Week, clicks Save, and then clicks Today. The Console logs proper creation, ignores the Save click, and cleans up upon unmounting:

```page width=text caption="The finished page after the user clicks Week, Save, and Today: one chart created and destroyed, with Strict Mode's test on the first click."
heading: Paris
line: [Saved]
line: [Today] [Week]
line: 18°
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
log: Chart created. Active charts: 1 | weather-chart.js:10
log: Chart destroyed. Active charts: 0 | weather-chart.js:15
```

### What React calls, in order

```tree dir=right caption="The order in which React calls attachChart and its cleanup as the user clicks Week, Save, and Today."
`App` with the chart's div on the Week tab
- +1. The user clicks Week [`attachChart`] | React adds the div and **calls `attachChart` with it** | In development, Strict Mode runs **cleanup and setup once more**
- +2. The user clicks Save [`saved`] | React renders `App` again with the **same `attachChart`** | React **leaves the ref alone**: no cleanup, no setup
- +3. The user clicks Today [`destroy`] | React removes the div and **calls the kept cleanup** | The chart **stops listening to the window**: zero live charts
```

### The mistake, and the React rule

| Principle | The Mistake | The React Rule |
| :--- | :--- | :--- |
| **1. The call with `null`** | Handle only `if (node)`, so every visit to Week leaves an orphaned chart listening to the window | Without a returned cleanup, destroy the chart when React calls the ref callback with `null`, and store the instance in a ref until then |
| **2. The returned cleanup** | Retain instances in a ref with conditional null checks, or return an empty cleanup function | Return a cleanup function from the setup; it captures the instance in its closure, and React skips the legacy call with `null` |
| **3. Block bodies** | Assign the element with concise arrow syntax `current => (instance = current)`, which implicitly returns the node | Use curly braces to form a block body, ensuring the ref callback returns either a cleanup function or `undefined` |
| **4. The same function reference** | Declare the ref callback as an inline arrow inside JSX, causing every render to tear down and rebuild the widget | Pass a stable function reference across renders by declaring the callback outside the component or wrapping it with `useCallback` |
| **5. The right moment** | Initialize the chart in an Effect with an empty dependency array when the container element renders conditionally | Use a ref callback for work tied directly to a DOM element, and reserve Effects for logic synchronizing with component state and props |

Remember the central thesis of this lesson. **Whatever external work a ref callback starts, the cleanup function it returns must stop, and React calls that function the moment the DOM node unmounts.**

---

## For the Interview

> **The Interview Question:** How do React 19 ref cleanup functions work, and how do they eliminate memory leaks?

### How to Answer Clearly in 30 Seconds

"A ref callback is a function passed to the `ref` prop that React invokes with the underlying DOM node upon mounting. In React 19, that callback can return a cleanup function, mirroring an Effect cleanup. React stores this returned function and executes it when the ref is detached, skipping the legacy call with `null`. Because the setup creates the cleanup in the same scope, the cleanup captures the DOM node and chart instance through closure. This eliminates external ref storage and prevents memory leaks by guaranteeing teardown when elements unmount. Two practical details matter: keep the callback reference stable across renders to avoid redundant restarts. In addition, use block bodies with curly braces so arrow functions never implicitly return DOM elements."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Callback refs used to receive `null` on unmount. Does that still happen in React 19?"**
   Only when the ref callback does not return a cleanup function. For backward compatibility with older libraries, React 19 continues to invoke callbacks with `null` on unmount if no cleanup function was returned. The React documentation notes that this legacy behavior will be deprecated in future releases. When a callback returns a cleanup function, React invokes the cleanup function and skips the call with `null`. Returning a cleanup is far safer because setup and teardown reside in one closure. This eliminates external ref storage and prevents developers from forgetting the unmount branch.

2. **"Does a ref cleanup guarantee that there are no memory leaks?"**
   No. React guarantees only the execution timing: it reliably calls the cleanup function when the element detaches, and Strict Mode validates this cycle in development. The actual prevention of memory leaks depends entirely on what logic you write inside the cleanup. A widget that only manipulates its own child elements will be garbage collected with its parent DOM node. But external subscriptions, like window resize listeners or intervals, remain active until explicitly cleared. Returning an empty function `() => {}` satisfies React but leaves external resources leaking in memory.

3. **"When would you use a ref callback with a cleanup instead of `useRef` plus `useEffect`?"**
   Use a ref callback when side effects are tied directly to the lifecycle of an individual DOM element. A ref callback triggers immediately when its element attaches to the DOM and cleans up when it detaches. This makes it ideal for elements that appear conditionally based on state, as well as items in dynamic lists where `useRef` cannot be called inside a `.map()` callback. In contrast, an Effect with an empty dependency array runs only once after component mount, meaning it completely misses DOM nodes that render conditionally later. Use `useEffect` when setup logic must re-synchronize with changing props or state values, such as an interactive map responding to new coordinates.

```tree caption="Interview comparison: the old call with null, the React 19 ref cleanup, and an Effect cleanup."
Three ways to stop work tied to a DOM node
- !The old call with `null` [`if` `else` `chartRef`] | React calls the **same callback again with `null`** | The chart must live **in a ref**, and the `else` branch is **easy to forget**
- +The React 19 ref cleanup [`return`] | React calls the **returned function when the ref is detached** | The cleanup **sees what its own setup created**
- +An Effect cleanup [`useEffect`] | React calls it **before the Effect runs again** and **when the component unmounts** | Follows **the component and its dependencies**, not one node
```
