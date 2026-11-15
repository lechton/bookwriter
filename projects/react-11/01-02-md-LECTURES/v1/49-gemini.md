# Lecture 49: Measuring Before the Paint with useLayoutEffect, and Why useInsertionEffect Belongs to Style Libraries

*(How can a tooltip measure itself and find its place before the user sees it?)*

> INTERVIEW QUESTION | ❱❱ MORE | When must code run after DOM updates but before the browser paints, and why is useInsertionEffect reserved for style libraries?

---

## VS | `useEffect` vs. `useLayoutEffect`: the same code, but only one runs before the user sees the screen

> When React updates the DOM, the browser draws the screen on the next frame, and `useEffect` runs only after that paint. **When code measures an element and repositions it, place that code in `useLayoutEffect`, which runs after DOM mutations but before the browser paints**. Otherwise the user sees the element in the wrong position first, and then watches it jump.

In standard JavaScript, scripts manipulate elements synchronously before the browser renders. When a script creates an element, appends it to the document, measures its dimensions, and shifts its position, the browser waits. The rendering engine draws pixels on screen only after the current synchronous JavaScript task completes:

```js title="Plain JavaScript: add, measure, and move, all before the browser draws"
const tip = document.createElement('div');
tip.textContent = 'Delete this draft for good';
document.body.appendChild(tip); // The tooltip is in the DOM, but not on the screen yet
const height = tip.~getBoundingClientRect~().height; // The browser measures it right now
tip.style.top = buttonTop - height + 'px'; // Moves it above the button, and only then does the browser draw
```

In React applications, developers do not append DOM nodes manually. React transforms JSX into real DOM nodes during its commit phase. That creates a timing question: when does your measuring code execute? React provides two primary Hooks for running code when components mount, and each schedules work at a different stage:
- **`useEffect`** runs asynchronously after the browser paints the updated DOM. The user can see the tooltip in its initial fallback position before the effect executes.
- **`useLayoutEffect`** runs synchronously after React updates the DOM, but before the browser paints pixels. It recreates the synchronous guarantee of vanilla JavaScript.

```jsx title="React: the same measuring line in the two Hooks"
~useEffect~(() => { setTooltipHeight(ref.current.getBoundingClientRect().height); }, []); // The browser may draw the tooltip before this runs
~useLayoutEffect~(() => { setTooltipHeight(ref.current.getBoundingClientRect().height); }, []); // The browser waits until this runs and React renders again
```

> [!DEFINITION]
> **The commit and the paint.** [REVIEW] After React calls your component, it updates the DOM tree to match the returned JSX: this is the commit. A moment later, the browser converts those DOM nodes into visible pixels on screen: this is the paint. Between commit and paint, the DOM nodes exist in memory with measurable dimensions, but the user still sees the previous screen (Lesson 13).

Consider a document editor with two action buttons: Save at the top edge of the window, and Delete further down. Hovering the pointer over a button reveals a dark floating label, such as Delete this draft for good. That label is a **tooltip**. It should sit above its button when viewport space permits, and flip below when space is constrained. To position the tooltip accurately, your code must calculate whether it fits above the button. That calculation requires knowing the exact pixel height of the tooltip. And that height exists only after React inserts the tooltip into the DOM.

**Why:** With `useEffect`, the browser can paint the initial render before the measurement executes. On slower hardware, the user sees the tooltip render directly over the button, and then abruptly jump to its calculated coordinates above. The official React documentation highlights this issue, noting that tooltips can flicker and briefly display an unadjusted initial position before jumping to the correct location. On fast desktop machines, that misplaced frame might flash too quickly for the developer to detect, yet mobile users encounter it on every hover.

> [!DEFINITION]
> **A flicker.** [NEW] A flicker is a brief visual artifact where an element appears in a temporary fallback position and then abruptly snaps to its intended position. It occurs when the browser paints an initial DOM render before application code can calculate and apply proper coordinates (Lesson 49).

Remember the foundational rule of this lesson. **`useEffect` runs after the user sees the screen, while `useLayoutEffect` runs before. Code that reads DOM layout and repositions elements belongs in `useLayoutEffect`. All other side effects belong in `useEffect`.**

### Three Hooks, Three Moments

React offers three distinct Hooks for executing code when components appear. All three accept the same signature: a setup function, a dependency array, and an optional cleanup function. They differ entirely in when React invokes them:
1. **`useEffect`** handles standard side effects, including network requests, timers, external subscriptions, analytics logging, and browser event listeners. The React documentation emphasizes that executing effects before the browser paints is unnecessary for the vast majority of application tasks.
2. **`useLayoutEffect`** handles code that measures DOM layout and triggers a re-render before the browser paints, ensuring seamless placement for tooltips, popovers, and animated dialogs. An effect created with this Hook is known as a **layout Effect**.
3. **`useInsertionEffect`** serves CSS-in-JS libraries that dynamically inject style tags while the application runs. It executes before layout effects read DOM properties, allowing style rules to take effect before calculations begin.

```tree dir=right caption="The order in which React runs the three Effect Hooks around the paint."
When React runs each Effect Hook after a commit
- +1. `useInsertionEffect` | Runs **before any layout Effect** | A style library adds its `<style>` tags
- +2. `useLayoutEffect` | Runs **before the browser paints** | Our code measures the page and sets state
- +3. The browser paints | The user **sees the screen**
- +4. `useEffect` | Usually runs **after the paint** | Connections, timers, logs, data fetching
```

Selecting the wrong Hook directly degrades the user experience:
1. **Using `useEffect` for measurements** paints the tooltip in an incorrect fallback location before snapping it into place on every hover.
2. **Using `useLayoutEffect` for general logic** delays every screen paint until that code finishes. The React documentation warns that excessive layout effects make applications sluggish.
3. **Using a style library that injects rules too late** causes layout code to measure elements before their CSS applies, producing inaccurate coordinates.

### The Rule of Thumb: would the user see the wrong place?

