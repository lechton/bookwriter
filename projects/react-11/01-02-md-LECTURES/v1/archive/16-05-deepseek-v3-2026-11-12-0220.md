# Lecture 16: Batching and Updater Functions

*You call the setter with `score + 1` three times in one click, and the score goes up by one. Where did the other two points go?*

> INTERVIEW QUESTION | ❱ CORE | How does React queue multiple state updates, and when do you need an updater function?

---

## State Setter `setScore` with `score + 1` vs. Updater Function with `s => s + 1`: the plain value replaces, the updater continues

### The Four Ideas This Lesson Stands On

**State and its setter.** In plain JavaScript, you can start a score variable at zero, set it to 3, and the job is done. React does not work that way. A value that must survive between renders lives in state, and state comes as a pair: the value and the setter that changes it. For the score, the pair is `score` and `setScore`. You declare both together, in one line:

```jsx
const [score, setScore] = useState(0);
```

You read `score` during a render, and you call `setScore` when the score changes. You never write `score = 3` yourself. Here is the catch: calling the setter with `score + 1` does not change `score` on that line. Not on the next line either. React calls your component again, and only in that new render does `score` hold the new value. (Lesson 12)

**A render.** A render is one full call of your component function. You never call the component yourself. React calls it, runs the body from the first line to the last, and reads the JSX it returns. React renders on the first load of the page, again after every state change, and again whenever the parent renders. Every line in the body runs again on every render. A `console.log` in the body prints each time. That is not a bug. It is what a render is. (Lesson 13)

**A snapshot.** During one render, the values are fixed. When you call `setScore`, the `score` inside the handler that is already running does not change. Not on that line. Not on any line after it. The new value appears only in the next render, when React calls the component again. That fixed copy of the state is the snapshot. (Lesson 15)

**A pure function.** A pure function calculates its result from its inputs and changes nothing outside itself. A function that takes a number and returns double that number is pure. A function that writes to a global variable, logs to the Console, or calls a setter is not pure. This matters later because React may call an updater function more than once. (Lesson 14)

### The Three Calls on the Scoreboard

In plain JavaScript, adding 1 to a variable three times raises it by 3. React state setters do not work that way.

Here is the scoreboard. It shows the home team's score and the last play. The score starts at 0. The scorekeeper has a `+3` button. The button's `onClick` points at a function named `handleThree`. That function is an event handler: the code attached to a button that runs when someone clicks it. Inside `handleThree`, the developer passes `score + 1` to the setter three times, once per point, and then sets the last play. The code looks like this:

```jsx
function handleThree() {
  ~setScore(score + 1);~ // score is 0: queues "replace with 1"
  ~setScore(score + 1);~ // score is still 0: queues "replace with 1" again
  ~setScore(score + 1);~ // score is still 0: queues "replace with 1" again
  setLastPlay('Three-pointer');
}
```

The scorekeeper clicks `+3`. What do you expect the screen to show? Most people expect 3. The screen shows 1. The play line says Three-pointer, but the score says Home: 1. React's setters are more literal-minded than plain JavaScript. Where did the other two points go?

### What React Does with the Queue

React does not update the screen after the first setter call, then again after the second, then again after the third. It lets the whole event handler run to its last line. Every setter call goes into a waiting line. React calls that waiting line the update queue.

When the handler finishes, React walks the queue from top to bottom, works out the final state, and renders the component once. React's docs call this batching. The purpose is simple: the user never sees a half-finished screen, such as a new score next to an old play line. And React never batches across two separate clicks. The first click finishes its render before the second click runs.

```tree dir=right caption="One click on +3: the handler fills the queue, React walks it, and the page renders once."
One click on +3
- +1. The handler runs to its last line | Three slips go into the queue | The screen does not change yet
- +2. React walks the queue | It reads the slips from top to bottom | It works out one final score
- +3. React renders once | It calls the component one time | The page shows the finished screen
```

Now, the queue is a line of updates, not a line of screen changes. Nothing reaches the screen while the handler is still running. That is why the score stays at 0 during the click, even after the first setter call. The screen catches up only at the end.

### Two Kinds of Slip in the Queue

What React does with each slip depends on what you passed to the setter. There are two possibilities, and they look almost the same in code.

The first possibility is a plain value. Passing `score + 1` hands React a finished number. JavaScript calculates `score + 1` before React sees anything. At the start of the click, `score` is 0, so the calculation is `0 + 1`, and the number is 1. React receives the number 1. It puts a slip in the queue that says: replace the score with 1.

The second possibility is an updater function. Passing an updater function hands React a function, not a number. The function says: take whatever the score is by now, and add 1. React puts the function itself in the queue. It does not call the function yet. It calls it later, when it walks the queue.

This is the detail that makes the difference. A plain value is calculated once, from the snapshot. An updater function is calculated later, from the pending state.

Now look at the three calls again. All three pass `score + 1`. All three run inside the same click, and all three read the same snapshot, `score = 0`. So all three calculate zero plus one, which is one. All three put the same slip in the queue: replace with 1. React walks the queue, sees the same instruction three times, and the final score is 1. The other two points were never calculated. They were overwritten before they existed.

If the developer had passed an updater function instead, the three calls would put three functions in the queue. React would call the first with 0 and get 1. It would call the second with 1 and get 2. It would call the third with 2 and get 3. The screen would show 3. The difference is not the number of calls. It is what each call puts in the queue.

### The Same Three Calls, Side by Side

Here are the two handlers side by side. Both call the setter three times. Both start from 0. Only one of them adds three.

```jsx
function handleValueThree() {
  ~setScore(score + 1);~ // score is 0, so this queues "replace with 1"
  ~setScore(score + 1);~ // score is still 0, so this queues "replace with 1" again
  ~setScore(score + 1);~ // score is still 0, so this queues "replace with 1" again
}

function handleUpdaterThree() {
  ~setScore(s => s + 1);~ // React will call this with 0 and get 1
  ~setScore(s => s + 1);~ // React will call this with 1 and get 2
  ~setScore(s => s + 1);~ // React will call this with 2 and get 3
}
```

