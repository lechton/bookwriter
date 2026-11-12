# Lecture 16: Batching and Updater Functions

*You call the setter with `score + 1` three times in one click, and the score rises by one. Where did the other two points go?*

> INTERVIEW QUESTION | ❱ CORE | How does React queue multiple state updates, and when do you need an updater function?

---

## State Setter `setScore` with `score + 1` vs. Updater Function with `s => s + 1`: the plain value replaces, the updater continues

### The Four Ideas This Lesson Stands On

> [!DEFINITION]
> **State and its twin setter.** [REVIEW] In vanilla JavaScript, you just write `score = 3`, and the job is done. Not in React. A value that must survive between renders lives in state, and state always comes as a pair: the state variable and its twin setter. You declare both together in one line: `const [score, setScore] = useState(0)`. Every single time. React holds these values for your component between renders, and you never change them directly: no `score += 1` here. Each time, you call the matching setter `setScore(score + 1)`. Here is the catch. When you write `setScore(score + 1)`, the score does not increase instantly. It does not change on that line, and not on any line after it in the same handler. Believe it or not, React first calls your component again, and only in that new render does the score hold the new value. (Lesson 12)

> [!DEFINITION]
> **The event handler.** [REVIEW] When you click a button on the screen, something happens, and the code behind that something is called the event handler. Why that name? Well, the click itself is the event, and the function you write to deal with it is the handler: it handles the event! In React, you connect the two with `onClick`, which is where you attach the function that handles the click. It looks like this: `<button onClick={handleThree}>+3</button>`. Pay attention here: the event handler is `handleThree`, and it does not run automatically when the page loads. It waits quietly until the user actually clicks that button, and then it runs once for that click. Every single time. You click a button, the event handler is activated, and the code inside that handler function runs from top to bottom. Here is the catch: anything you ask React to do inside this function, such as updating the score with `setScore`, does not happen on the spot! React waits until the whole event handler has finished running from start to finish. Only after the handler is completely done does React render the component again, and only in that new render does the result finally appear on the screen. (Lesson 11)

> [!DEFINITION]
> **The render.** [REVIEW] In vanilla JavaScript, a function runs only when you call it. Not in React. You never call a component function yourself: React calls it for you. React runs the body from top to bottom and works out what should appear on the screen. That call is a render. And believe it or not, React calls your component often. Why? Because React has one question to ask: "Given these props and this state, what should the screen look like right now?" The component answers by returning the JSX for that screen. React renders the component on the first load of the page, again after every state change, and again whenever its parent renders. So when the score is 0 and you click the button, the event handler runs `setScore(score + 1)`. You are not changing the screen directly. You are telling React: the score has changed, so call this component again so the screen can show the new score. Here is the good news: React does not redraw the whole page from scratch. It compares the new result with the previous result and updates only the parts that differ. Here is the bad news: every line in the component body runs again on every render, from the first line to the last. A `console.log('render')` in the body prints on every render: the first load, every state change, and every parent render. A counter you keep outside the component and add to in the body climbs on every render, even when the user clicks something unrelated. (Lesson 13)

> [!DEFINITION]
> **The snapshot.** [REVIEW] During a click, the score does not change. Even when `setScore` runs, which asks React to update the score, it does not change. Not during the click. These fixed values of variables are the snapshot. When a render starts, React locks the snapshot values for that entire render. Calling `setScore` asks React to prepare a new snapshot for the next render. The change appears only in the next render of the component. (Lesson 15)

> [!DEFINITION]
> **Pure functions.** [REVIEW] A pure function is a function that only calculates its result from its inputs and changes nothing outside itself. A function that takes a number and returns double that number is pure. A function that writes to an outside variable, logs to the Console, or calls a setter is not pure. React requires updater functions to be pure because React may call them more than once. (Lesson 14)

### The Three Calls on the Scoreboard

In vanilla JavaScript, adding one to a variable three times raises it by three. React state setters break this rule.

Imagine a basketball arena scoreboard. The display shows the home team score and the description of the latest play. The score starts at zero. Under the scoreboard sit three buttons: a free throw button for one point, a basket button for two points, and a three-point shot button.

When the scorekeeper clicks the three-point button, the button runs an event handler named `handleThree`. Inside the handler, the developer calls `setScore` with `score + 1` three times in a row, once for each point, and then updates the play line:

```jsx
function handleThree() {
  ~setScore(score + 1);~ // score is 0: queues "replace with 1"
  ~setScore(score + 1);~ // score is still 0: queues "replace with 1" again
  ~setScore(score + 1);~ // score is still 0: queues "replace with 1" a third time
  setLastPlay('Three-pointer');
}
```

The scorekeeper clicks `+3`. What do you expect the screen to show? Most developers expect three points.

The screen displays `Home: 1`. The play line says `Last play: Three-pointer`, but the score only moved from zero to one. React dropped two points without showing any error in the Console. Where did the other two points go?

### [NEW] What React Does with the Queue

React does not redraw the screen after the first setter line, then again after the second, and again after the third. That would make your application slow, and the user would see the screen flash half-finished values.

Instead, React lets the entire event handler run to its last line. Every setter call drops an instruction into a waiting line. React calls that waiting line the update queue.

When the handler finishes, React walks that queue from top to bottom, calculates the final state, and renders the component once. React calls this batching.

> [!DEFINITION]
> **Batching.** [NEW] When an event handler calls several state setters, React does not redraw the screen after each line. It waits until the whole event handler has finished, groups all the updates together, and renders the component once. This grouping is called batching. Here is the good news: the application runs faster. The user never sees a half-updated screen where some variables are updated while other variables are not yet updated. Batching allows React to group together all the updates from all the setter calls inside the same event handler. So when you click a button, the event handler is activated, and all the state variables it sets get updated together in a batch. Here is the catch: if your code pauses the handler before its last line, for example with `alert('Done')`, the screen behind the alert shows misleading, old values. Batching has not happened yet because the handler has not finished. Moral of the story: we do not interrupt the handler! Also, React never batches across two separate clicks: the first click always finishes its render before the second click runs. (Lesson 16)

> [!DEFINITION]
> **The update queue.** [NEW] We have seen that when you click a button, an event handler is activated, and all the setters inside this handler are grouped together in a batch. But in what order are their updates applied? Well, they are added to a queue, an update queue. Every call such as `setScore(score + 1)` or `setScore(s => s + 1)` drops one more step at the back of that queue. Here is the catch: React does not walk that queue while your handler is still running. Only after the handler finishes does React go through the queue from first to last, in the exact order you called the setters. It works out the final state for the next render. (Lesson 16)

```tree dir=right caption="One click on +3: the handler fills the queue, React walks it, and the page renders once."
One click on +3
- +1. The handler runs to its last line | Three slips go into the queue | The screen does not change yet
- +2. React walks the queue | It reads the slips from top to bottom | It works out one final score
- +3. React renders once | It calls the component one time | The page shows the finished screen
```

