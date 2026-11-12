# Lecture 16: Batching and Updater Functions
> INTERVIEW QUESTION | ❱ CORE | How does React queue multiple state updates, and when do you need an updater function?

---

## The Collision Between Imperative Execution and Queued Batch Reconciliation

### Snapshot replacement vs. pending state chaining

When a developer clicks a button in React and calls a state setter three times, their mental model expects imperative accumulation. They expect three calls to add three points to the total.

In React, calling a state setter does not immediately update state or redraw the screen. It places an update request into an internal queue, and React waits until the entire handler finishes before processing that queue in a single render pass.

Look at what happens when a click handler calls the setter with `count + 1` three times in a row, compared with passing an arrow function three times:

```jsx title="Passing count + 1 three times vs. passing an updater function three times"
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleDirectThree() {
    ~setCount(count + 1);~ // 1. count is 0: queues "replace with 0 + 1" -> 1
    ~setCount(count + 1);~ // 2. count is STILL 0: queues "replace with 0 + 1" -> 1
    ~setCount(count + 1);~ // 3. count is STILL 0: queues "replace with 0 + 1" -> 1
  }

  function handleUpdaterThree() {
    ~setCount(c => c + 1);~ // 1. Queues a transform: takes pending state 0 -> returns 1
    ~setCount(c => c + 1);~ // 2. Queues a transform: takes pending state 1 -> returns 2
    ~setCount(c => c + 1);~ // 3. Queues a transform: takes pending state 2 -> returns 3
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleDirectThree}>Direct +3 (Broken)</button>
      <button onClick={handleUpdaterThree}>Updater +3 (Working)</button>
    </div>
  );
}
```

Clicking the Direct +3 button moves the screen from `Count: 0` to **`Count: 1`**. Clicking the Updater +3 button moves the screen from `Count: 0` to **`Count: 3`**.

Look at the three silent confusions that trip developers up here:
1. **Writing `count + 1` three times looks like three additions, but it is NOT the same thing!** Inside this render snapshot, `count` stays at `0` from the first line of the handler to the last. Each line calculates `0 + 1` and hands React the finished number `1`. React hears *"make the count one"* three times in a row, so one click leaves the screen at `1`.
2. **Passing `count + 1` and passing the arrow function are NOT the same thing!** When a button calls `setCount` only once per click, both ways produce the same screen. Yet passing `count + 1` calculates a single number right now from this render snapshot. Passing the arrow function hands the function itself to React so React can call it later, feeding each function the result of the update right before it.
3. **The screen not changing between two setter lines looks as if React is slow or the first setter failed, but it did NOT fail!** React waits until every line of the event handler finishes before it renders the component once.

Look at the four terms you will hear in every React team and interview:
1. **Batching**: In everyday English, a batch is a group of items handled together in one go. You bake a whole tray of cookies at once instead of one cookie at a time. Think of a polite waiter at a restaurant. A waiter does not run to the kitchen the moment you name your first dish. The waiter listens until you finish your entire order, and even lets you change your mind, before walking to the kitchen once. In React, batching means React listens to every setter call in your event handler and then renders once at the end.
2. **Update queue**: In everyday English, a queue is a waiting line where items wait their turn in the exact order they arrived. For each state variable, React keeps an update queue like a stack of order slips that it reads from top to bottom during the next render.
3. **Updater function**: When you pass a plain value like `1` to a setter, that order slip says *"replace the value with one,"* ignoring earlier slips. When you pass an arrow function to a setter, React calls that function an updater function. Its order slip says *"take whatever the running result is by now and add one to it."*
4. **Pending state**: While React walks the queue during the next render, the running result produced by earlier slips is called the pending state. React passes that pending state into the parameter of the next updater function in line.

```tree caption="Why three direct value calls render 1, while three updater functions step cleanly from 0 to 3."
Three setter calls in one click starting from 0
- !Way 1: Direct value count + 1 three times | Every line reads the **same snapshot 0** and queues **replace with 1** | React executes all three slips and renders **1**
- +Way 2: Updater function c => c + 1 three times | Each queued function receives the **pending state** from the slip before it | Steps from 0 to 1, then 2, then **3** in one render
```

### What is at stake: the arena scoreboard desynchronization

What is at stake is preventing silent calculation failures that corrupt user interfaces while developer consoles report zero errors.

Picture the digital scoreboard above a basketball arena. The board displays the home team score, starting at zero, alongside an announcement reading *"Game start"*. Below sit three scorekeeper buttons for free throws, field goals, and three-point shots.

To avoid repeating calculation logic across handlers, the developer writes a single helper function named `addPoint` that calls `setScore` with the score plus one. The `+1` handler calls `addPoint` once. The `+2` handler calls it twice. The `+3` handler calls it three times.

The page now displays the wrong information. The scoreboard moves from `Home: 0` to `Home: 1` on a three-pointer, displaying incorrect game data to the entire arena with zero console errors.

During a live game, a player hits a three-point shot. The scorekeeper clicks `+3`.

The play announcement flips to *"Last play: Three-pointer."* But the score display moves from `Home: 0` to **`Home: 1`**!

A three-point basket registered as a single point in front of thousands of fans. The browser console stays completely quiet with zero errors or warnings. In an e-commerce checkout, this defect charges customers for one item when they selected three. In inventory systems, it applies only the final discount code and drops earlier ones.

```tree caption="What the scorekeeper expects when clicking +3 vs. what happens when the helper queues three value replacements from the same snapshot."
Clicking +3 on the basketball scoreboard
- +What the scorekeeper expects | Three calls should add **three points** to the home score | Board should move from Home: 0 to **Home: 3**
- !What happens with value replacement | All three calls read the **same snapshot 0** and queue **replace with 1** | Board moves from Home: 0 to **Home: 1** on a three-pointer
```

### Architectural choice: direct value, local buffering, or functional updater

In React, you have three ways to give a state setter its next value inside an event handler, and each way fits a different job.

Look at all three ways side by side:

```jsx title="Three ways to give setScore the next value"
function ScoreWays() {
  const [score, setScore] = useState(0);

  function handleDirect() {
    ~setScore(score + 3);~ // 1. Direct value: fits when this state is updated once in the click
  }

  function handleVariable() {
    const ~nextScore = score + 3~; // 2. Saved in a variable first: fits when the handler needs nextScore right away
    setScore(nextScore);
    console.log(nextScore);
  }

  function addPoint() {
    ~setScore(s => s + 1);~ // 3. Updater function: fits when several updates of score are queued in one click
  }
}
```

Here is how to choose among those three ways in daily coding:
1. **Direct value from the snapshot**: Passing `score + 3` directly to `setScore` fits whenever an event updates that state variable only once per click.
2. **Value saved in a local variable first**: Storing `score + 3` in a constant named `nextScore` fits when you update that state once and your running handler also needs that new number right away.
3. **Updater function**: Passing an updater function to `setScore` fits when the next value builds on the previous value and one click queues several updates. When one state variable must be calculated from a different state variable, teams instead combine them into a reducer (as seen in Lesson 29).

```tree caption="The three ways to give a state setter its next value, and when each way fits."
Three ways to pass the next state to setScore
- +1. Direct value from the snapshot | Best when the handler updates score **only once** per click | Simple and direct for single updates
- +2. Value saved in a variable first | Best when the **running handler** also needs the new number right away | Passes nextScore to both setScore and following lines
- +3. Updater function | Best when **multiple updates of score** are queued before the next render | Each queued function builds on the **pending state** before it
```

### Project architecture: the digital scoreboard

Our project uses four files. At the root sits `index.html`. Inside the source folder, the startup file mounts the app inside `<StrictMode>`, the main application file renders the scoreboard, and the scoreboard component lives inside the components subfolder:

```files title="scoreboard-app: File Explorer" caption="How our scoreboard project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `StrictMode` and `App` from `./App.jsx` and mounts into `#root`
  App.jsx | parent | Exports `App` as default and imports `Scoreboard` from `./components/Scoreboard.jsx`
  components/
    Scoreboard.jsx | state | Exports `Scoreboard` as default and manages `score` and `lastPlay` with `useState`