In the first handler, the queue holds three copies of "replace with 1", and the screen shows 1. In the second handler, the queue holds three functions, and the screen shows 3. Read the comments from top to bottom. Every line in the first handler reads the same `score`, because the snapshot does not change inside the handler. In the second handler, each line hands React a function, and React calls the functions one after the other, passing the result of each one to the next.

### The Two Rules from React's Docs

React's docs state two rules for the queue.

The first rule is about timing: React waits until the whole event handler has finished before processing the updates. In the docs' words, "React waits until all code in the event handlers has run before processing your state updates." That is why the screen does not change between the three setter calls. The handler is still running.

The second rule is about order: each updater function receives the result of the one before it. In the docs' words, "React queues this function to be processed after all the other code in the event handler has run." When React walks the queue, it calls the first updater with the current pending state. It takes the return value, and passes it to the next updater. That value is called the pending state because the screen has not shown it yet. It is waiting for the render.

**Beware! Three calls with `score + 1` do not add three. They hand React the same number three times.** The bug is silent. The Console shows no error. The score is simply wrong.

### The Lift

The three calls are easier to hold in your head if you picture a lift.

Imagine a lift in a building. The doors are open, and passengers are standing in front of the panel. The indicator above the door shows the floor the lift has reached. The panel has a button for each floor. A passenger presses a button, and the lift does not move while the doors are open. It waits. When the doors close, it reads the buttons and travels.

Now add one button that does not exist in a real lift. It is marked "one floor up." It does not say which floor to reach. It says: move one floor up from wherever the lift will be when it starts.

The plain value is a floor button marked 1. You press it three times. Each press says the same thing: go to floor 1. The lift goes to floor 1, not floor 3. The updater function is the imaginary one-floor-up button. You press it three times. The first press moves the lift from 0 to 1. The second press moves it from 1 to 2. The third press moves it from 2 to 3. The lift rises three floors.

Real lifts have no one-floor-up button. The button is imaginary, and it is exactly the button this lesson needs. The fixed button names a destination. The imaginary button describes a movement. That is the difference between passing a plain value and passing an updater function.

One honest limit: real lifts serve floors in the order of travel, not in the order the buttons were pressed. The lesson uses the lift only for the difference between a fixed destination and a relative movement. It does not claim anything about the lift's route.

### The Rule of Thumb

At the end of the day, a senior developer follows three rules.

**First, when one click updates the same state more than once, pass an updater function.** If a button calls the setter three times, pass an updater function three times, not `score + 1` three times. The two forms look like they do the same job. Both say "add one." They are NOT the same. The plain value calculates `0 + 1` from the snapshot and queues "replace with 1" three times. The updater function queues three functions, and each one builds on the result before it. The plain value gives 1. The updater gives 3. If you skip this rule, the screen shows 1 while the handler says "add three." The Console shows no error. The user sees the wrong score.

**Second, never mix a plain value after an updater function for the same state.** Suppose a handler passes an updater function first and passes `score + 2` second. The updater queues a function. The plain value queues a replacement with 2, because `score` is still 0. React walks the queue in order. The updater runs first and produces 1. Then the plain value runs and replaces the pending 1 with 2. The final score is 2, not 3. The plain value ignores the updater's work. If helpers for the same state can run in the same click, write all of them with updater functions. If you skip this rule, the order of the lines changes the result. The same click can produce 2 or 3 depending on which helper runs last.

**Third, keep updater functions pure, and put `console.log` outside the setter.** An updater function is written inside your click handler, so it looks like handler code. It is not. React runs updater functions during rendering, and in development `<StrictMode>` calls each updater twice to check that it is pure. If you put `console.log` inside the updater, the Console prints twice for one update. If you put a network call or another setter inside it, the side effect runs twice. Keep the updater to calculation only. Put the log, the network call, and the other setter in the event handler, above the setter. If you skip this rule, the logs lie about how many times the updater ran, and side effects fire twice in development.

These three rules are short, but they are not the whole lesson. The rest of the chapter builds the scoreboard file and walks through the bug line by line. You will see the wrong screen, the queue, and the fix in one place.

### How the scoreboard project files are organized

Our project uses four files. At the root sits the HTML page. Inside the source folder, the startup file mounts the app inside `<StrictMode>`, the main application file renders the scoreboard, and the scoreboard component lives inside the components subfolder:

```files title="scoreboard-app: File Explorer" caption="How our scoreboard project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `StrictMode` and `App` from `./App.jsx` and mounts into `#root`
  App.jsx | parent | Exports `App` as default and imports `Scoreboard` from `./components/Scoreboard.jsx`
  components/
    Scoreboard.jsx | state | Exports `Scoreboard` as default and manages `score` and `lastPlay` with `useState`