### [NEW] Two Kinds of Instructions in the Queue

What happens when React walks that queue depends on what you pass to `setScore`. There are two possibilities:

The first possibility is a plain value update. If you update the score with `setScore(score + 1)`, JavaScript calculates `score + 1` from the current snapshot and commands React: "REPLACE the score with this number". Notice that word: REPLACE. The call `setScore(score + 1)` is not an addition. It is a command to replace the previous state with the newly calculated number. In a render where the score is zero, JavaScript evaluates `0 + 1 = 1` and queues the instruction: replace the score with 1.

The second possibility is an updater function. If you write `setScore(s => s + 1)`, you pass an arrow function instead of a calculated number. The updater function tells React: "take whatever the score is by now, and add 1 to it". React places the function itself into the queue. It does not call the function during the click handler. It calls the function later, when it walks the queue during the render.

> [!DEFINITION]
> **A value update vs. an updater function.** [NEW] In vanilla JavaScript, you can just define things: you write `score = 3` and the job is done. For state in React, you declare the state variable and its twin setter function together: `const [score, setScore] = useState(0)`. Every single time. Pay attention here: if you write `setScore(score + 1)`, you do a simple value update. Remember the snapshot: state variables do not change within the same event handler until the component renders again. Value updates do not add up. If you update the score with `setScore(score + 1)`, JavaScript calculates `score + 1` from the current snapshot, telling React: "REPLACE the score with this number". Notice that word: REPLACE. Calling `setScore(score + 1)` replaces the previous value with the new one. Each value update replaces the one before it, so only the last update counts! The last update wins because it commands the actual replacement. Now look at `setScore(s => s + 1)`. Here you pass a function, and that function is called an updater function. Updater functions are queued as functions, so you can stack many of them. The updater function tells React: "take whatever the score is by now, and add 1 to it". It does not replace: it calculates on top of the update before it. Here is the catch in action: suppose the score is 0, and you call `setScore(score + 1)` three times in the same click. Will the score be 3 in the end? No, it will be 1. Why? Because React was told "replace with 1" three times. Each call overwrites the one before it, so the score ends up at 1. If you call `setScore(s => s + 1)` three times instead, each updater builds on the one before it. The score steps from 0 to 1, then 2, then 3. And if you mix both in one click, order matters. A value update placed after an updater function wipes out the updater work and replaces the score with its own number. (Lesson 16)

Now look at the three setter calls in `handleThree` with surgical precision:

1. **First call:** `setScore(score + 1)` reads snapshot score 0, evaluates 0 + 1 = 1, and commands React: "Replace the score with 1."
2. **Second call:** `setScore(score + 1)` still reads snapshot score 0, evaluates 0 + 1 = 1, and commands React: "Replace the score with 1."
3. **Third call:** `setScore(score + 1)` still reads snapshot score 0, evaluates 0 + 1 = 1, and commands React: "Replace the score with 1."

React receives the instruction "replace with 1" three times. Each call overwrites the one before it. When the handler finishes, React renders the component once with `Home: 1`. The score ends up at 1, not 3.

```jsx
function handleValueThree() {
  ~setScore(score + 1);~ // score is 0: queues "replace with 1"
  ~setScore(score + 1);~ // score is still 0: queues "replace with 1" again
  ~setScore(score + 1);~ // score is still 0: queues "replace with 1" a third time
}

function handleUpdaterThree() {
  ~setScore(s => s + 1);~ // React will call this with 0 and get 1
  ~setScore(s => s + 1);~ // React will call this with 1 and get 2
  ~setScore(s => s + 1);~ // React will call this with 2 and get 3
}
```

In `handleUpdaterThree`, React places three functions into the queue. During the next render, React calls the first updater with zero and gets one. It passes that one into the second updater and gets two. It passes that two into the third updater and gets three. The screen displays `Home: 3`.

> [!TAKEAWAY]
> Calling `setScore(score + 1)` commands React to REPLACE the state with that exact number. Calling `setScore(s => s + 1)` commands React to BUILD ON TOP of the pending state in the queue.

### The Lift Metaphor

The behavior of the update queue becomes clear if you picture a lift in an apartment building.

Imagine standing inside a lift on the ground floor. The doors are open. The floor indicator above the door reads `0`.

Passengers step into the lift and press buttons. The lift does not travel the instant the first finger touches a button. It waits patiently with its doors open while everyone makes their choice. Once the doors close, the lift starts moving. In React, the doors close when your event handler finishes its last line.

The floor indicator is the snapshot. While you stand there pressing buttons, the indicator above the door stays firmly on `0`. Pressing buttons does not move the lift under your feet. Calling `setScore` does not change the score variable inside your running handler.

Now consider the two buttons you can press:

1. **A button marked with an absolute floor number, such as 1.** This is a plain value update like calling `setScore` with `1`. Press that button three times in a row. Does the lift rise three floors? No. You pressed floor one three times, so the lift travels to floor one.
2. **An imaginary button marked one floor up.** This is an updater function. Press it once, and it queues a move one floor above wherever the lift is. Press it three times, and the lift steps from ground to floor one, then floor two, and stops on floor three.

Now look at the scoreboard bug through the lift. A helper glances at the floor indicator, reads `0`, calculates zero plus one, and presses the button for floor one. It does this three times, still reading `0` from the indicator each time. The lift travels to floor one, not floor three.

> [!REMINDER]
> Real lifts have no button marked one floor up. The button is imaginary, and it is the exact picture this lesson needs. A fixed floor button names an absolute destination. The imaginary button describes a relative step from the pending floor.

### The Rule of Thumb

At the end of the day, a senior developer follows three rules:

1. **When updating the same state multiple times in one click, pass an updater function.** Calling `setScore` with `score + 1` three times and passing an updater function three times look like they do the same job. They are not the same. The plain value queues replace with one three times. The updater function queues three steps, each building on the pending state before it.
2. **Never place a plain value update after an updater function for the same state.** If a handler calls the setter with an updater function first and calls `setScore` with `score + 2` second, the plain value runs second in the queue. It reads the frozen snapshot zero, ignores the updater result, and replaces the score with two. When helpers for the same state can run in the same click, write all of them with updater functions.
3. **Keep updater functions pure, and put outside actions in the handler.** React runs updater functions during rendering. In development, Strict Mode calls each updater function twice to check that it is pure. Never place `console.log`, network requests, or other setters inside an updater. Place them in the event handler above the setter call.

---

## Project Blueprint: The Basketball Scoreboard

Our conceptual foundation is in place: state updates command React to replace, while updater functions build on top. Now we leave the whiteboard and test these rules in a real codebase.

To see how batching and updater functions behave in practice, we build a basketball scoreboard across four files. At the root sits the HTML entry. Inside the source folder, the startup file mounts the app in Strict Mode, the parent file renders the layout, and the scoreboard component drives the score:

```files title="scoreboard-app: File Explorer" caption="How our scoreboard project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `StrictMode` and `App` from `./App.jsx` and mounts into `#root`
  App.jsx | parent | Exports `App` as default and imports `Scoreboard` from `./components/Scoreboard.jsx`
  components/
    Scoreboard.jsx | state | Exports `Scoreboard` as default and manages `score` and `lastPlay` with `useState`
```

With our project structure in place, we now examine the five core principles that govern how React runs our handlers.

---

## 1. Principle 1: React Runs the Whole Handler First, Then Renders Once

### Why calling two setters in one click does not cause two renders

Before we examine the scoreboard, look at a small component with two state variables. The count starts at zero, and the text label starts as Not clicked. When clicked, the handler calls both setters and then opens a browser alert:

```jsx title="Calling two state setters and alert inside one click handler"
function CounterAlert() {
  const [count, setCount] = useState(0);
  const [label, setLabel] = useState('Not clicked');

  function handleClick() {
    ~setCount(count + 1);~ // 1. Queues an update for count: screen does not change yet
    ~setLabel('Clicked');~ // 2. Queues an update for label: screen still does not change
    ~alert('Done');~ // 3. Pauses handleClick with the old screen still visible behind the pop-up
  }

  return <button onClick={handleClick}>{label}: {count}</button>;
}
```

Two things surprise beginners when they click that button:

- **Two setter lines look like two screen updates. They are not.** React waits until `handleClick` finishes its last line and combines both state changes into one single render.
- **While the alert is open, the button behind it still says Not clicked: 0.** It looks as if the setters failed, but they did not fail. The alert pauses the handler on line three. React waits until you click OK and the handler returns. The lift is still on the ground floor with its doors open: the buttons are pressed, but the trip has not started.

```tree dir=right caption="What happens during handleClick while alert is open vs. after the handler finishes."
One click on CounterAlert
- +While alert is open [lines 1 and 2 have run, line 3 is paused] | Both updates sit waiting in React queues | Screen behind the pop-up still shows Not clicked: 0
- +After clicking OK [handleClick finishes its last line] | React batches both updates into one render | Screen updates to Clicked: 1 all at once
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
    ~setLastPlay('Three-pointer');~ // 2. Adds "replace lastPlay with Three-pointer" to the lastPlay queue
    ~alert('Three points for Home!');~ // 3. Opens pop-up and pauses handleThree before React renders
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

Watch what happens when the scorekeeper clicks `+3`:

1. Before the click, the board shows zero points and the play line says Game start.
2. The scorekeeper clicks the three-point button. The pop-up opens immediately.
3. Behind the pop-up, the board still displays zero points and Game start.
4. The scorekeeper clicks OK. The handler finishes, and React updates both lines to three points and Three-pointer at the exact same moment.

### Why React waits for the handler to return before rendering

In `handleThree`, nothing in our code says "now redraw the page." Who starts the render, and why did it wait for the pop-up?

React starts the render itself, and it waits for the running event handler to return first:

1. Clicking `+3` starts `handleThree` in the render where the score is zero and the play line says Game start.
2. Line one calls `setScore` with `0 + 3`. React places that update in the queue for `score` and leaves the screen alone.
3. Line two calls `setLastPlay` with Three-pointer. React places that update in the queue for `lastPlay` and still leaves the screen alone.
4. Line three calls `alert`. The browser opens the pop-up and pauses JavaScript on line three until the user clicks OK.
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

Waiting until the end of the event handler and processing every setter call in one render solves two problems at once:

- **The application runs faster.** Even if one click updates several state variables across multiple components, React re-renders once at the end instead of re-rendering after each setter line.
- **The user never sees a half-finished screen.** Without batching, updating `score` before `lastPlay` would briefly flash the new score next to the old play text. Batching displays both updated values in the same render.

Does React ever batch two separate clicks? No. React never batches across separate intentional user clicks. Every click is handled on its own, and React finishes the first click render before the second click runs. If the first click disables a submit button, that button is already disabled before the second click can submit the form again.

```tree caption="How React batches multiple setter calls inside one click vs. how it handles two separate user clicks."
What React batches vs. what React keeps separate
- +Multiple setter calls in ONE click [`setScore` and `setLastPlay` in `handleThree`] | React waits until the entire handler finishes | Processes both updates in one single render with zero half-finished screens
- +Two SEPARATE user clicks [first click, then second click] | React never batches across separate intentional clicks | The first click finishes its render before the second click runs
```

> [!PRINCIPLE]
> **Principle 1: Batching: React Runs the Whole Handler First, Then Renders Once**
>
> *React waits until every line of an event handler has finished before processing its state updates in one single render, and handles each separate click on its own.*
>
> Calling a state setter does not redraw the screen on that line. It only places an update into React queue while the event handler keeps running. Even if you call several setters for different state variables and run more code after them, the screen stays untouched until the handler returns. Only then does React batch all the queued updates into one render, so the page updates once without flashing a half-finished mix of old and new values.
>
> **DO THIS:**
> ```jsx
> function handleThree() {
>   ~setScore(score + 3);~ // 1. Queued for the next render
>   ~setLastPlay('Three-pointer');~ // 2. Batched with setScore into one render after handleThree finishes
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   setScore(score + 3);
>   setLastPlay('Three-pointer');
>   ~alert('Three points for Home!');~ // Alert pauses the handler before React can batch and render
> }
> ```

---

## 2. Principle 2: A Plain Value Replaces the State

### Why three lines with `number + 1` pass the same number three times

Now suppose one event handler calls the same state setter three times with a calculated value. The state variable `number` starts at zero, and the button handler runs these three lines:

```jsx title="What you write: three calls with number + 1"
const [number, setNumber] = useState(0);

function handleClick() {
  ~setNumber(number + 1);~ // First call in this render where number is 0
  ~setNumber(number + 1);~ // Second call in the same render where number is still 0
  ~setNumber(number + 1);~ // Third call in the same render where number is still 0
}
```

Because `number` is locked at zero for the entire render snapshot, substitute `0` on each line:

```jsx title="What JavaScript actually passes to setNumber when number is 0"
function handleClick() {
  ~setNumber(1);~ // First slip added to the queue: replace number with 1
  ~setNumber(1);~ // Second slip added to the queue: replace number with 1
  ~setNumber(1);~ // Third slip added to the queue: replace number with 1
}
```

Look closely at those two blocks:

- **Writing `number + 1` inside `setNumber` looks like an instruction to add one. It is not.** JavaScript calculates `0 + 1` from the current snapshot before calling `setNumber`, commanding React: "Replace the state with 1." React never sees an addition sign.
- **In the render where `number` is zero, calling `setNumber(number + 1)` three times and calling `setNumber(1)` three times do the exact same thing.** Any non-function value given to a setter commands React: "replace with that value", overwriting earlier instructions in the queue. After all three lines run, the queue holds three identical instructions that all say replace with 1. When React renders after the handler, the screen changes from zero to 1.