**Ask one question about every side effect: if the browser paints before this code executes, will the user observe misplaced or broken content? If not, use `useEffect`. If yes, use `useLayoutEffect`. Reserve `useInsertionEffect` exclusively for CSS-in-JS libraries.**

Experienced developers guard against four common misconceptions:
1. **Assuming `useEffect` always precedes visual rendering** because it runs after the commit. The commit phase updates DOM tree memory; painting pixels to the display is an independent browser operation.
2. **Applying `useLayoutEffect` defensively to every effect.** Every millisecond spent inside a layout effect delays the browser paint for the entire page.
3. **Initiating network requests inside `useLayoutEffect`** in hopes of receiving data sooner. Network round trips are asynchronous; delaying the initial paint does not accelerate server responses.
4. **Calling `useInsertionEffect` within application components.** It cannot read DOM refs and cannot schedule state updates, making it unsuitable for application logic.

## SECTION | A Toolbar with Two Tooltips

The example application features a document editor toolbar: a Save button aligned to the top viewport edge, an empty gap, and a Delete button below it. Because the Save button touches the top boundary, its tooltip must open underneath. Because the Delete button has ample clearance above, its tooltip opens above:

```page caption="The editor page while the pointer rests on Save: there is no room above, so the tooltip sits below the button."
line: [Save]
line: Save your draft | good
blank
line: [Delete]
```

```page caption="The editor page while the pointer rests on Delete: there is room above, so the tooltip sits above the button."
line: [Save]
blank
line: Delete this draft for good | good
line: [Delete]
```

The page lives in four files, and a fifth arrives in Principle 4:

```files title="editor-toolbar: File Explorer" caption="The files of our editor page inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Shows `Save`, a blank space of 100 pixels, and `Delete`
  ButtonWithTooltip.jsx | default export | One button that remembers where it is while the pointer is on it
  Tooltip.jsx | default export | Measures itself and chooses above or below the button
  styles.css | styles | Until Principle 4: the `.tooltip` rule with a dark background, white text, padding, and rounded corners
  useCSS.js | library code | From Principle 4 on: adds the `.tooltip` rule to the page, as a style library would
```

This lesson relies on five core mechanisms established in earlier chapters:
1. State setter functions request a new component render from React (Lesson 12).
2. The `useRef` Hook preserves values across renders. Assigning a ref to a JSX tag directs React to populate its `current` property during the commit phase (Lessons 30 and 31).
3. Passing an empty dependency array to `useEffect` runs its setup function once after initial mount, and returning a function from setup defines its cleanup (Lesson 32).
4. Combining a boolean condition with the logical AND operator conditionally renders JSX only when the condition evaluates to true (Lesson 10).
5. In development mode, Strict Mode executes an intentional extra setup and cleanup cycle for each effect (Lesson 47).

**PRINCIPLES:** Standard `useEffect` callbacks run after the browser paints. When an effect measures DOM geometry to adjust positioning, users can see the unadjusted element jump. React provides two earlier execution phases, separating application layout code from library style injection. Four principles follow:
1. **Principle 1: `useEffect` Lets the Browser Paint Before the Measurement.** The user sees the tooltip cover the button before jumping to its calculated position.
2. **Principle 2: `useLayoutEffect` Measures and Renders Again Before the Paint.** The tooltip still renders twice, but React finishes both renders before the browser paints once.
3. **Principle 3: `useLayoutEffect` Holds Back the Paint of the Whole Page.** Synchronous execution blocks screen painting, meaning only visual adjustments justify its overhead.
4. **Principle 4: `useInsertionEffect` Adds the Style Rule Before Any Measurement.** A style library injects style elements before layout effects measure dimensions, protecting layout accuracy.

---

## PRINCIPLE | `useEffect`: the browser may paint the tooltip before the Effect measures it

> [!PRINCIPLE]
> **Principle 1: `useEffect`: The Browser May Paint Before the Effect Runs**
>
> *When an Effect measures an element and sets state to move it, `useEffect` may let the browser paint the first, wrong position, so the user sees the element jump.*
>
> The tooltip has no height until React commits it to the DOM, so the first render has to guess. With `useEffect`, the browser may paint that guess before the Effect measures the real height. The user sees the tooltip on top of the button, then sees it jump. On a fast computer the jump is too short to notice, which is why it reaches users on slow phones.
>
> **DO THIS:**
> ```jsx
> ~useLayoutEffect~(() => { // The measurement runs before the browser paints, as Principle 2 shows
>   const { height } = ref.current.getBoundingClientRect();
>   setTooltipHeight(height);
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const { height } = ref.current.getBoundingClientRect();
>   ~setTooltipHeight(height)~; // **WRONG:** the browser may already have painted the tooltip on top of the button
> }, []);
> ```

Consider a minimal tooltip component that measures its own height. It accepts a `buttonRect` prop representing the bounding rectangle of the target button on screen:

```jsx title="A tooltip that measures its own height in useEffect"
const [tooltipHeight, setTooltipHeight] = useState(0); // No height exists before the first commit

~useEffect~(() => { // Runs after the commit, usually after the paint
  const { height } = ref.current.~getBoundingClientRect~(); // The browser measures the tooltip in the DOM
  setTooltipHeight(height); // Asks React for a second render with the real height
}, []);

let top = buttonRect.top - tooltipHeight; // Above the button
if (top < 0) {
  top = buttonRect.bottom; // No room above, so below the button
}
```

The positioning logic subtracts the tooltip height from the top boundary of the button. If that calculation produces a negative number, the tooltip would extend past the top of the browser window, so the code places it below the button instead.

> [!DEFINITION]
> **Layout and `getBoundingClientRect()`.** [NEW] Layout refers to the physical dimensions and screen coordinates of elements, computed by the browser from DOM nodes and CSS stylesheets. The `getBoundingClientRect()` method returns a `DOMRect` object containing pixel coordinates including `top`, `bottom`, `left`, `right`, and `height`. These measurements are relative to the viewport, which is the visible area of the browser window. Querying an element for these values reads its layout (Lesson 49).