```

### Five Principles of Batching and Updater Functions

**PRINCIPLES:** When an event handler calls a state setter, React does not stop the handler and redraw the screen right away. Instead, React adds each update to a queue and processes the whole queue in one render after the handler finishes. Following what goes into that queue and when React runs it gives us five practical rules.

1. **Principle 1: React Batches All Setter Calls in One Handler into One Render.** React runs every line of an event handler first, even code written after the setter calls, and then renders the page once with all state variables updated together. Each separate user click is handled on its own.
2. **Principle 2: A Value Entry Replaces the Queued State.** Passing a calculated value to a setter adds a replacement slip to the queue. Every line in the handler reads the same snapshot, so calling that setter three times queues the same replacement number three times.
3. **Principle 3: An Updater Function Continues from the Pending State.** Passing a function to a setter adds the function itself to the queue. During the next render, React calls each queued updater in order and passes it the pending state from the step before it, so three updater calls add three.
4. **Principle 4: React Walks the Queue in Order.** When a queue holds both value replacements and updater functions for the same state variable, React walks them in the exact order they were called. An updater builds on the running result, whereas a value replacement ignores and wipes out every update queued before it.
5. **Principle 5: Updaters Run During Render and Must Be Pure.** React decides when to call updater functions, mostly during the next render, and calls each one twice in Strict Mode during development. Every updater must be pure with zero side effects or logs inside it, and you need one whenever several updates of the same state stack up.

Here is the complete overview of all five principles before we walk through each one:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Batching: One Render After the Whole Handler Finishes** | Developers expect the screen to change between two setter lines or while a pop-up is still open. Interviewers ask why updating two state variables does not trigger two renders. | React runs the entire event handler first, batches all its setter calls together, and updates the screen in one single render at the end. |
| **Principle 2** | **Value Updates Replace: Three Snapshot Calls Add One** | Calling a one-point helper three times in one click only raises the score by one point, with zero Console warnings. | Passing a value to a setter queues a replacement. Three calls from the same snapshot queue the same number three times. |
| **Principle 3** | **Updater Functions Continue from the Pending State** | An updater function lets multiple updates of the same state in one event build on each other. Reading the outer snapshot name inside the updater breaks the fix. | Pass a function to the setter so React calls it during the next render with the pending state from the update before it. |
| **Principle 4** | **Queue Order: A Value Placed After Updaters Wipes Them Out** | Mixing a value helper and an updater helper for the same state gives different totals depending on which line runs first. | React walks the queue from top to bottom. An updater adds to the running result, while a plain value replaces the running result and ignores earlier slips. |
| **Principle 5** | **Keep Updaters Pure and Use Them When Updates Stack Up** | Putting a Console log or side effect inside an updater runs twice per update in Strict Mode development. Interviewers ask whether every setter needs an updater. | Keep updaters pure because React decides when they run, mostly during render. Use an updater when several updates of the same state can be queued before the next render. |

---

## 1. Principle 1: React Runs the Whole Handler First, Then Renders Once

### Why calling two setters in one click does not cause two renders

Before we build the scoreboard, look at a small component with two state variables. The counter `count` starts at zero, and `label` starts with the text "Not clicked." The click handler calls both setters and then opens a browser alert on its last line:

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

Two things surprise beginners when they click that button.

- **Two setter lines look like two screen updates. They are not.** It may look like two screen updates, but it is NOT two renders! React waits until `handleClick` finishes and combines both state changes into one single render.
- **While the alert is open, the button behind it still says `Not clicked: 0`, even though both setters have already run.** It looks as if the setters failed or got stuck, but they did NOT fail! The alert pauses `handleClick` on line 3, so the handler has not finished. React waits until you click OK and the handler returns. The lift is still on the ground floor with its doors open: the buttons are pressed, but the trip has not started.

```tree dir=right caption="What happens during handleClick while alert is open vs. after the handler finishes."
One click on `CounterAlert`
- +While `alert` is open [lines 1 and 2 have run, line 3 is paused] | Both updates sit waiting in React's queues | Screen behind the pop-up **still shows `Not clicked: 0`**
- +After clicking `OK` [`handleClick` finishes its last line] | React batches both updates into **one render** | Screen updates to **`Clicked: 1` all at once**
```

### Building the scoreboard with two state variables in one click

Now let us build the basketball scoreboard and watch this behavior on the page.

First, the main application file imports the scoreboard component and renders its tag:

```jsx title="src/App.jsx" startLine="1"
import ~Scoreboard~ from './components/Scoreboard.jsx'; // 1. Import the Scoreboard component

export default function App() {
  return <Scoreboard />;
}
```

Next, the scoreboard file stores the score and the latest play in state. Its three-point handler updates both values and opens a pop-up:

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

Below the handler, the component returns the heading, the two text lines, and the three-point button:

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

Watch what happens when the scorekeeper clicks `+3`.

1. Before the click, the board shows zero points and the Game start line.
2. The scorekeeper clicks the three-point button. The pop-up saying "Three points for Home!" opens right away.
3. Behind the pop-up, the board still shows zero points and the Game start line. A beginner often thinks the setters are broken and starts moving the alert line around.
4. The scorekeeper clicks OK. That lets `handleThree` finish, and the board changes to three points and the Three-pointer line at the same moment.

### Why React waits for the handler to return before rendering

Look at `handleThree`. Nothing in our code says "now call `Scoreboard` again and redraw the page." Who starts the render, and why did it wait for the pop-up?

React starts the render itself, and it waits for the running event handler to return first. Follow the click step by step.

1. Clicking the three-point button starts `handleThree` in the render where the score is zero and the play text says Game start.
2. Line 1 calls `setScore` with `0 + 3`. React places that update in the queue for `score` and leaves the screen alone.
3. Line 2 calls `setLastPlay` with `'Three-pointer'`. React places that update in the queue for `lastPlay` and still leaves the screen alone.
4. Line 3 calls `alert`. The browser opens the pop-up and pauses JavaScript on line 3 until the user clicks OK.
5. When the user clicks OK, `handleThree` returns. React sees that the handler is done, calls `Scoreboard` once with the new values, and commits both lines to the DOM together.

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

### Why React batches inside one click, and never across separate clicks

Waiting until the end of the event handler and then processing every setter call in one render is called batching. It solves two problems at once.

- **The app runs faster.** Even if one click updates several state variables across several components, React re-renders once at the end instead of re-rendering after every setter call.
- **The user never sees a half-finished screen.** Without batching, `setScore` before `setLastPlay` would briefly show the new score next to the old play text. Batching puts both updated lines on the screen in the same render.

Does React ever batch two separate clicks? No. React never batches across separate intentional user events. Every click is handled on its own, and React finishes the first click's render before the second click runs. If the first click disables a submit button, that button is already disabled before the second click can submit the form again. When code must force an earlier DOM update inside a handler, React provides a helper named `flushSync`, which a later lesson covers.

```tree caption="How React batches multiple setter calls inside one click vs. how it handles two separate user clicks."
What React batches vs. what React keeps separate
- +Multiple setter calls in ONE click [`setScore` and `setLastPlay` in `handleThree`] | React waits until the **entire handler finishes** | Processes both updates in **1 single render** with **0 half-finished screens**
- +Two SEPARATE user clicks [1st click, then 2nd click] | React **never** batches across separate intentional clicks | The **1st click finishes its render** before the **2nd click** runs
```

> [!PRINCIPLE]
> **Principle 1: Batching: React Runs the Whole Handler First, Then Renders Once**
>
> *React waits until every line of an event handler has finished before processing its state updates in one single render, and handles each separate click on its own.*
>
> Calling a state setter does not redraw the screen on that line. It only places an update into React's queue while the event handler keeps running. Even if you call several setters for different state variables and run more code after them, the screen stays untouched until the handler returns. Only then does React batch all the queued updates into one render, so the page updates once without flashing a half-finished mix of old and new values.
>
> **DO THIS:**
> ```jsx
> function handleThree() {
>   ~setScore(score + 3);~ // 1. Queued for the next render
>   ~setLastPlay('Three-pointer');~ // 2. Batched with setScore into ONE render after handleThree finishes
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   setScore(score + 3);
>   setLastPlay('Three-pointer');
>   ~alert('Three points for Home!');~ // **WRONG:** expecting the screen behind alert to show 3 before handleThree finishes!
> }
> ```

---

## 2. Principle 2: A Plain Value Replaces the State

### Why three lines with `number + 1` pass the same number three times

Now suppose one event handler calls the same state setter three times with a calculated value. `number` starts at `0`, and the button handler runs these three lines:

```jsx title="What you write: three calls with number + 1"
const [number, setNumber] = useState(0);