```tree dir=right caption="How three calls with number + 1 in the render where number is 0 queue three identical replacement slips."
One click when number is 0
- +1. First call [0 + 1] | Calls setNumber with 1 | Queue slip 1: replace with 1
- +2. Second call [0 + 1] | Reads snapshot 0 and calls setNumber with 1 | Queue slip 2: replace with 1
- +3. Third call [0 + 1] | Reads snapshot 0 and calls setNumber with 1 | Queue slip 3: replace with 1 -> next render shows 1
```

### Mistake: Calling a value-based helper three times in one click

This trap appears in the basketball scoreboard as soon as the developer shares one helper between three buttons. The free throw button, the two-point button, and the three-point button all call the same `addPoint` helper:

```jsx title="src/components/Scoreboard.jsx" startLine="1"
import { useState } from 'react';

export default function Scoreboard() {
  const [score, setScore] = useState(0);
  const [lastPlay, setLastPlay] = useState('Game start');

  function addPoint() {
    ~setScore(score + 1);~ // Calculates score + 1 from the same snapshot every time addPoint runs
  }

  function handleOne() {
    addPoint();
    setLastPlay('Free throw');
  }
```

Below the free throw handler, the two-point handler calls `addPoint` twice, and the three-point handler calls it three times while logging the score after each call:

```jsx title="src/components/Scoreboard.jsx" startLine="16"
  function handleTwo() {
    addPoint();
    addPoint();
    setLastPlay('Two-pointer');
  }

  function handleThree() {
    ~addPoint();~ // First call: queues replace with score + 1
    console.log(score);
    ~addPoint();~ // Second call: reads the exact same score snapshot and queues the same number again
    console.log(score);
    ~addPoint();~ // Third call: reads the exact same score snapshot a third time
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

Watch what happens when the scorekeeper tests the buttons:

1. The scorekeeper clicks `+1` for a free throw. The handler calls `addPoint` once, so the board moves to `Home: 1`. Everything seems fine.
2. With the board at `Home: 1`, a player hits a three-point shot. The scorekeeper clicks `+3`. The play line updates to Three-pointer, but the score only rises to `Home: 2` instead of `Home: 4`.
3. The scorekeeper clicks `+2`. The score only rises to `Home: 3` instead of `Home: 5`. Every button adds only one point, and the Console shows zero warnings.
4. After clicking `+3` from a starting score of one, all three log lines print `1`, the score before the click.

### Why three addPoint calls only add one point

Where is the queue, and why did three calls move the score from one to two?

React keeps an update queue internally for `score`. Two rules work together here:

1. State as a snapshot keeps `score` fixed during the click handler.
2. Batching waits until all three `addPoint` calls finish before rendering.

Follow the click when `score` is one:

1. Clicking the three-point button starts `handleThree` inside the render snapshot where `score` is one.
2. The first `addPoint` call calculates one plus one, passes two to the setter, and logs one. React queues: replace with 2.
3. The setter never changes `score` in the running handler. The second `addPoint` call still reads one, calculates one plus one again, queues a second replacement with two, and logs one.
4. The third `addPoint` call also reads one. It queues a third replacement with two and logs one.
5. After `handleThree` finishes, React renders once and walks the queue for `score`. All three slips say replace with two. Every slip sets the score to two, so the board displays `Home: 2`.

::: row caption="Clicking +3 when score starts at 1 with a value-based addPoint helper: all three calls queue replace with 2."
::: col title="On the Page After Clicking +3 from Home: 1" tag="rises by 1 instead of 3" tone=bad
```page size=mini
heading: Scoreboard
line: Home: 2 | bad
line: Last play: Three-pointer
row: +1 ; +2 ; +3
```
The score moves from one to two instead of four because all three calls queued two.
:::
::: col title="In Chrome Console Panel" tag="same snapshot 1 all three times" tone=bad
```devconsole
+ 1 | Scoreboard.jsx:24
+ 1 | Scoreboard.jsx:26
+ 1 | Scoreboard.jsx:28
```
Inside `handleThree`, the `score` snapshot stays at one on every line, and zero warnings are logged.
:::
:::

```tree caption="What each of the three addPoint calls puts into React queue when clicking +3 from Home: 1."
Three addPoint calls in one click when score is 1
- !First addPoint call [score is 1] | Calculates 1 + 1 and calls setScore with 2 | Queue slip 1: replace with 2
- !Second addPoint call [score is still 1] | Reads snapshot 1 and calls setScore with 2 | Queue slip 2: replace with 2, overwriting slip 1
- !Third addPoint call [score is still 1] | Reads snapshot 1 and calls setScore with 2 | Queue slip 3: replace with 2 -> renders Home: 2
```

> [!PRINCIPLE]
> **Principle 2: Value Updates Replace: Three Snapshot Calls Queue the Same Number**
>
> *Calling a setter with a calculated value commands React to replace the state, so three calls from the same snapshot queue the same number three times.*
>
> When you call `setScore(score + 1)`, JavaScript calculates that math right away from the fixed snapshot of this render. The call commands React to REPLACE the state with that calculated number, ignoring whatever is already waiting in the queue. If a click handler calls `setScore(score + 1)` three times, all three calls read the same snapshot zero and command "replace with 1" three times. Each call overwrites the one before it, raising the score by one instead of three.
>
> **DO THIS:**
> ```jsx
> function handleOne() {
>   ~setScore(score + 1);~ // Safe only when this event queues a single update for score
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   setScore(score + 1);
>   setScore(score + 1);
>   ~setScore(score + 1);~ // All three lines read the same snapshot and queue the same replacement
> }
> ```

---

## 3. Principle 3: An Updater Function Continues from the Pending State

### Why passing a value and passing an updater function are NOT the same thing

How do we tell React "add one to whatever number is already waiting in the queue" instead of "replace the queue with this fixed number"? Instead of passing the calculated number `number + 1`, you pass an updater function to the setter:

```jsx title="Passing a calculated value vs. passing an updater function"
~setNumber(number + 1);~ // 1. Value update: calculates 0 + 1 from the snapshot and queues "replace with 1"
~setNumber(n => n + 1);~ // 2. Updater function: queues the function so React calls it during the next render
```

Three distinctions make updater functions clear right away:

- **Passing `number + 1` and passing the arrow function on line two are NOT the same thing.** When you call a setter only once per click, both produce the same screen. Yet passing `number + 1` calculates a number right now from this render snapshot and tells React to replace the state. Passing the arrow function hands the function itself to React so it continues from the latest value in the queue during the next render.
- **The parameter `n` inside the arrow function and the state variable `number` outside it are NOT the same thing.** The state variable `number` is frozen at zero for the entire click handler. During the next render, React fills the parameter `n` with the pending state, the running result from the update right before it.
- **The short arrow function on line two is the exact same thing as a full JavaScript function that takes `n` and returns `n + 1`.** Both take the pending state `n` from React and return `n + 1`.

Now look at what happens when one click handler queues three updater functions in a row starting from zero:

```jsx title="Queueing three updater functions in one click handler"
const [number, setNumber] = useState(0);