Destructuring `{ height }` extracts the vertical dimension from the returned rectangle, using the same pattern applied to component props (Lesson 08).

### Our First Step: the Editor Page

The parent `App` component displays both buttons, separated by a vertical spacer:

```jsx title="src/App.jsx"
import ButtonWithTooltip from './ButtonWithTooltip.jsx';
import './styles.css';

export default function App() {
  return (
    <main>
      <ButtonWithTooltip label="Save" tooltip="Save your draft" />
      ~<div style={{ height: 100 }} />~ {/* A blank space of 100 pixels between the two buttons */}
      <ButtonWithTooltip label="Delete" tooltip="Delete this draft for good" />
    </main>
  );
}
```

The `ButtonWithTooltip` component renders a button and manages whether the tooltip is active:

```jsx title="src/ButtonWithTooltip.jsx"
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.jsx';

export default function ButtonWithTooltip({ label, tooltip }) {
  const buttonRef = useRef(null);
  const [buttonRect, setButtonRect] = useState(null);

  function handlePointerEnter() {
    setButtonRect(buttonRef.current.~getBoundingClientRect~()); // Remembers where the button is on the screen
  }

  function handlePointerLeave() {
    setButtonRect(null); // Removes the tooltip
  }

  return (
    <div>
      <button ref={buttonRef} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
        {label}
      </button>
      {buttonRect !== null && <Tooltip text={tooltip} buttonRect={buttonRect} />}
    </div>
  );
}
```

The browser fires `onPointerEnter` when the pointer moves over the button element, and `onPointerLeave` when it moves away. The pointer enter handler reads button coordinates using `getBoundingClientRect()` and stores the result in `buttonRect` state. React passes this object down to `Tooltip` as a prop.

The `Tooltip` component initially attempts to measure its DOM node inside `useEffect`:

```jsx title="src/Tooltip.jsx" startLine="1"
import { useState, useRef, useEffect } from 'react';

export default function Tooltip({ text, buttonRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Our guess: no height exists before the first commit

  ~useEffect~(() => { // Runs after the commit, usually after the paint
    const { height } = ref.current.getBoundingClientRect(); // Reads the real height of the tooltip
    setTooltipHeight(height);
  }, []);

  let top = buttonRect.top - tooltipHeight;
  if (top < 0) {
    top = buttonRect.bottom;
  }

  return (
    <div
      ref={ref}
      className="tooltip"
      style={{ position: 'fixed', left: buttonRect.left, top: top, pointerEvents: 'none' }}
    >
      {text}
    </div>
  );
}
```

React attaches the underlying DOM node to `ref.current` during the commit phase. Consequently, an effect can safely inspect the ref after the commit, whereas code executing during the render phase cannot.

Two CSS styles in this component serve specific architectural roles:
- **`position: 'fixed'`** places the tooltip relative to viewport coordinates. Because `getBoundingClientRect()` returns measurements relative to the viewport, the coordinates align directly.
- **`pointerEvents: 'none'`** allows cursor interactions to pass straight through the tooltip. Without this property, a tooltip hovering over the button would intercept cursor events, triggering `onPointerLeave` on the button and causing the tooltip to flicker out of existence.

The `.tooltip` rule in `styles.css` gives the tooltip its look:

```css title="src/styles.css"
.tooltip {
  background: #222;
  color: white;
  ~padding: 4px~; /* Part of the height of the tooltip */
  border-radius: 4px;
}
```

### Why the Tooltip Covers the Button First

**Beware! When measuring in `useEffect`, the user can observe the tooltip in two positions: first covering the button, and then jumping into its final place.** Because the initial render has no measured height, the browser paints a fallback position before the effect can correct it.

Here is the exact sequence when a user points at Delete:
1. The pointer event fires `handlePointerEnter`, saving the button coordinates in `buttonRect`.
2. React renders `Tooltip` with height initialized to zero, setting `top` equal to the button top boundary.
3. React commits the tooltip DOM element directly over the button.
4. The browser paints the screen. The user sees the tooltip label covering the Delete button.
5. React runs `useEffect`, which measures the real element height and calls `setTooltipHeight`.
6. React re-renders `Tooltip` with the accurate height, recalculating `top` above the button.
7. React commits the updated coordinates, and the browser paints the second frame as the tooltip jumps upward.

```page caption="What the user sees first: the tooltip covers the Delete button."
line: [Save]
blank
line: Delete this draft for good | bad
```

```page caption="A moment later: the tooltip has jumped to its place above the Delete button."
line: [Save]
blank
line: Delete this draft for good | good
line: [Delete]
```

When hovering over Save, the jump moves in reverse. The tooltip initially covers the button, and then shifts below it once the code detects that zero space exists above the viewport boundary.

The browser does not interleave a paint before every single effect execution. React documentation explains that when an effect is not triggered by direct user interaction like a click, React generally permits the browser to paint screen updates first. Even during user interactions, the browser may repaint before processing state updates queued inside an effect. This makes the visual jump erratic across different devices and frame rates, creating bugs that are notoriously difficult to track down.

### Making the Jump Easy to See

On fast development machines, the misaligned initial frame may render too briefly for the human eye to register. To expose the timing gap clearly, the React documentation introduces an intentional delay loop into the component render:

```jsx title="src/Tooltip.jsx, slowed down on purpose, inside the component body"
let now = ~performance.now()~; // The current time in milliseconds
while (performance.now() - now < 100) {} // Wastes 100 milliseconds on every call of Tooltip
```

The `performance.now()` browser method returns a high-resolution timestamp in milliseconds. Production applications should never include blocking loops of this kind. In development, Strict Mode renders components twice, producing an artificial delay of roughly 200 milliseconds. Because the browser has already painted the initial unmeasured state, the misplaced tooltip remains visible across the entire delay, clearly demonstrating the defect.

### A Real Beginner Mistake: Hiding the Jump with a Fade-In