function handleClick() {
  ~setNumber(number + 1);~ // 1st call in this render where number is 0
  ~setNumber(number + 1);~ // 2nd call in the same render where number is STILL 0
  ~setNumber(number + 1);~ // 3rd call in the same render where number is STILL 0
}
```

Because `number` is locked at zero for the whole render snapshot, substitute `0` on each line:

```jsx title="What JavaScript actually passes to setNumber when number is 0"
function handleClick() {
  ~setNumber(1);~ // 1st slip added to the queue: "replace number with 1"
  ~setNumber(1);~ // 2nd slip added to the queue: "replace number with 1"
  ~setNumber(1);~ // 3rd slip added to the queue: "replace number with 1"
}
```

Look closely at those two blocks.

- **Writing `number + 1` inside `setNumber` looks like an instruction to add one. It is not.** JavaScript calculates `0 + 1` before calling `setNumber`, so React never sees a plus sign. React only receives the finished number `1`.
- **In the render where `number` is `0`, passing `number + 1` three times and passing `1` three times are the exact same thing.** Any non-function value handed to a setter adds a slip that says "replace with that value," ignoring earlier slips. After all three lines run, the queue holds three identical slips that all say "replace with `1`." When React renders after the handler, the screen changes from `0` to `1`.

```tree dir=right caption="How three calls with number + 1 in the render where number is 0 queue three identical replacement slips."
One click when `number` is `0`
- +1. First call [`0 + 1`] | Hands `1` to `setNumber` | Queue slip 1: **replace with `1`**
- +2. Second call [`0 + 1`] | Reads the **same snapshot `0`** and hands `1` to `setNumber` | Queue slip 2: **replace with `1`**
- +3. Third call [`0 + 1`] | Reads the **same snapshot `0`** and hands `1` to `setNumber` | Queue slip 3: **replace with `1`** -> next render shows **`1`!**
```

### Mistake: Calling a value-based helper three times in one click

This trap appears in the basketball scoreboard as soon as the developer shares one helper between three buttons. The pop-up from Principle 1 is gone. The free-throw button, the two-point button, and the three-point button all call the same `addPoint` helper:

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

Below the free-throw handler, the two-point handler calls `addPoint` twice, and the three-point handler calls it three times while logging the score after each call:

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

Finally, the component renders the heading, the two text lines, and all three buttons:

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

Watch what happens when the scorekeeper tests the three buttons.

1. The scorekeeper clicks `+1` for a free throw. `handleOne` calls the helper once, so the board moves to `Home: 1` with the free-throw label. Everything seems to work.
2. With the board at `Home: 1`, a player hits a three-pointer. The scorekeeper clicks `+3`. The play line updates to three-pointer, but the score only rises to `Home: 2` instead of `Home: 4`.
3. The scorekeeper clicks `+2`. The score only rises to `Home: 3` instead of `Home: 5`. Every button on the board adds only one point, and the Console shows zero warnings.
4. After clicking `+3` from a starting score of one, all three log lines print `1`, the score before the click.

### Why three addPoint calls only add one point

The scoreboard file has no queue array in it, only three calls to `addPoint`. Where is the queue, and why did three calls move the score from one to two?

React keeps that update queue internally for `score`. Two rules work together here. First, state as a snapshot keeps `score` fixed during the click. Second, batching waits until all three `addPoint` calls finish before rendering.

Follow the click when `score` is one.

1. Clicking the three-point button starts `handleThree` inside the render snapshot where the score is one.
2. The first `addPoint` call calculates one plus one, passes two to the setter, and logs one. React queues "replace with `2`."
3. A setter never changes the score in the running handler. The second `addPoint` call still reads one, calculates one plus one again, queues a second replacement with two, and logs one.
4. The third `addPoint` call also reads one. It queues a third "replace with `2`" slip and logs one.
5. After `handleThree` finishes, React renders once and walks the queue for the score: replace with two, three times in a row. Every slip sets the score to `2`, so the board shows `Home: 2`.

Saving a local variable such as `nextScore` inside `addPoint` would not fix the helper. Because `addPoint` reads `score` from the component's snapshot each time it runs, all three calls in one click would still calculate two.

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
Three `addPoint` calls in one click when `score` is `1`
- !1st `addPoint` call [`score` is `1`] | Calculates `1 + 1` and passes `2` | Queue slip 1: **replace with `2`**
- !2nd `addPoint` call [`score` is still `1`] | Calculates `1 + 1` again and passes `2` | Queue slip 2: **replace with `2`**, ignoring slip 1
- !3rd `addPoint` call [`score` is still `1`] | Calculates `1 + 1` a 3rd time and passes `2` | Queue slip 3: **replace with `2`** -> renders **`Home: 2`!**
```

> [!PRINCIPLE]
> **Principle 2: Value Updates Replace: Three Snapshot Calls Queue the Same Number**
>
> *Passing a non-function value to a setter queues a replacement, so three calls from the same snapshot queue the same number three times.*
>
> When you pass an addition directly into a state setter, JavaScript calculates that math right away from this render's fixed snapshot. It hands only the finished number to React. Each call tells React to replace the state with that number, ignoring whatever is already waiting in the queue. If a click handler calls that setter three times, all three calls read the same starting number and queue the same replacement. That raises the score by one instead of three.
>
> **DO THIS:**
> ```jsx
> function handleOne() {
>   ~setScore(score + 1);~ // Safe ONLY when this event queues a single update for score
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   setScore(score + 1);
>   setScore(score + 1);
>   ~setScore(score + 1);~ // **WRONG:** all 3 lines read the same score snapshot and queue the same number 3 times!
> }
> ```