```

### The five invariants of queued state updates

When an event handler calls a state setter, React does not stop the handler and redraw the screen right away. Instead, React adds each update to a queue and processes the whole queue in one render after the handler finishes. Following what goes into that queue and when React runs it gives us five practical invariants:
1. **Principle 1: React Runs the Whole Handler First, Then Renders Once for All Its Setter Calls**: React runs every line of an event handler first, even code written after the setter calls, and then renders the page once with all state variables updated together. Each separate user click is handled on its own.
2. **Principle 2: A Value Replaces: Three Calls From the Same Snapshot Queue the Same Number**: Passing a calculated value to a setter adds a replacement slip to the queue. Every line in the handler reads the same snapshot, so calling that setter three times queues the same replacement number three times.
3. **Principle 3: An Updater Continues: React Calls It With the Pending State, So Three Calls Add Three**: Passing a function to a setter adds the function itself to the queue. During the next render, React calls each queued updater in order and passes it the pending state from the step before it, so three updater calls add three.
4. **Principle 4: React Walks the Queue in Order, So the Order of a Value and an Updater Decides the Result**: When a queue holds both value replacements and updater functions for the same state variable, React walks them in call order. An updater builds on the running result, whereas a value replacement ignores and clobbers every update queued before it.
5. **Principle 5: An Updater Runs Later, During the Render, So It Must Be Pure; Use One When Several Updates Are Queued**: React decides when to call updater functions, mostly during the next render, and calls each one twice in StrictMode during development. Every updater must be pure with zero side effects or logs inside it, and you need one whenever several updates of the same state stack up.

Here is the complete overview of all five invariants before we walk through each one:

| # | Invariant | Why It Matters in Debugging and Interviews | The React Invariant |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Batching Reconciles at Handler Exit** | Developers expect intermediate DOM paints between setter calls; interviewers ask how React prevents half-finished UI states. | React runs the entire event handler first, batches all setter calls together, and updates the screen in one single render pass. |
| **Principle 2** | **Value Setters Queue Replacements** | Calling a helper function multiple times in one click increments state only once, leaving no console warnings. | Passing a calculated value queues a replacement slip; multiple calls from the same snapshot queue the identical number. |
| **Principle 3** | **Updaters Chain Pending State** | Consecutive state transitions within a single click require updater functions to build on intermediate results. | Pass a pure function `s => s + 1` so React invokes it during the next render with the pending state from the preceding update. |
| **Principle 4** | **Queue Order Is Non-Commutative** | Mixing value updates and updaters yields different results depending on which helper runs last. | React walks queues from top to bottom: updaters add to running state, while trailing plain values overwrite the running total. |
| **Principle 5** | **Updaters Require Render Purity** | Console logs or side effects inside updaters fire twice per update in StrictMode development. | Updaters run during render and must be 100% pure; use them when multiple updates of the same state can queue before render. |

---

## 1. Principle 1: React Runs the Whole Handler First, Then Renders Once for All Its Setter Calls

### Multi-state batching: one render pass for all queued setters

Before we build our scoreboard, look at a small component with two state variables. The counter `count` starts at zero, and `label` starts with the text *"Not clicked"*. Inside the button click handler, we call both setters and then open a browser `alert` box on the last line:

```jsx title="Calling two state setters and alert inside one click handler"
function CounterAlert() {
  const [count, setCount] = useState(0);
  const [label, setLabel] = useState('Not clicked');

  function handleClick() {
    ~setCount(count + 1);~ // 1. Queues an update for count: screen does NOT change yet
    ~setLabel('Clicked');~ // 2. Queues an update for label: screen STILL does not change
    ~alert('Done');~ // 3. Pauses handleClick with the old screen still visible behind the pop-up!
  }

  return <button onClick={handleClick}>{label}: {count}</button>;
}
```

The screen does not update yet: while the browser dialog pauses execution, the button behind it stays frozen on its initial state because the handler has not finished.

Look at two things that surprise beginners when they click that button:
1. Writing two setter calls one after the other looks like it should update the screen twice, once for `count` and a second time for `label`. It may look like two screen updates, but it is NOT two renders! React waits until `handleClick` finishes and combines both state changes into one single render.
2. While the alert pop-up sits open on the screen, both state setters have already run. Yet the button behind the alert still displays zero and the old label! It looks as if the setters failed or got stuck, but they did NOT fail! Because `alert` pauses the click handler, the handler has not finished yet. Like the waiter who stays at your table until you finish your whole order, React waits until you dismiss the alert and the handler returns before rendering:

```tree dir=right caption="What happens during handleClick while alert is open vs. after the handler finishes."
One click on CounterAlert
- +While alert is open | Both updates sit waiting in React queues | Screen behind the pop-up **still shows Not clicked: 0**
- +After clicking OK | React batches both updates into **one render** | Screen updates to **Clicked: 1 all at once**
```

### Project setup: two state setters in one event handler

Now let us build our basketball scoreboard project and watch this exact behavior on the page.

First, our main application file imports the scoreboard component and renders its tag:

```jsx title="src/App.jsx" startLine="1"
import ~Scoreboard~ from './components/Scoreboard.jsx'; // 1. Import the Scoreboard component

export default function App() {
  return <Scoreboard />;
}
```

Next, in the scoreboard file, we store the score and the latest play in state. We also write a three-point handler that updates both values and opens a pop-up:

```jsx title="src/components/Scoreboard.jsx" startLine="1"
import { useState } from 'react';