function handleClick() {
  ~setNumber(n => n + 1);~ // First updater in queue: React passes n = 0 -> returns 1
  ~setNumber(n => n + 1);~ // Second updater in queue: React passes n = 1 -> returns 2
  ~setNumber(n => n + 1);~ // Third updater in queue: React passes n = 2 -> returns 3
}
```

During the next render, React walks the three queued functions in order and passes the return value of each function as the `n` parameter of the next one:

| Queued Update | Value of `n` Passed by React | Return Value Passed to the Next Step |
| :--- | :--- | :--- |
| **First updater in queue** | `0`, the starting state from this render | `0 + 1` -> **`1`** |
| **Second updater in queue** | `1`, the pending state from the first updater | `1 + 1` -> **`2`** |
| **Third updater in queue** | `2`, the pending state from the second updater | `2 + 1` -> **`3`**, stored as final state |

```tree dir=right caption="How three queued updater functions hand their running result, the pending state, from one step to the next."
React walks three updaters starting from 0
- +1. First updater [receives n = 0] | Adds 1 to 0 | Returns pending state 1
- +2. Second updater [receives n = 1] | Takes the 1 from step 1 and adds 1 | Returns pending state 2
- +3. Third updater [receives n = 2] | Takes the 2 from step 2 and adds 1 | Returns 3, which useState gives to the page
```

### Mistake: Writing an updater function that still reads the snapshot variable

Now update `addPoint` in the scoreboard to use an updater function. Watch the common mistake where the developer writes the parameter `s`, but still writes the snapshot variable `score` on the right side:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~setScore(s => score + 1);~ // Ignores parameter s and still reads the frozen snapshot variable score
  }
```

Save the file and click the three-point button from zero. The scoreboard still rises to `Home: 1` instead of `Home: 3`.

Why did the arrow function not fix the bug? Because `score` on the right side of the arrow is still the component fixed snapshot variable, zero. React passed zero, then one, and then two into `s`, but the function body ignored that parameter and returned `0 + 1` all three times.

### Reading the pending state parameter inside the updater function

To make each queued update build on the one before it, the right side of the arrow must calculate its result from the parameter `s`:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~setScore(s => s + 1);~ // Uses the pending state parameter s passed in by React
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
    ~addPoint();~ // First queued updater: s = 0 -> returns 1
    ~addPoint();~ // Second queued updater: s = 1 -> returns 2
    ~addPoint();~ // Third queued updater: s = 2 -> returns 3
    setLastPlay('Three-pointer');
  }
```

### How React passes the pending state into each updater

In `addPoint`, our code never writes parentheses after the arrow function to call it, and it never passes a number into `s`. Who calls that arrow function, and where does `s` come from?

React calls each updater function during the next render and supplies `s` itself:

1. Clicking `+3` runs `handleThree`. Each of the three `addPoint` calls hands the updater function to `setScore` without calling it. React places all three functions in the update queue for `score`.
2. Next, `setLastPlay` queues the new play text, and `handleThree` finishes.
3. React starts the next render by calling `Scoreboard`. Inside `useState`, React walks the queue of three updater functions starting from zero.
4. React calls the first updater with `s` set to zero, and gets back one.
5. React calls the second updater with `s` set to that pending state one, and gets back two.
6. React calls the third updater with `s` set to that pending state two, and gets back three. React stores three and commits `Home: 3` and the play line to the page.

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

When you write an updater function, React lets you give its parameter any valid JavaScript name. Three naming conventions are common:

- **The first letter of the state variable name**, such as using parameter `s` for the score variable, or parameter `c` for the count variable.
- **The full state variable name repeated**, such as repeating `score` as the parameter name.
- **A prev prefix**, such as writing `prevScore` to indicate clearly that the parameter holds the state from the step before.

```jsx title="The three common naming styles for an updater parameter"
~setScore(s => s + 1);~ // 1. First letter of the state variable name
~setScore(score => score + 1);~ // 2. Full state variable name repeated as parameter
~setScore(prevScore => prevScore + 1);~ // 3. "prev" prefix before the state variable name
```

Keep two more facts about state setters in mind:

- **Setter functions return `undefined`.** Calling `setScore` only adds an update to React queue and returns nothing. Assigning the return of `setScore` to a variable stores `undefined`.
- **React treats any function passed to a setter as an updater function.** If you want to store a function itself inside state, wrap it in an outer arrow function so React calls the wrapper and stores your inner function.

```jsx title="How to store a function itself in state without React calling it as an updater"
~setFn(someOtherFunction);~ // React treats someOtherFunction as an updater and calls it during render
~setFn(() => someOtherFunction);~ // Outer arrow is the updater: React calls it and stores someOtherFunction
```

> [!PRINCIPLE]
> **Principle 3: Updater Functions Continue from the Pending State**
>
> *Call the setter with an updater function so React calls it during the next render with the pending state from the update before it.*
>
> When you call `setScore(s => s + 1)`, you pass an updater function instead of a replacement value. That function takes the pending state as its parameter and returns the next state. During the next render, React walks the queue and feeds the return value of each updater straight into the parameter of the next updater in line. Make sure the right side of the arrow reads the updater own parameter and not the outer snapshot variable.
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
>   ~setScore(s => score + 1);~ // Ignores parameter s and reads the frozen snapshot variable score
> }
> ```

---

## 4. Principle 4: React Walks the Queue in Order

### Combining a value update and an updater on the same state: before vs. after

Principle 2 queued only plain values, and Principle 3 queued only updater functions. Can one click handler queue both a plain value such as `number + 5` and a one-point updater for the same state?

Yes. Suppose `number` starts at zero. When both calls share one handler, there are two ways to order them:

- **Order 1.** The value update `number + 5` comes before the one-point updater. The value update is first in the queue, and the updater is second.
- **Order 2.** The one-point updater comes before the value update `number + 5`. The updater is first in the queue, and the value update is second.

Look at both orders side by side starting from `number` at zero:

```jsx title="The two ways to order a value update and an updater function in one handler"
const [number, setNumber] = useState(0);

function handleOrderOne() {
  ~setNumber(number + 5);~ // Order 1, slip 1: value update is first -> replaces 0 with 5
  ~setNumber(n => n + 1);~ // Order 1, slip 2: updater is last -> takes 5 and returns 6
}

function handleOrderTwo() {
  ~setNumber(n => n + 1);~ // Order 2, slip 1: updater is first -> takes 0 and returns 1
  ~setNumber(number + 5);~ // Order 2, slip 2: value update is last -> ignores 1 and replaces with 5
}
```