---

## 3. Principle 3: An Updater Function Continues from the Pending State

### Why passing a value and passing an updater function are NOT the same thing

How do we tell React "add one to whatever number is already waiting in the queue" instead of "replace the queue with this fixed number"? Instead of passing the calculated number `number + 1`, you pass an updater function to the setter.

Compare both setter calls side by side:

```jsx title="Passing a calculated value vs. passing an updater function"
~setNumber(number + 1);~ // 1. Value update: calculates 0 + 1 right now from the snapshot and queues "replace with 1"
~setNumber(n => n + 1);~ // 2. Updater function: queues the function n => n + 1 so React calls it during the next render!
```

Three distinctions make updater functions clear right away.

- **Passing `number + 1` and passing the arrow function on line 2 are NOT the same thing.** When you call a setter only once per click, both produce the same screen, so they seem to work the same at first. Yet passing `number + 1` calculates a number right now from this render's snapshot and tells React to replace the state. Passing the arrow function hands the function itself to React so it continues from the latest value in the queue during the next render.
- **The parameter `n` inside the arrow function and the state variable `number` outside it are NOT the same thing.** They both hold the count, so they look like the same variable at first. Yet the state variable `number` is frozen at `0` for the whole click handler. During the next render, React fills the parameter `n` with the pending state, the running result from the update right before it.
- **The short arrow function on line 2 is the exact same thing as a full JavaScript function that takes `n` and returns `n + 1`.** Both take the pending state `n` from React and return `n + 1`.

Now look at what happens when one click handler queues three updater functions in a row starting from `0`:

```jsx title="Queueing three updater functions in one click handler"
const [number, setNumber] = useState(0);

function handleClick() {
  ~setNumber(n => n + 1);~ // 1st updater in queue: React passes n = 0 -> returns 1
  ~setNumber(n => n + 1);~ // 2nd updater in queue: React passes n = 1 -> returns 2
  ~setNumber(n => n + 1);~ // 3rd updater in queue: React passes n = 2 -> returns 3
}
```

During the next render, React walks the three queued functions in order and passes the return value of each function as the `n` parameter of the next one:

| Queued Update | Value of `n` Passed by React | Return Value Passed to the Next Step |
| :--- | :--- | :--- |
| **1st updater in queue** | `0`, the starting state from this render | `0 + 1` -> **`1`** |
| **2nd updater in queue** | `1`, the pending state from the 1st updater | `1 + 1` -> **`2`** |
| **3rd updater in queue** | `2`, the pending state from the 2nd updater | `2 + 1` -> **`3`**, stored as the final state |

```tree dir=right caption="How three queued updater functions hand their running result, the pending state, from one step to the next."
React walks three updaters starting from `0`
- +1. First updater [receives `n = 0`] | Adds `1` to `0` | Returns pending state **`1`**
- +2. Second updater [receives `n = 1`] | Takes the **`1` from step 1** and adds `1` | Returns pending state **`2`**
- +3. Third updater [receives `n = 2`] | Takes the **`2` from step 2** and adds `1` | Returns **`3`**, which `useState` gives to the page
```

### Mistake: Writing an updater function that still reads the snapshot variable

Now update `addPoint` in the scoreboard to use an updater function. Watch the easy mistake where the developer writes the arrow parameter `s`, but still writes the outer snapshot variable `score` on the right side:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~setScore(s => score + 1);~ // **WRONG:** ignores parameter s and still reads the frozen snapshot variable score!
  }