export default function Scoreboard() {
  const [score, setScore] = useState(0);
  const [lastPlay, setLastPlay] = useState('Game start');

  function handleThree() {
    ~setScore(score + 3);~ // 1. Adds "replace score with 3" to the score queue
    ~setLastPlay('Three-pointer');~ // 2. Adds "replace lastPlay with 'Three-pointer'" to the lastPlay queue
    ~alert('Three points for Home!');~ // 3. Opens pop-up and pauses handleThree before React renders!
  }
```

Below the handler, the scoreboard returns the heading, the two text lines, and the three-point button:

```jsx title="src/components/Scoreboard.jsx" startLine="13"
  return (
    <section>
      <h1>Scoreboard</h1>
      <p className="score">Home: {score}</p>
      <p className="last-play">Last play: {lastPlay}</p>
      ~<button onClick={handleThree}>+3</button>~ {/* 4. Clicking +3 runs handleThree */}
    </section>
  );
}
```

**React never renders mid-handler: state setters only place slips into internal queues, and rendering begins only when the event handler call stack completely clears.**

Watch what happens in order when the scorekeeper clicks the `+3` button:
1. Before the click, the scoreboard displays `Home: 0` and *"Last play: Game start."*
2. The scorekeeper clicks `+3`. The browser pop-up saying *"Three points for Home!"* opens right away.
3. While that pop-up is open, the scoreboard behind it still says `Home: 0` and *"Last play: Game start"*! Thinking the setters are broken, a beginner often tries moving the `alert` line around.
4. The scorekeeper clicks `OK` to close the pop-up. That lets `handleThree` finish its last line, and the scoreboard changes to `Home: 3` and *"Last play: Three-pointer"* at the exact same moment!

### The execution timeline: why alert freezes the DOM in its previous state

React automatically initiates rendering when the event handler returns to the browser event loop.

**Browser rendering and JavaScript execution run on a single thread: React batches all queued updates into one reconciliation pass, avoiding intermediate paints and half-finished screens.**

Follow what JavaScript and React do step by step on that click:
1. Clicking the three-point button starts `handleThree` in the render where `score` is zero and the play text says *"Game start."*
2. Line 1 calls `setScore` with `0 + 3`. React places that update in the queue for `score` and leaves the screen untouched.
3. Line 2 calls `setLastPlay` with `'Three-pointer'`. React places that update in the queue for `lastPlay` and still leaves the screen untouched.
4. Line 3 calls `alert`. The browser opens the pop-up box and pauses JavaScript right on line 3 until the user clicks `OK`.
5. When the user clicks `OK`, `handleThree` finishes and returns. React sees that the handler is done, calls `Scoreboard` once with the new values, and commits both lines to the DOM together:

::: row caption="The scoreboard while alert pauses handleThree vs. immediately after the user clicks OK and handleThree finishes."
::: col title="While alert Is Open in handleThree" tag="handler has not finished yet" tone=plain
```page size=mini
heading: Scoreboard
line: Home: 0
line: Last play: Game start
row: +3
```
Both setter calls have already queued their updates, but `handleThree` is still paused on `alert`.
:::
::: col title="After Clicking OK on the Pop-Up" tag="1 render updates both lines" tone=good
```page size=mini
heading: Scoreboard
line: Home: 3 | good
line: Last play: Three-pointer | good
row: +3
```
Once `handleThree` finishes, React runs one render and updates both state lines together.
:::
:::

### Event boundary isolation: why batching never merges independent clicks

Waiting until the end of the event handler to process every setter call in one render is called **batching**. Batching solves two problems at once:
1. **Your app runs much faster**: Even if one click handler updates several state variables across multiple components, React re-renders only once at the end instead of re-rendering after every setter call.
2. **The user never sees a half-finished screen**: Without batching, calling `setScore` before `setLastPlay` would briefly show the new score paired with the old play text. Batching guarantees that both updated lines appear together in the same render.

React enforces strict event boundary isolation, completing reconciliation for the first click before handling subsequent user input. Every click is handled on its own, and React finishes rendering the first click before the next click runs. If a user's first click disables a submit button on a form, that button is already disabled before a second click can submit the form again. When code must force an earlier DOM update inside a handler, React provides a helper named `flushSync` (as seen in Lesson 31).

```tree caption="How React batches multiple setter calls inside one click vs. how it handles two separate user clicks."
What React batches vs. what React keeps separate
- +Multiple setter calls in ONE click | React waits until the **entire handler finishes** | Processes both updates in **1 single render** with **0 half-finished screens**
- +Two SEPARATE user clicks | React **never** batches across separate intentional clicks | The **1st click finishes its render** before the **2nd click** runs
```

> [!PRINCIPLE]
> **Principle 1: Batching: React Runs the Whole Handler First, Then Renders Once for All Its Setter Calls**
>
> *React waits until every line of an event handler finishes before processing queued updates together in a single render pass.*
>
> Calling a state setter places an update slip into React's internal queue without pausing execution or redrawing the DOM immediately. Even when a handler updates multiple state variables across multiple components, React defers rendering until the handler call stack clears completely. It reconciles every queued setter together in one unified render, preventing intermediate paints and keeping related state variables synchronized.
>
> **DO THIS:**
> ```jsx
> function handleThree() {
>   ~setScore(score + 3);~ // 1. Queued: React waits until handleThree finishes
>   ~setLastPlay('Three-pointer');~ // 2. Batched with score update into ONE single render pass!
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   setScore(score + 3);
>   ~logScore(score);~ // **WRONG:** reads the frozen snapshot score expecting state to update immediately!
>   setLastPlay('Three-pointer');
> }
> ```

---

## 2. Principle 2: A Value Replaces: Three Calls From the Same Snapshot Queue the Same Number

### Snapshot invariance: JavaScript evaluates math before setters run

Now look at what happens when one event handler calls the same state setter three times with a calculated value. Suppose `number` starts at `0`, and our button handler runs these three lines:

```jsx title="What you write: three calls with number + 1"
const [number, setNumber] = useState(0);

function handleClick() {
  ~setNumber(number + 1);~ // 1st call in this render where number is 0
  ~setNumber(number + 1);~ // 2nd call in the same render where number is STILL 0
  ~setNumber(number + 1);~ // 3rd call in the same render where number is STILL 0
}
```

Because `number` is locked at zero for this entire render snapshot (as seen in Lesson 15), substitute `0` on each of those three lines:

```jsx title="What JavaScript actually passes to setNumber when number is 0"
function handleClick() {
  ~setNumber(1);~ // 1st slip added to the queue: "replace number with 1"
  ~setNumber(1);~ // 2nd slip added to the queue: "replace number with 1"
  ~setNumber(1);~ // 3rd slip added to the queue: "replace number with 1"
}
```

Look closely at those two code blocks:
1. Writing `number + 1` inside `setNumber` looks like an instruction to add one, but it is NOT an instruction to add one! JavaScript calculates `0 + 1` before calling `setNumber`, so React never sees a plus sign. React only receives the finished number `1`.
2. In a render where `number` equals zero, passing `number + 1` three times and passing one three times are the exact same thing! Passing any non-function value to a setter adds a slip to the queue that says *"replace with that value,"* ignoring earlier slips. After all three lines run, the queue holds three identical slips that all say *"replace with 1"*! When React renders after the handler, the screen changes from `0` to `1`:

```tree dir=right caption="How three calls with number + 1 in the render where number is 0 queue three identical replacement slips."
One click when number is 0
- +1. First call | Hands 1 to setNumber | Queue slip 1: **replace with 1**
- +2. Second call | Reads the **same snapshot 0** and hands 1 to setNumber | Queue slip 2: **replace with 1**
- +3. Third call | Reads the **same snapshot 0** and hands 1 to setNumber | Queue slip 3: **replace with 1** -> next render shows **1**
```

### The helper trap: how reusable functions stagnate on the current snapshot

The scoreboard displays the wrong score. After a three-point basket, the play label reads *"Three-pointer"* but the score advances by only one point with zero console errors.

Let us see how this trap appears in our basketball scoreboard. We remove the pop-up from Principle 1 and add the free-throw button and the two-point button beside `+3`.

To avoid repeating the score update in every button, the developer writes one `addPoint` helper and calls it in the free-throw handler:

```jsx title="src/components/Scoreboard.jsx" startLine="1"
import { useState } from 'react';