1. A developer builds a floating tooltip using `useEffect`, relying on standard effect guidance for post-mount logic.
2. On high-powered development workstations, the component appears to render without issues.
3. Mobile users on slower connections report that the tooltip visibly stutters and jumps on hover.
4. Unable to reproduce the issue locally, the developer adds a CSS opacity transition to soften the appearance of the jump.

Adding an animation merely disguises the misplacement without resolving the timing flaw. The browser still paints the tooltip over the button on the first frame. The proper remedy is measuring DOM layout before the browser paints, as explained in the next principle.

---

## PRINCIPLE | `useLayoutEffect`: the measurement and the new render both happen before the paint

> [!PRINCIPLE]
> **Principle 2: `useLayoutEffect`: Measure and Render Again Before the Paint**
>
> *When an Effect measures layout and sets state that changes what the user sees, write it with `useLayoutEffect`; React runs it after the commit and before the paint, and renders its state update before the paint too.*
>
> `useLayoutEffect` takes the same arguments as `useEffect`. Only the moment differs. React runs it right after the DOM is updated, and holds the paint until it is done and every state update it asked for has been rendered. The tooltip still renders twice, and the user sees only the second render.
>
> **DO THIS:**
> ```jsx
> useLayoutEffect(() => {
>   const { height } = ref.current.getBoundingClientRect();
>   ~setTooltipHeight(height)~; // React renders again before the browser paints
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const ref = useRef(null);
> const { height } = ~ref.current~.getBoundingClientRect(); // **WRONG:** measured during rendering, ref.current is null on the first render
> ```

Here are the two measuring Effects side by side:

```jsx title="The measuring Effect with useEffect"
~useEffect~(() => { // Usually runs after the paint
  const { height } = ref.current.getBoundingClientRect();
  setTooltipHeight(height); // The browser may paint the tooltip on top of the button before this runs
}, []);
```

```jsx title="The measuring Effect with useLayoutEffect"
~useLayoutEffect~(() => { // Runs before the paint
  const { height } = ref.current.getBoundingClientRect();
  setTooltipHeight(height); // React renders again with this height before the browser paints
}, []);
```

First, consider their call signatures. Both Hooks accept a setup function, an optional dependency array, and an optional cleanup function returned by setup. Syntactically, they are identical. Every guideline regarding dependencies, cleanup cycles, and execution flow applies equally to both Hooks (Lesson 32).

The critical distinction lies in runtime timing. While their signatures match, their scheduling differs fundamentally. With `useEffect`, the browser can paint the unadjusted layout before the callback fires. With `useLayoutEffect`, the React documentation guarantees that code inside the effect, along with any state updates scheduled by it, will execute before the browser repaints the display.

> [!DEFINITION]
> **`useLayoutEffect`.** [NEW] The `useLayoutEffect` Hook is a version of `useEffect` that fires synchronously before the browser repaints the screen. React exports it directly from the `react` package. It accepts the same setup function, dependency array, and cleanup return as `useEffect`. Any effect declared with this Hook is known as a layout Effect (Lesson 49).

```tree caption="useEffect and useLayoutEffect take the same arguments and differ only in when React runs them."
`useEffect` and `useLayoutEffect` side by side
- +The same arguments [`setup` `dependencies` `cleanup`] | Both take a **setup function**, an optional **dependency array**, and an optional **cleanup** | **The exact same thing**
- !With `useEffect` [`useEffect`] | Usually runs **after the paint** | The user can see the **first, wrong place**
- +With `useLayoutEffect` [`useLayoutEffect`] | Runs **before the paint**, and React renders its state updates **before the paint** too | The user sees **only the final place**
```

### Our Second Step: One Word in the Tooltip File

In the tooltip file, replace `useEffect` with `useLayoutEffect`. To observe execution timing directly, log the measured height to the developer console, matching the approach in the React documentation. No other files require modification:

```jsx title="src/Tooltip.jsx" startLine="1" good="7"
import { useState, useRef, useLayoutEffect } from 'react';

export default function Tooltip({ text, buttonRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  ~useLayoutEffect~(() => { // Runs after the commit and before the paint
    const { height } = ref.current.getBoundingClientRect();
    console.log('Measured tooltip height: ' + height);
    setTooltipHeight(height);
  }, []);
```

When the user hovers over Delete, the tooltip displays instantly at its calculated position above the button, while the console logs the measured height. In development mode, Strict Mode executes the setup function an extra time, producing two identical log entries:

```page caption="The pointer on Delete with useLayoutEffect: the tooltip is above the button from the moment it appears."
line: [Save]
blank
line: Delete this draft for good | good
line: [Delete]
log: Measured tooltip height: 26 | Tooltip.jsx:9
log: Measured tooltip height: 26 | Tooltip.jsx:9
```

### Why the User Never Sees the First Place

**The user never sees the initial fallback position because the browser does not paint until React completes the second render pass.** The component still renders twice, but only the second pass produces visible pixels.

Here is the runtime sequence when hovering over Delete with `useLayoutEffect`:
1. React renders the tooltip component with initial height set to zero.
2. React commits the initial DOM node in memory.
3. Before the browser paints any pixels, React synchronously invokes the `useLayoutEffect` setup.
4. The setup measures the rendered DOM element and calls `setTooltipHeight`.
5. React immediately executes a second render pass, calculating the true `top` offset and committing the updated coordinate.
6. The browser paints once. The user sees the tooltip positioned accurately above Delete on the very first visible frame.

Application code does not need manual loops or triggers for the second render. Calling `setTooltipHeight` queues the update, and React processes it synchronously before releasing the main thread to the browser painting engine. The React documentation terms this technique **rendering in two passes**. React renders once to mount the element, measures its geometry, and renders again with corrected styles before painting.

```tree dir=right caption="Rendering in two passes: both renders happen before the browser paints once."
The pointer moves onto `Delete` with `useLayoutEffect`
- !1. First render | `tooltipHeight` is `0` | The tooltip is committed **on top of the button**
- +2. Layout Effect | Measures the **real height** | Calls `setTooltipHeight`
- +3. Second render | `top` is now **above the button** | React commits the new `top`
- +4. The browser paints once | The user sees **only the final place**
```