```

Save the file and click the three-point button from zero. The scoreboard still rises to `Home: 1` instead of `Home: 3`.

Why did the arrow function not fix the bug? Because `score` on the right side of the arrow is still the component's fixed snapshot variable, `0`. React passed zero, then one, and then two into `s`, but the function body ignored that parameter and returned `0 + 1` all three times.

### Reading the pending state parameter inside the updater function

To make each queued update build on the one before it, the right side of the arrow must calculate its result from the updater's own parameter, `s`:

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

### How React passes the pending state into each updater

Look at `addPoint`. Our code never writes parentheses after the arrow function to call it, and it never passes a number into `s`. Who calls that arrow function, and where does `s` come from?

React calls each updater function during the next render and supplies `s` itself. Follow the click when the scorekeeper clicks `+3` from `Home: 0`.

1. Clicking `+3` runs `handleThree`. Each of the three `addPoint` calls hands the updater function to `setScore` without calling it. React places all three functions in the update queue for `score`.
2. Next, `setLastPlay` queues the new play text, and `handleThree` finishes.
3. React starts the next render by calling `Scoreboard`. Inside `useState`, React walks the queue of three updater functions starting from zero.
4. React calls the first updater with `s` set to zero, and gets back `1`.
5. React calls the second updater with `s` set to that pending state one, and gets back `2`.
6. React calls the third updater with `s` set to that pending state two, and gets back `3`. React stores `3` and commits `Home: 3` and the three-pointer label to the page.

If the scorekeeper then clicks `+2`, the two queued updaters step from three to four and then five, showing `Home: 5`.

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

### Naming the updater parameter and two setter rules

When you write an updater function, React lets you give its parameter any valid JavaScript name. Across React teams and interviews, you will see three common naming styles.

- **The first letters of the state variable**, such as `s` for `score`, or a single letter for any state name.
- **The full state variable name**, repeating `score` as the parameter name. This works because the inner parameter name shadows the outer state variable inside the arrow function.
- **A `prev` prefix**, writing a name such as `prevScore` to show clearly that the parameter holds the state from the step right before this updater.

```jsx title="The three common naming styles for an updater parameter"
~setScore(s => s + 1);~ // 1. First letter of the state variable name
~setScore(score => score + 1);~ // 2. Full state variable name repeated as the parameter
~setScore(prevScore => prevScore + 1);~ // 3. "prev" prefix before the state variable name
```

Keep two more facts about state setters in mind for debugging and interviews.

- **Setter functions return `undefined`.** Calling `setScore` only adds an update to React's queue and returns nothing. Assigning the result of `setScore` to a variable always stores `undefined`.
- **React treats any function passed to a setter as an updater function.** To store a function itself inside state, wrap it in an outer arrow function so React calls the wrapper and stores your function.

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

## 4. Principle 4: React Walks the Queue in Order

### Combining a value update and an updater on the same state: before vs. after

Principle 2 queued only plain values, and Principle 3 queued only updater functions. Can one click handler queue a plain value such as `number + 5` and a one-point updater for the same state?

Yes. Suppose `number` starts at zero. The handler calls the setter with `number + 5` and also calls it with a one-point updater.

When both calls share one handler, there are two ways to order them.

- **Order 1.** The value update `number + 5` comes before the one-point updater. The value update is first in the queue, and the updater is second, at the end.
- **Order 2.** The one-point updater comes before the value update `number + 5`. The updater is first in the queue, and the value update is second, at the end.

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

In everyday math, adding five and then adding one gives the same answer as adding one and then adding five. So Order 1 and Order 2 look like they should produce the same screen, and Order 1 even gives `6`, but they are NOT the same thing.

Why does Order 1 display `6` while Order 2 displays `5`? During the next render, React walks the update queue in order from top to bottom.

1. **In Order 1**, the value update runs first. In this render `number` is zero, so the first slip says "replace with `5`." The running result becomes five. The updater runs second. It receives that running result five as `n`, adds one, and produces `6`.
2. **In Order 2**, the updater runs first. It receives the starting state zero as `n`, adds one, and makes the running result `1`. The value update runs second. Because `number` in this render's snapshot is still zero, its slip says "replace with `5`." A value slip replaces the running result and ignores earlier slips, so it throws away the `1` and leaves `5`.

Now place one more value call, `42`, at the very end after the updater.

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

That table also shows how React views both kinds of slips internally. Passing a plain value such as `5` to a setter is the exact same thing in the queue as passing `n => 5`. Both ignore whatever `n` came before them and return `5`.

```tree caption="How the order of value replacements and updater functions in the queue decides the final state from 0."
Three mixed queues starting from `0`
- +Order 1: Value `number + 5` BEFORE updater [`replace with 5`, then `n => n + 1`] | Slip 1 sets running state to `5`; slip 2 adds `1` to `5` | Renders **`6`**
- !Order 2: Updater BEFORE value `number + 5` [`n => n + 1`, then `replace with 5`] | Slip 1 returns `1`, **then slip 2 overwrites `1` with `5`!** | Renders **`5`**, losing the updater's point
- !Value `42` placed AFTER earlier updates [`replace with 5`, `n => n + 1`, then `replace with 42`] | Slip 3 comes last and **ignores the `6` built above it** | Renders **`42`**
```

### How React's queue loop works in plain JavaScript

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

Look at the two branches inside that `for` loop. When the queue item is a function, React calls `update` with the running `finalState` so it continues from the step before it. When the queue item is any plain value, `finalState = update` overwrites `finalState` completely and forgets every earlier step in the loop.

### Mistake: Mixing a value helper and an updater helper in the same click

This mistake is easy to make in the scoreboard. Suppose the page reloads to zero, and a teammate adds a second helper named `addTwo` for the two-point button using a plain value `score + 2`. When the scorekeeper clicks `+2`, `addTwo` is the only score update in that click, so the two-point button works fine on its own.

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

When the scorekeeper clicks `+3` from zero, the board shows `Home: 3`. Because the value replacement `addTwo` ran before the updater `addPoint`, the bug stays hidden.

Later that afternoon, another developer edits the three-point handler and swaps the two lines so `addPoint` runs before `addTwo`:

```jsx title="src/components/Scoreboard.jsx" startLine="15"
  function handleThree() {
    ~addPoint();~ // Order 2, slip 1: updater s => s + 1 runs first -> turns 0 into 1
    ~addTwo();~ // **WRONG:** Order 2, slip 2: queues "replace with 0 + 2" AFTER addPoint -> wipes out 1 and sets 2!
    setLastPlay('Three-pointer');
  }
```

After reloading the page to zero, the scorekeeper clicks `+3`. The scoreboard shows `Home: 2` instead of `Home: 3`.

### Why addTwo erased the point that addPoint queued before it

Look at the swapped `handleThree`. Nothing in the handler says "subtract the first point." Why did putting `addPoint` before `addTwo` lose a point?

Follow what JavaScript and React do in order when `score` starts at `0`.

1. Calling `addPoint` first adds its one-point updater function as the first slip in the queue.
2. Calling `addTwo` second reads this render's fixed snapshot `score`, which is still zero. It calculates `0 + 2` and adds "replace with `2`" as the second slip.
3. When `handleThree` returns, React walks the queue from zero. The first slip is the updater, which turns zero into `1`. The second slip is "replace with `2`," which ignores the running one and overwrites the score with `2`.

### Writing both score helpers with updater functions

Whenever two helpers can run together in one event for the same state variable, write both helpers with updater functions:

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
>   ~setScore(s => s + 1);~ // 1st slip: takes 0 and returns 1
>   ~setScore(s => s + 2);~ // 2nd slip: takes 1 and returns 3 in either order!
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   setScore(s => s + 1);
>   ~setScore(score + 2);~ // **WRONG:** plain value runs 2nd and overwrites the updater's 1 with 0 + 2!
> }
> ```

---

## 5. Principle 5: Updaters Are Pure, and You Need One When Updates Stack Up

### Why code inside an updater function is not the same as code inside the click handler

Where does an updater function actually run, and can you put a log, another state setter, or an outside change inside it?

Compare these two click handlers. Both increase `count` by one and print a message to the Console, but the `console.log` line sits in a different place in each one:

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

Two confusions trip developers up here.

- **The updater arrow function sits inside `handleImpure`, so it looks like click-handler code that runs at the moment of the click. It is NOT the same thing.** Your click handler only hands the updater function to React, and React decides when to call it. React calls most updaters during the next render, under the same purity rules as your component body. When nothing else waits in the queue yet, React may even call the first updater once right inside the setter call to check whether the state will change. Think of an updater function as a recipe card handed to the kitchen. The cook decides when to cook it. In StrictMode development, the cook cooks every recipe card twice to check the calculation and throws one dish away. The recipe card must only calculate and return the next state, and never call another setter or log messages.
- **A button handler that updates a state variable only once per click gets the exact same result from a plain value and from an updater.** React always finishes rendering the current click before the next click begins, so a single update in a click handler never starts with an old value. You only need an updater function when more than one update of the same state variable can be queued before the next render.