export default function Scoreboard() {
  const [score, setScore] = useState(0);
  const [lastPlay, setLastPlay] = useState('Game start');

  function addPoint() {
    ~setScore(score + 1);~ // **WRONG:** calculates score + 1 from the same snapshot every time addPoint runs in one click!
  }

  function handleOne() {
    addPoint();
    setLastPlay('Free throw');
  }
```

Below the free-throw handler, the two-point handler calls `addPoint` twice, and the three-point handler calls `addPoint` three times while logging the score after each call:

```jsx title="src/components/Scoreboard.jsx" startLine="16"
  function handleTwo() {
    addPoint();
    addPoint();
    setLastPlay('Two-pointer');
  }

  function handleThree() {
    ~addPoint();~ // 1st call: queues "replace with score + 1"
    console.log(score);
    ~addPoint();~ // 2nd call: reads the exact same score snapshot and queues the same number again!
    console.log(score);
    ~addPoint();~ // 3rd call: reads the exact same score snapshot a 3rd time!
    console.log(score);
    setLastPlay('Three-pointer');
  }
```

Finally, the scoreboard renders the heading, the two text lines, and all three buttons:

```jsx title="src/components/Scoreboard.jsx" startLine="32"
  return (
    <section>
      <h1>Scoreboard</h1>
      <p className="score">Home: {score}</p>
      <p className="last-play">Last play: {lastPlay}</p>
      <button onClick={handleOne}>+1</button>
      <button onClick={handleTwo}>+2</button>
      <button onClick={handleThree}>+3</button>
    </section>
  );
}
```

**Helper functions that read state variables directly cannot accumulate values across calls in the same click because all calls share the same frozen render snapshot.**

Watch what happens when the scorekeeper tests the three buttons during the game:
1. First, the scorekeeper clicks `+1` for a free throw. Because `handleOne` calls the helper only once, the board moves from zero to `Home: 1` with the free-throw label. Everything seems to work!
2. Next, with the board at `Home: 1`, a player hits a three-pointer and the scorekeeper clicks `+3`. The play line updates to three-pointer, but the score only rises to `Home: 2` instead of `Home: 4`!
3. Next, the scorekeeper clicks `+2`. The score only rises to `Home: 3` instead of `Home: 5`! Every button on the scoreboard adds only one point, and the Console shows zero warnings.
4. Look at the Console panel after clicking `+3` from a starting score of one. All three `console.log` lines print `1`, the starting score before the click!

### Queue substitution: why three calls deposit three identical replacement slips

React's queue reconciler processes replacement slips literally, overwriting each prior slip with the identical snapshot value. Two rules from React work together here. State as a snapshot keeps `score` fixed during the click (as seen in Lesson 15), and batching waits until all three `addPoint` calls finish before rendering.

**React processes replacement slips literally: the queue receives three orders to replace score with 2, overwriting each previous slip with the identical number.**

Follow what happens step by step when the scorekeeper clicks `+3` while `score` is one:
1. Clicking the three-point button starts `handleThree` inside the render snapshot where `score` is one.
2. The first `addPoint` call calculates `1 + 1` and passes two to the setter. React adds *"replace with 2"* to the queue, and the first log prints `1`.
3. Calling a setter never changes `score` in the running handler, so the second `addPoint` call still reads one. It calculates `1 + 1` again, queues a second replacement with two, and prints `1`.
4. The third `addPoint` call also reads `score` as one. It adds a third *"replace with 2"* slip to the queue, and the third log prints `1`.
5. After `handleThree` finishes, React runs one render and walks the queue for `score`: replace with two, three times in a row. Every slip sets the score to `2`, so the board shows `Home: 2`!

Notice too that saving a local variable like `nextScore` inside `addPoint` would not fix this helper either. Because `addPoint` reads `score` from the component snapshot each time it runs, all three calls in one click would still calculate two:

::: row caption="Clicking +3 when score starts at 1 with a value-based addPoint helper: all three calls queue replace with 2."
::: col title="On the Page After Clicking +3 from Home: 1" tag="rises by 1 instead of 3" tone=bad
```page size=mini
heading: Scoreboard
line: Home: 2 | bad
line: Last play: Three-pointer
row: +1 ; +2 ; +3
```
The score moves from one to `2` instead of four because all three `addPoint` calls queued two.
:::
::: col title="In Chrome's Console Panel" tag="same snapshot 1 all three times" tone=bad
```devconsole
+ 1 | Scoreboard.jsx:24
+ 1 | Scoreboard.jsx:26
+ 1 | Scoreboard.jsx:28
```
Inside `handleThree`, the `score` snapshot stays at one on every line, and zero warnings are logged.
:::
:::

```tree caption="What each of the three addPoint calls puts into React's queue when clicking +3 from Home: 1."
Three addPoint calls in one click when score is 1
- !1st addPoint call | Calculates 1 + 1 and passes 2 | Queue slip 1: **replace with 2**
- !2nd addPoint call | Calculates 1 + 1 again and passes 2 | Queue slip 2: **replace with 2**, ignoring slip 1
- !3rd addPoint call | Calculates 1 + 1 a 3rd time and passes 2 | Queue slip 3: **replace with 2** -> renders **Home: 2**
```

> [!PRINCIPLE]
> **Principle 2: Value Updates Replace: Three Calls From the Same Snapshot Queue the Same Number**
>
> *Passing a non-function value to a setter queues a replacement slip, so multiple calls from the same snapshot queue the exact same number.*
>
> When you pass an arithmetic expression to a state setter, JavaScript evaluates that calculation immediately using the current render snapshot. React receives only the finished number, placing a replacement order slip into the queue that overwrites any prior value. When an event handler calls a value-based helper several times, every call reads the same frozen snapshot. Each call queues the same replacement number, advancing state by only one point.
>
> **DO THIS:**
> ```jsx
> function handleOne() {
>   ~addPoint();~ // Safe when called ONCE per click: queues a single replacement from this snapshot
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   addPoint();
>   addPoint();
>   ~addPoint();~ // **WRONG:** calling a value-based helper three times queues replace with 1 three times!
> }
> ```

---

## 3. Principle 3: An Updater Continues: React Calls It With the Pending State, So Three Calls Add Three

### Static values vs. functional transforms: resolving state at render time

Before writing an updater function, look at a small JavaScript shortcut used throughout React codebases: the short arrow function.

In plain JavaScript, when a function takes one parameter and only returns a single calculation, you can write it in a short form. You leave out the word `function`, the parameter parentheses, the curly braces, and the word `return`:

```js title="Plain JavaScript: a full function vs. a short arrow function"
const addOneFull = ~function (s) { return s + 1; }~; // 1. Full function syntax: takes s and returns s + 1
const addOneShort = ~s => s + 1~; // 2. Exact same thing: takes s and returns the value after =>!
```

Yes, those two functions are the exact same thing! The parameter `s` on the left of the arrow is the input, and the calculation `s + 1` on the right is automatically returned.

To chain consecutive updates within a single event, pass an updater function to the setter instead of a calculated number.

Compare both setter calls side by side:

```jsx title="Passing a calculated value vs. passing an updater function"
~setNumber(number + 1);~ // 1. Value update: calculates 0 + 1 right now from the snapshot and queues "replace with 1"
~setNumber(n => n + 1);~ // 2. Updater function: queues the function n => n + 1 so React calls it during the next render!
```

Look at the three distinctions that make updater functions clear right away:
1. Passing `number + 1` and passing the arrow function on line 2 are NOT the same thing! When you call a setter only once per click, both produce the same screen, so they seem to work the same at first. Yet passing `number + 1` calculates a number right now from this render snapshot and tells React to replace the state. Passing the arrow function hands the function itself to React so it continues from the latest value in the queue during the next render.
2. The parameter `n` inside the arrow function and the state variable `number` outside it are NOT the same thing! They both hold the count, so they look like the same variable at first. Yet the state variable `number` is frozen at `0` for the entire click handler. During the next render, React fills the parameter `n` with the pending state, the running result from the update right before it.
3. The short arrow function on line 2 is the exact same thing as a full JavaScript function that takes `n` and returns `n + 1`! Both take the pending state `n` from React and return `n + 1`.

Now look at what happens when one click handler queues three updater functions in a row starting from `0`:

```jsx title="Queueing three updater functions in one click handler"
const [number, setNumber] = useState(0);

function handleClick() {
  ~setNumber(n => n + 1);~ // 1st updater in queue: React passes n = 0 -> returns 1
  ~setNumber(n => n + 1);~ // 2nd updater in queue: React passes n = 1 -> returns 2
  ~setNumber(n => n + 1);~ // 3rd updater in queue: React passes n = 2 -> returns 3
}
```

During the next render, React walks through the three queued functions in order, passing the return value of each function as the `n` parameter of the next one:

| Queued Update | Value of `n` Passed by React | Return Value Passed to the Next Step |
| :--- | :--- | :--- |
| **1st updater in queue** | `0`, the starting state from this render | `0 + 1` -> **`1`** |
| **2nd updater in queue** | `1`, the pending state from the 1st updater | `1 + 1` -> **`2`** |
| **3rd updater in queue** | `2`, the pending state from the 2nd updater | `2 + 1` -> **`3`**, stored as the final state |

```tree dir=right caption="How three queued updater functions hand their running result, the pending state, from one step to the next."
React walks three updaters starting from 0
- +1. First updater | Adds 1 to 0 | Returns pending state **1**
- +2. Second updater | Takes the **1 from step 1** and adds 1 | Returns pending state **2**
- +3. Third updater | Takes the **2 from step 2** and adds 1 | Returns **3**, which useState gives to the page
```

### The closure shadow bug: reading the outer snapshot inside an updater

The scoreboard is still broken. Using the outer score variable inside the updater ignores the parameter, evaluates the frozen snapshot score, and leaves the board stuck at `Home: 1`.

Let us update `addPoint` in our basketball scoreboard to use an updater function. Watch the easy mistake where a developer writes the arrow parameter `s`, but still writes the outer snapshot variable `score` on the right side:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~setScore(s => score + 1);~ // **WRONG:** ignores parameter s and still reads the frozen snapshot variable score!
  }
```

When the developer saves the file and clicks the three-point button from zero, the scoreboard still rises to `Home: 1` instead of `Home: 3`!

The arrow function failed to fix the bug because `score` on the right side of the arrow is still the component frozen snapshot variable `0`. Even though React passed zero, then one, and then two into `s`, the function body ignored that parameter and returned `0 + 1` all three times.