In everyday math, adding five and then adding one gives the same total as adding one and then adding five. But in React, Order 1 displays six while Order 2 displays five.

Why? During the next render, React walks the update queue in order from top to bottom:

1. **In Order 1**, the value update runs first. The starting number is zero, so the first slip says replace with five. The running result becomes five. The updater runs second. It receives that running result five as `n`, adds one, and produces six.
2. **In Order 2**, the updater runs first. It receives the starting state zero as `n`, adds one, and makes the running result one. The value update runs second. Because `number` in this render snapshot is still zero, its slip says replace with five. A value slip replaces the running result and ignores earlier slips, so it throws away the one and leaves five.

Now place one more value call, `42`, at the very end after the updater:

```jsx title="Placing a plain value update after an updater in the queue"
function handleReplaceAtEnd() {
  setNumber(number + 5);
  setNumber(n => n + 1);
  ~setNumber(42);~ // Slip 3: comes last -> ignores the running 6 and replaces the state with 42
}
```

Look at how React walks those three slips in order starting from zero:

| Queued Update | Value of `n` Passed by React | Return Value Passed to the Next Step |
| :--- | :--- | :--- |
| **1. Replace with `5`** | `0`, unused because a value slip ignores `n` | **`5`** |
| **2. Updater function `n => n + 1`** | `5`, the pending state from step 1 | `5 + 1` -> **`6`** |
| **3. Replace with `42`** | `6`, unused because a value slip ignores `n` | **`42`**, stored as final state |

That table reveals how React views both kinds of slips internally. Passing a plain value such as `5` to a setter is the exact same thing in the queue as an updater returning five. Both ignore whatever came before them and return five.

```tree caption="How the order of value replacements and updater functions in the queue decides the final state from 0."
Three mixed queues starting from 0
- +Order 1: Value number + 5 BEFORE updater [replace with 5, then n => n + 1] | Slip 1 sets running state to 5; slip 2 adds 1 to 5 | Renders 6
- !Order 2: Updater BEFORE value number + 5 [n => n + 1, then replace with 5] | Slip 1 returns 1, then slip 2 overwrites 1 with 5 | Renders 5, losing the updater point
- !Value 42 placed AFTER earlier updates [replace with 5, n => n + 1, then replace with 42] | Slip 3 comes last and ignores the 6 built above it | Renders 42
```

### How React Queue Loop Works in Vanilla JavaScript

We can write React entire queue calculation in ten lines of vanilla JavaScript. Starting from `baseState`, React loops through each item in the `queue` array from first to last:

```js title="Vanilla JavaScript: how React calculates the final state from a queue"
function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (const update of queue) {
    if (~typeof update === 'function'~) { // 1. Updater function: call it with the running finalState
      finalState = update(finalState);
    } else {
      ~finalState = update;~ // 2. Plain value: overwrite finalState and ignore what came before
    }
  }

  return finalState;
}
```

When the item is a function, React calls `update` with the running `finalState` so it continues from the step before. When the item is a plain value, `finalState = update` overwrites `finalState` completely and forgets every earlier step in the loop.

### Mistake: Mixing a value helper and an updater helper in the same click

This mistake is easy to make in the scoreboard. Suppose a teammate adds a second helper named `addTwo` for the two-point button using a plain value `score + 2`:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    setScore(s => s + 1);
  }

  function addTwo() {
    ~setScore(score + 2);~ // Uses a plain value replacement instead of an updater function
  }

  function handleThree() {
    ~addTwo();~ // Order 1, slip 1: queues replace with 0 + 2 -> running state is 2
    ~addPoint();~ // Order 1, slip 2: updater s => s + 1 takes 2 -> returns 3, hiding the bug
    setLastPlay('Three-pointer');
  }
```

When the scorekeeper clicks `+3` from zero, the board shows `Home: 3`. Because the value replacement `addTwo` ran before the updater `addPoint`, the bug stays hidden.

Later, another developer edits the three-point handler and swaps the two lines so `addPoint` runs before `addTwo`:

```jsx title="src/components/Scoreboard.jsx" startLine="15"
  function handleThree() {
    ~addPoint();~ // Order 2, slip 1: updater s => s + 1 runs first -> turns 0 into 1
    ~addTwo();~ // Order 2, slip 2: queues replace with 0 + 2 after addPoint -> wipes out 1 and sets 2
    setLastPlay('Three-pointer');
  }
```

The scorekeeper clicks `+3` from zero. The scoreboard displays `Home: 2` instead of `Home: 3`.

### Why addTwo erased the point that addPoint queued before it

Follow what JavaScript and React do when `score` starts at zero:

1. Calling `addPoint` first adds its one-point updater function as the first slip in the queue.
2. Calling `addTwo` second reads the fixed snapshot `score`, which is still zero. It calculates `0 + 2` and adds replace with two as the second slip.
3. When `handleThree` returns, React walks the queue. The first slip is the updater, which turns zero into one. The second slip is replace with two, which ignores the running one and overwrites the score with two.

### Writing both score helpers with updater functions

Whenever two helpers can run together in one event for the same state variable, write both helpers with updater functions:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~setScore(s => s + 1);~ // Updater function: adds 1 to the pending state s
  }

  function addTwo() {
    ~setScore(s => s + 2);~ // Updater function: adds 2 to the pending state s
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
>   ~setScore(s => s + 1);~ // First slip: takes 0 and returns 1
>   ~setScore(s => s + 2);~ // Second slip: takes 1 and returns 3 in either order
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleThree() {
>   setScore(s => s + 1);
>   ~setScore(score + 2);~ // Plain value runs second and overwrites the updater 1 with 0 + 2
> }
> ```

---

## 5. Principle 5: Updaters Are Pure, and You Need One When Updates Stack Up

### Why code inside an updater function is not the same as code inside the click handler

Where does an updater function actually run, and can you put a log, another setter, or an outside change inside it?

Compare these two click handlers:

```jsx title="Logging inside the updater function vs. logging inside the click handler"
function handleImpure() {
  setCount(c => {
    ~console.log('adding');~ // Inside the updater: React decides when it runs, and runs it twice in StrictMode
    return c + 1;
  });
}

function handleClean() {
  ~console.log('adding');~ // Inside the click handler: runs once on the click
  ~setCount(c => c + 1);~ // Pure updater: only calculates and returns c + 1
}
```

Two confusions trip developers up here:

- **The updater arrow function sits inside `handleImpure`, so it looks like click handler code. It is not.** Your click handler only hands the updater function to React, and React decides when to call it. React calls most updaters during the next render, under the same purity rules as your component body. Think of an updater function as a recipe card handed to the kitchen. In Strict Mode development, the kitchen cooks every recipe card twice to verify the calculation and throws one dish away. The recipe card must only calculate and return the next state, and never call another setter or log messages.
- **A button handler that updates a state variable only once per click gets the exact same result from a plain value and from an updater.** React always finishes rendering the current click before the next click begins. You only need an updater function when more than one update of the same state variable can be queued before the next render.

