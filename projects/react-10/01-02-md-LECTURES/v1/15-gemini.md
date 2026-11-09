# Lecture 15: State as a Snapshot
> INTERVIEW QUESTION | ❱ CORE | Why does state appear frozen inside a render, even right after you set it?

---

## The Collision Between Synchronous Execution and Scheduled Render Snapshots

### Variable mutation vs. scheduled render dispatch

Developers clicking a button in React often expect imperative execution. They expect to change a variable on line 1 and read its updated value on line 2.

In React, calling a state setter does NOT change the variable in your hands.

Look at what happens when a click handler updates `count` and logs `count` on the very next line:

```jsx title="Setting count and logging count on the next line"
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    ~setCount(count + 1);~ // 1. Schedules a new render with 1; leaves count at 0 here
    ~console.log(count);~ // 2. Still prints 0 in the Console!
  }

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

Click the button once. Two things happen at the same time:
1. The button label on the screen updates from `Count: 0` to `Count: 1`.
2. Chrome's Console panel prints `0`, not `1`.

This is not a bug, and `setCount` did not fail. It reveals the foundational architectural collision of React's execution model:
- **Plain JavaScript assignment is immediate and in-place**: Reassigning a variable in plain JavaScript reaches directly into memory and mutates the value on that exact line.
- **React state setters are scheduled dispatchers**: Calling the setter leaves the local constant `count` untouched at `0`. It stores `1` inside React and asks React to call `Counter` again for a new render.

Look at both approaches side by side in plain code:

```js title="Plain JavaScript: reassigning a variable in place"
let count = 0;
~count = count + 1;~ // 1. Reassigns the variable count in place right now
~console.log(count);~ // 2. Prints 1 immediately
```

The official React documentation illustrates this with two grounded mental models:
1. **The Restaurant Kitchen Ticket**: Calling `setCount` is like handing an order ticket to a restaurant kitchen. Handing the ticket to the kitchen does not magically replace the food currently sitting on your dining table. The new dish arrives only when the kitchen prepares and delivers the next serving, which is the next render.
2. **The Snapshot Photograph**: In everyday life, a **snapshot** is a photograph taken at one specific moment. If someone walks across the room after you click the shutter, the people inside the printed photograph do not move. In React, every render is an immutable snapshot of your component, evaluated with the state values of that specific moment. State does not live inside your function. It lives on React's internal shelf. When React calls your component, it hands your function a fixed snapshot for that render. Calling `setCount` places an order on the shelf for the next render, leaving the snapshot in your running function untouched.

```tree caption="Why plain JavaScript assignment changes a variable right away, while a React state setter asks for the next render."
Plain JavaScript assignment vs. React state setter
- !Plain JavaScript assignment [`count = count + 1`] | Changes the variable `count` **in place on that exact line** | The next line reads the **new value `1`** right away
- +React state setter [`setCount` with `count + 1`] | Puts `1` on React's shelf for the **next render** and leaves `count` untouched | The next line still reads this render's **snapshot value `0`**, while the button updates to **`Count: 1`** on the next render
```

### What is at stake: the loudspeaker desynchronization

What is at stake is preventing desynchronization between user interface displays, audio announcements, and outbound network requests.

Picture the ticket number screen above a bakery counter. The display board shows the ticket currently being served, starting at `12`. Underneath sits a loudspeaker announcement line and a `Next customer` button.

When the counter clerk clicks `Next customer`, the handler must accomplish two tasks:
1. Advance the serving counter on the board from `12` to `13`.
2. Announce the new customer on the loudspeaker: "Number 13, please come to the counter."

Suppose the developer calls `setNumber` and then immediately constructs the loudspeaker announcement by reading `number`.

The page now displays the wrong information. On the display board, the number flips to `Now serving: 13`. But the loudspeaker broadcasts: "Number 12, please come to the counter!" Customer 12, who already collected their bread and sat down, walks back to the counter confused. Customer 13 keeps waiting by the door.

In a banking portal or e-commerce checkout, this mistake causes serious defects. It charges an old cart total or sends an outdated user ID across the network while the screen displays the new numbers.

Whenever an event handler needs a state value after calling its setter, you have two choices:
1. **Choice A: Read the state variable `number` again.** Because `number` is frozen at this render's snapshot value, reading it after `setNumber` always gives the old number from before the click. That only fits when you intentionally want the old number.
2. **Choice B: Calculate the next value once in a local constant.** Add one to `number` first and store that result in `nextNumber`. Then pass `nextNumber` both to `setNumber` and to every other line that needs the new number right away.

```tree caption="The two ways a click handler can read a value after calling a state setter."
Two ways to use a value inside the handler that sets it
- !Way 1: Read the state variable `number` after `setNumber` [Call `setNumber` then read `number`] | `number` still holds **this render's old snapshot value `12`** | Screen shows **`Now serving: 13`**, while the announcement calls **`Number 12`**
- +Way 2: Calculate `nextNumber` once in a constant [`const nextNumber = number + 1`] | Pass `nextNumber` to `setNumber` **and** to the announcement line | Both the screen and the announcement use the **new number `13`**
```

Our bakery queue project is split across four small files:

```files title="bakery-queue: File Explorer" caption="How our bakery queue project is organized across index.html, src/main.jsx, src/App.jsx, and src/components/QueueBoard.jsx."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `StrictMode`, `createRoot`, and `App`, and mounts `App` into `#root`
  App.jsx | parent | Exports `App` as default and imports `QueueBoard` from `./components/QueueBoard.jsx`
  components/
    QueueBoard.jsx | state | Exports `QueueBoard` as default and imports `useState` from `react`