### Consuming pending state: piping intermediate values through the queue

To make each queued update build on the one before it, the right side of the arrow must calculate its result from the updater own parameter, `s`:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~setScore(s => s + 1);~ // Uses the pending state parameter s passed in by React!
  }

  function handleOne() {
    addPoint();
    setLastPlay('Free throw');
  }

  function handleTwo() {
    addPoint();
    addPoint();
    setLastPlay('Two-pointer');
  }

  function handleThree() {
    ~addPoint();~ // 1st queued updater: s = 0 -> returns 1
    ~addPoint();~ // 2nd queued updater: s = 1 -> returns 2
    ~addPoint();~ // 3rd queued updater: s = 2 -> returns 3
    setLastPlay('Three-pointer');
  }
```

### The deferred render walk: how React sequentially invokes queued updaters

React queue reconciler sequentially invokes updaters during render, piping the return value of each step into the parameter of the next.

**React resolves updater functions in order. Each function receives the running result of the slip before it, chaining zero to one, one to two, and two to three within a single render.**

Follow what happens in order when the scorekeeper clicks `+3` from `Home: 0`:
1. Clicking `+3` runs `handleThree`. Each of the three `addPoint` calls hands the updater function to `setScore` without calling it. React places all three functions in the update queue for `score`.
2. Next, `setLastPlay` queues the new play text, and `handleThree` finishes.
3. React starts the next render by calling `Scoreboard`. Inside `useState`, React walks the queue of three updater functions starting from zero.
4. React calls the first updater with `s` set to zero, and gets back `1`.
5. React calls the second updater with `s` set to that pending state one, and gets back `2`.
6. React calls the third updater with `s` set to that pending state two, and gets back `3`. React stores `3` as the new score and commits `Home: 3` and the three-pointer label to the page! If the scorekeeper then clicks `+2`, the two queued updaters step from three to four and five, showing `Home: 5`:

::: row caption="Writing s => score + 1 inside addPoint vs. reading the pending state parameter s in s => s + 1."
::: col title="Mistake: s => score + 1" tag="ignores s, reads snapshot 0" tone=bad
```page size=mini
heading: Scoreboard
line: Home: 1 | bad
line: Last play: Three-pointer
row: +1 ; +2 ; +3
```
Because the body reads `score` instead of `s`, all three updaters return one and the board stops at one point.
:::
::: col title="Fixed: s => s + 1" tag="each updater builds on s" tone=good
```page size=mini
heading: Scoreboard
line: Home: 3 | good
line: Last play: Three-pointer | good
row: +1 ; +2 ; +3
```
Each queued updater adds one to the pending state `s` from the step before it, moving the board to `Home: 3`.
:::
:::

### Parameter conventions and setter invariants: return values and function storage

When you write an updater function, React lets you give its parameter any valid JavaScript name. Across React teams and interviews, you will see three common naming styles:
1. **The first letter of the state variable**: writing `s` for `score`, or a single letter for any state name.
2. **The full state variable name**: repeating `score` as the parameter name, which works because the inner parameter name shadows the outer state variable inside the arrow function.
3. **A `prev` prefix**: writing `prevScore` or `prevEnabled` to show clearly that the parameter holds the state from the step right before this updater.

```jsx title="The three common naming styles for an updater parameter"
~setScore(s => s + 1);~ // 1. First letter of the state variable name
~setScore(score => score + 1);~ // 2. Full state variable name repeated as the parameter
~setScore(prevScore => prevScore + 1);~ // 3. "prev" prefix before the state variable name
```

Keep two more invariants about state setters in mind for debugging and interviews:
1. **Setter functions return `undefined`**: Calling `setScore` only adds an update to React's queue and returns nothing. Assigning the result of `setScore` to a variable always stores `undefined`.
2. **React treats any function passed to a setter as an updater function**: To store a function itself inside state, wrap it in an outer arrow function so React calls the wrapper and stores your function:

```jsx title="How to store a function itself in state without React calling it as an updater"
~setFn(someOtherFunction);~ // **WRONG:** React treats someOtherFunction as an updater and calls it during render!
~setFn(() => someOtherFunction);~ // Outer arrow is the updater: React calls () => someOtherFunction and stores someOtherFunction!
```

> [!PRINCIPLE]
> **Principle 3: Updater Functions Continue from the Pending State**
>
> *Pass an updater function to the setter so React calls it during the next render with the pending state from the update before it.*
>
> Instead of handing a finished number to the state setter, an updater function hands React a small calculation. That function takes the pending state as its parameter and returns the next state. During the next render, React walks the queue and feeds the return value of each updater straight into the parameter of the next updater in line. Make sure the right side of the arrow reads the updater's own parameter and not the outer snapshot variable.
>
> **DO THIS:**
> ```jsx
> function addPoint() {
>   ~setScore(s => s + 1);~ // Reads the pending state parameter s supplied by React
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function addPoint() {
>   ~setScore(s => score + 1);~ // **WRONG:** ignores s and reads the frozen snapshot variable score!
> }
> ```

---

## 4. Principle 4: React Walks the Queue in Order, So the Order of a Value and an Updater Decides the Result

### Non-commutative queues: why value-then-updater differs from updater-then-value

Mixed queue entries are non-commutative; trailing plain values overwrite accumulated pending state.

Suppose `number` starts at zero. Inside a click handler, we call the setter with `number + 5` and also call it with a one-point updater.

When you put both calls in the same handler, there are two ways to order them:
1. **Order 1**: The value update `number + 5` comes before the one-point updater. That means the value update is first in the queue, and the updater is second, at the end.
2. **Order 2**: The one-point updater comes before the value update `number + 5`. That means the updater is first in the queue, and the value update is second, at the end.

Look at both orders side by side starting from `number` equal to `0`:

```jsx title="The two ways to order a value update and an updater function in one handler"
const [number, setNumber] = useState(0);

function handleOrderOne() {
  ~setNumber(number + 5);~ // Order 1, slip 1: value update is FIRST -> replaces 0 with 5
  ~setNumber(n => n + 1);~ // Order 1, slip 2: updater is LAST -> takes 5 and returns 6!
}

function handleOrderTwo() {
  ~setNumber(n => n + 1);~ // Order 2, slip 1: updater is FIRST -> takes 0 and returns 1
  ~setNumber(number + 5);~ // Order 2, slip 2: value update is LAST -> ignores 1 and replaces with 5!
}
```

In everyday math, adding five and then adding one gives the same answer as adding one and then adding five. So Order 1 and Order 2 look like they should produce the same screen, and Order 1 even gives `6`, but they are NOT the same thing!

**Queue entries are not commutative additions: a value entry is a hard replace command that discards whatever pending state was computed by preceding updaters.**

Here is why Order 1 displays **`6`** while Order 2 displays **`5`**:
1. **In Order 1**, the value update runs first. In this render `number` is zero, so the first slip says *"replace with 5"*! The running result becomes five. Next, the updater function runs second. It receives that running result five as `n`, adds one, and produces **`6`**.
2. **In Order 2**, the updater function runs first. It receives the starting state zero as `n`, adds one, and makes the running result `1`. Next, the value update runs second! Because `number` in this render snapshot is still zero, its slip says *"replace with 5"*! A value slip replaces the running result and ignores earlier slips, so it throws away the `1` and leaves **`5`**!

Now look at placing one more value call, `42`, at the very end after the updater:

```jsx title="Placing a plain value update after an updater in the queue"
function handleReplaceAtEnd() {
  setNumber(number + 5);
  setNumber(n => n + 1);
  ~setNumber(42);~ // Slip 3: comes LAST -> ignores the running 6 and replaces the state with 42!
}
```

Look at how React walks those three slips in order starting from `0`:

| Queued Update | Value of `n` Passed by React | Return Value Passed to the Next Step |
| :--- | :--- | :--- |
| **1. Replace with `5`** | `0`, unused because a value slip ignores `n` | **`5`** |
| **2. Updater function `n => n + 1`** | `5`, the pending state from step 1 | `5 + 1` -> **`6`** |
| **3. Replace with `42`** | `6`, unused because a value slip ignores `n` | **`42`**, stored as the final state |

That table also unlocks how React views both kinds of slips internally. Passing a plain value like `5` to a setter is the exact same thing in the queue as passing `n => 5`! Both ignore whatever `n` came before them and return `5`:

```tree caption="How the order of value replacements and updater functions in the queue decides the final state from 0."
Three mixed queues starting from 0
- +Order 1: Value number + 5 BEFORE updater | Slip 1 sets running state to 5; slip 2 adds 1 to 5 | Renders **6**
- !Order 2: Updater BEFORE value number + 5 | Slip 1 returns 1, then slip 2 overwrites 1 with 5 | Renders **5**, losing the updater point
- !Value 42 placed AFTER earlier updates | Slip 3 comes last and ignores the 6 built above it | Renders **42**
```

### The internal queue reducer: tracing React's state reconciler in pure JavaScript

We can write React's entire queue calculation in ten lines of plain JavaScript. Starting from `baseState`, React loops through each item in the `queue` array from first to last:

```js title="Plain JavaScript: how React calculates the final state from a queue"
function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (const update of queue) {
    if (~typeof update === 'function'~) { // 1. Updater function: call it with the running finalState!
      finalState = update(finalState);
    } else {
      ~finalState = update;~ // 2. Plain value: overwrite finalState and ignore what came before!
    }
  }

  return finalState;
}
```

Look at the two branches inside that `for` loop. When the queue item is a function, React calls `update` with the running `finalState` so it continues from the step before it. When the queue item is any plain value, `finalState = update` overwrites `finalState` completely and forgets every earlier step in the loop!

### Order-dependent destruction: how a trailing value replacement clobbers prior updaters

Swapping the helper order breaks the calculation. Calling `addPoint` before a value-based helper leaves the board at `Home: 2` because the replacement slip wipes out the updater's point.

Watch how easy it is to trip over that `else` branch in our basketball scoreboard. Suppose the page reloads to zero, and a teammate adds a second helper named `addTwo` for the two-point button using a plain value `score + 2`. When the scorekeeper clicks `+2`, `addTwo` is the only score update in that click, so the two-point button works fine on its own.

Next, the teammate rewrites the three-point handler to combine both helpers by calling `addTwo` first and `addPoint` second:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    setScore(s => s + 1);
  }

  function addTwo() {
    ~setScore(score + 2);~ // Uses a plain value replacement instead of an updater function
  }

  function handleThree() {
    ~addTwo();~ // Order 1, slip 1: queues "replace with 0 + 2" -> running state is 2
    ~addPoint();~ // Order 1, slip 2: updater s => s + 1 takes 2 -> returns 3, hiding the bug!
    setLastPlay('Three-pointer');
  }
```