```tree caption="Code written inside an updater function vs. code written inside the event handler outside the setter."
Where a line of code runs when you click a button
- !Inside the updater function [inside `c => { ... }`] | **React decides** when it runs, mostly **during the next render** | Must be **100% pure**: `<StrictMode>` calls it **twice** in development and keeps **one** result
- +Inside the event handler [outside `setCount`] | Runs **once at the moment of the click** | Event handlers do **not** need to be pure and are **never called twice** by `<StrictMode>`
```

### Mistake: Putting console.log or side effects inside an updater function

Watch what happens in the scoreboard when a developer puts a `console.log` line inside the updater function of `addPoint`:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    setScore(s => {
      ~console.log('Point for Home');~ // **WRONG:** side effect inside an updater function!
      return s + 1;
    });
  }
```

In development, the startup file wraps the app in `<StrictMode>`. Watch what happens when the scorekeeper clicks `+3` once from `Home: 0`.

1. In Chrome's Console panel, the message does not print three times. Because `<StrictMode>` calls each updater function twice in development, the log prints six times for a single `+3` click.
2. Startled by six Console messages, the developer looks at the scoreboard expecting `Home: 6`.
3. The scoreboard reads `Home: 3`, the right score.

### Why StrictMode calls each updater twice in development and keeps one result

Look at `addPoint`. Clicking `+3` called `addPoint` only three times, and each call queued one updater function. Nothing in the scoreboard file called those updaters a second time. Who called them twice, and why did the score still stop at `Home: 3` instead of `Home: 6`?

In development, React's `<StrictMode>` intentionally calls every component function, initializer function, and updater function twice to help you catch accidental side effects early.

1. When the scorekeeper clicks the three-point button, the handler hands three updater functions to the score setter. Nothing else waits in the score queue yet. React calls the first updater once right away, with `s` set to zero, to check whether the score will change. Then React queues all three updaters, and `handleThree` returns.
2. During the next render of `Scoreboard`, React walks the queue. Under `<StrictMode>`, React calls the first updater one more time, and it calls the second and third updaters twice each. Every updater runs twice, and both runs get the same pending state `s`.
3. Both runs call `console.log`, printing the log message twice for each queued updater.
4. For the state itself, React keeps only one return value of each pair and throws the other one away. The running result still steps from zero to one, then two, and finally `3`. In a production build, React calls each updater only once, and the Console shows the message three times.

### Keeping the updater pure and placing logs inside the handler

Only component functions, initializer functions, and updater functions must be pure. Event handlers and the helpers they call run on the click, not during rendering, so `<StrictMode>` never calls an event handler twice.

To log once per point, move `console.log` out of the updater function and place it directly inside `addPoint` above the setter:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~console.log('Point for Home');~ // 1. Runs in the handler on the click: logged ONCE per addPoint call
    ~setScore(s => s + 1);~ // 2. Pure updater function: only calculates and returns s + 1
  }
```

Save the file and click `+3` once from `Home: 0`. The Console prints the message three times, once for each `addPoint` call, and the scoreboard shows `Home: 3`.

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

### When to use an updater function vs. a plain value

Now we can answer the second half of the interview question completely. When do you actually need an updater function?

Here are the four situations you will meet in real projects and interviews.

- **1. Multiple updates of the same state before the next render.** Whenever one event queues more than one update for the same state variable, use an updater function so every update calculates from the latest pending state. That includes calling helpers such as `addPoint` several times in one click, or updating a state variable after an asynchronous `await` delay.
- **2. Only one update of that state in the click.** When a click handler updates a state variable only once, a plain value such as `score + 1` works cleanly without any bug. React always updates the state before the next intentional user click can run. Teams that prefer one consistent style often write an updater every time state builds on its previous value, and doing so is completely fine.
- **3. The running handler itself needs the new value right away.** Neither a plain value nor an updater function changes `score` inside the running handler. When the click handler must pass the new number to an alert or a log right away, save `score + 3` in a local variable first.
- **4. One state variable depends on a different state variable.** Never call one state setter from inside another state variable's updater function. When one state update depends on the value of a different state variable, combine those states into one object managed by a reducer, which a later lesson covers.

```tree caption="How to choose the right state update tool for each situation in React."
Which state update pattern fits your handler?
- +Several updates of the SAME state before the next render [`addPoint` called 3 times, or after `await`] | +**DO** use an updater function | Each queued update receives the **latest pending state** `s`
- +One update of that state per click [`setLastPlay` or a single score change] | +**DO** pass the next value directly, or use an updater by team habit | React finishes the render **before the next click** starts
- +Running handler must read the new number right now [for `console.log` or `alert`] | +**DO** save `const nextScore = score + 3` first | Gives the running handler the new value immediately
- !Next state depends on a DIFFERENT state variable [calling a setter inside an updater] | ~Do **NOT** call setters inside an updater | Keep updaters pure; combine related states in a **reducer**
```

> [!PRINCIPLE]
> **Principle 5: Pure Updaters: Keep Updaters Pure and Use Them When Updates Stack Up**
>
> *React calls updater functions mostly during rendering, so they must be pure. Use an updater whenever multiple updates of the same state can be queued before the next render.*
>
> Your click only hands an updater function to React. React decides when to call it, mostly during the next render, and calls each updater twice in Strict Mode development while keeping only one result. Because of that, an updater must only calculate and return the next value from its parameter. Never put Console logs, other state setters, or outside mutations inside an updater. Put logs and side effects inside the event handler, and reach for an updater whenever multiple updates of the same state can queue up.
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

## Putting All Five Principles Together

### The complete project files

Here are all three JavaScript files of the finished basketball scoreboard working together.

First, the startup file mounts the application inside `<StrictMode>`:

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

Second, the main application file imports and renders the scoreboard component:

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

### How React batches the updates and walks the queue on a `+3` click

