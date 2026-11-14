# Lecture 30: How useRef Keeps a Value Between Renders

*(How can a component remember a number without drawing the page again?)*

> INTERVIEW QUESTION | ❱ CORE | How do you keep a value between renders without triggering a re-render?

---

## VS | State `useState` vs. a Ref `useRef`: both remember the value, only state draws the page again

First, two quick reminders.

> [!DEFINITION]
> **What is a render?** [REVIEW] A render is React calling your component function. React runs the body from the first line to the last, and the JSX it returns becomes the page.
> Something that can be tricky: every render runs every line again. So `let count = 0` inside the component makes a brand new `count`, set to zero, on every render. Whatever you stored in the old one is gone.
> So a normal variable inside a component has no memory. It is born in one render and forgotten in the next (Lesson 13).

> [!DEFINITION]
> **What is state?** [REVIEW] State is the memory React keeps for your component. You write `const [count, setCount] = useState(0)`, and React keeps `count` safe between renders.
> To change it, you call the setter: `setCount(1)`. The setter does two things. It stores the new value, and it asks React to render the component again.
> That second part is the whole point of state: you change it, and the page follows (Lesson 12).

Now the question of this lesson. What if you need memory, but you do NOT want the page to change?

Think of the stopwatch on your phone. You tap Start, and the seconds count up. You tap Stop, and the number stands still.

To stop the timer, the Stop tap must find the timer that the Start tap started. For that, it needs a small number: the timer's ID. The user never sees this number. It only has to wait somewhere until Stop.

So where do you keep it?
1. **A normal variable?** It forgets the number on the next render.
2. **State?** It remembers the number, but every change draws the page again, for a number nobody sees.

React has a third answer: a ref.

> [!DEFINITION]
> **What is a ref?** [NEW] A ref is a small box that React keeps for your component. You create it with `useRef`: `const countRef = useRef(0)`. You get back a plain object with one field, `current`, which starts at `0`.
> You read it with `countRef.current`. You change it by simply writing into it: `countRef.current = 5`. There is no setter. It is a normal JavaScript object, so it works like one.
> What is cool: React gives you back the very same box on every render. Whatever you wrote in it is still there next time.
> And here is the one difference from state: writing into `current` does NOT render the component again. React does not even know you did it. The docs call a ref "a secret pocket of your component that React doesn't track."
> Why the name? Ref is short for reference. You keep a reference to a value, so a later click can find it again (Lesson 30).

Here are the two side by side:

```jsx title="Two ways to remember a number"
const [count, setCount] = ~useState(0)~; // Remembers, and setCount draws the page again
const countRef = ~useRef(0)~; // Remembers, and writing countRef.current draws nothing
```

The docs say it in two lines: "Like state, refs are retained by React between re-renders. However, setting state re-renders a component. Changing a ref does not!"

```tree caption="State and a ref both keep a value between renders. Only the state setter draws the page again."
Two ways React remembers a value
- +State [`useState`] | Kept **between renders** | The setter **draws the page again**
- +A ref [`useRef`] | Kept **between renders** | Writing `current` **draws nothing**
```

### The smallest ref: a click counter that never redraws

Here is a button that counts its clicks in a ref, and logs the count:

```jsx title="Counter.jsx"
import { useRef } from 'react';

export default function Counter() {
  const countRef = ~useRef(0)~; // A box that starts as { current: 0 }

  function handleClick() {
    ~countRef.current = countRef.current + 1~; // Changes the box, and React is not told
    console.log('You clicked ' + countRef.current + ' times');
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

The user clicks three times:

```page width=text caption="After three clicks: the button looks the same, and the Console counts every click."
line: [Click me]
log: You clicked 1 times | Counter.jsx:8
log: You clicked 2 times | Counter.jsx:8
log: You clicked 3 times | Counter.jsx:8
```

The box remembers 1, then 2, then 3. The page never changes, because nothing asked React to render.

### The Rule of Thumb: what the page shows goes in state, what only handlers need goes in a ref

**If the page shows it, keep it in state. If only your event handlers need it, keep it in a ref.** The docs say: "When a piece of information is used for rendering, keep it in state. When a piece of information is only needed by event handlers and changing it doesn't require a re-render, using a ref may be more efficient."

At the end of the day, a senior developer remembers three things:
1. **A `let` inside the component forgets.** It is born again on every render. If you keep the timer ID there, Stop does nothing.
2. **A variable outside the component is shared.** It remembers, but every copy of the component uses the same one. Two stopwatches on the page start to stop each other.
3. **Never show a ref on the page.** Writing into `current` does not draw the page. A number kept in a ref stays frozen on the screen.

The docs also call refs an "escape hatch" that "you won't need often." An escape hatch is the small side door of a ship. Almost every value goes through the main door, state. A ref is the side door, for things React does not draw, such as a browser timer.

## SECTION | A Stopwatch with Start and Stop

Our page is a stopwatch. It has one line and two buttons:

```page width=text caption="The stopwatch when the page opens."
line: Seconds: 0
line: [Start] [Stop]
console: quiet
```

The stopwatch needs one browser tool:

> [!DEFINITION]
> **What is setInterval?** [NEW] `setInterval` is a browser function that calls your function again and again. `setInterval(tick, 1000)` calls `tick` every 1000 milliseconds, so once a second.
> You know `setTimeout` from Lesson 15. Same idea, one difference: `setTimeout` calls your function once, and `setInterval` keeps calling it.
> What is important: `setInterval` gives you back a number, the interval ID. It is your only handle on that timer. To stop it, you hand that number to `clearInterval(id)`.
> Something that can be tricky: if `clearInterval` gets a wrong number, or `null`, it simply does nothing. No error. The timer keeps going (Lesson 30).

Here is the working stopwatch first. The shown number is state. The interval ID is a ref:

```jsx title="src/Stopwatch.jsx"
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = ~useState(0)~; // Shown on the page, so it is state
  const intervalRef = ~useRef(null)~; // Never shown, so it is a ref: starts as { current: null }

  function handleStart() {
    clearInterval(intervalRef.current);
    ~intervalRef.current = setInterval~(() => { // Puts the new interval ID in the box
      setSeconds(s => s + 1);
    }, 1000);
  }

  function handleStop() {
    ~clearInterval(intervalRef.current)~; // Finds the same ID, many renders later
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

It works. The user clicks Start again, and the count goes on to 4, because `seconds` stayed in state.

One small detail. The interval uses the updater function `s => s + 1` from Lesson 16. With `seconds + 1`, the interval would keep reading the zero of the render where Start was clicked, and the line would stop at 1 (Lesson 15).

So this is the right code. Now each principle moves the interval ID somewhere else, and shows what breaks:

**PRINCIPLES:** A ref remembers like state, and draws nothing. Five principles follow:
1. **Principle 1: A Ref Is the Same Box on Every Render.** React uses the start value once, then hands back the same box.
2. **Principle 2: A let Inside the Component Forgets.** Stop finds `null`, and the stopwatch keeps counting.
3. **Principle 3: Keep in State Only What the Page Shows.** State for the ID works, but it draws the page again for nothing.
4. **Principle 4: A Variable Outside the Component Is Shared.** Two stopwatches on one page stop each other.
5. **Principle 5: Never Show a Ref on the Page.** The line stays at 0, because a ref never draws the page.

---

## PRINCIPLE | The useRef Line Runs on Every Render, So Why Is the ID Still There?

> [!PRINCIPLE]
> **Principle 1: A Ref Is the Same Box on Every Render**
>
> *React uses the start value of useRef only on the first render. On every later render, it hands back the same box, with whatever you wrote in it.*
>
> The line with useRef runs again on every render, so it looks like the box resets. It does not. React creates the box once and keeps it. And when you write into current, the change is there at once, on the very next line.
>
> **DO THIS:**
> ```jsx
> function handleStart() {
>   clearInterval(intervalRef.current);
>   ~intervalRef.current~ = setInterval(tick, 1000); // The old timer is stopped first, then the new ID goes in the box
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleStart() {
>   ~intervalRef.current~ = setInterval(tick, 1000); // **WRONG:** a second click on Start loses the first ID, and that timer never stops
> }
> ```

Look at this line again:

```jsx title="The line that runs on every render"
const intervalRef = ~useRef(null)~; // null is used once, on the first render only
```

It runs on every render, like any other line. So why does it not reset the box to `null` each time? Because React treats the two cases differently:
1. **On the first render**, React creates the box `{ current: null }` and stores it with the component.
2. **On every later render**, React returns that same stored box. The `null` is ignored.

The docs say it in one line: "This argument is ignored after the initial render."

```tree dir=right caption="What the same useRef line gives back on the first render and on every later render."
The line `useRef` with the start value `null`
- +First render | React **creates** the box | `current` is `null`
- +Every later render | React **returns the same box** | `current` keeps **whatever you wrote**
```

### current changes at once

State has a snapshot. After `setCount(5)`, the variable `count` still holds the old value until the next render (Lesson 15). A ref has no snapshot:

```jsx title="Right after the setter, and right after writing current"
setCount(5);
console.log(~count~); // The old value: the snapshot of this render
countRef.current = 5;
console.log(~countRef.current~); // 5: the box changed right now
```

They look the same, but they are NOT the same thing! The setter asks React for a new render, and the new value comes with it. Writing into `current` changes the box itself, on the spot.

### Why Start clears the old timer first

Look at the first line of `handleStart` in our stopwatch: `clearInterval(intervalRef.current)`. Without it, a double click on Start breaks the stopwatch:
1. The first click starts timer A. Its ID goes in the box.
2. The second click starts timer B. Its ID replaces A's ID in the box. A's ID is lost.
3. Both timers add 1 every second, so the line counts twice as fast.
4. The user clicks Stop. Only B stops. A keeps counting, and nothing can stop it now.

With the first line in place, Start always stops the old timer before it starts a new one. On the very first click the box holds `null`, and `clearInterval(null)` does nothing, so that is safe too.

---

## PRINCIPLE | I Clicked Stop, So Why Is It Still Counting?

> [!PRINCIPLE]
> **Principle 2: A let Inside the Component Forgets**
>
> *A let variable inside the component is born again, as null, on every render. The ID from the Start click is gone before the Stop click reads it.*
>
> The timer renders the stopwatch once a second. Every render runs the let line again and makes a new empty variable. Stop then reads that new null, clearInterval does nothing, and the stopwatch keeps counting with no error.
>
> **DO THIS:**
> ```jsx
> const intervalRef = ~useRef(null)~; // The same box on every render
> function handleStop() { clearInterval(intervalRef.current); }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> let ~intervalId = null~; // **WRONG:** a new null on every render, so Stop finds nothing to stop
> function handleStop() { clearInterval(intervalId); }
> ```

Most developers first try a plain variable. Here is the stopwatch with the ID in a `let`:

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

**The stopwatch ignores Stop, and the Console says nothing.** Here is why, step by step:
1. The user clicks Start. The ID goes into `intervalId`.
2. One second later, the timer calls `setSeconds`. React renders the stopwatch again.
3. The new render runs the `let` line again. A brand new `intervalId` is born, and it holds `null`.
4. The new render also makes a new `handleStop`, which reads the new `null`.
5. The user clicks Stop. `clearInterval(null)` does nothing.

Something that can be tricky: if the user clicks Stop within the first second, it works. No render has happened yet, so Stop still reads the same variable. That is why a quick test can hide this bug.

The docs have the same bug in a chat app. An Undo button keeps its timeout ID in a `let`, and Undo cannot undo. Their fix is ours: "store it in a ref, which React will preserve between renders."

---

## PRINCIPLE | Stop Works, So Why Does the Stopwatch Render Again?

> [!PRINCIPLE]
> **Principle 3: Keep in State Only What the Page Shows**
>
> *State for the interval ID works, but every new ID draws the page again, for a number nobody sees.*
>
> A setter always asks React for a new render. For seconds, that is the point: the page must show the new number. For the interval ID, the render changes nothing on the page. So the shown number goes in state, and the ID goes in a ref.
>
> **DO THIS:**
> ```jsx
> const [seconds, setSeconds] = useState(0);
> const intervalRef = ~useRef(null)~; // Never shown, so changing it draws nothing
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [seconds, setSeconds] = useState(0);
> const [intervalId, setIntervalId] = ~useState(null)~; // **WRONG:** every new ID draws the stopwatch again for nothing
> ```

A developer who knows only state keeps the ID in state. And it works! Stop stops. So what is wrong?

To see it, put one log at the top of the component, and clear the Console right before the user clicks Stop:

::: row caption="One click on Stop: the ID in state draws the stopwatch again, the ID in a ref draws nothing."
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
The setter asks React for a render, so the log prints.
:::
::: col title="The ID in a ref" tag="Stop renders nothing" tone=good
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

The page looks exactly the same in both. But with state, React did a whole render for a number nobody sees. It happens again on every click on Start. The log prints twice because Strict Mode calls the component twice in development (Lesson 14).

There is a second trap. Log the ID right after its setter, and you see `null`. The ID is not lost. You only read this render's snapshot, as Principle 1 showed.

So how do you choose? Ask one question: **does the JSX use it?**
- **`seconds`** appears in the JSX. It goes in state.
- **The interval ID** appears nowhere in the JSX. Only the two handlers read it. It goes in a ref.

The same component can use both, each for its own value. The docs say: "You can combine refs and state in a single component."

---

## PRINCIPLE | I Started Eggs, So Why Did Tea Stop?

> [!PRINCIPLE]
> **Principle 4: A Variable Outside the Component Is Shared**
>
> *A variable at the top of the file survives every render, but every copy of the component shares it. A ref belongs to one copy only.*
>
> Moving the let above the component fixes Principle 2, and one stopwatch works fine. Put two stopwatches on the page, and both write into the same variable. A click on one of them stops the other.
>
> **DO THIS:**
> ```jsx
> export default function Stopwatch({ label }) {
>   const intervalRef = ~useRef(null)~; // Tea and Eggs each get their own box
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> let ~intervalId = null~; // **WRONG:** Tea and Eggs share this one variable
> export default function Stopwatch({ label }) {}
> ```

A variable at the top of the file runs once, when the file loads. No render makes it new again. So Stop works:

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

Now a kitchen needs two timers: one for the tea, one for the eggs. `App` renders two stopwatches:

```jsx title="src/App.jsx"
import Stopwatch from './Stopwatch.jsx';

export default function App() {
  return (
    <main>
      ~<Stopwatch label="Tea" />~ {/* The first copy */}
      ~<Stopwatch label="Eggs" />~ {/* The second copy */}
    </main>
  );
}
```

Each stopwatch shows its `label` as a heading. The user starts Tea, waits four seconds, then starts Eggs. Two seconds later:

```page width=text caption="Two seconds after Eggs started: Tea is frozen on 4, and only Eggs counts."
section: Tea
line: Seconds: 4 | bad
line: [Start] [Stop]
section: Eggs
line: Seconds: 2 | good
line: [Start] [Stop]
console: quiet
```

**The user never clicked Stop on Tea, and Tea stopped.** Here is why:
1. Start on Tea puts Tea's ID in `intervalId`.
2. Start on Eggs first clears `intervalId`. That variable holds Tea's ID, so Tea stops.
3. Then Eggs puts its own ID in the same variable.
4. Now Stop on Tea would stop Eggs.

There is only one variable for the whole file, and every copy uses it.

A ref fixes this. React keeps a separate box for each copy, the same way each copy has its own state (Lesson 12). Tea has its box, Eggs has its box. The docs: "The information is local to each copy of your component."

---

## PRINCIPLE | I Clicked Start, So Why Does the Page Still Say 0?

> [!PRINCIPLE]
> **Principle 5: Never Show a Ref on the Page**
>
> *A number the page shows must be state. Writing into a ref draws nothing, so the page keeps the old number.*
>
> The page shows what the last render read. A ref changes without a render, so the JSX keeps showing the old value. Later, when something else renders the component, the number suddenly jumps. Read and write refs in event handlers, not in the JSX.
>
> **DO THIS:**
> ```jsx
> const [seconds, setSeconds] = useState(0);
> return <p>Seconds: ~{seconds}~</p>; // The setter draws the page again, so every new number shows
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const secondsRef = useRef(0);
> return <p>Seconds: ~{secondsRef.current}~</p>; // **WRONG:** nothing draws the page again, so it stays on 0
> ```

Once developers learn that a ref changes at once, some put the shown number in a ref too:

```jsx title="src/Stopwatch.jsx" startLine="5" bad="1,6,15"
const secondsRef = ~useRef(0)~; // **WRONG:** the shown number in a ref

function handleStart() {
  clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    ~secondsRef.current = secondsRef.current + 1~; // Changes the box, and React is not told
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

```page width=text caption="Six seconds after Start: the box holds 6, and the page still says 0."
section: Tea
line: Seconds: 0 | bad
line: [Start] [Stop]
section: Eggs
line: Seconds: 0
line: [Start] [Stop]
console: quiet
```

The timer runs. The box really holds 6. But no line calls a setter, so React never renders, and the page keeps the 0 of the first render. The docs: "React is not aware of when you change it because a ref is a plain JavaScript object."

Something that can be tricky: the line is not frozen forever. If any other click calls a setter, React renders, reads the box, and the line jumps from 0 straight to 6. The docs call this unreliable code.

The fix: put `seconds` back in state, as in our working stopwatch.

> [!DEFINITION]
> **What does "during rendering" mean?** [NEW] During rendering means while React runs your component function: the lines in its body and the JSX it returns.
> An event handler is different. You write `handleStart` inside the component, but its code runs later, when the user clicks.
> So `{secondsRef.current}` in the JSX is read during rendering. `intervalRef.current = ...` inside `handleStart` is not.
> The docs give the rule: "Do not write or read `ref.current` during rendering, except for initialization." Why? Because React expects a component to be pure: the same props and state give the same JSX (Lesson 14). A ref can change behind React's back, so JSX that reads it can show a different result for the same state (Lesson 30).

### The one exception: fill an empty box once

Sometimes the box holds something expensive to create, such as a video player. Compare these two:

```jsx title="A new player on every render"
const playerRef = useRef(~new VideoPlayer()~); // Builds a new player on every render, and React keeps only the first
```

```jsx title="A player built once"
const playerRef = useRef(null);
if (~playerRef.current === null~) { // True only on the first render
  playerRef.current = new VideoPlayer();
}
```

Both give you the right player. But the first one builds a new player on every render and throws it away, because the start value is ignored after the first render. The second one builds it once. This is the exception the docs allow, "because the result is always the same, and the condition only executes during initialization."

---

## All 5 Principles Together

### The complete files

`App` renders two stopwatches:

```jsx title="src/App.jsx"
import Stopwatch from './Stopwatch.jsx';

export default function App() {
  return (
    <main>
      ~<Stopwatch label="Tea" />~ {/* Principle 4: its own seconds and its own box */}
      ~<Stopwatch label="Eggs" />~ {/* Principle 4: its own seconds and its own box */}
    </main>
  );
}
```

`Stopwatch` keeps the shown number in state and the ID in a ref:

```jsx title="src/Stopwatch.jsx"
import { useState, useRef } from 'react';

export default function Stopwatch({ label }) {
  const [seconds, setSeconds] = ~useState(0)~; // Principles 3 and 5: shown on the page, so state
  const intervalRef = ~useRef(null)~; // Principles 1, 2 and 4: never shown, one box per copy

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
      <p>Seconds: ~{seconds}~</p> {/* Principle 5: state on the page, never a ref */}
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
| **State** | It works, but every new ID draws the page again |
| **A variable outside the component** | Tea and Eggs stop each other |
| **A ref** | Each stopwatch starts and stops on its own |
| **The shown number in a ref** | The line stays at 0 |

```tree caption="Where a component can keep a value, and the job each place fits."
Where a component can keep a value
- !A let inside [`let intervalId`] | Born again **on every render** | Fits a value **worked out fresh** each render
- !Outside the component [`let` at the top of the file] | Survives renders, **shared by every copy** | Fits a value that **never changes**
- +State [`useState`] | Kept, and the setter **draws again** | Fits what **the page shows**
- +A ref [`useRef`] | Kept, **draws nothing**, one per copy | Fits what **only handlers need**
```

---

## For the Interview

> **The Interview Question:** How do you keep a value between renders without triggering a re-render?

### How to Answer Clearly in 30 Seconds

"I use a ref. `useRef` returns a plain object with one field, `current`. React creates it on the first render and returns the same object on every render after that, so the value survives re-renders, just like state. The difference: writing `ref.current` does not re-render, and the change is there at once. The classic case is a stopwatch: the interval ID goes in a ref, so the Stop handler can pass it to `clearInterval` many renders later. Three rules:
1. **A `let` inside the component resets on every render**, and a variable outside the component is shared by every copy, so neither can hold the ID.
2. **What the page shows goes in state**. What only event handlers need, such as an interval ID or a timeout ID, goes in a ref.
3. **Never read or write `ref.current` during rendering**, except to fill an empty ref once. A shown value kept in a ref does not update."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"How is `useRef` different from `useState`? Could you build one from the other?"**
   Both keep a value between renders, one per copy of the component. The state setter asks for a new render, and the new value comes with it. A ref has no setter: you write `current` directly, at once, and React is not told. The docs show that `useRef` could be built with `useState`: a state variable that holds `{ current: initialValue }` and whose setter is never called. That is why they call a ref "a regular state variable without a setter."
2. **"Why not read `ref.current` during rendering? When is it allowed?"**
   React expects components to be pure: the same props and state give the same JSX. A ref changes without a render, so JSX that reads it shows an old value, then jumps. The docs warn that the component "might still work", but newer React features rely on this rule. The `react-hooks/refs` lint rule and the React Compiler both flag a ref read during render. The one allowed case is filling an empty ref once, behind a check for `null`.
3. **"When would you reach for a ref at all?"**
   Rarely: the docs call it an "escape hatch" that "you won't need often." Their list: timeout and interval IDs, DOM elements, and other objects that are not needed to calculate the JSX. The most common use is a DOM element through the `ref` attribute, which the next lesson covers. A ref can hold any value: "a string, an object, or even a function." In Strict Mode, React calls the component twice in development, so each ref object is created twice and one copy is thrown away.

```tree dir=right caption="Interview comparison: what state and a ref share, and the one way they differ."
State vs. a ref
- +State [`useState`] | Kept between renders, **one per copy** | The setter **renders again**, and the new value comes **with the next render**
- +A ref [`useRef`] | Kept between renders, **one per copy** | No setter; a change is there **at once** and **renders nothing**
```