When the scorekeeper clicks `+3` from zero, the board shows `Home: 3`! Because the value replacement `addTwo` ran before the updater `addPoint`, the bug stays completely hidden.

Later that afternoon, another developer edits the three-point handler and swaps the two lines so `addPoint` runs before `addTwo`:

```jsx title="src/components/Scoreboard.jsx" startLine="15"
  function handleThree() {
    ~addPoint();~ // Order 2, slip 1: updater s => s + 1 runs first -> turns 0 into 1
    ~addTwo();~ // **WRONG:** Order 2, slip 2: queues "replace with 0 + 2" AFTER addPoint -> wipes out 1 and sets 2!
    setLastPlay('Three-pointer');
  }
```

After reloading the page to zero, the scorekeeper clicks `+3` for a three-pointer. Now the scoreboard shows **`Home: 2` instead of `Home: 3`**!

### Queue overwrite mechanics: why replacement slips ignore accumulated state

React's queue reconciler processes the array linearly: addPoint computes 1, but addTwo unconditionally overwrites the running total with 2.

**React's queue reconciler processes the array linearly: addPoint computes 1, but addTwo unconditionally overwrites the running total with 2.**

Follow what JavaScript and React do in order when `score` starts at `0`:
1. Calling `addPoint` first adds its one-point updater function as the first slip in the queue.
2. Calling `addTwo` second reads this render's fixed snapshot `score`, which is still zero. It calculates `0 + 2` and adds *"replace with 2"* as the second slip in the queue.
3. When `handleThree` returns, React walks the queue starting from zero: the first slip is the updater, which turns zero into `1`. The second slip is *"replace with 2,"* which ignores the running one and overwrites the score with `2`!

### Symmetric functional composition: guaranteeing order-independent results

Whenever two helpers can be called together in one event for the same state variable, write both helpers with updater functions:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~setScore(s => s + 1);~ // Updater function: adds 1 to the pending state s
  }

  function addTwo() {
    ~setScore(s => s + 2);~ // Updater function: adds 2 to the pending state s!
  }

  function handleThree() {
    addPoint();
    addTwo();
    setLastPlay('Three-pointer');
  }
```

Now both `addPoint` and `addTwo` build on the pending state. Whether `handleThree` calls `addTwo` first or last, the queue steps cleanly to three:

::: row caption="Swapping addPoint before a value-based addTwo vs. writing both addPoint and addTwo with updater functions."
::: col title="addPoint Before Value-Based addTwo" tag="replace with 2 wipes out 1" tone=bad
```page size=mini
heading: Scoreboard
line: Home: 2 | bad
line: Last play: Three-pointer
row: +1 ; +2 ; +3
```
The updater turns zero into one, and then `addTwo` replaces the running result with two, leaving `Home: 2`.
:::
::: col title="Both Helpers Written with Updaters" tag="both orders give Home: 3" tone=good
```page size=mini
heading: Scoreboard
line: Home: 3 | good
line: Last play: Three-pointer | good
row: +1 ; +2 ; +3
```
With updater functions in both helpers, both slips build on `s`, so either order renders `Home: 3`.
:::
:::

> [!PRINCIPLE]
> **Principle 4: Queue Order: React Walks Mixed Updates from First to Last**
>
> *During the next render, React walks the queue in order: an updater builds on the running result, while a plain value replaces it.*
>
> When you mix plain value updates and updater functions for the same state variable in one event, the order of the lines changes the final number on screen. Any updater function placed after a value update adds to that value, whereas a plain value placed after updater functions ignores their work and overwrites the running state. Whenever helpers for the same state can be combined in one click, write all of them with updater functions.
>
> **DO THIS:**
> ```jsx
> function handleThree() {
>   ~addPoint();~ // 1st slip: queues s => s + 1
>   ~addTwo();~ // 2nd slip: queues s => s + 2 -> steps from 0 to 1 to 3 in either call order!
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   addPoint(); // 1st slip: queues s => s + 1
>   ~addTwoWithScore();~ // **WRONG:** queues replace with 0 + 2 -> wipes out the point from addPoint!
> }
> ```

---

## 5. Principle 5: An Updater Runs Later, During the Render, So It Must Be Pure; Use One When Several Updates Are Queued

### Execution phases: handler space vs. render space

Updater functions execute in render space, not handler space, and must be pure mathematical transforms.

Compare these two click handlers. Both increase `count` by one and print a message to the Console, but look at where the `console.log` line sits in each one:

```jsx title="Logging inside the updater function vs. logging inside the click handler"
function handleImpure() {
  setCount(c => {
    ~console.log('adding');~ // **WRONG:** inside the updater -> React decides when it runs, and runs it twice in StrictMode!
    return c + 1;
  });
}