Even when retaining the artificial 100 millisecond delay in the component body, the tooltip never flickers into the wrong location. It simply appears after the delay in its correct position. The React documentation suggests this exact verification: swap in `useLayoutEffect` and observe that paint remains blocked even when component rendering is intentionally slowed down.

### A Real Beginner Mistake: Measuring During Rendering

Learning that `useLayoutEffect` runs before the paint, some developers attempt to measure elements directly inside the component body, assuming render-time measurement is earlier and more direct:

```jsx title="src/Tooltip.jsx, measuring in the component body"
const ref = useRef(null);
const { height } = ~ref.current~.getBoundingClientRect(); // **WRONG:** on the first render ref.current is still null
```

When the user hovers over the button, React invokes the tooltip component for its initial render. At this stage, `ref.current` remains null because React has not yet created or committed the underlying DOM element. Accessing properties on null crashes the application with a runtime exception:

```devconsole
x Uncaught TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
! An error occurred in the <Tooltip> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The render phase computes JSX descriptions. Real DOM elements and their physical layout exist only after the commit phase completes. That is why an initial render pass must rely on fallback coordinates, and why DOM measurements belong exclusively in layout effects.

---

## PRINCIPLE | `useLayoutEffect`: everything inside it holds back the paint of the whole page

> [!PRINCIPLE]
> **Principle 3: Blocking the Paint: Keep `useEffect` as the Default**
>
> *Keep `useEffect` as the default, and use `useLayoutEffect` only to measure layout and render again before the user sees the screen, because everything in it delays the paint of the whole page.*
>
> A layout Effect makes the browser wait. That wait is worth it only when the user would otherwise see a wrong place, as with the tooltip. A log, a timer, a connection, or a fetch gives the same screen either way, so in a layout Effect it only makes every update slower.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   ~console.log('Tooltip shown')~; // Runs after the paint; the user never waits for it
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useLayoutEffect(() => {
>   ~fetch('/api/drafts')~; // **WRONG:** the data arrives no sooner, and the paint waits for this code
> }, []);
> ```

### VS | A Measurement vs. a Log: both are Effects, only one changes what the user sees

The tooltip now positions itself accurately. Suppose the application also needs to record when a tooltip opens. Consider two effects placed within the same component:

```jsx title="Two Effects in the tooltip"
useLayoutEffect(() => {
  ~setTooltipHeight~(ref.current.getBoundingClientRect().height); // Changes where the user sees the tooltip
}, []);

useEffect(() => {
  ~console.log('Tooltip shown')~; // Changes nothing on the screen
}, []);
```

Both functions represent side effects triggered when the tooltip mounts. Having resolved a positioning jump with `useLayoutEffect`, a developer might mistakenly place the logging call there as well. While their syntax looks similar, their operational impact is completely different:
- **The measurement** calculates element geometry and repositions visual content. If the browser paints before it completes, the user observes a misplaced element.
- **The logging statement** has no effect on screen pixels. Forcing the browser to defer visual rendering while writing to the console adds delay without user benefit.

The React documentation explicitly highlights this cost, stating that code inside `useLayoutEffect` and all state updates scheduled from it block the browser from repainting the screen. To **block the paint** means the browser cannot rasterize or display new visual frames until the synchronous JavaScript execution finishes.

```tree caption="Which Effects belong in useLayoutEffect and which stay in useEffect."
Where an Effect belongs
- +`useLayoutEffect` [`getBoundingClientRect`] | A measurement that **moves what the browser is about to paint** | The user would see the **wrong place** if the browser painted first
- +`useEffect` [`console.log` `setInterval` `fetch`] | A log, a timer, a connection, a data fetch | The screen is **the same** before or after the paint, so the browser **need not wait**
```

### Our Third Step: the Slow Code Moves into the Layout Effect

To observe the performance penalty directly, move the artificial 100 millisecond delay out of the render body and into the layout effect:

```jsx title="src/Tooltip.jsx, the slow loop inside the layout Effect" bad="2,3"
useLayoutEffect(() => {
  let now = performance.now();
  ~while~ (performance.now() - now < 100) {} // **WRONG:** the browser paints nothing until this loop ends
  setTooltipHeight(ref.current.getBoundingClientRect().height);
}, []);
```

**For 100 milliseconds after hovering over Delete, the entire user interface freezes.** The tooltip never flickers into the wrong location, but the interface feels unresponsive. In development mode, Strict Mode executes the setup function twice, extending the visual stall to approximately 200 milliseconds.

Here is the sequence of events:
1. The user hovers over the Delete button.
2. React renders the tooltip, updates the DOM in memory, and triggers `useLayoutEffect`.
3. The synchronous delay loop consumes 100 milliseconds of main-thread execution, during which the browser cannot paint updates anywhere on the page.
4. Once the loop finishes, React commits the final tooltip position, and the browser paints the screen.

Production applications do not include artificial delay loops, but they frequently execute CPU-intensive tasks such as sorting large data sets, calculating chart paths, or parsing complex objects. When placed inside a layout effect, every millisecond of computation directly postpones screen rendering across the entire application.

Placing network requests inside `useLayoutEffect` does not speed up data arrival. Initiating `fetch` merely sends an asynchronous request over the network. The browser must wait for network round trips regardless of when the request was dispatched, exactly as it does in `useEffect` (Lesson 33). Moving data fetching into a layout effect only delays the initial visual paint while the synchronous call executes.

### A Real Beginner Mistake: One Flicker, One Team Rule

1. An engineer resolves a visible layout jump by replacing `useEffect` with `useLayoutEffect`.
2. The team adopts an overly broad convention: use `useLayoutEffect` across all components to eliminate flickering.
3. Over subsequent development cycles, analytics tracking, data subscriptions, and complex transformations are moved into layout effects.
4. Every button click and navigation event blocks the main thread, resulting in a sluggish interface with no explicit console errors.