```tree caption="Code written inside an updater function vs. code written inside the event handler outside the setter."
Where a line of code runs when you click a button
- !Inside the updater function [inside the updater body] | React decides when it runs, mostly during the next render | Must be pure: Strict Mode calls it twice in development and keeps one result
- +Inside the event handler [outside setCount] | Runs once at the moment of the click | Event handlers do not need to be pure and are never called twice by Strict Mode
```

### Mistake: Putting console.log or side effects inside an updater function

Watch what happens in the scoreboard when a developer puts `console.log` inside the updater function of `addPoint`:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    setScore(s => {
      ~console.log('Point for Home');~ // Side effect placed inside an updater function
      return s + 1;
    });
  }
```

In development, the startup file wraps the application in Strict Mode. Watch what happens when the scorekeeper clicks `+3` once from `Home: 0`:

1. In Chrome Console panel, the message does not print three times. Because Strict Mode calls each updater function twice in development, the log prints six times for a single `+3` click.
2. Startled by six Console messages, the developer looks at the scoreboard expecting `Home: 6`.
3. The scoreboard reads `Home: 3`, the correct score.

### Why StrictMode calls each updater twice in development and keeps one result

Clicking `+3` called `addPoint` only three times, and each call queued one updater function. Who called them twice, and why did the score still stop at `Home: 3`?

In development, React Strict Mode intentionally calls every component function, initializer function, and updater function twice to help you catch accidental side effects early:

1. When the scorekeeper clicks `+3`, the handler hands three updater functions to `setScore`. React queues all three updaters, and `handleThree` returns.
2. During the next render of `Scoreboard`, React walks the queue. Under Strict Mode, React calls each updater function twice. Every updater runs twice with the same pending state `s`.
3. Both runs call `console.log`, printing the log message twice for each queued updater.
4. For the state itself, React keeps only one return value of each pair and throws the other one away. The running result still steps from zero to one, then two, and finally three. In a production build, React calls each updater only once.

### Keeping the updater pure and placing logs inside the handler

Event handlers and the helpers they call run on the click, not during rendering. Strict Mode never calls an event handler twice.

To log once per point, move `console.log` out of the updater function and place it directly inside `addPoint` above the setter:

```jsx title="src/components/Scoreboard.jsx" startLine="7"
  function addPoint() {
    ~console.log('Point for Home');~ // 1. Runs in the handler on the click: logged once per addPoint call
    ~setScore(s => s + 1);~ // 2. Pure updater function: only calculates and returns s + 1
  }
```

Save the file and click `+3` once from `Home: 0`. The Console prints the message three times, once for each point, and the scoreboard shows `Home: 3`.

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
Strict Mode runs each updater twice and keeps only one of its two return values, duplicating the log while keeping `Home: 3`.
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

When do you actually need an updater function? Here are the four situations:

1. **Multiple updates of the same state before the next render.** Whenever one event queues more than one update for the same state variable, use an updater function so every update calculates from the latest pending state. That includes calling helpers such as `addPoint` several times in one click.
2. **Only one update of that state in the click.** When a click handler updates a state variable only once, a plain value such as `score + 1` works cleanly without any bug. React always updates the state before the next intentional user click can run.
3. **The running handler itself needs the new value right away.** Neither a plain value nor an updater function changes `score` inside the running handler. When the click handler must pass the new number to an alert or a log right away, save `score + 3` in a local variable first.
4. **One state variable depends on a different state variable.** Never call one state setter from inside another state variable updater function. When one state update depends on the value of a different state variable, combine those states into one object managed by a reducer.

```tree caption="How to choose the right state update tool for each situation in React."
Which state update pattern fits your handler?
- +Several updates of the SAME state before next render [addPoint called 3 times, or after await] | Use an updater function | Each queued update receives the latest pending state s
- +One update of that state per click [setLastPlay or a single score change] | Pass next value directly, or use an updater by team habit | React finishes the render before the next click starts
- +Running handler must read the new number right now [for console.log or alert] | Save const nextScore = score + 3 first | Gives the running handler the new value immediately
- !Next state depends on a DIFFERENT state variable [calling a setter inside an updater] | Do not call setters inside an updater | Keep updaters pure; combine related states in a reducer
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
>     ~console.log('Point for Home');~ // React calls updater functions during render, and calls them twice in StrictMode
>     return s + 1;
>   });
> }
> ```

---

## Putting All Five Principles Together

### The complete project files

Here are all three JavaScript files of the finished basketball scoreboard working together.

First, the startup file mounts the application inside Strict Mode:

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
    ~setLastPlay('Free throw');~ // Principle 1 and 2: single update per click uses a direct value and batches with score
  }

  function handleTwo() {
    addTwo();
    setLastPlay('Two-pointer');
  }

  function handleThree() {
    ~addPoint();~ // Principle 4: queues s => s + 1 first
    ~addTwo();~ // Principle 4: queues s => s + 2 second -> steps 0 -> 1 -> 3
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

When the scorekeeper clicks the three-point button from zero, React runs every line of `handleThree` first. `addPoint` logs once to the Console and queues its one-point updater. `addTwo` queues its two-point updater, and `setLastPlay` queues the new play text. Once `handleThree` returns, React renders `Scoreboard` once, walks the score queue from zero to one to three, and commits the finished board to the DOM:

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
- +1. Run handleThree to the end [event handler phase] | Logs Point for Home once; queues s => s + 1 and s => s + 2 for score; queues Three-pointer for lastPlay
- +2. Walk both queues in one render [batching phase] | score queue steps from 0 to 1 to 3; lastPlay queue replaces with Three-pointer
- +3. Commit once to the DOM [commit phase] | Updates the page to Home: 3 and Last play: Three-pointer at the same moment
```

---

## Summary: Five Principles of Batching and Updater Functions

**PRINCIPLES:** When an event handler calls a state setter, React does not stop the handler and redraw the screen right away. Instead, React adds each update to a queue and processes the whole queue in one render after the handler finishes. Following what goes into that queue and when React runs it gives us five practical rules:
1. **Principle 1: React Batches All Setter Calls into One Render**: React runs every line of an event handler first, even code written after the setter calls. It renders the page once with all state variables updated together.
2. **Principle 2: A Value Update Commands React to Replace the State**: Calling `setScore(score + 1)` commands React to replace the state with that calculated number. Every line in the handler reads the same snapshot, so calling `setScore(score + 1)` three times queues the same replacement number three times.
3. **Principle 3: An Updater Function Continues from the Pending State**: Passing a function to a setter adds the function itself to the queue. During the next render, React calls each queued updater in order and passes it the pending state from the step before it.
4. **Principle 4: React Walks the Queue in Order**: When a queue holds both value replacements and updater functions for the same state variable, React walks them in order. An updater builds on the running result, whereas a value replacement wipes out every update queued before it.
5. **Principle 5: Updaters Run During Render and Must Be Pure**: React decides when to call updater functions, mostly during the next render, and calls each one twice in Strict Mode. Every updater must be pure with zero side effects or logs inside it.