function handleClean() {
  ~console.log('adding');~ // Inside the click handler -> runs ONCE on the click!
  ~setCount(c => c + 1);~ // Pure updater -> only calculates and returns c + 1
}
```

Look closely at the two confusions that trip developers up here:
1. Because the updater function sits inside `handleImpure`, it looks like click-handler code that runs right away, but it is NOT the same thing! Your click handler only hands the updater function to React, and React decides when to call it. React calls most updaters during the next render, under the exact same purity rules as your component body (as seen in Lesson 14). When nothing else waits in the queue yet, React may even call the first updater once right inside the setter call to check whether state changes. Think of an updater function as a recipe card handed to the kitchen. The cook decides when to cook it. In `<StrictMode>` development, the cook cooks every recipe card twice to check the calculation and throws one dish away. Because of that, the recipe card must only calculate and return the next state, and never call another setter or log messages.
2. When a button handler updates a state variable only once per click, passing a plain value and passing an updater give the exact same result! React always finishes rendering the current click before the next click begins, so a single update in a click handler never starts with an old value. You only need an updater function when more than one update of the same state variable can be queued before the next render:

```tree caption="Code written inside an updater function vs. code written inside the event handler outside the setter."
Where a line of code runs when you click a button
- !Inside the updater function | **React decides** when it runs, mostly **during the next render** | Must be **100% pure**: StrictMode calls it **twice** in development and keeps **one** result
- +Inside the event handler | Runs **once at the moment of the click** | Event handlers do **not** need to be pure and are **never called twice** by StrictMode
```

### Side effects in render space: the StrictMode double-invocation trap

The console reports duplicate activity: Chrome logs *"Point for Home"* six times for a single three-point click, even though the scoreboard correctly displays `Home: 3`.

Let us watch what happens in our basketball scoreboard when a developer puts a `console.log` line inside the updater function of `addPoint`:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    setScore(s => {
      ~console.log('Point for Home');~ // **WRONG:** side effect inside an updater function!
      return s + 1;
    });
  }
```

In development, our startup file wraps the app in `<StrictMode>`.

**StrictMode runs updaters twice but commits state once: duplicate logs expose impure side effects without altering the final committed screen state.**

Watch what happens when the scorekeeper clicks `+3` once from `Home: 0`:
1. In Chrome's Console panel, the message does not print three times. Because `<StrictMode>` calls each updater function twice in development, the log prints six times for a single `+3` click!
2. Startled by seeing six Console messages, the developer looks at the scoreboard expecting to see `Home: 6`.
3. Yet the scoreboard on the page reads **`Home: 3`**, the right score!

### StrictMode invariant verification: discarded runs and side effect detection

React verifies render purity by invoking updaters twice and discarding the second result; moving side effects into the event handler restores clean, single-execution behavior.

**React verifies render purity by invoking updaters twice and discarding the second result; moving side effects into the event handler restores clean, single-execution behavior.**

Follow what happens during that development render:
1. When the scorekeeper clicks the three-point button, the handler hands three updater functions to the score setter. Nothing else waits in the score queue yet. React calls the first updater once right away, with `s` set to zero, to check whether the score will change. Then React queues all three updaters, and `handleThree` returns.
2. During the next render of `Scoreboard`, React walks the queue. Under `<StrictMode>`, React calls the first updater one more time, and it calls the second and third updaters twice each. So every updater runs twice, and both runs get the same pending state `s`.
3. Both runs call `console.log`, printing the log message twice for each queued updater.
4. For the state itself, React keeps only one return value of each pair and throws the other one away! So the running result still steps from zero to one, then two, and finally `3`. In a production build, React calls each updater only once, and the Console shows the message three times.

### Architectural separation: pure updaters in state, impure effects in handlers

Only component functions, initializer functions, and updater functions must be pure. Event handlers and the helpers they call run on the click, not during rendering, so `<StrictMode>` never calls an event handler twice!

To log once per point, move `console.log` out of the updater function and place it directly inside `addPoint` above the setter:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~console.log('Point for Home');~ // 1. Runs in the handler on the click: logged ONCE per addPoint call
    ~setScore(s => s + 1);~ // 2. Pure updater function: only calculates and returns s + 1
  }
```

Save the file and click `+3` once from `Home: 0`. Now the Console prints the message three times, once for each `addPoint` call, and the scoreboard shows `Home: 3`:

::: row caption="Putting console.log inside the updater function under StrictMode vs. keeping the updater pure and logging inside addPoint."
::: col title="Impure Updater: console.log Inside s => { ... }" tag="StrictMode calls each updater twice" tone=bad
```page size=mini
heading: Scoreboard
line: Home: 3 | good
line: Last play: Three-pointer
row: +1 ; +2 ; +3
```
```devconsole
+ Point for Home | Scoreboard.jsx:9
+ Point for Home | Scoreboard.jsx:9
+ Point for Home | Scoreboard.jsx:9
+ Point for Home | Scoreboard.jsx:9
+ Point for Home | Scoreboard.jsx:9
+ Point for Home | Scoreboard.jsx:9
```
`<StrictMode>` runs each updater twice and keeps only one of its two return values, duplicating the log while keeping `Home: 3`.
:::
::: col title="Pure Updater: console.log Inside addPoint" tag="handler runs once per call" tone=good
```page size=mini
heading: Scoreboard
line: Home: 3 | good
line: Last play: Three-pointer | good
row: +1 ; +2 ; +3
```
```devconsole
+ Point for Home | Scoreboard.jsx:8
+ Point for Home | Scoreboard.jsx:8
+ Point for Home | Scoreboard.jsx:8
```
The log runs inside `addPoint` during the click, and the pure updater function only calculates the next score.
:::
:::

### Decision framework: when to use direct values, local buffering, or updaters

Here is the four-part decision framework for choosing between direct values, local buffering, and updater functions:
1. **Multiple updates of the same state before the next render**: Whenever one event queues more than one update for the same state variable, use an updater function so every update calculates from the latest pending state. That includes calling helpers like `addPoint` several times in one click, or updating a state variable after an asynchronous `await` delay.
2. **Only one update of that state in the click**: When a click handler updates a state variable only once, passing a plain value like `score + 1` works cleanly without any bug. React always updates the state before the next intentional user click can run. Teams that prefer one consistent style often write an updater every time state builds on its previous value, and doing so is completely fine.
3. **The running handler itself needs the new value right away**: Remember that neither a plain value nor an updater function changes `score` inside the running handler! When your click handler needs to pass the new number to `alert` or a log right away, save `score + 3` in a local variable first.
4. **One state variable depends on a different state variable**: Never try to call one state setter from inside another state variable's updater function. When one state update depends on the value of a different state variable, combine those states into one object managed by a reducer (as seen in Lesson 29).

```tree caption="How to choose the right state update tool for each situation in React."
Which state update pattern fits your handler?
- +Several updates of the SAME state before the next render | +**DO** use an updater function | Each queued update receives the **latest pending state** s
- +One update of that state per click | +**DO** pass the next value directly, or use an updater by team habit | React finishes the render **before the next click** starts
- +Running handler must read the new number right now | +**DO** save const nextScore = score + 3 first | Gives the running handler the new value immediately
- !Next state depends on a DIFFERENT state variable | ~Do **NOT** call setters inside an updater | Keep updaters pure; combine related states in a reducer
```

> [!PRINCIPLE]
> **Principle 5: Pure Updaters: Keep Updaters Pure and Use Them When Updates Stack Up**
>
> *React calls updater functions mostly during rendering, so they must be pure. Use an updater whenever multiple updates of the same state can be queued before the next render.*
>
> Your click only hands an updater function to React. React decides when to call it, mostly during the next render, and calls each updater twice in StrictMode development while keeping only one result. Because of that, an updater must only calculate and return the next value from its parameter. Never put Console logs, other state setters, or outside mutations inside an updater. Put logs and side effects inside the event handler, and reach for an updater whenever multiple updates of the same state can queue up.
>
> **DO THIS:**
> ```jsx
> function addPoint() {
>   ~console.log('Point for Home');~ // 1. Side effects and logs belong in the event handler
>   ~setScore(s => s + 1);~ // 2. Updater is pure: only returns s + 1
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function addPoint() {
>   setScore(s => {
>     ~console.log('Point for Home');~ // **WRONG:** React decides when it runs, and it prints twice per update in StrictMode!
>     return s + 1;
>   });
> }
> ```

---

## Architectural Synthesis: The Complete Queue Reconciliation Lifecycle

### The unified project files

Here are all three JavaScript files of our finished basketball scoreboard project working together.

First, our startup file mounts the application inside `<StrictMode>`:

```jsx title="src/main.jsx" startLine="1"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  ~<StrictMode>~ {/* Principle 5: calls components and updaters twice in development to check purity */}
    <App />
  </StrictMode>
);
```

Second, our main application file imports and renders the scoreboard component:

```jsx title="src/App.jsx" startLine="1"
import ~Scoreboard~ from './components/Scoreboard.jsx'; // Imports the Scoreboard component