```

### The four invariants of state snapshots

**PRINCIPLES:** Every time React calls your component function, it hands that call a fixed snapshot of the state. Four practical rules explain how that snapshot behaves during a click and how to work with it cleanly:
1. **Principle 1: Calling a Setter Schedules the Next Render; It Never Mutates the Running Constant**: State setters update what `useState` returns on the next render; they never alter the local variable inside the running handler.
2. **Principle 2: Every Render Captures a Fixed Snapshot; Handlers Are Sealed by JavaScript Closures**: Every render creates fresh event handlers that close over that render's state constants, so reading state before or after the setter yields the identical value.
3. **Principle 3: Asynchronous Timers Keep the Snapshot of the Click That Created Them**: State values never mutate within a render, even inside delayed callbacks such as `setTimeout` that fire seconds after the screen has moved on.
4. **Principle 4: Store the Next Value in a Local Constant Before Calling the Setter**: To use the upcoming state value right away, compute it once in a local constant. Pass that constant to the setter, secondary updates, and timers.

Here is the complete overview of all four principles before we build and test each one:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Setters Schedule Future Renders** | Developers call a setter, log the state variable on the next line, see the old value, and think the setter failed. | A state setter only updates what `useState` returns on the next render; it never mutates the variable in the running handler. |
| **Principle 2** | **Closures Seal Render Handlers** | Moving a read line above the setter changes nothing, and interviewers ask how closures tie each handler to one render. | Every render gets its own fixed state constant, and every handler created in that render closes over that render's value. |
| **Principle 3** | **Timers Preserve Click Snapshots** | A timer firing seconds after the screen updated still reads the old click's state value, surprising developers who expected waiting to help. | Even delayed functions such as `setTimeout` read the snapshot of the render whose handler started them. |
| **Principle 4** | **Buffer Next Values in Local Constants** | Reading state after setting it causes off-by-one errors in announcements, logs, and network payloads. | Calculate `const next = count + 1` once and pass it to every immediate and delayed consumer. |

---

## 1. Principle 1: Calling a Setter Schedules the Next Render; It Never Mutates the Running Constant

### Project architecture: the bakery counter queue

Let us build the bakery queue board and inspect how React schedules renders. First, our startup file mounts `<App />` inside `<StrictMode>`:

```jsx title="src/main.jsx" startLine="1"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  ~<StrictMode>~ {/* Calls components twice in development, and runs click handlers once */}
    <App />
  </StrictMode>
);
```

Next, our main application file imports and renders `<QueueBoard />`:

```jsx title="src/App.jsx" startLine="1"
import ~QueueBoard~ from './components/QueueBoard.jsx'; // 1. Imports QueueBoard from the components folder

export default function App() {
  return ~<QueueBoard />~; // 2. Renders the bakery queue board
}
```

### The off-by-one desynchronization: screen shows 13 while announcement calls 12

Now look at the queue board file. The component keeps two state values: `number`, starting at 12, and `announcement`, starting at the welcome message.

Inside the click handler, the developer calls `setNumber`, and on the very next line builds the announcement string from `number` and logs that variable to the Console:

```jsx title="src/components/QueueBoard.jsx" startLine="1"
import { useState } from 'react';

export default function QueueBoard() {
  const [number, setNumber] = ~useState(12)~; // 1. First render starts with number equal to 12
  const [announcement, setAnnouncement] = useState(
    'Welcome! Please take a number.'
  );

  function handleNext() {
    setNumber(number + 1);
    ~setAnnouncement('Number ' + number + ', please come to the counter');~ // **WRONG:** number is still 12 here!
    ~console.log(number);~ // **WRONG:** logs 12 instead of 13!
  }

  return (
    <main>
      <h1>Bakery Queue</h1>
      <p className="now-serving">Now serving: {number}</p>
      <p className="announcement">{announcement}</p>
      <button className="next-btn" onClick={handleNext}>
        Next customer
      </button>
    </main>
  );
}
```

The screen and the loudspeaker are desynchronized: the board displays ticket 13, but the loudspeaker announces customer 12.

**Calling a state setter does not mutate the variable in the running code; it stores the next value inside React and asks for a new render.** Here is how that desynchronization unfolds step by step:
1. When the page first loads, the board shows `Now serving: 12` above the welcome message.
2. The clerk clicks `Next customer` once.
3. On the screen, the top line updates to `Now serving: 13`, while the announcement line underneath calls customer `12` to the counter.
4. Customer 12, who was already served, walks back to the counter, while customer 13 keeps waiting.
5. Puzzled, the developer opens the Console, sees `12`, and assumes `setNumber` failed or was too slow.
6. The clerk clicks `Next customer` a second time. Now the top line shows `Now serving: 14`, the announcement calls customer 13, and the Console logs `13`. The announcement remains permanently one customer behind.

::: row caption="What the bakery queue screen and Console show on first load, after the first click, and after the second click."
::: col title="1. First Load" tag="number is 12" tone=plain
```page size=mini
heading: Bakery Queue
line: Now serving: 12 | good
line: Welcome! Please take a number.
button: Next customer
```
```devconsole
= No messages
```
The board starts at customer `12`.
:::
::: col title="2. After Click 1" tag="announcement is 1 behind" tone=bad
```page size=mini
heading: Bakery Queue
line: Now serving: 13 | good
line: Number 12, please come to the counter | bad
button: Next customer
```
```devconsole
+ 12
```
The screen serves `13`, while the announcement and Console still say `12`.
:::
::: col title="3. After Click 2" tag="still 1 behind" tone=bad
```page size=mini
heading: Bakery Queue
line: Now serving: 14 | good
line: Number 13, please come to the counter | bad
button: Next customer
```
```devconsole
+ 12
+ 13
```
The screen serves `14`, while the announcement and Console say `13`.
:::
:::

### The execution timeline: why 13 lives in React's memory while 12 stays in your hands

Look closely at `handleNext` in the queue board file. Not a single line inside `handleNext` assigns 13 to `number`. The function only passes `number + 1` to `setNumber`.

**React stores 13 on its internal shelf for the upcoming render, while JavaScript keeps the running function permanently bound to the constant 12.** Here is what JavaScript and React do in chronological order across the render lifecycle (as seen in Lesson 13):
1. **First render**: React calls `QueueBoard`. In this first call, `useState` returns 12, and JavaScript creates the local constant `number` with the value 12.
2. **The click runs `handleNext`**: The clerk clicks the button. Inside `handleNext`, calling `setNumber` with 12 plus 1 stores 13 on React's shelf and asks React for a new render.
3. **The rest of `handleNext` finishes with `12`**: The next line calls `setAnnouncement` using `number`. Because `number` in this first render is still 12, it builds the announcement for customer 12, and `console.log` prints 12. Even if you read the browser DOM on this line, it would still say `Now serving: 12`, because React has not committed the new render yet.
4. **Second render**: Now that `handleNext` has finished, React calls `QueueBoard` a second time. In this second call, `useState` returns 13 from the shelf into a brand-new constant `number`, and returns the customer 12 announcement string.
5. **Commit to the screen**: React updates the browser DOM so the page displays `Now serving: 13` above the announcement for customer `12`.

```tree dir=right caption="The five chronological steps from the first render with 12 to the second render with 13."
What happens when the clerk clicks `Next customer` once
- +1. Render 1 [`useState` returns `12`] | JavaScript creates constant **`number = 12`** for this call
- +2. `setNumber` runs [`setNumber` receives `13`] | Stores **`13` inside React** and requests a new render
- !3. Next lines in `handleNext` [`setAnnouncement` and `console.log`] | `number` in Render 1 is **still `12`**, so it stores **`"Number 12..."`** and logs **`12`**
- +4. Render 2 [`QueueBoard` runs again] | `useState` returns **`13`** into a **new constant `number`**
- !5. Screen updates [Browser DOM commit] | Top line shows **`Now serving: 13`**, while announcement shows **`Number 12, please come to the counter`**
```

### Reassigning the variable fails: why const and let behave identically with setters

When developers notice that `number` stayed 12 after calling `setNumber`, they often experiment with two failed workarounds:

- **Choice A: Declaring state with `let`.** You replace `const [number, setNumber]` with `let [number, setNumber]`. This changes nothing. Look at the code:

```jsx title="src/components/QueueBoard.jsx" startLine="4"
  ~let~ [number, setNumber] = useState(12); // Changing const to let changes nothing!
  const [announcement, setAnnouncement] = useState(
    'Welcome! Please take a number.'
  );

  function handleNext() {
    setNumber(number + 1);
    ~console.log(number);~ // Still logs 12! setNumber cannot reassign a local variable
  }