The React documentation gives clear guidance on this trade-off, warning that `useLayoutEffect` can hurt performance and recommending `useEffect` whenever possible. The documentation further advises developers that rendering in two passes and blocking browser paints degrades responsiveness, cautioning teams to avoid this pattern except when strictly necessary.

---

## PRINCIPLE | `useInsertionEffect`: a style library adds its `<style>` tags before any layout Effect measures

> [!PRINCIPLE]
> **Principle 4: `useInsertionEffect`: For CSS-in-JS Libraries Only**
>
> *A CSS-in-JS library that adds `<style>` tags while the app runs adds them in `useInsertionEffect`, which React runs before any layout Effect; application code does not use it, because it can neither read refs nor set state.*
>
> A measurement is right only if the styles are already in the page. When a library adds its rule in a layout Effect, a measuring layout Effect can run first and read a height without the padding. `useInsertionEffect` runs before every layout Effect, so the rule is always in the page first.
>
> **DO THIS:**
> ```js
> function useCSS(rule) {
>   ~useInsertionEffect~(() => { // Library code: the rule is in the page before any layout Effect measures
>     if (!inserted.has(rule)) {
>       inserted.add(rule);
>       const style = document.createElement('style');
>       style.textContent = rule;
>       document.head.appendChild(style);
>     }
>   });
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useInsertionEffect(() => {
>   setTooltipHeight(~ref.current~.getBoundingClientRect().height); // **WRONG:** refs are not attached yet, and state cannot be set here
> }, []);
> ```

### Three Effects, One Order

Consider a component that declares all three Effect Hooks, listing standard effects, layout effects, and insertion effects in sequence:

```jsx title="src/EffectOrder.jsx" startLine="1"
import { useEffect, useLayoutEffect, useInsertionEffect } from 'react';

export default function EffectOrder() {
  ~useEffect~(() => { console.log('effect'); }); // Written first, runs last
  ~useLayoutEffect~(() => { console.log('layout'); }); // Runs before the paint
  ~useInsertionEffect~(() => { console.log('insertion'); }); // Written last, runs first
  return <p>Hello</p>;
}
```

The developer console outputs insertion, followed by layout, and finally effect, regardless of the declaration order in source code. React guarantees that `useInsertionEffect` executes before any layout effects run, layout effects run before the browser paints, and `useEffect` runs after painting completes:

```page caption="The EffectOrder component on the dev server: insertion comes first, and Strict Mode runs layout and effect a second time."
line: Hello
log: insertion | EffectOrder.jsx:6
log: layout | EffectOrder.jsx:5
log: effect | EffectOrder.jsx:4
log: layout | EffectOrder.jsx:5
log: effect | EffectOrder.jsx:4
```

In development mode, Strict Mode executes an additional setup and cleanup pass for both `useLayoutEffect` and `useEffect`, causing layout and effect to log twice. Strict Mode does not re-run `useInsertionEffect`, so insertion appears only once. In a production build, each effect runs once, outputting the first three lines.

> [!DEFINITION]
> **`useInsertionEffect`.** [NEW] The `useInsertionEffect` Hook allows libraries to insert elements into the DOM before any layout effects execute. React provides it as a built-in export. It accepts the same setup, dependency, and cleanup structure as the other Effect Hooks. Its specific purpose is injecting `<style>` elements into the document head before components measure layout (Lesson 49).

### Styles That Arrive While the App Runs

In previous steps, the tooltip styling was defined in an external CSS file. Some architectures declare styles in JavaScript using **CSS-in-JS libraries**. Certain libraries generate and attach stylesheets dynamically as the application executes. The library creates an HTML `<style>` element and appends it to the `<head>` of the document. The React documentation refers to this pattern as **runtime injection of `<style>` tags**.

The React team does not encourage runtime style injection in application code. The recommended approach uses static CSS files for permanent styling and inline styles for dynamic properties. One major drawback of runtime injection is performance overhead: injecting style tags forces the browser to recalculate CSS rules across the entire document tree frequently. The `useInsertionEffect` Hook was introduced specifically for libraries using dynamic injection, ensuring their rules attach before layout calculations begin.

In this demonstration, a utility function acts as a standalone style library. This code models how an external library operates, rather than representing code typical of application components.

### Our Fourth Step: the Tooltip Rule Moves into Library Code

First, consider what happens when a library injects styles using `useLayoutEffect`, as a developer might intuitively attempt:

```js title="src/useCSS.js, library code" startLine="1"
import { useLayoutEffect } from 'react';

const inserted = new Set(); // Remembers which rules are already in the page

export default function useCSS(rule) {
  ~useLayoutEffect~(() => { // Library code: adds the rule in a layout Effect
    if (!inserted.has(rule)) {
      inserted.add(rule);
      const style = document.createElement('style');
      style.textContent = rule;
      document.head.appendChild(style); // The rule is now in the page
    }
  });
}
```

The `useCSS` function is a custom Hook (Lesson 39). The React documentation uses an identical structure to illustrate library implementation. Several JavaScript APIs in this file handle style management:
- **`inserted`** is an instance of `Set`, a collection storing unique values. The `has` method checks if a CSS string was previously injected, while `add` records it. Because the `Set` is declared at module scope, rules are registered once regardless of how many components call `useCSS`.
- **`document.createElement('style')`** creates a new HTML style element. Setting `textContent` assigns the raw CSS text, while `appendChild` attaches the new element to the document head.

Removing the tooltip rule from the stylesheet allows the component to inject its styles dynamically by calling `useCSS` after its layout effect:

```jsx title="src/Tooltip.jsx" startLine="1"
import { useState, useRef, useLayoutEffect } from 'react';
import useCSS from './useCSS.js';

export default function Tooltip({ text, buttonRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect(); // Runs first: measures the tooltip
    setTooltipHeight(height);
  }, []);

  ~useCSS~('.tooltip { background: #222; color: white; padding: 4px; border-radius: 4px; }'); // Its layout Effect runs second
```

### Why the First Tooltip Covers the Top of Delete

**Beware! When styles inject after layout measurements execute, the component measures its DOM node before CSS padding is applied, causing incorrect coordinates.** The tooltip sits too low and partially overlaps the Delete button by the exact height of the missing padding.