export default function App() {
  return <Scoreboard />;
}
```

Third, the scoreboard component manages the score and play text, defines both pure score helpers, and connects the three buttons:

```jsx title="src/components/Scoreboard.jsx" startLine="1"
import { useState } from 'react';

export default function Scoreboard() {
  const [score, setScore] = useState(0);
  const [lastPlay, setLastPlay] = useState('Game start');

  function addPoint() {
    ~console.log('Point for Home');~ // Principle 5: log lives in the handler, never inside the updater
    ~setScore(s => s + 1);~ // Principle 3: pure updater continues from the pending state s
  }

  function addTwo() {
    ~setScore(s => s + 2);~ // Principle 4: updater helper composes cleanly in any order
  }

  function handleOne() {
    addPoint();
    ~setLastPlay('Free throw');~ // Principle 1 & 2: single update per click uses a direct value and batches with score
  }

  function handleTwo() {
    addTwo();
    setLastPlay('Two-pointer');
  }

  function handleThree() {
    ~addPoint();~ // Principle 4: queues s => s + 1 first
    ~addTwo();~ // Principle 4: queues s => s + 2 second -> steps 0 -> 1 -> 3!
    setLastPlay('Three-pointer');
  }

  return (
    <section>
      <h1>Scoreboard</h1>
      <p className="score">Home: {score}</p>
      <p className="last-play">Last play: {lastPlay}</p>
      <button onClick={handleOne}>+1</button>
      <button onClick={handleTwo}>+2</button>
      <button onClick={handleThree}>+3</button>
    </section>
  );
}
```

### End-to-end execution flow: from click dispatcher to synchronized DOM commit

When the scorekeeper clicks the three-point button from `Home: 0`, React runs every line of `handleThree` first. First, `addPoint` logs once to the Console and queues its one-point updater. Second, `addTwo` queues its two-point updater, and `setLastPlay` queues the new play text. Once `handleThree` returns, React renders `Scoreboard` once, walks the score queue from zero to one to three, and commits the finished board to the DOM:

```page caption="The finished scoreboard after clicking +3 once from Home: 0."
heading: Scoreboard
line: Home: 3 | good
line: Last play: Three-pointer | good
row: +1 ; +2 ; +3
log: Point for Home
```

Follow the three stages of that single `+3` click from the handler to the DOM:

```tree dir=right caption="The complete lifecycle of one +3 click on the finished Scoreboard component."
One click on +3 starting from Home: 0
- +1. Run handleThree to the end | Logs Point for Home once; queues s => s + 1 and s => s + 2 for score; queues Three-pointer for lastPlay
- +2. Walk both queues in one render | score queue steps from 0 to 1 to **3**; lastPlay queue replaces with **Three-pointer**
- +3. Commit once to the DOM | Updates the page to **Home: 3** and **Last play: Three-pointer** at the same moment
```

| Aspect | The Naive Expectation | The React Rule |
| :--- | :--- | :--- |
| **When setter calls update the screen** | Expects each setter line to re-render the screen immediately before the next line of the handler runs | React **batches** all setter calls in one handler and renders **once** after the entire handler finishes |
| **Separate user clicks** | Wonders if fast button clicks get merged into one batch | React **never** batches across separate intentional clicks; each click renders before the next click runs |
| **Passing a value three times** | Expects three `score + 1` setter calls in one handler to add three points | Each value call reads the **same snapshot** and queues **replace with that number**, so three calls add **one** |
| **Passing an updater function** | Treats `s => s + 1` as just a longer spelling of `score + 1` | React queues the function and calls it during the next render with the **pending state** `s`, so three calls add **three** |
| **Mixing values and updaters** | Assumes adding two and adding one gives the same total in either order | React walks the queue in order: an updater builds on the running result, while a plain value **replaces** and wipes out earlier slips |
| **Side effects inside updaters** | Puts `console.log` or another setter inside `s => { ... }`, thinking it runs once on the click | React decides when updaters run, mostly **during render**, so they must be **pure**; `<StrictMode>` calls each updater twice in development and discards one result |

---

## For the Interview

> **The Interview Question:** How does React queue multiple state updates, and when do you need an updater function?

### How to Answer Clearly in 30 Seconds

"Calling a state setter does not change the state variable in the running render; it adds an update to React's queue and requests a new render. First, React uses **batching**: it waits until all code in the event handler finishes before processing queued updates in a single render pass. That keeps the app fast and prevents half-finished screens when several state variables change together, while each separate user click is still handled on its own.

Second, what happens inside the queue depends on what we pass to the setter:
1. **Passing a next value directly**, like `count + 1`, adds a **replacement** slip to the queue. Every line in a handler reads the same render snapshot, so calling `setCount` with `count + 1` three times queues the same replacement number three times. The count only goes up by one.
2. **Passing an updater function**, like `c => c + 1`, adds the function itself to the queue. During the next render, React walks the queue in order and calls each updater with the **pending state** from the step before it, so three calls add three. If a plain value and an updater are mixed in the same queue, their order matters because a plain value overwrites whatever running result came before it.
3. **Purity and when to use one**: React decides when updater functions run, mostly during rendering. `<StrictMode>` calls each one twice in development and discards one result, so updaters must be pure calculations with no side effects. You need an updater whenever the next state depends on the previous state and multiple updates of that same state can be queued before the next render. For a single update per click, a plain value works fine because React renders before the next click, while cross-state calculations belong in a reducer."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"When `number` starts at `0`, what does a click show after calling `setNumber` with `number + 5` and then `n => n + 1`, or in reverse order?"**
   - When `number + 5` comes **first** and `n => n + 1` comes **second**, the screen shows **`6`**. In the render where `number` is `0`, the first call queues *"replace with 5,"* and the second call queues `n => n + 1`. During the next render, React sets the running result to `5` and then calls the updater with `n` equal to `5`, returning `6`.
   - When we **swap** the two lines so `n => n + 1` comes **first** and `number + 5` comes **second**, the screen shows **`5`**. The updater runs first and turns `0` into `1`, and then the value slip *"replace with 5"* ignores that `1` and overwrites the running result with `5`. Similarly, placing a plain value call with `42` at the very end after updaters overwrites everything before it and renders `42`.

2. **"Why must an updater function be pure, and why did a `console.log` inside my updater print twice in development?"**
   - Even though an updater function is written inside an event handler, it is not event handler code. React decides when to call it. React calls most updaters **during the next render**, and it may call the first one once right inside the setter call to check whether the state will change. Because rendering must be pure, an updater must only calculate and return the next state from its parameter, without mutating outside variables, calling setters, or logging. In development under `<StrictMode>`, React calls each updater function **twice** with the same pending state. It keeps only one of the two return values, and the extra call helps expose side effects. Event handlers themselves do not need to be pure and are never called twice by `<StrictMode>`, so logs and side effects belong in the handler.

3. **"Should I always pass an updater function to every state setter, or only in specific cases?"**
   - You do not have to use an updater on every setter call. For intentional user clicks, React always finishes rendering the current click before the next click runs, so a single update per click works cleanly with `count + 1`.
   - You **must** use an updater whenever the next state builds on the previous state and **multiple updates of that same state** can queue up before the next render. That happens when a handler calls a helper function several times in one click, or updates state after an asynchronous wait while other updates may have occurred. Writing an updater every time state builds on its own previous value is also a fine team convention, while state calculated from another variable belongs in a reducer.

```tree dir=right caption="Interview comparison: passing a next value directly vs. passing a pure updater function to a state setter."
Two kinds of entries in React's state update queue
- +Direct value | Calculated **now** from this render snapshot | Queues **replace with that value**, ignoring earlier slips; fits **one update per click**
- +Updater function | Pure function called by React, mostly **during the next render** | Receives the **pending state** from the slip before it; needed when **multiple updates of the same state** are queued
```