```

The Console still logs `12`. The setter `setNumber` is an outside function. Passing `number + 1` to `setNumber` hands over the value 13. The setter has no access to reach into your component's stack frame and reassign your local variable `number`.

- **Choice B: Direct variable reassignment.** You try to force the state variable to change by reassigning `number` directly inside the handler:

```jsx title="src/components/QueueBoard.jsx" startLine="9"
  function handleNext() {
    ~number = number + 1;~ // **WRONG:** cannot reassign a const state variable!
    setNumber(number);
  }
```

Save the file, and the dev server shows no warning on load. The page renders `Now serving: 12`. The defect triggers on the clerk's click. On that click, JavaScript halts execution and throws `TypeError` in the Console, because a constant variable cannot be reassigned:

```devconsole
x Uncaught TypeError: Assignment to constant variable.
```

Because execution stopped on line 1, `setNumber` never runs, and the screen stays stuck on `Now serving: 12`.

The production build catches the same mistake earlier. When you run `npm run build`, Vite halts compilation and points directly at `number`:

```text title="Terminal: npm run build"
[ILLEGAL_REASSIGNMENT] Unexpected re-assignment of const variable `number`
```

Keeping state variables declared with `const` protects you from attempting to mutate state in place.

> [!PRINCIPLE]
> **Principle 1: Calling a Setter Schedules the Next Render; It Never Mutates the Running Constant**
>
> *Calling a state setter stores the next value inside React for the next render; it never changes the state variable in the code that is already running.*
>
> Calling a state setter queues a render with the new value on React's shelf. It does not alter the local constant in the executing function frame. Reading the state variable right after calling the setter yields the old snapshot value from before the click.
>
> **DO THIS:**
> ```jsx
> function handleNext() {
>   setNumber(number + 1);
>   ~console.log(number);~ // Expected: logs 12, the snapshot value of the currently executing render
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleNext() {
>   setNumber(number + 1);
>   ~setAnnouncement('Number ' + number + ', please come to the counter');~ // **WRONG:** expects number to be 13 here, but it is still 12!
> }
> ```

---

## 2. Principle 2: Every Render Captures a Fixed Snapshot; Handlers Are Sealed by JavaScript Closures

### Moving the read above the setter changes nothing

Reading `number` before the setter and reading `number` after the setter produce the exact same value. Both statements execute inside the identical render snapshot, where `number` is permanently bound to `12`.

Look at what happens when you log `number` both before and after `setNumber`:

```jsx title="Reading number before the setter vs. after the setter in the same handler"
function handleNext() {
  ~console.log(number);~ // 1. Before setNumber: logs 12
  setNumber(number + 1);
  ~console.log(number);~ // 2. After setNumber: ALSO logs 12!
}
```

Reading `number` before the setter logs `12`. Reading `number` after the setter also logs `12`. The setter call in the middle changes nothing in this function call.

### Handlers from separate renders are distinct functions sealed with different values

How can clicking the button a second time read 13 instead of 12, when `handleNext` is written only once in the file?

Because each render creates a brand-new handler function in memory. Look at this mechanism in plain JavaScript:

```js title="Plain JavaScript: each call to render creates its own handleNext closure"
function render(number) {
  function handleNext() {
    console.log(number);
  }
  return handleNext;
}

const first = render(12);
const second = render(13);

~first();~  // 1. Prints 12: first closed over number = 12
~second();~ // 2. Prints 13: second closed over number = 13
~first();~  // 3. Still prints 12!
```

Look at `first` and `second`. They come from the exact same function lines and both log `number`, so they look like the same function, but they are NOT the same function:
1. When `render` ran with 12, JavaScript created a local variable `number` holding 12. It also created the `first` function, which closed over 12 like sealing `12` inside an envelope.
2. When `render` ran with 13, JavaScript created a second local variable `number` holding 13. It then created a second function `second`, which sealed `13` inside its own envelope.
3. Even after the second call to `render` has finished, calling `first` again opens the first envelope and prints 12.

```tree caption="Each call to the outer function creates a separate inner handler sealed with that call's snapshot value."
Why `first` and `second` are NOT the same function in memory
- +First call [`first` from `render` with `12`] | Creates `handleNext` sealed with **`number = 12`** | Every line inside `first` reads **`12`**, before or after any other call
- +Second call [`second` from `render` with `13`] | Creates a **new `handleNext`** sealed with **`number = 13`** | Every line inside `second` reads **`13`**
```

### The substitution method: tracing handlers by replacing variables with raw numbers

This gives you a clear diagnostic tool to trace any render's code, called the **substitution method**. Take one render of your component, like inspecting one snapshot photo. Then replace every occurrence of `number` inside that render with its literal value, such as 12 in the first render and 13 in the second render.

Look at what happens if a developer moves the announcement update and log line above `setNumber`, hoping that reading earlier will bypass the issue:

```jsx title="src/components/QueueBoard.jsx" startLine="9"
  function handleNext() {
    ~setAnnouncement('Number ' + number + ', please come to the counter');~ // **WRONG:** moved above setNumber, and still reads 12!
    ~console.log(number);~ // **WRONG:** still logs 12 on the first click!
    setNumber(number + 1);
  }
```

**Moving a state read above the setter makes zero difference: the handler closes over the snapshot value of that render from its opening line to its closing brace.** Here is what happens when you test this in the browser:
1. The clerk clicks `Next customer` once. The screen shows `Now serving: 13` above the customer 12 announcement, and the Console logs `12`. Moving the read above the setter changed nothing.
2. The developer reloads the page to reset the board to 12, then clicks `Next customer` twice in rapid succession.
3. After the two back-to-back clicks, the top line shows `Now serving: 14`, the announcement calls customer 13, and the Console logs 12 followed by 13. The second click read `13`.

Using the substitution method, look at the two separate `handleNext` functions that JavaScript creates across the first two renders:

```jsx title="The substitution method: replacing number with 12 in Render 1 and 13 in Render 2"
function handleNextInRender1() {
  ~setAnnouncement('Number ' + 12 + ', please come to the counter');~ // 1. Render 1 substitutes 12 for number
  console.log(12);
  ~setNumber(12 + 1);~ // 2. Asks React for 13 on the next render
}

function handleNextInRender2() {
  ~setAnnouncement('Number ' + 13 + ', please come to the counter');~ // 3. Render 2 substitutes 13 for number
  console.log(13);
  ~setNumber(13 + 1);~ // 4. Asks React for 14 on the next render
}
```

**Every render creates a brand-new handler function in memory; each handler is sealed to its render's state constant by a JavaScript closure, and React attaches the newest handler before the user can click again.** Here is the chronological execution path:
1. **Render 1 with `12`**: React calls the queue board component, and `useState` returns `number` as 12. JavaScript creates Render 1's `handleNext` function, which closes over `12`.
2. **React attaches Render 1's `handleNext` to the button**: Until someone clicks, the button holds Render 1's handler.
3. **Click 1 runs Render 1's `handleNext`**: Whether `setAnnouncement` sits above `setNumber` or below it, the serving number inside this function is 12. It logs `12`, sets the announcement for customer 12, and asks React to render with `13`.
4. **Render 2 with `13`**: React calls the queue board component again, and `useState` returns a new constant `number` as 13. JavaScript creates a brand-new `handleNext` function for Render 2 that closes over `13`.
5. **React attaches Render 2's `handleNext` before the next click**: React commits the new DOM and connects Render 2's `handleNext` to the button before the next user click can fire. When the second click happens, even immediately, it runs Render 2's handler and reads `13`.

Two practical invariants follow from this design:
1. **Click handlers never start with stale state**: React guarantees that state updates and DOM commits finish before processing subsequent user input events. A click handler always begins with the fresh snapshot of its render.
2. **Multiple setter calls evaluate the identical snapshot**: Calling `setNumber` three times in one handler evaluates 12 + 1 three times, incrementing by 1 rather than 3. Queuing consecutive updates requires an updater function (as seen in Lesson 16).

```tree caption="Three snapshots across three renders: each render creates its own number constant and its own handleNext closure."
How each render gets its own snapshot and its own `handleNext`
- +Render 1 [`number` is `12`] | `handleNext` #1 closes over **`12`** | Click 1 runs `handleNext` #1, logs **`12`**, and asks React for **`13`**
- +Render 2 [`number` is `13`] | `handleNext` #2 closes over **`13`** | Click 2 runs `handleNext` #2, logs **`13`**, and asks React for **`14`**
- +Render 3 [`number` is `14`] | `handleNext` #3 closes over **`14`** | Ready on the button for the next click with **`14`**
```

> [!PRINCIPLE]
> **Principle 2: Every Render Captures a Fixed Snapshot; Handlers Are Sealed by JavaScript Closures**
>
> *Each render creates its own state constant and its own event handlers, and every handler closes over the state value of the render that created it.*
>
> Because event handlers are defined inside the component, each render instantiates fresh handlers that close over that render's state constants. Inside that execution, the state variable holds one immutable value from top to bottom. Moving a read line above the setter produces the exact same old snapshot value.
>
> **DO THIS:**
> ```jsx
> function handleNext() {
>   ~console.log(number);~ // Reads this render's snapshot: 12
>   ~setNumber(number + 1);~ // Calculates 12 + 1 and asks React for 13 on the next render
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleNext() {
>   ~setAnnouncement('Number ' + number + ', please come to the counter');~ // **WRONG:** moving the read above setNumber still reads the old snapshot 12!
>   setNumber(number + 1);
> }
> ```

---

## 3. Principle 3: Asynchronous Timers Keep the Snapshot of the Click That Created Them

### Time does not mutate closures: setTimeout still sees the past

Time does not mutate closures. A function passed to `setTimeout` captures the snapshot of the render that created it, regardless of how many seconds pass or what new numbers appear on screen.

Look at how a delayed timer behaves inside a JavaScript closure:

```js title="Plain JavaScript: a timer started inside a closure"
function render(number) {
  return function handleNext() {
    ~setTimeout(() => console.log(number), 300);~ // Waits 300ms, then logs the number sealed in this call
  };
}

~render(12)();~ // 1. Starts a timer inside the call where number is 12; prints 12 after 300ms
~render(13)();~ // 2. Immediately runs a second call where number is 13; prints 13 after 300ms
```

Two nuances explain this behavior:
1. **Waiting does not alter closures**: A state variable's value never changes within a render. The timer callback was instantiated inside the render where `number` was 12, so it sealed `12` inside itself. Think of it like dropping a sealed letter into a delayed mailbox. When the letter is opened three seconds later, the paper inside still reads what was written when the envelope was sealed.
2. **Snapshot retention prevents race conditions**: When two clicks occur one second apart, each timer retains the snapshot of the click that scheduled it. Click 1's timer remembers customer 12, and Click 2's timer remembers customer 13. Neither timer overwrites the other.

```tree caption="A function passed to setTimeout is like a sealed letter: when the timer opens it seconds later, it still holds the snapshot of the render that created it."
Does waiting inside `setTimeout` change what `number` holds?
- !What you might expect [`setTimeout` waits 3 seconds] | Screen has already changed to **`Now serving: 13`** | You might expect `number` inside the timer to become **`13`**
- +What actually happens [Arrow function closes over Render 1's `number`] | Sealed with **`number = 12`** when Click 1 ran | Three seconds later, the timer still reads **`12`** from its own click snapshot
```

### The zombie announcement: calling ticket 12 while ticket 13 sits on screen

In our bakery, customers sometimes miss their initial announcement while chatting. The developer adds a three-second timer at the bottom of `handleNext` to display a last-call reminder:

```jsx title="src/components/QueueBoard.jsx" startLine="9"
  function handleNext() {
    setNumber(number + 1);
    setAnnouncement('Number ' + number + ', please come to the counter');
    setTimeout(() => {
      ~setAnnouncement('Last call for number ' + number);~ // **WRONG:** 3 seconds later, number in this closure is STILL 12!
      ~console.log('timer reads ' + number);~ // **WRONG:** prints "timer reads 12" while the screen says 13!
    }, 3000);
  }
```

The asynchronous timer announces the past: three seconds after the screen displays ticket 13, the announcement changes to a last call for ticket 12.

**Asynchronous callbacks stay sealed to their original snapshot: waiting three seconds does not give the timer access to future state because the closure permanently locked number to 12.** Watch what happens step by step:
1. Right after the click, the screen updates to `Now serving: 13` above the customer 12 announcement.
2. For three full seconds, the page displays `Now serving: 13` in the browser.
3. Three seconds after the click, the timer fires. Even though the screen has shown `13` for three seconds, the announcement line changes to a last call for number 12, and the Console logs `timer reads 12`.

::: row caption="Right after Click 1 vs. three seconds later when the setTimeout callback runs."
::: col title="1. Right After Click 1" tag="0.2 seconds after click" tone=bad
```page size=mini
heading: Bakery Queue
line: Now serving: 13 | good
line: Number 12, please come to the counter | bad
button: Next customer
```
```devconsole
= No messages
```
The screen already shows `Now serving: 13`.
:::
::: col title="2. Three Seconds Later" tag="3.4 seconds after click" tone=bad
```page size=mini
heading: Bakery Queue
line: Now serving: 13 | good
line: Last call for number 12 | bad
button: Next customer
```
```devconsole
+ timer reads 12
```
Three seconds after the screen moved to `13`, the timer still reads `12`!
:::
:::

### Rapid clicks: why React's snapshot design prevents cross-click race conditions

Where did the timer get `12` three seconds after `QueueBoard` had already rendered with 13?

JavaScript closures capture references to lexical scope variables at the moment of function instantiation.

**An asynchronous timer does not query current state when it awakens; it evaluates the closed-over scope captured during its creation.** Here is the chronological execution path for a single click:
1. **Click 1 runs Render 1's `handleNext`**: In Render 1, `number` is `12`.
2. **`setTimeout` receives the arrow function**: JavaScript creates the callback inside Render 1's handler. That callback closes over Render 1's `number`, sealing `12` inside itself.
3. **`setTimeout` schedules the timer and returns**: The browser starts a three-second timer, and `handleNext` finishes immediately.
4. **Render 2 updates the screen to `13`**: React calls the component for Render 2 with a new constant `number` equal to 13, committing `Now serving: 13` to the DOM. Render 1's constant stays untouched.
5. **Three seconds later, the browser runs the callback**: The callback evaluates its closure from Render 1 and reads `12`. It updates the announcement to a last call for number `12` and logs `timer reads 12`.

**Snapshot isolation protects applications from race conditions: rapid overlapping clicks run independent timer closures that each retain their own ticket number without colliding.** Now follow what happens when the clerk clicks `Next customer` twice, one second apart:
1. **At 0 seconds, Click 1 runs Render 1's handler**: Here `number` is `12`. It starts Timer 1 sealed with `12`, and moves the screen to `Now serving: 13`.
2. **At 1 second, Click 2 runs Render 2's handler**: Here `number` in Render 2 is `13`. It starts Timer 2 sealed with `13`, and moves the screen to `Now serving: 14` above the customer 13 announcement.
3. **At 3 seconds, Timer 1 fires**: Timer 1 reads its sealed `12`, displays the last call for number 12, and logs `timer reads 12`.
4. **At 4 seconds, Timer 2 fires**: One second after Timer 1, Timer 2 reads its sealed `13`, displays the last call for number 13, and logs `timer reads 13`.

Even though Click 2 occurred before Click 1's timer finished, Click 1's timer was not overwritten by Click 2. Each click preserved its own independent snapshot.

In our bakery queue, the only defect is that both timers lag one number behind because they read `number` instead of the next serving number. When delayed code genuinely needs the latest mutable value across renders, React provides refs (as seen in Lesson 30).

```tree dir=right caption="Two clicks one second apart: each click starts its own three-second timer sealed with that click's snapshot."
Timeline of two clicks one second apart
- +At 0s: Click 1 [Render 1 where `number` is `12`] | Screen moves to **`13`** and starts **Timer 1 sealed with `12`**
- +At 1s: Click 2 [Render 2 where `number` is `13`] | Screen moves to **`14`** and starts **Timer 2 sealed with `13`**
- +At 3s: Timer 1 fires [Opens Render 1 closure] | Announces **`Last call for number 12`** and logs **`timer reads 12`**
- +At 4s: Timer 2 fires [Opens Render 2 closure] | Announces **`Last call for number 13`** and logs **`timer reads 13`**
```

> [!PRINCIPLE]
> **Principle 3: Asynchronous Timers Keep the Snapshot of the Click That Created Them**
>
> *A state variable's value never changes within a render, even inside delayed code such as `setTimeout` that runs seconds after the screen has updated.*
>
> When an event handler starts a timer with `setTimeout`, the callback function inside `setTimeout` closes over the state snapshot of the render that created the handler. Even if React renders new values onto the screen while the timer is waiting, the timer still reads the value from the click that started it. That keeps each click's delayed work tied to its own click rather than mixing up overlapping clicks.
>
> **DO THIS:**
> ```jsx
> function handleNext() {
>   setNumber(number + 1);
>   setTimeout(() => {
>     ~console.log('timer reads ' + number);~ // Expected: closes over this render's snapshot 12 and logs 12 after 3 seconds
>   }, 3000);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleNext() {
>   setNumber(number + 1);
>   setTimeout(() => {
>     ~setAnnouncement('Last call for number ' + number);~ // **WRONG:** waiting 3 seconds does NOT update number to 13; it still reads 12!
>   }, 3000);
> }
> ```

---

## 4. Principle 4: Store the Next Value in a Local Constant Before Calling the Setter

### Local state buffering: computing nextNumber once for all consumers

To use the upcoming state value immediately inside the click handler, compute it once in a local constant before calling the setter.

Look at the official troubleshooting pattern from the React documentation:

```jsx title="Calculating nextCount once in a local constant before calling setCount"
const [count, setCount] = useState(0);

function handleClick() {
  ~const nextCount = count + 1;~ // 1. Calculate the next value once in a local constant
  setCount(nextCount);
  ~console.log(count);~ // 2. Still 0: the old snapshot of this render
  ~console.log(nextCount);~ // 3. Prints 1 right away!
}
```

Two mechanics govern this pattern:
1. **Identical state dispatch**: Passing `nextCount` delivers the exact same value to React as passing `count + 1` to the setter. Both hand the number `1` to React for the next render.
2. **Local variable buffering**: Creating `nextCount` does not alter `count`. The state variable `count` remains frozen at `0` for this render. Meanwhile, `nextCount` buffers the calculated value so any line in the handler can read it immediately.

Think of `nextCount` as writing the new ticket number on a note in your hand before sending a copy to the kitchen. Because you keep that note in your hand, you can read `13` into the microphone right away. You can also pass that same `13` into the delayed timer.

```tree caption="Saving const nextCount = count + 1 gives both setCount and the rest of the handler the new value right away."
Reading `count` again vs. saving `const nextCount = count + 1`
- !Read `count` after `setCount` [Call `setCount` then log `count`] | `count` is still **this render's old snapshot `0`** | Prints **`0`**
- +Save `nextCount` first [`const nextCount = count + 1` then pass `nextCount`] | Both `setCount` and later lines read **`nextCount`** | `count` stays `0`, while `nextCount` prints **`1` right away**
```

### Complete synchronization: immediate announcement and delayed timer both receive 13

Let us apply this fix to our queue board file. On the very first line of `handleNext`, calculate the next ticket number once in `nextNumber`. Then pass `nextNumber` to `setNumber`, to the immediate announcement, to the Console log, and into the three-second timer:

```jsx title="src/components/QueueBoard.jsx" startLine="9"
  function handleNext() {
    ~const nextNumber = number + 1;~ // 1. Calculate 13 once at the start of the click
    ~setNumber(nextNumber);~ // 2. Pass 13 to React for the next render
    ~setAnnouncement('Number ' + nextNumber + ', please come to the counter');~ // 3. Immediate announcement uses 13
    console.log(number, nextNumber);
    setTimeout(() => {
      setAnnouncement('Last call for number ' + nextNumber);
      console.log('timer reads ' + nextNumber);
    }, 3000);
  }
```

**Local state buffering decouples subsequent calculations from the current render's frozen snapshot, guaranteeing that immediate announcements and delayed timers use the identical next value.** Here is how `nextNumber` resolves execution across all consumers:
1. **First line of `handleNext`**: In Render 1 where `number` is 12, JavaScript adds 1 and creates the local constant `nextNumber` with the value 13.
2. **Passing `nextNumber` to `setNumber`**: Hands `13` to React so the next render will display `Now serving: 13`.
3. **Immediate `setAnnouncement` and `console.log`**: Reads `nextNumber`, which is 13, and sets the announcement for customer `13`. The Console prints `12 13`, displaying the old snapshot next to the calculated next value.
4. **`setTimeout` closes over `nextNumber`**: Because `nextNumber` was created inside this click, the timer callback closes over it with the value 13. Three seconds later, the timer sets the last call for customer 13 and logs `timer reads 13`.
5. **React commits Render 2**: Right after `handleNext` finishes, the screen shows `Now serving: 13` above the announcement for customer 13. Three seconds later, it updates to the last call for customer `13`. Both displays remain synchronized at every moment.

::: row caption="Before and after Principle 4, right after one click: reading number leaves the announcement one behind, while nextNumber keeps every line in sync."
::: col title="Before: Reading number" tag="calls customer 12 for 13" tone=bad
```page size=mini
heading: Bakery Queue
line: Now serving: 13 | good
line: Number 12, please come to the counter | bad
button: Next customer
```
```devconsole
+ 12
```
Right after the click, the announcement and the Console lag one number behind.
:::
::: col title="After: Using nextNumber" tag="calls customer 13 for 13" tone=good
```page size=mini
heading: Bakery Queue
line: Now serving: 13 | good
line: Number 13, please come to the counter | good
button: Next customer
```
```devconsole
+ 12 13
```
Right after the click, the announcement uses `13`, and the Console shows the old number next to the new one.
:::
:::

**Buffering the next value in a local constant ensures that every rapid click and its delayed timers announce the exact customer number without falling behind.** Here is the timeline when the clerk clicks `Next customer` twice, one second apart:
1. **Click 1** calculates `nextNumber` as 13, displays customer 13 on screen, logs `12 13`, and seals 13 inside Timer 1.
2. **One second later, Click 2** runs in Render 2 where `number` is `13`. It calculates its own `nextNumber` as 14, displays customer 14 on screen, logs `13 14`, and seals 14 inside Timer 2.
3. **Three seconds after Click 1**, Timer 1 fires and displays the last call for customer `13`, logging `timer reads 13`.
4. **One second after that**, Timer 2 fires and displays the last call for customer `14`, logging `timer reads 14`.

Every customer receives their exact ticket announcement, both immediately and on the three-second reminder.

Distinguish local constant buffering from functional state updaters:
- **Local Constant Buffering**: Use local constant buffering whenever the current click handler needs to read the upcoming value immediately for secondary state, logs, network calls, or timers.
- **Functional State Updaters**: Use an updater function when a single event handler needs to queue multiple consecutive updates to the same state variable (as seen in Lesson 16).

> [!PRINCIPLE]
> **Principle 4: Store the Next Value in a Local Constant Before Calling the Setter**
>
> *When a handler needs the next value right away, calculate it once in a constant like `nextNumber` and pass it to the setter and every other line.*
>
> You do not need to wait for React to re-render to know what value you handed to `setNumber`. Store that calculation in a local constant at the top of the handler. Pass that constant to `setNumber`, to secondary state updates, and into delayed timers so every immediate and asynchronous action uses the next value.
>
> **DO THIS:**
> ```jsx
> function handleNext() {
>   ~const nextNumber = number + 1;~ // 1. Calculate 13 once in a constant
>   ~setNumber(nextNumber);~ // 2. Pass nextNumber to the setter
>   ~setAnnouncement('Number ' + nextNumber + ', please come to the counter');~ // 3. Reuse nextNumber everywhere
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleNext() {
>   setNumber(number + 1);
>   ~setAnnouncement('Number ' + number + ', please come to the counter');~ // **WRONG:** re-reading number gives the old snapshot 12!
> }
> ```

---

## Architectural Synthesis: The Complete Snapshot Lifecycle

### The unified project files

Here is our main application file that renders the bakery queue board:

```jsx title="src/App.jsx"
import ~QueueBoard~ from './components/QueueBoard.jsx'; // 1. Imports QueueBoard from the components folder

export default function ~App~() { // 2. Called 1st by React when the page loads
  return <QueueBoard />;
}
```

And here is the complete queue board file, where `nextNumber` drives the serving number, the counter announcement, and the three-second last call:

```jsx title="src/components/QueueBoard.jsx"
import { useState } from 'react';

export default function ~QueueBoard~() { // 3. Called 2nd by React on initial load, and again on each state render
  const [number, setNumber] = useState(12);
  const [announcement, setAnnouncement] = useState(
    'Welcome! Please take a number.'
  );

  function handleNext() {
    ~const nextNumber = number + 1;~ // 4. Computes the next ticket number once per click
    setNumber(nextNumber);
    setAnnouncement('Number ' + nextNumber + ', please come to the counter');
    console.log(number, nextNumber);
    setTimeout(() => {
      ~setAnnouncement('Last call for number ' + nextNumber);~ // 5. Timer closes over nextNumber from this click
      console.log('timer reads ' + nextNumber);
    }, 3000);
  }

  return (
    <main>
      <h1>Bakery Queue</h1>
      <p className="now-serving">Now serving: {number}</p>
      <p className="announcement">{announcement}</p>
      <button className="next-btn" onClick={handleNext}>
        Next customer
      </button>
    </main>
  );
}
```

### End-to-end execution flow: from click dispatcher to synchronized audio-visual state

When the page loads, React calls `App` first and `QueueBoard` second with the serving number starting at 12. When the clerk clicks the next button, `handleNext` calculates `nextNumber` as 13 and updates both state values for the next render. It also starts the three-second timer closed over `nextNumber`:

::: row caption="The finished Bakery Queue board right after clicking Next customer once, and three seconds later when the last-call timer fires."
::: col title="1. Right After Click 1" tag="immediate announcement" tone=good
```page size=mini
heading: Bakery Queue
line: Now serving: 13 | good
line: Number 13, please come to the counter | good
button: Next customer
```
```devconsole
+ 12 13
```
Right after the click, both lines on the board show `13`.
:::
::: col title="2. Three Seconds Later" tag="last-call timer fires" tone=good
```page size=mini
heading: Bakery Queue
line: Now serving: 13 | good
line: Last call for number 13 | good
button: Next customer
```
```devconsole
+ 12 13
+ timer reads 13
```
Three seconds later, the timer closed over `nextNumber` updates the announcement to the last call for number `13`.
:::
:::

```tree caption="How React renders App and QueueBoard, and how Click 1 uses its snapshot constants number and nextNumber."
`App` [1. Root component] | Returns `<QueueBoard />`
- +`QueueBoard` on Render 1 [`number` is `12`] | Renders `Now serving: 12` and creates `handleNext` #1 closed over `12`
  - +Click 1 runs `handleNext` #1 [`nextNumber` is `13`] | Calls `setNumber` and `setAnnouncement` with `13`, and logs `12 13`
  - +`QueueBoard` on Render 2 [`number` is `13`] | Commits `Now serving: 13` and `Number 13, please come to the counter`
  - +Timer 1 after 3 seconds [Closed over `nextNumber = 13`] | Commits `Last call for number 13` and logs `timer reads 13`
```

| Aspect | The Plain JavaScript Habit | The React Rule |
| :--- | :--- | :--- |
| **Calling the setter** | Expect calling `setNumber` to mutate `number` in place like `number = number + 1` | Calling `setNumber` stores the new value in React for the next render and leaves `number` untouched in this call |
| **Reading before vs. after the setter** | Move a read line above `setNumber` hoping to avoid a timing issue | Every render creates a fixed snapshot and a handler closed over it, so `number` is the same before and after `setNumber` |
| **Waiting with `setTimeout`** | Expect a three-second timer to read the updated state variable from the screen | Delayed functions inside a handler still close over the snapshot of the click that started them |
| **Using the new value right away** | Re-read `number` after `setNumber` and end up one step behind the screen | Calculate `const nextNumber = number + 1` once and pass `nextNumber` to the setter and every other line |

---

## For the Interview

> **The Interview Question:** Why does state appear frozen inside a render, even right after you set it?

### How to Answer Clearly in 30 Seconds

"In React, a state variable holds one fixed value for the entire duration of a single render. Each time React calls your component function, it hands that call an immutable snapshot of state from React's internal storage. Three practical rules follow from this:
1. **Setters schedule renders; they do not mutate local constants**: Calling `setNumber` with `number + 1` does not reassign `number` in the running frame. Instead, it queues the next value inside React and requests a new render. Logging `number` right after `setNumber` prints the old snapshot value. The screen updates only after the handler finishes and React executes the next render.
2. **JavaScript closures seal each handler to its render's snapshot**: Every render instantiates new event handlers that close over that render's `const` state variable. Because of closure scope, `number` yields the identical value whether read before the setter, after the setter, or seconds later inside `setTimeout`. This closure isolation prevents race conditions across overlapping clicks. And because React commits updates before handling the next click, a handler never starts with stale state.
3. **Local buffering provides immediate access to the next value**: If an event handler needs the updated state value right away, compute it once in a local constant like `const nextNumber = number + 1`. Pass `nextNumber` to the setter and to any immediate or delayed logic in that handler. If you need to queue multiple state transitions within one event, use an updater function instead."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"If I call `setNumber` with `number + 1` when `number` is `12` and immediately log `number`, why does it print `12`? Would changing `const` to `let` or moving the log line above `setNumber` change anything?"**
   It prints `12` because `setNumber` is a function call that schedules future work inside React. It has no mechanism to mutate the local variable `number` in your executing stack frame. Changing `const [number, setNumber]` to `let [number, setNumber]` changes nothing, because `setNumber` still cannot reassign your local variable. Writing `number = number + 1` directly on a `const` throws `TypeError: Assignment to constant variable` at runtime and halts Vite builds with `[ILLEGAL_REASSIGNMENT]`. Moving the log line above `setNumber` also prints `12`, because `number` holds `12` across the entire render snapshot.
2. **"What happens if you log `number` inside a `setTimeout` callback that runs three seconds after calling `setNumber`, long after the screen already shows `13`? Is that behavior a flaw in React?"**
   Even three seconds later, when the screen shows `13`, the timer callback still prints `12`. The arrow function passed to `setTimeout` was created inside the first render's click handler, closing over that render's `number` constant. Rather than being a flaw, this snapshot isolation protects applications from race conditions. If a user clicks repeatedly or edits another input while a timer is counting down, each callback preserves the exact values from the moment it was scheduled. When asynchronous code genuinely needs the latest mutable value across renders, you store it in a ref with `useRef`.
3. **"How do you use the new state value right away inside the same event handler, and can a click handler ever start with a stale state value?"**
   To use the new value right away, calculate it once in a local constant before calling the setter, such as `const nextNumber = number + 1`. Pass `nextNumber` to `setNumber`, to secondary state setters, and into any `setTimeout` callback. And no, a click handler never starts with a stale value on the next click. React processes state updates, renders the new component tree, commits DOM changes, and attaches the new render's event handlers before the browser processes subsequent user click events.

```tree dir=right caption="Interview summary: why reading number after setNumber gives the old snapshot, and how nextNumber gives the new value right away."
How to use the next state value inside the same event handler
- !Read `number` again after `setNumber` [Call `setNumber` then read `number`] | Closure reads **this render's old snapshot `12`**, even inside `setTimeout`
- +Save `const nextNumber = number + 1` first [Pass `nextNumber` to `setNumber` and later lines] | Local constant holds **`13` right away** for setters, logs, and timers in that click
```