Here is the sequence on the first hover following page load:
1. React renders and commits `Tooltip`. Because no `.tooltip` stylesheet exists in the document yet, the DOM node lacks padding.
2. The measuring layout effect executes first because it is declared first in the component body, recording an understated height.
3. The library layout effect executes second, appending the `<style>` element. The browser recalculates styles, expanding the tooltip box with padding.
4. React renders the second pass using the earlier unpadded height. The positioned tooltip sits too low, overlapping the top edge of Delete.

```page caption="The first hover on Delete after the page loads, with the rule of the library added in a layout Effect: the tooltip covers the top of the button."
line: [Save]
blank
line: Delete this draft for good | bad
line: [Delete] | bad
```

Subsequent hovers calculate correctly because the `inserted` collection already contains the rule and the style tag remains in the document head. As a result, the bug surfaces only on the first interaction after a full page reload, making it elusive in casual testing. In development environments, Strict Mode re-runs layout effects after styles are present, which can conceal the error until the code reaches production.

This exact failure mode is highlighted in the React documentation: without `useInsertionEffect`, layout calculations in regular effects produce incorrect results due to outdated styles.

### VS | `useCSS` with `useLayoutEffect` vs. `useCSS` with `useInsertionEffect`: one word, and the rule is in the page before the measurement

The library corrects the timing flaw by changing a single identifier: replacing `useLayoutEffect` with `useInsertionEffect`:

```js title="src/useCSS.js, library code" startLine="1" good="6"
import { useInsertionEffect } from 'react';

const inserted = new Set();

export default function useCSS(rule) {
  ~useInsertionEffect~(() => { // Runs before any layout Effect in any component
    if (!inserted.has(rule)) {
      inserted.add(rule);
      const style = document.createElement('style');
      style.textContent = rule;
      document.head.appendChild(style);
    }
  });
}
```

While both implementations differ by only one word and perform identically on subsequent hovers, their execution guarantees are entirely different. With `useLayoutEffect`, layout measurement effects can execute before styles attach to the DOM. With `useInsertionEffect`, the React documentation guarantees that by the time any layout effect executes in your components, the `<style>` tags have already been inserted. The measurement reads the full computed height, ensuring the tooltip positions cleanly above Delete on the very first hover. Furthermore, declaration order within the component no longer affects correctness.

The rendered output matches the visual appearance produced by an external CSS stylesheet. The browser applies CSS rules identically whether they originate from a static file or a dynamically injected `<style>` tag. The difference lies entirely in lifecycle timing.

The Elements panel shows the one `<style>` element that `useCSS` added:

```dom caption="The Elements panel after several hovers: useCSS has added one style element to the head, once."
<head>
  ...
  + <style>.tooltip { background: #222; color: white; padding: 4px; border-radius: 4px; }</style> | note: Added once by useCSS, however many hovers
</head>
<body>
  <div id="root">
    <main>...</main>
  </div>
</body>
```

```tree dir=right caption="The order on the first hover once useCSS uses useInsertionEffect."
The first hover on `Delete` with `useInsertionEffect` in the library
- +1. Insertion Effect | `useCSS` adds the `<style>` tag | The tooltip **gets its padding**
- +2. Layout Effect | `Tooltip` measures the **full height** | Calls `setTooltipHeight`
- +3. Second render | `top` is **exactly above** the button
- +4. The browser paints | The user sees the tooltip **in its place**
```

### What `useInsertionEffect` Cannot Do

Observing that `useInsertionEffect` runs earlier than `useLayoutEffect`, an engineer might attempt to measure DOM dimensions inside it:

```jsx title="src/Tooltip.jsx, measuring in useInsertionEffect"
useInsertionEffect(() => {
  const { height } = ~ref.current~.getBoundingClientRect(); // **WRONG:** refs are not attached yet, so ref.current is null
  setTooltipHeight(height);
}, []);
```

This approach fails due to two fundamental architectural constraints noted in the React documentation:
1. **Refs are not yet populated.** By the time `useInsertionEffect` executes, React has not attached DOM nodes to refs. Evaluating `ref.current` yields null, throwing the same runtime error encountered when measuring during the render phase.
2. **State updates are prohibited.** Updating state from inside `useInsertionEffect` is disallowed. In development mode, attempting to invoke a state setter from an insertion effect triggers a console error:

```devconsole
x useInsertionEffect must not schedule updates.
```

Because `useInsertionEffect` can neither access DOM elements through refs nor update component state, it cannot perform layout or application tasks. Its utility is restricted to injecting style tags before layout calculations begin. The React documentation concludes that unless you are authoring a CSS-in-JS library requiring dynamic injection, you should rely on `useEffect` or `useLayoutEffect`.

---

## All 4 Principles Together

### The Complete Project

Here is the finalized toolbar implementation. The external CSS file has been removed, and the tooltip styles are injected dynamically through `useCSS`:

```jsx title="src/App.jsx"
import ButtonWithTooltip from './ButtonWithTooltip.jsx';

export default function App() {
  return (
    <main>
      <ButtonWithTooltip label="Save" tooltip="Save your draft" />
      ~<div style={{ height: 100 }} />~ {/* A blank space of 100 pixels between the two buttons */}
      <ButtonWithTooltip label="Delete" tooltip="Delete this draft for good" />
    </main>
  );
}
```

```jsx title="src/ButtonWithTooltip.jsx"
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.jsx';

export default function ButtonWithTooltip({ label, tooltip }) {
  const buttonRef = useRef(null);
  const [buttonRect, setButtonRect] = useState(null);

  function handlePointerEnter() {
    setButtonRect(buttonRef.current.~getBoundingClientRect~()); // Measured in the event handler, after the action of the user
  }

  function handlePointerLeave() {
    setButtonRect(null);
  }

  return (
    <div>
      <button ref={buttonRef} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
        {label}
      </button>
      {buttonRect !== null && <Tooltip text={tooltip} buttonRect={buttonRect} />}
    </div>
  );
}
```