Here is the complete overview of all five principles:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Batching: One Render After the Whole Handler Finishes** | Developers expect the screen to change between two setter lines or while a pop-up is still open. Interviewers ask why updating two state variables does not trigger two renders. | React runs the entire event handler first, batches all its setter calls together, and updates the screen in one single render at the end. |
| **Principle 2** | **Value Updates Replace: Three Snapshot Calls Add One** | Calling a one-point helper three times in one click only raises the score by one point, with zero Console warnings. | Calling `setScore(score + 1)` queues a replacement. Three calls from the same snapshot command "replace with 1" three times. |
| **Principle 3** | **Updater Functions Continue from the Pending State** | An updater function lets multiple updates of the same state in one event build on each other. Reading the outer snapshot name inside the updater breaks the fix. | Pass a function to the setter so React calls it during the next render with the pending state from the update before it. |
| **Principle 4** | **Queue Order: A Value Placed After Updaters Wipes Them Out** | Mixing a value helper and an updater helper for the same state gives different totals depending on which line runs first. | React walks the queue from top to bottom. An updater adds to the running result, while a plain value replaces the running result and ignores earlier slips. |
| **Principle 5** | **Keep Updaters Pure and Use Them When Updates Stack Up** | Putting a Console log or side effect inside an updater runs twice per update in Strict Mode development. Interviewers ask whether every setter needs an updater. | Keep updaters pure because React decides when they run, mostly during render. Use an updater when several updates of the same state can be queued before the next render. |

### The Naive Expectation vs. The React Rule

| Aspect | The Naive Expectation | The React Rule |
| :--- | :--- | :--- |
| **When setter calls update the screen** | Expects each setter line to re-render the screen immediately before the next line of the handler runs | React **batches** all setter calls in one handler and renders **once** after the entire handler finishes |
| **Separate user clicks** | Wonders if fast button clicks get merged into one batch | React **never** batches across separate intentional clicks. Each click renders before the next click runs |
| **Calling `setScore(score + 1)` three times** | Expects three `setScore(score + 1)` calls in one handler to add three points | Each value call reads the **same snapshot** and queues **replace with that number**, so three calls add **one** |
| **Passing an updater function** | Treats `s => s + 1` as just a longer spelling of `score + 1` | React queues the function and calls it during the next render with the **pending state** `s`, so three calls add **three** |
| **Mixing values and updaters** | Assumes adding two and adding one gives the same total in either order | React walks the queue in order. An updater builds on the running result, while a plain value **replaces** and wipes out earlier slips |
| **Side effects inside updaters** | Puts `console.log` or another setter inside an updater, thinking it runs once on the click | React decides when updaters run, mostly **during render**, so they must be **pure**. Strict Mode calls each updater twice in development and discards one result |

---

## For the Interview

> **The Interview Question:** How does React queue multiple state updates, and when do you need an updater function?

### How to Answer Clearly in 30 Seconds

"Calling a state setter does not change the state variable in the running render. It adds an update to React queue and requests a new render. React uses batching: it waits until all code in the event handler has finished before processing the queued updates in a single render. That keeps the app fast and prevents half-finished screens when several state variables change together. Each separate user click is still handled on its own.

What happens inside the queue depends on what we pass to the setter:

1. **Calling the setter with a calculated value**, such as `setCount(count + 1)`, commands React to REPLACE the state. Every line in a handler reads the same render snapshot, so calling `setCount(count + 1)` three times queues the same replacement number three times. The count only goes up by one.
2. **Passing an updater function**, such as `c => c + 1`, adds the function itself to the queue. During the next render, React walks the queue in order and calls each updater with the pending state from the step before it, so three calls add three. If a plain value and an updater are mixed in the same queue, their order matters because a plain value overwrites whatever running result came before it.
3. **Purity and when to use one.** React decides when updater functions run, mostly during rendering. Strict Mode calls each one twice in development and discards one result, so updaters must be pure calculations with no side effects. You need an updater whenever the next state depends on the previous state and multiple updates of that same state can be queued before the next render. For a single update per click, a plain value works fine because React renders before the next click. Cross-state calculations belong in a reducer."

### Three Classic Follow-Up Questions Interviewers Ask

1. **When `number` starts at zero, what does a click show after calling `setNumber` with `number + 5` and then an updater, or in reverse order?**
   - When `number + 5` comes first and the updater comes second, the screen shows six. In the render where `number` is zero, the first call queues replace with five, and the second call queues the updater. During the next render, React sets the running result to five and then calls the updater with five, returning six.
   - When we swap the two lines so the updater comes first and `number + 5` comes second, the screen shows five. The updater runs first and turns zero into one, and then the value slip replace with five ignores that one and overwrites the running result with five. Placing a plain value call with `42` at the very end after updaters overwrites everything before it and renders `42`.

2. **Why must an updater function be pure, and why did a `console.log` inside my updater print twice in development?**
   - Even though an updater function is written inside an event handler, it is not event handler code. React decides when to call it. React calls most updaters during the next render, and it may call the first one once right inside the setter call to check whether the state will change. Because rendering must be pure, an updater must only calculate and return the next state from its parameter. It must not mutate outside variables, call setters, or log. In development under Strict Mode, React calls each updater function twice with the same pending state. It keeps only one of the two return values, and the extra call helps expose side effects. Event handlers themselves do not need to be pure and are never called twice by Strict Mode, so logs and side effects belong in the handler.

3. **Should I always pass an updater function to every state setter, or only in specific cases?**
   - You do not have to use an updater on every setter call. For intentional user clicks, React always finishes rendering the current click before the next click runs, so a single update per click works cleanly with `count + 1`.
   - You must use an updater whenever the next state builds on the previous state and multiple updates of that same state can queue up before the next render. That happens when a handler calls a helper function several times in one click, or updates state after an asynchronous wait while other updates may have occurred. Writing an updater every time state builds on its own previous value is also a fine team convention. State calculated from another variable belongs in a reducer.

```tree dir=right caption="Interview comparison: passing a next value directly vs. passing a pure updater function to a state setter."
Two kinds of entries in React state update queue
- +Direct value [count + 1] | Calculated now from this render fixed snapshot | Queues replace with that value, ignoring earlier slips; fits one update per click
- +Updater function [c => c + 1] | Pure function called by React, mostly during the next render | Receives the pending state from the slip before it; needed when multiple updates of the same state are queued
```