When the scorekeeper clicks the three-point button from `Home: 0`, React runs every line of `handleThree` first. `addPoint` logs once to the Console and queues its one-point updater. `addTwo` queues its two-point updater, and `setLastPlay` queues the new play text. Once `handleThree` returns, React renders `Scoreboard` once, walks the score queue from zero to one to three, and commits the finished board to the DOM:

```page caption="The finished scoreboard after clicking +3 once from Home: 0."
heading: Scoreboard
line: Home: 3 | good
line: Last play: Three-pointer | good
row: +1 ; +2 ; +3
log: Point for Home
```

Follow the three stages of that single `+3` click from the handler to the DOM:

```tree dir=right caption="The complete lifecycle of one +3 click on the finished Scoreboard component."
One click on `+3` starting from `Home: 0`
- +1. Run `handleThree` to the end [event handler phase] | Logs `'Point for Home'` once; queues `s => s + 1` and `s => s + 2` for `score`; queues `'Three-pointer'` for `lastPlay`
- +2. Walk both queues in one render [batching phase] | `score` queue steps from `0` to `1` to **`3`**; `lastPlay` queue replaces with **`'Three-pointer'`**
- +3. Commit once to the DOM [commit phase] | Updates the page to **`Home: 3`** and **`Last play: Three-pointer`** at the same moment
```

| Aspect | The Naive Expectation | The React Rule |
| :--- | :--- | :--- |
| **When setter calls update the screen** | Expects each setter line to re-render the screen immediately before the next line of the handler runs | React **batches** all setter calls in one handler and renders **once** after the entire handler finishes |
| **Separate user clicks** | Wonders if fast button clicks get merged into one batch | React **never** batches across separate intentional clicks. Each click renders before the next click runs |
| **Passing a value three times** | Expects three `score + 1` setter calls in one handler to add three points | Each value call reads the **same snapshot** and queues **replace with that number**, so three calls add **one** |
| **Passing an updater function** | Treats `s => s + 1` as just a longer spelling of `score + 1` | React queues the function and calls it during the next render with the **pending state** `s`, so three calls add **three** |
| **Mixing values and updaters** | Assumes adding two and adding one gives the same total in either order | React walks the queue in order. An updater builds on the running result, while a plain value **replaces** and wipes out earlier slips |
| **Side effects inside updaters** | Puts `console.log` or another setter inside `s => { ... }`, thinking it runs once on the click | React decides when updaters run, mostly **during render**, so they must be **pure**. `<StrictMode>` calls each updater twice in development and discards one result |

---

## For the Interview

> **The Interview Question:** How does React queue multiple state updates, and when do you need an updater function?

### How to Answer Clearly in 30 Seconds

"Calling a state setter does not change the state variable in the running render. It adds an update to React's queue and requests a new render. React uses batching: it waits until all code in the event handler has finished before processing the queued updates in a single render. That keeps the app fast and prevents half-finished screens when several state variables change together. Each separate user click is still handled on its own.

What happens inside the queue depends on what we pass to the setter.

1. **Passing a next value directly**, such as `count + 1`, adds a replacement slip to the queue. Every line in a handler reads the same render snapshot, so calling `setCount` with `count + 1` three times queues the same replacement number three times. The count only goes up by one.
2. **Passing an updater function**, such as `c => c + 1`, adds the function itself to the queue. During the next render, React walks the queue in order and calls each updater with the pending state from the step before it, so three calls add three. If a plain value and an updater are mixed in the same queue, their order matters because a plain value overwrites whatever running result came before it.
3. **Purity and when to use one.** React decides when updater functions run, mostly during rendering. `<StrictMode>` calls each one twice in development and discards one result, so updaters must be pure calculations with no side effects. You need an updater whenever the next state depends on the previous state and multiple updates of that same state can be queued before the next render. For a single update per click, a plain value works fine because React renders before the next click. Cross-state calculations belong in a reducer."

### Three Classic Follow-Up Questions Interviewers Ask

1. **When `number` starts at `0`, what does a click show after calling `setNumber` with `number + 5` and then `n => n + 1`, or in reverse order?**
   - When `number + 5` comes first and `n => n + 1` comes second, the screen shows `6`. In the render where `number` is `0`, the first call queues "replace with `5`," and the second call queues `n => n + 1`. During the next render, React sets the running result to `5` and then calls the updater with `n` equal to `5`, returning `6`.
   - When we swap the two lines so `n => n + 1` comes first and `number + 5` comes second, the screen shows `5`. The updater runs first and turns `0` into `1`, and then the value slip "replace with `5`" ignores that `1` and overwrites the running result with `5`. Placing a plain value call with `42` at the very end after updaters overwrites everything before it and renders `42`.

2. **Why must an updater function be pure, and why did a `console.log` inside my updater print twice in development?**
   - Even though an updater function is written inside an event handler, it is not event handler code. React decides when to call it. React calls most updaters during the next render, and it may call the first one once right inside the setter call to check whether the state will change. Because rendering must be pure, an updater must only calculate and return the next state from its parameter. It must not mutate outside variables, call setters, or log. In development under `<StrictMode>`, React calls each updater function twice with the same pending state. It keeps only one of the two return values, and the extra call helps expose side effects. Event handlers themselves do not need to be pure and are never called twice by `<StrictMode>`, so logs and side effects belong in the handler.

3. **Should I always pass an updater function to every state setter, or only in specific cases?**
   - You do not have to use an updater on every setter call. For intentional user clicks, React always finishes rendering the current click before the next click runs, so a single update per click works cleanly with `count + 1`.
   - You must use an updater whenever the next state builds on the previous state and multiple updates of that same state can queue up before the next render. That happens when a handler calls a helper function several times in one click, or updates state after an asynchronous wait while other updates may have occurred. Writing an updater every time state builds on its own previous value is also a fine team convention. State calculated from another variable belongs in a reducer.

```tree dir=right caption="Interview comparison: passing a next value directly vs. passing a pure updater function to a state setter."
Two kinds of entries in React's state update queue
- +Direct value [`count + 1`] | Calculated **now** from this render's fixed snapshot | Queues **replace with that value**, ignoring earlier slips; fits **one update per click**
- +Updater function [`c => c + 1`] | Pure function called by React, mostly **during the next render** | Receives the **pending state** from the slip before it; needed when **multiple updates of the same state** are queued
```