```jsx title="src/Tooltip.jsx"
import { useState, useRef, useLayoutEffect } from 'react';
import useCSS from './useCSS.js';

export default function Tooltip({ text, buttonRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  ~useLayoutEffect~(() => { // Principles 1 to 3: measured before the paint, and nothing else in here
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  ~useCSS~('.tooltip { background: #222; color: white; padding: 4px; border-radius: 4px; }'); // Principle 4: the rule is in the page before the measurement

  let top = buttonRect.top - tooltipHeight;
  if (top < 0) {
    top = buttonRect.bottom;
  }

  return (
    <div
      ref={ref}
      className="tooltip"
      style={{ position: 'fixed', left: buttonRect.left, top: top, pointerEvents: 'none' }}
    >
      {text}
    </div>
  );
}
```

```js title="src/useCSS.js, library code"
import { useInsertionEffect } from 'react';

const inserted = new Set();

export default function useCSS(rule) {
  ~useInsertionEffect~(() => { // Principle 4: runs before any layout Effect
    if (!inserted.has(rule)) {
      inserted.add(rule);
      const style = document.createElement('style');
      style.textContent = rule;
      document.head.appendChild(style);
    }
  });
}
```

```page caption="The finished editor page while the pointer rests on Delete: the tooltip appears above the button from the start, with its padding."
line: [Save]
blank
line: Delete this draft for good | good
line: [Delete]
```

### How React Calls the Components in Order

On initial page load, React executes `App`, followed by two invocations of `ButtonWithTooltip` for Save and Delete. No tooltip components are mounted. When the user hovers over a button, React re-renders that button component and mounts `Tooltip`, which executes its effects in strict sequence:

```tree caption="The order in which React calls the components of the editor page, and the order of the Effects of the tooltip."
`App` [1. Called when the page loads] | Shows `Save`, the blank space, and `Delete`
- +`ButtonWithTooltip` for `Save` [2. Called second] | Shows the `Save` button
- +`ButtonWithTooltip` for `Delete` [3. Called third] | Shows the `Delete` button | The pointer moves onto `Delete`, so `buttonRect` is set
  - +`Tooltip` [4. Called on hover] | **Insertion Effect** adds the `.tooltip` rule | **Layout Effect** measures and sets the height | React renders **again**, then the browser **paints once**
```

| Hook | When React runs it | What belongs in it | What goes wrong when it is the wrong choice |
| :--- | :--- | :--- | :--- |
| **`useEffect`** | After the commit, usually after the paint | Connections, timers, subscriptions, logs, data fetching | A measurement here lets the user see the tooltip on top of the button, then see it jump |
| **`useLayoutEffect`** | After the commit, before the paint | A measurement that must change the page before the browser paints | Slow code here freezes the whole page; data arrives no sooner |
| **`useInsertionEffect`** | Before any layout Effect | A CSS-in-JS library adding `<style>` tags | Refs are not attached and state cannot be set, so application code has no use for it |

Remember the foundational rule of this lesson. **`useEffect` runs after the user sees the screen, while `useLayoutEffect` runs before. Code that reads DOM layout and repositions elements belongs in `useLayoutEffect`. All other side effects belong in `useEffect`.**

---

## For the Interview

> **The Interview Question:** When must code run after DOM updates but before the browser paints, and why is useInsertionEffect reserved for style libraries?

### How to Answer Clearly in 30 Seconds

"Code must execute before the browser paints when it measures DOM geometry and updates state to reposition elements that would otherwise visibly flash in the wrong location. The classic scenario is a tooltip calculating its height to decide whether to render above or below a button. Standard `useEffect` runs asynchronously after the paint, allowing users to see the unpositioned element before it jumps. In contrast, `useLayoutEffect` runs synchronously after DOM updates and blocks the browser paint until all scheduled state updates complete, ensuring the user sees only the finalized layout.

I structure effect selection around three clear boundaries:
1. **`useEffect` is the default**: timers, network calls, event subscriptions, and logging run after paint without delaying user interface responsiveness.
2. **`useLayoutEffect` is reserved for layout measurements**: because it blocks browser painting, it should only contain code that prevents visible layout jumps.
3. **`useInsertionEffect` belongs strictly to CSS-in-JS libraries**: it executes before any layout effects run, allowing dynamic style injection before DOM dimensions are measured. It cannot inspect refs or schedule state updates, making it unusable in application components."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why not use `useLayoutEffect` for every Effect, to be safe?"**
   **Because it blocks the browser paint.** The code inside a layout effect and any state updates it queues prevent the browser from repainting the display until execution completes. Running non-visual logic like logging or data fetching in a layout effect provides zero visual advantage while making interactions feel sluggish. The React documentation stresses that running effects before paint is unnecessary for the vast majority of application requirements.
2. **"Does `useLayoutEffect` run on the server?"**
   **No.** Effects execute exclusively in browser environments, and server-side rendering has no DOM layout engine to measure. Consequently, components that rely on layout measurements will render their initial fallback state until client-side JavaScript executes and runs the layout effect. The React documentation recommends either deferring rendering of such components until client mount or using `useEffect` when brief layout adjustments are acceptable.
3. **"Can our own component use `useInsertionEffect` to measure even earlier?"**
   **No.** When `useInsertionEffect` fires, React has not yet populated component refs, leaving `ref.current` as null. Furthermore, React explicitly disallows scheduling state updates inside insertion effects. Its design is restricted to injecting style elements before layout effects execute. Even for styling libraries, modern recommendations favor static CSS files or inline styles over runtime injection, which forces expensive style recalculations.

```tree dir=right caption="The three Effect Hooks in an interview answer: the default, the measurement, and the style library."
Three Effect Hooks, three jobs
- +`useEffect` | **The default** | Runs usually **after the paint**
- +`useLayoutEffect` | **Measure and render again** | Runs **before the paint** and **blocks** it
- +`useInsertionEffect` | **Style libraries only** | Runs **before any layout Effect**; no refs, no state
```
